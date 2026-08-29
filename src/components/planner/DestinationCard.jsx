import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, MapPin } from 'lucide-react';

export const DestinationCard = ({ destination, isSelected, onSelect }) => {
  return (
    <motion.div
      onClick={() => onSelect(destination)}
      className={`relative rounded-2xl p-5 cursor-pointer overflow-hidden backdrop-blur-md transition-all duration-300 border ${
        isSelected
          ? 'bg-teal-950/40 dark:bg-teal-950/40 light:bg-teal-50/90 border-teal-500 shadow-xl shadow-teal-500/10 ring-2 ring-teal-500/30'
          : 'bg-gray-900/40 dark:bg-gray-900/40 light:bg-white/80 border-gray-800 dark:border-gray-800 light:border-gray-200 hover:border-teal-500/50 hover:shadow-lg'
      }`}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background Subtle Gradient Glow on Select */}
      {isSelected && (
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-transparent pointer-events-none" />
      )}

      <div className="relative z-10 flex justify-between items-start">
        <div className="flex items-center space-x-2 text-teal-400 dark:text-teal-400 light:text-teal-600 text-xs font-semibold tracking-wider uppercase">
          <MapPin className="w-3.5 h-3.5" />
          <span>{destination.state || destination.country}</span>
        </div>
        
        <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
          isSelected 
            ? 'bg-teal-500 text-white shadow-md shadow-teal-500/40' 
            : 'border border-gray-600 dark:border-gray-600 light:border-gray-300 text-transparent'
        }`}>
          <Check className={`w-3.5 h-3.5 transition-transform duration-300 ${isSelected ? 'scale-100' : 'scale-0'}`} />
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-xl font-bold text-white dark:text-white light:text-gray-900 tracking-wide">
          {destination.name}
        </h3>
        <p className="mt-1 text-sm text-gray-400 dark:text-gray-400 light:text-gray-600 line-clamp-2">
          {destination.description}
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between pt-3 border-t border-gray-800/60 dark:border-gray-800/60 light:border-gray-100">
        <span className="text-xs px-2.5 py-1 rounded-full bg-gray-800/80 dark:bg-gray-800/80 light:bg-gray-100 text-gray-300 dark:text-gray-300 light:text-gray-700 capitalize">
          {destination.category}
        </span>
        
        <div className="flex items-center space-x-1 text-xs font-medium text-teal-400 group">
          <span>{isSelected ? 'Selected' : 'Explore'}</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </motion.div>
  );
};