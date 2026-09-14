// src/components/planner/PlannerAtmosphere.jsx
import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTripPlanner } from '../../context/TripPlannerContext';
import ghatsVideo from '../../assets/western-ghats.mp4';

const INTL_BACKDROP =
  'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=2400&q=85';

export const PlannerAtmosphere = () => {
  const { trip } = useTripPlanner();
  const prefersReducedMotion = useReducedMotion();
  const isNational = trip?.mode !== 'international';

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Layer 0: Same signature footage as the homepage hero, heavily dimmed */}
      <div className="absolute inset-0">
        {isNational ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            src={ghatsVideo}
            className="w-full h-full object-cover object-[50%_35%] scale-110 opacity-25 blur-[2px]"
          />
        ) : (
          <img
            src={INTL_BACKDROP}
            alt=""
            className="w-full h-full object-cover object-center scale-110 opacity-25 blur-[2px]"
          />
        )}
      </div>

      {/* Layer 1: Base gradient so content stays legible over the footage */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#07111F]/95 via-[#09182C]/92 to-[#040B14]/97" />

      {/* Layer 2: Cinematic vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,_transparent_0%,_#07111F_78%)]" />

      {/* Layer 3: Signature teal→amber glow, echoing the homepage's "JOURNEY" gradient text */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-r from-teal-500/15 via-emerald-400/10 to-amber-400/15 rounded-full blur-[140px]" />

      {/* Layer 4: Decorative route line, now in the brand gradient */}
      <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
        <motion.path
          d="M -100,100 C 300,300 500,50 900,400 C 1300,750 1500,200 1900,500"
          fill="none"
          stroke="url(#routeGradient)"
          strokeWidth="2"
          strokeDasharray="6 6"
          initial={prefersReducedMotion ? {} : { pathLength: 0, opacity: 0 }}
          animate={prefersReducedMotion ? {} : { pathLength: 1, opacity: 0.7 }}
          transition={{ duration: 3, ease: 'easeInOut' }}
        />
        <defs>
          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#19B5A5" />
            <stop offset="50%" stopColor="#FF9F43" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>
      </svg>

      {/* Layer 5: Floating particles / mist */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-teal-400/40 rounded-full blur-[1px]"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{ y: [0, -40, 0], opacity: [0.2, 0.6, 0.2] }}
              transition={{
                duration: 6 + Math.random() * 6,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};