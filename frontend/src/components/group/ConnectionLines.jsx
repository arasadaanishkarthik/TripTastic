import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export const ConnectionLines = ({ active }) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) return null;

  return (
    <svg
      viewBox="0 0 800 500"
      fill="none"
      className="absolute inset-0 w-full h-full pointer-events-none z-10 hidden lg:block overflow-visible"
    >
      <defs>
        <linearGradient id="connectGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#19B5A5" stopOpacity="0.15" />
          <stop offset="50%" stopColor="#19B5A5" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.85" />
        </linearGradient>
      </defs>

      {/* Top Left -> Center */}
      <motion.path
        d="M 180 120 C 280 160, 320 220, 400 250"
        stroke="url(#connectGrad)"
        strokeWidth="2"
        strokeDasharray="5 7"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={active ? { pathLength: 1, opacity: 0.7 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 1.1, ease: 'easeInOut' }}
      />
      {/* Top Right -> Center */}
      <motion.path
        d="M 620 120 C 520 160, 480 220, 400 250"
        stroke="url(#connectGrad)"
        strokeWidth="2"
        strokeDasharray="5 7"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={active ? { pathLength: 1, opacity: 0.7 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 1.1, ease: 'easeInOut', delay: 0.1 }}
      />
      {/* Bottom Left -> Center */}
      <motion.path
        d="M 180 380 C 280 340, 320 280, 400 250"
        stroke="url(#connectGrad)"
        strokeWidth="2"
        strokeDasharray="5 7"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={active ? { pathLength: 1, opacity: 0.7 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 1.1, ease: 'easeInOut', delay: 0.2 }}
      />
      {/* Bottom Right -> Center */}
      <motion.path
        d="M 620 380 C 520 340, 480 280, 400 250"
        stroke="url(#connectGrad)"
        strokeWidth="2"
        strokeDasharray="5 7"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={active ? { pathLength: 1, opacity: 0.7 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 1.1, ease: 'easeInOut', delay: 0.3 }}
      />
    </svg>
  );
};