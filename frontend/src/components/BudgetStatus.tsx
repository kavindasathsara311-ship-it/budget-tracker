import React from 'react';
import { BudgetStatus as IBudgetStatus } from '../types';

interface Props {
  status: IBudgetStatus;
}

export const BudgetStatus: React.FC<Props> = ({ status }) => {
  const { total, limit, isOverBudget, overBy, underBy, percentage } = status;

  const getProgressColor = () => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-amber-500';
    return 'bg-teal-500';
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex justify-between items-end mb-4">
        <div>
          <p className="text-slate-500 text-sm font-medium">Today's Spending</p>
          <h2 className="text-3xl font-bold text-slate-900">${total.toFixed(2)}</h2>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
          isOverBudget ? 'bg-red-100 text-red-600' : 'bg-teal-100 text-teal-600'
        }`}>
          {isOverBudget ? `Over by $${overBy.toFixed(2)}` : `Under by $${underBy.toFixed(2)}`}
        </div>
      </div>

      {limit !== null && (
        <>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-2">
            <div 
              className={`h-full transition-all duration-500 ${getProgressColor()}`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500 font-medium">
            <span>0%</span>
            <span>Budget Limit: ${limit.toFixed(2)}</span>
            <span>{percentage.toFixed(0)}%</span>
          </div>
        </>
      )}
    </div>
  );
};
