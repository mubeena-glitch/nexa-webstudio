module.exports = {
  file: '47-ecommerce-subscription-box.html',
  name: 'Coffee subscription, roaster plans',
  industry: 'E-commerce', goal: 'Subscribe',
  desc: 'A Leith roastery posting single-origin coffee every two or four weeks, roasted on Tuesday and through your letterbox by Thursday.',
  title: 'Coffee subscription from a Leith roastery | Coalhill',
  metaDesc: 'Single-origin coffee roasted in Leith every Tuesday, posted letterbox-size by Royal Mail. Plans from £10.50. Skip or cancel from your account.',
  brand: 'Coalhill Roasters',
  nav: ['Plans', 'How it works', 'In the box'],
  navCta: 'Start a subscription',
  hero: {
    eyebrow: 'Roasted in Leith every Tuesday',
    headline: 'Coffee that is six days old, not six months',
    sub: 'We roast on Tuesday, pack on Wednesday and Royal Mail does the rest. A different single origin each delivery, ground for your kit or left whole.',
    cta: 'Choose a plan',
    cta2: 'How it works',
    note: '2,416 subscribers. 4.8 on Trustpilot from 903 reviews.',
    img: 'photo-1559056199-641a0ac8b55e', imgAlt: 'Freshly roasted beans being bagged at the Coalhill roastery in Leith'
  },
  trust: { label: 'Written about in', items: ['The Scotsman', 'The List', 'Caffeine Magazine', 'Edinburgh Evening News'] },
  sections: [
    {
      type: 'pricelist', id: 'plans',
      head: 'Plans',
      lede: 'Prices include UK delivery. Your first bag is half price on any plan.',
      items: [
        { name: 'One bag, every 2 weeks', desc: '250g, our roaster\'s pick', price: '£10.50 per delivery' },
        { name: 'Two bags, every 2 weeks', desc: '2 x 250g, two different origins to compare', price: '£19.80 per delivery' },
        { name: 'One bag, every 4 weeks', desc: '250g, for the weekend brewer', price: '£11.25 per delivery' },
        { name: 'Espresso kilo, every 4 weeks', desc: '1kg of our seasonal espresso, whole bean only', price: '£34.00 per delivery' },
        { name: 'Office, every 2 weeks', desc: '2kg whole bean, for teams of 8 to 15', price: '£61.00 per delivery' },
        { name: 'Gift, 3 deliveries', desc: 'Paid once, with a handwritten card in the first box', price: '£33.60' }
      ],
      note: 'Pause, skip or cancel before Monday at noon to change that week\'s delivery.'
    },
    {
      type: 'quotes', variant: 'pair',
      head: 'From subscribers',
      items: [
        { q: 'The Huila from Colombia in September was the best filter coffee I have had at home. I now check the roast date on everything else and wince.', name: 'Fiona MacAskill', role: 'Subscriber since 2024, Portobello', source: 'Trustpilot, October 2026' },
        { q: 'Skipped three deliveries over the summer from the app in about ten seconds. No emails trying to keep me.', name: 'Joseph Adeyemi-Clarke', role: 'Two bag plan, Glasgow', source: 'Trustpilot, August 2026' }
      ]
    },
    {
      type: 'steps', id: 'how-it-works',
      head: 'How it works',
      items: [
        { title: 'Tell us how you brew', text: 'Cafetière, V60, AeroPress, moka pot, espresso or whole bean. We grind to suit on the day we pack.' },
        { title: 'We roast on Tuesday', text: 'Small batches on our 15 kilo Diedrich, in a unit off Newhaven Road.' },
        { title: 'It arrives Thursday or Friday', text: 'Letterbox-size, Royal Mail tracked. You do not need to be in.' },
        { title: 'Rate it in the app', text: 'Thumbs up or down on each origin. We use it to steer what you get next.' }
      ]
    },
    {
      type: 'split',
      head: 'Bought direct, priced openly',
      text: 'We buy from five importers and two farms directly, and print what we paid per kilo on every bag. This season our average green coffee price is £8.94 a kilo, about three times the commodity price.',
      img: 'photo-1495474472287-4d71bcdd2085', imgAlt: 'A flat white made with the Coalhill seasonal espresso', reverse: true
    },
    {
      type: 'checklist', id: 'in-the-box',
      head: 'In every delivery',
      items: [
        'Coffee roasted no more than 72 hours before dispatch',
        'A card with the farm, variety, process and the price we paid',
        'A brew recipe for your method, by our head roaster Eilidh Drummond',
        'Packaging that goes in your paper recycling, and a compostable bag liner',
        'A code for 15% off anything in the online shop'
      ]
    }
  ],
  form: {
    title: 'Start your subscription',
    sub: 'Your first half-price bag goes out next Wednesday.',
    cta: 'Continue to payment',
    foot: 'No minimum term. Cancel from your account at any time.',
    steps: 1,
    fields: [
      { type: 'text', name: 'name', label: 'Name', required: true },
      { type: 'email', name: 'email', label: 'Email', required: true },
      { type: 'select', name: 'plan', label: 'Plan', required: true, options: ['One bag, every 2 weeks', 'Two bags, every 2 weeks', 'One bag, every 4 weeks', 'Espresso kilo, every 4 weeks', 'Office, every 2 weeks'] },
      { type: 'select', name: 'brew_method', label: 'How you brew', required: true, options: ['Cafetière', 'V60 or filter', 'AeroPress', 'Moka pot', 'Espresso machine', 'Whole bean, I grind my own'] },
      { type: 'text', name: 'postcode', label: 'Delivery postcode', required: true }
    ]
  },
  formSection: { head: 'First bag half price', text: 'Pick a plan and a brew method. You can change both from your account later.', points: ['Roasted Tuesday, posted Wednesday', 'Skip or pause in the app', 'Free UK delivery'] },
  final: { head: 'Next roast is Tuesday', sub: 'Order by Monday at noon to be in this week\'s batch.', cta: 'Start a subscription' },
  footer: {
    tagline: 'Specialty coffee roasted in Leith and posted across the UK.',
    address: 'Unit 4, Bonnington Mill, 72 Newhaven Road, Edinburgh EH6 5QG',
    phone: '+44 131 553 4782',
    email: 'hello@coalhillroasters.co.uk',
    hours: 'Roastery shop open Saturday 10am to 3pm',
    legal: 'Coalhill Roasters Ltd, registered in Scotland, company no. SC694217'
  }
};
