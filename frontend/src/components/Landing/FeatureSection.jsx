import React from 'react';
import { motion } from 'framer-motion';

const LEFT = [
  {
    title: 'LangChain LLM Engine',
    tag: 'Strict Structured Output',
    text: 'Free-text narratives are turned into strictly structured, schema-shaped field values.',
  },
  {
    title: 'Dynamic Branching',
    tag: '3-Level Deep Rules',
    text: 'Sections and fields appear only when the schema rules say they should, up to three levels deep.',
  },
];

const RIGHT = [
  {
    title: 'MongoDB Store',
    tag: 'Schema Version Control',
    text: 'Form schemas are versioned in MongoDB, alongside saved drafts and a ledger of submitted claims.',
  },
  {
    title: 'Security Guard',
    tag: 'Prompt Injection Defense',
    text: 'Narratives are sanitised before they ever reach the model, defending against prompt injection.',
  },
];

function FeatureCard({ item, from, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: from === 'left' ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      whileHover={{ y: -4 }}
      className="panel p-6 hover:border-emerald-400/50 hover:shadow-glow-sm transition-all duration-300"
    >
      <h3 className="font-serif text-2xl font-semibold text-cream-50 mb-1">{item.title}</h3>
      <span className="inline-block text-[11px] font-mono text-emerald-400 mb-3">{item.tag}</span>
      <p className="text-sm text-cream-300 leading-relaxed">{item.text}</p>
    </motion.div>
  );
}

function CoreOrb() {
  return (
    <div className="relative flex items-center justify-center h-80 w-80">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
        className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/30 to-gold-400/25 blur-3xl"
      />
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ rotate: i % 2 ? -360 : 360 }}
          transition={{ repeat: Infinity, duration: 14 + i * 6, ease: 'linear' }}
          className="absolute rounded-full border border-emerald-400/40"
          style={{ width: 150 + i * 56, height: (150 + i * 56) * 0.42 }}
        />
      ))}
      <div className="relative z-10 h-28 w-28 rounded-full bg-gradient-to-br from-cream-50 via-emerald-300 to-emerald-600 shadow-glow animate-float" />
      <span className="absolute top-6 right-2 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 animate-float">
        AI 96% Confidence
      </span>
      <span
        className="absolute bottom-10 left-0 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-gold-400/15 border border-gold-400/50 text-gold-300 animate-float"
        style={{ animationDelay: '1.5s' }}
      >
        Schema v1
      </span>
      <span
        className="absolute bottom-2 right-8 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-ink-700 border border-ink-500 text-cream-200 animate-float"
        style={{ animationDelay: '3s' }}
      >
        3-Level Branch
      </span>
    </div>
  );
}

export function FeatureSection() {
  return (
    <section id="features" className="relative py-28 px-4 md:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950 via-ink-900 to-ink-950" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="eyebrow mb-3">System Architecture</p>
          <h2 className="heading-serif text-5xl md:text-6xl font-bold">Built like an enterprise engine</h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
          <div className="space-y-6">
            {LEFT.map((f, i) => (
              <FeatureCard key={f.title} item={f} from="left" index={i} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center order-first lg:order-none"
          >
            <CoreOrb />
          </motion.div>

          <div className="space-y-6">
            {RIGHT.map((f, i) => (
              <FeatureCard key={f.title} item={f} from="right" index={i} />
            ))}
          </div>
        </div>

        {/* Benchmark highlight */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="panel mt-14 p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-ink-800/90 to-emerald-900/20"
        >
          <div>
            <p className="eyebrow mb-2">Measured, not assumed</p>
            <h3 className="font-serif text-3xl font-semibold text-cream-50 mb-2">LLM Accuracy Benchmark Suite</h3>
            <p className="text-sm text-cream-300 max-w-2xl leading-relaxed">
              Evaluate LLM extraction against ground-truth dataset: run extraction across labeled narratives and
              compute exact match precision, recall, and F1 metrics.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            {['Precision', 'Recall', 'F1 Score'].map((m) => (
              <span
                key={m}
                className="px-4 py-2 rounded-full text-xs font-semibold border border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
              >
                {m}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
