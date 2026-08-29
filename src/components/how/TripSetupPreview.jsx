import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Wallet, MapPin } from 'lucide-react';

export const TripSetupPreview = () => (
  <motion.div
    initial={{ opacity: 0, x: -20, scale: 0.98 }}
    animate={{ opacity: 1, x: 0, scale: 1 }}
    exit={{ opacity: 0, x: 20, scale: 0.98 }}
    transition={{ duration: 0.4 }}
    className="w-full max-w-md mx-auto p-6 sm:p-8 rounded-3xl bg-surface/90 backdrop-blur-xl border border-border shadow-xl text-left"
  >
    <span className="text-[10px] uppercase tracking-widest font-semibold text-accent block mb-4">
      Step 01 — Demonstration UI
    </span>
    <div className="space-y-4">
      <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-primary" />
          <span className="text-xs text-text-secondary uppercase">Destination</span>
        </div>
        <span className="font-heading font-bold text-sm text-text-main">Kerala</span>
      </div>

      <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-primary" />
          <span className="text-xs text-text-secondary uppercase">Dates</span>
        </div>
        <span className="font-heading font-bold text-sm text-text-main">12 — 15 Oct</span>
      </div>

      <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-primary" />
          <span className="text-xs text-text-secondary uppercase">Group Size</span>
        </div>
        <span className="font-heading font-bold text-sm text-text-main">4 Travelers</span>
      </div>

      <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Wallet className="w-5 h-5 text-primary" />
          <span className="text-xs text-text-secondary uppercase">Max Budget</span>
        </div>
        <span className="font-heading font-bold text-sm text-primary">₹6,000 / person</span>
      </div>
    </div>
  </motion.div>
);