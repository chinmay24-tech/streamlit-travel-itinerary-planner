'use client';

import React from 'react';
import { Compass, CalendarDays, RefreshCw, Archive, BedDouble } from 'lucide-react';

interface TabNavProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  hasItinerary: boolean;
  savedTripsCount: number;
}

export const TabNav: React.FC<TabNavProps> = ({
  activeTab,
  onTabChange,
  hasItinerary,
  savedTripsCount
}) => {
  const tabs = [
    { id: 'tab-recommender', label: 'Destinations', shortLabel: 'Destinations', icon: Compass },
    {
      id: 'tab-itinerary',
      label: 'Day-by-day plan',
      shortLabel: 'Itinerary',
      icon: CalendarDays,
      badge: hasItinerary ? 'Active' : undefined
    },
    { id: 'tab-book', label: 'Hotels, food & tickets', shortLabel: 'Book', icon: BedDouble },
    { id: 'tab-swap', label: 'Customize & swap', shortLabel: 'Customize', icon: RefreshCw },
    {
      id: 'tab-vault',
      label: 'Trip vault & PDF',
      shortLabel: 'Vault',
      icon: Archive,
      badge: savedTripsCount > 0 ? `${savedTripsCount}` : undefined
    }
  ];

  return (
    <div className="bg-white border-b border-slate-200/90 sticky top-16 z-30 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-3 overflow-x-auto py-2.5 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-500'}`} />
                <span className="hidden md:inline">{tab.label}</span>
                <span className="md:hidden">{tab.shortLabel}</span>
                {tab.badge && (
                  <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-emerald-500 text-white">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
