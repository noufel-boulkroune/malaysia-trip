import { TRIP_META } from '../data/tripData';

export default function Hero({ onExplore }) {
  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${TRIP_META.heroImage})` }}
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface-bg" />

      <div className="absolute top-20 left-4 sm:left-8">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-red text-white text-xs font-bold tracking-wider">
          🇲🇾 SQUAD EDITION 2026
        </span>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 pb-20 w-full animate-slide-up">
        <h1 className="font-display font-extrabold leading-none mb-4">
          <span className="block text-6xl sm:text-8xl text-white">MALAYSIA</span>
          <span className="block text-6xl sm:text-8xl text-white">SQUAD TRIP</span>
        </h1>
        <p className="text-white/50 text-lg mb-10">22 Jul – 4 Aug · 14 Days · 5 Cities</p>

        <div className="flex flex-wrap gap-4 mb-12">
          {[
            { n: '14', l: 'DAYS' },
            { n: '~3,050 MYR', l: 'PER PERSON' },
            { n: '5', l: 'CITIES' },
          ].map(({ n, l }) => (
            <div key={l} className="card px-5 py-4 min-w-[110px]">
              <p className="text-2xl font-display font-bold text-brand-red">{n}</p>
              <p className="text-xs text-white/40 uppercase tracking-wider mt-0.5">{l}</p>
            </div>
          ))}
        </div>

        <button
          onClick={onExplore}
          className="btn-primary px-8 py-3.5 text-base"
        >
          Explore Days →
        </button>
      </div>
    </section>
  );
}
