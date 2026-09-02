import { GoogleGenerativeAI } from '@google/generative-ai';
import Hotel from '../models/Hotel.js';

const GEMINI_MODEL = 'gemini-2.5-flash';

// Initialize Gemini API client if API key is present and not the placeholder
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  if (apiKey.endsWith('1111111') || apiKey.includes('PLACEHOLDER')) {
    console.warn('\n⚠️ [StaySmart Warning]: Your GEMINI_API_KEY in .env appears to be masked or contains placeholder characters (e.g., ending with 1111111). Please insert your actual, unmodified key from Google AI Studio.\n');
  }
  try {
    return new GoogleGenerativeAI(apiKey);
  } catch (error) {
    console.error('Failed to initialize GoogleGenerativeAI client:', error);
    return null;
  }
};

// @desc    Summarize hotel reviews using Gemini
// @route   GET /api/ai/reviews/:hotelId
// @access  Public
export const getReviewSummary = async (req, res, next) => {
  try {
    const { hotelId } = req.params;
    const hotel = await Hotel.findById(hotelId);

    if (!hotel) {
      res.status(404);
      throw new Error('Hotel not found');
    }

    const reviews = hotel.reviews || [];
    if (reviews.length === 0) {
      return res.json({
        summary: 'No reviews available to summarize yet for this hotel.',
        pros: [],
        cons: [],
        sentiment: 'Neutral (No reviews)',
      });
    }

    const ai = getGeminiClient();
    if (ai) {
      try {
        const model = ai.getGenerativeModel({ model: GEMINI_MODEL });
        
        // Prepare reviews text
        const reviewsText = reviews
          .map((r, i) => `Review ${i+1} (${r.rating} stars): "${r.comment}"`)
          .join('\n');

        const prompt = `You are an AI assistant for a hotel booking platform named StaySmart.
Analyze the following user reviews for the hotel "${hotel.name}" located in ${hotel.city}, ${hotel.country}:

${reviewsText}

Based on these reviews, generate a clean JSON response containing:
1. "summary": A brief 2-3 sentence paragraph summarizing the overall guest sentiment and what the hotel is generally known for.
2. "pros": A list (array of strings) of the top 3 specific positive aspects guests consistently mention.
3. "cons": A list (array of strings) of the top 2-3 negative aspects or areas of improvement mentioned. If none are significant, write general minor observations.
4. "sentiment": A single string classification (e.g. "Overwhelmingly Positive", "Mostly Positive", "Mixed", "Negative").

Ensure the response is valid JSON and only returns the raw JSON string with no markdown block formatting. Example:
{
  "summary": "...",
  "pros": ["...", "..."],
  "cons": ["...", "..."],
  "sentiment": "..."
}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();
        
        // Parse JSON (strip markdown formatting if the model included it)
        const cleanJSONString = text.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
        const parsed = JSON.parse(cleanJSONString);
        return res.json(parsed);
      } catch (err) {
        console.error('Gemini API review summary failed, using fallback:', err);
      }
    }

    // High quality programmatic Fallback
    const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    let sentiment = 'Mixed';
    if (averageRating >= 4.5) sentiment = 'Overwhelmingly Positive';
    else if (averageRating >= 4.0) sentiment = 'Mostly Positive';
    else if (averageRating < 3.0) sentiment = 'Negative';

    // Rule-based pro/con generation based on dummy data comments/rating
    const pros = [];
    const cons = [];

    // Simple rule mapping
    const commentsText = reviews.map(r => r.comment.toLowerCase()).join(' ');
    if (commentsText.includes('spa') || commentsText.includes('relaxing')) pros.push('Relaxing high-quality spa and wellness facilities');
    if (commentsText.includes('service') || commentsText.includes('exceptional')) pros.push('Exceptional, welcoming, and professional hotel staff');
    if (commentsText.includes('rooftop') || commentsText.includes('view') || commentsText.includes('views')) pros.push('Spectacular views and rooftop experience');
    if (commentsText.includes('location') || commentsText.includes('close')) pros.push('Excellent location with convenient access to major attractions');
    if (commentsText.includes('clean') || commentsText.includes('comfortable')) pros.push('Spotlessly clean and comfortable accommodations');

    if (commentsText.includes('noise') || commentsText.includes('noisy')) cons.push('Some noise disruption during high-traffic times');
    if (commentsText.includes('photo') || commentsText.includes('outdated')) cons.push('Decors or room features may feel slightly dated in places');
    if (commentsText.includes('crowded') || commentsText.includes('busy')) cons.push('Amenities like pools can get crowded in the afternoon');
    if (commentsText.includes('breakfast') || commentsText.includes('food')) cons.push('Breakfast menu selection could be expanded');

    // Defaults if none matched
    if (pros.length === 0) {
      pros.push('Comfortable and quiet guest rooms');
      pros.push('Convenient access to city sights');
      pros.push('Solid overall standard of amenities');
    }
    if (cons.length === 0) {
      cons.push('Peak hours can experience slight service delays');
      cons.push('Premium pricing on certain internal services');
    }

    const summary = `Guests generally report a ${sentiment.toLowerCase()} stay at ${hotel.name}. The property has an average guest rating of ${averageRating.toFixed(1)}/5 stars across ${reviews.length} reviews, with particular appreciation for its features and services.`;

    res.json({
      summary,
      pros: pros.slice(0, 3),
      cons: cons.slice(0, 2),
      sentiment,
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Compare hotels using Gemini
// @route   POST /api/ai/compare
// @access  Public
export const compareHotels = async (req, res, next) => {
  try {
    const { hotelIds } = req.body;

    if (!hotelIds || !Array.isArray(hotelIds) || hotelIds.length < 2) {
      res.status(400);
      throw new Error('Please select at least 2 hotels to compare');
    }

    const hotels = await Hotel.find({ _id: { $in: hotelIds } });

    if (hotels.length < 2) {
      res.status(404);
      throw new Error('Could not retrieve hotels for comparison');
    }

    const ai = getGeminiClient();
    if (ai) {
      try {
        const model = ai.getGenerativeModel({ model: GEMINI_MODEL });

        const hotelDetailsText = hotels.map((h, index) => {
          const minPrice = h.rooms && h.rooms.length > 0
            ? Math.min(...h.rooms.map(r => r.pricePerNight))
            : 'N/A';
          return `Hotel ${index + 1}: "${h.name}"
City: ${h.city}, Country: ${h.country}
Description: ${h.description}
Amenities: ${h.amenities.join(', ')}
Rating: ${h.rating} stars (${h.numReviews} reviews)
Starting Price per night: $${minPrice}
`;
        }).join('\n---\n');

        const prompt = `You are a travel advisor for StaySmart.
Compare the following hotels side-by-side:

${hotelDetailsText}

Create a structured JSON analysis containing:
1. "comparisonGrid": An array of objects for each hotel listing "name", "price", "rating", "amenitiesSummary", and "keyAdvantage".
2. "analysis": A 3-4 sentence paragraph highlighting the main differences, price-value trade-offs, and distinguishing factors.
3. "recommendations": An object mapping who each hotel is best suited for. Use hotel names as keys, and describe the target traveler as values.
4. "winner": The hotel that provides the best overall value, and a 1-sentence explanation of why.

Make sure the output is valid JSON and only returns the raw JSON string with no markdown formatting. Example:
{
  "comparisonGrid": [
    { "name": "...", "price": "...", "rating": 0, "amenitiesSummary": "...", "keyAdvantage": "..." }
  ],
  "analysis": "...",
  "recommendations": {
    "Hotel A": "Best for luxury seekers...",
    "Hotel B": "Best for budget travelers..."
  },
  "winner": { "name": "...", "reason": "..." }
}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();
        const cleanJSONString = text.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
        const parsed = JSON.parse(cleanJSONString);
        return res.json(parsed);
      } catch (err) {
        console.error('Gemini API compare hotels failed, using fallback:', err);
      }
    }

    // Programmatic Fallback
    const comparisonGrid = hotels.map(h => {
      const minPrice = h.rooms && h.rooms.length > 0
        ? Math.min(...h.rooms.map(r => r.pricePerNight))
        : 150;
      return {
        name: h.name,
        price: `$${minPrice}`,
        rating: h.rating,
        amenitiesSummary: h.amenities.slice(0, 4).join(', '),
        keyAdvantage: h.rating >= 4.8 ? 'Exceptional guest satisfaction rating' : 'High quality standard amenities'
      };
    });

    const sortedByPrice = [...hotels].sort((a, b) => {
      const priceA = a.rooms && a.rooms.length > 0 ? Math.min(...a.rooms.map(r => r.pricePerNight)) : 150;
      const priceB = b.rooms && b.rooms.length > 0 ? Math.min(...b.rooms.map(r => r.pricePerNight)) : 150;
      return priceA - priceB;
    });

    const cheapest = sortedByPrice[0];
    const highestRated = [...hotels].sort((a, b) => b.rating - a.rating)[0];

    const analysis = `Comparing these properties reveals distinct options. ${highestRated.name} stands out for its high customer rating of ${highestRated.rating}/5, while ${cheapest.name} offers a more budget-friendly entry price starting at $${cheapest.rooms && cheapest.rooms.length > 0 ? Math.min(...cheapest.rooms.map(r => r.pricePerNight)) : 150} per night.`;

    const recommendations = {};
    hotels.forEach(h => {
      if (h._id.toString() === cheapest._id.toString()) {
        recommendations[h.name] = 'Best for cost-conscious travelers seeking prime locations without premium price points.';
      } else if (h._id.toString() === highestRated._id.toString()) {
        recommendations[h.name] = 'Best for luxury seekers looking for top-tier service, wellness options, and high satisfaction.';
      } else {
        recommendations[h.name] = 'Best for balanced travelers looking for solid comfort and consistent guest amenities.';
      }
    });

    res.json({
      comparisonGrid,
      analysis,
      recommendations,
      winner: {
        name: highestRated.name,
        reason: `${highestRated.name} provides the most compelling value combining its exceptional ${highestRated.rating} rating with a robust suite of guest amenities.`
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get Smart Value Score of a hotel
// @route   GET /api/ai/value-score/:hotelId
// @access  Public
export const getSmartValueScore = async (req, res, next) => {
  try {
    const { hotelId } = req.params;
    const hotel = await Hotel.findById(hotelId);

    if (!hotel) {
      res.status(404);
      throw new Error('Hotel not found');
    }

    const minPrice = hotel.rooms && hotel.rooms.length > 0
      ? Math.min(...hotel.rooms.map(room => room.pricePerNight))
      : 150;

    const ai = getGeminiClient();
    if (ai) {
      try {
        const model = ai.getGenerativeModel({ model: GEMINI_MODEL });

        const prompt = `You are an expert hotel pricing analyst.
Calculate a "Smart Value Score" from 100 representing the value-for-money for this hotel:
Hotel: "${hotel.name}"
City: ${hotel.city}, Country: ${hotel.country}
Rating: ${hotel.rating} stars (${hotel.numReviews} reviews)
Starting Price per night: $${minPrice}
Amenities: ${hotel.amenities.join(', ')}
Description: ${hotel.description}

Consider:
- Lower starting price generally raises the score.
- Higher guest rating and more reviews raise the score.
- A higher number of quality amenities raises the score.
- Location and overall description appeal.

Generate a JSON response:
{
  "score": 88, // An integer between 1 and 100
  "explanation": "A 2-sentence explanation of why this score was awarded, referencing the price and rating or amenities."
}
Only output the JSON string, no markdown headers or blocks.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();
        const cleanJSONString = text.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
        const parsed = JSON.parse(cleanJSONString);
        return res.json(parsed);
      } catch (err) {
        console.error('Gemini API value score failed, using fallback:', err);
      }
    }

    // Programmatic Fallback pricing logic
    // Rating (out of 5) gives up to 50 points
    // Price gives points (cheaper = more points), e.g. base 30 points, minus 0.05 * price, clamped between 5 and 35.
    // Amenities gives up to 15 points (2 points per amenity, max 15)
    const ratingPoints = (hotel.rating / 5) * 50;
    const pricePoints = Math.max(5, Math.min(35, 45 - (minPrice * 0.08)));
    const amenityPoints = Math.min(15, (hotel.amenities.length * 2.5));
    const rawScore = Math.round(ratingPoints + pricePoints + amenityPoints);
    const score = Math.max(30, Math.min(99, rawScore));

    let explanation = `With a comfortable rating of ${hotel.rating}/5 stars and starting rates at $${minPrice}/night, this property offers a solid value balance. The inclusion of amenities like ${hotel.amenities.slice(0, 3).join(', ')} adds meaningful utility for guests.`;

    if (score >= 90) {
      explanation = `Outstanding deal! At just $${minPrice} per night with a superb rating of ${hotel.rating}/5, ${hotel.name} provides luxury-tier benefits and high satisfaction at a fraction of typical market prices.`;
    } else if (score >= 80) {
      explanation = `Great value choice. The starting rate of $${minPrice} aligns beautifully with its high guest rating of ${hotel.rating}, supported by convenient amenities like ${hotel.amenities.slice(0, 2).join(' and ')}.`;
    }

    res.json({
      score,
      explanation
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get hotel recommendations based on user prompt
// @route   POST /api/ai/recommend
// @access  Public
export const getRecommendations = async (req, res, next) => {
  try {
    const { prompt: userPrompt } = req.body;

    if (!userPrompt || userPrompt.trim() === '') {
      res.status(400);
      throw new Error('Please enter what you are looking for in a stay');
    }

    // Fetch all hotels to let Gemini filter/choose
    const hotels = await Hotel.find({});

    const hotelList = hotels.map(h => {
      const minPrice = h.rooms && h.rooms.length > 0
        ? Math.min(...h.rooms.map(r => r.pricePerNight))
        : 150;
      return {
        id: h._id.toString(),
        name: h.name,
        city: h.city,
        country: h.country,
        description: h.description,
        rating: h.rating,
        amenities: h.amenities,
        startingPrice: minPrice
      };
    });

    const ai = getGeminiClient();
    if (ai) {
      try {
        const model = ai.getGenerativeModel({ model: GEMINI_MODEL });

        const systemInstructions = `You are a Smart Concierge AI for StaySmart.
Given this list of hotels:
${JSON.stringify(hotelList, null, 2)}

And the user query: "${userPrompt}"

Recommend the top 2-3 hotels that match this query. For each recommended hotel, provide:
1. "hotelId": The exact string id of the hotel.
2. "reasoning": A 2-sentence explanation of why this hotel matches the user's specific request.

Format the output as a valid JSON object matching this structure:
{
  "recommendations": [
    { "hotelId": "...", "reasoning": "..." }
  ],
  "generalSummary": "A quick summary statement (1 sentence) addressing their travel desires."
}

Do not include markdown tags. Only return raw JSON.`;

        const result = await model.generateContent(systemInstructions);
        const text = result.response.text().trim();
        const cleanJSONString = text.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
        const parsed = JSON.parse(cleanJSONString);
        return res.json(parsed);
      } catch (err) {
        console.error('Gemini API recommendations failed, using fallback:', err);
      }
    }

    // Programmatic Fallback: Keyword search matching
    const searchTerms = userPrompt.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    
    // Score hotels based on match keywords
    const scoredHotels = hotels.map(h => {
      let score = 0;
      const minPrice = h.rooms && h.rooms.length > 0
        ? Math.min(...h.rooms.map(r => r.pricePerNight))
        : 150;

      const searchableText = `${h.name} ${h.city} ${h.country} ${h.description} ${h.amenities.join(' ')}`.toLowerCase();

      searchTerms.forEach(term => {
        if (searchableText.includes(term)) {
          score += 10;
        }
      });

      // Price matches
      if (userPrompt.toLowerCase().includes('budget') || userPrompt.toLowerCase().includes('cheap')) {
        if (minPrice < 150) score += 15;
      }
      if (userPrompt.toLowerCase().includes('luxury') || userPrompt.toLowerCase().includes('expensive')) {
        if (minPrice > 250) score += 15;
        if (h.rating >= 4.7) score += 10;
      }

      return { hotel: h, score };
    });

    // Sort by score desc, then by rating desc
    scoredHotels.sort((a, b) => b.score - a.score || b.hotel.rating - a.hotel.rating);

    // Pick top 2
    const selected = scoredHotels.slice(0, 2).map(item => {
      const h = item.hotel;
      const minPrice = h.rooms && h.rooms.length > 0 ? Math.min(...h.rooms.map(r => r.pricePerNight)) : 150;
      return {
        hotelId: h._id.toString(),
        reasoning: `Based on your interest, ${h.name} in ${h.city} offers a great stay starting at $${minPrice}/night. With a rating of ${h.rating} and key amenities like ${h.amenities.slice(0, 3).join(', ')}, it aligns nicely with your search request.`
      };
    });

    res.json({
      recommendations: selected,
      generalSummary: `We found ${selected.length} hotels matching your travel preferences: "${userPrompt}".`
    });

  } catch (error) {
    next(error);
  }
};
