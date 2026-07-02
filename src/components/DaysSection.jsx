import { useState, useMemo } from 'react';
import { DAYS } from '../data/tripData';
import DayCard from './DayCard';

const CITIES = ['All', ...new Set(DAYS.map((d) => d.city))];

export default function DaysSection({ optionValues, onOpenDay }) {
  const [filter, setFilter] = useState('All');

  const filtered = useMemo(
    () => (filter === 'All' ? DAYS : DAYS.filter((d) => d.city === filter)),
    [filter]
  );

  return (
    <section id="days" className="py-20 bg-surface-card/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-widest text-white/30 mb-3">Tap any day</p>
        <h2 className="font-display text-4xl sm:text-5xl font-extrabold mb-2">14 DAYS</h2>
        <p className="text-white/40 text-sm mb-8">Step-by-step schedule · photos · videos · booking links</p>

        <div className="flex flex-wrap gap-2 mb-8">
          {CITIES.map((city) => (
            <button
              key={city}
              onClick={() => setFilter(city)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                filter === city
                  ? 'bg-brand-red text-white'
                  : 'bg-surface-elevated border border-surface-border text-white/60 hover:text-white'
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((day) => (
            <DayCard
              key={day.day}
              day={day}
              optionValues={optionValues}
              onClick={() => onOpenDay(day.day)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
