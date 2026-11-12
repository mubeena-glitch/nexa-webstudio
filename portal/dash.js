/* NEXA Web Studio client portal: Dashboard, Reports and Plan and billing views.
   Charts are plain inline SVG. Until a site is live (and in this prototype), figures are SAMPLE data, labelled as such.
   Chart colours: NEXA Purple for single series; categorical slots validated for colour-blind separation:
   #9354FF purple, #1A9E70 green, #E0602C orange, #2A78D6 blue (in that fixed order). */
(function () {
  "use strict";
  const P = () => window.NexaPortal;
  const CAT = ["#9354FF", "#1A9E70", "#E0602C", "#2A78D6"];
  const OK = "#1F8F5F", WARN = "#A86A0E";

  /* ---------- seeded sample data ---------- */
  function rng(seed) { let h = 2166136261; for (const c of String(seed)) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return () => { h += 0x6D2B79F5; let t = h; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const KW = { "Real estate": ["apartments for sale dubai", "off plan projects dubai", "family villas dubai", "first home dubai", "dubai property investment", "3 bedroom townhouse dubai"],
    "Hospitality": ["luxury hotel ras al khaimah", "beach resort uae", "family staycation uae", "spa weekend dubai", "best brunch rak", "romantic getaway uae"],
    "Healthcare": ["dermatologist dubai", "aesthetic clinic dubai", "laser treatment dubai", "best doctor jumeirah", "skin clinic near me", "botox dubai price"],
    default: ["agency dubai", "best services uae", "company near me", "book online dubai", "trusted provider uae", "consultation dubai"] };
  function data() {
    const S = P().S(), a = S.a, r = rng((a.company || "NEXA") + (a.sector || "")), tier = P().tierOf();
    const base = [140, 260, 420][tier] * (1 + Math.min(40, (S.sitemap || []).length || a.pages || 8) / 40);
    const days = [], today = new Date(); today.setHours(0, 0, 0, 0);
    for (let i = 29; i >= 0; i--) { const d = new Date(today); d.setDate(d.getDate() - i); const wk = [0.78, 1.06, 1.1, 1.08, 1.04, 0.92, 0.74][d.getDay()]; days.push({ d, v: Math.round(base * wk * (0.88 + (29 - i) * 0.008) * (0.9 + r() * 0.2)) }); }
    const prev = days.reduce((s, x) => s + x.v, 0) * (0.82 + r() * 0.1);
    const visits = days.reduce((s, x) => s + x.v, 0), conv = 0.021 + r() * 0.013, leads = Math.round(visits * conv);
    const weeks = [0, 1, 2, 3].map(w => ({ w: `Week ${w + 1}`, v: Math.round(days.slice(w * 7 + 2, w * 7 + 9).reduce((s, x) => s + x.v, 0) * conv * (0.9 + r() * 0.2)) }));
    let src = [["Search", 40 + r() * 12], ["Direct", 18 + r() * 8], ["Social", 14 + r() * 10], ["Referral", 8 + r() * 6]]; const t = src.reduce((s, x) => s + x[1], 0); src = src.map(([k, v]) => [k, v / t * 100]);
    const pages = ((S.sitemap || []).length ? S.sitemap.map(p => p.name) : ["Home", "About", "Services", "Contact"]).slice(0, 6);
    const top = pages.map((n, i) => [n, Math.round(visits * (i ? 0.42 / (i + 0.6) : 0.38) * (0.85 + r() * 0.3))]).sort((x, y) => y[1] - x[1]);
    const funnel = [["Visits", visits], ["Engaged visits", Math.round(visits * (0.5 + r() * 0.1))], ["Saw a form", Math.round(visits * (0.1 + r() * 0.04))], ["Leads", leads]];
    const kws = (KW[a.sector] || KW.default).map((k, i) => { const pos = Math.max(1, Math.round(2 + i * 2.2 + r() * 4)); return [k, pos, Math.round((r() - 0.3) * 6)]; });
    const page1 = [2, 4, 7, 9, 12, kws.filter(k => k[1] <= 10).length + 10].map((v, i) => ({ m: new Date(today.getFullYear(), today.getMonth() - 5 + i, 1).toLocaleDateString("en-GB", { month: "short" }), v }));
    const speed = Math.round(88 + r() * 9), lcp = (1.4 + r() * 0.9).toFixed(1), inp = Math.round(90 + r() * 90), cls = (0.01 + r() * 0.05).toFixed(2);
    const up = days.map((x, i) => ({ d: x.d, down: i === 11 ? 4 : 0 }));
    return { days, visits, prev, conv, leads, weeks, src, top, funnel, kws, page1, speed, lcp, inp, cls, up, uptime: 100 - 4 / (30 * 1440) * 100 };
  }
  const fmt = n => Math.round(n).toLocaleString("en-GB");
  const day = d => d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });

  /* ---------- chart pieces ---------- */
  function spark(vals, w = 120, h = 34) {
    const mx = Math.max(...vals), mn = Math.min(...vals), x = i => i / (vals.length - 1) * (w - 4) + 2, y = v => h - 3 - (v - mn) / ((mx - mn) || 1) * (h - 8);
    return `<svg class="spark" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" aria-hidden="true"><path d="${vals.map((v, i) => (i ? "L" : "M") + x(i).toFixed(1) + " " + y(v).toFixed(1)).join("")}" fill="none" stroke="#9354FF" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/><circle cx="${x(vals.length - 1)}" cy="${y(vals[vals.length - 1])}" r="3" fill="#9354FF" stroke="#fff" stroke-width="2"/></svg>`;
  }
  function delta(now, before, goodUp = true) {
    const ch = (now - before) / (before || 1) * 100, up = ch >= 0, good = up === goodUp;
    return `<span class="dl ${good ? "g" : "w"}">${up ? "&#9650;" : "&#9660;"} ${Math.abs(ch).toFixed(0)}% <small>vs previous 30 days</small></span>`;
  }
  function kpi(label, value, sub, extra) { return `<div class="kp"><span class="lbl">${label}</span><b class="${String(value).length > 12 ? "sm" : ""}">${value}</b>${sub || ""}${extra || ""}</div>`; }
  function area(days) {
    const W = 760, H = 240, L = 44, R = 12, T = 14, B = 28, vals = days.map(d => d.v), mx = Math.ceil(Math.max(...vals) * 1.15 / 100) * 100;
    const x = i => L + i / (days.length - 1) * (W - L - R), y = v => T + (1 - v / mx) * (H - T - B), st = (W - L - R) / (days.length - 1);
    const line = vals.map((v, i) => (i ? "L" : "M") + x(i).toFixed(1) + " " + y(v).toFixed(1)).join("");
    const grid = [0, 0.5, 1].map(f => `<line x1="${L}" x2="${W - R}" y1="${y(mx * f)}" y2="${y(mx * f)}" class="gl"/><text x="${L - 8}" y="${y(mx * f) + 4}" text-anchor="end" class="ax">${fmt(mx * f)}</text>`).join("");
    const xl = [0, 7, 14, 21, 29].map(i => `<text x="${x(i)}" y="${H - 8}" text-anchor="middle" class="ax">${day(days[i].d)}</text>`).join("");
    const hits = days.map((d, i) => `<g class="hit" data-tip="<b>${fmt(d.v)}</b> visitors<br>${d.d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}"><rect x="${x(i) - st / 2}" y="${T}" width="${st}" height="${H - T - B}" fill="transparent"/><line x1="${x(i)}" x2="${x(i)}" y1="${T}" y2="${H - B}" class="xh"/><circle cx="${x(i)}" cy="${y(d.v)}" r="5" class="pt"/></g>`).join("");
    return `<svg viewBox="0 0 ${W} ${H}" class="chart" role="img" aria-label="Visitors per day for the last 30 days"><defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9354FF" stop-opacity=".22"/><stop offset="1" stop-color="#9354FF" stop-opacity="0"/></linearGradient></defs>${grid}<path d="${line}L${x(days.length - 1)} ${y(0)}L${x(0)} ${y(0)}Z" fill="url(#ag)"/><path d="${line}" fill="none" stroke="#9354FF" stroke-width="2" stroke-linejoin="round"/>${xl}${hits}</svg>`;
  }
  function bars(items, label, unit) {
    const W = 480, H = 220, L = 30, B = 26, T = 18, mx = Math.max(...items.map(i => i.v)) * 1.2 || 1, bw = (W - L - 10) / items.length, y = v => T + (1 - v / mx) * (H - T - B);
    return `<svg viewBox="0 0 ${W} ${H}" class="chart" role="img" aria-label="${label}"><line x1="${L}" x2="${W - 6}" y1="${H - B}" y2="${H - B}" class="gl"/>${items.map((it, i) => { const x0 = L + i * bw + bw * 0.22, w = bw * 0.56, top = y(it.v), h = H - B - top; return `<g class="hit" data-tip="<b>${fmt(it.v)}</b> ${unit}<br>${it.w || it.m}"><rect x="${L + i * bw}" y="${T}" width="${bw}" height="${H - T - B}" fill="transparent"/><path d="M${x0} ${H - B}V${top + 4}Q${x0} ${top} ${x0 + 4} ${top}H${x0 + w - 4}Q${x0 + w} ${top} ${x0 + w} ${top + 4}V${H - B}Z" class="bar"/><text x="${x0 + w / 2}" y="${top - 6}" text-anchor="middle" class="vl">${fmt(it.v)}</text><text x="${x0 + w / 2}" y="${H - 8}" text-anchor="middle" class="ax">${it.w || it.m}</text></g>`; }).join("")}</svg>`;
  }
  function stack(src) {
    let acc = 0;
    return `<div class="stk" role="img" aria-label="Where visitors come from">${src.map(([k, v], i) => { const s = `<span class="hit" data-tip="<b>${v.toFixed(0)}%</b> from ${k}" style="width:calc(${v}% - 2px);background:${CAT[i]}"></span>`; acc += v; return s; }).join("")}</div>
      <div class="lgd">${src.map(([k, v], i) => `<span><i style="background:${CAT[i]}"></i>${k} <b>${v.toFixed(0)}%</b></span>`).join("")}</div>`;
  }
  function hbars(rows, unit) { const mx = Math.max(...rows.map(r => r[1])) || 1; return `<div class="hb">${rows.map(([k, v]) => `<div class="hit" data-tip="<b>${fmt(v)}</b> ${unit}<br>${P().esc(k)}"><span class="k">${P().esc(k)}</span><span class="t"><i style="width:${v / mx * 100}%"></i></span><b>${fmt(v)}</b></div>`).join("")}</div>`; }
  function funnel(f) { const mx = f[0][1]; return `<div class="fn">${f.map(([k, v], i) => `<div class="hit" data-tip="<b>${fmt(v)}</b> ${k.toLowerCase()}${i ? `<br>${(v / f[i - 1][1] * 100).toFixed(0)}% of the step before` : ""}"><span class="k">${k}</span><span class="t"><i style="width:${Math.max(2, v / mx * 100)}%"></i></span><b>${fmt(v)}</b>${i ? `<small>${(v / f[i - 1][1] * 100).toFixed(0)}%</small>` : "<small></small>"}</div>`).join("")}</div>`; }
  function ring(v, label, colour = "#9354FF", unit = "", show) { const r = 42, c = 2 * Math.PI * r; return `<svg viewBox="0 0 110 110" class="ring" role="img" aria-label="${label}: ${v} out of 100"><circle cx="55" cy="55" r="${r}" fill="none" stroke="#ECEBEF" stroke-width="10"/><circle cx="55" cy="55" r="${r}" fill="none" stroke="${colour}" stroke-width="10" stroke-linecap="round" stroke-dasharray="${c * v / 100} ${c}" transform="rotate(-90 55 55)"/><text x="55" y="62" text-anchor="middle" class="rv">${show != null ? show : v}${unit ? `<tspan font-size="14">${unit}</tspan>` : ""}</text></svg>`; }
  const tbl = (head, rows) => `<details class="nums"><summary>Show the numbers</summary><table class="dns"><thead><tr>${head.map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></details>`;
  const ICON = { ok: `<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M5 8.2l2 2 4-4.4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>` };

  function locked(title, why, addon, price) {
    return `<div class="lock"><div class="blur" aria-hidden="true">${spark([3, 5, 4, 7, 6, 9, 8, 11, 10, 13], 300, 90)}</div><div class="lk"><span class="lbl p">Not switched on</span><b>${title}</b><p>${why}</p><button class="btn pri" type="button" data-addon="${addon}">Add ${addon}, ${price} a month</button></div></div>`;
  }

  /* ---------- views ---------- */
  function sampleNote(S) { return `<div class="smp"><span class="lbl">${S.live ? "Sample data" : "Preview"}</span><span>${S.live ? "Prototype: these are sample figures. In the live portal they come from your site's analytics, search console, speed tests and uptime checks." : "Your real numbers appear here the day your site goes live. Until then this is a preview with sample figures."}</span></div>`; }
  function project(S) {
    const N = P(), e = N.est(S.a), pct = N.pct(), st = N.STAGES, i = st.findIndex(s => s[0] === S.stage), done = S.log.length;
    return `<section class="dcard hero"><div class="hl"><span class="lbl p">${S.live ? "Your website is live" : "Your project"}</span><h2>${S.live ? "Everything about your site, in one place." : `Step ${i + 1} of ${st.length}: ${st[i][1]}`}</h2><p>${S.live ? `Live since ${new Date((S.log.find(l => l.what === "Website live") || {}).t || Date.now()).toLocaleDateString("en-GB", { day: "numeric", month: "long" })}. Ask for changes, read your reports and manage your plan from here.` : `Estimated build time once we have your content: <b>${e.text}</b>.`}</p>
      <div class="tl">${st.map((s, k) => `<span class="${S.live || k < i ? "d" : k === i ? "c" : ""}" title="${s[1]}"></span>`).join("")}</div></div>
      <div class="hr">${ring(pct, "Project progress", "#9354FF", "%")}<span class="lbl">Progress</span></div></section>
      <div class="kps">${kpi("Approvals recorded", done, `<small class="mut">Every one timed and named</small>`)}${kpi("Pages", e.pg, `<small class="mut">${S.wf ? S.wf.length + " inner pages wireframed" : "Firm once the sitemap is approved"}</small>`)}${kpi("Change rounds used", S.rounds.concept + S.rounds.inner + S.rounds.staging, `<small class="mut">Across concepts, pages and staging</small>`)}${kpi("Build time", e.text, `<small class="mut">From when we have your content</small>`)}</div>`;
  }
  function performance(S) {
    const N = P(), D = data(), ad = S.a.addons || [], hasA = ad.includes("Analytics and tracking"), hasS = ad.includes("SEO setup"), aed = N.aed;
    const vals = D.days.map(d => d.v), half = vals.slice(15).reduce((s, v) => s + v, 0), firsthalf = vals.slice(0, 15).reduce((s, v) => s + v, 0);
    let h = sampleNote(S);
    h += `<div class="kps">${hasA ? kpi("Visitors, 30 days", fmt(D.visits), delta(D.visits, D.prev), spark(vals)) + kpi("Leads", fmt(D.leads), delta(D.leads, D.leads * 0.86), spark(D.weeks.map(w => w.v))) + kpi("Conversion rate", (D.conv * 100).toFixed(1) + "%", `<small class="mut">Visitors who became leads</small>`) : ""}
      ${kpi("Speed score", D.speed + "<small>/100</small>", `<span class="dl g">${ICON.ok} Good</span>`)}${kpi("Uptime, 30 days", D.uptime.toFixed(2) + "%", `<span class="dl g">${ICON.ok} 1 short outage</span>`)}</div>`;
    if (hasA) {
      h += `<section class="dcard"><div class="dh"><h3>Visitors</h3><span class="mut">Last 30 days · second half ${delta(half, firsthalf).replace("vs previous 30 days", "vs first half")}</span></div><div class="cx">${area(D.days)}</div>${tbl(["Day", "Visitors"], D.days.map(d => [day(d.d), fmt(d.v)]))}</section>
      <div class="g2"><section class="dcard"><div class="dh"><h3>Where visitors come from</h3></div>${stack(D.src)}<div style="height:18px"></div><div class="dh"><h3>Top pages</h3></div>${hbars(D.top, "visits")}</section>
      <section class="dcard"><div class="dh"><h3>Leads per week</h3></div>${bars(D.weeks, "Leads per week", "leads")}<div class="dh" style="margin-top:6px"><h3>From visit to lead</h3></div>${funnel(D.funnel)}</section></div>`;
    } else h += `<section class="dcard">${locked("Visitors, leads and where they come from", "See every visitor, every enquiry and which channels bring them, updated daily, with a monthly report.", "Analytics and tracking", aed(N.PRICE.addons["Analytics and tracking"]))}</section>`;
    if (hasS) {
      h += `<div class="g2"><section class="dcard"><div class="dh"><h3>Keywords on Google's first page</h3></div>${bars(D.page1, "Keywords on Google's first page by month", "keywords on page 1")}</section>
      <section class="dcard"><div class="dh"><h3>Your keywords</h3></div><table class="dns kw"><thead><tr><th>Keyword</th><th>Position</th><th>Change</th></tr></thead><tbody>${D.kws.map(([k, p, c]) => `<tr><td>${N.esc(k)}</td><td><b>${p}</b></td><td class="${c > 0 ? "up" : c < 0 ? "dn" : ""}">${c > 0 ? "&#9650; " + c : c < 0 ? "&#9660; " + -c : "No change"}</td></tr>`).join("")}</tbody></table></section></div>`;
    } else h += `<section class="dcard">${locked("Search rankings", "Track your keywords on Google, what moved this month, and what we're doing next.", "SEO setup", aed(N.PRICE.addons["SEO setup"]))}</section>`;
    h += `<div class="g2"><section class="dcard"><div class="dh"><h3>Speed and health</h3><span class="mut">Google Core Web Vitals, mobile</span></div><div class="vit">${ring(D.speed, "Speed score", OK)}<div class="vl3">${[["Largest content shows in", D.lcp + " s", "under 2.5 s"], ["Responds to a tap in", D.inp + " ms", "under 200 ms"], ["Layout shift", D.cls, "under 0.1"]].map(([k, v, g]) => `<div><span>${k}</span><b>${v}</b><span class="dl g">${ICON.ok} Good, ${g}</span></div>`).join("")}</div></div></section>
      <section class="dcard"><div class="dh"><h3>Uptime</h3><span class="mut">Checked every 3 minutes</span></div><div class="upst">${D.up.map(u => `<span class="hit ${u.down ? "w" : ""}" data-tip="${day(u.d)}<br><b>${u.down ? u.down + " minutes down, fixed" : "Up all day"}</b>"></span>`).join("")}</div><div class="lgd"><span><i style="background:${OK}"></i>Up all day</span><span><i style="background:${WARN}"></i>Short outage</span></div><p class="mut" style="margin:10px 0 0;font-size:12.5px">One 4-minute outage on ${day(D.up[11].d)}. We were alerted and it was back before most people noticed.</p></section></div>`;
    return h;
  }
  function dashboard() { const S = P().S(); return `<div class="dash">${project(S)}${performance(S)}</div>`; }

  function reports() {
    const N = P(), S = N.S(), t = N.tierOf(), can = t >= 1 || (S.a.addons || []).includes("Analytics and tracking"), today = new Date();
    const months = [1, 2, 3].map(k => new Date(today.getFullYear(), today.getMonth() - k + 1, 1));
    let h = `<div class="dash"><section class="dcard hero"><div class="hl"><span class="lbl p">Reports</span><h2>Your monthly report, every month.</h2><p>Visitors, leads, search rankings, speed, uptime and what we changed, in one page you can share with your team.</p></div></section>${sampleNote(S)}`;
    if (!can) h += `<section class="dcard">${locked("Monthly performance reports", "Included in Growth and Signature, or with Analytics and tracking on any plan.", "Analytics and tracking", N.aed(N.PRICE.addons["Analytics and tracking"]))}</section>`;
    else h += `<div class="rl">${months.map((m, i) => { const D = data(); return `<section class="dcard rp"><span class="lbl">${m.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}${i === 0 ? " · so far" : ""}</span><div class="rpk"><div><b>${fmt(D.visits * (1 - i * 0.07))}</b><span>visitors</span></div><div><b>${fmt(D.leads * (1 - i * 0.09))}</b><span>leads</span></div><div><b>${D.speed}</b><span>speed score</span></div></div>${spark(D.days.map(d => d.v * (1 - i * 0.07)), 260, 46)}<div class="row2"><button class="btn" type="button" data-report="${i}">Download report</button></div></section>`; }).join("")}</div>`;
    return h + `</div>`;
  }
  function reportFile(i) {
    const N = P(), S = N.S(), D = data(), m = new Date(); m.setMonth(m.getMonth() - i);
    const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${N.esc(S.a.company || "Website")} report, ${m.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</title><style>body{font-family:Poppins,system-ui,sans-serif;color:#1B1B1B;max-width:860px;margin:40px auto;padding:0 20px}h1{font-size:26px}.k{display:flex;gap:24px;flex-wrap:wrap}.k div{background:#F3EEFF;border-radius:12px;padding:14px 18px}.k b{display:block;font-size:24px;color:#683EB5}svg{width:100%;height:auto}.gl{stroke:#ECEBEF}.ax{font-size:11px;fill:#727272}.hit .xh,.hit .pt{display:none}.vl{font-size:11px;fill:#474747}.bar{fill:#9354FF}table{border-collapse:collapse;width:100%}td,th{border-bottom:1px solid #ECEBEF;padding:6px;text-align:left;font-size:13px}p.s{color:#A86A0E;font-size:12px}</style></head><body>
      <h1>${N.esc(S.a.company || "Your website")}: monthly report</h1><p>${m.toLocaleDateString("en-GB", { month: "long", year: "numeric" })} · prepared by NEXA Web Studio</p><p class="s">Prototype: sample figures.</p>
      <div class="k"><div><b>${fmt(D.visits)}</b>visitors</div><div><b>${fmt(D.leads)}</b>leads</div><div><b>${(D.conv * 100).toFixed(1)}%</b>conversion</div><div><b>${D.speed}/100</b>speed</div><div><b>${D.uptime.toFixed(2)}%</b>uptime</div></div>
      <h2>Visitors</h2>${area(D.days)}<h2>Leads per week</h2>${bars(D.weeks, "Leads per week", "leads")}
      <h2>Top pages</h2><table>${D.top.map(([k, v]) => `<tr><td>${N.esc(k)}</td><td>${fmt(v)}</td></tr>`).join("")}</table>
      <h2>What we changed</h2><ul>${(S.requests || []).map(r => `<li>${N.esc(r.text)}</li>`).join("") || "<li>No change requests this month.</li>"}</ul></body></html>`;
    const b = new Blob([html], { type: "text/html" }), u = URL.createObjectURL(b), a = document.createElement("a");
    a.href = u; a.download = `${(S.a.company || "website").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-report-${m.toISOString().slice(0, 7)}.html`; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(u), 1000);
  }
  function billing() {
    const N = P(), S = N.S(), t = N.tierOf(), m = N.monthly(t), used = S.usedHours || 0, lim = N.LIM.hours[t];
    return `<div class="dash"><section class="dcard hero"><div class="hl"><span class="lbl p">Plan and billing</span><h2>${N.TIERS[t].name} plan</h2><p><b>${N.aed(m.total)}</b> a month including VAT${S.billing === "yearly" ? ", paid yearly" : ""}. ${N.PRICE.minMonths}-month minimum, then month to month.</p></div><div class="hr">${ring(Math.round(Math.max(0, lim - used) / lim * 100), "Change hours left", "#9354FF", "h", Math.max(0, lim - used))}<span class="lbl">${Math.max(0, lim - used)} of ${lim} change hours left</span></div></section>
      <div class="smp"><span class="lbl">Example prices</span><span>Prototype: these prices and terms are examples for NEXA to set. No card is charged.</span></div>
      <section class="dcard"><div class="dh"><h3>This month</h3></div><div class="money" style="max-width:520px"><div><span>${N.TIERS[t].name} plan</span><span>${N.aed(m.plan)}</span></div>${m.ad.map(([l, n]) => `<div><span>+ ${N.esc(l)}</span><span>${N.aed(n)}</span></div>`).join("")}<div><span>VAT 5%</span><span>${N.aed(m.vat)}</span></div><div style="border-top:1px solid var(--line);padding-top:8px"><b>Total</b><b>${N.aed(m.total)}</b></div></div></section>
      <section class="dcard"><div class="dh"><h3>Compare plans</h3></div><div style="overflow-x:auto"><table class="dns"><thead><tr><th></th>${N.TIERS.map((x, k) => `<th style="${k === t ? "color:var(--purple)" : ""}">${x.name}<br><span style="text-transform:none;letter-spacing:0;font-family:var(--display);font-size:12px;color:var(--ink)">${N.aed(N.PRICE.plans[k])} a month</span></th>`).join("")}</tr></thead><tbody>${N.INCL.map(r => `<tr><td>${N.esc(r[0])}</td>${r.slice(1).map((c, k) => `<td style="${k === t ? "font-weight:600" : ""}">${N.esc(c)}</td>`).join("")}</tr>`).join("")}<tr><td></td>${N.TIERS.map((x, k) => `<td>${k === t ? `<span class="mut">Your plan</span>` : `<button class="btn" type="button" data-tier="${k}">${k > t ? "Upgrade" : "Move down"}</button>`}</td>`).join("")}</tr></tbody></table></div></section>
      <section class="dcard"><div class="dh"><h3>Invoices</h3></div>${(S.invoices || []).length ? `<table class="dns"><thead><tr><th>Date</th><th>For</th><th style="text-align:right">Amount</th></tr></thead><tbody>${S.invoices.map(i => `<tr><td>${new Date(i.t).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</td><td>${N.esc(i.what)}</td><td style="text-align:right">${N.aed(i.amt)}</td></tr>`).join("")}</tbody></table>` : `<p class="mut" style="margin:0">Your first invoice appears when you start your plan.</p>`}</section></div>`;
  }

  /* ---------- tooltip ---------- */
  let tip;
  document.addEventListener("mouseover", e => { const h = e.target.closest("[data-tip]"); if (!tip) { tip = document.createElement("div"); tip.className = "vtip"; document.body.appendChild(tip); } if (!h) { tip.style.opacity = 0; return; } tip.innerHTML = h.dataset.tip; tip.style.opacity = 1; });
  document.addEventListener("mousemove", e => { if (!tip || tip.style.opacity === "0") return; const w = tip.offsetWidth; tip.style.left = Math.min(innerWidth - w - 8, e.clientX + 14) + "px"; tip.style.top = (e.clientY - tip.offsetHeight - 12) + "px"; });

  window.NexaDash = { dashboard, reports, billing, reportFile };
})();
