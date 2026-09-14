// backend/src/services/placesService.js
// ─────────────────────────────────────────────────────────────────────────────
// Gemini + OpenStreetMap Tourist Attraction Discovery Service
//
// Replaces Geoapify with a Gemini-first + OpenStreetMap verified architecture:
//
// 1. Level 1: Gemini AI Candidate Discovery (finds real, prominent attractions)
// 2. Level 2: Free OpenStreetMap / Nominatim Verification (geocodes & validates)
// 3. Level 3: Curated Verified Knowledge Base (guarantees small-city coverage)
// 4. Level 4: Anti-Hallucination & Deduplication Engine
// ─────────────────────────────────────────────────────────────────────────────

const { discoverCandidateAttractions } = require('./geminiPlaceDiscovery');
const { verifyCandidateAttractions } = require('./osmPlaceVerifier');
const { getCuratedAttractions } = require('./curatedAttractions');
const { searchExternalLocations } = require('./locationProvider');

function cleanText(value) {
  if (!value && value !== 0) return '';
  return String(value).replace(/\s+/g, ' ').trim();
}

/**
 * Calculates distance between two coordinates in kilometers (Haversine formula).
 */
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!Number.isFinite(lat1) || !Number.isFinite(lon1) || !Number.isFinite(lat2) || !Number.isFinite(lon2)) {
    return null;
  }
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Normalizes place names for fuzzy deduplication.
 */
function normalizeNameKey(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/\b(temple|mandir|fort|palace|museum|beach|park|falls|waterfall|lake|gardens?|sanctuary|viewpoint|resort|hills?)\b/g, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

/**
 * Main attraction discovery function used across TripTastic:
 *
 * 1. Resolves destination center coordinates
 * 2. Fetches curated verified attractions (authoritative base)
 * 3. Calls Gemini for AI candidate tourist place discovery
 * 4. Verifies Gemini candidates with OpenStreetMap / Nominatim
 * 5. Merges, deduplicates, and ranks the final verified pool
 *
 * @param {object} destination - { name, region, state, country, latitude, longitude }
 * @param {object} [options]   - { preferences, durationDays, limit }
 * @returns {Promise<Array>}   - Array of verified real tourist attractions
 */
async function searchTouristPlaces(destination, options = {}) {
  const destinationName = cleanText(destination?.name || 'Destination');
  let latitude  = Number(destination?.latitude  ?? destination?.lat);
  let longitude = Number(destination?.longitude ?? destination?.lng);

  // 1. Geocode destination if coordinates are missing
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    console.log(`[placesService] Geocoding destination center for "${destinationName}"...`);
    try {
      const results = await searchExternalLocations(destinationName, '');
      if (results && results.length > 0 && Number.isFinite(Number(results[0].latitude))) {
        latitude  = Number(results[0].latitude);
        longitude = Number(results[0].longitude);
        if (destination && typeof destination === 'object') {
          destination.latitude  = latitude;
          destination.longitude = longitude;
        }
      }
    } catch (e) {
      console.warn(`[placesService] Geocoding lookup failed for "${destinationName}":`, e.message);
    }
  }

  const destObj = {
    ...destination,
    name: destinationName,
    latitude,
    longitude,
  };

  const pool = [];
  const seenExact = new Set();
  const seenNorm = new Set();

  function addVerifiedAttraction(attr, sourceTag = 'verified') {
    if (!attr || !attr.name) return;
    const name = cleanText(attr.name);
    const exactKey = name.toLowerCase();
    const normKey = normalizeNameKey(name);

    if (seenExact.has(exactKey)) return;
    if (normKey && normKey.length >= 4 && seenNorm.has(normKey)) return;

    // Hard safety distance check: if destination center is known and place coordinates are known,
    // reject if distance > 75km (e.g. preventing Vizag places from entering a Patna pool)
    if (Number.isFinite(latitude) && Number.isFinite(longitude) && Number.isFinite(attr.latitude) && Number.isFinite(attr.longitude)) {
      const dist = calculateDistanceKm(latitude, longitude, attr.latitude, attr.longitude);
      if (dist !== null && dist > 75) {
        console.warn(`[placesService] REJECTED attraction "${name}" (${dist.toFixed(1)}km away from "${destinationName}")`);
        return;
      }
    }

    seenExact.add(exactKey);
    if (normKey && normKey.length >= 4) seenNorm.add(normKey);

    pool.push({
      ...attr,
      name,
      location:    attr.location || `${name}, ${destinationName}`,
      address:     attr.address || attr.location || `${name}, ${destinationName}`,
      latitude:    Number.isFinite(attr.latitude) ? attr.latitude : latitude,
      longitude:   Number.isFinite(attr.longitude) ? attr.longitude : longitude,
      category:    attr.category || 'Culture',
      description: attr.description || attr.reason || `Explore ${name} in ${destinationName}.`,
      verified:    true,
      source:      attr.source || sourceTag,
    });
  }

  // ── STEP 1: Level 3 — Curated Verified Attractions ──────────────────────────
  const curated = getCuratedAttractions(destinationName);
  if (curated && curated.length > 0) {
    console.log(`[placesService] Loaded ${curated.length} verified curated attractions for "${destinationName}"`);
    for (const item of curated) {
      addVerifiedAttraction(item, 'curated-verified');
    }
  }

  // ── STEP 2 & 3: Level 1 & 2 — Gemini Discovery + OpenStreetMap Verification ──
  try {
    const candidates = await discoverCandidateAttractions(destObj, options);
    if (candidates && candidates.length > 0) {
      const osmStart = Date.now();
      console.log(`[NOMINATIM] verification started for ${candidates.length} candidates`);
      const osmVerified = await verifyCandidateAttractions(candidates, destObj);
      console.log(`[NOMINATIM] verification completed: ${Date.now() - osmStart}ms (${osmVerified.length} verified)`);
      for (const item of osmVerified) {
        addVerifiedAttraction(item, 'gemini+openstreetmap');
      }
    }
  } catch (err) {
    console.warn(`[placesService] Gemini + OSM discovery failed for "${destinationName}":`, err.message);
  }

  // ── STEP 4: Level 3 — Geoapify Places API Discovery (Ensures full global coverage) ──
  if (pool.length < (options.limit || 20) && Number.isFinite(latitude) && Number.isFinite(longitude)) {
    try {
      const geoapifyPlaces = await fetchGeoapifyAttractions(latitude, longitude, destinationName);
      if (geoapifyPlaces && geoapifyPlaces.length > 0) {
        console.log(`[placesService] Geoapify discovered ${geoapifyPlaces.length} places for "${destinationName}"`);
        for (const item of geoapifyPlaces) {
          addVerifiedAttraction(item, 'geoapify-verified');
        }
      }
    } catch (err) {
      console.warn(`[placesService] Geoapify discovery error for "${destinationName}":`, err.message);
    }
  }

  // If pool has items, return up to requested limit
  const limit = Math.max(10, Math.min(40, Number(options.limit || 25)));
  const finalPool = pool.slice(0, limit);

  console.log(`[placesService] Total verified attraction pool for "${destinationName}": ${finalPool.length} places (Curated: ${curated.length})`);
  return finalPool;
}

/**
 * Geoapify Places API integration for real tourist places.
 */
async function fetchGeoapifyAttractions(latitude, longitude, destinationName) {
  const apiKey = process.env.GEOAPIFY_API_KEY;
  if (!apiKey) return [];

  const categories = 'tourism.sights,tourism.attraction,heritage,natural,leisure.park';
  const radiusMeters = 35000;
  const url = `https://api.geoapify.com/v2/places?categories=${encodeURIComponent(categories)}&filter=circle:${longitude},${latitude},${radiusMeters}&bias=proximity:${longitude},${latitude}&limit=30&apiKey=${apiKey}`;

  const https = require('https');

  return new Promise((resolve) => {
    const req = https.get(url, { timeout: 4000 }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const results = [];
          for (const feature of parsed.features || []) {
            const props = feature.properties || {};
            const name = cleanText(props.name);
            const lat = Number(props.lat);
            const lon = Number(props.lon);
            const cats = props.categories || [];

            if (!name || !Number.isFinite(lat) || !Number.isFinite(lon)) continue;
            if (!isTouristAttraction(name, props.formatted || '', cats)) continue;

            let category = 'Culture';
            const catStr = cats.join(' ').toLowerCase();
            if (/natural|beach|waterfall|lake|coast/.test(catStr)) category = 'Nature';
            else if (/park|garden|leisure/.test(catStr)) category = 'Relaxation';
            else if (/viewpoint|hiking|adventure/.test(catStr)) category = 'Adventure';

            results.push({
              name,
              category,
              location: props.formatted || `${name}, ${destinationName}`,
              address:  props.formatted || `${name}, ${destinationName}`,
              latitude: lat,
              longitude: lon,
              description: `Visit ${name}, an authentic highlight located in ${destinationName}.`,
              estimatedCost: 50,
              duration: '2 hours',
              verified: true,
              source: 'geoapify-places',
            });
          }
          resolve(results);
        } catch (e) {
          resolve([]);
        }
      });
    });

    req.on('error', () => resolve([]));
    req.on('timeout', () => {
      req.destroy();
      resolve([]);
    });
  });
}

const FORBIDDEN_WORDS = [
  'railway station', 'bus stand', 'bus stop', 'airport', 'metro station',
  'hospital', 'clinic', 'diagnostic', 'school', 'college', 'hostel',
  'bank', 'atm', 'petrol pump', 'gas station', 'fuel station',
  'police station', 'court', 'tahsildar', 'collectorate',
  'supermarket', 'mart', 'bakery', 'sweet shop', 'tailor', 'xerox',
];

const POSITIVE_TOURISM_KEYWORDS = [
  'temple', 'mandir', 'kovil', 'devasthanam', 'shrine', 'sanctuary',
  'church', 'cathedral', 'basilica', 'chapel',
  'mosque', 'masjid', 'dargah', 'tomb', 'mausoleum',
  'monument', 'statue', 'memorial', 'pillar', 'minar', 'stupa',
  'fort', 'fortress', 'castle', 'citadel', 'palace', 'mahal', 'haveli',
  'museum', 'gallery', 'heritage', 'historic', 'ruins', 'archaeological',
  'park', 'garden', 'botanical', 'national park', 'reserve', 'safari', 'zoo', 'aquarium',
  'beach', 'cove', 'bay', 'promenade', 'coast', 'pier', 'lighthouse',
  'waterfall', 'falls', 'cascade', 'lake', 'dam', 'reservoir', 'ghat', 'riverfront', 'backwater',
  'viewpoint', 'peak', 'hill', 'ridge', 'valley', 'cave', 'caves', 'cliff',
  'clock tower', 'gantasthambam',
];

function isTouristAttraction(name, address = '', categories = []) {
  const normName = cleanText(name).toLowerCase();
  const normAddress = cleanText(address).toLowerCase();
  const combined = `${normName} ${normAddress} ${(categories || []).join(' ')}`.toLowerCase();

  if (!normName || normName.length < 3) return false;

  for (const forbidden of FORBIDDEN_WORDS) {
    if (combined.includes(forbidden)) {
      const hasPositive = POSITIVE_TOURISM_KEYWORDS.some((kw) => normName.includes(kw));
      if (!hasPositive) return false;
    }
  }

  return true;
}

module.exports = {
  searchTouristPlaces,
  calculateDistanceKm,
  isTouristAttraction,
};
