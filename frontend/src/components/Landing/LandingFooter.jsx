import React from 'react';
import { Link } from 'react-router-dom';
import { LogoMark } from './LandingNav';

export function LandingFooter() {
  return (
    <footer className="border-t border-ink-500/60 bg-ink-900/80 py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
        <Link to="/" className="flex items-center gap-2.5">
          <LogoMark className="h-7 w-7" />
          <span className="font-serif text-lg font-bold text-cream-50">Forma AI</span>
        </Link>
        <p className="text-xs text-cream-300 font-medium text-center">
          Forma AI Engine — Enterprise AI-Augmented Dynamic Form & Natural Language Pre-Fill System
        </p>
        <Link to="/app" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300">
          Launch App →
        </Link>
      </div>
    </footer>
  );
}
