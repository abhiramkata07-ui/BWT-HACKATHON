import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';

// Helper to sign JWT token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fittrack_super_secret_jwt_key_2026_hackathon_secure', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// Helper to send cookie + JSON response
const sendAuthResponse = (user, statusCode, res, message = 'Success') => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  res.cookie('token', token, cookieOptions);

  return res.status(statusCode).json({
    success: true,
    message,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        avatar: user.avatar,
        preferences: user.preferences,
        createdAt: user.createdAt,
      },
      token,
    },
  });
};

// @desc    Register a new user
// @route   POST /api/v1/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.',
        errors: ['Email is already registered'],
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Derive username from email or name
    const username = normalizedEmail.split('@')[0];

    // Create user (force role 'user' for public registration)
    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      username,
      passwordHash,
      role: 'user',
      isActive: true,
    });

    return sendAuthResponse(newUser, 201, res, 'Account registered successfully!');
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const identifier = email.trim().toLowerCase();

    // Support logging in via email OR username OR name
    let user = await User.findOne({
      $or: [
        { email: identifier },
        { username: identifier },
        { name: new RegExp(`^${identifier}$`, 'i') },
      ],
    });

    // Fallback: If user entered just "abhiram", also check abhiram@fittrack.com
    if (!user && !identifier.includes('@')) {
      user = await User.findOne({ email: `${identifier}@fittrack.com` });
    }

    // Invalid credentials check (never reveal whether user exists or not)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your email/username and password.',
        errors: ['Invalid credentials'],
      });
    }

    // Check account status
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'This account has been deactivated. Please contact an administrator.',
        errors: ['Account deactivated'],
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your email/username and password.',
        errors: ['Invalid credentials'],
      });
    }

    return sendAuthResponse(user, 200, res, `Welcome back, ${user.name}!`);
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user & clear cookie
// @route   POST /api/v1/auth/logout
export const logout = async (req, res, next) => {
  try {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully.',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get currently logged in user
// @route   GET /api/v1/auth/me
export const getMe = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Current user profile retrieved.',
      data: {
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          username: req.user.username,
          role: req.user.role,
          avatar: req.user.avatar,
          preferences: req.user.preferences,
          createdAt: req.user.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
