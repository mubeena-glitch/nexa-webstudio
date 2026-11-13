# Landing-page content data: brief for writers

Each template is generated from one data file: `.lp/data/NN.js` (NN = two-digit template number), a CommonJS
module: `module.exports = { ... }`. A renderer (`.lp/build.js`) turns it into `templates/<file>.html`.
Design (colours, fonts, hero layout) is fixed per template by the renderer; you write content and choose sections.

## Hard rules (a lint script rejects violations)
- British English (colour, organise, centre, enrolment, programme, licence (noun), favourite, cheque...).
- NO em dashes or en dashes anywhere, and no spaced hyphen used as a dash (" - "). Use commas, full stops, colons, "to" for ranges ("AED 25k to 75k", "9am to 6pm").
- No exclamation marks. Sentence case for every heading and button ("Book a tour", not "Book A Tour").
- Banned words/phrases: elevate, unlock, seamless(ly), transform your, revolutionise, cutting-edge, world-class, effortless(ly), game-changer, next-level, empower, supercharge, unleash, delve, tapestry, journey (as metaphor), hassle-free, state-of-the-art, best-in-class, look no further, in today's, take it to the next level, experience the difference, one-stop shop, tailored solutions, peace of mind, nestled, bespoke (max once per page), curated (max once), premium (max once), "we've got you covered".
- Never write "NEXA", "Digital NEXA", "Jatin", "Acme", "Lorem", "Your Brand", "John Doe", "Jane", "Sarah J." or any initial-only name like "Sara K.". People get full first + surname names that fit the market (UAE / GCC / UK mix). Do not reuse a name across your files.
- Numbers must be specific and believable, not round: "1,184 learners", "4.8 from 612 Google reviews", "AED 2,350", "38 minutes". No "10,000+", "99.9%", "100%".
- Businesses are fictional but believable, with a specific place: a real UAE / UK area (Al Quoz, Jumeirah Lake Towers, Business Bay, Al Reem Island, Clerkenwell, Leith...). Brand names must be original and specific (not "The Clinic", "The Store", "Meridian", "Apex", "Nexus", "Momentum", "Atlas", "Summit", "Elite", "Prime").
- Copy is written for that exact business and buyer: concrete offers, prices, timings, what happens next, objections answered. Short sentences. No filler. No meta labels like "Section 01". Not every section needs an eyebrow; the schema has none for sections on purpose.
- Contact: phone in real local format (+971 4 3xx xxxx, +971 2 ..., +44 20 xxxx xxxx, +44 131 ...), email at the brand's domain, a street-level address.
- Images: only use Unsplash photo ids listed in `.lp/IMAGES.txt` (format `photo-XXXX-YYYY`). Pick ones that genuinely match; alt text describes the image as it relates to this business. If nothing fits, omit the image (most blocks work without one). Never invent ids.

## Schema (all strings plain text; `&` allowed; no HTML)

    module.exports = {
      file: '01-hospitality-hotel-booking.html',   // keep exactly as given
      name: 'Beach hotel, direct booking',          // gallery card title (short, sentence case)
      industry: 'Hospitality', goal: 'Booking',     // keep as given in your assignment
      desc: 'One sentence for the gallery card (max 120 chars).',
      title: 'Page title (max 60 chars)', metaDesc: 'Meta description (max 155 chars).',
      brand: 'Sarab Beach House',                   // brand wordmark
      nav: ['Rooms', 'Dining', 'Offers'],           // 2 to 4 short labels; they link to section ids in the same order (give sections matching ids)
      navCta: 'Book direct',
      hero: {
        eyebrow: 'Short context line, e.g. "Jumeirah 2, Dubai"',   // under 45 chars, plain
        headline: 'Under 60 chars, specific',
        sub: '1 to 2 sentences, max 220 chars.',
        cta: 'Primary button label', cta2: 'Optional secondary text link label (or omit)',
        note: 'Optional tiny proof line under the buttons, e.g. "4.8 on Google from 1,206 reviews"',
        img: 'photo-...', imgAlt: '...'              // required for hero types BF and IS; optional for TY; ignored for SF
      },
      trust: { label: 'Short label, e.g. "Recommended by"', items: ['Condé Nast Traveller', 'Time Out Dubai'] }, // 4 to 6 names, or omit
      sections: [ /* 4 to 7 blocks from the list below, in an order that suits THIS business */ ],
      form: {
        title: 'Form heading', sub: 'One line on what happens next',
        cta: 'Submit label', foot: 'Reassurance line (privacy, response time, no obligation)',
        steps: 1,                                    // 2 only for long forms (then every field carries step:1 or step:2)
        fields: [ { type:'text'|'email'|'tel'|'date'|'select'|'textarea'|'number'|'checkbox', name:'snake_name', label:'Sentence case label', required:true, options:['...'], rows:3, step:1 } ]
      },
      formSection: { head: 'Heading beside the form', text: '1 to 2 sentences', points: ['3 short reassurance points'] }, // used when the form is NOT in the hero (hero types IS, TY); always provide it anyway
      final: { head: 'Closing heading', sub: 'One line', cta: 'Button label' },
      footer: { tagline: 'One line about the business', address: 'Street, area, city', phone: '+971 4 ...', email: 'hello@brand.ae', hours: 'Optional opening hours line', legal: 'Optional licence or registration line' }
    };

### Section blocks (`sections` array). Each has `type` and an optional `id` (anchor; give nav targets ids)
- `{type:'features', variant:'rows'|'grid'|'bento'|'aside', head, lede?, img?, imgAlt?, items:[{icon, title, text}] }`
  rows = editorial numbered list (3 to 5 items); grid = 4 or 6 items, no cards; bento = asymmetric with a large photo tile (needs img) plus 3 or 4 items; aside = heading column left, items right (3 to 5).
- `{type:'split', head, text, bullets?:['...'], img, imgAlt, reverse?:true, cta?:'label'}` one image + copy.
- `{type:'stats', variant:'ruled'|'inline', head?, text?, items:[{v:'1,184', l:'learners certified in 2025'}], note?:'source/footnote'}` 3 or 4 items.
- `{type:'steps', head, lede?, items:[{title, text}]}` a real ordered process, 3 or 4 steps.
- `{type:'quotes', variant:'feature'|'pair'|'single', head?, items:[{q, name, role, source?:'Google review, Oct 2026'}]}` feature = 3 items (1 large + 2 small); pair = 2; single = 1.
- `{type:'pricelist', head, lede?, items:[{name, desc?, price}], note?}` menus, treatments, packages, tiers (4 to 8 items).
- `{type:'faq', variant:'aside'|'stack', head, items:[{q, a}]}` 4 to 6 real objections.
- `{type:'gallery', head?, imgs:[{img, alt}]}` 3 or 5 images.
- `{type:'band', img, imgAlt, head, text?}` full-width photo with a short statement.
- `{type:'checklist', head, text?, items:['...']}` what is included (4 to 8).
- `{type:'people', head, lede?, items:[{name, role, bio, img?, imgAlt?}]}` 2 to 4 named practitioners or partners.
- `{type:'compare', head, cols:['', 'Us', 'Typical option'], rows:[['Row label','value','value']]}` 4 to 6 rows.
- `{type:'notice', head, text}` one short highlighted statement (guarantee, offer terms, deadline).

Icons (feature items, pick the most literal fit): arrow check calendar clock pin phone mail shield key bed cup leaf sun bolt car tooth pulse stethoscope paw scissors home wrench hammer ruler compass briefcase scale chart wallet card globe plane camera users user book cap dumbbell spark chat doc lock truck box tag star drop flame plug panel hand gift mic ticket building layers eye smile utensils map wave mountain baby heart badge clipboard receipt percent refresh route flower bottle bell laptop code signal coin play

Variety requirement: across your files never repeat the same section order; use at least 4 different block types per page; do not default to features, stats, quotes, faq in that order. Not every page needs stats, quotes or a FAQ. Each page should feel planned for that business (a restaurant gets a menu, a clinic gets named doctors, a contractor gets a process and a project gallery, a SaaS product gets a workflow or comparison).
