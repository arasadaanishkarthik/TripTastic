// backend/src/services/destinationSearchService.js
// ─────────────────────────────────────────────────────────────────────────────
// Destination Search Orchestrator
//
// Flow:
//   1. Query MySQL for local results (LIKE + FULLTEXT)
//   2. If local results < THRESHOLD → call external location provider
//   3. Normalise external results to TripTastic format
//   4. Deduplicate (external results whose name matches a local result are dropped)
//   5. Return merged, sorted array with `source` field on every item
// ─────────────────────────────────────────────────────────────────────────────

const pool                   = require('../config/db');
const { searchExternalLocations } = require('./locationProvider');

// Min local results before external provider is queried.
// Configurable via backend/.env → LOCATION_API_THRESHOLD
const DEFAULT_THRESHOLD = 1;

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Normalise a MySQL destination row to the TripTastic place shape. */
function normaliseLocalRow(row) {
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

/**
 * Deduplicate external results against local results.
 * An external result is dropped if a local result has the same name
 * (case-insensitive, trimmed).
 * @param {object[]} localResults
 * @param {object[]} externalResults
 * @returns {object[]} filtered external results
 */
function deduplicateExternal(localResults, externalResults) {
  const localNames = new Set(
    localResults.map((d) => d.name.trim().toLowerCase())
  );
  return externalResults.filter(
    (ext) => !localNames.has(ext.name.trim().toLowerCase())
  );
}

// ── Local MySQL search ────────────────────────────────────────────────────────

/**
 * Query MySQL for destinations matching the query string.
 * @param {string} q
 * @param {string} mode
 * @param {number} limit
 * @returns {Promise<object[]>}  normalised rows
 */
async function mysqlSearch(q, mode, limit = 50) {
  const term = `%${q.trim()}%`;
  const params = [term, term, term, term, term, term];

  let query = `
    SELECT * FROM destinations
    WHERE (
      name        LIKE ? OR
      city        LIKE ? OR
      state       LIKE ? OR
      country     LIKE ? OR
      region      LIKE ? OR
      description LIKE ?
    )
  `;

  if (mode) {
    query += ' AND travel_type = ?';
    params.push(mode);
  }

  query += ' ORDER BY popular DESC, name ASC LIMIT ?';
  params.push(limit);

  const [rows] = await pool.query(query, params);
  return rows.map(normaliseLocalRow);
}

// ── Fallback (empty query) ────────────────────────────────────────────────────

/**
 * Return popular destinations when no search query is provided.
 * @param {string} mode
 * @param {string} category
 * @returns {Promise<object[]>}
 */
async function mysqlPopular(mode, category) {
  let query  = 'SELECT * FROM destinations WHERE 1=1';
  const params = [];

  if (mode) {
    query += ' AND travel_type = ?';
    params.push(mode);
  }
  if (category && category !== 'all') {
    query += ' AND category = ?';
    params.push(category);
  }
  query += ' ORDER BY popular DESC, name ASC LIMIT 30';

  const [rows] = await pool.query(query, params);
  return rows.map(normaliseLocalRow);
}

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * Universal destination search.
 *
 * @param {object} opts
 * @param {string} opts.q        - search query (may be empty)
 * @param {string} [opts.mode]   - 'national' | 'international'
 * @param {string} [opts.category]
 * @returns {Promise<{ destinations: object[], usedExternal: boolean }>}
 */
async function searchDestinations({ q, mode, category }) {
  const threshold = parseInt(process.env.LOCATION_API_THRESHOLD || String(DEFAULT_THRESHOLD), 10);

  // ── No query: return popular results ─────────────────────────────────────
  if (!q || q.trim() === '') {
    const destinations = await mysqlPopular(mode, category);
    return { destinations, usedExternal: false };
  }

  // ── Step 1: MySQL search ──────────────────────────────────────────────────
  let localResults = await mysqlSearch(q, mode);

  console.log(`[destinationSearchService] MySQL returned ${localResults.length} results for "${q}"`);

  // ── Step 2: External provider (when local results are sparse) ─────────────
  let usedExternal = false;
  let externalResults = [];

  if (localResults.length < threshold) {
    console.log(
      `[destinationSearchService] Local results (${localResults.length}) < threshold (${threshold}), querying external provider…`
    );
    externalResults = await searchExternalLocations(q, mode);
    usedExternal    = externalResults.length > 0;
    console.log(`[destinationSearchService] External provider returned ${externalResults.length} results`);
  }

  // ── Step 3: Deduplicate ───────────────────────────────────────────────────
  const uniqueExternal = deduplicateExternal(localResults, externalResults);

  // ── Step 4: Merge — local first, external after ───────────────────────────
  const destinations = [...localResults, ...uniqueExternal];

  return { destinations, usedExternal };
}

module.exports = { searchDestinations };
