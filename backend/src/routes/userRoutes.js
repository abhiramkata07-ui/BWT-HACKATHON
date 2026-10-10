import express from 'express';
import {
  getMyProfile,
  updateMyProfile,
  changeMyPassword,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { profileUpdateSchema, passwordChangeSchema } from '../schemas/validationSchemas.js';

const router = express.Router();

router.use(protect);

router.get('/me', getMyProfile);
router.patch('/me', validate(profileUpdateSchema), updateMyProfile);
router.patch('/me/password', validate(passwordChangeSchema), changeMyPassword);

export default router;
