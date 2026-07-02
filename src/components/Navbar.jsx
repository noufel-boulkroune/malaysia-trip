import { useState } from 'react';
import { Menu, X, ChevronLeft } from 'lucide-react';

const LINKS = [
  { href: '#days', label: 'Days' },
  { href: '#route', label: 'Route' },
  { href: '#options', label: 'Options' },
  { href: '#bookings', label: 'Book' },
  { href: '#budget', label: 'Budget' },
  { href: '#prep', label: 'Prep' },
];

export default function Navbar({ activeDay, onCloseDay }) {
  const [open, setOpen] = useState(false);

  const handleNav = (href) => {
    setOpen(false);
    if (activeDay) onCloseDay?.();
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }, activeDay ? 100 : 0);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-bg border-b border-surface-border h-14 flex flex-col justify-center">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full flex items-center justify-between">
        <button
          onClick={() => { onCloseDay?.(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex items-center gap-2 font-display font-bold text-sm tracking-widest"
        >
          <span className="w-2 h-2 rounded-full bg-brand-red shrink-0" />
          MY TRIP
        </button>

        {activeDay ? (
          <button
            onClick={onCloseDay}
            className="flex items-center gap-1.5 text-sm font-semibold text-white/70 hover:text-white transition-colors"
          >
            <ChevronLeft size={16} /> Back
          </button>
        ) : (
          <>
            <nav className="hidden md:flex items-center gap-1">
              {LINKS.map(({ href, label }) => (
                <button
                  key={href}
                  onClick={() => handleNav(href)}
                  className="px-3 py-1.5 text-sm text-white/60 hover:text-white hover:bg-surface-elevated rounded-lg transition-colors"
                >
                  {label}
                </button>
              ))}
            </nav>

            <button
              className="md:hidden p-2 rounded-lg hover:bg-surface-elevated transition-colors"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </>
        )}
      </div>

      {open && !activeDay && (
        <nav className="md:hidden bg-surface-bg border-t border-surface-border px-4 py-3 flex flex-col gap-1 animate-fade-in">
          {LINKS.map(({ href, label }) => (
            <button
              key={href}
              onClick={() => handleNav(href)}
              className="text-left px-3 py-2.5 text-white/70 hover:text-white hover:bg-surface-elevated rounded-lg transition-colors"
            >
              {label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
