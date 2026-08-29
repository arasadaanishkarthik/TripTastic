import React from 'react';
import { Sparkles } from 'lucide-react';

export const GroupPreferences = ({ itinerary }) => {
  return (
    <div className="p-6 rounded-3xl bg-surface border border-border shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-heading font-bold text-sm uppercase text-text-main">Your Group Loves</h4>
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">
          <Sparkles className="w-3 h-3" /> {itinerary.aiMatch}% AI Match
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {itinerary.preferences.map((pref, idx) => (
          <span key={idx} className="px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
            {pref}
          </span>
        ))}
      </div>

      <p className="text-xs text-text-secondary pt-1 leading-relaxed">
        {itinerary.whyDestination}
      </p>
    </div>
  );
};