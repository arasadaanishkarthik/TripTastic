import React from 'react';
import { Wallet, Sparkles } from 'lucide-react';
import { PREFERENCE_OPTIONS } from '../../data/destinations';
import { useTripPlanner } from '../../context/TripPlannerContext';

export const ReviewStep = () => {
  const { trip, updateTrip } = useTripPlanner();

  const totalBudget = trip.budgetPerPerson * trip.groupSize;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-text-main uppercase tracking-tight">
          Your trip is taking shape.
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Review your parameters and set your per-person budget.
        </p>
      </div>

      {/* Budget Configuration */}
      <div className="p-5 rounded-2xl bg-surface border border-border space-y-3">
        <div className="flex items-center gap-2 text-primary font-heading font-bold text-sm uppercase">
          <Wallet className="w-4 h-4" />
          <span>What's your budget per person?</span>
        </div>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary font-bold">₹</span>
          <input
            type="number"
            step="500"
            min="1000"
            value={trip.budgetPerPerson}
            onChange={(e) => updateTrip({ budgetPerPerson: Number(e.target.value) })}
            className="w-full pl-8 pr-4 py-3 rounded-xl bg-black/5 dark:bg-white/5 border border-border text-text-main font-heading font-bold text-lg focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex justify-between text-xs text-text-secondary pt-1">
          <span>Per person: ₹{trip.budgetPerPerson.toLocaleString()}</span>
          <span className="font-bold text-primary">Total Group Budget: ₹{totalBudget.toLocaleString()}</span>
        </div>
      </div>

      {/* Summary Card */}
      <div className="p-6 rounded-3xl bg-surface border border-primary/30 shadow-xl space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-2 text-xs font-semibold text-accent uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Trip Summary</span>
        </div>

        <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-text-main uppercase">
          {trip.destination.name || 'Select Destination'}
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-border">
            <span className="text-[10px] text-text-secondary uppercase block">Dates</span>
            <span className="font-bold text-text-main">{trip.dates.start || 'TBD'} → {trip.dates.end || 'TBD'}</span>
          </div>
          <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-border">
            <span className="text-[10px] text-text-secondary uppercase block">Travelers</span>
            <span className="font-bold text-text-main">{trip.groupSize} Members</span>
          </div>
          <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-border">
            <span className="text-[10px] text-text-secondary uppercase block">Budget</span>
            <span className="font-bold text-primary">₹{trip.budgetPerPerson.toLocaleString()} / person</span>
          </div>
        </div>

        <div>
          <span className="text-[11px] font-semibold text-text-secondary uppercase block mb-2">Interests</span>
          <div className="flex flex-wrap gap-1.5">
            {trip.preferences.map((pId) => {
              const p = PREFERENCE_OPTIONS.find((opt) => opt.id === pId);
              if (!p) return null;
              return (
                <span key={p.id} className="px-2.5 py-1 rounded-lg bg-primary/15 text-primary text-xs font-semibold">
                  {p.icon} {p.label}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};