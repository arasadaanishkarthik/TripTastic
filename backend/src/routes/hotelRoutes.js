// backend/src/routes/hotelRoutes.js
const express = require('express');
const router  = express.Router();
const { searchHotels, searchDestinations, getStatus } = require('../controllers/hotelController');

// GET /api/hotels/status                                              → integration status
router.get('/status', getStatus);

// GET /api/hotels/destinations?q=Goa                                 → dest ID autocomplete
router.get('/destinations', searchDestinations);

// GET /api/hotels/search?city=Goa&checkIn=...&checkOut=...&adults=2  → hotel list
router.get('/search', searchHotels);

module.exports = router;
