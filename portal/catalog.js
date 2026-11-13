/* NEXA Web Studio client portal: the catalogue. Everything a client can choose, and the EXAMPLE commercial model.
   Prices are examples for NEXA leadership to set. All amounts AED, excluding 5% VAT. */
(function () {
  "use strict";

  /* What we build. line: lp (landing and campaign), site (websites), platform (portals, platforms, apps).
     pages: default page count. h: extra build hours on top of pages. pts: weight in the plan score. */
  const TYPES = [
    { v: "Landing page", g: "Landing pages and campaigns", d: "One page built to convert: a campaign, offer or lead form.", line: "lp", pages: 1, h: 0, pts: 0 },
    { v: "Microsite", label: "Campaign microsite", g: "Landing pages and campaigns", d: "A few pages for a launch, event or campaign.", line: "lp", pages: 4, h: 0, pts: 0 },
    { v: "Website", label: "Business website", g: "Websites", d: "Who you are, what you do and how to reach you.", line: "site", pages: 8, h: 0, pts: 0 },
    { v: "Online store", g: "Websites", d: "Products, basket, checkout and delivery.", line: "site", pages: 12, h: 6, pts: 2 },
    { v: "Booking website", g: "Websites", d: "Hotels, clinics, restaurants or tours: book online.", line: "site", pages: 8, h: 4, pts: 1.5 },
    { v: "Event website", g: "Websites", d: "Programme, speakers, tickets or registration, venue.", line: "site", pages: 6, h: 3, pts: 1 },
    { v: "Portfolio or showcase", g: "Websites", d: "Projects, properties or collections, beautifully shown.", line: "site", pages: 8, h: 2, pts: .5 },
    { v: "Data dashboard platform", g: "Platforms and portals", d: "Live dashboards, indicators and reports for leadership or the public, with a content workspace behind it.", line: "platform", pages: 12, h: 80, pts: 8 },
    { v: "Client or partner portal", g: "Platforms and portals", d: "Brokers, agents or clients log in to see deals, documents and status.", line: "platform", pages: 10, h: 40, pts: 6 },
    { v: "Members portal", g: "Platforms and portals", d: "Logins, member-only content, events and renewals.", line: "platform", pages: 10, h: 24, pts: 5 },
    { v: "Listings and directory", g: "Platforms and portals", d: "Properties, cars, jobs or businesses with search, filters and alerts.", line: "platform", pages: 10, h: 30, pts: 5 },
    { v: "Learning platform", g: "Platforms and portals", d: "Courses, lessons, quizzes and certificates.", line: "platform", pages: 10, h: 40, pts: 6 },
    { v: "Intranet and knowledge hub", g: "Platforms and portals", d: "News, people, documents and search for your own team.", line: "platform", pages: 12, h: 30, pts: 5 },
    { v: "Web app", g: "Platforms and portals", d: "A custom tool or product your customers use in the browser.", line: "platform", pages: 8, h: 80, pts: 8 }
  ];
  const TYPE = Object.fromEntries(TYPES.map(t => [t.v, t]));
  const lineOf = type => (TYPE[type] || TYPE.Website).line;

  const GOALS = ["Generate leads", "Sell online", "Bookings", "Sell tickets or registrations", "Build the brand", "Showcase our work", "Inform and educate", "Share data and insights", "Serve customers online", "Train people", "Connect our team", "Recruit", "Launch a product"];

  /* Look and feel. pal: [ink, accent, light background, soft surface] used by the concept engine. */
  const STYLES = [
    { v: "Minimal", d: "Calm, precise, lots of white space.", pal: ["#111111", "#2F6BFF", "#FFFFFF", "#F4F5F7"], head: "Inter", body: "Inter", serif: "Fraunces" },
    { v: "Luxury", d: "Unhurried and exclusive: rich tones, elegant serif type.", pal: ["#14110D", "#B89A5E", "#FBF8F2", "#EFE8DA"], head: "Cormorant Garamond", body: "Jost", serif: "Cormorant Garamond" },
    { v: "Simple", label: "Friendly and simple", d: "Warm, clear and easy for everyone.", pal: ["#1A2433", "#1E5EFF", "#FFFFFF", "#F2F5FA"], head: "DM Sans", body: "DM Sans", serif: "DM Serif Display" },
    { v: "Editorial", d: "Magazine feel: big type, story first.", pal: ["#1B1B1B", "#B4532A", "#FAF8F4", "#ECE7DF"], head: "Playfair Display", body: "Source Sans 3", serif: "Playfair Display" },
    { v: "Bold", d: "Big type, strong colour, impossible to ignore.", pal: ["#0E0E10", "#FF4D2E", "#FFFFFF", "#F1F1F1"], head: "Space Grotesk", body: "Inter", serif: "Space Grotesk" },
    { v: "Dark and cinematic", d: "Moody, full-screen imagery and slow reveals.", pal: ["#101014", "#C9A45C", "#F6F3EE", "#E9E2D6"], head: "Bodoni Moda", body: "Inter Tight", serif: "Bodoni Moda" },
    { v: "Futuristic", d: "Tech-forward: sharp lines, glow and precision.", pal: ["#0A0F1F", "#18B4E0", "#F5F8FF", "#E3ECFF"], head: "Sora", body: "Manrope", serif: "Sora" },
    { v: "Corporate and trustworthy", d: "Confident, structured, reassuring.", pal: ["#0F2340", "#1F6FD1", "#FFFFFF", "#EEF3F9"], head: "IBM Plex Sans", body: "IBM Plex Sans", serif: "IBM Plex Serif" },
    { v: "Organic and natural", d: "Earthy colour, texture and soft shapes.", pal: ["#24301F", "#6E8547", "#FAF7F0", "#ECE6D6"], head: "Fraunces", body: "Nunito Sans", serif: "Fraunces" },
    { v: "Heritage and Arabic-inspired", d: "Regional craft, pattern and calligraphic detail.", pal: ["#2B1E14", "#A6772E", "#FBF6EC", "#F0E4CC"], head: "Marcellus", body: "Tajawal", serif: "Marcellus" },
    { v: "Playful", d: "Colourful, rounded and full of personality.", pal: ["#2A1A4A", "#F0603C", "#FFF9F2", "#FFE9D6"], head: "Fredoka", body: "Nunito", serif: "Fredoka" },
    { v: "Swiss and structured", d: "Grid-led, typographic, nothing wasted.", pal: ["#111111", "#E3262E", "#FFFFFF", "#F2F2F2"], head: "Archivo", body: "Archivo", serif: "Archivo" },
    { v: "Retro", d: "Nostalgic type, warm vintage colour.", pal: ["#2B1B12", "#E85D3A", "#FBF1E1", "#F3DEC0"], head: "DM Serif Display", body: "Work Sans", serif: "DM Serif Display" },
    { v: "Artistic", d: "Expressive, surprising, one of a kind.", pal: ["#1D1030", "#FF6F59", "#FFFBF6", "#EDE4FF"], head: "Syne", body: "Inter", serif: "Fraunces" },
    { v: "Glass and gradient", d: "Soft gradients, depth and translucent layers.", pal: ["#0E1030", "#6B55F0", "#F7F7FF", "#E9E6FF"], head: "Outfit", body: "Outfit", serif: "Outfit" },
    { v: "Brutalist", d: "Raw, honest and deliberately unpolished.", pal: ["#000000", "#1F3BFF", "#FFFFFF", "#EDEDED"], head: "Space Mono", body: "Space Grotesk", serif: "Space Mono" }
  ];
  /* Theme library families that suit each style, for the gallery's first filter. */
  const STYLE_FAMILY = { "Minimal": "minimal", "Luxury": "luxury", "Simple": "minimal", "Editorial": "luxury", "Bold": "bold", "Dark and cinematic": "luxury", "Futuristic": "modern", "Corporate and trustworthy": "corporate", "Organic and natural": "minimal", "Heritage and Arabic-inspired": "luxury", "Playful": "vibrant", "Swiss and structured": "minimal", "Retro": "vibrant", "Artistic": "vibrant", "Glass and gradient": "modern", "Brutalist": "bold" };

  /* Experiences: h build hours, pts plan weight, big: counts towards the immersive limit of a plan. */
  const EXPERIENCE = [
    ["AI-generated images", "Original imagery made for your brand, no stock look.", 1, 1],
    ["AI-generated video", "Short films for hero sections and stories.", 3, 2, 1],
    ["3D elements", "Interactive 3D objects or scenes.", 6, 3, 1],
    ["Immersive scroll storytelling", "The page unfolds as you scroll.", 6, 3, 1],
    ["Interactive maps", "Explore locations, projects or branches on a live map.", 2, 1],
    ["Virtual tours and 360 views", "Walk through a property, venue or showroom.", 3, 1.5],
    ["Calculators and configurators", "Mortgage, price, savings or product builders.", 3, 1.5],
    ["Live data and counters", "Numbers, countdowns and feeds that update on their own.", 2, 1],
    ["Personalisation", "Content that changes by visitor, country or language.", 4, 2],
    ["AR product preview", "See a product in your own space, on your phone.", 6, 3, 1],
    ["Gamified moments", "Quizzes, challenges and rewards that keep people engaged.", 3, 1],
    ["Video backgrounds", "Looping footage behind key sections.", 1, .5],
    ["Page transitions", "Smooth movement between pages.", 1, 1],
    ["Micro-animations", "Small touches on buttons and cards.", .5, .5],
    ["Dark and light mode", "Visitors switch to the look they prefer.", 1.5, .5]
  ];
  const MOTION = [["Still", "Almost no movement. Fast and calm."], ["Subtle", "Gentle fades and slides."], ["Balanced", "Reveals on scroll and one signature moment."], ["Expressive", "Rich, choreographed motion."], ["Cinematic", "Film-like sequences and scroll-driven scenes."]];
  const MOTION_H = { Expressive: 2, Cinematic: 4 };

  /* Platform questions (only for platforms and portals). */
  const USERS = ["Public visitors (no login)", "Customers or members", "Partners, brokers or agents", "Staff and editors", "Administrators", "Leadership and executives"];
  const PFEATURES = [
    ["Logins and user roles", "Each person sees and does only what their role allows.", 8, 1],
    ["Single sign-on", "UAE Pass, Microsoft or Google sign-in.", 8, 1],
    ["Interactive charts and maps", "Dashboards people can filter, compare and explore.", 16, 2],
    ["Data uploads", "Your team uploads Excel or CSV files and the platform updates.", 8, 1],
    ["Connections to other systems", "Live data from your CRM, ERP or other APIs.", 16, 2],
    ["Content workspace with approvals", "Editors draft, reviewers approve, then it publishes.", 16, 2],
    ["Search and filters", "Find anything fast across all content and data.", 6, 1],
    ["Notifications", "Email, SMS or WhatsApp alerts when something changes.", 6, 1],
    ["Payments and subscriptions", "Take payments, renewals and invoices online.", 12, 1.5],
    ["Document library", "Secure files with versions and permissions.", 6, 1],
    ["Reports export", "Download any view as PDF or Excel.", 8, 1],
    ["Audit log", "A record of who changed what, and when.", 6, 1],
    ["AI assistant over your data", "Ask questions in plain language and get answers from your own data.", 16, 2],
    ["Arabic and English throughout", "Every screen in both languages, right to left in Arabic.", 10, 1.5],
    ["Installable mobile app (PWA)", "Add to the home screen, works offline for key screens.", 16, 2]
  ];
  const DATA_SRC = ["Excel or CSV uploads", "An existing database", "APIs from other systems", "A CRM such as HubSpot or Salesforce", "Typed in by our team in a CMS", "Not sure yet"];
  const RESIDENCY = ["UAE data residency required", "Any secure cloud is fine", "Our own servers (on-premise)", "Not sure"];

  const LANGUAGES = ["English", "Arabic", "French", "Spanish", "German", "Russian", "Chinese", "Hindi", "Other"];
  const INTEGRATIONS = ["HubSpot CRM", "Salesforce", "Microsoft Dynamics", "Zoho", "Booking engine", "Payment gateway", "Ticketing", "WhatsApp Business", "Newsletter", "Live chat or chatbot", "ERP or accounting", "Single sign-on", "Google Maps", "Custom API"];
  const HEAVY_INT = ["Payment gateway", "Booking engine", "Custom API", "ERP or accounting", "Ticketing", "Single sign-on", "Salesforce", "Microsoft Dynamics"];

  /* Add-ons: name, what it is, group, monthly price, one-time price (null: monthly only), build hours. */
  const ADDONS = [
    ["SEO setup", "Keywords, meta, schema and a technical check.", "Grow", 990, 3900, 2],
    ["Generative Search Optimisation", "Get found in ChatGPT, Gemini and Google's AI answers.", "Grow", 790, null, 1],
    ["Conversion optimisation", "A/B tests every month on headlines, forms and offers.", "Grow", 890, null, 1],
    ["Blog and content hub", "Articles, categories, authors and search, ready to publish.", "Grow", 390, 1900, 3],
    ["Monthly articles", "Four SEO articles a month, written and published.", "Grow", 1190, null, 0],
    ["Launch ad campaign", "Google and Meta campaigns set up for launch.", "Grow", 490, 1900, 0],
    ["Email newsletter templates", "Branded newsletter and automated email designs.", "Grow", 290, 1200, 2],
    ["AI chat assistant", "NEXA AI Lab's Convo AI answers, qualifies and books 24/7.", "AI", 690, null, 3],
    ["AI voice agent", "Caller AI answers calls, qualifies leads and books meetings.", "AI", 990, null, 2],
    ["AI site search", "Visitors ask questions and get answers from your own content.", "AI", 390, null, 2],
    ["AI image pack", "Twenty original brand images, art-directed for your site.", "AI", 490, 1900, 1],
    ["AI hero film", "A short AI-made film for your homepage hero.", "AI", 790, 2900, 1],
    ["Copywriting", "We write the words for every page.", "Content", 690, 2500, 0],
    ["Arabic copywriting", "Native Arabic copy, not translation.", "Content", 690, 2500, 0],
    ["Translation", "Your site in more languages, per language.", "Content", 590, 2200, 0],
    ["Photography day", "A half-day shoot of your team, place or product.", "Content", 790, 2900, 0],
    ["Brand refresh kit", "Logo clean-up, colour palette, type and icons.", "Content", 590, 2400, 4],
    ["Analytics and tracking", "GA4, Tag Manager and conversion events.", "Tech and security", 390, 1500, 1.5],
    ["Integrations", "Connect your CRM, bookings, payments and more, per system.", "Tech and security", 390, 1500, 0],
    ["Accessibility pack", "WCAG 2.2 AA audit, fixes and an accessibility statement.", "Tech and security", 490, 1900, 3],
    ["Privacy and consent pack", "Cookie consent and policies ready for UAE PDPL and GDPR.", "Tech and security", 190, 750, 1],
    ["Security shield", "Firewall, DDoS protection and daily malware scans.", "Tech and security", 290, null, 1],
    ["Speed boost", "Core Web Vitals tuned to green on mobile.", "Tech and security", 390, 1500, 2],
    ["WhatsApp chat and capture", "Click to chat, with every chat logged in your CRM.", "Tech and security", 190, 750, 1],
    ["More motion", "Richer animation across the site.", "Tech and security", 490, 1900, 2],
    ["Priority care", "Same-day replies and 5 extra change hours a month.", "Care", 790, null, 0],
    ["Extra change hours", "Ten more hours a month for updates and new pages.", "Care", 1990, null, 0],
    ["Team training", "A live session on editing your site, recorded for later.", "Care", 190, 950, 0]
  ];
  const ADDON = Object.fromEntries(ADDONS.map(x => [x[0], { d: x[1], g: x[2], m: x[3], o: x[4], h: x[5] }]));

  /* Plans. Monthly includes the build, hosting, maintenance (updates, security patches, backups, uptime checks) and change hours.
     One-time: the build paid once (half to start, half before go-live). Care: optional monthly maintenance after a one-time build. */
  const TIERS = [
    { id: "launch", name: "Launch", desc: "Landing pages and campaign microsites", line: "lp" },
    { id: "essential", name: "Essential", desc: "Clean, focused websites", line: "site" },
    { id: "growth", name: "Growth", desc: "Bigger sites, more features", line: "site" },
    { id: "signature", name: "Signature", desc: "Immersive, integrated, bespoke", line: "site" },
    { id: "platform", name: "Platform", desc: "Portals, dashboards and web apps, scoped with you", line: "platform", from: true }
  ];
  const PRICE = {
    plans: [490, 1490, 2990, 5490, 14900],
    once: [2490, 11900, 23900, 43900, 149000],
    care: [190, 490, 790, 1290, 3900],
    addons: Object.fromEntries(ADDONS.map(x => [x[0], x[3]])),
    tbc: true, /* prices to be confirmed by leadership: every price shows as AED XXX until this is false */
    extraRound: 350, extraHour: 250, vat: 0.05, minMonths: 12, annualPaysMonths: 10, deposit: 0.5, warrantyDays: 30
  };
  const INCL = [
    ["Pages", "Up to 5", "Up to 10", "Up to 25", "Up to 40", "Scoped with you"],
    ["Languages", "1", "1", "2", "Up to 4", "Any"],
    ["Integrations", "1", "1", "Up to 3", "Unlimited", "Unlimited"],
    ["3D, immersive and AI video", "No", "No", "One of them", "All", "All"],
    ["Change rounds on concepts", "1", "1", "2", "3", "3"],
    ["Change rounds on staging", "1", "2", "3", "4", "4"],
    ["Changes after launch", "1 hour a month", "2 hours a month", "5 hours a month", "10 hours a month", "20 hours a month"],
    ["We reply within", "2 working days", "2 working days", "1 working day", "Same working day", "Same day, named lead"],
    ["Hosting, SSL, backups, uptime checks", "Included", "Included", "Included", "Included", "Included"],
    ["Maintenance: updates and security patches", "Included", "Included", "Included", "Included", "Included"],
    ["Edit it yourself in NEXA Web Studio", "Included", "Landing pages", "Landing pages", "Landing pages", "Landing pages"],
    ["Monthly performance report", "No", "No", "Included", "Included", "Included"]
  ];
  const LIM = { pages: [5, 10, 25, 40, 999], hours: [1, 2, 5, 10, 20], concept: [1, 1, 2, 3, 3], inner: [1, 1, 2, 3, 3], staging: [1, 2, 3, 4, 4] };
  const MODELS = [
    ["monthly", "Monthly, all in", "Build, hosting, maintenance and change hours in one monthly price. No large bill up front."],
    ["once", "One-time build", "Pay once and own it on final payment. Hosting and changes are yours to manage, or paid by the hour."],
    ["onceCare", "One-time build + care", "Pay once for the build, then a small monthly care plan: hosting, maintenance and change hours."]
  ];

  /* Platforms the build can run on. */
  const STACKS = [
    ["Recommend for me", "We look at your answers and suggest the best fit, with reasons."],
    ["NEXA Web Studio", "Our own builder. Fastest for landing pages and campaigns. Edit it yourself, export to HubSpot."],
    ["HubSpot CMS", "Website, forms and CRM in one place. Marketers edit with drag and drop."],
    ["WordPress", "Flexible and familiar. Strong for large, content-heavy and multilingual sites."],
    ["Webflow", "Design-led sites with rich motion, edited visually."],
    ["Shopify", "The best checkout, payments and stock management for online stores."],
    ["Custom build (Next.js)", "A bespoke application for logins, data, dashboards and anything unusual."]
  ];
  /* Set-up questions per platform, with what each answer means we need from the client. */
  const SETUP = {
    "HubSpot CMS": {
      ask: "Do you already use HubSpot?",
      info: ["NEXA is a HubSpot partner: we can work in your account or set one up for you.", "To build the site you need Content Hub Professional or Enterprise. Your CRM and Marketing Hub can stay as they are.", "You never share a password. You invite us as a user and can remove us at any time.", "HubSpot licences are paid to HubSpot, directly or through us. They are not part of our price."],
      opts: [["hs-pro", "Yes, with Content Hub Professional or Enterprise"], ["hs-other", "Yes, but without Content Hub (CRM or Marketing only)"], ["hs-new", "No. Set it up for us"], ["hs-unsure", "Not sure what we have"]],
      needs: {
        "hs-pro": [["hs-invite", "Invite NEXA to your HubSpot as a Super Admin", "Settings, Users and Teams, Create user. We send you the email address to use."], ["hs-domain", "Connect your domain in HubSpot", "We guide you; it takes about 10 minutes at go-live."]],
        "hs-other": [["hs-upgrade", "Add Content Hub Professional to your HubSpot", "We advise the right seats; the licence is paid to HubSpot."], ["hs-invite", "Invite NEXA to your HubSpot as a Super Admin", "Settings, Users and Teams, Create user."], ["hs-domain", "Connect your domain in HubSpot", "We guide you at go-live."]],
        "hs-new": [["hs-quote", "Approve your HubSpot set-up", "We send the licence quote from HubSpot and set up the account, CRM and domain for you."]],
        "hs-unsure": [["hs-check", "Show us what you have", "Invite us as a user, or share a screenshot of Settings, Account and Billing. We tell you what's needed."]]
      }
    },
    "WordPress": {
      ask: "Where will WordPress run?",
      info: ["We build a custom theme with reusable blocks, so your team edits every page without a developer.", "Premium plugins (forms, multilingual, SEO) are licensed in your name; we advise exactly which."],
      opts: [["wp-nexa", "NEXA managed WordPress hosting (included in our plans)"], ["wp-own", "Our own hosting; we'll give you access"], ["wp-existing", "We have a WordPress site to redesign or rebuild"]],
      needs: {
        "wp-nexa": [["wp-plugins", "Approve the plugin licences", "We list them with prices; usually under AED 1,000 a year."]],
        "wp-own": [["wp-host", "Hosting access and a staging site", "cPanel or SFTP access through a user invitation, never a shared password."], ["wp-plugins", "Approve the plugin licences", "We list them with prices."]],
        "wp-existing": [["wp-admin", "Admin access to your current WordPress", "A new admin user for NEXA, plus a full backup."], ["wp-plugins", "Approve the plugin licences", "We list them with prices."]]
      }
    },
    "Shopify": {
      ask: "Do you already have a Shopify store?",
      info: ["We send a collaborator request; you approve it in Shopify. No passwords shared.", "The Shopify plan and payment fees are paid to Shopify."],
      opts: [["sh-have", "Yes, we have a store"], ["sh-new", "No. Set one up for us"]],
      needs: {
        "sh-have": [["sh-collab", "Approve our collaborator request", "Shopify admin, Settings, Users and permissions."], ["sh-products", "Your product list with photos", "A CSV export or spreadsheet; we import it."]],
        "sh-new": [["sh-plan", "Choose a Shopify plan", "We recommend one; it is paid to Shopify."], ["sh-products", "Your product list with photos", "A spreadsheet is fine; we import it."], ["sh-pay", "Payment provider and shipping rates", "We set them up with you."]]
      }
    },
    "Webflow": {
      ask: "Do you have a Webflow workspace?",
      info: ["Your site lives in your own Webflow workspace, so you always own it.", "The Webflow site plan is paid to Webflow; choose a CMS plan if you will have a blog or listings."],
      opts: [["wf-have", "Yes, we have a workspace"], ["wf-new", "No. Set one up for us"]],
      needs: { "wf-have": [["wf-invite", "Invite NEXA to your Webflow workspace", "As a designer or admin seat."]], "wf-new": [["wf-plan", "Approve the Webflow site plan", "We set it up in your name."]] }
    },
    "Custom build (Next.js)": {
      ask: "Who will host and run the application?",
      info: ["The code lives in your own repository, so you own it outright.", "We can host in a UAE cloud region if your data must stay in the country.", "Your IT team can review the architecture and security before we start."],
      opts: [["cb-nexa", "NEXA hosts and manages it (UAE region available)"], ["cb-ours", "Our IT team hosts it (AWS, Azure or on-premise)"], ["cb-unsure", "Advise us"]],
      needs: {
        "cb-nexa": [["cb-repo", "A code repository in your name", "GitHub or Azure DevOps; we push everything there."]],
        "cb-ours": [["cb-repo", "A code repository in your name", "GitHub or Azure DevOps."], ["cb-env", "Access to your cloud or servers", "A deployment account for staging and production, set up by your IT team."], ["cb-sec", "Your IT security requirements", "Single sign-on, penetration testing, data residency."]],
        "cb-unsure": [["cb-call", "A 30-minute architecture call", "With your IT lead, to choose hosting and security."]]
      }
    }
  };
  function recStack(a) {
    const type = a.type || "Website", line = lineOf(type), ints = a.integrations || [], ex = a.experience || [], langs = (a.languages || []).length, pages = a.pages || (TYPE[type] || {}).pages || 8, goals = a.goals || [];
    const big3d = ex.some(e => ["3D elements", "AR product preview", "Immersive scroll storytelling"].includes(e));
    if (type === "Online store") return ["Shopify", ["The best checkout, payments and stock management for online stores.", "Your team adds products and offers without a developer.", "Fast to launch, with thousands of proven apps."]];
    if (line === "platform") return ["Custom build (Next.js)", ["Logins, roles, data and dashboards need a proper application, not a website builder.", "A content workspace keeps every page editable by your team.", a.residency === "UAE data residency required" ? "It can be hosted in a UAE cloud region to keep your data in the country." : "You own the code, in your own repository."]];
    if (line === "lp" && !big3d) return ["NEXA Web Studio", ["Built in hours from proven, conversion-tested layouts.", "You can edit text, images and forms yourself after launch.", ints.includes("HubSpot CRM") ? "Forms send leads straight into your HubSpot, and pages can be exported as HubSpot modules." : "Publishes instantly to fast, secure hosting."]];
    if (big3d || a.motion === "Cinematic") return [big3d ? "Custom build (Next.js)" : "Webflow", big3d ? ["3D and scroll-driven scenes need full control of the code and performance.", "Content stays editable through a headless CMS.", "You own the code."] : ["Built for rich, film-like motion without heavy code.", "Edited visually by your team.", "Fast, secure hosting included with Webflow."]];
    if (ints.includes("HubSpot CRM") || goals.includes("Generate leads")) return ["HubSpot CMS", ["Your website, forms and CRM in one place: every enquiry lands in your pipeline.", "Marketers edit pages with drag and drop; no developer needed.", "Hosting, security and a global CDN are built in."]];
    if (pages > 25 || langs > 2 || goals.includes("Inform and educate")) return ["WordPress", ["Strong for large, content-heavy and multilingual sites.", "A huge ecosystem of plugins and editors who know it.", "You can host it anywhere."]];
    return ["HubSpot CMS", ["Easy for your team to edit, with forms and CRM built in.", "Secure, fast hosting is included.", "NEXA is a HubSpot partner, so set-up and support are straightforward."]];
  }

  /* NEXA's own live work, for inspiration. Confirm each client is happy to be shown before clients see the portal. */
  const WORK = [
    { id: "raknye", name: "RAK NYE", what: "New Year's Eve in Ras Al Khaimah: countdown, registration and the night's line-up.", sector: "Events", tags: ["Event website", "Countdown", "Registration"], url: "https://raknye.com" },
    { id: "rcr", name: "The Ritz-Carlton Residences, Al Wadi Desert", what: "Luxury residences with buyer and broker journeys and CRM lead capture.", sector: "Real estate", tags: ["Luxury", "Lead generation", "CRM"], url: "https://rcralwadi.com" },
    { id: "mdu", name: "Marjan Digital Universe", what: "An immersive 3D world to explore Marjan's destinations.", sector: "Real estate", tags: ["3D", "Immersive", "Interactive map"], url: "https://marjan.ae/universe" },
    { id: "marjan", name: "Marjan", what: "The master developer of Ras Al Khaimah: destinations, projects and investment.", sector: "Real estate", tags: ["Corporate website", "Full-screen imagery"], url: "https://marjan.ae" },
    { id: "jayasom", name: "Jayasom AMAALA", what: "A wellness resort: retreats, a booking engine and Arabic pages.", sector: "Hospitality", tags: ["Booking", "Bilingual", "Luxury"], url: "https://jayasom.com" },
    { id: "vjj", name: "Visit Jebel Jais", what: "The official destination website: adventures, trails and things to do.", sector: "Tourism", tags: ["Destination", "Full-screen imagery"], url: "https://visitjebeljais.com" },
    { id: "aha", name: "American Heart Association BLS", what: "Course landing pages in five languages with a training-centre finder.", sector: "Healthcare", tags: ["Landing page", "Five languages", "Course finder"], url: "https://lp.qualitywithheart.org/bls" }
  ];
  const LIKES = ["Layout", "Colours", "Typography", "Imagery", "Motion", "Overall feel"];

  window.NexaCatalog = { TYPES, TYPE, lineOf, GOALS, STYLES, STYLE_FAMILY, EXPERIENCE, MOTION, MOTION_H, USERS, PFEATURES, DATA_SRC, RESIDENCY, LANGUAGES, INTEGRATIONS, HEAVY_INT, ADDONS, ADDON, TIERS, PRICE, INCL, LIM, MODELS, STACKS, SETUP, recStack, WORK, LIKES };
})();
