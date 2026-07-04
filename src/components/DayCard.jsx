import { calcDayCost, getTripDay } from '../data/tripData';

const TODAY_DAY = getTripDay();

export default function DayCard({ day, optionValues, onClick }) {
  const cost    = calcDayCost(day, optionValues);
  const isToday = day.day === TODAY_DAY;
  const isPast  = TODAY_DAY !== null && day.day < TODAY_DAY;

  return (
    <button
      onClick={onClick}
      className={`group text-left w-full bg-surface-card border rounded-2xl overflow-hidden transition-colors duration-200 ${
        isToday
          ? 'border-brand-gold shadow-[0_0_0_2px_rgba(245,200,66,0.3)]'
          : 'border-surface-border hover:border-brand-red/40'
      } ${isPast ? 'opacity-60' : ''}`}
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
        {isToday && (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-brand-gold text-black text-xs font-bold">
            TODAY
          </span>
        )}
        {isPast && (
          <div className="absolute inset-0 bg-black/25 flex items-end justify-end p-3">
            <span className="text-xs text-white/50 bg-black/40 px-2 py-0.5 rounded font-semibold">Done</span>
          </div>
        )}
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
