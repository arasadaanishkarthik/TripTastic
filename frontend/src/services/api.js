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

// ── Image API (Pexels / Curated Fallback) ────────────────────────────────────

const _imgCache = new Map();
const _imgInFlight = new Map();

const FRONTEND_FALLBACKS = {
  'goa':           'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1800&q=85',
  'jaipur':        'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1800&q=85',
  'jammu':         'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=1800&q=85',
  'kerala':        'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1800&q=85',
  'ladakh':        'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1800&q=85',
  'leh':           'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1800&q=85',
  'manali':        'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1800&q=85',
  'meghalaya':     'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=1800&q=85',
  'mumbai':        'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1800&q=85',
  'srinagar':      'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1800&q=85',
  'agra':          'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1800&q=85',
  'alappuzha':     'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1800&q=85',
  'alleppey':      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1800&q=85',
  'munnar':        'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1800&q=85',
  'araku':         'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=85',
  'wayanad':       'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1800&q=85',
  'kochi':         'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1800&q=85',
  'varkala':       'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1800&q=85',
  'thekkady':      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1800&q=85',
  'vagamon':       'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1800&q=85',
  'delhi':         'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1800&q=85',
  'udaipur':       'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1800&q=85',
  'jaisalmer':     'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1800&q=85',
  'rajasthan':     'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1800&q=85',
  'varanasi':      'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1800&q=85',
  'rishikesh':     'https://images.unsplash.com/photo-1600100397608-f010f443a6d4?auto=format&fit=crop&w=1800&q=85',
  'shimla':        'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=1800&q=85',
  'spiti':         'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1800&q=85',
  'dharamshala':   'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1800&q=85',
  'gulmarg':       'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1800&q=85',
  'kashmir':       'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1800&q=85',
  'darjeeling':    'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1800&q=85',
  'gangtok':       'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1800&q=85',
  'ooty':          'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1800&q=85',
  'coorg':         'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1800&q=85',
  'andaman':       'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1800&q=85',
  'pondicherry':   'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1800&q=85',
  'hyderabad':     'https://images.unsplash.com/photo-1572445271230-a78b5944a659?auto=format&fit=crop&w=1800&q=85',
  'bengaluru':     'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1800&q=85',
  'bangalore':     'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1800&q=85',
  'chennai':       'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1800&q=85',
  'kolkata':       'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=1800&q=85',
  'amritsar':      'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=1800&q=85',
  'visakhapatnam': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=85',
  'vizag':         'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=85',
  'vizianagaram':  'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1800&q=85',
  'vzm':           'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1800&q=85',
  'patna':         'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1800&q=85',
  'tokyo':         'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1800&q=85',
  'kyoto':         'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1800&q=85',
  'bali':          'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1800&q=85',
  'paris':         'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1800&q=85',
  'dubai':         'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1800&q=85',
  'switzerland':   'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1800&q=85',
  'iceland':       'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1800&q=85',
  'london':        'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1800&q=85',
  'rome':          'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1800&q=85',
  'maldives':      'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1800&q=85',
  'default':       'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1800&q=85',
};

function getLocalFallback(query) {
  const lower = (query || '').toLowerCase().trim();
  if (FRONTEND_FALLBACKS[lower]) {
    const url = FRONTEND_FALLBACKS[lower];
    return { url, thumbUrl: url.replace('&w=1800', '&w=600'), attribution: null, source: 'curated-fallback' };
  }
  for (const [key, url] of Object.entries(FRONTEND_FALLBACKS)) {
    if (key !== 'default' && (lower.includes(key) || key.includes(lower))) {
      return { url, thumbUrl: url.replace('&w=1800', '&w=600'), attribution: null, source: 'curated-fallback' };
    }
  }
  const fallbackUrl = FRONTEND_FALLBACKS['default'];
  return { url: fallbackUrl, thumbUrl: fallbackUrl.replace('&w=1800', '&w=600'), attribution: null, source: 'default-fallback' };
}

/**
 * Get a destination image URL.
 * Queries the backend (Pexels / Fallback), with in-memory caching, deduplication, and fast timeout.
 * @param {string} query  - e.g. 'Kerala', 'Mumbai', 'Visakhapatnam'
 */
export async function getDestinationImage(query) {
  const cacheKey = (query || '').toLowerCase().trim();
  if (!cacheKey) return getLocalFallback('default');

  if (_imgCache.has(cacheKey)) {
    return _imgCache.get(cacheKey);
  }

  if (_imgInFlight.has(cacheKey)) {
    return _imgInFlight.get(cacheKey);
  }

  const fetchPromise = (async () => {
    try {
      // 4-second timeout for image lookup so it never delays the page
      const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timeoutId = controller ? setTimeout(() => controller.abort(), 4500) : null;

      try {
        const data = await apiFetch(`/images/destination?q=${encodeURIComponent(query)}`, {
          signal: controller?.signal,
        });
        if (timeoutId) clearTimeout(timeoutId);
        if (data && data.url) {
          _imgCache.set(cacheKey, data);
          return data;
        }
      } catch (e) {
        if (timeoutId) clearTimeout(timeoutId);
      }

      const fallback = getLocalFallback(query);
      _imgCache.set(cacheKey, fallback);
      return fallback;
    } catch {
      const fallback = getLocalFallback(query);
      _imgCache.set(cacheKey, fallback);
      return fallback;
    }
  })();

  _imgInFlight.set(cacheKey, fetchPromise);

  try {
    const result = await fetchPromise;
    return result;
  } finally {
    _imgInFlight.delete(cacheKey);
  }
}


