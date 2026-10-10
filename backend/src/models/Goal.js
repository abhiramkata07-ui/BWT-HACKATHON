import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    type: {
      type: String,
      required: [true, 'Goal type is required'],
      enum: {
        values: ['workouts', 'duration', 'calories'],
        message: '{VALUE} is not a valid goal type',
      },
    },
    target: {
      type: Number,
      required: [true, 'Target value is required'],
      min: [1, 'Target must be a positive number'],
    },
    period: {
      type: String,
      enum: ['weekly', 'monthly'],
      default: 'weekly',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate goal of same type and period for a user
goalSchema.index({ user: 1, type: 1, period: 1 }, { unique: true });

export const Goal = mongoose.model('Goal', goalSchema);
