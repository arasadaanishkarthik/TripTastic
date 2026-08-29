import React from 'react';
import { Sparkles } from 'lucide-react';

export const AIInsight = ({ itinerary }) => {
  return (
    <div className="p-6 rounded-3xl bg-surface border border-primary/30 shadow-xl space-y-3 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-28 h-28 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center gap-2 text-xs font-semibold text-accent uppercase tracking-wider">
        <Sparkles className="w-4 h-4" />
        <span>✦ Why This Plan?</span>
      </div>

      <p className="text-xs sm:text-sm text-text-main font-medium italic leading-relaxed">
        "{itinerary.aiReasoning}"
      </p>

      <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-text-secondary">
        <span>AI Confidence Score</span>
        <span className="font-bold text-primary">{itinerary.aiMatch}% Match</span>
      </div>
    </div>
  );
};