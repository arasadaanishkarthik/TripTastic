import React, { createContext, useContext, useState, useEffect } from 'react';

const TripPlannerContext = createContext();

const STORAGE_KEY = 'triptastic_trip_draft';
const TOTAL_STEPS = 5;

const defaultTripState = {
  step: 1,
  mode: 'national',
  destination: { id: '', name: '', region: '', description: '', image: '' },
  dates: { start: '', end: '' },
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
        return { ...defaultTripState, ...JSON.parse(saved) };
      } catch (e) {
        return defaultTripState;
      }
    }
    return defaultTripState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trip));
  }, [trip]);

  const updateTrip = (updates) => {
    setTrip((prev) => ({ ...prev, ...updates }));
  };

  const resetTrip = () => {
    setTrip(defaultTripState);
    localStorage.removeItem(STORAGE_KEY);
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
      value={{ trip, updateTrip, resetTrip, nextStep, prevStep, goToStep, TOTAL_STEPS }}
    >
      {children}
    </TripPlannerContext.Provider>
  );
};

export const useTripPlanner = () => useContext(TripPlannerContext);