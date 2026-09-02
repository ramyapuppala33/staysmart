import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Login = () => {
  const { login, register, user, loading: authLoading } = useAuth();
  const { success, error: toastError } = useToast();
  const [isRegister, setIsRegister] = useState(false);
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Field validation states
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // If user is already logged in, redirect them
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  // Validation rules
  const validateForm = () => {
    const newErrors = {};
    
    // Email Validation
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    // Password Validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    // Name Validation (Register mode only)
    if (isRegister && !name.trim()) {
      newErrors.name = 'Full name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Run validation on inputs change once form is submitted
  useEffect(() => {
    if (isSubmitted) {
      validateForm();
    }
  }, [name, email, password, isRegister, isSubmitted]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!validateForm()) {
      toastError('Please fix the errors before submitting');
      return;
    }

    try {
      if (isRegister) {
        await register(name, email, password, role);
        success('Account created successfully! Welcome to StaySmart.');
      } else {
        await login(email, password);
        success('Successfully logged in. Welcome back!');
      }
      
      // Redirect handled by useEffect, but backup redirection:
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      toastError(err.message || (isRegister ? 'Registration failed' : 'Login failed'));
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setIsSubmitted(false);
    setErrors({});
    setName('');
    setPassword('');
    // keep email for convenience
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center py-16 px-4 bg-slate-950 overflow-hidden">
      {/* Background Image with Ken Burns style zoom */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] scale-105 ease-out"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=80')` 
        }}
      />
      
      {/* Premium Dark Overlay & Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-900/60 to-slate-950/80 backdrop-blur-[6px]" />
      
      {/* Content wrapper */}
      <div className="relative z-10 w-full max-w-md animate-fade-in flex flex-col items-center">
        
        {/* Luxury Brand Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-indigo-600 text-white shadow-xl shadow-amber-500/20 mb-3 transition-transform duration-500 hover:rotate-12 hover:scale-105">
            <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <span className="text-3xl font-extrabold tracking-tight text-white mb-1 drop-shadow-md">
            Stay<span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">Smart</span>
          </span>
          <p className="text-slate-300 text-xs tracking-widest uppercase">Luxury Hotel Bookings</p>
        </div>

        {/* Glassmorphism Card */}
        <div className="w-full bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 transition-all hover:border-white/15">
          <h2 className="text-2xl font-bold text-white text-center mb-1">
            {isRegister ? 'Begin Your Journey' : 'Welcome Back'}
          </h2>
          <p className="text-slate-400 text-center text-sm mb-6">
            {isRegister ? 'Create an account to explore 5-star experiences' : 'Please sign in to access your bookings'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name (Register Mode Only) */}
            {isRegister && (
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider pl-1">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-amber-400 transition-colors">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className={`w-full bg-slate-950/40 border ${errors.name ? 'border-rose-500/60 focus:ring-rose-500/30' : 'border-white/10 focus:border-amber-500/50 focus:ring-amber-500/20'} rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-4 transition-all`}
                  />
                </div>
                {errors.name && (
                  <p className="text-rose-400 text-xs pl-1 font-medium mt-1 animate-fade-in">{errors.name}</p>
                )}
              </div>
            )}

            {/* Email Address */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider pl-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-amber-400 transition-colors">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className={`w-full bg-slate-950/40 border ${errors.email ? 'border-rose-500/60 focus:ring-rose-500/30' : 'border-white/10 focus:border-amber-500/50 focus:ring-amber-500/20'} rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-4 transition-all`}
                />
              </div>
              {errors.email && (
                <p className="text-rose-400 text-xs pl-1 font-medium mt-1 animate-fade-in">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider pl-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-amber-400 transition-colors">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full bg-slate-950/40 border ${errors.password ? 'border-rose-500/60 focus:ring-rose-500/30' : 'border-white/10 focus:border-amber-500/50 focus:ring-amber-500/20'} rounded-xl pl-11 pr-12 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-4 transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors focus:outline-none"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-rose-400 text-xs pl-1 font-medium mt-1 animate-fade-in">{errors.password}</p>
              )}
            </div>

            {/* Testing Role Selection (Register Mode Only) */}
            {isRegister && (
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider pl-1">Account Role</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-amber-400 transition-colors">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-slate-950/40 border border-white/10 focus:border-amber-500/50 focus:ring-amber-500/20 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-4 transition-all appearance-none cursor-pointer"
                  >
                    <option className="bg-slate-900 text-white" value="customer">Customer (Default)</option>
                    <option className="bg-slate-900 text-white" value="admin">Administrator / Manager</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* Remember Me & Forgot Password (Login Mode Only) */}
            {!isRegister && (
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center space-x-2 text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-white/10 text-amber-500 focus:ring-amber-500/20 bg-slate-950/40 focus:ring-0 h-4 w-4 accent-amber-500 cursor-pointer"
                  />
                  <span>Remember Me</span>
                </label>
                <button 
                  type="button" 
                  onClick={() => success("Reset instructions sent to your email (UI Demo only)")}
                  className="text-amber-400 hover:text-amber-300 font-semibold transition-colors hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl py-3 font-semibold shadow-lg shadow-amber-500/25 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              {authLoading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <span>{isRegister ? 'Create Account' : 'Sign In'}</span>
              )}
            </button>

            {/* Mode Toggle Button */}
            <div className="pt-2 text-center text-xs text-slate-400 border-t border-white/5">
              {isRegister ? 'Already have a StaySmart account?' : "Don't have an account yet?"}{' '}
              <button
                type="button"
                onClick={toggleMode}
                className="font-bold text-amber-400 hover:text-amber-300 transition-colors hover:underline ml-1"
              >
                {isRegister ? 'Log In' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>

        {/* Footer info inside Card */}
        <div className="mt-8 text-center text-xs text-slate-500 tracking-wider">
          &copy; {new Date().getFullYear()} StaySmart Inc. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Login;
