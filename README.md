# Malaysia Trip Guide — Squad Edition 2026

Personal travel companion app for a 14-day Malaysia trip (22 Jul – 4 Aug 2026).  
Built with React + Vite + Tailwind CSS. Runs entirely in the browser — no backend, no login.

> **For Claude / AI assistants:** Every source file has its own README comment block at the top
> explaining its purpose, props, state, and localStorage keys. Start by reading those comments
> rather than scanning the full file. This README covers the big-picture architecture.

---

## Trip at a Glance

| City | Dates | Nights |
|---|---|---|
| Kuala Lumpur | 22 Jul → 25 Jul | 3 |
| Penang | 25 Jul → 28 Jul | 3 |
| Langkawi | 28 Jul → 01 Aug | 4 |
| Cameron Highlands | 01 Aug → 03 Aug | 2 |
| Kuala Lumpur (return) | 03 Aug → 04 Aug | 1 |

**Budget:** 3,491.50 MYR per person (your stated budget).  
**Core estimated cost:** RM 2,550–3,240 pp (budget-tier hotels, twin-share).  
**Exchange rate:** 1 € ≈ 4.66 MYR.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS v3 with custom design tokens |
| Fonts | Syne (display headers) + Inter (body) via Google Fonts |
| Icons | Lucide React |
| State | React `useState` + localStorage (no backend, no auth) |
| Routing | Manual `history.pushState` + `popstate` (no router library) |
| Images | Wikimedia Commons `Special:FilePath` API |

---

## File Structure

Each file has a README comment at the top — read it before diving into the code.

```
/
├── README.md                     ← You are here — big-picture overview
├── tailwind.config.js            ← Design tokens (colours, fonts, animations)
│                                    Change colours HERE, not in components.
├── index.html
│
└── src/
    ├── main.jsx                  ← React root mount (README: top of file)
    ├── App.jsx                   ← Root shell, routing state (README: top of file)
    ├── index.css                 ← Global styles + utility classes (README: top of file)
    │
    ├── hooks/
    │   ├── useBookings.js        ← Shared booking state, same-tab sync (README: top of file)
    │   └── useTripOptions.js     ← Trip option toggles, persisted (README: top of file)
    │
    ├── data/
    │   └── tripData.js           ← ALL trip content — single source of truth (README: top of file)
    │
    └── components/
        ├── Navbar.jsx            ← Fixed top nav + back button (README: top of file)
        ├── Hero.jsx              ← Landing section (README: top of file)
        ├── RouteSection.jsx      ← City route cards (README: top of file)
        ├── DaysSection.jsx       ← Day card grid + filter (README: top of file)
        ├── DayCard.jsx           ← Single day card, TODAY badge (README: top of file)
        ├── DayDetail.jsx         ← Full-screen day overlay (README: top of file)
        ├── OptionsPanel.jsx      ← Trip option toggles UI (README: top of file)
        ├── BudgetSection.jsx     ← Budget table, EUR conversion (README: top of file)
        ├── BookingsSection.jsx   ← Booking cards + return popup (README: top of file)
        ├── HotelsSection.jsx     ← Hotel options + budget bar (README: top of file)
        ├── PrepSection.jsx       ← Interactive checklists, packing, transport (README: top of file)
        ├── MoneyTracker.jsx      ← Floating wallet tracker (README: top of file)
        ├── ImageGallery.jsx      ← Carousel + lightbox (README: top of file)
        ├── VideoEmbed.jsx        ← YouTube search link button (README: top of file)
        └── StepTimeline.jsx      ← Day itinerary step cards (README: top of file)
```

---

## Design System

Theme: **"Midnight Ocean"** — deep navy-tinted darks + electric blue primary + amber warnings.

All colours are defined as semantic tokens in `tailwind.config.js`. **Never hardcode hex values in components.**

```
brand-red       #2563EB   Electric blue — primary CTA, badges, active states
brand-red-dark  #1D4ED8   Blue hover
brand-gold      #F59E0B   Amber — warnings, budget alerts, hotel tiers
brand-danger    #EF4444   True red — over-budget states, error text
surface-bg      #06090F   Page background
surface-card    #0C1118   Card background
surface-elevated #131D2B  Raised surfaces (modals, dropdowns)
surface-border  #1A2740   Borders
surface-hover   #172338   Interactive hover
```

Fonts: `font-display` = **Syne** (bold headers), `font-sans` = **Inter** (body text).

---

## Data Architecture

**`src/data/tripData.js`** is the single source of truth for all trip content.

| Export | Shape | Consumer |
|---|---|---|
| `TRIP_META` | `{title, dates, duration, rate, heroImage, ...}` | Hero, BudgetSection |
| `CITIES` | `[{name, nights, vibe, color}]` | RouteSection |
| `OPTIONS` | `{gentingAddon, langkawiActivity, langkawiStay}` | OptionsPanel, useTripOptions |
| `BUDGET` | `[{category, min, max, note, highlight?}]` | BudgetSection — **all totals derived from this** |
| `BOOKING_PRESETS` | `[{id, day, label, estMin, estMax, url}]` | MoneyTracker, BookingsSection |
| `BOOKINGS` | `[{item, price, url, image, presetId}]` | BookingsSection |
| `HOTEL_BUDGET_MAX` | `number` (1600 — room total, 13 nights) | HotelsSection |
| `HOTELS` | `[{city, nightCount, dateRanges[], options[]}]` | HotelsSection |
| `CHECKLIST` | `[{id, text, url?}]` | PrepSection — ids used as localStorage keys |
| `PACKING` | `[{category, items: [{id, text}]}]` | PrepSection |
| `TRANSPORT` | `[{route, mode, duration, price}]` | PrepSection |
| `HALAL` | `string[]` | PrepSection |
| `WARNINGS` | `string[]` | PrepSection |
| `DAYS` | `[{day, date, city, theme, cover, steps[], costBase, ...}]` | DaysSection, DayDetail |
| `getDayByNumber(n)` | `fn → Day` | App.jsx |
| `calcDayCost(day, opts)` | `fn → {min, max}` | DayCard, DayDetail |

### Image sourcing (important)
All images use Wikimedia Commons `Special:FilePath`:
```js
const fp = name =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(name)}?width=1200`;
```
This resolves via 302 redirect to the correct CDN URL.  
**Never** use direct Wikimedia CDN thumb URLs (`/thumb/X/XX/...`) — hash paths break silently.

---

## State & localStorage

| Key | Owner | Shape |
|---|---|---|
| `mt-bookings` | `useBookings` hook | `{[presetId]: {booked: boolean, paid: number}}` |
| `mt-entries` | MoneyTracker | `[{id, desc, amount, cat, day, date}]` |
| `mt-budget` | MoneyTracker | `number` (default: 3491.5) |
| `mt-trip-options` | useTripOptions | `{gentingAddon, langkawiActivity, langkawiStay}` |
| `mt-checklist` | PrepSection | `string[]` (checked item ids) |
| `mt-packing` | PrepSection | `string[]` (packed item ids) |

### Same-tab sync (critical to understand)
`useBookings` dispatches `new CustomEvent('mt:bookings')` on every write.  
All three booking-aware components (BookingsSection, HotelsSection, MoneyTracker) listen to this  
event and re-read storage → they stay in sync within the same tab without a React context.

---

## Key UX Flows

### Day navigation
`DayCard` click → `openDay(n)` in App → `history.pushState({day:n})` → DayDetail renders  
Browser back → `popstate` fires → `setActiveDay(null)` → returns to home  
During trip (22 Jul–4 Aug): today's card has gold TODAY badge; past days are dimmed.

### Booking return popup (BookingsSection)
1. "Book now" click → writes `{presetId, label, ts}` to `sessionStorage`
2. Tab focus / `visibilitychange` within 30 min → `ReturnPopup` fires
3. User confirms booked + amount → saved to `mt-bookings` → all components sync instantly

### Hotel booking
- Each hotel option has a `presetId` (`h-kl-budget`, `h-pg-mid`, etc.)
- Marking a hotel booked auto-unbookmarks other options in the same city
- Running total shown in hotel budget bar (max RM 1,600 for budget-tier rooms)

---

## Adding Things

### New booking item
1. Add to `BOOKING_PRESETS` (unique `id`, `day`, `label`, `estMin`, `estMax`, `url`)
2. Add to `BOOKINGS` with matching `presetId` and an image from `W.*`
3. Done — MoneyTracker and BookingsSection pick it up automatically

### New hotel option
1. Add to relevant city's `options[]` in `HOTELS`
2. Give it a unique `presetId` (`h-city-tier`)
3. Add `estMin`/`estMax` for EUR conversion and budget bar to work

### New checklist item
1. Add `{id, text, url?}` to `CHECKLIST` in tripData.js
2. Give it a unique `id` — this is the localStorage key for the tick state

### Convert to public / multi-trip
- Extract `tripData.js` content into JSON loaded at runtime
- Replace `history.pushState` with React Router
- Add trip selector screen
- Consider moving localStorage to a simple backend (Supabase / PocketBase)

---

## Running Locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # Production → dist/
npm run preview  # Preview production build
```
