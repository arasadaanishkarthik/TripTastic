import React from 'react';
import { motion } from 'framer-motion';

export const JourneyRoute = () => {
  return (
    <div className="py-2 flex items-center justify-center gap-2 opacity-60">
      <span className="text-[10px] uppercase tracking-wider text-text-secondary">Destination</span>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-12 h-0.5 bg-gradient-to-r from-primary to-accent origin-left"
      />
      <span className="text-[10px] uppercase tracking-wider text-text-secondary">Activity</span>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 2, delay: 0.5, repeat: Infinity }}
        className="w-12 h-0.5 bg-gradient-to-r from-accent to-primary origin-left"
      />
      <span className="text-[10px] uppercase tracking-wider text-text-secondary">Itinerary</span>
    </div>
  );
};