/**
 * StepTimeline.jsx — Numbered itinerary step cards for a single day
 *
 * Every step with a parseable cost is a *planned expense checkbox*: tapping
 * the checkbox (or the cost chip) opens ExpenseConfirmModal pre-filled with
 * the planned amount — one tap to confirm, edit first if the price differed.
 * Confirmed steps turn green and feed daySpentFor / trip totals via
 * useStepExpenses (stepId 'd{dayNum}-s{stepIndex}').
 *
 * Props
 * -----
 * steps[]       — step objects from DAYS[n].steps in tripData.js
 * dayNum        — current day number (used to build stepId)
 * stepExpenses  — { [stepId]: {paid, date, title?} } from useStepExpenses hook
 * onLogStep     — (stepId, paid, stepTitle) => void
 * onRemoveStep  — (stepId) => void
 */
import { useState } from 'react';
import { MapPin, ExternalLink, Lightbulb, Utensils, Check, Plus } from 'lucide-react';
import { parseStepCost } from '../hooks/useStepExpenses';
import ExpenseConfirmModal from './ExpenseConfirmModal';

function StepCard({ step, stepId, index, isLast, stepExpenses, onLogStep, onRemoveStep }) {
  const [showPopup, setShowPopup] = useState(false);
  const existing = stepExpenses?.[stepId];
  const isDone   = existing != null;
  const estimate = parseStepCost(step.cost);
  const canLog   = estimate != null;

  return (
    <div className="relative flex gap-4 sm:gap-6">
      {!isLast && (
        <div className={`absolute left-4 sm:left-5 top-10 bottom-0 w-px ${isDone ? 'bg-brand-red/40' : 'bg-surface-border'}`} />
      )}

      {/* Checkbox (loggable) or step number */}
      <div className="shrink-0 flex flex-col items-center">
        <button
          onClick={() => canLog && setShowPopup(true)}
          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center font-display font-bold text-xs transition-all ${
            isDone
              ? 'bg-brand-red border-brand-red text-white shadow-cta'
              : canLog
              ? 'bg-surface-elevated border-white/25 text-white/50 hover:border-brand-bright hover:text-brand-bright cursor-pointer'
              : 'bg-transparent border-surface-border text-white/30 cursor-default'
          }`}
          title={isDone ? `RM${existing.paid} logged — tap to edit` : canLog ? 'Tap to confirm this expense' : undefined}
          aria-label={isDone ? `Expense logged: RM${existing.paid}. Tap to edit` : canLog ? `Confirm expense: ${step.title}` : undefined}
          disabled={!canLog}
        >
          {isDone ? <Check size={16} className="animate-pop" /> : index + 1}
        </button>
      </div>

      {/* Card */}
      <div className="flex-1 pb-7">
        <div className={`border rounded-2xl p-4 sm:p-5 transition-colors ${
          isDone
            ? 'bg-brand-red/5 border-brand-red/25'
            : 'bg-surface-card border-surface-border hover:border-white/15'
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

            {/* Planned expense chip — the second tap target for logging */}
            <div className="ml-auto flex items-center gap-1.5">
              {isDone ? (
                <button
                  onClick={() => setShowPopup(true)}
                  className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-brand-red/15 border border-brand-red/30 text-brand-bright font-bold hover:bg-brand-red/25 transition-colors"
                >
                  <Check size={12} /> RM{existing.paid} paid
                </button>
              ) : canLog ? (
                <button
                  onClick={() => setShowPopup(true)}
                  className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-surface-elevated border border-white/15 text-white/70 font-semibold hover:border-brand-bright hover:text-brand-bright transition-colors"
                >
                  <Plus size={11} /> {step.cost}
                </button>
              ) : step.cost ? (
                <span className="text-xs px-2 py-0.5 rounded-full bg-surface-border text-white/50">
                  {step.cost}
                </span>
              ) : null}
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
                className="flex items-center gap-1 shrink-0 text-xs text-white/40 hover:text-brand-bright transition-colors mt-0.5"
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
              className="inline-flex items-center gap-2 mt-4 w-full justify-center px-4 py-2.5 btn-primary text-sm"
            >
              Book now <ExternalLink size={13} />
            </a>
          )}
        </div>
      </div>

      {showPopup && (
        <ExpenseConfirmModal
          title={step.title}
          costLabel={step.cost}
          estimate={estimate}
          existing={existing}
          onConfirm={(amount) => onLogStep(stepId, amount, step.title)}
          onRemove={() => onRemoveStep(stepId)}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
}

export default function StepTimeline({ steps, dayNum, stepExpenses, onLogStep, onRemoveStep }) {
  return (
    <div className="mt-6">
      <p className="section-eyebrow mb-2">Itinerary</p>
      <p className="text-xs text-white/35 mb-6">Tap a checkbox when you pay — the planned amount is pre-filled.</p>
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
