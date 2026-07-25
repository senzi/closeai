'use client';

import { motion } from 'framer-motion';
import type { QuizResult } from '@/app/lib/quiz';
import { getPersonalityByCode } from '@/app/lib/personalities';

interface VerdictProps {
  result: QuizResult | null;
  onShare: () => void;
}

const DIMENSION_LABELS: Record<string, { left: string; right: string }> = {
  AD: { left: 'AUTONOMY', right: 'DEPENDENCY' },
  BS: { left: 'BELIEF', right: 'SKEPTICISM' },
  MC: { left: 'MAKER', right: 'CONSUMER' },
  OG: { left: 'OPEN', right: 'GUARDED' },
};

/**
 * 裁决/结果页（P1 数据流打通版）。
 * P2 将替换为扫描线入场 + TypeBadge 打字机 + DimensionAxis 光点轴。
 */
export default function Verdict({ result, onShare }: VerdictProps) {
  const personality = result ? getPersonalityByCode(result.code) : undefined;

  if (!result || !personality) {
    return (
      <motion.div
        className="fixed inset-0 z-30 flex items-center justify-center bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p className="font-sans text-neutral-500">结果数据缺失</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="fixed inset-0 z-30 flex items-center justify-center bg-black overflow-y-auto"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      // VERDICT → EPILOGUE：向两侧散开（近似实现：横向拉伸 + 模糊淡出，0.5s）
      exit={{ opacity: 0, scaleX: 1.2, filter: 'blur(4px)', transition: { duration: 0.5 } }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex flex-col items-center gap-6 px-8 py-12 max-w-2xl">
        {/* 类型编码 */}
        <motion.div
          className="font-mono text-7xl md:text-8xl font-bold text-white tracking-[0.15em]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {result.code}
        </motion.div>

        {/* 名称 */}
        <motion.div
          className="flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <h2 className="font-sans text-2xl text-white">
            {personality.emoji} {personality.nameZh}
          </h2>
          <p className="font-sans text-sm text-neutral-500 tracking-wider uppercase">
            {personality.nameEn}
          </p>
        </motion.div>

        {/* Tagline */}
        <motion.p
          className="font-sans text-lg text-neutral-400 italic text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          &ldquo;{personality.tagline}&rdquo;
        </motion.p>

        {/* 四维度轴（P2 将替换为 DimensionAxis 光点组件） */}
        <motion.div
          className="w-full mt-4 space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
        >
          {result.dimensions.map((d) => {
            const labels = DIMENSION_LABELS[d.dimension];
            return (
              <div key={d.dimension} className="flex items-center gap-3 font-mono text-xs">
                <span className={`w-24 text-right ${d.pole === d.dimension[0] ? 'text-white' : 'text-neutral-600'}`}>
                  {labels.left}
                </span>
                <div className="flex-1 h-px bg-neutral-800 relative">
                  <div
                    className="absolute w-2 h-2 -top-[3.5px] rounded-full bg-white"
                    style={{ left: `calc(${(1 - d.displayRatio) * 100}% - 4px)` }}
                  />
                </div>
                <span className={`w-24 ${d.pole !== d.dimension[0] ? 'text-white' : 'text-neutral-600'}`}>
                  {labels.right}
                </span>
              </div>
            );
          })}
        </motion.div>

        {/* 描述与诊断 */}
        <motion.div
          className="mt-4 space-y-3 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.6 }}
        >
          <p className="font-sans text-sm text-neutral-300 leading-relaxed">
            {personality.description}
          </p>
          <p className="font-sans text-sm text-neutral-500 leading-relaxed">
            {personality.relationship}
          </p>
          <p className="font-sans text-sm text-neutral-400 italic">
            {personality.warning}
          </p>
        </motion.div>

        {/* 按钮 */}
        <motion.div
          className="flex gap-6 mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          <button
            className="px-6 py-3 border border-neutral-700 text-neutral-300 hover:bg-white hover:text-black hover:border-white transition-all duration-300 font-sans text-sm tracking-wider"
            onClick={onShare}
          >
            分享结果
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
