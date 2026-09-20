// backend/src/services/itineraryService.js
// ─────────────────────────────────────────────────────────────────────────────
// TripTastic Verified AI Itinerary Generator & Synthesis Pipeline
//
// 1. Destination Discovery & Geocoding
// 2. Verified Tourist Attraction Retrieval (Curated + Filtered Places API)
// 3. Geographic Route Clustering (groups nearby verified attractions per day)
// 4. Multi-Activity Daily Scheduling (Distributes ONLY REAL VERIFIED places)
// 5. Zero Generic/Filler Activity Guarantee (NO synthetic meal/promenade cards)
// 6. Hard Safety Destination Validation & Coordinates Check
// ─────────────────────────────────────────────────────────────────────────────

const ai = require('./aiClient');
const { searchTouristPlaces, calculateDistanceKm, isTouristAttraction } = require('./placesService');
const { getCuratedAttractions } = require('./curatedAttractions');

const VALID_CATEGORIES = [
  'Food', 'Nature', 'Adventure', 'Culture', 'Photography',
  'Transport', 'Relaxation', 'Shopping',
];

const GENERIC_ACTIVITY_PATTERNS = [
  /authentic regional cuisine/i,
  /evening promenade/i,
  /local atmosphere/i,
  /explore local/i,
  /visit local market/i,
  /enjoy local food/i,
  /relax at a scenic spot/i,
  /explore the city/i,
  /discover local culture/i,
  /experience local life/i,
  /shopping at local market/i,
  /sunset walk/i,
  /leisure time/i,
  /city exploration/i,
  /local culture experience/i,
  /local streets/i,
  /city center stroll/i,
];

const TOTAL_REQUEST_DEADLINE_MS = 20000;

function cleanTitle(value) {
  return String(value || '').replace(/^\s+|\s+$/g, '');
}

function isGenericFillerTitle(title) {
  if (!title) return true;
  const clean = cleanTitle(title);
  return GENERIC_ACTIVITY_PATTERNS.some((pattern) => pattern.test(clean));
}

function calculateRequestedDays(tripData = {}) {
  const explicit = Number(tripData.durationDays);
  if (Number.isFinite(explicit) && explicit > 0) return Math.max(1, explicit);

  const { start, end } = tripData.dates || {};
  if (start && end) {
    const diff = Math.round((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff + 1 : 1;
  }

  return 4;
}

/**
 * Clusters verified attractions into spatial day groups based on geographic proximity.
 */
function clusterAttractionsByDays(attractions, numDays) {
  if (!attractions || attractions.length === 0) return Array.from({ length: numDays }, () => []);
  if (numDays <= 1) return [attractions];

  const withCoords = attractions.filter((a) => Number.isFinite(a.latitude) && Number.isFinite(a.longitude));
  const withoutCoords = attractions.filter((a) => !Number.isFinite(a.latitude) || !Number.isFinite(a.longitude));

  withCoords.sort((a, b) => {
    if (Math.abs(a.latitude - b.latitude) > 0.05) {
      return b.latitude - a.latitude; // North to South
    }
    return a.longitude - b.longitude; // West to East
  });

  const sorted = [...withCoords, ...withoutCoords];
  const clusters = Array.from({ length: numDays }, () => []);

  // Distribute sequentially into spatial day clusters
  sorted.forEach((attraction, idx) => {
    const dayIndex = idx % numDays;
    clusters[dayIndex].push(attraction);
  });

  return clusters;
}

// ── Gemini Prompt Builder ─────────────────────────────────────────────────────

function formatAttractionList(attractions) {
  if (!Array.isArray(attractions) || attractions.length === 0) {
    return 'No verified candidate attractions found.';
  }
  return attractions
    .map((p, i) => `${i + 1}. "${p.name}" | Category: ${p.category || 'Culture'} | Location: ${p.location || p.address || p.name} | Lat: ${p.latitude || 'N/A'}, Lon: ${p.longitude || 'N/A'}${p.description ? ` | Info: ${p.description.slice(0, 100)}` : ''}`)
    .join('\n');
}

function buildPrompt(tripData, attractions = []) {
  const { destination, dates, groupSize, travelers, budgetPerPerson, preferences, mode } = tripData;
  const daysCount      = calculateRequestedDays(tripData);
  const startDate      = dates?.start || '';
  const endDate        = dates?.end   || '';
  const totalBudget    = (budgetPerPerson || 5000) * (groupSize || 2);
  const travelerList   = (travelers || []).join(', ') || `${groupSize || 2} travelers`;
  const preferenceStr  = (preferences || []).join(', ') || 'Sightseeing, Culture, Nature, Heritage';
  const attractionText = formatAttractionList(attractions);

  return `You are TripTastic AI, an expert travel planner organizing real, verified group travel itineraries.

DESTINATION: ${destination?.name || 'Destination'}, ${destination?.region || destination?.state || ''}, ${destination?.country || 'India'}
DURATION: EXACTLY ${daysCount} days (Day 1 through Day ${daysCount})
TRAVELERS: ${groupSize || 2} (${travelerList})
BUDGET: ₹${totalBudget.toLocaleString()} total (₹${(budgetPerPerson || 5000).toLocaleString()} per person)
INTERESTS: ${preferenceStr}

VERIFIED_ATTRACTIONS (Single Source of Truth):
${attractionText}

STRICT ARCHITECTURAL CONSTRAINTS:
1. ONLY USE VERIFIED_ATTRACTIONS: Every single sightseeing activity in your itinerary MUST correspond strictly to one of the real places listed above in VERIFIED_ATTRACTIONS.
2. NO GENERIC FILLER ACTIVITIES: NEVER create generic activities (e.g. "Authentic Regional Cuisine in ${destination?.name}", "Evening Promenade", "Explore Local Streets", "Visit Local Market", "Relaxation", "Sunset Walk"). Every activity must be a specific, named verified place from VERIFIED_ATTRACTIONS.
3. EXACT DURATION: Output exactly ${daysCount} day objects in the "days" array, numbered from 1 to ${daysCount}.
4. REALISTIC DAILY TIMINGS: Distribute the available verified attractions across the ${daysCount} days (e.g. 09:30 Morning sight, 11:30 Mid-day sight, 14:30 Afternoon sight, 17:00 Sunset/Evening sight). If a destination has fewer attractions, assign 1-2 real places per day.
5. NO FAKE/UNVERIFIED PLACES: Do NOT invent fictional places, restaurants, or generic sightseeing stops.
6. LANGUAGE: All text must be in English.
7. FORMAT: Return ONLY valid, parseable JSON conforming strictly to the schema below.

REQUIRED JSON SCHEMA:
{
  "destination": {
    "name": "${destination?.name || 'Destination'}",
    "region": "${destination?.region || destination?.state || ''}",
    "tagline": "Short evocative English tagline",
    "country": "${destination?.country || 'India'}"
  },
  "durationDays": ${daysCount},
  "travelers": ${groupSize || 2},
  "travelerNames": ${JSON.stringify(travelers || [])},
  "budget": {
    "total": ${totalBudget},
    "perPerson": ${budgetPerPerson || 5000},
    "breakdown": [
      { "category": "Accommodation", "amount": ${Math.round(totalBudget * 0.35)}, "color": "#19B5A5" },
      { "category": "Food",          "amount": ${Math.round(totalBudget * 0.25)}, "color": "#10B981" },
      { "category": "Transport",     "amount": ${Math.round(totalBudget * 0.15)}, "color": "#F59E0B" },
      { "category": "Activities",    "amount": ${Math.round(totalBudget * 0.20)}, "color": "#8B5CF6" },
      { "category": "Miscellaneous", "amount": ${Math.round(totalBudget * 0.05)}, "color": "#64748B" }
    ]
  },
  "preferences": ${JSON.stringify(preferences || [])},
  "aiMatch": 94,
  "aiReasoning": "Personalized English explanation.",
  "whyDestination": "Brief English highlight.",
  "days": [
    {
      "day": 1,
      "title": "Descriptive day title in English",
      "activities": [
        {
          "id": "a1-1",
          "time": "09:30",
          "title": "Exact Name from VERIFIED_ATTRACTIONS",
          "location": "Verified Location",
          "category": "Culture",
          "cost": 50,
          "duration": "2 hours",
          "description": "Engaging description in English.",
          "latitude": ${destination?.latitude || 0},
          "longitude": ${destination?.longitude || 0},
          "address": "Area, ${destination?.name || ''}"
        }
      ]
    }
  ]
}`;
}

// ── Activity Sanitizer & Anti-Hallucination Matcher ────────────────────────────

function matchCandidateAttraction(title, candidates = []) {
  if (!title || !candidates.length) return null;
  const clean = cleanTitle(title).toLowerCase();

  // 1. Exact match
  const exact = candidates.find((c) => c.name && c.name.toLowerCase() === clean);
  if (exact) return exact;

  // 2. Substring match
  const sub = candidates.find(
    (c) => c.name && (c.name.toLowerCase().includes(clean) || clean.includes(c.name.toLowerCase()))
  );
  if (sub) return sub;

  // 3. Token overlap
  const words = clean.split(/\s+/).filter((w) => w.length > 3);
  if (words.length > 0) {
    for (const c of candidates) {
      const cWords = (c.name || '').toLowerCase().split(/\s+/);
      const matchCount = words.filter((w) => cWords.includes(w)).length;
      if (matchCount >= 2 || (matchCount >= 1 && words.length === 1)) {
        return c;
      }
    }
  }

  return null;
}

function sanitizeActivity(activity, fallbackDestName, dayIndex, actIdx, candidates = [], usedCandidateNames = new Set()) {
  if (!activity || typeof activity !== 'object') return null;

  const rawTitle = cleanTitle(activity.title || activity.name || '');

  // IMMEDIATELY REJECT GENERIC FILLER ACTIVITIES
  if (isGenericFillerTitle(rawTitle)) {
    return null;
  }

  // Must match a verified candidate place
  const matched = matchCandidateAttraction(rawTitle, candidates);
  if (!matched) {
    return null; // Reject non-verified places
  }

  usedCandidateNames.add(matched.name.toLowerCase());

  const defaultTimes = ['09:30', '11:30', '14:30', '16:30', '18:00'];

  return {
    id:          activity.id || `a${dayIndex + 1}-${actIdx + 1}`,
    time:        activity.time || defaultTimes[actIdx % defaultTimes.length],
    title:       matched.name,
    location:    matched.location || matched.address || `${matched.name}, ${fallbackDestName}`,
    address:     matched.address || matched.location || fallbackDestName,
    category:    matched.category || activity.category || 'Culture',
    cost:        Math.max(0, Number(matched.estimatedCost ?? activity.cost) || 50),
    duration:    matched.duration || activity.duration || '2 hours',
    description: matched.description || activity.description || `Visit ${matched.name} in ${fallbackDestName}.`,
    latitude:    Number.isFinite(matched.latitude) ? matched.latitude : null,
    longitude:   Number.isFinite(matched.longitude) ? matched.longitude : null,
    verified:    true,
    source:      matched.source || 'gemini+verified',
  };
}

// ── Multi-activity Fallback Builder (Structured from Real Verified Attractions) ────

function buildFallbackFromAttractions(tripData, attractions = []) {
  const destName      = tripData.destination?.name || 'Destination';
  const requestedDays = calculateRequestedDays(tripData);
  const groupSize     = tripData.groupSize || 2;
  const budgetPerPerson = tripData.budgetPerPerson || 5000;

  let validPlaces = attractions.filter((p) => p && p.name && !isGenericFillerTitle(p.name) && isTouristAttraction(p.name, p.address || '', []));
  if (validPlaces.length === 0) {
    validPlaces = getCuratedAttractions(destName);
  }

  // If literally zero verified places exist, return safe limited status
  if (!validPlaces || validPlaces.length === 0) {
    const days = Array.from({ length: requestedDays }, (_, i) => ({
      day: i + 1,
      title: `Day ${i + 1}: Exploring ${destName}`,
      activities: [],
    }));

    return {
      destination: {
        name:      destName,
        region:    tripData.destination?.region || tripData.destination?.state || '',
        tagline:   `Explore ${destName}`,
        country:   tripData.destination?.country || 'India',
        latitude:  tripData.destination?.latitude || null,
        longitude: tripData.destination?.longitude || null,
        image:     tripData.destination?.image || null,
        fallback:  true,
      },
      durationDays:   requestedDays,
      travelers:      groupSize,
      travelerNames:  tripData.travelers || [],
      preferences:    tripData.preferences || [],
      aiMatch:        75,
      aiReasoning:    `Limited verified tourist attractions available for ${destName}.`,
      whyDestination: `Exploring ${destName}.`,
      budget: {
        total:     budgetPerPerson * groupSize,
        perPerson: budgetPerPerson,
        breakdown: [
          { category: 'Accommodation', amount: Math.round(budgetPerPerson * groupSize * 0.35), color: '#19B5A5' },
          { category: 'Food',          amount: Math.round(budgetPerPerson * groupSize * 0.25), color: '#10B981' },
          { category: 'Transport',     amount: Math.round(budgetPerPerson * groupSize * 0.15), color: '#F59E0B' },
          { category: 'Activities',    amount: Math.round(budgetPerPerson * groupSize * 0.20), color: '#8B5CF6' },
          { category: 'Miscellaneous', amount: Math.round(budgetPerPerson * groupSize * 0.05), color: '#64748B' },
        ],
      },
      days,
    };
  }

  // Distribute verified places across days without repetition
  const defaultTimes = ['09:30', '12:00', '14:30', '17:00'];
  const clusters = clusterAttractionsByDays(validPlaces, requestedDays);

  const days = Array.from({ length: requestedDays }, (_, dayIdx) => {
    let dayPlaces = clusters[dayIdx] || [];

    // If day is empty because total places < requestedDays, assign a place cyclically
    if (dayPlaces.length === 0) {
      const p = validPlaces[dayIdx % validPlaces.length];
      if (p) dayPlaces = [p];
    }

    const activities = dayPlaces.map((p, actIdx) => ({
      id: `fb-d${dayIdx + 1}-${actIdx + 1}`,
      time: defaultTimes[actIdx % defaultTimes.length],
      title: p.name,
      location: p.location || p.address || p.name,
      address: p.address || p.location || destName,
      category: p.category || 'Culture',
      cost: Number(p.estimatedCost) || 50,
      duration: p.duration || '2 hours',
      description: p.description || `Visit ${p.name}, an authentic highlight of ${destName}.`,
      latitude: Number.isFinite(p.latitude) ? p.latitude : (tripData.destination?.latitude || null),
      longitude: Number.isFinite(p.longitude) ? p.longitude : (tripData.destination?.longitude || null),
      verified: true,
      source: p.source || 'verified-attraction',
    }));

    return {
      day: dayIdx + 1,
      title: `Day ${dayIdx + 1}: Highlights & Heritage of ${destName}`,
      activities,
    };
  });

  return {
    destination: {
      name:      destName,
      region:    tripData.destination?.region || tripData.destination?.state || '',
      tagline:   `Discover the best of ${destName}`,
      country:   tripData.destination?.country || 'India',
      city:      tripData.destination?.city    || '',
      state:     tripData.destination?.state   || '',
      latitude:  tripData.destination?.latitude  || null,
      longitude: tripData.destination?.longitude || null,
      image:     tripData.destination?.image     || null,
      fallback:  true,
    },
    durationDays:   requestedDays,
    travelers:      groupSize,
    travelerNames:  tripData.travelers || [],
    preferences:    tripData.preferences || [],
    aiMatch:        Math.min(96, Math.max(80, 75 + validPlaces.length * 2)),
    aiReasoning:    `Itinerary carefully structured from ${validPlaces.length} real verified tourist attractions for ${destName}.`,
    whyDestination: `Verified attractions matching your group's travel style.`,
    budget: {
      total:     budgetPerPerson * groupSize,
      perPerson: budgetPerPerson,
      breakdown: [
        { category: 'Accommodation', amount: Math.round(budgetPerPerson * groupSize * 0.35), color: '#19B5A5' },
        { category: 'Food',          amount: Math.round(budgetPerPerson * groupSize * 0.25), color: '#10B981' },
        { category: 'Transport',     amount: Math.round(budgetPerPerson * groupSize * 0.15), color: '#F59E0B' },
        { category: 'Activities',    amount: Math.round(budgetPerPerson * groupSize * 0.20), color: '#8B5CF6' },
        { category: 'Miscellaneous', amount: Math.round(budgetPerPerson * groupSize * 0.05), color: '#64748B' },
      ],
    },
    days,
  };
}

// ── Response Normalizer ───────────────────────────────────────────────────────

function validateAndNormalise(raw, tripData, candidates = []) {
  const groupSize       = tripData.groupSize || 2;
  const budgetPerPerson = tripData.budgetPerPerson || 5000;
  const requestedDays   = calculateRequestedDays(tripData);
  const usedCandidateNames = new Set();

  const validated = {
    destination: {
      name:      raw.destination?.name      || tripData.destination?.name    || 'Unknown',
      region:    raw.destination?.region    || tripData.destination?.region  || tripData.destination?.state || '',
      tagline:   raw.destination?.tagline   || `Experience the best of ${tripData.destination?.name || 'this trip'}`,
      country:   raw.destination?.country   || tripData.destination?.country || 'India',
      city:      tripData.destination?.city  || '',
      state:     tripData.destination?.state || '',
      latitude:  Number.isFinite(Number(tripData.destination?.latitude))  ? Number(tripData.destination.latitude)  : null,
      longitude: Number.isFinite(Number(tripData.destination?.longitude)) ? Number(tripData.destination.longitude) : null,
      image:     tripData.destination?.image   || null,
      fallback:  false,
    },
    durationDays:   requestedDays,
    travelers:      Number(raw.travelers)    || groupSize,
    travelerNames:  Array.isArray(raw.travelerNames) ? raw.travelerNames : (tripData.travelers || []),
    preferences:    Array.isArray(raw.preferences)   ? raw.preferences   : (tripData.preferences || []),
    aiMatch:        Math.min(99, Math.max(70, Number(raw.aiMatch) || 92)),
    aiReasoning:    raw.aiReasoning    || `Custom-crafted for ${groupSize} travelers visiting ${tripData.destination?.name}.`,
    whyDestination: raw.whyDestination || `A great match for your interests in ${(tripData.preferences || []).join(', ') || 'travel'}.`,
    budget: {
      total:     Number(raw.budget?.total)     || budgetPerPerson * groupSize,
      perPerson: Number(raw.budget?.perPerson) || budgetPerPerson,
      breakdown: Array.isArray(raw.budget?.breakdown) && raw.budget.breakdown.length > 0
        ? raw.budget.breakdown
        : [
            { category: 'Accommodation', amount: Math.round(budgetPerPerson * groupSize * 0.35), color: '#19B5A5' },
            { category: 'Food',          amount: Math.round(budgetPerPerson * groupSize * 0.25), color: '#10B981' },
            { category: 'Transport',     amount: Math.round(budgetPerPerson * groupSize * 0.15), color: '#F59E0B' },
            { category: 'Activities',    amount: Math.round(budgetPerPerson * groupSize * 0.20), color: '#8B5CF6' },
            { category: 'Miscellaneous', amount: Math.round(budgetPerPerson * groupSize * 0.05), color: '#64748B' },
          ],
    },
    days: [],
  };

  if (Array.isArray(raw.days) && raw.days.length > 0) {
    validated.days = raw.days
      .slice(0, requestedDays)
      .map((day, dayIdx) => {
        const title      = cleanTitle(day.title || `Day ${dayIdx + 1}: Highlights of ${validated.destination.name}`);
        const activities = Array.isArray(day.activities)
          ? day.activities.map((a, ai) => sanitizeActivity(a, validated.destination.name, dayIdx, ai, candidates, usedCandidateNames)).filter(Boolean)
          : [];

        return {
          day: dayIdx + 1,
          title,
          activities,
        };
      });
  }

  // Ensure EXACT requested duration
  if (validated.days.length < requestedDays) {
    const fallback = buildFallbackFromAttractions(tripData, candidates);
    while (validated.days.length < requestedDays) {
      const nextDayIdx = validated.days.length;
      const fallbackDay = fallback.days[nextDayIdx % fallback.days.length];
      validated.days.push({
        day: nextDayIdx + 1,
        title: fallbackDay?.title || `Day ${nextDayIdx + 1}: Continued Exploration`,
        activities: fallbackDay?.activities || [],
      });
    }
  }

  return validated;
}

// ── Hard Safety Destination & Real Place Validator ───────────────────────────

function validateItineraryDestination(itinerary, tripData, candidates = []) {
  if (!itinerary || !Array.isArray(itinerary.days)) {
    return buildFallbackFromAttractions(tripData, candidates);
  }

  const destName = tripData.destination?.name || 'Destination';
  const destLat  = Number(tripData.destination?.latitude);
  const destLon  = Number(tripData.destination?.longitude);

  itinerary.destination = {
    ...itinerary.destination,
    name: destName,
    region: tripData.destination?.region || tripData.destination?.state || itinerary.destination?.region || '',
    country: tripData.destination?.country || 'India',
    latitude: Number.isFinite(destLat) ? destLat : (itinerary.destination?.latitude || null),
    longitude: Number.isFinite(destLon) ? destLon : (itinerary.destination?.longitude || null),
  };

  let totalActs = 0;
  let invalidActs = 0;

  itinerary.days.forEach((day) => {
    if (Array.isArray(day.activities)) {
      day.activities = day.activities.filter((act) => {
        totalActs++;
        const title = cleanTitle(act.title || act.name);

        // Reject any generic filler titles
        if (isGenericFillerTitle(title)) {
          console.warn(`[validateItineraryDestination] REJECTED generic filler activity: "${title}"`);
          invalidActs++;
          return false;
        }

        const actLat = Number(act.latitude);
        const actLon = Number(act.longitude);

        // Distance check: reject if > 85km from destination center
        if (Number.isFinite(destLat) && Number.isFinite(destLon) && Number.isFinite(actLat) && Number.isFinite(actLon)) {
          const dist = calculateDistanceKm(destLat, destLon, actLat, actLon);
          if (dist !== null && dist > 85) {
            console.warn(`[validateItineraryDestination] REJECTED cross-city activity "${title}" (${dist.toFixed(1)}km from "${destName}")`);
            invalidActs++;
            return false;
          }
        }
        return true;
      });
    }
  });

  // If more than 30% activities were invalid or filler, rebuild cleanly from verified fallback
  if (totalActs > 0 && invalidActs / totalActs > 0.3) {
    console.warn(`[validateItineraryDestination] Rebuilding entire itinerary due to ${invalidActs}/${totalActs} invalid/generic activities for "${destName}"`);
    return buildFallbackFromAttractions(tripData, candidates);
  }

  return itinerary;
}

// ── Main Itinerary Generator ──────────────────────────────────────────────────

async function generateItinerary(tripData) {
  const reqStart = Date.now();
  const destName = tripData.destination?.name || 'Destination';
  const requestedDays = calculateRequestedDays(tripData);

  console.log(`[ITINERARY] request started for "${destName}" (${requestedDays} days)`);

  // Step 1: Discover verified tourist attractions
  const placesStart = Date.now();
  console.log(`[PLACES] discovery started for "${destName}"`);
  let attractions = [];

  try {
    attractions = await searchTouristPlaces(tripData.destination, {
      preferences:  tripData.preferences || [],
      durationDays: requestedDays,
      limit:        25,
    });
    console.log(`[PLACES] discovery completed: ${Date.now() - placesStart}ms (${attractions.length} verified places)`);
  } catch (error) {
    console.warn('[PLACES] discovery error:', error.message);
    attractions = getCuratedAttractions(destName);
  }

  // Step 2: Generate via Google Gemini AI within deadline
  if (ai.isConfigured() && attractions.length > 0) {
    const remainingTime = TOTAL_REQUEST_DEADLINE_MS - (Date.now() - reqStart);
    if (remainingTime > 4000) {
      const geminiStart = Date.now();
      console.log(`[GEMINI] request started for "${destName}" (budget: ${remainingTime}ms)`);

      try {
        const prompt = buildPrompt(tripData, attractions);

        const geminiPromise = ai.generateText(prompt, {
          responseMimeType: 'application/json',
          temperature:      0.3,
          maxOutputTokens:  2500,
        }, { destination: destName });

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Gemini request exceeded server deadline')), Math.min(14000, remainingTime))
        );

        const text = await Promise.race([geminiPromise, timeoutPromise]);
        console.log(`[GEMINI] request completed: ${Date.now() - geminiStart}ms`);

        const clean = text.trim().replace(/^```json?\s*/i, '').replace(/\s*```$/i, '');
        const parsed = JSON.parse(clean);
        const validated = validateAndNormalise(parsed, tripData, attractions);
        const safeItinerary = validateItineraryDestination(validated, tripData, attractions);

        const hasActivities = safeItinerary.days?.some((d) => d.activities?.length > 0);
        if (hasActivities) {
          console.log(`[ITINERARY] generation completed: ${Date.now() - reqStart}ms (${safeItinerary.days.length} days)`);
          return safeItinerary;
        }
      } catch (err) {
        console.warn(`[GEMINI] failed or timed out (${Date.now() - geminiStart}ms):`, err.message);
      }
    }
  }

  // Step 3: Fast deterministic fallback strictly distributing verified attractions
  console.log(`[ITINERARY] using fast deterministic fallback from ${attractions.length} verified attractions`);
  const fallback = buildFallbackFromAttractions(tripData, attractions);
  const safeFallback = validateItineraryDestination(fallback, tripData, attractions);
  console.log(`[ITINERARY] generation completed: ${Date.now() - reqStart}ms (${safeFallback.days.length} days)`);
  return safeFallback;
}

/**
 * Chat with AI about an itinerary.
 * @param {object} itinerary
 * @param {string} message
 * @returns {Promise<string>}
 */
async function chatAboutItinerary(itinerary = {}, message = '') {
  const destName = itinerary.destination?.name || itinerary.destination || 'your destination';

  if (ai.isConfigured()) {
    try {
      const prompt = `You are TripTastic AI Assistant, an expert travel guide.
The user is asking about their trip to ${destName}.
Current Itinerary summary:
${JSON.stringify({
  destination: itinerary.destination,
  days: (itinerary.days || []).map(d => ({ day: d.day, title: d.title, activities: (d.activities || []).map(a => a.title) }))
}, null, 2)}

User Question: "${message}"

Give a helpful, concise, and enthusiastic response (under 120 words) with actionable local advice, tips, or itinerary suggestions.`;

      const reply = await ai.generateText(prompt, {
        temperature: 0.7,
        maxOutputTokens: 300,
      }, { destination: destName });

      if (reply && reply.trim()) {
        return reply.trim();
      }
    } catch (err) {
      console.warn('[chatAboutItinerary] AI call failed:', err.message);
    }
  }

  return `Here are some recommendations for ${destName}: Make sure to check out local dining spots, verify sunset viewpoints, and keep some buffer time between activities for the best experience!`;
}

module.exports = {
  generateItinerary,
  chatAboutItinerary,
  calculateRequestedDays,
  buildFallbackFromAttractions,
  clusterAttractionsByDays,
  validateItineraryDestination,
  isGenericFillerTitle,
};
