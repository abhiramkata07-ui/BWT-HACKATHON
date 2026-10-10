import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Flame,
  FileText,
  Edit,
  Trash2,
  Tag,
  Dumbbell,
  CheckCircle,
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorState from '../components/ui/ErrorState';
import Modal from '../components/ui/Modal';

const CATEGORY_COLORS = {
  Running: '#10E57A',
  Cycling: '#06B6D4',
  Gym: '#8B5CF6',
  Swimming: '#3B82F6',
  Yoga: '#EC4899',
  Walking: '#F59E0B',
  Other: '#94A3B8',
};

const ActivityDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/activities/${id}`);
        if (res.data.success) {
          setActivity(res.data.data.activity);
        }
      } catch (err) {
        setError(err.message || 'Workout not found or access denied.');
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/activities/${id}`);
      toast.success('Workout deleted successfully.');
      navigate('/activities');
    } catch (err) {
      toast.error(err.message || 'Failed to delete workout.');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner text="Retrieving workout details..." />
      </div>
    );
  }

  if (error || !activity) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <ErrorState
          title="Workout Not Found"
          message={error || 'This activity record could not be found or you do not have permission to view it.'}
        />
        <div className="mt-4 text-center">
          <Link
            to="/activities"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Activities
          </Link>
        </div>
      </div>
    );
  }

  const categoryColor = CATEGORY_COLORS[activity.category] || '#94A3B8';

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Back button & Action buttons */}
      <div className="flex items-center justify-between">
        <Link
          to="/activities"
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Workouts
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to={`/activities/${activity._id}/edit`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 border border-slate-700 transition-colors"
          >
            <Edit className="w-3.5 h-3.5" />
            Edit
          </Link>
          <button
            onClick={() => setDeleteModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/30 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      </div>

      {/* Main Details Card */}
      <div className="p-6 sm:p-10 rounded-3xl bg-navy-900 border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Category Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-800">
          <span
            className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider"
            style={{
              backgroundColor: `${categoryColor}1A`,
              color: categoryColor,
              border: `1px solid ${categoryColor}40`,
            }}
          >
            {activity.category}
          </span>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {new Date(activity.date).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="my-6">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {activity.exercise}
          </h1>
          <p className="text-xs text-slate-500 mt-2">
            Logged on {new Date(activity.createdAt).toLocaleString()}
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 my-8">
          <div className="p-4 rounded-2xl bg-navy-950/60 border border-slate-800">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase mb-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              Duration
            </div>
            <div className="text-2xl font-extrabold text-white">
              {activity.duration} <span className="text-xs font-normal text-slate-400">mins</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-navy-950/60 border border-slate-800">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase mb-1">
              <Flame className="w-3.5 h-3.5 text-brand" />
              Calories Burned
            </div>
            <div className="text-2xl font-extrabold text-brand">
              {activity.calories} <span className="text-xs font-normal text-slate-400">kcal</span>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-navy-950/60 border border-slate-800">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase mb-1">
              <Dumbbell className="w-3.5 h-3.5 text-purple-400" />
              Burn Rate
            </div>
            <div className="text-2xl font-extrabold text-purple-400">
              {activity.duration > 0 ? Math.round(activity.calories / activity.duration * 10) / 10 : 0}{' '}
              <span className="text-xs font-normal text-slate-400">kcal/min</span>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="pt-6 border-t border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand" />
            Athlete Session Notes
          </h3>
          <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 text-sm text-slate-300 leading-relaxed min-h-[90px]">
            {activity.notes ? activity.notes : <span className="italic text-slate-500">No notes recorded for this workout.</span>}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Workout Record"
        message={`Are you sure you want to permanently delete "${activity.exercise}"? This action cannot be undone.`}
        confirmText="Yes, Delete Record"
        isDanger={true}
        isLoading={deleting}
      />
    </div>
  );
};

export default ActivityDetailsPage;
