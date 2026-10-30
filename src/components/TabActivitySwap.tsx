'use client';

import React, { useState } from 'react';
import {
  RefreshCw,
  Sparkles,
  Utensils,
  Sun,
  Moon,
  Coffee,
  CheckCircle2,
  ArrowRight,
  Flame,
  Leaf,
  Layers,
  MapPin,
  Coins
} from 'lucide-react';
import { FullItinerary, ActivitySlot, SlotType } from '@/types/travel';
import { SWAP_CATALOG } from '@/lib/itinerary-generator';

interface TabActivitySwapProps {
  itinerary: FullItinerary | null;
  currency: 'USD' | 'INR';
  onUpdateSlot: (dayNumber: number, slotType: SlotType, newSlot: ActivitySlot) => void;
  onRegenerateEntireDay: (dayNumber: number) => void;
  initialSelectedDay?: number;
  initialSelectedSlot?: SlotType;
}

const PRESET_SWAP_IDEAS = [
  { label: 'Swap for outdoor farmers market & bakery', icon: '🍓', prompt: 'outdoor market' },
  { label: 'Find farm-to-table vegetarian/vegan bistro', icon: '🥗', prompt: 'vegetarian spot' },
  { label: 'Change to sunset rooftop lounge & tapas', icon: '🍸', prompt: 'sunset rooftop' },
  { label: 'More adventurous outdoor & thrill experience', icon: '🧗', prompt: 'outdoor adventure' },
  { label: 'Artisan pottery or indigo crafts workshop', icon: '🎨', prompt: 'artisan craft' },
  { label: 'Secret courtyard tea ceremony & relaxation', icon: '🍵', prompt: 'tea ceremony' }
];

export const TabActivitySwap: React.FC<TabActivitySwapProps> = ({
  itinerary,
  currency,
  onUpdateSlot,
  onRegenerateEntireDay,
  initialSelectedDay = 1,
  initialSelectedSlot = 'morning'
}) => {
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(initialSelectedDay);
  const [selectedSlotType, setSelectedSlotType] = useState<SlotType>(initialSelectedSlot);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isSwapping, setIsSwapping] = useState(false);
  const [lastSwappedInfo, setLastSwappedInfo] = useState<string | null>(null);

  if (!itinerary) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl mx-auto flex items-center justify-center">
          <RefreshCw className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">No Trip Selected for Customization</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Please generate an itinerary first in Tab 2 to use the interactive slot modifier.
        </p>
      </div>
    );
  }

  const currentDay = itinerary.days.find((d) => d.dayNumber === selectedDayNumber) || itinerary.days[0];
  const currentSlot: ActivitySlot = currentDay.slots[selectedSlotType];

  const handleApplySwap = async (promptOverride?: string, presetIdx?: number) => {
    setIsSwapping(true);
    setLastSwappedInfo(null);
    try {
      const res = await fetch('/api/swap-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slot: currentSlot,
          customPrompt: promptOverride !== undefined ? promptOverride : customPrompt,
          presetIndex: presetIdx
        })
      });

      const data = await res.json();
      if (data.success && data.updatedSlot) {
        onUpdateSlot(selectedDayNumber, selectedSlotType, data.updatedSlot);
        setLastSwappedInfo(`Updated ${selectedSlotType.toUpperCase()} on Day ${selectedDayNumber} to "${data.updatedSlot.title}"!`);
        setCustomPrompt('');
      }
    } catch (err) {
      console.error('Failed to swap activity:', err);
    } finally {
      setIsSwapping(false);
    }
  };

  const catalogOptions = SWAP_CATALOG[selectedSlotType] || SWAP_CATALOG.morning;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold backdrop-blur-xs border border-white/20 mb-2">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Dynamic activity swap & vibe customization</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Surgically Fine-Tune Activities Without Wiping Your Itinerary
        </h2>
        <p className="text-xs sm:text-sm text-amber-100 max-w-2xl mt-1 leading-relaxed">
          Need a vegetarian lunch instead of steak? Want an outdoor farmers market rather than a museum? Swap single slots while preserving geographic clusters and running budget totals.
        </p>
      </div>

      {/* Target Selector Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Day Selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              1. Select Day to Modify
            </label>
            <div className="flex flex-wrap gap-1.5">
              {itinerary.days.map((day) => (
                <button
                  key={day.dayNumber}
                  onClick={() => setSelectedDayNumber(day.dayNumber)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    selectedDayNumber === day.dayNumber
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Day {day.dayNumber} ({day.theme.slice(0, 18)}...)
                </button>
              ))}
            </div>
          </div>

          {/* Slot Selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              2. Select Time Slot
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['morning', 'lunch', 'afternoon', 'evening'] as SlotType[]).map((slotKey) => {
                const labels: Record<SlotType, { name: string; icon: any }> = {
                  morning: { name: 'Morning', icon: Sun },
                  lunch: { name: 'Lunch', icon: Utensils },
                  afternoon: { name: 'Afternoon', icon: Coffee },
                  evening: { name: 'Evening', icon: Moon }
                };
                const Item = labels[slotKey];
                const Icon = Item.icon;
                const isSelected = selectedSlotType === slotKey;

                return (
                  <button
                    key={slotKey}
                    onClick={() => setSelectedSlotType(slotKey)}
                    className={`p-2 rounded-xl border text-xs font-bold flex flex-col items-center justify-center transition cursor-pointer ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 mb-0.5 text-amber-600" />
                    <span>{Item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Current Slot Info Card */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="font-bold text-slate-500 uppercase tracking-wider">
                Currently Scheduled Slot
              </span>
              <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800">
                {currentSlot.timeSlot}
              </span>
              {currentSlot.isCustomized && (
                <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                  Customized
                </span>
              )}
            </div>
            <h4 className="text-base font-extrabold text-slate-900 mt-1">
              {currentSlot.title}
            </h4>
            <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
              {currentSlot.description}
            </p>
          </div>

          <div className="shrink-0 text-right">
            <span className="text-sm font-black text-slate-900">
              {currency === 'INR' ? `₹${currentSlot.estimatedCostInr.toLocaleString('en-IN')}` : `$${currentSlot.estimatedCostUsd}`}
            </span>
            <p className="text-[10px] text-slate-400">
              In {currentSlot.locationCluster.slice(0, 22)}...
            </p>
          </div>
        </div>
      </div>

      {/* Success alert */}
      {lastSwappedInfo && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 flex items-center space-x-2 text-xs text-emerald-900 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{lastSwappedInfo}</span>
        </div>
      )}

      {/* Recommended Preset Swaps for this Slot */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Curated High-Compatibility Replacements
          </h3>
          <span className="text-xs text-slate-400">
            Pre-clustered within walking distance
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {catalogOptions.map((opt, idx) => {
            const costFormatted = currency === 'INR' ? `₹${Math.round(opt.costUsd * 84.5).toLocaleString('en-IN')}` : `$${opt.costUsd}`;
            return (
              <div
                key={opt.title}
                className="border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between hover:border-amber-400 hover:shadow-2xs transition bg-slate-50/40"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100/80 px-1.5 py-0.2 rounded">
                      {opt.category}
                    </span>
                    <span className="font-bold text-slate-700">{costFormatted}</span>
                  </div>
                  <h5 className="font-bold text-xs text-slate-900 leading-snug">
                    {opt.title}
                  </h5>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-3">
                    {opt.description}
                  </p>
                </div>

                <button
                  onClick={() => handleApplySwap(undefined, idx)}
                  disabled={isSwapping}
                  className="mt-3 w-full py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition cursor-pointer"
                >
                  {isSwapping ? 'Applying...' : 'Select This Alternative'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Freeform Prompt Customizer */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <Leaf className="w-3.5 h-3.5 text-emerald-600" />
          Or Custom Vibe Swap Prompt
        </label>
        <div className="flex flex-wrap gap-1.5 pb-1">
          {PRESET_SWAP_IDEAS.map((idea) => (
            <button
              key={idea.label}
              type="button"
              onClick={() => handleApplySwap(idea.prompt)}
              className="text-[11px] font-medium bg-slate-100 hover:bg-amber-50 hover:text-amber-900 hover:border-amber-300 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg transition cursor-pointer"
            >
              {idea.icon} {idea.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. Find romantic rooftop wine bar, secret bookstore, or vegan ramen..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="flex-1 text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          />
          <button
            onClick={() => handleApplySwap(customPrompt)}
            disabled={!customPrompt.trim() || isSwapping}
            className="px-4 py-2 bg-slate-900 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition disabled:opacity-50 cursor-pointer"
          >
            {isSwapping ? 'Swapping...' : 'Apply Custom Swap'}
          </button>
        </div>
      </div>

      {/* Single Day Regeneration action */}
      <div className="bg-slate-100 border border-slate-200/90 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-bold text-slate-800">
            Need an entirely new plan for Day {selectedDayNumber}?
          </span>
          <p className="text-slate-500 text-[11px]">
            Regenerate all 4 slots of Day {selectedDayNumber} with an alternative geographic cluster without touching other days.
          </p>
        </div>
        <button
          onClick={() => onRegenerateEntireDay(selectedDayNumber)}
          className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer whitespace-nowrap"
        >
          Regenerate Day {selectedDayNumber} Only
        </button>
      </div>
    </div>
  );
};
