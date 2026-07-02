import { useState, useCallback, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import RouteSection from './components/RouteSection';
import DaysSection from './components/DaysSection';
import DayDetail from './components/DayDetail';
import OptionsPanel from './components/OptionsPanel';
import BudgetSection from './components/BudgetSection';
import BookingsSection from './components/BookingsSection';
import HotelsSection from './components/HotelsSection';
import PrepSection from './components/PrepSection';
import MoneyTracker from './components/MoneyTracker';
import { useTripOptions } from './hooks/useTripOptions';
import { getDayByNumber } from './data/tripData';

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
          onNext={() => activeDay < 14 && openDay(activeDay + 1)}
          hasPrev={activeDay > 1}
          hasNext={activeDay < 14}
        />
      )}

      <MoneyTracker activeDay={activeDay} />
    </>
  );
}
