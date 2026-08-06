/* ============================================================
   NOVEXA ERP — API CONFIG (api/config.js)
   Central place to point the frontend at the real backend.
   ============================================================ */
(function (global) {
  'use strict';

  global.NOVEXA_API_CONFIG = {
    // Local dev backend. Override by setting window.NOVEXA_API_BASE_URL before this
    // script loads (e.g. in a small env.js) when deploying to staging/production.
    baseURL: global.NOVEXA_API_BASE_URL || 'https://localhost:5001',

    // localStorage keys used to persist the JWT pair
    accessTokenKey: 'novexa_access_token',
    refreshTokenKey: 'novexa_refresh_token',
    userKey: 'novexa_user',

    // Auth module is not implemented on the backend yet (confirmed by the team).
    // These are the agreed-upon FUTURE routes — wire them up as soon as the
    // Auth controller ships. Nothing else in the frontend needs to change.
    auth: {
      login: '/api/auth/login',
      refreshToken: '/api/auth/refresh-token',
      logout: '/api/auth/logout',
      me: '/api/auth/me'
    },

    // Master switch for route protection. The real login endpoint doesn't exist
    // yet, so redirecting unauthenticated users would break every page right
    // now. Flip this to `true` the day POST /api/auth/login goes live — every
    // page that includes assets/js/api/auth-guard.js will start enforcing it
    // immediately, no other change needed.
    enforceAuth: false
  };
})(window);
