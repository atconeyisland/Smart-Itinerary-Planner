import React from 'react';
import {
  Clock,
  MapPin,
  RefreshCw,
  CheckCircle2,
  Circle,
  Sunrise,
  Sun,
  Sunset,
  Lightbulb,
  ExternalLink,
  CalendarPlus,
  Navigation,
  Sparkles,
  Landmark,
  Compass,
} from 'lucide-react';
import { DayItinerary, ActivityItem } from '../types';
import {
  generatePlaceGoogleMapsUrl,
  generateDayGoogleMapsUrl,
  generateDayGoogleCalendarUrl,
} from '../utils/mapExportUtils';
import { getFormattedDayDate } from '../utils/seasonUtils';

interface DayScheduleCardProps {
  day: DayItinerary;
  destination: string;
  startDateStr?: string;
  completedActivities: Record<string, boolean>;
  onToggleComplete: (activityKey: string) => void;
  onOpenSwapModal: (dayNumber: number, activity: ActivityItem, geoFocus: string) => void;
  isLargeText: boolean;
}

export const DayScheduleCard: React.FC<DayScheduleCardProps> = ({
  day,
  destination,
  startDateStr,
  completedActivities,
  onToggleComplete,
  onOpenSwapModal,
  isLargeText,
}) => {
  const activeStart = startDateStr || (() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  })();

  const dayDateMeta = getFormattedDayDate(activeStart, day.day_number - 1);
  const dayMapsUrl = generateDayGoogleMapsUrl(day, destination);
  const dayCalUrl = generateDayGoogleCalendarUrl(day, destination, activeStart);

  const getSlotDetails = (slot: string) => {
    const s = slot.toLowerCase();
    if (s.includes('morning')) {
      return {
        icon: <Sunrise className="h-4 w-4 text-[#EA580C] dark:text-[#FB923C]" />,
        bg: 'bg-[#FEF3C7] dark:bg-[#3D2817]',
        text: 'text-[#92400E] dark:text-[#FDE68A]',
        border: 'border-[#F59E0B] dark:border-[#B45309]',
        label: 'Morning (9:00 AM - 12:30 PM)',
      };
    }
    if (s.includes('afternoon')) {
      return {
        icon: <Sun className="h-4 w-4 text-[#D97706] dark:text-[#FBBF24]" />,
        bg: 'bg-[#E0F2FE] dark:bg-[#142A45]',
        text: 'text-[#075985] dark:text-[#BAE6FD]',
        border: 'border-[#38BDF8] dark:border-[#0284C7]',
        label: 'Afternoon (1:30 PM - 5:00 PM)',
      };
    }
    return {
      icon: <Sunset className="h-4 w-4 text-[#7C3AED] dark:text-[#A78BFA]" />,
      bg: 'bg-[#F3E8FF] dark:bg-[#2C194D]',
      text: 'text-[#6B21A8] dark:text-[#E9D5FF]',
      border: 'border-[#C084FC] dark:border-[#7E22CE]',
      label: 'Evening (6:00 PM - 9:30 PM)',
    };
  };

  const titleSize = isLargeText ? 'text-lg sm:text-xl font-black' : 'text-base sm:text-lg font-black';
  const bodySize = isLargeText ? 'text-base' : 'text-sm';

  return (
    <div className="overflow-hidden rounded-3xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-white dark:bg-[#1E232B] shadow-[6px_6px_0px_0px_#1A1A1A] dark:shadow-[6px_6px_0px_0px_#000000] transition-colors">
      {/* Day Header Banner */}
      <div className="border-b-2 border-[#1A1A1A] dark:border-[#384152] bg-[#F3F4F1] dark:bg-[#14171D] p-5 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-[#C5E876] font-black text-base text-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] dark:shadow-[2px_2px_0px_0px_#000000]">
              D{day.day_number}
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className={`font-black text-[#1A1A1A] dark:text-[#F3F4F6] ${titleSize}`}>
                  {day.day_theme}
                </h3>
                <span className="rounded-lg border border-[#1A1A1A] dark:border-[#384152] bg-white dark:bg-[#1E232B] px-2.5 py-0.5 text-xs font-black text-[#1A1A1A] dark:text-[#F3F4F6]">
                  {dayDateMeta.formattedShort}
                </span>
              </div>
              <div className="mt-0.5 flex items-center gap-1 text-xs font-bold text-stone-600 dark:text-stone-400">
                <MapPin className="h-3.5 w-3.5 text-[#3B82F6] dark:text-[#60A5FA]" />
                <span>Area Focus: {day.geographical_focus}</span>
              </div>
            </div>
          </div>

          {/* Quick Day Actions */}
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto print:hidden">
            {/* Open Day Route in Google Maps */}
            <a
              href={dayMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-white dark:bg-[#1E232B] px-3 py-1.5 text-xs font-bold text-[#1A1A1A] dark:text-[#F3F4F6] shadow-[2px_2px_0px_0px_#1A1A1A] dark:shadow-[2px_2px_0px_0px_#000000] transition hover:bg-[#C5E876] dark:hover:bg-[#C5E876] dark:hover:text-[#1A1A1A] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
              title="Open all stops for this day in Google Maps with turn-by-turn route"
            >
              <Navigation className="h-3.5 w-3.5 text-[#3B82F6]" />
              <span>Day Route on Google Maps</span>
              <ExternalLink className="h-3 w-3 text-stone-400" />
            </a>

            {/* Add Day to Google Calendar */}
            <a
              href={dayCalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-white dark:bg-[#1E232B] px-3 py-1.5 text-xs font-bold text-[#1A1A1A] dark:text-[#F3F4F6] shadow-[2px_2px_0px_0px_#1A1A1A] dark:shadow-[2px_2px_0px_0px_#000000] transition hover:bg-[#E0F2FE] dark:hover:bg-[#142A45] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
              title="Add this day schedule directly to Google Calendar"
            >
              <CalendarPlus className="h-3.5 w-3.5 text-[#10B981]" />
              <span>Add to Google Calendar</span>
            </a>
          </div>
        </div>
      </div>

      {/* Activities List */}
      <div className="divide-y-2 divide-stone-100 dark:divide-[#28303B] p-4 sm:p-6 space-y-6 sm:space-y-0">
        {(day.schedule || []).map((item, idx) => {
          const activityKey = `day-${day.day_number}-act-${idx}`;
          const isDone = Boolean(completedActivities[activityKey]);
          const slotMeta = getSlotDetails(item.time_slot);
          const placeMapsUrl = generatePlaceGoogleMapsUrl(item.activity_name, destination, day.geographical_focus);

          return (
            <div
              key={idx}
              className={`py-5 first:pt-0 last:pb-0 transition ${
                isDone ? 'opacity-60' : 'opacity-100'
              }`}
            >
              <div className="rounded-2xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-[#FAF9F5] dark:bg-[#14171D] p-4 sm:p-5 shadow-[3px_3px_0px_0px_#1A1A1A] dark:shadow-[3px_3px_0px_0px_#000000] space-y-3">
                {/* Header Row: Slot badge, Title, Duration, Cost, Checkbox, Actions */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3">
                    {/* Done Checkbox */}
                    <button
                      type="button"
                      onClick={() => onToggleComplete(activityKey)}
                      className="mt-1 text-stone-400 transition hover:text-[#1A1A1A] dark:hover:text-white focus:outline-hidden shrink-0"
                      title={isDone ? 'Mark as to-do' : 'Mark as visited'}
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-6 w-6 text-[#1A1A1A] dark:text-[#C5E876] fill-[#C5E876] dark:fill-[#1A1A1A]" />
                      ) : (
                        <Circle className="h-6 w-6 text-stone-400 hover:text-stone-700 dark:hover:text-stone-300" />
                      )}
                    </button>

                    <div className="space-y-1">
                      {/* Slot Badge */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-black ${slotMeta.bg} ${slotMeta.text} ${slotMeta.border}`}
                        >
                          {slotMeta.icon}
                          <span>{item.time_slot}</span>
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-md border border-[#1A1A1A] dark:border-[#384152] bg-white dark:bg-[#1E232B] px-2 py-0.5 text-xs font-bold text-stone-700 dark:text-stone-300">
                          <Clock className="h-3 w-3 text-stone-500" />
                          {item.estimated_duration_hours} hrs
                        </span>
                        <span className="inline-flex items-center rounded-md border border-[#1A1A1A] dark:border-[#384152] bg-[#C5E876] dark:bg-[#C5E876] px-2 py-0.5 text-xs font-black text-[#1A1A1A]">
                          {item.cost_tier}
                        </span>
                      </div>

                      {/* Activity Name */}
                      <h4
                        className={`font-black text-[#1A1A1A] dark:text-[#F3F4F6] ${
                          isDone ? 'line-through text-stone-500 dark:text-stone-500' : ''
                        } ${isLargeText ? 'text-lg' : 'text-base sm:text-lg'}`}
                      >
                        {item.activity_name}
                      </h4>
                    </div>
                  </div>

                  {/* Activity Actions: Google Maps Link & Swap */}
                  <div className="flex flex-wrap items-center gap-2 sm:self-start print:hidden">
                    <a
                      href={placeMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-white dark:bg-[#1E232B] px-3 py-1.5 text-xs font-bold text-[#1A1A1A] dark:text-[#F3F4F6] shadow-[2px_2px_0px_0px_#1A1A1A] dark:shadow-[2px_2px_0px_0px_#000000] transition hover:bg-[#C5E876] dark:hover:bg-[#C5E876] dark:hover:text-[#1A1A1A] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                      title={`Open ${item.activity_name} on Google Maps`}
                    >
                      <MapPin className="h-3.5 w-3.5 text-[#EA4335]" />
                      <span>Open on Google Maps</span>
                      <ExternalLink className="h-3 w-3 text-stone-400" />
                    </a>

                    <button
                      type="button"
                      onClick={() => onOpenSwapModal(day.day_number, item, day.geographical_focus)}
                      className="inline-flex items-center gap-1 rounded-xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-white dark:bg-[#1E232B] px-3 py-1.5 text-xs font-bold text-[#1A1A1A] dark:text-[#F3F4F6] shadow-[2px_2px_0px_0px_#1A1A1A] dark:shadow-[2px_2px_0px_0px_#000000] transition hover:bg-[#C5E876] dark:hover:bg-[#C5E876] dark:hover:text-[#1A1A1A] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                      title="Replace with an alternative nearby attraction"
                    >
                      <RefreshCw className="h-3 w-3" />
                      <span>Swap</span>
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p className={`font-medium text-stone-700 dark:text-stone-300 leading-relaxed ${bodySize}`}>
                  {item.description}
                </p>

                {/* Practical Insider Tip Box */}
                {item.insider_tip && (
                  <div className="rounded-xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-[#FFD4D4] dark:bg-[#382126] p-3 shadow-[2px_2px_0px_0px_#1A1A1A] dark:shadow-[2px_2px_0px_0px_#000000]">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-[#1A1A1A] dark:text-[#FCA5A5]" />
                      <p className={`text-xs sm:text-sm text-[#1A1A1A] dark:text-[#FEE2E2] font-semibold ${isLargeText ? 'text-base' : ''}`}>
                        <strong className="font-black">Local Tip: </strong>
                        {item.insider_tip}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
