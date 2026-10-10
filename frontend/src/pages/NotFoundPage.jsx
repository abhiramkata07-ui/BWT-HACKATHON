import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center p-4 text-center selection:bg-brand selection:text-navy-950">
      <div className="w-20 h-20 rounded-3xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand mb-6 shadow-glow">
        <Compass className="w-10 h-10 animate-spin-slow" />
      </div>

      <span className="text-xs font-bold uppercase tracking-widest text-brand mb-2">
        404 Page Not Found
      </span>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-white max-w-md">
        Lost in the Workout Zone?
      </h1>

      <p className="mt-3 text-sm text-slate-400 max-w-md leading-relaxed">
        The route you requested could not be located. It may have been moved, renamed, or does not exist.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-brand text-navy-950 hover:bg-brand-400 shadow-glow transition-all"
        >
          <Home className="w-4 h-4" />
          Return to Dashboard
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Landing Page
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
