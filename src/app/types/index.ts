export type AppState = 'CINEMA' | 'INTERROGATION' | 'VERDICT' | 'EPILOGUE';

export interface AnimationState {
  phase: AppState;
  /** 当前 phase 内部的子进度 0~1，用于驱动相内微动画 */
  subProgress: number;
  /** 用户是否主动跳过了开场 */
  skipped: boolean;
  /** 转换方向：前进 / 后退（用于判断动画方向） */
  direction: 'forward' | 'backward';
}

/** 四维结果（P1 v2：8 个字母全不同，见 docs/P1-dimension-system.md §1.2） */
export type Pole = 'A' | 'D' | 'B' | 'S' | 'M' | 'C' | 'O' | 'G';
export type DimensionId = 'AD' | 'BS' | 'MC' | 'OG';

export interface DimensionResult {
  AD: 'A' | 'D';
  BS: 'B' | 'S';
  MC: 'M' | 'C';
  OG: 'O' | 'G';
}

export type TypeCode = string; // e.g. "ABMO"

/** 供应商选择结果（P1 附加题，见 docs/P1-dimension-system.md §8） */
export interface ProviderSelection {
  /** provider id 数组，按选择顺序，最多 3 个 */
  selected: string[];
  /** 自定义供应商名称（可空） */
  custom: string;
}
