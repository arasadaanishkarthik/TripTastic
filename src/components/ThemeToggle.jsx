import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className={`p-2 rounded-xl border border-border bg-surface/60 backdrop-blur-md text-text-secondary hover:text-text-main hover:border-primary/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40 ${className}`}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-accent transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-primary transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  );
};