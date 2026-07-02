import { MapPin, ExternalLink, Lightbulb, Utensils } from 'lucide-react';

function StepCard({ step, index, isLast }) {
  return (
    <div className="relative flex gap-4 sm:gap-6">
      {!isLast && (
        <div className="absolute left-4 sm:left-5 top-10 bottom-0 w-px bg-surface-border" />
      )}

      <div className="shrink-0 flex flex-col items-center">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-surface-elevated border border-surface-border flex items-center justify-center font-display font-bold text-white/60 text-xs">
          {index + 1}
        </div>
      </div>

      <div className="flex-1 pb-8">
        <div className="bg-surface-elevated border border-surface-border rounded-2xl p-4 sm:p-5 hover:border-brand-red/30 transition-colors">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="font-mono text-xs text-white/40">{step.time}</span>
            {step.halal && (
              <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 font-semibold">
                <Utensils size={11} /> Halal
              </span>
            )}
            {step.optional && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-surface-border text-white/50 font-semibold">
                Optional
              </span>
            )}
            {step.cost && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 font-semibold ml-auto">
                {step.cost}
              </span>
            )}
          </div>

          <div className="flex items-start gap-2 mb-2">
            <h4 className="font-display font-bold text-base flex-1">{step.title}</h4>
            {step.mapsUrl && (
              <a
                href={step.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 shrink-0 text-xs text-white/40 hover:text-white/70 transition-colors mt-0.5"
                aria-label="Open in Google Maps"
              >
                <MapPin size={13} /> Map
              </a>
            )}
          </div>
          <p className="text-white/60 text-sm leading-relaxed">{step.desc}</p>

          {step.images?.length > 0 && (
            <div className={`grid gap-2 mt-4 ${step.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {step.images.map((src, i) => (
                <div key={i} className="aspect-video rounded-xl overflow-hidden">
                  <img src={src} alt={step.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" loading="lazy" />
                </div>
              ))}
            </div>
          )}

          {step.tip && (
            <div className="flex gap-2 mt-3 p-3 rounded-xl bg-brand-gold/5 border border-brand-gold/20 text-sm text-brand-gold/80">
              <Lightbulb size={15} className="shrink-0 mt-0.5" />
              {step.tip}
            </div>
          )}

          {step.book && (
            <a
              href={step.book}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 w-full justify-center px-4 py-2.5 bg-brand-red hover:bg-brand-red-dark text-white font-bold text-sm rounded-xl transition-colors"
            >
              Book now <ExternalLink size={13} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function StepTimeline({ steps }) {
  return (
    <div className="mt-6">
      <p className="text-xs font-bold uppercase tracking-widest text-brand-red mb-6">Itinerary</p>
      {steps.map((step, i) => (
        <StepCard key={i} step={step} index={i} isLast={i === steps.length - 1} />
      ))}
    </div>
  );
}
