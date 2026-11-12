module.exports = {
  file: '44-healthcare-veterinary-appointment.html',
  name: 'Veterinary clinic, appointment booking',
  industry: 'Pet Care', goal: 'Appointment',
  desc: 'A neighbourhood vet in Umm Suqeim with three named vets, published prices and same-week appointments.',
  title: 'Vet in Umm Suqeim, book an appointment | Sandpiper Vets',
  metaDesc: 'Consultations from AED 285, annual vaccinations, dental care and travel paperwork for dogs and cats. Three vets, seven days. Book online.',
  brand: 'Sandpiper Veterinary Clinic',
  nav: ['Our vets', 'Prices', 'First visit'],
  navCta: 'Book an appointment',
  hero: {
    eyebrow: 'Umm Suqeim 2, open seven days',
    headline: 'A vet who has time to explain',
    sub: 'Thirty-minute consultations, not ten. Vaccinations, check-ups, dental care and travel paperwork for dogs, cats and rabbits, with prices on this page.',
    cta: 'Request an appointment',
    note: '4.9 on Google from 741 reviews'
  },
  trust: { label: 'Registered with', items: ['Dubai Municipality Veterinary Services', 'Fear Free Pets', 'International Cat Care', 'PetSure', 'Oyster Pet Insurance'] },
  sections: [
    {
      type: 'people', id: 'our-vets',
      head: 'The vets you will see',
      lede: 'We book you with the same vet each time where we can.',
      items: [
        { name: 'Dr Alia Bin Hendi', role: 'Clinical director, small animal medicine', bio: 'Qualified at the Royal Veterinary College in 2009. Special interest in feline kidney disease and senior pets.' },
        { name: 'Dr Tomasz Wieczorek', role: 'Veterinary surgeon, soft tissue and dentistry', bio: 'Runs our dental list on Tuesdays and Saturdays. Previously six years at a referral hospital in Kraków.' },
        { name: 'Dr Meera Pillai', role: 'Veterinary surgeon, dermatology', bio: 'Sees most of our itchy dogs. Holds a certificate in veterinary dermatology from ESAVS.' }
      ]
    },
    {
      type: 'quotes', variant: 'feature',
      head: 'From owners in Umm Suqeim and Al Safa',
      items: [
        { q: 'Biscuit is a 34 kilo rescue who used to shake in the car park. Dr Meera did the whole exam on the floor with him and a tub of cheese. He walked in on his own the second time.', name: 'Rachel Okonjo-Hart', role: 'Owner of Biscuit, saluki cross', source: 'Google review, September 2026' },
        { q: 'They wrote the full dental quote down before we agreed anything. Final bill was AED 40 under it.', name: 'Saif Al Nuaimi', role: 'Owner of Pasha, Persian cat', source: 'Google review, July 2026' },
        { q: 'Export paperwork for two cats to Toronto, done in one visit with a printed checklist.', name: 'Ingrid Solberg', role: 'Owner of Mylo and Frey', source: 'Google review, June 2026' }
      ]
    },
    {
      type: 'pricelist', id: 'prices',
      head: 'Prices',
      lede: 'What you pay, before anything is done. Medicines are priced separately and shown on your estimate.',
      items: [
        { name: 'Consultation, 30 minutes', price: 'AED 285' },
        { name: 'Annual dog vaccination', desc: 'DHPPi, leptospirosis and rabies, with a health check', price: 'AED 340' },
        { name: 'Annual cat vaccination', desc: 'Tricat and rabies, with a health check', price: 'AED 310' },
        { name: 'Microchip and Dubai Municipality registration', price: 'AED 165' },
        { name: 'Neutering, cat', desc: 'Day surgery, pain relief and a post-op check', price: 'From AED 790' },
        { name: 'Dental scale and polish', desc: 'General anaesthetic and dental X-rays included', price: 'From AED 1,450' },
        { name: 'Pet travel health certificate', desc: 'Paperwork for MOCCAE export permits', price: 'AED 420' }
      ],
      note: 'Prices include VAT. Out-of-hours appointments after 8pm add AED 180.'
    },
    {
      type: 'steps', id: 'first-visit',
      head: 'Your first visit',
      items: [
        { title: 'Send any old records', text: 'Forward vaccination cards or notes from your previous vet to records@sandpipervets.ae before you come.' },
        { title: 'Arrive five minutes early', text: 'Cats go straight into our cat-only waiting room. Dogs have the main room and the shaded yard.' },
        { title: 'Thirty minutes with your vet', text: 'A full nose-to-tail exam and time for your questions. Any treatment is quoted in writing first.' },
        { title: 'Reminders by WhatsApp', text: 'We message you a week before boosters and annual check-ups are due.' }
      ]
    },
    {
      type: 'faq', variant: 'aside',
      head: 'Common questions',
      items: [
        { q: 'Do you see emergencies?', a: 'We keep two urgent slots open every day until 8pm. After that, call us and we will direct you to the nearest 24 hour hospital.' },
        { q: 'Do you take pet insurance?', a: 'We claim directly from PetSure and Oyster. For other insurers we give you the paperwork to claim yourself.' },
        { q: 'Can I get a home visit?', a: 'Yes, for vaccinations and end-of-life care within Jumeirah, Umm Suqeim and Al Barsha. Home visits start at AED 495.' },
        { q: 'Which animals do you treat?', a: 'Dogs, cats, rabbits and guinea pigs. For birds and reptiles we refer to a specialist colleague in Al Quoz.' }
      ]
    }
  ],
  form: {
    title: 'Request an appointment',
    sub: 'We call or WhatsApp you within an hour to confirm a time.',
    cta: 'Request appointment',
    foot: 'For an emergency, call +971 4 395 6721 instead of using this form.',
    steps: 1,
    fields: [
      { type: 'text', name: 'owner_name', label: 'Your name', required: true },
      { type: 'tel', name: 'mobile', label: 'Mobile', required: true },
      { type: 'text', name: 'pet_name', label: 'Pet name and breed', required: true },
      { type: 'select', name: 'species', label: 'Species', required: true, options: ['Dog', 'Cat', 'Rabbit', 'Guinea pig'] },
      { type: 'select', name: 'reason', label: 'Reason for visit', required: true, options: ['Vaccination', 'General check-up', 'Unwell or injured', 'Skin or ears', 'Dental', 'Travel paperwork', 'Neutering consultation'] },
      { type: 'date', name: 'preferred_date', label: 'Preferred date' }
    ]
  },
  formSection: { head: 'Book a calmer vet visit', text: 'Tell us who is coming in and why. We match you with the right vet and a time that suits.', points: ['Same-week appointments', 'Written estimate before treatment', 'Separate cat waiting room'] },
  final: { head: 'Booster due, or something not right?', sub: 'Most appointments are within three days.', cta: 'Request an appointment' },
  footer: {
    tagline: 'A neighbourhood vet for dogs, cats and rabbits in Umm Suqeim.',
    address: 'Villa 18, Al Wasl Road, Umm Suqeim 2, Dubai',
    phone: '+971 4 395 6721',
    email: 'hello@sandpipervets.ae',
    hours: 'Saturday to Thursday 8am to 8pm, Friday 2pm to 8pm',
    legal: 'Licensed by Dubai Municipality, veterinary clinic licence VC-2214'
  }
};
