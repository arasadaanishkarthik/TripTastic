import React from 'react';
import { MapPin } from 'lucide-react';

export const TripMap = ({ itinerary }) => {
  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-accent block mb-1">
            Route Visualization
          </span>
          <h3 className="font-heading font-extrabold text-xl sm:text-2xl uppercase text-text-main">
            Journey Flow Map
          </h3>
        </div>
        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          Optimized Path
        </span>
      </div>

      {/* Abstract Simulated Map Preview Container */}
      <div className="relative w-full h-64 rounded-2xl bg-[#07111F] border border-border overflow-hidden flex items-center justify-center p-6">
        <div className="absolute inset-0 bg-[radial-gradient(#19B5A5_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between w-full max-w-lg gap-4">
          {itinerary.days.map((d, idx) => (
            <div key={d.day} className="flex flex-col items-center text-center space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center font-heading font-bold text-xs shadow-lg shadow-primary/30">
                0{d.day}
              </div>
              <span className="text-[11px] font-bold text-white uppercase tracking-wider">
                {d.title.split('&')[0]}
              </span>
              <span className="text-[10px] text-white/60">Day {d.day} Stop</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};