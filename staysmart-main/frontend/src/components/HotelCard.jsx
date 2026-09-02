import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Star, ChevronLeft, ChevronRight, Sparkles, ShieldCheck, MapPin } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const HotelCard = ({ hotel }) => {
  const { success, info } = useToast();
  const navigate = useNavigate();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Fallback images
  const defaultImages = [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=600&q=80'
  ];

  const images = hotel.images && hotel.images.length > 0 ? hotel.images : defaultImages;

  // Initialize wishlist status from localStorage
  useEffect(() => {
    const list = JSON.parse(localStorage.getItem('staySmartWishlist')) || [];
    setIsWishlisted(list.includes(hotel._id));
  }, [hotel._id]);

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    let list = JSON.parse(localStorage.getItem('staySmartWishlist')) || [];
    if (list.includes(hotel._id)) {
      list = list.filter(id => id !== hotel._id);
      setIsWishlisted(false);
      info(`Removed ${hotel.name} from Wishlist`);
    } else {
      list.push(hotel._id);
      setIsWishlisted(true);
      success(`Added ${hotel.name} to Wishlist! ❤️`);
    }
    localStorage.setItem('staySmartWishlist', JSON.stringify(list));
    // Dispatch a custom storage event so other components (like Profile) can sync
    window.dispatchEvent(new Event('wishlistUpdated'));
  };

  const handleNextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handlePrevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // Find minimum price among rooms
  const minPrice = hotel.rooms && hotel.rooms.length > 0
    ? Math.min(...hotel.rooms.map(room => room.pricePerNight))
    : 120;

  // Render dummy discount / match badges
  const dummyMatchScore = Math.floor(Math.random() * 15) + 85; // 85% to 99%
  const hasDiscount = minPrice > 200; // Mock discount badge on premium stays

  return (
    <div 
      className="group bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800/80 rounded-3xl overflow-hidden hover-lift flex flex-col h-full transition-colors duration-300 relative shadow-sm hover:shadow-xl dark:shadow-none"
      onClick={() => navigate(`/hotels/${hotel._id}`)}
    >
      {/* Hotel Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50 dark:bg-[#0F172A] select-none">
        <img
          src={images[activeImageIndex]}
          alt={hotel.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          onError={(e) => {
            e.target.src = defaultImages[0];
          }}
        />

        {/* Wishlist Heart Toggle */}
        <button
          onClick={toggleWishlist}
          className="absolute top-4 right-4 h-9 w-9 flex items-center justify-center rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs text-slate-500 hover:text-rose-500 transition-colors shadow-sm border border-slate-100/50 dark:border-slate-800/60 z-20 cursor-pointer"
        >
          <Heart className={`h-4.5 w-4.5 transition-all ${isWishlisted ? 'text-rose-500 fill-rose-500 scale-110' : ''}`} />
        </button>

        {/* Chevron Sliders (Visible on Hover) */}
        {images.length > 1 && (
          <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity z-20">
            <button
              onClick={handlePrevImage}
              className="h-7.5 w-7.5 flex items-center justify-center rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900 shadow-xs cursor-pointer"
            >
              <ChevronLeft className="h-4.5 w-4.5" />
            </button>
            <button
              onClick={handleNextImage}
              className="h-7.5 w-7.5 flex items-center justify-center rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900 shadow-xs cursor-pointer"
            >
              <ChevronRight className="h-4.5 w-4.5" />
            </button>
          </div>
        )}

        {/* Carousel indicators dots */}
        {images.length > 1 && (
          <div className="absolute bottom-4 inset-x-0 flex justify-center gap-1.5 z-20">
            {images.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === activeImageIndex ? 'w-3.5 bg-white' : 'w-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* AI Match Score Tag */}
        <div className="absolute top-4 left-4 flex items-center gap-1 bg-gradient-to-r from-primary-600 to-secondary-600 text-white text-3xs font-extrabold px-2.5 py-1.5 rounded-xl shadow-md border border-white/10">
          <Sparkles className="h-3 w-3 text-amber-300 fill-amber-300/30" />
          <span>AI Match {dummyMatchScore}%</span>
        </div>

        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute bottom-4 left-4 bg-emerald-500 text-white text-3xs font-black px-2 py-1 rounded-lg uppercase tracking-wider shadow-xs">
            15% Off
          </div>
        )}
      </div>

      {/* Hotel Info Details */}
      <div className="p-5 flex flex-col flex-grow justify-between bg-white dark:bg-[#1E293B] transition-colors duration-300">
        <div className="space-y-2.5">
          {/* Location & Rating Header */}
          <div className="flex justify-between items-center text-3xs">
            <span className="text-primary-600 dark:text-primary-400 font-extrabold uppercase tracking-widest flex items-center gap-0.5">
              <MapPin className="h-3.5 w-3.5" />
              {hotel.city}, {hotel.country}
            </span>
            <div className="flex items-center gap-0.5 font-bold text-slate-800 dark:text-slate-200">
              <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
              <span>{hotel.rating > 0 ? hotel.rating.toFixed(1) : 'New'}</span>
              <span className="text-slate-400 dark:text-slate-500 font-normal">({hotel.numReviews || 0})</span>
            </div>
          </div>

          {/* Hotel Name */}
          <h4 className="text-base font-extrabold text-slate-900 dark:text-white line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors tracking-tight">
            {hotel.name}
          </h4>

          {/* Hotel Description snippet */}
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-normal">
            {hotel.description}
          </p>

          {/* Amenities tags */}
          {hotel.amenities && hotel.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1.5">
              {hotel.amenities.slice(0, 3).map((amenity, i) => (
                <span
                  key={i}
                  className="rounded-lg bg-slate-50 dark:bg-slate-900 px-2 py-1 text-3xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider border border-slate-100 dark:border-slate-800/80"
                >
                  {amenity}
                </span>
              ))}
              {hotel.amenities.length > 3 && (
                <span className="rounded-lg bg-slate-50 dark:bg-slate-900 px-2 py-1 text-3xs font-extrabold text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-800/80">
                  +{hotel.amenities.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Pricing and CTA Button */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-3xs text-slate-400 dark:text-slate-500 block uppercase font-bold tracking-widest leading-none mb-1">Starting from</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-slate-900 dark:text-white">${minPrice}</span>
              <span className="text-3xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">/ night</span>
            </div>
          </div>
          
          <Link
            to={`/hotels/${hotel._id}`}
            className="rounded-xl bg-slate-950 dark:bg-slate-800 hover:bg-primary-600 dark:hover:bg-primary-600 px-4.5 py-2.5 text-xs font-bold text-white shadow-sm transition-all duration-200 cursor-pointer select-none active:scale-[0.97]"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
