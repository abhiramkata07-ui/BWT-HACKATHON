import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldX, ArrowLeft, LayoutDashboard } from 'lucide-react';

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center p-4 text-center selection:bg-brand selection:text-navy-950">
      <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-6 shadow-2xl shadow-rose-950/40">
        <ShieldX className="w-10 h-10" />
      </div>

      <span className="text-xs font-bold uppercase tracking-widest text-rose-400 mb-2">
        403 Forbidden Access
      </span>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-white max-w-md">
        Administrator Permission Required
      </h1>

      <p className="mt-3 text-sm text-slate-400 max-w-md leading-relaxed">
        You do not have administrative privileges to access this area. If you believe this is an error, please contact your system administrator.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-brand text-navy-950 hover:bg-brand-400 shadow-glow transition-all"
        >
          <LayoutDashboard className="w-4 h-4" />
          Return to Athlete Dashboard
        </Link>
        <Link
          to="/activities"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          View Workouts
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
