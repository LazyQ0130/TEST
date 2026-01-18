
import React from 'react';
import { HistoryItem, AssessmentResult } from '../types';
import { Clock, Trash2, ArrowRight, ChevronLeft, Calendar } from 'lucide-react';

interface HistoryViewProps {
  history: HistoryItem[];
  onSelect: (result: AssessmentResult) => void;
  onBack: () => void;
  onClear: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, onSelect, onBack, onClear }) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="w-full max-w-4xl animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-white/50"
        >
          <ChevronLeft size={20} />
          返回首页
        </button>
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Clock className="text-indigo-600" />
          测评记录
        </h2>
        <div className="w-24"></div> {/* Spacer for centering */}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
            <Calendar size={40} />
          </div>
          <h3 className="text-xl font-medium text-slate-600 mb-2">暂无历史记录</h3>
          <p className="text-slate-400">完成一次测试后，结果将自动保存在这里。</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-end mb-2">
             <button 
              onClick={() => {
                if(window.confirm('确定要清空所有历史记录吗？')) {
                  onClear();
                }
              }}
              className="text-sm text-red-400 hover:text-red-600 flex items-center gap-1 transition-colors px-3 py-1 rounded hover:bg-red-50"
            >
              <Trash2 size={14} />
              清空记录
            </button>
          </div>
          
          <div className="grid gap-4">
            {history.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelect(item.result)}
                className="w-full bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-indigo-200 transition-all group text-left relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-500"></div>
                
                <div className="relative flex justify-between items-center">
                  <div>
                    <div className="flex items-baseline gap-3 mb-2">
                      <h3 className="text-3xl font-black text-indigo-600 tracking-tight">
                        {item.result.type === 'MBTI' ? item.result.data.type : 
                         item.result.type === 'SPIRITUAL' ? item.result.data.dominant :
                         item.result.type}
                      </h3>
                      <span className="text-sm text-slate-400 font-medium">
                        {formatDate(item.timestamp)}
                      </span>
                    </div>
                    
                    <div className="flex gap-4 text-xs font-semibold text-slate-500">
                      {item.result.type === 'MBTI' && (
                        <>
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                            {item.result.data.percentages.EI > 50 ? '外向' : '内向'} {Math.max(item.result.data.percentages.EI, 100 - item.result.data.percentages.EI)}%
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                            {item.result.data.percentages.SN > 50 ? '实感' : '直觉'} {Math.max(item.result.data.percentages.SN, 100 - item.result.data.percentages.SN)}%
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            {item.result.data.percentages.TF > 50 ? '思考' : '情感'} {Math.max(item.result.data.percentages.TF, 100 - item.result.data.percentages.TF)}%
                          </div>
                          <div className="flex items-center gap-1">
                             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            {item.result.data.percentages.JP > 50 ? '判断' : '感知'} {Math.max(item.result.data.percentages.JP, 100 - item.result.data.percentages.JP)}%
                          </div>
                        </>
                      )}
                      {item.result.type === 'HOLLAND' && (
                        <span>Code: {item.result.data.code}</span>
                      )}
                      {item.result.type === 'SCL90' && (
                        <span>Severity: {item.result.data.severity}</span>
                      )}
                      {(item.result.type === 'IQ' || item.result.type === 'EQ') && (
                        <span>Level: {item.result.data.level}</span>
                      )}
                      {item.result.type === 'SPIRITUAL' && (
                        <div className="flex gap-2">
                           {Object.entries(item.result.data.scores).map(([k, v]) => (
                             <span key={k}>{k}: {v}</span>
                           ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-indigo-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all">
                    <ArrowRight size={24} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryView;
