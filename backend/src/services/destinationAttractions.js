// backend/src/services/destinationAttractions.js
// ─────────────────────────────────────────────────────────────────────────────
// Destination Attractions & Structured Fallback Builder
//
// Delegates to curatedAttractions.js for verified tourist sights.
// ─────────────────────────────────────────────────────────────────────────────

const { getCuratedAttractions } = require('./curatedAttractions');

function getDestinationKey(destinationName) {
  return String(destinationName || '').toLowerCase().trim();
}

function pickAttractionsForPreferences(destinationName, preferences = []) {
  const curated = getCuratedAttractions(destinationName);
  if (!curated || curated.length === 0) return [];

  const searched = (preferences || []).map((p) => String(p).toLowerCase());
  if (!searched.length) return curated;

  const matches = curated.filter((item) => {
    const cat = String(item.category || '').toLowerCase();
    return searched.some((pref) => {
      if (pref.includes('nature') || pref.includes('beach')) return cat.includes('nature') || cat.includes('adventure');
      if (pref.includes('culture') || pref.includes('heritage') || pref.includes('temple')) return cat.includes('culture');
      if (pref.includes('adventure')) return cat.includes('adventure') || cat.includes('nature');
      return true;
    });
  });

  return matches.length > 0 ? matches : curated;
}

module.exports = {
  pickAttractionsForPreferences,
  getDestinationKey,
};
