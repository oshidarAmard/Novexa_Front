/* ============================================================
   NOVEXA ERP — CHARTS (charts.js)
   Vanilla Canvas charts: Line, Bar, Area, Donut, Pie
   ============================================================ */
(function (global) {
  'use strict';

  const COLORS = {
    primary: '#2563EB',
    accent: '#3B82F6',
    success: '#22C55E',
    danger: '#EF4444',
    warning: '#F59E0B',
    info: '#06B6D4',
    violet: '#7C3AED',
    pink: '#EC4899',
    grid: 'rgba(148,163,184,.18)',
    textMuted: '#94A3B8'
  };

  function theme() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }
  function textColor() { return theme() === 'dark' ? '#94A3B8' : '#64748B'; }
  function gridColor() { return theme() === 'dark' ? 'rgba(148,163,184,.12)' : 'rgba(148,163,184,.18)'; }

  function setup(canvas) {
    const dpr = window.devicePixelRatio || 1;
    // Ensure the canvas has a real size; fall back to its CSS box / parent.
    const parent = canvas.parentElement;
    let w = canvas.clientWidth || (parent ? parent.clientWidth : 0);
    let h = canvas.clientHeight || (parent ? parent.clientHeight : 0);
    // Guard against zero-size (e.g. hidden tab panels) — use chart-box height
    if ((!h || h < 10) && parent) {
      const cs = getComputedStyle(parent);
      h = parseFloat(cs.height) || 300;
    }
    if ((!w || w < 10) && parent) w = parent.clientWidth || 600;
    if (!w || !h) return null; // still nothing to draw on
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    const ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0); // reset any prior scale
    ctx.scale(dpr, dpr);
    return { ctx, w, h };
  }
  function toFa(n){ return String(n).replace(/[0-9]/g,(d)=>'۰۱۲۳۴۵۶۷۸۹'[+d]); }
  function fa(n){ if(n>=1e9) return toFa((n/1e9).toFixed(1)) + ' م‌ت'; if(n>=1e6) return toFa((n/1e6).toFixed(1)) + ' م‌ت'; if(n>=1e3) return toFa((n/1e3).toFixed(0)) + ' هزار'; return toFa(n); }

  /* ---------- LINE / AREA ---------- */
  function line(canvas, series, opts) {
    opts = opts || {};
    const dims = setup(canvas); if (!dims) return;
    const { ctx, w, h } = dims;
    const padL = 48, padR = 16, padT = 16, padB = 32;
    const cw = w - padL - padR, ch = h - padT - padB;
    const labels = opts.labels || [];
    const all = [];
    series.forEach(s => s.data.forEach(v => all.push(v)));
    const max = Math.max(...all, 1) * 1.15;
    const min = 0;

    // grid
    ctx.strokeStyle = gridColor();
    ctx.lineWidth = 1;
    ctx.fillStyle = textColor();
    ctx.font = '11px Vazirmatn, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    const ticks = 4;
    for (let i = 0; i <= ticks; i++) {
      const y = padT + ch - (ch / ticks) * i;
      ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(w - padR, y); ctx.stroke();
      const val = (max / ticks) * i;
      ctx.fillText(fa(val), padL - 8, y);
    }
    // x labels
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const step = cw / Math.max(labels.length - 1, 1);
    labels.forEach((lbl, i) => {
      if (i % Math.ceil(labels.length / 8) === 0 || i === labels.length - 1) {
        ctx.fillText(lbl, padL + step * i, h - padB + 8);
      }
    });

    // series
    series.forEach((s) => {
      const color = s.color || COLORS.primary;
      const pts = s.data.map((v, i) => ({
        x: padL + step * i,
        y: padT + ch - (ch * ((v - min) / (max - min)))
      }));

      if (s.area) {
        const grad = ctx.createLinearGradient(0, padT, 0, padT + ch);
        grad.addColorStop(0, color + '40');
        grad.addColorStop(1, color + '00');
        ctx.beginPath();
        ctx.moveTo(pts[0].x, padT + ch);
        pts.forEach((p, i) => {
          if (i === 0) ctx.lineTo(p.x, p.y);
          else {
            const prev = pts[i - 1];
            const cx = (prev.x + p.x) / 2;
            ctx.quadraticCurveTo(prev.x, prev.y, cx, (prev.y + p.y) / 2);
          }
        });
        ctx.lineTo(pts[pts.length - 1].x, padT + ch);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();
      }

      ctx.beginPath();
      pts.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else {
          const prev = pts[i - 1];
          const cx = (prev.x + p.x) / 2;
          ctx.quadraticCurveTo(prev.x, prev.y, cx, (prev.y + p.y) / 2);
        }
      });
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      if (s.dots) {
        pts.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = theme() === 'dark' ? '#111827' : '#fff';
          ctx.fill();
          ctx.lineWidth = 2;
          ctx.strokeStyle = color;
          ctx.stroke();
        });
      }
    });
  }

  /* ---------- BAR ---------- */
  function bar(canvas, series, opts) {
    opts = opts || {};
    const dims = setup(canvas); if (!dims) return;
    const { ctx, w, h } = dims;
    const padL = 48, padR = 16, padT = 16, padB = 32;
    const cw = w - padL - padR, ch = h - padT - padB;
    const labels = opts.labels || [];
    const all = [];
    series.forEach(s => s.data.forEach(v => all.push(v)));
    const max = Math.max(...all, 1) * 1.2;
    const groupCount = labels.length;
    const setCount = series.length;
    const groupW = cw / groupCount;
    const barW = (groupW * 0.6) / setCount;

    ctx.strokeStyle = gridColor();
    ctx.fillStyle = textColor();
    ctx.font = '11px Vazirmatn, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let i = 0; i <= 4; i++) {
      const y = padT + ch - (ch / 4) * i;
      ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(w - padR, y); ctx.stroke();
      ctx.fillText(fa((max / 4) * i), padL - 8, y);
    }
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    labels.forEach((lbl, i) => ctx.fillText(lbl, padL + groupW * i + groupW / 2, h - padB + 8));

    series.forEach((s, si) => {
      const color = s.color || COLORS.primary;
      s.data.forEach((v, i) => {
        const bh = (ch * v) / max;
        const x = padL + groupW * i + groupW / 2 - (setCount * barW) / 2 + si * barW + 2;
        const y = padT + ch - bh;
        const r = Math.min(4, barW / 2);
        ctx.beginPath();
        ctx.moveTo(x, y + r);
        ctx.arcTo(x, y, x + r, y, r);
        ctx.lineTo(x + barW - r - 4, y);
        ctx.arcTo(x + barW - 4, y, x + barW - 4, y + r, r);
        ctx.lineTo(x + barW - 4, padT + ch);
        ctx.lineTo(x, padT + ch);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
      });
    });
  }

  /* ---------- DONUT / PIE ---------- */
  function donut(canvas, labels, data, colors, opts) {
    opts = opts || {};
    const dims = setup(canvas); if (!dims) return;
    const { ctx, w, h } = dims;
    const cx = w / 2, cy = h / 2;
    const radius = Math.min(w, h) / 2 - 12;
    const inner = opts.pie ? 0 : radius * 0.62;
    const total = data.reduce((a, b) => a + b, 0);
    let start = -Math.PI / 2;
    const palette = colors || [COLORS.primary, COLORS.success, COLORS.warning, COLORS.info, COLORS.violet, COLORS.pink];

    data.forEach((v, i) => {
      const angle = (v / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, start, start + angle);
      ctx.closePath();
      ctx.fillStyle = palette[i % palette.length];
      ctx.fill();
      start += angle;
    });

    if (inner > 0) {
      ctx.beginPath();
      ctx.arc(cx, cy, inner, 0, Math.PI * 2);
      ctx.fillStyle = theme() === 'dark' ? '#111827' : '#FFFFFF';
      ctx.fill();
    }

    // center text
    if (opts.center && inner > 0) {
      ctx.fillStyle = textColor();
      ctx.textAlign = 'center';
      ctx.font = '11px Vazirmatn, sans-serif';
      ctx.textBaseline = 'middle';
      ctx.fillText(opts.centerLabel || '', cx, cy - 10);
      ctx.fillStyle = theme() === 'dark' ? '#F1F5F9' : '#0F172A';
      ctx.font = 'bold 18px Vazirmatn, sans-serif';
      ctx.fillText(opts.center || '', cx, cy + 8);
    }
  }

  /* ---------- Sparkline ---------- */
  function spark(canvas, data, color) {
    const dims = setup(canvas); if (!dims) return;
    const { ctx, w, h } = dims;
    const max = Math.max(...data), min = Math.min(...data);
    const step = w / (data.length - 1);
    const pts = data.map((v, i) => ({ x: i * step, y: h - 2 - ((v - min) / (max - min || 1)) * (h - 4) }));

    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, (color||COLORS.primary) + '50');
    grad.addColorStop(1, (color||COLORS.primary) + '00');
    ctx.beginPath();
    ctx.moveTo(pts[0].x, h);
    pts.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fillStyle = grad; ctx.fill();

    ctx.beginPath();
    pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = color || COLORS.primary;
    ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.stroke();
  }

  /* ---------- Auto-init: <canvas data-chart="line|bar|donut" ...> ---------- */
  function renderAll(root) {
    (root || document).querySelectorAll('canvas[data-chart]').forEach(canvas => {
      try {
        const type = canvas.dataset.chart;
        const src = canvas.dataset.src;
        const data = src && global.NOVEXA && NOVEXA.CHART[src] ? NOVEXA.CHART[src] : null;
        if (type === 'line' && data) {
          line(canvas, [
            { data: data.sales || data.data, color: COLORS.primary, area: true, dots: true },
            ...(data.purchase ? [{ data: data.purchase, color: COLORS.warning, area: false, dots: false }] : [])
          ], { labels: data.labels });
        } else if (type === 'bar' && data) {
          bar(canvas, [{ data: data.data, color: COLORS.primary }], { labels: data.labels });
        } else if (type === 'donut' && data) {
          donut(canvas, data.labels, data.data, null, { center: opts(canvas,'center'), centerLabel: opts(canvas,'centerLabel'), pie: canvas.dataset.pie === 'true' });
        }
      } catch (e) { /* ignore */ }
    });
  }
  function opts(c, k){ return c.dataset[k]; }

  /* Re-render on theme change & resize */
  let _t;
  window.addEventListener('resize', () => { clearTimeout(_t); _t = setTimeout(() => renderAll(), 150); });
  document.addEventListener('themechange', () => renderAll());

  /* Auto-init once everything is ready (layout + data) */
  function _boot() {
    if (!global.NOVEXA) { window.addEventListener('novexa:core-ready', _boot, { once: true }); return; }
    // wait a tick for layout to size the chart-boxes
    setTimeout(() => renderAll(), 60);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', _boot);
  else _boot();

  /* Redraw charts inside a tab whenever that tab becomes active */
  document.addEventListener('click', (e) => {
    const tab = e.target.closest('.tab');
    if (!tab) return;
    setTimeout(() => {
      const active = document.querySelector('.tab-panel.is-active');
      if (active) renderAll(active);
    }, 80);
  });

  global.Charts = { line, bar, donut, spark, renderAll, COLORS };
})(window);
