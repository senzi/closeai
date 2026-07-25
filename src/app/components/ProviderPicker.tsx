'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import providersData from '@/app/lib/providers.json';

interface Provider {
  id: string;
  name: string;
  icon: string | null;
  iconAvailable: boolean;
  modelCount: number;
  hot: boolean;
}

interface ProviderPickerProps {
  onDone: (selection: { selected: string[]; custom: string }) => void;
}

const MAX_SELECT = (providersData as { maxSelectable: number }).maxSelectable ?? 3;
const PROVIDERS = (providersData as { providers: Provider[] }).providers;

/** 占位图标：灰色问号方块（无图标 provider 与自定义项共用） */
function PlaceholderIcon({ size = 20 }: { size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-[4px] bg-neutral-800 text-neutral-500 font-mono"
      style={{ width: size, height: size, fontSize: size * 0.6 }}
    >
      ?
    </span>
  );
}

function ProviderIcon({ provider, size = 20 }: { provider: Provider; size?: number }) {
  if (!provider.iconAvailable || !provider.icon) {
    return <PlaceholderIcon size={size} />;
  }
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={`/icons/providers/${provider.icon}.png`}
      alt=""
      width={size}
      height={size}
      className="rounded-[4px] invert-0"
      loading="lazy"
    />
  );
}

/**
 * ProviderPicker —— 供应商选择题「第 9 问」（P3 §1.6 / P1 §8）
 *
 * 热门 7 家大徽章 → 展开全部（带搜索）→ 自定义输入（占位图标）。
 * 最多 3 家，可跳过，选中顺序保留。
 */
export default function ProviderPicker({ onDone }: ProviderPickerProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [custom, setCustom] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [hint, setHint] = useState('');

  const hot = useMemo(() => PROVIDERS.filter((p) => p.hot), []);
  const rest = useMemo(() => {
    const list = PROVIDERS.filter((p) => !p.hot);
    if (!query.trim()) return list;
    const q = query.trim().toLowerCase();
    return list.filter((p) => p.id.includes(q) || p.name.toLowerCase().includes(q));
  }, [query]);

  const toggle = (id: string) => {
    setHint('');
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
      return;
    }
    if (selected.length >= MAX_SELECT) {
      setHint('最多 3 家——喜新厌旧一点');
      return;
    }
    setSelected([...selected, id]);
  };

  const Badge = ({ provider, large = false }: { provider: Provider; large?: boolean }) => {
    const active = selected.includes(provider.id);
    const disabled = !active && selected.length >= MAX_SELECT;
    return (
      <button
        onClick={() => toggle(provider.id)}
        disabled={disabled}
        className={`
          inline-flex items-center gap-2 border font-sans tracking-wide transition-all duration-200
          ${large ? 'px-5 py-3 text-base' : 'px-3 py-1.5 text-xs'}
          ${active
            ? 'bg-white text-black border-white'
            : disabled
              ? 'border-neutral-800 text-neutral-700 cursor-not-allowed'
              : 'border-neutral-700 text-neutral-400 hover:border-white hover:text-white'}
        `}
      >
        <ProviderIcon provider={provider} size={large ? 20 : 14} />
        {provider.name}
      </button>
    );
  };

  return (
    <motion.div
      className="flex flex-col items-center gap-8 px-8 max-w-3xl max-h-screen overflow-y-auto py-10"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* 题面 */}
      <p className="font-sans text-2xl md:text-3xl text-white text-center leading-relaxed">
        你平时和谁家的 AI 走得最近？
      </p>
      <p className="font-sans text-sm text-neutral-600 -mt-4">
        最多 {MAX_SELECT} 家，不影响结果，只会出现在你的画像上
      </p>

      {/* 热门 */}
      <div className="flex flex-wrap justify-center gap-3">
        {hot.map((p) => <Badge key={p.id} provider={p} large />)}
      </div>

      {/* 展开全部 */}
      {!expanded ? (
        <button
          onClick={() => setExpanded(true)}
          className="font-sans text-sm text-neutral-500 hover:text-white transition-colors border-b border-transparent hover:border-white"
        >
          展开全部 {PROVIDERS.length} 家 ↓
        </button>
      ) : (
        <div className="w-full flex flex-col items-center gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索供应商…"
            className="w-64 bg-transparent border border-neutral-800 focus:border-white outline-none px-4 py-2 font-sans text-sm text-white placeholder:text-neutral-700 transition-colors"
          />
          <div className="flex flex-wrap justify-center gap-2 max-h-48 overflow-y-auto px-2">
            {rest.map((p) => <Badge key={p.id} provider={p} />)}
            {rest.length === 0 && (
              <span className="font-sans text-sm text-neutral-600">没有匹配的供应商</span>
            )}
          </div>
        </div>
      )}

      {/* 自定义 */}
      <div className="flex items-center gap-3">
        <PlaceholderIcon size={20} />
        <input
          type="text"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          placeholder="其他：自己填一个（可空）"
          maxLength={20}
          className="w-56 bg-transparent border-b border-neutral-800 focus:border-white outline-none px-1 py-2 font-sans text-sm text-white placeholder:text-neutral-700 transition-colors"
        />
      </div>

      {/* 提示 + 操作 */}
      <div className="h-6 font-sans text-sm text-neutral-500">
        {hint || (selected.length > 0 ? `已选 ${selected.length}/${MAX_SELECT}` : '')}
      </div>
      <div className="flex gap-6">
        <button
          onClick={() => onDone({ selected: [], custom: '' })}
          className="px-6 py-3 font-sans text-sm text-neutral-500 hover:text-white transition-colors tracking-wider"
        >
          都不熟 / 跳过
        </button>
        <button
          onClick={() => onDone({ selected, custom: custom.trim() })}
          disabled={selected.length === 0 && !custom.trim()}
          className="px-8 py-3 border border-neutral-700 text-neutral-300 hover:bg-white hover:text-black hover:border-white transition-all duration-300 font-sans text-sm tracking-wider disabled:opacity-30 disabled:pointer-events-none"
        >
          生成我的画像 →
        </button>
      </div>
    </motion.div>
  );
}
