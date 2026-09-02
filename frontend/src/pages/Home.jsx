import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Compass, ShieldAlert, Award, MessageSquare, ArrowRight, Heart, Star } from 'lucide-react';
import SearchBar from '../components/SearchBar';

const AnimatedCounter = ({ value, label }) => {
  const [count, setCount] = useState(0);
  const isDecimal = value.includes('.');
  
  useEffect(() => {
    const end = parseFloat(value.replace(/[^\d.]/g, ''));
    if (isNaN(end)) return;
    const steps = 50;
    const stepValue = end / steps;
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(currentStep * stepValue);
      }
    }, 25);
    return () => clearInterval(timer);
  }, [value]);

  const displayVal = isDecimal ? count.toFixed(1) : Math.round(count);
  const suffix = value.includes('+') ? '+' : value.includes('★') ? '★' : '';

  return (
    <div className="text-center p-4">
      <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
        {displayVal}{suffix}
      </h3>
      <p className="text-3xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
        {label}
      </p>
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();

  const handleSearch = (searchParams) => {
    const query = new URLSearchParams();
    if (searchParams.search) query.append('search', searchParams.search);
    if (searchParams.city) query.append('city', searchParams.city);
    if (searchParams.minPrice) query.append('minPrice', searchParams.minPrice);
    if (searchParams.maxPrice) query.append('maxPrice', searchParams.maxPrice);
    if (searchParams.rating) query.append('rating', searchParams.rating);
    if (searchParams.amenities) query.append('amenities', searchParams.amenities);

    navigate(`/hotels?${query.toString()}`);
  };

  const destinations = [
    {
      name: 'Paris',
      country: 'France',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
      description: 'The City of Lights'
    },
    {
      name: 'London',
      country: 'United Kingdom',
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80',
      description: 'Classic & Royal charm'
    },
    {
      name: 'New York',
      country: 'United States',
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80',
      description: 'The city that never sleeps'
    },
    {
      name: 'Tokyo',
      country: 'Japan',
      image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
      description: 'Futuristic meets tradition'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Jenkins',
      role: 'Luxury Travel Blogger',
      quote: 'StaySmart completely changed how I find premium accommodations. The AI match score predicted exactly the amenities I needed!',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80'
    },
    {
      name: 'David Chen',
      role: 'VP of Product',
      quote: 'The side-by-side comparison saved me hours of tabs-switching. Review summaries are spot-on with pros and cons.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'
    }
  ];

  return (
    <div className="pb-20 bg-[#F8FAFC] dark:bg-[#0F172A] transition-colors duration-300">
      
      {/* Hero Header Section */}
      <div className="relative min-h-[92vh] flex items-center justify-center py-28 px-4 sm:px-6 lg:px-8 bg-slate-950 text-white overflow-hidden">
        
        {/* Immersive background image slider */}
        <div 
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-30 select-none pointer-events-none scale-105 animate-pulse" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=85')" }}
        />
        
        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-slate-950/70 to-slate-950/45" />

        {/* Hero Content */}
        <div className="relative max-w-4xl text-center space-y-8 z-10 flex flex-col items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2.5 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-md px-4 py-1.5 text-2xs font-extrabold tracking-widest text-white border border-white/15 uppercase"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>Discover Luxury Travel Redefined</span>
          </motion.div>

          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-6xl font-black tracking-tight leading-tight"
            >
              Stay Smarter.<br />
              <span className="bg-gradient-to-r from-primary-400 via-indigo-400 to-secondary-400 bg-clip-text text-transparent">
                Discover Your Perfect Stay.
              </span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-300 font-medium leading-relaxed"
            >
              Find luxury hotels powered by AI recommendations, personalized search index parameters, and seamless checkouts.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap gap-4 items-center justify-center"
          >
            <button
              onClick={() => navigate('/hotels')}
              className="rounded-2xl bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 px-8 py-3.5 text-xs font-bold text-white shadow-lg shadow-primary-500/25 hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              Explore Hotels
            </button>
            <button
              onClick={() => window.dispatchEvent(new Event('openAiConcierge'))}
              className="rounded-2xl border border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-xs px-8 py-3.5 text-xs font-bold text-white transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="h-4 w-4 text-amber-300 fill-amber-300/20" />
              Ask AI Concierge
            </button>
          </motion.div>

          {/* SearchBar Overlay */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="pt-6 w-full max-w-3.5xl mx-auto text-slate-800"
          >
            <SearchBar onSearch={handleSearch} />
          </motion.div>
        </div>
      </div>

      {/* Animated statistics row */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 mb-20">
        <div className="rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-150 dark:divide-slate-800 transition-colors duration-300">
          <AnimatedCounter value="50K+" label="Premium Hotels" />
          <AnimatedCounter value="120+" label="Countries Covered" />
          <AnimatedCounter value="1M+" label="Successful Bookings" />
          <AnimatedCounter value="4.9★" label="Customer Rating" />
        </div>
      </div>

      {/* Featured Destinations */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10 mb-24">
        <div className="text-center space-y-2">
          <span className="text-3xs font-extrabold text-primary-600 dark:text-primary-400 uppercase tracking-widest block">Trending Spots</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Popular Destinations</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">Discover stunning locations globally, handpicked by thousands of premium travelers monthly.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((dest, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6 }}
              onClick={() => handleSearch({ city: dest.name })}
              className="group cursor-pointer relative aspect-square rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-800/80"
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white space-y-1">
                <span className="text-3xs font-extrabold text-primary-400 uppercase tracking-widest block">{dest.country}</span>
                <h3 className="text-lg font-bold tracking-tight">{dest.name}</h3>
                <p className="text-3xs text-slate-300 font-medium">{dest.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Value Proposition Section */}
      <div className="bg-slate-100/40 dark:bg-slate-900/30 border-y border-slate-200/40 dark:border-slate-800/80 py-20 mb-20 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-2">
            <span className="text-3xs font-extrabold text-secondary-600 dark:text-secondary-400 uppercase tracking-widest block">Verified Features</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Why Book with StaySmart</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">Experience hotel discovery and reservations through cutting-edge technology and verified reviews.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Value card 1 */}
            <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-8 border border-slate-100 dark:border-slate-800/80 shadow-xs hover:shadow-md transition-all duration-300 space-y-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400">
                <Compass className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">AI Concierge & Matches</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                  Our embedded assistant helps resolve long search iterations by curating listings custom to your travel requests.
                </p>
              </div>
            </div>

            {/* Value card 2 */}
            <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-8 border border-slate-100 dark:border-slate-800/80 shadow-xs hover:shadow-md transition-all duration-300 space-y-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Award className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Luxury Comfort Standard</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                  All properties undergo regular audits. Review summaries are automatically compiled so you always get the ground truth.
                </p>
              </div>
            </div>

            {/* Value card 3 */}
            <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-8 border border-slate-100 dark:border-slate-800/80 shadow-xs hover:shadow-md transition-all duration-300 space-y-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Smart Value Score</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                  We balance reviews, amenities, and starting rates dynamically to award each hotel a 1-100 value-for-money metric.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Testimonials Carousel */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-3xs font-extrabold text-primary-600 dark:text-primary-400 uppercase tracking-widest block">Client Reviews</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">What Travel Experts Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((test, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 rounded-3xl p-6.5 shadow-sm space-y-4 transition-colors"
            >
              <div className="flex items-center gap-3">
                <img src={test.avatar} alt={test.name} className="h-10 w-10 rounded-full object-cover" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{test.name}</h4>
                  <span className="text-3xs text-slate-450 dark:text-slate-500 font-medium block">{test.role}</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal italic">
                "{test.quote}"
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Home;
