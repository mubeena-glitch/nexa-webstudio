module.exports = {
  file: '02-healthcare-bls-training.html',
  name: 'BLS certification course',
  industry: 'Healthcare', goal: 'Course Enrolment',
  desc: 'BLS Provider course for nurses and allied health staff in Dubai Healthcare City, with dates, fees and group rates.',
  title: 'BLS Provider course, Dubai Healthcare City | Kestrel',
  metaDesc: 'AHA BLS Provider course in Dubai Healthcare City. 4.5 hours, six learners per instructor, eCard the same day. From AED 450. December and January dates.',
  brand: 'Kestrel Resuscitation Centre',
  nav: ['Course dates', 'The day', 'Group bookings'],
  navCta: 'Book a seat',
  hero: {
    eyebrow: 'Dubai Healthcare City, Building 64',
    headline: 'BLS Provider, certified by 1.30pm',
    sub: 'The AHA BLS Provider course for nurses, doctors and allied health staff. Six learners per instructor, every skill tested on feedback manikins, eCard emailed before you leave.',
    cta: 'Book a seat', cta2: 'See all dates',
    note: '3,912 healthcare staff certified since March 2022'
  },
  trust: { label: 'Staff sent to us by', items: ['Al Jalila Children\'s Specialty Hospital', 'Mediclinic Parkview', 'Aster Clinics', 'Dubai Ambulance', 'NMC Royal Hospital'] },
  sections: [
    {
      type: 'pricelist', id: 'dates', head: 'Upcoming course dates',
      lede: 'All sessions run 8.30am to 1pm in our Healthcare City training room. Maximum 12 learners.',
      items: [
        { name: 'Saturday 28 November 2026', desc: 'BLS Provider, 4 seats left', price: 'AED 450' },
        { name: 'Wednesday 2 December 2026', desc: 'BLS Renewal, for current card holders, 7 seats left', price: 'AED 380' },
        { name: 'Saturday 12 December 2026', desc: 'BLS Provider, 9 seats left', price: 'AED 450' },
        { name: 'Tuesday 22 December 2026', desc: 'BLS Provider, evening session 4pm to 8.30pm', price: 'AED 450' },
        { name: 'Saturday 9 January 2027', desc: 'BLS Provider, 12 seats left', price: 'AED 450' },
        { name: 'HeartCode BLS, any weekday', desc: 'Online module plus a 50-minute skills test with us', price: 'AED 520' }
      ],
      note: 'Fees include the AHA eCard, the provider manual (digital) and refreshments. Prices include VAT.'
    },
    {
      type: 'steps', id: 'day', head: 'How the morning runs',
      lede: 'Most of the 4.5 hours is spent on the floor, not in a chair.',
      items: [
        { title: '8.30am: scene safety and adult CPR', text: 'Compressions on QCPR manikins that show your depth and rate live. You keep going until you hit 100 to 120 a minute at 5 to 6 cm.' },
        { title: '10am: AED, bag-mask and two-rescuer CPR', text: 'You run the AED and bag-mask in pairs, then switch roles. Every learner leads at least two scenarios.' },
        { title: '11.15am: child, infant and choking', text: 'Infant compressions, two-thumb technique and relief of choking for all ages.' },
        { title: '12.15pm: skills test and written exam', text: 'A 25-question exam (84% to pass) and a one-to-one skills test. Pass both and your eCard is issued before 1.30pm.' }
      ]
    },
    {
      type: 'stats', variant: 'ruled',
      items: [
        { v: '3,912', l: 'learners certified since March 2022' },
        { v: '96.4%', l: 'first-attempt pass rate in 2025' },
        { v: '1 to 6', l: 'instructor to learner ratio on skills stations' },
        { v: '2 years', l: 'eCard validity, accepted by DHA, DOH and MOHAP' }
      ],
      note: 'Pass rate from our 2025 course records, 1,147 learners.'
    },
    {
      type: 'features', variant: 'grid', id: 'groups', head: 'Booking for a ward, clinic or team',
      lede: 'Groups of six or more get their own date, at our centre or on your site.',
      items: [
        { icon: 'users', title: 'From AED 395 per head', text: 'Six to eleven learners. Twelve or more drops to AED 360.' },
        { icon: 'building', title: 'We come to you', text: 'On-site courses anywhere in Dubai, Sharjah or Abu Dhabi. We bring the manikins and AED trainers.' },
        { icon: 'calendar', title: 'Your date, your shift pattern', text: 'Early, late or split sessions so nobody leaves the floor short-staffed.' },
        { icon: 'receipt', title: 'One invoice', text: 'Single tax invoice to your HR or education team, with a learner roster and eCard codes.' },
        { icon: 'clipboard', title: 'Renewal tracking', text: 'We email you 60 days before each card expires, by learner.' },
        { icon: 'badge', title: 'CME hours', text: 'DHA CME points certificate available for each learner on request.' }
      ]
    },
    {
      type: 'faq', variant: 'aside', head: 'Questions we get every week',
      items: [
        { q: 'Is the card accepted for my DHA licence?', a: 'Yes. The AHA BLS Provider eCard is accepted by DHA, DOH and MOHAP for licensing and renewal.' },
        { q: 'My card expired last month. Can I take the renewal?', a: 'Renewal is for cards that are still valid or expired within 30 days. Past that, book the full BLS Provider course.' },
        { q: 'What if I fail the skills test?', a: 'You retest on the day with your instructor. If you still need time, you join a later date free within 60 days.' },
        { q: 'Can I reschedule?', a: 'Free up to 48 hours before your session. Inside 48 hours there is a AED 75 transfer fee.' },
        { q: 'Where do I park?', a: 'Paid parking at Building 64, AED 10 per hour, or Healthcare City metro station is a six-minute walk.' }
      ]
    }
  ],
  form: {
    title: 'Book your seat', sub: 'We confirm your seat and send joining details by email within two working hours.',
    cta: 'Reserve my seat', foot: 'Pay by card or bank transfer after we confirm. Free changes up to 48 hours before.',
    steps: 1,
    fields: [
      { type: 'text', name: 'full_name', label: 'Full name as it should appear on your eCard', required: true },
      { type: 'email', name: 'email', label: 'Email', required: true },
      { type: 'tel', name: 'mobile', label: 'Mobile', required: true },
      { type: 'select', name: 'session', label: 'Course date', required: true, options: ['Sat 28 Nov, BLS Provider', 'Wed 2 Dec, BLS Renewal', 'Sat 12 Dec, BLS Provider', 'Tue 22 Dec, BLS Provider evening', 'Sat 9 Jan, BLS Provider', 'HeartCode BLS skills test'] },
      { type: 'select', name: 'profession', label: 'Profession', required: true, options: ['Registered nurse', 'Physician', 'Dentist', 'Paramedic or EMT', 'Physiotherapist', 'Pharmacist', 'Other allied health'] },
      { type: 'select', name: 'licence', label: 'Licensing authority', required: false, options: ['DHA', 'DOH Abu Dhabi', 'MOHAP', 'Not licensed yet'] }
    ]
  },
  formSection: { head: 'Seats go fastest in December', text: 'Licence renewals cluster at year end. Book now and pick your date.', points: ['eCard the same day', 'Free retest within 60 days', 'Prices include VAT'] },
  final: { head: 'Four hours this month, two years covered', sub: 'Next course: Saturday 28 November, 8.30am. Four seats left.', cta: 'Book a seat' },
  footer: { tagline: 'Resuscitation training for healthcare teams in the UAE.', address: 'Building 64, Office 312, Dubai Healthcare City, Dubai', phone: '+971 4 362 9184', email: 'courses@kestrelresus.ae', hours: 'Office 8am to 5pm, Monday to Saturday', legal: 'DHCC licence 4417. Courses delivered through an authorised AHA International Training Centre.' }
};
