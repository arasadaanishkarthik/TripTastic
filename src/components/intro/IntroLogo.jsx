import React from 'react';
import { motion } from 'framer-motion';

export const IntroLogo = ({ isVisible }) => {
  return (
    <div className="relative z-30 flex flex-col items-center justify-center text-center select-none">
      {/* Ambient Pulsing Radial Aura */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={
          isVisible
            ? { opacity: [0, 0.8, 0.5], scale: [0.6, 1.4, 1.2] }
            : { opacity: 0 }
        }
        transition={{ duration: 2.2, ease: 'easeOut' }}
        className="absolute w-80 h-80 sm:w-[420px] sm:h-[420px] rounded-full bg-gradient-to-tr from-primary/35 via-emerald-500/25 to-accent/25 blur-3xl pointer-events-none"
      />

      {/* TT Monogram */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0, filter: 'blur(16px)' }}
        animate={
          isVisible
            ? { scale: 1, opacity: 1, filter: 'blur(0px)' }
            : { scale: 0.5, opacity: 0, filter: 'blur(16px)' }
        }
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white font-heading font-black text-2xl sm:text-3xl shadow-2xl shadow-primary/40 border border-white/20 mb-5"
      >
        TT
      </motion.div>

      {/* Brand Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
        animate={
          isVisible
            ? { opacity: 1, y: 0, filter: 'blur(0px)' }
            : { opacity: 0, y: 20 }
        }
        transition={{ delay: 0.35, duration: 0.9, ease: 'easeOut' }}
        className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight uppercase"
      >
        TripTastic
      </motion.h2>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={isVisible ? { opacity: 0.9, y: 0 } : { opacity: 0 }}
        transition={{ delay: 0.7, duration: 0.8, ease: 'easeOut' }}
        className="mt-3 text-xs sm:text-base font-medium tracking-[0.25em] text-accent uppercase"
      >
        Explore More. Worry Less.
      </motion.p>
    </div>
  );
};