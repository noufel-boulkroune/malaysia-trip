/**
 * MoneyTracker.jsx — Floating wallet tracker
 *
 * Props: activeDay (null | 1–14)
 *
 * localStorage keys
 * -----------------
 * mt-entries       — manual expense log [{id, desc, amount, cat, day, date}]
 * mt-budget        — user-editable trip budget (default: 3491.5 MYR)
 * mt-bookings      — shared via useBookings hook
 * mt-step-expenses — logged step costs via useStepExpenses hook
 *
 * The popup itself only handles "which day am I on" + quick expense entry +
 * day-by-day budget tracking. Everything else (bookings, category summary,
 * full expense list) lives on the main scrollable page — see SpendSection
 * and BookingsSection.
 */
import { useState, useEffect, useMemo } from 'react';
import {
  Wallet, Plus, X, Trash2, AlertTriangle, ChevronDown,
  CalendarDays,
} from 'lucide-react';
import { DAYS, BOOKING_PRESETS, calcDayCost, calcTripCostRange, getTripDay } from '../data/tripData';
import { useBookings } from '../hooks/useBookings';
import { useStepExpenses } from '../hooks/useStepExpenses';
import { useTripOptions } from '../hooks/useTripOptions';

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

const TODAY_DAY = getTripDay();

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
  const [entries,      setEntries]      = useState(() => loadKey('mt-entries', []));
  const [bookings]                      = useBookings();
  const { stepExpenses }                = useStepExpenses();
  const { values: tripOptionValues }    = useTripOptions();
  const tripRange      = useMemo(() => calcTripCostRange(tripOptionValues), [tripOptionValues]);
  const [budgetOverride] = useState(() => loadKey('mt-budget', null));
  const budget          = budgetOverride ?? tripRange.max;
  const [showForm,     setShowForm]     = useState(false);
  const [currentDay,   setCurrentDay]   = useState(() => loadKey('mt-current-day', TODAY_DAY ?? 1));
  const effectiveDay   = activeDay ?? currentDay;
  const [form,         setForm]         = useState({ desc: '', amount: '', cat: 'Food', day: effectiveDay ?? '' });
  const [err,          setErr]          = useState('');

  useEffect(() => { saveKey('mt-entries', entries); }, [entries]);
  useEffect(() => { saveKey('mt-current-day', currentDay); }, [currentDay]);
  useEffect(() => {
    if (open) setForm(f => ({ ...f, day: effectiveDay ?? '' }));
  }, [open, effectiveDay]);
  useEffect(() => {
    if (activeDay) setCurrentDay(activeDay);
  }, [activeDay]);

  /* ── Totals ── */
  const bookedTotal = useMemo(() =>
    Object.values(bookings).filter(b => b.booked).reduce((s, b) => s + (b.paid ?? 0), 0),
  [bookings]);

  const stepTotal = useMemo(() =>
    Object.values(stepExpenses).reduce((s, e) => s + (e.paid ?? 0), 0),
  [stepExpenses]);

  const spendTotal  = useMemo(() => entries.reduce((s, e) => s + e.amount, 0), [entries]);
  const totalSpent  = spendTotal + bookedTotal + stepTotal;
  const remaining   = budget - totalSpent;

  /* ── Day helpers ── */
  function daySpentFor(dayNum) {
    const entriesAmt = entries
      .filter(e => e.day === dayNum)
      .reduce((s, e) => s + e.amount, 0);

    const bookingsAmt = Object.entries(bookings)
      .filter(([id, b]) => b.booked && BOOKING_PRESETS.find(p => p.id === id)?.day === dayNum)
      .reduce((s, [, b]) => s + (b.paid ?? 0), 0);

    const stepsAmt = Object.entries(stepExpenses)
      .filter(([id]) => id.startsWith(`d${dayNum}-`))
      .reduce((s, [, e]) => s + (e.paid ?? 0), 0);

    return entriesAmt + bookingsAmt + stepsAmt;
  }

  const dayData    = DAYS.find(d => d.day === effectiveDay);
  const dayRange   = useMemo(() => dayData ? calcDayCost(dayData, tripOptionValues) : { min: 0, max: 0 }, [dayData, tripOptionValues]);
  const dayPlanned = dayRange.max;
  const dayPlannedLabel = dayRange.min === dayRange.max ? `${dayRange.max}` : `${dayRange.min}–${dayRange.max}`;
  const daySpent   = useMemo(() => daySpentFor(effectiveDay), [entries, bookings, stepExpenses, effectiveDay]);
  const dayRemain  = dayPlanned - daySpent;
  const dayPct     = dayPlanned > 0 ? (daySpent / dayPlanned) * 100 : 0;
  const dayOver    = daySpent > dayPlanned;

  /* ── UI helpers ── */
  function addEntry(e) {
    e.preventDefault();
    const amt = parseFloat(form.amount);
    if (!form.desc.trim() || isNaN(amt) || amt <= 0) { setErr('Enter a description and amount.'); return; }
    setEntries(prev => [{
      id: Date.now(), desc: form.desc.trim(), amount: amt,
      cat: form.cat, day: form.day || null,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
    }, ...prev]);
    setForm(f => ({ ...f, desc: '', amount: '' }));
    setErr('');
    setShowForm(false);
  }

  const btnLabel = effectiveDay && dayPlanned > 0
    ? `Day ${effectiveDay}: RM${Math.round(dayRemain)}`
    : `RM${Math.round(remaining)} left`;
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
                  RM{Math.round(totalSpent).toLocaleString()} spent · RM{Math.round(remaining >= 0 ? remaining : 0).toLocaleString()} left
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
                  onClick={() => setCurrentDay(d => Math.min(14, d + 1))}
                  disabled={!!activeDay || currentDay >= 14}
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

              {/* Add expense */}
              <button
                onClick={() => setShowForm(f => !f)}
                className="w-full flex items-center justify-center gap-2 py-3 btn-primary text-sm font-semibold rounded-xl"
              >
                <Plus size={16} /> Add expense
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
                      <button onClick={() => setEntries(p => p.filter(x => x.id !== e.id))} className="p-1 rounded hover:bg-red-500/20 hover:text-red-400 text-white/20 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* All 14 days */}
              <div>
                <p className="text-xs text-white/30 uppercase tracking-wider mb-3">All 14 days</p>
                <div className="space-y-2">
                  {DAYS.map(d => (
                    <DayProgressRow
                      key={d.day}
                      day={d}
                      range={calcDayCost(d, tripOptionValues)}
                      spentOnDay={daySpentFor(d.day)}
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
    </>
  );
}
