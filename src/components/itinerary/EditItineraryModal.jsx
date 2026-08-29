import React from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Button } from '../Button';

export const EditItineraryModal = ({ isOpen, onClose, itinerary }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-2xl space-y-6 relative">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h3 className="font-heading font-extrabold text-xl uppercase text-text-main">Edit Itinerary</h3>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs text-text-secondary">
          <p>Customize activities, adjust timings, or add new stops to your group trip.</p>
          <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-border flex items-center justify-between">
            <span>Add Custom Activity</span>
            <Button variant="primary" size="sm" icon={Plus}>Add</Button>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-border">
          <Button variant="primary" size="md" onClick={onClose}>Done</Button>
        </div>
      </div>
    </div>
  );
};