// backend/src/controllers/destinationController.js
// Destination request handlers — pure in-memory data, no database dependency.

const { DESTINATIONS }               = require('../data/destinations');
const { searchDestinations: searchService } = require('../services/destinationSearchService');
const { searchExternalLocations }    = require('../services/locationProvider');

/**
 * GET /api/destinations
 * Returns destinations filtered by travel_type and optional category.
 * Default: popular ones first, then alphabetical, limited to 60.
 */
const getAllDestinations = async (req, res, next) => {
  try {
    const { mode, category, limit = 60, offset = 0 } = req.query;

    let results = [...DESTINATIONS];

    if (mode) {
      results = results.filter(d => d.travel_type === mode);
    }
    if (category && category !== 'all') {
      results = results.filter(d => d.category === category);
    }

    // popular first, then alphabetical
    results.sort((a, b) => (b.popular - a.popular) || a.name.localeCompare(b.name));

    const sliced = results.slice(parseInt(offset, 10), parseInt(offset, 10) + parseInt(limit, 10));
    const destinations = sliced.map(r => ({ ...r, source: 'local' }));

    res.json({ success: true, count: destinations.length, destinations });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/destinations/search?q=araku&mode=national
 * Waterfall: local array search first, then external (Nominatim) if sparse.
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
    const dest = DESTINATIONS.find(d => d.id === id);

    if (!dest) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }

    res.json({ success: true, destination: { ...dest, source: 'local' } });
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
