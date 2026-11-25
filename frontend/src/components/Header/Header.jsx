import React from 'react';
import { Link } from 'react-router-dom';
import { useFormStore } from '../../store/useFormStore';

export function Header({ onOpenAuth, onOpenSubmissions, onOpenBenchmark }) {
  const { activeFormType, setFormType, activeSchema, user, isAuthenticated, logout } = useFormStore();

  const typeButton = (type, label) => (
    <button
      onClick={() => setFormType(type)}
      className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
        activeFormType === type
          ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-ink-950 shadow-glow-sm'
          : 'text-cream-200 hover:bg-ink-600/70 hover:text-emerald-300'
      }`}
    >
      {label}
    </button>
  );

  return (
    <header className="relative z-20 bg-ink-900/80 backdrop-blur-xl border-b border-ink-500/60 pt-6 pb-4 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-400 hover:text-emerald-300 transition-colors mb-2"
            >
              <span aria-hidden>←</span> Back to Home
            </Link>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-cream-50 tracking-tight">
              Forma AI — Dynamic Form & AI Extraction Engine
            </h1>
            <p className="text-sm text-cream-300 mt-1.5 font-medium">
              LangChain Structured Extraction • MongoDB Schema Store • 3-Level Deep Dynamic Branching
            </p>
          </div>

          {/* User Auth & Benchmark Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={onOpenBenchmark} className="btn-secondary text-xs px-4 py-2">
              LLM Accuracy Benchmark Suite
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-3 bg-ink-800/80 border border-ink-500 rounded-full px-4 py-1.5">
                <button
                  onClick={onOpenSubmissions}
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
                >
                  My Claims History
                </button>
                <span className="text-xs text-ink-500">|</span>
                <span className="text-xs font-bold text-cream-100">{user?.name}</span>
                <button
                  onClick={logout}
                  className="text-xs text-red-400 hover:text-red-300 font-semibold"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button onClick={onOpenAuth} className="btn-primary text-xs px-5 py-2">
                Sign In / Register
              </button>
            )}
          </div>
        </div>

        {/* Action Controls & Form Type Selection Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-ink-500/50">
          {/* Active Schema Switcher Box */}
          <div className="md:col-span-2 flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-cream-200 uppercase tracking-wider">Select Form Type:</span>
            <div className="inline-flex flex-wrap rounded-full border border-ink-500 bg-ink-800/80 p-1">
              {typeButton('auto_claim', 'Auto Insurance Claim (50+ Fields)')}
              {typeButton('health_intake', 'Healthcare Medical Intake')}
            </div>
          </div>

          {/* Active Schema Version Card */}
          <div className="bg-ink-800/80 border border-ink-500 rounded-xl p-2.5 flex items-center justify-between">
            <span className="text-xs font-bold text-cream-200">Schema Version:</span>
            <span className="text-xs font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
              {activeSchema ? `v${activeSchema.version} (${activeSchema.formType})` : 'Loading...'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
