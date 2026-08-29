import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export const DestinationCard = ({ destination, index }) => {
  const [imgSrc, setImgSrc] = useState(destination.image);
  const shouldReduceMotion = useReducedMotion();

  const isFeatured = destination.featured;

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 50, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.75,
        delay: shouldReduceMotion ? 0 : index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={
        !shouldReduceMotion
          ? { y: -6, transition: { duration: 0.35, ease: 'easeOut' } }
          : {}
      }
      className={`group relative overflow-hidden rounded-3xl cursor-pointer border border-border bg-surface shadow-lg transform-gpu ${destination.colSpan} ${destination.height} flex flex-col justify-between`}
    >
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-[#07111F]">
        <img
          src={imgSrc}
          onError={() => setImgSrc(destination.fallback)}
          alt={`${destination.name} — ${destination.region}`}
          loading="lazy"
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
        />

        {/* Dynamic Multi-layered Cinematic Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10 transition-opacity duration-500 group-hover:from-black/95 group-hover:via-black/45" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
      </div>

      {/* Top Metadata Header */}
      <div className="relative z-10 p-6 sm:p-8 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="text-[11px] font-semibold uppercase tracking-widest text-white/90">
            {destination.region}
          </span>
        </div>

        {/* Tactile Arrow Micro-button */}
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 group-hover:bg-primary backdrop-blur-md border border-white/20 group-hover:border-primary flex items-center justify-center text-white transition-all duration-300 shadow-md">
          <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>

      {/* Bottom Content Area */}
      <div className="relative z-10 p-6 sm:p-8 lg:p-10 space-y-2 transform transition-transform duration-300 group-hover:-translate-y-1">
        <span className="text-xs sm:text-sm font-semibold tracking-wider text-accent uppercase block">
          {destination.category}
        </span>

        <h3
          className={`font-heading font-extrabold text-white tracking-tight uppercase ${
            isFeatured
              ? 'text-3xl sm:text-5xl lg:text-6xl'
              : 'text-2xl sm:text-3xl lg:text-4xl'
          }`}
        >
          {destination.name}
        </h3>

        <p className="text-white/80 text-xs sm:text-sm font-normal max-w-lg leading-relaxed pt-1">
          {destination.tagline}
        </p>

        {/* Hover Action Link */}
        <div className="pt-3 flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wider uppercase text-primary-hover dark:text-primary group-hover:text-accent transition-colors duration-200">
          <span>Explore itineraries</span>
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </div>
      </div>
    </motion.div>
  );
};