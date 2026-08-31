// backend/src/controllers/weatherController.js
// Handles Open-Meteo weather requests.

const weather = require('../services/weatherService');

/**
 * GET /api/weather?lat=10.85&lon=76.27&days=7
 * Returns current conditions + daily forecast for the given coordinates.
 */
const getWeatherByCoords = async (req, res, next) => {
  try {
    const { lat, lon, days = 7 } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        message: 'Query params "lat" and "lon" are required',
      });
    }

    const parsedLat = parseFloat(lat);
    const parsedLon = parseFloat(lon);

    if (isNaN(parsedLat) || isNaN(parsedLon)) {
      return res.status(400).json({ success: false, message: '"lat" and "lon" must be valid numbers' });
    }

    const data = await weather.getWeather(parsedLat, parsedLon, Number(days));
    res.json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/weather/place?q=Kerala&days=7
 * Geocodes the place name via Nominatim then fetches weather.
 */
const getWeatherByPlace = async (req, res, next) => {
  try {
    const { q, days = 7 } = req.query;

    if (!q || !q.trim()) {
      return res.status(400).json({ success: false, message: 'Query param "q" is required' });
    }

    const result = await weather.getWeatherByName(q.trim(), Number(days));

    if (!result) {
      return res.status(404).json({
        success: false,
        message: `Could not find location for "${q}"`,
      });
    }

    res.json({ success: true, ...result.weather, lat: result.lat, lon: result.lon, resolvedName: result.resolvedName });
  } catch (err) {
    next(err);
  }
};

module.exports = { getWeatherByCoords, getWeatherByPlace };
