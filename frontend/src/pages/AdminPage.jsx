import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldAlert,
  Users,
  Activity,
  Flame,
  Clock,
  Search,
  UserCheck,
  UserX,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Shield,
  AlertCircle,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import MetricCard from '../components/ui/MetricCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorState from '../components/ui/ErrorState';
import Modal from '../components/ui/Modal';

const AdminPage = () => {
  const { user: currentUser } = useAuth();
  const toast = useToast();

  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // User Details Modal
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Delete User Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchOverview = async () => {
    try {
      const res = await api.get('/admin/overview');
      if (res.data.success) {
        setOverview(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load admin overview:', err);
    }
  };

  const fetchUsers = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/admin/users', {
        params: { page, limit: 10, search: search.trim() },
      });
      if (res.data.success) {
        setUsers(res.data.data.users);
        setPagination(res.data.data.pagination);
      }
    } catch (err) {
      setError(err.message || 'Failed to retrieve administrative users list.');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchOverview();
    fetchUsers(1);
  }, [fetchUsers]);

  // Toggle user activation status
  const handleToggleStatus = async (user) => {
    if (user._id === currentUser?.id || user._id === currentUser?._id) {
      toast.error('You cannot alter your own admin active status.');
      return;
    }

    try {
      const res = await api.patch(`/admin/users/${user._id}/status`);
      if (res.data.success) {
        toast.success(res.data.message);
        fetchUsers(pagination.page);
        fetchOverview();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to toggle user status.');
    }
  };

  // View user details
  const handleViewUser = async (user) => {
    setLoadingDetails(true);
    setDetailsModalOpen(true);
    try {
      const res = await api.get(`/admin/users/${user._id}`);
      if (res.data.success) {
        setSelectedUserDetails(res.data.data);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to load user details.');
      setDetailsModalOpen(false);
    } finally {
      setLoadingDetails(false);
    }
  };

  // Delete user account
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/admin/users/${userToDelete._id}`);
      toast.success(`User ${userToDelete.email} and all data permanently deleted.`);
      setDeleteModalOpen(false);
      setUserToDelete(null);
      fetchUsers(pagination.page);
      fetchOverview();
    } catch (err) {
      toast.error(err.message || 'Failed to delete user.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-purple-500/20 text-purple-300">
              <ShieldAlert className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
              Administrative Control Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">System Administration</h1>
          <p className="text-sm text-slate-400 mt-1">
            Platform user directory, security audits, and aggregate multi-tenant workout metrics
          </p>
        </div>
      </div>

      {/* Aggregate Overview Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          icon={Users}
          title="Registered Athletes"
          value={overview?.totalUsers || 0}
          unit="users"
          color="brand"
        />
        <MetricCard
          icon={Activity}
          title="Total Platform Workouts"
          value={overview?.totalActivities || 0}
          unit="sessions"
          color="cyan"
        />
        <MetricCard
          icon={Clock}
          title="Cumulative Hours Logged"
          value={overview?.totalDurationHours || 0}
          unit="hours"
          color="purple"
        />
        <MetricCard
          icon={Flame}
          title="Platform Calories"
          value={(overview?.totalCalories || 0).toLocaleString()}
          unit="kcal"
          color="orange"
        />
      </div>

      {/* Users Management Section */}
      <div className="p-6 rounded-3xl bg-navy-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">User Accounts Directory</h3>
            <p className="text-xs text-slate-400">Search athletes, manage access, and inspect workouts</p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 transition-colors"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-16 flex justify-center">
            <LoadingSpinner text="Loading registered user accounts..." />
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={() => fetchUsers(1)} />
        ) : users.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">
            No users matched your query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="pb-3 pl-2">Athlete</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Workouts</th>
                  <th className="pb-3">Joined Date</th>
                  <th className="pb-3 pr-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {users.map((u) => {
                  const isCurrent = u._id === currentUser?.id || u._id === currentUser?._id;
                  return (
                    <tr key={u._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 pl-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-xs">
                            {u.avatar ? (
                              <img src={u.avatar} alt={u.name} className="w-full h-full object-cover rounded-lg" />
                            ) : (
                              u.name.charAt(0)
                            )}
                          </div>
                          <div>
                            <span className="font-semibold text-white block">
                              {u.name} {isCurrent && <span className="text-[10px] text-brand">(You)</span>}
                            </span>
                            <span className="text-[11px] text-slate-400">{u.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            u.role === 'admin'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.isActive
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              u.isActive ? 'bg-emerald-400' : 'bg-rose-400'
                            }`}
                          />
                          {u.isActive ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="py-3.5 text-slate-200">
                        <span className="font-bold text-white">{u.activityCount || 0}</span> sessions
                      </td>
                      <td className="py-3.5 text-slate-400">
                        {new Date(u.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3.5 pr-2 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleViewUser(u)}
                            title="Inspect User Details"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            disabled={isCurrent}
                            onClick={() => handleToggleStatus(u)}
                            title={u.isActive ? 'Deactivate Account' : 'Activate Account'}
                            className={`p-1.5 rounded-lg transition-colors disabled:opacity-30 ${
                              u.isActive
                                ? 'text-slate-400 hover:text-amber-400 hover:bg-amber-500/10'
                                : 'text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10'
                            }`}
                          >
                            {u.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </button>

                          <button
                            disabled={isCurrent}
                            onClick={() => {
                              setUserToDelete(u);
                              setDeleteModalOpen(true);
                            }}
                            title="Delete Account"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors disabled:opacity-30"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
            <span className="text-slate-400">
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} users)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={!pagination.hasPrevPage}
                onClick={() => fetchUsers(pagination.page - 1)}
                className="p-2 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-300 hover:text-white disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={!pagination.hasNextPage}
                onClick={() => fetchUsers(pagination.page + 1)}
                className="p-2 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-300 hover:text-white disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {detailsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-navy-900 border border-slate-700 rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">Athlete Details & Workouts</h3>
              <button
                onClick={() => setDetailsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {loadingDetails || !selectedUserDetails ? (
              <div className="py-12 flex justify-center">
                <LoadingSpinner text="Retrieving user records..." />
              </div>
            ) : (
              <div className="mt-4 space-y-6 text-xs">
                {/* User Header */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-navy-950/60 border border-slate-800">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-lg text-white">
                    {selectedUserDetails.user.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">{selectedUserDetails.user.name}</h4>
                    <p className="text-slate-400">{selectedUserDetails.user.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold uppercase text-[10px]">
                        {selectedUserDetails.user.role}
                      </span>
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        selectedUserDetails.user.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {selectedUserDetails.user.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recent Activities */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Recent Workouts ({selectedUserDetails.activities.length})
                  </h4>
                  {selectedUserDetails.activities.length === 0 ? (
                    <p className="text-slate-500 italic">No workouts recorded for this user.</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedUserDetails.activities.map((act) => (
                        <div key={act._id} className="p-3 rounded-xl bg-navy-950/40 border border-slate-800 flex items-center justify-between">
                          <div>
                            <span className="font-semibold text-white block">{act.exercise}</span>
                            <span className="text-slate-400 text-[11px]">
                              {act.category} • {new Date(act.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-brand font-bold block">{act.calories} kcal</span>
                            <span className="text-slate-400 text-[11px]">{act.duration} mins</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete User Account"
        message={`Are you sure you want to permanently delete the account for ${userToDelete?.email}? This will cascade delete all their workouts and goals.`}
        confirmText="Confirm Permanent Deletion"
        isDanger={true}
        isLoading={deleting}
      />
    </div>
  );
};

export default AdminPage;
