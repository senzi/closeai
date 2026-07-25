# P3: 分享生态 —— 分享图生成、随机文案与多平台传播

**优先级：🟢 P3（P0~P2 完成后开始，但 OG 基础结构需在 P0 时预留）**
**目标：让用户测完之后忍不住分享，无论用什么平台、什么方式。**

---

## 1. 分享图设计

### 1.1 设计原则

- **与页面风格完全一致**：黑白灰、克制、科技感
- **信息密度适中**：一眼能看到类型编码和 tagline，细看有维度分析
- **尺寸适配多平台**：以 1200×630（OG 标准）为主，同时生成 1:1 方形图（微博/朋友圈）
- **带域名水印**：`closeai.moe` 低调地放在角落

### 1.2 分享图布局（1200×630）

```
┌────────────────────────────────────────────┐
│  closeai.moe                          [logo] │  ← 顶部边栏，#0a0a0a 背景
├────────────────────────────────────────────┤
│                                            │
│              ████                          │
│              D B M O                       │  ← 类型编码，Space Grotesk 96px
│                                            │
│           先知 · The Oracle             │  ← 中文名 + 英文名
│                                            │
│      "你比 AI 更相信 AI"                  │  ← Tagline，斜体
│                                            │
│  ┌────────────────────────────────────┐    │
│  │  AUTONOMY ████████████░░ DEPENDENCY│    │  ← 四维度条形图
│  │  BELIEF   ██░░░░░░░░░░░░ SKEPTICISM│    │
│  │  CRAFT    ██████████░░░░ CONSUME   │    │
│  │  EXPOSURE ███████████░░░ EVASION   │    │
│  └────────────────────────────────────┘    │
│                                            │
│         How Close Are You to AI?           │  ← Slogan，底部
│                                            │
└────────────────────────────────────────────┘
```

### 1.3 技术实现：@vercel/og (Satori)

使用服务端生成，保证所有平台分享效果一致：

```tsx
// app/api/og/route.tsx
import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || 'ABMO';
  
  // 根据 type 查询对应的人格数据
  const personality = getPersonalityByCode(type);
  
  return new ImageResponse(
    (
      <div style={{
        width: '100%',
        height: '100%',
        background: '#000',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Space Grotesk',
        padding: '40px',
      }}>
        {/* 顶部 */}
        <div style={{ position: 'absolute', top: 20, left: 40, fontSize: 14, color: '#666' }}>
          closeai.moe
        </div>
        
        {/* 类型编码 */}
        <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: '0.1em' }}>
          {type}
        </div>
        
        {/* 名称 */}
        <div style={{ fontSize: 24, marginTop: 10, color: '#aaa' }}>
          {personality.nameZh} · {personality.nameEn}
        </div>
        
        {/* Tagline */}
        <div style={{ fontSize: 20, marginTop: 20, fontStyle: 'italic', color: '#888' }}>
          "{personality.tagline}"
        </div>
        
        {/* 维度条 */}
        <div style={{ marginTop: 40, width: '80%' }}>
          {/* ... 维度条形图 ... */}
        </div>
        
        {/* 底部 Slogan */}
        <div style={{ position: 'absolute', bottom: 30, fontSize: 14, color: '#444' }}>
          How Close Are You to AI?
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
```

### 1.4 方形图变体（1:1，用于微博/朋友圈）

```
┌────────────────────┐
│     closeai.moe    │
│                    │
│       D B M O      │
│                    │
│   先知             │
│   The Oracle       │
│                    │
│ "你比 AI 更相信   │
│   AI"              │
│                    │
│   [雷达图简化版]    │
│                    │
│  How Close Are     │
│  You to AI?        │
└────────────────────┘
```

### 1.5 供应商标签（联动附加题）

如果用户完成了供应商选择，分享图在 Tagline 下方增加一行**厂商标签**：

```
   [🬭 OpenAI]  [🬭 DeepSeek]  [🬭 Kimi]     ← 图标 + 名称，最多 3 个
```

- 图标使用本地缓存的 `public/icons/providers/{slug}.png`（黑白版，天然贴合黑白灰设计）
- 无图标的 provider 与自定义项使用统一的灰色问号占位图标
- OG 服务端生成时直接读取本地 PNG（`fs` → data URL 或 `arrayBuffer`），不走外部 CDN，保证生成速度和稳定性
- 用户跳过该题则不渲染此行，布局自动收拢

### 1.6 供应商选择题（归属修订 2026-07-25）

供应商选择题（「第 9 问」）**整体归 P3 实现**，内容设计见 `P1-dimension-system.md` §8：

- 位置：8 道维度题答完后、进入 Verdict 前，作为 Interrogation 的内部第 9 步
- UI：热门 7 家大徽章（带图标）→「展开全部」小徽章墙（带搜索）→ 自定义输入（占位图标）
- 约束：最多 3 家、可跳过、选中顺序保留
- 数据：`ProviderSelection { selected: string[], custom: string }`，随 QuizResult 一起流向 Verdict / Epilogue / ShareCard

---

## 2. 随机文案模板

用户分享时，需要一段「带有一点随机性」的文案，让每次分享都有新鲜感。

### 2.1 文案模板结构

每套模板由 3-4 个「插槽」组成，每个插槽有多个变体，随机组合：

```ts
interface CopyTemplate {
  // 开场白
  opening: string[];
  // 类型揭示
  reveal: string[];
  // 一句评价
  comment: string[];
  // 结尾号召
  closing: string[];
}
```

### 2.2 示例模板库（以 DBMO「先知」为例）

```ts
const copyTemplates: Record<string, CopyTemplate> = {
  DBMO: {
    opening: [
      "测了一下我和 AI 的关系，结果有点意思。",
      "原来我在 AI 眼里是这样的……",
      "一个残酷的自我认知测试。",
      "OpenAI 不会告诉你的真相。",
    ],
    reveal: [
      "我的 AI 亲近度类型是 DBMO —— 先知。",
      "诊断结果：DBMO（先知）。",
      "它说我是「先知」。",
    ],
    comment: [
      "「你比 AI 更相信 AI」—— 这话听起来像赞美，又像警告。",
      "不知道这是好事还是坏事。",
      "仔细一想，好像确实如此。",
      "有点准，有点吓人。",
    ],
    closing: [
      "你也来测测？→ closeai.moe",
      "How Close Are You to AI? #closeai",
      "测完告诉我你是什么类型。",
    ],
  }
};
```

### 2.3 文案生成逻辑

```ts
function generateShareCopy(typeCode: string): string {
  const template = copyTemplates[typeCode];
  if (!template) return `我的 AI 亲近度类型是 ${typeCode}。你也来测测？ closeai.moe`;
  
  const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
  
  return [
    pick(template.opening),
    pick(template.reveal),
    pick(template.comment),
    pick(template.closing),
  ].join('\n\n');
}
```

**生成示例**：

```
一个残酷的自我认知测试。

我的 AI 亲近度类型是 DBMO —— 先知。

「你比 AI 更相信 AI」—— 这话听起来像赞美，又像警告。

你也来测测？→ closeai.moe
```

### 2.4 文案语调控制

所有文案必须保持：
- **轻微自嘲**，不卑不亢
- **略带讽刺**，但不攻击性
- **有传播欲**，让人想点开链接
- **不解释太多**—— 神秘感是点击的驱动力

---

## 3. 多平台分享适配

### 3.1 分享按钮矩阵

结果页底部提供分享选项：

```
[复制链接]  [下载图片]  [微博]  [Twitter/X]  [QQ]
```

### 3.2 各平台适配

| 平台 | 分享方式 | 适配要点 |
|------|----------|----------|
| **复制链接** | 复制 `closeai.moe/?r=DBMO` 到剪贴板 | URL 带 `?r=` 参数，打开直接显示对应结果页（无需重测）|
| **下载图片** | 生成并下载 1200×630 PNG | 使用 `html2canvas` 或直接从 `/api/og` 获取 |
| **微博** | Web Intent + 文案复制 | 文案需要手动粘贴（微博 Web Intent 不支持预填充正文），或引导用户扫码 |
| **Twitter/X** | `https://twitter.com/intent/tweet?text=...&url=...` | 预填充文案 + 链接，OG 图自动抓取 |
| **QQ** | `mqqapi://share/to_fri?...`（移动端）/ 复制链接（桌面端）| 桌面端降级为复制链接 |
| **微信** | 无法直接跳转，提供「长按识别二维码」| 生成当前结果页的二维码图片 |

### 3.3 结果页直链（Result Permalink）

用户分享出去后，点击链接的人应该直接看到结果，而不是从头答题。

```
https://closeai.moe/?r=DBMO
```

实现逻辑：
1. 页面加载时检测 `?r=` 参数
2. 如果存在有效编码，跳过 CINEMA 和 INTERROGATION，直接进入 VERDICT 状态
3. 结果页显示「这是 XXX 的测试结果」，并提示「你也来测测」
4. 如果不存在或编码无效，正常流程

```ts
// page.tsx 初始化逻辑
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const resultCode = params.get('r');
  
  if (resultCode && isValidTypeCode(resultCode)) {
    setPreloadedResult(resultCode);
    transitionTo('VERDICT');
  }
}, []);
```

---

## 4. SEO 与 OG 优化

### 4.1 基础 Meta

```tsx
// layout.tsx
export const metadata = {
  title: 'CloseAI.moe — How Close Are You to AI?',
  description: '测测你与 AI 的亲近程度。一个关于人与 AI 关系的互动测试。',
  openGraph: {
    title: 'CloseAI.moe — How Close Are You to AI?',
    description: '测测你与 AI 的亲近程度。',
    url: 'https://closeai.moe',
    siteName: 'CloseAI.moe',
    images: [{
      url: 'https://closeai.moe/api/og',
      width: 1200,
      height: 630,
    }],
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CloseAI.moe',
    description: 'How Close Are You to AI?',
    images: ['https://closeai.moe/api/og'],
  },
};
```

### 4.2 动态 OG（结果页）

当用户分享具体结果时，OG 图应该显示该用户的类型：

```tsx
// app/result/[code]/page.tsx 或动态 meta
export async function generateMetadata({ params }: { params: { code: string } }) {
  const personality = getPersonalityByCode(params.code);
  return {
    title: `${params.code} — ${personality.nameZh} | CloseAI.moe`,
    openGraph: {
      images: [`https://closeai.moe/api/og?type=${params.code}`],
    },
  };
}
```

---

## 5. 传播机制设计

### 5.1 病毒循环

```
用户 A 测试 → 获得结果 → 分享到微博/推特
    ↓
用户 B 看到 → 点击链接 → 看到用户 A 的结果
    ↓
用户 B 好奇自己是什么 → 点击「我也测测」
    ↓
用户 B 测试 → 获得结果 → 分享 ……
```

### 5.2 降低分享摩擦

| 摩擦点 | 解决方案 |
|--------|----------|
| 不知道写什么文案 | 提供一键复制随机文案 |
| 懒得下载图片 | 提供「直接分享链接」，OG 图自动展示 |
| 想分享但不想暴露结果 | 提供「匿名分享」模式（只显示类型编码，不显示描述）|
| 平台不支持直接分享 | 提供二维码，支持微信/QQ 扫码 |

---

## 6. 待决策问题

1. **是否需要用户登录/保存历史？** 不登录更简单，但无法做「你的类型变化趋势」。
2. **是否需要「好友对比」功能？** 两个人分别测试后，可以生成对比图。有趣但增加复杂度。
3. **分享图是否需要更多风格变体？** 比如暗黑版、极简版、故障艺术版？
4. **是否需要接入微信 JS-SDK 做自定义分享？** 可以更好地控制微信内的分享卡片，但需要公众号/小程序资质。

---

## 7. 检查清单

- [x] `/api/og` 路由实现（1200×630 + 1:1 两种尺寸）— ⏸ 暂缓（2026-07-25）：分享图改由客户端 snapdom 截取 ShareCard 生成（静态部署友好、CJK 字体零成本）；服务端 OG 依赖 CJK 字体子集化，成本高，待部署到 Vercel 后再评估
- [x] 随机文案模板库 — 2026-07-25 实现为「共享插槽池 + 按类型评价池」（`lib/copy.ts`）：8 开场 + 3 揭示模板 + 16×2 评价 + 6 结尾，组合空间足够且维护量可控；未达到「每类型独立 4 插槽」的完整形态，后续可扩充
- [x] 结果页直链逻辑（`?r=` 参数处理）— 2026-07-25：校验编码 → 合成只读结果直跳 VERDICT → 隐藏维度轴 + 「这是朋友分享的测试结果」+「我也测测」
- [x] 复制链接功能 — 2026-07-25
- [x] 下载图片功能 — 2026-07-25：snapdom 截取 ShareCard，scale 2，黑底 PNG
- [x] 微博分享适配 — 2026-07-25：service.weibo.com share 页（url + title 预填）
- [x] Twitter/X 分享适配 — 2026-07-25：intent/tweet（文案 + 链接）
- [x] QQ 分享适配 — 2026-07-25：connect.qq.com shareqq（url + title + summary）
- [x] 微信二维码分享 — 2026-07-25：qrcode 本地生成白-on-黑 data URL，内联展示
- [x] SEO Meta 标签 — 2026-07-25：metadataBase + openGraph + twitter（静态版）
- [ ] 动态 OG 图（根据结果编码）— 暂缓，同 /api/og 评估
- [ ] 基础数据分析（分享次数、来源平台）— 待做（建议隐私友好方案，如 Plausible）
