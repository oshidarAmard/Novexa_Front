/* ============================================================
   NOVEXA ERP — HEAD (head.js)
   Injects fonts + CSS + base scripts so every page stays lean.
   Include <script src="assets/js/head.js"></script> in <head>.
   ============================================================ */
(function () {
  'use strict';
  const base = (function () {
    const s = document.currentScript;
    return s ? s.getAttribute('data-base') || '' : '';
  })();
  const root = base || './';

  // fonts
  const l1 = document.createElement('link');
  l1.rel = 'preconnect'; l1.href = 'https://cdn.jsdelivr.net'; document.head.appendChild(l1);
  const lf = document.createElement('link');
  lf.rel = 'stylesheet';
  lf.href = 'https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css';
  document.head.appendChild(lf);

  const css = ['design-system','layout','components','tables','forms','pages','responsive'];
  css.forEach(name => {
    const l = document.createElement('link');
    l.rel = 'stylesheet'; l.href = root + 'assets/css/' + name + '.css';
    document.head.appendChild(l);
  });

  // theme before paint (avoid flash)
  const t = localStorage.getItem('novexa-theme');
  if (t === 'dark') document.documentElement.setAttribute('data-theme', 'dark');

  // core scripts (loaded in sequence, dispatch event when ready)
  const scripts = ['icons.js','data.js','charts.js','api/config.js','api/http.js','api/auth.js','api/auth-guard.js','api/services.js'];
  function loadScript(name, cb) {
    const s = document.createElement('script');
    s.src = root + 'assets/js/' + name;
    s.async = false;
    s.onload = cb;
    s.onerror = cb;
    document.head.appendChild(s);
  }
  let i = 0;
  (function next() {
    if (i >= scripts.length) {
      // signal that core libraries are ready
      window.dispatchEvent(new CustomEvent('novexa:core-ready'));
      window.__novexaCoreReady = true;
      return;
    }
    loadScript(scripts[i++], next);
  })();
})();
