
import React from 'react';
import { DayLog } from '../types';
import { MONTH_NAMES_JP, MONTH_LENGTHS } from '../constants';

interface YearGridProps {
  days: DayLog[];
  toggleDay: (id: number) => void;
}

const YearGrid: React.FC<YearGridProps> = ({ days, toggleDay }) => {
  let dayOffset = 0;

  return (
    <div className="bg-white dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {MONTH_NAMES_JP.map((month, mIdx) => {
          const length = MONTH_LENGTHS[mIdx];
          const monthDays = days.slice(dayOffset, dayOffset + length);
          dayOffset += length;

          return (
            <div key={month} className="space-y-3 p-4 bg-slate-50/50 dark:bg-slate-950/30 rounded-2xl border border-transparent hover:border-blue-500/10 transition-all">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/50 pb-2">
                <h3 className="font-black text-slate-900 dark:text-slate-100 text-sm tracking-tight">
                  {month}
                </h3>
                <span className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                  {Math.round((monthDays.filter(d => d.completed).length / length) * 100)}%
                </span>
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                {monthDays.map((day) => (
                  <button
                    key={day.dayId}
                    title={`Day ${day.dayId}`}
                    onClick={() => toggleDay(day.dayId)}
                    className={`
                      aspect-square rounded-md transition-all duration-300 text-[9px] flex items-center justify-center font-bold
                      ${day.completed 
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 dark:shadow-none' 
                        : 'bg-white dark:bg-slate-900 text-slate-300 dark:text-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/20'}
                    `}
                  >
                    {day.dayId % length === 0 ? length : day.dayId % length}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default YearGrid;
