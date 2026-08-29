import { useState, useMemo } from 'react';
import { DESTINATIONS_DATA } from '../data/destinations';

export const useDestinationSearch = (travelMode) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredDestinations = useMemo(() => {
    // 1. Filter by National/International mode
    const modeFiltered = DESTINATIONS_DATA.filter((d) => d.mode === travelMode);

    // 2. Filter by Category if active
    const categoryFiltered =
      selectedCategory === 'all'
        ? modeFiltered
        : modeFiltered.filter((d) => d.category === selectedCategory);

    const trimmedQuery = query.trim().toLowerCase();

    if (!trimmedQuery) {
      return categoryFiltered;
    }

    // 3. Partial match search across name, city, state, country, region, aliases
    return categoryFiltered.filter((d) => {
      const matchName = d.name.toLowerCase().includes(trimmedQuery);
      const matchCity = d.city.toLowerCase().includes(trimmedQuery);
      const matchState = d.state.toLowerCase().includes(trimmedQuery);
      const matchCountry = d.country.toLowerCase().includes(trimmedQuery);
      const matchRegion = d.region.toLowerCase().includes(trimmedQuery);
      const matchAliases = d.aliases?.some((alias) => alias.toLowerCase().includes(trimmedQuery));

      return matchName || matchCity || matchState || matchCountry || matchRegion || matchAliases;
    });
  }, [query, selectedCategory, travelMode]);

  const popularDestinations = useMemo(() => {
    return DESTINATIONS_DATA.filter((d) => d.mode === travelMode && d.popular);
  }, [travelMode]);

  return {
    query,
    setQuery,
    selectedCategory,
    setSelectedCategory,
    filteredDestinations,
    popularDestinations,
  };
};