
import { MBTIResult, HistoryItem } from '../types';

const STORAGE_KEY = 'lumina_mbti_history_v1';

export const saveResultToHistory = (result: MBTIResult): void => {
  try {
    const existingHistory = getHistory();
    const newItem: HistoryItem = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      timestamp: Date.now(),
      result,
    };

    // Keep the latest 50 records
    const updatedHistory = [newItem, ...existingHistory].slice(0, 50);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error("Failed to save history:", error);
  }
};

export const getHistory = (): HistoryItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to retrieve history:", error);
    return [];
  }
};

export const clearHistory = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear history:", error);
  }
};
