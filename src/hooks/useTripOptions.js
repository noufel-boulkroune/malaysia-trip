/**
 * useTripOptions.js — Trip option selector hook
 *
 * localStorage key : 'mt-trip-options'
 * Shape            : one key per group in OPTIONS (tripData.js), value = choice id
 *
 * Manages the user-configurable trip choices that affect day cost estimates
 * and the BudgetSection total. Persisted to localStorage so choices survive
 * page refresh. Returns { values, setOption, extraCost, reset }.
 *
 * Same-tab sync via CustomEvent 'mt:trip-options' — same pattern as
 * useBookings. Several components call this hook independently (App,
 * SpendSection, MoneyTracker); without the event they would drift apart.
 *
 * extraCost is the sum of the chosen option costs (used in BudgetSection
 * "With your options" card and the day cost range on DayCards).
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import { OPTIONS } from '../data/tripData';

// One default per group in OPTIONS — the free/no-plan choice of each.
const DEFAULTS = {
  gentingAddon: 'none',
  langkawiExtraDay: 'restDay',
  finalDayActivity: 'freeTime',
  langkawiActivity: 'islandHop',
  langkawiStay: 'guesthouse',
};

const STORAGE_KEY = 'mt-trip-options';
const EVENT = 'mt:trip-options';

function loadOptions() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && typeof saved === 'object') return { ...DEFAULTS, ...saved };
  } catch { /* ignore */ }
  return DEFAULTS;
}

function persist(values) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function useTripOptions() {
  const [values, setValues] = useState(loadOptions);

  useEffect(() => {
    const sync = () => setValues(loadOptions());
    window.addEventListener(EVENT, sync);      // same-tab updates
    window.addEventListener('storage', sync);  // cross-tab updates
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const setOption = useCallback((key, id) => {
    setValues((prev) => {
      const next = { ...prev, [key]: id };
      persist(next);
      return next;
    });
  }, []);

  const extraCost = useMemo(() => {
    return Object.entries(values).reduce((sum, [key, id]) => {
      const choice = OPTIONS[key]?.choices.find((c) => c.id === id);
      return sum + (choice?.cost || 0);
    }, 0);
  }, [values]);

  const reset = useCallback(() => {
    setValues(DEFAULTS);
    persist(DEFAULTS);
  }, []);

  return { values, setOption, extraCost, reset };
}
