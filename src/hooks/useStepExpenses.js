/**
 * useStepExpenses.js — Shared step-level expense state
 *
 * localStorage key : 'mt-step-expenses'
 * Shape            : { [stepId: string]: { paid: number, date: string, title?: string } }
 * stepId format    : 'd{dayNum}-s{stepIndex}'  e.g. 'd3-s2'
 *
 * Used by: StepTimeline (write), MoneyTracker (read for totals + summary)
 * Same-tab sync via CustomEvent 'mt:step-expenses' — same pattern as useBookings.
 *
 * Helper: parseStepCost(costStr) extracts a numeric MYR estimate from
 * step cost strings like "RM150–160 pp" or "Free".
 */
import { useState, useEffect, useCallback } from 'react';

const KEY   = 'mt-step-expenses';
const EVENT = 'mt:step-expenses';

function load() {
  try { return JSON.parse(localStorage.getItem(KEY) ?? '{}'); } catch { return {}; }
}
function persist(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent(EVENT));
}

/** Extract average MYR value from step cost strings. Returns null for free/unparseable. */
export function parseStepCost(costStr) {
  if (!costStr) return null;
  if (/free/i.test(costStr)) return 0;
  const nums = costStr.match(/\d+/g)?.map(Number) ?? [];
  if (!nums.length) return null;
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
}

export function useStepExpenses() {
  const [stepExpenses, setStepExpenses] = useState(load);

  useEffect(() => {
    const sync = () => setStepExpenses(load());
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const logStep = useCallback((stepId, paid, title) => {
    setStepExpenses(prev => {
      const next = {
        ...prev,
        [stepId]: {
          paid,
          title,
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
        },
      };
      persist(next);
      return next;
    });
  }, []);

  const removeStep = useCallback((stepId) => {
    setStepExpenses(prev => {
      const next = { ...prev };
      delete next[stepId];
      persist(next);
      return next;
    });
  }, []);

  return { stepExpenses, logStep, removeStep };
}
