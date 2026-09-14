// backend/src/services/destinationSearchService.js
// Destination Search Orchestrator — pure in-memory search, no database.
//
// Flow:
//   1. Filter DESTINATIONS array with JS string matching
//   2. If local results < THRESHOLD, call external Nominatim provider
//   3. Deduplicate + merge
//   4. Return merged array with source field on every item

const { DESTINATIONS }                = require('../data/destinations');
const { searchExternalLocations }     = require('./locationProvider');

const DEFAULT_THRESHOLD = 1;

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Normalise a DESTINATIONS entry to the TripTastic place shape. */
function normaliseRow(row) {
  return {
    id:          row.id,
    name:        row.name,
    city:        row.city        || row.name,
    state:       row.state       || '',
    country:     row.country     || 'India',
    region:      row.region      || row.state || '',
    category:    row.category    || 'nature',
    description: row.description || '',
    latitude:    row.latitude    != null ? parseFloat(row.latitude)  : null,
    longitude:   row.longitude   != null ? parseFloat(row.longitude) : null,
    travel_type: row.travel_type || 'national',
    popular:     Boolean(row.popular),
    source:      'local',
  };
}

function deduplicateExternal(localResults, externalResults) {
  const localNames = new Set(localResults.map(d => d.name.trim().toLowerCase()));
  return externalResults.filter(ext => !localNames.has(ext.name.trim().toLowerCase()));
}

// ── Local search ──────────────────────────────────────────────────────────────

function localSearch(q, mode, limit = 50) {
  const term = q.trim().toLowerCase();
  let results = DESTINATIONS.filter(d => {
    const match =
      (d.name        || '').toLowerCase().includes(term) ||
      (d.city        || '').toLowerCase().includes(term) ||
      (d.state       || '').toLowerCase().includes(term) ||
      (d.country     || '').toLowerCase().includes(term) ||
      (d.region      || '').toLowerCase().includes(term) ||
      (d.description || '').toLowerCase().includes(term);
    if (!match) return false;
    if (mode) return d.travel_type === mode;
    return true;
  });
  results.sort((a, b) => (b.popular - a.popular) || a.name.localeCompare(b.name));
  return results.slice(0, limit).map(normaliseRow);
}

// ── Fallback (empty query) ────────────────────────────────────────────────────

function localPopular(mode, category) {
  let results = [...DESTINATIONS];
  if (mode) results = results.filter(d => d.travel_type === mode);
  if (category && category !== 'all') results = results.filter(d => d.category === category);
  results.sort((a, b) => (b.popular - a.popular) || a.name.localeCompare(b.name));
  return results.slice(0, 30).map(normaliseRow);
}

// ── Main export ───────────────────────────────────────────────────────────────

async function searchDestinations({ q, mode, category }) {
  const threshold = parseInt(process.env.LOCATION_API_THRESHOLD || String(DEFAULT_THRESHOLD), 10);

  // No query: return popular results
  if (!q || q.trim() === '') {
    const destinations = localPopular(mode, category);
    return { destinations, usedExternal: false };
  }

  // Step 1: local search
  let localResults = localSearch(q, mode);
  console.log(`[destinationSearchService] Local returned ${localResults.length} results for "${q}"`);

  // Step 2: External provider when local results are sparse
  let usedExternal = false;
  let externalResults = [];

  if (localResults.length < threshold) {
    console.log(`[destinationSearchService] Local (${localResults.length}) < threshold (${threshold}), querying external...`);
    externalResults = await searchExternalLocations(q, mode);
    usedExternal    = externalResults.length > 0;
    console.log(`[destinationSearchService] External returned ${externalResults.length} results`);
  }

  // Step 3: Deduplicate
  const uniqueExternal = deduplicateExternal(localResults, externalResults);

  // Step 4: Merge — local first
  const destinations = [...localResults, ...uniqueExternal];

  return { destinations, usedExternal };
}

module.exports = { searchDestinations };
