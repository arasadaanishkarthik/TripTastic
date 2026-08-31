// backend/src/routes/destinationRoutes.js
// Destination API routes

const express = require('express');
const router = express.Router();
const {
  getAllDestinations,
  searchDestinations,
  getDestinationById,
  geocodeLocation,
} = require('../controllers/destinationController');

// IMPORTANT: /search must come BEFORE /:id so Express doesn't treat "search" as an id param
router.get('/search', searchDestinations);
router.get('/geocode', geocodeLocation);
router.get('/:id', getDestinationById);
router.get('/', getAllDestinations);

module.exports = router;
