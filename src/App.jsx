/**
 * App.jsx — Root application shell
 *
 * Responsibilities
 * ----------------
 * - Owns `activeDay` (null | 1–14): which day detail is open
 * - Implements browser-history navigation via history.pushState + popstate
 *   so the native back button closes the day view without a full reload
 * - Renders all page sections when no day is open; renders DayDetail overlay
 *   when a day is open; MoneyTracker floats on top at all times
 * - Passes `extraCost` from useTripOptions down to BudgetSection + DaysSection
 *
 * To add a new page/view: extend the activeDay state machine or add a new
 * overlay component alongside DayDetail.
 */
import { useState, useCallback, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import RouteSection from './components/RouteSection';
import DaysSection from './components/DaysSection';
import DayDetail from './components/DayDetail';
import OptionsPanel from './components/OptionsPanel';
import BudgetSection from './components/BudgetSection';
import SpendSection from './components/SpendSection';
import BookingsSection from './components/BookingsSection';
import HotelsSection from './components/HotelsSection';
import PrepSection from './components/PrepSection';
import MoneyTracker from './components/MoneyTracker';
import { useTripOptions } from './hooks/useTripOptions';
import { getDayByNumber, DAYS } from './data/tripData';

const LAST_DAY = DAYS.length;

export default function App() {
  const [activeDay, setActiveDay] = useState(null);
  const { values, setOption, extraCost, reset } = useTripOptions();

  const openDay = useCallback((n) => {
    setActiveDay(n);
    window.history.pushState({ day: n }, '');
  }, []);

  const closeDay = useCallback(() => {
    setActiveDay(null);
    window.history.pushState({}, '');
  }, []);

  useEffect(() => {
    const handler = (e) => {
      const dayNum = e.state?.day ?? null;
      setActiveDay(dayNum);
    };
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  const day = activeDay ? getDayByNumber(activeDay) : null;

  return (
    <>
      <Navbar activeDay={activeDay} onCloseDay={closeDay} />

      {!activeDay && (
        <>
          <Hero onExplore={() => document.getElementById('days')?.scrollIntoView({ behavior: 'smooth' })} />
          <RouteSection />
          <DaysSection optionValues={values} onOpenDay={openDay} />
          <OptionsPanel values={values} setOption={setOption} extraCost={extraCost} reset={reset} />
          <BudgetSection extraCost={extraCost} />
          <SpendSection />
          <BookingsSection />
          <HotelsSection />
          <PrepSection />
          <footer className="py-10 text-center text-white/40 text-sm border-t border-white/10">
            <p>Malaysia Trip Guide — Squad Edition 2026</p>
            <p className="mt-1">22 Jul – 4 Aug · Prices checked July 2026</p>
          </footer>
        </>
      )}

      {day && (
        <DayDetail
          day={day}
          optionValues={values}
          onClose={closeDay}
          onPrev={() => activeDay > 1 && openDay(activeDay - 1)}
          onNext={() => activeDay < LAST_DAY && openDay(activeDay + 1)}
          hasPrev={activeDay > 1}
          hasNext={activeDay < LAST_DAY}
        />
      )}

      <MoneyTracker activeDay={activeDay} />
    </>
  );
}
