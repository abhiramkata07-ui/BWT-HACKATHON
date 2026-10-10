import React from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Flame,
  TrendingUp,
  Target,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle,
  BarChart2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col selection:bg-brand selection:text-navy-950">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* Background glow orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/15 blur-[140px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand/10 border border-brand/30 text-brand text-xs font-semibold uppercase tracking-wider mb-8 shadow-glow">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen MERN Fitness Activity Intelligence</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Track Every Move. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand via-emerald-300 to-cyan-400">
              Understand Your Progress.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            FitTrack transforms everyday workout logs into actionable cardiovascular insights,
            progress analytics, and personalized milestone tracking.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm bg-brand text-navy-950 hover:bg-brand-400 shadow-glow transition-all hover:scale-105"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-all"
            >
              Log In as Abhiram
            </Link>
          </div>

          {/* Interactive UI Mockup Preview */}
          <div className="mt-16 relative max-w-5xl mx-auto rounded-3xl p-3 bg-gradient-to-b from-slate-700/40 via-slate-800/20 to-transparent border border-slate-700/60 shadow-2xl">
            <div className="rounded-2xl bg-navy-900 border border-slate-800 p-6 sm:p-8 text-left overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/30 flex items-center justify-center text-brand">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold">FitTrack Executive Dashboard</h4>
                    <p className="text-xs text-slate-400">Live MongoDB Aggregation Pipeline</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    API Active: 200 OK
                  </span>
                </div>
              </div>

              {/* Mock metric row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="p-4 rounded-xl bg-navy-950/60 border border-slate-800">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Total Workouts</span>
                  <div className="text-2xl font-bold text-white mt-1">12 Sessions</div>
                  <span className="text-xs text-brand font-medium">Active This Month</span>
                </div>
                <div className="p-4 rounded-xl bg-navy-950/60 border border-slate-800">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Calories Burned</span>
                  <div className="text-2xl font-bold text-brand mt-1">5,890 kcal</div>
                  <span className="text-xs text-slate-400 font-medium">98% of weekly target</span>
                </div>
                <div className="p-4 rounded-xl bg-navy-950/60 border border-slate-800">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Workout Hours</span>
                  <div className="text-2xl font-bold text-cyan-400 mt-1">10.8 hrs</div>
                  <span className="text-xs text-slate-400 font-medium">54 min avg / session</span>
                </div>
                <div className="p-4 rounded-xl bg-navy-950/60 border border-slate-800">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Top Discipline</span>
                  <div className="text-2xl font-bold text-purple-400 mt-1">Running</div>
                  <span className="text-xs text-slate-400 font-medium">40% of all sessions</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Highlight Section */}
      <section id="features" className="py-20 bg-navy-900/60 border-t border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand mb-2">Built for Performance</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
              Complete Workout Intelligence at Your Fingertips
            </h3>
            <p className="mt-4 text-slate-400">
              Engineered with full MongoDB CRUD persistence, dynamic Recharts visualizations, and secure JWT authentication.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-navy-900 border border-slate-800 hover:border-slate-700 transition-all card-hover-effect">
              <div className="w-12 h-12 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand mb-6 shadow-glow">
                <Flame className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Comprehensive CRUD</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Log, filter, sort, update, and inspect your workouts across 7 sports categories with calorie tracking and notes.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-navy-900 border border-slate-800 hover:border-slate-700 transition-all card-hover-effect">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6 shadow-glow-cyan">
                <BarChart2 className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Interactive Analytics</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Visualize weekly trends, daily volume curves, weekday distributions, and sport category breakdowns using Recharts.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-navy-900 border border-slate-800 hover:border-slate-700 transition-all card-hover-effect">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Role-Based Security</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Protected JWT sessions, bcrypt password hashing, data ownership checks, and a dedicated Administrator panel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand mb-2">Streamlined Workflow</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">How FitTrack Works</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative p-6 rounded-2xl bg-navy-900/60 border border-slate-800 text-center">
              <div className="w-10 h-10 rounded-full bg-brand text-navy-950 font-extrabold flex items-center justify-center mx-auto mb-4 text-sm">
                1
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Record Your Session</h4>
              <p className="text-sm text-slate-400">
                Enter exercise name, duration, date, and calories burned with instant client & server validation.
              </p>
            </div>

            <div className="relative p-6 rounded-2xl bg-navy-900/60 border border-slate-800 text-center">
              <div className="w-10 h-10 rounded-full bg-cyan-400 text-navy-950 font-extrabold flex items-center justify-center mx-auto mb-4 text-sm">
                2
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Automated Aggregation</h4>
              <p className="text-sm text-slate-400">
                MongoDB pipeline computes your weekly totals, duration averages, and goal milestone percentages.
              </p>
            </div>

            <div className="relative p-6 rounded-2xl bg-navy-900/60 border border-slate-800 text-center">
              <div className="w-10 h-10 rounded-full bg-purple-400 text-navy-950 font-extrabold flex items-center justify-center mx-auto mb-4 text-sm">
                3
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Crush Your Goals</h4>
              <p className="text-sm text-slate-400">
                Stay consistent with real-time feedback, week-over-week comparisons, and progress indicators.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-12 bg-navy-950 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand/10 border border-brand/30 flex items-center justify-center text-brand">
              <Activity className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-white">
              Fit<span className="text-brand">Track</span> — Fitness Activity Dashboard
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Full MERN Stack Hackathon Project. Created for Abhiram. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <Link to="/login" className="hover:text-brand transition-colors">Login</Link>
            <Link to="/register" className="hover:text-brand transition-colors">Sign Up</Link>
            <Link to="/dashboard" className="hover:text-brand transition-colors">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
