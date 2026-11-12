module.exports = {
  "file": "15-beauty-salon-booking.html",
  "name": "Hair and beauty salon booking",
  "industry": "Beauty",
  "goal": "Booking",
  "desc": "Umm Suqeim hair and beauty salon with a priced treatment menu, three named stylists and online booking.",
  "title": "Hair colour, cuts and treatments in Umm Suqeim | Rosewater Row",
  "metaDesc": "Book a cut, colour or keratin treatment at Rosewater Row, Umm Suqeim 1. Prices from AED 185, three senior stylists, 20% off your first colour in November.",
  "brand": "Rosewater Row",
  "nav": [
    "Treatments",
    "Stylists",
    "Reviews",
    "FAQ"
  ],
  "navCta": "Book online",
  "hero": {
    "eyebrow": "Jumeirah Beach Road, Umm Suqeim 1",
    "headline": "Colour that grows out well, cuts that last eight weeks",
    "sub": "Five chairs, three senior stylists and a consultation before every colour. See the prices below, pick your stylist and book a time that suits you.",
    "cta": "Book an appointment",
    "cta2": "See prices",
    "note": "4.9 on Google from 528 reviews",
    "img": "photo-1573496359142-b8d87734a5a2",
    "imgAlt": "A client with a fresh cut and colour at Rosewater Row"
  },
  "trust": {
    "label": "Colour and care brands we use",
    "items": [
      "Olaplex",
      "Davines",
      "Kérastase",
      "Wella Professionals",
      "Oribe"
    ]
  },
  "sections": [
    {
      "type": "pricelist",
      "id": "treatments",
      "head": "Treatment menu",
      "lede": "Prices are the same with every stylist. Colour prices include a toner and blow-dry.",
      "items": [
        {
          "name": "Cut and blow-dry",
          "desc": "Includes wash and scalp massage, 60 minutes",
          "price": "AED 285"
        },
        {
          "name": "Blow-dry",
          "desc": "Straight, bouncy or waves, 45 minutes",
          "price": "AED 185"
        },
        {
          "name": "Root colour",
          "desc": "Up to 3cm regrowth, with blow-dry",
          "price": "AED 395"
        },
        {
          "name": "Full head balayage",
          "desc": "Hand-painted, with toner and Olaplex, about 3.5 hours",
          "price": "AED 1,150"
        },
        {
          "name": "Keratin smoothing",
          "desc": "Lasts 10 to 14 weeks, shoulder length",
          "price": "AED 1,380"
        },
        {
          "name": "Bridal hair trial",
          "desc": "90 minutes, credited if you book the wedding day",
          "price": "AED 650"
        },
        {
          "name": "Gel manicure",
          "desc": "Shape, cuticle care and colour, 50 minutes",
          "price": "AED 165"
        },
        {
          "name": "Brow shape and tint",
          "desc": "30 minutes",
          "price": "AED 140"
        }
      ],
      "note": "Longer hair may add AED 60 to AED 180 to colour services. We confirm the price at your consultation, before we start."
    },
    {
      "type": "people",
      "id": "stylists",
      "head": "Choose your stylist",
      "items": [
        {
          "name": "Noura Al Shamsi",
          "role": "Colour director",
          "bio": "Fourteen years in colour, trained in London. Specialises in balayage on dark hair that does not turn orange in the Dubai sun."
        },
        {
          "name": "Mireille Khoury",
          "role": "Senior stylist",
          "bio": "Precision cuts and curly hair. Moved from a Beirut salon in 2019 and still keeps a waiting list for Saturdays."
        },
        {
          "name": "Jessa Delgado",
          "role": "Senior stylist and bridal lead",
          "bio": "Has done hair for 230 weddings across the UAE. Runs every bridal trial herself."
        }
      ]
    },
    {
      "type": "quotes",
      "variant": "pair",
      "id": "reviews",
      "head": "From guests this year",
      "items": [
        {
          "q": "Noura talked me out of going platinum and into a softer blonde. Four months later it still looks intentional, not overdue.",
          "name": "Shamma Al Falasi",
          "role": "Balayage guest",
          "source": "Google review, August 2026"
        },
        {
          "q": "Mireille is the first person in Dubai who has cut my curls dry and properly. I have booked my next three appointments.",
          "name": "Hannah Whitcombe",
          "role": "Curly cut guest",
          "source": "Google review, October 2026"
        }
      ]
    },
    {
      "type": "notice",
      "head": "20% off your first colour in November",
      "text": "New guests get 20% off any colour service booked online before Monday 30 November 2026. The discount is applied at the salon."
    },
    {
      "type": "faq",
      "variant": "stack",
      "id": "faq",
      "head": "Before you book",
      "items": [
        {
          "q": "Do I need a patch test?",
          "a": "Yes, for any colour if you have not coloured with us in the last six months. Pop in for five minutes at least 48 hours before."
        },
        {
          "q": "What is your cancellation policy?",
          "a": "Free up to 24 hours before. Inside 24 hours we charge 50% of the booked service."
        },
        {
          "q": "Is there parking?",
          "a": "Two shaded bays behind the salon, plus street parking on 2A Street. Valet is not available."
        },
        {
          "q": "Can I bring my child?",
          "a": "Children over 6 can have a cut with Mireille on weekday afternoons, AED 120."
        }
      ]
    }
  ],
  "form": {
    "title": "Request an appointment",
    "sub": "We confirm your time by WhatsApp within two hours.",
    "cta": "Request my appointment",
    "foot": "No payment now. Free cancellation up to 24 hours before.",
    "steps": 1,
    "fields": [
      {
        "type": "text",
        "name": "full_name",
        "label": "Full name",
        "required": true
      },
      {
        "type": "tel",
        "name": "mobile",
        "label": "Mobile",
        "required": true
      },
      {
        "type": "select",
        "name": "treatment",
        "label": "Treatment",
        "required": true,
        "options": [
          "Cut and blow-dry",
          "Blow-dry",
          "Root colour",
          "Full head balayage",
          "Keratin smoothing",
          "Bridal hair trial",
          "Gel manicure",
          "Brow shape and tint"
        ]
      },
      {
        "type": "select",
        "name": "stylist",
        "label": "Stylist",
        "required": false,
        "options": [
          "No preference",
          "Noura Al Shamsi",
          "Mireille Khoury",
          "Jessa Delgado"
        ]
      },
      {
        "type": "date",
        "name": "date",
        "label": "Preferred date",
        "required": true
      },
      {
        "type": "select",
        "name": "time",
        "label": "Preferred time",
        "required": true,
        "options": [
          "Morning, 10am to 12pm",
          "Afternoon, 12pm to 4pm",
          "Evening, 4pm to 8pm"
        ]
      }
    ]
  },
  "formSection": {
    "head": "Pick a treatment and a stylist",
    "text": "Tell us roughly when suits you and we will offer the closest free slot.",
    "points": [
      "Confirmed within two hours",
      "Same price with every stylist",
      "Free cancellation up to 24 hours"
    ]
  },
  "final": {
    "head": "Saturday chairs go first",
    "sub": "Book now for the week of 23 November.",
    "cta": "Book an appointment"
  },
  "footer": {
    "tagline": "Hair, nails and brows on Jumeirah Beach Road.",
    "address": "Villa 412, Jumeirah Beach Road, Umm Suqeim 1, Dubai",
    "phone": "+971 4 394 7183",
    "email": "book@rosewaterrow.ae",
    "hours": "Saturday to Thursday 10am to 8pm, Friday 2pm to 8pm",
    "legal": "Rosewater Row Ladies Salon LLC, DED licence 893512"
  }
};
