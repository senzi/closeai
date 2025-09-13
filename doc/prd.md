# closeai.moe 主页互动 PRD

## 1. 产品定位

* **主题**：How Close Are You to AI?
* **目标**：通过轻量问卷让用户自我反思“和 AI 的关系”，生成一张个性化的分享卡片，方便在微博/朋友圈/Twitter 等平台传播。
* **基调**：中性 → 引导思考（不是宣传 AI，也不是批判 AI）。
* **交互风格**：简洁、轻盈、无负担。

---

## 2. 技术约束

* **纯前端，无后端**
* **构建工具**：bun + vite + vue
* **UI 框架**：daisyUI（通过 CDN 引入，`dim` 主题，黑白灰基调）
* **卡片导出**：使用 [@zumer/snapdom](https://github.com/zumer/snapdom) 将 DOM 转为图片（代替 html2canvas/canvas）
* **数据存储**：URL 参数 + 本地存储（可选）
* **部署方式**：静态网站（可直接部署到 vercel、cloudflare、netlify 等）

---

## 3. 页面结构

### 3.1 Hero 区

* **元素**：

  * Logo：`closeai.moe`（字重 800）
  * Slogan：How Close Are You to AI?
  * CTA 按钮：「开始测一测」
* **风格**：dim 主题黑白灰，背景留白，重点用 `brand-accent`。

---

### 3.2 Nudge 区（引导文案）

* 中文：

  > 与 AI 的“Close”到底好不好？会不会太 close 或太保守？先回答几个问题，看看你的「亲密画像」。
* 英文：

  > Is being “close” to AI good or bad? Too close, or too distant? Answer a few questions and see your profile.

---

### 3.3 问卷区

#### A. 使用场景强度（5 条滑杆）

* **问题**：你在这些场景里用 AI 的程度有多少？
* **交互**：daisyUI `range` 组件（0–100）
* **场景**：

  1. 编程 / 技术
  2. 写作 / 创意
  3. 学习 / 搜索
  4. 日常 / 聊天
  5. 事务 / 打杂

#### B. 偏好模型厂商

* **问题**：你最常使用/最喜欢的模型或平台是？

* **交互**：以 **tag/徽章按钮** 的形式展示，每个选项带有模型 logo，点击可选中/取消；用户最多可选择 **3 个**。

* **选项**（固定集合）：

  * **OpenAI GPT**
  * **Anthropic Claude**
  * **Google Gemini**
  * **Meta Llama**
  * **xAI Grok**
  * **Qwen（通义）**
  * **Doubao（豆包）**
  * **DeepSeek**
  * **GLM（智谱）**
  * **Moonshot Kimi（月之暗面）**
  * **其他**（自定义输入框，仅能填 1 个，作为补充）

* **说明**：

  * 视觉风格：使用 daisyUI 的 `badge` 或 `btn` 标签风格，dim 主题黑白灰配色，选中时高亮为品牌 accent 色。
  * 交互逻辑：点击切换选中状态，最多 3 个，超出则给出提示。
  * 结果存储：返回数组，如 `["OpenAI GPT","Qwen","其他: Phi-4"]`。
  * 在结果卡片中：显示已选的厂商 tag + logo，按选择顺序或热度排序。


#### C. 三个维度滑杆

1. Closeness（亲密度） → 滑杆（0–100）
2. Dependence（依赖度） → 滑杆（0–100）
3. Skepticism（怀疑/校验强度） → 滑杆（0–100）

---

### 3.4 结果计算逻辑

* **输入**：

  * 使用场景强度（五个 0–100 数值）
  * 模型厂商（字符串）
  * Closeness / Dependence / Skepticism（0–100 数值）

* **算法**：

  * Archetype 原型由 Dependence (D) 与 Skepticism (S) 决定：

    * 高 D 高 S → 审慎共创者
    * 高 D 低 S → 依赖驱动者
    * 低 D 高 S → 克制怀疑者
    * 低 D 低 S → 观察者
    * 中间 → Explorer / 平衡者
  * Closeness (C) 用于修饰结果文案：

    * C ≥ 80 → 提醒「留意自动驾驶模式」
    * C ≤ 30 → 提醒「也许可以尝试一些低风险应用」

---

### 3.5 结果卡片（DOM → 图片）

* **信息层级**：

  1. 大字：Closeness %
  2. 原型徽章（Archetype 名称 + 提示语）
  3. 模型厂商
  4. 使用场景 TOP3（用 Chip 标签显示）
  5. Dependence / Skepticism / Closeness 三维度条形
  6. 使用场景强度条形（五类）
  7. Footer：`Think with care · Share with style` + closeai.moe Logo

* **风格**：

  * 黑白灰 dim 主题（daisyUI theme=dim）
  * 卡片圆角 2xl，阴影 soft-xl
  * 条形图用灰底 + brand-accent 渐变

* **导出**：

  * 点击按钮 → snapdom 截取卡片 DOM → 导出 PNG
  * 下载按钮 + 一键复制分享文本

---

## 4. 用户交互流程

1. 进入首页 → Hero（开始测一测）
2. Nudge 文案（引导思考）
3. 问卷区（场景滑杆 → 模型 → 三维度滑杆）
4. 实时结果预览（Archetype + 提示语）
5. 点击「生成卡片」 → 生成 DOM 卡片 → snapdom 转 PNG
6. 下载图片 / 复制链接 / 复制文本摘要

---

## 5. 开发说明

### 5.1 通过 CDN 引入 daisyUI

```html
<head>
  <link href="https://cdn.jsdelivr.net/npm/daisyui@5" rel="stylesheet" type="text/css" />
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
</head>
```

### 5.2 主题设置

```html
<html data-theme="dim">
```

### 5.3 snapdom 使用

```js
import snapdom from "https://cdn.jsdelivr.net/npm/@zumer/snapdom/dist/index.min.js";

async function exportCard() {
  const card = document.getElementById("result-card");
  const img = await snapdom.toImage(card);
  const link = document.createElement("a");
  link.download = "closeai-card.png";
  link.href = img.src;
  link.click();
}
```
