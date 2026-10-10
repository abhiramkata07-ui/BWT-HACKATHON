import { z } from 'zod';

export const registerSchema = z.object({
  body: z
    .object({
      name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters'),
      email: z.string().email('Please enter a valid email address').toLowerCase().trim(),
      password: z.string().min(6, 'Password must be at least 6 characters'),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().min(1, 'Email or username is required').trim(),
    password: z.string().min(1, 'Password is required'),
    rememberMe: z.boolean().optional(),
  }),
});

export const activitySchema = z.object({
  body: z.object({
    exercise: z.string().min(2, 'Exercise name must be at least 2 characters').max(100, 'Exercise name cannot exceed 100 characters').trim(),
    category: z.enum(['Walking', 'Running', 'Cycling', 'Gym', 'Yoga', 'Swimming', 'Other'], {
      errorMap: () => ({ message: 'Please select a valid activity category' }),
    }),
    duration: z.coerce.number().positive('Duration must be greater than 0 minutes').max(1440, 'Duration cannot exceed 1440 minutes'),
    calories: z.coerce.number().min(0, 'Calories burned cannot be negative').max(20000, 'Calories burned cannot exceed 20,000'),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: 'Workout date must be a valid date',
    }),
    notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional().default(''),
  }),
});

export const activityUpdateSchema = z.object({
  body: z.object({
    exercise: z.string().min(2, 'Exercise name must be at least 2 characters').max(100).trim().optional(),
    category: z.enum(['Walking', 'Running', 'Cycling', 'Gym', 'Yoga', 'Swimming', 'Other']).optional(),
    duration: z.coerce.number().positive('Duration must be greater than 0 minutes').max(1440).optional(),
    calories: z.coerce.number().min(0, 'Calories burned cannot be negative').max(20000).optional(),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date format' }).optional(),
    notes: z.string().max(500).optional(),
  }),
});

export const goalSchema = z.object({
  body: z.object({
    type: z.enum(['workouts', 'duration', 'calories'], {
      errorMap: () => ({ message: 'Goal type must be workouts, duration, or calories' }),
    }),
    target: z.coerce.number().positive('Target must be a positive number'),
    period: z.enum(['weekly', 'monthly']).default('weekly'),
  }),
});

export const profileUpdateSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(50).optional(),
    avatar: z.string().optional(),
    preferences: z
      .object({
        theme: z.enum(['dark', 'light']).optional(),
        units: z.enum(['metric', 'imperial']).optional(),
        dashboardView: z.enum(['detailed', 'compact']).optional(),
      })
      .optional(),
  }),
});

export const passwordChangeSchema = z.object({
  body: z
    .object({
      currentPassword: z.string().min(1, 'Current password is required'),
      newPassword: z.string().min(6, 'New password must be at least 6 characters'),
      confirmNewPassword: z.string().min(6, 'Please confirm your new password'),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: 'New passwords do not match',
      path: ['confirmNewPassword'],
    }),
});
