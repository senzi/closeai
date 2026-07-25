/**
 * sync-providers.mjs
 *
 * 供应商数据 + 图标缓存同步脚本（closeai.moe · P1 附加题数据管线）
 *
 * 数据源：OpenRouter API（https://openrouter.ai/api/v1/models）
 * 图标源：@lobehub/icons-static-png（npmmirror CDN，dark 主题 PNG）
 *
 * 用法：
 *   node scripts/sync-providers.mjs            # 使用 scripts/data/ 下的缓存数据，仅同步图标与 providers.json
 *   node scripts/sync-providers.mjs --fetch    # 重新拉取 OpenRouter API，刷新缓存后再同步
 *   node scripts/sync-providers.mjs --no-icons # 跳过图标下载
 *
 * 产物：
 *   public/icons/providers/{slug}.png   —— 本地缓存的供应商图标（黑白灰页面用 dark 版）
 *   src/app/lib/providers.json          —— 前端直接消费的供应商清单（含 hot 标记）
 */

import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'scripts', 'data');
const ICON_DIR = path.join(ROOT, 'public', 'icons', 'providers');
const OUT_JSON = path.join(ROOT, 'src', 'app', 'lib', 'providers.json');

const OPENROUTER_API = 'https://openrouter.ai/api/v1/models';
const ICON_CDN = (slug) =>
  `https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/${slug}.png`;

/**
 * OpenRouter provider ID → @lobehub/icons slug。
 * 已对照 scripts/data/lobehub_dark_icons.json（PNG 包真实文件清单）校验；
 * 不在清单中的 slug 会被标记 iconAvailable=false，前端用占位图标。
 */
const ALIAS_MAP = {
  'mistralai': 'mistral',
  'z-ai': 'zai',           // z.ai（GLM 系列），注意不是 xai
  'x-ai': 'xai',
  'moonshotai': 'moonshot',
  'aion-labs': 'aionlabs',
  'bytedance-seed': 'bytedance',
  'ibm-granite': 'ibm',
  'amazon': 'aws',         // Amazon Nova 系列
  'meta-llama': 'meta',
};

/**
 * ID 归一化合并规则（去重）：
 * - `~` 前缀是 OpenRouter 的变体 slug（如 ~openai 与 openai 重复），去掉前缀合并进主条目；
 * - 下同义 ID 合并（modelCount 累加）。
 */
const MERGE_MAP = {
  'meta': 'meta-llama',
  'bytedance': 'bytedance-seed',
};

function normalizeId(raw) {
  const stripped = raw.startsWith('~') ? raw.slice(1) : raw;
  return MERGE_MAP[stripped] ?? stripped;
}

/**
 * 排除清单：个人微调作者 / 社区上传者（模型多为第三方微调，
 * 不是「谁家的 AI」语义下的供应商），不出现在选择列表。
 */
const EXCLUDE_IDS = new Set([
  'thedrummer',
  'sao10k',
  'undi95',
  'gryphe',
  'mancer',
  'cognitivecomputations',
  'anthracite-org',
]);

/** provider ID → 展示名（未收录的用 capitalize 兜底） */
const NAME_MAP = {
  'openai': 'OpenAI',
  'anthropic': 'Anthropic',
  'google': 'Google',
  'deepseek': 'DeepSeek',
  'qwen': 'Qwen（通义）',
  'x-ai': 'xAI（Grok）',
  'z-ai': 'Z.ai（GLM）',
  'moonshotai': 'Moonshot Kimi（月之暗面）',
  'meta-llama': 'Meta Llama',
  'mistralai': 'Mistral',
  'bytedance-seed': '豆包（字节）',
  'nvidia': 'NVIDIA',
  'minimax': 'MiniMax',
  'tencent': '腾讯混元',
  'inclusionai': '蚂蚁（百灵）',
  'stepfun': '阶跃星辰',
  'kwaipilot': '快手（Kwaipilot）',
  'openrouter': 'OpenRouter',
  'cohere': 'Cohere',
  'perplexity': 'Perplexity',
  'amazon': 'Amazon',
  'ibm-granite': 'IBM Granite',
  'poolside': 'Poolside',
  'nousresearch': 'Nous Research',
  'sao10k': 'Sao10K',
};

/**
 * 热门供应商：默认直接展示（无需展开），顺序即展示顺序。
 *
 * 排名规则说明：OpenRouter /api/v1/models 没有热度/用量字段，
 * 唯一可用的排序信号是 modelCount（在架模型数）。
 * 因此「热门」是人工产品判断（真实用户量 ≠ 模型数，如豆包/Kimi），
 * 非热门列表按 modelCount 降序。调整顺序后重新运行脚本即可。
 */
const HOT_PROVIDERS = [
  'openai',
  'anthropic',
  'google',
  'deepseek',
  'qwen',
  'x-ai',
  'moonshotai',
];

const args = new Set(process.argv.slice(2));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchOpenRouterModels() {
  console.log(`[fetch] GET ${OPENROUTER_API}`);
  const res = await fetch(OPENROUTER_API);
  if (!res.ok) throw new Error(`OpenRouter API ${res.status}`);
  const json = await res.json();
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(
    path.join(DATA_DIR, 'openrouter_models_raw.json'),
    JSON.stringify(json),
  );
  return json;
}

/** 从原始 models 响应统计 provider → 模型数（归一化去重 + 排除个人作者） */
function countProviders(modelsRaw) {
  const counts = new Map();
  for (const m of modelsRaw.data ?? []) {
    const raw = typeof m.id === 'string' ? m.id.split('/')[0] : null;
    if (!raw) continue;
    const id = normalizeId(raw);
    if (EXCLUDE_IDS.has(id)) continue;
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([provider, modelCount]) => ({ provider, modelCount }))
    .sort((a, b) => b.modelCount - a.modelCount);
}

async function downloadIcon(slug) {
  const file = path.join(ICON_DIR, `${slug}.png`);
  try {
    await access(file); // 缓存命中，跳过
    return 'cached';
  } catch { /* 不存在则下载 */ }
  const res = await fetch(ICON_CDN(slug));
  if (!res.ok) return `failed(${res.status})`;
  await writeFile(file, Buffer.from(await res.arrayBuffer()));
  return 'downloaded';
}

async function main() {
  // 1. 获取模型数据（--fetch 时重新拉取，否则用缓存）
  let modelsRaw;
  if (args.has('--fetch')) {
    modelsRaw = await fetchOpenRouterModels();
  } else {
    modelsRaw = JSON.parse(
      await readFile(path.join(DATA_DIR, 'openrouter_models_raw.json'), 'utf-8'),
    );
  }

  // 2. 统计 provider，应用别名映射，并对照 PNG 包真实文件清单校验图标可用性
  let knownIcons = null;
  try {
    knownIcons = new Set(JSON.parse(
      await readFile(path.join(DATA_DIR, 'lobehub_dark_icons.json'), 'utf-8'),
    ));
  } catch {
    console.warn('[warn] lobehub_dark_icons.json 不存在，跳过图标可用性校验');
  }

  const counts = countProviders(modelsRaw);
  const providers = counts.map(({ provider, modelCount }) => {
    const iconSlug = ALIAS_MAP[provider] ?? provider;
    const iconAvailable = knownIcons ? knownIcons.has(iconSlug) : true;
    return {
      id: provider,
      name: NAME_MAP[provider] ?? provider.charAt(0).toUpperCase() + provider.slice(1),
      icon: iconAvailable ? iconSlug : null, // null → 前端用占位图标
      iconAvailable,
      modelCount,
      hot: HOT_PROVIDERS.includes(provider),
    };
  });

  // 热门置顶，其余按模型数排序
  providers.sort((a, b) =>
    a.hot === b.hot
      ? HOT_PROVIDERS.indexOf(a.id) - HOT_PROVIDERS.indexOf(b.id) || b.modelCount - a.modelCount
      : a.hot ? -1 : 1,
  );

  // 3. 下载图标（带本地缓存；仅下载可用的）
  await mkdir(ICON_DIR, { recursive: true });
  if (!args.has('--no-icons')) {
    let ok = 0, cached = 0, skipped = 0, failed = [];
    for (const p of providers) {
      if (!p.iconAvailable) { skipped++; continue; }
      const result = await downloadIcon(p.icon);
      if (result === 'downloaded') ok++;
      else if (result === 'cached') cached++;
      else { failed.push(`${p.icon}: ${result}`); p.iconAvailable = false; p.icon = null; }
      await sleep(80); // 限速，尊重 CDN
    }
    console.log(`[icons] downloaded=${ok} cached=${cached} no-icon=${skipped} failed=${failed.length}`);
    if (failed.length) console.log('[icons] failures:', failed.join(', '));
  }

  // 4. 输出 providers.json
  await mkdir(path.dirname(OUT_JSON), { recursive: true });
  await writeFile(OUT_JSON, JSON.stringify({
    generatedAt: new Date().toISOString(),
    source: 'openrouter.ai/api/v1/models + @lobehub/icons-static-png',
    maxSelectable: 3,
    providers,
  }, null, 2));

  console.log(`[done] ${providers.length} providers → ${path.relative(ROOT, OUT_JSON)}`);
  console.log(`[done] hot: ${providers.filter((p) => p.hot).map((p) => p.id).join(', ')}`);
}

main().catch((err) => {
  console.error('[sync-providers] FAILED:', err.message);
  process.exit(1);
});
