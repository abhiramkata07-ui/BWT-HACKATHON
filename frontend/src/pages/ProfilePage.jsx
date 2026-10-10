import React, { useState } from 'react';
import {
  User,
  Mail,
  Calendar,
  Shield,
  Key,
  CheckCircle2,
  Save,
  LogOut,
  Sparkles,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const ProfilePage = () => {
  const { user, updateUser, logout } = useAuth();
  const toast = useToast();

  // Profile Edit State
  const [name, setName] = useState(user?.name || '');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Password Change State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [changingPassword, setChangingPassword] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name cannot be empty.');
      return;
    }

    setUpdatingProfile(true);
    try {
      const res = await api.patch('/users/me', { name: name.trim() });
      if (res.data.success) {
        updateUser(res.data.data.user);
        toast.success('Profile details updated successfully.');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update profile.');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long.');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    setChangingPassword(true);
    try {
      const res = await api.patch('/users/me/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmNewPassword: passwordData.confirmNewPassword,
      });

      if (res.data.success) {
        toast.success('Password changed successfully! Keep your credentials secure.');
        setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      }
    } catch (err) {
      toast.error(err.message || 'Failed to change password.');
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Athlete Profile</h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your personal information, credentials, and security preferences
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-navy-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-20 h-20 rounded-2xl bg-brand/10 border-2 border-brand/30 flex items-center justify-center font-extrabold text-brand text-3xl shadow-glow flex-shrink-0">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-2xl" />
          ) : (
            <span>{user?.name?.charAt(0) || 'U'}</span>
          )}
        </div>

        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <h2 className="text-xl font-bold text-white">{user?.name}</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase bg-brand/10 text-brand border border-brand/20">
              {user?.role === 'admin' ? 'Administrator' : 'Verified Athlete'}
            </span>
          </div>

          <p className="text-xs text-slate-400 mt-1 flex items-center justify-center sm:justify-start gap-1.5">
            <Mail className="w-3.5 h-3.5" /> {user?.email}
          </p>

          <p className="text-xs text-slate-500 mt-1 flex items-center justify-center sm:justify-start gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> Member since{' '}
            {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>

        <button
          onClick={logout}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Info Form */}
        <div className="p-6 sm:p-8 rounded-3xl bg-navy-900 border border-slate-800 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
            <User className="w-4 h-4 text-brand" /> Edit Personal Details
          </h3>
          <p className="text-xs text-slate-400 mb-6">Update your display name</p>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-brand transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Email Address (Permanent)
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-4 py-2.5 bg-slate-950/30 border border-slate-800/50 rounded-xl text-sm text-slate-500 cursor-not-allowed"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Email address is permanently linked to your workout records.
              </span>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={updatingProfile}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-brand text-navy-950 hover:bg-brand-400 shadow-glow transition-all"
              >
                <Save className="w-4 h-4" />
                {updatingProfile ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="p-6 sm:p-8 rounded-3xl bg-navy-900 border border-slate-800 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
            <Key className="w-4 h-4 text-cyan-400" /> Security & Password
          </h3>
          <p className="text-xs text-slate-400 mb-6">Ensure your account is protected</p>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                required
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))
                }
                placeholder="Enter current password"
                className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-brand transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                New Password
              </label>
              <input
                type="password"
                required
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))
                }
                placeholder="Minimum 6 characters"
                className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-brand transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={passwordData.confirmNewPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({ ...prev, confirmNewPassword: e.target.value }))
                }
                placeholder="Re-enter new password"
                className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-brand transition-colors"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={changingPassword}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 border border-slate-700 transition-all"
              >
                <Key className="w-4 h-4" />
                {changingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
