/**
 * useTripOptions.js — Trip option selector hook
 *
 * localStorage key : 'mt-trip-options'
 * Shape            : { gentingAddon, langkawiActivity, langkawiStay }
 *
 * Manages three user-configurable trip choices that affect day cost estimates
 * and the BudgetSection total. Persisted to localStorage so choices survive
 * page refresh. Returns { values, setOption, extraCost, reset }.
 *
 * extraCost is the sum of the chosen option costs (used in BudgetSection
 * "With your options" card and the day cost range on DayCards).
 */
import { useState, useCallback, useMemo } from 'react';
import { OPTIONS } from '../data/tripData';

const DEFAULTS = {
  gentingAddon: 'none',
  langkawiActivity: 'islandHop',
  langkawiStay: 'guesthouse',
};

const STORAGE_KEY = 'mt-trip-options';

function loadOptions() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && typeof saved === 'object') return { ...DEFAULTS, ...saved };
  } catch { /* ignore */ }
  return DEFAULTS;
}

export function useTripOptions() {
  const [values, setValues] = useState(loadOptions);

  const setOption = useCallback((key, id) => {
    setValues((prev) => {
      const next = { ...prev, [key]: id };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULTS));
  }, []);

  return { values, setOption, extraCost, reset };
}
