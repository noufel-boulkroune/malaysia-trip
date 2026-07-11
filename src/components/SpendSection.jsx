/**
 * SpendSection.jsx — Main-page expense tracking (budget, add expense, breakdown)
 *
 * Everything that isn't "which day am I on" lives here on the main scrollable
 * page instead of hidden in the floating MoneyTracker popup — trip budget,
 * manual expense entry, category breakdown, and the logged-step list.
 *
 * State is shared with MoneyTracker via useExpenses / useBudget / useBookings /
 * useStepExpenses so both views always agree on totals.
 */
import { useState, useMemo } from 'react';
import { Plus, ChevronDown, Trash2, AlertTriangle, Receipt } from 'lucide-react';
import { useExpenses } from '../hooks/useExpenses';
import { useBudget } from '../hooks/useBudget';
import { useBookings } from '../hooks/useBookings';
import { useStepExpenses } from '../hooks/useStepExpenses';
import { useTripOptions } from '../hooks/useTripOptions';
import { DAYS, calcDayCost } from '../data/tripData';
import { calcSpendTotals, daySpentFor } from '../utils/spend';
import SectionHeader from './SectionHeader';

const CATEGORIES = ['Food', 'Transport', 'Activity', 'Accommodation', 'Shopping', 'Other'];

const CAT_COLOR = {
  Food:          { badge: 'bg-orange-500/15 text-orange-300 border-orange-500/20', bar: 'bg-orange-400' },
  Transport:     { badge: 'bg-blue-500/15 text-blue-300 border-blue-500/20',       bar: 'bg-blue-400'   },
  Activity:      { badge: 'bg-purple-500/15 text-purple-300 border-purple-500/20', bar: 'bg-purple-400' },
  Accommodation: { badge: 'bg-brand-gold/15 text-brand-gold border-brand-gold/20', bar: 'bg-brand-gold' },
  Shopping:      { badge: 'bg-pink-500/15 text-pink-300 border-pink-500/20',       bar: 'bg-pink-400'   },
  Other:         { badge: 'bg-white/5 text-white/50 border-white/10',              bar: 'bg-white/30'   },
};

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

export default function SpendSection() {
  const { values: tripOptionValues } = useTripOptions();
  const { entries, addEntry, removeEntry } = useExpenses();
  const { budget, range, override, setOverride } = useBudget(tripOptionValues);
  const [bookings]        = useBookings();
  const { stepExpenses }  = useStepExpenses();

  const [editBudget,  setEditBudget]  = useState(false);
  const [budgetInput, setBudgetInput] = useState('');
  const [showForm,    setShowForm]    = useState(false);
  const [form,        setForm]        = useState({ desc: '', amount: '', cat: 'Food', day: '' });
  const [err,         setErr]         = useState('');

  const { bookedTotal, stepTotal, spendTotal, totalSpent } = useMemo(
    () => calcSpendTotals(entries, bookings, stepExpenses),
    [entries, bookings, stepExpenses]
  );
  const remaining = budget - totalSpent;
  const pct       = (totalSpent / budget) * 100;
  const isDanger  = pct >= 90;
  const isWarning = pct >= 70 && !isDanger;

  const catTotals = useMemo(() => {
    const totals = Object.fromEntries(CATEGORIES.map(c => [c, 0]));
    entries.forEach(e => { totals[e.cat] = (totals[e.cat] ?? 0) + e.amount; });
    Object.values(stepExpenses).forEach(e => { totals['Activity'] += e.paid ?? 0; });
    totals['Activity'] += bookedTotal;
    return totals;
  }, [entries, stepExpenses, bookedTotal]);

  const maxCat = Math.max(...Object.values(catTotals), 1);

  const stepEntries = useMemo(() =>
    Object.entries(stepExpenses).map(([id, e]) => {
      const [dayPart] = id.split('-s');
      const dn  = parseInt(dayPart.replace('d', ''));
      const day = DAYS.find(d => d.day === dn);
      return { id, ...e, dayNum: dn, dayTheme: day?.theme ?? '' };
    }).sort((a, b) => a.dayNum - b.dayNum),
  [stepExpenses]);

  const dailyChart = useMemo(() => {
    const rows = DAYS.map(d => ({
      day: d.day,
      estimated: calcDayCost(d, tripOptionValues).max,
      actual: daySpentFor(d.day, entries, bookings, stepExpenses),
    }));
    const maxVal = Math.max(...rows.map(r => Math.max(r.estimated, r.actual)), 1);
    return { rows, maxVal };
  }, [entries, bookings, stepExpenses, tripOptionValues]);

  function saveBudget() {
    const b = parseFloat(budgetInput);
    if (!isNaN(b) && b > 0) setOverride(b);
    setEditBudget(false);
  }

  function submitEntry(e) {
    e.preventDefault();
    const amt = parseFloat(form.amount);
    if (!form.desc.trim() || isNaN(amt) || amt <= 0) { setErr('Enter a description and amount.'); return; }
    addEntry({ desc: form.desc.trim(), amount: amt, cat: form.cat, day: form.day || null });
    setForm(f => ({ ...f, desc: '', amount: '' }));
    setErr('');
    setShowForm(false);
  }

  return (
    <section id="spend" className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <SectionHeader
          eyebrow="Track it"
          title="Spend"
          subtitle="Confirm planned expenses from the day pages or the floating tracker — this is the overview."
        />

        {/* Trip budget card */}
        <div className="card-elevated rounded-2xl p-5 space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/40 uppercase tracking-wider">Trip budget</span>
            {!editBudget
              ? <button onClick={() => { setBudgetInput(String(budget)); setEditBudget(true); }} className="text-xs text-brand-bright hover:underline">Edit</button>
              : <div className="flex items-center gap-1.5">
                  <span className="text-xs text-white/40">RM</span>
                  <input autoFocus value={budgetInput} onChange={e => setBudgetInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && saveBudget()} className="w-24 bg-surface-bg border border-surface-border rounded-lg px-2 py-0.5 text-sm text-white focus:outline-none focus:border-brand-red" />
                  <button onClick={saveBudget} className="text-xs bg-brand-red text-white px-2 py-0.5 rounded-lg font-bold">OK</button>
                </div>
            }
          </div>
          <p className="text-[11px] text-white/25 -mt-1">
            Estimated trip cost RM{range.min.toLocaleString()}–{range.max.toLocaleString()}
            {override != null && (
              <button onClick={() => setOverride(null)} className="text-brand-bright hover:underline ml-1.5">use estimate</button>
            )}
          </p>
          <div className="flex flex-wrap justify-between items-baseline gap-2">
            <div>
              <span className="text-3xl font-display font-bold">RM{Math.round(totalSpent).toLocaleString()}</span>
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

        {/* Add expense */}
        <button
          onClick={() => setShowForm(f => !f)}
          className="w-full flex items-center justify-center gap-2 py-3 btn-primary text-sm font-semibold rounded-xl mb-6"
        >
          <Plus size={16} /> Add expense
          <ChevronDown size={14} className={`transition-transform ${showForm ? 'rotate-180' : ''}`} />
        </button>

        {showForm && (
          <form onSubmit={submitEntry} className="card-elevated rounded-2xl p-4 space-y-3 mb-6 animate-slide-up">
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

        {/* Category breakdown */}
        {totalSpent > 0 && (
          <div className="card-elevated rounded-2xl p-4 mb-6">
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

        {/* Estimated vs actual, per day */}
        <div className="card-elevated rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-white/40 uppercase tracking-wider">Estimated vs actual, per day</p>
            <div className="flex items-center gap-3 text-[11px] text-white/40">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-white/25" />Estimated</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-brand-red" />Actual</span>
            </div>
          </div>
          <div className="flex items-end gap-2 sm:gap-3 h-40 overflow-x-auto">
            {dailyChart.rows.map(({ day, estimated, actual }) => {
              const over = actual > estimated;
              return (
                <div key={day} className="flex flex-col items-center gap-1 shrink-0 w-9">
                  <div
                    className="flex items-end gap-0.5 h-32"
                    title={`Day ${day} — Estimated RM${Math.round(estimated)} · Actual RM${Math.round(actual)}`}
                  >
                    <div
                      className="w-3.5 rounded-t bg-white/20"
                      style={{ height: `${Math.max((estimated / dailyChart.maxVal) * 100, estimated > 0 ? 3 : 0)}%` }}
                    />
                    <div
                      className={`w-3.5 rounded-t ${over ? 'bg-brand-danger' : 'bg-brand-red'}`}
                      style={{ height: `${Math.max((actual / dailyChart.maxVal) * 100, actual > 0 ? 3 : 0)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-white/30 font-mono">D{day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Manual entries */}
        {entries.length > 0 && (
          <div className="space-y-2 mb-6">
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
                <button onClick={() => removeEntry(e.id)} className="p-1 rounded hover:bg-red-500/20 hover:text-red-400 text-white/20 transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Logged steps */}
        {stepEntries.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-white/30 uppercase tracking-wider">Logged from itinerary</p>
            {stepEntries.map(({ id, dayNum, dayTheme, title, paid, date }) => (
              <div key={id} className="flex items-center gap-3 bg-surface-elevated border border-surface-border rounded-xl px-3 py-2.5">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{title || dayTheme || `Day ${dayNum}`}</p>
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
            <Receipt size={28} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">No expenses yet.</p>
            <p className="text-xs mt-1">Log steps from day view, book something, or add a manual entry above.</p>
          </div>
        )}
      </div>
    </section>
  );
}
