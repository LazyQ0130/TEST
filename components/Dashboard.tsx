
import React, { useState } from 'react';
import { ASSESSMENTS } from '../constants';
import { AssessmentType } from '../types';
import { Play, Clock, Zap, CheckCircle2, X } from 'lucide-react';

interface DashboardProps {
  onSelectAssessment: (type: AssessmentType, version: 'LITE' | 'PRO') => void;
  onViewHistory: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectAssessment, onViewHistory }) => {
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<AssessmentType | null>(null);

  const handleAssessmentClick = (id: AssessmentType) => {
    setSelectedAssessmentId(id);
  };

  const closeSelection = () => {
    setSelectedAssessmentId(null);
  };

  const selectedAssessment = selectedAssessmentId ? ASSESSMENTS[selectedAssessmentId] : null;

  return (
    <div className="w-full max-w-5xl animate-in fade-in duration-500 space-y-12 relative">
      <div className="text-center space-y-6">
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight">
          Lumina
          <span className="block text-2xl md:text-3xl font-normal mt-2 text-slate-500">
             Self-Exploration Platform
          </span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          多维度的自我认知工具。从性格、职业兴趣、心理健康、IQ、EQ、精神需求，全方位探索真实的自己。
        </p>
        <button 
          onClick={onViewHistory}
          className="inline-flex items-center gap-2 px-6 py-2 bg-white text-slate-600 rounded-full font-medium shadow-sm hover:shadow-md hover:text-indigo-600 transition-all border border-slate-200"
        >
          <Clock size={16} />
          查看历史记录
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {Object.values(ASSESSMENTS).map((assessment) => {
          const Icon = assessment.icon;
          return (
            <button
              key={assessment.id}
              onClick={() => handleAssessmentClick(assessment.id)}
              className="group relative bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100 text-left flex flex-col h-full"
            >
              <div className={`w-12 h-12 ${assessment.color} bg-opacity-10 text-opacity-100 rounded-2xl flex items-center justify-center mb-6`}>
                 <div className={`p-3 rounded-xl text-white ${assessment.color}`}>
                   <Icon size={24} />
                 </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                {assessment.title}
              </h3>
              <p className="text-slate-500 text-sm mb-6 flex-grow leading-relaxed">
                {assessment.description}
              </p>
              
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400 border-t border-slate-50 pt-4 w-full mt-auto">
                <span className="flex items-center gap-1">
                  <Clock size={14} /> {assessment.durationLite} - {assessment.durationPro}
                </span>
                <span className="flex items-center gap-1 text-indigo-600 group-hover:translate-x-1 transition-transform">
                  选择版本 <Play size={12} fill="currentColor" />
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Version Selection Modal */}
      {selectedAssessment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={closeSelection} 
              className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
            >
              <X size={20} className="text-slate-600" />
            </button>
            
            <div className={`p-8 ${selectedAssessment.color} text-white`}>
              <selectedAssessment.icon size={48} className="mb-4 opacity-90" />
              <h2 className="text-3xl font-black mb-2">{selectedAssessment.title}</h2>
              <p className="opacity-90">请选择适合您的测评版本</p>
            </div>

            <div className="p-6 space-y-4">
              <button 
                onClick={() => onSelectAssessment(selectedAssessment.id, 'LITE')}
                className="w-full p-4 rounded-2xl border-2 border-slate-100 hover:border-indigo-500 hover:bg-indigo-50 transition-all flex items-center gap-4 group text-left"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Zap size={24} />
                </div>
                <div className="flex-grow">
                   <div className="flex justify-between items-center mb-1">
                     <span className="font-bold text-slate-800 text-lg group-hover:text-indigo-700">简洁版 (Lite)</span>
                     <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-full group-hover:bg-indigo-200 group-hover:text-indigo-700">
                       ~{selectedAssessment.questionsLite.length} 题
                     </span>
                   </div>
                   <p className="text-sm text-slate-500">快速了解概况，适合时间有限或初次体验。</p>
                   <p className="text-xs text-emerald-600 mt-2 font-medium flex items-center gap-1">
                     <Clock size={12}/> 预计用时: {selectedAssessment.durationLite}
                   </p>
                </div>
              </button>

              <button 
                onClick={() => onSelectAssessment(selectedAssessment.id, 'PRO')}
                className="w-full p-4 rounded-2xl border-2 border-slate-100 hover:border-indigo-500 hover:bg-indigo-50 transition-all flex items-center gap-4 group text-left"
              >
                <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={24} />
                </div>
                <div className="flex-grow">
                   <div className="flex justify-between items-center mb-1">
                     <span className="font-bold text-slate-800 text-lg group-hover:text-indigo-700">专业版 (Pro)</span>
                     <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-full group-hover:bg-indigo-200 group-hover:text-indigo-700">
                       ~{selectedAssessment.questionsPro.length} 题
                     </span>
                   </div>
                   <p className="text-sm text-slate-500">深度全面分析，结果更加准确，提供详细报告。</p>
                   <p className="text-xs text-purple-600 mt-2 font-medium flex items-center gap-1">
                     <Clock size={12}/> 预计用时: {selectedAssessment.durationPro}
                   </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
