import React, { useState } from 'react';
import { X, RefreshCw, Sparkles, Wand2 } from 'lucide-react';
import { ActivityItem } from '../types';

interface ActivitySwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayNumber: number;
  currentActivity: ActivityItem | null;
  geographicalFocus: string;
  destination: string;
  onConfirmSwap: (dayNumber: number, oldActivity: ActivityItem, newActivity: ActivityItem) => void;
  isLargeText: boolean;
}

const PRESET_VIBES = [
  'More relaxing / Peaceful / Low walking',
  'Authentic local food & tea stop',
  'Indoor cultural museum / art gallery',
  'Historic temple / heritage architecture',
  'Scenic viewpoint / garden stroll',
  'Traditional market / shopping experience',
];

export const ActivitySwapModal: React.FC<ActivitySwapModalProps> = ({
  isOpen,
  onClose,
  dayNumber,
  currentActivity,
  geographicalFocus,
  destination,
  onConfirmSwap,
  isLargeText,
}) => {
  const [preference, setPreference] = useState('');
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapError, setSwapError] = useState<string | null>(null);

  if (!isOpen || !currentActivity) return null;

  const handleSwap = async (customPref?: string) => {
    const prefToUse = customPref || preference;
    setIsSwapping(true);
    setSwapError(null);

    try {
      const response = await fetch('/api/swap-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          dayNumber,
          geographicalFocus,
          currentActivity,
          userPreference: prefToUse || 'A relaxing, accessible nearby alternative',
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to replace activity');
      }

      onConfirmSwap(dayNumber, currentActivity, data.activity);
      onClose();
    } catch (err: any) {
      console.error('Swap error:', err);
      setSwapError(err.message || 'Could not generate alternative activity. Please try again.');
    } finally {
      setIsSwapping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-[#FFFFFF] dark:bg-[#1E232B] border-2 border-[#1A1A1A] dark:border-[#384152] rounded-3xl shadow-[8px_8px_0px_0px_#1A1A1A] dark:shadow-[8px_8px_0px_0px_#000000] p-6 sm:p-8 space-y-5 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#1A1A1A] dark:border-[#384152]">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-[#C5E876] border-2 border-[#1A1A1A] dark:border-[#384152] rounded-xl shadow-[2px_2px_0px_0px_#1A1A1A]">
              <RefreshCw className="w-4 h-4 text-[#1A1A1A]" />
            </span>
            <h3 className="text-lg font-black text-[#1A1A1A] dark:text-[#F3F4F6]">
              Swap Day {dayNumber} Activity
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-500 hover:text-[#1A1A1A] dark:hover:text-white rounded-lg border border-transparent hover:border-[#1A1A1A]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Activity Box */}
        <div className="rounded-2xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-[#FAF9F5] dark:bg-[#14171D] p-4 space-y-1">
          <span className="text-[11px] font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Replacing Activity:
          </span>
          <p className="font-black text-[#1A1A1A] dark:text-[#F3F4F6] text-base">{currentActivity.activity_name}</p>
          <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2">{currentActivity.description}</p>
        </div>

        {/* Preset Preferences */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-stone-600 dark:text-stone-300">
            Select Replacement Vibe or Nearby Style:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PRESET_VIBES.map((vibe, idx) => (
              <button
                key={idx}
                type="button"
                disabled={isSwapping}
                onClick={() => handleSwap(vibe)}
                className="text-left p-2.5 rounded-xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-white dark:bg-[#14171D] hover:bg-[#C5E876] dark:hover:bg-[#C5E876] text-[#1A1A1A] dark:text-[#F3F4F6] dark:hover:text-[#1A1A1A] text-xs font-bold shadow-[2px_2px_0px_0px_#1A1A1A] dark:shadow-[2px_2px_0px_0px_#000000] transition active:translate-x-[1px] active:translate-y-[1px] disabled:opacity-50"
              >
                {vibe}
              </button>
            ))}
          </div>
        </div>

        {/* Custom prompt input */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-stone-600 dark:text-stone-300">
            Or describe custom replacement request:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={preference}
              onChange={(e) => setPreference(e.target.value)}
              placeholder="e.g. Vegetarian food stall, indoor pottery workshop..."
              disabled={isSwapping}
              className="flex-1 px-3 py-2 text-xs font-bold border-2 border-[#1A1A1A] dark:border-[#384152] rounded-xl bg-white dark:bg-[#14171D] text-[#1A1A1A] dark:text-[#F3F4F6] focus:outline-hidden focus:ring-2 focus:ring-[#3B82F6]"
            />
            <button
              type="button"
              disabled={isSwapping}
              onClick={() => handleSwap()}
              className="px-4 py-2 bg-[#1A1A1A] dark:bg-[#C5E876] text-white dark:text-[#1A1A1A] font-black text-xs border-2 border-[#1A1A1A] dark:border-[#384152] rounded-xl shadow-[2px_2px_0px_0px_#1A1A1A] hover:bg-stone-800 dark:hover:bg-[#B5DC64] transition disabled:opacity-50 flex items-center gap-1.5"
            >
              {isSwapping ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Wand2 className="w-3.5 h-3.5" />
              )}
              <span>{isSwapping ? 'Swapping...' : 'Swap'}</span>
            </button>
          </div>
        </div>

        {swapError && (
          <div className="p-3 bg-[#FEE2E2] dark:bg-[#3E1B1B] border-2 border-[#EF4444] rounded-xl text-xs font-bold text-[#991B1B] dark:text-[#FCA5A5]">
            {swapError}
          </div>
        )}
      </div>
    </div>
  );
};
