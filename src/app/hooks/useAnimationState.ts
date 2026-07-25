'use client';

import { useState, useCallback } from 'react';
import { AppState, AnimationState } from '@/app/types';

const PHASE_ORDER: AppState[] = ['CINEMA', 'INTERROGATION', 'VERDICT', 'EPILOGUE'];

const INITIAL_STATE: AnimationState = {
  phase: 'CINEMA',
  subProgress: 0,
  skipped: false,
  direction: 'forward',
};

/**
 * 全局动画状态机（P0）。
 *
 * 状态转换由当前 section 的回调触发（动画完成 / 用户操作），
 * 不允许跨组件直接 set phase —— 所有转换必须经过 transitionTo，
 * 以保证 direction 与子状态重置的一致性。
 */
export function useAnimationState() {
  const [state, setState] = useState<AnimationState>(INITIAL_STATE);

  const transitionTo = useCallback((nextPhase: AppState, opts?: { skipped?: boolean }) => {
    setState((prev) => {
      const currentIndex = PHASE_ORDER.indexOf(prev.phase);
      const nextIndex = PHASE_ORDER.indexOf(nextPhase);
      return {
        phase: nextPhase,
        subProgress: 0,
        skipped: opts?.skipped ?? false,
        direction: nextIndex >= currentIndex ? 'forward' : 'backward',
      };
    });
  }, []);

  /** 更新当前 phase 内的子进度（0~1），供相内微动画使用 */
  const setSubProgress = useCallback((subProgress: number) => {
    setState((prev) => ({ ...prev, subProgress }));
  }, []);

  /** 「再测一次」：回到 CINEMA 并重置全部子状态 */
  const restart = useCallback(() => {
    setState({ ...INITIAL_STATE, direction: 'backward' });
  }, []);

  const getPhaseIndex = useCallback((phase: AppState) => {
    return PHASE_ORDER.indexOf(phase);
  }, []);

  return {
    phase: state.phase,
    subProgress: state.subProgress,
    skipped: state.skipped,
    direction: state.direction,
    transitionTo,
    setSubProgress,
    restart,
    getPhaseIndex,
  };
}
