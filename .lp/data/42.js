module.exports = {
  file: '42-realestate-coworking-tour.html',
  name: 'Coworking and private offices, tour booking',
  industry: 'Real Estate', goal: 'Tour Booking',
  desc: 'A converted Al Quoz warehouse with hot desks, dedicated desks and private offices on monthly terms. Book a tour.',
  title: 'Coworking and private offices in Al Quoz | Yard Eight',
  metaDesc: 'Hot desks from AED 1,150 a month and private offices for 2 to 14 people in Al Quoz 1. Monthly terms, free parking. Book a 20-minute tour.',
  brand: 'Yard Eight',
  nav: ['Memberships', 'Included', 'Members'],
  navCta: 'Book a tour',
  hero: {
    eyebrow: 'Al Quoz 1, behind Alserkal Avenue',
    headline: 'A desk in a warehouse that actually feels like work',
    sub: 'Hot desks, dedicated desks and 19 private offices in a converted 1990s warehouse. Monthly terms, 74 free parking bays and coffee from the roaster next door.',
    cta: 'Book a tour',
    cta2: 'See membership prices',
    note: '4.8 on Google from 327 reviews',
    img: 'photo-1497366754035-f200968a6e72', imgAlt: 'The main floor at Yard Eight with long desks, plants and daylight from the roof'
  },
  trust: { label: 'Members include teams from', items: ['Saffron Lane Studio', 'Kite & Keel Media', 'Hadeel Architects', 'Tarteeb Accounting', 'Northpaw Pet Supplies'] },
  sections: [
    {
      type: 'pricelist', id: 'memberships',
      head: 'Membership prices',
      lede: 'All prices are monthly and include DEWA, wifi, cleaning and coffee. Thirty days notice to leave.',
      items: [
        { name: 'Day pass', desc: '8am to 8pm, any open desk, two hours of meeting room', price: 'AED 95' },
        { name: 'Flex 10', desc: 'Any 10 days a month on the open floor', price: 'AED 690' },
        { name: 'Hot desk', desc: 'Unlimited weekday access, 4 meeting room hours', price: 'AED 1,150' },
        { name: 'Dedicated desk', desc: 'Your own desk and locker, 24 hour access, 8 meeting room hours', price: 'AED 1,650' },
        { name: 'Private office, 2 to 4 people', desc: 'Lockable, furnished, natural light, 12 meeting room hours', price: 'From AED 4,300' },
        { name: 'Private office, 6 to 14 people', desc: 'Corner and mezzanine suites with their own meeting table', price: 'From AED 9,850' }
      ],
      note: 'Prices exclude 5% VAT. Registered office address for your trade licence available from AED 3,200 a year.'
    },
    {
      type: 'checklist', id: 'included',
      head: 'What every membership includes',
      text: 'No setup fee and no service charge added on the first invoice.',
      items: [
        '1 Gbps fibre on its own business line, plus ethernet at every dedicated desk',
        'Free parking in our own yard, with 6 EV charging points',
        'Specialty coffee, filtered water and fruit on weekdays',
        'Mail and parcel handling at reception',
        'Two phone booths per floor and a podcast room',
        'Printing up to 200 pages a month',
        'Member events every second Wednesday'
      ]
    },
    {
      type: 'gallery',
      head: 'Inside the building',
      imgs: [
        { img: 'photo-1556761175-5973dc0f32e7', alt: 'A team from a private office meeting around a table on the mezzanine' },
        { img: 'photo-1495474472287-4d71bcdd2085', alt: 'A flat white from the coffee bar on the ground floor' },
        { img: 'photo-1485955900006-10f4d324d411', alt: 'The quiet corner with potted plants under the skylight' }
      ]
    },
    {
      type: 'steps',
      head: 'How a tour works',
      items: [
        { title: 'Pick a time', text: 'Tours run every 30 minutes from 9am to 5:30pm, Monday to Saturday. Pick one in the form.' },
        { title: 'Twenty minutes with our community team', text: 'Lina Saab or Omar Qureshi shows you the desks and offices free for your team size and the date you want to start.' },
        { title: 'Stay and work', text: 'Every tour includes a free day pass, so you can test the wifi and the noise level yourself.' },
        { title: 'Hold an office for 72 hours', text: 'If a private office suits you, we hold it without a deposit while you decide.' }
      ]
    },
    {
      type: 'quotes', variant: 'single', id: 'members',
      items: [
        { q: 'We moved from two hot desks to the four-person office by the yard door in March. Parking for clients was the reason we came, the coffee is the reason the team comes in on Thursdays.', name: 'Farida Al Shamsi', role: 'Founder, Saffron Lane Studio', source: 'Google review, August 2026' }
      ]
    },
    {
      type: 'faq', variant: 'stack',
      head: 'Before you visit',
      items: [
        { q: 'How do I find you?', a: 'Warehouse 41 on Street 8A, Al Quoz Industrial Area 1. Turn in at the green gate. Parking is in our own yard, so no tickets.' },
        { q: 'Can we use the address on our trade licence?', a: 'Yes. Dedicated desk and private office members can register their licence here with Dubai Economy and Tourism. We provide the Ejari support documents.' },
        { q: 'What is the minimum term?', a: 'One month. Pay the first month and a deposit equal to one month, then leave with 30 days notice. Six month terms get 8% off.' },
        { q: 'Can I bring my dog?', a: 'Well-behaved dogs are welcome on the ground floor on Fridays. Not upstairs, and not in meeting rooms.' },
        { q: 'Is it noisy?', a: 'The open floor has acoustic panels and a quiet zone with a no-calls rule. Calls go in the booths or the yard.' }
      ]
    }
  ],
  form: {
    title: 'Book a 20-minute tour',
    sub: 'We confirm by WhatsApp within an hour during opening times.',
    cta: 'Book my tour',
    foot: 'Your details are used to arrange the tour only. No newsletters unless you ask.',
    steps: 1,
    fields: [
      { type: 'text', name: 'full_name', label: 'Full name', required: true },
      { type: 'tel', name: 'mobile', label: 'Mobile', required: true },
      { type: 'email', name: 'email', label: 'Email', required: true },
      { type: 'select', name: 'team_size', label: 'Team size', required: true, options: ['Just me', '2 to 4', '5 to 9', '10 to 14'] },
      { type: 'select', name: 'interest', label: 'Interested in', options: ['Hot desk', 'Dedicated desk', 'Private office', 'Registered address only', 'Not sure yet'] },
      { type: 'date', name: 'tour_date', label: 'Preferred tour date', required: true }
    ]
  },
  formSection: { head: 'See the space before you sign', text: 'Walk the floor, try a desk for the day, and see which offices are free for your start date.', points: ['Free day pass with every tour', 'Offices held for 72 hours, no deposit', 'Monthly terms from the first day'] },
  final: { head: 'Come and work here for a day', sub: 'Book a tour and the day pass is on us.', cta: 'Book a tour' },
  footer: {
    tagline: 'Coworking and private offices in a converted Al Quoz warehouse.',
    address: 'Warehouse 41, Street 8A, Al Quoz Industrial Area 1, Dubai',
    phone: '+971 4 347 2085',
    email: 'tours@yardeight.ae',
    hours: 'Reception Monday to Saturday, 8am to 7pm. Members 24 hours.',
    legal: 'Yard Eight Business Centre LLC, DET licence 1087342'
  }
};
