import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const TravelCard = ({ card, step, isMobile, index }) => {
  const [imgSrc, setImgSrc] = useState(card.src);

  if (isMobile && !card.mobile) return null;

  const depthStyles = {
    foreground: 'w-40 h-52 sm:w-48 sm:h-60 z-20 shadow-2xl border-white/20',
    midground: 'w-34 h-46 sm:w-40 sm:h-52 z-10 opacity-90 shadow-xl border-white/10',
    background: 'w-28 h-38 sm:w-34 sm:h-44 z-0 opacity-70 shadow-lg border-white/5',
  };

  const targetX = isMobile ? card.target.x * 0.45 : card.target.x;
  const targetY = isMobile ? card.target.y * 0.45 : card.target.y;

  return (
    <motion.div
      initial={{
        x: card.initial.x,
        y: card.initial.y,
        rotate: card.initial.rotate,
        scale: 0.5,
        opacity: 0,
      }}
      animate={
        step === 'converging' || step === 'logo' || step === 'complete'
          ? {
              x: targetX * 1.25,
              y: targetY * 1.25,
              opacity: 0,
              scale: 0.45,
              rotate: card.target.rotate * 1.3,
              filter: 'blur(8px)',
              transition: { duration: 1.4, ease: [0.4, 0, 0.2, 1] },
            }
          : {
              x: targetX,
              y: targetY,
              opacity: 1,
              scale: card.target.scale,
              rotate: card.target.rotate,
              filter: 'blur(0px)',
              transition: {
                duration: 1.8,
                delay: index * 0.12,
                ease: [0.16, 1, 0.3, 1],
              },
            }
      }
      className={`absolute rounded-2xl overflow-hidden border bg-[#0D1B2A] pointer-events-none transform-gpu transition-shadow ${
        depthStyles[card.depth] || depthStyles.foreground
      }`}
    >
      <img
        src={imgSrc}
        alt={card.title}
        onError={() => setImgSrc(card.fallback)}
        className="w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
      <div className="absolute bottom-3 left-3 right-3 text-left">
        <span className="text-[10px] uppercase tracking-wider text-accent font-semibold block">
          {card.category}
        </span>
        <p className="text-white text-xs sm:text-sm font-heading font-bold truncate">
          {card.title}
        </p>
      </div>
    </motion.div>
  );
};