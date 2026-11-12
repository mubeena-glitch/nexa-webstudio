// Lint landing-page data files: node .lp/lint.js [NN NN ...]
const fs = require('fs'), path = require('path');
const DIR = path.join(__dirname, 'data');
const IMGS = new Set(fs.readFileSync(path.join(__dirname, 'IMAGES.txt'), 'utf8').split(/\r?\n/).map(l => l.split(' | ')[0].trim()).filter(Boolean));
const BANNED = [/\belevat/i, /\bunlock/i, /seamless/i, /transform your/i, /revolutioni[sz]/i, /cutting[- ]edge/i, /world[- ]class/i, /effortless/i, /game[- ]chang/i, /next[- ]level/i, /\bempower/i, /supercharg/i, /\bunleash/i, /\bdelve/i, /tapestry/i, /hassle[- ]free/i, /state[- ]of[- ]the[- ]art/i, /best[- ]in[- ]class/i, /look no further/i, /in today'?s/i, /experience the difference/i, /one[- ]stop[- ]shop/i, /tailored solutions/i, /peace of mind/i, /\bnestled/i, /got you covered/i, /\bNEXA\b/i, /\bJatin\b/i, /\bAcme\b/, /lorem/i, /your brand/i, /john doe/i, /\bjourney\b/i];
const ICONS = 'arrow check calendar clock pin phone mail shield key bed cup leaf sun bolt car tooth pulse stethoscope paw scissors home wrench hammer ruler compass briefcase scale chart wallet card globe plane camera users user book cap dumbbell spark chat doc lock truck box tag star drop flame plug panel hand gift mic ticket building layers eye smile utensils map wave mountain baby heart badge clipboard receipt percent refresh route flower bottle bell laptop code signal coin play'.split(' ');
const TYPES = ['features', 'split', 'stats', 'steps', 'quotes', 'pricelist', 'faq', 'gallery', 'band', 'checklist', 'people', 'compare', 'notice'];
const only = process.argv.slice(2);
let total = 0;
const files = fs.readdirSync(DIR).filter(f => /^\d\d\.js$/.test(f) && (!only.length || only.includes(f.slice(0, 2))));
const names = new Map();
for (const f of files) {
  const errs = [];
  let d;
  try { delete require.cache[require.resolve(path.join(DIR, f))]; d = require(path.join(DIR, f)); } catch (e) { console.log(f, 'LOAD ERROR', e.message); total++; continue; }
  const strings = [];
  (function walk(o, p) { if (typeof o === 'string') strings.push([p, o]); else if (o && typeof o === 'object') for (const k in o) walk(o[k], p + '.' + k); })(d, '');
  for (const [p, s] of strings) {
    if (/[–—]/.test(s)) errs.push('dash at ' + p);
    if (/\s-\s/.test(s)) errs.push('spaced hyphen at ' + p);
    if (/!/.test(s)) errs.push('exclamation at ' + p);
    if (/<[a-z]/i.test(s)) errs.push('html at ' + p);
    for (const re of BANNED) if (re.test(s)) errs.push('banned ' + re + ' at ' + p + ': ' + s.slice(0, 60));
    if (/\b[A-Z][a-z]+ [A-Z]\.(\s|$|,)/.test(s) && !/[A-Z]\.[A-Z]/.test(s)) errs.push('initial-only name? ' + p + ': ' + s.slice(0, 60));
    if (/^photo-/.test(s) && !IMGS.has(s)) errs.push('unknown image ' + s + ' at ' + p);
  }
  ['file', 'name', 'industry', 'goal', 'desc', 'title', 'metaDesc', 'brand', 'nav', 'navCta', 'hero', 'sections', 'form', 'final', 'footer'].forEach(k => { if (!d[k]) errs.push('missing ' + k); });
  if (d.hero) { ['eyebrow', 'headline', 'sub', 'cta'].forEach(k => { if (!d.hero[k]) errs.push('missing hero.' + k); }); if (d.hero.headline && d.hero.headline.length > 70) errs.push('headline too long'); }
  (d.sections || []).forEach((s, i) => {
    if (!TYPES.includes(s.type)) errs.push('bad section type ' + s.type);
    (s.items || []).forEach(it => { if (it && it.icon && !ICONS.includes(it.icon)) errs.push('bad icon ' + it.icon); });
    (s.items || []).forEach(it => { if (it && it.name && s.type !== 'pricelist') { if (names.has(it.name) && names.get(it.name) !== f) errs.push('name reused ' + it.name + ' (also ' + names.get(it.name) + ')'); names.set(it.name, f); } });
  });
  if (d.form) (d.form.fields || []).forEach(x => { if (!x.label || !x.type) errs.push('bad field ' + JSON.stringify(x)); });
  if (errs.length) { console.log(f + ':\n  ' + errs.join('\n  ')); total += errs.length; }
}
console.log(files.length + ' files, ' + total + ' problems');
process.exitCode = total ? 1 : 0;
