module.exports = {
  "file": "20-automotive-test-drive.html",
  "name": "Electric car test drive booking",
  "industry": "Automotive",
  "goal": "Test Drive",
  "desc": "Electric car showrooms in Dubai and Abu Dhabi: choose a model, a showroom and a date for a 45-minute test drive.",
  "title": "Book an electric car test drive in Dubai or Abu Dhabi | Orvane",
  "metaDesc": "Test drive the Orvane S4 saloon or X6 SUV for 45 minutes from our Al Quoz or Yas Island showroom, or at home. Prices from AED 189,900.",
  "brand": "Orvane Electric",
  "nav": [
    "Models",
    "Test drive",
    "Ownership",
    "FAQ"
  ],
  "navCta": "Book a test drive",
  "hero": {
    "eyebrow": "Showrooms in Al Quoz and Yas Island",
    "headline": "45 minutes behind the wheel, on roads you know",
    "sub": "Pick a model and a showroom, and drive the route you would actually take to work. A product specialist sits in the passenger seat to answer questions, not to sell.",
    "cta": "Book my test drive",
    "note": "Test drives available seven days a week, 10am to 9pm",
    "img": "photo-1512453979798-5ea266f8880c",
    "imgAlt": "Sheikh Zayed Road and the Dubai skyline at dusk"
  },
  "sections": [
    {
      "type": "pricelist",
      "id": "models",
      "head": "Choose what to drive",
      "lede": "All prices include VAT, registration and the first year of comprehensive insurance.",
      "items": [
        {
          "name": "Orvane S4 Standard Range",
          "desc": "Saloon, rear-wheel drive, 448km WLTP range",
          "price": "From AED 189,900"
        },
        {
          "name": "Orvane S4 Long Range",
          "desc": "Saloon, dual motor, 591km WLTP, 0 to 100km/h in 4.6s",
          "price": "From AED 223,400"
        },
        {
          "name": "Orvane X6 Long Range",
          "desc": "Seven-seat SUV, dual motor, 537km WLTP",
          "price": "From AED 246,500"
        },
        {
          "name": "Orvane X6 Performance",
          "desc": "Seven-seat SUV, 0 to 100km/h in 3.9s, 22-inch wheels",
          "price": "From AED 274,900"
        }
      ],
      "note": "Ranges are WLTP figures. Expect around 15% less in July and August with the air conditioning running hard."
    },
    {
      "type": "stats",
      "variant": "ruled",
      "head": "Ownership figures from UAE drivers",
      "items": [
        {
          "v": "AED 312",
          "l": "average monthly home charging cost, S4 Long Range"
        },
        {
          "v": "21 min",
          "l": "10 to 80% on a 250kW public charger"
        },
        {
          "v": "1,843",
          "l": "Orvane cars registered in the UAE since 2024"
        }
      ],
      "note": "Charging cost based on DEWA residential tariff and 2,150km a month, October 2026."
    },
    {
      "type": "steps",
      "id": "test-drive",
      "head": "How the test drive works",
      "items": [
        {
          "title": "Book a slot",
          "text": "Choose the model, showroom and date. We confirm by WhatsApp within two hours."
        },
        {
          "title": "Bring your licence",
          "text": "A valid UAE or international driving licence and your Emirates ID or passport. That is all."
        },
        {
          "title": "Drive for 45 minutes",
          "text": "Choose the city route, the highway route on Sheikh Mohammed bin Zayed Road, or your own commute."
        },
        {
          "title": "Take a quote home",
          "text": "Prices hold for 14 days. We follow up once, then leave it with you."
        }
      ]
    },
    {
      "type": "features",
      "variant": "grid",
      "id": "ownership",
      "head": "Included with every Orvane",
      "items": [
        {
          "icon": "shield",
          "title": "8-year battery warranty",
          "text": "Or 160,000km, covering at least 70% capacity."
        },
        {
          "icon": "wrench",
          "title": "5 years of servicing",
          "text": "Scheduled services at our Al Quoz and Mussafah service centres."
        },
        {
          "icon": "plug",
          "title": "Home charger, installed",
          "text": "7.4kW wall charger fitted within 10 working days, including DEWA or ADDC approval."
        },
        {
          "icon": "car",
          "title": "Courtesy car",
          "text": "For any service visit longer than four hours."
        },
        {
          "icon": "refresh",
          "title": "Software updates",
          "text": "Delivered over the air, free for the life of the car."
        },
        {
          "icon": "phone",
          "title": "24/7 roadside assistance",
          "text": "Five years, anywhere in the UAE, including flatbed recovery."
        }
      ]
    },
    {
      "type": "faq",
      "variant": "stack",
      "id": "faq",
      "head": "Before your test drive",
      "items": [
        {
          "q": "Can you bring the car to me?",
          "a": "Yes. Home and office test drives are free within Dubai and Abu Dhabi city limits, booked 48 hours ahead."
        },
        {
          "q": "Can my family come along?",
          "a": "Yes. In the X6 there is room for five passengers plus the specialist."
        },
        {
          "q": "Do you take trade-ins?",
          "a": "Yes. Bring your car on the day and we value it in 20 minutes. The offer is valid for seven days."
        },
        {
          "q": "How long is the wait for delivery?",
          "a": "S4 in white, grey and black is in stock in Dubai. Other colours and the X6 take six to nine weeks."
        },
        {
          "q": "What finance is available?",
          "a": "From 2.49% flat over 60 months with 20% down payment, through two UAE partner banks. Subject to approval."
        }
      ]
    }
  ],
  "form": {
    "title": "Book your test drive",
    "sub": "We confirm your slot by WhatsApp within two hours.",
    "cta": "Book my test drive",
    "foot": "No deposit, no obligation. We will not call more than once after your drive.",
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
        "name": "model",
        "label": "Model",
        "required": true,
        "options": [
          "S4 Standard Range",
          "S4 Long Range",
          "X6 Long Range",
          "X6 Performance",
          "Not sure, help me choose"
        ]
      },
      {
        "type": "select",
        "name": "location",
        "label": "Where",
        "required": true,
        "options": [
          "Al Quoz showroom, Sheikh Zayed Road",
          "Yas Island showroom, Abu Dhabi",
          "At my home or office"
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
          "10am to 1pm",
          "1pm to 5pm",
          "5pm to 9pm"
        ]
      }
    ]
  },
  "formSection": {
    "head": "Drive it on your own route",
    "text": "Tell us the model and the place. We prepare the car and plan the route before you arrive.",
    "points": [
      "45-minute drive",
      "Home test drives in Dubai and Abu Dhabi",
      "Quote held for 14 days"
    ]
  },
  "final": {
    "head": "Weekend slots fill first",
    "sub": "Book now for Saturday or Sunday at either showroom.",
    "cta": "Book a test drive"
  },
  "footer": {
    "tagline": "Electric saloons and SUVs, sold and serviced in the UAE.",
    "address": "Showroom 3, Sheikh Zayed Road, Al Quoz 3, Dubai",
    "phone": "+971 4 340 7712",
    "email": "drive@orvane.ae",
    "hours": "Every day 10am to 9pm",
    "legal": "Orvane Electric Vehicles Trading LLC, Dubai licence 1209534"
  }
};
