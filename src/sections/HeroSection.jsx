import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../components/Button';
import { ScrollIndicator } from '../components/ScrollIndicator';
// REMOVE THIS LINE: import { TravelModeToggle } from '../components/TravelModeToggle';
import { HeroBackground } from '../components/hero/HeroBackground';
import { AnimatedHeading } from '../components/hero/AnimatedHeading';
import { useTravelMode } from '../context/TravelModeContext';

export const HeroSection = ({ isIntroComplete = true }) => {
  const navigate = useNavigate();
  const { travelMode } = useTravelMode();
  const shouldReduceMotion = useReducedMotion();

  const { scrollY } = useScroll();
  const yContent = useTransform(scrollY, [0, 800], [0, shouldReduceMotion ? 0 : 50]);

  const content = {
    national: {
      badge: '🇮🇳 INDIA • NATIONAL TRAVEL',
      description:
        'Discover breathtaking places across India, build unforgettable group adventures, and let TripTastic intelligently plan the journey.',
      primaryBtn: 'START PLANNING',
      secondaryBtn: 'EXPLORE INDIA',
    },
    international: {
      badge: '🌎 WORLD • INTERNATIONAL TRAVEL',
      description:
        'Discover extraordinary destinations around the world, plan unforgettable group adventures, and let TripTastic handle the complicated parts.',
      primaryBtn: 'START PLANNING',
      secondaryBtn: 'EXPLORE THE WORLD',
    },
  };

  const current = content[travelMode];

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-20 bg-[#07111F]">
      <HeroBackground />

      <motion.div
        style={{ y: yContent }}
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center"
      >
        {/* REMOVED THE TRAVEL MODE TOGGLE BLOCK FROM HERE */}

        <AnimatePresence mode="wait">
          <motion.div
            key={travelMode + '-badge'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mb-4 sm:mb-6"
          >
            <span className="px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase bg-black/40 border border-white/15 text-primary backdrop-blur-md inline-flex items-center gap-2 shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              {current.badge}
            </span>
          </motion.div>
        </AnimatePresence>

        <AnimatedHeading isTriggered={isIntroComplete} travelMode={travelMode} />

        <AnimatePresence mode="wait">
          <motion.p
            key={travelMode + '-desc'}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="mt-6 sm:mt-8 text-sm sm:text-base md:text-lg lg:text-xl text-white/80 max-w-2xl font-normal leading-relaxed drop-shadow"
          >
            {current.description}
          </motion.p>
        </AnimatePresence>

        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Button
            variant="primary"
            size="lg"
            className="w-full sm:w-auto group"
            icon={ArrowRight}
            onClick={() => navigate('/plan')}
          >
            {current.primaryBtn}
          </Button>

          <Button
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto bg-black/40 text-white border-white/20 hover:bg-black/60 hover:text-white"
            onClick={() => {
              document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {current.secondaryBtn}
          </Button>
        </div>
      </motion.div>

      <ScrollIndicator />
    </section>
  );
};