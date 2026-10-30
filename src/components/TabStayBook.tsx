'use client';

import React from 'react';
import { BedDouble, Utensils, MapPin, Train, Plane, Bus, Car, ExternalLink } from 'lucide-react';
import { FullItinerary } from '@/types/travel';
import { BookingChips } from './BookingChips';

interface TabStayBookProps {
  itinerary: FullItinerary | null;
  currency: 'USD' | 'INR';
}

export const TabStayBook: React.FC<TabStayBookProps> = ({ itinerary, currency }) => {
  if (!itinerary) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-sm text-slate-500">
        Generate an itinerary first to see hotels, restaurants, and ticket links.
      </div>
    );
  }

  const hotels = itinerary.hotels || [];
  const restaurants = itinerary.restaurants || [];
  const journey = itinerary.journey;
  const legs = journey && !journey.sameCity
    ? [journey.outbound, ...journey.alternatives]
    : [];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-rose-800 via-orange-700 to-slate-900 text-white rounded-2xl p-6">
        <h2 className="text-2xl font-extrabold tracking-tight">Stay, eat & book tickets</h2>
        <p className="text-sm text-orange-100 mt-1">
          {itinerary.originCity ? `${itinerary.originCity} → ` : ''}
          {itinerary.destination} · Open Maps, IRCTC, RedBus, MakeMyTrip, Booking.com in a new tab.
        </p>
      </div>

      {journey && !journey.sameCity && (
        <section className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Train className="w-4 h-4 text-sky-600" />
            Travelling options · {journey.originCity} → {journey.destinationCity}
          </h3>
          {journey.mapsDirectionsUrl && (
            <a
              href={journey.mapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 hover:text-sky-900"
            >
              <MapPin className="w-3.5 h-3.5" />
              Open full route on Google Maps
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {legs.map((leg, idx) => {
              const Icon = leg.mode === 'Flight' ? Plane : leg.mode === 'Train' ? Train : leg.mode === 'Bus' ? Bus : Car;
              const price = currency === 'INR' ? `₹${leg.costInr.toLocaleString('en-IN')}` : `$${leg.costUsd}`;
              return (
                <div key={`${leg.mode}-${idx}`} className="rounded-xl border border-slate-200 p-3 bg-slate-50/60">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black flex items-center gap-1">
                      <Icon className="w-3.5 h-3.5 text-sky-600" />
                      {leg.mode}
                    </span>
                    <span className="text-xs font-bold">{price}</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-900 mt-1">{leg.label}</p>
                  <p className="text-[11px] text-slate-500">{leg.durationLabel} · {leg.fromHub} → {leg.toHub}</p>
                  <BookingChips links={leg.bookingLinks} />
                </div>
              );
            })}
          </div>
          {journey.returnLeg && (
            <div className="rounded-xl border border-slate-200 p-3">
              <p className="text-xs font-bold text-slate-800">
                Return · {journey.returnLeg.mode} {journey.destinationCity} → {journey.originCity} ({journey.returnLeg.durationLabel})
              </p>
              <BookingChips links={journey.returnLeg.bookingLinks} />
            </div>
          )}
        </section>
      )}

      <section className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
        <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
          <BedDouble className="w-4 h-4 text-rose-600" />
          Hotel stay options in {itinerary.destination}
        </h3>
        <p className="text-xs text-slate-500">Nightly estimates for {itinerary.durationDays} days. Book on Booking.com, MakeMyTrip, Agoda, or Google Hotels.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {hotels.map((h) => {
            const night = currency === 'INR' ? `₹${h.nightlyInr.toLocaleString('en-IN')}` : `$${h.nightlyUsd}`;
            const total = currency === 'INR' ? `₹${h.totalInr.toLocaleString('en-IN')}` : `$${h.totalUsd}`;
            return (
              <div key={h.id} className="rounded-xl border border-slate-200 p-4 flex flex-col justify-between bg-slate-50/40">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-extrabold text-slate-900 leading-snug">{h.name}</h4>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-900 text-white">{h.tier}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{h.area}</p>
                  <p className="text-xs text-slate-600 mt-2">{h.why}</p>
                  <p className="text-[11px] text-slate-500 mt-1">{h.amenities.join(' · ')}</p>
                </div>
                <div className="mt-3">
                  <p className="text-sm font-black text-slate-900">
                    {night} <span className="text-[11px] font-medium text-slate-500">/ night</span>
                  </p>
                  <p className="text-[11px] text-slate-500">{h.nights} nights · {total}</p>
                  <BookingChips links={h.bookingLinks} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
        <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
          <Utensils className="w-4 h-4 text-amber-600" />
          Best food & restaurants
        </h3>
        <p className="text-xs text-slate-500">Open in Google Maps, Zomato, or EazyDiner to check tables and reviews.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {restaurants.map((r) => (
            <div key={r.id} className="rounded-xl border border-slate-200 p-4 bg-white">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">{r.name}</h4>
                  <p className="text-[11px] text-slate-500">
                    {r.cuisine} · {r.area} · {r.meal}
                  </p>
                </div>
                {r.vegFriendly && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                    Veg-friendly
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 mt-2">Must try: {r.signature}</p>
              <p className="text-[11px] font-bold text-slate-800 mt-1">
                {currency === 'INR'
                  ? `₹${r.priceForTwoInr.toLocaleString('en-IN')} for two`
                  : `≈ $${Math.round(r.priceForTwoInr / 84.5)} for two (₹${r.priceForTwoInr.toLocaleString('en-IN')})`}
              </p>
              <BookingChips links={r.bookingLinks} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
