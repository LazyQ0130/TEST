import { AssessmentType } from '../types';

export interface QuizState {
  currentIndex: number;
  answers: Record<number, string>;
  timestamp: number;
}

const STORAGE_PREFIX = 'lumina_quiz_progress_';

export const saveQuizProgress = (type: AssessmentType, currentIndex: number, answers: Record<number, string>) => {
  try {
    const data: QuizState = {
      currentIndex,
      answers,
      timestamp: Date.now()
    };
    localStorage.setItem(STORAGE_PREFIX + type, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save quiz progress", e);
  }
};

export const getQuizProgress = (type: AssessmentType): QuizState | null => {
  try {
    const str = localStorage.getItem(STORAGE_PREFIX + type);
    if (!str) return null;
    return JSON.parse(str);
  } catch (e) {
    console.error("Failed to load quiz progress", e);
    return null;
  }
};

export const clearQuizProgress = (type: AssessmentType) => {
  try {
    localStorage.removeItem(STORAGE_PREFIX + type);
  } catch (e) {
    console.error("Failed to clear quiz progress", e);
  }
};
