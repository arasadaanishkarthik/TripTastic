// backend/src/services/geminiClient.js
// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth for Google Gemini AI.
//
// - Uses the official, recommended SDK: @google/genai
// - Reads GEMINI_API_KEY / GEMINI_MODEL from process.env on demand.
// - Default model: gemini-2.5-flash (fast, lightweight, production-ready).
// - Never logs raw API keys — only logs configuration status boolean.
// - Normalises Gemini/network failures into typed error codes:
//   AUTH_ERROR | INVALID_MODEL | RATE_LIMIT | TIMEOUT | NETWORK_ERROR | PARSE_ERROR | UNKNOWN
// ─────────────────────────────────────────────────────────────────────────────

const { GoogleGenAI } = require('@google/genai');

const DEFAULT_MODEL = 'gemini-2.5-flash';
const DEFAULT_TIMEOUT_MS = 45000;

function getApiKey() {
  return (process.env.GEMINI_API_KEY || '').trim();
}

function getModelName() {
  return (process.env.GEMINI_MODEL || '').trim() || DEFAULT_MODEL;
}

function getTimeoutMs() {
  const custom = parseInt(process.env.GEMINI_TIMEOUT_MS, 10);
  return Number.isFinite(custom) && custom > 0 ? custom : DEFAULT_TIMEOUT_MS;
}

/** Whether a Gemini API key is present in the environment. */
function isConfigured() {
  return Boolean(getApiKey());
}

/**
 * Log configuration status once at startup.
 * Deliberately logs booleans and model name only — never the secret key.
 */
function logDiagnostics() {
  console.log(`[gemini] GEMINI_API_KEY configured: ${isConfigured()}`);
  console.log(`[gemini] GEMINI_MODEL: "${getModelName()}"`);
}

/**
 * Typed error for Gemini operations so controllers and services
 * can handle specific failures (e.g. rate limits, auth) cleanly.
 */
class GeminiError extends Error {
  constructor(code, message, cause) {
    super(message);
    this.name = 'GeminiError';
    this.code = code; // NO_API_KEY | AUTH_ERROR | INVALID_MODEL | RATE_LIMIT | NETWORK_ERROR | TIMEOUT | PARSE_ERROR | UNKNOWN
    this.cause = cause;
  }
}

/**
 * Inspect an error thrown by the Gemini SDK or network layer and classify it.
 */
function classifyError(err) {
  const status = err?.status || err?.response?.status || err?.cause?.status || err?.statusCode;
  const message = (err?.message || '').toLowerCase();
  const detail = JSON.stringify(err?.error || err?.cause || {}).toLowerCase();
  const fullText = `${message} ${detail}`;

  if (
    status === 401 ||
    status === 403 ||
    fullText.includes('api_key_invalid') ||
    fullText.includes('api key not valid') ||
    fullText.includes('permission_denied') ||
    fullText.includes('unauthorized') ||
    fullText.includes('forbidden')
  ) {
    return new GeminiError(
      'AUTH_ERROR',
      'Gemini API key is invalid or unauthorized. Please verify GEMINI_API_KEY in backend/.env.',
      err
    );
  }

  if (
    status === 404 ||
    fullText.includes('not_found') ||
    fullText.includes('model not found') ||
    fullText.includes('unsupported model')
  ) {
    return new GeminiError(
      'INVALID_MODEL',
      `Gemini model "${getModelName()}" was not found or is unsupported. Check GEMINI_MODEL in backend/.env.`,
      err
    );
  }

  if (
    status === 429 ||
    fullText.includes('quota') ||
    fullText.includes('rate_limit') ||
    fullText.includes('resource_exhausted') ||
    fullText.includes('too many requests')
  ) {
    return new GeminiError(
      'RATE_LIMIT',
      'Gemini usage quota or rate limit exceeded. Please wait a few seconds and try again.',
      err
    );
  }

  if (
    err?.name === 'AbortError' ||
    status === 408 ||
    fullText.includes('timeout') ||
    fullText.includes('abort')
  ) {
    return new GeminiError(
      'TIMEOUT',
      `Gemini did not respond within ${getTimeoutMs() / 1000}s. Please try again.`,
      err
    );
  }

  if (
    fullText.includes('fetch failed') ||
    fullText.includes('econnrefused') ||
    fullText.includes('enotfound') ||
    fullText.includes('etimedout') ||
    fullText.includes('network')
  ) {
    return new GeminiError(
      'NETWORK_ERROR',
      'Could not connect to Google Gemini API. Please check your network connection.',
      err
    );
  }

  return new GeminiError('UNKNOWN', err?.message || 'Unknown Gemini API error', err);
}

// Cached client instance mapped by API key
let cachedKey = null;
let cachedClient = null;

function getClient() {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new GeminiError(
      'NO_API_KEY',
      'GEMINI_API_KEY is not configured. Please set GEMINI_API_KEY in backend/.env and restart.'
    );
  }

  if (cachedClient && cachedKey === apiKey) {
    return cachedClient;
  }

  cachedKey = apiKey;
  cachedClient = new GoogleGenAI({ apiKey });
  return cachedClient;
}

/**
 * Call Gemini's generateContent and return the response text.
 *
 * @param {string|Array} contents - Prompt text, or structured contents
 * @param {object} [options] - Options { temperature, responseMimeType, maxOutputTokens, systemInstruction }
 * @param {object} [requestContext] - Optional context for debug logging (e.g. destination name)
 * @returns {Promise<string>}
 * @throws {GeminiError}
 */
async function generateText(contents, options = {}, requestContext = {}) {
  const client = getClient();
  const model = getModelName();
  const timeoutMs = getTimeoutMs();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const promptText = Array.isArray(contents) ? contents.join('\n\n') : String(contents);

    const config = {
      abortSignal: controller.signal,
    };

    if (options.temperature !== undefined) {
      config.temperature = options.temperature;
    }
    if (options.responseMimeType) {
      config.responseMimeType = options.responseMimeType;
    }
    if (options.maxOutputTokens) {
      config.maxOutputTokens = options.maxOutputTokens;
    }
    if (options.topP !== undefined) {
      config.topP = options.topP;
    }
    if (options.topK !== undefined) {
      config.topK = options.topK;
    }
    if (options.systemInstruction) {
      config.systemInstruction = options.systemInstruction;
    }

    console.log(`[gemini] generateContent started with model "${model}"${requestContext.destination ? ` for "${requestContext.destination}"` : ''}`);

    const response = await client.models.generateContent({
      model,
      contents: promptText,
      config,
    });

    const text = response?.text;
    if (typeof text !== 'string' || !text.trim().length) {
      throw new GeminiError('UNKNOWN', 'Gemini returned an empty text response.');
    }

    console.log(`[gemini] generateContent completed (${text.length} chars)`);
    return text;
  } catch (err) {
    if (err instanceof GeminiError) throw err;
    throw classifyError(err);
  } finally {
    clearTimeout(timeoutId);
  }
}

module.exports = {
  isConfigured,
  getModelName,
  logDiagnostics,
  generateText,
  GeminiError,
};