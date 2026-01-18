
export type AssessmentType = 'MBTI' | 'HOLLAND' | 'SCL90' | 'IQ' | 'EQ' | 'SPIRITUAL';

export interface Option {
  text: string;
  value: string | number;
  score?: number; // For IQ/EQ correct answers or weighted scores
}

export interface Question {
  id: number;
  text: string;
  category?: string; // e.g., 'EI' for MBTI, 'R' for Holland, 'Anxiety' for SCL90
  options: Option[];
}

// Result Types
export interface MBTIResultData {
  type: string;
  scores: Record<string, number>;
  percentages: Record<string, number>;
}

export interface HollandResultData {
  code: string; // e.g., "ASE"
  scores: Record<string, number>; // R, I, A, S, E, C
}

export interface SCL90ResultData {
  totalScore: number;
  averageScore: number;
  factorScores: Record<string, number>; // Anxiety: 2.5, etc.
  severity: 'Normal' | 'Mild' | 'Moderate' | 'Severe';
}

export interface IqEqResultData {
  score: number;
  total: number;
  level: string; // "High", "Average", etc.
  percentile?: number;
}

export interface SpiritualResultData {
  scores: Record<string, number>; // Meaning, Connection, Peace
  total: number;
  dominant: string;
}

export type AssessmentResult = 
  | { type: 'MBTI'; data: MBTIResultData }
  | { type: 'HOLLAND'; data: HollandResultData }
  | { type: 'SCL90'; data: SCL90ResultData }
  | { type: 'IQ'; data: IqEqResultData }
  | { type: 'EQ'; data: IqEqResultData }
  | { type: 'SPIRITUAL'; data: SpiritualResultData };

export interface AIAnalysis {
  title: string;
  summary: string;
  keyTraits: string[];
  recommendations: string[];
  detailedAnalysis: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  assessmentType: AssessmentType;
  version: 'LITE' | 'PRO';
  result: AssessmentResult;
}

export interface AssessmentConfig {
  id: AssessmentType;
  title: string;
  description: string;
  icon: any; // Lucide icon component
  color: string;
  questionsLite: Question[];
  questionsPro: Question[];
  durationLite: string;
  durationPro: string;
}

export enum AppMode {
  DASHBOARD = 'DASHBOARD',
  QUIZ = 'QUIZ',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT',
  HISTORY = 'HISTORY',
}
