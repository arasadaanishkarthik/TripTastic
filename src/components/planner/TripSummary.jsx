import React from 'react';
import { useTripPlanner } from '../../context/TripPlannerContext';

export const TripSummary = () => {
  const { trip } = useTripPlanner();
  const total = trip.budgetPerPerson * trip.groupSize;

  return (
    <div className="p-6 rounded-3xl bg-surface border border-border shadow-xl space-y-4 select-none">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-accent block">
        ✦ Live Summary
      </span>

      <h4 className="font-heading font-extrabold text-xl text-text-main uppercase">
        {trip.destination.name || 'Destination...'}
      </h4>

      <div className="space-y-2 text-xs border-t border-b border-border py-3 text-text-secondary">
        <div className="flex justify-between">
          <span>Dates:</span>
          <span className="font-semibold text-text-main">{trip.dates.start || '—'} to {trip.dates.end || '—'}</span>
        </div>
        <div className="flex justify-between">
          <span>Crew:</span>
          <span className="font-semibold text-text-main">{trip.groupSize} Travelers</span>
        </div>
        <div className="flex justify-between">
          <span>Budget/person:</span>
          <span className="font-semibold text-primary">₹{trip.budgetPerPerson.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Total Budget:</span>
          <span className="font-semibold text-primary">₹{total.toLocaleString()}</span>
        </div>
      </div>

      <div>
        <span className="text-[10px] uppercase tracking-wider text-text-secondary block mb-1">Crew</span>
        <div className="flex flex-wrap gap-1">
          {trip.travelers.map((t, idx) => (
            <span key={idx} className="px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/5 text-[11px] font-medium text-text-main">
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};