import React, { useState } from 'react';
import {
  PlannerInputs,
  ItineraryPlanResponse,
  ActivityItem,
} from './types';
import { SAMPLE_PRESETS } from './sampleData';
import { Navbar } from './components/Navbar';
import { PlannerForm } from './components/PlannerForm';
import { ItineraryView } from './components/ItineraryView';
import { ActivitySwapModal } from './components/ActivitySwapModal';
import { SavedTripsModal } from './components/SavedTripsModal';
import { AlertCircle, Sparkles, RefreshCw } from 'lucide-react';

export default function App() {
  const [inputs, setInputs] = useState<PlannerInputs>({
    destination: 'Kyoto, Japan',
    origin_city: 'New York (JFK), USA',
    start_date: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 7);
      const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    })(),
    duration: 4,
    currency: 'USD',
    travelers: 'Couple / Family',
    budget: 'Comfort / Standard ($160/day)',
    pace: 'Balanced (Relaxed Walking)',
    interests: 'Historic Temples, Bamboo Forests, Tea Ceremony, Local Markets, Zen Gardens',
    constraints: 'Senior-friendly, vegetarian-friendly lunch options, minimal steep climbing',
  });

  const [itineraryData, setItineraryData] = useState<ItineraryPlanResponse | null>(
    SAMPLE_PRESETS[0].data
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLargeText, setIsLargeText] = useState<boolean>(false);
  const [isSavedTripsModalOpen, setIsSavedTripsModalOpen] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('travel_planner_dark_mode');
      if (saved !== null) {
        return saved === 'true';
      }
      return false; // Default to clean light mode
    } catch {
      return false;
    }
  });

  React.useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('travel_planner_dark_mode', 'true');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('travel_planner_dark_mode', 'false');
      }
    } catch {
      // Ignore
    }
  }, [isDarkMode]);

  // Completed checklist items
  const [completedActivities, setCompletedActivities] = useState<
    Record<string, boolean>
  >({});

  // Swap activity modal state
  const [swapModalState, setSwapModalState] = useState<{
    isOpen: boolean;
    dayNumber: number;
    activity: ActivityItem | null;
    geoFocus: string;
  }>({
    isOpen: false,
    dayNumber: 1,
    activity: null,
    geoFocus: '',
  });

  // Switch between form and results view
  const [viewMode, setViewMode] = useState<'form' | 'results'>('results');

  const handleSelectPreset = (index: number) => {
    const preset = SAMPLE_PRESETS[index];
    if (preset) {
      setInputs(preset.inputs);
      setItineraryData(preset.data);
      setCompletedActivities({});
      setViewMode('results');
      setErrorMessage(null);
    }
  };

  const handleSelectSavedTrip = (savedPlan: ItineraryPlanResponse) => {
    setItineraryData(savedPlan);
    setInputs((prev) => ({
      ...prev,
      destination: savedPlan.trip_summary.destination,
      duration: savedPlan.trip_summary.total_days,
      currency: savedPlan.estimated_costs.currency,
      start_date: savedPlan.trip_summary.start_date || prev.start_date,
    }));
    setCompletedActivities({});
    setViewMode('results');
    setErrorMessage(null);
  };

  const handleGenerateItinerary = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/plan-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs),
      });

      const resJson = await response.json();
      if (resJson.success && resJson.data) {
        setItineraryData(resJson.data);
        setCompletedActivities({});
        setViewMode('results');
      } else {
        throw new Error(resJson.error || 'Failed to generate itinerary.');
      }
    } catch (err: any) {
      console.error('Generation error:', err);
      let msg = err?.message || 'Could not connect to the AI engine.';
      if (typeof msg === 'string' && (msg.includes('503') || msg.includes('high demand') || msg.includes('UNAVAILABLE'))) {
        msg = 'The AI model is experiencing temporary high demand (503). Please click Retry or load one of the ready-made itineraries.';
      }
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActivity = (activityKey: string) => {
    setCompletedActivities((prev) => ({
      ...prev,
      [activityKey]: !prev[activityKey],
    }));
  };

  const handleOpenSwapModal = (
    dayNumber: number,
    activity: ActivityItem,
    geoFocus: string
  ) => {
    setSwapModalState({
      isOpen: true,
      dayNumber,
      activity,
      geoFocus,
    });
  };

  const handleConfirmSwap = (
    dayNumber: number,
    oldActivity: ActivityItem,
    newActivity: ActivityItem
  ) => {
    if (!itineraryData || !itineraryData.itinerary) return;

    const updatedItinerary = (itineraryData.itinerary || []).map((day) => {
      if (day.day_number === dayNumber) {
        const updatedSchedule = (day.schedule || []).map((item) =>
          item.activity_name === oldActivity.activity_name ? newActivity : item
        );
        return { ...day, schedule: updatedSchedule };
      }
      return day;
    });

    setItineraryData({
      ...itineraryData,
      itinerary: updatedItinerary,
    });
  };

  const handleResetToForm = () => {
    setViewMode('form');
  };

  const handlePrint = () => {
    window.print();
  };

  const activeCurrency = itineraryData?.estimated_costs.currency || inputs.currency || 'USD';

  return (
    <div
      className={`min-h-screen bg-[#F3F4F1] dark:bg-[#0F1217] text-[#1A1A1A] dark:text-[#F3F4F6] selection:bg-[#C5E876] selection:text-[#1A1A1A] font-sans transition-all duration-150 ${
        isLargeText ? 'text-[17px]' : 'text-[15px]'
      }`}
    >
      {/* Accessible Navigation Bar */}
      <Navbar
        onReset={handleResetToForm}
        hasItinerary={Boolean(itineraryData)}
        onPrint={handlePrint}
        onOpenSavedTrips={() => setIsSavedTripsModalOpen(true)}
        isLargeText={isLargeText}
        onToggleLargeText={() => setIsLargeText((prev) => !prev)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
        currency={activeCurrency}
      />

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Error notification banner */}
        {errorMessage && (
          <div className="mb-6 mx-auto max-w-4xl rounded-3xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-[#FFD4D4] dark:bg-[#3E1B1B] p-5 text-[#1A1A1A] dark:text-[#FEE2E2] shadow-[4px_4px_0px_0px_#1A1A1A] dark:shadow-[4px_4px_0px_0px_#000000]">
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-white dark:bg-[#1E232B] text-[#1A1A1A] dark:text-[#FEE2E2] shadow-[2px_2px_0px_0px_#1A1A1A]">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <p className="font-black text-[#1A1A1A] dark:text-[#FEE2E2] text-sm sm:text-base">Notice</p>
                <p className="mt-0.5 text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-300 leading-relaxed">{errorMessage}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleGenerateItinerary()}
                    disabled={isLoading}
                    className="inline-flex items-center gap-1.5 rounded-xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-[#C5E876] px-3.5 py-1.5 text-xs font-black text-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] transition hover:bg-[#b8dd67] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:opacity-50"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>{isLoading ? 'Retrying...' : 'Retry Generation'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectPreset(0)}
                    className="inline-flex items-center gap-1 rounded-xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-white dark:bg-[#1E232B] px-3 py-1.5 text-xs font-bold text-[#1A1A1A] dark:text-[#F3F4F6] shadow-[2px_2px_0px_0px_#1A1A1A] transition hover:bg-stone-50 dark:hover:bg-[#28303B]"
                  >
                    <span>Load Kyoto Trip</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectPreset(1)}
                    className="inline-flex items-center gap-1 rounded-xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-white dark:bg-[#1E232B] px-3 py-1.5 text-xs font-bold text-[#1A1A1A] dark:text-[#F3F4F6] shadow-[2px_2px_0px_0px_#1A1A1A] transition hover:bg-stone-50 dark:hover:bg-[#28303B]"
                  >
                    <span>Load Jaipur Trip</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectPreset(2)}
                    className="inline-flex items-center gap-1 rounded-xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-white dark:bg-[#1E232B] px-3 py-1.5 text-xs font-bold text-[#1A1A1A] dark:text-[#F3F4F6] shadow-[2px_2px_0px_0px_#1A1A1A] transition hover:bg-stone-50 dark:hover:bg-[#28303B]"
                  >
                    <span>Load Paris Trip</span>
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="rounded-xl border border-[#1A1A1A] dark:border-[#384152] bg-white dark:bg-[#1E232B] px-2.5 py-1 text-xs font-bold text-[#1A1A1A] dark:text-[#F3F4F6] hover:bg-stone-100 dark:hover:bg-[#28303B]"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* View Switching */}
        {viewMode === 'form' || !itineraryData ? (
          <PlannerForm
            inputs={inputs}
            onChange={setInputs}
            onSubmit={handleGenerateItinerary}
            isLoading={isLoading}
            onSelectPreset={handleSelectPreset}
            isLargeText={isLargeText}
          />
        ) : (
          <ItineraryView
            plan={itineraryData}
            originCity={inputs.origin_city}
            startDate={inputs.start_date}
            completedActivities={completedActivities}
            onToggleComplete={handleToggleActivity}
            onOpenSwapModal={handleOpenSwapModal}
            onPrintPdf={handlePrint}
            isLargeText={isLargeText}
          />
        )}
      </main>

      {/* Clean Bento Footer */}
      <footer className="mt-16 border-t-2 border-[#1A1A1A] dark:border-[#384152] bg-white dark:bg-[#14171D] py-8 text-center text-xs text-stone-600 dark:text-stone-400 print:hidden transition-colors">
        <div className="mx-auto max-w-7xl px-4 space-y-1">
          <p className="font-black text-[#1A1A1A] dark:text-[#F3F4F6]">
            Global Travel Itinerary Planner • Multi-Currency • Google Maps & Calendar Import • Flights & Stays
          </p>
          <p className="font-medium text-stone-500 dark:text-stone-400">
            Geographically clustered daily routes, 6–8 curated stays & dining spots, seasonal weather intelligence, and senior-friendly accessible navigation.
          </p>
        </div>
      </footer>

      {/* Swap Activity Modal */}
      <ActivitySwapModal
        isOpen={swapModalState.isOpen}
        onClose={() => setSwapModalState((prev) => ({ ...prev, isOpen: false }))}
        dayNumber={swapModalState.dayNumber}
        currentActivity={swapModalState.activity}
        geographicalFocus={swapModalState.geoFocus}
        destination={inputs.destination}
        onConfirmSwap={handleConfirmSwap}
        isLargeText={isLargeText}
      />

      {/* Saved Trips Manager Modal */}
      <SavedTripsModal
        isOpen={isSavedTripsModalOpen}
        onClose={() => setIsSavedTripsModalOpen(false)}
        onSelectTrip={handleSelectSavedTrip}
      />
    </div>
  );
}
