module.exports = {
  file: '41-saas-recruitment-demo.html',
  name: 'Applicant tracking, demo booking',
  industry: 'Recruitment', goal: 'Book a Demo',
  desc: 'An applicant tracking system for GCC companies hiring 20 to 300 people a year, with a 25-minute demo on a live role.',
  title: 'Panelwise applicant tracking: book a 25-minute demo',
  metaDesc: 'Panelwise is the applicant tracking system for growing GCC teams. Bring one open role and we run it through the platform live in 25 minutes.',
  brand: 'Panelwise',
  nav: ['Platform', 'Pricing', 'Customers'],
  navCta: 'Book a demo',
  hero: {
    eyebrow: 'Applicant tracking for teams of 30 to 800',
    headline: 'Every candidate, every interviewer, one shortlist',
    sub: 'Job posts, CV screening, interview slots and offer letters in one place your hiring managers will actually open. Bring a live vacancy and we build its pipeline with you on the call.',
    cta: 'Book a demo',
    cta2: 'See pricing',
    note: 'Used by 214 hiring teams across the UAE, Saudi Arabia and Qatar'
  },
  trust: { label: 'Hiring on Panelwise', items: ['Sahm Logistics', 'Qanat Health Group', 'Brightwell Nurseries', 'Marsa Fintech', 'Dune & Pine Hospitality'] },
  sections: [
    {
      type: 'split', id: 'platform',
      head: 'Built for the hiring manager who has three other jobs',
      text: 'Most applicant tracking systems are designed for recruiters and ignored by everyone else. Panelwise sends each interviewer a two-minute scorecard on WhatsApp or email, books their slot from their own calendar, and shows the recruiter who is holding things up.',
      bullets: [
        'Post once to LinkedIn, Bayt, Naukrigulf and your careers page',
        'Knockout questions for visa status, notice period and salary band',
        'Arabic and English candidate emails from the same template',
        'Offer letters generated from your approved salary grid'
      ],
      img: 'photo-1521737711867-e3b97375f902', imgAlt: 'A hiring team comparing shortlisted candidates on a laptop'
    },
    {
      type: 'stats', variant: 'inline',
      items: [
        { v: '23 days', l: 'median time to offer across customers in Q3 2026, down from 41' },
        { v: '6.4 hours', l: 'saved per recruiter each week on scheduling' },
        { v: '87%', l: 'of interview scorecards submitted within 24 hours' }
      ],
      note: 'Figures from 214 customer accounts, July to September 2026.'
    },
    {
      type: 'compare',
      head: 'What changes when you leave the spreadsheet',
      cols: ['', 'Panelwise', 'Spreadsheet and inbox'],
      rows: [
        ['Where CVs live', 'One searchable pipeline per role', 'Five inboxes and a shared drive'],
        ['Interview booking', 'Candidate picks a slot from live calendars', 'Eight emails per interview'],
        ['Feedback', 'Scorecard against the role criteria', 'A thumbs up in a group chat'],
        ['Rejections', 'Sent in bulk, in Arabic or English', 'Often never sent'],
        ['Reporting', 'Time to hire and source quality, live', 'Rebuilt by hand before each review']
      ]
    },
    {
      type: 'pricelist', id: 'pricing',
      head: 'Priced by live roles, not by seats',
      lede: 'Invite every hiring manager and interviewer at no extra cost. Billed monthly or annually in AED.',
      items: [
        { name: 'Starter', desc: 'Up to 8 live roles, careers page, scorecards, email support', price: 'AED 1,190 / month' },
        { name: 'Growth', desc: 'Up to 25 live roles, WhatsApp scheduling, offer letters, HRIS sync', price: 'AED 2,640 / month' },
        { name: 'Scale', desc: 'Unlimited roles, approval chains, SSO, dedicated success manager', price: 'From AED 5,350 / month' },
        { name: 'Onboarding and data migration', desc: 'Import of existing candidates and two live training sessions', price: 'AED 3,900 one-off, waived on annual plans' }
      ],
      note: 'Prices exclude 5% VAT. Annual billing saves two months.'
    },
    {
      type: 'quotes', variant: 'pair', id: 'customers',
      head: 'From teams who switched this year',
      items: [
        { q: 'We hired 46 drivers and 9 dispatchers in eleven weeks for the Jebel Ali hub. The knockout questions on licence type alone saved my recruiters a day a week.', name: 'Huda Al Marzouqi', role: 'Head of Talent, Sahm Logistics', source: 'Customer since February 2026' },
        { q: 'Our clinic managers used to sit on CVs for a fortnight. Now they get a WhatsApp, tap through a scorecard and the candidate has a slot the same afternoon.', name: 'Kieran Osei-Bonsu', role: 'People Director, Qanat Health Group', source: 'Customer since May 2026' }
      ]
    },
    {
      type: 'faq', variant: 'aside',
      head: 'Questions before the demo',
      items: [
        { q: 'What happens on the 25-minute demo?', a: 'Send us one open job description when you book. We set it up before the call, then walk you through posting, screening, scheduling and the offer stage on that role.' },
        { q: 'Where is candidate data stored?', a: 'In AWS Bahrain (me-south-1). We comply with the UAE PDPL and the Saudi PDPL, and every account gets a data processing agreement.' },
        { q: 'Does it connect to our HR system?', a: 'Growth and Scale sync hires to Bayzat, Zoho People, Darwinbox and SAP SuccessFactors. Anything else goes through our open API.' },
        { q: 'How long does it take to go live?', a: 'Most teams are live in 9 working days. We import your current candidates from a spreadsheet or your old system as part of onboarding.' },
        { q: 'Is there a contract?', a: 'Monthly plans cancel with 30 days notice. Annual plans are paid upfront and include free onboarding.' }
      ]
    }
  ],
  form: {
    title: 'Book your 25-minute demo',
    sub: 'Pick a slot on the next screen. We prepare the demo around your role.',
    cta: 'Choose a demo slot',
    foot: 'No sales sequence. One calendar invite and a reminder the day before.',
    steps: 1,
    fields: [
      { type: 'text', name: 'full_name', label: 'Full name', required: true },
      { type: 'email', name: 'work_email', label: 'Work email', required: true },
      { type: 'text', name: 'company', label: 'Company', required: true },
      { type: 'select', name: 'headcount', label: 'Company headcount', required: true, options: ['Under 50', '50 to 150', '151 to 400', '401 to 800', 'Over 800'] },
      { type: 'select', name: 'hires_per_year', label: 'Hires planned in the next 12 months', required: true, options: ['Fewer than 20', '20 to 60', '61 to 150', 'More than 150'] },
      { type: 'select', name: 'current_tool', label: 'What you use today', options: ['Spreadsheets and email', 'LinkedIn Recruiter only', 'Another ATS', 'Our HRIS recruitment module'] }
    ]
  },
  formSection: { head: 'See your own role in Panelwise', text: 'Twenty-five minutes on a live vacancy tells you more than an hour of slides.', points: ['Demo built on your job description', 'Pricing confirmed on the call', 'Trial account for your team afterwards'] },
  final: { head: 'Bring one open role. Leave with its pipeline.', sub: 'Demos run Sunday to Thursday, 9am to 6pm Gulf time.', cta: 'Book a demo' },
  footer: {
    tagline: 'Applicant tracking for growing teams in the Gulf.',
    address: 'Office 214, Building 5, Dubai Internet City, Dubai',
    phone: '+971 4 368 2917',
    email: 'demo@panelwise.ae',
    hours: 'Sunday to Thursday, 9am to 6pm',
    legal: 'Panelwise Technologies FZ-LLC, licence 98214'
  }
};
