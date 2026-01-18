import React from 'react';
import { Loader2 } from 'lucide-react';

const Analyzing: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
      <div className="relative">
        <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
        <Loader2 className="w-16 h-16 text-indigo-600 animate-spin relative z-10" />
      </div>
      <h2 className="mt-8 text-2xl font-bold text-slate-800">正在计算您的性格模型...</h2>
      <p className="mt-2 text-slate-500">正在综合分析各个维度权重</p>
    </div>
  );
};

export default Analyzing;