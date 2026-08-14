import React from 'react';
import { Wallet, Info, DollarSign } from 'lucide-react';
import { EstimatedCosts } from '../types';
import { formatCurrency, getCurrencySymbol } from '../utils/currencyUtils';

interface CostBreakdownCardProps {
  costs: EstimatedCosts;
  totalDays: number;
  isLargeText: boolean;
}

export const CostBreakdownCard: React.FC<CostBreakdownCardProps> = ({
  costs,
  totalDays,
  isLargeText,
}) => {
  const currencyCode = costs.currency || 'USD';
  const currencySymbol = costs.currency_symbol || getCurrencySymbol(currencyCode);

  const dailyTotal = (costs.activities_per_day || 0) + (costs.food_per_day || 0);
  const tripTotal = dailyTotal * totalDays;

  const titleSize = isLargeText ? 'text-xl font-black' : 'text-lg font-black';
  const bodySize = isLargeText ? 'text-base' : 'text-sm';

  return (
    <div className="overflow-hidden rounded-3xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-white dark:bg-[#1E232B] p-6 shadow-[6px_6px_0px_0px_#1A1A1A] dark:shadow-[6px_6px_0px_0px_#000000] space-y-5 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-[#C5E876] text-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <h3 className={`${titleSize} text-[#1A1A1A] dark:text-[#F3F4F6]`}>Estimated Expense Breakdown</h3>
            <p className="text-xs font-semibold text-stone-500 dark:text-stone-400">Excludes long-distance flights/trains & accommodation</p>
          </div>
        </div>
        <span className="rounded-full border border-[#1A1A1A] dark:border-[#384152] bg-[#C5E876] px-3 py-0.5 text-xs font-black text-[#1A1A1A]">
          {currencyCode} ({currencySymbol})
        </span>
      </div>

      {/* Figures Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Daily Food */}
        <div className="rounded-2xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-[#FAF9F5] dark:bg-[#14171D] p-4 shadow-[3px_3px_0px_0px_#1A1A1A] dark:shadow-[3px_3px_0px_0px_#000000]">
          <span className="text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Meals & Dining / Day
          </span>
          <p className="mt-1 text-2xl font-black text-[#1A1A1A] dark:text-[#F3F4F6]">
            {formatCurrency(costs.food_per_day || 0, currencyCode)}
          </p>
          <p className="text-xs font-medium text-stone-600 dark:text-stone-400">Per person daily average</p>
        </div>

        {/* Daily Activities */}
        <div className="rounded-2xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-[#FAF9F5] dark:bg-[#14171D] p-4 shadow-[3px_3px_0px_0px_#1A1A1A] dark:shadow-[3px_3px_0px_0px_#000000]">
          <span className="text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Sightseeing & Admissions / Day
          </span>
          <p className="mt-1 text-2xl font-black text-[#1A1A1A] dark:text-[#F3F4F6]">
            {formatCurrency(costs.activities_per_day || 0, currencyCode)}
          </p>
          <p className="text-xs font-medium text-stone-600 dark:text-stone-400">Monuments, passes & tickets</p>
        </div>

        {/* Total Trip Activities + Food */}
        <div className="rounded-2xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-[#E0F2FE] dark:bg-[#142A45] p-4 shadow-[3px_3px_0px_0px_#1A1A1A] dark:shadow-[3px_3px_0px_0px_#000000]">
          <span className="text-xs font-black uppercase tracking-wider text-[#075985] dark:text-[#BAE6FD]">
            Total On-Ground Budget ({totalDays} Days)
          </span>
          <p className="mt-1 text-2xl font-black text-[#0369A1] dark:text-[#38BDF8]">
            {formatCurrency(tripTotal, currencyCode)}
          </p>
          <p className="text-xs font-bold text-[#0284C7] dark:text-[#7DD3FC]">Total per traveler</p>
        </div>
      </div>

      {/* Money-Saving Insight / Hidden Fees Advisory */}
      {(costs.hidden_fees_notes || (costs as any).money_saving_tip) && (
        <div className="flex items-start gap-2.5 rounded-2xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-[#FFFBEB] dark:bg-[#2F2412] p-3.5 shadow-[2px_2px_0px_0px_#1A1A1A] dark:shadow-[2px_2px_0px_0px_#000000]">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#D97706] dark:text-[#FBBF24]" />
          <p className={`text-xs sm:text-sm font-semibold text-[#92400E] dark:text-[#FDE68A] ${bodySize}`}>
            <strong className="font-black">Budget & Fee Advisory: </strong>
            {costs.hidden_fees_notes || (costs as any).money_saving_tip}
          </p>
        </div>
      )}
    </div>
  );
};
