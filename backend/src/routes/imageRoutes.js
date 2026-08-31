// backend/src/routes/imageRoutes.js
const express = require('express');
const router  = express.Router();
const { getDestinationImage, getStatus } = require('../controllers/imageController');

// GET /api/images/status               → provider status (pexels vs loremflickr)
router.get('/status', getStatus);

// GET /api/images/destination?q=Kerala → destination image URL + attribution
router.get('/destination', getDestinationImage);

module.exports = router;
