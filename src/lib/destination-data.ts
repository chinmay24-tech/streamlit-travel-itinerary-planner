import { DestinationRecommendation, EmergencyContacts } from '@/types/travel';

import { buildIndianDestinations } from './indian-cities';

export interface DestinationPreset {
  id: string;
  city: string;
  country: string;
  state?: string;
  aliases?: string[];
  vibe: 'Beach' | 'Mountains' | 'Cultural' | 'Urban' | 'Nature' | 'Island' | 'Desert' | 'Wellness';
  budgetTier: 'Budget' | 'Moderate' | 'Luxury';
  dailyCostUsd: number;
  dailyCostInr: number;
  localCurrencyCode: string;
  localCurrencySymbol: string;
  exchangeRateUsdToLocal: number;
  bestSeasons: string[];
  weatherSummary: string;
  highlightTags: string[];
  topAttractions: string[];
  description: string;
  imageUrl: string;
  transitScore: string;
  clusters: {
    clusterName: string;
    hubArea: string;
    transitAdvantage: string;
    walkingRadiusKm: number;
    recommendedTransport: string;
    sampleMorning: { title: string; category: any; description: string; costUsd: number; costInr: number; tags: string[]; tip: string };
    sampleLunch: { title: string; category: any; description: string; costUsd: number; costInr: number; tags: string[]; tip: string };
    sampleAfternoon: { title: string; category: any; description: string; costUsd: number; costInr: number; tags: string[]; tip: string };
    sampleEvening: { title: string; category: any; description: string; costUsd: number; costInr: number; tags: string[]; tip: string };
  }[];
  emergencyContacts: EmergencyContacts;
  packingList: string[];
  transitGuidelines: string[];
}

const GLOBAL_CORE_DESTINATIONS: DestinationPreset[] = [
  {
    id: 'tokyo-japan',
    city: 'Tokyo',
    country: 'Japan',
    vibe: 'Urban',
    budgetTier: 'Moderate',
    dailyCostUsd: 145,
    dailyCostInr: 12200,
    localCurrencyCode: 'JPY',
    localCurrencySymbol: '¥',
    exchangeRateUsdToLocal: 154,
    bestSeasons: ['Spring (Mar-May)', 'Autumn (Sep-Nov)'],
    weatherSummary: 'Temperate climate, crisp clear autumns, cherry blossoms in spring, ultra-efficient rail.',
    highlightTags: ['Futuristic Tech', 'Michelin Street Food', 'Historic Temples', 'Subway Efficiency', 'Safe & Clean'],
    topAttractions: ['Senso-ji Asakusa', 'Shibuya Crossing', 'Meiji Jingu Shrine', 'Tsukiji Outer Market', 'TeamLab Planets'],
    description: 'An exhilarating blend of neon-lit hyper-modernity and centuries-old shinto heritage with world-class gastronomy.',
    imageUrl: 'https://images.pexels.com/photos/18908438/pexels-photo-18908438.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    transitScore: '10/10 (World\'s best subway system)',
    clusters: [
      {
        clusterName: 'Historic Asakusa & Ueno Cultural Belt',
        hubArea: 'Taito Ward (East Tokyo)',
        transitAdvantage: 'Attractions are grouped within 1.8km along the Ginza Subway Line to prevent East-West backtracking.',
        walkingRadiusKm: 2.1,
        recommendedTransport: 'Tokyo Metro Pass or Pasmo IC card on Ginza Line',
        sampleMorning: {
          title: 'Senso-ji Temple & Nakamise Street Stroll',
          category: 'Culture',
          description: 'Experience Tokyo\'s oldest Buddhist temple dating to 645 AD. Burn incense at the Jokoro and explore artisanal sweet stalls.',
          costUsd: 8,
          costInr: 680,
          tags: ['Historical', 'Photography', 'Heritage'],
          tip: 'Arrive before 8:45 AM to enjoy tranquil temple courtyards before tour buses arrive.'
        },
        sampleLunch: {
          title: 'Asakusa Imahan Sukiyaki & Soba Tasting',
          category: 'Dining',
          description: 'Century-old authentic dining featuring premium Kuroge Wagyu beef and vegetarian cold soba noodles.',
          costUsd: 26,
          costInr: 2200,
          tags: ['Local Gastronomy', 'Wagyu', 'Vegetarian Options'],
          tip: 'Request second-floor tatami seating for a traditional Japanese garden view.'
        },
        sampleAfternoon: {
          title: 'Tokyo National Museum & Ueno Park Lotus Pond',
          category: 'Sightseeing',
          description: 'Admire Japanese samurai armor, Buddhist sculptures, and stroll the serene Shinobazu pond.',
          costUsd: 12,
          costInr: 1000,
          tags: ['Museum', 'Art', 'Park Walk'],
          tip: 'Entry includes access to the classical Honkan main gallery and peaceful Japanese garden tea pavilions.'
        },
        sampleEvening: {
          title: 'Ameyoko Yokocho Retro Market & Craft Yakitori',
          category: 'Nightlife',
          description: 'Vibrant post-war open-air railway bazaar bustling with street skewers, craft beer stalls, and lively izakayas.',
          costUsd: 24,
          costInr: 2000,
          tags: ['Street Food', 'Nightlife', 'Authentic Vibe'],
          tip: 'Look for the red paper lanterns under the train tracks for genuine local vibes.'
        }
      },
      {
        clusterName: 'Shibuya, Harajuku & Meiji Sacred Forest',
        hubArea: 'Shibuya Ward (West Tokyo)',
        transitAdvantage: 'Direct contiguous walkable green axis from Yoyogi park straight down to Shibuya scramble.',
        walkingRadiusKm: 2.5,
        recommendedTransport: 'Foot walking between Meiji Shrine & Harajuku, then JR Yamanote line',
        sampleMorning: {
          title: 'Meiji Jingu Shrine & Yoyogi Evergreen Woods',
          category: 'Sightseeing',
          description: 'Walk through 170 acres of consecrated sacred forest right in central Tokyo to the grand Torii gate.',
          costUsd: 0,
          costInr: 0,
          tags: ['Serene', 'Nature', 'Spiritual'],
          tip: 'Write a wooden Ema prayer board wish and view the traditional sake barrel wall.'
        },
        sampleLunch: {
          title: 'Harajuku Gyoza Lou or Vegan Ramen Uzumaki',
          category: 'Dining',
          description: 'Crispy pan-fried dumplings or rich sesame-miso vegan ramen in bohemian Harajuku backstreets.',
          costUsd: 14,
          costInr: 1180,
          tags: ['Comfort Food', 'Vegan Friendly', 'Quick Bite'],
          tip: 'Try the pan-fried leek and garlic gyoza paired with chilled barley tea.'
        },
        sampleAfternoon: {
          title: 'Cat Street Boutiques & Shibuya Sky Observation Deck',
          category: 'Leisure',
          description: 'Stroll the artisan indie fashion alley of Cat Street, then ascend 229 meters over Shibuya Crossing.',
          costUsd: 22,
          costInr: 1850,
          tags: ['Panoramic View', 'Modern Architecture', 'Shopping'],
          tip: 'Book Shibuya Sky 45 minutes before sunset to witness day turning into illuminated Tokyo.'
        },
        sampleEvening: {
          title: 'Shibuya Nonbei Yokocho (Drunkard\'s Alley) Dining',
          category: 'Dining',
          description: 'Cozy micro-bars and charcoal yakitori spots huddled beneath glowing lantern eaves.',
          costUsd: 30,
          costInr: 2500,
          tags: ['Foodie', 'Local Nightlife', 'Iconic'],
          tip: 'Each tiny bar seats just 5-6 people; order the chef\'s seasonal tasting skewers.'
        }
      },
      {
        clusterName: 'Ginza Glamour, Tsukiji Fish Mart & TeamLab Immersion',
        hubArea: 'Chuo / Koto Bayshore',
        transitAdvantage: 'Bayside cluster connected smoothly via Yurikamome monorail without cross-town transfers.',
        walkingRadiusKm: 3.0,
        recommendedTransport: 'Yurikamome Waterfront Line and Tokyo Metro Hibiya Line',
        sampleMorning: {
          title: 'Tsukiji Outer Market Gourmet Breakfast Crawl',
          category: 'Dining',
          description: 'Savor tamagoyaki (rolled omelet), fresh strawberries, matcha lattes, and tuna sashimi bowls.',
          costUsd: 18,
          costInr: 1500,
          tags: ['Culinary', 'Early Morning', 'Fresh Seafood'],
          tip: 'Arrive hungry around 8:00 AM; bring small cash notes for stall owners.'
        },
        sampleLunch: {
          title: 'Ginza Kagari Truffle Ramen or Shojin Ryori Zen Set',
          category: 'Dining',
          description: 'Michelin Bib Gourmand creamy tori paitan broth or traditional Buddhist plant-based course.',
          costUsd: 20,
          costInr: 1700,
          tags: ['Michelin Listed', 'Gourmet', 'Specialty'],
          tip: 'Line forms by 11:15 AM; the signature chicken truffle soba is legendary.'
        },
        sampleAfternoon: {
          title: 'TeamLab Planets Immersive Digital Art Museum',
          category: 'Sightseeing',
          description: 'Walk barefoot through water, mirror crystal infinity rooms, and floating flower gardens.',
          costUsd: 32,
          costInr: 2700,
          tags: ['Digital Art', 'Interactive', 'Sensory Experience'],
          tip: 'Wear pants that can be rolled above knees as you wade through knee-deep digital water.'
        },
        sampleEvening: {
          title: 'Odaiba Seaside Terrace & Rainbow Bridge Illumination',
          category: 'Leisure',
          description: 'Catch coastal Tokyo Bay breezes with views of the illuminated Rainbow Bridge and life-size Gundam statue.',
          costUsd: 15,
          costInr: 1250,
          tags: ['Night View', 'Romance', 'Relaxation'],
          tip: 'Take the automated front carriage of the Yurikamome train across the bridge for roller-coaster views.'
        }
      }
    ],
    emergencyContacts: {
      country: 'Japan',
      police: '110',
      ambulance: '119',
      fire: '119',
      touristPolice: '+81-3-3501-0110 (English Tokyo Helpline)',
      embassyNotice: 'US Embassy: 1-10-5 Akasaka, Minato-ku; Indian Embassy: 2-2-11 Kudan-minami, Chiyoda-ku',
      nearestMedicalHub: 'St. Luke\'s International Hospital, Tsukiji (English-speaking doctors)',
      internationalDialCode: '+81',
      emergencyApps: ['Japan Travel by NAVITIME', 'Yurekuru Call (Earthquake early alert)']
    },
    packingList: [
      'Comfortable slip-on shoes for temple visits',
      'Universal plug adapter (Type A/B 100V)',
      'Coin purse for Yen coins and vending machines',
      'Small hand towel/handkerchief (many restrooms do not have paper towels)',
      'Pocket Wi-Fi or e-SIM card QR code'
    ],
    transitGuidelines: [
      'Buy a Welcome Suica or digital Pasmo on Apple/Google Wallet for tap-to-ride subway convenience.',
      'Trains stop running around midnight; use Japan Taxi app if out late in Roppongi or Shibuya.',
      'Always stand on the left on escalators in Tokyo (right in Osaka).'
    ]
  },
  {
    id: 'paris-france',
    city: 'Paris',
    country: 'France',
    vibe: 'Cultural',
    budgetTier: 'Moderate',
    dailyCostUsd: 165,
    dailyCostInr: 13900,
    localCurrencyCode: 'EUR',
    localCurrencySymbol: '€',
    exchangeRateUsdToLocal: 0.94,
    bestSeasons: ['Spring (Apr-Jun)', 'Autumn (Sep-Nov)'],
    weatherSummary: 'Pleasant temperate European weather, sidewalk bistro terraces, ideal strolling temperatures.',
    highlightTags: ['Art Museums', 'Gourmet Patisseries', 'Haussmann Architecture', 'River Cruises', 'Café Culture'],
    topAttractions: ['Eiffel Tower', 'Louvre Museum', 'Musée d\'Orsay', 'Montmartre & Sacré-Cœur', 'Sainte-Chapelle'],
    description: 'The City of Light captivates with world-class art collections, romantic Seine strolls, and pastry craftsmanship.',
    imageUrl: 'https://images.pexels.com/photos/18771757/pexels-photo-18771757.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    transitScore: '9/10 (Dense Metro grid with stations every 300m)',
    clusters: [
      {
        clusterName: 'Historic Heart: Île de la Cité & Latin Quarter',
        hubArea: '1st & 5th Arrondissement',
        transitAdvantage: 'Zero metro switching needed; seamless scenic walk across Seine footbridges.',
        walkingRadiusKm: 2.2,
        recommendedTransport: 'Walking & Metro Line 4 / RER B Saint-Michel',
        sampleMorning: {
          title: 'Sainte-Chapelle Stained Glass & Notre-Dame Parvis',
          category: 'Culture',
          description: 'Gaze up at 1,113 13th-century radiant stained-glass panels, then view Notre-Dame\'s restored gothic spire.',
          costUsd: 14,
          costInr: 1180,
          tags: ['Gothic Architecture', 'History', 'Iconic'],
          tip: 'Book 09:30 AM slot on sunny mornings when light floods the upper chapel.'
        },
        sampleLunch: {
          title: 'Le Comptoir du Relais or Odette Choux Patisserie',
          category: 'Dining',
          description: 'Classic Saint-Germain brasserie croque-monsieur, duck confit, or artisan choux pastries.',
          costUsd: 28,
          costInr: 2350,
          tags: ['French Bistro', 'Terrace Seating', 'Wine & Dine'],
          tip: 'Sit on the heated terrace corner for quintessential Parisian people-watching.'
        },
        sampleAfternoon: {
          title: 'Shakespeare & Company Bookstore & Luxembourg Gardens',
          category: 'Leisure',
          description: 'Browse the famous literary haven, then rent wooden miniature sailboats by the Medici Fountain.',
          costUsd: 5,
          costInr: 420,
          tags: ['Literary', 'Gardens', 'Relaxed'],
          tip: 'Grab a bench under the chestnut trees near the Palais du Luxembourg.'
        },
        sampleEvening: {
          title: 'Sunset Seine River Cruise on Bateaux-Mouches',
          category: 'Sightseeing',
          description: 'Glide under 37 historical bridge arches as the illuminated monument lights illuminate the river.',
          costUsd: 20,
          costInr: 1680,
          tags: ['Romantic', 'River Cruise', 'Sunset Views'],
          tip: 'Board at Pont Neuf right at golden hour for magical golden reflections.'
        }
      },
      {
        clusterName: 'Art Royalty: Louvre, Palais-Royal & Tuileries',
        hubArea: 'Central 1st & 2nd Arrondissement',
        transitAdvantage: 'Fully pedestrianized parkways connecting the world\'s greatest museum to chic covered passages.',
        walkingRadiusKm: 1.9,
        recommendedTransport: 'Pedestrian promenade and Metro Line 1 Palais Royal',
        sampleMorning: {
          title: 'Louvre Masterpieces & Mona Lisa Focus Route',
          category: 'Culture',
          description: 'Enter through the Glass Pyramid to discover the Winged Victory of Samothrace and Venus de Milo.',
          costUsd: 22,
          costInr: 1850,
          tags: ['Art Masterpieces', 'Must-See', 'World Heritage'],
          tip: 'Enter via the Porte des Lions entrance to bypass the central pyramid lines.'
        },
        sampleLunch: {
          title: 'Angelina Paris Hot Chocolate & Savory Quiche',
          category: 'Dining',
          description: 'Indulge in famous thick African hot chocolate and spinach-goat cheese quiche under Belle Époque frescoes.',
          costUsd: 32,
          costInr: 2700,
          tags: ['Gourmet', 'Pastry', 'Historic Salon'],
          tip: 'Takeaway counter around the corner has shorter lines if seated salon is queued.'
        },
        sampleAfternoon: {
          title: 'Palais-Royal Colonnes de Buren & Galerie Vivienne',
          category: 'Sightseeing',
          description: 'Playful black-and-white striped modern columns inside royal courtyard, followed by 1823 mosaic covered passages.',
          costUsd: 0,
          costInr: 0,
          tags: ['Architecture', 'Covered Passages', 'Indie Books'],
          tip: 'Perfect rainy-day refuge with vintage bookshops and boutique perfume studios.'
        },
        sampleEvening: {
          title: 'Le Marais Wine Bar & Artisan Fromagerie Tasting',
          category: 'Dining',
          description: 'Sample Comte, Roquefort, and crusty baguettes with biodynamic French vintages.',
          costUsd: 35,
          costInr: 2950,
          tags: ['Wine & Cheese', 'Historic Marais', 'Culinary'],
          tip: 'Order the mixed planche fromagère with fig jam and walnuts.'
        }
      }
    ],
    emergencyContacts: {
      country: 'France',
      police: '17',
      ambulance: '15 (SAMU)',
      fire: '18',
      touristPolice: '112 (European emergency universal line)',
      embassyNotice: 'US Embassy: 2 Avenue Gabriel; Indian Embassy: 15 Rue Alfred Dehodencq, 75016',
      nearestMedicalHub: 'The American Hospital of Paris, Neuilly-sur-Seine',
      internationalDialCode: '+33',
      emergencyApps: ['Bonjour RATP', 'Urgence 114 (Hearing/SMS)']
    },
    packingList: [
      'Stylish yet supportive walking footwear for cobblestones',
      'Crossbody anti-theft bag for metro rides',
      'Type C/E 230V European power adapter',
      'Lightweight trench coat or umbrella',
      'Reusable water bottle (Wallace fountains offer clean spring water)'
    ],
    transitGuidelines: [
      'Buy a Navigo Easy digital pass or carnet tickets on the Bonjour RATP app.',
      'Be cautious of belongings at Châtelet and Gare du Nord transit hubs.',
      'Metro stations do not have escalators everywhere; travel light on luggage transfer days.'
    ]
  },
  {
    id: 'bali-indonesia',
    city: 'Bali (Ubud & Seminyak)',
    country: 'Indonesia',
    vibe: 'Beach',
    budgetTier: 'Budget',
    dailyCostUsd: 65,
    dailyCostInr: 5450,
    localCurrencyCode: 'IDR',
    localCurrencySymbol: 'Rp',
    exchangeRateUsdToLocal: 16100,
    bestSeasons: ['Dry Season (Apr-Oct)'],
    weatherSummary: 'Sunny tropical breezes, gentle surf swells, warm evenings, lush green rice terraces.',
    highlightTags: ['Tegallalang Rice Terraces', 'Beach Clubs', 'Yoga Retreats', 'Spiritual Temples', 'Affordable Luxury'],
    topAttractions: ['Sacred Monkey Forest', 'Tirta Empul Holy Springs', 'Uluwatu Clifftop Temple', 'Kelingking Beach Nusa Penida', 'Mount Batur Sunrise'],
    description: 'Island of the Gods boasting emerald rice terraces, surf breaks, sacred water purification temples, and wellness sanctuaries.',
    imageUrl: 'https://images.pexels.com/photos/35894607/pexels-photo-35894607.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    transitScore: '6/10 (Scooter rental or Grab/Gojek driver recommended)',
    clusters: [
      {
        clusterName: 'Ubud Cultural Heartland & Forest Canopy',
        hubArea: 'Gianyar Regency',
        transitAdvantage: 'Scenic short drives through palm groves; isolates mountain activities from southern coast traffic.',
        walkingRadiusKm: 2.8,
        recommendedTransport: 'Private driver or scooter hire',
        sampleMorning: {
          title: 'Tegallalang Terraced Rice Paddies & Jungle Swing',
          category: 'Adventure',
          description: 'Hike through UNESCO-listed subak irrigation waterways and soar over misty palm trees on a forest swing.',
          costUsd: 12,
          costInr: 1000,
          tags: ['Nature Hike', 'Instagram Spot', 'Lush Greenery'],
          tip: 'Arrive at 07:30 AM to catch golden sunlight piercing through coconut leaves.'
        },
        sampleLunch: {
          title: 'Zest Ubud or Warung Babi Guling Ibu Oka',
          category: 'Dining',
          description: 'Organic plant-powered Balinese dragonfruit bowls or world-famous crispy roast suckling pig.',
          costUsd: 10,
          costInr: 850,
          tags: ['Farm to Table', 'Vegan/Vegetarian', 'Local Icon'],
          tip: 'Try the fresh young coconut elixir with wild Balinese lime.'
        },
        sampleAfternoon: {
          title: 'Sacred Monkey Forest Sanctuary & Saraswati Lotus Temple',
          category: 'Culture',
          description: 'Encounter over 1,000 playful Balinese long-tailed macaques beneath sacred moss-covered banyan trees.',
          costUsd: 6,
          costInr: 500,
          tags: ['Wildlife', 'Ancient Temples', 'Shaded Trail'],
          tip: 'Secure all sunglasses, jewelry, and phone straps before entering the forest trail.'
        },
        sampleEvening: {
          title: 'Traditional Legong Dance at Ubud Palace & Night Market',
          category: 'Culture',
          description: 'Mesmerizing gamelan orchestra accompanied by vibrant gold-headdressed classical Balinese dancers.',
          costUsd: 8,
          costInr: 680,
          tags: ['Cultural Performance', 'Music & Dance', 'Local Food'],
          tip: 'Claim front row seating by 07:00 PM for the 07:30 PM performance.'
        }
      },
      {
        clusterName: 'Southern Coast: Clifftops, Surf & Uluwatu Fire Dance',
        hubArea: 'Bukit Peninsula',
        transitAdvantage: 'Single oceanfront perimeter road connecting secret beaches and the sunset amphitheater.',
        walkingRadiusKm: 1.5,
        recommendedTransport: 'Private day charter or Grab car',
        sampleMorning: {
          title: 'Padang Padang Beach Surf Lesson or Sunbathing',
          category: 'Leisure',
          description: 'Descend through limestone sea cave stairs to a secluded turquoise beach framed by monkey cliffs.',
          costUsd: 15,
          costInr: 1250,
          tags: ['Beach', 'Surfing', 'Tropical Waters'],
          tip: 'Rent a surfboard for $7/hr or relax under bamboo umbrellas with fresh papaya.'
        },
        sampleLunch: {
          title: 'Single Fin Clifftop Eatery & Smoothie Bowls',
          category: 'Dining',
          description: 'Perched high on the Suluban cliffs with panoramic views of surfers riding legendary barrel waves.',
          costUsd: 14,
          costInr: 1180,
          tags: ['Ocean View', 'Healthy Eats', 'Vibrant Vibe'],
          tip: 'Table facing the ocean reef gives front-row spectator view of international surfers.'
        },
        sampleAfternoon: {
          title: 'Uluwatu Sea Temple & Cliffside Pathway',
          category: 'Sightseeing',
          description: 'Centuries-old sea temple situated on a sheer 70-meter limestone cliff plummeting into the roaring Indian Ocean.',
          costUsd: 5,
          costInr: 420,
          tags: ['Cliff View', 'Spiritual', 'Ocean Drama'],
          tip: 'Bring a traditional purple sarong (provided at entrance gate).'
        },
        sampleEvening: {
          title: 'Kecak Fire & Trance Sunset Dance Show',
          category: 'Culture',
          description: 'Fifty chanting men surround an open fire pit chanting "Chak-chak-chak" against a fiery crimson ocean sunset.',
          costUsd: 10,
          costInr: 850,
          tags: ['Mesmerizing Show', 'Sunset Glow', 'Unforgettable'],
          tip: 'Sunset tickets sell out daily; book 1 hour early to secure center amphitheater seats.'
        }
      }
    ],
    emergencyContacts: {
      country: 'Indonesia',
      police: '110',
      ambulance: '118',
      fire: '113',
      touristPolice: '+62-361-224111 (Bali Tourist Assistance)',
      embassyNotice: 'US Consular Agency: Jl. Hayam Wuruk No. 310, Denpasar; Indian Consulate: Jl. Raya Puputan No. 163, Renon',
      nearestMedicalHub: 'BIMC Hospital Nusa Dua / Ubud (International standard emergency 24/7)',
      internationalDialCode: '+62',
      emergencyApps: ['Grab', 'Gojek', 'PeduliLindungi']
    },
    packingList: [
      'Biodegradable reef-safe sunscreen (SPF 50+)',
      'Mosquito repellent with DEET or citronella',
      'Breathable linen clothing and temple sarong',
      'Waterproof dry-bag for beach and waterfall trips',
      'Indonesian Rupiah cash for warungs and tip jars'
    ],
    transitGuidelines: [
      'Download Grab and Gojek apps for fair on-demand taxi fares.',
      'Only rent scooters if you have an International Driving Permit and motorcycle experience.',
      'Always drink filtered bottled water; avoid tap water for brushing teeth.'
    ]
  },
  {
    id: 'swiss-alps',
    city: 'Interlaken & Lucerne',
    country: 'Switzerland',
    vibe: 'Mountains',
    budgetTier: 'Luxury',
    dailyCostUsd: 280,
    dailyCostInr: 23600,
    localCurrencyCode: 'CHF',
    localCurrencySymbol: 'Fr.',
    exchangeRateUsdToLocal: 0.89,
    bestSeasons: ['Summer (Jun-Sep)', 'Winter (Dec-Mar)'],
    weatherSummary: 'Crisp alpine air, turquoise glacial lakes, wildflower meadows in summer, powder snow in winter.',
    highlightTags: ['Jungfraujoch Top of Europe', 'Glacial Lakes', 'Scenic Cogwheel Trains', 'Fondue & Chocolate', 'Hiking Trails'],
    topAttractions: ['Jungfraujoch', 'Lake Brienz Steamboat', 'Mount Pilatus Golden Roundtrip', 'Grindelwald First Cliff Walk', 'Lauterbrunnen Valley'],
    description: 'Fairytale Swiss paradise where snowcapped 4,000m peaks tower above 72 roaring waterfalls and emerald lakes.',
    imageUrl: 'https://images.pexels.com/photos/10478251/pexels-photo-10478251.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    transitScore: '10/10 (Swiss Travel System trains, boats, funiculars run like clockwork)',
    clusters: [
      {
        clusterName: 'Lauterbrunnen Valley of 72 Waterfalls & Mürren',
        hubArea: 'Bernese Oberland',
        transitAdvantage: 'Seamless train and cable car connections without road congestion; car-free alpine villages.',
        walkingRadiusKm: 3.5,
        recommendedTransport: 'Jungfrau Travel Pass or Swiss Travel Pass',
        sampleMorning: {
          title: 'Staubbach Falls & Trümmelbach Glacial Caverns',
          category: 'Adventure',
          description: 'Hike behind Staubbach Waterfall, then ride underground elevators into corkscrew roaring glacial waterfalls inside the mountain.',
          costUsd: 15,
          costInr: 1250,
          tags: ['Glacial Caves', 'Waterfalls', 'Alpine Wonders'],
          tip: 'Wear a waterproof jacket; the subterranean glacial rush sprays fine mist.'
        },
        sampleLunch: {
          title: 'Hotel Alpenruh Fondue Terrace in Car-Free Mürren',
          category: 'Dining',
          description: 'Traditional bubbling Gruyère and Emmental cheese fondue with boiled potatoes overlooking Eiger, Mönch, and Jungfrau peaks.',
          costUsd: 38,
          costInr: 3200,
          tags: ['Swiss Cheese', 'Panoramic Peaks', 'Alps Dining'],
          tip: 'Dip crusty bread with hot herbal alpine tea to aid cheese digestion.'
        },
        sampleAfternoon: {
          title: 'Allmendhubel Flower Trail Walk to Gimmelwald',
          category: 'Leisure',
          description: 'Gentle downhill stroll past grazing Simmental cows with brass bells, wild edelweiss flowers, and timber chalets.',
          costUsd: 10,
          costInr: 850,
          tags: ['Cowbells', 'Wildflowers', 'Peaceful Meadow'],
          tip: 'Pick up artisan mountain cheese from the Honesty Farm Shop in Gimmelwald.'
        },
        sampleEvening: {
          title: 'Lake Brienz Sunset Cruise & Lakeside Raclette',
          category: 'Dining',
          description: 'Glide across mirror-still turquoise waters aboard a historic paddle steamer while savoring melted Swiss raclette.',
          costUsd: 42,
          costInr: 3550,
          tags: ['Steamboat Cruise', 'Sunset Views', 'Gourmet Dinner'],
          tip: 'Show Swiss Travel Pass for free steamboat deck admission.'
        }
      }
    ],
    emergencyContacts: {
      country: 'Switzerland',
      police: '117',
      ambulance: '144',
      fire: '118',
      touristPolice: '112 (Universal European Line) / 1414 (REGA Alpine Air Rescue)',
      embassyNotice: 'US Embassy: Sulgeneckstrasse 19, Bern; Indian Embassy: Kirchenfeldstrasse 28, Bern',
      nearestMedicalHub: 'Spital FMI Interlaken (Full emergency & trauma care)',
      internationalDialCode: '+41',
      emergencyApps: ['SBB Mobile (Train schedules)', 'MeteoSwiss (Precision mountain weather)', 'Rega App']
    },
    packingList: [
      'Layered fleece and GORE-TEX waterproof shell',
      'Sturdy gripped hiking boots',
      'Polarized UV-blocking sunglasses (snow and lake glare)',
      'Swiss Travel Pass mobile barcode',
      'High-altitude lip balm with SPF'
    ],
    transitGuidelines: [
      'Download the SBB Mobile app to track connecting mountain trains and cable cars down to the second.',
      'Public tap fountains throughout Swiss towns provide pristine drinking water directly from the Alps.'
    ]
  },
  {
    id: 'jaipur-india',
    city: 'Jaipur (Pink City)',
    country: 'India',
    vibe: 'Cultural',
    budgetTier: 'Budget',
    dailyCostUsd: 48,
    dailyCostInr: 4000,
    localCurrencyCode: 'INR',
    localCurrencySymbol: '₹',
    exchangeRateUsdToLocal: 84.5,
    bestSeasons: ['Winter (Oct-Mar)'],
    weatherSummary: 'Sunny warm days (24°C) and pleasantly cool desert evenings, festive cultural atmosphere.',
    highlightTags: ['Amber Fort', 'Hawa Mahal Palace', 'Royal Rajasthani Thali', 'Block Print Textiles', 'Heritage Palaces'],
    topAttractions: ['Amber Fort & Palace', 'Hawa Mahal (Palace of Winds)', 'City Palace & Jantar Mantar', 'Nahargarh Fort Sunset', 'Johari Bazaar'],
    description: 'The royal capital of Rajasthan dazzles with terracotta pink sandstone facades, opulent forts, and rich royal heritage.',
    imageUrl: 'https://images.pexels.com/photos/19149640/pexels-photo-19149640.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    transitScore: '8/10 (Uber/Ola, Jaipur Metro, and auto-rickshaws everywhere)',
    clusters: [
      {
        clusterName: 'Walled Pink City & Astronomical Marvels',
        hubArea: 'Old City Center (Badi Choupad)',
        transitAdvantage: 'High density UNESCO precinct; all key palaces are within 1km walking radius inside the fortified gates.',
        walkingRadiusKm: 1.8,
        recommendedTransport: 'Walking and Jaipur Metro Line 1 (Badi Chaupar station)',
        sampleMorning: {
          title: 'Hawa Mahal Sunrise View & City Palace Tour',
          category: 'Culture',
          description: 'Marvel at 953 honeycomb windows designed for royal women, then explore the Maharajah\'s courtyards and Peacock Gate.',
          costUsd: 10,
          costInr: 850,
          tags: ['Royal Palace', 'Architecture', 'Heritage'],
          tip: 'Head to the Wind View Cafe terrace opposite Hawa Mahal for the best photo angle.'
        },
        sampleLunch: {
          title: 'Laxmi Mishthan Bhandar (LMB) Royal Rajasthani Thali',
          category: 'Dining',
          description: 'Feast on Dal Baati Churma, Gatte ki Sabzi, Ker Sangri, and warm Ghewar sweets in a legendary 1727 eatery.',
          costUsd: 9,
          costInr: 750,
          tags: ['Authentic Thali', 'Vegetarian Delicacy', 'Heritage Eatery'],
          tip: 'Ask for extra pure ghee atop the hot baatis.'
        },
        sampleAfternoon: {
          title: 'Jantar Mantar UNESCO Observatory & Johari Bazaar',
          category: 'Sightseeing',
          description: 'Examine the world\'s largest stone sundial (accurate to 2 seconds), then shop for gemstone jewelry and block prints.',
          costUsd: 5,
          costInr: 420,
          tags: ['UNESCO Site', 'Astronomy', 'Bazaar Shopping'],
          tip: 'Hire an official audio guide at Jantar Mantar to appreciate the astronomical geometry.'
        },
        sampleEvening: {
          title: 'Nahargarh Fort Clifftop Sunset & Rooftop Tea',
          category: 'Leisure',
          description: 'Watch the entire Pink City turn golden and amber as dusk settles over the Aravalli hills from the fortress parapets.',
          costUsd: 6,
          costInr: 500,
          tags: ['Sunset Panorama', 'Hilltop Fort', 'Romantic'],
          tip: 'Take an Uber auto up before 05:00 PM; book return vehicle early.'
        }
      }
    ],
    emergencyContacts: {
      country: 'India',
      police: '100 / 112',
      ambulance: '108',
      fire: '101',
      touristPolice: '+91-141-2601100 (Jaipur Tourist Police Cell)',
      embassyNotice: 'Foreign Consular Assistance: Chanakyapuri Diplomatic Enclave, New Delhi (accessible via 4-hour expressway/Vande Bharat)',
      nearestMedicalHub: 'SMS Hospital Jaipur / Fortis Escorts Hospital Malviya Nagar',
      internationalDialCode: '+91',
      emergencyApps: ['112 India', 'IRCTC Rail Connect', 'Uber / Ola']
    },
    packingList: [
      'Breathable cotton clothes and light evening shawl for desert winters',
      'Comfortable slip-on shoes for temple and palace walks',
      'Hand sanitizer and electrolytes packets',
      'Universal 3-pin plug converter (Type D/M/C)',
      'Cash notes for street markets and rickshaw drivers'
    ],
    transitGuidelines: [
      'Book rides via Uber or Ola app for transparent non-bargain fares.',
      'Jaipur Metro connects Railway Station directly to Badi Chaupar (Hawa Mahal).'
    ]
  },
  {
    id: 'rome-italy',
    city: 'Rome',
    country: 'Italy',
    vibe: 'Cultural',
    budgetTier: 'Moderate',
    dailyCostUsd: 155,
    dailyCostInr: 13100,
    localCurrencyCode: 'EUR',
    localCurrencySymbol: '€',
    exchangeRateUsdToLocal: 0.94,
    bestSeasons: ['Spring (Apr-May)', 'Autumn (Sep-Oct)'],
    weatherSummary: 'Sunny Mediterranean skies, ideal temperatures for exploring outdoor archaeological forums.',
    highlightTags: ['Colosseum & Roman Forum', 'Vatican Museums', 'Authentic Gelato', 'Trevi Fountain', 'Piazza Navona'],
    topAttractions: ['Colosseum', 'Vatican & Sistine Chapel', 'Pantheon', 'Trevi Fountain', 'Trastevere Backstreets'],
    description: 'An open-air museum of 2,800 years of civilization where imperial ruins and baroque fountains meet espresso perfection.',
    imageUrl: 'https://images.pexels.com/photos/11553031/pexels-photo-11553031.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    transitScore: '8.5/10 (Metro lines A & B + compact walkable historic center)',
    clusters: [
      {
        clusterName: 'Imperial Ancient Rome & Monti Quarter',
        hubArea: 'Piazza del Colosseo',
        transitAdvantage: 'Direct archaeological corridor connecting Colosseum, Roman Forum, and Palatine Hill on one ticket.',
        walkingRadiusKm: 2.3,
        recommendedTransport: 'Walking and Colosseo Metro Line B',
        sampleMorning: {
          title: 'Colosseum Arena Floor & Roman Forum Ruins',
          category: 'Culture',
          description: 'Step directly onto the gladiator arena floor and walk along the Via Sacra where emperors triumphed.',
          costUsd: 24,
          costInr: 2000,
          tags: ['Ancient History', 'UNESCO Icon', 'Monumental'],
          tip: 'Book timed tickets 30 days ahead; wear sturdy shoes for ancient basalt paving.'
        },
        sampleLunch: {
          title: 'Trattoria Vecchia Roma or Roscioli Cacio e Pepe',
          category: 'Dining',
          description: 'Authentic handmade tonnarelli cacio e pepe tossed inside a giant wheel of Pecorino Romano.',
          costUsd: 26,
          costInr: 2200,
          tags: ['Pasta Masterpiece', 'Roman Cuisine', 'Wine Cellar'],
          tip: 'Pair with chilled white Frascati wine from the Castelli Romani hills.'
        },
        sampleAfternoon: {
          title: 'Monti Bohemian Boutiques & Santa Maria Maggiore',
          category: 'Leisure',
          description: 'Explore Rome\'s trendiest artisan district filled with vintage clothing, leather crafters, and ivy-covered alleys.',
          costUsd: 5,
          costInr: 420,
          tags: ['Charming Alleys', 'Artisans', 'Gelato Stop'],
          tip: 'Stop at Fatamorgana for artisanal basil-walnut or pistachio gelato.'
        },
        sampleEvening: {
          title: 'Piazza Navona Fountains & Pantheon Night Walk',
          category: 'Sightseeing',
          description: 'Stroll past Bernini\'s Four Rivers fountain and marvel at the Pantheon lit up beneath starry Roman skies.',
          costUsd: 8,
          costInr: 680,
          tags: ['Baroque Grandeur', 'Night Illumination', 'Piazza Life'],
          tip: 'The Pantheon square has street musicians playing classical violin and guitar until midnight.'
        }
      }
    ],
    emergencyContacts: {
      country: 'Italy',
      police: '113',
      ambulance: '118',
      fire: '115',
      touristPolice: '112 (Carabinieri / EU Emergency Line)',
      embassyNotice: 'US Embassy: Via Vittorio Veneto 121; Indian Embassy: Via XX Settembre 5',
      nearestMedicalHub: 'Policlinico Umberto I / Fatebenefratelli Hospital Tiber Island',
      internationalDialCode: '+39',
      emergencyApps: ['112 Where ARE U', 'Moovit Rome Transit']
    },
    packingList: [
      'Shoulder and knee coverings for churches (strict Vatican dress code)',
      'Flat cushioned walking shoes (Sanpietrini cobblestones are slippery in heels)',
      'Type C/L European plug adapter',
      'Refillable water bottle for public "Nasoni" drinking fountains'
    ],
    transitGuidelines: [
      'Tap your contactless bank card at metro turnstiles and ATAC buses; fare is valid for 100 minutes.',
      'Be alert around Termini station for pickpockets; keep phone in front pocket.'
    ]
  },
  {
    id: 'new-york-usa',
    city: 'New York City',
    country: 'United States',
    vibe: 'Urban',
    budgetTier: 'Luxury',
    dailyCostUsd: 240,
    dailyCostInr: 20200,
    localCurrencyCode: 'USD',
    localCurrencySymbol: '$',
    exchangeRateUsdToLocal: 1,
    bestSeasons: ['Autumn (Sep-Nov)', 'Spring (May-Jun)'],
    weatherSummary: 'Crisp autumn foliage in Central Park, bustling festive energy, world-renowned skyline.',
    highlightTags: ['Broadway Shows', 'Central Park', 'Skyline Observation', 'Diverse Dining', 'Iconic Museums'],
    topAttractions: ['Central Park', 'Summit One Vanderbilt', 'Metropolitan Museum of Art', 'High Line & Hudson Yards', 'Brooklyn Bridge'],
    description: 'The epicenter of art, theater, culinary innovation, and ceaseless urban vitality that never sleeps.',
    imageUrl: 'https://images.pexels.com/photos/37954059/pexels-photo-37954059.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    transitScore: '9.5/10 (24/7 MTA Subway network with OMNY tap)',
    clusters: [
      {
        clusterName: 'Midtown Skyline & High Line High-Tech',
        hubArea: 'Manhattan West & Midtown',
        transitAdvantage: 'Elevated railway walking park links Hudson Yards straight to Chelsea and Meatpacking without traffic.',
        walkingRadiusKm: 2.8,
        recommendedTransport: 'MTA Subway 7 line & walking the High Line',
        sampleMorning: {
          title: 'Summit One Vanderbilt Immersive Observatory',
          category: 'Sightseeing',
          description: 'Walk through multi-floor mirror installations with sweeping panoramic views of the Empire State Building and Chrysler.',
          costUsd: 46,
          costInr: 3900,
          tags: ['Skyline Views', 'Modern Art', 'Iconic Photo'],
          tip: 'Wear sunglasses; the daylight reflections on the glass floors are dazzling.'
        },
        sampleLunch: {
          title: 'Chelsea Market Artisan Food Hall Crawl',
          category: 'Dining',
          description: 'Savor Maine lobster rolls, Los Tacos No. 1 handmade corn tacos, and hot halva ice cream sandwiches.',
          costUsd: 25,
          costInr: 2100,
          tags: ['Food Hall', 'Variety', 'Famous Bites'],
          tip: 'Grab lunch before 12:15 PM to easily snag communal standing tables.'
        },
        sampleAfternoon: {
          title: 'The High Line Elevated Park & Little Island',
          category: 'Leisure',
          description: 'Walk 1.45 miles on a repurposed 1930s historic freight rail line landscaped with native wildflowers 30 feet above street level.',
          costUsd: 0,
          costInr: 0,
          tags: ['Urban Park', 'Architecture', 'Sculptures'],
          tip: 'End at Little Island at Pier 55 to see the tulip-shaped concrete pilings in the Hudson.'
        },
        sampleEvening: {
          title: 'Broadway Musical in Times Square & Late Diner',
          category: 'Nightlife',
          description: 'Catch an award-winning musical, followed by midnight New York cheesecake at Junior\'s or a classic diner.',
          costUsd: 95,
          costInr: 8000,
          tags: ['Broadway Show', 'World Class', 'Theater'],
          tip: 'Check the TKTS Booth under the red stairs for same-day discounted tickets.'
        }
      }
    ],
    emergencyContacts: {
      country: 'United States',
      police: '911',
      ambulance: '911',
      fire: '911',
      touristPolice: '311 (NYC Non-Emergency Information & Tourist Services)',
      embassyNotice: 'Foreign Consulates: Clustered along Midtown East & East 60s Manhattan',
      nearestMedicalHub: 'NewYork-Presbyterian / Weill Cornell Medical Center',
      internationalDialCode: '+1',
      emergencyApps: ['Notify NYC', 'MTA TrainTime', 'MYmta']
    },
    packingList: [
      'Ultra-comfortable walking sneakers (15,000+ steps/day normal in NYC)',
      'Portable high-capacity power bank',
      'Weather-appropriate layered jacket',
      'Contactless debit/credit card for OMNY turnstile tap'
    ],
    transitGuidelines: [
      'Use OMNY: Just tap your phone or credit card at any subway turnstile. After 12 rides in a week, remaining rides are free.',
      'Check whether your train is "Local" or "Express" to avoid flying past your intended station.'
    ]
  }
];

const INDIAN_DESTINATIONS = buildIndianDestinations();

export const DESTINATION_DATABASE: DestinationPreset[] = [
  ...GLOBAL_CORE_DESTINATIONS.filter((d) => d.country !== 'India'),
  ...INDIAN_DESTINATIONS
];

function normalizePlace(value: string): string {
  return value
    .toLowerCase()
    .replace(/\(.*?\)/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export function findDestination(name: string): DestinationPreset | undefined {
  const q = normalizePlace(name || '');
  if (!q) return undefined;

  return DESTINATION_DATABASE.find((d) => {
    const names = [d.city, ...(d.aliases || []), d.state || '', d.country];
    return names.some((n) => {
      const nn = normalizePlace(n);
      if (!nn) return false;
      return nn === q || nn.includes(q) || q.includes(nn);
    });
  });
}

export function getIndianDestinations(): DestinationPreset[] {
  return DESTINATION_DATABASE.filter((d) => d.country === 'India');
}

// Helper to recommend destinations matching criteria
export function getRecommendedDestinations(criteria: {
  vibe?: string;
  budget?: string;
  season?: string;
  travelParty?: string;
  interests?: string[];
  country?: string;
  state?: string;
  search?: string;
}): DestinationRecommendation[] {
  const vibeFilter = criteria.vibe?.toLowerCase() || 'open-ended';
  const budgetFilter = criteria.budget?.toLowerCase() || 'moderate';
  const countryFilter = (criteria.country || 'all').toLowerCase();
  const stateFilter = (criteria.state || '').toLowerCase();
  const search = normalizePlace(criteria.search || '');

  return DESTINATION_DATABASE
    .filter((dest) => {
      if (countryFilter === 'india' && dest.country !== 'India') return false;
      if (countryFilter === 'international' && dest.country === 'India') return false;
      if (stateFilter && (dest.state || '').toLowerCase() !== stateFilter) return false;
      if (search) {
        const hay = normalizePlace(
          [dest.city, dest.country, dest.state || '', ...(dest.aliases || []), ...dest.highlightTags, ...dest.topAttractions].join(' ')
        );
        if (!hay.includes(search)) return false;
      }
      return true;
    })
    .map((dest) => {
      let score = 75;

      if (dest.country === 'India') score += 4;

      if (vibeFilter === 'open-ended' || dest.vibe.toLowerCase() === vibeFilter) {
        score += 12;
      } else if (
        (vibeFilter.includes('beach') && dest.vibe === 'Beach') ||
        (vibeFilter.includes('mountain') && dest.vibe === 'Mountains') ||
        (vibeFilter.includes('cultur') && dest.vibe === 'Cultural') ||
        (vibeFilter.includes('urban') && dest.vibe === 'Urban') ||
        (vibeFilter.includes('nature') && dest.vibe === 'Nature') ||
        (vibeFilter.includes('island') && dest.vibe === 'Island') ||
        (vibeFilter.includes('desert') && dest.vibe === 'Desert') ||
        (vibeFilter.includes('wellness') && dest.vibe === 'Wellness')
      ) {
        score += 10;
      }

      if (budgetFilter === dest.budgetTier.toLowerCase()) {
        score += 8;
      } else if (budgetFilter === 'budget' && dest.budgetTier === 'Moderate') {
        score += 2;
      } else if (budgetFilter === 'luxury') {
        score += 5;
      }

      if (criteria.interests && criteria.interests.length > 0) {
        const destTagString = [...dest.highlightTags, ...dest.topAttractions].join(' ').toLowerCase();
        let interestHits = 0;
        criteria.interests.forEach((i) => {
          if (destTagString.includes(i.toLowerCase())) interestHits++;
        });
        score += Math.min(interestHits * 3, 9);
      }

      score = Math.min(score, 98);

      const locationLabel = dest.state ? `${dest.city}, ${dest.state}` : `${dest.city}, ${dest.country}`;
      const whyMatch = `Rated ${score}% match for your ${criteria.vibe || 'vibe'} preference and ${criteria.budget || 'moderate'} budget. ${locationLabel} offers ${dest.highlightTags.slice(0, 3).join(', ')} (${dest.transitScore}).`;

      return {
        id: dest.id,
        city: dest.city,
        country: dest.state ? `India · ${dest.state}` : dest.country,
        vibe: dest.vibe,
        matchScore: score,
        highlightTags: dest.highlightTags,
        budgetLevel: dest.budgetTier,
        estDailyCostUsd: dest.dailyCostUsd,
        estDailyCostInr: dest.dailyCostInr,
        bestSeason: dest.bestSeasons.join(', '),
        currentSeasonWeather: dest.weatherSummary,
        topAttractions: dest.topAttractions,
        whyMatch,
        transitScore: dest.transitScore,
        imageUrl: dest.imageUrl,
        localCurrency: `${dest.localCurrencySymbol} (${dest.localCurrencyCode})`
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}
