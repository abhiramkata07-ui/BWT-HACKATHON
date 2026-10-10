import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Flame, Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-navy-950/80 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/30 flex items-center justify-center text-brand shadow-glow group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5 text-brand" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1">
                Fit<span className="text-brand">Track</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest text-slate-400 block -mt-1">
                Activity Intelligence
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-brand transition-colors">Features</a>
            <a href="#analytics-preview" className="hover:text-brand transition-colors">Analytics</a>
            <a href="#how-it-works" className="hover:text-brand transition-colors">How It Works</a>
          </div>

          {/* Auth Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider bg-brand text-navy-950 hover:bg-brand-400 shadow-glow transition-all"
                >
                  Go to Dashboard
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={logout}
                  className="text-xs font-medium text-slate-400 hover:text-white px-2 py-1 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider text-slate-200 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-all"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider bg-brand text-navy-950 hover:bg-brand-400 shadow-glow transition-all hover:scale-105"
                >
                  Get Started
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
