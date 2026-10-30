import { BookingLink, JourneyLeg, TransitMode } from '@/types/travel';

export function mapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function mapsDirectionsUrl(origin: string, destination: string, mode: 'transit' | 'driving' | 'walking' = 'transit'): string {
  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=${mode}`;
}

function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function irctcCity(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('delhi') || n.includes('noida') || n.includes('gurugram') || n.includes('gurgaon')) return 'New Delhi';
  if (n.includes('mumbai') || n.includes('bombay')) return 'Mumbai';
  if (n.includes('bengaluru') || n.includes('bangalore')) return 'KSR Bengaluru';
  if (n.includes('goa') || n.includes('panaji') || n.includes('panjim')) return 'Madgaon';
  if (n.includes('varanasi') || n.includes('banaras')) return 'Varanasi';
  return name.replace(/\(.*?\)/g, '').trim();
}

function formatRedbusDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dd = String(d.getDate()).padStart(2, '0');
  return `${dd}-${months[d.getMonth()]}-${d.getFullYear()}`;
}

function formatMmtDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${d.getFullYear()}`;
}

export function hotelBookingLinks(city: string, hotelName: string, checkin: string, checkout: string): BookingLink[] {
  const q = `${hotelName} ${city}`;
  const ss = encodeURIComponent(city);
  const hotelQ = encodeURIComponent(hotelName);
  return [
    {
      label: 'Google Maps',
      partner: 'maps',
      url: mapsSearchUrl(q)
    },
    {
      label: 'Booking.com',
      partner: 'booking',
      url: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(q)}&checkin=${checkin}&checkout=${checkout}`
    },
    {
      label: 'MakeMyTrip',
      partner: 'mmt',
      url: `https://www.makemytrip.com/hotels/${slug(city)}-hotels.html`
    },
    {
      label: 'Agoda',
      partner: 'agoda',
      url: `https://www.agoda.com/search?textToSearch=${hotelQ}&checkIn=${checkin}&los=1`
    },
    {
      label: 'Google Hotels',
      partner: 'google-hotels',
      url: `https://www.google.com/travel/search?q=${encodeURIComponent('hotels in ' + city + ' ' + hotelName)}`
    },
    {
      label: 'Airbnb',
      partner: 'airbnb',
      url: `https://www.airbnb.co.in/s/${encodeURIComponent(city)}/homes?checkin=${checkin}&checkout=${checkout}`
    }
  ];
}

export function restaurantBookingLinks(city: string, restaurant: string): BookingLink[] {
  const q = `${restaurant} ${city}`;
  const zomatoCity = slug(city).replace('new-delhi', 'ncr').replace('bengaluru', 'bangalore').replace('mumbai', 'mumbai');
  return [
    { label: 'Google Maps', partner: 'maps', url: mapsSearchUrl(q) },
    { label: 'Zomato', partner: 'zomato', url: `https://www.zomato.com/${zomatoCity}/restaurants?q=${encodeURIComponent(restaurant)}` },
    { label: 'EazyDiner', partner: 'eazydiner', url: `https://www.eazydiner.com/search?query=${encodeURIComponent(q)}` },
    { label: 'Google', partner: 'google', url: `https://www.google.com/search?q=${encodeURIComponent(q + ' menu reservation')}` }
  ];
}

export function travelBookingLinks(
  mode: TransitMode,
  origin: string,
  destination: string,
  dateIso: string
): BookingLink[] {
  const from = irctcCity(origin);
  const to = irctcCity(destination);
  const redbusFrom = slug(from);
  const redbusTo = slug(to);
  const rbDate = formatRedbusDate(dateIso);
  const mmtDate = formatMmtDate(dateIso);
  const mapsMode = mode === 'Car' || mode === 'Walk' ? 'driving' : mode === 'Flight' ? 'transit' : 'transit';

  const links: BookingLink[] = [
    {
      label: 'Google Maps',
      partner: 'maps',
      url: mapsDirectionsUrl(origin, destination, mapsMode as any)
    }
  ];

  if (mode === 'Train') {
    links.push(
      { label: 'IRCTC', partner: 'irctc', url: 'https://www.irctc.co.in/nget/train-search' },
      {
        label: 'ConfirmTkt',
        partner: 'confirmtkt',
        url: `https://www.confirmtkt.com/train-list/${encodeURIComponent(from)}/${encodeURIComponent(to)}`
      },
      {
        label: 'Ixigo Trains',
        partner: 'ixigo',
        url: `https://www.ixigo.com/search/result/train/${encodeURIComponent(from)}/${encodeURIComponent(to)}/${dateIso.replace(/-/g, '')}/1/0/0/ALL`
      },
      {
        label: 'MakeMyTrip Trains',
        partner: 'mmt',
        url: `https://www.makemytrip.com/railways/listing?fromCity=${encodeURIComponent(from)}&toCity=${encodeURIComponent(to)}&deptDate=${dateIso}`
      }
    );
  }

  if (mode === 'Bus') {
    links.push(
      {
        label: 'RedBus',
        partner: 'redbus',
        url: `https://www.redbus.in/bus-tickets/${redbusFrom}-to-${redbusTo}${rbDate ? `?onward=${rbDate}` : ''}`
      },
      {
        label: 'AbhiBus',
        partner: 'abhibus',
        url: `https://www.abhibus.com/bus-tickets/${redbusFrom}-to-${redbusTo}`
      },
      {
        label: 'MakeMyTrip Bus',
        partner: 'mmt',
        url: `https://www.makemytrip.com/bus-tickets/${redbusFrom}-to-${redbusTo}-bus-tickets.html`
      },
      { label: 'IRCTC Bus', partner: 'irctc-bus', url: 'https://www.irctc.co.in/nget/bus/train-search' }
    );
  }

  if (mode === 'Flight') {
    links.push(
      {
        label: 'Google Flights',
        partner: 'gflights',
        url: `https://www.google.com/travel/flights?q=${encodeURIComponent(`Flights from ${origin} to ${destination} on ${dateIso}`)}`
      },
      {
        label: 'MakeMyTrip Flights',
        partner: 'mmt',
        url: `https://www.makemytrip.com/flight/search?itinerary=${encodeURIComponent(from)}-${encodeURIComponent(to)}-${mmtDate}&tripType=O&paxType=A-1_C-0_I-0&intl=false`
      },
      {
        label: 'Goibibo',
        partner: 'goibibo',
        url: `https://www.goibibo.com/flights/`
      },
      {
        label: 'Cleartrip',
        partner: 'cleartrip',
        url: `https://www.cleartrip.com/flights`
      }
    );
  }

  if (mode === 'Car' || mode === 'Walk') {
    links.push(
      {
        label: 'Uber',
        partner: 'uber',
        url: `https://m.uber.com/looking?pickup=${encodeURIComponent(origin)}&drop[0]=${encodeURIComponent(destination)}`
      },
      { label: 'Ola', partner: 'ola', url: 'https://www.olacabs.com/' },
      {
        label: 'Savaari Cab',
        partner: 'savaari',
        url: `https://www.savaari.com/`
      }
    );
  }

  if (mode === 'Ferry') {
    links.push(
      { label: 'MakeMyTrip', partner: 'mmt', url: `https://www.makemytrip.com/` },
      { label: 'Google Search ferries', partner: 'google', url: `https://www.google.com/search?q=${encodeURIComponent(origin + ' to ' + destination + ' ferry tickets')}` }
    );
  }

  return links;
}

export function attachLegBookingLinks(leg: JourneyLeg, origin: string, destination: string, dateIso: string): JourneyLeg {
  return {
    ...leg,
    bookingLinks: travelBookingLinks(leg.mode, origin, destination, dateIso)
  };
}
