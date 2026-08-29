// src/components/planner/PlannerProgress.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const STEPS = [
  { id: 1, label: 'DESTINATION' },
  { id: 2, label: 'DATES' },
  { id: 3, label: 'GROUP' },
  { id: 4, label: 'PREFERENCES' },
  { id: 5, label: 'REVIEW' },
];

export const PlannerProgress = ({ currentStep, onStepClick }) => {
  const progressPercentage = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 relative z-10">
      <div className="relative flex items-center justify-between">
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-gray-700/50 dark:bg-gray-700/50 light:bg-gray-300 z-0" />

        {/* Gradient progress line — echoes the "JOURNEY" text on the homepage */}
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-teal-500 via-emerald-400 to-amber-400 z-0 origin-left"
          initial={{ width: '0%' }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        />

        {STEPS.map((step) => {
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;

          return (
            <div
              key={step.id}
              className="relative z-10 flex flex-col items-center group cursor-pointer"
              onClick={() => step.id < currentStep && onStepClick?.(step.id)}
            >
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                  isCompleted
                    ? 'bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/30'
                    : isActive
                    ? 'bg-[#09182C] dark:bg-[#09182C] light:bg-white text-teal-400 border-2 border-teal-500 shadow-lg shadow-teal-500/20 ring-4 ring-teal-500/10'
                    : 'bg-gray-800/80 dark:bg-gray-800/80 light:bg-gray-200 text-gray-400 dark:text-gray-400 light:text-gray-600 border border-gray-700 dark:border-gray-700 light:border-gray-300'
                }`}
                whileHover={step.id < currentStep ? { scale: 1.08 } : {}}
                animate={isActive ? { scale: [1, 1.05, 1] } : {}}
                transition={{ repeat: isActive ? Infinity : 0, duration: 2 }}
              >
                {isCompleted ? (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                    <Check className="w-5 h-5" />
                  </motion.div>
                ) : (
                  `0${step.id}`
                )}
              </motion.div>

              <span
                className={`mt-2 text-xs font-medium tracking-wider hidden sm:block transition-colors duration-300 ${
                  isActive
                    ? 'text-teal-400 dark:text-teal-400 light:text-teal-700 font-bold'
                    : isCompleted
                    ? 'text-gray-300 dark:text-gray-300 light:text-gray-700'
                    : 'text-gray-500 dark:text-gray-500 light:text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};