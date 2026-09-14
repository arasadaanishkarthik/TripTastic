import React from 'react';
import { Edit3, RotateCw, Share2 } from 'lucide-react';
import { Button } from '../Button';

export const ItineraryActions = ({ onEdit, onRegenerate, onShare, isRegenerating }) => {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2.5">
      <Button
        variant="primary"
        size="sm"
        onClick={onEdit}
        icon={Edit3}
        className="!px-2.5 sm:!px-3.5 !py-1.5 text-xs font-semibold"
      >
        <span className="hidden xs:inline">Edit</span>
      </Button>

      <Button
        variant="secondary"
        size="sm"
        onClick={onRegenerate}
        icon={RotateCw}
        disabled={isRegenerating}
        className="!px-2.5 sm:!px-3.5 !py-1.5 text-xs font-semibold"
      >
        <span>{isRegenerating ? 'Working…' : 'Regen'}</span>
        <span className="hidden md:inline">{!isRegenerating && 'erate'}</span>
      </Button>

      <Button
        variant="secondary"
        size="sm"
        onClick={onShare}
        icon={Share2}
        className="!px-2.5 sm:!px-3.5 !py-1.5 text-xs font-semibold"
      >
        <span className="hidden xs:inline">Share</span>
      </Button>
    </div>
  );
};