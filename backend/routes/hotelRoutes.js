import express from 'express';
import {
  getHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
} from '../controllers/hotelController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.route('/').get(getHotels);
router.route('/:id').get(getHotelById);

// Admin-only protected routes
router.route('/').post(protect, admin, createHotel);
router.route('/:id').put(protect, admin, updateHotel).delete(protect, admin, deleteHotel);

export default router;
