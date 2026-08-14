import React, { useState } from 'react';
import {
  MapPin,
  Calendar,
  Users,
  Wallet,
  Zap,
  Heart,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  BookmarkCheck,
  Check,
  Plane,
  Coins,
  Globe2,
  Sun,
  CloudSun,
} from 'lucide-react';
import { PlannerInputs } from '../types';
import { SAMPLE_PRESETS } from '../sampleData';
import { CURRENCIES, getCurrencySymbol } from '../utils/currencyUtils';
import { getSeasonAnalysis } from '../utils/seasonUtils';

interface PlannerFormProps {
  inputs: PlannerInputs;
  onChange: (inputs: PlannerInputs) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  onSelectPreset: (presetIndex: number) => void;
  isLargeText: boolean;
}

const COMMON_INTERESTS = [
  'Historic Monuments & Palaces',
  'Temples & Sacred Sites',
  'Authentic Local Cuisine & Markets',
  'Peaceful Zen Gardens & Nature',
  'Local Bazaars & Artisan Crafts',
  'World-Class Art & Museums',
  'Scenic Viewpoints & Sunsets',
  'Cultural Shows & Folk Arts',
  'Tea / Coffee Culture',
  'Lakes, Rivers & Boat Rides',
];

const ACCESSIBILITY_OPTIONS = [
  'Senior citizen friendly (easy flat walking & elevators)',
  'Pure vegetarian food options',
  'Wheelchair / step-free accessible',
  'Minimal stairs & frequent rest stops',
  'Early morning peaceful schedule',
  'AC private vehicle transit preferred',
  'Plant-based / Vegan / Halal / Jain friendly',
  'Family with multi-generation friendly',
];

const DESTINATION_SUGGESTIONS = [
  { name: 'Kyoto, Japan', currency: 'USD' },
  { name: 'Jaipur, Rajasthan, India', currency: 'INR' },
  { name: 'Paris, France', currency: 'EUR' },
  { name: 'Rome, Italy', currency: 'EUR' },
  { name: 'Dubai, UAE', currency: 'AED' },
  { name: 'Singapore', currency: 'USD' },
  { name: 'London, UK', currency: 'GBP' },
  { name: 'Goa, India', currency: 'INR' },
  { name: 'Bangkok, Thailand', currency: 'USD' },
  { name: 'New York City, USA', currency: 'USD' },
];

const PACE_OPTIONS = [
  {
    id: 'Relaxed (Senior & Family Friendly)',
    title: 'Relaxed & Comfortable',
    desc: 'Ample rest stops, gentle pacing, minimal rush (ideal for seniors & families)',
  },
  {
    id: 'Balanced (Relaxed Walking)',
    title: 'Balanced',
    desc: '2–3 scenic spots per day with relaxed meal breaks and afternoon rest',
  },
  {
    id: 'Active Sightseeing',
    title: 'Active Sightseeing',
    desc: 'Cover maximum key attractions, neighborhoods, and viewpoints throughout the day',
  },
];

const TRAVELER_OPTIONS = [
  'Family with Senior Citizens & Kids',
  'Senior Couple / Retired Travelers',
  'Couple / Honeymoon',
  'Solo Traveler',
  'Family with Teenagers',
  'Group of Friends',
];

export const PlannerForm: React.FC<PlannerFormProps> = ({
  inputs,
  onChange,
  onSubmit,
  isLoading,
  onSelectPreset,
  isLargeText,
}) => {
  const [customInterest, setCustomInterest] = useState('');
  const [customConstraint, setCustomConstraint] = useState('');

  const currentCurrency = inputs.currency || 'USD';
  const currencySymbol = getCurrencySymbol(currentCurrency);

  // Default start date to 7 days from now if not provided
  const activeStartDate = inputs.start_date || (() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  })();

  const detectedSeason = React.useMemo(() => {
    return getSeasonAnalysis(inputs.destination || 'Kyoto, Japan', activeStartDate);
  }, [inputs.destination, activeStartDate]);

  const currentInterestsList = inputs.interests
    ? inputs.interests.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const currentConstraintsList = inputs.constraints
    ? inputs.constraints.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const toggleInterest = (interest: string) => {
    let updated: string[];
    if (currentInterestsList.includes(interest)) {
      updated = currentInterestsList.filter((i) => i !== interest);
    } else {
      updated = [...currentInterestsList, interest];
    }
    onChange({ ...inputs, interests: updated.join(', ') });
  };

  const addCustomInterest = () => {
    if (customInterest.trim() && !currentInterestsList.includes(customInterest.trim())) {
      const updated = [...currentInterestsList, customInterest.trim()];
      onChange({ ...inputs, interests: updated.join(', ') });
      setCustomInterest('');
    }
  };

  const toggleConstraint = (constraint: string) => {
    let updated: string[];
    if (currentConstraintsList.includes(constraint)) {
      updated = currentConstraintsList.filter((c) => c !== constraint);
    } else {
      updated = [...currentConstraintsList, constraint];
    }
    onChange({ ...inputs, constraints: updated.join(', ') });
  };

  const addCustomConstraint = () => {
    if (customConstraint.trim() && !currentConstraintsList.includes(customConstraint.trim())) {
      const updated = [...currentConstraintsList, customConstraint.trim()];
      onChange({ ...inputs, constraints: updated.join(', ') });
      setCustomConstraint('');
    }
  };

  // Dynamic budget tiers based on active currency
  const dynamicBudgetOptions = React.useMemo(() => {
    if (currentCurrency === 'INR') {
      return [
        {
          id: 'Pocket-Friendly (₹1,500 - ₹3,500/day)',
          title: 'Pocket-Friendly',
          range: '₹1,500 – ₹3,500 / day',
          desc: 'Budget stays, local transport, street food & popular eateries',
        },
        {
          id: 'Comfort / Standard (₹4,000 - ₹9,000/day)',
          title: 'Comfort / Standard',
          range: '₹4,000 – ₹9,000 / day',
          desc: '3-4 star heritage hotels, AC cabs, quality dining & guided monument visits',
        },
        {
          id: 'Premium / Luxury (₹10,000 - ₹25,000+/day)',
          title: 'Premium / Luxury',
          range: '₹10,000 – ₹25,000+ / day',
          desc: '5-star royal palaces, private chauffeured car, fine dining & VIP experiences',
        },
      ];
    } else if (currentCurrency === 'EUR') {
      return [
        {
          id: 'Pocket-Friendly (€60 - €100/day)',
          title: 'Pocket-Friendly',
          range: '€60 – €100 / day',
          desc: 'Budget hotels/hostels, metro passes, bakery snacks & casual bistros',
        },
        {
          id: 'Comfort / Standard (€150 - €250/day)',
          title: 'Comfort / Standard',
          range: '€150 – €250 / day',
          desc: 'Charming boutique hotels, museum passes, sit-down dining & taxis',
        },
        {
          id: 'Premium / Luxury (€400 - €800+/day)',
          title: 'Premium / Luxury',
          range: '€400 – €800+ / day',
          desc: '5-star palace hotels, private chauffeured tours, Michelin dining',
        },
      ];
    } else if (currentCurrency === 'GBP') {
      return [
        {
          id: 'Pocket-Friendly (£50 - £90/day)',
          title: 'Pocket-Friendly',
          range: '£50 – £90 / day',
          desc: 'Budget stays, tube passes, pub food & free museums',
        },
        {
          id: 'Comfort / Standard (£140 - £240/day)',
          title: 'Comfort / Standard',
          range: '£140 – £240 / day',
          desc: 'Boutique central hotels, West End shows & quality dining',
        },
        {
          id: 'Premium / Luxury (£350 - £750+/day)',
          title: 'Premium / Luxury',
          range: '£350 – £750+ / day',
          desc: 'Luxury hotels, private driver, afternoon teas & fine dining',
        },
      ];
    } else {
      // Default USD / other
      return [
        {
          id: `Pocket-Friendly (${currencySymbol}60 - ${currencySymbol}110/day)`,
          title: 'Pocket-Friendly',
          range: `${currencySymbol}60 – ${currencySymbol}110 / day`,
          desc: 'Budget stays, public transit, street food & popular cafes',
        },
        {
          id: `Comfort / Standard (${currencySymbol}150 - ${currencySymbol}280/day)`,
          title: 'Comfort / Standard',
          range: `${currencySymbol}150 – ${currencySymbol}280 / day`,
          desc: 'Boutique 4-star hotels, comfortable transit, quality dining & guided tours',
        },
        {
          id: `Premium / Luxury (${currencySymbol}450 - ${currencySymbol}900+/day)`,
          title: 'Premium / Luxury',
          range: `${currencySymbol}450 – ${currencySymbol}900+ / day`,
          desc: '5-star luxury resorts, private chauffeur, fine dining & VIP entry',
        },
      ];
    }
  }, [currentCurrency, currencySymbol]);

  const textSize = isLargeText ? 'text-base sm:text-lg' : 'text-sm sm:text-base';
  const labelSize = isLargeText ? 'text-base font-black' : 'text-sm font-bold';

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Ready-Made Sample Itineraries Bento Card */}
      <div className="rounded-3xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-[#FFD4D4] dark:bg-[#2D1B22] p-5 sm:p-6 shadow-[4px_4px_0px_0px_#1A1A1A] dark:shadow-[4px_4px_0px_0px_#000000]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-white dark:bg-[#1E232B] text-[#1A1A1A] dark:text-[#F3F4F6] shadow-[2px_2px_0px_0px_#1A1A1A] dark:shadow-[2px_2px_0px_0px_#000000]">
              <BookmarkCheck className="h-6 w-6 text-[#3B82F6] dark:text-[#60A5FA]" />
            </div>
            <div>
              <h2 className="text-base font-black text-[#1A1A1A] dark:text-[#F3F4F6] sm:text-lg">
                Ready-Made Sample Itineraries
              </h2>
              <p className="text-xs sm:text-sm font-medium text-stone-700 dark:text-stone-300">
                Explore complete plans with interactive maps, flight guides, stays and dining options.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {SAMPLE_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectPreset(idx)}
                className="inline-flex items-center gap-1.5 rounded-xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-white dark:bg-[#1E232B] px-3.5 py-1.5 text-xs sm:text-sm font-bold text-[#1A1A1A] dark:text-[#F3F4F6] shadow-[2px_2px_0px_0px_#1A1A1A] dark:shadow-[2px_2px_0px_0px_#000000] transition hover:bg-[#C5E876] dark:hover:bg-[#C5E876] dark:hover:text-[#1A1A1A] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
              >
                <span>{preset.label.split(' ')[0]}</span>
                <span className="rounded-md border border-[#1A1A1A] dark:border-[#384152] bg-[#C5E876] px-1.5 py-0.5 text-[11px] font-black text-[#1A1A1A]">
                  {preset.inputs.duration}D • {getCurrencySymbol(preset.inputs.currency)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Planning Form Bento Card */}
      <form
        onSubmit={onSubmit}
        className="rounded-3xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-white dark:bg-[#1E232B] p-6 sm:p-10 shadow-[6px_6px_0px_0px_#1A1A1A] dark:shadow-[6px_6px_0px_0px_#000000] space-y-8 transition-colors"
      >
        <div>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-2xl font-black tracking-tight text-[#1A1A1A] dark:text-[#F3F4F6] sm:text-3xl">
              Where would you like to travel?
            </h2>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF9F5] dark:bg-[#14171D] border-2 border-[#1A1A1A] dark:border-[#384152] rounded-xl text-xs font-bold text-[#4A5568] dark:text-stone-300">
              <Globe2 className="w-3.5 h-3.5 text-[#3B82F6] dark:text-[#60A5FA]" />
              Worldwide Destinations & Currencies
            </span>
          </div>
          <p className="mt-1 text-sm font-medium text-stone-600 dark:text-stone-400">
            Generate an organized, accessible travel plan with geographic clustering, season adaptation, interactive map routes, flight finder, and local phrasebooks.
          </p>
        </div>

        {/* Section 1: Destination, Duration & Travel Dates */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-12">
          {/* Destination */}
          <div className="sm:col-span-6">
            <label className={`block ${labelSize} text-[#1A1A1A] dark:text-[#F3F4F6] mb-2`}>
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#1A1A1A] dark:text-[#F3F4F6]" />
                Destination City / Country
              </span>
            </label>
            <input
              type="text"
              required
              value={inputs.destination}
              onChange={(e) => onChange({ ...inputs, destination: e.target.value })}
              placeholder="e.g. Kyoto, Japan or Jaipur, Rajasthan or Paris, France"
              className={`w-full rounded-2xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-[#F3F4F1] dark:bg-[#14171D] px-4 py-3.5 ${textSize} font-semibold text-[#1A1A1A] dark:text-[#F3F4F6] placeholder:text-stone-400 focus:bg-white dark:focus:bg-[#1A1E26] focus:outline-hidden focus:ring-2 focus:ring-[#C5E876]`}
            />

            {/* Quick Suggestions */}
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-stone-500 dark:text-stone-400">Popular:</span>
              {DESTINATION_SUGGESTIONS.slice(0, 6).map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => onChange({ ...inputs, destination: item.name, currency: item.currency })}
                  className="rounded-lg border border-[#1A1A1A] dark:border-[#384152] bg-white dark:bg-[#14171D] px-2.5 py-1 text-xs font-bold text-[#1A1A1A] dark:text-[#F3F4F6] transition hover:bg-[#C5E876] dark:hover:bg-[#C5E876] dark:hover:text-[#1A1A1A]"
                >
                  {item.name.split(',')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Travel Start Date */}
          <div className="sm:col-span-3">
            <label className={`block ${labelSize} text-[#1A1A1A] dark:text-[#F3F4F6] mb-2`}>
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#3B82F6] dark:text-[#60A5FA]" />
                Trip Start Date
              </span>
            </label>
            <input
              type="date"
              required
              value={activeStartDate}
              onChange={(e) => onChange({ ...inputs, start_date: e.target.value })}
              className={`w-full rounded-2xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-[#F3F4F1] dark:bg-[#14171D] px-3.5 py-3.5 font-bold ${textSize} text-[#1A1A1A] dark:text-[#F3F4F6] focus:bg-white dark:focus:bg-[#1A1E26] focus:outline-hidden focus:ring-2 focus:ring-[#C5E876]`}
            />
            <p className="mt-1 text-[11px] font-bold text-stone-500 dark:text-stone-400">
              Season: <span className="text-[#3B82F6] dark:text-[#60A5FA] font-black">{detectedSeason.seasonName}</span> ({detectedSeason.monthName})
            </p>
          </div>

          {/* Duration */}
          <div className="sm:col-span-3">
            <label className={`block ${labelSize} text-[#1A1A1A] dark:text-[#F3F4F6] mb-2`}>
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#1A1A1A] dark:text-[#F3F4F6]" />
                Duration (Days)
              </span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={14}
                required
                value={inputs.duration}
                onChange={(e) => onChange({ ...inputs, duration: Math.max(1, Math.min(14, parseInt(e.target.value) || 1)) })}
                className={`w-full rounded-2xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-[#F3F4F1] dark:bg-[#14171D] px-4 py-3.5 text-center font-black ${textSize} text-[#1A1A1A] dark:text-[#F3F4F6] focus:bg-white dark:focus:bg-[#1A1E26] focus:outline-hidden focus:ring-2 focus:ring-[#C5E876]`}
              />
              <span className="text-sm font-black text-[#1A1A1A] dark:text-[#F3F4F6] shrink-0">Days</span>
            </div>
            <div className="mt-2 flex justify-between gap-1">
              {[2, 3, 4, 5, 7].map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => onChange({ ...inputs, duration: days })}
                  className={`flex-1 rounded-xl border border-[#1A1A1A] dark:border-[#384152] py-1 text-xs font-bold transition ${
                    inputs.duration === days
                      ? 'bg-[#C5E876] text-[#1A1A1A] shadow-[1px_1px_0px_0px_#1A1A1A]'
                      : 'bg-white dark:bg-[#14171D] text-[#1A1A1A] dark:text-[#F3F4F6] hover:bg-stone-100 dark:hover:bg-[#28303B]'
                  }`}
                >
                  {days}d
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Season & Climate Preview Box */}
        <div className="rounded-2xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-[#FAF9F5] dark:bg-[#14171D] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-[#C5E876] flex items-center justify-center text-[#1A1A1A]">
              <CloudSun className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  Season Preview
                </span>
                <span className="px-2 py-0.5 bg-[#3B82F6] text-white text-[11px] font-black rounded-md">
                  {detectedSeason.seasonName}
                </span>
              </div>
              <p className="text-xs font-bold text-[#1A1A1A] dark:text-[#F3F4F6] mt-0.5">
                {detectedSeason.temperatureRange} • {detectedSeason.climateDescription.slice(0, 110)}...
              </p>
            </div>
          </div>
          <span className="text-xs font-black text-stone-500 dark:text-stone-400 shrink-0">
            Crowd: {detectedSeason.crowdLevel}
          </span>
        </div>

        {/* Section 2: Origin Departure City & Currency Preference */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Origin Departure City */}
          <div>
            <label className={`block ${labelSize} text-[#1A1A1A] dark:text-[#F3F4F6] mb-2`}>
              <span className="flex items-center gap-2">
                <Plane className="h-4 w-4 text-[#3B82F6] dark:text-[#60A5FA]" />
                Departure City (for Flight Finder)
              </span>
            </label>
            <input
              type="text"
              value={inputs.origin_city || ''}
              onChange={(e) => onChange({ ...inputs, origin_city: e.target.value })}
              placeholder="e.g. New York (JFK), London (LHR), New Delhi (DEL)"
              className={`w-full rounded-2xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-[#F3F4F1] dark:bg-[#14171D] px-4 py-3.5 ${textSize} font-semibold text-[#1A1A1A] dark:text-[#F3F4F6] placeholder:text-stone-400 focus:bg-white dark:focus:bg-[#1A1E26] focus:outline-hidden focus:ring-2 focus:ring-[#3B82F6]`}
            />
          </div>

          {/* Currency Preference */}
          <div>
            <label className={`block ${labelSize} text-[#1A1A1A] dark:text-[#F3F4F6] mb-2`}>
              <span className="flex items-center gap-2">
                <Coins className="h-4 w-4 text-[#10B981] dark:text-[#34D399]" />
                Currency for Cost Estimates
              </span>
            </label>
            <div className="flex flex-wrap items-center gap-1.5">
              {CURRENCIES.map((curr) => {
                const isSelected = (inputs.currency || 'USD') === curr.code;
                return (
                  <button
                    key={curr.code}
                    type="button"
                    onClick={() => onChange({ ...inputs, currency: curr.code })}
                    className={`px-3 py-2 text-xs font-black border-2 border-[#1A1A1A] dark:border-[#384152] rounded-xl transition-all ${
                      isSelected
                        ? 'bg-[#1A1A1A] dark:bg-[#C5E876] text-white dark:text-[#1A1A1A] shadow-[2px_2px_0px_0px_#10B981]'
                        : 'bg-[#FFFFFF] dark:bg-[#14171D] text-[#1A1A1A] dark:text-[#F3F4F6] hover:bg-[#F3F4F1] dark:hover:bg-[#28303B]'
                    }`}
                  >
                    <span className="text-[#10B981] dark:text-[#10B981] font-bold mr-1">{curr.symbol}</span>
                    <span>{curr.code}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 3: Travelers & Pace */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Travelers */}
          <div>
            <label className={`block ${labelSize} text-[#1A1A1A] dark:text-[#F3F4F6] mb-2`}>
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4 text-[#1A1A1A] dark:text-[#F3F4F6]" />
                Who is Traveling?
              </span>
            </label>
            <select
              value={inputs.travelers}
              onChange={(e) => onChange({ ...inputs, travelers: e.target.value })}
              className={`w-full rounded-2xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-[#F3F4F1] dark:bg-[#14171D] px-4 py-3.5 ${textSize} font-bold text-[#1A1A1A] dark:text-[#F3F4F6] focus:bg-white dark:focus:bg-[#1A1E26] focus:outline-hidden focus:ring-2 focus:ring-[#C5E876]`}
            >
              {TRAVELER_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Travel Pace */}
          <div>
            <label className={`block ${labelSize} text-[#1A1A1A] dark:text-[#F3F4F6] mb-2`}>
              <span className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-[#1A1A1A] dark:text-[#F3F4F6]" />
                Travel Pace
              </span>
            </label>
            <select
              value={inputs.pace}
              onChange={(e) => onChange({ ...inputs, pace: e.target.value })}
              className={`w-full rounded-2xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-[#F3F4F1] dark:bg-[#14171D] px-4 py-3.5 ${textSize} font-bold text-[#1A1A1A] dark:text-[#F3F4F6] focus:bg-white dark:focus:bg-[#1A1E26] focus:outline-hidden focus:ring-2 focus:ring-[#C5E876]`}
            >
              {PACE_OPTIONS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} - {p.desc}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Section 4: Budget in Selected Currency */}
        <div>
          <label className={`block ${labelSize} text-[#1A1A1A] dark:text-[#F3F4F6] mb-3`}>
            <span className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-[#1A1A1A] dark:text-[#F3F4F6]" />
              Budget Tier in {currentCurrency} ({currencySymbol})
            </span>
          </label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {dynamicBudgetOptions.map((b) => {
              const isSelected = inputs.budget.includes(b.title) || inputs.budget === b.id;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => onChange({ ...inputs, budget: b.id })}
                  className={`flex flex-col items-start rounded-2xl border-2 border-[#1A1A1A] dark:border-[#384152] p-4 text-left transition ${
                    isSelected
                      ? 'bg-[#C5E876] dark:bg-[#C5E876] text-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] dark:shadow-[3px_3px_0px_0px_#000000]'
                      : 'bg-white dark:bg-[#14171D] text-[#1A1A1A] dark:text-[#F3F4F6] hover:bg-stone-50 dark:hover:bg-[#28303B]'
                  }`}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="font-black text-sm sm:text-base">{b.title}</span>
                    {isSelected && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#1A1A1A] bg-white text-[#1A1A1A]">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </div>
                  <span className="mt-1 font-black text-xs sm:text-sm">{b.range}</span>
                  <span className="mt-1 text-xs font-medium text-stone-700 dark:text-stone-300 leading-relaxed">{b.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 5: What interests you? */}
        <div>
          <label className={`block ${labelSize} text-[#1A1A1A] dark:text-[#F3F4F6] mb-2`}>
            <span className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-[#1A1A1A] dark:text-[#F3F4F6]" />
              What would you love to experience? (Select any)
            </span>
          </label>
          <div className="flex flex-wrap gap-2 pt-1">
            {COMMON_INTERESTS.map((interest) => {
              const isSelected = currentInterestsList.includes(interest);
              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`inline-flex items-center gap-1.5 rounded-xl border-2 border-[#1A1A1A] dark:border-[#384152] px-3.5 py-2 text-xs sm:text-sm font-bold transition ${
                    isSelected
                      ? 'bg-[#C5E876] text-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] dark:shadow-[2px_2px_0px_0px_#000000]'
                      : 'bg-white dark:bg-[#14171D] text-[#1A1A1A] dark:text-[#F3F4F6] hover:bg-stone-50 dark:hover:bg-[#28303B]'
                  }`}
                >
                  {isSelected && <Check className="h-3.5 w-3.5" />}
                  <span>{interest}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <input
              type="text"
              value={customInterest}
              onChange={(e) => setCustomInterest(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCustomInterest();
                }
              }}
              placeholder="Type other interests (e.g. Photography, Tea Ceremony, Michelin Dining)..."
              className="flex-1 rounded-2xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-[#F3F4F1] dark:bg-[#14171D] px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#1A1A1A] dark:text-[#F3F4F6] focus:bg-white dark:focus:bg-[#1A1E26] focus:outline-hidden"
            />
            <button
              type="button"
              onClick={addCustomInterest}
              className="rounded-xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-[#1A1A1A] dark:bg-[#C5E876] px-4 py-2.5 text-xs sm:text-sm font-bold text-white dark:text-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] dark:shadow-[2px_2px_0px_0px_#000000] transition hover:bg-stone-800 dark:hover:bg-[#b8dd67] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            >
              Add
            </button>
          </div>
        </div>

        {/* Section 6: Accessibility & Dietary Preferences */}
        <div>
          <label className={`block ${labelSize} text-[#1A1A1A] dark:text-[#F3F4F6] mb-2`}>
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#1A1A1A] dark:text-[#F3F4F6]" />
              Accessibility, Senior Care & Dietary Needs
            </span>
          </label>
          <div className="flex flex-wrap gap-2 pt-1">
            {ACCESSIBILITY_OPTIONS.map((item) => {
              const isSelected = currentConstraintsList.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleConstraint(item)}
                  className={`inline-flex items-center gap-1.5 rounded-xl border-2 border-[#1A1A1A] dark:border-[#384152] px-3.5 py-2 text-xs sm:text-sm font-bold transition ${
                    isSelected
                      ? 'bg-[#89CFF0] dark:bg-[#60A5FA] text-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] dark:shadow-[2px_2px_0px_0px_#000000]'
                      : 'bg-white dark:bg-[#14171D] text-[#1A1A1A] dark:text-[#F3F4F6] hover:bg-stone-50 dark:hover:bg-[#28303B]'
                  }`}
                >
                  {isSelected && <Check className="h-3.5 w-3.5" />}
                  <span>{item}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <input
              type="text"
              value={customConstraint}
              onChange={(e) => setCustomConstraint(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCustomConstraint();
                }
              }}
              placeholder="Any other special preferences or health needs..."
              className="flex-1 rounded-2xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-[#F3F4F1] dark:bg-[#14171D] px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#1A1A1A] dark:text-[#F3F4F6] focus:bg-white dark:focus:bg-[#1A1E26] focus:outline-hidden"
            />
            <button
              type="button"
              onClick={addCustomConstraint}
              className="rounded-xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-[#1A1A1A] dark:bg-[#C5E876] px-4 py-2.5 text-xs sm:text-sm font-bold text-white dark:text-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] dark:shadow-[2px_2px_0px_0px_#000000] transition hover:bg-stone-800 dark:hover:bg-[#b8dd67] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            >
              Add
            </button>
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-[#C5E876] py-4 px-6 text-base sm:text-lg font-black text-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] dark:shadow-[4px_4px_0px_0px_#000000] transition hover:bg-[#b8dd67] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#1A1A1A] border-t-transparent" />
                <span>Designing Your Seasonal Travel Plan & Route...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                <span>Generate Travel Itinerary (in {currencySymbol})</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
          <p className="mt-2 text-center text-xs font-semibold text-stone-500 dark:text-stone-400">
            Includes interactive map routes, Google Maps sync, season weather guide, stays, dining and flights
          </p>
        </div>
      </form>
    </div>
  );
};
