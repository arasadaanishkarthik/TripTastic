// src/components/planner/PreferencesStep.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowUp, ArrowDown } from 'lucide-react';
import { PREFERENCE_OPTIONS } from '../../data/destinations';
import { useTripPlanner } from '../../context/TripPlannerContext';

export const PreferencesStep = () => {
  const { trip, updateTrip } = useTripPlanner();

  const togglePreference = (id) => {
    const exists = trip.preferences.includes(id);
    let updated;
    let updatedRanking = [...trip.preferenceRanking];

    if (exists) {
      updated = trip.preferences.filter((p) => p !== id);
      updatedRanking = updatedRanking.filter((p) => p !== id);
    } else {
      updated = [...trip.preferences, id];
      updatedRanking = [...updatedRanking, id];
    }

    updateTrip({ preferences: updated, preferenceRanking: updatedRanking });
  };

  const moveRanking = (index, direction) => {
    const ranking = [...trip.preferenceRanking];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= ranking.length) return;

    const temp = ranking[index];
    ranking[index] = ranking[targetIndex];
    ranking[targetIndex] = temp;

    updateTrip({ preferenceRanking: ranking });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-text-main uppercase tracking-tight">
          What does your group love?
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Choose interests and prioritize what matters most.
        </p>
      </div>

      {/* Interest Selection Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {PREFERENCE_OPTIONS.map((opt) => {
          const isSelected = trip.preferences.includes(opt.id);
          return (
            <motion.button
              key={opt.id}
              type="button"
              onClick={() => togglePreference(opt.id)}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className={`p-4 rounded-2xl border text-center transition-colors flex flex-col items-center justify-center gap-2 ${
                isSelected
                  ? 'bg-primary/15 border-primary shadow-md ring-2 ring-primary/20 text-text-main'
                  : 'bg-surface hover:bg-black/5 dark:hover:bg-white/5 border-border text-text-secondary'
              }`}
            >
              <motion.span
                animate={isSelected ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                transition={{ duration: 0.35 }}
                className="text-2xl"
              >
                {opt.icon}
              </motion.span>
              <span className="font-heading font-bold text-xs uppercase">{opt.label}</span>
              {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
            </motion.button>
          );
        })}
      </div>

      {/* Preference Ranking */}
      {trip.preferenceRanking.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-border">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary block">
            What matters most? (Priority Order)
          </span>
          <div className="space-y-2">
            {trip.preferenceRanking.map((prefId, index) => {
              const pref = PREFERENCE_OPTIONS.find((p) => p.id === prefId);
              if (!pref) return null;

              return (
                <motion.div
                  key={pref.id}
                  layout
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className="p-3 rounded-xl bg-surface border border-border flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-primary">0{index + 1}</span>
                    <span>{pref.icon}</span>
                    <span className="font-heading font-bold text-text-main uppercase">{pref.label}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => moveRanking(index, -1)}
                      disabled={index === 0}
                      className="p-1 rounded bg-black/5 dark:bg-white/5 disabled:opacity-30"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => moveRanking(index, 1)}
                      disabled={index === trip.preferenceRanking.length - 1}
                      className="p-1 rounded bg-black/5 dark:bg-white/5 disabled:opacity-30"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};