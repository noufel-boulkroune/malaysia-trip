/**
 * ExpenseConfirmModal.jsx — One-tap confirmation for a planned expense
 *
 * The core of checkbox-driven expense tracking: shown when the user ticks a
 * planned itinerary expense (from StepTimeline or the MoneyTracker day
 * checklist). Pre-fills the planned amount so confirming an exact-price
 * expense is a single tap; editing first is optional.
 *
 * Props
 * -----
 * title     — what the expense is (step title)
 * costLabel — the planned cost string ("RM20–30 pp") or undefined
 * estimate  — numeric planned amount (from parseStepCost); 0 = free step
 * existing  — {paid, date} if already logged (switches copy to edit mode)
 * onConfirm — (amount:number) => void
 * onRemove  — () => void  (only offered when existing)
 * onClose   — () => void
 */
import { useState, useEffect } from 'react';
import { X, CheckCircle2 } from 'lucide-react';

export default function ExpenseConfirmModal({ title, costLabel, estimate, existing, onConfirm, onRemove, onClose }) {
  const isFree = estimate === 0;
  const [amount, setAmount] = useState(
    existing != null ? String(existing.paid) : estimate != null ? String(estimate) : ''
  );

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  function confirm() {
    const num = parseFloat(amount);
    onConfirm(isNaN(num) ? 0 : num);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[500] flex items-end sm:items-center justify-center sm:p-4 bg-black/80 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-surface-card border border-surface-border rounded-t-3xl sm:rounded-3xl p-6 animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-xs text-brand-bright/70 uppercase tracking-[0.2em] mb-1.5">
              {existing ? 'Edit expense' : 'Confirm this expense'}
            </p>
            <h3 className="font-display font-bold text-lg leading-snug">{title}</h3>
            {costLabel && !isFree && (
              <p className="text-xs text-white/40 mt-1">Planned: {costLabel}</p>
            )}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-elevated text-white/30 hover:text-white transition-colors" aria-label="Close">
            <X size={16} />
          </button>
        </div>

        {isFree ? (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-green-500/10 border border-green-500/20 text-center">
              <p className="text-green-400 font-semibold text-sm flex items-center justify-center gap-1.5">
                <CheckCircle2 size={15} /> Free — nothing to pay
              </p>
            </div>
            <div className="flex gap-2.5">
              <button onClick={() => { onConfirm(0); onClose(); }} className="flex-1 py-3 btn-primary text-sm font-bold">
                Mark as done
              </button>
              {existing && (
                <button onClick={() => { onRemove(); onClose(); }} className="px-4 py-3 btn-ghost text-xs text-white/60">
                  Undo
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-base font-mono">RM</span>
              <input
                autoFocus
                type="number"
                inputMode="decimal"
                min="0"
                step="1"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                onFocus={e => e.target.select()}
                onKeyDown={e => e.key === 'Enter' && confirm()}
                placeholder="0"
                className="input w-full pl-12 pr-4 py-3.5 text-2xl font-display font-bold bg-surface-elevated"
                aria-label="Actual amount in MYR"
              />
            </div>
            <div className="flex gap-2.5">
              <button onClick={confirm} className="flex-1 py-3 btn-primary text-sm font-bold">
                {existing ? 'Update' : 'Confirm'}
              </button>
              {existing && (
                <button onClick={() => { onRemove(); onClose(); }} className="px-4 py-3 btn-ghost text-xs text-white/60">
                  Remove
                </button>
              )}
              <button onClick={onClose} className="px-4 py-3 btn-ghost text-xs text-white/60">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
