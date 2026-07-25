'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAnimationState } from '@/app/hooks/useAnimationState';
import type { QuizResult } from '@/app/lib/quiz';
import { isValidTypeCode } from '@/app/lib/personalities';
import type { DimensionId, ProviderSelection } from '@/app/types';
import Cinema from '@/app/sections/Cinema';
import Interrogation from '@/app/sections/Interrogation';
import Verdict from '@/app/sections/Verdict';
import Epilogue from '@/app/sections/Epilogue';

const EMPTY_PROVIDERS: ProviderSelection = { selected: [], custom: '' };

/** 从 ?r=CODE 直链合成一个「只读」结果（P3 §3.3：无原始答题数据） */
function synthesizeSharedResult(code: string): QuizResult {
  const dims: DimensionId[] = ['AD', 'BS', 'MC', 'OG'];
  return {
    code,
    dimensions: dims.map((dim, i) => ({
      dimension: dim,
      pole: code[i] as QuizResult['dimensions'][number]['pole'],
      left: 0,
      right: 0,
      ratio: 0.5,
      displayRatio: 0.5,
      borderline: false,
    })),
    answers: [], // 空 answers = 分享直链模式
  };
}

/**
 * 单页不滚动骨架（P0）+ P1 数据流 + P3 分享生态。
 *
 * ?r=CODE 直链：跳过 CINEMA/INTERROGATION 直接进入 VERDICT（只读模式），
 * 页面顶部提示「这是朋友的测试结果」，引导「我也测测」。
 */
export default function HomePage() {
  const { phase, transitionTo, restart } = useAnimationState();
  const [result, setResult] = useState<QuizResult | null>(null);
  const [providers, setProviders] = useState<ProviderSelection>(EMPTY_PROVIDERS);

  // 结果直链（P3 §3.3）
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('r');
    if (code && isValidTypeCode(code)) {
      setResult(synthesizeSharedResult(code));
      transitionTo('VERDICT');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetAll = () => {
    setResult(null);
    setProviders(EMPTY_PROVIDERS);
    restart();
  };

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
            onComplete={(r, p) => {
              setResult(r);
              setProviders(p);
              transitionTo('VERDICT');
            }}
          />
        )}

        {phase === 'VERDICT' && (
          <Verdict
            key="verdict"
            result={result}
            providers={providers}
            onShare={() => transitionTo('EPILOGUE')}
            onRestart={resetAll}
          />
        )}

        {phase === 'EPILOGUE' && (
          <Epilogue
            key="epilogue"
            result={result}
            providers={providers}
            onRestart={resetAll}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
