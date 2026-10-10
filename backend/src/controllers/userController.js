import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';

// @desc    Get current user profile
// @route   GET /api/v1/users/me
export const getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    return res.status(200).json({
      success: true,
      message: 'User profile retrieved.',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current user profile (name, preferences)
// @route   PATCH /api/v1/users/me
export const updateMyProfile = async (req, res, next) => {
  try {
    const { name, avatar, preferences } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name.trim();
    if (avatar !== undefined) user.avatar = avatar;
    if (preferences) {
      user.preferences = {
        ...user.preferences.toObject(),
        ...preferences,
      };
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PATCH /api/v1/users/me/password
export const changeMyPassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect.',
        errors: ['Invalid current password'],
      });
    }

    // Hash and save new password
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully. Please keep your credentials secure.',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
