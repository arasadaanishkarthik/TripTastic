import React, { createContext, useContext, useState, useEffect } from 'react';

const TravelModeContext = createContext({
  travelMode: 'national', // 'national' | 'international'
  setTravelMode: () => {},
  toggleTravelMode: () => {},
});

export const TravelModeProvider = ({ children }) => {
  const [travelMode, setTravelMode] = useState(() => {
    const saved = localStorage.getItem('triptastic_travel_mode');
    return saved === 'international' ? 'international' : 'national';
  });

  useEffect(() => {
    localStorage.setItem('triptastic_travel_mode', travelMode);
  }, [travelMode]);

  const toggleTravelMode = () => {
    setTravelMode((prev) => (prev === 'national' ? 'international' : 'national'));
  };

  return (
    <TravelModeContext.Provider value={{ travelMode, setTravelMode, toggleTravelMode }}>
      {children}
    </TravelModeContext.Provider>
  );
};

export const useTravelMode = () => useContext(TravelModeContext);