module.exports = {
  file: "26-dental-clinic-appointment.html",
  name: "General dental clinic, same-week appointments",
  industry: "Dental", goal: "Appointment",
  desc: "General dental clinic in Al Barsha with published prices, same-week appointments and direct insurance billing.",
  title: "Dentist in Al Barsha, same-week appointments | Saffa Dental",
  metaDesc: "Check-up and clean for AED 395, fillings from AED 480. Same-week appointments at Saffa Dental, Al Barsha 1. Direct billing with 14 insurers.",
  brand: "Saffa Dental",
  nav: ["Prices", "Dentists", "Insurance"],
  navCta: "Book an appointment",
  hero: {
    eyebrow: "Al Barsha 1, Dubai · Open 7 days",
    headline: "A dentist this week, and the price before you sit down",
    sub: "Check-ups, fillings, root canals and cleans at prices we publish. Most patients are seen within 4 days of booking. We bill your insurer directly.",
    cta: "Request an appointment",
    note: "4.8 on Google from 1,027 reviews"
  },
  trust: { label: "Direct billing with", items: ["Sahara Health", "Harbourline", "Northgate Health", "Lifespring", "Crestline", "Sakina Insurance"] },
  sections: [
    {
      type: "features", variant: "aside",
      head: "Why people switch to us",
      items: [
        { icon: "calendar", title: "Seen within days", text: "Our average wait for a routine appointment in October 2026 was 3.6 days. Emergencies are seen the same day." },
        { icon: "receipt", title: "A written quote first", text: "Before any treatment beyond a check-up, you get the cost in writing and what your insurer will cover." },
        { icon: "smile", title: "Gentle by default", text: "Numbing gel before every injection, a pause signal you agree in advance, and no lecture about flossing." },
        { icon: "clock", title: "Evenings and Saturdays", text: "Open until 9pm Sunday to Thursday and 10am to 6pm on Fridays and Saturdays." }
      ]
    },
    {
      type: "pricelist", id: "prices",
      head: "Prices",
      lede: "Self-pay prices, including VAT. Insured patients pay their policy co-pay only.",
      items: [
        { name: "New patient check-up, X-rays and clean", desc: "45 minutes with a dentist and hygienist.", price: "AED 395" },
        { name: "Emergency appointment", desc: "Pain relief and a treatment plan.", price: "AED 290" },
        { name: "Tooth-coloured filling", desc: "Per tooth, depending on size.", price: "AED 480 to 720" },
        { name: "Root canal treatment, front tooth", desc: "Usually completed in one visit.", price: "AED 2,150" },
        { name: "Root canal treatment, molar", desc: "Usually two visits.", price: "AED 3,380" },
        { name: "Hygienist clean and polish", desc: "30 minutes, for existing patients.", price: "AED 340" }
      ],
      note: "Crowns, implants and whitening are quoted after an exam. Prices valid until 31 March 2027."
    },
    {
      type: "people", id: "dentists",
      head: "Your dentists",
      items: [
        { name: "Dr Noor Al Khatib", role: "General dentist, clinical lead", bio: "Trained at the University of Sharjah and King's College London. 12 years in practice. DHA licensed." },
        { name: "Dr Aidan Ferreira", role: "General dentist, root canals", bio: "Does most of the clinic's root canal work. Previously at a hospital dental department in Lisbon." },
        { name: "Grace Ocampo", role: "Dental hygienist", bio: "Nine years as a hygienist. Patients with dental anxiety often ask for her by name." }
      ]
    },
    {
      type: "stats", variant: "inline", id: "insurance",
      head: "Insurance",
      text: "We bill 14 insurers directly and check your cover before your visit, so you know your co-pay in advance.",
      items: [
        { v: "14", l: "insurers billed directly" },
        { v: "3.6 days", l: "average wait, October 2026" },
        { v: "8,914", l: "patients seen since we opened in 2022" }
      ]
    },
    {
      type: "faq", variant: "stack",
      head: "Questions",
      items: [
        { q: "Is my insurance accepted?", a: "Choose your insurer on the form. If it is not on our direct billing list, we give you the paperwork to claim back." },
        { q: "I have not been to a dentist in years. Will I be judged?", a: "No. About a third of our new patients have not seen a dentist in over five years." },
        { q: "Do you treat children?", a: "Yes, from age 4. Children's check-ups are AED 250 self-pay." },
        { q: "Where do I park?", a: "Free visitor parking behind the building, entrance from 25th Street. Mall of the Emirates metro is a 9-minute walk." }
      ]
    }
  ],
  form: {
    title: "Request an appointment",
    sub: "Our front desk calls you back within 2 hours during opening times to confirm a slot.",
    cta: "Request appointment",
    foot: "Your details are only used to arrange your appointment.",
    steps: 1,
    fields: [
      { type: "text", name: "full_name", label: "Full name", required: true },
      { type: "tel", name: "phone", label: "Mobile", required: true },
      { type: "select", name: "reason", label: "Reason for visit", required: true, options: ["Check-up and clean", "Toothache or emergency", "Filling", "Root canal", "Broken or chipped tooth", "Something else"] },
      { type: "select", name: "insurer", label: "Insurer", options: ["Sahara Health", "Harbourline", "Northgate Health", "Lifespring", "Crestline", "Sakina Insurance", "Another insurer", "Paying myself"] },
      { type: "select", name: "preferred_time", label: "Preferred time", options: ["Weekday morning", "Weekday afternoon", "Weekday evening, after 6pm", "Friday or Saturday"] }
    ]
  },
  formSection: {
    head: "Most patients are seen within 4 days",
    text: "Tell us what is going on and when suits you. We confirm a time and check your insurance before you arrive.",
    points: ["Same-day emergency slots", "Prices published", "Direct insurance billing"]
  },
  final: { head: "Toothache today? Call us", sub: "We keep 3 emergency slots open every day.", cta: "Request an appointment" },
  footer: {
    tagline: "Saffa Dental is a general dental clinic in Al Barsha 1.",
    address: "Ground floor, Al Shafar Building 3, 25th Street, Al Barsha 1, Dubai",
    phone: "+971 4 341 7720",
    email: "frontdesk@saffadental.ae",
    hours: "Sunday to Thursday, 9am to 9pm. Friday and Saturday, 10am to 6pm",
    legal: "DHA facility licence 8840165"
  }
};
