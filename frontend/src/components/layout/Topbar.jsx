import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Plus, Sun, Moon, Bell, Shield, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Topbar = ({ onOpenSidebar }) => {
  const { user, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="sticky top-0 z-30 h-16 bg-navy-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      {/* Left: Mobile hamburger & Date indicator */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenSidebar}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {formattedDate}
          </span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-800 transition-all"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-400" />
          )}
        </button>

        {/* Quick Add Workout button */}
        <Link
          to="/activities/new"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider bg-brand text-navy-950 hover:bg-brand-400 shadow-glow transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span className="hidden sm:inline">Add Workout</span>
        </Link>

        {/* Profile Pill */}
        <Link
          to="/profile"
          className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-slate-800 bg-slate-800/40 hover:bg-slate-800 transition-colors"
        >
          <div className="w-6 h-6 rounded-lg bg-brand/10 border border-brand/30 flex items-center justify-center text-brand text-xs font-bold">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <span className="text-xs font-semibold text-slate-200 hidden md:inline">
            {user?.name?.split(' ')[0] || 'User'}
          </span>
          {isAdmin && (
            <span className="hidden sm:inline-block text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300">
              Admin
            </span>
          )}
        </Link>
      </div>
    </header>
  );
};

export default Topbar;
