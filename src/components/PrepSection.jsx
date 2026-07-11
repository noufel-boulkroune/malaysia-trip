/**
 * PrepSection.jsx — Before-you-fly prep with interactive checklists
 *
 * localStorage keys
 * -----------------
 * mt-checklist  — Set of checked item ids from CHECKLIST
 * mt-packing    — Set of checked item ids from PACKING
 *
 * Contains 5 collapsible blocks (all open by default except Warnings):
 * 1. Before You Fly  — interactive checklist (progress bar + tick-off)
 * 2. Packing List    — 4 categories, 21 items, tick-off with progress bar
 * 3. Halal Guide     — static tips
 * 4. Transport       — route/mode/duration/price table (all 4 columns)
 * 5. Warnings & Tips — collapsed by default
 */
import { useState } from 'react';
import { ExternalLink, Bus, CheckCircle2, AlertTriangle, Moon, Backpack, ChevronDown, ChevronUp } from 'lucide-react';
import { CHECKLIST, PACKING, TRANSPORT, HALAL, WARNINGS } from '../data/tripData';
import SectionHeader from './SectionHeader';

const CL_KEY      = 'mt-checklist';
const PACKING_KEY = 'mt-packing';

function loadSet(key) {
  try { return new Set(JSON.parse(localStorage.getItem(key) ?? '[]')); } catch { return new Set(); }
}
function saveSet(key, set) {
  localStorage.setItem(key, JSON.stringify([...set]));
}

function Block({ icon: Icon, title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-3 p-5 sm:p-6 text-left hover:bg-surface-elevated transition-colors"
      >
        <h3 className="font-display font-bold text-base flex items-center gap-2">
          <Icon size={18} className="text-brand-red shrink-0" />
          {title}
        </h3>
        {open ? <ChevronUp size={16} className="text-white/30 shrink-0" /> : <ChevronDown size={16} className="text-white/30 shrink-0" />}
      </button>
      {open && <div className="px-5 pb-5 sm:px-6 sm:pb-6">{children}</div>}
    </div>
  );
}

function CheckItem({ id, text, url, checked, onToggle }) {
  return (
    <li className="flex items-start gap-3">
      <button
        onClick={() => onToggle(id)}
        className="shrink-0 mt-0.5"
        aria-label={checked ? 'Uncheck' : 'Check'}
      >
        {checked
          ? <CheckCircle2 size={18} className="text-green-400" />
          : <div className="w-[18px] h-[18px] rounded-full border-2 border-white/20 hover:border-white/50 transition-colors" />
        }
      </button>
      <span className={`text-sm leading-relaxed transition-colors ${checked ? 'text-white/30 line-through' : 'text-white/70'}`}>
        {text}
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-brand-red hover:underline inline-flex items-center gap-1 text-xs"
            onClick={e => e.stopPropagation()}
          >
            Open <ExternalLink size={10} />
          </a>
        )}
      </span>
    </li>
  );
}

export default function PrepSection() {
  const [checked, setChecked]   = useState(() => loadSet(CL_KEY));
  const [packed,  setPacked]    = useState(() => loadSet(PACKING_KEY));

  function toggleCheck(id) {
    setChecked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      saveSet(CL_KEY, next);
      return next;
    });
  }

  function togglePacked(id) {
    setPacked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      saveSet(PACKING_KEY, next);
      return next;
    });
  }

  const checkedCount = CHECKLIST.filter(i => checked.has(i.id)).length;
  const totalPackItems = PACKING.reduce((s, c) => s + c.items.length, 0);
  const packedCount    = PACKING.reduce((s, c) => s + c.items.filter(i => packed.has(i.id)).length, 0);

  return (
    <section id="prep" className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeader
          eyebrow="Before you fly"
          title="Prep"
          subtitle="Checklists, packing, halal tips and every transport leg in one place."
        />

        <div className="grid lg:grid-cols-2 gap-5">

          {/* Pre-flight checklist */}
          <Block icon={CheckCircle2} title={`Before You Fly (${checkedCount}/${CHECKLIST.length})`}>
            <div className="h-1.5 bg-surface-elevated rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-300"
                style={{ width: `${(checkedCount / CHECKLIST.length) * 100}%` }}
              />
            </div>
            <ul className="space-y-3">
              {CHECKLIST.map(item => (
                <CheckItem
                  key={item.id}
                  id={item.id}
                  text={item.text}
                  url={item.url}
                  checked={checked.has(item.id)}
                  onToggle={toggleCheck}
                />
              ))}
            </ul>
            {checkedCount === CHECKLIST.length && (
              <p className="mt-4 text-xs text-green-400 font-semibold text-center">All done — you're ready to fly!</p>
            )}
          </Block>

          {/* Packing list */}
          <Block icon={Backpack} title={`Packing List (${packedCount}/${totalPackItems})`}>
            <div className="h-1.5 bg-surface-elevated rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-300"
                style={{ width: `${(packedCount / totalPackItems) * 100}%` }}
              />
            </div>
            <div className="space-y-5">
              {PACKING.map(cat => (
                <div key={cat.category}>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/30 mb-2">{cat.category}</p>
                  <ul className="space-y-2.5">
                    {cat.items.map(item => (
                      <CheckItem
                        key={item.id}
                        id={item.id}
                        text={item.text}
                        checked={packed.has(item.id)}
                        onToggle={togglePacked}
                      />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Block>

          {/* Halal guide */}
          <Block icon={Moon} title="Halal & Muslim-Friendly">
            <ul className="space-y-3">
              {HALAL.map((item, i) => (
                <li key={i} className="flex gap-3 text-sm text-white/70">
                  <span className="shrink-0 text-white/30 text-base">☪</span>
                  {item}
                </li>
              ))}
            </ul>
          </Block>

          {/* Transport */}
          <Block icon={Bus} title="Transport Summary">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-white/30 text-xs uppercase">
                    <th className="pb-3 pr-3">Route</th>
                    <th className="pb-3 pr-3">Mode</th>
                    <th className="pb-3 pr-3">Duration</th>
                    <th className="pb-3">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {TRANSPORT.map((t) => (
                    <tr key={t.route} className="border-t border-surface-border">
                      <td className="py-2.5 pr-3 text-white/70 text-xs sm:text-sm">{t.route}</td>
                      <td className="py-2.5 pr-3 text-white/40 text-xs">{t.mode}</td>
                      <td className="py-2.5 pr-3 text-white/40 text-xs">{t.duration}</td>
                      <td className="py-2.5 text-brand-bright font-semibold text-sm font-mono">{t.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Block>

          {/* Warnings */}
          <Block icon={AlertTriangle} title="Warnings & Tips" defaultOpen={false}>
            <ul className="space-y-3">
              {WARNINGS.map((item, i) => (
                <li key={i} className="flex gap-3 text-sm text-white/70">
                  <span className="text-brand-red shrink-0 font-bold mt-px">!</span>
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
