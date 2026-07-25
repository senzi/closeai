'use client';

import { motion } from 'framer-motion';

interface DimensionAxisProps {
  dimension: {
    code: string;      // e.g. "A/D"
    nameLeft: string;  // e.g. "AUTONOMY"
    nameRight: string; // e.g. "DEPENDENCY"
    /** 0~1，0 = 完全左极，1 = 完全右极（已含内缩抖动，用 displayRatio） */
    score: number;
    /** 左极是否为用户判定极（用于高亮端点标签） */
    leftActive: boolean;
  };
  /** 是否播放入场动画（光点从中央滑向实际位置） */
  animated?: boolean;
  /** 入场延迟（秒），用于多轴错峰 */
  delay?: number;
}

/**
 * DimensionAxis —— 维度滑动轴（P2 §2.2）
 *
 * 水平细线 + 带光晕的白色光点 + 两端极名。
 * 入场时光点从中央以弹性缓动滑向实际位置，落位后沿线发出扫描微光。
 */
export default function DimensionAxis({ dimension, animated = true, delay = 0 }: DimensionAxisProps) {
  const { nameLeft, nameRight, score, leftActive } = dimension;
  const dotPercent = score * 100;

  return (
    <div className="flex items-center gap-3 font-mono text-xs select-none">
      {/* 左极标签 */}
      <span
        className={`w-24 md:w-28 text-right tracking-wider transition-colors duration-500 ${
          leftActive ? 'text-white' : 'text-neutral-600'
        }`}
      >
        {nameLeft}
      </span>

      {/* 轴线 + 光点 */}
      <div className="relative flex-1 h-6 flex items-center">
        <div className="w-full h-px bg-[var(--color-border)]" />
        {/* 落位后的扫描微光 */}
        {animated && (
          <div
            className="animate-axis-shimmer absolute left-0 right-0 h-px bg-neutral-500"
            style={{ animationDelay: `${delay + 0.9}s` }}
          />
        )}
        {/* 光点 */}
        <motion.div
          className="absolute w-2 h-2 rounded-full bg-white"
          style={{
            boxShadow: '0 0 8px 2px rgba(255,255,255,0.5)',
            marginLeft: '-4px',
          }}
          initial={animated ? { left: '50%', opacity: 0 } : { left: `${dotPercent}%`, opacity: 1 }}
          animate={{ left: `${dotPercent}%`, opacity: 1 }}
          transition={
            animated
              ? { delay, type: 'spring', stiffness: 120, damping: 14 }
              : { duration: 0 }
          }
        />
      </div>

      {/* 右极标签 */}
      <span
        className={`w-24 md:w-28 tracking-wider transition-colors duration-500 ${
          !leftActive ? 'text-white' : 'text-neutral-600'
        }`}
      >
        {nameRight}
      </span>
    </div>
  );
}
