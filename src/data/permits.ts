import { StateId } from '../types/travel';

export interface StatePermitRule {
  stateId: StateId;
  stateName: string;
  indian: {
    required: boolean;
    code: string;
    label: string;
    feeINR: number;
    feeDisplay: string;
    validity: string;
    portal: string;
    checkposts: string;
    steps: string[];
    note: string;
  };
  foreign: {
    required: boolean;
    code: string;
    label: string;
    feeINR: number;
    feeDisplay: string;
    validity: string;
    portal: string;
    checkposts: string;
    steps: string[];
    note: string;
  };
}

export const PERMIT_RULES: Record<StateId, StatePermitRule> = {
  assam: {
    stateId: 'assam',
    stateName: 'Assam',
    indian: {
      required: false,
      code: 'OPEN',
      label: 'No Permit Required',
      feeINR: 0,
      feeDisplay: 'Free · Open Entry',
      validity: 'Unrestricted',
      portal: 'No application needed',
      checkposts: 'Standard highway checks only',
      steps: ['Carry any valid government photo ID (Aadhaar, Voter ID, Passport, or Driving License) for hotel check-ins and Kaziranga safari permits.'],
      note: 'Assam serves as the permit-free transit spine connecting all neighboring hill states.',
    },
    foreign: {
      required: false,
      code: 'OPEN',
      label: 'No Special Permit Required',
      feeINR: 0,
      feeDisplay: 'Standard Indian Visa',
      validity: 'Per Indian e-Visa / Visa',
      portal: 'No state permit needed',
      checkposts: 'Standard passport verification at hotels',
      steps: ['Travel freely across Guwahati, Kaziranga, Majuli, and Haflong with a valid passport and Indian visa.'],
      note: 'Carry passport photocopies for Kaziranga National Park foreign-visitor entry counters.',
    },
  },
  meghalaya: {
    stateId: 'meghalaya',
    stateName: 'Meghalaya',
    indian: {
      required: false,
      code: 'OPEN',
      label: 'No Permit Required',
      feeINR: 0,
      feeDisplay: 'Free · Open Entry',
      validity: 'Unrestricted',
      portal: 'Optional Meghalaya Tourism App registration',
      checkposts: 'Byrnihat entry corridor',
      steps: ['Carry a valid government photo ID for homestay check-ins across Shillong, Sohra, and Dawki.'],
      note: 'Zero ILP friction—ideal for spontaneous weekend trips from Guwahati.',
    },
    foreign: {
      required: false,
      code: 'OPEN',
      label: 'No Special Permit Required',
      feeINR: 0,
      feeDisplay: 'Standard Indian Visa',
      validity: 'Per Indian Visa',
      portal: 'No PAP required',
      checkposts: 'Passport registration at Shillong/Sohra stays',
      steps: ['Enter freely via Guwahati–Shillong highway with a valid passport and Indian visa.'],
      note: 'Keep your passport handy near Dawki / Tamabil international border viewpoints.',
    },
  },
  tripura: {
    stateId: 'tripura',
    stateName: 'Tripura',
    indian: {
      required: false,
      code: 'OPEN',
      label: 'No Permit Required',
      feeINR: 0,
      feeDisplay: 'Free · Open Entry',
      validity: 'Unrestricted',
      portal: 'No application needed',
      checkposts: 'Standard transit checks',
      steps: ['Carry a valid government photo ID for flights into Agartala, train travel to Kumarghat, and state lodges.'],
      note: 'Completely open for heritage exploration across Unakoti, Neermahal, and Jampui Hills.',
    },
    foreign: {
      required: false,
      code: 'OPEN',
      label: 'No Special Permit Required',
      feeINR: 0,
      feeDisplay: 'Standard Indian Visa',
      validity: 'Per Indian Visa',
      portal: 'No PAP required',
      checkposts: 'Agartala Airport / Akhaura border',
      steps: ['Explore Agartala, Melaghar, and Unakoti freely on a standard Indian tourist visa.'],
      note: 'If crossing overland to or from Bangladesh at Akhaura, verify land-port visa endorsements.',
    },
  },
  arunachal: {
    stateId: 'arunachal',
    stateName: 'Arunachal Pradesh',
    indian: {
      required: true,
      code: 'ILP-REQ',
      label: 'Inner Line Permit (eILP) Required',
      feeINR: 500,
      feeDisplay: '₹300 (up to 3 days) · ₹500 (4–14 days)',
      validity: '3 to 14 Days (Tourist eILP)',
      portal: 'eilp.arunachal.gov.in',
      checkposts: 'Bhalukpong (Tawang), Banderdewa & Kimin (Ziro), Ruksin (Pasighat/Mechuka)',
      steps: [
        'Apply online at eilp.arunachal.gov.in at least 3–5 days before arrival (instant/same-day approval in most cases).',
        'Upload a passport-size photo and Voter ID, Aadhaar, or Driving License; list every district you plan to enter (e.g., West Kameng & Tawang).',
        'Print 2 hard copies—officials stamp physical permits at Bhalukpong, Kimin, and Ruksin gates.',
      ],
      note: 'For Bum La Pass near Tawang, obtain an additional local DC office permit via a Tawang union cab operator.',
    },
    foreign: {
      required: true,
      code: 'PAP-REQ',
      label: 'Protected Area Permit (PAP) Required',
      feeINR: 4200,
      feeDisplay: '~$50 USD (≈₹4,200) via Registered Operator',
      validity: 'Up to 30 Days',
      portal: 'arunachaltourism.com / Registered Tour Operator',
      checkposts: 'Bhalukpong, Banderdewa, Dirak, Hollongi Airport',
      steps: [
        'Apply at least 2–3 weeks in advance through a government-registered Arunachal tour operator or e-FRRO portal.',
        'Submit passport copy, valid Indian visa, fixed day-by-day district itinerary, and 2 photographs.',
        'Carry multiple printed copies of the approved PAP for army and police checkposts.',
      ],
      note: 'Certain frontier border points (such as Bum La Pass) remain restricted exclusively to Indian nationals.',
    },
  },
  nagaland: {
    stateId: 'nagaland',
    stateName: 'Nagaland',
    indian: {
      required: true,
      code: 'ILP-REQ',
      label: 'Inner Line Permit (ILP) Required',
      feeINR: 200,
      feeDisplay: '₹200 (Domestic Tourist)',
      validity: '30 Days',
      portal: 'ilp.nagaland.gov.in',
      checkposts: 'Chümoukedima (Dimapur–Kohima Hwy), Dimapur Airport/Station, Khuzama',
      steps: [
        'Register online at ilp.nagaland.gov.in and select "Domestic Tourist" category.',
        'Upload photo ID and a recent photograph; pay ₹200 online to receive the QR-coded eILP.',
        'Keep a printed copy ready at the Chümoukedima highway gate between Dimapur and Kohima.',
      ],
      note: 'Apply 7–10 days ahead during December’s Hornbill Festival when portal traffic surges.',
    },
    foreign: {
      required: true,
      code: 'PAP-REQ',
      label: 'Protected Area Permit (PAP) Required',
      feeINR: 2500,
      feeDisplay: 'Fee varies via Registered Operator / FRRO',
      validity: 'Up to 30 Days',
      portal: 'indianfrro.gov.in / Nagaland Tourism Desk',
      checkposts: 'Dimapur Airport, Chümoukedima Gate, Kohima FRO',
      steps: [
        'Arrange PAP clearance prior to arrival via e-FRRO or a registered Nagaland tour operator.',
        'Register your arrival at the Foreigners Registration Office (FRO) or designated airport desk as directed on your permit.',
      ],
      note: 'Check current seasonal exemptions or reporting steps with Nagaland Tourism before Hornbill Festival travel.',
    },
  },
  manipur: {
    stateId: 'manipur',
    stateName: 'Manipur',
    indian: {
      required: true,
      code: 'ILP-REQ',
      label: 'Inner Line Permit (ILP) Required',
      feeINR: 100,
      feeDisplay: '₹100 (Temporary Tourist Permit)',
      validity: '30 Days',
      portal: 'manipurilponline.mn.gov.in',
      checkposts: 'Imphal Airport (IMF) Counter, Mao Gate (from Kohima), Jiribam',
      steps: [
        'Apply online at manipurilponline.mn.gov.in under Temporary Permit or collect on arrival at Imphal Airport ILP kiosk.',
        'Upload Aadhaar/Voter ID and photograph; pay the ₹100 fee.',
        'Carry your printed pass when traveling south from Imphal toward Loktak Lake and Moirang.',
      ],
      note: 'Verify current road advisories before planning overland highway crossings between Kohima and Imphal.',
    },
    foreign: {
      required: true,
      code: 'PAP-REQ',
      label: 'Protected Area Permit (PAP) Required',
      feeINR: 2500,
      feeDisplay: 'Via e-FRRO / Registered Operator',
      validity: 'Per approved itinerary',
      portal: 'indianfrro.gov.in',
      checkposts: 'Imphal International Airport (IMF)',
      steps: [
        'Apply well in advance via e-FRRO or an accredited regional travel agency with confirmed flights and hotel stays.',
        'Present printed PAP approval upon landing at Imphal Airport.',
      ],
      note: 'Travel is typically approved for Imphal city and Loktak Lake tourist circuits.',
    },
  },
  mizoram: {
    stateId: 'mizoram',
    stateName: 'Mizoram',
    indian: {
      required: true,
      code: 'ILP-REQ',
      label: 'Inner Line Permit (ILP) Required',
      feeINR: 120,
      feeDisplay: '₹120 Regular · ₹220 Special (15 Days)',
      validity: 'Up to 15 Days (Temporary Tourist ILP)',
      portal: 'ilp.mizoram.gov.in',
      checkposts: 'Lengpui Airport, Sairang Railway Station, Vairengte Checkgate',
      steps: [
        'Apply online via ilp.mizoram.gov.in OR obtain a Temporary ILP on arrival at Lengpui Airport / Sairang station.',
        'Carry 2 passport-size photographs and a valid photo ID (Voter ID, Passport, or Driving License).',
        'Keep your stamped ILP slip safely for your return departure check.',
      ],
      note: 'Arrival counters at Lengpui Airport and Sairang are friendly and usually clear tourists in under 15 minutes.',
    },
    foreign: {
      required: true,
      code: 'PAP-REQ',
      label: 'Protected Area Permit (PAP) Required',
      feeINR: 2500,
      feeDisplay: 'Via e-FRRO / Registered Operator',
      validity: 'Per approved itinerary',
      portal: 'indianfrro.gov.in / Mizoram Tourism',
      checkposts: 'Lengpui Airport, Vairengte Gate',
      steps: [
        'Secure PAP clearance in advance through e-FRRO or an accredited Mizoram tour operator.',
        'Register at the designated police/FRO desk in Aizawl within 24 hours if stipulated on your permit.',
      ],
      note: 'Remember that Aizawl offices and counters remain closed on Sundays.',
    },
  },
  sikkim: {
    stateId: 'sikkim',
    stateName: 'Sikkim',
    indian: {
      required: false,
      code: 'PAP-ZONE',
      label: 'No State ILP · Zone PAP for North & East Borders',
      feeINR: 250,
      feeDisplay: 'Free (Gangtok/Pelling) · ~₹250–₹400 Zone Permit via Agency',
      validity: 'Per Day / Circuit (North & East Zones)',
      portal: 'Arranged via Registered Gangtok Tour Operator',
      checkposts: 'Rangpo (Open), Toong/Chungthang (North Sikkim), 3rd Mile (Tsomgo/Nathu La)',
      steps: [
        'Gangtok, Pelling, Yuksom, and Namchi need ZERO permits—enter directly via Rangpo or Melli.',
        'For North Sikkim (Lachung, Yumthang, Lachen, Gurudongmar) or East Sikkim (Tsomgo Lake, Nathu La, Zuluk), submit documents to a registered Gangtok operator 24 hours ahead.',
        'Carry original Voter ID, Driving License, or Passport + 2 passport photos—Aadhaar cards are NOT accepted for Nathu La or North Sikkim army checkpoints.',
      ],
      note: 'Nathu La Pass remains closed to visitors on Mondays and Tuesdays.',
    },
    foreign: {
      required: true,
      code: 'RAP+PAP',
      label: 'Free RAP Required · Zone PAP for Restricted Valleys',
      feeINR: 500,
      feeDisplay: 'RAP Free · Zone PAP via Registered Agency',
      validity: '30 Days (RAP, extendable)',
      portal: 'sikkimtourism.gov.in / Rangpo & Melli Border Posts',
      checkposts: 'Rangpo Checkpost, Melli Bridge, Bagdogra Sikkim Counter',
      steps: [
        'Collect the free Restricted Area Permit (RAP) online or on arrival at Rangpo/Melli checkpost with passport, visa, and 2 photos.',
        'RAP covers Gangtok, Pelling, Yuksom, and Ravangla freely.',
        'For Lachung/Yumthang or Tsomgo Lake, travel in a minimum group of 2 through a registered Sikkim agency to obtain a Protected Area Permit (PAP). Nathu La & Gurudongmar remain restricted for foreign nationals.',
      ],
      note: 'Allow 20 minutes at Rangpo bridge for your passport and RAP stamp.',
    },
  },
};

export interface ChecklistItem {
  id: string;
  label: string;
  detail: string;
}

export const PRE_TRAVEL_CHECKLIST: ChecklistItem[] = [
  {
    id: 'printed-permits',
    label: 'Print 2–3 physical copies of every eILP / PAP',
    detail: 'Checkposts at Bhalukpong, Chümoukedima, and Toong require paper slips—mobile PDFs are often declined when network drops.',
  },
  {
    id: 'passport-photos',
    label: 'Pack 4 recent passport-size photographs',
    detail: 'Required for Sikkim North/East zone permits, Lengpui/Imphal on-arrival ILP kiosks, and Bum La passes.',
  },
  {
    id: 'non-aadhaar-id',
    label: 'Carry original Voter ID, Driving License, or Passport',
    detail: 'Sikkim’s Nathu La and North Sikkim border checkposts strictly do not accept Aadhaar cards.',
  },
  {
    id: 'offline-maps',
    label: 'Download offline regional maps and transit notes',
    detail: 'Data drops across mountain passes (Sela, Mechuka, Kongthong, Dzükou) where only BSNL or Jio holds signal.',
  },
  {
    id: 'cash-small-notes',
    label: 'Carry ₹3,000–₹5,000 in small-denomination cash',
    detail: 'Shared Sumos, village homestays, and remote tea stalls rarely accept cards and UPI fails in patchy zones.',
  },
  {
    id: 'reusable-bottle',
    label: 'Pack a refillable metal bottle & cloth tote',
    detail: 'Single-use plastic bottles are banned in Dzükou Valley, Lachung, Yumthang, and Khonoma.',
  },
];
