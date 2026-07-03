/**
 * Tailwind config — "Midnight Ocean" design system
 *
 * Semantic token names stay stable so only THIS file needs touching to retheme
 * the whole app. Never use raw hex values in component classNames.
 *
 * Palette
 * -------
 * brand-red      → Electric blue  — primary CTA, badges, active states (name kept for compat)
 * brand-red-dark → Darker blue    — hover variant
 * brand-gold     → Warm amber     — warnings, budget bar, highlights
 * brand-danger   → Coral red      — over-budget alerts, destructive actions
 * surface-*      → Deep navy darks — cards, borders, overlays
 */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          red:       '#2563EB',   // electric blue — primary actions
          'red-dark':'#1D4ED8',   // blue hover
          gold:      '#F59E0B',   // amber — warnings, gold highlights
          danger:    '#EF4444',   // true red — error / over-budget only
        },
        surface: {
          bg:       '#06090F',   // page background (near-black, blue-tinted)
          card:     '#0C1118',   // card background
          elevated: '#131D2B',   // raised surfaces (modals, dropdowns)
          border:   '#1A2740',   // subtle navy border
          hover:    '#172338',   // interactive hover on dark surfaces
        },
      },
      fontFamily: {
        sans:    ['"Inter"',   'system-ui', 'sans-serif'],
        display: ['"Syne"',    '"Inter"',   'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in':  'fadeIn  0.25s ease-out',
        'slide-up': 'slideUp 0.35s ease-out',
        'slide-in': 'slideIn 0.3s  ease-out',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' },                               to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(14px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideIn: { from: { opacity: '0', transform: 'translateX(-14px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
      },
    },
  },
  plugins: [],
};
