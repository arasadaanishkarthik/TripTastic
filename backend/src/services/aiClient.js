// backend/src/services/aiClient.js
// ─────────────────────────────────────────────────────────────────────────────
// Unified AI Provider Orchestrator
//
// Automatically routes AI generation to:
//   1. Groq (Llama-3.3-70b / Llama-3.1-8b) — if GROQ_API_KEY is configured
//   2. Google Gemini (gemini-2.5-flash)    — if GEMINI_API_KEY is configured
// ─────────────────────────────────────────────────────────────────────────────

const groq = require('./groqClient');
const gemini = require('./geminiClient');

function getActiveProvider() {
  if (groq.isConfigured()) return 'groq';
  if (gemini.isConfigured()) return 'gemini';
  return 'none';
}

function isConfigured() {
  return groq.isConfigured() || gemini.isConfigured();
}

function getModelName() {
  if (groq.isConfigured()) return `groq/${groq.getModelName()}`;
  if (gemini.isConfigured()) return `gemini/${gemini.getModelName()}`;
  return 'none';
}

function logDiagnostics() {
  console.log(`[aiClient] Active Provider: ${getActiveProvider()}`);
  if (groq.isConfigured()) {
    groq.logDiagnostics();
  }
  if (gemini.isConfigured()) {
    gemini.logDiagnostics();
  }
  if (!isConfigured()) {
    console.warn('[aiClient] Neither GROQ_API_KEY nor GEMINI_API_KEY is set. Fallbacks will be used.');
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
 * Generate text or JSON using the best configured AI model.
 * If primary provider hits a rate limit or auth error, falls back to secondary provider if available.
 *
 * @param {string|Array} contents
 * @param {object} [config]
 * @param {object} [requestContext]
 * @returns {Promise<string>}
 */
async function generateText(contents, config = {}, requestContext = {}) {
  const primary = getActiveProvider();

  if (primary === 'none') {
    throw new AIError('NO_API_KEY', 'No AI API key is configured. Please add GROQ_API_KEY or GEMINI_API_KEY in backend/.env.');
  }

  // ── Try Groq first if configured ──
  if (groq.isConfigured()) {
    try {
      return await groq.generateText(contents, config, requestContext);
    } catch (err) {
      console.warn(`[aiClient] Groq attempt failed (${err.code || err.message}).`);
      // If Gemini is also configured and Groq failed, try Gemini as backup
      if (gemini.isConfigured()) {
        console.log(`[aiClient] Failing over to Gemini backup…`);
        try {
          return await gemini.generateText(contents, config, requestContext);
        } catch (geminiErr) {
          throw new AIError(geminiErr.code || 'UNKNOWN', geminiErr.message, geminiErr);
        }
      }
      throw new AIError(err.code || 'UNKNOWN', err.message, err);
    }
  }

  // ── Otherwise try Gemini ──
  if (gemini.isConfigured()) {
    try {
      return await gemini.generateText(contents, config, requestContext);
    } catch (err) {
      throw new AIError(err.code || 'UNKNOWN', err.message, err);
    }
  }

  throw new AIError('NO_API_KEY', 'No AI API key configured.');
}

module.exports = {
  isConfigured,
  getModelName,
  getActiveProvider,
  logDiagnostics,
  generateText,
  AIError,
};
