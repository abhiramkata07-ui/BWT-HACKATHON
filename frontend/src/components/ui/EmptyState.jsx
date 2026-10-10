import React from 'react';
import { Activity, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyState = ({
  icon: Icon = Activity,
  title = 'No records found',
  description = 'You have not added any activities yet. Start tracking your fitness journey today!',
  actionLabel = 'Log First Workout',
  actionLink = '/activities/new',
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-slate-800/80 bg-navy-900/40 backdrop-blur-sm">
      <div className="w-16 h-16 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center mb-4 text-brand shadow-glow">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 max-w-md mb-6">{description}</p>
      {actionLink ? (
        <Link
          to={actionLink}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm bg-brand text-navy-950 hover:bg-brand-400 transition-all shadow-glow hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          {actionLabel}
        </Link>
      ) : onAction ? (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm bg-brand text-navy-950 hover:bg-brand-400 transition-all shadow-glow hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
};

export default EmptyState;
