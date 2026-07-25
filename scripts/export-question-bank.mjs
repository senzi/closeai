/**
 * export-question-bank.mjs —— 导出题库为可批注的 Markdown 审查文档
 *
 * 运行：node scripts/export-question-bank.mjs
 * 产物：docs/question-bank.md（自动生成，勿手改——改题库请改 src/app/lib/quiz.ts 后重新导出）
 */

import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { QUESTION_BANK } from '../src/app/lib/quiz.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'docs', 'question-bank.md');

const DIMENSION_META = {
  AD: { title: '维度 1：Autonomy ↔ Dependency（自主 ↔ 依赖）', left: 'A 自主', right: 'D 依赖' },
  BS: { title: '维度 2：Belief ↔ Skepticism（信仰 ↔ 怀疑）', left: 'B 信仰', right: 'S 怀疑' },
  MC: { title: '维度 3：Maker ↔ Consumer（创造 ↔ 消费）', left: 'M 创造', right: 'C 消费' },
  OG: { title: '维度 4：Open ↔ Guarded（开放 ↔ 设防）', left: 'O 开放', right: 'G 设防' },
};

const lines = [
  '# 题库审查文档（自动生成）',
  '',
  `> 由 \`scripts/export-question-bank.mjs\` 从 \`src/app/lib/quiz.ts\` 生成。`,
  '> **批注请直接写在本文件上**；但修改题目本体请改 `quiz.ts` 的 `QUESTION_BANK`，然后重新运行导出脚本同步。',
  `> 生成时间：${new Date().toISOString()}`,
  '',
  '---',
  '',
];

for (const [dim, meta] of Object.entries(DIMENSION_META)) {
  const questions = QUESTION_BANK.filter((q) => q.dimension === dim);
  lines.push(`## ${meta.title}`);
  lines.push('');
  for (const q of questions) {
    lines.push(`### ${q.id}（权重 ${q.weight}）`);
    lines.push('');
    q.variants.forEach((v, i) => {
      const variantLabel = q.variants.length > 1 ? `变体 ${i + 1}` : '题面';
      lines.push(`**${variantLabel}**：${v.text}`);
      lines.push('');
      for (const opt of v.options) {
        const pole = opt.value === q.dimension[0] ? meta.left : meta.right;
        lines.push(`- 选项 → **${pole}**：${opt.label}`);
      }
      lines.push('');
    });
    lines.push('<!-- 批注区 -->');
    lines.push('');
  }
  lines.push('---');
  lines.push('');
}

await writeFile(OUT, lines.join('\n'));
console.log(`[done] ${QUESTION_BANK.length} questions → ${path.relative(process.cwd(), OUT)}`);
