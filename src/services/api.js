// src/services/api.js
// Centralised frontend API client.
// All backend calls go through here — React never touches MySQL or external APIs directly.

const BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api'
).replace(/\/$/, '');

/**
 * Generic fetch wrapper with timeout + error handling.
 * Timeout is long enough for Gemini generation while still preventing a hung
 * external provider from blocking the UI indefinitely.
 */
async function apiFetch(path, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 75000);

  try {
    const url = `${BASE_URL}${path}`;
    let res;
    try {
      res = await fetch(url, {
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options,
      });
    } catch (err) {
      if (err.name === 'AbortError') {
        throw new Error(`TripTastic API request timed out: ${path}`);
      }
      throw new Error(`Unable to reach TripTastic API at ${url}: ${err.message}`);
    }

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message || `API error ${res.status}`);
    }

    return res.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

// ── Destination APIs ──────────────────────────────────────────────────────────

/**
 * Search destinations by query string.
 * @param {string} query
 * @param {'national'|'international'|''} [mode]
 */
export async function searchDestinations(query, mode = '') {
  const params = new URLSearchParams();
  if (query && query.trim()) params.append('q', query.trim());
  if (mode) params.append('mode', mode);
  const data = await apiFetch(`/destinations/search?${params}`);
  return data.destinations || [];
}

/**
 * Fetch all destinations filtered by travel mode.
 * @param {'national'|'international'|''} [mode]
 * @param {string} [category]
 */
export async function getAllDestinations(mode = '', category = '') {
  const params = new URLSearchParams();
  if (mode) params.append('mode', mode);
  if (category && category !== 'all') params.append('category', category);
  const data = await apiFetch(`/destinations?${params}`);
  return data.destinations || [];
}

/**
 * Fetch a single destination by id slug.
 * @param {string} id
 */
export async function getDestinationById(id) {
  const data = await apiFetch(`/destinations/${id}`);
  return data.destination || null;
}

export async function geocodeLocation(query) {
  const data = await apiFetch(`/destinations/geocode?q=${encodeURIComponent(query)}`);
  return data.location || null;
}

/**
 * Check backend health and integration status.
 * @returns {Promise<object>}
 */
export async function checkHealth() {
  try {
    return await apiFetch('/health');
  } catch {
    return { success: false };
  }
}

// ── Itinerary APIs ────────────────────────────────────────────────────────────

/**
 * Generate an AI itinerary from trip data.
 * @param {object} tripData
 */
export async function generateItinerary(tripData) {
  const data = await apiFetch('/itinerary/generate', {
    method: 'POST',
    body:   JSON.stringify(tripData),
  });
  return data.itinerary;
}

/**
 * Chat with the AI about the current itinerary.
 * @param {object} itinerary
 * @param {string} message
 */
export async function chatWithAI(itinerary, message) {
  const data = await apiFetch('/itinerary/chat', {
    method: 'POST',
    body:   JSON.stringify({ itinerary, message }),
  });
  return data.reply || '';
}

// ── Weather API (Open-Meteo, free) ────────────────────────────────────────────

/**
 * Fetch weather forecast by coordinates.
 * @param {number} lat
 * @param {number} lon
 * @param {number} [days=7]
 */
export async function getWeather(lat, lon, days = 7) {
  return apiFetch(`/weather?lat=${lat}&lon=${lon}&days=${days}`);
}

/**
 * Fetch weather by place name (geocodes internally via Nominatim).
 * @param {string} placeName
 * @param {number} [days=7]
 */
export async function getWeatherByPlace(placeName, days = 7) {
  const params = new URLSearchParams({ q: placeName, days: String(days) });
  return apiFetch(`/weather/place?${params}`);
}

// ── Currency API (ExchangeRate-API open-access, free) ─────────────────────────

/**
 * Get all exchange rates for a base currency.
 * @param {string} [base='INR']
 */
export async function getCurrencyRates(base = 'INR') {
  return apiFetch(`/currency/rates?base=${encodeURIComponent(base)}`);
}

/**
 * Convert an amount from one currency to another.
 * @param {string} from   - Source ISO 4217 code
 * @param {string} to     - Target ISO 4217 code
 * @param {number} amount
 */
export async function convertCurrency(from, to, amount) {
  const params = new URLSearchParams({ from, to, amount: String(amount) });
  return apiFetch(`/currency/convert?${params}`);
}

/**
 * Get list of all supported currency codes.
 */
export async function getSupportedCurrencies() {
  const data = await apiFetch('/currency/supported');
  return data.currencies || [];
}

// ── Image API (Pexels / Unsplash Source, free) ────────────────────────────────

/**
 * Get a destination image URL.
 * Falls back to Unsplash Source CDN if Pexels is not configured.
 * @param {string} query  - e.g. 'Kerala', 'Goa beach'
 */
export async function getDestinationImage(query) {
  try {
    return await apiFetch(`/images/destination?q=${encodeURIComponent(query)}`);
  } catch {
    // Final fallback: use Unsplash Source directly from the frontend
    const keyword = encodeURIComponent(query + ',travel,landscape');
    return {
      url:         `https://loremflickr.com/1800/900/${keyword}`,
      thumbUrl:    `https://loremflickr.com/600/400/${keyword}`,
      attribution: null,
      source:      'loremflickr-fallback',
    };
  }
}
