import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export function LogoMark({ className = 'h-8 w-8' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden>
      <rect x="1" y="1" width="30" height="30" rx="9" fill="#0f1813" stroke="#34d399" strokeOpacity="0.6" />
      <path d="M9 10h14M9 16h9M9 22h5" stroke="#6ee7b7" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="23" cy="20.5" r="3.2" fill="#d9b77e" />
    </svg>
  );
}

const LINKS = [
  { href: '#features', label: 'Architecture' },
  { href: '#forms', label: 'Form Types' },
  { href: '#how', label: 'How It Works' },
];

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-ink-950/80 backdrop-blur-xl border-b border-ink-500/50 py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <LogoMark />
          <span className="font-serif text-xl font-bold text-cream-50 tracking-tight">Forma AI</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-cream-300 hover:text-emerald-300 transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        <Link to="/app" className="btn-primary text-xs sm:text-sm px-5 py-2.5">
          Launch App
        </Link>
      </div>
    </nav>
  );
}
