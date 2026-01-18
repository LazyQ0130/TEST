
import React, { ReactNode } from 'react';
import { Sparkles } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  headerRight?: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children, headerRight }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col items-center">
      <header className="w-full max-w-5xl px-6 py-6 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-2 cursor-pointer select-none">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <Sparkles size={24} />
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Lumina MBTI
          </span>
        </div>
        <div>
          {headerRight}
        </div>
      </header>
      
      <main className="w-full max-w-4xl px-4 pb-12 flex-grow flex flex-col items-center justify-center">
        {children}
      </main>

      <footer className="w-full py-6 text-center text-slate-400 text-sm">
        © {new Date().getFullYear()} Lumina MBTI. Powered by Google Gemini.
      </footer>
    </div>
  );
};

export default Layout;
