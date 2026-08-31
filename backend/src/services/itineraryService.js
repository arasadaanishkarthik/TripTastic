// backend/src/services/itineraryService.js
// ─────────────────────────────────────────────────────────────────────────────
// TripTastic AI Itinerary Generator
//
// Primary path : Gemini → JSON → validated itinerary
// Fallback path: Geoapify POIs → structured multi-activity itinerary
// Last resort  : local destination-specific attraction bank
// ─────────────────────────────────────────────────────────────────────────────

const ai = require('./aiClient');
const { buildFallbackItinerary } = require('./destinationAttractions');
const { searchTouristPlaces } = require('./placesService');

const MODEL_NAME = ai.getModelName();

const VALID_CATEGORIES = [
  'Food', 'Nature', 'Adventure', 'Culture', 'Photography',
  'Transport', 'Relaxation', 'Shopping',
];

// Patterns that indicate a non-tourist location slipped through
const FORBIDDEN_ACTIVITY_PATTERNS = [
  /\brailway station\b/i,
  /\bbus station\b/i,
  /\bairport\b/i,
  /\bmetro station\b/i,
  /\bjunction\b/i,
  /\bcentral station\b/i,
  /\bcity centre\b/i,
  /\bdowntown\b/i,
  /\bgeneric city\b/i,
  /\bgeocode result\b/i,
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function hasForbiddenText(value) {
  if (!value) return false;
  return FORBIDDEN_ACTIVITY_PATTERNS.some((p) => p.test(String(value)));
}

function isTourismSafeActivity(title, location) {
  if (!title || !String(title).trim()) return false;
  if (!location || !String(location).trim()) return false;
  if (hasForbiddenText(`${title} ${location}`)) return false;
  return true;
}

function cleanTitle(value) {
  return String(value || '').replace(/^\s+|\s+$/g, '');
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

// ── Gemini prompt ─────────────────────────────────────────────────────────────

function formatAttractionList(attractions) {
  if (!Array.isArray(attractions) || attractions.length === 0) {
    return 'No Geoapify POI list is available. Use well-known, verifiable tourist attractions for this destination only — never invent place names.';
  }
  return attractions
    .slice(0, 15)
    .map((p) => `- ${p.name} (${p.category || 'attraction'}${p.address ? `, ${p.address}` : ''})`)
    .join('\n');
}

function buildPrompt(tripData, attractions = []) {
  const { destination, dates, groupSize, travelers, budgetPerPerson, preferences, mode } = tripData;
  const daysCount      = calculateRequestedDays(tripData);
  const startDate      = dates?.start || '';
  const endDate        = dates?.end   || '';
  const totalBudget    = (budgetPerPerson || 5000) * (groupSize || 2);
  const travelerList   = (travelers || []).join(', ') || `${groupSize || 2} travelers`;
  const preferenceStr  = (preferences || []).join(', ') || 'sightseeing, food, culture';
  const attractionText = formatAttractionList(attractions);

  return `You are TripTastic AI, an expert Indian travel planner creating personalised itineraries.

Generate a COMPLETE ${daysCount}-day itinerary for ${destination?.name || 'the destination'}, ${destination?.region || ''}, ${destination?.country || 'India'}.

TRIP DETAILS:
- Destination: ${destination?.name}, ${destination?.region || destination?.state || ''}, ${destination?.country || 'India'}
- Coordinates: ${destination?.latitude ?? 'N/A'}, ${destination?.longitude ?? 'N/A'}
- Travel mode: ${mode === 'international' ? 'International' : 'Domestic India'}
- Dates: ${startDate || 'flexible'} → ${endDate || 'flexible'} (${daysCount} days)
- Group: ${groupSize || 2} people — ${travelerList}
- Budget: ₹${totalBudget.toLocaleString()} total (₹${(budgetPerPerson || 5000).toLocaleString()} per person)
- Interests: ${preferenceStr}

REAL ATTRACTIONS FROM GEOAPIFY (use these as priority locations):
${attractionText}

MANDATORY REQUIREMENTS — failure to follow ANY of these will cause rejection:

1. DAYS: Generate EXACTLY ${daysCount} days. Do not return fewer. Do not truncate.
2. ACTIVITIES PER DAY: Each day MUST have 4–6 activities. Never 1 or 2. A full travel day includes: morning attraction + mid-morning attraction + lunch (local food) + afternoon attraction + evening attraction/sunset spot + dinner. Omit only if a day is explicitly a transit day.
3. REAL PLACES ONLY: Use the Geoapify attractions above as the primary source. You may supplement with other well-known, real attractions for this destination. NEVER invent attraction names. NEVER use railway stations, airports, bus terminals, or generic city centres as activities.
4. ENGLISH ONLY: Write ALL text — titles, descriptions, location names, day names, reasoning — in English. No other language.
5. UNIQUE ACTIVITIES: Do not repeat the same location across multiple days unless genuinely warranted.
6. COORDINATES: Provide accurate latitude/longitude for every activity. Use the coordinates from the Geoapify list where available.

RESPONSE FORMAT — return ONLY valid JSON, no markdown, no code fences:

{
  "destination": {
    "name": "string",
    "region": "string",
    "tagline": "string (max 8 words, in English)",
    "country": "string"
  },
  "durationDays": ${daysCount},
  "travelers": ${groupSize || 2},
  "travelerNames": ${JSON.stringify(travelers || [])},
  "budget": {
    "total": number,
    "perPerson": number,
    "breakdown": [
      { "category": "Accommodation", "amount": number, "color": "#19B5A5" },
      { "category": "Food",          "amount": number, "color": "#10B981" },
      { "category": "Transport",     "amount": number, "color": "#F59E0B" },
      { "category": "Activities",    "amount": number, "color": "#8B5CF6" },
      { "category": "Miscellaneous", "amount": number, "color": "#64748B" }
    ]
  },
  "preferences": ${JSON.stringify(preferences || [])},
  "aiMatch": number,
  "aiReasoning": "string in English",
  "whyDestination": "string in English",
  "days": [
    {
      "day": number,
      "title": "string (descriptive day title in English)",
      "activities": [
        {
          "id": "string",
          "time": "HH:MM",
          "title": "string (real place name in English)",
          "location": "string (real place name or area)",
          "category": "Food|Nature|Adventure|Culture|Photography|Transport|Relaxation|Shopping",
          "cost": number,
          "duration": "string",
          "description": "string (in English, 1-2 sentences about the experience)",
          "latitude": number,
          "longitude": number,
          "address": "string"
        }
      ]
    }
  ]
}`;
}

// ── Activity sanitizer ────────────────────────────────────────────────────────

function sanitizeActivity(activity, fallbackDestName, dayIndex, actIdx) {
  if (!activity || typeof activity !== 'object') return null;

  const title    = cleanTitle(activity.title || '');
  const location = cleanTitle(activity.location || activity.address || fallbackDestName || '');
  const address  = cleanTitle(activity.address || location || fallbackDestName || '');
  const category = VALID_CATEGORIES.includes(activity.category) ? activity.category : 'Culture';

  if (!isTourismSafeActivity(title, location)) return null;

  return {
    id:          activity.id || `a${dayIndex + 1}-${actIdx + 1}`,
    time:        activity.time || ['08:00', '10:00', '12:00', '14:00', '16:30', '18:30'][actIdx % 6],
    title,
    location,
    category,
    cost:        Math.max(0, Number(activity.cost) || 0),
    duration:    activity.duration || '1.5 hours',
    description: String(activity.description || '').trim() || `Explore ${title} — a highlight of ${location}.`,
    latitude:    Number.isFinite(Number(activity.latitude))  ? Number(activity.latitude)  : null,
    longitude:   Number.isFinite(Number(activity.longitude)) ? Number(activity.longitude) : null,
    address,
  };
}

// ── Response normalizer ───────────────────────────────────────────────────────

function validateAndNormalise(raw, tripData) {
  const groupSize       = tripData.groupSize || 2;
  const budgetPerPerson = tripData.budgetPerPerson || 5000;
  const requestedDays   = calculateRequestedDays(tripData);

  const validated = {
    destination: {
      name:      raw.destination?.name      || tripData.destination?.name    || 'Unknown',
      region:    raw.destination?.region    || tripData.destination?.region  || '',
      tagline:   raw.destination?.tagline   || 'An unforgettable journey',
      country:   raw.destination?.country   || tripData.destination?.country || 'India',
      city:      tripData.destination?.city  || '',
      state:     tripData.destination?.state || '',
      latitude:  Number.isFinite(Number(tripData.destination?.latitude))  ? Number(tripData.destination.latitude)  : null,
      longitude: Number.isFinite(Number(tripData.destination?.longitude)) ? Number(tripData.destination.longitude) : null,
      image:     tripData.destination?.image   || null,
      fallback:  tripData.destination?.fallback || null,
    },
    durationDays:   requestedDays,
    travelers:      Number(raw.travelers)    || groupSize,
    travelerNames:  Array.isArray(raw.travelerNames) ? raw.travelerNames : (tripData.travelers || []),
    preferences:    Array.isArray(raw.preferences)   ? raw.preferences   : (tripData.preferences || []),
    aiMatch:        Math.min(98, Math.max(50, Number(raw.aiMatch) || 85)),
    aiReasoning:    raw.aiReasoning    || 'Personalised for your group.',
    whyDestination: raw.whyDestination || 'A strong match for your travel style.',
    budget: {
      total:     Number(raw.budget?.total)     || budgetPerPerson * groupSize,
      perPerson: Number(raw.budget?.perPerson) || budgetPerPerson,
      breakdown: Array.isArray(raw.budget?.breakdown) ? raw.budget.breakdown : [],
    },
    days: [],
  };

  if (Array.isArray(raw.days) && raw.days.length > 0) {
    validated.days = raw.days
      .slice(0, requestedDays)
      .map((day, dayIdx) => {
        const title      = cleanTitle(day.title || `Day ${dayIdx + 1}`);
        const activities = Array.isArray(day.activities)
          ? day.activities.map((a, ai) => sanitizeActivity(a, validated.destination.name, dayIdx, ai)).filter(Boolean)
          : [];

        if (!activities.length) return null;

        return {
          day:        Number(day.day) || (dayIdx + 1),
          title,
          activities,
        };
      })
      .filter(Boolean);
  }

  return validated;
}

// ── Multi-activity fallback builder ──────────────────────────────────────────

function buildFallbackFromAttractions(tripData, attractions = []) {
  const destName     = tripData.destination?.name || 'This Destination';
  const requestedDays = calculateRequestedDays(tripData);
  const groupSize    = tripData.groupSize || 2;

  // Filter out forbidden places
  const validPlaces = attractions.filter(
    (p) => p && p.name && !hasForbiddenText(`${p.name} ${p.address || ''} ${p.category || ''}`)
  );

  const dayCount = Math.max(1, requestedDays);

  // Time slots for a full day
  const TIME_SLOTS = ['08:30', '10:30', '13:00', '15:00', '17:30', '19:30'];
  const MEAL_ACTIVITIES = [
    { title: `Local Breakfast in ${destName}`, category: 'Food', cost: 300, duration: '45 min', description: `Start your day with a traditional local breakfast — a great way to taste authentic flavours of ${destName}.` },
    { title: `Lunch at a Local Restaurant`, category: 'Food', cost: 400, duration: '1 hour', description: `Enjoy fresh local cuisine at a popular restaurant near your current location.` },
    { title: `Dinner & Evening Stroll`, category: 'Food', cost: 600, duration: '1.5 hours', description: `Wind down the day with dinner at a recommended local eatery followed by a relaxed evening stroll.` },
  ];

  const days = Array.from({ length: dayCount }, (_, dayIdx) => {
    const activities = [];

    if (validPlaces.length > 0) {
      // 1. Breakfast
      activities.push({
        id: `fallback-d${dayIdx + 1}-breakfast`,
        time: '08:00',
        title: `Local Breakfast in ${destName}`,
        location: destName,
        category: 'Food',
        cost: 250,
        duration: '45 min',
        description: `Start your day with a traditional local breakfast — a great way to taste authentic flavours of ${destName}.`,
        latitude: tripData.destination?.latitude || null,
        longitude: tripData.destination?.longitude || null,
        address: destName,
      });

      // 2. Morning POI
      const poi1Idx = (dayIdx * 3) % validPlaces.length;
      const place1 = validPlaces[poi1Idx];
      activities.push({
        id: `fallback-d${dayIdx + 1}-poi1`,
        time: '09:30',
        title: place1.name,
        location: place1.name,
        category: VALID_CATEGORIES.includes(place1.category) ? place1.category : 'Culture',
        cost: Number(place1.estimatedCost) || 200,
        duration: '2 hours',
        description: place1.description || `Explore ${place1.name}, a notable attraction in ${destName}.`,
        latitude: Number.isFinite(Number(place1.latitude)) ? Number(place1.latitude) : (tripData.destination?.latitude || null),
        longitude: Number.isFinite(Number(place1.longitude)) ? Number(place1.longitude) : (tripData.destination?.longitude || null),
        address: place1.address || place1.name,
      });

      // 3. Lunch
      activities.push({
        id: `fallback-d${dayIdx + 1}-lunch`,
        time: '12:30',
        title: `Lunch at a Local Restaurant`,
        location: destName,
        category: 'Food',
        cost: 400,
        duration: '1 hour',
        description: `Enjoy fresh regional cuisine at a popular eatery near ${place1.name}.`,
        latitude: tripData.destination?.latitude || null,
        longitude: tripData.destination?.longitude || null,
        address: destName,
      });

      // 4. Afternoon POI
      const poi2Idx = (dayIdx * 3 + 1) % validPlaces.length;
      const place2 = validPlaces[poi2Idx];
      activities.push({
        id: `fallback-d${dayIdx + 1}-poi2`,
        time: '14:30',
        title: place2.name,
        location: place2.name,
        category: VALID_CATEGORIES.includes(place2.category) ? place2.category : 'Nature',
        cost: Number(place2.estimatedCost) || 200,
        duration: '2 hours',
        description: place2.description || `Visit ${place2.name} to experience the local environment and scenery.`,
        latitude: Number.isFinite(Number(place2.latitude)) ? Number(place2.latitude) : (tripData.destination?.latitude || null),
        longitude: Number.isFinite(Number(place2.longitude)) ? Number(place2.longitude) : (tripData.destination?.longitude || null),
        address: place2.address || place2.name,
      });

      // 5. Late Afternoon / Evening POI
      const poi3Idx = (dayIdx * 3 + 2) % validPlaces.length;
      const place3 = validPlaces[poi3Idx];
      activities.push({
        id: `fallback-d${dayIdx + 1}-poi3`,
        time: '17:00',
        title: place3.name,
        location: place3.name,
        category: VALID_CATEGORIES.includes(place3.category) ? place3.category : 'Culture',
        cost: Number(place3.estimatedCost) || 150,
        duration: '1.5 hours',
        description: place3.description || `Enjoy the evening ambience and sights around ${place3.name}.`,
        latitude: Number.isFinite(Number(place3.latitude)) ? Number(place3.latitude) : (tripData.destination?.latitude || null),
        longitude: Number.isFinite(Number(place3.longitude)) ? Number(place3.longitude) : (tripData.destination?.longitude || null),
        address: place3.address || place3.name,
      });

      // 6. Dinner & Night Walk
      activities.push({
        id: `fallback-d${dayIdx + 1}-dinner`,
        time: '19:30',
        title: `Dinner & Evening Stroll`,
        location: destName,
        category: 'Food',
        cost: 600,
        duration: '1.5 hours',
        description: `Wind down the day with dinner at a recommended local restaurant followed by an evening stroll.`,
        latitude: tripData.destination?.latitude || null,
        longitude: tripData.destination?.longitude || null,
        address: destName,
      });
    } else {
      // No POIs at all — honest single-card per day
      activities.push({
        id: `fallback-d${dayIdx + 1}-nodata`,
        time: '09:00',
        title: 'No verified attractions found',
        location: destName,
        category: 'Culture',
        cost: 0,
        duration: '1 hour',
        description: `No verified POI data was returned for ${destName}. Please retry itinerary generation to fetch real attractions from Geoapify.`,
        latitude: tripData.destination?.latitude || null,
        longitude: tripData.destination?.longitude || null,
        address: destName,
      });
    }

    return {
      day: dayIdx + 1,
      title: `Day ${dayIdx + 1}: Explore ${destName}`,
      activities,
    };
  });

  return {
    destination: {
      name:      destName,
      region:    tripData.destination?.region || tripData.destination?.state || '',
      tagline:   `Explore the best of ${destName}`,
      country:   tripData.destination?.country || 'India',
      city:      tripData.destination?.city    || '',
      state:     tripData.destination?.state   || '',
      latitude:  tripData.destination?.latitude  || null,
      longitude: tripData.destination?.longitude || null,
      image:     tripData.destination?.image     || null,
      fallback:  true,
    },
    durationDays:   dayCount,
    travelers:      groupSize,
    travelerNames:  tripData.travelers || [],
    preferences:    tripData.preferences || [],
    aiMatch:        80,
    aiReasoning:    validPlaces.length > 0
      ? `Fallback itinerary built from ${validPlaces.length} verified Geoapify POIs for ${destName}.`
      : `Gemini was unavailable and no Geoapify POIs were returned for ${destName}. Retry to fetch real attractions.`,
    whyDestination: `Itinerary grounded in real, verified ${destName} attractions.`,
    budget: {
      total:     (tripData.budgetPerPerson || 5000) * groupSize,
      perPerson: tripData.budgetPerPerson || 5000,
      breakdown: [
        { category: 'Accommodation', amount: Math.round((tripData.budgetPerPerson || 5000) * groupSize * 0.35), color: '#19B5A5' },
        { category: 'Food',          amount: Math.round((tripData.budgetPerPerson || 5000) * groupSize * 0.20), color: '#10B981' },
        { category: 'Transport',     amount: Math.round((tripData.budgetPerPerson || 5000) * groupSize * 0.15), color: '#F59E0B' },
        { category: 'Activities',    amount: Math.round((tripData.budgetPerPerson || 5000) * groupSize * 0.25), color: '#8B5CF6' },
        { category: 'Miscellaneous', amount: Math.round((tripData.budgetPerPerson || 5000) * groupSize * 0.05), color: '#64748B' },
      ],
    },
    days,
  };
}

// ── Main generator ────────────────────────────────────────────────────────────

async function generateItinerary(tripData) {
  let attractions = [];
  const requestedDays = calculateRequestedDays(tripData);

  // Step 1: Fetch real POIs from Geoapify
  try {
    attractions = await searchTouristPlaces(tripData.destination, {
      preferences:  tripData.preferences || [],
      radiusMeters: 40000,
      limit:        30,
    });
  } catch (error) {
    console.warn('[itineraryService] Geoapify lookup failed:', error.message);
    attractions = [];
  }

  // Step 2: Try AI generation (Groq / Gemini)
  const MAX_AI_ATTEMPTS = 2;
  for (let attempt = 1; attempt <= MAX_AI_ATTEMPTS; attempt++) {
    try {
      const prompt = buildPrompt(tripData, attractions);
      console.log(`[itineraryService] AI attempt ${attempt}/${MAX_AI_ATTEMPTS} for "${tripData.destination?.name}" (${requestedDays} days) using ${MODEL_NAME}`);

      const text = await ai.generateText(prompt, {
        responseMimeType: 'application/json',
        temperature:      0.65,
        topK:             40,
        topP:             0.95,
        maxOutputTokens:  3500,
      }, { destination: tripData.destination?.displayName || tripData.destination?.name });

      console.log(`[itineraryService] AI responded (${text.length} chars)`);

      let parsed;
      try {
        const clean = text.trim().replace(/^```json?\s*/i, '').replace(/\s*```$/i, '');
        parsed = JSON.parse(clean);
      } catch (err) {
        console.error('[itineraryService] AI JSON parse failed:', text.slice(0, 300));
        throw new ai.AIError('PARSE_ERROR', 'AI returned an unexpected response format. Please try again.', err);
      }

      const validated = validateAndNormalise(parsed, tripData);

      // Enforce day count
      if (!validated.days?.length || !validated.days.some((d) => d.activities?.length > 0)) {
        throw new ai.AIError('PARSE_ERROR', 'AI returned an empty itinerary. Please try again.', null);
      }

      // If AI returned fewer days than requested, pad with fallback days
      if (validated.days.length < requestedDays && attractions.length > 0) {
        console.warn(`[itineraryService] AI returned ${validated.days.length} days; padding to ${requestedDays} with fallback days.`);
        const fallback = buildFallbackFromAttractions(tripData, attractions);
        while (validated.days.length < requestedDays) {
          const dayIdx = validated.days.length;
          validated.days.push(fallback.days[dayIdx % fallback.days.length] || {
            day:        dayIdx + 1,
            title:      `Day ${dayIdx + 1}: Continued Exploration`,
            activities: fallback.days[0]?.activities || [],
          });
        }
      } else if (validated.days.length < requestedDays) {
        throw new ai.AIError('PARSE_ERROR', `AI returned ${validated.days.length} days; expected ${requestedDays}.`, null);
      }

      validated.durationDays = requestedDays;
      validated.days = validated.days.slice(0, requestedDays).map((d, i) => ({ ...d, day: i + 1 }));

      return validated;

    } catch (err) {
      if ((err?.name === 'AIError' || err?.name === 'GeminiError' || err?.name === 'GroqError') && err.code === 'RATE_LIMIT' && attempt < MAX_AI_ATTEMPTS) {
        console.warn(`[itineraryService] AI rate-limited (attempt ${attempt}); waiting 2s before retry…`);
        await new Promise((r) => setTimeout(r, 2000));
        continue;
      }

      if (err?.name === 'AIError' || err?.name === 'GeminiError' || err?.name === 'GroqError') {
        console.warn(`[itineraryService] AI unavailable (${err.code}); using fallback itinerary.`);
        break; // exit AI loop, go to fallback
      }

      throw err; // unexpected error
    }
  }

  // Step 3: Fallback — use Geoapify POIs if available
  if (attractions.length > 0) {
    console.log(`[itineraryService] Building multi-activity fallback from ${attractions.length} POIs`);
    return buildFallbackFromAttractions(tripData, attractions);
  }

  // Step 4: Last resort — local destination attraction bank
  console.warn(`[itineraryService] No Geoapify POIs available; using local attraction bank`);
  return buildFallbackItinerary(tripData);
}

// ── Chat assistant ────────────────────────────────────────────────────────────

async function chatAboutItinerary(itinerary, userMessage) {
  const destName   = itinerary?.destination?.name || 'your destination';
  const days       = itinerary?.durationDays || '?';
  const prefs      = (itinerary?.preferences || []).join(', ') || 'sightseeing, food';
  const budget     = itinerary?.budget?.perPerson ? `₹${itinerary.budget.perPerson.toLocaleString()} per person` : 'moderate budget';

  // Summarize the itinerary for context
  const daySummary = Array.isArray(itinerary?.days)
    ? itinerary.days.slice(0, 5).map((d) => {
        const acts = (d.activities || []).slice(0, 4).map((a) => a.title).join(', ');
        return `Day ${d.day} (${d.title}): ${acts}`;
      }).join('\n')
    : 'No day details available.';

  const systemContext = `You are TripTastic AI, an expert travel assistant helping a group plan their trip to ${destName}.

CURRENT ITINERARY CONTEXT:
- Destination: ${destName}
- Duration: ${days} days
- Preferences: ${prefs}
- Budget: ${budget}
- Travelers: ${itinerary?.travelers || 2} people

DAY-BY-DAY SUMMARY:
${daySummary}

INSTRUCTIONS:
- Answer the user's question concisely and helpfully in 3-5 sentences.
- Focus on practical, actionable advice specific to ${destName}.
- Suggest only real, verified attractions. Never invent place names.
- If asked to modify the itinerary, explain what you'd change and why.
- Use English only. Keep a friendly, knowledgeable tone.
- Never suggest railway stations, airports, or bus terminals as tourist spots.`;

  try {
    const text = await ai.generateText(
      `${systemContext}\n\nUser request: ${userMessage}`,
      { temperature: 0.7, maxOutputTokens: 512 },
      { destination: destName }
    );
    const cleaned = text
      .replace(/<think>[\s\S]*?<\/think>/gi, '')
      .replace(/^\*\*Reasoning\*\*[\s\S]*?\n\n/gi, '')
      .trim();
    return cleaned || text.trim();
  } catch (err) {
    if (err?.name === 'AIError' || err?.name === 'GeminiError' || err?.name === 'GroqError') {
      console.warn(`[itineraryService] Chat fallback triggered for ${err.code}.`);
      return `Happy to help with your ${destName} trip! For the best experience, I'd recommend focusing on the iconic local attractions, trying authentic regional cuisine, and allowing some flexibility in your schedule for spontaneous discoveries. Feel free to ask specific questions about your itinerary.`;
    }
    throw err;
  }
}

module.exports = { generateItinerary, chatAboutItinerary };
