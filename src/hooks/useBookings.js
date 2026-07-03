/**
 * useBookings.js — Shared booking state hook
 *
 * localStorage key : 'mt-bookings'
 * Shape            : { [presetId: string]: { booked: boolean, paid: number } }
 *
 * Used by: BookingsSection, HotelsSection, MoneyTracker
 *
 * Same-tab sync
 * -------------
 * Every write dispatches CustomEvent('mt:bookings') on window.
 * All consumers listen to this event and re-read storage, so marking
 * something booked in one component instantly updates all others —
 * without a React context or prop drilling.
 *
 * Cross-tab sync is handled via the native 'storage' event.
 */
import { useState, useEffect, useCallback } from 'react';

const KEY = 'mt-bookings';
const EVENT = 'mt:bookings';

function load() {
  try { return JSON.parse(localStorage.getItem(KEY) ?? '{}'); } catch { return {}; }
}

function persist(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
  // Notify all components in the same tab
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function useBookings() {
  const [bookings, setBookings] = useState(load);

  useEffect(() => {
    const sync = () => setBookings(load());
    window.addEventListener(EVENT, sync);      // same-tab updates
    window.addEventListener('storage', sync);  // cross-tab updates
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const updateBookings = useCallback((updater) => {
    setBookings(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      persist(next);
      return next;
    });
  }, []);

  return [bookings, updateBookings];
}
