// backend/src/services/flightService.js
// ─────────────────────────────────────────────────────────────────────────────
// Flight Search Service — PLACEHOLDER (not yet active)
//
// This service is intentionally empty of live data. It is a drop-in stub
// reserved for a future Amadeus integration.
//
// TO ACTIVATE in the future:
//   1. Register at https://developers.amadeus.com/ (free test account)
//   2. Set AMADEUS_CLIENT_ID and AMADEUS_CLIENT_SECRET in backend/.env
//   3. Implement the Amadeus OAuth + search logic here
//
// IMPORTANT: This service NEVER returns fake/simulated flight data.
//   All endpoints return { available: false } until a real provider is wired.
// ─────────────────────────────────────────────────────────────────────────────

const NOT_CONFIGURED = {
  available: false,
  reason:    'PROVIDER_NOT_CONFIGURED',
  message:   'Flight search is not yet available. A provider integration is planned for a future update.',
};

/** Whether a flight provider is configured and active. */
function isConfigured() {
  return false; // Set to true when Amadeus or another provider is wired
}

/**
 * Placeholder: search for flight offers.
 * Returns a not-available response — no fake data.
 */
async function searchFlights(_params) {
  return NOT_CONFIGURED;
}

/**
 * Placeholder: airport autocomplete.
 * Returns a not-available response — no fake data.
 */
async function searchAirports(_keyword) {
  return NOT_CONFIGURED;
}

module.exports = { isConfigured, searchFlights, searchAirports };
