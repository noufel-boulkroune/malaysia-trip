import { useState, useEffect, useMemo } from 'react';
import {
  Wallet, Plus, X, Trash2, AlertTriangle, ChevronDown,
  CheckCircle2, Circle, ExternalLink, Receipt, CalendarDays,
} from 'lucide-react';
import { DAYS, BOOKING_PRESETS } from '../data/tripData';

const TRIP_BUDGET = 3470;
const CATEGORIES = ['Food', 'Transport', 'Activity', 'Accommodation', 'Shopping', 'Other'];

const CAT_COLOR = {
  Food:          'bg-orange-500/15 text-orange-300 border-orange-500/20',
  Transport:     'bg-blue-500/15 text-blue-300 border-blue-500/20',
  Activity:      'bg-purple-500/15 text-purple-300 border-purple-500/20',
  Accommodation: 'bg-brand-gold/15 text-brand-gold border-brand-gold/20',
  Shopping:      'bg-pink-500/15 text-pink-300 border-pink-500/20',
  Other:         'bg-white/5 text-white/50 border-white/10',
};

function load(key, def) {
  try { return JSON.parse(localStorage.getItem(key) ?? 'null') ?? def; } catch { return def; }
}
function save(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

function Bar({ pct, danger, warning }) {
  return (
    <div className="h-1.5 bg-surface-bg rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${danger ? 'bg-brand-red' : warning ? 'bg-brand-gold' : 'bg-green-400'}`}
        style={{ width: `${Math.min(pct, 100)}%` }}
      />
    </div>
  );
}

export default function MoneyTracker({ activeDay }) {
  const [open, setOpen]           = useState(false);
  const [tab, setTab]             = useState('spend');
  const [entries, setEntries]     = useState(() => load('mt-entries', []));
  const [bookings, setBookings]   = useState(() => load('mt-bookings', {}));
  const [budget, setBudget]       = useState(() => load('mt-budget', TRIP_BUDGET));
  const [editBudget, setEditBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState('');
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState({ desc: '', amount: '', cat: 'Food', day: activeDay ?? '' });
  const [err, setErr]             = useState('');

  useEffect(() => { save('mt-entries', entries); }, [entries]);
  useEffect(() => { save('mt-bookings', bookings); }, [bookings]);
  useEffect(() => { save('mt-budget', budget); }, [budget]);

  useEffect(() => {
    if (open) setForm(f => ({ ...f, day: activeDay ?? '' }));
  }, [open, activeDay]);

  const bookedTotal = useMemo(() =>
    Object.values(bookings).reduce((s, b) => s + (b.paid ?? 0), 0), [bookings]);

  const spendTotal = useMemo(() =>
    entries.reduce((s, e) => s + e.amount, 0), [entries]);

  const totalSpent = spendTotal + bookedTotal;
  const remaining  = budget - totalSpent;
  const pct        = (totalSpent / budget) * 100;
  const isDanger   = pct >= 90;
  const isWarning  = pct >= 70 && !isDanger;

  const dayData = activeDay ? DAYS.find(d => d.day === activeDay) : null;
  const dayBudget = dayData ? Math.round((dayData.costBase.min + dayData.costBase.max) / 2) : 0;
  const daySpent  = useMemo(() =>
    entries.filter(e => e.day === activeDay).reduce((s, e) => s + e.amount, 0) +
    Object.entries(bookings)
      .filter(([id]) => BOOKING_PRESETS.find(p => p.id === id)?.day === activeDay)
      .reduce((s, [, b]) => s + (b.paid ?? 0), 0),
  [entries, bookings, activeDay]);
  const dayRemaining = dayBudget - daySpent;
  const dayPct       = dayBudget > 0 ? (daySpent / dayBudget) * 100 : 0;

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
    setBookings(prev => {
      const cur = prev[preset.id];
      if (!cur) return { ...prev, [preset.id]: { booked: true, paid: Math.round((preset.estMin + preset.estMax) / 2) } };
      if (cur.booked) return { ...prev, [preset.id]: { ...cur, booked: false } };
      const next = { ...prev };
      delete next[preset.id];
      return next;
    });
  }

  function updatePaid(id, val) {
    const num = parseFloat(val);
    setBookings(prev => ({ ...prev, [id]: { ...prev[id], paid: isNaN(num) ? 0 : num } }));
  }

  function removeEntry(id) { setEntries(prev => prev.filter(e => e.id !== id)); }

  function saveBudget() {
    const b = parseFloat(budgetInput);
    if (!isNaN(b) && b > 0) setBudget(b);
    setEditBudget(false);
  }

  const bookedCount = Object.values(bookings).filter(b => b.booked).length;

  const btnLabel = activeDay && dayBudget > 0
    ? `Day ${activeDay}: RM${Math.round(dayRemaining)}`
    : `RM${Math.round(remaining)} left`;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`fixed bottom-20 right-4 z-[250] flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm shadow-2xl border transition-all ${
          isDanger
            ? 'bg-brand-red border-brand-red text-white animate-pulse'
            : isWarning
            ? 'bg-brand-gold border-brand-gold text-black'
            : 'bg-surface-elevated border-surface-border text-white'
        }`}
      >
        <Wallet size={15} />
        {btnLabel}
        {isDanger && <AlertTriangle size={13} />}
      </button>

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
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-surface-border shrink-0">
              <h2 className="font-display font-bold text-lg">Tracker</h2>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-surface-elevated transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 px-5 pt-3 pb-0 shrink-0">
              {[
                { id: 'spend', label: 'Daily Spend', icon: Receipt },
                { id: 'book',  label: `Bookings${bookedCount > 0 ? ` (${bookedCount})` : ''}`, icon: CheckCircle2 },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    tab === id ? 'bg-brand-red text-white' : 'text-white/50 hover:text-white hover:bg-surface-elevated'
                  }`}
                >
                  <Icon size={14} /> {label}
                </button>
              ))}
            </div>

            <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">

              {/* ─── SPEND TAB ─── */}
              {tab === 'spend' && (
                <>
                  {/* Trip total card */}
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
                      <span className={`font-display font-bold text-lg ${isDanger ? 'text-brand-red' : isWarning ? 'text-brand-gold' : 'text-green-400'}`}>
                        {remaining >= 0 ? `RM${Math.round(remaining).toLocaleString()} left` : `RM${Math.round(-remaining).toLocaleString()} over`}
                      </span>
                    </div>
                    <Bar pct={pct} danger={isDanger} warning={isWarning} />
                    {bookedTotal > 0 && (
                      <p className="text-xs text-white/30">Includes RM{Math.round(bookedTotal)} from bookings</p>
                    )}
                    {isDanger && <div className="flex items-center gap-2 p-2.5 rounded-xl bg-brand-red/10 border border-brand-red/20 text-brand-red text-xs"><AlertTriangle size={13} />Over budget!</div>}
                    {isWarning && <div className="flex items-center gap-2 p-2.5 rounded-xl bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-xs"><AlertTriangle size={13} />Getting close — RM{Math.round(remaining)} left</div>}
                  </div>

                  {/* Day card — only shown inside a day */}
                  {activeDay && dayBudget > 0 && (
                    <div className="card rounded-2xl p-4 space-y-3 border-brand-red/20">
                      <div className="flex items-center gap-2">
                        <CalendarDays size={14} className="text-brand-red" />
                        <span className="text-xs text-white/40 uppercase tracking-wider">Day {activeDay} budget</span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <div>
                          <span className="text-xl font-display font-bold">RM{Math.round(daySpent).toLocaleString()}</span>
                          <span className="text-white/30 text-sm ml-1">/ {dayBudget}</span>
                        </div>
                        <span className={`font-semibold text-sm ${dayRemaining < 0 ? 'text-brand-red' : dayPct > 70 ? 'text-brand-gold' : 'text-green-400'}`}>
                          {dayRemaining >= 0 ? `RM${Math.round(dayRemaining)} left today` : `RM${Math.round(-dayRemaining)} over`}
                        </span>
                      </div>
                      <Bar pct={dayPct} danger={dayRemaining < 0} warning={dayPct > 70 && dayRemaining >= 0} />
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
                      {err && <p className="text-brand-red text-xs">{err}</p>}
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
                        value={form.day}
                        onChange={e => setForm(f => ({ ...f, day: e.target.value ? Number(e.target.value) : null }))}
                        className="w-full bg-surface-bg border border-surface-border rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-red"
                      >
                        <option value="" className="bg-surface-card">No specific day</option>
                        {DAYS.map(d => <option key={d.day} value={d.day} className="bg-surface-card">Day {d.day} — {d.theme}</option>)}
                      </select>
                      <button type="submit" className="w-full py-2.5 btn-primary rounded-xl text-sm font-bold">Add</button>
                    </form>
                  )}

                  {/* Entries list */}
                  {entries.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs text-white/30 uppercase tracking-wider">History</p>
                      {entries.map(e => (
                        <div key={e.id} className="flex items-center gap-3 bg-surface-elevated border border-surface-border rounded-xl px-3 py-2.5">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{e.desc}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className={`text-xs px-1.5 py-0.5 rounded border ${CAT_COLOR[e.cat]}`}>{e.cat}</span>
                              {e.day && <span className="text-xs text-white/30">Day {e.day}</span>}
                              <span className="text-xs text-white/20">{e.date}</span>
                            </div>
                          </div>
                          <span className="text-sm font-bold shrink-0">RM{e.amount}</span>
                          <button onClick={() => removeEntry(e.id)} className="p-1 rounded hover:bg-brand-red/20 hover:text-brand-red text-white/20 transition-colors">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* ─── BOOKINGS TAB ─── */}
              {tab === 'book' && (
                <>
                  <div className="card-elevated rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Total booked</p>
                      <p className="text-2xl font-display font-bold">RM{Math.round(bookedTotal).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Items booked</p>
                      <p className="text-2xl font-display font-bold text-brand-red">{bookedCount}</p>
                    </div>
                  </div>

                  {BOOKING_PRESETS.map(preset => {
                    const b = bookings[preset.id];
                    const isBooked = b?.booked;
                    return (
                      <div
                        key={preset.id}
                        className={`rounded-2xl border transition-all ${
                          isBooked
                            ? 'bg-green-500/5 border-green-500/25'
                            : 'bg-surface-card border-surface-border'
                        }`}
                      >
                        {/* Top row */}
                        <div className="flex items-start gap-3 p-3 pb-2">
                          <button
                            onClick={() => toggleBooking(preset)}
                            className="shrink-0 mt-0.5"
                            title={isBooked ? 'Click to cancel booking' : 'Click to mark as booked'}
                          >
                            {isBooked
                              ? <CheckCircle2 size={20} className="text-green-400" />
                              : <Circle size={20} className="text-white/20 hover:text-white/50 transition-colors" />
                            }
                          </button>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className={`text-sm font-semibold ${isBooked ? 'text-white' : 'text-white/55'}`}>
                                {preset.label}
                              </p>
                              {isBooked && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-500/20 text-green-400 border border-green-500/20 tracking-wide">
                                  BOOKED
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-white/30 mt-0.5">
                              Day {preset.day} · Est. RM{preset.estMin}–{preset.estMax}
                            </p>
                          </div>

                          <a
                            href={preset.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 p-1.5 rounded-lg hover:bg-surface-hover transition-colors text-white/20 hover:text-brand-red"
                            title="Open booking site"
                          >
                            <ExternalLink size={13} />
                          </a>
                        </div>

                        {/* Booked details — always visible when booked */}
                        {isBooked && (
                          <div className="px-3 pb-3 space-y-2">
                            <div className="h-px bg-green-500/10" />
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-white/40 w-16 shrink-0">Paid (RM)</span>
                              <input
                                type="number"
                                step="1"
                                min="0"
                                value={b.paid}
                                onChange={e => updatePaid(preset.id, e.target.value)}
                                className="flex-1 bg-surface-bg border border-surface-border rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-green-400 font-mono"
                              />
                              <span className="text-xs text-white/30 shrink-0">
                                {b.paid !== Math.round((preset.estMin + preset.estMax) / 2)
                                  ? b.paid < preset.estMin ? '↓ under est.' : b.paid > preset.estMax ? '↑ over est.' : ''
                                  : 'est. avg'
                                }
                              </span>
                            </div>
                            <button
                              onClick={() => toggleBooking(preset)}
                              className="w-full text-xs text-brand-red/70 hover:text-brand-red border border-brand-red/20 hover:border-brand-red/40 rounded-lg py-1.5 transition-colors font-medium"
                            >
                              Cancel booking
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
