const img = (id, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=85&auto=format&fit=crop`;

// width=800 keeps Wikimedia serving resized thumbs — larger values can
// redirect to the multi-MB original file and stall page load.
const fp = (name) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(name)}?width=800`;

const W = {
  petronas: fp('Petronas_Towers_at_Night_-_from_the_base_upwards.jpg'),
  klSkyline: fp('Kl-skyline-at-night-2022.jpg'),
  jalanAlor: fp('Jalan_Alor_-_Kuala_Lumpur.jpg'),
  batuCaves: fp('Batu_Caves_stairs_2022-05.jpg'),
  genting: fp('View_from_Awana_Skyway_(230918)_27.jpg'),
  georgeTown: fp('Beach_Street,_George_Town_02.jpg'),
  penangArt: fp('Penang_-_Boy_on_a_Bike.JPG'),
  monkeyBeach: fp('Monkeybeach08.jpg'),
  pantaiCenang: fp('Langkawi_Pantai_Cenang.jpg'),
  skyCab: fp('Langkawi_sky_bridge.jpg'),
  orientalVillage: fp('Oriental_Village_in_Langkawi.JPG'),
  kilim: fp('Kilim_Geoforest_Park,_Langkawi.jpg'),
  mossyForest: fp('Gunung_Irau_(The_Mossy_Forest)_(26119232711).jpg'),
};

// Single source of truth for currency conversion — every component that
// shows EUR must import this (do NOT redefine a local rate).
export const EUR_RATE = 4.66; // 1 € ≈ 4.66 MYR

// Two travelers, twin-share. Every "pp" cost for a shared ride/room/scooter
// is the per-car (or per-room) price ÷ 2. If the group size changes, every
// hand-written shared cost below must be re-derived.
export const GROUP_SIZE = 2;

export const TRIP_META = {
  title: 'Malaysia Trip Guide',
  subtitle: 'Squad Edition 2026',
  dates: '22 July – 4 August 2026',
  duration: '14 days / 13 nights',
  group: 'Male friends · Halal-only · Twin-share',
  transport: 'Bus, ferry, ETS train, cable car & Grab — no internal flights',
  rate: '1 € ≈ 4.66 MYR',
  heroImage: fp('Petronas_Towers_at_Night_-_from_the_base_upwards.jpg'),
};

export const CITIES = [
  { name: 'Kuala Lumpur', nights: 3, vibe: 'Arrival, Towers, Batu Caves, Genting day trip', color: '#f97316' },
  { name: 'Penang', nights: 3, vibe: 'Heritage, street art, Monkey Beach + ESCAPE', color: '#e85d4c' },
  { name: 'Langkawi', nights: 5, vibe: 'SkyCab, mangrove kayak, jet ski, sea-view pool, extra chill day', color: '#2a9d8f' },
  { name: 'Kuala Lumpur', nights: 2, vibe: 'Broga Hill sunrise, Zoo Negara or Sunway Lagoon, Chinatown', color: '#f97316' },
];

export const OPTIONS = {
  gentingAddon: {
    id: 'gentingAddon',
    label: 'Day 3 theme park pick',
    day: 3,
    choices: [
      { id: 'none', label: 'Genting — free explore only', cost: 0, desc: 'Cable car + Chin Swee Temple + viewpoints' },
      { id: 'skytropolis', label: 'Genting + Skytropolis indoor', cost: 80, desc: 'RM70–90 · Good if raining', book: 'https://www.klook.com' },
      { id: 'skyworlds', label: 'Genting + SkyWorlds outdoor', cost: 168, desc: 'RM168 online · Big theme park at the Genting peak', book: 'https://www.gentingskyworlds.com' },
    ],
  },
  langkawiExtraDay: {
    id: 'langkawiExtraDay',
    label: 'Langkawi extra day (Day 11)',
    day: 11,
    choices: [
      { id: 'restDay', label: 'Rest day — beach & pool', cost: 0, desc: 'No plan. Sleep in, swim, nap. The point of the extra night.' },
      { id: 'skytrex', label: 'Skytrex Adventure Langkawi', cost: 100, desc: 'RM90–120 · Treetop obstacle course & ziplines, ~2–3h', book: 'https://www.skytrexadventure.com' },
      { id: 'atv', label: 'ATV jungle tour', cost: 130, desc: 'RM100–150 · Guided jungle/paddy-field ATV ride, ~2h' },
    ],
  },
  finalDayActivity: {
    id: 'finalDayActivity',
    label: 'Last full day pick (Day 13 afternoon)',
    day: 13,
    choices: [
      { id: 'freeTime', label: 'Free time / rest', cost: 0, desc: 'No extra activity — pool, nap, or last-minute shopping' },
      { id: 'zooNegara', label: 'Zoo Negara (Giant Pandas)', cost: 118, desc: 'RM88 ticket + ~RM30 pp Grab return (RM50–70/car, split by 2) · Xing Xing & Liang Liang, Malaysia\'s only giant pandas', book: 'https://ticket.zoonegara.my' },
      { id: 'sunwayLagoon', label: 'Sunway Lagoon', cost: 300, desc: 'RM263–268 ticket + ~RM30 pp Grab return · 6 zones: water, amusement, wildlife, extreme, scream, lost lagoon · Full day — pairs less well with the 04:30 Broga wake-up', book: 'https://sunwaylagoon.com/etickets/' },
    ],
  },
  langkawiActivity: {
    id: 'langkawiActivity',
    label: 'Langkawi water day (Day 10)',
    day: 10,
    choices: [
      { id: 'islandHop', label: 'Island hopping', cost: 60, desc: 'RM40–80 · Relaxed, budget-friendly', book: 'https://alanona.com/island-hopping-price' },
      { id: 'jetski', label: 'Jet ski guided tour', cost: 275, desc: 'RM225–300 pp · 2 riders per ski, ~4h', book: 'https://langkawigotours.com/jet-ski-tour-langkawi' },
      { id: 'both', label: 'Both (full send)', cost: 335, desc: 'Morning hop + afternoon jet ski' },
    ],
  },
  langkawiStay: {
    id: 'langkawiStay',
    label: 'Langkawi splurge (Day 10 night)',
    day: 10,
    choices: [
      { id: 'guesthouse', label: 'Guesthouse all 5 nights', cost: 0, desc: 'RM60–90 pp/night · Budget twin-share' },
      { id: 'poolPass', label: 'Guesthouse + pool day-pass', cost: 50, desc: 'RM30–80 pp · Call resort ahead' },
      { id: 'splurge', label: '1 sea-view resort night', cost: 225, desc: 'RM175–275 pp · Bayou / PARKROYAL / Casa del Mar', book: 'https://www.booking.com/searchresults.html?ss=Pantai+Cenang+Langkawi' },
    ],
  },
};

// All amounts in MYR, per person (twin-share room cost ÷2)
export const BUDGET = [
  { category: 'Accommodation (13 nights)', min: 545, max: 830, note: 'Budget twin-share ÷2 pp · 5 KL nights + 3 Penang + 5 Langkawi' },
  { category: 'Tourism tax (foreigners)', min: 65, max: 65, note: 'RM10 per room per night × 13 nights ÷ 2 — often collected at check-in, not in the booking price' },
  { category: 'Transport', min: 345, max: 440, note: 'Buses, ferries, ETS train, cable car, Grab' },
  { category: 'Food & drink', min: 600, max: 700, note: '~50 MYR/day, hawker-heavy, halal-checked' },
  { category: 'Snacks, drinks & extras', min: 280, max: 420, note: '~RM20–30/day — cendol, bubble tea, roadside snacks, fresh juice, trying everything' },
  { category: 'Activities & adventure', min: 920, max: 1270, note: 'Towers, Genting, ESCAPE, SkyCab, kayak, jet ski, Broga Hill (free), mosques/museums — optional Zoo Negara (+88) or Sunway Lagoon (+263), pick one' },
  { category: 'Souvenirs & duty-free', min: 100, max: 200, note: 'Optional — Langkawi is duty-free' },
  { category: 'Misc (SIM, laundry, tips)', min: 80, max: 120, note: 'MDAC is free; SIM ~RM40' },
  { category: 'Hidden & unexpected costs', min: 150, max: 250, note: 'Surge-priced Grabs, pay toilets, pharmacy, forgotten items, price creep' },
  { category: 'CORE TOTAL', min: 3085, max: 4295, note: '≈ 662–922 € per person (1€ = 4.66 MYR)', highlight: true },
  { category: 'Suggested buffer', min: 400, max: 500, note: 'Upgrades, extras, bad-weather plan B' },
];

export const BOOKINGS = [
  { item: 'Petronas Twin Towers', price: 'RM150–160 pp', source: 'petronastwintowers.com.my', url: 'https://eticket.petronastwintowers.com.my', image: W.petronas, presetId: 'b1' },
  { item: 'Genting SkyWorlds', price: 'RM168 online', source: 'gentingskyworlds.com', url: 'https://www.gentingskyworlds.com', image: W.genting, presetId: 'b3' },
  { item: 'Sunway Lagoon (Day 13 option)', price: 'RM263 all-park', source: 'sunwaylagoon.com', url: 'https://sunwaylagoon.com/etickets/', image: W.klSkyline, presetId: 'b14' },
  { item: 'Awana SkyWay cable car', price: 'RM22 return', source: 'rwgenting.com', url: 'https://www.rwgenting.com', image: W.genting, presetId: 'b2' },
  { item: 'Bus KL → Penang', price: 'RM45–90 pp', source: 'easybook.com', url: 'https://www.easybook.com', image: W.georgeTown, presetId: 'b4' },
  { item: 'Penang Hill funicular', price: 'RM30–35 pp', source: 'penanghill.gov.my', url: 'https://www.penanghill.gov.my', image: W.georgeTown, presetId: 'b5' },
  { item: 'ESCAPE Penang', price: 'RM182–190 pp', source: 'escape.my', url: 'https://escape.my/pg/buy-tickets', image: W.monkeyBeach, presetId: 'b6' },
  { item: 'Ferry Penang → Langkawi', price: 'RM70–90 pp', source: 'Traveloka', url: 'https://www.traveloka.com', image: W.pantaiCenang, presetId: 'b7' },
  { item: 'Langkawi SkyCab + Bridge', price: 'RM97 pp', source: 'panoramalangkawi.com', url: 'https://www.panoramalangkawi.com', image: W.skyCab, presetId: 'b8' },
  { item: 'Kilim kayak + boat tour', price: 'RM160–205 pp', source: 'langkawigotours.com', url: 'https://langkawigotours.com/mangrove-kayaking-tour-langkawi', image: W.kilim, presetId: 'b9' },
  { item: 'Jet ski tour', price: 'RM225–300 pp', source: 'langkawigotours.com', url: 'https://langkawigotours.com/jet-ski-tour-langkawi', image: W.pantaiCenang, presetId: 'b10' },
  { item: 'Ferry Langkawi → Kuala Kedah', price: 'RM35–40 pp', source: 'Traveloka', url: 'https://www.traveloka.com', image: W.pantaiCenang, presetId: 'b11' },
  { item: 'ETS Train Alor Setar → KL Sentral', price: 'RM50–79 pp', source: 'KTMB', url: 'https://online.ktmb.com.my', image: W.klSkyline, presetId: 'b12' },
  { item: 'Zoo Negara (Giant Pandas)', price: 'RM88 pp', source: 'zoonegara.my', url: 'https://ticket.zoonegara.my', image: W.klSkyline, presetId: 'b13' },
  { item: 'MDAC arrival card', price: 'Free', source: 'imigresen-online.imi.gov.my', url: 'https://imigresen-online.imi.gov.my', image: W.petronas, presetId: null },
];

// Max hotel budget for the trip (budget tier, room cost, 13 nights)
export const HOTEL_BUDGET_MAX = 1600;

export const HOTELS = [
  {
    city: 'Kuala Lumpur',
    nights: '3 nights (Days 1–3) + 2 nights (Days 12–13)',
    nightCount: 5,
    dateRanges: [{ checkIn: '22 Jul', checkOut: '25 Jul' }, { checkIn: '02 Aug', checkOut: '04 Aug' }],
    area: 'Bukit Bintang — walkable to Jalan Alor, monorail, malls',
    options: [
      {
        tier: 'Budget',
        name: 'Travelodge Bukit Bintang',
        price: 'RM90–130 / room / night',
        pricePerPerson: 'RM45–65 pp',
        estMin: 90, estMax: 130,
        presetId: 'h-kl-budget',
        highlights: ['Central Bukit Bintang location', 'Clean twin rooms with AC', 'Walk to Jalan Alor in 5 min'],
        bookUrl: 'https://www.booking.com/hotel/my/travelodge-bukit-bintang-kuala-lumpur.html',
        agodaUrl: 'https://www.agoda.com/search?city=3573&textToSearch=Travelodge+Bukit+Bintang',
      },
      {
        tier: 'Mid-range',
        name: 'Hotel Butterfly on Silang',
        price: 'RM180–260 / room / night',
        pricePerPerson: 'RM90–130 pp',
        estMin: 180, estMax: 260,
        presetId: 'h-kl-mid',
        highlights: ['Rooftop pool', 'Free breakfast some packages', 'Next to Petaling Street & Chinatown'],
        bookUrl: 'https://www.booking.com/hotel/my/butterfly-on-silang.html',
        agodaUrl: 'https://www.agoda.com/search?city=3573&textToSearch=Butterfly+on+Silang',
      },
      {
        tier: 'Splurge',
        name: 'Berjaya Times Square Hotel',
        price: 'RM320–480 / room / night',
        pricePerPerson: 'RM160–240 pp',
        estMin: 320, estMax: 480,
        presetId: 'h-kl-splurge',
        highlights: ['Connected to Times Square mall', 'Large rooms & pool', '5 min walk to Bukit Bintang strip'],
        bookUrl: 'https://www.booking.com/hotel/my/berjaya-times-square.html',
        agodaUrl: 'https://www.agoda.com/search?city=3573&textToSearch=Berjaya+Times+Square+Hotel',
      },
    ],
  },
  {
    city: 'Penang',
    nights: '3 nights (Days 4–6)',
    nightCount: 3,
    dateRanges: [{ checkIn: '25 Jul', checkOut: '28 Jul' }],
    area: 'George Town — Chulia St / Love Lane, walk to all street art & hawker stalls',
    options: [
      {
        tier: 'Budget',
        name: 'Ryokan Muntri',
        price: 'RM80–120 / room / night',
        pricePerPerson: 'RM40–60 pp',
        estMin: 80, estMax: 120,
        presetId: 'h-pg-budget',
        highlights: ['Heritage shophouse style', 'Love Lane location', 'Shared lounge, very social'],
        bookUrl: 'https://www.booking.com/hotel/my/ryokan-muntri.html',
        agodaUrl: 'https://www.agoda.com/search?city=1490&textToSearch=Ryokan+Muntri+Penang',
      },
      {
        tier: 'Mid-range',
        name: 'The Edison George Town',
        price: 'RM200–320 / room / night',
        pricePerPerson: 'RM100–160 pp',
        estMin: 200, estMax: 320,
        presetId: 'h-pg-mid',
        highlights: ['Restored heritage building', 'Rooftop bar', 'Heart of George Town UNESCO zone'],
        bookUrl: 'https://www.booking.com/hotel/my/the-edison-george-town-penang.html',
        agodaUrl: 'https://www.agoda.com/search?city=1490&textToSearch=Edison+George+Town',
      },
      {
        tier: 'Splurge',
        name: 'Macalister Mansion',
        price: 'RM480–700 / room / night',
        pricePerPerson: 'RM240–350 pp',
        estMin: 480, estMax: 700,
        presetId: 'h-pg-splurge',
        highlights: ['Boutique colonial mansion', 'Award-winning design', 'Pool & fine dining on-site'],
        bookUrl: 'https://www.booking.com/hotel/my/macalister-mansion.html',
        agodaUrl: 'https://www.agoda.com/search?city=1490&textToSearch=Macalister+Mansion+Penang',
      },
    ],
  },
  {
    city: 'Langkawi',
    nights: '5 nights (Days 7–11)',
    nightCount: 5,
    dateRanges: [{ checkIn: '28 Jul', checkOut: '02 Aug' }],
    area: 'Pantai Cenang — beach strip, restaurants, scooter hire all on your doorstep',
    options: [
      {
        tier: 'Budget',
        name: 'Cenang Rest House',
        price: 'RM80–130 / room / night',
        pricePerPerson: 'RM40–65 pp',
        estMin: 80, estMax: 130,
        presetId: 'h-lkw-budget',
        highlights: ['2 min walk to Pantai Cenang beach', 'Clean twin-share rooms', 'Budget-friendly base'],
        bookUrl: 'https://www.booking.com/searchresults.html?ss=Pantai+Cenang+Langkawi&nflt=price%3DRMN-0-150-1',
        agodaUrl: 'https://www.agoda.com/search?city=1481&textToSearch=Cenang+Langkawi+budget',
      },
      {
        tier: 'Mid-range',
        name: 'The Bayou Hotel Langkawi',
        price: 'RM250–380 / room / night',
        pricePerPerson: 'RM125–190 pp',
        estMin: 250, estMax: 380,
        presetId: 'h-lkw-mid',
        highlights: ['Sea-view rooms available', 'Pool on-site', 'Right on Pantai Cenang strip'],
        bookUrl: 'https://www.booking.com/hotel/my/the-bayou-langkawi.html',
        agodaUrl: 'https://www.agoda.com/search?city=1481&textToSearch=Bayou+Hotel+Langkawi',
      },
      {
        tier: 'Splurge',
        name: 'PARKROYAL Langkawi Resort',
        price: 'RM480–750 / room / night',
        pricePerPerson: 'RM240–375 pp',
        estMin: 480, estMax: 750,
        presetId: 'h-lkw-splurge',
        highlights: ['Infinity pool over the sea', 'Private beach', 'Full resort facilities'],
        bookUrl: 'https://www.booking.com/hotel/my/parkroyal-langkawi-resort.html',
        agodaUrl: 'https://www.agoda.com/search?city=1481&textToSearch=PARKROYAL+Langkawi',
      },
    ],
  },
];

// Prices: buses / ferries / trains are per person; Grab prices are per CAR
// (split by 2 for the pp figure used in day steps).
export const TRANSPORT = [
  { route: 'KLIA → Bukit Bintang', mode: 'Grab', duration: '45–60 min', price: 'RM70–110 / car' },
  { route: 'KL → Penang', mode: 'Bus (TBS)', duration: '~5h', price: 'RM45–90 pp' },
  { route: 'Penang → Langkawi', mode: 'Ferry', duration: '~2.5h', price: 'RM70–90 pp' },
  { route: 'Pantai Cenang → Kuah Jetty', mode: 'Grab', duration: '~30 min', price: 'RM25–35 / car' },
  { route: 'Langkawi → Kuala Kedah', mode: 'Ferry', duration: '~1h45m', price: 'RM35–40 pp' },
  { route: 'Kuala Kedah → Alor Setar', mode: 'Grab', duration: '~20 min', price: 'RM12–18 / car' },
  { route: 'Alor Setar → KL Sentral', mode: 'ETS Train (KTMB)', duration: '~4h30m', price: 'RM50–79 pp' },
  { route: 'KL Sentral ↔ Genting (return)', mode: 'Bus + SkyWay', duration: '~1h10m each way', price: 'RM20–40 bus + RM22 SkyWay pp' },
  { route: 'KL ↔ Broga Hill', mode: 'Grab / private driver', duration: '~40 min each way', price: 'RM60–100 / car each way' },
  { route: 'KL ↔ Zoo Negara (return)', mode: 'Grab', duration: '~25–30 min each way', price: 'RM50–70 / car return' },
];

export const CHECKLIST = [
  { id: 'mdac', text: 'Malaysia Digital Arrival Card (MDAC) — fill online 3 days before landing', url: 'https://imigresen-online.imi.gov.my' },
  { id: 'grab', text: 'Download Grab app + set up payment card or e-wallet' },
  { id: 'prayer', text: 'Download Muslim Pro (prayer times + halal map)' },
  { id: 'offline', text: 'Download offline maps for KL, Penang, Langkawi' },
  { id: 'bank', text: 'Notify your bank of travel dates; withdraw some cash on arrival for hawker stalls' },
  { id: 'ets', text: 'Book KTM ETS train Alor Setar → KL Sentral for Day 12 (release 30 days ahead)', url: 'https://online.ktmb.com.my' },
  { id: 'zoo', text: 'Buy Zoo Negara tickets online (includes Giant Panda Centre)', url: 'https://ticket.zoonegara.my' },
  { id: 'broga', text: 'Line up a Grab/private driver the night before for the 04:30 Broga Hill start' },
  { id: 'petronas', text: 'Book Petronas Towers tickets online (sells out fast)', url: 'https://eticket.petronastwintowers.com.my' },
  { id: 'insurance', text: 'Travel insurance that covers jet ski + water activities' },
  { id: 'hotels', text: 'Book all hotels at least 2–3 weeks ahead (July = peak season)' },
  { id: 'simcard', text: 'Buy local SIM at KLIA airport (Celcom or Maxis, RM30–50 for 15GB)' },
];

export const PACKING = [
  {
    category: 'Documents',
    items: [
      { id: 'pk-passport', text: 'Passport — valid for 6+ months from 4 Aug 2026' },
      { id: 'pk-insurance', text: 'Travel insurance document (printed or offline)' },
      { id: 'pk-bookings', text: 'Hotel + activity confirmations (offline screenshots)' },
      { id: 'pk-emergency', text: 'Emergency contacts + embassy number written down' },
      { id: 'pk-cash', text: 'Some MYR cash ready (exchange at airport or Wise card)' },
    ],
  },
  {
    category: 'Clothes',
    items: [
      { id: 'pk-shirts', text: 'Lightweight shirts × 5 (quick-dry)' },
      { id: 'pk-shorts', text: 'Shorts × 3' },
      { id: 'pk-pants', text: 'Long pants × 1 (required for mosque/Petronas Tower)' },
      { id: 'pk-swim', text: 'Swimwear × 2 (Langkawi beach days)' },
      { id: 'pk-shoes', text: 'Flip flops + trainers (two pairs)' },
      { id: 'pk-jacket', text: 'Light rain jacket — sudden tropical showers all trip' },
      { id: 'pk-hikeshoes', text: 'Trail shoes / trainers with grip — Broga Hill early morning' },
    ],
  },
  {
    category: 'Toiletries & Health',
    items: [
      { id: 'pk-sunscreen', text: 'Sunscreen SPF50+ — beach days are brutal' },
      { id: 'pk-repellent', text: 'Insect repellent — Kilim mangroves + Broga Hill dawn' },
      { id: 'pk-drybag', text: 'Dry bag / waterproof pouch (jet ski + kayak)' },
      { id: 'pk-firstaid', text: 'Basic first aid kit (plasters, paracetamol, antidiarrhoeals)' },
      { id: 'pk-sanitiser', text: 'Hand sanitiser' },
    ],
  },
  {
    category: 'Tech',
    items: [
      { id: 'pk-adapter', text: 'Universal travel adapter (Malaysia uses UK 3-pin)' },
      { id: 'pk-powerbank', text: 'Power bank — long day trips with no charging' },
      { id: 'pk-earphones', text: 'Earphones' },
      { id: 'pk-camera', text: 'Camera / GoPro for jet ski + SkyCab views' },
      { id: 'pk-torch', text: 'Headlamp or phone-torch grip — pre-dawn Broga Hill trail' },
    ],
  },
];

export const HALAL = [
  'Malay-run stalls, mall food courts, JAKIM halal logo = safe',
  'George Town: use Line Clear Nasi Kandar, Kapitan Keling, Chulia St halal stalls',
  'Petronas dress code: no shorts, sleeveless, or open sandals',
  'Friday prayers ~1–2:15pm — some small stalls close briefly',
];

export const WARNINGS = [
  'Petronas tickets sell out — book evening slot 3–5 days ahead',
  'ESCAPE & Kilim tours weather-dependent — do mornings',
  'Monkey Beach macaques steal bags — watch valuables',
  'Jet skis need waiver + deposit — bring passport & card',
  'Scooter: wear helmet; IDP technically required',
  'Broga Hill trail is pitch dark until ~06:30 — bring a torch',
  'Zoo Negara midday sun is brutal — go early or take the tram',
  'ETS train seats release 30 days ahead — book Day 12 as soon as possible',
];

export const DAYS = [
  {
    day: 1,
    date: 'Wed 22 Jul',
    city: 'Kuala Lumpur',
    theme: 'Arrival',
    tagline: 'Land, settle in Bukit Bintang, first taste of KL',
    cover: W.petronas,
    images: [
      { src: W.petronas, caption: 'Petronas Towers lit up — your first KL view' },
      { src: W.klSkyline, caption: 'Bukit Bintang — home base for 3 nights' },
      { src: W.jalanAlor, caption: 'Jalan Alor night food street' },
      { src: W.petronas, caption: 'KLCC Park fountain with towers behind' },
    ],
    video: { title: 'Kuala Lumpur travel guide 2024' },
    stay: 'Bukit Bintang guesthouse (twin-share)',
    steps: [
      { time: '14:15', title: 'Land at KLIA', desc: 'Immigration, baggage, scan MDAC QR.' },
      { time: '14:45', title: 'SIM/eSIM + ATM cash', desc: 'Celcom/Maxis counter in arrivals: ~RM30–50 for 15GB. Withdraw MYR at the ATM — foreign cards pay ~RM10–12 fee per withdrawal, so take out a big chunk once.', cost: 'RM40–60 pp' },
      { time: '15:15', title: 'Grab → Bukit Bintang', desc: '45–60 min. RM70–110 per car, split by 2.', cost: 'RM35–55 pp', tip: 'Request ride inside arrivals for better GPS pin' },
      { time: '16:30', title: 'Check in Bukit Bintang', desc: 'Walkable to Jalan Alor, malls, monorail. Drop bags, freshen up.', images: [W.klSkyline] },
      { time: '19:30', title: 'Dinner: Jalan Alor', desc: 'Satay, char kway teow. Most stalls Malay/halal-run — check signage.', cost: 'RM25–35 pp', halal: true, images: [W.jalanAlor], mapsUrl: 'https://maps.google.com/?q=Jalan+Alor+Kuala+Lumpur' },
      { time: '21:30', title: 'KLCC Park evening stroll', desc: 'Free warm-up view of Petronas Towers lit up. Tomorrow you go inside.', images: [W.petronas], mapsUrl: 'https://maps.google.com/?q=KLCC+Park+Kuala+Lumpur' },
    ],
  },
  {
    day: 2,
    date: 'Thu 23 Jul',
    city: 'Kuala Lumpur',
    theme: 'Icons',
    tagline: 'Batu Caves morning, Petronas Towers at sunset',
    cover: W.batuCaves,
    images: [
      { src: W.batuCaves, caption: 'Batu Caves Malaysia — 272 rainbow steps' },
      { src: W.petronas, caption: 'Petronas Twin Towers observation deck at dusk' },
      { src: W.petronas, caption: 'KLCC Park & Suria mall' },
      { src: W.jalanAlor, caption: 'Street food dinner' },
    ],
    video: { title: 'Batu Caves and Petronas Towers Kuala Lumpur Malaysia' },
    stay: 'Bukit Bintang',
    steps: [
      { time: '08:00', title: 'Roti canai breakfast', desc: 'Local kopitiam — roti canai & teh tarik.', cost: 'RM10–15 pp' },
      { time: '09:30', title: 'Batu Caves Malaysia', desc: 'Grab return ~25 min each way (RM40–60 per car return, split by 2). Free entry, 272 rainbow steps, giant golden Murugan statue. Dress modestly — sarongs free at entrance.', cost: 'RM20–30 pp Grab', images: [W.batuCaves], tip: 'Go early to beat heat & crowds', mapsUrl: 'https://maps.google.com/?q=Batu+Caves+Kuala+Lumpur+Malaysia' },
      { time: '12:30', title: 'Lunch — Suria KLCC food court', desc: '20+ halal options in AC comfort.', cost: 'RM20–25 pp', halal: true },
      { time: '14:00', title: 'Grab → Masjid Negara (National Mosque)', desc: 'Near KL Sentral / Lake Gardens, ~15–20 min. RM12–18 per car, split by 2.', cost: 'RM6–9 pp', mapsUrl: 'https://maps.google.com/?q=Masjid+Negara+Kuala+Lumpur' },
      { time: '14:30', title: 'National Mosque + Islamic Arts Museum Malaysia', desc: 'Free mosque visit, then the world\'s largest Islamic art museum right next door — calligraphy, textiles, architecture models. ~2h.', cost: 'RM14 pp museum', images: [W.klSkyline], mapsUrl: 'https://maps.google.com/?q=Islamic+Arts+Museum+Malaysia' },
      { time: '17:00', title: 'Grab → KLCC', desc: 'RM12–18 per car, split by 2.', cost: 'RM6–9 pp' },
      { time: '18:45', title: 'Petronas Twin Towers — EVENING SLOT', desc: 'Book ~7:00–7:15pm. Skybridge in daylight + Observation Deck (L86) at sunset. Smart-casual dress code enforced.', cost: 'RM150–160 pp', book: 'https://eticket.petronastwintowers.com.my', images: [W.petronas], tip: 'Book 3–5 days ahead — evening slots sell out', mapsUrl: 'https://maps.google.com/?q=Petronas+Twin+Towers+Kuala+Lumpur' },
      { time: '20:30', title: 'Dinner Bukit Bintang', desc: 'Back near hotel — Chinatown or Jalan Alor.', cost: 'RM25–35 pp' },
    ],
  },
  {
    day: 3,
    date: 'Fri 24 Jul',
    city: 'Kuala Lumpur',
    theme: 'Genting Highlands',
    tagline: 'Cable car, Chin Swee Temple, optional theme parks',
    cover: W.genting,
    images: [
      { src: W.genting, caption: 'Awana SkyWay over rainforest — Malaysia' },
      { src: W.genting, caption: 'Genting Highlands peak in the clouds' },
      { src: W.mossyForest, caption: 'Chin Swee Caves Temple stop' },
      { src: W.klSkyline, caption: 'SkyAvenue mall at the Genting peak' },
    ],
    video: { title: 'Genting Highlands Awana SkyWay Malaysia 2024' },
    stay: 'Bukit Bintang (last KL night)',
    hasOptions: ['gentingAddon'],
    steps: [
      { time: '08:00', title: 'Monorail/Grab → KL Sentral, buy Go Genting return', desc: 'Level 2 or basement bus terminal. Buy bus + cable car combo if available.', cost: 'RM4–10 pp', book: 'https://www.redbus.my', mapsUrl: 'https://maps.google.com/?q=KL+Sentral+Kuala+Lumpur' },
      { time: '09:00', title: 'Bus → Awana Station', desc: '~1 hour climb into the clouds.', cost: 'RM10–20 pp' },
      { time: '10:15', title: 'Awana SkyWay cable car', desc: '2.8 km, ~10 min. Stop at Chin Swee Station — giant Buddha & temple, 30–45 min.', cost: 'RM22 pp return', book: 'https://www.rwgenting.com', images: [W.genting], mapsUrl: 'https://maps.google.com/?q=Awana+SkyWay+Genting+Highlands+Malaysia' },
      { time: '11:00', title: 'Chin Swee Temple', desc: 'Dramatic cliffside temple with panoramic views. Worth 30–45 min.', images: [W.mossyForest], mapsUrl: 'https://maps.google.com/?q=Chin+Swee+Caves+Temple+Genting+Malaysia' },
      { time: '12:00', title: 'Lunch SkyAvenue', desc: 'Peak mall — halal food court & restaurants.', cost: 'RM20–30 pp', halal: true },
      { time: '13:30', title: 'Explore the peak', desc: 'SkyAvenue, casino atrium exterior, First World Plaza viewpoints. Free to wander.', images: [W.genting] },
      { time: '14:30', title: 'Optional theme park', desc: 'Pick in Options panel: free explore · Skytropolis indoor (RM80) · SkyWorlds outdoor (RM168).', optional: true },
      { time: '18:00', title: 'Bus back to KL Sentral', desc: '~1 hour descent. Return leg (skip this cost if you bought a return combo in the morning).', cost: 'RM10–20 pp' },
      { time: '20:00', title: 'Dinner Bukit Bintang', cost: 'RM25–35 pp' },
    ],
  },
  {
    day: 4,
    date: 'Sat 25 Jul',
    city: 'Penang',
    theme: 'KL → George Town',
    tagline: '5-hour bus south to UNESCO heritage streets',
    cover: W.georgeTown,
    images: [
      { src: W.georgeTown, caption: 'George Town heritage shophouses — Penang' },
      { src: W.penangArt, caption: 'Colourful street art alleys' },
      { src: W.georgeTown, caption: 'Chulia Street / Love Lane area' },
      { src: W.penangArt, caption: 'First Penang evening wander' },
    ],
    video: { title: 'George Town Penang Malaysia travel guide 2024' },
    stay: 'George Town — Chulia St / Love Lane',
    steps: [
      { time: '08:30', title: 'Check out & breakfast', desc: 'Roti canai + teh tarik before the bus. Pack; store bags at guesthouse if needed.', cost: 'RM10–15 pp' },
      { time: '09:30', title: 'Merdeka Square (optional)', desc: '20 min photo stop if you have time.', images: [W.klSkyline] },
      { time: '10:00', title: 'Grab → TBS Terminal', desc: 'RM15–20 per car, split by 2.', cost: 'RM8–10 pp', mapsUrl: 'https://maps.google.com/?q=Terminal+Bersepadu+Selatan+Kuala+Lumpur' },
      { time: '11:00', title: 'Bus KL → Penang', desc: 'Transnasional/Plusliner ~5h direct.', cost: 'RM45–90 pp', book: 'https://www.easybook.com', tip: 'Book seat ahead for July peak' },
      { time: '17:00', title: 'Check in George Town', desc: 'Chulia Street / Love Lane — walk everywhere.', images: [W.georgeTown], mapsUrl: 'https://maps.google.com/?q=George+Town+Penang+Malaysia' },
      { time: '19:00', title: 'Heritage walk + halal dinner', desc: 'Malay/Indian-Muslim stalls on Chulia St.', cost: 'RM20–30 pp', halal: true, images: [W.penangArt] },
    ],
  },
  {
    day: 5,
    date: 'Sun 26 Jul',
    city: 'Penang',
    theme: 'Heritage & Street Art',
    tagline: 'Relaxed murals, Penang Hill, Kek Lok Si',
    cover: W.penangArt,
    images: [
      { src: W.penangArt, caption: 'Famous George Town street murals — Penang' },
      { src: W.georgeTown, caption: 'Penang Hill funicular views' },
      { src: W.georgeTown, caption: 'Kek Lok Si Temple pagoda' },
      { src: W.georgeTown, caption: 'Line Clear Nasi Kandar' },
    ],
    video: { title: 'Penang street art walk George Town Malaysia' },
    stay: 'George Town',
    steps: [
      { time: '09:00', title: 'Street art self-guided walk', desc: 'Armenian St, Cannon St, Muntri St — hunt murals at easy pace, 2–3h.', images: [W.penangArt, W.georgeTown], mapsUrl: 'https://maps.google.com/?q=Armenian+Street+George+Town+Penang' },
      { time: '11:15', title: 'Kapitan Keling Mosque + Pinang Peranakan Mansion', desc: 'Historic Indian-Muslim mosque (free, modest dress) right by an ornate 19th-century Peranakan mansion museum — both an easy walk from the mural trail.', cost: 'RM20 pp museum', mapsUrl: 'https://maps.google.com/?q=Kapitan+Keling+Mosque+Penang' },
      { time: '12:00', title: 'Line Clear Nasi Kandar', desc: 'Halal institution, open 24/7.', cost: 'RM15–20 pp', halal: true, mapsUrl: 'https://maps.google.com/?q=Line+Clear+Nasi+Kandar+Penang' },
      { time: '13:30', title: 'Grab → Penang Hill', desc: '~25 min from George Town to the funicular base station.', cost: 'RM8–12 pp', mapsUrl: 'https://maps.google.com/?q=Penang+Hill+Funicular+Malaysia' },
      { time: '14:00', title: 'Penang Hill funicular', desc: 'Cooler air & panoramic views. Foreigner return ~RM30–35.', cost: 'RM30–35 pp', book: 'https://www.penanghill.gov.my', images: [W.georgeTown], mapsUrl: 'https://maps.google.com/?q=Penang+Hill+Funicular+Malaysia' },
      { time: '16:30', title: 'Kek Lok Si Temple', desc: 'Malaysia\'s largest Buddhist complex, 10 min from the hill. Free entry; small lift fee to pagoda.', cost: 'RM3–5 pp', images: [W.georgeTown], mapsUrl: 'https://maps.google.com/?q=Kek+Lok+Si+Temple+Penang+Malaysia' },
      { time: '18:15', title: 'Grab back to George Town', desc: '~25 min back to Chulia St.', cost: 'RM8–12 pp' },
      { time: '19:00', title: 'Dinner — Kapitan Keling / Chulia St', cost: 'RM20–30 pp', halal: true },
    ],
  },
  {
    day: 6,
    date: 'Mon 27 Jul',
    city: 'Penang',
    theme: 'Monkey Beach + ESCAPE',
    tagline: 'The big adventure day — boat, ziplines, water slides',
    cover: W.monkeyBeach,
    images: [
      { src: W.monkeyBeach, caption: 'Monkey Beach (Pantai Kerachut) — Penang Malaysia' },
      { src: W.penangArt, caption: 'ESCAPE Penang adventure park' },
      { src: W.georgeTown, caption: 'Penang National Park coastline' },
      { src: W.monkeyBeach, caption: 'Beach day before ESCAPE' },
    ],
    video: { title: 'ESCAPE Penang adventure water park Malaysia review 2024' },
    stay: 'George Town',
    steps: [
      { time: '07:30', title: 'Grab → Penang National Park HQ', desc: 'Teluk Bahang, ~45 min from George Town. RM25–40 per car, split by 2.', cost: 'RM13–20 pp', mapsUrl: 'https://maps.google.com/?q=Penang+National+Park+Teluk+Bahang+Malaysia' },
      { time: '08:30', title: 'Boat to Monkey Beach', desc: 'RM100 return per boat (8–10 pax). Macaques, swim, optional lighthouse hike. 2.5–3h total.', cost: 'RM12–25 pp', images: [W.monkeyBeach], tip: 'Don\'t leave bags unattended — monkeys steal phones', mapsUrl: 'https://maps.google.com/?q=Monkey+Beach+Penang+Malaysia' },
      { time: '11:30', title: 'Grab → ESCAPE Penang', desc: 'Same Teluk Bahang area, 5–10 min. RM8–12 per car, split by 2.', cost: 'RM4–6 pp' },
      { time: '12:00', title: 'Lunch at ESCAPE café', cost: 'RM20–25 pp', halal: true },
      { time: '13:00', title: 'ESCAPE Penang — full day pass', desc: 'Ziplines, rope courses, world-record tube slide, Dead Sea pool. Bring swimwear. 4–5h.', cost: 'RM182–190 pp', book: 'https://escape.my/pg/buy-tickets', mapsUrl: 'https://maps.google.com/?q=ESCAPE+Penang+Teluk+Bahang+Malaysia' },
      { time: '18:30', title: 'Grab back to George Town', desc: 'RM25–40 per car, split by 2.', cost: 'RM13–20 pp' },
      { time: '20:00', title: 'Dinner', cost: 'RM25–30 pp' },
    ],
  },
  {
    day: 7,
    date: 'Tue 28 Jul',
    city: 'Langkawi',
    theme: 'Penang → Langkawi',
    tagline: 'Ferry crossing, scooters, first beach swim',
    cover: W.pantaiCenang,
    images: [
      { src: W.pantaiCenang, caption: 'Pantai Cenang beach — Langkawi Malaysia' },
      { src: W.pantaiCenang, caption: 'Langkawi turquoise waters' },
      { src: W.kilim, caption: 'Langkawi island from the sea' },
      { src: W.pantaiCenang, caption: 'Scooter rental — explore the island' },
    ],
    video: { title: 'Langkawi Malaysia island guide 2024' },
    stay: 'Pantai Cenang guesthouse',
    steps: [
      { time: '06:30', title: 'Grab → Swettenham Pier', desc: 'RM10–15 per car, split by 2.', cost: 'RM5–8 pp', mapsUrl: 'https://maps.google.com/?q=Swettenham+Pier+Penang+Malaysia' },
      { time: '07:30', title: 'Ferry to Langkawi', desc: 'Scenic ~2.5h crossing. Peak season — book 1–2 days ahead.', cost: 'RM70–90 pp', book: 'https://www.traveloka.com', images: [W.pantaiCenang] },
      { time: '10:30', title: 'Kuah → Pantai Cenang', desc: 'Grab or taxi ~40 min, check in. RM30–45 per car, split by 2.', cost: 'RM15–25 pp', mapsUrl: 'https://maps.google.com/?q=Pantai+Cenang+Langkawi+Malaysia' },
      { time: '12:30', title: 'Rent a scooter (2-up) or small car', desc: 'Left-hand drive, easy roads. One scooter RM40–60/day + petrol, split by 2.', cost: 'RM25–40 pp/day', tip: 'Wear helmet; IDP technically required' },
      { time: '13:30', title: 'Lunch + Pantai Cenang swim', cost: 'RM20–25 pp', images: [W.pantaiCenang] },
      { time: '19:00', title: 'Beachfront halal seafood', cost: 'RM25–35 pp', halal: true },
    ],
  },
  {
    day: 8,
    date: 'Wed 29 Jul',
    city: 'Langkawi',
    theme: 'SkyCab & Sky Bridge',
    tagline: 'World\'s steepest cable car + curved sky bridge',
    cover: W.skyCab,
    images: [
      { src: W.skyCab, caption: 'Langkawi Sky Bridge — Malaysia' },
      { src: W.orientalVillage, caption: 'Oriental Village base station — Langkawi' },
      { src: W.skyCab, caption: 'Cable car over Machinchang mountain' },
      { src: W.pantaiCenang, caption: 'Pool afternoon at Pantai Cenang' },
    ],
    video: { title: 'Langkawi SkyCab Sky Bridge Malaysia experience 2024' },
    stay: 'Pantai Cenang',
    steps: [
      { time: '08:30', title: 'Drive to Oriental Village', desc: 'Burau Bay, ~20 min. Go early — beat tour buses. Cost is the day\'s scooter/car share + petrol.', cost: 'RM25–40 pp', images: [W.orientalVillage], mapsUrl: 'https://maps.google.com/?q=Oriental+Village+Langkawi+Malaysia' },
      { time: '09:30', title: 'SkyCab + SkyGlide + SkyBridge', desc: 'RM97 adult foreigner — all three included. Open 9:30am–6pm.', cost: 'RM97 pp', book: 'https://www.panoramalangkawi.com', images: [W.skyCab, W.orientalVillage] },
      { time: '12:30', title: 'Lunch near base station', cost: 'RM20–25 pp' },
      { time: '14:00', title: 'Relax / pool afternoon', desc: 'Back at Pantai Cenang — chill day by design.', images: [W.pantaiCenang] },
    ],
  },
  {
    day: 9,
    date: 'Thu 30 Jul',
    city: 'Langkawi',
    theme: 'Kilim Mangrove Kayak',
    tagline: 'Paddle channels, eagle feeding, bat cave boat tour',
    cover: W.kilim,
    images: [
      { src: W.kilim, caption: 'Kilim Geoforest Park mangroves — Langkawi Malaysia' },
      { src: W.kilim, caption: 'Kayak through the mangrove channels' },
      { src: W.pantaiCenang, caption: 'Limestone cliffs & eagle feeding' },
      { src: W.pantaiCenang, caption: 'Floating fish farm lunch' },
    ],
    video: { title: 'Kilim Geoforest Park mangrove kayak Langkawi Malaysia' },
    stay: 'Pantai Cenang',
    steps: [
      { time: '08:00', title: 'Drive to Kilim Jetty', desc: '~30 min from Pantai Cenang. Cost is the day\'s scooter/car share + petrol.', cost: 'RM25–40 pp', mapsUrl: 'https://maps.google.com/?q=Kilim+Jetty+Langkawi+Malaysia' },
      { time: '08:30', title: 'Mangrove kayak', desc: 'RM160–250 per kayak (1–2 pax). Paddle calm channels at your pace.', cost: 'RM80–125 pp', book: 'https://langkawigotours.com/mangrove-kayaking-tour-langkawi', images: [W.kilim] },
      { time: '10:30', title: 'Kilim boat tour', desc: 'Eagles, limestone cliffs, bat cave, floating fish farm.', cost: 'RM80 pp', book: 'https://langkawigotours.com/mangrove-kayaking-tour-langkawi', images: [W.kilim] },
      { time: '13:00', title: 'Lunch — floating restaurant', cost: 'RM20–25 pp' },
      { time: 'Afternoon', title: 'Back to Pantai Cenang', desc: 'Rest — you earned it.' },
      { time: '19:30', title: 'Beach bar dinner', desc: 'Duty-free drinks — no service tax in Langkawi.', cost: 'RM25–35 pp' },
    ],
  },
  {
    day: 10,
    date: 'Fri 31 Jul',
    city: 'Langkawi',
    theme: 'Water Day + Splurge Night',
    tagline: 'Jet ski or island hop, duty-free, farewell beach dinner',
    cover: W.pantaiCenang,
    images: [
      { src: W.pantaiCenang, caption: 'Jet ski on the Langkawi waters' },
      { src: W.pantaiCenang, caption: 'Island hopping — Pregnant Maiden Lake' },
      { src: W.pantaiCenang, caption: 'Sea-view infinity pool' },
      { src: W.kilim, caption: 'Last sunset in Langkawi' },
    ],
    video: { title: 'Langkawi water activities jet ski island hopping Malaysia 2024' },
    stay: 'Splurge night OR guesthouse + pool pass',
    hasOptions: ['langkawiActivity', 'langkawiStay'],
    steps: [
      { time: '08:30', title: 'Scooter day rate + petrol', desc: 'You still have the scooters/car today — daily rate shared 2-up.', cost: 'RM25–40 pp' },
      { time: '09:00', title: 'Morning water activity', desc: 'Choose in Options: island hopping OR jet ski OR both.', optional: true, images: [W.pantaiCenang] },
      { time: 'Afternoon', title: 'Sea-view pool / resort', desc: 'Splurge hotel night or day-pass — see Options.', optional: true, images: [W.pantaiCenang] },
      { time: '18:00', title: 'Duty-free run', desc: 'Kedai Khas — chocolate, cosmetics.', cost: 'RM50–100 pp' },
      { time: '19:30', title: 'Farewell beach dinner', desc: 'Grilled fish, fresh juice.', cost: 'RM30–35 pp', halal: true },
    ],
  },
  {
    day: 11,
    date: 'Sat 1 Aug',
    city: 'Langkawi',
    theme: 'Langkawi Extra Day',
    tagline: 'The bonus night — rest, or add an adventure',
    cover: W.pantaiCenang,
    images: [
      { src: W.pantaiCenang, caption: 'One more full day on Pantai Cenang' },
      { src: W.kilim, caption: 'Optional: Skytrex treetop adventure or an ATV jungle tour' },
      { src: W.pantaiCenang, caption: 'Sunset from the beach strip' },
    ],
    video: { title: 'Langkawi Pantai Cenang relaxed beach day Malaysia' },
    stay: 'Pantai Cenang',
    hasOptions: ['langkawiExtraDay'],
    steps: [
      { time: 'Morning', title: 'Scooter day rate + petrol', desc: 'Last full scooter day — return them tomorrow at checkout.', cost: 'RM25–40 pp' },
      { time: 'All day', title: 'Rest day or add-on adventure', desc: 'Pick in Options: full rest day (beach/pool, no plan) · Skytrex Adventure treetop course · ATV jungle tour.', optional: true, images: [W.pantaiCenang] },
      { time: '19:30', title: 'Beachfront dinner', cost: 'RM25–35 pp', halal: true },
    ],
  },
  {
    day: 12,
    date: 'Sun 2 Aug',
    city: 'Kuala Lumpur',
    theme: 'Langkawi → Kuala Lumpur',
    tagline: 'Slow beach morning, ferry + ETS train back to the city, Chinatown night market',
    cover: W.klSkyline,
    images: [
      { src: W.pantaiCenang, caption: 'Last Langkawi morning — final swim before travel' },
      { src: W.klSkyline, caption: 'ETS train — sleeper-lounge comfort down to KL Sentral' },
      { src: W.jalanAlor, caption: 'Petaling Street lanterns — Chinatown Kuala Lumpur' },
      { src: W.klSkyline, caption: 'Back in Bukit Bintang for the final stretch' },
    ],
    video: { title: 'KTM ETS train Alor Setar to Kuala Lumpur travel guide' },
    stay: 'Bukit Bintang guesthouse',
    steps: [
      { time: '06:45', title: 'Return scooter, checkout', desc: 'Early start — grab a takeaway coffee, the ferry won\'t wait.', cost: 'RM5–10 pp', images: [W.pantaiCenang] },
      { time: '07:15', title: 'Grab → Kuah Jetty', desc: '~30 min across the island from Pantai Cenang. RM25–35 per car, split by 2. Leave buffer.', cost: 'RM13–18 pp', mapsUrl: 'https://maps.google.com/?q=Kuah+Jetty+Langkawi+Malaysia' },
      { time: '08:30', title: 'Ferry Langkawi → Kuala Kedah', desc: 'Scenic ~1h45m crossing back to the mainland — arrives ~10:15.', cost: 'RM35–40 pp', book: 'https://www.traveloka.com' },
      { time: '10:30', title: 'Grab → Alor Setar station', desc: '~20 min through Kedah paddy fields. RM12–18 per car, split by 2.', cost: 'RM6–9 pp', mapsUrl: 'https://maps.google.com/?q=Alor+Setar+ETS+Station+Malaysia' },
      { time: '12:00', title: 'ETS train Alor Setar → KL Sentral', desc: 'Modern AC electric train, ~4h30m. Way more comfortable than a bus — reserved seats, food car, chill window seat.', cost: 'RM50–79 pp', book: 'https://online.ktmb.com.my', tip: 'Book 30 days ahead — sells out in July; pick a departure ~1.5h after ferry arrival' },
      { time: '17:00', title: 'Grab → Bukit Bintang', desc: 'Drop bags, freshen up. RM12–18 per car, split by 2.', cost: 'RM6–9 pp' },
      { time: '19:00', title: 'Petaling Street / Chinatown wander', desc: 'Red lanterns, night stalls, easy pace — no plan needed.', images: [W.jalanAlor], mapsUrl: 'https://maps.google.com/?q=Petaling+Street+Kuala+Lumpur' },
      { time: '20:30', title: 'Dinner — Chinatown or Jalan Alor', cost: 'RM25–35 pp', halal: true },
    ],
  },
  {
    day: 13,
    date: 'Mon 3 Aug',
    city: 'Kuala Lumpur',
    theme: 'Broga Hill Sunrise',
    tagline: 'Easy sunrise hike, then pandas, Sunway Lagoon, or just rest — your call',
    cover: W.mossyForest,
    images: [
      { src: W.mossyForest, caption: 'Broga Hill — rolling Selangor sunrise views' },
      { src: W.klSkyline, caption: 'Zoo Negara — Malaysia\'s only giant pandas' },
      { src: W.mossyForest, caption: 'Trail is short: ~30–45 min to the top' },
      { src: W.jalanAlor, caption: 'Final squad dinner near Bukit Bintang' },
    ],
    video: { title: 'Broga Hill Bukit Broga sunrise hike Malaysia guide' },
    stay: 'Bukit Bintang — last night',
    hasOptions: ['finalDayActivity'],
    steps: [
      { time: '04:30', title: 'Grab / private driver → Broga Hill', desc: '~40 min from KL. RM60–100 per car each way, split by 2. Book a driver the night before — no public transport at 4:30am.', cost: 'RM30–50 pp', tip: 'Line up the driver via WhatsApp the evening before' },
      { time: '05:30', title: 'Hike to summit', desc: '1.7 km, easy-moderate, ropes on the steep sections, ~30–45 min. No hiking experience needed.', images: [W.mossyForest] },
      { time: '07:00', title: 'Sunrise at the peak', desc: 'Rolling green hills over Selangor & Negeri Sembilan — one of the most photographed sunrise spots near KL.' },
      { time: '08:30', title: 'Grab back to Bukit Bintang', desc: 'RM60–100 per car, split by 2.', cost: 'RM30–50 pp' },
      { time: '11:00', title: 'Late brunch', desc: 'Shower off, refuel before the afternoon pick.', cost: 'RM15–25 pp' },
      { time: '13:00', title: 'Afternoon pick', desc: 'Choose in Options: free time/rest · Zoo Negara + Giant Panda Centre (RM88, Xing Xing & Liang Liang) · Sunway Lagoon full day (RM263–268, 6 zones — heavier after a 4:30am start, budget-dependent).', optional: true, images: [W.klSkyline] },
      { time: '19:00', title: 'Final squad dinner — Jalan Alor', cost: 'RM30–35 pp', halal: true, images: [W.jalanAlor], mapsUrl: 'https://maps.google.com/?q=Jalan+Alor+Kuala+Lumpur+Malaysia' },
      { time: '21:00', title: 'Pack properly', desc: 'Fit duty-free carefully. Check flight times.' },
    ],
  },
  {
    day: 14,
    date: 'Tue 4 Aug',
    city: 'Kuala Lumpur',
    theme: 'Departure',
    tagline: 'Early transfer to KLIA — selamat jalan',
    cover: W.petronas,
    images: [
      { src: W.petronas, caption: 'One last look at the Petronas Towers' },
      { src: W.klSkyline, caption: 'KL skyline farewell' },
      { src: W.pantaiCenang, caption: 'Memories from Langkawi' },
    ],
    video: null,
    stay: '—',
    steps: [
      { time: 'Early', title: 'Breakfast & document check', desc: 'Passport, boarding passes, MDAC copy.' },
      { time: '06:00', title: 'Transfer to KLIA', desc: 'Grab RM70–110 per car split by 2, or KLIA Ekspres from KL Sentral RM55 pp.', cost: 'RM35–55 pp' },
      { time: 'Before flight', title: 'KLIA duty-free', desc: 'Last-minute prices if time allows.' },
    ],
  },
];

export const BOOKING_PRESETS = [
  { id: 'b1', day: 2, label: 'Petronas Twin Towers', estMin: 150, estMax: 160, url: 'https://eticket.petronastwintowers.com.my' },
  { id: 'b2', day: 3, label: 'Awana SkyWay cable car', estMin: 22, estMax: 22, url: 'https://www.rwgenting.com' },
  { id: 'b3', day: 3, label: 'Genting SkyWorlds', estMin: 168, estMax: 198, url: 'https://www.gentingskyworlds.com' },
  { id: 'b4', day: 4, label: 'Bus KL → Penang', estMin: 45, estMax: 90, url: 'https://www.easybook.com' },
  { id: 'b5', day: 5, label: 'Penang Hill funicular', estMin: 30, estMax: 35, url: 'https://www.penanghill.gov.my' },
  { id: 'b6', day: 6, label: 'ESCAPE Penang', estMin: 182, estMax: 190, url: 'https://escape.my/pg/buy-tickets' },
  { id: 'b7', day: 7, label: 'Ferry Penang → Langkawi', estMin: 70, estMax: 90, url: 'https://www.traveloka.com' },
  { id: 'b8', day: 8, label: 'Langkawi SkyCab + SkyBridge', estMin: 97, estMax: 97, url: 'https://www.panoramalangkawi.com' },
  { id: 'b9', day: 9, label: 'Kilim kayak + boat tour', estMin: 160, estMax: 205, url: 'https://langkawigotours.com/mangrove-kayaking-tour-langkawi' },
  { id: 'b10', day: 10, label: 'Jet ski tour', estMin: 225, estMax: 300, url: 'https://langkawigotours.com/jet-ski-tour-langkawi' },
  { id: 'b11', day: 12, label: 'Ferry Langkawi → Kuala Kedah', estMin: 35, estMax: 40, url: 'https://www.traveloka.com' },
  { id: 'b12', day: 12, label: 'ETS Train Alor Setar → KL Sentral', estMin: 50, estMax: 79, url: 'https://online.ktmb.com.my' },
  { id: 'b13', day: 13, label: 'Zoo Negara (Giant Pandas)', estMin: 88, estMax: 88, url: 'https://ticket.zoonegara.my' },
  { id: 'b14', day: 13, label: 'Sunway Lagoon (Day 13 option)', estMin: 263, estMax: 268, url: 'https://sunwaylagoon.com/etickets/' },
];

export function getDayByNumber(n) {
  return DAYS.find((d) => d.day === n);
}

// Parses a step's free-text `cost` field (e.g. "RM70–110 total", "RM25–35 pp")
// into a numeric range. This is the single source of truth for day costs so
// the displayed budget can never drift from the per-step costs shown to the user.
function parseCostRange(str) {
  if (!str) return { min: 0, max: 0 };
  const m = str.match(/(\d+(?:\.\d+)?)\s*(?:[–-]\s*(\d+(?:\.\d+)?))?/);
  if (!m) return { min: 0, max: 0 };
  const min = parseFloat(m[1]);
  const max = m[2] !== undefined ? parseFloat(m[2]) : min;
  return { min, max };
}

export function calcDayStepsCost(day) {
  return day.steps.reduce((acc, step) => {
    const { min, max } = parseCostRange(step.cost);
    return { min: acc.min + min, max: acc.max + max };
  }, { min: 0, max: 0 });
}

export function calcDayCost(day, optionValues) {
  const stepsCost = calcDayStepsCost(day);
  let min = stepsCost.min;
  let max = stepsCost.max;
  // Option costs are flat point estimates — added as-is so the day card,
  // the Options panel (+RM label) and BudgetSection extraCost all agree.
  if (day.hasOptions) {
    day.hasOptions.forEach((optKey) => {
      const opt = OPTIONS[optKey];
      const choice = opt.choices.find((c) => c.id === optionValues[optKey]);
      if (choice?.cost) {
        min += choice.cost;
        max += choice.cost;
      }
    });
  }
  return { min: Math.round(min), max: Math.round(max) };
}

// Trip starts 22 Jul 2026 — the single source of truth for "which day is today"
// used to know which days have passed and warn on overspending pace.
const TRIP_START = new Date('2026-07-22T00:00:00');

export function getTripDay() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.floor((today - TRIP_START) / 86_400_000);
  return diff >= 0 && diff < DAYS.length ? diff + 1 : null;
}

// Days remaining before departure — positive before the trip, 0 on day 1,
// null once the trip has started (the hero countdown hides itself).
export function daysUntilTrip() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((TRIP_START - today) / 86_400_000);
  return diff > 0 ? diff : null;
}

export function calcTripCostRange(optionValues) {
  return DAYS.reduce((acc, day) => {
    const { min, max } = calcDayCost(day, optionValues);
    return { min: acc.min + min, max: acc.max + max };
  }, { min: 0, max: 0 });
}
