
export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface ToDoItem {
  id: string;
  title: string;
  completed: boolean;
  subTasks: SubTask[];
}

export interface DayLog {
  dayId: number;
  completed: boolean;
  tasks: ToDoItem[];
}

export interface Habit {
  id: string;
  title: string;
  active: boolean;
}

export interface YearData {
  days: DayLog[];
  habits: Habit[];
  goal: string;
  theme: 'light' | 'dark';
  language: 'en' | 'en-uk' | 'jp' | 'zh';
}

export interface AIInsight {
  message: string;
  sentiment: 'positive' | 'encouraging' | 'neutral';
}
