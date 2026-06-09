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

  // Render a full form from a model: {title, sub, cta, foot, action, method, fields:[{type,name,label,placeholder,required,rows,options}]}.
  // The model is stashed on the form (data-nx-form-model) so the editor can re-open and edit it.
  function renderForm(model){
    const form = document.querySelector('[data-edit="form"]');
    if(!form) return;
    model = model || {};
    const fields = model.fields || [];
    let html = '';
    if(model.title != null && model.title !== '') html += `<h3 data-field="title">${esc(model.title)}</h3>`;
    if(model.sub != null && model.sub !== '')     html += `<p class="form-sub" data-field="sub">${esc(model.sub)}</p>`;
    const act = model.action
      ? ` action="${escAttr(model.action)}" method="${escAttr(model.method || 'POST')}"`
      : ' onsubmit="return false"';
    html += `<form${act}>`;
    fields.forEach(f => {
      const label = f.label || f.placeholder || f.name || '';
      const name  = f.name || slug(label);
      const ph    = f.placeholder != null ? f.placeholder : label;
      const req   = f.required ? ' required' : '';
      if(f.type === 'select'){
        html += `<select class="nx-select" name="${escAttr(name)}" aria-label="${escAttr(label)}"${req}>`;
        html += `<option value="" disabled selected>${esc(ph || label || 'Select…')}</option>`;
        (f.options || []).forEach(opt => html += `<option>${esc(opt)}</option>`);
        html += `</select>`;
      } else if(f.type === 'textarea'){
        html += `<textarea class="nx-textarea" name="${escAttr(name)}" placeholder="${escAttr(ph)}" aria-label="${escAttr(label)}" rows="${f.rows||3}"${req}></textarea>`;
      } else if(f.type === 'checkbox'){
        html += `<label class="nx-check"><input type="checkbox" name="${escAttr(name)}"${req}> <span>${esc(label)}</span></label>`;
      } else {
        html += `<input class="nx-input" type="${escAttr(f.type || 'text')}" name="${escAttr(name)}" placeholder="${escAttr(ph)}" aria-label="${escAttr(label)}"${req}>`;
      }
    });
    html += `<button class="nx-btn nx-btn-primary" data-field="cta">${esc(model.cta || 'Submit')}</button>`;
    if(model.foot !== '') html += `<p class="form-foot">${esc(model.foot || 'We respect your privacy. No spam.')}</p>`;
    html += `</form>`;
    form.innerHTML = html;
    try { form.dataset.nxFormModel = JSON.stringify(model); } catch(e){}
    if(!model.action) wireForms(form);   // real endpoint → let it submit; otherwise client-side thank-you
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

  // Umbrella initialiser — safe to call repeatedly (guards via _nxInit)
  function initBlocks(root){ initCarousels(root); initCountdowns(root); wireDismiss(root); wireForms(root); }

  // Expose globals for in-page debugging / non-iframe use
  window.NEXA = {setTheme,setHero,setBrand,setLogo,setFont,addFont,setDir,setText,setHeroMedia,setBenefits,setForm,renderForm,setFooter,enableEditMode,setMode,enableSelect,clearSelected,initCarousels,initCountdowns,initBlocks,FORM_BUNDLES,THEMES,HERO_LAYOUTS};

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
