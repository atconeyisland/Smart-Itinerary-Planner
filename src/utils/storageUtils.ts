import { ItineraryPlanResponse, SavedTripMeta } from '../types';

const STORAGE_KEY = 'smart_itinerary_saved_trips_v2';

export type SavedTripRecord = SavedTripMeta;

export function getSavedTripsFromStorage(): SavedTripMeta[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to parse saved trips from localStorage:', e);
    return [];
  }
}

export const getSavedTrips = getSavedTripsFromStorage;

export function isTripSaved(plan: ItineraryPlanResponse): boolean {
  if (!plan) return false;
  const trips = getSavedTripsFromStorage();
  return trips.some(
    (t) =>
      t.destination.toLowerCase() === plan.trip_summary.destination.toLowerCase() &&
      t.total_days === plan.trip_summary.total_days
  );
}

export function saveTripToStorage(plan: ItineraryPlanResponse, customTitle?: string): SavedTripMeta {
  const existing = getSavedTripsFromStorage();
  const id = plan.id || `trip_${Date.now()}`;
  
  const tripMeta: SavedTripMeta = {
    id,
    title: customTitle || `${plan.trip_summary.destination} (${plan.trip_summary.total_days} Days)`,
    destination: plan.trip_summary.destination,
    total_days: plan.trip_summary.total_days,
    currency: plan.estimated_costs.currency || 'USD',
    saved_at: new Date().toISOString(),
    plan: {
      ...plan,
      id,
      saved_at: new Date().toISOString(),
    },
  };

  // Remove previous if exists with same id or unshift
  const filtered = existing.filter((t) => t.id !== id && t.destination.toLowerCase() !== plan.trip_summary.destination.toLowerCase());
  const updated = [tripMeta, ...filtered];

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save trip to localStorage:', e);
  }

  return tripMeta;
}

export function removeTripFromStorage(id: string): SavedTripMeta[] {
  const existing = getSavedTripsFromStorage();
  const updated = existing.filter((t) => t.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to update localStorage after delete:', e);
  }
  return updated;
}

export const deleteSavedTrip = removeTripFromStorage;
