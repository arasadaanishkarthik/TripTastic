// backend/src/controllers/itineraryController.js
// Handles AI itinerary generation and trip chat requests using Google Gemini.

const { generateItinerary, chatAboutItinerary } = require('../services/itineraryService');

const isDev = process.env.NODE_ENV !== 'production';

// Map error codes -> HTTP status
const STATUS_BY_CODE = {
  NO_API_KEY:    503,
  AUTH_ERROR:    401,
  INVALID_MODEL: 502,
  RATE_LIMIT:    429,
  NETWORK_ERROR: 502,
  TIMEOUT:       504,
  PARSE_ERROR:   502,
  UNKNOWN:       502,
};

// User-facing chat bubble text for the /chat endpoint, keyed by error code.
const CHAT_REPLIES = {
  NO_API_KEY:    'AI assistant is not configured. Please configure GEMINI_API_KEY in backend/.env.',
  AUTH_ERROR:    "AI assistant couldn't authenticate with Gemini. Please verify GEMINI_API_KEY in backend/.env.",
  INVALID_MODEL: 'Gemini model is invalid or unavailable. Please check GEMINI_MODEL in backend/.env.',
  RATE_LIMIT:    'Gemini is temporarily rate-limited. Please try again in a moment.',
  NETWORK_ERROR: "Couldn't reach Google Gemini right now. Please try again shortly.",
  TIMEOUT:       'Gemini request timed out. Please try again.',
  UNKNOWN:       "I'm having trouble connecting right now. Please try again in a moment.",
};

function describeError(err) {
  const code = err.code || 'UNKNOWN';
  return {
    status:  STATUS_BY_CODE[code] || 500,
    code,
    message: err.message,
  };
}

/**
 * POST /api/itinerary/generate
 * Body: { destination, dates, groupSize, travelers, budgetPerPerson, preferences, mode }
 */
const generate = async (req, res, next) => {
  try {
    const tripData = req.body;

    // Basic validation
    if (!tripData || !tripData.destination?.name) {
      return res.status(400).json({
        success: false,
        message: 'destination.name is required',
      });
    }

    const itinerary = await generateItinerary(tripData);

    res.json({
      success:   true,
      itinerary,
    });
  } catch (err) {
    console.error('[itineraryController] generate error:', err.code || '', err.message);

    if (err.name === 'AIError' || err.name === 'GeminiError') {
      const { status, code, message } = describeError(err);
      return res.status(status).json({
        success: false,
        message,
        code,
        ...(isDev && err.cause?.message ? { detail: err.cause.message } : {}),
      });
    }

    next(err);
  }
};

/**
 * POST /api/itinerary/chat
 * Body: { itinerary, message }
 */
const chat = async (req, res, next) => {
  try {
    const { itinerary, message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'message is required' });
    }

    const reply = await chatAboutItinerary(itinerary || {}, message.trim());

    res.json({ success: true, reply });
  } catch (err) {
    console.error('[itineraryController] chat error:', err.code || '', err.message);

    const isAiErr = err.name === 'AIError' || err.name === 'GeminiError';
    const code  = isAiErr ? (err.code || 'UNKNOWN') : 'UNKNOWN';
    const reply = CHAT_REPLIES[code] || CHAT_REPLIES.UNKNOWN;

    const status = isAiErr
      ? (STATUS_BY_CODE[code] || 502)
      : 500;
    res.status(status).json({
      success: false,
      message: reply,
      code,
      ...(isDev && err.message ? { detail: err.message } : {}),
    });
  }
};

module.exports = { generate, chat };
