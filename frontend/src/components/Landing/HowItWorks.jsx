import React from 'react';
import { motion } from 'framer-motion';

const STEPS = [
  {
    n: '01',
    title: 'Narrate',
    text: 'Type an unstructured paragraph about your situation, or tap one of the test samples.',
  },
  {
    n: '02',
    title: 'Extract',
    text: 'The backend LLM extracts structured fields, each with an AI confidence badge for review.',
  },
  {
    n: '03',
    title: 'Branch & Validate',
    text: 'Dynamic branching reveals follow-up questions while the validation tracker counts completion.',
  },
  {
    n: '04',
    title: 'Save & Submit',
    text: 'Save your draft state idempotently, then finalize and submit your form claim to MongoDB.',
  },
];

const EXTRACTED = [
  { label: 'Incident Type', value: 'Animal Collision', conf: 96 },
  { label: 'Vehicle Make', value: 'Honda', conf: 98 },
  { label: 'Damage', value: 'Windshield shattered', conf: 91 },
  { label: 'Location', value: 'I-95', conf: 94 },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative py-28 px-4 md:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950 via-ink-900/60 to-ink-950" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="eyebrow mb-3">Command Panel</p>
          <h2 className="heading-serif text-5xl md:text-6xl font-bold">Natural-Language AI Pre-Fill</h2>
        </motion.div>

        {/* Illustrative demo of the command panel */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="panel relative overflow-hidden p-6 md:p-8 mb-16"
        >
          {[...Array(7)].map((_, i) => (
            <motion.span
              key={i}
              aria-hidden
              animate={{ y: [0, -18, 0], opacity: [0.25, 0.6, 0.25] }}
              transition={{ repeat: Infinity, duration: 3.5 + (i % 3), delay: i * 0.4 }}
              className="absolute h-1.5 rounded-full bg-emerald-300/70"
              style={{ width: 10 + (i % 4) * 6, left: `${8 + i * 13}%`, top: `${12 + ((i * 29) % 70)}%` }}
            />
          ))}

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cream-400 mb-2">Narrative</p>
              <div className="input-dark font-mono text-xs leading-relaxed min-h-[110px] p-4">
                I hit a deer on I-95 yesterday in my Honda, and the windshield shattered.
              </div>
              <div className="mt-4 inline-flex btn-primary text-xs px-5 py-2.5 pointer-events-none">
                Execute LLM Structured Extraction
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cream-400 mb-2">
                Structured fields <span className="normal-case tracking-normal text-cream-400/70">(illustrative)</span>
              </p>
              <div className="grid grid-cols-2 gap-3">
                {EXTRACTED.map((f, i) => (
                  <motion.div
                    key={f.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.15 }}
                    className="panel-inset p-3"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[11px] font-bold text-cream-100">{f.label}</span>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/40">
                        AI {f.conf}%
                      </span>
                    </div>
                    <span className="text-xs text-cream-300">{f.value}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative p-6 rounded-2xl border border-ink-500/50 bg-ink-800/40"
            >
              <span className="font-serif text-5xl font-bold text-emerald-500/30">{s.n}</span>
              <h3 className="font-serif text-xl font-semibold text-cream-50 mt-2 mb-2">{s.title}</h3>
              <p className="text-sm text-cream-300 leading-relaxed">{s.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
