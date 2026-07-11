import { calcDayCost, getTripDay } from '../data/tripData';

export default function DayCard({ day, optionValues, onClick }) {
  // Computed per render (not at module load) so the TODAY badge moves
  // if the app stays open past midnight during the trip.
  const todayDay = getTripDay();
  const cost    = calcDayCost(day, optionValues);
  const isToday = day.day === todayDay;
  const isPast  = todayDay !== null && day.day < todayDay;

  return (
    <button
      onClick={onClick}
      className={`group text-left w-full card-interactive overflow-hidden ${
        isToday
          ? 'border-brand-gold shadow-[0_0_0_2px_rgba(245,184,65,0.35)]'
          : 'hover:border-brand-bright/30'
      } ${isPast ? 'opacity-55 saturate-50' : ''}`}
    >
      <div className="relative h-44 overflow-hidden bg-surface-elevated">
        <img
          src={day.cover}
          alt={day.theme}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/55 backdrop-blur text-white text-xs font-bold">
          Day {day.day}
        </span>
        {isToday && (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-brand-gold text-black text-xs font-bold">
            TODAY
          </span>
        )}
        {isPast && (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/50 text-white/60 text-xs font-semibold">
            Done
          </span>
        )}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
          <p className="text-xs text-white/80 font-semibold uppercase tracking-wider">{day.city}</p>
          <p className="text-xs text-white/60 font-mono">{day.date}</p>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-display font-bold text-base leading-snug mb-1">{day.theme}</h3>
        <p className="text-sm text-white/50 line-clamp-2 mb-4">{day.tagline}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-brand-bright bg-brand-red/10 border border-brand-red/25 px-2.5 py-1 rounded-full">
            RM{cost.min}–{cost.max}
          </span>
          <span className="text-sm text-white/40 font-semibold group-hover:text-brand-bright transition-colors">View →</span>
        </div>
      </div>
    </button>
  );
}
