import React, { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Bell, Menu, X, LogOut, User, Settings, Shield, Sparkles, Compass } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { success } = useToast();
  const { theme, toggleTheme } = useTheme();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const mockNotifications = [
    { id: 1, title: 'Welcome to StaySmart! ✨', desc: 'Find luxury stays custom curated by our AI recommendation engine.', read: false, time: 'Just now' },
    { id: 2, title: 'AI Match Score Active 📊', desc: 'Browse stays to see personalized match percentages.', read: true, time: '2 hours ago' },
    { id: 3, title: 'Secure Checkout active 🛡️', desc: 'Enjoy standard 256-bit booking guarantees on all rooms.', read: true, time: '1 day ago' },
  ];

  const handleLogout = () => {
    logout();
    success('Logged out successfully');
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const handleLoginClick = () => {
    setMobileMenuOpen(false);
    navigate('/login', { state: { from: location } });
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-200/50 dark:border-slate-800/50 bg-white/75 dark:bg-[#0F172A]/75 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary-600 to-secondary-500 text-white shadow-md shadow-primary-500/20 transition-transform duration-300 group-hover:rotate-6">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Stay<span className="bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">Smart</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-7">
            <NavLink 
              to="/" 
              className={({ isActive }) => `relative text-sm font-semibold tracking-wide transition-colors py-1.5 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400'}`}
            >
              {({ isActive }) => (
                <>
                  <span>Home</span>
                  {isActive && (
                    <motion.span 
                      layoutId="activeNav" 
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary-600 dark:bg-primary-400" 
                    />
                  )}
                </>
              )}
            </NavLink>
            <NavLink 
              to="/hotels" 
              className={({ isActive }) => `relative text-sm font-semibold tracking-wide transition-colors py-1.5 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400'}`}
            >
              {({ isActive }) => (
                <>
                  <span>Browse Hotels</span>
                  {isActive && (
                    <motion.span 
                      layoutId="activeNav" 
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary-600 dark:bg-primary-400" 
                    />
                  )}
                </>
              )}
            </NavLink>
            {user && (
              <NavLink 
                to="/profile" 
                className={({ isActive }) => `relative text-sm font-semibold tracking-wide transition-colors py-1.5 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400'}`}
              >
                {({ isActive }) => (
                  <>
                    <span>My Dashboard</span>
                    {isActive && (
                      <motion.span 
                        layoutId="activeNav" 
                        className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary-600 dark:bg-primary-400" 
                      />
                    )}
                  </>
                )}
              </NavLink>
            )}

            {/* Dark Mode toggler */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-4.5 w-4.5 text-amber-400" /> : <Moon className="h-4.5 w-4.5 text-slate-600" />}
            </button>

            {/* Notifications center */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotifOpen(!notifOpen);
                  setDropdownOpen(false);
                }}
                className="p-2 rounded-xl text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative cursor-pointer"
              >
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 border border-white dark:border-[#0F172A] animate-pulse"></span>
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 origin-top-right rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#1E293B] p-2 shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Notifications Center</span>
                      <span className="text-3xs text-primary-600 dark:text-primary-400 font-bold hover:underline cursor-pointer">Mark all read</span>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                      {mockNotifications.map((notif) => (
                        <div key={notif.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors space-y-1">
                          <div className="flex justify-between items-start">
                            <span className={`text-xs font-semibold ${notif.read ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-white font-bold'}`}>{notif.title}</span>
                            <span className="text-3xs text-slate-400 font-medium">{notif.time}</span>
                          </div>
                          <p className="text-3xs text-slate-500 dark:text-slate-400 leading-normal">{notif.desc}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Menu Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setDropdownOpen(!dropdownOpen);
                    setNotifOpen(false);
                  }}
                  className="flex items-center space-x-2 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-1.5 pr-3 text-sm font-medium text-slate-700 dark:text-slate-300 transition-all hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-primary-600 to-indigo-500 text-white font-bold text-xs shadow-sm">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-bold truncate max-w-[80px]">{user.name}</span>
                  <svg className={`h-4 w-4 text-slate-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-52 origin-top-right rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#1E293B] p-1.5 shadow-2xl z-50"
                    >
                      <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-800">
                        <span className="text-3xs text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold block">Logged in as</span>
                        <span className="truncate text-xs font-bold text-slate-800 dark:text-white block mt-0.5">{user.email}</span>
                        {user.role === 'admin' && (
                          <span className="mt-1.5 inline-flex items-center rounded-md bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 text-3xs font-bold text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-500/20">
                            Admin Account
                          </span>
                        )}
                      </div>
                      <div className="p-1 space-y-1">
                        <Link
                          to="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-semibold"
                        >
                          <User className="h-4 w-4 text-slate-400" />
                          Dashboard
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors font-bold cursor-pointer"
                        >
                          <LogOut className="h-4 w-4 text-rose-500" />
                          Log Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={handleLoginClick}
                className="rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-primary-500/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile hamburger menu button */}
          <div className="flex md:hidden items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-300"
            >
              {theme === 'dark' ? <Sun className="h-4.5 w-4.5 text-amber-400" /> : <Moon className="h-4.5 w-4.5 text-slate-600" />}
            </button>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#1E293B] px-4 py-4 space-y-2.5 overflow-hidden"
          >
            <NavLink
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `block rounded-xl px-3 py-2.5 text-sm font-bold transition-colors ${isActive ? 'bg-primary-50/55 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              Home
            </NavLink>
            <NavLink
              to="/hotels"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `block rounded-xl px-3 py-2.5 text-sm font-bold transition-colors ${isActive ? 'bg-primary-50/55 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              Browse Hotels
            </NavLink>
            {user && (
              <NavLink
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => `block rounded-xl px-3 py-2.5 text-sm font-bold transition-colors ${isActive ? 'bg-primary-50/55 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              >
                Dashboard
              </NavLink>
            )}

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              {user ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-primary-600 to-indigo-500 text-white font-bold">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-white leading-none">{user.name}</div>
                      <div className="text-3xs text-slate-400 dark:text-slate-500 mt-1 font-medium">{user.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="rounded-xl bg-rose-50 dark:bg-rose-500/10 px-4 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors cursor-pointer"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleLoginClick}
                  className="w-full rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 py-3 text-center text-sm font-semibold text-white shadow-md shadow-primary-500/20 cursor-pointer"
                >
                  Sign In
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
