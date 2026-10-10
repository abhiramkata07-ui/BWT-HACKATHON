import React from 'react';

const MetricCard = ({
  icon: Icon,
  title,
  value,
  unit = '',
  change,
  trend = 'up',
  color = 'brand',
  subtitle,
}) => {
  const colorMap = {
    brand: {
      bg: 'bg-brand/10',
      border: 'border-brand/20',
      text: 'text-brand',
      glow: 'group-hover:border-brand/40',
    },
    cyan: {
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20',
      text: 'text-cyan-400',
      glow: 'group-hover:border-cyan-500/40',
    },
    purple: {
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      text: 'text-purple-400',
      glow: 'group-hover:border-purple-500/40',
    },
    orange: {
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
      text: 'text-orange-400',
      glow: 'group-hover:border-orange-500/40',
    },
  };

  const scheme = colorMap[color] || colorMap.brand;

  return (
    <div className={`group relative p-5 rounded-2xl bg-navy-900/80 border border-slate-800/80 hover:border-slate-700/80 transition-all duration-300 card-hover-effect`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase mb-1">{title}</p>
          <div className="flex items-baseline gap-1.5">
            <h3 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">{value}</h3>
            {unit && <span className="text-xs font-medium text-slate-400">{unit}</span>}
          </div>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>

        <div className={`p-3 rounded-xl ${scheme.bg} ${scheme.border} border ${scheme.text} shadow-sm transition-transform duration-300 group-hover:scale-110`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>

      {change && (
        <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
          <span className={`font-semibold ${trend === 'up' ? 'text-brand' : 'text-slate-400'}`}>
            {change}
          </span>
          <span className="text-slate-500">vs target</span>
        </div>
      )}
    </div>
  );
};

export default MetricCard;
