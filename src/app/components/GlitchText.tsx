'use client';

import { useCallback, useEffect, useState } from 'react';

interface GlitchTextProps {
  text: string;
  /** 故障强度：影响动画时长与触发频率 */
  intensity?: 'low' | 'medium' | 'high';
  /** 触发方式：hover / mount（入场一次）/ always（随机循环） */
  trigger?: 'hover' | 'mount' | 'always';
  className?: string;
}

const DURATIONS = { low: '0.2s', medium: '0.3s', high: '0.45s' } as const;

/**
 * GlitchText —— 故障艺术文字（P2 §2.1）
 *
 * 三层结构：底层正常文字 + 两层灰度偏移副本，
 * 副本通过 clip-path 切片 + translate 错位制造「数据损坏」感。
 * 纯 CSS 动画（globals.css glitch-slice-*），JS 只负责触发时机。
 */
export default function GlitchText({
  text,
  intensity = 'medium',
  trigger = 'mount',
  className = '',
}: GlitchTextProps) {
  // burst 计数器：每次 +1 重新挂载动画层以重放动画
  const [burst, setBurst] = useState(0);

  useEffect(() => {
    if (trigger === 'mount') {
      const t = setTimeout(() => setBurst(1), 100);
      return () => clearTimeout(t);
    }
    if (trigger === 'always') {
      let timer: ReturnType<typeof setTimeout>;
      const loop = () => {
        timer = setTimeout(
          () => {
            setBurst((b) => b + 1);
            loop();
          },
          1500 + Math.random() * 2500, // 随机间隔，不可预测
        );
      };
      loop();
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  const handleHover = useCallback(() => {
    if (trigger === 'hover') setBurst((b) => b + 1);
  }, [trigger]);

  return (
    <span
      className={`relative inline-block ${className}`}
      style={{ '--glitch-duration': DURATIONS[intensity] } as React.CSSProperties}
      onMouseEnter={handleHover}
    >
      {/* 底层：正常文字（burst=0 时可见；动画期间仍占位） */}
      <span className="relative z-10">{text}</span>
      {/* 两层故障副本 */}
      {burst > 0 && (
        <span key={burst} aria-hidden className="absolute inset-0 z-20 pointer-events-none">
          <span className="glitch-layer-1 absolute inset-0">{text}</span>
          <span className="glitch-layer-2 absolute inset-0">{text}</span>
        </span>
      )}
    </span>
  );
}
