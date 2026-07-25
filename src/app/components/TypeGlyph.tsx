import type { ReactNode } from 'react';

/**
 * TypeGlyph —— 16 种人格类型的黑白线条图标（替换 emoji，统一网站视觉）
 *
 * 设计约束：24×24 viewBox、stroke=currentColor、fill=none、1.5px 圆角线帽，
 * 纯几何线条，配合黑白灰页面与分享卡。颜色完全由父级 text color 控制。
 */

const GLYPHS: Record<string, ReactNode> = {
  // ABMO 造物主：笔尖
  ABMO: (
    <>
      <path d="M12 2.5l5 9.5-5 9.5-5-9.5z" />
      <path d="M12 12v5.5" />
      <circle cx="12" cy="9.5" r="1" />
    </>
  ),
  // ABMG 铸剑者：剑
  ABMG: (
    <>
      <path d="M12 2.5L10.5 6h3L12 2.5z" />
      <path d="M12 6v9" />
      <path d="M7 15h10" />
      <path d="M12 15v4.5" />
      <path d="M10 21.5h4" />
    </>
  ),
  // ABCO 冲浪者：浪
  ABCO: (
    <>
      <path d="M3 10c2.5-3.5 5-3.5 7.5 0s5 3.5 7.5 0" />
      <path d="M3 16c2.5-3.5 5-3.5 7.5 0s5 3.5 7.5 0" />
      <path d="M18 5.5a2.5 2.5 0 013 2.5" />
    </>
  ),
  // ABCG 守望者：眼睛
  ABCG: (
    <>
      <path d="M2.5 12c3-5 6.5-7 9.5-7s6.5 2 9.5 7c-3 5-6.5 7-9.5 7s-6.5-2-9.5-7z" />
      <circle cx="12" cy="12" r="2.8" />
    </>
  ),
  // ASMO 工匠：齿轮
  ASMO: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 4v3M12 17v3M4 12h3M17 12h3M6.3 6.3l2.2 2.2M15.5 15.5l2.2 2.2M17.7 6.3l-2.2 2.2M8.5 15.5l-2.2 2.2" />
    </>
  ),
  // ASMG 锁匠：挂锁
  ASMG: (
    <>
      <rect x="6" y="10.5" width="12" height="9.5" />
      <path d="M9 10.5V8a3 3 0 016 0v2.5" />
      <circle cx="12" cy="14.5" r="1.2" />
      <path d="M12 15.7v2" />
    </>
  ),
  // ASCO 实用派：扳手
  ASCO: (
    <>
      <path d="M14.5 6.5a4.2 4.2 0 015.9-1.2l-3.2 3.2 1.3 1.3 3.2-3.2a4.2 4.2 0 01-5.9 5.9L8 20.3a2.1 2.1 0 01-3-3l7.8-7.8a4.2 4.2 0 011.7-3z" />
    </>
  ),
  // ASCG 隐士：砖墙
  ASCG: (
    <>
      <rect x="3" y="5.5" width="18" height="13" />
      <path d="M3 10h18M3 14.5h18" />
      <path d="M9 5.5V10M15 10v4.5M9 14.5v4" />
    </>
  ),
  // DBMO 先知：水晶球
  DBMO: (
    <>
      <circle cx="12" cy="10" r="6.5" />
      <path d="M9.5 8a3.5 3.5 0 012.5-1.5" />
      <path d="M5.5 20h13" />
      <path d="M8.5 16.5L7 20M15.5 16.5L17 20" />
    </>
  ),
  // DBMG 园丁：幼苗
  DBMG: (
    <>
      <path d="M12 21v-8" />
      <path d="M12 13c0-4-3-6.5-7.5-6.5 0 4 3 6.5 7.5 6.5z" />
      <path d="M12 11c0-3.5 2.5-5.5 6.5-5.5 0 3.5-2.5 5.5-6.5 5.5z" />
    </>
  ),
  // DBCO 朝圣者：蜡烛
  DBCO: (
    <>
      <path d="M12 3.5c1.2 1.6 1.2 3.2 0 4.5-1.2-1.3-1.2-2.9 0-4.5z" />
      <path d="M12 8v2.5" />
      <rect x="9.5" y="10.5" width="5" height="9.5" />
      <path d="M7 21.5h10" />
    </>
  ),
  // DBCG 信徒：教堂
  DBCG: (
    <>
      <path d="M5 21V10.5L12 4l7 6.5V21" />
      <path d="M12 10v7M9 13.5h6" />
      <path d="M3.5 21h17" />
    </>
  ),
  // DSMO 矛盾体：双面
  DSMO: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 3.5a4.25 4.25 0 010 8.5 4.25 4.25 0 000 8.5" />
      <circle cx="12" cy="7.7" r="0.9" />
      <circle cx="12" cy="16.3" r="0.9" />
    </>
  ),
  // DSMG 暗房师：相机
  DSMG: (
    <>
      <rect x="3" y="8" width="18" height="12" />
      <circle cx="12" cy="14" r="3.5" />
      <path d="M8.5 8L10 5h4l1.5 3" />
    </>
  ),
  // DSCO 常客：酒杯
  DSCO: (
    <>
      <path d="M5 4h14l-7 8.5-7-8.5z" />
      <path d="M12 12.5V20" />
      <path d="M8 20.5h8" />
    </>
  ),
  // DSCG 旁观者：门
  DSCG: (
    <>
      <rect x="7" y="3" width="10" height="18" />
      <circle cx="14.2" cy="12" r="1" />
      <path d="M3.5 21h17" />
    </>
  ),
};

interface TypeGlyphProps {
  code: string;
  size?: number;
  className?: string;
}

/** 人格类型图标；未知 code 退化为类型编码首字母方框 */
export default function TypeGlyph({ code, size = 24, className = '' }: TypeGlyphProps) {
  const glyph = GLYPHS[code];
  if (!glyph) {
    return (
      <span
        className={`inline-flex items-center justify-center border border-current font-mono ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.5 }}
      >
        {code.charAt(0)}
      </span>
    );
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {glyph}
    </svg>
  );
}
