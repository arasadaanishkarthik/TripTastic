// src/components/planner/DateSelector.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, ArrowLeft } from 'lucide-react';
import { useTripPlanner } from '../../context/TripPlannerContext';

const QUICK_DURATIONS = [
  { label: 'Weekend', days: 3 },
  { label: '1 Week', days: 7 },
  { label: '10 Days', days: 10 },
  { label: '2 Weeks', days: 14 },
];

export const DateSelector = () => {
  const { tripDetails, updateTripDetails, nextStep, prevStep } = useTripPlanner();
  const [startDate, setStartDate] = useState(tripDetails?.dates?.start || '');
  const [endDate, setEndDate] = useState(tripDetails?.dates?.end || '');
  const [durationStr, setDurationStr] = useState('');

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      
      if (diffDays > 0) {
        setDurationStr(`${diffDays} Days`);
      } else {
        setDurationStr('Invalid Dates');
      }
    } else {
      setDurationStr('');
    }
  }, [startDate, endDate]);

  const handleQuickDuration = (days) => {
    if (!startDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setStartDate(tomorrow.toISOString().split('T')[0]);
      
      const end = new Date(tomorrow);
      end.setDate(end.getDate() + (days - 1));
      setEndDate(end.toISOString().split('T')[0]);
    } else {
      const end = new Date(startDate);
      end.setDate(end.getDate() + (days - 1));
      setEndDate(end.toISOString().split('T')[0]);
    }
  };

  const handleContinue = () => {
    if (startDate && endDate) {
      updateTripDetails({ dates: { start: startDate, end: endDate, duration: durationStr } });
      nextStep();
    }
  };

  const isComplete = startDate && endDate && new Date(endDate) >= new Date(startDate);

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full pt-8">
      <div className="text-center mb-12">
        <motion.h2 
          className="text-3xl md:text-5xl font-black mb-4 tracking-tight"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          When are we going?
        </motion.h2>
        <motion.p 
          className="text-gray-400 text-lg max-w-xl mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Select your exact dates or pick a quick duration to let us calculate the timeline.
        </motion.p>
      </div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-transparent rounded-2xl blur-xl group-hover:opacity-100 opacity-0 transition-opacity duration-500" />
          <div className="relative bg-gray-900/60 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 hover:border-teal-500/50 transition-colors focus-within:border-teal-500/80">
            <label className="flex items-center text-sm font-semibold text-teal-400 uppercase tracking-widest mb-4">
              <Calendar className="w-4 h-4 mr-2" /> Start Date
            </label>
            <input 
              type="date" 
              value={startDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-transparent text-2xl md:text-3xl font-light focus:outline-none text-white [color-scheme:dark] cursor-pointer"
            />
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-l from-amber-500/10 to-transparent rounded-2xl blur-xl group-hover:opacity-100 opacity-0 transition-opacity duration-500" />
          <div className="relative bg-gray-900/60 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 hover:border-amber-500/50 transition-colors focus-within:border-amber-500/80">
            <label className="flex items-center text-sm font-semibold text-amber-400 uppercase tracking-widest mb-4">
              <Calendar className="w-4 h-4 mr-2" /> End Date
            </label>
            <input 
              type="date" 
              value={endDate}
              min={startDate || new Date().toISOString().split('T')[0]}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-transparent text-2xl md:text-3xl font-light focus:outline-none text-white [color-scheme:dark] cursor-pointer"
            />
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="flex flex-col items-center justify-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex items-center text-gray-500 mb-4 text-sm font-medium uppercase tracking-widest">
          <Clock className="w-4 h-4 mr-2" /> Or pick a duration
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {QUICK_DURATIONS.map((duration) => (
            <button
              key={duration.label}
              onClick={() => handleQuickDuration(duration.days)}
              className="px-6 py-2.5 rounded-full bg-gray-800/40 border border-gray-700/60 hover:bg-teal-900/30 hover:border-teal-500/50 text-gray-300 hover:text-white transition-all text-sm tracking-wide"
            >
              {duration.label}
            </button>
          ))}
        </div>
        
        {durationStr && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 px-6 py-2 rounded-xl bg-gradient-to-r from-teal-500/10 to-amber-500/10 border border-gray-600/30 text-teal-300 font-medium tracking-wide flex items-center"
          >
            Total Duration: <span className="text-white ml-2 font-bold">{durationStr}</span>
          </motion.div>
        )}
      </motion.div>

      <motion.div 
        className="mt-auto pt-8 flex items-center justify-between border-t border-gray-800/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <button
          onClick={prevStep}
          className="flex items-center px-6 py-3 text-sm font-semibold tracking-wider text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          BACK
        </button>

        <button
          onClick={handleContinue}
          disabled={!isComplete}
          className={`flex items-center px-8 py-3 rounded-xl text-sm font-bold tracking-wider transition-all shadow-lg ${
            isComplete 
              ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:shadow-teal-500/25 hover:scale-[1.02]' 
              : 'bg-gray-800/50 text-gray-500 cursor-not-allowed border border-gray-700/50'
          }`}
        >
          NEXT: TRAVEL GROUP
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </motion.div>
    </div>
  );
};