// backend/src/controllers/currencyController.js
// Handles currency rate lookups and conversion requests.

const currency = require('../services/currencyService');

/**
 * GET /api/currency/rates?base=INR
 * Returns all exchange rates relative to the given base currency.
 * Defaults to the CURRENCY_BASE env var (INR).
 */
const getRates = async (req, res, next) => {
  try {
    const base = (req.query.base || '').toUpperCase() || undefined;
    const data = await currency.getRates(base);
    res.json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/currency/convert?from=INR&to=USD&amount=5000
 * Converts an amount from one currency to another.
 */
const convert = async (req, res, next) => {
  try {
    const { from, to, amount } = req.query;

    if (!from || !to || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Query params "from", "to", and "amount" are required',
      });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount < 0) {
      return res.status(400).json({ success: false, message: '"amount" must be a non-negative number' });
    }

    const result = await currency.convert({
      from:   from.toUpperCase(),
      to:     to.toUpperCase(),
      amount: parsedAmount,
    });

    res.json({ success: true, ...result });
  } catch (err) {
    if (err.message?.startsWith('Unsupported currency')) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next(err);
  }
};

/**
 * GET /api/currency/supported
 * Returns a list of all supported ISO 4217 currency codes.
 */
const getSupportedCurrencies = async (req, res, next) => {
  try {
    const currencies = await currency.getSupportedCurrencies();
    res.json({ success: true, currencies });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/currency/status
 * Returns whether the currency integration is configured.
 */
const getStatus = (req, res) => {
  res.json({ success: true, configured: currency.isConfigured() });
};

module.exports = { getRates, convert, getSupportedCurrencies, getStatus };
