import React from 'react';

export const Logo = ({ className = '' }) => {
  return (
    <a 
      href="#" 
      className={`inline-flex items-center gap-2.5 group select-none ${className}`}
      aria-label="TripTastic Home"
    >
      {/* TT Monogram Base - Ready to replace with SVG/Brand Asset */}
      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white font-heading font-extrabold text-xs sm:text-sm tracking-wider shadow-sm transition-transform duration-300 group-hover:scale-105">
        TT
      </div>
      <span className="font-heading font-bold text-lg sm:text-xl tracking-tight text-text-main group-hover:text-primary transition-colors duration-200">
        TripTastic
      </span>
    </a>
  );
};