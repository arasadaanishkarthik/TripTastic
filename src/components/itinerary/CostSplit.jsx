import React from 'react';
import { User } from 'lucide-react';

export const CostSplit = ({ itinerary }) => {
  return (
    <div className="p-6 rounded-3xl bg-surface border border-border shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-accent block mb-1">
            Equal Allocation
          </span>
          <h4 className="font-heading font-bold text-sm uppercase text-text-main">Cost Split</h4>
        </div>
        <span className="text-xs font-semibold text-primary">{itinerary.travelers} Members</span>
      </div>

      <div className="space-y-2">
        {itinerary.travelerNames.map((name, idx) => (
          <div key={idx} className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-border flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                👤
              </span>
              <span className="font-heading font-bold text-text-main uppercase">{name}</span>
            </div>
            <span className="font-bold text-primary">₹{itinerary.budget.perPerson.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};