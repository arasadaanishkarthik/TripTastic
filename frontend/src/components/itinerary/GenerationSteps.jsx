import React from 'react';
import { Check } from 'lucide-react';
import { GENERATION_STEPS } from '../../data/generationData';

export const GenerationSteps = ({ activeStep }) => {
  return (
    <div className="space-y-3 w-full max-w-md mx-auto">
      {GENERATION_STEPS.map((step) => {
        const isCompleted = activeStep > step.id;
        const isActive = activeStep === step.id;
        const isUpcoming = activeStep < step.id;

        return (
          <div
            key={step.id}
            className={`p-3.5 rounded-2xl border transition-all duration-300 flex items-center justify-between text-xs ${
              isCompleted
                ? 'bg-primary/10 border-primary/30 text-text-main font-semibold'
                : isActive
                ? 'bg-surface border-primary shadow-lg shadow-primary/10 ring-2 ring-primary/20 text-text-main font-bold scale-[1.02]'
                : 'bg-black/5 dark:bg-white/5 border-border text-text-secondary opacity-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                  isCompleted
                    ? 'bg-primary text-white'
                    : isActive
                    ? 'bg-accent text-white animate-pulse'
                    : 'bg-border text-text-secondary'
                }`}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5" /> : `0${step.id}`}
              </span>
              <span className="uppercase tracking-wider">{step.title}</span>
            </div>

            <div>
              {isCompleted && <span className="text-[10px] text-primary uppercase font-bold">Done</span>}
              {isActive && <span className="text-[10px] text-accent uppercase font-bold animate-pulse">Active</span>}
              {isUpcoming && <span className="text-[10px] text-text-secondary uppercase">Waiting</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
};