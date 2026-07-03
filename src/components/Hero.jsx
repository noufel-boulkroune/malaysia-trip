/**
 * Hero.jsx — Full-screen landing section
 *
 * Props
 * -----
 * onExplore  () => void   Called when "Explore Days" button is clicked;
 *                         parent scrolls to #days section.
 *
 * Notes
 * -----
 * - Background image from TRIP_META.heroImage (Wikimedia Commons URL)
 * - Stats are derived from TRIP_META / BUDGET constants — not hardcoded
 * - hero-gradient utility adds blue radial glow (defined in index.css)
 */
import { TRIP_META, BUDGET } from '../data/tripData';

const CORE = BUDGET.find(r => r.highlight);
const EUR_RATE = 4.66;
const ppMin = Math.round((CORE?.min ?? 2550) / EUR_RATE);
const ppMax = Math.round((CORE?.max ?? 3240) / EUR_RATE);

export default function Hero({ onExplore }) {
  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">
      {/* Background photo */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: `url(${TRIP_META.heroImage})` }}
      />

      {/* Dark overlay layers */}
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-surface-bg" />

      {/* Blue radial accent — bottom-left */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_0%_100%,rgba(37,99,235,0.25),transparent)]" />

      {/* Country badge */}
      <div className="absolute top-20 left-4 sm:left-8 animate-fade-in">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-red/90 backdrop-blur-sm text-white text-xs font-bold tracking-wider shadow-lg">
          🇲🇾 SQUAD EDITION 2026
        </span>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 pb-20 w-full animate-slide-up">
        <h1 className="font-display font-extrabold leading-none mb-3">
          <span className="block text-6xl sm:text-8xl text-white drop-shadow-2xl">MALAYSIA</span>
          <span className="block text-6xl sm:text-8xl text-white drop-shadow-2xl">SQUAD TRIP</span>
        </h1>
        <p className="text-white/50 text-lg mb-10">
          {TRIP_META.dates} · {TRIP_META.duration} · 5 Cities
        </p>

        {/* Stat cards */}
        <div className="flex flex-wrap gap-3 mb-12">
          {[
            { n: '14',            l: 'DAYS' },
            { n: `~${ppMin}–${ppMax} €`, l: 'PER PERSON' },
            { n: '5',             l: 'CITIES' },
          ].map(({ n, l }) => (
            <div key={l} className="card-glow px-5 py-4 min-w-[120px] backdrop-blur-sm">
              <p className="text-2xl font-display font-bold text-brand-red">{n}</p>
              <p className="text-xs text-white/40 uppercase tracking-wider mt-0.5">{l}</p>
            </div>
          ))}
        </div>

        <button onClick={onExplore} className="btn-primary px-8 py-3.5 text-base shadow-lg">
          Explore Days →
        </button>
      </div>
    </section>
  );
}
