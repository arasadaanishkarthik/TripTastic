// backend/src/services/weatherService.js
// ─────────────────────────────────────────────────────────────────────────────
// Open-Meteo Weather Service
//
// 100% FREE — no API key, no sign-up, no rate limits for reasonable usage.
// Documentation: https://open-meteo.com/en/docs
//
// Provides:
//   getWeather(lat, lon, days)  → current conditions + daily forecast
//   getWeatherByName(name)      → geocodes via Nominatim first, then fetches weather
//
// WMO weather interpretation codes (weathercode) are decoded into
// human-readable descriptions and icon slugs.
// ─────────────────────────────────────────────────────────────────────────────

const https = require('https');

const OPEN_METEO_BASE  = 'https://api.open-meteo.com/v1';
const NOMINATIM_BASE   = 'https://nominatim.openstreetmap.org';
const REQUEST_TIMEOUT  = 8000;
const USER_AGENT       = 'TripTastic/1.0 (trip-planning-app; contact@triptastic.dev)';

// ── HTTPS helper ──────────────────────────────────────────────────────────────

function httpsGet(url, extraHeaders = {}) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: { Accept: 'application/json', 'User-Agent': USER_AGENT, ...extraHeaders },
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try { resolve(JSON.parse(data)); }
          catch (e) { reject(new Error(`JSON parse error: ${e.message}`)); }
        } else {
          reject(new Error(`HTTP ${res.statusCode} from ${url}`));
        }
      });
    });
    req.setTimeout(REQUEST_TIMEOUT, () => { req.destroy(); reject(new Error('Weather API timeout')); });
    req.on('error', reject);
  });
}

// ── WMO Weather Code decoder ──────────────────────────────────────────────────
// https://open-meteo.com/en/docs#weathervariables

const WMO_CODES = {
  0:  { label: 'Clear sky',           icon: 'sun' },
  1:  { label: 'Mainly clear',        icon: 'sun' },
  2:  { label: 'Partly cloudy',       icon: 'cloud-sun' },
  3:  { label: 'Overcast',            icon: 'cloud' },
  45: { label: 'Foggy',               icon: 'fog' },
  48: { label: 'Icy fog',             icon: 'fog' },
  51: { label: 'Light drizzle',       icon: 'cloud-drizzle' },
  53: { label: 'Drizzle',             icon: 'cloud-drizzle' },
  55: { label: 'Heavy drizzle',       icon: 'cloud-drizzle' },
  61: { label: 'Slight rain',         icon: 'cloud-rain' },
  63: { label: 'Moderate rain',       icon: 'cloud-rain' },
  65: { label: 'Heavy rain',          icon: 'cloud-rain' },
  71: { label: 'Slight snow',         icon: 'cloud-snow' },
  73: { label: 'Moderate snow',       icon: 'cloud-snow' },
  75: { label: 'Heavy snow',          icon: 'cloud-snow' },
  77: { label: 'Snow grains',         icon: 'cloud-snow' },
  80: { label: 'Slight showers',      icon: 'cloud-rain' },
  81: { label: 'Moderate showers',    icon: 'cloud-rain' },
  82: { label: 'Violent showers',     icon: 'cloud-rain' },
  85: { label: 'Snow showers',        icon: 'cloud-snow' },
  86: { label: 'Heavy snow showers',  icon: 'cloud-snow' },
  95: { label: 'Thunderstorm',        icon: 'cloud-lightning' },
  96: { label: 'Thunderstorm w/ hail',icon: 'cloud-lightning' },
  99: { label: 'Thunderstorm w/ hail',icon: 'cloud-lightning' },
};

function decodeWeatherCode(code) {
  return WMO_CODES[code] || { label: 'Unknown', icon: 'cloud' };
}

// ── Core weather fetch ────────────────────────────────────────────────────────

/**
 * Fetch weather forecast from Open-Meteo.
 *
 * @param {number} lat   - Latitude
 * @param {number} lon   - Longitude
 * @param {number} days  - Number of forecast days (1–16)
 * @returns {Promise<WeatherResult>}
 */
async function getWeather(lat, lon, days = 7) {
  const clampedDays = Math.min(16, Math.max(1, Number(days)));

  const url =
    `${OPEN_METEO_BASE}/forecast` +
    `?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weathercode,windspeed_10m,precipitation` +
    `&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,uv_index_max,sunrise,sunset` +
    `&timezone=auto` +
    `&forecast_days=${clampedDays}`;

  console.log(`[weatherService] Fetching weather for (${lat}, ${lon}), ${clampedDays} days`);

  const raw = await httpsGet(url);

  // ── Normalise current conditions ──
  const cur = raw.current || {};
  const curUnits = raw.current_units || {};
  const { label: curLabel, icon: curIcon } = decodeWeatherCode(cur.weathercode);

  const current = {
    temperature:  cur.temperature_2m,
    feelsLike:    cur.apparent_temperature,
    humidity:     cur.relative_humidity_2m,
    windSpeed:    cur.windspeed_10m,
    precipitation:cur.precipitation,
    weatherCode:  cur.weathercode,
    description:  curLabel,
    icon:         curIcon,
    units: {
      temperature:  curUnits.temperature_2m  || '°C',
      windSpeed:    curUnits.windspeed_10m   || 'km/h',
    },
  };

  // ── Normalise daily forecast ──
  const daily = raw.daily || {};
  const dailyKeys = ['weathercode','temperature_2m_max','temperature_2m_min',
                     'precipitation_sum','windspeed_10m_max','uv_index_max','sunrise','sunset'];

  const forecast = (daily.time || []).map((date, i) => {
    const { label, icon } = decodeWeatherCode(daily.weathercode?.[i]);
    return {
      date,
      weatherCode:    daily.weathercode?.[i],
      description:    label,
      icon,
      tempMax:        daily.temperature_2m_max?.[i],
      tempMin:        daily.temperature_2m_min?.[i],
      precipitation:  daily.precipitation_sum?.[i],
      windSpeedMax:   daily.windspeed_10m_max?.[i],
      uvIndex:        daily.uv_index_max?.[i],
      sunrise:        daily.sunrise?.[i],
      sunset:         daily.sunset?.[i],
    };
  });

  return {
    lat:      raw.latitude,
    lon:      raw.longitude,
    timezone: raw.timezone,
    current,
    forecast,
  };
}

// ── Geocode + weather combo ───────────────────────────────────────────────────

/**
 * Geocode a place name via Nominatim then fetch weather.
 * Returns null if the place can't be geocoded.
 *
 * @param {string} placeName - Human-readable place name
 * @param {number} [days=7]
 * @returns {Promise<{ weather: WeatherResult, lat: number, lon: number }|null>}
 */
async function getWeatherByName(placeName, days = 7) {
  const geocodeUrl =
    `${NOMINATIM_BASE}/search` +
    `?q=${encodeURIComponent(placeName)}` +
    `&format=json&limit=1&accept-language=en`;

  const results = await httpsGet(geocodeUrl);
  if (!Array.isArray(results) || results.length === 0) {
    console.warn(`[weatherService] Could not geocode "${placeName}"`);
    return null;
  }

  const lat = parseFloat(results[0].lat);
  const lon = parseFloat(results[0].lon);
  const weather = await getWeather(lat, lon, days);

  return { weather, lat, lon, resolvedName: results[0].display_name };
}

module.exports = { getWeather, getWeatherByName, decodeWeatherCode };
