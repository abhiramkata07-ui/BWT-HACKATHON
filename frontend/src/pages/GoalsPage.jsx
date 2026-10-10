import React, { useState, useEffect } from 'react';
import {
  Target,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  Flame,
  Clock,
  Dumbbell,
  Trophy,
  ArrowRight,
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorState from '../components/ui/ErrorState';
import Modal from '../components/ui/Modal';

const GoalsPage = () => {
  const toast = useToast();

  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create/Edit Goal Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [formData, setFormData] = useState({
    type: 'workouts',
    target: '',
    period: 'weekly',
  });
  const [saving, setSaving] = useState(false);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/goals');
      if (res.data.success) {
        setGoals(res.data.data.goals);
      }
    } catch (err) {
      setError(err.message || 'Failed to load fitness goals.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const openCreateModal = () => {
    setEditingGoal(null);
    setFormData({
      type: 'workouts',
      target: '5',
      period: 'weekly',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (goal) => {
    setEditingGoal(goal);
    setFormData({
      type: goal.type,
      target: goal.target.toString(),
      period: goal.period,
    });
    setIsModalOpen(true);
  };

  const handleSaveGoal = async (e) => {
    e.preventDefault();
    if (!formData.target || Number(formData.target) <= 0) {
      toast.error('Target must be a positive number.');
      return;
    }

    setSaving(true);
    try {
      if (editingGoal) {
        await api.patch(`/goals/${editingGoal._id}`, {
          target: Number(formData.target),
          period: formData.period,
        });
        toast.success('Fitness goal updated successfully!');
      } else {
        await api.post('/goals', {
          type: formData.type,
          target: Number(formData.target),
          period: formData.period,
        });
        toast.success('New fitness goal established!');
      }
      setIsModalOpen(false);
      fetchGoals();
    } catch (err) {
      toast.error(err.message || 'Failed to save goal.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDeleteGoal = async () => {
    if (!selectedGoal) return;
    setDeleting(true);
    try {
      await api.delete(`/goals/${selectedGoal._id}`);
      toast.success('Goal deleted.');
      setDeleteModalOpen(false);
      setSelectedGoal(null);
      fetchGoals();
    } catch (err) {
      toast.error(err.message || 'Failed to delete goal.');
    } finally {
      setDeleting(false);
    }
  };

  const getGoalIcon = (type) => {
    if (type === 'workouts') return Dumbbell;
    if (type === 'duration') return Clock;
    return Flame;
  };

  const getGoalUnit = (type) => {
    if (type === 'workouts') return 'sessions';
    if (type === 'duration') return 'minutes';
    return 'kcal';
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Fitness Goals</h1>
          <p className="text-sm text-slate-400 mt-1">
            Set weekly targets for workout frequency, active minutes, and calories burned
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-brand text-navy-950 hover:bg-brand-400 shadow-glow transition-all self-start sm:self-auto hover:scale-105"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Set New Goal
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner text="Loading your goals and calculating real-time progress..." />
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={fetchGoals} />
      ) : goals.length === 0 ? (
        <div className="p-12 rounded-3xl bg-navy-900 border border-slate-800 text-center max-w-xl mx-auto shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand mx-auto mb-4 shadow-glow">
            <Trophy className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No Active Goals Set</h3>
          <p className="text-sm text-slate-400 mb-6">
            Establishing fitness goals helps keep your workouts consistent. Track weekly sessions, active duration, or calories.
          </p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-brand text-navy-950 hover:bg-brand-400 shadow-glow transition-all"
          >
            <Plus className="w-4 h-4" /> Create Your First Goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((g) => {
            const Icon = getGoalIcon(g.type);
            const unit = getGoalUnit(g.type);

            return (
              <div
                key={g._id}
                className="p-6 rounded-3xl bg-navy-900 border border-slate-800 shadow-xl relative overflow-hidden flex flex-col justify-between card-hover-effect"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-brand/10 border border-brand/20 text-brand">
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEditModal(g)}
                        title="Edit Target"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedGoal(g);
                          setDeleteModalOpen(true);
                        }}
                        title="Delete Goal"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white capitalize">
                    {g.period} {g.type === 'workouts' ? 'Workout Sessions' : g.type === 'duration' ? 'Active Minutes' : 'Calorie Target'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Calculated from your workouts logged this week
                  </p>

                  {/* Progress Stats */}
                  <div className="mt-6 flex items-baseline justify-between">
                    <div>
                      <span className="text-3xl font-extrabold text-white">{g.current}</span>
                      <span className="text-xs text-slate-400 ml-1">/ {g.target} {unit}</span>
                    </div>
                    <span className={`text-base font-extrabold ${g.isCompleted ? 'text-brand' : 'text-cyan-400'}`}>
                      {g.percentage}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-2 w-full h-3 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        g.isCompleted
                          ? 'bg-gradient-to-r from-brand to-emerald-400 shadow-glow'
                          : 'bg-gradient-to-r from-cyan-400 to-brand'
                      }`}
                      style={{ width: `${Math.min(100, g.percentage)}%` }}
                    />
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                  {g.isCompleted ? (
                    <span className="inline-flex items-center gap-1.5 text-brand font-bold">
                      <CheckCircle2 className="w-4 h-4" /> Goal Completed!
                    </span>
                  ) : (
                    <span className="text-slate-400 font-medium">
                      {Math.max(0, g.target - g.current)} {unit} remaining
                    </span>
                  )}
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    {g.period}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Goal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-navy-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl relative text-left">
            <h3 className="text-xl font-bold text-white mb-2">
              {editingGoal ? 'Update Fitness Goal' : 'Establish New Fitness Goal'}
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Track progress against your recorded MongoDB workouts.
            </p>

            <form onSubmit={handleSaveGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Goal Metric Type
                </label>
                <select
                  disabled={!!editingGoal}
                  value={formData.type}
                  onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-brand"
                >
                  <option value="workouts">Weekly Workouts Count</option>
                  <option value="duration">Weekly Workout Duration (Minutes)</option>
                  <option value="calories">Weekly Calorie Target (kcal)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Target Value
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.target}
                  onChange={(e) => setFormData((prev) => ({ ...prev, target: e.target.value }))}
                  placeholder="e.g. 5, 250, 2500"
                  className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Tracking Period
                </label>
                <select
                  value={formData.period}
                  onChange={(e) => setFormData((prev) => ({ ...prev, period: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-brand"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-brand text-navy-950 hover:bg-brand-400 shadow-glow"
                >
                  {saving ? 'Saving...' : 'Save Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDeleteGoal}
        title="Delete Fitness Goal"
        message="Are you sure you want to remove this goal? Your workout history will remain unaffected."
        confirmText="Delete Goal"
        isDanger={true}
        isLoading={deleting}
      />
    </div>
  );
};

export default GoalsPage;
