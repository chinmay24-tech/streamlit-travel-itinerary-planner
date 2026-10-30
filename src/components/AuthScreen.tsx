'use client';

import React, { useState } from 'react';
import { Compass, UserPlus, LogIn, Sparkles, ShieldCheck, MapPin } from 'lucide-react';

export type PublicUser = { id: number; name: string; email: string };

interface AuthScreenProps {
  onAuthenticated: (user: PublicUser) => void;
  onGuest: () => void;
  initialMode?: 'welcome' | 'login' | 'signup';
  compact?: boolean;
  onClose?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onAuthenticated,
  onGuest,
  initialMode = 'welcome',
  compact = false,
  onClose
}) => {
  const [mode, setMode] = useState<'welcome' | 'login' | 'signup'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (endpoint: 'login' | 'register') => {
    setError('');
    setBusy(true);
    try {
      const res = await fetch(`/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || 'Something went wrong.');
        return;
      }
      onAuthenticated(data.user);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const form = (
    <div className="space-y-3">
      {mode === 'signup' && (
        <div>
          <label className="text-[11px] font-bold text-slate-600">Full name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Priya Sharma"
            className="mt-1 w-full text-sm bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
          />
        </div>
      )}
      <div>
        <label className="text-[11px] font-bold text-slate-600">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="mt-1 w-full text-sm bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
        />
      </div>
      <div>
        <label className="text-[11px] font-bold text-slate-600">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={mode === 'signup' ? 'At least 8 characters' : 'Your password'}
          className="mt-1 w-full text-sm bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
        />
      </div>
      {error && (
        <p className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
      <button
        type="button"
        disabled={busy}
        onClick={() => submit(mode === 'signup' ? 'register' : 'login')}
        className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-sky-700 text-white font-bold text-sm transition cursor-pointer disabled:opacity-60"
      >
        {busy ? 'Please wait…' : mode === 'signup' ? 'Create free account' : 'Sign in'}
      </button>
      <button
        type="button"
        onClick={() => {
          setError('');
          setMode(mode === 'signup' ? 'login' : 'signup');
        }}
        className="w-full text-xs font-semibold text-sky-700 hover:text-sky-900 cursor-pointer"
      >
        {mode === 'signup' ? 'Already have an account? Sign in' : 'New here? Create an account'}
      </button>
      <button
        type="button"
        onClick={onGuest}
        className="w-full text-xs font-medium text-slate-500 hover:text-slate-800 cursor-pointer"
      >
        Continue as guest instead
      </button>
      {onClose && (
        <button type="button" onClick={onClose} className="w-full text-xs text-slate-400 cursor-pointer">
          Cancel
        </button>
      )}
    </div>
  );

  if (compact || mode !== 'welcome') {
    return (
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8">
        {(compact || true) && (
          <div className="flex items-center space-x-2 mb-5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-emerald-500 text-white flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-black text-slate-900">{mode === 'signup' ? 'Create your account' : 'Welcome back'}</h2>
              <p className="text-xs text-slate-500">Save itineraries across devices</p>
            </div>
          </div>
        )}
        {form}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-700/40 via-slate-950 to-emerald-900/30" />
      <div className="relative z-10 max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-teal-200 text-xs font-bold border border-white/10">
            <Sparkles className="w-3.5 h-3.5" />
            Personalized travel, minus the guesswork
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
            ItineryPlanner
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed max-w-md">
            Plan clustered day-by-day itineraries from your city to anywhere in India — trains, flights, budgets in ₹, and a printable travel guide.
          </p>
          <ul className="text-xs text-slate-300 space-y-1.5">
            <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-sky-400" /> From your city → destination, with real transit options</li>
            <li className="flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Accounts keep your trip vault private</li>
            <li className="flex items-center gap-2"><Sparkles className="w-3.5 h-3.5 text-amber-300" /> Guest mode — explore without signing up</li>
          </ul>
        </div>

        <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-3">
          <h2 className="text-lg font-black">Get started</h2>
          <p className="text-xs text-slate-500">Create an account to save trips, or jump in as a guest.</p>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-sky-700 transition cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            Create free account
          </button>
          <button
            type="button"
            onClick={() => setMode('login')}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-sky-50 text-sky-900 font-bold text-sm border border-sky-200 hover:bg-sky-100 transition cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            Sign in
          </button>
          <button
            type="button"
            onClick={onGuest}
            className="w-full py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 border border-slate-200 transition cursor-pointer"
          >
            Continue as guest — no login required
          </button>
          <p className="text-[11px] text-slate-400 text-center">
            Guest plans stay on this device. Create an account to sync your vault.
          </p>
        </div>
      </div>
    </div>
  );
};
