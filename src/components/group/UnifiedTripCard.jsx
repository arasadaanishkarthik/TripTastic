import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { UNIFIED_TRIP } from '../../data/groupPlanningData';
import { Button } from '../Button';

export const UnifiedTripCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 30, filter: 'blur(8px)' }}
      animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-surface/95 backdrop-blur-2xl border border-primary/35 shadow-2xl shadow-primary/15 text-left relative z-20"
    >
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-border">
        <span className="inline-flex items-center gap-1.5 text-xs font-heading font-extrabold text-accent uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          {UNIFIED_TRIP.badge}
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">
          <CheckCircle2 className="w-3.5 h-3.5" /> {UNIFIED_TRIP.status}
        </span>
      </div>

      <h4 className="font-heading font-extrabold text-2xl sm:text-3xl text-text-main tracking-tight uppercase mb-5">
        {UNIFIED_TRIP.title}
      </h4>

      <div className="grid grid-cols-2 gap-2.5 mb-6">
        {UNIFIED_TRIP.highlights.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-border text-xs font-semibold text-text-main"
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-border">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-text-secondary block">
            Balanced Cost
          </span>
          <span className="font-heading font-extrabold text-2xl text-primary">
            {UNIFIED_TRIP.cost}
          </span>
        </div>

        <Button variant="primary" size="md" icon={ArrowRight} className="w-full sm:w-auto">
          PLAN YOUR TRIP
        </Button>
      </div>
    </motion.div>
  );
};