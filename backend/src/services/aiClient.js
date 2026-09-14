// backend/src/services/aiClient.js
// ─────────────────────────────────────────────────────────────────────────────
// Unified AI Provider Client for TripTastic
//
// Primary and only AI Provider: Google Gemini (gemini-2.5-flash)
// Managed through @google/genai SDK
// ─────────────────────────────────────────────────────────────────────────────

const gemini = require('./geminiClient');

function getActiveProvider() {
  if (gemini.isConfigured()) return 'gemini';
  return 'none';
}

function isConfigured() {
  return gemini.isConfigured();
}

function getModelName() {
  return gemini.getModelName();
}

function logDiagnostics() {
  console.log(`[aiClient] Active AI Provider: ${getActiveProvider()}`);
  gemini.logDiagnostics();
  if (!isConfigured()) {
    console.warn('[aiClient] GEMINI_API_KEY is not configured in backend/.env. Verified POI fallback will be used for itineraries.');
  }
}

class AIError extends Error {
  constructor(code, message, cause) {
    super(message);
    this.name = 'AIError';
    this.code = code;
    this.cause = cause;
  }
}

/**
 * Generate text or structured JSON using Google Gemini.
 *
 * @param {string|Array} contents
 * @param {object} [config]
 * @param {object} [requestContext]
 * @returns {Promise<string>}
 */
async function generateText(contents, config = {}, requestContext = {}) {
  if (!gemini.isConfigured()) {
    throw new AIError(
      'NO_API_KEY',
      'Google Gemini API key is not configured. Please set GEMINI_API_KEY in backend/.env.'
    );
  }

  try {
    return await gemini.generateText(contents, config, requestContext);
  } catch (err) {
    throw new AIError(err.code || 'UNKNOWN', err.message, err);
  }
}

module.exports = {
  isConfigured,
  getModelName,
  getActiveProvider,
  logDiagnostics,
  generateText,
  AIError,
  GeminiError: gemini.GeminiError,
};
