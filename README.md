# CloseAI.moe

> **How Close Are You to AI?**
>
> 一个测试你与 AI 亲近程度的互动站点。
> 讽刺 OpenAI 的封闭与傲慢，reclaim "close" —— 取「亲近」之意。
>
> 讽刺的方式是气质，不是证据：全站文案不点名、不直球，让用户自己品。

---

## ✅ 项目现状

**P0 ~ P3 四个阶段已全部交付，内容侧已冻结，可部署。**

单页不滚动应用：开场电影（CINEMA）→ 答题（INTERROGATION，8 题 + 第 9 问供应商选择）→
结果判决（VERDICT）→ 分享尾声（EPILOGUE），由全局动画状态机驱动。

| 阶段 | 文档 | 状态 | 核心交付 |
|------|------|------|----------|
| **P0** | [`docs/P0-core-rearchitecture.md`](docs/P0-core-rearchitecture.md) | ✅ | 单页骨架、四状态动画状态机、GSAP 开场电影 |
| **P1** | [`docs/P1-dimension-system.md`](docs/P1-dimension-system.md) | ✅ | 四维人格模型（A/D·B/S·M/C·O/G）、40 题库抽 8、权重评分 + 平局规则 + 随机抖动展示 |
| **P2** | [`docs/P2-visual-interaction.md`](docs/P2-visual-interaction.md) | ✅ | 黑白灰动效体系、碎裂选项、扫描线结果页、16 个 SVG 类型图标 |
| **P3** | [`docs/P3-sharing-polish.md`](docs/P3-sharing-polish.md) | ✅ | 分享卡（snapdom 截图 + 域名二维码）、随机文案模板（2400+ 组合）、微博/Twitter/QQ/微信分享、`?r=CODE` 结果直链、29 家供应商选择 |

---

## 🎯 核心概念

| 要素 | 说明 |
|------|------|
| **域名** | `closeai.moe` —— 直接对位 OpenAI，moe 后缀自带二次元/亚文化属性，降低攻击感，增强传播性 |
| **Slogan** | *How Close Are You to AI?* —— 双关：你离 AI 有多近？/ 你与 AI 有多亲近？ |
| **立意** | 讽刺 OpenAI 从 "Open" 走向封闭，用互动测试让用户反思自己与 AI 的关系 |
| **形式** | AI 亲近度人格测试，类似 MBTI 的四维模型，但维度命名和类型体系完全原创（8 字母全异，Open 极是彩蛋） |
| **风格** | 克制、黑白灰、科技感、反乌托邦数据美学 |
| **语调** | 暗戳戳。嘲讽藏于「数据中心」「地契」「我才是产品」这类意象，全站无可指认的点名证据 |

---

## 🏗️ 技术栈

| 层级 | 技术选择 | 说明 |
|------|----------|------|
| 框架 | **Next.js 16** (App Router) + **React 19** | 静态预渲染，无服务端逻辑 |
| 语言 | **TypeScript 5** | |
| 样式 | **Tailwind CSS 4** | 黑白灰设计系统 |
| 动画 | **Framer Motion 12** + **GSAP 3** | FM 驱动状态交互，GSAP 驱动开场电影时间线 |
| 字体 | **Space Grotesk** + **JetBrains Mono**（fontsource 自托管） | |
| 分享图 | **@zumer/snapdom**（客户端 DOM→PNG） + **qrcode**（结果直链二维码） | 不依赖服务端 OG |
| 供应商数据 | **静态资产**：`providers.json` + 本地图标缓存（lobehub），运行时零外网请求 | 维护见 `docs/providers-maintenance.md` |
| 部署 | **Vercel**（纯静态站点，零配置） | |

---

## 📁 目录结构（实际）

```
closeai/
├── src/app/
│   ├── page.tsx                 # 主入口：单页应用 + ?r=CODE 结果直链
│   ├── layout.tsx               # 根布局：字体、OG/Twitter meta
│   ├── globals.css              # Tailwind 4 + 扫描线等关键帧
│   ├── sections/
│   │   ├── Cinema.tsx           # 开场电影（P0）
│   │   ├── Interrogation.tsx    # 答题流：8 题 + ProviderPicker 第 9 问
│   │   ├── Verdict.tsx          # 结果判决页（P2）
│   │   └── Epilogue.tsx         # 分享矩阵与重测（P3）
│   ├── components/
│   │   ├── DimensionAxis.tsx    # 单维度滑动轴（随机内缩+抖动）
│   │   ├── ProgressRing.tsx     # 答题进度环
│   │   ├── TypeBadge.tsx        # 类型编码徽章（打字机入场）
│   │   ├── TypeGlyph.tsx        # 16 个黑白线条 SVG 类型图标
│   │   ├── GlitchText.tsx       # 故障艺术文字
│   │   ├── ProviderPicker.tsx   # 供应商选择（热门 8 家 + 展开搜索 + 自定义）
│   │   └── ShareCard.tsx        # 分享卡（snapdom 截图对象，带二维码）
│   ├── hooks/
│   │   └── useAnimationState.ts # 全局动画状态机
│   ├── lib/
│   │   ├── quiz.ts              # 题库（40 题）、抽题、评分（可注入 rng，Node 可测）
│   │   ├── personalities.ts     # 16 种人格类型定义
│   │   ├── copy.ts              # 随机分享文案模板池
│   │   └── providers.json       # 供应商清单（脚本生成，勿手改）
│   └── types/
│       └── index.ts             # 全局类型定义
├── public/icons/providers/      # 供应商图标本地缓存（PNG + 个别 SVG）
├── scripts/
│   ├── sync-providers.mjs       # 供应商数据管线（手动按需，数据固定）
│   ├── export-question-bank.mjs # 题库 → docs/question-bank.md（批注用）
│   ├── export-copy-templates.mjs# 文案池 → docs/copy-templates.md（批注用）
│   ├── test-quiz.mjs            # 题库/抽题/评分单测
│   └── test-copy.mjs            # 文案生成单测
├── docs/                        # 📋 交接文档（P0~P3、题库/文案审查稿、供应商维护手册）
└── README.md
```

---

## 🚀 本地开发

```bash
npm install
npm run dev        # http://localhost:3000
```

## 🧪 测试与内容审查工作流

```bash
# 单元测试（Node 24 原生剥离 TS 类型，无需编译）
node --test scripts/test-quiz.mjs scripts/test-copy.mjs

# 题库/文案批注工作流：改 src/app/lib/ 本体 → 重新导出 → 在 docs 上批注
node scripts/export-question-bank.mjs    # → docs/question-bank.md
node scripts/export-copy-templates.mjs   # → docs/copy-templates.md
```

## 📤 部署

纯静态站点，Vercel 导入仓库即可（Framework Preset 选 Next.js，零配置）。
也可以 `npm run build && npm run start` 自托管。

**注意**：`?r=CODE` 结果直链是客户端合成的只读结果页；OG 卡片使用静态图，
未做服务端动态 OG（CJK 字体子集化成本高，需要时再评估）。

## 🔧 供应商数据维护

数据固定，不做周期同步。仅在需要重大变更时手动运行
`node scripts/sync-providers.mjs`（`--fetch` 重新拉取 OpenRouter）。
排名/去重/排除/图标规则详见 [`docs/providers-maintenance.md`](docs/providers-maintenance.md)。

---

## 📝 命名约定

| 场景 | 规则 |
|------|------|
| 文件/目录 | kebab-case（脚本）/ PascalCase.tsx（组件） |
| 组件名 | PascalCase（如 `DimensionAxis`） |
| 类型/接口 | PascalCase（如 `QuizResult`, `PersonalityType`） |
| 常量 | UPPER_SNAKE_CASE（如 `QUESTION_BANK`） |
| hook | camelCase + `use` 前缀（如 `useAnimationState`） |

---

## 📜 License

MIT —— 讽刺的东西，值得被传播。

---

*Last updated: 2026-07-25*
*Status: P0~P3 全部交付，内容冻结，待部署*

> 考古说明：原 Vue 3 + Vite 实现已退役，保留在 git 历史（`3cc68e7`）中；
> 旧 PRD 存档于 `docs/legacy-prd.md`。
