import React, { useEffect, useRef, useState, useMemo } from 'react';
import { MapPin, Navigation, ExternalLink, Calendar, Layers, Sparkles, Hotel, Utensils, Compass, Route } from 'lucide-react';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ItineraryPlanResponse, DayItinerary } from '../types';
import {
  generateDayGoogleMapsUrl,
  generatePlaceGoogleMapsUrl,
  generateTripGoogleMapsUrl,
} from '../utils/mapExportUtils';

// Interop resolution for Leaflet in both ESM and CJS bundle environments
const leaflet: typeof L = (L as any)?.map ? L : ((L as any)?.default || L);

// Fix default Leaflet icon paths
try {
  if (leaflet?.Icon?.Default) {
    delete (leaflet.Icon.Default.prototype as any)._getIconUrl;
    leaflet.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });
  }
} catch {
  // Ignore fallback
}

interface InteractiveMapWidgetProps {
  plan: ItineraryPlanResponse;
  selectedDay?: number;
  onSelectDay?: (dayNum: number) => void;
}

interface MapMarkerData {
  id: string;
  name: string;
  category: 'activity' | 'hotel' | 'restaurant';
  dayNumber?: number;
  timeSlot?: string;
  duration?: number;
  cost?: string;
  description: string;
  tip?: string;
  lat: number;
  lng: number;
  neighborhood?: string;
}

const DAY_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'];

export const InteractiveMapWidget: React.FC<InteractiveMapWidgetProps> = ({
  plan,
  selectedDay: initialSelectedDay,
  onSelectDay,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const linesLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const [activeDayFilter, setActiveDayFilter] = useState<number | 'all'>(
    initialSelectedDay !== undefined ? initialSelectedDay : 'all'
  );
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'activities' | 'hotels' | 'restaurants'>('all');
  const [selectedMarker, setSelectedMarker] = useState<MapMarkerData | null>(null);

  // Sync prop changes
  useEffect(() => {
    if (initialSelectedDay !== undefined) {
      setActiveDayFilter(initialSelectedDay);
    }
  }, [initialSelectedDay]);

  // Compute destination base coords
  const baseLat = plan?.trip_summary?.destination_coords?.lat || 35.0116;
  const baseLng = plan?.trip_summary?.destination_coords?.lng || 135.7681;

  // Flatten all markers
  const allMarkers: MapMarkerData[] = useMemo(() => {
    const list: MapMarkerData[] = [];
    const itinerary = plan?.itinerary || [];

    // 1. Activities from days
    itinerary.forEach((day) => {
      const schedule = day?.schedule || [];
      schedule.forEach((item, itemIdx) => {
        const lat = item?.coordinates?.lat || baseLat + Math.sin((day.day_number || 1) * 2 + itemIdx) * 0.02;
        const lng = item?.coordinates?.lng || baseLng + Math.cos((day.day_number || 1) * 2 + itemIdx) * 0.02;

        list.push({
          id: `act_${day.day_number}_${itemIdx}`,
          name: item.activity_name,
          category: 'activity',
          dayNumber: day.day_number,
          timeSlot: item.time_slot,
          duration: item.estimated_duration_hours,
          cost: item.cost_tier,
          description: item.description,
          tip: item.insider_tip,
          lat,
          lng,
        });
      });
    });

    // 2. Hotels
    if (plan?.hotel_recommendations && Array.isArray(plan.hotel_recommendations)) {
      plan.hotel_recommendations.forEach((hotel, idx) => {
        const lat = hotel?.coordinates?.lat || baseLat - 0.015 + idx * 0.008;
        const lng = hotel?.coordinates?.lng || baseLng - 0.015 + idx * 0.008;

        list.push({
          id: `hotel_${idx}`,
          name: hotel.name,
          category: 'hotel',
          description: `${hotel.category} • ${hotel.neighborhood} • Best for: ${hotel.best_for}`,
          tip: (hotel.key_highlights || []).join(' • '),
          lat,
          lng,
          neighborhood: hotel.neighborhood,
        });
      });
    }

    // 3. Restaurants
    if (plan?.restaurant_recommendations && Array.isArray(plan.restaurant_recommendations)) {
      plan.restaurant_recommendations.forEach((rest, idx) => {
        const lat = rest?.coordinates?.lat || baseLat + 0.012 - idx * 0.007;
        const lng = rest?.coordinates?.lng || baseLng + 0.014 - idx * 0.007;

        list.push({
          id: `rest_${idx}`,
          name: rest.name,
          category: 'restaurant',
          description: `${rest.cuisine_type} • ${rest.neighborhood} • ${rest.veg_friendliness}`,
          tip: `Specialty: ${rest.must_try_dish} (Approx cost: ${rest.approx_cost_for_two})`,
          lat,
          lng,
          neighborhood: rest.neighborhood,
        });
      });
    }

    return list;
  }, [plan, baseLat, baseLng]);

  // Filter markers
  const filteredMarkers = useMemo(() => {
    return allMarkers.filter((m) => {
      if (activeCategoryFilter !== 'all') {
        if (activeCategoryFilter === 'activities' && m.category !== 'activity') return false;
        if (activeCategoryFilter === 'hotels' && m.category !== 'hotel') return false;
        if (activeCategoryFilter === 'restaurants' && m.category !== 'restaurant') return false;
      }
      if (activeDayFilter !== 'all') {
        if (m.category === 'activity' && m.dayNumber !== activeDayFilter) return false;
      }
      return true;
    });
  }, [allMarkers, activeCategoryFilter, activeDayFilter]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (!leaflet || !leaflet.map) return;

    if (!mapInstanceRef.current) {
      try {
        const map = leaflet.map(mapContainerRef.current, {
          center: [baseLat, baseLng],
          zoom: 13,
          scrollWheelZoom: true,
        });

        leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(map);

        markersLayerGroupRef.current = leaflet.layerGroup().addTo(map);
        linesLayerGroupRef.current = leaflet.layerGroup().addTo(map);
        mapInstanceRef.current = map;

        // Invalidate size shortly after mounting so tiles render properly
        setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, 150);
      } catch (err) {
        console.error('Failed to initialize Leaflet map:', err);
      }
    }

    return () => {
      // Cleanup on unmount
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch {
          // Ignore
        }
        mapInstanceRef.current = null;
      }
    };
  }, [baseLat, baseLng]);

  // Render Markers and Polyline Routes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerGroupRef.current;
    const linesLayer = linesLayerGroupRef.current;

    if (!map || !markersLayer || !linesLayer || !leaflet) return;

    markersLayer.clearLayers();
    linesLayer.clearLayers();

    if (filteredMarkers.length === 0) return;

    const bounds = leaflet.latLngBounds([]);
    const itinerary = plan?.itinerary || [];

    // 1. Draw Routes for days
    if (activeDayFilter === 'all') {
      itinerary.forEach((day, dIdx) => {
        const dayColor = DAY_COLORS[dIdx % DAY_COLORS.length];
        const dayCoords: [number, number][] = [];
        const schedule = day?.schedule || [];

        schedule.forEach((act, aIdx) => {
          const lat = act?.coordinates?.lat || baseLat + Math.sin((day.day_number || 1) * 2 + aIdx) * 0.02;
          const lng = act?.coordinates?.lng || baseLng + Math.cos((day.day_number || 1) * 2 + aIdx) * 0.02;
          dayCoords.push([lat, lng]);
        });

        if (dayCoords.length > 1) {
          leaflet.polyline(dayCoords, {
            color: dayColor,
            weight: 3,
            opacity: 0.8,
            dashArray: '6, 6',
          }).addTo(linesLayer);
        }
      });
    } else {
      const targetDay = itinerary.find((d) => d.day_number === activeDayFilter);
      if (targetDay) {
        const dayColor = DAY_COLORS[((targetDay.day_number || 1) - 1) % DAY_COLORS.length];
        const dayCoords: [number, number][] = [];
        const schedule = targetDay?.schedule || [];

        schedule.forEach((act, aIdx) => {
          const lat = act?.coordinates?.lat || baseLat + Math.sin((targetDay.day_number || 1) * 2 + aIdx) * 0.02;
          const lng = act?.coordinates?.lng || baseLng + Math.cos((targetDay.day_number || 1) * 2 + aIdx) * 0.02;
          dayCoords.push([lat, lng]);
        });

        if (dayCoords.length > 1) {
          leaflet.polyline(dayCoords, {
            color: dayColor,
            weight: 4,
            opacity: 0.9,
          }).addTo(linesLayer);
        }
      }
    }

    // 2. Add Markers
    filteredMarkers.forEach((marker) => {
      bounds.extend([marker.lat, marker.lng]);

      let iconHtml = '';
      let markerColor = '#3B82F6';

      if (marker.category === 'activity') {
        const dNum = marker.dayNumber || 1;
        markerColor = DAY_COLORS[(dNum - 1) % DAY_COLORS.length];
        iconHtml = `
          <div style="background-color: ${markerColor}; color: white; border: 2px solid #1A1A1A; border-radius: 12px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 12px; box-shadow: 2px 2px 0px #1A1A1A;">
            D${dNum}
          </div>
        `;
      } else if (marker.category === 'hotel') {
        markerColor = '#8B5CF6';
        iconHtml = `
          <div style="background-color: ${markerColor}; color: white; border: 2px solid #1A1A1A; border-radius: 12px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 14px; box-shadow: 2px 2px 0px #1A1A1A;">
            H
          </div>
        `;
      } else {
        markerColor = '#EF4444';
        iconHtml = `
          <div style="background-color: ${markerColor}; color: white; border: 2px solid #1A1A1A; border-radius: 12px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 14px; box-shadow: 2px 2px 0px #1A1A1A;">
            F
          </div>
        `;
      }

      const customIcon = leaflet.divIcon({
        className: 'custom-map-pin',
        html: iconHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const mapPin = leaflet.marker([marker.lat, marker.lng], { icon: customIcon }).addTo(markersLayer);

      mapPin.on('click', () => {
        setSelectedMarker(marker);
      });
    });

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }
  }, [filteredMarkers, activeDayFilter, plan, baseLat, baseLng]);

  const itineraryList = plan?.itinerary || [];
  const activeDayPlan =
    typeof activeDayFilter === 'number'
      ? itineraryList.find((d) => d.day_number === activeDayFilter)
      : null;

  const currentGoogleMapsUrl = activeDayPlan
    ? generateDayGoogleMapsUrl(activeDayPlan, plan?.trip_summary?.destination || '')
    : generateTripGoogleMapsUrl(plan);

  return (
    <div className="space-y-4" id="interactive-map-section">
      {/* Top Map Controls & Google Maps Sync Toolbar */}
      <div className="rounded-3xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-white dark:bg-[#1E232B] p-4 sm:p-5 shadow-[4px_4px_0px_0px_#1A1A1A] dark:shadow-[4px_4px_0px_0px_#000000] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors">
        {/* Left: Day and Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Day Selector */}
          <span className="text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400 mr-1">
            Day:
          </span>
          <button
            type="button"
            onClick={() => {
              setActiveDayFilter('all');
              if (onSelectDay) onSelectDay(0);
            }}
            className={`px-3 py-1.5 text-xs font-black border-2 border-[#1A1A1A] dark:border-[#384152] rounded-xl transition-all ${
              activeDayFilter === 'all'
                ? 'bg-[#1A1A1A] dark:bg-[#C5E876] text-white dark:text-[#1A1A1A] shadow-[2px_2px_0px_0px_#3B82F6]'
                : 'bg-[#FFFFFF] dark:bg-[#14171D] text-[#1A1A1A] dark:text-[#F3F4F6] hover:bg-[#F3F4F1] dark:hover:bg-[#28303B]'
            }`}
          >
            All Days
          </button>
          {itineraryList.map((day) => (
            <button
              key={day.day_number}
              type="button"
              onClick={() => {
                setActiveDayFilter(day.day_number);
                if (onSelectDay) onSelectDay(day.day_number);
              }}
              className={`px-3 py-1.5 text-xs font-black border-2 border-[#1A1A1A] dark:border-[#384152] rounded-xl transition-all ${
                activeDayFilter === day.day_number
                  ? 'bg-[#3B82F6] text-white shadow-[2px_2px_0px_0px_#1A1A1A]'
                  : 'bg-[#FFFFFF] dark:bg-[#14171D] text-[#1A1A1A] dark:text-[#F3F4F6] hover:bg-[#F3F4F1] dark:hover:bg-[#28303B]'
              }`}
            >
              Day {day.day_number}
            </button>
          ))}

          {/* Category Filter */}
          <span className="text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400 ml-2 mr-1">
            Type:
          </span>
          <div className="inline-flex rounded-xl border-2 border-[#1A1A1A] dark:border-[#384152] p-0.5 bg-[#FAF9F5] dark:bg-[#14171D]">
            <button
              type="button"
              onClick={() => setActiveCategoryFilter('all')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                activeCategoryFilter === 'all'
                  ? 'bg-white dark:bg-[#1E232B] text-[#1A1A1A] dark:text-[#F3F4F6] shadow-xs'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setActiveCategoryFilter('activities')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                activeCategoryFilter === 'activities'
                  ? 'bg-[#3B82F6] text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              Attractions
            </button>
            <button
              type="button"
              onClick={() => setActiveCategoryFilter('hotels')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                activeCategoryFilter === 'hotels'
                  ? 'bg-[#8B5CF6] text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              Hotels
            </button>
            <button
              type="button"
              onClick={() => setActiveCategoryFilter('restaurants')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                activeCategoryFilter === 'restaurants'
                  ? 'bg-[#EF4444] text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              Dining
            </button>
          </div>
        </div>

        {/* Right: Direct 1-Click Google Maps Import / Open in Google Maps */}
        <div className="flex flex-wrap items-center gap-2 print:hidden w-full md:w-auto justify-end">
          <a
            href={currentGoogleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-[#C5E876] px-4 py-2 text-xs sm:text-sm font-black text-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] dark:shadow-[2px_2px_0px_0px_#000000] transition hover:bg-[#b8dd67] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            title="Open turn-by-turn route with all waypoints in Google Maps"
          >
            <Navigation className="h-4 w-4 text-[#1A1A1A]" />
            <span>Open in Google Maps</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          <a
            href="https://www.google.com/maps/d/u/0/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-white dark:bg-[#14171D] px-3.5 py-2 text-xs font-bold text-[#1A1A1A] dark:text-[#F3F4F6] shadow-[2px_2px_0px_0px_#1A1A1A] dark:shadow-[2px_2px_0px_0px_#000000] transition hover:bg-stone-50 dark:hover:bg-[#28303B] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            title="Create or view custom maps in Google My Maps"
          >
            <Route className="h-3.5 w-3.5 text-[#3B82F6]" />
            <span>Google My Maps</span>
          </a>
        </div>
      </div>

      {/* Main Map Canvas and Sidebar Bento Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Map Canvas */}
        <div className="lg:col-span-8 overflow-hidden rounded-3xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-white dark:bg-[#1E232B] shadow-[6px_6px_0px_0px_#1A1A1A] dark:shadow-[6px_6px_0px_0px_#000000] relative">
          <div ref={mapContainerRef} className="h-[460px] sm:h-[540px] w-full z-0" />

          {/* Map Legend Floating Pill */}
          <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 dark:bg-[#1E232B]/95 backdrop-blur-sm border-2 border-[#1A1A1A] dark:border-[#384152] rounded-2xl p-2.5 shadow-[2px_2px_0px_0px_#1A1A1A] dark:shadow-[2px_2px_0px_0px_#000000] flex flex-wrap items-center gap-3 text-xs font-bold text-[#1A1A1A] dark:text-[#F3F4F6]">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-md bg-[#3B82F6] border border-[#1A1A1A]" />
              <span>Attractions</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-md bg-[#8B5CF6] border border-[#1A1A1A]" />
              <span>Hotels (H)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-md bg-[#EF4444] border border-[#1A1A1A]" />
              <span>Food & Dining (F)</span>
            </div>
          </div>
        </div>

        {/* Selected Marker Details / Itinerary Waypoints Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {selectedMarker ? (
            <div className="rounded-3xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-white dark:bg-[#1E232B] p-5 shadow-[4px_4px_0px_0px_#1A1A1A] dark:shadow-[4px_4px_0px_0px_#000000] space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 text-xs font-black rounded-lg text-white ${
                      selectedMarker.category === 'activity'
                        ? 'bg-[#3B82F6]'
                        : selectedMarker.category === 'hotel'
                        ? 'bg-[#8B5CF6]'
                        : 'bg-[#EF4444]'
                    }`}
                  >
                    {selectedMarker.category === 'activity' && selectedMarker.dayNumber
                      ? `Day ${selectedMarker.dayNumber} Stop`
                      : selectedMarker.category === 'hotel'
                      ? 'Hotel Stay'
                      : 'Dining Place'}
                  </span>
                  {selectedMarker.timeSlot && (
                    <span className="px-2 py-0.5 text-xs font-bold bg-stone-100 dark:bg-[#14171D] text-stone-700 dark:text-stone-300 rounded-md border border-stone-200 dark:border-stone-700">
                      {selectedMarker.timeSlot}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setSelectedMarker(null)}
                  className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 text-xs font-bold"
                >
                  ✕ Close
                </button>
              </div>

              <div>
                <h4 className="text-lg font-black text-[#1A1A1A] dark:text-[#F3F4F6]">{selectedMarker.name}</h4>
                <p className="text-xs font-bold text-stone-500 dark:text-stone-400 mt-0.5">
                  {selectedMarker.neighborhood || plan?.trip_summary?.destination}
                </p>
              </div>

              <p className="text-xs sm:text-sm font-medium text-stone-700 dark:text-stone-300 leading-relaxed">
                {selectedMarker.description}
              </p>

              {selectedMarker.tip && (
                <div className="rounded-xl border border-stone-200 dark:border-[#2E3744] bg-[#FAF9F5] dark:bg-[#14171D] p-3 text-xs font-semibold text-stone-800 dark:text-stone-200">
                  <span className="font-bold text-[#3B82F6] dark:text-[#60A5FA]">💡 Insider Tip: </span>
                  <span>{selectedMarker.tip}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <a
                  href={generatePlaceGoogleMapsUrl(
                    selectedMarker.name,
                    plan?.trip_summary?.destination || '',
                    selectedMarker.neighborhood
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-black bg-[#C5E876] text-[#1A1A1A] border-2 border-[#1A1A1A] dark:border-[#384152] rounded-xl shadow-[2px_2px_0px_0px_#1A1A1A] hover:bg-[#b8dd67] transition"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#1A1A1A]" />
                  <span>Google Maps Info</span>
                  <ExternalLink className="w-3 h-3 text-[#1A1A1A]" />
                </a>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-[#FAF9F5] dark:bg-[#14171D] p-5 shadow-[4px_4px_0px_0px_#1A1A1A] dark:shadow-[4px_4px_0px_0px_#000000] text-center flex flex-col items-center justify-center min-h-[220px]">
              <Compass className="w-10 h-10 text-stone-400 dark:text-stone-500 mb-2" />
              <h4 className="text-sm font-black text-[#1A1A1A] dark:text-[#F3F4F6]">Pin Explorer</h4>
              <p className="text-xs font-medium text-stone-500 dark:text-stone-400 mt-1 max-w-[200px]">
                Click on any map pin or route stop to inspect travel times, tips, and open Google Maps navigation.
              </p>
            </div>
          )}

          {/* Quick Waypoints List for the current filtered view */}
          <div className="rounded-3xl border-2 border-[#1A1A1A] dark:border-[#384152] bg-white dark:bg-[#1E232B] p-4 shadow-[4px_4px_0px_0px_#1A1A1A] dark:shadow-[4px_4px_0px_0px_#000000] max-h-[320px] overflow-y-auto space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-[#2E3744]">
              <span className="text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Waypoints ({filteredMarkers.length})
              </span>
              <span className="text-[11px] font-bold text-[#3B82F6]">
                {activeDayFilter === 'all' ? 'Entire Trip' : `Day ${activeDayFilter}`}
              </span>
            </div>

            <div className="space-y-1.5 pt-1">
              {filteredMarkers.map((marker, idx) => (
                <button
                  key={marker.id || idx}
                  onClick={() => setSelectedMarker(marker)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-between gap-2 ${
                    selectedMarker?.id === marker.id
                      ? 'border-[#1A1A1A] dark:border-[#384152] bg-[#EFF6FF] dark:bg-[#1E3A5F] text-[#1D4ED8] dark:text-[#93C5FD]'
                      : 'border-transparent hover:border-stone-200 dark:hover:border-stone-700 bg-stone-50 dark:bg-[#14171D] text-stone-800 dark:text-stone-200'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                        marker.category === 'activity'
                          ? 'bg-[#3B82F6]'
                          : marker.category === 'hotel'
                          ? 'bg-[#8B5CF6]'
                          : 'bg-[#EF4444]'
                      }`}
                    />
                    <span className="truncate">{marker.name}</span>
                  </div>
                  {marker.dayNumber && (
                    <span className="text-[10px] text-stone-400 shrink-0">D{marker.dayNumber}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
