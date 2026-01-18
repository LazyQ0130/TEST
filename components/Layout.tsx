import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  headerRight?: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children, headerRight }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col items-center">
      <header className="w-full max-w-5xl px-6 py-6 flex justify-end items-center relative z-10">
        <div>
          {headerRight}
        </div>
      </header>
      
      <main className="w-full max-w-4xl px-4 pb-12 flex-grow flex flex-col items-center justify-center">
        {children}
      </main>

      <footer className="w-full py-6 text-center text-slate-400 text-sm">
        Designed by QYF-NJUPT
      </footer>
    </div>
  );
};

export default Layout;