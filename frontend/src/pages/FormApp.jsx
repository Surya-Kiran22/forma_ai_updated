import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFormStore } from '../store/useFormStore';
import { Header } from '../components/Header/Header';
import { MagicInputBox } from '../components/MagicInput/MagicInputBox';
import { DynamicFormRenderer } from '../components/DynamicForm/DynamicFormRenderer';
import { AuthModal } from '../components/Auth/AuthModal';
import { SubmissionsHistoryModal } from '../components/Submissions/SubmissionsHistoryModal';
import { BenchmarkModal } from '../components/Benchmark/BenchmarkModal';
import { api } from '../services/api';

const FORM_TYPES = ['auto_claim', 'health_intake'];

const ARCHITECTURE_CARDS = [
  { title: 'LangChain LLM Engine', sub: 'Strict Structured Output' },
  { title: 'Dynamic Branching', sub: '3-Level Deep Rules' },
  { title: 'MongoDB Store', sub: 'Schema Version Control' },
  { title: 'Security Guard', sub: 'Prompt Injection Defense' },
];

export function FormApp() {
  const { fetchSchema, activeFormType, setFormType, setUser, loadDraft } = useFormStore();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [submissionsModalOpen, setSubmissionsModalOpen] = useState(false);
  const [benchmarkModalOpen, setBenchmarkModalOpen] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Deep link from the landing page: /app?form=health_intake
    const requested = searchParams.get('form');
    if (requested && FORM_TYPES.includes(requested) && requested !== activeFormType) {
      setFormType(requested);
    } else {
      // Initial schema load
      fetchSchema(activeFormType);
    }

    // Check saved user session
    const token = localStorage.getItem('accessToken');
    if (token) {
      api
        .get('/auth/me')
        .then((res) => {
          setUser(res.data.data.user);
          loadDraft(requested && FORM_TYPES.includes(requested) ? requested : activeFormType);
        })
        .catch(() => {
          localStorage.removeItem('accessToken');
        });
    }

    const handleAuthExpired = () => setAuthModalOpen(true);
    window.addEventListener('auth-expired', handleAuthExpired);
    return () => window.removeEventListener('auth-expired', handleAuthExpired);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative min-h-screen bg-ink-950 text-cream-100 flex flex-col font-sans overflow-x-hidden">
      {/* Ambient premium backdrop */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] rounded-full bg-gold-400/5 blur-[120px]" />
      </div>

      {/* Header Bar */}
      <Header
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenSubmissions={() => setSubmissionsModalOpen(true)}
        onOpenBenchmark={() => setBenchmarkModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* System Architecture Feature Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {ARCHITECTURE_CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="panel p-4 text-center hover:border-emerald-400/50 transition-colors"
            >
              <span className="text-xs font-semibold text-cream-50 block">{card.title}</span>
              <span className="text-[11px] text-emerald-400/90 font-mono">{card.sub}</span>
            </motion.div>
          ))}
        </div>

        {/* AI Magic Input Component */}
        <MagicInputBox />

        {/* Dynamic Form Engine Renderer */}
        <DynamicFormRenderer />
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-ink-500/60 bg-ink-900/80 backdrop-blur py-5 text-center text-xs text-cream-300 font-medium">
        <p>Forma AI Engine — Enterprise AI-Augmented Dynamic Form & Natural Language Pre-Fill System</p>
      </footer>

      {/* Modals */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <SubmissionsHistoryModal isOpen={submissionsModalOpen} onClose={() => setSubmissionsModalOpen(false)} />
      <BenchmarkModal isOpen={benchmarkModalOpen} onClose={() => setBenchmarkModalOpen(false)} />
    </div>
  );
}

export default FormApp;
