module.exports = {
  file: "40-insurance-quote-request.html",
  name: "SME group health insurance broker",
  industry: "Insurance", goal: "Get a Quote",
  desc: "An Abu Dhabi broker placing group health cover for companies of 5 to 250 staff, with quotes in 3 working days.",
  title: "Group health insurance for SMEs | Saffar Benefits",
  metaDesc: "Group medical insurance for UAE companies with 5 to 250 staff. Quotes from 7 insurers in 3 working days, plans from AED 1,160 per employee a year.",
  brand: "Saffar Benefits",
  nav: ["How we help", "Plans", "Process", "Questions"],
  navCta: "Get a group quote",
  hero: {
    eyebrow: "Group health insurance for UAE companies",
    headline: "Group medical cover for your team, quoted in 3 working days",
    sub: "Send us your headcount and we compare 7 insurers for you, then explain the differences that actually matter: network, co-pays, maternity and pre-existing conditions.",
    cta: "Get a group quote",
    note: "Cover arranged for 418 UAE companies and 9,736 employees"
  },
  trust: { label: "Insurers we place with", items: ["Sahara Health", "Sakina Insurance", "Eastgate Insurance", "Gulfshield", "Crestline", "Northgate Health"] },
  sections: [
    {
      type: "features", variant: "aside", id: "how-we-help",
      head: "What a broker does that a direct quote does not",
      items: [
        { icon: "scale", title: "Seven quotes, one comparison", text: "We send one table with the same benefits lined up, so you compare like with like instead of three different PDFs." },
        { icon: "doc", title: "Census and paperwork done for you", text: "Send a spreadsheet of names, dates of birth and visa emirates. We build the census, the medical declarations and the insurer forms." },
        { icon: "users", title: "One account manager", text: "Your HR team gets one person to call for additions, deletions and card replacements, not an insurer call centre." },
        { icon: "receipt", title: "Claims escalation", text: "When an employee's claim is rejected or stuck, we take it up with the insurer's claims team directly." }
      ]
    },
    {
      type: "pricelist", id: "plans",
      head: "What plans typically cost per employee",
      lede: "Indicative annual premiums for a company of 20 to 50 staff with an average age of 34. Your quote depends on ages, emirate and claims history.",
      items: [
        { name: "Dubai basic plan, essential benefits", desc: "DHA minimum for staff earning under AED 4,000, restricted network", price: "From AED 1,160" },
        { name: "Abu Dhabi basic plan", desc: "DoH minimum for staff earning under AED 5,000", price: "From AED 1,380" },
        { name: "Enhanced UAE plan", desc: "Wider hospital network, 10% co-pay, maternity, dental and optical", price: "AED 4,250 to 6,900" },
        { name: "Comprehensive UAE plan", desc: "Top-tier hospitals, 0% co-pay in network, annual health check", price: "AED 8,400 to 12,750" },
        { name: "International plan, excluding US", desc: "For senior staff who travel, worldwide outpatient and inpatient", price: "AED 14,900 to 22,300" }
      ],
      note: "Premiums include 5% VAT. Dependants are priced separately and most companies offer tiered cover by grade."
    },
    {
      type: "compare",
      head: "What changes between basic and enhanced cover",
      cols: ["", "Enhanced plan", "Basic plan"],
      rows: [
        ["Hospitals", "Mediclinic, Cleveland Clinic Abu Dhabi, King's College Hospital", "A restricted network of clinics and some hospitals"],
        ["Outpatient co-pay", "10%, capped at AED 50 a visit", "20%, capped at AED 500 a year"],
        ["Maternity", "Up to AED 15,000", "Up to AED 7,000"],
        ["Dental and optical", "Up to AED 2,000 each", "Not included"],
        ["Annual limit", "AED 1,000,000", "AED 150,000"]
      ]
    },
    {
      type: "steps", id: "process",
      head: "From enquiry to cards in your team's hands",
      items: [
        { title: "Day 1: send your census", text: "A spreadsheet of staff and dependants, plus your current policy if you have one." },
        { title: "Day 3: compare quotes", text: "A comparison of up to 7 insurers and a 30-minute call to walk through it with your HR or finance lead." },
        { title: "Day 5 to 10: policy issued", text: "We submit forms and member declarations. Digital cards arrive within 48 hours of policy issue." }
      ]
    },
    {
      type: "quotes", variant: "pair",
      items: [
        { q: "Our renewal came in 31% higher. Saffar moved us to a different insurer with the same hospitals for 6% more than last year, and handled the switch in a week.", name: "Mohammed Al Kaabi", role: "Finance Manager, engineering consultancy, 64 staff", source: "Client reference, Aug 2026" },
        { q: "We went from 9 to 23 people in a year. Adding each new hire is one email to Lina and the card is on their phone the next day.", name: "Charlotte Ferreira", role: "Co-founder, design studio in Abu Dhabi", source: "Google review, Apr 2026" }
      ]
    },
    {
      type: "faq", variant: "stack", id: "questions",
      head: "Questions HR and finance teams ask",
      items: [
        { q: "What is the minimum company size?", a: "Five employees for most insurers, and two for some Dubai basic plans. Below that, we arrange individual policies." },
        { q: "Do you charge a fee?", a: "No. We are paid commission by the insurer, which is already in the premium you would pay going direct. We disclose it in the quote." },
        { q: "Are pre-existing conditions covered?", a: "On group plans with 10 or more staff, usually yes, from day one. Under 10, some insurers ask for medical declarations and may apply a waiting period." },
        { q: "Can we cover some staff differently?", a: "Yes. Most of our clients have two or three tiers by grade, for example comprehensive for managers and enhanced for everyone else." },
        { q: "Are you regulated?", a: "Yes. Saffar Benefits is licensed by the Central Bank of the UAE as an insurance broker." }
      ]
    }
  ],
  form: {
    title: "Get a group quote",
    sub: "We reply within one working day and send quotes within three.",
    cta: "Request quotes",
    foot: "No obligation. Your census is only shared with insurers you approve.",
    steps: 1,
    fields: [
      { type: "text", name: "full_name", label: "Your name", required: true },
      { type: "email", name: "work_email", label: "Work email", required: true },
      { type: "text", name: "company", label: "Company name", required: true },
      { type: "select", name: "headcount", label: "Employees to cover", required: true, options: ["2 to 9", "10 to 24", "25 to 49", "50 to 99", "100 to 250"] },
      { type: "select", name: "emirate", label: "Where are visas issued?", required: true, options: ["Dubai", "Abu Dhabi", "Sharjah", "Other emirates", "More than one emirate"] },
      { type: "select", name: "current", label: "Current cover", options: ["No group policy yet", "Renewing within 60 days", "Renewing later"] }
    ]
  },
  formSection: {
    head: "Quotes from 7 insurers, compared",
    text: "Send your headcount now and the census later. Lina Haddadin or a colleague will call within one working day.",
    points: ["Quotes in 3 working days", "No broker fee", "Additions handled by email"]
  },
  final: { head: "Renewing in January?", sub: "Start now and you will have quotes in hand before the insurer's renewal deadline.", cta: "Get a group quote" },
  footer: {
    tagline: "Group health insurance for UAE companies of 5 to 250 staff.",
    address: "Office 1907, Maryah Point Tower, Abu Dhabi Global Market Square, Al Maryah Island, Abu Dhabi",
    phone: "+971 2 694 3158",
    email: "quotes@saffarbenefits.ae",
    hours: "Monday to Friday, 8.30am to 5.30pm",
    legal: "Saffar Benefits Insurance Brokers LLC, licensed by the Central Bank of the UAE, registration 384"
  }
};
