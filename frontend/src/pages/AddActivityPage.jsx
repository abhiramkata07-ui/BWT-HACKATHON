import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Activity,
  Calendar,
  Clock,
  Flame,
  FileText,
  Dumbbell,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const CATEGORIES = ['Running', 'Cycling', 'Gym', 'Walking', 'Swimming', 'Yoga', 'Other'];

const AddActivityPage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState({
    exercise: '',
    category: 'Running',
    duration: '',
    calories: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field specific error
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.exercise.trim()) {
      errors.exercise = 'Exercise name is required';
    } else if (formData.exercise.trim().length < 2) {
      errors.exercise = 'Exercise name must be at least 2 characters';
    }

    if (!formData.duration || Number(formData.duration) <= 0) {
      errors.duration = 'Duration must be a positive number of minutes';
    } else if (Number(formData.duration) > 1440) {
      errors.duration = 'Duration cannot exceed 24 hours (1440 mins)';
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

  // Quick preset helper
  const applyPreset = (presetName, cat, defaultMins, defaultCals) => {
    setFormData((prev) => ({
      ...prev,
      exercise: presetName,
      category: cat,
      duration: defaultMins,
      calories: defaultCals,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setError('');

    try {
      const payload = {
        exercise: formData.exercise.trim(),
        category: formData.category,
        duration: Number(formData.duration),
        calories: Number(formData.calories),
        date: new Date(formData.date).toISOString(),
        notes: formData.notes.trim(),
      };

      const res = await api.post('/activities', payload);

      if (res.data.success) {
        toast.success('Workout recorded and saved to MongoDB successfully!');
        navigate('/activities');
      }
    } catch (err) {
      setError(err.message || 'Failed to save workout. Please try again.');
      toast.error(err.message || 'Failed to save workout.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Top Back Link */}
      <div className="flex items-center justify-between">
        <Link
          to="/activities"
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Workout History
        </Link>
      </div>

      {/* Main Card */}
      <div className="p-6 sm:p-10 rounded-3xl bg-navy-900 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-8 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
              <Dumbbell className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-brand">
              New Activity Record
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Log Workout Session</h1>
          <p className="text-sm text-slate-400 mt-1">
            Capture workout duration, calories, category, and personal notes.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="mb-6 p-4 rounded-2xl bg-navy-950/60 border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-brand" />
            Quick Workout Presets
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              type="button"
              onClick={() => applyPreset('5K Outdoor Run', 'Running', 30, 340)}
              className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-brand hover:text-navy-950 text-slate-300 font-medium transition-all"
            >
              5K Outdoor Run
            </button>
            <button
              type="button"
              onClick={() => applyPreset('Full Body Strength & Weights', 'Gym', 50, 420)}
              className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-brand hover:text-navy-950 text-slate-300 font-medium transition-all"
            >
              Gym Full Body
            </button>
            <button
              type="button"
              onClick={() => applyPreset('20km Road Cycling', 'Cycling', 45, 450)}
              className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-brand hover:text-navy-950 text-slate-300 font-medium transition-all"
            >
              Road Cycling
            </button>
            <button
              type="button"
              onClick={() => applyPreset('Morning Vinyasa Yoga', 'Yoga', 40, 180)}
              className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-brand hover:text-navy-950 text-slate-300 font-medium transition-all"
            >
              Vinyasa Yoga
            </button>
          </div>
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
            <div className="relative">
              <input
                type="text"
                name="exercise"
                value={formData.exercise}
                onChange={handleChange}
                placeholder="e.g. Morning 5K Pace Run, Bench Press 5x5"
                required
                className={`w-full px-4 py-3 bg-slate-950/60 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${
                  fieldErrors.exercise ? 'border-red-500' : 'border-slate-800 focus:border-brand'
                }`}
              />
            </div>
            {fieldErrors.exercise && (
              <p className="mt-1 text-xs text-rose-400">{fieldErrors.exercise}</p>
            )}
          </div>

          {/* Category & Date Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Activity Category <span className="text-brand">*</span>
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

            {/* Date */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Workout Date <span className="text-brand">*</span>
              </label>
              <div className="relative">
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
              </div>
              {fieldErrors.date && (
                <p className="mt-1 text-xs text-rose-400">{fieldErrors.date}</p>
              )}
            </div>
          </div>

          {/* Duration & Calories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Duration */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Duration (Minutes) <span className="text-brand">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="duration"
                  min="1"
                  max="1440"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g. 45"
                  required
                  className={`w-full px-4 py-3 bg-slate-950/60 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${
                    fieldErrors.duration ? 'border-red-500' : 'border-slate-800 focus:border-brand'
                  }`}
                />
              </div>
              {fieldErrors.duration && (
                <p className="mt-1 text-xs text-rose-400">{fieldErrors.duration}</p>
              )}
            </div>

            {/* Calories */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Calories Burned (kcal) <span className="text-brand">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="calories"
                  min="0"
                  max="20000"
                  value={formData.calories}
                  onChange={handleChange}
                  placeholder="e.g. 480"
                  required
                  className={`w-full px-4 py-3 bg-slate-950/60 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${
                    fieldErrors.calories ? 'border-red-500' : 'border-slate-800 focus:border-brand'
                  }`}
                />
              </div>
              {fieldErrors.calories && (
                <p className="mt-1 text-xs text-rose-400">{fieldErrors.calories}</p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Workout Notes (Optional)
              </label>
              <span className="text-xs text-slate-500">{formData.notes.length}/500</span>
            </div>
            <textarea
              name="notes"
              rows="3"
              maxLength="500"
              value={formData.notes}
              onChange={handleChange}
              placeholder="How did you feel? Heart rate, weather, sets and reps, recovery notes..."
              className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand transition-colors resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => navigate('/activities')}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-brand text-navy-950 hover:bg-brand-400 shadow-glow transition-all hover:scale-105 disabled:opacity-50"
            >
              {submitting ? 'Recording Workout...' : 'Save Workout'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddActivityPage;
