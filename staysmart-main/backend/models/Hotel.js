import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: [true, 'Please add a room number'],
    trim: true,
  },
  type: {
    type: String,
    enum: ['Single', 'Double', 'Suite', 'Deluxe'],
    default: 'Single',
  },
  pricePerNight: {
    type: Number,
    required: [true, 'Please add room price per night'],
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  description: {
    type: String,
    trim: true,
  },
});

const reviewSchema = new mongoose.Schema({
  reviewerName: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
  date: {
    type: String,
  },
});

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a hotel name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a hotel description'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Please add a hotel address'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'Please add city'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Please add country'],
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    rooms: {
      type: [roomSchema],
      default: [],
    },
    amenities: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    reviews: {
      type: [reviewSchema],
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Hotel = mongoose.model('Hotel', hotelSchema);

export default Hotel;
