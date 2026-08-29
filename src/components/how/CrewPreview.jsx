
import React from 'react';
import { motion } from 'framer-motion';

const crew = [
  { name: 'Anish', pref: '🏔️ Adventure', budget: '₹6,000' },
  { name: 'Rahul', pref: '🍜 Food', budget: '₹5,000' },
  { name: 'Priya', pref: '🏖️ Beaches', budget: '₹7,000' },
  { name: 'Arjun', pref: '📸 Photography', budget: '₹6,500' },
];

export const CrewPreview = () => (
  <motion.div
    initial={{ opacity: 0, x: -20, scale: 0.98 }}
    animate={{ opacity: 1, x: 0, scale: 1 }}
    exit={{ opacity: 0, x: 20, scale: 0.98 }}
    transition={{ duration: 0.4 }}
    className="w-full max-w-md mx-auto p-6 sm:p-8 rounded-3xl bg-surface/90 backdrop-blur-xl border border-border shadow-xl text-left"
  >
    <span className="text-[10px] uppercase tracking-widest font-semibold text-accent block mb-4">
      Step 02 — Collaborative Crew
    </span>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {crew.map((member, idx) => (
        <div key={idx} className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
              👤
            </span>
            <span className="font-heading font-bold text-xs uppercase text-text-main">{member.name}</span>
          </div>
          <div className="text-[11px] text-text-secondary font-medium">{member.pref}</div>
          <div className="text-[10px] text-primary font-semibold mt-1">Budget: {member.budget}</div>
        </div>
      ))}
    </div>
  </motion.div>
);