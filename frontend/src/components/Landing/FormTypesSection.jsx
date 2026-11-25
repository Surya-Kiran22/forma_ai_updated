import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SAMPLE_PROMPTS } from '../MagicInput/MagicInputBox';

const FORMS = [
  {
    id: 'auto_claim',
    name: 'Auto Insurance Claim',
    badge: '50+ Fields',
    description:
      'A deep insurance claim form with dynamic branching. Describe the incident once and let the LLM pre-fill what it can.',
    features: ['LLM Pre-Fill', '3-Level Branching', 'Save Draft State'],
  },
  {
    id: 'health_intake',
    name: 'Healthcare Medical Intake',
    badge: 'Medical Intake',
    description:
      'A patient intake form that reveals follow-up questions based on symptoms reported in the narrative.',
    features: ['LLM Pre-Fill', 'Dynamic Questions', 'AI Confidence Badges'],
  },
];

function FormCard({ form, index }) {
  const sample = SAMPLE_PROMPTS[form.id]?.[0];
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      whileHover={{ y: -6 }}
      className="panel p-7 flex flex-col hover:border-emerald-400/60 hover:shadow-glow transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-5">
        <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-gold-400/15 text-gold-300 border border-gold-400/40">
          {form.badge}
        </span>
        <span className="text-[11px] font-mono text-emerald-400">{form.id}</span>
      </div>

      <h3 className="font-serif text-3xl font-bold text-cream-50 mb-3">{form.name}</h3>
      <p className="text-sm text-cream-300 mb-5 leading-relaxed">{form.description}</p>

      <div className="panel-inset p-4 mb-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cream-400 mb-2">Test Sample</p>
        <p className="text-xs font-mono text-emerald-200/90 leading-relaxed">"{sample}"</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-7">
        {form.features.map((f) => (
          <span key={f} className="text-[11px] px-2.5 py-1 rounded-full bg-ink-700 border border-ink-500 text-cream-200">
            {f}
          </span>
        ))}
      </div>

      <Link to={`/app?form=${form.id}`} className="btn-primary mt-auto px-6 py-3 text-sm">
        Open in Forma AI →
      </Link>
    </motion.div>
  );
}

export function FormTypesSection() {
  return (
    <section id="forms" className="relative py-28 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="eyebrow mb-3">Select Form Type</p>
          <h2 className="heading-serif text-5xl md:text-7xl font-bold">Our Signature Forms</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {FORMS.map((f, i) => (
            <FormCard key={f.id} form={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
