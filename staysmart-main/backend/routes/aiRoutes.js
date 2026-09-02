import express from 'express';
import {
  getReviewSummary,
  compareHotels,
  getSmartValueScore,
  getRecommendations,
} from '../controllers/aiController.js';

const router = express.Router();

router.get('/reviews/:hotelId', getReviewSummary);
router.post('/compare', compareHotels);
router.get('/value-score/:hotelId', getSmartValueScore);
router.post('/recommend', getRecommendations);

export default router;
