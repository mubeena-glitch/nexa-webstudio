module.exports = {
  file: '10-real-estate-commercial-leadgen.html',
  name: 'Grade A office leasing',
  industry: 'Real Estate', goal: 'Lead Generation',
  desc: 'Direct-from-landlord office leasing in a Business Bay tower: fitted and shell-and-core floors, rents and viewings.',
  title: 'Grade A offices to lease, Business Bay | Ithra Tower',
  metaDesc: 'Lease fitted or shell-and-core offices in Ithra Tower, Business Bay, direct from the landlord. 1,912 to 14,760 sq ft. Viewings within 48 hours.',
  brand: 'Ithra Tower',
  nav: ['Floors', 'Fitted or shell', 'Viewings'],
  navCta: 'Book a viewing',
  hero: {
    eyebrow: 'Marasi Drive, Business Bay',
    headline: 'Fitted offices on the canal, from AED 168 per sq ft',
    sub: 'Seven floors available in a LEED Gold tower, leased direct by the landlord. No agency fee, and your keys can be in hand 30 days after you sign.',
    cta: 'Book a viewing', cta2: 'See available floors',
    note: '91% let, 37 companies in the building',
    img: 'photo-1486406146926-c627a92ad1ab', imgAlt: 'Business Bay skyline with Ithra Tower on the canal'
  },
  trust: { label: 'Tenants include', items: ['Harwell Lane Partners', 'Sahm Capital', 'Kinvara Engineering', 'Ruwad Health', 'Northbank Shipping'] },
  sections: [
    {
      type: 'stats', variant: 'inline',
      items: [
        { v: '412,600', l: 'sq ft of offices over 34 floors' },
        { v: '1 per 640', l: 'parking ratio, sq ft per bay' },
        { v: '3 minutes', l: 'walk to Business Bay metro' },
        { v: 'LEED Gold', l: 'certified in 2023' }
      ]
    },
    {
      type: 'pricelist', id: 'floors', head: 'Available now',
      lede: 'Rents per sq ft per year, excluding service charge of AED 19.50 per sq ft.',
      items: [
        { name: 'Level 9, part floor', desc: '1,912 sq ft, fitted, 18 desks, two meeting rooms', price: 'AED 172' },
        { name: 'Level 14, part floor', desc: '4,218 sq ft, fitted, 42 desks, canal view', price: 'AED 168' },
        { name: 'Level 17, full floor', desc: '14,760 sq ft, shell and core', price: 'AED 139' },
        { name: 'Level 22, part floor', desc: '7,386 sq ft, shell and core, Burj Khalifa view', price: 'AED 146' },
        { name: 'Level 26, part floor', desc: '3,054 sq ft, fitted, furnished, ready from January 2027', price: 'AED 184' }
      ],
      note: 'Minimum term three years for shell and core, two years for fitted floors.'
    },
    {
      type: 'compare', id: 'fitted', head: 'Fitted or shell and core',
      cols: ['', 'Fitted', 'Shell and core'],
      rows: [
        ['Move in', '30 days after signing', '4 to 6 months, including your fit-out'],
        ['Rent', 'AED 168 to 184 per sq ft', 'AED 139 to 146 per sq ft'],
        ['Rent-free period', 'One month', 'Up to five months for fit-out'],
        ['Fit-out contribution', 'Already done', 'AED 45 per sq ft on terms of five years or more'],
        ['Layout', 'Open plan with meeting rooms, minor changes at cost', 'Yours to design, with landlord approval']
      ]
    },
    {
      type: 'split', head: 'What the building already has',
      text: 'Your team gets the building on day one: lobby reception, shared meeting suites bookable by the hour and a café on the ground floor.',
      bullets: ['Twelve passenger lifts, average wait under 30 seconds', '24-hour access and security, with card readers on each floor', 'Shared meeting rooms from AED 95 per hour', 'Shower and bike storage on level B1'],
      img: 'photo-1497366754035-f200968a6e72', imgAlt: 'Fitted open-plan office floor with desks and planting', reverse: true
    },
    {
      type: 'steps', id: 'viewings', head: 'From viewing to keys',
      items: [
        { title: 'Viewing within 48 hours', text: 'Our leasing manager walks you through the floors that fit your headcount. About 40 minutes.' },
        { title: 'Heads of terms in three working days', text: 'Rent, term, rent-free and fit-out contribution agreed in writing, direct with the landlord.' },
        { title: 'Lease and Ejari', text: 'Lease signed, cheques or bank guarantee lodged, Ejari registered by us.' },
        { title: 'Keys', text: 'Fitted floors handed over within 30 days. Shell and core handed over for fit-out the same week.' }
      ]
    },
    {
      type: 'quotes', variant: 'single',
      items: [
        { q: 'We viewed on a Monday, agreed heads of terms on Thursday and moved 40 people into Level 11 five weeks later. No agent fee saved us around AED 61,000.', name: 'Aditya Bhandari', role: 'COO, Kinvara Engineering', source: 'Tenant since February 2026' }
      ]
    }
  ],
  form: {
    title: 'Book a viewing', sub: 'Our leasing manager confirms a time within one working day.',
    cta: 'Book my viewing', foot: 'Leased direct by the landlord. No agency fee, no obligation.',
    steps: 1,
    fields: [
      { type: 'text', name: 'full_name', label: 'Full name', required: true },
      { type: 'text', name: 'company', label: 'Company', required: true },
      { type: 'email', name: 'email', label: 'Work email', required: true },
      { type: 'tel', name: 'phone', label: 'Mobile', required: true },
      { type: 'select', name: 'size', label: 'Space needed', required: true, options: ['Under 2,500 sq ft', '2,500 to 5,000 sq ft', '5,000 to 10,000 sq ft', 'Over 10,000 sq ft'] },
      { type: 'select', name: 'fitout', label: 'Fitted or shell and core', required: false, options: ['Fitted', 'Shell and core', 'Open to both'] }
    ]
  },
  formSection: { head: 'Viewings Sunday to Thursday', text: 'Tell us your headcount and we shortlist the floors before you arrive.', points: ['Viewing within 48 hours', 'No agency fee', 'Heads of terms in three working days'] },
  final: { head: 'Level 14 has two serious enquiries', sub: 'Fitted floors under 5,000 sq ft let in about seven weeks.', cta: 'Book a viewing' },
  footer: { tagline: 'Grade A offices in Business Bay, leased direct by the owner.', address: 'Ithra Tower, Marasi Drive, Business Bay, Dubai', phone: '+971 4 425 8817', email: 'leasing@ithratower.ae', hours: 'Leasing office 8.30am to 5.30pm, Monday to Friday', legal: 'Ithra Real Estate Investment LLC, RERA ORN 31842' }
};
