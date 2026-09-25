import React from 'react';
import { BookOpen, RotateCcw, Dna } from 'lucide-react';
import { ChapterId, SectionId } from '../types/genetics';

interface HeaderProps {
  currentChapter: ChapterId;
  currentSection: SectionId;
  onSelectSection: (chapter: ChapterId, section: SectionId) => void;
  onOpenGuide: () => void;
  onResetStage: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentChapter,
  currentSection,
  onSelectSection,
  onOpenGuide,
  onResetStage,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Dna className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 leading-tight">
              유전 가계도 마스터
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block">중3 과학 · 사람의 유전 가계도 인터랙티브 탐구실</p>
          </div>
        </div>

        {/* Zone 2: Navigation links / sections */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => onSelectSection('chapter1', 'autosomal')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              currentChapter === 'chapter1' && currentSection === 'autosomal'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ch 1-A. 상염색체 유전
          </button>
          <button
            onClick={() => onSelectSection('chapter1', 'abo')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              currentChapter === 'chapter1' && currentSection === 'abo'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ch 1-B. ABO식 혈액형
          </button>
          <button
            onClick={() => onSelectSection('chapter2', 'sex_linked')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              currentChapter === 'chapter2' && currentSection === 'sex_linked'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ch 2-A. 반성 유전 (색맹)
          </button>
        </nav>

        {/* Zone 3: Primary action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/80 rounded-lg hover:bg-indigo-100 transition-colors whitespace-nowrap"
            title="유전 분석 핵심 공식 보기"
          >
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>원리 가이드</span>
          </button>
          <button
            onClick={onResetStage}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap"
            title="현재 가계도 다시 풀기"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">다시 풀기</span>
          </button>
        </div>
      </div>

      {/* Mobile navigation bar */}
      <div className="md:hidden flex items-center justify-between px-3 py-2 border-t border-slate-100 bg-slate-50/80 overflow-x-auto gap-1">
        <button
          onClick={() => onSelectSection('chapter1', 'autosomal')}
          className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
            currentChapter === 'chapter1' && currentSection === 'autosomal'
              ? 'bg-indigo-600 text-white font-semibold'
              : 'text-slate-600 bg-white border border-slate-200'
          }`}
        >
          1-A. 상염색체
        </button>
        <button
          onClick={() => onSelectSection('chapter1', 'abo')}
          className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
            currentChapter === 'chapter1' && currentSection === 'abo'
              ? 'bg-indigo-600 text-white font-semibold'
              : 'text-slate-600 bg-white border border-slate-200'
          }`}
        >
          1-B. ABO 혈액형
        </button>
        <button
          onClick={() => onSelectSection('chapter2', 'sex_linked')}
          className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
            currentChapter === 'chapter2' && currentSection === 'sex_linked'
              ? 'bg-indigo-600 text-white font-semibold'
              : 'text-slate-600 bg-white border border-slate-200'
          }`}
        >
          2-A. 적록 색맹
        </button>
      </div>
    </header>
  );
};
