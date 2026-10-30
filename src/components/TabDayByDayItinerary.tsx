'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Compass,
  MapPin,
  Clock,
  Coins,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  ArrowRight,
  BookmarkCheck,
  Navigation,
  Plane,
  Train,
  Bus,
  Car,
  Ship,
  Utensils,
  Sun,
  Moon,
  Coffee,
  Footprints,
  Info,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { FullItinerary, DayPlan, ActivitySlot } from '@/types/travel';
import { BookingChips } from './BookingChips';

interface TabDayByDayItineraryProps {
  itinerary: FullItinerary | null;
  currency: 'USD' | 'INR';
  onSwapSlotClick: (dayNumber: number, slotType: 'morning' | 'lunch' | 'afternoon' | 'evening', slot: ActivitySlot) => void;
  onSaveToVault: () => void;
  isSaving: boolean;
  onRegenerateDay?: (dayNumber: number) => void;
}

export const TabDayByDayItinerary: React.FC<TabDayByDayItineraryProps> = ({
  itinerary,
  currency,
  onSwapSlotClick,
  onSaveToVault,
  isSaving,
  onRegenerateDay
}) => {
  const [expandedDay, setExpandedDay] = useState<number | null>(1);

  if (!itinerary) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
        <div className="w-16 h-16 bg-sky-50 text-sky-600 rounded-2xl mx-auto flex items-center justify-center">
          <Calendar className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">No Active Itinerary Yet</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Use the left sidebar preferences to select your destination, dates, and budget, then click <b>Generate Clustered Itinerary</b>.
        </p>
      </div>
    );
  }

  const formatCost = (usd: number, inr: number, local: number, symbol: string) => {
    if (currency === 'INR') {
      return `₹${inr.toLocaleString('en-IN')}`;
    }
    return `$${usd}`;
  };

  const totalCostDisplay = currency === 'INR'
    ? `₹${itinerary.totalCostInr.toLocaleString('en-IN')}`
    : `$${itinerary.totalCostUsd}`;

  return (
    <div className="space-y-6">
      {/* Overview & Cumulative Budget Tracker Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200">
                {itinerary.vibe} Vibe
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {itinerary.budgetLevel} Tier
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {itinerary.travelParty} • {itinerary.pace} Pace
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mt-1 tracking-tight">
              {itinerary.title}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {itinerary.originCity ? `${itinerary.originCity} → ` : ''}
              {itinerary.destination}, {itinerary.country} • {itinerary.startDate} to {itinerary.endDate}
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={onSaveToVault}
              disabled={isSaving}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition cursor-pointer"
            >
              <BookmarkCheck className="w-4 h-4 text-emerald-400" />
              <span>{isSaving ? 'Saving...' : 'Save to Trip Vault'}</span>
            </button>
          </div>
        </div>

        {itinerary.journey && !itinerary.journey.sameCity && (
          <div className="rounded-2xl border border-sky-200 bg-gradient-to-r from-sky-50 to-indigo-50 p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-sky-700">Getting there</p>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  {itinerary.journey.originCity}
                  <span className="text-sky-500">→</span>
                  {itinerary.journey.destinationCity}
                </h3>
                <p className="text-xs text-slate-600">
                  ~{itinerary.journey.distanceKm.toLocaleString()} km • {itinerary.journey.originCountry} to {itinerary.journey.destinationCountry}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-slate-500">Round-trip transit (est.)</p>
                <p className="text-base font-black text-slate-900">
                  {currency === 'INR'
                    ? `₹${itinerary.journey.totalTransitInr.toLocaleString('en-IN')}`
                    : `$${itinerary.journey.totalTransitUsd}`}
                </p>
                <p className="text-[10px] text-slate-400">Included in total budget</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {[itinerary.journey.outbound, ...itinerary.journey.alternatives].slice(0, 3).map((leg, idx) => {
                const Icon =
                  leg.mode === 'Flight' ? Plane : leg.mode === 'Train' ? Train : leg.mode === 'Bus' ? Bus : leg.mode === 'Ferry' ? Ship : Car;
                const price = currency === 'INR' ? `₹${leg.costInr.toLocaleString('en-IN')}` : `$${leg.costUsd}`;
                return (
                  <div
                    key={`${leg.mode}-${idx}`}
                    className={`rounded-xl p-3 border text-xs ${
                      leg.isRecommended
                        ? 'bg-white border-sky-400 shadow-2xs'
                        : 'bg-white/70 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-800 flex items-center gap-1">
                        <Icon className="w-3.5 h-3.5 text-sky-600" />
                        {leg.mode}
                      </span>
                      {leg.isRecommended && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="font-semibold text-slate-900 leading-snug">{leg.label}</p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {leg.fromHub} → {leg.toHub}
                    </p>
                    <p className="text-[11px] text-slate-600 mt-1">
                      {leg.durationLabel} • {price} • {leg.comfort}
                    </p>
                    {leg.notes[0] && <p className="text-[11px] text-slate-500 mt-1 italic">{leg.notes[0]}</p>}
                    <BookingChips links={leg.bookingLinks} compact />
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-slate-600">
              <p>
                <b>Last mile:</b> {itinerary.journey.lastMile}
              </p>
              <p>
                <b>Return:</b> {itinerary.journey.returnLeg.mode} {itinerary.journey.destinationCity} → {itinerary.journey.originCity} ({itinerary.journey.returnLeg.durationLabel})
              </p>
            </div>
            {itinerary.journey.mapsDirectionsUrl && (
              <a
                href={itinerary.journey.mapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 hover:text-sky-900"
              >
                Open Google Maps directions
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {itinerary.journey.returnLeg.bookingLinks && (
              <div>
                <p className="text-[11px] font-bold text-slate-600">Book return</p>
                <BookingChips links={itinerary.journey.returnLeg.bookingLinks} compact />
              </div>
            )}
          </div>
        )}

        {/* Cumulative Budget Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60">
            <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-emerald-600" />
              Total Estimated Budget
            </span>
            <p className="text-lg font-black text-slate-900 mt-0.5">
              {totalCostDisplay}
            </p>
            <span className="text-[10px] text-slate-400 font-medium">
              Local: {itinerary.localCurrencySymbol}{itinerary.totalCostLocal.toLocaleString()} {itinerary.localCurrencyCode}
            </span>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60">
            <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-sky-600" />
              Trip Duration
            </span>
            <p className="text-lg font-black text-slate-900 mt-0.5">
              {itinerary.durationDays} Days / {itinerary.durationDays * 4} Slots
            </p>
            <span className="text-[10px] text-slate-400 font-medium">
              Avg. ~{currency === 'INR' ? `₹${Math.round(itinerary.totalCostInr / itinerary.durationDays).toLocaleString('en-IN')}` : `$${Math.round(itinerary.totalCostUsd / itinerary.durationDays)}`}/day
            </span>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60">
            <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
              <Navigation className="w-3.5 h-3.5 text-indigo-600" />
              Geographic Clusters
            </span>
            <p className="text-lg font-black text-slate-900 mt-0.5">
              {itinerary.days.length} Zoned Quadrants
            </p>
            <span className="text-[10px] text-indigo-600 font-semibold">
              Zero backtracking logic
            </span>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60">
            <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              Vibe Match Accuracy
            </span>
            <p className="text-lg font-black text-emerald-600 mt-0.5">
              {itinerary.vibeCompatibilityScore}% Optimized
            </p>
            <span className="text-[10px] text-slate-400 font-medium">
              Geoclustered sequencing
            </span>
          </div>
        </div>

        {/* Transit Guidelines Callout */}
        {itinerary.transitGuidelines && itinerary.transitGuidelines.length > 0 && (
          <div className="bg-emerald-50/70 border border-emerald-200/70 rounded-xl p-3 flex items-start space-x-2 text-xs text-emerald-900">
            <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Anti-Fatigue Geographic Clustering Rule:</span>
              <p className="text-[11px] text-emerald-800 mt-0.5">
                {itinerary.transitGuidelines[0]}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Day by Day Clustered Accordions */}
      <div className="space-y-4">
        {itinerary.days.map((day) => {
          const isExpanded = expandedDay === day.dayNumber;
          const dayCostFormatted = formatCost(day.dailyCostUsd, day.dailyCostInr, day.dailyCostLocal, itinerary.localCurrencySymbol);
          const cumCostFormatted = formatCost(day.cumulativeCostUsd, day.cumulativeCostInr, day.cumulativeCostLocal, itinerary.localCurrencySymbol);

          return (
            <div
              key={day.dayNumber}
              className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs transition card-print"
            >
              {/* Day Header Bar */}
              <button
                onClick={() => setExpandedDay(isExpanded ? null : day.dayNumber)}
                className="w-full p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between text-left hover:bg-slate-50/80 transition cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-black flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] uppercase font-semibold text-slate-400">Day</span>
                    <span className="text-sm leading-none font-bold">{day.dayNumber}</span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-extrabold text-slate-900 text-base">
                        {day.theme}
                      </h3>
                      <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                        • {day.dateLabel}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-sky-700 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      Cluster: {day.geographicCluster.clusterName}
                    </p>
                  </div>
                </div>

                <div className="mt-3 sm:mt-0 flex items-center space-x-4 self-end sm:self-center">
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-slate-800">
                      {dayCostFormatted}
                    </span>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Cumulative: {cumCostFormatted}
                    </p>
                  </div>

                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                    {isExpanded ? 'Collapse ▲' : 'View Plan ▼'}
                  </span>
                </div>
              </button>

              {/* Expanded Day Details */}
              {isExpanded && (
                <div className="p-4 sm:p-6 border-t border-slate-100 space-y-5 bg-slate-50/30">
                  {/* Geographic Clustering Logic Banner */}
                  <div className="bg-gradient-to-r from-sky-50 to-indigo-50/60 border border-sky-200/80 rounded-xl p-3.5 text-xs">
                    <div className="flex items-center gap-2 font-bold text-sky-950 mb-1">
                      <Navigation className="w-4 h-4 text-sky-600 shrink-0" />
                      <span>Geographic clustering — less transit, no backtracking</span>
                    </div>
                    <p className="text-slate-700 text-xs leading-relaxed">
                      {day.geographicCluster.transitAdvantage}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-600 font-medium pt-1 border-t border-sky-200/40">
                      <span className="flex items-center gap-1">
                        <Footprints className="w-3 h-3 text-slate-400" />
                        Walking Radius: <b>~{day.geographicCluster.walkingRadiusKm} km</b>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        Transit Between Stops: <b>~{day.geographicCluster.estimatedTransitTimeMins} mins</b>
                      </span>
                      <span>•</span>
                      <span className="text-sky-700 font-semibold">
                        Recommended: {day.geographicCluster.recommendedTransport}
                      </span>
                    </div>
                  </div>

                  {/* 4 Sequential Time Slots */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 1. Morning Sightseeing */}
                    <ActivitySlotCard
                      slot={day.slots.morning}
                      slotType="morning"
                      slotLabel="Morning Sightseeing"
                      icon={Sun}
                      iconColor="text-amber-500"
                      currency={currency}
                      onSwap={() => onSwapSlotClick(day.dayNumber, 'morning', day.slots.morning)}
                    />

                    {/* 2. Lunch Recommendation */}
                    <ActivitySlotCard
                      slot={day.slots.lunch}
                      slotType="lunch"
                      slotLabel="Lunch Recommendation"
                      icon={Utensils}
                      iconColor="text-emerald-500"
                      currency={currency}
                      onSwap={() => onSwapSlotClick(day.dayNumber, 'lunch', day.slots.lunch)}
                    />

                    {/* 3. Afternoon Leisure */}
                    <ActivitySlotCard
                      slot={day.slots.afternoon}
                      slotType="afternoon"
                      slotLabel="Afternoon Leisure"
                      icon={Coffee}
                      iconColor="text-sky-500"
                      currency={currency}
                      onSwap={() => onSwapSlotClick(day.dayNumber, 'afternoon', day.slots.afternoon)}
                    />

                    {/* 4. Evening Dining & Entertainment */}
                    <ActivitySlotCard
                      slot={day.slots.evening}
                      slotType="evening"
                      slotLabel="Evening Dining & Entertainment"
                      icon={Moon}
                      iconColor="text-purple-500"
                      currency={currency}
                      onSwap={() => onSwapSlotClick(day.dayNumber, 'evening', day.slots.evening)}
                    />
                  </div>

                  {/* Day Cumulative Summary Strip */}
                  <div className="flex flex-col sm:flex-row items-center justify-between bg-white rounded-xl p-3 border border-slate-200 text-xs">
                    <div className="flex items-center space-x-2 text-slate-600">
                      <Coins className="w-4 h-4 text-emerald-600" />
                      <span>
                        Day {day.dayNumber} Spend: <b>{dayCostFormatted}</b>
                      </span>
                      <span>•</span>
                      <span className="font-semibold text-slate-900">
                        Running Total: <b>{cumCostFormatted}</b>
                      </span>
                    </div>

                    <div className="mt-2 sm:mt-0 flex items-center space-x-2">
                      <span className="text-[11px] text-slate-400">
                        Local Currency: {itinerary.localCurrencySymbol}{day.dailyCostLocal.toLocaleString()} {itinerary.localCurrencyCode}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Activity Slot Card Subcomponent
interface ActivitySlotCardProps {
  slot: ActivitySlot;
  slotType: 'morning' | 'lunch' | 'afternoon' | 'evening';
  slotLabel: string;
  icon: any;
  iconColor: string;
  currency: 'USD' | 'INR';
  onSwap: () => void;
}

const ActivitySlotCard: React.FC<ActivitySlotCardProps> = ({
  slot,
  slotLabel,
  icon: Icon,
  iconColor,
  currency,
  onSwap
}) => {
  const displayCost = currency === 'INR'
    ? `₹${slot.estimatedCostInr.toLocaleString('en-IN')}`
    : `$${slot.estimatedCostUsd}`;

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs hover:border-slate-300 transition flex flex-col justify-between space-y-3 relative">
      {slot.isCustomized && (
        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
          Custom Swapped
        </span>
      )}

      <div>
        {/* Header slot timing */}
        <div className="flex items-center justify-between text-xs mb-1.5">
          <div className="flex items-center space-x-1.5 font-bold text-slate-700">
            <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
            <span>{slotLabel}</span>
          </div>
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {slot.timeSlot}
          </span>
        </div>

        {/* Title */}
        <h4 className="font-extrabold text-slate-900 text-sm tracking-tight leading-snug">
          {slot.title}
        </h4>

        {/* Description */}
        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
          {slot.description}
        </p>

        {/* Insider tip */}
        <div className="mt-2.5 bg-amber-50/60 rounded-lg p-2 border border-amber-100/80 text-[11px] text-amber-900">
          <span className="font-bold">Insider Tip: </span>
          <span>{slot.insiderTip}</span>
        </div>
      </div>

      {/* Footer info & Swap trigger */}
      <div className="border-t border-slate-100 pt-2.5 flex items-center justify-between">
        <div className="flex items-center space-x-1.5">
          <span className="text-xs font-black text-slate-900">
            {displayCost}
          </span>
          <span className="text-[10px] text-slate-400">
            ({slot.localCurrencySymbol}{slot.estimatedCostLocal} {slot.localCurrencyCode})
          </span>
        </div>

        <div className="flex items-center gap-1">
          {slot.mapsUrl && (
            <a
              href={slot.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-[11px] font-bold text-emerald-700 hover:bg-emerald-50 px-2 py-1 rounded-md"
            >
              <MapPin className="w-3 h-3" />
              Maps
            </a>
          )}
          <button
            onClick={onSwap}
            className="flex items-center space-x-1 text-[11px] font-bold text-sky-600 hover:text-sky-800 hover:bg-sky-50 px-2 py-1 rounded-md transition cursor-pointer"
            title="Swap this slot with a different vibe or activity"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Modify Slot</span>
          </button>
        </div>
      </div>
    </div>
  );
};
