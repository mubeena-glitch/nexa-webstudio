module.exports = {
  file: '04-education-school-admissions.html',
  name: 'British school admissions',
  industry: 'Education', goal: 'Admissions',
  desc: 'Admissions page for a British-curriculum school in Al Barsha South, FS1 to Year 13: process, fees and open mornings.',
  title: 'Admissions 2026 to 2027 | Hollins Park British School',
  metaDesc: 'Hollins Park British School, Al Barsha South. FS1 to Year 13, KHDA rated Very good. Fees from AED 48,320. Book an open morning in December or January.',
  brand: 'Hollins Park British School',
  nav: ['Admissions', 'Fees', 'Open mornings'],
  navCta: 'Book an open morning',
  hero: {
    eyebrow: 'FS1 to Year 13, Al Barsha South',
    headline: 'Places for January and August 2027',
    sub: 'A British-curriculum school of 1,318 pupils with classes of 22 or fewer. Come to an open morning, see lessons running and ask the Head anything.',
    cta: 'Book an open morning', cta2: 'See the fees',
    note: 'Rated Very good by KHDA in 2025 to 2026',
    img: 'photo-1580582932707-520aed937b7b', imgAlt: 'Pupils walking along the main corridor between lessons'
  },
  trust: { label: 'Inspected and accredited by', items: ['KHDA', 'British Schools Overseas', 'Council of British International Schools', 'Cambridge International', 'Pearson Edexcel'] },
  sections: [
    {
      type: 'steps', id: 'admissions', head: 'How admission works',
      lede: 'Most families have a decision within 12 working days of applying.',
      items: [
        { title: 'Visit', text: 'Come to an open morning or book a private tour with our Registrar.' },
        { title: 'Apply online', text: 'Submit the form with the last two school reports and a AED 525 application fee.' },
        { title: 'Assessment', text: 'FS1 to Year 1: a relaxed play session. Year 2 and above: CAT4 and a short English and maths task, around 90 minutes.' },
        { title: 'Offer and seat deposit', text: 'Offers are emailed within five working days. A AED 5,000 deposit, deducted from term one fees, secures the place.' }
      ]
    },
    {
      type: 'stats', variant: 'inline', head: 'Last summer\'s results',
      items: [
        { v: '71%', l: 'of A level grades at A* to B in 2026' },
        { v: '58%', l: 'of GCSE grades at 9 to 7' },
        { v: '22', l: 'pupils per class at most, FS1 to Year 9' },
        { v: '43', l: 'nationalities across the school' }
      ],
      note: 'Results from the 2026 Pearson Edexcel and Cambridge series, 119 GCSE and 61 A level candidates.'
    },
    {
      type: 'pricelist', id: 'fees', head: 'Annual tuition fees 2026 to 2027',
      lede: 'KHDA-approved fees, paid in three termly instalments.',
      items: [
        { name: 'FS1 and FS2', price: 'AED 48,320' },
        { name: 'Years 1 and 2', price: 'AED 56,410' },
        { name: 'Years 3 to 6', price: 'AED 61,750' },
        { name: 'Years 7 to 9', price: 'AED 72,980' },
        { name: 'Years 10 and 11', price: 'AED 79,640' },
        { name: 'Years 12 and 13', price: 'AED 86,215' }
      ],
      note: 'Sibling discount: 5% for the second child, 10% for the third. Uniform, transport and trips are charged separately.'
    },
    {
      type: 'people', head: 'Who you will meet',
      items: [
        { name: 'Helen Marchbank', role: 'Headteacher', bio: 'Previously Deputy Head at a Surrey grammar school. Teaches Year 12 English literature one morning a week.' },
        { name: 'Omar Haddad', role: 'Registrar', bio: 'Handles every application from first call to first day. Ten years at the school, three of his own children came through it.' },
        { name: 'Fiona Kerr', role: 'Head of Primary', bio: 'Leads FS1 to Year 6 and runs the phonics and early reading programme.' }
      ]
    },
    {
      type: 'checklist', id: 'open', head: 'Open mornings, 8.45am to 10.30am',
      text: 'Tour the school while lessons are running, then join the Head for questions. Children are welcome.',
      items: ['Thursday 3 December 2026, primary focus', 'Tuesday 8 December 2026, secondary and sixth form', 'Wednesday 13 January 2027, whole school', 'Thursday 4 February 2027, FS1 and FS2 only', 'Private tours on weekdays at 9am or 1.30pm']
    },
    {
      type: 'quotes', variant: 'single',
      items: [
        { q: 'We came from a school of 3,000 pupils. Within a term our son\'s form tutor knew which subjects he dreaded and why. His maths has gone from a 4 to a 7.', name: 'Anisha Varghese', role: 'Parent, Year 10', source: 'Parent survey, June 2026' }
      ]
    }
  ],
  form: {
    title: 'Book an open morning', sub: 'Omar confirms your place by email within one working day.',
    cta: 'Book my place', foot: 'Your details stay with our admissions team and are never shared.',
    steps: 1,
    fields: [
      { type: 'text', name: 'parent_name', label: 'Parent name', required: true },
      { type: 'email', name: 'email', label: 'Email', required: true },
      { type: 'tel', name: 'phone', label: 'Mobile', required: true },
      { type: 'select', name: 'year_group', label: 'Year group applying for', required: true, options: ['FS1', 'FS2', 'Years 1 to 2', 'Years 3 to 6', 'Years 7 to 9', 'Years 10 to 11', 'Years 12 to 13'] },
      { type: 'select', name: 'entry', label: 'Preferred start', required: true, options: ['January 2027', 'April 2027', 'August 2027', 'Later'] },
      { type: 'select', name: 'visit', label: 'Open morning', required: true, options: ['Thu 3 Dec 2026', 'Tue 8 Dec 2026', 'Wed 13 Jan 2027', 'Thu 4 Feb 2027', 'Private tour instead'] }
    ]
  },
  formSection: { head: 'See the school on a normal day', text: 'Open mornings run during lessons, so you see real classes, not a show.', points: ['Meet the Head and Registrar', 'Children welcome on the tour', 'Free parking on site'] },
  final: { head: 'Year 3 and Year 7 fill first', sub: 'August 2027 waiting lists open on 1 February.', cta: 'Book an open morning' },
  footer: { tagline: 'British-curriculum day school for ages 3 to 18 in Al Barsha South.', address: 'Street 5, Al Barsha South 2, Dubai', phone: '+971 4 389 5072', email: 'admissions@hollinspark.sch.ae', hours: 'Admissions office 7.30am to 3.30pm, Monday to Friday', legal: 'KHDA permit 2014/0627' }
};
