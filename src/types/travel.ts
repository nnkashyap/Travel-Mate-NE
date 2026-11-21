export type StateId =
  | 'assam'
  | 'meghalaya'
  | 'arunachal'
  | 'nagaland'
  | 'manipur'
  | 'mizoram'
  | 'tripura'
  | 'sikkim';

export type DestinationCategory =
  | 'Highlands'
  | 'Heritage'
  | 'Wildlife'
  | 'Offbeat'
  | 'Trekking';

export type TravelTier = 'backpacker' | 'balanced' | 'comfort';

export type TransportPreference = 'shared' | 'private';

export type PermitRequirementType = 'None' | 'ILP' | 'PAP-Zone';

export type TravelerNationality = 'indian' | 'foreign';

export type HubId =
  | 'Guwahati (GAU)'
  | 'Bagdogra (IXB)'
  | 'Dimapur (DMU)'
  | 'Imphal (IMF)'
  | 'Agartala (IXA)'
  | 'Aizawl / Sairang';

export interface TransitOption {
  mode: 'Shared Sumo / Winger' | 'State Bus' | 'Train + Local Taxi' | 'Private Cab';
  fromHub: string;
  durationHours: number;
  costPerPersonINR: number;
  privateVehicleTotalINR?: number;
  departurePoint: string;
  tip: string;
}

export interface FoodItem {
  name: string;
  note: string;
  avgCostINR: number;
}

export interface StayRecommendation {
  tier: 'Homestay' | 'Hostel / Camp' | 'Boutique Eco-Lodge';
  exampleType: string;
  pricePerNightINR: number;
}

export interface Destination {
  id: string;
  slug: string;
  name: string;
  stateId: StateId;
  stateName: string;
  regionLabel: string;
  tagline: string;
  description: string;
  imageUrl: string;
  imageFocus?: string;
  coordinates: string;
  elevationMeters: number;
  categories: DestinationCategory[];
  isHiddenGem: boolean;
  permitType: PermitRequirementType;
  bestMonths: string[];
  idealDays: number;
  nearestHub: string;
  hubTravelHours: number;
  dailyBudgetINR: {
    backpacker: number;
    balanced: number;
    comfort: number;
  };
  connectivity: 'Strong 4G/5G' | 'Moderate 4G' | 'Limited / Patchy';
  transitOptions: TransitOption[];
  highlights: string[];
  mustTryFood: FoodItem[];
  stayRecommendations: StayRecommendation[];
  etiquetteTips: string[];
  dayActivities: {
    morning: string;
    afternoon: string;
    evening: string;
  }[];
}

export interface StateInfo {
  id: StateId;
  name: string;
  capital: string;
  tagline: string;
  summary: string;
  primaryHub: string;
  permitSummary: string;
  permitStatus: 'open' | 'permit' | 'zone-permit';
  bestMonths: string;
  signatureImage: string;
  mapPin: { x: number; y: number };
}

export interface StarterCircuit {
  id: string;
  title: string;
  subtitle: string;
  startingHub: HubId;
  destinationIds: string[];
  days: number;
  recommendedTier: TravelTier;
  highlightNote: string;
}

export interface CuratedCollection {
  id: string;
  title: string;
  kicker: string;
  description: string;
  imageUrl: string;
  budgetHint: string;
  filterPreset: {
    state?: StateId | 'all';
    permit?: 'all' | 'none' | 'required';
    budgetTier?: 'all' | 'budget' | 'mid' | 'comfort';
    hiddenGemOnly?: boolean;
    category?: DestinationCategory | 'all';
  };
}

export interface FestivalItem {
  id: string;
  name: string;
  stateId: StateId;
  stateName: string;
  location: string;
  monthIndex: number; // 0 = Jan ... 11 = Dec
  monthIndices?: number[];
  monthLabel: string;
  typicalDates: string;
  significance: string;
  bookingLeadTime: string;
  permitNote: string;
  imageUrl: string;
}

export interface RegionalDish {
  id: string;
  name: string;
  stateName: string;
  stateId: StateId;
  dietary: 'Veg-Friendly' | 'Non-Veg';
  flavorProfile: string;
  description: string;
  whereToFind: string;
  avgPriceRange: string;
}

export interface CulturalSiteItem {
  id: string;
  name: string;
  stateId: StateId;
  stateName: string;
  location: string;
  category:
    | 'Living Craft'
    | 'UNESCO & Monument'
    | 'Iconic Market'
    | 'Sacred Ecology';
  summary: string;
  visitorNote: string;
  imageUrl: string;
}

export interface SavedItinerary {
  id: string;
  name: string;
  createdAt: string;
  startingHub: HubId;
  destinationIds: string[];
  days: number;
  groupSize: number;
  tier: TravelTier;
  transportMode: TransportPreference;
  totalINR: number;
  perPersonINR: number;
}
