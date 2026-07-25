/**
 * test-copy.mjs —— P3 随机文案与直链单元测试
 * 运行：node --test scripts/test-copy.mjs
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateShareCopy, generatePermalink } from '../src/app/lib/copy.ts';
import { PERSONALITIES } from '../src/app/lib/personalities.ts';

function seededRng(seed = 42) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 2 ** 32;
    return s / 2 ** 32;
  };
}

test('16 种类型都能生成四段式文案且包含编码', () => {
  for (const p of PERSONALITIES) {
    const copy = generateShareCopy(p.code, seededRng(1));
    const paragraphs = copy.split('\n\n');
    assert.equal(paragraphs.length, 4, `${p.code} 应为四段`);
    assert.ok(copy.includes(p.code), `${p.code} 文案应含编码`);
    assert.ok(copy.includes('closeai.moe'), '结尾应含域名');
  }
});

test('同一类型不同种子生成不同文案（随机性）', () => {
  const a = generateShareCopy('DBMO', seededRng(1));
  const b = generateShareCopy('DBMO', seededRng(999));
  assert.notEqual(a, b);
});

test('无效编码有兜底文案', () => {
  const copy = generateShareCopy('XXXX', seededRng(1));
  assert.ok(copy.includes('XXXX'));
  assert.equal(copy.split('\n\n').length, 4);
});

test('直链格式正确', () => {
  assert.equal(
    generatePermalink('DBMO', 'https://closeai.moe'),
    'https://closeai.moe/?r=DBMO',
  );
});
