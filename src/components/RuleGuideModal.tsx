import React, { useState } from 'react';
import { X, BookOpen, Check, Sparkles, ChevronRight } from 'lucide-react';
import { SectionId } from '../types/genetics';

interface RuleGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: SectionId;
}

export const RuleGuideModal: React.FC<RuleGuideModalProps> = ({
  isOpen,
  onClose,
  activeSection,
}) => {
  const [activeTab, setActiveTab] = useState<SectionId>(activeSection);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="guide-title"
    >
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh] break-keep">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 id="guide-title" className="text-base font-bold text-slate-900">
                중3 과학 유전 가계도 필수 공식
              </h2>
              <p className="text-xs text-slate-500">교과서 핵심 개념과 100% 통하는 3단계 역추적 비법</p>
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

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-200 bg-slate-50/50 p-2 gap-1.5">
          <button
            onClick={() => setActiveTab('autosomal')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors text-center ${
              activeTab === 'autosomal'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1. 상염색체 유전 (귓불)
          </button>
          <button
            onClick={() => setActiveTab('abo')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors text-center ${
              activeTab === 'abo'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            2. 복대립 유전 (ABO)
          </button>
          <button
            onClick={() => setActiveTab('sex_linked')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors text-center ${
              activeTab === 'sex_linked'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            3. 반성 유전 (적록 색맹)
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-xs sm:text-sm">
          {activeTab === 'autosomal' && (
            <div className="space-y-4">
              <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-100 text-indigo-950 space-y-1">
                <span className="text-xs font-bold text-indigo-700">핵심 정리</span>
                <h3 className="text-sm font-bold">"부모에게 없던 형질이 자녀에게 나오면, 자녀가 열성(aa)!"</h3>
                <p className="text-xs text-indigo-800">
                  부모 둘 다 분리형인데 부착형 자녀가 태어났다면, 부착형이 열성이고 부모는 열성 인자(a)를 숨기고 있던 것입니다.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-xs">상염색체 가계도 3단계 정복 순서:</h4>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">우열 관계 판별</h5>
                    <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed">
                      표현형이 같은 부모에게서 다른 표현형의 자녀가 나왔는지 확인합니다. 자녀의 형질이 <strong>열성</strong>, 부모의 형질이 <strong>우성</strong>입니다.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">열성 순종(aa) 먼저 찾아서 표시 ★</h5>
                    <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed">
                      열성 형질은 대립유전자가 <span className="font-mono font-bold text-indigo-700">aa</span> 한 가지뿐입니다. 색칠된 사람들을 모두 <strong>aa</strong>로 먼저 적어둡니다.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">부모와 자녀 간에 a를 역추적</h5>
                    <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed">
                      자녀의 aa 중 하나는 아버지, 하나는 어머니로부터 옵니다. 따라서 우성인 부모는 무조건 <strong>Aa(잡종)</strong>가 됩니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'abo' && (
            <div className="space-y-4">
              <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-100 text-indigo-950 space-y-1">
                <span className="text-xs font-bold text-indigo-700">핵심 정리</span>
                <h3 className="text-sm sm:text-base font-bold">"O형(OO)과 AB형(AB)은 유전자형이 1가지로 즉시 확정!"</h3>
                <p className="text-xs sm:text-sm text-indigo-800 leading-relaxed">
                  A와 B는 O에 대해 우성이고, A와 B 사이에는 우열이 없어 공동우성입니다.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">ABO 혈액형 가계도 분석 3단계 공식:</h4>
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">O형(OO)과 AB형(AB) 먼저 채우기 ★</h5>
                    <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed">
                      O형은 열성 순종이므로 무조건 <strong>OO</strong>, AB형은 <strong>AB</strong>입니다. 이 사람들을 먼저 적는 것이 가계도 분석의 출발점입니다.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">O형(OO) 가족을 통한 역추적</h5>
                    <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed">
                      자녀가 O형(OO)이면 부모는 모두 O를 최소 1개씩 보유하고 있어야 하므로, A형 부모는 <strong>AO</strong>, B형 부모는 <strong>BO</strong>가 됩니다.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">AB형(AB) 가족을 통한 단서</h5>
                    <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed">
                      AB형 부모는 자녀에게 A 또는 B 중 하나를 반드시 물려주므로, AB형 부모에게서는 O형 자녀가 태어날 수 없습니다!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sex_linked' && (
            <div className="space-y-4">
              <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-100 text-indigo-950 space-y-1">
                <span className="text-xs font-bold text-indigo-700">핵심 정리</span>
                <h3 className="text-sm sm:text-base font-bold">남자는 표현형만으로 유전자형 즉시 100% 확정!</h3>
                <p className="text-xs sm:text-sm text-indigo-800 leading-relaxed">
                  적록 색맹 유전자는 X 염색체에 있습니다. 남성은 성염색체가 XY이므로 정상은 <strong>XY</strong>, 색맹은 <strong>X'Y</strong>로 고민 없이 바로 기록합니다.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">적록 색맹(반성 유전) 필승 3단계 공식:</h4>
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">모든 남성과 색맹 여성 먼저 확정 ★</h5>
                    <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed">
                      정상 남성 = <strong>XY</strong>, 색맹 남성 = <strong>X'Y</strong>, 색맹 여성 = <strong>X'X'</strong>로 바로 적습니다.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">색맹 아들(X'Y)의 어머니 역추적</h5>
                    <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed">
                      아들의 Y는 아버지가 줬으므로 X'는 어머니에게서 온 것입니다. 정상 어머니는 반드시 <strong>보인자(XX')</strong>입니다.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs">아버지와 딸의 연결 관계</h5>
                    <p className="text-xs text-slate-600 mt-0.5">
                      아버지는 딸에게 X염색체를 줍니다. 따라서 아버지가 색맹(X'Y)이면 모든 딸은 최소한 X'를 하나 물려받게 됩니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-xs"
          >
            이해했습니다 · 문제 풀러 가기
          </button>
        </div>
      </div>
    </div>
  );
};
