import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Calendar, Users, SlidersHorizontal, Star, Sparkles, X, Plus, Minus } from 'lucide-react';

const SearchBar = ({ onSearch, initialFilters = {} }) => {
  const [city, setCity] = useState(initialFilters.city || '');
  const [search, setSearch] = useState(initialFilters.search || '');
  const [minPrice, setMinPrice] = useState(initialFilters.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice || '1000');
  const [rating, setRating] = useState(initialFilters.rating || '');
  
  // Advanced Guests / Rooms State
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [showCounterPopover, setShowCounterPopover] = useState(false);

  // Auto suggestions logic
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const popularCities = ['Paris', 'London', 'Tokyo', 'New York'];

  const popoverRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setShowCounterPopover(false);
      }
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleCityChange = (val) => {
    setCity(val);
    if (val.trim()) {
      const filtered = popularCities.filter(c => c.toLowerCase().includes(val.toLowerCase()));
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions(popularCities);
      setShowSuggestions(true);
    }
  };

  const handleSelectSuggestion = (cityVal) => {
    setCity(cityVal);
    setShowSuggestions(false);
  };

  const [selectedAmenities, setSelectedAmenities] = useState(() => {
    if (initialFilters.amenities) {
      return typeof initialFilters.amenities === 'string'
        ? initialFilters.amenities.split(',').filter(Boolean)
        : Array.isArray(initialFilters.amenities)
        ? initialFilters.amenities
        : [];
    }
    return [];
  });

  const handleAmenityToggle = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    onSearch({
      city,
      search,
      minPrice,
      maxPrice: maxPrice === '1000' ? '' : maxPrice,
      rating,
      amenities: selectedAmenities.join(','),
    });
  };

  const handleClear = () => {
    setCity('');
    setSearch('');
    setMinPrice('');
    setMaxPrice('1000');
    setRating('');
    setGuests(2);
    setRooms(1);
    setSelectedAmenities([]);
    onSearch({});
  };

  return (
    <div className="w-full relative">
      <form
        onSubmit={handleSearchSubmit}
        className="w-full rounded-3xl bg-white dark:bg-[#1E293B] p-6 md:p-8 shadow-xl dark:shadow-none border border-slate-200/60 dark:border-slate-800 transition-colors duration-300 space-y-6"
      >
        
        {/* Main Grid Filters */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          
          {/* Keyword Search */}
          <div className="md:col-span-3 space-y-1.5">
            <span className="block text-3xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Where to?</span>
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Hotel keyword or name..."
                className="w-full text-xs bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl pl-10.5 pr-4 py-3.5 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-primary-500 transition-all font-medium"
              />
            </div>
          </div>

          {/* City / Destination with Suggestions */}
          <div ref={suggestionsRef} className="md:col-span-3 space-y-1.5 relative">
            <span className="block text-3xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Destination City</span>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                value={city}
                onChange={(e) => handleCityChange(e.target.value)}
                onFocus={() => {
                  setSuggestions(popularCities.filter(c => c.toLowerCase().includes(city.toLowerCase())));
                  setShowSuggestions(true);
                }}
                placeholder="e.g. Paris, London, Tokyo"
                className="w-full text-xs bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl pl-10.5 pr-4 py-3.5 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-primary-500 transition-all font-medium"
              />
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl z-30 overflow-hidden divide-y divide-slate-50 dark:divide-slate-800/80">
                <span className="block text-4xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-4 py-2 bg-slate-50/55 dark:bg-slate-900/20">Suggestions</span>
                {suggestions.map((c, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSelectSuggestion(c)}
                    className="w-full text-left px-4 py-2.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 font-semibold transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Budget Range Slider */}
          <div className="md:col-span-3 space-y-1.5">
            <div className="flex justify-between items-center text-3xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">
              <span>Budget per night</span>
              <span className="text-primary-600 dark:text-primary-400 font-black">Up to ${maxPrice}</span>
            </div>
            <div className="px-1 py-1">
              <input
                type="range"
                min="50"
                max="1000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary-600 dark:accent-primary-400"
              />
              <div className="flex justify-between text-4xs font-bold text-slate-400 dark:text-slate-500 mt-1">
                <span>$50</span>
                <span>$1000+</span>
              </div>
            </div>
          </div>

          {/* Guests & Rooms Selector */}
          <div ref={popoverRef} className="md:col-span-3 space-y-1.5 relative">
            <span className="block text-3xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Guests & Rooms</span>
            <button
              type="button"
              onClick={() => setShowCounterPopover(!showCounterPopover)}
              className="w-full text-left text-xs bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-primary-500 transition-all font-semibold flex items-center justify-between cursor-pointer select-none"
            >
              <div className="flex items-center gap-2">
                <Users className="h-4.5 w-4.5 text-slate-400 dark:text-slate-500" />
                <span>{guests} Guests, {rooms} Room{rooms > 1 ? 's' : ''}</span>
              </div>
              <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {/* Counter Popover */}
            {showCounterPopover && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl z-30 p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Guests</span>
                    <span className="block text-4xs text-slate-400 dark:text-slate-500">Number of adult guests</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={guests <= 1}
                      onClick={() => setGuests(prev => Math.max(1, prev - 1))}
                      className="h-7 w-7 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-xs font-bold text-slate-800 dark:text-white">{guests}</span>
                    <button
                      type="button"
                      onClick={() => setGuests(prev => prev + 1)}
                      className="h-7 w-7 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800/80 pt-3.5">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Rooms</span>
                    <span className="block text-4xs text-slate-400 dark:text-slate-500">Suite bookings needed</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={rooms <= 1}
                      onClick={() => setRooms(prev => Math.max(1, prev - 1))}
                      className="h-7 w-7 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-xs font-bold text-slate-800 dark:text-white">{rooms}</span>
                    <button
                      type="button"
                      onClick={() => setRooms(prev => prev + 1)}
                      className="h-7 w-7 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Bottom Expandable filters: Ratings, Amenities */}
        <div className="border-t border-slate-100 dark:border-slate-800/80 pt-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Minimum Stars */}
          <div className="lg:col-span-3 space-y-1.5">
            <span className="block text-3xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Min Star Rating</span>
            <div className="flex gap-1.5">
              {[2, 3, 4, 5].map((stars) => (
                <button
                  key={stars}
                  type="button"
                  onClick={() => setRating(rating === String(stars) ? '' : String(stars))}
                  className={`flex-1 py-2 text-2xs font-extrabold border rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    rating === String(stars)
                      ? 'bg-primary-600 border-primary-600 text-white shadow-md shadow-primary-500/10'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  <Star className={`h-3 w-3 ${rating === String(stars) ? 'text-white fill-white' : 'text-slate-400'}`} />
                  {stars}+
                </button>
              ))}
            </div>
          </div>

          {/* Amenities Selector */}
          <div className="lg:col-span-9 space-y-1.5">
            <span className="block text-3xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Filter by luxury amenities</span>
            <div className="flex flex-wrap gap-2">
              {['Wifi', 'Spa', 'Pool', 'Restaurant', 'Gym', 'Bar', 'Room Service'].map((amenity) => {
                const isSelected = selectedAmenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => handleAmenityToggle(amenity)}
                    className={`px-3.5 py-2 text-3xs font-extrabold rounded-full border transition-all cursor-pointer select-none ${
                      isSelected
                        ? 'bg-secondary-600 border-secondary-600 text-white shadow-md shadow-secondary-500/10'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    {amenity}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Search Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <div className="hidden sm:flex items-center gap-1.5 text-3xs font-bold text-slate-400 dark:text-slate-500">
            <Sparkles className="h-4 w-4 text-secondary-500 animate-pulse" />
            <span>Refine your luxury search options dynamically</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleClear}
              className="flex-1 sm:flex-none text-center rounded-2xl border border-slate-200 dark:border-slate-800 px-6 py-3.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
            <button
              type="submit"
              className="flex-1 sm:flex-none text-center rounded-2xl bg-gradient-to-r from-primary-600 to-indigo-600 px-8 py-3.5 text-xs font-bold text-white shadow-lg shadow-primary-500/20 hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 cursor-pointer active:translate-y-0"
            >
              Search Stays
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};

export default SearchBar;
