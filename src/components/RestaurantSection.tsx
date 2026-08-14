import React, { useState, useMemo } from 'react';
import { UtensilsCrossed, Leaf, MapPin, Sparkles, Info, ExternalLink, Navigation, Coffee, Star } from 'lucide-react';
import { RestaurantRecommendation } from '../types';
import { formatPrice } from '../utils/currencyUtils';
import { generatePlaceGoogleMapsUrl } from '../utils/mapExportUtils';

interface RestaurantSectionProps {
  restaurants?: RestaurantRecommendation[];
  destination: string;
  currency?: string;
  isLargeText: boolean;
}

export const RestaurantSection: React.FC<RestaurantSectionProps> = ({
  restaurants,
  destination,
  currency = 'USD',
  isLargeText,
}) => {
  const [selectedVegFilter, setSelectedVegFilter] = useState<'all' | 'pure_veg' | 'veg_friendly'>('all');
  const [selectedCategoryTag, setSelectedCategoryTag] = useState<string>('all');

  const categoryTags = useMemo(() => {
    if (!restaurants) return [];
    const set = new Set<string>();
    restaurants.forEach((r) => {
      if (r.category_tag) set.add(r.category_tag);
    });
    return Array.from(set);
  }, [restaurants]);

  const filteredRestaurants = useMemo(() => {
    if (!restaurants) return [];
    return restaurants.filter((place) => {
      const isPureVeg = place.veg_friendliness.toLowerCase().includes('pure veg');
      const isVegFriendly = place.veg_friendliness.toLowerCase().includes('excellent veg') || isPureVeg;

      if (selectedVegFilter === 'pure_veg' && !isPureVeg) return false;
      if (selectedVegFilter === 'veg_friendly' && !isVegFriendly) return false;

      if (selectedCategoryTag !== 'all' && place.category_tag !== selectedCategoryTag) {
        return false;
      }

      return true;
    });
  }, [restaurants, selectedVegFilter, selectedCategoryTag]);

  if (!restaurants || restaurants.length === 0) {
    return (
      <div className="rounded-3xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-white dark:bg-[#1E232B] p-8 text-center shadow-[4px_4px_0px_0px_#1A1A1A] dark:shadow-[4px_4px_0px_0px_#000000]">
        <UtensilsCrossed className="mx-auto h-12 w-12 text-stone-400" />
        <h3 className="mt-3 text-lg font-black text-[#1A1A1A] dark:text-[#F3F4F6]">Food & Dining Guide</h3>
        <p className="mt-1 text-sm font-medium text-stone-500 dark:text-stone-400">
          No dining recommendations were included in this plan.
        </p>
      </div>
    );
  }

  const titleSize = isLargeText ? 'text-xl sm:text-2xl font-black' : 'text-lg sm:text-xl font-black';
  const bodySize = isLargeText ? 'text-base' : 'text-sm';

  const googleFoodSearchUrl = `https://www.google.com/maps/search/restaurants+in+${encodeURIComponent(destination)}`;

  return (
    <div className="space-y-6" id="restaurant-guide-section">
      {/* Header Info Banner */}
      <div className="rounded-3xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-[#FAF9F5] dark:bg-[#14171D] p-6 shadow-[4px_4px_0px_0px_#1A1A1A] dark:shadow-[4px_4px_0px_0px_#000000] transition-colors">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-[#EF4444] text-white shadow-[2px_2px_0px_0px_#1A1A1A] dark:shadow-[2px_2px_0px_0px_#000000]">
                <UtensilsCrossed className="h-5 w-5" />
              </span>
              <h2 className={`${titleSize} text-[#1A1A1A] dark:text-[#F3F4F6]`}>
                Local Food & Dining Guide in {destination.split(',')[0]} ({restaurants.length} Places)
              </h2>
            </div>
            <p className={`mt-1 font-medium text-stone-600 dark:text-stone-300 ${bodySize}`}>
              Authentic regional culinary highlights, pure-veg options, senior-friendly seating tips, and estimated costs for two.
            </p>
          </div>

          <a
            href={googleFoodSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 self-start sm:self-auto rounded-xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-[#EF4444] px-3.5 py-2 text-xs font-black text-white shadow-[2px_2px_0px_0px_#1A1A1A] dark:shadow-[2px_2px_0px_0px_#000000] transition-all hover:translate-y-[-1px]"
          >
            <span>Explore Restaurants on Google Maps</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Dietary & Category Filters */}
        <div className="mt-4 pt-4 border-t-2 border-[#1A1A1A] dark:border-[#384152] flex flex-wrap items-center justify-between gap-3">
          {/* Veg Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mr-1">Dietary:</span>
            <button
              onClick={() => setSelectedVegFilter('all')}
              className={`px-3 py-1.5 text-xs font-black border-2 border-[#1A1A1A] dark:border-[#384152] rounded-xl transition-all ${
                selectedVegFilter === 'all'
                  ? 'bg-[#1A1A1A] dark:bg-[#C5E876] text-white dark:text-[#1A1A1A] shadow-[2px_2px_0px_0px_#EF4444]'
                  : 'bg-[#FFFFFF] dark:bg-[#1E232B] text-[#1A1A1A] dark:text-[#F3F4F6] hover:bg-[#F3F4F1] dark:hover:bg-[#28303B]'
              }`}
            >
              All Dining
            </button>
            <button
              onClick={() => setSelectedVegFilter('veg_friendly')}
              className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-black border-2 border-[#1A1A1A] dark:border-[#384152] rounded-xl transition-all ${
                selectedVegFilter === 'veg_friendly'
                  ? 'bg-[#10B981] text-white shadow-[2px_2px_0px_0px_#1A1A1A]'
                  : 'bg-[#FFFFFF] dark:bg-[#1E232B] text-[#1A1A1A] dark:text-[#F3F4F6] hover:bg-[#F3F4F1] dark:hover:bg-[#28303B]'
              }`}
            >
              <Leaf className="h-3 w-3 text-[#10B981]" />
              <span>Vegetarian Friendly</span>
            </button>
            <button
              onClick={() => setSelectedVegFilter('pure_veg')}
              className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-black border-2 border-[#1A1A1A] dark:border-[#384152] rounded-xl transition-all ${
                selectedVegFilter === 'pure_veg'
                  ? 'bg-[#059669] text-white shadow-[2px_2px_0px_0px_#1A1A1A]'
                  : 'bg-[#FFFFFF] dark:bg-[#1E232B] text-[#1A1A1A] dark:text-[#F3F4F6] hover:bg-[#F3F4F1] dark:hover:bg-[#28303B]'
              }`}
            >
              <Leaf className="h-3 w-3 text-[#059669]" />
              <span>100% Pure Veg</span>
            </button>
          </div>

          {/* Tag Filter */}
          {categoryTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setSelectedCategoryTag('all')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${
                  selectedCategoryTag === 'all'
                    ? 'bg-stone-800 text-white border-stone-800 dark:bg-white dark:text-[#1A1A1A]'
                    : 'bg-stone-100 dark:bg-[#1E232B] text-stone-700 dark:text-stone-300 border-stone-300 dark:border-[#384152]'
                }`}
              >
                All
              </button>
              {categoryTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedCategoryTag(tag)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${
                    selectedCategoryTag === tag
                      ? 'bg-stone-800 text-white border-stone-800 dark:bg-[#C5E876] dark:text-[#1A1A1A]'
                      : 'bg-stone-100 dark:bg-[#1E232B] text-stone-700 dark:text-stone-300 border-stone-300 dark:border-[#384152]'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Restaurant Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRestaurants.map((place, idx) => {
          const isVeg =
            place.veg_friendliness.toLowerCase().includes('pure veg') ||
            place.veg_friendliness.toLowerCase().includes('excellent veg');

          const mapsUrl = generatePlaceGoogleMapsUrl(place.name, destination, place.neighborhood);
          const reviewsUrl = `https://www.google.com/search?q=${encodeURIComponent(
            `${place.name} ${place.neighborhood} ${destination} restaurant reviews menu`
          )}`;

          return (
            <div
              key={idx}
              className="rounded-3xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-white dark:bg-[#1E232B] p-5 shadow-[4px_4px_0px_0px_#1A1A1A] dark:shadow-[4px_4px_0px_0px_#000000] flex flex-col justify-between transition-colors"
            >
              <div className="space-y-3">
                {/* Category & Cost for Two */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-[#FEE2E2] dark:bg-[#3E1B1B] border border-[#EF4444] rounded-lg text-xs font-black text-[#991B1B] dark:text-[#FCA5A5]">
                    {place.category_tag || place.cuisine_type}
                  </span>
                  <span className="text-xs font-black text-[#10B981] dark:text-[#34D399] bg-[#ECFDF5] dark:bg-[#133E2B] px-2.5 py-1 rounded-md border border-[#10B981]">
                    ~{formatPrice(place.approx_cost_for_two, place.currency || currency)} for two
                  </span>
                </div>

                {/* Name & Neighborhood */}
                <div>
                  <h3 className="font-black text-lg text-[#1A1A1A] dark:text-[#F3F4F6] leading-snug">
                    {place.name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs font-bold text-stone-500 dark:text-stone-400 mt-1">
                    <MapPin className="h-3.5 w-3.5 text-[#EF4444]" />
                    <span>{place.neighborhood} • {place.cuisine_type}</span>
                  </div>
                </div>

                {/* Veg / Dietary Tag */}
                <div className="flex items-center gap-1.5">
                  <span
                    className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-black ${
                      isVeg
                        ? 'bg-[#DCFCE7] dark:bg-[#163D27] border-[#86EFAC] text-[#166534] dark:text-[#86EFAC]'
                        : 'bg-[#F3F4F6] dark:bg-[#1A1E26] border-stone-300 dark:border-[#384152] text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    {isVeg && <Leaf className="h-3 w-3 text-[#16A34A]" />}
                    <span>{place.veg_friendliness}</span>
                  </span>
                </div>

                {/* Must Try Dish Highlight Box */}
                <div className="rounded-xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-[#FAF9F5] dark:bg-[#14171D] p-3 shadow-[2px_2px_0px_0px_#1A1A1A] dark:shadow-[2px_2px_0px_0px_#000000]">
                  <div className="flex items-start gap-1.5">
                    <Sparkles className="h-4 w-4 text-[#EF4444] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                        Must-Try Specialty:
                      </span>
                      <p className="text-xs font-black text-[#1A1A1A] dark:text-[#F3F4F6] mt-0.5">
                        {place.must_try_dish}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Senior & Family Tips */}
                {place.senior_and_family_tips && (
                  <div className="flex items-start gap-1.5 text-xs text-stone-600 dark:text-stone-400 pt-1">
                    <Info className="h-3.5 w-3.5 text-stone-500 shrink-0 mt-0.5" />
                    <p className="font-medium">{place.senior_and_family_tips}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-4 border-t border-stone-200 dark:border-[#384152] flex items-center gap-2">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-white dark:bg-[#14171D] border-2 border-[#1A1A1A] dark:border-[#384152] rounded-xl text-xs font-bold text-[#1A1A1A] dark:text-[#F3F4F6] shadow-[2px_2px_0px_0px_#1A1A1A] dark:shadow-[2px_2px_0px_0px_#000000] hover:bg-[#FAF9F5] dark:hover:bg-[#28303B] transition"
                  title={`Open ${place.name} on Google Maps`}
                >
                  <MapPin className="h-3.5 w-3.5 text-[#EA4335]" />
                  <span>Google Maps</span>
                  <ExternalLink className="h-3 w-3 text-stone-400" />
                </a>

                <a
                  href={reviewsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-[#EF4444] text-white border-2 border-[#1A1A1A] dark:border-[#384152] rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#1A1A1A] dark:shadow-[2px_2px_0px_0px_#000000] hover:bg-[#DC2626] transition"
                  title="Search reviews, photos and menus on Google"
                >
                  <UtensilsCrossed className="h-3.5 w-3.5" />
                  <span>Reviews & Menu</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
