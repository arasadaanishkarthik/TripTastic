// backend/src/controllers/destinationController.js
// All destination-related request handlers — parameterized queries, no raw SQL in routes.

const pool                   = require('../config/db');
const { searchDestinations: searchService } = require('../services/destinationSearchService');
const { searchExternalLocations } = require('../services/locationProvider');

/**
 * GET /api/destinations
 * Returns destinations filtered by travel_type and optional category.
 * Default: popular ones first, then alphabetical, limited to 60.
 */
const getAllDestinations = async (req, res, next) => {
  try {
    const { mode, category, limit = 60, offset = 0 } = req.query;

    let query = 'SELECT * FROM destinations WHERE 1=1';
    const params = [];

    if (mode) {
      query += ' AND travel_type = ?';
      params.push(mode);
    }
    // category column (mountains, beaches, culture, city, nature, adventure)
    if (category && category !== 'all') {
      query += ' AND category = ?';
      params.push(category);
    }

    // Popular first, then alphabetical
    query += ' ORDER BY popular DESC, name ASC LIMIT ? OFFSET ?';
    params.push(parseInt(limit, 10), parseInt(offset, 10));

    const [rows] = await pool.query(query, params);

    // Tag every row with source='local'
    const destinations = rows.map((r) => ({ ...r, source: 'local' }));

    res.json({
      success: true,
      count:   destinations.length,
      destinations,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/destinations/search?q=araku&mode=national
 *
 * Waterfall search:
 *   1. MySQL LIKE search (local)
 *   2. If local results < threshold, query external location provider (Nominatim by default)
 *   3. Deduplicate + merge
 *   4. Return normalised TripTastic destination format
 *
 * Each result includes a `source` field: 'local' | 'external'
 */
const searchDestinations = async (req, res, next) => {
  try {
    const { q, mode, category } = req.query;

    const { destinations, usedExternal } = await searchService({
      q:        q?.trim() || '',
      mode:     mode     || '',
      category: category || 'all',
    });

    res.json({
      success:     true,
      count:       destinations.length,
      query:       q?.trim() || '',
      usedExternal,
      destinations,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/destinations/:id
 * Returns a single destination by its string id slug.
 */
const getDestinationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM destinations WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }

    res.json({ success: true, destination: { ...rows[0], source: 'local' } });
  } catch (err) {
    next(err);
  }
};

const geocodeLocation = async (req, res, next) => {
  try {
    const query = req.query.q?.trim();
    if (!query) return res.status(400).json({ success: false, message: 'Query param "q" is required' });
    const locations = await searchExternalLocations(query, '');
    res.json({ success: true, location: locations[0] || null });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllDestinations, searchDestinations, getDestinationById, geocodeLocation };
