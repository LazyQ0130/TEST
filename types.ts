
export type Dimension = 'EI' | 'SN' | 'TF' | 'JP';

export interface Option {
  text: string;
  value: string; // 'E', 'I', 'S', 'N', etc.
}

export interface Question {
  id: number;
  text: string;
  dimension: Dimension;
  options: [Option, Option];
}

export interface Scores {
  E: number;
  I: number;
  S: number;
  N: number;
  T: number;
  F: number;
  J: number;
  P: number;
}

export interface MBTIResult {
  type: string; // e.g., "INTJ"
  scores: Scores;
  percentages: {
    EI: number; // Percent E
    SN: number; // Percent S
    TF: number; // Percent T
    JP: number; // Percent J
  };
}

export interface AIAnalysis {
  title: string;
  shortDescription: string;
  strengths: string[];
  weaknesses: string[];
  careerPaths: string[];
  relationships: string;
  famousPeople: string[];
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  result: MBTIResult;
}

export enum AppMode {
  HOME = 'HOME',
  QUIZ = 'QUIZ',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT',
  HISTORY = 'HISTORY',
}

export enum QuizType {
  SIMPLE = 'SIMPLE',
  PROFESSIONAL = 'PROFESSIONAL',
}
