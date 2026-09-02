import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Hotel from './models/Hotel.js';
import Booking from './models/Booking.js';

dotenv.config();

const __dirname = path.resolve();

// City to Country Mapping Helper
const getCountryForCity = (city) => {
  const mapping = {
    'paris': 'France',
    'london': 'United Kingdom',
    'tokyo': 'Japan',
    'new york': 'United States',
    'rome': 'Italy',
    'sydney': 'Australia',
    'barcelona': 'Spain',
    'amsterdam': 'Netherlands',
    'dubai': 'United Arab Emirates',
    'singapore': 'Singapore',
    'bali': 'Indonesia',
    'cape town': 'South Africa',
  };
  return mapping[city.toLowerCase().trim()] || 'Unknown Country';
};

const importData = async () => {
  try {
    // Connect to database
    console.log('Connecting to database for seeding...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Database connected successfully!');

    // Clear existing data
    console.log('Clearing existing data...');
    await Booking.deleteMany();
    await Hotel.deleteMany();
    await User.deleteMany();
    console.log('Data cleared!');

    // Create default users
    console.log('Creating default users...');
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@staysmart.com',
      password: 'adminpassword',
      role: 'admin',
    });

    const customerUser = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'customer',
    });

    console.log(`Default users created!`);
    console.log(`Admin email: admin@staysmart.com / adminpassword`);
    console.log(`Customer email: john@example.com / password123`);

    // Load dummy hotels
    const dummyHotelsPath = path.join(__dirname, '..', 'dummy-hotels.json');
    console.log(`Loading dummy hotels from ${dummyHotelsPath}...`);
    const dummyHotelsData = JSON.parse(fs.readFileSync(dummyHotelsPath, 'utf-8'));

    // Process and map hotels
    const hotelsToInsert = dummyHotelsData.map((h, index) => {
      const city = h.city || 'Paris';
      const country = getCountryForCity(city);
      const basePrice = h.price || 150;

      // Generate realistic rooms
      const rooms = [
        {
          roomNumber: '101',
          type: 'Single',
          pricePerNight: Math.round(basePrice * 0.8),
          isAvailable: true,
          description: 'A cozy single room featuring premium linen and a work desk.',
        },
        {
          roomNumber: '102',
          type: 'Double',
          pricePerNight: basePrice,
          isAvailable: true,
          description: 'A spacious double room with modern amenities and city views.',
        },
        {
          roomNumber: '201',
          type: 'Suite',
          pricePerNight: Math.round(basePrice * 1.5),
          isAvailable: true,
          description: 'An elegant suite with a separate lounge area and panoramic windows.',
        },
      ];

      // Clean reviews list
      const reviews = (h.reviews || []).map((rev) => ({
        reviewerName: rev.reviewerName || 'Anonymous',
        rating: rev.rating || 5,
        comment: rev.comment || 'Wonderful stay!',
        date: rev.date || new Date().toISOString().split('T')[0],
      }));

      // Calculate rating
      const rating = reviews.length > 0
        ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1))
        : h.rating || 0;

      return {
        name: h.name,
        description: h.description || `Welcome to ${h.name}, your premium getaway in ${city}.`,
        address: h.address || `Street ${index + 10}, ${city}`,
        city,
        country,
        images: h.images && h.images.length > 0 ? h.images : [
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
        ],
        rooms,
        amenities: h.amenities || ['Wifi', 'Room Service'],
        rating,
        numReviews: reviews.length,
        reviews,
        createdBy: adminUser._id,
      };
    });

    console.log(`Seeding ${hotelsToInsert.length} hotels...`);
    await Hotel.insertMany(hotelsToInsert);
    console.log('Database seeded successfully! 🎉');
    process.exit(0);
  } catch (error) {
    console.error(`Error with data import: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    console.log('Connecting to database to clear data...');
    await mongoose.connect(process.env.MONGO_URI);
    await Booking.deleteMany();
    await Hotel.deleteMany();
    await User.deleteMany();
    console.log('Data destroyed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Error with data destroy: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
