import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Plus,
  Trash2,
  Edit,
  Eye,
  Calendar,
  Clock,
  Flame,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Dumbbell,
  AlertCircle,
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import Modal from '../components/ui/Modal';

const CATEGORIES = ['All', 'Running', 'Cycling', 'Gym', 'Walking', 'Swimming', 'Yoga', 'Other'];

const CATEGORY_COLORS = {
  Running: '#10E57A',
  Cycling: '#06B6D4',
  Gym: '#8B5CF6',
  Swimming: '#3B82F6',
  Yoga: '#EC4899',
  Walking: '#F59E0B',
  Other: '#94A3B8',
};

const ActivitiesPage = () => {
  const toast = useToast();

  const [activities, setActivities] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Sorting
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('newest');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchActivities = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page,
        limit: 10,
        sort,
      };

      if (search.trim()) params.search = search.trim();
      if (category !== 'All') params.category = category;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await api.get('/activities', { params });
      if (res.data.success) {
        setActivities(res.data.data.activities);
        setPagination(res.data.data.pagination);
      }
    } catch (err) {
      setError(err.message || 'Failed to load activities.');
    } finally {
      setLoading(false);
    }
  }, [search, category, sort, startDate, endDate]);

  useEffect(() => {
    fetchActivities(1);
  }, [fetchActivities]);

  const handleClearFilters = () => {
    setSearch('');
    setCategory('All');
    setSort('newest');
    setStartDate('');
    setEndDate('');
  };

  const openDeleteModal = (activity) => {
    setSelectedActivity(activity);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedActivity) return;
    setDeleting(true);
    try {
      await api.delete(`/activities/${selectedActivity._id}`);
      toast.success(`Deleted "${selectedActivity.exercise}" successfully.`);
      setDeleteModalOpen(false);
      setSelectedActivity(null);
      fetchActivities(pagination.page);
    } catch (err) {
      toast.error(err.message || 'Failed to delete activity.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Workout History</h1>
          <p className="text-sm text-slate-400 mt-1">
            Browse, filter, and inspect all {pagination.total} logged training sessions
          </p>
        </div>

        <Link
          to="/activities/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-brand text-navy-950 hover:bg-brand-400 shadow-glow transition-all self-start sm:self-auto hover:scale-105"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Log Workout
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-navy-900 border border-slate-800 shadow-lg space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by exercise or notes..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand transition-colors"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-brand transition-colors"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-navy-900 text-white">
                  Category: {c}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-brand transition-colors"
            >
              <option value="newest" className="bg-navy-900 text-white">Sort: Newest First</option>
              <option value="oldest" className="bg-navy-900 text-white">Sort: Oldest First</option>
              <option value="duration_desc" className="bg-navy-900 text-white">Duration (High to Low)</option>
              <option value="duration_asc" className="bg-navy-900 text-white">Duration (Low to High)</option>
              <option value="calories_desc" className="bg-navy-900 text-white">Calories (High to Low)</option>
            </select>
          </div>

          {/* Date Range & Clear */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-1/2 px-2 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-brand"
              title="Start Date"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-1/2 px-2 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-brand"
              title="End Date"
            />
          </div>
        </div>

        {/* Active Filters Summary & Reset */}
        {(search || category !== 'All' || startDate || endDate || sort !== 'newest') && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
            <span className="text-slate-400">Filters applied</span>
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-1 text-brand hover:underline font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Content State */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner text="Loading workout history..." />
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={() => fetchActivities(1)} />
      ) : activities.length === 0 ? (
        <EmptyState
          title="No Workouts Found"
          description={
            search || category !== 'All' || startDate
              ? 'No workout records matched your active filters. Try adjusting your search query or dates.'
              : 'You have not logged any workouts yet. Click below to add your first training session!'
          }
          actionLabel="Log Workout"
          actionLink="/activities/new"
        />
      ) : (
        <div className="p-4 sm:p-6 rounded-2xl bg-navy-900 border border-slate-800 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="pb-3 pl-2">Exercise</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3 text-right">Duration</th>
                  <th className="pb-3 text-right">Calories</th>
                  <th className="pb-3 hidden md:table-cell">Notes Preview</th>
                  <th className="pb-3 pr-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {activities.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="py-3.5 pl-2 font-semibold text-white">
                      <Link to={`/activities/${item._id}`} className="hover:text-brand transition-colors">
                        {item.exercise}
                      </Link>
                    </td>
                    <td className="py-3.5">
                      <span
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase"
                        style={{
                          backgroundColor: `${CATEGORY_COLORS[item.category] || '#94A3B8'}1A`,
                          color: CATEGORY_COLORS[item.category] || '#94A3B8',
                          border: `1px solid ${CATEGORY_COLORS[item.category] || '#94A3B8'}40`,
                        }}
                      >
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-300 whitespace-nowrap">
                      {new Date(item.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 text-right font-medium text-slate-200">
                      {item.duration} min
                    </td>
                    <td className="py-3.5 text-right font-bold text-brand">
                      {item.calories} kcal
                    </td>
                    <td className="py-3.5 hidden md:table-cell text-slate-400 max-w-xs truncate">
                      {item.notes || '—'}
                    </td>
                    <td className="py-3.5 pr-2 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/activities/${item._id}`}
                          title="View Details"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/activities/${item._id}/edit`}
                          title="Edit Workout"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-brand hover:bg-brand/10 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => openDeleteModal(item)}
                          title="Delete Workout"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-slate-800/80 text-xs">
              <span className="text-slate-400">
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} total workouts)
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={!pagination.hasPrevPage}
                  onClick={() => fetchActivities(pagination.page - 1)}
                  className="p-2 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-300 hover:text-white disabled:opacity-40 disabled:hover:text-slate-300 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={!pagination.hasNextPage}
                  onClick={() => fetchActivities(pagination.page + 1)}
                  className="p-2 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-300 hover:text-white disabled:opacity-40 disabled:hover:text-slate-300 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Workout Record"
        message={`Are you sure you want to delete "${selectedActivity?.exercise}"? This action cannot be undone.`}
        confirmText="Delete Record"
        isDanger={true}
        isLoading={deleting}
      />
    </div>
  );
};

export default ActivitiesPage;
