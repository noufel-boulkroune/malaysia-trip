/**
 * spend.js — Pure helpers for computing per-day spend across all three
 * expense sources (manual entries, bookings, logged steps). Single
 * implementation shared by SpendSection and MoneyTracker so day totals
 * can't diverge between the two views.
 */
import { BOOKING_PRESETS } from '../data/tripData';

export function daySpentFor(dayNum, entries, bookings, stepExpenses) {
  const entriesAmt = entries
    .filter(e => e.day === dayNum)
    .reduce((s, e) => s + e.amount, 0);

  const bookingsAmt = Object.entries(bookings)
    .filter(([id, b]) => b.booked && BOOKING_PRESETS.find(p => p.id === id)?.day === dayNum)
    .reduce((s, [, b]) => s + (b.paid ?? 0), 0);

  const stepsAmt = Object.entries(stepExpenses)
    .filter(([id]) => id.startsWith(`d${dayNum}-`))
    .reduce((s, [, e]) => s + (e.paid ?? 0), 0);

  return entriesAmt + bookingsAmt + stepsAmt;
}

export function calcSpendTotals(entries, bookings, stepExpenses) {
  const bookedTotal = Object.values(bookings).filter(b => b.booked).reduce((s, b) => s + (b.paid ?? 0), 0);
  const stepTotal    = Object.values(stepExpenses).reduce((s, e) => s + (e.paid ?? 0), 0);
  const spendTotal   = entries.reduce((s, e) => s + e.amount, 0);
  return { bookedTotal, stepTotal, spendTotal, totalSpent: bookedTotal + stepTotal + spendTotal };
}
