# P1: 四维人格系统 —— 题目、评分与类型

**优先级：🟠 P1（P0 骨架完成后立即开始，可与 P0 并行设计）**
**目标：定义一套原创的、不借用明显 MBTI 概念的「AI 亲近度」四维模型。**

> 🔄 2026-07-25 v2 修订：
> 1. **维度重命名**——v1 的 C（Craft↔Consumption）与 E（Exposure↔Evasion）两极字母相同，编码必然歧义，全部重设计；
> 2. **题量缩减**——题库扩充到 40 题，但单次测试只抽 8 题，复测抽到新题的组合不同。

---

## 1. 设计原则

### 1.1 为什么不用 MBTI 概念

MBTI 的维度命名（E/I, S/N, T/F, J/P）已经被过度使用，而且用户看到就会联想到性格测试。我们想要的是：

- **一个关于人与 AI 关系的测试**，不是性格测试
- **维度命名要有科技感和哲学感**，但不能是生造词
- **结果要让人有「被看穿」的感觉**，同时又有传播欲

### 1.2 四维度模型（v2）

| 维度 | 名称 | 含义 | 两极 | 编码 |
|------|------|------|------|------|
| **1** | **Autonomy ↔ Dependency** | 你与 AI 的关系中，谁是主导？ | 自主 ↔ 依赖 | `A / D` |
| **2** | **Belief ↔ Skepticism** | 你对 AI 的能力和前景怎么看？ | 信仰 ↔ 怀疑 | `B / S` |
| **3** | **Maker ↔ Consumer** | 你使用 AI 的方式是什么？ | 创造 ↔ 消费 | `M / C` |
| **4** | **Open ↔ Guarded** | 你愿意让 AI 介入生活多深？ | 开放 ↔ 设防 | `O / G` |

**维度编码规则**：每个维度取一个字母，组合成 4 位编码，如 `ABMO`、`DSCG`、`ASCG`。

> **v2 命名为什么成立**
>
> - **8 个字母全不同**：A / D / B / S / M / C / O / G，任何编码都唯一可读，不会出现 v1 的 `C/c`、`E/e` 大小写歧义（大小写在口播、分享文案、URL 里都会丢失）。
> - **避开 MBTI 字母集**：MBTI 用 E/I/S/N/T/F/J/P，我们 8 个字母里只有 S 一个撞车，且我们的 S 是 Skepticism 而非 Sensing。
> - **每个字母即单词首字母**：**A**utonomy / **D**ependency / **B**elief / **S**kepticism / **M**aker / **C**onsumer / **O**pen / **G**uarded，看编码就能反推含义。
> - **Open 是隐藏彩蛋**：第四维的开放极恰好叫 Open——对 OpenAI 的反讽埋在类型系统里（一个「DBMO · 先知」恰恰是"最 Open 的人"）。

---

## 2. 四维度详解

### 2.1 Dimension 1: Autonomy ↔ Dependency

**问题核心**：当你面对一个需要决策的场景，你更倾向于自己思考，还是让 AI 替你做决定？

| 倾向 | 描述 |
|------|------|
| **A (Autonomy)** | 把 AI 当作工具。你保留最终决策权，AI 只是加速器。你担心过度依赖会让自己变笨。 |
| **D (Dependency)** | 把 AI 当作搭档。你愿意让 AI 参与甚至主导决策，只要能获得更好的结果。你信任 AI 的客观性。 |

**典型题目方向**：
- 写邮件时，你让 AI 生成后直接发送，还是会逐句修改？
- 当 AI 的建议和你的直觉冲突，你更相信谁？
- 如果没有 AI 辅助，你觉得自己的工作效率会下降多少？

### 2.2 Dimension 2: Belief ↔ Skepticism

**问题核心**：你对 AI 的能力边界和未来潜力，持什么态度？

| 倾向 | 描述 |
|------|------|
| **B (Belief)** | 你相信 AI 正在并且将继续改变世界。AGI 是可能的，而且可能是好事。你愿意拥抱变化。 |
| **S (Skepticism)** | 你对 AI 的 hype 保持警惕。你关注它的局限、偏见和安全问题。你不认为 AI 能真正理解人类。 |

**典型题目方向**：
- 看到「AI 取代 XX 职业」的新闻，你的第一反应是恐慌还是期待？
- 你认为现在的 LLM 真正「理解」了语言，还是只是模式匹配？
- 如果有人说「AI 有了意识」，你会认真考虑这个可能性吗？

### 2.3 Dimension 3: Maker ↔ Consumer

**问题核心**：你使用 AI 的方式是主动创造，还是被动消费？

| 倾向 | 描述 |
|------|------|
| **M (Maker)** | 你用 AI 做东西。写代码、做设计、写小说、做视频。AI 是你创作的延伸。 |
| **C (Consumer)** | 你用 AI 获取东西。搜索答案、生成摘要、翻译文档、写邮件。AI 是你的信息管道。 |

**典型题目方向**：
- 你打开 AI 对话框，最常见的第一个 prompt 是什么类型？
- 你有没有用 AI 做出过一件「作品」（代码、文章、图像、音乐）？
- 你更愿意让 AI 帮你「完成一个任务」还是「激发一个创意」？

### 2.4 Dimension 4: Open ↔ Guarded

**问题核心**：你愿意让 AI 了解你多少？你的生活对 AI 敞开了多少扇门？

| 倾向 | 描述 |
|------|------|
| **O (Open)** | 你的生活高度数字化。你让 AI 访问你的日程、邮件、聊天记录、健康数据。你不介意被「了解」。 |
| **G (Guarded)** | 你刻意保持距离。你不让 AI 访问私人数据，你担心隐私泄露和被监控。你有明确的数字边界。 |

**典型题目方向**：
- 你会把个人日记交给 AI 分析吗？
- 你的 AI 助手拥有你的麦克风和位置权限吗？
- 如果 AI 能准确预测你下周的行为，你会觉得方便还是毛骨悚然？

---

## 3. 题库设计（v2：大题库 + 小抽样）

### 3.1 核心思路

- **题库总量**：每维度 **10 题**，共 **40 题**（后续可继续扩充，抽样逻辑不变）
- **单次测试**：每个维度**随机抽 2 题**，共 **8 题**
- **答题顺序**：8 题**跨维度打乱**（避免用户察觉「这两题在测同一个东西」而策略性作答）
- **复测体验**：40 选 8 的抽样空间约 10 万种组合，复测大概率遇到新题——这是复测趣味性和传播新鲜感的来源
- **每题选项**：2 个（A/B 选择），不设中间选项——逼迫用户做出倾向性选择
- **答题时间**：无限制，但记录思考时长作为辅助数据（备用，暂不展示）

> **为什么 8 题够用了**
>
> 这是传播型测试，不是心理测量工具。每维度 2 题、每题 1.0~1.5 权重，足以给出「倾向哪一极」的判断；信度的不足由题库的随机性补偿——用户复测得到相同结果是「稳」，得到相邻结果也只会觉得「微妙」，两种体验都不损害传播性。真正的 MBTI 级信度需要 90+ 题，那个代价是流失率，不值得。

### 3.2 题目结构

```ts
type Pole = 'A' | 'D' | 'B' | 'S' | 'M' | 'C' | 'O' | 'G';
type DimensionId = 'AD' | 'BS' | 'MC' | 'OG';

interface Question {
  id: string;               // e.g. "AD-3"
  dimension: DimensionId;
  // 题目文本，支持措辞变体（见 3.3）
  text: string;
  // 两个选项：左极在前或随机（渲染时洗牌，防止位置偏好）
  options: [Option, Option];
  // 权重：少数「强倾向」题用 1.5，常规题 1.0
  weight: 1.0 | 1.5;
}

interface Option {
  label: string;      // 选项文字
  value: Pole;        // 该选项计向哪一极
  trait: string;      // 倾向描述，备用（结果页细节展示）
}
```

### 3.3 题目文案变体

为了增加复测的趣味性，同一道题可以有几个措辞变体，抽题时连同变体一起随机：

```ts
const questionBank: Question[] = [
  {
    id: 'AD-1',
    dimension: 'AD',
    weight: 1.0,
    text: "AI 帮你写了一封邮件，你会？",   // 从 variants 中随机选一个
    variants: [
      "AI 帮你写了一封邮件，你会？",
      "AI 给了一个和你直觉相反的建议，你第一反应是？",
    ],
    options: [
      { label: "直接发送，它写得比我好", value: 'D', trait: "信任 delegator" },
      { label: "逐句修改，保持我的语气", value: 'A', trait: "自主 editor" },
    ],
  },
  // ...
];
```

> ⚠️ 变体的**选项必须与题面匹配**。如果变体改变了情境，选项也要整套替换——实现上建议「题组」结构：一个题组包含若干套完整变体（题面+选项），抽题按题组抽。

### 3.4 抽题算法

```ts
const QUESTIONS_PER_DIMENSION = 2;   // 每维度抽 2 题
const TOTAL_QUESTIONS = 8;           // 单次测试总题数

function drawQuestions(bank: Question[]): Question[] {
  const byDimension = groupBy(bank, q => q.dimension);
  const drawn = Object.values(byDimension).flatMap(pool =>
    shuffle(pool).slice(0, QUESTIONS_PER_DIMENSION),
  );
  return shuffle(drawn); // 跨维度打乱
}
```

### 3.5 题目展示方式（与 P2 协同）

题目不是传统的「问卷」形式，而是**一页一题，全屏沉浸**。详见 `P2-visual-interaction.md`。

---

## 4. 评分算法

### 4.1 基础评分

每道题的选项对应一个维度的某一极，累加权重：

```ts
type RawScores = Record<Pole, number>;

function calculateDimension(scores: RawScores, dim: DimensionId): Pole {
  const pairs: Record<DimensionId, [Pole, Pole]> = {
    AD: ['A', 'D'],
    BS: ['B', 'S'],
    MC: ['M', 'C'],
    OG: ['O', 'G'],
  };
  const [left, right] = pairs[dim];

  if (scores[left] !== scores[right]) {
    return scores[left] > scores[right] ? left : right;
  }
  // 平局处理（见 4.2）
  return left; // 保守默认：取左极
}
```

### 4.2 平局规则

8 题抽样下，每维度 2 题，平局（1:1）会高频出现，必须有明确规则：

1. **权重优先**：如果两题权重不同（1.0 vs 1.5），权重高的题的方向获胜——平局其实不会发生（1.5 > 1.0），该规则自然生效
2. **双 1.0 平局**：取**左极**（Autonomy / Belief / Maker / Open），并在内部标记 `borderline: true`
3. `borderline` 标记目前只作为数据保留；是否在结果页展示「摇摆」徽章，见 §6 待决策

### 4.3 类型编码

四个维度的结果组合成一个 4 位编码：

```
类型编码 = {A/D}{B/S}{M/C}{O/G}

例如：
- ABMO = 自主 + 信仰 + 创造 + 开放
- DSCG = 依赖 + 怀疑 + 消费 + 设防
- ASCG = 自主 + 怀疑 + 消费 + 设防
```

总组合数：2^4 = **16 种类型**。

### 4.4 类型名称与描述

每种类型需要一个**中文名**、一个**英文名**、一段**描述**、一段**与 AI 的关系诊断**：

```ts
interface PersonalityType {
  code: string;           // e.g. "ABMO"
  nameZh: string;         // e.g. "造物主"
  nameEn: string;         // e.g. "The Creator"
  tagline: string;        // e.g. "AI 是你画笔的延伸"
  description: string;    // 3-4 句话的描述
  relationship: string;   // 你与 AI 的关系诊断
  warning: string;        // 一句略带讽刺的忠告
  emoji: string;          // 一个代表性 emoji
}
```

### 4.6 结果轴的展示位置（2026-07-25 追加）

原始占比 `ratio` 可能是 0 或 1 的极端值，直接渲染会让光点贴在轴端点上，显得「算法只给极端值」。因此结果轴使用 `displayRatio`：

- **随机内缩**：每维度的内缩量两端各自随机（8% ~ 14%），即使四个维度同为极端值，光点到端点的距离也各不相同
- **轻微抖动**：非极端值再叠加 ±3% 的展示抖动
- `ratio` 保留原始值（备用），渲染一律用 `displayRatio`

---

### 4.5 类型示例

| 编码 | 组合 | 中文名 | 英文名 | Tagline |
|------|------|--------|--------|---------|
| ABMO | 自主·信仰·创造·开放 | 造物主 | The Creator | AI 是你画笔的延伸 |
| ABMG | 自主·信仰·创造·设防 | 铸剑者 | The Smith | 你关起门来，锻造自己的武器 |
| ASCG | 自主·怀疑·消费·设防 | 隐士 | The Hermit | 你在数字世界里修了一堵墙 |
| ASCO | 自主·怀疑·消费·开放 | 实用派 | The Pragmatist | AI 只是效率工具，别多想 |
| DBMO | 依赖·信仰·创造·开放 | 先知 | The Oracle | 你比 AI 更相信 AI |
| DBCG | 依赖·信仰·消费·设防 | 信徒 | The Devotee | 你把灵魂的一部分交给了算法，但门关着 |
| DSMO | 依赖·怀疑·创造·开放 | 矛盾体 | The Contrarian | 你不信它，却离不开它 |
| DSCG | 依赖·怀疑·消费·设防 | 旁观者 | The Bystander | 你站在门外，看着里面的人狂欢 |

> ⚠️ **注意**：16 种类型需要全部定义，上面的只是示例。这是内容工作量最大的部分。

---

## 5. 结果页数据（与 P2 协同）

结果页需要展示：

1. **类型编码大字**（如 `ABMO`）
2. **中文名 + 英文名**
3. **Tagline**
4. **四维度坐标轴**（不使用雷达图——每个维度用一条 DimensionAxis 展示你在两极之间的位置，含原始分比例）
5. **描述文本**
6. **关系诊断**
7. **讽刺忠告**（这是讽刺 OpenAI 的核心落点）
8. **「再测一次」按钮**
9. **「分享结果」按钮**

---

## 6. 待决策问题

1. **「摇摆型」徽章**：双 1.0 平局的维度（`borderline`）是否在结果页标出「摇摆」？会增加「被看穿」的微妙感，但让类型显得不自信。
2. **题量是否支持「极速模式」？** 每维度 1 题共 4 题，15 秒出结果，适合分享链路里的低耐心用户；但信度进一步下降。
3. **类型的讽刺忠告的尺度？** 可以温和也可以尖锐，需要统一语调。
4. **Open 极的命名是否太直白？** 彩蛋埋在维度名里（Open ↔ OpenAI），还是需要更隐晦？

---

## 7. 检查清单

- [x] 40 道题全部编写完成（每维度 10 题，含题组变体）— 2026-07-25：`lib/quiz.ts` `QUESTION_BANK`
- [x] 抽题算法实现（每维度抽 2、跨维度打乱）— 2026-07-25：`drawQuestions()`，可注入 rng
- [x] 评分算法实现（含权重与平局规则）+ 单元测试 — 2026-07-25：`calculateResult()`；`scripts/test-quiz.mjs` 10/10 通过（node --test）
- [x] 16 种类型全部定义（名称、描述、诊断、忠告）— 2026-07-25：`lib/personalities.ts`，含 `isValidTypeCode` 供 P3 直链校验
- [x] 结果页数据结构定义 — 2026-07-25：`QuizResult` / `DimensionScore` / `QuizAnswer`
- [x] Interrogation → Verdict 数据流打通 — 2026-07-25：答题流程真实跑通（视觉仍是占位，随 P2 重构）

---

## 8. 附加题：模型供应商选择（非计分）

> 归属决策（2026-07-25 修订）：供应商选择**整体归入 P3**（含题目 UI），
> 见 `P3-sharing-polish.md` §1.6。P1 只保留本节作为内容设计参考。
> 它**不参与**四维评分——它回答的是「你和谁的 AI 亲近」，不是「你多亲近」。

### 8.1 题目定位

- 在 8 道维度题答完后、进入 Verdict 前出现，作为「第 9 问」
- 题目文案：`你平时和谁家的 AI 走得最近？`（保持拷问语气）
- **最多选 3 家**，0 家也可跳过（选项「都不熟 / 跳过」）
- 不影响类型编码，但会展示在结果页和分享图上（厂商 tag + 图标）

### 8.2 展示规则：热门优先 + 展开 + 自定义

| 层级 | 内容 | 交互 |
|------|------|------|
| **默认展示** | 7 家热门（OpenAI / Anthropic / Google / DeepSeek / Qwen / xAI / Moonshot Kimi） | 大徽章 + 图标，直接点选 |
| **展开更多** | 其余 ~50 家（来自 OpenRouter 全量列表） | 点击「展开全部」后按热度排序的小徽章墙，带搜索框（>20 个时） |
| **自定义** | 「其他」输入框 | 用户手填名称，无图标或统一占位图标（一个灰色问号方块） |

- 选满 3 家后未选中徽章变灰并给出提示文案：`最多 3 家——喜新厌旧一点`
- 选中顺序保留，结果页按选择顺序展示

### 8.3 图标缓存管线（数据基础设施）

**目标：图标全部自托管，不依赖第三方 CDN 的运行时可用性。**

```
scripts/sync-providers.mjs   ← 同步脚本（已实现）
    │
    ├─ 数据源 1：OpenRouter API（或 scripts/data/openrouter_models_raw.json 缓存）
    ├─ 数据源 2：scripts/data/lobehub_dark_icons.json（@lobehub/icons PNG 包真实文件清单）
    │
    ├─ 输出 1：public/icons/providers/{slug}.png  ← 本地图标缓存（dark 主题版）
    └─ 输出 2：src/app/lib/providers.json          ← 前端消费的唯一数据源
```

- **运行时机**：数据固定，不做周期同步；仅在需要重大变更时手动运行（`node scripts/sync-providers.mjs`，或 `--fetch` 重新拉取 OpenRouter）
- **缓存策略**：图标已存在则跳过（`cached`），仅下载新增；下载失败自动降级 `iconAvailable=false`
- **别名映射**：OpenRouter provider ID → 图标 slug 的映射表内置在脚本中（如 `z-ai→zai`、`x-ai→xai`、`amazon→aws`），新 provider 无法匹配时自动落到占位图标，不会报错
- **覆盖率现实**：PNG 静态包只有 285 个基础图标（不是报告里说的 100%），当前 58 家 provider 中 34 家有图标、24 家用占位——热门 7 家全部有图标，长尾用占位在视觉上可接受

### 8.4 数据结构

```ts
// src/app/lib/providers.json（脚本生成，勿手改）
interface Provider {
  id: string;            // OpenRouter provider ID，如 "moonshotai"
  name: string;          // 展示名，如 "Moonshot Kimi（月之暗面）"
  icon: string | null;   // 图标 slug；null = 用占位图标
  iconAvailable: boolean;
  modelCount: number;    // OpenRouter 在架模型数（热度依据）
  hot: boolean;          // 是否默认展示（热门 7 家）
}

// 用户选择结果（进入结果页与分享图）
interface ProviderSelection {
  selected: string[];    // provider id 数组，按选择顺序，最多 3
  custom: string;        // 自定义名称（可空）
}
```

### 8.5 检查清单（附加题部分）

- [x] 同步脚本 `scripts/sync-providers.mjs`
- [x] OpenRouter 数据缓存 + lobehub 图标清单
- [x] 热门 7 家图标全部就位（`public/icons/providers/`）
- [x] 供应商选择 UI — 2026-07-25 随 P3 实现（`components/ProviderPicker.tsx`，归属已修订为 P3）
- [x] 占位图标组件（灰色问号方块）— 2026-07-25
- [x] 结果页展示 — 2026-07-25（Verdict 标签行）
- [x] 分享图展示 — 2026-07-25（ShareCard 供应商标签行）
