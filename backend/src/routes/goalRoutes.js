import express from 'express';
import {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal,
} from '../controllers/goalController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { goalSchema } from '../schemas/validationSchemas.js';

const router = express.Router();

router.use(protect); // All goal routes are protected

router.route('/')
  .post(validate(goalSchema), createGoal)
  .get(getGoals);

router.route('/:id')
  .patch(updateGoal)
  .delete(deleteGoal);

export default router;
