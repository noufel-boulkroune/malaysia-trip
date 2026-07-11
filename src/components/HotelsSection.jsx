/**
 * HotelsSection.jsx — Hotel options per city with booking tracker
 *
 * localStorage: mt-bookings (via useBookings hook)
 *
 * Displays 3 cities (KL, Penang, Langkawi) as collapsible blocks.
 * Each city has 3 hotel options (Budget / Mid-range / Splurge).
 * Selecting a hotel auto-unbookmarks sibling options in the same city.
 *
 * Budget bar: tracks total hotel spend vs HOTEL_BUDGET_MAX (RM 1,600).
 * Hotel paid amounts default to (estMin + estMax) / 2 × nightCount.
 * EUR_RATE = 4.66 — all prices shown in MYR + EUR.
 *
 * Hotel presetId format: 'h-{city}-{tier}' e.g. 'h-kl-budget'
 */
import { useState } from 'react';
import { Bed, ExternalLink, MapPin, ChevronDown, ChevronUp, CheckCircle2, Circle, AlertTriangle } from 'lucide-react';
import { HOTELS, HOTEL_BUDGET_MAX, EUR_RATE } from '../data/tripData';
import { useBookings } from '../hooks/useBookings';
import SectionHeader from './SectionHeader';

const TIER_STYLE = {
  Budget:      { badge: 'bg-white/10 text-white/60 border-white/10', border: 'border-surface-border', dot: 'bg-white/30' },
  'Mid-range': { badge: 'bg-brand-gold/15 text-brand-gold border-brand-gold/20', border: 'border-brand-gold/20', dot: 'bg-brand-gold' },
  Splurge:     { badge: 'bg-brand-red/15 text-brand-red border-brand-red/20', border: 'border-brand-red/20', dot: 'bg-brand-red' },
};

const toEur = (rm) => Math.round(rm / EUR_RATE);

function HotelCard({ hotel, nightCount, bookings, onToggle, onUpdatePaid }) {
  const s = TIER_STYLE[hotel.tier];
  const state = bookings[hotel.presetId];
  const isBooked = state?.booked ?? false;

  // Per-person (÷2 twin-share) totals for the full stay
  const ppMinTotal = Math.round((hotel.estMin / 2) * nightCount);
  const ppMaxTotal = Math.round((hotel.estMax / 2) * nightCount);
  // Full room total
  const roomMinTotal = hotel.estMin * nightCount;
  const roomMaxTotal = hotel.estMax * nightCount;

  return (
    <div className={`bg-surface-elevated border rounded-2xl p-4 space-y-3 transition-colors ${
      isBooked ? 'border-green-500/30 bg-green-500/5' : s.border
    }`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-lg border mb-2 ${s.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            {hotel.tier}
          </span>
          <h4 className="font-display font-bold text-base leading-tight">{hotel.name}</h4>
        </div>
        <div className="flex items-start gap-2 shrink-0">
          <div className="text-right">
            <p className="text-xs text-white/40 mb-0.5">per night / room</p>
            <p className="text-sm font-bold text-white font-mono">RM {hotel.estMin}–{hotel.estMax}</p>
            <p className="text-xs text-white/30 font-mono">≈ {toEur(hotel.estMin)}–{toEur(hotel.estMax)} €</p>
          </div>
          <button
            onClick={() => onToggle(hotel, nightCount)}
            className="mt-0.5"
            title={isBooked ? 'Unbook' : 'Mark as booked'}
          >
            {isBooked
              ? <CheckCircle2 size={18} className="text-green-400" />
              : <Circle size={18} className="text-white/20 hover:text-white/50 transition-colors" />
            }
          </button>
        </div>
      </div>

      <ul className="space-y-1">
        {hotel.highlights.map((h, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-white/55">
            <span className="text-green-400 mt-px shrink-0">✓</span>
            {h}
          </li>
        ))}
      </ul>

      {/* Total cost breakdown — room vs per person */}
      <div className="rounded-xl border border-surface-border bg-surface-bg overflow-hidden text-xs">
        <div className="flex items-center justify-between px-3 py-2 border-b border-surface-border">
          <span className="text-white/40">Room total ({nightCount} nights)</span>
          <div className="text-right">
            <span className="font-mono font-bold text-white/60">RM {roomMinTotal}–{roomMaxTotal}</span>
            <span className="text-white/25 font-mono ml-1.5">≈ {toEur(roomMinTotal)}–{toEur(roomMaxTotal)} €</span>
          </div>
        </div>
        <div className="flex items-center justify-between px-3 py-2 bg-green-500/5">
          <span className="text-green-400 font-semibold">Your share (÷2)</span>
          <div className="text-right">
            <span className="font-mono font-bold text-green-400">RM {ppMinTotal}–{ppMaxTotal}</span>
            <span className="text-green-400/50 font-mono ml-1.5">≈ {toEur(ppMinTotal)}–{toEur(ppMaxTotal)} €</span>
          </div>
        </div>
      </div>

      {/* Paid amount editor when booked */}
      {isBooked && state && (
        <div className="flex items-center gap-2 px-2.5 py-2 bg-surface-bg rounded-xl border border-green-500/20">
          <span className="text-xs text-white/40 shrink-0">Paid:</span>
          <span className="text-xs text-white/40 shrink-0">RM</span>
          <input
            type="number"
            min="0"
            step="1"
            value={state.paid}
            onChange={e => onUpdatePaid(hotel.presetId, e.target.value)}
            className="flex-1 min-w-0 bg-transparent text-sm text-white font-mono focus:outline-none"
          />
          <span className="text-xs text-green-400 shrink-0">✓</span>
        </div>
      )}

      <div className="flex gap-2 pt-1">
        <a
          href={hotel.bookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold rounded-xl transition-colors"
        >
          Booking.com <ExternalLink size={11} />
        </a>
        <a
          href={hotel.agodaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-surface-hover hover:bg-surface-border border border-surface-border text-white/70 hover:text-white text-xs font-semibold rounded-xl transition-colors"
        >
          Agoda <ExternalLink size={11} />
        </a>
      </div>
    </div>
  );
}

function CityBlock({ city, bookings, onToggle, onUpdatePaid }) {
  const [open, setOpen] = useState(false);
  const bookedOption = city.options.find(h => bookings[h.presetId]?.booked);

  return (
    <div className="card rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-4 p-5 hover:bg-surface-elevated transition-colors text-left"
      >
        <div className="w-10 h-10 rounded-xl bg-brand-red/10 border border-brand-red/20 flex items-center justify-center shrink-0">
          <Bed size={18} className="text-brand-red" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-lg">{city.city}</h3>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
            {city.dateRanges.map((r, i) => (
              <span key={i} className="text-xs font-mono font-semibold text-brand-gold bg-brand-gold/10 border border-brand-gold/20 px-2 py-0.5 rounded-lg">
                {r.checkIn} → {r.checkOut}
              </span>
            ))}
            <span className="text-xs text-white/30">{city.nights}</span>
          </div>
          {bookedOption && (
            <span className="text-xs text-green-400 flex items-center gap-1 mt-1">
              <CheckCircle2 size={10} /> {bookedOption.name}
            </span>
          )}
        </div>
        <div className="shrink-0 text-white/30">
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-3 animate-slide-up">
          <p className="text-xs text-white/40 pb-1 border-t border-surface-border pt-4 flex items-center gap-1.5">
            <MapPin size={11} className="text-brand-red" />
            {city.area}
          </p>
          {city.options.map((h) => (
            <HotelCard
              key={h.presetId}
              hotel={h}
              nightCount={city.nightCount}
              bookings={bookings}
              onToggle={onToggle}
              onUpdatePaid={onUpdatePaid}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function HotelsSection() {
  const [bookings, updateBookings] = useBookings();

  function toggleHotel(hotel, nightCount) {
    updateBookings(prev => {
      if (prev[hotel.presetId]?.booked) {
        const next = { ...prev };
        delete next[hotel.presetId];
        return next;
      }
      // Find city that contains this hotel and unbook any sibling options
      const city = HOTELS.find(c => c.options.some(h => h.presetId === hotel.presetId));
      const next = { ...prev };
      city?.options.forEach(h => { if (h.presetId !== hotel.presetId) delete next[h.presetId]; });
      next[hotel.presetId] = {
        booked: true,
        paid: Math.round((hotel.estMin + hotel.estMax) / 2) * nightCount,
      };
      return next;
    });
  }

  function updatePaid(presetId, val) {
    const num = parseFloat(val);
    updateBookings(prev => ({ ...prev, [presetId]: { ...prev[presetId], paid: isNaN(num) ? 0 : num } }));
  }

  // Compute total hotel spend from booked hotel presetIds
  const allHotelPresetIds = new Set(HOTELS.flatMap(c => c.options.map(h => h.presetId)));
  const hotelSpend = Object.entries(bookings)
    .filter(([id, b]) => allHotelPresetIds.has(id) && b.booked)
    .reduce((sum, [, b]) => sum + (b.paid ?? 0), 0);

  const pct = Math.min((hotelSpend / HOTEL_BUDGET_MAX) * 100, 100);
  const overBudget = hotelSpend > HOTEL_BUDGET_MAX;
  const nearLimit = pct >= 70 && !overBudget;

  return (
    <section id="hotels" className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <SectionHeader
        eyebrow="Where to sleep"
        title="Hotels"
        right={
          <p className="text-sm text-white/30 text-right hidden sm:block">
            3 options per city<br />Budget → Splurge
          </p>
        }
      />

      {/* Hotel budget bar */}
      <div className={`mb-6 p-4 rounded-2xl border ${
        overBudget ? 'border-brand-red/40 bg-brand-red/5'
        : nearLimit ? 'border-brand-gold/30 bg-brand-gold/5'
        : 'border-surface-border bg-surface-card'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {overBudget && <AlertTriangle size={14} className="text-brand-red" />}
            <span className="text-xs font-bold text-white/60 uppercase tracking-wide">Hotel Budget (room total)</span>
          </div>
          <div className="text-right">
            <span className={`text-sm font-mono font-bold ${overBudget ? 'text-brand-red' : nearLimit ? 'text-brand-gold' : 'text-white'}`}>
              RM {hotelSpend.toLocaleString()}
            </span>
            <span className="text-xs text-white/30 font-mono"> / {HOTEL_BUDGET_MAX.toLocaleString()}</span>
            <p className="text-[11px] text-white/20 font-mono">≈ {toEur(hotelSpend)} € / {toEur(HOTEL_BUDGET_MAX)} € max (room total)</p>
          </div>
        </div>
        <div className="h-2 bg-surface-elevated rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              overBudget ? 'bg-brand-red' : nearLimit ? 'bg-brand-gold' : 'bg-green-500'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between mt-1.5 text-[11px] text-white/25">
          <span>RM 0</span>
          {overBudget
            ? <span className="text-brand-red font-semibold">RM {(hotelSpend - HOTEL_BUDGET_MAX).toLocaleString()} over max</span>
            : <span>RM {(HOTEL_BUDGET_MAX - hotelSpend).toLocaleString()} remaining</span>
          }
          <span>RM {HOTEL_BUDGET_MAX.toLocaleString()} max</span>
        </div>
        {hotelSpend === 0 && (
          <p className="text-xs text-white/30 mt-2 text-center">Mark a hotel as booked to track spend · Prices are per room for the full stay</p>
        )}
      </div>

      <div className="space-y-3">
        {HOTELS.map(city => (
          <CityBlock
            key={city.city}
            city={city}
            bookings={bookings}
            onToggle={toggleHotel}
            onUpdatePaid={updatePaid}
          />
        ))}
      </div>

      <p className="mt-6 text-xs text-white/25 text-center">
        All prices per room/night (÷2 for twin-share) · Book 2–3 weeks ahead for July peak season<br />
        Expect at check-in: RM10/room/night tourism tax (cash) + a refundable deposit of ~RM50–200/room
      </p>
    </section>
  );
}
