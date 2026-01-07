
import React, { useMemo } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';
import { DayLog } from '../types';
import { TOTAL_DAYS } from '../constants';
import { translations } from '../translations';

interface StatsSectionProps {
  days: DayLog[];
  language: 'en' | 'en-uk' | 'jp' | 'zh';
}

const StatsSection: React.FC<StatsSectionProps> = ({ days, language }) => {
  const t = translations[language];
  const completedCount = useMemo(() => days.filter(d => d.completed).length, [days]);
  const percentage = Math.round((completedCount / TOTAL_DAYS) * 100);

  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const todayId = Math.floor(diff / oneDay);
  const yesterdayId = Math.max(1, todayId - 1);
  
  const yesterdayLog = days.find(d => d.dayId === yesterdayId);
  const yesterdayTasks = yesterdayLog?.tasks || [];
  const yesterdayDone = yesterdayTasks.filter(t => t.completed).length;
  const yesterdayCompletion = yesterdayTasks.length > 0 
    ? Math.round((yesterdayDone / yesterdayTasks.length) * 100)
    : 0;

  const pieData = [
    { name: 'Completed', value: completedCount, color: '#3b82f6' },
    { name: 'Remaining', value: TOTAL_DAYS - completedCount, color: 'rgba(148, 163, 184, 0.1)' },
  ];

  const recentDays = useMemo(() => {
    return days.slice(Math.max(0, yesterdayId - 7), yesterdayId).map(d => ({
      name: `Day ${d.dayId}`,
      score: d.tasks.length > 0 ? (d.tasks.filter(t => t.completed).length / d.tasks.length) * 100 : 0,
    }));
  }, [days, yesterdayId]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
      {/* Performance Card */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">{t.statsYesterday}</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">{t.statsPerformance}</p>
          </div>
          <div className="text-right">
            <span className={`text-4xl font-black ${yesterdayCompletion >= 80 ? 'text-green-500' : 'text-orange-500'}`}>
              {yesterdayCompletion}%
            </span>
            <p className="text-[10px] text-slate-400 uppercase font-black">{t.statsAccuracy}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
            <p className="text-[10px] text-slate-400 font-black uppercase">{t.todayTasks}</p>
            <p className="text-xl font-black text-slate-800 dark:text-white">{yesterdayTasks.length}</p>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30">
            <p className="text-[10px] text-blue-500 font-black uppercase">{t.statsCleared}</p>
            <p className="text-xl font-black text-blue-600 dark:text-blue-400">{yesterdayDone}</p>
          </div>
          <div className={`p-4 rounded-2xl border ${yesterdayLog?.completed ? 'bg-green-50 border-green-100 dark:bg-green-900/10 dark:border-green-900/30' : 'bg-slate-50 border-slate-100 dark:bg-slate-950 dark:border-slate-800'}`}>
            <p className="text-[10px] text-slate-400 font-black uppercase">Status</p>
            <p className={`text-sm font-black mt-1 uppercase ${yesterdayLog?.completed ? 'text-green-600' : 'text-slate-400'}`}>
              {yesterdayLog?.completed ? t.statsPerfect : t.statsIncomplete}
            </p>
          </div>
        </div>

        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">{t.statsMomentum}</h4>
        <div className="w-full h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={recentDays}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
              <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} stroke="#94a3b8" />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                contentStyle={{ borderRadius: '16px', border: 'none', background: '#0f172a', color: '#fff', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                {recentDays.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.score > 70 ? '#3b82f6' : '#94a3b8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center">
        <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-2">{t.statsYearly}</h3>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-8">{t.statsConsistency}</p>
        
        <div className="w-full h-64 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={95}
                paddingAngle={8}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
             <span className="text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">{percentage}%</span>
             <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">{t.statsJourney}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full mt-8">
          <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl text-center">
            <p className="text-[10px] text-slate-400 uppercase font-black mb-1">{t.statsEffort}</p>
            <p className="text-2xl font-black dark:text-white">{TOTAL_DAYS} <span className="text-xs font-normal text-slate-400">{t.statsDays}</span></p>
          </div>
          <div className="p-5 bg-blue-600 rounded-2xl text-center shadow-lg shadow-blue-100 dark:shadow-none">
            <p className="text-[10px] text-blue-200 uppercase font-black mb-1">{t.statsVictories}</p>
            <p className="text-2xl font-black text-white">{completedCount} <span className="text-xs font-normal text-blue-200">{t.statsDays}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
