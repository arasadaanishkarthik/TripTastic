// backend/src/routes/index.js
// Central API router — mounts all sub-routers

const express = require('express');
const router  = express.Router();

// Health Check — must work without any external service
router.get('/health', (req, res) => {
  res.json({
    status:  'ok',
    service: 'TripTastic API',
  });
});

// Always-active free integrations
router.use('/destinations', require('./destinationRoutes'));
router.use('/places',       require('./placeRoutes'));
router.use('/trips',        require('./tripRoutes'));
router.use('/itinerary',    require('./itineraryRoutes'));
router.use('/weather',      require('./weatherRoutes'));
router.use('/currency',     require('./currencyRoutes'));
router.use('/images',       require('./imageRoutes'));

// Future integrations (routes exist, services return 503 until configured)
router.use('/flights',      require('./flightRoutes'));
router.use('/hotels',       require('./hotelRoutes'));

module.exports = router;
