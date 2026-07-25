/**
 * export-copy-templates.mjs —— 导出分享文案模板库为可批注的 Markdown 审查文档
 *
 * 运行：node scripts/export-copy-templates.mjs
 * 产物：docs/copy-templates.md（自动生成，勿手改——改文案请改 src/app/lib/copy.ts 后重新导出）
 */

import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { OPENINGS, CLOSINGS, COMMENTS } from '../src/app/lib/copy.ts';
import { PERSONALITIES } from '../src/app/lib/personalities.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'docs', 'copy-templates.md');

const NAME_BY_CODE = Object.fromEntries(PERSONALITIES.map((p) => [p.code, p.nameZh]));

const lines = [
  '# 分享文案模板审查文档（自动生成）',
  '',
  '> 由 `scripts/export-copy-templates.mjs` 从 `src/app/lib/copy.ts` 生成。',
  '> **批注请直接写在本文件上**；但修改文案本体请改 `copy.ts` 的模板池，然后重新运行导出脚本同步。',
  `> 生成时间：${new Date().toISOString()}`,
  '',
  '文案结构：开场白（共享池随机 1 条）→ 类型揭示（模板随机 1 种）→ 一句评价（按类型随机 1 条）→ 结尾号召（共享池随机 1 条）。',
  '语调要求：暗戳戳，不点名、不直球，用气质嘲讽。',
  '',
  '---',
  '',
  `## 一、开场白（共享池，${OPENINGS.length} 条）`,
  '',
  ...OPENINGS.flatMap((t, i) => [`${i + 1}. ${t}`, '']),
  '<!-- 批注区 -->',
  '',
  '---',
  '',
  `## 二、结尾号召（共享池，${CLOSINGS.length} 条）`,
  '',
  ...CLOSINGS.flatMap((t, i) => [`${i + 1}. ${t}`, '']),
  '<!-- 批注区 -->',
  '',
  '---',
  '',
  '## 三、类型揭示模板（5 种，`${code}` 与类型名运行时插值）',
  '',
  '1. 我的 AI 亲近度类型是 {code} —— {类型名}。',
  '2. 诊断结果：{code}（{类型名}）。',
  '3. 它说我是「{类型名}」。',
  '4. 四个字母：{code}。翻译一下：{类型名}。',
  '5. {code}，「{类型名}」。行吧，认了。',
  '',
  '<!-- 批注区 -->',
  '',
  '---',
  '',
  `## 四、按类型的「一句评价」（每类型 ${COMMENTS[Object.keys(COMMENTS)[0]]?.length ?? 0} 条）`,
  '',
];

for (const [code, comments] of Object.entries(COMMENTS)) {
  lines.push(`### ${code} ${NAME_BY_CODE[code] ?? ''}`);
  lines.push('');
  comments.forEach((t, i) => {
    lines.push(`${i + 1}. ${t}`);
  });
  lines.push('');
  lines.push('<!-- 批注区 -->');
  lines.push('');
}

await writeFile(OUT, lines.join('\n'));
console.log(`[done] copy templates → ${path.relative(process.cwd(), OUT)}`);
