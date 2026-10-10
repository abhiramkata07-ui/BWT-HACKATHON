import express from 'express';
import {
  createActivity,
  getActivities,
  getActivityById,
  updateActivity,
  deleteActivity,
} from '../controllers/activityController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { activitySchema, activityUpdateSchema } from '../schemas/validationSchemas.js';

const router = express.Router();

router.use(protect); // All activity routes are protected

router.route('/')
  .post(validate(activitySchema), createActivity)
  .get(getActivities);

router.route('/:id')
  .get(getActivityById)
  .patch(validate(activityUpdateSchema), updateActivity)
  .delete(deleteActivity);

export default router;
