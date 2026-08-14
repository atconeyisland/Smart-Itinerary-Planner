import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is missing.');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

const SYSTEM_INSTRUCTION = `# SYSTEM INSTRUCTION: GLOBAL SMART TRAVEL ITINERARY & FLIGHT PLANNER

## ROLE & OBJECTIVE
You are a warm, highly knowledgeable, and world-class travel planner designed to create stress-free, accessible, and delightful itineraries for all travelers (senior citizens, families, couples, and solo travelers) for any destination worldwide.

## MANDATORY CURRENCY & PRICING RULES:
1. Format all estimated costs, activity budgets, dining expenses, and hotel rates in the user's REQUESTED CURRENCY (e.g., USD, EUR, GBP, INR, JPY, AUD, CAD, AED, SGD, etc.).
2. Set 'currency' to the requested currency code (e.g. "USD", "INR", "EUR", etc.).
3. Provide realistic ballpark figures in that currency.

## ACCESSIBILITY & SENIOR CITIZEN FRIENDLINESS:
- Schedule realistic time buffers (45–60 mins) for relaxed dining, easy transit, and resting.
- Provide practical walking advice, elevator/seating availability notes, and hydration/restroom tips in insider tips.
- Balance busy morning sightseeing with serene afternoon/evening options.

## GEOGRAPHICAL ACCURACY & COORDINATES:
- Ensure all day schedules cluster geographically adjacent neighborhoods to minimize transit friction.
- Provide approximate real-world latitude and longitude coordinates ({ lat, lng }) for the destination center, each activity, hotel, and restaurant to allow accurate map visualization and Google Maps navigation.

## REQUIRED CONTENT MODULES:
1. **Trip Summary & Theme**: Clear destination title, total days, theme vibe, budget strategy in requested currency, and coordinates ({ lat, lng }).
2. **Estimated Costs**: Daily average for admissions & activities, daily food, and pass/tax advisory notes in requested currency.
3. **Day-by-Day Itinerary**: Geographically clustered neighborhoods with 3 key slots (Morning, Afternoon, Evening) with descriptions, duration, cost tier, coordinates, and insider tips.
4. **Local Logistics & Etiquette**: Best transit method, cultural etiquette alerts, and practical packing essentials.
5. **Hotel & Stay Recommendations (6-8 diverse options)**:
   - Curate 6-8 varied options covering Luxury & 5-Star, Boutique & Heritage, Comfort & Mid-Range, Budget & Hostels, and Resort/Villa with neighborhood, price per night in requested currency, coordinates, and senior/family convenience notes.
6. **Top Restaurant & Dining Recommendations (6-8 diverse options)**:
   - Curate 6-8 varied spots covering iconic local cuisine masters, fine dining/views, casual cafes & breakfast spots, pure vegetarian/vegan options, and famous street food gems with must-try dishes, veg-friendliness, coordinates, and approx cost for two in requested currency.
7. **Local Survival Phrases & Dialect (6-8 phrases)**:
   - Essential greeting, gratitude, asking for water/vegetarian food, asking directions/taxi, emergency, and shopping/bargaining with English phrase, local script, and clear phonetic pronunciation guide.
8. **Fun Facts & Destination Trivia (4-5 engaging facts)**:
   - Fascinating, researched, historical, cultural, or quirky trivia facts about the city.
9. **Flight & Transit Route Guide**:
   - Destination major airport codes (e.g. LHR, HND, JFK, DEL, CDG, DXB, etc.), airport transfer guide, typical flight duration estimates, and booking lead-time tips.
`;

const ITINERARY_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    trip_summary: {
      type: Type.OBJECT,
      properties: {
        destination: { type: Type.STRING },
        total_days: { type: Type.INTEGER },
        theme_vibe: { type: Type.STRING },
        budget_strategy: { type: Type.STRING },
        country: { type: Type.STRING },
        destination_coords: {
          type: Type.OBJECT,
          properties: {
            lat: { type: Type.NUMBER },
            lng: { type: Type.NUMBER },
          },
          required: ['lat', 'lng'],
        },
      },
      required: ['destination', 'total_days', 'theme_vibe', 'budget_strategy'],
    },
    estimated_costs: {
      type: Type.OBJECT,
      properties: {
        currency: { type: Type.STRING },
        activities_per_day: { type: Type.NUMBER },
        food_per_day: { type: Type.NUMBER },
        hidden_fees_notes: { type: Type.STRING },
      },
      required: ['currency', 'activities_per_day', 'food_per_day', 'hidden_fees_notes'],
    },
    itinerary: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day_number: { type: Type.INTEGER },
          day_theme: { type: Type.STRING },
          geographical_focus: { type: Type.STRING },
          schedule: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time_slot: { type: Type.STRING },
                activity_name: { type: Type.STRING },
                estimated_duration_hours: { type: Type.NUMBER },
                description: { type: Type.STRING },
                cost_tier: { type: Type.STRING },
                insider_tip: { type: Type.STRING },
                coordinates: {
                  type: Type.OBJECT,
                  properties: {
                    lat: { type: Type.NUMBER },
                    lng: { type: Type.NUMBER },
                  },
                },
              },
              required: [
                'time_slot',
                'activity_name',
                'estimated_duration_hours',
                'description',
                'cost_tier',
                'insider_tip',
              ],
            },
          },
        },
        required: ['day_number', 'day_theme', 'geographical_focus', 'schedule'],
      },
    },
    local_logistics_guide: {
      type: Type.OBJECT,
      properties: {
        best_transit_method: { type: Type.STRING },
        cultural_etiquette_alerts: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        packing_essentials: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        senior_and_accessibility_notes: { type: Type.STRING },
      },
      required: ['best_transit_method', 'cultural_etiquette_alerts', 'packing_essentials'],
    },
    hotel_recommendations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          category: { type: Type.STRING },
          neighborhood: { type: Type.STRING },
          approx_price_per_night: { type: Type.NUMBER },
          best_for: { type: Type.STRING },
          key_highlights: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          coordinates: {
            type: Type.OBJECT,
            properties: {
              lat: { type: Type.NUMBER },
              lng: { type: Type.NUMBER },
            },
          },
        },
        required: ['name', 'category', 'neighborhood', 'approx_price_per_night', 'best_for', 'key_highlights'],
      },
    },
    restaurant_recommendations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          cuisine_type: { type: Type.STRING },
          neighborhood: { type: Type.STRING },
          must_try_dish: { type: Type.STRING },
          veg_friendliness: { type: Type.STRING },
          approx_cost_for_two: { type: Type.NUMBER },
          senior_and_family_tips: { type: Type.STRING },
          category_tag: { type: Type.STRING },
          coordinates: {
            type: Type.OBJECT,
            properties: {
              lat: { type: Type.NUMBER },
              lng: { type: Type.NUMBER },
            },
          },
        },
        required: [
          'name',
          'cuisine_type',
          'neighborhood',
          'must_try_dish',
          'veg_friendliness',
          'approx_cost_for_two',
          'senior_and_family_tips',
        ],
      },
    },
    local_phrases: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          english_phrase: { type: Type.STRING },
          local_script: { type: Type.STRING },
          phonetic_pronunciation: { type: Type.STRING },
          usage_tip: { type: Type.STRING },
        },
        required: ['category', 'english_phrase', 'local_script', 'phonetic_pronunciation', 'usage_tip'],
      },
    },
    fun_facts: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          fact: { type: Type.STRING },
          tag: { type: Type.STRING },
        },
        required: ['title', 'fact', 'tag'],
      },
    },
    flight_analysis: {
      type: Type.OBJECT,
      properties: {
        destination_airports: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              code: { type: Type.STRING },
              name: { type: Type.STRING },
              city: { type: Type.STRING },
              distance_from_center_km: { type: Type.NUMBER },
            },
            required: ['code', 'name', 'city'],
          },
        },
        popular_routes: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              origin_city: { type: Type.STRING },
              origin_code: { type: Type.STRING },
              avg_duration_hours: { type: Type.STRING },
              typical_airlines: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              is_direct_available: { type: Type.BOOLEAN },
              est_economy_fare: { type: Type.STRING },
              est_business_fare: { type: Type.STRING },
            },
            required: ['origin_city', 'origin_code', 'avg_duration_hours', 'typical_airlines', 'est_economy_fare'],
          },
        },
        airport_transfer_guide: { type: Type.STRING },
        booking_lead_time_tips: { type: Type.STRING },
        visa_and_transit_notes: { type: Type.STRING },
      },
      required: ['destination_airports', 'airport_transfer_guide', 'booking_lead_time_tips'],
    },
  },
  required: [
    'trip_summary',
    'estimated_costs',
    'itinerary',
    'local_logistics_guide',
    'hotel_recommendations',
    'restaurant_recommendations',
    'local_phrases',
    'fun_facts',
  ],
};

// Resilient AI generator helper with model fallbacks and retry backoff
async function generateContentWithRetryAndFallback(
  ai: GoogleGenAI,
  generateParams: {
    contents: string;
    config: any;
  },
  candidateModels: string[] = ['gemini-3.7-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite']
): Promise<string> {
  let lastError: any = null;

  for (const model of candidateModels) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: generateParams.contents,
          config: generateParams.config,
        });

        const text = response.text;
        if (text && text.trim().length > 0) {
          return text;
        }
        throw new Error('Received empty response from AI engine.');
      } catch (err: any) {
        lastError = err;
        const errString = typeof err === 'object' ? JSON.stringify(err) : String(err);
        const errMsg = err?.message || errString;
        console.warn(`[Gemini Engine] ${model} (attempt ${attempt + 1}) error: ${errMsg}`);

        const isTransient =
          errMsg.includes('503') ||
          errMsg.includes('UNAVAILABLE') ||
          errMsg.includes('429') ||
          errMsg.includes('high demand') ||
          errMsg.includes('quota') ||
          errMsg.includes('RESOURCE_EXHAUSTED') ||
          errMsg.includes('fetch failed') ||
          errMsg.includes('ECONNRESET');

        if (isTransient && attempt === 0) {
          await new Promise((resolve) => setTimeout(resolve, 1500));
        } else {
          break;
        }
      }
    }
  }

  throw lastError || new Error('All model attempts failed.');
}

function formatErrorMessage(error: any): string {
  if (!error) return 'An unexpected error occurred.';
  const str = typeof error === 'string' ? error : error?.message || JSON.stringify(error);
  if (str.includes('503') || str.includes('high demand') || str.includes('UNAVAILABLE')) {
    return 'The AI service is experiencing high temporary demand. Please try again in a few moments or choose a quick sample trip below.';
  }
  if (str.includes('429') || str.includes('RESOURCE_EXHAUSTED') || str.includes('quota')) {
    return 'API request rate limit reached. Please wait a moment before trying again.';
  }
  if (str.includes('GEMINI_API_KEY')) {
    return 'Missing GEMINI_API_KEY configuration in environment settings.';
  }
  return error.message || str;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // POST /api/plan-itinerary
  app.post('/api/plan-itinerary', async (req, res) => {
    try {
      const {
        destination = 'Kyoto, Japan',
        origin_city = 'New York, USA (JFK)',
        duration = 3,
        currency = 'USD',
        travelers = 'Couple',
        budget = 'Comfort / Standard',
        pace = 'Relaxed (Senior & Family Friendly)',
        interests = 'Historic Temples, Scenic Gardens, Traditional Tea Ceremony, Local Markets',
        constraints = 'Minimal stairs, vegetarian-friendly food options, relaxed transit',
      } = req.body;

      const prompt = `Generate a complete, globally accessible, and practical travel itinerary with the following user parameters:
- Destination: ${destination}
- Origin Departure City (for Flight route analysis): ${origin_city}
- Duration: ${duration} days
- Currency to use for all costs: ${currency}
- Travelers: ${travelers}
- Budget Tier: ${budget}
- Pace: ${pace}
- Interests: ${interests || 'Heritage sights, authentic cuisine, scenic views, local markets'}
- Constraints / Accessibility: ${constraints || 'None specified'}

Important Output Instructions:
1. Always calculate all costs, daily budgets, hotel rates, and meal prices in the requested currency: ${currency}.
2. For senior & family comfort: Ensure generous time buffers, relaxed walking paces, and neighborhood clustering.
3. Provide 6-8 diverse hotel recommendations (Luxury & 5-Star, Boutique & Heritage, Comfort & Mid-Range, Budget & Hostels, Resort/Villa) with realistic prices in ${currency} per night and coordinates ({ lat, lng }).
4. Provide 6-8 diverse restaurant recommendations (Iconic Local Cuisine, Fine Dining, Casual Breakfast/Cafes, Pure Veg/Vegan, Famous Street Food) with must-try dishes, veg-friendliness, and cost for two in ${currency}.
5. Provide 6-8 essential local dialect / survival phrases with English meaning, local script, and easy phonetic pronunciation.
6. Provide 4-5 fascinating researched fun facts and trivia about the destination.
7. Provide flight analysis including destination major airport codes, transfer tips, and estimated travel times from major international hubs.
8. Include realistic latitude and longitude coordinates ({ lat, lng }) for the destination center, each activity, hotel, and restaurant.
9. Return strictly valid JSON adhering to the response schema.`;

      const ai = getGeminiClient();
      const responseText = await generateContentWithRetryAndFallback(
        ai,
        {
          contents: prompt,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: 'application/json',
            responseSchema: ITINERARY_RESPONSE_SCHEMA,
            temperature: 0.7,
          },
        },
        ['gemini-3.7-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite']
      );

      const parsedData = JSON.parse(responseText);
      res.json({ success: true, data: parsedData });
    } catch (error: any) {
      console.error('Error generating itinerary:', error);
      const formattedMessage = formatErrorMessage(error);
      res.status(500).json({
        success: false,
        error: formattedMessage,
      });
    }
  });

  // POST /api/swap-activity
  app.post('/api/swap-activity', async (req, res) => {
    try {
      const {
        destination,
        dayNumber,
        geographicalFocus,
        currentActivity,
        userPreference,
        currency = 'USD',
      } = req.body;

      const prompt = `Provide a single alternative travel activity replacement for the following slot:
- Destination: ${destination}
- Day Number: ${dayNumber}
- Geographic Zone: ${geographicalFocus}
- Current Activity Being Replaced: ${currentActivity.activity_name} (${currentActivity.time_slot})
- User Preference / Vibe: ${userPreference || 'A relaxing, accessible alternative nearby'}
- Currency: ${currency}

Return a replacement activity that:
1. Stays within or very close to ${geographicalFocus} to avoid travel disruptions.
2. Fits the ${currentActivity.time_slot} time slot with duration in hours.
3. Provides costs in ${currency} (e.g. "Free", "Budget (under $10)", "Moderate ($10 - $35)", "Premium ($35+)").
4. Includes an insightful, practical insider tip.
5. Includes approximate coordinates ({ lat, lng }).`;

      const ai = getGeminiClient();
      const responseText = await generateContentWithRetryAndFallback(
        ai,
        {
          contents: prompt,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                time_slot: { type: Type.STRING },
                activity_name: { type: Type.STRING },
                estimated_duration_hours: { type: Type.NUMBER },
                description: { type: Type.STRING },
                cost_tier: { type: Type.STRING },
                insider_tip: { type: Type.STRING },
                coordinates: {
                  type: Type.OBJECT,
                  properties: {
                    lat: { type: Type.NUMBER },
                    lng: { type: Type.NUMBER },
                  },
                },
              },
              required: [
                'time_slot',
                'activity_name',
                'estimated_duration_hours',
                'description',
                'cost_tier',
                'insider_tip',
              ],
            },
          },
        },
        ['gemini-3.7-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite']
      );

      const parsedData = JSON.parse(responseText);
      res.json({ success: true, activity: parsedData });
    } catch (error: any) {
      console.error('Error swapping activity:', error);
      const formattedMessage = formatErrorMessage(error);
      res.status(500).json({
        success: false,
        error: formattedMessage,
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Smart Travel Planner Server running on http://localhost:${PORT}`);
  });
}

startServer();
