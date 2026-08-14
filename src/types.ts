export type SupportedCurrency = 'USD' | 'EUR' | 'GBP' | 'INR' | 'JPY' | 'AUD' | 'CAD' | 'AED' | 'SGD' | 'CHF';

export interface CurrencyConfig {
  code: SupportedCurrency;
  symbol: string;
  label: string;
  rateAgainstUSD: number; // For instant client-side conversion if needed
}

export interface ActivityItem {
  time_slot: 'Morning' | 'Afternoon' | 'Evening' | string;
  activity_name: string;
  estimated_duration_hours: number;
  description: string;
  cost_tier: string;
  insider_tip: string;
  image_keyword?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  address?: string;
}

export interface DayItinerary {
  day_number: number;
  day_theme: string;
  geographical_focus: string;
  schedule: ActivityItem[];
}

export interface TripSummary {
  destination: string;
  total_days: number;
  theme_vibe: string;
  budget_strategy: string;
  destination_photo?: string;
  destination_coords?: {
    lat: number;
    lng: number;
  };
  country?: string;
  start_date?: string;
}

export interface EstimatedCosts {
  currency: string; // e.g. "USD", "EUR", "GBP", "INR", "JPY"
  currency_symbol?: string; // "$", "€", "£", "₹", "¥"
  activities_per_day: number;
  food_per_day: number;
  hidden_fees_notes: string;
}

export interface LocalLogisticsGuide {
  best_transit_method: string;
  cultural_etiquette_alerts: string[];
  packing_essentials: string[];
  senior_and_accessibility_notes?: string;
}

export interface HotelRecommendation {
  name: string;
  category: 'Luxury & 5-Star' | 'Boutique & Heritage' | 'Comfort & Mid-Range' | 'Budget & Hostels' | 'Resort & Villa' | string;
  neighborhood: string;
  approx_price_per_night: number;
  currency?: string;
  best_for: string; // e.g. "Families & Seniors (quiet, elevator access)", "Couples", "Solo Travelers"
  key_highlights: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  booking_search_query?: string;
}

export interface RestaurantRecommendation {
  name: string;
  cuisine_type: string;
  neighborhood: string;
  must_try_dish: string;
  veg_friendliness: 'Pure Vegetarian' | 'Excellent Veg & Vegan Options' | 'Good Options' | 'Non-Veg Specialist' | 'Halal / Kosher Friendly' | string;
  approx_cost_for_two: number;
  currency?: string;
  senior_and_family_tips: string;
  category_tag?: 'Local Specialty' | 'Fine Dining' | 'Casual Cafe' | 'Street Food Gem' | 'Sweet & Bakery';
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface SurvivalPhrase {
  category: 'Greetings & Courtesy' | 'Food & Drinking Water' | 'Directions & Transport' | 'Shopping & Help' | 'Health & Emergency' | string;
  english_phrase: string;
  local_script: string;
  phonetic_pronunciation: string;
  usage_tip: string;
}

export interface FunFact {
  title: string;
  fact: string;
  tag: string;
}

export interface AirportInfo {
  code: string;
  name: string;
  city: string;
  distance_from_center_km?: number;
}

export interface PopularFlightRoute {
  origin_city: string;
  origin_code: string;
  avg_duration_hours: string;
  typical_airlines: string[];
  is_direct_available: boolean;
  est_economy_fare: string;
  est_business_fare: string;
}

export interface FlightAnalysis {
  destination_airports: AirportInfo[];
  popular_routes?: PopularFlightRoute[];
  airport_transfer_guide: string;
  booking_lead_time_tips: string;
  visa_and_transit_notes?: string;
}

export interface ItineraryPlanResponse {
  id?: string;
  saved_at?: string;
  start_date?: string;
  trip_summary: TripSummary;
  estimated_costs: EstimatedCosts;
  itinerary: DayItinerary[];
  local_logistics_guide: LocalLogisticsGuide;
  hotel_recommendations?: HotelRecommendation[];
  restaurant_recommendations?: RestaurantRecommendation[];
  local_phrases?: SurvivalPhrase[];
  fun_facts?: FunFact[];
  flight_analysis?: FlightAnalysis;
}

export interface PlannerInputs {
  destination: string;
  origin_city?: string;
  start_date?: string; // YYYY-MM-DD
  duration: number; // 1 to 14 days
  currency: SupportedCurrency;
  travelers: string; // e.g. "Couple", "Family with Senior Citizens & Kids", "Solo", "Friends Group"
  budget: string; // e.g. "Pocket-Friendly", "Comfort / Standard", "Luxury"
  pace: string; // "Relaxed (Senior & Family Friendly)", "Balanced", "Active Sightseeing"
  interests: string; // e.g. historical sites, temples, authentic local food, serene gardens, shopping
  constraints: string; // e.g. wheelchair accessible, pure vegetarian food, minimal walking
}

export interface SavedTripMeta {
  id: string;
  title: string;
  destination: string;
  total_days: number;
  currency: string;
  saved_at: string;
  start_date?: string;
  plan: ItineraryPlanResponse;
}
