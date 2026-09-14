import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ActivityCard } from './ActivityCard';

export const DayTimeline = ({ dayData }) => {
  if (!dayData) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={dayData.day}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        className="space-y-6"
      >
        <div className="border-b border-border pb-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-accent block mb-1">
            Day 0{dayData.day} Itinerary
          </span>
          <h3 className="font-heading font-extrabold text-2xl sm:text-3xl uppercase text-text-main">
            {dayData.title}
          </h3>
        </div>

        {/* Vertical Timeline Track */}
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-border">
          {dayData.activities.map((activity, index) => (
            <div key={activity.id || index} className="relative">
              {/* Timeline Node Dot */}
              <div className="absolute -left-6 sm:-left-8 top-5 w-3.5 h-3.5 rounded-full bg-primary border-4 border-bg shadow-sm" />
              <ActivityCard activity={activity} />
            </div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};