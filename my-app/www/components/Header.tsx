
import React, { useState, useEffect } from 'react';
import { Moon, Sun, Clock, Target, Calendar, Languages, ShieldCheck } from 'lucide-react';
import { translations } from '../translations';

interface HeaderProps {
  goal: string;
  setGoal: (goal: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  language: 'en' | 'en-uk' | 'jp' | 'zh';
  toggleLanguage: () => void;
}

const Header: React.FC<HeaderProps> = ({ goal, setGoal, theme, toggleTheme, language, toggleLanguage }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const t = translations[language];

  const tzMap = {
    'en': 'America/New_York',
    'en-uk': 'Europe/London',
    'jp': 'Asia/Tokyo',
    'zh': 'Asia/Shanghai'
  };

  const activeTz = tzMap[language];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getLocalizedTime = () => {
    return new Intl.DateTimeFormat('ja-JP', { 
      timeZone: activeTz,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(currentTime);
  };

  const getLocalizedDate = () => {
    return new Intl.DateTimeFormat(language === 'zh' ? 'zh-CN' : (language === 'jp' ? 'ja-JP' : (language === 'en-uk' ? 'en-GB' : 'en-US')), {
      timeZone: activeTz,
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short'
    }).format(currentTime);
  };

  return (
    <header className="mb-8 pt-4">
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 group cursor-default">
            <div className="w-12 h-12 bg-slate-900 dark:bg-white rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12 shadow-lg dark:shadow-none">
              <ShieldCheck className="text-white dark:text-slate-900" size={24} strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white leading-none block">
                {translations.en.logoText}
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 dark:text-blue-400">
                MASTER
              </span>
            </div>
          </div>

          <div className="hidden lg:block h-10 w-px bg-slate-200 dark:bg-slate-800"></div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 text-slate-900 dark:text-white">
              <Clock size={20} className="text-blue-600 dark:text-blue-400" />
              <span className="text-4xl font-black tracking-tight font-mono">{getLocalizedTime()}</span>
            </div>
            <div className="bg-white dark:bg-slate-900 px-4 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
               <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                {t.headerTimeLabel}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-2 rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="px-5 py-2 flex items-center gap-3 text-slate-500 dark:text-slate-400 border-r border-slate-100 dark:border-slate-800">
            <Calendar size={16} />
            <span className="text-xs font-bold">{getLocalizedDate()}</span>
          </div>

          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-600 dark:text-slate-300 transition-all text-xs font-black uppercase tracking-widest min-w-[100px] justify-center"
          >
            <Languages size={14} />
            {language.toUpperCase()}
          </button>

          <button 
            onClick={toggleTheme}
            className="p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </div>

      <div className="relative border-t border-slate-100 dark:border-slate-800 pt-6">
        <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500 mb-2">
          <Target size={16} className="text-blue-500" />
          <span className="text-[11px] font-black uppercase tracking-[0.4em]">{t.headerFocus}</span>
        </div>
        <input 
          type="text" 
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="w-full text-5xl md:text-6xl font-black text-slate-900 dark:text-slate-100 bg-transparent border-none focus:outline-none placeholder:text-slate-200 dark:placeholder:text-slate-800 transition-all tracking-tighter"
          placeholder={language === 'zh' ? "设置您的目标..." : (language === 'jp' ? "目標を入力してください" : "Set your trajectory...")}
        />
      </div>
    </header>
  );
};

export default Header;
