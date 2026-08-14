import React from 'react';
import { Compass, RotateCcw, Printer, Type, BookmarkCheck, Globe2, Sun, Moon } from 'lucide-react';
import { getSavedTripsFromStorage } from '../utils/storageUtils';

interface NavbarProps {
  onReset: () => void;
  hasItinerary: boolean;
  onPrint?: () => void;
  onOpenSavedTrips?: () => void;
  isLargeText: boolean;
  onToggleLargeText: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  currency?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onReset,
  hasItinerary,
  onPrint,
  onOpenSavedTrips,
  isLargeText,
  onToggleLargeText,
  isDarkMode,
  onToggleDarkMode,
  currency = 'INR',
}) => {
  const [savedCount, setSavedCount] = React.useState<number>(0);

  React.useEffect(() => {
    try {
      const trips = getSavedTripsFromStorage();
      setSavedCount(trips.length);
    } catch {
      // Ignore
    }
  }, [hasItinerary]);

  return (
    <header className="sticky top-0 z-40 w-full border-b-2 border-[#1A1A1A] dark:border-[#384152] bg-[#F3F4F1]/95 dark:bg-[#121417]/95 backdrop-blur-md print:hidden transition-colors duration-150">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <div
          onClick={hasItinerary ? onReset : undefined}
          className={`flex items-center gap-3 ${hasItinerary ? 'cursor-pointer' : ''}`}
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-[#C5E876] dark:bg-[#C5E876] text-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] dark:shadow-[2px_2px_0px_0px_#000000]">
            <Compass className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-[#1A1A1A] dark:text-[#F3F4F6] sm:text-xl">
                Travel Planner
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-[#1A1A1A] dark:border-[#384152] bg-[#FFFFFF] dark:bg-[#1E232B] px-2.5 py-0.5 text-xs font-black text-[#1A1A1A] dark:text-[#F3F4F6]">
                <Globe2 className="w-3 h-3 text-[#3B82F6] dark:text-[#60A5FA]" />
                {currency}
              </span>
            </div>
            <p className="text-xs font-medium text-stone-600 dark:text-stone-400 hidden sm:block">
              Interactive maps, flights, hotel & food guides with multi-currency support
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Dark Mode Toggle */}
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="inline-flex items-center justify-center h-9 w-9 rounded-xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-white dark:bg-[#1E232B] text-[#1A1A1A] dark:text-[#F3F4F6] shadow-[2px_2px_0px_0px_#1A1A1A] dark:shadow-[2px_2px_0px_0px_#000000] transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none hover:bg-stone-100 dark:hover:bg-[#28303B]"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4 text-[#FBBF24]" />
            ) : (
              <Moon className="h-4 w-4 text-[#4B5563]" />
            )}
          </button>

          {/* Saved Trips Button */}
          {onOpenSavedTrips && (
            <button
              type="button"
              onClick={onOpenSavedTrips}
              className="inline-flex items-center gap-1.5 rounded-xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-[#FFFFFF] dark:bg-[#1E232B] px-3 py-1.5 text-xs font-bold text-[#1A1A1A] dark:text-[#F3F4F6] shadow-[2px_2px_0px_0px_#1A1A1A] dark:shadow-[2px_2px_0px_0px_#000000] transition hover:bg-[#F3F4F1] dark:hover:bg-[#28303B] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
              title="View and load your saved trips"
            >
              <BookmarkCheck className="h-4 w-4 text-[#3B82F6] dark:text-[#60A5FA]" />
              <span className="hidden xs:inline">Saved Trips</span>
              {savedCount > 0 && (
                <span className="px-1.5 py-0.2 bg-[#C5E876] border border-[#1A1A1A] dark:border-[#384152] rounded-md text-[10px] font-black text-[#1A1A1A]">
                  {savedCount}
                </span>
              )}
            </button>
          )}

          {/* Accessibility friendly font size toggle */}
          <button
            type="button"
            onClick={onToggleLargeText}
            className={`inline-flex items-center gap-1.5 rounded-xl border-2 border-[#1A1A1A] dark:border-[#384152] px-3 py-1.5 text-xs font-bold shadow-[2px_2px_0px_0px_#1A1A1A] dark:shadow-[2px_2px_0px_0px_#000000] transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none ${
              isLargeText
                ? 'bg-[#C5E876] text-[#1A1A1A]'
                : 'bg-white dark:bg-[#1E232B] text-[#1A1A1A] dark:text-[#F3F4F6] hover:bg-stone-50 dark:hover:bg-[#28303B]'
            }`}
            title="Toggle larger font size for easier reading"
          >
            <Type className="h-4 w-4" />
            <span className="hidden xs:inline">{isLargeText ? 'Standard Font' : 'Larger Font (A+)'}</span>
          </button>

          {hasItinerary && onPrint && (
            <button
              type="button"
              onClick={onPrint}
              className="inline-flex items-center gap-1.5 rounded-xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-white dark:bg-[#1E232B] px-3.5 py-1.5 text-xs font-bold text-[#1A1A1A] dark:text-[#F3F4F6] shadow-[2px_2px_0px_0px_#1A1A1A] dark:shadow-[2px_2px_0px_0px_#000000] transition hover:bg-stone-50 dark:hover:bg-[#28303B] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            >
              <Printer className="h-4 w-4" />
              <span>Print</span>
            </button>
          )}

          {hasItinerary && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 rounded-xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-[#C5E876] px-4 py-1.5 text-xs font-bold text-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] dark:shadow-[2px_2px_0px_0px_#000000] transition hover:bg-[#b8dd67] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            >
              <RotateCcw className="h-4 w-4" />
              <span>New Trip</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
