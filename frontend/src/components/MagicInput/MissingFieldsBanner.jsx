import React from 'react';
import { useFormStore } from '../../store/useFormStore';

export function MissingFieldsBanner() {
  const { missingFields, completionPercentage } = useFormStore();

  const isComplete = missingFields.length === 0;

  return (
    <div
      className={`rounded-2xl border p-5 mb-6 shadow-panel backdrop-blur-sm transition-colors ${
        isComplete ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-ink-800/80 border-ink-500/70'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <h3 className={`text-sm font-bold ${isComplete ? 'text-emerald-300' : 'text-cream-50'}`}>
          Dynamic Validation Tracker: {completionPercentage}% Form Completion
        </h3>
        <span
          className={`text-xs font-mono font-bold px-3 py-0.5 rounded-full border ${
            isComplete
              ? 'bg-emerald-500/20 border-emerald-400/60 text-emerald-300'
              : 'bg-gold-400/10 border-gold-400/40 text-gold-300'
          }`}
        >
          {isComplete ? '100% Fully Validated' : `${missingFields.length} Required Field(s) Pending`}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-ink-900 h-2.5 rounded-full overflow-hidden my-3 border border-ink-500/60">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isComplete
              ? 'bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-glow-sm'
              : 'bg-gradient-to-r from-gold-500 to-emerald-500'
          }`}
          style={{ width: `${completionPercentage}%` }}
        />
      </div>

      {/* Subtitle labels */}
      <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-cream-400 mt-1">
        <span>v1: Schema Loaded</span>
        <span className="text-center text-cream-300">
          {isComplete ? 'Status: Form Ready to Submit' : `Pending: ${missingFields.slice(0, 3).join(', ')}${missingFields.length > 3 ? '...' : ''}`}
        </span>
        <span>v5: Submission Finalized</span>
      </div>
    </div>
  );
}
