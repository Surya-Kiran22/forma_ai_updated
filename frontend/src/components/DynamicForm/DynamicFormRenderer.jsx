import React from 'react';
import { useForm } from 'react-hook-form';
import { useFormStore } from '../../store/useFormStore';
import { DynamicFormSection } from './DynamicFormSection';
import { MissingFieldsBanner } from '../MagicInput/MissingFieldsBanner';

export function DynamicFormRenderer() {
  const {
    activeSchema,
    isLoadingSchema,
    schemaError,
    fetchSchema,
    saveDraft,
    isSavingDraft,
    lastSavedAt,
    submitForm,
    isSubmitting,
    submitError,
    submissionSuccess,
    missingFields,
    setFormType,
    activeFormType,
  } = useFormStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = () => {
    submitForm();
  };

  if (isLoadingSchema) {
    return (
      <div className="panel p-8 space-y-4 text-center">
        <div className="mx-auto h-8 w-8 rounded-full border-2 border-emerald-500/30 border-t-emerald-400 animate-spin" />
        <div className="text-sm font-bold text-cream-200">Loading Form Schema from MongoDB...</div>
      </div>
    );
  }

  if (schemaError) {
    return (
      <div className="panel border-red-500/60 p-8 text-center space-y-3">
        <h3 className="text-sm font-bold text-red-300">Failed to Load Form Schema</h3>
        <p className="text-xs text-cream-300">{schemaError}</p>
        <button
          onClick={() => fetchSchema()}
          className="btn-primary text-xs px-5 py-2"
        >
          Retry Loading Schema
        </button>
      </div>
    );
  }

  if (submissionSuccess) {
    return (
      <div className="panel border-emerald-500/60 shadow-glow p-10 text-center space-y-4">
        <div className="mx-auto h-14 w-14 rounded-full bg-emerald-500/15 border border-emerald-400/60 flex items-center justify-center text-emerald-300 text-2xl">✓</div>
        <h3 className="font-serif text-2xl font-bold text-emerald-300">Form Claim Submitted Successfully!</h3>
        <p className="text-xs text-cream-300 max-w-md mx-auto">
          Your insurance claim responses passed dynamic validation rules and have been saved to MongoDB.
        </p>
        <button
          onClick={() => setFormType(activeFormType)}
          className="btn-primary text-xs px-6 py-2.5"
        >
          Submit Another Form Claim
        </button>
      </div>
    );
  }

  if (!activeSchema) return null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Dynamic Validation & Progress Slider Tracker */}
      <MissingFieldsBanner />

      {/* Render Dynamic Schema Sections */}
      {activeSchema.sections?.map((section) => (
        <DynamicFormSection
          key={section.id}
          section={section}
          register={register}
          errors={errors}
        />
      ))}

      {/* Save Draft & Submission Command Bar styled like the reference buttons */}
      <div className="panel p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={saveDraft}
            disabled={isSavingDraft}
            className="btn-secondary text-xs px-5 py-2.5"
          >
            {isSavingDraft ? 'Saving Draft...' : 'Save Draft State (Idempotent)'}
          </button>

          {lastSavedAt && (
            <span className="text-xs font-mono text-cream-400">
              Saved at: {new Date(lastSavedAt).toLocaleTimeString()}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || missingFields.length > 0}
          className="btn-primary text-xs px-7 py-2.5"
        >
          {isSubmitting ? 'Submitting Claim...' : 'Finalize & Submit Form Claim'}
        </button>
      </div>

      {submitError && (
        <div className="p-3 rounded-lg border border-red-500/60 bg-red-500/10 text-red-300 text-xs font-bold">
          {submitError}
        </div>
      )}
    </form>
  );
}
