import React from 'react';
import { MapPin } from 'lucide-react';

export const DestinationResult = ({ destination, onSelect, isHighlighted }) => {
  return (
    <div
      onClick={() => onSelect(destination)}
      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between text-left ${
        isHighlighted
          ? 'bg-primary/10 border-primary shadow-md ring-2 ring-primary/20'
          : 'bg-surface hover:bg-black/5 dark:hover:bg-white/5 border-border'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center text-primary flex-shrink-0">
          <MapPin className="w-4 h-4" />
        </div>
        <div>
          <h4 className="font-heading font-bold text-sm text-text-main uppercase tracking-tight">
            {destination.name}
          </h4>
          <span className="text-[11px] text-text-secondary block">
            {destination.state} • {destination.country}
          </span>
        </div>
      </div>
      <div className="text-right flex flex-col items-end">
        <span className="text-[10px] font-bold uppercase tracking-widest text-accent px-2 py-0.5 rounded-full bg-primary/10">
          {destination.region}
        </span>
      </div>
    </div>
  );
};