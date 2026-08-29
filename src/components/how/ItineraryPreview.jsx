import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2 } from 'lucide-react';

export const ItineraryPreview = () => (
  <motion.div
    initial={{ opacity: 0, x: -20, scale: 0.98 }}
    animate={{ opacity: 1, x: 0, scale: 1 }}
    exit={{ opacity: 0, x: 20, scale: 0.98 }}
    transition={{ duration: 0.4 }}
    className="w-full max-w-md mx-auto p-6 sm:p-8 rounded-3xl bg-surface/90 backdrop-blur-xl border border-border shadow-xl text-left"
  >
    <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
      <span className="font-heading font-bold text-xs uppercase text-primary">DAY 01 — KERALA HILLS</span>
      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
        <CheckCircle2 className="w-3 h-3" /> AI OPTIMIZED
      </span>
    </div>

    <div className="space-y-3 mb-5 text-xs">
      <div className="flex items-center gap-3 text-text-secondary">
        <Clock className="w-3.5 h-3.5 text-primary" />
        <span className="font-semibold text-text-main">09:00 AM</span> — Mountain Breakfast
      </div>
      <div className="flex items-center gap-3 text-text-secondary">
        <Clock className="w-3.5 h-3.5 text-primary" />
        <span className="font-semibold text-text-main">10:30 AM</span> — Munnar Tea Plantation Walk
      </div>
      <div className="flex items-center gap-3 text-text-secondary">
        <Clock className="w-3.5 h-3.5 text-primary" />
        <span className="font-semibold text-text-main">01:00 PM</span> — Spice Valley Lunch
      </div>
    </div>

    <div className="pt-4 border-t border-border flex items-center justify-between">
      <div>
        <span className="text-[10px] uppercase tracking-wider text-text-secondary block">Estimated Cost</span>
        <span className="font-heading font-extrabold text-xl text-primary">₹5,840 / PERSON</span>
      </div>
      <span className="text-[11px] font-semibold text-accent">All Inclusive</span>
    </div>
  </motion.div>
);