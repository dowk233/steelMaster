import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Header from './components/Header';
import YearGrid from './components/YearGrid';
import StatsSection from './components/StatsSection';
import DailyView from './components/DailyView';
import AIInsights from './components/AIInsights';
import { YearData, DayLog, Habit } from './types';
import { loadYearData, saveYearData } from './utils/storage';
import { translations } from './translations';

const App: React.FC = () => {
  const [data, setData] = useState<YearData>(loadYearData());
  const [activeTab, setActiveTab] = useState<'grid' | 'today' | 'stats'>('today');
  const t = translations[data.language];
  
  const todayId = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  }, []);

  const [selectedDayId, setSelectedDayId] = useState<number>(todayId);

  useEffect(() => {
    if (data.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    saveYearData(data);
  }, [data]);

  const toggleTheme = () => {
    setData(prev => ({ ...prev, theme: prev.theme === 'light' ? 'dark' : 'light' }));
  };

  const toggleLanguage = () => {
    const langs: ('en' | 'en-uk' | 'jp' | 'zh')[] = ['en', 'en-uk', 'jp', 'zh'];
    const nextIdx = (langs.indexOf(data.language) + 1) % langs.length;
    setData(prev => ({ ...prev, language: langs[nextIdx] }));
  };

  const updateDay = useCallback((updatedDay: DayLog) => {
    setData(prev => {
      const isComplete = updatedDay.tasks.length > 0 && updatedDay.tasks.every(t => t.completed);
      return {
        ...prev,
        days: prev.days.map(d => d.dayId === updatedDay.dayId ? { ...updatedDay, completed: isComplete } : d)
      };
    });
  }, []);

  const updateHabits = useCallback((updatedHabits: Habit[]) => {
    setData(prev => ({ ...prev, habits: updatedHabits }));
  }, []);

  const setGoal = (goal: string) => {
    setData(prev => ({ ...prev, goal }));
  };

  const selectedDay = useMemo(() => 
    data.days.find(d => d.dayId === selectedDayId) || data.days[0]
  , [data.days, selectedDayId]);

  return (
    <div className="min-h-screen w-full flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <div className="flex-1 max-w-6xl mx-auto w-full px-6 py-10">
        <Header 
          goal={data.goal} 
          setGoal={setGoal} 
          theme={data.theme}
          toggleTheme={toggleTheme}
          language={data.language}
          toggleLanguage={toggleLanguage}
        />

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10">
          <nav className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <button 
              onClick={() => { setActiveTab('today'); setSelectedDayId(todayId); }}
              className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                activeTab === 'today' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none' 
                : 'text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {t.navToday}
            </button>
            <button 
              onClick={() => setActiveTab('grid')}
              className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                activeTab === 'grid' 
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg' 
                : 'text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {t.navGrid}
            </button>
            <button 
              onClick={() => setActiveTab('stats')}
              className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                activeTab === 'stats' 
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg' 
                : 'text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {t.navStats}
            </button>
          </nav>
          
          <div className="hidden sm:block h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
          
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.logoText} PROTOCOL ACTIVE</span>
          </div>
        </div>

        <main className="relative">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {activeTab === 'today' && (
              <DailyView 
                day={selectedDay} 
                habits={data.habits} 
                updateDay={updateDay} 
                updateHabits={updateHabits}
                language={data.language}
              />
            )}
            {activeTab === 'grid' && (
              <YearGrid 
                days={data.days} 
                toggleDay={(id) => { setSelectedDayId(id); setActiveTab('today'); }} 
              />
            )}
            {activeTab === 'stats' && (
              <StatsSection days={data.days} language={data.language} />
            )}
          </div>
        </main>

        <AIInsights days={data.days} goal={data.goal} language={data.language} />
      </div>

      <footer className="mt-auto py-10 px-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-slate-950">
        <p className="text-slate-300 dark:text-slate-700 font-bold text-[10px] uppercase tracking-[0.4em]">
          {t.footerMastery}
        </p>
        <p className="text-slate-300 dark:text-slate-700 font-medium text-[10px] tracking-widest uppercase">
          &copy; {new Date().getFullYear()} {translations.en.logoText} PROTOCOL // {t.footerTimeInfo}
        </p>
      </footer>
    </div>
  );
};

export default App;