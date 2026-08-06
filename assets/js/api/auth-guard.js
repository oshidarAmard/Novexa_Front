/* ============================================================
   NOVEXA ERP — ROUTE GUARD (api/auth-guard.js)
   The multi-page-app equivalent of a React <ProtectedRoute>.

   Runs automatically on every page (loaded by head.js, right after
   api/auth.js) and would redirect unauthenticated visitors to the
   login page — but ONLY once CFG.enforceAuth is switched to `true`
   in api/config.js. Until POST /api/auth/login actually exists on
   the backend, this stays a harmless no-op so every page keeps
   working exactly as it does today.

   Depends on: api/config.js, api/http.js, api/auth.js
   ============================================================ */
(function (global) {
  'use strict';
  const CFG = global.NOVEXA_API_CONFIG;
  const Auth = global.NovexaAuth;
  const http = global.NovexaHttp;
  if (!CFG || !Auth || !http) return;

  // index.html is the login page itself — never guard it.
  const isLoginPage = /(^|\/)index\.html$/.test(location.pathname) || /\/$/.test(location.pathname);

  function enforce() {
    if (!CFG.enforceAuth || isLoginPage) return;
    if (!Auth.isAuthenticated()) http.redirectToLogin();
  }

  /**
   * Per-page permission/role checks, for screens that need something
   * stricter than "just logged in" (e.g. an Admin-only settings page).
   * Both helpers return true while enforceAuth is off, so calling them
   * today is safe and never blocks anything — usage:
   *
   *   if (!NovexaRouteGuard.can('users.manage')) NovexaRouteGuard.deny();
   *   if (!NovexaRouteGuard.isAllowedRole('Admin')) NovexaRouteGuard.deny();
   */
  function can(permission) {
    return !CFG.enforceAuth || Auth.hasPermission(permission);
  }
  function isAllowedRole(role) {
    return !CFG.enforceAuth || Auth.hasRole(role);
  }
  function deny(message) {
    if (global.UI && UI.toast) {
      UI.toast({ type: 'danger', title: 'دسترسی غیرمجاز', message: message || 'شما اجازه‌ی دسترسی به این بخش را ندارید.' });
    }
    const inPages = location.pathname.includes('/pages/');
    setTimeout(() => { location.href = (inPages ? '../' : '') + 'index.html'; }, 800);
  }

  enforce();
  global.NovexaRouteGuard = { can, isAllowedRole, deny };
})(window);
