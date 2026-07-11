/**
 * Hero.jsx — Full-screen landing section
 *
 * Props
 * -----
 * onExplore  () => void   Called when "Explore the days" is clicked;
 *                         parent scrolls to #days section.
 *
 * Notes
 * -----
 * - Background image from TRIP_META.heroImage (Wikimedia Commons URL)
 * - Stats + countdown are derived from tripData constants — not hardcoded
 */
import { Plane } from 'lucide-react';
import { TRIP_META, BUDGET, CITIES, DAYS, EUR_RATE, daysUntilTrip, getTripDay } from '../data/tripData';

const CORE = BUDGET.find(r => r.highlight);
const ppMin = Math.round((CORE?.min ?? 0) / EUR_RATE);
const ppMax = Math.round((CORE?.max ?? 0) / EUR_RATE);
const CITY_COUNT = new Set(CITIES.map(c => c.name)).size;

export default function Hero({ onExplore }) {
  const countdown = daysUntilTrip();
  const tripDay = getTripDay();

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

      {/* Teal radial accent — bottom-left */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_0%_100%,rgba(15,161,140,0.28),transparent)]" />

      {/* Top badges */}
      <div className="absolute top-20 left-4 sm:left-8 flex flex-wrap gap-2 animate-fade-in">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-red/90 backdrop-blur-sm text-white text-xs font-bold tracking-wider shadow-cta">
          🇲🇾 SQUAD EDITION 2026
        </span>
        {countdown != null && (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/15 text-white text-xs font-bold">
            <Plane size={12} /> {countdown} day{countdown === 1 ? '' : 's'} to go
          </span>
        )}
        {tripDay != null && (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-gold text-black text-xs font-bold">
            Day {tripDay} of {DAYS.length} — you're there!
          </span>
        )}
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 pb-20 w-full animate-slide-up">
        <h1 className="font-display font-bold tracking-tight leading-[0.95] mb-4">
          <span className="block text-5xl sm:text-7xl lg:text-8xl text-white drop-shadow-2xl">Malaysia,</span>
          <span className="block text-5xl sm:text-7xl lg:text-8xl text-brand-bright drop-shadow-2xl">together.</span>
        </h1>
        <p className="text-white/60 text-base sm:text-lg mb-10">
          {TRIP_META.dates} · {TRIP_META.duration} · {CITY_COUNT} cities
        </p>

        {/* Stat cards */}
        <div className="flex flex-wrap gap-3 mb-12">
          {[
            { n: String(DAYS.length), l: 'Days' },
            { n: `~${ppMin}–${ppMax} €`, l: 'Per person' },
            { n: String(CITY_COUNT),  l: 'Cities' },
          ].map(({ n, l }) => (
            <div key={l} className="card-glow px-5 py-4 min-w-[120px] backdrop-blur-sm">
              <p className="text-2xl font-display font-bold text-white">{n}</p>
              <p className="text-xs text-white/40 uppercase tracking-wider mt-0.5">{l}</p>
            </div>
          ))}
        </div>

        <button onClick={onExplore} className="btn-primary px-8 py-3.5 text-base">
          Explore the days →
        </button>
      </div>
    </section>
  );
}
