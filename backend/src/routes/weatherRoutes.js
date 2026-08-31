// backend/src/routes/weatherRoutes.js
const express = require('express');
const router  = express.Router();
const { getWeatherByCoords, getWeatherByPlace } = require('../controllers/weatherController');

// GET /api/weather?lat=10.85&lon=76.27&days=7   → weather by coordinates
router.get('/', getWeatherByCoords);

// GET /api/weather/place?q=Kerala&days=7         → weather by place name (geocodes internally)
router.get('/place', getWeatherByPlace);

module.exports = router;
