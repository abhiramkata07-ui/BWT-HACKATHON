import mongoose from 'mongoose';
import { Goal } from '../models/Goal.js';
import { Activity } from '../models/Activity.js';

// Helper to calculate progress for goals
const calculateGoalProgress = async (userId, goals) => {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  // Month start/end
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  // Week activities aggregate
  const weekStats = await Activity.aggregate([
    { $match: { user: userId, date: { $gte: monday, $lte: sunday } } },
    {
      $group: {
        _id: null,
        workouts: { $sum: 1 },
        duration: { $sum: '$duration' },
        calories: { $sum: '$calories' },
      },
    },
  ]);

  // Month activities aggregate
  const monthStats = await Activity.aggregate([
    { $match: { user: userId, date: { $gte: monthStart, $lte: monthEnd } } },
    {
      $group: {
        _id: null,
        workouts: { $sum: 1 },
        duration: { $sum: '$duration' },
        calories: { $sum: '$calories' },
      },
    },
  ]);

  const week = weekStats[0] || { workouts: 0, duration: 0, calories: 0 };
  const month = monthStats[0] || { workouts: 0, duration: 0, calories: 0 };

  return goals.map((g) => {
    const isWeekly = g.period === 'weekly';
    const source = isWeekly ? week : month;
    const current = source[g.type] || 0;
    const percentage = g.target > 0 ? Math.min(100, Math.round((current / g.target) * 100)) : 0;

    return {
      _id: g._id,
      type: g.type,
      target: g.target,
      period: g.period,
      current,
      percentage,
      isCompleted: current >= g.target,
      createdAt: g.createdAt,
      updatedAt: g.updatedAt,
    };
  });
};

// @desc    Create or update a fitness goal
// @route   POST /api/v1/goals
export const createGoal = async (req, res, next) => {
  try {
    const { type, target, period = 'weekly' } = req.body;

    // Upsert goal if same type & period already exists for user
    const goal = await Goal.findOneAndUpdate(
      { user: req.user._id, type, period },
      { target: Number(target) },
      { new: true, upsert: true, runValidators: true }
    );

    const [goalWithProgress] = await calculateGoalProgress(req.user._id, [goal]);

    return res.status(201).json({
      success: true,
      message: 'Fitness goal saved successfully.',
      data: { goal: goalWithProgress },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's goals with progress
// @route   GET /api/v1/goals
export const getGoals = async (req, res, next) => {
  try {
    const goals = await Goal.find({ user: req.user._id }).sort({ createdAt: -1 });
    const goalsWithProgress = await calculateGoalProgress(req.user._id, goals);

    return res.status(200).json({
      success: true,
      message: 'Goals retrieved successfully.',
      data: { goals: goalsWithProgress },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a goal
// @route   PATCH /api/v1/goals/:id
export const updateGoal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { target, period } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Invalid goal identifier.',
        errors: ['Invalid goal ID format'],
      });
    }

    const goal = await Goal.findById(id);
    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found.',
        errors: ['No goal found with the provided ID'],
      });
    }

    if (goal.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You cannot modify goals belonging to another user.',
        errors: ['Access denied'],
      });
    }

    if (target !== undefined) goal.target = Number(target);
    if (period !== undefined) goal.period = period;

    await goal.save();

    const [goalWithProgress] = await calculateGoalProgress(req.user._id, [goal]);

    return res.status(200).json({
      success: true,
      message: 'Goal updated successfully.',
      data: { goal: goalWithProgress },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a goal
// @route   DELETE /api/v1/goals/:id
export const deleteGoal = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Invalid goal identifier.',
        errors: ['Invalid goal ID format'],
      });
    }

    const goal = await Goal.findById(id);
    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found.',
        errors: ['No goal found with the provided ID'],
      });
    }

    if (goal.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You cannot delete goals belonging to another user.',
        errors: ['Access denied'],
      });
    }

    await Goal.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Goal deleted successfully.',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
