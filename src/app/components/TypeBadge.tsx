'use client';

import { motion } from 'framer-motion';

interface TypeBadgeProps {
  /** 4 位类型编码，如 "DBMO" */
  code: string;
  /** 是否播放打字机入场 */
  animated?: boolean;
}

/**
 * TypeBadge —— 人格类型徽章（P2 §2.4）
 *
 * 4 个字母各自在独立「数据块」中，块间细线分隔；
 * 打字机式依次出现 + 光标闪烁；外框细线矩形。
 */
export default function TypeBadge({ code, animated = true }: TypeBadgeProps) {
  const letters = code.split('');
  const LETTER_DELAY = 0.35;
  const totalDuration = letters.length * LETTER_DELAY;

  return (
    <div className="relative inline-flex border border-[var(--color-border-active)] px-2 py-1">
      {letters.map((letter, i) => (
        <div key={i} className="flex items-center">
          {/* 数据块 */}
          <motion.span
            className="inline-block px-3 md:px-5 py-2 font-mono text-5xl md:text-7xl font-bold text-white"
            initial={animated ? { opacity: 0, y: 8 } : { opacity: 1 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * LETTER_DELAY, duration: 0.15 }}
          >
            {letter}
          </motion.span>
          {/* 打字光标：当前字母出现前显示在其位置 */}
          {animated && (
            <motion.span
              className="w-[2px] h-10 md:h-14 bg-white animate-cursor-blink"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ delay: i * LETTER_DELAY + 0.15, duration: 0.01 }}
            />
          )}
          {/* 块间分隔细线 */}
          {i < letters.length - 1 && (
            <div className="w-px h-12 md:h-16 bg-[var(--color-border)] mx-1" />
          )}
        </div>
      ))}
      {/* 末尾光标闪烁停留 */}
      {animated && (
        <motion.span
          className="w-[2px] h-10 md:h-14 bg-white self-center animate-cursor-blink"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1] }}
          transition={{ delay: totalDuration, duration: 0.01 }}
        />
      )}
    </div>
  );
}
