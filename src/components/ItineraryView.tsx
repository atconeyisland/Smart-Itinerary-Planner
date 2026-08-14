import React, { useState, useRef } from 'react';
import {
  Calendar,
  Building2,
  UtensilsCrossed,
  Languages,
  Compass,
  Sparkles,
  MapPin,
  Plane,
  Navigation,
  ExternalLink,
  BookmarkPlus,
  BookmarkCheck,
  CalendarPlus,
  CloudSun,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import { ItineraryPlanResponse, ActivityItem } from '../types';
import { TripSummaryHeader } from './TripSummaryHeader';
import { DayScheduleCard } from './DayScheduleCard';
import { CostBreakdownCard } from './CostBreakdownCard';
import { LogisticsGuideCard } from './LogisticsGuideCard';
import { HotelSection } from './HotelSection';
import { RestaurantSection } from './RestaurantSection';
import { SurvivalPhrasesSection } from './SurvivalPhrasesSection';
import { FunFactsSection } from './FunFactsSection';
import { InteractiveMapWidget } from './InteractiveMapWidget';
import { FlightFinderSection } from './FlightFinderSection';
import { saveTripToStorage, isTripSaved } from '../utils/storageUtils';
import { generateTripGoogleMapsUrl, generateFullTripGoogleCalendarUrl } from '../utils/mapExportUtils';
import { getSeasonAnalysis } from '../utils/seasonUtils';

interface ItineraryViewProps {
  plan: ItineraryPlanResponse;
  originCity?: string;
  startDate?: string;
  completedActivities: Record<string, boolean>;
  onToggleComplete: (activityKey: string) => void;
  onOpenSwapModal: (dayNumber: number, activity: ActivityItem, geoFocus: string) => void;
  onPrintPdf: () => void;
  isLargeText: boolean;
}

type TabType = 'schedule' | 'map' | 'flights' | 'hotels' | 'restaurants' | 'phrases' | 'logistics';

export const ItineraryView: React.FC<ItineraryViewProps> = ({
  plan,
  originCity = '',
  startDate: initialStartDate,
  completedActivities,
  onToggleComplete,
  onOpenSwapModal,
  onPrintPdf,
  isLargeText,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('schedule');
  const [selectedDayFilter, setSelectedDayFilter] = useState<number | 'all'>('all');
  const [isSaved, setIsSaved] = useState<boolean>(() => isTripSaved(plan));
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const tabContentRef = useRef<HTMLDivElement | null>(null);

  // Active travel start date with user adjustment capability
  const [activeStartDate, setActiveStartDate] = useState<string>(() => {
    if (initialStartDate) return initialStartDate;
    if (plan.trip_summary.start_date) return plan.trip_summary.start_date;
    const d = new Date();
    d.setDate(d.getDate() + 7);
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  });

  const seasonInfo = getSeasonAnalysis(plan.trip_summary.destination, activeStartDate);
  const tripMapsUrl = generateTripGoogleMapsUrl(plan);
  const tripCalendarUrl = generateFullTripGoogleCalendarUrl(plan, activeStartDate);

  const itineraryList = plan?.itinerary || [];

  const filteredDays =
    selectedDayFilter === 'all'
      ? itineraryList
      : itineraryList.filter((d) => d.day_number === selectedDayFilter);

  const handleSaveTrip = () => {
    saveTripToStorage({
      ...plan,
      trip_summary: {
        ...plan.trip_summary,
        start_date: activeStartDate,
      },
    });
    setIsSaved(true);
    setSaveToast('Trip saved to your browser storage!');
    setTimeout(() => setSaveToast(null), 3500);
  };

  const handleTabChange = (tabId: TabType) => {
    setActiveTab(tabId);
    // Smooth scroll down to the active tab content area so user sees the newly switched tab immediately
    if (tabContentRef.current) {
      tabContentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const tabs = [
    {
      id: 'schedule' as TabType,
      label: 'Day-by-Day Plan',
      icon: Calendar,
      count: itineraryList.length ? `${itineraryList.length} Days` : undefined,
    },
    {
      id: 'map' as TabType,
      label: 'Interactive Map & Routes',
      icon: MapPin,
      badge: 'Google Maps',
    },
    {
      id: 'flights' as TabType,
      label: 'Flights & Transit',
      icon: Plane,
      count: plan.flight_analysis ? 'Airlines' : undefined,
    },
    {
      id: 'hotels' as TabType,
      label: 'Hotels & Stays',
      icon: Building2,
      count: plan.hotel_recommendations?.length ? `${plan.hotel_recommendations.length}` : undefined,
    },
    {
      id: 'restaurants' as TabType,
      label: 'Food & Dining',
      icon: UtensilsCrossed,
      count: plan.restaurant_recommendations?.length ? `${plan.restaurant_recommendations.length}` : undefined,
    },
    {
      id: 'phrases' as TabType,
      label: 'Phrasebook & Dialect',
      icon: Languages,
      count: plan.local_phrases?.length ? `${plan.local_phrases.length}` : undefined,
    },
    {
      id: 'logistics' as TabType,
      label: 'Tips & Logistics',
      icon: Compass,
    },
  ];

  return (
    <div className="space-y-6" id="itinerary-main-view">
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#1A1A1A] dark:bg-[#1E232B] text-white px-4 py-3 rounded-2xl border-2 border-white dark:border-[#384152] shadow-[4px_4px_0px_0px_#10B981] animate-in fade-in slide-in-from-top-4 text-xs sm:text-sm font-black flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-[#10B981]" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Hero Summary Header (Top of Overview) */}
      <TripSummaryHeader
        summary={plan.trip_summary}
        estimatedCosts={plan.estimated_costs}
        onPrintPdf={onPrintPdf}
        isLargeText={isLargeText}
        startDateStr={activeStartDate}
      />

      {/* Action Toolbar: Google Maps Import, Google Calendar Sync, Save Trip, Date Adjustment */}
      <div className="print:hidden rounded-2xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-[#FAF9F5] dark:bg-[#14171D] p-3 sm:p-4 shadow-[4px_4px_0px_0px_#1A1A1A] dark:shadow-[4px_4px_0px_0px_#000000] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 transition-colors">
        {/* Left Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Save to Browser */}
          <button
            onClick={handleSaveTrip}
            id="btn-save-trip-storage"
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-black border-2 border-[#1A1A1A] dark:border-[#384152] rounded-xl shadow-[2px_2px_0px_0px_#1A1A1A] dark:shadow-[2px_2px_0px_0px_#000000] transition-all hover:translate-y-[-1px] ${
              isSaved
                ? 'bg-[#DCFCE7] dark:bg-[#163D27] text-[#166534] dark:text-[#86EFAC]'
                : 'bg-[#FFFFFF] dark:bg-[#1E232B] text-[#1A1A1A] dark:text-[#F3F4F6] hover:bg-[#F3F4F1] dark:hover:bg-[#28303B]'
            }`}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="w-4 h-4 text-[#166534] dark:text-[#86EFAC]" />
                <span>Saved to Browser</span>
              </>
            ) : (
              <>
                <BookmarkPlus className="w-4 h-4 text-[#3B82F6]" />
                <span>Save This Trip</span>
              </>
            )}
          </button>

          {/* Import to Google Maps */}
          <a
            href={tripMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            id="btn-open-google-maps"
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-black bg-[#C5E876] text-[#1A1A1A] border-2 border-[#1A1A1A] dark:border-[#384152] rounded-xl shadow-[2px_2px_0px_0px_#1A1A1A] dark:shadow-[2px_2px_0px_0px_#000000] transition-all hover:translate-y-[-1px]"
            title="Import and view entire multi-stop route on Google Maps"
          >
            <Navigation className="w-4 h-4 text-[#1A1A1A]" />
            <span>Open on Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* Add to Google Calendar */}
          <a
            href={tripCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            id="btn-sync-calendar"
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-black bg-[#FFFFFF] dark:bg-[#1E232B] hover:bg-[#F3F4F1] dark:hover:bg-[#28303B] text-[#1A1A1A] dark:text-[#F3F4F6] border-2 border-[#1A1A1A] dark:border-[#384152] rounded-xl shadow-[2px_2px_0px_0px_#1A1A1A] dark:shadow-[2px_2px_0px_0px_#000000] transition-all hover:translate-y-[-1px]"
            title="Import all daily activities into Google Calendar"
          >
            <CalendarPlus className="w-4 h-4 text-[#10B981]" />
            <span>Add to Google Calendar</span>
          </a>
        </div>

        {/* Right: Date and Season Context Picker */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-stone-500 dark:text-stone-400 uppercase tracking-wider">
            Travel Start Date:
          </span>
          <input
            type="date"
            value={activeStartDate}
            onChange={(e) => {
              if (e.target.value) setActiveStartDate(e.target.value);
            }}
            className="px-2.5 py-1 text-xs font-black border-2 border-[#1A1A1A] dark:border-[#384152] rounded-xl bg-white dark:bg-[#1E232B] text-[#1A1A1A] dark:text-[#F3F4F6] shadow-xs"
          />
        </div>
      </div>

      {/* Main Tab Navigation Bar - Anchored directly above the dynamic tab page content */}
      <div
        ref={tabContentRef}
        className="print:hidden rounded-2xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-white dark:bg-[#1E232B] p-2 shadow-[4px_4px_0px_0px_#1A1A1A] dark:shadow-[4px_4px_0px_0px_#000000] sticky top-16 z-30 backdrop-blur-md transition-colors"
      >
        <div className="flex items-center justify-between px-2 py-1 mb-1 border-b border-stone-200 dark:border-[#2E3744] text-[11px] font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
          <span>Itinerary Sections & Guides:</span>
          <span className="text-[#3B82F6] dark:text-[#60A5FA]">
            Viewing: {tabs.find((t) => t.id === activeTab)?.label}
          </span>
        </div>

        <nav className="flex flex-wrap items-center gap-1.5 sm:gap-2" aria-label="Main Trip Navigation Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                id={`tab-btn-${tab.id}`}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-1.5 sm:gap-2 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-black transition cursor-pointer ${
                  isActive
                    ? 'border-2 border-[#1A1A1A] dark:border-[#384152] bg-[#C5E876] text-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] dark:shadow-[2px_2px_0px_0px_#000000] scale-[1.02]'
                    : 'border-2 border-transparent text-stone-700 dark:text-stone-300 hover:border-[#1A1A1A] dark:hover:border-[#384152] hover:bg-stone-50 dark:hover:bg-[#14171D]'
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-[#1A1A1A]' : 'text-stone-500 dark:text-stone-400'}`} />
                <span>{tab.label}</span>
                {tab.count && (
                  <span
                    className={`rounded-md border border-[#1A1A1A] dark:border-[#384152] px-1.5 py-0.5 text-[11px] font-black ${
                      isActive
                        ? 'bg-white text-[#1A1A1A]'
                        : 'bg-stone-100 dark:bg-[#14171D] text-stone-800 dark:text-stone-300'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
                {tab.badge && (
                  <span className="hidden md:inline-block rounded-md border border-[#1A1A1A] dark:border-[#384152] bg-[#3B82F6] text-white px-1.5 py-0.5 text-[10px] font-black">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab 1: Day-by-Day Schedule */}
      {activeTab === 'schedule' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Day Selector Filter */}
          <div className="print:hidden flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-white dark:bg-[#1E232B] p-4 shadow-[3px_3px_0px_0px_#1A1A1A] dark:shadow-[3px_3px_0px_0px_#000000] transition-colors">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Filter Day:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedDayFilter('all')}
                  className={`rounded-xl border-2 border-[#1A1A1A] dark:border-[#384152] px-3.5 py-1.5 text-xs font-black transition ${
                    selectedDayFilter === 'all'
                      ? 'bg-[#1A1A1A] dark:bg-[#C5E876] text-white dark:text-[#1A1A1A] shadow-[2px_2px_0px_0px_#3B82F6]'
                      : 'bg-white dark:bg-[#14171D] text-[#1A1A1A] dark:text-[#F3F4F6] hover:bg-[#F3F4F1] dark:hover:bg-[#28303B]'
                  }`}
                >
                  All Days ({itineraryList.length})
                </button>
                {itineraryList.map((d) => (
                  <button
                    key={d.day_number}
                    type="button"
                    onClick={() => setSelectedDayFilter(d.day_number)}
                    className={`rounded-xl border-2 border-[#1A1A1A] dark:border-[#384152] px-3.5 py-1.5 text-xs font-black transition ${
                      selectedDayFilter === d.day_number
                        ? 'bg-[#3B82F6] text-white shadow-[2px_2px_0px_0px_#1A1A1A]'
                        : 'bg-white dark:bg-[#14171D] text-[#1A1A1A] dark:text-[#F3F4F6] hover:bg-[#F3F4F1] dark:hover:bg-[#28303B]'
                    }`}
                  >
                    Day {d.day_number}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleTabChange('map')}
                className="inline-flex items-center gap-1.5 text-xs font-black text-[#3B82F6] dark:text-[#60A5FA] hover:underline cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Switch to Full Interactive Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Day Schedule Cards */}
          <div className="space-y-6">
            {filteredDays.map((day) => (
              <DayScheduleCard
                key={day.day_number}
                day={day}
                destination={plan.trip_summary.destination}
                startDateStr={activeStartDate}
                completedActivities={completedActivities}
                onToggleComplete={onToggleComplete}
                onOpenSwapModal={onOpenSwapModal}
                isLargeText={isLargeText}
              />
            ))}
          </div>

          {/* Embedded Interactive Map for Quick Waypoint Visuals */}
          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-[#1A1A1A] dark:text-[#F3F4F6]">Trip Route & Waypoints Overview</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 font-semibold">Interactive map of all daily itinerary spots</p>
              </div>
              <button
                onClick={() => handleTabChange('map')}
                className="text-xs font-black text-[#3B82F6] dark:text-[#60A5FA] hover:underline flex items-center gap-1"
              >
                <span>Full Map Tab</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <InteractiveMapWidget
              plan={plan}
              selectedDay={selectedDayFilter === 'all' ? undefined : selectedDayFilter}
              onSelectDay={(dayNum) => setSelectedDayFilter(dayNum === 0 ? 'all' : dayNum)}
            />
          </div>

          {/* Cost Breakdown in Plan Currency */}
          <CostBreakdownCard
            costs={plan.estimated_costs}
            totalDays={plan.trip_summary.total_days}
            isLargeText={isLargeText}
          />

          {/* Researched Fun Facts & Trivia */}
          <FunFactsSection
            funFacts={plan.fun_facts}
            destination={plan.trip_summary.destination}
            isLargeText={isLargeText}
          />
        </div>
      )}

      {/* Tab 2: Interactive Map & Google Maps Routes */}
      {activeTab === 'map' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="rounded-3xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-[#FAF9F5] dark:bg-[#14171D] p-6 shadow-[4px_4px_0px_0px_#1A1A1A] dark:shadow-[4px_4px_0px_0px_#000000] flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#C5E876] text-[#1A1A1A] border-2 border-[#1A1A1A] dark:border-[#384152] rounded-2xl shadow-[2px_2px_0px_0px_#1A1A1A]">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-[#1A1A1A] dark:text-[#F3F4F6] tracking-tight">
                  Interactive Route Map & Waypoints
                </h2>
                <p className="text-sm font-medium text-stone-600 dark:text-stone-300">
                  Filter by day or category, explore pins, and export live multi-stop routes directly to Google Maps.
                </p>
              </div>
            </div>

            <a
              href={tripMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#3B82F6] text-white text-xs sm:text-sm font-black border-2 border-[#1A1A1A] dark:border-[#384152] rounded-xl shadow-[2px_2px_0px_0px_#1A1A1A] hover:bg-blue-600 transition"
            >
              <Navigation className="w-4 h-4" />
              <span>Open Complete Route on Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <InteractiveMapWidget plan={plan} />
        </div>
      )}

      {/* Tab 3: Flights & Transit */}
      {activeTab === 'flights' && (
        <div className="animate-in fade-in duration-200">
          <FlightFinderSection plan={plan} initialOrigin={originCity || 'New York (JFK)'} />
        </div>
      )}

      {/* Tab 4: Hotels & Stays */}
      {activeTab === 'hotels' && (
        <div className="animate-in fade-in duration-200">
          <HotelSection
            hotels={plan.hotel_recommendations}
            destination={plan.trip_summary.destination}
            currency={plan.estimated_costs.currency}
            isLargeText={isLargeText}
          />
        </div>
      )}

      {/* Tab 5: Food & Dining */}
      {activeTab === 'restaurants' && (
        <div className="animate-in fade-in duration-200">
          <RestaurantSection
            restaurants={plan.restaurant_recommendations}
            destination={plan.trip_summary.destination}
            currency={plan.estimated_costs.currency}
            isLargeText={isLargeText}
          />
        </div>
      )}

      {/* Tab 6: Survival Phrases & Local Dialect */}
      {activeTab === 'phrases' && (
        <div className="animate-in fade-in duration-200">
          <SurvivalPhrasesSection
            phrases={plan.local_phrases}
            destination={plan.trip_summary.destination}
            isLargeText={isLargeText}
          />
        </div>
      )}

      {/* Tab 7: Tips & Logistics */}
      {activeTab === 'logistics' && (
        <div className="animate-in fade-in duration-200">
          <LogisticsGuideCard
            guide={plan.local_logistics_guide}
            isLargeText={isLargeText}
          />
        </div>
      )}
    </div>
  );
};
