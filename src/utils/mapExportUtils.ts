import { DayItinerary, ActivityItem, ItineraryPlanResponse } from '../types';
import { getFormattedDayDate } from './seasonUtils';

/**
 * Generates a direct Google Maps directions URL with waypoints for a specific day.
 */
export function generateDayGoogleMapsUrl(day: DayItinerary, destination: string): string {
  if (!day.schedule || day.schedule.length === 0) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`;
  }

  const cleanDest = destination.split(',')[0].trim();
  const places = day.schedule.map((item) => `${item.activity_name}, ${cleanDest}`);

  if (places.length === 1) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(places[0])}`;
  }

  const origin = encodeURIComponent(places[0]);
  const finalDest = encodeURIComponent(places[places.length - 1]);
  const waypoints = places
    .slice(1, -1)
    .map((p) => encodeURIComponent(p))
    .join('|');

  let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${finalDest}&travelmode=transit`;
  if (waypoints) {
    url += `&waypoints=${waypoints}`;
  }
  return url;
}

/**
 * Generates a Google Maps directions URL connecting key landmarks across the entire trip.
 */
export function generateTripGoogleMapsUrl(plan: ItineraryPlanResponse): string {
  const cleanDest = plan.trip_summary.destination.split(',')[0].trim();
  const allActivities: string[] = [];

  plan.itinerary.forEach((day) => {
    if (day.schedule && day.schedule.length > 0) {
      // Pick top 2 key activities from each day to avoid overflowing URL limits
      day.schedule.slice(0, 2).forEach((item) => {
        allActivities.push(`${item.activity_name}, ${cleanDest}`);
      });
    }
  });

  if (allActivities.length === 0) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cleanDest)}`;
  }

  if (allActivities.length === 1) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(allActivities[0])}`;
  }

  const origin = encodeURIComponent(allActivities[0]);
  const destination = encodeURIComponent(allActivities[allActivities.length - 1]);
  const waypoints = allActivities
    .slice(1, Math.min(allActivities.length - 1, 9)) // Google Maps supports up to 8-9 waypoints
    .map((p) => encodeURIComponent(p))
    .join('|');

  let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=transit`;
  if (waypoints) {
    url += `&waypoints=${waypoints}`;
  }
  return url;
}

/**
 * Generates a direct Google Maps search link for a single activity, hotel, or restaurant.
 */
export function generatePlaceGoogleMapsUrl(placeName: string, destination: string, neighborhood?: string): string {
  const query = `${placeName}${neighborhood ? `, ${neighborhood}` : ''}, ${destination.split(',')[0].trim()}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/**
 * Generates a 1-click Google Calendar web import URL (no file download needed).
 * Opens Google Calendar directly in browser with all details pre-filled.
 */
export function generateGoogleCalendarEventUrl(options: {
  title: string;
  details: string;
  location: string;
  startDate: Date;
  durationHours?: number;
  allDay?: boolean;
}): string {
  const { title, details, location, startDate, durationHours = 8, allDay = false } = options;

  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  let startIso: string;
  let endIso: string;

  if (allDay) {
    const year = startDate.getFullYear();
    const month = pad(startDate.getMonth() + 1);
    const day = pad(startDate.getDate());
    startIso = `${year}${month}${day}`;

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);
    const endYear = endDate.getFullYear();
    const endMonth = pad(endDate.getMonth() + 1);
    const endDay = pad(endDate.getDate());
    endIso = `${endYear}${endMonth}${endDay}`;
  } else {
    // Format: YYYYMMDDTHHmmssZ
    const year = startDate.getUTCFullYear();
    const month = pad(startDate.getUTCMonth() + 1);
    const day = pad(startDate.getUTCDate());
    const hours = pad(startDate.getUTCHours());
    const minutes = pad(startDate.getUTCMinutes());
    startIso = `${year}${month}${day}T${hours}${minutes}00Z`;

    const endDate = new Date(startDate.getTime() + durationHours * 60 * 60 * 1000);
    const endYear = endDate.getUTCFullYear();
    const endMonth = pad(endDate.getUTCMonth() + 1);
    const endDay = pad(endDate.getUTCDate());
    const endHours = pad(endDate.getUTCHours());
    const endMinutes = pad(endDate.getUTCMinutes());
    endIso = `${endYear}${endMonth}${endDay}T${endHours}${endMinutes}00Z`;
  }

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${startIso}/${endIso}`,
    details: details,
    location: location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Creates Google Calendar 1-click import URL for a single itinerary day.
 */
export function generateDayGoogleCalendarUrl(
  day: DayItinerary,
  destination: string,
  startDateStr: string
): string {
  const dayDate = getFormattedDayDate(startDateStr, day.day_number - 1);
  const title = `Day ${day.day_number}: ${day.day_theme} - ${destination}`;

  let details = `Travel Itinerary for ${destination}\nDay ${day.day_number}: ${day.day_theme}\nArea: ${day.geographical_focus}\n\nSCHEDULE:\n`;

  day.schedule.forEach((item) => {
    details += `• [${item.time_slot}] ${item.activity_name} (~${item.estimated_duration_hours}h)\n  ${item.description}\n  Tip: ${item.insider_tip}\n  Cost: ${item.cost_tier}\n\n`;
  });

  const location = `${day.geographical_focus}, ${destination}`;

  // Start at 9:00 AM local on that date
  const eventDate = new Date(dayDate.dateObj);
  eventDate.setHours(9, 0, 0, 0);

  return generateGoogleCalendarEventUrl({
    title,
    details,
    location,
    startDate: eventDate,
    durationHours: 10,
    allDay: false,
  });
}

/**
 * Creates Google Calendar 1-click import URL for the entire multi-day trip.
 */
export function generateFullTripGoogleCalendarUrl(
  plan: ItineraryPlanResponse,
  startDateStr: string
): string {
  const dayDate = getFormattedDayDate(startDateStr, 0);
  const title = `Trip to ${plan.trip_summary.destination} (${plan.trip_summary.total_days} Days)`;

  let details = `Destination: ${plan.trip_summary.destination}\nDuration: ${plan.trip_summary.total_days} Days\nTheme: ${plan.trip_summary.theme_vibe}\n\nDAILY OVERVIEW:\n`;

  plan.itinerary.forEach((d) => {
    const curDate = getFormattedDayDate(startDateStr, d.day_number - 1);
    details += `\nDay ${d.day_number} (${curDate.formattedShort}) - ${d.day_theme} [${d.geographical_focus}]:\n`;
    d.schedule.forEach((item) => {
      details += `  - ${item.time_slot}: ${item.activity_name} (${item.cost_tier})\n`;
    });
  });

  details += `\nLogistics: ${plan.local_logistics_guide.best_transit_method}\n`;

  const location = plan.trip_summary.destination;
  const eventDate = new Date(dayDate.dateObj);
  eventDate.setHours(9, 0, 0, 0);

  return generateGoogleCalendarEventUrl({
    title,
    details,
    location,
    startDate: eventDate,
    durationHours: plan.trip_summary.total_days * 24,
    allDay: true,
  });
}
