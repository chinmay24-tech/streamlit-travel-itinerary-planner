'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Calendar,
  Coins,
  ArrowRight,
  TrendingUp,
  Check,
  Train,
  Search
} from 'lucide-react';
import { DestinationRecommendation, UserPreferences } from '@/types/travel';
import { INDIAN_STATES } from '@/lib/indian-cities';

interface TabDestinationRecommenderProps {
  preferences: UserPreferences;
  onSelectDestination: (dest: DestinationRecommendation) => void;
  currency: 'USD' | 'INR';
}

export const TabDestinationRecommender: React.FC<TabDestinationRecommenderProps> = ({
  preferences,
  onSelectDestination,
  currency
}) => {
  const [recommendations, setRecommendations] = useState<DestinationRecommendation[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVibeFilter, setSelectedVibeFilter] = useState<string>('All');
  const [countryFilter, setCountryFilter] = useState<string>('India');
  const [stateFilter, setStateFilter] = useState<string>('');
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(12);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vibe: selectedVibeFilter === 'All' ? preferences.vibe : selectedVibeFilter,
          budget: preferences.budgetLevel,
          season: preferences.startDate,
          travelParty: preferences.travelParty,
          interests: preferences.interests,
          country: countryFilter,
          state: stateFilter,
          search,
          limit: 200
        })
      });

      const data = await res.json();
      if (data.success && data.recommendations) {
        setRecommendations(data.recommendations);
        setTotal(data.total || data.recommendations.length);
      }
    } catch (err) {
      console.error('Failed to load recommendations', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
    setVisibleCount(12);
  }, [preferences.vibe, preferences.budgetLevel, selectedVibeFilter, countryFilter, stateFilter]);

  useEffect(() => {
    const t = setTimeout(() => {
      fetchRecommendations();
    }, 250);
    return () => clearTimeout(t);
  }, [search]);

  const featured = recommendations.slice(0, 3);
  const rest = recommendations.slice(0, visibleCount);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-900 via-rose-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-sm">
        <div className="max-w-3xl relative z-10 space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-200 text-xs font-bold backdrop-blur-xs border border-white/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{total} destinations · Full India city atlas</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Discover India — every state, hill station, beach & heritage city
          </h2>
          <p className="text-sm text-orange-100 leading-relaxed">
            Browse {total || '100+'} cities across all 28 states and 8 union territories. Filter by vibe, state, or search Varanasi, Spiti, Havelock, Hampi…
          </p>
        </div>

        <div className="mt-5 pt-4 border-t border-white/10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-orange-100">Region:</span>
            {['India', 'All', 'International'].map((c) => (
              <button
                key={c}
                onClick={() => {
                  setCountryFilter(c);
                  setStateFilter('');
                }}
                className={`text-xs px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                  countryFilter === c
                    ? 'bg-orange-500 text-white font-bold shadow-xs'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {c === 'India' ? '🇮🇳 India' : c}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-orange-100">Mood:</span>
            {['All', 'Beach', 'Mountains', 'Cultural', 'Urban', 'Nature', 'Island', 'Desert', 'Wellness'].map((vibe) => (
              <button
                key={vibe}
                onClick={() => setSelectedVibeFilter(vibe)}
                className={`text-xs px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                  selectedVibeFilter === vibe
                    ? 'bg-sky-500 text-white font-bold shadow-xs'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {vibe}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-white/60 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                placeholder="Search Indian cities, states, or tags…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder:text-white/50 focus:outline-hidden focus:ring-2 focus:ring-orange-400"
              />
            </div>
            {countryFilter === 'India' && (
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden min-w-48"
              >
                <option value="" className="text-slate-900">All Indian states & UTs</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s} className="text-slate-900">
                    {s}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse space-y-4">
              <div className="h-44 bg-slate-200 rounded-xl" />
              <div className="h-5 bg-slate-200 rounded w-2/3" />
              <div className="h-4 bg-slate-100 rounded w-full" />
            </div>
          ))}
        </div>
      ) : recommendations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-sm text-slate-500">
          No cities matched those filters. Try another state, vibe, or search term.
        </div>
      ) : (
        <>
          {search === '' && !stateFilter && featured.length >= 3 && (
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Top 3 matches · then browse the full atlas ({recommendations.length} cities)
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rest.map((rec, index) => {
              const displayCost =
                currency === 'INR'
                  ? `₹${rec.estDailyCostInr.toLocaleString('en-IN')}`
                  : `$${rec.estDailyCostUsd}`;

              return (
                <div
                  key={rec.id}
                  className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
                >
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                    <img
                      src={rec.imageUrl}
                      alt={rec.city}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-md text-white font-black text-xs">
                        #{index + 1}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/90 text-white font-bold text-xs flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        {rec.matchScore}%
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-xl font-extrabold text-white tracking-tight drop-shadow-xs">
                        {rec.city}
                      </h3>
                      <p className="text-xs text-orange-100 font-medium">
                        {rec.country} • {rec.vibe}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-xs border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-slate-400 font-medium flex items-center gap-1">
                          <Coins className="w-3.5 h-3.5 text-emerald-600" />
                          Daily budget
                        </span>
                        <p className="font-extrabold text-slate-900 text-sm">
                          {displayCost} <span className="text-[11px] font-normal text-slate-500">/day</span>
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-sky-600" />
                          Best season
                        </span>
                        <p className="font-bold text-slate-800 text-xs truncate" title={rec.bestSeason}>
                          {rec.bestSeason}
                        </p>
                      </div>
                    </div>

                    <div className="bg-sky-50/60 rounded-xl p-2.5 border border-sky-100 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-sky-900">
                        <Train className="w-3.5 h-3.5 text-sky-600" />
                        Transit
                      </div>
                      <p className="text-[11px] text-sky-800 mt-0.5">{rec.transitScore}</p>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {rec.highlightTags.slice(0, 4).map((tag) => (
                        <span key={tag} className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <ul className="text-xs text-slate-600 space-y-1">
                      {rec.topAttractions.slice(0, 3).map((attr) => (
                        <li key={attr} className="flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="truncate">{attr}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => onSelectDestination(rec)}
                      className="w-full mt-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center space-x-2 transition cursor-pointer"
                    >
                      <span>Plan {rec.city}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {visibleCount < recommendations.length && (
            <div className="text-center">
              <button
                onClick={() => setVisibleCount((n) => n + 12)}
                className="px-5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Load more cities ({recommendations.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
