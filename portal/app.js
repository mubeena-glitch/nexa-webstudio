/* NEXA Web Studio client portal (prototype).
   One client journey: brief chat -> prompt -> sitemap -> concepts (choose or mix) -> wireframes -> inner pages
   -> submit -> build -> staging -> plan and payment -> live. Every gate is an explicit approval, logged with a time.
   State is kept in this browser only (localStorage). Prices are not set: NEXA confirms them. */
(function () {
  "use strict";
  const $ = id => document.getElementById(id);
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const KEY = "nexa-portal-v1";
  const NC = window.NexaConcepts;
  const now = () => new Date().toISOString();
  const when = s => new Date(s).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

  /* ---------------- state ---------------- */
  const fresh = () => ({ a: {}, stage: "brief", editing: null, prompt: "", promptAsks: [], sitemap: null, concepts: { ready: false, sel: null, mode: "pick", mix: null, notes: {}, view: null },
    wf: null, inner: { ready: false, tab: 0 }, submittedAt: null, build: 0, changes: [], plan: null, paid: false, hostNow: null, live: false, log: [] });
  let S;
  try { S = JSON.parse(localStorage.getItem(KEY) || "null") || fresh(); } catch (e) { S = fresh(); }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
  const log = what => { S.log.push({ t: now(), what }); };
  const toast = t => { const el = $("toast"); el.textContent = t; el.classList.add("on"); clearTimeout(toast.h); toast.h = setTimeout(() => el.classList.remove("on"), 2600); };

  /* ---------------- the brief ---------------- */
  const SECTORS = ["Real estate", "Hospitality", "Healthcare", "Education", "Finance", "Technology", "Retail", "Food and drink", "Professional services", "Government", "Other"];
  const EXPERIENCE = [["AI-generated images", "Original imagery made for your brand"], ["AI-generated video", "Short films for hero sections"], ["3D elements", "Interactive 3D objects or scenes"], ["Immersive scroll storytelling", "The page unfolds as you scroll"], ["Page transitions", "Smooth movement between pages"], ["Micro-animations", "Small touches on buttons and cards"]];
  const ADDONS = [["SEO setup", "Keywords, meta, schema and a technical check"], ["Analytics and tracking", "GA4, Tag Manager, conversion events"], ["More motion", "Richer animation across the site"], ["Copywriting", "We write the words for every page"], ["Translation", "Your site in more languages"], ["Integrations", "Connect your CRM, bookings, payments and more"], ["Care plan", "Updates, backups, monitoring and small changes"]];
  const INTEGRATIONS = ["HubSpot CRM", "Salesforce", "Booking engine", "Payment gateway", "Newsletter", "Live chat or chatbot", "Custom API"];
  const PAGES_DEF = { "Website": 8, "Landing page": 1, "Microsite": 4, "Online store": 12, "Members portal": 10 };

  const Q = [
    { id: "name", ask: () => "Hello, I'm Web Studio. Let's shape your project together. Answer what you can and skip anything you're not sure about. What should I call you?", type: "text", ph: "Your name" },
    { id: "company", ask: a => `Nice to meet you${a.name ? ", " + a.name : ""}. Which company or brand is this for?`, type: "text", ph: "Company or brand" },
    { id: "email", ask: () => "Where should we send updates about your project?", type: "email", ph: "name@company.com" },
    { id: "type", ask: () => "What are we building?", type: "single", opts: ["Website", "Landing page", "Microsite", "Online store", "Members portal"] },
    { id: "sector", ask: () => "Which sector are you in?", type: "single", opts: SECTORS },
    { id: "pages", ask: a => `Roughly how many pages will the ${(a.type || "site").toLowerCase()} need? A guess is fine; we'll firm it up in the sitemap.`, type: "slider", min: 1, max: 40, def: a => PAGES_DEF[a.type] || 8 },
    { id: "goals", ask: () => "What should it achieve? Pick all that apply.", type: "multi", opts: ["Generate leads", "Sell online", "Bookings", "Build the brand", "Inform and educate", "Recruit", "Launch a product"] },
    { id: "audience", ask: () => "Who is it for? Describe your ideal visitor in a sentence.", type: "text", ph: "For example: families in Dubai looking for their first home" },
    { id: "style", ask: () => "Which style feels most like you?", type: "single", opts: ["Minimal", "Luxury", "Simple", "Retro", "Artistic", "Editorial", "Bold"] },
    { id: "experience", ask: () => "Any of these experiences? They lift the site and move you up a plan.", type: "cards", opts: EXPERIENCE },
    { id: "motion", ask: () => "How much movement do you want?", type: "single", opts: ["Subtle", "Balanced", "Expressive"] },
    { id: "brandMode", ask: () => "Let's talk brand. Where should your colours and fonts come from?", type: "single", opts: [["upload", "I'll upload my brand files"], ["site", "Take it from my current website"], ["suggest", "Suggest a look for me"], ["manual", "I'll enter colours and fonts"]] },
    { id: "brandFiles", ask: () => "Upload your brand guidelines, logo or fonts.", sub: "PDF, images or font files. In this prototype only the file names are kept.", type: "files", cond: a => a.brandMode === "upload" },
    { id: "currentSite", ask: () => "What's your current website address?", type: "url", ph: "https://", cond: a => a.brandMode === "site" },
    { id: "colours", ask: () => "Pick your brand colours, main colour first.", type: "colours", cond: a => a.brandMode === "manual" },
    { id: "fonts", ask: () => "And your fonts, if you know them.", type: "fonts", cond: a => a.brandMode === "manual" },
    { id: "refs", ask: () => "Any websites you love? Add up to five and tell us what you like about each.", type: "urls" },
    { id: "content", ask: () => "How ready is your content?", type: "single", opts: ["Copy and images are ready", "Some of it is ready", "We need help with all of it"] },
    { id: "languages", ask: () => "Which languages?", type: "multi", opts: ["English", "Arabic", "French", "Other"] },
    { id: "stack", ask: () => "Which platform should we build on?", sub: "Not sure? Choose Recommend for me and we'll advise.", type: "single", opts: ["Recommend for me", "HubSpot CMS", "WordPress", "Webflow", "Shopify", "Custom build (Next.js)"] },
    { id: "domain", ask: () => "Do you already have a domain name?", type: "single", opts: ["Yes, I have one", "No, help me get one"] },
    { id: "hosting", ask: () => "When it's ready, how should we put it live?", type: "single", opts: [["nexa", "NEXA hosts it for me"], ["dns", "I'll add the DNS records you send me"], ["access", "I'll give you access to my domain and hosting"], ["later", "Decide later"]] },
    { id: "timeline", ask: () => "When do you need it?", type: "single", opts: ["As soon as possible", "Within a month", "In 1 to 3 months", "I'm flexible"] },
    { id: "addons", ask: () => "Last choices. Any add-ons?", sub: "Each add-on is a small monthly amount on top of your plan.", type: "cards", opts: ADDONS },
    { id: "integrations", ask: () => "Which systems should we connect?", type: "multi", opts: INTEGRATIONS, cond: a => (a.addons || []).includes("Integrations") },
    { id: "transLangs", ask: () => "Which languages should we translate into?", type: "text", ph: "For example: Arabic, French", cond: a => (a.addons || []).includes("Translation") },
    { id: "notes", ask: () => "Anything else we should know?", type: "textarea", ph: "Competitors, must-haves, things to avoid…" }
  ];
  const LBL = { name: "Your name", company: "Company or brand", email: "Email for updates", type: "Building", sector: "Sector", pages: "Pages", goals: "Goals", audience: "Audience", style: "Style", experience: "Experiences", motion: "Motion", brandMode: "Brand source", brandFiles: "Brand files", currentSite: "Current website", colours: "Colours", fonts: "Fonts", refs: "References", content: "Content", languages: "Languages", stack: "Platform", domain: "Domain", hosting: "Going live", timeline: "Timing", addons: "Add-ons", integrations: "Integrations", transLangs: "Translate into", notes: "Notes" };
  const optVal = o => Array.isArray(o) ? o[0] : o, optLbl = o => Array.isArray(o) ? o[1] : o;
  const live = () => Q.filter(q => !q.cond || q.cond(S.a));
  const nextQ = () => live().find(q => !(q.id in S.a));
  const fmtAns = (q, v) => {
    if (v === null || v === undefined || (Array.isArray(v) && !v.length) || v === "") return "Skipped";
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
  const TIERS = [
    { id: "essential", name: "Essential", desc: "Clean, focused sites" },
    { id: "growth", name: "Growth", desc: "Bigger sites, more features" },
    { id: "signature", name: "Signature", desc: "Immersive, integrated, bespoke" }
  ];
  function score(a) {
    const r = [], add = (l, p) => { if (p) r.push([l, p]); };
    const pg = a.pages || PAGES_DEF[a.type] || 1;
    add(pg + " pages", pg <= 10 ? 1 : pg <= 20 ? 2.5 : pg <= 30 ? 3 : 4);
    add({ "Online store": "Online store", "Members portal": "Members area" }[a.type], { "Online store": 2, "Members portal": 3 }[a.type] || 0);
    const ex = a.experience || [], EXP = { "AI-generated images": 1, "AI-generated video": 2, "3D elements": 3, "Immersive scroll storytelling": 3, "Page transitions": 1, "Micro-animations": .5 };
    ex.forEach(e => add(e, EXP[e]));
    add("Expressive motion", a.motion === "Expressive" ? 1 : 0);
    add(a.style + " style", ["Luxury", "Artistic"].includes(a.style) ? .5 : 0);
    add(a.stack, { "Custom build (Next.js)": 2, "Shopify": 1 }[a.stack] || 0);
    (a.integrations || []).forEach(i => add(i, ["Payment gateway", "Booking engine", "Custom API"].includes(i) ? 1.5 : 1));
    const langs = (a.languages || []).length;
    add("Extra languages", langs > 1 ? (langs - 1) * ((a.languages || []).includes("Arabic") ? 1.5 : 1) : 0);
    const pts = r.reduce((s, x) => s + x[1], 0);
    return { pts, r, tier: pts < 4 ? 0 : pts < 9 ? 1 : 2 };
  }
  const ETA = ["3 to 5 working days", "7 to 10 working days", "12 to 20 working days"];

  /* ---------------- stages and progress ---------------- */
  const STAGES = [["brief", "Brief", 15], ["prompt", "Prompt", 5], ["sitemap", "Sitemap", 10], ["concepts", "Concepts", 20], ["wireframes", "Wireframes", 8], ["inner", "Inner pages", 12], ["submit", "Submit", 5], ["build", "Build", 13], ["staging", "Staging", 5], ["pay", "Plan and payment", 4], ["live", "Live", 3]];
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
    $("tiers").innerHTML = TIERS.map((t, k) => `<button class="tier ${k === sc.tier ? "rec" : ""} ${k === chosen ? "sel" : ""}" type="button" data-tier="${k}" aria-pressed="${k === chosen}">${k === sc.tier ? `<span class="tag">Recommended</span>` : `<span class="tag" style="visibility:hidden">.</span>`}<b>${t.name}</b><small>${t.desc}</small><small>Monthly price: to be confirmed</small></button>`).join("");
    const note = $("plnote");
    if (chosen < sc.tier) {
      const top = sc.r.slice().sort((x, y) => y[1] - x[1]).filter(x => !/pages$/.test(x[0])).slice(0, 3).map(x => x[0]);
      note.hidden = false; note.textContent = `Your choices fit ${TIERS[sc.tier].name}. To stay on ${TIERS[chosen].name}, consider dropping: ${top.join(", ") || "some pages"}.`;
    } else note.hidden = true;
    $("projname").textContent = S.a.company ? S.a.company + (S.a.type ? " · " + S.a.type : "") : "Your new project";
  }

  /* ---------------- side ---------------- */
  function drawSide() {
    const a = S.a, sc = score(a), chosen = S.plan == null ? sc.tier : S.plan;
    const host = { nexa: "NEXA hosts it", dns: "Client adds DNS records", access: "Access to domain and hosting", later: "Decide later" }[a.hosting] || "Not chosen yet";
    const rows = [["Building", a.type], ["Sector", a.sector], ["Pages", a.pages], ["Style", a.style], ["Platform", a.stack], ["Going live", host]].filter(x => x[1] != null && x[1] !== "");
    const addons = a.addons || [];
    $("side").innerHTML = `
      <section class="card"><h3>Your project</h3><div class="kv">${rows.length ? rows.map(([k, v]) => `<div><span>${k}</span><b>${esc(v)}</b></div>`).join("") : `<p style="margin:0;color:var(--muted)">Your answers appear here as you go.</p>`}</div></section>
      <section class="card"><h3>Monthly plan</h3><div class="money">
        <div><b>${TIERS[chosen].name} plan</b><span class="tbc">To be confirmed</span></div>
        ${addons.map(x => `<div><span>+ ${esc(x)}</span><span class="tbc">To be confirmed</span></div>`).join("")}
        <div style="border-top:1px solid var(--line);padding-top:8px;margin-top:4px"><b>Monthly total</b><span class="tbc">NEXA confirms before you pay</span></div>
      </div><p style="font-size:12px;color:var(--muted);margin:10px 0 0">You pay monthly for your website, not one large bill up front.</p></section>
      <section class="card"><h3>Approvals</h3>${S.log.length ? `<ul class="log">${S.log.slice().reverse().map(l => `<li><div>${esc(l.what)}<small>${when(l.t)}</small></div></li>`).join("")}</ul>` : `<p style="margin:0;color:var(--muted);font-size:13px">Every step you approve is recorded here with the time, so we always build exactly what you signed off.</p>`}</section>`;
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
      case "urls": { const L = (v && v.length ? v : [{ url: "", note: "" }]); return `<div style="display:flex;flex-direction:column;gap:8px" id="urls">${L.map((r, i) => `<div class="row2"><input class="in" data-url="${i}" placeholder="https://" value="${esc(r.url)}" style="flex:1 1 220px"><input class="in" data-note="${i}" placeholder="What you like about it" value="${esc(r.note)}" style="flex:1 1 220px"></div>`).join("")}</div>${L.length < 5 ? `<button class="skip" type="button" id="addurl" style="align-self:flex-start">+ Add another</button>` : ""}`; }
    }
    return "";
  }
  function readControl(q) {
    const el = $("qin");
    switch (q.type) {
      case "text": case "email": case "url": case "textarea": return (el.value || "").trim() || null;
      case "slider": return +el.value;
      case "single": case "multi": case "cards": return draft[q.id] == null || (Array.isArray(draft[q.id]) && !draft[q.id].length) ? null : draft[q.id];
      case "colours": return [...document.querySelectorAll("[data-col]")].map(x => x.value);
      case "fonts": { const h = $("fh").value.trim(), b = $("fb").value.trim(); return h || b ? { head: h, body: b } : null; }
      case "files": return draft[q.id] && draft[q.id].length ? draft[q.id] : null;
      case "urls": { const r = [...document.querySelectorAll("[data-url]")].map((x, i) => ({ url: x.value.trim(), note: (document.querySelector(`[data-note="${i}"]`) || {}).value || "" })).filter(x => x.url); return r.length ? r : null; }
    }
  }
  function drawBrief() {
    const L = live(), cur = S.editing ? L.find(q => q.id === S.editing) : nextQ();
    let h = `<div class="chat">`;
    for (const q of L) {
      if (cur && q.id === cur.id) break;
      if (!(q.id in S.a)) continue;
      h += bot(esc(q.ask(S.a))) + me(esc(fmtAns(q, S.a[q.id])), q.id);
    }
    if (cur) {
      h += bot(esc(cur.ask(S.a)));
      h += `<div class="ask">${cur.sub ? `<div class="sub" style="margin-top:0">${esc(cur.sub)}</div>` : ""}${control(cur)}<div class="row2"><button class="btn pri" type="button" id="qok">Continue</button><button class="skip" type="button" id="qskip">Skip for now</button>${S.editing ? `<button class="skip" type="button" id="qcancel">Cancel</button>` : ""}</div></div>`;
    } else {
      h += bot("That's everything I need. Here's your brief. Check it, change anything by clicking it, then build your prompt.");
      h += `<div class="stage"><h2>Your brief</h2><div class="review">${L.map(q => `<div data-edit="${q.id}" style="cursor:pointer"><span>${esc(LBL[q.id] || q.id)}</span><b style="font-weight:500">${esc(fmtAns(q, S.a[q.id]))}</b></div>`).join("")}</div>
        <div class="gate"><button class="btn pri big" type="button" id="buildprompt">Build my prompt</button><span class="note">Your prompt is the instruction set your concepts are designed from. You can refine it before anything is designed.</span></div></div>`;
    }
    $("main").innerHTML = h + `</div>`;
    const qi = $("qin"); if (qi && cur && ["text", "email", "url"].includes(cur.type)) qi.focus({ preventScroll: true });
    const target = document.querySelector(".ask") || document.querySelector(".stage"); if (target && (S.editing || live().some(q => q.id in S.a))) target.scrollIntoView({ block: "center", behavior: "smooth" });
  }
  function answer(skip) {
    const q = S.editing ? live().find(x => x.id === S.editing) : nextQ(); if (!q) return;
    let v = skip ? null : readControl(q);
    if (!skip && q.type === "email" && v && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) { toast("That email address doesn't look right."); return; }
    if (!skip && q.type === "url" && v && !/^https?:\/\//i.test(v)) v = "https://" + v;
    S.a[q.id] = v; delete draft[q.id];
    if (q.id === "type" && !("pages" in S.a)) draft.pages = PAGES_DEF[v] || 8;
    S.editing = null; save(); draw();
  }

  /* ---------------- prompt ---------------- */
  function buildPrompt() {
    const a = S.a, f = (id) => { const q = Q.find(x => x.id === id); return fmtAns(q, a[id]); }, has = id => a[id] != null && !(Array.isArray(a[id]) && !a[id].length);
    const brand = a.brandMode === "upload" ? `Use the brand files supplied: ${f("brandFiles")}.` : a.brandMode === "site" ? `Take the colours, type and logo from the current website ${a.currentSite || "(address to follow)"}, and modernise them.` : a.brandMode === "manual" ? `Colours: ${f("colours")}. Fonts: ${f("fonts")}.` : `No brand yet: suggest a palette and type pairing that suit a ${a.style || "clean"} style in ${a.sector || "this"} sector.`;
    const L = [
      "PROJECT", `Design and build a ${(a.type || "website").toLowerCase()} for ${a.company || "the client"}${a.sector ? ", in the " + a.sector.toLowerCase() + " sector" : ""}.`,
      has("goals") ? `Goals: ${f("goals")}.` : "", has("audience") ? `Audience: ${a.audience}.` : "", `Size: about ${a.pages || PAGES_DEF[a.type] || 1} page${(a.pages || 1) === 1 ? "" : "s"}. The sitemap is agreed in the next step.`, "",
      "LOOK AND FEEL", `Style: ${a.style || "to be suggested"}. Motion: ${a.motion || "balanced"}.`, has("experience") ? `Experiences: ${f("experience")}.` : "", brand,
      has("refs") ? `References: ${f("refs")}.` : "", "",
      "CONTENT", `Content: ${has("content") ? f("content") : "to be confirmed"}.`, `Languages: ${has("languages") ? f("languages") : "English"}${(a.languages || []).includes("Arabic") ? " (Arabic pages right to left)" : ""}.`, "",
      "TECHNOLOGY", `Platform: ${a.stack || "recommend one"}.`, `Domain: ${has("domain") ? f("domain") : "to be confirmed"}. Going live: ${has("hosting") ? f("hosting") : "to be decided"}.`, "",
      has("addons") ? "ADD-ONS" : "", has("addons") ? f("addons") + "." : "", has("integrations") ? `Integrations: ${f("integrations")}.` : "", has("transLangs") ? `Translate into: ${a.transLangs}.` : "", has("addons") ? "" : "",
      "DELIVERY", `Timing: ${has("timeline") ? f("timeline") : "flexible"}.`, "Standards: mobile first, accessible, fast to load, search-ready titles and descriptions on every page, consent-ready tracking.", "",
      has("notes") ? "NOTES" : "", has("notes") ? a.notes : ""
    ];
    return L.filter((x, i, arr) => !(x === "" && arr[i - 1] === "")).join("\n").trim();
  }
  function drawPrompt() {
    if (!S.prompt) { S.prompt = buildPrompt(); save(); }
    $("main").innerHTML = bot("Here's your prompt, written from your brief. Edit it directly, or tell me what to change. When it reads right, approve it and I'll draft your sitemap.") + `
      <div class="stage"><h2>Your prompt</h2>
        <textarea class="in prompt" id="ptext" aria-label="Your prompt">${esc(S.prompt)}</textarea>
        <div class="row2"><input class="in" id="pask" placeholder="Tell me what to change, for example: make it feel more premium" style="flex:1 1 280px"><button class="btn" type="button" id="prefine">Refine</button></div>
        <div class="gate"><button class="btn" type="button" data-back="brief">Back to my brief</button><button class="btn pri big" type="button" id="papprove">Approve and generate sitemap</button><span class="note">Approving records the prompt as the basis for your design.</span></div>
      </div>`;
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
  function genSitemap() {
    const a = S.a, n = Math.max(1, a.pages || PAGES_DEF[a.type] || 8), sub = SUB[a.sector] || SUB.Other;
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
      if (C.sel) h += `<div class="row2"><input class="in" id="cnote" placeholder="Changes to concept ${C.sel}, for example: warmer colours, larger photos" value="${esc(C.notes[C.sel] || "")}" style="flex:1 1 280px"><button class="btn" type="button" id="crefine">Ask for changes</button></div>`;
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
        <div class="row2"><input class="in" id="inote" placeholder="Changes to the ${esc(S.wf[t].name)} page" style="flex:1 1 280px"><button class="btn" type="button" id="irefine">Ask for changes</button></div>
        <div class="gate"><button class="btn" type="button" data-back="wireframes">Back to wireframes</button><button class="btn pri big" type="button" id="iapprove">Approve all pages</button></div></div>`;
    fillFrames();
  }

  /* ---------------- submit, build, staging, pay, live ---------------- */
  const tierNow = () => S.plan == null ? score(S.a).tier : S.plan;
  function drawSubmit() {
    const a = S.a, t = tierNow();
    $("main").innerHTML = bot("Everything is approved. Submit your project and our team starts building.") + `
      <div class="stage"><h2>Ready to submit</h2><div class="review">
        <div><span>Building</span><b>${esc(a.type || "Website")} for ${esc(a.company || "your brand")}</b></div>
        <div><span>Pages</span><b>${S.sitemap ? S.sitemap.length : 1}</b></div>
        <div><span>Concept</span><b>${S.concepts.mode === "mix" ? "Your mixed concept" : "Concept " + esc(S.concepts.sel || "A")}</b></div>
        <div><span>Platform</span><b>${esc(a.stack || "We'll recommend one")}</b></div>
        <div><span>Plan</span><b>${TIERS[t].name}</b></div>
        <div><span>Going live</span><b>${esc({ nexa: "NEXA hosts it", dns: "You add our DNS records", access: "You give us domain and hosting access", later: "Decide later" }[a.hosting] || "Decide later")}</b></div>
      </div>
      <div class="eta"><div><span class="lbl">Estimated build time</span><br><b>${ETA[t]}</b></div><span style="font-size:13px;color:var(--ink2);flex:1 1 240px">Your estimate is confirmed by NEXA when we accept the brief. You'll see every step here.</span></div>
      <div class="gate"><button class="btn" type="button" data-back="inner">Back</button><button class="btn pri big" type="button" id="submit">Submit to NEXA</button></div></div>`;
  }
  const BSTEPS = [["Brief accepted", "Our team has checked your brief and approvals."], ["Building", "Developers are building your pages on your platform."], ["Quality checks", "Mobile, speed, accessibility, forms and links are tested."], ["Staging ready", "Your private preview link is ready to review."]];
  function demo(label, id) { return `<div class="demo"><span class="lbl">Prototype</span><span style="flex:1 1 200px">In the live portal this moves on its own as our team works.</span><button class="btn" type="button" id="${id}">${label}</button></div>`; }
  function drawBuild() {
    const t = tierNow();
    $("main").innerHTML = bot(S.build >= 4 ? "Your staging site is ready." : `Your website is being built. Estimated time: ${ETA[t]}. You can close this page; we'll email ${esc(S.a.email || "you")} when it's ready.`) + `
      <div class="stage"><h2>Build progress</h2><div class="track">${BSTEPS.map((b, i) => `<div class="tstep ${i < S.build ? "done" : i === S.build ? "cur" : ""}"><i>${i < S.build ? "&#10003;" : i + 1}</i><div><b>${b[0]}</b><span>${b[1]}</span></div></div>`).join("")}</div>
      ${S.changes.length ? `<div><span class="lbl">Changes you asked for</span><ul style="margin:6px 0 0;padding-left:18px">${S.changes.map(c => `<li>${esc(c)}</li>`).join("")}</ul></div>` : ""}
      ${S.build < 4 ? demo("Show the next step", "bnext") : `<div class="gate"><button class="btn pri big" type="button" id="tostaging">Review my staging site</button></div>`}</div>`;
  }
  function drawStaging() {
    $("main").innerHTML = bot("Here's your staging site: the real build, on a private link. Click through every page. Approve it, or tell us what to change.") + `
      <div class="stage"><h2>Review your staging site</h2>
        <div class="row2"><span class="lbl">Staging link</span><span style="color:var(--muted)">Appears here when your build is ready.</span><button class="btn" type="button" id="openstage">Open the preview</button></div>
        <textarea class="in" id="snote" placeholder="Anything to change? List it here, one change per line."></textarea>
        <div class="gate"><button class="btn" type="button" id="schanges">Request changes</button><button class="btn pri big" type="button" id="sapprove">Approve staging</button><span class="note">Approving confirms the site is ready to go live. Changes after this are handled as change requests.</span></div></div>`;
  }
  function drawPay() {
    const sc = score(S.a), t = tierNow();
    $("main").innerHTML = bot("Your site is approved. Confirm your monthly plan and we'll take it live.") + `
      <div class="stage"><h2>Your monthly plan</h2>
        <div class="cards">${TIERS.map((x, k) => `<button class="opt" type="button" data-tier="${k}" aria-pressed="${k === t}"><b>${x.name}${k === sc.tier ? " · recommended" : ""}</b><span>${x.desc}</span><span>Monthly price: to be confirmed</span></button>`).join("")}</div>
        <div class="money" style="max-width:420px">${(S.a.addons || []).map(x => `<div><span>+ ${esc(x)}</span><span class="tbc">To be confirmed</span></div>`).join("") || `<div><span>No add-ons</span><span></span></div>`}</div>
        <div class="demo"><span class="lbl">Prototype</span><span style="flex:1 1 200px">Card payment is not switched on in this prototype, and prices are set by NEXA.</span></div>
        <div class="gate"><button class="btn pri big" type="button" id="pay">Start my monthly plan</button></div></div>`;
  }
  function drawLive() {
    const h = S.a.hosting && S.a.hosting !== "later" ? S.a.hosting : S.hostNow;
    if (S.live) {
      $("main").innerHTML = bot(`Congratulations${S.a.name ? ", " + esc(S.a.name) : ""}. Your website is live.`) + `<div class="stage"><h2>You're live</h2><p class="lead">Your site, your plan and every approval stay here. Need a change? Ask from this portal and it's logged like everything else.</p><div class="row2"><button class="btn pri" type="button" id="newreq">Request a change</button></div></div>`;
      return;
    }
    let body;
    if (!h) body = `<p class="lead">How should we put your site live?</p><div class="cards">${[["nexa", "NEXA hosts it", "We host, secure and monitor it."], ["dns", "I'll add DNS records", "We send the records; you add them at your domain provider."], ["access", "I'll give you access", "We send a secure access invitation."]].map(([k, l, d]) => `<button class="opt" type="button" data-host="${k}"><b>${l}</b><span>${d}</span></button>`).join("")}</div>`;
    else if (h === "dns") body = `<p class="lead">Add these records at your domain provider. The values are issued when your site is ready to go live, and we check them for you.</p><table class="dns"><thead><tr><th>Type</th><th>Name</th><th>Value</th></tr></thead><tbody><tr><td>A</td><td>@</td><td style="color:var(--muted)">Issued at go-live</td></tr><tr><td>CNAME</td><td>www</td><td style="color:var(--muted)">Issued at go-live</td></tr><tr><td>TXT</td><td>@</td><td style="color:var(--muted)">Verification code, issued at go-live</td></tr></tbody></table>`;
    else if (h === "access") body = `<p class="lead">We'll send a secure invitation to your domain and hosting accounts. Never send passwords by email or chat; the invitation keeps your account in your control.</p>`;
    else body = `<p class="lead">We host it for you: secure certificate, backups and monitoring included. Point your domain to us and we do the rest.</p>`;
    $("main").innerHTML = bot("Last step: going live.") + `<div class="stage"><h2>Going live</h2>${body}${h ? `<div class="gate"><button class="btn pri big" type="button" id="golive">Confirm and go live</button></div>` : ""}</div>`;
  }

  /* ---------------- draw ---------------- */
  function draw() {
    drawBand(); drawSide();
    ({ brief: drawBrief, prompt: drawPrompt, sitemap: drawSitemap, concepts: drawConcepts, wireframes: drawWireframes, inner: drawInner, submit: drawSubmit, build: drawBuild, staging: drawStaging, pay: drawPay, live: drawLive }[S.stage] || drawBrief)();
  }

  /* ---------------- events ---------------- */
  document.addEventListener("click", e => {
    const t = e.target.closest("button,[data-edit]"); if (!t) return;
    const d = t.dataset, cur = S.editing ? live().find(x => x.id === S.editing) : nextQ();
    if (d.tier != null) { const k = +d.tier; S.plan = k === score(S.a).tier && S.stage !== "pay" ? null : k; save(); draw(); return; }
    if (d.edit) { if (S.stage !== "brief" && !confirmBack()) return; S.stage = "brief"; S.editing = d.edit; delete draft[d.edit]; save(); draw(); return; }
    if (d.pick != null && cur) { draft[cur.id] = d.pick; S.a[cur.id] = d.pick; if (cur.id === "type" && !("pages" in S.a)) draft.pages = PAGES_DEF[d.pick] || 8; S.editing = null; save(); draw(); return; }
    if (d.tog != null && cur) { const v = new Set(draft[cur.id] || []); v.has(d.tog) ? v.delete(d.tog) : v.add(d.tog); draft[cur.id] = [...v]; t.setAttribute("aria-pressed", v.has(d.tog)); return; }
    if (d.back) { go(d.back); return; }
    switch (t.id) {
      case "qok": answer(false); return;
      case "qskip": answer(true); return;
      case "qcancel": S.editing = null; save(); draw(); return;
      case "addurl": { const q = live().find(x => x.type === "urls"); const L = [...document.querySelectorAll("[data-url]")].map((x, i) => ({ url: x.value, note: (document.querySelector(`[data-note="${i}"]`) || {}).value || "" })); L.push({ url: "", note: "" }); draft[q.id] = L; drawBrief(); return; }
      case "restart": if (confirmRestart()) { S = fresh(); draft = {}; save(); draw(); } return;
      case "buildprompt": S.prompt = buildPrompt(); go("prompt", "Brief completed"); return;
      case "prefine": { const ask = $("pask").value.trim(); if (!ask) { toast("Tell me what to change first."); return; } S.prompt = $("ptext").value.replace(/\n*CHANGES REQUESTED[\s\S]*$/, "") ; S.promptAsks.push(ask); S.prompt += "\n\nCHANGES REQUESTED\n" + S.promptAsks.map(x => "- " + x).join("\n"); save(); draw(); toast("Added to your prompt."); return; }
      case "papprove": S.prompt = $("ptext").value; S.sitemap = null; go("sitemap", "Prompt approved"); return;
      case "smadd": S.sitemap.push({ name: "New page", d: 0 }); S.a.pages = S.sitemap.length; save(); draw(); return;
      case "smapprove": S.a.pages = S.sitemap.length; S.concepts = { ready: false, sel: null, mode: "pick", mix: null, notes: {}, view: null }; S.wf = null; S.inner = { ready: false, tab: 0 }; go("concepts", `Sitemap approved: ${S.sitemap.length} page${S.sitemap.length === 1 ? "" : "s"}`); return;
      case "crefine": { const n = $("cnote").value.trim(); if (!n) return; S.concepts.notes[S.concepts.sel] = n; save(); toast("Noted. In the live studio your concept is redesigned with these changes."); return; }
      case "capprove": { const C = S.concepts; S.wf = null; S.inner = { ready: false, tab: 0 }; go("wireframes", C.mode === "mix" ? "Mixed concept approved: " + NC.SECTIONS.map(([k, l]) => l + " " + C.mix[k]).join(", ") : `Concept ${C.sel} approved: ${NC.DIRECTIONS.find(x => x.id === C.sel).name}${C.notes[C.sel] ? " (changes: " + C.notes[C.sel] + ")" : ""}`); return; }
      case "wapprove": S.inner = { ready: false, tab: 0 }; go("inner", `Wireframes approved for ${S.wf.length} page${S.wf.length === 1 ? "" : "s"}`); return;
      case "icreate": { const g = $("igen"); g.innerHTML = `<div class="bar"><i id="ibar" style="width:0"></i></div><span>Creating your pages…</span>`; let p = 0; const iv = setInterval(() => { p += 10; const b = $("ibar"); if (b) b.style.width = p + "%"; if (p >= 100) { clearInterval(iv); S.inner.ready = true; save(); draw(); } }, 120); return; }
      case "irefine": { const n = $("inote").value.trim(); if (!n) return; log(`Change asked on ${S.wf[S.inner.tab].name}: ${n}`); save(); drawSide(); toast("Noted and logged."); $("inote").value = ""; return; }
      case "iapprove": go("submit", "Inner pages approved"); return;
      case "submit": S.submittedAt = now(); S.build = 0; go("build", "Submitted to NEXA for build"); return;
      case "bnext": S.build = Math.min(4, S.build + 1); log(BSTEPS[S.build - 1][0]); save(); draw(); return;
      case "tostaging": go("staging"); return;
      case "openstage": { const w = window.open("", "_blank"); if (w) { w.document.write(NC.page(S.a, pickOf())); w.document.close(); } return; }
      case "schanges": { const n = $("snote").value.trim(); if (!n) { toast("List the changes first."); return; } n.split(/\n+/).forEach(x => x.trim() && S.changes.push(x.trim())); S.build = 1; go("build", "Changes requested on staging"); return; }
      case "sapprove": go("pay", "Staging approved"); return;
      case "pay": S.paid = true; go("live", `${TIERS[tierNow()].name} plan confirmed (payment not live in prototype)`); return;
      case "golive": S.live = true; log("Website live"); save(); draw(); return;
      case "newreq": toast("Change requests open here in the live portal."); return;
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
  });
  let armed = 0, backArmed = 0;
  function confirmBack() { if (Date.now() - backArmed < 4000) return true; backArmed = Date.now(); toast("Changing your brief after this point means re-approving the next steps. Click again to change it."); return false; }
  function confirmRestart() { if (Date.now() - armed < 4000) return true; armed = Date.now(); toast("Press Start over again to clear everything."); return false; }
  document.addEventListener("input", e => {
    const t = e.target;
    if (t.id === "qin" && t.type === "range") { $("qout").textContent = t.value; draft.pages = +t.value; }
    if (t.dataset.sm != null) { S.sitemap[+t.dataset.sm].name = t.value; save(); }
  });
  document.addEventListener("change", e => {
    const t = e.target;
    if (t.id === "qin" && t.type === "file") { const q = live().find(x => x.type === "files"); draft[q.id] = [...t.files].map(f => f.name); $("qfiles").textContent = draft[q.id].join(", "); }
    if (t.dataset.wadd != null && t.value) { S.wf[+t.dataset.wadd].blocks.push(t.value); save(); draw(); }
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Enter" && e.target.id === "qin" && e.target.tagName === "INPUT") { e.preventDefault(); answer(false); }
    if (e.key === "Enter" && e.target.id === "pask") { e.preventDefault(); $("prefine").click(); }
  });

  draw();
})();
