'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';
import { BookingLink } from '@/types/travel';

export const BookingChips: React.FC<{ links?: BookingLink[]; compact?: boolean }> = ({ links, compact }) => {
  if (!links || links.length === 0) return null;
  return (
    <div className={`flex flex-wrap gap-1.5 ${compact ? 'mt-2' : 'mt-2.5'}`}>
      {links.map((link) => (
        <a
          key={`${link.partner}-${link.label}`}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white border border-slate-200 hover:border-sky-400 hover:text-sky-800 text-[10px] font-bold text-slate-700 transition"
        >
          {link.label}
          <ExternalLink className="w-2.5 h-2.5" />
        </a>
      ))}
    </div>
  );
};
