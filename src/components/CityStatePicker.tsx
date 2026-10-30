'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import { INDIAN_CITY_INDEX } from '@/lib/indian-cities';

export type CityOption = {
  city: string;
  region: string;
  country: string;
  vibe?: string;
  aliases: string[];
};

const WORLD_CITIES: CityOption[] = [
  { city: 'Tokyo', region: 'Japan', country: 'Japan', vibe: 'Urban', aliases: [] },
  { city: 'Paris', region: 'France', country: 'France', vibe: 'Cultural', aliases: [] },
  { city: 'Rome', region: 'Italy', country: 'Italy', vibe: 'Cultural', aliases: [] },
  { city: 'Bali', region: 'Indonesia', country: 'Indonesia', vibe: 'Beach', aliases: ['Ubud'] },
  { city: 'Interlaken', region: 'Switzerland', country: 'Switzerland', vibe: 'Mountains', aliases: [] },
  { city: 'New York City', region: 'USA', country: 'USA', vibe: 'Urban', aliases: ['NYC'] }
];

export const CITY_DIRECTORY: CityOption[] = [
  ...INDIAN_CITY_INDEX.map((c) => ({
    city: c.city,
    region: c.state,
    country: 'India',
    vibe: c.vibe,
    aliases: c.aliases || []
  })),
  ...WORLD_CITIES
];

export function cityStateLabel(city: string): string {
  const q = city.trim().toLowerCase();
  const hit = CITY_DIRECTORY.find(
    (c) =>
      c.city.toLowerCase() === q ||
      c.aliases.some((a) => a.toLowerCase() === q)
  );
  if (!hit) return city;
  return `${hit.city}, ${hit.region}`;
}

function rankScore(c: CityOption, q: string): number {
  const n = q.toLowerCase().trim();
  if (!n) return 1;
  const city = c.city.toLowerCase();
  const region = c.region.toLowerCase();
  const aliases = c.aliases.map((a) => a.toLowerCase());
  if (city === n || aliases.includes(n)) return 100;
  if (city.startsWith(n)) return 90;
  if (aliases.some((a) => a.startsWith(n))) return 85;
  if (region === n) return 70;
  if (region.startsWith(n)) return 60;
  if (city.includes(n)) return 50;
  if (aliases.some((a) => a.includes(n))) return 45;
  if (region.includes(n)) return 30;
  return 0;
}

export function searchCityDirectory(query: string, limit = 18): CityOption[] {
  const q = query.trim();
  const scored = CITY_DIRECTORY
    .map((c) => ({ c, s: rankScore(c, q) }))
    .filter((x) => (q ? x.s > 0 : true))
    .sort((a, b) => b.s - a.s || a.c.city.localeCompare(b.c.city));
  return scored.slice(0, q ? limit : 12).map((x) => x.c);
}

interface CityStatePickerProps {
  label: string;
  value: string;
  onSelect: (city: string, option: CityOption) => void;
  placeholder?: string;
  accent?: 'sky' | 'rose';
}

export const CityStatePicker: React.FC<CityStatePickerProps> = ({
  label,
  value,
  onSelect,
  placeholder = 'Type a city…',
  accent = 'sky'
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const selectedLabel = value ? cityStateLabel(value) : '';
  const display = open ? query : selectedLabel;

  const results = useMemo(() => searchCityDirectory(open ? query : '', 20), [open, query]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const pick = (opt: CityOption) => {
    onSelect(opt.city, opt);
    setOpen(false);
    setQuery('');
    setActive(0);
  };

  const ring = accent === 'rose' ? 'focus:ring-rose-500 border-rose-200' : 'focus:ring-sky-500 border-sky-200';

  return (
    <div ref={wrapRef} className="relative">
      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
        <MapPin className={`w-3.5 h-3.5 ${accent === 'rose' ? 'text-rose-500' : 'text-sky-600'}`} />
        {label}
      </label>
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          autoComplete="off"
          placeholder={placeholder}
          value={display}
          onFocus={() => {
            setOpen(true);
            setQuery(selectedLabel && !query ? '' : query);
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActive(0);
          }}
          onKeyDown={(e) => {
            if (!open) return;
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setActive((i) => Math.min(i + 1, results.length - 1));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setActive((i) => Math.max(i - 1, 0));
            } else if (e.key === 'Enter' && results[active]) {
              e.preventDefault();
              pick(results[active]);
            } else if (e.key === 'Escape') {
              setOpen(false);
            }
          }}
          className={`w-full text-xs font-medium bg-white border rounded-lg pl-8 pr-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 ${ring}`}
        />
      </div>
      {open && (
        <div className="absolute z-50 mt-1 w-full max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
          {results.length === 0 ? (
            <p className="px-3 py-2 text-[11px] text-slate-500">No matching city in the database.</p>
          ) : (
            results.map((c, idx) => {
              const alias = c.aliases.length ? ` · ${c.aliases.slice(0, 2).join(', ')}` : '';
              return (
                <button
                  key={`${c.city}-${c.region}`}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pick(c)}
                  className={`w-full text-left px-3 py-2 border-b border-slate-50 last:border-0 ${
                    idx === active ? 'bg-sky-50' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900">{c.city}</div>
                  <div className="text-[11px] text-slate-500">
                    {c.region}
                    {c.country === 'India' ? ', India' : ''}
                    {c.vibe ? ` · ${c.vibe}` : ''}
                    {alias}
                  </div>
                </button>
              );
            })
          )}
          <p className="px-3 py-1.5 text-[10px] text-slate-400 bg-slate-50">
            Showing city + state from database · {CITY_DIRECTORY.length} places
          </p>
        </div>
      )}
      {value && !open && (
        <p className="text-[11px] text-slate-500 mt-1">Selected: <span className="font-semibold text-slate-800">{cityStateLabel(value)}</span></p>
      )}
    </div>
  );
};
