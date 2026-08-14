import React from 'react';
import {
  MapPin,
  Calendar,
  Sparkles,
  Printer,
  Compass,
  Wallet,
  CloudSun,
} from 'lucide-react';
import { TripSummary, EstimatedCosts } from '../types';
import { getDestinationPhoto } from '../utils/imageService';
import { getFormattedDayDate, getSeasonAnalysis } from '../utils/seasonUtils';
import { formatCurrency } from '../utils/currencyUtils';

interface TripSummaryHeaderProps {
  summary: TripSummary;
  estimatedCosts: EstimatedCosts;
  onPrintPdf: () => void;
  isLargeText: boolean;
  startDateStr?: string;
}

export const TripSummaryHeader: React.FC<TripSummaryHeaderProps> = ({
  summary,
  estimatedCosts,
  onPrintPdf,
  isLargeText,
  startDateStr,
}) => {
  const photoUrl = summary.destination_photo || getDestinationPhoto(summary.destination);
  const activeStart = startDateStr || summary.start_date || (() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  })();

  const startDateMeta = getFormattedDayDate(activeStart, 0);
  const endDateMeta = getFormattedDayDate(activeStart, (summary.total_days || 1) - 1);
  const seasonInfo = getSeasonAnalysis(summary.destination, activeStart);

  const currencyCode = estimatedCosts.currency || 'USD';
  const totalDaily = (estimatedCosts.activities_per_day || 0) + (estimatedCosts.food_per_day || 0);

  return (
    <div className="overflow-hidden rounded-3xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-white dark:bg-[#1E232B] shadow-[6px_6px_0px_0px_#1A1A1A] dark:shadow-[6px_6px_0px_0px_#000000] transition-colors">
      {/* Hero Photo Banner */}
      <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-stone-900">
        <img
          src={photoUrl}
          alt={summary.destination}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover opacity-90 transition duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-stone-950/95 via-stone-950/45 to-transparent" />

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8">
          {/* Top Badges & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-white/80 bg-black/70 px-3.5 py-1 text-xs font-bold text-white backdrop-blur-md">
                <MapPin className="h-3.5 w-3.5 text-[#C5E876]" />
                <span>{summary.destination}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-[#1A1A1A] bg-[#C5E876] px-3.5 py-1 text-xs font-black text-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]">
                <Calendar className="h-3.5 w-3.5" />
                <span>{summary.total_days} Days ({startDateMeta.formattedShort} – {endDateMeta.formattedShort})</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                <CloudSun className="h-3.5 w-3.5 text-[#FBBF24]" />
                <span>{seasonInfo.seasonName} Season ({seasonInfo.temperatureRange.split('(')[0].trim()})</span>
              </span>
            </div>

            {/* Print / Save PDF Button */}
            <div className="print:hidden">
              <button
                type="button"
                onClick={onPrintPdf}
                className="inline-flex items-center gap-2 rounded-xl border-2 border-[#1A1A1A] bg-white px-4 py-2 text-xs sm:text-sm font-black text-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] transition hover:bg-stone-50 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                title="Print or save this complete itinerary as a PDF document"
              >
                <Printer className="h-4 w-4 text-[#1A1A1A]" />
                <span>Print / PDF</span>
              </button>
            </div>
          </div>

          {/* Bottom Title & Theme */}
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight drop-shadow-sm">
              {summary.destination}
            </h1>
            <p className="mt-1.5 max-w-3xl text-sm sm:text-base font-semibold text-stone-200 drop-shadow-xs line-clamp-2">
              "{summary.theme_vibe}"
            </p>
          </div>
        </div>
      </div>

      {/* Summary Footer Meta */}
      <div className="grid grid-cols-1 divide-y-2 sm:divide-y-0 sm:divide-x-2 divide-[#1A1A1A] dark:divide-[#384152] bg-[#F3F4F1] dark:bg-[#14171D] sm:grid-cols-3">
        {/* Total Days & Dates */}
        <div className="p-4 sm:p-5">
          <span className="text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Travel Schedule & Season
          </span>
          <p className="mt-0.5 text-base sm:text-lg font-black text-[#1A1A1A] dark:text-[#F3F4F6]">
            {startDateMeta.formattedShort} – {endDateMeta.formattedShort}, {startDateMeta.dateObj.getFullYear()}
          </p>
          <p className="text-xs font-medium text-stone-600 dark:text-stone-400">
            {seasonInfo.seasonName} ({seasonInfo.monthName}) • {seasonInfo.crowdLevel}
          </p>
        </div>

        {/* Estimated Daily Budget */}
        <div className="p-4 sm:p-5">
          <span className="text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Estimated Daily Budget
          </span>
          <p className="mt-0.5 text-base sm:text-lg font-black text-[#1A1A1A] dark:text-[#F3F4F6]">
            {formatCurrency(totalDaily, currencyCode)} / day
          </p>
          <p className="text-xs font-medium text-stone-600 dark:text-stone-400">
            Food {formatCurrency(estimatedCosts.food_per_day || 0, currencyCode)} + Activities {formatCurrency(estimatedCosts.activities_per_day || 0, currencyCode)}
          </p>
        </div>

        {/* Budget Strategy */}
        <div className="p-4 sm:p-5">
          <span className="text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Budget Strategy
          </span>
          <p className="mt-0.5 text-xs sm:text-sm font-semibold text-stone-700 dark:text-stone-300 line-clamp-2">
            {summary.budget_strategy}
          </p>
        </div>
      </div>
    </div>
  );
};
