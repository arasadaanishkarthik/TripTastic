import React from 'react';
import { Wallet, Users, Calendar, TrendingUp } from 'lucide-react';

export const TripSummary = ({ itinerary }) => {
  const nights = Math.max(0, (Number(itinerary.durationDays) || 1) - 1);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="p-5 rounded-2xl bg-surface border border-border shadow-md space-y-1">
        <div className="flex items-center justify-between text-text-secondary">
          <span className="text-[10px] uppercase tracking-wider font-semibold">Total Budget</span>
          <Wallet className="w-4 h-4 text-primary" />
        </div>
        <div className="font-heading font-extrabold text-2xl text-text-main">
          ₹{itinerary.budget.total.toLocaleString()}
        </div>
        <span className="text-[11px] text-emerald-500 font-semibold">100% Optimized</span>
      </div>

      <div className="p-5 rounded-2xl bg-surface border border-border shadow-md space-y-1">
        <div className="flex items-center justify-between text-text-secondary">
          <span className="text-[10px] uppercase tracking-wider font-semibold">Per Person</span>
          <TrendingUp className="w-4 h-4 text-accent" />
        </div>
        <div className="font-heading font-extrabold text-2xl text-primary">
          ₹{itinerary.budget.perPerson.toLocaleString()}
        </div>
        <span className="text-[11px] text-text-secondary">Shared evenly</span>
      </div>

      <div className="p-5 rounded-2xl bg-surface border border-border shadow-md space-y-1">
        <div className="flex items-center justify-between text-text-secondary">
          <span className="text-[10px] uppercase tracking-wider font-semibold">Travelers</span>
          <Users className="w-4 h-4 text-primary" />
        </div>
        <div className="font-heading font-extrabold text-2xl text-text-main">
          {itinerary.travelers} Members
        </div>
        <span className="text-[11px] text-text-secondary">Crew synchronized</span>
      </div>

      <div className="p-5 rounded-2xl bg-surface border border-border shadow-md space-y-1">
        <div className="flex items-center justify-between text-text-secondary">
          <span className="text-[10px] uppercase tracking-wider font-semibold">Duration</span>
          <Calendar className="w-4 h-4 text-accent" />
        </div>
        <div className="font-heading font-extrabold text-2xl text-text-main">
          {itinerary.durationDays} Days
        </div>
        <span className="text-[11px] text-text-secondary">{nights} Nights included</span>
      </div>
    </div>
  );
};