'use client';

import { useMemo, useRef, useState } from 'react';
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

interface InterrogationProps {
  onComplete: (result: QuizResult) => void;
}

/**
 * 拷问/答题（P1 数据流打通版）。
 *
 * - 挂载时从 24 题库抽 8 题（每维度 2 题，跨维度打乱）
 * - 选择即提交，自动进入下一题（P2 将替换为碎裂动画）
 * - 答完 8 题计算 QuizResult 并上抛
 * - 组件卸载后重测会重新抽题（「再测一次」组合不同）
 */
export default function Interrogation({ onComplete }: InterrogationProps) {
  const questions = useMemo<DrawnQuestion[]>(() => drawQuestions(), []);
  const [index, setIndex] = useState(0);
  const answersRef = useRef<QuizAnswer[]>([]);
  const questionShownAtRef = useRef<number>(Date.now());

  const question = questions[index];
  const isLast = index === TOTAL_QUESTIONS - 1;

  const handleAnswer = (option: Option) => {
    const thinkingMs = Date.now() - questionShownAtRef.current;
    answersRef.current.push(makeAnswer(question, option, thinkingMs));

    if (isLast) {
      onComplete(calculateResult(answersRef.current));
      return;
    }
    questionShownAtRef.current = Date.now();
    setIndex(index + 1);
  };

  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black"
      initial={{ opacity: 0, y: '100vh' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* 进度（P2 将替换为 ProgressRing 组件） */}
      <div className="absolute top-8 right-8 w-16 h-16 rounded-full border border-neutral-800 flex items-center justify-center">
        <span className="font-mono text-sm text-neutral-500">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id + index}
          className="flex flex-col items-center gap-12 px-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {/* 题目文字 */}
          <p className="font-sans text-2xl md:text-3xl text-white text-center max-w-2xl leading-relaxed">
            {question.text}
          </p>

          {/* 选项 */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-24 mt-8">
            {question.options.map((option) => (
              <button
                key={option.label}
                className="group relative px-8 py-4 text-neutral-400 hover:text-white transition-colors duration-300"
                onClick={() => handleAnswer(option)}
              >
                <span className="relative z-10 font-sans text-lg tracking-wide">
                  {option.label}
                </span>
                <span className="absolute bottom-0 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
