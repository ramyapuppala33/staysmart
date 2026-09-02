import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  Star, MapPin, Sparkles, Check, AlertTriangle, ArrowLeft, Heart, 
  User, Mail, Phone, MessageSquare, CreditCard, Wallet, Landmark, 
  ArrowRight, ShieldCheck, HelpCircle, Shield, Award, Calendar, Flame, Coffee, Wifi, Tv, Compass
} from 'lucide-react';

const Booking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success: toastSuccess, warning: toastWarning } = useToast();

  const hotelId = searchParams.get('hotelId');
  const roomNumber = searchParams.get('roomNumber');
  const checkInStr = searchParams.get('checkIn');
  const checkOutStr = searchParams.get('checkOut');

  const [hotel, setHotel] = useState(null);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [warning, setWarning] = useState(null);
  const [successBooking, setSuccessBooking] = useState(null);
  
  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isSaved, setIsSaved] = useState(false);

  // Nights calculation
  const checkIn = new Date(checkInStr);
  const checkOut = new Date(checkOutStr);
  const diffTime = Math.abs(checkOut - checkIn);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

  // Pre-fill user data when user changes
  useEffect(() => {
    if (user) {
      const names = user.name ? user.name.split(' ') : ['', ''];
      setFirstName(names[0] || '');
      setLastName(names.slice(1).join(' ') || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const fallbackHotels = [
    {
      _id: 'mock1',
      name: 'Grand Hyatt Plaza',
      address: '12 Avenue des Champs-Élysées',
      city: 'Paris',
      country: 'France',
      rating: 4.8,
      numReviews: 240,
      amenities: ['Free WiFi', 'Pool', 'Fitness Center', 'Spa', 'Restaurant'],
      rooms: [
        { roomNumber: '101', type: 'Single', pricePerNight: 120, description: 'Comfortable queen size bed with courtyard view.' },
        { roomNumber: '102', type: 'Double', pricePerNight: 210, description: 'Spacious room with king bed and smart amenities.' },
        { roomNumber: '201', type: 'Suite', pricePerNight: 450, description: 'Luxury apartment layout with Eiffel view.' }
      ]
    },
    {
      _id: 'mock2',
      name: 'The Ritz Carlton Suite',
      address: 'Central Park South 50',
      city: 'New York',
      country: 'United States',
      rating: 4.9,
      numReviews: 310,
      amenities: ['Free WiFi', 'Fitness Center', 'Spa', 'Rooftop Bar', 'Room Service'],
      rooms: [
        { roomNumber: '401', type: 'Double', pricePerNight: 280, description: 'Double twin beds with standard park overview.' },
        { roomNumber: '501', type: 'Deluxe', pricePerNight: 550, description: 'Panoramic high-rise view with king bed.' }
      ]
    }
  ];

  useEffect(() => {
    if (!hotelId || !roomNumber) {
      setError('Invalid booking parameters. Please return to hotel page.');
      setLoading(false);
      return;
    }

    const fetchBookingDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`/api/hotels/${hotelId}`);
        const foundHotel = res.data;
        const foundRoom = foundHotel.rooms.find((r) => r.roomNumber === roomNumber);

        setHotel(foundHotel);
        setRoom(foundRoom);
      } catch (err) {
        console.error('API Error, using fallback data', err);
        const match = fallbackHotels.find((h) => h._id === hotelId);
        if (match) {
          const matchedRoom = match.rooms.find((r) => r.roomNumber === roomNumber);
          setHotel(match);
          setRoom(matchedRoom);
          setWarning('Offline checkout mode: Details loaded from local demo stays.');
        } else {
          setError('Could not fetch hotel information for booking checkout.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [hotelId, roomNumber]);

  const validateForm = () => {
    const errors = {};
    if (!firstName.trim()) errors.firstName = 'First name is required';
    if (!lastName.trim()) errors.lastName = 'Last name is required';
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!phone.trim()) errors.phone = 'Phone number is required';
    if (!agreeTerms) errors.agreeTerms = 'You must agree to the terms to proceed';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleConfirmBooking = async () => {
    if (!validateForm()) {
      toastWarning('Please correct the validation errors in the form.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    const payload = {
      hotelId,
      roomNumber,
      checkInDate: checkInStr,
      checkOutDate: checkOutStr,
    };

    try {
      const res = await axios.post('/api/bookings', payload);
      setSuccessBooking(res.data);
      toastSuccess('Booking confirmed successfully! ✈️');
    } catch (err) {
      console.error('API booking submission failed.', err);
      const errMsg = err.response?.data?.message || 'Booking submission failed. Please try again.';
      setSubmitError(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveForLater = () => {
    setIsSaved(!isSaved);
    if (!isSaved) {
      toastSuccess('Stay saved to your list! 💖');
    } else {
      toastSuccess('Stay removed from saved list.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
        <span className="text-xs font-semibold text-slate-500 animate-pulse">Preparing your premium reservation details...</span>
      </div>
    );
  }

  if (error || !hotel || !room) {
    return (
      <div className="mx-auto max-w-xl text-center py-20 space-y-4">
        <AlertTriangle className="h-12 w-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Checkout Error</h2>
        <p className="text-xs text-slate-500">{error || 'Booking credentials invalid.'}</p>
        <button
          onClick={() => navigate('/hotels')}
          className="rounded-xl bg-primary-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-primary-700 transition-colors cursor-pointer"
        >
          Back to Hotels
        </button>
      </div>
    );
  }

  const subtotal = diffDays * room.pricePerNight;
  const taxes = Math.round(subtotal * 0.12);
  const serviceFee = Math.round(subtotal * 0.05);
  const discount = Math.round(subtotal * 0.10);
  const grandTotal = subtotal + taxes + serviceFee - discount;

  // Room details mapping based on type
  const roomImage = room.type === 'Suite' 
    ? 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=600&q=80'
    : room.type === 'Deluxe'
    ? 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80'
    : room.type === 'Double'
    ? 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=600&q=80'
    : 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80';

  const roomSpecs = {
    Suite: { beds: '1 King Bed & 1 Queen Bed', occupancy: '4 Guests', size: '68 sqm' },
    Deluxe: { beds: '1 King Bed', occupancy: '2 Guests', size: '45 sqm' },
    Double: { beds: '2 Queen Beds', occupancy: '2 Guests', size: '32 sqm' },
    Single: { beds: '1 Queen Bed', occupancy: '1 Guest', size: '24 sqm' }
  }[room.type] || { beds: '1 Queen Bed', occupancy: '2 Guests', size: '30 sqm' };

  // AI Score Calculation (pseudo-random based on hotel ID for authenticity)
  const aiScore = (hotelId.charCodeAt(hotelId.length - 1) % 10) + 89;

  if (successBooking) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border border-emerald-100 bg-white dark:bg-slate-900 p-8 text-center shadow-xl space-y-6"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500">
            <Check className="h-10 w-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Booking Confirmed!</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Your reservation details have been successfully secured.</p>
          </div>

          <div className="rounded-2xl bg-slate-50 dark:bg-slate-950/60 p-6 text-left text-xs space-y-3.5 border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between">
              <span className="text-slate-400">Confirmation ID:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300 uppercase">{successBooking.booking?._id?.substring(0, 12) || 'SS' + Math.floor(100000 + Math.random() * 900000)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Hotel:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{hotel.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Room:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{roomNumber} ({room.type})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Guest Name:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{firstName} {lastName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Stay Duration:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{diffDays} nights ({checkInStr} to {checkOutStr})</span>
            </div>
            <div className="flex justify-between border-t border-slate-200/60 dark:border-slate-800 pt-3">
              <span className="text-slate-500 font-semibold">Total Price Paid:</span>
              <span className="font-extrabold text-slate-950 dark:text-white text-sm">${grandTotal}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => navigate('/profile')}
              className="w-full rounded-xl bg-slate-950 dark:bg-primary-600 hover:bg-slate-900 dark:hover:bg-primary-700 px-4 py-3 text-xs font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
            >
              View My Bookings
            </button>
            <button
              onClick={() => navigate('/hotels')}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
            >
              Browse Other Stays
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 font-sans">
      
      {/* Back navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5">
          <button 
            onClick={() => navigate(`/hotels/${hotelId}`)}
            className="group flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Hotel Details</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white tracking-tight">
            Review & Confirm Stay
          </h1>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center space-x-2 text-3xs font-bold uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-900/60 p-2 rounded-2xl border border-slate-200/40 dark:border-slate-800/40">
          <span className="text-emerald-500">Select</span>
          <span>&rarr;</span>
          <span className="text-emerald-500">Suite</span>
          <span>&rarr;</span>
          <span className="text-primary-500 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-lg shadow-xs">Checkout</span>
          <span>&rarr;</span>
          <span>Receipt</span>
        </div>
      </div>

      {warning && (
        <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 p-4 text-amber-800 dark:text-amber-300 text-xs flex items-center space-x-2.5">
          <AlertTriangle className="h-4.5 w-4.5 text-amber-600 flex-shrink-0" />
          <span className="font-medium">{warning}</span>
        </div>
      )}

      {submitError && (
        <div className="rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/30 p-4 text-red-800 dark:text-red-300 text-xs flex items-center space-x-2.5">
          <AlertTriangle className="h-4.5 w-4.5 text-red-600 flex-shrink-0" />
          <span className="font-medium">{submitError}</span>
        </div>
      )}

      {/* Two-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Detail Cards & Forms */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Hotel Information Card */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-[#0b0f19] p-6 shadow-xs space-y-5"
          >
            <h3 className="text-sm font-extrabold text-slate-950 dark:text-white uppercase tracking-widest border-b border-slate-100 dark:border-slate-800/80 pb-3 flex items-center gap-1.5">
              <ShieldCheck className="h-4.5 w-4.5 text-primary-500" />
              <span>Stay Details</span>
            </h3>
            
            <div className="flex flex-col sm:flex-row gap-5">
              {hotel.images && hotel.images[0] ? (
                <img 
                  src={hotel.images[0]} 
                  alt={hotel.name} 
                  className="w-full sm:w-48 h-32 object-cover rounded-2xl"
                />
              ) : (
                <div className="w-full sm:w-48 h-32 bg-slate-100 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-400 text-xs font-semibold">
                  No Image Available
                </div>
              )}
              
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center space-x-0.5 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3.5 w-3.5 ${i < Math.floor(hotel.rating || 5) ? 'fill-current' : ''}`} />
                    ))}
                  </div>
                  <span className="text-2xs font-extrabold bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    <span>{aiScore}% AI Match Score</span>
                  </span>
                </div>

                <h4 className="text-base font-black text-slate-900 dark:text-white">{hotel.name}</h4>
                
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  <span>{hotel.address}, {hotel.city}, {hotel.country}</span>
                </p>

                {/* Micro cancellation terms & tags */}
                <div className="flex flex-wrap gap-2 pt-1.5">
                  <span className="text-3xs font-extrabold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-md border border-emerald-100/50 dark:border-emerald-900/30 uppercase tracking-widest">
                    Free Cancellation
                  </span>
                  <span className="text-3xs font-extrabold bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 px-2.5 py-1 rounded-md border border-indigo-100/50 dark:border-indigo-900/30 uppercase tracking-widest">
                    Pay at Stay Available
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Selected Room Card */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-[#0b0f19] p-6 shadow-xs space-y-5"
          >
            <h3 className="text-sm font-extrabold text-slate-950 dark:text-white uppercase tracking-widest border-b border-slate-100 dark:border-slate-800/80 pb-3 flex items-center gap-1.5">
              <Award className="h-4.5 w-4.5 text-indigo-500" />
              <span>Selected Accommodation</span>
            </h3>

            <div className="flex flex-col sm:flex-row gap-5">
              <img 
                src={roomImage} 
                alt={room.type} 
                className="w-full sm:w-48 h-32 object-cover rounded-2xl"
              />
              
              <div className="flex-1 space-y-3.5">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-black text-slate-950 dark:text-white">{room.type} Suite</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{room.description}</p>
                  </div>
                  <span className="rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/40 dark:border-slate-700/40 px-2.5 py-1 text-2xs text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider">
                    Room {roomNumber}
                  </span>
                </div>

                {/* Suite Specifications Grid */}
                <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-100 dark:border-slate-900/60 text-center text-3xs uppercase tracking-wider font-extrabold text-slate-500">
                  <div className="space-y-0.5">
                    <span className="block text-slate-400">Bed Type</span>
                    <span className="block text-slate-800 dark:text-slate-300 truncate">{roomSpecs.beds}</span>
                  </div>
                  <div className="space-y-0.5 border-x border-slate-200 dark:border-slate-800/80">
                    <span className="block text-slate-400">Max Guests</span>
                    <span className="block text-slate-800 dark:text-slate-300">{roomSpecs.occupancy}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="block text-slate-400">Room Size</span>
                    <span className="block text-slate-800 dark:text-slate-300">{roomSpecs.size}</span>
                  </div>
                </div>

                {/* Included Amenities */}
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-2xs font-semibold text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1.5"><Wifi className="h-3.5 w-3.5 text-primary-500" /> Free WiFi</span>
                  <span className="flex items-center gap-1.5"><Coffee className="h-3.5 w-3.5 text-amber-500" /> Free Breakfast</span>
                  <span className="flex items-center gap-1.5"><Tv className="h-3.5 w-3.5 text-indigo-500" /> Smart TV</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Guest Information Form */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-[#0b0f19] p-6 shadow-xs space-y-5"
          >
            <h3 className="text-sm font-extrabold text-slate-950 dark:text-white uppercase tracking-widest border-b border-slate-100 dark:border-slate-800/80 pb-3 flex items-center gap-1.5">
              <User className="h-4.5 w-4.5 text-primary-500" />
              <span>Guest Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-2xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 pl-0.5">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      if (formErrors.firstName) setFormErrors({ ...formErrors, firstName: null });
                    }}
                    placeholder="Enter first name"
                    className={`w-full text-xs bg-slate-50/60 dark:bg-slate-950/40 border ${formErrors.firstName ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-800 focus:border-primary-500'} rounded-xl pl-9 pr-3.5 py-3 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:bg-white dark:focus:bg-[#0d1321] transition-all`}
                  />
                </div>
                {formErrors.firstName && <p className="text-3xs text-red-500 font-bold mt-1 pl-1">{formErrors.firstName}</p>}
              </div>

              <div>
                <label className="block text-2xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 pl-0.5">Last Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      if (formErrors.lastName) setFormErrors({ ...formErrors, lastName: null });
                    }}
                    placeholder="Enter last name"
                    className={`w-full text-xs bg-slate-50/60 dark:bg-slate-950/40 border ${formErrors.lastName ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-800 focus:border-primary-500'} rounded-xl pl-9 pr-3.5 py-3 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:bg-white dark:focus:bg-[#0d1321] transition-all`}
                  />
                </div>
                {formErrors.lastName && <p className="text-3xs text-red-500 font-bold mt-1 pl-1">{formErrors.lastName}</p>}
              </div>

              <div>
                <label className="block text-2xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 pl-0.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (formErrors.email) setFormErrors({ ...formErrors, email: null });
                    }}
                    placeholder="name@example.com"
                    className={`w-full text-xs bg-slate-50/60 dark:bg-slate-950/40 border ${formErrors.email ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-800 focus:border-primary-500'} rounded-xl pl-9 pr-3.5 py-3 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:bg-white dark:focus:bg-[#0d1321] transition-all`}
                  />
                </div>
                {formErrors.email && <p className="text-3xs text-red-500 font-bold mt-1 pl-1">{formErrors.email}</p>}
              </div>

              <div>
                <label className="block text-2xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 pl-0.5">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (formErrors.phone) setFormErrors({ ...formErrors, phone: null });
                    }}
                    placeholder="+1 (555) 000-0000"
                    className={`w-full text-xs bg-slate-50/60 dark:bg-slate-950/40 border ${formErrors.phone ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-800 focus:border-primary-500'} rounded-xl pl-9 pr-3.5 py-3 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:bg-white dark:focus:bg-[#0d1321] transition-all`}
                  />
                </div>
                {formErrors.phone && <p className="text-3xs text-red-500 font-bold mt-1 pl-1">{formErrors.phone}</p>}
              </div>
            </div>
          </motion.div>

          {/* Special Requests */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-[#0b0f19] p-6 shadow-xs space-y-4"
          >
            <h3 className="text-sm font-extrabold text-slate-950 dark:text-white uppercase tracking-widest border-b border-slate-100 dark:border-slate-800/80 pb-3 flex items-center gap-1.5">
              <MessageSquare className="h-4.5 w-4.5 text-indigo-500" />
              <span>Special Requests</span>
            </h3>

            <div className="relative">
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="E.g., High floor, single bedding, extra pillows, early check-in. (We will convey this to the hotel staff)"
                rows={3}
                className="w-full text-xs bg-slate-50/60 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-3 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:bg-white dark:focus:bg-[#0d1321] transition-all resize-none"
              />
            </div>
          </motion.div>

          {/* Payment Method Section */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-[#0b0f19] p-6 shadow-xs space-y-5"
          >
            <h3 className="text-sm font-extrabold text-slate-950 dark:text-white uppercase tracking-widest border-b border-slate-100 dark:border-slate-800/80 pb-3 flex items-center gap-1.5">
              <CreditCard className="h-4.5 w-4.5 text-primary-500" />
              <span>Select Payment Method</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { id: 'card', label: 'Credit Card', icon: CreditCard },
                { id: 'upi', label: 'UPI Sync', icon: Compass },
                { id: 'netbanking', label: 'Net Banking', icon: Landmark },
                { id: 'cash', label: 'At Hotel', icon: Shield },
                { id: 'wallet', label: 'Wallet Pay', icon: Wallet }
              ].map((method) => {
                const Icon = method.icon;
                const active = paymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                      active 
                        ? 'border-primary-500 bg-primary-500/5 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 shadow-xs' 
                        : 'border-slate-200 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/20 text-slate-500 hover:text-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <Icon className="h-5 w-5 mb-1.5" />
                    <span className="text-3xs font-extrabold tracking-wider uppercase">{method.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Simulated secure trust seal */}
            <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-100 dark:border-slate-900/60 text-3xs font-bold text-slate-400 uppercase tracking-widest">
              <ShieldCheck className="h-4.5 w-4.5 text-emerald-500" />
              <span>SSL Secure 256-Bit Encrypted Transaction Protection</span>
            </div>
          </motion.div>

          {/* Terms & Agreement */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-[#0b0f19] p-6 shadow-xs space-y-4"
          >
            <div className="flex items-start space-x-3">
              <input
                id="agree-terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => {
                  setAgreeTerms(e.target.checked);
                  if (formErrors.agreeTerms) setFormErrors({ ...formErrors, agreeTerms: null });
                }}
                className="h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-primary-600 focus:ring-primary-500 mt-0.5 cursor-pointer"
              />
              <label htmlFor="agree-terms" className="text-2xs font-semibold text-slate-500 dark:text-slate-400 leading-normal cursor-pointer select-none">
                By ticking this box, I acknowledge that I have read, understood, and agree to StaySmart's <span className="text-primary-500 hover:underline">Terms of Service</span>, <span className="text-primary-500 hover:underline">Privacy Policy</span>, and the specific hotel's cancellation policies.
              </label>
            </div>
            {formErrors.agreeTerms && <p className="text-3xs text-red-500 font-bold pl-7">{formErrors.agreeTerms}</p>}
          </motion.div>
        </div>

        {/* Right Side: Sticky summary card */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0b0f19] shadow-lg shadow-slate-100/50 dark:shadow-none overflow-hidden"
          >
            {/* Header image on Summary Card */}
            <div className="relative h-36">
              <img 
                src={hotel.images && hotel.images[0] ? hotel.images[0] : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'} 
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="inline-block text-3xs font-extrabold bg-primary-600/95 text-white px-2 py-0.5 rounded-md uppercase tracking-widest mb-1 shadow-sm">
                  {room.type} Room
                </span>
                <h4 className="text-xs font-black truncate">{hotel.name}</h4>
                <p className="text-3xs text-slate-200 truncate flex items-center space-x-0.5 mt-0.5">
                  <MapPin className="h-3 w-3 text-slate-300" />
                  <span>{hotel.city}, {hotel.country}</span>
                </p>
              </div>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <h3 className="text-2xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800/80 pb-2">
                Booking Details
              </h3>

              {/* Stay summaries */}
              <div className="space-y-3 font-semibold text-slate-600 dark:text-slate-400">
                <div className="flex justify-between items-center text-slate-800 dark:text-slate-200">
                  <span className="text-2xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Stay duration</span>
                  <span className="font-extrabold">{diffDays} Nights</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-950/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-900/60">
                  <div className="space-y-0.5 text-center">
                    <span className="block text-4xs uppercase font-extrabold text-slate-400">Check-In</span>
                    <span className="block text-2xs font-extrabold text-slate-800 dark:text-slate-200">{checkInStr}</span>
                  </div>
                  <div className="space-y-0.5 text-center border-l border-slate-200 dark:border-slate-800">
                    <span className="block text-4xs uppercase font-extrabold text-slate-400">Check-Out</span>
                    <span className="block text-2xs font-extrabold text-slate-800 dark:text-slate-200">{checkOutStr}</span>
                  </div>
                </div>
              </div>

              <h3 className="text-2xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800/80 pt-2 pb-2">
                Price Breakdown
              </h3>

              {/* Bill Details */}
              <div className="space-y-2.5 text-slate-500 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Base Rate ({diffDays} nights):</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">${subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes (12%):</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">${taxes}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Fee (5%):</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">${serviceFee}</span>
                </div>
                <div className="flex justify-between text-emerald-500 dark:text-emerald-400 font-bold">
                  <span>Special Discount (10%):</span>
                  <span>-${discount}</span>
                </div>
                
                <hr className="border-slate-100 dark:border-slate-800/80 my-2" />
                
                <div className="flex justify-between items-center text-slate-900 dark:text-white pt-1">
                  <span className="text-2xs font-extrabold uppercase tracking-widest">Total Price</span>
                  <span className="text-base font-black text-slate-950 dark:text-white">${grandTotal}</span>
                </div>
              </div>

              {/* Confirm Booking Primary Action */}
              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleConfirmBooking}
                  disabled={submitting}
                  className="w-full flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-primary-600 via-indigo-600 to-secondary-500 hover:from-primary-700 hover:to-secondary-600 px-6 py-4 text-xs font-bold text-white shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Processing booking...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm Booking</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Secondary Actions */}
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => navigate(`/hotels/${hotelId}`)}
              className="col-span-3 flex items-center justify-center space-x-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-[#0b0f19] px-4 py-3 text-2xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Stay Details</span>
            </button>

            <button
              onClick={handleSaveForLater}
              title={isSaved ? "Saved to List" : "Save for Later"}
              className={`flex items-center justify-center rounded-2xl border transition-all cursor-pointer ${
                isSaved 
                  ? 'border-rose-100 bg-rose-50 dark:bg-rose-950/20 text-rose-500' 
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0f19] text-slate-400 hover:text-rose-500 hover:border-rose-200'
              }`}
            >
              <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
