// backend/src/controllers/flightController.js
// Flight search endpoints — PLACEHOLDER (provider not yet active).
// All endpoints clearly communicate "not available" — no fake data is returned.

const flights = require('../services/flightService');

/**
 * GET /api/flights/status
 * Reports that flight search is not yet configured.
 */
const getStatus = (req, res) => {
  res.json({
    success:    true,
    configured: flights.isConfigured(),
    message:    'Flight search is not yet available. Check back in a future release.',
  });
};

/**
 * GET /api/flights/search
 * Returns a clear "not available" response — no fake data.
 */
const searchFlights = async (req, res) => {
  const result = await flights.searchFlights({});
  res.status(503).json({ success: false, ...result });
};

/**
 * GET /api/flights/airports
 * Returns a clear "not available" response — no fake data.
 */
const searchAirports = async (req, res) => {
  const result = await flights.searchAirports('');
  res.status(503).json({ success: false, ...result });
};

module.exports = { getStatus, searchFlights, searchAirports };
