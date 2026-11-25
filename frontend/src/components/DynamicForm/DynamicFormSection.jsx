import React, { useState } from 'react';
import { useFormStore } from '../../store/useFormStore';
import { evaluateRule } from '../../utils/ruleEvaluator';
import { DynamicFormField } from './DynamicFormField';

export function DynamicFormSection({ section, register, errors }) {
  const { formData } = useFormStore();
  const [isOpen, setIsOpen] = useState(true);

  // Evaluate Section-level dynamic branching rule
  if (section.showIf && !evaluateRule(section.showIf, formData)) {
    return null; // Hidden by dynamic branching rule
  }

  const isConditionalBranch = Boolean(section.showIf);

  return (
    <div
      className={`rounded-2xl mb-6 overflow-hidden bg-ink-800/70 shadow-panel backdrop-blur-sm animate-slide-up ${
        isConditionalBranch
          ? 'border-2 border-emerald-500/70 shadow-glow-sm'
          : 'border border-ink-500/60'
      }`}
    >
      {/* Section Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-5 py-3.5 flex items-center justify-between transition-colors text-left border-b ${
          isConditionalBranch
            ? 'bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/15'
            : 'bg-ink-700/50 border-ink-500/50 hover:bg-ink-700/80'
        }`}
      >
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="font-serif text-base font-bold text-cream-50 tracking-tight">{section.title}</h3>
          {isConditionalBranch && (
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-ink-950 px-2.5 py-0.5 rounded-full">
              3-Level Branch Active
            </span>
          )}
        </div>

        <span className="text-xs font-bold text-emerald-400">
          {isOpen ? '[ Collapse ]' : '[ Expand ]'}
        </span>
      </button>

      {section.description && (
        <div className="px-5 py-2.5 bg-ink-900/40 border-b border-ink-500/40 text-xs text-cream-300 italic">
          {section.description}
        </div>
      )}

      {/* Section Body */}
      {isOpen && (
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-ink-900/30">
          {section.fields?.map((field) => (
            <DynamicFormField key={field.id} field={field} register={register} errors={errors} />
          ))}
        </div>
      )}
    </div>
  );
}
