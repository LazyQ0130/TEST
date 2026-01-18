import React, { useState, useEffect } from 'react';
import { Question, QuizType } from '../types';
import { ArrowLeft, ArrowRight, CheckCircle, AlertCircle, LayoutGrid, X, HelpCircle, ChevronLeft } from 'lucide-react';
import { saveQuizProgress } from '../services/quizStateService';

interface QuizProps {
  questions: Question[];
  quizType: QuizType;
  initialData?: {
    currentIndex: number;
    answers: Record<number, string>;
  } | null;
  onComplete: (answers: Record<string, number>) => void;
  onBack: () => void;
}

const Quiz: React.FC<QuizProps> = ({ questions, quizType, initialData, onComplete, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(initialData?.currentIndex || 0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>(initialData?.answers || {});
  const [error, setError] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(false);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  // Auto-save progress whenever state changes
  useEffect(() => {
    saveQuizProgress(quizType, currentIndex, selectedAnswers);
  }, [currentIndex, selectedAnswers, quizType]);

  const handleOptionSelect = (value: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
    if (error) setError(null);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const jumpToQuestion = (index: number) => {
    setCurrentIndex(index);
    setShowGrid(false);
    setError(null);
  };

  const handleSubmit = () => {
    // Check for first unanswered question
    const firstUnansweredIndex = questions.findIndex(q => !selectedAnswers[q.id]);

    if (firstUnansweredIndex !== -1) {
      setError(`第 ${firstUnansweredIndex + 1} 题尚未完成，已为您跳转。`);
      setCurrentIndex(firstUnansweredIndex);
      return;
    }

    // Calculate aggregated scores
    const scores: Record<string, number> = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    
    // Create a map for quick question lookup
    const questionMap = new Map(questions.map(q => [q.id, q]));

    Object.entries(selectedAnswers).forEach(([qId, answer]) => {
      const id = parseInt(qId);
      const question = questionMap.get(id);
      
      if (!question) return;

      if (answer === 'NEUTRAL') {
        const [dim1, dim2] = question.dimension.split('') as [string, string];
        scores[dim1] += 0.5;
        scores[dim2] += 0.5;
      } else {
        if (scores[answer] !== undefined) {
          scores[answer]++;
        } else {
          scores[answer] = 1;
        }
      }
    });

    onComplete(scores);
  };

  const isLastQuestion = currentIndex === questions.length - 1;
  const currentAnswer = selectedAnswers[currentQuestion.id];

  return (
    <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      
      {/* Return Home Button */}
      <button 
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-white"
      >
        <ChevronLeft size={20} />
        <span>保存进度并返回首页</span>
      </button>

      {/* Question Grid Modal */}
      {showGrid && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 w-full max-w-2xl shadow-2xl max-h-[80vh] overflow-y-auto flex flex-col">
            <div className="flex justify-between items-center mb-6 shrink-0">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <LayoutGrid size={24} className="text-indigo-600"/>
                题目导航
              </h3>
              <button onClick={() => setShowGrid(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={24} className="text-slate-500" />
              </button>
            </div>
            
            <div className="grid grid-cols-5 sm:grid-cols-8 gap-3 overflow-y-auto p-1">
              {questions.map((q, idx) => {
                const isAnswered = !!selectedAnswers[q.id];
                const isCurrent = idx === currentIndex;
                return (
                  <button
                    key={q.id}
                    onClick={() => jumpToQuestion(idx)}
                    className={`
                      aspect-square rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-200
                      ${isCurrent 
                          ? 'ring-2 ring-indigo-600 ring-offset-2 bg-white text-indigo-600 border-2 border-indigo-50 shadow-md transform scale-105' 
                          : isAnswered
                            ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-200 hover:bg-emerald-200'
                            : 'bg-slate-100 text-slate-400 border-2 border-slate-200 hover:bg-slate-200 hover:text-slate-600'
                      }
                    `}
                  >
                    {idx + 1}
                  </button>
                )
              })}
            </div>
            
            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500 shrink-0 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-emerald-100 border-2 border-emerald-200 rounded-md"></div>
                <span>已完成</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-slate-100 border-2 border-slate-200 rounded-md"></div>
                <span>未完成</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-white border-2 border-indigo-600 rounded-md shadow-sm"></div>
                <span>当前题目</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-200 rounded-full mb-8 overflow-hidden">
        <div 
          className="h-full bg-indigo-600 transition-all duration-300 ease-out" 
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl text-indigo-600 font-medium">
              问题 {currentIndex + 1} <span className="text-slate-400 text-base">/ {questions.length}</span>
            </h2>
            <button 
               onClick={() => setShowGrid(true)}
               className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 hover:shadow-sm rounded-lg transition-all flex items-center gap-2 text-sm font-semibold"
               title="查看题目列表"
             >
               <LayoutGrid size={18} />
               <span className="hidden sm:inline">选题</span>
             </button>
          </div>
          <span className="text-sm text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-full">
            {questions[currentIndex].dimension} 维度
          </span>
        </div>
        
        <h3 className="text-2xl font-bold text-slate-800 mb-8 min-h-[4rem] flex items-center">
          {currentQuestion.text}
        </h3>

        <div className="space-y-3">
          {/* Standard Options */}
          {currentQuestion.options.map((option, idx) => {
             const isSelected = currentAnswer === option.value;
             return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(option.value)}
                className={`w-full group relative p-5 border-2 rounded-2xl transition-all duration-200 text-left flex items-center justify-between
                  ${isSelected 
                    ? 'border-indigo-600 bg-indigo-50 shadow-md' 
                    : 'border-slate-100 bg-white hover:border-indigo-300 hover:shadow-sm'
                  }
                `}
              >
                <span className={`text-lg font-medium ${isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>
                  {option.text}
                </span>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                  ${isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300 group-hover:border-indigo-400'}
                `}>
                  {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                </div>
              </button>
            );
          })}

          {/* Uncertain / Neutral Option */}
          <button
            onClick={() => handleOptionSelect('NEUTRAL')}
            className={`w-full group relative p-4 border-2 rounded-2xl transition-all duration-200 text-center flex items-center justify-center gap-2
              ${currentAnswer === 'NEUTRAL'
                ? 'border-slate-500 bg-slate-100 text-slate-800 shadow-sm'
                : 'border-transparent bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700'
              }
            `}
          >
            <HelpCircle size={18} className={currentAnswer === 'NEUTRAL' ? 'text-slate-800' : 'text-slate-400'} />
            <span className="font-medium">难以决定 / 不确定</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 animate-in shake duration-300">
          <AlertCircle size={20} className="shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-6 border-t border-slate-100 mt-8">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors border border-transparent
            ${currentIndex === 0 
              ? 'text-slate-300 cursor-not-allowed' 
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
        >
          <ArrowLeft size={20} />
          上一题
        </button>

        {isLastQuestion ? (
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all transform active:scale-95 shadow-md"
          >
            提交测试
            <CheckCircle size={20} />
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors shadow-md"
          >
            下一题
            <ArrowRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;