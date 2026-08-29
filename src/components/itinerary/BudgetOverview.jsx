import React from 'react';

export const BudgetOverview = ({ itinerary }) => {
  const total = itinerary.budget.total;

  return (
    <div className="p-6 rounded-3xl bg-surface border border-border shadow-xl space-y-5">
      <div className="flex items-center justify-between">
        <h4 className="font-heading font-bold text-sm uppercase text-text-main">Trip Budget Breakdown</h4>
        <span className="font-heading font-extrabold text-lg text-primary">₹{total.toLocaleString()}</span>
      </div>

      {/* Visual Distribution Bar */}
      <div className="w-full h-3 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden flex">
        {itinerary.budget.breakdown.map((item, idx) => {
          const percentage = (item.amount / total) * 100;
          return (
            <div
              key={idx}
              style={{ width: `${percentage}%`, backgroundColor: item.color }}
              title={`${item.category}: ₹${item.amount}`}
              className="h-full first:rounded-l-full last:rounded-r-full"
            />
          );
        })}
      </div>

      <div className="space-y-2.5 pt-2">
        {itinerary.budget.breakdown.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-text-secondary font-medium">{item.category}</span>
            </div>
            <span className="font-bold text-text-main">₹{item.amount.toLocaleString()}</span>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-border flex items-center justify-between text-xs">
        <span className="text-text-secondary uppercase">Per Person Share</span>
        <span className="font-heading font-extrabold text-base text-primary">₹{itinerary.budget.perPerson.toLocaleString()}</span>
      </div>
    </div>
  );
};