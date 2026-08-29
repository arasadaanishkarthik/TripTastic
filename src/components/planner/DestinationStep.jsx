// src/components/planner/DestinationStep.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, CheckCircle2, ArrowUpRight, Globe2 } from 'lucide-react';
import { PLANNER_DESTINATIONS } from '../../data/destinations';
import { useTripPlanner } from '../../context/TripPlannerContext';

// Several photos per category, rotated per-card so neighboring destinations
// in the same category never show the identical image.
const CATEGORY_IMAGE_POOLS = {
  mountains: [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=75',
    'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=75',
    'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=75',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=75',
  ],
  nature: [
    'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=800&q=75',
    'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=800&q=75',
    'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=75',
    'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=800&q=75',
  ],
  beaches: [
    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=75',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=75',
    'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=75',
    'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=800&q=75',
  ],
  culture: [
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=75',
    'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=75',
    'https://images.unsplash.com/photo-1524293581917-878a6d017c71?auto=format&fit=crop&w=800&q=75',
    'https://images.unsplash.com/photo-1524231757912-21f4fe3113c5?auto=format&fit=crop&w=800&q=75',
  ],
  city: [
    'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=75',
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=75',
    'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=75',
    'https://images.unsplash.com/photo-1444723121867-7a241cacace9?auto=format&fit=crop&w=800&q=75',
  ],
  adventure: [
    'https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&w=800&q=75',
    'https://images.unsplash.com/photo-1454391304352-2bf4678b1a7a?auto=format&fit=crop&w=800&q=75',
    'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=75',
    'https://images.unsplash.com/photo-1533692328991-08159ff19fca?auto=format&fit=crop&w=800&q=75',
  ],
};

const CardImage = ({ src, alt }) => {
  const [broken, setBroken] = useState(false);
  if (broken) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-accent/30 flex items-center justify-center">
        <Globe2 className="w-8 h-8 text-white/50" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setBroken(true)}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
    />
  );
};

export const DestinationStep = () => {
  const { trip, updateTrip } = useTripPlanner();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = PLANNER_DESTINATIONS.filter(
    (d) =>
      d.mode === trip.mode &&
      (d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.region.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Rotate through each category's photo pool as we walk the filtered list,
  // so two destinations of the same category never land next to each other
  // with the same image.
  const categoryCounters = {};
  const imageFor = (dest) => {
    const pool = CATEGORY_IMAGE_POOLS[dest.category] || CATEGORY_IMAGE_POOLS.nature;
    const idx = categoryCounters[dest.category] ?? 0;
    categoryCounters[dest.category] = idx + 1;
    return pool[idx % pool.length];
  };

  const handleSelect = (dest) => updateTrip({ destination: dest });

  const handleModeChange = (mode) => {
    if (mode === trip.mode) return;
    updateTrip({ mode, destination: { id: '', name: '', region: '', description: '', image: '' } });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-text-main uppercase tracking-tight">
          Where are you going?
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Start with a destination. We'll build the journey around it.
        </p>
      </div>

      {/* National / International Toggle */}
      <div className="inline-flex p-1 rounded-2xl bg-black/20 border border-white/10 shadow-inner">
        <button
          type="button"
          onClick={() => handleModeChange('national')}
          className={`px-4 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all duration-300 ${
            trip.mode === 'national'
              ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/20'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          🇮🇳 National
        </button>
        <button
          type="button"
          onClick={() => handleModeChange('international')}
          className={`px-4 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all duration-300 ${
            trip.mode === 'international'
              ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/20'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          🌎 International
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search destinations..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-surface border border-border text-text-main placeholder:text-text-secondary/60 text-sm focus:outline-none focus:border-primary shadow-sm"
        />
      </div>

      {/* Selected Destination Preview */}
      {trip.destination.id && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-sm text-text-main uppercase">{trip.destination.name}</h4>
              <span className="text-xs text-text-secondary">{trip.destination.region}</span>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
            <CheckCircle2 className="w-4 h-4" /> Selected
          </span>
        </motion.div>
      )}

      {/* Photographic Destination Grid */}
      <div>
        <span className="text-[11px] font-semibold tracking-wider text-text-secondary uppercase block mb-3">
          Popular {trip.mode === 'national' ? 'Indian' : 'Global'} Destinations
        </span>
        <motion.div
          key={trip.mode}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          initial="hidden"
          animate="show"
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } }}
        >
          {filtered.map((dest) => {
            const isSelected = trip.destination.id === dest.id;
            return (
              <motion.button
                key={dest.id}
                type="button"
                onClick={() => handleSelect(dest)}
                variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className={`group relative h-40 rounded-2xl overflow-hidden text-left border transform-gpu ${
                  isSelected ? 'border-primary ring-2 ring-primary/30 shadow-lg shadow-primary/20' : 'border-border'
                }`}
              >
                <CardImage src={imageFor(dest)} alt={`${dest.name}, ${dest.region}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 group-hover:from-black/95 transition-colors" />

                {isSelected ? (
                  <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-md">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-white/10 group-hover:bg-primary backdrop-blur-md border border-white/20 flex items-center justify-center transition-all">
                    <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-3.5">
                  <span className="text-[10px] font-semibold tracking-widest text-amber-300 uppercase block mb-0.5">
                    {dest.category}
                  </span>
                  <h4 className="font-heading font-bold text-sm text-white uppercase leading-tight">
                    {dest.name}
                  </h4>
                  <span className="text-[11px] text-white/70">{dest.region}</span>
                </div>
              </motion.button>
            );
          })}
          {filtered.length === 0 && (
            <p className="col-span-full text-xs text-text-secondary py-6 text-center">
              No destinations match "{searchTerm}". Try a different search.
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};