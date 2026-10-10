import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Flame,
  Clock,
  Dumbbell,
  Calendar,
  Plus,
  TrendingUp,
  Target,
  ArrowUpRight,
  ChevronRight,
  Award,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import MetricCard from '../components/ui/MetricCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';

const CATEGORY_COLORS = {
  Running: '#10E57A',
  Cycling: '#06B6D4',
  Gym: '#8B5CF6',
  Swimming: '#3B82F6',
  Yoga: '#EC4899',
  Walking: '#F59E0B',
  Other: '#94A3B8',
};

const DashboardPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/analytics/summary');
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner text="Fetching your live fitness metrics..." />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchDashboardData} />;
  }

  const { metrics, weeklyActivityChart, categoryDistribution, recentWorkouts, goals } = data;

  const hasActivities = metrics?.totalWorkouts > 0;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-brand/10 blur-3xl rounded-full pointer-events-none" />

        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-bold border border-brand/20">
              <span className="w-2 h-2 rounded-full bg-brand animate-ping"></span>
              Live Tracking Active
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Welcome back, <span className="text-brand">{user?.name || 'Athlete'}</span>!
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            You have logged <span className="text-white font-semibold">{metrics?.workoutsThisWeek || 0} workouts</span> this week.
            Keep the momentum burning towards your goals!
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/activities/new"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-brand text-navy-950 hover:bg-brand-400 shadow-glow transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Log New Workout
          </Link>
        </div>
      </div>

      {/* 6 Key Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard
          icon={Dumbbell}
          title="Total Workouts"
          value={metrics?.totalWorkouts || 0}
          unit="sessions"
          color="brand"
        />
        <MetricCard
          icon={Clock}
          title="Total Duration"
          value={Math.round((metrics?.totalDuration || 0) / 60 * 10) / 10}
          unit="hours"
          subtitle={`${metrics?.totalDuration || 0} mins`}
          color="cyan"
        />
        <MetricCard
          icon={Flame}
          title="Calories Burned"
          value={(metrics?.totalCalories || 0).toLocaleString()}
          unit="kcal"
          color="orange"
        />
        <MetricCard
          icon={TrendingUp}
          title="Avg Session"
          value={metrics?.avgDuration || 0}
          unit="mins"
          color="purple"
        />
        <MetricCard
          icon={Calendar}
          title="This Week"
          value={metrics?.workoutsThisWeek || 0}
          unit="workouts"
          change={`${metrics?.durationThisWeek || 0} mins logged`}
          color="brand"
        />
        <MetricCard
          icon={Award}
          title="Top Sport"
          value={metrics?.mostFrequentExercise || 'None'}
          color="cyan"
        />
      </div>

      {!hasActivities ? (
        <EmptyState
          title="No Workouts Recorded Yet"
          description="Your fitness dashboard is ready to track your workouts. Record your first session to unlock personalized interactive analytics!"
          actionLabel="Log Your First Workout"
          actionLink="/activities/new"
        />
      ) : (
        <>
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Weekly Activity Bar Chart */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-navy-900 border border-slate-800 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold text-white">Weekly Activity Volume</h3>
                  <p className="text-xs text-slate-400">Duration in minutes over the past 7 days</p>
                </div>
                <Link
                  to="/analytics"
                  className="text-xs font-semibold text-brand hover:underline flex items-center gap-1"
                >
                  Full Trends <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="h-64 sm:h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyActivityChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                    <XAxis dataKey="day" stroke="#64748B" fontSize={12} tickLine={false} />
                    <YAxis stroke="#64748B" fontSize={12} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        color: '#F8FAFC',
                      }}
                      formatter={(val, name) => [`${val} mins`, 'Duration']}
                      labelFormatter={(label) => `Day: ${label}`}
                    />
                    <Bar dataKey="duration" fill="#10E57A" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Exercise Category Breakdown Donut */}
            <div className="p-6 rounded-2xl bg-navy-900 border border-slate-800 shadow-lg flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white mb-1">Exercise Breakdown</h3>
                <p className="text-xs text-slate-400 mb-4">Distribution by activity category</p>
              </div>

              <div className="h-52 w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                    >
                      {categoryDistribution?.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CATEGORY_COLORS[entry.name] || '#94A3B8'}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        color: '#F8FAFC',
                      }}
                      formatter={(val, name) => [`${val} workouts`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-800">
                {categoryDistribution?.slice(0, 4).map((cat) => (
                  <div key={cat.name} className="flex items-center gap-2 text-xs">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: CATEGORY_COLORS[cat.name] || '#94A3B8' }}
                    />
                    <span className="text-slate-300 truncate">{cat.name}</span>
                    <span className="text-slate-400 ml-auto font-medium">{cat.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Goals & Recent Workouts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Fitness Goals Progress Card */}
            <div className="p-6 rounded-2xl bg-navy-900 border border-slate-800 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold text-white">Active Goals Progress</h3>
                  <p className="text-xs text-slate-400">Weekly milestones tracking</p>
                </div>
                <Link to="/goals" className="text-xs font-semibold text-brand hover:underline">
                  Manage
                </Link>
              </div>

              {goals && goals.length > 0 ? (
                <div className="space-y-4">
                  {goals.map((g) => (
                    <div key={g._id} className="p-3.5 rounded-xl bg-navy-950/60 border border-slate-800/80">
                      <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                        <span className="capitalize text-slate-200">
                          {g.type === 'workouts' ? 'Weekly Workouts' : g.type === 'duration' ? 'Weekly Active Mins' : 'Weekly Calories Burned'}
                        </span>
                        <span className="text-brand font-bold">{g.percentage}%</span>
                      </div>
                      {/* Progress bar */}
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-brand to-cyan-400 transition-all duration-500"
                          style={{ width: `${g.percentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-400 mt-1.5 font-medium">
                        <span>{g.current} achieved</span>
                        <span>Target: {g.target} {g.type === 'duration' ? 'mins' : g.type === 'calories' ? 'kcal' : 'workouts'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs">
                  <Target className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p>No active goals set.</p>
                  <Link to="/goals" className="text-brand font-semibold hover:underline mt-1 inline-block">
                    + Set a weekly goal
                  </Link>
                </div>
              )}
            </div>

            {/* Recent Workouts Table */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-navy-900 border border-slate-800 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-white">Recent Workouts</h3>
                  <p className="text-xs text-slate-400">Latest recorded sessions</p>
                </div>
                <Link
                  to="/activities"
                  className="text-xs font-semibold text-brand hover:underline flex items-center gap-1"
                >
                  View All ({metrics?.totalWorkouts || 0}) <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="pb-3">Exercise</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3 text-right">Duration</th>
                      <th className="pb-3 text-right">Calories</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {recentWorkouts?.map((item) => (
                      <tr key={item._id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 text-white font-semibold">{item.exercise}</td>
                        <td className="py-3">
                          <span
                            className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase"
                            style={{
                              backgroundColor: `${CATEGORY_COLORS[item.category] || '#94A3B8'}1A`,
                              color: CATEGORY_COLORS[item.category] || '#94A3B8',
                              border: `1px solid ${CATEGORY_COLORS[item.category] || '#94A3B8'}40`,
                            }}
                          >
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3 text-slate-400">
                          {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </td>
                        <td className="py-3 text-right text-slate-200">{item.duration} min</td>
                        <td className="py-3 text-right text-brand font-bold">{item.calories} kcal</td>
                        <td className="py-3 text-right">
                          <Link
                            to={`/activities/${item._id}`}
                            className="text-slate-400 hover:text-white transition-colors"
                          >
                            Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
