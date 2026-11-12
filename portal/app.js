/* NEXA Web Studio client portal (prototype).
   One client journey: brief chat -> prompt -> sitemap -> concepts (choose or mix) -> wireframes -> inner pages
   -> submit -> build -> staging -> plan and payment -> live. Every gate is an explicit approval, logged with a time.
   State is kept in this browser only (localStorage). Prices and terms below are EXAMPLES for NEXA leadership to set:
   they all live in catalog.js so they can be changed in one place. */
(function () {
  "use strict";
  const $ = id => document.getElementById(id);
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const KEY = "nexa-portal-v2";
  const NC = window.NexaConcepts;
  const now = () => new Date().toISOString();
  const when = s => new Date(s).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

  /* ---------------- state ---------------- */
  const fresh = () => ({ a: {}, stage: "brief", editing: null, prompt: "", promptAsks: [], sitemap: null, concepts: { ready: false, sel: null, mode: "pick", mix: null, notes: {}, view: null },
    wf: null, inner: { ready: false, tab: 0 }, submittedAt: null, build: 0, changes: [], plan: null, paid: false, hostNow: null, live: false, log: [],
    rounds: { concept: 0, inner: 0, staging: 0 }, need: {}, terms: false, billing: "monthly", invoices: [], requests: [], usedHours: 0, view: "project", model: "monthly" });
  let S;
  try { S = JSON.parse(localStorage.getItem(KEY) || "null") || fresh(); } catch (e) { S = fresh(); }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
  const log = what => { S.log.push({ t: now(), what, by: S.a.name || "Client" }); };
  const toast = t => { const el = $("toast"); el.textContent = t; el.classList.add("on"); clearTimeout(toast.h); toast.h = setTimeout(() => el.classList.remove("on"), 2600); };

  /* ---------------- the brief ---------------- */
  const C = window.NexaCatalog, LIB = () => window.NexaLibrary || { THEMES: [], TEMPLATES: [] };
  const SECTORS = ["Real estate", "Hospitality", "Tourism", "Events", "Healthcare", "Education", "Finance", "Technology", "Retail", "Food and drink", "Automotive", "Professional services", "Government", "Non-profit", "Energy and industry", "Media and entertainment", "Other"];
  const EXPERIENCE = C.EXPERIENCE.map(x => [x[0], x[1]]);
  const PAGES_DEF = Object.fromEntries(C.TYPES.map(t => [t.v, t.pages]));

  const Q = [
    { id: "name", ask: () => "Hello, I'm Web Studio. Let's shape your project together. Answer what you can and skip anything you're not sure about. What should I call you?", type: "text", ph: "Your name" },
    { id: "company", ask: a => `Nice to meet you${a.name ? ", " + a.name : ""}. Which company or brand is this for?`, type: "text", ph: "Company or brand" },
    { id: "email", ask: () => "Where should we send updates about your project?", type: "email", ph: "name@company.com" },
    { id: "type", ask: () => "What are we building? Pick the closest; we shape the rest together.", type: "pick", opts: C.TYPES.map(t => [t.v, t.d, t.g, t.label]) },
    { id: "users", ask: () => "Who will log in or use it?", sub: "Pick everyone who needs access.", type: "multi", opts: C.USERS, cond: a => C.lineOf(a.type) === "platform" },
    { id: "pfeatures", ask: () => "Which of these does the platform need?", sub: "Each adds build time. We confirm everything with you in a scoping workshop.", type: "cards", opts: C.PFEATURES.map(x => [x[0], x[1]]), cond: a => C.lineOf(a.type) === "platform" },
    { id: "data", ask: () => "Where does the data or content come from?", type: "multi", opts: C.DATA_SRC, cond: a => C.lineOf(a.type) === "platform" },
    { id: "residency", ask: () => "Does the data need to stay in the UAE?", type: "single", opts: C.RESIDENCY, cond: a => C.lineOf(a.type) === "platform" },
    { id: "sector", ask: () => "Which sector are you in?", type: "single", opts: SECTORS },
    { id: "pages", ask: a => `Roughly how many pages will the ${(a.type || "site").toLowerCase()} need? A guess is fine; we'll firm it up in the sitemap.`, type: "slider", min: 1, max: 60, def: a => PAGES_DEF[a.type] || 8 },
    { id: "goals", ask: () => "What should it achieve? Pick all that apply.", type: "multi", opts: C.GOALS },
    { id: "audience", ask: () => "Who is it for? Describe your ideal visitor in a sentence.", type: "text", ph: "For example: families in Dubai looking for their first home" },
    { id: "template", ask: () => "Want to start from one of our proven landing pages? They are tested to convert and make the build even faster.", sub: "Pick one to start from, or design from scratch. Preview opens the full page.", type: "templates", cond: a => C.lineOf(a.type) === "lp" },
    { id: "style", ask: () => "Which style feels most like you?", type: "pick", opts: C.STYLES.map(x => [x.v, x.d, null, x.label]) },
    { id: "looks", ask: () => "Now pick up to three looks you like from our design library.", sub: "Designs from the NEXA studio. Filter by family. We use your picks as direction, never as a copy.", type: "themes" },
    { id: "work", ask: () => "Here is some of our own work. Anything you like?", sub: "Pick any that inspire you, then tell us what you like about each.", type: "work" },
    { id: "experience", ask: () => "Any of these experiences? They lift the site and can move you up a plan.", type: "cards", opts: EXPERIENCE },
    { id: "motion", ask: () => "How much movement do you want?", type: "pick", opts: C.MOTION.map(m => [m[0], m[1]]) },
    { id: "brandMode", ask: () => "Let's talk brand. Where should your colours and fonts come from?", type: "single", opts: [["upload", "I'll upload my brand files"], ["site", "Take it from my current website"], ["suggest", "Suggest a look for me"], ["manual", "I'll enter colours and fonts"]] },
    { id: "brandFiles", ask: () => "Upload your brand guidelines, logo or fonts.", sub: "PDF, images or font files. In this prototype only the file names are kept.", type: "files", cond: a => a.brandMode === "upload" },
    { id: "currentSite", ask: () => "What's your current website address?", type: "url", ph: "https://", cond: a => a.brandMode === "site" },
    { id: "colours", ask: () => "Pick your brand colours, main colour first.", type: "colours", cond: a => a.brandMode === "manual" },
    { id: "fonts", ask: () => "And your fonts, if you know them.", type: "fonts", cond: a => a.brandMode === "manual" },
    { id: "refs", ask: () => "Any other websites you love? Add up to five and tell us what you like about each.", type: "urls" },
    { id: "content", ask: () => "How ready is your content?", type: "single", opts: ["Copy and images are ready", "Some of it is ready", "We need help with all of it"] },
    { id: "languages", ask: () => "Which languages?", type: "multi", opts: C.LANGUAGES },
    { id: "stack", ask: () => "Which platform should we build on?", sub: "Not sure? Use our recommendation, worked out from your answers so far.", type: "pick", opts: C.STACKS.map(x => [x[0], x[1]]), info: a => stackInfo(a) },
    { id: "stackSetup", ask: a => (C.SETUP[a.stack] || {}).ask || "", type: "single", get opts() { return (C.SETUP[S.a.stack] || { opts: [] }).opts; }, info: a => setupInfo(a), cond: a => !!C.SETUP[a.stack] },
    { id: "domain", ask: () => "Do you already have a domain name?", type: "single", opts: ["Yes, I have one", "No, help me get one"] },
    { id: "hosting", ask: () => "When it's ready, how should we put it live?", type: "single", opts: [["nexa", "NEXA hosts it for me"], ["dns", "I'll add the DNS records you send me"], ["access", "I'll give you access to my domain and hosting"], ["later", "Decide later"]] },
    { id: "timeline", ask: () => "When do you need it?", type: "single", opts: ["As soon as possible", "Within a month", "In 1 to 3 months", "I'm flexible"] },
    { id: "addons", ask: () => "Last choices. Pick any add-ons.", sub: "Monthly prices shown. If you pay once, the one-time price applies; ongoing services stay monthly.", type: "addons" },
    { id: "integrations", ask: () => "Which systems should we connect?", type: "multi", opts: C.INTEGRATIONS, cond: a => (a.addons || []).includes("Integrations") },
    { id: "transLangs", ask: () => "Which languages should we translate into?", type: "text", ph: "For example: Arabic, French", cond: a => (a.addons || []).includes("Translation") },
    { id: "notes", ask: () => "Anything else we should know?", type: "textarea", ph: "Competitors, must-haves, things to avoid…" }
  ];
  const LBL = { name: "Your name", company: "Company or brand", email: "Email for updates", type: "Building", sector: "Sector", pages: "Pages", goals: "Goals", audience: "Audience", style: "Style", experience: "Experiences", motion: "Motion", brandMode: "Brand source", brandFiles: "Brand files", currentSite: "Current website", colours: "Colours", fonts: "Fonts", refs: "References", content: "Content", languages: "Languages", stack: "Platform", domain: "Domain", hosting: "Going live", timeline: "Timing", addons: "Add-ons", integrations: "Integrations", transLangs: "Translate into", notes: "Notes", users: "Who logs in", pfeatures: "Platform features", data: "Data from", residency: "Data residency", template: "Starting template", looks: "Looks you like", work: "NEXA work you like", stackSetup: "Platform set-up" };
  const optVal = o => Array.isArray(o) ? o[0] : o, optLbl = o => Array.isArray(o) ? o[1] : o;
  const live = () => Q.filter(q => !q.cond || q.cond(S.a));
  const nextQ = () => live().find(q => !(q.id in S.a));
  const fmtAns = (q, v) => {
    if (v === null || v === undefined || (Array.isArray(v) && !v.length) || v === "") return "Skipped";
    if (q.type === "pick") { const o = q.opts.find(x => x[0] === v); return (o && o[3] ? o[3] : v) + (q.id === "stack" && S.a.stackAuto ? " (recommended)" : ""); }
    if (q.type === "templates") { if (v === "scratch") return "Design from scratch"; const t = LIB().TEMPLATES.find(x => x.id === v); return t ? t.name : v; }
    if (q.type === "themes") return v.map(id => (LIB().THEMES.find(x => x.id === id) || { name: id }).name).join(", ");
    if (q.type === "work") return v.map(id => (C.WORK.find(x => x.id === id) || { name: id }).name).join(", ");
    if (q.type === "single") { const o = q.opts.find(x => optVal(x) === v); return o ? optLbl(o) : v; }
    if (Array.isArray(v)) {
      if (q.type === "urls") return v.map(r => r.url + (r.note ? " (" + r.note + ")" : "")).join(", ");
      if (q.type === "colours") return v.join("  ");
      return v.join(", ");
    }
    if (q.type === "fonts") return [v.head, v.body].filter(Boolean).join(" / ") || "Skipped";
    if (q.type === "slider") return v + (v === 1 ? " page" : " pages");
    return String(v);
  };

  /* ---------------- plan ---------------- */
  /* EXAMPLE commercial model, from catalog.js. NEXA leadership sets the real numbers. */
  const TIERS = C.TIERS, PRICE = C.PRICE, INCL = C.INCL, LIM = C.LIM;
  /* Plan score. The kind of project (landing page, website, platform) sets the starting plan; size and features move it up. */
  function score(a) {
    const r = [], add = (l, p) => { if (p) r.push([l, p]); };
    const T = C.TYPE[a.type] || C.TYPE.Website, line = T.line, pg = a.pages || T.pages || 1;
    add(pg + (pg === 1 ? " page" : " pages"), pg <= 5 ? .5 : pg <= 10 ? 1 : pg <= 20 ? 2.5 : pg <= 30 ? 3 : 4);
    add(T.label || T.v, T.pts);
    const ex = a.experience || [], EXP = Object.fromEntries(C.EXPERIENCE.map(x => [x[0], x[3]]));
    ex.forEach(e => add(e, EXP[e]));
    add(a.motion + " motion", { Expressive: 1, Cinematic: 2 }[a.motion] || 0);
    add(a.style + " style", ["Luxury", "Artistic", "Dark and cinematic"].includes(a.style) ? .5 : 0);
    add(a.stack, { "Custom build (Next.js)": 2, "Shopify": 1 }[a.stack] || 0);
    (a.integrations || []).forEach(i => add(i, C.HEAVY_INT.includes(i) ? 1.5 : 1));
    const PF = Object.fromEntries(C.PFEATURES.map(x => [x[0], x[3]])); (a.pfeatures || []).forEach(f => add(f, PF[f]));
    const langs = (a.languages || []).length;
    add("Extra languages", langs > 1 ? (langs - 1) * ((a.languages || []).includes("Arabic") ? 1.5 : 1) : 0);
    const pts = r.reduce((s, x) => s + x[1], 0);
    if (line === "platform") return { pts, r, tier: 4, line };
    const ni = (a.integrations || []).length, big = ex.filter(e => (C.EXPERIENCE.find(x => x[0] === e) || [])[4]).length;
    const c = Math.max(pts < 4 ? 0 : pts < 9 ? 1 : 2, pg <= 10 ? 0 : pg <= 25 ? 1 : 2, ni <= 1 ? 0 : ni <= 3 ? 1 : 2, big === 0 ? 0 : big === 1 ? 1 : 2, langs <= 1 ? 0 : langs <= 2 ? 1 : 2);
    const tier = line === "lp" && c === 0 && pg <= LIM.pages[0] ? 0 : c + 1;
    return { pts, r, tier: Math.min(3, tier), line };
  }
  /* Which plans to offer for this kind of project. */
  const tierWindow = () => ({ lp: [0, 1, 2], site: [1, 2, 3], platform: [3, 4] })[C.lineOf(S.a.type)] || [1, 2, 3];
  const MODEL_NAME = Object.fromEntries(C.MODELS.map(m => [m[0], m[1]]));
  function terms() {
    const md = S.model || "monthly", L = [];
    if (md === "monthly") L.push(`Monthly plan with a ${PRICE.minMonths}-month minimum, then month to month. Pay yearly and pay ${PRICE.annualPaysMonths} months for 12. Hosting, maintenance and your monthly change hours are included.`, "Building starts once the first month is paid and we have your content and access.");
    else L.push(`One-time build: ${Math.round(PRICE.deposit * 100)}% to start, the rest before go-live. Building starts once the deposit is paid and we have your content and access.`,
      md === "onceCare" ? `Care plan from go-live: hosting, maintenance (updates, security patches, backups, uptime checks) and your monthly change hours. ${PRICE.minMonths}-month minimum, then month to month.` : `No maintenance plan: we fix any defect in our build for ${PRICE.warrantyDays} days after go-live. After that, changes and updates are AED ${PRICE.extraHour} an hour, quoted first. Hosting is yours to arrange, or add a care plan at any time.`);
    L.push("Each approval in this portal is final for that step. Changes after an approval are change requests, quoted before any work starts.",
      `Your plan includes a set number of change rounds per step. Extra rounds are AED ${PRICE.extraRound} each.`,
      md === "monthly" ? `Your domain and content are yours from day one. The design and code pass to you once ${PRICE.minMonths} months are paid, or earlier by paying the remaining months.` : "Your domain and content are yours from day one. The design and code are yours from the final payment.",
      "Licences for third-party platforms (for example HubSpot, Shopify, Webflow or plugins) are paid to the provider and are not part of our price.",
      "Prices exclude 5% VAT.");
    return L;
  }
  const aed = n => "AED " + Math.round(n).toLocaleString("en-GB");
  const tierOf = () => S.plan == null ? score(S.a).tier : S.plan;
  function addonLines() {
    const a = S.a; return (a.addons || []).map(x => {
      const A = C.ADDON[x] || { m: 0, o: null }; let k = 1, l = x;
      if (x === "Integrations") { k = Math.max(1, (a.integrations || []).length); l = `Integrations (${k})`; }
      if (x === "Translation") { k = Math.max(1, String(a.transLangs || "").split(/[,&]| and /).filter(z => z.trim()).length); l = `Translation (${k} language${k === 1 ? "" : "s"})`; }
      return { l, m: A.m * k, o: A.o == null ? null : A.o * k };
    });
  }
  function monthly(t) {
    const ad = addonLines().map(x => [x.l, x.m]), sub = PRICE.plans[t] + ad.reduce((s, x) => s + x[1], 0);
    return { plan: PRICE.plans[t], ad, sub, vat: sub * PRICE.vat, total: sub * (1 + PRICE.vat) };
  }
  /* The price in a payment model. up: paid before go-live; rec: each month after go-live; dueNow: today. All include VAT. */
  function quote(t, md) {
    md = md || S.model || "monthly"; const v = 1 + PRICE.vat, L = addonLines();
    if (md === "monthly") { const m = monthly(t); return { md, lines: [[TIERS[t].name + " plan", m.plan], ...m.ad], recLines: [], up: m.total, rec: m.total, dueNow: m.total, vat: m.vat }; }
    const lines = [[TIERS[t].name + " build", PRICE.once[t]], ...L.filter(x => x.o != null).map(x => [x.l, x.o])];
    const recLines = [...(md === "onceCare" ? [["Care plan", PRICE.care[t]]] : []), ...L.filter(x => x.o == null).map(x => [x.l, x.m])];
    const up = lines.reduce((s, x) => s + x[1], 0), rec = recLines.reduce((s, x) => s + x[1], 0);
    return { md, lines, recLines, up: up * v, rec: rec * v, dueNow: up * v * PRICE.deposit, vat: up * PRICE.vat, recVat: rec * PRICE.vat };
  }
  const hoursFor = t => (S.model || "monthly") === "once" ? 0 : LIM.hours[t];
  function priceLine(t) {
    const q = quote(t), f = TIERS[t].from ? "from " : "";
    return q.md === "monthly" ? `${f}${aed(q.rec)} a month including VAT` : `${f}${aed(q.up)} one-time including VAT${q.rec ? `, then ${aed(q.rec)} a month` : ""}`;
  }
  function priceBox(t) {
    const q = quote(t), f = TIERS[t].from ? "From " : "", h = LIM.hours[t], hrsTxt = `${h} change hour${h === 1 ? "" : "s"} a month`;
    const rows = q.lines.map(([l, n]) => `<div><span>${esc(l)}</span><span>${f}${aed(n)}</span></div>`).join("");
    if (q.md === "monthly") return `<div class="money">${rows}<div><span>VAT 5%</span><span>${aed(q.vat)}</span></div><div class="tot"><b>Monthly total</b><b>${f}${aed(q.rec)}</b></div></div><p class="pnote">Build, hosting, maintenance and ${hrsTxt} included. ${PRICE.minMonths}-month minimum. Nothing large up front.</p>`;
    const rec = q.recLines.map(([l, n]) => `<div><span>${esc(l)}</span><span>${aed(n)}</span></div>`).join("");
    return `<div class="money">${rows}<div><span>VAT 5%</span><span>${aed(q.vat)}</span></div><div class="tot"><b>One-time total</b><b>${f}${aed(q.up)}</b></div>${rec ? `<div class="sub2"><span class="lbl">Then each month</span></div>${rec}<div><span>VAT 5%</span><span>${aed(q.recVat)}</span></div><div class="tot"><b>Monthly total</b><b>${aed(q.rec)}</b></div>` : ""}</div><p class="pnote">${q.md === "onceCare" ? `Care plan: hosting, maintenance and ${hrsTxt}.` : `No maintenance: a ${PRICE.warrantyDays}-day fix guarantee, then ${aed(PRICE.extraHour)} an hour. Hosting is yours to arrange.`} ${Math.round(PRICE.deposit * 100)}% to start, the rest before go-live.</p>`;
  }
  /* Build time in working hours. A landing page is 2 to 4 hours end to end; pages after the first reuse the same
     system, so they add far less (about 45 minutes each up to 10 pages, 30 minutes after that). Features add on top.
     Platforms carry their own base hours and are shown in weeks for the first release. */
  function est(a) {
    const T = C.TYPE[a.type] || C.TYPE.Website, pg = Math.max(1, S.sitemap ? S.sitemap.length : (a.pages || T.pages || 1)), r = [], add = (l, h) => { if (h) r.push([l, h]); };
    add("First page, set-up, checks and go-live", 2.5);
    add(`${pg - 1} more page${pg === 2 ? "" : "s"}`, Math.min(pg - 1, 9) * .75 + Math.max(0, pg - 10) * .5);
    add(T.label || T.v, T.h);
    if (a.template && a.template !== "scratch") add("Starting from a proven template", -1);
    const EX = Object.fromEntries(C.EXPERIENCE.map(x => [x[0], x[2]])); (a.experience || []).forEach(e => add(e, EX[e]));
    add(a.motion + " motion", C.MOTION_H[a.motion] || 0);
    const PF = Object.fromEntries(C.PFEATURES.map(x => [x[0], x[2]])); (a.pfeatures || []).forEach(f => add(f, PF[f]));
    add(a.stack, { "Custom build (Next.js)": 4, "Shopify": 2 }[a.stack] || 0);
    (a.integrations || []).forEach(i => add(i, C.HEAVY_INT.includes(i) ? 4 : 2));
    const langs = Math.max(0, (a.languages || []).length - 1); add("Extra languages", langs * pg * .3 + ((a.languages || []).includes("Arabic") ? 2 : 0));
    (a.addons || []).forEach(x => { const A = C.ADDON[x]; if (!A) return; add(x, /copywriting/i.test(x) ? pg * .5 : A.h); });
    const lo = Math.max(2, r.reduce((s, x) => s + x[1], 0)), hi = lo * (lo <= 6 ? 1.5 : 1.3);
    let text;
    if (hi <= 8) text = `${Math.max(2, Math.floor(lo))} to ${Math.max(4, Math.ceil(hi))} hours`;
    else if (hi <= 80) { const d1 = Math.max(1, Math.round(lo / 8)), d2 = Math.max(d1 + 1, Math.ceil(hi / 8)); text = `${d1} to ${d2} working days`; }
    else { const w1 = Math.max(2, Math.round(lo / 40)), w2 = Math.max(w1 + 1, Math.ceil(hi / 40)); text = `${w1} to ${w2} weeks for the first release`; }
    return { lo, hi, text, r, pg };
  }
  const roundsLeft = k => LIM[k][tierOf()] - S.rounds[k];
  function roundNote(k) { const L = LIM[k][tierOf()], u = S.rounds[k]; return u < L ? `Change round ${u + 1} of ${L} included in your plan.` : `You've used the ${L} included round${L === 1 ? "" : "s"}. More rounds are ${aed(PRICE.extraRound)} each, added to your next invoice.`; }
  function useRound(k, what) { const extra = roundsLeft(k) <= 0; S.rounds[k]++; log(what + (extra ? ` (extra round, ${aed(PRICE.extraRound)})` : ` (round ${S.rounds[k]} of ${LIM[k][tierOf()]})`)); }

  /* ---------------- stages and progress ---------------- */
  const STAGES = [["brief", "Brief", 15], ["prompt", "Prompt", 5], ["sitemap", "Sitemap", 10], ["concepts", "Concepts", 20], ["wireframes", "Wireframes", 8], ["inner", "Inner pages", 12], ["submit", "Submit", 5], ["pay", "Start plan", 4], ["build", "Build", 13], ["staging", "Staging", 5], ["live", "Live", 3]];
  const sIdx = k => STAGES.findIndex(s => s[0] === k);
  function pct() {
    const i = sIdx(S.stage); let p = STAGES.slice(0, i).reduce((s, x) => s + x[2], 0);
    if (S.stage === "brief") { const L = live(); p += 15 * (L.filter(q => q.id in S.a).length / L.length); }
    if (S.stage === "build") p += 13 * (S.build / 4);
    if (S.live) p = 100;
    return Math.round(p);
  }
  function go(stage, what) { if (what) log(what); S.stage = stage; S.editing = null; save(); draw(); window.scrollTo({ top: 0, behavior: "smooth" }); }

  /* ---------------- band ---------------- */
  function drawBand() {
    const p = pct(), i = sIdx(S.stage);
    $("pct").textContent = p + "%"; $("pbar").style.width = p + "%";
    $("steps").innerHTML = STAGES.map((s, k) => `<span class="${S.live || k < i ? "done" : k === i ? "cur" : ""}">${s[1]}</span>`).join("");
    const sc = score(S.a), chosen = S.plan == null ? sc.tier : S.plan;
    $("planname").textContent = TIERS[chosen].name + (S.plan == null ? " (recommended)" : "");
    $("pmark").style.left = Math.min(98, Math.max(2, sc.pts / 14 * 100)) + "%";
    $("tiers").innerHTML = tierWindow().map(k => [TIERS[k], k]).map(([t, k]) => `<button class="tier ${k === sc.tier ? "rec" : ""} ${k === chosen ? "sel" : ""}" type="button" data-tier="${k}" aria-pressed="${k === chosen}">${k === sc.tier ? `<span class="tag">Recommended</span>` : `<span class="tag" style="visibility:hidden">.</span>`}<b>${t.name}</b><small>${t.desc}</small><small><b style="font-size:12px;color:var(--ink)">${t.from ? "from " : ""}${aed(PRICE.plans[k])}</b> a month</small></button>`).join("");
    const note = $("plnote");
    if (chosen < sc.tier) {
      const top = sc.r.slice().sort((x, y) => y[1] - x[1]).filter(x => !/pages$/.test(x[0])).slice(0, 3).map(x => x[0]);
      note.hidden = false; note.textContent = `Your choices fit ${TIERS[sc.tier].name}. To stay on ${TIERS[chosen].name}, consider dropping: ${top.join(", ") || "some pages"}.`;
    } else note.hidden = true;
    $("projname").textContent = S.a.company ? S.a.company + (S.a.type ? " · " + S.a.type : "") : "Your new project";
  }

  /* ---------------- side ---------------- */
  function drawSide() {
    const a = S.a, chosen = tierOf(), m = monthly(chosen), e = est(a);
    const host = { nexa: "NEXA hosts it", dns: "Client adds DNS records", access: "Access to domain and hosting", later: "Decide later" }[a.hosting] || "Not chosen yet";
    const rows = [["Building", a.type], ["Sector", a.sector], ["Pages", S.sitemap ? S.sitemap.length : a.pages], ["Style", a.style], ["Platform", a.stack], ["Going live", host]].filter(x => x[1] != null && x[1] !== "");
    $("side").innerHTML = `
      <section class="card"><h3>Your project</h3><div class="kv">${rows.length ? rows.map(([k, v]) => `<div><span>${k}</span><b>${esc(v)}</b></div>`).join("") : `<p style="margin:0;color:var(--muted)">Your answers appear here as you go.</p>`}</div>
        ${a.type ? `<div class="eta" style="margin-top:12px;padding:12px 14px"><div><span class="lbl">Build time</span><br><b style="font-size:18px">${e.text}</b></div><span style="font-size:11.5px;color:var(--ink2);flex:1 1 140px">From when we have your content and access.</span></div>` : ""}</section>
      <section class="card"><h3>Your price <span class="lbl" style="float:right;color:var(--warn)">Example prices</span></h3>
        <div class="mtabs">${C.MODELS.map(([k, l]) => `<button type="button" data-model="${k}" aria-pressed="${(S.model || "monthly") === k}">${l}</button>`).join("")}</div>
        ${priceBox(chosen)}</section>
      <section class="card"><h3>Need a person?</h3><p style="margin:0 0 10px;font-size:13px;color:var(--ink2)">Most things are done right here, but a person is always one click away.</p><div class="row2"><button class="btn" type="button" id="helpcall">Book a 15-minute call</button><button class="skip" type="button" id="helpmsg">Message the team</button></div></section>
      <section class="card"><h3>Approvals</h3>${S.log.length ? `<ul class="log">${S.log.slice().reverse().slice(0, 5).map(l => `<li><div>${esc(l.what)}<small>${when(l.t)}${l.by ? " · " + esc(l.by) : ""}</small></div></li>`).join("")}</ul>${S.log.length > 5 ? `<p class="mut" style="margin:8px 0 0;font-size:12px">And ${S.log.length - 5} earlier, all in your record.</p>` : ""}<div class="row2" style="margin-top:10px"><button class="skip" type="button" id="record">Download my project record</button></div>` : `<p style="margin:0;color:var(--muted);font-size:13px">Every step you approve is recorded here with the time and your name, so we always build exactly what you signed off.</p>`}</section>`;
  }

  /* ---------------- brief view ---------------- */
  const AV = `<div class="av"><svg viewBox="0 0 24 24"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M6.3 6.3l2.1 2.1M15.6 15.6l2.1 2.1M6.3 17.7l2.1-2.1M15.6 8.4l2.1-2.1"/></svg></div>`;
  const bot = h => `<div class="msg">${AV}<div class="bub">${h}</div></div>`;
  const me = (h, id) => `<div class="msg me"><div class="bub" data-edit="${id}" title="Change this answer">${h}<small>Change</small></div></div>`;
  let draft = {};
  function control(q) {
    const v = draft[q.id] !== undefined ? draft[q.id] : q.id in S.a ? S.a[q.id] : (q.def ? q.def(S.a) : undefined);
    draft[q.id] = v;
    switch (q.type) {
      case "text": case "email": case "url": return `<input class="in" id="qin" type="${q.type === "email" ? "email" : q.type === "url" ? "url" : "text"}" placeholder="${esc(q.ph || "")}" value="${esc(v || "")}">`;
      case "textarea": return `<textarea class="in" id="qin" placeholder="${esc(q.ph || "")}">${esc(v || "")}</textarea>`;
      case "single": return `<div class="chips">${q.opts.map(o => `<button class="chip" type="button" data-pick="${esc(optVal(o))}" aria-pressed="${v === optVal(o)}">${esc(optLbl(o))}</button>`).join("")}</div>`;
      case "multi": return `<div class="chips">${q.opts.map(o => `<button class="chip" type="button" data-tog="${esc(o)}" aria-pressed="${(v || []).includes(o)}">${esc(o)}</button>`).join("")}</div>`;
      case "cards": return `<div class="cards">${q.opts.map(([o, d]) => `<button class="opt" type="button" data-tog="${esc(o)}" aria-pressed="${(v || []).includes(o)}"><b>${esc(o)}</b><span>${esc(d)}</span></button>`).join("")}</div>`;
      case "slider": return `<div class="slider"><input type="range" id="qin" min="${q.min}" max="${q.max}" value="${v || 1}" aria-label="Number of pages"><b id="qout">${v || 1}</b></div>`;
      case "colours": { const st = (NC.STYLE[S.a.style] || NC.STYLE.Simple).pal, c = v || [st[1], st[0], st[3]]; return `<div class="sw">${["Main brand colour", "Dark or text colour", "Light background"].map((l, i) => `<label>${l}<input type="color" data-col="${i}" value="${esc(c[i] || "#ffffff")}"></label>`).join("")}</div>`; }
      case "fonts": { const f = v || {}; return `<div class="row2"><input class="in" id="fh" placeholder="Headings font, for example Playfair Display" value="${esc(f.head || "")}" style="flex:1 1 220px"><input class="in" id="fb" placeholder="Body font, for example Inter" value="${esc(f.body || "")}" style="flex:1 1 220px"></div>`; }
      case "files": return `<input type="file" id="qin" multiple><div class="files" id="qfiles">${(v || []).map(esc).join(", ")}</div>`;
      case "pick": return pickHtml(q, v);
      case "addons": return addonsHtml(v);
      case "themes": return themesHtml(v);
      case "templates": return templatesHtml(v);
      case "work": return workHtml(v);
      case "urls": { const L = (v && v.length ? v : [{ url: "", note: "" }]); return `<div style="display:flex;flex-direction:column;gap:8px" id="urls">${L.map((r, i) => `<div class="row2"><input class="in" data-url="${i}" placeholder="https://" value="${esc(r.url)}" style="flex:1 1 220px"><input class="in" data-note="${i}" placeholder="What you like about it" value="${esc(r.note)}" style="flex:1 1 220px"></div>`).join("")}</div>${L.length < 5 ? `<button class="skip" type="button" id="addurl" style="align-self:flex-start">+ Add another</button>` : ""}`; }
    }
    return "";
  }
  /* Rich choice controls: grouped cards, add-ons with prices, the design library, templates and NEXA work. */
  function pickHtml(q, v) {
    const gs = [...new Set(q.opts.map(o => o[2] || ""))];
    return gs.map(g => `${g ? `<span class="lbl gh">${esc(g)}</span>` : ""}<div class="cards">${q.opts.filter(o => (o[2] || "") === g).map(o => `<button class="opt" type="button" data-pick="${esc(o[0])}" aria-pressed="${v === o[0]}"><b>${esc(o[3] || o[0])}</b><span>${esc(o[1])}</span></button>`).join("")}</div>`).join("");
  }
  function addonsHtml(v) {
    const sel = v || [], gs = [...new Set(C.ADDONS.map(x => x[2]))];
    return gs.map(g => `<span class="lbl gh">${esc(g)}${g === "AI" ? " · from NEXA AI Lab" : ""}</span><div class="cards">${C.ADDONS.filter(x => x[2] === g).map(([n, d, , m, o]) => `<button class="opt" type="button" data-tog="${esc(n)}" aria-pressed="${sel.includes(n)}"><b>${esc(n)}</b><span>${esc(d)}</span><span class="pr">+ ${aed(m)} a month${o != null ? ` · or ${aed(o)} once` : ""}</span></button>`).join("")}</div>`).join("");
  }
  function themesHtml(v) {
    const sel = v || [], T = LIB().THEMES, fams = [...new Set(T.map(t => t.family))], f = draft._fam || C.STYLE_FAMILY[S.a.style] || "all";
    const list = f === "all" ? T : T.filter(t => t.family === f);
    return `<div class="chips fam">${["all", ...fams].map(x => `<button class="chip" type="button" data-tfam="${x}" aria-pressed="${x === f}">${x === "all" ? "All " + T.length : x[0].toUpperCase() + x.slice(1)}</button>`).join("")}</div>
      <div class="gal">${list.map(t => `<button class="gcard" type="button" data-tog="${esc(t.id)}" aria-pressed="${sel.includes(t.id)}"><span class="gimg"><img src="/portal/gal/theme-${esc(t.id)}.jpg" alt="" loading="lazy" onerror="this.remove()"></span><span class="gm"><b>${esc(t.name)}</b><small>${esc(t.sector)}</small><i class="dots">${t.pal.map(c => `<em style="background:${esc(c)}"></em>`).join("")}</i></span><span class="tick" aria-hidden="true">&#10003;</span></button>`).join("")}</div>
      <p class="mut gsel">${sel.length} of 3 picked${sel.length ? ": " + sel.map(id => esc((T.find(t => t.id === id) || { name: id }).name)).join(", ") : ""}</p>`;
  }
  const SECTOR_IND = { "Real estate": ["Real Estate", "Architecture", "Interior Design", "Construction"], "Hospitality": ["Hospitality", "Travel", "Wellness", "F&B"], "Tourism": ["Travel", "Hospitality"], "Events": ["Events"], "Healthcare": ["Healthcare", "Dental", "Wellness", "Beauty"], "Education": ["Education", "Childcare", "Coaching"], "Finance": ["Finance", "Insurance"], "Technology": ["SaaS / Tech"], "Retail": ["E-commerce", "Beauty"], "Food and drink": ["F&B"], "Automotive": ["Automotive"], "Professional services": ["Professional Services", "Legal", "Recruitment", "Coaching"], "Non-profit": ["Non-profit"], "Energy and industry": ["Energy", "Construction"], "Media and entertainment": ["Creative", "Events"] };
  function templatesHtml(v) {
    const T = LIB().TEMPLATES, inds = SECTOR_IND[S.a.sector] || [], all = draft._tall || !inds.length || !T.some(t => inds.includes(t.industry));
    const list = all ? T : T.filter(t => inds.includes(t.industry));
    return `<div class="gal tpl">${list.map(t => `<div class="gcard${v === t.id ? " on" : ""}"><button type="button" data-pick="${esc(t.id)}" aria-pressed="${v === t.id}"><span class="gimg"><img src="/templates/_thumbs/${esc(t.id)}.jpg" alt="" loading="lazy" onerror="this.remove()"></span><span class="gm"><b>${esc(t.name)}</b><small>${esc(t.industry)} · ${esc(t.goal)}</small></span></button><a class="gprev" href="/templates/${esc(t.id)}.html" target="_blank" rel="noopener">Preview</a></div>`).join("")}
      <div class="gcard scratch${v === "scratch" ? " on" : ""}"><button type="button" data-pick="scratch" aria-pressed="${v === "scratch"}"><span class="gm"><b>Design from scratch</b><small>A fully custom design, made for your brand.</small></span></button></div></div>${!all ? `<button class="skip" type="button" id="tall">See all ${T.length} templates</button>` : ""}`;
  }
  function workHtml(v) {
    const sel = v || [], likes = draft.workLikes = draft.workLikes || S.a.workLikes || {};
    return `<div class="gal work">${C.WORK.map(w => `<div class="gcard${sel.includes(w.id) ? " on" : ""}"><button type="button" data-tog="${w.id}" aria-pressed="${sel.includes(w.id)}"><span class="gimg"><img src="/portal/gal/work-${w.id}.jpg" alt="" loading="lazy" onerror="this.remove()"></span><span class="gm"><b>${esc(w.name)}</b><small>${esc(w.what)}</small><span class="tags">${w.tags.map(x => `<i>${esc(x)}</i>`).join("")}</span></span><span class="tick" aria-hidden="true">&#10003;</span></button>${sel.includes(w.id) ? `<div class="likes"><span class="lbl">What do you like about it?</span><div class="chips">${C.LIKES.map(l => `<button class="chip sm" type="button" data-like="${w.id}|${l}" aria-pressed="${(likes[w.id] || []).includes(l)}">${l}</button>`).join("")}</div></div>` : ""}<a class="gprev" href="${esc(w.url)}" target="_blank" rel="noopener">Visit the live site</a></div>`).join("")}</div>`;
  }
  function stackInfo(a) {
    const [st, why] = C.recStack(a);
    return `<div class="recbox"><span class="lbl p">Our recommendation for you</span><b>${esc(st)}</b><ul>${why.map(w => `<li>${esc(w)}</li>`).join("")}</ul><button class="btn pri" type="button" data-pick="Recommend for me">Use ${esc(st)}</button></div>`;
  }
  function setupInfo(a) {
    const st = C.SETUP[a.stack];
    return st ? `<div class="infobox"><span class="lbl p">How ${esc(a.stack)} works with us</span><ul>${st.info.map(w => `<li>${esc(w)}</li>`).join("")}</ul></div>` : "";
  }
  function redrawBrief() { const y = window.scrollY; drawBrief(true); window.scrollTo(0, y); }
  function readControl(q) {
    const el = $("qin");
    switch (q.type) {
      case "text": case "email": case "url": case "textarea": return (el.value || "").trim() || null;
      case "slider": return +el.value;
      case "single": case "multi": case "cards": case "pick": case "addons": case "themes": case "templates": case "work": return draft[q.id] == null || (Array.isArray(draft[q.id]) && !draft[q.id].length) ? null : draft[q.id];
      case "colours": return [...document.querySelectorAll("[data-col]")].map(x => x.value);
      case "fonts": { const h = $("fh").value.trim(), b = $("fb").value.trim(); return h || b ? { head: h, body: b } : null; }
      case "files": return draft[q.id] && draft[q.id].length ? draft[q.id] : null;
      case "urls": { const r = [...document.querySelectorAll("[data-url]")].map((x, i) => ({ url: x.value.trim(), note: (document.querySelector(`[data-note="${i}"]`) || {}).value || "" })).filter(x => x.url); return r.length ? r : null; }
    }
  }
  function drawBrief(noScroll) {
    const L = live(), cur = S.editing ? L.find(q => q.id === S.editing) : nextQ();
    let h = `<div class="chat">`;
    const done = []; for (const q of L) { if (cur && q.id === cur.id) break; if (q.id in S.a) done.push(q); }
    const older = cur ? done.slice(0, Math.max(0, done.length - 2)) : [], recent = cur ? done.slice(older.length) : [];
    if (older.length) h += `<div class="sofar"><div class="sh"><span class="lbl p">Your answers so far</span><span class="mut">${older.length + recent.length} of ${L.length} · click any answer to change it</span></div><div class="sg">${older.map(q => `<button type="button" data-edit="${q.id}"><span>${esc(LBL[q.id] || q.id)}</span><b>${esc(fmtAns(q, S.a[q.id]))}</b></button>`).join("")}</div></div>`;
    for (const q of recent) h += bot(esc(q.ask(S.a))) + me(esc(fmtAns(q, S.a[q.id])), q.id);
    if (cur) {
      h += bot(esc(cur.ask(S.a)));
      h += `<div class="ask ask-${cur.type}">${cur.sub ? `<div class="sub" style="margin-top:0">${esc(cur.sub)}</div>` : ""}${cur.info ? cur.info(S.a) : ""}${control(cur)}<div class="row2"><button class="btn pri" type="button" id="qok">Continue</button><button class="skip" type="button" id="qskip">Skip for now</button>${S.editing ? `<button class="skip" type="button" id="qcancel">Cancel</button>` : ""}</div></div>`;
    } else {
      h += bot("That's everything I need. Here's your brief. Check it, change anything by clicking it, then build your prompt.");
      h += `<div class="stage"><h2>Your brief</h2><div class="review">${L.map(q => `<div data-edit="${q.id}" style="cursor:pointer"><span>${esc(LBL[q.id] || q.id)}</span><b style="font-weight:500">${esc(fmtAns(q, S.a[q.id]))}</b></div>`).join("")}</div>
        <div class="gate"><button class="btn pri big" type="button" id="buildprompt">Build my prompt</button><span class="note">Your prompt is the instruction set your concepts are designed from. You can refine it before anything is designed.</span></div></div>`;
    }
    $("main").innerHTML = h + `</div>`;
    const qi = $("qin"); if (qi && cur && ["text", "email", "url"].includes(cur.type)) qi.focus({ preventScroll: true });
    const target = document.querySelector(".ask") || document.querySelector(".stage"); if (!noScroll && target && (S.editing || live().some(q => q.id in S.a))) target.scrollIntoView({ block: "center", behavior: "smooth" });
  }
  function answer(skip) {
    const q = S.editing ? live().find(x => x.id === S.editing) : nextQ(); if (!q) return;
    let v = skip ? null : readControl(q);
    if (!skip && q.type === "email" && v && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) { toast("That email address doesn't look right."); return; }
    if (!skip && q.type === "url" && v && !/^https?:\/\//i.test(v)) v = "https://" + v;
    S.a[q.id] = v; delete draft[q.id];
    if (q.id === "work") S.a.workLikes = draft.workLikes || {};
    if (q.id === "type" && !("pages" in S.a)) draft.pages = PAGES_DEF[v] || 8;
    S.editing = null; save(); draw();
  }

  /* ---------------- prompt ---------------- */
  /* The design prompt: everything a designer (or a design model) needs to produce a finished-looking homepage concept. */
  const STYLE_DIR = {
    "Minimal": { feel: "calm, precise and confident", type: "a clean grotesque sans for everything, large headings with tight leading, very few weights", colour: "mostly white or off-white with one strong accent used sparingly", layout: "generous white space, a strict 12-column grid, few elements per screen, hairline dividers", imagery: "quiet, well-lit photography with plenty of negative space", tone: "short, plain sentences; say less, mean more" },
    "Luxury": { feel: "exclusive, unhurried and assured", type: "an elegant high-contrast serif for display headings paired with a refined sans for body text, wide letter-spacing on small uppercase labels", colour: "deep, rich base tones (charcoal, ink, sand or emerald) with a single metallic or warm accent", layout: "full-bleed imagery, asymmetric compositions, large margins, slow reveal of content", imagery: "editorial, art-directed photography with natural light, texture and detail close-ups", tone: "understated and evocative; never salesy" },
    "Simple": { feel: "friendly, clear and easy", type: "one rounded or humanist sans in two or three weights", colour: "a bright, approachable primary colour on white, soft tinted backgrounds for sections", layout: "obvious hierarchy, card-based sections, clear buttons, nothing hidden", imagery: "real people and real places, warm and honest", tone: "conversational and helpful" },
    "Retro": { feel: "playful, nostalgic and characterful", type: "a period display face (70s soft serif or 90s grotesque) with a neutral sans for body", colour: "warm vintage tones such as mustard, burnt orange, teal and cream", layout: "framed sections, badges, rounded shapes and visible borders", imagery: "film-grain photography, duotones and illustrated details", tone: "warm, witty and personal" },
    "Artistic": { feel: "expressive, surprising and crafted", type: "an expressive display face used large, with a quiet sans for reading", colour: "a bold, unexpected palette with one signature colour", layout: "broken grids, overlapping layers, oversized type and generous canvas", imagery: "illustration, collage or art-directed photography with a strong point of view", tone: "imaginative and confident" },
    "Editorial": { feel: "intelligent, curated and story-led", type: "a magazine serif for headlines with a crisp sans for body, clear typographic scale, pull quotes", colour: "restrained neutrals with one ink accent", layout: "magazine-style columns, strong typographic hierarchy, mixed image sizes, captions", imagery: "documentary and portrait photography", tone: "thoughtful and articulate, story first" },
    "Bold": { feel: "energetic, direct and memorable", type: "a heavy condensed or wide display sans in capitals, set very large", colour: "high contrast: a saturated signature colour against black or white", layout: "big blocks of colour, oversized numbers and headlines, strong edges", imagery: "punchy, high-contrast photography and graphic shapes", tone: "short, punchy and confident" },
    "Dark and cinematic": { feel: "moody, dramatic and immersive", type: "a refined high-contrast display serif or condensed sans, set large over imagery, with a quiet sans for body", colour: "near-black and deep tones with one warm metallic or luminous accent", layout: "full-screen scenes, slow reveals, generous negative space, text over imagery with careful contrast", imagery: "cinematic, low-key photography and video with real depth", tone: "evocative and sparse" },
    "Futuristic": { feel: "precise, advanced and forward-looking", type: "a geometric or technical sans with tight tracking, monospace for small data labels", colour: "deep navy or black with one electric accent, used for lines and highlights", layout: "modular grids, thin rules, data-like details, layered depth", imagery: "product renders, abstract light and clean technical photography", tone: "clear, confident and specific" },
    "Corporate and trustworthy": { feel: "reassuring, established and competent", type: "a sturdy humanist or grotesque sans across headings and body", colour: "navy or deep blue with white and a single supporting accent", layout: "clear grids, consistent cards, obvious paths to key services", imagery: "authentic people at work, places and results; no staged handshakes", tone: "plain, factual and confident" },
    "Organic and natural": { feel: "calm, grounded and warm", type: "a soft serif for headings with a rounded sans for body", colour: "earthy greens, sand, clay and off-white", layout: "soft curves, natural textures, relaxed spacing", imagery: "natural light, materials, plants and people outdoors", tone: "warm and sincere" },
    "Heritage and Arabic-inspired": { feel: "rooted, crafted and proud of place", type: "a classical display face with a refined Arabic pairing; Arabic typography treated as a feature, not an afterthought", colour: "warm sand, deep brown and gold, with indigo or teal accents", layout: "symmetry, arches and geometric pattern used with restraint", imagery: "architecture, craft, landscape and culture of the region", tone: "respectful, warm and confident" },
    "Playful": { feel: "fun, friendly and full of energy", type: "a rounded, characterful display face with a friendly sans", colour: "bright, happy colours on warm light backgrounds", layout: "rounded shapes, stickers, playful illustrations and lively rhythm", imagery: "joyful people, illustration and colour pops", tone: "light, witty and kind" },
    "Swiss and structured": { feel: "rational, crisp and timeless", type: "one strong grotesque in a strict typographic scale, flush-left", colour: "black and white with one signal colour", layout: "a visible modular grid, strong alignment, generous margins", imagery: "precise photography cropped to the grid", tone: "direct and economical" },
    "Glass and gradient": { feel: "soft, modern and luminous", type: "a geometric sans with generous weight contrast", colour: "soft multi-tone gradients with translucent layers, kept subtle and readable", layout: "layered cards with depth, floating elements, clear hierarchy on top", imagery: "abstract gradients, 3D renders and product shots", tone: "friendly and modern" },
    "Brutalist": { feel: "raw, honest and unforgettable", type: "a monospace or blunt grotesque at extreme sizes", colour: "black, white and one loud primary", layout: "exposed grid, hard borders, deliberate tension, no decoration", imagery: "unretouched photography and stark graphics", tone: "blunt and confident" }
  };
  const GOAL_DIR = {
    "Generate leads": "Primary action: an enquiry form (3 to 5 fields) visible in the first screen on desktop and one tap away on mobile, repeated near the end of the page.",
    "Sell online": "Primary action: shop the range. Featured products with price and quick add to basket, clear delivery and returns reassurance.",
    "Bookings": "Primary action: book. A booking bar (date, guests or service) in the hero and a sticky Book now button on mobile.",
    "Build the brand": "Lead with the brand story: a striking hero statement, what makes the brand different, and proof such as awards, press or numbers.",
    "Inform and educate": "Make information easy to find: clear topic entry points, search, and short summaries that link to detail pages.",
    "Recruit": "Show the culture: people, values and open roles, with a clear route to apply.",
    "Sell tickets or registrations": "Primary action: register or buy tickets. Dates, price and availability are always visible, with a sticky register button.",
    "Showcase our work": "Lead with the work: large, beautifully cropped projects with filters and short stories, then a clear way to get in touch.",
    "Share data and insights": "Lead with the headline numbers, then let people explore: filters, comparisons and downloadable reports.",
    "Serve customers online": "Let customers do things themselves: log in, track, request and pay, with help close at hand.",
    "Train people": "Make learning easy to start: course catalogue, progress, and a clear enrol or continue action.",
    "Connect our team": "Bring the team together: news, people, documents and search on one home screen.",
    "Launch a product": "Introduce the product: one clear promise, the key features with visuals, social proof and a launch call to action (register, pre-order or demo)."
  };
  const SECTOR_DIR = {
    "Real estate": { trust: "developer credentials, completed projects, RERA or regulator details, payment plans, location maps", sections: "featured communities or properties with price from, key facts (bedrooms, size, handover), location and lifestyle, payment plan, register interest" },
    "Hospitality": { trust: "guest reviews and ratings, awards, real photography of rooms and venues", sections: "rooms and suites, dining, experiences, offers, location, booking" },
    "Healthcare": { trust: "doctor profiles and qualifications, accreditations, patient reviews, clear pricing or insurance information", sections: "treatments, doctors, patient journey, results or outcomes, insurance, book an appointment" },
    "Education": { trust: "accreditation, outcomes, rankings, faculty, student stories", sections: "programmes, admissions steps and dates, campus life, outcomes, enquire or apply" },
    "Finance": { trust: "regulation and licences, security, transparent fees, client logos", sections: "products, how it works, rates and fees, security, support" },
    "Technology": { trust: "client logos, case studies, integrations, security and compliance badges", sections: "product overview, key features with interface visuals, integrations, customers, pricing, demo" },
    "Retail": { trust: "reviews, delivery and returns promise, secure checkout", sections: "new in, collections, best sellers, gift guide, stores, delivery and returns" },
    "Food and drink": { trust: "reviews, press, chef or founder story, hygiene and sourcing", sections: "menu highlights, locations and hours, order online, private dining, story" },
    "Professional services": { trust: "credentials, case studies, client logos, team expertise", sections: "services, industries, case studies, people, insights, contact" },
    "Government": { trust: "official identity, accessibility, clear ownership and contact routes", sections: "most-used services first, initiatives, news, open data, help and contact" },
    "Other": { trust: "client logos, testimonials, numbers that matter", sections: "what we do, how it works, our work, about, contact" }
  };
  const EXP_DIR = {
    "AI-generated images": "Original AI-generated imagery made for the brand (no stock look): give art direction for each hero and section image.",
    "AI-generated video": "A short AI-generated film loop (6 to 10 seconds, no text in frame) behind the hero, with a still poster image for slow connections.",
    "3D elements": "One interactive 3D object or scene that reinforces the product or place, lightweight and with a static fallback.",
    "Immersive scroll storytelling": "A scroll-driven story section where content and imagery unfold step by step as the visitor scrolls.",
    "Page transitions": "Smooth transitions between pages that keep the visitor oriented.",
    "Micro-animations": "Small, purposeful animations on buttons, cards, icons and form states.",
    "Interactive maps": "An interactive map to explore locations, projects or branches, with filters and detail cards.",
    "Virtual tours and 360 views": "A 360 view or virtual tour of the key space, with hotspots.",
    "Calculators and configurators": "A calculator or configurator (price, payment plan, savings or product options) that gives an instant result and leads into the main action.",
    "Live data and counters": "Live numbers, counters or a countdown that update on their own.",
    "Personalisation": "Content that adapts to the visitor's country, language or interests.",
    "AR product preview": "An augmented-reality preview so visitors can see the product in their own space on mobile.",
    "Gamified moments": "A short quiz, challenge or reward moment that leads into the main action.",
    "Video backgrounds": "Short looping video behind key sections, muted, with a poster image.",
    "Dark and light mode": "A dark and a light theme, both fully designed."
  };
  const MOTION_DIR = { "Still": "Still: almost no motion; only hover and focus states.", "Cinematic": "Cinematic: film-like, scroll-driven scenes with pinned sections and layered depth, performance-budgeted, with a reduced-motion fallback.", "Subtle": "Subtle: gentle fades and short slides only, nothing that delays reading.", "Balanced": "Balanced: reveal-on-scroll for sections, hover states on every interactive element, one signature motion moment in the hero.", "Expressive": "Expressive: rich, choreographed motion with parallax and scroll-linked animation, while keeping text readable and respecting reduced-motion settings." };
  const STACK_DIR = { "HubSpot CMS": "HubSpot CMS: design in reusable, drag-and-drop modules and sections so the client can edit every page without a developer.", "WordPress": "WordPress: design as reusable blocks that map to a block theme.", "Webflow": "Webflow: design with a clear class system and reusable components.", "Shopify": "Shopify: design for an Online Store 2.0 theme with sections and blocks; product, collection and cart templates follow the same system.", "Custom build (Next.js)": "Custom Next.js build: design as a component library with tokens for colour, type and spacing.", "NEXA Web Studio": "NEXA Web Studio: design in the Studio's section system so the client can edit text, images and forms after launch, and pages can be exported as HubSpot modules.", "Recommend for me": "Platform to be recommended; design as a modular component system that works on any modern CMS." };

  function buildPrompt() {
    const a = S.a, f = id => { const q = Q.find(x => x.id === id); return fmtAns(q, a[id]); }, has = id => a[id] != null && a[id] !== "" && !(Array.isArray(a[id]) && !a[id].length);
    const type = (a.type || "website").toLowerCase(), pages = a.pages || PAGES_DEF[a.type] || 1, company = a.company || "the client";
    const sd = STYLE_DIR[a.style] || STYLE_DIR.Minimal, sec = SECTOR_DIR[a.sector] || SECTOR_DIR.Other, nav = (SUB[a.sector] || SUB.Other).slice(0, 5);
    const langs = has("languages") ? a.languages : ["English"], ar = langs.includes("Arabic");
    const goals = has("goals") ? a.goals : ["Generate leads"];
    let brand;
    if (a.brandMode === "manual" && has("colours")) {
      const c = a.colours, roles = ["primary (about 10 percent of the page: buttons, key words, active states)", "secondary (about 30 percent: section backgrounds, cards)", "accent (small highlights only)", "supporting", "supporting"];
      brand = ["Colours (use exactly these):", ...c.map((x, i) => `  ${x}: ${roles[i]}`), "  Neutrals: build a tint and shade scale from the primary for backgrounds, borders and text. Body text must meet WCAG AA contrast."];
    } else if (a.brandMode === "upload") brand = [`Use the supplied brand files (${f("brandFiles")}) as the source of truth for logo, colours and type. Do not redraw or recolour the logo.`];
    else if (a.brandMode === "site") brand = [`Take the logo, colours and type from the current website ${a.currentSite || "(address to follow)"}, keep what is recognisable and modernise the rest.`];
    else brand = [`No brand system yet. Propose a palette (primary, secondary, accent and neutrals, with hex values) and a type pairing that express a ${(a.style || "clean").toLowerCase()} style for a ${(a.sector || "modern").toLowerCase()} brand.`];
    if (a.brandMode === "manual" && a.fonts && (a.fonts.head || a.fonts.body)) brand.push(`Fonts: headings in ${a.fonts.head || "a matching display face"}, body in ${a.fonts.body || "a readable sans"}. Type scale: display 56 to 72 px, H2 36 to 44 px, body 16 to 18 px with 1.6 line height (desktop).`);
    else brand.push(`Type direction: ${sd.type}. Type scale: display 56 to 72 px, H2 36 to 44 px, body 16 to 18 px with 1.6 line height (desktop).`);
    if (ar) brand.push("Arabic: pair the Latin fonts with a high-quality Arabic typeface of similar weight and character.");

    const lib = window.NexaLibrary || { THEMES: [], TEMPLATES: [] }, platform = C.lineOf(a.type) === "platform";
    const looks = (a.looks || []).map(id => lib.THEMES.find(t => t.id === id)).filter(Boolean), tpl = a.template && a.template !== "scratch" ? lib.TEMPLATES.find(t => t.id === a.template) : null;
    const work = (a.work || []).map(id => C.WORK.find(w => w.id === id)).filter(Boolean), likes = a.workLikes || {};
    const sections = [
      `1. Header: logo left, navigation (${nav.join(", ")}, Contact)${langs.length > 1 ? ", language switch" : ""}, primary button "${goals.includes("Bookings") ? "Book now" : goals.includes("Sell online") ? "Shop now" : "Enquire"}" on the right. Sticky and compact on scroll.`,
      `2. Hero: one clear headline that says what ${company} offers and for whom, a one-line supporting sentence, the primary action, and a strong visual${has("experience") && a.experience.includes("AI-generated video") ? " (video loop)" : ""}.${goals.includes("Generate leads") ? " Include the short enquiry form here on desktop." : ""}${goals.includes("Bookings") ? " Include the booking bar here." : ""}`,
      `3. Proof strip: ${sec.trust.split(", ").slice(0, 3).join(", ")}.`,
      `4. What we offer: ${sec.sections.split(", ").slice(0, 3).join(", ")}, as visual cards linking to their pages.`,
      `5. Why ${company}: three or four differentiators with a short line each and simple monoline icons or images.`,
      has("experience") && a.experience.includes("Immersive scroll storytelling") ? "6. Story: the immersive scroll section (see Motion)." : `6. Feature section: a large image and text block that tells the brand or product story.`,
      `7. Social proof: testimonials or reviews with names and photos, plus logos or awards.`,
      `8. Closing call to action: a full-width band that repeats the primary action${goals.includes("Generate leads") ? " with the form" : ""}.`,
      `9. Footer: navigation, contact details, social links, legal links (privacy, terms, cookies)${langs.length > 1 ? ", language switch" : ""}.`
    ];

    const L = [
      "ROLE AND TASK",
      `You are a senior web designer at a digital growth agency. Design the homepage concept for ${company}'s new ${type} as a finished, high-fidelity design (desktop at 1440 px and mobile at 390 px), with real-looking content. It must look ready to build, not like a wireframe.`, "",
      "THE CLIENT",
      `${company}${a.sector ? ", " + a.sector.toLowerCase() + " sector" : ""}. Building: ${(C.TYPE[a.type] || {}).label || a.type || "Website"}, about ${pages} page${pages === 1 ? "" : "s"}.${a.currentSite ? " Current website: " + a.currentSite + "." : ""}`, "",
      "GOALS AND THE MAIN ACTION",
      ...goals.map(g => "- " + (GOAL_DIR[g] || g)), "Every section should move the visitor towards the main action.", "",
      "AUDIENCE",
      has("audience") ? a.audience : `Decision-makers and customers in the ${(a.sector || "client's").toLowerCase()} market.`,
      `What builds their trust here: ${sec.trust}.`, "",
      "BRAND",
      ...brand, "",
      "ART DIRECTION",
      `Style: ${a.style || "Minimal"}. The site should feel ${sd.feel}.`,
      `Colour use: ${sd.colour}.`, `Layout: ${sd.layout}.`, `Imagery: ${sd.imagery}.`,
      has("experience") ? ["Experiences to include:", ...a.experience.map(x => "- " + (EXP_DIR[x] || x))].join("\n") : "", "",
      looks.length ? "LOOKS THE CLIENT PICKED FROM OUR DESIGN LIBRARY (use as direction, never copy)" : "",
      ...looks.map(t => `- ${t.name} (${t.family}, ${t.mode}): colours ${t.pal.join(", ")}; type ${t.fonts.join(" with ")}; tags ${t.tags.join(", ")}.`), looks.length ? "" : "",
      work.length ? "NEXA WORK THE CLIENT LIKED" : "",
      ...work.map(w => `- ${w.name} (${w.url}): ${w.what}${(likes[w.id] || []).length ? " They like its " + likes[w.id].join(", ").toLowerCase() + "." : ""}`), work.length ? "" : "",
      tpl ? "STARTING POINT" : "", tpl ? `Start from the proven NEXA Web Studio template "${tpl.name}" (${tpl.industry}, goal: ${tpl.goal}). Keep its conversion structure and form flow; restyle it fully to this brand.` : "", tpl ? "" : "",
      platform ? "PLATFORM" : "",
      platform ? `Who logs in: ${(a.users || ["to be confirmed"]).join(", ")}.` : "",
      platform && (a.pfeatures || []).length ? "Features: " + a.pfeatures.join(", ") + "." : "",
      platform ? `Data comes from: ${(a.data || ["to be confirmed"]).join(", ")}. Data residency: ${a.residency || "to be confirmed"}.` : "",
      platform ? "Design the key screens, not only a homepage: the public landing screen, the signed-in dashboard, one detail or record view, and the content or admin workspace. Charts must be readable, filterable and accessible, with a table view for every chart." : "", platform ? "" : "",
      platform ? "LANDING SCREEN STRUCTURE (top to bottom)" : "HOMEPAGE STRUCTURE (top to bottom)",
      ...sections, "",
      "MOTION AND INTERACTION",
      MOTION_DIR[a.motion] || MOTION_DIR.Balanced, "Every button, link and card has hover, focus and pressed states. Respect the reduced-motion setting.", "",
      "COPY",
      `Tone: ${sd.tone}. Write real headlines and body copy for ${company}${a.sector ? " in " + a.sector.toLowerCase() : ""}; no lorem ipsum and no placeholder text.`,
      `Content status: ${has("content") ? f("content") : "to be confirmed"}. Where copy is missing, write a strong first draft.`,
      `Languages: ${langs.join(", ")}.${ar ? " Arabic pages mirror the layout right to left (navigation, icons with direction, forms and carousels)." : ""}`, "",
      has("refs") ? "REFERENCES (take the idea, never copy the design)" : "",
      ...(has("refs") ? a.refs.filter(r => r.url).map(r => `- ${r.url}${r.note ? ": " + r.note : ""}`) : []), has("refs") ? "" : "",
      "BUILD AND STANDARDS",
      STACK_DIR[a.stack] || STACK_DIR["Recommend for me"],
      a.stackSetup && C.SETUP[a.stack] ? "Set-up: " + (C.SETUP[a.stack].opts.find(o => o[0] === a.stackSetup) || ["", ""])[1] + "." : "",
      "Mobile first. Breakpoints at 390, 768, 1024 and 1440 px. Touch targets at least 44 px.",
      "Accessibility: WCAG 2.2 AA, visible focus states, text contrast at least 4.5 to 1, alt text for every image.",
      "Performance: fast first screen (Largest Contentful Paint under 2.5 seconds on mobile), compressed modern image formats, no heavy effects above the fold.",
      "Search: one H1 per page, logical heading order, a title and meta description for every page, clean URLs.",
      has("addons") ? `Add-ons in scope: ${f("addons")}${has("integrations") ? "; integrations: " + f("integrations") : ""}${has("transLangs") ? "; translate into " + a.transLangs : ""}.` : "", "",
      "AVOID",
      "Generic stock photos (handshakes, people pointing at laptops), cluttered layouts, more than two typefaces, centred body text, walls of text, tiny grey text, carousels that hide key content, and anything that looks AI-generated by default.",
      has("notes") ? "Client notes: " + a.notes : "", "",
      "WHAT TO DELIVER",
      platform ? "Three to four clearly different concept directions. For each: a short name, one paragraph on the idea, the colour palette with hex values, the type pairing, and the key screens on desktop and mobile." : "Three to four clearly different concept directions for the homepage. For each: a short name, one paragraph on the idea, the colour palette with hex values, the type pairing, the full desktop homepage and the mobile homepage.",
      `Timing: ${has("timeline") ? f("timeline") : "flexible"}.`
    ];
    return L.filter((x, i, arr) => !(x === "" && arr[i - 1] === "")).join("\n").trim();
  }
  function drawPrompt() {
    if (!S.prompt) { S.prompt = buildPrompt(); save(); }
    $("main").innerHTML = bot("Here's your design prompt, written from your brief: the full creative direction our designers and AI use to create your concepts. Read it, edit anything directly, or tell me what to change.") + `
      <div class="stage pstage" id="pstage"><div class="row2 phead"><h2>Your design prompt</h2><div class="row2"><span class="mut" id="pwords"></span><button class="btn" type="button" id="pfull">Full screen</button></div></div>
        <textarea class="in prompt" id="ptext" aria-label="Your design prompt" spellcheck="true">${esc(S.prompt)}</textarea>
        <div class="row2"><input class="in" id="pask" placeholder="Tell me what to change, for example: make it feel more premium" style="flex:1 1 280px"><button class="btn" type="button" id="prefine">Refine</button></div>
        <div class="gate"><button class="btn" type="button" data-back="brief">Back to my brief</button><button class="btn pri big" type="button" id="papprove">Approve and generate sitemap</button><span class="note">Approving records the prompt as the basis for your design.</span></div>
      </div>`;
    fitPrompt();
  }
  function fitPrompt() {
    const t = $("ptext"); if (!t) return;
    t.style.height = "auto"; t.style.height = Math.max(Math.round(window.innerHeight * .7), t.scrollHeight + 24) + "px";
    const w = $("pwords"); if (w) w.textContent = t.value.split(/\s+/).filter(Boolean).length + " words";
  }
  /* ---------------- sitemap ---------------- */
  const SUB = {
    "Real estate": ["Properties", "Communities", "Off-plan", "Investors", "Area guides"], "Hospitality": ["Rooms and suites", "Dining", "Experiences", "Offers", "Events", "Gallery"],
    "Healthcare": ["Treatments", "Our doctors", "Patient information", "Book an appointment", "Insurance"], "Education": ["Programmes", "Admissions", "Campus life", "Faculty", "Research"],
    "Finance": ["Personal", "Business", "Rates and fees", "Security", "Help centre"], "Technology": ["Product", "Features", "Pricing", "Integrations", "Customers", "Docs"],
    "Retail": ["Shop", "Collections", "Gift guide", "Stores", "Delivery and returns"], "Food and drink": ["Menu", "Locations", "Order online", "Private dining", "Catering"],
    "Professional services": ["Services", "Industries", "Case studies", "Our people", "Insights"], "Government": ["Services", "Initiatives", "News", "Open data", "Help"],
    "Other": ["What we do", "Our work", "How we work"]
  };
  const TYPE_SITEMAP = {
    "Booking website": [["Home"], ["About"], ["Rooms, services or experiences"], ["Detail page", 1], ["Book online"], ["Offers"], ["Gallery"], ["Reviews"], ["Location"], ["FAQ"], ["Contact"]],
    "Event website": [["Home"], ["About the event"], ["Programme"], ["Speakers or line-up"], ["Tickets and registration"], ["Venue and travel"], ["Partners"], ["FAQ"], ["Contact"]],
    "Portfolio or showcase": [["Home"], ["Work"], ["Project detail", 1], ["About"], ["Services"], ["Press"], ["Contact"]],
    "Data dashboard platform": [["Home"], ["Overview dashboard"], ["Topic dashboards"], ["Indicator detail", 1], ["Country or region view", 1], ["Reports library"], ["Data explorer"], ["Methodology"], ["About"], ["Content workspace"], ["Users and roles"], ["Sign in"]],
    "Client or partner portal": [["Home"], ["Sign in"], ["Dashboard"], ["Deals or projects"], ["Record detail", 1], ["Documents"], ["Inventory or availability"], ["Commissions or invoices"], ["Messages"], ["Profile and settings"], ["Admin"]],
    "Members portal": [["Home"], ["Join"], ["Sign in"], ["Member dashboard"], ["Member content"], ["Events"], ["Renewals and billing"], ["Profile"], ["Help"], ["Admin"]],
    "Listings and directory": [["Home"], ["Search results"], ["Listing detail", 1], ["Categories"], ["Saved searches and alerts"], ["Add a listing"], ["Agents or sellers"], ["About"], ["Contact"], ["Admin"]],
    "Learning platform": [["Home"], ["Course catalogue"], ["Course page", 1], ["Lesson player", 1], ["Quizzes"], ["Certificates"], ["My learning"], ["Instructors"], ["Pricing"], ["Help"]],
    "Intranet and knowledge hub": [["Home feed"], ["News"], ["People directory"], ["Documents and policies"], ["Departments"], ["Events"], ["Search"], ["Help desk"], ["Profile"], ["Admin"]],
    "Web app": [["Home"], ["Sign up"], ["Sign in"], ["App dashboard"], ["Main workspace"], ["Record detail", 1], ["Settings"], ["Billing"], ["Help centre"]]
  };
  function genSitemap() {
    const a = S.a, n = Math.max(1, a.pages || PAGES_DEF[a.type] || 8), sub = SUB[a.sector] || SUB.Other;
    const TS = TYPE_SITEMAP[a.type];
    if (TS) { let L = TS.map(x => ({ name: x[0], d: x[1] || 0 })); if (L.length > n) L = L.slice(0, n); let k = 1; while (L.length < n) L.push({ name: "Detail page " + k++, d: 1 }); return L; }
    if (a.type === "Landing page" || n === 1) return [{ name: "Home", d: 0 }];
    if (a.type === "Microsite") return ["Home", "About the campaign", "Details", "Register", "Thank you"].slice(0, Math.max(2, n)).map(x => ({ name: x, d: 0 }));
    const out = [{ name: "Home", d: 0 }, { name: "About", d: 0 }];
    const hub = a.type === "Online store" ? "Shop" : (a.sector === "Hospitality" ? "Stay" : "Services");
    out.push({ name: hub, d: 0 });
    sub.forEach(s => { if (s !== hub) out.push({ name: s, d: 1 }); });
    const tail = ["Contact", a.type === "Online store" ? "Cart and checkout" : "News and insights", "FAQ", a.goals && a.goals.includes("Recruit") ? "Careers" : "Our work", "Privacy policy", "Terms"];
    tail.forEach(t => out.push({ name: t, d: 0 }));
    let L = out.slice(0, n);
    if (!L.some(p => p.name === "Contact")) L[L.length - 1] = { name: "Contact", d: 0 };
    let k = 1; while (L.length < n) L.splice(L.length - 1, 0, { name: (sub[k % sub.length] || "Page") + " detail " + k++, d: 1 });
    return L;
  }
  function drawSitemap() {
    if (!S.sitemap) { S.sitemap = genSitemap(); save(); }
    const sm = S.sitemap;
    $("main").innerHTML = bot(`Here's a sitemap of ${sm.length} page${sm.length === 1 ? "" : "s"}. Rename, move, nest, add or remove pages. Your plan updates as the page count changes.`) + `
      <div class="stage"><h2>Your sitemap</h2>
        <div class="tree">${sm.map((p, i) => `<div class="node ${p.d ? "child" : ""}"><span class="pn">${String(i + 1).padStart(2, "0")}</span><input value="${esc(p.name)}" data-sm="${i}" aria-label="Page name">
          <button class="ic" type="button" data-smv="${i}|-1" title="Move up" aria-label="Move up">&uarr;</button><button class="ic" type="button" data-smv="${i}|1" title="Move down" aria-label="Move down">&darr;</button>
          ${i ? `<button class="ic" type="button" data-smi="${i}" title="${p.d ? "Make a main page" : "Make a sub-page"}" aria-label="Change level">${p.d ? "&larr;" : "&rarr;"}</button><button class="ic" type="button" data-smx="${i}" title="Remove" aria-label="Remove">&times;</button>` : ""}</div>`).join("")}</div>
        <div class="row2"><button class="btn" type="button" id="smadd">+ Add a page</button></div>
        <div class="gate"><button class="btn" type="button" data-back="prompt">Back to my prompt</button><button class="btn pri big" type="button" id="smapprove">Approve and generate concepts</button><span class="note">We design 3 to 4 homepage concepts from your prompt and sitemap. In the live studio this takes 15 to 20 minutes.</span></div>
      </div>`;
  }

  /* ---------------- concepts ---------------- */
  let genTimer = null;
  function drawConcepts() {
    const C = S.concepts;
    if (!C.ready) {
      $("main").innerHTML = bot("Designing your concepts now. Four directions, each built from your prompt, sitemap and brand.") + `<div class="stage"><h2>Designing your concepts</h2><div class="gen"><div class="bar"><i id="gbar" style="width:0"></i></div><span id="gmsg">Starting…</span><span style="font-size:12px;color:var(--muted)">Prototype: this is sped up. In the live studio, allow 15 to 20 minutes; you can leave and come back.</span></div></div>`;
      if (!genTimer) { let t = 0; const D = NC.DIRECTIONS; genTimer = setInterval(() => { t++; const p = Math.min(100, t * 5); const g = $("gbar"); if (g) g.style.width = p + "%"; const m = $("gmsg"); if (m) m.textContent = p < 100 ? `Designing concept ${Math.min(4, Math.floor(p / 25) + 1)} of 4: ${D[Math.min(3, Math.floor(p / 25))].name}` : "Done"; if (p >= 100) { clearInterval(genTimer); genTimer = null; C.ready = true; save(); draw(); } }, 160); }
      return;
    }
    const D = NC.DIRECTIONS, mixing = C.mode === "mix";
    if (!C.mix) C.mix = NC.allOf(C.sel || "A");
    let h = bot(mixing ? "Mix and match: choose which concept each section comes from. The preview updates as you go." : "Your four concepts are ready. Open any of them full size, choose one, ask for changes, or mix sections from different concepts.");
    h += `<div class="stage"><div class="row2" style="justify-content:space-between"><h2>${mixing ? "Mix your concept" : "Choose your concept"}</h2><div class="tabs"><button type="button" data-cmode="pick" aria-selected="${!mixing}">Choose one</button><button type="button" data-cmode="mix" aria-selected="${mixing}">Mix and match</button></div></div>`;
    if (!mixing) {
      h += `<div class="cgrid">${D.map(d => `<article class="concept ${C.sel === d.id ? "sel" : ""}"><div class="frame" data-frame="${d.id}"><iframe title="Concept ${d.id}" loading="lazy" tabindex="-1" data-src="${d.id}"></iframe></div>
        <div class="meta"><b>Concept ${d.id}: ${esc(d.name)}</b><span>${esc(d.note)}</span>
        <div class="row2"><button class="btn ${C.sel === d.id ? "pri" : ""}" type="button" data-csel="${d.id}">${C.sel === d.id ? "Chosen" : "Choose this"}</button><button class="skip" type="button" data-cview="${d.id}">View full size</button></div></div></article>`).join("")}</div>`;
      if (C.view) h += `<div><div class="row2" style="justify-content:space-between;margin-bottom:8px"><b>Concept ${C.view} full size</b><button class="skip" type="button" data-cview="">Close</button></div><div class="frame tall live" data-frame="view"><iframe title="Full size concept" data-src="view"></iframe></div></div>`;
      if (C.sel) h += `<div class="row2"><input class="in" id="cnote" placeholder="Changes to concept ${C.sel}, for example: warmer colours, larger photos" value="${esc(C.notes[C.sel] || "")}" style="flex:1 1 280px"><button class="btn" type="button" id="crefine">Ask for changes</button></div><p style="margin:0;font-size:12px;color:var(--muted)">${roundNote("concept")}</p>`;
    } else {
      h += `<div class="mix"><span></span>${D.map(d => `<span class="hd">${d.id}<span class="nm">: ${esc(d.name)}</span></span>`).join("")}${NC.SECTIONS.map(([k, l]) => `<span>${esc(l)}</span>${D.map(d => `<button type="button" data-mix="${k}|${d.id}" aria-pressed="${C.mix[k] === d.id}" aria-label="${esc(l)} from concept ${d.id}">${d.id}</button>`).join("")}`).join("")}</div>
        <div class="frame tall live" data-frame="mix"><iframe title="Your mixed concept" data-src="mix"></iframe></div>`;
    }
    const canGo = mixing || C.sel;
    h += `<div class="gate"><button class="btn" type="button" data-back="sitemap">Back to sitemap</button><button class="btn pri big" type="button" id="capprove" ${canGo ? "" : "disabled"}>${mixing ? "Approve my mixed concept" : C.sel ? `Approve concept ${C.sel}` : "Choose a concept to continue"}</button><span class="note">Your approved concept sets the look for every inner page.</span></div></div>`;
    $("main").innerHTML = h;
    fillFrames();
  }
  const pickOf = () => S.concepts.mode === "mix" ? S.concepts.mix : NC.allOf(S.concepts.sel || "A");
  function fillFrames() {
    document.querySelectorAll("iframe[data-src]").forEach(f => {
      const k = f.dataset.src, C = S.concepts;
      let html;
      if (k === "view") html = NC.page(S.a, NC.allOf(C.view));
      else if (k === "mix") html = NC.page(S.a, C.mix);
      else if (k.startsWith("inner:")) { const w = S.wf[+k.slice(6)]; html = NC.inner(S.a, pickOf(), w.name, w.blocks); }
      else html = NC.page(S.a, NC.allOf(k));
      f.srcdoc = html;
    });
    fit();
  }
  function fit() {
    document.querySelectorAll(".frame").forEach(fr => { const f = fr.querySelector("iframe"); if (!f) return; const w = fr.clientWidth || 600, s = Math.min(1, w / 1280); f.style.transform = `scale(${s})`; f.style.width = 1280 + "px"; f.style.height = (fr.clientHeight / s) + "px"; });
  }
  window.addEventListener("resize", () => { clearTimeout(fit.h); fit.h = setTimeout(fit, 120); });

  /* ---------------- wireframes + inner pages ---------------- */
  const BLOCKS = ["Page header", "Introduction", "Story", "Services list", "Feature grid", "Numbers", "Gallery", "Team", "Testimonial", "FAQ", "Post grid", "Product grid", "Booking widget", "Contact form", "Map", "Text", "Call to action"];
  function blocksFor(name) {
    const n = name.toLowerCase();
    if (/contact/.test(n)) return ["Page header", "Contact form", "Map", "FAQ"];
    if (/about|story|who/.test(n)) return ["Page header", "Story", "Numbers", "Team", "Call to action"];
    if (/privacy|terms|cookie/.test(n)) return ["Page header", "Text"];
    if (/news|insight|blog|article/.test(n)) return ["Page header", "Post grid", "Call to action"];
    if (/shop|collection|product|gift/.test(n)) return ["Page header", "Product grid", "Testimonial"];
    if (/book|appointment|room|stay|reserv/.test(n)) return ["Page header", "Introduction", "Gallery", "Booking widget", "Testimonial"];
    if (/faq|help/.test(n)) return ["Page header", "FAQ", "Call to action"];
    if (/career/.test(n)) return ["Page header", "Introduction", "Feature grid", "Call to action"];
    if (/work|case|portfolio|gallery/.test(n)) return ["Page header", "Gallery", "Testimonial", "Call to action"];
    return ["Page header", "Introduction", "Feature grid", "Testimonial", "Call to action"];
  }
  function drawWireframes() {
    if (!S.wf) { S.wf = S.sitemap.filter(p => p.name !== "Home").map(p => ({ name: p.name, blocks: blocksFor(p.name) })); save(); }
    if (!S.wf.length) { go("inner"); return; }
    $("main").innerHTML = bot(`Here are wireframes for your ${S.wf.length} inner page${S.wf.length === 1 ? "" : "s"}: the sections on each page, in order. Add, remove or reorder sections, then approve.`) + `
      <div class="stage"><h2>Inner page wireframes</h2><div class="wf">${S.wf.map((w, i) => `<div class="wfp"><h4>${esc(w.name)}</h4>${w.blocks.map((b, j) => `<div class="blk"><span>${esc(b)}</span>${j ? `<button type="button" data-wup="${i}|${j}" aria-label="Move up">&uarr;</button>` : ""}<button type="button" data-wx="${i}|${j}" aria-label="Remove">&times;</button></div>`).join("")}
        <select data-wadd="${i}" aria-label="Add a section"><option value="">+ Add a section</option>${BLOCKS.map(b => `<option>${esc(b)}</option>`).join("")}</select></div>`).join("")}</div>
        <div class="gate"><button class="btn" type="button" data-back="concepts">Back to concepts</button><button class="btn pri big" type="button" id="wapprove">Approve wireframes</button><span class="note">Next, we build these pages in your approved concept.</span></div></div>`;
  }
  function drawInner() {
    const I = S.inner;
    if (!S.wf || !S.wf.length) { $("main").innerHTML = bot("Your site is a single page, so there are no inner pages to create.") + `<div class="stage"><div class="gate"><button class="btn pri big" type="button" id="iapprove">Continue to submit</button></div></div>`; return; }
    if (!I.ready) {
      $("main").innerHTML = bot("Your wireframes are approved. Ready to create the inner pages in your chosen look?") + `<div class="stage"><h2>Create inner pages</h2><div class="gen" id="igen"><button class="btn pri big" type="button" id="icreate">Create inner pages</button><span style="font-size:12px;color:var(--muted)">${S.wf.length} pages, styled from your approved concept.</span></div></div>`;
      return;
    }
    const t = Math.min(I.tab, S.wf.length - 1);
    $("main").innerHTML = bot("Your inner pages are ready. Click through them, ask for changes on any page, then approve.") + `
      <div class="stage"><h2>Your inner pages</h2><div class="tabs">${S.wf.map((w, i) => `<button type="button" data-itab="${i}" aria-selected="${i === t}">${esc(w.name)}</button>`).join("")}</div>
        <div class="frame tall live"><iframe title="${esc(S.wf[t].name)} page" data-src="inner:${t}"></iframe></div>
        <div class="row2"><input class="in" id="inote" placeholder="Changes to the ${esc(S.wf[t].name)} page" style="flex:1 1 280px"><button class="btn" type="button" id="irefine">Ask for changes</button></div><p style="margin:0;font-size:12px;color:var(--muted)">${roundNote("inner")} Put every change for this round in before you send it.</p>
        <div class="gate"><button class="btn" type="button" data-back="wireframes">Back to wireframes</button><button class="btn pri big" type="button" id="iapprove">Approve all pages</button></div></div>`;
    fillFrames();
  }

  /* ---------------- submit, build, staging, pay, live ---------------- */
  const tierNow = tierOf;
  function needList() {
    const a = S.a, ad = a.addons || [], L = [];
    if (!(a.brandFiles || []).length) L.push(["logo", "Your logo and any brand files", "Vector or high-resolution files."]);
    if (a.content !== "Copy and images are ready") L.push(ad.includes("Copywriting") ? ["brieffacts", "Key facts for our copywriter", "A short form: services, proof points, anything you must say."] : ["copy", "The words for every page", "Or add Copywriting and we write them."]);
    if (a.content !== "Copy and images are ready" && !(a.experience || []).includes("AI-generated images")) L.push(["images", "Photos and images", "Or we use licensed stock or AI images you approve."]);
    if (a.hosting === "dns") L.push(["dns", "Someone who can edit your DNS", "Only needed at go-live, for about 10 minutes."]);
    if (a.hosting === "access") L.push(["access", "Accept our access invitation", "Sent to your domain and hosting accounts. Never send passwords."]);
    (a.integrations || []).forEach(i => L.push(["int:" + i, `Access to ${i}`, "Through a user invitation or a key shared in this portal, never by email."]));
    if (ad.includes("Translation") || (a.languages || []).length > 1) L.push(["trans", "A reviewer for each language", "Someone on your side who signs off the translated pages."]);
    const st = C.SETUP[a.stack]; if (st && a.stackSetup && st.needs[a.stackSetup]) st.needs[a.stackSetup].forEach(n => L.push(n));
    if (C.lineOf(a.type) === "platform") { L.push(["users-list", "Your user list and roles", "Who needs access, and what each role can see and do."]); if ((a.data || []).some(x => x !== "Not sure yet")) L.push(["data-sample", "Sample data", "A real extract of each data source, so we design around your actual numbers."]); L.push(["it-contact", "An IT or security contact", "For single sign-on, hosting and security sign-off."]); }
    L.push(["legal", "Your privacy policy and terms", "Or approve our standard templates for your lawyer to check."]);
    return L;
  }
  const needDone = () => needList().every(n => S.need[n[0]]);
  const hrs = h => h < 1 ? Math.round(h * 60) + " min" : (Math.round(h * 2) / 2) + " h";
  function drawSubmit() {
    const a = S.a, t = tierNow(), e = est(a), m = monthly(t), sc = score(a);
    $("main").innerHTML = bot("Everything is approved. Check the summary and the terms, then submit. Your first payment starts the build.") + `
      <div class="stage"><h2>Ready to submit</h2><div class="review">
        <div><span>Building</span><b>${esc(a.type || "Website")} for ${esc(a.company || "your brand")}</b></div>
        <div><span>Pages</span><b>${e.pg}</b></div>
        <div><span>Concept</span><b>${S.concepts.mode === "mix" ? "Your mixed concept" : "Concept " + esc(S.concepts.sel || "A")}</b></div>
        <div><span>Platform</span><b>${esc((a.stack || "We'll recommend one") + (a.stackAuto ? " (recommended)" : ""))}</b></div>
        <div><span>Plan</span><b>${TIERS[t].name}, ${MODEL_NAME[S.model || "monthly"]}: ${priceLine(t)}</b></div>
        <div><span>Going live</span><b>${esc({ nexa: "NEXA hosts it", dns: "You add our DNS records", access: "You give us domain and hosting access", later: "Decide later" }[a.hosting] || "Decide later")}</b></div>
      </div>
      ${t < sc.tier ? `<div class="plnote">Your choices fit ${TIERS[sc.tier].name}. On ${TIERS[t].name}, anything above its limits is quoted as extra work before we start.</div>` : ""}
      <div class="eta"><div><span class="lbl">Build time</span><br><b>${e.text}</b></div><div style="font-size:12.5px;color:var(--ink2);flex:1 1 260px">${e.r.map(x => `${esc(x[0])}: ${hrs(x[1])}`).join(" · ")}<br>The clock starts when we have everything on the list below.</div></div>
      <div><span class="lbl">What we'll need from you</span><ul style="margin:6px 0 0;padding-left:18px;font-size:13px">${needList().map(n => `<li><b style="font-weight:500">${esc(n[1])}</b> <span style="color:var(--muted)">${esc(n[2])}</span></li>`).join("")}</ul></div>
      <div><span class="lbl">The terms</span><ol style="margin:6px 0 0;padding-left:18px;font-size:13px;color:var(--ink2)">${terms().map(x => `<li>${esc(x)}</li>`).join("")}</ol>
        <label style="display:flex;gap:10px;align-items:flex-start;margin-top:10px;font-size:13px"><input type="checkbox" id="terms" ${S.terms ? "checked" : ""} style="margin-top:3px;accent-color:var(--purple)"> <span>I agree to these terms on behalf of ${esc(a.company || "my company")}.</span></label></div>
      <div class="gate"><button class="btn" type="button" data-back="inner">Back</button><button class="btn pri big" type="button" id="submit" ${S.terms ? "" : "disabled"}>Submit and start my plan</button></div></div>`;
  }
  function drawPay() {
    const sc = score(S.a), t = tierNow(), md = S.model || "monthly", yr = md === "monthly" && S.billing === "yearly", q = quote(t), W = tierWindow(), f = TIERS[t].from ? "From " : "";
    const due = md === "monthly" ? (yr ? q.rec * PRICE.annualPaysMonths : q.rec) : q.dueNow;
    const cell = (r, k) => md === "once" && /^(Changes after launch|Maintenance|Hosting)/.test(r[0]) ? "Not included" : r[k + 1];
    $("main").innerHTML = bot("Choose how you'd like to pay and your plan. The build starts as soon as the first payment goes through.") + `
      <div class="stage"><h2>Start your plan</h2>
        <span class="lbl">How would you like to pay?</span>
        <div class="cards">${C.MODELS.map(([k, l, d]) => `<button class="opt" type="button" data-model="${k}" aria-pressed="${k === md}"><b>${l}</b><span>${d}</span></button>`).join("")}</div>
        <span class="lbl">Your plan</span>
        <div class="cards">${W.map(k => { const x = TIERS[k]; return `<button class="opt" type="button" data-tier="${k}" aria-pressed="${k === t}"><b>${x.name}${k === sc.tier ? " · recommended" : ""}</b><span>${x.desc}</span><span class="pr">${x.from ? "From " : ""}${aed(md === "monthly" ? PRICE.plans[k] : PRICE.once[k])} ${md === "monthly" ? "a month" : "one-time"}${md === "onceCare" ? `, then ${aed(PRICE.care[k])} a month care` : ""}</span></button>`; }).join("")}</div>
        <div style="overflow-x:auto"><table class="dns"><thead><tr><th></th>${W.map(k => `<th style="${k === t ? "color:var(--deep)" : ""}">${TIERS[k].name}</th>`).join("")}</tr></thead><tbody>${INCL.map(r => `<tr><td>${esc(r[0])}</td>${W.map(k => `<td style="${k === t ? "font-weight:600" : ""}">${esc(cell(r, k))}</td>`).join("")}</tr>`).join("")}</tbody></table></div>
        ${md === "monthly" ? `<div class="tabs"><button type="button" data-bill="monthly" aria-selected="${!yr}">Pay monthly</button><button type="button" data-bill="yearly" aria-selected="${yr}">Pay yearly, 2 months free</button></div>` : ""}
        <div style="max-width:540px">${priceBox(t)}
          <div class="money due"><div class="tot"><b>${md === "monthly" ? (yr ? `Due today (12 months for the price of ${PRICE.annualPaysMonths})` : "Due today (first month)") : `Due today (${Math.round(PRICE.deposit * 100)}% to start)`}</b><b>${f}${aed(due)}</b></div>
          <div><span class="mut">${md === "monthly" ? (yr ? "Next payment in 12 months" : "Then each month, from the day you go live") : `Then ${f}${aed(q.up - due)} before go-live${q.rec ? `, and ${aed(q.rec)} a month after` : ""}`}</span></div></div></div>
        ${TIERS[t].from ? `<div class="plnote">Platform prices are a starting point. We confirm the exact scope and price in a workshop with you before anything beyond the deposit is due.</div>` : ""}
        <div class="demo"><span class="lbl">Prototype</span><span style="flex:1 1 200px">Example prices. No card is charged in this prototype.</span></div>
        <div class="gate"><button class="btn" type="button" data-back="submit">Back</button><button class="btn pri big" type="button" id="pay">${TIERS[t].from ? "Pay the deposit" : "Pay " + aed(due)} and start the build</button></div></div>`;
  }
  const BSTEPS = [["Brief accepted", "Our team has checked your brief and approvals."], ["Building", "Developers are building your pages on your platform."], ["Quality checks", "Mobile, speed, accessibility, forms and links are tested."], ["Staging ready", "Your private preview link is ready to review."]];
  function demo(label, id, off) { return `<div class="demo"><span class="lbl">Prototype</span><span style="flex:1 1 200px">${off ? "Tick off the list above first: the build clock starts when everything is in." : "In the live portal this moves on its own as our team works."}</span><button class="btn" type="button" id="${id}" ${off ? "disabled" : ""}>${label}</button></div>`; }
  function drawBuild() {
    const e = est(S.a), L = needList(), done = needDone();
    const ask = L.length && S.build === 0 ? `<div><span class="lbl">What we need from you</span><div class="track" style="margin-top:8px">${L.map(n => `<div class="tstep ${S.need[n[0]] ? "done" : ""}"><i>${S.need[n[0]] ? "&#10003;" : "&middot;"}</i><div style="flex:1"><b>${esc(n[1])}</b><span>${esc(n[2])}</span></div><button class="${S.need[n[0]] ? "skip" : "btn"}" type="button" data-need="${esc(n[0])}">${S.need[n[0]] ? "Undo" : "Done"}</button></div>`).join("")}</div></div>` : "";
    const msg = S.build >= 4 ? "Your staging site is ready." : !done && S.build === 0 ? `Thanks, your plan is active. Send us the items below and the build starts straight away. Estimated build time: ${e.text}.` : `Your website is being built. Estimated build time: ${e.text}. You can close this page; we'll email ${esc(S.a.email || "you")} at each step.`;
    $("main").innerHTML = bot(msg) + `
      <div class="stage"><h2>Build progress</h2>${ask}<div class="track">${BSTEPS.map((b, i) => `<div class="tstep ${i < S.build ? "done" : i === S.build ? "cur" : ""}"><i>${i < S.build ? "&#10003;" : i + 1}</i><div><b>${b[0]}</b><span>${b[1]}</span></div></div>`).join("")}</div>
      ${S.changes.length ? `<div><span class="lbl">Changes you asked for</span><ul style="margin:6px 0 0;padding-left:18px">${S.changes.map(c => `<li>${esc(c)}</li>`).join("")}</ul></div>` : ""}
      ${S.build < 4 ? demo("Show the next step", "bnext", !done) : `<div class="gate"><button class="btn pri big" type="button" id="tostaging">Review my staging site</button></div>`}</div>`;
  }
  function drawStaging() {
    $("main").innerHTML = bot("Here's your staging site: the real build, on a private link. Click through every page. Approve it, or list everything you'd like changed in one go.") + `
      <div class="stage"><h2>Review your staging site</h2>
        <div class="row2"><span class="lbl">Staging link</span><span style="color:var(--muted)">Appears here when your build is ready.</span><button class="btn" type="button" id="openstage">Open the preview</button></div>
        <textarea class="in" id="snote" placeholder="Anything to change? List it here, one change per line."></textarea>
        <p style="margin:0;font-size:12px;color:var(--muted)">${roundNote("staging")}</p>
        <div class="gate"><button class="btn" type="button" id="schanges">Request changes</button><button class="btn pri big" type="button" id="sapprove">Approve staging</button><span class="note">Approving confirms the site is ready to go live. Changes after this come out of your monthly change hours.</span></div></div>`;
  }
  function drawLive() {
    const h = S.a.hosting && S.a.hosting !== "later" ? S.a.hosting : S.hostNow;
    if (S.live) {
      const t = tierNow(), m = monthly(t), q = quote(t), md = S.model || "monthly", left = Math.max(0, hoursFor(t) - S.usedHours), nx = new Date(); nx.setMonth(nx.getMonth() + (S.billing === "yearly" ? 12 : 1));
      $("main").innerHTML = bot(`Congratulations${S.a.name ? ", " + esc(S.a.name) : ""}. Your website is live.`) + `<div class="stage"><h2>Your website</h2>
        <div class="review">
          <div><span>Plan</span><b>${TIERS[t].name}, ${MODEL_NAME[md].toLowerCase()}${md === "monthly" ? (S.billing === "yearly" ? ", paid yearly" : ", " + aed(m.total) + " a month") : q.rec ? ", " + aed(q.rec) + " a month" : ""}</b></div>
          <div><span>Next invoice</span><b>${nx.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</b></div>
          <div><span>Change hours left this month</span><b>${md === "once" ? "No monthly hours: changes are " + aed(PRICE.extraHour) + " an hour" : left + " of " + hoursFor(t)}</b></div>
          <div><span>Uptime</span><b>Checked every 3 minutes. We're alerted if it goes down.</b></div>
        </div>
        <div><span class="lbl">Ask for a change</span><textarea class="in" id="cr" placeholder="What would you like changed? One request per message works best." style="margin-top:6px"></textarea>
          <div class="row2" style="margin-top:8px"><button class="btn pri" type="button" id="newreq">Send request</button><span style="font-size:12px;color:var(--muted)">${left ? "We estimate each request before starting. Small ones come out of your monthly hours." : `Your monthly hours are used. Extra changes are ${aed(PRICE.extraHour)} an hour, quoted before we start.`}</span></div></div>
        ${S.requests.length ? `<div><span class="lbl">Your requests</span><ul style="margin:6px 0 0;padding-left:18px;font-size:13px">${S.requests.slice().reverse().map(r => `<li>${esc(r.text)} <span style="color:var(--muted)">· ${when(r.t)} · ${esc(r.status)}</span></li>`).join("")}</ul></div>` : ""}
        <div><span class="lbl">Invoices</span><table class="dns" style="margin-top:6px"><tbody>${S.invoices.map(i => `<tr><td>${when(i.t)}</td><td>${esc(i.what)}</td><td style="text-align:right">${aed(i.amt)}</td></tr>`).join("")}</tbody></table></div>
        <p style="margin:0;font-size:12px;color:var(--muted)">Upgrade any time from the plan bar above. Your plan runs for at least ${PRICE.minMonths} months, then month to month.</p></div>`;
      return;
    }
    let body;
    if (!h) body = `<p class="lead">How should we put your site live?</p><div class="cards">${[["nexa", "NEXA hosts it", "We host, secure and monitor it."], ["dns", "I'll add DNS records", "We send the records; you add them at your domain provider."], ["access", "I'll give you access", "We send a secure access invitation."]].map(([k, l, d]) => `<button class="opt" type="button" data-host="${k}"><b>${l}</b><span>${d}</span></button>`).join("")}</div>`;
    else if (h === "dns") body = `<p class="lead">Add these records at your domain provider. The values are issued when your site is ready to go live, and we check them for you.</p><table class="dns"><thead><tr><th>Type</th><th>Name</th><th>Value</th></tr></thead><tbody><tr><td>A</td><td>@</td><td style="color:var(--muted)">Issued at go-live</td></tr><tr><td>CNAME</td><td>www</td><td style="color:var(--muted)">Issued at go-live</td></tr><tr><td>TXT</td><td>@</td><td style="color:var(--muted)">Verification code, issued at go-live</td></tr></tbody></table>`;
    else if (h === "access") body = `<p class="lead">We'll send a secure invitation to your domain and hosting accounts. Never send passwords by email or chat; the invitation keeps your account in your control.</p>`;
    else body = `<p class="lead">We host it for you: secure certificate, backups and monitoring included. Point your domain to us and we do the rest.</p>`;
    $("main").innerHTML = bot("Last step: going live.") + `<div class="stage"><h2>Going live</h2>${body}${h ? `<div class="gate"><button class="btn pri big" type="button" id="golive">Confirm and go live</button><span class="note">Your monthly billing date is set from today.</span></div>` : ""}</div>`;
  }
  function record() {
    const a = S.a, t = tierNow(), m = monthly(t), line = "-".repeat(60);
    const txt = ["NEXA Web Studio project record", `Downloaded ${new Date().toLocaleString("en-GB")}`, line, "BRIEF",
      ...live().map(q => `${LBL[q.id] || q.id}: ${fmtAns(q, a[q.id])}`), line, "PROMPT (as approved)", S.prompt || "(not yet)", line, "SITEMAP",
      ...(S.sitemap || []).map((p, i) => `${String(i + 1).padStart(2, "0")} ${p.d ? "  - " : ""}${p.name}`), line, "PLAN",
      `${TIERS[t].name}, ${MODEL_NAME[S.model || "monthly"]}: ${priceLine(t)}; add-ons ${(S.a.addons || []).join(", ") || "none"} (example prices)`,
      `Terms accepted: ${S.terms ? "yes" : "not yet"}`, line, "APPROVALS AND REQUESTS", ...S.log.map(l => `${new Date(l.t).toLocaleString("en-GB")}  ${l.by || ""}  ${l.what}`)].join("\n");
    const b = new Blob([txt], { type: "text/plain" }), u = URL.createObjectURL(b), el = document.createElement("a");
    el.href = u; el.download = `${(a.company || "project").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-record.txt`; document.body.appendChild(el); el.click(); el.remove(); setTimeout(() => URL.revokeObjectURL(u), 1000);
  }

  /* ---------------- draw ---------------- */
  function drawViews() {
    const v = !S.started && !Object.keys(S.a).length ? "welcome" : (S.view || "project");
    document.body.dataset.view = v; document.body.dataset.stage = S.stage;
    $("views").innerHTML = [["project", "Project"], ["dashboard", "Dashboard"], ["reports", "Reports"], ["billing", "Plan and billing"]].map(([k, l]) => `<button type="button" data-view="${k}" aria-current="${k === v ? "page" : "false"}">${l}</button>`).join("");
    return v;
  }
  function draw() {
    const v = drawViews();
    if (v === "welcome" && window.NexaLanding) { $("main").innerHTML = window.NexaLanding(); return; }
    if (v !== "project" && window.NexaDash) { drawBand(); $("main").innerHTML = window.NexaDash[v](); return; }
    drawBand(); drawSide();
    ({ brief: drawBrief, prompt: drawPrompt, sitemap: drawSitemap, concepts: drawConcepts, wireframes: drawWireframes, inner: drawInner, submit: drawSubmit, build: drawBuild, staging: drawStaging, pay: drawPay, live: drawLive }[S.stage] || drawBrief)();
  }

  window.NexaPortal = { S: () => S, tierOf, est, monthly, quote, hoursFor, terms, tierWindow, MODEL_NAME, C, aed, esc, PRICE, LIM, INCL, TIERS, STAGES, pct, save, log, draw };

  /* ---------------- events ---------------- */
  document.addEventListener("click", e => {
    const t = e.target.closest("button,[data-edit]"); if (!t) return;
    const d = t.dataset, cur = S.editing ? live().find(x => x.id === S.editing) : nextQ();
    if (d.tfam != null) { draft._fam = d.tfam; redrawBrief(); return; }
    if (d.like) { const [id, l] = d.like.split("|"), L = draft.workLikes = draft.workLikes || {}, x = new Set(L[id] || []); x.has(l) ? x.delete(l) : x.add(l); L[id] = [...x]; t.setAttribute("aria-pressed", x.has(l)); return; }
    if (d.model) { S.model = d.model; save(); draw(); return; }
    if (d.start) { S.started = true; S.view = "project"; save(); draw(); window.scrollTo({ top: 0 }); return; }
    if (d.view) { S.view = d.view; save(); draw(); window.scrollTo({ top: 0 }); return; }
    if (d.addon) { S.a.addons = [...new Set([...(S.a.addons || []), d.addon])]; log(`Added ${d.addon}`); save(); draw(); toast(`${d.addon} added to your plan.`); return; }
    if (d.report != null) { window.NexaDash.reportFile(+d.report); log("Downloaded a monthly report"); save(); return; }
    if (d.tier != null) { const k = +d.tier; if (S.paid && k < tierNow() && !S.live) { toast("Your plan is active. You can move down a plan after go-live, within the terms."); return; } const was = tierNow(); S.plan = k === score(S.a).tier && S.stage !== "pay" ? null : k; if (S.paid && k !== was) log(`Plan changed to ${TIERS[k].name}`); save(); draw(); return; }
    if (d.edit) { if (S.stage !== "brief" && !confirmBack()) return; S.stage = "brief"; S.editing = d.edit; delete draft[d.edit]; save(); draw(); return; }
    if (d.pick != null && cur) {
      let val = d.pick;
      if (cur.id === "stack") { S.a.stackAuto = val === "Recommend for me"; if (S.a.stackAuto) { val = C.recStack(S.a)[0]; toast(`We recommend ${val}. You can change it any time.`); } if (S.a.stack !== val) delete S.a.stackSetup; }
      if (cur.id === "type" && S.a.type && S.a.type !== val) { delete S.a.pages; delete draft.pages; S.plan = null; }
      draft[cur.id] = val; S.a[cur.id] = val; if (cur.id === "type" && !("pages" in S.a)) draft.pages = PAGES_DEF[val] || 8; S.editing = null; save(); draw(); return;
    }
    if (d.tog != null && cur) {
      const v = new Set(draft[cur.id] || []);
      if (v.has(d.tog)) v.delete(d.tog); else { if (cur.type === "themes" && v.size >= 3) { toast("Pick up to three looks. Remove one to add another."); return; } v.add(d.tog); }
      draft[cur.id] = [...v];
      if (cur.type === "work" || cur.type === "themes") { redrawBrief(); return; }
      t.setAttribute("aria-pressed", v.has(d.tog)); return;
    }
    if (d.back) { go(d.back); return; }
    switch (t.id) {
      case "qok": answer(false); return;
      case "tall": draft._tall = true; redrawBrief(); return;
      case "pfull": { const st = $("pstage"), on = !st.classList.contains("pfull"); st.classList.toggle("pfull", on); document.body.classList.toggle("noscroll", on); t.textContent = on ? "Close full screen" : "Full screen"; if (!on) fitPrompt(); else $("ptext").focus(); return; }
      case "qskip": answer(true); return;
      case "qcancel": S.editing = null; save(); draw(); return;
      case "addurl": { const q = live().find(x => x.type === "urls"); const L = [...document.querySelectorAll("[data-url]")].map((x, i) => ({ url: x.value, note: (document.querySelector(`[data-note="${i}"]`) || {}).value || "" })); L.push({ url: "", note: "" }); draft[q.id] = L; drawBrief(); return; }
      case "restart": if (confirmRestart()) { S = fresh(); draft = {}; save(); draw(); } return;
      case "buildprompt": S.prompt = buildPrompt(); go("prompt", "Brief completed"); return;
      case "prefine": { const ask = $("pask").value.trim(); if (!ask) { toast("Tell me what to change first."); return; } S.prompt = $("ptext").value.replace(/\n*CHANGES REQUESTED[\s\S]*$/, "") ; S.promptAsks.push(ask); S.prompt += "\n\nCHANGES REQUESTED\n" + S.promptAsks.map(x => "- " + x).join("\n"); save(); draw(); toast("Added to your prompt."); return; }
      case "papprove": S.prompt = $("ptext").value; S.sitemap = null; go("sitemap", "Prompt approved"); return;
      case "smadd": S.sitemap.push({ name: "New page", d: 0 }); S.a.pages = S.sitemap.length; save(); draw(); return;
      case "smapprove": S.a.pages = S.sitemap.length; S.concepts = { ready: false, sel: null, mode: "pick", mix: null, notes: {}, view: null }; S.wf = null; S.inner = { ready: false, tab: 0 }; go("concepts", `Sitemap approved: ${S.sitemap.length} page${S.sitemap.length === 1 ? "" : "s"}`); return;
      case "crefine": { const n = $("cnote").value.trim(); if (!n) return; S.concepts.notes[S.concepts.sel] = n; useRound("concept", `Changes asked on concept ${S.concepts.sel}: ${n}`); save(); draw(); toast("Noted. In the live studio your concept is redesigned with these changes."); return; }
      case "capprove": { const C = S.concepts; S.wf = null; S.inner = { ready: false, tab: 0 }; go("wireframes", C.mode === "mix" ? "Mixed concept approved: " + NC.SECTIONS.map(([k, l]) => l + " " + C.mix[k]).join(", ") : `Concept ${C.sel} approved: ${NC.DIRECTIONS.find(x => x.id === C.sel).name}${C.notes[C.sel] ? " (changes: " + C.notes[C.sel] + ")" : ""}`); return; }
      case "wapprove": S.inner = { ready: false, tab: 0 }; go("inner", `Wireframes approved for ${S.wf.length} page${S.wf.length === 1 ? "" : "s"}`); return;
      case "icreate": { const g = $("igen"); g.innerHTML = `<div class="bar"><i id="ibar" style="width:0"></i></div><span>Creating your pages…</span>`; let p = 0; const iv = setInterval(() => { p += 10; const b = $("ibar"); if (b) b.style.width = p + "%"; if (p >= 100) { clearInterval(iv); S.inner.ready = true; save(); draw(); } }, 120); return; }
      case "irefine": { const n = $("inote").value.trim(); if (!n) return; useRound("inner", `Change asked on ${S.wf[S.inner.tab].name}: ${n}`); save(); draw(); toast("Noted and logged."); return; }
      case "iapprove": go("submit", "Inner pages approved"); return;
      case "submit": if (!S.terms) { toast("Please agree to the terms first."); return; } S.submittedAt = now(); S.build = 0; log("Terms accepted"); go("pay", "Submitted to NEXA"); return;
      case "pay": { const t = tierNow(), md = S.model || "monthly", q = quote(t), yr = md === "monthly" && S.billing === "yearly", amt = md === "monthly" ? (yr ? q.rec * PRICE.annualPaysMonths : q.rec) : q.dueNow; S.paid = true; S.invoices.push({ t: now(), what: md === "monthly" ? `${TIERS[t].name} plan, ${yr ? "12 months (paid yearly)" : "first month"}` : `${TIERS[t].name} build, ${Math.round(PRICE.deposit * 100)}% deposit`, amt }); go("build", `${TIERS[t].name} started, ${MODEL_NAME[md].toLowerCase()}: ${aed(amt)} paid (prototype, no card charged)`); return; }
      case "record": record(); return;
      case "helpcall": log("Asked for a call"); save(); drawSide(); toast("In the live portal this opens a booking calendar with your project lead."); return;
      case "helpmsg": log("Asked to message the team"); save(); drawSide(); toast("In the live portal this opens a message thread, kept with your project."); return;
      case "bnext": S.build = Math.min(4, S.build + 1); log(BSTEPS[S.build - 1][0]); save(); draw(); return;
      case "tostaging": go("staging"); return;
      case "openstage": { const w = window.open("", "_blank"); if (w) { w.document.write(NC.page(S.a, pickOf())); w.document.close(); } return; }
      case "schanges": { const n = $("snote").value.trim(); if (!n) { toast("List the changes first."); return; } const L = n.split(/\n+/).map(x => x.trim()).filter(Boolean); L.forEach(x => S.changes.push(x)); useRound("staging", `${L.length} change${L.length === 1 ? "" : "s"} requested on staging`); S.build = 1; go("build"); return; }
      case "sapprove": go("live", "Staging approved"); return;
      case "golive": if ((S.model || "monthly") !== "monthly") { const q = quote(tierNow()); S.invoices.push({ t: now(), what: `${TIERS[tierNow()].name} build, balance before go-live`, amt: q.up - q.dueNow }); } S.live = true; S.view = "dashboard"; log("Website live"); save(); draw(); window.scrollTo({ top: 0 }); toast("You're live. This is your dashboard."); return;
      case "newreq": { const n = ($("cr") || {}).value; if (!n || !n.trim()) { toast("Describe the change first."); return; } const t = tierNow(), left = hoursFor(t) - S.usedHours; S.requests.push({ t: now(), text: n.trim(), status: left > 0 ? "We'll estimate it within " + INCL[7][t + 1].toLowerCase() : "Quote to follow" }); if (left > 0) S.usedHours += 1; log("Change requested: " + n.trim()); save(); draw(); toast("Request sent and logged."); return; }
    }
    if (d.smv) { const [i, dir] = d.smv.split("|").map(Number), j = i + dir, L = S.sitemap; if (j < 1 || j >= L.length || i < 1) return; [L[i], L[j]] = [L[j], L[i]]; save(); draw(); return; }
    if (d.smi) { const p = S.sitemap[+d.smi]; p.d = p.d ? 0 : 1; save(); draw(); return; }
    if (d.smx) { S.sitemap.splice(+d.smx, 1); S.a.pages = S.sitemap.length; save(); draw(); return; }
    if (d.csel) { S.concepts.sel = d.csel; S.concepts.mix = NC.allOf(d.csel); save(); draw(); return; }
    if (d.cview != null) { S.concepts.view = d.cview || null; save(); draw(); return; }
    if (d.cmode) { S.concepts.mode = d.cmode; if (d.cmode === "mix" && !S.concepts.mix) S.concepts.mix = NC.allOf(S.concepts.sel || "A"); save(); draw(); return; }
    if (d.mix) { const [k, id] = d.mix.split("|"); S.concepts.mix[k] = id; save(); document.querySelectorAll(`[data-mix^="${k}|"]`).forEach(b => b.setAttribute("aria-pressed", b.dataset.mix === d.mix)); const f = document.querySelector('iframe[data-src="mix"]'); if (f) f.srcdoc = NC.page(S.a, S.concepts.mix); return; }
    if (d.wx) { const [i, j] = d.wx.split("|").map(Number); S.wf[i].blocks.splice(j, 1); save(); draw(); return; }
    if (d.wup) { const [i, j] = d.wup.split("|").map(Number), B = S.wf[i].blocks; [B[j - 1], B[j]] = [B[j], B[j - 1]]; save(); draw(); return; }
    if (d.itab) { S.inner.tab = +d.itab; save(); draw(); return; }
    if (d.host) { S.hostNow = d.host; S.a.hosting = d.host; save(); draw(); return; }
    if (d.need) { const k = d.need, it = needList().find(n => n[0] === k); S.need[k] = !S.need[k]; if (S.need[k] && it) log("Provided: " + it[1]); save(); draw(); return; }
    if (d.bill) { S.billing = d.bill; save(); draw(); return; }
  });
  let armed = 0, backArmed = 0;
  function confirmBack() { if (Date.now() - backArmed < 4000) return true; backArmed = Date.now(); toast("Changing your brief after this point means re-approving the next steps. Click again to change it."); return false; }
  function confirmRestart() { if (Date.now() - armed < 4000) return true; armed = Date.now(); toast("Press Start over again to clear everything."); return false; }
  document.addEventListener("input", e => {
    const t = e.target;
    if (t.id === "qin" && t.type === "range") { $("qout").textContent = t.value; draft.pages = +t.value; }
    if (t.dataset.sm != null) { S.sitemap[+t.dataset.sm].name = t.value; save(); }
    if (t.id === "ptext") { S.prompt = t.value; save(); if (!$("pstage").classList.contains("pfull")) fitPrompt(); else { const w = $("pwords"); if (w) w.textContent = t.value.split(/\s+/).filter(Boolean).length + " words"; } }
  });
  document.addEventListener("change", e => {
    const t = e.target;
    if (t.id === "terms") { S.terms = t.checked; save(); const b = $("submit"); if (b) b.disabled = !t.checked; }
    if (t.id === "qin" && t.type === "file") { const q = live().find(x => x.type === "files"); draft[q.id] = [...t.files].map(f => f.name); $("qfiles").textContent = draft[q.id].join(", "); }
    if (t.dataset.wadd != null && t.value) { S.wf[+t.dataset.wadd].blocks.push(t.value); save(); draw(); }
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Enter" && e.target.id === "qin" && e.target.tagName === "INPUT") { e.preventDefault(); answer(false); }
    if (e.key === "Escape" && $("pstage") && $("pstage").classList.contains("pfull")) { $("pfull").click(); return; }
    if (e.key === "Enter" && e.target.id === "pask") { e.preventDefault(); $("prefine").click(); }
  });

  draw();
})();
