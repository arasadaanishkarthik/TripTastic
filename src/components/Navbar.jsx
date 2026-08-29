import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Sun, Moon, Menu, X, Sparkles, User } from 'lucide-react';
import { useTravelMode } from '../context/TravelModeContext';
import { useTheme } from '../context/ThemeContext';

export const Navbar = () => {
  const navigate = useNavigate();
  const { travelMode, setTravelMode } = useTravelMode();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-xl border-b border-border transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-heading font-black text-lg shadow-lg shadow-primary/25 group-hover:scale-105 transition-transform">
            TT
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-extrabold text-lg text-text-main tracking-tight uppercase leading-none">
              TripTastic
            </span>
            <span className="text-[10px] text-accent font-semibold tracking-widest uppercase mt-0.5">
              AI Group Travel
            </span>
          </div>
        </Link>

        {/* National / International Toggle */}
        <div className="hidden md:flex items-center p-1 rounded-2xl bg-surface border border-border shadow-inner">
          <button
            onClick={() => setTravelMode('national')}
            className={`px-4 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all duration-300 ${
              travelMode === 'national'
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'text-text-secondary hover:text-text-main'
            }`}
          >
            🇮🇳 National
          </button>
          <button
            onClick={() => setTravelMode('international')}
            className={`px-4 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all duration-300 ${
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

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-text-main hover:border-primary transition-colors shadow-sm"
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-primary" />}
          </button>

          <button
            onClick={() => navigate('/plan')}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-primary to-accent text-white font-heading font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
          >
            Start Planning
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl bg-surface border border-border flex items-center justify-center text-text-main"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-primary" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-text-main"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-surface border-b border-border p-6 shadow-2xl space-y-4">
          <div className="flex rounded-xl bg-bg p-1 border border-border mb-4">
            <button
              onClick={() => { setTravelMode('national'); setMobileMenuOpen(false); }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase ${travelMode === 'national' ? 'bg-primary text-white' : 'text-text-secondary'}`}
            >
              National
            </button>
            <button
              onClick={() => { setTravelMode('international'); setMobileMenuOpen(false); }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase ${travelMode === 'international' ? 'bg-primary text-white' : 'text-text-secondary'}`}
            >
              International
            </button>
          </div>

          <div className="flex flex-col space-y-3 text-sm font-heading font-bold uppercase tracking-wider">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="py-2 text-text-main">Explore</Link>
            <button onClick={() => { navigate('/plan'); setMobileMenuOpen(false); }} className="py-2 text-left text-text-main">Plan a Trip</button>
            <Link to="/itinerary" onClick={() => setMobileMenuOpen(false)} className="py-2 text-text-main">My Trips</Link>
          </div>

          <button
            onClick={() => { navigate('/plan'); setMobileMenuOpen(false); }}
            className="w-full py-3 rounded-2xl bg-primary text-white font-heading font-bold text-xs uppercase tracking-wider text-center shadow-lg"
          >
            Start Planning
          </button>
        </div>
      )}
    </nav>
  );
};