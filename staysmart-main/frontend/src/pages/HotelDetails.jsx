import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Star, MapPin, Sparkles, Check, AlertTriangle, ArrowLeft, ChevronLeft, ChevronRight, X, Calendar, DollarSign, Heart, Compass, Loader2 } from 'lucide-react';

const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, warning: toastWarning } = useToast();

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);

  // Form Booking parameters
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [bookingError, setBookingError] = useState('');

  // AI Features State
  const [valueScore, setValueScore] = useState(null);
  const [valueScoreLoading, setValueScoreLoading] = useState(false);
  const [reviewSummary, setReviewSummary] = useState(null);
  const [reviewSummaryLoading, setReviewSummaryLoading] = useState(false);
  const [compareHotelId, setCompareHotelId] = useState('');
  const [comparisonResult, setComparisonResult] = useState(null);
  const [comparisonLoading, setComparisonLoading] = useState(false);
  const [allHotelsList, setAllHotelsList] = useState([]);

  // Wishlist state
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Lightbox gallery state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const fallbackHotels = [
    {
      _id: 'mock1',
      name: 'Grand Hyatt Plaza',
      description: 'Experience Paris in absolute luxury. Nestled close to high-fashion boulevards, our hotel features premium gold guild design, private balconies overlooking iconic monuments, a fully equipped spa center, and Michelin star culinary concepts overseen by top world chefs. Every detail is curated to provide you with an unforgettable experience.',
      address: '12 Avenue des Champs-Élysées',
      city: 'Paris',
      country: 'France',
      rating: 4.8,
      numReviews: 240,
      amenities: ['Spa', 'Pool', 'Wifi', 'Restaurant', 'Gym', 'Bar', 'Valet Parking'],
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=600&q=80'
      ],
      rooms: [
        { roomNumber: '101', type: 'Single', pricePerNight: 120, isAvailable: true, description: 'Comfortable queen size bed with courtyard view.' },
        { roomNumber: '102', type: 'Double', pricePerNight: 210, isAvailable: true, description: 'Spacious room with king bed and smart amenities.' },
        { roomNumber: '201', type: 'Suite', pricePerNight: 450, isAvailable: true, description: 'Luxury apartment layout with balcony overlooking the Eiffel Tower.' }
      ]
    },
    {
      _id: 'mock2',
      name: 'The Ritz Carlton Suite',
      description: 'Rising high above Central Park, The Ritz Carlton offers unmatched grandeur. Combining luxury suites, five-star wellness services, premium bars, and historic British tea rooms, this stay stands out as the ultimate upscale Manhattan experience.',
      address: 'Central Park South 50',
      city: 'New York',
      country: 'United States',
      rating: 4.9,
      numReviews: 312,
      amenities: ['Wifi', 'Gym', 'Bar', 'Room Service', 'Airport Shuttle', 'Business Center'],
      images: [
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80'
      ],
      rooms: [
        { roomNumber: '401', type: 'Double', pricePerNight: 280, isAvailable: true, description: 'Double twin beds with standard park overview.' },
        { roomNumber: '501', type: 'Deluxe', pricePerNight: 550, isAvailable: true, description: 'Panoramic high-rise view with king bed and marbled bath.' }
      ]
    }
  ];

  useEffect(() => {
    const fetchHotelDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`/api/hotels/${id}`);
        setHotel(res.data);
      } catch (err) {
        console.error('API error, retrieving fallback data', err);
        const match = fallbackHotels.find((h) => h._id === id);
        if (match) {
          setHotel(match);
          setWarning('Offline mode: Details loaded from offline demo stays.');
        } else {
          setError('Hotel details could not be found');
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchAIFeatures = async () => {
      setValueScoreLoading(true);
      try {
        const scoreRes = await axios.get(`/api/ai/value-score/${id}`);
        setValueScore(scoreRes.data);
      } catch (err) {
        console.error('Failed to fetch value score', err);
      } finally {
        setValueScoreLoading(false);
      }

      setReviewSummaryLoading(true);
      try {
        const reviewRes = await axios.get(`/api/ai/reviews/${id}`);
        setReviewSummary(reviewRes.data);
      } catch (err) {
        console.error('Failed to fetch review summary', err);
      } finally {
        setReviewSummaryLoading(false);
      }

      try {
        const hotelsRes = await axios.get('/api/hotels');
        setAllHotelsList(hotelsRes.data.filter(h => h._id !== id));
      } catch (err) {
        console.error('Failed to fetch hotels list for comparison', err);
        setAllHotelsList(fallbackHotels.filter(h => h._id !== id));
      }
    };

    fetchHotelDetails();
    fetchAIFeatures();

    // Check wishlist status
    const wishlist = JSON.parse(localStorage.getItem('staySmartWishlist')) || [];
    setIsWishlisted(wishlist.includes(id));
  }, [id]);

  const toggleWishlist = () => {
    let wishlist = JSON.parse(localStorage.getItem('staySmartWishlist')) || [];
    if (wishlist.includes(id)) {
      wishlist = wishlist.filter(item => item !== id);
      setIsWishlisted(false);
      success('Removed from wishlist');
    } else {
      wishlist.push(id);
      setIsWishlisted(true);
      success('Added to wishlist! ❤️');
    }
    localStorage.setItem('staySmartWishlist', JSON.stringify(wishlist));
  };

  const handleBookRedirect = (roomNumber) => {
    setBookingError('');

    if (!checkInDate || !checkOutDate) {
      return setBookingError('Please select both Check-In and Check-Out dates');
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      return setBookingError('Check-in date cannot be in the past');
    }

    if (checkIn >= checkOut) {
      return setBookingError('Check-out date must be after check-in date');
    }

    if (!user) {
      navigate('/login', {
        state: { from: { pathname: `/hotels/${id}` } },
      });
      return;
    }

    // Forward parameters to booking page
    const params = new URLSearchParams({
      hotelId: hotel._id,
      roomNumber,
      checkIn: checkInDate,
      checkOut: checkOutDate,
    });

    navigate(`/booking?${params.toString()}`);
  };

  const handleCompare = async () => {
    if (!compareHotelId) return;
    setComparisonLoading(true);
    setComparisonResult(null);
    try {
      const res = await axios.post('/api/ai/compare', {
        hotelIds: [id, compareHotelId]
      });
      setComparisonResult(res.data);
    } catch (err) {
      console.error('Comparison error', err);
    } finally {
      setComparisonLoading(false);
    }
  };

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-3">
        <Loader2 className="h-10 w-10 animate-spin text-primary-500" />
        <span className="text-xs font-semibold text-slate-500">Loading hotel suite details...</span>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="mx-auto max-w-xl text-center py-20 space-y-4">
        <AlertTriangle className="h-12 w-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Error Loading Stay</h2>
        <p className="text-xs text-slate-500">{error || 'Hotel details are currently unavailable.'}</p>
        <button
          onClick={() => navigate('/hotels')}
          className="rounded-xl bg-primary-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-primary-700 transition-colors"
        >
          Back to Browse
        </button>
      </div>
    );
  }

  const galleryImages = hotel.images && hotel.images.length > 0 ? hotel.images : [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=600&q=80'
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      
      {warning && (
        <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-950/40 p-4 text-amber-800 dark:text-amber-400 text-xs flex items-center gap-2 font-medium">
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
          <span>{warning}</span>
        </div>
      )}

      {/* Back button */}
      <button
        onClick={() => navigate('/hotels')}
        className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to listings</span>
      </button>

      {/* Custom grid gallery */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-3xl overflow-hidden shadow-md">
        <div 
          className="md:col-span-2 aspect-video overflow-hidden bg-slate-100 dark:bg-slate-900 cursor-pointer relative group"
          onClick={() => openLightbox(0)}
        >
          <img src={galleryImages[0]} alt={hotel.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-102" />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
        </div>
        <div className="hidden md:flex flex-col gap-4">
          <div 
            className="aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-900 cursor-pointer relative group flex-grow"
            onClick={() => openLightbox(1)}
          >
            <img src={galleryImages[1] || galleryImages[0]} alt={hotel.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-102" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
          </div>
          <div 
            className="aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-900 cursor-pointer relative group flex-grow"
            onClick={() => openLightbox(2 || 0)}
          >
            <img src={galleryImages[2] || galleryImages[0]} alt={hotel.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-102" />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center text-white font-bold text-xs select-none">
              View All {galleryImages.length} Photos
            </div>
          </div>
        </div>
      </div>

      {/* Main Details and Sticky booking selector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column - Details */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Header Info */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-extrabold text-primary-600 dark:text-primary-400 uppercase tracking-widest flex items-center gap-0.5">
                <MapPin className="h-4 w-4" />
                {hotel.city}, {hotel.country}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-slate-350 dark:bg-slate-800"></span>
              <div className="flex items-center gap-0.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                <span>{hotel.rating.toFixed(1)}</span>
                <span className="text-slate-400 font-normal">({hotel.numReviews} Reviews)</span>
              </div>
            </div>

            <div className="flex justify-between items-start gap-4">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{hotel.name}</h2>
              <button
                onClick={toggleWishlist}
                className={`p-3 rounded-2xl border transition-colors cursor-pointer flex-shrink-0 ${
                  isWishlisted 
                    ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-200/50 text-rose-500' 
                    : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-500 hover:bg-slate-50'
                }`}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
              </button>
            </div>
            
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{hotel.address}</p>
          </div>

          <hr className="border-slate-200 dark:border-slate-850" />

          {/* Description Section */}
          <div className="space-y-3">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">About The Estate</h3>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 font-normal">{hotel.description}</p>
          </div>

          {/* AI Review Summarizer Section */}
          <div className="rounded-3xl border border-primary-100/55 dark:border-slate-800 bg-primary-50/10 dark:bg-slate-900/10 p-6 space-y-4 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-600 text-white">
                  <Sparkles className="h-4.5 w-4.5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">AI Guest Review Summary</h3>
                  <span className="block text-4xs text-slate-400">Powered by Google Gemini</span>
                </div>
              </div>
              {reviewSummary && (
                <span className="text-3xs font-extrabold text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-500/10 px-3 py-1 rounded-lg uppercase tracking-wider">
                  {reviewSummary.sentiment}
                </span>
              )}
            </div>
            
            {reviewSummaryLoading ? (
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin text-primary-500" />
                <span>Analyzing review feedback with Gemini...</span>
              </div>
            ) : reviewSummary ? (
              <div className="space-y-4 text-xs">
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium italic border-l-2 border-primary-500 pl-3">
                  "{reviewSummary.summary}"
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="space-y-2">
                    <span className="text-3xs font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 block pl-0.5">Top Merits</span>
                    <ul className="space-y-1.5">
                      {reviewSummary.pros && reviewSummary.pros.map((pro, idx) => (
                        <li key={idx} className="text-slate-600 dark:text-slate-400 flex items-start gap-1.5 font-medium">
                          <Check className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <span className="text-3xs font-extrabold uppercase tracking-widest text-rose-600 dark:text-rose-400 block pl-0.5">Guest Observations</span>
                    <ul className="space-y-1.5">
                      {reviewSummary.cons && reviewSummary.cons.map((con, idx) => (
                        <li key={idx} className="text-slate-600 dark:text-slate-400 flex items-start gap-1.5 font-medium">
                          <span className="text-rose-450 dark:text-rose-400 flex-shrink-0 mt-0.5">•</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">No review analytics currently loaded.</p>
            )}
          </div>

          {/* Amenities Grid */}
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider pl-0.5">What this place offers</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {hotel.amenities.map((amenity, i) => (
                <div key={i} className="flex items-center space-x-2 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/80 text-xs font-semibold text-slate-700 dark:text-slate-350 transition-colors">
                  <Check className="h-4 w-4 text-primary-500" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Map Mockup */}
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider pl-0.5">Location & Neighborhood</h3>
            <div className="rounded-3xl overflow-hidden h-60 bg-slate-100 dark:bg-slate-900 relative border border-slate-200/50 dark:border-slate-800">
              {/* Styling a stylized vector luxury map representation */}
              <div className="absolute inset-0 bg-cover bg-center mix-blend-multiply opacity-55" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80')" }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-primary-950/20 to-transparent"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-3 z-10">
                <div className="bg-primary-600 p-2.5 rounded-full text-white shadow-xl animate-bounce">
                  <MapPin className="h-6 w-6" />
                </div>
                <div className="bg-white/95 dark:bg-[#1E293B]/95 p-3 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-850">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-none">{hotel.name}</h4>
                  <span className="text-3xs text-slate-500 mt-1 block">{hotel.address}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column - Booking widget (Sticky) */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] p-6 shadow-xl dark:shadow-none space-y-5 transition-colors">
            <h3 className="text-sm font-extrabold text-slate-950 dark:text-white uppercase tracking-widest pl-0.5">Configure Stay</h3>
            
            {bookingError && (
              <div className="text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/20 p-3 rounded-xl border border-rose-100 dark:border-rose-950/40 font-medium">
                {bookingError}
              </div>
            )}

            <div className="space-y-4">
              <div className="relative">
                <label className="block text-3xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 pl-0.5">Check-in date</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/60 pl-10 pr-3.5 py-3.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-primary-500 font-semibold"
                  />
                </div>
              </div>
              <div className="relative">
                <label className="block text-3xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 pl-0.5">Check-out date</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/60 pl-10 pr-3.5 py-3.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-primary-500 font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Smart Value Score Box */}
            <div className="pt-4.5 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-3xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Smart Value index</span>
                {valueScoreLoading ? (
                  <Loader2 className="h-4.5 w-4.5 animate-spin text-primary-500" />
                ) : (
                  <span className="rounded-full bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/25 px-2.5 py-0.5 text-3xs font-black text-emerald-700 dark:text-emerald-400">
                    {valueScore ? `${valueScore.score}/100` : 'N/A'}
                  </span>
                )}
              </div>
              {valueScore && (
                <p className="text-3xs text-slate-500 dark:text-slate-400 italic leading-relaxed">
                  "{valueScore.explanation}"
                </p>
              )}
            </div>

          </div>
        </div>
      </div>

      <hr className="border-slate-200 dark:border-slate-850" />

      {/* Rooms Showcase */}
      <div className="space-y-6">
        <div className="space-y-1">
          <span className="text-3xs font-extrabold text-secondary-600 dark:text-secondary-400 uppercase tracking-widest block">Room configuration</span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Available Rooms</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotel.rooms.map((room) => (
            <div key={room.roomNumber} className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all duration-300">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="rounded-lg bg-primary-50 dark:bg-primary-500/10 px-2.5 py-1 text-3xs font-extrabold text-primary-750 dark:text-primary-400 uppercase tracking-wider border border-primary-100/30 dark:border-primary-500/15">
                    {room.type} Suite
                  </span>
                  <span className="text-3xs text-slate-400 font-bold uppercase tracking-widest">Room {room.roomNumber}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-semibold">{room.description}</p>
              </div>

              <div className="bg-slate-50/70 dark:bg-slate-900/60 p-5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-base font-black text-slate-900 dark:text-white">${room.pricePerNight}</span>
                  <span className="text-3xs text-slate-450 dark:text-slate-500 font-semibold uppercase tracking-wider"> / night</span>
                </div>
                <button
                  onClick={() => handleBookRedirect(room.roomNumber)}
                  className="rounded-xl bg-slate-950 dark:bg-slate-800 hover:bg-primary-600 dark:hover:bg-primary-600 px-4 py-2.5 text-2xs font-bold text-white shadow-sm transition-all cursor-pointer"
                >
                  Reserve Room
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Comparison Section */}
      <div className="space-y-6 pt-8 border-t border-slate-200 dark:border-slate-850">
        <div className="flex items-center space-x-3.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Compare with Alternative Stays</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Select a stay to execute a Side-by-side comparative report powered by Gemini.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
          <select
            value={compareHotelId}
            onChange={(e) => setCompareHotelId(e.target.value)}
            className="flex-grow max-w-md rounded-2xl border border-slate-250 dark:border-slate-800 px-4 py-3 text-xs focus:border-indigo-500 focus:outline-none bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-semibold appearance-none cursor-pointer"
          >
            <option value="">-- Select stay to compare --</option>
            {allHotelsList.map(h => (
              <option key={h._id} value={h._id}>{h.name} (${h.rooms && h.rooms.length > 0 ? Math.min(...h.rooms.map(r => r.pricePerNight)) : 120}/night, {h.city})</option>
            ))}
          </select>
          
          <button
            onClick={handleCompare}
            disabled={!compareHotelId || comparisonLoading}
            className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed px-6 py-3 text-xs font-bold text-white shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer select-none"
          >
            {comparisonLoading ? 'Analyzing...' : 'Compare Side-by-Side'}
          </button>
        </div>

        {comparisonLoading && (
          <div className="flex items-center space-x-2 text-xs text-slate-500 py-3 pl-1">
            <Loader2 className="h-4.5 w-4.5 animate-spin text-primary-500" />
            <span>Gemini travel agent is analyzing price details and comparative features...</span>
          </div>
        )}

        {comparisonResult && (
          <div className="bg-slate-50/50 dark:bg-slate-900/10 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {comparisonResult.comparisonGrid?.map((item, idx) => (
                <div key={idx} className="bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 p-5 space-y-4 rounded-2xl shadow-2xs">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-none">{item.name}</h4>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block uppercase font-extrabold tracking-widest text-4xs">Min Price</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">{item.price}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block uppercase font-extrabold tracking-widest text-4xs">Rating</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">★ {Number(item.rating).toFixed(1)}</span>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-slate-400 block uppercase font-extrabold tracking-widest text-4xs mb-1">Amenities</span>
                    <p className="text-3xs text-slate-600 dark:text-slate-350 truncate leading-none font-medium">{item.amenitiesSummary}</p>
                  </div>
                  
                  <div className="bg-indigo-50/40 dark:bg-indigo-950/20 p-3.5 rounded-xl border border-indigo-50/65 dark:border-indigo-950/30">
                    <span className="text-indigo-700 dark:text-indigo-400 text-4xs font-extrabold uppercase tracking-widest block mb-0.5">Key Advantage</span>
                    <p className="text-xs text-slate-650 dark:text-slate-300 leading-normal font-semibold italic">"{item.keyAdvantage}"</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t border-slate-200 dark:border-slate-800/80 pt-5">
              <span className="text-4xs font-extrabold uppercase tracking-widest text-slate-400 block">AI Comparison Summary</span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">{comparisonResult.analysis}</p>
            </div>

            <div className="space-y-3.5">
              <span className="text-4xs font-extrabold uppercase tracking-widest text-slate-400 block pl-0.5">Recommendation Matrix</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(comparisonResult.recommendations || {}).map(([name, desc], idx) => (
                  <div key={idx} className="text-xs bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 rounded-xl p-3.5">
                    <span className="font-bold text-slate-900 dark:text-white block mb-0.5">{name}</span>
                    <span className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800/80 pt-5 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-indigo-700 dark:text-indigo-455 text-4xs font-extrabold uppercase tracking-widest block">AI Smart Winner Pick</span>
                <span className="text-sm font-black text-slate-950 dark:text-white block">{comparisonResult.winner?.name}</span>
                <p className="text-xs text-slate-600 dark:text-slate-300 italic">"{comparisonResult.winner?.reason}"</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Carousel */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 select-none"
          >
            {/* Close button */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Previous Image Chevron */}
            <button
              onClick={() => setLightboxIndex(prev => prev === 0 ? galleryImages.length - 1 : prev - 1)}
              className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Current Image */}
            <div className="max-w-5xl max-h-[80vh] w-full flex flex-col items-center">
              <img 
                src={galleryImages[lightboxIndex]} 
                alt={`${hotel.name} Gallery ${lightboxIndex + 1}`} 
                className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl" 
              />
              <span className="text-white text-xs mt-4 font-bold">Photo {lightboxIndex + 1} of {galleryImages.length}</span>
            </div>

            {/* Next Image Chevron */}
            <button
              onClick={() => setLightboxIndex(prev => prev === galleryImages.length - 1 ? 0 : prev + 1)}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default HotelDetails;
