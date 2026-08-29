// src/components/planner/PreferencesSelector.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Mountain, Coffee, Map, Utensils, Music, ArrowRight, ArrowLeft } from 'lucide-react';
import { useTripPlanner } from '../../context/TripPlannerContext';

const PREFERENCES = [
  { id: 'adventure', label: 'Adventure & Outdoors', icon: Mountain, desc: 'Hiking, nature, and adrenaline' },
  { id: 'culture', label: 'Culture & History', icon: Map, desc: 'Museums, monuments, and local heritage' },
  { id: 'food', label: 'Food & Culinary', icon: Utensils, desc: 'Street food, fine dining, and local flavors' },
  { id: 'relaxation', label: 'Relaxation & Wellness', icon: Coffee, desc: 'Spas, beaches, and slow mornings' },
  { id: 'photography', label: 'Photography', icon: Camera, desc: 'Scenic spots and aesthetic locations' },
  { id: 'nightlife', label: 'Nightlife & Events', icon: Music, desc: 'Bars, clubs, and live entertainment' }
];

export const PreferencesSelector = () => {
  const { tripDetails, updateTripDetails, nextStep, prevStep } = useTripPlanner();
  const [selectedPrefs, setSelectedPrefs] = useState(tripDetails?.preferences || []);

  const togglePreference = (id) => {
    setSelectedPrefs((prev) => 
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    if (selectedPrefs.length > 0) {
      updateTripDetails({ preferences: selectedPrefs });
      nextStep();
    }
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto w-full pt-8">
      <div className="text-center mb-12">
        <motion.h2 
          className="text-3xl md:text-5xl font-black mb-4 tracking-tight"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          What's the vibe?
        </motion.h2>
        <motion.p 
          className="text-gray-400 text-lg max-w-xl mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Select the activities and themes you enjoy most. Choose at least one.
        </motion.p>
      </div>

      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {PREFERENCES.map((pref) => {
          const Icon = pref.icon;
          const isSelected = selectedPrefs.includes(pref.id);
          
          return (
            <div 
              key={pref.id}
              onClick={() => togglePreference(pref.id)}
              className={`relative cursor-pointer group rounded-2xl p-6 border transition-all duration-300 ${
                isSelected 
                  ? 'bg-amber-900/20 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.15)] scale-[1.02]' 
                  : 'bg-gray-900/60 border-gray-700/50 hover:border-gray-500 hover:bg-gray-800/60'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors ${
                isSelected ? 'bg-amber-500 text-white' : 'bg-gray-800 text-gray-400 group-hover:text-gray-200'
              }`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${isSelected ? 'text-amber-400' : 'text-gray-200'}`}>
                {pref.label}
              </h3>
              <p className="text-sm text-gray-400">{pref.desc}</p>
            </div>
          );
        })}
      </motion.div>

      {/* Navigation Footer */}
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
          disabled={selectedPrefs.length === 0}
          className={`flex items-center px-8 py-3 rounded-xl text-sm font-bold tracking-wider transition-all shadow-lg ${
            selectedPrefs.length > 0 
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-amber-500/25 hover:scale-[1.02]' 
              : 'bg-gray-800/50 text-gray-500 cursor-not-allowed border border-gray-700/50'
          }`}
        >
          NEXT: REVIEW
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </motion.div>
    </div>
  );
};