import express from 'express';
import {
  getSummary,
  getActivityTrends,
  getCategoryBreakdown,
} from '../controllers/analyticsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All analytics routes are protected

router.get('/summary', getSummary);
router.get('/activity-trends', getActivityTrends);
router.get('/category-breakdown', getCategoryBreakdown);

export default router;
