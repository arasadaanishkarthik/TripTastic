// src/components/planner/PlannerNavigation.jsx
import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '../Button';
import { useTripPlanner } from '../../context/TripPlannerContext';

export const PlannerNavigation = ({ onNext, onPrev }) => {
  const { trip } = useTripPlanner();
  const isLast = trip.step === 5;

  return (
    <div className="flex items-center justify-between pt-6 border-t border-border mt-8">
      {trip.step > 1 ? (
        <Button variant="secondary" size="md" onClick={onPrev} icon={ArrowLeft} className="flex-row-reverse">
          Back
        </Button>
      ) : (
        <div />
      )}

      <Button variant="gradient" size="md" onClick={onNext} icon={ArrowRight}>
        {isLast ? 'Generate My Itinerary' : 'Continue'}
      </Button>
    </div>
  );
};