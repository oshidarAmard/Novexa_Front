/* ============================================================
   NOVEXA ERP — LAYOUT (layout.js)
   Injects sidebar + topbar + footer; wires interactions.
   Each page just sets: <body data-page="dashboard">
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Logged-in user (falls back to today's mock values until
     the backend Auth module ships — see assets/js/api/auth.js) ---------- */
  function displayUser() {
    const u = (window.NovexaAuth && NovexaAuth.currentUser()) || null;
    return {
      name: (u && u.fullName) || 'میلاد رضایی',
      role: (u && u.roleName) || 'مدیر سیستم',
      initials: (u && u.initials) || 'م‌ر'
    };
  }

  /* ---------- Nav definition ---------- */
  const NAV = [
    { section: 'اصلی', items: [
      { id:'dashboard', label:'داشبورد', icon:'dashboard', href:'dashboard.html' },
      { id:'analytics', label:'تحلیل و گزارش', icon:'chart', href:'analytics.html' }
    ]},
    { section: 'کاتالوگ', items: [
      { id:'catalog', label:'مدیریت کاتالوگ', icon:'box', href:'products.html', children:[
        { id:'products', label:'محصولات', href:'products.html', badge:'۱۲۸' },
        { id:'categories', label:'دسته‌بندی‌ها', href:'categories.html' },
        { id:'brands', label:'برندهای محصول', href:'brands.html' },
        { id:'device-brands', label:'برندهای دستگاه', href:'device-brands.html' },
        { id:'device-models', label:'مدل‌های دستگاه', href:'device-models.html' },
        { id:'units', label:'واحدهای اندازه‌گیری', href:'units.html' }
      ]}
    ]},
    { section: 'انبار', items: [
      { id:'warehouses', label:'انبارها', icon:'warehouse', href:'warehouses.html' },
      { id:'inventory', label:'موجودی انبار', icon:'layers', href:'inventory.html', badge:'۳۸' },
      { id:'inventory-tx', label:'تراکنش‌های انبار', icon:'activity', href:'inventory-transactions.html' },
      { id:'stock-transfer', label:'انتقال کالا', icon:'move', href:'stock-transfer.html' }
    ]},
    { section: 'تجاری', items: [
      { id:'purchase', label:'خرید', icon:'cart', href:'purchase-orders.html', children:[
        { id:'purchase-orders', label:'سفارشات خرید', href:'purchase-orders.html' },
        { id:'purchase-receives', label:'رسید کالا', href:'purchase-receives.html' }
      ]},
      { id:'sales', label:'فروش', icon:'shopping', href:'sales.html', badge:'۱۲', children:[
        { id:'sales-list', label:'فروشات', href:'sales.html' },
        { id:'sales-invoice', label:'فاکتور فروش', href:'sales-invoice.html' },
        { id:'sales-return', label:'مرجوعی فروش', href:'sales-return.html' },
        { id:'payments', label:'پرداخت‌ها', href:'payments.html' }
      ]},
      { id:'customers', label:'مشتریان', icon:'users', href:'customers.html' },
      { id:'suppliers', label:'تأمین‌کنندگان', icon:'truck', href:'suppliers.html' }
    ]},
    { section: 'مالی و گزارش', items: [
      { id:'accounting', label:'مالی و حسابداری', icon:'calculator', href:'payments.html' },
      { id:'reports', label:'گزارش‌ها', icon:'file', href:'reports.html' }
    ]},
    { section: 'مدیریت سیستم', items: [
      { id:'admin', label:'مدیریت کاربران', icon:'shield', href:'users.html', children:[
        { id:'users', label:'کاربران', href:'users.html' },
        { id:'roles', label:'نقش‌ها', href:'roles.html' },
        { id:'permissions', label:'دسترسی‌ها', href:'permissions.html' },
        { id:'audit', label:'لاگ‌های ممیزی', href:'audit-logs.html' }
      ]},
      { id:'notifications', label:'اعلان‌ها', icon:'bell', href:'notifications.html', badge:'۳' },
      { id:'settings', label:'تنظیمات', icon:'settings', href:'settings.html' },
      { id:'profile', label:'پروفایل من', icon:'user', href:'profile.html' }
    ]}
  ];

  /* ---------- Resolve active path ---------- */
  function activePage() {
    const p = document.body.getAttribute('data-page');
    return p || (location.pathname.split('/').pop() || 'dashboard.html').replace('.html', '');
  }
  function currentFile() {
    return location.pathname.split('/').pop() || 'dashboard.html';
  }

  /* ---------- Build sidebar HTML ---------- */
  function sidebarHTML() {
    const current = activePage();
    const curFile = currentFile();
    let navHtml = '';
    NAV.forEach(sec => {
      navHtml += `<div class="nav-section"><div class="nav-section__title">${sec.section}</div>`;
      sec.items.forEach(item => {
        const hasChildren = item.children && item.children.length;
        const isActiveParent = hasChildren && item.children.some(c => c.id === current || c.href === curFile);
        const isActive = item.id === current || item.href === curFile || isActiveParent;
        const open = isActiveParent ? ' is-open' : '';
        const activeCls = isActive ? ' is-active' : '';
        const badge = item.badge ? `<span class="nav-item__badge">${item.badge}</span>` : '';
        const chev = hasChildren ? `<span class="nav-item__chev">${Icon('chevron', 16)}</span>` : '';
        const href = item.href || '#';
        navHtml += `
          <a class="nav-item${activeCls}${open}" href="${href}" data-toggle="${hasChildren ? 'nav' : ''}" data-id="${item.id}">
            <span class="nav-item__icon">${Icon(item.icon, 20)}</span>
            <span class="nav-item__label">${item.label}</span>
            ${badge}${chev}
          </a>`;
        if (hasChildren) {
          navHtml += `<div class="nav-sub">`;
          item.children.forEach(c => {
            const cActive = (c.id === current || c.href === curFile) ? ' is-active' : '';
            navHtml += `<a class="nav-sub__item${cActive}" href="${c.href}"><span>${c.label}</span>${c.badge ? `<span class="nav-item__badge badge-soft">${c.badge}</span>` : ''}</a>`;
          });
          navHtml += `</div>`;
        }
      });
      navHtml += `</div>`;
    });

    return `
    <aside class="app__sidebar sidebar">
      <div class="sidebar__brand">
        <div class="brand-logo">${Icon('box', 22)}</div>
        <div class="brand-text">
          <strong>نوواکسا</strong>
          <span>ERP سامانه سازمانی</span>
        </div>
      </div>
      <div class="sidebar__search">
        <div class="global-search" style="width:100%;max-width:none;height:36px;background:var(--surface-2);">
          ${Icon('search', 16)}
          <input type="text" placeholder="جستجوی ماژول..." id="navSearch">
        </div>
      </div>
      <nav class="sidebar__nav" id="sidebarNav">${navHtml}</nav>
      <div class="sidebar__foot">
        <div class="user-chip" id="userChip">
          <div class="avatar online">${displayUser().initials}</div>
          <div class="user-chip__info">
            <strong>${displayUser().name}</strong>
            <span>${displayUser().role}</span>
          </div>
          <button class="icon-btn btn-sm" title="خروج" id="logoutBtn">${Icon('logout', 18)}</button>
        </div>
      </div>
    </aside>
    <div class="sidebar-backdrop" id="sidebarBackdrop"></div>`;
  }

  /* ---------- Build topbar HTML ---------- */
  function topbarHTML() {
    const current = activePage();
    const crumb = buildCrumb(current);
    return `
    <header class="app__topbar topbar">
      <div class="topbar__start">
        <button class="icon-btn show-tablet" id="mobileMenu">${Icon('menu', 22)}</button>
        <span class="page-title-mobile">${crumb.title}</span>
      </div>
      <div class="topbar__center hide-tablet">
        <div class="global-search" id="globalSearchBox">
          ${Icon('search', 18)}
          <input type="text" placeholder="جستجو در نوواکسا... (محصول، مشتری، فاکتور)" id="globalSearch">
          <kbd>Ctrl K</kbd>
        </div>
      </div>
      <div class="topbar__end">
        <button class="icon-btn hide-mobile" data-tooltip="ایجاد سریع" id="quickCreate">${Icon('plus', 20)}</button>
        <button class="icon-btn hide-mobile" data-tooltip="پیام‌ها" id="msgBtn">${Icon('message', 20)}<span class="count">۵</span></button>
        <button class="icon-btn" data-tooltip="اعلان‌ها" id="bellBtn">${Icon('bell', 20)}<span class="count">۳</span></button>
        <button class="icon-btn" data-tooltip="تغییر تم" id="themeBtn">${Icon(document.documentElement.getAttribute('data-theme') === 'dark' ? 'sun' : 'moon', 20)}</button>
        <div class="divider-v hide-mobile"></div>
        <!-- User menu (dropdown) -->
        <div class="dropdown" id="userDropdown">
          <button class="user-chip hide-mobile" data-dropdown style="width:auto;">
            <div class="avatar online avatar-sm">${displayUser().initials}</div>
            <div class="user-chip__info">
              <strong>${displayUser().name}</strong>
              <span>${displayUser().role}</span>
            </div>
            ${Icon('chevron-down', 16)}
          </button>
          <!-- compact avatar trigger for mobile -->
          <button class="icon-btn show-tablet" data-dropdown data-tooltip="حساب کاربری">
            <div class="avatar avatar-sm">${displayUser().initials}</div>
          </button>
          <div class="dropdown__menu align-end">
            <div class="dropdown__label">حساب کاربری</div>
            <a class="dropdown__item" href="profile.html">${Icon('user', 16)} پروفایل من</a>
            <a class="dropdown__item" href="settings.html">${Icon('settings', 16)} تنظیمات</a>
            <a class="dropdown__item" href="audit-logs.html">${Icon('activity', 16)} فعالیت‌های من</a>
            <div class="dropdown__sep"></div>
            <button class="dropdown__item" id="topLogoutBtn" style="color:var(--danger);">${Icon('logout', 16)} خروج از حساب</button>
          </div>
        </div>
      </div>

      <!-- Notification Panel -->
      <div class="notif-panel" id="notifPanel">
        <div class="notif-panel__head">
          <h4 style="font-size:var(--fs-md);font-weight:600;">اعلان‌ها</h4>
          <button class="btn btn-text btn-sm" id="markAllRead">علامت‌گذاری همه</button>
        </div>
        <div class="notif-panel__list" id="notifList"></div>
        <div class="notif-panel__foot">
          <a href="notifications.html" class="btn btn-text btn-block">مشاهده همه اعلان‌ها</a>
        </div>
      </div>

      <!-- Global search panel -->
      <div class="search-panel" id="searchPanel">
        <div class="search-panel__head">
          ${Icon('search', 18)}
          <input type="text" placeholder="جستجو..." id="searchPanelInput">
          <kbd style="font-family:var(--font-family);font-size:var(--fs-xs);background:var(--surface-2);border:1px solid var(--border);border-radius:4px;padding:2px 6px;">Esc</kbd>
        </div>
        <div id="searchPanelBody"></div>
      </div>
    </header>`;
  }

  /* ---------- Crumb resolver ---------- */
  function buildCrumb(page) {
    const map = {
      dashboard: { t:'داشبورد', c:['خانه','داشبورد'] },
      analytics: { t:'تحلیل و گزارش', c:['خانه','گزارش‌ها','تحلیل'] },
      products: { t:'محصولات', c:['کاتالوگ','محصولات'] },
      'product-create': { t:'ایجاد محصول', c:['کاتالوگ','محصولات','ایجاد'] },
      'product-detail': { t:'جزئیات محصول', c:['کاتالوگ','محصولات','جزئیات'] },
      categories: { t:'دسته‌بندی‌ها', c:['کاتالوگ','دسته‌بندی‌ها'] },
      brands: { t:'برندهای محصول', c:['کاتالوگ','برندها'] },
      'device-brands': { t:'برندهای دستگاه', c:['کاتالوگ','برندهای دستگاه'] },
      'device-models': { t:'مدل‌های دستگاه', c:['کاتالوگ','مدل‌ها'] },
      units: { t:'واحدهای اندازه‌گیری', c:['کاتالوگ','واحدها'] },
      warehouses: { t:'انبارها', c:['انبار','انبارها'] },
      inventory: { t:'موجودی انبار', c:['انبار','موجودی'] },
      'inventory-tx': { t:'تراکنش‌های انبار', c:['انبار','تراکنش‌ها'] },
      'stock-transfer': { t:'انتقال کالا', c:['انبار','انتقال'] },
      'purchase-orders': { t:'سفارشات خرید', c:['خرید','سفارشات'] },
      'purchase-receives': { t:'رسید کالا', c:['خرید','رسید'] },
      sales: { t:'فروشات', c:['فروش','فروشات'] },
      'sales-invoice': { t:'فاکتور فروش', c:['فروش','فاکتور'] },
      'sales-return': { t:'مرجوعی فروش', c:['فروش','مرجوعی'] },
      payments: { t:'پرداخت‌ها', c:['مالی','پرداخت‌ها'] },
      customers: { t:'مشتریان', c:['تجاری','مشتریان'] },
      suppliers: { t:'تأمین‌کنندگان', c:['تجاری','تأمین‌کنندگان'] },
      reports: { t:'گزارش‌ها', c:['گزارش‌ها'] },
      users: { t:'کاربران', c:['مدیریت','کاربران'] },
      roles: { t:'نقش‌ها', c:['مدیریت','نقش‌ها'] },
      permissions: { t:'دسترسی‌ها', c:['مدیریت','دسترسی‌ها'] },
      'audit-logs': { t:'لاگ‌های ممیزی', c:['مدیریت','ممیزی'] },
      notifications: { t:'اعلان‌ها', c:['تنظیمات','اعلان‌ها'] },
      settings: { t:'تنظیمات', c:['تنظیمات'] },
      profile: { t:'پروفایل من', c:['تنظیمات','پروفایل'] },
      tasks: { t:'کارها', c:['خانه','کارها'] }
    };
    const m = map[page] || { t: page, c: ['خانه', page] };
    return { title: m.t, trail: m.c };
  }

  /* ---------- Footer ---------- */
  function footerHTML() {
    return `
    <footer class="app__footer">
      <div>© ۱۴۰۳ نوواکسا ERP — کلیه حقوق محفوظ است.</div>
      <div class="links hide-mobile">
        <a href="#">مرکز پشتیبانی</a>
        <a href="#">مستندات</a>
        <a href="#">قوانین و مقررات</a>
      </div>
      <div class="ver"><span class="status-dot success"></span> نسخه ۲٫۴٫۰ — سرویس فعال</div>
    </footer>`;
  }

  /* ---------- Mount ---------- */
  function mount() {
    const app = document.getElementById('app') || document.body;
    // Wrap if not already wrapped
    if (!app.classList.contains('app')) {
      const inner = app.innerHTML;
      app.classList.add('app');
      app.innerHTML = `
        ${sidebarHTML()}
        ${topbarHTML()}
        <main class="app__main" id="appMain"></main>
        ${footerHTML()}
      `;
      const content = document.createElement('div');
      content.innerHTML = inner;
      // Take only the workspace content (skip injected scripts/tags)
      const workspace = document.createElement('div');
      workspace.className = 'workspace';
      while (content.firstChild) workspace.appendChild(content.firstChild);
      document.getElementById('appMain').appendChild(workspace);
    } else {
      app.insertAdjacentHTML('afterbegin', sidebarHTML());
      app.insertAdjacentHTML('beforeend', footerHTML());
    }
    renderIcons(document.querySelector('.sidebar'));
    renderIcons(document.querySelector('.topbar'));

    // Restore collapse state
    if (localStorage.getItem('novexa-collapse') === '1') app.classList.add('is-collapsed');

    bind();
    fillNotifs();
  }

  /* ---------- Notifications list ---------- */
  function fillNotifs() {
    const list = document.getElementById('notifList');
    if (!list) return;
    const colorMap = { primary:'var(--color-primary-50);color:var(--color-primary)', success:'var(--success-50);color:var(--success)', warning:'var(--warning-50);color:var(--warning)', danger:'var(--danger-50);color:var(--danger)', info:'var(--info-50);color:var(--info)' };
    list.innerHTML = NOVEXA.NOTIFS.slice(0,6).map(n => `
      <div class="notif-panel__item ${n.unread ? 'unread' : ''}">
        <div class="notif-item__icon" style="background:${colorMap[n.color]}">${Icon(n.icon, 18)}</div>
        <div style="flex:1;min-width:0;">
          <div style="font-weight:600;font-size:var(--fs-sm);">${n.title}</div>
          <div style="font-size:var(--fs-xs);color:var(--text-secondary);margin-top:2px;">${n.body}</div>
          <div style="font-size:var(--fs-xs);color:var(--text-tertiary);margin-top:4px;">${n.time}</div>
        </div>
      </div>`).join('');
    renderIcons(list);
  }

  /* ---------- Global search results ---------- */
  function renderSearch(q) {
    const body = document.getElementById('searchPanelBody');
    if (!body) return;
    q = (q || '').trim();
    if (!q) {
      body.innerHTML = `
        <div class="search-panel__group__title">دسترسی سریع</div>
        <a class="search-panel__item" href="dashboard.html"><span class="ic">${Icon('dashboard', 16)}</span><div><div style="font-size:var(--fs-sm);font-weight:500;">داشبورد</div><div style="font-size:var(--fs-xs);color:var(--text-tertiary);">صفحه اصلی</div></div></a>
        <a class="search-panel__item" href="products.html"><span class="ic">${Icon('box', 16)}</span><div><div style="font-size:var(--fs-sm);font-weight:500;">محصولات</div><div style="font-size:var(--fs-xs);color:var(--text-tertiary);">کاتالوگ محصولات</div></div></a>
        <a class="search-panel__item" href="sales.html"><span class="ic">${Icon('shopping', 16)}</span><div><div style="font-size:var(--fs-sm);font-weight:500;">فروشات</div><div style="font-size:var(--fs-xs);color:var(--text-tertiary);">مدیریت فروش</div></div></a>
        <a class="search-panel__item" href="customers.html"><span class="ic">${Icon('users', 16)}</span><div><div style="font-size:var(--fs-sm);font-weight:500;">مشتریان</div><div style="font-size:var(--fs-xs);color:var(--text-tertiary);">پایگاه مشتریان</div></div></a>
        <div class="search-panel__group__title">اخیراً جستجو شده</div>
        <div class="search-panel__item"><span class="ic">${Icon('clock', 16)}</span><span style="font-size:var(--fs-sm);">فاکتور INV-۱۰۲۸۴</span></div>
        <div class="search-panel__item"><span class="ic">${Icon('clock', 16)}</span><span style="font-size:var(--fs-sm);">گوشی Galaxy S24</span></div>`;
      renderIcons(body);
      return;
    }
    const ql = q.toLowerCase();
    const faQ = NOVEXA.toFa ? q : q;
    const products = NOVEXA.products.filter(p => p.name.includes(q) || p.sku.includes(faQ)).slice(0,3);
    const customers = NOVEXA.customers.filter(c => c.name.includes(q)).slice(0,3);
    const invoices = NOVEXA.sales.filter(s => s.id.includes(faQ) || s.customer.includes(q)).slice(0,3);
    let html = '';
    if (products.length) {
      html += `<div class="search-panel__group__title">محصولات</div>`;
      html += products.map(p => `<a class="search-panel__item" href="products.html"><span class="ic">${Icon('box', 16)}</span><div><div style="font-size:var(--fs-sm);">${highlight(p.name,q)}</div><div style="font-size:var(--fs-xs);color:var(--text-tertiary);">${p.sku}</div></div></a>`).join('');
    }
    if (customers.length) {
      html += `<div class="search-panel__group__title">مشتریان</div>`;
      html += customers.map(c => `<a class="search-panel__item" href="customers.html"><span class="ic">${Icon('user', 16)}</span><div><div style="font-size:var(--fs-sm);">${highlight(c.name,q)}</div><div style="font-size:var(--fs-xs);color:var(--text-tertiary);">${c.code}</div></div></a>`).join('');
    }
    if (invoices.length) {
      html += `<div class="search-panel__group__title">فاکتورها</div>`;
      html += invoices.map(s => `<a class="search-panel__item" href="sales.html"><span class="ic">${Icon('file', 16)}</span><div><div style="font-size:var(--fs-sm);">${highlight(s.id,faQ)}</div><div style="font-size:var(--fs-xs);color:var(--text-tertiary);">${s.customer}</div></div></a>`).join('');
    }
    if (!html) html = `<div class="empty"><div class="empty__icon">${Icon('search', 36)}</div><div class="empty__title">نتیجه‌ای یافت نشد</div><div class="empty__desc">برای «${q}» چیزی پیدا نشد. عبارت دیگری امتحان کنید.</div></div>`;
    body.innerHTML = html;
    renderIcons(body);
  }
  function highlight(text, q){
    if(!q) return text;
    const i = text.indexOf(q);
    if(i<0) return text;
    return text.slice(0,i) + '<mark>' + text.slice(i,i+q.length) + '</mark>' + text.slice(i+q.length);
  }

  /* ---------- Bind events ---------- */
  function bind() {
    const app = document.querySelector('.app');

    // Sidebar collapse (double-click on brand / dedicated button)
    const brand = document.querySelector('.sidebar__brand');
    if (brand) brand.addEventListener('click', (e) => {
      if (e.target.closest('.user-chip')) return;
    });

    // Mobile menu toggle
    const mm = document.getElementById('mobileMenu');
    if (mm) mm.addEventListener('click', () => app.classList.toggle('sidebar-open'));
    const bd = document.getElementById('sidebarBackdrop');
    if (bd) bd.addEventListener('click', () => app.classList.remove('sidebar-open'));

    // Submenu expand
    document.querySelectorAll('[data-toggle="nav"]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        el.classList.toggle('is-open');
      });
    });

    // Nav search filter
    const navSearch = document.getElementById('navSearch');
    if (navSearch) navSearch.addEventListener('input', (e) => {
      const q = e.target.value.trim();
      document.querySelectorAll('#sidebarNav .nav-item, #sidebarNav .nav-sub__item').forEach(it => {
        const txt = it.textContent.trim();
        it.style.display = !q || txt.includes(q) ? '' : 'none';
      });
    });

    // Theme toggle
    const themeBtn = document.getElementById('themeBtn');
    if (themeBtn) themeBtn.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', cur);
      localStorage.setItem('novexa-theme', cur);
      themeBtn.innerHTML = Icon(cur === 'dark' ? 'sun' : 'moon', 20);
      document.dispatchEvent(new CustomEvent('themechange', { detail: cur }));
    });

    // Notification panel
    const bell = document.getElementById('bellBtn');
    const notif = document.getElementById('notifPanel');
    const searchPanel = document.getElementById('searchPanel');
    const toggleNotif = (e) => {
      e.stopPropagation();
      const open = notif.classList.toggle('is-open');
      if (open) searchPanel.classList.remove('is-open');
    };
    if (bell) bell.addEventListener('click', toggleNotif);
    document.getElementById('markAllRead')?.addEventListener('click', () => {
      document.querySelectorAll('.notif-panel__item.unread').forEach(i => i.classList.remove('unread'));
    });

    // Global search open
    const gsBox = document.getElementById('globalSearchBox');
    const gsInput = document.getElementById('globalSearch');
    const openSearch = () => { searchPanel.classList.add('is-open'); notif.classList.remove('is-open'); const sp = document.getElementById('searchPanelInput'); sp.value = gsInput?.value || ''; renderSearch(sp.value); setTimeout(()=>sp.focus(),50); };
    if (gsBox) gsBox.addEventListener('click', openSearch);
    if (gsInput) gsInput.addEventListener('focus', openSearch);
    const spInput = document.getElementById('searchPanelInput');
    if (spInput) spInput.addEventListener('input', (e) => renderSearch(e.target.value));

    document.addEventListener('click', (e) => {
      if (!e.target.closest('#notifPanel') && !e.target.closest('#bellBtn')) notif?.classList.remove('is-open');
      if (!e.target.closest('#searchPanel') && !e.target.closest('#globalSearchBox') && !e.target.closest('#globalSearch')) searchPanel?.classList.remove('is-open');
    });
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openSearch(); }
      if (e.key === 'Escape') { searchPanel?.classList.remove('is-open'); notif?.classList.remove('is-open'); }
    });

    // Logout — clears the JWT/user session (once it exists) and returns to login.
    const doLogout = () => {
      if (window.NovexaAuth) { NovexaAuth.logout(); return; }
      const inPages = location.pathname.includes('/pages/');
      location.href = (inPages ? '../' : '') + 'index.html';
    };
    const logout = document.getElementById('logoutBtn');
    if (logout) logout.addEventListener('click', doLogout);
    const topLogout = document.getElementById('topLogoutBtn');
    if (topLogout) topLogout.addEventListener('click', doLogout);

    // Quick create
    const qc = document.getElementById('quickCreate');
    if (qc) qc.addEventListener('click', () => {
      if (global.QuickCreate) global.QuickCreate.open();
    });
  }

  /* ---------- Breadcrumb injection (into .page-head if present) ---------- */
  function injectBreadcrumb() {
    const page = activePage();
    const c = buildCrumb(page);
    const target = document.querySelector('[data-breadcrumb]');
    if (target) {
      target.innerHTML = `<div class="breadcrumb">${
        c.trail.map((t,i) => i === c.trail.length-1
          ? `<span class="current">${t}</span>`
          : `<a href="dashboard.html">${t}</a><span class="sep">${Icon('chevron-left', 14)}</span>`).join('')
      }</div>`;
      renderIcons(target);
    }
  }

  /* ---------- Init ---------- */
  function init() {
    // theme restore
    if (localStorage.getItem('novexa-theme') === 'dark') {
      document.documentElement.setAttribute('data-theme','dark');
    }
    const run = () => { mount(); injectBreadcrumb(); };
    if (window.__novexaCoreReady) {
      // core libs already loaded by head.js — just wait for DOM
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
      else run();
    } else {
      // wait for core libs to be ready, then for DOM
      window.addEventListener('novexa:core-ready', () => {
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
        else run();
      });
    }
  }

  init();
})();
