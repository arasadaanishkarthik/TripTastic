import React from 'react';
import { Clock, MapPin, ArrowUpRight } from 'lucide-react';

export const ActivityCard = ({ activity }) => {
  return (
    <div className="group relative p-5 rounded-2xl bg-surface border border-border shadow-md hover:border-primary/50 transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase">
              {activity.category}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-text-secondary">
              <Clock className="w-3 h-3 text-primary" /> {activity.time} ({activity.duration})
            </span>
          </div>

          <h4 className="font-heading font-bold text-base sm:text-lg text-text-main uppercase tracking-tight">
            {activity.title}
          </h4>

          <p className="inline-flex items-center gap-1 text-xs text-text-secondary">
            <MapPin className="w-3.5 h-3.5 text-primary" /> {activity.location}
          </p>

          <p className="text-xs text-text-secondary/90 pt-1 leading-relaxed">
            {activity.description}
          </p>
        </div>

        <div className="text-right flex flex-col justify-between items-end h-full">
          <span className="font-heading font-extrabold text-sm text-primary">
            ₹{activity.cost}
          </span>
          <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 group-hover:bg-primary group-hover:text-white flex items-center justify-center text-text-secondary transition-colors mt-4">
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      </div>
    </div>
  );
};