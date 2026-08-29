import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MapPin, Calendar, Users } from 'lucide-react';

export const ItineraryHero = ({ itinerary }) => {
  const [imgSrc, setImgSrc] = useState(itinerary.destination.image);

  return (
    <div className="relative w-full h-[380px] sm:h-[440px] overflow-hidden rounded-3xl bg-[#07111F] shadow-2xl flex flex-col justify-end p-6 sm:p-10 select-none">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={imgSrc}
          onError={() => setImgSrc(itinerary.destination.fallback)}
          alt={itinerary.destination.name}
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/20" />
      </div>

      <div className="relative z-10 space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 text-primary">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span className="text-[11px] font-semibold tracking-widest uppercase">
            ✦ AI-Planned For Your Group
          </span>
        </div>

        <h1 className="font-heading font-extrabold text-4xl sm:text-6xl text-white tracking-tight uppercase">
          {itinerary.destination.name}
        </h1>

        <p className="text-white/80 text-sm sm:text-base font-normal max-w-xl">
          {itinerary.destination.tagline} — {itinerary.destination.region}
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-white/90 font-medium">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 backdrop-blur-md">
            <Calendar className="w-3.5 h-3.5 text-primary" /> 12 — 15 October 2026
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 backdrop-blur-md">
            <MapPin className="w-3.5 h-3.5 text-primary" /> {itinerary.durationDays} Days • {itinerary.durationDays - 1} Nights
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 backdrop-blur-md">
            <Users className="w-3.5 h-3.5 text-primary" /> {itinerary.travelers} Travelers
          </span>
        </div>
      </div>
    </div>
  );
};