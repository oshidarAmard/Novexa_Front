/* ============================================================
   NOVEXA ERP — AUTH CONTEXT (api/auth.js)
   Depends on: api/config.js, api/http.js

   This is the full authentication *infrastructure* — token/user
   storage, a login/refresh/logout/me API surface, and a tiny
   pub/sub layer so any page can react to auth-state changes (the
   multi-page-app equivalent of a React AuthContext).

   None of it talks to a real backend yet: POST /api/auth/login does
   not exist on the API. Every call below is already wired to the
   routes the backend team confirmed will be used (see config.js →
   CFG.auth), so connecting this for real is a one-line change later
   — remove the TODO comments once the Auth controller ships. No
   calling page needs to change.
   ============================================================ */
(function (global) {
  'use strict';
  const http = global.NovexaHttp;
  const CFG = global.NOVEXA_API_CONFIG;

  /* ---------- User storage (the JWT pair itself lives in http.js) ---------- */
  function getUser() {
    try {
      const raw = localStorage.getItem(CFG.userKey);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function setUser(user) {
    try {
      if (user) localStorage.setItem(CFG.userKey, JSON.stringify(user));
      else localStorage.removeItem(CFG.userKey);
    } catch (e) {}
  }

  function isAuthenticated() {
    return !!http.getAccessToken();
  }

  /* ---------- Pub/sub (AuthContext equivalent) ----------
     Pages here do full navigations, not client-side routing, so there's no
     shared React tree to re-render. "Reactivity" instead means:
       1) code in the SAME page can react immediately after login/logout, and
       2) OTHER open tabs pick up the change via the storage event.
     Usage: const unsubscribe = NovexaAuth.subscribe(({isAuthenticated, user}) => {...}); */
  const listeners = new Set();
  function notify() {
    const snapshot = { isAuthenticated: isAuthenticated(), user: getUser() };
    listeners.forEach((fn) => { try { fn(snapshot); } catch (e) {} });
  }
  function subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }
  window.addEventListener('storage', (e) => {
    if (e.key === CFG.accessTokenKey || e.key === CFG.userKey) notify();
  });

  /* ---------- API calls (placeholders — backend Auth module not implemented yet) ---------- */

  /** TODO: confirm request field names (assumed usernameOrEmail/password) and
   *  response shape (assumed { accessToken, refreshToken, user }) once
   *  POST /api/auth/login ships. Nothing else in the app needs to change. */
  async function login(usernameOrEmail, password, rememberMe) {
    const data = await http.post(CFG.auth.login, { usernameOrEmail, password, rememberMe: !!rememberMe });
    http.setTokens(data.accessToken, data.refreshToken);
    setUser(data.user || null);
    notify();
    return data;
  }

  /** TODO: GET /api/auth/me — confirm the returned user shape (fullName,
   *  roleName, initials, roles[], permissions[] are assumed below). */
  async function me() {
    const user = await http.get(CFG.auth.me);
    setUser(user);
    notify();
    return user;
  }

  /** Always clears the local session, even if the server call fails or the
   *  endpoint doesn't exist yet — a user must always be able to "log out". */
  function logout() {
    return http.post(CFG.auth.logout).catch(() => {}).finally(() => {
      http.clearTokens();
      setUser(null);
      notify();
      const inPages = location.pathname.includes('/pages/');
      location.href = (inPages ? '../' : '') + 'index.html';
    });
  }

  /* ---------- Permission / Role guards ----------
     The backend hasn't defined the shape of user.roles / user.permissions
     yet. These are ready to use the moment it does, e.g.:
       if (!NovexaAuth.hasPermission('products.delete')) hideDeleteButton();
       if (!NovexaAuth.hasRole('Admin')) NovexaRouteGuard.deny(); */
  function hasRole(role) {
    const u = getUser();
    return !!(u && Array.isArray(u.roles) && u.roles.includes(role));
  }
  function hasPermission(permission) {
    const u = getUser();
    return !!(u && Array.isArray(u.permissions) && u.permissions.includes(permission));
  }

  global.NovexaAuth = {
    login, logout, me,
    isAuthenticated,
    currentUser: getUser,
    hasRole, hasPermission,
    subscribe
  };
})(window);
