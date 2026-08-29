import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { AIPlanningVisual } from '../components/itinerary/AIPlanningVisual';
import { GenerationSteps } from '../components/itinerary/GenerationSteps';
import { JourneyRoute } from '../components/itinerary/JourneyRoute';
import { GenerationTripSummary } from '../components/itinerary/GenerationTripSummary';
import { AI_INSIGHTS } from '../data/generationData';
import { useTripPlanner } from '../context/TripPlannerContext';
import { Button } from '../components/Button';

export const GenerateItinerary = () => {
  const { trip } = useTripPlanner();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [insightIndex, setInsightIndex] = useState(0);

  // Fallback check if user visits directly without data
  const hasData = trip && trip.destination && trip.destination.name;

  useEffect(() => {
    if (!hasData) return;

    // Simulate step progression over ~6 seconds
    const stepInterval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < 6) return prev + 1;
        clearInterval(stepInterval);
        setIsCompleted(true);
        return 6;
      });
    }, 900);

    // Rotate insights
    const insightInterval = setInterval(() => {
      setInsightIndex((prev) => (prev + 1) % AI_INSIGHTS.length);
    }, 2000);

    return () => {
      clearInterval(stepInterval);
      clearInterval(insightInterval);
    };
  }, [hasData]);

  // Auto-navigate to /itinerary after success reveal
  useEffect(() => {
    if (isCompleted) {
      const timer = setTimeout(() => {
        navigate('/itinerary');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isCompleted, navigate]);

  if (!hasData) {
    return (
      <div className="min-h-screen bg-bg text-text-main flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h2 className="font-heading font-extrabold text-2xl uppercase">Your trip isn't ready yet.</h2>
        <p className="text-xs text-text-secondary max-w-sm">
          Please complete the trip planner wizard first so TripTastic AI has your destination and preferences.
        </p>
        <Button variant="primary" size="md" onClick={() => navigate('/plan')}>
          Back to Planner →
        </Button>
      </div>
    );
  }

  const daysCount = trip.dates.start && trip.dates.end ? Math.ceil((new Date(trip.dates.end) - new Date(trip.dates.start)) / (1000 * 60 * 60 * 24)) : 4;

  return (
    <div className="min-h-screen bg-bg text-text-main flex flex-col items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Atmospheric Background Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-3xl w-full mx-auto text-center relative z-10 space-y-8">
        <AnimatePresence mode="wait">
          {!isCompleted ? (
            <motion.div
              key="generating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <AIPlanningVisual />

              {/* Rotating Insight Text */}
              <div className="h-8 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={insightIndex}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="text-xs sm:text-sm font-semibold text-text-secondary italic"
                  >
                    "{AI_INSIGHTS[insightIndex]}"
                  </motion.p>
                </AnimatePresence>
              </div>

              <JourneyRoute />

              <GenerationSteps activeStep={activeStep} />

              <div className="pt-4">
                <GenerationTripSummary trip={trip} />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="completed"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="p-8 sm:p-12 rounded-3xl bg-surface/95 backdrop-blur-2xl border border-primary/40 shadow-2xl space-y-6 max-w-lg mx-auto"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500 mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent block mb-1">
                  ✦ SYNTHESIS COMPLETE
                </span>
                <h3 className="font-heading font-extrabold text-3xl text-text-main uppercase">
                  Your Journey Is Ready.
                </h3>
              </div>

              <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-border text-xs">
                <div>
                  <span className="text-[10px] text-text-secondary uppercase block">Duration</span>
                  <span className="font-bold text-text-main">{daysCount} Days</span>
                </div>
                <div>
                  <span className="text-[10px] text-text-secondary uppercase block">Travelers</span>
                  <span className="font-bold text-text-main">{trip.groupSize} Members</span>
                </div>
                <div>
                  <span className="text-[10px] text-text-secondary uppercase block">Per Person</span>
                  <span className="font-bold text-primary">₹{trip.budgetPerPerson?.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/itinerary')}
                  icon={ArrowRight}
                  className="w-full justify-center"
                >
                  View My Itinerary
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};