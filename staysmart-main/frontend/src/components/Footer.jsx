import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, Sparkles, Mail, Heart, HelpCircle, Shield, Globe } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Footer = () => {
  const { success } = useToast();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    success('Thank you for subscribing to StaySmart Luxury Digest! 🌟');
    setEmail('');
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="bg-white dark:bg-[#0b0f19] border-t border-slate-200/50 dark:border-slate-800/60 pt-16 pb-8 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 mb-12">
          
          {/* Brand and Newsletter Column */}
          <div className="md:col-span-4 space-y-6">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-primary-600 to-secondary-500 text-white shadow-sm">
                <Sparkles className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                Stay<span className="bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">Smart</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
              Book curated luxury hotels, cozy winter cottages, and business suites with personalized AI recommendations and real-time review summaries.
            </p>
            
            {/* Newsletter Subscription */}
            <div className="space-y-2.5">
              <span className="block text-2xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-0.5">Subscribe to newsletter</span>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full text-xs bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3.5 py-3 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-primary-500 dark:focus:border-primary-500 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-xl bg-slate-950 dark:bg-primary-600 hover:bg-slate-900 dark:hover:bg-primary-700 px-4 py-3 text-xs font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 cursor-pointer active:translate-y-0"
                >
                  Join
                </button>
              </form>
            </div>
          </div>

          {/* Spacer */}
          <div className="hidden md:block md:col-span-1" />

          {/* Quick links columns */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h4 className="text-2xs font-extrabold text-slate-950 dark:text-white uppercase tracking-widest">Company</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/hotels" className="text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 font-medium">About StaySmart</Link></li>
                <li><Link to="/hotels" className="text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 font-medium">Career Openings</Link></li>
                <li><Link to="/hotels" className="text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 font-medium">Press & Newsroom</Link></li>
                <li><Link to="/hotels" className="text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 font-medium">Platform Status</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-2xs font-extrabold text-slate-950 dark:text-white uppercase tracking-widest">Destinations</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/hotels?city=Paris" className="text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 font-medium">Paris Stays</Link></li>
                <li><Link to="/hotels?city=London" className="text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 font-medium">London Estates</Link></li>
                <li><Link to="/hotels?city=Tokyo" className="text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 font-medium">Tokyo Resorts</Link></li>
                <li><Link to="/hotels?city=New York" className="text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 font-medium">New York Penthouses</Link></li>
              </ul>
            </div>

            <div className="space-y-4 col-span-2 sm:col-span-1">
              <h4 className="text-2xs font-extrabold text-slate-950 dark:text-white uppercase tracking-widest">AI Innovation</h4>
              <ul className="space-y-2 text-xs">
                <li className="text-slate-500 dark:text-slate-400 font-medium hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer">Concierge Assistant</li>
                <li className="text-slate-500 dark:text-slate-400 font-medium hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer">AI Review Summarizer</li>
                <li className="text-slate-500 dark:text-slate-400 font-medium hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer">Compare Stays (vS)</li>
                <li className="text-slate-500 dark:text-slate-400 font-medium hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer">Smart Value Index</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-slate-100 dark:border-slate-800/80 mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-3xs text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1">
            <span>&copy; {new Date().getFullYear()} StaySmart. Redesigned with</span>
            <Heart className="h-3 w-3 text-rose-500 fill-rose-500/35" />
            <span>for luxury travels.</span>
          </div>

          {/* Socials & Back To Top */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 text-slate-400 dark:text-slate-500">
              <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors" aria-label="Twitter">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
              <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors" aria-label="GitHub">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </a>
              <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors" aria-label="LinkedIn">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
            
            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-500 transition-all cursor-pointer shadow-xs"
              title="Back to Top"
            >
              <ArrowUp className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
