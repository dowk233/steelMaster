
import { YearData, DayLog } from "../types";
import { STORAGE_KEY, TOTAL_DAYS } from "../constants";

export const loadYearData = (): YearData => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Migration check: ensure new fields exist
      if (!parsed.habits) parsed.habits = [{ id: 'h1', title: 'Daily Review', active: true }];
      if (!parsed.theme) parsed.theme = 'light';
      if (!parsed.language) parsed.language = 'en';
      return parsed;
    } catch (e) {
      console.error("Failed to parse saved data", e);
    }
  }
  
  const initialDays: DayLog[] = Array.from({ length: TOTAL_DAYS }, (_, i) => ({
    dayId: i + 1,
    completed: false,
    tasks: []
  }));

  return {
    days: initialDays,
    habits: [
      { id: '1', title: 'Wake up early', active: true },
      { id: '2', title: 'Exercise', active: true },
      { id: '3', title: 'Read 20 mins', active: true }
    ],
    goal: "My 365-Day Mastery",
    theme: 'light',
    language: 'en'
  };
};

export const saveYearData = (data: YearData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};
