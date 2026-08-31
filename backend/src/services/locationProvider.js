// backend/src/services/locationProvider.js
// ─────────────────────────────────────────────────────────────────────────────
// External Location Provider Adapter
//
// DEFAULT PROVIDER: OpenStreetMap Nominatim (free, no API key required)
//   → Handles real-world places not in our MySQL seed (e.g. Araku Valley)
//
// TO SWITCH TO A PREMIUM PROVIDER (Google Places, Mapbox, HERE, etc.):
//   1. Set  LOCATION_API_KEY=<your_key>  in backend/.env
//   2. Set  LOCATION_API_PROVIDER=google  (or mapbox | here) in backend/.env
//   3. Replace the nominatimSearch() function body below with your provider's
//      HTTP call, and map its response fields to the TripTasticPlace shape.
// ─────────────────────────────────────────────────────────────────────────────

const https = require('https');

// ── Config ───────────────────────────────────────────────────────────────────

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';

// User-Agent is required by Nominatim's usage policy
const USER_AGENT = 'TripTastic/1.0 (trip-planning-app; contact@triptastic.dev)';

// Maximum results to request from the external provider
const MAX_RESULTS = 8;

// Request timeout in milliseconds
const REQUEST_TIMEOUT_MS = 7000;
const COMMON_ALIASES = {
  vizag: 'Visakhapatnam',
  bombay: 'Mumbai',
  bangalore: 'Bengaluru',
  calcutta: 'Kolkata',
  madras: 'Chennai',
  cochin: 'Kochi',
  trivandrum: 'Thiruvananthapuram',
};

// ── HTTPS helper ─────────────────────────────────────────────────────────────

/**
 * Minimal HTTPS GET — returns parsed JSON.
 * We avoid adding an `axios` / `node-fetch` dependency to keep the backend lean.
 * @param {string} url
 * @returns {Promise<any>}
 */
function httpsGet(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        headers: {
          'User-Agent': USER_AGENT,
          'Accept':     'application/json',
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              reject(new Error(`JSON parse error: ${e.message}`));
            }
          } else {
            reject(new Error(`HTTP ${res.statusCode} from ${url}`));
          }
        });
      }
    );

    req.setTimeout(REQUEST_TIMEOUT_MS, () => {
      req.destroy();
      reject(new Error(`Request timeout after ${REQUEST_TIMEOUT_MS}ms`));
    });

    req.on('error', reject);
  });
}

// ── Nominatim search ─────────────────────────────────────────────────────────

/**
 * Search Nominatim for a place name.
 * @param {string} query
 * @param {'national'|'international'|''} mode
 * @returns {Promise<TripTasticPlace[]>}
 */
async function nominatimSearch(query, mode) {
  // Nominatim countrycodes param restricts results to specific country
  // national → India ('in'), international → no restriction
  const countryCode = mode === 'national' ? '&countrycodes=in' : '';

  const url =
    `${NOMINATIM_BASE}/search` +
    `?q=${encodeURIComponent(query)}` +
    `&format=json` +
    `&limit=${MAX_RESULTS}` +
    `&addressdetails=1` +          // needed for state/country breakdown
    `&accept-language=en` +
    countryCode;

  console.log(`[locationProvider] Nominatim query: ${url}`);

  const results = await httpsGet(url);

  if (!Array.isArray(results)) return [];

  return results
    .filter((r) => {
      // Only return meaningful place types (not roads, postcodes, etc.)
      const type = (r.type || '').toLowerCase();
      const cls  = (r.class || '').toLowerCase();
      const ALLOWED_TYPES = new Set([
        'city', 'town', 'village', 'hamlet', 'suburb', 'quarter',
        'administrative', 'state', 'district', 'region', 'county',
        'tourism', 'natural', 'peak', 'lake', 'island', 'beach',
        'national_park', 'protected_area', 'valley', 'reservation',
      ]);
      const ALLOWED_CLASSES = new Set([
        'place', 'boundary', 'natural', 'tourism', 'leisure',
      ]);
      return ALLOWED_TYPES.has(type) || ALLOWED_CLASSES.has(cls);
    })
    .map((r) => normalisaNominatimResult(r, mode));
}

// ── Normalise a Nominatim result → TripTastic shape ──────────────────────────

/**
 * Map an OSM Nominatim result to the TripTastic place shape.
 * @param {object} r  - raw Nominatim result
 * @param {string} mode
 * @returns {TripTasticPlace}
 */
function normalisaNominatimResult(r, mode) {
  const addr    = r.address || {};
  const osmId   = r.osm_id  || r.place_id;

  // Build a slug-style id that won't collide with MySQL ids
  // e.g. 'ext-araku-valley-12345678'
  const rawName = (r.name || r.display_name || 'unknown').toLowerCase();
  const slug    = rawName.replace(/[^a-z0-9]+/g, '-').slice(0, 40);
  const id      = `ext-${slug}-${osmId}`.slice(0, 60);

  // Infer category from OSM type/class
  const category = inferCategory(r.type, r.class, rawName);

  // Resolve location hierarchy
  const city    = addr.city || addr.town || addr.village || addr.hamlet || r.name || '';
  const state   = addr.state || addr.county || addr.region || '';
  const country = addr.country || '';

  // Build a region label
  const region = state
    ? `${state}${country && country !== 'India' ? `, ${country}` : ''}`
    : country;

  // Infer travel_type: if country is India → national, else international
  const travelType = (country.toLowerCase() === 'india') ? 'national' : 'international';

  return {
    id,
    name:        r.name || city || r.display_name.split(',')[0].trim(),
    displayName: r.display_name || r.name || city,
    city,
    state,
    country,
    region,
    category,
    description: `${r.name || city}${state ? `, ${state}` : ''}${country ? `, ${country}` : ''}`,
    latitude:    parseFloat(r.lat)  || null,
    longitude:   parseFloat(r.lon) || null,
    travel_type: mode || travelType,
    popular:     false,
    source:      'external',
  };
}

function photonSearch(query, mode) {
  const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=${MAX_RESULTS}`;
  return httpsGet(url).then((data) => (data.features || []).map((feature, index) => {
    const props = feature.properties || {};
    const coords = feature.geometry?.coordinates || [];
    const country = props.country || '';
    const state = props.state || props.county || '';
    const name = props.name || props.city || query;
    return {
      id: `ext-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${props.osm_id || index}`,
      name,
      displayName: [name, state, country].filter(Boolean).join(', '),
      city: props.city || props.town || props.village || name,
      state,
      country,
      region: state,
      category: 'nature',
      description: [name, state, country].filter(Boolean).join(', '),
      latitude: Number(coords[1]) || null,
      longitude: Number(coords[0]) || null,
      travel_type: mode || (country.toLowerCase() === 'india' ? 'national' : 'international'),
      popular: false,
      source: 'external',
    };
  }));
}

/**
 * Infer a TripTastic category from OSM type/class strings.
 * Falls back to 'nature'.
 */
function inferCategory(type, cls, name) {
  const t = (type  || '').toLowerCase();
  const c = (cls   || '').toLowerCase();
  const n = (name  || '').toLowerCase();

  if (['peak', 'mountain', 'hill'].some(k => t.includes(k) || n.includes(k))) return 'mountains';
  if (['beach', 'coast'].some(k => t.includes(k) || n.includes(k)))           return 'beaches';
  if (['national_park', 'protected_area', 'nature_reserve'].some(k => t.includes(k))) return 'nature';
  if (['valley', 'lake', 'river', 'waterfall'].some(k => t.includes(k) || n.includes(k))) return 'nature';
  if (['city', 'town'].includes(t))                                            return 'city';
  if (['tourism', 'leisure'].includes(c))                                      return 'adventure';
  if (['administrative', 'boundary'].includes(c))                              return 'culture';
  return 'nature';
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Search external location provider for destinations.
 *
 * This is the single entry-point called by destinationSearchService.js.
 * To swap providers, replace this function's implementation.
 *
 * @param {string} query
 * @param {'national'|'international'|''} mode
 * @returns {Promise<TripTasticPlace[]>}
 */
async function searchExternalLocations(query, mode) {
  // ── PREMIUM PROVIDER HOOK ────────────────────────────────────────────────
  // When LOCATION_API_KEY is set, you can route to a premium provider here:
  //
  //   const apiKey = process.env.LOCATION_API_KEY;
  //   if (apiKey) {
  //     return await googlePlacesSearch(query, mode, apiKey);  // implement separately
  //   }
  //
  // For now, all traffic goes to Nominatim (free, no key needed).
  // ────────────────────────────────────────────────────────────────────────

  const enabled = process.env.LOCATION_API_ENABLED !== 'false';
  if (!enabled) {
    console.log('[locationProvider] External search disabled via LOCATION_API_ENABLED=false');
    return [];
  }

  const resolvedQuery = COMMON_ALIASES[query.trim().toLowerCase()] || query;
  try {
    const results = await nominatimSearch(resolvedQuery, mode);
    if (results.length > 0) return results;
  } catch (err) {
    console.warn(`[locationProvider] Nominatim search failed: ${err.message}`);
  }

  try {
    const results = await photonSearch(resolvedQuery, mode);
    console.log(`[locationProvider] Photon fallback returned ${results.length} results`);
    return results;
  } catch (err) {
    // Never let external provider failure crash the search response.
    console.warn(`[locationProvider] External search failed: ${err.message}`);
    return [];
  }
}

module.exports = { searchExternalLocations };
