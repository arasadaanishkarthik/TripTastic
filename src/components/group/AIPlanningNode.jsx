import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export const AIPlanningNode = () => {
  return (
    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      className="relative z-20 flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl bg-surface/90 backdrop-blur-2xl border border-primary/40 shadow-2xl shadow-primary/20 select-none text-center"
    >
      <div className="relative mb-3">
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.35, 0.7, 0.35],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-primary to-accent blur-md"
        />
        <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-lg">
          <Sparkles className="w-7 h-7" />
        </div>
      </div>

      <h4 className="font-heading font-extrabold text-base sm:text-lg tracking-wider uppercase text-text-main">
        TRIPTASTIC AI
      </h4>
      <span className="text-[11px] font-semibold text-accent uppercase tracking-widest mt-1">
        SYNTHESIZING PREFERENCES
      </span>
    </motion.div>
  );
};