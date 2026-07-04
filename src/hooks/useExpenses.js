/**
 * useExpenses.js — Shared manual expense entries
 *
 * localStorage key : 'mt-entries'
 * Shape            : [{ id, desc, amount, cat, day, date }]
 *
 * Used by: SpendSection (write), MoneyTracker (read for day/trip totals)
 * Same-tab sync via CustomEvent 'mt:entries' — same pattern as useBookings.
 */
import { useState, useEffect, useCallback } from 'react';

const KEY   = 'mt-entries';
const EVENT = 'mt:entries';

function load() {
  try { return JSON.parse(localStorage.getItem(KEY) ?? '[]'); } catch { return []; }
}
function persist(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function useExpenses() {
  const [entries, setEntries] = useState(load);

  useEffect(() => {
    const sync = () => setEntries(load());
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const addEntry = useCallback((entry) => {
    setEntries(prev => {
      const next = [{
        id: Date.now(),
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
        ...entry,
      }, ...prev];
      persist(next);
      return next;
    });
  }, []);

  const removeEntry = useCallback((id) => {
    setEntries(prev => {
      const next = prev.filter(e => e.id !== id);
      persist(next);
      return next;
    });
  }, []);

  return { entries, addEntry, removeEntry };
}
