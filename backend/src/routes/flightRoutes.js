// backend/src/routes/flightRoutes.js
const express = require('express');
const router  = express.Router();
const { searchFlights, searchAirports, getStatus } = require('../controllers/flightController');

// GET /api/flights/status                                       → integration status
router.get('/status', getStatus);

// GET /api/flights/airports?q=Delhi                            → IATA autocomplete
router.get('/airports', searchAirports);

// GET /api/flights/search?origin=DEL&destination=BOM&date=...  → flight offers
router.get('/search', searchFlights);

module.exports = router;
