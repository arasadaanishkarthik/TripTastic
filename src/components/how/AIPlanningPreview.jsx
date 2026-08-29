import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Check } from 'lucide-react';

const checklist = [
  'Destination parameters',
  'Group preferences',
  'Individual budgets',
  'Activity schedules',
  'Route optimization',
];

export const AIPlanningPreview = () => {
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    setCompletedCount(0);
    const interval = setInterval(() => {
      setCompletedCount((prev) => (prev < checklist.length ? prev + 1 : prev));
    }, 450);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.98 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md mx-auto p-6 sm:p-8 rounded-3xl bg-surface/90 backdrop-blur-xl border border-primary/30 shadow-xl text-left relative overflow-hidden"
    >
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-md">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h5 className="font-heading font-bold text-sm uppercase text-text-main">TRIPTASTIC AI</h5>
          <span className="text-[10px] text-accent font-semibold tracking-wider uppercase">
            {completedCount === checklist.length ? 'ITINERARY OPTIMIZED ✓' : 'ANALYZING GROUP PREFERENCES...'}
          </span>
        </div>
      </div>

      <div className="space-y-2.5">
        {checklist.map((item, idx) => {
          const isDone = idx < completedCount;
          return (
            <div
              key={idx}
              className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all duration-300 ${
                isDone
                  ? 'bg-primary/10 border-primary/30 text-text-main font-semibold'
                  : 'bg-black/5 dark:bg-white/5 border-border text-text-secondary opacity-50'
              }`}
            >
              <span>{item}</span>
              {isDone && <Check className="w-4 h-4 text-primary" />}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};