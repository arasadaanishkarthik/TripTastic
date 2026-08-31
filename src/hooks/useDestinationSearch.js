// src/hooks/useDestinationSearch.js
// API-driven destination search with debounce + graceful local fallback.

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { searchDestinations, getAllDestinations } from '../services/api';
import { DESTINATIONS_DATA } from '../data/destinations';

const DEBOUNCE_MS = 350;

/**
 * Normalise a row returned from the backend API to the same shape
 * used by the existing UI (which was built against local data).
 * Preserves the `source` field ('local' | 'external') so the UI can badge
 * externally-sourced cards.
 */
function normaliseRow(d, fallbackMode) {
  return {
    id:          d.id,
    name:        d.name,
    city:        d.city        || d.name,
    state:       d.state       || '',
    country:     d.country     || 'India',
    region:      d.region      || d.state || '',
    category:    d.category    || 'nature',
    description: d.description || '',
    latitude:    d.latitude    ?? null,
    longitude:   d.longitude   ?? null,
    mode:        d.travel_type || fallbackMode,
    popular:     Boolean(d.popular),
    source:      d.source      || 'local',   // 'local' | 'external'
    aliases:     [],
  };
}

/**
 * Local JS filter — used when the API is unreachable.
 * Falls back to the static DESTINATIONS_DATA bundled in the frontend.
 */
function filterLocal(query, travelMode, selectedCategory) {
  const lower = (query || '').trim().toLowerCase();
  let result = DESTINATIONS_DATA.filter((d) => d.mode === travelMode);

  if (selectedCategory && selectedCategory !== 'all') {
    result = result.filter((d) => d.category === selectedCategory);
  }
  if (!lower) {
    // Show popular first when no query
    return [...result].sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
  }
  return result.filter((d) =>
    d.name.toLowerCase().includes(lower) ||
    (d.city  || '').toLowerCase().includes(lower) ||
    (d.state || '').toLowerCase().includes(lower) ||
    (d.country || '').toLowerCase().includes(lower) ||
    (d.region || '').toLowerCase().includes(lower) ||
    (d.aliases || []).some((a) => a.toLowerCase().includes(lower))
  );
}

/**
 * @param {string} travelMode  - 'national' | 'international'
 * @returns {{
 *   query: string,
 *   setQuery: Function,
 *   selectedCategory: string,
 *   setSelectedCategory: Function,
 *   filteredDestinations: Array,
 *   popularDestinations: Array,
 *   isLoading: boolean,
 *   isApiAvailable: boolean|null,  // null = not yet determined
 *   error: string|null,            // non-null when the last API call failed
 * }}
 */
export const useDestinationSearch = (travelMode) => {
  const [query, setQuery]                       = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [apiResults, setApiResults]             = useState(null);  // null = use local
  const [isLoading, setIsLoading]               = useState(false);
  const [isApiAvailable, setIsApiAvailable]     = useState(null);  // null = not yet tried
  const [error, setError]                       = useState(null);  // string | null

  const timerRef   = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // ── API fetch ───────────────────────────────────────────────────────────
  const fetchFromApi = useCallback(async (q, mode, category) => {
    if (!mountedRef.current) return;
    setIsLoading(true);
    setError(null);

    try {
      let rows;
      const hasQuery = q && q.trim().length >= 1;

      if (hasQuery) {
        rows = await searchDestinations(q.trim(), mode);
      } else {
        rows = await getAllDestinations(mode, category !== 'all' ? category : '');
      }

      if (!mountedRef.current) return;

      // Apply category filter client-side when a search returned uncategorised results
      let finalRows = rows.map((d) => normaliseRow(d, mode));
      if (hasQuery && category && category !== 'all') {
        finalRows = finalRows.filter((d) => d.category === category);
      }

      // An upstream provider can legitimately return an empty response (for
      // example while Nominatim is rate-limited). Keep local matches visible
      // instead of presenting an empty search result.
      setApiResults(finalRows.length > 0 ? finalRows : filterLocal(q, mode, category));
      setIsApiAvailable(true);
    } catch (err) {
      if (!mountedRef.current) return;
      console.warn('[useDestinationSearch] API unavailable → local fallback:', err.message);
      setIsApiAvailable(false);
      setApiResults(null);
      setError(err.message || 'Search temporarily unavailable. Showing local results.');
    } finally {
      if (mountedRef.current) setIsLoading(false);
    }
  }, []);

  // ── Debounced effect ────────────────────────────────────────────────────
  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      fetchFromApi(query, travelMode, selectedCategory);
    }, DEBOUNCE_MS);
    return () => clearTimeout(timerRef.current);
  }, [query, travelMode, selectedCategory, fetchFromApi]);

  // ── Derived results ─────────────────────────────────────────────────────
  const filteredDestinations = useMemo(() => {
    if (apiResults !== null) return apiResults;
    // Local fallback — add source tag to local data items
    return filterLocal(query, travelMode, selectedCategory).map((d) => ({
      ...d,
      source: d.source || 'local',
    }));
  }, [apiResults, query, travelMode, selectedCategory]);

  // Popular destinations — always from local data for instant rendering
  const popularDestinations = useMemo(
    () => DESTINATIONS_DATA.filter((d) => d.mode === travelMode && d.popular),
    [travelMode]
  );

  return {
    query,
    setQuery,
    selectedCategory,
    setSelectedCategory,
    filteredDestinations,
    popularDestinations,
    isLoading,
    isApiAvailable,   // null | true | false
    error,            // null | string
  };
};