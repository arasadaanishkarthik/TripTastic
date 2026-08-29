import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

export const ScrollIndicator = () => {
  const handleScrollClick = () => {
    const nextSection = document.getElementById('explore');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.1, duration: 0.8 }}
      onClick={handleScrollClick}
      className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-secondary select-none cursor-pointer group z-20"
      aria-label="Scroll to explore section"
      role="button"
      tabIndex={0}
    >
      <span className="text-[10px] tracking-[0.25em] font-semibold uppercase opacity-75 group-hover:opacity-100 group-hover:text-text-main transition-all">
        Scroll to explore
      </span>
      <motion.div
        animate={{ y: [0, 5, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        className="p-1 rounded-full text-primary"
      >
        <ArrowDown className="w-4 h-4" />
      </motion.div>
    </motion.div>
  );
};