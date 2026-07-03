/**
 * StepTimeline.jsx — Numbered itinerary step cards for a single day
 *
 * Props
 * -----
 * steps[]       — step objects from DAYS[n].steps in tripData.js
 * dayNum        — current day number (used to build stepId for expense tracking)
 * stepExpenses  — { [stepId]: {paid, date} } from useStepExpenses hook
 * onLogStep     — (stepId, paid, stepTitle) => void  called on expense confirm
 * onRemoveStep  — (stepId) => void  called on "undo" tap
 *
 * Step fields: time, title, desc, cost, halal, optional, images, tip, mapsUrl, book
 * stepId format: 'd{dayNum}-s{stepIndex}'
 */
import { useState } from 'react';
import { MapPin, ExternalLink, Lightbulb, Utensils, CheckCircle2, Plus, X } from 'lucide-react';
import { parseStepCost } from '../hooks/useStepExpenses';

/* ─── Expense popup ──────────────────────────────────────────────────────── */
function ExpensePopup({ step, stepId, existing, onConfirm, onRemove, onClose }) {
  const estimate = parseStepCost(step.cost);
  const [amount, setAmount] = useState(
    existing != null ? String(existing.paid) : estimate != null ? String(estimate) : ''
  );

  const isFree = estimate === 0;

  function handleConfirm() {
    const num = parseFloat(amount);
    onConfirm(stepId, isNaN(num) ? 0 : num, step.title);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/80 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-surface-card border border-surface-border rounded-3xl p-5 animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs text-white/30 uppercase tracking-widest mb-1">Log expense</p>
            <h3 className="font-display font-bold text-base leading-snug">{step.title}</h3>
            {step.cost && <p className="text-xs text-white/40 mt-0.5">Estimated: {step.cost}</p>}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-elevated text-white/30 hover:text-white transition-colors">
            <X size={15} />
          </button>
        </div>

        {isFree ? (
          /* Free item — just confirm */
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-center">
              <p className="text-green-400 font-semibold text-sm">This activity is Free!</p>
              <p className="text-xs text-white/40 mt-0.5">No expense to log</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { onConfirm(stepId, 0, step.title); onClose(); }}
                className="flex-1 py-2.5 bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl text-sm transition-colors"
              >
                Mark as done
              </button>
              {existing && (
                <button onClick={() => { onRemove(stepId); onClose(); }} className="px-3 py-2.5 bg-surface-elevated hover:bg-surface-hover border border-surface-border rounded-xl text-xs text-white/50 transition-colors">
                  Undo
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Paid item — confirm or edit amount */
          <div className="space-y-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm font-mono">RM</span>
              <input
                autoFocus
                type="number"
                min="0"
                step="1"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleConfirm()}
                placeholder="0"
                className="w-full bg-surface-elevated border border-surface-border rounded-xl pl-10 pr-4 py-3 text-white text-lg font-mono focus:outline-none focus:border-brand-red"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleConfirm}
                className="flex-1 py-2.5 bg-brand-red hover:bg-brand-red-dark text-white font-bold rounded-xl text-sm transition-colors"
              >
                {existing ? 'Update' : 'Log it'}
              </button>
              {existing && (
                <button onClick={() => { onRemove(stepId); onClose(); }} className="px-3 py-2.5 bg-surface-elevated hover:bg-surface-hover border border-surface-border rounded-xl text-xs text-white/50 transition-colors">
                  Remove
                </button>
              )}
              <button onClick={onClose} className="px-3 py-2.5 bg-surface-elevated hover:bg-surface-hover border border-surface-border rounded-xl text-xs text-white/50 transition-colors">
                Skip
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Step card ──────────────────────────────────────────────────────────── */
function StepCard({ step, stepId, index, isLast, stepExpenses, onLogStep, onRemoveStep }) {
  const [showPopup, setShowPopup] = useState(false);
  const existing = stepExpenses?.[stepId];
  const isDone   = existing != null;
  const canLog   = !!step.cost || step.cost === 'Free';

  return (
    <div className="relative flex gap-4 sm:gap-6">
      {!isLast && (
        <div className="absolute left-4 sm:left-5 top-10 bottom-0 w-px bg-surface-border" />
      )}

      {/* Step number / check */}
      <div className="shrink-0 flex flex-col items-center">
        <button
          onClick={() => canLog && setShowPopup(true)}
          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center font-display font-bold text-xs transition-all ${
            isDone
              ? 'bg-green-500/20 border-green-500/50 text-green-400'
              : canLog
              ? 'bg-surface-elevated border-surface-border text-white/60 hover:border-brand-red/50 hover:text-brand-red cursor-pointer'
              : 'bg-surface-elevated border-surface-border text-white/60 cursor-default'
          }`}
          title={isDone ? `RM${existing.paid} logged — tap to edit` : canLog ? 'Tap to log expense' : undefined}
          disabled={!canLog}
        >
          {isDone ? <CheckCircle2 size={16} /> : index + 1}
        </button>
      </div>

      {/* Card */}
      <div className="flex-1 pb-8">
        <div className={`border rounded-2xl p-4 sm:p-5 transition-colors ${
          isDone
            ? 'bg-green-500/5 border-green-500/20'
            : 'bg-surface-elevated border-surface-border hover:border-brand-red/30'
        }`}>
          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="font-mono text-xs text-white/40">{step.time}</span>
            {step.halal && (
              <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 font-semibold">
                <Utensils size={11} /> Halal
              </span>
            )}
            {step.optional && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-surface-border text-white/50 font-semibold">
                Optional
              </span>
            )}

            {/* Cost + log button */}
            <div className="ml-auto flex items-center gap-1.5">
              {isDone ? (
                <button
                  onClick={() => setShowPopup(true)}
                  className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-500/15 border border-green-500/25 text-green-400 font-semibold hover:bg-green-500/25 transition-colors"
                >
                  <CheckCircle2 size={11} /> RM{existing.paid}
                </button>
              ) : (
                <>
                  {step.cost && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-surface-border text-white/50">
                      {step.cost}
                    </span>
                  )}
                  {canLog && (
                    <button
                      onClick={() => setShowPopup(true)}
                      className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-brand-red/10 border border-brand-red/25 text-brand-red font-semibold hover:bg-brand-red/20 transition-colors"
                    >
                      <Plus size={10} /> Log
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Title + map */}
          <div className="flex items-start gap-2 mb-2">
            <h4 className={`font-display font-bold text-base flex-1 ${isDone ? 'text-white/60' : ''}`}>
              {step.title}
            </h4>
            {step.mapsUrl && (
              <a
                href={step.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 shrink-0 text-xs text-white/40 hover:text-white/70 transition-colors mt-0.5"
                aria-label="Open in Google Maps"
              >
                <MapPin size={13} /> Map
              </a>
            )}
          </div>

          <p className="text-white/60 text-sm leading-relaxed">{step.desc}</p>

          {step.images?.length > 0 && (
            <div className={`grid gap-2 mt-4 ${step.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {step.images.map((src, i) => (
                <div key={i} className="aspect-video rounded-xl overflow-hidden">
                  <img src={src} alt={step.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" loading="lazy" />
                </div>
              ))}
            </div>
          )}

          {step.tip && (
            <div className="flex gap-2 mt-3 p-3 rounded-xl bg-brand-gold/5 border border-brand-gold/20 text-sm text-brand-gold/80">
              <Lightbulb size={15} className="shrink-0 mt-0.5" />
              {step.tip}
            </div>
          )}

          {step.book && (
            <a
              href={step.book}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 w-full justify-center px-4 py-2.5 bg-brand-red hover:bg-brand-red-dark text-white font-bold text-sm rounded-xl transition-colors"
            >
              Book now <ExternalLink size={13} />
            </a>
          )}
        </div>
      </div>

      {/* Expense popup */}
      {showPopup && (
        <ExpensePopup
          step={step}
          stepId={stepId}
          existing={existing}
          onConfirm={onLogStep}
          onRemove={onRemoveStep}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
}

/* ─── Timeline ───────────────────────────────────────────────────────────── */
export default function StepTimeline({ steps, dayNum, stepExpenses, onLogStep, onRemoveStep }) {
  return (
    <div className="mt-6">
      <p className="text-xs font-bold uppercase tracking-widest text-brand-red mb-6">Itinerary</p>
      {steps.map((step, i) => (
        <StepCard
          key={i}
          step={step}
          stepId={`d${dayNum}-s${i}`}
          index={i}
          isLast={i === steps.length - 1}
          stepExpenses={stepExpenses}
          onLogStep={onLogStep}
          onRemoveStep={onRemoveStep}
        />
      ))}
    </div>
  );
}
