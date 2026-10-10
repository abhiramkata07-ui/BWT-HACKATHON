import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ text = 'Loading...', size = 'default' }) => {
  const iconSize = size === 'small' ? 'w-5 h-5' : size === 'large' ? 'w-12 h-12' : 'w-8 h-8';

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center animate-fade-in">
      <div className="relative">
        <Loader2 className={`${iconSize} text-brand animate-spin mb-3`} />
        <div className="absolute inset-0 blur-lg bg-brand/20 rounded-full"></div>
      </div>
      {text && <p className="text-sm font-medium text-slate-400 dark:text-slate-400">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
