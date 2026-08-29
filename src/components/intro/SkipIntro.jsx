import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export const SkipIntro = ({ onSkip }) => {
  return (
    <motion.button
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.4 }}
      onClick={onSkip}
      className="absolute top-6 right-6 z-50 px-3.5 py-1.5 rounded-full bg-black/40 hover:bg-black/70 border border-white/15 text-white/80 hover:text-white text-xs font-semibold tracking-wider uppercase backdrop-blur-md transition-all duration-200 flex items-center gap-1.5 shadow-lg group"
      aria-label="Skip intro animation"
    >
      <span>Skip Intro</span>
      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
    </motion.button>
  );
};