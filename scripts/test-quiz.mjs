/**
 * test-quiz.mjs —— P1 题库 / 抽题 / 评分单元测试
 *
 * 运行：node --test scripts/test-quiz.mjs
 * （Node 24 原生剥离 TS 类型，可直接 import .ts 文件）
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  QUESTION_BANK,
  drawQuestions,
  calculateResult,
  QUESTIONS_PER_DIMENSION,
  TOTAL_QUESTIONS,
  AXIS_MARGIN,
} from '../src/app/lib/quiz.ts';
import {
  PERSONALITIES,
  getPersonalityByCode,
  isValidTypeCode,
} from '../src/app/lib/personalities.ts';

// 可复现的伪随机源（LCG）
function seededRng(seed = 42) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 2 ** 32;
    return s / 2 ** 32;
  };
}

// ---------- 题库完整性 ----------

test('题库共 24 题，每维度 6 题', () => {
  assert.equal(QUESTION_BANK.length, 24);
  for (const dim of ['AD', 'BS', 'MC', 'OG']) {
    assert.equal(
      QUESTION_BANK.filter((q) => q.dimension === dim).length,
      6,
      `${dim} 应有 6 题`,
    );
  }
});

test('每题 id 唯一、选项恰好 2 个、权重合法', () => {
  const ids = new Set();
  for (const q of QUESTION_BANK) {
    assert.ok(!ids.has(q.id), `重复 id: ${q.id}`);
    ids.add(q.id);
    assert.ok([1.0, 1.5].includes(q.weight), `${q.id} 权重非法`);
    assert.ok(q.variants.length >= 1, `${q.id} 至少一套变体`);
    for (const v of q.variants) {
      assert.equal(v.options.length, 2, `${q.id} 选项数`);
      // 两个选项必须分别指向该维度的两极（顺序无关）
      const values = new Set(v.options.map((o) => o.value));
      assert.deepEqual(
        values,
        new Set([q.dimension[0], q.dimension[1]]),
        `${q.id} 选项极性不匹配维度`,
      );
    }
  }
});

// ---------- 抽题 ----------

test('抽题返回 8 题，每维度恰好 2 题，无重复', () => {
  const drawn = drawQuestions(QUESTION_BANK, seededRng(1));
  assert.equal(drawn.length, TOTAL_QUESTIONS);
  for (const dim of ['AD', 'BS', 'MC', 'OG']) {
    assert.equal(
      drawn.filter((q) => q.dimension === dim).length,
      QUESTIONS_PER_DIMENSION,
    );
  }
  assert.equal(new Set(drawn.map((q) => q.id)).size, drawn.length, '抽题不应重复');
});

test('不同种子抽出不同组合（复测新鲜感）', () => {
  const a = drawQuestions(QUESTION_BANK, seededRng(1)).map((q) => q.id).join();
  const b = drawQuestions(QUESTION_BANK, seededRng(999)).map((q) => q.id).join();
  assert.notEqual(a, b);
});

// ---------- 评分 ----------

function answerAll(drawn, pick) {
  return drawn.map((q) => ({
    questionId: q.id,
    dimension: q.dimension,
    weight: q.weight,
    value: pick(q),
  }));
}

test('全选左极 → ABMO，全选右极 → DSCG', () => {
  const drawn = drawQuestions(QUESTION_BANK, seededRng(7));
  const leftOf = { AD: 'A', BS: 'B', MC: 'M', OG: 'O' };
  const rightOf = { AD: 'D', BS: 'S', MC: 'C', OG: 'G' };

  const r1 = calculateResult(answerAll(drawn, (q) => leftOf[q.dimension]));
  assert.equal(r1.code, 'ABMO');
  assert.ok(r1.dimensions.every((d) => !d.borderline));

  const r2 = calculateResult(answerAll(drawn, (q) => rightOf[q.dimension]));
  assert.equal(r2.code, 'DSCG');
});

test('展示位置：极端结果内缩不贴端点，且每维度抖动不同', () => {
  const drawn = drawQuestions(QUESTION_BANK, seededRng(7));
  const leftOf = { AD: 'A', BS: 'B', MC: 'M', OG: 'O' };

  // 全左极端：raw ratio = 1，但 displayRatio 必须 ≤ 1 - AXIS_MARGIN
  const r = calculateResult(answerAll(drawn, (q) => leftOf[q.dimension]), seededRng(11));
  for (const d of r.dimensions) {
    assert.equal(d.ratio, 1);
    assert.ok(d.displayRatio <= 1 - AXIS_MARGIN + 1e-9, `${d.dimension} 贴到端点了`);
    assert.ok(d.displayRatio >= AXIS_MARGIN - 1e-9);
  }
  // 每维度抖动不同：displayRatio 不应全部相等
  const unique = new Set(r.dimensions.map((d) => d.displayRatio.toFixed(4)));
  assert.ok(unique.size > 1, '各维度抖动应不同');
});

test('双 1.0 平局取左极并标记 borderline', () => {
  const answers = [
    { questionId: 'AD-1', dimension: 'AD', weight: 1.0, value: 'A' },
    { questionId: 'AD-3', dimension: 'AD', weight: 1.0, value: 'D' },
    { questionId: 'BS-1', dimension: 'BS', weight: 1.0, value: 'B' },
    { questionId: 'BS-3', dimension: 'BS', weight: 1.0, value: 'S' },
    { questionId: 'MC-1', dimension: 'MC', weight: 1.0, value: 'M' },
    { questionId: 'MC-3', dimension: 'MC', weight: 1.0, value: 'C' },
    { questionId: 'OG-1', dimension: 'OG', weight: 1.0, value: 'O' },
    { questionId: 'OG-3', dimension: 'OG', weight: 1.0, value: 'G' },
  ];
  const r = calculateResult(answers);
  assert.equal(r.code, 'ABMO');
  assert.ok(r.dimensions.every((d) => d.borderline));
  assert.ok(r.dimensions.every((d) => d.ratio === 0.5));
});

test('权重 1.5 击败对向 1.0（不产生平局）', () => {
  const answers = [
    { questionId: 'AD-2', dimension: 'AD', weight: 1.5, value: 'D' },
    { questionId: 'AD-1', dimension: 'AD', weight: 1.0, value: 'A' },
    { questionId: 'BS-1', dimension: 'BS', weight: 1.0, value: 'B' },
    { questionId: 'BS-3', dimension: 'BS', weight: 1.0, value: 'B' },
    { questionId: 'MC-1', dimension: 'MC', weight: 1.0, value: 'M' },
    { questionId: 'MC-3', dimension: 'MC', weight: 1.0, value: 'M' },
    { questionId: 'OG-1', dimension: 'OG', weight: 1.0, value: 'O' },
    { questionId: 'OG-3', dimension: 'OG', weight: 1.0, value: 'O' },
  ];
  const r = calculateResult(answers);
  const ad = r.dimensions.find((d) => d.dimension === 'AD');
  assert.equal(ad.pole, 'D');
  assert.equal(ad.borderline, false);
});

// ---------- 类型库 ----------

test('16 种类型全部定义且编码合法、唯一', () => {
  assert.equal(PERSONALITIES.length, 16);
  const codes = new Set(PERSONALITIES.map((p) => p.code));
  assert.equal(codes.size, 16);
  for (const p of PERSONALITIES) {
    assert.ok(isValidTypeCode(p.code), `${p.code} 编码非法`);
    for (const field of ['nameZh', 'nameEn', 'tagline', 'description', 'relationship', 'warning', 'emoji']) {
      assert.ok(p[field]?.length > 0, `${p.code}.${field} 为空`);
    }
  }
});

test('getPersonalityByCode 命中与未命中', () => {
  assert.equal(getPersonalityByCode('DBMO')?.nameZh, '先知');
  assert.equal(getPersonalityByCode('XXXX'), undefined);
});

test('isValidTypeCode 校验', () => {
  assert.ok(isValidTypeCode('ABMO'));
  assert.ok(isValidTypeCode('DSCG'));
  assert.ok(!isValidTypeCode('ABCE')); // 旧版编码不再合法
  assert.ok(!isValidTypeCode('abmo'));
  assert.ok(!isValidTypeCode('ABMOO'));
});
