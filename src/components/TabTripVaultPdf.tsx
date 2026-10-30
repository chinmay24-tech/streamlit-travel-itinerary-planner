'use client';

import React from 'react';
import {
  Printer,
  FileDown,
  ShieldAlert,
  PhoneCall,
  Hospital,
  Luggage,
  Trash2,
  FolderOpen,
  Calendar,
  Coins,
  CheckSquare,
  AlertTriangle,
  Building,
  Clock,
  Sparkles
} from 'lucide-react';
import { FullItinerary } from '@/types/travel';

interface TabTripVaultPdfProps {
  currentItinerary: FullItinerary | null;
  savedTrips: any[];
  onLoadTrip: (trip: any) => void;
  onDeleteTrip: (tripId: number) => void;
  onPrintPdf: () => void;
  currency: 'USD' | 'INR';
}

export const TabTripVaultPdf: React.FC<TabTripVaultPdfProps> = ({
  currentItinerary,
  savedTrips,
  onLoadTrip,
  onDeleteTrip,
  onPrintPdf,
  currency
}) => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 text-teal-300 text-xs font-bold backdrop-blur-xs border border-white/10">
            <Printer className="w-3.5 h-3.5" />
            <span>Trip vault & offline PDF export</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Offline Travel Guide & Trip History Vault
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Save multiple itineraries to PostgreSQL, review past trips, and generate a printable offline PDF guide with critical emergency contacts.
          </p>
        </div>

        {currentItinerary && (
          <button
            onClick={onPrintPdf}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white font-extrabold text-xs sm:text-sm flex items-center space-x-2 shadow-lg shadow-sky-500/20 transition cursor-pointer shrink-0"
          >
            <Printer className="w-4 h-4" />
            <span>1-Click Export Offline PDF</span>
          </button>
        )}
      </div>

      {/* Emergency Contacts & Packing Checklist for Current Itinerary */}
      {currentItinerary && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Emergency Contacts Checklist */}
          <div className="bg-white rounded-2xl border border-rose-200/90 p-5 shadow-xs space-y-3">
            <div className="flex items-center space-x-2 text-rose-700 font-bold text-sm">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <h3>Emergency Contact Checklist ({currentItinerary.destination})</h3>
            </div>
            <p className="text-xs text-slate-500">
              Essential emergency hotlines verified for offline readiness.
            </p>

            <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs">
              <div className="bg-rose-50/60 rounded-xl p-3 border border-rose-100">
                <span className="text-[10px] uppercase font-bold text-rose-700">Police / Emergency</span>
                <p className="text-base font-black text-rose-950 mt-0.5">
                  {currentItinerary.emergencyContacts.police}
                </p>
              </div>

              <div className="bg-rose-50/60 rounded-xl p-3 border border-rose-100">
                <span className="text-[10px] uppercase font-bold text-rose-700">Ambulance / Medical</span>
                <p className="text-base font-black text-rose-950 mt-0.5">
                  {currentItinerary.emergencyContacts.ambulance}
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 col-span-2">
                <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
                  <PhoneCall className="w-3 h-3 text-sky-600" />
                  Tourist Assistance Line
                </span>
                <p className="text-xs font-bold text-slate-800 mt-0.5">
                  {currentItinerary.emergencyContacts.touristPolice}
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 col-span-2">
                <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
                  <Hospital className="w-3 h-3 text-emerald-600" />
                  Nearest International Medical Center
                </span>
                <p className="text-xs font-medium text-slate-800 mt-0.5">
                  {currentItinerary.emergencyContacts.nearestMedicalHub}
                </p>
              </div>

              <div className="bg-amber-50 rounded-xl p-3 border border-amber-200 col-span-2 text-[11px] text-amber-900">
                <span className="font-bold">Consular Protocol: </span>
                <span>{currentItinerary.emergencyContacts.embassyNotice}</span>
              </div>
            </div>
          </div>

          {/* Packing & Departure Checklist */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center space-x-2 text-indigo-700 font-bold text-sm">
              <Luggage className="w-4 h-4 text-indigo-600" />
              <h3>Offline Travel Packing Checklist</h3>
            </div>
            <p className="text-xs text-slate-500">
              Personalized packing essentials curated for {currentItinerary.vibe} travel in {currentItinerary.destination}.
            </p>

            <ul className="space-y-2 pt-1">
              {currentItinerary.packingChecklist.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start space-x-2.5 text-xs text-slate-700 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100"
                >
                  <CheckSquare className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Saved Trips Vault Section (PostgreSQL Database persistence) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-sky-600" />
              <span>Trip Vault (Database Persistence)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Simulated & PostgreSQL storage saving itineraries with full day structures and clusters.
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            {savedTrips.length} Saved {savedTrips.length === 1 ? 'Trip' : 'Trips'}
          </span>
        </div>

        {savedTrips.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            No saved itineraries in vault yet. Generate a trip and click "Save to Trip Vault" to store it here.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedTrips.map((trip) => {
              const tripCost = currency === 'INR'
                ? `₹${(trip.totalCostInr || 0).toLocaleString('en-IN')}`
                : `$${trip.totalCostUsd || 0}`;

              return (
                <div
                  key={trip.id}
                  className="bg-slate-50/80 border border-slate-200/90 rounded-xl p-4 flex flex-col justify-between hover:border-slate-300 transition shadow-2xs space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-bold text-sky-700 bg-sky-100/70 px-2 py-0.5 rounded">
                        {trip.vibe || 'Travel'}
                      </span>
                      <span className="text-slate-400">
                        {trip.createdAt ? new Date(trip.createdAt).toLocaleDateString() : 'Saved'}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-slate-900 text-sm">
                      {trip.title || `${trip.destination} Trip`}
                    </h4>

                    <p className="text-xs text-slate-500 mt-1">
                      {trip.originCity || trip.itinerary?.originCity
                        ? `${trip.originCity || trip.itinerary.originCity} → `
                        : ''}
                      {trip.destination} • {trip.durationDays} Days • {trip.budgetLevel}
                    </p>

                    <p className="text-xs font-bold text-slate-800 mt-2">
                      Est. Total: {tripCost}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 pt-2 border-t border-slate-200/70">
                    <button
                      onClick={() => onLoadTrip(trip)}
                      className="flex-1 py-1.5 px-2 bg-slate-900 hover:bg-sky-600 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                    >
                      Load Itinerary
                    </button>
                    <button
                      onClick={() => onDeleteTrip(trip.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                      title="Delete saved trip"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Printable Preview Layout for Offline PDF */}
      {currentItinerary && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">
              Offline Print & PDF Layout Preview
            </h3>
            <button
              onClick={onPrintPdf}
              className="text-xs font-bold text-sky-600 hover:text-sky-800 underline underline-offset-2 flex items-center gap-1 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Guide Now</span>
            </button>
          </div>

          <div className="border border-dashed border-slate-300 rounded-xl p-5 bg-slate-50/50 space-y-4 text-xs text-slate-700">
            <div className="border-b border-slate-200 pb-3 flex justify-between items-start">
              <div>
                <h4 className="text-lg font-black text-slate-900">{currentItinerary.title}</h4>
                <p className="text-slate-500 font-medium">{currentItinerary.destination}, {currentItinerary.country} • {currentItinerary.startDate} to {currentItinerary.endDate}</p>
              </div>
              <div className="text-right">
                <span className="font-extrabold text-slate-900 text-sm">
                  {currency === 'INR' ? `₹${currentItinerary.totalCostInr.toLocaleString('en-IN')}` : `$${currentItinerary.totalCostUsd}`}
                </span>
                <p className="text-[10px] text-slate-400">Total Budget</p>
              </div>
            </div>

            <div className="space-y-3">
              {currentItinerary.days.map((d) => (
                <div key={d.dayNumber} className="bg-white p-3 rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1">
                    Day {d.dayNumber}: {d.theme} ({d.geographicCluster.clusterName})
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-600">
                    <div><b>09:00:</b> {d.slots.morning.title}</div>
                    <div><b>12:30:</b> {d.slots.lunch.title}</div>
                    <div><b>14:30:</b> {d.slots.afternoon.title}</div>
                    <div><b>18:30:</b> {d.slots.evening.title}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 pt-3 text-[11px] text-slate-500 flex flex-wrap gap-4">
              <span><b>Police:</b> {currentItinerary.emergencyContacts.police}</span>
              <span><b>Ambulance:</b> {currentItinerary.emergencyContacts.ambulance}</span>
              <span><b>Hospital:</b> {currentItinerary.emergencyContacts.nearestMedicalHub}</span>
              <span><b>Tourist Helpline:</b> {currentItinerary.emergencyContacts.touristPolice}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
