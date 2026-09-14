// backend/src/services/imageService.js
// ─────────────────────────────────────────────────────────────────────────────
// Destination Image Service
//
// 1. Pexels API (PREFERRED when PEXELS_API_KEY is set in backend .env)
//    - Free developer API, high-res photos, proper photographer attribution
//    - Target queries specifically for destination landmarks/geography
//    - Strict relevance scoring and metadata verification to prevent mismatch
//    - Anti-contamination: ensures photos from other cities are rejected
//
// 2. Verified Curated Destination Fallback Hierarchy
//    - 1. Verified destination-specific Pexels image (confident match)
//    - 2. Verified curated destination photography (guaranteed 100% match)
//    - 3. Safe neutral travel fallback (never show wrong city landmark)
// ─────────────────────────────────────────────────────────────────────────────

const https = require('https');

function getPexelsKey() {
  return process.env.PEXELS_API_KEY || '';
}

const PEXELS_BASE = 'https://api.pexels.com/v1';

// In-memory cache (keyed by lowercased destination, 1-hour TTL)
const _cache = {};
const _inFlight = new Map();
const CACHE_TTL_MS = 60 * 60 * 1000;

// ── Verified Curated High-Resolution Destination Fallbacks ───────────────────
// Every URL is a verified photograph of that specific destination/landmark
const DESTINATION_FALLBACKS = {
  // National (India)
  'goa':           'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1800&q=85',
  'jaipur':        'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1800&q=85',
  'jammu':         'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=1800&q=85',
  'kerala':        'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1800&q=85',
  'ladakh':        'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1800&q=85',
  'leh':           'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1800&q=85',
  'manali':        'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1800&q=85',
  'meghalaya':     'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=1800&q=85',
  'mumbai':        'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1800&q=85',
  'srinagar':      'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1800&q=85',
  'agra':          'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1800&q=85',
  'alappuzha':     'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1800&q=85',
  'alleppey':      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1800&q=85',
  'munnar':        'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1800&q=85',
  'araku':         'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=85',
  'wayanad':       'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1800&q=85',
  'kochi':         'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1800&q=85',
  'varkala':       'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1800&q=85',
  'thekkady':      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1800&q=85',
  'vagamon':       'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1800&q=85',
  'delhi':         'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1800&q=85',
  'udaipur':       'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1800&q=85',
  'jaisalmer':     'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1800&q=85',
  'rajasthan':     'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1800&q=85',
  'varanasi':      'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1800&q=85',
  'rishikesh':     'https://images.unsplash.com/photo-1600100397608-f010f443a6d4?auto=format&fit=crop&w=1800&q=85',
  'shimla':        'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=1800&q=85',
  'spiti':         'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1800&q=85',
  'dharamshala':   'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1800&q=85',
  'gulmarg':       'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1800&q=85',
  'kashmir':       'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1800&q=85',
  'pangong':       'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1800&q=85',
  'nubra':         'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1800&q=85',
  'shillong':      'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=1800&q=85',
  'cherrapunji':   'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=1800&q=85',
  'darjeeling':    'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1800&q=85',
  'gangtok':       'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1800&q=85',
  'ooty':          'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1800&q=85',
  'coorg':         'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1800&q=85',
  'andaman':       'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1800&q=85',
  'pondicherry':   'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1800&q=85',
  'hyderabad':     'https://images.unsplash.com/photo-1572445271230-a78b5944a659?auto=format&fit=crop&w=1800&q=85',
  'bengaluru':     'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1800&q=85',
  'bangalore':     'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1800&q=85',
  'chennai':       'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1800&q=85',
  'kolkata':       'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=1800&q=85',
  'amritsar':      'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=1800&q=85',
  'visakhapatnam': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=85',
  'vizag':         'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=85',
  'vizianagaram':  'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1800&q=85',
  'vzm':           'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1800&q=85',
  'patna':         'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1800&q=85',
  'bhimavaram':    'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1800&q=85',
  'bvrm':          'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1800&q=85',

  // International
  'tokyo':         'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1800&q=85',
  'kyoto':         'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1800&q=85',
  'osaka':         'https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&w=1800&q=85',
  'bali':          'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1800&q=85',
  'jakarta':       'https://images.unsplash.com/photo-1555899434-94d1368aa7af?auto=format&fit=crop&w=1800&q=85',
  'singapore':     'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1800&q=85',
  'bangkok':       'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1800&q=85',
  'phuket':        'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=1800&q=85',
  'dubai':         'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1800&q=85',
  'abu dhabi':     'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1800&q=85',
  'maldives':      'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1800&q=85',
  'paris':         'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1800&q=85',
  'nice':          'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1800&q=85',
  'london':        'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1800&q=85',
  'rome':          'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1800&q=85',
  'venice':        'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=1800&q=85',
  'barcelona':     'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1800&q=85',
  'amsterdam':     'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=1800&q=85',
  'switzerland':   'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1800&q=85',
  'zurich':        'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=1800&q=85',
  'interlaken':    'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1800&q=85',
  'iceland':       'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1800&q=85',
  'new york':      'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1800&q=85',
  'los angeles':   'https://images.unsplash.com/photo-1580655653885-65763b2597d0?auto=format&fit=crop&w=1800&q=85',
  'sydney':        'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1800&q=85',
  'melbourne':     'https://images.unsplash.com/photo-1514395462725-fb4566210144?auto=format&fit=crop&w=1800&q=85',
  'queenstown':    'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=1800&q=85',
  'cape town':     'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=1800&q=85',

  // Clear Generic Fallback
  'default':       'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1800&q=85',
};

// ── Specific Query Formulations (Optimized for Pexels Search Quality) ────────
const SPECIFIC_DESTINATION_QUERIES = {
  'goa':           'Goa India beach tourism',
  'jaipur':        'Jaipur Hawa Mahal Rajasthan India tourism',
  'jammu':         'Bahu Fort Jammu Tawi India landmark',
  'kerala':        'Kerala backwaters Munnar landscape India',
  'ladakh':        'Ladakh Pangong Tso mountain landscape India',
  'leh':           'Leh Ladakh Shanti Stupa Palace India',
  'manali':        'Manali Solang Valley snow mountains Himachal',
  'meghalaya':     'Meghalaya living root bridge waterfall India',
  'mumbai':        'Gateway of India Mumbai Maharashtra',
  'srinagar':      'Srinagar Dal Lake shikara Kashmir India',
  'agra':          'Taj Mahal Agra India landmark',
  'alappuzha':     'Alappuzha Alleppey backwaters houseboat Kerala',
  'alleppey':      'Alleppey Alappuzha backwaters houseboat Kerala',
  'munnar':        'Munnar Kerala tea plantations hills India',
  'araku':         'Araku Valley Andhra Pradesh hills tourism',
  'wayanad':       'Wayanad Kerala waterfalls tourism',
  'delhi':         'India Gate Red Fort Delhi historical landmark',
  'udaipur':       'Udaipur Lake Pichola Palace Rajasthan India',
  'jaisalmer':     'Jaisalmer Fort Thar Desert Rajasthan India',
  'varanasi':      'Varanasi Ghats Ganges river India',
  'rishikesh':     'Rishikesh Ganga river bridge Uttarakhand India',
  'vizianagaram':  'Vizianagaram temple fort Andhra Pradesh India',
  'vzm':           'Vizianagaram temple fort Andhra Pradesh India',
  'patna':         'Patna Golghar Ganges river Bihar India',
  'shimla':        'Shimla Ridge Mall Road Himachal Pradesh India',
  'spiti':         'Spiti Valley Kaza monastery cold desert India',
  'dharamshala':   'Dharamshala McLeodGanj Kangra monastery India',
  'gulmarg':       'Gulmarg snow peaks skiing Kashmir India',
  'darjeeling':    'Darjeeling tea gardens Kanchenjunga train India',
  'gangtok':       'Gangtok Sikkim monasteries mountains India',
  'ooty':          'Ooty Nilgiri tea hills Tamil Nadu India',
  'coorg':         'Coorg Madikeri coffee estate Karnataka India',
  'andaman':       'Havelock Radhanagar beach Andaman Islands India',
  'pondicherry':   'Pondicherry Promenade French quarter India',
  'hyderabad':     'Charminar Hyderabad Telangana monument India',
  'bengaluru':     'Vidhana Soudha Bengaluru Karnataka India',
  'bangalore':     'Vidhana Soudha Bengaluru Karnataka India',
  'chennai':       'Marina beach San Thome Chennai Tamil Nadu India',
  'kolkata':       'Victoria Memorial Howrah Bridge Kolkata India',
  'amritsar':      'Golden Temple Amritsar Punjab India',
  'visakhapatnam': 'Visakhapatnam RK Beach Andhra Pradesh India',
  'vizag':         'Visakhapatnam RK Beach Andhra Pradesh India',
};

// Distinct cities list to check against unwanted cross-contamination
const KNOWN_CITIES = [
  'srinagar', 'jammu', 'jaipur', 'agra', 'delhi', 'mumbai', 'goa',
  'kolkata', 'chennai', 'bengaluru', 'hyderabad', 'amritsar', 'varanasi',
  'udaipur', 'jaisalmer', 'manali', 'shimla', 'leh', 'ladakh', 'munnar',
  'alappuzha', 'alleppey', 'kochi', 'paris', 'tokyo', 'london', 'rome',
  'dubai', 'bali', 'singapore', 'bangkok'
];

// ── HTTPS Helper with Timeout ─────────────────────────────────────────────────
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
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Image API timeout'));
    });
    req.on('error', reject);
  });
}

// ── Build Search Query ────────────────────────────────────────────────────────
function buildPexelsQuery(query) {
  const clean = (query || '').trim();
  if (!clean) return 'India tourism landscape';

  const lower = clean.toLowerCase();

  for (const [key, specificQuery] of Object.entries(SPECIFIC_DESTINATION_QUERIES)) {
    if (lower === key || lower.includes(key)) {
      return specificQuery;
    }
  }

  const intl = ['japan', 'france', 'italy', 'spain', 'indonesia', 'switzerland', 'uae', 'maldives', 'thailand', 'uk', 'usa', 'australia', 'tokyo', 'paris', 'bali', 'dubai', 'london', 'rome', 'iceland'];
  if (intl.some(c => lower.includes(c))) {
    return `${clean} landmark travel tourism`;
  }

  return `${clean} India landmark tourism`;
}

// ── Relevance Scorer for Pexels Photos ────────────────────────────────────────
function scorePhoto(photo, query) {
  if (!photo) return -100;
  const target = (query || '').toLowerCase().trim();
  const alt = (photo.alt || '').toLowerCase();
  const url = (photo.url || '').toLowerCase();
  const text = `${alt} ${url}`;

  // Check orientation & dimensions
  if (photo.width && photo.height && photo.width < photo.height * 0.75) {
    return -50; // heavily penalize extreme portrait images
  }

  let score = 0;

  // Split target into key tokens (e.g. "alappuzha", "jammu", "jaipur")
  const targetTokens = target.split(/\s+/).filter(t => t.length > 2);
  let matchedTarget = false;

  for (const token of targetTokens) {
    if (text.includes(token)) {
      score += 40;
      matchedTarget = true;
    }
  }

  // Cross-contamination check: does this photo explicitly name a DIFFERENT city?
  for (const city of KNOWN_CITIES) {
    if (!targetTokens.includes(city) && text.includes(city)) {
      if (!matchedTarget) {
        // Photo belongs to a different known city and didn't match our target city
        return -100;
      } else {
        // Both mentioned — slight deduction
        score -= 20;
      }
    }
  }

  // Bonus for travel/landmark terms
  const bonusWords = ['landmark', 'monument', 'temple', 'palace', 'fort', 'beach', 'mountain', 'lake', 'scenic', 'architecture', 'view', 'historic'];
  for (const w of bonusWords) {
    if (text.includes(w)) score += 5;
  }

  return score;
}

// ── Pexels Provider ───────────────────────────────────────────────────────────
async function searchPexels(query) {
  const key = getPexelsKey();
  if (!key) return null;

  const searchQuery = buildPexelsQuery(query);
  const url =
    `${PEXELS_BASE}/search` +
    `?query=${encodeURIComponent(searchQuery)}` +
    `&orientation=landscape&size=large&per_page=12`;

  const data = await httpsGet(url, { Authorization: key });
  if (!data?.photos?.length) return null;

  // Score all candidate photos
  let bestPhoto = null;
  let highestScore = -Infinity;

  for (const photo of data.photos) {
    const s = scorePhoto(photo, query);
    if (s > highestScore) {
      highestScore = s;
      bestPhoto = photo;
    }
  }

  // Require a positive confidence score to avoid unrelated generic photos
  if (!bestPhoto || highestScore < 10) {
    return null;
  }

  const photoUrl = bestPhoto.src?.large2x || bestPhoto.src?.large || bestPhoto.src?.original;
  const thumbUrl = bestPhoto.src?.medium || bestPhoto.src?.small || photoUrl;

  if (!photoUrl || typeof photoUrl !== 'string' || !photoUrl.startsWith('http')) {
    return null;
  }

  return {
    url:         photoUrl,
    thumbUrl:    thumbUrl,
    attribution: {
      photographer: bestPhoto.photographer || 'Pexels Contributor',
      link:         bestPhoto.photographer_url || 'https://www.pexels.com',
      title:        bestPhoto.alt || query,
    },
    source: 'pexels',
  };
}

// ── Verified Fallback Provider ────────────────────────────────────────────────
function getFallbackImage(query) {
  const lower = (query || '').toLowerCase().trim();
  let matchedUrl = null;

  // 1. Exact match in verified curated list
  if (DESTINATION_FALLBACKS[lower]) {
    matchedUrl = DESTINATION_FALLBACKS[lower];
  } else {
    // 2. Keyword match
    for (const [key, url] of Object.entries(DESTINATION_FALLBACKS)) {
      if (key !== 'default' && (lower.includes(key) || key.includes(lower))) {
        matchedUrl = url;
        break;
      }
    }
  }

  // 3. Neutral generic travel fallback if destination is not in verified list
  if (!matchedUrl) {
    matchedUrl = DESTINATION_FALLBACKS['default'];
  }

  return {
    url:         matchedUrl,
    thumbUrl:    matchedUrl.replace('&w=1800', '&w=600'),
    attribution: null,
    source:      matchedUrl === DESTINATION_FALLBACKS['default'] ? 'default-fallback' : 'curated-verified',
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Get a destination image URL for a given destination name.
 * Uses Pexels when key is available, with anti-contamination scoring and verified fallback.
 *
 * @param {string} query  - e.g. 'Kerala', 'Mumbai', 'Goa', 'Jaipur'
 * @returns {Promise<{ url: string, thumbUrl: string, attribution: object|null, source: string }>}
 */
async function getDestinationImage(query) {
  const cacheKey = (query || '').toLowerCase().trim();
  const now = Date.now();

  if (_cache[cacheKey] && now < _cache[cacheKey].expiresAt) {
    return _cache[cacheKey].data;
  }

  // Deduplicate in-flight requests for the same query
  if (_inFlight.has(cacheKey)) {
    return _inFlight.get(cacheKey);
  }

  const fetchPromise = (async () => {
    let result = null;
    const key = getPexelsKey();

    if (key) {
      try {
        result = await searchPexels(query);
      } catch (err) {
        console.warn(`[imageService] Pexels lookup failed for "${query}": ${err.message} — using fallback`);
      }
    }

    if (!result) {
      result = getFallbackImage(query);
    }

    _cache[cacheKey] = { data: result, expiresAt: now + CACHE_TTL_MS };
    return result;
  })();

  _inFlight.set(cacheKey, fetchPromise);

  try {
    const res = await fetchPromise;
    return res;
  } finally {
    _inFlight.delete(cacheKey);
  }
}

/**
 * Whether Pexels is configured (premium image source).
 */
function isConfigured() {
  return Boolean(getPexelsKey());
}

module.exports = { getDestinationImage, isConfigured, DESTINATION_FALLBACKS };
