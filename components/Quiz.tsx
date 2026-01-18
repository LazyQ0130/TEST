
import React, { useState, useEffect } from 'react';
import { Question, Option, AssessmentConfig } from '../types';
import { ArrowLeft, ArrowRight, CheckCircle, AlertCircle, X, HelpCircle, ChevronLeft } from 'lucide-react';
import { saveQuizProgress } from '../services/quizStateService';

interface QuizProps {
  config: AssessmentConfig & { questions: Question[] };
  initialData?: {
    currentIndex: number;
    answers: Record<number, string | number>;
  } | null;
  onComplete: (answers: Record<number, string | number>) => void;
  onBack: () => void;
}

const Quiz: React.FC<QuizProps> = ({ config, initialData, onComplete, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(initialData?.currentIndex || 0);
  const [answers, setAnswers] = useState<Record<number, string | number>>(initialData?.answers || {});
  const [error, setError] = useState<string | null>(null);

  const questions = config.questions;
  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  useEffect(() => {
    // Only save strictly compliant serializable data
    saveQuizProgress(config.id, currentIndex, answers as Record<number, string>); 
  }, [currentIndex, answers, config.id]);

  const handleSelect = (value: string | number) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
    if (currentIndex < questions.length - 1) {
      setTimeout(() => setCurrentIndex(prev => prev + 1), 200); // Auto-advance for smoother UX
    }
    if (error) setError(null);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  const handleSubmit = () => {
    const unanswered = questions.findIndex(q => answers[q.id] === undefined);
    if (unanswered !== -1) {
      setError(`第 ${unanswered + 1} 题尚未完成`);
      setCurrentIndex(unanswered);
      return;
    }
    onComplete(answers);
  };

  const isLast = currentIndex === questions.length - 1;
  const currentVal = answers[currentQuestion.id];

  // Render options based on type (Likert/Binary vs Multiple Choice)
  // We can infer layout: if options > 3, grid or list. If 2, side-by-side or big cards.
  const isBinary = currentQuestion.options.length === 2;
  const isLikert = currentQuestion.options.length === 5 && typeof currentQuestion.options[0].value === 'number';

  return (
    <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button onClick={onBack} className="mb-6 flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors px-3 py-2 rounded-lg hover:bg-white">
        <ChevronLeft size={20} /> <span>返回</span>
      </button>

      {/* Progress */}
      <div className="w-full h-2 bg-slate-200 rounded-full mb-8 overflow-hidden">
        <div className={`h-full ${config.color} transition-all duration-300`} style={{ width: `${progress}%` }} />
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 mb-8 min-h-[400px] flex flex-col">
        <div className="mb-6">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-4 ${config.color} opacity-80`}>
             {config.title} • Q{currentIndex + 1}/{questions.length}
          </span>
          <h2 className="text-2xl font-bold text-slate-800 leading-snug">
            {currentQuestion.text}
          </h2>
        </div>

        <div className={`grid gap-3 ${isBinary ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} flex-grow content-start`}>
          {currentQuestion.options.map((opt, idx) => {
            const isSelected = currentVal === opt.value;
            return (
              <button
                key={idx}
                onClick={() => handleSelect(opt.value)}
                className={`
                  relative p-4 rounded-xl border-2 text-left transition-all duration-200
                  ${isSelected 
                    ? `border-indigo-500 bg-indigo-50 text-indigo-900 shadow-md` 
                    : 'border-slate-100 bg-white text-slate-600 hover:border-indigo-200 hover:bg-slate-50'
                  }
                  ${isLikert ? 'flex items-center justify-between' : ''}
                `}
              >
                <span className="font-medium">{opt.text}</span>
                {isSelected && <CheckCircle size={20} className="text-indigo-600" />}
              </button>
            );
          })}
          
          {/* MBTI specific: Add Neutral only for MBTI type if needed, or if configured in question options. 
              The new generic structure assumes options are passed in. 
              If we want the MBTI 'Neutral' button back, it should be in the options array or handled here conditionally.
              For simplicity in this generic version, we assume 'Neutral' logic is either part of options or we add a special button for MBTI.
          */}
          {config.id === 'MBTI' && (
             <button
                onClick={() => handleSelect('NEUTRAL')}
                className={`p-4 rounded-xl border-2 text-center transition-all duration-200 mt-2
                  ${currentVal === 'NEUTRAL'
                    ? 'border-slate-400 bg-slate-100 text-slate-800'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                  }
                `}
             >
               <span className="text-sm font-medium flex items-center justify-center gap-2">
                 <HelpCircle size={16}/> 难以决定 / 中立
               </span>
             </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 animate-in shake">
          <AlertCircle size={20} /> {error}
        </div>
      )}

      <div className="flex justify-between">
        <button onClick={handlePrev} disabled={currentIndex === 0} className="px-6 py-3 rounded-xl text-slate-500 hover:bg-slate-100 disabled:opacity-50">
          <ArrowLeft size={20} />
        </button>
        {isLast ? (
          <button onClick={handleSubmit} className={`px-8 py-3 ${config.color} text-white rounded-xl font-bold shadow-lg hover:opacity-90 transition-transform active:scale-95`}>
            查看结果
          </button>
        ) : (
          <button onClick={handleNext} className="px-6 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800">
            <ArrowRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;
