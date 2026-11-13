// Build landing-page templates from .lp/data/NN.js + .lp/skins.js into templates/.
// Usage: node .lp/build.js [NN ...]    (also prints the TEMPLATES cards for templates.html with --cards)
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'templates');
const SKINS = require('./skins.js');
const ICONS = require('./icons.js');

const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const ico = (n, cls) => ICONS[n] ? `<svg class="nx-ico${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n]}</svg>` : '';
const img = (id, w) => id ? `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w || 1400}&q=78` : '';
const initials = n => String(n).split(/\s+/).filter(w => /^[A-Za-z]/.test(w)).map(w => w[0]).join('').slice(0, 2).toUpperCase();
const idAttr = s => s.id ? ` id="${esc(s.id)}"` : '';
const head = (h, lede, cls) => (h || lede) ? `<div class="nx-section-head${cls ? ' ' + cls : ''}">${h ? `<h2>${esc(h)}</h2>` : ''}${lede ? `<p class="lede">${esc(lede)}</p>` : ''}</div>` : '';

function skinCss(k) {
  const s = SKINS[k];
  const v = [];
  const add = (n, x) => { if (x != null) v.push(`  ${n}:${x};`); };
  add('--font-display', `'${s.fd}',${/Serif|Caslon|Bodoni|Cormorant|Fraunces|Gloock|Literata|Newsreader|Spectral|Young/.test(s.fd) ? 'Georgia,serif' : 'system-ui,sans-serif'}`);
  add('--font-body', `'${s.fb}',system-ui,sans-serif`);
  add('--skin-display-weight', s.dw);
  add('--display-tracking', s.tr);
  if (s.caps) add('--display-case', 'uppercase');
  add('--skin-bg', s.bg); add('--skin-bg-2', s.bg2); add('--skin-ink', s.ink); add('--skin-mute', s.mute); add('--skin-line', s.line);
  add('--skin-primary', s.p); add('--skin-on-primary', s.op);
  add('--skin-radius', s.r); add('--skin-card-radius', s.cr);
  if (s.heroBg) add('--skin-hero-bg', s.heroBg);
  if (s.tint) add('--skin-tint', s.tint);
  if (s.lux) { const l = s.lux; add('--skin-lux-bg', l.bg); add('--skin-lux-bg-2', l.bg2); add('--skin-lux-ink', l.ink); add('--skin-lux-mute', l.mute); add('--skin-lux-line', l.line); add('--skin-lux-primary', l.p); add('--skin-lux-on-primary', l.op); add('--skin-lux-radius', l.r); }
  if (s.dark) { const d = s.dark; add('--skin-dark-bg', d.bg); add('--skin-dark-bg-2', d.bg2); add('--skin-dark-ink', d.ink); add('--skin-dark-mute', d.mute); add('--skin-dark-line', d.line); add('--skin-dark-primary', d.p); add('--skin-dark-on-primary', d.op); }
  let css = `:root{\n${v.join('\n')}\n}`;
  // A committed hero colour (yellow, mustard) needs its own ink.
  if (s.heroBg && /^#f[0-9a-f]d|^#ffd|^#f2b/i.test(s.heroBg)) css += `\n.nx-hero{--hero-ink:${s.ink}}\n.nx-hero .nx-eyebrow::before{opacity:.5}`;
  return css;
}

// ---------- blocks ----------
function features(s) {
  const v = s.variant || 'grid';
  const items = (s.items || []).map((it, i) => {
    return `      <div class="nx-benefit">
        <div class="nx-benefit-icon">${ico(it.icon || 'check')}</div>
        <h4>${esc(it.title)}</h4>
        <p>${esc(it.text)}</p>
      </div>`;
  });
  if (v === 'bento') {
    if (s.img) items.unshift(`      <div class="nx-benefit is-media"><img src="${img(s.img, 1400)}" alt="${esc(s.imgAlt || '')}" loading="lazy"><h4>${esc(s.head)}</h4>${s.lede ? `<p>${esc(s.lede)}</p>` : ''}</div>`);
    return `<section class="nx-section"${idAttr(s)}>
  <div class="container">
    ${s.img ? '' : head(s.head, s.lede)}
    <div class="nx-benefits is-bento" data-edit="benefits">
${items.join('\n')}
    </div>
  </div>
</section>`;
  }
  if (v === 'aside') {
    return `<section class="nx-section"${idAttr(s)}>
  <div class="container nx-aside">
    ${head(s.head, s.lede)}
    <div class="nx-benefits is-list" data-edit="benefits">
${items.join('\n')}
    </div>
  </div>
</section>`;
  }
  const cls = v === 'rows' ? 'is-rows' : ('is-grid' + ((s.items || []).length % 3 === 0 && (s.items || []).length !== 4 ? ' is-3' : ''));
  return `<section class="nx-section"${idAttr(s)}>
  <div class="container">
    ${head(s.head, s.lede, v === 'rows' ? 'is-split' : '')}
    <div class="nx-benefits ${cls}" data-edit="benefits">
${items.join('\n')}
    </div>
  </div>
</section>`;
}
function split(s, alt) {
  const bullets = (s.bullets || []).length ? `<ul class="nx-bullets">${s.bullets.map(b => `<li>${ico('check')}<span>${esc(b)}</span></li>`).join('')}</ul>` : '';
  const media = s.img ? `<div class="nx-split-media"><img src="${img(s.img, 1200)}" alt="${esc(s.imgAlt || '')}" loading="lazy"></div>` : '';
  return `<section class="nx-section nx-split${s.reverse ? ' reverse' : ''}${alt ? ' alt' : ''}"${idAttr(s)}>
  <div class="container">
    ${media}
    <div class="nx-split-copy">
      <h2>${esc(s.head)}</h2>
      <p>${esc(s.text)}</p>
      ${bullets}
      ${s.cta ? `<a href="#form" class="nx-link">${esc(s.cta)} ${ico('arrow')}</a>` : ''}
    </div>
  </div>
</section>`;
}
function stats(s, alt) {
  const items = (s.items || []).map(it => `      <div class="nx-stat"><div class="val">${esc(it.v)}</div><div class="lbl">${esc(it.l)}</div></div>`).join('\n');
  const note = s.note ? `<p class="nx-stats-note">${esc(s.note)}</p>` : '';
  if (s.variant === 'ruled') {
    return `<section class="nx-section${alt ? ' alt' : ''}"${idAttr(s)}>
  <div class="container nx-aside">
    ${head(s.head || '', s.text)}
    <div>
    <div class="nx-stats is-ruled">
${items}
    </div>
    ${note}
    </div>
  </div>
</section>`;
  }
  const n = (s.items || []).length;
  return `<section class="nx-section${alt ? ' alt' : ''}"${idAttr(s)}>
  <div class="container">
    ${head(s.head, s.text)}
    <div class="nx-stats${n === 3 ? ' is-3' : ''}">
${items}
    </div>
    ${note}
  </div>
</section>`;
}
function steps(s, alt) {
  const items = (s.items || []).map((it, i) => `      <div class="nx-step"><div class="nx-step-num">${String(i + 1).padStart(2, '0')}</div><h4>${esc(it.title)}</h4><p>${esc(it.text)}</p></div>`).join('\n');
  return `<section class="nx-section${alt ? ' alt' : ''}"${idAttr(s)}>
  <div class="container">
    ${head(s.head, s.lede)}
    <div class="nx-steps">
${items}
    </div>
  </div>
</section>`;
}
function quotes(s, alt) {
  const v = s.variant || 'pair';
  const items = (s.items || []).map(it => `      <figure class="nx-test">
        <blockquote class="nx-test-quote">${esc(it.q)}</blockquote>
        <figcaption class="nx-test-author"><div class="nx-test-avatar" aria-hidden="true">${esc(initials(it.name))}</div><div><div class="nx-test-name">${esc(it.name)}</div><div class="nx-test-role">${esc([it.role, it.source].filter(Boolean).join(' · '))}</div></div></figcaption>
      </figure>`).join('\n');
  return `<section class="nx-section${alt ? ' alt' : ''}"${idAttr(s)}>
  <div class="container">
    ${head(s.head)}
    <div class="nx-testimonials is-${v}">
${items}
    </div>
  </div>
</section>`;
}
function pricelist(s, alt) {
  const items = (s.items || []).map(it => `      <div class="nx-pl-item"><div class="nx-pl-name">${esc(it.name)}</div><div class="nx-pl-price">${esc(it.price)}</div>${it.desc ? `<div class="nx-pl-desc">${esc(it.desc)}</div>` : ''}</div>`).join('\n');
  const single = (s.items || []).length < 5;
  return `<section class="nx-section${alt ? ' alt' : ''}"${idAttr(s)}>
  <div class="container">
    ${head(s.head, s.lede, 'is-split')}
    <div class="nx-pricelist${single ? ' is-single' : ''}">
${items}
    </div>
    ${s.note ? `<p class="nx-pl-note">${esc(s.note)}</p>` : ''}
  </div>
</section>`;
}
function faq(s, alt) {
  const items = (s.items || []).map(it => `      <details><summary>${esc(it.q)}</summary><p>${esc(it.a)}</p></details>`).join('\n');
  if (s.variant === 'aside') {
    return `<section class="nx-section${alt ? ' alt' : ''}"${idAttr(s)}>
  <div class="container nx-aside">
    ${head(s.head)}
    <div class="nx-faq">
${items}
    </div>
  </div>
</section>`;
  }
  return `<section class="nx-section${alt ? ' alt' : ''}"${idAttr(s)}>
  <div class="container">
    ${head(s.head)}
    <div class="nx-faq">
${items}
    </div>
  </div>
</section>`;
}
function gallery(s, alt) {
  const im = (s.imgs || []).map(g => `<img src="${img(g.img, 1000)}" alt="${esc(g.alt || '')}" loading="lazy">`).join('');
  const n = (s.imgs || []).length;
  return `<section class="nx-section nx-gallery${alt ? ' alt' : ''}"${idAttr(s)}>
  <div class="container">
    ${head(s.head)}
    <div class="nx-gallery-grid is-mosaic${n === 3 ? ' is-3' : ''}">${im}</div>
  </div>
</section>`;
}
function band(s) {
  return `<section class="nx-band"${idAttr(s)}>
  <div class="nx-band-media"><img src="${img(s.img, 2000)}" alt="${esc(s.imgAlt || '')}" loading="lazy"></div>
  <div class="container">
    <h2>${esc(s.head)}</h2>
    ${s.text ? `<p>${esc(s.text)}</p>` : ''}
  </div>
</section>`;
}
function checklist(s, alt) {
  return `<section class="nx-section${alt ? ' alt' : ''}"${idAttr(s)}>
  <div class="container">
    ${head(s.head, s.text)}
    <ul class="nx-checklist">${(s.items || []).map(i => `<li>${esc(i)}</li>`).join('')}</ul>
  </div>
</section>`;
}
function people(s, alt) {
  const items = (s.items || []).map(p => `      <div class="nx-person">
        ${p.img ? `<div class="nx-person-img"><img src="${img(p.img, 800)}" alt="${esc(p.imgAlt || p.name)}" loading="lazy"></div>` : `<div class="nx-person-mono" aria-hidden="true">${esc(initials(p.name))}</div>`}
        <h4>${esc(p.name)}</h4>
        <div class="nx-person-role">${esc(p.role)}</div>
        <p>${esc(p.bio)}</p>
      </div>`).join('\n');
  return `<section class="nx-section${alt ? ' alt' : ''}"${idAttr(s)}>
  <div class="container">
    ${head(s.head, s.lede)}
    <div class="nx-people">
${items}
    </div>
  </div>
</section>`;
}
function compare(s, alt) {
  const cols = s.cols || [];
  const th = cols.map((c, i) => `<th${i === 1 ? ' class="us"' : ''} scope="col">${esc(c)}</th>`).join('');
  const rows = (s.rows || []).map(r => `<tr>${r.map((c, i) => i === 0 ? `<td>${esc(c)}</td>` : `<td class="${i === 1 ? 'us' : 'them'}">${esc(c)}</td>`).join('')}</tr>`).join('');
  return `<section class="nx-section${alt ? ' alt' : ''}"${idAttr(s)}>
  <div class="container">
    ${head(s.head)}
    <div class="nx-compare-wrap"><table class="nx-compare"><thead><tr>${th}</tr></thead><tbody>${rows}</tbody></table></div>
  </div>
</section>`;
}
function notice(s, alt) {
  return `<section class="nx-section${alt ? ' alt' : ''}"${idAttr(s)}>
  <div class="container">
    <div class="nx-notice">${ico(s.icon || 'badge')}<div><h3>${esc(s.head)}</h3><p>${esc(s.text)}</p></div></div>
  </div>
</section>`;
}
const BLOCKS = { features, split, stats, steps, quotes, pricelist, faq, gallery, band, checklist, people, compare, notice };

// ---------- page ----------
function render(k, d) {
  const s = SKINS[k];
  const hero = s.hero;
  const formInHero = hero === 'BF' || hero === 'SF';
  const ids = d.sections.filter(x => x.id).map(x => x.id);
  const navLinks = d.nav.map((n, i) => `<a href="#${esc(ids[i] || 'form')}">${esc(n)}</a>`).join('\n      ');
  const h = d.hero;
  const firstId = ids[0] || 'form';
  const cta2Href = h.cta2 ? '#' + (ids.find(id => d.nav[ids.indexOf(id)] && h.cta2.toLowerCase().includes(String(d.nav[ids.indexOf(id)]).toLowerCase().split(' ')[0])) || firstId) : '';
  const ctas = `<div class="ctas">
        <a href="#form" class="nx-btn nx-btn-primary" data-field="cta">${esc(h.cta)}</a>${h.cta2 ? `\n        <a href="${cta2Href}" class="nx-link">${esc(h.cta2)} ${ico('arrow')}</a>` : ''}
      </div>`;
  const note = h.note ? `\n      <p class="nx-hero-note">${esc(h.note)}</p>` : '';
  const heroImg = h.img ? `<img src="${img(h.img, 2000)}" alt="${esc(h.imgAlt || '')}" loading="eager" fetchpriority="high">` : '';
  let heroAttr, heroInner;
  if (hero === 'BF') {
    heroAttr = 'class="nx-hero is-bleed" data-hero="form-right"';
    heroInner = `<div data-edit="hero-copy">
      <span class="nx-eyebrow" data-field="eyebrow">${esc(h.eyebrow)}</span>
      <h1 data-field="headline">${esc(h.headline)}</h1>
      <p class="sub" data-field="subhead">${esc(h.sub)}</p>
      ${ctas}${note}
    </div>
    <div class="nx-form" id="form" data-edit="form"></div>
    <div class="nx-hero-media" data-edit="hero-media">${heroImg}</div>`;
  } else if (hero === 'SF') {
    heroAttr = 'class="nx-hero" data-hero="form-right"';
    heroInner = `<div data-edit="hero-copy">
      <span class="nx-eyebrow" data-field="eyebrow">${esc(h.eyebrow)}</span>
      <h1 data-field="headline">${esc(h.headline)}</h1>
      <p class="sub" data-field="subhead">${esc(h.sub)}</p>
      ${ctas}${note}
    </div>
    <div class="nx-form" id="form" data-edit="form"></div>
    <div class="nx-hero-media" data-edit="hero-media">${heroImg}</div>`;
  } else if (hero === 'IS') {
    heroAttr = 'class="nx-hero" data-hero="image-split"';
    heroInner = `<div data-edit="hero-copy">
      <span class="nx-eyebrow" data-field="eyebrow">${esc(h.eyebrow)}</span>
      <h1 data-field="headline">${esc(h.headline)}</h1>
      <p class="sub" data-field="subhead">${esc(h.sub)}</p>
      ${ctas}${note}
    </div>
    <div class="nx-hero-media" data-edit="hero-media">${heroImg}</div>`;
  } else {
    heroAttr = 'class="nx-hero is-type" data-hero="centred"';
    heroInner = `<div data-edit="hero-copy">
      <span class="nx-eyebrow" data-field="eyebrow">${esc(h.eyebrow)}</span>
      <h1 data-field="headline">${esc(h.headline)}</h1>
      <div class="nx-hero-copy-row">
        <p class="sub" data-field="subhead">${esc(h.sub)}</p>
        <div>
      ${ctas}${note}
        </div>
      </div>
    </div>
    <div class="nx-hero-media" data-edit="hero-media">${heroImg}</div>`;
  }

  const trust = d.trust && (d.trust.items || []).length ? `<div class="nx-trust">
  <div class="container">
    <div class="nx-trust-label">${esc(d.trust.label)}</div>
    <div class="nx-trust-items">${d.trust.items.map(t => `<span class="nx-trust-item">${esc(t)}</span>`).join('')}</div>
  </div>
</div>
` : '';

  // Alternate background rhythm: never two tinted sections in a row; bands reset it.
  let ai = d.trust && (d.trust.items || []).length ? 0 : 1;
  const body = d.sections.map((sec) => {
    const fn = BLOCKS[sec.type];
    if (!fn) throw new Error(k + ': unknown block ' + sec.type);
    if (sec.type === 'band') { ai = 0; return fn(sec); }
    return fn(sec, (ai++) % 2 === 1);
  }).join('\n\n');

  const f = d.footer || {};
  const fs_ = d.formSection || {};
  const contactLines = [f.phone ? `<span>Call <a href="tel:${esc(f.phone.replace(/[^+\d]/g, ''))}">${esc(f.phone)}</a></span>` : '', f.email ? `<span>Email <a href="mailto:${esc(f.email)}">${esc(f.email)}</a></span>` : '', f.hours ? `<span>${esc(f.hours)}</span>` : ''].filter(Boolean).join('');
  const formSection = formInHero ? '' : `<section class="nx-section nx-formsec alt">
  <div class="container">
    <div class="nx-formsec-copy">
      <h2 class="nx-section-title">${esc(fs_.head || d.form.title)}</h2>
      ${fs_.text ? `<p>${esc(fs_.text)}</p>` : ''}
      ${(fs_.points || []).length ? `<ul class="nx-formsec-points">${fs_.points.map(p => `<li>${ico('check')}<span>${esc(p)}</span></li>`).join('')}</ul>` : ''}
      ${contactLines ? `<div class="nx-formsec-contact">${contactLines}</div>` : ''}
    </div>
    <div class="nx-form" id="form" data-edit="form"></div>
  </div>
</section>
`;

  const finalCls = s.final || '';
  const fin = d.final ? `<section class="nx-final-cta${finalCls ? ' ' + finalCls : ''}">
  <div class="container">
    <div>
      <h2>${esc(d.final.head)}</h2>
      ${d.final.sub ? `<p class="lede">${esc(d.final.sub)}</p>` : ''}
    </div>
    <a href="#form" class="nx-btn nx-btn-primary">${esc(d.final.cta)}</a>
  </div>
</section>
` : '';

  const domain = (f.email || '').split('@')[1] || '';
  const model = {
    title: d.form.title, sub: d.form.sub, cta: d.form.cta, foot: d.form.foot || '', action: '',
    steps: d.form.steps || 1,
    fields: (d.form.fields || []).map(x => { const o = { type: x.type, name: x.name, label: x.label, required: !!x.required }; if (x.options) o.options = x.options; if (x.rows) o.rows = x.rows; if (x.step) o.step = x.step; if (x.placeholder) o.placeholder = x.placeholder; return o; })
  };
  const year = 2026;
  const html = `<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${esc(d.title)}</title>
<meta name="description" content="${esc(d.metaDesc)}"/>
<meta property="og:title" content="${esc(d.title)}"/>
<meta property="og:description" content="${esc(d.metaDesc)}"/>
<meta property="og:type" content="website"/>
${h.img ? `<meta property="og:image" content="${img(h.img, 1200)}"/>\n` : ''}<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${s.gf}" rel="stylesheet">
<link rel="stylesheet" href="./_shared/kit.css">
<style id="nx-skin">
${skinCss(k)}
</style>
</head>
<body data-theme="${s.t}"${s.input ? ` data-input="${s.input}"` : ''}>

<nav class="nx-nav" data-edit="brand">
  <div class="container">
    <a href="#" class="nx-logo">${esc(d.brand)}</a>
    <div class="nx-nav-links">
      ${navLinks}
    </div>
    <a href="#form" class="nx-nav-cta">${esc(d.navCta)}</a>
  </div>
</nav>

<section ${heroAttr}>
  <div class="container">
    ${heroInner}
  </div>
</section>

${trust}
${body}

${formSection}
${fin}
<footer class="nx-footer" data-edit="footer">
  <div class="container">
    <div class="nx-footer-grid">
      <div class="nx-footer-brand">
        <div class="nx-logo">${esc(d.brand)}</div>
        <p>${esc(f.tagline || '')}</p>
      </div>
      <div class="nx-footer-col"><h5>Visit</h5><span data-field="address">${esc(f.address || '')}</span>${f.hours ? `<span>${esc(f.hours)}</span>` : ''}</div>
      <div class="nx-footer-col"><h5>Contact</h5><a data-field="email" href="mailto:${esc(f.email || '')}">${esc(f.email || '')}</a><a data-field="phone" href="tel:${esc((f.phone || '').replace(/[^+\d]/g, ''))}">${esc(f.phone || '')}</a></div>
      <div class="nx-footer-col"><h5>Legal</h5><a href="#">Privacy notice</a><a href="#">Terms of use</a><a href="#">Cookie settings</a></div>
    </div>
    <div class="nx-footer-foot">
      <span data-field="legal">© ${year} ${esc(d.brand)}.${f.legal ? ' ' + esc(f.legal) : ''}</span>
      <div class="nx-social"><a href="#">Instagram</a><a href="#">LinkedIn</a></div>
    </div>
  </div>
</footer>

<script src="./_shared/kit.js"></script>
<script>NEXA.renderForm(${JSON.stringify(model).replace(/</g, '\\u003c')});</script>
</body>
</html>
`;
  return html;
}

const only = process.argv.slice(2).filter(a => /^\d\d$/.test(a));
const cards = [];
const keys = Object.keys(SKINS).sort().filter(k => !only.length || only.includes(k));
let n = 0;
for (const k of keys) {
  const p = path.join(__dirname, 'data', k + '.js');
  if (!fs.existsSync(p)) { console.log('skip ' + k + ' (no data)'); continue; }
  delete require.cache[require.resolve(p)];
  const d = require(p);
  fs.writeFileSync(path.join(OUT, d.file), render(k, d));
  n++;
  cards.push(`  {id:'${d.file.replace('.html', '')}',name:${JSON.stringify(d.name)},industry:${JSON.stringify(d.industry)},goal:${JSON.stringify(d.goal)},\n    desc:${JSON.stringify(d.desc)}}`);
}
console.log('Wrote ' + n + ' templates.');
if (process.argv.includes('--cards')) fs.writeFileSync(path.join(__dirname, 'cards.txt'), cards.join(',\n'));
