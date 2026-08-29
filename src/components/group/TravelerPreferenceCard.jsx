import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export const TravelerPreferenceCard = ({ traveler, positionClass = '' }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      animate={
        !shouldReduceMotion
          ? {
              y: [0, -6, 0, 6, 0],
              transition: {
                duration: 5.5,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            }
          : {}
      }
      className={`w-60 sm:w-64 p-4 rounded-2xl bg-surface/85 backdrop-blur-xl border border-border shadow-xl select-none ${positionClass}`}
    >
      <div className="flex items-center gap-2.5 pb-2.5 mb-2.5 border-b border-border/60">
        <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm">
          {traveler.avatar}
        </span>
        <span className="font-heading font-bold text-sm tracking-wider uppercase text-text-main">
          {traveler.name}
        </span>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-text-secondary">Preference</span>
          <span className="font-semibold text-text-main flex items-center gap-1.5">
            <span>{traveler.icon}</span> {traveler.preference}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-text-secondary">Budget limit</span>
          <span className="font-bold text-primary font-heading">{traveler.budget}</span>
        </div>
      </div>
    </motion.div>
  );
};