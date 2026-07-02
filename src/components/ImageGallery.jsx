import { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Expand } from 'lucide-react';

export default function ImageGallery({ images, className = '' }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (!images?.length) return null;

  const prev = () => setActive((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setActive((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <>
      <div className={`relative group ${className}`}>
        <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-surface-elevated">
          <img
            src={images[active].src}
            alt={images[active].caption}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <p className="absolute bottom-4 left-4 right-14 text-sm text-white/90 font-medium">
            {images[active].caption}
          </p>
          <button
            onClick={() => setLightbox(true)}
            className="absolute top-3 right-3 p-2 rounded-lg bg-black/50 hover:bg-black/70 transition-colors"
            aria-label="Expand gallery"
          >
            <Expand size={16} />
          </button>
          {images.length > 1 && (
            <>
              <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronLeft size={18} />
              </button>
              <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>

        {images.length > 1 && (
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                  i === active ? 'border-brand-red scale-105' : 'border-transparent opacity-50 hover:opacity-80'
                }`}
              >
                <img src={img.src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightbox && (
        <div className="fixed inset-0 z-[300] bg-black/95 flex flex-col animate-fade-in" onClick={() => setLightbox(false)}>
          <button className="absolute top-4 right-4 z-10 p-3 rounded-full bg-surface-elevated hover:bg-surface-hover border border-surface-border transition-colors" onClick={() => setLightbox(false)}>
            <X size={20} />
          </button>
          <div className="flex-1 flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
            <img src={images[active].src} alt={images[active].caption} className="max-w-full max-h-[80vh] object-contain rounded-lg" />
          </div>
          <p className="text-center text-white/60 pb-6 px-4 text-sm">{images[active].caption}</p>
          <div className="flex justify-center gap-2 pb-8 px-4 overflow-x-auto">
            {images.map((img, i) => (
              <button key={i} onClick={() => setActive(i)} className={`shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-all ${i === active ? 'border-brand-red' : 'border-transparent opacity-50'}`}>
                <img src={img.src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
