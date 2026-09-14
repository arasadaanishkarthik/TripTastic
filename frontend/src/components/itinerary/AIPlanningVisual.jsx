import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export const AIPlanningVisual = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative flex flex-col items-center justify-center p-8">
      {/* Outer Rotating Ring */}
      {!shouldReduceMotion && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute w-36 h-36 rounded-full border border-dashed border-primary/40"
        />
      )}

      {/* Pulsing Glow Background */}
      <motion.div
        animate={
          !shouldReduceMotion
            ? { scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }
            : {}
        }
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-accent blur-xl"
      />

      {/* Central Glass Node */}
      <div className="relative z-10 w-20 h-20 rounded-3xl bg-surface/95 backdrop-blur-2xl border border-primary/40 shadow-2xl shadow-primary/20 flex items-center justify-center text-primary">
        <Sparkles className="w-8 h-8 animate-pulse text-accent" />
      </div>

      <div className="mt-5 text-center relative z-10">
        <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-accent block mb-1">
          ✦ TRIPTASTIC AI
        </span>
        <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-text-main uppercase tracking-tight">
          Building Your Journey
        </h3>
      </div>
    </div>
  );
};