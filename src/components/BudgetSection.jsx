import { BUDGET, TRIP_META, EUR_RATE } from '../data/tripData';
import SectionHeader from './SectionHeader';

const toEur = (rm) => Math.round(rm / EUR_RATE);

// Derive core totals + buffer from the data — single source of truth
const CORE = BUDGET.find(r => r.highlight);
const CORE_MIN = CORE?.min ?? 0;
const CORE_MAX = CORE?.max ?? 0;
const BUFFER = BUDGET.find(r => r.category.toLowerCase().includes('buffer'));

export default function BudgetSection({ extraCost }) {
  // Second card: core + selected options, or core + suggested buffer when
  // no paid options are picked (the label changes to match).
  const totalMin = CORE_MIN + (extraCost > 0 ? extraCost : BUFFER?.min ?? 0);
  const totalMax = CORE_MAX + (extraCost > 0 ? extraCost : BUFFER?.max ?? 0);

  return (
    <section id="budget" className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeader
          eyebrow="Per person · Twin-share · Foreigner rates"
          title="Budget"
          subtitle={`${TRIP_META.rate} · All prices per person`}
        />

        <div className="card overflow-hidden mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-border text-left">
                <th className="px-4 py-3 text-white/30 font-semibold uppercase text-xs">Category</th>
                <th className="px-4 py-3 text-white/30 font-semibold uppercase text-xs">MYR pp</th>
                <th className="px-4 py-3 text-white/30 font-semibold uppercase text-xs">EUR pp</th>
                <th className="px-4 py-3 text-white/30 font-semibold uppercase text-xs hidden sm:table-cell">Notes</th>
              </tr>
            </thead>
            <tbody>
              {BUDGET.map((row, i) => (
                <tr
                  key={row.category}
                  className={`border-b border-surface-border last:border-0 ${
                    row.highlight ? 'bg-brand-red/10' : i % 2 === 0 ? 'bg-transparent' : 'bg-surface-elevated/40'
                  }`}
                >
                  <td className={`px-4 py-3.5 ${row.highlight ? 'font-bold text-brand-red' : 'text-white/80'}`}>
                    {row.category}
                  </td>
                  <td className={`px-4 py-3.5 font-semibold font-mono text-sm ${row.highlight ? 'text-brand-red' : 'text-brand-bright'}`}>
                    {row.min === row.max
                      ? `~${row.min.toLocaleString()}`
                      : `${row.min.toLocaleString()}–${row.max.toLocaleString()}`}
                  </td>
                  <td className={`px-4 py-3.5 font-mono text-sm ${row.highlight ? 'text-brand-red/70' : 'text-white/40'}`}>
                    {row.min === row.max
                      ? `~${toEur(row.min)}`
                      : `${toEur(row.min)}–${toEur(row.max)}`}
                  </td>
                  <td className="px-4 py-3.5 text-white/40 hidden sm:table-cell text-xs leading-relaxed">{row.note}</td>
                </tr>
              ))}
              {extraCost > 0 && (
                <tr className="bg-brand-gold/5 border-t border-brand-gold/20">
                  <td className="px-4 py-3.5 font-semibold text-brand-gold">Your selected options</td>
                  <td className="px-4 py-3.5 font-bold text-brand-gold font-mono">+{extraCost.toLocaleString()}</td>
                  <td className="px-4 py-3.5 text-brand-gold/60 font-mono text-sm">+{toEur(extraCost)}</td>
                  <td className="px-4 py-3.5 text-white/40 hidden sm:table-cell text-xs">From Options panel above</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile notes — shown below table on small screens */}
        <div className="sm:hidden space-y-2 mb-6">
          {BUDGET.filter(r => !r.highlight).map(row => (
            <div key={row.category} className="flex gap-2 text-xs text-white/40">
              <span className="text-brand-red shrink-0">·</span>
              <span><span className="text-white/60 font-medium">{row.category}:</span> {row.note}</span>
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="card p-5 text-center">
            <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Core total (pp)</p>
            <p className="text-2xl font-display font-bold text-brand-red">
              RM {CORE_MIN.toLocaleString()}–{CORE_MAX.toLocaleString()}
            </p>
            <p className="text-white/30 text-xs mt-1">≈ {toEur(CORE_MIN)}–{toEur(CORE_MAX)} €</p>
          </div>
          <div className="card p-5 text-center">
            <p className="text-white/40 text-xs uppercase tracking-wider mb-2">
              {extraCost > 0 ? 'With your options' : `With RM${BUFFER?.min ?? 0}–${BUFFER?.max ?? 0} buffer`}
            </p>
            <p className="text-2xl font-display font-bold text-brand-bright">
              RM {totalMin.toLocaleString()}–{totalMax.toLocaleString()}
            </p>
            <p className="text-white/30 text-xs mt-1">≈ {toEur(totalMin)}–{toEur(totalMax)} €</p>
          </div>
        </div>
      </div>
    </section>
  );
}
