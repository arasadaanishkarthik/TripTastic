// backend/src/routes/tripRoutes.js
const express = require('express');
const router = express.Router();
const {
  createTrip,
  listTrips,
  getTripById,
  updateTrip,
} = require('../controllers/tripController');

router.post('/', createTrip);
router.get('/', listTrips);
router.get('/:id', getTripById);
router.put('/:id', updateTrip);

module.exports = router;
