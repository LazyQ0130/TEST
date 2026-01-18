
import React, { useState, useCallback, useEffect } from 'react';
import Layout from './components/Layout';
import Quiz from './components/Quiz';
import Analyzing from './components/Analyzing';
import ResultView from './components/ResultView';
import HistoryView from './components/HistoryView';
import { AppMode, QuizType, MBTIResult, AIAnalysis, HistoryItem } from './types';
import { QUIZ_CONFIG } from './constants';
import { getLocalMBTIAnalysis } from './services/analysisService';
import { saveResultToHistory, getHistory, clearHistory } from './services/historyService';
import { getQuizProgress, clearQuizProgress, QuizState } from './services/quizStateService';
import { Zap, BookOpen, History as HistoryIcon, AlertTriangle } from 'lucide-react';

export default function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.HOME);
  const [quizType, setQuizType] = useState<QuizType>(QuizType.SIMPLE);
  const [result, setResult] = useState<MBTIResult | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);
  
  // State for Resume Dialog
  const [resumeDialog, setResumeDialog] = useState<{show: boolean, type: QuizType | null}>({ show: false, type: null });
  const [quizInitialData, setQuizInitialData] = useState<QuizState | null>(null);

  // Load history when entering history mode
  useEffect(() => {
    if (mode === AppMode.HISTORY) {
      setHistoryList(getHistory());
    }
  }, [mode]);

  const attemptStartQuiz = (type: QuizType) => {
    const savedState = getQuizProgress(type);
    if (savedState) {
      setQuizInitialData(savedState);
      setResumeDialog({ show: true, type });
    } else {
      startNewQuiz(type);
    }
  };

  const startNewQuiz = (type: QuizType) => {
    // Clear any potentially existing state just in case
    clearQuizProgress(type);
    setQuizInitialData(null);
    
    setQuizType(type);
    setMode(AppMode.QUIZ);
    setResult(null);
    setAnalysis(null);
    setResumeDialog({ show: false, type: null });
  };

  const resumeQuiz = () => {
    if (resumeDialog.type) {
      setQuizType(resumeDialog.type);
      setMode(AppMode.QUIZ);
      setResult(null);
      setAnalysis(null);
      setResumeDialog({ show: false, type: null });
    }
  };

  const calculateResults = (answers: Record<string, number>) => {
    // Calculate raw dimension totals
    const e = answers['E'] || 0;
    const i = answers['I'] || 0;
    const s = answers['S'] || 0;
    const n = answers['N'] || 0;
    const t = answers['T'] || 0;
    const f = answers['F'] || 0;
    const j = answers['J'] || 0;
    const p = answers['P'] || 0;

    const totalEI = e + i || 1;
    const totalSN = s + n || 1;
    const totalTF = t + f || 1;
    const totalJP = j + p || 1;

    // Calculate Percentages
    const perE = Math.round((e / totalEI) * 100);
    const perS = Math.round((s / totalSN) * 100);
    const perT = Math.round((t / totalTF) * 100);
    const perJ = Math.round((j / totalJP) * 100);

    // Determine Type
    const typeStr = [
      e >= i ? 'E' : 'I',
      s >= n ? 'S' : 'N',
      t >= f ? 'T' : 'F',
      j >= p ? 'J' : 'P'
    ].join('');

    return {
      type: typeStr,
      scores: { E: e, I: i, S: s, N: n, T: t, F: f, J: j, P: p },
      percentages: { EI: perE, SN: perS, TF: perT, JP: perJ }
    };
  };

  const handleQuizComplete = useCallback((answers: Record<string, number>) => {
    const calcResult = calculateResults(answers);
    
    // Save to history immediately
    saveResultToHistory(calcResult);
    
    // Clear incomplete progress since it is now complete
    clearQuizProgress(quizType);

    setResult(calcResult);
    setMode(AppMode.ANALYZING);

    // Simulate calculation delay for better UX (feels like "processing")
    setTimeout(() => {
      const analysisData = getLocalMBTIAnalysis(calcResult.type);
      setAnalysis(analysisData);
      setMode(AppMode.RESULT);
    }, 1500);
  }, [quizType]);

  const handleHistorySelect = (historicalResult: MBTIResult) => {
    setResult(historicalResult);
    // Directly fetch analysis without delay
    const analysisData = getLocalMBTIAnalysis(historicalResult.type);
    setAnalysis(analysisData);
    setMode(AppMode.RESULT);
  };

  const handleClearHistory = () => {
    clearHistory();
    setHistoryList([]);
  };

  const resetApp = () => {
    setMode(AppMode.HOME);
    setResult(null);
    setAnalysis(null);
  };

  const renderHeaderRight = () => {
    if (mode === AppMode.HOME) {
      return (
        <button 
          onClick={() => setMode(AppMode.HISTORY)}
          className="flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-white text-indigo-700 rounded-full text-sm font-semibold shadow-sm transition-all hover:shadow-md backdrop-blur-sm border border-indigo-100"
        >
          <HistoryIcon size={16} />
          历史记录
        </button>
      );
    }
    return null;
  };

  return (
    <Layout headerRight={renderHeaderRight()}>
      {/* Resume Dialog Overlay */}
      {resumeDialog.show && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl space-y-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-2">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">发现未完成的测试</h3>
              <p className="text-slate-500">
                您有一个正在进行的{resumeDialog.type === QuizType.SIMPLE ? '简洁版' : '专业版'}测试，是否继续？
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <button
                onClick={() => resumeDialog.type && startNewQuiz(resumeDialog.type)}
                className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
              >
                重新开始
              </button>
              <button
                onClick={resumeQuiz}
                className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md hover:shadow-indigo-200 transition-all"
              >
                继续答题
              </button>
            </div>
          </div>
        </div>
      )}

      {mode === AppMode.HOME && (
        <div className="w-full max-w-4xl space-y-12 animate-in fade-in duration-500">
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight">
              探索你的<br/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                真实人格
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              基于荣格心理学理论与大数据分析，为您提供前所未有的性格洞察。
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 px-4">
            {/* Simple Mode Card */}
            <button
              onClick={() => attemptStartQuiz(QuizType.SIMPLE)}
              className="group relative bg-white p-8 rounded-3xl shadow-xl shadow-indigo-100/50 border-2 border-transparent hover:border-blue-500 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute top-6 right-6 w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                <Zap size={24} />
              </div>
              <div className="text-left space-y-4">
                <h3 className="text-2xl font-bold text-slate-800">简洁版测试</h3>
                <p className="text-slate-500">
                  {QUIZ_CONFIG[QuizType.SIMPLE].description}
                </p>
                <div className="flex items-center gap-2 text-sm font-semibold text-blue-600">
                  开始测试 <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </button>

            {/* Professional Mode Card */}
            <button
              onClick={() => attemptStartQuiz(QuizType.PROFESSIONAL)}
              className="group relative bg-white p-8 rounded-3xl shadow-xl shadow-purple-100/50 border-2 border-transparent hover:border-purple-500 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute top-6 right-6 w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-4">
                <BookOpen size={24} />
              </div>
              <div className="text-left space-y-4">
                <h3 className="text-2xl font-bold text-slate-800">专业版测试</h3>
                <p className="text-slate-500">
                  {QUIZ_CONFIG[QuizType.PROFESSIONAL].description}
                </p>
                <div className="flex items-center gap-2 text-sm font-semibold text-purple-600">
                  开始测评 <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {mode === AppMode.HISTORY && (
        <HistoryView 
          history={historyList}
          onSelect={handleHistorySelect}
          onBack={() => setMode(AppMode.HOME)}
          onClear={handleClearHistory}
        />
      )}

      {mode === AppMode.QUIZ && (
        <Quiz 
          questions={QUIZ_CONFIG[quizType].questions} 
          quizType={quizType}
          initialData={quizInitialData}
          onComplete={handleQuizComplete}
          onBack={() => setMode(AppMode.HOME)}
        />
      )}

      {mode === AppMode.ANALYZING && (
        <Analyzing />
      )}

      {mode === AppMode.RESULT && result && (
        <ResultView 
          result={result} 
          analysis={analysis} 
          onReset={resetApp} 
        />
      )}
    </Layout>
  );
}
