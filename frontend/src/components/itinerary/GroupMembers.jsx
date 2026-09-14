import React from 'react';
import { UserPlus } from 'lucide-react';

export const GroupMembers = ({ itinerary }) => {
  return (
    <div className="p-6 rounded-3xl bg-surface border border-border shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-heading font-bold text-sm uppercase text-text-main">Traveling With</h4>
        <button className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold transition-colors">
          <UserPlus className="w-3.5 h-3.5" /> Invite
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {itinerary.travelerNames.map((name, idx) => (
          <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-border text-xs">
            <span className="w-6 h-6 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-[10px]">
              {name.charAt(0)}
            </span>
            <span className="font-heading font-bold text-text-main uppercase">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};