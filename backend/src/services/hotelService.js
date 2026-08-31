// backend/src/services/hotelService.js
// ─────────────────────────────────────────────────────────────────────────────
// Hotel Search Service — PLACEHOLDER (not yet active)
//
// This service is intentionally empty of live data. It is a drop-in stub
// reserved for a future hotel provider integration.
//
// TO ACTIVATE in the future:
//   1. Subscribe to the Booking.com API on RapidAPI (freemium)
//      https://rapidapi.com/apidojo/api/booking
//   2. Set RAPIDAPI_KEY in backend/.env
//   3. Implement search logic here following the existing controller/route shape
//
// IMPORTANT: This service NEVER returns fake/simulated hotel data.
//   All endpoints return { available: false } until a real provider is wired.
// ─────────────────────────────────────────────────────────────────────────────

const NOT_CONFIGURED = {
  available: false,
  reason:    'PROVIDER_NOT_CONFIGURED',
  message:   'Hotel search is not yet available. A provider integration is planned for a future update.',
};

/** Whether a hotel provider is configured and active. */
function isConfigured() {
  return false; // Set to true when RapidAPI/Booking.com or another provider is wired
}

/**
 * Placeholder: search for hotels.
 * Returns a not-available response — no fake data.
 */
async function searchHotels(_params) {
  return NOT_CONFIGURED;
}

/**
 * Placeholder: destination autocomplete for hotel search.
 * Returns a not-available response — no fake data.
 */
async function searchDestinations(_query) {
  return NOT_CONFIGURED;
}

module.exports = { isConfigured, searchHotels, searchDestinations };
