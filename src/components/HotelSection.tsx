import React, { useState, useMemo } from 'react';
import { Building2, Check, MapPin, HeartHandshake, ExternalLink, Navigation, Sparkles, BedDouble } from 'lucide-react';
import { HotelRecommendation } from '../types';
import { formatPrice } from '../utils/currencyUtils';
import { generatePlaceGoogleMapsUrl } from '../utils/mapExportUtils';

interface HotelSectionProps {
  hotels?: HotelRecommendation[];
  destination: string;
  currency?: string;
  isLargeText: boolean;
}

export const HotelSection: React.FC<HotelSectionProps> = ({
  hotels,
  destination,
  currency = 'USD',
  isLargeText,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = useMemo(() => {
    if (!hotels) return [];
    const set = new Set<string>();
    hotels.forEach((h) => {
      if (h.category) set.add(h.category);
    });
    return Array.from(set);
  }, [hotels]);

  const filteredHotels = useMemo(() => {
    if (!hotels) return [];
    if (selectedCategory === 'all') return hotels;
    return hotels.filter((h) => h.category.toLowerCase().includes(selectedCategory.toLowerCase()));
  }, [hotels, selectedCategory]);

  if (!hotels || hotels.length === 0) {
    return (
      <div className="rounded-3xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-white dark:bg-[#1E232B] p-8 text-center shadow-[4px_4px_0px_0px_#1A1A1A] dark:shadow-[4px_4px_0px_0px_#000000]">
        <Building2 className="mx-auto h-12 w-12 text-stone-400" />
        <h3 className="mt-3 text-lg font-black text-[#1A1A1A] dark:text-[#F3F4F6]">Hotel Recommendations</h3>
        <p className="mt-1 text-sm font-medium text-stone-500 dark:text-stone-400">
          No hotel recommendations were included in this itinerary generation.
        </p>
      </div>
    );
  }

  const titleSize = isLargeText ? 'text-xl sm:text-2xl font-black' : 'text-lg sm:text-xl font-black';
  const bodySize = isLargeText ? 'text-base' : 'text-sm';

  const googleHotelsSearchUrl = `https://www.google.com/travel/hotels/${encodeURIComponent(destination)}`;

  return (
    <div className="space-y-6" id="hotel-recommendations-section">
      {/* Header Info Banner */}
      <div className="rounded-3xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-[#FAF9F5] dark:bg-[#14171D] p-6 shadow-[4px_4px_0px_0px_#1A1A1A] dark:shadow-[4px_4px_0px_0px_#000000] transition-colors">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-[#8B5CF6] text-white shadow-[2px_2px_0px_0px_#1A1A1A] dark:shadow-[2px_2px_0px_0px_#000000]">
                <Building2 className="h-5 w-5" />
              </span>
              <h2 className={`${titleSize} text-[#1A1A1A] dark:text-[#F3F4F6]`}>
                Recommended Stays in {destination.split(',')[0]} ({hotels.length} Options)
              </h2>
            </div>
            <p className={`mt-1 font-medium text-stone-600 dark:text-stone-300 ${bodySize}`}>
              Curated accommodations across Luxury, Boutique, Mid-Range, and Budget categories with accessibility notes and neighborhood proximity.
            </p>
          </div>

          <a
            href={googleHotelsSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 self-start sm:self-auto rounded-xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-[#8B5CF6] px-3.5 py-2 text-xs font-black text-white shadow-[2px_2px_0px_0px_#1A1A1A] dark:shadow-[2px_2px_0px_0px_#000000] transition-all hover:translate-y-[-1px]"
          >
            <span>Search Live Prices on Google Hotels</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Category Filters */}
        {categories.length > 0 && (
          <div className="mt-4 pt-4 border-t-2 border-[#1A1A1A] dark:border-[#384152] flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mr-1">Filter Tier:</span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 text-xs font-black border-2 border-[#1A1A1A] dark:border-[#384152] rounded-xl transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[#1A1A1A] dark:bg-[#C5E876] text-white dark:text-[#1A1A1A] shadow-[2px_2px_0px_0px_#8B5CF6]'
                  : 'bg-[#FFFFFF] dark:bg-[#1E232B] text-[#1A1A1A] dark:text-[#F3F4F6] hover:bg-[#F3F4F1] dark:hover:bg-[#28303B]'
              }`}
            >
              All Tiers ({hotels.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-black border-2 border-[#1A1A1A] dark:border-[#384152] rounded-xl transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#8B5CF6] text-white shadow-[2px_2px_0px_0px_#1A1A1A]'
                    : 'bg-[#FFFFFF] dark:bg-[#1E232B] text-[#1A1A1A] dark:text-[#F3F4F6] hover:bg-[#F3F4F1] dark:hover:bg-[#28303B]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Hotel Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredHotels.map((hotel, idx) => {
          const hotelMapsUrl = generatePlaceGoogleMapsUrl(hotel.name, destination, hotel.neighborhood);
          const hotelSearchBookingUrl = `https://www.google.com/travel/hotels?q=${encodeURIComponent(
            `${hotel.name} ${hotel.neighborhood} ${destination}`
          )}`;

          return (
            <div
              key={idx}
              className="rounded-3xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-white dark:bg-[#1E232B] p-5 shadow-[4px_4px_0px_0px_#1A1A1A] dark:shadow-[4px_4px_0px_0px_#000000] flex flex-col justify-between transition-colors"
            >
              <div className="space-y-3">
                {/* Header: Category & Price */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-[#F3E8FF] dark:bg-[#3D1E6D] border border-[#8B5CF6] rounded-lg text-xs font-black text-[#6B21A8] dark:text-[#E9D5FF]">
                    {hotel.category}
                  </span>
                  <span className="text-sm font-black text-[#10B981] dark:text-[#34D399] bg-[#ECFDF5] dark:bg-[#133E2B] px-2.5 py-0.5 rounded-md border border-[#10B981]">
                    ~{formatPrice(hotel.approx_price_per_night, hotel.currency || currency)} / night
                  </span>
                </div>

                {/* Hotel Name & Area */}
                <div>
                  <h3 className="font-black text-lg text-[#1A1A1A] dark:text-[#F3F4F6] leading-snug">
                    {hotel.name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs font-bold text-stone-500 dark:text-stone-400 mt-1">
                    <MapPin className="h-3.5 w-3.5 text-[#8B5CF6]" />
                    <span>{hotel.neighborhood}</span>
                  </div>
                </div>

                {/* Best For Tag */}
                <div className="rounded-xl border border-stone-200 dark:border-[#384152] bg-[#FAF9F5] dark:bg-[#14171D] p-2.5">
                  <div className="flex items-start gap-1.5">
                    <HeartHandshake className="h-4 w-4 text-[#8B5CF6] shrink-0 mt-0.5" />
                    <p className="text-xs font-bold text-[#1A1A1A] dark:text-stone-300">
                      <span className="text-stone-500 dark:text-stone-400 font-semibold">Best for: </span>
                      {hotel.best_for}
                    </p>
                  </div>
                </div>

                {/* Key Highlights */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">Highlights:</span>
                  <ul className="space-y-1">
                    {(hotel.key_highlights || []).map((h, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs font-medium text-stone-700 dark:text-stone-300">
                        <Check className="h-3.5 w-3.5 text-[#10B981] shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons: Google Maps & Live Search */}
              <div className="mt-5 pt-4 border-t border-stone-200 dark:border-[#384152] flex items-center gap-2">
                <a
                  href={hotelMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-white dark:bg-[#14171D] border-2 border-[#1A1A1A] dark:border-[#384152] rounded-xl text-xs font-bold text-[#1A1A1A] dark:text-[#F3F4F6] shadow-[2px_2px_0px_0px_#1A1A1A] dark:shadow-[2px_2px_0px_0px_#000000] hover:bg-[#FAF9F5] dark:hover:bg-[#28303B] transition"
                  title={`View ${hotel.name} on Google Maps`}
                >
                  <MapPin className="h-3.5 w-3.5 text-[#EA4335]" />
                  <span>Google Maps</span>
                  <ExternalLink className="h-3 w-3 text-stone-400" />
                </a>

                <a
                  href={hotelSearchBookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-[#8B5CF6] text-white border-2 border-[#1A1A1A] dark:border-[#384152] rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#1A1A1A] dark:shadow-[2px_2px_0px_0px_#000000] hover:bg-[#7C3AED] transition"
                  title="Check live room availability & rates"
                >
                  <BedDouble className="h-3.5 w-3.5" />
                  <span>Live Rates</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
