'use client';

import { motion } from 'framer-motion';

interface ProgressRingProps {
  /** 当前题号（1-based） */
  current: number;
  total: number;
  /** 圆环直径，默认 64px */
  size?: number;
}

/**
 * ProgressRing —— 答题进度环（P2 §2.3）
 *
 * 替代「第 X 题 / 共 Y 题」：细圆环 + 中心题号（JetBrains Mono）。
 * 每次题号变化时环的填充有一次脉冲动画。
 */
export default function ProgressRing({ current, total, size = 64 }: ProgressRingProps) {
  const strokeWidth = 1.5;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = current / total;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={current}
      aria-valuemax={total}
      aria-label={`第 ${current} 题，共 ${total} 题`}
    >
      <svg width={size} height={size} className="-rotate-90">
        {/* 未答部分 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={strokeWidth}
        />
        {/* 已答部分 */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-text-primary)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={false}
          animate={{ strokeDashoffset: circumference * (1 - progress) }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      {/* 中心题号：每次更新时脉冲 */}
      <motion.span
        key={current}
        className="absolute font-mono text-sm text-neutral-400"
        initial={{ scale: 1.35, opacity: 0.4 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {String(current).padStart(2, '0')}
      </motion.span>
    </div>
  );
}
