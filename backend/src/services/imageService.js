// backend/src/services/imageService.js
// ─────────────────────────────────────────────────────────────────────────────
// Destination Image Service
//
// Two providers (auto-selected based on env config):
//
//   1. Pexels API (PREFERRED when PEXELS_API_KEY is set)
//      - Free developer API, stable CDN, proper attribution
//      - Sign up at https://www.pexels.com/api/
//
//   2. LoremFlickr (DEFAULT, zero config)
//      - No key or sign-up. Returns a keyword-matched image directly.
//
// Response shape (both providers):
//   { url: string, thumbUrl: string, attribution: { photographer, link } | null }
// ─────────────────────────────────────────────────────────────────────────────

const https = require('https');

const PEXELS_KEY  = process.env.PEXELS_API_KEY || '';
const PEXELS_BASE = 'https://api.pexels.com/v1';

// Simple in-memory cache (keyed by query, 30-minute TTL)
const _cache = {};
const CACHE_TTL_MS = 30 * 60 * 1000;

// ── HTTPS helper ──────────────────────────────────────────────────────────────

function httpsGet(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { Accept: 'application/json', ...headers } }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try { resolve(JSON.parse(data)); }
          catch (e) { reject(new Error(`JSON parse error: ${e.message}`)); }
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    });
    req.setTimeout(8000, () => { req.destroy(); reject(new Error('Image API timeout')); });
    req.on('error', reject);
  });
}

// ── Pexels provider ───────────────────────────────────────────────────────────

async function searchPexels(query) {
  const url =
    `${PEXELS_BASE}/search` +
    `?query=${encodeURIComponent(query + ' travel landscape')}` +
    `&orientation=landscape&size=large&per_page=5`;

  const data = await httpsGet(url, { Authorization: PEXELS_KEY });

  if (!data.photos?.length) return null;

  // Pick the first landscape photo
  const photo = data.photos[0];
  return {
    url:      photo.src.large2x || photo.src.large,
    thumbUrl: photo.src.medium,
    attribution: {
      photographer: photo.photographer,
      link:         photo.photographer_url,
    },
    source: 'pexels',
  };
}

// ── Unsplash Source provider ──────────────────────────────────────────────────

function buildUnsplashUrl(query, width = 1800, height = 900) {
  const keyword = encodeURIComponent(`${query},travel,landscape`);
  return `https://loremflickr.com/${width}/${height}/${keyword}`;
}

function getUnsplashImage(query) {
  // Unsplash Source is a redirect URL — we return it directly without fetching
  // to avoid following the redirect (the browser will handle it).
  return {
    url:         buildUnsplashUrl(query),
    thumbUrl:    buildUnsplashUrl(query, 600, 400),
    attribution: null, // Unsplash Source doesn't provide attribution metadata
    source:      'loremflickr',
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Get a destination image URL for a given query string.
 * Automatically selects the best available provider.
 *
 * @param {string} query  - e.g. 'Kerala', 'Goa beach', 'Ladakh mountains'
 * @returns {Promise<{ url: string, thumbUrl: string, attribution: object|null, source: string }>}
 */
async function getDestinationImage(query) {
  const cacheKey = query.toLowerCase().trim();
  const now = Date.now();

  if (_cache[cacheKey] && now < _cache[cacheKey].expiresAt) {
    return _cache[cacheKey].data;
  }

  let result = null;

  if (PEXELS_KEY) {
    try {
      result = await searchPexels(query);
    } catch (err) {
      console.warn(`[imageService] Pexels failed: ${err.message} — falling back to Unsplash Source`);
    }
  }

  if (!result) {
    result = getUnsplashImage(query);
  }

  _cache[cacheKey] = { data: result, expiresAt: now + CACHE_TTL_MS };
  console.log(`[imageService] Image for "${query}" via ${result.source}`);

  return result;
}

/**
 * Whether Pexels is configured (premium image source).
 * The service always works via Unsplash Source without it.
 */
function isConfigured() {
  return Boolean(PEXELS_KEY);
}

module.exports = { getDestinationImage, isConfigured };
