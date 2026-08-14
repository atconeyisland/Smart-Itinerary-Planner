import React from 'react';
import { Sparkles, Lightbulb } from 'lucide-react';
import { FunFact } from '../types';

interface FunFactsSectionProps {
  funFacts?: FunFact[];
  destination: string;
  isLargeText: boolean;
}

export const FunFactsSection: React.FC<FunFactsSectionProps> = ({
  funFacts,
  destination,
  isLargeText,
}) => {
  if (!funFacts || funFacts.length === 0) {
    return null;
  }

  const titleSize = isLargeText ? 'text-xl sm:text-2xl font-black' : 'text-lg sm:text-xl font-black';
  const bodySize = isLargeText ? 'text-base' : 'text-sm';

  return (
    <div className="mt-10 rounded-3xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-[#FFD4D4] dark:bg-[#2C1920] p-6 sm:p-8 shadow-[6px_6px_0px_0px_#1A1A1A] dark:shadow-[6px_6px_0px_0px_#000000] transition-colors">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-[#C5E876] text-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]">
          <Sparkles className="h-6 w-6" />
        </div>
        <div>
          <h2 className={`${titleSize} text-[#1A1A1A] dark:text-[#FEE2E2]`}>
            Fascinating Fun Facts & Trivia: {destination.split(',')[0]}
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-stone-700 dark:text-[#FCA5A5]">
            Researched cultural, architectural, and historical trivia to enrich your journey
          </p>
        </div>
      </div>

      {/* Grid of facts */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {funFacts.map((fact, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between rounded-2xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-white dark:bg-[#1E232B] p-5 shadow-[3px_3px_0px_0px_#1A1A1A] dark:shadow-[3px_3px_0px_0px_#000000] transition-colors"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 rounded-md border border-[#1A1A1A] dark:border-[#384152] bg-[#C5E876] px-2.5 py-0.5 text-xs font-black text-[#1A1A1A]">
                  <Lightbulb className="h-3 w-3 text-[#1A1A1A]" />
                  {fact.tag}
                </span>
                <span className="text-xs font-black text-stone-400 dark:text-stone-500">#{idx + 1}</span>
              </div>
              <h3 className={`mt-2.5 font-black text-[#1A1A1A] dark:text-[#F3F4F6] ${isLargeText ? 'text-lg' : 'text-base'}`}>
                {fact.title}
              </h3>
              <p className={`mt-2 font-medium text-stone-700 dark:text-stone-300 leading-relaxed ${bodySize}`}>
                {fact.fact}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
