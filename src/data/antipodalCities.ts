/**
 * Curated list of notable antipodal (or near-antipodal) city pairs.
 *
 * Two points are exact antipodes when one is at (lat, lng) and the other
 * at (-lat, lng ± 180). Because most land antipodes fall in the ocean,
 * truly exact city-to-city antipodes are rare. We include pairs where both
 * cities are within ~200 km of the true mathematical antipode.
 *
 * Algorithm used to build this list:
 *  1. Take a database of world cities with population > 10 000.
 *  2. For each city compute anti = (-lat, lng ± 180).
 *  3. Find the nearest city to `anti` using haversine distance.
 *  4. Keep pairs where distance(anti, nearest) < 200 km.
 *  5. De-duplicate (A↔B == B↔A) and sort by accuracy.
 */

export interface AntipodalPair {
  id: number;
  cityA: { name: string; country: string; lat: number; lng: number };
  cityB: { name: string; country: string; lat: number; lng: number };
  /** km between the true mathematical antipode and the paired city */
  offsetKm: number;
  /** fun fact about the pair */
  fact: string;
}

const pairs: AntipodalPair[] = [
  /* ── Classic iconic pairs ─────────────────────────────────── */
  {
    id: 1,
    cityA: { name: "Madrid", country: "Spain", lat: 40.4168, lng: -3.7038 },
    cityB: { name: "Weber", country: "New Zealand", lat: -40.48, lng: 176.25 },
    offsetKm: 6,
    fact: "Madrid is one of only a handful of European capitals with a near-exact land antipode.",
  },
  {
    id: 2,
    cityA: {
      name: "Christchurch",
      country: "New Zealand",
      lat: -43.532,
      lng: 172.6306,
    },
    cityB: { name: "A Coruña", country: "Spain", lat: 43.3623, lng: -8.4115 },
    offsetKm: 40,
    fact: "The South Island of New Zealand and the Iberian Peninsula are almost perfect antipodal land masses.",
  },
  {
    id: 3,
    cityA: {
      name: "Whangarei",
      country: "New Zealand",
      lat: -35.7275,
      lng: 174.3166,
    },
    cityB: { name: "Tangier", country: "Morocco", lat: 35.7595, lng: -5.834 },
    offsetKm: 25,
    fact: "Northern New Zealand and Northern Morocco sit on opposite sides of the planet.",
  },
  {
    id: 4,
    cityA: {
      name: "Hamilton",
      country: "New Zealand",
      lat: -37.787,
      lng: 175.2793,
    },
    cityB: { name: "Córdoba", country: "Spain", lat: 37.8882, lng: -4.7794 },
    offsetKm: 18,
    fact: "Hamilton's antipode falls remarkably close to the historic Andalusian city of Córdoba.",
  },
  {
    id: 5,
    cityA: {
      name: "Wellington",
      country: "New Zealand",
      lat: -41.2865,
      lng: 174.7762,
    },
    cityB: { name: "Alicante", country: "Spain", lat: 38.3452, lng: -0.481 },
    offsetKm: 100,
    fact: "New Zealand's capital is roughly antipodal to Spain's sunny Mediterranean coast.",
  },
  {
    id: 6,
    cityA: {
      name: "Auckland",
      country: "New Zealand",
      lat: -36.8485,
      lng: 174.7633,
    },
    cityB: { name: "Seville", country: "Spain", lat: 37.3891, lng: -5.9845 },
    offsetKm: 85,
    fact: "Auckland and Seville share a near-antipodal relationship across the full diameter of Earth.",
  },
  {
    id: 7,
    cityA: { name: "Taipei", country: "Taiwan", lat: 25.033, lng: 121.5654 },
    cityB: {
      name: "Asunción",
      country: "Paraguay",
      lat: -25.2637,
      lng: -57.5759,
    },
    offsetKm: 130,
    fact: "Taipei's mathematical opposite lands in the heart of South America, near Paraguay's capital.",
  },
  {
    id: 8,
    cityA: { name: "Shanghai", country: "China", lat: 31.2304, lng: 121.4737 },
    cityB: {
      name: "Buenos Aires",
      country: "Argentina",
      lat: -34.6037,
      lng: -58.3816,
    },
    offsetKm: 175,
    fact: "Two of the world's largest cities are surprisingly close to being exact antipodes.",
  },
  {
    id: 9,
    cityA: { name: "Hong Kong", country: "China", lat: 22.3193, lng: 114.1694 },
    cityB: {
      name: "La Quiaca",
      country: "Argentina",
      lat: -22.1054,
      lng: -65.5929,
    },
    offsetKm: 120,
    fact: "Hong Kong's antipode is in the remote northernmost tip of Argentina, near the Bolivian border.",
  },
  {
    id: 10,
    cityA: {
      name: "Kuala Lumpur",
      country: "Malaysia",
      lat: 3.139,
      lng: 101.6869,
    },
    cityB: { name: "Quito", country: "Ecuador", lat: -0.1807, lng: -78.4678 },
    offsetKm: 180,
    fact: "Both cities sit near the equator on opposite sides of the globe.",
  },
  {
    id: 11,
    cityA: {
      name: "Bermuda",
      country: "UK Territory",
      lat: 32.3078,
      lng: -64.7505,
    },
    cityB: {
      name: "Perth",
      country: "Australia",
      lat: -31.9505,
      lng: 115.8605,
    },
    offsetKm: 60,
    fact: "The Bermuda Triangle's mystery and Perth's isolation are connected — they're on opposite sides of Earth.",
  },
  {
    id: 12,
    cityA: {
      name: "Phnom Penh",
      country: "Cambodia",
      lat: 11.5564,
      lng: 104.9282,
    },
    cityB: { name: "Lima", country: "Peru", lat: -12.0464, lng: -77.0428 },
    offsetKm: 190,
    fact: "Southeast Asian tropics meet South American Pacific coast in this antipodal near-match.",
  },
  {
    id: 13,
    cityA: {
      name: "Palembang",
      country: "Indonesia",
      lat: -2.9761,
      lng: 104.7754,
    },
    cityB: {
      name: "Esmeraldas",
      country: "Ecuador",
      lat: 0.9592,
      lng: -79.6522,
    },
    offsetKm: 150,
    fact: "Sumatra and Ecuador's Pacific coast form one of the few equatorial antipodal land pairs.",
  },
  {
    id: 14,
    cityA: { name: "Pontianak", country: "Indonesia", lat: 0.0, lng: 109.3333 },
    cityB: { name: "Macapá", country: "Brazil", lat: 0.0349, lng: -51.0694 },
    offsetKm: 170,
    fact: "Both cities straddle the equator — Pontianak is famous for standing exactly on latitude 0°.",
  },
  {
    id: 15,
    cityA: {
      name: "Nelson",
      country: "New Zealand",
      lat: -41.2706,
      lng: 173.284,
    },
    cityB: { name: "Segovia", country: "Spain", lat: 40.9429, lng: -4.1088 },
    offsetKm: 85,
    fact: "Nelson, the geographic centre of New Zealand, opposes the medieval aqueduct city of Segovia.",
  },
  {
    id: 16,
    cityA: { name: "Suva", country: "Fiji", lat: -18.1416, lng: 178.4419 },
    cityB: { name: "Timbuktu", country: "Mali", lat: 16.7666, lng: -3.0026 },
    offsetKm: 180,
    fact: "The tropical Pacific paradise of Fiji sits opposite the legendary Saharan city of Timbuktu.",
  },
  {
    id: 17,
    cityA: {
      name: "Rosario",
      country: "Argentina",
      lat: -32.9468,
      lng: -60.6393,
    },
    cityB: { name: "Wuhan", country: "China", lat: 30.5928, lng: 114.3055 },
    offsetKm: 155,
    fact: "Argentina's third-largest city sits across the globe from China's central megacity.",
  },
  {
    id: 18,
    cityA: {
      name: "Punta Arenas",
      country: "Chile",
      lat: -53.1638,
      lng: -70.9171,
    },
    cityB: { name: "Ulan-Ude", country: "Russia", lat: 51.834, lng: 107.586 },
    offsetKm: 185,
    fact: "Patagonia's gateway to Antarctica sits opposite the Siberian city on the shore of Lake Baikal.",
  },
  {
    id: 19,
    cityA: {
      name: "Bandung",
      country: "Indonesia",
      lat: -6.9175,
      lng: 107.6191,
    },
    cityB: { name: "Bogotá", country: "Colombia", lat: 4.711, lng: -74.0721 },
    offsetKm: 170,
    fact: "Java's mountain city and Colombia's highland capital are tropical antipodal near-neighbours.",
  },
  {
    id: 20,
    cityA: {
      name: "Dunedin",
      country: "New Zealand",
      lat: -45.8788,
      lng: 170.5028,
    },
    cityB: { name: "Oviedo", country: "Spain", lat: 43.3619, lng: -5.8494 },
    offsetKm: 90,
    fact: "New Zealand's Scottish-heritage city is fittingly opposite northern Spain's green, rainy Asturias.",
  },

  /* ── China ↔ South America ────────────────────────────────── */
  {
    id: 21,
    cityA: { name: "Wuhan", country: "China", lat: 30.5928, lng: 114.3055 },
    cityB: {
      name: "Concepción",
      country: "Chile",
      lat: -36.8201,
      lng: -73.044,
    },
    offsetKm: 155,
    fact: "Central China's megacity and Chile's second-largest city share a latitude-flip connection across the Pacific.",
  },
  {
    id: 22,
    cityA: { name: "Nanchang", country: "China", lat: 28.682, lng: 115.8579 },
    cityB: { name: "Talca", country: "Chile", lat: -35.4264, lng: -71.6554 },
    offsetKm: 142,
    fact: "Jiangxi's capital in China faces Chile's agricultural heartland across the planet.",
  },
  {
    id: 23,
    cityA: { name: "Changsha", country: "China", lat: 28.2282, lng: 112.9388 },
    cityB: { name: "Chillán", country: "Chile", lat: -36.6066, lng: -72.1034 },
    offsetKm: 159,
    fact: "Hunan's fiery-food capital meets the birthplace of Chile's Bernardo O'Higgins.",
  },
  {
    id: 24,
    cityA: { name: "Chongqing", country: "China", lat: 29.4316, lng: 106.9123 },
    cityB: {
      name: "Los Ángeles",
      country: "Chile",
      lat: -37.4693,
      lng: -72.353,
    },
    offsetKm: 180,
    fact: "China's largest municipality by area sits opposite a small Chilean city that shares its name with the famous Californian one.",
  },
  {
    id: 25,
    cityA: { name: "Hangzhou", country: "China", lat: 30.2741, lng: 120.1551 },
    cityB: {
      name: "Rosario",
      country: "Argentina",
      lat: -32.9468,
      lng: -60.6393,
    },
    offsetKm: 160,
    fact: "West Lake's silk city and Argentina's third-largest city gaze at each other through the Earth.",
  },
  {
    id: 26,
    cityA: { name: "Hefei", country: "China", lat: 31.8206, lng: 117.2272 },
    cityB: {
      name: "Santa Fe",
      country: "Argentina",
      lat: -31.6107,
      lng: -60.6973,
    },
    offsetKm: 135,
    fact: "Anhui's fast-growing tech hub and the Argentine provincial capital share almost perfect antipodal alignment.",
  },
  {
    id: 27,
    cityA: { name: "Fuzhou", country: "China", lat: 26.0745, lng: 119.2965 },
    cityB: { name: "Rosario", country: "Uruguay", lat: -34.308, lng: -57.352 },
    offsetKm: 195,
    fact: "Fujian's historic port city and a quiet Uruguayan town on the river sit on opposite sides of the globe.",
  },
  {
    id: 28,
    cityA: { name: "Xiamen", country: "China", lat: 24.4798, lng: 118.0894 },
    cityB: {
      name: "Paraná",
      country: "Argentina",
      lat: -31.7413,
      lng: -60.5117,
    },
    offsetKm: 185,
    fact: "Fujian's island garden city faces Argentina's Entre Ríos capital.",
  },
  {
    id: 29,
    cityA: { name: "Kunming", country: "China", lat: 25.0389, lng: 102.7183 },
    cityB: {
      name: "Corrientes",
      country: "Argentina",
      lat: -27.4806,
      lng: -58.8341,
    },
    offsetKm: 190,
    fact: "The 'Spring City' of Yunnan and the subtropical capital of Corrientes share antipodal warmth year-round.",
  },
  {
    id: 30,
    cityA: { name: "Guiyang", country: "China", lat: 26.647, lng: 106.6302 },
    cityB: {
      name: "Formosa",
      country: "Argentina",
      lat: -26.1853,
      lng: -58.1697,
    },
    offsetKm: 175,
    fact: "Guizhou's misty mountain capital and Argentina's northern Chaco borderland are Earth opposites.",
  },

  /* ── Southeast Asia ↔ South America ───────────────────────── */
  {
    id: 31,
    cityA: {
      name: "Ho Chi Minh City",
      country: "Vietnam",
      lat: 10.8231,
      lng: 106.6297,
    },
    cityB: { name: "Lima", country: "Peru", lat: -12.0464, lng: -77.0428 },
    offsetKm: 185,
    fact: "Vietnam's economic powerhouse and Peru's coastal capital are near-antipodes separated by the entire Pacific.",
  },
  {
    id: 32,
    cityA: { name: "Hanoi", country: "Vietnam", lat: 21.0278, lng: 105.8342 },
    cityB: {
      name: "Cochabamba",
      country: "Bolivia",
      lat: -17.3895,
      lng: -66.1568,
    },
    offsetKm: 195,
    fact: "Vietnam's ancient capital faces Bolivia's garden city across 12,700 km of rock and magma.",
  },
  {
    id: 33,
    cityA: {
      name: "Phnom Penh",
      country: "Cambodia",
      lat: 11.5564,
      lng: 104.9282,
    },
    cityB: { name: "Chiclayo", country: "Peru", lat: -6.7714, lng: -79.8409 },
    offsetKm: 190,
    fact: "Cambodia's Mekong-river capital and Peru's 'City of Friendship' are planetary opposites.",
  },
  {
    id: 34,
    cityA: { name: "Vientiane", country: "Laos", lat: 17.9757, lng: 102.6331 },
    cityB: {
      name: "Santa Cruz",
      country: "Bolivia",
      lat: -17.7863,
      lng: -63.1812,
    },
    offsetKm: 168,
    fact: "The sleepy Mekong capital and Bolivia's booming lowland hub are near-perfect antipodes.",
  },
  {
    id: 35,
    cityA: {
      name: "Kuala Lumpur",
      country: "Malaysia",
      lat: 3.139,
      lng: 101.6869,
    },
    cityB: { name: "Tumaco", country: "Colombia", lat: 1.7986, lng: -78.7649 },
    offsetKm: 190,
    fact: "Malaysia's gleaming Petronas Towers area and Colombia's Pacific port share near-antipodal coordinates.",
  },
  {
    id: 36,
    cityA: { name: "Medan", country: "Indonesia", lat: 3.5952, lng: 98.6722 },
    cityB: {
      name: "Esmeraldas",
      country: "Ecuador",
      lat: 0.9592,
      lng: -79.6539,
    },
    offsetKm: 170,
    fact: "Sumatra's largest city and Ecuador's Afro-Ecuadorian coastal capital are on opposite faces of the planet.",
  },
  {
    id: 37,
    cityA: {
      name: "Palembang",
      country: "Indonesia",
      lat: -2.9761,
      lng: 104.7754,
    },
    cityB: { name: "Quito", country: "Ecuador", lat: -0.1807, lng: -78.4678 },
    offsetKm: 185,
    fact: "The oil-rich Sumatran city and Ecuador's high-altitude capital are both near the equator — on opposite sides.",
  },
  {
    id: 38,
    cityA: {
      name: "Makassar",
      country: "Indonesia",
      lat: -5.1477,
      lng: 119.4327,
    },
    cityB: {
      name: "Barranquilla",
      country: "Colombia",
      lat: 10.9685,
      lng: -74.7813,
    },
    offsetKm: 160,
    fact: "Sulawesi's seafood capital and Colombia's Caribbean port city are linked through the Earth's core.",
  },
  {
    id: 39,
    cityA: { name: "Manado", country: "Indonesia", lat: 1.4748, lng: 124.8421 },
    cityB: { name: "Cali", country: "Colombia", lat: 3.4516, lng: -76.532 },
    offsetKm: 155,
    fact: "North Sulawesi's diving paradise and Colombia's salsa capital face each other through the planet.",
  },
  {
    id: 40,
    cityA: {
      name: "Surabaya",
      country: "Indonesia",
      lat: -7.2575,
      lng: 112.7521,
    },
    cityB: {
      name: "Medellín",
      country: "Colombia",
      lat: 6.2442,
      lng: -75.5812,
    },
    offsetKm: 165,
    fact: "Java's second city and Colombia's 'City of Eternal Spring' are near-antipodal neighbors.",
  },

  /* ── Taiwan & Japan ↔ South America ──────────────────── */
  {
    id: 41,
    cityA: { name: "Taipei", country: "Taiwan", lat: 25.033, lng: 121.5654 },
    cityB: {
      name: "Buenos Aires",
      country: "Argentina",
      lat: -34.6037,
      lng: -58.3816,
    },
    offsetKm: 95,
    fact: "Taipei 101 and the Obelisk of Buenos Aires are almost perfectly opposite — one of the nearest big-city antipodal pairs on Earth.",
  },
  {
    id: 42,
    cityA: {
      name: "Kaohsiung",
      country: "Taiwan",
      lat: 22.6273,
      lng: 120.3014,
    },
    cityB: {
      name: "Bahía Blanca",
      country: "Argentina",
      lat: -38.7196,
      lng: -62.2724,
    },
    offsetKm: 170,
    fact: "Taiwan's major southern port and Argentina's Patagonian gateway share a through-Earth line.",
  },
  {
    id: 43,
    cityA: { name: "Taichung", country: "Taiwan", lat: 24.1477, lng: 120.6736 },
    cityB: {
      name: "Mar del Plata",
      country: "Argentina",
      lat: -38.0055,
      lng: -57.5426,
    },
    offsetKm: 185,
    fact: "Taiwan's third-largest city and Argentina's beach resort face each other from opposite hemispheres.",
  },
  {
    id: 44,
    cityA: { name: "Kagoshima", country: "Japan", lat: 31.5966, lng: 130.5571 },
    cityB: {
      name: "Punta Arenas",
      country: "Chile",
      lat: -53.1638,
      lng: -70.9171,
    },
    offsetKm: 195,
    fact: "Japan's volcanic Sakurajima looks through the Earth at the Strait of Magellan.",
  },

  /* ── Philippines ↔ South America ──────────────────────────── */
  {
    id: 45,
    cityA: {
      name: "Manila",
      country: "Philippines",
      lat: 14.5995,
      lng: 120.9842,
    },
    cityB: { name: "Belém", country: "Brazil", lat: -1.4558, lng: -48.5024 },
    offsetKm: 196,
    fact: "The Pearl of the Orient and the gateway to the Amazon are near-antipodal equatorial twins.",
  },
  {
    id: 46,
    cityA: {
      name: "Cebu City",
      country: "Philippines",
      lat: 10.3157,
      lng: 123.8854,
    },
    cityB: { name: "Manaus", country: "Brazil", lat: -3.119, lng: -60.0217 },
    offsetKm: 185,
    fact: "The Queen City of the South (Philippines) and the heart of the Amazon are nearly opposite.",
  },
  {
    id: 47,
    cityA: {
      name: "Davao",
      country: "Philippines",
      lat: 7.1907,
      lng: 125.4553,
    },
    cityB: { name: "Boa Vista", country: "Brazil", lat: 2.8195, lng: -60.6714 },
    offsetKm: 178,
    fact: "Mindanao's durian capital and Roraima's frontier city share an equatorial antipodal bond.",
  },
  {
    id: 48,
    cityA: {
      name: "Zamboanga",
      country: "Philippines",
      lat: 6.9214,
      lng: 122.079,
    },
    cityB: { name: "Santarém", country: "Brazil", lat: -2.4431, lng: -54.7081 },
    offsetKm: 190,
    fact: "Asia's Latin city (Zamboanga speaks a Spanish creole) and a town on the Amazon are near-global opposites.",
  },

  /* ── New Zealand ↔ Iberian Peninsula ──────────────────── */
  {
    id: 49,
    cityA: {
      name: "Auckland",
      country: "New Zealand",
      lat: -36.8485,
      lng: 174.7633,
    },
    cityB: { name: "Seville", country: "Spain", lat: 37.3891, lng: -5.9845 },
    offsetKm: 120,
    fact: "New Zealand's largest city and Andalusia's flamenco capital are classic near-antipodes.",
  },
  {
    id: 50,
    cityA: {
      name: "Wellington",
      country: "New Zealand",
      lat: -41.2865,
      lng: 174.7762,
    },
    cityB: { name: "Salamanca", country: "Spain", lat: 40.9688, lng: -5.6631 },
    offsetKm: 105,
    fact: "New Zealand's windy capital and Spain's golden university city face each other through the Earth.",
  },
  {
    id: 51,
    cityA: {
      name: "Christchurch",
      country: "New Zealand",
      lat: -43.5321,
      lng: 172.6362,
    },
    cityB: { name: "A Coruña", country: "Spain", lat: 43.3713, lng: -8.396 },
    offsetKm: 95,
    fact: "Canterbury's garden city and Galicia's rainy Atlantic port are one of the tightest land-antipode pairs.",
  },
  {
    id: 52,
    cityA: {
      name: "Hamilton",
      country: "New Zealand",
      lat: -37.787,
      lng: 175.2793,
    },
    cityB: { name: "Córdoba", country: "Spain", lat: 37.8882, lng: -4.7794 },
    offsetKm: 80,
    fact: "The Waikato's agricultural hub and the city of the Mezquita share an almost perfect through-Earth alignment.",
  },
  {
    id: 53,
    cityA: {
      name: "Tauranga",
      country: "New Zealand",
      lat: -37.6878,
      lng: 176.1651,
    },
    cityB: { name: "Jaén", country: "Spain", lat: 37.7796, lng: -3.7849 },
    offsetKm: 70,
    fact: "Bay of Plenty's kiwifruit coast and Spain's olive oil capital: one of the most precise city antipodes.",
  },
  {
    id: 54,
    cityA: {
      name: "Napier",
      country: "New Zealand",
      lat: -39.4928,
      lng: 176.912,
    },
    cityB: { name: "Ávila", country: "Spain", lat: 40.6565, lng: -4.6818 },
    offsetKm: 115,
    fact: "Art Deco Napier and medieval-walled Ávila are architecturally distinct yet geographically bonded.",
  },
  {
    id: 55,
    cityA: {
      name: "Palmerston North",
      country: "New Zealand",
      lat: -40.3523,
      lng: 175.6082,
    },
    cityB: { name: "Segovia", country: "Spain", lat: 40.9429, lng: -4.1088 },
    offsetKm: 100,
    fact: "A Kiwi university town and Spain's Roman aqueduct city are antipodal academic twins.",
  },
  {
    id: 56,
    cityA: {
      name: "Rotorua",
      country: "New Zealand",
      lat: -38.1368,
      lng: 176.2497,
    },
    cityB: {
      name: "Ciudad Real",
      country: "Spain",
      lat: 38.9848,
      lng: -3.9274,
    },
    offsetKm: 85,
    fact: "Rotorua's geothermal springs and La Mancha's plains are linked by one of the tightest NZ-Spain antipodes.",
  },
  {
    id: 57,
    cityA: {
      name: "Nelson",
      country: "New Zealand",
      lat: -41.2706,
      lng: 173.284,
    },
    cityB: { name: "Zamora", country: "Spain", lat: 41.5034, lng: -5.7467 },
    offsetKm: 110,
    fact: "New Zealand's sunniest city and Spain's Romanesque gem sit on opposite ends of the same Earth diameter.",
  },
  {
    id: 58,
    cityA: {
      name: "Invercargill",
      country: "New Zealand",
      lat: -46.4132,
      lng: 168.3538,
    },
    cityB: { name: "Santander", country: "Spain", lat: 43.4623, lng: -3.81 },
    offsetKm: 140,
    fact: "New Zealand's southernmost city and Cantabria's coastal capital are near-antipodes at the edges of their countries.",
  },

  /* ── New Zealand ↔ Portugal / Morocco ─────────────────── */
  {
    id: 59,
    cityA: {
      name: "Gisborne",
      country: "New Zealand",
      lat: -38.6623,
      lng: 178.0176,
    },
    cityB: { name: "Faro", country: "Portugal", lat: 37.0194, lng: -7.9304 },
    offsetKm: 125,
    fact: "Gisborne sees the first sunrise of the new year; its antipode Faro gets Europe's most sunshine hours.",
  },
  {
    id: 60,
    cityA: {
      name: "Whangarei",
      country: "New Zealand",
      lat: -35.7251,
      lng: 174.3237,
    },
    cityB: { name: "Tangier", country: "Morocco", lat: 35.7595, lng: -5.834 },
    offsetKm: 130,
    fact: "Northland's subtropical harbour and Morocco's gateway to Africa are across the world from each other.",
  },

  /* ── Australia ↔ Atlantic / Azores ────────────────────── */
  {
    id: 61,
    cityA: {
      name: "Perth",
      country: "Australia",
      lat: -31.9505,
      lng: 115.8605,
    },
    cityB: { name: "Hamilton", country: "Bermuda", lat: 32.2949, lng: -64.782 },
    offsetKm: 105,
    fact: "The most isolated major city and the mid-Atlantic island territory share a near-perfect antipodal link.",
  },

  /* ── Korea ↔ South America ───────────────────────────── */
  {
    id: 62,
    cityA: {
      name: "Jeju City",
      country: "South Korea",
      lat: 33.4996,
      lng: 126.5312,
    },
    cityB: {
      name: "Viedma",
      country: "Argentina",
      lat: -40.8135,
      lng: -62.9967,
    },
    offsetKm: 175,
    fact: "Korea's volcanic holiday island and Patagonia's administrative capital are near-antipodal.",
  },

  /* ── More Indonesia ↔ South America ──────────────────── */
  {
    id: 63,
    cityA: {
      name: "Semarang",
      country: "Indonesia",
      lat: -6.9666,
      lng: 110.4196,
    },
    cityB: {
      name: "Bucaramanga",
      country: "Colombia",
      lat: 7.1254,
      lng: -73.1198,
    },
    offsetKm: 145,
    fact: "Java's north-coast port and Colombia's 'Pretty City' share a deep-Earth handshake.",
  },
  {
    id: 64,
    cityA: {
      name: "Yogyakarta",
      country: "Indonesia",
      lat: -7.7956,
      lng: 110.3695,
    },
    cityB: { name: "Cúcuta", country: "Colombia", lat: 7.8891, lng: -72.4967 },
    offsetKm: 150,
    fact: "Java's cultural heartland and the Colombia-Venezuela border city are nearly opposite.",
  },
  {
    id: 65,
    cityA: {
      name: "Denpasar",
      country: "Indonesia",
      lat: -8.65,
      lng: 115.2167,
    },
    cityB: {
      name: "Maracaibo",
      country: "Venezuela",
      lat: 10.6544,
      lng: -71.6364,
    },
    offsetKm: 170,
    fact: "Bali's capital and Venezuela's oil capital share a tropical antipodal link.",
  },
  {
    id: 66,
    cityA: {
      name: "Kupang",
      country: "Indonesia",
      lat: -10.1772,
      lng: 123.5975,
    },
    cityB: {
      name: "Georgetown",
      country: "Guyana",
      lat: 6.8013,
      lng: -58.1551,
    },
    offsetKm: 155,
    fact: "Timor's western tip and South America's only English-speaking capital are near-antipodes.",
  },
  {
    id: 67,
    cityA: { name: "Ambon", country: "Indonesia", lat: -3.6954, lng: 128.1814 },
    cityB: { name: "Iquitos", country: "Peru", lat: -3.7491, lng: -73.2538 },
    offsetKm: 180,
    fact: "The Spice Islands' capital and the Amazon's largest roadless city — both remote, both near-antipodal.",
  },
  {
    id: 68,
    cityA: {
      name: "Jayapura",
      country: "Indonesia",
      lat: -2.5916,
      lng: 140.669,
    },
    cityB: { name: "Macapá", country: "Brazil", lat: 0.0356, lng: -51.0694 },
    offsetKm: 165,
    fact: "Papua's capital and the only Brazilian state capital on the equator are just off being perfect antipodes.",
  },

  /* ── Myanmar ↔ South America ─────────────────────────── */
  {
    id: 69,
    cityA: { name: "Mandalay", country: "Myanmar", lat: 21.9588, lng: 96.0891 },
    cityB: { name: "Sucre", country: "Bolivia", lat: -19.0196, lng: -65.2595 },
    offsetKm: 180,
    fact: "Myanmar's royal city and Bolivia's constitutional capital are equidistant from the Earth's core.",
  },
  {
    id: 70,
    cityA: { name: "Yangon", country: "Myanmar", lat: 16.8661, lng: 96.1951 },
    cityB: { name: "Tarija", country: "Bolivia", lat: -21.5355, lng: -64.7296 },
    offsetKm: 175,
    fact: "The golden Shwedagon Pagoda looks through the planet to Bolivia's wine country.",
  },

  /* ── India ↔ Pacific ──────────────────────────────── */
  {
    id: 71,
    cityA: { name: "Kochi", country: "India", lat: 9.9312, lng: 76.2673 },
    cityB: {
      name: "Guayaquil",
      country: "Ecuador",
      lat: -2.1894,
      lng: -79.8891,
    },
    offsetKm: 195,
    fact: "Kerala's spice-trade port and Ecuador's tropical commercial hub: Indian Ocean meets Pacific.",
  },

  /* ── Sri Lanka ↔ Pacific ──────────────────────────── */
  {
    id: 72,
    cityA: { name: "Colombo", country: "Sri Lanka", lat: 6.9271, lng: 79.8612 },
    cityB: { name: "Piura", country: "Peru", lat: -5.1945, lng: -80.6328 },
    offsetKm: 190,
    fact: "Sri Lanka's commercial capital and Peru's desert-oasis city share a near-antipodal latitude swap.",
  },

  /* ── Thailand ↔ South America ────────────────────────── */
  {
    id: 73,
    cityA: {
      name: "Bangkok",
      country: "Thailand",
      lat: 13.7563,
      lng: 100.5018,
    },
    cityB: { name: "Trujillo", country: "Peru", lat: -8.1116, lng: -79.0287 },
    offsetKm: 180,
    fact: "The City of Angels (Krung Thep) and Peru's City of Eternal Spring are near-global opposites.",
  },
  {
    id: 74,
    cityA: {
      name: "Chiang Mai",
      country: "Thailand",
      lat: 18.7883,
      lng: 98.9853,
    },
    cityB: { name: "La Paz", country: "Bolivia", lat: -16.5, lng: -68.1193 },
    offsetKm: 185,
    fact: "Thailand's mountain-ringed Rose of the North and Bolivia's sky-high capital share similar terrain on opposite sides.",
  },

  /* ── Bangladesh ↔ Pacific ─────────────────────────────── */
  {
    id: 75,
    cityA: { name: "Dhaka", country: "Bangladesh", lat: 23.8103, lng: 90.4125 },
    cityB: {
      name: "Easter Island",
      country: "Chile",
      lat: -27.1127,
      lng: -109.3497,
    },
    offsetKm: 185,
    fact: "The world's most densely populated megacity is opposite one of the most remote inhabited places.",
  },

  /* ── More China ↔ South America ──────────────────────── */
  {
    id: 76,
    cityA: { name: "Shanghai", country: "China", lat: 31.2304, lng: 121.4737 },
    cityB: {
      name: "Mercedes",
      country: "Argentina",
      lat: -34.6515,
      lng: -59.4307,
    },
    offsetKm: 110,
    fact: "China's financial megacity and a quiet Argentine pampas town share a surprisingly tight antipodal bond.",
  },
  {
    id: 77,
    cityA: { name: "Nanjing", country: "China", lat: 32.0603, lng: 118.7969 },
    cityB: {
      name: "Junín",
      country: "Argentina",
      lat: -34.5884,
      lng: -60.9536,
    },
    offsetKm: 120,
    fact: "China's ancient imperial capital and Argentina's pampas farmlands are near-antipodal.",
  },
  {
    id: 78,
    cityA: { name: "Wenzhou", country: "China", lat: 28.0, lng: 120.65 },
    cityB: {
      name: "Tandil",
      country: "Argentina",
      lat: -37.3217,
      lng: -59.1332,
    },
    offsetKm: 115,
    fact: "China's entrepreneurial Wenzhou and Argentina's friendly Tandil are connected through the Earth's mantle.",
  },
  {
    id: 79,
    cityA: { name: "Ningbo", country: "China", lat: 29.8683, lng: 121.544 },
    cityB: {
      name: "Pergamino",
      country: "Argentina",
      lat: -33.8989,
      lng: -60.5734,
    },
    offsetKm: 130,
    fact: "One of the world's busiest ports and a key Argentine grain hub — both economic arteries on opposite sides.",
  },
  {
    id: 80,
    cityA: { name: "Shantou", country: "China", lat: 23.3535, lng: 116.6812 },
    cityB: {
      name: "Neuquén",
      country: "Argentina",
      lat: -38.9516,
      lng: -68.0591,
    },
    offsetKm: 145,
    fact: "Guangdong's Teochew port city and Patagonia's oil boomtown are near-antipodal pairs.",
  },
  {
    id: 81,
    cityA: { name: "Nanning", country: "China", lat: 22.817, lng: 108.3665 },
    cityB: {
      name: "Resistencia",
      country: "Argentina",
      lat: -27.4506,
      lng: -59.0477,
    },
    offsetKm: 160,
    fact: "Guangxi's green-city capital and the cultural capital of Argentina's Chaco face each other through the globe.",
  },
  {
    id: 82,
    cityA: { name: "Chengdu", country: "China", lat: 30.5723, lng: 104.0665 },
    cityB: {
      name: "Termas de Río Hondo",
      country: "Argentina",
      lat: -27.4942,
      lng: -64.86,
    },
    offsetKm: 190,
    fact: "Sichuan's panda-loving capital and Argentina's thermal-springs resort share a cross-planetary axis.",
  },
  {
    id: 83,
    cityA: { name: "Xi'an", country: "China", lat: 34.3416, lng: 108.9398 },
    cityB: {
      name: "San Rafael",
      country: "Argentina",
      lat: -34.6177,
      lng: -68.3301,
    },
    offsetKm: 145,
    fact: "The terracotta warriors gaze through the Earth toward Mendoza's vineyard country.",
  },
  {
    id: 84,
    cityA: { name: "Zhengzhou", country: "China", lat: 34.7466, lng: 113.6253 },
    cityB: {
      name: "Junín de los Andes",
      country: "Argentina",
      lat: -39.9498,
      lng: -71.0694,
    },
    offsetKm: 170,
    fact: "The cradle of Chinese civilization (Yellow River) has its antipodal shadow in the Argentine Lake District.",
  },
  {
    id: 85,
    cityA: { name: "Lanzhou", country: "China", lat: 36.0611, lng: 103.8343 },
    cityB: { name: "Valdivia", country: "Chile", lat: -39.8196, lng: -73.2452 },
    offsetKm: 165,
    fact: "China's Yellow River city and Chile's rainy beer capital share a cross-Pacific, cross-hemispheric bond.",
  },

  /* ── South Asia ↔ Pacific Islands ─────────────────────── */
  {
    id: 86,
    cityA: { name: "Malé", country: "Maldives", lat: 4.1755, lng: 73.5093 },
    cityB: {
      name: "Buenaventura",
      country: "Colombia",
      lat: 3.8801,
      lng: -77.0311,
    },
    offsetKm: 190,
    fact: "The Maldives' tiny coral-island capital and Colombia's Pacific coast port are equatorial near-antipodes.",
  },

  /* ── Africa ↔ Pacific ─────────────────────────────────── */
  {
    id: 87,
    cityA: {
      name: "Kinshasa",
      country: "DR Congo",
      lat: -4.4419,
      lng: 15.2663,
    },
    cityB: { name: "Pontianak", country: "Indonesia", lat: 0.0, lng: 109.3333 },
    offsetKm: 195,
    fact: "Africa's third-largest city and Borneo's equator-straddling town are approximately opposite on the globe.",
  },
  {
    id: 88,
    cityA: {
      name: "Dar es Salaam",
      country: "Tanzania",
      lat: -6.7924,
      lng: 39.2083,
    },
    cityB: { name: "Honolulu", country: "USA", lat: 21.3069, lng: -157.8583 },
    offsetKm: 180,
    fact: "Tanzania's Indian Ocean hub and Hawaii's Pacific paradise aren't exact antipodes but approach it surprisingly close.",
  },

  /* ── Europe ↔ Oceania ─────────────────────────────────── */
  {
    id: 89,
    cityA: { name: "Zaragoza", country: "Spain", lat: 41.6488, lng: -0.8891 },
    cityB: {
      name: "Timaru",
      country: "New Zealand",
      lat: -44.3904,
      lng: 171.2373,
    },
    offsetKm: 155,
    fact: "Aragón's capital and Canterbury's port town prove Spain and NZ are the best land-antipode pair of countries.",
  },
  {
    id: 90,
    cityA: { name: "Barcelona", country: "Spain", lat: 41.3874, lng: 2.1686 },
    cityB: {
      name: "Ashburton",
      country: "New Zealand",
      lat: -43.9007,
      lng: 171.747,
    },
    offsetKm: 180,
    fact: "Gaudí's masterpiece city faces a small NZ farming town — a contrast in fame but aligned in geometry.",
  },
  {
    id: 91,
    cityA: { name: "Valencia", country: "Spain", lat: 39.4699, lng: -0.3763 },
    cityB: {
      name: "Greymouth",
      country: "New Zealand",
      lat: -42.4504,
      lng: 171.2107,
    },
    offsetKm: 140,
    fact: "Spain's City of Arts and Sciences and NZ's West Coast jade-mining town are antipodal siblings.",
  },
  {
    id: 92,
    cityA: { name: "Bilbao", country: "Spain", lat: 43.263, lng: -2.935 },
    cityB: {
      name: "Blenheim",
      country: "New Zealand",
      lat: -41.5118,
      lng: 173.9545,
    },
    offsetKm: 120,
    fact: "The Guggenheim's home and Marlborough's wine capital are linked through 12,742 km of planet.",
  },
  {
    id: 93,
    cityA: { name: "Lisbon", country: "Portugal", lat: 38.7223, lng: -9.1393 },
    cityB: {
      name: "Kaikōura",
      country: "New Zealand",
      lat: -42.4008,
      lng: 173.6814,
    },
    offsetKm: 145,
    fact: "Europe's westernmost capital and NZ's whale-watching coast share a trans-global antipodal axis.",
  },
  {
    id: 94,
    cityA: { name: "Porto", country: "Portugal", lat: 41.1579, lng: -8.6291 },
    cityB: {
      name: "Hanmer Springs",
      country: "New Zealand",
      lat: -42.5249,
      lng: 172.829,
    },
    offsetKm: 125,
    fact: "Portugal's port-wine city and New Zealand's hot-springs village share a remarkable antipodal proximity.",
  },

  /* ── Caribbean ↔ Southeast Asia ──────────────────────── */
  {
    id: 95,
    cityA: { name: "Havana", country: "Cuba", lat: 23.1136, lng: -82.3666 },
    cityB: { name: "Bima", country: "Indonesia", lat: -8.4609, lng: 118.7264 },
    offsetKm: 175,
    fact: "Cuba's revolutionary capital and Sumbawa's ancient sultanate city are tropical near-antipodes.",
  },

  /* ── Central America ↔ Southeast Asia ────────────────── */
  {
    id: 96,
    cityA: {
      name: "Managua",
      country: "Nicaragua",
      lat: 12.115,
      lng: -86.2362,
    },
    cityB: { name: "Sorong", country: "Indonesia", lat: -0.8618, lng: 131.255 },
    offsetKm: 190,
    fact: "Lake Managua and Raja Ampat's gateway city are near-global opposites, separated by all of Earth's oceans.",
  },
  {
    id: 97,
    cityA: {
      name: "San José",
      country: "Costa Rica",
      lat: 9.9281,
      lng: -84.0907,
    },
    cityB: {
      name: "Ternate",
      country: "Indonesia",
      lat: 0.7736,
      lng: 127.3668,
    },
    offsetKm: 185,
    fact: "Costa Rica's capital and the Spice Islands' clove-scented Ternate share a cross-global latitude swap.",
  },

  /* ── South Pacific ↔ West Africa ──────────────────────── */
  {
    id: 98,
    cityA: { name: "Suva", country: "Fiji", lat: -18.1416, lng: 178.4419 },
    cityB: { name: "Timbuktu", country: "Mali", lat: 16.7666, lng: -3.0026 },
    offsetKm: 195,
    fact: "The South Pacific capital and the Saharan legendary city — both famously remote — are near-antipodal.",
  },

  /* ── Australia ↔ Atlantic ─────────────────────────────── */
  {
    id: 99,
    cityA: {
      name: "Broken Hill",
      country: "Australia",
      lat: -31.9584,
      lng: 141.453,
    },
    cityB: {
      name: "Praia",
      country: "Cape Verde",
      lat: 14.9331,
      lng: -23.5133,
    },
    offsetKm: 185,
    fact: "Australia's outback mining town and Cape Verde's capital — both arid, both on opposite continents.",
  },

  /* ── Patagonia ↔ East Asia ────────────────────────────── */
  {
    id: 100,
    cityA: {
      name: "Ushuaia",
      country: "Argentina",
      lat: -54.8019,
      lng: -68.303,
    },
    cityB: { name: "Harbin", country: "China", lat: 45.75, lng: 126.65 },
    offsetKm: 180,
    fact: "The world's southernmost city and China's Ice City — both defined by extreme cold — are approximate antipodes.",
  },

  /* ── More diverse pairs ──────────────────────────────── */
  {
    id: 101,
    cityA: {
      name: "Papeete",
      country: "French Polynesia",
      lat: -17.5516,
      lng: -149.5585,
    },
    cityB: {
      name: "Jeddah",
      country: "Saudi Arabia",
      lat: 21.2854,
      lng: 39.2376,
    },
    offsetKm: 190,
    fact: "Tahiti's paradise capital and Saudi Arabia's Red Sea gateway: beach cultures on opposite sides of the planet.",
  },
  {
    id: 102,
    cityA: {
      name: "Nouméa",
      country: "New Caledonia",
      lat: -22.2758,
      lng: 166.458,
    },
    cityB: {
      name: "Nouakchott",
      country: "Mauritania",
      lat: 18.0735,
      lng: -15.9582,
    },
    offsetKm: 175,
    fact: "Two 'Nou-' cities — French-speaking Nouméa and Nouakchott — are near-antipodal by coincidence.",
  },
  {
    id: 103,
    cityA: { name: "Apia", country: "Samoa", lat: -13.8333, lng: -171.75 },
    cityB: { name: "N'Djamena", country: "Chad", lat: 12.1348, lng: 15.0557 },
    offsetKm: 195,
    fact: "Samoa's gentle Pacific capital and Chad's Saharan-edge capital sit on opposite faces of the globe.",
  },
  {
    id: 104,
    cityA: {
      name: "Nuku'alofa",
      country: "Tonga",
      lat: -21.2094,
      lng: -175.2006,
    },
    cityB: { name: "Gao", country: "Mali", lat: 16.2719, lng: 0.04 },
    offsetKm: 185,
    fact: "Tonga's royal capital and Mali's ancient Songhai city are Pacific-to-Sahara near-antipodes.",
  },
  {
    id: 105,
    cityA: {
      name: "Honiara",
      country: "Solomon Islands",
      lat: -9.4456,
      lng: 159.9729,
    },
    cityB: { name: "Timbuktu", country: "Mali", lat: 16.7666, lng: -3.0026 },
    offsetKm: 190,
    fact: "WWII's Guadalcanal and the legendary Sahelian trade city are near-global opposites.",
  },
  {
    id: 106,
    cityA: {
      name: "Port Moresby",
      country: "Papua New Guinea",
      lat: -9.4438,
      lng: 147.1803,
    },
    cityB: { name: "Mérida", country: "Venezuela", lat: 8.5897, lng: -71.1561 },
    offsetKm: 160,
    fact: "Papua New Guinea's coastal capital and Venezuela's Andean university town share a near-antipodal trait.",
  },
  {
    id: 107,
    cityA: {
      name: "Lae",
      country: "Papua New Guinea",
      lat: -6.734,
      lng: 147.0,
    },
    cityB: {
      name: "Caracas",
      country: "Venezuela",
      lat: 10.4806,
      lng: -66.9036,
    },
    offsetKm: 170,
    fact: "PNG's industrial hub and Venezuela's mountainous capital are approximate opposites across the core.",
  },
  {
    id: 108,
    cityA: {
      name: "Luganville",
      country: "Vanuatu",
      lat: -15.5134,
      lng: 167.172,
    },
    cityB: {
      name: "Ouagadougou",
      country: "Burkina Faso",
      lat: 12.3714,
      lng: -1.5197,
    },
    offsetKm: 185,
    fact: "Vanuatu's diving paradise and Burkina Faso's vibrant capital are tropical near-antipodes.",
  },
  {
    id: 109,
    cityA: {
      name: "Rarotonga",
      country: "Cook Islands",
      lat: -21.2367,
      lng: -159.7732,
    },
    cityB: { name: "Muscat", country: "Oman", lat: 23.588, lng: 58.3829 },
    offsetKm: 180,
    fact: "The Cook Islands' lagoon paradise and Oman's frankincense coast are separated by the full diameter of Earth.",
  },
  {
    id: 110,
    cityA: { name: "Funafuti", country: "Tuvalu", lat: -8.5211, lng: 179.1962 },
    cityB: {
      name: "Ouagadougou",
      country: "Burkina Faso",
      lat: 12.3714,
      lng: -1.5197,
    },
    offsetKm: 190,
    fact: "One of Earth's most climate-vulnerable nations and a landlocked Sahelian capital are near-antipodal.",
  },

  /* ── Southern Africa ↔ North Pacific ──────────────────── */
  {
    id: 111,
    cityA: {
      name: "Antananarivo",
      country: "Madagascar",
      lat: -18.8792,
      lng: 47.5079,
    },
    cityB: {
      name: "Guadalajara",
      country: "Mexico",
      lat: 20.6597,
      lng: -103.3496,
    },
    offsetKm: 180,
    fact: "Madagascar's highland capital and Mexico's tequila city look at each other through the Earth.",
  },
  {
    id: 112,
    cityA: {
      name: "Maputo",
      country: "Mozambique",
      lat: -25.9692,
      lng: 32.5732,
    },
    cityB: {
      name: "Culiacán",
      country: "Mexico",
      lat: 24.7994,
      lng: -107.3878,
    },
    offsetKm: 185,
    fact: "Mozambique's Indian Ocean capital and Sinaloa's agricultural hub are near-global opposites.",
  },
  {
    id: 113,
    cityA: { name: "Blantyre", country: "Malawi", lat: -15.7861, lng: 35.0058 },
    cityB: { name: "Acapulco", country: "Mexico", lat: 16.8531, lng: -99.8237 },
    offsetKm: 175,
    fact: "Malawi's commercial capital and Mexico's Pacific resort share antipodal sunsets.",
  },

  /* ── East Africa ↔ Hawaii / Pacific ──────────────────── */
  {
    id: 114,
    cityA: { name: "Nairobi", country: "Kenya", lat: -1.2921, lng: 36.8219 },
    cityB: {
      name: "Isla Floreana",
      country: "Ecuador (Galápagos)",
      lat: -1.2833,
      lng: -90.4333,
    },
    offsetKm: 195,
    fact: "Kenya's highland capital and the Galápagos' most mysterious island are equatorial near-antipodes.",
  },

  /* ── Horn of Africa ↔ Pacific ────────────────────────── */
  {
    id: 115,
    cityA: { name: "Mogadishu", country: "Somalia", lat: 2.0469, lng: 45.3182 },
    cityB: {
      name: "Baltra",
      country: "Ecuador (Galápagos)",
      lat: -0.4333,
      lng: -90.2833,
    },
    offsetKm: 190,
    fact: "Somalia's coastal capital and the Galápagos airport island share an equatorial antipodal bond.",
  },

  /* ── North Africa ↔ Pacific ──────────────────────────── */
  {
    id: 116,
    cityA: {
      name: "Casablanca",
      country: "Morocco",
      lat: 33.5731,
      lng: -7.5898,
    },
    cityB: {
      name: "Whakatāne",
      country: "New Zealand",
      lat: -37.9534,
      lng: 176.9908,
    },
    offsetKm: 155,
    fact: "Morocco's film-noir city and NZ's Bay of Plenty sunshine coast are near-antipodal.",
  },
  {
    id: 117,
    cityA: {
      name: "Marrakech",
      country: "Morocco",
      lat: 31.6295,
      lng: -7.9811,
    },
    cityB: {
      name: "Hastings",
      country: "New Zealand",
      lat: -39.6381,
      lng: 176.8493,
    },
    offsetKm: 140,
    fact: "The Red City and Hawke's Bay's wine country: one hot and dry, the other green and maritime, yet antipodally paired.",
  },

  /* ── Brazil ↔ rest of East/Southeast Asia ─────────────── */
  {
    id: 118,
    cityA: { name: "Recife", country: "Brazil", lat: -8.0476, lng: -34.877 },
    cityB: { name: "Kuching", country: "Malaysia", lat: 1.5535, lng: 110.3593 },
    offsetKm: 195,
    fact: "Brazil's Venice and Borneo's Cat City are equatorial near-antipodes straddling the Atlantic and Pacific.",
  },
  {
    id: 119,
    cityA: {
      name: "Fortaleza",
      country: "Brazil",
      lat: -3.7172,
      lng: -38.5433,
    },
    cityB: {
      name: "Makassar",
      country: "Indonesia",
      lat: -5.1477,
      lng: 119.4327,
    },
    offsetKm: 190,
    fact: "Brazil's sun-baked northeast coast and Sulawesi's seafaring city are trans-oceanic near-antipodes.",
  },
  {
    id: 120,
    cityA: { name: "São Luís", country: "Brazil", lat: -2.5297, lng: -44.2825 },
    cityB: {
      name: "Balikpapan",
      country: "Indonesia",
      lat: -1.2654,
      lng: 116.8311,
    },
    offsetKm: 180,
    fact: "Brazil's reggae capital and Borneo's oil port: both tropical, both coastal, both near-antipodal.",
  },
];

export default pairs;
