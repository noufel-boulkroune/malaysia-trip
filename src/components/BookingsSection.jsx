/**
 * BookingsSection.jsx — Online booking cards with return-from-tab popup
 *
 * localStorage: mt-bookings (via useBookings hook)
 * sessionStorage: mt-pending-click (TTL: 30 min)
 *
 * Flow
 * ----
 * 1. User taps "Book now" → sessionStorage records {presetId, label, ts}
 * 2. User leaves to external booking site
 * 3. On tab focus / visibilitychange (within 30 min) → ReturnPopup fires
 * 4. Step 1: "Did you book it?" → Step 2: "How much?" (pre-filled estimate)
 * 5. Confirmed → saved to mt-bookings → syncs to MoneyTracker + HotelsSection
 *
 * Each card also has a circle checkbox (top-right) for direct toggle.
 * Booked cards show green overlay, paid amount editor, "Open again" button.
 */
import { useState, useEffect, useCallback } from 'react';
import { ExternalLink, CheckCircle2, Circle, X, AlertCircle } from 'lucide-react';
import { BOOKINGS, BOOKING_PRESETS } from '../data/tripData';
import { useBookings } from '../hooks/useBookings';

const PENDING_KEY = 'mt-pending-click';

function ReturnPopup({ pending, onConfirm, onDismiss }) {
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState('ask');
  const preset = BOOKING_PRESETS.find(p => p.id === pending.presetId);
  const suggested = preset ? Math.round((preset.estMin + preset.estMax) / 2) : '';

  function handleYes() {
    if (step === 'ask') { setAmount(String(suggested)); setStep('amount'); return; }
    onConfirm(Number(amount) || suggested || 0);
  }

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/80 animate-fade-in">
      <div className="w-full max-w-sm bg-surface-card border border-surface-border rounded-3xl p-6 animate-slide-up">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-brand-red/10 border border-brand-red/20 flex items-center justify-center">
            <AlertCircle size={18} className="text-brand-red" />
          </div>
          <button onClick={onDismiss} className="p-1.5 rounded-lg hover:bg-surface-elevated text-white/30 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        {step === 'ask' && (
          <>
            <h3 className="font-display font-bold text-lg mb-1">Did you book it?</h3>
            <p className="text-white/50 text-sm mb-6">
              <span className="text-white font-semibold">{pending.label}</span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleYes}
                className="flex-1 py-3 bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl transition-colors text-sm"
              >
                Yes, booked!
              </button>
              <button
                onClick={onDismiss}
                className="flex-1 py-3 bg-surface-elevated hover:bg-surface-hover border border-surface-border text-white/70 font-semibold rounded-xl transition-colors text-sm"
              >
                Not yet
              </button>
            </div>
          </>
        )}

        {step === 'amount' && (
          <>
            <h3 className="font-display font-bold text-lg mb-1">How much did you pay?</h3>
            <p className="text-white/40 text-xs mb-4">
              Estimated: RM{preset?.estMin}–{preset?.estMax}
            </p>
            <div className="relative mb-4">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm font-mono">RM</span>
              <input
                autoFocus
                type="number"
                min="0"
                step="1"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleYes()}
                className="w-full bg-surface-bg border border-surface-border rounded-xl pl-10 pr-4 py-3 text-white text-lg font-mono focus:outline-none focus:border-green-400"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleYes}
                className="flex-1 py-3 bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl transition-colors text-sm"
              >
                Save
              </button>
              <button
                onClick={() => setStep('ask')}
                className="flex-1 py-3 bg-surface-elevated hover:bg-surface-hover border border-surface-border text-white/70 font-semibold rounded-xl transition-colors text-sm"
              >
                Back
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function BookingsSection() {
  const [bookings, updateBookings] = useBookings();
  const [pending, setPending]      = useState(null);

  const checkPending = useCallback(() => {
    const raw = sessionStorage.getItem(PENDING_KEY);
    if (!raw) return;
    try {
      const p = JSON.parse(raw);
      if (Date.now() - p.ts < 30 * 60 * 1000) {
        const already = bookings[p.presetId]?.booked;
        if (!already) setPending(p);
      }
    } catch { /* ignore */ }
    sessionStorage.removeItem(PENDING_KEY);
  }, [bookings]);

  useEffect(() => {
    const onVisible = () => { if (document.visibilityState === 'visible') checkPending(); };
    const onFocus   = () => checkPending();
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', onFocus);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', onFocus);
    };
  }, [checkPending]);

  function handleBookLink(item) {
    if (item.presetId) {
      sessionStorage.setItem(PENDING_KEY, JSON.stringify({ presetId: item.presetId, label: item.item, ts: Date.now() }));
    }
  }

  function confirmBooking(presetId, amount) {
    updateBookings(prev => ({ ...prev, [presetId]: { booked: true, paid: amount } }));
    setPending(null);
  }

  function toggleBooked(item) {
    if (!item.presetId) return;
    const preset = BOOKING_PRESETS.find(p => p.id === item.presetId);
    updateBookings(prev => {
      const cur = prev[item.presetId];
      if (cur?.booked) {
        const next = { ...prev };
        delete next[item.presetId];
        return next;
      }
      return { ...prev, [item.presetId]: { booked: true, paid: preset ? Math.round((preset.estMin + preset.estMax) / 2) : 0 } };
    });
  }

  function updatePaid(presetId, val) {
    const num = parseFloat(val);
    updateBookings(prev => ({ ...prev, [presetId]: { ...prev[presetId], paid: isNaN(num) ? 0 : num } }));
  }

  const bookedCount = Object.values(bookings).filter(b => b.booked).length;

  return (
    <section id="bookings" className="py-20 bg-surface-card/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/30 mb-3">Direct links</p>
            <h2 className="font-display text-4xl sm:text-5xl font-extrabold">BOOK & PAY</h2>
            <p className="text-white/40 text-sm mt-2">Official sites first — avoid beach touts (+20–50% markup)</p>
          </div>
          {bookedCount > 0 && (
            <div className="text-right shrink-0 ml-4">
              <p className="text-2xl font-display font-bold text-green-400">{bookedCount}</p>
              <p className="text-xs text-white/30">booked</p>
            </div>
          )}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BOOKINGS.map((b) => {
            const state     = b.presetId ? bookings[b.presetId] : null;
            const isBooked  = state?.booked ?? false;
            const isFree    = b.price === 'Free';

            return (
              <div
                key={b.item}
                className={`card overflow-hidden flex flex-col transition-colors ${
                  isBooked ? 'border-green-500/30 bg-green-500/5' : 'hover:border-brand-red/30'
                }`}
              >
                {/* Image */}
                <div className="relative h-36 overflow-hidden bg-surface-elevated shrink-0">
                  <img
                    src={b.image}
                    alt={b.item}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {isBooked && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white text-xs font-bold rounded-xl">
                        <CheckCircle2 size={13} /> BOOKED
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold leading-snug flex-1">{b.item}</h3>
                    {b.presetId && (
                      <button
                        onClick={() => toggleBooked(b)}
                        className="shrink-0 mt-0.5"
                        title={isBooked ? 'Unbook' : 'Mark as booked'}
                      >
                        {isBooked
                          ? <CheckCircle2 size={18} className="text-green-400" />
                          : <Circle size={18} className="text-white/20 hover:text-white/50 transition-colors" />
                        }
                      </button>
                    )}
                  </div>

                  <p className="text-green-400 font-bold text-sm">{b.price}</p>
                  <p className="text-xs text-white/30 mt-0.5 mb-3">{b.source}</p>

                  {/* Paid amount editor — shown when booked */}
                  {isBooked && state && (
                    <div className="flex items-center gap-2 mb-3 p-2.5 bg-surface-bg rounded-xl border border-green-500/20">
                      <span className="text-xs text-white/40 shrink-0">Paid:</span>
                      <span className="text-xs text-white/40 shrink-0">RM</span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={state.paid}
                        onChange={e => updatePaid(b.presetId, e.target.value)}
                        className="flex-1 min-w-0 bg-transparent text-sm text-white font-mono focus:outline-none"
                      />
                      <span className="text-xs text-green-400 shrink-0">✓</span>
                    </div>
                  )}

                  <div className="mt-auto">
                    {isFree ? (
                      <a
                        href={b.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleBookLink(b)}
                        className="flex items-center justify-center gap-2 w-full py-2.5 bg-surface-elevated hover:bg-surface-hover border border-surface-border text-white/70 hover:text-white font-semibold text-sm rounded-xl transition-colors"
                      >
                        Open site <ExternalLink size={12} />
                      </a>
                    ) : (
                      <a
                        href={b.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleBookLink(b)}
                        className={`flex items-center justify-center gap-2 w-full py-2.5 font-bold text-sm rounded-xl transition-colors ${
                          isBooked
                            ? 'bg-surface-elevated hover:bg-surface-hover border border-surface-border text-white/60'
                            : 'bg-brand-red hover:bg-brand-red-dark text-white'
                        }`}
                      >
                        {isBooked ? 'Open again' : 'Book now'} <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {pending && (
        <ReturnPopup
          pending={pending}
          onConfirm={(amount) => confirmBooking(pending.presetId, amount)}
          onDismiss={() => setPending(null)}
        />
      )}
    </section>
  );
}
