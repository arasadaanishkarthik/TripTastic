import React, { useState } from 'react';
import { Users, Plus, X, User } from 'lucide-react';
import { useTripPlanner } from '../../context/TripPlannerContext';

export const GroupStep = () => {
  const { trip, updateTrip } = useTripPlanner();
  const [newFriend, setNewFriend] = useState('');

  const handleSizeChange = (delta) => {
    const newSize = Math.max(1, Math.min(12, trip.groupSize + delta));
    updateTrip({ groupSize: newSize });
  };

  const handleAddTraveler = (e) => {
    e.preventDefault();
    if (!newFriend.trim()) return;
    updateTrip({ travelers: [...trip.travelers, newFriend.trim()] });
    setNewFriend('');
  };

  const handleRemoveTraveler = (index) => {
    const updated = trip.travelers.filter((_, i) => i !== index);
    updateTrip({ travelers: updated });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-text-main uppercase tracking-tight">
          Who's coming?
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Build the crew you'll share the journey with.
        </p>
      </div>

      {/* Group Size Stepper */}
      <div className="p-4 rounded-2xl bg-surface border border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-primary" />
          <span className="font-heading font-bold text-sm text-text-main uppercase">Total Travelers</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSizeChange(-1)}
            className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 border border-border flex items-center justify-center font-bold hover:bg-primary/20 transition-colors"
          >
            −
          </button>
          <span className="font-heading font-extrabold text-base text-primary w-6 text-center">
            {trip.groupSize}
          </span>
          <button
            onClick={() => handleSizeChange(1)}
            className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 border border-border flex items-center justify-center font-bold hover:bg-primary/20 transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Traveler List Management */}
      <div className="space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary block">
          Crew Members
        </span>

        <form onSubmit={handleAddTraveler} className="flex gap-2">
          <input
            type="text"
            value={newFriend}
            onChange={(e) => setNewFriend(e.target.value)}
            placeholder="Add friend's name..."
            className="flex-grow p-3 rounded-xl bg-surface border border-border text-text-main text-sm focus:outline-none focus:border-primary"
          />
          <button
            type="submit"
            className="px-4 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </form>

        <div className="space-y-2 pt-2">
          {trip.travelers.map((traveler, index) => (
            <div
              key={index}
              className="p-3 rounded-xl bg-surface border border-border flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4 text-primary" />
                <span className="font-heading font-bold text-text-main uppercase">{traveler}</span>
                {index === 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold">
                    You
                  </span>
                )}
              </div>
              {index > 0 && (
                <button
                  onClick={() => handleRemoveTraveler(index)}
                  className="p-1 rounded-lg text-text-secondary hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};