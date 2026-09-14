import React from 'react';
import { motion } from 'framer-motion';
import { DestinationCard } from '../components/DestinationCard';

export const TravelChoiceSection = () => {
  return (
    <section id="explore" className="py-20 sm:py-32 bg-bg transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <span className="text-xs font-semibold tracking-widest text-primary uppercase">
            Curated Horizons
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-text-main tracking-tight uppercase">
            Where Will You Go?
          </h2>
          <p className="mt-4 text-text-secondary text-sm sm:text-base leading-relaxed">
            Choose your next canvas. Journey across iconic domestic landscapes or traverse global borders with seamless group coordination.
          </p>
        </motion.div>

        {/* Dual Destination Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <DestinationCard
              tag="🇮🇳 India"
              subtitle="Discover India"
              title="From Himalayan Peaks to Coastal Backwaters"
              locationCount="28 States • 120+ Curated Routes"
              imageSrc="https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1400&q=80"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <DestinationCard
              tag="🌎 World"
              subtitle="Explore the World"
              title="Vibrant Metropolises & Untamed Frontiers"
              locationCount="6 Continents • 50+ Countries"
              imageSrc="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1400&q=80"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};