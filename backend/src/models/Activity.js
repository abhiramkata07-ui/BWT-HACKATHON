import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    exercise: {
      type: String,
      required: [true, 'Exercise name is required'],
      trim: true,
      maxlength: [100, 'Exercise name cannot exceed 100 characters'],
    },
    category: {
      type: String,
      required: [true, 'Exercise category is required'],
      enum: {
        values: ['Walking', 'Running', 'Cycling', 'Gym', 'Yoga', 'Swimming', 'Other'],
        message: '{VALUE} is not a supported activity category',
      },
      default: 'Running',
      index: true,
    },
    duration: {
      type: Number,
      required: [true, 'Duration in minutes is required'],
      min: [1, 'Duration must be at least 1 minute'],
      max: [1440, 'Duration cannot exceed 24 hours (1440 minutes)'],
    },
    date: {
      type: Date,
      required: [true, 'Workout date is required'],
      default: Date.now,
      index: true,
    },
    calories: {
      type: Number,
      required: [true, 'Calories burned is required'],
      min: [0, 'Calories burned cannot be negative'],
      max: [20000, 'Calories burned value is unrealistically high'],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for user workouts ordered by date
activitySchema.index({ user: 1, date: -1 });
activitySchema.index({ user: 1, category: 1 });

export const Activity = mongoose.model('Activity', activitySchema);
