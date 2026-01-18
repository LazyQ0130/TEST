import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { MBTIResult, AIAnalysis } from '../types';
import { Brain, Heart, Briefcase, Users, Star } from 'lucide-react';

interface ResultViewProps {
  result: MBTIResult;
  analysis: AIAnalysis | null;
  onReset: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ result, analysis, onReset }) => {
  // Helper to get only the dominant trait bars for a cleaner chart
  const dominantData = [
    { 
      name: result.percentages.EI >= 50 ? '外向 (E)' : '内向 (I)', 
      value: Math.max(result.percentages.EI, 100 - result.percentages.EI),
      fullValue: 100,
      color: '#6366f1'
    },
    { 
      name: result.percentages.SN >= 50 ? '实感 (S)' : '直觉 (N)', 
      value: Math.max(result.percentages.SN, 100 - result.percentages.SN),
      fullValue: 100,
      color: '#ec4899'
    },
    { 
      name: result.percentages.TF >= 50 ? '思考 (T)' : '情感 (F)', 
      value: Math.max(result.percentages.TF, 100 - result.percentages.TF),
      fullValue: 100,
      color: '#3b82f6'
    },
    { 
      name: result.percentages.JP >= 50 ? '判断 (J)' : '感知 (P)', 
      value: Math.max(result.percentages.JP, 100 - result.percentages.JP),
      fullValue: 100,
      color: '#10b981'
    },
  ];

  return (
    <div className="w-full max-w-4xl space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4 animate-in slide-in-from-bottom-8 fade-in duration-700">
        <h3 className="text-slate-500 font-medium tracking-widest uppercase">您的MBTI性格类型</h3>
        <h1 className="text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 drop-shadow-sm">
          {result.type}
        </h1>
        {analysis && (
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-800">{analysis.title}</h2>
            <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed">{analysis.shortDescription}</p>
          </div>
        )}
      </div>

      {/* Dimensional Breakdown */}
      <div 
        className="bg-white rounded-3xl p-8 shadow-xl shadow-indigo-100/50 animate-in slide-in-from-bottom-8 fade-in duration-700 fill-mode-both"
        style={{ animationDelay: '150ms' }}
      >
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Brain size={20} className="text-indigo-500" />
          维度倾向分析
        </h3>
        <div className="h-64 w-full">
           <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dominantData} layout="vertical" margin={{ left: 20, right: 20 }}>
              <XAxis type="number" hide domain={[0, 100]} />
              <YAxis dataKey="name" type="category" width={80} tick={{fill: '#475569', fontSize: 14, fontWeight: 600}} axisLine={false} tickLine={false} />
              <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey="fullValue" barSize={24} radius={[12, 12, 12, 12]} fill="#f1f5f9" stackId="a" isAnimationActive={false} />
              <Bar dataKey="value" barSize={24} radius={[12, 12, 12, 12]} stackId="a" animationDuration={1500} animationBegin={300}>
                {dominantData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Analysis Cards */}
      {analysis && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths */}
          <div 
            className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-6 hover:shadow-lg hover:shadow-emerald-100/50 transition-all duration-300 animate-in slide-in-from-bottom-4 fade-in duration-500 fill-mode-both"
            style={{ animationDelay: '300ms' }}
          >
            <h4 className="text-emerald-700 font-bold mb-4 flex items-center gap-2">
              <Star size={20} />
              核心优势
            </h4>
            <ul className="space-y-2">
              {analysis.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div 
            className="bg-orange-50/50 border border-orange-100 rounded-3xl p-6 hover:shadow-lg hover:shadow-orange-100/50 transition-all duration-300 animate-in slide-in-from-bottom-4 fade-in duration-500 fill-mode-both"
            style={{ animationDelay: '400ms' }}
          >
            <h4 className="text-orange-700 font-bold mb-4 flex items-center gap-2">
              <span className="text-xl leading-none">⚠️</span>
              潜在盲点
            </h4>
            <ul className="space-y-2">
              {analysis.weaknesses.map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 shrink-0" />
                  {w}
                </li>
              ))}
            </ul>
          </div>

          {/* Careers */}
          <div 
            className="bg-blue-50/50 border border-blue-100 rounded-3xl p-6 hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-300 animate-in slide-in-from-bottom-4 fade-in duration-500 fill-mode-both"
            style={{ animationDelay: '500ms' }}
          >
            <h4 className="text-blue-700 font-bold mb-4 flex items-center gap-2">
              <Briefcase size={20} />
              职业发展
            </h4>
            <div className="flex flex-wrap gap-2">
              {analysis.careerPaths.map((c, i) => (
                <span key={i} className="px-3 py-1 bg-white border border-blue-200 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-50 transition-colors">
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Relationships */}
          <div 
            className="bg-pink-50/50 border border-pink-100 rounded-3xl p-6 hover:shadow-lg hover:shadow-pink-100/50 transition-all duration-300 animate-in slide-in-from-bottom-4 fade-in duration-500 fill-mode-both"
            style={{ animationDelay: '600ms' }}
          >
            <h4 className="text-pink-700 font-bold mb-4 flex items-center gap-2">
              <Heart size={20} />
              情感关系
            </h4>
            <p className="text-slate-700 text-sm leading-relaxed">
              {analysis.relationships}
            </p>
          </div>
          
           {/* Famous People */}
           <div 
             className="md:col-span-2 bg-slate-50 border border-slate-200 rounded-3xl p-6 hover:shadow-lg transition-all duration-300 animate-in slide-in-from-bottom-4 fade-in duration-500 fill-mode-both"
             style={{ animationDelay: '700ms' }}
           >
            <h4 className="text-slate-700 font-bold mb-4 flex items-center gap-2">
              <Users size={20} />
              代表人物
            </h4>
             <div className="flex flex-wrap gap-4 justify-center">
              {analysis.famousPeople.map((p, i) => (
                <span key={i} className="text-slate-600 font-medium italic px-4 py-2 bg-white rounded-lg border border-slate-100">
                  “{p}”
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div 
        className="flex justify-center pt-8 animate-in fade-in duration-700 fill-mode-both"
        style={{ animationDelay: '900ms' }}
      >
        <button
          onClick={onReset}
          className="px-8 py-4 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-slate-200"
        >
          重新测试
        </button>
      </div>
    </div>
  );
};

export default ResultView;