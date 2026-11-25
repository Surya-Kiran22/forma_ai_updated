import React, { useEffect } from 'react';
import { useFormStore } from '../../store/useFormStore';

export function SubmissionsHistoryModal({ isOpen, onClose }) {
  const { userSubmissions, fetchSubmissions } = useFormStore();

  useEffect(() => {
    if (isOpen) {
      fetchSubmissions();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-md animate-fade-in">
      <div className="panel bg-ink-800 w-full max-w-2xl p-7 shadow-glow relative max-h-[85vh] flex flex-col animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-cream-400 hover:text-emerald-300 font-bold text-xs transition-colors"
        >
          [ Close ]
        </button>

        <h2 className="font-serif text-2xl font-bold text-cream-50 border-b border-ink-500/60 pb-3 mb-5 pr-16">
          Submitted Claims History (MongoDB Ledger)
        </h2>

        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {userSubmissions.length === 0 ? (
            <div className="text-center py-12 text-cream-400 text-xs font-medium">
              No submitted claims found. Complete and submit a form to view history.
            </div>
          ) : (
            userSubmissions.map((sub) => (
              <div key={sub._id} className="panel-inset p-4 space-y-2">
                <div className="flex items-center justify-between border-b border-ink-500/50 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-cream-100 uppercase tracking-wide">{sub.formType}</span>
                    <span className="text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                      v{sub.schemaVersion}
                    </span>
                  </div>
                  <span className="text-xs text-cream-400 font-mono">
                    {new Date(sub.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                  {Object.entries(sub.data || {}).map(([key, val]) => (
                    <div key={key} className="bg-ink-950/60 p-2 rounded-lg border border-ink-600/70 truncate">
                      <span className="text-cream-400 block text-[10px]">{key}</span>
                      <span className="text-emerald-300 font-bold">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
