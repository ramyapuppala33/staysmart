import Hotel from '../models/Hotel.js';

// @desc    Get all hotels with search and filters
// @route   GET /api/hotels
// @access  Public
const getHotels = async (req, res, next) => {
  try {
    const { city, country, search, minPrice, maxPrice, rating, amenities } = req.query;
    const queryObject = {};

    if (city) {
      queryObject.city = { $regex: city, $options: 'i' };
    }

    if (country) {
      queryObject.country = { $regex: country, $options: 'i' };
    }

    if (rating) {
      queryObject.rating = { $gte: Number(rating) };
    }

    if (search) {
      queryObject.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
      ];
    }

    // Room price filtering
    if (minPrice || maxPrice) {
      queryObject['rooms.pricePerNight'] = {};
      if (minPrice) {
        queryObject['rooms.pricePerNight'].$gte = Number(minPrice);
      }
      if (maxPrice) {
        queryObject['rooms.pricePerNight'].$lte = Number(maxPrice);
      }
    }

    // Amenities filtering
    if (amenities) {
      let amenitiesList = [];
      if (typeof amenities === 'string') {
        amenitiesList = amenities.split(',').map((a) => a.trim()).filter(Boolean);
      } else if (Array.isArray(amenities)) {
        amenitiesList = amenities.map((a) => a.trim()).filter(Boolean);
      }
      if (amenitiesList.length > 0) {
        queryObject.amenities = { $all: amenitiesList };
      }
    }

    const hotels = await Hotel.find(queryObject).populate('createdBy', 'name email');
    res.json(hotels);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single hotel by ID
// @route   GET /api/hotels/:id
// @access  Public
const getHotelById = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id).populate('createdBy', 'name email');

    if (!hotel) {
      res.status(404);
      throw new Error('Hotel not found');
    }

    res.json(hotel);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new hotel
// @route   POST /api/hotels
// @access  Private/Admin
const createHotel = async (req, res, next) => {
  try {
    const { name, description, address, city, country, images, rooms, amenities } = req.body;

    if (!name || !description || !address || !city || !country) {
      res.status(400);
      throw new Error('Please fill in all required hotel fields');
    }

    const hotel = new Hotel({
      name,
      description,
      address,
      city,
      country,
      images: images || [],
      rooms: rooms || [],
      amenities: amenities || [],
      createdBy: req.user._id,
    });

    const createdHotel = await hotel.save();
    res.status(201).json(createdHotel);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a hotel
// @route   PUT /api/hotels/:id
// @access  Private/Admin
const updateHotel = async (req, res, next) => {
  try {
    const { name, description, address, city, country, images, rooms, amenities, rating, numReviews } = req.body;

    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      res.status(404);
      throw new Error('Hotel not found');
    }

    // Update fields
    hotel.name = name || hotel.name;
    hotel.description = description || hotel.description;
    hotel.address = address || hotel.address;
    hotel.city = city || hotel.city;
    hotel.country = country || hotel.country;
    hotel.images = images || hotel.images;
    hotel.rooms = rooms || hotel.rooms;
    hotel.amenities = amenities || hotel.amenities;
    if (rating !== undefined) hotel.rating = rating;
    if (numReviews !== undefined) hotel.numReviews = numReviews;

    const updatedHotel = await hotel.save();
    res.json(updatedHotel);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a hotel
// @route   DELETE /api/hotels/:id
// @access  Private/Admin
const deleteHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      res.status(404);
      throw new Error('Hotel not found');
    }

    await hotel.deleteOne();
    res.json({ message: 'Hotel deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export { getHotels, getHotelById, createHotel, updateHotel, deleteHotel };
