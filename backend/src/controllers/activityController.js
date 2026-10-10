import mongoose from 'mongoose';
import { Activity } from '../models/Activity.js';

// @desc    Create a new activity
// @route   POST /api/v1/activities
export const createActivity = async (req, res, next) => {
  try {
    const { exercise, category, duration, calories, date, notes } = req.body;

    const activity = await Activity.create({
      user: req.user._id,
      exercise: exercise.trim(),
      category,
      duration: Number(duration),
      calories: Number(calories),
      date: date ? new Date(date) : new Date(),
      notes: notes ? notes.trim() : '',
    });

    return res.status(201).json({
      success: true,
      message: 'Workout activity logged successfully!',
      data: { activity },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's activities with filtering, sorting, pagination
// @route   GET /api/v1/activities
export const getActivities = async (req, res, next) => {
  try {
    const {
      search,
      category,
      startDate,
      endDate,
      sort = 'newest',
      page = 1,
      limit = 10,
    } = req.query;

    const query = { user: req.user._id };

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Search filter
    if (search && search.trim() !== '') {
      query.$or = [
        { exercise: { $regex: search.trim(), $options: 'i' } },
        { notes: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // Date range filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    // Sorting
    let sortOptions = { date: -1, createdAt: -1 };
    if (sort === 'oldest') {
      sortOptions = { date: 1, createdAt: 1 };
    } else if (sort === 'duration_desc') {
      sortOptions = { duration: -1 };
    } else if (sort === 'duration_asc') {
      sortOptions = { duration: 1 };
    } else if (sort === 'calories_desc') {
      sortOptions = { calories: -1 };
    } else if (sort === 'calories_asc') {
      sortOptions = { calories: 1 };
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await Activity.countDocuments(query);
    const activities = await Activity.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(total / limitNum) || 1;

    return res.status(200).json({
      success: true,
      message: 'Activities retrieved successfully.',
      data: {
        activities,
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

// @desc    Get a single activity by ID
// @route   GET /api/v1/activities/:id
export const getActivityById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Invalid activity identifier.',
        errors: ['Invalid activity ID format'],
      });
    }

    const activity = await Activity.findById(id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found.',
        errors: ['No activity found with the provided ID'],
      });
    }

    // Ownership check (allow if owner or admin)
    if (activity.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You do not have permission to view this activity.',
        errors: ['Access denied'],
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Activity retrieved successfully.',
      data: { activity },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an activity
// @route   PATCH /api/v1/activities/:id
export const updateActivity = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Invalid activity identifier.',
        errors: ['Invalid activity ID format'],
      });
    }

    const activity = await Activity.findById(id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found.',
        errors: ['No activity found with the provided ID'],
      });
    }

    // Ownership check
    if (activity.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You cannot modify activities belonging to another user.',
        errors: ['Access denied'],
      });
    }

    // Permitted fields only (prevent mass assignment of user id etc)
    const allowedUpdates = ['exercise', 'category', 'duration', 'calories', 'date', 'notes'];
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        activity[field] = req.body[field];
      }
    });

    await activity.save();

    return res.status(200).json({
      success: true,
      message: 'Activity updated successfully.',
      data: { activity },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an activity
// @route   DELETE /api/v1/activities/:id
export const deleteActivity = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Invalid activity identifier.',
        errors: ['Invalid activity ID format'],
      });
    }

    const activity = await Activity.findById(id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found.',
        errors: ['No activity found with the provided ID'],
      });
    }

    // Ownership check
    if (activity.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You cannot delete activities belonging to another user.',
        errors: ['Access denied'],
      });
    }

    await Activity.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Activity record deleted successfully.',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
