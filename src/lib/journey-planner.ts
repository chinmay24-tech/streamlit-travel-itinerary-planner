import { JourneyLeg, JourneyPlan, TransitMode, BudgetLevel } from '@/types/travel';
import { findDestination } from './destination-data';

type Coord = { lat: number; lng: number; airport?: string; station?: string };

const COORDS: Record<string, Coord> = {
  // India metros & capitals
  'new delhi': { lat: 28.6139, lng: 77.2090, airport: 'DEL (IGI)', station: 'NDLS / New Delhi' },
  delhi: { lat: 28.6139, lng: 77.2090, airport: 'DEL', station: 'NDLS' },
  gurugram: { lat: 28.4595, lng: 77.0266, airport: 'DEL', station: 'Gurgaon' },
  noida: { lat: 28.5355, lng: 77.3910, airport: 'DEL', station: 'Anand Vihar' },
  faridabad: { lat: 28.4089, lng: 77.3178, airport: 'DEL', station: 'Faridabad' },
  mumbai: { lat: 19.0760, lng: 72.8777, airport: 'BOM (CSMIA)', station: 'CSTM / Bandra T.' },
  pune: { lat: 18.5204, lng: 73.8567, airport: 'PNQ', station: 'Pune Jn' },
  nagpur: { lat: 21.1458, lng: 79.0882, airport: 'NAG', station: 'Nagpur Jn' },
  nashik: { lat: 19.9975, lng: 73.7898, airport: 'ISK', station: 'Nashik Road' },
  aurangabad: { lat: 19.8762, lng: 75.3433, airport: 'IXU', station: 'Aurangabad' },
  lonavala: { lat: 18.7537, lng: 73.4062, station: 'Lonavala' },
  mahabaleshwar: { lat: 17.9307, lng: 73.6477 },
  kolhapur: { lat: 16.7050, lng: 74.2433, airport: 'KLH', station: 'Kolhapur' },
  alibaug: { lat: 18.6414, lng: 72.8722 },
  shirdi: { lat: 19.7665, lng: 74.4773, airport: 'SAG', station: 'Sainagar Shirdi' },
  thane: { lat: 19.2183, lng: 72.9781, station: 'Thane' },
  'navi mumbai': { lat: 19.0330, lng: 73.0297, airport: 'BOM / NMIA', station: 'Panvel' },
  bengaluru: { lat: 12.9716, lng: 77.5946, airport: 'BLR (Kempegowda)', station: 'SBC / Yesvantpur' },
  bangalore: { lat: 12.9716, lng: 77.5946, airport: 'BLR', station: 'SBC' },
  mysuru: { lat: 12.2958, lng: 76.6394, airport: 'MYQ', station: 'Mysuru Jn' },
  mysore: { lat: 12.2958, lng: 76.6394, station: 'Mysuru Jn' },
  hampi: { lat: 15.3350, lng: 76.4600, station: 'Hosapete Jn' },
  madikeri: { lat: 12.4244, lng: 75.7382 },
  coorg: { lat: 12.4244, lng: 75.7382 },
  gokarna: { lat: 14.5479, lng: 74.3188, station: 'Gokarna Road' },
  mangaluru: { lat: 12.9141, lng: 74.8560, airport: 'IXE', station: 'Mangaluru Jn' },
  udupi: { lat: 13.3409, lng: 74.7421, station: 'Udupi' },
  chikmagalur: { lat: 13.3161, lng: 75.7720 },
  hubballi: { lat: 15.3647, lng: 75.1240, airport: 'HBX', station: 'Hubballi Jn' },
  belagavi: { lat: 15.8497, lng: 74.4977, airport: 'IXG', station: 'Belagavi' },
  chennai: { lat: 13.0827, lng: 80.2707, airport: 'MAA (T3)', station: 'MAS / Central' },
  madurai: { lat: 9.9252, lng: 78.1198, airport: 'IXM', station: 'Madurai Jn' },
  coimbatore: { lat: 11.0168, lng: 76.9558, airport: 'CJB', station: 'Coimbatore Jn' },
  ooty: { lat: 11.4102, lng: 76.6950, station: 'Udhagamandalam' },
  kodaikanal: { lat: 10.2381, lng: 77.4892, station: 'Kodaikanal Road' },
  mahabalipuram: { lat: 12.6208, lng: 80.1945 },
  rameswaram: { lat: 9.2876, lng: 79.3129, station: 'Rameswaram' },
  kanyakumari: { lat: 8.0883, lng: 77.5385, station: 'Kanyakumari' },
  thanjavur: { lat: 10.7870, lng: 79.1378, station: 'Thanjavur Jn' },
  kanchipuram: { lat: 12.8342, lng: 79.7036, station: 'Kanchipuram' },
  tiruchirappalli: { lat: 10.7905, lng: 78.7047, airport: 'TRZ', station: 'Trichy Jn' },
  salem: { lat: 11.6643, lng: 78.1460, station: 'Salem Jn' },
  kochi: { lat: 9.9312, lng: 76.2673, airport: 'COK (CIAL)', station: 'ERN / Ernakulam' },
  cochin: { lat: 9.9312, lng: 76.2673, airport: 'COK', station: 'Ernakulam' },
  thiruvananthapuram: { lat: 8.5241, lng: 76.9366, airport: 'TRV', station: 'TVC' },
  alappuzha: { lat: 9.4981, lng: 76.3388, station: 'Alappuzha' },
  alleppey: { lat: 9.4981, lng: 76.3388, station: 'Alappuzha' },
  munnar: { lat: 10.0889, lng: 77.0595 },
  wayanad: { lat: 11.6854, lng: 76.1320 },
  kozhikode: { lat: 11.2588, lng: 75.7804, airport: 'CCJ', station: 'Kozhikode' },
  varkala: { lat: 8.7379, lng: 76.7163, station: 'Varkala Sivagiri' },
  thekkady: { lat: 9.6031, lng: 77.1615 },
  kovalam: { lat: 8.4004, lng: 76.9787 },
  thrissur: { lat: 10.5276, lng: 76.2144, station: 'Thrissur' },
  hyderabad: { lat: 17.3850, lng: 78.4867, airport: 'HYD (RGIA)', station: 'Secunderabad / HYB' },
  warangal: { lat: 17.9689, lng: 79.5941, station: 'Kazipet / Warangal' },
  visakhapatnam: { lat: 17.6868, lng: 83.2185, airport: 'VTZ', station: 'Visakhapatnam' },
  vijayawada: { lat: 16.5062, lng: 80.6480, airport: 'VGA', station: 'Vijayawada Jn' },
  tirupati: { lat: 13.6288, lng: 79.4192, airport: 'TIR', station: 'Tirupati' },
  guntur: { lat: 16.3067, lng: 80.4365, station: 'Guntur Jn' },
  nellore: { lat: 14.4426, lng: 79.9865, station: 'Nellore' },
  kolkata: { lat: 22.5726, lng: 88.3639, airport: 'CCU (NSCBI)', station: 'HWH / SDAH' },
  darjeeling: { lat: 27.0410, lng: 88.2663, station: 'New Jalpaiguri + Toy Train' },
  siliguri: { lat: 26.7271, lng: 88.3953, airport: 'IXB (Bagdogra)', station: 'NJP' },
  kalimpong: { lat: 27.0594, lng: 88.4695 },
  sundarbans: { lat: 21.9497, lng: 88.9099, station: 'Canning' },
  durgapur: { lat: 23.5204, lng: 87.3119, station: 'Durgapur' },
  jaipur: { lat: 26.9124, lng: 75.7873, airport: 'JAI (Sanganeer)', station: 'Jaipur Jn' },
  udaipur: { lat: 24.5854, lng: 73.7125, airport: 'UDR', station: 'Udaipur City' },
  jodhpur: { lat: 26.2389, lng: 73.0243, airport: 'JDH', station: 'Jodhpur Jn' },
  jaisalmer: { lat: 26.9157, lng: 70.9083, airport: 'JSA', station: 'Jaisalmer' },
  bikaner: { lat: 28.0229, lng: 73.3119, station: 'Bikaner Jn' },
  pushkar: { lat: 26.4899, lng: 74.5511, station: 'Ajmer Jn (15 km)' },
  ajmer: { lat: 26.4499, lng: 74.6399, station: 'Ajmer Jn' },
  'mount abu': { lat: 24.5926, lng: 72.7156, station: 'Abu Road' },
  kota: { lat: 25.2138, lng: 75.8648, station: 'Kota Jn' },
  bundi: { lat: 25.4305, lng: 75.6499, station: 'Bundi' },
  chittorgarh: { lat: 24.8887, lng: 74.6269, station: 'Chittorgarh Jn' },
  bharatpur: { lat: 27.2152, lng: 77.5030, station: 'Bharatpur Jn' },
  alwar: { lat: 27.5530, lng: 76.6346, station: 'Alwar Jn' },
  agra: { lat: 27.1767, lng: 78.0081, airport: 'AGR / Kheria', station: 'AGC / Agra Cantt' },
  varanasi: { lat: 25.3176, lng: 82.9739, airport: 'VNS (Lal Bahadur)', station: 'BSB / Banaras' },
  lucknow: { lat: 26.8467, lng: 80.9462, airport: 'LKO (Amausi)', station: 'LKO / LJN' },
  prayagraj: { lat: 25.4358, lng: 81.8463, airport: 'IXD', station: 'Prayagraj Jn' },
  ayodhya: { lat: 26.7922, lng: 82.1998, airport: 'AYJ', station: 'Ayodhya Dham' },
  mathura: { lat: 27.4924, lng: 77.6737, station: 'Mathura Jn' },
  vrindavan: { lat: 27.5806, lng: 77.7006, station: 'Mathura Jn' },
  kanpur: { lat: 26.4499, lng: 80.3319, airport: 'KNU', station: 'Kanpur Central' },
  jhansi: { lat: 25.4484, lng: 78.5685, station: 'Jhansi Jn' },
  ahmedabad: { lat: 23.0225, lng: 72.5714, airport: 'AMD (Sardar Vallabhbhai)', station: 'ADI' },
  surat: { lat: 21.1702, lng: 72.8311, airport: 'STV', station: 'Surat' },
  vadodara: { lat: 22.3072, lng: 73.1812, airport: 'BDQ', station: 'BRC' },
  rajkot: { lat: 22.3039, lng: 70.8022, airport: 'RAJ', station: 'Rajkot Jn' },
  bhuj: { lat: 23.2420, lng: 69.6669, airport: 'BHJ', station: 'Bhuj' },
  dwarka: { lat: 22.2442, lng: 68.9685, station: 'Dwarka' },
  somnath: { lat: 20.8880, lng: 70.4012, station: 'Veraval / Somnath' },
  'sasan gir': { lat: 21.1240, lng: 70.8242 },
  gandhinagar: { lat: 23.2156, lng: 72.6369, station: 'Gandhinagar Capital' },
  kevadia: { lat: 21.8380, lng: 73.7191, station: 'Kevadiya' },
  bhopal: { lat: 23.2599, lng: 77.4126, airport: 'BHO', station: 'Bhopal Jn / HBJ' },
  indore: { lat: 22.7196, lng: 75.8577, airport: 'IDR', station: 'Indore Jn' },
  neemuch: { lat: 24.4764, lng: 74.8730, station: 'Neemuch (NMH)' },
  nimach: { lat: 24.4764, lng: 74.8730, station: 'Neemuch (NMH)' },
  mandsaur: { lat: 24.0768, lng: 75.0690, station: 'Mandsaur (MDS)' },
  ratlam: { lat: 23.3315, lng: 75.0367, station: 'Ratlam Jn (RTM)' },
  khajuraho: { lat: 24.8318, lng: 79.9199, airport: 'HJR', station: 'Khajuraho' },
  gwalior: { lat: 26.2183, lng: 78.1828, airport: 'GWL', station: 'Gwalior Jn' },
  ujjain: { lat: 23.1765, lng: 75.7885, station: 'Ujjain Jn' },
  orchha: { lat: 25.3519, lng: 78.6401, station: 'Jhansi Jn (15 km)' },
  jabalpur: { lat: 23.1815, lng: 79.9864, airport: 'JLR', station: 'Jabalpur' },
  kanha: { lat: 22.3345, lng: 80.6115 },
  pachmarhi: { lat: 22.4673, lng: 78.4336, station: 'Pipariya' },
  amritsar: { lat: 31.6340, lng: 74.8723, airport: 'ATQ (Rajasansi)', station: 'Amritsar Jn' },
  chandigarh: { lat: 30.7333, lng: 76.7794, airport: 'IXC', station: 'Chandigarh' },
  ludhiana: { lat: 30.9010, lng: 75.8573, airport: 'LUH', station: 'Ludhiana Jn' },
  jalandhar: { lat: 31.3260, lng: 75.5762, station: 'Jalandhar City' },
  patiala: { lat: 30.3398, lng: 76.3869, station: 'Patiala' },
  kurukshetra: { lat: 29.9695, lng: 76.8783, station: 'Kurukshetra Jn' },
  panipat: { lat: 29.3909, lng: 76.9635, station: 'Panipat Jn' },
  dehradun: { lat: 30.3165, lng: 78.0322, airport: 'DED', station: 'Dehradun' },
  rishikesh: { lat: 30.0869, lng: 78.2676, station: 'Yog Nagari Rishikesh' },
  haridwar: { lat: 29.9457, lng: 78.1642, station: 'Haridwar Jn' },
  nainital: { lat: 29.3803, lng: 79.4636, station: 'Kathgodam' },
  mussoorie: { lat: 30.4598, lng: 78.0644 },
  auli: { lat: 30.5286, lng: 79.5696 },
  'jim corbett': { lat: 29.5300, lng: 78.7747, station: 'Ramnagar' },
  kedarnath: { lat: 30.7346, lng: 79.0669 },
  badrinath: { lat: 30.7433, lng: 79.4938 },
  shimla: { lat: 31.1048, lng: 77.1734, airport: 'SLV', station: 'Kalka + Toy Train' },
  manali: { lat: 32.2396, lng: 77.1887, airport: 'KUU (Bhuntar)' },
  dharamshala: { lat: 32.2190, lng: 76.3234, airport: 'DHM (Gaggal)' },
  dalhousie: { lat: 32.5387, lng: 75.9710, station: 'Pathankot' },
  kasol: { lat: 32.0099, lng: 77.3144 },
  kaza: { lat: 32.2277, lng: 78.0722 },
  kullu: { lat: 31.9579, lng: 77.1095, airport: 'KUU' },
  kasauli: { lat: 30.9010, lng: 76.9649, station: 'Dharampur' },
  srinagar: { lat: 34.0837, lng: 74.7973, airport: 'SXR (Sheikh ul-Alam)', station: 'Srinagar' },
  jammu: { lat: 32.7266, lng: 74.8570, airport: 'IXJ', station: 'Jammu Tawi' },
  gulmarg: { lat: 34.0484, lng: 74.3805 },
  pahalgam: { lat: 34.0161, lng: 75.3150 },
  leh: { lat: 34.1526, lng: 77.5771, airport: 'IXL (Kushok Bakula)' },
  kargil: { lat: 34.5539, lng: 76.1349 },
  patna: { lat: 25.5941, lng: 85.1376, airport: 'PAT', station: 'Patna Jn' },
  'bodh gaya': { lat: 24.6961, lng: 84.9869, airport: 'GAY', station: 'Gaya Jn' },
  nalanda: { lat: 25.1367, lng: 85.4438, station: 'Rajgir / Bihar Sharif' },
  muzaffarpur: { lat: 26.1197, lng: 85.3910, station: 'Muzaffarpur Jn' },
  ranchi: { lat: 23.3441, lng: 85.3096, airport: 'IXR', station: 'Ranchi Jn' },
  jamshedpur: { lat: 22.8046, lng: 86.2029, station: 'Tatanagar' },
  deoghar: { lat: 24.4828, lng: 86.6947, airport: 'DGH', station: 'Jasidih / Deoghar' },
  dhanbad: { lat: 23.7957, lng: 86.4304, station: 'Dhanbad Jn' },
  bhubaneswar: { lat: 20.2961, lng: 85.8245, airport: 'BBI', station: 'Bhubaneswar' },
  puri: { lat: 19.8135, lng: 85.8312, station: 'Puri' },
  konark: { lat: 19.8876, lng: 86.0945 },
  cuttack: { lat: 20.4625, lng: 85.8830, station: 'Cuttack' },
  raipur: { lat: 21.2514, lng: 81.6296, airport: 'RPR', station: 'Raipur Jn' },
  jagdalpur: { lat: 19.0747, lng: 82.0080, airport: 'JGB', station: 'Jagdalpur' },
  bilaspur: { lat: 22.0796, lng: 82.1391, station: 'Bilaspur Jn' },
  guwahati: { lat: 26.1445, lng: 91.7362, airport: 'GAU (LGBI)', station: 'Guwahati' },
  kaziranga: { lat: 26.5775, lng: 93.1711, airport: 'JRH / GAU' },
  majuli: { lat: 26.9500, lng: 94.1667, station: 'Jorhat + ferry' },
  jorhat: { lat: 26.7509, lng: 94.2037, airport: 'JRH', station: 'Jorhat Town' },
  tezpur: { lat: 26.6338, lng: 92.8000, airport: 'TEZ' },
  shillong: { lat: 25.5788, lng: 91.8933, airport: 'SHL / GAU' },
  cherrapunji: { lat: 25.3000, lng: 91.7000 },
  dawki: { lat: 25.1860, lng: 92.0160 },
  gangtok: { lat: 27.3389, lng: 88.6065, airport: 'PYG (Pakyong) / IXB' },
  pelling: { lat: 27.3170, lng: 88.2430 },
  lachung: { lat: 27.6890, lng: 88.7430 },
  itanagar: { lat: 27.0844, lng: 93.6053, airport: 'HGI' },
  tawang: { lat: 27.5860, lng: 91.8650 },
  ziro: { lat: 27.5460, lng: 93.8220, airport: 'IXI (Lilabari)' },
  kohima: { lat: 25.6751, lng: 94.1086, airport: 'DMU' },
  dimapur: { lat: 25.9063, lng: 93.7276, airport: 'DMU', station: 'Dimapur' },
  imphal: { lat: 24.8170, lng: 93.9368, airport: 'IMF' },
  aizawl: { lat: 23.7271, lng: 92.7176, airport: 'AJL (Lengpui)' },
  agartala: { lat: 23.8315, lng: 91.2868, airport: 'IXA', station: 'Agartala' },
  'port blair': { lat: 11.6234, lng: 92.7265, airport: 'IXZ (Veer Savarkar)' },
  'swaraj dweep': { lat: 12.0300, lng: 92.9800 },
  havelock: { lat: 12.0300, lng: 92.9800 },
  'shaheed dweep': { lat: 11.8310, lng: 93.0460 },
  agatti: { lat: 10.8280, lng: 72.1760, airport: 'AGX' },
  kavaratti: { lat: 10.5667, lng: 72.6369 },
  puducherry: { lat: 11.9416, lng: 79.8083, airport: 'PNY', station: 'Puducherry' },
  pondicherry: { lat: 11.9416, lng: 79.8083, station: 'Puducherry' },
  auroville: { lat: 12.0067, lng: 79.8106 },
  daman: { lat: 20.3974, lng: 72.8328, station: 'Vapi' },
  diu: { lat: 20.7144, lng: 70.9874, airport: 'DIU' },
  silvassa: { lat: 20.2739, lng: 73.0044, station: 'Vapi' },
  panaji: { lat: 15.4909, lng: 73.8278, airport: 'GOI (Dabolim) / GOX (Mopa)', station: 'Karmali / Madgaon' },
  goa: { lat: 15.4909, lng: 73.8278, airport: 'GOI / GOX', station: 'Madgaon / Karmali' },
  calangute: { lat: 15.5439, lng: 73.7553, airport: 'GOX / GOI' },
  palolem: { lat: 15.0100, lng: 74.0232, station: 'Canacona' },
  anjuna: { lat: 15.5732, lng: 73.7409, airport: 'GOX' },
  margao: { lat: 15.2732, lng: 73.9581, station: 'Madgaon' },
  // International
  tokyo: { lat: 35.6762, lng: 139.6503, airport: 'HND / NRT', station: 'Tokyo Station' },
  paris: { lat: 48.8566, lng: 2.3522, airport: 'CDG / ORY', station: 'Gare du Nord' },
  bali: { lat: -8.4095, lng: 115.1889, airport: 'DPS (Ngurah Rai)' },
  interlaken: { lat: 46.6863, lng: 7.8632, station: 'Interlaken Ost' },
  rome: { lat: 41.9028, lng: 12.4964, airport: 'FCO', station: 'Roma Termini' },
  'new york city': { lat: 40.7128, lng: -74.0060, airport: 'JFK / EWR / LGA', station: 'Penn Station' }
};

const STATE_FALLBACK: Record<string, Coord> = {
  delhi: COORDS['new delhi'],
  maharashtra: COORDS.mumbai,
  karnataka: COORDS.bengaluru,
  'tamil nadu': COORDS.chennai,
  kerala: COORDS.kochi,
  telangana: COORDS.hyderabad,
  'andhra pradesh': COORDS.vijayawada,
  'west bengal': COORDS.kolkata,
  rajasthan: COORDS.jaipur,
  gujarat: COORDS.ahmedabad,
  'madhya pradesh': COORDS.bhopal,
  punjab: COORDS.chandigarh,
  haryana: COORDS.chandigarh,
  uttarakhand: COORDS.dehradun,
  'himachal pradesh': COORDS.shimla,
  'jammu & kashmir': COORDS.srinagar,
  ladakh: COORDS.leh,
  bihar: COORDS.patna,
  jharkhand: COORDS.ranchi,
  odisha: COORDS.bhubaneswar,
  chhattisgarh: COORDS.raipur,
  assam: COORDS.guwahati,
  meghalaya: COORDS.shillong,
  sikkim: COORDS.gangtok,
  goa: COORDS.panaji,
  puducherry: COORDS.puducherry
};

function norm(s: string): string {
  return (s || '')
    .toLowerCase()
    .replace(/\(.*?\)/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export function stripAirport(c: Coord): Coord {
  return { lat: c.lat, lng: c.lng, station: c.station };
}

/** True only when this city itself has a commercial airport (not a borrowed state-capital code). */
function hasLocalAirport(c?: Coord): boolean {
  return Boolean(c?.airport && c.airport.trim());
}

function lookupCoords(name: string): Coord | undefined {
  const q = norm(name);
  if (!q) return undefined;
  if (COORDS[q]) return COORDS[q];
  const dest = findDestination(name);
  if (dest) {
    const byCity = COORDS[norm(dest.city)];
    if (byCity) return byCity;
    for (const a of dest.aliases || []) {
      if (COORDS[norm(a)]) return COORDS[norm(a)];
    }
    // State centroid is OK for a rough pin, but NEVER inherit that city's airport.
    if (dest.state && STATE_FALLBACK[norm(dest.state)]) {
      return stripAirport(STATE_FALLBACK[norm(dest.state)]);
    }
  }
  const hit = Object.keys(COORDS).find((k) => k === q || (k.length >= 5 && (q.startsWith(k) || k.startsWith(q))));
  return hit ? COORDS[hit] : undefined;
}

function flightViable(from: Coord, to: Coord, km: number, bothIndia: boolean): boolean {
  if (!hasLocalAirport(from) || !hasLocalAirport(to)) return false;
  if (from.airport === to.airport) return false;
  // Door-to-door, sub-~350 km hops lose to train/road after 2.5h airport overhead.
  if (bothIndia && km < 350) return false;
  return true;
}

function haversineKm(a: Coord, b: Coord): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s)));
}

function hoursLabel(h: number): string {
  if (h < 1) return `${Math.max(20, Math.round(h * 60))} mins`;
  const hr = Math.floor(h);
  const m = Math.round((h - hr) * 60);
  if (m === 0) return `${hr}h`;
  return `${hr}h ${m}m`;
}

function cost(usd: number, budget: BudgetLevel): { usd: number; inr: number } {
  const mult = budget === 'Budget' ? 0.7 : budget === 'Luxury' ? 1.85 : 1;
  const u = Math.max(4, Math.round(usd * mult));
  return { usd: u, inr: Math.round(u * 84.5) };
}

function leg(
  mode: TransitMode,
  label: string,
  fromHub: string,
  toHub: string,
  hours: number,
  km: number,
  usd: number,
  budget: BudgetLevel,
  extra: Partial<JourneyLeg> = {}
): JourneyLeg {
  const c = cost(usd, budget);
  return {
    mode,
    label,
    fromHub,
    toHub,
    durationHours: Math.round(hours * 10) / 10,
    durationLabel: hoursLabel(hours),
    distanceKm: km,
    costUsd: c.usd,
    costInr: c.inr,
    departHint: extra.departHint || 'Depart morning to maximise day-one light.',
    arriveHint: extra.arriveHint || 'Keep the first evening light — no packed sightseeing on arrival.',
    notes: extra.notes || [],
    comfort: extra.comfort || (mode === 'Flight' ? 'Fastest' : mode === 'Train' ? 'Scenic & roomy' : 'Flexible'),
    isRecommended: extra.isRecommended
  };
}

type Named = {
  modes: {
    mode: TransitMode;
    label: string;
    hours: number;
    usd: number;
    fromHub?: string;
    toHub?: string;
    notes?: string[];
    comfort?: string;
  }[];
  lastMile?: string;
};

const NAMED_ROUTES: Record<string, Named> = {
  'new delhi|agra': {
    modes: [
      { mode: 'Train', label: 'Gatimaan Express NDLS → Agra Cantt', hours: 1.2, usd: 18, notes: ['Fastest train in this corridor', 'Book IRCTC 1A/CC a week ahead'] },
      { mode: 'Car', label: 'Yamuna Expressway cab (3.5–4h)', hours: 3.7, usd: 42, notes: ['Best for families with Taj sunrise plan'] },
      { mode: 'Bus', label: 'Idawah / UPSRTC Volvo', hours: 4.5, usd: 8 }
    ],
    lastMile: 'Pre-paid e-rickshaw from Agra Cantt to Taj East Gate (~25 min).'
  },
  'new delhi|jaipur': {
    modes: [
      { mode: 'Train', label: 'Vande Bharat / Shatabdi NDLS → Jaipur', hours: 4.2, usd: 22, notes: ['Double-decker Jan Shatabdi is the budget cousin'] },
      { mode: 'Flight', label: 'DEL → JAI (Indigo/Air India)', hours: 2.8, usd: 55, notes: ['Block 2.5h airport overhead'] },
      { mode: 'Bus', label: 'Delhi–Jaipur Volvo (Dhaula Kuan)', hours: 5.5, usd: 12 }
    ]
  },
  'new delhi|varanasi': {
    modes: [
      { mode: 'Flight', label: 'DEL → VNS (1h 20m airborne)', hours: 3.6, usd: 70 },
      { mode: 'Train', label: 'Vande Bharat NDLS → Banaras', hours: 8.0, usd: 28, notes: ['Daylight Ganga plains — highly recommended'] },
      { mode: 'Train', label: 'Overnight Rajdhani / Mahamana', hours: 12.5, usd: 22, comfort: 'Sleep on the move' }
    ]
  },
  'new delhi|mumbai': {
    modes: [
      { mode: 'Flight', label: 'DEL → BOM (2h airborne, 20+ daily)', hours: 4.5, usd: 85 },
      { mode: 'Train', label: 'Rajdhani / Tejas Mumbai Rajdhani', hours: 16, usd: 40, comfort: 'Overnight sleeper' }
    ]
  },
  'new delhi|goa': {
    modes: [
      { mode: 'Flight', label: 'DEL → GOX Mopa or GOI Dabolim', hours: 4.8, usd: 90 },
      { mode: 'Train', label: 'Rajdhani / Goa Sampark via Madgaon', hours: 26, usd: 35 }
    ]
  },
  'mumbai|goa': {
    modes: [
      { mode: 'Flight', label: 'BOM → GOI / GOX (1h 15m)', hours: 3.4, usd: 55 },
      { mode: 'Train', label: 'Konkan Railway Mandovi / Jan Shatabdi to Madgaon', hours: 9, usd: 18, notes: ['One of India’s most scenic rail lines'] },
      { mode: 'Bus', label: 'Overnight Volvo via NH66', hours: 12, usd: 16 }
    ]
  },
  'mumbai|pune': {
    modes: [
      { mode: 'Train', label: 'Deccan Queen / Intercity CSMT–Pune', hours: 3.2, usd: 8 },
      { mode: 'Car', label: 'Mumbai–Pune Expressway cab', hours: 3.5, usd: 32 },
      { mode: 'Bus', label: 'Shivneri / Neeta Volvo', hours: 4, usd: 7 }
    ]
  },
  'bengaluru|mysuru': {
    modes: [
      { mode: 'Train', label: 'Vande Bharat / Tippu Express SBC–Mysuru', hours: 2.1, usd: 9 },
      { mode: 'Car', label: 'SH-17 / Kengeri–Mysuru highway', hours: 3.2, usd: 28 },
      { mode: 'Bus', label: 'KSRTC Airavat', hours: 3.5, usd: 6 }
    ]
  },
  'bengaluru|hampi': {
    modes: [
      { mode: 'Train', label: 'Overnight Hampi Express to Hosapete', hours: 9.5, usd: 14 },
      { mode: 'Car', label: 'Self-drive via Chitradurga (7–8h)', hours: 8, usd: 55 }
    ],
    lastMile: 'Hosapete Junction auto / hotel pickup to Hampi Bazaar (13 km).'
  },
  'chennai|puducherry': {
    modes: [
      { mode: 'Bus', label: 'ECR Volvo / PRTC Pondy bus', hours: 3.5, usd: 7 },
      { mode: 'Car', label: 'East Coast Road scenic drive', hours: 3.2, usd: 30, notes: ['Stop at Mahabalipuram Shore Temple'] },
      { mode: 'Train', label: 'Chennai Egmore → Puducherry passenger / express', hours: 4, usd: 5 }
    ]
  },
  'chennai|madurai': {
    modes: [
      { mode: 'Train', label: 'Vaigai / Pandian Express', hours: 7.2, usd: 12 },
      { mode: 'Flight', label: 'MAA → IXM (1h 10m)', hours: 3.2, usd: 48 }
    ]
  },
  'kochi|munnar': {
    modes: [
      { mode: 'Car', label: 'Hired Innova via Adimali ghat (4–5h)', hours: 4.6, usd: 40, notes: ['AC bus exists but taxis win with luggage'] },
      { mode: 'Bus', label: 'KSRTC Ernakulam → Munnar', hours: 5.5, usd: 6 }
    ]
  },
  'kochi|alappuzha': {
    modes: [
      { mode: 'Train', label: 'Ernakulam Jn → Alappuzha (1h 15m)', hours: 1.4, usd: 4 },
      { mode: 'Car', label: 'NH66 coastal road', hours: 1.6, usd: 18 },
      { mode: 'Ferry', label: 'Limited backwater public ferry', hours: 3.5, usd: 5, comfort: 'Scenic slow travel' }
    ]
  },
  'kolkata|darjeeling': {
    modes: [
      { mode: 'Flight', label: 'CCU → IXB Bagdogra + 3h shared jeep to Darjeeling', hours: 6.5, usd: 75 },
      { mode: 'Train', label: 'Darjeeling Mail to NJP + toy train / jeep', hours: 12, usd: 22 }
    ],
    lastMile: 'Bagdogra/NJP to Darjeeling Mall is a winding 3-hour Himalayan jeep.'
  },
  'new delhi|manali': {
    modes: [
      { mode: 'Bus', label: 'Overnight Volvo from Kashmere Gate ISBT', hours: 13, usd: 22, notes: ['Atal Tunnel has cut winter delays'] },
      { mode: 'Flight', label: 'DEL → KUU Bhuntar + 1h cab to Manali', hours: 5.5, usd: 85 }
    ]
  },
  'new delhi|leh': {
    modes: [
      { mode: 'Flight', label: 'DEL → IXL (1h 15m; morning flights only)', hours: 4.2, usd: 110, notes: ['Acclimatise 48h in Leh before Khardung La', 'Weather cancellations are common'] }
    ],
    lastMile: 'Prepaid taxi IXL → Leh Main Bazaar (20 min). Do not trek on day one.'
  },
  'new delhi|srinagar': {
    modes: [
      { mode: 'Flight', label: 'DEL → SXR (1h 20m)', hours: 3.8, usd: 80 },
      { mode: 'Bus', label: 'Jammu Tawi rail + NH44 to Srinagar', hours: 16, usd: 25 }
    ]
  },
  'new delhi|rishikesh': {
    modes: [
      { mode: 'Train', label: 'Shatabdi / Vande Bharat to Haridwar + 45 min cab', hours: 5.5, usd: 16 },
      { mode: 'Car', label: 'Delhi–Meerut–Haridwar expressway', hours: 5.5, usd: 38 },
      { mode: 'Bus', label: 'ISBT Kashmere Gate Volvo', hours: 6.5, usd: 10 }
    ]
  },
  'new delhi|amritsar': {
    modes: [
      { mode: 'Train', label: 'Shatabdi / Vande Bharat NDLS → ASR', hours: 5.6, usd: 20 },
      { mode: 'Flight', label: 'DEL → ATQ', hours: 3.2, usd: 55 }
    ]
  },
  'mumbai|udaipur': {
    modes: [
      { mode: 'Flight', label: 'BOM → UDR (1h 20m)', hours: 3.6, usd: 65 },
      { mode: 'Train', label: 'Mewar / Udaipur City express', hours: 15, usd: 22 }
    ]
  },
  'indore|neemuch': {
    modes: [
      { mode: 'Train', label: 'Indore Jn → Neemuch (NMH) express / passenger', hours: 4.8, usd: 8, notes: ['Neemuch has a railway station, not an airport', 'Book IRCTC to NMH — typical 4–6h via Ratlam / Mhow side'] },
      { mode: 'Car', label: 'NH52 cab Indore → Neemuch (~250 km)', hours: 4.5, usd: 32, notes: ['Fastest door-to-door; no flight exists'] },
      { mode: 'Bus', label: 'RedBus / private Volvo Indore → Neemuch', hours: 5.5, usd: 7 }
    ],
    lastMile: 'Autos and local cabs from Neemuch (NMH) station. There is no airport in Neemuch — skip flight search.'
  },
  'indore|nimach': {
    modes: [
      { mode: 'Train', label: 'Indore Jn → Neemuch (NMH)', hours: 4.8, usd: 8 },
      { mode: 'Car', label: 'NH52 cab Indore → Neemuch', hours: 4.5, usd: 32 },
      { mode: 'Bus', label: 'RedBus Indore → Neemuch', hours: 5.5, usd: 7 }
    ],
    lastMile: 'Neemuch station autos. No airport in Neemuch.'
  },
  'ahmedabad|bhuj': {
    modes: [
      { mode: 'Train', label: 'Ala Hazrat / Sayaji overnight to Bhuj', hours: 8, usd: 12 },
      { mode: 'Flight', label: 'AMD → BHJ', hours: 3, usd: 50 }
    ]
  },
  'guwahati|tawang': {
    modes: [
      { mode: 'Car', label: 'Shared Sumo Guwahati → Tezpur → Sela Pass → Tawang (2 days)', hours: 16, usd: 45, notes: ['Inner Line Permit required', 'Break at Bomdila / Dirang'] }
    ]
  },
  'port blair|swaraj dweep': {
    modes: [
      { mode: 'Ferry', label: 'Makruzz / Green Ocean to Havelock (1.5–2.5h)', hours: 2.2, usd: 28, notes: ['Book ferry before the hotel'] }
    ]
  },
  'new delhi|tokyo': {
    modes: [
      { mode: 'Flight', label: 'DEL → NRT/HND (Air India / JAL / ANA, ~8h)', hours: 11.5, usd: 420 }
    ]
  },
  'mumbai|tokyo': {
    modes: [
      { mode: 'Flight', label: 'BOM → NRT/HND via DEL or direct seasonal', hours: 12, usd: 430 }
    ]
  },
  'new delhi|paris': {
    modes: [
      { mode: 'Flight', label: 'DEL → CDG (Air France / Air India, ~9h)', hours: 12.5, usd: 480 }
    ]
  }
};

function namedKey(a: string, b: string): string {
  return `${norm(a)}|${norm(b)}`;
}

function resolveName(raw: string): { city: string; state?: string; country: string } {
  const dest = findDestination(raw);
  if (dest) return { city: dest.city, state: dest.state, country: dest.country };
  return { city: raw.trim() || 'Your City', country: 'India' };
}

function syntheticOptions(
  from: Coord,
  to: Coord,
  origin: ReturnType<typeof resolveName>,
  dest: ReturnType<typeof resolveName>,
  km: number,
  budget: BudgetLevel,
  bothIndia: boolean
): JourneyLeg[] {
  const fromHub = from.airport || from.station || `${origin.city} centre`;
  const toHub = to.airport || to.station || `${dest.city} centre`;
  const options: JourneyLeg[] = [];

  if (km < 8) {
    options.push(leg('Walk', `Local hop inside ${dest.city}`, origin.city, dest.city, 0.4, km, 0, budget, { notes: ['You are already on the ground'] }));
    return options;
  }

  if (km < 90 && bothIndia) {
    options.push(
      leg('Car', `App cab / hired car ${origin.city} → ${dest.city}`, origin.city, dest.city, km / 42, km, km * 0.12, budget, {
        notes: ['Best door-to-door for this short hop'],
        comfort: 'Door to door'
      })
    );
    options.push(leg('Bus', `State / private bus ${origin.city} → ${dest.city}`, from.station || origin.city, to.station || dest.city, km / 35, km, km * 0.025, budget));
  } else if (bothIndia && km < 280) {
    options.push(
      leg('Train', `Intercity / Vande Bharat ${origin.city} → ${dest.city}`, from.station || origin.city, to.station || dest.city, Math.max(2, km / 65) + 0.5, km, 6 + km * 0.02, budget, {
        notes: ['Check IRCTC for Vande Bharat / Shatabdi on this corridor']
      })
    );
    options.push(leg('Car', `Highway cab ${origin.city} → ${dest.city}`, origin.city, dest.city, km / 48, km, km * 0.11, budget));
    options.push(leg('Bus', `Volvo / sleeper ${origin.city} → ${dest.city}`, origin.city, dest.city, km / 40, km, km * 0.022, budget));
  } else if (bothIndia && km < 900) {
    options.push(
      leg('Train', `Day or overnight express ${origin.city} → ${dest.city}`, from.station || origin.city, to.station || dest.city, Math.max(5, km / 60) + 0.8, km, 10 + km * 0.018, budget, {
        notes: ['Prefer overnight 2A/3A to save a hotel night']
      })
    );
    if (flightViable(from, to, km, bothIndia)) {
      options.push(
        leg('Flight', `${from.airport} → ${to.airport}`, from.airport as string, to.airport as string, km / 720 + 2.6, km, 40 + km * 0.06, budget, {
          notes: ['Add 2.5h for airports and security']
        })
      );
    }
    options.push(leg('Bus', `Overnight Volvo ${origin.city} → ${dest.city}`, origin.city, dest.city, km / 42, km, km * 0.02, budget));
  } else {
    if (flightViable(from, to, km, bothIndia) || (!bothIndia && hasLocalAirport(from) && hasLocalAirport(to))) {
      const flightHours = km / 780 + (bothIndia ? 2.6 : 3.4);
      options.push(
        leg('Flight', `${from.airport} → ${to.airport}`, from.airport as string, to.airport as string, flightHours, km, bothIndia ? 55 + km * 0.05 : 180 + km * 0.08, budget, {
          notes: bothIndia
            ? ['Book 3–4 weeks out on IndiGo / Air India for best fares']
            : ['International — check visa, e-ticket, and 3h check-in']
        })
      );
    }
    if (bothIndia) {
      options.push(
        leg('Train', `Express / sleeper ${origin.city} → ${dest.city}`, from.station || origin.city, to.station || dest.city, km / 55 + 1.5, km, 18 + km * 0.012, budget, {
          comfort: 'Overnight sleeper',
          notes: hasLocalAirport(to) ? [] : [`${dest.city} has no commercial airport — train or road only.`]
        })
      );
      options.push(
        leg('Bus', `Volvo / sleeper ${origin.city} → ${dest.city}`, origin.city, dest.city, km / 42, km, km * 0.02, budget)
      );
      options.push(
        leg('Car', `Highway cab ${origin.city} → ${dest.city}`, origin.city, dest.city, km / 48, km, km * 0.11, budget)
      );
    } else if (!options.length) {
      options.push(
        leg('Car', `Overland ${origin.city} → ${dest.city}`, origin.city, dest.city, km / 50, km, km * 0.1, budget)
      );
    }
  }

  return options;
}

export function planJourney(originRaw: string, destRaw: string, budget: BudgetLevel = 'Moderate'): JourneyPlan {
  const origin = resolveName(originRaw || 'New Delhi');
  const dest = resolveName(destRaw || 'Jaipur');
  const unknownPin = (label: string): Coord => ({ lat: 23.2599, lng: 77.4126, station: `${label} station` });
  const from = lookupCoords(origin.city) || lookupCoords(originRaw) || unknownPin(origin.city);
  const to = lookupCoords(dest.city) || lookupCoords(destRaw) || unknownPin(dest.city);
  const km = Math.max(1, haversineKm(from, to));
  const bothIndia = origin.country === 'India' && dest.country === 'India';
  const sameCity = norm(origin.city) === norm(dest.city) || km < 12;

  const key = namedKey(origin.city, dest.city);
  const reverseKey = namedKey(dest.city, origin.city);
  const named = NAMED_ROUTES[key] || NAMED_ROUTES[namedKey(originRaw, destRaw)] || NAMED_ROUTES[namedKey(norm(originRaw), norm(destRaw))];

  let options: JourneyLeg[] = [];
  let lastMile = hasLocalAirport(to)
    ? `Airport/station prepaid taxi into ${dest.city} (20–45 min). Keep the hotel address in local script.`
    : `Station / bus-stand taxi into ${dest.city}. ${dest.city} has no commercial airport — use train, bus, or cab.`;

  if (sameCity) {
    options = [
      leg('Walk', `You are already in ${dest.city}`, origin.city, dest.city, 0.3, km, 0, budget, {
        notes: ['Skip transit — start clustering from your hotel neighbourhood'],
        comfort: 'No transit needed'
      })
    ];
    lastMile = 'Check in and walk — this is a staycation / same-city plan.';
  } else if (named) {
    options = named.modes
      .filter((m) => m.mode !== 'Flight' || flightViable(from, to, km, bothIndia))
      .map((m, idx) =>
        leg(
          m.mode,
          m.label,
          m.fromHub || (m.mode === 'Flight' ? from.airport : from.station) || origin.city,
          m.toHub || (m.mode === 'Flight' ? to.airport : to.station) || dest.city,
          m.hours,
          km,
          m.usd,
          budget,
          { notes: m.notes, comfort: m.comfort, isRecommended: idx === 0 }
        )
      );
    if (named.lastMile) lastMile = named.lastMile;
  } else {
    options = syntheticOptions(from, to, origin, dest, km, budget, bothIndia);
  }

  if (!options.length) {
    options = syntheticOptions(from, to, origin, dest, km, budget, bothIndia);
  }

  options = options.filter((o) => o.mode !== 'Flight' || flightViable(from, to, km, bothIndia) || (!bothIndia && hasLocalAirport(from) && hasLocalAirport(to)));
  if (!options.length) {
    options = [
      leg('Car', `Highway cab ${origin.city} → ${dest.city}`, origin.city, dest.city, Math.max(2, km / 48), km, Math.max(12, km * 0.11), budget, {
        notes: hasLocalAirport(to) ? [] : [`No commercial airport in ${dest.city}.`]
      })
    ];
  }
  options = options.map((o, i) => ({ ...o, isRecommended: i === 0 }));
  const outbound = options[0];
  const alternatives = options.slice(1, 3);

  // Return: reuse outbound with swapped hubs, slight fare bump
  const returnLeg: JourneyLeg = {
    ...outbound,
    label: outbound.label.includes('→')
      ? outbound.label.replace(/→/g, '←').replace(`${origin.city} ← ${dest.city}`, `${dest.city} → ${origin.city}`)
      : `Return ${dest.city} → ${origin.city} via ${outbound.mode}`,
    fromHub: outbound.toHub,
    toHub: outbound.fromHub,
    departHint: 'Pad a 3-hour buffer before any international flight home.',
    arriveHint: `Land back in ${origin.city} — keep the last evening free of meetings.`,
    isRecommended: true
  };

  // Reverse named route if we only had reverse stored
  if (!named && NAMED_ROUTES[reverseKey] && !sameCity) {
    const rev = NAMED_ROUTES[reverseKey].modes[0];
    if (rev) {
      Object.assign(returnLeg, {
        mode: rev.mode,
        label: rev.label,
        durationHours: rev.hours,
        durationLabel: hoursLabel(rev.hours),
        costUsd: cost(rev.usd, budget).usd,
        costInr: cost(rev.usd, budget).inr
      });
    }
  }

  const offersFlight = [outbound, ...alternatives].some((o) => o.mode === 'Flight');
  const bookingTips = bothIndia
    ? [
        'Trains: book IRCTC / ConfirmTkt 60–120 days out for 2A/Vande Bharat.',
        ...(offersFlight
          ? ['Flights: Tue–Wed departures on IndiGo / Air India are usually cheapest.']
          : !hasLocalAirport(to)
            ? [`${dest.city} has no commercial airport — book IRCTC trains or RedBus. Do not search flights to ${dest.city}.`]
            : [`This hop is too short for a flight after airport time — train (IRCTC) or bus (RedBus) is faster.`]),
        'UPI works almost everywhere; still carry ₹500 in small notes for autos.',
        `Tell drivers you are going from ${origin.city} to ${dest.city} — save the pin.`
      ]
    : [
        'Check visa / e-visa lead times before locking non-refundable fares.',
        'Arrive at international check-in 3 hours early.',
        'Download offline maps of both cities before you lose roaming.'
      ];

  if (norm(dest.city) === 'leh' || norm(dest.city) === 'kaza' || norm(dest.city) === 'tawang') {
    bookingTips.unshift('High altitude: no trekking or alcohol for 36–48 hours after arrival.');
  }

  return {
    originCity: origin.city,
    originState: origin.state,
    originCountry: origin.country,
    destinationCity: dest.city,
    destinationState: dest.state,
    destinationCountry: dest.country,
    distanceKm: km,
    sameCity,
    outbound,
    alternatives,
    returnLeg,
    lastMile,
    bookingTips,
    totalTransitUsd: outbound.costUsd + returnLeg.costUsd,
    totalTransitInr: outbound.costInr + returnLeg.costInr
  };
}
