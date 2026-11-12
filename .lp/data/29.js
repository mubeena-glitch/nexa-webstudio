module.exports = {
  file: "29-recruitment-employer-leadgen.html",
  name: "Finance and tech recruiters, brief a role",
  industry: "Recruitment", goal: "Lead Generation",
  desc: "DIFC recruitment firm placing finance and technology hires across the GCC. Brief a role, get a shortlist in 9 days.",
  title: "Finance and tech recruitment in the GCC | Ledgerline Search",
  metaDesc: "Ledgerline Search places finance and technology hires in the UAE, Saudi Arabia and Qatar. Shortlist in 9 working days, fee of 18% on success.",
  brand: "Ledgerline Search",
  nav: ["Results", "How we work", "Consultants"],
  navCta: "Brief a role",
  hero: {
    eyebrow: "Finance and technology hiring · DIFC, Dubai",
    headline: "Three CVs worth interviewing, in 9 working days",
    sub: "We recruit finance controllers, FP&A leads, data engineers and product managers for companies across the UAE, Saudi Arabia and Qatar. You pay only when someone starts.",
    cta: "Brief a role",
    note: "212 placements in the last 12 months"
  },
  trust: { label: "Hiring with us this year", items: ["Mizan Lending", "Corniche Asset Partners", "Tamra Foods Group", "Harbourline Logistics", "Khayal Pay"] },
  sections: [
    {
      type: "stats", variant: "ruled", id: "results",
      head: "Last 12 months, November 2025 to October 2026",
      items: [
        { v: "212", l: "placements in 6 countries" },
        { v: "9 days", l: "median time to first shortlist" },
        { v: "3.4", l: "CVs sent per hire, on average" },
        { v: "91.5%", l: "of hires still in the role after 12 months" }
      ],
      note: "From our placement records. Retention measured on hires made between November 2024 and October 2025."
    },
    {
      type: "compare",
      head: "How we differ from a generalist agency",
      cols: ["", "Ledgerline", "Typical generalist agency"],
      rows: [
        ["Who you speak to", "A consultant who only recruits your function", "An account manager, then a researcher"],
        ["CVs you receive", "3 to 4, each with interview notes", "10 to 20, unscreened"],
        ["Fee", "18% of first-year base salary", "20% to 25%"],
        ["Rebate if they leave", "Free replacement within 6 months", "Usually 3 months, sliding scale"],
        ["Saudi hiring", "Saudisation quotas factored into every shortlist", "Handled case by case"]
      ]
    },
    {
      type: "steps", id: "how-we-work",
      head: "How a search works",
      items: [
        { title: "Briefing call, 30 minutes", text: "The role, the team, the salary band and the reasons the last hire did or did not work." },
        { title: "Search and interviews", text: "We approach candidates directly and interview each one in person or on video before you see them." },
        { title: "Shortlist in 9 working days", text: "Three or four CVs, each with notes on motivation, notice period and salary expectations." },
        { title: "Offer and notice period", text: "We handle offer negotiation and stay in touch with your hire until their first day." }
      ]
    },
    {
      type: "people", id: "consultants",
      head: "Consultants",
      items: [
        { name: "Waleed Al Saadi", role: "Partner, finance leadership", bio: "Places CFOs and financial controllers. Chartered accountant, 6 years in audit before recruitment." },
        { name: "Priyanka Iyer", role: "Principal, data and engineering", bio: "Recruits data engineers, analytics leads and platform teams in Dubai and Riyadh." },
        { name: "Eleanor Fitch", role: "Principal, product and design", bio: "Moved from London in 2021. Focuses on product managers and designers for fintech and e-commerce." }
      ]
    },
    {
      type: "quotes", variant: "feature",
      head: "Hiring managers",
      items: [
        { q: "We had been trying to hire a group financial controller for five months. Ledgerline sent three people in eight days and we hired the second one.", name: "Khalid Bukhatir", role: "CFO, family holding company, Dubai" },
        { q: "Priyanka understood the stack before the call ended. Every CV could do the job.", name: "Natasha Ilyina", role: "VP Engineering, payments company, DIFC" },
        { q: "They were straight with us that our salary band was low for Riyadh. That saved us a month.", name: "Ruth Agyeman", role: "Head of People, retail group" }
      ]
    },
    {
      type: "faq", variant: "aside",
      head: "Before you brief us",
      items: [
        { q: "Do you work on exclusive or contingent terms?", a: "Both. Exclusive briefs get a shortlist in 9 working days. Contingent briefs take longer because we prioritise exclusive work." },
        { q: "Is there a retainer?", a: "Only for searches above AED 70,000 a month base salary, where a third of the fee is paid at the start." },
        { q: "Which countries do you cover?", a: "UAE, Saudi Arabia, Qatar, Bahrain, Kuwait and Oman. Most of our placements are in Dubai, Abu Dhabi and Riyadh." },
        { q: "Can you hire contractors?", a: "Yes, for finance and data roles of 3 to 12 months, on our payroll." }
      ]
    }
  ],
  form: {
    title: "Brief a role",
    sub: "A consultant for that function calls you within 4 working hours to book a briefing.",
    cta: "Send the brief",
    foot: "No fee unless you hire. Your brief is kept confidential.",
    steps: 1,
    fields: [
      { type: "text", name: "full_name", label: "Your name", required: true },
      { type: "email", name: "work_email", label: "Work email", required: true },
      { type: "text", name: "role_title", label: "Role you are hiring for", required: true },
      { type: "select", name: "function", label: "Function", required: true, options: ["Finance and accounting", "FP&A and treasury", "Data and analytics", "Software engineering", "Product and design"] },
      { type: "select", name: "location", label: "Location", options: ["Dubai", "Abu Dhabi", "Riyadh", "Jeddah", "Doha", "Elsewhere in the GCC"] },
      { type: "select", name: "salary", label: "Monthly base salary", options: ["Under AED 25,000", "AED 25,000 to 45,000", "AED 45,000 to 70,000", "Over AED 70,000"] }
    ]
  },
  formSection: {
    head: "You pay when your hire starts",
    text: "Send us the role in a few lines. We will tell you on the first call if the salary band and timeline are realistic.",
    points: ["Fee of 18% on success", "Shortlist in 9 working days", "Free replacement within 6 months"]
  },
  final: { head: "Hiring before the end of Q1 2027?", sub: "Brief us now and see a shortlist before the holidays.", cta: "Brief a role" },
  footer: {
    tagline: "Ledgerline Search recruits finance and technology professionals across the GCC.",
    address: "Office 509, Level 5, Index Tower, DIFC, Dubai",
    phone: "+971 4 323 8841",
    email: "briefs@ledgerlinesearch.com",
    hours: "Monday to Friday, 8:30am to 6pm",
    legal: "Ledgerline Search Ltd, DIFC registration 6127. MOHRE recruitment licence 4402"
  }
};
