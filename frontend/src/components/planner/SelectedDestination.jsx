import React from 'react';
import { CheckCircle2, RotateCcw, MapPin } from 'lucide-react';
import { Button } from '../Button';

export const SelectedDestination = ({ destination, onChange }) => {
  if (!destination || !destination.id) return null;

  return (
    <div className="p-6 rounded-3xl bg-surface border border-primary/40 shadow-xl space-y-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">
          <CheckCircle2 className="w-4 h-4" /> Destination Selected
        </span>
        <Button variant="secondary" size="sm" onClick={onChange} icon={RotateCcw}>
          Change
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
          <MapPin className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-heading font-extrabold text-2xl text-text-main uppercase tracking-tight">
            {destination.name}
          </h3>
          <p className="text-xs text-text-secondary">
            {destination.state} • {destination.country} ({destination.region})
          </p>
        </div>
      </div>

      <p className="text-xs text-text-secondary/90 leading-relaxed pt-1">
        {destination.description}
      </p>
    </div>
  );
};