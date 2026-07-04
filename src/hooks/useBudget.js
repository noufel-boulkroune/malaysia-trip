/**
 * useBudget.js — Shared trip budget state
 *
 * localStorage key : 'mt-budget' (user override, or null to follow the estimate)
 *
 * `range` is always calcTripCostRange(optionValues) — the min-max estimate
 * built from every day's real step costs. `budget` is the override if the
 * user set one, otherwise the range's max. This is the single source both
 * SpendSection and MoneyTracker read, so they can never disagree on totals.
 *
 * Same-tab sync via CustomEvent 'mt:budget' — same pattern as useBookings.
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import { calcTripCostRange } from '../data/tripData';

const KEY   = 'mt-budget';
const EVENT = 'mt:budget';

function load() {
  try { return JSON.parse(localStorage.getItem(KEY) ?? 'null'); } catch { return null; }
}
function persist(val) {
  localStorage.setItem(KEY, JSON.stringify(val));
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function useBudget(tripOptionValues) {
  const [override, setOverrideState] = useState(load);

  useEffect(() => {
    const sync = () => setOverrideState(load());
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const setOverride = useCallback((val) => {
    setOverrideState(val);
    persist(val);
  }, []);

  const range  = useMemo(() => calcTripCostRange(tripOptionValues), [tripOptionValues]);
  const budget = override ?? range.max;

  return { budget, range, override, setOverride };
}
