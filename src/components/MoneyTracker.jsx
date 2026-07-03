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
 * Tabs
 * ----
 * Spend    — add/remove manual expenses; trip total bar; day budget card
 * Bookings — BOOKING_PRESETS toggle + paid editor
 * Summary  — category breakdown bars + full expense list
 * Progress — day-by-day budget vs actual with colour-coded status
 */
import { useState, useEffect, useMemo } from 'react';
import {
  Wallet, Plus, X, Trash2, AlertTriangle, ChevronDown,
  CheckCircle2, Circle, ExternalLink, Receipt, CalendarDays,
  BarChart2, TrendingUp,
} from 'lucide-react';
import { DAYS, BOOKING_PRESETS } from '../data/tripData';
import { useBookings } from '../hooks/useBookings';
import { useStepExpenses } from '../hooks/useStepExpenses';

const TRIP_BUDGET = 3491.5;
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

/* ─── Day progress row ───────────────────────────────────────────────────── */
function DayProgressRow({ day, spentOnDay, isSelected, onClick }) {
  const planned  = Math.round((day.costBase.min + day.costBase.max) / 2);
  const pct      = planned > 0 ? (spentOnDay / planned) * 100 : 0;
  const over     = spentOnDay > planned;
  const hasSpend = spentOnDay > 0;

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
              RM{Math.round(spentOnDay)} / {planned}
            </span>
          ) : (
            <span className="text-xs text-white/25 font-mono">RM0 / {planned}</span>
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
  const [tab,          setTab]          = useState('spend');
  const [entries,      setEntries]      = useState(() => loadKey('mt-entries', []));
  const [bookings,     updateBookings]  = useBookings();
  const { stepExpenses }                = useStepExpenses();
  const [budget,       setBudget]       = useState(() => loadKey('mt-budget', TRIP_BUDGET));
  const [editBudget,   setEditBudget]   = useState(false);
  const [budgetInput,  setBudgetInput]  = useState('');
  const [showForm,     setShowForm]     = useState(false);
  const [form,         setForm]         = useState({ desc: '', amount: '', cat: 'Food', day: activeDay ?? '' });
  const [err,          setErr]          = useState('');
  const [selectedDay,  setSelectedDay]  = useState(activeDay ?? 1);

  useEffect(() => { saveKey('mt-entries', entries); }, [entries]);
  useEffect(() => { saveKey('mt-budget',  budget);  }, [budget]);
  useEffect(() => {
    if (open) setForm(f => ({ ...f, day: activeDay ?? '' }));
  }, [open, activeDay]);
  useEffect(() => {
    if (activeDay) setSelectedDay(activeDay);
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
  const pct         = (totalSpent / budget) * 100;
  const isDanger    = pct >= 90;
  const isWarning   = pct >= 70 && !isDanger;

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

  const dayData    = activeDay ? DAYS.find(d => d.day === activeDay) : null;
  const dayBudget  = dayData ? Math.round((dayData.costBase.min + dayData.costBase.max) / 2) : 0;
  const daySpent   = useMemo(() => daySpentFor(activeDay), [entries, bookings, stepExpenses, activeDay]);
  const dayRemain  = dayBudget - daySpent;
  const dayPct     = dayBudget > 0 ? (daySpent / dayBudget) * 100 : 0;

  /* ── Category breakdown ── */
  const catTotals = useMemo(() => {
    const totals = Object.fromEntries(CATEGORIES.map(c => [c, 0]));
    entries.forEach(e => { totals[e.cat] = (totals[e.cat] ?? 0) + e.amount; });
    // Step expenses → Activity
    Object.values(stepExpenses).forEach(e => { totals['Activity'] += e.paid ?? 0; });
    // Booked → Activity (bookings don't have a category; treat as Activity)
    totals['Activity'] += bookedTotal;
    return totals;
  }, [entries, stepExpenses, bookedTotal]);

  const maxCat = Math.max(...Object.values(catTotals), 1);

  /* ── All steps logged ── */
  const stepEntries = useMemo(() =>
    Object.entries(stepExpenses).map(([id, e]) => {
      const [dayPart] = id.split('-s');
      const dn = parseInt(dayPart.replace('d', ''));
      const day = DAYS.find(d => d.day === dn);
      return { id, ...e, dayNum: dn, dayTheme: day?.theme ?? '' };
    }).sort((a, b) => a.dayNum - b.dayNum),
  [stepExpenses]);

  /* ── Selected day detail (Progress tab) ── */
  const selDayData   = DAYS.find(d => d.day === selectedDay);
  const selPlanned   = selDayData ? Math.round((selDayData.costBase.min + selDayData.costBase.max) / 2) : 0;
  const selSpent     = useMemo(() => daySpentFor(selectedDay), [entries, bookings, stepExpenses, selectedDay]);
  const selRemain    = selPlanned - selSpent;
  const selPct       = selPlanned > 0 ? (selSpent / selPlanned) * 100 : 0;
  const selOver      = selSpent > selPlanned;

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

  function toggleBooking(preset) {
    updateBookings(prev => {
      const cur = prev[preset.id];
      if (cur?.booked) { const next = { ...prev }; delete next[preset.id]; return next; }
      return { ...prev, [preset.id]: { booked: true, paid: Math.round((preset.estMin + preset.estMax) / 2) } };
    });
  }

  function updatePaid(id, val) {
    const num = parseFloat(val);
    updateBookings(prev => ({ ...prev, [id]: { ...prev[id], paid: isNaN(num) ? 0 : num } }));
  }

  function saveBudget() {
    const b = parseFloat(budgetInput);
    if (!isNaN(b) && b > 0) setBudget(b);
    setEditBudget(false);
  }

  const bookedCount = Object.values(bookings).filter(b => b.booked === true).length;
  const btnLabel    = activeDay && dayBudget > 0
    ? `Day ${activeDay}: RM${Math.round(dayRemain)}`
    : `RM${Math.round(remaining)} left`;

  const TABS = [
    { id: 'spend',    label: 'Spend',    Icon: Receipt      },
    { id: 'book',     label: `Book (${bookedCount})`, Icon: CheckCircle2 },
    { id: 'summary',  label: 'Summary',  Icon: BarChart2    },
    { id: 'progress', label: 'Progress', Icon: TrendingUp   },
  ];

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
                <h2 className="font-display font-bold text-lg">Tracker</h2>
                <p className="text-xs text-white/30 mt-0.5">
                  RM{Math.round(totalSpent).toLocaleString()} spent · RM{Math.round(remaining >= 0 ? remaining : 0).toLocaleString()} left
                </p>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-surface-elevated transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Tabs — scrollable on narrow screens */}
            <div className="flex gap-1 px-4 pt-3 pb-0 shrink-0 overflow-x-auto">
              {TABS.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                    tab === id ? 'bg-brand-red text-white' : 'text-white/50 hover:text-white hover:bg-surface-elevated'
                  }`}
                >
                  <Icon size={13} /> {label}
                </button>
              ))}
            </div>

            <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">

              {/* ══ SPEND TAB ══════════════════════════════════════════════ */}
              {tab === 'spend' && (
                <>
                  {/* Trip total */}
                  <div className="card-elevated rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/40 uppercase tracking-wider">Trip budget</span>
                      {!editBudget
                        ? <button onClick={() => { setBudgetInput(String(budget)); setEditBudget(true); }} className="text-xs text-brand-red hover:underline">Edit</button>
                        : <div className="flex items-center gap-1.5">
                            <span className="text-xs text-white/40">RM</span>
                            <input autoFocus value={budgetInput} onChange={e => setBudgetInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && saveBudget()} className="w-20 bg-surface-bg border border-surface-border rounded-lg px-2 py-0.5 text-sm text-white focus:outline-none focus:border-brand-red" />
                            <button onClick={saveBudget} className="text-xs bg-brand-red text-white px-2 py-0.5 rounded-lg font-bold">OK</button>
                          </div>
                      }
                    </div>
                    <div className="flex justify-between items-baseline">
                      <div>
                        <span className="text-2xl font-display font-bold">RM{Math.round(totalSpent).toLocaleString()}</span>
                        <span className="text-white/30 text-sm ml-1">/ {budget.toLocaleString()}</span>
                      </div>
                      <span className={`font-display font-bold text-lg ${isDanger ? 'text-brand-danger' : isWarning ? 'text-brand-gold' : 'text-green-400'}`}>
                        {remaining >= 0 ? `RM${Math.round(remaining).toLocaleString()} left` : `RM${Math.round(-remaining).toLocaleString()} over`}
                      </span>
                    </div>
                    <Bar pct={pct} danger={isDanger} warn={isWarning} />
                    <div className="flex gap-3 text-xs text-white/30">
                      {bookedTotal > 0 && <span>Bookings: RM{Math.round(bookedTotal)}</span>}
                      {stepTotal   > 0 && <span>Steps: RM{Math.round(stepTotal)}</span>}
                      {spendTotal  > 0 && <span>Manual: RM{Math.round(spendTotal)}</span>}
                    </div>
                    {isDanger  && <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs"><AlertTriangle size={13} />Over budget — watch your spending!</div>}
                    {isWarning && <div className="flex items-center gap-2 p-2.5 rounded-xl bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-xs"><AlertTriangle size={13} />Getting close — RM{Math.round(remaining)} left</div>}
                  </div>

                  {/* Day card when inside a day */}
                  {activeDay && dayBudget > 0 && (
                    <div className="card rounded-2xl p-4 space-y-2 border-brand-red/20">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white/40 flex items-center gap-1.5"><CalendarDays size={13} className="text-brand-red" />Day {activeDay} budget</span>
                        <StatusBadge pct={dayPct} remaining={dayRemain} />
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-xl font-display font-bold">RM{Math.round(daySpent)}</span>
                        <span className="text-white/30 text-sm">/ {dayBudget}</span>
                      </div>
                      <Bar pct={dayPct} danger={dayRemain < 0} warn={dayPct > 70 && dayRemain >= 0} />
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

                  {/* Manual entries list */}
                  {entries.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs text-white/30 uppercase tracking-wider">Manual entries</p>
                      {entries.map(e => (
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
                </>
              )}

              {/* ══ BOOKINGS TAB ═══════════════════════════════════════════ */}
              {tab === 'book' && (
                <>
                  <div className="card-elevated rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Total booked</p>
                      <p className="text-2xl font-display font-bold">RM{Math.round(bookedTotal).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Items</p>
                      <p className="text-2xl font-display font-bold text-brand-red">{bookedCount}</p>
                    </div>
                  </div>

                  {BOOKING_PRESETS.map(preset => {
                    const b = bookings[preset.id];
                    const isBooked = b?.booked;
                    return (
                      <div key={preset.id} className={`rounded-2xl border transition-all ${isBooked ? 'bg-green-500/5 border-green-500/25' : 'bg-surface-card border-surface-border'}`}>
                        <div className="flex items-start gap-3 p-3 pb-2">
                          <button onClick={() => toggleBooking(preset)} className="shrink-0 mt-0.5">
                            {isBooked
                              ? <CheckCircle2 size={20} className="text-green-400" />
                              : <Circle size={20} className="text-white/20 hover:text-white/50 transition-colors" />
                            }
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className={`text-sm font-semibold ${isBooked ? 'text-white' : 'text-white/55'}`}>{preset.label}</p>
                              {isBooked && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-500/20 text-green-400 border border-green-500/20">BOOKED</span>}
                            </div>
                            <p className="text-xs text-white/30 mt-0.5">Day {preset.day} · Est. RM{preset.estMin}–{preset.estMax}</p>
                          </div>
                          <a href={preset.url} target="_blank" rel="noopener noreferrer" className="shrink-0 p-1.5 rounded-lg hover:bg-surface-hover transition-colors text-white/20 hover:text-brand-red">
                            <ExternalLink size={13} />
                          </a>
                        </div>
                        {isBooked && (
                          <div className="px-3 pb-3 space-y-2">
                            <div className="h-px bg-green-500/10" />
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-white/40 w-16 shrink-0">Paid (RM)</span>
                              <input
                                type="number" step="1" min="0" value={b.paid}
                                onChange={e => updatePaid(preset.id, e.target.value)}
                                className="flex-1 bg-surface-bg border border-surface-border rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-green-400 font-mono"
                              />
                              <span className="text-xs text-white/30 shrink-0">
                                {b.paid < preset.estMin ? '↓ under' : b.paid > preset.estMax ? '↑ over' : 'avg'}
                              </span>
                            </div>
                            <button onClick={() => toggleBooking(preset)} className="w-full text-xs text-brand-danger/70 hover:text-brand-danger border border-brand-danger/20 hover:border-brand-danger/40 rounded-lg py-1.5 transition-colors">
                              Cancel booking
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </>
              )}

              {/* ══ SUMMARY TAB ════════════════════════════════════════════ */}
              {tab === 'summary' && (
                <>
                  {/* Totals summary card */}
                  <div className="card-elevated rounded-2xl p-4 space-y-2">
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Total breakdown</p>
                    {[
                      { label: 'Manual entries',  amount: spendTotal,  color: 'text-white' },
                      { label: 'Booked activities', amount: bookedTotal, color: 'text-green-400' },
                      { label: 'Step expenses',     amount: stepTotal,   color: 'text-brand-red' },
                    ].map(({ label, amount, color }) => amount > 0 && (
                      <div key={label} className="flex justify-between items-center py-1 border-b border-surface-border last:border-0">
                        <span className="text-sm text-white/60">{label}</span>
                        <span className={`text-sm font-bold font-mono ${color}`}>RM{Math.round(amount).toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-sm font-bold text-white">Total spent</span>
                      <span className="text-lg font-display font-bold text-white">RM{Math.round(totalSpent).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Category breakdown */}
                  {totalSpent > 0 && (
                    <div className="card-elevated rounded-2xl p-4">
                      <p className="text-xs text-white/40 uppercase tracking-wider mb-4">By category</p>
                      <div className="space-y-3">
                        {CATEGORIES.map(cat => {
                          const amt = catTotals[cat] ?? 0;
                          if (amt === 0) return null;
                          const barPct = (amt / maxCat) * 100;
                          return (
                            <div key={cat}>
                              <div className="flex justify-between items-center mb-1">
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${CAT_COLOR[cat]?.badge}`}>{cat}</span>
                                <span className="text-sm font-bold font-mono text-white">RM{Math.round(amt).toLocaleString()}</span>
                              </div>
                              <div className="h-2 bg-surface-bg rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${CAT_COLOR[cat]?.bar}`} style={{ width: `${barPct}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Step expenses log */}
                  {stepEntries.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs text-white/30 uppercase tracking-wider">Logged from itinerary</p>
                      {stepEntries.map(({ id, dayNum, dayTheme, paid, date }) => (
                        <div key={id} className="flex items-center gap-3 bg-surface-elevated border border-surface-border rounded-xl px-3 py-2.5">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{dayTheme || `Day ${dayNum}`}</p>
                            <div className="flex gap-2 mt-0.5">
                              <span className="text-xs px-1.5 py-0.5 rounded border bg-purple-500/15 text-purple-300 border-purple-500/20">Activity</span>
                              <span className="text-xs text-white/30">Day {dayNum} · {date}</span>
                            </div>
                          </div>
                          <span className="text-sm font-bold shrink-0">RM{paid}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {totalSpent === 0 && (
                    <div className="text-center py-10 text-white/30">
                      <p className="text-sm">No expenses yet.</p>
                      <p className="text-xs mt-1">Log steps from day view or add manual entries.</p>
                    </div>
                  )}
                </>
              )}

              {/* ══ PROGRESS TAB ═══════════════════════════════════════════ */}
              {tab === 'progress' && (
                <>
                  {/* Selected day detail */}
                  <div className={`rounded-2xl border p-4 space-y-3 ${
                    selOver    ? 'border-brand-danger/40 bg-brand-danger/5'
                    : selPct >= 70 ? 'border-brand-gold/30 bg-brand-gold/5'
                    : selSpent > 0 ? 'border-green-500/30 bg-green-500/5'
                    : 'border-surface-border bg-surface-elevated'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-white/40 uppercase tracking-wider">Day {selectedDay}</p>
                        <p className="font-display font-bold text-base mt-0.5">{selDayData?.theme}</p>
                        <p className="text-xs text-white/30">{selDayData?.city} · {selDayData?.date}</p>
                      </div>
                      <StatusBadge pct={selPct} remaining={selRemain} />
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-surface-bg rounded-xl p-2.5">
                        <p className="text-xs text-white/30 mb-1">Planned</p>
                        <p className="font-mono font-bold text-sm">RM{selPlanned}</p>
                      </div>
                      <div className="bg-surface-bg rounded-xl p-2.5">
                        <p className="text-xs text-white/30 mb-1">Spent</p>
                        <p className={`font-mono font-bold text-sm ${selOver ? 'text-brand-danger' : selSpent > 0 ? 'text-white' : 'text-white/30'}`}>
                          RM{Math.round(selSpent)}
                        </p>
                      </div>
                      <div className="bg-surface-bg rounded-xl p-2.5">
                        <p className="text-xs text-white/30 mb-1">{selOver ? 'Over' : 'Left'}</p>
                        <p className={`font-mono font-bold text-sm ${selOver ? 'text-brand-danger' : 'text-green-400'}`}>
                          RM{Math.abs(Math.round(selRemain))}
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-white/30 mb-1">
                        <span>{Math.round(selPct)}% of day budget used</span>
                        <span>RM{selPlanned}</span>
                      </div>
                      <Bar pct={selPct} danger={selOver} warn={selPct >= 70 && !selOver} />
                    </div>

                    {selOver && (
                      <p className="text-xs text-brand-danger text-center">
                        RM{Math.round(-selRemain)} over the planned day budget
                      </p>
                    )}
                    {!selOver && selSpent === 0 && (
                      <p className="text-xs text-white/30 text-center">No expenses logged for this day yet</p>
                    )}
                  </div>

                  {/* All days list */}
                  <div>
                    <p className="text-xs text-white/30 uppercase tracking-wider mb-3">All 14 days</p>
                    <div className="space-y-2">
                      {DAYS.map(d => (
                        <DayProgressRow
                          key={d.day}
                          day={d}
                          spentOnDay={daySpentFor(d.day)}
                          isSelected={d.day === selectedDay}
                          onClick={() => setSelectedDay(d.day)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Cumulative summary */}
                  <div className="card-elevated rounded-2xl p-4 space-y-2">
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Trip cumulative</p>
                    {(() => {
                      const daysWithSpend = DAYS.filter(d => daySpentFor(d.day) > 0).length;
                      const plannedSoFar  = DAYS.filter(d => daySpentFor(d.day) > 0)
                        .reduce((s, d) => s + Math.round((d.costBase.min + d.costBase.max) / 2), 0);
                      const diff = totalSpent - plannedSoFar;
                      return (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-white/50">Days with spend</span>
                            <span className="font-mono">{daysWithSpend} / 14</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-white/50">Planned (those days)</span>
                            <span className="font-mono">RM{plannedSoFar.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm border-t border-surface-border pt-2">
                            <span className="font-semibold">Variance</span>
                            <span className={`font-mono font-bold ${diff > 0 ? 'text-brand-danger' : 'text-green-400'}`}>
                              {diff > 0 ? `+RM${Math.round(diff)} over` : `RM${Math.round(-diff)} under`}
                            </span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
}
