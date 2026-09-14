import React, { useState } from 'react';
import { X, Copy, Check, MessageSquare, Mail } from 'lucide-react';
import { Button } from '../Button';

export const ShareTripPanel = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-2xl space-y-6 relative">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h3 className="font-heading font-extrabold text-xl uppercase text-text-main">Share Trip</h3>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <button onClick={handleCopy} className="w-full p-3.5 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-primary/10 border border-border flex items-center justify-between text-xs font-semibold text-text-main transition-colors">
            <span className="flex items-center gap-2.5"><Copy className="w-4 h-4 text-primary" /> Copy Trip Link</span>
            <span>{copied ? <Check className="w-4 h-4 text-emerald-500" /> : 'Copy'}</span>
          </button>

          <a href="https://whatsapp.com" target="_blank" rel="noreferrer" className="w-full p-3.5 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-emerald-500/10 border border-border flex items-center justify-between text-xs font-semibold text-text-main transition-colors">
            <span className="flex items-center gap-2.5"><MessageSquare className="w-4 h-4 text-emerald-500" /> Share via WhatsApp</span>
            <span>→</span>
          </a>

          <a href="mailto:?subject=Our TripTastic Itinerary" className="w-full p-3.5 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-primary/10 border border-border flex items-center justify-between text-xs font-semibold text-text-main transition-colors">
            <span className="flex items-center gap-2.5"><Mail className="w-4 h-4 text-primary" /> Share via Email</span>
            <span>→</span>
          </a>
        </div>
      </div>
    </div>
  );
};