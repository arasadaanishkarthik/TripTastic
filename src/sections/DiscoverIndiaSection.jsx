import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Compass, Sparkles } from 'lucide-react';
import { DESTINATIONS } from '../data/destinationsData';
import { DestinationCard } from '../components/DestinationCard';
import { useTravelMode } from '../context/TravelModeContext';

export const DiscoverIndiaSection = () => {
  const { travelMode } = useTravelMode();
  const shouldReduceMotion = useReducedMotion();

  // Filter destinations by active travel mode
  const currentDestinations = DESTINATIONS.filter(
    (dest) => dest.mode === travelMode || travelMode === 'national'
  );

  return (
    <section
      id="discover"
      className="relative z-20 py-24 sm:py-36 bg-bg text-text-main transition-colors duration-500 overflow-hidden"
    >
      {/* Background Ambience / Subtle Top Blend */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#07111F] to-transparent pointer-events-none opacity-40 dark:opacity-70" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary mb-4"
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase">
              {travelMode === 'national' ? 'Curated National Discovery' : 'Global Frontiers'}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight uppercase text-text-main leading-[1.1]"
          >
            {travelMode === 'national' ? (
              <>
                DISCOVER INDIA. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  FROM MOUNTAINS TO COASTLINES.
                </span>
              </>
            ) : (
              <>
                DISCOVER THE WORLD. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  ACROSS CONTINENTS & OCEANS.
                </span>
              </>
            )}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-5 text-sm sm:text-base md:text-lg text-text-secondary font-normal leading-relaxed max-w-2xl"
          >
            {travelMode === 'national'
              ? "Explore India's diverse landscapes, ancient cultures, misty hill sanctuaries, and unforgettable group adventures—effortlessly coordinated by intelligent AI."
              : 'Traverse iconic global metropolises, remote alpine wilderness, and coastal paradises with seamless AI itinerary planning.'}
          </motion.p>
        </div>

        {/* Asymmetric Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 sm:gap-7 lg:gap-8">
          {currentDestinations.map((destination, index) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};