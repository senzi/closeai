'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAnimationState } from '@/app/hooks/useAnimationState';
import type { QuizResult } from '@/app/lib/quiz';
import Cinema from '@/app/sections/Cinema';
import Interrogation from '@/app/sections/Interrogation';
import Verdict from '@/app/sections/Verdict';
import Epilogue from '@/app/sections/Epilogue';

/**
 * 单页不滚动骨架（P0）+ P1 数据流。
 *
 * 全局状态机驱动 4 个全屏 section，AnimatePresence mode="wait"
 * 保证上一个 section 离场动画播完后下一个才入场，
 * 离场组件的 DOM 与动画随之完全卸载（P0 §2.2 / §6 内存约束）。
 *
 * 答题结果在 INTERROGATION → VERDICT 转换时经 page 层 state 传递；
 * 「再测一次」时清空结果并重置状态机（Interrogation 重新挂载 = 重新抽题）。
 */
export default function HomePage() {
  const { phase, transitionTo, restart } = useAnimationState();
  const [result, setResult] = useState<QuizResult | null>(null);

  return (
    <main className="relative w-screen h-screen bg-black overflow-hidden">
      <AnimatePresence mode="wait">
        {phase === 'CINEMA' && (
          <Cinema
            key="cinema"
            onComplete={() => transitionTo('INTERROGATION')}
            onSkip={() => transitionTo('INTERROGATION', { skipped: true })}
          />
        )}

        {phase === 'INTERROGATION' && (
          <Interrogation
            key="interrogation"
            onComplete={(r) => {
              setResult(r);
              transitionTo('VERDICT');
            }}
          />
        )}

        {phase === 'VERDICT' && (
          <Verdict
            key="verdict"
            result={result}
            onShare={() => transitionTo('EPILOGUE')}
          />
        )}

        {phase === 'EPILOGUE' && (
          <Epilogue
            key="epilogue"
            onRestart={() => {
              setResult(null);
              restart();
            }}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
