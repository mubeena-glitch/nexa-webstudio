module.exports = {
  file: "17-legal-consultation.html",
  name: "Employment and family law consultation",
  industry: "Legal", goal: "Consultation",
  desc: "Business Bay law firm offering a fixed-fee first consultation in UAE employment and family law with named lawyers.",
  title: "Employment and family lawyers in Dubai | Mansour Gallagher",
  metaDesc: "A 60-minute first consultation with a senior UAE employment or family lawyer for a fixed AED 1,250, with a written summary of your options within three working days.",
  brand: "Mansour Gallagher Advocates",
  nav: ["What we handle", "How it works", "Lawyers", "Fees"],
  navCta: "Book a consultation",
  hero: {
    eyebrow: "Employment and family law, Business Bay",
    headline: "Know where you stand before you sign or reply",
    sub: "A 60-minute consultation with a senior lawyer, in English or Arabic, for a fixed AED 1,250. You get a written summary of your options within three working days.",
    cta: "Book a consultation",
    note: "Licensed by the Dubai Legal Affairs Department"
  },
  sections: [
    {
      type: "features", variant: "aside", id: "what-we-handle",
      head: "What people usually come to us with",
      items: [
        { icon: "briefcase", title: "Termination and end of service", text: "Unpaid gratuity, notice disputes, arbitrary dismissal claims and MOHRE complaints." },
        { icon: "doc", title: "Settlement agreements and non-competes", text: "Reviewing what your employer has offered before you sign, and what is enforceable under the 2021 Labour Law." },
        { icon: "home", title: "Divorce and custody", text: "Non-Muslim divorce under Federal Decree-Law 41 of 2022, and custody and maintenance for Muslim families under personal status law." },
        { icon: "scale", title: "Wills and guardianship", text: "DIFC wills and Abu Dhabi non-Muslim wills, including guardianship for children under 21." }
      ]
    },
    {
      type: "steps", id: "how-it-works",
      head: "How the first consultation works",
      items: [
        { title: "Tell us the matter", text: "Fill in the form. We run a conflict check the same working day and confirm which lawyer will see you." },
        { title: "Send your documents", text: "Contract, termination letter, court papers or messages. Your lawyer reads them before the meeting, not during it." },
        { title: "Meet for 60 minutes", text: "In our Business Bay office or by video. We explain your position, the likely outcomes and the realistic costs." },
        { title: "Get it in writing", text: "A written summary of your options and next steps arrives within three working days. What you do next is up to you." }
      ]
    },
    {
      type: "people", id: "lawyers",
      head: "Who you will speak to",
      items: [
        { name: "Leila Mansour", role: "Founding partner, family law", bio: "Emirati-qualified advocate with rights of audience before Dubai courts. Has handled more than 400 custody and divorce matters since 2009." },
        { name: "Fiona Gallagher", role: "Partner, employment law", bio: "Solicitor of England and Wales, in Dubai since 2012. Advises senior employees on exits, bonuses and non-compete clauses." },
        { name: "Rashid Al Ketbi", role: "Senior associate, employment disputes", bio: "Represents employees at MOHRE and the Dubai Labour Court. Handles hearings in Arabic." }
      ]
    },
    {
      type: "pricelist", id: "fees",
      head: "Fixed fees",
      lede: "We quote a fixed fee before any work starts. Prices exclude 5% VAT.",
      items: [
        { name: "First consultation", desc: "60 minutes plus written summary", price: "AED 1,250" },
        { name: "Settlement agreement review", desc: "Written advice within five working days", price: "AED 3,400" },
        { name: "MOHRE complaint, preparation and filing", desc: "Up to two mediation sessions", price: "AED 6,750" },
        { name: "Uncontested divorce, non-Muslim", desc: "Drafting and court filing, excluding court fees", price: "AED 14,500" },
        { name: "DIFC will, single", desc: "Including registration appointment", price: "AED 7,850" }
      ],
      note: "If you instruct us within 30 days of your consultation, the AED 1,250 is deducted from your first invoice."
    },
    {
      type: "faq", variant: "aside",
      head: "Questions before booking",
      items: [
        { q: "Is the consultation confidential?", a: "Yes. Everything you share is confidential from the moment you contact us, whether or not you instruct us afterwards." },
        { q: "My employer is a big company. Does that matter?", a: "We run a conflict check before confirming. If we act for your employer, we tell you the same day and suggest another firm." },
        { q: "How quickly can I be seen?", a: "Usually within four working days. Termination matters with a deadline are seen within 48 hours." },
        { q: "Can I bring my spouse or a family member?", a: "Yes, one person can join you. For family matters we will not meet both spouses together." },
        { q: "Do you take cases on a no-win, no-fee basis?", a: "No. UAE rules limit contingency fees, and we prefer you know the full cost upfront." }
      ]
    }
  ],
  form: {
    title: "Book a first consultation",
    sub: "We reply within one working day to confirm your lawyer and time.",
    cta: "Request a consultation",
    foot: "Confidential from the first message. Payment is taken only once your time is confirmed.",
    steps: 1,
    fields: [
      { type: "text", name: "full_name", label: "Full name", required: true },
      { type: "email", name: "email", label: "Email", required: true },
      { type: "tel", name: "phone", label: "Mobile", required: true },
      { type: "select", name: "matter", label: "Type of matter", required: true, options: ["Termination or end of service", "Settlement agreement review", "Divorce or separation", "Child custody or maintenance", "Will or guardianship", "Something else"] },
      { type: "select", name: "meeting", label: "How you would like to meet", required: true, options: ["In person, Business Bay", "Video call", "Phone"] },
      { type: "textarea", name: "summary", label: "A few lines about the situation and any deadline", required: false, rows: 3 }
    ]
  },
  formSection: {
    head: "One fixed fee, one clear answer",
    text: "Most people leave the first meeting knowing whether they have a case and what it will cost.",
    points: ["AED 1,250, fixed", "Written summary in three working days", "English or Arabic"]
  },
  final: { head: "Got a letter with a deadline?", sub: "Tell us the date in the form and we will see you within 48 hours.", cta: "Book a consultation" },
  footer: {
    tagline: "Employment and family lawyers for people living and working in the UAE.",
    address: "Office 2608, Bay Square Building 11, Business Bay, Dubai",
    phone: "+971 4 382 6091",
    email: "consult@mansourgallagher.ae",
    hours: "Monday to Friday 8:30am to 5:30pm",
    legal: "Mansour Gallagher Advocates and Legal Consultants, Legal Affairs Department licence 1384"
  }
};
