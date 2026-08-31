// backend/src/services/geminiClient.js
// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth for talking to Google Gemini.
//
// - Reads GEMINI_API_KEY / GEMINI_MODEL from process.env (loaded via dotenv
//   in server.js, which runs before anything in this file is required).
// - Uses the current, supported SDK: @google/genai
//   (the older `@google/generative-ai` package is now legacy/deprecated).
// - Never logs the raw API key — only whether it is configured.
// - Normalises Gemini/network failures into a small set of error codes so
//   the rest of the app (controllers) can react sensibly instead of
//   collapsing every failure into "not configured".
// ─────────────────────────────────────────────────────────────────────────────

const { GoogleGenAI } = require('@google/genai');

const GEMINI_API_KEY  = process.env.GEMINI_API_KEY || '';
// Match the project configuration in backend/.env.example and the current
// Gemini defaults used by the app: flash is the default fast model for AI trip
// planning and keeps new API-key integrations working even when no explicit
// GEMINI_MODEL is set in the environment.
const GEMINI_MODEL    = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
// How long to wait for Gemini before giving up (avoids the request hanging
// forever if Google's API is slow/unreachable). Override with GEMINI_TIMEOUT_MS.
const GEMINI_TIMEOUT_MS = parseInt(process.env.GEMINI_TIMEOUT_MS || '60000', 10);

let client = null;
if (GEMINI_API_KEY) {
  client = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
}

/** Whether a Gemini API key is present in the environment. */
function isConfigured() {
  return Boolean(GEMINI_API_KEY);
}

/** The model name currently configured (with fallback). */
function getModelName() {
  return GEMINI_MODEL;
}

/**
 * Log configuration status once at startup.
 * Deliberately logs booleans only — never the key value.
 */
function logDiagnostics() {
  console.log(`[gemini] GEMINI_API_KEY configured: ${isConfigured()}`);
  console.log(`[gemini] GEMINI_MODEL configured: ${Boolean(process.env.GEMINI_MODEL)} (using "${GEMINI_MODEL}")`);
}

/**
 * A typed error so callers/controllers can map to the right HTTP status
 * and user-facing message without string-matching.
 */
class GeminiError extends Error {
  constructor(code, message, cause) {
    super(message);
    this.name = 'GeminiError';
    this.code = code; // NO_API_KEY | AUTH_ERROR | INVALID_MODEL | RATE_LIMIT | NETWORK_ERROR | PARSE_ERROR | UNKNOWN
    this.cause = cause;
  }
}

/**
 * Inspect an error thrown by the SDK/fetch layer and classify it.
 */
function classifyError(err) {
  const status  = err?.status || err?.response?.status || err?.cause?.status;
  const message = (err?.message || '').toLowerCase();

  if (status === 401 || status === 403 || message.includes('api key not valid') || message.includes('permission')) {
    return new GeminiError('AUTH_ERROR', 'Gemini rejected the API key (invalid or unauthorized). Double-check GEMINI_API_KEY in backend/.env.', err);
  }
  if (status === 404 || message.includes('not found') && message.includes('model')) {
    return new GeminiError('INVALID_MODEL', `Gemini model "${GEMINI_MODEL}" was not found. Check GEMINI_MODEL in backend/.env.`, err);
  }
  if (status === 429 || message.includes('quota') || message.includes('rate limit') || message.includes('resource_exhausted')) {
    return new GeminiError('RATE_LIMIT', 'Gemini quota or rate limit exceeded. Please wait and try again.', err);
  }
  if (message.includes('fetch failed') || message.includes('network') || message.includes('enotfound') || message.includes('econnrefused') || message.includes('etimedout')) {
    return new GeminiError('NETWORK_ERROR', 'Could not reach the Gemini API (network error). Check your internet connection.', err);
  }
  if (err?.name === 'AbortError' || message.includes('abort')) {
    return new GeminiError('TIMEOUT', `Gemini did not respond within ${GEMINI_TIMEOUT_MS / 1000}s. Please try again.`, err);
  }
  return new GeminiError('UNKNOWN', err?.message || 'Unknown Gemini error', err);
}

/**
 * Call Gemini's generateContent and return the response text.
 *
 * @param {string|Array} contents - prompt text, or an array of content parts
 * @param {object} [config] - optional GenerateContentConfig (temperature, responseMimeType, etc.)
 * @returns {Promise<string>}
 * @throws {GeminiError}
 */
async function generateText(contents, config, requestContext = {}) {
  if (!isConfigured()) {
    throw new GeminiError('NO_API_KEY', 'GEMINI_API_KEY is not configured. Please set it in backend/.env and restart the server.');
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);

  try {
    console.log(`[gemini] request started`);
    console.log(`[gemini] model: ${GEMINI_MODEL}`);
    if (requestContext.destination) {
      console.log(`[gemini] destination: ${requestContext.destination}`);
    }
    const response = await client.models.generateContent({
      model: GEMINI_MODEL,
      contents,
      config: { ...(config || {}), abortSignal: controller.signal },
    });

    const text = response?.text;
    if (typeof text !== 'string' || !text.length) {
      throw new GeminiError('UNKNOWN', 'Gemini returned an empty response.');
    }
    console.log('[gemini] response received');
    console.log('[gemini] request completed');
    return text;
  } catch (err) {
    if (err instanceof GeminiError) throw err;
    const classified = classifyError(err);
    console.error(`[gemini] request failed: ${classified.code}`);
    throw classified;
  } finally {
    clearTimeout(timer);
  }
}

module.exports = {
  isConfigured,
  getModelName,
  logDiagnostics,
  generateText,
  GeminiError,
};
