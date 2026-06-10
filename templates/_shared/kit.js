/* ============================================================
   NEXA Studio — Shared Template Runtime
   - Theme switcher (5 themes)
   - Hero layout switcher (4 layouts)
   - Edit-zone postMessage API (driven by editor drawer)
   - Form bundle swapper (4 presets)
   ============================================================ */
(function(){
  'use strict';

  // ───────── 0. Small HTML helpers ─────────
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
  function escAttr(s){return esc(s).replace(/"/g,'&quot;');}
  function slug(s){return String(s||'field').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,40)||'field';}

  // ───────── 1. Theme switcher ─────────
  const THEMES = ['editorial','minimal','conversion','luxury','dark'];
  function setTheme(t){
    if(!THEMES.includes(t)) return;
    document.body.setAttribute('data-theme', t);
  }

  // ───────── 1b. Rich theme (design-token manifest from the Theme Library) ─────────
  // Maps a manifest's tokens onto the kit.css CSS variables and loads its fonts,
  // so any template can wear any of the 21 library themes. Set on <body> (inline)
  // so it overrides the [data-theme] block and survives quick-style switches.
  function _col(v){
    if(v == null) return null;
    v = String(v).trim();
    return /^\d+\s+\d+\s+\d+$/.test(v) ? 'rgb(' + v + ')' : v; // "R G B" triplet → rgb(); else pass through (hex/rgb/etc.)
  }
  function injectFontLinks(links){
    if(!links || !links.length) return;
    links.forEach(function(href){
      if(!href) return;
      if(document.head.querySelector('link[data-nexa-themefont][href="' + href + '"]')) return;
      var l = document.createElement('link');
      l.rel = 'stylesheet'; l.href = href; l.setAttribute('data-nexa-themefont','1');
      document.head.appendChild(l);
    });
  }
  function applyManifest(m){
    if(!m || typeof m !== 'object') return;
    var b = document.body, S = function(k,v){ if(v != null && v !== '') b.style.setProperty(k, v); };
    var t = m.tokens || {}, c = t.color || {}, ty = t.type || {}, rd = t.radius || {}, sh = t.shadow || {}, sp = t.space || {}, mo = t.motion || {};
    // Colour
    S('--surface',   _col(c.bg));
    S('--surface-2', _col(c.surface || c.surface2));
    S('--ink',       _col(c.ink));
    S('--ink-mute',  _col(c.muted));
    S('--line',      _col(c.line));
    S('--brand-primary',   _col(c.primary));
    S('--brand-secondary', _col(c.accent || c.accent2 || c.primary));
    S('--on-primary',      _col(c.onPrimary || c.onprimary));
    if(c.primary){
      var p = String(c.primary).trim();
      S('--brand-accent', /^\d+\s+\d+\s+\d+$/.test(p) ? 'rgb(' + p + ' / 0.12)' : p);
    }
    if(c.bg) S('--hero-bg', 'linear-gradient(135deg,' + _col(c.surface || c.bg) + ' 0%,' + _col(c.bg) + ' 60%)');
    // Type
    S('--font-display', ty.display);
    S('--font-body',    ty.body);
    if(ty.weights){ S('--display-weight', ty.weights.displayBold || ty.weights.display); S('--body-weight', ty.weights.body); }
    // Radius / shadow / space / motion
    S('--button-radius', rd.button);
    S('--r-lg', rd.card);
    S('--shadow-md', sh.card);
    S('--shadow-lg', sh.elevated);
    S('--sec-pad', sp.section); S('--section-rhythm', sp.section); S('--gutter', sp.gutter);
    if(mo.ease && mo.duration) S('--t-base', mo.duration + ' ' + mo.ease);
    // Let the default [data-theme] block stop competing; record mode for any conditional styling.
    b.removeAttribute('data-theme');
    b.setAttribute('data-theme-mode', m.mode || 'light');
    injectFontLinks(m.fontLinks);
  }

  // ───────── 2. Hero layout switcher ─────────
  const HERO_LAYOUTS = ['form-right','video','image-split','centred'];
  function setHero(layout){
    if(!HERO_LAYOUTS.includes(layout)) return;
    const hero = document.querySelector('.nx-hero');
    if(!hero) return;
    hero.setAttribute('data-hero', layout);
  }

  // ───────── 3. Brand colour override ─────────
  function setBrand(primary, secondary){
    const r = document.documentElement;
    if(primary)   r.style.setProperty('--brand-primary', primary);
    if(secondary) r.style.setProperty('--brand-secondary', secondary);
    if(primary){
      // derive a light accent from primary (8% mix on white)
      r.style.setProperty('--brand-accent', primary + '1F');
    }
  }

  // ───────── 4. Logo override ─────────
  function setLogo(url){
    // Works for both image logos and text logos (replaces the text with an image).
    document.querySelectorAll('.nx-logo').forEach(el => {
      let img = el.querySelector('img');
      if(!img){ img = document.createElement('img'); el.textContent = ''; el.appendChild(img); }
      img.src = url; img.alt = 'Logo'; img.style.height = '32px'; img.style.width = 'auto';
    });
  }

  // ───────── Custom fonts (Google Fonts) ─────────
  function setFont(role, family, query){
    if(query){
      const id = 'nxf-' + query.replace(/[^a-z0-9]/gi,'');
      if(!document.getElementById(id)){
        const l = document.createElement('link');
        l.id = id; l.rel = 'stylesheet';
        l.href = 'https://fonts.googleapis.com/css2?family=' + query + '&display=swap';
        document.head.appendChild(l);
      }
    }
    // Set on <body> (inline) so it overrides any theme's font rule and survives theme switches.
    document.body.style.setProperty(role === 'display' ? '--font-display' : '--font-body', "'" + family + "', system-ui, sans-serif");
  }

  // ───────── Text direction (LTR / RTL for Arabic etc.) ─────────
  function setDir(dir, lang){
    document.documentElement.setAttribute('dir', dir || 'ltr');
    if(lang) document.documentElement.setAttribute('lang', lang);
  }

  // Register an uploaded custom font (embedded as a base64 @font-face → travels with the export).
  function addFont(family, dataUrl, format, role){
    const style = document.createElement('style');
    style.textContent = "@font-face{font-family:'" + family + "';src:url(" + dataUrl + ") format('" + format + "');font-display:swap}";
    document.head.appendChild(style);
    if(role) document.body.style.setProperty(role === 'display' ? '--font-display' : '--font-body', "'" + family + "', system-ui, sans-serif");
  }

  // ───────── 5. Text zone setter (hero copy, footer, etc.) ─────────
  function setText(zone, fields){
    const el = document.querySelector(`[data-edit="${zone}"]`);
    if(!el) return;
    Object.keys(fields).forEach(key => {
      const target = el.querySelector(`[data-field="${key}"]`);
      if(target) target.textContent = fields[key];
    });
  }

  // ───────── 6. Hero media swap ─────────
  function setHeroMedia(url, type){
    const media = document.querySelector('[data-edit="hero-media"]');
    if(!media) return;
    if(type === 'video'){
      media.innerHTML = `<video autoplay muted loop playsinline><source src="${url}" type="video/mp4"></video>`;
    } else {
      media.innerHTML = `<img src="${url}" alt="" loading="eager">`;
    }
  }

  // ───────── 7. Benefits setter ─────────
  function setBenefits(items){
    const grid = document.querySelector('[data-edit="benefits"]');
    if(!grid || !Array.isArray(items)) return;
    grid.innerHTML = items.map(b => `
      <div class="nx-benefit">
        <div class="nx-benefit-icon">${b.icon || '★'}</div>
        <h4>${b.title || ''}</h4>
        <p>${b.body || ''}</p>
      </div>
    `).join('');
  }

  // ───────── 8. Form bundle presets ─────────
  const FORM_BUNDLES = {
    'lead-basic': {
      title: 'Get in touch',
      sub: 'We reply within 2 business hours.',
      fields: [
        {type:'text',  name:'name',  placeholder:'Full name', required:true},
        {type:'email', name:'email', placeholder:'Email address', required:true},
        {type:'tel',   name:'phone', placeholder:'Phone number', required:true},
      ],
      cta: 'Request a call back'
    },
    'consult-detailed': {
      title: 'Book your free consultation',
      sub: 'Tell us a little about your project.',
      fields: [
        {type:'text',  name:'name',    placeholder:'Full name', required:true},
        {type:'email', name:'email',   placeholder:'Email address', required:true},
        {type:'tel',   name:'phone',   placeholder:'Phone number', required:true},
        {type:'select',name:'budget',  options:['Budget — under AED 25k','AED 25k–75k','AED 75k–250k','AED 250k+'], required:true},
        {type:'textarea',name:'msg',   placeholder:'Brief about your project', rows:3},
      ],
      cta: 'Book my free consultation'
    },
    'booking-slot': {
      title: 'Reserve your spot',
      sub: 'Confirmed instantly. No payment now.',
      fields: [
        {type:'text',  name:'name',  placeholder:'Full name', required:true},
        {type:'email', name:'email', placeholder:'Email address', required:true},
        {type:'tel',   name:'phone', placeholder:'Phone number', required:true},
        {type:'date',  name:'date',  required:true},
        {type:'select',name:'time',  options:['Morning','Afternoon','Evening'], required:true},
      ],
      cta: 'Confirm booking'
    },
    'newsletter-only': {
      title: 'Stay in the loop',
      sub: 'One email a fortnight. Unsubscribe any time.',
      fields: [
        {type:'email', name:'email', placeholder:'Your email', required:true},
      ],
      cta: 'Subscribe'
    }
  };

  // One field's markup. Hidden fields render bare; everything else is wrapped in
  // .nx-field so conditional show/hide can target the whole field.
  function fieldHtml(f){
    const label = f.label || f.placeholder || f.name || '';
    const name  = f.name || slug(label);
    if(f.type === 'hidden') return `<input type="hidden" name="${escAttr(name)}" value="${escAttr(f.value||'')}">`;
    const ph  = f.placeholder != null ? f.placeholder : label;
    const req = f.required ? ' required' : '';
    let inner;
    if(f.type === 'select'){
      inner = `<select class="nx-select" name="${escAttr(name)}" aria-label="${escAttr(label)}"${req}>`
        + `<option value="" disabled selected>${esc(ph || label || 'Select…')}</option>`
        + (f.options||[]).map(o => `<option>${esc(o)}</option>`).join('')
        + `</select>`;
    } else if(f.type === 'textarea'){
      inner = `<textarea class="nx-textarea" name="${escAttr(name)}" placeholder="${escAttr(ph)}" aria-label="${escAttr(label)}" rows="${f.rows||3}"${req}></textarea>`;
    } else if(f.type === 'checkbox'){
      inner = `<label class="nx-check"><input type="checkbox" name="${escAttr(name)}"${req}> <span>${esc(label)}</span></label>`;
    } else if(f.type === 'file'){
      inner = `<input class="nx-input" type="file" name="${escAttr(name)}" aria-label="${escAttr(label)}"${f.accept?` accept="${escAttr(f.accept)}"`:''}${req}>`;
    } else {
      inner = `<input class="nx-input" type="${escAttr(f.type||'text')}" name="${escAttr(name)}" placeholder="${escAttr(ph)}" aria-label="${escAttr(label)}"${req}>`;
    }
    const cond = f.showIfField ? ` data-show-if-field="${escAttr(f.showIfField)}" data-show-if-value="${escAttr(f.showIfValue||'')}"` : '';
    return `<div class="nx-field"${cond}>${inner}</div>`;
  }

  // Render a full form from a model:
  // {title, sub, cta, foot, action, method, steps, fields:[{type,name,label,placeholder,required,rows,options,value,accept,step,showIfField,showIfValue}]}.
  // The model is stashed on the form (data-nx-form-model) so the editor can re-open and edit it.
  function renderForm(model){
    const form = document.querySelector('[data-edit="form"]');
    if(!form) return;
    model = model || {};
    const fields = model.fields || [];
    const steps  = Math.max(1, parseInt(model.steps, 10) || 1);
    const hasFile = fields.some(f => f.type === 'file');
    let html = '';
    if(model.title != null && model.title !== '') html += `<h3 data-field="title">${esc(model.title)}</h3>`;
    if(model.sub != null && model.sub !== '')     html += `<p class="form-sub" data-field="sub">${esc(model.sub)}</p>`;
    const act = model.action
      ? ` action="${escAttr(model.action)}" method="${escAttr(model.method || 'POST')}"${hasFile?' enctype="multipart/form-data"':''}`
      : ' onsubmit="return false"';
    html += `<form${act} data-steps="${steps}">`;
    const cta = `<button class="nx-btn nx-btn-primary" data-field="cta">${esc(model.cta || 'Submit')}</button>`;
    if(steps > 1){
      for(let s = 1; s <= steps; s++){
        html += `<div class="nx-fstep" data-step="${s}"${s>1?' hidden':''}>`;
        fields.filter(f => (f.step||1) === s).forEach(f => html += fieldHtml(f));
        html += `<div class="nx-fnav">`;
        if(s > 1)     html += `<button type="button" class="nx-btn nx-btn-ghost" data-fstep="back">Back</button>`;
        if(s < steps) html += `<button type="button" class="nx-btn nx-btn-primary" data-fstep="next">Next</button>`;
        else          html += cta;
        html += `</div></div>`;
      }
    } else {
      fields.forEach(f => html += fieldHtml(f));
      html += cta;
    }
    if(model.foot !== '') html += `<p class="form-foot">${esc(model.foot || 'We respect your privacy. No spam.')}</p>`;
    html += `</form>`;
    form.innerHTML = html;
    try { form.dataset.nxFormModel = JSON.stringify(model); } catch(e){}
    if(!model.action) wireForms(form);   // real endpoint → let it submit; otherwise client-side thank-you
    wireSteps(form);
    wireConditions(form);
  }

  // Multi-step navigation: show one step at a time, validate before advancing.
  function wireSteps(form){
    const steps = form.querySelectorAll('.nx-fstep');
    if(steps.length < 2) return;
    let cur = 0;
    function show(i){ steps.forEach((s, k) => { s.hidden = k !== i; }); cur = i; }
    form.querySelectorAll('[data-fstep="next"]').forEach(b => b.addEventListener('click', () => {
      const els = steps[cur].querySelectorAll('input,select,textarea');
      for(const el of els){ if(!el.disabled && el.required && !el.checkValidity()){ el.reportValidity(); return; } }
      if(cur < steps.length - 1) show(cur + 1);
    }));
    form.querySelectorAll('[data-fstep="back"]').forEach(b => b.addEventListener('click', () => { if(cur > 0) show(cur - 1); }));
    show(0);
  }

  // Conditional logic: show a field only when another field has a given value
  // (blank target value = "show when the controlling field has any value").
  function wireConditions(form){
    const conds = form.querySelectorAll('[data-show-if-field]');
    if(!conds.length) return;
    function evalAll(){
      conds.forEach(w => {
        const fname = w.getAttribute('data-show-if-field');
        const fval  = w.getAttribute('data-show-if-value') || '';
        let ctrl = null;
        try { ctrl = form.querySelector('[name="' + (window.CSS && CSS.escape ? CSS.escape(fname) : fname) + '"]'); } catch(e){}
        let v = '';
        if(ctrl){ v = ctrl.type === 'checkbox' ? (ctrl.checked ? 'true' : '') : ctrl.value; }
        const show = fval ? (v === fval) : !!v;
        w.style.display = show ? '' : 'none';
        w.querySelectorAll('input,select,textarea').forEach(el => { el.disabled = !show; });
      });
    }
    form.addEventListener('change', evalAll);
    form.addEventListener('input', evalAll);
    evalAll();
  }

  // Preset bundles → model → renderForm.
  function setForm(bundleKey){
    const b = FORM_BUNDLES[bundleKey] || FORM_BUNDLES['lead-basic'];
    renderForm({
      title: b.title, sub: b.sub, cta: b.cta, action: '',
      fields: b.fields.map(f => ({
        type: f.type, name: f.name, label: f.placeholder || f.name,
        required: !!f.required, rows: f.rows,
        options: f.options ? f.options.slice() : undefined
      }))
    });
  }

  // ───────── 9. Footer setter ─────────
  function setFooter(data){
    const f = document.querySelector('[data-edit="footer"]');
    if(!f) return;
    const t = f.querySelector('[data-field="address"]');     if(t && data.address) t.textContent = data.address;
    const e = f.querySelector('[data-field="email"]');       if(e && data.email)   e.textContent = data.email;
    const p = f.querySelector('[data-field="phone"]');       if(p && data.phone)   p.textContent = data.phone;
    const l = f.querySelector('[data-field="legal"]');       if(l && data.legal)   l.textContent = data.legal;
  }

  // ───────── 10. Edit mode (for in-iframe editing) ─────────
  function enableEditMode(){
    document.body.classList.add('nx-edit-mode');
    document.querySelectorAll('[data-edit]').forEach(el => {
      el.style.position = el.style.position || 'relative';
      el.addEventListener('click', e => {
        e.stopPropagation();
        document.querySelectorAll('.nx-edit-focus').forEach(x => x.classList.remove('nx-edit-focus'));
        el.classList.add('nx-edit-focus');
        window.parent.postMessage({type:'nexa-edit-focus', zone: el.dataset.edit}, '*');
      });
    });
  }

  // ───────── 10b. Click-to-edit selection ─────────
  // The editor sets the mode: 'select' (click routes to a drawer field),
  // 'text' (inline contentEditable editing) or 'image' (image picker owns clicks).
  var nxMode = 'select';
  var nxSel = null;
  var TOP_TAGS = ['SECTION','NAV','FOOTER','HEADER','ASIDE','DIV'];

  function setMode(mode){
    nxMode = mode || 'select';
    document.body.classList.toggle('nx-select-mode', nxMode === 'select');
    if(nxMode !== 'select') clearSelected();
  }
  function clearSelected(){ if(nxSel){ nxSel.classList.remove('nx-selected'); nxSel = null; } }
  function markSelected(el){ clearSelected(); if(el){ el.classList.add('nx-selected'); nxSel = el; } }

  function topLevelSections(){
    return Array.prototype.filter.call(document.body.children, function(el){
      return TOP_TAGS.indexOf(el.tagName) > -1;
    });
  }
  function topLevelOf(el){
    var n = el;
    while(n && n.parentNode !== document.body) n = n.parentNode;
    return (n && n.parentNode === document.body) ? n : null;
  }

  // Decide what the user clicked and which drawer field it maps to.
  function describe(el){
    var img = el.closest('img');
    if(img) return { node: img, kind: 'image' };

    var fld = el.closest('[data-field]');
    if(fld){
      var field = fld.getAttribute('data-field');
      var zoneEl = fld.closest('[data-edit]');
      var zone = zoneEl ? zoneEl.getAttribute('data-edit') : '';
      if(zone === 'hero-copy') return { node: fld, kind: 'hero-text', field: field };
      if(zone === 'footer')    return { node: fld, kind: 'footer', field: field };
      // form title / sub / cta and anything else → treat as the form
    }

    var form = el.closest('[data-edit="form"]') || el.closest('.nx-form');
    if(form) return { node: form, kind: 'form' };

    if(el.closest('[data-edit="benefits"]')) {
      var sec0 = topLevelOf(el);
      return { node: sec0 || el, kind: 'section', index: sec0 ? topLevelSections().indexOf(sec0) : -1 };
    }

    var pop = el.closest('.nx-popup');
    if(pop) return { node: pop, kind: 'popup' };

    var cols = el.closest('.nx-cols');
    if(cols) return { node: cols, kind: 'columns' };

    var brand = el.closest('[data-edit="brand"]') || el.closest('nav');
    if(brand) return { node: brand, kind: 'brand' };

    var foot = el.closest('footer');
    if(foot) return { node: foot, kind: 'footer' };

    var sec = topLevelOf(el);
    if(sec){
      var idx = topLevelSections().indexOf(sec);
      if(idx > -1) return { node: sec, kind: 'section', index: idx };
    }
    return null;
  }

  function onSelectClick(e){
    if(nxMode !== 'select') return;            // text / image modes own their clicks
    if(e.target && e.target.isContentEditable) return;
    if(e.target && e.target.closest && e.target.closest('[data-fstep]')) return; // multi-step nav works in canvas
    var d = describe(e.target);
    if(!d) return;
    e.preventDefault();
    e.stopPropagation();
    markSelected(d.node);
    var msg = { type: 'nexa:select', kind: d.kind };
    if(d.field != null) msg.field = d.field;
    if(d.index != null) msg.index = d.index;
    window.parent.postMessage(msg, '*');
  }

  function enableSelect(){
    document.addEventListener('click', onSelectClick, true);
    setMode('select');
  }

  // ───────── 11. PostMessage API (editor drawer → template iframe) ─────────
  window.addEventListener('message', evt => {
    const m = evt.data;
    if(!m || typeof m !== 'object' || !m.type) return;
    switch(m.type){
      case 'nexa:set-theme':       return setTheme(m.value);
      case 'nexa:apply-manifest':  return applyManifest(m.manifest);
      case 'nexa:set-hero':        return setHero(m.value);
      case 'nexa:set-brand':       return setBrand(m.primary, m.secondary);
      case 'nexa:set-logo':        return setLogo(m.url);
      case 'nexa:set-font':        return setFont(m.role, m.family, m.query);
      case 'nexa:add-font':        return addFont(m.family, m.dataUrl, m.format, m.role);
      case 'nexa:set-dir':         return setDir(m.dir, m.lang);
      case 'nexa:set-text':        return setText(m.zone, m.fields);
      case 'nexa:set-hero-media':  return setHeroMedia(m.url, m.mediaType);
      case 'nexa:set-benefits':    return setBenefits(m.items);
      case 'nexa:set-form':        return setForm(m.bundle);
      case 'nexa:set-form-model':  return renderForm(m.model);
      case 'nexa:set-footer':      return setFooter(m.data);
      case 'nexa:enable-edit':     return enableEditMode();
      case 'nexa:set-mode':        return setMode(m.mode);
      case 'nexa:init-carousels':  return initCarousels();
      case 'nexa:init-blocks':     return initBlocks();
      case 'nexa:get-html':
        return evt.source.postMessage({type:'nexa:html', html: document.documentElement.outerHTML}, '*');
    }
  });

  // ───────── 12. Carousel runtime (for block-library carousels) ─────────
  function initCarousels(root){
    (root || document).querySelectorAll('.nx-carousel').forEach(c => {
      if(c._nxInit) return; c._nxInit = true;
      const track = c.querySelector('.nx-carousel-track');
      const slides = c.querySelectorAll('.nx-carousel-slide');
      const dotsWrap = c.querySelector('.nx-carousel-dots');
      if(!track || !slides.length) return;
      let i = 0;
      function go(n){
        i = (n + slides.length) % slides.length;
        track.style.transform = `translateX(-${i*100}%)`;
        if(dotsWrap) dotsWrap.querySelectorAll('.nx-carousel-dot').forEach((d,j)=>d.classList.toggle('active', j===i));
      }
      if(dotsWrap){
        dotsWrap.innerHTML = '';
        slides.forEach((_,j) => {
          const d = document.createElement('button');
          d.className = 'nx-carousel-dot' + (j===0?' active':'');
          d.type = 'button';
          d.addEventListener('click', () => go(j));
          dotsWrap.appendChild(d);
        });
      }
      const prev = c.querySelector('[data-car="prev"]');
      const next = c.querySelector('[data-car="next"]');
      if(prev) prev.addEventListener('click', () => go(i-1));
      if(next) next.addEventListener('click', () => go(i+1));
      go(0);
    });
  }

  // ───────── 13. Countdown timers ─────────
  function initCountdowns(root){
    (root || document).querySelectorAll('.nx-countdown').forEach(cd => {
      if(cd._nxInit) return; cd._nxInit = true;
      // Fixed campaign end-date (data-deadline="2026-07-01T18:00") survives reloads;
      // otherwise fall back to a rolling N-hour window (data-hours).
      const dl = cd.getAttribute('data-deadline');
      let target;
      if(dl){ const t = Date.parse(dl); target = isNaN(t) ? Date.now() + 72*3600*1000 : t; }
      else { const hrs = parseFloat(cd.getAttribute('data-hours') || '72'); target = Date.now() + hrs*3600*1000; }
      const units = [86400000, 3600000, 60000, 1000];
      const nums = cd.querySelectorAll('.nx-cd-num');
      function tick(){
        let diff = Math.max(0, target - Date.now());
        nums.forEach((n, i) => { const v = Math.floor(diff / units[i]); diff -= v * units[i]; n.textContent = String(v).padStart(2, '0'); });
      }
      tick(); cd._t = setInterval(tick, 1000);
    });
  }

  // ───────── 14. Dismissible bars (sticky CTA / announcement) ─────────
  function wireDismiss(root){
    (root || document).querySelectorAll('.nx-stickybar-close, .nx-announce-close').forEach(b => {
      if(b._nxInit) return; b._nxInit = true;
      b.addEventListener('click', () => { const p = b.closest('.nx-stickybar, .nx-announce'); if(p) p.style.display = 'none'; });
    });
  }

  // ───────── 15. Form submit → thank-you state (client-side) ─────────
  function wireForms(root){
    (root || document).querySelectorAll('.nx-form form').forEach(f => {
      if(f._nxInit) return; f._nxInit = true;
      f.addEventListener('submit', e => {
        e.preventDefault();
        const box = f.closest('.nx-form'); if(!box) return;
        box.innerHTML = '<div class="nx-form-success"><div class="nx-form-tick">✓</div><h3>Thank you</h3><p>We have received your details and will be in touch within 2 business hours.</p></div>';
      });
    });
  }

  // ───────── Pop-ups / modals ─────────
  // Hidden by default (hidden attr stays on for export); shown by adding .nx-popup-open.
  // In the editor canvas the popup is revealed so it can be edited.
  function initPopups(root){
    (root || document).querySelectorAll('.nx-popup').forEach(p => {
      if(p._nxInit) return; p._nxInit = true;
      const editor = window.parent !== window;
      const show = () => p.classList.add('nx-popup-open');
      const hide = () => p.classList.remove('nx-popup-open');
      const closeBtn = p.querySelector('.nx-popup-close'), overlay = p.querySelector('.nx-popup-overlay');
      if(closeBtn) closeBtn.addEventListener('click', hide);
      if(overlay) overlay.addEventListener('click', hide);
      if(editor){ show(); return; }            // editable in the canvas
      const trig = p.getAttribute('data-nx-popup-trigger') || 'delay';
      if(trig === 'load') show();
      else if(trig === 'delay'){ const d = parseFloat(p.getAttribute('data-nx-popup-delay') || '5'); setTimeout(show, d * 1000); }
      else if(trig === 'exit'){ document.addEventListener('mouseout', e => { if(e.clientY <= 0 && !p._shown){ p._shown = true; show(); } }); }
      else if(trig === 'click'){ document.addEventListener('click', e => { const t = e.target.closest && e.target.closest('[data-nx-popup-open],a[href="#popup"]'); if(t){ e.preventDefault(); show(); } }); }
    });
  }

  // Umbrella initialiser — safe to call repeatedly (guards via _nxInit)
  function initBlocks(root){ initCarousels(root); initCountdowns(root); wireDismiss(root); wireForms(root); initPopups(root); }

  // Expose globals for in-page debugging / non-iframe use
  window.NEXA = {setTheme,applyManifest,setHero,setBrand,setLogo,setFont,addFont,setDir,setText,setHeroMedia,setBenefits,setForm,renderForm,setFooter,enableEditMode,setMode,enableSelect,clearSelected,initCarousels,initCountdowns,initBlocks,FORM_BUNDLES,THEMES,HERO_LAYOUTS};

  // Auto-init: if loaded with ?edit=1, enable edit mode
  if(location.search.includes('edit=1')) enableEditMode();

  // Wire any interactive blocks present on initial load
  initBlocks();

  // In the editor iframe, turn on click-to-edit selection and tell parent we're ready.
  if(window.parent !== window){
    enableSelect();
    window.parent.postMessage({type:'nexa:ready'}, '*');
  }
})();
