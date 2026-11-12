/* NEXA Web Studio client portal: concept engine (prototype).
   Builds homepage concepts from the client's answers. Four design directions, each made of the same
   sections, so a client can mix sections across concepts. In the live studio these come from the AI
   build pipeline; here they are rule-based so the journey can be reviewed end to end. */
(function () {
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const SECTOR = {
    "Real estate": { h: "Homes shaped around the way you live", s: "Residences, communities and investments chosen with care, from first viewing to keys in hand.", svc: ["Residences", "Communities", "Investment advice"], stats: [["1,200+", "homes delivered"], ["18", "communities"], ["96%", "client satisfaction"]], q: "They understood exactly what we were looking for and found it in a week." },
    "Hospitality": { h: "Stay somewhere that stays with you", s: "Rooms, dining and experiences designed for slow mornings and long evenings.", svc: ["Rooms and suites", "Dining", "Experiences"], stats: [["120", "rooms and suites"], ["4", "restaurants"], ["4.8", "guest rating"]], q: "The kind of place you start planning to come back to before you leave." },
    "Healthcare": { h: "Care that starts with listening", s: "Specialist treatment, clear advice and appointments that fit your week.", svc: ["Treatments", "Our specialists", "Book a visit"], stats: [["25", "specialists"], ["40k", "patients a year"], ["15 min", "average wait"]], q: "Every question answered, and I never felt rushed." },
    "Education": { h: "Where curious minds go further", s: "Programmes, people and a campus built around how students really learn.", svc: ["Programmes", "Admissions", "Campus life"], stats: [["60+", "programmes"], ["9:1", "student to staff"], ["94%", "graduate outcomes"]], q: "I found my subject here, and the people who pushed me in it." },
    "Finance": { h: "Money matters, made clear", s: "Accounts, lending and advice for people and businesses that plan ahead.", svc: ["Personal", "Business", "Wealth"], stats: [["AED 4bn", "assets managed"], ["150k", "customers"], ["24/7", "support"]], q: "Straight answers and a team that actually picks up the phone." },
    "Technology": { h: "Software that gets out of your way", s: "One platform to run the work, see the numbers and move faster.", svc: ["Platform", "Integrations", "Security"], stats: [["2,000+", "teams"], ["99.99%", "uptime"], ["40%", "time saved"]], q: "We switched in a weekend and never looked back." },
    "Retail": { h: "Pieces made to be lived in", s: "New collections, timeless staples and delivery to your door.", svc: ["New in", "Collections", "Gifts"], stats: [["300+", "products"], ["2 days", "UAE delivery"], ["30 days", "easy returns"]], q: "Beautifully made, and it arrived the next day." },
    "Food and drink": { h: "Good food, close to home", s: "Seasonal menus, warm rooms and a table waiting for you.", svc: ["Menu", "Locations", "Order online"], stats: [["6", "locations"], ["Daily", "fresh menus"], ["4.7", "average rating"]], q: "Our go-to for every family celebration." },
    "Professional services": { h: "Advice that moves the business", s: "Specialist teams for the decisions that matter most.", svc: ["Advisory", "Industries", "Case studies"], stats: [["25 yrs", "experience"], ["300+", "clients"], ["12", "markets"]], q: "Sharp, practical and always one step ahead of us." },
    "Government": { h: "Services built around people", s: "Find what you need, apply online and follow every step.", svc: ["Services", "Initiatives", "News"], stats: [["200+", "online services"], ["1M", "users a year"], ["24/7", "access"]], q: "It took minutes online, not days in a queue." },
    "Other": { h: "Built for what comes next", s: "Everything you need to know, in one clear place.", svc: ["What we do", "How we work", "Our work"], stats: [["10+", "years"], ["500+", "projects"], ["98%", "would recommend"]], q: "A team that delivers what they promise." }
  };

  const STYLE = {
    "Minimal": { pal: ["#111111", "#2F6BFF", "#FFFFFF", "#F4F5F7"], head: "Inter", body: "Inter", serif: "Fraunces" },
    "Luxury": { pal: ["#14110D", "#B89A5E", "#FBF8F2", "#EFE8DA"], head: "Cormorant Garamond", body: "Jost", serif: "Cormorant Garamond" },
    "Simple": { pal: ["#1A2433", "#1E5EFF", "#FFFFFF", "#F2F5FA"], head: "DM Sans", body: "DM Sans", serif: "DM Serif Display" },
    "Retro": { pal: ["#2B1B12", "#E85D3A", "#FBF1E1", "#F3DEC0"], head: "DM Serif Display", body: "Work Sans", serif: "DM Serif Display" },
    "Artistic": { pal: ["#1D1030", "#FF6F59", "#FFFBF6", "#EDE4FF"], head: "Syne", body: "Inter", serif: "Fraunces" },
    "Editorial": { pal: ["#1B1B1B", "#B4532A", "#FAF8F4", "#ECE7DF"], head: "Playfair Display", body: "Source Sans 3", serif: "Playfair Display" },
    "Bold": { pal: ["#0E0E10", "#FF4D2E", "#FFFFFF", "#F1F1F1"], head: "Space Grotesk", body: "Inter", serif: "Space Grotesk" }
  };

  const DIRECTIONS = [
    { id: "A", name: "Clean grid", note: "Calm, structured, lots of white space. Content leads." },
    { id: "B", name: "Editorial", note: "Magazine feel: big type, asymmetric layouts, image led." },
    { id: "C", name: "Immersive", note: "Dark, cinematic hero with motion and depth." },
    { id: "D", name: "Bold blocks", note: "Confident colour blocks and a bento grid of highlights." }
  ];
  const SECTIONS = [["nav", "Navigation"], ["hero", "Hero"], ["about", "Introduction"], ["services", "Services"], ["stats", "Numbers"], ["showcase", "Showcase"], ["quote", "Testimonial"], ["cta", "Call to action"], ["footer", "Footer"]];

  function ctx(a) {
    const st = STYLE[a.style] || STYLE.Simple;
    const sec = SECTOR[a.sector] || SECTOR.Other;
    let pal = st.pal.slice();
    if (a.brandMode === "manual" && a.colours && a.colours.length) {
      pal[1] = a.colours[0] || pal[1]; pal[0] = a.colours[1] || pal[0]; if (a.colours[2]) pal[3] = a.colours[2];
    }
    const head = (a.brandMode === "manual" && a.fontHead) || st.head, body = (a.brandMode === "manual" && a.fontBody) || st.body;
    const pages = (a.sitemap || []).filter(p => p.name !== "Home").map(p => p.name).slice(0, 5);
    const name = a.company || "Your brand";
    return { a, sec, pal, head, body, serif: st.serif, name, pages: pages.length ? pages : ["About", "Services", "Contact"], ai: (a.experience || []).includes("AI-generated images"), motion: a.motion || "Balanced", cta: ctaFor(a) };
  }
  function ctaFor(a) {
    const g = (a.goals || [])[0] || "";
    return { "Generate leads": "Talk to us", "Sell online": "Shop now", "Bookings": "Book now", "Recruit": "See open roles", "Launch a product": "Get early access", "Inform and educate": "Find out more", "Build the brand": "Discover more" }[g] || "Get in touch";
  }
  const img = (c, tone, label, h, r) => `<div class="im" style="height:${h};border-radius:${r || 0}px;background:${tone}"><span>${c.ai ? "AI image" : "Your photo"}${label ? ": " + esc(label) : ""}</span></div>`;
  const grad = (c, i) => [`linear-gradient(135deg,${c.pal[1]}33,${c.pal[3]} 60%,${c.pal[1]}55)`, `radial-gradient(circle at 30% 30%,${c.pal[1]}88,${c.pal[0]} 75%)`, `linear-gradient(160deg,${c.pal[3]},${c.pal[1]}44)`, `linear-gradient(200deg,${c.pal[0]}dd,${c.pal[1]}99)`][i % 4];

  const R = {
    nav: {
      A: c => `<nav class="nv"><b>${esc(c.name)}</b><span>${c.pages.slice(0, 4).map(p => `<i>${esc(p)}</i>`).join("")}</span><a class="bt">${esc(c.cta)}</a></nav>`,
      B: c => `<nav class="nv nb"><span>${c.pages.slice(0, 2).map(p => `<i>${esc(p)}</i>`).join("")}</span><b class="sf">${esc(c.name)}</b><span>${c.pages.slice(2, 4).map(p => `<i>${esc(p)}</i>`).join("")}<a class="ln">${esc(c.cta)}</a></span></nav>`,
      C: c => `<nav class="nv nd"><b>${esc(c.name)}</b><span>${c.pages.slice(0, 4).map(p => `<i>${esc(p)}</i>`).join("")}</span><a class="bt gh">${esc(c.cta)}</a></nav>`,
      D: c => `<nav class="nv"><b class="blk">${esc(c.name)}</b><span>${c.pages.slice(0, 3).map(p => `<i>${esc(p)}</i>`).join("")}</span><a class="bt sq">${esc(c.cta)}</a></nav>`
    },
    hero: {
      A: c => `<section class="hA"><div><p class="ey">${esc(c.a.sector || "Welcome")}</p><h1>${esc(c.sec.h)}</h1><p class="ld">${esc(c.sec.s)}</p><a class="bt">${esc(c.cta)}</a> <a class="ln">Learn more</a></div>${img(c, grad(c, 0), "hero", "340px", 18)}</section>`,
      B: c => `<section class="hB"><h1 class="sf">${esc(c.sec.h)}</h1><div class="hBg">${img(c, grad(c, 2), "feature", "380px", 0)}<div><p class="ld">${esc(c.sec.s)}</p><a class="ln">${esc(c.cta)} &rarr;</a></div></div></section>`,
      C: c => `<section class="hC" style="background:${c.pal[0]}"><div class="orb" style="background:radial-gradient(circle,${c.pal[1]},transparent 65%)"></div><div class="in"><p class="ey">${esc(c.name)}</p><h1>${esc(c.sec.h)}</h1><p class="ld">${esc(c.sec.s)}</p><a class="bt">${esc(c.cta)}</a></div>${c.a.experience && c.a.experience.includes("AI-generated video") ? `<span class="vid">Background film</span>` : ""}</section>`,
      D: c => `<section class="hD"><div class="t" style="background:${c.pal[1]}"><h1>${esc(c.sec.h)}</h1><a class="bt sq inv">${esc(c.cta)}</a></div><div class="b1">${img(c, grad(c, 1), "", "100%", 22)}</div><div class="b2" style="background:${c.pal[3]}"><p class="ld">${esc(c.sec.s)}</p></div></section>`
    },
    about: {
      A: c => `<section class="aA"><p class="ey">About ${esc(c.name)}</p><p class="big">${esc(c.sec.s)} We bring the right people, a clear process and real care to every detail.</p></section>`,
      B: c => `<section class="aB">${img(c, grad(c, 3), "story", "300px", 0)}<div><p class="ey">Our story</p><h2 class="sf">Made with intent</h2><p>${esc(c.sec.s)} Every decision starts with the people we serve.</p></div></section>`,
      C: c => `<section class="aC" style="background:${c.pal[0]}"><h2>${esc(c.name)} in one line</h2><p>${esc(c.sec.s)}</p></section>`,
      D: c => `<section class="aD"><div style="background:${c.pal[3]}"><h2>Who we are</h2><p>${esc(c.sec.s)}</p></div><div style="background:${c.pal[0]};color:#fff"><h2>Why it matters</h2><p>Clear choices, honest advice and a team that follows through.</p></div></section>`
    },
    services: {
      A: c => `<section class="sA"><h2>What we do</h2><div class="g3">${c.sec.svc.map((s, i) => `<div class="cd">${img(c, grad(c, i), "", "150px", 12)}<h3>${esc(s)}</h3><p>Find out how we can help with ${esc(s.toLowerCase())}.</p><a class="ln">Explore</a></div>`).join("")}</div></section>`,
      B: c => `<section class="sB">${c.sec.svc.map((s, i) => `<div class="row"><span class="n">0${i + 1}</span><h3 class="sf">${esc(s)}</h3><p>Find out how we can help with ${esc(s.toLowerCase())}.</p><a class="ln">&rarr;</a></div>`).join("")}</section>`,
      C: c => `<section class="sC" style="background:${c.pal[0]}"><div class="g3">${c.sec.svc.map((s, i) => `<div class="gl"><h3>${esc(s)}</h3><p>Find out how we can help with ${esc(s.toLowerCase())}.</p></div>`).join("")}</div></section>`,
      D: c => `<section class="sD"><div class="bento">${c.sec.svc.map((s, i) => `<div class="bx b${i}" style="background:${[c.pal[1], c.pal[3], c.pal[0]][i]};color:${i === 1 ? c.pal[0] : "#fff"}"><h3>${esc(s)}</h3><a class="ln">Explore &rarr;</a></div>`).join("")}<div class="bx b3">${img(c, grad(c, 2), "", "100%", 20)}</div></div></section>`
    },
    stats: {
      A: c => `<section class="tA">${c.sec.stats.map(s => `<div><b>${esc(s[0])}</b><span>${esc(s[1])}</span></div>`).join("")}</section>`,
      B: c => `<section class="tB">${c.sec.stats.map(s => `<div><b class="sf">${esc(s[0])}</b><span>${esc(s[1])}</span></div>`).join("")}</section>`,
      C: c => `<section class="tC" style="background:${c.pal[0]}">${c.sec.stats.map(s => `<div><b style="color:${c.pal[1]}">${esc(s[0])}</b><span>${esc(s[1])}</span></div>`).join("")}</section>`,
      D: c => `<section class="tD">${c.sec.stats.map((s, i) => `<div style="background:${i === 1 ? c.pal[1] : c.pal[3]};color:${i === 1 ? "#fff" : c.pal[0]}"><b>${esc(s[0])}</b><span>${esc(s[1])}</span></div>`).join("")}</section>`
    },
    showcase: {
      A: c => `<section class="wA"><h2>Recent work</h2><div class="g2">${[0, 1].map(i => `<div>${img(c, grad(c, i + 1), "", "220px", 12)}<h3>Project ${i + 1}</h3></div>`).join("")}</div></section>`,
      B: c => `<section class="wB">${img(c, grad(c, 0), "full bleed", "360px", 0)}<p class="cap sf">A closer look</p></section>`,
      C: c => `<section class="wC" style="background:${c.pal[0]}"><div class="track">${[0, 1, 2, 3].map(i => img(c, grad(c, i), "", "200px", 14)).join("")}</div><p>Scroll to explore</p></section>`,
      D: c => `<section class="wD"><div class="g4">${[0, 1, 2, 3].map(i => img(c, grad(c, i), "", "160px", 18)).join("")}</div></section>`
    },
    quote: {
      A: c => `<section class="qA"><p>&ldquo;${esc(c.sec.q)}&rdquo;</p><span>Client name, role</span></section>`,
      B: c => `<section class="qB"><p class="sf">&ldquo;${esc(c.sec.q)}&rdquo;</p><span>Client name</span></section>`,
      C: c => `<section class="qC" style="background:${c.pal[0]}"><p>&ldquo;${esc(c.sec.q)}&rdquo;</p><span>Client name</span></section>`,
      D: c => `<section class="qD" style="background:${c.pal[3]}"><p>&ldquo;${esc(c.sec.q)}&rdquo;</p><span>Client name</span></section>`
    },
    cta: {
      A: c => `<section class="cA"><h2>Ready when you are</h2><a class="bt">${esc(c.cta)}</a></section>`,
      B: c => `<section class="cB"><h2 class="sf">Let's talk</h2><a class="ln">${esc(c.cta)} &rarr;</a></section>`,
      C: c => `<section class="cC" style="background:linear-gradient(120deg,${c.pal[0]},${c.pal[1]})"><h2>Start your story</h2><a class="bt inv">${esc(c.cta)}</a></section>`,
      D: c => `<section class="cD" style="background:${c.pal[1]}"><h2>Let's make it happen</h2><a class="bt sq inv">${esc(c.cta)}</a></section>`
    },
    footer: {
      A: c => `<footer class="fA"><b>${esc(c.name)}</b><span>${c.pages.map(esc).join(" &middot; ")}</span><small>&copy; ${new Date().getFullYear()} ${esc(c.name)}</small></footer>`,
      B: c => `<footer class="fB"><b class="sf">${esc(c.name)}</b><small>&copy; ${new Date().getFullYear()}</small></footer>`,
      C: c => `<footer class="fC" style="background:${c.pal[0]}"><b>${esc(c.name)}</b><span>${c.pages.map(esc).join(" &middot; ")}</span></footer>`,
      D: c => `<footer class="fD" style="background:${c.pal[0]}"><b>${esc(c.name)}</b><span>${c.pages.map(esc).join(" &middot; ")}</span></footer>`
    }
  };

  function css(c) {
    const [ink, acc, bg, soft] = c.pal, mo = c.motion === "Expressive" ? 1 : c.motion === "Subtle" ? .35 : .6;
    return `*{box-sizing:border-box;margin:0}body{font-family:'${c.body}',system-ui,sans-serif;color:${ink};background:${bg};font-size:15px;line-height:1.6}
h1,h2,h3,.nv b{font-family:'${c.head}',system-ui,sans-serif;line-height:1.1;letter-spacing:-.01em}.sf{font-family:'${c.serif}',Georgia,serif!important}
h1{font-size:52px}h2{font-size:34px;margin-bottom:22px}h3{font-size:19px;margin:12px 0 6px}section{padding:72px 64px;position:relative;overflow:hidden}
.ey{font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:${acc};margin-bottom:14px;font-weight:600}.ld{font-size:18px;opacity:.8;margin:18px 0 26px;max-width:520px}
.bt{display:inline-block;background:${acc};color:#fff;padding:13px 24px;border-radius:999px;font-weight:600;font-size:14px}.bt.sq{border-radius:6px}.bt.inv{background:#fff;color:${ink}}.bt.gh{background:transparent;border:1px solid #ffffff66}
.ln{color:${acc};font-weight:600;font-size:14px;margin-left:14px}.im{position:relative;width:100%}.im span{position:absolute;left:12px;bottom:10px;font-size:11px;background:#ffffffcc;color:#333;padding:2px 8px;border-radius:99px}
.nv{display:flex;align-items:center;justify-content:space-between;padding:22px 64px;gap:20px}.nv span{display:flex;gap:26px;font-size:14px;align-items:center}.nv i{font-style:normal;opacity:.75}.nv b{font-size:20px}
.nb{border-bottom:1px solid ${ink}22}.nb b{font-size:26px}.nd{background:${ink};color:#fff;position:absolute;top:0;left:0;right:0;z-index:5;background:transparent}.blk{background:${ink};color:#fff;padding:6px 12px;border-radius:6px}
.hA{display:grid;grid-template-columns:1.1fr 1fr;gap:48px;align-items:center}.hB h1{font-size:76px;max-width:900px;margin-bottom:34px}.hBg{display:grid;grid-template-columns:1.6fr 1fr;gap:40px;align-items:end}
.hC{min-height:560px;color:#fff;display:flex;align-items:center;padding-top:120px}.hC .in{position:relative;z-index:2;max-width:640px}.hC h1{font-size:64px}.orb{position:absolute;width:640px;height:640px;right:-120px;top:-80px;filter:blur(30px);opacity:.75;animation:fl ${8 / mo}s ease-in-out infinite}
@keyframes fl{50%{transform:translate(-40px,30px) scale(1.08)}}.vid{position:absolute;right:24px;bottom:20px;font-size:11px;border:1px solid #ffffff55;color:#fff;padding:3px 10px;border-radius:99px}
.hD{display:grid;grid-template-columns:1.3fr 1fr;grid-template-rows:260px 200px;gap:16px;padding:24px 64px}.hD .t{grid-row:1/3;border-radius:22px;padding:44px;color:#fff;display:flex;flex-direction:column;justify-content:space-between}.hD .b2{border-radius:22px;padding:26px}.hD .b2 .ld{margin:0;font-size:16px}
.aA .big{font-size:30px;line-height:1.4;max-width:900px;font-family:'${c.head}'}.aB{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center}.aC{color:#fff;text-align:center}.aC p{opacity:.75;max-width:620px;margin:0 auto;font-size:18px}
.aD{display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:24px 64px}.aD>div{border-radius:22px;padding:40px}
.g3{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}.cd p{opacity:.75;font-size:14px}.cd .ln{margin:0}
.sB .row{display:grid;grid-template-columns:70px 1fr 1.4fr 40px;gap:20px;align-items:center;padding:26px 0;border-top:1px solid ${ink}22}.sB .n{opacity:.5}.sB h3{font-size:30px;margin:0}
.sC{color:#fff}.gl{border:1px solid #ffffff22;background:#ffffff0d;border-radius:18px;padding:30px;backdrop-filter:blur(8px)}.gl p{opacity:.7;font-size:14px}
.bento{display:grid;grid-template-columns:1.2fr 1fr 1fr;grid-template-rows:200px 200px;gap:16px}.bx{border-radius:22px;padding:28px;display:flex;flex-direction:column;justify-content:space-between}.b0{grid-row:1/3}.b3{grid-column:2/4;padding:0}.bx .ln{margin:0;color:inherit}
.tA,.tB,.tC,.tD{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;text-align:center}.tA b,.tC b,.tD b{display:block;font-size:44px;font-family:'${c.head}'}.tB b{font-size:56px;display:block}.tA span,.tB span,.tC span,.tD span{opacity:.7;font-size:14px}.tA{border-top:1px solid ${ink}1a;border-bottom:1px solid ${ink}1a}.tC{color:#fff}.tD{padding:24px 64px}.tD>div{border-radius:22px;padding:34px}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:24px}.wB{padding:0}.wB .cap{padding:18px 64px;font-size:22px}.wC{color:#fff}.track{display:grid;grid-template-columns:repeat(4,300px);gap:18px}.wC p{opacity:.6;margin-top:16px;font-size:13px}.g4{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}.wD{padding:24px 64px}
.qA,.qB,.qC,.qD{text-align:center}.qA p{font-size:26px;max-width:760px;margin:0 auto 14px;font-family:'${c.head}'}.qB p{font-size:40px;max-width:900px;margin:0 auto 14px;line-height:1.25}.qC{color:#fff}.qC p{font-size:28px;max-width:760px;margin:0 auto 14px}.qD{margin:24px 64px;border-radius:22px}.qD p{font-size:26px;max-width:760px;margin:0 auto 14px}
.qA span,.qB span,.qC span,.qD span{opacity:.6;font-size:13px}
.cA{text-align:center;background:${soft}}.cB{display:flex;justify-content:space-between;align-items:center;border-top:1px solid ${ink}22}.cB h2{font-size:60px;margin:0}.cC{text-align:center;color:#fff}.cD{color:#fff;margin:24px 64px;border-radius:22px;display:flex;justify-content:space-between;align-items:center}.cD h2{margin:0}
footer{padding:36px 64px;display:flex;gap:24px;justify-content:space-between;align-items:center;font-size:13px;flex-wrap:wrap}.fA{border-top:1px solid ${ink}1a}.fA span{opacity:.7}.fB b{font-size:28px}.fC,.fD{color:#ffffffcc}
@media (max-width:760px){section,.nv,footer{padding-left:22px;padding-right:22px}.hA,.hBg,.aB,.aD,.g3,.g2,.hD,.bento,.tA,.tB,.tC,.tD,.g4{grid-template-columns:1fr}.hD,.bento{grid-template-rows:auto}.hD .t,.b0{grid-row:auto}.b3{grid-column:auto;height:200px}.nv span{display:none}h1,.hB h1,.hC h1{font-size:38px}.sB .row{grid-template-columns:40px 1fr}.sB .row p,.sB .row .ln{grid-column:2}.track{grid-template-columns:repeat(4,220px)}}`;
  }
  function fontsLink(c) {
    const fams = [...new Set([c.head, c.body, c.serif])].map(f => "family=" + f.replace(/ /g, "+") + ":wght@400;500;600;700").join("&");
    return `<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?${fams}&display=swap" rel="stylesheet">`;
  }
  /* pick: {sectionKey: "A".."D"} */
  function page(a, pick, extraBody) {
    const c = ctx(a);
    const body = extraBody != null ? extraBody(c) : SECTIONS.map(([k]) => R[k][pick[k] || "A"](c)).join("");
    return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${fontsLink(c)}<style>${css(c)}</style></head><body>${body}</body></html>`;
  }
  const allOf = id => Object.fromEntries(SECTIONS.map(([k]) => [k, id]));

  /* Inner pages: wireframe blocks rendered in the chosen concept's look */
  const BLOCK_TO = { "Page header": "hero", "Introduction": "about", "Story": "about", "Feature grid": "services", "Services list": "services", "Numbers": "stats", "Gallery": "showcase", "Testimonial": "quote", "Call to action": "cta" };
  function inner(a, pick, pageName, blocks) {
    return page(a, pick, c => {
      const head = R.nav[pick.nav || "A"](c) + `<section class="aA"><p class="ey">${esc(c.name)}</p><h1>${esc(pageName)}</h1></section>`;
      const mid = blocks.filter(b => b !== "Page header").map(b => {
        const k = BLOCK_TO[b];
        if (k) return R[k][pick[k] || "A"](c);
        if (b === "Contact form") return `<section class="aB"><div><h2>Send us a message</h2><p>Name, email, phone and message, with your chosen form fields.</p></div><div style="background:${c.pal[3]};border-radius:18px;height:260px"></div></section>`;
        if (b === "Map") return `<section style="padding:0">${img(c, grad(c, 2), "map", "260px", 0)}</section>`;
        if (b === "FAQ") return `<section class="sB">${["How do I get started?", "How long does it take?", "Who do I talk to?"].map((q, i) => `<div class="row"><span class="n">0${i + 1}</span><h3 style="font-size:20px">${q}</h3><p>A short, clear answer.</p><a class="ln">+</a></div>`).join("")}</section>`;
        if (b === "Team") return `<section class="sA"><h2>The team</h2><div class="g3">${[0, 1, 2].map(i => `<div>${img(c, grad(c, i), "", "200px", 14)}<h3>Name</h3><p style="opacity:.7">Role</p></div>`).join("")}</div></section>`;
        if (b === "Post grid") return `<section class="sA"><h2>Latest</h2><div class="g3">${[0, 1, 2].map(i => `<div class="cd">${img(c, grad(c, i), "", "150px", 12)}<h3>Article title</h3><p>Short summary of the article.</p></div>`).join("")}</div></section>`;
        if (b === "Product grid") return `<section class="sA"><h2>Shop</h2><div class="g3">${[0, 1, 2].map(i => `<div class="cd">${img(c, grad(c, i), "", "200px", 12)}<h3>Product name</h3><p>Price</p></div>`).join("")}</div></section>`;
        if (b === "Text") return `<section class="aA"><p class="big" style="font-size:18px">Page text goes here, laid out for easy reading.</p></section>`;
        if (b === "Booking widget") return `<section class="cA"><h2>Check availability</h2><div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap"><span class="bt sq" style="background:${c.pal[3]};color:${c.pal[0]}">Dates</span><span class="bt sq" style="background:${c.pal[3]};color:${c.pal[0]}">Guests</span><a class="bt">${esc(c.cta)}</a></div></section>`;
        return `<section class="aA"><h2>${esc(b)}</h2></section>`;
      }).join("");
      return head + mid + R.footer[pick.footer || "A"](c);
    });
  }

  window.NexaConcepts = { DIRECTIONS, SECTIONS, page, allOf, inner, STYLE, SECTOR };
})();
