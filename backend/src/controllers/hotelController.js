// backend/src/controllers/hotelController.js
// Hotel search endpoints — PLACEHOLDER (provider not yet active).
// All endpoints clearly communicate "not available" — no fake data is returned.

const hotels = require('../services/hotelService');

/**
 * GET /api/hotels/status
 * Reports that hotel search is not yet configured.
 */
const getStatus = (req, res) => {
  res.json({
    success:    true,
    configured: hotels.isConfigured(),
    message:    'Hotel search is not yet available. Check back in a future release.',
  });
};

/**
 * GET /api/hotels/search
 * Returns a clear "not available" response — no fake data.
 */
const searchHotels = async (req, res) => {
  const result = await hotels.searchHotels({});
  res.status(503).json({ success: false, ...result });
};

/**
 * GET /api/hotels/destinations
 * Returns a clear "not available" response — no fake data.
 */
const searchDestinations = async (req, res) => {
  const result = await hotels.searchDestinations('');
  res.status(503).json({ success: false, ...result });
};

module.exports = { getStatus, searchHotels, searchDestinations };
