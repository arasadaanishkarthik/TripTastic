// backend/src/services/geminiPlaceDiscovery.js
// ─────────────────────────────────────────────────────────────────────────────
// Gemini-Powered Tourist Attraction Discovery Service
//
// 1. Prompts Google Gemini AI to discover real, verifiable tourist attractions
//    for a specific destination based on traveler preferences & travel style.
// 2. Instructs Gemini STRICTLY against fabricating, renaming, or hallucinating places.
// 3. Implements exponential backoff, retry, and rate-limit handling (429/5xx).
// 4. Returns structured JSON array of candidate attractions.
// ─────────────────────────────────────────────────────────────────────────────

const ai = require('./aiClient');

// In-memory cache for candidate discovery results (TTL: 2 hours)
const _discoveryCache = new Map();
const DISCOVERY_CACHE_TTL_MS = 2 * 60 * 60 * 1000;

function getCacheKey(destinationName, preferences = []) {
  const dest = String(destinationName || '').toLowerCase().trim();
  const prefs = (preferences || []).slice().sort().join(',').toLowerCase();
  return `${dest}::${prefs}`;
}

/**
 * Builds the discovery prompt for Google Gemini.
 */
function buildDiscoveryPrompt(destination, options = {}) {
  const destName  = destination?.name || 'Destination';
  const region    = destination?.region || destination?.state || '';
  const country   = destination?.country || 'India';
  const prefs     = (options.preferences || []).join(', ') || 'Sightseeing, Culture, Nature, Heritage';
  const days      = options.durationDays || 4;

  return `You are a professional travel researcher discovering authentic tourist attractions for a travel itinerary.

DESTINATION: ${destName}${region ? `, ${region}` : ''}, ${country}
TRIP DURATION: ${days} days
TRAVELER INTERESTS: ${prefs}

CRITICAL RULES & CONSTRAINTS:
1. REAL ATTRACTIONS ONLY: Return only real, verifiable tourist attractions (temples, shrines, monuments, historical forts, palaces, museums, nature parks, waterfalls, lakes, viewpoints, beaches, heritage sites, wildlife sanctuaries) that you know actually exist in or immediately near ${destName}.
2. DO NOT FABRICATE: Do not create, combine, rename, translate, or fabricate fictional attractions. If you are uncertain about a place, omit it.
3. NO NON-TOURIST ESTABLISHMENTS: Do NOT return ordinary shops, residential areas, railway stations, bus stands, banks, clinics, generic businesses, or ordinary roads.
4. QUANTITY: Return between 8 and 18 prominent real tourist attractions for this destination.
5. ENGLISH ONLY: Return all attraction names and reasons in English.
6. JSON FORMAT: Return ONLY valid, parseable JSON matching the schema below. No markdown fences, no explanatory preamble.

REQUIRED JSON SCHEMA:
{
  "destination": "${destName}",
  "attractions": [
    {
      "name": "Exact well-known attraction name in English",
      "category": "Culture | Nature | Adventure | Relaxation",
      "reason": "Brief English description of why this is an authentic tourist highlight",
      "searchName": "Attraction Name ${destName}"
    }
  ]
}`;
}

/**
 * Discovers candidate tourist attractions using Google Gemini.
 *
 * @param {object} destination - { name, region, state, country, latitude, longitude }
 * @param {object} [options]   - { preferences, durationDays, budgetPerPerson }
 * @returns {Promise<Array<{ name: string, category: string, reason: string, searchName: string }>>}
 */
async function discoverCandidateAttractions(destination, options = {}) {
  const destName = destination?.name;
  if (!destName) return [];

  const cacheKey = getCacheKey(destName, options.preferences);
  const cached = _discoveryCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < DISCOVERY_CACHE_TTL_MS) {
    console.log(`[geminiPlaceDiscovery] Cache hit for "${destName}" (${cached.data.length} candidates)`);
    return cached.data;
  }

  if (!ai.isConfigured()) {
    console.warn(`[geminiPlaceDiscovery] Gemini API key not configured — skipping AI discovery for "${destName}".`);
    return [];
  }

  const prompt = buildDiscoveryPrompt(destination, options);
  const MAX_RETRIES = 2;
  let lastError = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`[geminiPlaceDiscovery] Querying Gemini for candidate attractions in "${destName}" (attempt ${attempt}/${MAX_RETRIES})...`);
      
      const responseText = await ai.generateText(prompt, {
        responseMimeType: 'application/json',
        temperature:      0.2, // Low temperature for high factual accuracy
        maxOutputTokens:  2000,
      }, { destination: destName });

      const cleanJson = responseText.trim().replace(/^```json?\s*/i, '').replace(/\s*```$/i, '');
      const parsed = JSON.parse(cleanJson);

      const rawAttractions = Array.isArray(parsed?.attractions) ? parsed.attractions : [];
      const validCandidates = rawAttractions
        .map((item) => {
          if (!item || !item.name) return null;
          const name = String(item.name).trim();
          if (name.length < 3) return null;
          return {
            name,
            category:   item.category || 'Culture',
            reason:     item.reason || `Prominent tourist attraction in ${destName}.`,
            searchName: item.searchName || `${name} ${destName}`,
            source:     'gemini-discovery',
          };
        })
        .filter(Boolean);

      console.log(`[geminiPlaceDiscovery] Gemini discovered ${validCandidates.length} candidate attractions for "${destName}"`);

      // Cache valid results
      if (validCandidates.length > 0) {
        _discoveryCache.set(cacheKey, {
          timestamp: Date.now(),
          data: validCandidates,
        });
      }

      return validCandidates;
    } catch (err) {
      lastError = err;
      console.warn(`[geminiPlaceDiscovery] Attempt ${attempt} failed for "${destName}":`, err.message);

      // If rate limited (429), wait with exponential backoff before retry
      if (err.code === 'RATE_LIMIT' || String(err.message).includes('429')) {
        const backoffMs = attempt * 1500;
        console.log(`[geminiPlaceDiscovery] Rate limit hit. Backing off for ${backoffMs}ms...`);
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
      }
    }
  }

  console.warn(`[geminiPlaceDiscovery] All discovery attempts failed for "${destName}". Error:`, lastError?.message);
  return [];
}

module.exports = {
  discoverCandidateAttractions,
};
