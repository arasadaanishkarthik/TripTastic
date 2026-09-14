// src/components/planner/DestinationStep.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, CheckCircle2, ArrowUpRight,
  Globe2, Loader2, Wifi, WifiOff, X,
} from 'lucide-react';
import { useTripPlanner } from '../../context/TripPlannerContext';
import { useDestinationSearch } from '../../hooks/useDestinationSearch';
import { getDestinationImage } from '../../services/api';

// ── Destination Card Item with Reliable Image Fetching & Caching ──────────────
const DestinationCardItem = ({ dest, isSelected, onSelect }) => {
  const [imgSrc, setImgSrc] = useState(dest.image || '');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const destName = dest.name || dest.id;

    getDestinationImage(destName)
      .then((res) => {
        if (!cancelled && res?.url) {
          setImgSrc(res.url);
        }
      })
      .catch(() => {
        if (!cancelled) setIsError(true);
      });

    return () => { cancelled = true; };
  }, [dest.name, dest.id]);

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(dest)}
      variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`group relative h-44 rounded-2xl overflow-hidden text-left border transform-gpu transition-all ${
        isSelected
          ? 'border-primary ring-2 ring-primary/40 shadow-xl shadow-primary/20 scale-[1.01]'
          : 'border-border hover:border-primary/50'
      }`}
    >
      {/* Background Image Container */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#09182C] via-[#07111F] to-[#040812]">
        {imgSrc && !isError ? (
          <img
            src={imgSrc}
            alt={`${dest.name}, ${dest.region || dest.state || ''}`}
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            onError={() => setIsError(true)}
            className={`w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 ${
              isLoaded ? 'opacity-100' : 'opacity-60 blur-xs'
            }`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/15">
            <Globe2 className="w-10 h-10 text-white/30" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/10 group-hover:from-black/95 transition-colors" />
      </div>

      {/* Select / selected indicator */}
      {isSelected ? (
        <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-md z-10">
          <CheckCircle2 className="w-4 h-4 text-white" />
        </div>
      ) : (
        <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-white/15 group-hover:bg-primary backdrop-blur-md border border-white/20 flex items-center justify-center transition-all z-10">
          <ArrowUpRight className="w-3.5 h-3.5 text-white" />
        </div>
      )}

      {/* Card footer */}
      <div className="absolute bottom-0 left-0 right-0 p-3.5 z-10">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-[10px] font-semibold tracking-widest text-accent uppercase">
            {dest.category}
          </span>
          {dest.source === 'external' && (
            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
              Extended
            </span>
          )}
        </div>
        <h4 className="font-heading font-bold text-sm text-white uppercase leading-tight truncate">
          {dest.name}
        </h4>
        <span className="text-[11px] text-white/70 block truncate">
          {dest.region || dest.state || dest.country || ''}
        </span>
      </div>
    </motion.button>
  );
};

// ── Main Destination Step Component ───────────────────────────────────────────
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

  // Select a destination → update TripPlanner context
  const handleSelect = (dest) => {
    updateTrip({
      destination: {
        id:          dest.id,
        name:        dest.name,
        region:      dest.region || dest.state || '',
        description: dest.description || '',
        category:    dest.category || 'nature',
        city:        dest.city || '',
        state:       dest.state || '',
        country:     dest.country || (trip.mode === 'national' ? 'India' : ''),
        latitude:    dest.latitude ?? null,
        longitude:   dest.longitude ?? null,
        image:       dest.image || '',
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
          <h2 className="text-xl xs:text-2xl sm:text-3xl font-heading font-extrabold text-text-main uppercase tracking-tight">
            Where are you going?
          </h2>

          {/* API status badge */}
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
      <div className="inline-flex p-1 rounded-2xl bg-surface border border-border shadow-inner">
        {['national', 'international'].map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => handleModeChange(m)}
            className={`px-4 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all duration-300 ${
              trip.mode === m
                ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/20'
                : 'text-text-secondary hover:text-text-main'
            }`}
          >
            {m === 'national' ? '🇮🇳 National' : '🌎 International'}
          </button>
        ))}
      </div>

      {/* ── Search Bar ── */}
      <div className="relative">
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
          placeholder={`Search ${trip.mode === 'national' ? 'India' : 'worldwide'}… (Jaipur, Goa, Jammu, Manali…)`}
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
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 flex items-center justify-center transition-colors"
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

      {/* ── Selected Destination Banner ── */}
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
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-text-main uppercase truncate max-w-[200px] xs:max-w-none">
                  {trip.destination.name}
                </h4>
                <span className="text-xs text-text-secondary truncate block max-w-[200px] xs:max-w-none">
                  {trip.destination.region || trip.destination.category}
                </span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary shrink-0">
              <CheckCircle2 className="w-4 h-4" /> Selected
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Destination Grid (Responsive: 1 col on mobile, 2 col on tablet, 3 col on desktop) ── */}
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show:   { opacity: 1, transition: { staggerChildren: 0.03 } },
          }}
        >
          {filtered.map((dest) => (
            <DestinationCardItem
              key={dest.id}
              dest={dest}
              isSelected={trip.destination.id === dest.id}
              onSelect={handleSelect}
            />
          ))}

          {/* ── Loading state ── */}
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
                  ? `No matches for "${searchTerm}". Try searching a city name like "Goa", "Jaipur", or "Jammu".`
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