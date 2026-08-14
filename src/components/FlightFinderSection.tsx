import React, { useState } from 'react';
import { Plane, Navigation, ExternalLink, Clock, ShieldCheck, DollarSign, ArrowRight, Luggage, MapPin, Compass } from 'lucide-react';
import { ItineraryPlanResponse } from '../types';
import { getCurrencySymbol } from '../utils/currencyUtils';

interface FlightFinderSectionProps {
  plan: ItineraryPlanResponse;
  initialOrigin?: string;
}

const GLOBAL_AIRPORT_HUBS = [
  { code: 'NYC', name: 'New York (JFK/EWR)', country: 'USA' },
  { code: 'LON', name: 'London (LHR/LGW)', country: 'UK' },
  { code: 'DEL', name: 'New Delhi (DEL)', country: 'India' },
  { code: 'BOM', name: 'Mumbai (BOM)', country: 'India' },
  { code: 'DXB', name: 'Dubai (DXB)', country: 'UAE' },
  { code: 'SIN', name: 'Singapore (SIN)', country: 'Singapore' },
  { code: 'TYO', name: 'Tokyo (HND/NRT)', country: 'Japan' },
  { code: 'PAR', name: 'Paris (CDG/ORY)', country: 'France' },
  { code: 'FRA', name: 'Frankfurt (FRA)', country: 'Germany' },
  { code: 'SYD', name: 'Sydney (SYD)', country: 'Australia' },
  { code: 'SFO', name: 'San Francisco (SFO)', country: 'USA' },
  { code: 'LAX', name: 'Los Angeles (LAX)', country: 'USA' },
  { code: 'YYZ', name: 'Toronto (YYZ)', country: 'Canada' },
];

export const FlightFinderSection: React.FC<FlightFinderSectionProps> = ({ plan, initialOrigin = 'New York (JFK)' }) => {
  const [selectedOrigin, setSelectedOrigin] = useState<string>(initialOrigin);
  const [customOriginInput, setCustomOriginInput] = useState<string>('');

  const destCity = plan.trip_summary.destination.split(',')[0].trim();
  const currencySymbol = getCurrencySymbol(plan.estimated_costs.currency);

  const flightInfo = plan.flight_analysis;
  const destinationAirports = flightInfo?.destination_airports || [
    {
      code: 'DEST',
      name: `${destCity} International Airport`,
      city: destCity,
      distance_from_center_km: 25,
    },
  ];

  // Active origin name for links
  const activeOrigin = customOriginInput.trim() || selectedOrigin;

  // External flight search generators
  const googleFlightsUrl = `https://www.google.com/travel/flights?q=Flights%20to%20${encodeURIComponent(
    destCity
  )}%20from%20${encodeURIComponent(activeOrigin)}`;

  const skyscannerUrl = `https://www.skyscanner.com/transport/flights?query=${encodeURIComponent(
    `${activeOrigin} to ${destCity}`
  )}`;

  const kayakUrl = `https://www.kayak.com/flights/${encodeURIComponent(activeOrigin)}-${encodeURIComponent(
    destCity
  )}`;

  return (
    <div id="flight-finder-section" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#FAF9F5] dark:bg-[#14171D] border-2 border-[#1A1A1A] dark:border-[#384152] rounded-3xl shadow-[4px_4px_0px_0px_#1A1A1A] dark:shadow-[4px_4px_0px_0px_#000000] p-6 transition-colors">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#3B82F6] text-white border-2 border-[#1A1A1A] dark:border-[#384152] rounded-2xl shadow-[2px_2px_0px_0px_#1A1A1A] dark:shadow-[2px_2px_0px_0px_#000000]">
              <Plane className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#1A1A1A] dark:text-[#F3F4F6] tracking-tight">
                Flights & Airport Transit Guide
              </h2>
              <p className="text-sm font-medium text-stone-600 dark:text-stone-300">
                Find the best airline routes, duration estimates, airport transfer guides, and direct Google Flights search for{' '}
                <span className="font-bold text-[#1A1A1A] dark:text-[#F3F4F6]">{plan.trip_summary.destination}</span>.
              </p>
            </div>
          </div>

          {/* Direct Search Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={googleFlightsUrl}
              target="_blank"
              rel="noopener noreferrer"
              id="btn-google-flights"
              className="flex items-center gap-2 px-4 py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm font-black border-2 border-[#1A1A1A] dark:border-[#384152] rounded-xl shadow-[2px_2px_0px_0px_#1A1A1A] dark:shadow-[2px_2px_0px_0px_#000000] transition-all hover:translate-y-[-1px]"
            >
              <Plane className="w-4 h-4" />
              <span>Search on Google Flights</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>

            <a
              href={skyscannerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3.5 py-2.5 bg-[#FFFFFF] dark:bg-[#1E232B] hover:bg-[#F3F4F1] dark:hover:bg-[#28303B] text-[#1A1A1A] dark:text-[#F3F4F6] text-sm font-black border-2 border-[#1A1A1A] dark:border-[#384152] rounded-xl shadow-[2px_2px_0px_0px_#1A1A1A] dark:shadow-[2px_2px_0px_0px_#000000] transition-all hover:translate-y-[-1px]"
            >
              <span>Skyscanner</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>

            <a
              href={kayakUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3.5 py-2.5 bg-[#FFFFFF] dark:bg-[#1E232B] hover:bg-[#F3F4F1] dark:hover:bg-[#28303B] text-[#1A1A1A] dark:text-[#F3F4F6] text-sm font-black border-2 border-[#1A1A1A] dark:border-[#384152] rounded-xl shadow-[2px_2px_0px_0px_#1A1A1A] dark:shadow-[2px_2px_0px_0px_#000000] transition-all hover:translate-y-[-1px]"
            >
              <span>Kayak</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>
        </div>

        {/* Origin Airport Selection Toolbar */}
        <div className="mt-5 pt-4 border-t-2 border-[#1A1A1A] dark:border-[#384152]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs font-black text-stone-500 dark:text-stone-400 uppercase tracking-wider">
              Departure City Selector:
            </span>

            <div className="flex items-center gap-2 flex-1 max-w-md">
              <input
                type="text"
                value={customOriginInput}
                onChange={(e) => setCustomOriginInput(e.target.value)}
                placeholder="Or type custom origin city (e.g. Chicago, Boston)..."
                className="w-full px-3 py-1.5 text-xs font-bold border-2 border-[#1A1A1A] dark:border-[#384152] rounded-xl bg-white dark:bg-[#1E232B] text-[#1A1A1A] dark:text-[#F3F4F6] focus:outline-hidden focus:ring-2 focus:ring-[#3B82F6]"
              />
              {customOriginInput && (
                <button
                  onClick={() => setCustomOriginInput('')}
                  className="text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 font-bold"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 mt-3">
            {GLOBAL_AIRPORT_HUBS.map((hub) => {
              const isSelected = !customOriginInput && selectedOrigin.includes(hub.code);
              return (
                <button
                  key={hub.code}
                  onClick={() => {
                    setSelectedOrigin(hub.name);
                    setCustomOriginInput('');
                  }}
                  className={`px-2.5 py-1 text-xs font-black border-2 border-[#1A1A1A] dark:border-[#384152] rounded-xl transition-all ${
                    isSelected
                      ? 'bg-[#1A1A1A] dark:bg-[#C5E876] text-white dark:text-[#1A1A1A] shadow-[2px_2px_0px_0px_#3B82F6]'
                      : 'bg-[#FFFFFF] dark:bg-[#1E232B] text-[#1A1A1A] dark:text-[#F3F4F6] hover:bg-[#F3F4F1] dark:hover:bg-[#28303B]'
                  }`}
                >
                  <span className="font-black text-[#3B82F6] mr-1">[{hub.code}]</span>
                  <span>{hub.name.split('(')[0].trim()}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Destination Airports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {destinationAirports.map((airport, idx) => (
          <div
            key={idx}
            className="bg-[#FFFFFF] dark:bg-[#1E232B] border-2 border-[#1A1A1A] dark:border-[#384152] rounded-3xl shadow-[4px_4px_0px_0px_#1A1A1A] dark:shadow-[4px_4px_0px_0px_#000000] p-5 flex flex-col justify-between transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 bg-[#EFF6FF] dark:bg-[#1E3A5F] border border-[#3B82F6] rounded-lg text-xs font-black text-[#1D4ED8] dark:text-[#93C5FD]">
                  Primary Arrival Airport
                </span>
                <span className="text-sm font-black text-[#1A1A1A] dark:text-[#F3F4F6] bg-[#FAF9F5] dark:bg-[#14171D] px-2.5 py-0.5 rounded-md border border-[#1A1A1A] dark:border-[#384152]">
                  IATA: {airport.code}
                </span>
              </div>

              <div>
                <h3 className="font-black text-lg text-[#1A1A1A] dark:text-[#F3F4F6] leading-snug">
                  {airport.name}
                </h3>
                <div className="flex items-center gap-1 text-xs font-bold text-stone-500 dark:text-stone-400 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#3B82F6]" />
                  <span>{airport.city} • ~{airport.distance_from_center_km || 25} km from city center</span>
                </div>
              </div>

              <div className="bg-[#FAF9F5] dark:bg-[#14171D] p-3 rounded-2xl border border-stone-200 dark:border-[#384152] text-xs font-medium text-stone-700 dark:text-stone-300">
                <span className="font-black text-[#1A1A1A] dark:text-[#F3F4F6] block mb-1">Transfer Connection:</span>
                Direct express trains, airport buses, and official metered taxis connect smoothly to downtown accommodations.
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-200 dark:border-[#384152]">
              <a
                href={`https://www.google.com/travel/flights?q=Flights%20to%20${airport.code}%20from%20${encodeURIComponent(
                  activeOrigin
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#3B82F6] text-white border-2 border-[#1A1A1A] dark:border-[#384152] rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#1A1A1A] dark:shadow-[2px_2px_0px_0px_#000000] hover:bg-[#2563EB] transition"
              >
                <span>Check Flights to {airport.code}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Transit Logistics & Booking Advice Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Airport Transfer Guide */}
        <div className="bg-[#FFFFFF] dark:bg-[#1E232B] border-2 border-[#1A1A1A] dark:border-[#384152] rounded-3xl shadow-[4px_4px_0px_0px_#1A1A1A] dark:shadow-[4px_4px_0px_0px_#000000] p-5 space-y-3 transition-colors">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#10B981] text-white border-2 border-[#1A1A1A] dark:border-[#384152] rounded-xl shadow-[2px_2px_0px_0px_#1A1A1A]">
              <Navigation className="w-4 h-4" />
            </div>
            <h3 className="font-black text-base text-[#1A1A1A] dark:text-[#F3F4F6]">
              Airport to Hotel Transfer Guide
            </h3>
          </div>

          <p className="text-xs sm:text-sm font-medium text-stone-700 dark:text-stone-300 leading-relaxed">
            {flightInfo?.airport_transfer_guide ||
              `Use the designated Airport Express Train or Airport Limousine Bus for luggage convenience. If traveling with seniors or heavy baggage, pre-booked private transfers or airport taxi ranks provide seamless door-to-door transit.`}
          </p>

          <div className="bg-[#FAF9F5] dark:bg-[#14171D] p-3 rounded-2xl border border-stone-200 dark:border-[#384152] text-xs font-semibold text-stone-600 dark:text-stone-400">
            Tip: Purchase transit IC cards or airport express train passes at arrival terminal kiosks for fast, contactless boarding.
          </div>
        </div>

        {/* Lead-Time & Visa Notes */}
        <div className="bg-[#FFFFFF] dark:bg-[#1E232B] border-2 border-[#1A1A1A] dark:border-[#384152] rounded-3xl shadow-[4px_4px_0px_0px_#1A1A1A] dark:shadow-[4px_4px_0px_0px_#000000] p-5 space-y-3 transition-colors">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#F59E0B] text-[#1A1A1A] border-2 border-[#1A1A1A] dark:border-[#384152] rounded-xl shadow-[2px_2px_0px_0px_#1A1A1A]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="font-black text-base text-[#1A1A1A] dark:text-[#F3F4F6]">
              Booking Lead Time & Entry Tips
            </h3>
          </div>

          <p className="text-xs sm:text-sm font-medium text-stone-700 dark:text-stone-300 leading-relaxed">
            {flightInfo?.booking_lead_time_tips ||
              `For peak travel seasons (Spring and Autumn), book international flights 6 to 10 weeks in advance to lock in optimal flight times and avoid surge pricing.`}
          </p>

          <div className="bg-[#FAF9F5] dark:bg-[#14171D] p-3 rounded-2xl border border-stone-200 dark:border-[#384152] text-xs font-semibold text-stone-600 dark:text-stone-400">
            {flightInfo?.visa_and_transit_notes ||
              `Check electronic visa (e-Visa) or visa waiver regulations for your passport country before departure.`}
          </div>
        </div>
      </div>
    </div>
  );
};
