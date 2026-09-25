import React from 'react';
import { Stage } from '../types/genetics';
import { Award, ArrowRight, RotateCcw, CheckCircle2, Trophy, Sparkles, Users } from 'lucide-react';

interface StageCompletedModalProps {
  stage: Stage;
  isOpen: boolean;
  hasNextStage: boolean;
  nextStageTitle?: string;
  onNextStage: () => void;
  onClose: () => void;
  onReset: () => void;
  onResetAll?: () => void;
}

export const StageCompletedModal: React.FC<StageCompletedModalProps> = ({
  stage,
  isOpen,
  hasNextStage,
  nextStageTitle,
  onNextStage,
  onClose,
  onReset,
  onResetAll,
}) => {
  if (!isOpen) return null;

  // Grand Finale Ending Screen when all curriculum stages are completed
  if (!hasNextStage) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in"
        role="dialog"
        aria-modal="true"
      >
        <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-amber-200 overflow-hidden text-center p-6 sm:p-8 space-y-5 animate-scale-up">
          {/* Grand Finale Header */}
          <div className="flex flex-col items-center">
            <div className="relative mb-3">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-linear-to-tr from-amber-400 via-amber-300 to-yellow-200 border-2 border-amber-300 flex items-center justify-center text-amber-900 shadow-lg animate-bounce-short">
                <Trophy className="w-9 h-9 sm:w-11 sm:h-11 text-amber-800" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>

            <span className="text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-100/90 px-3.5 py-1 rounded-full border border-amber-300 mb-2.5">
              🏆 전 단원 마스터 달성
            </span>
            <h2 className="text-xl sm:text-2xl md:text-[26px] font-black text-slate-900 leading-snug whitespace-nowrap">
              모든 가계도 문제를 해결했습니다!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 break-keep">
              상염색체 유전(귓불)부터 복대립 유전(ABO식 혈액형), 반성 유전(적록 색맹)까지 가계도 분석을 모두 완주했습니다.
            </p>
          </div>

          {/* Peer Helping Callout Box */}
          <div className="p-5 rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 text-white text-center space-y-2 shadow-md">
            <div className="inline-flex items-center justify-center gap-2 bg-white/20 backdrop-blur-xs px-3.5 py-1 rounded-full text-xs sm:text-sm font-bold text-emerald-50">
              <Users className="w-4 h-4" />
              <span>함께 배우는 과학 교실</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white leading-snug break-keep tracking-tight">
              아직 문제를 해결하지 못한<br />
              다른 친구들에게 도움을 주세요!
            </h3>
          </div>

          {/* Final Stage Takeaway */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-1.5 shadow-2xs">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>최종 단원 정리: {stage.title}</span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-700 break-keep">
              {stage.summaryTakeaway}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 w-full">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-slate-700 hover:text-slate-950 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors text-center whitespace-nowrap shadow-2xs shrink-0 flex items-center justify-center"
            >
              <span>가계도 계속 살펴보기</span>
            </button>

            <button
              onClick={onResetAll || onReset}
              className="w-full sm:w-auto px-6 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 text-center whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-4 h-4 shrink-0" />
              <span>처음 1단원부터 다시 풀기</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-center p-6 sm:p-7 space-y-5">
        {/* Header Block: Celebration Graphic + Badge + Heading in balanced rhythm */}
        <div className="flex flex-col items-center">
          {/* Celebration Graphic */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-600 shadow-sm animate-bounce-short mb-3">
            <Award className="w-8 h-8 sm:w-9 sm:h-9" />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200 mb-3">
            가계도 분석 완료
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug break-keep">
            축하합니다!<br />
            모든 가족의 유전자형을 밝혔습니다
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">{stage.title}</p>
        </div>

        {/* Takeaway Learning Summary Box */}
        <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-left space-y-2.5 shadow-xs">
          <div className="flex items-center gap-2 font-bold text-base sm:text-lg text-indigo-950">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>핵심 탐구 정리</span>
          </div>
          <p className="text-sm sm:text-[15px] leading-relaxed text-slate-800 font-medium break-keep">
            {stage.summaryTakeaway}
          </p>
        </div>

        {/* Actions: Single-line button text with enlarged horizontal padding within container width */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1 w-full">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-slate-700 hover:text-slate-950 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors text-center whitespace-nowrap shadow-2xs shrink-0 flex items-center justify-center"
          >
            <span>가계도 계속 살펴보기</span>
          </button>

          {hasNextStage ? (
            <button
              onClick={onNextStage}
              className="w-full sm:w-auto px-6 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 text-center whitespace-nowrap shrink-0"
            >
              <span>{nextStageTitle || '다음 단계로 이동'}</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          ) : (
            <button
              onClick={onReset}
              className="w-full sm:w-auto px-6 py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 text-center whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-4 h-4 shrink-0" />
              <span>처음부터 다시 복습하기</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
