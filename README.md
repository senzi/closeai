# CloseAI.moe

> **How Close Are You to AI?**
>
> 一个测试你与 AI 亲近程度的互动站点。
> 讽刺 OpenAI 的封闭与傲慢， reclaim "close" —— 取「亲近」之意。

---

## ⚠️ 项目现状：亡羊补牢

**当前状态：混乱。待重构。**

这个项目曾经有一个可以跑起来的版本，但在产品方向、视觉体系和交互逻辑上都经历了多次摇摆。代码中存在以下问题：

- 页面结构耦合严重，多页跳转与单页体验的混合导致状态管理混乱
- 视觉风格不统一，残留了多个阶段的实验性 CSS
- 维度系统停留在早期设计（非4维），题目数量和结果类型都不够丰富
- 分享功能缺失，没有生成分享图的能力
- 动画系统要么过于简陋，要么过于复杂但没有形成体系
- **没有文档。没有 README。这就是这篇文档存在的原因。**

好消息是：核心概念（讽刺 OpenAI、"How Close Are You to AI?" 的拷问、人格测试的形式）经受了考验，方向是对的。接下来要做的不是推翻重来，而是**有体系地重构**。

---

## 🎯 核心概念

| 要素 | 说明 |
|------|------|
| **域名** | `closeai.moe` —— 直接对位 OpenAI，moe 后缀自带二次元/亚文化属性，降低攻击感，增强传播性 |
| **Slogan** | *How Close Are You to AI?* —— 双关：你离 AI 有多近？/ 你与 AI 有多亲近？保留为视觉核心元素 |
| **立意** | 讽刺 OpenAI 从 "Open" 走向封闭（模型不再开源、API 受限、Safety 审查），用互动测试的形式让用户反思自己与 AI 的关系 |
| **形式** | AI 亲近度人格测试，类似 MBTI 的四维模型，但完全原创的维度命名和类型体系 |
| **风格** | 克制、黑白灰、科技感、反乌托邦数据美学 —— 不花哨，但每一帧都有设计 |

---

## 🗺️ 重构路线图（P0 → P3）

本次重构分为四个优先级阶段，详见 `docs/` 目录下的独立文档：

| 优先级 | 文档 | 核心内容 | 预估工期 |
|--------|------|----------|----------|
| **P0** | [`docs/P0-core-rearchitecture.md`](docs/P0-core-rearchitecture.md) | 单页不滚动骨架、动画状态机、开场电影、基础交互框架 | 2-3 天 |
| **P1** | [`docs/P1-dimension-system.md`](docs/P1-dimension-system.md) | 四维人格模型、题目库设计、评分算法、结果类型定义 | 3-5 天 |
| **P2** | [`docs/P2-visual-interaction.md`](docs/P2-visual-interaction.md) | 黑白灰科技感动效、非传统「表单」交互、渐进展示、结果页 | 3-5 天 |
| **P3** | [`docs/P3-sharing-polish.md`](docs/P3-sharing-polish.md) | 分享图生成、随机文案模板、多平台分享适配、SEO/OG 优化 | 2-3 天 |

**建议执行顺序：P0 → P1 → P2 → P3**，但 P1 的维度设计和题目可以与 P0 的骨架开发并行进行（前后端分离）。

---

## 🏗️ 技术栈

| 层级 | 技术选择 | 理由 |
|------|----------|------|
| 框架 | **Next.js 14 (App Router)** | SSR/SSG 支持、OG 图片生成 API、部署友好 |
| 语言 | **TypeScript** | 类型安全，维度系统和评分算法需要严谨的数据结构 |
| 样式 | **Tailwind CSS** | 快速实现黑白灰设计系统，响应式基础好 |
| 动画 | **Framer Motion** + **GSAP** | Framer Motion 负责 React 状态驱动的交互动画；GSAP 负责开场电影时间线控制 |
| 字体 | **Space Grotesk** (英文标题) + **Noto Sans SC** (中文正文) | 科技感 + 中文可读性 |
| 分享图 | **@vercel/og (Satori)** | 服务端生成 Open Graph 图片，保证分享效果一致 |
| 部署 | **Vercel** | 零配置部署，边缘函数支持，国内访问建议配合 CDN |

---

## 📁 目录结构（目标）

```
closeai-moe/
├── app/
│   ├── page.tsx                 # 主入口：单页应用，管理全局动画状态机
│   ├── layout.tsx               # 根布局：字体、全局样式、OG 元数据
│   ├── api/
│   │   └── og/                  # OG 图片生成 API（P3）
│   ├── sections/
│   │   ├── Cinema.tsx           # 开场电影（P0）
│   │   ├── Interrogation.tsx    # 主交互区：「拷问」/答题（P0+P1+P2）
│   │   ├── Verdict.tsx          # 结果页：人格类型展示（P1+P2）
│   │   └── Epilogue.tsx         # 尾声：分享与重测（P3）
│   ├── components/
│   │   ├── DimensionAxis.tsx    # 单维度滑动轴（P2）
│   │   ├── ProgressRing.tsx     # 答题进度环（P2）
│   │   ├── TypeBadge.tsx        # 人格类型标签（P2）
│   │   ├── ShareCard.tsx        # 分享卡片（P3）
│   │   └── GlitchText.tsx       # 故障艺术文字效果（P2）
│   ├── hooks/
│   │   ├── useAnimationState.ts # 全局动画状态机（P0）
│   │   ├── useDimensionScore.ts # 维度评分逻辑（P1）
│   │   └── useShare.ts          # 分享逻辑封装（P3）
│   ├── lib/
│   │   ├── dimensions.ts        # 四维定义、题目库、类型映射（P1）
│   │   ├── scoring.ts           # 评分算法（P1）
│   │   ├── copy.ts              # 随机文案模板库（P3）
│   │   └── constants.ts         # 站点常量
│   └── types/
│       └── index.ts             # 全局类型定义
├── public/
│   ├── fonts/                   # 字体文件（如需自托管）
│   ├── sounds/                  # 音效文件（P2 可选）
│   └── images/                  # 静态图（Logo 等）
├── docs/                        # 📋 交接文档（你在这里）
├── README.md                    # 📋 本文件
└── package.json
```

---

## 🚀 本地开发

```bash
# 1. 克隆仓库
git clone https://github.com/yourname/closeai-moe.git
cd closeai-moe

# 2. 安装依赖
pnpm install

# 3. 启动开发服务器
pnpm dev

# 4. 打开 http://localhost:3000
```

---

## 📤 部署

```bash
# 推送到 main 分支，Vercel 自动部署
vercel --prod
```

**注意**：OG 图片生成（`/api/og`）依赖 Node.js Runtime，需要在 `app/api/og/route.tsx` 中显式声明：

```ts
export const runtime = 'edge';
```

---

## 📝 命名约定

| 场景 | 规则 |
|------|------|
| 文件/目录 | kebab-case（如 `dimension-axis.tsx`） |
| 组件名 | PascalCase（如 `DimensionAxis`） |
| 类型/接口 | PascalCase + 后缀（如 `DimensionConfig`, `ScoreResult`） |
| 常量 | UPPER_SNAKE_CASE（如 `MAX_QUESTIONS`） |
| hook | camelCase + `use` 前缀（如 `useAnimationState`） |

---

## 🤝 贡献与批注

本文档和 `docs/` 目录下的文件都是**临时的交接文档**。

- 直接在 Markdown 文件上批注、修改、发表建议
- P0~P3 的边界不是刚性的，如果发现某个功能更适合在另一个阶段做，直接改
- 任何「这个好酷但可能实现不了」的想法都记下来，后续可以降级或找到替代方案

---

## 📜 License

MIT —— 讽刺的东西，值得被传播。

---

*Last updated: 2026-07-25*
*Status: P0 骨架已落地（状态机 + 四 section 占位），P1~P3 待实现*

> 合入说明：原 Vue 3 + Vite 实现已退役，保留在 git 历史（HEAD `3cc68e7`）中；
> 旧 PRD 存档于 `docs/legacy-prd.md`。当前代码位于 `src/app/`。
