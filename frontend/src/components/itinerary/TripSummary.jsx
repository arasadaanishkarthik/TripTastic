import React from 'react';
import { Wallet, Users, Calendar, TrendingUp } from 'lucide-react';

export const TripSummary = ({ itinerary }) => {
  const nights = Math.max(0, (Number(itinerary.durationDays) || 1) - 1);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <div className="p-3.5 sm:p-5 rounded-2xl bg-surface border border-border shadow-md space-y-1">
        <div className="flex items-center justify-between text-text-secondary">
          <span className="text-[10px] uppercase tracking-wider font-semibold">Total Budget</span>
          <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary shrink-0" />
        </div>
        <div className="font-heading font-extrabold text-lg xs:text-xl sm:text-2xl text-text-main truncate">
          ₹{itinerary.budget.total.toLocaleString()}
        </div>
        <span className="text-[10px] sm:text-[11px] text-emerald-500 font-semibold block">100% Optimized</span>
      </div>

      <div className="p-3.5 sm:p-5 rounded-2xl bg-surface border border-border shadow-md space-y-1">
        <div className="flex items-center justify-between text-text-secondary">
          <span className="text-[10px] uppercase tracking-wider font-semibold">Per Person</span>
          <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent shrink-0" />
        </div>
        <div className="font-heading font-extrabold text-lg xs:text-xl sm:text-2xl text-primary truncate">
          ₹{itinerary.budget.perPerson.toLocaleString()}
        </div>
        <span className="text-[10px] sm:text-[11px] text-text-secondary block">Shared evenly</span>
      </div>

      <div className="p-3.5 sm:p-5 rounded-2xl bg-surface border border-border shadow-md space-y-1">
        <div className="flex items-center justify-between text-text-secondary">
          <span className="text-[10px] uppercase tracking-wider font-semibold">Travelers</span>
          <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary shrink-0" />
        </div>
        <div className="font-heading font-extrabold text-lg xs:text-xl sm:text-2xl text-text-main truncate">
          {itinerary.travelers} Members
        </div>
        <span className="text-[10px] sm:text-[11px] text-text-secondary block">Crew synchronized</span>
      </div>

      <div className="p-3.5 sm:p-5 rounded-2xl bg-surface border border-border shadow-md space-y-1">
        <div className="flex items-center justify-between text-text-secondary">
          <span className="text-[10px] uppercase tracking-wider font-semibold">Duration</span>
          <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent shrink-0" />
        </div>
        <div className="font-heading font-extrabold text-lg xs:text-xl sm:text-2xl text-text-main truncate">
          {itinerary.durationDays} Days
        </div>
        <span className="text-[10px] sm:text-[11px] text-text-secondary block">{nights} Nights included</span>
      </div>
    </div>
  );
};