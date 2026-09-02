import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize Axios Defaults and load token
  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem('staySmartUser');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
        
        try {
          // Verify token by calling profile
          const res = await axios.get('/api/auth/profile');
          // If valid, sync any updates
          setUser({ ...parsedUser, ...res.data });
        } catch (err) {
          console.error('Session expired or token invalid');
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Register User
  const register = async (name, email, password, role = 'customer') => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/auth/register', { name, email, password, role });
      setUser(res.data);
      localStorage.setItem('staySmartUser', JSON.stringify(res.data));
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setLoading(false);
      return res.data;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Registration failed';
      setError(errMsg);
      setLoading(false);
      throw new Error(errMsg);
    }
  };

  // Login User
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      setUser(res.data);
      localStorage.setItem('staySmartUser', JSON.stringify(res.data));
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setLoading(false);
      return res.data;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Login failed';
      setError(errMsg);
      setLoading(false);
      throw new Error(errMsg);
    }
  };

  // Logout User
  const logout = () => {
    setUser(null);
    localStorage.removeItem('staySmartUser');
    delete axios.defaults.headers.common['Authorization'];
  };

  // Update Profile
  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.put('/api/auth/profile', profileData);
      const updatedUser = { ...user, ...res.data };
      setUser(updatedUser);
      localStorage.setItem('staySmartUser', JSON.stringify(updatedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${updatedUser.token}`;
      setLoading(false);
      return updatedUser;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Profile update failed';
      setError(errMsg);
      setLoading(false);
      throw new Error(errMsg);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
