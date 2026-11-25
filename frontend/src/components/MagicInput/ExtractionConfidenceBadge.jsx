import React from 'react';

export function ExtractionConfidenceBadge({ fieldId, confidenceScores, lowConfidenceFields }) {
  const score = confidenceScores?.[fieldId];
  if (score === undefined || score === null) return null;

  const isLowConfidence = lowConfidenceFields?.includes(fieldId) || score < 0.75;
  const percentage = Math.round(score * 100);

  let badgeStyle = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40';
  if (score < 0.75) {
    badgeStyle = 'bg-red-500/15 text-red-300 border-red-500/50 font-bold';
  } else if (score < 0.88) {
    badgeStyle = 'bg-gold-400/15 text-gold-300 border-gold-400/40';
  }

  return (
    <span className={`inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${badgeStyle}`}>
      {isLowConfidence ? `AI ${percentage}% (Review Advised)` : `AI ${percentage}% Confidence`}
    </span>
  );
}
