# FitTrack — Fitness Activity Dashboard (Full MERN Stack)

> **Track Every Move. Understand Your Progress.**

A production-grade, secure, responsive, full-stack MERN application engineered for athletes and fitness enthusiasts to log workouts, visualize caloric and cardiovascular progress through interactive Recharts analytics, manage fitness goals, and administer multi-tenant user accounts with strict Role-Based Access Control (RBAC).

---

## 🌟 Key Highlights & Problem Statement Solutions

1. **Complete Full-Stack MERN Architecture**:
   - **Frontend**: React.js 18, Vite, Tailwind CSS, Lucide React icons, Recharts interactive charts, Axios client with interceptors, React Context API.
   - **Backend**: Node.js & Express.js REST API (`/api/v1`), MongoDB & Mongoose ODM with aggregation pipelines.
   - **Security**: JWT authentication (HttpOnly cookie + Bearer header fallback), bcryptjs password hashing (10 salt rounds), Helmet security headers, CORS origin verification, express-rate-limit endpoint throttling.

2. **Full CRUD Operations with MongoDB**:
   - Log workouts across 7 categories (*Running, Cycling, Gym, Walking, Swimming, Yoga, Other*).
   - Filter by sport category, search query (exercise and notes), date ranges, and 5 sorting modes (*Newest, Oldest, Duration High/Low, Calories High*).
   - Inspect individual workout metrics, duration, calories, burn rates, and athlete notes.
   - Edit pre-filled workouts with real-time database persistence.
   - Delete workout records with double-confirmation modal safeguards.

3. **Dynamic Interactive Analytics & Aggregations**:
   - 6 Key Executive Metrics: Total Workouts, Total Active Time, Total Caloric Burn, Average Session Duration, Workouts Completed This Week, and Top Sport Discipline.
   - **Daily Calorie & Duration Curve**: Recharts `AreaChart` with gradient fills.
   - **Weekly Volume Bar Chart**: 7-day breakdown of training minutes.
   - **Sport Distribution Donut**: Recharts `PieChart` with dynamic percentages.
   - **Weekday Workout Frequency**: Bar chart analyzing sessions completed across Monday through Sunday.

4. **Goal Milestone Tracking**:
   - Establish weekly or monthly targets for workout frequency, active minutes, and calorie burn.
   - Progress calculated dynamically from actual MongoDB workout records.
   - Visual progress bars with completion indicators and remaining volume counters.

5. **Role-Based Access Control (RBAC)**:
   - **Athletes**: Manage personal workouts, inspect analytics, track goals, and update profile settings.
   - **Administrators**: Protected `/admin` dashboard featuring platform-wide user directory, active/suspended status toggle, user deletion with cascade cleanup, and system-wide aggregate telemetry.

---

## 🚀 Live Demo Credentials

The database has been seeded with demo accounts for immediate testing:

| Role | Username / Identifier | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Administrator / Athlete** | `abhiram` *(or `abhiram@fittrack.com`)* | `ABHI@143` | Full access to Dashboard, Workout CRUD, Analytics, Goals, Profile, and **Admin Control Center** |
| **Standard Athlete** | `sarah@fittrack.com` *(or `sarah`)* | `Demo@123` | Athlete Dashboard, Workouts, Goals, Profile (Restricted from `/admin`) |
| **Standard Athlete** | `mike@fittrack.com` *(or `mike`)* | `Demo@123` | Athlete Dashboard, Workouts, Goals, Profile (Restricted from `/admin`) |

> ⚡ **Tip**: The Login page features a **1-Click Instant Demo Login** button preconfigured for `abhiram` with zero typing required!

---

## 📂 Project Directory Structure

```text
BWT HACKATHON/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # Resilient MongoDB Mongoose connection
│   │   ├── controllers/
│   │   │   ├── activityController.js # Workouts CRUD with ownership checks
│   │   │   ├── adminController.js    # Platform metrics, user directory & status
│   │   │   ├── analyticsController.js# MongoDB aggregation pipelines
│   │   │   ├── authController.js     # Register, login (email/user), logout, getMe
│   │   │   ├── goalController.js     # Goal milestones & progress calculations
│   │   │   └── userController.js     # Profile updates & password modification
│   │   ├── middleware/
│   │   │   ├── auth.js               # JWT verification & restrictTo RBAC
│   │   │   ├── errorHandler.js       # Centralized JSON error & 404 handler
│   │   │   ├── rateLimiter.js        # Auth brute-force rate limiter
│   │   │   └── validate.js           # Zod schema validation middleware
│   │   ├── models/
│   │   │   ├── Activity.js           # Activity schema with compound index
│   │   │   ├── Goal.js               # Fitness goals schema
│   │   │   └── User.js               # Athlete schema with bcrypt compare method
│   │   ├── routes/
│   │   │   ├── activityRoutes.js     # /api/v1/activities endpoints
│   │   │   ├── adminRoutes.js        # /api/v1/admin endpoints (restricted)
│   │   │   ├── analyticsRoutes.js    # /api/v1/analytics endpoints
│   │   │   ├── authRoutes.js         # /api/v1/auth endpoints
│   │   │   ├── goalRoutes.js         # /api/v1/goals endpoints
│   │   │   └── userRoutes.js         # /api/v1/users endpoints
│   │   ├── schemas/
│   │   │   └── validationSchemas.js  # Zod validation schemas
│   │   ├── tests/
│   │   │   └── api.test.js           # Vitest + Supertest integration tests
│   │   ├── utils/
│   │   │   └── seed.js               # MongoDB seeder for Abhiram & demo data
│   │   ├── app.js                    # Express app configuration & middleware
│   │   └── server.js                 # Server listener & database initializer
│   ├── .env                          # Environment variables
│   ├── .env.example                  # Environment configuration template
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── DashboardLayout.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── Topbar.jsx
│   │   │   └── ui/
│   │   │       ├── AdminRoute.jsx
│   │   │       ├── EmptyState.jsx
│   │   │       ├── ErrorState.jsx
│   │   │       ├── LoadingSpinner.jsx
│   │   │       ├── MetricCard.jsx
│   │   │       ├── Modal.jsx
│   │   │       └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # User state, auto-login check, tokens
│   │   │   ├── ThemeContext.jsx      # Dark / Light theme toggle
│   │   │   └── ToastContext.jsx      # Animated toast notifications
│   │   ├── pages/
│   │   │   ├── ActivitiesPage.jsx    # Workout history, search, sort, filter
│   │   │   ├── ActivityDetailsPage.jsx # Individual workout statistics
│   │   │   ├── AddActivityPage.jsx   # Log workout form with quick presets
│   │   │   ├── AdminPage.jsx         # Administrative directory & platform stats
│   │   │   ├── AnalyticsPage.jsx     # Recharts area, bar, and donut charts
│   │   │   ├── DashboardPage.jsx     # Executive dashboard with live cards
│   │   │   ├── EditActivityPage.jsx  # Edit workout with pre-filled inputs
│   │   │   ├── GoalsPage.jsx         # Milestones & weekly progress
│   │   │   ├── LandingPage.jsx       # Public hero, features, and showcase
│   │   │   ├── LoginPage.jsx         # Pre-filled credentials & 1-click access
│   │   │   ├── NotFoundPage.jsx      # Custom 404 page
│   │   │   ├── ProfilePage.jsx       # Profile editor & password change
│   │   │   ├── RegisterPage.jsx      # Athlete account registration
│   │   │   ├── SettingsPage.jsx      # Theme, measurement units & security
│   │   │   └── UnauthorizedPage.jsx  # 403 access denied banner
│   │   ├── services/
│   │   │   └── api.js                # Centralized Axios client with interceptors
│   │   ├── tests/
│   │   │   └── components.test.jsx   # React Testing Library unit tests
│   │   ├── App.jsx                   # Central route registry
│   │   ├── index.css                 # Tailwind CSS directives & glow styles
│   │   └── main.jsx                  # React application entry point
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── package.json                      # Root workspace orchestrator scripts
└── README.md
```

---

## 🛠️ Installation & Setup Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (Tested on Node v24.19.0)
- **MongoDB**: Local MongoDB instance running on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI

### 2. Install Dependencies
From the project root:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Configure Environment Variables
Verify or edit `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/fittrack
JWT_SECRET=fittrack_super_secret_jwt_key_2026_hackathon_secure
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### 4. Seed the Database
Populate the database with Abhiram's admin profile and realistic workout activities:
```bash
cd backend
npm run seed
```

### 5. Start the Application
In separate terminal tabs:

**Terminal 1 — Backend API Server**:
```bash
cd backend
npm run dev
# Server will start on http://localhost:5000
```

**Terminal 2 — Frontend Application**:
```bash
cd frontend
npm run dev
# Frontend will start on http://localhost:5173
```

Now open **`http://localhost:5173`** in your browser!

---

## 🧪 Testing & Verification

### Backend Integration Tests (Vitest & Supertest)
Runs 14 automated test suites covering authentication, password rejection, duplicate handling, workout CRUD, analytics calculations, and administrator RBAC:
```bash
cd backend
npm test
```
*Result: 14 passed (100% pass rate)*

### Frontend Component Tests (React Testing Library & Vitest)
Verifies MetricCard, LoadingSpinner, EmptyState, and Modal components:
```bash
cd frontend
npm test
```
*Result: 4 passed (100% pass rate)*

### Production Frontend Build
```bash
cd frontend
npm run build
```
*Result: Complete optimized build output in `dist/` with zero warnings!*

---

## 📡 REST API Documentation (`/api/v1`)

### Authentication (`/api/v1/auth`)
- `POST /register` — Register a new athlete account (forces `role: 'user'`).
- `POST /login` — Login with username (e.g. `abhiram`) or email; issues JWT cookie and token.
- `POST /logout` — Clears active JWT authentication cookie.
- `GET /me` — Retrieves current authenticated athlete profile.

### Workouts CRUD (`/api/v1/activities`)
- `POST /` — Log a new workout (derives ownership from JWT).
- `GET /` — List workouts with pagination, category filter, date range, search query, and sorting.
- `GET /:id` — Retrieve workout details by ID with ownership verification.
- `PATCH /:id` — Update permitted workout fields (exercise, category, duration, calories, date, notes).
- `DELETE /:id` — Permanently delete workout record.

### Analytics (`/api/v1/analytics`)
- `GET /summary` — Aggregated executive dashboard metrics (workouts this week, averages, goal milestones, top sport).
- `GET /activity-trends` — Daily calorie and duration time series + weekday frequency counts.
- `GET /category-breakdown` — Percentage and volume breakdown by sport discipline.

### Fitness Goals (`/api/v1/goals`)
- `POST /` — Establish or upsert weekly/monthly workout, duration, or calorie targets.
- `GET /` — Retrieve active goals with real-time percentage progress computed from database workouts.
- `PATCH /:id` — Update target values or periods.
- `DELETE /:id` — Delete goal.

### User Profile (`/api/v1/users`)
- `GET /me` — Get athlete profile details.
- `PATCH /me` — Update display name and UI preferences.
- `PATCH /me/password` — Securely change password (verifies current password).

### System Administration (`/api/v1/admin`)
- `GET /overview` — Platform-wide telemetry (total registered users, total activities, hours, and calories).
- `GET /users` — Paginated user directory with search and session counts.
- `GET /users/:id` — Inspect user account details and workout history.
- `PATCH /users/:id/status` — Activate or suspend athlete account access.
- `DELETE /users/:id` — Permanently delete user account and cascade delete associated records.
