// src/components/planner/DestinationStep.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, CheckCircle2, ArrowUpRight,
  Globe2, Loader2, Wifi, WifiOff, X,
} from 'lucide-react';
import { useTripPlanner } from '../../context/TripPlannerContext';
import { useDestinationSearch } from '../../hooks/useDestinationSearch';

// ── Category photo pools (rotated per card to avoid duplicates next to each other) ──
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

// ── Lazy image with broken-image fallback ────────────────────────────────────
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

// ── Main component ───────────────────────────────────────────────────────────
export const DestinationStep = () => {
  const { trip, updateTrip } = useTripPlanner();

  const {
    query: searchTerm,
    setQuery: setSearchTerm,
    filteredDestinations: filtered,
    isLoading,
    isApiAvailable,
    error: searchError,
  } = useDestinationSearch(trip.mode);

  // Rotate through each category's photo pool to avoid duplicates
  const categoryCounters = {};
  const imageFor = (dest) => {
    const pool = CATEGORY_IMAGE_POOLS[dest.category] || CATEGORY_IMAGE_POOLS.nature;
    const idx = categoryCounters[dest.category] ?? 0;
    categoryCounters[dest.category] = idx + 1;
    return pool[idx % pool.length];
  };

  // Select a destination → update TripPlanner context (Live Summary picks this up)
  const handleSelect = (dest) => {
    updateTrip({
      destination: {
        id:          dest.id,
        name:        dest.name,
        region:      dest.region || dest.state || '',
        description: dest.description || '',
        category:    dest.category || 'nature',
        city:          dest.city || '',
        state:         dest.state || '',
        country:       dest.country || 'India',
        latitude:      dest.latitude ?? null,
        longitude:     dest.longitude ?? null,
        image:       '',
        mode:        dest.mode || trip.mode,
      },
    });
  };

  const handleModeChange = (mode) => {
    if (mode === trip.mode) return;
    updateTrip({
      mode,
      destination: { id: '', name: '', region: '', description: '', image: '' },
    });
    setSearchTerm('');
  };

  const clearSearch = () => setSearchTerm('');

  const isSearching = searchTerm.trim().length > 0;
  const gridLabel = isSearching
    ? `Results for "${searchTerm}"`
    : `Popular ${trip.mode === 'national' ? 'Indian' : 'Global'} Destinations`;

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-text-main uppercase tracking-tight">
            Where are you going?
          </h2>

          {/* API status badge — hidden while isApiAvailable is still null (not yet determined) */}
          <AnimatePresence mode="wait">
            {isApiAvailable !== null && (
              <motion.span
                key={isApiAvailable ? 'online' : 'offline'}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className={`hidden sm:inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                  isApiAvailable
                    ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
                    : 'text-amber-400 border-amber-500/30 bg-amber-500/10'
                }`}
              >
                {isApiAvailable
                  ? <><Wifi className="w-3 h-3" /> Live DB</>
                  : <><WifiOff className="w-3 h-3" /> Local Data</>
                }
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Start with a destination. We&apos;ll build the journey around it.
        </p>
      </div>

      {/* ── National / International Toggle ── */}
      <div className="inline-flex p-1 rounded-2xl bg-black/20 border border-white/10 shadow-inner">
        {['national', 'international'].map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => handleModeChange(m)}
            className={`px-4 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all duration-300 ${
              trip.mode === m
                ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/20'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {m === 'national' ? '🇮🇳 National' : '🌎 International'}
          </button>
        ))}
      </div>

      {/* ── Search Bar ── */}
      <div className="relative">
        {/* Left icon: spinner while loading, search otherwise */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
          {isLoading
            ? <Loader2 className="w-4 h-4 text-primary animate-spin" />
            : <Search className="w-4 h-4 text-text-secondary" />
          }
        </div>

        <input
          id="destination-search-input"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={`Search ${trip.mode === 'national' ? 'India' : 'worldwide'}… (Jammu, Goa, Ladakh, Munnar…)`}
          autoComplete="off"
          className="w-full pl-11 pr-10 py-3 rounded-2xl bg-surface border border-border text-text-main placeholder:text-text-secondary/60 text-sm focus:outline-none focus:border-primary shadow-sm transition-colors"
        />

        {/* Clear button */}
        <AnimatePresence>
          {isSearching && (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.15 }}
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Clear search"
            >
              <X className="w-3 h-3 text-text-secondary" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ── Error Banner ── */}
      <AnimatePresence>
        {searchError && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300"
          >
            <WifiOff className="w-3.5 h-3.5 shrink-0" />
            <span>Extended search unavailable — showing local results. ({searchError})</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Selected Destination Banner (updates Live Summary) ── */}
      <AnimatePresence>
        {trip.destination.id && (
          <motion.div
            key={trip.destination.id}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-4 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-text-main uppercase">
                  {trip.destination.name}
                </h4>
                <span className="text-xs text-text-secondary">
                  {trip.destination.region || trip.destination.category}
                </span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
              <CheckCircle2 className="w-4 h-4" /> Selected
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Destination Grid ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-semibold tracking-wider text-text-secondary uppercase">
            {gridLabel}
          </span>
          {!isLoading && filtered.length > 0 && (
            <span className="text-[10px] text-text-secondary/60">
              {filtered.length} destination{filtered.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        <motion.div
          key={`${trip.mode}-${searchTerm}`}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show:   { opacity: 1, transition: { staggerChildren: 0.04 } },
          }}
        >
          {/* ── Cards ── */}
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
                  isSelected
                    ? 'border-primary ring-2 ring-primary/30 shadow-lg shadow-primary/20'
                    : 'border-border'
                }`}
              >
                <CardImage src={imageFor(dest)} alt={`${dest.name}, ${dest.region}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 group-hover:from-black/95 transition-colors" />

                {/* Select / selected indicator */}
                {isSelected ? (
                  <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-md">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-white/10 group-hover:bg-primary backdrop-blur-md border border-white/20 flex items-center justify-center transition-all">
                    <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                  </div>
                )}

                {/* Card footer */}
                <div className="absolute bottom-0 left-0 right-0 p-3.5">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] font-semibold tracking-widest text-amber-300 uppercase">
                      {dest.category}
                    </span>
                    {/* Extended badge — shown when result came from external provider */}
                    {dest.source === 'external' && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                        Extended
                      </span>
                    )}
                  </div>
                  <h4 className="font-heading font-bold text-sm text-white uppercase leading-tight">
                    {dest.name}
                  </h4>
                  <span className="text-[11px] text-white/70">
                    {dest.region || dest.state}
                  </span>
                </div>
              </motion.button>
            );
          })}

          {/* ── Loading state (no results yet) ── */}
          {isLoading && filtered.length === 0 && (
            <div className="col-span-full flex items-center justify-center py-12 gap-3 text-sm text-text-secondary">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              Searching destinations…
            </div>
          )}

          {/* ── Empty state ── */}
          {!isLoading && filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full flex flex-col items-center justify-center py-12 gap-3 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-surface border border-border flex items-center justify-center mb-1">
                <MapPin className="w-6 h-6 text-text-secondary/50" />
              </div>
              <p className="text-sm font-semibold text-text-main">
                No destinations found
              </p>
              <p className="text-xs text-text-secondary max-w-xs">
                {isSearching
                  ? `No matches for "${searchTerm}". Try a broader term or check the spelling.`
                  : 'No destinations available for this category.'}
              </p>
              {isSearching && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="mt-1 text-xs text-primary font-semibold hover:underline"
                >
                  Clear search
                </button>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};