import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Activity } from '../models/Activity.js';
import { Goal } from '../models/Goal.js';
import { connectDB } from '../config/db.js';

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('[Seed] Clearing existing collections...');
    await User.deleteMany({});
    await Activity.deleteMany({});
    await Goal.deleteMany({});

    console.log('[Seed] Generating hashed passwords...');
    const abhiramPasswordHash = await bcrypt.hash('ABHI@143', 10);
    const demoPasswordHash = await bcrypt.hash('Demo@123', 10);

    console.log('[Seed] Creating demo users...');
    // Primary User (Abhiram - Admin role with full capabilities)
    const abhiram = await User.create({
      name: 'Abhiram',
      email: 'abhiram@fittrack.com',
      username: 'abhiram',
      passwordHash: abhiramPasswordHash,
      role: 'admin',
      isActive: true,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      preferences: {
        theme: 'dark',
        units: 'metric',
        dashboardView: 'detailed',
      },
    });

    // Secondary User (Sarah Connor - Standard User)
    const sarah = await User.create({
      name: 'Sarah Connor',
      email: 'sarah@fittrack.com',
      username: 'sarah',
      passwordHash: demoPasswordHash,
      role: 'user',
      isActive: true,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      preferences: {
        theme: 'dark',
        units: 'metric',
        dashboardView: 'compact',
      },
    });

    // Tertiary User (Mike Vance - Standard User)
    const mike = await User.create({
      name: 'Mike Vance',
      email: 'mike@fittrack.com',
      username: 'mike',
      passwordHash: demoPasswordHash,
      role: 'user',
      isActive: true,
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
      preferences: {
        theme: 'light',
        units: 'imperial',
        dashboardView: 'detailed',
      },
    });

    console.log('[Seed] Creating activities for Abhiram...');
    const now = new Date();

    const getDateOffset = (daysAgo, hours = 8) => {
      const d = new Date(now);
      d.setDate(d.getDate() - daysAgo);
      d.setHours(hours, 30, 0, 0);
      return d;
    };

    const abhiramActivities = [
      {
        user: abhiram._id,
        exercise: 'Sunrise High-Intensity Interval Run',
        category: 'Running',
        duration: 45,
        calories: 520,
        date: getDateOffset(0, 7), // Today morning
        notes: 'Felt energetic! Kept pace at 4:45 min/km for 8 intervals.',
      },
      {
        user: abhiram._id,
        exercise: 'Heavy Upper Body & Core Strength',
        category: 'Gym',
        duration: 60,
        calories: 440,
        date: getDateOffset(1, 18), // Yesterday
        notes: 'Bench press 4x8 @ 85kg, pull-ups and core circuit.',
      },
      {
        user: abhiram._id,
        exercise: 'Scenic Coastal Road Cycling',
        category: 'Cycling',
        duration: 75,
        calories: 680,
        date: getDateOffset(2, 6), // 2 days ago
        notes: 'Challenging headwind on the return loop. Great cadence.',
      },
      {
        user: abhiram._id,
        exercise: 'Vinyasa Flow & Deep Mobility',
        category: 'Yoga',
        duration: 40,
        calories: 190,
        date: getDateOffset(3, 19), // 3 days ago
        notes: 'Focused on hip flexors and lower back active release.',
      },
      {
        user: abhiram._id,
        exercise: 'Olympic Pool Laps & Freestyle Drills',
        category: 'Swimming',
        duration: 50,
        calories: 510,
        date: getDateOffset(4, 7), // 4 days ago
        notes: '2000m total distance. Technique felt smooth and consistent.',
      },
      {
        user: abhiram._id,
        exercise: 'Leg Day Hypertrophy & Squats',
        category: 'Gym',
        duration: 65,
        calories: 490,
        date: getDateOffset(5, 17), // 5 days ago
        notes: 'Squats 5x5 @ 110kg, Bulgarian split squats, Romanian deadlifts.',
      },
      {
        user: abhiram._id,
        exercise: 'Forest Trail Evening Hike',
        category: 'Walking',
        duration: 55,
        calories: 280,
        date: getDateOffset(6, 18), // 6 days ago
        notes: 'Brisk recovery walk with 120m elevation gain.',
      },
      {
        user: abhiram._id,
        exercise: '10K Tempo Run',
        category: 'Running',
        duration: 52,
        calories: 610,
        date: getDateOffset(8, 7),
        notes: 'Maintained steady aerobic heart rate in zone 3.',
      },
      {
        user: abhiram._id,
        exercise: 'Full Body HIIT Conditioning',
        category: 'Gym',
        duration: 35,
        calories: 390,
        date: getDateOffset(10, 12),
        notes: 'Kettlebell swings, burpees, box jumps with minimal rest.',
      },
      {
        user: abhiram._id,
        exercise: 'Hill Climb Mountain Biking',
        category: 'Cycling',
        duration: 80,
        calories: 740,
        date: getDateOffset(12, 9),
        notes: 'Tough climbs, beautiful panoramic view at summit.',
      },
      {
        user: abhiram._id,
        exercise: 'Power Flow Yoga Session',
        category: 'Yoga',
        duration: 45,
        calories: 220,
        date: getDateOffset(15, 8),
        notes: 'Balance poses, arm balances, and breathing exercises.',
      },
      {
        user: abhiram._id,
        exercise: 'Open Water Swim Session',
        category: 'Swimming',
        duration: 40,
        calories: 430,
        date: getDateOffset(18, 16),
        notes: 'Sighting practice and stroke efficiency in calm lake.',
      },
    ];

    await Activity.insertMany(abhiramActivities);

    console.log('[Seed] Creating activities for other users...');
    const otherActivities = [
      {
        user: sarah._id,
        exercise: 'Morning Park Jog',
        category: 'Running',
        duration: 30,
        calories: 310,
        date: getDateOffset(1, 8),
        notes: 'Easy 5k run around city park.',
      },
      {
        user: sarah._id,
        exercise: 'Pilates Core Sculpt',
        category: 'Yoga',
        duration: 45,
        calories: 210,
        date: getDateOffset(3, 18),
        notes: 'Core strength and posture alignment.',
      },
      {
        user: mike._id,
        exercise: 'Heavy Deadlift Session',
        category: 'Gym',
        duration: 70,
        calories: 550,
        date: getDateOffset(2, 17),
        notes: 'Deadlift PR 150kg! Felt strong.',
      },
      {
        user: mike._id,
        exercise: 'Commute Bike Ride',
        category: 'Cycling',
        duration: 35,
        calories: 300,
        date: getDateOffset(4, 8),
        notes: 'Fast commute before work.',
      },
    ];

    await Activity.insertMany(otherActivities);

    console.log('[Seed] Creating goals for Abhiram...');
    const goals = [
      {
        user: abhiram._id,
        type: 'workouts',
        target: 5,
        period: 'weekly',
      },
      {
        user: abhiram._id,
        type: 'duration',
        target: 250,
        period: 'weekly',
      },
      {
        user: abhiram._id,
        type: 'calories',
        target: 2500,
        period: 'weekly',
      },
    ];

    await Goal.insertMany(goals);

    console.log('========================================================');
    console.log(' DATABASE SEEDED SUCCESSFULLY!');
    console.log(' DEMO CREDENTIALS:');
    console.log(' Username: abhiram');
    console.log(' Email:    abhiram@fittrack.com');
    console.log(' Password: ABHI@143');
    console.log(' Role:     admin (full access to Dashboard + Admin panel)');
    console.log('========================================================');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error] ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
