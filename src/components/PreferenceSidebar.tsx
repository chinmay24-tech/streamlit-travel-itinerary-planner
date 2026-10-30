'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Key,
  Calendar,
  Users,
  Gauge,
  Compass,
  Coins,
  HeartHandshake,
  ArrowLeftRight,
  Plane
} from 'lucide-react';
import { UserPreferences, BudgetLevel, TravelParty, TravelPace, TravelVibe } from '@/types/travel';
import { CityStatePicker, cityStateLabel } from '@/components/CityStatePicker';

interface PreferenceSidebarProps {
  preferences: UserPreferences;
  onChange: (updated: Partial<UserPreferences>) => void;
  onGenerate: () => void;
  isLoading: boolean;
  onSelectTab: (tabId: string) => void;
}

const POPULAR_DESTINATIONS = [
  { city: 'New Delhi', vibe: 'Urban', country: 'India' },
  { city: 'Mumbai', vibe: 'Urban', country: 'India' },
  { city: 'Jaipur', vibe: 'Cultural', country: 'India' },
  { city: 'Goa', vibe: 'Beach', country: 'India' },
  { city: 'Varanasi', vibe: 'Cultural', country: 'India' },
  { city: 'Udaipur', vibe: 'Cultural', country: 'India' },
  { city: 'Kochi', vibe: 'Cultural', country: 'India' },
  { city: 'Manali', vibe: 'Mountains', country: 'India' },
  { city: 'Tokyo', vibe: 'Urban', country: 'Japan' },
  { city: 'Paris', vibe: 'Cultural', country: 'France' }
];

const ORIGIN_QUICK = [
  'New Delhi',
  'Mumbai',
  'Bengaluru',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad'
];

const VIBE_OPTIONS: TravelVibe[] = [
  'Beach',
  'Mountains',
  'Cultural',
  'Urban',
  'Nature',
  'Island',
  'Desert',
  'Wellness'
];

const INTEREST_OPTIONS = [
  'Food & Culinary',
  'History & Heritage',
  'Adventure & Outdoor',
  'Art & Museums',
  'Nightlife & Lounges',
  'Nature & Wildlife',
  'Shopping & Boutiques',
  'Relaxation & Spa'
];

export const PreferenceSidebar: React.FC<PreferenceSidebarProps> = ({
  preferences,
  onChange,
  onGenerate,
  isLoading,
  onSelectTab
}) => {
  const [showKeyInput, setShowKeyInput] = useState(preferences.apiProvider !== 'demo');

  const handleInterestToggle = (interest: string) => {
    const current = preferences.interests || [];
    if (current.includes(interest)) {
      onChange({ interests: current.filter(i => i !== interest) });
    } else {
      onChange({ interests: [...current, interest] });
    }
  };

  return (
    <aside className="w-full lg:w-86 shrink-0 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col gap-5 no-print">
      {/* Module Title */}
      <div className="border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-2 text-sky-700 font-bold text-sm tracking-wide uppercase">
          <Compass className="w-4 h-4" />
          <span>Trip preferences</span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Configure constraints & generative model engine.
        </p>
      </div>

      {/* 1. API Configuration & Demo Mode */}
      <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-sky-600" />
            AI Engine Provider
          </label>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
            {preferences.apiProvider === 'demo' ? 'Free Demo' : 'Live LLM'}
          </span>
        </div>

        <select
          value={preferences.apiProvider}
          onChange={(e) => {
            const provider = e.target.value as any;
            setShowKeyInput(provider !== 'demo');
            onChange({ apiProvider: provider });
          }}
          className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
        >
          <option value="demo">✨ Demo Engine (Instant High-Fidelity Offline AI)</option>
          <option value="groq">⚡ Groq AI (Llama 3.3 Versatile - Ultra Fast)</option>
          <option value="gemini">🌟 Google Gemini AI (1.5 Flash)</option>
        </select>

        {showKeyInput && (
          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-medium text-slate-600">
                {preferences.apiProvider === 'groq' ? 'Groq API Key' : 'Gemini API Key'}
              </label>
              <span className="text-[10px] text-slate-400">Stored in browser session only</span>
            </div>
            <input
              type="password"
              placeholder={preferences.apiProvider === 'groq' ? 'gsk_...' : 'AIzaSy...'}
              value={preferences.apiKey || ''}
              onChange={(e) => onChange({ apiKey: e.target.value })}
              className="w-full text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-sky-500 text-slate-800"
            />
          </div>
        )}
      </div>

      {/* 2. Origin → Destination */}
      <div className="space-y-3">
        <div className="rounded-xl border border-sky-200 bg-sky-50/60 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
              <Plane className="w-3.5 h-3.5 text-sky-600" />
              Route
            </span>
            <button
              type="button"
              onClick={() => {
                const from = preferences.originCity;
                onChange({ originCity: preferences.destination, destination: from });
              }}
              className="text-[10px] font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1 cursor-pointer"
              title="Swap origin and destination"
            >
              <ArrowLeftRight className="w-3 h-3" />
              Swap
            </button>
          </div>
          <CityStatePicker
            label="Departing from"
            value={preferences.originCity}
            placeholder="Type city — then select City, State"
            accent="sky"
            onSelect={(city) => onChange({ originCity: city })}
          />
          <div className="flex flex-wrap gap-1">
            {ORIGIN_QUICK.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => onChange({ originCity: city })}
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                  preferences.originCity === city
                    ? 'bg-sky-600 text-white'
                    : 'bg-white text-sky-800 border border-sky-200'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
          {preferences.originCity && preferences.destination && (
            <p className="text-[11px] text-sky-900 font-medium">
              Route: <b>{cityStateLabel(preferences.originCity)}</b>
              {' → '}
              <b>{cityStateLabel(preferences.destination)}</b>
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-end mb-1">
            <button
              onClick={() => onSelectTab('tab-recommender')}
              className="text-[11px] font-semibold text-sky-600 hover:text-sky-800 underline underline-offset-2"
            >
              Need suggestions?
            </button>
          </div>
          <CityStatePicker
            label="Going to"
            value={preferences.destination}
            placeholder="Type city — then select City, State"
            accent="rose"
            onSelect={(city, opt) => onChange({ destination: city, vibe: (opt.vibe as any) || preferences.vibe })}
          />
        </div>

        <div className="flex flex-wrap gap-1">
          <span className="text-[10px] font-medium text-slate-400 self-center mr-1">Quick:</span>
          {POPULAR_DESTINATIONS.map((p) => (
            <button
              key={p.city}
              type="button"
              onClick={() => onChange({ destination: p.city, vibe: p.vibe as any })}
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-md transition ${
                preferences.destination === p.city
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {p.city}
            </button>
          ))}
        </div>

        {/* Open-ended Vibe */}
        <div>
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Travel Vibe
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {VIBE_OPTIONS.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => onChange({ vibe: v })}
                className={`text-[11px] font-medium py-1.5 px-1 rounded-lg border text-center transition ${
                  preferences.vibe === v
                    ? 'border-sky-500 bg-sky-50 text-sky-700 font-bold shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Duration & Dates */}
      <div className="space-y-3 border-t border-slate-100 pt-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-500" />
            Duration: <span className="text-sky-700 font-extrabold">{preferences.durationDays} Days</span>
          </label>
          <span className="text-[11px] font-medium text-slate-400">1 to 7 Days</span>
        </div>
        <input
          type="range"
          min={1}
          max={7}
          step={1}
          value={preferences.durationDays}
          onChange={(e) => onChange({ durationDays: parseInt(e.target.value, 10) })}
          className="w-full accent-sky-600 cursor-pointer"
        />

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <label className="text-[11px] font-medium text-slate-500">Start Date</label>
            <input
              type="date"
              value={preferences.startDate}
              onChange={(e) => onChange({ startDate: e.target.value })}
              className="w-full mt-0.5 text-xs bg-slate-50 border border-slate-200 rounded-md p-1.5 text-slate-700"
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-slate-500">End Date</label>
            <input
              type="date"
              value={preferences.endDate}
              onChange={(e) => onChange({ endDate: e.target.value })}
              className="w-full mt-0.5 text-xs bg-slate-50 border border-slate-200 rounded-md p-1.5 text-slate-700"
            />
          </div>
        </div>
      </div>

      {/* 4. Budget Level */}
      <div className="space-y-2 border-t border-slate-100 pt-3">
        <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Coins className="w-3.5 h-3.5 text-emerald-600" />
          Budget Level
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {(['Budget', 'Moderate', 'Luxury'] as BudgetLevel[]).map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => onChange({ budgetLevel: lvl })}
              className={`text-xs py-1.5 px-2 rounded-lg font-semibold border text-center transition ${
                preferences.budgetLevel === lvl
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              {lvl === 'Budget' ? 'Budget ($)' : lvl === 'Moderate' ? 'Moderate ($$)' : 'Luxury ($$$)'}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Travel Party & Pace */}
      <div className="space-y-3 border-t border-slate-100 pt-3">
        <div>
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
            <Users className="w-3.5 h-3.5 text-amber-600" />
            Travel Party
          </label>
          <div className="grid grid-cols-4 gap-1.5 text-xs">
            {(['Solo', 'Couple', 'Family', 'Friends'] as TravelParty[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onChange({ travelParty: p })}
                className={`py-1 rounded-md border text-center font-medium transition ${
                  preferences.travelParty === p
                    ? 'bg-amber-500 text-white border-amber-500 font-bold'
                    : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
            <Gauge className="w-3.5 h-3.5 text-purple-600" />
            Pace of Travel
          </label>
          <div className="grid grid-cols-3 gap-1.5 text-xs">
            {(['Relaxed', 'Moderate', 'Fast-Paced'] as TravelPace[]).map((pace) => (
              <button
                key={pace}
                type="button"
                onClick={() => onChange({ pace })}
                className={`py-1 rounded-md border text-center font-medium transition ${
                  preferences.pace === pace
                    ? 'bg-purple-600 text-white border-purple-600 font-bold'
                    : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                {pace}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Interests Multi-select */}
      <div className="space-y-2 border-t border-slate-100 pt-3">
        <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <HeartHandshake className="w-3.5 h-3.5 text-rose-500" />
          Key Interests & Focus
        </label>
        <div className="flex flex-wrap gap-1.5">
          {INTEREST_OPTIONS.map((interest) => {
            const isSelected = (preferences.interests || []).includes(interest);
            return (
              <button
                key={interest}
                type="button"
                onClick={() => handleInterestToggle(interest)}
                className={`text-[11px] px-2 py-1 rounded-md border transition ${
                  isSelected
                    ? 'bg-sky-50 border-sky-400 text-sky-800 font-bold'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {isSelected ? '✓ ' : '+ '}
                {interest}
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="pt-2">
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600 text-white font-bold text-sm shadow-md hover:from-sky-700 hover:to-emerald-700 transition disabled:opacity-60 cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Optimizing Clusters...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate Clustered Itinerary</span>
            </>
          )}
        </button>
        <p className="text-[11px] text-center text-slate-400 mt-2">
          Calculates geographic clusters & itemized budgets automatically.
        </p>
      </div>
    </aside>
  );
};
