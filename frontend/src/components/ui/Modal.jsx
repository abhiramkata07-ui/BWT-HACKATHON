import React, { useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';

const Modal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDanger = false,
  isLoading = false,
  children,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md bg-navy-900 border border-slate-700/80 rounded-2xl p-6 shadow-2xl relative text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          {isDanger && (
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-rose-400 flex-shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
          )}
          <h3 className="text-lg font-bold text-white">{title}</h3>
        </div>

        {children ? (
          children
        ) : (
          <p className="text-sm text-slate-300 mb-6 leading-relaxed">{message}</p>
        )}

        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 transition-colors border border-slate-700/60"
          >
            {cancelText}
          </button>
          {onConfirm && (
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                isDanger
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/30'
                  : 'bg-brand text-navy-950 hover:bg-brand-400 shadow-glow'
              } disabled:opacity-50`}
            >
              {isLoading ? 'Processing...' : confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
