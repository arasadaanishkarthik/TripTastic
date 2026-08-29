import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { useTripPlanner } from '../../context/TripPlannerContext';

export const DatesStep = () => {
  const { trip, updateTrip } = useTripPlanner();

  const calculateDays = (start, end) => {
    if (!start || !end) return 0;
    const diffTime = new Date(end) - new Date(start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const days = calculateDays(trip.dates.start, trip.dates.end);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-text-main uppercase tracking-tight">
          When are you going?
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Select your travel window to calculate duration.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Start Date
          </label>
          <input
            type="date"
            value={trip.dates.start}
            onChange={(e) => updateTrip({ dates: { ...trip.dates, start: e.target.value } })}
            className="w-full p-3 rounded-xl bg-surface border border-border text-text-main text-sm focus:outline-none focus:border-primary"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            End Date
          </label>
          <input
            type="date"
            min={trip.dates.start || undefined}
            value={trip.dates.end}
            onChange={(e) => updateTrip({ dates: { ...trip.dates, end: e.target.value } })}
            className="w-full p-3 rounded-xl bg-surface border border-border text-text-main text-sm focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {days > 0 && (
        <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-center gap-3">
          <Clock className="w-5 h-5 text-primary" />
          <div>
            <span className="text-xs text-text-secondary uppercase block">Calculated Duration</span>
            <span className="font-heading font-bold text-sm text-text-main">
              {days} Nights • {days + 1} Days
            </span>
          </div>
        </div>
      )}
    </div>
  );
};