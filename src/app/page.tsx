'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { TabNav } from '@/components/TabNav';
import { PreferenceSidebar } from '@/components/PreferenceSidebar';
import { TabDestinationRecommender } from '@/components/TabDestinationRecommender';
import { TabDayByDayItinerary } from '@/components/TabDayByDayItinerary';
import { TabActivitySwap } from '@/components/TabActivitySwap';
import { TabTripVaultPdf } from '@/components/TabTripVaultPdf';
import { TabStayBook } from '@/components/TabStayBook';
import { PrintableItineraryGuide } from '@/components/PrintableItineraryGuide';
import { AuthScreen, PublicUser } from '@/components/AuthScreen';
import {
  UserPreferences,
  FullItinerary,
  ActivitySlot,
  SlotType,
  DestinationRecommendation
} from '@/types/travel';
import { generateItinerary } from '@/lib/itinerary-generator';

const GUEST_FLAG = 'wanderpulse_guest';
const GUEST_TRIPS_KEY = 'wanderpulse_guest_trips';

export default function Home() {
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState<PublicUser | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [authModal, setAuthModal] = useState<'login' | 'signup' | null>(null);

  const [preferences, setPreferences] = useState<UserPreferences>({
    originCity: 'New Delhi',
    destination: 'Jaipur',
    vibe: 'Cultural',
    durationDays: 3,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    budgetLevel: 'Moderate',
    travelParty: 'Solo',
    pace: 'Moderate',
    interests: ['Food & Culinary', 'History & Heritage', 'Art & Museums'],
    currency: 'INR',
    apiProvider: 'demo',
    apiKey: ''
  });

  const [itinerary, setItinerary] = useState<FullItinerary | null>(null);
  const [activeTab, setActiveTab] = useState<string>('tab-itinerary');
  const [currency, setCurrency] = useState<'USD' | 'INR'>('INR');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSavingTrip, setIsSavingTrip] = useState<boolean>(false);
  const [savedTrips, setSavedTrips] = useState<any[]>([]);
  const [saveHint, setSaveHint] = useState<string>('');
  const [targetSwapDay, setTargetSwapDay] = useState<number>(1);
  const [targetSwapSlotType, setTargetSwapSlotType] = useState<SlotType>('morning');

  const loadGuestTrips = (): any[] => {
    try {
      const raw = localStorage.getItem(GUEST_TRIPS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const persistGuestTrips = (list: any[]) => {
    localStorage.setItem(GUEST_TRIPS_KEY, JSON.stringify(list));
  };

  const fetchSavedTrips = async (loggedIn: boolean) => {
    if (!loggedIn) {
      setSavedTrips(loadGuestTrips());
      return;
    }
    try {
      const res = await fetch('/api/trips');
      const data = await res.json();
      if (data.success && Array.isArray(data.trips)) {
        setSavedTrips(data.trips);
      }
    } catch (err) {
      console.warn('Could not fetch saved trips:', err);
    }
  };

  useEffect(() => {
    const boot = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          setIsGuest(false);
          localStorage.removeItem(GUEST_FLAG);
          await fetchSavedTrips(true);
        } else if (localStorage.getItem(GUEST_FLAG) === '1') {
          setIsGuest(true);
          setSavedTrips(loadGuestTrips());
        }
      } catch {
        if (typeof window !== 'undefined' && localStorage.getItem(GUEST_FLAG) === '1') {
          setIsGuest(true);
          setSavedTrips(loadGuestTrips());
        }
      } finally {
        setItinerary(generateItinerary(preferences));
        setAuthReady(true);
      }
    };
    boot();
  }, []);

  const enterGuest = () => {
    localStorage.setItem(GUEST_FLAG, '1');
    setIsGuest(true);
    setUser(null);
    setAuthModal(null);
    setSavedTrips(loadGuestTrips());
  };

  const handleAuthenticated = async (nextUser: PublicUser) => {
    setUser(nextUser);
    setIsGuest(false);
    setAuthModal(null);
    localStorage.removeItem(GUEST_FLAG);

    const localTrips = loadGuestTrips();
    for (const trip of localTrips) {
      if (trip.itinerary) {
        try {
          await fetch('/api/trips', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ itinerary: trip.itinerary })
          });
        } catch {
          /* ignore merge failures */
        }
      }
    }
    localStorage.removeItem(GUEST_TRIPS_KEY);
    await fetchSavedTrips(true);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setIsGuest(false);
    setSavedTrips([]);
    localStorage.removeItem(GUEST_FLAG);
  };

  const handlePreferenceChange = (updated: Partial<UserPreferences>) => {
    setPreferences((prev) => {
      const next = { ...prev, ...updated };
      if (updated.durationDays || updated.startDate) {
        const start = new Date(next.startDate);
        if (!isNaN(start.getTime())) {
          start.setDate(start.getDate() + next.durationDays);
          next.endDate = start.toISOString().split('T')[0];
        }
      }
      return next;
    });
  };

  const handleGenerateItinerary = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences)
      });
      const data = await res.json();
      if (data.success && data.itinerary) {
        setItinerary(data.itinerary);
      } else {
        setItinerary(generateItinerary(preferences));
      }
      setActiveTab('tab-itinerary');
    } catch {
      setItinerary(generateItinerary(preferences));
      setActiveTab('tab-itinerary');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectRecommendation = (rec: DestinationRecommendation) => {
    handlePreferenceChange({
      destination: rec.city,
      vibe: rec.vibe as any,
      budgetLevel: rec.budgetLevel
    });
    setItinerary(
      generateItinerary({
        ...preferences,
        destination: rec.city,
        vibe: rec.vibe as any,
        budgetLevel: rec.budgetLevel
      })
    );
    setActiveTab('tab-itinerary');
  };

  const handleSwapSlotClick = (dayNumber: number, slotType: SlotType, slot: ActivitySlot) => {
    setTargetSwapDay(dayNumber);
    setTargetSwapSlotType(slotType);
    setActiveTab('tab-swap');
  };

  const handleUpdateSlot = (dayNumber: number, slotType: SlotType, newSlot: ActivitySlot) => {
    if (!itinerary) return;
    const updatedDays = itinerary.days.map((day) => {
      if (day.dayNumber !== dayNumber) return day;
      const updatedSlots = { ...day.slots, [slotType]: newSlot };
      const dailyUsd =
        updatedSlots.morning.estimatedCostUsd +
        updatedSlots.lunch.estimatedCostUsd +
        updatedSlots.afternoon.estimatedCostUsd +
        updatedSlots.evening.estimatedCostUsd;
      const dailyInr =
        updatedSlots.morning.estimatedCostInr +
        updatedSlots.lunch.estimatedCostInr +
        updatedSlots.afternoon.estimatedCostInr +
        updatedSlots.evening.estimatedCostInr;
      const dailyLocal =
        updatedSlots.morning.estimatedCostLocal +
        updatedSlots.lunch.estimatedCostLocal +
        updatedSlots.afternoon.estimatedCostLocal +
        updatedSlots.evening.estimatedCostLocal;
      return { ...day, slots: updatedSlots, dailyCostUsd: dailyUsd, dailyCostInr: dailyInr, dailyCostLocal: dailyLocal };
    });

    let runUsd = 0;
    let runInr = 0;
    let runLocal = 0;
    const recalculatedDays = updatedDays.map((d) => {
      runUsd += d.dailyCostUsd;
      runInr += d.dailyCostInr;
      runLocal += d.dailyCostLocal;
      return { ...d, cumulativeCostUsd: runUsd, cumulativeCostInr: runInr, cumulativeCostLocal: runLocal };
    });

    setItinerary({
      ...itinerary,
      days: recalculatedDays,
      totalCostUsd: runUsd,
      totalCostInr: runInr,
      totalCostLocal: runLocal
    });
  };

  const handleRegenerateEntireDay = (dayNumber: number) => {
    if (!itinerary) return;
    const freshPlan = generateItinerary(preferences);
    const freshDay = freshPlan.days[(dayNumber - 1) % freshPlan.days.length];
    if (!freshDay) return;
    const updatedDays = itinerary.days.map((d) =>
      d.dayNumber === dayNumber ? { ...freshDay, dayNumber: d.dayNumber, dateLabel: d.dateLabel } : d
    );
    let runUsd = 0;
    let runInr = 0;
    let runLocal = 0;
    const recalculatedDays = updatedDays.map((d) => {
      runUsd += d.dailyCostUsd;
      runInr += d.dailyCostInr;
      runLocal += d.dailyCostLocal;
      return { ...d, cumulativeCostUsd: runUsd, cumulativeCostInr: runInr, cumulativeCostLocal: runLocal };
    });
    setItinerary({
      ...itinerary,
      days: recalculatedDays,
      totalCostUsd: runUsd,
      totalCostInr: runInr,
      totalCostLocal: runLocal
    });
  };

  const handleSaveToVault = async () => {
    if (!itinerary) return;
    setIsSavingTrip(true);
    setSaveHint('');
    try {
      if (!user) {
        const guestTrip = {
          id: Date.now(),
          title: itinerary.title,
          originCity: itinerary.originCity,
          destination: itinerary.destination,
          vibe: itinerary.vibe,
          durationDays: itinerary.durationDays,
          budgetLevel: itinerary.budgetLevel,
          totalCostUsd: itinerary.totalCostUsd,
          totalCostInr: itinerary.totalCostInr,
          itinerary,
          createdAt: new Date().toISOString()
        };
        const next = [guestTrip, ...loadGuestTrips()];
        persistGuestTrips(next);
        setSavedTrips(next);
        setSaveHint('Saved on this device. Sign up to keep trips across browsers.');
        return;
      }

      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itinerary })
      });
      const data = await res.json();
      if (data.success && data.trip) {
        setSavedTrips((prev) => [data.trip, ...prev.filter((t) => t.id !== data.trip.id)]);
        setSaveHint('Saved to your account vault.');
      }
    } catch (err) {
      console.error('Save trip failed:', err);
    } finally {
      setIsSavingTrip(false);
    }
  };

  const handleDeleteTrip = async (tripId: number) => {
    if (!user) {
      const next = loadGuestTrips().filter((t) => t.id !== tripId);
      persistGuestTrips(next);
      setSavedTrips(next);
      return;
    }
    try {
      await fetch(`/api/trips/${tripId}`, { method: 'DELETE' });
      setSavedTrips((prev) => prev.filter((t) => t.id !== tripId));
    } catch (err) {
      console.error('Delete trip error:', err);
    }
  };

  const handleLoadTrip = (trip: any) => {
    if (trip.itinerary) {
      setItinerary(trip.itinerary);
      setActiveTab('tab-itinerary');
    }
  };

  const handlePrintPdf = () => window.print();

  if (!authReady) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 mx-auto rounded-xl bg-gradient-to-tr from-sky-500 to-emerald-400 animate-pulse" />
          <p className="text-sm font-semibold text-slate-300">Loading ItineryPlanner…</p>
        </div>
      </div>
    );
  }

  if (!user && !isGuest) {
    return <AuthScreen onAuthenticated={handleAuthenticated} onGuest={enterGuest} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <PrintableItineraryGuide itinerary={itinerary} currency={currency} />

      <Header
        currency={currency}
        onCurrencyToggle={(c) => setCurrency(c)}
        onPrintPdf={handlePrintPdf}
        hasItinerary={!!itinerary}
        user={user}
        isGuest={isGuest && !user}
        onLogin={() => setAuthModal('login')}
        onSignup={() => setAuthModal('signup')}
        onLogout={handleLogout}
      />

      <TabNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        hasItinerary={!!itinerary}
        savedTripsCount={savedTrips.length}
      />

      {isGuest && !user && (
        <div className="no-print bg-amber-50 border-b border-amber-200 text-amber-950 text-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span>You are exploring as a guest. Trip saves stay on this device only.</span>
            <button
              onClick={() => setAuthModal('signup')}
              className="font-bold text-amber-900 underline underline-offset-2 cursor-pointer"
            >
              Create a free account
            </button>
          </div>
        </div>
      )}

      {saveHint && (
        <div className="no-print bg-emerald-50 border-b border-emerald-200 text-emerald-900 text-xs">
          <div className="max-w-7xl mx-auto px-4 py-2">{saveHint}</div>
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 no-print">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <PreferenceSidebar
            preferences={preferences}
            onChange={handlePreferenceChange}
            onGenerate={handleGenerateItinerary}
            isLoading={isLoading}
            onSelectTab={(tab) => setActiveTab(tab)}
          />

          <div className="flex-1 w-full min-w-0">
            {activeTab === 'tab-recommender' && (
              <TabDestinationRecommender
                preferences={preferences}
                onSelectDestination={handleSelectRecommendation}
                currency={currency}
              />
            )}

            {activeTab === 'tab-itinerary' && (
              <TabDayByDayItinerary
                itinerary={itinerary}
                currency={currency}
                onSwapSlotClick={handleSwapSlotClick}
                onSaveToVault={handleSaveToVault}
                isSaving={isSavingTrip}
                onRegenerateDay={handleRegenerateEntireDay}
              />
            )}

            {activeTab === 'tab-book' && (
              <TabStayBook itinerary={itinerary} currency={currency} />
            )}

            {activeTab === 'tab-swap' && (
              <TabActivitySwap
                itinerary={itinerary}
                currency={currency}
                onUpdateSlot={handleUpdateSlot}
                onRegenerateEntireDay={handleRegenerateEntireDay}
                initialSelectedDay={targetSwapDay}
                initialSelectedSlot={targetSwapSlotType}
              />
            )}

            {activeTab === 'tab-vault' && (
              <TabTripVaultPdf
                currentItinerary={itinerary}
                savedTrips={savedTrips}
                onLoadTrip={handleLoadTrip}
                onDeleteTrip={handleDeleteTrip}
                onPrintPdf={handlePrintPdf}
                currency={currency}
              />
            )}
          </div>
        </div>
      </main>

      {authModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 no-print">
          <AuthScreen
            key={authModal}
            compact
            initialMode={authModal}
            onAuthenticated={handleAuthenticated}
            onGuest={enterGuest}
            onClose={() => setAuthModal(null)}
          />
        </div>
      )}

      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            © 2026 <b>ItineryPlanner</b> — Personalized travel itineraries
          </p>
          <div className="flex items-center space-x-3 text-slate-600 font-medium">
            <span>From your city</span>
            <span>•</span>
            <span>Clustered days</span>
            <span>•</span>
            <span>Offline PDF</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
