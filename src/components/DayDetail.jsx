/**
 * DayDetail.jsx — Full-screen day overlay
 * Props: day, optionValues, onClose, onPrev, onNext, hasPrev, hasNext
 * Renders as a fixed inset overlay (z-200). Uses useRef to scroll the
 * container back to top on day change (window.scrollTo doesn't work on
 * fixed overflow-y-auto containers).
 *
 * The sticky budget strip under the header shows planned vs spent for THIS
 * day and updates live as steps are confirmed in the timeline below —
 * spent comes from daySpentFor (manual entries + bookings + logged steps).
 */
import { useRef, useEffect, useMemo } from 'react';
import { ArrowLeft, ArrowRight, Bed, Wallet, ChevronLeft } from 'lucide-react';
import ImageGallery from './ImageGallery';
import VideoEmbed from './VideoEmbed';
import StepTimeline from './StepTimeline';
import { calcDayCost, DAYS } from '../data/tripData';
import { useStepExpenses } from '../hooks/useStepExpenses';
import { useExpenses } from '../hooks/useExpenses';
import { useBookings } from '../hooks/useBookings';
import { daySpentFor } from '../utils/spend';

const TOTAL_DAYS = DAYS.length;

export default function DayDetail({ day, optionValues, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const cost = calcDayCost(day, optionValues);
  const scrollRef = useRef(null);
  const { stepExpenses, logStep, removeStep } = useStepExpenses();
  const { entries } = useExpenses();
  const [bookings] = useBookings();

  const spent = useMemo(
    () => daySpentFor(day.day, entries, bookings, stepExpenses),
    [day.day, entries, bookings, stepExpenses]
  );
  const remaining = cost.max - spent;
  const pct  = cost.max > 0 ? Math.min((spent / cost.max) * 100, 100) : 0;
  const over = spent > cost.max;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [day.day]);

  // Lock body scroll behind the overlay while it's open
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prevOverflow; };
  }, []);

  return (
    <div ref={scrollRef} className="fixed inset-0 z-[200] bg-surface-bg overflow-y-auto animate-fade-in">
      <div className="sticky top-0 z-10 bg-surface-bg/95 backdrop-blur border-b border-surface-border">
        <div className="h-14 flex items-center px-4 sm:px-6 justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-sm font-semibold text-white/70 hover:text-white transition-colors"
          >
            <ChevronLeft size={16} /> Back
          </button>
          <span className="text-sm text-white/40">Day {day.day} / {TOTAL_DAYS}</span>
          <div className="flex gap-2">
            <button
              onClick={onPrev}
              disabled={!hasPrev}
              className="p-2 btn-ghost disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Previous day"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              onClick={onNext}
              disabled={!hasNext}
              className="p-2 btn-ghost disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Next day"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Live day budget strip */}
        <div className="px-4 sm:px-6 pb-2.5 max-w-4xl mx-auto w-full">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-white/40">
              Day budget <span className="font-mono text-white/60">RM{cost.min}–{cost.max}</span>
            </span>
            <span className={`font-mono font-bold ${over ? 'text-brand-danger' : spent > 0 ? 'text-brand-bright' : 'text-white/40'}`}>
              {over
                ? `RM${Math.round(spent - cost.max)} over`
                : spent > 0
                ? `RM${Math.round(spent)} spent · RM${Math.round(remaining)} left`
                : 'Nothing spent yet'}
            </span>
          </div>
          <div className="h-1 bg-surface-elevated rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${over ? 'bg-brand-danger' : 'bg-brand-red'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      <div className="relative h-56 sm:h-64 overflow-hidden">
        <img src={day.cover} alt={day.theme} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-bg via-black/30 to-black/40" />
        <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-4 sm:px-6 pb-5">
          <span className="inline-block px-3 py-1 rounded-full bg-brand-red text-white text-xs font-bold mb-3">
            DAY {day.day} · {day.date}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">{day.theme}</h2>
          <p className="text-white/60 text-sm mt-1">{day.city} — {day.tagline}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-28">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
          <div className="card-elevated rounded-2xl p-4">
            <Bed size={16} className="text-white/40 mb-2" />
            <p className="text-xs text-white/40 uppercase tracking-wider">Stay</p>
            <p className="text-sm font-semibold mt-0.5">{day.stay}</p>
          </div>
          <div className="card-elevated rounded-2xl p-4">
            <Wallet size={16} className="text-brand-bright mb-2" />
            <p className="text-xs text-white/40 uppercase tracking-wider">Est. cost</p>
            <p className="text-sm font-semibold mt-0.5 text-brand-bright">RM{cost.min}–{cost.max} pp</p>
          </div>
          <div className="card-elevated rounded-2xl p-4 col-span-2 sm:col-span-1">
            <p className="text-xs text-white/40 uppercase tracking-wider">Steps</p>
            <p className="text-2xl font-display font-bold text-white">{day.steps.length}</p>
          </div>
        </div>

        <section className="mb-10">
          <h3 className="font-display font-bold text-lg mb-4 text-white">Places you'll see</h3>
          <ImageGallery images={day.images} />
        </section>

        {day.video && (
          <section className="mb-10">
            <h3 className="font-display font-bold text-lg mb-4 text-white">Watch before you go</h3>
            <VideoEmbed video={day.video} />
          </section>
        )}

        <StepTimeline
          steps={day.steps}
          dayNum={day.day}
          stepExpenses={stepExpenses}
          onLogStep={logStep}
          onRemoveStep={removeStep}
        />
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-surface-bg/95 backdrop-blur border-t border-surface-border px-4 py-3 flex justify-between items-center z-[201]">
        <button onClick={onPrev} disabled={!hasPrev} className="flex items-center gap-2 text-sm font-semibold disabled:opacity-30 hover:text-brand-bright transition-colors">
          <ArrowLeft size={16} /> Prev
        </button>
        <span className="text-sm text-white/40">Day {day.day} of {TOTAL_DAYS}</span>
        <button onClick={onNext} disabled={!hasNext} className="flex items-center gap-2 text-sm font-semibold disabled:opacity-30 hover:text-brand-bright transition-colors">
          Next <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
