/* NEXA Web Studio client portal: Timeline (Gantt, blockers, delays) and Files and access (uploads, secure access, contacts).
   Reads the project from window.NexaPortal. In this prototype file contents and passwords are never stored: only file names
   and the fact that something was shared. */
(function () {
  "use strict";
  const DAY = 864e5, P = () => window.NexaPortal;
  const isWD = d => { const w = new Date(d).getDay(); return w !== 0 && w !== 6; };
  function addWD(t, n) { let d = +t; if (n <= 0) return d; let k = Math.ceil(n); while (k > 0) { d += DAY; if (isWD(d)) k--; } return d; }
  function wdDiff(a, b) { if (b <= a) return 0; let n = 0; for (let t = a; t < b; t += 36e5) if (isWD(t)) n++; return n / 24; }
  const fmt = t => new Date(t).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  const dd = n => { const r = Math.round(n * 2) / 2; return r <= 0.5 ? "under a day" : `${r} working day${r === 1 ? "" : "s"}`; };

  /* ---------- what we need from the client ---------- */
  const KIND = k => /^(access|int:|creds|hs-invite|wp-host|wp-admin|sh-collab|wf-invite|cb-env)/.test(k) ? "access"
    : /^(dns|trans|it-contact)$/.test(k) ? "person"
    : /^(hs-quote|hs-upgrade|wp-plugins|wf-plan|sh-plan|sh-pay|cb-repo|cb-call|hs-domain)$/.test(k) ? "approve" : "file";
  const WHEN = k => /^(dns|hs-domain)$/.test(k) ? "golive" : k === "trans" ? "staging" : "build";
  const WHEN_TXT = { build: "Needed before the build starts", staging: "Needed for your staging review", golive: "Needed on go-live day" };
  function items() {
    const N = P(), S = N.S(), T = plan();
    return N.needList().map(([key, title, why]) => {
      const when = WHEN(key), ph = T.rows.find(r => r.k === (when === "build" ? "content" : when === "staging" ? "staging" : "live"));
      const dueAt = S.paid ? (when === "build" ? addWD(S.at && S.at.build ? Date.parse(S.at.build) : N.nowMs(), 3) : ph ? ph.fs : null) : null;
      const done = !!S.need[key];
      return { key, title, why, kind: KIND(key), when, dueAt, done, late: !done && dueAt && N.nowMs() > dueAt, files: (S.files || {})[key] || [], who: (S.contacts || {})[key] };
    });
  }

  /* ---------- the plan: phases, baseline, actual and forecast ---------- */
  function plan() {
    const N = P(), S = N.S(), at = S.at || {}, e = N.est(S.a), nowT = N.nowMs(), pg = e.pg, L = N.needList();
    const t0 = at.start ? Date.parse(at.start) : (S.log[0] ? Date.parse(S.log[0].t) : nowT);
    const buildD = Math.max(1, Math.ceil(e.hi / 8));
    const DEF = [
      ["brief", "Your brief", "You", 1, ["start"]],
      ["design", "Prompt, sitemap and concepts", "Together", 1, ["prompt", "sitemap", "concepts"]],
      ["pages", "Wireframes and inner pages", "Together", pg > 1 ? Math.max(1, Math.ceil(pg / 12)) : 0, ["wireframes", "inner"]],
      ["start", "Submit and start your plan", "You", 1, ["submit", "pay"]],
      ["content", "Your content and access", "You", L.length ? 3 : 0, ["build"]],
      ["build", "Build and quality checks", "NEXA", buildD, ["work"]],
      ["staging", "Your staging review", "You", 2, ["staging"]],
      ["live", "Go live", "Together", 1, ["live"]]
    ].filter(r => r[3] > 0);
    const startOf = r => { for (const k of r[4]) if (at[k]) return Date.parse(at[k]); return null; };
    let cur;
    if (S.live) cur = DEF.length;
    else {
      const st = S.stage, key = st === "brief" ? "brief" : /prompt|sitemap|concepts/.test(st) ? "design" : /wireframes|inner/.test(st) ? "pages" : /submit|pay/.test(st) ? "start"
        : st === "build" ? (at.work ? "build" : "content") : st === "staging" ? "staging" : "live";
      cur = Math.max(0, DEF.findIndex(r => r[0] === key));
    }
    let bs = t0, fs = null; const rows = [];
    DEF.forEach((r, i) => {
      if (r[0] === "content" && at.build) bs = Date.parse(at.build); /* the delivery plan is set when the plan is paid for */
      const ps = bs, pe = addWD(ps, r[3]); bs = pe;
      const as = startOf(r) || (i === 0 ? t0 : null);
      const next = DEF[i + 1]; let ae = null;
      if (i < cur) ae = next ? (startOf(next) || nowT) : (at.golive ? Date.parse(at.golive) : nowT);
      let row = { k: r[0], name: r[1], owner: r[2], d: r[3], ps, pe, as, ae, i };
      if (at.build && i < DEF.findIndex(x => x[0] === "content") && as && ae) { row.ps = as; row.pe = ae; } /* steps before payment run at the client's pace */
      if (i < cur) { row.state = "done"; row.took = wdDiff(as || ps, ae); row.late = Math.max(0, row.took - r[3]); fs = ae; }
      else if (i === cur) { const s0 = as || fs || ps; row.as = s0; row.state = "now"; row.sofar = wdDiff(s0, nowT); row.late = Math.max(0, row.sofar - r[3]); row.fs = s0; row.fe = Math.max(nowT, addWD(s0, r[3])); fs = row.fe; }
      else { row.state = "next"; row.fs = fs || ps; row.fe = addWD(row.fs, r[3]); fs = row.fe; }
      rows.push(row);
    });
    const baseEnd = rows.length ? rows[rows.length - 1].pe : t0, foreEnd = S.live && at.golive ? Date.parse(at.golive) : (fs || baseEnd);
    const slip = Math.max(0, Math.round(wdDiff(baseEnd, foreEnd) * 2) / 2);
    const lateBy = o => rows.filter(r => r.owner === o && r.late > 0.25).reduce((s, r) => s + r.late, 0);
    return { rows, cur, t0, baseEnd, foreEnd, slip, lateYou: lateBy("You"), lateUs: lateBy("NEXA") + lateBy("Together"), nowT };
  }

  /* ---------- alerts: blockers, delays, things waiting on the client ---------- */
  function alerts() {
    const N = P(), S = N.S(); if (!S.started && !Object.keys(S.a).length) return [];
    const T = plan(), it = items(), A = [], c = T.rows[T.cur];
    const lateItems = it.filter(x => x.late), open = it.filter(x => !x.done);
    if (c && c.k === "content" && open.filter(x => x.when === "build").length) A.push({ lvl: lateItems.length ? "crit" : "warn", title: lateItems.length ? `Build on hold: ${lateItems.length} item${lateItems.length === 1 ? " is" : "s are"} overdue` : `Your build starts when ${open.filter(x => x.when === "build").length} more item${open.filter(x => x.when === "build").length === 1 ? " is" : "s are"} in`, body: lateItems.length ? `Waiting on: ${lateItems.map(x => x.title).slice(0, 3).join("; ")}${lateItems.length > 3 ? ` and ${lateItems.length - 3} more` : ""}. Each working day moves your go-live by a day.` : `Due by ${fmt(it.find(x => x.when === "build" && !x.done).dueAt || T.nowT)}. Add them in Files and access.`, go: "files", owner: "You" });
    else if (c && c.late > 0.25 && c.owner === "You") A.push({ lvl: "warn", title: `${c.name} is ${dd(c.late)} past the plan`, body: `We're waiting on you for this step. Go-live has moved to ${fmt(T.foreEnd)}.`, go: c.k === "staging" ? "project" : "project", owner: "You" });
    if (c && c.late > 0.25 && c.owner !== "You") A.push({ lvl: "info", title: `We're ${dd(c.late)} behind on ${c.name.toLowerCase()}`, body: "This one is on us. Your project lead will tell you why and what we're doing about it. Your price doesn't change.", go: "timeline", owner: "NEXA" });
    if (S.stage === "build" && S.build >= 4 && !S.live) A.push({ lvl: "act", title: "Your staging site is ready to review", body: "Click through the preview link and approve it, or send your changes.", go: "project", owner: "You" });
    const soon = open.filter(x => !x.late && x.when !== "build" && x.dueAt);
    if (soon.length) A.push({ lvl: "info", title: `${soon.length} item${soon.length === 1 ? "" : "s"} needed later`, body: soon.map(x => `${x.title} (${WHEN_TXT[x.when].toLowerCase()})`).join("; "), go: "files", owner: "You" });
    return A;
  }
  const ICON = { crit: '<svg viewBox="0 0 24 24"><path d="M12 3l9.5 17h-19z"/><path d="M12 10v4M12 17.5v.01"/></svg>', warn: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 16.5v.01"/></svg>', info: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.01"/></svg>', act: '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>' };
  const LVL = { crit: "Blocked", warn: "Waiting on you", info: "Heads-up", act: "Action" };
  function alertHtml(a) { const N = P(); return `<div class="alert ${a.lvl}" role="${a.lvl === "crit" ? "alert" : "status"}"><i>${ICON[a.lvl]}</i><div><span class="lbl">${LVL[a.lvl]}</span><b>${N.esc(a.title)}</b><p>${N.esc(a.body)}</p></div>${a.go ? `<button class="btn" type="button" data-view="${a.go}">${a.go === "files" ? "Add them now" : a.go === "timeline" ? "See timeline" : "Open project"}</button>` : ""}</div>`; }
  function banner() { const A = alerts().filter(a => a.lvl !== "info"); return A.length ? `<div class="alerts">${A.slice(0, 2).map(alertHtml).join("")}</div>` : ""; }
  function badges() { const N = P(), S = N.S(), A = alerts(); return { timeline: A.filter(a => a.lvl === "crit" || a.lvl === "warn").length, files: items().filter(x => !x.done && (S.paid || x.late)).length || 0 }; }

  /* ---------- Timeline view ---------- */
  function timeline() {
    const N = P(), S = N.S(), T = plan(), esc = N.esc, A = alerts();
    const lo = T.t0 - DAY * .3, hi = Math.max(T.baseEnd, T.foreEnd, T.nowT) + DAY * 1.2, span = hi - lo, X = t => ((t - lo) / span * 100).toFixed(2) + "%", W = (a, b) => (Math.max(0.6, (b - a) / span * 100)).toFixed(2) + "%";
    const days = Math.ceil(span / DAY), step = days <= 10 ? 1 : days <= 24 ? 2 : days <= 60 ? 7 : 14, ticks = [];
    for (let t = new Date(new Date(lo).toDateString()).getTime() + DAY; t < hi; t += DAY * step) ticks.push(t);
    const c = T.rows[T.cur];
    const tip = (r, extra) => esc(`<b>${r.name}</b><br>Owner: ${r.owner}<br>Planned: ${fmt(r.ps)} to ${fmt(r.pe)} (${dd(r.d)})${extra ? "<br>" + extra : ""}`);
    const rowsHtml = T.rows.map(r => {
      let bars = `<span class="gb base" style="left:${X(r.ps)};width:${W(r.ps, r.pe)}"></span>`, st;
      if (r.state === "done") { bars += `<span class="gb done hit" style="left:${X(r.as || r.ps)};width:${W(r.as || r.ps, r.ae)}" data-tip="${tip(r, `Took ${dd(r.took)}${r.late > .25 ? `, ${dd(r.late)} over` : ""}`)}"></span>`; st = `<span class="gs ok">&#10003; Done${r.late > .25 ? `, ${dd(r.late)} over` : ""}</span>`; }
      else if (r.state === "now") {
        const pe = addWD(r.as, r.d), late = r.late > .25;
        bars += `<span class="gb now hit" style="left:${X(r.as)};width:${W(r.as, Math.min(T.nowT, pe))}" data-tip="${tip(r, `In this step for ${dd(r.sofar)}`)}"></span>`;
        if (T.nowT < pe) bars += `<span class="gb rest" style="left:${X(T.nowT)};width:${W(T.nowT, pe)}"></span>`;
        if (late) bars += `<span class="gb late hit" style="left:${X(pe)};width:${W(pe, T.nowT)}" data-tip="${tip(r, `${dd(r.late)} past the plan`)}"></span>`;
        st = late ? `<span class="gs ${r.owner === "You" ? "bad" : "warn"}">${r.owner === "You" ? "Waiting on you" : "Running late"}, ${dd(r.late)} late</span>` : `<span class="gs cur">In progress, ${dd(r.sofar)} so far</span>`;
      } else { bars += `<span class="gb next hit" style="left:${X(r.fs)};width:${W(r.fs, r.fe)}" data-tip="${tip(r, `Expected: ${fmt(r.fs)} to ${fmt(r.fe)}`)}"></span>`; st = `<span class="gs">Starts ${fmt(r.fs)}</span>`; }
      return `<div class="grow ${r.state}"><div class="gl"><b>${esc(r.name)}</b><span><em class="own ${r.owner.toLowerCase()}">${r.owner}</em>${st}</span></div><div class="gt">${bars}<span class="todr" style="left:${X(T.nowT)}"></span></div></div>`;
    }).join("");
    const kpi = (l, v, s, cls) => `<div class="kp ${cls || ""}"><span class="lbl">${l}</span><b>${v}</b><span>${s}</span></div>`;
    const blockers = items().filter(x => !x.done && (x.late || (c && c.k === "content" && x.when === "build")));
    return `<div class="dash tlv">
      <section class="dcard hero"><div class="hl"><span class="lbl p">Timeline</span><h2>${S.live ? "Your site is live" : c ? `Now: ${esc(c.name)}` : "Your project plan"}</h2><p>${S.live ? `Live on ${fmt(T.foreEnd)}.` : `Planned go-live ${fmt(T.baseEnd)}. ${T.slip ? `Now expected ${fmt(T.foreEnd)}, ${dd(T.slip)} later${T.lateYou >= T.lateUs ? ", mostly while we waited on items from you" : ""}.` : "On track."}`}</p></div></section>
      <div class="kps">${kpi("Planned go-live", fmt(T.baseEnd), S.paid ? "Set when you started your plan" : "If you keep this pace")}${kpi("Expected go-live", fmt(T.foreEnd), T.slip ? `${dd(T.slip)} later than planned` : "On track", T.slip ? "w" : "")}${kpi("Current step", c ? esc(c.name) : "Done", c ? (c.owner === "You" ? "Waiting on you" : c.owner === "NEXA" ? "With our team" : "You and our team") : "")}${kpi("Blockers", String(blockers.length), blockers.length ? "Holding up the build" : "Nothing blocking", blockers.length ? "w" : "")}</div>
      ${A.length ? `<section class="dcard"><div class="dh"><h3>Notices</h3><span class="mut">In the live portal these also reach you by email.</span></div><div class="alerts">${A.map(alertHtml).join("")}</div></section>` : ""}
      <section class="dcard"><div class="dh"><h3>Project plan</h3><div class="glegend"><span><i class="lg done"></i>Done</span><span><i class="lg now"></i>In progress</span><span><i class="lg next"></i>Expected</span><span><i class="lg late"></i>Late</span><span><i class="lg base"></i>Original plan</span></div></div>
        <div class="gantt"><div class="grow gaxis"><div class="gl"></div><div class="gt">${ticks.map(t => `<span class="tk" style="left:${X(t)}">${new Date(t).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>`).join("")}<span class="today" style="left:${X(T.nowT)}"><em>Today</em></span></div></div>${rowsHtml}</div>
        <p class="mut" style="margin:12px 0 0;font-size:12.5px">Working days, Monday to Friday. Build time counts from when everything on your list is in. Hover a bar for dates.</p></section>
      ${blockers.length ? `<section class="dcard"><div class="dh"><h3>What's holding things up</h3><button class="btn" type="button" data-view="files">Go to Files and access</button></div><ul class="blkr">${blockers.map(x => `<li><i class="${x.late ? "bad" : "warn"}">${x.late ? ICON.crit : ICON.warn}</i><div><b>${esc(x.title)}</b><span>${x.late ? `Overdue since ${fmt(x.dueAt)}` : x.dueAt ? `Due ${fmt(x.dueAt)}` : WHEN_TXT[x.when]} · owner: you</span></div></li>`).join("")}</ul></section>` : ""}
      <div class="demo"><span class="lbl">Prototype</span><span style="flex:1 1 220px">See how delays show: move the clock forward and watch the plan, notices and go-live date change.</span><button class="btn" type="button" data-sim="1">Move one working day on</button>${S.simDays ? `<button class="skip" type="button" data-sim="0">Back to today</button>` : ""}</div>
    </div>`;
  }

  /* ---------- Files and access view ---------- */
  let openKey = null;
  function files() {
    const N = P(), S = N.S(), esc = N.esc, it = items(), open = it.filter(x => !x.done).sort((a, b) => (b.late - a.late) || ((a.dueAt || 9e15) - (b.dueAt || 9e15))), done = it.filter(x => x.done), sk = N.skipped();
    const n = it.length, k = done.length, pct = n ? Math.round(k / n * 100) : 100, firstDue = it.filter(x => x.when === "build" && x.dueAt)[0];
    const status = x => x.done ? `<span class="gs ok">&#10003; ${x.kind === "file" ? "Uploaded" : x.kind === "access" ? "Access shared" : x.kind === "person" ? "Contact added" : "Approved"}</span>` : x.late ? `<span class="gs bad">Overdue since ${fmt(x.dueAt)}</span>` : x.dueAt ? `<span class="gs warn">Due ${fmt(x.dueAt)}</span>` : `<span class="gs">${WHEN_TXT[x.when]}</span>`;
    const action = x => {
      if (x.kind === "file") return `<label class="btn up">Upload<input type="file" multiple data-upfile="${esc(x.key)}" hidden></label>`;
      if (x.kind === "approve") return `<button class="btn" type="button" data-fapprove="${esc(x.key)}">${/call/.test(x.key) ? "Book it" : /domain/.test(x.key) ? "Mark as done" : "Approve"}</button>`;
      return `<button class="btn" type="button" data-fopen="${esc(x.key)}" aria-expanded="${openKey === x.key}">${x.kind === "access" ? "Share access" : "Add contact"}</button>`;
    };
    const form = x => openKey !== x.key ? "" : x.kind === "access" ? `<div class="fform"><div class="opt2"><div><b>Best: invite us as a user</b><span>Invite your project team from inside the system, so you can remove us any time. Your project lead sends you the address to invite.</span><button class="btn" type="button" data-finvite="${esc(x.key)}">I've sent the invitation</button></div>
        <div><b>Or: add a login to the secure vault</b><span>Encrypted, seen only by your project lead, deleted at go-live. Use a demo or test login where you have one.</span><input class="in" id="vu" placeholder="Username or email" autocomplete="off"><input class="in" id="vp" type="password" placeholder="Password" autocomplete="new-password"><input class="in" id="vn" placeholder="Login page or notes (optional)" autocomplete="off"><button class="btn" type="button" data-fvault="${esc(x.key)}">Save to vault</button></div></div>
        <p class="note">Prototype: nothing typed here is saved. Never send passwords by email or chat.</p></div>`
      : `<div class="fform"><div class="row2"><input class="in" id="cn" placeholder="Name" style="flex:1 1 180px"><input class="in" id="ce" type="email" placeholder="Email" style="flex:1 1 220px"><button class="btn" type="button" data-fperson="${esc(x.key)}">Save contact</button></div></div>`;
    const card = x => `<li class="fi ${x.done ? "done" : x.late ? "late" : ""}"><div class="fh"><div><b>${esc(x.title)}</b><span>${esc(x.why)}</span>${x.files.length ? `<small class="fl">${x.files.map(f => `<em>${esc(f)}</em>`).join("")}</small>` : ""}${x.who ? `<small class="fl"><em>${esc(x.who.name)}${x.who.email ? ", " + esc(x.who.email) : ""}</em></small>` : ""}</div><div class="fa">${status(x)}${x.done ? `<button class="skip" type="button" data-fundo="${esc(x.key)}">Undo</button>` : action(x)}</div></div>${form(x)}</li>`;
    const lib = Object.entries(S.files || {}).flatMap(([key, L]) => L.map(f => [key, f])).filter(([, f]) => !/^(Shared|Invitation)/.test(f));
    return `<div class="dash fz">
      <section class="dcard hero"><div class="hl"><span class="lbl p">Files and access</span><h2>${open.length ? `${open.length} thing${open.length === 1 ? "" : "s"} still needed from you` : "Everything is in. Thank you."}</h2><p>Brand files, content, logins and contacts all go here, in one place, linked to your project. ${S.paid ? (firstDue ? `Build items are due by ${fmt(firstDue.dueAt)}; the build starts as soon as they're in.` : "") : "Add anything now. Nothing is due until you start your plan."}</p></div><div class="hr"><div class="fbar"><b>${k} of ${n}</b><span>in</span><div class="bar"><i style="width:${pct}%"></i></div></div></div></section>
      ${open.length ? `<section class="dcard"><div class="dh"><h3>Needed from you</h3><span class="mut">Overdue first</span></div><ul class="fil">${open.map(card).join("")}</ul></section>` : ""}
      ${sk.length ? `<section class="dcard"><div class="dh"><h3>Skipped in your brief</h3><span class="mut">Add them any time. Until then we use sensible defaults.</span></div><div class="chips">${sk.map(q => `<button class="chip" type="button" data-edit="${esc(q.id)}">${esc(q.label)}</button>`).join("")}</div></section>` : ""}
      <section class="dcard"><div class="dh"><h3>Your library</h3><label class="btn up">Add a file<input type="file" multiple data-upfile="other" hidden></label></div>
        ${lib.length ? `<ul class="flib">${lib.map(([key, f]) => `<li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/></svg><b>${esc(f)}</b><span>${esc(key === "other" ? "Other files" : (it.find(x => x.key === key) || { title: "Brief" }).title)}</span></li>`).join("")}</ul>` : `<p class="mut" style="margin:0">Logos, brand guidelines, fonts, copy, photos, videos, product lists. Everything you upload appears here, for you and the team.</p>`}
        <p class="note" style="margin-top:12px">Prototype: only file names are kept. In the live portal files are stored privately for your project and nothing is shared with anyone else.</p></section>
      ${done.length ? `<section class="dcard"><details><summary class="dh" style="cursor:pointer"><h3>Done (${done.length})</h3></summary><ul class="fil">${done.map(card).join("")}</ul></details></section>` : ""}
    </div>`;
  }

  /* ---------- events ---------- */
  const markDone = (key, what, label) => { const N = P(), S = N.S(); S.need[key] = true; if (label) { S.files = S.files || {}; S.files[key] = [...(S.files[key] || []), label]; } N.log(what); openKey = null; N.save(); N.draw(); };
  document.addEventListener("change", e => {
    const t = e.target; if (!t.matches || !t.matches("[data-upfile]") || !t.files.length) return;
    const N = P(), S = N.S(), key = t.dataset.upfile, names = [...t.files].map(f => f.name); S.files = S.files || {}; S.files[key] = [...(S.files[key] || []), ...names];
    const it = items().find(x => x.key === key); if (it) S.need[key] = true;
    N.log(`Uploaded ${names.length} file${names.length === 1 ? "" : "s"}${it ? " for " + it.title.toLowerCase() : ""}`); N.save(); N.draw(); N.toast("Uploaded. Your project team can see it now.");
  });
  document.addEventListener("click", e => {
    const t = e.target.closest("button"); if (!t) return; const d = t.dataset, N = P(), S = N.S();
    const it = k => items().find(x => x.key === k) || { title: k };
    if (d.fopen) { openKey = openKey === d.fopen ? null : d.fopen; N.draw(); return; }
    if (d.finvite) { markDone(d.finvite, `Invited NEXA: ${it(d.finvite).title}`, "Invitation sent"); N.toast("Thanks. We'll accept it and confirm here."); return; }
    if (d.fvault) { const u = document.getElementById("vu"), p = document.getElementById("vp"); if (!u.value.trim() || !p.value) { N.toast("Add the username and password first."); return; } u.value = ""; p.value = ""; markDone(d.fvault, `Shared a login securely: ${it(d.fvault).title}`, "Shared through the vault"); N.toast("Saved to the vault. Only your project lead can see it."); return; }
    if (d.fperson) { const n = document.getElementById("cn").value.trim(), m = document.getElementById("ce").value.trim(); if (!n) { N.toast("Add a name first."); return; } S.contacts = S.contacts || {}; S.contacts[d.fperson] = { name: n, email: m }; markDone(d.fperson, `Contact added: ${it(d.fperson).title}`); return; }
    if (d.fapprove) { markDone(d.fapprove, `Approved: ${it(d.fapprove).title}`); return; }
    if (d.fundo) { S.need[d.fundo] = false; N.save(); N.draw(); return; }
    if (d.sim != null) { S.simDays = d.sim === "0" ? 0 : (S.simDays || 0) + (() => { let n = 1, t = N.nowMs() + DAY; while (!isWD(t)) { t += DAY; n++; } return n; })(); N.save(); N.draw(); return; }
  });

  window.NexaTrack = { timeline, files, plan, items, alerts, banner, badges };
})();
