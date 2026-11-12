module.exports = {
  file: "19-professional-services-leadgen.html",
  name: "Corporate tax and VAT health check",
  industry: "Professional Services", goal: "Lead Generation",
  desc: "UAE corporate tax and VAT advisers offering a free 30-minute registration health check call for SMEs and groups.",
  title: "Free UAE corporate tax and VAT health check | Hollis Qureshi",
  metaDesc: "A free 30-minute call with an FTA-registered tax agent to check your corporate tax and VAT registrations, deadlines and Small Business Relief before penalties apply.",
  brand: "Hollis Qureshi Tax",
  nav: ["What we check", "How it works", "Advisers", "FAQ"],
  navCta: "Book a health check",
  hero: {
    eyebrow: "FTA-registered tax agents, Business Bay",
    headline: "Is your corporate tax registration actually right?",
    sub: "Late registration costs AED 10,000, and wrong tax periods catch out more businesses than missed ones. A 30-minute call with a senior adviser tells you where you stand.",
    cta: "Book a free health check",
    cta2: "What we check",
    note: "1,317 UAE businesses checked since June 2023",
    img: "photo-1554224155-6726b3ff858f",
    imgAlt: "A tax adviser reviewing a client's financial statements with a calculator"
  },
  trust: { label: "Clients include businesses in", items: ["Dubai Silicon Oasis", "JAFZA", "DMCC", "ADGM", "Sharjah Media City"] },
  sections: [
    {
      type: "checklist", id: "what-we-check",
      head: "What the health check covers",
      text: "Have your trade licence and FTA portal login to hand. We look at it with you on screen.",
      items: [
        "Whether each licence in your group needs its own corporate tax registration",
        "Your first tax period and filing deadline, as the FTA has it recorded",
        "Whether Small Business Relief or Qualifying Free Zone Person status is open to you",
        "VAT registration threshold, group registration and voluntary deregistration",
        "Related party transactions that need transfer pricing documentation",
        "Any penalties already on your account and whether a waiver request is worth making"
      ]
    },
    {
      type: "steps", id: "how-it-works",
      head: "What happens after you book",
      items: [
        { title: "Pick a slot", text: "Calls run Monday to Friday, 9am to 5pm. Most people are seen within three working days." },
        { title: "Talk to a senior adviser", text: "30 minutes on video. We go through your registrations line by line and flag anything wrong." },
        { title: "Get a one-page summary", text: "Within two working days: what is correct, what needs fixing, and by when." },
        { title: "Decide if you need us", text: "Many fixes you can make yourself on EmaraTax. If not, we quote a fixed fee." }
      ]
    },
    {
      type: "people", id: "advisers",
      head: "The advisers on your call",
      items: [
        { name: "Faisal Qureshi", role: "Managing partner", bio: "Chartered accountant, 17 years in Gulf tax including six in a Big Four indirect tax team in Dubai. FTA-registered tax agent." },
        { name: "Eleanor Hollis", role: "Partner, corporate tax", bio: "Chartered Tax Adviser from the UK. Leads free zone and group restructuring work since corporate tax arrived in June 2023." },
        { name: "Arjun Menon", role: "Senior manager, VAT", bio: "Has filed more than 2,400 VAT returns and handled 38 FTA audits for trading, property and hospitality clients." }
      ]
    },
    {
      type: "stats", variant: "inline",
      head: "What the checks have found",
      items: [
        { v: "1,317", l: "businesses checked" },
        { v: "29%", l: "had at least one registration error" },
        { v: "AED 4.6m", l: "in penalties avoided or waived for clients" }
      ],
      note: "Figures from June 2023 to October 2026."
    },
    {
      type: "faq", variant: "aside", id: "faq",
      head: "Before you book",
      items: [
        { q: "Is the call really free?", a: "Yes. There is no charge and no obligation. About one in four callers become clients, and the rest leave with a clear list." },
        { q: "We already have an accountant. Is this still useful?", a: "Often, yes. Bookkeepers keep the books. We check the tax position, which is a different job. Bring your accountant along." },
        { q: "We are in a free zone. Do we still need to register?", a: "Yes. Every free zone entity must register for corporate tax, even if it qualifies for the 0% rate." },
        { q: "Can you file for us?", a: "Yes. Corporate tax returns start at AED 4,750 and quarterly VAT returns at AED 1,150, quoted after the call." },
        { q: "Do you work outside Dubai?", a: "Yes. We advise businesses across all seven emirates, by video or at your office." }
      ]
    }
  ],
  form: {
    title: "Book your free health check",
    sub: "We confirm your slot by email within one working day.",
    cta: "Book my health check",
    foot: "No charge, no obligation. Your details stay with our team and are never shared.",
    steps: 1,
    fields: [
      { type: "text", name: "full_name", label: "Full name", required: true },
      { type: "email", name: "work_email", label: "Work email", required: true },
      { type: "tel", name: "phone", label: "Phone", required: true },
      { type: "text", name: "company", label: "Company name", required: true },
      { type: "select", name: "licence", label: "Where your business is licensed", required: true, options: ["Dubai mainland", "Abu Dhabi mainland", "Other emirate mainland", "Free zone", "Mix of mainland and free zone"] },
      { type: "select", name: "revenue", label: "Annual revenue", required: true, options: ["Under AED 3 million", "AED 3m to 15m", "AED 15m to 50m", "Over AED 50m"] }
    ]
  },
  formSection: {
    head: "Thirty minutes that could save you AED 10,000",
    text: "Book a time and a senior adviser will go through your registrations with you.",
    points: ["Free and no obligation", "Senior adviser on every call", "One-page summary in two working days"]
  },
  final: { head: "Check your registration before the FTA does", sub: "Calls this week are still available.", cta: "Book a free health check" },
  footer: {
    tagline: "Corporate tax, VAT and transfer pricing advice for UAE businesses.",
    address: "Office 1907, Churchill Executive Tower, Business Bay, Dubai",
    phone: "+971 4 357 2690",
    email: "advice@hollisqureshi.ae",
    hours: "Monday to Friday 9am to 6pm",
    legal: "Hollis Qureshi Tax Consultants LLC, FTA tax agency registration 20048617"
  }
};
