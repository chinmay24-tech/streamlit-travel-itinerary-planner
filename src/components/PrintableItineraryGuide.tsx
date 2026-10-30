'use client';

import React from 'react';
import { FullItinerary } from '@/types/travel';

interface PrintableItineraryGuideProps {
  itinerary: FullItinerary | null;
  currency: 'USD' | 'INR';
}

export const PrintableItineraryGuide: React.FC<PrintableItineraryGuideProps> = ({
  itinerary,
  currency
}) => {
  if (!itinerary) return null;

  const totalCostDisplay = currency === 'INR'
    ? `₹${itinerary.totalCostInr.toLocaleString('en-IN')}`
    : `$${itinerary.totalCostUsd}`;

  return (
    <div className="print-only p-8 text-black bg-white">
      {/* Cover / Header */}
      <div className="border-b-2 border-slate-900 pb-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-xs font-bold tracking-widest uppercase text-slate-500 mb-1">
              Personalized Travel Itinerary Guide
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              {itinerary.title}
            </h1>
            <p className="text-sm font-semibold text-slate-700 mt-1">
              {itinerary.originCity ? `${itinerary.originCity} → ` : ''}
              {itinerary.destination}, {itinerary.country} • {itinerary.startDate} to {itinerary.endDate}
            </p>
          </div>

          <div className="text-right border-l-2 border-slate-200 pl-4">
            <span className="text-xs uppercase font-bold text-slate-400">Total Budget</span>
            <div className="text-2xl font-black text-slate-900">{totalCostDisplay}</div>
            <div className="text-xs text-slate-500">
              {itinerary.localCurrencySymbol}{itinerary.totalCostLocal.toLocaleString()} {itinerary.localCurrencyCode}
            </div>
          </div>
        </div>

        {itinerary.journey && !itinerary.journey.sameCity && (
          <div className="mt-4 p-3 border border-slate-400 rounded-lg text-xs">
            <div className="font-black uppercase tracking-wider text-slate-700 mb-1">Getting there</div>
            <p className="font-bold">
              {itinerary.journey.originCity} → {itinerary.journey.destinationCity} · {itinerary.journey.distanceKm} km
            </p>
            <p>
              Recommended: {itinerary.journey.outbound.mode} — {itinerary.journey.outbound.label} ({itinerary.journey.outbound.durationLabel}, ${itinerary.journey.outbound.costUsd} / ₹{itinerary.journey.outbound.costInr})
            </p>
            <p>Hubs: {itinerary.journey.outbound.fromHub} → {itinerary.journey.outbound.toHub}</p>
            <p>Last mile: {itinerary.journey.lastMile}</p>
            <p>
              Return: {itinerary.journey.returnLeg.mode} {itinerary.journey.destinationCity} → {itinerary.journey.originCity} ({itinerary.journey.returnLeg.durationLabel})
            </p>
          </div>
        )}

        {/* Travel Metadata Pills */}
        <div className="flex flex-wrap gap-2 mt-4 text-xs font-semibold text-slate-600">
          <span className="bg-slate-100 px-2.5 py-1 rounded">Vibe: {itinerary.vibe}</span>
          <span className="bg-slate-100 px-2.5 py-1 rounded">Budget Tier: {itinerary.budgetLevel}</span>
          <span className="bg-slate-100 px-2.5 py-1 rounded">Party: {itinerary.travelParty}</span>
          <span className="bg-slate-100 px-2.5 py-1 rounded">Pace: {itinerary.pace}</span>
        </div>
      </div>

      {/* Emergency Contacts & Protocol */}
      <div className="mb-6 p-4 border border-rose-400 bg-rose-50/20 rounded-xl break-inside-avoid">
        <h2 className="text-sm font-black uppercase tracking-wider text-rose-900 mb-2">
          🚨 Critical Emergency Contacts & Local Assistance ({itinerary.destination})
        </h2>
        <div className="grid grid-cols-2 gap-4 text-xs text-slate-800">
          <div>
            <p><b>Police / Primary Emergency:</b> {itinerary.emergencyContacts.police}</p>
            <p><b>Ambulance / Medical Emergency:</b> {itinerary.emergencyContacts.ambulance}</p>
            <p><b>Tourist Police Helpline:</b> {itinerary.emergencyContacts.touristPolice}</p>
          </div>
          <div>
            <p><b>Nearest English Hospital:</b> {itinerary.emergencyContacts.nearestMedicalHub}</p>
            <p><b>Consular Protocol:</b> {itinerary.emergencyContacts.embassyNotice}</p>
            <p><b>International Dial Code:</b> {itinerary.emergencyContacts.internationalDialCode}</p>
          </div>
        </div>
      </div>

      {/* Day by Day Clustered Itinerary */}
      <div className="space-y-6">
        <h2 className="text-lg font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-2">
          🗺️ Day-by-Day Clustered Schedule
        </h2>

        {itinerary.days.map((day) => {
          const dayCost = currency === 'INR'
            ? `₹${day.dailyCostInr.toLocaleString('en-IN')}`
            : `$${day.dailyCostUsd}`;

          return (
            <div key={day.dayNumber} className="border border-slate-300 rounded-xl p-4 break-inside-avoid page-break-auto">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2 mb-3">
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Day {day.dayNumber}: {day.theme}
                  </h3>
                  <p className="text-xs font-semibold text-sky-800">
                    Cluster: {day.geographicCluster.clusterName} ({day.geographicCluster.hubArea})
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-slate-900">{dayCost}</span>
                  <p className="text-[10px] text-slate-500">Day Total</p>
                </div>
              </div>

              {/* Geographic Advantage note */}
              <div className="bg-slate-50 p-2 rounded text-xs text-slate-700 mb-3 italic">
                <b>Geographic Advantage:</b> {day.geographicCluster.transitAdvantage} (Walking radius: ~{day.geographicCluster.walkingRadiusKm}km)
              </div>

              {/* 4 sequential slots */}
              <div className="space-y-2 text-xs">
                {/* Morning */}
                <div className="border-l-2 border-amber-500 pl-3 py-1">
                  <div className="flex justify-between font-bold">
                    <span>🌅 Morning ({day.slots.morning.timeSlot}): {day.slots.morning.title}</span>
                    <span>${day.slots.morning.estimatedCostUsd}</span>
                  </div>
                  <p className="text-slate-600 mt-0.5">{day.slots.morning.description}</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">💡 Tip: {day.slots.morning.insiderTip}</p>
                </div>

                {/* Lunch */}
                <div className="border-l-2 border-emerald-500 pl-3 py-1">
                  <div className="flex justify-between font-bold">
                    <span>🍴 Lunch ({day.slots.lunch.timeSlot}): {day.slots.lunch.title}</span>
                    <span>${day.slots.lunch.estimatedCostUsd}</span>
                  </div>
                  <p className="text-slate-600 mt-0.5">{day.slots.lunch.description}</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">💡 Tip: {day.slots.lunch.insiderTip}</p>
                </div>

                {/* Afternoon */}
                <div className="border-l-2 border-sky-500 pl-3 py-1">
                  <div className="flex justify-between font-bold">
                    <span>🏛️ Afternoon ({day.slots.afternoon.timeSlot}): {day.slots.afternoon.title}</span>
                    <span>${day.slots.afternoon.estimatedCostUsd}</span>
                  </div>
                  <p className="text-slate-600 mt-0.5">{day.slots.afternoon.description}</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">💡 Tip: {day.slots.afternoon.insiderTip}</p>
                </div>

                {/* Evening */}
                <div className="border-l-2 border-purple-500 pl-3 py-1">
                  <div className="flex justify-between font-bold">
                    <span>🌙 Evening ({day.slots.evening.timeSlot}): {day.slots.evening.title}</span>
                    <span>${day.slots.evening.estimatedCostUsd}</span>
                  </div>
                  <p className="text-slate-600 mt-0.5">{day.slots.evening.description}</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">💡 Tip: {day.slots.evening.insiderTip}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {itinerary.hotels && itinerary.hotels.length > 0 && (
        <div className="mt-6 pt-4 border-t border-slate-300 break-inside-avoid">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Hotel options</h3>
          {itinerary.hotels.map((h) => (
            <p key={h.id} className="text-xs text-slate-700">
              • {h.name} ({h.tier}) — {h.area} · ${h.nightlyUsd}/night · {h.why}
            </p>
          ))}
        </div>
      )}
      {itinerary.restaurants && itinerary.restaurants.length > 0 && (
        <div className="mt-4 break-inside-avoid">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Food & restaurants</h3>
          {itinerary.restaurants.map((r) => (
            <p key={r.id} className="text-xs text-slate-700">
              • {r.name} — {r.cuisine} ({r.area}) · {r.signature}
            </p>
          ))}
        </div>
      )}

      {/* Packing Checklist */}
      <div className="mt-6 pt-4 border-t border-slate-300 break-inside-avoid">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          🎒 Offline Packing Checklist
        </h3>
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
          {itinerary.packingChecklist.map((item, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <span>[ ]</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-slate-200 text-center text-[10px] text-slate-400">
        Generated by ItineryPlanner • Safe travels!
      </div>
    </div>
  );
};
