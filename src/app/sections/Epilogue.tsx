'use client';

import { motion } from 'framer-motion';

interface EpilogueProps {
  onRestart: () => void;
}

export default function Epilogue({ onRestart }: EpilogueProps) {
  return (
    <motion.div
      className="fixed inset-0 z-20 flex items-center justify-center bg-black"
      initial={{ opacity: 0, y: '100vh' }}
      animate={{ opacity: 1, y: 0 }}
      // EPILOGUE → CINEMA：淡出 1s（「再测一次」由 restart() 重置全部状态）
      exit={{ opacity: 0, transition: { duration: 1 } }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex flex-col items-center gap-10 px-8">
        {/* Slogan */}
        <motion.p
          className="font-sans text-xl md:text-2xl text-neutral-400 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          How Close Are You to AI?
        </motion.p>

        {/* 域名 */}
        <motion.div
          className="font-mono text-sm text-neutral-600 tracking-[0.3em] uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          closeai.moe
        </motion.div>

        {/* 再测一次 */}
        <motion.button
          className="mt-4 px-8 py-4 border border-neutral-700 text-neutral-300 hover:bg-white hover:text-black hover:border-white transition-all duration-300 font-sans text-sm tracking-wider"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          onClick={onRestart}
        >
          再测一次
        </motion.button>
      </div>
    </motion.div>
  );
}
