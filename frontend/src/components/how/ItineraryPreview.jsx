import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2 } from 'lucide-react';

export const ItineraryPreview = () => (
  <motion.div
    initial={{ opacity: 0, x: -20, scale: 0.98 }}
    animate={{ opacity: 1, x: 0, scale: 1 }}
    exit={{ opacity: 0, x: 20, scale: 0.98 }}
    transition={{ duration: 0.4 }}
    className="w-full max-w-md mx-auto p-4 xs:p-6 sm:p-8 rounded-3xl bg-surface/90 backdrop-blur-xl border border-border shadow-xl text-left"
  >
    <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
      <span className="font-heading font-bold text-xs uppercase text-primary">DAY 01 — KERALA HILLS</span>
      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
        <CheckCircle2 className="w-3 h-3" /> AI OPTIMIZED
      </span>
    </div>

    <div className="space-y-2.5 mb-5 text-xs">
      <div className="flex items-center gap-2.5 text-text-secondary">
        <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
        <span className="truncate"><strong className="text-text-main font-semibold">09:00 AM</strong> — Mountain Breakfast</span>
      </div>
      <div className="flex items-center gap-2.5 text-text-secondary">
        <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
        <span className="truncate"><strong className="text-text-main font-semibold">10:30 AM</strong> — Munnar Tea Plantation Walk</span>
      </div>
      <div className="flex items-center gap-2.5 text-text-secondary">
        <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
        <span className="truncate"><strong className="text-text-main font-semibold">01:00 PM</strong> — Spice Valley Lunch</span>
      </div>
    </div>

    <div className="pt-3.5 border-t border-border flex items-center justify-between">
      <div>
        <span className="text-[10px] uppercase tracking-wider text-text-secondary block">Estimated Cost</span>
        <span className="font-heading font-extrabold text-lg sm:text-xl text-primary">₹5,840 / PERSON</span>
      </div>
      <span className="text-[11px] font-semibold text-accent">All Inclusive</span>
    </div>
  </motion.div>
);