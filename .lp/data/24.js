module.exports = {
  file: "24-partner-distributor-signup.html",
  name: "Canned cold brew, GCC distributor programme",
  industry: "Professional Services", goal: "Signup",
  desc: "Apply to distribute a UAE-made canned cold brew in Saudi, Kuwait, Qatar, Bahrain or Oman. Margins, terms and onboarding.",
  title: "Distribute Qamar Cold Brew in the GCC",
  metaDesc: "Qamar Cold Brew is looking for distributors in KSA, Kuwait, Qatar, Bahrain and Oman. Margins of 24% to 33%, 60-day terms, SFDA and GSO registered.",
  brand: "Qamar Cold Brew",
  nav: ["Partner terms", "Margins", "Onboarding"],
  navCta: "Apply now",
  hero: {
    eyebrow: "Distributor programme · 5 GCC markets",
    headline: "Carry the cold brew UAE cafés already stock",
    sub: "Canned in Dubai Industrial City, sold in 412 outlets across the UAE. We are appointing one distributor per market in KSA, Kuwait, Qatar, Bahrain and Oman for Q2 2027.",
    cta: "Apply to distribute",
    note: "Applications for Saudi Arabia close 28 February 2027"
  },
  trust: { label: "Stocked in the UAE by", items: ["Spinneys", "Waitrose UAE", "Kibsons", "Zoom convenience stores", "Talabat Mart"] },
  sections: [
    {
      type: "checklist", id: "partner-terms",
      head: "What a Qamar distributor gets",
      text: "One exclusive partner per country. Terms are reviewed after the first 12 months.",
      items: [
        "Exclusive rights in your country for 3 years",
        "60-day payment terms after the second order",
        "Product registered with SFDA and GSO, labels in Arabic and English",
        "Shelf life of 11 months from canning, ambient storage",
        "Launch budget of AED 38,500 for listing fees, sampling and in-store kit",
        "A named account manager in Dubai, Sunday to Thursday cover"
      ]
    },
    {
      type: "pricelist", id: "margins",
      head: "Margins by annual volume",
      lede: "Distributor price is ex-works Dubai per case of 24 cans. Recommended retail is AED 12 per can or the local equivalent.",
      items: [
        { name: "Launch tier", desc: "Up to 3,000 cases in year one.", price: "24% margin" },
        { name: "Growth tier", desc: "3,001 to 9,000 cases.", price: "28% margin" },
        { name: "Anchor tier", desc: "Over 9,000 cases, plus a share of regional key accounts.", price: "33% margin" },
        { name: "Minimum first order", desc: "One 20-foot container, mixed flavours allowed.", price: "1,560 cases" }
      ],
      note: "Margins are on recommended retail price after the retailer's share. Full price list sent after the first call."
    },
    {
      type: "steps", id: "onboarding",
      head: "From application to first container",
      items: [
        { title: "Application review", text: "We reply within 5 working days. You need a trade licence and an existing chilled or ambient beverage range." },
        { title: "Call with our commercial lead", text: "45 minutes on your accounts, warehouse and route to market. We share the full price file afterwards." },
        { title: "Samples and a market visit", text: "We send 4 cases of samples and visit your top 10 accounts with you." },
        { title: "Agreement and first shipment", text: "Typical time from signing to stock in your warehouse is 34 days." }
      ]
    },
    {
      type: "stats", variant: "inline",
      items: [
        { v: "412", l: "UAE outlets stocking Qamar" },
        { v: "1.86m", l: "cans sold in 2026" },
        { v: "7", l: "flavours, 3 of them sugar-free" }
      ]
    },
    {
      type: "quotes", variant: "single",
      items: [
        { q: "We trialled Qamar alongside two imported brands in our Doha cafés. Qamar outsold both within six weeks, and the pallet arrived when they said it would.", name: "Faisal Al Rumaihi", role: "Commercial Director, foodservice distributor, Qatar", source: "Trial partner, 2026" }
      ]
    },
    {
      type: "faq", variant: "aside",
      head: "Before you apply",
      items: [
        { q: "Do we need cold chain?", a: "No. The cans are shelf-stable at ambient temperature. Chilling is only needed at the point of sale." },
        { q: "Who pays for registration in our market?", a: "Qamar holds the product registrations. You handle import permits as the importer of record." },
        { q: "Can we cover more than one country?", a: "Yes, if you already distribute there. Each country is reviewed separately." },
        { q: "What if we miss the volume target?", a: "You stay on the launch tier. Exclusivity is only reviewed if volume falls below 1,800 cases a year." }
      ]
    }
  ],
  form: {
    title: "Apply to distribute Qamar",
    sub: "Our commercial lead reviews every application and replies within 5 working days.",
    cta: "Send application",
    foot: "Your information stays with our commercial team and is not shared.",
    steps: 1,
    fields: [
      { type: "text", name: "company", label: "Company name", required: true },
      { type: "select", name: "country", label: "Country", required: true, options: ["Saudi Arabia", "Kuwait", "Qatar", "Bahrain", "Oman"] },
      { type: "select", name: "channels", label: "Main channel", required: true, options: ["Modern trade (supermarkets)", "Convenience and petrol stations", "Foodservice and cafés", "Online grocery", "A mix of these"] },
      { type: "select", name: "turnover", label: "Annual beverage turnover", options: ["Under USD 1m", "USD 1m to 5m", "USD 5m to 20m", "Over USD 20m"] },
      { type: "text", name: "contact_name", label: "Your name", required: true },
      { type: "email", name: "email", label: "Work email", required: true }
    ]
  },
  formSection: {
    head: "One partner per country",
    text: "We are speaking to a shortlist in each market. Apply before the deadline to be considered for Q2 2027.",
    points: ["Reply in 5 working days", "Samples shipped free", "Exclusive for 3 years"]
  },
  final: { head: "Saudi applications close 28 February 2027", sub: "Kuwait, Qatar, Bahrain and Oman close 31 March.", cta: "Apply to distribute" },
  footer: {
    tagline: "Qamar Cold Brew is roasted, brewed and canned in Dubai.",
    address: "Plot 597-1180, Dubai Industrial City, Saih Shuaib 2, Dubai",
    phone: "+971 4 880 3146",
    email: "partners@qamarcoldbrew.com",
    hours: "Sunday to Thursday, 8am to 5pm",
    legal: "Qamar Beverages LLC, Dubai Industrial City licence 77461"
  }
};
