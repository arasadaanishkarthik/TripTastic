import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Compass, Sun, Moon, Menu, X, Sparkles } from 'lucide-react';
import { useTravelMode } from '../context/TravelModeContext';
import { useTheme } from '../context/ThemeContext';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { travelMode, setTravelMode } = useTravelMode();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg/85 backdrop-blur-xl border-b border-border transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 xs:gap-3 group shrink-0">
          <div className="w-8 h-8 xs:w-10 xs:h-10 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-heading font-black text-sm xs:text-lg shadow-lg shadow-primary/25 group-hover:scale-105 transition-transform">
            TT
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-extrabold text-base xs:text-lg text-text-main tracking-tight uppercase leading-none">
              TripTastic
            </span>
            <span className="text-[9px] xs:text-[10px] text-accent font-semibold tracking-widest uppercase mt-0.5">
              AI Group Travel
            </span>
          </div>
        </Link>

        {/* National / International Toggle (Desktop & Tablet) */}
        <div className="hidden md:flex items-center p-1 rounded-2xl bg-surface border border-border shadow-inner">
          <button
            onClick={() => setTravelMode('national')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all duration-300 ${
              travelMode === 'national'
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'text-text-secondary hover:text-text-main'
            }`}
          >
            🇮🇳 National
          </button>
          <button
            onClick={() => setTravelMode('international')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all duration-300 ${
              travelMode === 'international'
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'text-text-secondary hover:text-text-main'
            }`}
          >
            🌎 International
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-8 text-xs font-heading font-bold uppercase tracking-widest text-text-secondary">
          <Link to="/" className="hover:text-primary transition-colors">Explore</Link>
          <button onClick={() => navigate('/plan')} className="hover:text-primary transition-colors">Plan a Trip</button>
          <Link to="/itinerary" className="hover:text-primary transition-colors">My Trips</Link>
          <button onClick={() => navigate('/plan/generate')} className="hover:text-primary transition-colors flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-accent" /> AI Assistant
          </button>
        </div>

        {/* Right Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-text-main hover:border-primary transition-colors shadow-sm"
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-primary" />}
          </button>

          <button
            onClick={() => navigate('/plan')}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-primary to-accent text-white font-heading font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
          >
            Start Planning
          </button>
        </div>

        {/* Mobile Menu & Theme Buttons */}
        <div className="flex md:hidden items-center gap-1.5">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl bg-surface border border-border flex items-center justify-center text-text-main"
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-primary" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-9 h-9 rounded-xl bg-surface border border-border flex items-center justify-center text-text-main"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-surface/98 backdrop-blur-2xl border-b border-border p-5 shadow-2xl space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Mode Switcher */}
          <div className="flex rounded-xl bg-bg p-1 border border-border mb-3">
            <button
              onClick={() => { setTravelMode('national'); setMobileMenuOpen(false); }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-colors ${travelMode === 'national' ? 'bg-primary text-white' : 'text-text-secondary'}`}
            >
              🇮🇳 National
            </button>
            <button
              onClick={() => { setTravelMode('international'); setMobileMenuOpen(false); }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-colors ${travelMode === 'international' ? 'bg-primary text-white' : 'text-text-secondary'}`}
            >
              🌎 International
            </button>
          </div>

          <div className="flex flex-col space-y-2 text-sm font-heading font-bold uppercase tracking-wider">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-2 text-text-main hover:text-primary rounded-lg transition-colors">
              Explore
            </Link>
            <button onClick={() => { navigate('/plan'); setMobileMenuOpen(false); }} className="py-2.5 px-2 text-left text-text-main hover:text-primary rounded-lg transition-colors">
              Plan a Trip
            </button>
            <Link to="/itinerary" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-2 text-text-main hover:text-primary rounded-lg transition-colors">
              My Trips
            </Link>
            <button onClick={() => { navigate('/plan/generate'); setMobileMenuOpen(false); }} className="py-2.5 px-2 text-left text-accent hover:text-primary rounded-lg transition-colors flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> AI Assistant
            </button>
          </div>

          <button
            onClick={() => { navigate('/plan'); setMobileMenuOpen(false); }}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-primary to-accent text-white font-heading font-bold text-xs uppercase tracking-wider text-center shadow-lg"
          >
            Start Planning
          </button>
        </div>
      )}
    </nav>
  );
};