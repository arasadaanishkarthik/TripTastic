import React from 'react';
import { MapPin } from 'lucide-react';

export const PopularDestinations = ({ destinations, onSelect }) => {
  return (
    <div className="space-y-3">
      <span className="text-[10px] font-bold tracking-widest uppercase text-text-secondary block px-1">
        Popular Destinations
      </span>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {destinations.map((dest) => (
          <button
            key={dest.id}
            onClick={() => onSelect(dest)}
            className="p-3.5 rounded-2xl bg-surface hover:bg-black/5 dark:hover:bg-white/5 border border-border text-left transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-xs text-text-main uppercase">
                  {dest.name}
                </h4>
                <span className="text-[10px] text-text-secondary">{dest.region}</span>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-accent uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10">
              {dest.category}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};