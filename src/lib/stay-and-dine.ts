import { BudgetLevel, HotelStay, RestaurantPick } from '@/types/travel';
import { hotelBookingLinks, restaurantBookingLinks } from './booking-links';

type HotelSeed = { name: string; area: string; tier: BudgetLevel; nightlyUsd: number; why: string; amenities: string[] };
type FoodSeed = { name: string; cuisine: string; area: string; meal: RestaurantPick['meal']; priceForTwoInr: number; signature: string; vegFriendly: boolean };

const CITY_HOTELS: Record<string, HotelSeed[]> = {
  jaipur: [
    { name: 'Hotel Pearl Palace', area: 'Hathroi Fort / MI Road', tier: 'Budget', nightlyUsd: 28, why: 'Heritage haveli energy, rooftop views, walking distance to old city.', amenities: ['Rooftop', 'Free breakfast', 'Wi-Fi'] },
    { name: 'Trident Jaipur', area: 'Amber Road / Jal Mahal', tier: 'Moderate', nightlyUsd: 95, why: 'Lake-facing calm, reliable service, easy Amber Fort hop.', amenities: ['Pool', 'Spa', 'Lake view'] },
    { name: 'Rambagh Palace', area: 'Bhawani Singh Road', tier: 'Luxury', nightlyUsd: 320, why: 'The former royal residence — courtyards, peacocks, and palatial dining.', amenities: ['Palace grounds', 'Spa', 'Fine dining'] }
  ],
  'new delhi': [
    { name: 'Bloomrooms @ Janpath', area: 'Janpath / Connaught Place', tier: 'Budget', nightlyUsd: 32, why: 'Clean rooms on the Metro, walk to India Gate axis.', amenities: ['Metro access', 'AC', 'Café'] },
    { name: 'The Imperial New Delhi', area: 'Janpath', tier: 'Luxury', nightlyUsd: 280, why: 'Art-deco icon with Lutyens gardens and legendary spice route dining.', amenities: ['Heritage', 'Pool', 'Spa'] },
    { name: 'ITC Maurya', area: 'Diplomatic Enclave', tier: 'Luxury', nightlyUsd: 210, why: 'Bukhara and Dum Pukht under one roof; airport-side convenience.', amenities: ['Bukhara', 'Pool', 'Club floors'] }
  ],
  mumbai: [
    { name: 'Abode Bombay', area: 'Colaba', tier: 'Moderate', nightlyUsd: 70, why: 'Design hotel steps from Gateway of India and Causeway.', amenities: ['Boutique', 'Café', 'Walkable Colaba'] },
    { name: 'Taj Mahal Palace', area: 'Apollo Bunder', tier: 'Luxury', nightlyUsd: 350, why: 'The city’s landmark stay facing the Gateway and harbour.', amenities: ['Harbour view', 'Spa', 'Sea Lounge'] },
    { name: 'Ginger Mumbai Andheri', area: 'Andheri East', tier: 'Budget', nightlyUsd: 40, why: 'Airport-side, Metro-linked, good for early flights.', amenities: ['Airport hop', 'Wi-Fi', 'Cafe'] }
  ],
  varanasi: [
    { name: 'Ganpati Guesthouse', area: 'Meer Ghat', tier: 'Budget', nightlyUsd: 22, why: 'Ghat-side rooms for sunrise boats without a taxi.', amenities: ['Ghat view', 'Rooftop', 'Boat desk'] },
    { name: 'BrijRama Palace', area: 'Darbhanga Ghat', tier: 'Luxury', nightlyUsd: 180, why: 'Restored palace on the Ganga with aarti from the terrace.', amenities: ['Ganga terrace', 'Heritage', 'Aarti view'] }
  ],
  goa: [
    { name: 'The Hosteller Goa', area: 'Palolem / South', tier: 'Budget', nightlyUsd: 30, why: 'Social stay on the quieter southern crescent.', amenities: ['Beach walk', 'Cafe', 'Dorms & rooms'] },
    { name: 'Taj Fort Aguada Resort', area: 'Candolim', tier: 'Luxury', nightlyUsd: 260, why: 'Fort-side Arabian Sea lawns, classic North Goa luxury.', amenities: ['Beach', 'Fort views', 'Pools'] }
  ],
  panaji: [
    { name: 'The Hosteller Goa', area: 'Panjim / Fontainhas access', tier: 'Budget', nightlyUsd: 32, why: 'Easy hop to Latin Quarter and Mandovi sunset.', amenities: ['River access', 'Cafe'] },
    { name: 'Vivanta Goa Panaji', area: 'D.B. Bandodkar Road', tier: 'Moderate', nightlyUsd: 110, why: 'River-facing rooms and a 10-minute stroll to Fontainhas.', amenities: ['Pool', 'River view'] }
  ],
  udaipur: [
    { name: 'Hotel Raja Bagh Palace', area: 'Old City / Gangaur Ghat', tier: 'Budget', nightlyUsd: 35, why: 'Lake views without palace prices; boat ghat downstairs.', amenities: ['Lake view', 'Rooftop'] },
    { name: 'Taj Lake Palace', area: 'Lake Pichola', tier: 'Luxury', nightlyUsd: 480, why: 'The marble island palace — arrive by boat.', amenities: ['Island', 'Boat arrival', 'Spa'] }
  ],
  agra: [
    { name: 'Hotel Kamal', area: 'Taj Ganj', tier: 'Budget', nightlyUsd: 20, why: 'Rooftop Taj views, 5 minutes to East Gate sunrise.', amenities: ['Taj view rooftop', 'Walk to gate'] },
    { name: 'The Oberoi Amarvilas', area: 'Taj East Gate Road', tier: 'Luxury', nightlyUsd: 420, why: 'Every room faces the Taj — the gold standard stay.', amenities: ['Taj view', 'Spa', 'Pool'] }
  ],
  bengaluru: [
    { name: 'The Hosteller Bangalore', area: 'MG Road / Church Street', tier: 'Budget', nightlyUsd: 28, why: 'Walkable CBD, Metro, Church Street food.', amenities: ['Metro', 'Cafe'] },
    { name: 'The Ritz-Carlton Bangalore', area: 'Residency Road', tier: 'Luxury', nightlyUsd: 240, why: 'Garden-city luxe with a sky bar over the CBD.', amenities: ['Spa', 'Pool', 'Club'] }
  ],
  kochi: [
    { name: 'Brunton Boatyard', area: 'Fort Kochi', tier: 'Luxury', nightlyUsd: 200, why: 'Harbour-front heritage, Chinese nets at the door.', amenities: ['Harbour', 'Heritage'] },
    { name: 'Fort House', area: 'Fort Kochi jetty', tier: 'Budget', nightlyUsd: 35, why: 'Jetty-side, walk the entire heritage peninsula.', amenities: ['Waterfront', 'Walkable'] }
  ],
  manali: [
    { name: 'Zostel Manali', area: 'Old Manali / Mall', tier: 'Budget', nightlyUsd: 18, why: 'Backpacker hub with mountain café culture.', amenities: ['Cafe', 'Tours desk'] },
    { name: 'The Himalayan', area: 'Naggar Road', tier: 'Luxury', nightlyUsd: 160, why: 'Stone-and-wood estate with Dhauladhar-style drama.', amenities: ['Valley view', 'Fireplace'] }
  ],
  leh: [
    { name: 'The Grand Dragon Ladakh', area: 'Old Road', tier: 'Luxury', nightlyUsd: 150, why: 'Oxygen-supported rooms — smart after the DEL flight.', amenities: ['Oxygen', 'Spa'] },
    { name: 'Hotel Oom', area: 'Main Bazaar', tier: 'Budget', nightlyUsd: 25, why: 'Walkable bazaar stay for acclimatisation day one.', amenities: ['Bazaar', 'Wi-Fi'] }
  ]
};

const CITY_FOOD: Record<string, FoodSeed[]> = {
  jaipur: [
    { name: 'Laxmi Mishthan Bhandar (LMB)', cuisine: 'Rajasthani vegetarian', area: 'Johari Bazaar', meal: 'Lunch', priceForTwoInr: 900, signature: 'Dal baati churma thali & ghewar', vegFriendly: true },
    { name: 'Tapri Central', cuisine: 'Cafe / chai', area: 'C-Scheme', meal: 'Cafe', priceForTwoInr: 800, signature: 'Kullad chai, tapri sandwiches', vegFriendly: true },
    { name: 'Suvarna Mahal', cuisine: 'Royal Rajasthani', area: 'Rambagh Palace', meal: 'Dinner', priceForTwoInr: 7000, signature: 'Palace thali, laal maas', vegFriendly: true },
    { name: 'Rawat Mishthan Bhandar', cuisine: 'Street kachori', area: 'Station Road', meal: 'Breakfast', priceForTwoInr: 250, signature: 'Pyaz kachori & lassi', vegFriendly: true }
  ],
  'new delhi': [
    { name: 'Karim’s', cuisine: 'Mughlai', area: 'Jama Masjid', meal: 'Lunch', priceForTwoInr: 1200, signature: 'Burra kebab, mutton stew', vegFriendly: false },
    { name: 'Andhra Bhawan Canteen', cuisine: 'Andhra vegetarian', area: 'Ashoka Road', meal: 'Lunch', priceForTwoInr: 400, signature: 'Unlimited meals, gongura', vegFriendly: true },
    { name: 'Indian Accent', cuisine: 'Modern Indian', area: 'Lodhi Road', meal: 'Dinner', priceForTwoInr: 12000, signature: 'Meetha acchaar pork, kulcha', vegFriendly: true },
    { name: 'Natraj Dahi Bhalle Wale', cuisine: 'Chaat', area: 'Chandni Chowk', meal: 'Street food', priceForTwoInr: 200, signature: 'Dahi bhalle, stuffed aloo tikki', vegFriendly: true }
  ],
  mumbai: [
    { name: 'Bademiya', cuisine: 'Kebabs / rolls', area: 'Colaba', meal: 'Dinner', priceForTwoInr: 800, signature: 'Late-night seekh rolls', vegFriendly: false },
    { name: 'Kailash Parbat', cuisine: 'Sindhi vegetarian', area: 'Colaba', meal: 'Lunch', priceForTwoInr: 900, signature: 'Paneer pakora, dal pakwan', vegFriendly: true },
    { name: 'Trishna', cuisine: 'Coastal seafood', area: 'Kala Ghoda', meal: 'Dinner', priceForTwoInr: 4500, signature: 'Butter garlic crab', vegFriendly: false },
    { name: 'Kyani & Co.', cuisine: 'Irani cafe', area: 'Marine Lines', meal: 'Breakfast', priceForTwoInr: 400, signature: 'Brun maska, kheema pav, chai', vegFriendly: true }
  ],
  varanasi: [
    { name: 'Blue Lassi', cuisine: 'Lassi house', area: 'Near Kashi Vishwanath', meal: 'Street food', priceForTwoInr: 200, signature: 'Banana lassi in clay kulhad', vegFriendly: true },
    { name: 'Deena Chaat Bhandar', cuisine: 'Banarasi chaat', area: 'Dashashwamedh', meal: 'Lunch', priceForTwoInr: 250, signature: 'Tamatar chaat, palak chaat', vegFriendly: true },
    { name: 'Pizzeria Vaatika Cafe', cuisine: 'Cafe / Italian', area: 'Assi Ghat', meal: 'Dinner', priceForTwoInr: 1200, signature: 'Ghat-side pizza, lassi', vegFriendly: true }
  ],
  agra: [
    { name: 'Pinch of Spice', cuisine: 'North Indian', area: 'Fatehabad Road', meal: 'Dinner', priceForTwoInr: 1800, signature: 'Mughlai gravies, tandoor', vegFriendly: true },
    { name: 'Shankar Bhog', cuisine: 'Vegetarian thali', area: 'Taj Ganj', meal: 'Lunch', priceForTwoInr: 500, signature: 'Unlimited thali after the Taj', vegFriendly: true }
  ],
  udaipur: [
    { name: 'Ambrai', cuisine: 'Rajasthani / lake view', area: 'Amet Haveli, Gangaur Ghat', meal: 'Dinner', priceForTwoInr: 2800, signature: 'Lake Palace floodlit dinner', vegFriendly: true },
    { name: 'Natraj Dining Hall', cuisine: 'Gujarati-Rajasthani thali', area: 'City Station Road', meal: 'Lunch', priceForTwoInr: 500, signature: 'Unlimited thali', vegFriendly: true }
  ],
  mumbai_extra: [],
  kochi: [
    { name: 'Kashi Art Cafe', cuisine: 'Cafe', area: 'Burgher Street, Fort Kochi', meal: 'Breakfast', priceForTwoInr: 900, signature: 'Filter coffee, cakes, courtyard', vegFriendly: true },
    { name: 'Kayees Rahmathulla Hotel', cuisine: 'Malabar biryani', area: 'Mattancherry', meal: 'Lunch', priceForTwoInr: 600, signature: 'Legendary dum biryani', vegFriendly: false }
  ],
  bengaluru: [
    { name: 'MTR', cuisine: 'Karnataka vegetarian', area: 'Lalbagh Road', meal: 'Breakfast', priceForTwoInr: 700, signature: 'Rava idli, filter coffee', vegFriendly: true },
    { name: 'Toit', cuisine: 'Brewpub', area: 'Indiranagar', meal: 'Dinner', priceForTwoInr: 2000, signature: 'Craft beer, wood-fired pies', vegFriendly: true }
  ]
};

function keyCity(city: string): string {
  return city.toLowerCase().replace(/\(.*?\)/g, '').trim();
}

function pickHotels(city: string): HotelSeed[] {
  const k = keyCity(city);
  if (CITY_HOTELS[k]) return CITY_HOTELS[k];
  if (k.includes('delhi')) return CITY_HOTELS['new delhi'];
  if (k.includes('goa') || k.includes('calangute') || k.includes('palolem')) return CITY_HOTELS.goa;
  const generic: HotelSeed[] = [
    { name: `Treebo / FabHotel ${city} Centre`, area: `Central ${city}`, tier: 'Budget', nightlyUsd: 25, why: `Reliable budget brand in the walkable core of ${city}.`, amenities: ['Wi-Fi', 'AC', 'Breakfast'] },
    { name: `Lemon Tree / Ginger ${city}`, area: `${city} business district`, tier: 'Moderate', nightlyUsd: 70, why: `Mid-range comfort with restaurant and airport cabs.`, amenities: ['Restaurant', 'Gym', 'Airport desk'] },
    { name: `Taj / ITC / Marriott ${city}`, area: `${city} premium district`, tier: 'Luxury', nightlyUsd: 180, why: `Full-service luxury with spa and the city’s best breakfast buffet.`, amenities: ['Pool', 'Spa', 'Club lounge'] }
  ];
  return generic;
}

function pickFood(city: string): FoodSeed[] {
  const k = keyCity(city);
  if (CITY_FOOD[k]) return CITY_FOOD[k];
  if (k.includes('delhi')) return CITY_FOOD['new delhi'];
  return [
    { name: `${city} thali house`, cuisine: 'Regional vegetarian thali', area: `Old ${city}`, meal: 'Lunch', priceForTwoInr: 600, signature: 'Unlimited local thali', vegFriendly: true },
    { name: `${city} cafe courtyard`, cuisine: 'Cafe', area: `${city} new town`, meal: 'Cafe', priceForTwoInr: 800, signature: 'Filter coffee / chai, sandwiches', vegFriendly: true },
    { name: `${city} night market stalls`, cuisine: 'Street food', area: `Main bazaar`, meal: 'Street food', priceForTwoInr: 350, signature: 'Follow the longest queue', vegFriendly: true },
    { name: `${city} rooftop dinner`, cuisine: 'North Indian / local', area: `Heritage precinct`, meal: 'Dinner', priceForTwoInr: 1800, signature: 'Sunset views + tandoor', vegFriendly: true }
  ];
}

export function buildStayAndDine(
  city: string,
  budget: BudgetLevel,
  nights: number,
  checkin: string,
  checkout: string
): { hotels: HotelStay[]; restaurants: RestaurantPick[] } {
  const hotelNights = Math.max(1, nights);
  const hotels = pickHotels(city)
    .filter((h) => (budget === 'Budget' ? h.tier !== 'Luxury' : budget === 'Luxury' ? true : h.tier !== 'Luxury' || true))
    .map((h, i) => ({
      id: `hotel-${i}-${h.name}`,
      name: h.name,
      area: h.area,
      tier: h.tier,
      nights: hotelNights,
      nightlyUsd: h.nightlyUsd,
      nightlyInr: Math.round(h.nightlyUsd * 84.5),
      totalUsd: h.nightlyUsd * hotelNights,
      totalInr: Math.round(h.nightlyUsd * 84.5 * hotelNights),
      why: h.why,
      amenities: h.amenities,
      mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(h.name + ' ' + city)}`,
      bookingLinks: hotelBookingLinks(city, h.name, checkin, checkout)
    }));

  // Always include one option of each tier if we have them
  const restaurants = pickFood(city).map((r, i) => ({
    id: `food-${i}-${r.name}`,
    name: r.name,
    cuisine: r.cuisine,
    area: r.area,
    meal: r.meal,
    priceForTwoInr: r.priceForTwoInr,
    signature: r.signature,
    vegFriendly: r.vegFriendly,
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.name + ' ' + city)}`,
    bookingLinks: restaurantBookingLinks(city, r.name)
  }));

  return { hotels, restaurants };
}
