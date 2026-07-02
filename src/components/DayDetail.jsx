import { useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Bed, Wallet, ChevronLeft } from 'lucide-react';
import ImageGallery from './ImageGallery';
import VideoEmbed from './VideoEmbed';
import StepTimeline from './StepTimeline';
import { calcDayCost } from '../data/tripData';

export default function DayDetail({ day, optionValues, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const cost = calcDayCost(day, optionValues);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [day.day]);

  return (
    <div ref={scrollRef} className="fixed inset-0 z-[200] bg-surface-bg overflow-y-auto animate-fade-in">
      <div className="sticky top-0 z-10 bg-surface-bg border-b border-surface-border h-14 flex items-center px-4 sm:px-6 justify-between">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-sm font-semibold text-white/70 hover:text-white transition-colors"
        >
          <ChevronLeft size={16} /> Day {day.day}
        </button>
        <span className="text-sm text-white/40">Day {day.day} / 14</span>
        <div className="flex gap-2">
          <button
            onClick={onPrev}
            disabled={!hasPrev}
            className="p-2 bg-surface-elevated border border-surface-border rounded-lg hover:bg-surface-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous day"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            onClick={onNext}
            disabled={!hasNext}
            className="p-2 bg-surface-elevated border border-surface-border rounded-lg hover:bg-surface-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Next day"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div className="relative h-52 overflow-hidden">
        <img src={day.cover} alt={day.theme} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-24">
        <span className="inline-block px-3 py-1 rounded-full bg-brand-red text-white text-xs font-bold mb-4">
          DAY {day.day}
        </span>
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold mb-2">{day.theme}</h2>
        <p className="text-white/40 text-sm mb-1">{day.city}</p>
        <p className="text-white/50 mb-8">{day.date}</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
          <div className="card-elevated rounded-xl p-4">
            <Bed size={16} className="text-white/40 mb-2" />
            <p className="text-xs text-white/40 uppercase tracking-wider">Stay</p>
            <p className="text-sm font-semibold mt-0.5">{day.stay}</p>
          </div>
          <div className="card-elevated rounded-xl p-4">
            <Wallet size={16} className="text-green-400 mb-2" />
            <p className="text-xs text-white/40 uppercase tracking-wider">Est. cost</p>
            <p className="text-sm font-semibold mt-0.5 text-green-400">RM{cost.min}–{cost.max} pp</p>
          </div>
          <div className="card-elevated rounded-xl p-4 col-span-2 sm:col-span-1">
            <p className="text-xs text-white/40 uppercase tracking-wider">Steps</p>
            <p className="text-2xl font-display font-bold text-brand-red">{day.steps.length}</p>
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

        <StepTimeline steps={day.steps} />
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-surface-bg border-t border-surface-border px-4 py-3 flex justify-between items-center z-[201]">
        <button onClick={onPrev} disabled={!hasPrev} className="flex items-center gap-2 text-sm font-semibold disabled:opacity-30 hover:text-brand-red transition-colors">
          <ArrowLeft size={16} /> Prev
        </button>
        <span className="text-sm text-white/40">Day {day.day} of 14</span>
        <button onClick={onNext} disabled={!hasNext} className="flex items-center gap-2 text-sm font-semibold disabled:opacity-30 hover:text-brand-red transition-colors">
          Next <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
