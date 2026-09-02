import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, RefreshCw, Star, MapPin, Search } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import HotelCard from '../components/HotelCard';

const SkeletonCard = () => (
  <div className="border border-slate-150 dark:border-slate-800/80 rounded-3xl overflow-hidden p-4 space-y-4 bg-white dark:bg-[#1E293B] animate-pulse">
    <div className="aspect-[4/3] w-full rounded-2xl bg-slate-200 dark:bg-slate-800" />
    <div className="space-y-2.5 pt-1">
      <div className="h-3 w-1/4 bg-slate-200 dark:bg-slate-800 rounded-md" />
      <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-md" />
      <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-md" />
      <div className="h-3 w-5/6 bg-slate-200 dark:bg-slate-800 rounded-md" />
    </div>
    <div className="border-t border-slate-100 dark:border-slate-800/60 pt-4 flex items-center justify-between">
      <div className="h-8 w-1/3 bg-slate-200 dark:bg-slate-800 rounded-lg" />
      <div className="h-8 w-1/4 bg-slate-200 dark:bg-slate-800 rounded-lg" />
    </div>
  </div>
);

const Hotels = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // AI Recommendations State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [aiSummary, setAiSummary] = useState('');

  // Extract filters from searchParams
  const filters = {
    search: searchParams.get('search') || '',
    city: searchParams.get('city') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    rating: searchParams.get('rating') || '',
    amenities: searchParams.get('amenities') || '',
  };

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      setError(null);
      try {
        const query = new URLSearchParams();
        if (filters.search) query.append('search', filters.search);
        if (filters.city) query.append('city', filters.city);
        if (filters.minPrice) query.append('minPrice', filters.minPrice);
        if (filters.maxPrice) query.append('maxPrice', filters.maxPrice);
        if (filters.rating) query.append('rating', filters.rating);
        if (filters.amenities) query.append('amenities', filters.amenities);

        const res = await axios.get(`/api/hotels?${query.toString()}`);
        setHotels(res.data);
      } catch (err) {
        console.error('API Error, using fallback content', err);
        setError('Could not retrieve stays from live database. Showing offline demo stays.');
        
        // Mock offline fallback
        const fallbackHotels = [
          {
            _id: 'mock1',
            name: 'Grand Hyatt Plaza',
            description: 'Luxury rooms overlooking the Eiffel Tower. Features premium spa, heated pool, and Michelin star dining services.',
            address: '12 Avenue des Champs-Élysées',
            city: 'Paris',
            country: 'France',
            rating: 4.8,
            numReviews: 240,
            amenities: ['Spa', 'Pool', 'Wifi', 'Restaurant', 'Gym'],
            images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80'],
            rooms: [
              { roomNumber: '101', type: 'Single', pricePerNight: 120, isAvailable: true },
              { roomNumber: '102', type: 'Double', pricePerNight: 210, isAvailable: true },
              { roomNumber: '201', type: 'Suite', pricePerNight: 450, isAvailable: true }
            ]
          },
          {
            _id: 'mock2',
            name: 'The Ritz Carlton Suite',
            description: 'Stunning city views from the center of Manhattan. Close to Central Park, Broadway theatres, and Times Square.',
            address: 'Central Park South 50',
            city: 'New York',
            country: 'United States',
            rating: 4.9,
            numReviews: 312,
            amenities: ['Wifi', 'Gym', 'Bar', 'Room Service'],
            images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80'],
            rooms: [
              { roomNumber: '401', type: 'Double', pricePerNight: 280, isAvailable: true },
              { roomNumber: '501', type: 'Deluxe', pricePerNight: 550, isAvailable: true }
            ]
          },
          {
            _id: 'mock3',
            name: 'Imperial Heritage Resort',
            description: 'Peaceful traditional resort nestled in cherry blossom gardens with hot springs bath and authentic Japanese rooms.',
            address: 'Chiyoda-ku Marunouchi 1-1',
            city: 'Tokyo',
            country: 'Japan',
            rating: 4.7,
            numReviews: 180,
            amenities: ['Hot Springs', 'Garden', 'Wifi', 'Breakfast'],
            images: ['https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=600&q=80'],
            rooms: [
              { roomNumber: '101', type: 'Single', pricePerNight: 95, isAvailable: true },
              { roomNumber: '102', type: 'Suite', pricePerNight: 350, isAvailable: true }
            ]
          },
          {
            _id: 'mock4',
            name: 'Westminster Palace Spa',
            description: 'Elegant Victorian estate near the River Thames. Features classic English high tea lounge and award winning thermal spa.',
            address: 'Bridge St, Westminster',
            city: 'London',
            country: 'United Kingdom',
            rating: 4.6,
            numReviews: 195,
            amenities: ['Spa', 'Wifi', 'High Tea', 'Restaurant'],
            images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=600&q=80'],
            rooms: [
              { roomNumber: '101', type: 'Single', pricePerNight: 110, isAvailable: true },
              { roomNumber: '102', type: 'Double', pricePerNight: 180, isAvailable: true }
            ]
          }
        ];

        let filtered = fallbackHotels;
        if (filters.city) {
          filtered = filtered.filter(h => h.city.toLowerCase().includes(filters.city.toLowerCase()));
        }
        if (filters.search) {
          filtered = filtered.filter(h =>
            h.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            h.description.toLowerCase().includes(filters.search.toLowerCase())
          );
        }
        if (filters.rating) {
          filtered = filtered.filter(h => h.rating >= Number(filters.rating));
        }
        if (filters.minPrice) {
          filtered = filtered.filter(h => Math.min(...h.rooms.map(r => r.pricePerNight)) >= Number(filters.minPrice));
        }
        if (filters.maxPrice) {
          filtered = filtered.filter(h => Math.min(...h.rooms.map(r => r.pricePerNight)) <= Number(filters.maxPrice));
        }
        if (filters.amenities) {
          const ams = filters.amenities.split(',').filter(Boolean);
          filtered = filtered.filter(h => ams.every(a => h.amenities.includes(a)));
        }

        setHotels(filtered);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [searchParams]);

  const handleSearchSubmit = (newFilters) => {
    const params = {};
    Object.keys(newFilters).forEach(key => {
      if (newFilters[key]) {
        params[key] = newFilters[key];
      }
    });
    setSearchParams(params);
  };

  const handleAiRecommend = async (e) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setAiLoading(true);
    setAiError(null);
    setAiRecommendations([]);
    setAiSummary('');

    try {
      const res = await axios.post('/api/ai/recommend', { prompt: aiPrompt });
      setAiSummary(res.data.generalSummary);
      
      const recommendations = res.data.recommendations || [];
      const resolved = recommendations.map(rec => ({
        id: rec.hotelId,
        reasoning: rec.reasoning
      }));

      // Fetch all hotels to match returned IDs
      let allHotelsList = [];
      try {
        const hRes = await axios.get('/api/hotels');
        allHotelsList = hRes.data;
      } catch (err) {
        // Fallback matched items
        allHotelsList = [
          { _id: 'mock1', name: 'Grand Hyatt Plaza', city: 'Paris', country: 'France', rating: 4.8, amenities: ['Spa', 'Pool'], images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80'], rooms: [{pricePerNight: 120}] },
          { _id: 'mock2', name: 'The Ritz Carlton Suite', city: 'New York', country: 'United States', rating: 4.9, amenities: ['Wifi', 'Gym'], images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80'], rooms: [{pricePerNight: 280}] },
          { _id: 'mock3', name: 'Imperial Heritage Resort', city: 'Tokyo', country: 'Japan', rating: 4.7, amenities: ['Hot Springs', 'Garden'], images: ['https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=600&q=80'], rooms: [{pricePerNight: 95}] },
          { _id: 'mock4', name: 'Westminster Palace Spa', city: 'London', country: 'United Kingdom', rating: 4.6, amenities: ['Spa', 'Wifi'], images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=600&q=80'], rooms: [{pricePerNight: 110}] }
        ];
      }

      const finalRecs = resolved.map(rec => {
        const match = allHotelsList.find(h => h._id === rec.id);
        if (match) {
          return {
            ...match,
            reasoning: rec.reasoning
          };
        }
        return null;
      }).filter(Boolean);

      setAiRecommendations(finalRecs);
    } catch (err) {
      console.error('AI Recommendations failed', err);
      setAiError(err.response?.data?.message || 'Could not fetch AI recommendations. Check API settings.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="space-y-2">
          <span className="text-3xs font-extrabold text-primary-600 dark:text-primary-400 uppercase tracking-widest block">Stays Directory</span>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Available Stays</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Filter through hundreds of luxurious destinations to match your schedule.</p>
        </div>
      </div>

      {/* Search Filter Panel */}
      <div className="bg-transparent rounded-3xl">
        <SearchBar onSearch={handleSearchSubmit} initialFilters={filters} />
      </div>

      {/* AI Smart Travel Concierge Panel */}
      <div className="rounded-3xl border border-indigo-100 dark:border-slate-800 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 dark:from-indigo-500/10 dark:to-purple-500/10 p-6 md:p-8 space-y-5 shadow-sm">
        <div className="flex items-center space-x-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/30">
            <Sparkles className="h-5.5 w-5.5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">AI Smart Concierge Recommendations</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">Tell Gemini details of your travel wishlist, and we will find the closest hotel matches.</p>
          </div>
        </div>

        <form onSubmit={handleAiRecommend} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="e.g. A romantic hotel in Paris close to museums with a nice view, or cheap spa hotels..."
            className="flex-grow rounded-2xl border border-slate-200 dark:border-slate-800 px-4.5 py-3.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 bg-white dark:bg-slate-900 placeholder-slate-400 dark:placeholder-slate-500 transition-all shadow-2xs font-semibold"
          />
          <button
            type="submit"
            disabled={aiLoading || !aiPrompt.trim()}
            className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-350 disabled:cursor-not-allowed px-6 py-3.5 text-xs font-bold text-white shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            {aiLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span>Analyzing...</span>
              </>
            ) : (
              <span>Recommend</span>
            )}
          </button>
        </form>

        {aiError && (
          <div className="text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/20 p-3 rounded-2xl border border-rose-100 dark:border-rose-950/40 font-medium">
            {aiError}
          </div>
        )}

        {aiSummary && (
          <p className="text-xs font-semibold text-indigo-800 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30 p-4 rounded-2xl border border-indigo-100/50 dark:border-indigo-950/40 leading-relaxed italic">
            "{aiSummary}"
          </p>
        )}

        {aiRecommendations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {aiRecommendations.map((hotel) => {
              const minPrice = hotel.rooms && hotel.rooms.length > 0
                ? Math.min(...hotel.rooms.map(room => room.pricePerNight))
                : 120;
              return (
                <div key={hotel._id} className="bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                  <div className="p-5 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-3xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block">{hotel.city}, {hotel.country}</span>
                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mt-1 tracking-tight">{hotel.name}</h4>
                      </div>
                      <span className="text-2xs text-slate-900 dark:text-white font-bold bg-slate-50 dark:bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center gap-0.5">
                        <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                        <span>{hotel.rating.toFixed(1)}</span>
                      </span>
                    </div>
                    <div className="bg-indigo-50/45 dark:bg-indigo-950/20 p-4 rounded-xl border border-indigo-100/30 dark:border-indigo-950/40 text-xs text-slate-650 dark:text-slate-350 leading-relaxed font-normal">
                      <span className="font-extrabold text-indigo-700 dark:text-indigo-400 block mb-1 uppercase tracking-wider text-3xs">AI Match Reason:</span>
                      "{hotel.reasoning}"
                    </div>
                  </div>
                  <div className="bg-slate-50/70 dark:bg-slate-900/60 p-5 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                    <div>
                      <span className="text-3xs text-slate-400 block uppercase font-bold tracking-widest leading-none mb-1">Starting Price</span>
                      <span className="text-base font-black text-slate-900 dark:text-white">${minPrice}</span>
                      <span className="text-3xs text-slate-450 dark:text-slate-500 font-semibold uppercase tracking-wider"> / night</span>
                    </div>
                    <button
                      onClick={() => navigate(`/hotels/${hotel._id}`)}
                      className="rounded-xl bg-slate-950 dark:bg-slate-800 hover:bg-indigo-650 px-4.5 py-2.5 text-xs font-bold text-white shadow-sm hover:shadow-md transition-all cursor-pointer"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 p-4.5 text-amber-800 dark:text-amber-400 text-xs flex items-center gap-2 font-medium">
          <ShieldAlert className="h-5 w-5 text-amber-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading state - Skeletons */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : hotels.length === 0 ? (
        /* Empty state */
        <div className="text-center py-20 bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800/80 rounded-3xl p-8 space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-900 text-slate-400">
            <Compass className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">No Stays Located</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">We couldn't find any listings matching your search filters. Try clearing some selections.</p>
          <button
            onClick={() => setSearchParams({})}
            className="rounded-xl bg-primary-600 hover:bg-primary-700 px-5 py-2.5 text-xs font-bold text-white shadow-md cursor-pointer select-none"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        /* Hotel Cards Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {hotels.map((hotel) => (
            <HotelCard key={hotel._id} hotel={hotel} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Hotels;
