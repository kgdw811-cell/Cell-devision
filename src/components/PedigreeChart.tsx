import React, { useState, useMemo } from 'react';
import { PedigreeNode, Stage } from '../types/genetics';
import { Check, Sparkles, Maximize2, ZoomIn } from 'lucide-react';

interface PedigreeChartProps {
  stage: Stage;
  solvedNodes: { [nodeId: string]: string };
  onNodeClick: (node: PedigreeNode) => void;
  selectedNodeId: string | null;
}

export const PedigreeChart: React.FC<PedigreeChartProps> = ({
  stage,
  solvedNodes,
  onNodeClick,
  selectedNodeId,
}) => {
  const [viewMode, setViewMode] = useState<'fit' | 'zoom'>('fit');

  const nodeMap = useMemo(() => {
    const map = new Map<string, PedigreeNode>();
    stage.nodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [stage.nodes]);

  // Dynamically compute optimal viewBox and generation coordinates to eliminate wasteful padding
  const layoutMetrics = useMemo(() => {
    if (!stage.nodes.length) {
      return {
        viewBox: stage.svgViewBox || '0 0 800 600',
        genBadgeX: 16,
        viewMinX: 0,
        viewMaxX: 800,
        gen1Y: 100,
        gen2Y: 300,
        gen3Y: 500,
        hasGen3: false,
      };
    }

    const nodeXValues = stage.nodes.map((n) => n.x);
    const nodeYValues = stage.nodes.map((n) => n.y);
    const minNodeX = Math.min(...nodeXValues);
    const maxNodeX = Math.max(...nodeXValues);
    const minNodeY = Math.min(...nodeYValues);
    const maxNodeY = Math.max(...nodeYValues);

    const gen1Y = stage.nodes.find((n) => n.generation === 1)?.y ?? 100;
    const gen2Y = stage.nodes.find((n) => n.generation === 2)?.y ?? 300;
    const gen3Y = stage.nodes.find((n) => n.generation === 3)?.y ?? 500;
    const hasGen3 = stage.nodes.some((n) => n.generation === 3);

    // Generation badge X coordinate on the left side with safe breathing room
    const genBadgeX = 14;

    // View boundaries
    const viewMinX = 0;
    // Cover the rightmost node + node radius + external info width + safety margin
    const viewMaxX = Math.max(maxNodeX + 75, 680);
    const width = Math.ceil(viewMaxX - viewMinX);

    // Vertical boundaries: top padding for haloes, bottom padding for status pills
    const viewMinY = Math.max(16, minNodeY - 48);
    const viewMaxY = maxNodeY + 86;
    const height = Math.ceil(viewMaxY - viewMinY);

    return {
      viewBox: `${viewMinX} ${viewMinY} ${width} ${height}`,
      genBadgeX,
      viewMinX,
      viewMaxX,
      viewMinY,
      viewMaxY,
      gen1Y,
      gen2Y,
      gen3Y,
      hasGen3,
    };
  }, [stage.nodes, stage.svgViewBox]);

  const {
    viewBox,
    genBadgeX,
    viewMinX,
    viewMaxX,
    gen1Y,
    gen2Y,
    gen3Y,
    hasGen3,
  } = layoutMetrics;

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-xs p-3.5 sm:p-6 flex flex-col">
      {/* Top Legend and Controls Header */}
      <div className="flex flex-col gap-4 pb-4 mb-4 border-b border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Legend Title & Symbol Guide */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tight shrink-0 whitespace-nowrap">
                기호 안내:
              </span>
              <div className="h-5 w-0.5 bg-slate-300 rounded-full" />
              <span className="text-xs sm:text-sm font-semibold text-slate-600">
                {stage.sectionId === 'abo' ? '성별 및 혈액형 표현' : '도형과 색상으로 표현형 구분'}
              </span>
            </div>

            {stage.sectionId === 'abo' ? (
              /* ABO Blood Type Legend: Only Male/Female with white shapes */
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-0.5">
                <div className="flex items-center gap-2 whitespace-nowrap">
                  <span className="w-6 h-6 border-[2.5px] border-slate-700 bg-white rounded-md inline-block shadow-xs shrink-0" />
                  <span className="text-sm sm:text-base font-bold text-slate-800">남성 (□)</span>
                </div>
                <div className="flex items-center gap-2 whitespace-nowrap">
                  <span className="w-6 h-6 border-[2.5px] border-slate-700 bg-white rounded-full inline-block shadow-xs shrink-0" />
                  <span className="text-sm sm:text-base font-bold text-slate-800">여성 (○)</span>
                </div>
                <span className="text-xs sm:text-sm text-slate-500 font-medium">
                  * 모든 가족의 표현형(A형, B형, AB형, O형)은 각 도형 아래에 표시됩니다.
                </span>
              </div>
            ) : (
              /* Autosomal / Sex-linked Legend: 2-row layout without quotes */
              <div className="flex flex-col gap-2 pt-0.5">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <span className="w-6 h-6 border-[2.5px] border-slate-700 bg-white rounded-md inline-block shadow-xs shrink-0" />
                    <span className="text-sm sm:text-base font-bold text-slate-800">정상 남성</span>
                  </div>
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <span className="w-6 h-6 border-[2.5px] border-slate-700 bg-white rounded-full inline-block shadow-xs shrink-0" />
                    <span className="text-sm sm:text-base font-bold text-slate-800">정상 여성</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <span className="w-6 h-6 border-[2.5px] border-slate-950 bg-slate-900 rounded-md inline-block shadow-xs shrink-0" />
                    <span className="text-sm sm:text-base font-black text-slate-950">형질 발현 남성</span>
                  </div>
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <span className="w-6 h-6 border-[2.5px] border-slate-950 bg-slate-900 rounded-full inline-block shadow-xs shrink-0" />
                    <span className="text-sm sm:text-base font-black text-slate-950">형질 발현 여성</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action / Helper Controls */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
            {/* Clue tip banner */}
            <div className="flex items-center gap-1.5 text-indigo-900 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-xl shadow-xs text-xs sm:text-sm font-bold whitespace-nowrap">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>별표(★) 표시부터 풀면 쉬워집니다!</span>
            </div>

            {/* Responsive View Mode Segmented Switch */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode('fit')}
                className={`px-2.5 sm:px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  viewMode === 'fit'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="작은 화면에서도 가계도 전체가 한눈에 들어오도록 화면 너비에 맞춥니다"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>한눈에 맞춤</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('zoom')}
                className={`px-2.5 sm:px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  viewMode === 'zoom'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="가계도를 큰 배율로 확대하여 좌우로 스크롤하며 확인합니다"
              >
                <ZoomIn className="w-3.5 h-3.5" />
                <span>확대 보기</span>
              </button>
            </div>
          </div>
        </div>

        {/* Small screen scroll hint in zoom mode */}
        {viewMode === 'zoom' && (
          <div className="flex sm:hidden items-center justify-center text-[11px] font-semibold text-indigo-700 bg-indigo-50/70 border border-indigo-100 py-1 px-2.5 rounded-lg">
            <span>← 좌우로 드래그하여 가계도 전체를 살펴보세요 →</span>
          </div>
        )}
      </div>

      {/* Interactive SVG Diagram Container */}
      <div
        className={`relative w-full select-none py-1 flex justify-center ${
          viewMode === 'zoom' ? 'overflow-x-auto' : 'overflow-hidden'
        }`}
      >
        <div
          className={`w-full transition-all duration-200 flex justify-center ${
            viewMode === 'zoom' ? 'min-w-[680px] max-w-[880px]' : 'max-w-[820px]'
          }`}
        >
          <svg
            viewBox={viewBox}
            className="w-full h-auto overflow-visible select-none"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Generational Lane Guides and Spacing Markers */}
            <g className="select-none pointer-events-none">
              {/* Generation 1 Baseline & Divider */}
              <line
                x1={genBadgeX + 60}
                y1={gen1Y}
                x2={viewMaxX - 10}
                y2={gen1Y}
                stroke="#F1F5F9"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />

              {/* Inter-generation divider between Gen 1 and Gen 2 */}
              <line
                x1={genBadgeX}
                y1={(gen1Y + gen2Y) / 2}
                x2={viewMaxX - 10}
                y2={(gen1Y + gen2Y) / 2}
                stroke="#E2E8F0"
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0.6"
              />

              {/* Generation 2 Baseline */}
              <line
                x1={genBadgeX + 60}
                y1={gen2Y}
                x2={viewMaxX - 10}
                y2={gen2Y}
                stroke="#F1F5F9"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />

              {/* Inter-generation divider between Gen 2 and Gen 3 if present */}
              {hasGen3 && (
                <>
                  <line
                    x1={genBadgeX}
                    y1={(gen2Y + gen3Y) / 2}
                    x2={viewMaxX - 10}
                    y2={(gen2Y + gen3Y) / 2}
                    stroke="#E2E8F0"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    opacity="0.6"
                  />
                  {/* Generation 3 Baseline */}
                  <line
                    x1={genBadgeX + 60}
                    y1={gen3Y}
                    x2={viewMaxX - 10}
                    y2={gen3Y}
                    stroke="#F1F5F9"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                </>
              )}

              {/* Styled Generation Badges on Left Column */}
              <g>
                {/* Gen 1 Badge */}
                <rect
                  x={genBadgeX}
                  y={gen1Y - 14}
                  width={56}
                  height={28}
                  rx={8}
                  fill="#F8FAFC"
                  stroke="#CBD5E1"
                  strokeWidth="1.5"
                />
                <text
                  x={genBadgeX + 28}
                  y={gen1Y + 5}
                  textAnchor="middle"
                  fill="#475569"
                  fontSize="12.5"
                  fontWeight="800"
                  fontFamily="sans-serif"
                >
                  I 세대
                </text>

                {/* Gen 2 Badge */}
                <rect
                  x={genBadgeX}
                  y={gen2Y - 14}
                  width={56}
                  height={28}
                  rx={8}
                  fill="#F8FAFC"
                  stroke="#CBD5E1"
                  strokeWidth="1.5"
                />
                <text
                  x={genBadgeX + 28}
                  y={gen2Y + 5}
                  textAnchor="middle"
                  fill="#475569"
                  fontSize="12.5"
                  fontWeight="800"
                  fontFamily="sans-serif"
                >
                  II 세대
                </text>

                {/* Gen 3 Badge */}
                {hasGen3 && (
                  <>
                    <rect
                      x={genBadgeX}
                      y={gen3Y - 14}
                      width={56}
                      height={28}
                      rx={8}
                      fill="#F8FAFC"
                      stroke="#CBD5E1"
                      strokeWidth="1.5"
                    />
                    <text
                      x={genBadgeX + 28}
                      y={gen3Y + 5}
                      textAnchor="middle"
                      fill="#475569"
                      fontSize="12.5"
                      fontWeight="800"
                      fontFamily="sans-serif"
                    >
                      III 세대
                    </text>
                  </>
                )}
              </g>
            </g>

            {/* Marriage Connection Lines */}
            {stage.marriageLines.map((m) => {
              const p1 = nodeMap.get(m.fromId);
              const p2 = nodeMap.get(m.toId);
              if (!p1 || !p2) return null;
              return (
                <line
                  key={m.id}
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke="#334155"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}

            {/* Offspring Connection Lines */}
            {stage.offspringLines.map((o) => {
              const p1 = nodeMap.get(o.marriageFromId);
              const p2 = nodeMap.get(o.marriageToId);
              if (!p1 || !p2) return null;

              const midX = (p1.x + p2.x) / 2;
              const parentY = p1.y;

              const children = o.childIds
                .map((cid) => nodeMap.get(cid))
                .filter((c): c is PedigreeNode => c !== undefined);

              if (children.length === 0) return null;

              const childY = children[0].y;
              // Clean midpoint branch height balancing parent info cards and child node top
              const branchY = parentY + (childY - parentY) * 0.48;

              const childXValues = children.map((c) => c.x);
              const minChildX = Math.min(...childXValues);
              const maxChildX = Math.max(...childXValues);

              return (
                <g key={o.id}>
                  {/* Vertical drop from marriage line */}
                  <line
                    x1={midX}
                    y1={parentY}
                    x2={midX}
                    y2={branchY}
                    stroke="#334155"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                  {/* Branch origin junction dot */}
                  <circle cx={midX} cy={parentY} r="2.5" fill="#334155" />

                  {/* Horizontal sibship crossbar if multiple children or single offset connection */}
                  {children.length > 1 ? (
                    <line
                      x1={minChildX}
                      y1={branchY}
                      x2={maxChildX}
                      y2={branchY}
                      stroke="#334155"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                    />
                  ) : midX !== children[0].x ? (
                    <line
                      x1={midX}
                      y1={branchY}
                      x2={children[0].x}
                      y2={branchY}
                      stroke="#334155"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                    />
                  ) : null}

                  {/* Split junction dot */}
                  <circle cx={midX} cy={branchY} r="2.5" fill="#334155" />

                  {/* Vertical drop lines to each child node (flush to top edge of node) */}
                  {children.map((child) => (
                    <g key={`child-drop-${child.id}`}>
                      <line
                        x1={child.x}
                        y1={branchY}
                        x2={child.x}
                        y2={child.y - 24} // Meets top border of 48px node cleanly with no floating gap
                        stroke="#334155"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                      />
                      {children.length > 1 && (
                        <circle cx={child.x} cy={branchY} r="2" fill="#334155" />
                      )}
                    </g>
                  ))}
                </g>
              );
            })}

            {/* Individual Pedigree Nodes */}
            {stage.nodes.map((node) => {
              const isSolved = Boolean(solvedNodes[node.id]);
              const isSelected = selectedNodeId === node.id;
              const isClue = node.isHomozygousRecessiveOrDirect && !isSolved;
              const nodeSize = 48;
              const half = nodeSize / 2;

              return (
                <g
                  key={node.id}
                  className="cursor-pointer group select-none"
                  onClick={() => onNodeClick(node)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${node.label}번 ${node.role}, ${node.phenotype}, 클릭하여 유전자형 분석`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      onNodeClick(node);
                    }
                  }}
                >
                  {/* Invisible generous touch/hit box for smooth mobile interaction */}
                  <rect
                    x={node.x - 38}
                    y={node.y - 28}
                    width={76}
                    height={116}
                    fill="transparent"
                    className="pointer-events-auto"
                  />

                  {/* Selection / Focus Halo */}
                  {isSelected && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={35}
                      fill="none"
                      stroke="#6366F1"
                      strokeWidth="3"
                      strokeDasharray="4 2"
                      className="animate-spin-slow opacity-80"
                    />
                  )}

                  {/* Clue Priority Pulse Halo */}
                  {isClue && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={33}
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="2"
                      opacity="0.65"
                      strokeDasharray="3 3"
                    />
                  )}

                  {/* Node Shape: Square for male, Circle for female */}
                  {node.sex === 'male' ? (
                    <rect
                      x={node.x - half}
                      y={node.y - half}
                      width={nodeSize}
                      height={nodeSize}
                      rx={6}
                      fill={node.isTraitExpressed ? '#0F172A' : '#FFFFFF'}
                      stroke={
                        isSolved
                          ? '#10B981'
                          : isSelected
                          ? '#4F46E5'
                          : isClue
                          ? '#D97706'
                          : '#334155'
                      }
                      strokeWidth={isSolved ? '3.5' : isSelected ? '3' : isClue ? '2.5' : '2'}
                      className="transition-colors duration-150 group-hover:stroke-indigo-600 group-hover:stroke-[3.5px]"
                    />
                  ) : (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={half}
                      fill={node.isTraitExpressed ? '#0F172A' : '#FFFFFF'}
                      stroke={
                        isSolved
                          ? '#10B981'
                          : isSelected
                          ? '#4F46E5'
                          : isClue
                          ? '#D97706'
                          : '#334155'
                      }
                      strokeWidth={isSolved ? '3.5' : isSelected ? '3' : isClue ? '2.5' : '2'}
                      className="transition-colors duration-150 group-hover:stroke-indigo-600 group-hover:stroke-[3.5px]"
                    />
                  )}

                  {/* Inner Label inside Shape */}
                  {isSolved ? (
                    <g transform={`translate(${node.x}, ${node.y})`}>
                      <text
                        x="0"
                        y="5"
                        textAnchor="middle"
                        fill={node.isTraitExpressed ? '#FFFFFF' : '#0F172A'}
                        fontSize={node.canonicalGenotype.length > 5 ? '11.5' : '13.5'}
                        fontWeight="700"
                        fontFamily="JetBrains Mono, monospace"
                      >
                        {node.canonicalGenotype.replace(' 또는 ', '/')}
                      </text>
                    </g>
                  ) : (
                    <g transform={`translate(${node.x}, ${node.y})`}>
                      <text
                        x="0"
                        y="5"
                        textAnchor="middle"
                        fill={node.isTraitExpressed ? '#F8FAFC' : '#475569'}
                        fontSize="15"
                        fontWeight="600"
                      >
                        {node.label}
                      </text>
                    </g>
                  )}

                  {/* Priority Clue Badge (★ 1순위) */}
                  {isClue && (
                    <g transform={`translate(${node.x + 14}, ${node.y - 20})`}>
                      <circle cx="0" cy="0" r="9" fill="#F59E0B" />
                      <text
                        x="0"
                        y="3"
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontSize="9"
                        fontWeight="bold"
                      >
                        ★
                      </text>
                    </g>
                  )}

                  {/* Solved Check Badge */}
                  {isSolved && (
                    <g transform={`translate(${node.x + 16}, ${node.y - 18})`}>
                      <circle cx="0" cy="0" r="8.5" fill="#10B981" />
                      <path
                        d="M-4 0 L-1 3 L4 -3"
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                  )}

                  {/* External Information Labels below each node */}
                  <g transform={`translate(${node.x}, ${node.y + 34})`}>
                    {/* Role / Person Name */}
                    <text
                      x="0"
                      y="0"
                      dominantBaseline="hanging"
                      textAnchor="middle"
                      fill="#0F172A"
                      fontSize="13.5"
                      fontWeight="700"
                      paintOrder="stroke fill"
                      stroke="#FFFFFF"
                      strokeWidth="3.5px"
                      strokeLinejoin="round"
                    >
                      {node.label}번 {node.role}
                    </text>

                    {/* Phenotype */}
                    <text
                      x="0"
                      y="18"
                      dominantBaseline="hanging"
                      textAnchor="middle"
                      fill={node.isTraitExpressed ? '#020617' : '#475569'}
                      fontSize="12.5"
                      fontWeight={node.isTraitExpressed ? '800' : '600'}
                      paintOrder="stroke fill"
                      stroke="#FFFFFF"
                      strokeWidth="3.5px"
                      strokeLinejoin="round"
                    >
                      {node.phenotype}
                    </text>

                    {/* Compact Interactive Status Badge Pill */}
                    {isSolved ? (
                      <g transform="translate(0, 36)">
                        <rect
                          x="-36"
                          y="0"
                          width="72"
                          height="18"
                          rx="9"
                          fill="#ECFDF5"
                          stroke="#10B981"
                          strokeWidth="1.2"
                          vectorEffect="non-scaling-stroke"
                        />
                        <text
                          x="0"
                          y="12.5"
                          textAnchor="middle"
                          fill="#047857"
                          fontSize="10"
                          fontWeight="800"
                          fontFamily="sans-serif"
                        >
                          ✓ {node.canonicalGenotype.replace(' 또는 ', '/')}
                        </text>
                      </g>
                    ) : isClue ? (
                      <g transform="translate(0, 36)">
                        <rect
                          x="-33"
                          y="0"
                          width="66"
                          height="18"
                          rx="9"
                          fill="#FFFBEB"
                          stroke="#F59E0B"
                          strokeWidth="1.2"
                          vectorEffect="non-scaling-stroke"
                        />
                        <text
                          x="0"
                          y="12.5"
                          textAnchor="middle"
                          fill="#B45309"
                          fontSize="10"
                          fontWeight="800"
                          fontFamily="sans-serif"
                        >
                          ★ 1순위
                        </text>
                      </g>
                    ) : (
                      <g transform="translate(0, 36)">
                        <rect
                          x="-30"
                          y="0"
                          width="60"
                          height="18"
                          rx="9"
                          fill="#F8FAFC"
                          stroke="#CBD5E1"
                          strokeWidth="1"
                          vectorEffect="non-scaling-stroke"
                        />
                        <text
                          x="0"
                          y="12.5"
                          textAnchor="middle"
                          fill="#64748B"
                          fontSize="9.5"
                          fontWeight="700"
                          fontFamily="sans-serif"
                        >
                          클릭 입력
                        </text>
                      </g>
                    )}
                  </g>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Stage Bottom Progress & Hint Bar */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-500 break-keep">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse shrink-0" />
          <span>각 가족을 클릭하여 유전자형을 추론하고 선택하세요.</span>
        </div>
        <div className="font-semibold text-slate-700 whitespace-nowrap self-end sm:self-auto">
          완료: {Object.keys(solvedNodes).length} / {stage.nodes.length}명
        </div>
      </div>
    </div>
  );
};

