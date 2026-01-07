
import { GoogleGenAI, Type } from "@google/genai";
import { DayLog } from "../types";

// Fixed: Replaced non-existent DayStatus with DayLog
export const getAIInsight = async (days: DayLog[], goal: string) => {
  const completedCount = days.filter(d => d.completed).length;
  const streak = calculateStreak(days);
  // Fixed: Use standard initialization per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Analyze this 365-day progress for the goal: "${goal}".
    Completed: ${completedCount}/365 days.
    Current/Max Streak: ${streak} days.
    Provide a short, 2-sentence motivational insight or tip to help them stay consistent.
    Keep it minimal and encouraging.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            message: { type: Type.STRING },
            sentiment: { 
              type: Type.STRING,
              description: "One of: positive, encouraging, neutral"
            }
          },
          required: ["message", "sentiment"]
        }
      }
    });

    // Fixed: response.text is a property, not a method
    const text = response.text || "{}";
    const result = JSON.parse(text);
    return result;
  } catch (error) {
    console.error("AI Insight failed:", error);
    return {
      message: "Consistency is key. Keep pushing forward every single day!",
      sentiment: "encouraging"
    };
  }
};

// Fixed: Replaced non-existent DayStatus with DayLog
const calculateStreak = (days: DayLog[]) => {
  let maxStreak = 0;
  let currentStreak = 0;
  for (const day of days) {
    if (day.completed) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }
  return maxStreak;
};
