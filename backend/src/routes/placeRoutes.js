// backend/src/routes/placeRoutes.js
// ─────────────────────────────────────────────────────────────────────────────
// Place Discovery & Verification API Router
//
// Endpoint:
//   GET  /api/places/search?destination=Vizianagaram
//   POST /api/places/search { destination: "Vizianagaram" }
// ─────────────────────────────────────────────────────────────────────────────

const express = require('express');
const router  = express.Router();
const { searchTouristPlaces } = require('../services/placesService');

async function handlePlaceSearch(req, res) {
  const destInput = req.method === 'POST'
    ? (req.body?.destination || req.body?.q || req.body?.name)
    : (req.query?.destination || req.query?.q || req.query?.name);

  if (!destInput) {
    return res.status(400).json({
      success: false,
      error: 'Destination parameter is required (e.g. ?destination=Vizianagaram or { destination: "Vizianagaram" })',
    });
  }

  const destinationObj = typeof destInput === 'object'
    ? destInput
    : { name: String(destInput).trim() };

  try {
    const places = await searchTouristPlaces(destinationObj, {
      preferences: req.body?.preferences || (req.query?.preferences ? String(req.query.preferences).split(',') : []),
      limit: req.body?.limit || req.query?.limit || 25,
    });

    return res.json({
      success: true,
      destination: destinationObj.name,
      count: places.length,
      places: places.map((p) => ({
        name:        p.name,
        category:    p.category || 'Culture',
        location:    p.location || `${p.name}, ${destinationObj.name}`,
        address:     p.address  || p.location || destinationObj.name,
        latitude:    p.latitude,
        longitude:   p.longitude,
        description: p.description,
        verified:    true,
        source:      p.source || 'gemini+openstreetmap',
      })),
    });
  } catch (err) {
    console.error('[placeRoutes] Search error:', err.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to discover and verify tourist attractions',
      message: err.message,
    });
  }
}

router.get('/search', handlePlaceSearch);
router.post('/search', handlePlaceSearch);

module.exports = router;
