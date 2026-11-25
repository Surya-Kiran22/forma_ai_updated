import React, { useState } from 'react';
import { api } from '../../services/api';

export function BenchmarkModal({ isOpen, onClose }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const runBenchmark = async () => {
    setLoading(true);
    try {
      const res = await api.get('/extraction/benchmark');
      setReport(res.data.data);
    } catch (err) {
      console.error('Failed to run benchmark suite', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-md animate-fade-in">
      <div className="panel bg-ink-800 w-full max-w-3xl p-7 shadow-glow relative max-h-[90vh] flex flex-col animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-cream-400 hover:text-emerald-300 font-bold text-xs transition-colors"
        >
          [ Close ]
        </button>

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-500/60 pb-4 mb-5 pr-16">
          <div>
            <h2 className="font-serif text-2xl font-bold text-cream-50">LLM Accuracy Benchmark Suite</h2>
            <p className="text-xs text-cream-300">Evaluate LLM extraction against ground-truth dataset</p>
          </div>

          <button
            onClick={runBenchmark}
            disabled={loading}
            className="btn-primary text-xs px-5 py-2"
          >
            {loading ? 'Executing Suite...' : 'Run LLM Benchmark'}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-5">
          {!report && !loading && (
            <div className="panel-inset p-10 text-center space-y-2">
              <h3 className="text-sm font-bold text-cream-100">Ready to Benchmark</h3>
              <p className="text-xs text-cream-300 max-w-md mx-auto">
                Click "Run LLM Benchmark" to run extraction across labeled narratives and compute exact match precision, recall, and F1 metrics.
              </p>
            </div>
          )}

          {report && (
            <>
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-emerald-500/10 border border-emerald-500/40 p-3 rounded-xl text-center">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Precision</span>
                  <span className="font-serif text-2xl font-bold text-emerald-300">{report.summary.precisionPercent}%</span>
                </div>
                <div className="bg-cream-100/5 border border-cream-300/30 p-3 rounded-xl text-center">
                  <span className="text-[10px] font-bold text-cream-300 uppercase tracking-wider block">Recall</span>
                  <span className="font-serif text-2xl font-bold text-cream-50">{report.summary.recallPercent}%</span>
                </div>
                <div className="bg-emerald-400/10 border border-emerald-300/40 p-3 rounded-xl text-center">
                  <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">F1 Score</span>
                  <span className="font-serif text-2xl font-bold text-emerald-200">{report.summary.f1ScorePercent}%</span>
                </div>
                <div className="bg-gold-400/10 border border-gold-400/40 p-3 rounded-xl text-center">
                  <span className="text-[10px] font-bold text-gold-300 uppercase tracking-wider block">Exact Matches</span>
                  <span className="font-serif text-2xl font-bold text-gold-300">
                    {report.summary.exactMatches} / {report.summary.totalFieldsExpected}
                  </span>
                </div>
              </div>

              {/* Test Cases */}
              <div className="space-y-3">
                <h4 className="eyebrow">Test Scenario Breakdown</h4>
                {report.testResults.map((t) => (
                  <div key={t.id} className="panel-inset p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-cream-100">[{t.id}] {t.description}</span>
                      <span className="font-mono font-bold text-emerald-300 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                        {t.accuracyPercent}% Match ({t.executionTimeMs}ms)
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                      <div className="bg-ink-950/70 p-2.5 rounded-lg border border-ink-500/70">
                        <span className="text-cream-400 font-bold block mb-1">Ground Truth:</span>
                        <pre className="text-cream-200 overflow-x-auto">{JSON.stringify(t.groundTruth, null, 1)}</pre>
                      </div>
                      <div className="bg-ink-950/70 p-2.5 rounded-lg border border-ink-500/70">
                        <span className="text-cream-400 font-bold block mb-1">LLM Extracted:</span>
                        <pre className="text-emerald-300 overflow-x-auto">{JSON.stringify(t.extracted, null, 1)}</pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
