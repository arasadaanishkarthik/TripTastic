import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, RefreshCw, BookmarkCheck } from 'lucide-react';
import { ItineraryHero } from '../components/itinerary/ItineraryHero';
import { TripSummary } from '../components/itinerary/TripSummary';
import { DaySelector } from '../components/itinerary/DaySelector';
import { DayTimeline } from '../components/itinerary/DayTimeline';
import { AIInsight } from '../components/itinerary/AIInsight';
import { GroupPreferences } from '../components/itinerary/GroupPreferences';
import { TripMap } from '../components/itinerary/TripMap';
import { BudgetOverview } from '../components/itinerary/BudgetOverview';
import { CostSplit } from '../components/itinerary/CostSplit';
import { GroupMembers } from '../components/itinerary/GroupMembers';
import { ItineraryActions } from '../components/itinerary/ItineraryActions';
import { EditItineraryModal } from '../components/itinerary/EditItineraryModal';
import { ShareTripPanel } from '../components/itinerary/ShareTripPanel';
import { TripAIChat } from '../components/itinerary/TripAIChat';
import { WeatherWidget } from '../components/itinerary/WeatherWidget';
import { CurrencyWidget } from '../components/itinerary/CurrencyWidget';
import { DEFAULT_ITINERARY } from '../data/itineraryData';
import { useTripPlanner } from '../context/TripPlannerContext';
import { Button } from '../components/Button';

export const Itinerary = () => {
  const { trip, resetTrip, generatedItinerary, setGeneratedItinerary } = useTripPlanner();
  const navigate = useNavigate();

  const [activeDay, setActiveDay] = useState(1);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // ── Prefer AI-generated data; fall back to DEFAULT_ITINERARY ───────────────
  const itinerary = (() => {
    if (generatedItinerary) {
      // Merge AI data with any destination image info from the planner context
      return {
        ...generatedItinerary,
        destination: {
          ...generatedItinerary.destination,
          image:    trip?.destination?.image    || generatedItinerary.destination?.image    || DEFAULT_ITINERARY.destination.image,
          fallback: trip?.destination?.fallback || generatedItinerary.destination?.fallback || DEFAULT_ITINERARY.destination.fallback,
        },
      };
    }

    // No AI result — build from planner context + DEFAULT_ITINERARY fallback
    return {
      ...DEFAULT_ITINERARY,
      destination: trip?.destination?.name
        ? {
            name:     trip.destination.name,
            region:   trip.destination.region,
            tagline:  trip.destination.description || "An Unforgettable Journey",
            image:    trip.destination.image    || DEFAULT_ITINERARY.destination.image,
            fallback: DEFAULT_ITINERARY.destination.fallback,
          }
        : DEFAULT_ITINERARY.destination,
      travelers:     trip?.groupSize      || DEFAULT_ITINERARY.travelers,
      travelerNames: trip?.travelers?.length ? trip.travelers : DEFAULT_ITINERARY.travelerNames,
      preferences:   trip?.preferences?.length ? trip.preferences : DEFAULT_ITINERARY.preferences,
      budget: {
        total:      trip?.budgetPerPerson ? trip.budgetPerPerson * (trip?.groupSize || 4) : DEFAULT_ITINERARY.budget.total,
        perPerson:  trip?.budgetPerPerson || DEFAULT_ITINERARY.budget.perPerson,
        breakdown:  DEFAULT_ITINERARY.budget.breakdown,
      },
    };
  })();

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setIsRegenerating(false);
    }, 1200);
  };

  const currentDayData = itinerary.days.find((d) => d.day === activeDay) || itinerary.days[0];

  return (
    <div className="min-h-screen bg-bg text-text-main flex flex-col relative">
      {/* Top Navbar */}
      <header className="w-full py-4 px-6 border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white font-heading font-black text-sm shadow-md">
            TT
          </div>
          <span className="font-heading font-extrabold text-lg text-text-main tracking-tight uppercase">
            TripTastic <span className="text-primary font-medium text-xs lowercase">dashboard</span>
          </span>
          {generatedItinerary && (
            <span className="hidden sm:flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              <Sparkles className="w-2.5 h-2.5" /> AI Generated
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <ItineraryActions
            onEdit={() => setIsEditOpen(true)}
            onRegenerate={handleRegenerate}
            onShare={() => setIsShareOpen(true)}
            isRegenerating={isRegenerating}
          />

          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              resetTrip();
              navigate('/');
            }}
            icon={ArrowLeft}
          >
            Home
          </Button>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Destination Hero */}
        <ItineraryHero itinerary={itinerary} />

        {/* Trip Summary Metrics */}
        <TripSummary itinerary={itinerary} />

        {/* Two-Column Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left / Center: Itinerary Timeline */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface p-4 sm:p-6 rounded-3xl border border-border shadow-xl">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent block">
                  Daily Schedule
                </span>
                <h2 className="font-heading font-extrabold text-xl uppercase text-text-main">
                  Your Journey
                </h2>
              </div>
              <DaySelector days={itinerary.days} activeDay={activeDay} setActiveDay={setActiveDay} />
            </div>

            <div className="bg-surface p-6 sm:p-8 rounded-3xl border border-border shadow-xl">
              <DayTimeline dayData={currentDayData} />
            </div>

            {/* Route Map */}
            <TripMap itinerary={itinerary} />
          </div>

          {/* Right Column: AI Insights, Weather, Currency, Budget, Cost Split & Group */}
          <div className="lg:col-span-4 space-y-6 sticky top-24">
            <AIInsight itinerary={itinerary} />
            <WeatherWidget destination={itinerary.destination} />
            <CurrencyWidget itinerary={itinerary} />
            <GroupPreferences itinerary={itinerary} />
            <BudgetOverview itinerary={itinerary} />
            <CostSplit itinerary={itinerary} />
            <GroupMembers itinerary={itinerary} />
          </div>
        </div>
      </main>

      {/* Floating AI Assistant Chat */}
      <TripAIChat itinerary={itinerary} />

      {/* Modals */}
      <EditItineraryModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        itinerary={itinerary}
        onSave={(updated) => setGeneratedItinerary(updated)}
      />
      <ShareTripPanel isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
    </div>
  );
};