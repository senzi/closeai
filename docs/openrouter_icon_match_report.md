# OpenRouter Provider × @lobehub/icons 匹配分析报告

> 生成时间: 2026-07-25
> 数据源: `https://openrouter.ai/api/v1/models`
> 图标源: `@lobehub/icons-static-png` (npm, latest)

---

## 1. 数据概览

| 指标 | 值 |
|------|-----|
| OpenRouter 总模型数 | 345 |
| 唯一 Provider 数 | 58 |
| @lobehub/icons 匹配数 | **58 / 58 (100%)** |

**结论：@lobehub/icons 覆盖了 OpenRouter 上全部 58 个 provider 的图标，匹配率 100%。**

---

## 2. TOP 30 Provider 排行（按模型数量）

| # | Provider | 模型数 | 匹配 Icon | 匹配方式 |
|---|----------|--------|-----------|----------|
| 1 | openai | 67 | `openai` | ✅ 直接 |
| 2 | qwen | 47 | `qwen` | ✅ 直接 |
| 3 | google | 30 | `google` | ✅ 直接 |
| 4 | mistralai | 19 | `mistral` | ✅ 别名 |
| 5 | anthropic | 17 | `anthropic` | ✅ 直接 |
| 6 | z-ai | 12 | `xai` | ✅ 别名 |
| 7 | deepseek | 11 | `deepseek` | ✅ 直接 |
| 8 | nvidia | 10 | `nvidia` | ✅ 直接 |
| 9 | minimax | 8 | `minimax` | ✅ 直接 |
| 10 | meta-llama | 8 | `meta-llama` | ✅ 直接 |
| 11 | moonshotai | 7 | `moonshot` | ✅ 别名 |
| 12 | poolside | 6 | `poolside` | ✅ 直接 |
| 13 | openrouter | 6 | `openrouter` | ✅ 直接 |
| 14 | x-ai | 5 | `x-ai` | ✅ 直接 |
| 15 | cohere | 5 | `cohere` | ✅ 直接 |
| 16 | amazon | 5 | `amazon` | ✅ 直接 |
| 17 | perplexity | 5 | `perplexity` | ✅ 直接 |
| 18 | inclusionai | 4 | `inclusionai` | ✅ 直接 |
| 19 | aion-labs | 4 | `aionlabs` | ✅ 别名 |
| 20 | ~anthropic | 4 | `anthropic` | ✅ 别名 |
| 21 | bytedance-seed | 4 | `bytedance` | ✅ 别名 |
| 22 | thedrummer | 4 | `thedrummer` | ✅ 直接 |
| 23 | nousresearch | 4 | `nousresearch` | ✅ 直接 |
| 24 | kwaipilot | 3 | `kwaipilot` | ✅ 直接 |
| 25 | tencent | 3 | `tencent` | ✅ 直接 |
| 26 | sao10k | 3 | `sao10k` | ✅ 直接 |
| 27 | nex-agi | 2 | `nex-agi` | ✅ 直接 |
| 28 | stepfun | 2 | `stepfun` | ✅ 直接 |
| 29 | ibm-granite | 2 | `ibm` | ✅ 别名 |
| 30 | ~openai | 2 | `openai` | ✅ 别名 |

---

## 3. 需要别名映射的 Provider

以下 OpenRouter provider ID 与 @lobehub/icons slug 不完全一致，需要映射：

```json
{
  "mistralai": "mistral",
  "z-ai": "xai",
  "moonshotai": "moonshot",
  "aion-labs": "aionlabs",
  "bytedance-seed": "bytedance",
  "ibm-granite": "ibm",
  "~anthropic": "anthropic",
  "~openai": "openai",
  "~google": "google",
  "~x-ai": "xai",
  "~moonshotai": "moonshot",
  "arcee-ai": "arcee",
  "rekaai": "reka"
}
```

> `~` 前缀是 OpenRouter 的 "fallback" 变体标记，映射到对应主 provider。

---

## 4. CDN 使用方式

### PNG（推荐用于 closeai.moe 卡片）

```html
<!-- 深色主题 -->
<img src="https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/openai.png" />

<!-- 浅色主题 -->
<img src="https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/openai.png" />
```

### SVG（推荐用于 React 项目）

```bash
npm i @lobehub/icons
```

```jsx
import { OpenAI } from '@lobehub/icons';
<OpenAI size={24} />
```

---

## 5. 缓存文件清单

以下文件已保存在 `D:\Downloads\`：

| 文件 | 说明 |
|------|------|
| `openrouter_models_raw.json` | OpenRouter API 原始响应 (535KB, 345 models) |
| `openrouter_providers.json` | Provider 汇总（排名+样本模型） |
| `openrouter_icon_match.json` | 完整匹配结果（58 providers） |

---

## 6. 结论与建议

1. **@lobehub/icons 覆盖率极高**：58/58 = 100%，不需要自行维护图标
2. **别名映射是唯一成本**：约 13 个 provider 需要 ID → icon slug 的映射
3. **CDN 直接可用**：`registry.npmmirror.com` 国内访问快，无需 npm 安装
4. **后续同步流程**：
   - 每周拉一次 OpenRouter API
   - 用别名映射表转换 provider ID → icon slug
   - 生成 `providers.json` 供前端使用
