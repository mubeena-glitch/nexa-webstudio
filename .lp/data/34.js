module.exports = {
  file: "34-solar-energy-quote.html",
  name: "Villa rooftop solar, free survey",
  industry: "Energy", goal: "Get a Quote",
  desc: "Rooftop solar for Dubai villas under Shams Dubai net metering, with a free roof survey and a fixed quote in 5 days.",
  title: "Villa rooftop solar in Dubai | Falaj Solar",
  metaDesc: "Rooftop solar for Dubai villas under Shams Dubai. Free roof survey, DEWA approvals handled, fixed quote within 5 working days. Systems from AED 24,900.",
  brand: "Falaj Solar",
  nav: ["Savings", "How it works", "Systems", "Questions"],
  navCta: "Book a free survey",
  hero: {
    eyebrow: "Shams Dubai net metering for villas",
    headline: "Let your roof pay part of your DEWA bill",
    sub: "We survey your villa roof free of charge, handle the DEWA approvals and fit a system sized to your bills. You get a fixed price and a payback figure before you sign anything.",
    cta: "Book a free survey",
    note: "DEWA enrolled installer. 693 villas connected since 2019",
    img: "photo-1600596542815-ffad4c1539a9",
    imgAlt: "A flat-roofed modern villa, the roof type most of our installations go on"
  },
  trust: { label: "Panels and inverters we install", items: ["Solvane", "Brightcell", "Volta Grid", "Invera", "Fluxmark"] },
  sections: [
    {
      type: "stats", variant: "ruled", id: "savings",
      head: "A real example: 4-bedroom villa, Arabian Ranches 2",
      text: "Fitted in March 2025. The owners were paying AED 3,600 to AED 4,100 a month in summer.",
      items: [
        { v: "12.32 kWp", l: "system, 22 panels on a flat roof" },
        { v: "19,870 kWh", l: "generated in the first 12 months" },
        { v: "AED 8,140", l: "saved on DEWA bills in year one" },
        { v: "5.3 years", l: "payback on a AED 42,800 system" }
      ],
      note: "Savings use the DEWA slab and fuel surcharge rates on their bills. Your survey report models your own consumption."
    },
    {
      type: "steps", id: "how-it-works",
      head: "From survey to switch-on in about seven weeks",
      items: [
        { title: "Roof survey, 60 minutes", text: "An engineer checks roof space, shading, structure and your DB board, and reads your last 12 DEWA bills with you." },
        { title: "Fixed quote in 5 working days", text: "System size, panel layout drawing, generation forecast and a single price. It does not change after you sign." },
        { title: "DEWA approval, 3 to 4 weeks", text: "We submit the Shams Dubai application and the design drawings and deal with any questions." },
        { title: "Install in 2 days, meter in 1", text: "Our own crew fits the system. DEWA inspects and swaps in a net meter, and your exported units start earning credits." }
      ]
    },
    {
      type: "pricelist", id: "systems",
      head: "Typical systems and fixed prices",
      lede: "Prices include panels, inverter, mounting, cabling, DEWA fees and the app. Your survey confirms what fits your roof.",
      items: [
        { name: "6.72 kWp, 12 panels", desc: "Townhouses and 3-bedroom villas, bills around AED 1,800 a month in summer", price: "AED 24,900" },
        { name: "10.08 kWp, 18 panels", desc: "4-bedroom villas, summer bills around AED 3,000", price: "AED 35,600" },
        { name: "12.32 kWp, 22 panels", desc: "Larger 4 and 5-bedroom villas", price: "AED 42,800" },
        { name: "16.24 kWp, 29 panels", desc: "5 and 6-bedroom villas with a pool", price: "AED 54,300" },
        { name: "Battery add-on, 10 kWh", desc: "Backup for essential circuits during outages", price: "AED 21,450" }
      ],
      note: "Prices include VAT. 0% instalments over 12 or 24 months with Corniche Bank credit cards."
    },
    {
      type: "checklist",
      head: "What every installation includes",
      items: [
        "25-year panel performance warranty and 10-year inverter warranty",
        "5-year workmanship warranty from Falaj Solar",
        "All Shams Dubai paperwork and DEWA inspection fees",
        "Generation monitoring on your phone",
        "Two panel cleans in the first year",
        "Community or developer NOC application where needed"
      ]
    },
    {
      type: "quotes", variant: "single",
      items: [
        { q: "The survey report showed the panels would not cover our summer bill, and said so. We went ahead anyway because the winter months almost zero out. August was AED 1,490 instead of AED 3,920.", name: "Khalid Bin Sulayem", role: "Villa owner, Al Barari", source: "Google review, Sept 2026" }
      ]
    },
    {
      type: "faq", variant: "aside", id: "questions",
      head: "What villa owners ask",
      items: [
        { q: "Do I need my community's permission?", a: "Most communities ask for a no-objection certificate. We prepare the drawings and apply for it with Emaar, Nakheel, Dubai Properties or your owners association." },
        { q: "What happens to the power I do not use?", a: "Under Shams Dubai it goes into the grid and DEWA credits it against future bills. Credits roll over month to month." },
        { q: "Will it work during a power cut?", a: "A grid-tied system switches off for safety. If you want backup, add a battery and we wire it to your essential circuits." },
        { q: "Does sand and dust matter?", a: "It cuts output by around 4 to 7% between cleans. A clean every 6 to 8 weeks keeps it in check; we offer a plan at AED 189 a visit." },
        { q: "I am renting. Can I still install?", a: "Only with written landlord approval, since the DEWA account and the roof belong to the owner." }
      ]
    }
  ],
  form: {
    title: "Book a free roof survey",
    sub: "We call within one working day to book a 60-minute visit.",
    cta: "Book my survey",
    foot: "No obligation. Your bills are only used to size your system.",
    steps: 1,
    fields: [
      { type: "text", name: "full_name", label: "Full name", required: true },
      { type: "tel", name: "mobile", label: "Mobile number", required: true },
      { type: "text", name: "community", label: "Community and villa number", required: true },
      { type: "select", name: "summer_bill", label: "Typical summer DEWA bill", required: true, options: ["Under AED 1,500", "AED 1,500 to 3,000", "AED 3,000 to 5,000", "Over AED 5,000"] },
      { type: "select", name: "roof_type", label: "Roof type", options: ["Flat concrete", "Pitched tiles", "Not sure"] },
      { type: "checkbox", name: "battery", label: "I am interested in battery backup" }
    ]
  },
  formSection: {
    head: "Start with the numbers",
    text: "The survey is free and the quote is fixed. If solar does not pay back on your roof, the report will say so.",
    points: ["Survey within 6 working days", "Fixed price in 5 days", "DEWA approvals handled"]
  },
  final: { head: "Summer bills start again in May", sub: "Survey in December and your system can be live before the heat.", cta: "Book a free survey" },
  footer: {
    tagline: "Rooftop solar for Dubai villas, under Shams Dubai.",
    address: "Warehouse 11, Street 18, Al Quoz Industrial Area 3, Dubai",
    phone: "+971 4 380 5527",
    email: "survey@falajsolar.ae",
    hours: "Sunday to Friday, 8am to 6pm",
    legal: "DEWA enrolled solar PV contractor. Dubai DED licence 802317"
  }
};
