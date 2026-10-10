import express from 'express';
import {
  getAdminOverview,
  getAdminUsers,
  getAdminUserById,
  toggleUserStatus,
  deleteUser,
} from '../controllers/adminController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Strict RBAC: only users with admin role can access these routes
router.use(protect, restrictTo('admin'));

router.get('/overview', getAdminOverview);
router.get('/users', getAdminUsers);
router.get('/users/:id', getAdminUserById);
router.patch('/users/:id/status', toggleUserStatus);
router.delete('/users/:id', deleteUser);

export default router;
