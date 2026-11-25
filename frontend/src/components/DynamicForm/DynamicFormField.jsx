import React from 'react';
import { useFormStore } from '../../store/useFormStore';
import { evaluateRule, getNestedValue } from '../../utils/ruleEvaluator';
import { ExtractionConfidenceBadge } from '../MagicInput/ExtractionConfidenceBadge';

export function DynamicFormField({ field, register, errors }) {
  const { formData, updateFieldValue, extractedMetadata, lowConfidenceFields } = useFormStore();

  // Evaluate field-level conditional branching rule
  if (field.showIf && !evaluateRule(field.showIf, formData)) {
    return null; // Field hidden by dynamic schema rule
  }

  const currentValue = getNestedValue(formData, field.id) ?? '';
  const errorMsg = errors?.[field.id]?.message || field.validation?.customMessage;
  const isRequired = field.validation?.required;

  const handleChange = (e) => {
    let val = e.target.value;
    if (field.type === 'number') {
      val = e.target.value === '' ? '' : Number(e.target.value);
    } else if (field.type === 'checkbox') {
      val = e.target.checked;
    }
    updateFieldValue(field.id, val);
  };

  const inputClass = 'input-dark text-xs py-1.5 font-sans';

  return (
    <div className="space-y-1 bg-ink-900/60 p-3.5 border border-ink-600/70 rounded-xl hover:border-emerald-500/40 transition-colors">
      <div className="flex items-center justify-between gap-2 mb-1">
        <label
          htmlFor={`field_${field.id}`}
          className="block text-xs font-bold text-cream-100"
        >
          {field.label}
          {isRequired && <span className="text-red-400 ml-1">*</span>}
        </label>

        {/* AI Confidence Badge */}
        <ExtractionConfidenceBadge
          fieldId={field.id}
          confidenceScores={extractedMetadata}
          lowConfidenceFields={lowConfidenceFields}
        />
      </div>

      {field.placeholder && (
        <p className="text-[11px] text-cream-400 mb-1">{field.placeholder}</p>
      )}

      {/* Input Field Rendering */}
      {field.type === 'text' || field.type === 'date' || field.type === 'number' ? (
        <input
          id={`field_${field.id}`}
          type={field.type}
          value={currentValue}
          onChange={handleChange}
          aria-required={isRequired}
          aria-invalid={Boolean(errorMsg)}
          className={`${inputClass} ${field.type === 'date' ? '[color-scheme:dark]' : ''}`}
        />
      ) : field.type === 'textarea' ? (
        <textarea
          id={`field_${field.id}`}
          value={currentValue}
          onChange={handleChange}
          rows={3}
          aria-required={isRequired}
          aria-invalid={Boolean(errorMsg)}
          className={`${inputClass} resize-none`}
        />
      ) : field.type === 'select' ? (
        <select
          id={`field_${field.id}`}
          value={currentValue}
          onChange={handleChange}
          aria-required={isRequired}
          aria-invalid={Boolean(errorMsg)}
          className={inputClass}
        >
          <option value="">-- Select an option --</option>
          {field.options?.map((opt, i) => (
            <option key={i} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : field.type === 'radio' ? (
        <div className="grid grid-cols-2 gap-2 pt-1">
          {field.options?.map((opt, i) => {
            const checked = String(currentValue).toLowerCase() === String(opt.value).toLowerCase();
            return (
              <label
                key={i}
                className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer font-medium transition-all ${
                  checked
                    ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/70 shadow-glow-sm'
                    : 'bg-ink-800/70 text-cream-200 border-ink-500 hover:border-emerald-500/50'
                }`}
              >
                <input
                  type="radio"
                  name={`radio_${field.id}`}
                  value={opt.value}
                  checked={checked}
                  onChange={handleChange}
                  className="accent-emerald-500 h-3.5 w-3.5"
                />
                <span>{opt.label}</span>
              </label>
            );
          })}
        </div>
      ) : field.type === 'checkbox' ? (
        <label className="flex items-center gap-2 pt-1 cursor-pointer">
          <input
            id={`field_${field.id}`}
            type="checkbox"
            checked={Boolean(currentValue)}
            onChange={handleChange}
            className="rounded border-ink-500 accent-emerald-500 h-4 w-4 bg-ink-900"
          />
          <span className="text-xs text-cream-100 font-medium">{field.label}</span>
        </label>
      ) : null}

      {errorMsg && (
        <p className="text-[11px] text-red-400 font-bold mt-1">
          {errorMsg}
        </p>
      )}
    </div>
  );
}
