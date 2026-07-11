/**
 * OptionsPanel.jsx — Trip option selector UI
 * Props: values, setOption, extraCost, reset (all from useTripOptions hook)
 * Renders one radio group per key in OPTIONS (tripData.js).
 * Choices affect day cost estimates and the BudgetSection total via extraCost.
 * To add a new option: add it to OPTIONS in tripData.js — no changes needed here.
 */
import { RotateCcw, ExternalLink } from 'lucide-react';
import { OPTIONS } from '../data/tripData';
import SectionHeader from './SectionHeader';

function OptionGroup({ option, value, onChange }) {
  return (
    <div className="card p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-base">{option.label}</h3>
        <span className="text-xs text-white/30 bg-surface-elevated px-2 py-1 rounded-lg">Day {option.day}</span>
      </div>
      <div className="grid gap-3">
        {option.choices.map((choice) => {
          const selected = value === choice.id;
          return (
            <button
              key={choice.id}
              onClick={() => onChange(choice.id)}
              className={`text-left p-4 rounded-xl border transition-colors ${
                selected
                  ? 'border-brand-red bg-brand-red/10'
                  : 'border-surface-border hover:border-white/20 bg-surface-elevated'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-sm">{choice.label}</p>
                  <p className="text-xs text-white/50 mt-0.5">{choice.desc}</p>
                </div>
                <span className={`shrink-0 text-sm font-bold font-mono ${choice.cost ? 'text-brand-bright' : 'text-white/30'}`}>
                  {choice.cost ? `+RM${choice.cost}` : 'Free'}
                </span>
              </div>
              {selected && choice.book && (
                <a
                  href={choice.book}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 mt-3 text-xs text-brand-bright font-semibold hover:underline"
                >
                  Book <ExternalLink size={11} />
                </a>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function OptionsPanel({ values, setOption, extraCost, reset }) {
  return (
    <section id="options" className="py-20 bg-surface-card/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeader
          eyebrow="Customize"
          title="Trip options"
          subtitle="Pick your adventures — costs update on day cards and the budget."
          right={
            <div className="flex items-center gap-3">
              <div className="card px-5 py-3 text-center">
                <p className="text-xs text-white/30 uppercase tracking-wider">Options extra</p>
                <p className="text-xl font-display font-bold text-brand-bright">+RM{extraCost}</p>
              </div>
              <button
                onClick={reset}
                className="flex items-center gap-2 px-4 py-3 btn-ghost text-sm"
              >
                <RotateCcw size={15} /> Reset
              </button>
            </div>
          }
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.values(OPTIONS).map((opt) => (
            <OptionGroup
              key={opt.id}
              option={opt}
              value={values[opt.id]}
              onChange={(id) => setOption(opt.id, id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
