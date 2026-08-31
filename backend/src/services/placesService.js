// backend/src/services/placesService.js
// ─────────────────────────────────────────────────────────────────────────────
// Geoapify Places API — real tourist POI discovery
//
// Returns verified, real-world tourist attractions for a destination.
// Uses the Geoapify Places v2 API with broad tourism-relevant categories.
// Applies strict filtering to remove roads, stations, and generic addresses.
// ─────────────────────────────────────────────────────────────────────────────

const https = require('https');
const { searchExternalLocations } = require('./locationProvider');

// ── Filtering constants ───────────────────────────────────────────────────────

const FORBIDDEN_PATTERNS = [
  'railway station', 'bus station', 'airport', 'metro station',
  'junction', 'central station', 'city centre', 'city center',
  'downtown', 'motorway', 'highway', 'residential',
  'generic address', 'geocoding',
];

const GOOD_ATTRACTION_KEYWORDS = [
  'beach', 'temple', 'museum', 'park', 'falls', 'valley', 'fort', 'lake',
  'garden', 'viewpoint', 'cave', 'dam', 'reservoir', 'hill', 'wildlife',
  'national', 'heritage', 'church', 'palace', 'backwater', 'forest', 'point',
  'peak', 'waterfall', 'sanctuary', 'bay', 'monument', 'statue', 'mosque',
  'mandir', 'qutub', 'bridge', 'ghat', 'maidan', 'samadhi', 'gurudwara',
  'lighthouse', 'zoo', 'aquarium', 'planetarium', 'gallery', 'botanical',
  'archaeological', 'ruins', 'amphitheatre', 'observatory', 'adventure',
];

// Geoapify v2 category strings for tourist attractions
// Using broad parent categories that work reliably
const GEOAPIFY_CATEGORIES = [
  'tourism',
  'natural',
  'leisure',
  'entertainment',
];

// ── Utility ───────────────────────────────────────────────────────────────────

function getApiKey() {
  return process.env.GEOAPIFY_API_KEY || '';
}

function cleanText(value) {
  if (!value && value !== 0) return '';
  return String(value).replace(/\s+/g, ' ').trim();
}

function looksLikeGenericAddress(name, address, destinationName) {
  const haystack = `${name || ''} ${address || ''}`.toLowerCase();
  if (!haystack) return true;

  const dest = cleanText(destinationName || '').toLowerCase();
  const normalName = cleanText(name || '').toLowerCase();

  // Reject if the name IS exactly the destination name (geocoding result)
  if (normalName === dest || normalName === dest + ', india') return true;

  if (/\b(railway|bus|airport|metro)\s+station\b/.test(haystack)) return true;

  // Reject pure road / infrastructure names (unless they have attraction keywords)
  if (/\b(main road|highway|ring road|service road|footway|track|route|mandal|colony|ward|area)\b/.test(normalName)) {
    return !GOOD_ATTRACTION_KEYWORDS.some((k) => normalName.includes(k));
  }

  // Reject numbered addresses without attraction keywords
  if (/\d{3,6}/.test(normalName) && !GOOD_ATTRACTION_KEYWORDS.some((k) => normalName.includes(k))) {
    return true;
  }

  return false;
}

function isForbiddenResult(name, address, category, destinationName) {
  const haystack = [name, address, category].map(cleanText).filter(Boolean).join(' ').toLowerCase();
  if (!haystack) return true;
  if (FORBIDDEN_PATTERNS.some((p) => haystack.includes(p))) return true;
  if (looksLikeGenericAddress(name, address, destinationName)) return true;
  return false;
}

// Map Geoapify raw category array to TripTastic category label
function normalizeCategory(rawCategories) {
  const cats = Array.isArray(rawCategories) ? rawCategories.flat() : [];
  const flat = cats.map((c) => (typeof c === 'string' ? c.toLowerCase() : '')).join(' ');

  if (flat.includes('beach') || flat.includes('water')) return 'Nature';
  if (flat.includes('museum') || flat.includes('heritage') || flat.includes('historic') || flat.includes('monument')) return 'Culture';
  if (flat.includes('park') || flat.includes('garden') || flat.includes('natural')) return 'Nature';
  if (flat.includes('adventure') || flat.includes('sport') || flat.includes('activity')) return 'Adventure';
  if (flat.includes('attraction') || flat.includes('tourism.sights')) return 'Culture';
  if (flat.includes('entertainment') || flat.includes('leisure')) return 'Nature';
  return 'Culture';
}

// ── Feature parser ────────────────────────────────────────────────────────────

function parsePlaceFeature(feature, destinationName) {
  if (!feature || !feature.properties) return null;

  const props = feature.properties;
  const name    = cleanText(props.name || props.address_line1 || '');
  const address = cleanText(props.formatted || props.address_line1 || props.city || '');
  const cats    = Array.isArray(props.categories) ? props.categories : [];
  const category = normalizeCategory(cats);

  const lat = Number(feature.geometry?.coordinates?.[1]);
  const lon = Number(feature.geometry?.coordinates?.[0]);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  if (!name) return null;
  if (isForbiddenResult(name, address, cats.join(' '), destinationName)) return null;

  const wikiText = props.datasource?.raw?.wikipedia_extracts?.text || '';
  const description = cleanText(
    wikiText
      ? wikiText.slice(0, 180)
      : `${name} is a notable attraction in ${destinationName || 'this destination'}.`
  );

  return {
    name,
    category,
    address,
    latitude:  lat,
    longitude: lon,
    description: description.length > 180 ? `${description.slice(0, 177).trim()}...` : description,
    estimatedCost: props.price ?? 'Free / Low cost',
  };
}

// ── HTTP helper ───────────────────────────────────────────────────────────────

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { Accept: 'application/json' } }, (response) => {
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => {
        try {
          const body = Buffer.concat(chunks).toString('utf8');
          if (response.statusCode >= 400) {
            reject(new Error(`Geoapify HTTP ${response.statusCode}: ${body.slice(0, 200)}`));
            return;
          }
          resolve(body ? JSON.parse(body) : {});
        } catch (error) {
          reject(error);
        }
      });
    });
    req.setTimeout(10000, () => { req.destroy(); reject(new Error('Geoapify request timeout')); });
    req.on('error', reject);
  });
}

// ── Main search ───────────────────────────────────────────────────────────────

/**
 * Search Geoapify for real tourist places near a destination.
 *
 * @param {object} destination  - { name, latitude, longitude }
 * @param {object} options      - { preferences, radiusMeters, limit }
 * @returns {Promise<object[]>}  - array of verified POIs
 */
async function searchTouristPlaces(destination, options = {}) {
  const destinationName = cleanText(destination?.name || 'destination');
  let latitude  = Number(destination?.latitude  ?? destination?.lat);
  let longitude = Number(destination?.longitude ?? destination?.lng);
  const apiKey    = getApiKey();

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    console.log(`[places] Missing coordinates for "${destinationName}", resolving via location provider…`);
    try {
      const results = await searchExternalLocations(destinationName, '');
      if (results && results.length > 0 && Number.isFinite(Number(results[0].latitude)) && Number.isFinite(Number(results[0].longitude))) {
        latitude  = Number(results[0].latitude);
        longitude = Number(results[0].longitude);
        if (destination && typeof destination === 'object') {
          destination.latitude  = latitude;
          destination.longitude = longitude;
        }
        console.log(`[places] Resolved coordinates for "${destinationName}": ${latitude}, ${longitude}`);
      }
    } catch (e) {
      console.warn(`[places] Geocoding fallback failed for "${destinationName}":`, e.message);
    }
  }

  console.log(`[places] destination: ${destinationName}`);
  console.log(`[places] coordinates: ${Number.isFinite(latitude) ? latitude : 'unknown'}, ${Number.isFinite(longitude) ? longitude : 'unknown'}`);

  if (!apiKey) {
    console.warn('[places] Missing GEOAPIFY_API_KEY — skipping Geoapify attraction search.');
    return [];
  }

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    console.warn('[places] No coordinates could be resolved for Geoapify search.');
    return [];
  }

  const radiusMeters = Math.min(50000, Math.max(10000, Number(options.radiusMeters || 30000)));
  const perCategoryLimit = 20;
  const totalLimit = Math.max(10, Math.min(30, Number(options.limit || 20)));

  const allPlaces = [];
  const seenNames = new Set();

  for (const category of GEOAPIFY_CATEGORIES) {
    const url = new URL('https://api.geoapify.com/v2/places');
    url.searchParams.set('categories', category);
    url.searchParams.set('filter', `circle:${longitude},${latitude},${radiusMeters}`);
    url.searchParams.set('bias', `proximity:${longitude},${latitude}`);
    url.searchParams.set('limit', String(perCategoryLimit));
    url.searchParams.set('apiKey', apiKey);
    url.searchParams.set('lang', 'en');

    console.log(`[places] Geoapify request: category=${category}`);
    try {
      const data = await fetchJson(url.toString());
      const features = Array.isArray(data.features) ? data.features : [];

      let accepted = 0;
      for (const feature of features) {
        const place = parsePlaceFeature(feature, destinationName);
        if (!place) continue;
        const key = place.name.toLowerCase();
        if (seenNames.has(key)) continue;
        seenNames.add(key);
        allPlaces.push(place);
        accepted++;
      }
      console.log(`[places] Geoapify returned: ${accepted} valid places for category ${category}`);
      allPlaces.slice(-Math.min(accepted, 5)).forEach((p, i) => {
        if (i < 5) console.log(`[places] POI: ${p.name} | ${p.category}`);
      });
    } catch (error) {
      console.error(`[places] Geoapify category ${category} failed:`, error.message);
    }

    if (allPlaces.length >= totalLimit) break;
  }

  // Sort: prefer places with actual good names (attraction keywords first)
  allPlaces.sort((a, b) => {
    const aGood = GOOD_ATTRACTION_KEYWORDS.some((k) => a.name.toLowerCase().includes(k));
    const bGood = GOOD_ATTRACTION_KEYWORDS.some((k) => b.name.toLowerCase().includes(k));
    if (aGood && !bGood) return -1;
    if (!aGood && bGood) return 1;
    return 0;
  });

  const result = allPlaces.slice(0, totalLimit);
  console.log(`[places] Sending ${result.length} real POIs to itinerary generator`);
  return result;
}

module.exports = { searchTouristPlaces, isForbiddenResult };
