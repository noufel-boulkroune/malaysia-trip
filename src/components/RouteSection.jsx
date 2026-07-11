/**
 * RouteSection.jsx — Horizontal scrollable city route overview
 * No props. Pure display — reads CITIES array from tripData.js.
 */
import { CITIES } from '../data/tripData';
import SectionHeader from './SectionHeader';

const CITY_BORDER = [
  'border-l-brand-red',
  'border-l-brand-gold',
  'border-l-blue-400',
  'border-l-green-400',
  'border-l-purple-400',
];

export default function RouteSection() {
  return (
    <section id="route" className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeader
          eyebrow={`${CITIES.reduce((s, c) => s + c.nights, 0)} nights`}
          title="The route"
        />

        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6">
          {CITIES.map((city, i) => (
            <div
              key={`${city.name}-${i}`}
              className={`shrink-0 w-52 card-elevated rounded-2xl p-5 border-l-4 ${CITY_BORDER[i % CITY_BORDER.length]}`}
            >
              <span className="text-xs text-white/40 font-semibold uppercase tracking-wider">
                {city.nights} night{city.nights > 1 ? 's' : ''}
              </span>
              <h3 className="font-display font-bold text-lg mt-2">{city.name}</h3>
              <p className="text-sm text-white/50 mt-1 leading-snug">{city.vibe}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
