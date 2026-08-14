import React from 'react';
import {
  Bus,
  Luggage,
  HeartHandshake,
  Check,
  AlertTriangle,
  Accessibility,
  Compass,
} from 'lucide-react';
import { LocalLogisticsGuide } from '../types';

interface LogisticsGuideCardProps {
  guide: LocalLogisticsGuide;
  isLargeText: boolean;
}

export const LogisticsGuideCard: React.FC<LogisticsGuideCardProps> = ({ guide, isLargeText }) => {
  const titleSize = isLargeText ? 'text-lg sm:text-xl font-black' : 'text-base sm:text-lg font-black';
  const bodySize = isLargeText ? 'text-base' : 'text-sm';

  return (
    <div className="space-y-6">
      {/* Transit Advice */}
      <div className="rounded-3xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-white dark:bg-[#1E232B] p-6 shadow-[4px_4px_0px_0px_#1A1A1A] dark:shadow-[4px_4px_0px_0px_#000000] transition-colors">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-[#89CFF0] text-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]">
            <Bus className="h-5 w-5" />
          </div>
          <div>
            <h3 className={`${titleSize} text-[#1A1A1A] dark:text-[#F3F4F6]`}>Recommended Local Transit Method</h3>
            <p className="text-xs font-semibold text-stone-500 dark:text-stone-400">Fastest and most comfortable ways to get around</p>
          </div>
        </div>
        <p className={`mt-4 font-semibold text-stone-800 dark:text-stone-200 ${bodySize}`}>
          {guide?.best_transit_method || 'Subway / Metro & Licensed Taxis'}
        </p>
      </div>

      {/* Senior & Accessibility Notes */}
      {guide?.senior_and_accessibility_notes && (
        <div className="rounded-3xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-[#C5E876] dark:bg-[#203817] p-6 shadow-[4px_4px_0px_0px_#1A1A1A] dark:shadow-[4px_4px_0px_0px_#000000] transition-colors">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-white dark:bg-[#1E232B] text-[#1A1A1A] dark:text-[#C5E876] shadow-[2px_2px_0px_0px_#1A1A1A]">
              <Accessibility className="h-5 w-5" />
            </div>
            <div>
              <h3 className={`${titleSize} text-[#1A1A1A] dark:text-[#ECFDF5]`}>
                Accessibility & Senior Comfort Notes
              </h3>
              <p className="text-xs font-bold text-stone-800 dark:text-stone-300">Special assistance, elevators & walking ease</p>
            </div>
          </div>
          <p className={`mt-3 font-semibold text-[#1A1A1A] dark:text-[#D1FAE5] ${bodySize}`}>
            {guide.senior_and_accessibility_notes}
          </p>
        </div>
      )}

      {/* Grid: Etiquette & Packing */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Cultural Etiquette */}
        <div className="rounded-3xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-white dark:bg-[#1E232B] p-6 shadow-[4px_4px_0px_0px_#1A1A1A] dark:shadow-[4px_4px_0px_0px_#000000] transition-colors">
          <div className="flex items-center gap-2.5">
            <HeartHandshake className="h-5 w-5 text-[#E66767]" />
            <h4 className="font-black text-base text-[#1A1A1A] dark:text-[#F3F4F6]">Cultural Etiquette & Customs</h4>
          </div>
          <ul className="mt-4 space-y-2.5">
            {((guide?.cultural_etiquette_alerts || (guide as any)?.cultural_etiquette) || []).map((item: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm font-medium text-stone-700 dark:text-stone-300">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#10B981]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Essential Packing List */}
        <div className="rounded-3xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-white dark:bg-[#1E232B] p-6 shadow-[4px_4px_0px_0px_#1A1A1A] dark:shadow-[4px_4px_0px_0px_#000000] transition-colors">
          <div className="flex items-center gap-2.5">
            <Luggage className="h-5 w-5 text-[#3B82F6]" />
            <h4 className="font-black text-base text-[#1A1A1A] dark:text-[#F3F4F6]">Essential Packing Checklist</h4>
          </div>
          <ul className="mt-4 space-y-2.5">
            {(guide?.packing_essentials || []).map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm font-medium text-stone-700 dark:text-stone-300">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#3B82F6]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
