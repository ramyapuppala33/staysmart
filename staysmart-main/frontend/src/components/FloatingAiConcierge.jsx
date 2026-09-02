import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, Star, MapPin, Loader2, Compass } from 'lucide-react';

const FloatingAiConcierge = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Hello! I am your StaySmart AI Concierge. Tell me what kind of stay you're looking for (e.g. 'romantic hotel in Paris' or 'budget resort with spa and pool') and I'll find your perfect match.",
      timestamp: new Date(),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [allHotels, setAllHotels] = useState([]);
  
  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  // Suggested prompts
  const suggestions = [
    { label: '🏖️ Beach Resort', text: 'Recommend a luxurious beach resort with spa and pools' },
    { label: '🏙️ Budget Paris Stay', text: 'Show me cozy budget-friendly rooms in Paris' },
    { label: '🗻 Traditional Tokyo', text: 'Looking for a peaceful traditional garden stay in Tokyo' },
    { label: '💼 Business in NY', text: 'Best premium hotel in New York close to Times Square' },
  ];

  // Fetch all hotels to match IDs when needed
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await axios.get('/api/hotels');
        setAllHotels(res.data);
      } catch (err) {
        console.warn('Offline fallback: Loading local stays for AI helper.');
        // High quality offline fallback list
        setAllHotels([
          {
            _id: 'mock1',
            name: 'Grand Hyatt Plaza',
            city: 'Paris',
            country: 'France',
            rating: 4.8,
            amenities: ['Spa', 'Pool', 'Wifi', 'Restaurant', 'Gym'],
            images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80'],
            rooms: [{ pricePerNight: 120 }]
          },
          {
            _id: 'mock2',
            name: 'The Ritz Carlton Suite',
            city: 'New York',
            country: 'United States',
            rating: 4.9,
            amenities: ['Wifi', 'Gym', 'Bar', 'Room Service'],
            images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80'],
            rooms: [{ pricePerNight: 280 }]
          },
          {
            _id: 'mock3',
            name: 'Imperial Heritage Resort',
            city: 'Tokyo',
            country: 'Japan',
            rating: 4.7,
            amenities: ['Hot Springs', 'Garden', 'Wifi', 'Breakfast'],
            images: ['https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=600&q=80'],
            rooms: [{ pricePerNight: 95 }]
          },
          {
            _id: 'mock4',
            name: 'Westminster Palace Spa',
            city: 'London',
            country: 'United Kingdom',
            rating: 4.6,
            amenities: ['Spa', 'Wifi', 'High Tea', 'Restaurant'],
            images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=600&q=80'],
            rooms: [{ pricePerNight: 110 }]
          }
        ]);
      }
    };
    fetchHotels();

    const handleOpen = () => setIsOpen(true);
    window.addEventListener('openAiConcierge', handleOpen);
    return () => window.removeEventListener('openAiConcierge', handleOpen);
  }, []);

  // Auto-scroll chat body
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const handleSend = async (userText) => {
    const textToSend = userText || prompt;
    if (!textToSend.trim()) return;

    // Add user message
    const userMsgId = Math.random().toString(36).substring(7);
    const newMessages = [
      ...messages,
      { id: userMsgId, sender: 'user', text: textToSend, timestamp: new Date() },
    ];
    setMessages(newMessages);
    setPrompt('');
    setLoading(true);

    try {
      // Query recommendation API
      const res = await axios.post('/api/ai/recommend', { prompt: textToSend });
      const { recommendations = [], generalSummary } = res.data;

      // Match returned hotel IDs to full hotel objects
      const resolvedHotels = recommendations.map(rec => {
        const match = allHotels.find(h => h._id === rec.hotelId);
        if (match) {
          return { ...match, reasoning: rec.reasoning };
        }
        return null;
      }).filter(Boolean);

      const aiMsgId = Math.random().toString(36).substring(7);
      setMessages(prev => [
        ...prev,
        {
          id: aiMsgId,
          sender: 'ai',
          text: generalSummary || "Here are the top stays matching your preferences:",
          hotels: resolvedHotels,
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(36).substring(7),
          sender: 'ai',
          text: "I'm having trouble retrieving matches right now. Please try again in a moment.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (text) => {
    handleSend(text);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 230 }}
            className="mb-4 w-[360px] sm:w-[400px] h-[550px] bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col glow-primary"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-5 py-4 flex items-center justify-between text-white">
              <div className="flex items-center space-x-2.5">
                <div className="bg-white/15 p-2 rounded-xl backdrop-blur-md">
                  <Sparkles className="h-5 w-5 text-amber-300 fill-amber-300/20 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight">StaySmart AI Assistant</h3>
                  <span className="text-2xs text-indigo-100 flex items-center gap-1 font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    Online Concierge
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/80 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-[#0F172A]/40">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs font-normal leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-primary-600 text-white shadow-md shadow-primary-500/10 rounded-br-xs'
                        : 'bg-white dark:bg-[#1E293B] text-slate-800 dark:text-slate-200 shadow-sm border border-slate-100 dark:border-slate-800 rounded-bl-xs'
                    }`}
                  >
                    <p>{msg.text}</p>

                    {/* Matched Hotels */}
                    {msg.hotels && msg.hotels.length > 0 && (
                      <div className="mt-3.5 space-y-3">
                        {msg.hotels.map((hotel) => {
                          const minPrice = hotel.rooms && hotel.rooms.length > 0
                            ? Math.min(...hotel.rooms.map(r => r.pricePerNight))
                            : 120;
                          return (
                            <div
                              key={hotel._id}
                              onClick={() => {
                                setIsOpen(false);
                                navigate(`/hotels/${hotel._id}`);
                              }}
                              className="bg-slate-50 dark:bg-[#0F172A]/70 hover:bg-slate-100 dark:hover:bg-[#0F172A] border border-slate-100 dark:border-slate-800/80 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
                            >
                              <div className="relative aspect-[16/9] w-full bg-slate-200 dark:bg-slate-800">
                                <img
                                  src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80'}
                                  alt={hotel.name}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-white/95 dark:bg-slate-900/90 backdrop-blur-xs px-1.5 py-0.5 rounded-md text-3xs font-extrabold text-slate-900 dark:text-white shadow-xs">
                                  <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                  <span>{hotel.rating?.toFixed(1) || '4.5'}</span>
                                </div>
                              </div>
                              <div className="p-3 space-y-2">
                                <div>
                                  <h4 className="font-bold text-slate-900 dark:text-white text-xs truncate">{hotel.name}</h4>
                                  <span className="text-3xs text-slate-400 dark:text-slate-500 flex items-center gap-0.5">
                                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                    {hotel.city}, {hotel.country}
                                  </span>
                                </div>
                                <div className="bg-indigo-50/50 dark:bg-indigo-500/5 p-2 rounded-lg border border-indigo-100/30 dark:border-indigo-500/10 text-3xs text-slate-600 dark:text-slate-300 leading-normal">
                                  <span className="font-extrabold text-indigo-600 dark:text-indigo-400 block mb-0.5 uppercase tracking-wider">AI Reason:</span>
                                  "{hotel.reasoning}"
                                </div>
                                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-2 text-3xs">
                                  <span className="font-extrabold text-slate-900 dark:text-white">${minPrice} <span className="text-slate-400 font-normal">/ night</span></span>
                                  <span className="text-primary-600 dark:text-primary-400 font-bold hover:underline">View details &rarr;</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-[#1E293B] rounded-2xl rounded-bl-xs p-3.5 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-2 text-slate-500">
                    <Loader2 className="h-4 w-4 animate-spin text-primary-500" />
                    <span className="text-xs font-medium">Gemini is curating stays...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Actions Suggestions */}
            {messages.length === 1 && !loading && (
              <div className="px-4 py-2 bg-slate-50/30 dark:bg-[#0F172A]/10 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5">
                <span className="text-3xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block pl-1">Suggested Searches</span>
                <div className="flex flex-wrap gap-1.5">
                  {suggestions.map((sug, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(sug.text)}
                      className="px-2.5 py-1.5 rounded-full text-3xs bg-white dark:bg-[#0F172A]/80 text-slate-600 dark:text-slate-300 border border-slate-200/70 dark:border-slate-800 hover:border-primary-500 dark:hover:border-primary-500 transition-colors shadow-2xs font-semibold cursor-pointer select-none"
                    >
                      {sug.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Input */}
            <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#1E293B]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ask for custom accommodations..."
                  disabled={loading}
                  className="flex-1 text-xs bg-slate-50 dark:bg-[#0F172A]/50 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-primary-500 dark:focus:border-primary-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!prompt.trim() || loading}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 disabled:from-slate-200 disabled:to-slate-300 dark:disabled:from-slate-800 dark:disabled:to-slate-900 text-white shadow-md shadow-primary-500/10 transition-all hover:scale-105 active:scale-95 disabled:scale-100 cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="h-14 w-14 rounded-full bg-gradient-to-tr from-primary-600 via-indigo-600 to-secondary-600 text-white shadow-xl hover:shadow-2xl flex items-center justify-center cursor-pointer transition-all duration-300 relative group glow-primary border border-white/10"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 45, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -45, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              <Sparkles className="h-6 w-6" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulsing ring indicator */}
        {!isOpen && (
          <span className="absolute -inset-0.5 rounded-full border border-primary-500/35 animate-ping opacity-60 pointer-events-none"></span>
        )}
      </motion.button>
    </div>
  );
};

export default FloatingAiConcierge;
