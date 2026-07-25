'use client';

import { useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

interface CinemaProps {
  /** 开场自然播完（或自动超时） */
  onComplete: () => void;
  /** 用户主动点击跳过 */
  onSkip: () => void;
}

/**
 * 开场电影（P0 · Cinema）
 *
 * 叙事脚本（docs/P0-core-rearchitecture.md §3.1）：
 *   0.0s  黑屏 + 微弱噪点
 *   0.5s  光点亮起 → 收缩成一条横线
 *   1.0s  横线裂开 → 「closeai.moe」线框描边浮现
 *   1.5s  线框填充白色 → 副标题浮现
 *   2.0s  glitch 闪烁 0.2s
 *   2.5s  画面震动 + 「这不是一个普通的测试」
 *   3.0s  文字上滑消失 → 脉冲光点 + 点击引导
 *   5.5s  自动进入 INTERROGATION（移动端加速至 ~3.7s）
 */
export default function Cinema({ onComplete, onSkip }: CinemaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const finishedRef = useRef(false);

  // 用 ref 持有最新回调，避免 timeline 闭包捕获旧值
  const onCompleteRef = useRef(onComplete);
  const onSkipRef = useRef(onSkip);
  onCompleteRef.current = onComplete;
  onSkipRef.current = onSkip;

  const finish = useCallback((skipped: boolean) => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    tlRef.current?.kill();
    if (skipped) onSkipRef.current();
    else onCompleteRef.current();
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 767px)').matches;

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => finish(false),
    });
    tlRef.current = tl;

    // —— 第 0.5s：光点亮起 ——
    tl.fromTo('.cinema-dot',
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5 },
      0.5,
    );

    // —— 光点收缩成一条横线 ——
    tl.to('.cinema-dot', { opacity: 0, duration: 0.2 }, 1.0);
    tl.fromTo('.cinema-line',
      { scaleX: 0, opacity: 1 },
      { scaleX: 1, duration: 0.4, ease: 'power4.in' },
      0.9,
    );

    // —— 第 1.0s+：横线裂开，标题线框描边浮现 ——
    tl.to('.cinema-line', { scaleY: 0, opacity: 0, duration: 0.3 }, 1.3);
    tl.fromTo('.cinema-title-text',
      { attr: { 'stroke-dashoffset': 500 }, opacity: 1 },
      { attr: { 'stroke-dashoffset': 0 }, duration: 1.0, ease: 'power2.inOut' },
      1.3,
    );

    // —— 第 2.0s：线框填充为白色，副标题浮现 ——
    tl.to('.cinema-title-text', { attr: { 'fill-opacity': 1 }, duration: 0.5 }, 2.3);
    tl.fromTo('.cinema-subtitle',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      2.5,
    );

    // —— glitch 闪烁 0.2s ——
    tl.add(() => {
      const g = gsap.timeline();
      g.to('.cinema-glitch-target', { x: -3, skewX: 8, opacity: 0.6, duration: 0.05 })
       .to('.cinema-glitch-target', { x: 3, skewX: -6, opacity: 0.9, duration: 0.05 })
       .to('.cinema-glitch-target', { x: -1, skewX: 3, opacity: 0.7, duration: 0.05 })
       .to('.cinema-glitch-target', { x: 0, skewX: 0, opacity: 1, duration: 0.05 });
    }, 3.2);

    // —— 画面震动 + 提示语 ——
    tl.add(() => {
      const s = gsap.timeline();
      s.to('.cinema-stage', { x: -2, duration: 0.05 })
       .to('.cinema-stage', { x: 2, duration: 0.05 })
       .to('.cinema-stage', { x: -1, duration: 0.05 })
       .to('.cinema-stage', { x: 0, duration: 0.05 });
    }, 3.5);
    tl.fromTo('.cinema-hint',
      { opacity: 0 },
      { opacity: 0.5, duration: 0.5 },
      3.6,
    );

    // —— 文字上滑消失，脉冲光点升起 ——
    tl.to('.cinema-text-group', { y: -100, opacity: 0, duration: 0.8, ease: 'power3.in' }, 4.3);
    tl.fromTo('.cinema-pulse',
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5 },
      4.8,
    );
    tl.fromTo('.cinema-cta',
      { opacity: 0 },
      { opacity: 0.6, duration: 0.5 },
      5.0,
    );

    // 时间轴在 5.5s 自然结束 → onComplete
    tl.to({}, { duration: 0.5 }, 5.0);

    // 移动端整体加速（~3.7s），减弱动效偏好者近乎直出
    if (isMobile) tl.timeScale(1.5);
    if (reduceMotion) tl.timeScale(20);

    return () => { tl.kill(); };
  }, [finish]);

  const handleSkip = useCallback(() => {
    // 前 1s 内不响应（防止误触），按时间轴实际播放时间判断
    const t = tlRef.current?.time() ?? 0;
    const scale = tlRef.current?.timeScale() ?? 1;
    if (t * scale < 1) return;
    finish(true);
  }, [finish]);

  return (
    <motion.div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black cursor-pointer select-none overflow-hidden"
      initial={{ opacity: 0 }}
      // 入场淡入 1s（含 EPILOGUE → CINEMA 的重置淡入）
      animate={{ opacity: 1, transition: { duration: 1 } }}
      // CINEMA → INTERROGATION：整体向上滑出 0.8s
      exit={{ opacity: 0, y: '-100vh', transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }}
      onClick={handleSkip}
    >
      {/* 噪点纹理背景（opacity 0.03，P0 §3.3） */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 动画舞台（震动作用于这一层） */}
      <div className="cinema-stage relative flex flex-col items-center will-change-transform">
        {/* 文字组（最终整体上滑消失） */}
        <div className="cinema-text-group cinema-glitch-target flex flex-col items-center gap-6 will-change-transform">
          {/* 主标题：SVG 线框描边 → 填充 */}
          <svg
            viewBox="0 0 640 90"
            className="w-[300px] md:w-[480px] h-auto"
            aria-label="closeai.moe"
          >
            <text
              className="cinema-title-text"
              x="50%"
              y="62"
              textAnchor="middle"
              fontFamily="var(--font-space-grotesk), ui-sans-serif, system-ui, sans-serif"
              fontSize="64"
              fontWeight="700"
              fill="#ffffff"
              fillOpacity="0"
              stroke="#ffffff"
              strokeWidth="1"
              strokeDasharray="500"
              strokeDashoffset="500"
              opacity="0"
            >
              closeai.moe
            </text>
          </svg>

          {/* 副标题 */}
          <p className="cinema-subtitle font-sans text-lg md:text-xl text-neutral-400 tracking-wide opacity-0">
            How Close Are You to AI?
          </p>

          {/* 提示语 */}
          <p className="cinema-hint font-sans text-sm text-neutral-600 mt-4 opacity-0">
            这不是一个普通的测试
          </p>
        </div>

        {/* 起始光点（定位层不被 GSAP 触碰，动画作用于内层元素） */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="cinema-dot w-2 h-2 rounded-full bg-white opacity-0" />
        </div>

        {/* 横线 */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="cinema-line w-[240px] md:w-[360px] h-px bg-white origin-center opacity-0" />
        </div>

        {/* 脉冲光点 + 点击引导 */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 flex flex-col items-center gap-4 translate-y-24">
          <div className="cinema-pulse opacity-0">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse-glow" />
          </div>
          <p className="cinema-cta font-sans text-xs text-neutral-600 tracking-[0.3em] uppercase opacity-0">
            点击任意位置开始
          </p>
        </div>
      </div>
    </motion.div>
  );
}
