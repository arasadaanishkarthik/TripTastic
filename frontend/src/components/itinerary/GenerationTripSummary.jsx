import React from 'react';
import { PREFERENCE_OPTIONS } from '../../data/destinations';

export const GenerationTripSummary = ({ trip }) => {
  if (!trip || !trip.destination.name) return null;

  return (
    <div className="p-5 rounded-3xl bg-surface/90 backdrop-blur-xl border border-border shadow-xl text-left max-w-md mx-auto space-y-3">
      <div className="flex items-center justify-between border-b border-border pb-2.5">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-accent">Your Trip</span>
        <span className="text-xs font-bold text-primary">₹{trip.budgetPerPerson?.toLocaleString()} / person</span>
      </div>

      <h4 className="font-heading font-extrabold text-lg text-text-main uppercase">
        {trip.destination.name}
      </h4>

      <div className="flex items-center gap-3 text-xs text-text-secondary">
        <span>📅 {trip.dates.start || 'TBD'} → {trip.dates.end || 'TBD'}</span>
        <span>•</span>
        <span>👥 {trip.groupSize} Travelers</span>
      </div>

      <div className="flex flex-wrap gap-1 pt-1">
        {trip.preferences?.map((pId) => {
          const p = PREFERENCE_OPTIONS.find((opt) => opt.id === pId);
          if (!p) return null;
          return (
            <span key={p.id} className="px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/5 text-[10px] font-semibold text-text-main">
              {p.icon} {p.label}
            </span>
          );
        })}
      </div>
    </div>
  );
};