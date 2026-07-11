/**
 * DaysSection.jsx — Day card grid with city filter
 * Props: optionValues (from useTripOptions), onOpenDay (day number → void)
 * Derives city filter list from DAYS data. Passes optionValues to DayCard
 * so cost ranges update live when options change.
 */
import { useState, useMemo } from 'react';
import { DAYS } from '../data/tripData';
import DayCard from './DayCard';
import SectionHeader from './SectionHeader';

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
        <SectionHeader
          eyebrow="Day by day"
          title={`${DAYS.length} days in Malaysia`}
          subtitle="Tap any day for the full schedule, photos, costs and booking links."
        />

        <div className="flex flex-wrap gap-2 mb-8">
          {CITIES.map((city) => (
            <button
              key={city}
              onClick={() => setFilter(city)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                filter === city
                  ? 'bg-brand-red text-white shadow-cta'
                  : 'bg-surface-elevated border border-surface-border text-white/60 hover:text-white hover:border-white/20'
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
