import React from 'react';
import { DestinationResult } from './DestinationResult';

export const DestinationSearchResults = ({ results, onSelect, highlightedIndex }) => {
  if (results.length === 0) {
    return (
      <div className="p-8 text-center space-y-2 rounded-2xl bg-surface border border-border">
        <h4 className="font-heading font-bold text-sm text-text-main uppercase">No Destination Found</h4>
        <p className="text-xs text-text-secondary max-w-xs mx-auto">
          We couldn't find a destination matching your query. Try searching for a city, region or country.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
      <span className="text-[10px] font-bold tracking-widest uppercase text-text-secondary block px-1">
        Search Results ({results.length})
      </span>
      {results.map((dest, index) => (
        <DestinationResult
          key={dest.id}
          destination={dest}
          onSelect={onSelect}
          isHighlighted={index === highlightedIndex}
        />
      ))}
    </div>
  );
};