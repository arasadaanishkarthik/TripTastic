import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export const AnimatedHeading = ({ isTriggered = true, travelMode = 'national' }) => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const Letter = ({ char, delay, isSpecial = false }) => {
    if (char === ' ') return <span className="inline-block">&nbsp;</span>;

    return (
      <motion.span
        initial={{
          opacity: 0,
          y: shouldReduceMotion ? 0 : -75,
          rotateX: shouldReduceMotion ? 0 : -45,
          scale: 0.85,
          filter: 'blur(8px)',
        }}
        animate={
          isTriggered
            ? {
                opacity: 1,
                y: 0,
                rotateX: 0,
                scale: 1,
                filter: 'blur(0px)',
              }
            : { opacity: 0 }
        }
        exit={{
          opacity: 0,
          y: 35,
          filter: 'blur(6px)',
          transition: { duration: 0.25 },
        }}
        transition={{
          duration: 0.75,
          delay: delay,
          ease: [0.175, 0.885, 0.32, 1.15],
        }}
        whileHover={
          !isTouchDevice && !shouldReduceMotion
            ? {
                y: -5,
                scale: 1.08,
                rotate: (Math.random() - 0.5) * 6,
                transition: { duration: 0.2, ease: 'easeOut' },
              }
            : {}
        }
        className={`inline-block select-none transform-gpu ${
          isSpecial ? 'journey-gradient-text drop-shadow-lg' : 'text-white'
        }`}
      >
        {char}
      </motion.span>
    );
  };

  const renderWord = (word, baseDelay, isSpecial = false) => (
    <span className="inline-block whitespace-nowrap mx-1 sm:mx-2">
      {word.split('').map((char, index) => (
        <Letter
          key={index}
          char={char}
          delay={baseDelay + index * 0.035}
          isSpecial={isSpecial}
        />
      ))}
    </span>
  );

  return (
    <div className="min-h-[160px] xs:min-h-[190px] sm:min-h-[220px] md:min-h-[260px] flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.h1
          key={travelMode}
          className="text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-extrabold tracking-tight text-white leading-[1.08] uppercase max-w-4xl drop-shadow-md text-center"
        >
          {travelMode === 'national' ? (
            <>
              <div className="flex justify-center flex-wrap">
                {renderWord('YOUR', 0.05)}
                {renderWord('NEXT', 0.2)}
              </div>
              <div className="my-1 sm:my-2 flex justify-center flex-wrap">
                {renderWord('INDIAN', 0.35)}
                {renderWord('JOURNEY', 0.55, true)}
              </div>
              <div className="flex justify-center flex-wrap">
                {renderWord('STARTS', 0.75)}
                {renderWord('HERE.', 0.9)}
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-center flex-wrap">
                {renderWord('YOUR', 0.05)}
                {renderWord('NEXT', 0.2)}
              </div>
              <div className="my-1 sm:my-2 flex justify-center flex-wrap">
                {renderWord('GLOBAL', 0.35)}
                {renderWord('JOURNEY', 0.55, true)}
              </div>
              <div className="flex justify-center flex-wrap">
                {renderWord('STARTS', 0.75)}
                {renderWord('HERE.', 0.9)}
              </div>
            </>
          )}
        </motion.h1>
      </AnimatePresence>
    </div>
  );
};