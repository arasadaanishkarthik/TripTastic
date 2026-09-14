import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useTravelMode } from '../../context/TravelModeContext';

// Direct Vite video import from src/assets/
import ghatsVideo from '../../assets/western-ghats.mp4';

const INTL_FALLBACK_ONLINE =
  'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=2400&q=85';

export const HeroBackground = () => {
  const { travelMode } = useTravelMode();
  const videoRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollY } = useScroll();
  const yLandscape = useTransform(scrollY, [0, 800], [0, shouldReduceMotion ? 0 : 110]);
  const yMist = useTransform(scrollY, [0, 800], [0, shouldReduceMotion ? 0 : 65]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [travelMode]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none bg-[#07111F]">
      <AnimatePresence mode="wait">
        {travelMode === 'national' ? (
          <motion.div
            key="national-western-ghats"
            style={{ y: yLandscape }}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 w-full h-full"
          >
            {/* 1. Base Western Ghats Video */}
            <div className="w-full h-full">
              <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                src={ghatsVideo}
                className="w-full h-full object-cover object-[50%_35%] scale-105"
              />
            </div>

            {/* 2. Morning Mountain Valley Mist */}
            {!shouldReduceMotion && (
              <motion.div
                style={{ y: yMist }}
                className="absolute inset-0 pointer-events-none overflow-hidden"
              >
                <div className="absolute -inset-x-24 top-[35%] h-80 bg-gradient-to-r from-emerald-100/10 via-teal-100/15 to-emerald-100/10 blur-3xl rounded-full animate-mist-layer-1" />
                <div className="absolute -inset-x-24 top-[50%] h-64 bg-gradient-to-r from-transparent via-cyan-100/10 to-transparent blur-2xl rounded-full animate-mist-layer-2" />
              </motion.div>
            )}

            {/* 3. Deep Natural Green Atmospheric Grading */}
            <div className="absolute inset-0 bg-[#06201B]/20 mix-blend-multiply pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[#07111F]/80 via-[#07111F]/30 to-transparent" />
            <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#07111F]/70 via-[#07111F]/20 to-transparent" />
            <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[#07111F]/70 via-[#07111F]/20 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#07111F]/40 via-[#07111F]/15 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-bg via-bg/75 to-transparent" />
          </motion.div>
        ) : (
          <motion.div
            key="international-placeholder"
            style={{ y: yLandscape }}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={INTL_FALLBACK_ONLINE}
              alt="Global travel destinations"
              className="w-full h-full object-cover object-center scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-bg" />
            <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-bg via-bg/60 to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};