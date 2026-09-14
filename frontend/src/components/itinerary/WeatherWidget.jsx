import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, Wind, Droplets, Eye, Thermometer } from 'lucide-react';
import { getWeather, getWeatherByPlace } from '../../services/api';

// ── WMO icon → Lucide icon mapping ────────────────────────────────────────────
const ICON_MAP = {
  'sun':              Sun,
  'cloud-sun':        Cloud,
  'cloud':            Cloud,
  'fog':              Cloud,
  'cloud-drizzle':    CloudRain,
  'cloud-rain':       CloudRain,
  'cloud-snow':       CloudSnow,
  'cloud-lightning':  CloudLightning,
};

function WeatherIcon({ icon, className = 'w-5 h-5' }) {
  const Icon = ICON_MAP[icon] || Cloud;
  return <Icon className={className} />;
}

// ── Day strip card ────────────────────────────────────────────────────────────
function ForecastDay({ day }) {
  const dateLabel = new Date(day.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' });
  return (
    <div className="flex flex-col items-center gap-1 min-w-[52px] text-center">
      <span className="text-[10px] text-text-secondary font-semibold uppercase">{dateLabel}</span>
      <WeatherIcon icon={day.icon} className="w-4 h-4 text-primary" />
      <span className="text-[11px] font-bold text-text-main">{Math.round(day.tempMax)}°</span>
      <span className="text-[10px] text-text-secondary">{Math.round(day.tempMin)}°</span>
    </div>
  );
}

// ── Main widget ───────────────────────────────────────────────────────────────
export const WeatherWidget = ({ destination }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const placeName = destination?.name || destination?.city || '';

  useEffect(() => {
    if (!placeName) { setLoading(false); return; }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const hasCoordinates = Number.isFinite(Number(destination?.latitude))
      && Number.isFinite(Number(destination?.longitude));
    const weatherRequest = hasCoordinates
      ? getWeather(Number(destination.latitude), Number(destination.longitude), 7)
      : getWeatherByPlace(placeName, 7);

    weatherRequest
      .then((data) => {
        if (!cancelled) {
          setWeather(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.warn('[WeatherWidget] fetch failed:', err.message);
          setError('Weather data unavailable');
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [placeName]);

  // ── Loading skeleton ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="p-6 rounded-3xl bg-surface border border-border shadow-xl space-y-4 animate-pulse">
        <div className="h-4 w-28 bg-border rounded-full" />
        <div className="h-12 w-24 bg-border rounded-xl" />
        <div className="flex gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 w-12 bg-border rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // ── Error state ─────────────────────────────────────────────────────────────
  if (error || !weather) {
    return (
      <div className="p-6 rounded-3xl bg-surface border border-border shadow-xl">
        <span className="text-[10px] font-bold uppercase tracking-widest text-accent block mb-2">
          ☁ Weather
        </span>
        <p className="text-xs text-text-secondary">
          {error || 'Weather data is not available for this destination.'}
        </p>
      </div>
    );
  }

  const { current, forecast } = weather;

  return (
    <div className="p-6 rounded-3xl bg-surface border border-border shadow-xl space-y-5 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/8 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-accent block">
            ☁ Live Weather
          </span>
          <h4 className="font-heading font-bold text-sm uppercase text-text-main">
            {placeName}
          </h4>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <WeatherIcon icon={current.icon} className="w-6 h-6 text-primary" />
        </div>
      </div>

      {/* Current temperature */}
      <div className="flex items-end gap-3">
        <span className="font-heading font-extrabold text-5xl text-text-main leading-none">
          {Math.round(current.temperature)}°
        </span>
        <div className="pb-1 space-y-0.5">
          <p className="text-sm font-semibold text-text-main">{current.description}</p>
          <p className="text-xs text-text-secondary">Feels like {Math.round(current.feelsLike)}°C</p>
        </div>
      </div>

      {/* Current conditions row */}
      <div className="grid grid-cols-3 gap-3 py-3 border-t border-b border-border">
        <div className="flex flex-col items-center gap-1 text-center">
          <Wind className="w-3.5 h-3.5 text-text-secondary" />
          <span className="text-[11px] font-bold text-text-main">{current.windSpeed}</span>
          <span className="text-[10px] text-text-secondary">km/h</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <Droplets className="w-3.5 h-3.5 text-text-secondary" />
          <span className="text-[11px] font-bold text-text-main">{current.humidity}%</span>
          <span className="text-[10px] text-text-secondary">Humidity</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <Thermometer className="w-3.5 h-3.5 text-text-secondary" />
          <span className="text-[11px] font-bold text-text-main">{current.precipitation}</span>
          <span className="text-[10px] text-text-secondary">mm rain</span>
        </div>
      </div>

      {/* 7-day forecast strip */}
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary block mb-3">
          7-Day Forecast
        </span>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {forecast.map((day) => (
            <ForecastDay key={day.date} day={day} />
          ))}
        </div>
      </div>

      {/* Attribution */}
      <p className="text-[9px] text-text-secondary/50 text-right">
        Powered by Open-Meteo (free)
      </p>
    </div>
  );
};
