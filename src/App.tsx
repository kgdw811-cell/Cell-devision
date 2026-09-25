import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { PedigreeChart } from './components/PedigreeChart';
import { GenotypeModal } from './components/GenotypeModal';
import { StageCompletedModal } from './components/StageCompletedModal';
import { RuleGuideModal } from './components/RuleGuideModal';
import { STAGES_DATA } from './data/curriculumData';
import { ChapterId, SectionId, PedigreeNode, Stage } from './types/genetics';
import {
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ChevronRight,
  BookOpen,
  Award,
  Layers,
  Trophy,
  RotateCcw,
} from 'lucide-react';

export default function App() {
  const [currentChapter, setCurrentChapter] = useState<ChapterId>('chapter1');
  const [currentSection, setCurrentSection] = useState<SectionId>('autosomal');
  const [currentStageNumber, setCurrentStageNumber] = useState<1 | 2>(1);

  // Stage view mode: 'formula' (전 단계: 분석 공식 집중 학습) vs 'practice' (가계도 문제 풀기)
  const [stageViewMode, setStageViewMode] = useState<'formula' | 'practice'>('formula');

  // Solved state: stageId -> { [nodeId]: canonicalGenotype }
  const [solvedByStage, setSolvedByStage] = useState<{ [stageId: string]: { [nodeId: string]: string } }>({});

  // Active interaction modals
  const [activeModalNode, setActiveModalNode] = useState<PedigreeNode | null>(null);
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState<boolean>(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState<boolean>(false);

  // When chapter, section, or stage changes, close all modals and start with the formula step first
  useEffect(() => {
    setActiveModalNode(null);
    setIsCompletionModalOpen(false);
    setStageViewMode('formula');
  }, [currentChapter, currentSection, currentStageNumber]);

  // Find active stage
  const currentStage: Stage = useMemo(() => {
    const found = STAGES_DATA.find(
      (s) =>
        s.chapterId === currentChapter &&
        s.sectionId === currentSection &&
        s.stageNumber === currentStageNumber
    );
    return found || STAGES_DATA[0];
  }, [currentChapter, currentSection, currentStageNumber]);

  // Solved nodes for current stage
  const currentSolvedNodes = useMemo(() => {
    return solvedByStage[currentStage.id] || {};
  }, [solvedByStage, currentStage.id]);

  const solvedCount = Object.keys(currentSolvedNodes).length;
  const totalCount = currentStage.nodes.length;
  const isCurrentStageCompleted = totalCount > 0 && solvedCount === totalCount;
  const progressPercent = Math.round((solvedCount / totalCount) * 100);

  // Switch chapter/section
  const handleSelectSection = (chapter: ChapterId, section: SectionId) => {
    setCurrentChapter(chapter);
    setCurrentSection(section);
    setCurrentStageNumber(1);
    setActiveModalNode(null);
    setIsCompletionModalOpen(false);
  };

  // Node click in pedigree
  const handleNodeClick = (node: PedigreeNode) => {
    setActiveModalNode(node);
  };

  // Correct answer handler
  const handleCorrectAnswer = (nodeId: string, _genotype: string) => {
    const targetNode = currentStage.nodes.find((n) => n.id === nodeId);
    if (!targetNode) return;

    setSolvedByStage((prev) => {
      const current = prev[currentStage.id] || {};
      const updated = {
        ...current,
        [nodeId]: targetNode.canonicalGenotype,
      };

      // Check if all nodes are solved
      if (Object.keys(updated).length === currentStage.nodes.length) {
        setTimeout(() => {
          setActiveModalNode(null); // Ensure question modal is closed before completion modal
          setIsCompletionModalOpen(true);
        }, 600);
      }

      return {
        ...prev,
        [currentStage.id]: updated,
      };
    });
  };

  // Reset stage
  const handleResetStage = () => {
    setSolvedByStage((prev) => ({
      ...prev,
      [currentStage.id]: {},
    }));
    setActiveModalNode(null);
    setIsCompletionModalOpen(false);
  };

  // Reset entire curriculum back to Chapter 1 Stage 1
  const handleResetAll = () => {
    setSolvedByStage({});
    setCurrentChapter('chapter1');
    setCurrentSection('autosomal');
    setCurrentStageNumber(1);
    setActiveModalNode(null);
    setIsCompletionModalOpen(false);
  };

  // Next stage navigation logic
  const handleNextStage = () => {
    setActiveModalNode(null); // Completely close any question dialog
    setIsCompletionModalOpen(false);
    if (currentStageNumber === 1) {
      setCurrentStageNumber(2);
    } else {
      // Completed Stage 2 of this section, move to next section
      if (currentSection === 'autosomal') {
        setCurrentSection('abo');
        setCurrentStageNumber(1);
      } else if (currentSection === 'abo') {
        setCurrentChapter('chapter2');
        setCurrentSection('sex_linked');
        setCurrentStageNumber(1);
      } else {
        // All completed!
        handleResetAll();
      }
    }
  };

  // Compute next stage title
  const nextStageInfo = useMemo(() => {
    if (currentStageNumber === 1) {
      return { hasNext: true, title: '2단계 (심화 3대 가계도)로 이동' };
    }
    if (currentSection === 'autosomal') {
      return { hasNext: true, title: '제1장 B절: ABO식 혈액형으로 이동' };
    }
    if (currentSection === 'abo') {
      return { hasNext: true, title: '제2장 A절: 적록 색맹(반성 유전)으로 이동' };
    }
    return { hasNext: false, title: '모든 단원 완료' };
  }, [currentStageNumber, currentSection]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Header */}
      <Header
        currentChapter={currentChapter}
        currentSection={currentSection}
        onSelectSection={handleSelectSection}
        onOpenGuide={() => setIsGuideModalOpen(true)}
        onResetStage={handleResetStage}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Navigation Breadcrumbs & Stage Selector */}
        <section className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Left: Chapter / Section Hierarchy */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700">
                <span>
                  {currentChapter === 'chapter1'
                    ? '제1장. 상염색체 및 복대립 유전'
                    : '제2장. 성염색체 유전'}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-600">
                  {currentSection === 'autosomal'
                    ? 'A절. 상염색체 유전 (귓불)'
                    : currentSection === 'abo'
                    ? 'B절. 복대립 유전 (ABO 혈액형)'
                    : 'A절. 반성 유전 (적록 색맹)'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug break-keep">
                {currentStage.title}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-1 break-keep">
                {currentStage.subtitle}
              </p>
            </div>

            {/* Right: Stage Tabs & Mode Toggle */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Stage Step Indicator: 공식 학습 vs 가계도 실전 풀이 */}
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setStageViewMode('formula')}
                  className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap flex items-center justify-center gap-1.5 ${
                    stageViewMode === 'formula'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>1. 공식 익히기</span>
                </button>
                <button
                  onClick={() => setStageViewMode('practice')}
                  className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap flex items-center justify-center gap-1.5 ${
                    stageViewMode === 'practice'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>2. 가계도 실전 풀이</span>
                </button>
              </div>

              {/* Stage Level Segmented Control */}
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => {
                    setActiveModalNode(null);
                    setCurrentStageNumber(1);
                  }}
                  className={`flex-1 sm:flex-none px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center justify-center gap-1.5 ${
                    currentStageNumber === 1
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>기초 2대</span>
                </button>
                <button
                  onClick={() => {
                    setActiveModalNode(null);
                    setCurrentStageNumber(2);
                  }}
                  className={`flex-1 sm:flex-none px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center justify-center gap-1.5 ${
                    currentStageNumber === 2
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>심화 3대</span>
                </button>
              </div>

              {/* Progress Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 flex items-center gap-3">
                <div className="text-xs">
                  <div className="text-[11px] text-slate-500">진행도</div>
                  <div className="font-bold font-mono text-slate-900 tabular-nums">
                    {solvedCount} / {totalCount}명 ({progressPercent}%)
                  </div>
                </div>
                <div className="w-14 bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STEP 1: Standalone Genetic Analysis Formula Screen */}
        {stageViewMode === 'formula' && (
          <section className="bg-white rounded-2xl border border-indigo-200 shadow-sm p-6 sm:p-8 space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Sparkles className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-indigo-700 uppercase tracking-wider bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                      전 단계: 핵심 공식 선행 학습
                    </span>
                    <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                      {currentStage.stageNumber === 1 ? '기초 2대 가계도' : '심화 3대 가계도'}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
                    {currentStage.ruleGuide.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-3 self-start md:self-auto">
                <button
                  onClick={() => setIsGuideModalOpen(true)}
                  className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 bg-indigo-50/80 px-3.5 py-2.5 rounded-xl border border-indigo-200"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>전체 공식 사전</span>
                </button>
              </div>
            </div>

            {/* Core Principle Callout */}
            <div className="bg-gradient-to-r from-indigo-50 via-slate-50 to-blue-50 border-l-4 border-indigo-600 p-4 sm:p-5 rounded-r-2xl">
              <div className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-1">
                📌 이 가계도의 핵심 분석 원리
              </div>
              <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                "{currentStage.ruleGuide.corePrinciple}"
              </p>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                대립유전자 표기: <span className="font-semibold text-slate-800">{currentStage.alleleMeaning}</span>
              </p>
            </div>

            {/* 3 Large Separated Formula Step Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
              {currentStage.ruleGuide.steps.map((st) => (
                <div
                  key={st.order}
                  className="bg-slate-50/60 hover:bg-white border-2 border-slate-200 hover:border-indigo-400 rounded-2xl p-5 shadow-xs transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-black bg-indigo-600 text-white shadow-xs">
                        {st.badge || `${st.order}단계`}
                      </span>
                      <span className="text-sm font-mono font-black text-indigo-400">
                        STEP 0{st.order}
                      </span>
                    </div>

                    <h4 className="text-lg sm:text-xl font-black text-slate-900 leading-snug mb-2.5 break-keep">
                      {st.heading}
                    </h4>

                    <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-normal break-keep">
                      {st.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button: '문제 풀러 가기' */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
              <div className="text-xs sm:text-sm text-slate-600 flex items-center gap-2 break-keep">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span>공식을 충분히 읽으셨다면 가계도로 이동하여 직접 각 인물의 유전자형을 추론해보세요.</span>
              </div>

              <button
                onClick={() => setStageViewMode('practice')}
                className="w-full sm:w-auto px-8 py-3.5 text-base font-black text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 shrink-0 whitespace-nowrap"
              >
                <span>문제 풀러 가기</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </section>
        )}

        {/* STEP 2: Pedigree Practice Screen */}
        {stageViewMode === 'practice' && (
          <section className="space-y-4 animate-fade-in">
            {/* Quick Helper Banner to Re-check formula */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-indigo-50/80 border border-indigo-200 rounded-xl px-4 py-3">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-indigo-950 break-keep">
                  공식 핵심 요약: {currentStage.ruleGuide.corePrinciple}
                </span>
              </div>
              <button
                onClick={() => setStageViewMode('formula')}
                className="text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-white border border-indigo-200 px-3 py-1.5 rounded-lg shadow-xs transition-colors self-start sm:self-auto shrink-0 flex items-center gap-1.5 whitespace-nowrap"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>공식 다시 읽기</span>
              </button>
            </div>

            <PedigreeChart
              stage={currentStage}
              solvedNodes={currentSolvedNodes}
              onNodeClick={handleNodeClick}
              selectedNodeId={activeModalNode ? activeModalNode.id : null}
            />

            {/* Next Stage Unlocked Banner (visible when finished) */}
            {isCurrentStageCompleted && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in shadow-xs">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${nextStageInfo.hasNext ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'} flex items-center justify-center shrink-0 shadow-xs`}>
                    {nextStageInfo.hasNext ? <CheckCircle2 className="w-6 h-6" /> : <Trophy className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-emerald-950 break-keep">
                      {nextStageInfo.hasNext
                        ? '모든 가족의 유전자형을 정확하게 확정했습니다!'
                        : '🏆 모든 챕터 완주! 가계도 유전 마스터를 달성했습니다!'}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-emerald-800 break-keep mt-0.5 font-medium">
                      {nextStageInfo.hasNext
                        ? currentStage.summaryTakeaway
                        : '아직 문제를 해결하지 못한 다른 친구들에게 도움을 주세요!'}
                    </p>
                  </div>
                </div>

                {nextStageInfo.hasNext ? (
                  <button
                    onClick={handleNextStage}
                    className="w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 shrink-0 whitespace-nowrap"
                  >
                    <span>{nextStageInfo.title}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
                    <button
                      onClick={() => setIsCompletionModalOpen(true)}
                      className="w-full sm:w-auto px-4 py-2.5 text-xs sm:text-sm font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1.5 whitespace-nowrap"
                    >
                      <Trophy className="w-4 h-4 text-amber-700" />
                      <span>완주 축하 엔딩 보기</span>
                    </button>
                    <button
                      onClick={handleResetAll}
                      className="w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 shrink-0 whitespace-nowrap"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>처음부터 다시 복습하기</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>중학교 3학년 과학 교육과정 · 사람의 유전 및 가계도 분석</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>상염색체 유전</span>
            <span>·</span>
            <span>복대립 유전</span>
            <span>·</span>
            <span>반성 유전</span>
          </div>
        </div>
      </footer>

      {/* Interactive Modals */}
      <GenotypeModal
        node={activeModalNode}
        stage={currentStage}
        isSolved={activeModalNode ? Boolean(currentSolvedNodes[activeModalNode.id]) : false}
        currentAnswer={activeModalNode ? currentSolvedNodes[activeModalNode.id] : undefined}
        onClose={() => setActiveModalNode(null)}
        onCorrectAnswer={handleCorrectAnswer}
      />

      <StageCompletedModal
        stage={currentStage}
        isOpen={isCompletionModalOpen}
        hasNextStage={nextStageInfo.hasNext}
        nextStageTitle={nextStageInfo.title}
        onNextStage={handleNextStage}
        onClose={() => setIsCompletionModalOpen(false)}
        onReset={handleResetStage}
        onResetAll={handleResetAll}
      />

      <RuleGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        activeSection={currentSection}
      />
    </div>
  );
}
