import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Dumbbell,
  Clock,
  Flame,
  Calendar,
  FileText,
  Save,
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorState from '../components/ui/ErrorState';

const CATEGORIES = ['Running', 'Cycling', 'Gym', 'Walking', 'Swimming', 'Yoga', 'Other'];

const EditActivityPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState({
    exercise: '',
    category: 'Running',
    duration: '',
    calories: '',
    date: '',
    notes: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/activities/${id}`);
        if (res.data.success) {
          const act = res.data.data.activity;
          setFormData({
            exercise: act.exercise,
            category: act.category,
            duration: act.duration,
            calories: act.calories,
            date: act.date ? new Date(act.date).toISOString().split('T')[0] : '',
            notes: act.notes || '',
          });
        }
      } catch (err) {
        setError(err.message || 'Workout not found or access denied.');
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.exercise.trim()) {
      errors.exercise = 'Exercise name cannot be empty';
    }
    if (!formData.duration || Number(formData.duration) <= 0) {
      errors.duration = 'Duration must be a positive number';
    }
    if (formData.calories === '' || Number(formData.calories) < 0) {
      errors.calories = 'Calories must be 0 or greater';
    }
    if (!formData.date) {
      errors.date = 'Workout date is required';
    }
    if (formData.notes && formData.notes.length > 500) {
      errors.notes = 'Notes cannot exceed 500 characters';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    setError(null);

    try {
      const payload = {
        exercise: formData.exercise.trim(),
        category: formData.category,
        duration: Number(formData.duration),
        calories: Number(formData.calories),
        date: new Date(formData.date).toISOString(),
        notes: formData.notes.trim(),
      };

      const res = await api.patch(`/activities/${id}`, payload);
      if (res.data.success) {
        toast.success('Workout updated successfully in database!');
        navigate(`/activities/${id}`);
      }
    } catch (err) {
      setError(err.message || 'Failed to update workout.');
      toast.error(err.message || 'Failed to update workout.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner text="Retrieving workout to edit..." />
      </div>
    );
  }

  if (error && !formData.exercise) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <ErrorState title="Error Loading Workout" message={error} />
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

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Top back link */}
      <div className="flex items-center justify-between">
        <Link
          to={`/activities/${id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Cancel and Return
        </Link>
      </div>

      <div className="p-6 sm:p-10 rounded-3xl bg-navy-900 border border-slate-800 shadow-2xl relative">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Edit Workout</h1>
          <p className="text-sm text-slate-400 mt-1">
            Update workout parameters and notes. Changes persist immediately to MongoDB.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Exercise Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Exercise Name <span className="text-brand">*</span>
            </label>
            <input
              type="text"
              name="exercise"
              value={formData.exercise}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 bg-slate-950/60 border rounded-xl text-sm text-white focus:outline-none transition-colors ${
                fieldErrors.exercise ? 'border-red-500' : 'border-slate-800 focus:border-brand'
              }`}
            />
            {fieldErrors.exercise && (
              <p className="mt-1 text-xs text-rose-400">{fieldErrors.exercise}</p>
            )}
          </div>

          {/* Category & Date Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Category <span className="text-brand">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-brand transition-colors"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-navy-900 text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Date <span className="text-brand">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 bg-slate-950/60 border rounded-xl text-sm text-white focus:outline-none transition-colors ${
                  fieldErrors.date ? 'border-red-500' : 'border-slate-800 focus:border-brand'
                }`}
              />
              {fieldErrors.date && (
                <p className="mt-1 text-xs text-rose-400">{fieldErrors.date}</p>
              )}
            </div>
          </div>

          {/* Duration & Calories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Duration (Minutes) <span className="text-brand">*</span>
              </label>
              <input
                type="number"
                name="duration"
                min="1"
                max="1440"
                value={formData.duration}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 bg-slate-950/60 border rounded-xl text-sm text-white focus:outline-none transition-colors ${
                  fieldErrors.duration ? 'border-red-500' : 'border-slate-800 focus:border-brand'
                }`}
              />
              {fieldErrors.duration && (
                <p className="mt-1 text-xs text-rose-400">{fieldErrors.duration}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Calories Burned (kcal) <span className="text-brand">*</span>
              </label>
              <input
                type="number"
                name="calories"
                min="0"
                max="20000"
                value={formData.calories}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 bg-slate-950/60 border rounded-xl text-sm text-white focus:outline-none transition-colors ${
                  fieldErrors.calories ? 'border-red-500' : 'border-slate-800 focus:border-brand'
                }`}
              />
              {fieldErrors.calories && (
                <p className="mt-1 text-xs text-rose-400">{fieldErrors.calories}</p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Notes
              </label>
              <span className="text-xs text-slate-500">{formData.notes.length}/500</span>
            </div>
            <textarea
              name="notes"
              rows="3"
              maxLength="500"
              value={formData.notes}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-brand transition-colors resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => navigate(`/activities/${id}`)}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-brand text-navy-950 hover:bg-brand-400 shadow-glow transition-all hover:scale-105 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditActivityPage;
