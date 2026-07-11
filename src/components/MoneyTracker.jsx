/**
 * MoneyTracker.jsx — Floating wallet tracker
 *
 * Props: activeDay (null | 1–14)
 *
 * State — ALL shared via hooks (useExpenses / useBudget / useBookings /
 * useStepExpenses / useTripOptions) so this popup and SpendSection can
 * never disagree on totals. Only 'mt-current-day' (which day am I on)
 * is owned here.
 *
 * The popup itself only handles "which day am I on" + quick expense entry +
 * day-by-day budget tracking. Everything else (bookings, category summary,
 * full expense list) lives on the main scrollable page — see SpendSection
 * and BookingsSection.
 */
import { useState, useEffect, useMemo } from 'react';
import {
  Wallet, Plus, X, Trash2, AlertTriangle, ChevronDown,
  CalendarDays, Check,
} from 'lucide-react';
import { DAYS, calcDayCost, getTripDay } from '../data/tripData';
import { useBookings } from '../hooks/useBookings';
import { useStepExpenses, parseStepCost } from '../hooks/useStepExpenses';
import { useTripOptions } from '../hooks/useTripOptions';
import { useExpenses } from '../hooks/useExpenses';
import { useBudget } from '../hooks/useBudget';
import { daySpentFor, calcSpendTotals } from '../utils/spend';
import ExpenseConfirmModal from './ExpenseConfirmModal';

const CATEGORIES  = ['Food', 'Transport', 'Activity', 'Accommodation', 'Shopping', 'Other'];

const CAT_COLOR = {
  Food:          { badge: 'bg-orange-500/15 text-orange-300 border-orange-500/20', bar: 'bg-orange-400' },
  Transport:     { badge: 'bg-blue-500/15 text-blue-300 border-blue-500/20',       bar: 'bg-blue-400'   },
  Activity:      { badge: 'bg-purple-500/15 text-purple-300 border-purple-500/20', bar: 'bg-purple-400' },
  Accommodation: { badge: 'bg-brand-gold/15 text-brand-gold border-brand-gold/20', bar: 'bg-brand-gold' },
  Shopping:      { badge: 'bg-pink-500/15 text-pink-300 border-pink-500/20',       bar: 'bg-pink-400'   },
  Other:         { badge: 'bg-white/5 text-white/50 border-white/10',              bar: 'bg-white/30'   },
};

function loadKey(key, def) {
  try { return JSON.parse(localStorage.getItem(key) ?? 'null') ?? def; } catch { return def; }
}
function saveKey(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

function Bar({ pct, danger, warn }) {
  return (
    <div className="h-1.5 bg-surface-bg rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${
          danger ? 'bg-brand-danger' : warn ? 'bg-brand-gold' : 'bg-green-400'
        }`}
        style={{ width: `${Math.min(pct, 100)}%` }}
      />
    </div>
  );
}

function StatusBadge({ pct, remaining }) {
  if (remaining < 0)  return <span className="text-xs font-bold text-brand-danger">⚠ Over budget</span>;
  if (pct >= 90)      return <span className="text-xs font-bold text-brand-danger">⚠ Critical</span>;
  if (pct >= 70)      return <span className="text-xs font-bold text-brand-gold">~ Close</span>;
  if (pct >= 40)      return <span className="text-xs font-bold text-green-400">✓ On track</span>;
  return               <span className="text-xs font-bold text-green-400">✓ Well under</span>;
}

/* ─── Day tracking row ───────────────────────────────────────────────────── */
function DayProgressRow({ day, range, spentOnDay, isSelected, onClick }) {
  const { min, max } = range;
  const pct      = max > 0 ? (spentOnDay / max) * 100 : 0;
  const over     = spentOnDay > max;
  const hasSpend = spentOnDay > 0;
  const label    = min === max ? `${max}` : `${min}–${max}`;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-2xl border p-3 transition-all ${
        isSelected
          ? 'border-brand-red/50 bg-brand-red/5'
          : 'border-surface-border bg-surface-elevated hover:border-surface-hover'
      }`}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${
            isSelected ? 'bg-brand-red text-white' : 'bg-surface-border text-white/50'
          }`}>
            D{day.day}
          </span>
          <span className="text-xs text-white/60 truncate max-w-[120px]">{day.theme}</span>
        </div>
        <div className="text-right shrink-0">
          {hasSpend ? (
            <span className={`text-xs font-mono font-bold ${over ? 'text-brand-danger' : 'text-white'}`}>
              RM{Math.round(spentOnDay)} / {label}
            </span>
          ) : (
            <span className="text-xs text-white/25 font-mono">RM0 / {label}</span>
          )}
        </div>
      </div>
      <div className="h-1 bg-surface-bg rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            over ? 'bg-brand-danger' : pct >= 70 ? 'bg-brand-gold' : hasSpend ? 'bg-green-400' : 'bg-surface-border'
          }`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
    </button>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function MoneyTracker({ activeDay }) {
  const [open,         setOpen]         = useState(false);
  const { entries, addEntry: addSharedEntry, removeEntry } = useExpenses();
  const [bookings]                      = useBookings();
  const { stepExpenses, logStep, removeStep } = useStepExpenses();
  const [confirmStep,  setConfirmStep]  = useState(null); // {stepId, step} being confirmed
  const { values: tripOptionValues }    = useTripOptions();
  const { budget }                      = useBudget(tripOptionValues);
  const [showForm,     setShowForm]     = useState(false);
  const [currentDay,   setCurrentDay]   = useState(() => loadKey('mt-current-day', getTripDay() ?? 1));
  const effectiveDay   = activeDay ?? currentDay;
  const [form,         setForm]         = useState({ desc: '', amount: '', cat: 'Food', day: effectiveDay ?? '' });
  const [err,          setErr]          = useState('');

  useEffect(() => { saveKey('mt-current-day', currentDay); }, [currentDay]);

  // Escape closes the modal (unless a confirm popup is on top, which handles
  // its own Escape); lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape' && !confirmStep) setOpen(false); };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, confirmStep]);
  useEffect(() => {
    if (open) setForm(f => ({ ...f, day: effectiveDay ?? '' }));
  }, [open, effectiveDay]);
  useEffect(() => {
    if (activeDay) setCurrentDay(activeDay);
  }, [activeDay]);

  /* ── Totals — shared helpers so this always matches SpendSection ── */
  const { totalSpent } = useMemo(
    () => calcSpendTotals(entries, bookings, stepExpenses),
    [entries, bookings, stepExpenses]
  );
  const remaining = budget - totalSpent;

  const dayData    = DAYS.find(d => d.day === effectiveDay);
  // Planned-expense checklist for the selected day: every step with a
  // parseable cost, sharing stepIds with StepTimeline so both stay in sync.
  const dayChecklist = useMemo(() => {
    if (!dayData) return [];
    return dayData.steps
      .map((step, i) => ({ step, stepId: `d${dayData.day}-s${i}`, estimate: parseStepCost(step.cost) }))
      .filter(item => item.estimate != null && item.estimate > 0);
  }, [dayData]);
  const dayRange   = useMemo(() => dayData ? calcDayCost(dayData, tripOptionValues) : { min: 0, max: 0 }, [dayData, tripOptionValues]);
  const dayPlanned = dayRange.max;
  const dayPlannedLabel = dayRange.min === dayRange.max ? `${dayRange.max}` : `${dayRange.min}–${dayRange.max}`;
  const daySpent   = useMemo(
    () => daySpentFor(effectiveDay, entries, bookings, stepExpenses),
    [entries, bookings, stepExpenses, effectiveDay]
  );
  const dayRemain  = dayPlanned - daySpent;
  const dayPct     = dayPlanned > 0 ? (daySpent / dayPlanned) * 100 : 0;
  const dayOver    = daySpent > dayPlanned;

  /* ── UI helpers ── */
  function addEntry(e) {
    e.preventDefault();
    const amt = parseFloat(form.amount);
    if (!form.desc.trim() || isNaN(amt) || amt <= 0) { setErr('Enter a description and amount.'); return; }
    addSharedEntry({ desc: form.desc.trim(), amount: amt, cat: form.cat, day: form.day || null });
    setForm(f => ({ ...f, desc: '', amount: '' }));
    setErr('');
    setShowForm(false);
  }

  // Before the trip the total is what matters; during the trip (or with a
  // day view open) the current day's remaining budget is more actionable.
  const duringTrip = getTripDay() != null;
  const btnLabel = (activeDay || duringTrip) && effectiveDay && dayPlanned > 0
    ? `Day ${effectiveDay}: RM${Math.round(dayRemain)} left`
    : `RM${Math.round(remaining).toLocaleString()} left`;
  const isDanger  = remaining < 0;
  const isWarning = !isDanger && budget > 0 && (totalSpent / budget) * 100 >= 70;

  return (
    <>
      {/* ── Floating button ── */}
      <button
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 right-4 z-[250] flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm shadow-2xl border transition-all ${
          isDanger  ? 'bg-brand-danger border-brand-danger text-white animate-pulse'
          : isWarning ? 'bg-brand-gold border-brand-gold text-black'
          : 'bg-surface-elevated border-surface-border text-white'
        }`}
      >
        <Wallet size={15} />
        {btnLabel}
        {isDanger && <AlertTriangle size={13} />}
      </button>

      {/* ── Modal ── */}
      {open && (
        <div
          className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center bg-black/80 animate-fade-in"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full sm:max-w-lg bg-surface-card rounded-t-3xl sm:rounded-3xl border border-surface-border max-h-[92vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-surface-border shrink-0">
              <div>
                <h2 className="font-display font-bold text-lg">Days tracking</h2>
                <p className="text-xs text-white/30 mt-0.5">
                  RM{Math.round(totalSpent).toLocaleString()} spent · {remaining >= 0
                    ? `RM${Math.round(remaining).toLocaleString()} left`
                    : <span className="text-brand-danger font-semibold">RM{Math.round(-remaining).toLocaleString()} over</span>}
                </p>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-surface-elevated transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">

              {/* Which day are we on — persists independently of navigation */}
              <div className="flex items-center gap-2 card-elevated rounded-2xl p-2.5">
                <button
                  onClick={() => setCurrentDay(d => Math.max(1, d - 1))}
                  disabled={!!activeDay || currentDay <= 1}
                  className="p-1.5 rounded-lg hover:bg-surface-elevated disabled:opacity-20 disabled:cursor-not-allowed text-white/50 shrink-0"
                >
                  ‹
                </button>
                <div className="flex-1 flex items-center gap-1.5 min-w-0">
                  <CalendarDays size={13} className="text-brand-red shrink-0" />
                  <span className="text-xs text-white/40 shrink-0">On:</span>
                  <select
                    value={currentDay}
                    disabled={!!activeDay}
                    onChange={e => setCurrentDay(Number(e.target.value))}
                    className="flex-1 min-w-0 bg-transparent text-sm font-semibold text-white focus:outline-none disabled:opacity-70"
                  >
                    {DAYS.map(d => (
                      <option key={d.day} value={d.day} className="bg-surface-card">Day {d.day} — {d.theme}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => setCurrentDay(d => Math.min(DAYS.length, d + 1))}
                  disabled={!!activeDay || currentDay >= DAYS.length}
                  className="p-1.5 rounded-lg hover:bg-surface-elevated disabled:opacity-20 disabled:cursor-not-allowed text-white/50 shrink-0"
                >
                  ›
                </button>
              </div>
              {activeDay && (
                <p className="text-[11px] text-white/25 -mt-2">Following Day {activeDay} from the open page. Close it to pick a day manually.</p>
              )}

              {/* Selected day detail */}
              {dayPlanned > 0 && (
                <div className={`rounded-2xl border p-4 space-y-3 ${
                  dayOver    ? 'border-brand-danger/40 bg-brand-danger/5'
                  : dayPct >= 70 ? 'border-brand-gold/30 bg-brand-gold/5'
                  : daySpent > 0 ? 'border-green-500/30 bg-green-500/5'
                  : 'border-surface-border bg-surface-elevated'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40 flex items-center gap-1.5"><CalendarDays size={13} className="text-brand-red" />Day {effectiveDay} budget</span>
                    <StatusBadge pct={dayPct} remaining={dayRemain} />
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xl font-display font-bold">RM{Math.round(daySpent)}</span>
                    <span className="text-white/30 text-sm">/ {dayPlannedLabel}</span>
                  </div>
                  <Bar pct={dayPct} danger={dayOver} warn={dayPct >= 70 && !dayOver} />
                  {dayOver && (
                    <p className="text-xs text-brand-danger">RM{Math.round(-dayRemain)} over the planned day budget</p>
                  )}
                  {!dayOver && daySpent === 0 && (
                    <p className="text-xs text-white/30">No expenses logged for this day yet</p>
                  )}
                </div>
              )}

              {/* Planned expenses checklist — tick as you pay */}
              {dayChecklist.length > 0 && (
                <div>
                  <p className="text-xs text-white/30 uppercase tracking-wider mb-2">
                    Day {effectiveDay} planned expenses
                  </p>
                  <div className="space-y-1.5">
                    {dayChecklist.map(({ step, stepId, estimate }) => {
                      const logged = stepExpenses[stepId];
                      const done = logged != null;
                      return (
                        <button
                          key={stepId}
                          onClick={() => setConfirmStep({ step, stepId, estimate })}
                          className={`w-full flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors ${
                            done
                              ? 'bg-brand-red/5 border-brand-red/25'
                              : 'bg-surface-elevated border-surface-border hover:border-brand-bright/40'
                          }`}
                        >
                          <span className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                            done ? 'bg-brand-red border-brand-red text-white' : 'border-white/25'
                          }`}>
                            {done && <Check size={12} className="animate-pop" />}
                          </span>
                          <span className={`flex-1 min-w-0 text-sm truncate ${done ? 'text-white/45 line-through' : 'text-white/85'}`}>
                            {step.title}
                          </span>
                          <span className={`text-xs font-mono font-bold shrink-0 ${done ? 'text-brand-bright' : 'text-white/40'}`}>
                            {done ? `RM${logged.paid}` : step.cost}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Add unplanned expense */}
              <button
                onClick={() => setShowForm(f => !f)}
                className="w-full flex items-center justify-center gap-2 py-3 btn-primary text-sm font-semibold rounded-xl"
              >
                <Plus size={16} /> Add other expense
                <ChevronDown size={14} className={`transition-transform ${showForm ? 'rotate-180' : ''}`} />
              </button>

              {showForm && (
                <form onSubmit={addEntry} className="card-elevated rounded-2xl p-4 space-y-3 animate-slide-up">
                  {err && <p className="text-brand-danger text-xs">{err}</p>}
                  <input
                    value={form.desc}
                    onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
                    placeholder="What did you spend on?"
                    className="w-full bg-surface-bg border border-surface-border rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-red"
                  />
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">RM</span>
                      <input
                        type="number" step="1" min="0"
                        value={form.amount}
                        onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                        placeholder="0"
                        className="w-full bg-surface-bg border border-surface-border rounded-xl pl-10 pr-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-red"
                      />
                    </div>
                    <select
                      value={form.cat}
                      onChange={e => setForm(f => ({ ...f, cat: e.target.value }))}
                      className="bg-surface-bg border border-surface-border rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-red"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c} className="bg-surface-card">{c}</option>)}
                    </select>
                  </div>
                  <select
                    value={form.day ?? ''}
                    onChange={e => setForm(f => ({ ...f, day: e.target.value ? Number(e.target.value) : null }))}
                    className="w-full bg-surface-bg border border-surface-border rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-red"
                  >
                    <option value="" className="bg-surface-card">No specific day</option>
                    {DAYS.map(d => <option key={d.day} value={d.day} className="bg-surface-card">Day {d.day} — {d.theme}</option>)}
                  </select>
                  <button type="submit" className="w-full py-2.5 btn-primary rounded-xl text-sm font-bold">Add</button>
                </form>
              )}

              {/* Recent manual entries — quick delete */}
              {entries.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-white/30 uppercase tracking-wider">Manual entries</p>
                  {entries.slice(0, 5).map(e => (
                    <div key={e.id} className="flex items-center gap-3 bg-surface-elevated border border-surface-border rounded-xl px-3 py-2.5">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{e.desc}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-xs px-1.5 py-0.5 rounded border ${CAT_COLOR[e.cat]?.badge}`}>{e.cat}</span>
                          {e.day && <span className="text-xs text-white/30">Day {e.day}</span>}
                          <span className="text-xs text-white/20">{e.date}</span>
                        </div>
                      </div>
                      <span className="text-sm font-bold shrink-0">RM{e.amount}</span>
                      <button onClick={() => removeEntry(e.id)} className="p-1 rounded hover:bg-red-500/20 hover:text-red-400 text-white/20 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* All 14 days */}
              <div>
                <p className="text-xs text-white/30 uppercase tracking-wider mb-3">All {DAYS.length} days</p>
                <div className="space-y-2">
                  {DAYS.map(d => (
                    <DayProgressRow
                      key={d.day}
                      day={d}
                      range={calcDayCost(d, tripOptionValues)}
                      spentOnDay={daySpentFor(d.day, entries, bookings, stepExpenses)}
                      isSelected={d.day === effectiveDay}
                      onClick={() => setCurrentDay(d.day)}
                    />
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Confirm popup for a ticked planned expense */}
      {confirmStep && (
        <ExpenseConfirmModal
          title={confirmStep.step.title}
          costLabel={confirmStep.step.cost}
          estimate={confirmStep.estimate}
          existing={stepExpenses[confirmStep.stepId]}
          onConfirm={(amount) => logStep(confirmStep.stepId, amount, confirmStep.step.title)}
          onRemove={() => removeStep(confirmStep.stepId)}
          onClose={() => setConfirmStep(null)}
        />
      )}
    </>
  );
}
