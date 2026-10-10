import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  BarChart3,
  Calendar,
  Flame,
  Clock,
  Dumbbell,
  TrendingUp,
  Filter,
} from 'lucide-react';
import api from '../services/api';
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

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [trends, setTrends] = useState(null);
  const [categories, setCategories] = useState(null);
  const [summaryMetrics, setSummaryMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = { timeRange };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const [resTrends, resCat, resSummary] = await Promise.all([
        api.get('/analytics/activity-trends', { params }),
        api.get('/analytics/category-breakdown'),
        api.get('/analytics/summary'),
      ]);

      if (resTrends.data.success) setTrends(resTrends.data.data);
      if (resCat.data.success) setCategories(resCat.data.data);
      if (resSummary.data.success) setSummaryMetrics(resSummary.data.data.metrics);
    } catch (err) {
      setError(err.message || 'Failed to load analytics data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange, startDate, endDate]);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner text="Computing fitness analytics & aggregations..." />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchAnalytics} />;
  }

  const hasData = trends?.dailyTrends?.length > 0 || (summaryMetrics?.totalWorkouts || 0) > 0;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Page Header & Range Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Fitness Analytics</h1>
          <p className="text-sm text-slate-400 mt-1">
            Deep dive into your training volume, calorie expenditure, and weekday trends
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {['7d', '30d', '90d', 'year', 'all'].map((range) => (
            <button
              key={range}
              onClick={() => {
                setTimeRange(range);
                setStartDate('');
                setEndDate('');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                timeRange === range && !startDate
                  ? 'bg-brand text-navy-950 shadow-glow font-bold'
                  : 'bg-navy-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : range === 'year' ? '1 Year' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* Aggregate Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          icon={Dumbbell}
          title="Total Workouts"
          value={summaryMetrics?.totalWorkouts || 0}
          unit="sessions"
          color="brand"
        />
        <MetricCard
          icon={Clock}
          title="Total Active Time"
          value={Math.round((summaryMetrics?.totalDuration || 0) / 60 * 10) / 10}
          unit="hours"
          color="cyan"
        />
        <MetricCard
          icon={Flame}
          title="Total Caloric Burn"
          value={(summaryMetrics?.totalCalories || 0).toLocaleString()}
          unit="kcal"
          color="orange"
        />
        <MetricCard
          icon={TrendingUp}
          title="Average Duration"
          value={summaryMetrics?.avgDuration || 0}
          unit="mins/session"
          color="purple"
        />
      </div>

      {!hasData ? (
        <EmptyState
          title="No Analytics Available Yet"
          description="Record some workouts to populate charts and uncover training patterns."
          actionLabel="Log a Workout"
          actionLink="/activities/new"
        />
      ) : (
        <>
          {/* Daily Activity Trend (Calories & Duration Area Chart) */}
          <div className="p-6 rounded-3xl bg-navy-900 border border-slate-800 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">Daily Calorie & Duration Curve</h3>
                <p className="text-xs text-slate-400">Energy expenditure and training minutes over time</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium">
                <span className="flex items-center gap-1.5 text-brand">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand" /> Calories (kcal)
                </span>
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Duration (mins)
                </span>
              </div>
            </div>

            <div className="h-72 sm:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trends?.dailyTrends || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10E57A" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10E57A" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                  <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#F8FAFC',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="calories"
                    name="Calories (kcal)"
                    stroke="#10E57A"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorCalories)"
                  />
                  <Area
                    type="monotone"
                    dataKey="duration"
                    name="Duration (mins)"
                    stroke="#06B6D4"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorDuration)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weekday Frequency & Category Distribution Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Workout Frequency by Weekday */}
            <div className="p-6 rounded-3xl bg-navy-900 border border-slate-800 shadow-xl">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white">Workout Frequency by Weekday</h3>
                <p className="text-xs text-slate-400">Total training sessions completed on each day of the week</p>
              </div>

              <div className="h-64 sm:h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trends?.weekdayFrequency || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                    <XAxis dataKey="day" stroke="#64748B" fontSize={12} tickLine={false} />
                    <YAxis stroke="#64748B" fontSize={12} tickLine={false} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        color: '#F8FAFC',
                      }}
                      formatter={(val) => [`${val} workouts`, 'Frequency']}
                    />
                    <Bar dataKey="workouts" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Breakdown Table + Donut */}
            <div className="p-6 rounded-3xl bg-navy-900 border border-slate-800 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Sport Distribution</h3>
                <p className="text-xs text-slate-400 mb-4">Volume breakdown by exercise discipline</p>
              </div>

              <div className="h-52 w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categories?.categories || []}
                      dataKey="count"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                    >
                      {categories?.categories?.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CATEGORY_COLORS[entry.category] || '#94A3B8'}
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
                      formatter={(val, name, item) => [
                        `${val} workouts (${item.payload.percentage}%)`,
                        item.payload.category,
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Category stats grid */}
              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-800">
                {categories?.categories?.map((cat) => (
                  <div key={cat.category} className="p-2.5 rounded-xl bg-navy-950/60 border border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: CATEGORY_COLORS[cat.category] || '#94A3B8' }}
                      />
                      <span className="text-xs font-semibold text-slate-200">{cat.category}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-400">
                      {cat.count} <span className="text-[10px] font-normal text-slate-500">({cat.percentage}%)</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsPage;
