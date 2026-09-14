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
    className="w-full max-w-md mx-auto p-4 xs:p-6 sm:p-8 rounded-3xl bg-surface/90 backdrop-blur-xl border border-border shadow-xl text-left"
  >
    <span className="text-[10px] uppercase tracking-widest font-semibold text-accent block mb-3.5">
      Step 02 — Collaborative Crew
    </span>
    <div className="grid grid-cols-1 xs:grid-cols-2 gap-2.5">
      {crew.map((member, idx) => (
        <div key={idx} className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-border">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
              👤
            </span>
            <span className="font-heading font-bold text-xs uppercase text-text-main truncate">{member.name}</span>
          </div>
          <div className="text-[11px] text-text-secondary font-medium truncate">{member.pref}</div>
          <div className="text-[10px] text-primary font-semibold mt-0.5">Budget: {member.budget}</div>
        </div>
      ))}
    </div>
  </motion.div>
);