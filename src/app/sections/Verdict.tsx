'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { QuizResult } from '@/app/lib/quiz';
import { getPersonalityByCode } from '@/app/lib/personalities';
import TypeBadge from '@/app/components/TypeBadge';
import DimensionAxis from '@/app/components/DimensionAxis';
import GlitchText from '@/app/components/GlitchText';
import type { ProviderSelection } from '@/app/types';
import providersData from '@/app/lib/providers.json';

interface VerdictProps {
  result: QuizResult | null;
  providers?: ProviderSelection;
  onShare: () => void;
  onRestart?: () => void;
}

const PROVIDER_MAP: Record<string, { name: string; icon: string | null; iconAvailable: boolean }> =
  Object.fromEntries(
    ((providersData as { providers: { id: string; name: string; icon: string | null; iconAvailable: boolean }[] }).providers)
      .map((p) => [p.id, p]),
  );

const DIMENSION_META: Record<string, { left: string; right: string; leftPole: string }> = {
  AD: { left: 'AUTONOMY', right: 'DEPENDENCY', leftPole: 'A' },
  BS: { left: 'BELIEF', right: 'SKEPTICISM', leftPole: 'B' },
  MC: { left: 'MAKER', right: 'CONSUMER', leftPole: 'M' },
  OG: { left: 'OPEN', right: 'GUARDED', leftPole: 'O' },
};

/**
 * 裁决/结果页（P2 版）。
 *
 * 入场动画（P2 §4.1）：
 *   0.3s 中央光点旋转 → 0.5s 扫描线从上到下扫过 →
 *   扫描后 TypeBadge 打字机出现 → 名称/Tagline → 四维轴错峰落位 → 文案 → 按钮
 */
export default function Verdict({ result, providers, onShare, onRestart }: VerdictProps) {
  const personality = result ? getPersonalityByCode(result.code) : undefined;

  const reduceMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  // 分享直链模式：无原始答题数据（answers 为空），隐藏维度轴，提示「我也测测」
  const isSharedView = result !== null && result.answers.length === 0;
  const selectedProviders = (providers?.selected ?? [])
    .map((id) => PROVIDER_MAP[id])
    .filter(Boolean);

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

  // 时间轴基准：扫描线 1s（reduced-motion 时全部提前）
  const t0 = reduceMotion ? 0.1 : 1.4;

  return (
    <motion.div
      className="fixed inset-0 z-30 flex items-center justify-center bg-black overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      // VERDICT → EPILOGUE：向两侧散开（近似实现：横向拉伸 + 模糊淡出，0.5s）
      exit={{ opacity: 0, scaleX: 1.2, filter: 'blur(4px)', transition: { duration: 0.5 } }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* 扫描线入场（P2 §4.1） */}
      {!reduceMotion && (
        <>
          {/* 中央旋转光点 */}
          <motion.div
            className="absolute w-2 h-2 rounded-full bg-white"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0, 1, 1, 0.5], rotate: [0, 360] }}
            transition={{ duration: 0.7, times: [0, 0.3, 0.8, 1] }}
          />
          {/* 扫描线 */}
          <div
            className="animate-scanline absolute left-0 right-0 h-px bg-white pointer-events-none"
            style={{ animationDelay: '0.4s', boxShadow: '0 0 12px 2px rgba(255,255,255,0.4)' }}
          />
        </>
      )}

      <div className="flex flex-col items-center gap-5 px-8 py-10 max-w-2xl max-h-screen overflow-y-auto">
        {/* 类型徽章（打字机入场） */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: t0, duration: 0.1 }}
        >
          <TypeBadge code={result.code} animated={!reduceMotion} />
        </motion.div>

        {/* 名称 */}
        <motion.div
          className="flex flex-col items-center gap-2 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: t0 + 1.5, duration: 0.5 }}
        >
          <h2 className="font-sans text-2xl text-white">
            {personality.emoji}{' '}
            <GlitchText text={personality.nameZh} intensity="low" trigger="mount" />
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
          transition={{ delay: t0 + 1.8, duration: 0.5 }}
        >
          &ldquo;{personality.tagline}&rdquo;
        </motion.p>

        {/* 供应商标签（P3 §1.5，分享直链模式无此数据） */}
        {(selectedProviders.length > 0 || providers?.custom) && (
          <motion.div
            className="flex justify-center flex-wrap gap-2 mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: t0 + 2.0, duration: 0.5 }}
          >
            {selectedProviders.map((p) => (
              <span
                key={p.name}
                className="inline-flex items-center gap-2 border border-neutral-700 px-3 py-1 text-xs text-neutral-300 font-sans"
              >
                {p.iconAvailable && p.icon ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={`/icons/providers/${p.icon}.png`} alt="" width={14} height={14} />
                ) : (
                  <span className="inline-flex items-center justify-center w-3.5 h-3.5 bg-neutral-800 text-neutral-500 text-[10px] font-mono">?</span>
                )}
                {p.name}
              </span>
            ))}
            {providers?.custom && (
              <span className="inline-flex items-center gap-2 border border-neutral-700 px-3 py-1 text-xs text-neutral-300 font-sans">
                <span className="inline-flex items-center justify-center w-3.5 h-3.5 bg-neutral-800 text-neutral-500 text-[10px] font-mono">?</span>
                {providers.custom}
              </span>
            )}
          </motion.div>
        )}

        {/* 四维度轴（P2 §4.3：DimensionAxis 错峰落位；分享直链模式隐藏） */}
        {!isSharedView && (
        <motion.div
          className="w-full mt-4 p-4 space-y-4 bg-[var(--color-bg-elevated)] border border-[var(--color-border)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: t0 + 2.1, duration: 0.5 }}
        >
          {result.dimensions.map((d, i) => {
            const meta = DIMENSION_META[d.dimension];
            return (
              <DimensionAxis
                key={d.dimension}
                dimension={{
                  code: d.dimension,
                  nameLeft: meta.left,
                  nameRight: meta.right,
                  score: 1 - d.displayRatio, // 轴坐标：1 = 完全右极
                  leftActive: d.pole === meta.leftPole,
                }}
                animated={!reduceMotion}
                delay={t0 + 2.3 + i * 0.15}
              />
            );
          })}
        </motion.div>
        )}

        {/* 分享直链提示（P3 §3.3） */}
        {isSharedView && (
          <motion.div
            className="mt-4 px-4 py-2 border border-neutral-800 font-sans text-xs text-neutral-500 tracking-wider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: t0 + 2.1, duration: 0.5 }}
          >
            这是朋友分享的测试结果
          </motion.div>
        )}

        {/* 描述 / 诊断 / 讽刺忠告 */}
        <motion.div
          className="mt-2 space-y-3 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: t0 + 2.9, duration: 0.6 }}
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

        {/* 按钮（hover 反色，P2 §5.2） */}
        <motion.div
          className="flex gap-6 mt-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: t0 + 3.3, duration: 0.5 }}
        >
          {isSharedView ? (
            <button
              className="px-6 py-3 border border-neutral-700 text-neutral-300 hover:bg-white hover:text-black hover:border-white transition-all duration-300 font-sans text-sm tracking-wider"
              onClick={onRestart}
            >
              我也测测 →
            </button>
          ) : (
            <button
              className="px-6 py-3 border border-neutral-700 text-neutral-300 hover:bg-white hover:text-black hover:border-white transition-all duration-300 font-sans text-sm tracking-wider"
              onClick={onShare}
            >
              分享结果
            </button>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
