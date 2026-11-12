module.exports = {
  file: '05-saas-demo-booking.html',
  name: 'Finance ops software demo',
  industry: 'SaaS / Tech', goal: 'Demo Booking',
  desc: 'Demo booking for approvals and reconciliation software: a 20-minute call built around one of the buyer\'s own workflows.',
  title: 'Book a 20-minute demo | Quillstone',
  metaDesc: 'Quillstone runs purchase approvals and bank reconciliations for finance teams in the GCC. Send one workflow, see it rebuilt live in 20 minutes.',
  brand: 'Quillstone',
  nav: ['The demo', 'Compare', 'Pricing'],
  navCta: 'Book a demo',
  hero: {
    eyebrow: 'Approvals and reconciliations for finance',
    headline: 'Send us one workflow. See it running in 20 minutes',
    sub: 'Quillstone replaces approval emails and reconciliation spreadsheets for finance and ops teams of 10 to 400. On the call we build your workflow, with your approvers and your ERP fields.',
    cta: 'Book a 20-minute demo', cta2: 'See pricing',
    note: 'Used by 186 finance teams in the UAE, Saudi Arabia and Qatar'
  },
  trust: { label: 'Running month-end at', items: ['Gulf Ridge Logistics', 'Bayana Foods', 'Mirqab Facilities', 'Hadeed Trading', 'Seef Clinics Group'] },
  sections: [
    {
      type: 'steps', id: 'demo', head: 'What happens on the call',
      lede: 'No slides. One of our solution engineers drives, you watch your process run.',
      items: [
        { title: 'Before: you send one workflow', text: 'A screenshot, a spreadsheet or three lines of text. Purchase approvals over AED 25,000, say, or the daily bank match.' },
        { title: 'Minutes 1 to 12: we build it', text: 'Your approval limits, your cost centres, your bank file format. Built live in a sandbox with your names in it.' },
        { title: 'Minutes 12 to 18: we break it', text: 'Missing PO, duplicate invoice, approver on leave. You see what happens to each exception.' },
        { title: 'Minutes 18 to 20: the numbers', text: 'Hours saved per month by role, and what setup would take for your team. Yours to keep as a PDF.' }
      ]
    },
    {
      type: 'features', variant: 'grid', head: 'What finance teams use it for',
      items: [
        { icon: 'check', title: 'Purchase approvals', text: 'Rules by amount, entity and cost centre. Approve from email, Slack, Teams or mobile.' },
        { icon: 'refresh', title: 'Bank reconciliation', text: 'Daily statement import from 23 GCC banks. 84% of lines matched automatically on average.' },
        { icon: 'receipt', title: 'Invoice matching', text: 'Three-way match against PO and goods received note, with VAT checks built in.' },
        { icon: 'users', title: 'Vendor onboarding', text: 'Trade licence, TRN and IBAN collected and checked before a vendor can be paid.' },
        { icon: 'calendar', title: 'Month-end close', text: 'Checklist with owners and due dates, linked to the reconciliations behind each task.' },
        { icon: 'lock', title: 'Audit trail', text: 'Every approval, edit and override logged with user and time. Export for your auditors in one click.' }
      ]
    },
    {
      type: 'compare', id: 'compare', head: 'Against what you probably use now',
      cols: ['', 'Quillstone', 'Email and spreadsheets'],
      rows: [
        ['Time to approve a PO', 'Median 3.4 hours', 'Two to five days'],
        ['Bank lines matched', 'Automatic, daily', 'By hand at month-end'],
        ['Approver on leave', 'Delegates by rule', 'Invoice waits in an inbox'],
        ['Audit request', 'Exported in minutes', 'A week of digging'],
        ['ERP sync', 'NetSuite, Dynamics 365, SAP B1, Xero, Zoho', 'Copy and paste']
      ]
    },
    {
      type: 'quotes', variant: 'feature', head: 'From finance teams who switched',
      items: [
        { q: 'They rebuilt our three-level PO approval in the demo with our real limits. Month-end close went from nine working days to five by the second quarter.', name: 'Karim Bitar', role: 'Financial controller, Gulf Ridge Logistics', source: 'Case study, July 2026' },
        { q: 'Bank reconciliation for 14 accounts used to take two of us all of Sunday. Now it is a 40-minute review.', name: 'Neha Kulkarni', role: 'AP and treasury lead, Bayana Foods' },
        { q: 'Our auditors asked for every approval over AED 100,000. I sent the export the same afternoon.', name: 'Fraser McInnes', role: 'CFO, Mirqab Facilities' }
      ]
    },
    {
      type: 'pricelist', id: 'pricing', head: 'Pricing',
      lede: 'Billed annually in AED. Approvers who only approve are free.',
      items: [
        { name: 'Team', desc: 'Approvals and vendor onboarding, up to 15 users, one entity', price: 'AED 89 per user per month' },
        { name: 'Business', desc: 'Adds bank reconciliation, invoice matching and ERP sync, up to 5 entities', price: 'AED 149 per user per month' },
        { name: 'Enterprise', desc: 'Unlimited entities, SSO, dedicated success manager, UAE data residency', price: 'from AED 41,500 per year' },
        { name: 'Implementation', desc: 'Fixed-fee setup and data migration, usually live in 3 to 5 weeks', price: 'from AED 7,800 one-off' }
      ],
      note: 'Prices exclude VAT. Monthly billing available on Team at 15% more.'
    },
    {
      type: 'faq', variant: 'aside', head: 'Before you book',
      items: [
        { q: 'Who should come to the demo?', a: 'Whoever owns the workflow day to day. A financial controller or AP lead is ideal. Bring your CFO if you want the numbers.' },
        { q: 'Where is our data hosted?', a: 'In Microsoft Azure UAE North by default. ISO 27001 certified, SOC 2 Type II report available under NDA.' },
        { q: 'Does it work with Arabic invoices?', a: 'Yes. Invoice capture reads Arabic and English, and the approver app is fully bilingual.' },
        { q: 'Is there a trial?', a: 'If the demo fits, we set up a 21-day pilot on your own data with one workflow live.' }
      ]
    }
  ],
  form: {
    title: 'Book your 20-minute demo', sub: 'Pick a slot on the next screen. We reply within one working day if none suit.',
    cta: 'Choose a time', foot: 'No sales sequence afterwards. One follow-up email with your numbers, that is all.',
    steps: 1,
    fields: [
      { type: 'text', name: 'full_name', label: 'Full name', required: true },
      { type: 'email', name: 'work_email', label: 'Work email', required: true },
      { type: 'text', name: 'company', label: 'Company', required: true },
      { type: 'select', name: 'team_size', label: 'Finance and ops team size', required: true, options: ['1 to 9', '10 to 49', '50 to 149', '150 to 400', 'Over 400'] },
      { type: 'select', name: 'workflow', label: 'Workflow to rebuild', required: true, options: ['Purchase approvals', 'Bank reconciliation', 'Invoice matching', 'Vendor onboarding', 'Expense claims', 'Month-end close'] },
      { type: 'select', name: 'erp', label: 'ERP or accounting system', required: false, options: ['Oracle NetSuite', 'Microsoft Dynamics 365', 'SAP Business One', 'Xero', 'Zoho Books', 'Other'] }
    ]
  },
  formSection: { head: 'Twenty minutes, your workflow', text: 'Bring one process that eats your week. Leave with a working version and a time-saved estimate.', points: ['No slides', 'Your fields and approvers', 'PDF of the numbers afterwards'] },
  final: { head: 'Year-end close is in seven weeks', sub: 'Teams who start a pilot in November usually close December on Quillstone.', cta: 'Book a demo' },
  footer: { tagline: 'Approvals and reconciliation software for GCC finance teams.', address: 'Office 408, Innovation One, DIFC, Dubai', phone: '+971 4 512 7730', email: 'demo@quillstone.io', hours: 'Sunday to Thursday, 8.30am to 6pm GST', legal: 'Quillstone Technologies Ltd, DIFC registration 6219' }
};
