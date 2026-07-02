import { ExternalLink, Bus, CheckCircle, AlertTriangle, Moon } from 'lucide-react';
import { CHECKLIST, TRANSPORT, HALAL, WARNINGS } from '../data/tripData';

function Block({ icon: Icon, title, children, id }) {
  return (
    <div id={id} className="card p-5 sm:p-6">
      <h3 className="font-display font-bold text-base mb-5 flex items-center gap-2">
        <Icon size={18} className="text-brand-red shrink-0" />
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function PrepSection() {
  return (
    <section id="prep" className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-widest text-white/30 mb-3">Before you fly</p>
        <h2 className="font-display text-4xl sm:text-5xl font-extrabold mb-10">PREP</h2>

        <div className="grid lg:grid-cols-2 gap-6">
          <Block icon={CheckCircle} title="Before You Fly" id="checklist">
            <ul className="space-y-3">
              {CHECKLIST.map((item, i) => (
                <li key={i} className="flex gap-3 text-sm text-white/70">
                  <span className="text-green-400 shrink-0 font-bold">✓</span>
                  {item.url ? (
                    <span>
                      {item.text}{' '}
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-brand-red hover:underline inline-flex items-center gap-1">
                        Link <ExternalLink size={11} />
                      </a>
                    </span>
                  ) : (
                    item.text
                  )}
                </li>
              ))}
            </ul>
          </Block>

          <Block icon={Moon} title="Halal & Muslim-Friendly">
            <ul className="space-y-3">
              {HALAL.map((item, i) => (
                <li key={i} className="flex gap-3 text-sm text-white/70">
                  <span className="shrink-0 text-white/30">☪</span>
                  {item}
                </li>
              ))}
            </ul>
          </Block>

          <Block icon={Bus} title="Transport Summary">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-white/30 text-xs uppercase">
                    <th className="pb-3 pr-3">Route</th>
                    <th className="pb-3 pr-3">Mode</th>
                    <th className="pb-3">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {TRANSPORT.map((t) => (
                    <tr key={t.route} className="border-t border-surface-border">
                      <td className="py-2.5 pr-3 text-white/70">{t.route}</td>
                      <td className="py-2.5 pr-3 text-white/40 text-xs">{t.mode}</td>
                      <td className="py-2.5 text-green-400 font-semibold">{t.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Block>

          <Block icon={AlertTriangle} title="Warnings & Tips">
            <ul className="space-y-3">
              {WARNINGS.map((item, i) => (
                <li key={i} className="flex gap-3 text-sm text-white/70">
                  <span className="text-brand-red shrink-0 font-bold">!</span>
                  {item}
                </li>
              ))}
            </ul>
          </Block>
        </div>
      </div>
    </section>
  );
}
