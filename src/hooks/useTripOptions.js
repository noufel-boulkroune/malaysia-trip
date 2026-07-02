import { useState, useCallback, useMemo } from 'react';
import { OPTIONS } from '../data/tripData';

const DEFAULTS = {
  gentingAddon: 'none',
  langkawiActivity: 'islandHop',
  langkawiStay: 'guesthouse',
};

export function useTripOptions() {
  const [values, setValues] = useState(DEFAULTS);

  const setOption = useCallback((key, id) => {
    setValues((prev) => ({ ...prev, [key]: id }));
  }, []);

  const extraCost = useMemo(() => {
    return Object.entries(values).reduce((sum, [key, id]) => {
      const choice = OPTIONS[key]?.choices.find((c) => c.id === id);
      return sum + (choice?.cost || 0);
    }, 0);
  }, [values]);

  const reset = useCallback(() => setValues(DEFAULTS), []);

  return { values, setOption, extraCost, reset };
}
