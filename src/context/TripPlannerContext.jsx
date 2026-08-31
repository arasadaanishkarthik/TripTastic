import React, { createContext, useContext, useState, useEffect } from 'react';

const TripPlannerContext = createContext();

const STORAGE_KEY = 'triptastic_trip_draft';
const GENERATED_STORAGE_KEY = 'triptastic_generated_itinerary';
const TOTAL_STEPS = 5;

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const calculateTripDurationDays = (dates = {}) => {
  if (!dates?.start || !dates?.end) return 4;

  const start = new Date(dates.start);
  const end = new Date(dates.end);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 4;

  const diffDays = Math.round((end - start) / MS_PER_DAY);
  return diffDays > 0 ? diffDays + 1 : 1;
};

const defaultTripState = {
  step: 1,
  mode: 'national',
  destination: { id: '', name: '', region: '', description: '', image: '' },
  dates: { start: '', end: '' },
  durationDays: 4,
  groupSize: 4,
  travelers: ['Anish', 'Rahul', 'Priya', 'Arjun'],
  budgetPerPerson: 6000,
  preferences: ['adventure', 'nature', 'food', 'photography'],
  preferenceRanking: ['adventure', 'nature', 'food', 'photography'],
};

export const TripPlannerProvider = ({ children }) => {
  const [trip, setTrip] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const normalized = { ...defaultTripState, ...parsed };
        normalized.durationDays = Number(parsed.durationDays) || calculateTripDurationDays(normalized.dates);
        return normalized;
      } catch (e) {
        return defaultTripState;
      }
    }
    return defaultTripState;
  });

  // AI-generated itinerary — stored in memory only (not persisted to localStorage)
  const [generatedItinerary, setGeneratedItinerary] = useState(() => {
    const saved = localStorage.getItem(GENERATED_STORAGE_KEY);
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch {
      localStorage.removeItem(GENERATED_STORAGE_KEY);
      return null;
    }
  });

  useEffect(() => {
    if (generatedItinerary) {
      localStorage.setItem(GENERATED_STORAGE_KEY, JSON.stringify(generatedItinerary));
    } else {
      localStorage.removeItem(GENERATED_STORAGE_KEY);
    }
  }, [generatedItinerary]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trip));
  }, [trip]);

  const updateTrip = (updates) => {
    setTrip((prev) => {
      const nextTrip = { ...prev, ...updates };

      if (updates && updates.dates) {
        nextTrip.dates = { ...prev.dates, ...updates.dates };
        nextTrip.durationDays = calculateTripDurationDays(nextTrip.dates);
      }

      if (updates && Object.prototype.hasOwnProperty.call(updates, 'durationDays')) {
        nextTrip.durationDays = Number(updates.durationDays) || nextTrip.durationDays;
      }

      return nextTrip;
    });
  };

  const resetTrip = () => {
    setTrip(defaultTripState);
    setGeneratedItinerary(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(GENERATED_STORAGE_KEY);
  };

  const nextStep = () => {
    setTrip((prev) => ({ ...prev, step: Math.min(prev.step + 1, TOTAL_STEPS) }));
  };

  const prevStep = () => {
    setTrip((prev) => ({ ...prev, step: Math.max(prev.step - 1, 1) }));
  };

  const goToStep = (step) => {
    setTrip((prev) => ({ ...prev, step: Math.min(Math.max(step, 1), TOTAL_STEPS) }));
  };

  return (
    <TripPlannerContext.Provider
      value={{
        trip,
        updateTrip,
        resetTrip,
        nextStep,
        prevStep,
        goToStep,
        TOTAL_STEPS,
        generatedItinerary,
        setGeneratedItinerary,
      }}
    >
      {children}
    </TripPlannerContext.Provider>
  );
};

export const useTripPlanner = () => useContext(TripPlannerContext);