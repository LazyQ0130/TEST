
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Quiz from './components/Quiz';
import Analyzing from './components/Analyzing';
import ResultView from './components/ResultView';
import HistoryView from './components/HistoryView';
import { AppMode, AssessmentType, AssessmentResult, AIAnalysis, HistoryItem } from './types';
import { ASSESSMENTS } from './constants';
import { calculateResult } from './services/scoringService';
import { generateAssessmentAnalysis } from './services/geminiService';
import { saveResultToHistory, getHistory, clearHistory } from './services/historyService';
import { getQuizProgress, clearQuizProgress } from './services/quizStateService';

export default function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.DASHBOARD);
  const [activeAssessment, setActiveAssessment] = useState<AssessmentType>('MBTI');
  const [activeVersion, setActiveVersion] = useState<'LITE' | 'PRO'>('LITE');
  
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);
  
  // Progress State
  const [initialQuizData, setInitialQuizData] = useState<any>(null);

  useEffect(() => {
    if (mode === AppMode.HISTORY) {
      setHistoryList(getHistory());
    }
  }, [mode]);

  const handleSelectAssessment = (type: AssessmentType, version: 'LITE' | 'PRO') => {
    // Check for saved progress (keyed by type)
    // Note: If version changes, we probably shouldn't resume.
    // For simplicity, we only resume if the saved progress matches the type. 
    // Ideally we would key by type + version, but for now let's just use type.
    // If questions don't match index, it might be weird, so we should clear if length mismatch.
    
    const saved = getQuizProgress(type);
    let shouldResume = false;
    
    // Simple check: if saved exists, ask user. 
    // We assume the user might be restarting a different version, so we might need logic to discard invalid progress.
    if (saved) {
       if (window.confirm("您有一个未完成的测试，是否继续？")) {
         shouldResume = true;
         setInitialQuizData(saved);
       } else {
         clearQuizProgress(type);
         setInitialQuizData(null);
       }
    } else {
      setInitialQuizData(null);
    }
    
    setActiveAssessment(type);
    setActiveVersion(version);
    setMode(AppMode.QUIZ);
  };

  const handleQuizComplete = async (answers: Record<number, string | number>) => {
    setMode(AppMode.ANALYZING);
    
    // 1. Calculate Result
    const assessmentConfig = ASSESSMENTS[activeAssessment];
    const questions = activeVersion === 'LITE' ? assessmentConfig.questionsLite : assessmentConfig.questionsPro;
    
    const calcResult = calculateResult(activeAssessment, questions, answers);
    setResult(calcResult);
    
    // 2. Clear Progress
    clearQuizProgress(activeAssessment);

    // 3. AI Analysis
    try {
      const analysisData = await generateAssessmentAnalysis(calcResult);
      setAnalysis(analysisData);
      
      // 4. Save History
      saveResultToHistory({ 
        id: Date.now().toString(), 
        timestamp: Date.now(), 
        assessmentType: activeAssessment,
        version: activeVersion, 
        result: calcResult 
      });

      setMode(AppMode.RESULT);
    } catch (e) {
      console.error(e);
      setMode(AppMode.RESULT); // Show result even if AI fails
    }
  };

  const handleHistorySelect = (result: AssessmentResult) => {
    setResult(result);
    setAnalysis(null); 
    setMode(AppMode.RESULT);
  };

  // Determine which config to pass to Quiz
  const getActiveConfig = () => {
    const base = ASSESSMENTS[activeAssessment];
    return {
      ...base,
      questions: activeVersion === 'LITE' ? base.questionsLite : base.questionsPro,
      title: `${base.title} (${activeVersion === 'LITE' ? '简洁版' : '专业版'})`
    };
  };

  return (
    <Layout headerRight={mode === AppMode.DASHBOARD ? null : <button onClick={() => setMode(AppMode.DASHBOARD)} className="text-sm font-bold text-slate-500 hover:text-indigo-600">返回首页</button>}>
      {mode === AppMode.DASHBOARD && (
        <Dashboard 
          onSelectAssessment={handleSelectAssessment} 
          onViewHistory={() => setMode(AppMode.HISTORY)}
        />
      )}

      {mode === AppMode.QUIZ && (
        <Quiz 
          config={getActiveConfig()}
          initialData={initialQuizData}
          onComplete={handleQuizComplete}
          onBack={() => setMode(AppMode.DASHBOARD)}
        />
      )}

      {mode === AppMode.ANALYZING && <Analyzing />}

      {mode === AppMode.RESULT && result && (
        <ResultView 
          result={result} 
          analysis={analysis} 
          onReset={() => handleSelectAssessment(activeAssessment, activeVersion)}
          onHome={() => setMode(AppMode.DASHBOARD)}
        />
      )}

      {mode === AppMode.HISTORY && (
        <HistoryView 
          history={historyList}
          onSelect={handleHistorySelect}
          onBack={() => setMode(AppMode.DASHBOARD)}
          onClear={() => { clearHistory(); setHistoryList([]); }}
        />
      )}
    </Layout>
  );
}
