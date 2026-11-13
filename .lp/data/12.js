module.exports = {
  file: "12-saas-webinar-registration.html",
  name: "Finance ops webinar sign-up",
  industry: "SaaS / Tech", goal: "Webinar",
  desc: "A 50-minute live session on closing the month in four working days, with three GCC finance leads and a replay.",
  title: "Live webinar: close the month in 4 days | Tallyroom",
  metaDesc: "Wednesday 9 December 2026, 11am GST. Three GCC finance leads show how they cut month-end close from nine working days to four. Free, with replay.",
  brand: "Tallyroom",
  nav: ["Agenda", "Speakers", "Takeaways", "FAQ"],
  navCta: "Register free",
  hero: {
    eyebrow: "Live on Wednesday 9 December, 11am GST",
    headline: "How three GCC finance teams close the month in 4 days",
    sub: "A 50-minute working session, not a product tour. Three finance leads share the close calendar, the reconciliations they automated and the ones they kept manual.",
    cta: "Register free",
    note: "742 finance and ops people registered so far"
  },
  trust: { label: "Speakers and past attendees from", items: ["Aramex", "Kitopi", "Tabby", "Al Ghurair Foods", "Dubai Holding"] },
  sections: [
    {
      type: "steps", id: "agenda",
      head: "The 50 minutes, in order",
      lede: "All times GST. Cameras on for speakers, questions through the chat.",
      items: [
        { title: "11:00 The starting point", text: "Hessa Al Marzouqi shows the nine-day close calendar her team ran in 2025 and where the days actually went." },
        { title: "11:12 Bank and card reconciliations", text: "Nikhil Varghese walks through matching 3,400 card transactions a month across four banks, and the 2% he still checks by hand." },
        { title: "11:27 Intercompany and accruals", text: "Callum Brodie on agreeing intercompany balances across UAE and KSA entities before day two, not day seven." },
        { title: "11:40 Open questions", text: "Ten minutes of your questions, answered live. Anything left over gets a written reply by Friday." }
      ]
    },
    {
      type: "people", id: "speakers",
      head: "Who is speaking",
      items: [
        { name: "Hessa Al Marzouqi", role: "Group Financial Controller, consumer goods distributor", bio: "Runs a finance team of 14 across Dubai and Riyadh. Took the group close from nine working days to four between March and October 2026." },
        { name: "Nikhil Varghese", role: "Finance Operations Lead, regional food delivery business", bio: "Owns card spend and bank reconciliation for 31 cost centres. Previously audit senior at a Big Four firm in Dubai." },
        { name: "Callum Brodie", role: "Head of Finance Systems, Tallyroom", bio: "Moderates and covers the intercompany section. Spent eight years implementing ERPs for GCC holding groups before joining Tallyroom." }
      ]
    },
    {
      type: "checklist", id: "takeaways",
      head: "What you leave with",
      text: "Everything below arrives in the follow-up email on Thursday 10 December.",
      items: [
        "The four-day close calendar Hessa's team uses, as an editable sheet",
        "A reconciliation checklist for UAE and KSA bank feeds",
        "Nikhil's rules for which card transactions to auto-match",
        "An intercompany sign-off template for multi-entity groups",
        "The full recording, with chapter markers"
      ]
    },
    {
      type: "notice",
      head: "Cannot make 11am?",
      text: "Register anyway. The recording and the templates go to everyone who signs up, usually within 24 hours."
    },
    {
      type: "faq", variant: "aside", id: "faq",
      head: "Before you register",
      items: [
        { q: "Is this a sales pitch?", a: "No. Two of the three speakers are not Tallyroom customers. Callum mentions the product once, in the intercompany section, where it is relevant." },
        { q: "Who is it for?", a: "Financial controllers, finance managers and ops leads at companies with two or more entities or more than one bank." },
        { q: "Which platform is it on?", a: "Zoom webinar. The joining link arrives straight after you register and again one hour before." },
        { q: "Does it count towards CPD?", a: "We issue an attendance certificate for 50 minutes that most ACCA and CIMA members log as unverifiable CPD." }
      ]
    }
  ],
  form: {
    title: "Register for 9 December",
    sub: "Calendar invite and joining link arrive within a minute.",
    cta: "Save my place",
    foot: "One reminder email the day before, one with the replay. Nothing else unless you ask.",
    steps: 1,
    fields: [
      { type: "text", name: "full_name", label: "Full name", required: true },
      { type: "email", name: "work_email", label: "Work email", required: true },
      { type: "text", name: "company", label: "Company", required: true },
      { type: "select", name: "role", label: "Your role", required: true, options: ["CFO or finance director", "Financial controller", "Finance or accounts manager", "Finance operations", "Other"] },
      { type: "select", name: "close_days", label: "How long your month-end close takes now", required: false, options: ["4 working days or fewer", "5 to 7 working days", "8 to 10 working days", "More than 10 working days"] }
    ]
  },
  formSection: {
    head: "Free to attend, replay included",
    text: "Register once and you get the live link, the recording and the templates.",
    points: ["50 minutes, 11am GST", "Recording within 24 hours", "Editable templates included"]
  },
  final: { head: "Wednesday 9 December, 11am GST", sub: "742 people registered. Live questions are taken in order.", cta: "Register free" },
  footer: {
    tagline: "Tallyroom builds approval and reconciliation software for finance teams in the GCC.",
    address: "Office 1204, Al Fattan Currency House, DIFC, Dubai",
    phone: "+971 4 359 6620",
    email: "events@tallyroom.ae",
    legal: "Tallyroom Technologies Ltd, registered with the DIFC, no. 7731"
  }
};
