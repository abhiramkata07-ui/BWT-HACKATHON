import mongoose from 'mongoose';
import { Activity } from '../models/Activity.js';
import { Goal } from '../models/Goal.js';

// Helper to get start and end of current week (Monday to Sunday)
const getCurrentWeekRange = () => {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day; // If Sunday (0), go back 6 days
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return { start: monday, end: sunday };
};

// @desc    Get dashboard metrics & summary
// @route   GET /api/v1/analytics/summary
export const getSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { start: weekStart, end: weekEnd } = getCurrentWeekRange();

    // 1. All-time aggregate stats
    const allStats = await Activity.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalWorkouts: { $sum: 1 },
          totalDuration: { $sum: '$duration' },
          totalCalories: { $sum: '$calories' },
          avgDuration: { $avg: '$duration' },
        },
      },
    ]);

    const summary = allStats[0] || {
      totalWorkouts: 0,
      totalDuration: 0,
      totalCalories: 0,
      avgDuration: 0,
    };

    // 2. This week's workouts count & stats
    const thisWeekStats = await Activity.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: weekStart, $lte: weekEnd },
        },
      },
      {
        $group: {
          _id: null,
          workoutsThisWeek: { $sum: 1 },
          durationThisWeek: { $sum: '$duration' },
          caloriesThisWeek: { $sum: '$calories' },
        },
      },
    ]);

    const weekSummary = thisWeekStats[0] || {
      workoutsThisWeek: 0,
      durationThisWeek: 0,
      caloriesThisWeek: 0,
    };

    // 3. Most frequent exercise
    const topExercises = await Activity.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    const mostFrequentExercise = topExercises.length > 0 ? topExercises[0]._id : 'None';

    // 4. Last 7 days daily breakdown for weekly activity bar chart
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const dailyActivity = await Activity.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          duration: { $sum: '$duration' },
          calories: { $sum: '$calories' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Build complete 7-day array including days with 0 activity
    const last7DaysMap = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      last7DaysMap[dateStr] = {
        date: dateStr,
        day: dayName,
        duration: 0,
        calories: 0,
        count: 0,
      };
    }

    dailyActivity.forEach((item) => {
      if (last7DaysMap[item._id]) {
        last7DaysMap[item._id].duration = item.duration;
        last7DaysMap[item._id].calories = item.calories;
        last7DaysMap[item._id].count = item.count;
      }
    });

    const weeklyActivityChart = Object.values(last7DaysMap);

    // 5. Category breakdown
    const categoryDistribution = await Activity.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          duration: { $sum: '$duration' },
          calories: { $sum: '$calories' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // 6. Recent 5 workouts
    const recentWorkouts = await Activity.find({ user: userId })
      .sort({ date: -1, createdAt: -1 })
      .limit(5);

    // 7. Goals with progress
    const goals = await Goal.find({ user: userId });
    const goalsWithProgress = goals.map((goal) => {
      let current = 0;
      if (goal.type === 'workouts') {
        current = weekSummary.workoutsThisWeek;
      } else if (goal.type === 'duration') {
        current = weekSummary.durationThisWeek;
      } else if (goal.type === 'calories') {
        current = weekSummary.caloriesThisWeek;
      }

      const percentage = goal.target > 0 ? Math.min(100, Math.round((current / goal.target) * 100)) : 0;

      return {
        _id: goal._id,
        type: goal.type,
        target: goal.target,
        period: goal.period,
        current,
        percentage,
        isCompleted: current >= goal.target,
      };
    });

    return res.status(200).json({
      success: true,
      message: 'Dashboard summary retrieved successfully.',
      data: {
        metrics: {
          totalWorkouts: summary.totalWorkouts,
          totalDuration: summary.totalDuration,
          totalCalories: summary.totalCalories,
          avgDuration: Math.round(summary.avgDuration || 0),
          workoutsThisWeek: weekSummary.workoutsThisWeek,
          caloriesThisWeek: weekSummary.caloriesThisWeek,
          durationThisWeek: weekSummary.durationThisWeek,
          mostFrequentExercise,
        },
        weeklyActivityChart,
        categoryDistribution: categoryDistribution.map((c) => ({
          name: c._id,
          count: c.count,
          duration: c.duration,
          calories: c.calories,
        })),
        recentWorkouts,
        goals: goalsWithProgress,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get detailed activity trends (date range filterable)
// @route   GET /api/v1/analytics/activity-trends
export const getActivityTrends = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { timeRange = '30d', startDate, endDate } = req.query;

    let filterStartDate;
    const now = new Date();

    if (startDate) {
      filterStartDate = new Date(startDate);
    } else {
      filterStartDate = new Date();
      if (timeRange === '7d') {
        filterStartDate.setDate(now.getDate() - 7);
      } else if (timeRange === '30d') {
        filterStartDate.setDate(now.getDate() - 30);
      } else if (timeRange === '90d') {
        filterStartDate.setDate(now.getDate() - 90);
      } else if (timeRange === 'year') {
        filterStartDate.setFullYear(now.getFullYear() - 1);
      } else {
        filterStartDate = new Date(0); // All time
      }
    }

    const matchQuery = {
      user: userId,
      date: { $gte: filterStartDate },
    };

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      matchQuery.date.$lte = end;
    }

    // Daily trends
    const dailyData = await Activity.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          duration: { $sum: '$duration' },
          calories: { $sum: '$calories' },
          workouts: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Frequency by day of week (1=Sunday, 7=Saturday in Mongo)
    const weekdayData = await Activity.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: { $dayOfWeek: '$date' },
          count: { $sum: 1 },
          duration: { $sum: '$duration' },
          calories: { $sum: '$calories' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekdayFrequency = dayNames.map((name, index) => {
      const found = weekdayData.find((w) => w._id === index + 1);
      return {
        day: name,
        workouts: found ? found.count : 0,
        duration: found ? found.duration : 0,
        calories: found ? found.calories : 0,
      };
    });

    return res.status(200).json({
      success: true,
      message: 'Activity trends retrieved successfully.',
      data: {
        dailyTrends: dailyData.map((d) => ({
          date: d._id,
          duration: d.duration,
          calories: d.calories,
          workouts: d.workouts,
        })),
        weekdayFrequency,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get category breakdown with percentages
// @route   GET /api/v1/analytics/category-breakdown
export const getCategoryBreakdown = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const breakdown = await Activity.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          duration: { $sum: '$duration' },
          calories: { $sum: '$calories' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const totalWorkouts = breakdown.reduce((acc, curr) => acc + curr.count, 0);

    const data = breakdown.map((item) => ({
      category: item._id,
      count: item.count,
      duration: item.duration,
      calories: item.calories,
      percentage: totalWorkouts > 0 ? Math.round((item.count / totalWorkouts) * 100) : 0,
    }));

    return res.status(200).json({
      success: true,
      message: 'Category breakdown retrieved successfully.',
      data: {
        totalWorkouts,
        categories: data,
      },
    });
  } catch (error) {
    next(error);
  }
};
