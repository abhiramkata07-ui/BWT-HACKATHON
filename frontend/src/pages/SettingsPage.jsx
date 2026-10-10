import React, { useState } from 'react';
import {
  Settings,
  Sun,
  Moon,
  ShieldCheck,
  Sliders,
  LogOut,
  Check,
  Lock,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const SettingsPage = () => {
  const { theme, toggleTheme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const toast = useToast();

  const [units, setUnits] = useState(
    () => localStorage.getItem('fittrack_units') || user?.preferences?.units || 'metric'
  );
  const [dashboardView, setDashboardView] = useState(
    () => localStorage.getItem('fittrack_view') || user?.preferences?.dashboardView || 'detailed'
  );

  const handleUnitChange = (val) => {
    setUnits(val);
    localStorage.setItem('fittrack_units', val);
    toast.success(`Units preference updated to ${val === 'metric' ? 'Metric (kg, km)' : 'Imperial (lbs, miles)'}.`);
  };

  const handleViewChange = (val) => {
    setDashboardView(val);
    localStorage.setItem('fittrack_view', val);
    toast.success(`Dashboard layout set to ${val}.`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">System Settings</h1>
        <p className="text-sm text-slate-400 mt-1">
          Customize your dashboard appearance, measurement units, and security parameters
        </p>
      </div>

      <div className="space-y-6">
        {/* Theme Preferences */}
        <div className="p-6 sm:p-8 rounded-3xl bg-navy-900 border border-slate-800 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-brand/10 border border-brand/20 text-brand">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Theme & Appearance</h3>
              <p className="text-xs text-slate-400">Choose between the high-contrast dark dashboard or clean light theme</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6 max-w-md">
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                theme === 'dark'
                  ? 'bg-navy-950 border-brand shadow-glow text-white'
                  : 'bg-navy-950/60 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Moon className="w-5 h-5 text-indigo-400" />
                {theme === 'dark' && <Check className="w-4 h-4 text-brand" />}
              </div>
              <span className="text-sm font-bold block">Deep Charcoal</span>
              <span className="text-xs text-slate-500">Dark Navy Palette (Recommended)</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                theme === 'light'
                  ? 'bg-slate-800 border-brand shadow-glow text-white'
                  : 'bg-navy-950/60 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Sun className="w-5 h-5 text-amber-400" />
                {theme === 'light' && <Check className="w-4 h-4 text-brand" />}
              </div>
              <span className="text-sm font-bold block">Daylight Gray</span>
              <span className="text-xs text-slate-500">Light Clean Surface</span>
            </button>
          </div>
        </div>

        {/* Measurement Units */}
        <div className="p-6 sm:p-8 rounded-3xl bg-navy-900 border border-slate-800 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Measurement Units</h3>
              <p className="text-xs text-slate-400">Select your preferred system for weight and distances</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6 max-w-md">
            <button
              type="button"
              onClick={() => handleUnitChange('metric')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                units === 'metric'
                  ? 'bg-navy-950 border-cyan-400 text-white shadow-glow-cyan'
                  : 'bg-navy-950/60 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold">Metric</span>
                {units === 'metric' && <Check className="w-4 h-4 text-cyan-400" />}
              </div>
              <span className="text-xs text-slate-500">Kilograms, Kilometers (km)</span>
            </button>

            <button
              type="button"
              onClick={() => handleUnitChange('imperial')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                units === 'imperial'
                  ? 'bg-navy-950 border-cyan-400 text-white shadow-glow-cyan'
                  : 'bg-navy-950/60 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold">Imperial</span>
                {units === 'imperial' && <Check className="w-4 h-4 text-cyan-400" />}
              </div>
              <span className="text-xs text-slate-500">Pounds (lbs), Miles (mi)</span>
            </button>
          </div>
        </div>

        {/* Security & Cryptography Info */}
        <div className="p-6 sm:p-8 rounded-3xl bg-navy-900 border border-slate-800 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Security & Active Safeguards</h3>
              <p className="text-xs text-slate-400">Application cryptography and endpoint defenses</p>
            </div>
          </div>

          <div className="space-y-3 mt-4 text-xs">
            <div className="p-3.5 rounded-xl bg-navy-950/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-200 block">Password Storage</span>
                <span className="text-slate-500">Hashed with bcryptjs (Salt rounds: 10, never exposed in JSON)</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-bold">Enforced</span>
            </div>

            <div className="p-3.5 rounded-xl bg-navy-950/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-200 block">JWT Token Delivery</span>
                <span className="text-slate-500">HttpOnly cookie + Bearer header fallback</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-bold">Active</span>
            </div>

            <div className="p-3.5 rounded-xl bg-navy-950/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-200 block">Rate Limiting</span>
                <span className="text-slate-500">express-rate-limit configured on all authentication endpoints</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-bold">Active</span>
            </div>
          </div>
        </div>

        {/* Logout action */}
        <div className="p-6 rounded-3xl bg-navy-900 border border-slate-800 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-white">Sign Out of Session</h4>
            <p className="text-xs text-slate-400">Terminates active JWT session on this client</p>
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
