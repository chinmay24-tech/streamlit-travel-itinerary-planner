export type BudgetLevel = 'Budget' | 'Moderate' | 'Luxury';
export type TravelParty = 'Solo' | 'Couple' | 'Family' | 'Friends';
export type TravelPace = 'Relaxed' | 'Moderate' | 'Fast-Paced';
export type TravelVibe = 'Beach' | 'Mountains' | 'Cultural' | 'Urban' | 'Nature' | 'Island' | 'Desert' | 'Wellness';

export type TransitMode = 'Flight' | 'Train' | 'Bus' | 'Car' | 'Ferry' | 'Walk';

export interface BookingLink {
  label: string;
  url: string;
  partner: string;
}

export interface JourneyLeg {
  mode: TransitMode;
  label: string;
  fromHub: string;
  toHub: string;
  durationHours: number;
  durationLabel: string;
  distanceKm: number;
  costUsd: number;
  costInr: number;
  departHint: string;
  arriveHint: string;
  notes: string[];
  comfort: string;
  isRecommended?: boolean;
  bookingLinks?: BookingLink[];
}

export interface JourneyPlan {
  originCity: string;
  originState?: string;
  originCountry: string;
  destinationCity: string;
  destinationState?: string;
  destinationCountry: string;
  distanceKm: number;
  sameCity: boolean;
  outbound: JourneyLeg;
  alternatives: JourneyLeg[];
  returnLeg: JourneyLeg;
  lastMile: string;
  bookingTips: string[];
  totalTransitUsd: number;
  totalTransitInr: number;
  mapsDirectionsUrl?: string;
}

export interface UserPreferences {
  originCity: string;
  destination: string;
  vibe: TravelVibe | 'Open-Ended' | string;
  durationDays: number;
  startDate: string;
  endDate: string;
  budgetLevel: BudgetLevel;
  travelParty: TravelParty;
  pace: TravelPace;
  interests: string[];
  currency: 'USD' | 'INR' | 'EUR' | 'GBP' | 'JPY';
  apiProvider: 'demo' | 'groq' | 'gemini';
  apiKey?: string;
  customNotes?: string;
}

export type SlotType = 'morning' | 'lunch' | 'afternoon' | 'evening';

export interface ActivitySlot {
  id: string;
  slotType: SlotType;
  timeSlot: string; // e.g. "09:00 AM - 12:30 PM"
  title: string;
  category: 'Sightseeing' | 'Dining' | 'Leisure' | 'Culture' | 'Adventure' | 'Nightlife' | 'Shopping';
  locationCluster: string;
  neighborhood: string;
  description: string;
  insiderTip: string;
  estimatedCostUsd: number;
  estimatedCostInr: number;
  estimatedCostLocal: number;
  localCurrencyCode: string;
  localCurrencySymbol: string;
  durationHours: number;
  tags: string[];
  isVegetarianFriendly?: boolean;
  transitTip?: string;
  isCustomized?: boolean;
  mapsUrl?: string;
}

export interface DayClusterInfo {
  clusterName: string;
  hubArea: string;
  transitAdvantage: string;
  walkingRadiusKm: number;
  estimatedTransitTimeMins: number;
  recommendedTransport: string;
}

export interface DayPlan {
  dayNumber: number;
  dateLabel: string;
  theme: string;
  geographicCluster: DayClusterInfo;
  slots: {
    morning: ActivitySlot;
    lunch: ActivitySlot;
    afternoon: ActivitySlot;
    evening: ActivitySlot;
  };
  dailyCostUsd: number;
  dailyCostInr: number;
  dailyCostLocal: number;
  cumulativeCostUsd: number;
  cumulativeCostInr: number;
  cumulativeCostLocal: number;
}

export interface EmergencyContacts {
  country: string;
  police: string;
  ambulance: string;
  fire: string;
  touristPolice: string;
  embassyNotice: string;
  nearestMedicalHub: string;
  internationalDialCode: string;
  emergencyApps: string[];
}

export interface FullItinerary {
  id?: number;
  title: string;
  originCity?: string;
  originCountry?: string;
  destination: string;
  country: string;
  journey?: JourneyPlan;
  vibe: string;
  durationDays: number;
  startDate: string;
  endDate: string;
  budgetLevel: BudgetLevel;
  travelParty: TravelParty;
  pace: TravelPace;
  interests: string[];
  currency: string;
  totalCostUsd: number;
  totalCostInr: number;
  totalCostLocal: number;
  localCurrencyCode: string;
  localCurrencySymbol: string;
  days: DayPlan[];
  emergencyContacts: EmergencyContacts;
  packingChecklist: string[];
  transitGuidelines: string[];
  weatherAdvisory: string;
  vibeCompatibilityScore: number;
  createdAt?: string;
  hotels?: HotelStay[];
  restaurants?: RestaurantPick[];
}

export interface HotelStay {
  id: string;
  name: string;
  area: string;
  tier: BudgetLevel;
  nights: number;
  nightlyUsd: number;
  nightlyInr: number;
  totalUsd: number;
  totalInr: number;
  why: string;
  amenities: string[];
  mapsUrl: string;
  bookingLinks: BookingLink[];
}

export interface RestaurantPick {
  id: string;
  name: string;
  cuisine: string;
  area: string;
  meal: 'Breakfast' | 'Lunch' | 'Dinner' | 'Cafe' | 'Street food';
  priceForTwoInr: number;
  signature: string;
  vegFriendly: boolean;
  mapsUrl: string;
  bookingLinks: BookingLink[];
}

export interface DestinationRecommendation {
  id: string;
  city: string;
  country: string;
  vibe: string;
  matchScore: number;
  highlightTags: string[];
  budgetLevel: BudgetLevel;
  estDailyCostUsd: number;
  estDailyCostInr: number;
  bestSeason: string;
  currentSeasonWeather: string;
  topAttractions: string[];
  whyMatch: string;
  transitScore: string;
  imageUrl: string;
  localCurrency: string;
}
