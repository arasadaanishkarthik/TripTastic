// src/pages/PlanTrip.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTripPlanner } from '../context/TripPlannerContext';
import { PlannerAtmosphere } from '../components/planner/PlannerAtmosphere';
import { PlannerProgress } from '../components/planner/PlannerProgress';
import { PlannerNavigation } from '../components/planner/PlannerNavigation';
import { DestinationStep } from '../components/planner/DestinationStep';
import { DatesStep } from '../components/planner/DatesStep';
import { GroupStep } from '../components/planner/GroupStep';
import { PreferencesStep } from '../components/planner/PreferencesStep';
import { ReviewStep } from '../components/planner/ReviewStep';

export default function PlanTrip() {
  const { trip, nextStep, prevStep, goToStep } = useTripPlanner();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const validateStep = () => {
    if (trip.step === 1 && !trip.destination.id) {
      return 'Please select a destination to continue.';
    }
    if (trip.step === 2) {
      if (!trip.dates.start || !trip.dates.end) {
        return 'Please choose both a start and end date.';
      }
      if (new Date(trip.dates.end) <= new Date(trip.dates.start)) {
        return 'End date must be after the start date.';
      }
    }
    if (trip.step === 3 && trip.travelers.length === 0) {
      return 'Add at least one traveler to continue.';
    }
    if (trip.step === 4 && trip.preferences.length === 0) {
      return 'Pick at least one interest to continue.';
    }
    return '';
  };

  const handleNext = () => {
    const validationError = validateStep();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');

    if (trip.step === 5) {
      // Last step — hand off to the AI generation page instead of
      // trying to go to a nonexistent step 6.
      navigate('/plan/generate');
      return;
    }

    nextStep();
  };

  const handlePrev = () => {
    setError('');
    prevStep();
  };

  const handleStepClick = (step) => {
    setError('');
    goToStep(step);
  };

  const renderStep = () => {
    switch (trip.step) {
      case 1:
        return <DestinationStep />;
      case 2:
        return <DatesStep />;
      case 3:
        return <GroupStep />;
      case 4:
        return <PreferencesStep />;
      case 5:
        return <ReviewStep />;
      default:
        return <DestinationStep />;
    }
  };

  return (
    <div className="relative min-h-screen bg-[#07111F] text-white overflow-x-hidden flex flex-col">
      <PlannerAtmosphere />

      {/* Header */}
      <motion.header
        className="relative z-20 flex items-center justify-between px-6 py-4 border-b border-gray-800/40 backdrop-blur-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-center space-x-3">
          <span className="font-black text-lg tracking-widest bg-gradient-to-r from-teal-400 to-amber-400 bg-clip-text text-transparent">
            TRIPTASTIC
          </span>
          <span className="text-xs text-gray-400 uppercase tracking-widest px-2 py-0.5 rounded bg-gray-800/50">Planner Wizard</span>
        </div>

        <motion.button
          className="text-xs font-semibold tracking-wider px-4 py-2 rounded-xl bg-gray-800/60 border border-gray-700/60 hover:border-teal-500/50 transition-all shadow-sm cursor-pointer"
          whileHover={{ y: -1, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/')}
        >
          SAVE & EXIT
        </motion.button>
      </motion.header>

      {/* Progress Stepper */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <PlannerProgress currentStep={trip.step} onStepClick={handleStepClick} />
      </motion.div>

      {/* Step Content */}
      <main className="relative z-10 flex-1 max-w-4xl w-full mx-auto px-4 py-8 flex flex-col">
        <div className="flex-1 flex flex-col bg-[#09182C]/70 rounded-3xl border border-gray-800/50 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={trip.step}
              className="flex-1 flex flex-col"
              initial={{ opacity: 0, x: 20, scale: 0.99 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.99 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-xs font-semibold text-red-300 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-2.5"
            >
              {error}
            </motion.p>
          )}

          <PlannerNavigation onNext={handleNext} onPrev={handlePrev} />
        </div>
      </main>
    </div>
  );
}