import { StarterCircuit, HubId } from '../types/travel';

export const GATEWAY_HUBS: {
  id: HubId;
  shortName: string;
  city: string;
  servesStates: string[];
  sumoStandNote: string;
  railhead: string;
}[] = [
  {
    id: 'Guwahati (GAU)',
    shortName: 'Guwahati',
    city: 'Guwahati, Assam',
    servesStates: ['Assam', 'Meghalaya', 'Arunachal Pradesh'],
    sumoStandNote: 'Paltan Bazar & Khanapara Flyover (5:30 AM – 2:30 PM departures)',
    railhead: 'Guwahati (GHY) / Kamakhya (KYQ)',
  },
  {
    id: 'Bagdogra (IXB)',
    shortName: 'Bagdogra',
    city: 'Siliguri / Bagdogra, WB',
    servesStates: ['Sikkim'],
    sumoStandNote: 'SNT Bus Terminus & Siliguri Junction Shared Jeep Stand',
    railhead: 'New Jalpaiguri (NJP)',
  },
  {
    id: 'Dimapur (DMU)',
    shortName: 'Dimapur',
    city: 'Dimapur, Nagaland',
    servesStates: ['Nagaland', 'Upper Assam'],
    sumoStandNote: 'Dimapur Railway Station Sumo Counter (Every 30 min to Kohima)',
    railhead: 'Dimapur (DMV)',
  },
  {
    id: 'Imphal (IMF)',
    shortName: 'Imphal',
    city: 'Imphal, Manipur',
    servesStates: ['Manipur'],
    sumoStandNote: 'Keishampat & Khwairamband Winger Stands',
    railhead: 'Jiribam / Dimapur Road Link',
  },
  {
    id: 'Agartala (IXA)',
    shortName: 'Agartala',
    city: 'Agartala, Tripura',
    servesStates: ['Tripura'],
    sumoStandNote: 'Nagerjala Bus & Shared Cruiser Stand',
    railhead: 'Agartala (AGTL)',
  },
  {
    id: 'Aizawl / Sairang',
    shortName: 'Aizawl',
    city: 'Aizawl & Lengpui, Mizoram',
    servesStates: ['Mizoram'],
    sumoStandNote: 'Zarkawt & Millennium Centre Regional Counters',
    railhead: 'Sairang / Bairabi',
  },
];

export const STARTER_CIRCUITS: StarterCircuit[] = [
  {
    id: 'meghalaya-classics',
    title: '5-Day Meghalaya Classics',
    subtitle: 'Nongriat Root Bridges · Shnongpdeng · Kongthong',
    startingHub: 'Guwahati (GAU)',
    destinationIds: ['nongriat-sohra', 'mawlynnong-dawki', 'kongthong'],
    days: 5,
    recommendedTier: 'balanced',
    highlightNote: 'Zero permits required; smooth shared Sumo transfers via Shillong.',
  },
  {
    id: 'tawang-roadtrip',
    title: '6-Day Tawang Roadtrip',
    subtitle: 'Dirang Acclimatization · Sela Pass · Tawang Monastery',
    startingHub: 'Guwahati (GAU)',
    destinationIds: ['tawang', 'ziro-valley'],
    days: 6,
    recommendedTier: 'balanced',
    highlightNote: 'Triggers Arunachal eILP guidance and high-altitude cab economics.',
  },
  {
    id: 'assam-wildlife-majuli',
    title: '4-Day Assam Wildlife & Majuli',
    subtitle: 'Kaziranga Floodplains · Majuli River Island',
    startingHub: 'Guwahati (GAU)',
    destinationIds: ['kaziranga', 'majuli'],
    days: 4,
    recommendedTier: 'balanced',
    highlightNote: 'Rhino safaris paired with Brahmaputra wooden ferries and satras.',
  },
  {
    id: 'nagaland-dzukou',
    title: '5-Day Nagaland & Dzükou',
    subtitle: 'Dzükou Valley Trek · Khonoma Green Village',
    startingHub: 'Dimapur (DMU)',
    destinationIds: ['dzukou-valley', 'khonoma'],
    days: 5,
    recommendedTier: 'backpacker',
    highlightNote: 'Short transfers from Dimapur; includes Nagaland ILP checkpost tips.',
  },
  {
    id: 'sikkim-alpine',
    title: '6-Day Sikkim Silk Route & West Heritage',
    subtitle: 'Zuluk Hairpin Loops · Pelling & Yuksom · Lachung',
    startingHub: 'Bagdogra (IXB)',
    destinationIds: ['zuluk-silk-route', 'pelling-yuksom', 'lachung-yumthang'],
    days: 6,
    recommendedTier: 'balanced',
    highlightNote: 'Combines permit-free Kanchenjunga sunrises with Old Silk Route and North Sikkim border permits.',
  },
  {
    id: 'upper-assam-ahom',
    title: '5-Day Ahom Heritage & River Islands',
    subtitle: 'Sivasagar Charaideo Maidams · Majuli · Kaziranga',
    startingHub: 'Guwahati (GAU)',
    destinationIds: ['sivasagar-ahom', 'majuli', 'kaziranga'],
    days: 5,
    recommendedTier: 'balanced',
    highlightNote: 'Zero permits needed; links UNESCO Ahom burial mounds, satra masks, and rhino grasslands.',
  },
  {
    id: 'manipur-valleys-hills',
    title: '5-Day Manipur Floating Lake & Shirui Hills',
    subtitle: 'Loktak Lake & Keibul Lamjao · Ukhrul & Shirui Peak',
    startingHub: 'Imphal (IMF)',
    destinationIds: ['loktak-lake', 'ukhrul-shirui'],
    days: 5,
    recommendedTier: 'backpacker',
    highlightNote: 'Direct Winger transfers out of Imphal; includes Manipur ILP and seasonal Shirui Lily timing.',
  },
  {
    id: 'tripura-mizoram-ridge',
    title: '6-Day Tripura Monoliths & Jampui Ridge',
    subtitle: 'Neermahal · Unakoti Rock Carvings · Jampui Hills',
    startingHub: 'Agartala (IXA)',
    destinationIds: ['neermahal', 'unakoti', 'jampui-hills'],
    days: 6,
    recommendedTier: 'backpacker',
    highlightNote: 'Completely permit-free heritage circuit pairing lake palaces, jungle monoliths, and orange-orchard ridges.',
  },
];
