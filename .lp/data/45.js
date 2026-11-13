module.exports = {
  file: '45-homeservices-callout-booking.html',
  name: 'Emergency plumber and electrician callout',
  industry: 'Home Services', goal: 'Booking',
  desc: 'Emergency plumbing and electrical callouts across Dubai with a 60-minute response and a fixed AED 149 callout fee.',
  title: 'Emergency plumber and electrician in Dubai | Tapline',
  metaDesc: 'Leak, blackout or blocked drain? A Tapline technician at your door within 60 minutes, AED 149 callout including diagnosis. 24 hours, every day.',
  brand: 'Tapline',
  nav: ['What we fix', 'Reviews', 'Prices'],
  navCta: 'Book a callout',
  hero: {
    eyebrow: '24 hours, 7 days, across Dubai',
    headline: 'Water on the floor? A technician in 60 minutes.',
    sub: 'Plumbing and electrical emergencies, fixed by DEWA-approved technicians. AED 149 callout covers the visit and diagnosis, and you approve the price before any work starts.',
    cta: 'Book a callout now',
    cta2: 'Or call +971 4 386 5530',
    note: 'Average arrival time in October 2026: 47 minutes'
  },
  trust: { label: 'Approved contractor for', items: ['Ellington Properties', 'Driven Properties', 'Bluestone Facilities', 'Allsopp & Allsopp Lettings'] },
  sections: [
    {
      type: 'notice',
      head: 'Late by more than 60 minutes? The callout is free.',
      text: 'Applies to bookings in our core zones: Marina, JLT, JVC, Al Barsha, Downtown, Business Bay, Jumeirah and Al Quoz. Further out, we give you an arrival time on the phone and stick to it.'
    },
    {
      type: 'features', variant: 'grid', id: 'what-we-fix',
      head: 'What we come out for',
      items: [
        { icon: 'drop', title: 'Burst and leaking pipes', text: 'Isolation, repair or replacement of copper, PPR and flexible hoses.' },
        { icon: 'wrench', title: 'Blocked drains and toilets', text: 'Hand rodding and electric drain machines on every van.' },
        { icon: 'flame', title: 'Water heaters', text: 'No hot water, tripping or leaking heaters. Ariston and Racold parts carried.' },
        { icon: 'bolt', title: 'Power cuts and tripping', text: 'Fault finding on breakers, RCDs and overloaded circuits.' },
        { icon: 'plug', title: 'Sockets and burning smells', text: 'Scorched sockets, loose connections and isolators made safe the same visit.' },
        { icon: 'sun', title: 'AC water leaks', text: 'Blocked condensate lines and overflowing drip trays cleared.' }
      ]
    },
    {
      type: 'quotes', variant: 'pair', id: 'reviews',
      head: 'From people who called us at a bad time',
      items: [
        { q: 'Water heater burst in the loft at 11:40pm. Technician was here at 12:25, isolated it, and had a new 80 litre unit fitted by 2am. Price was what he quoted at the door.', name: 'Callum Fairweather', role: 'Villa owner, Arabian Ranches 2', source: 'Google review, October 2026' },
        { q: 'Half the apartment lost power on a Friday. Found a failed RCD in 20 minutes, replaced it, showed me the old one. AED 149 plus AED 210 for the part and labour.', name: 'Nadine Haddad', role: 'Tenant, Jumeirah Lake Towers', source: 'Google review, September 2026' }
      ]
    },
    {
      type: 'pricelist', id: 'prices',
      head: 'Fixed prices for common jobs',
      lede: 'Callout fee is added once per visit. Parts at the price on the box, shown to you before fitting.',
      items: [
        { name: 'Callout and diagnosis, up to 30 minutes', price: 'AED 149' },
        { name: 'Unblock toilet or basin', price: 'AED 185' },
        { name: 'Unblock kitchen or floor drain with machine', price: 'AED 275' },
        { name: 'Replace mixer tap, labour only', price: 'AED 160' },
        { name: 'Replace water heater, up to 100 litres, labour only', price: 'AED 340' },
        { name: 'Replace faulty breaker or RCD, labour only', price: 'AED 210' },
        { name: 'Extra labour, per 30 minutes after the first', price: 'AED 95' }
      ],
      note: 'Prices include VAT. Between 10pm and 6am the callout fee is AED 219.'
    },
    {
      type: 'stats', variant: 'ruled',
      items: [
        { v: '47 min', l: 'average arrival, October 2026' },
        { v: '3,186', l: 'callouts attended in the last 12 months' },
        { v: '91%', l: 'fixed on the first visit' },
        { v: '90 days', l: 'guarantee on labour' }
      ]
    },
    {
      type: 'faq', variant: 'stack',
      head: 'Before we arrive',
      items: [
        { q: 'What does the AED 149 cover?', a: 'The visit, up to 30 minutes on site and a written diagnosis. If we fix it within that time, you pay for parts only.' },
        { q: 'What should I do while I wait?', a: 'For leaks, turn off the main stopcock, usually under the kitchen sink or by the water meter. For electrical faults, switch off the main breaker and do not touch wet sockets.' },
        { q: 'Do you work for tenants?', a: 'Yes. We send the invoice and photos in a format most landlords and property managers accept for reimbursement.' },
        { q: 'How do I pay?', a: 'Card, Apple Pay or bank transfer on completion. No cash needed.' },
        { q: 'Are your technicians qualified?', a: 'Every electrician is DEWA approved, and every plumber has at least five years of residential experience in the UAE.' }
      ]
    }
  ],
  form: {
    title: 'Book an emergency callout',
    sub: 'We call you back within 4 minutes with an arrival time.',
    cta: 'Send a technician',
    foot: 'If water is near electrics, call us on +971 4 386 5530 now.',
    steps: 1,
    fields: [
      { type: 'text', name: 'name', label: 'Name', required: true },
      { type: 'tel', name: 'mobile', label: 'Mobile', required: true },
      { type: 'select', name: 'area', label: 'Area', required: true, options: ['Dubai Marina or JBR', 'JLT', 'JVC or JVT', 'Al Barsha', 'Downtown or Business Bay', 'Jumeirah or Umm Suqeim', 'Al Quoz', 'Arabian Ranches or Dubai Hills', 'Other'] },
      { type: 'select', name: 'problem', label: 'Problem', required: true, options: ['Leak or burst pipe', 'Blocked drain or toilet', 'No hot water', 'Power cut or tripping', 'Burning smell or sparking', 'AC dripping water', 'Something else'] },
      { type: 'textarea', name: 'details', label: 'Building, unit and anything we should know', rows: 3 }
    ]
  },
  formSection: { head: 'Tell us what has gone wrong', text: 'The nearest free van is dispatched as soon as we confirm the address.', points: ['AED 149 callout, agreed up front', 'Free if we are over 60 minutes', '90-day labour guarantee'] },
  final: { head: 'Something leaking or sparking right now?', sub: 'A technician can be on the way in minutes.', cta: 'Book a callout' },
  footer: {
    tagline: 'Emergency plumbing and electrical callouts across Dubai, day and night.',
    address: 'Warehouse 7, Street 19, Al Quoz Industrial Area 3, Dubai',
    phone: '+971 4 386 5530',
    email: 'help@tapline.ae',
    hours: 'Open 24 hours, every day including public holidays',
    legal: 'Tapline Technical Services LLC, DET licence 1123906'
  }
};
