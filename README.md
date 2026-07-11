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
| Langkawi | 28 Jul → 02 Aug | 5 |
| Kuala Lumpur (return) | 02 Aug → 04 Aug | 2 |

**Group:** 2 travelers, twin-share (`GROUP_SIZE` in `tripData.js`) — every shared cost (Grab, scooter, room) is the per-car/per-room price ÷ 2.  
**Core estimated cost:** RM 3,085–4,295 pp (budget-tier hotels, twin-share, incl. tourism tax) + RM 400–500 suggested buffer.  
**Exchange rate:** 1 € ≈ 4.66 MYR (`EUR_RATE` in `tripData.js` — the only place it's defined).

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

Theme: **"Island Dusk"** — warm ink darks + deep teal primary + amber warnings.

All colours are defined as semantic tokens in `tailwind.config.js`. **Never hardcode hex values in components.**

```
brand-red       #0FA18C   Deep teal — primary CTA, badges, active states (name kept for compat)
brand-red-dark  #0B8A77   Teal hover
brand-bright    #2DD4BF   Bright teal — accent text, money values, focus states
brand-gold      #F5B841   Amber — warnings, budget alerts, hotel tiers
brand-danger    #F26D6D   Coral red — over-budget states, error text
surface-bg      #0B0E13   Page background
surface-card    #11151C   Card background
surface-elevated #1A202B  Raised surfaces (modals, dropdowns)
surface-border  #242C3A   Borders
surface-hover   #202836   Interactive hover
```

Fonts: `font-display` = **Space Grotesk** (headers), `font-sans` = **Inter** (body text).
Shared UI: `SectionHeader` (all section titles), `ExpenseConfirmModal` (one-tap expense
confirm — used by StepTimeline and MoneyTracker), utility classes `.card`,
`.card-interactive`, `.btn-primary`, `.btn-ghost`, `.input` in `index.css`.

---

## Data Architecture

**`src/data/tripData.js`** is the single source of truth for all trip content.

| Export | Shape | Consumer |
|---|---|---|
| `EUR_RATE` | `number` (4.66) — single source for MYR→EUR | Hero, BudgetSection, HotelsSection |
| `TRIP_META` | `{title, dates, duration, rate, heroImage, ...}` | Hero, BudgetSection |
| `CITIES` | `[{name, nights, vibe, color}]` | RouteSection, Hero (city count) |
| `OPTIONS` | `{gentingAddon, langkawiExtraDay, finalDayActivity, langkawiActivity, langkawiStay}` | OptionsPanel, useTripOptions |
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
| `mt-entries` | `useExpenses` hook | `[{id, desc, amount, cat, day, date}]` |
| `mt-budget` | `useBudget` hook | `number` override, or `null` → follows the trip estimate |
| `mt-step-expenses` | `useStepExpenses` hook | `{[stepId]: {paid, date, title?}}` |
| `mt-trip-options` | `useTripOptions` hook | one key per group in `OPTIONS`, value = choice id |
| `mt-current-day` | MoneyTracker | `number` (which trip day the tracker follows) |
| `mt-checklist` | PrepSection | `string[]` (checked item ids) |
| `mt-packing` | PrepSection | `string[]` (packed item ids) |

### Same-tab sync (critical to understand)
Every shared-state hook (`useBookings`, `useExpenses`, `useBudget`, `useStepExpenses`,
`useTripOptions`) dispatches a `CustomEvent` (`mt:bookings`, `mt:entries`, `mt:budget`,
`mt:step-expenses`, `mt:trip-options`) on every write and re-reads storage on that event →
all components stay in sync within the same tab without a React context. Cross-tab sync
comes from the native `storage` event. **Never read/write these keys directly in a
component — always go through the hook**, or the other consumers won't see the change.

---

## Key UX Flows

### Checkbox-driven expense tracking (core flow)
Every itinerary step with a parseable cost is a planned-expense checkbox.
Tick it (in the day view timeline OR the MoneyTracker's "planned expenses"
checklist for the selected day) → `ExpenseConfirmModal` opens pre-filled with
the planned amount → Confirm (or edit the amount first) → saved via
`useStepExpenses` under stepId `d{day}-s{index}` → every total updates
everywhere instantly. Manual entry is only for unplanned expenses.

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
