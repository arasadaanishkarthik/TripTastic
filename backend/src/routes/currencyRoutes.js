// backend/src/routes/currencyRoutes.js
const express = require('express');
const router  = express.Router();
const { getRates, convert, getSupportedCurrencies, getStatus } = require('../controllers/currencyController');

// GET /api/currency/status          → integration status
router.get('/status', getStatus);

// GET /api/currency/supported       → list of all supported currency codes
router.get('/supported', getSupportedCurrencies);

// GET /api/currency/rates?base=INR  → all exchange rates for base currency
router.get('/rates', getRates);

// GET /api/currency/convert?from=INR&to=USD&amount=5000
router.get('/convert', convert);

module.exports = router;
