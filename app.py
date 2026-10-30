"""
ItineryPlanner - Personalized Travel Itinerary Planner
Streamlit Community Cloud edition.

Features
- Accounts (local session profile) + guest mode, no database required
- Origin -> destination planner with city + state search
- INR (default) and USD budgets
- Train / bus / cab / flight options only when a real airport exists
- Curated hotel stays and restaurants with Google Maps + booking links
- Day-by-day geographic clustering, slot swaps, offline PDF export

Run locally:  streamlit run app.py
Deploy:       push this folder to GitHub -> share.streamlit.io -> app.py
"""

from __future__ import annotations

import datetime as dt
import json
import math
from urllib.parse import quote_plus

import streamlit as st
from fpdf import FPDF

st.set_page_config(
    page_title="ItineryPlanner | Travel Itinerary Planner",
    page_icon="✈️",
    layout="wide",
    initial_sidebar_state="expanded",
)

# --------------------------------------------------------------------------------------
# Styling
# --------------------------------------------------------------------------------------
st.markdown(
    """
<style>
  .block-container { padding-top: 1.4rem; max-width: 1200px; }
  .ip-hero {
      background: linear-gradient(120deg, #0f172a 0%, #0e7490 55%, #059669 100%);
      border-radius: 18px; padding: 26px 28px; color: #fff; margin-bottom: 18px;
  }
  .ip-hero h1 { font-size: 2.1rem; margin: 0 0 6px 0; font-weight: 800; letter-spacing: -0.5px; }
  .ip-hero p { color: #cffafe; margin: 0; font-size: 0.95rem; }
  .ip-card {
      background: #fff; border: 1px solid #e2e8f0; border-radius: 14px;
      padding: 14px 16px; margin-bottom: 10px;
  }
  .ip-chip {
      display: inline-block; background: #f1f5f9; color: #0f172a; border-radius: 8px;
      padding: 2px 8px; font-size: 0.75rem; font-weight: 600; margin: 0 4px 4px 0;
  }
  .ip-cluster {
      background: linear-gradient(120deg, #ecfeff 0%, #eef2ff 100%);
      border: 1px solid #bae6fd; color: #075985; border-radius: 10px;
      padding: 9px 12px; font-size: 0.85rem; font-weight: 600; margin-bottom: 10px;
  }
  .ip-muted { color: #64748b; font-size: 0.82rem; }
</style>
""",
    unsafe_allow_html=True,
)

# --------------------------------------------------------------------------------------
# Destination database: city + state, airport availability, hotels, restaurants
# --------------------------------------------------------------------------------------
CITY_DB = {
    "New Delhi": {
        "state": "Delhi", "vibe": "Urban", "usd": 72, "airport": "DEL", "station": "New Delhi (NDLS)",
        "hotels": [
            ("Bloomrooms @ Janpath", "Janpath / CP", "Budget", 32, "Clean rooms on the Metro, walk to India Gate."),
            ("The Imperial New Delhi", "Janpath", "Luxury", 280, "Art-deco icon with Lutyens gardens."),
            ("ITC Maurya", "Diplomatic Enclave", "Luxury", 210, "Bukhara and Dum Pukht under one roof."),
        ],
        "food": [
            ("Karim's", "Mughlai", "Jama Masjid", "Lunch", 1200, "Burra kebab and mutton stew"),
            ("Andhra Bhawan Canteen", "Andhra veg", "Ashoka Road", "Lunch", 400, "Unlimited meals, gongura"),
            ("Natraj Dahi Bhalle Wale", "Chaat", "Chandni Chowk", "Street food", 200, "Dahi bhalle, aloo tikki"),
        ],
    },
    "Mumbai": {
        "state": "Maharashtra", "vibe": "Urban", "usd": 85, "airport": "BOM", "station": "Mumbai CSMT",
        "hotels": [
            ("Abode Bombay", "Colaba", "Moderate", 70, "Design hotel steps from Gateway of India."),
            ("Taj Mahal Palace", "Apollo Bunder", "Luxury", 350, "The city landmark facing the harbour."),
        ],
        "food": [
            ("Bademiya", "Kebabs", "Colaba", "Dinner", 800, "Late-night seekh rolls"),
            ("Kailash Parbat", "Sindhi veg", "Colaba", "Lunch", 900, "Dal pakwan, paneer pakora"),
            ("Kyani & Co.", "Irani cafe", "Marine Lines", "Breakfast", 400, "Brun maska and chai"),
        ],
    },
    "Jaipur": {
        "state": "Rajasthan", "vibe": "Cultural", "usd": 48, "airport": "JAI", "station": "Jaipur Jn",
        "hotels": [
            ("Hotel Pearl Palace", "Hathroi Fort", "Budget", 28, "Heritage haveli feel with rooftop views."),
            ("Trident Jaipur", "Amber Road", "Moderate", 95, "Lake-facing calm near Jal Mahal."),
            ("Rambagh Palace", "Bhawani Singh Rd", "Luxury", 320, "Former royal residence."),
        ],
        "food": [
            ("Laxmi Mishthan Bhandar", "Rajasthani veg", "Johari Bazaar", "Lunch", 900, "Dal baati churma, ghewar"),
            ("Rawat Mishthan Bhandar", "Street food", "Station Road", "Breakfast", 250, "Pyaz kachori and lassi"),
            ("Suvarna Mahal", "Royal Rajasthani", "Rambagh Palace", "Dinner", 7000, "Palace thali"),
        ],
    },
    "Indore": {
        "state": "Madhya Pradesh", "vibe": "Urban", "usd": 40, "airport": "IDR", "station": "Indore Jn",
        "hotels": [
            ("Hotel Radisson Blu Indore", "Ring Road", "Moderate", 70, "Reliable business stay near the airport road."),
            ("Sayaji Hotel", "Vijay Nagar", "Moderate", 80, "Central and close to Sarafa night food."),
        ],
        "food": [
            ("Sarafa Night Market", "Street food", "Sarafa Bazaar", "Street food", 350, "Poha jalebi, garadu, sabudana khichdi"),
            ("Nafees Restaurant", "Mughlai", "Sapna Sangeeta", "Dinner", 900, "Seekh kebab and biryani"),
            ("Guru Kripa", "Vegetarian thali", "MG Road", "Lunch", 400, "Malwi thali"),
        ],
    },
    "Neemuch": {
        "state": "Madhya Pradesh", "vibe": "Cultural", "usd": 28, "airport": None, "station": "Neemuch (NMH)",
        "hotels": [
            ("Hotel Vishram", "Station Road", "Budget", 18, "Simple rail-side stay; no airport in town."),
            ("Hotel Shree Ram", "Neemuch Bazaar", "Budget", 22, "Walkable to the main market."),
        ],
        "food": [
            ("Bhadwamat Temple Bhojanalay", "Rajasthani veg", "Bhadwamat", "Lunch", 250, "Satvik thali"),
            ("Neemuch Namkeen Corner", "Street food", "Clock Tower", "Street food", 200, "Sev and kachori"),
        ],
    },
    "Udaipur": {
        "state": "Rajasthan", "vibe": "Cultural", "usd": 62, "airport": "UDR", "station": "Udaipur City",
        "hotels": [
            ("Hotel Raja Bagh Palace", "Gangaur Ghat", "Budget", 35, "Lake views without palace prices."),
            ("Taj Lake Palace", "Lake Pichola", "Luxury", 480, "Marble island palace; arrive by boat."),
        ],
        "food": [
            ("Ambrai", "Rajasthani", "Amet Haveli", "Dinner", 2800, "Floodlit Lake Palace dinner"),
            ("Natraj Dining Hall", "Thali", "Station Road", "Lunch", 500, "Unlimited thali"),
        ],
    },
    "Varanasi": {
        "state": "Uttar Pradesh", "vibe": "Cultural", "usd": 38, "airport": "VNS", "station": "Varanasi Jn",
        "hotels": [
            ("Ganpati Guesthouse", "Meer Ghat", "Budget", 22, "Ghat-side rooms for sunrise boats."),
            ("BrijRama Palace", "Darbhanga Ghat", "Luxury", 180, "Restored palace on the Ganga."),
        ],
        "food": [
            ("Blue Lassi", "Lassi", "Near Vishwanath", "Street food", 200, "Banana lassi in kulhad"),
            ("Deena Chaat Bhandar", "Chaat", "Dashashwamedh", "Lunch", 250, "Tamatar chaat"),
        ],
    },
    "Agra": {
        "state": "Uttar Pradesh", "vibe": "Cultural", "usd": 48, "airport": "AGR", "station": "Agra Cantt",
        "hotels": [
            ("Hotel Kamal", "Taj Ganj", "Budget", 20, "Rooftop Taj views, 5 min to East Gate."),
            ("The Oberoi Amarvilas", "Taj East Gate Rd", "Luxury", 420, "Every room faces the Taj."),
        ],
        "food": [
            ("Pinch of Spice", "North Indian", "Fatehabad Road", "Dinner", 1800, "Mughlai gravies"),
            ("Shankar Bhog", "Veg thali", "Taj Ganj", "Lunch", 500, "Unlimited thali"),
        ],
    },
    "Bengaluru": {
        "state": "Karnataka", "vibe": "Urban", "usd": 62, "airport": "BLR", "station": "KSR Bengaluru",
        "hotels": [
            ("The Hosteller Bangalore", "MG Road", "Budget", 28, "Walkable CBD and Church Street."),
            ("The Ritz-Carlton Bangalore", "Residency Road", "Luxury", 240, "Garden-city luxury with sky bar."),
        ],
        "food": [
            ("MTR", "Karnataka veg", "Lalbagh Road", "Breakfast", 700, "Rava idli, filter coffee"),
            ("Toit", "Brewpub", "Indiranagar", "Dinner", 2000, "Craft beer, wood-fired pies"),
        ],
    },
    "Goa (Panaji)": {
        "state": "Goa", "vibe": "Beach", "usd": 70, "airport": "GOI", "station": "Karmali / Madgaon",
        "hotels": [
            ("The Hosteller Goa", "Panjim", "Budget", 32, "Easy hop to Fontainhas and Mandovi."),
            ("Vivanta Goa Panaji", "Bandodkar Road", "Moderate", 110, "River-facing, 10 min to Latin Quarter."),
        ],
        "food": [
            ("Café Bhonsle", "Goan veg", "Panjim", "Lunch", 600, "Goan vegetarian thali"),
            ("Viva Panjim", "Goan", "Fontainhas", "Dinner", 1400, "Prawn balchao, xacuti"),
        ],
    },
    "Kochi": {
        "state": "Kerala", "vibe": "Cultural", "usd": 52, "airport": "COK", "station": "Ernakulam Jn",
        "hotels": [
            ("Fort House", "Fort Kochi", "Budget", 35, "Jetty-side heritage peninsula stay."),
            ("Brunton Boatyard", "Fort Kochi", "Luxury", 200, "Harbour-front heritage property."),
        ],
        "food": [
            ("Kashi Art Cafe", "Cafe", "Burgher Street", "Breakfast", 900, "Filter coffee and cakes"),
            ("Kayees Rahmathulla", "Malabar biryani", "Mattancherry", "Lunch", 600, "Legendary dum biryani"),
        ],
    },
    "Manali": {
        "state": "Himachal Pradesh", "vibe": "Mountains", "usd": 58, "airport": "KUU", "station": "Joginder Nagar",
        "hotels": [
            ("Zostel Manali", "Old Manali", "Budget", 18, "Backpacker hub with cafe culture."),
            ("The Himalayan", "Naggar Road", "Luxury", 160, "Stone-and-wood mountain estate."),
        ],
        "food": [
            ("Johnson's Cafe", "Continental", "Circuit House Rd", "Dinner", 1600, "Trout and apple crumble"),
            ("Drifters' Cafe", "Cafe", "Old Manali", "Breakfast", 700, "Mountain-view breakfast"),
        ],
    },
    "Leh": {
        "state": "Ladakh", "vibe": "Mountains", "usd": 70, "airport": "IXL", "station": None,
        "hotels": [
            ("Hotel Oom", "Main Bazaar", "Budget", 25, "Walkable bazaar stay for acclimatisation."),
            ("The Grand Dragon Ladakh", "Old Road", "Luxury", 150, "Oxygen-supported rooms."),
        ],
        "food": [
            ("Tibetan Kitchen", "Tibetan", "Changspa", "Dinner", 900, "Thukpa and momos"),
            ("Bon Appetit", "Continental", "Changspa", "Lunch", 1200, "Terrace views over Leh valley"),
        ],
    },
}

# Indian states used for the city + state picker
CITY_INDEX = sorted(
    [(city, meta["state"]) for city, meta in CITY_DB.items()] +
    [
        ("Hampi", "Karnataka"), ("Munnar", "Kerala"), ("Ooty", "Tamil Nadu"),
        ("Jaisalmer", "Rajasthan"), ("Jodhpur", "Rajasthan"), ("Amritsar", "Punjab"),
        ("Rishikesh", "Uttarakhand"), ("Shimla", "Himachal Pradesh"), ("Darjeeling", "West Bengal"),
        ("Gangtok", "Sikkim"), ("Shillong", "Meghalaya"), ("Kolkata", "West Bengal"),
        ("Chennai", "Tamil Nadu"), ("Hyderabad", "Telangana"), ("Pune", "Maharashtra"),
        ("Ahmedabad", "Gujarat"), ("Khajuraho", "Madhya Pradesh"), ("Madurai", "Tamil Nadu"),
        ("Puri", "Odisha"), ("Port Blair", "Andaman & Nicobar"), ("Puducherry", "Puducherry"),
    ],
    key=lambda item: item[0],
)

STATE_NAMES = sorted({state for _, state in CITY_INDEX})

NAMED_ROUTES = {
    ("New Delhi", "Jaipur"): [("Train", "Vande Bharat / Shatabdi NDLS → Jaipur", 4.2, 22)],
    ("New Delhi", "Agra"): [("Train", "Gatimaan Express NDLS → Agra Cantt", 1.2, 18)],
    ("Mumbai", "Goa (Panaji)"): [("Train", "Konkan Railway to Madgaon", 9.0, 18), ("Bus", "Overnight Volvo NH66", 12.0, 16)],
    ("Indore", "Neemuch"): [
        ("Train", "Indore Jn → Neemuch (NMH) express", 4.8, 8),
        ("Car", "NH52 cab Indore → Neemuch (~250 km)", 4.5, 32),
        ("Bus", "RedBus Volvo Indore → Neemuch", 5.5, 7),
    ],
    ("Bengaluru", "Hampi"): [("Train", "Overnight Hampi Express to Hosapete", 9.5, 14)],
    ("Kochi", "Munnar"): [("Car", "Hired cab via Adimali ghat", 4.6, 40), ("Bus", "KSRTC Ernakulam → Munnar", 5.5, 6)],
    ("New Delhi", "Leh"): [("Flight", "DEL → IXL morning flight", 4.2, 110)],
}

CITY_COORDS = {
    "New Delhi": (28.61, 77.21), "Mumbai": (19.08, 72.88), "Jaipur": (26.91, 75.79),
    "Indore": (22.72, 75.86), "Neemuch": (24.48, 74.87), "Udaipur": (24.59, 73.71),
    "Varanasi": (25.32, 82.97), "Agra": (27.18, 78.01), "Bengaluru": (12.97, 77.59),
    "Goa (Panaji)": (15.49, 73.83), "Kochi": (9.93, 76.27), "Manali": (32.24, 77.19),
    "Leh": (34.15, 77.58), "Hampi": (15.34, 76.46), "Munnar": (10.09, 77.06),
    "Ooty": (11.41, 76.70), "Jaisalmer": (26.92, 70.91), "Jodhpur": (26.24, 73.02),
    "Amritsar": (31.63, 74.87), "Rishikesh": (30.09, 78.27), "Shimla": (31.10, 77.17),
    "Darjeeling": (27.04, 88.27), "Gangtok": (27.34, 88.61), "Shillong": (25.58, 91.89),
    "Kolkata": (22.57, 88.36), "Chennai": (13.08, 80.27), "Hyderabad": (17.39, 78.49),
    "Pune": (18.52, 73.86), "Ahmedabad": (23.02, 72.57), "Khajuraho": (24.83, 79.92),
    "Madurai": (9.93, 78.12), "Puri": (19.81, 85.83), "Port Blair": (11.62, 92.73),
    "Puducherry": (11.94, 79.81),
}

STATE_FALLBACK_AIRPORT = {
    "Karnataka": "BLR", "Kerala": "COK", "Tamil Nadu": "MAA", "Telangana": "HYD",
    "West Bengal": "CCU", "Rajasthan": "JAI", "Gujarat": "AMD", "Madhya Pradesh": "IDR",
    "Uttar Pradesh": "LKO", "Uttarakhand": "DED", "Himachal Pradesh": "KUU",
    "Punjab": "ATQ", "Maharashtra": "BOM", "Odisha": "BBI", "Goa": "GOI",
    "Andaman & Nicobar": "IXZ", "Puducherry": "PNY", "Sikkim": "PYG",
    "Meghalaya": "SHL", "Ladakh": "IXL", "Delhi": "DEL",
}

INR_PER_USD = 84.5


# --------------------------------------------------------------------------------------
# Helpers
# --------------------------------------------------------------------------------------
def city_meta(city: str) -> dict:
    if city in CITY_DB:
        return CITY_DB[city]
    state = next((s for c, s in CITY_INDEX if c == city), "India")
    return {
        "state": state, "vibe": "Cultural", "usd": 45,
        "airport": STATE_FALLBACK_AIRPORT.get(state), "station": city,
        "hotels": [
            (f"FabHotel {city} Centre", f"Central {city}", "Budget", 25, "Reliable budget brand in the walkable core."),
            (f"Lemon Tree {city}", f"{city} business district", "Moderate", 70, "Mid-range comfort with restaurant and airport cabs."),
            (f"Taj / ITC {city}", f"{city} premium district", "Luxury", 180, "Full-service luxury with spa and breakfast buffet."),
        ],
        "food": [
            (f"{city} thali house", "Regional thali", f"Old {city}", "Lunch", 600, "Unlimited local thali"),
            (f"{city} cafe courtyard", "Cafe", f"{city} new town", "Breakfast", 800, "Filter coffee and sandwiches"),
            (f"{city} night market", "Street food", "Main bazaar", "Street food", 350, "Follow the longest queue"),
        ],
    }


def has_airport(city: str) -> bool:
    return bool(city_meta(city).get("airport"))


def maps_search(query: str) -> str:
    return f"https://www.google.com/maps/search/?api=1&query={quote_plus(query)}"


def maps_directions(origin: str, destination: str, mode: str = "transit") -> str:
    return (
        "https://www.google.com/maps/dir/?api=1"
        f"&origin={quote_plus(origin)}&destination={quote_plus(destination)}&travelmode={mode}"
    )


def hotel_links(city: str, hotel: str, checkin: str, checkout: str) -> list[tuple[str, str]]:
    q = quote_plus(f"{hotel} {city}")
    return [
        ("Google Maps", maps_search(f"{hotel} {city}")),
        ("Booking.com", f"https://www.booking.com/searchresults.html?ss={q}&checkin={checkin}&checkout={checkout}"),
        ("MakeMyTrip", f"https://www.makemytrip.com/hotels/{quote_plus(city).lower()}-hotels.html"),
        ("Agoda", f"https://www.agoda.com/search?textToSearch={q}&checkIn={checkin}&los=1"),
        ("Google Hotels", f"https://www.google.com/travel/search?q={quote_plus('hotels in ' + city)}"),
        ("Airbnb", f"https://www.airbnb.co.in/s/{quote_plus(city)}/homes?checkin={checkin}&checkout={checkout}"),
    ]


def food_links(city: str, restaurant: str) -> list[tuple[str, str]]:
    return [
        ("Google Maps", maps_search(f"{restaurant} {city}")),
        ("Zomato", f"https://www.zomato.com/search?q={quote_plus(restaurant + ' ' + city)}"),
        ("EazyDiner", f"https://www.eazydiner.com/search?query={quote_plus(restaurant + ' ' + city)}"),
    ]


def travel_links(mode: str, origin: str, destination: str, date_iso: str) -> list[tuple[str, str]]:
    mmt_date = dt.date.fromisoformat(date_iso).strftime("%d/%m/%Y")
    redbus_date = dt.date.fromisoformat(date_iso).strftime("%d-%b-%Y")
    links = [("Google Maps", maps_directions(origin, destination, "driving" if mode in ("Car", "Walk") else "transit"))]
    if mode == "Train":
        links += [
            ("IRCTC", "https://www.irctc.co.in/nget/train-search"),
            ("ConfirmTkt", f"https://www.confirmtkt.com/train-list/{quote_plus(origin)}/{quote_plus(destination)}"),
            ("Ixigo", f"https://www.ixigo.com/search/result/train/{quote_plus(origin)}/{quote_plus(destination)}/{date_iso.replace('-', '')}/1/0/0/ALL"),
        ]
    elif mode == "Bus":
        links += [
            ("RedBus", f"https://www.redbus.in/bus-tickets/{quote_plus(origin).lower()}-to-{quote_plus(destination).lower()}?onward={quote_plus(redbus_date)}"),
            ("AbhiBus", f"https://www.abhibus.com/bus-tickets/{quote_plus(origin).lower()}-to-{quote_plus(destination).lower()}"),
            ("MMT Bus", f"https://www.makemytrip.com/bus-tickets/{quote_plus(origin).lower()}-to-{quote_plus(destination).lower()}-bus-tickets.html"),
        ]
    elif mode == "Flight":
        links += [
            ("Google Flights", f"https://www.google.com/travel/flights?q={quote_plus('Flights from ' + origin + ' to ' + destination)}"),
            ("MakeMyTrip", f"https://www.makemytrip.com/flight/search?itinerary={quote_plus(origin)}-{quote_plus(destination)}-{mmt_date}&tripType=O&paxType=A-1_C-0_I-0"),
            ("Cleartrip", "https://www.cleartrip.com/flights"),
        ]
    elif mode in ("Car", "Walk"):
        links += [
            ("Uber", f"https://m.uber.com/looking?pickup={quote_plus(origin)}&drop[0]={quote_plus(destination)}"),
            ("Ola", "https://www.olacabs.com/"),
        ]
    return links


def haversine(a: str, b: str) -> int:
    if a not in CITY_COORDS or b not in CITY_COORDS:
        return 400
    lat1, lon1 = CITY_COORDS[a]
    lat2, lon2 = CITY_COORDS[b]
    radius = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    h = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
    return int(radius * 2 * math.atan2(math.sqrt(h), math.sqrt(1 - h)))


def build_journey(origin: str, destination: str, date_iso: str, budget: str) -> dict:
    distance = max(20, haversine(origin, destination))
    multiplier = 0.7 if budget == "Budget" else 1.85 if budget == "Luxury" else 1.0
    options: list[dict] = []

    for mode, label, hours, usd in NAMED_ROUTES.get((origin, destination), []):
        options.append({"mode": mode, "label": label, "hours": hours, "usd": usd})

    if not options:
        if distance < 90:
            options.append({"mode": "Car", "label": f"Cab {origin} → {destination}", "hours": distance / 42, "usd": distance * 0.12})
            options.append({"mode": "Bus", "label": f"Bus {origin} → {destination}", "hours": distance / 35, "usd": distance * 0.03})
        elif distance < 350:
            options.append({"mode": "Train", "label": f"Intercity train {origin} → {destination}", "hours": distance / 60 + 0.6, "usd": 6 + distance * 0.02})
            options.append({"mode": "Bus", "label": f"Volvo / sleeper {origin} → {destination}", "hours": distance / 42, "usd": distance * 0.022})
            options.append({"mode": "Car", "label": f"Highway cab {origin} → {destination}", "hours": distance / 48, "usd": distance * 0.11})
        else:
            if has_airport(origin) and has_airport(destination):
                options.append({"mode": "Flight", "label": f"{city_meta(origin)['airport']} → {city_meta(destination)['airport']}", "hours": distance / 780 + 2.6, "usd": 55 + distance * 0.05})
            options.append({"mode": "Train", "label": f"Express / sleeper {origin} → {destination}", "hours": distance / 55 + 1.5, "usd": 18 + distance * 0.012})
            options.append({"mode": "Bus", "label": f"Volvo / sleeper {origin} → {destination}", "hours": distance / 42, "usd": distance * 0.02})
            options.append({"mode": "Car", "label": f"Highway cab {origin} → {destination}", "hours": distance / 48, "usd": distance * 0.11})

    for option in options:
        option["usd"] = max(4, round(option["usd"] * multiplier))
        option["inr"] = round(option["usd"] * INR_PER_USD)
        option["duration"] = f"{int(option['hours'])}h {round((option['hours'] % 1) * 60):02d}m"
        option["links"] = travel_links(option["mode"], origin, destination, date_iso)

    recommended = sorted(options, key=lambda o: (o["hours"], o["usd"]))[0]
    last_mile = (
        f"Prepaid airport/station taxi into {destination} (20–45 min)."
        if has_airport(destination)
        else f"{destination} has no commercial airport — use train, bus, or cab. Station taxi into town (10–20 min)."
    )
    return {
        "distance": distance,
        "options": options,
        "recommended": recommended,
        "last_mile": last_mile,
        "offers_flight": any(o["mode"] == "Flight" for o in options),
    }


CLUSTERS = [
    ("Historic core & heritage quarter", "Old town", "All stops within a 1.8 km walk — no cross-town transfers."),
    ("Markets, food streets & living culture", "Bazaar district", "Compact bazaar lanes; everything is a short auto hop."),
    ("Lakes, gardens & view points", "Nature edge", "One-direction loop so you never backtrack."),
    ("Museums, crafts & evening promenade", "Arts quarter", "Indoor-friendly cluster for hot or rainy afternoons."),
]


def build_itinerary(origin: str, destination: str, days: int, budget: str, date_iso: str, vibe: str) -> dict:
    meta = city_meta(destination)
    multiplier = 0.7 if budget == "Budget" else 1.95 if budget == "Luxury" else 1.0
    plan_days = []
    cumulative = 0
    start = dt.date.fromisoformat(date_iso)

    for index in range(days):
        cluster = CLUSTERS[index % len(CLUSTERS)]
        base = [16, 22, 18, 30]
        costs = [round(value * multiplier) for value in base]
        day_total = sum(costs)
        cumulative += day_total
        plan_days.append(
            {
                "day": index + 1,
                "date": (start + dt.timedelta(days=index)).strftime("%a %d %b"),
                "cluster": cluster[0],
                "hub": cluster[1],
                "advantage": cluster[2],
                "slots": {
                    "Morning": {
                        "time": "09:00 – 12:30",
                        "title": f"{destination} heritage walk & landmark visit",
                        "cost_usd": costs[0],
                        "cost_inr": round(costs[0] * INR_PER_USD),
                        "tip": "Arrive at opening time to beat heat and queues.",
                    },
                    "Lunch": {
                        "time": "12:30 – 14:00",
                        "title": meta["food"][0][0] + " — " + meta["food"][0][1],
                        "cost_usd": costs[1],
                        "cost_inr": round(costs[1] * INR_PER_USD),
                        "tip": "Ask for the local thali; vegetarian is usually excellent.",
                    },
                    "Afternoon": {
                        "time": "14:30 – 17:30",
                        "title": f"{destination} museum, craft bazaar or lakefront",
                        "cost_usd": costs[2],
                        "cost_inr": round(costs[2] * INR_PER_USD),
                        "tip": "Keep this slot flexible for the day's weather.",
                    },
                    "Evening": {
                        "time": "18:30 – 21:30",
                        "title": "Sunset viewpoint, aarti or night food street",
                        "cost_usd": costs[3],
                        "cost_inr": round(costs[3] * INR_PER_USD),
                        "tip": "Pre-book the return cab after dark.",
                    },
                },
                "total_usd": day_total,
                "total_inr": round(day_total * INR_PER_USD),
                "cumulative_usd": cumulative,
                "cumulative_inr": round(cumulative * INR_PER_USD),
            }
        )

    return {
        "origin": origin,
        "destination": destination,
        "state": meta["state"],
        "vibe": vibe,
        "budget": budget,
        "days": plan_days,
        "hotels": meta["hotels"],
        "food": meta["food"],
        "date_iso": date_iso,
        "nights": max(1, days - 1),
    }


def make_pdf(itinerary: dict, journey: dict, currency: str) -> bytes:
    """Offline PDF. Latin-1 safe text (INR instead of the rupee glyph)."""

    def money(usd: int, inr: int) -> str:
        return f"INR {inr:,}" if currency == "INR" else f"USD {usd}"

    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=14)
    pdf.add_page()

    def safe(text: str) -> str:
        replacements = {
            "\u20b9": "INR ", "\u2192": "->", "\u2190": "<-", "\u2013": "-", "\u2014": "-",
            "\u2018": "'", "\u2019": "'", "\u201c": '"', "\u201d": '"', "\u2022": "-", "\u00b7": "-",
        }
        for source, target in replacements.items():
            text = text.replace(source, target)
        return text.encode("latin-1", "replace").decode("latin-1")

    def line(size: float, text: str, style: str = "", align: str = "L") -> None:
        pdf.set_font("Helvetica", style, size)
        pdf.set_x(pdf.l_margin)  # multi_cell leaves x at the right edge; reset before every line
        pdf.multi_cell(0, size * 0.55, safe(str(text)), align=align)

    def gap(height: float = 3) -> None:
        pdf.set_x(pdf.l_margin)
        pdf.ln(height)

    line(17, f"{itinerary['destination']} - {len(itinerary['days'])} day plan", "B", "C")
    line(
        10,
        f"{itinerary['origin']} to {itinerary['destination']} | {itinerary['budget']} | {itinerary['vibe']}",
        "",
        "C",
    )
    gap(4)

    recommended = journey["recommended"]
    line(12, "Getting there", "B")
    line(
        9,
        f"Recommended: {recommended['mode']} - {recommended['label']} "
        f"({recommended['duration']}, {money(recommended['usd'], recommended['inr'])})",
    )
    line(9, f"Distance approx {journey['distance']} km.")
    line(9, f"Last mile: {journey['last_mile']}")
    for option in journey["options"]:
        line(9, f"- {option['mode']}: {option['label']} ({option['duration']}, {money(option['usd'], option['inr'])})")
    gap(3)

    line(12, "Day-by-day plan", "B")
    for day in itinerary["days"]:
        line(10, f"Day {day['day']} ({day['date']}): {day['cluster']}", "B")
        line(8.5, day["advantage"], "I")
        for name, slot in day["slots"].items():
            line(9, f"- {name} {slot['time']}: {slot['title']} [{money(slot['cost_usd'], slot['cost_inr'])}]")
        line(
            9,
            f"Day total: {money(day['total_usd'], day['total_inr'])} | Running total: "
            f"{money(day['cumulative_usd'], day['cumulative_inr'])}",
        )
        gap(2)

    line(12, "Hotel options", "B")
    for name, area, tier, usd, why in itinerary["hotels"]:
        line(9, f"- {name} ({tier}) {area} - USD {usd}/night. {why}")

    gap(2)
    line(12, "Restaurants", "B")
    for name, cuisine, area, meal, _price, signature in itinerary["food"]:
        line(9, f"- {name} ({cuisine}, {area}, {meal}): {signature}")

    gap(2)
    line(12, "Emergency checklist", "B")
    for item in [
        "Police / emergency: 112",
        "Ambulance: 108",
        "Tourist helpline: 1363",
        "Keep passport copies and hotel address offline",
        "Download offline Google Maps for both cities",
    ]:
        line(9, f"- {item}")

    gap(3)
    line(8.5, "Generated by ItineryPlanner", "I")

    output = pdf.output()
    return bytes(output) if not isinstance(output, str) else output.encode("latin-1")


# --------------------------------------------------------------------------------------
# Session boot
# --------------------------------------------------------------------------------------
defaults = {
    "profile": None,
    "guest": False,
    "currency": "INR",
    "itinerary": None,
    "journey": None,
    "saved": [],
    "origin": "Indore",
    "destination": "Neemuch",
}
for key, value in defaults.items():
    st.session_state.setdefault(key, value)

# --------------------------------------------------------------------------------------
# Account / guest gate
# --------------------------------------------------------------------------------------
st.markdown(
    '<div class="ip-hero"><h1>ItineryPlanner</h1>'
    "<p>Personalized itineraries from your city — trains, stays, food, and offline PDF.</p></div>",
    unsafe_allow_html=True,
)

if not st.session_state.profile and not st.session_state.guest:
    left, right = st.columns([1.1, 1])
    with left:
        st.subheader("Plan smarter trips")
        st.write(
            "- Pick origin and destination by **city + state**\n"
            "- Real train / bus / cab options with IRCTC, RedBus, and Maps links\n"
            "- Hotel stays and restaurants with booking links\n"
            "- Rupee-first budgets with a printable PDF"
        )
        if st.button("Continue as guest (no login)", type="primary", use_container_width=True):
            st.session_state.guest = True
            st.rerun()
        st.caption("Guest mode keeps your trips in this browser session only.")
    with right:
        tab_login, tab_signup = st.tabs(["Sign in", "Create account"])
        with tab_login:
            email = st.text_input("Email", key="login_email")
            password = st.text_input("Password", type="password", key="login_password")
            if st.button("Sign in", use_container_width=True):
                if email and password:
                    st.session_state.profile = {"name": email.split("@")[0].title(), "email": email}
                    st.rerun()
                else:
                    st.error("Enter email and password.")
        with tab_signup:
            name = st.text_input("Full name", key="signup_name")
            email2 = st.text_input("Email", key="signup_email")
            password2 = st.text_input("Password (8+ chars)", type="password", key="signup_password")
            if st.button("Create account", type="primary", use_container_width=True):
                if len(name.strip()) < 2 or "@" not in email2 or len(password2) < 8:
                    st.error("Name, valid email, and 8+ character password required.")
                else:
                    st.session_state.profile = {"name": name.strip(), "email": email2.strip().lower()}
                    st.rerun()
        st.caption("This Streamlit build stores profiles in the session. No database required.")
    st.stop()

header_left, header_right = st.columns([3, 1])
with header_left:
    who = st.session_state.profile["name"] if st.session_state.profile else "Guest"
    st.caption(f"Signed in as **{who}**" + ("" if st.session_state.profile else " (guest mode)"))
with header_right:
    if st.button("Sign out", use_container_width=True):
        st.session_state.profile = None
        st.session_state.guest = False
        st.rerun()

# --------------------------------------------------------------------------------------
# Sidebar
# --------------------------------------------------------------------------------------
with st.sidebar:
    st.markdown("### Trip preferences")
    currency = st.radio("Currency", ["INR", "USD"], index=0, horizontal=True)
    st.session_state.currency = currency

    state_filter = st.selectbox("Filter cities by state", ["All states"] + STATE_NAMES)
    cities = [c for c in CITY_INDEX if state_filter == "All states" or c[1] == state_filter]
    city_labels = [f"{c} — {s}" for c, s in cities]

    origin_options = sorted({c for c, _ in CITY_INDEX})
    st.markdown("#### Route")
    origin = st.selectbox(
        "Departing from",
        origin_options,
        index=origin_options.index(st.session_state.origin) if st.session_state.origin in origin_options else 0,
        format_func=lambda c: f"{c}, {city_meta(c)['state']}",
    )
    destination_city = st.selectbox(
        "Going to",
        [c for c, _ in cities],
        index=([c for c, _ in cities].index(st.session_state.destination)
               if st.session_state.destination in [c for c, _ in cities] else 0),
        format_func=lambda c: f"{c}, {city_meta(c)['state']}",
    )
    st.session_state.origin = origin
    st.session_state.destination = destination_city
    st.caption(f"Selected: **{origin}, {city_meta(origin)['state']}** → **{destination_city}, {city_meta(destination_city)['state']}**")

    st.markdown("#### Trip")
    start_date = st.date_input("Travel start date", dt.date.today() + dt.timedelta(days=14))
    days = st.slider("Duration (days)", 1, 10, 3)
    budget = st.selectbox("Budget level", ["Budget", "Moderate", "Luxury"], index=1)
    party = st.selectbox("Travel party", ["Solo", "Couple", "Family", "Friends"])
    pace = st.select_slider("Pace", ["Relaxed", "Moderate", "Fast-Paced"], value="Moderate")
    vibe = st.selectbox("Vibe", ["Cultural", "Urban", "Beach", "Mountains", "Nature", "Wellness", "Desert", "Island"])
    interests = st.multiselect(
        "Interests",
        ["Food & culinary", "History & heritage", "Adventure", "Art & museums", "Nightlife", "Nature & wildlife"],
        default=["Food & culinary", "History & heritage"],
    )

    generate = st.button("Generate itinerary", type="primary", use_container_width=True)
    st.caption("INR is the default display currency. Optional AI key stored only in session.")

    with st.expander("Optional AI enhancement"):
        provider = st.selectbox("Provider", ["Demo (offline)", "Groq", "Gemini"])
        api_key = st.text_input("API key", type="password")
        if provider != "Demo (offline)" and not api_key:
            st.info("Add a key, or keep Demo mode.")

if generate:
    try:
        date_iso = start_date.isoformat()
        st.session_state.itinerary = build_itinerary(origin, destination_city, days, budget, date_iso, vibe)
        st.session_state.journey = build_journey(origin, destination_city, date_iso, budget)
        st.success(f"{origin} → {destination_city} itinerary ready.")
    except Exception as exc:  # noqa: BLE001
        st.error(f"Could not build the itinerary: {exc}")

if st.session_state.itinerary is None:
    st.info("Pick a route in the sidebar and click **Generate itinerary**.")
    st.stop()

itinerary = st.session_state.itinerary
journey = st.session_state.journey
money = (lambda usd, inr: f"₹{inr:,}") if currency == "INR" else (lambda usd, inr: f"${usd}")

tabs = st.tabs(["Itinerary", "Hotels & food", "Book travel", "Customize", "Vault & PDF"])

# --------------------------------------------------------------------------------------
# Itinerary tab
# --------------------------------------------------------------------------------------
with tabs[0]:
    st.subheader(f"{itinerary['destination']}, {itinerary['state']}")
    st.caption(
        f"{itinerary['origin']} → {itinerary['destination']} · {journey['distance']} km · "
        f"{itinerary['budget']} · {party} · {pace} pace"
    )
    col1, col2, col3, col4 = st.columns(4)
    col1.metric("Days", len(itinerary["days"]))
    col2.metric("Estimated spend", money(itinerary["days"][-1]["cumulative_usd"], itinerary["days"][-1]["cumulative_inr"]))
    col3.metric("Getting there", journey["recommended"]["mode"])
    col4.metric("Transit time", journey["recommended"]["duration"])

    st.markdown("#### Getting there")
    st.markdown(
        f'<div class="ip-card"><b>{journey["recommended"]["mode"]}</b> — {journey["recommended"]["label"]}'
        f'<br/><span class="ip-muted">{journey["recommended"]["duration"]} · '
        f'{money(journey["recommended"]["usd"], journey["recommended"]["inr"])} · {journey["last_mile"]}</span></div>',
        unsafe_allow_html=True,
    )
    if not journey["offers_flight"]:
        st.info(f"{itinerary['destination']} has no usable commercial airport — we only show train, bus, and cab.")

    for day in itinerary["days"]:
        with st.expander(f"Day {day['day']} · {day['date']} · {day['cluster']} · {money(day['total_usd'], day['total_inr'])}", expanded=day["day"] == 1):
            st.markdown(f'<div class="ip-cluster">🧭 {day["advantage"]} · Hub: {day["hub"]}</div>', unsafe_allow_html=True)
            left, right = st.columns(2)
            for column, keys in ((left, ["Morning", "Afternoon"]), (right, ["Lunch", "Evening"])):
                with column:
                    for key in keys:
                        slot = day["slots"][key]
                        st.markdown(
                            f'<div class="ip-card"><b>{key} · {slot["time"]}</b><br/>{slot["title"]}'
                            f'<br/><span class="ip-muted">Tip: {slot["tip"]}</span><br/>'
                            f'<span class="ip-chip">{money(slot["cost_usd"], slot["cost_inr"])}</span></div>',
                            unsafe_allow_html=True,
                        )
            st.caption(f"Running total through Day {day['day']}: {money(day['cumulative_usd'], day['cumulative_inr'])}")

# --------------------------------------------------------------------------------------
# Hotels & food tab
# --------------------------------------------------------------------------------------
with tabs[1]:
    st.subheader(f"Where to stay and eat in {itinerary['destination']}")
    checkin = itinerary["date_iso"]
    checkout = (dt.date.fromisoformat(itinerary["date_iso"]) + dt.timedelta(days=itinerary["nights"])).isoformat()

    st.markdown("#### Hotel stay options")
    hotel_columns = st.columns(min(3, len(itinerary["hotels"])))
    for index, (name, area, tier, usd, why) in enumerate(itinerary["hotels"]):
        with hotel_columns[index % len(hotel_columns)]:
            st.markdown(
                f'<div class="ip-card"><b>{name}</b> <span class="ip-chip">{tier}</span>'
                f'<br/><span class="ip-muted">{area} · {money(usd, round(usd * INR_PER_USD))}/night · {itinerary["nights"]} nights</span>'
                f'<br/>{why}</div>',
                unsafe_allow_html=True,
            )
            for label, url in hotel_links(itinerary["destination"], name, checkin, checkout):
                st.link_button(label, url, use_container_width=True)

    st.divider()
    st.markdown("#### Best food & restaurants")
    food_columns = st.columns(2)
    for index, (name, cuisine, area, meal, price_two, signature) in enumerate(itinerary["food"]):
        with food_columns[index % 2]:
            st.markdown(
                f'<div class="ip-card"><b>{name}</b><br/><span class="ip-muted">{cuisine} · {area} · {meal}</span>'
                f'<br/>Must try: {signature}'
                f'<br/><span class="ip-chip">₹{price_two:,} for two</span></div>',
                unsafe_allow_html=True,
            )
            for label, url in food_links(itinerary["destination"], name):
                st.link_button(label, url, use_container_width=True)

# --------------------------------------------------------------------------------------
# Book travel tab
# --------------------------------------------------------------------------------------
with tabs[2]:
    st.subheader(f"Book {itinerary['origin']} → {itinerary['destination']}")
    st.link_button("Open the full route on Google Maps", maps_directions(itinerary["origin"], itinerary["destination"]))
    for option in journey["options"]:
        with st.container(border=True):
            st.markdown(f"**{option['mode']}** — {option['label']}")
            st.caption(f"{option['duration']} · {money(option['usd'], option['inr'])} · approx {journey['distance']} km")
            columns = st.columns(len(option["links"]))
            for index, (label, url) in enumerate(option["links"]):
                with columns[index]:
                    st.link_button(label, url, use_container_width=True)
    st.caption("Neemuch-style towns without airports never get flight links. Train and bus are shown instead.")

# --------------------------------------------------------------------------------------
# Customize tab
# --------------------------------------------------------------------------------------
with tabs[3]:
    st.subheader("Customize slots")
    day_labels = [f"Day {d['day']} · {d['cluster']}" for d in itinerary["days"]]
    day_pick = st.selectbox("Day", day_labels)
    day_index = day_labels.index(day_pick)
    slot_pick = st.selectbox("Slot", ["Morning", "Lunch", "Afternoon", "Evening"])
    current = itinerary["days"][day_index]["slots"][slot_pick]
    st.write(f"Current: **{current['title']}**")

    replacements = [
        "Outdoor farmers market and bakery crawl",
        "Farm-to-table vegetarian bistro",
        "Museum or heritage gallery",
        "Sunset rooftop lounge",
        "Local night food street",
    ]
    choice = st.selectbox("Replace with", replacements)
    if st.button("Apply swap", type="primary"):
        itinerary["days"][day_index]["slots"][slot_pick]["title"] = choice
        itinerary["days"][day_index]["slots"][slot_pick]["tip"] = "Customized by you."
        st.session_state.itinerary = itinerary
        st.success("Slot updated. Budget untouched.")

# --------------------------------------------------------------------------------------
# Vault & PDF tab
# --------------------------------------------------------------------------------------
with tabs[4]:
    st.subheader("Trip vault and offline PDF")
    if st.button("Save this trip", type="primary"):
        st.session_state.saved.append(
            {
                "origin": itinerary["origin"],
                "destination": itinerary["destination"],
                "days": len(itinerary["days"]),
                "budget": itinerary["budget"],
                "saved_on": dt.date.today().isoformat(),
                "itinerary": itinerary,
                "journey": journey,
            }
        )
        st.success("Saved for this session.")

    try:
        pdf_bytes = make_pdf(itinerary, journey, currency)
        st.download_button(
            "Download offline PDF guide",
            data=pdf_bytes,
            file_name=f"{itinerary['destination'].replace(' ', '_')}_itinerary.pdf",
            mime="application/pdf",
            type="primary",
        )
    except Exception as exc:  # noqa: BLE001
        st.error(f"PDF generation failed: {exc}")

    st.download_button(
        "Download trip JSON backup",
        data=json.dumps({"itinerary": itinerary, "journey": journey}, indent=2),
        file_name=f"{itinerary['destination'].replace(' ', '_')}_trip.json",
        mime="application/json",
    )

    if st.session_state.saved:
        st.markdown("#### Saved trips")
        for trip in reversed(st.session_state.saved):
            st.write(f"- {trip['origin']} → **{trip['destination']}** · {trip['days']} days · {trip['budget']} · {trip['saved_on']}")

    with st.expander("Emergency contact checklist"):
        st.write("- Police / emergency: **112**")
        st.write("- Ambulance: **108**")
        st.write("- Tourist helpline: **1363**")
        st.write("- Keep hotel address and passport copies offline")
        st.write("- Download offline Google Maps for both cities")

st.divider()
st.caption("ItineryPlanner · Streamlit build · INR default · No external database required")
