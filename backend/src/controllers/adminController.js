import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Activity } from '../models/Activity.js';
import { Goal } from '../models/Goal.js';

// @desc    Get admin platform overview stats
// @route   GET /api/v1/admin/overview
export const getAdminOverview = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalActivities = await Activity.countDocuments();

    // Aggregate overall metrics
    const stats = await Activity.aggregate([
      {
        $group: {
          _id: null,
          totalDuration: { $sum: '$duration' },
          totalCalories: { $sum: '$calories' },
        },
      },
    ]);

    const globalStats = stats[0] || { totalDuration: 0, totalCalories: 0 };

    // Recent 5 user registrations
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('-passwordHash');

    // Recent 5 activities across all users
    const recentActivities = await Activity.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email');

    return res.status(200).json({
      success: true,
      message: 'Admin overview metrics retrieved.',
      data: {
        totalUsers,
        totalActivities,
        totalDurationHours: Math.round((globalStats.totalDuration / 60) * 10) / 10,
        totalCalories: globalStats.totalCalories,
        recentUsers,
        recentActivities,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get paginated users list with search
// @route   GET /api/v1/admin/users
export const getAdminUsers = async (req, res, next) => {
  try {
    const { search = '', page = 1, limit = 10 } = req.query;

    const query = {};
    if (search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
        { username: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .select('-passwordHash');

    // Append activity counts to each user
    const usersWithStats = await Promise.all(
      users.map(async (u) => {
        const activityCount = await Activity.countDocuments({ user: u._id });
        const userObj = u.toObject();
        userObj.activityCount = activityCount;
        return userObj;
      })
    );

    const totalPages = Math.ceil(total / limitNum) || 1;

    return res.status(200).json({
      success: true,
      message: 'Users list retrieved successfully.',
      data: {
        users: usersWithStats,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user details by ID
// @route   GET /api/v1/admin/users/:id
export const getAdminUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Invalid user identifier.',
        errors: ['Invalid user ID format'],
      });
    }

    const user = await User.findById(id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
        errors: ['No user found with the provided ID'],
      });
    }

    const activities = await Activity.find({ user: id }).sort({ date: -1 }).limit(10);
    const goals = await Goal.find({ user: id });

    return res.status(200).json({
      success: true,
      message: 'User details retrieved successfully.',
      data: {
        user,
        activities,
        goals,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Activate or deactivate user account
// @route   PATCH /api/v1/admin/users/:id/status
export const toggleUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Invalid user identifier.',
        errors: ['Invalid user ID format'],
      });
    }

    if (id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot alter your own active status.',
        errors: ['Cannot deactivate own admin account'],
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
        errors: ['No user found with the provided ID'],
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User account has been ${user.isActive ? 'activated' : 'deactivated'}.`,
      data: { user: user.toJSON() },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user account and associated data
// @route   DELETE /api/v1/admin/users/:id
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Invalid user identifier.',
        errors: ['Invalid user ID format'],
      });
    }

    if (id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account while acting as administrator.',
        errors: ['Cannot delete own account'],
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
        errors: ['No user found with the provided ID'],
      });
    }

    // Cascade delete user's activities and goals
    await Activity.deleteMany({ user: id });
    await Goal.deleteMany({ user: id });
    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: `User account for ${user.email} and all associated data have been permanently deleted.`,
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
