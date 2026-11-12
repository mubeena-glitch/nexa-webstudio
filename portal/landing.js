/* NEXA Web Studio client portal: the welcome (landing) page shown before a client starts.
   Prices and plan details come from window.NexaPortal so they always match the portal. */
(function () {
  "use strict";
  const I = {
    want: '<svg viewBox="0 0 24 24"><path d="M4 7h10M4 12h16M4 17h7"/><circle cx="17" cy="7" r="2"/><circle cx="14" cy="17" r="2"/></svg>',
    pay: '<svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="2.5"/><path d="M3 10h18M7 15h3"/></svg>',
    team: '<svg viewBox="0 0 24 24"><path d="M12 3l2 5.5L19.5 10 14 12l-2 5.5L10 12 4.5 10 10 8.5z"/><path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/></svg>',
    arrow: '<svg viewBox="0 0 24 24"><path d="M7 7l10 10M17 9v8H9"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>'
  };
  const STEPS = [
    ["01", "Tell us what you want", "A short chat: your goals, style, pages and features. Skip anything you're unsure about.", "10 minutes"],
    ["02", "Approve your prompt and sitemap", "We turn your answers into a full design brief and page plan. Edit anything.", "Minutes"],
    ["03", "Pick your concept", "Three to four homepage designs made for you. Choose one or mix the best parts.", "Under an hour"],
    ["04", "We build it", "Designers, developers and AI build every page while you watch the progress here.", "Hours, not weeks"],
    ["05", "Check it on staging", "Click through the real site, ask for changes, then approve.", "Same day"],
    ["06", "Go live", "We connect your domain and launch. Your dashboard and reports start that day.", "Live"]
  ];
  const FAQ = [
    ["How fast is it really?", "A landing page is built in 2 to 4 hours of build time. A ten-page website takes 1 to 2 working days, counted from when we have your content and access. The portal shows the estimate for your exact choices."],
    ["Do I pay before I see anything?", "No. You brief, choose a concept and approve your pages first. You pay the first month only when you submit the project for build."],
    ["What if I change my mind?", "Every plan includes change rounds at each step and change hours every month after launch. You can upgrade at any time."],
    ["Who owns the website?", "Your domain and content are always yours. The design and code pass to you after the first 12 months, or earlier with a buy-out."]
  ];
  function landing() {
    const N = window.NexaPortal, P = N.PRICE, aed = N.aed, esc = N.esc;
    const plans = N.TIERS.map((t, k) => `<article class="lp-plan ${k === 1 ? "pop" : ""}">${k === 1 ? '<span class="lp-badge">Most chosen</span>' : ""}
      <span class="lbl">${t.name}</span><b class="lp-price">${aed(P.plans[k])}<small> a month</small></b><p>${esc(t.desc)}</p>
      <ul>${N.INCL.slice(0, 7).map(r => `<li>${I.check}<span>${esc(r[0])}: <b>${esc(r[k + 1])}</b></span></li>`).join("")}</ul>
      <button class="btn ${k === 1 ? "pri" : ""}" type="button" data-start="1">Start with ${t.name}</button></article>`).join("");
    const addons = Object.entries(P.addons).map(([n, v]) => `<span class="lp-add"><b>${esc(n)}</b><small>+ ${aed(v)}</small></span>`).join("");
    return `<div class="lp">
  <section class="lp-hero">
    <div class="lp-waves" aria-hidden="true"><svg viewBox="0 0 1440 600" preserveAspectRatio="none">${[0, 1, 2, 3, 4, 5].map(i => `<path d="M-40 ${330 + i * 26} C 300 ${170 + i * 40}, 620 ${520 - i * 22}, 980 ${300 + i * 14} S 1400 ${170 + i * 30}, 1500 ${260 + i * 22}" />`).join("")}</svg></div>
    <div class="lp-in">
      <span class="lp-kick">NEXA Web Studio</span>
      <h1>Build your website yourself</h1>
      <p class="lp-sub">You choose what you want. You choose what you pay for. We work behind the scenes, so your site is live in hours, not weeks.</p>
      <div class="lp-cta"><button class="btn pri big" type="button" data-start="1">Start building</button><a class="btn lp-ghost" href="#lp-plans">See the plans</a></div>
      <div class="lp-facts"><div><b>2 to 4 h</b><span>Landing page build</span></div><div><b>1 to 2 days</b><span>Ten-page website</span></div><div><b>${aed(P.plans[0])}</b><span>A month, all in</span></div></div>
    </div>
  </section>

  <section class="lp-sec">
    <span class="lp-kick">Your liberty to choose</span>
    <h2>You're in charge. We do the heavy lifting.</h2>
    <div class="lp-3">
      <article class="lp-card"><i>${I.want}</i><h3>You choose what you want</h3><p>Your style, your pages, your features. 3D, video, motion, languages and integrations are all yours to pick, and you see what each choice means for time and price as you go.</p></article>
      <article class="lp-card"><i>${I.pay}</i><h3>You choose what you pay for</h3><p>One monthly plan for the build, hosting, security and care. Add only the extras you need, drop what you don't. No large bill up front and no hidden costs.</p></article>
      <article class="lp-card"><i>${I.team}</i><h3>We work behind the scenes</h3><p>Our designers, developers and AI tools build your site while you approve each step. Every approval is recorded, so we always build exactly what you signed off.</p></article>
    </div>
  </section>

  <section class="lp-sec">
    <span class="lp-kick">How it works</span>
    <h2>From idea to live, in six steps</h2>
    <ol class="lp-steps">${STEPS.map(s => `<li><span class="lp-n">${s[0]}</span><b>${s[1]}</b><p>${s[2]}</p><small>${s[3]}</small></li>`).join("")}</ol>
  </section>

  <section class="lp-sec lp-split">
    <div><span class="lp-kick">After launch</span><h2>Your site, your numbers, one place</h2>
      <p>Visitors, leads, search rankings, speed and uptime in a live dashboard, with a monthly report you can download. Ask for changes and see your change hours and invoices without sending a single email.</p>
      <button class="btn pri" type="button" data-start="1">Start building</button></div>
    <div class="lp-mock" aria-hidden="true">
      <div class="lp-mk"><span>Visitors</span><b>16,464</b><em>&#9650; 21%</em></div><div class="lp-mk"><span>Leads</span><b>352</b><em>&#9650; 16%</em></div><div class="lp-mk"><span>Speed</span><b>93</b><em>Good</em></div>
      <svg viewBox="0 0 400 120" class="lp-spark"><defs><linearGradient id="lpg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#6E72F2" stop-opacity=".45"/><stop offset="1" stop-color="#6E72F2" stop-opacity="0"/></linearGradient></defs><path d="M0 92 L40 80 L80 86 L120 60 L160 66 L200 44 L240 52 L280 30 L320 38 L360 18 L400 24 L400 120 L0 120Z" fill="url(#lpg)"/><path d="M0 92 L40 80 L80 86 L120 60 L160 66 L200 44 L240 52 L280 30 L320 38 L360 18 L400 24" fill="none" stroke="#8C8FFF" stroke-width="2.5" stroke-linejoin="round"/></svg>
      <span class="lp-smp">Sample figures</span>
    </div>
  </section>

  <section class="lp-sec" id="lp-plans">
    <span class="lp-kick">Plans</span>
    <h2>Pick a plan. Add only what you need.</h2>
    <p class="lp-note">Example prices, before VAT. ${P.minMonths}-month minimum, then month to month. Pay yearly and pay ${P.annualPaysMonths} months for 12.</p>
    <div class="lp-plans">${plans}</div>
    <div class="lp-adds"><span class="lbl">Add-ons, a month</span><div>${addons}</div></div>
  </section>

  <section class="lp-sec">
    <span class="lp-kick">Questions</span>
    <h2>Good to know</h2>
    <div class="lp-faq">${FAQ.map(q => `<details><summary>${q[0]}</summary><p>${q[1]}</p></details>`).join("")}</div>
  </section>

  <section class="lp-end">
    <h2>Ready when you are</h2><p>Ten minutes to brief us. Hours to build. Yours to keep.</p>
    <button class="btn pri big" type="button" data-start="1">Start building</button>
  </section>
</div>`;
  }
  window.NexaLanding = landing;
})();
