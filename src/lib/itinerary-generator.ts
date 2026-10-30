import {
  ActivitySlot,
  DayPlan,
  FullItinerary,
  UserPreferences,
  SlotType
} from '@/types/travel';
import { DESTINATION_DATABASE, findDestination } from './destination-data';
import { planJourney } from './journey-planner';
import { attachLegBookingLinks, mapsSearchUrl, mapsDirectionsUrl } from './booking-links';
import { buildStayAndDine } from './stay-and-dine';

// Helper to format date string
export function formatDate(dateStr: string, addDays: number): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
      const now = new Date();
      now.setDate(now.getDate() + addDays);
      return now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }
    d.setDate(d.getDate() + addDays);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  } catch {
    return `Day ${addDays + 1}`;
  }
}

// Generate an activity slot
function createSlot(
  id: string,
  slotType: SlotType,
  timeSlot: string,
  title: string,
  category: ActivitySlot['category'],
  locationCluster: string,
  neighborhood: string,
  description: string,
  insiderTip: string,
  baseCostUsd: number,
  exchangeRate: number,
  localCode: string,
  localSymbol: string,
  durationHours: number,
  tags: string[],
  transitTip?: string
): ActivitySlot {
  const estimatedCostUsd = Math.round(baseCostUsd);
  const estimatedCostInr = Math.round(baseCostUsd * 84.5);
  const estimatedCostLocal = Math.round(baseCostUsd * exchangeRate);

  return {
    id,
    slotType,
    timeSlot,
    title,
    category,
    locationCluster,
    neighborhood,
    description,
    insiderTip,
    estimatedCostUsd,
    estimatedCostInr,
    estimatedCostLocal,
    localCurrencyCode: localCode,
    localCurrencySymbol: localSymbol,
    durationHours,
    tags,
    transitTip,
    isCustomized: false,
    mapsUrl: mapsSearchUrl(`${title} ${neighborhood}`)
  };
}

// Destination theme and cluster generator
export function generateItinerary(prefs: UserPreferences): FullItinerary {
  const destName = prefs.destination.trim();
  const originName = (prefs.originCity || 'New Delhi').trim();
  const matchedPreset = findDestination(destName) || DESTINATION_DATABASE[0];
  const isPresetMatch = !!findDestination(destName);

  const city = isPresetMatch ? matchedPreset.city : destName || 'Dream City';
  const country = isPresetMatch ? matchedPreset.country : 'Global Gem';
  const startDate = prefs.startDate || new Date().toISOString().split('T')[0];
  const endDate = prefs.endDate || new Date(Date.now() + (prefs.durationDays || 3) * 86400000).toISOString().split('T')[0];
  let journey = planJourney(originName, destName || city, prefs.budgetLevel);
  journey = {
    ...journey,
    mapsDirectionsUrl: mapsDirectionsUrl(journey.originCity, journey.destinationCity, journey.outbound.mode === 'Car' ? 'driving' : 'transit'),
    outbound: attachLegBookingLinks(journey.outbound, journey.originCity, journey.destinationCity, startDate),
    alternatives: journey.alternatives.map((leg) =>
      attachLegBookingLinks(leg, journey.originCity, journey.destinationCity, startDate)
    ),
    returnLeg: attachLegBookingLinks(journey.returnLeg, journey.destinationCity, journey.originCity, endDate)
  };
  const stayAndDine = buildStayAndDine(city, prefs.budgetLevel, Math.max(1, (prefs.durationDays || 3) - 1), startDate, endDate);
  const localCode = matchedPreset.localCurrencyCode;
  const localSymbol = matchedPreset.localCurrencySymbol;
  const exchangeRate = matchedPreset.exchangeRateUsdToLocal;

  // Budget factor multiplier
  const budgetMult = prefs.budgetLevel === 'Budget' ? 0.65 : prefs.budgetLevel === 'Luxury' ? 2.1 : 1.0;

  const days: DayPlan[] = [];
  let runningCostUsd = 0;
  let runningCostInr = 0;
  let runningCostLocal = 0;

  const duration = Math.min(Math.max(prefs.durationDays || 3, 1), 10);

  // Define unique cluster themes for days
  let clusterThemes = [
    {
      theme: 'Historic Core & Heritage Treasures',
      clusterName: `${city} Old Town & Cultural Quadrant`,
      hubArea: `Central ${city} Heritage District`,
      transitAdvantage: 'High-density walking corridor; eliminates transit fatigue by keeping stops under 800m apart.',
      walkingRadiusKm: 2.2,
      transitMins: 20,
      transport: 'Metro line or pedestrian boulevards',
      morning: {
        title: `Majestic ${city} Historic Citadel & Landmark Squares`,
        category: 'Culture' as const,
        desc: `Unpack architectural marvels, centuries-old ramparts, and iconic civic plazas before mid-day crowds gather.`,
        tip: `Early entry guarantees quiet courtyard photography and shorter queue lines.`,
        cost: 15 * budgetMult,
        tags: ['Architecture', 'Historical', 'Must-See']
      },
      lunch: {
        title: `Artisanal Bistro & Heritage Recipe Tasting`,
        category: 'Dining' as const,
        desc: `Savor authentic regional delicacies, crusty fresh breads, seasonal salads, and local vintage refreshments.`,
        tip: `Ask the server for their house specialty and seasonal chef's daily recommendation.`,
        cost: 25 * budgetMult,
        tags: ['Gastronomy', 'Local Flavors', 'Cozy Ambience']
      },
      afternoon: {
        title: `${city} Fine Arts Gallery & Old Quarter Artisan Workshops`,
        category: 'Sightseeing' as const,
        desc: `Explore world-class exhibitions, handcrafted leather/ceramic ateliers, and hidden shaded courtyards.`,
        tip: `Pick up handmade souvenirs directly from local craftspeople on the side alleys.`,
        cost: 18 * budgetMult,
        tags: ['Art', 'Crafts', 'Hidden Gems']
      },
      evening: {
        title: `Atmospheric Riverside Promenade & Lantern-Lit Dining`,
        category: 'Dining' as const,
        desc: `Dine al fresco along the illuminated waterfront with candle-lit tables, artisanal desserts, and ambient acoustic music.`,
        tip: `Reserve a riverfront patio table for uninterrupted golden-hour and dusk reflections.`,
        cost: 35 * budgetMult,
        tags: ['Waterfront', 'Night Ambience', 'Fine Dining']
      }
    },
    {
      theme: 'Modern Architecture, Vibrant Markets & Panoramic Views',
      clusterName: `${city} Uptown Skyline & Arts Quarter`,
      hubArea: `Modern Business & Design Corridor`,
      transitAdvantage: 'Grouped along the main rapid transit line; zero backtracking across suburbs.',
      walkingRadiusKm: 2.8,
      transitMins: 25,
      transport: 'High-speed light rail or electric bicycles',
      morning: {
        title: `Panoramic Skyscraper Observation Deck & Sky Garden`,
        category: 'Sightseeing' as const,
        desc: `Take the express elevator 60 floors up to experience sweeping 360-degree vistas across the entire metropolitan skyline.`,
        tip: `Complimentary digital binoculars are available at the south-facing deck.`,
        cost: 28 * budgetMult,
        tags: ['Skyline Views', 'Modern Wonder', 'Photography']
      },
      lunch: {
        title: `Celebrated Gourmet Food Market Hall`,
        category: 'Dining' as const,
        desc: `Wander vibrant market lanes featuring fresh culinary stalls, gourmet sandwiches, dumplings, and fresh tropical pressed juices.`,
        tip: `Try 2 to 3 small plates from distinct food stalls for an expansive culinary tour.`,
        cost: 20 * budgetMult,
        tags: ['Food Hall', 'Variety', 'Street Food']
      },
      afternoon: {
        title: `Contemporary Design Museum & Botanical Sculpture Gardens`,
        category: 'Leisure' as const,
        desc: `Discover innovative contemporary exhibits, interactive digital art, and calm fountains nestled among manicured trees.`,
        tip: `The sculpture garden outdoor café offers superb cold brews and tranquil seating.`,
        cost: 16 * budgetMult,
        tags: ['Modern Art', 'Botanical Gardens', 'Relaxing']
      },
      evening: {
        title: `Rooftop Sunset Lounge & Craft Mixology`,
        category: 'Nightlife' as const,
        desc: `Sip signature botanical cocktails or mocktails paired with tapas as the city lights illuminate under twilight skies.`,
        tip: `Smart casual attire recommended; arrive 40 minutes before sundown.`,
        cost: 40 * budgetMult,
        tags: ['Rooftop View', 'Nightlife', 'Sunset Glow']
      }
    },
    {
      theme: 'Nature Sanctuary, Coastal Breezes & Hidden Alleys',
      clusterName: `${city} Green Belt & Historic Waterfront`,
      hubArea: `Coastal/Riverside & Parks Reserve`,
      transitAdvantage: 'Continuous pedestrian and bike greenway; avoids metropolitan traffic jams.',
      walkingRadiusKm: 3.2,
      transitMins: 15,
      transport: 'Electric ferry, scenic tramway, or bicycle rental',
      morning: {
        title: `Botanical Forest Sanctuary Trail & Bamboo Walk`,
        category: 'Adventure' as const,
        desc: `Breathe fresh crisp air while hiking through ancient tree canopies, moss-laden stone bridges, and hidden reflection ponds.`,
        tip: `Wear comfortable supportive footwear and keep a light hydration bottle.`,
        cost: 10 * budgetMult,
        tags: ['Nature Trail', 'Fresh Air', 'Wellness']
      },
      lunch: {
        title: `Farm-to-Table Organic Garden Pavilion`,
        category: 'Dining' as const,
        desc: `Enjoy freshly harvested heirloom garden vegetables, wood-fired artisan flatbreads, and herbal iced infusions.`,
        tip: `The chef’s garden tasting platter showcases 10 seasonal local herbs.`,
        cost: 22 * budgetMult,
        tags: ['Farm to Table', 'Healthy', 'Vegetarian Friendly']
      },
      afternoon: {
        title: `Harbor Boat Excursion or Kayak Paddle Along Coastal Bluffs`,
        category: 'Adventure' as const,
        desc: `Take to the water for a refreshing perspectives of sea cliffs, historical lighthouses, and marine seabird colonies.`,
        tip: `Waterproof bags are provided at the dock for cameras and mobile devices.`,
        cost: 32 * budgetMult,
        tags: ['On The Water', 'Adventure', 'Scenic Views']
      },
      evening: {
        title: `Seaside Seafood / Authentic Stew Supper with Live Folk Music`,
        category: 'Dining' as const,
        desc: `Relish freshly caught fish, saffron stews, or savory dumplings accompanied by melodic local acoustic guitarists.`,
        tip: `Book an outdoor harbor table to enjoy the sea breeze.`,
        cost: 34 * budgetMult,
        tags: ['Seafood / Local', 'Live Music', 'Atmospheric']
      }
    },
    {
      theme: 'Bohemian Neighborhoods, Indie Cafes & Night Bazaars',
      clusterName: `${city} Bohemian Arts & Vintage District`,
      hubArea: `Artisan Quarter & Canal Ways`,
      transitAdvantage: 'Compact historic alley network easily covered on foot; zero vehicular delays.',
      walkingRadiusKm: 2.0,
      transitMins: 10,
      transport: 'Walking & vintage tram',
      morning: {
        title: `Artisan Coffee Roastery & Vintage Flea Market Exploration`,
        category: 'Culture' as const,
        desc: `Start with single-origin pour-overs and freshly baked cardamom buns, then browse vintage vinyl and antique maps.`,
        tip: `Bargaining with stall vendors is friendly and welcomed for multi-item purchases.`,
        cost: 12 * budgetMult,
        tags: ['Coffee Culture', 'Vintage Flea', 'Bohemian']
      },
      lunch: {
        title: `Secret Courtyard Trattoria / Noodle Den`,
        category: 'Dining' as const,
        desc: `Tucked behind ivy archways, serving handcrafted pasta or steaming broths passed down across three family generations.`,
        tip: `Cash payment appreciated by this family-operated hidden jewel.`,
        cost: 18 * budgetMult,
        tags: ['Hidden Gem', 'Family Owned', 'Comfort Food']
      },
      afternoon: {
        title: `Independent Art Collectives & Canal Footbridge Walk`,
        category: 'Leisure' as const,
        desc: `Discover thought-provoking street art murals, boutique bookshops, and romantic iron footbridges over waterways.`,
        tip: `Check out the community pinboard for evening poetry readings and indie acoustic sets.`,
        cost: 8 * budgetMult,
        tags: ['Street Art', 'Canal Walk', 'Indie Culture']
      },
      evening: {
        title: `Bustling Lantern Night Bazaar & Street Food Extravaganza`,
        category: 'Nightlife' as const,
        desc: `Immerse in radiant colored lanterns, sizzling hot griddles, sweet dessert crepes, and vibrant local evening chatter.`,
        tip: `Follow the longest queues for the freshest and most delicious street delicacies.`,
        cost: 20 * budgetMult,
        tags: ['Night Market', 'Street Food Crawl', 'Lively Vibe']
      }
    }
  ];

  if (isPresetMatch && matchedPreset.clusters?.length) {
    clusterThemes = matchedPreset.clusters.map((cluster) => ({
      theme: cluster.clusterName,
      clusterName: cluster.clusterName,
      hubArea: cluster.hubArea,
      transitAdvantage: cluster.transitAdvantage,
      walkingRadiusKm: cluster.walkingRadiusKm,
      transitMins: Math.max(10, Math.round(cluster.walkingRadiusKm * 12)),
      transport: cluster.recommendedTransport,
      morning: {
        title: cluster.sampleMorning.title,
        category: cluster.sampleMorning.category,
        desc: cluster.sampleMorning.description,
        tip: cluster.sampleMorning.tip,
        cost: cluster.sampleMorning.costUsd * budgetMult,
        tags: cluster.sampleMorning.tags
      },
      lunch: {
        title: cluster.sampleLunch.title,
        category: cluster.sampleLunch.category,
        desc: cluster.sampleLunch.description,
        tip: cluster.sampleLunch.tip,
        cost: cluster.sampleLunch.costUsd * budgetMult,
        tags: cluster.sampleLunch.tags
      },
      afternoon: {
        title: cluster.sampleAfternoon.title,
        category: cluster.sampleAfternoon.category,
        desc: cluster.sampleAfternoon.description,
        tip: cluster.sampleAfternoon.tip,
        cost: cluster.sampleAfternoon.costUsd * budgetMult,
        tags: cluster.sampleAfternoon.tags
      },
      evening: {
        title: cluster.sampleEvening.title,
        category: cluster.sampleEvening.category,
        desc: cluster.sampleEvening.description,
        tip: cluster.sampleEvening.tip,
        cost: cluster.sampleEvening.costUsd * budgetMult,
        tags: cluster.sampleEvening.tags
      }
    }));
  }

  for (let i = 0; i < duration; i++) {
    const template = clusterThemes[i % clusterThemes.length];
    const dateLabel = formatDate(prefs.startDate, i);

    // Morning
    const morningSlot = createSlot(
      `day-${i + 1}-morning`,
      'morning',
      '09:00 AM - 12:30 PM',
      template.morning.title,
      template.morning.category,
      template.clusterName,
      template.hubArea,
      template.morning.desc,
      template.morning.tip,
      template.morning.cost,
      exchangeRate,
      localCode,
      localSymbol,
      3.5,
      template.morning.tags,
      `Walk 5-10 mins from your morning hub; no crosstown transit needed.`
    );

    // Lunch
    const lunchSlot = createSlot(
      `day-${i + 1}-lunch`,
      'lunch',
      '12:30 PM - 02:00 PM',
      template.lunch.title,
      template.lunch.category,
      template.clusterName,
      template.hubArea,
      template.lunch.desc,
      template.lunch.tip,
      template.lunch.cost,
      exchangeRate,
      localCode,
      localSymbol,
      1.5,
      template.lunch.tags,
      `Located directly within 400m of morning activity.`
    );

    // Afternoon
    const afternoonSlot = createSlot(
      `day-${i + 1}-afternoon`,
      'afternoon',
      '02:30 PM - 05:30 PM',
      template.afternoon.title,
      template.afternoon.category,
      template.clusterName,
      template.hubArea,
      template.afternoon.desc,
      template.afternoon.tip,
      template.afternoon.cost,
      exchangeRate,
      localCode,
      localSymbol,
      3.0,
      template.afternoon.tags,
      `Easy 8-minute scenic walk along ${template.hubArea}.`
    );

    // Evening
    const eveningSlot = createSlot(
      `day-${i + 1}-evening`,
      'evening',
      '06:30 PM - 10:00 PM',
      template.evening.title,
      template.evening.category,
      template.clusterName,
      template.hubArea,
      template.evening.desc,
      template.evening.tip,
      template.evening.cost,
      exchangeRate,
      localCode,
      localSymbol,
      3.5,
      template.evening.tags,
      `Transit back to hotel via ${template.transport}.`
    );

    const dayUsd = morningSlot.estimatedCostUsd + lunchSlot.estimatedCostUsd + afternoonSlot.estimatedCostUsd + eveningSlot.estimatedCostUsd;
    const dayInr = morningSlot.estimatedCostInr + lunchSlot.estimatedCostInr + afternoonSlot.estimatedCostInr + eveningSlot.estimatedCostInr;
    const dayLocal = morningSlot.estimatedCostLocal + lunchSlot.estimatedCostLocal + afternoonSlot.estimatedCostLocal + eveningSlot.estimatedCostLocal;

    runningCostUsd += dayUsd;
    runningCostInr += dayInr;
    runningCostLocal += dayLocal;

    days.push({
      dayNumber: i + 1,
      dateLabel,
      theme: template.theme,
      geographicCluster: {
        clusterName: template.clusterName,
        hubArea: template.hubArea,
        transitAdvantage: template.transitAdvantage,
        walkingRadiusKm: template.walkingRadiusKm,
        estimatedTransitTimeMins: template.transitMins,
        recommendedTransport: template.transport
      },
      slots: {
        morning: morningSlot,
        lunch: lunchSlot,
        afternoon: afternoonSlot,
        evening: eveningSlot
      },
      dailyCostUsd: dayUsd,
      dailyCostInr: dayInr,
      dailyCostLocal: dayLocal,
      cumulativeCostUsd: runningCostUsd,
      cumulativeCostInr: runningCostInr,
      cumulativeCostLocal: runningCostLocal
    });
  }

  // Emergency contacts
  const emergencyContacts = matchedPreset.emergencyContacts || {
    country,
    police: '112',
    ambulance: '112',
    fire: '112',
    touristPolice: '112',
    embassyNotice: `Consular Assistance: Check with your national foreign affairs portal for ${country} locations.`,
    nearestMedicalHub: `Central University Hospital & Emergency Trauma Care in ${city}`,
    internationalDialCode: '+00',
    emergencyApps: ['Google Maps Offline', 'Local Emergency 112 App']
  };

  const packingChecklist = matchedPreset.packingList || [
    'Passport with 6+ months validity & printed copies',
    'Universal international plug adapter',
    'Comfortable broken-in walking shoes',
    'Weather appropriate lightweight layering clothing',
    'Personal prescription medications & travel first-aid kit',
    'Refillable insulated water bottle'
  ];

  const transitGuidelines = [
    `Getting there: ${journey.outbound.mode} ${journey.originCity} → ${journey.destinationCity} (${journey.outbound.durationLabel}, ~${journey.distanceKm} km).`,
    journey.lastMile,
    ...(matchedPreset.transitGuidelines || [
      `Download local transit app for ${city} subway and bus routing.`,
      'Keep your hotel address card written in local language for taxi drivers.',
      'Group your daily activities geographically to minimize transit exhaustion.'
    ]),
    ...journey.bookingTips.slice(0, 2)
  ];

  const travelUsd = journey.sameCity ? 0 : journey.totalTransitUsd;
  const travelInr = journey.sameCity ? 0 : journey.totalTransitInr;
  const travelLocal = Math.round(travelUsd * exchangeRate);

  return {
    title: journey.sameCity
      ? `${duration}-Day Tailored ${city} Journey`
      : `${duration}-Day ${city} Journey from ${journey.originCity}`,
    originCity: journey.originCity,
    originCountry: journey.originCountry,
    destination: city,
    country,
    journey,
    vibe: prefs.vibe,
    durationDays: duration,
    startDate,
    endDate,
    budgetLevel: prefs.budgetLevel,
    travelParty: prefs.travelParty,
    pace: prefs.pace,
    interests: prefs.interests || ['Culture', 'Gastronomy', 'Sightseeing'],
    currency: prefs.currency || 'INR',
    totalCostUsd: runningCostUsd + travelUsd,
    totalCostInr: runningCostInr + travelInr,
    totalCostLocal: runningCostLocal + travelLocal,
    localCurrencyCode: localCode,
    localCurrencySymbol: localSymbol,
    days,
    emergencyContacts,
    packingChecklist,
    transitGuidelines,
    hotels: stayAndDine.hotels,
    restaurants: stayAndDine.restaurants,
    weatherAdvisory: matchedPreset.weatherSummary,
    vibeCompatibilityScore: 94
  };
}

// Slot swap preset alternatives
export const SWAP_CATALOG: Record<string, {
  title: string;
  category: ActivitySlot['category'];
  description: string;
  insiderTip: string;
  costUsd: number;
  tags: string[];
}[]> = {
  morning: [
    {
      title: 'Sunrise Yoga & Serene Botanical Walk',
      category: 'Leisure',
      description: 'Start with guided mindfulness breathing among dewy gardens, lotus ponds, and calm morning birdsong.',
      insiderTip: 'Mats are available on loan; bring a lightweight shawl for the cool early air.',
      costUsd: 12,
      tags: ['Wellness', 'Mindfulness', 'Peaceful']
    },
    {
      title: 'Artisan Farmers Market & Fresh Bakery Crawl',
      category: 'Sightseeing',
      description: 'Stroll lively open-air stalls filled with fresh organic berries, hand-churned butter, sourdough, and local honey.',
      insiderTip: 'Sample the warm cinnamon buns straight from the brick oven at 08:30 AM.',
      costUsd: 15,
      tags: ['Outdoor Market', 'Fresh Food', 'Vibrant']
    },
    {
      title: 'Electric E-Bike Coastal & Historic Architecture Tour',
      category: 'Adventure',
      description: 'Glide effortlessly along scenic waterfronts and historic alleys on whisper-quiet pedal-assist electric bikes.',
      insiderTip: 'Helm and route GPS phone mount provided; easy even for beginners.',
      costUsd: 28,
      tags: ['Active', 'E-Bike', 'Outdoor Views']
    }
  ],
  lunch: [
    {
      title: 'Michelin-Guide Farm-to-Table Vegetarian Garden Bistro',
      category: 'Dining',
      description: 'Creative multi-course plant-based cuisine featuring roasted heirloom beets, truffle gnocchi, and floral cordials.',
      insiderTip: 'The courtyard greenhouse table provides the most charming sunlight.',
      costUsd: 26,
      tags: ['Vegetarian Spot', 'Gourmet', 'Farm Fresh']
    },
    {
      title: 'Hidden Alley Street Noodle / Dumpling Den',
      category: 'Dining',
      description: 'Sizzling hot woks, crispy shallots, hand-pulled noodles, and steaming broth made from a 50-year heritage recipe.',
      insiderTip: 'Order the house-made chili oil crisp on the side for tailored heat.',
      costUsd: 11,
      tags: ['Street Food', 'Comfort Food', 'Budget Friendly']
    },
    {
      title: 'Scenic Waterfront Marina Terrace Seafood Grill',
      category: 'Dining',
      description: 'Catch of the day grilled over olive wood with garlic lemon drizzle, fresh crisp salads, and chilled white wine.',
      insiderTip: 'Ask for the daily catch board rather than the printed menu for freshest fish.',
      costUsd: 32,
      tags: ['Waterfront', 'Seafood', 'Open-Air']
    }
  ],
  afternoon: [
    {
      title: 'Artisan Pottery & Indigo Dyeing Workshop',
      category: 'Culture',
      description: 'Get your hands muddy on the potter\'s wheel or hand-dye silk scarves with master neighborhood artisans.',
      insiderTip: 'Your handmade glazed ceramic piece will be fired and carefully packed for travel.',
      costUsd: 35,
      tags: ['Hands-On', 'Artisan Craft', 'Souvenir']
    },
    {
      title: 'Secret Courtyard Library & Tea Tasting Ceremony',
      category: 'Leisure',
      description: 'Sip ceremonial grade matcha or single-estate loose-leaf infusions in a secluded garden pavilion with antique books.',
      insiderTip: 'Unplug your phone and savor the tranquil water fountain acoustic rhythm.',
      costUsd: 18,
      tags: ['Tranquil', 'Tea Culture', 'Quiet Oasis']
    },
    {
      title: 'Thrill Seekers Coastal Cliff Jump & Sea Kayak Adventure',
      category: 'Adventure',
      description: 'Paddle through limestone sea arches and plunge into crystal-clear turquoise waters with certified safety guides.',
      insiderTip: 'Neoprene booties and dry bags are provided for your equipment.',
      costUsd: 45,
      tags: ['Adrenaline', 'Water Sports', 'Thrill']
    }
  ],
  evening: [
    {
      title: 'Secret Speakeasy Cocktail Experience & Live Jazz',
      category: 'Nightlife',
      description: 'Slip behind an unassuming vintage bookshelf into an intimate mahogany lounge with smoky jazz and craft cocktails.',
      insiderTip: 'Whisper the daily password (available on their Instagram stories) at the entrance door.',
      costUsd: 38,
      tags: ['Speakeasy', 'Live Jazz', 'Cocktails']
    },
    {
      title: 'Sunset Rooftop Lounge & Tapas with 360° Panorama',
      category: 'Dining',
      description: 'Clink glasses 40 floors above street level as the setting sun casts a pink and golden wash over the horizon.',
      insiderTip: 'Book 45 minutes ahead of nautical dusk for the finest photography light.',
      costUsd: 48,
      tags: ['Romantic Rooftop', 'Sunset View', 'Tapas']
    },
    {
      title: 'Illuminated Night Market & Street Performers Walk',
      category: 'Sightseeing',
      description: 'Vibrant neon alleys with buskers, fire jugglers, warm sweet pancakes, and night bazaar artisan trinkets.',
      insiderTip: 'Carry small cash bills for busker tips and street pancake vendors.',
      costUsd: 14,
      tags: ['Night Market', 'Budget Friendly', 'Festive']
    }
  ]
};

// Function to swap an activity slot
export function swapSlot(
  currentSlot: ActivitySlot,
  customVibePrompt?: string,
  preferredPresetIndex?: number
): ActivitySlot {
  const catalogForType = SWAP_CATALOG[currentSlot.slotType] || SWAP_CATALOG.afternoon;
  
  let chosenAlternative;
  if (preferredPresetIndex !== undefined && catalogForType[preferredPresetIndex]) {
    chosenAlternative = catalogForType[preferredPresetIndex];
  } else if (customVibePrompt) {
    // Select the best match or generate custom
    const lowerPrompt = customVibePrompt.toLowerCase();
    const matched = catalogForType.find(
      c => c.title.toLowerCase().includes(lowerPrompt) ||
           c.tags.some(t => t.toLowerCase().includes(lowerPrompt)) ||
           c.description.toLowerCase().includes(lowerPrompt)
    );
    if (matched) {
      chosenAlternative = matched;
    } else {
      // Dynamic prompt synthesis
      chosenAlternative = {
        title: `Custom ${customVibePrompt.charAt(0).toUpperCase() + customVibePrompt.slice(1)} Experience`,
        category: (currentSlot.slotType === 'lunch' || currentSlot.slotType === 'evening' ? 'Dining' : 'Leisure') as ActivitySlot['category'],
        description: `Specially customized slot for: "${customVibePrompt}". Curated for seamless integration into the ${currentSlot.locationCluster}.`,
        insiderTip: `Ask your concierge or host for the top recommended local spot matching "${customVibePrompt}".`,
        costUsd: Math.max(15, currentSlot.estimatedCostUsd),
        tags: ['Custom Vibe', customVibePrompt.slice(0, 15), 'Tailored']
      };
    }
  } else {
    // Pick next distinct alternative
    chosenAlternative = catalogForType[0];
  }

  const exchangeRate = currentSlot.estimatedCostLocal / (currentSlot.estimatedCostUsd || 1);
  const costUsd = chosenAlternative.costUsd;

  return {
    ...currentSlot,
    title: chosenAlternative.title,
    category: chosenAlternative.category,
    description: chosenAlternative.description,
    insiderTip: chosenAlternative.insiderTip,
    estimatedCostUsd: costUsd,
    estimatedCostInr: Math.round(costUsd * 84.5),
    estimatedCostLocal: Math.round(costUsd * (exchangeRate || 1)),
    tags: chosenAlternative.tags,
    isCustomized: true
  };
}
