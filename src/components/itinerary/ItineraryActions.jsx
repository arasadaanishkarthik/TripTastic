import React from 'react';
import { Edit3, RotateCw, Share2 } from 'lucide-react';
import { Button } from '../Button';

export const ItineraryActions = ({ onEdit, onRegenerate, onShare, isRegenerating }) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="primary" size="md" onClick={onEdit} icon={Edit3}>
        Edit
      </Button>
      <Button variant="secondary" size="md" onClick={onRegenerate} icon={RotateCw} disabled={isRegenerating}>
        {isRegenerating ? 'Optimizing...' : 'Regenerate'}
      </Button>
      <Button variant="secondary" size="md" onClick={onShare} icon={Share2}>
        Share
      </Button>
    </div>
  );
};