'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  drawQuestions,
  calculateResult,
  makeAnswer,
  TOTAL_QUESTIONS,
  type DrawnQuestion,
  type Option,
  type QuizAnswer,
  type QuizResult,
} from '@/app/lib/quiz';
import ProgressRing from '@/app/components/ProgressRing';

interface InterrogationProps {
  onComplete: (result: QuizResult) => void;
}

/** 碎裂切片数（P2 §3.3：5-7 个水平条） */
const SLICE_COUNT = 6;
const SHATTER_MS = 550;

/**
 * 选中后的「碎裂」效果（P2 §3.3）：
 * 选项文字被 clip-path 切成若干水平条，
 * 每条向随机方向飞散（translate + rotate）并淡出。
 */
function ShatterText({ text }: { text: string }) {
  const slices = useMemo(
    () =>
      Array.from({ length: SLICE_COUNT }, (_, i) => ({
        top: (i / SLICE_COUNT) * 100,
        bottom: 100 - ((i + 1) / SLICE_COUNT) * 100,
        x: (Math.random() - 0.5) * 120,
        y: (Math.random() - 0.5) * 80,
        rotate: (Math.random() - 0.5) * 40,
        delay: Math.random() * 0.1,
      })),
    [],
  );

  return (
    <span className="relative inline-block">
      {/* 占位保持布局 */}
      <span className="opacity-0">{text}</span>
      {slices.map((s, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="absolute inset-0 text-white"
          style={{ clipPath: `inset(${s.top}% 0 ${s.bottom}% 0)` }}
          initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
          animate={{ x: s.x, y: s.y, rotate: s.rotate, opacity: 0 }}
          transition={{ duration: SHATTER_MS / 1000, delay: s.delay, ease: 'easeOut' }}
        >
          {text}
        </motion.span>
      ))}
    </span>
  );
}

/**
 * 拷问/答题（P2 版）：
 * - 一页一题全屏沉浸，选择即提交
 * - 选项选中后碎裂 → 屏幕渐黑 → 下一题
 * - ProgressRing 替代题号计数
 * - prefers-reduced-motion 时碎裂降级为直接淡出
 */
export default function Interrogation({ onComplete }: InterrogationProps) {
  const questions = useMemo<DrawnQuestion[]>(() => drawQuestions(), []);
  const [index, setIndex] = useState(0);
  const [shatteringLabel, setShatteringLabel] = useState<string | null>(null);
  const answersRef = useRef<QuizAnswer[]>([]);
  const questionShownAtRef = useRef<number>(Date.now());
  const advancingRef = useRef(false);

  const reduceMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  const question = questions[index];
  const isLast = index === TOTAL_QUESTIONS - 1;

  const advance = (option: Option) => {
    const thinkingMs = Date.now() - questionShownAtRef.current;
    answersRef.current.push(makeAnswer(question, option, thinkingMs));

    if (isLast) {
      onComplete(calculateResult(answersRef.current));
      return;
    }
    questionShownAtRef.current = Date.now();
    setIndex(index + 1);
    setShatteringLabel(null);
    advancingRef.current = false;
  };

  const handleAnswer = (option: Option) => {
    if (advancingRef.current) return;
    advancingRef.current = true;

    if (reduceMotion) {
      advance(option);
      return;
    }
    // 播放碎裂动画，结束后切题
    setShatteringLabel(option.label);
    setTimeout(() => advance(option), SHATTER_MS + 120);
  };

  // 组件卸载兜底清理（onComplete 后 section 离场）
  useEffect(() => () => { advancingRef.current = false; }, []);

  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black"
      initial={{ opacity: 0, y: '100vh' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* 进度环（P2 §2.3） */}
      <div className="absolute top-8 right-8">
        <ProgressRing current={index + 1} total={TOTAL_QUESTIONS} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id + index}
          className="flex flex-col items-center gap-12 px-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.25 } }}
        >
          {/* 题目文字（P2 §3.2：0.2s 从下方滑入） */}
          <motion.p
            className="font-sans text-2xl md:text-3xl text-white text-center max-w-2xl leading-relaxed"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
          >
            {question.text}
          </motion.p>

          {/* 选项（P2 §3.2：A 从左侧、B 从右侧淡入；移动端垂直排列） */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-24 mt-8">
            {question.options.map((option, i) => {
              const isShattering = shatteringLabel === option.label;
              const isFading = shatteringLabel !== null && !isShattering;
              return (
                <motion.button
                  key={option.label}
                  className="group relative px-8 py-4 text-neutral-400 hover:text-white transition-colors duration-300 disabled:pointer-events-none"
                  initial={{ opacity: 0, x: i === 0 ? -40 : 40 }}
                  animate={{ opacity: isFading ? 0 : 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
                  onClick={() => handleAnswer(option)}
                  disabled={shatteringLabel !== null}
                >
                  <span className="relative z-10 font-sans text-lg tracking-wide">
                    {isShattering ? <ShatterText text={option.label} /> : option.label}
                  </span>
                  {/* hover 下划线展开（P2 §3.3） */}
                  {!isShattering && (
                    <span className="absolute bottom-0 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
