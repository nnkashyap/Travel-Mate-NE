import { StateInfo, CuratedCollection } from '../types/travel';

export const STATE_IMAGES = {
  hero: '/src/assets/images/hero_northeast_hills_1795236526186.jpg',
  assam: '/src/assets/images/assam_majuli_river_1795236524673.jpg',
  meghalaya: '/src/assets/images/meghalaya_root_bridge_1795236525575.jpg',
  arunachal: '/src/assets/images/arunachal_tawang_valley_1795236526016.jpg',
  nagaland: '/src/assets/images/nagaland_dzukou_valley_1795236525248.jpg',
  manipur: '/src/assets/images/manipur_loktak_lake_1795236526632.jpg',
  mizoram: '/src/assets/images/mizoram_reiek_hills_1795236526693.jpg',
  tripura: '/src/assets/images/tripura_unakoti_carvings_1795236526698.jpg',
  sikkim: '/src/assets/images/sikkim_yumthang_valley_1795236525425.jpg',
  sivasagar: '/src/assets/images/assam_sivasagar_heritage_1795244438187.jpg',
  monVillage: '/src/assets/images/nagaland_mon_village_1795244439002.jpg',
  zuluk: '/src/assets/images/sikkim_zuluk_silkroute_1795244436717.jpg',
  cuisine: '/src/assets/images/northeast_cuisine_spread_1795244438934.jpg',
} as const;

export const STATES: StateInfo[] = [
  {
    id: 'assam',
    name: 'Assam',
    capital: 'Dispur (Guwahati)',
    tagline: 'Riverine satras, floodplains, and highland coffee estates',
    summary:
      'The braided heart of the Brahmaputra valley and primary transit gateway to the Eight Sisters, spanning Majuli mask-makers, Kaziranga grasslands, and the quiet hills of Dima Hasao.',
    primaryHub: 'Guwahati (GAU)',
    permitSummary: 'No Permit Required',
    permitStatus: 'open',
    bestMonths: 'Nov – Apr',
    signatureImage: STATE_IMAGES.assam,
    mapPin: { x: 382, y: 215 },
  },
  {
    id: 'meghalaya',
    name: 'Meghalaya',
    capital: 'Shillong',
    tagline: 'Living root bridges, limestone canyons, and whistling villages',
    summary:
      'Cloud-swept Khasi, Jaintia, and Garo plateaus where century-old rubber fig bridges span emerald gorges and matrilineal villages guard ancient sacred groves.',
    primaryHub: 'Guwahati (GAU) → Shillong',
    permitSummary: 'No Permit Required',
    permitStatus: 'open',
    bestMonths: 'Oct – May',
    signatureImage: STATE_IMAGES.meghalaya,
    mapPin: { x: 274, y: 263 },
  },
  {
    id: 'arunachal',
    name: 'Arunachal Pradesh',
    capital: 'Itanagar',
    tagline: 'Dawn-lit Himalayan passes, Apatani valleys, and Monpa monasteries',
    summary:
      'India’s easternmost frontier rises from subtropical river gorges to 4,170m mountain passes, home to over twenty-six indigenous tribes and vast pine valleys.',
    primaryHub: 'Guwahati (GAU) / Dibrugarh',
    permitSummary: 'ILP Required (Indian) · PAP (Foreign)',
    permitStatus: 'permit',
    bestMonths: 'Oct – Apr',
    signatureImage: STATE_IMAGES.arunachal,
    mapPin: { x: 468, y: 120 },
  },
  {
    id: 'nagaland',
    name: 'Nagaland',
    capital: 'Kohima',
    tagline: 'Terraced hill villages, bamboo ridges, and living oral histories',
    summary:
      'Steep mountain spurs and fiercely conserved community forests lead to Khonoma’s green terraces and the wind-swept seasonal lilies of Dzükou Valley.',
    primaryHub: 'Dimapur (DMU)',
    permitSummary: 'ILP Required (Indian) · PAP (Foreign)',
    permitStatus: 'permit',
    bestMonths: 'Oct – May',
    signatureImage: STATE_IMAGES.nagaland,
    mapPin: { x: 486, y: 244 },
  },
  {
    id: 'manipur',
    name: 'Manipur',
    capital: 'Imphal',
    tagline: 'Floating phumdi lakes, classical dance, and all-women markets',
    summary:
      'An oval valley ringed by nine blue hill ranges, defined by the floating biomass islands of Loktak Lake, rare Sangai deer, and centuries-old Meitei culinary craft.',
    primaryHub: 'Imphal (IMF)',
    permitSummary: 'ILP Required (Indian) · PAP (Foreign)',
    permitStatus: 'permit',
    bestMonths: 'Oct – Mar',
    signatureImage: STATE_IMAGES.manipur,
    mapPin: { x: 452, y: 316 },
  },
  {
    id: 'mizoram',
    name: 'Mizoram',
    capital: 'Aizawl',
    tagline: 'Ridgeline hill towns, bamboo canopies, and civic stillness',
    summary:
      'Parallel north-south sandstone ranges draped in drifting cloud, where Aizawl clings gracefully to steep ridges and quiet hospitality defines every hillside village.',
    primaryHub: 'Aizawl / Sairang Railhead',
    permitSummary: 'ILP Required (Indian) · PAP (Foreign)',
    permitStatus: 'permit',
    bestMonths: 'Oct – Mar',
    signatureImage: STATE_IMAGES.mizoram,
    mapPin: { x: 382, y: 392 },
  },
  {
    id: 'tripura',
    name: 'Tripura',
    capital: 'Agartala',
    tagline: 'Forest-carved monoliths, lake palaces, and royal terracotta',
    summary:
      'Low bamboo hills and tranquil wetlands concealing eighth-century bas-relief rock carvings at Unakoti and the white-domed summer palace of Neermahal.',
    primaryHub: 'Agartala (IXA)',
    permitSummary: 'No Permit Required',
    permitStatus: 'open',
    bestMonths: 'Nov – Mar',
    signatureImage: STATE_IMAGES.tripura,
    mapPin: { x: 316, y: 368 },
  },
  {
    id: 'sikkim',
    name: 'Sikkim',
    capital: 'Gangtok',
    tagline: 'Glacial valleys, alpine rhododendrons, and Kanchenjunga mornings',
    summary:
      'India’s first fully organic state climbs rapidly from Teesta river bends to high glacial lakes, heritage monasteries, and Kanchenjunga viewpoints.',
    primaryHub: 'Bagdogra (IXB) / NJP',
    permitSummary: 'Zone PAP Only (North & East Borders)',
    permitStatus: 'zone-permit',
    bestMonths: 'Mar – May, Oct – Dec',
    signatureImage: STATE_IMAGES.sikkim,
    mapPin: { x: 112, y: 170 },
  },
];

export const CURATED_COLLECTIONS: CuratedCollection[] = [
  {
    id: 'guwahati-weekends',
    title: 'Under ₹10,000 Escapes from Guwahati',
    kicker: 'Budget-Smart Routes',
    description:
      'Direct shared Sumos and hill trains into Sohra, Haflong, and Kaziranga without complicated transfers or extra permit paperwork.',
    imageUrl: STATE_IMAGES.meghalaya,
    budgetHint: '₹1,100–₹1,800 / day',
    filterPreset: {
      budgetTier: 'budget',
      permit: 'none',
    },
  },
  {
    id: 'zero-permit-circuit',
    title: 'Zero-Permit First-Timer Circuit',
    kicker: 'Hassle-Free Entry',
    description:
      'Explore Assam’s river monasteries, Meghalaya’s canyon bridges, and Tripura’s stone monoliths carrying only a standard photo ID.',
    imageUrl: STATE_IMAGES.assam,
    budgetHint: 'No ILP needed',
    filterPreset: {
      permit: 'none',
    },
  },
  {
    id: 'hidden-valleys',
    title: 'Hidden Valleys Beyond the Crowds',
    kicker: 'Slow Travel',
    description:
      'Step off the mainstream trail into Kongthong’s tune-named hamlets, Mechuka’s wooden pastures, Khonoma’s green terraces, and Reiek Ridge.',
    imageUrl: STATE_IMAGES.mizoram,
    budgetHint: 'Verified Hidden Gems',
    filterPreset: {
      hiddenGemOnly: true,
    },
  },
  {
    id: 'himalayan-passes',
    title: 'High Passes & Alpine Sanctuaries',
    kicker: 'Highland Journeys',
    description:
      'Ascend into prayer-flag ridges across Tawang, Lachung’s Yumthang meadows, and Nagaland’s high bamboo bowl of Dzükou.',
    imageUrl: STATE_IMAGES.arunachal,
    budgetHint: '1,900m – 3,564m',
    filterPreset: {
      category: 'Highlands',
    },
  },
];

export const getStateById = (id: string): StateInfo | undefined =>
  STATES.find((s) => s.id === id);
