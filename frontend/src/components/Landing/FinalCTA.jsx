import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function FinalCTA() {
  return (
    <section className="relative py-36 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950 to-ink-900" />
      <motion.div
        aria-hidden
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.55, 0.3] }}
        transition={{ repeat: Infinity, duration: 8 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[28rem] bg-emerald-500/20 rounded-full blur-3xl"
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="heading-serif text-5xl md:text-7xl font-bold mb-6"
        >
          Describe it once. <span className="text-gradient">Let Forma fill the rest.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-cream-300 mb-12"
        >
          Enterprise AI-Augmented Dynamic Form & Natural Language Pre-Fill System
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="inline-block"
        >
          <Link to="/app" className="btn-primary px-14 py-5 text-lg shadow-glow">
            Launch Forma AI
          </Link>
        </motion.div>

        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 6 }}
          className="mt-12 text-gold-400 text-4xl"
          aria-hidden
        >
          ✦
        </motion.div>
      </div>
    </section>
  );
}
