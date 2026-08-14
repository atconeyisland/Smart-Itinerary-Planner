export interface SeasonInfo {
  seasonName: 'Spring' | 'Summer' | 'Autumn / Fall' | 'Winter' | 'Monsoon / Rainy';
  monthName: string;
  year: number;
  temperatureRange: string;
  climateDescription: string;
  recommendedClothing: string[];
  daylightHours: string;
  seasonalHighlights: string[];
  crowdLevel: 'High (Peak Season)' | 'Moderate' | 'Low (Shoulder / Off-Peak)';
}

/**
 * Calculates day dates given a start date string (YYYY-MM-DD) and day offset (0-indexed).
 */
export function getFormattedDayDate(startDateStr: string, dayOffset: number): {
  isoDate: string;
  formattedShort: string; // e.g. "Mon, Oct 12"
  formattedFull: string;  // e.g. "Monday, October 12, 2026"
  dayOfWeek: string;
  dateObj: Date;
} {
  let baseDate = new Date();
  if (startDateStr) {
    const parts = startDateStr.split('-');
    if (parts.length === 3) {
      baseDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    }
  }

  const targetDate = new Date(baseDate);
  targetDate.setDate(baseDate.getDate() + dayOffset);

  const dayOfWeek = targetDate.toLocaleDateString('en-US', { weekday: 'short' });
  const dayOfWeekLong = targetDate.toLocaleDateString('en-US', { weekday: 'long' });
  const monthShort = targetDate.toLocaleDateString('en-US', { month: 'short' });
  const monthLong = targetDate.toLocaleDateString('en-US', { month: 'long' });
  const dayNum = targetDate.getDate();
  const year = targetDate.getFullYear();

  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const isoDate = `${year}-${pad(targetDate.getMonth() + 1)}-${pad(dayNum)}`;

  return {
    isoDate,
    formattedShort: `${dayOfWeek}, ${monthShort} ${dayNum}`,
    formattedFull: `${dayOfWeekLong}, ${monthLong} ${dayNum}, ${year}`,
    dayOfWeek,
    dateObj: targetDate,
  };
}

/**
 * Analyzes season and weather advisory based on destination and travel date.
 */
export function getSeasonAnalysis(destination: string, startDateStr: string): SeasonInfo {
  let date = new Date();
  if (startDateStr) {
    const parts = startDateStr.split('-');
    if (parts.length === 3) {
      date = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    }
  }

  const month = date.getMonth(); // 0 = Jan, 11 = Dec
  const monthName = date.toLocaleDateString('en-US', { month: 'long' });
  const year = date.getFullYear();

  const destLower = (destination || '').toLowerCase();

  // Check Southern Hemisphere (Australia, New Zealand, South Africa, Argentina, Chile, Brazil)
  const isSouthernHemisphere =
    destLower.includes('australia') ||
    destLower.includes('sydney') ||
    destLower.includes('melbourne') ||
    destLower.includes('new zealand') ||
    destLower.includes('auckland') ||
    destLower.includes('south africa') ||
    destLower.includes('cape town') ||
    destLower.includes('buenos aires') ||
    destLower.includes('santiago') ||
    destLower.includes('rio');

  // Check Tropical / Monsoon Regions (India, Thailand, Vietnam, Bali, Indonesia, Singapore)
  const isTropicalMonsoon =
    destLower.includes('india') ||
    destLower.includes('jaipur') ||
    destLower.includes('goa') ||
    destLower.includes('kerala') ||
    destLower.includes('delhi') ||
    destLower.includes('mumbai') ||
    destLower.includes('bangkok') ||
    destLower.includes('thailand') ||
    destLower.includes('bali') ||
    destLower.includes('vietnam');

  // Check Middle East / Desert (Dubai, Abu Dhabi, Doha, Egypt, Jordan)
  const isDesert =
    destLower.includes('dubai') ||
    destLower.includes('uae') ||
    destLower.includes('doha') ||
    destLower.includes('qatar') ||
    destLower.includes('cairo') ||
    destLower.includes('egypt') ||
    destLower.includes('jordan');

  if (isDesert) {
    if (month >= 4 && month <= 8) {
      // May to Sept - Extreme Summer
      return {
        seasonName: 'Summer',
        monthName,
        year,
        temperatureRange: '36°C – 44°C (97°F – 111°F)',
        climateDescription: 'Hot sunny desert weather with intense afternoon heat. Indoor attractions, air-conditioned transit, and early morning/late evening outdoor visits recommended.',
        recommendedClothing: ['Light breathable cotton/linen', 'UV protective sunglasses', 'Sun hat & SPF 50+', 'Light shawl/cover-up for air-conditioned interiors'],
        daylightHours: 'Approx 13.5 hours daylight (Sunrise ~5:30 AM, Sunset ~7:10 PM)',
        seasonalHighlights: ['Summer shopping festivals', 'Night desert safaris', 'Air-conditioned luxury attractions', 'Fewer outdoor tourist crowds'],
        crowdLevel: 'Low (Shoulder / Off-Peak)',
      };
    } else {
      // Oct to April - Peak Pleasant Winter
      return {
        seasonName: 'Winter',
        monthName,
        year,
        temperatureRange: '18°C – 28°C (64°F – 82°F)',
        climateDescription: 'Pleasant, warm, sunny days and cool breezy evenings. Prime outdoor sightseeing season for promenades, desert camping, and open-air souks.',
        recommendedClothing: ['Comfortable casual daywear', 'Light jacket or cardigan for breezy evenings', 'Walking sneakers', 'Sun protection'],
        daylightHours: 'Approx 11 hours daylight (Sunrise ~6:45 AM, Sunset ~5:50 PM)',
        seasonalHighlights: ['Open-air beach walks & rooftop dining', 'Desert safaris with pleasant starlit dinners', 'Outdoor cultural festivals & markets'],
        crowdLevel: 'High (Peak Season)',
      };
    }
  }

  if (isTropicalMonsoon) {
    if (month >= 5 && month <= 8) {
      // Jun to Sept - Monsoon / Summer
      return {
        seasonName: 'Monsoon / Rainy',
        monthName,
        year,
        temperatureRange: '26°C – 34°C (79°F – 93°F)',
        climateDescription: 'Humid with periodic refreshing rain showers and lush green nature. Great for peaceful sightseeing, lower hotel rates, and scenic waterfalls/palace gardens.',
        recommendedClothing: ['Waterproof rain jacket or sturdy umbrella', 'Quick-drying moisture-wicking fabrics', 'Water-resistant walking footwear', 'Insect repellent'],
        daylightHours: 'Approx 13 hours daylight (Sunrise ~5:45 AM, Sunset ~7:00 PM)',
        seasonalHighlights: ['Lush emerald green landscapes', 'Thriving waterfalls & rejuvenated palace fountains', 'Authentic local monsoon street snacks & hot chai'],
        crowdLevel: 'Moderate',
      };
    } else if (month >= 2 && month <= 4) {
      // Mar to May - Warm Summer
      return {
        seasonName: 'Summer',
        monthName,
        year,
        temperatureRange: '28°C – 38°C (82°F – 100°F)',
        climateDescription: 'Sunny and warm to hot. Best to explore monuments and markets in the crisp early mornings (8:00 AM - 11:30 AM) and serene late afternoons.',
        recommendedClothing: ['100% loose cotton/linen clothing', 'Wide-brim sun hat', 'Polarized sunglasses', 'Refillable insulated water bottle'],
        daylightHours: 'Approx 12.5 hours daylight (Sunrise ~6:10 AM, Sunset ~6:45 PM)',
        seasonalHighlights: ['Vibrant evening bazaars and night monuments', 'Summer mango and seasonal fruit drinks', 'Less crowded early morning shrine visits'],
        crowdLevel: 'Moderate',
      };
    } else {
      // Oct to Feb - Peak Winter / Dry Season
      return {
        seasonName: 'Winter',
        monthName,
        year,
        temperatureRange: '12°C – 26°C (54°F – 79°F)',
        climateDescription: 'Dry, crisp, sunny days and cool comfortable evenings. Perfect weather for long walking tours, outdoor monument photography, and rooftop dining.',
        recommendedClothing: ['Light sweater, fleece, or shawl for mornings/evenings', 'Breathable daytime layers', 'Comfortable walking shoes'],
        daylightHours: 'Approx 10.5 hours daylight (Sunrise ~7:00 AM, Sunset ~5:40 PM)',
        seasonalHighlights: ['Vibrant cultural festivals and open-air folk fairs', 'Pleasant all-day walking without excessive heat', 'Al-fresco heritage dining under starry skies'],
        crowdLevel: 'High (Peak Season)',
      };
    }
  }

  if (isSouthernHemisphere) {
    if (month >= 11 || month <= 1) {
      // Dec-Feb: Summer
      return {
        seasonName: 'Summer',
        monthName,
        year,
        temperatureRange: '20°C – 30°C (68°F – 86°F)',
        climateDescription: 'Warm, sunny summer weather. Long daylight hours for beaches, outdoor dining, and coastal walks.',
        recommendedClothing: ['Light summer fabrics', 'Swimwear & beach towel', 'Sun hat & SPF 50+', 'Comfortable sandals & walking shoes'],
        daylightHours: 'Approx 14.5 hours daylight (Sunrise ~5:40 AM, Sunset ~8:05 PM)',
        seasonalHighlights: ['Coastal walks & outdoor harbor cruises', 'Summer open-air cinema & food festivals', 'Vibrant evening nightlife'],
        crowdLevel: 'High (Peak Season)',
      };
    } else if (month >= 2 && month <= 4) {
      // Mar-May: Autumn
      return {
        seasonName: 'Autumn / Fall',
        monthName,
        year,
        temperatureRange: '14°C – 23°C (57°F – 73°F)',
        climateDescription: 'Crisp, mild temperatures with golden fall colors and pleasant walking conditions.',
        recommendedClothing: ['Light layers & cardigans', 'Comfortable walking shoes', 'Light scarf or windbreaker'],
        daylightHours: 'Approx 11.5 hours daylight (Sunrise ~6:30 AM, Sunset ~6:00 PM)',
        seasonalHighlights: ['Wine harvest season & tasting tours', 'Scenic botanical garden foliage', 'Peaceful sightseeing with comfortable weather'],
        crowdLevel: 'Moderate',
      };
    } else if (month >= 5 && month <= 7) {
      // Jun-Aug: Winter
      return {
        seasonName: 'Winter',
        monthName,
        year,
        temperatureRange: '8°C – 17°C (46°F – 63°F)',
        climateDescription: 'Cool to crisp winter days. Great for museum explorations, cozy dining, and scenic coastal whale watching.',
        recommendedClothing: ['Warm coat or jacket', 'Layered knitwear & long pants', 'Sturdy walking shoes'],
        daylightHours: 'Approx 10 hours daylight (Sunrise ~7:00 AM, Sunset ~5:00 PM)',
        seasonalHighlights: ['Winter light & music festivals', 'Cozy heritage pubs & fireplace dining', 'Off-peak hotel rates and uncrowded galleries'],
        crowdLevel: 'Low (Shoulder / Off-Peak)',
      };
    } else {
      // Sep-Nov: Spring
      return {
        seasonName: 'Spring',
        monthName,
        year,
        temperatureRange: '15°C – 24°C (59°F – 75°F)',
        climateDescription: 'Blooming flowers, fresh breezes, and comfortable warm sunshine.',
        recommendedClothing: ['Light layers & denim jacket', 'Walking shoes', 'Sunglasses & light hat'],
        daylightHours: 'Approx 13 hours daylight (Sunrise ~6:00 AM, Sunset ~7:15 PM)',
        seasonalHighlights: ['Wildflower blooms & park walks', 'Spring market stalls & craft fairs', 'Ideal temperatures for hiking & cycling'],
        crowdLevel: 'Moderate',
      };
    }
  }

  // Northern Hemisphere Standard (Japan, Europe, USA, Canada, East Asia)
  if (month >= 2 && month <= 4) {
    // Mar to May - Spring
    return {
      seasonName: 'Spring',
      monthName,
      year,
      temperatureRange: '11°C – 21°C (52°F – 70°F)',
      climateDescription: 'Mild, fresh spring weather with blooming flowers (cherry blossoms in Japan, tulip blooms in Europe). Crisp mornings giving way to pleasant afternoons.',
      recommendedClothing: ['Light jacket or trench coat', 'Layered knitwear & shirts', 'Comfortable slip-on walking shoes', 'Compact umbrella for occasional spring showers'],
      daylightHours: 'Approx 13 hours daylight (Sunrise ~5:45 AM, Sunset ~6:45 PM)',
      seasonalHighlights: ['Spring blossom illuminations in parks & gardens', 'Outdoor cafe terraces & seasonal street food', 'Comfortable walking temperatures for monument tours'],
      crowdLevel: 'High (Peak Season)',
    };
  } else if (month >= 5 && month <= 7) {
    // Jun to Aug - Summer
    return {
      seasonName: 'Summer',
      monthName,
      year,
      temperatureRange: '22°C – 32°C (72°F – 90°F)',
      climateDescription: 'Warm to hot sunny days with long evening daylight. Excellent for evening river cruises, open-air festivals, and rooftop dining.',
      recommendedClothing: ['Lightweight breathable fabrics', 'Sunglasses & sun protection hat', 'Comfortable ventilated sneakers', 'Water bottle & portable fan/parasol'],
      daylightHours: 'Approx 14.5 hours daylight (Sunrise ~5:00 AM, Sunset ~7:30 PM)',
      seasonalHighlights: ['Vibrant summer evening festivals & night markets', 'Late sunset dinners by the river or beach', 'Full schedule of outdoor concerts & cultural events'],
      crowdLevel: 'High (Peak Season)',
    };
  } else if (month >= 8 && month <= 10) {
    // Sep to Nov - Autumn
    return {
      seasonName: 'Autumn / Fall',
      monthName,
      year,
      temperatureRange: '12°C – 22°C (54°F – 72°F)',
      climateDescription: 'Pleasant, crisp air with spectacular autumn foliage (golden ginkgo & red maple in Japan, golden leaves across Europe & USA). Highly recommended travel window.',
      recommendedClothing: ['Comfortable light layers, cardigans & jackets', 'Comfortable walking sneakers', 'Scarf for cool evenings', 'Compact travel umbrella'],
      daylightHours: 'Approx 11.5 hours daylight (Sunrise ~6:00 AM, Sunset ~5:30 PM)',
      seasonalHighlights: ['Vibrant autumn leaf illuminations at temples & castles', 'Seasonal harvest delicacies (chestnuts, truffles, roasted treats)', 'Crystal-clear visibility for scenic viewpoints'],
      crowdLevel: 'High (Peak Season)',
    };
  } else {
    // Dec to Feb - Winter
    return {
      seasonName: 'Winter',
      monthName,
      year,
      temperatureRange: '2°C – 10°C (36°F – 50°F)',
      climateDescription: 'Cool to cold winter atmosphere with festive illuminations, hot thermal baths, and seasonal hotpot / hearty dining. Clean winter skies and fewer lines at major museums.',
      recommendedClothing: ['Warm insulated winter coat', 'Thermal innerwear (Heattech), gloves & warm scarf', 'Comfortable warm walking boots/shoes', 'Moisturizing lip balm & hand lotion'],
      daylightHours: 'Approx 9.5 hours daylight (Sunrise ~7:00 AM, Sunset ~4:45 PM)',
      seasonalHighlights: ['Spectacular winter city illuminations & holiday markets', 'Cozy hot springs (Onsen/Baths) and hearty winter dining', 'Shorter wait times at world-class museums & palaces'],
      crowdLevel: 'Moderate',
    };
  }
}
