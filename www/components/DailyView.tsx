import React, { useState } from 'react';
import { Plus, CheckCircle2, Circle, Trash2, PlusCircle, CheckSquare, Layers, Info } from 'lucide-react';
import { DayLog, ToDoItem, Habit } from '../types';
import { translations } from '../translations';

interface DailyViewProps {
  day: DayLog;
  habits: Habit[];
  updateDay: (updatedDay: DayLog) => void;
  updateHabits: (updatedHabits: Habit[]) => void;
  language: 'en' | 'en-uk' | 'jp' | 'zh';
}

const DailyView: React.FC<DailyViewProps> = ({ day, habits, updateDay, updateHabits, language }) => {
  const [newHabitName, setNewHabitName] = useState('');
  const [newTodoName, setNewTodoName] = useState('');
  const t = translations[language];

  const addTodo = () => {
    if (!newTodoName.trim()) return;
    const newItem: ToDoItem = {
      id: Date.now().toString() + Math.random(),
      title: newTodoName,
      completed: false,
      subTasks: []
    };
    updateDay({ ...day, tasks: [...day.tasks, newItem] });
    setNewTodoName('');
  };

  const addHabit = () => {
    if (!newHabitName.trim()) return;
    const newH: Habit = { id: Date.now().toString() + Math.random(), title: newHabitName, active: true };
    updateHabits([...habits, newH]);
    setNewHabitName('');
  };

  const toggleTodo = (todoId: string) => {
    updateDay({
      ...day,
      tasks: day.tasks.map(t => t.id === todoId ? { ...t, completed: !t.completed } : t)
    });
  };

  const deleteTodo = (todoId: string) => {
    updateDay({ ...day, tasks: day.tasks.filter(t => t.id !== todoId) });
  };

  const addSubtask = (todoId: string, title: string) => {
    if (!title.trim()) return;
    updateDay({
      ...day,
      tasks: day.tasks.map(t => t.id === todoId ? {
        ...t,
        subTasks: [...t.subTasks, { id: Date.now().toString() + Math.random(), title, completed: false }]
      } : t)
    });
  };

  const toggleSubtask = (todoId: string, subtaskId: string) => {
    updateDay({
      ...day,
      tasks: day.tasks.map(t => t.id === todoId ? {
        ...t,
        subTasks: t.subTasks.map(st => st.id === subtaskId ? { ...st, completed: !st.completed } : st)
      } : t)
    });
  };

  const deleteSubtask = (todoId: string, subtaskId: string) => {
    updateDay({
      ...day,
      tasks: day.tasks.map(t => t.id === todoId ? {
        ...t,
        subTasks: t.subTasks.filter(st => st.id !== subtaskId)
      } : t)
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* Main Task Area */}
      <div className="lg:col-span-8 space-y-8">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-none">
                 <Layers size={22} className="text-white" />
               </div>
               <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">
                 {t.todayTitle}
               </h3>
            </div>
            <div className="px-5 py-2 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
               <span className="text-xl font-black text-blue-600 dark:text-blue-400">
                 {day.tasks.filter(t => t.completed).length}/{day.tasks.length}
               </span>
               <span className="ml-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.todayTasks}</span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <input 
                type="text"
                value={newTodoName}
                onChange={(e) => setNewTodoName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTodo()}
                placeholder={t.addTaskPlaceholder}
                className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 px-6 py-4 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:outline-none dark:text-white font-bold text-lg transition-all"
              />
              <button 
                onClick={addTodo}
                className="bg-slate-900 dark:bg-blue-600 text-white px-8 rounded-2xl font-black text-sm hover:bg-blue-600 dark:hover:bg-blue-500 transition-all shadow-xl active:scale-95"
              >
                {t.addTaskBtn}
              </button>
            </div>

            <div className="space-y-4 pt-4">
              {day.tasks.length === 0 && (
                <div className="py-20 text-center opacity-20">
                  <PlusCircle size={64} className="mx-auto mb-4 text-slate-300" strokeWidth={1} />
                  <p className="text-xl font-black uppercase tracking-[0.2em]">{t.noTasks}</p>
                </div>
              )}
              {day.tasks.map(todo => (
                <div key={todo.id} className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden transition-all hover:border-blue-400 dark:hover:border-blue-700">
                  <div className={`flex items-center p-6 gap-6 ${todo.completed ? 'bg-slate-50/50 dark:bg-slate-800/20' : ''}`}>
                    <button 
                      onClick={() => toggleTodo(todo.id)} 
                      className={`flex-shrink-0 transition-all duration-500 ${todo.completed ? 'text-blue-600 scale-110' : 'text-slate-200 dark:text-slate-700 hover:text-blue-500'}`}
                    >
                      {todo.completed ? <CheckCircle2 size={36} strokeWidth={2.5} /> : <Circle size={36} strokeWidth={1} />}
                    </button>
                    <div className="flex-1">
                      <h4 className={`text-2xl font-black transition-all tracking-tight ${todo.completed ? 'line-through text-slate-300 dark:text-slate-700 italic' : 'text-slate-800 dark:text-slate-100'}`}>
                        {todo.title}
                      </h4>
                    </div>
                    <button onClick={() => deleteTodo(todo.id)} className="opacity-0 group-hover:opacity-100 text-slate-200 hover:text-red-500 transition-all p-2">
                      <Trash2 size={20} />
                    </button>
                  </div>
                  
                  {/* Sub-checklist */}
                  <div className="bg-slate-50/30 dark:bg-slate-950/30 border-t border-slate-50 dark:border-slate-800 p-6 pl-16 space-y-3">
                    {todo.subTasks.map(st => (
                      <div key={st.id} className="flex items-center justify-between group/sub">
                        <div className="flex items-center gap-4 text-lg font-bold">
                          <button onClick={() => toggleSubtask(todo.id, st.id)} className={`transition-colors ${st.completed ? 'text-blue-500' : 'text-slate-300 hover:text-blue-400'}`}>
                            {st.completed ? <CheckCircle2 size={18} strokeWidth={2.5} /> : <Circle size={18} strokeWidth={1} />}
                          </button>
                          <span className={`transition-all ${st.completed ? 'line-through text-slate-300 dark:text-slate-600' : 'text-slate-600 dark:text-slate-400'}`}>
                            {st.title}
                          </span>
                        </div>
                        <button onClick={() => deleteSubtask(todo.id, st.id)} className="opacity-0 group-sub/sub:opacity-100 text-slate-200 hover:text-red-400 transition-all">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    
                    <div className="flex gap-4 mt-2">
                      <input 
                        type="text"
                        placeholder={t.addChecklistPlaceholder}
                        className="flex-1 bg-transparent py-2 text-sm focus:outline-none border-b border-slate-100 dark:border-slate-800 focus:border-blue-500 dark:text-slate-200 font-bold transition-all"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            addSubtask(todo.id, (e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Side Area */}
      <div className="lg:col-span-4 space-y-8">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
          <div className="mb-8">
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-3">
              <CheckSquare size={20} className="text-blue-500" />
              {t.sideHabits}
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{t.sideHabitsSub}</p>
          </div>
          
          <div className="space-y-3 mb-8">
            {habits.length === 0 && <p className="text-xs text-slate-300 italic py-6 text-center">{t.noHabits}</p>}
            {habits.map(habit => (
              <div key={habit.id} className="flex items-center justify-between group p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-blue-500/20 transition-all">
                <span className="text-slate-700 dark:text-slate-300 font-bold text-sm tracking-tight">{habit.title}</span>
                <button 
                  onClick={() => updateHabits(habits.filter(h => h.id !== habit.id))}
                  className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2 p-1.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
            <input 
              type="text"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addHabit()}
              placeholder={t.addHabitPlaceholder}
              className="flex-1 bg-transparent px-4 py-2.5 text-xs focus:outline-none dark:text-slate-200 font-bold"
            />
            <button 
              onClick={addHabit} 
              className="p-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl shadow-sm hover:bg-blue-600 hover:text-white transition-all active:scale-90"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl flex items-start gap-4 border border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/40">
            <Info size={24} className="text-white" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Steel Protocol</span>
            <p className="text-sm font-bold leading-tight italic">{t.protocolNote}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyView;