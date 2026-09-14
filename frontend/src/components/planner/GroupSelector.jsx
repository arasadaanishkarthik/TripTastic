// src/components/planner/GroupSelector.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Users, Heart, UsersRound, ArrowRight, ArrowLeft, Plus, Minus } from 'lucide-react';
import { useTripPlanner } from '../../context/TripPlannerContext';

const GROUP_TYPES = [
  { id: 'solo', label: 'Solo', icon: User, desc: 'Just me, myself, and I' },
  { id: 'couple', label: 'Couple', icon: Heart, desc: 'A romantic getaway' },
  { id: 'family', label: 'Family', icon: UsersRound, desc: 'Traveling with kids/parents' },
  { id: 'friends', label: 'Friends', icon: Users, desc: 'The whole squad' }
];

export const GroupSelector = () => {
  const { tripDetails, updateTripDetails, nextStep, prevStep } = useTripPlanner();
  
  const [groupType, setGroupType] = useState(tripDetails?.group?.type || '');
  const [travelerCount, setTravelerCount] = useState(tripDetails?.group?.count || 2);

  const handleContinue = () => {
    if (groupType) {
      updateTripDetails({ 
        group: { 
          type: groupType, 
          count: groupType === 'solo' ? 1 : travelerCount 
        } 
      });
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
          Who is traveling?
        </motion.h2>
        <motion.p 
          className="text-gray-400 text-lg max-w-xl mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Tell us about your group so we can find the right accommodations and activities.
        </motion.p>
      </div>

      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {GROUP_TYPES.map((type) => {
          const Icon = type.icon;
          const isSelected = groupType === type.id;
          
          return (
            <div 
              key={type.id}
              onClick={() => {
                setGroupType(type.id);
                if (type.id === 'solo') setTravelerCount(1);
                if (type.id === 'couple') setTravelerCount(2);
              }}
              className={`relative cursor-pointer group rounded-2xl p-6 border transition-all duration-300 ${
                isSelected 
                  ? 'bg-teal-900/20 border-teal-500 shadow-[0_0_20px_rgba(20,184,166,0.15)] scale-[1.02]' 
                  : 'bg-gray-900/60 border-gray-700/50 hover:border-gray-500 hover:bg-gray-800/60'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors ${
                isSelected ? 'bg-teal-500 text-white' : 'bg-gray-800 text-gray-400 group-hover:text-gray-200'
              }`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${isSelected ? 'text-teal-400' : 'text-gray-200'}`}>
                {type.label}
              </h3>
              <p className="text-sm text-gray-400">{type.desc}</p>
            </div>
          );
        })}
      </motion.div>

      {/* Traveler Count - Only show if not solo */}
      {groupType && groupType !== 'solo' && (
        <motion.div 
          className="flex flex-col items-center justify-center mb-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-gray-900/80 border border-gray-700/50 rounded-2xl p-6 flex flex-col items-center backdrop-blur-md">
            <span className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">
              Total Travelers
            </span>
            <div className="flex items-center space-x-6">
              <button 
                onClick={() => setTravelerCount(Math.max(2, travelerCount - 1))}
                className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="text-4xl font-light w-16 text-center text-white">
                {travelerCount}
              </span>
              <button 
                onClick={() => setTravelerCount(Math.min(20, travelerCount + 1))}
                className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

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
          disabled={!groupType}
          className={`flex items-center px-8 py-3 rounded-xl text-sm font-bold tracking-wider transition-all shadow-lg ${
            groupType 
              ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:shadow-teal-500/25 hover:scale-[1.02]' 
              : 'bg-gray-800/50 text-gray-500 cursor-not-allowed border border-gray-700/50'
          }`}
        >
          NEXT: PREFERENCES
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </motion.div>
    </div>
  );
};