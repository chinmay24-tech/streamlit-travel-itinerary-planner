'use client';

import React from 'react';
import { Compass, Printer, LogOut, LogIn, User } from 'lucide-react';

export type HeaderUser = { id: number; name: string; email: string } | null;

interface HeaderProps {
  currency: 'USD' | 'INR';
  onCurrencyToggle: (curr: 'USD' | 'INR') => void;
  onPrintPdf: () => void;
  hasItinerary: boolean;
  user: HeaderUser;
  isGuest: boolean;
  onLogin: () => void;
  onSignup: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currency,
  onCurrencyToggle,
  onPrintPdf,
  hasItinerary,
  user,
  isGuest,
  onLogin,
  onSignup,
  onLogout
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-teal-500 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">ItineryPlanner</h1>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">
              Personalized itineraries from your city
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-bold">
            <button
              onClick={() => onCurrencyToggle('INR')}
              className={`px-2 py-1 rounded transition-all ${
                currency === 'INR' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Indian Rupee (default)"
            >
              ₹ INR
            </button>
            <button
              onClick={() => onCurrencyToggle('USD')}
              className={`px-2 py-1 rounded transition-all ${
                currency === 'USD' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              $ USD
            </button>
          </div>

          {hasItinerary && (
            <button
              onClick={onPrintPdf}
              className="flex items-center space-x-1 px-3 py-1.5 text-xs font-bold rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">PDF</span>
            </button>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-lg">
                <User className="w-3.5 h-3.5 text-sky-600" />
                {user.name.split(' ')[0]}
              </span>
              <button
                onClick={onLogout}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Log out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              {isGuest && (
                <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wide text-amber-800 bg-amber-50 border border-amber-200 px-2 py-1 rounded-lg">
                  Guest
                </span>
              )}
              <button
                onClick={onLogin}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign in
              </button>
              <button
                onClick={onSignup}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-900 text-white hover:bg-sky-700 cursor-pointer"
              >
                Sign up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
