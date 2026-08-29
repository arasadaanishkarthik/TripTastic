import React from 'react';
import { motion } from 'framer-motion';
import { useTravelMode } from '../context/TravelModeContext';

export const TravelModeToggle = ({ className = '' }) => {
  const { travelMode, setTravelMode } = useTravelMode();

  const modes = [
    { id: 'national', label: 'NATIONAL', flag: '🇮🇳' },
    { id: 'international', label: 'INTERNATIONAL', flag: '🌎' },
  ];

  return (
    <div
      className={`inline-flex items-center p-1.5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/15 shadow-2xl ${className}`}
      role="tablist"
      aria-label="Select travel mode"
    >
      {modes.map((mode) => {
        const isActive = travelMode === mode.id;
        return (
          <button
            key={mode.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => setTravelMode(mode.id)}
            className={`relative px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-heading font-semibold text-xs sm:text-sm tracking-wider uppercase transition-colors duration-300 flex items-center gap-2 select-none z-10 ${
              isActive
                ? 'text-white'
                : 'text-white/60 hover:text-white/90 hover:bg-white/5'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeTravelPill"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/80 to-primary shadow-lg shadow-primary/30 border border-white/25 -z-10"
              />
            )}
            <span className="text-sm sm:text-base leading-none">{mode.flag}</span>
            <span>{mode.label}</span>
          </button>
        );
      })}
    </div>
  );
};