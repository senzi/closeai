'use client';

import { motion } from 'framer-motion';

interface VerdictProps {
  onShare: () => void;
}

export default function Verdict({ onShare }: VerdictProps) {
  return (
    <motion.div
      className="fixed inset-0 z-30 flex items-center justify-center bg-black"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      // VERDICT → EPILOGUE：向两侧散开（近似实现：横向拉伸 + 模糊淡出，0.5s）
      exit={{ opacity: 0, scaleX: 1.2, filter: 'blur(4px)', transition: { duration: 0.5 } }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex flex-col items-center gap-8 px-8">
        {/* 类型编码 */}
        <motion.div
          className="font-mono text-7xl md:text-8xl font-bold text-white tracking-[0.15em]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          ABCE
        </motion.div>

        {/* 名称 */}
        <motion.div
          className="flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <h2 className="font-sans text-2xl text-white">共生者</h2>
          <p className="font-sans text-sm text-neutral-500 tracking-wider uppercase">
            The Symbiont
          </p>
        </motion.div>

        {/* Tagline */}
        <motion.p
          className="font-sans text-lg text-neutral-400 italic text-center max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          "你已经和 AI 融为一体"
        </motion.p>

        {/* 按钮 */}
        <motion.div
          className="flex gap-6 mt-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <button
            className="px-6 py-3 border border-neutral-700 text-neutral-300 hover:bg-white hover:text-black hover:border-white transition-all duration-300 font-sans text-sm tracking-wider"
            onClick={onShare}
          >
            分享结果
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
