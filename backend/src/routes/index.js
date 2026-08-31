// backend/src/routes/index.js
// Central API router — mounts all sub-routers

const express = require('express');
const router  = express.Router();

// ── Health Check ──────────────────────────────────────────────────────────────
router.get('/health', (req, res) => {
  const ai       = require('../services/aiClient');
  const currency = require('../services/currencyService');
  const images   = require('../services/imageService');
  const flights  = require('../services/flightService');
  const hotels   = require('../services/hotelService');

  res.json({
    success:   true,
    message:   'TripTastic API is running',
    timestamp: new Date().toISOString(),
    version:   '1.2.0',
    integrations: {
      // Always-active (free, no key)
      weather:  true,                        // Open-Meteo — always available
      currency: true,                        // ExchangeRate-API open-access — always available
      location: true,                        // Nominatim — always available
      // Active when configured
      ai:       { active: ai.isConfigured(), provider: ai.getActiveProvider(), model: ai.getModelName() },
      groq:     require('../services/groqClient').isConfigured(),
      images:   { active: true, provider: images.isConfigured() ? 'pexels' : 'loremflickr' },
      // Placeholders — not yet active
      flights:  { active: flights.isConfigured(), reason: 'PROVIDER_NOT_CONFIGURED' },
      hotels:   { active: hotels.isConfigured(),  reason: 'PROVIDER_NOT_CONFIGURED' },
    },
  });
});

// ── Always-active free integrations ──────────────────────────────────────────
router.use('/destinations', require('./destinationRoutes'));
router.use('/trips',        require('./tripRoutes'));
router.use('/itinerary',    require('./itineraryRoutes'));
router.use('/weather',      require('./weatherRoutes'));
router.use('/currency',     require('./currencyRoutes'));
router.use('/images',       require('./imageRoutes'));

// ── Future integrations (routes exist, services return 503 until configured) ──
router.use('/flights',      require('./flightRoutes'));
router.use('/hotels',       require('./hotelRoutes'));

module.exports = router;