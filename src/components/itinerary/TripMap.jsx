import React, { useState, useEffect, useRef } from 'react';
import { MapPin, ExternalLink, Layers } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { geocodeLocation } from '../../services/api';

// ── Fix Leaflet's broken default icon paths in bundlers ───────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom teal marker icon matching TripTastic's primary colour
const createPrimaryIcon = (label) =>
  L.divIcon({
    html: `
      <div style="
        background: #19B5A5;
        width: 32px; height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        display:flex; align-items:center; justify-content:center;
      ">
        <span style="transform:rotate(45deg); color:white; font-size:11px; font-weight:700;">${label}</span>
      </div>
    `,
    className: '',
    iconSize:    [32, 32],
    iconAnchor:  [16, 32],
    popupAnchor: [0, -36],
  });

// ── Auto-fit map to markers ───────────────────────────────────────────────────
function AutoFitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView([points[0].lat, points[0].lon], 10);
    } else {
      const bounds = L.latLngBounds(points.map(p => [p.lat, p.lon]));
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [map, points]);
  return null;
}

// ── Geocode a place name through the backend location provider ────────────────
async function geocodePlace(name) {
  try {
    const location = await geocodeLocation(name);
    if (!location?.latitude || !location?.longitude) return null;
    return { lat: location.latitude, lon: location.longitude, name: location.displayName || name };
  } catch {
    return null;
  }
}

// ── OpenStreetMap tile layers (free, no API key required) ─────────────────────
// Keep the existing toggle, but use the reliable OSM provider for both modes.
// Carto's dark endpoint can return an API-key error in development.
const DARK_TILE  = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const LIGHT_TILE = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const TILE_ATTR  = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

// ── Main component ────────────────────────────────────────────────────────────
export const TripMap = ({ itinerary }) => {
  const [points,  setPoints]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const geocodeCache = useRef({});

  // Collect unique location names from all days' activities
  useEffect(() => {
    const uniqueLocations = [];
    const seen = new Set();

    (itinerary?.days || []).forEach((day) => {
      (day.activities || []).forEach((act) => {
        const loc = act.location?.trim();
        if (loc && !seen.has(loc.toLowerCase())) {
          seen.add(loc.toLowerCase());
          uniqueLocations.push({
            name: loc,
            day: day.day,
            actTitle: act.title || act.name,
            lat: act.latitude,
            lon: act.longitude,
          });
        }
      });
    });

    if (uniqueLocations.length === 0) {
      // Fall back to destination name only
      const dest = itinerary?.destination?.name;
      if (dest) {
        uniqueLocations.push({
          name: dest,
          day: 1,
          actTitle: dest,
          lat: itinerary?.destination?.latitude,
          lon: itinerary?.destination?.longitude,
        });
      }
    }

    // Geocode all locations (with cache)
    let cancelled = false;
    setLoading(true);

    Promise.all(
      uniqueLocations.map(async (loc) => {
        if (Number.isFinite(Number(loc.lat)) && Number.isFinite(Number(loc.lon))) {
          return {
            name: loc.name,
            lat: Number(loc.lat),
            lon: Number(loc.lon),
            day: loc.day,
            actTitle: loc.actTitle,
          };
        }
        if (geocodeCache.current[loc.name]) {
          return { ...geocodeCache.current[loc.name], day: loc.day, actTitle: loc.actTitle };
        }
        const result = await geocodePlace(loc.name);
        if (result) {
          geocodeCache.current[loc.name] = result;
          return { ...result, day: loc.day, actTitle: loc.actTitle };
        }
        return null;
      })
    ).then((results) => {
      if (!cancelled) {
        setPoints(results.filter(Boolean).slice(0, 15)); // cap at 15 markers
        setLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, [itinerary]);

  const destName = itinerary?.destination?.name || 'Destination';

  return (
    <div className="rounded-3xl bg-surface border border-border shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-accent block mb-1">
            Route Visualization
          </span>
          <h3 className="font-heading font-extrabold text-xl sm:text-2xl uppercase text-text-main">
            Journey Map
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {/* Toggle dark/light tiles */}
          <button
            onClick={() => setDarkMode(d => !d)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-border/40 hover:bg-border text-text-secondary hover:text-text-main text-xs font-medium transition-colors"
            title="Toggle map style"
          >
            <Layers className="w-3.5 h-3.5" />
            {darkMode ? 'Light' : 'Dark'}
          </button>
          <a
            href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(destName)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            Full Map
          </a>
        </div>
      </div>

      {/* Map container */}
      <div className="relative w-full" style={{ height: '340px' }}>
        {loading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#07111F]/90 gap-3">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-text-secondary font-medium">Plotting your journey…</span>
          </div>
        )}

        <MapContainer
          center={[20.5937, 78.9629]}
          zoom={5}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
          scrollWheelZoom={false}
          className="z-0"
        >
          <TileLayer
            key={darkMode ? 'dark' : 'light'}
            url={darkMode ? DARK_TILE : LIGHT_TILE}
            attribution={TILE_ATTR}
            subdomains="abcd"
          />

          {points.map((pt, idx) => (
            <Marker
              key={`${pt.lat}-${pt.lon}-${idx}`}
              position={[pt.lat, pt.lon]}
              icon={createPrimaryIcon(pt.day)}
            >
              <Popup>
                <div className="text-sm font-semibold text-gray-800 min-w-[120px]">
                  <div className="text-xs text-gray-500 mb-0.5">Day {pt.day}</div>
                  <div>{pt.actTitle}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{pt.name}</div>
                </div>
              </Popup>
            </Marker>
          ))}

          {points.length > 0 && <AutoFitBounds points={points} />}
        </MapContainer>

        {/* Attribution overlay */}
        {!loading && points.length === 0 && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#07111F]/80 gap-2">
            <MapPin className="w-8 h-8 text-primary opacity-50" />
            <span className="text-xs text-text-secondary">No locations could be plotted</span>
          </div>
        )}
      </div>

      {/* Footer: legend */}
      {!loading && points.length > 0 && (
        <div className="px-6 py-4 border-t border-border flex flex-wrap gap-x-4 gap-y-2">
          {itinerary?.days?.slice(0, 6).map((day) => (
            <div key={day.day} className="flex items-center gap-1.5 text-xs text-text-secondary">
              <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center font-bold text-[9px] flex-shrink-0">
                {day.day}
              </span>
              <span className="truncate max-w-[120px]">{day.title}</span>
            </div>
          ))}
          <span className="ml-auto text-[10px] text-text-secondary/50">© OpenStreetMap contributors</span>
        </div>
      )}
    </div>
  );
};