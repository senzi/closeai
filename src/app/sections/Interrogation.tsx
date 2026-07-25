'use client';

import { motion } from 'framer-motion';

interface InterrogationProps {
  onComplete: () => void;
}

export default function Interrogation({ onComplete }: InterrogationProps) {
  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black"
      initial={{ opacity: 0, y: '100vh' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex flex-col items-center gap-12 px-8">
        {/* 进度环占位 */}
        <div className="absolute top-8 right-8 w-16 h-16 rounded-full border border-neutral-800 flex items-center justify-center">
          <span className="font-mono text-sm text-neutral-500">01</span>
        </div>

        {/* 题目文字 */}
        <motion.p
          className="font-sans text-2xl md:text-3xl text-white text-center max-w-2xl leading-relaxed"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          AI 帮你写了一封邮件，你会？
        </motion.p>

        {/* 选项 */}
        <motion.div
          className="flex flex-col md:flex-row gap-6 md:gap-24 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <button
            className="group relative px-8 py-4 text-neutral-400 hover:text-white transition-colors duration-300"
            onClick={onComplete}
          >
            <span className="relative z-10 font-sans text-lg tracking-wide">
              直接发送，它写得比我好
            </span>
            <span className="absolute bottom-0 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
          </button>

          <button
            className="group relative px-8 py-4 text-neutral-400 hover:text-white transition-colors duration-300"
            onClick={onComplete}
          >
            <span className="relative z-10 font-sans text-lg tracking-wide">
              逐句修改，保持我的语气
            </span>
            <span className="absolute bottom-0 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
