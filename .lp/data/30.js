module.exports = {
  file: "30-insurance-quote-leadgen.html",
  name: "Car insurance broker, two-step quote",
  industry: "Insurance", goal: "Get a Quote",
  desc: "UAE car insurance broker comparing 11 insurers. Two-step quote form, agency and garage repair options, renewal help.",
  title: "Compare car insurance in the UAE | Rayah Motor Brokers",
  metaDesc: "Compare comprehensive and third-party car insurance from 11 UAE insurers. Quotes on WhatsApp within 30 minutes. Licensed by the Central Bank of the UAE.",
  brand: "Rayah Motor Brokers",
  nav: ["How it works", "Example prices", "Questions"],
  navCta: "Get a quote",
  hero: {
    eyebrow: "Car insurance broker · Licensed in the UAE",
    headline: "Eleven insurers compared, one quote on WhatsApp",
    sub: "Tell us your car and your licence age. A broker sends the three best prices within 30 minutes, with agency repair and roadside cover spelled out line by line.",
    cta: "Get my quote",
    note: "Renewing in December? Members saved AED 612 on average in 2026."
  },
  trust: { label: "Quotes from insurers including", items: ["Sakina Insurance", "Eastgate Insurance", "Tokio Marine", "RSA", "Watania Takaful", "Gulfshield"] },
  sections: [
    {
      type: "steps", id: "how-it-works",
      head: "How it works",
      items: [
        { title: "Two short steps", text: "Your car first, then your details. About 90 seconds." },
        { title: "We compare 11 insurers", text: "A broker checks prices and the small print: excess, agency repair, rent-a-car and Oman cover." },
        { title: "Three options on WhatsApp", text: "Within 30 minutes between 8am and 8pm. Each with the excess and what is not covered." },
        { title: "Pay and drive", text: "Pay by card or Apple Pay. Your policy reaches RTA or ITC the same day for registration." }
      ]
    },
    {
      type: "compare",
      head: "Agency repair or garage repair?",
      cols: ["", "Agency repair", "Garage repair"],
      rows: [
        ["Who fixes the car", "The brand's authorised dealer", "An approved independent garage"],
        ["Parts", "Original manufacturer parts", "Original or equivalent parts"],
        ["Usually available for", "Cars up to 3 to 5 years old", "Any age"],
        ["Typical price difference", "18% to 35% more", "Base price"],
        ["Best for", "New cars and cars on finance", "Older cars and second cars"]
      ]
    },
    {
      type: "pricelist", id: "example-prices",
      head: "Example comprehensive prices, November 2026",
      lede: "Real quotes from this month for drivers over 30 with no claims in 3 years, Dubai registered.",
      items: [
        { name: "Kaito Civa 2023, value AED 61,000", desc: "Garage repair, AED 500 excess.", price: "AED 1,486 / year" },
        { name: "Nissan Patrol 2022, value AED 189,000", desc: "Agency repair, AED 1,000 excess.", price: "AED 4,320 / year" },
        { name: "Tesla Model 3 2024, value AED 142,000", desc: "Agency repair, AED 750 excess.", price: "AED 3,975 / year" },
        { name: "Kia Sportage 2019, value AED 38,500", desc: "Garage repair, AED 350 excess.", price: "AED 1,212 / year" },
        { name: "Third-party only, saloon", desc: "Any make, under 4 cylinders.", price: "From AED 702 / year" }
      ],
      note: "Your price depends on driver age, claims history and emirate. All prices include VAT."
    },
    {
      type: "features", variant: "grid",
      head: "What a broker does that a comparison site does not",
      items: [
        { icon: "phone", title: "A named broker", text: "The same person handles your quote, your renewal and your claim." },
        { icon: "clipboard", title: "Claims help", text: "We chase the insurer and the garage for you. Average claim closed in 12 days in 2026." },
        { icon: "calendar", title: "Renewal reminders", text: "We requote 30 days before renewal so you never roll over on a higher price." },
        { icon: "map", title: "Oman cover checked", text: "We confirm whether Oman driving is included before you buy, not after." },
        { icon: "car", title: "Rent-a-car terms", text: "Days and daily limit stated on every quote, so you know what you get if the car is in the garage." },
        { icon: "shield", title: "No broker fee", text: "Insurers pay our commission. Your price is the same as going direct, often lower." }
      ]
    },
    {
      type: "notice",
      head: "Buying a car this month?",
      text: "We can issue cover the same day for new registrations. Send the vehicle chassis number and the dealer's invoice with your quote request."
    },
    {
      type: "faq", variant: "stack", id: "questions",
      head: "Questions",
      items: [
        { q: "Do you charge a fee?", a: "No. We are paid a commission by the insurer you choose. It does not change your premium." },
        { q: "I have a claim in the last year. Can I still get cover?", a: "Yes. Expect a higher price for 12 months. We will tell you which insurers treat claims most fairly." },
        { q: "My licence is less than a year old.", a: "Several insurers cover new drivers, usually with a higher excess. Choose that option in step two." },
        { q: "Can I keep my no-claims discount?", a: "Yes. Bring a no-claims letter from your current insurer, or a home-country letter less than 12 months old." },
        { q: "Are you licensed?", a: "Yes. Rayah Motor Brokers is licensed by the Central Bank of the UAE, licence number 236." }
      ]
    }
  ],
  form: {
    title: "Get your car insurance quote",
    sub: "Two steps, about 90 seconds. Three quotes on WhatsApp within 30 minutes.",
    cta: "Send my quote request",
    foot: "No fee, no obligation. We only contact you about this quote.",
    steps: 2,
    fields: [
      { type: "text", name: "make_model", label: "Car make, model and year", required: true, step: 1 },
      { type: "number", name: "car_value", label: "Estimated car value (AED)", required: true, step: 1 },
      { type: "select", name: "cover", label: "Cover", required: true, options: ["Comprehensive, agency repair", "Comprehensive, garage repair", "Third-party only", "Not sure, show me both"], step: 1 },
      { type: "select", name: "licence_age", label: "How long you have held a UAE licence", required: true, options: ["Less than 1 year", "1 to 2 years", "2 to 5 years", "More than 5 years"], step: 2 },
      { type: "text", name: "full_name", label: "Full name", required: true, step: 2 },
      { type: "tel", name: "mobile", label: "Mobile for WhatsApp", required: true, step: 2 }
    ]
  },
  formSection: {
    head: "Three prices, small print included",
    text: "Each quote shows the excess, repair type, rent-a-car days and Oman cover so you can compare like for like.",
    points: ["11 insurers compared", "Reply within 30 minutes", "No broker fee"]
  },
  final: { head: "Renewal coming up?", sub: "Get a quote 30 days before and avoid the automatic roll-over price.", cta: "Get my quote" },
  footer: {
    tagline: "Rayah Motor Brokers compares car insurance from 11 UAE insurers.",
    address: "Office 1203, Al Moosa Tower 2, Sheikh Zayed Road, Dubai",
    phone: "+971 4 357 9064",
    email: "quotes@rayahbrokers.ae",
    hours: "Sunday to Friday, 8am to 8pm",
    legal: "Licensed by the Central Bank of the UAE, broker licence 236"
  }
};
