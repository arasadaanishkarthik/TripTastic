// backend/src/services/groqClient.js
// ─────────────────────────────────────────────────────────────────────────────
// Groq AI Client — ultra-fast Llama-3.3 / Llama-3.1 inference
//
// OpenAI-compatible endpoint: https://api.groq.com/openai/v1/chat/completions
// ─────────────────────────────────────────────────────────────────────────────

const https = require('https');

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_MODEL   = process.env.GROQ_MODEL || 'qwen/qwen3.8-27b';
const GROQ_TIMEOUT_MS = parseInt(process.env.GROQ_TIMEOUT_MS || '45000', 10);

function isConfigured() {
  return Boolean(process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim());
}

function getModelName() {
  return process.env.GROQ_MODEL || 'qwen/qwen3.8-27b';
}

function logDiagnostics() {
  console.log(`[groq] GROQ_API_KEY configured: ${isConfigured()}`);
  console.log(`[groq] GROQ_MODEL configured: ${Boolean(process.env.GROQ_MODEL)} (using "${getModelName()}")`);
}

class GroqError extends Error {
  constructor(code, message, cause) {
    super(message);
    this.name = 'GroqError';
    this.code = code;
    this.cause = cause;
  }
}

function classifyError(status, message, rawBody) {
  const msg = (message || rawBody || '').toLowerCase();
  if (status === 401 || status === 403 || msg.includes('invalid api key') || msg.includes('unauthorized')) {
    return new GroqError('AUTH_ERROR', 'Groq rejected the API key. Please verify GROQ_API_KEY in backend/.env.');
  }
  if (status === 404 || msg.includes('model_not_found')) {
    return new GroqError('INVALID_MODEL', `Groq model "${getModelName()}" not found. Check GROQ_MODEL in backend/.env.`);
  }
  if (status === 429 || msg.includes('rate limit') || msg.includes('tokens per minute') || msg.includes('tpm')) {
    return new GroqError('RATE_LIMIT', 'Groq rate limit reached. Please wait a few seconds and try again.');
  }
  if (msg.includes('timeout') || msg.includes('abort')) {
    return new GroqError('TIMEOUT', 'Groq request timed out. Please try again.');
  }
  return new GroqError('UNKNOWN', message || 'Unknown Groq API error');
}

/**
 * Call Groq API to generate text or JSON.
 *
 * @param {string|Array} contents - Prompt text
 * @param {object} [config] - Options { temperature, responseMimeType, maxOutputTokens }
 * @param {object} [requestContext] - Context for logging
 * @returns {Promise<string>}
 */
async function generateText(contents, config = {}, requestContext = {}) {
  const apiKey = process.env.GROQ_API_KEY || '';
  if (!apiKey) {
    throw new GroqError('NO_API_KEY', 'GROQ_API_KEY is not configured in backend/.env.');
  }

  const model = getModelName();
  const promptText = Array.isArray(contents) ? contents.join('\n\n') : String(contents);

  const isJson = config.responseMimeType === 'application/json' || (config.response_format && config.response_format.type === 'json_object');

  const requestBody = JSON.stringify({
    model,
    messages: [
      {
        role: 'system',
        content: isJson
          ? 'You are an expert AI travel planner. You MUST respond with ONLY a valid, parseable JSON object matching the requested schema. Do not include markdown code blocks, backticks, or any conversational text.'
          : 'You are an expert AI travel planner for TripTastic.',
      },
      {
        role: 'user',
        content: promptText,
      },
    ],
    temperature: config.temperature ?? 0.6,
    max_tokens: config.maxOutputTokens || config.max_tokens || 8192,
    response_format: isJson ? { type: 'json_object' } : undefined,
  });

  console.log(`[groq] request started`);
  console.log(`[groq] model: ${model}`);
  if (requestContext.destination) {
    console.log(`[groq] destination: ${requestContext.destination}`);
  }

  return new Promise((resolve, reject) => {
    const req = https.request(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey.trim()}`,
          'Accept': 'application/json',
        },
      },
      (res) => {
        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          const raw = Buffer.concat(chunks).toString('utf8');
          if (res.statusCode >= 400) {
            console.error(`[groq] HTTP error ${res.statusCode}:`, raw.slice(0, 300));
            try {
              const errJson = JSON.parse(raw);
              const errMsg = errJson?.error?.message || raw;
              reject(classifyError(res.statusCode, errMsg, raw));
            } catch {
              reject(classifyError(res.statusCode, raw, raw));
            }
            return;
          }

          try {
            const data = JSON.parse(raw);
            const content = data.choices?.[0]?.message?.content;
            if (!content || typeof content !== 'string') {
              reject(new GroqError('UNKNOWN', 'Groq returned an empty response choices array.'));
              return;
            }
            console.log('[groq] response received');
            console.log('[groq] request completed');
            resolve(content);
          } catch (parseErr) {
            reject(new GroqError('PARSE_ERROR', 'Failed to parse Groq response JSON.', parseErr));
          }
        });
      }
    );

    req.setTimeout(GROQ_TIMEOUT_MS, () => {
      req.destroy();
      reject(new GroqError('TIMEOUT', `Groq did not respond within ${GROQ_TIMEOUT_MS / 1000}s.`));
    });

    req.on('error', (err) => {
      console.error('[groq] network error:', err.message);
      reject(new GroqError('NETWORK_ERROR', `Could not reach Groq API: ${err.message}`, err));
    });

    req.write(requestBody);
    req.end();
  });
}

module.exports = {
  isConfigured,
  getModelName,
  logDiagnostics,
  generateText,
  GroqError,
};
