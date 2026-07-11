/**
 * Tailwind config — "Island Dusk" design system
 *
 * Semantic token names stay stable so only THIS file needs touching to retheme
 * the whole app. Never use raw hex values in component classNames.
 *
 * Palette
 * -------
 * brand-red      → Deep teal    — primary CTA, badges, active states (name kept for compat)
 * brand-red-dark → Darker teal  — hover variant
 * brand-gold     → Warm amber   — warnings, budget bar, highlights
 * brand-danger   → Coral red    — over-budget alerts, destructive actions
 * surface-*      → Warm ink darks — cards, borders, overlays
 */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          red:       '#0FA18C',   // deep teal — primary actions
          'red-dark':'#0B8A77',   // teal hover
          bright:    '#2DD4BF',   // bright teal — accent text, glows, focus rings
          gold:      '#F5B841',   // amber — warnings, gold highlights
          danger:    '#F26D6D',   // coral red — error / over-budget only
        },
        surface: {
          bg:       '#0B0E13',   // page background (warm ink)
          card:     '#11151C',   // card background
          elevated: '#1A202B',   // raised surfaces (modals, dropdowns)
          border:   '#242C3A',   // subtle border
          hover:    '#202836',   // interactive hover on dark surfaces
        },
      },
      fontFamily: {
        sans:    ['"Inter"',          'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"',  '"Inter"',   'system-ui', 'sans-serif'],
      },
      boxShadow: {
        // Soft lift for interactive cards
        lift: '0 8px 30px rgba(0,0,0,0.35)',
        // Teal glow for primary CTAs
        cta:  '0 4px 20px rgba(15,161,140,0.35)',
      },
      animation: {
        'fade-in':  'fadeIn  0.25s ease-out',
        'slide-up': 'slideUp 0.35s ease-out',
        'slide-in': 'slideIn 0.3s  ease-out',
        'pop':      'pop 0.25s ease-out',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' },                               to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(14px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideIn: { from: { opacity: '0', transform: 'translateX(-14px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        pop:     { '0%': { transform: 'scale(0.6)' }, '70%': { transform: 'scale(1.15)' }, '100%': { transform: 'scale(1)' } },
      },
    },
  },
  plugins: [],
};
