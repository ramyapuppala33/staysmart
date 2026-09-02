import Booking from '../models/Booking.js';
import Hotel from '../models/Hotel.js';

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res, next) => {
  try {
    const { hotelId, roomNumber, checkInDate, checkOutDate } = req.body;

    if (!hotelId || !roomNumber || !checkInDate || !checkOutDate) {
      res.status(400);
      throw new Error('Please fill in all booking fields');
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkIn >= checkOut) {
      res.status(400);
      throw new Error('Check-out date must be after check-in date');
    }

    // Find the hotel
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      res.status(404);
      throw new Error('Hotel not found');
    }

    // Find room in the hotel
    const room = hotel.rooms.find((r) => r.roomNumber === roomNumber);
    if (!room) {
      res.status(404);
      throw new Error(`Room number ${roomNumber} does not exist in this hotel`);
    }

    // Check availability (check for conflicting bookings)
    const conflictingBooking = await Booking.findOne({
      hotel: hotelId,
      roomNumber,
      status: { $ne: 'Cancelled' },
      $or: [
        {
          checkInDate: { $lt: checkOut },
          checkOutDate: { $gt: checkIn },
        },
      ],
    });

    if (conflictingBooking) {
      res.status(400);
      throw new Error('Room is already booked for the selected dates');
    }

    // Calculate total price
    const diffTime = Math.abs(checkOut - checkIn);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const totalPrice = diffDays * room.pricePerNight;

    // Create booking
    const booking = new Booking({
      user: req.user._id,
      hotel: hotelId,
      roomNumber,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      totalPrice,
      status: 'Confirmed', // Defaulting to Confirmed since payment is out of scope
    });

    const createdBooking = await booking.save();
    res.status(201).json(createdBooking);
  } catch (error) {
    next(error);
  }
};

// @desc    Get bookings of the logged-in user
// @route   GET /api/bookings/my-bookings
// @access  Private
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('hotel', 'name address city country images')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email')
      .populate('hotel', 'name address city country images rating');

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    // Check authorization: User must be the owner of the booking OR an admin
    if (
      booking.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      res.status(403);
      throw new Error('Not authorized to view this booking');
    }

    res.json(booking);
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    // Check authorization: User must be the owner of the booking OR an admin
    if (
      booking.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      res.status(403);
      throw new Error('Not authorized to cancel this booking');
    }

    if (booking.status === 'Cancelled') {
      res.status(400);
      throw new Error('Booking is already cancelled');
    }

    booking.status = 'Cancelled';
    const updatedBooking = await booking.save();

    res.json(updatedBooking);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({})
      .populate('user', 'name email')
      .populate('hotel', 'name city country')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

export {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
};
