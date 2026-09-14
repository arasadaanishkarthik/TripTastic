import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { getDestinationImage } from '../services/api';
import { useTripPlanner } from '../context/TripPlannerContext';

export const DestinationCard = ({ destination, index }) => {
  const navigate = useNavigate();
  const { updateTrip } = useTripPlanner();
  const [imgSrc, setImgSrc] = useState(destination.image || destination.fallback);
  const [imgLoaded, setImgLoaded] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const isFeatured = destination.featured;

  useEffect(() => {
    let cancelled = false;
    if (destination.name) {
      getDestinationImage(destination.name)
        .then((res) => {
          if (!cancelled && res?.url) {
            setImgSrc(res.url);
          }
        })
        .catch(() => {
          // Retain verified fallback
        });
    }
    return () => { cancelled = true; };
  }, [destination.name]);

  const handleCardClick = () => {
    updateTrip({
      destination: {
        id:          destination.id,
        name:        destination.name,
        region:      destination.region || '',
        description: destination.tagline || destination.category || '',
        category:    destination.category || 'nature',
        image:       imgSrc,
        mode:        destination.mode || 'national',
      },
    });
    navigate('/plan');
  };

  return (
    <motion.div
      onClick={handleCardClick}
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 40, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.65,
        delay: shouldReduceMotion ? 0 : Math.min(index * 0.08, 0.4),
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={
        !shouldReduceMotion
          ? { y: -6, transition: { duration: 0.3, ease: 'easeOut' } }
          : {}
      }
      className={`group relative overflow-hidden rounded-3xl cursor-pointer border border-border bg-[#07111F] shadow-xl transform-gpu ${destination.colSpan} ${destination.height} flex flex-col justify-between`}
    >
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-gradient-to-br from-[#09182C] to-[#040812]">
        <img
          src={imgSrc}
          onError={() => setImgSrc(destination.fallback)}
          onLoad={() => setImgLoaded(true)}
          alt={`${destination.name} — ${destination.region}`}
          loading="lazy"
          className={`w-full h-full object-cover object-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 ${
            imgLoaded ? 'opacity-100' : 'opacity-80'
          }`}
        />

        {/* Cinematic Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/15 transition-opacity duration-500 group-hover:from-black/95 group-hover:via-black/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
      </div>

      {/* Top Metadata Header */}
      <div className="relative z-10 p-4 xs:p-5 sm:p-6 lg:p-8 flex items-center justify-between gap-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/15">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-white/90 truncate max-w-[160px] xs:max-w-none">
            {destination.region}
          </span>
        </div>

        {/* Tactile Arrow Micro-button */}
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 group-hover:bg-primary backdrop-blur-md border border-white/20 group-hover:border-primary flex items-center justify-center text-white transition-all duration-300 shadow-md shrink-0">
          <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>

      {/* Bottom Content Area */}
      <div className="relative z-10 p-4 xs:p-5 sm:p-6 lg:p-8 space-y-1.5 transform transition-transform duration-300 group-hover:-translate-y-0.5">
        <span className="text-[11px] sm:text-xs font-semibold tracking-wider text-accent uppercase block">
          {destination.category}
        </span>

        <h3
          className={`font-heading font-extrabold text-white tracking-tight uppercase leading-tight ${
            isFeatured
              ? 'text-2xl xs:text-3xl sm:text-4xl lg:text-5xl'
              : 'text-xl xs:text-2xl sm:text-3xl lg:text-3xl'
          }`}
        >
          {destination.name}
        </h3>

        <p className="text-white/80 text-xs sm:text-sm font-normal max-w-lg leading-relaxed pt-0.5 line-clamp-2">
          {destination.tagline}
        </p>

        {/* Hover Action Link */}
        <div className="pt-2 flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-primary group-hover:text-accent transition-colors duration-200">
          <span>Start Planning</span>
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </div>
      </div>
    </motion.div>
  );
};