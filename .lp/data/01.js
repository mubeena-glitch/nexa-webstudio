module.exports = {
  "file": "01-hospitality-hotel-booking.html",
  "name": "Beach hotel, direct booking",
  "industry": "Hospitality",
  "goal": "Booking",
  "desc": "A 64-room beach hotel in Jumeirah 3 selling direct: room rates, dining and the perks you only get on its own site.",
  "title": "Bayt Sahel, Jumeirah | Book direct and save 12%",
  "metaDesc": "Book Bayt Sahel direct: 12% off the best online rate, breakfast for two, late checkout to 2pm. 64 rooms on Jumeirah 3 beach, Dubai.",
  "brand": "Bayt Sahel",
  "nav": [
    "Rooms",
    "Dining",
    "Offers"
  ],
  "navCta": "Book direct",
  "hero": {
    "eyebrow": "Jumeirah 3 beach, Dubai",
    "headline": "Sixty-four rooms, one quiet stretch of sand",
    "sub": "A low-rise beach hotel on Jumeirah 3, ten minutes from City Walk. Book on this page and you pay 12% less than any travel site, with breakfast and late checkout included.",
    "cta": "Check dates",
    "cta2": "See the rooms",
    "note": "4.7 on Google from 1,206 reviews",
    "img": "photo-1566073771259-6a8506099945",
    "imgAlt": "The pool deck and timber-roofed main house at Bayt Sahel"
  },
  "trust": {
    "label": "Written up in",
    "items": [
      "Condé Nast Traveller Middle East",
      "The Weekend Edit",
      "The Gulf Ledger",
      "Harbour Herald",
      "Wallpaper"
    ]
  },
  "sections": [
    {
      "type": "pricelist",
      "id": "rooms",
      "head": "Rooms and suites",
      "lede": "Every room faces the sea or the walled garden. Rates are per night for two, including breakfast, for stays from 1 December 2026.",
      "items": [
        {
          "name": "Garden king",
          "desc": "32 sq m, ground floor, private patio onto the garden",
          "price": "from AED 1,240"
        },
        {
          "name": "Sea view king",
          "desc": "36 sq m, balcony facing the Gulf, rain shower",
          "price": "from AED 1,680"
        },
        {
          "name": "Twin family room",
          "desc": "41 sq m, two queen beds, sleeps two adults and two children",
          "price": "from AED 1,860"
        },
        {
          "name": "Corner suite",
          "desc": "64 sq m, wraparound balcony, separate lounge, soaking tub",
          "price": "from AED 2,950"
        },
        {
          "name": "Two-bedroom beach suite",
          "desc": "118 sq m, ground floor, steps straight onto the sand",
          "price": "from AED 4,380"
        }
      ],
      "note": "Rates exclude the Dubai tourism dirham fee of AED 15 per room per night."
    },
    {
      "type": "split",
      "id": "dining",
      "head": "Two places to eat, both open to the beach",
      "text": "Mawja serves breakfast until 11.30am and grilled fish from the Deira market at dinner. The Sand Bar opens at 4pm for mezze, cold drinks and the sunset. Hotel guests get first pick of the beachfront tables.",
      "bullets": [
        "Breakfast 7am to 11.30am, à la carte, no buffet queue",
        "Dinner at Mawja from AED 185 for three courses",
        "Room service from 6am to midnight"
      ],
      "img": "photo-1551632436-cbf8dd35adfa",
      "imgAlt": "Mawja, the all-day dining room, laid for lunch under pendant lights",
      "reverse": true
    },
    {
      "type": "checklist",
      "id": "offers",
      "head": "What booking direct gets you",
      "text": "Same room, same dates. These only come with a booking made on this site or by phone.",
      "items": [
        "12% off the lowest rate you find on any travel site",
        "Breakfast for two every morning",
        "Checkout at 2pm instead of 12pm",
        "One sunbed and parasol held for you each day",
        "Free cancellation until 72 hours before arrival",
        "AED 150 credit at Mawja on stays of three nights or more"
      ]
    },
    {
      "type": "quotes",
      "variant": "pair",
      "head": "Guests who came back",
      "items": [
        {
          "q": "We booked on the hotel site to get the late checkout and they also moved us to a corner suite. Fourth stay now.",
          "name": "Reem Al Falasi",
          "role": "Staycation guest from Mirdif",
          "source": "Google review, Sep 2026"
        },
        {
          "q": "Quiet beach, no club music, staff who learned the children's names by day two. That is what we pay for.",
          "name": "Thomas Ashworth",
          "role": "Family holiday from Surrey",
          "source": "Tripadvisor, Aug 2026"
        }
      ]
    },
    {
      "type": "faq",
      "variant": "stack",
      "head": "Before you book",
      "items": [
        {
          "q": "How does the 12% saving work?",
          "a": "Find a lower public rate for the same room and dates, send us the link, and we beat it by 12%. The saving is applied before you pay."
        },
        {
          "q": "What is the cancellation policy?",
          "a": "Flexible rates cancel free up to 72 hours before arrival. Advance purchase rates are 15% cheaper and non-refundable."
        },
        {
          "q": "Can you arrange an airport transfer?",
          "a": "Yes. A car from DXB costs AED 210 each way and takes about 25 minutes outside rush hour. Add it when you book or reply to your confirmation email."
        },
        {
          "q": "Are children welcome?",
          "a": "Yes. Under-sixes stay and eat breakfast free. The pool has a shallow end and lifeguards from 8am to 7pm."
        },
        {
          "q": "Is there parking?",
          "a": "Free valet parking for hotel guests, with EV charging in the basement."
        }
      ]
    }
  ],
  "form": {
    "title": "Check your dates",
    "sub": "We reply with live rates and your direct-booking price within 30 minutes.",
    "cta": "Check availability",
    "foot": "No payment taken until you confirm. Your details are only used for this booking.",
    "steps": 1,
    "fields": [
      {
        "type": "date",
        "name": "arrival",
        "label": "Arrival",
        "required": true
      },
      {
        "type": "date",
        "name": "departure",
        "label": "Departure",
        "required": true
      },
      {
        "type": "select",
        "name": "room",
        "label": "Room type",
        "required": true,
        "options": [
          "Garden king",
          "Sea view king",
          "Twin family room",
          "Corner suite",
          "Two-bedroom beach suite",
          "Not sure yet"
        ]
      },
      {
        "type": "select",
        "name": "guests",
        "label": "Guests",
        "required": true,
        "options": [
          "1 adult",
          "2 adults",
          "2 adults, 1 child",
          "2 adults, 2 children",
          "4 adults"
        ]
      },
      {
        "type": "text",
        "name": "full_name",
        "label": "Full name",
        "required": true
      },
      {
        "type": "email",
        "name": "email",
        "label": "Email",
        "required": true
      }
    ]
  },
  "formSection": {
    "head": "Rates for your dates, by a person",
    "text": "Our reservations team checks your dates by hand and sends the direct rate, room by room.",
    "points": [
      "Reply within 30 minutes, 8am to 10pm",
      "Nothing charged until you confirm",
      "Free changes up to 72 hours before"
    ]
  },
  "final": {
    "head": "The beach is quieter in December than you think",
    "sub": "Weekday rates from AED 1,240 until 18 December 2026.",
    "cta": "Check dates"
  },
  "footer": {
    "tagline": "A 64-room beach hotel on Jumeirah 3, Dubai.",
    "address": "14 Jumeirah Beach Road, Jumeirah 3, Dubai",
    "phone": "+971 4 348 2716",
    "email": "stay@baytsahel.ae",
    "hours": "Reservations 8am to 10pm daily",
    "legal": "DET classification licence 1083642"
  }
};
