// backend/src/services/currencyService.js
// ─────────────────────────────────────────────────────────────────────────────
// Currency Conversion Service — ExchangeRate-API (open-access)
//
// ALWAYS FREE — uses the open-access endpoint that requires NO API key:
//   https://open.er-api.com/v6/latest/{base}  (1500 req/day, no sign-up)
//
// Optional upgrade: set CURRENCY_API_KEY in .env to unlock the premium
//   endpoint at https://v6.exchangerate-api.com/v6/{key}/latest/{base}
//   (free tier: 1500 req/month, higher limits on paid plans)
//
// Rate caching:
//   Rates are cached in memory for CACHE_TTL_MS (1 hour) to stay well within
//   the free-tier request cap.
// ─────────────────────────────────────────────────────────────────────────────

const https = require('https');

const API_KEY      = process.env.CURRENCY_API_KEY || '';
const BASE_DEFAULT = process.env.CURRENCY_BASE    || 'INR';

// Cache TTL: 1 hour for live data, 10 minutes for open-access (higher churn)
const CACHE_TTL_MS = API_KEY ? 60 * 60 * 1000 : 10 * 60 * 1000;

// ── In-memory rate cache ──────────────────────────────────────────────────────

const _cache = {};  // { [base]: { data: object, expiresAt: number } }

// ── HTTPS helper ──────────────────────────────────────────────────────────────

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { Accept: 'application/json' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try { resolve(JSON.parse(data)); }
          catch (e) { reject(new Error(`JSON parse error: ${e.message}`)); }
        } else {
          reject(new Error(`ExchangeRate-API HTTP ${res.statusCode}`));
        }
      });
    });
    req.setTimeout(8000, () => { req.destroy(); reject(new Error('Currency API timeout')); });
    req.on('error', reject);
  });
}

// ── Core fetch (with cache) ───────────────────────────────────────────────────

/**
 * Fetch exchange rates for a given base currency.
 * Uses the open-access endpoint when no API key is configured.
 *
 * @param {string} base - ISO 4217 currency code (e.g. 'INR')
 * @returns {Promise<{ base: string, rates: object, updatedAt: string, source: string }>}
 */
async function fetchRates(base = BASE_DEFAULT) {
  const now = Date.now();

  if (_cache[base] && now < _cache[base].expiresAt) {
    return _cache[base].data;
  }

  // Choose endpoint: premium (with key) vs open-access (no key)
  const url = API_KEY
    ? `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${encodeURIComponent(base)}`
    : `https://open.er-api.com/v6/latest/${encodeURIComponent(base)}`;

  console.log(`[currencyService] Fetching rates for ${base} via ${API_KEY ? 'premium' : 'open-access'} endpoint`);

  try {
    const raw = await httpsGet(url);

    if (raw.result !== 'success') {
      throw new Error(`ExchangeRate-API error: ${raw['error-type'] || raw.error || 'unknown'}`);
    }

    const data = {
      base:      raw.base_code,
      rates:     raw.rates || raw.conversion_rates,
      updatedAt: raw.time_last_update_utc || new Date().toISOString(),
      source:    API_KEY ? 'exchangerate-api-premium' : 'exchangerate-api-open',
    };

    _cache[base] = { data, expiresAt: now + CACHE_TTL_MS };
    console.log(`[currencyService] Cached ${Object.keys(data.rates).length} rates for ${base}`);
    return data;
  } catch (err) {
    console.error(`[currencyService] fetchRates error: ${err.message}`);
    throw err;
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Get all exchange rates relative to a base currency.
 * Always works — no API key required.
 *
 * @param {string} [base] - ISO 4217 code, defaults to CURRENCY_BASE env var
 */
async function getRates(base) {
  return fetchRates(base || BASE_DEFAULT);
}

/**
 * Convert an amount from one currency to another.
 *
 * @param {object} params
 * @param {string} params.from   - Source currency code (e.g. 'INR')
 * @param {string} params.to     - Target currency code (e.g. 'USD')
 * @param {number} params.amount - Amount to convert
 */
async function convert({ from, to, amount }) {
  const { rates } = await fetchRates(from);

  const rate = rates[to];
  if (rate === undefined) {
    throw new Error(`Unsupported currency code: "${to}"`);
  }

  return {
    from,
    to,
    amount:    Number(amount),
    converted: parseFloat((amount * rate).toFixed(4)),
    rate,
  };
}

/**
 * List all supported currency codes.
 * @returns {Promise<string[]>}
 */
async function getSupportedCurrencies() {
  const { rates } = await fetchRates(BASE_DEFAULT);
  return Object.keys(rates).sort();
}

/**
 * Whether a premium API key is configured.
 * The service works without it — this just indicates upgrade status.
 */
function isConfigured() {
  return Boolean(API_KEY);
}

module.exports = { getRates, convert, getSupportedCurrencies, isConfigured };
