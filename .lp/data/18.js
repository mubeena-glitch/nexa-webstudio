module.exports = {
  file: "18-fintech-demo.html",
  name: "Treasury and spend platform demo",
  industry: "Finance", goal: "Demo Booking",
  desc: "Treasury, cash visibility and corporate cards for mid-size GCC companies, with a 30-minute demo on your own bank setup.",
  title: "Treasury and spend management for GCC finance teams | Tadfuq",
  metaDesc: "See every bank balance across UAE and KSA by 8am, issue controlled corporate cards and forecast 13 weeks of cash. Book a 30-minute demo built on your own banks.",
  brand: "Tadfuq",
  nav: ["Why switch", "Demo", "Results", "FAQ"],
  navCta: "Book a demo",
  hero: {
    eyebrow: "For finance teams with 3 to 40 bank accounts",
    headline: "Know your group cash position by 8am, every day",
    sub: "Tadfuq pulls balances from 23 UAE and KSA banks, issues corporate cards with approval rules and builds a rolling 13-week cash forecast. One demo, built around your banks.",
    cta: "Book a 30-minute demo",
    note: "Used by 186 companies across the UAE, KSA and Oman"
  },
  trust: { label: "Connected banks include", items: ["Corniche Bank", "Capital Bay Bank", "Dune Commercial Bank", "Najd Bank", "Peninsula National Bank", "Falcon Bank"] },
  sections: [
    {
      type: "compare", id: "why-switch",
      head: "What changes when you stop logging into each bank",
      cols: ["", "With Tadfuq", "Bank portals and a spreadsheet"],
      rows: [
        ["Group cash position", "Ready at 8am, by entity and currency", "Two to three hours each morning"],
        ["Card spend control", "Limits per person, merchant and project", "Shared cards, receipts chased at month end"],
        ["Approvals", "Payments over your threshold go to two approvers", "Email chains and signed PDFs"],
        ["Cash forecast", "Rolling 13 weeks, updated daily", "Rebuilt monthly from scratch"],
        ["Audit trail", "Every action logged, exportable", "Spread across inboxes"]
      ]
    },
    {
      type: "steps", id: "demo",
      head: "What happens in the demo",
      lede: "30 minutes on video with a solutions consultant who has run finance teams in the region.",
      items: [
        { title: "We map your banks first", text: "Tell us which banks and entities you have when you book. We set up a sandbox that mirrors them." },
        { title: "Your morning cash view", text: "See how balances from your actual banks appear by entity, in AED, SAR and USD." },
        { title: "Cards and approvals", text: "Set a spend rule for one of your teams live, and watch an approval request reach a phone." },
        { title: "Pricing and timeline", text: "A written quote within one working day. Most customers are live in 19 working days." }
      ]
    },
    {
      type: "stats", variant: "ruled", id: "results",
      head: "Across our customers in 2026",
      items: [
        { v: "11.4 hrs", l: "saved per finance person each week, on average" },
        { v: "19 days", l: "median time from contract to go-live" },
        { v: "AED 2.31bn", l: "card and payment volume approved in Q3" },
        { v: "4.7", l: "on G2 from 94 reviews" }
      ],
      note: "Time saved from a customer survey in August 2026, 71 responses."
    },
    {
      type: "quotes", variant: "feature",
      head: "From finance leaders using it",
      items: [
        { q: "We have nine entities and 27 bank accounts. My team used to spend Sunday morning building the cash report. Now it is in my inbox before I park.", name: "Abdulla Al Hammadi", role: "CFO, regional building materials group", source: "Customer interview, September 2026" },
        { q: "Card limits by project ended the month-end receipt hunt. We closed October in five days, down from eight.", name: "Meera Pillai", role: "Finance Manager, events company", source: "G2 review, October 2026" },
        { q: "Implementation was the easiest bank integration I have done in the GCC, and I have done eleven.", name: "Stefan Kowalczyk", role: "Head of Treasury, logistics group", source: "G2 review, July 2026" }
      ]
    },
    {
      type: "faq", variant: "stack", id: "faq",
      head: "Questions finance teams ask us",
      items: [
        { q: "Is Tadfuq a bank?", a: "No. We are a software platform. Cards are issued by our partner bank, and your money stays in your own accounts." },
        { q: "How is our data secured?", a: "SOC 2 Type II audited, data hosted in the UAE, read-only bank connections unless you enable payments." },
        { q: "What does it cost?", a: "Plans start at AED 3,900 a month for up to five entities, with cards priced per active card. You get an exact quote after the demo." },
        { q: "Does it work with our ERP?", a: "Yes for Oracle NetSuite, Microsoft Dynamics 365, SAP Business One, Odoo and Zoho Books." },
        { q: "What if we only want treasury, not cards?", a: "That is fine. Around a third of customers start with treasury and add cards later." }
      ]
    }
  ],
  form: {
    title: "Book your 30-minute demo",
    sub: "We set the demo up with your banks, so tell us which you use.",
    cta: "Book my demo",
    foot: "A real person replies within one working day. No automated sequences.",
    steps: 1,
    fields: [
      { type: "text", name: "full_name", label: "Full name", required: true },
      { type: "email", name: "work_email", label: "Work email", required: true },
      { type: "text", name: "company", label: "Company", required: true },
      { type: "select", name: "entities", label: "Number of legal entities", required: true, options: ["1", "2 to 5", "6 to 15", "More than 15"] },
      { type: "select", name: "interest", label: "Most interested in", required: true, options: ["Cash visibility and forecasting", "Corporate cards and spend control", "Payment approvals", "All of it"] },
      { type: "text", name: "banks", label: "Banks you use", required: false }
    ]
  },
  formSection: {
    head: "A demo on your banks, not ours",
    text: "We prepare a sandbox that mirrors your entities and banks before the call.",
    points: ["30 minutes, video call", "Written quote within one working day", "No commitment"]
  },
  final: { head: "See your cash position on one screen", sub: "Demos run Sunday to Thursday, 9am to 6pm GST.", cta: "Book a demo" },
  footer: {
    tagline: "Treasury, cards and approvals for mid-size companies in the GCC.",
    address: "Level 9, Hub71, Al Khatem Tower, ADGM Square, Al Maryah Island, Abu Dhabi",
    phone: "+971 2 418 3375",
    email: "sales@tadfuq.ae",
    legal: "Tadfuq Technologies Ltd, registered in ADGM, no. 000009412. Cards issued by a UAE Central Bank licensed partner bank."
  }
};
