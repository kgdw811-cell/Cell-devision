import React, { useState, useEffect } from 'react';
import { PedigreeNode, Stage } from '../types/genetics';
import { X, CheckCircle2, AlertCircle, Lightbulb, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';

interface GenotypeModalProps {
  node: PedigreeNode | null;
  stage: Stage;
  isSolved: boolean;
  currentAnswer?: string;
  onClose: () => void;
  onCorrectAnswer: (nodeId: string, genotype: string) => void;
}

export const GenotypeModal: React.FC<GenotypeModalProps> = ({
  node,
  stage,
  isSolved,
  currentAnswer,
  onClose,
  onCorrectAnswer,
}) => {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [attemptCount, setAttemptCount] = useState<number>(0);
  const [submissionState, setSubmissionState] = useState<'idle' | 'correct' | 'wrong'>('idle');

  useEffect(() => {
    if (node) {
      setSelectedOption(currentAnswer || '');
      setSubmissionState(isSolved ? 'correct' : 'idle');
      setAttemptCount(0);
    }
  }, [node, isSolved, currentAnswer]);

  if (!node) return null;

  const handleSubmit = () => {
    if (!selectedOption) return;

    const isCorrect = node.correctGenotypes.includes(selectedOption);

    if (isCorrect) {
      setSubmissionState('correct');
      onCorrectAnswer(node.id, selectedOption);
    } else {
      setAttemptCount((prev) => prev + 1);
      setSubmissionState('wrong');
    }
  };

  const handleRetry = () => {
    setSubmissionState('idle');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] break-keep">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 flex items-center justify-center font-bold text-sm shadow-xs ${
                node.sex === 'male' ? 'rounded-lg' : 'rounded-full'
              } ${
                node.isTraitExpressed
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border-2 border-slate-700 text-slate-800'
              }`}
            >
              {node.label}
            </div>
            <div>
              <h2 id="modal-title" className="text-base font-bold text-slate-900">
                {node.label}번 {node.role} (
                {node.sex === 'male' ? '남성' : '여성'})
              </h2>
              <p className="text-xs text-slate-500">
                표현형:{' '}
                <span className="font-semibold text-slate-700">{node.phenotype}</span>
                {stage.sectionId !== 'abo' && node.isTraitExpressed && (
                  <span className="ml-1.5 text-indigo-700 font-semibold">(형질 발현)</span>
                )}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Quick Trait Context */}
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 text-xs text-slate-600 flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-700">{stage.traitName}:</span>{' '}
              <span>{stage.alleleMeaning}</span>
            </div>
            {node.isHomozygousRecessiveOrDirect && (
              <span className="shrink-0 bg-amber-50 text-amber-800 border border-amber-200 text-[11px] px-2 py-0.5 rounded-md font-medium">
                ★ 1순위 추천
              </span>
            )}
          </div>

          {/* Interactive States */}
          {submissionState === 'idle' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  이 사람의 유전자형을 선택하세요:
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {node.options.map((opt) => {
                    const isPicked = selectedOption === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSelectedOption(opt)}
                        className={`p-3.5 rounded-xl border text-sm font-mono font-bold transition-all text-center flex items-center justify-center ${
                          isPicked
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm ring-2 ring-indigo-200'
                            : 'bg-white text-slate-800 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {attemptCount > 0 && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-sm text-amber-800">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    <span>추론 힌트 ({attemptCount}차 시도)</span>
                  </div>
                  <p className="text-sm leading-relaxed font-medium">
                    {attemptCount === 1 ? node.firstAttemptHint : node.secondAttemptHint}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Correct Feedback View */}
          {submissionState === 'correct' && (
            <div className="space-y-4">
              <div className="p-4 sm:p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="font-bold text-base">정답입니다! ({node.canonicalGenotype})</span>
                </div>
                <p className="text-sm sm:text-[15px] leading-relaxed text-emerald-900 font-medium">
                  {node.stepExplanation}
                </p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-sm text-slate-700 flex items-center justify-between">
                <span className="font-semibold">확정된 유전자형:</span>
                <span className="text-lg font-mono font-bold text-slate-900 bg-white px-3.5 py-1 rounded-lg border border-slate-300">
                  {node.canonicalGenotype}
                </span>
              </div>
            </div>
          )}

          {/* Wrong Feedback View */}
          {submissionState === 'wrong' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900">
                <div className="flex items-center gap-2 mb-1.5">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span className="font-bold text-base">다시 한번 생각해볼까요?</span>
                </div>
                <p className="text-sm text-rose-800">
                  선택한 <span className="font-mono font-bold">"{selectedOption}"</span>(은)는
                  가족들의 표현형 및 유전 법칙과 일치하지 않습니다.
                </p>
              </div>

              {/* Step-by-Step Hint Box */}
              <div className="p-4 sm:p-5 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-950 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-sm text-amber-800">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>단계별 역추적 힌트</span>
                </div>
                <p className="text-sm sm:text-[15px] leading-relaxed font-medium">
                  {attemptCount === 1 ? node.firstAttemptHint : node.secondAttemptHint}
                </p>
                {attemptCount >= 2 && (
                  <p className="text-xs sm:text-sm text-amber-800 border-t border-amber-200/80 pt-2.5 mt-2.5">
                    💡 핵심 법칙: 자녀는 부모 양쪽으로부터 대립유전자를 하나씩 물려받습니다.
                    열성(aa, OO, X'Y)인 가족을 먼저 찾으면 부모의 유전자형을 역추적할 수 있습니다.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          {submissionState === 'idle' && (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                닫기
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!selectedOption}
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 shadow-xs"
              >
                <span>정답 확인</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {submissionState === 'correct' && (
            <>
              <div className="text-xs text-slate-500">
                {isSolved ? '이미 확정된 유전자형입니다.' : '가계도에 정답이 반영되었습니다!'}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-all flex items-center gap-1.5 shadow-xs"
              >
                <span>가계도로 돌아가기</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </>
          )}

          {submissionState === 'wrong' && (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
              >
                다른 사람 먼저 풀기
              </button>
              <button
                type="button"
                onClick={handleRetry}
                className="px-5 py-2 text-xs font-bold text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-all flex items-center gap-1.5 shadow-xs"
              >
                <span>다시 시도하기</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
