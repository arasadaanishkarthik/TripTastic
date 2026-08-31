// backend/src/routes/itineraryRoutes.js
const express    = require('express');
const router     = express.Router();
const { generate, chat } = require('../controllers/itineraryController');

// POST /api/itinerary/generate
router.post('/generate', generate);

// POST /api/itinerary/chat
router.post('/chat', chat);

module.exports = router;
