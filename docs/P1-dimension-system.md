# P1: 四维人格系统 —— 题目、评分与类型

**优先级：🟠 P1（P0 骨架完成后立即开始，可与 P0 并行设计）**
**目标：定义一套原创的、不借用明显 MBTI 概念的「AI 亲近度」四维模型。**

---

## 1. 设计原则

### 1.1 为什么不用 MBTI 概念

MBTI 的维度命名（E/I, S/N, T/F, J/P）已经被过度使用，而且用户看到就会联想到性格测试。我们想要的是：

- **一个关于人与 AI 关系的测试**，不是性格测试
- **维度命名要有科技感和哲学感**，但不能是生造词
- **结果要让人有「被看穿」的感觉**，同时又有传播欲

### 1.2 四维度模型

| 维度 | 名称 | 含义 | 两极 |
|------|------|------|------|
| **A** | **Autonomy ↔ Dependency** | 你与 AI 的关系中，谁是主导？ | 自主 (A) ↔ 依赖 (D) |
| **B** | **Belief ↔ Skepticism** | 你对 AI 的能力和前景怎么看？ | 信仰 (B) ↔ 怀疑 (S) |
| **C** | **Craft ↔ Consumption** | 你使用 AI 的方式是什么？ | 创造 (C) ↔ 消费 (C') |
| **E** | **Exposure ↔ Evasion** | 你愿意让 AI 介入生活多深？ | 暴露 (E) ↔ 回避 (E') |

**维度编码规则**：每个维度取两个字母中的一个，组合成 4 位编码，如 `ABCE`, `DSCE`, `ABCE'` 等。

> **为什么是 A-B-C-E 而不是 E-I-N-S？**
> 
> 字母顺序本身没有 MBTI 的暗示，且每个字母的英文单词含义直接对应维度本质：
> - **A**utonomy = 自主性
> - **B**elief = 信念
> - **C**raft = 创造
> - **E**xposure = 暴露/介入

---

## 2. 四维度详解

### 2.1 Dimension A: Autonomy ↔ Dependency

**问题核心**：当你面对一个需要决策的场景，你更倾向于自己思考，还是让 AI 替你做决定？

| 倾向 | 描述 |
|------|------|
| **A (Autonomy)** | 把 AI 当作工具。你保留最终决策权，AI 只是加速器。你担心过度依赖会让自己变笨。 |
| **D (Dependency)** | 把 AI 当作搭档。你愿意让 AI 参与甚至主导决策，只要能获得更好的结果。你信任 AI 的客观性。 |

**典型题目方向**：
- 写邮件时，你让 AI 生成后直接发送，还是会逐句修改？
- 当 AI 的建议和你的直觉冲突，你更相信谁？
- 如果没有 AI 辅助，你觉得自己的工作效率会下降多少？

### 2.2 Dimension B: Belief ↔ Skepticism

**问题核心**：你对 AI 的能力边界和未来潜力，持什么态度？

| 倾向 | 描述 |
|------|------|
| **B (Belief)** | 你相信 AI 正在并且将继续改变世界。AGI 是可能的，而且可能是好事。你愿意拥抱变化。 |
| **S (Skepticism)** | 你对 AI 的 hype 保持警惕。你关注它的局限、偏见和安全问题。你不认为 AI 能真正理解人类。 |

**典型题目方向**：
- 看到「AI 取代 XX 职业」的新闻，你的第一反应是恐慌还是期待？
- 你认为现在的 LLM 真正「理解」了语言，还是只是模式匹配？
- 如果有人说「AI 有了意识」，你会认真考虑这个可能性吗？

### 2.3 Dimension C: Craft ↔ Consumption

**问题核心**：你使用 AI 的方式是主动创造，还是被动消费？

| 倾向 | 描述 |
|------|------|
| **C (Craft)** | 你用 AI 做东西。写代码、做设计、写小说、做视频。AI 是你创作的延伸。 |
| **C' (Consumption)** | 你用 AI 获取东西。搜索答案、生成摘要、翻译文档、写邮件。AI 是你的信息管道。 |

> 注：`C'` 在显示时可以写作 lowercase `c`，或直接用 `Consumption` 的缩写逻辑。编码时统一用 `C` 和 `c`（小写），或保持 `C` 和 `C` 用位置区分。建议显示时使用 **C** 和 **c**。

**典型题目方向**：
- 你打开 ChatGPT 的对话框，最常见的第一个 prompt 是什么类型？
- 你有没有用 AI 做出过一件「作品」（代码、文章、图像、音乐）？
- 你更愿意让 AI 帮你「完成一个任务」还是「激发一个创意」？

### 2.4 Dimension E: Exposure ↔ Evasion

**问题核心**：你愿意让 AI 了解你多少？你的生活对 AI 敞开了多少扇门？

| 倾向 | 描述 |
|------|------|
| **E (Exposure)** | 你的生活高度数字化。你让 AI 访问你的日程、邮件、聊天记录、健康数据。你不介意被「了解」。 |
| **e (Evasion)** | 你刻意保持距离。你不让 AI 访问私人数据，你担心隐私泄露和被监控。你有明确的数字边界。 |

> 注：Evasion 缩写为 `e`（小写），显示时与 `E` 区分。

**典型题目方向**：
- 你会把个人日记交给 AI 分析吗？
- 你的手机里有多少个 AI 助手有麦克风和位置权限？
- 如果 AI 能准确预测你下周的行为，你会觉得方便还是毛骨悚然？

---

## 3. 题目库设计

### 3.1 题目数量

- **总题目数**：16 题（每维度 4 题）
- **每题选项**：2 个（A/B 选择），不设置中间选项——逼迫用户做出倾向性选择
- **答题时间**：每题没有时间限制，但记录思考时长作为辅助数据
- **答题顺序**：固定顺序或随机顺序可选（默认固定，便于控制叙事节奏）

### 3.2 题目结构

```ts
interface Question {
  id: string;
  dimension: 'A' | 'B' | 'C' | 'E';
  // 题目文本，支持轻微随机化（见 3.3）
  text: string;
  // 两个选项
  options: [Option, Option];
  // 权重：有些题目的倾向性更强
  weight: number; // 1.0 ~ 1.5
}

interface Option {
  label: string;      // 选项文字
  value: 'A' | 'D' | 'B' | 'S' | 'C' | 'c' | 'E' | 'e';
  // 选项对应的「倾向描述」，用于结果页展示
  trait: string;
}
```

### 3.3 题目文案随机化

为了增加复测的趣味性和传播的新鲜感，同一道题可以有几个措辞变体：

```ts
const questionPool: Record<string, QuestionVariant[]> = {
  'A-1': [
    {
      text: "AI 帮你写了一封邮件，你会？",
      options: [
        { label: "直接发送，它写得比我好", value: 'D', trait: "信任 delegator" },
        { label: "逐句修改，保持我的语气", value: 'A', trait: "自主 editor" }
      ]
    },
    {
      text: "AI 给了一个和你直觉相反的建议，你？",
      options: [
        { label: "先试试 AI 的方案", value: 'D', trait: "开放实验者" },
        { label: "坚持直觉，AI 不了解上下文", value: 'A', trait: "独立思考者" }
      ]
    }
  ]
};
```

每次加载时，从变体中随机选一套。

### 3.4 题目展示方式（与 P2 协同）

题目不是传统的「问卷」形式，而是**一页一题，全屏沉浸**。详见 `P2-visual-interaction.md`。

---

## 4. 评分算法

### 4.1 基础评分

每道题的选项对应一个维度的某一极，累加权重：

```ts
interface RawScores {
  A: number; // Autonomy 得分，越高越 A
  D: number; // Dependency 得分，越高越 D
  B: number;
  S: number;
  C: number;
  c: number;
  E: number;
  e: number;
}

function calculateScores(answers: Answer[]): DimensionResult {
  const scores: RawScores = { A:0, D:0, B:0, S:0, C:0, c:0, E:0, e:0 };
  
  for (const ans of answers) {
    const q = getQuestion(ans.questionId);
    scores[ans.value] += q.weight;
  }
  
  return {
    A: scores.A > scores.D ? 'A' : 'D',
    B: scores.B > scores.S ? 'B' : 'S',
    C: scores.C > scores.c ? 'C' : 'c',
    E: scores.E > scores.e ? 'E' : 'e',
  };
}
```

### 4.2 类型编码

四个维度的结果组合成一个 4 位编码：

```
类型编码 = {A/D}{B/S}{C/c}{E/e}

例如：
- ABCE = 自主 + 信仰 + 创造 + 暴露
- DScE = 依赖 + 怀疑 + 消费 + 暴露
- AScE = 自主 + 怀疑 + 消费 + 暴露
```

总组合数：2^4 = **16 种类型**。

### 4.3 类型名称与描述

每种类型需要一个**中文名**、一个**英文名**、一段**描述**、一段**与 AI 的关系诊断**：

```ts
interface PersonalityType {
  code: string;           // e.g. "ABCE"
  nameZh: string;         // e.g. "共生者"
  nameEn: string;         // e.g. "The Symbiont"
  tagline: string;        // e.g. "你已经和 AI 融为一体"
  description: string;    // 3-4 句话的描述
  relationship: string;   // 你与 AI 的关系诊断
  warning: string;        // 一句略带讽刺的忠告
  emoji: string;          // 一个代表性 emoji
}
```

### 4.4 类型示例

| 编码 | 中文名 | 英文名 | Tagline |
|------|--------|--------|---------|
| ABCE | 共生者 | The Symbiont | 你已经和 AI 融为一体 |
| ABcE | 造物主 | The Creator | AI 是你画笔的延伸 |
| ABS E | 守望者 | The Watcher | 你注视着 AI，也注视着自己 |
| ABSe | 隐士 | The Hermit | 你在数字世界里修了一堵墙 |
| DBCe | 信徒 | The Devotee | 你把灵魂的一部分交给了算法 |
| DBCE | 先知 | The Oracle | 你比 AI 更相信 AI |
| DScE | 实用派 | The Pragmatist | AI 只是效率工具，别多想 |
| DScE | 旁观者 | The Bystander | 你站在门外，看着里面的人狂欢 |

> ⚠️ **注意**：16 种类型需要全部定义，上面的只是示例。这是内容工作量最大的部分。

---

## 5. 结果页数据（与 P2 协同）

结果页需要展示：

1. **类型编码大字**（如 `ABCE`）
2. **中文名 + 英文名**
3. **Tagline**
4. **四维度雷达图**（或坐标轴）—— 展示你在四个维度上的位置
5. **描述文本**
6. **关系诊断**
7. **讽刺忠告**（这是讽刺 OpenAI 的核心落点）
8. **「再测一次」按钮**
9. **「分享结果」按钮**

---

## 6. 待决策问题

1. **是否加入「模糊地带」？** 如果某个维度得分非常接近（如 A=4.2, D=4.1），是否标记为「摇摆型」？
2. **题目数量 16 题是否太少？** MBTI 的正式版有 90+ 题，16 题可能信度不足。但太多题会流失用户。
3. **是否支持「部分维度测试」？** 比如只测 1-2 个维度，快速出结果。
4. **类型的讽刺忠告的尺度？** 可以温和也可以尖锐，需要统一语调。

---

## 7. 检查清单

- [ ] 16 道题目全部编写完成（含变体）
- [ ] 评分算法实现 + 单元测试
- [ ] 16 种类型全部定义（名称、描述、诊断、忠告）
- [ ] 题目文案随机化逻辑
- [ ] 结果页数据结构定义

---

## 8. 附加题：模型供应商选择（非计分）

> 归属决策（2026-07-25）：供应商选择是**答题流程中的一道附加题**，归 P1 管内容；
> 交互样式（徽章墙、展开动画）随 P2 的视觉体系实现；
> 结果在 Verdict 页与分享卡上的展示归 P3（见 `P3-sharing-polish.md` §1.5）。
> 它**不参与**四维评分——它回答的是「你和谁的 AI 亲近」，不是「你多亲近」。

### 8.1 题目定位

- 在 16 道维度题答完后、进入 Verdict 前出现，作为「第 17 问」
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

- **运行时机**：开发期手动运行（`node scripts/sync-providers.mjs`），或 `--fetch` 重新拉取 OpenRouter；建议每周一次
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
- [ ] 供应商选择 UI（随 P2 徽章墙样式实现）
- [ ] 占位图标组件（灰色问号方块，SVG）
- [ ] 结果页展示（随 P2 Verdict 实现）
- [ ] 分享图展示（随 P3 实现）
