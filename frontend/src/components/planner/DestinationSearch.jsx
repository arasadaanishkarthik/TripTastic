// src/components/planner/DestinationSearch.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, ArrowRight, Check, Loader2 } from 'lucide-react';
import { useTripPlanner } from '../../context/TripPlannerContext';
import { useDestinationSearch } from '../../hooks/useDestinationSearch';

export const DestinationSearch = () => {
  const { trip, updateTrip, nextStep } = useTripPlanner();

  const {
    query: searchQuery,
    setQuery: setSearchQuery,
    filteredDestinations,
    isLoading,
  } = useDestinationSearch(trip?.mode || 'national');

  const selectedId = trip?.destination?.id;

  const handleSelect = (destination) => {
    updateTrip({ destination });
  };



  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto w-full pt-8 pb-4">
      {/* Header */}
      <div className="text-center mb-10">
        <motion.h2 
          className="text-3xl md:text-5xl font-black mb-4 tracking-tight text-white"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Where does your journey begin?
        </motion.h2>
        <motion.p 
          className="text-gray-400 text-lg max-w-xl mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Search national or international destinations to start building your group trip.
        </motion.p>
      </div>

      {/* Search Bar */}
      <motion.div 
        className="relative max-w-2xl mx-auto w-full mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-teal-500" />
        </div>
        <input
          type="text"
          className="block w-full pl-12 pr-4 py-4 bg-gray-900/60 border border-gray-700/50 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-teal-500/80 focus:ring-1 focus:ring-teal-500/50 transition-all backdrop-blur-md"
          placeholder="Search mountains, beaches, cities (e.g., Munnar, Tokyo)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </motion.div>

      {/* Destination Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 overflow-y-auto pb-4 pr-2 custom-scrollbar"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {filteredDestinations.map((dest) => {
          const isSelected = selectedId === dest.id;
          
          return (
            <motion.div
              key={dest.id}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(dest)}
              className={`relative p-6 rounded-2xl border cursor-pointer transition-all duration-300 ${
                isSelected 
                  ? 'border-teal-500 bg-teal-900/20 shadow-[0_0_20px_rgba(20,184,166,0.15)]' 
                  : 'border-gray-800 bg-gray-900/50 hover:border-gray-600 hover:bg-gray-800/60'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center text-teal-400 text-xs font-bold uppercase tracking-widest">
                  <MapPin className="w-3.5 h-3.5 mr-1.5" /> 
                  {dest.state || dest.country || 'Destination'}
                </div>
                
                {/* Selection Circle */}
                <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                  isSelected ? 'border-teal-500 bg-teal-500' : 'border-gray-600'
                }`}>
                  {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">{dest.name}</h3>
              <p className="text-gray-400 text-sm mb-6 line-clamp-2">
                {dest.description || 'A beautiful destination waiting to be explored.'}
              </p>

              <div className="flex items-center justify-between mt-auto">
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-800/80 text-gray-300 border border-gray-700/50">
                  {dest.category || 'Nature'}
                </span>
                <span className={`text-sm font-semibold flex items-center ${isSelected ? 'text-teal-400' : 'text-gray-500'}`}>
                  {isSelected ? 'Selected' : 'Explore'} 
                  {!isSelected && <ArrowRight className="w-4 h-4 ml-1" />}
                </span>
              </div>
            </motion.div>
          );
        })}
        
        {filteredDestinations.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            No destinations found matching "{searchQuery}"
          </div>
        )}
      </motion.div>

      {/* Navigation Footer */}
      <motion.div 
        className="mt-auto pt-6 flex items-center justify-end border-t border-gray-800/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <button
          onClick={nextStep}
          disabled={!selectedId}
          className={`flex items-center px-8 py-3 rounded-xl text-sm font-bold tracking-wider transition-all shadow-lg ${
            selectedId 
              ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:shadow-teal-500/25 hover:scale-[1.02]' 
              : 'bg-gray-800/50 text-gray-500 cursor-not-allowed border border-gray-700/50'
          }`}
        >
          NEXT: DATES
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </motion.div>
    </div>
  );
};