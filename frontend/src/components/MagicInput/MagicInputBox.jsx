import React, { useState } from 'react';
import { useFormStore } from '../../store/useFormStore';

export const SAMPLE_PROMPTS = {
  auto_claim: [
    'I hit a deer on I-95 yesterday in my Honda, and the windshield shattered.',
    'A Toyota rear-ended my car today while I was stopped at the traffic red light on Main Street. The rear bumper is broken.',
    'Severe hail storm yesterday caused multiple dents on the hood and roof of my Ford truck.',
  ],
  health_intake: [
    'Patient reports sudden onset chest pain starting yesterday morning with shortness of breath. No prior cardiac history.',
    'Severe abdominal pain starting today accompanied by fever and fatigue.',
  ],
};

export function MagicInputBox() {
  const { activeFormType, extractFromNarrative, isExtracting, extractionError } = useFormStore();
  const [text, setText] = useState('');

  const handleExtract = () => {
    if (!text.trim() || isExtracting) return;
    extractFromNarrative(text.trim());
  };

  const handleSampleClick = (sample) => {
    setText(sample);
    extractFromNarrative(sample);
  };

  const samples = SAMPLE_PROMPTS[activeFormType] || [];

  return (
    <div className="panel relative overflow-hidden p-6 mb-8">
      {/* Accent glow */}
      <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl" />

      <h2 className="relative font-serif text-xl font-bold text-cream-50 mb-2 border-b border-ink-500/60 pb-3">
        Command Panel: Natural-Language AI Pre-Fill Processor
      </h2>

      <p className="relative text-xs text-cream-300 mb-4 font-medium leading-relaxed">
        Enter an unstructured narrative paragraph describing your situation. Backend LLM extracts structured fields & reveals dynamic branching questions.
      </p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={
          activeFormType === 'auto_claim'
            ? 'e.g. "I hit a deer on I-95 yesterday in my Honda, and the windshield shattered."'
            : 'e.g. "Patient reports sudden onset chest pain starting yesterday morning with shortness of breath..."'
        }
        rows={3}
        disabled={isExtracting}
        className="input-dark relative text-xs resize-none font-mono p-3.5 disabled:opacity-60"
      />

      <div className="relative mt-4 flex flex-wrap items-center justify-between gap-3">
        {/* Sample Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-cream-200">Test Samples:</span>
          {samples.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => handleSampleClick(sample)}
              disabled={isExtracting}
              className="text-xs bg-ink-700/80 border border-ink-500 hover:border-emerald-400/70 hover:text-emerald-300 text-cream-200 font-medium px-3 py-1.5 rounded-full transition-all truncate max-w-xs disabled:opacity-50"
            >
              "{sample.substring(0, 32)}..."
            </button>
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={handleExtract}
          disabled={!text.trim() || isExtracting}
          className="btn-primary text-xs px-6 py-2.5 ml-auto"
        >
          {isExtracting ? 'Extracting LLM Fields...' : 'Execute LLM Structured Extraction'}
        </button>
      </div>

      {extractionError && (
        <div className="relative mt-4 p-3 rounded-lg border border-red-500/60 bg-red-500/10 text-red-300 text-xs font-semibold">
          {extractionError}
        </div>
      )}
    </div>
  );
}
