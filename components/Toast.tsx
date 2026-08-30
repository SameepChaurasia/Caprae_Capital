'use client';

import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'error';
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success' }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-toast">
      <div className={`backdrop-blur-xl px-4 py-3 rounded-xl flex items-center gap-3 text-xs font-semibold text-white shadow-2xl border ${
        type === 'success'
          ? 'bg-slate-900/95 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
          : 'bg-slate-900/95 border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.3)]'
      }`}>
        {type === 'success' ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        ) : (
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
        )}
        <span className="leading-snug">{message}</span>
      </div>
    </div>
  );
};
