import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookmarkCheck, X } from 'lucide-react';
import { useTripPlanner } from '../../context/TripPlannerContext';

export const PlannerHeader = () => {
  const navigate = useNavigate();
  const { trip } = useTripPlanner();

  const handleSaveAndExit = () => {
    localStorage.setItem('triptastic_trip_draft', JSON.stringify(trip));
    navigate('/');
  };

  return (
    <header className="w-full py-4 px-6 border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white font-heading font-black text-sm shadow-md">
          TT
        </div>
        <span className="font-heading font-extrabold text-lg text-text-main tracking-tight uppercase">
          TripTastic <span className="text-primary font-medium text-xs lowercase">planner</span>
        </span>
      </div>

      <button
        onClick={handleSaveAndExit}
        className="px-3.5 py-1.5 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-primary/10 border border-border text-xs font-semibold uppercase tracking-wider text-text-secondary hover:text-primary transition-all flex items-center gap-1.5"
      >
        <BookmarkCheck className="w-4 h-4 text-primary" />
        <span>Save & Exit</span>
      </button>
    </header>
  );
};