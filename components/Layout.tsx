import React from 'react';
import { Book, FolderHeart, Plus } from 'lucide-react';
import { AppStep } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  step: AppStep;
  onNavigate: (step: AppStep) => void;
  hasProjects: boolean;
}

const steps = [
  { label: 'Upload', id: AppStep.UPLOAD },
  { label: 'Style', id: AppStep.FEATURES },
  { label: 'Generate', id: AppStep.GENERATION },
  { label: 'Refine', id: AppStep.EDITOR },
];

export const Layout: React.FC<LayoutProps> = ({ children, step, onNavigate, hasProjects }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center font-sans">
      {/* Header */}
      <header className="w-full max-w-6xl p-6 flex justify-between items-center border-b border-slate-200 bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-6">
          <button onClick={() => onNavigate(AppStep.UPLOAD)} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm transform -rotate-3 hover:rotate-0 transition-transform duration-300">
               <Book size={20} strokeWidth={2.5} />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Professional<span className="text-blue-600"> CV Photo</span>
            </h1>
          </button>
          
          <div className="h-6 w-[1px] bg-slate-200 hidden md:block"></div>
          
          <nav className="hidden md:flex items-center gap-1">
            <button 
              onClick={() => onNavigate(AppStep.UPLOAD)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${step === AppStep.UPLOAD ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <Plus size={16} /> New Headshot
            </button>
            <button 
              onClick={() => onNavigate(AppStep.LIBRARY)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${step === AppStep.LIBRARY ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <FolderHeart size={16} /> My Library
            </button>
          </nav>
        </div>
        
        {/* Step Indicator */}
        <div className="hidden lg:flex gap-4">
          {steps.map((s, idx) => {
            const isActive = step === s.id;
            const isCompleted = step > s.id && step !== AppStep.LIBRARY;
            return (
              <div key={s.id} className="flex items-center gap-2">
                <div 
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all border-2
                    ${isActive ? 'border-blue-600 bg-blue-600 text-white scale-105' : ''}
                    ${isCompleted ? 'border-blue-600 bg-white text-blue-600' : ''}
                    ${(!isActive && !isCompleted) || step === AppStep.LIBRARY ? 'border-slate-300 bg-slate-100 text-slate-400' : ''}
                  `}
                >
                  {idx + 1}
                </div>
                <span className={`text-sm font-medium ${isActive ? 'text-blue-700' : 'text-slate-500'}`}>
                  {s.label}
                </span>
                {idx < steps.length - 1 && (
                  <div className={`w-8 h-[2px] ${isCompleted ? 'bg-blue-600' : 'bg-slate-200'}`} />
                )}
              </div>
            );
          })}
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-5xl flex-1 p-4 md:p-8 flex flex-col">
        {children}
      </main>

      <footer className="w-full p-6 text-center text-slate-500 text-sm border-t border-slate-200 bg-white mt-auto">
        Powered by Gemini Nano Banana (Flash Image) &bull; Create professional LinkedIn profiles in seconds
      </footer>
    </div>
  );
};