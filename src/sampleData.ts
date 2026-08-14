import { ItineraryPlanResponse, PlannerInputs } from './types';

export const SAMPLE_PRESETS: {
  label: string;
  description: string;
  badge: string;
  inputs: PlannerInputs;
  data: ItineraryPlanResponse;
}[] = [
  {
    label: 'Kyoto Zen Gardens & Artisan Trails',
    description: '4-day serene stroll through ancient bamboo groves, vermilion torii shrines, artisan tea houses, and traditional Kyoto cuisine.',
    badge: 'Worldwide Favorite',
    inputs: {
      destination: 'Kyoto, Japan',
      origin_city: 'New York (JFK), USA',
      duration: 4,
      currency: 'USD',
      travelers: 'Couple / Family',
      budget: 'Comfort / Standard ($160/day)',
      pace: 'Balanced (Relaxed Walking)',
      interests: 'Historic Temples, Bamboo Forests, Tea Ceremony, Local Markets, Zen Gardens',
      constraints: 'Senior-friendly, vegetarian-friendly lunch options, minimal steep climbing'
    },
    data: {
      trip_summary: {
        destination: "Kyoto, Japan",
        total_days: 4,
        theme_vibe: "Timeless Zen, Shaded Bamboo Glades & Artisan Gastronomy",
        budget_strategy: "Prioritized historic temple admissions, comfortable regional rail, and curated multi-course dinner allocations.",
        destination_coords: { lat: 35.0116, lng: 135.7681 },
        country: "Japan"
      },
      estimated_costs: {
        currency: "USD",
        currency_symbol: "$",
        activities_per_day: 35,
        food_per_day: 65,
        hidden_fees_notes: "Kyoto municipal accommodation tax (approx $2–$4 per night paid at check-in) and coin lockers at major transit hubs."
      },
      itinerary: [
        {
          day_number: 1,
          day_theme: "Sacred Torii Gates & Historic Gion Lantern Alleys",
          geographical_focus: "Southern Higashiyama & Fushimi",
          schedule: [
            {
              time_slot: "Morning",
              activity_name: "Fushimi Inari-Taisha Torii Path",
              estimated_duration_hours: 2.5,
              description: "Hike beneath thousands of vermilion torii gates winding through Mount Inari. Arrive before 8:00 AM for peaceful shaded photography.",
              cost_tier: "Free",
              insider_tip: "Turn back at the scenic Yotsutsuji intersection for sweeping Kyoto valley views without doing the full strenuous mountain loop.",
              coordinates: { lat: 34.9671, lng: 135.7727 }
            },
            {
              time_slot: "Afternoon",
              activity_name: "Kiyomizu-dera & Sannenzaka Stone Streets",
              estimated_duration_hours: 3.0,
              description: "Explore the iconic wooden temple deck built without nails over maple trees, then wander preserved stone merchant streets.",
              cost_tier: "$ (Under $10)",
              insider_tip: "Sample fresh cinnamon yatsuhashi sweets offered by traditional confectioners along Ninenzaka.",
              coordinates: { lat: 34.9949, lng: 135.7850 }
            },
            {
              time_slot: "Evening",
              activity_name: "Gion Shirakawa Lantern Walk & Obanzai Dinner",
              estimated_duration_hours: 2.5,
              description: "Stroll willow-lined canals in the historic geiko quarter before settling into a warm Obanzai restaurant for seasonal small dishes.",
              cost_tier: "$$ ($25 - $45)",
              insider_tip: "Reserve a counter seat along Pontocho Alley to watch master chefs prepare seasonal dashi-simmered vegetables.",
              coordinates: { lat: 35.0037, lng: 135.7758 }
            }
          ]
        },
        {
          day_number: 2,
          day_theme: "Arashiyama Bamboo Forest & Sagano River Heritage",
          geographical_focus: "Western Kyoto (Arashiyama)",
          schedule: [
            {
              time_slot: "Morning",
              activity_name: "Tenryu-ji Zen Garden & Bamboo Grove",
              estimated_duration_hours: 2.5,
              description: "Walk the 14th-century pond garden reflecting Arashiyama mountains, followed by the tranquil shaded bamboo pathways.",
              cost_tier: "$ (Under $10)",
              insider_tip: "Exit the bamboo forest towards Okochi Sanso Villa to escape midday crowds and enjoy included green tea and sweet cake.",
              coordinates: { lat: 35.0158, lng: 135.6775 }
            },
            {
              time_slot: "Afternoon",
              activity_name: "Togetsukyo Bridge & River Boat Stroll",
              estimated_duration_hours: 2.0,
              description: "Admire the historic wooden bridge spanning Oi River with options for a relaxing 30-minute flat punt boat ride.",
              cost_tier: "$ (Under $10)",
              insider_tip: "Plenty of level benches along the riverbank for a scenic, restful afternoon break.",
              coordinates: { lat: 35.0129, lng: 135.6777 }
            },
            {
              time_slot: "Evening",
              activity_name: "Yudofu Silken Hotpot Tofu Dining",
              estimated_duration_hours: 2.0,
              description: "Savor centuries-old Buddhist Shojin Ryori silken tofu served in hot savory kelp dashi broth with sesame dipping sauces.",
              cost_tier: "$$ ($25 - $40)",
              insider_tip: "A gentle, comforting, and 100% vegetarian-friendly meal ideal for relaxed digestion.",
              coordinates: { lat: 35.0163, lng: 135.6738 }
            }
          ]
        },
        {
          day_number: 3,
          day_theme: "Golden Pavilion & Nishiki Market Safari",
          geographical_focus: "Northern Kyoto & Downtown Karasuma",
          schedule: [
            {
              time_slot: "Morning",
              activity_name: "Kinkaku-ji (Golden Pavilion) & Ryoan-ji",
              estimated_duration_hours: 2.5,
              description: "Marvel at the top two floors covered in pure gold leaf shimmering over Mirror Pond, then meditate beside 15 zen stones at Ryoan-ji.",
              cost_tier: "$ (Under $10)",
              insider_tip: "Arrive right at 9:00 AM opening for calm reflection photos before group buses arrive.",
              coordinates: { lat: 35.0394, lng: 135.7292 }
            },
            {
              time_slot: "Afternoon",
              activity_name: "Nishiki Market Covered Street Food Walk",
              estimated_duration_hours: 2.5,
              description: "Traverse Kyoto's 400-year-old covered food arcade sampling fresh dashi tamagoyaki, matcha ice cream, roasted chestnuts, and soy donuts.",
              cost_tier: "$$ ($15 - $25)",
              insider_tip: "The market is fully covered and weather-proof. Eat at the designated benches near each shop.",
              coordinates: { lat: 35.0050, lng: 135.7649 }
            },
            {
              time_slot: "Evening",
              activity_name: "Kamo Riverbank Sunset & Casual Dining",
              estimated_duration_hours: 2.0,
              description: "Join locals relaxing along the cool stone banks of the Kamo River, followed by handmade udon noodles in Gion.",
              cost_tier: "$ (Under $15)",
              insider_tip: "Flat walking paths along the river make for an easy, tranquil twilight stroll.",
              coordinates: { lat: 35.0039, lng: 135.7725 }
            }
          ]
        },
        {
          day_number: 4,
          day_theme: "Philosopher's Path & Authentic Matcha Tea Ceremony",
          geographical_focus: "Northern Higashiyama",
          schedule: [
            {
              time_slot: "Morning",
              activity_name: "Ginkaku-ji (Silver Pavilion) & Canal Path",
              estimated_duration_hours: 2.5,
              description: "Stroll the stone canal path lined with cherry trees and ancient moss gardens leading from Ginkaku-ji to Nanzen-ji.",
              cost_tier: "$ (Under $10)",
              insider_tip: "Stop at Honen-in along the path, a secluded moss-covered gate temple with zero entrance fee.",
              coordinates: { lat: 35.0272, lng: 135.7982 }
            },
            {
              time_slot: "Afternoon",
              activity_name: "Mindful Chanoyu Tea Ceremony Experience",
              estimated_duration_hours: 2.0,
              description: "Participate in a seated traditional tea ceremony guided by a licensed master, learning the art of whisking Uji ceremonial matcha.",
              cost_tier: "$$ ($25 - $35)",
              insider_tip: "Chairs or low benches are provided so you do not need to sit flat on the floor.",
              coordinates: { lat: 35.0116, lng: 135.7820 }
            },
            {
              time_slot: "Evening",
              activity_name: "Farewell Kyoto Kaiseki Dinner",
              estimated_duration_hours: 2.5,
              description: "Conclude your journey with an exquisite multi-course Kaiseki dinner celebrating seasonal Kyoto heirloom vegetables and delicate dishes.",
              cost_tier: "$$$ ($60+)",
              insider_tip: "Request English printed menu scrolls from your host explaining each artistic course.",
              coordinates: { lat: 35.0080, lng: 135.7710 }
            }
          ]
        }
      ],
      local_logistics_guide: {
        best_transit_method: "Combine Kyoto City Subway and express bus routes using a reloadable IC contactless card (ICOCA or digital Suica on smartphone). Taxis are clean, reliable, and automatic door-equipped.",
        cultural_etiquette_alerts: [
          "Tipping is NOT customary anywhere in Japan and can cause polite embarrassment.",
          "Keep mobile phones on silent mode in trains, buses, and sacred temple grounds.",
          "Wear easy-to-slip-on walking shoes as temples require shoe removal before stepping onto tatami mats."
        ],
        packing_essentials: [
          "Comfortable slip-on walking shoes and clean socks",
          "Small coin purse for exact cash at temple ticket kiosks",
          "Lightweight compact umbrella for sunny days or sudden rain showers"
        ],
        senior_and_accessibility_notes: "Kyoto Subway stations and major temples (Kiyomizu-dera, Kinkaku-ji) offer wheelchair ramps, elevators, and wide flat viewing platforms."
      },
      hotel_recommendations: [
        {
          name: "Hotel The Celestine Kyoto Gion",
          category: "Boutique & Heritage",
          neighborhood: "Higashiyama / Gion",
          approx_price_per_night: 195,
          best_for: "Couples & Seniors (quiet historic street, soothing Japanese public bath, excellent elevator access)",
          key_highlights: [
            "Steps from Yasaka Shrine and Gion lantern alleys",
            "Tranquil basement Onsen-style mineral bath",
            "Exceptional buffet breakfast featuring authentic Obanzai dishes"
          ],
          coordinates: { lat: 34.9986, lng: 135.7745 }
        },
        {
          name: "The Thousand Kyoto",
          category: "Luxury & 5-Star",
          neighborhood: "Kyoto Station Downtown",
          approx_price_per_night: 310,
          best_for: "Multi-Generation Families & High Comfort",
          key_highlights: [
            "Located 2 minutes flat walk from Kyoto Shinkansen Bullet Train station",
            "Zen minimalist architecture with lush indoor greenery",
            "Full accessibility with spacious elevators and English-speaking concierge"
          ],
          coordinates: { lat: 34.9858, lng: 135.7602 }
        },
        {
          name: "Piece Hostel Sanjo / Private Rooms",
          category: "Budget & Hostels",
          neighborhood: "Sanjo / Downtown Karasuma",
          approx_price_per_night: 75,
          best_for: "Budget Travelers & Solo Explorers",
          key_highlights: [
            "Immaculate private en-suite hotel rooms at great value",
            "Complimentary morning breakfast buffet",
            "Central location near Nishiki Market and subway stations"
          ],
          coordinates: { lat: 35.0089, lng: 135.7645 }
        },
        {
          name: "Suiran, a Luxury Collection Hotel",
          category: "Resort & Villa",
          neighborhood: "Arashiyama Riverside",
          approx_price_per_night: 580,
          best_for: "Luxury Romantic Escapes",
          key_highlights: [
            "Situated along tranquil Katsura River overlooking Arashiyama hills",
            "Private open-air onsen hot spring baths in rooms",
            "Complimentary afternoon champagne service in a century-old riverside cafe"
          ],
          coordinates: { lat: 35.0142, lng: 135.6731 }
        },
        {
          name: "Cross Hotel Kyoto",
          category: "Comfort & Mid-Range",
          neighborhood: "Kawaramachi Sanjo",
          approx_price_per_night: 140,
          best_for: "Families & Walkability",
          key_highlights: [
            "Modern spacious rooms with separated toilet and rain shower",
            "Surrounded by cafes, shopping arcades, and subway exits",
            "Friendly English-speaking staff and complimentary lobby refreshments"
          ],
          coordinates: { lat: 35.0081, lng: 135.7699 }
        },
        {
          name: "Gion Hatanaka Ryokan",
          category: "Boutique & Heritage",
          neighborhood: "Gion Historic Quarter",
          approx_price_per_night: 420,
          best_for: "Authentic Cultural Ryokan Experience",
          key_highlights: [
            "Traditional tatami living with comfortable futon bedding or low beds",
            "Exquisite in-room multi-course Kaiseki dinner",
            "Walking distance to Maruyama Park cherry blossoms"
          ],
          coordinates: { lat: 35.0031, lng: 135.7801 }
        }
      ],
      restaurant_recommendations: [
        {
          name: "Tousuiro Gion (Tofu Kaiseki)",
          cuisine_type: "Kyoto Tofu Speciality & Kaiseki",
          neighborhood: "Gion, Kyoto",
          must_try_dish: "Oboro Tofu Hotpot & Tofu Dengaku with Sweet Miso",
          veg_friendliness: "Excellent Veg & Vegan Options",
          approx_cost_for_two: 75,
          senior_and_family_tips: "Charming traditional wooden machiya townhouse with comfortable sunken kotatsu or table seating.",
          category_tag: "Local Specialty",
          coordinates: { lat: 35.0028, lng: 135.7762 }
        },
        {
          name: "Chao Chao Gyoza",
          cuisine_type: "Casual Dumplings & Japanese Comfort Food",
          neighborhood: "Shijo Kawaramachi",
          must_try_dish: "Crispy Winged Pork / Veggie Gyoza with Sesame Dipping Sauce",
          veg_friendliness: "Good Options",
          approx_cost_for_two: 22,
          senior_and_family_tips: "Vibrant and fun casual spot. Fast service with bilingual picture menus.",
          category_tag: "Casual Cafe",
          coordinates: { lat: 35.0045, lng: 135.7712 }
        },
        {
          name: "Shigetsu (Inside Tenryu-ji Temple)",
          cuisine_type: "Shojin Ryori (Buddhist Vegetarian Cuisine)",
          neighborhood: "Arashiyama",
          must_try_dish: "Multi-dish seasonal Shojin Ryori Tray served in red lacquer bowls",
          veg_friendliness: "Pure Vegetarian",
          approx_cost_for_two: 55,
          senior_and_family_tips: "Dine while gazing out at world-famous Tenryu-ji gardens. Advance booking recommended.",
          category_tag: "Local Specialty",
          coordinates: { lat: 35.0159, lng: 135.6779 }
        },
        {
          name: "Honke Owariya",
          cuisine_type: "Traditional Soba Noodles (Operating since 1465)",
          neighborhood: "Nakagyo Ward (near Imperial Palace)",
          must_try_dish: "Hourai Soba (5-tier soba with 8 condiments) & Warm Shiitake Soba",
          veg_friendliness: "Excellent Veg & Vegan Options",
          approx_cost_for_two: 32,
          senior_and_family_tips: "Japan's oldest continuous soba shop, formerly confectioner to the Imperial family.",
          category_tag: "Local Specialty",
          coordinates: { lat: 35.0125, lng: 135.7597 }
        },
        {
          name: "Nishiki Warai",
          cuisine_type: "Kyoto-style Okonomiyaki & Yakisoba",
          neighborhood: "Nishiki Market Arcade",
          must_try_dish: "Waraiyaki (Fluffy cabbage pancake with cheese and scallions)",
          veg_friendliness: "Good Options",
          approx_cost_for_two: 28,
          senior_and_family_tips: "Teppanyaki griddles built into tables keep food piping hot. Easy seating for families.",
          category_tag: "Street Food Gem",
          coordinates: { lat: 35.0051, lng: 135.7652 }
        },
        {
          name: "Tsujiri Tea House Gion",
          cuisine_type: "Uji Matcha Confectionery & Parfaits",
          neighborhood: "Gion Main Street",
          must_try_dish: "Tsujiri Tokusen Matcha Parfait with Mochi & Chestnut",
          veg_friendliness: "Pure Vegetarian",
          approx_cost_for_two: 18,
          senior_and_family_tips: "Multi-story tea salon with elevator. Perfect afternoon dessert respite.",
          category_tag: "Sweet & Bakery",
          coordinates: { lat: 35.0036, lng: 135.7749 }
        }
      ],
      local_phrases: [
        {
          category: "Greetings & Courtesy",
          english_phrase: "Hello / Good afternoon",
          local_script: "こんにちは",
          phonetic_pronunciation: "Konnichiwa",
          usage_tip: "Universal daytime greeting across shops, temples, and stations."
        },
        {
          category: "Greetings & Courtesy",
          english_phrase: "Thank you very much",
          local_script: "ありがとうございます",
          phonetic_pronunciation: "Arigatou gozaimasu",
          usage_tip: "Polite gratitude phrase accompanied by a gentle head bow."
        },
        {
          category: "Food & Drinking Water",
          english_phrase: "Water please",
          local_script: "お水をお願いします",
          phonetic_pronunciation: "O-mizu o onegaishimasu",
          usage_tip: "Standard phrase to ask for complimentary drinking water at cafes."
        },
        {
          category: "Food & Drinking Water",
          english_phrase: "Is this vegetarian / without meat?",
          local_script: "これはベジタリアン用ですか？",
          phonetic_pronunciation: "Kore wa bejitarian-yoo desu ka?",
          usage_tip: "Essential for plant-based travelers checking menu items."
        },
        {
          category: "Directions & Transport",
          english_phrase: "Where is the station / restroom?",
          local_script: "駅 / トイレはどこですか？",
          phonetic_pronunciation: "Eki / Toire wa doko desu ka?",
          usage_tip: "Extremely useful when navigating busy transit stations or temple grounds."
        },
        {
          category: "Shopping & Help",
          english_phrase: "How much is this?",
          local_script: "いくらですか？",
          phonetic_pronunciation: "Ikura desu ka?",
          usage_tip: "Point at an item in a market stall and ask this simple phrase."
        }
      ],
      fun_facts: [
        {
          title: "Over 2,000 Temples and Shrines",
          fact: "Kyoto was Japan's imperial capital for over 1,000 years (794 to 1868) and is home to more than 1,600 Buddhist temples and 400 Shinto shrines.",
          tag: "History"
        },
        {
          title: "Saved from WWII Destruction",
          fact: "Kyoto was removed from the target list in 1945 by the US Secretary of War because he had honeymooned there and appreciated its immense cultural treasures.",
          tag: "Heritage"
        },
        {
          title: "The Singing Floors of Nijo Castle",
          fact: "Nijo Castle's 'Nightingale floors' (Uguisubari) were intentionally engineered with iron clamps underneath the planks that chirp like birds when walked on, alerting guards to any creeping assassins!",
          tag: "Ingenious Design"
        },
        {
          title: "Birthplace of Geiko & Matcha Culture",
          fact: "Uji, located just 20 minutes south of Kyoto, produces Japan's finest ceremonial green tea matcha, cultivated by monks since the 12th century.",
          tag: "Culinary"
        }
      ],
      flight_analysis: {
        destination_airports: [
          {
            code: "KIX",
            name: "Kansai International Airport",
            city: "Osaka / Kyoto",
            distance_from_center_km: 78
          },
          {
            code: "ITM",
            name: "Osaka Itami Airport (Domestic)",
            city: "Osaka",
            distance_from_center_km: 40
          },
          {
            code: "HND",
            name: "Tokyo Haneda Airport (Connect via Shinkansen)",
            city: "Tokyo",
            distance_from_center_km: 450
          }
        ],
        popular_routes: [
          {
            origin_city: "New York (JFK/EWR)",
            origin_code: "NYC",
            avg_duration_hours: "14h 30m (Direct to Tokyo) / 17h (1-stop to KIX)",
            typical_airlines: ["ANA", "Japan Airlines", "United", "Singapore Airlines"],
            is_direct_available: false,
            est_economy_fare: "$950 - $1,400",
            est_business_fare: "$3,800 - $5,500"
          },
          {
            origin_city: "London (LHR)",
            origin_code: "LON",
            avg_duration_hours: "14h 50m (Direct to Tokyo) / 16h (1-stop to KIX)",
            typical_airlines: ["British Airways", "ANA", "Emirates", "Qatar Airways"],
            is_direct_available: false,
            est_economy_fare: "£650 - £980",
            est_business_fare: "£2,900 - £4,200"
          },
          {
            origin_city: "New Delhi (DEL)",
            origin_code: "DEL",
            avg_duration_hours: "8h 15m (Direct to Tokyo) / 10h 30m (to KIX)",
            typical_airlines: ["Air India", "ANA", "Singapore Airlines", "Thai Airways"],
            is_direct_available: true,
            est_economy_fare: "₹48,000 - ₹72,000",
            est_business_fare: "₹1,45,000 - ₹2,20,000"
          }
        ],
        airport_transfer_guide: "From Kansai International Airport (KIX), take the direct JR Haruka Limited Express train directly to Kyoto Station in just 75 minutes. Reserved seating and luggage racks are included.",
        booking_lead_time_tips: "Book international flights 3–5 months in advance, especially during the spring cherry blossom season (late March to mid-April) and autumn foliage (November).",
        visa_and_transit_notes: "Citizens of over 68 countries (including USA, UK, EU, Australia, Canada, Singapore) enjoy visa-free entry for up to 90 days. Register on the official 'Visit Japan Web' portal before departure for rapid immigration clearance."
      }
    }
  },
  {
    label: 'Jaipur Royal Rajputana Heritage',
    description: '3-day comfortable exploration of majestic forts, royal havelis, artisan bazaars, and authentic Rajasthani thali.',
    badge: 'Senior & Family Friendly',
    inputs: {
      destination: 'Jaipur, Rajasthan, India',
      origin_city: 'New Delhi (DEL), India',
      duration: 3,
      currency: 'INR',
      travelers: 'Family with Senior Citizens',
      budget: 'Comfort (₹6,000/day)',
      pace: 'Relaxed (Senior & Family Friendly)',
      interests: 'Historic Forts, Palaces, Traditional Food, Handicrafts, Folk Music',
      constraints: 'Minimal stairs, wheelchair/battery car preference, pure vegetarian food options'
    },
    data: {
      trip_summary: {
        destination: "Jaipur, Rajasthan, India",
        total_days: 3,
        theme_vibe: "Royal Rajputana Grandeur, Golden Hour Forts & Marwari Hospitality",
        budget_strategy: "Composite monument pass, pre-arranged AC cab with comfortable pacing, and heritage dining allocations.",
        destination_coords: { lat: 26.9124, lng: 75.7873 },
        country: "India"
      },
      estimated_costs: {
        currency: "INR",
        currency_symbol: "₹",
        activities_per_day: 850,
        food_per_day: 1800,
        hidden_fees_notes: "Battery car transfers at Amer Fort (₹50-100), camera tickets (₹50-200), and guide audio headsets."
      },
      itinerary: [
        {
          day_number: 1,
          day_theme: "The Pink City Heart: City Palace, Jantar Mantar & Hawa Mahal",
          geographical_focus: "Old Walled City (Pink City)",
          schedule: [
            {
              time_slot: "Morning",
              activity_name: "City Palace Royal Courtyards & Museum",
              estimated_duration_hours: 2.5,
              description: "Explore the ornate Peacock Gate of Pritam Niwas Chowk, Chandra Mahal galleries, and royal costume textiles. Wheelchair and battery vehicle access is available on site.",
              cost_tier: "₹₹ (₹700)",
              insider_tip: "Arrive at 9:30 AM before tour coaches. Golf carts are readily available near the ticket counter for senior family members.",
              coordinates: { lat: 26.9258, lng: 75.8237 }
            },
            {
              time_slot: "Afternoon",
              activity_name: "Jantar Mantar UNESCO Astronomical Observatory",
              estimated_duration_hours: 1.5,
              description: "Walk between nineteen giant stone astronomical instruments including the world's largest stone sundial. Flat paved pathways throughout make walking very easy.",
              cost_tier: "₹ (₹200)",
              insider_tip: "Hire an official government-licensed guide at the gate (₹400) for a 45-minute engaging walkthrough.",
              coordinates: { lat: 26.9248, lng: 75.8246 }
            },
            {
              time_slot: "Evening",
              activity_name: "Hawa Mahal Facade View & Johari Bazaar Stroll",
              estimated_duration_hours: 2.0,
              description: "Admire the 953 honeycomb sandstone windows from the scenic rooftop cafes opposite, followed by a gentle stroll through Johari Bazaar for blue pottery and lac bangles.",
              cost_tier: "Free",
              insider_tip: "The Wind View Cafe directly across the street offers comfortable seated terrace views with fresh tea and lassi.",
              coordinates: { lat: 26.9239, lng: 75.8267 }
            }
          ]
        },
        {
          day_number: 2,
          day_theme: "Amer Fort Grandeur & Royal Lake Palace",
          geographical_focus: "Amer & Jal Mahal Foothills",
          schedule: [
            {
              time_slot: "Morning",
              activity_name: "Amer Fort & Sheesh Mahal (Mirror Palace)",
              estimated_duration_hours: 3.0,
              description: "Ascend to the hilltop citadel via AC Jeep to admire the dazzling Sheesh Mahal mirror mosaics, Diwan-e-Aam, and Mughal garden courtyards.",
              cost_tier: "₹₹ (₹500)",
              insider_tip: "Take the rear road via official 4x4 Jeep service to reach the main Suraj Pol gate without climbing the steep front ramp.",
              coordinates: { lat: 26.9855, lng: 75.8513 }
            },
            {
              time_slot: "Afternoon",
              activity_name: "Anokhi Museum of Hand Printing",
              estimated_duration_hours: 1.5,
              description: "A peaceful restored haveli museum showcasing ancient Rajasthani wooden block-printing techniques with live artisan demonstrations.",
              cost_tier: "₹ (₹150)",
              insider_tip: "Enjoy the calm shady courtyard cafe for cold lemonade and artisan textile souvenirs.",
              coordinates: { lat: 26.9892, lng: 75.8530 }
            },
            {
              time_slot: "Evening",
              activity_name: "Jal Mahal Promenade & Traditional Rajasthani Thali",
              estimated_duration_hours: 2.5,
              description: "View the illuminated Water Palace floating in Man Sagar Lake at twilight, followed by an elaborate multi-course Dal Baati Churma feast at a heritage restaurant.",
              cost_tier: "₹₹ (₹800)",
              insider_tip: "The lakeside walkway has comfortable stone benches for seniors to rest while watching migratory birds and sunset.",
              coordinates: { lat: 26.9534, lng: 75.8462 }
            }
          ]
        },
        {
          day_number: 3,
          day_theme: "Albert Hall Museum, Serene Gardens & Folk Evening",
          geographical_focus: "Ram Niwas Bagh & Tonk Road",
          schedule: [
            {
              time_slot: "Morning",
              activity_name: "Albert Hall Museum (Central Museum)",
              estimated_duration_hours: 2.0,
              description: "Indo-Saracenic museum housing miniature paintings, antique weaponry, Persian carpets, and an Egyptian mummy in cool, shaded galleries with elevator access.",
              cost_tier: "₹ (₹300)",
              insider_tip: "The museum has wheelchair ramps and elevators. The pigeons outside the courtyard offer great photography.",
              coordinates: { lat: 26.9116, lng: 75.8195 }
            },
            {
              time_slot: "Afternoon",
              activity_name: "Birla Mandir & Relaxed High Tea",
              estimated_duration_hours: 1.5,
              description: "Admire the pure white marble temple dedicated to Lord Vishnu and Goddess Lakshmi nestled against Moti Dungri hill.",
              cost_tier: "Free",
              insider_tip: "Visit between 3:30 PM and 4:30 PM for peaceful prayer atmosphere and cool marble corridors.",
              coordinates: { lat: 26.8924, lng: 75.8156 }
            },
            {
              time_slot: "Evening",
              activity_name: "Chokhi Dhani Ethnic Cultural Village",
              estimated_duration_hours: 3.5,
              description: "An authentic Rajasthani village fair with Kalbelia folk dancers, puppet shows, camel rides, and a traditional royal dining experience.",
              cost_tier: "₹₹₹ (₹1,200)",
              insider_tip: "Choose the 'Royal Rajasthani Dining Hall' with comfortable table-and-chair seating for elderly family members.",
              coordinates: { lat: 26.7699, lng: 75.8267 }
            }
          ]
        }
      ],
      local_logistics_guide: {
        best_transit_method: "Pre-book a private air-conditioned cab for the entire day (₹2,000–₹2,800/day for 8 hours) with an experienced local driver.",
        cultural_etiquette_alerts: [
          "Remove footwear before entering temples and palace sanctums (carry clean socks for warm marble floors).",
          "Dress respectfully covering shoulders and knees when visiting religious shrines.",
          "Polite bargaining (20–30%) is normal in street bazaars, but prices in government emporiums (Rajasthali) are fixed.",
          "Always carry bottled or purified mineral water during outdoor sightseeing."
        ],
        packing_essentials: [
          "Comfortable slip-on walking shoes and cotton socks",
          "Cotton sun-hat, UV sunglasses, and natural sunscreen",
          "Light shawl or stole for air-conditioned museums and evening breezes",
          "Essential personal medications and oral rehydration salts"
        ],
        senior_and_accessibility_notes: "Jaipur's top monuments (City Palace, Amer Fort rear gate, Albert Hall) offer battery cars, ramps, and wheelchair services upon request."
      },
      hotel_recommendations: [
        {
          name: "Shahpura House & Haveli",
          category: "Boutique & Heritage",
          neighborhood: "Bani Park, Jaipur",
          approx_price_per_night: 5800,
          best_for: "Families & Seniors (quiet neighborhood, elevator, serene pool & royal courtyard dining)",
          key_highlights: [
            "Restored royal heritage architecture with elevator to all floors",
            "Pure vegetarian friendly multi-cuisine kitchen",
            "Evening live folk sitar performances in the courtyard"
          ],
          coordinates: { lat: 26.9298, lng: 75.7925 }
        },
        {
          name: "ITC Rajputana, Luxury Collection",
          category: "Luxury & 5-Star",
          neighborhood: "Gopalbari, Jaipur",
          approx_price_per_night: 14500,
          best_for: "Luxury Seekers & Multi-Generation Families",
          key_highlights: [
            "Grand red-brick palatial design with tranquil water gardens",
            "Signature Peshawri & Jal Mahal fine dining restaurants",
            "Full wheelchair accessibility, 24-hour doctor on call, and luxury spa"
          ],
          coordinates: { lat: 26.9189, lng: 75.7915 }
        },
        {
          name: "Umaid Bhawan Heritage House Hotel",
          category: "Comfort & Mid-Range",
          neighborhood: "Bani Park, Jaipur",
          approx_price_per_night: 3500,
          best_for: "Budget Travelers & Couples",
          key_highlights: [
            "Carved balconies and colorful Rajput fresco rooms",
            "Rooftop restaurant with panoramic city views",
            "Warm family hospitality with prompt travel desk"
          ],
          coordinates: { lat: 26.9275, lng: 75.7942 }
        },
        {
          name: "Rambagh Palace (Taj Hotels)",
          category: "Luxury & 5-Star",
          neighborhood: "Bhawani Singh Road",
          approx_price_per_night: 42000,
          best_for: "The Ultimate Royal Luxury Experience",
          key_highlights: [
            "Former residence of the Maharaja of Jaipur with 47 acres of manicured gardens",
            "Peacocks roaming the grounds, vintage car transfers, and royal butlers",
            "World-renowned Suvarna Mahal dining hall with gold-leaf tableware"
          ],
          coordinates: { lat: 26.8979, lng: 75.8089 }
        },
        {
          name: "Alsisar Haveli",
          category: "Boutique & Heritage",
          neighborhood: "Sansar Chandra Road",
          approx_price_per_night: 6800,
          best_for: "Heritage Lovers & Photographers",
          key_highlights: [
            "Traditional Rajput architecture with antique furnishings",
            "Secluded courtyard swimming pool surrounded by fragrant frangipani",
            "Walking distance to the Pink City walled gates"
          ],
          coordinates: { lat: 26.9242, lng: 75.8012 }
        },
        {
          name: "Moustache Jaipur / Zostel Jaipur",
          category: "Budget & Hostels",
          neighborhood: "MI Road / Subhash Nagar",
          approx_price_per_night: 1800,
          best_for: "Backpackers & Solo Travelers",
          key_highlights: [
            "Lively rooftop lounge, common work spaces, and clean private en-suite rooms",
            "Daily organized walking and food tours",
            "Close to Jaipur Central Railway Station"
          ],
          coordinates: { lat: 26.9215, lng: 75.7981 }
        }
      ],
      restaurant_recommendations: [
        {
          name: "LMB (Laxmi Misthan Bhandar)",
          cuisine_type: "Traditional Rajasthani & Sweets",
          neighborhood: "Johari Bazaar, Pink City",
          must_try_dish: "Royal Rajasthani Thali (Dal Baati Churma, Ker Sangri, Gatte ki Sabzi) & Ghewar",
          veg_friendliness: "Pure Vegetarian",
          approx_cost_for_two: 1200,
          senior_and_family_tips: "Fully air-conditioned dining room with comfortable banquet chairs. Iconic pure-veg legacy established in 1727.",
          category_tag: "Local Specialty",
          coordinates: { lat: 26.9221, lng: 75.8261 }
        },
        {
          name: "Tapri Central",
          cuisine_type: "Modern Chai Cafe & Indian Snacks",
          neighborhood: "C-Scheme, Jaipur",
          must_try_dish: "Kulhad Masala Chai with Sauteed Mushroom Toast & Dal Pakwan",
          veg_friendliness: "Pure Vegetarian",
          approx_cost_for_two: 700,
          senior_and_family_tips: "Elevator access to rooftop overlooking Central Park. Relaxing ambience with plush seating.",
          category_tag: "Casual Cafe",
          coordinates: { lat: 26.9098, lng: 75.8082 }
        },
        {
          name: "Handi Restaurant",
          cuisine_type: "North Indian & Mughlai Specialties",
          neighborhood: "MI Road, Jaipur",
          must_try_dish: "Laal Maas (traditional smoked mutton) & Handi Meat with Garlic Naan",
          veg_friendliness: "Good Options",
          approx_cost_for_two: 1500,
          senior_and_family_tips: "Celebrated institution on MI Road. Easy street-level entrance with attentive table service.",
          category_tag: "Local Specialty",
          coordinates: { lat: 26.9182, lng: 75.8033 }
        },
        {
          name: "Rawat Misthan Bhandar",
          cuisine_type: "Iconic Kachoris & Sweets",
          neighborhood: "Station Road, Sindhi Camp",
          must_try_dish: "Crispy Pyaaz Kachori (Onion Kachori) & Mawa Kachori",
          veg_friendliness: "Pure Vegetarian",
          approx_cost_for_two: 350,
          senior_and_family_tips: "Jaipur's most famous breakfast and snack hub. Fresh hot batches fried every 10 minutes.",
          category_tag: "Street Food Gem",
          coordinates: { lat: 26.9234, lng: 75.7963 }
        },
        {
          name: "1135 AD (Inside Amer Fort)",
          cuisine_type: "Royal Fine Dining with Fort Views",
          neighborhood: "Amer Fort Citadel",
          must_try_dish: "Thal 1135 AD (Royal Platter) with Saffron Rice & Shahi Tukda",
          veg_friendliness: "Excellent Veg & Vegan Options",
          approx_cost_for_two: 4200,
          senior_and_family_tips: "Dine like Rajput royalty surrounded by silver doors and gold leaf walls inside Amer Fort.",
          category_tag: "Fine Dining",
          coordinates: { lat: 26.9858, lng: 75.8519 }
        },
        {
          name: "Gulab Ji Chai Wale",
          cuisine_type: "Street Chai & Bun Maska",
          neighborhood: "MI Road",
          must_try_dish: "Special Masala Kadak Chai with Maska Bun and Samosa",
          veg_friendliness: "Pure Vegetarian",
          approx_cost_for_two: 150,
          senior_and_family_tips: "Legendary morning tea stand active for over 70 years. Very popular local gathering spot.",
          category_tag: "Street Food Gem",
          coordinates: { lat: 26.9175, lng: 75.8055 }
        }
      ],
      local_phrases: [
        {
          category: "Greetings & Courtesy",
          english_phrase: "Hello / Greetings / Welcome",
          local_script: "नमस्ते / खम्मा घणी",
          phonetic_pronunciation: "Namaste / Khamma Ghani",
          usage_tip: "Universal polite greeting accompanied by folded hands. 'Khamma Ghani' is the beloved royal Rajasthani greeting."
        },
        {
          category: "Greetings & Courtesy",
          english_phrase: "Thank you very much",
          local_script: "बहुत बहुत धन्यवाद",
          phonetic_pronunciation: "Bahut bahut dhanyavaad",
          usage_tip: "Use with service staff, shopkeepers, and drivers."
        },
        {
          category: "Food & Drinking Water",
          english_phrase: "Please provide bottled drinking water",
          local_script: "कृपया बोतल वाला पीने का पानी दीजिए",
          phonetic_pronunciation: "Kripya botal wala peene ka paani dijiye",
          usage_tip: "Essential when ordering safe packaged mineral water at restaurants."
        },
        {
          category: "Food & Drinking Water",
          english_phrase: "Make it less spicy / no chili",
          local_script: "कम तीखा बनाइए / मिर्ची मत डालिए",
          phonetic_pronunciation: "Kam teekha banaiye / Mirchi mat daaliye",
          usage_tip: "Very helpful for travelers with mild spice tolerance or senior dietary requirements."
        },
        {
          category: "Directions & Transport",
          english_phrase: "How much to go to City Palace?",
          local_script: "सिटी पैलेस जाने का कितना होगा?",
          phonetic_pronunciation: "City Palace jaane ka kitna hoga?",
          usage_tip: "Ask auto-rickshaw or taxi drivers before boarding."
        },
        {
          category: "Shopping & Help",
          english_phrase: "What is the final price?",
          local_script: "सही दाम क्या है?",
          phonetic_pronunciation: "Sahi daam kya hai?",
          usage_tip: "Polite phrase used when shopping for handicrafts and textiles in Johari and Bapu Bazaars."
        }
      ],
      fun_facts: [
        {
          title: "Why is Jaipur Called the 'Pink City'?",
          fact: "In 1876, Maharaja Ram Singh painted the entire city terracotta pink—the color of hospitality—to welcome the Prince of Wales. A local law still mandates buildings in the walled city to maintain this hue!",
          tag: "History & Heritage"
        },
        {
          title: "World's Largest Stone Sundial",
          fact: "The Vrihat Samrat Yantra at Jantar Mantar stands 27 meters (88 feet) tall and can measure local solar time accurate to within 2 seconds.",
          tag: "Ancient Science"
        },
        {
          title: "The Floating Mystery of Jal Mahal",
          fact: "While Jal Mahal appears to be a one-story pavilion floating on water, it actually has four submerged lower floors constructed with special waterproof lime mortar that has survived over 250 years.",
          tag: "Architecture"
        },
        {
          title: "Wind Palace Designed for Royal Queens",
          fact: "Hawa Mahal's 953 screened jharokhas were engineered like an air-conditioner using the Venturi effect, allowing royal women to observe street festivals in complete privacy while enjoying breezy cool air.",
          tag: "Ingenious Design"
        }
      ],
      flight_analysis: {
        destination_airports: [
          {
            code: "JAI",
            name: "Jaipur International Airport",
            city: "Jaipur",
            distance_from_center_km: 12
          },
          {
            code: "DEL",
            name: "Indira Gandhi International Airport (Connect via 4-hour Vande Bharat Train or Express Highway)",
            city: "New Delhi",
            distance_from_center_km: 260
          }
        ],
        popular_routes: [
          {
            origin_city: "New Delhi (DEL)",
            origin_code: "DEL",
            avg_duration_hours: "55m (Flight) or 3h 40m (Vande Bharat Express Train)",
            typical_airlines: ["IndiGo", "Air India", "SpiceJet"],
            is_direct_available: true,
            est_economy_fare: "₹2,500 - ₹4,500",
            est_business_fare: "₹8,000 - ₹14,000"
          },
          {
            origin_city: "Mumbai (BOM)",
            origin_code: "BOM",
            avg_duration_hours: "1h 45m (Direct)",
            typical_airlines: ["IndiGo", "Air India"],
            is_direct_available: true,
            est_economy_fare: "₹4,200 - ₹7,800",
            est_business_fare: "₹16,000 - ₹25,000"
          },
          {
            origin_city: "Dubai (DXB)",
            origin_code: "DXB",
            avg_duration_hours: "3h 15m (Direct)",
            typical_airlines: ["Air India Express", "SpiceJet", "Flydubai"],
            is_direct_available: true,
            est_economy_fare: "AED 850 - AED 1,400",
            est_business_fare: "AED 2,800 - AED 4,500"
          },
          {
            origin_city: "London (LHR)",
            origin_code: "LON",
            avg_duration_hours: "10h 30m (1-stop via DEL or DXB)",
            typical_airlines: ["British Airways", "Air India", "Emirates"],
            is_direct_available: false,
            est_economy_fare: "£550 - £850",
            est_business_fare: "£2,400 - £3,800"
          }
        ],
        airport_transfer_guide: "Jaipur Airport (JAI) is just 12 km from city center. Pre-paid airport taxi booths or Uber/Ola are easily accessible at arrival exit. Journey time to Bani Park / MI Road is approximately 25–35 minutes.",
        booking_lead_time_tips: "Best months to visit are October through March. Book heritage hotels and domestic flights 4–8 weeks in advance for peak wedding and holiday seasons.",
        visa_and_transit_notes: "India offers convenient 30-day, 1-year, and 5-year electronic e-Visas online for citizens of over 160 countries through the official government portal."
      }
    }
  },
  {
    label: 'Paris Art, Architecture & French Gastronomy',
    description: '4-day romantic & cultural itinerary through the Louvre, Eiffel Tower, Montmartre, Seine River cruises, and French bistros.',
    badge: 'European Classic',
    inputs: {
      destination: 'Paris, France',
      origin_city: 'London (LHR), UK',
      duration: 4,
      currency: 'EUR',
      travelers: 'Couple',
      budget: 'Comfort (€180/day)',
      pace: 'Balanced',
      interests: 'Art Museums, Eiffel Tower, French Bakeries, Historic Neighborhoods, River Cruise',
      constraints: 'Senior-friendly walking pace, elevator access where available'
    },
    data: {
      trip_summary: {
        destination: "Paris, France",
        total_days: 4,
        theme_vibe: "Haussmannian Elegance, World-Class Art & Parisian Bistro Culture",
        budget_strategy: "Paris Museum Pass (2-day), Métro Navigo Easy passes, and balanced gourmet bistro dining.",
        destination_coords: { lat: 48.8566, lng: 2.3522 },
        country: "France"
      },
      estimated_costs: {
        currency: "EUR",
        currency_symbol: "€",
        activities_per_day: 38,
        food_per_day: 65,
        hidden_fees_notes: "Paris tourist tax (€2.60–€5.20 per person/night at hotels) and audio guide rentals at Versailles/Louvre."
      },
      itinerary: [
        {
          day_number: 1,
          day_theme: "Iconic River & World Masterpieces: Louvre to Tuileries",
          geographical_focus: "1st & 7th Arrondissements",
          schedule: [
            {
              time_slot: "Morning",
              activity_name: "Musée du Louvre Masterpieces Tour",
              estimated_duration_hours: 3.0,
              description: "Discover the Mona Lisa, Winged Victory of Samothrace, and Venus de Milo in the former royal palace.",
              cost_tier: "€€ (€22)",
              insider_tip: "Enter via the Carrousel du Louvre underground mall entrance to bypass long pyramid courtyard lines. Wheelchairs and elevators are available throughout.",
              coordinates: { lat: 48.8606, lng: 2.3376 }
            },
            {
              time_slot: "Afternoon",
              activity_name: "Tuileries Gardens & Café Angelina Hot Chocolate",
              estimated_duration_hours: 2.0,
              description: "Stroll through manicured sculpture gardens and sip world-famous thick African hot chocolate and Mont-Blanc pastries.",
              cost_tier: "€ (€12)",
              insider_tip: "Plenty of comfortable green reclining chairs around the grand fountain basin for relaxing in the sunshine.",
              coordinates: { lat: 48.8635, lng: 2.3275 }
            },
            {
              time_slot: "Evening",
              activity_name: "Seine River Twilight Cruise & Illuminations",
              estimated_duration_hours: 2.0,
              description: "Glide past illuminated monuments, Notre-Dame Cathedral, and the glittering Eiffel Tower from a glass-canopied riverboat.",
              cost_tier: "€€ (€18)",
              insider_tip: "Board near Pont Neuf (Vedettes du Pont Neuf) for smaller boats and intimate historical commentary.",
              coordinates: { lat: 48.8570, lng: 2.3410 }
            }
          ]
        },
        {
          day_number: 2,
          day_theme: "Eiffel Tower Vistas & Left Bank Literary Cafes",
          geographical_focus: "7th & 6th Arrondissements (Saint-Germain)",
          schedule: [
            {
              time_slot: "Morning",
              activity_name: "Eiffel Tower Summit / 2nd Floor Access",
              estimated_duration_hours: 2.5,
              description: "Ascend via high-speed glass elevator to panoramic observation decks offering 360-degree views of Paris.",
              cost_tier: "€€ (€29)",
              insider_tip: "Book elevator-to-the-top tickets 60 days ahead. Morning slots at 9:30 AM offer the clearest light.",
              coordinates: { lat: 48.8584, lng: 2.2945 }
            },
            {
              time_slot: "Afternoon",
              activity_name: "Musée d'Orsay Impressionist Masters",
              estimated_duration_hours: 2.5,
              description: "Admire Monet, Renoir, Degas, and Van Gogh inside a magnificent 1900 Beaux-Arts railway station.",
              cost_tier: "€€ (€16)",
              insider_tip: "Visit the 5th floor clock face cafe for a dramatic silhouette photo overlooking the Seine and Sacré-Cœur.",
              coordinates: { lat: 48.8599, lng: 2.3265 }
            },
            {
              time_slot: "Evening",
              activity_name: "Saint-Germain-des-Prés Bistro Dinner",
              estimated_duration_hours: 2.5,
              description: "Savor duck confit, beef bourguignon, and fresh baguette at an authentic historic Parisian bistro.",
              cost_tier: "€€ (€35 - €50)",
              insider_tip: "Stroll past historic literary hubs Café de Flore and Les Deux Magots after dinner.",
              coordinates: { lat: 48.8538, lng: 2.3332 }
            }
          ]
        },
        {
          day_number: 3,
          day_theme: "Montmartre Bohemian Artists & Sacré-Cœur Panorama",
          geographical_focus: "18th Arrondissement (Montmartre)",
          schedule: [
            {
              time_slot: "Morning",
              activity_name: "Sacré-Cœur Basilica & Dome Viewpoint",
              estimated_duration_hours: 2.5,
              description: "Visit the Romano-Byzantine white basilica perched atop the highest hill in Paris.",
              cost_tier: "Free",
              insider_tip: "Use the Montmartre Funicular (accepts normal Métro ticket) to reach the top without climbing 222 steps.",
              coordinates: { lat: 48.8867, lng: 2.3431 }
            },
            {
              time_slot: "Afternoon",
              activity_name: "Place du Tertre Portrait Painters & Vineyard Stroll",
              estimated_duration_hours: 2.0,
              description: "Watch portrait artists at open-air easels, see the historic Clos Montmartre vineyard, and explore cobblestone alleys.",
              cost_tier: "Free",
              insider_tip: "Stop at La Maison Rose for an iconic pastel photography stop and warm tea.",
              coordinates: { lat: 48.8865, lng: 2.3408 }
            },
            {
              time_slot: "Evening",
              activity_name: "Opera Garnier & Covered Passages Stroll",
              estimated_duration_hours: 2.5,
              description: "Admire Chagall's ceiling at Palais Garnier and explore 19th-century glass-roofed arcades (Galerie Vivienne).",
              cost_tier: "€€ (€15)",
              insider_tip: "Covered passages are peaceful, warmly lit, and filled with antique bookshops and wine bars.",
              coordinates: { lat: 48.8719, lng: 2.3316 }
            }
          ]
        },
        {
          day_number: 4,
          day_theme: "Le Marais Charm, Place des Vosges & French Bakery Tour",
          geographical_focus: "3rd & 4th Arrondissements (Le Marais)",
          schedule: [
            {
              time_slot: "Morning",
              activity_name: "Place des Vosges & Victor Hugo House",
              estimated_duration_hours: 2.0,
              description: "Walk the oldest planned square in Paris surrounded by vaulted red-brick arcades and tranquil lime trees.",
              cost_tier: "Free",
              insider_tip: "Sit under the shady arcades to watch local French boules players.",
              coordinates: { lat: 48.8555, lng: 2.3655 }
            },
            {
              time_slot: "Afternoon",
              activity_name: "Rue des Rosiers Food Walk & Boutiques",
              estimated_duration_hours: 2.5,
              description: "Sample world-famous warm pita falafel at L'As du Fallafel, artisan eclairs, and French perfumeries.",
              cost_tier: "€ (€12 - €18)",
              insider_tip: "Pedestrian-only cobblestone streets make this one of Paris's most enjoyable leisurely walks.",
              coordinates: { lat: 48.8576, lng: 2.3590 }
            },
            {
              time_slot: "Evening",
              activity_name: "Farewell Gourmet Dinner & Montparnasse Tower Views",
              estimated_duration_hours: 2.5,
              description: "Celebrate your final evening with classic French soufflés and sweeping nighttime skyline views of the illuminated city.",
              cost_tier: "€€€ (€60+)",
              insider_tip: "The 56th floor of Tour Montparnasse has an enclosed heated observation deck with speedy elevator access.",
              coordinates: { lat: 48.8421, lng: 2.3219 }
            }
          ]
        }
      ],
      local_logistics_guide: {
        best_transit_method: "Paris Métro & RER trains. Use a contactless Navigo Easy card (€2.15/ticket or €17.30 for 10-pack). Citymapper app provides real-time step-free route navigation.",
        cultural_etiquette_alerts: [
          "Always say 'Bonjour Madame / Monsieur' immediately upon entering any shop, bakery, or cafe.",
          "Keep voice at a moderate, respectful level in public transit and restaurants.",
          "Service is included in bills by law ('service compris'), though leaving €1–€2 in cash for good service is appreciated."
        ],
        packing_essentials: [
          "Comfortable walking shoes suitable for cobblestones",
          "Light trench coat or stylish jacket for cool evenings",
          "Small cross-body anti-theft bag for busy tourist zones"
        ],
        senior_and_accessibility_notes: "Paris buses (RATP) are 100% low-floor wheelchair accessible and offer scenic ground-level sightseeing across the city."
      },
      hotel_recommendations: [
        {
          name: "Hôtel Relais Saint-Germain",
          category: "Boutique & Heritage",
          neighborhood: "6th Arr. (Saint-Germain)",
          approx_price_per_night: 290,
          best_for: "Couples & Literary Buffs (17th-century charm, elevator, Yves Camdeborde cuisine)",
          key_highlights: [
            "Situated right on Carrefour de l'Odéon steps from Luxembourg Gardens",
            "Priority reservations at famous adjacent Le Comptoir du Relais bistro",
            "Beautiful beamed ceilings and luxurious plush bedding"
          ],
          coordinates: { lat: 48.8524, lng: 2.3385 }
        },
        {
          name: "Le Meurice - Dorchester Collection",
          category: "Luxury & 5-Star",
          neighborhood: "1st Arr. (Opposite Tuileries)",
          approx_price_per_night: 920,
          best_for: "Palatial French Luxury & Exceptional Service",
          key_highlights: [
            "Historic palace hotel designed like Versailles with Philippe Starck interiors",
            "Alain Ducasse 2-Michelin starred dining and Cédric Grolet pastry boutique",
            "Full wheelchair accessibility and dedicated 24-hour concierge"
          ],
          coordinates: { lat: 48.8652, lng: 2.3298 }
        },
        {
          name: "CitizenM Paris Gare de Lyon",
          category: "Comfort & Mid-Range",
          neighborhood: "12th Arr. (Near Seine & Transit)",
          approx_price_per_night: 165,
          best_for: "Modern Comfort & Transit Convenience",
          key_highlights: [
            "Rooftop cloud bar with sweeping panoramic views of Paris",
            "King-size XL beds, mood lighting tablet controls, and soundproofing",
            "Direct elevator access and 2 minutes from major train/metro lines"
          ],
          coordinates: { lat: 48.8441, lng: 2.3732 }
        },
        {
          name: "Hôtel des Grands Boulevards",
          category: "Boutique & Heritage",
          neighborhood: "2nd Arr. (Opera / Bourse)",
          approx_price_per_night: 240,
          best_for: "Design Enthusiasts & Foodies",
          key_highlights: [
            "Set in a secluded 18th-century manor house with courtyard garden",
            "Rooftop cocktail terrace and organic French-Italian restaurant",
            "Walking distance to Louvre and covered passages"
          ],
          coordinates: { lat: 48.8708, lng: 2.3442 }
        },
        {
          name: "The People Paris Marais",
          category: "Budget & Hostels",
          neighborhood: "4th Arr. (Bastille / Marais)",
          approx_price_per_night: 85,
          best_for: "Budget Travelers & Solo Backpackers",
          key_highlights: [
            "Modern designer private rooms and pod dorms with en-suite baths",
            "Vibrant courtyard bakery and rooftop terrace",
            "Minutes from Place de la Bastille and Seine river banks"
          ],
          coordinates: { lat: 48.8519, lng: 2.3665 }
        },
        {
          name: "Hôtel Fabric",
          category: "Comfort & Mid-Range",
          neighborhood: "11th Arr. (Oberkampf)",
          approx_price_per_night: 195,
          best_for: "Vibrant Neighborhood & Quiet Boutique Stay",
          key_highlights: [
            "Converted former textile factory with loft-style spacious rooms",
            "Complimentary spa, hammam steam bath, and fitness room",
            "Surrounded by trendy cafes, wine bars, and bakeries"
          ],
          coordinates: { lat: 48.8628, lng: 2.3745 }
        }
      ],
      restaurant_recommendations: [
        {
          name: "Bouillon Chartier",
          cuisine_type: "Classic French Heritage Bistro",
          neighborhood: "9th Arr. (Grands Boulevards)",
          must_try_dish: "Steak Frites, Escargots de Bourgogne, and Mousse au Chocolat",
          veg_friendliness: "Good Options",
          approx_cost_for_two: 35,
          senior_and_family_tips: "1896 Belle Époque dining room. Waiters write your order directly onto paper tablecloths. Incredible value!",
          category_tag: "Local Specialty",
          coordinates: { lat: 48.8718, lng: 2.3430 }
        },
        {
          name: "L'As du Fallafel",
          cuisine_type: "Middle Eastern / Famous Pita Street Food",
          neighborhood: "4th Arr. (Le Marais)",
          must_try_dish: "Special Falafel Pita with Fried Eggplant, Hummus & Tahini",
          veg_friendliness: "Pure Vegetarian",
          approx_cost_for_two: 20,
          senior_and_family_tips: "World-famous falafel hotspot. Seated dining room available inside with fast service.",
          category_tag: "Street Food Gem",
          coordinates: { lat: 48.8575, lng: 2.3592 }
        },
        {
          name: "Chez Janou",
          cuisine_type: "Provençal French Bistro & Pastis Bar",
          neighborhood: "3rd Arr. (Near Place des Vosges)",
          must_try_dish: "Magret de Canard (Duck Breast) with Rosemary & Unlimited Chocolate Mousse bowl",
          veg_friendliness: "Excellent Veg & Vegan Options",
          approx_cost_for_two: 65,
          senior_and_family_tips: "Charming sunny terrace shaded by greenery. Advance booking recommended.",
          category_tag: "Local Specialty",
          coordinates: { lat: 48.8569, lng: 2.3670 }
        },
        {
          name: "Du Pain et des Idées",
          cuisine_type: "Artisan French Bakery & Viennoiserie",
          neighborhood: "10th Arr. (Canal Saint-Martin)",
          must_try_dish: "Escargot Chocolat Pistache (Pistachio Chocolate Swirl) & Pain des Amis",
          veg_friendliness: "Pure Vegetarian",
          approx_cost_for_two: 12,
          senior_and_family_tips: "Widely regarded as Paris's finest heritage bakery. Beautiful wooden benches outside.",
          category_tag: "Sweet & Bakery",
          coordinates: { lat: 48.8713, lng: 2.3628 }
        },
        {
          name: "Le Grand Véfour",
          cuisine_type: "Haute French Fine Dining (Founded 1784)",
          neighborhood: "Palais-Royal",
          must_try_dish: "Chef Guy Martin Foie Gras Ravioli & Pigeon Prince Rainier",
          veg_friendliness: "Good Options",
          approx_cost_for_two: 180,
          senior_and_family_tips: "Historic neoclassical dining hall inside Palais-Royal gardens where Napoleon and Victor Hugo dined.",
          category_tag: "Fine Dining",
          coordinates: { lat: 48.8659, lng: 2.3382 }
        },
        {
          name: "Café de Flore",
          cuisine_type: "Historic Literary Café",
          neighborhood: "Saint-Germain-des-Prés",
          must_try_dish: "Croque Monsieur, Welsh Rarebit, and Chocolat Chaud Spécial Flore",
          veg_friendliness: "Good Options",
          approx_cost_for_two: 40,
          senior_and_family_tips: "Iconic people-watching terrace where Sartre and Simone de Beauvoir wrote their philosophies.",
          category_tag: "Casual Cafe",
          coordinates: { lat: 48.8542, lng: 2.3325 }
        }
      ],
      local_phrases: [
        {
          category: "Greetings & Courtesy",
          english_phrase: "Hello / Good day",
          local_script: "Bonjour",
          phonetic_pronunciation: "Bohn-zhoor",
          usage_tip: "The golden word of French etiquette. Always say this first when entering any venue."
        },
        {
          category: "Greetings & Courtesy",
          english_phrase: "Thank you very much",
          local_script: "Merci beaucoup",
          phonetic_pronunciation: "Mehr-see boh-koo",
          usage_tip: "Polite gratitude phrase."
        },
        {
          category: "Food & Drinking Water",
          english_phrase: "A carafe of tap water, please",
          local_script: "Une carafe d'eau, s'il vous plaît",
          phonetic_pronunciation: "Oon kah-rahf doh, seel voo pleh",
          usage_tip: "Requests complimentary, delicious filtered Paris tap water at any restaurant."
        },
        {
          category: "Food & Drinking Water",
          english_phrase: "Do you have vegetarian dishes?",
          local_script: "Avez-vous des plats végétariens ?",
          phonetic_pronunciation: "Ah-vay voo day plah vay-zhay-tah-ryahn?",
          usage_tip: "Helpful phrase when inquiring about plant-based options."
        },
        {
          category: "Directions & Transport",
          english_phrase: "Where is the elevator / restroom?",
          local_script: "Où est l'ascenseur / les toilettes ?",
          phonetic_pronunciation: "Oo eh lah-sahn-ser / lay twah-let?",
          usage_tip: "Crucial for accessible navigation in museums and stations."
        },
        {
          category: "Shopping & Help",
          english_phrase: "The bill, please",
          local_script: "L'addition, s'il vous plaît",
          phonetic_pronunciation: "Lah-dee-syohn, seel voo pleh",
          usage_tip: "French waiters will not bring the check until you ask for it."
        }
      ],
      fun_facts: [
        {
          title: "The Louvre Was Built as a Medieval Fortress",
          fact: "The Louvre was originally constructed in 1190 as a defensive fortress against Viking raids. You can still see the excavated medieval moat foundations in the museum basement!",
          tag: "History"
        },
        {
          title: "There Are No 'Stop' Signs in Paris",
          fact: "Paris has zero stop signs in the entire city. The rule is 'priorité à droite' (priority to the right) at all non-signalized intersections.",
          tag: "Trivia"
        },
        {
          title: "The Eiffel Tower Grows in Summer",
          fact: "Due to thermal expansion of the puddle iron metal, the Eiffel Tower can grow up to 15 centimeters (6 inches) taller during hot summer days.",
          tag: "Science & Engineering"
        },
        {
          title: "Paris Has Over 400 Parks and Gardens",
          fact: "From the Renaissance Tuileries to the modern Parc des Buttes-Chaumont, Paris is one of Europe's greenest capital cities.",
          tag: "Nature"
        }
      ],
      flight_analysis: {
        destination_airports: [
          {
            code: "CDG",
            name: "Paris Charles de Gaulle Airport",
            city: "Paris (North)",
            distance_from_center_km: 26
          },
          {
            code: "ORY",
            name: "Paris Orly Airport (Closer to City)",
            city: "Paris (South)",
            distance_from_center_km: 14
          }
        ],
        popular_routes: [
          {
            origin_city: "London (LHR/LCY/LGW)",
            origin_code: "LON",
            avg_duration_hours: "1h 15m (Flight) or 2h 18m (Eurostar Train from St Pancras)",
            typical_airlines: ["British Airways", "Air France", "Eurostar High-Speed Train"],
            is_direct_available: true,
            est_economy_fare: "£75 - £140",
            est_business_fare: "£220 - £450"
          },
          {
            origin_city: "New York (JFK/EWR)",
            origin_code: "NYC",
            avg_duration_hours: "7h 15m (Direct)",
            typical_airlines: ["Air France", "Delta", "United", "Norse Atlantic"],
            is_direct_available: true,
            est_economy_fare: "$520 - $880",
            est_business_fare: "$2,600 - $4,200"
          },
          {
            origin_city: "New Delhi (DEL)",
            origin_code: "DEL",
            avg_duration_hours: "8h 45m (Direct)",
            typical_airlines: ["Air India", "Air France"],
            is_direct_available: true,
            est_economy_fare: "€490 - €780",
            est_business_fare: "€1,800 - €3,200"
          },
          {
            origin_city: "Dubai (DXB)",
            origin_code: "DXB",
            avg_duration_hours: "7h 10m (Direct)",
            typical_airlines: ["Emirates", "Air France"],
            is_direct_available: true,
            est_economy_fare: "€450 - €750",
            est_business_fare: "€2,200 - €3,600"
          }
        ],
        airport_transfer_guide: "From CDG, take the RER B train direct to central Paris (Gare du Nord, Châtelet-Les Halles, Saint-Michel) in 35 mins (€11.80) or official flat-rate taxis (€56 to Right Bank, €65 to Left Bank). From Orly, take the newly extended Métro Line 14 directly into Châtelet in 25 mins (€10.30).",
        booking_lead_time_tips: "Book museum slots and high-speed rail 2–3 months ahead. Spring (April-June) and Autumn (September-October) offer ideal pleasant weather.",
        visa_and_transit_notes: "Schengen visa zone applies. US, UK, Canadian, Australian, and Singapore passport holders can stay visa-free for up to 90 days in any 180-day period."
      }
    }
  }
];
