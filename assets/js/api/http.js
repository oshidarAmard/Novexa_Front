/* ============================================================
   NOVEXA ERP — HTTP CLIENT (api/http.js)
   A small axios-like wrapper around fetch():
     - attaches the JWT bearer token to every request
     - auto-refreshes the token once on a 401 and retries the call
     - forces logout if the refresh itself fails
     - unwraps the backend's Result<T> pattern:
         { isSuccess, message, data, errors }
       so callers just get back `data` (or a thrown error object)
     - normalizes every failure into a Persian-friendly error shape:
         { isSuccess:false, message, errors, status }
   Depends on: api/config.js (must load before this file)
   ============================================================ */
(function (global) {
  'use strict';

  const CFG = global.NOVEXA_API_CONFIG || {};

  function getAccessToken() { return localStorage.getItem(CFG.accessTokenKey); }
  function getRefreshToken() { return localStorage.getItem(CFG.refreshTokenKey); }
  function setTokens(accessToken, refreshToken) {
    if (accessToken) localStorage.setItem(CFG.accessTokenKey, accessToken);
    if (refreshToken) localStorage.setItem(CFG.refreshTokenKey, refreshToken);
  }
  function clearTokens() {
    localStorage.removeItem(CFG.accessTokenKey);
    localStorage.removeItem(CFG.refreshTokenKey);
  }

  function redirectToLogin() {
    clearTokens();
    const inPages = location.pathname.includes('/pages/');
    location.href = (inPages ? '../' : '') + 'index.html';
  }

  // Ensures concurrent 401s only trigger a single refresh call.
  let refreshInFlight = null;
  function refreshAccessToken() {
    if (refreshInFlight) return refreshInFlight;
    refreshInFlight = (async () => {
      const rt = getRefreshToken();
      if (!rt) throw new Error('no-refresh-token');
      const res = await fetch(CFG.baseURL + CFG.auth.refreshToken, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: rt })
      });
      if (!res.ok) throw new Error('refresh-failed');
      const json = await res.json().catch(() => null);
      const data = (json && json.data) || json || {};
      if (!data.accessToken) throw new Error('refresh-bad-response');
      setTokens(data.accessToken, data.refreshToken);
      return data.accessToken;
    })();
    refreshInFlight.finally(() => { refreshInFlight = null; });
    return refreshInFlight;
  }

  function normalizeFailure(status, json) {
    const message =
      (json && json.message) ||
      (json && json.title) ||
      (json && json.detail) ||
      'خطایی در ارتباط با سرور رخ داد.';
    let errors = (json && json.errors) || [];
    if (!errors.length && json && json.detail) errors = [json.detail];
    return { isSuccess: false, message, errors, status, raw: json };
  }

  async function request(path, options) {
    options = options || {};
    const headers = Object.assign(
      { 'Content-Type': 'application/json' },
      options.headers || {}
    );
    const token = getAccessToken();
    if (token) headers['Authorization'] = 'Bearer ' + token;

    let res;
    try {
      res = await fetch(CFG.baseURL + path, Object.assign({}, options, { headers }));
    } catch (networkErr) {
      throw {
        isSuccess: false,
        message: 'ارتباط با سرور برقرار نشد. اتصال شبکه را بررسی کنید.',
        errors: [String((networkErr && networkErr.message) || networkErr)],
        status: 0
      };
    }

    // Auto-refresh once on 401, then retry the original call.
    if (res.status === 401 && !options._retried) {
      try {
        await refreshAccessToken();
        return request(path, Object.assign({}, options, { _retried: true }));
      } catch (e) {
        redirectToLogin();
        throw { isSuccess: false, message: 'نشست شما منقضی شده است. لطفاً دوباره وارد شوید.', errors: [], status: 401 };
      }
    }

    let json = null;
    const text = await res.text().catch(() => '');
    if (text) {
      try { json = JSON.parse(text); } catch (e) { json = null; }
    }

    if (!res.ok) {
      throw normalizeFailure(res.status, json);
    }

    // Backend Result<T> pattern: { isSuccess, message, data, errors }
    if (json && typeof json.isSuccess === 'boolean') {
      if (!json.isSuccess) {
        throw { isSuccess: false, message: json.message || 'عملیات ناموفق بود.', errors: json.errors || [], status: res.status };
      }
      return json.data;
    }

    // Some endpoints (per the OpenAPI spec) return raw objects/arrays directly.
    return json;
  }

  function qs(params) {
    if (!params) return '';
    const parts = [];
    Object.keys(params).forEach((k) => {
      const v = params[k];
      if (v === undefined || v === null || v === '') return;
      parts.push(encodeURIComponent(k) + '=' + encodeURIComponent(v));
    });
    return parts.length ? '?' + parts.join('&') : '';
  }

  const http = {
    get: (path, params) => request(path + qs(params), { method: 'GET' }),
    post: (path, body) => request(path, { method: 'POST', body: body !== undefined ? JSON.stringify(body) : undefined }),
    put: (path, body) => request(path, { method: 'PUT', body: body !== undefined ? JSON.stringify(body) : undefined }),
    patch: (path, body) => request(path, { method: 'PATCH', body: body !== undefined ? JSON.stringify(body) : undefined }),
    delete: (path) => request(path, { method: 'DELETE' }),
    setTokens, clearTokens, getAccessToken, getRefreshToken,
    redirectToLogin
  };

  global.NovexaHttp = http;
})(window);
