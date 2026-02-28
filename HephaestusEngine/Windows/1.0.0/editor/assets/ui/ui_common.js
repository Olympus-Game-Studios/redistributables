(function () {
  function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
  }

  function safeJsonParse(s) {
    try { return JSON.parse(s); } catch (_) { return null; }
  }

  function callCpp(name, payload) {
    if (!window.hepSend) return { ok: false, error: 'hepSend_not_ready' };
    const msg = { v: 1, name: name, payload: payload || {} };
    const respStr = window.hepSend(JSON.stringify(msg));
    const obj = safeJsonParse(respStr);
    return obj || { ok: false, error: 'bad_json', raw: respStr };
  }

  function onReady(fn) {
    const tick = setInterval(() => {
      if (window.hepSend) {
        clearInterval(tick);
        fn();
      }
    }, 50);
  }

  function setUiScale(scale) {
    const s = Number(scale);
    if (!Number.isFinite(s) || s <= 0) return;
    document.documentElement.style.setProperty('--uiScale', String(s));
  }

  function getAutoScaleOptions(overrides) {
    const d = (document.body && document.body.dataset) ? document.body.dataset : {};
    const baseWidth = Number(d.uiScaleBaseWidth || (overrides && overrides.baseWidth) || 520);
    const baseHeight = Number(d.uiScaleBaseHeight || (overrides && overrides.baseHeight) || 420);
    const min = Number(d.uiScaleMin || (overrides && overrides.min) || 1.0);
    const max = Number(d.uiScaleMax || (overrides && overrides.max) || 1.75);
    return {
      baseWidth: Number.isFinite(baseWidth) && baseWidth > 0 ? baseWidth : 520,
      baseHeight: Number.isFinite(baseHeight) && baseHeight > 0 ? baseHeight : 420,
      min: Number.isFinite(min) ? min : 1.0,
      max: Number.isFinite(max) ? max : 1.75,
    };
  }

  function computeAutoScale(opts) {
    const w = document.documentElement.clientWidth || window.innerWidth || 0;
    const h = document.documentElement.clientHeight || window.innerHeight || 0;
    if (!w || !h) return 1.0;
    const s = Math.min(w / opts.baseWidth, h / opts.baseHeight);
    return clamp(s, opts.min, opts.max);
  }

  // Auto-scale UI based on the panel/window size.
  // Default behavior: never scale below 1.0, scale up to a cap.
  function enableAutoScale(overrides) {
    if (window.hep && window.hep._autoScaleEnabled) return;
    const opts = getAutoScaleOptions(overrides);

    let raf = 0;
    function update() {
      raf = 0;
      setUiScale(computeAutoScale(opts));
    }
    function schedule() {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    }

    window.addEventListener('resize', schedule);
    if (window.visualViewport) window.visualViewport.addEventListener('resize', schedule);
    if (window.ResizeObserver) {
      const ro = new ResizeObserver(schedule);
      ro.observe(document.documentElement);
    }
    schedule();

    window.hep = window.hep || {};
    window.hep._autoScaleEnabled = true;
  }

  // Small helper for UE-like collapsible sections
  function wireCollapsible(sectionHeaderEl, bodyEl, storageKey) {
    const k = storageKey || null;
    let open = true;
    if (k) {
      const v = window.localStorage ? localStorage.getItem(k) : null;
      if (v === '0') open = false;
    }
    function apply() {
      bodyEl.style.display = open ? '' : 'none';
      sectionHeaderEl.style.opacity = open ? '1' : '0.85';
      if (k && window.localStorage) localStorage.setItem(k, open ? '1' : '0');
    }
    sectionHeaderEl.addEventListener('click', () => {
      open = !open;
      apply();
    });
    apply();
  }

  window.hep = window.hep || {};
  window.hep.callCpp = callCpp;
  window.hep.onReady = onReady;
  window.hep.wireCollapsible = wireCollapsible;
  window.hep.setUiScale = setUiScale;
  window.hep.enableAutoScale = enableAutoScale;

  // Default: fixed scale. Opt-in to auto scale via data-ui-scale-auto="true" on <body>.
  const d = (document.body && document.body.dataset) ? document.body.dataset : {};
  if (d.uiScaleFixed) {
    setUiScale(Number(d.uiScaleFixed));
  }

  const autoFlag = String(d.uiScaleAuto || '').toLowerCase();
  if (autoFlag === '1' || autoFlag === 'true' || autoFlag === 'yes') {
    enableAutoScale();
  }
})();
