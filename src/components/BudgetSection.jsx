import { BUDGET, TRIP_META } from '../data/tripData';

export default function BudgetSection({ extraCost }) {
  const coreMin = 3050;
  const coreMax = 3470;

  return (
    <section id="budget" className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-widest text-white/30 mb-3">Twin-share · Foreigner rates</p>
        <h2 className="font-display text-4xl sm:text-5xl font-extrabold mb-2">BUDGET</h2>
        <p className="text-white/40 mb-10 text-sm">{TRIP_META.rate}</p>

        <div className="card overflow-hidden mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-border text-left">
                <th className="px-5 py-4 text-white/30 font-semibold uppercase text-xs">Category</th>
                <th className="px-5 py-4 text-white/30 font-semibold uppercase text-xs">MYR</th>
                <th className="px-5 py-4 text-white/30 font-semibold uppercase text-xs hidden sm:table-cell">Notes</th>
              </tr>
            </thead>
            <tbody>
              {BUDGET.map((row, i) => (
                <tr
                  key={row.category}
                  className={`border-b border-surface-border last:border-0 ${
                    row.highlight
                      ? 'bg-brand-red/10'
                      : i % 2 === 0 ? 'bg-transparent' : 'bg-surface-elevated/50'
                  }`}
                >
                  <td className={`px-5 py-4 ${row.highlight ? 'font-bold text-brand-red' : 'text-white/80'}`}>
                    {row.category}
                  </td>
                  <td className={`px-5 py-4 font-semibold ${row.highlight ? 'text-brand-red' : 'text-green-400'}`}>
                    {row.range}
                  </td>
                  <td className="px-5 py-4 text-white/40 hidden sm:table-cell text-xs">{row.note}</td>
                </tr>
              ))}
              {extraCost > 0 && (
                <tr className="bg-brand-gold/5 border-t border-surface-border">
                  <td className="px-5 py-4 font-semibold text-brand-gold">Your selected options</td>
                  <td className="px-5 py-4 font-bold text-brand-gold">+{extraCost}</td>
                  <td className="px-5 py-4 text-white/40 hidden sm:table-cell text-xs">From Options panel</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="card p-5 text-center">
            <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Core total</p>
            <p className="text-2xl font-display font-bold text-brand-red">RM{coreMin}–{coreMax}</p>
            <p className="text-white/30 text-xs mt-1">≈ 610–695 €</p>
          </div>
          <div className="card p-5 text-center">
            <p className="text-white/40 text-xs uppercase tracking-wider mb-2">With your options</p>
            <p className="text-2xl font-display font-bold text-green-400">
              RM{coreMin + extraCost}–{coreMax + extraCost}
            </p>
            <p className="text-white/30 text-xs mt-1">+ RM500 buffer recommended</p>
          </div>
        </div>
      </div>
    </section>
  );
}
