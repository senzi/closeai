# 供应商数据维护手册（ProviderPicker「第 9 问」）

> 适用范围：`scripts/sync-providers.mjs`、`src/app/lib/providers.json`、`public/icons/providers/`
>
> 原则：**运行时全静态**。前端只消费仓库里已提交的 `providers.json` 和本地图标，
> 构建、部署、线上运行都不访问任何外部 API。本脚本仅供本地人工维护使用。

## 数据来源

| 内容 | 来源 | 说明 |
| --- | --- | --- |
| 供应商清单 | OpenRouter `GET /api/v1/models` | 按模型 id 前缀（`provider/model`）统计 |
| 图标 | `@lobehub/icons-static-png`（npmmirror CDN，dark 主题 PNG） | 缓存到 `public/icons/providers/` |

## 日常使用

```bash
node scripts/sync-providers.mjs            # 用 scripts/data/ 下的缓存数据重新生成（最常用）
node scripts/sync-providers.mjs --fetch    # 重新拉取 OpenRouter API 后再生成
node scripts/sync-providers.mjs --no-icons # 跳过图标下载
```

改完任何规则（热门清单、别名、排除清单）都只需重新跑一遍默认命令，然后提交
`providers.json` 与新增的图标 PNG。

## 排名规则

OpenRouter 的 models API **没有热度 / 用量 / 排名字段**，唯一可用的客观信号是
`modelCount`（该供应商在架模型数）。因此：

- **热门区**（默认展示，无需展开）：人工产品判断，写在脚本的 `HOT_PROVIDERS` 里，
  数组顺序即展示顺序。真实用户量 ≠ 模型数（豆包、Kimi 模型少但用户多），
  所以这里不强求数据驱动；
- **展开区**：其余供应商按 `modelCount` 降序排列。

## 去重与排除规则（脚本内 `normalizeId` / `MERGE_MAP` / `EXCLUDE_IDS`）

1. **`~` 前缀合并**：`~openai`、`~anthropic` 等是 OpenRouter 的变体 slug，
   与主条目重复，统计前去掉前缀合并；
2. **同义 ID 合并**（`MERGE_MAP`）：`meta` → `meta-llama`，`bytedance` → `bytedance-seed`，
   `modelCount` 累加；
3. **排除清单**（`EXCLUDE_IDS`，两类）：
   - 个人微调作者 / 社区上传者：thedrummer、sao10k、undi95、gryphe、mancer、
     cognitivecomputations、anthracite-org；
   - 无 lobehub 图标且辨识度不足的小众供应商（产品确认剔除）：poolside、
     inclusionai、nex-agi、arcee-ai、rekaai、relace、morph、meituan、
     thinkingmachines、sakana、perceptron、inception、writer、allenai、deepcogito。
   例外保留：`xiaomi`（展示名 MiMo（小米））无图标，用 monogram「M」占位。

新增规则时按同样格式加进对应常量即可。

## 图标规则

- 映射表：`ALIAS_MAP`（OpenRouter ID → lobehub slug），注意 `z-ai` → `zai`（不是 xai）；
- 品牌对齐的图标选择：`google` → `gemini`、`moonshotai` → `kimi`、
  `bytedance-seed` → `doubao`、`tencent` → `hunyuan`、`baidu` → `wenxin`
  （用产品品牌图标，不用公司品牌图标）；
- 校验：脚本对照 `scripts/data/lobehub_dark_icons.json`（PNG 包真实文件清单），
  清单里没有的 slug 标记 `iconAvailable: false`；
- PNG 包只有约 285 个基础图标。**无图标的供应商前端显示首字符 monogram 占位块**
  （当前仅 MiMo 一家），这是预期行为，不是 bug；
- 图标只增不删：已缓存的 PNG 重复运行不会重新下载。

## 前端契约

`providers.json` 字段：`id`、`name`、`icon`（slug 或 null）、`iconAvailable`、
`modelCount`、`hot`。`maxSelectable`（当前 3）控制选择上限——**自定义「其他」
也占 1 个名额**，由 `ProviderPicker` 在交互层强制执行。

## 相关文件

- `scripts/sync-providers.mjs` —— 本脚本
- `src/app/components/ProviderPicker.tsx` —— 选择题 UI
- `src/app/components/ShareCard.tsx` / `src/app/sections/Verdict.tsx` —— 供应商标签展示
- `D:\Downloads\openrouter_icon_match_report.md` —— 早期图标匹配调研（历史参考，其中
  「z-ai → xai」的结论有误，以脚本为准）
