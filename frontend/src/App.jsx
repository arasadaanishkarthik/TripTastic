import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom'; // Changed BrowserRouter to HashRouter
import { useLenis } from './hooks/useLenis';
import { useIntroExperience } from './hooks/useIntroExperience';
import { IntroExperience } from './components/intro/IntroExperience';
import { Navbar } from './components/Navbar';
import { HeroSection } from './sections/HeroSection';
import { DiscoverIndiaSection } from './sections/DiscoverIndiaSection';
import { GroupPlanningSection } from './sections/GroupPlanningSection';
import { HowItWorksSection } from './sections/HowItWorksSection';
import PlanTrip from './pages/PlanTrip';
import { GenerateItinerary } from './pages/GenerateItinerary';
import { Itinerary } from './pages/Itinerary';
import { TravelModeProvider } from './context/TravelModeContext';
import { TripPlannerProvider } from './context/TripPlannerContext';

function HomePage() {
  useLenis();
  const { showIntro, introStep, skipIntro, isComplete } = useIntroExperience();

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text-main transition-colors duration-300 relative">
      <IntroExperience
        isVisible={showIntro}
        introStep={introStep}
        onSkip={skipIntro}
      />

      <Navbar />

      <main className="flex-grow">
        <HeroSection isIntroComplete={isComplete} />
        <DiscoverIndiaSection />
        <GroupPlanningSection />
        <HowItWorksSection />
      </main>

      <footer className="py-10 border-t border-border bg-surface text-center text-xs text-text-secondary">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-medium">
            TripTastic — <span className="text-text-main">Explore More. Worry Less.</span>
          </p>
          <p>© {new Date().getFullYear()} TripTastic Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <TravelModeProvider>
        <TripPlannerProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/plan" element={<PlanTrip />} />
            <Route path="/plan/generate" element={<GenerateItinerary />} />
            <Route path="/itinerary" element={<Itinerary />} />
          </Routes>
        </TripPlannerProvider>
      </TravelModeProvider>
    </Router>
  );
}