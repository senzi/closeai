'use client';

import type { QuizResult } from '@/app/lib/quiz';
import type { PersonalityType } from '@/app/lib/personalities';
import type { ProviderSelection } from '@/app/types';
import providersData from '@/app/lib/providers.json';
import TypeGlyph from '@/app/components/TypeGlyph';

interface Provider {
  id: string;
  name: string;
  icon: string | null;
  iconAvailable: boolean;
}

const PROVIDER_MAP: Record<string, Provider> = Object.fromEntries(
  ((providersData as { providers: Provider[] }).providers).map((p) => [p.id, p]),
);

/** 占位图标的首字符（与 ProviderPicker 的 monogram 规则一致） */
function monogram(name: string): string {
  const m = name.match(/[A-Za-z0-9]/);
  return m ? m[0].toUpperCase() : name.charAt(0);
}

/** icon 含扩展名（本地 SVG）时直接使用，否则按 PNG 处理 */
function iconSrc(icon: string): string {
  return `/icons/providers/${icon.includes('.') ? icon : `${icon}.png`}`;
}

const DIMENSION_META: Record<string, { left: string; right: string }> = {
  AD: { left: 'AUTONOMY', right: 'DEPENDENCY' },
  BS: { left: 'BELIEF', right: 'SKEPTICISM' },
  MC: { left: 'MAKER', right: 'CONSUMER' },
  OG: { left: 'OPEN', right: 'GUARDED' },
};

interface ShareCardProps {
  result: QuizResult;
  personality: PersonalityType;
  providers: ProviderSelection;
  /** 结果页 permalink 的二维码 dataURL（P3 修正：分享图带域名二维码） */
  qrDataUrl?: string | null;
}

/**
 * ShareCard —— 分享卡（P3 §1.2，配合页面黑白灰风格）
 *
 * 该组件直接渲染在 Epilogue 作为预览，
 * 「下载图片」用 snapdom 截取本组件 DOM 导出 PNG。
 * 注意：样式全部内联/原子类，避免 snapdom 捕获外部样式表差异。
 */
export default function ShareCard({ result, personality, providers, qrDataUrl }: ShareCardProps) {
  const selectedProviders = providers.selected
    .map((id) => PROVIDER_MAP[id])
    .filter(Boolean);

  return (
    <div
      id="share-card"
      className="w-[640px] bg-black text-white border border-neutral-800 px-10 py-8 flex flex-col gap-6 select-none"
      style={{ fontFamily: 'var(--font-space-grotesk), var(--font-noto-sans-sc), sans-serif' }}
    >
      {/* 顶部边栏 */}
      <div className="flex items-center justify-between font-mono text-xs tracking-[0.3em] text-neutral-600 uppercase">
        <span>closeai.moe</span>
        <span>AI PROXIMITY TEST</span>
      </div>

      <div className="h-px bg-neutral-800" />

      {/* 类型编码（数据块 + 分隔线） */}
      <div className="flex justify-center items-center gap-0 mt-2">
        {result.code.split('').map((letter, i) => (
          <div key={i} className="flex items-center">
            <span className="px-4 font-mono text-6xl font-bold tracking-wider">{letter}</span>
            {i < result.code.length - 1 && <div className="w-px h-12 bg-neutral-800" />}
          </div>
        ))}
      </div>

      {/* 名称 + Tagline */}
      <div className="text-center">
        <div className="text-xl flex items-center justify-center gap-3">
          <TypeGlyph code={result.code} size={26} className="text-white shrink-0" />
          {personality.nameZh}
          <span className="text-neutral-500 text-sm ml-1 uppercase tracking-wider">
            {personality.nameEn}
          </span>
        </div>
        <div className="text-neutral-400 italic mt-2">&ldquo;{personality.tagline}&rdquo;</div>
      </div>

      {/* 供应商标签（P3 §1.5） */}
      {(selectedProviders.length > 0 || providers.custom) && (
        <div className="flex justify-center flex-wrap gap-2">
          {selectedProviders.map((p) => (
            <span
              key={p.id}
              className="inline-flex items-center gap-2 border border-neutral-700 px-3 py-1 text-xs text-neutral-300"
            >
              {p.iconAvailable && p.icon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={iconSrc(p.icon)} alt="" width={14} height={14} />
              ) : (
                <span className="inline-flex items-center justify-center w-3.5 h-3.5 bg-neutral-800 text-neutral-500 text-[10px] font-mono">{monogram(p.name)}</span>
              )}
              {p.name}
            </span>
          ))}
          {providers.custom && (
            <span className="inline-flex items-center gap-2 border border-neutral-700 px-3 py-1 text-xs text-neutral-300">
              <span className="inline-flex items-center justify-center w-3.5 h-3.5 bg-neutral-800 text-neutral-500 text-[10px] font-mono">{monogram(providers.custom)}</span>
              {providers.custom}
            </span>
          )}
        </div>
      )}

      {/* 四维度条形（P3 §1.2：左右极 + 方块条） */}
      <div className="space-y-3 mt-2">
        {result.dimensions.map((d) => {
          const meta = DIMENSION_META[d.dimension];
          const rightRatio = 1 - d.displayRatio; // 填充比例：越靠右极填充越多
          const filled = Math.round(rightRatio * 20);
          return (
            <div key={d.dimension} className="flex items-center gap-3 font-mono text-[11px]">
              <span className="w-24 text-right text-neutral-500 tracking-wider">{meta.left}</span>
              <div className="flex-1 flex gap-[2px]">
                {Array.from({ length: 20 }, (_, i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 ${i < filled ? 'bg-white' : 'bg-neutral-800'}`}
                  />
                ))}
              </div>
              <span className="w-24 text-neutral-500 tracking-wider">{meta.right}</span>
            </div>
          );
        })}
      </div>

      {/* 人格文案三段（P3 修正：描述 / 关系诊断 / 讽刺忠告回到分享卡） */}
      <div className="space-y-2.5 mt-1 max-w-[520px] self-center text-center">
        <p className="text-[13px] text-neutral-300 leading-relaxed">
          {personality.description}
        </p>
        <p className="text-[11px] text-neutral-500 leading-relaxed">
          {personality.relationship}
        </p>
        <p className="text-[13px] text-neutral-400 italic leading-relaxed pt-1">
          &ldquo;{personality.warning}&rdquo;
        </p>
      </div>

      {/* 底部：口号 + 域名二维码（黑码白底，保证扫码可靠性） */}
      <div className="h-px bg-neutral-800" />
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-neutral-500">How Close Are You to AI?</span>
          <span className="font-mono text-xs text-neutral-700 tracking-widest">
            THINK WITH CARE · SHARE WITH STYLE
          </span>
        </div>
        {qrDataUrl && (
          <div className="flex flex-col items-center gap-1.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrDataUrl} alt="closeai.moe 二维码" width={76} height={76} className="rounded-[2px]" />
            <span className="font-mono text-[10px] text-neutral-600 tracking-widest">
              扫码测测你有多 CLOSE
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
