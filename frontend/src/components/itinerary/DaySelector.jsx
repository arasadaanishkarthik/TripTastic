import React from 'react';

export const DaySelector = ({ days, activeDay, setActiveDay }) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {days.map((d) => {
        const isActive = activeDay === d.day;
        return (
          <button
            key={d.day}
            onClick={() => setActiveDay(d.day)}
            className={`px-5 py-3 rounded-2xl font-heading font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2.5 ${
              isActive
                ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-105'
                : 'bg-surface hover:bg-black/5 dark:hover:bg-white/5 border border-border text-text-secondary'
            }`}
          >
            <span>Day 0{d.day}</span>
            <span className={`text-[10px] font-normal ${isActive ? 'text-white/80' : 'text-text-secondary/70'}`}>
              • {d.title}
            </span>
          </button>
        );
      })}
    </div>
  );
};
