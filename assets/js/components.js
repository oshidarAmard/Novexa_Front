/* ============================================================
   NOVEXA ERP — COMPONENTS (components.js)
   Reusable behaviors: Tabs, Modal, Drawer, Toast, Dropdown,
   Accordion, Table (render/sort/paginate/search), Forms
   ============================================================ */
(function (global) {
  'use strict';
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  /* ---------- 1. Tabs ---------- */
  function initTabs(root) {
    $$('[data-tabs]', root || document).forEach(group => {
      const tabs = $$('.tab', group);
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const target = tab.getAttribute('data-target') || tab.getAttribute('href');
          tabs.forEach(t => t.classList.remove('is-active'));
          tab.classList.add('is-active');
          // panels are siblings or referenced
          const scope = group.getAttribute('data-tabs-scope') ? document : group.parentElement;
          $$('.tab-panel', scope).forEach(p => p.classList.remove('is-active'));
          let panel;
          if (target) panel = $(target, scope);
          if (!panel) {
            const idx = tabs.indexOf(tab);
            panel = $$('.tab-panel', scope)[idx];
          }
          panel?.classList.add('is-active');
        });
      });
    });
  }

  /* ---------- 2. Pills ---------- */
  function initPills(root) {
    $$('.pills .pill, .segment button', root || document).forEach(p => {
      p.addEventListener('click', () => {
        const sib = p.parentElement.children;
        for (const s of sib) s.classList.remove('is-active');
        p.classList.add('is-active');
        const target = p.getAttribute('data-target');
        if (target) {
          $$('.tab-panel', p.closest('section') || document).forEach(panel => panel.classList.remove('is-active'));
          $(target)?.classList.add('is-active');
        }
      });
    });
  }

  /* ---------- 3. Modal ---------- */
  // Track open overlays so body scroll lock is managed correctly across
  // multiple opens/closes (prevents the "stuck, can't scroll" bug).
  const _openOverlays = new Set();
  function _lockBody() {
    document.body.style.overflow = 'hidden';
  }
  function _unlockBody() {
    // Only release the lock when NO overlays remain open
    if (_openOverlays.size === 0) document.body.style.overflow = '';
  }

  const Modal = {
    open(id) {
      const el = typeof id === 'string' ? document.getElementById(id) : id;
      if (!el || el.classList.contains('is-open')) return;
      el.classList.add('is-open');
      _openOverlays.add(el);
      _lockBody();
      if (!el._escBound) {
        el._escBound = (e) => { if (e.key === 'Escape') Modal.close(el); };
      }
      document.addEventListener('keydown', el._escBound);
    },
    close(el) {
      el = typeof el === 'string' ? document.getElementById(el) : el;
      if (!el || !el.classList.contains('is-open')) return;
      el.classList.remove('is-open');
      _openOverlays.delete(el);
      if (el._escBound) document.removeEventListener('keydown', el._escBound);
      _unlockBody();
    },
    confirm(opts) {
      opts = opts || {};
      const id = '_confirm_' + Date.now();
      const wrap = document.createElement('div');
      wrap.innerHTML = `
      <div class="modal-backdrop" id="${id}">
        <div class="modal modal--sm" role="dialog" aria-modal="true">
          <div class="modal__header">
            <div class="modal__title">
              <span class="icon ${opts.type || 'danger'}">${Icon(opts.type === 'success' ? 'check-circle' : (opts.type === 'info' ? 'info' : 'alert'), 20)}</span>
              <span>${opts.title || 'تأیید عملیات'}</span>
            </div>
            <button class="icon-btn" data-close>${Icon('x', 20)}</button>
          </div>
          <div class="modal__body"><p style="color:var(--text-secondary);font-size:var(--fs-sm);">${opts.message || 'آیا از انجام این عملیات اطمینان دارید؟'}</p></div>
          <div class="modal__footer">
            <button class="btn btn-ghost" data-close>${opts.cancelText || 'انصراف'}</button>
            <button class="btn ${opts.type === 'success' ? 'btn-success' : (opts.type === 'info' ? 'btn-primary' : 'btn-danger')}" data-confirm>${opts.confirmText || 'تأیید'}</button>
          </div>
        </div>
      </div>`;
      const node = wrap.firstElementChild;
      document.body.appendChild(node);
      renderIcons(node);
      const close = () => { Modal.close(node); setTimeout(()=>node.remove(), 220); };
      $$('[data-close]', node).forEach(b => b.addEventListener('click', close));
      $('[data-confirm]', node).addEventListener('click', () => { close(); opts.onConfirm && opts.onConfirm(); });
      setTimeout(() => Modal.open(node), 10);
    }
  };
  document.addEventListener('click', (e) => {
    // Open via trigger
    const trigger = e.target.closest('[data-modal-open]');
    if (trigger) { e.preventDefault(); Modal.open(trigger.getAttribute('data-modal-open')); return; }
    // Close via explicit button
    const closeBtn = e.target.closest('[data-modal-close]');
    if (closeBtn) { e.preventDefault(); Modal.close(closeBtn.closest('.modal-backdrop')); return; }
    // Click on backdrop itself (not its children) closes
    if (e.target.classList.contains('modal-backdrop')) { Modal.close(e.target); }
  });

  /* ---------- 4. Drawer ---------- */
  const Drawer = {
    open(id) {
      const el = typeof id === 'string' ? document.getElementById(id) : id;
      if (!el || el.classList.contains('is-open')) return;
      el.classList.add('is-open');
      _openOverlays.add(el);
      _lockBody();
      // show its associated backdrop (sibling .drawer-backdrop in same parent)
      const backdrop = el.parentElement.querySelector('.drawer-backdrop');
      if (backdrop) backdrop.classList.add('is-open');
    },
    close(el) {
      el = typeof el === 'string' ? document.getElementById(el) : el;
      if (!el || !el.classList.contains('is-open')) return;
      el.classList.remove('is-open');
      _openOverlays.delete(el);
      _unlockBody();
      const backdrop = el.parentElement.querySelector('.drawer-backdrop');
      if (backdrop) backdrop.classList.remove('is-open');
    }
  };
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-drawer-open]');
    if (t) { e.preventDefault(); Drawer.open(t.getAttribute('data-drawer-open')); return; }
    const c = e.target.closest('[data-drawer-close]');
    if (c) { e.preventDefault(); Drawer.close(c.closest('.drawer')); return; }
    // backdrop click
    if (e.target.classList.contains('drawer-backdrop')) {
      const drawer = e.target.parentElement.querySelector('.drawer') || e.target.nextElementSibling;
      Drawer.close(drawer);
    }
  });
  // Escape closes any open drawer too
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openDrawers = document.querySelectorAll('.drawer.is-open');
      openDrawers.forEach(d => Drawer.close(d));
    }
  });

  /* ---------- 5. Toast ---------- */
  function toast(opts) {
    if (typeof opts === 'string') opts = { message: opts };
    opts = opts || {};
    let wrap = $('.toast-wrap');
    if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; document.body.appendChild(wrap); }
    const icons = { success:'check-circle', danger:'alert', warning:'alert', info:'info', primary:'info' };
    const type = opts.type || 'success';
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = `
      <span class="toast__icon">${Icon(icons[type] || 'info', 22)}</span>
      <div style="flex:1;">
        <div class="toast__title">${opts.title || 'عملیات موفق'}</div>
        <div class="toast__msg">${opts.message || ''}</div>
      </div>
      <button class="icon-btn btn-sm">${Icon('x', 16)}</button>`;
    wrap.appendChild(el);
    renderIcons(el);
    const remove = () => { el.classList.add('hide'); setTimeout(() => el.remove(), 200); };
    el.querySelector('button').addEventListener('click', remove);
    setTimeout(remove, opts.duration || 4000);
  }

  /* ---------- 6. Dropdown ---------- */
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-dropdown]');
    if (trigger) {
      e.stopPropagation();
      const dd = trigger.closest('.dropdown');
      const isOpen = dd.classList.contains('is-open');
      $$('.dropdown.is-open').forEach(d => d.classList.remove('is-open'));
      if (!isOpen) dd.classList.add('is-open');
      return;
    }
    $$('.dropdown.is-open').forEach(d => d.classList.remove('is-open'));
  });

  /* ---------- 7. Accordion ---------- */
  document.addEventListener('click', (e) => {
    const head = e.target.closest('.acc-head');
    if (head && head.parentElement.classList.contains('acc-item')) {
      head.parentElement.classList.toggle('is-open');
    }
  });

  /* ---------- 8. Copy to clipboard ---------- */
  document.addEventListener('click', (e) => {
    const cp = e.target.closest('[data-copy]');
    if (cp) {
      navigator.clipboard?.writeText(cp.getAttribute('data-copy'));
      toast({ type: 'success', title: 'کپی شد', message: 'در کلیپ‌بورد ذخیره شد' });
    }
  });

  /* ---------- 9. Table component ---------- */
  /*
    <div class="table-card" data-table='{"columns":[...],"data":[...]}'></div>
    Each column: { key, label, type:'text|money|badge|date|id|user|actions|custom', render(v,row), width, sortable, align, cls }
  */
  const Table = {
    instances: {},
    create(el, config) {
      const state = {
        el, config,
        page: 1,
        pageSize: config.pageSize || 10,
        search: '',
        sortKey: config.defaultSort || null,
        sortDir: 'asc',
        selected: new Set(),
        raw: config.data || [],
        total: (config.data || []).length,
        serverMode: typeof config.fetchData === 'function',
        loading: false
      };
      Table.instances[el.id || 'tbl_' + Math.random()] = state;
      state.render = () => Table.render(state);
      if (state.serverMode) Table.refresh(state); else state.render();
      return state;
    },
    /**
     * Re-fetches data for server-driven tables (config.fetchData was supplied
     * to Table.create) and re-renders. For client-array tables this just
     * re-renders synchronously — safe to call from either mode.
     * fetchData(state) must resolve to { items, total }.
     */
    async refresh(state) {
      if (state.serverMode) {
        state.loading = true;
        try {
          const result = await state.config.fetchData(state);
          state.raw = (result && result.items) || [];
          state.total = (result && result.total != null) ? result.total : state.raw.length;
        } catch (err) {
          state.raw = [];
          state.total = 0;
          if (global.UI && UI.toast) {
            UI.toast({ type: 'danger', title: 'خطا در دریافت اطلاعات', message: (err && err.message) || 'خطای ناشناخته رخ داد.' });
          }
        } finally {
          state.loading = false;
        }
      }
      state.render();
    },
    filtered(state) {
      if (state.serverMode) return state.raw.slice();
      let rows = state.raw.slice();
      if (state.search) {
        const q = state.search;
        rows = rows.filter(r => state.config.columns.some(c => String(r[c.key] ?? '').includes(q)));
      }
      if (state.sortKey) {
        const dir = state.sortDir === 'asc' ? 1 : -1;
        rows.sort((a,b) => {
          const va = a[state.sortKey], vb = b[state.sortKey];
          if (typeof va === 'number' && typeof vb === 'number') return (va-vb)*dir;
          return String(va||'').localeCompare(String(vb||''), 'fa') * dir;
        });
      }
      return rows;
    },
    render(state) {
      const rows = Table.filtered(state);
      const total = state.serverMode ? state.total : rows.length;
      const pages = Math.max(1, Math.ceil(total / state.pageSize));
      if (state.page > pages) state.page = pages;
      const start = (state.page - 1) * state.pageSize;
      const slice = state.serverMode ? rows : rows.slice(start, start + state.pageSize);
      const allOnPage = slice.length > 0 && slice.every(r => state.selected.has(r.id));
      const c = state.config;

      state.el.innerHTML = `
        <div class="table-toolbar">
          <div class="table-toolbar__search">
            ${Icon('search', 16)}
            <input type="text" placeholder="${c.searchPlaceholder || 'جستجو...'}" value="${state.search}">
          </div>
          <div class="table-toolbar__actions">
            ${c.filters ? `<button class="btn btn-outline btn-sm" data-filters>${Icon('sliders', 16)} فیلتر پیشرفته</button>` : ''}
            ${c.refresh !== false ? `<button class="btn btn-ghost btn-sm" data-refresh="${Icon('refresh', 16)}">${Icon('refresh', 16)} <span class="hide-mobile">به‌روزرسانی</span></button>` : ''}
            <div class="dropdown">
              <button class="btn btn-outline btn-sm" data-dropdown>${Icon('download', 16)} <span class="hide-mobile">خروجی</span> ${Icon('chevron-down', 14)}</button>
              <div class="dropdown__menu">
                <div class="dropdown__label">خروجی گرفتن</div>
                <div class="dropdown__item">${Icon('file', 16)} Excel (.xlsx)</div>
                <div class="dropdown__item">${Icon('file', 16)} CSV</div>
                <div class="dropdown__item">${Icon('print', 16)} چاپ</div>
                <div class="dropdown__sep"></div>
                <div class="dropdown__item">${Icon('upload', 16)} ورودی از فایل</div>
              </div>
            </div>
            ${c.createBtn !== false ? `<a class="btn btn-primary btn-sm" href="${c.createHref || '#'}">${Icon('plus', 16)} <span class="hide-mobile">${c.createText || 'ایجاد'}</span></a>` : ''}
          </div>
        </div>

        <div class="bulk-bar ${state.selected.size ? 'show' : ''}">
          ${NOVEXA.toFa(state.selected.size)} رکورد انتخاب شده
          <div class="actions">
            <button class="btn btn-sm btn-outline">${Icon('download', 16)} خروجی</button>
            <button class="btn btn-sm btn-outline">${Icon('archive', 16)} بایگانی</button>
            <button class="btn btn-sm btn-danger">${Icon('trash', 16)} حذف</button>
          </div>
        </div>

        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                ${c.selectable !== false ? `<th class="col-check"><input type="checkbox" class="chk" data-select-all ${allOnPage ? 'checked' : ''}></th>` : ''}
                ${c.columns.map(col => {
                  const sorted = state.sortKey === col.key ? (state.sortDir === 'asc' ? 'sorted-asc' : 'sorted-desc') : '';
                  return `<th class="${col.sortable !== false ? 'sortable' : ''} ${sorted} ${col.cls||''}" data-sort="${col.key}" ${col.width?`style="width:${col.width}"`:''}>
                    <span class="th-inner">${col.label} ${col.sortable !== false ? `<span class="sort-ic">${Icon(state.sortKey===col.key && state.sortDir==='desc'?'chevron-up':'chevron-down', 14)}</span>` : ''}</span>
                  </th>`;
                }).join('')}
              </tr>
            </thead>
            <tbody>
              ${slice.length ? slice.map(row => Table.rowHTML(row, state)).join('') : Table.emptyRow(state)}
            </tbody>
          </table>
        </div>

        <div class="pagination">
          <div class="pagination__info">
            نمایش ${NOVEXA.toFa(start+1)} تا ${NOVEXA.toFa(Math.min(start+state.pageSize,total))} از ${NOVEXA.toFa(total)} رکورد
          </div>
          <div class="pagination__nav">
            <div class="page-size hide-mobile">
              <span>تعداد در صفحه:</span>
              <select class="input input-sm" data-page-size style="width:auto;height:32px;">
                ${[10,20,50,100].map(n => `<option value="${n}" ${n===state.pageSize?'selected':''}>${NOVEXA.toFa(n)}</option>`).join('')}
              </select>
            </div>
            <button class="page-btn" data-page="prev" ${state.page===1?'disabled':''}>${Icon('chevron-right', 16)}</button>
            ${Table.pageNumbers(state.page, pages).map(p => p==='...' ? `<span style="padding:0 4px;color:var(--text-tertiary);">…</span>` : `<button class="page-btn ${p===state.page?'is-active':''}" data-page="${p}">${NOVEXA.toFa(p)}</button>`).join('')}
            <button class="page-btn" data-page="next" ${state.page===pages?'disabled':''}>${Icon('chevron-left', 16)}</button>
          </div>
        </div>
      `;
      renderIcons(state.el);
      Table.bind(state);
    },
    pageNumbers(cur, total) {
      const out = []; const delta = 1;
      const range = []; const rangeWithDots = [];
      const l = Math.max(2, cur - delta); const r = Math.min(total - 1, cur + delta);
      range.push(1);
      if (l > 2) range.push('...');
      for (let i = l; i <= r; i++) range.push(i);
      if (r < total - 1) range.push('...');
      if (total > 1) range.push(total);
      return range;
    },
    cell(col, row) {
      const v = row[col.key];
      if (col.render) return col.render(v, row);
      switch (col.type) {
        case 'money': return `<span class="cell-money">${NOVEXA.faMoney(v)}<span class="currency">تومان</span></span>`;
        case 'num': return `<span class="num">${NOVEXA.faNum(v)}</span>`;
        case 'id': return `<span class="cell-id">${v}</span>`;
        case 'date': return `<span>${NOVEXA.toFa(v)}</span>`;
        case 'badge': {
          const cfg = col.badges && col.badges[v] ? col.badges[v] : { label: v, cls: 'neutral' };
          return `<span class="badge badge-${cfg.cls}">${cfg.label}</span>`;
        }
        case 'user': return `<div style="display:flex;align-items:center;gap:8px;"><span class="avatar avatar-sm">${NOVEXA.initials(v||'؟؟')}</span><div><div class="cell-strong">${v}</div>${row.role?`<div class="cell-sub">${row.role}</div>`:''}</div></div>`;
        case 'actions': return `<div class="row-actions">${(col.actions||['view','edit','delete']).map(a => Table.actionBtn(a, row, col)).join('')}</div>`;
        case 'product': return `<div style="display:flex;align-items:center;gap:10px;"><span class="avatar avatar-sm" style="background:var(--surface-2);color:var(--color-primary)">${Icon('box',16)}</span><div style="min-width:0;"><div class="cell-strong truncate" style="max-width:280px;">${v}</div>${row.sku?`<div class="cell-sub">${row.sku}</div>`:''}</div></div>`;
        case 'progress': return `<div><div class="flex justify-between" style="margin-bottom:4px;"><span class="num">${NOVEXA.toFa(v)}٪</span></div><div class="progress sm"><div class="progress__bar ${v>80?'success':(v>40?'':'warning')}" style="width:${v}%"></div></div></div>`;
        default: return v != null ? String(v) : '—';
      }
    },
    actionBtn(a, row, col) {
      const map = {
        view: { ic:'eye', cls:'', tip:'مشاهده' },
        edit: { ic:'edit', cls:'', tip:'ویرایش' },
        delete: { ic:'trash', cls:'danger', tip:'حذف' },
        copy: { ic:'copy', cls:'', tip:'کپی' },
        more: { ic:'more-v', cls:'', tip:'بیشتر' }
      };
      const m = map[a] || { ic:'more-v', cls:'', tip:a };
      const href = col.actionHrefs && col.actionHrefs[a] ? col.actionHrefs[a].replace(':id', row.id) : '#';
      return `<a class="row-action ${m.cls}" href="${href}" data-tooltip="${m.tip}">${Icon(m.ic, 16)}</a>`;
    },
    rowHTML(row, state) {
      const sel = state.selected.has(row.id) ? 'is-selected' : '';
      return `<tr class="${sel}" data-id="${row.id}">
        ${state.config.selectable !== false ? `<td class="col-check"><input type="checkbox" class="chk" data-select="${row.id}" ${state.selected.has(row.id)?'checked':''}></td>` : ''}
        ${state.config.columns.map(col => `<td class="${col.cls||''}" ${col.align?`style="text-align:${col.align}"`:''}>${Table.cell(col, row)}</td>`).join('')}
      </tr>`;
    },
    emptyRow(state) {
      const cols = state.config.columns.length + (state.config.selectable !== false ? 1 : 0);
      return `<tr><td colspan="${cols}"><div class="empty"><div class="empty__icon">${Icon('search', 36)}</div><div class="empty__title">هیچ رکوردی یافت نشد</div><div class="empty__desc">با فیلترهای فعلی چیزی پیدا نشد. عبارت دیگری را امتحان کنید یا رکورد جدیدی ایجاد کنید.</div></div></td></tr>`;
    },
    bind(state) {
      const el = state.el;
      // search
      const search = el.querySelector('.table-toolbar__search input');
      if (search) search.addEventListener('input', async (e) => {
        const cursorPos = e.target.selectionStart;
        state.search = e.target.value;
        state.page = 1;
        await Table.refresh(state);
        const freshSearch = state.el.querySelector('.table-toolbar__search input');
        if (freshSearch) {
          freshSearch.focus();
          const pos = Math.min(cursorPos, freshSearch.value.length);
          freshSearch.setSelectionRange(pos, pos);
        }
      });
      // sort
      $$('[data-sort]', el).forEach(th => th.addEventListener('click', () => {
        const k = th.getAttribute('data-sort');
        if (state.sortKey === k) state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
        else { state.sortKey = k; state.sortDir = 'asc'; }
        Table.refresh(state);
      }));
      // pagination
      $$('[data-page]', el).forEach(b => b.addEventListener('click', () => {
        const p = b.getAttribute('data-page');
        if (p === 'prev') state.page = Math.max(1, state.page-1);
        else if (p === 'next') state.page = state.page+1;
        else state.page = +p;
        Table.refresh(state);
      }));
      const ps = el.querySelector('[data-page-size]');
      if (ps) ps.addEventListener('change', (e) => { state.pageSize = +e.target.value; state.page = 1; Table.refresh(state); });
      // select
      const all = el.querySelector('[data-select-all]');
      if (all) all.addEventListener('change', () => {
        const rows = Table.filtered(state).slice((state.page-1)*state.pageSize, state.page*state.pageSize);
        if (all.checked) rows.forEach(r => state.selected.add(r.id)); else rows.forEach(r => state.selected.delete(r.id));
        state.render();
      });
      $$('[data-select]', el).forEach(c => c.addEventListener('change', () => {
        const id = +c.getAttribute('data-select');
        if (c.checked) state.selected.add(id); else state.selected.delete(id);
        state.render();
      }));
      // refresh
      const ref = el.querySelector('[data-refresh]');
      if (ref) ref.addEventListener('click', async () => {
        ref.classList.add('spin');
        await Table.refresh(state);
        toast({ type: 'success', title: 'به‌روزرسانی شد', message: 'داده‌ها با موفقیت به‌روزرسانی شدند.' });
        setTimeout(() => ref.classList.remove('spin'), 700);
      });
    }
  };

  /* ---------- 10. Searchable combo (select) ---------- */
  function initCombo(root) {
    $$('.combo', root || document).forEach(combo => {
      if (combo.__init) return; combo.__init = true;
      const trigger = $('.combo__trigger', combo);
      const panel = $('.combo__panel', combo);
      const input = $('.combo__search input', combo);
      const opts = $$('.combo__opt', combo);
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = combo.classList.contains('is-open');
        $$('.combo.is-open').forEach(c => c.classList.remove('is-open'));
        combo.classList.toggle('is-open', !isOpen);
        if (!isOpen) setTimeout(()=>input?.focus(),50);
      });
      if (input) input.addEventListener('input', () => {
        const q = input.value.trim();
        opts.forEach(o => o.style.display = o.textContent.includes(q) ? '' : 'none');
      });
      opts.forEach(o => o.addEventListener('click', () => {
        opts.forEach(x => x.classList.remove('is-selected'));
        o.classList.add('is-selected');
        $('.combo__value', trigger).textContent = o.querySelector('.combo__label, span:not(.check)') ? o.textContent.replace(/[\u2713]/g,'').trim() : o.textContent.trim();
        $('.combo__value', trigger).classList.remove('placeholder');
        combo.classList.remove('is-open');
      }));
    });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.combo')) $$('.combo.is-open').forEach(c => c.classList.remove('is-open'));
    });
  }

  /* ---------- 11. Switch / file upload demo ---------- */
  function initUpload(root) {
    $$('.upload', root || document).forEach(u => {
      u.addEventListener('click', () => toast({type:'success', title:'فایل انتخاب شد', message:'فایل برای آپلود آماده است.'}));
      ['dragover','dragenter'].forEach(ev => u.addEventListener(ev, e => { e.preventDefault(); u.classList.add('drag'); }));
      ['dragleave','drop'].forEach(ev => u.addEventListener(ev, e => { e.preventDefault(); u.classList.remove('drag'); }));
    });
  }

  /* ---------- 12. Auto-init on DOM ready ---------- */
  function initAll() {
    if (!window.Icon || !window.NOVEXA) {
      // core libs not ready yet — retry when they are
      window.addEventListener('novexa:core-ready', initAll, { once: true });
      return;
    }
    if (window.__componentsReady) return; window.__componentsReady = true;
    initTabs(); initPills(); initCombo(); initUpload();
    // Auto mount tables
    $$('[data-table]').forEach(el => {
      try {
        const cfg = JSON.parse(el.getAttribute('data-table'));
        const data = cfg.dataSource ? (global.NOVEXA[cfg.dataSource] || []) : (cfg.data || []);
        Table.create(el, Object.assign({}, cfg, { data }));
      } catch(e){ console.warn('table init failed', e); }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initAll);
  else initAll();

  // Re-init after layout mounts
  document.addEventListener('novexa:ready', initAll);

  global.UI = { Modal, Drawer, toast, Table, initTabs, initCombo, initAll };
})(window);
