import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import app from '../app.js';
import { connectDB } from '../config/db.js';

let abhiramToken = '';
let regularUserToken = '';
let createdActivityId = '';

beforeAll(async () => {
  await connectDB();

  // Login as Abhiram
  const resAbhiram = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'abhiram', password: 'ABHI@143' });

  expect(resAbhiram.status).toBe(200);
  abhiramToken = resAbhiram.body.data.token;

  // Login as Sarah (Regular user)
  const resSarah = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'sarah@fittrack.com', password: 'Demo@123' });

  expect(resSarah.status).toBe(200);
  regularUserToken = resSarah.body.data.token;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('1. Health Check & API Status', () => {
  it('GET /api/v1/health should return 200 and operational status', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('2. Authentication & Authorization', () => {
  it('POST /api/v1/auth/login with username "abhiram" should authenticate successfully', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'abhiram', password: 'ABHI@143' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.name).toBe('Abhiram');
    expect(res.body.data.user.role).toBe('admin');
  });

  it('POST /api/v1/auth/login with incorrect password should be rejected with 401', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'abhiram', password: 'WrongPassword' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/v1/auth/register should create a new regular user and reject duplicate', async () => {
    const uniqueEmail = `testuser_${Date.now()}@fittrack.com`;
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Test Athlete',
        email: uniqueEmail,
        password: 'Password@123',
        confirmPassword: 'Password@123',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.role).toBe('user');

    // Duplicate test
    const resDup = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Test Athlete',
        email: uniqueEmail,
        password: 'Password@123',
        confirmPassword: 'Password@123',
      });

    expect(resDup.status).toBe(409);
    expect(resDup.body.success).toBe(false);
  });

  it('GET /api/v1/auth/me should return current user info when token provided', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${abhiramToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe('abhiram@fittrack.com');
  });
});

describe('3. Activity CRUD & Ownership Verification', () => {
  it('POST /api/v1/activities should create a new workout for authenticated user', async () => {
    const res = await request(app)
      .post('/api/v1/activities')
      .set('Authorization', `Bearer ${abhiramToken}`)
      .send({
        exercise: 'Vitest Automated 5K Run',
        category: 'Running',
        duration: 28,
        calories: 320,
        date: new Date().toISOString(),
        notes: 'Integration test run',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.activity.exercise).toBe('Vitest Automated 5K Run');
    createdActivityId = res.body.data.activity._id;
  });

  it('GET /api/v1/activities should list user workouts with pagination', async () => {
    const res = await request(app)
      .get('/api/v1/activities')
      .set('Authorization', `Bearer ${abhiramToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.activities)).toBe(true);
    expect(res.body.data.pagination.total).toBeGreaterThan(0);
  });

  it('PATCH /api/v1/activities/:id should update user workout', async () => {
    const res = await request(app)
      .patch(`/api/v1/activities/${createdActivityId}`)
      .set('Authorization', `Bearer ${abhiramToken}`)
      .send({
        duration: 35,
        calories: 400,
      });

    expect(res.status).toBe(200);
    expect(res.body.data.activity.duration).toBe(35);
    expect(res.body.data.activity.calories).toBe(400);
  });

  it('DELETE /api/v1/activities/:id should delete workout', async () => {
    const res = await request(app)
      .delete(`/api/v1/activities/${createdActivityId}`)
      .set('Authorization', `Bearer ${abhiramToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('GET /api/v1/activities/:id with non-existent ID should return 404', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .get(`/api/v1/activities/${fakeId}`)
      .set('Authorization', `Bearer ${abhiramToken}`);

    expect(res.status).toBe(404);
  });
});

describe('4. Analytics & Goals', () => {
  it('GET /api/v1/analytics/summary should calculate metrics from database', async () => {
    const res = await request(app)
      .get('/api/v1/analytics/summary')
      .set('Authorization', `Bearer ${abhiramToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.metrics).toBeDefined();
    expect(res.body.data.metrics.totalWorkouts).toBeGreaterThan(0);
    expect(res.body.data.weeklyActivityChart.length).toBe(7);
  });

  it('GET /api/v1/goals should return user goals with progress', async () => {
    const res = await request(app)
      .get('/api/v1/goals')
      .set('Authorization', `Bearer ${abhiramToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data.goals)).toBe(true);
  });
});

describe('5. Role-Based Access Control (Admin)', () => {
  it('GET /api/v1/admin/overview should succeed for admin (Abhiram)', async () => {
    const res = await request(app)
      .get('/api/v1/admin/overview')
      .set('Authorization', `Bearer ${abhiramToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.totalUsers).toBeGreaterThanOrEqual(3);
  });

  it('GET /api/v1/admin/overview should return 403 Forbidden for regular user (Sarah)', async () => {
    const res = await request(app)
      .get('/api/v1/admin/overview')
      .set('Authorization', `Bearer ${regularUserToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });
});
