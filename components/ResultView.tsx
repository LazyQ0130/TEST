
import React from 'react';
import { AssessmentResult, AIAnalysis } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Star, RefreshCw, Home, Download } from 'lucide-react';

interface ResultViewProps {
  result: AssessmentResult;
  analysis: AIAnalysis | null;
  onReset: () => void;
  onHome: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ result, analysis, onReset, onHome }) => {
  
  // --- Render Functions for Specific Chart Types ---
  
  const renderMBTIChart = (data: any) => {
    // Transform MBTI scores to chart data
    const chartData = [
      { name: 'E / I', E: data.percentages.EI, I: 100 - data.percentages.EI },
      { name: 'S / N', S: data.percentages.SN, N: 100 - data.percentages.SN },
      { name: 'T / F', T: data.percentages.TF, F: 100 - data.percentages.TF },
      { name: 'J / P', J: data.percentages.JP, P: 100 - data.percentages.JP },
    ];
    return (
       <div className="h-64 w-full">
         <ResponsiveContainer>
           <BarChart data={chartData} layout="vertical">
             <XAxis type="number" hide domain={[0, 100]} />
             <YAxis dataKey="name" type="category" width={50} tick={{fontSize: 12}} />
             <Tooltip />
             <Bar dataKey="E" stackId="a" fill="#6366f1" />
             <Bar dataKey="I" stackId="a" fill="#e2e8f0" />
           </BarChart>
         </ResponsiveContainer>
         <p className="text-center text-xs text-slate-400 mt-2">Colored bars represent your dominant trait percentage.</p>
       </div>
    );
  };

  const renderHollandChart = (data: any) => {
    const chartData = Object.entries(data.scores).map(([k, v]) => ({ subject: k, A: v }));
    return (
      <div className="h-64 w-full">
        <ResponsiveContainer>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis />
            <Radar name="Holland" dataKey="A" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.6} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderSCL90Chart = (data: any) => {
    const chartData = Object.entries(data.factorScores).map(([k, v]) => ({ name: k, score: v }));
    return (
      <div className="h-64 w-full">
        <ResponsiveContainer>
           <BarChart data={chartData}>
             <XAxis dataKey="name" tick={{fontSize: 10}} interval={0} angle={-45} textAnchor="end" height={60}/>
             <YAxis domain={[0, 5]} />
             <Tooltip />
             <Bar dataKey="score" fill="#10b981">
                {chartData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.score > 3 ? '#ef4444' : '#10b981'} />
                ))}
             </Bar>
           </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderSpiritualChart = (data: any) => {
    const chartData = Object.entries(data.scores).map(([k, v]) => ({ subject: k, A: v }));
    return (
      <div className="h-64 w-full">
        <ResponsiveContainer>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis />
            <Radar name="Spiritual" dataKey="A" stroke="#9333ea" fill="#a855f7" fillOpacity={0.6} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderIQEQContent = (data: any) => (
    <div className="text-center py-8">
      <div className="text-6xl font-black text-slate-800 mb-2">{data.score} <span className="text-2xl text-slate-400 font-normal">/ {data.total}</span></div>
      <div className="text-xl font-bold text-indigo-600 mb-4">{data.level}</div>
      <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden max-w-xs mx-auto">
        <div className="bg-indigo-500 h-full" style={{ width: `${(data.score / data.total) * 100}%` }}></div>
      </div>
      <p className="mt-4 text-slate-500">Percentile: Top {100 - (data.percentile || 50)}%</p>
    </div>
  );

  return (
    <div className="w-full max-w-4xl space-y-8 animate-in slide-in-from-bottom-8 fade-in duration-700">
      
      {/* Header Result */}
      <div className="text-center space-y-4">
        <h3 className="text-slate-500 font-medium uppercase tracking-widest">{result.type} Result</h3>
        
        {result.type === 'MBTI' && <h1 className="text-7xl font-black text-indigo-600">{result.data.type}</h1>}
        {result.type === 'HOLLAND' && <h1 className="text-7xl font-black text-blue-600">{result.data.code}</h1>}
        {result.type === 'SCL90' && (
          <div>
             <h1 className={`text-5xl font-black ${result.data.severity === 'Normal' ? 'text-emerald-500' : 'text-orange-500'}`}>
               {result.data.severity}
             </h1>
             <p className="text-slate-400 mt-2">Severity Level</p>
          </div>
        )}
        {result.type === 'SPIRITUAL' && (
          <h1 className="text-6xl font-black text-purple-600">{result.data.dominant}</h1>
        )}
        
        {analysis && (
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white shadow-sm max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">{analysis.title}</h2>
            <p className="text-slate-600 leading-relaxed">{analysis.summary}</p>
          </div>
        )}
      </div>

      {/* Charts & Data Visualization */}
      <div className="bg-white rounded-3xl p-6 shadow-xl shadow-indigo-100/50 border border-slate-100">
        <h3 className="font-bold text-slate-700 mb-6 border-b border-slate-100 pb-2">数据分析</h3>
        {result.type === 'MBTI' && renderMBTIChart(result.data)}
        {result.type === 'HOLLAND' && renderHollandChart(result.data)}
        {result.type === 'SCL90' && renderSCL90Chart(result.data)}
        {result.type === 'SPIRITUAL' && renderSpiritualChart(result.data)}
        {(result.type === 'IQ' || result.type === 'EQ') && renderIQEQContent(result.data)}
      </div>

      {/* AI Analysis Cards */}
      {analysis && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-indigo-50/50 border border-indigo-100 rounded-3xl p-6">
            <h4 className="font-bold text-indigo-800 mb-4 flex items-center gap-2"><Star size={18}/> 核心特征</h4>
            <ul className="space-y-2">
              {analysis.keyTraits.map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-700 text-sm">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5 shrink-0"/>{t}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-6">
            <h4 className="font-bold text-emerald-800 mb-4 flex items-center gap-2"><Download size={18}/> 建议指南</h4>
            <ul className="space-y-2">
              {analysis.recommendations.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-700 text-sm">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5 shrink-0"/>{r}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="md:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4">深度分析</h4>
            <p className="text-slate-600 text-sm leading-7">
              {analysis.detailedAnalysis}
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-center gap-4 pt-8">
        <button onClick={onHome} className="px-6 py-3 rounded-full border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 flex items-center gap-2">
           <Home size={18} /> 返回首页
        </button>
        <button onClick={onReset} className="px-8 py-3 rounded-full bg-slate-900 text-white font-bold hover:bg-slate-800 shadow-lg flex items-center gap-2">
           <RefreshCw size={18} /> 重新测试
        </button>
      </div>
    </div>
  );
};

export default ResultView;
