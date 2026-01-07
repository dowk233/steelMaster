
import React, { useState, useEffect } from 'react';
import { getAIInsight } from '../services/geminiService';
import { DayLog, AIInsight } from '../types';
import { translations } from '../translations';

interface AIInsightsProps {
  days: DayLog[];
  goal: string;
  language: 'en' | 'en-uk' | 'jp' | 'zh';
}

const AIInsights: React.FC<AIInsightsProps> = ({ days, goal, language }) => {
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const t = translations[language];

  const fetchInsight = async () => {
    setLoading(true);
    const result = await getAIInsight(days, goal);
    setInsight(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchInsight();
    const interval = setInterval(fetchInsight, 1000 * 60 * 60); // hourly
    return () => clearInterval(interval);
  }, []);

  if (loading && !insight) {
    return (
      <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 animate-pulse flex items-center justify-center">
        <span className="text-slate-400 text-sm">{t.aiAnalyzing}</span>
      </div>
    );
  }

  return (
    <div className="mt-8 p-6 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 rounded-2xl border border-blue-100 dark:border-slate-700 flex flex-col md:flex-row items-center gap-6">
      <div className="w-12 h-12 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center shadow-lg shadow-blue-100 dark:shadow-none">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <div className="flex-1 text-center md:text-left">
        <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-2 justify-center md:justify-start">
          {t.aiTitle}
          <span className="text-[10px] font-normal px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full uppercase tracking-widest">Live</span>
        </h4>
        <p className="text-slate-600 dark:text-slate-400 italic">"{insight?.message || t.aiDefaultMessage}"</p>
      </div>
      <button 
        onClick={fetchInsight}
        disabled={loading}
        className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 transition-colors uppercase tracking-widest disabled:opacity-50"
      >
        {loading ? t.aiThinking : t.aiRefresh}
      </button>
    </div>
  );
};

export default AIInsights;
