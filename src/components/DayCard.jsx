import { calcDayCost } from '../data/tripData';

export default function DayCard({ day, optionValues, onClick }) {
  const cost = calcDayCost(day, optionValues);

  return (
    <button
      onClick={onClick}
      className="group text-left w-full bg-surface-card border border-surface-border rounded-2xl overflow-hidden hover:border-brand-red/40 transition-colors duration-200"
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={day.cover}
          alt={day.theme}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-brand-red text-white text-xs font-bold">
          DAY {day.day}
        </span>
      </div>

      <div className="p-4">
        <p className="flex items-center gap-1.5 text-xs text-white/40 uppercase tracking-wider mb-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-red shrink-0" />
          {day.city}
        </p>
        <h3 className="font-display font-bold text-base leading-snug mb-1">{day.theme}</h3>
        <p className="text-sm text-white/50 line-clamp-2 mb-4">{day.tagline}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-green-400 font-semibold">RM{cost.min}–{cost.max}</span>
          <span className="text-sm text-brand-red font-semibold group-hover:underline">View →</span>
        </div>
      </div>
    </button>
  );
}
