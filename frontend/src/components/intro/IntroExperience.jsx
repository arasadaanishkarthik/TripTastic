import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { INTRO_CARDS } from '../../data/introDestinations';
import { TravelCard } from './TravelCard';
import { IntroLogo } from './IntroLogo';
import { SkipIntro } from './SkipIntro';

export const IntroExperience = ({ introStep, onSkip, isVisible }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.04,
            filter: 'blur(10px)',
            transition: { duration: 1.4, ease: [0.4, 0, 0.2, 1] },
          }}
          className="fixed inset-0 z-[9999] w-screen h-screen bg-[#07111F] flex items-center justify-center overflow-hidden"
        >
          {/* Skip Button */}
          <SkipIntro onSkip={onSkip} />

          {/* Background Gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0D1B2A] via-[#07111F] to-[#040812] pointer-events-none" />

          {/* Cards */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {INTRO_CARDS.map((card, index) => (
              <TravelCard
                key={card.id}
                card={card}
                step={introStep}
                isMobile={isMobile}
                index={index}
              />
            ))}
          </div>

          {/* Logo */}
          <IntroLogo isVisible={introStep === 'logo' || introStep === 'converging'} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};