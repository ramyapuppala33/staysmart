import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, updateProfile } = useAuth();

  // State Profile Edit
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [editError, setEditError] = useState('');
  const [submittingProfile, setSubmittingProfile] = useState(false);

  // State Bookings List
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [bookingError, setBookingError] = useState(null);

  useEffect(() => {
    const fetchUserBookings = async () => {
      setLoadingBookings(true);
      setBookingError(null);
      try {
        const res = await axios.get('/api/bookings/my-bookings');
        setBookings(res.data);
      } catch (err) {
        console.warn('API error listing bookings, querying mock bookings storage', err);
        const stored = localStorage.getItem('staySmartMockBookings');
        const list = stored ? JSON.parse(stored) : [];
        setBookings(list);
        setBookingError('Offline mode: Could not fetch real-time bookings from database. Displaying local demo stays.');
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchUserBookings();
  }, []);

  const handleUpdateProfileSubmit = async (e) => {
    e.preventDefault();
    setEditSuccess('');
    setEditError('');
    setSubmittingProfile(true);

    try {
      const data = { name, email };
      if (password) {
        data.password = password;
      }
      await updateProfile(data);
      setEditSuccess('Profile details successfully updated!');
      setPassword('');
    } catch (err) {
      setEditError(err.message || 'Profile modification failed');
    } finally {
      setSubmittingProfile(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await axios.put(`/api/bookings/${bookingId}/cancel`);
      // Update local state
      setBookings(
        bookings.map((b) => (b._id === bookingId ? { ...b, status: 'Cancelled' } : b))
      );
    } catch (err) {
      console.warn('API cancel booking failed. Modifying local mock booking.', err);
      // Cancel local mockup
      const updatedList = bookings.map((b) =>
        b._id === bookingId ? { ...b, status: 'Cancelled' } : b
      );
      setBookings(updatedList);
      localStorage.setItem('staySmartMockBookings', JSON.stringify(updatedList));
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Account Dashboard</h1>
        <p className="text-sm text-slate-500">Manage user profiles, view reservation histories, and cancel bookings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Profile Settings Panel */}
        <div className="lg:col-span-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-50 pb-3">Profile Settings</h3>

            {editSuccess && (
              <div className="text-xs text-emerald-600 bg-emerald-50 p-3 rounded-lg border border-emerald-100 font-medium">
                {editSuccess}
              </div>
            )}
            {editError && (
              <div className="text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 font-medium">
                {editError}
              </div>
            )}

            <form onSubmit={handleUpdateProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Update Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave empty to keep current"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submittingProfile}
                className="w-full rounded-xl bg-slate-950 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-slate-900 transition-all disabled:opacity-50"
              >
                {submittingProfile ? 'Saving...' : 'Save Profile Updates'}
              </button>
            </form>
          </div>
        </div>

        {/* Bookings History Panel */}
        <div className="lg:col-span-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-50 pb-3">Reservation History</h3>

            {bookingError && (
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-3.5 text-amber-800 text-xs flex items-center space-x-2">
                <svg className="h-4 w-4 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{bookingError}</span>
              </div>
            )}

            {loadingBookings ? (
              <div className="flex justify-center py-10">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-sm">
                <p>You haven't booked any rooms yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="rounded-xl border border-slate-150 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-bold text-slate-800">{booking.hotel?.name || 'Grand Resort'}</h4>
                        <span
                          className={`rounded-md px-2 py-0.5 text-3xs font-semibold uppercase tracking-wider ${
                            booking.status === 'Cancelled'
                              ? 'bg-red-50 text-red-700 border border-red-100'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-2xs text-slate-400">
                        {booking.hotel?.city || 'Paris'}, {booking.hotel?.country || 'France'}
                      </p>
                      <p className="text-xs font-semibold text-slate-700">Room: {booking.roomNumber}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(booking.checkInDate).toLocaleDateString()} -{' '}
                        {new Date(booking.checkOutDate).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex sm:flex-col sm:items-end justify-between items-center border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
                      <div className="sm:text-right">
                        <span className="text-3xs text-slate-400 block font-medium uppercase tracking-wide">Paid Total</span>
                        <span className="text-md font-extrabold text-slate-950">${booking.totalPrice}</span>
                      </div>
                      {booking.status !== 'Cancelled' && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="mt-2 rounded-lg border border-red-200 px-3 py-1.5 text-2xs font-semibold text-red-600 bg-white hover:bg-red-50 hover:text-red-700 transition-colors"
                        >
                          Cancel Stay
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
