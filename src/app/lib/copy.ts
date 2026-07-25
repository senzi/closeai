/**
 * copy.ts —— 随机分享文案模板库（docs/P3-sharing-polish.md §2）
 *
 * 结构：开场白（共享池）+ 类型揭示（模板插值）+ 一句评价（按类型）+ 结尾号召（共享池）
 * 每次生成随机组合，保证两次分享的文案大概率不同。
 *
 * 语调约定：轻微自嘲、略带讽刺但不攻击、有传播欲、不解释太多。
 */

import { getPersonalityByCode } from './personalities.ts';

// ---------- 共享插槽池 ----------

const OPENINGS = [
  '测了一下我和 AI 的关系，结果有点意思。',
  '原来我在 AI 眼里是这样的……',
  '一个残酷的自我认知测试。',
  'OpenAI 不会告诉你的真相。',
  '花了一分钟，被一个网站看穿了。',
  '本来只是随便测测，结果沉默了。',
  '这年头连测试都开始讽刺人了。',
  '我和 AI 的关系，被四个字母定义了。',
];

const CLOSINGS = [
  '你也来测测？→ closeai.moe',
  'How Close Are You to AI? → closeai.moe',
  '测完告诉我你是什么类型 → closeai.moe',
  '敢不敢晒出你的编码？closeai.moe',
  '一分钟，四个字母 → closeai.moe',
  '链接在这，自测自觉 → closeai.moe #closeai',
];

// ---------- 按类型的「一句评价」 ----------

const COMMENTS: Record<string, string[]> = {
  ABMO: [
    '「AI 是你画笔的延伸」——希望画笔永远不知道这一点。',
    '署名是我的，这就够了。大概。',
  ],
  ABMG: [
    '关起门来铸剑，打开门只说「随便玩玩」。',
    '我的作坊，我的炉火，我的秘密。',
  ],
  ABCO: [
    '不造浪，只乘浪——浪不记得我，我也不需要它记得。',
    '玩得开心就是对浪潮最好的尊重。',
  ],
  ABCG: [
    '站在瞭望塔上看得最清楚，也可能看得太久。',
    '不是不上车，是想看清车往哪开。',
  ],
  ASMO: [
    '不信神话，只信手艺。',
    '刨子不需要信仰，只需要锋利。',
  ],
  ASMG: [
    '我造的东西，钥匙只在我自己手里。',
    '锁匠的安全感是造出来的，不是享受出来的。',
  ],
  ASCO: [
    'AI 只是效率工具，别多想——我也是这么跟自己说的。',
    '一手交提示词，一手交结果，两讫。',
  ],
  ASCG: [
    '墙外在高喊未来，墙内岁月静好。',
    '这可能是最清醒的姿势，也可能是最孤独的。',
  ],
  DBMO: [
    '「你比 AI 更相信 AI」——这话像赞美，又像诊断。',
    '我已经是它在人间的代理人了，你呢？',
  ],
  DBMG: [
    '在封闭的花园里共建，花园的门谢绝参观。',
    '种在别人花盆里的花，盛开得也很好。',
  ],
  DBCO: [
    '虔诚是真的，圣物不一定神圣。',
    '参与本身就是意义——朝圣者都这么说。',
  ],
  DBCG: [
    '离不开，也不承认。隐秘的亲密也是亲密。',
    '我的教堂只有一扇门，钥匙在我手里。',
  ],
  DSMO: [
    '一边嫌弃一边依赖，这是这个时代最诚实的精神状态。',
    '互相嫌弃，谁也离不开谁。',
  ],
  DSMG: [
    '在暗房里冲洗底片的人，知道底片也是证据。',
    '一起做事，互不声张。',
  ],
  DSCO: [
    '知道这杯酒解决不了问题，但每天还是来。',
    '习惯是最不需要信仰的东西。',
  ],
  DSCG: [
    '站在门外看里面的人狂欢，心里只有一句：至于吗？',
    '我和 AI 几乎没有关系——这本身就是我们的关系。',
  ],
};

// ---------- 生成逻辑 ----------

const pick = <T,>(arr: T[], rng: () => number): T =>
  arr[Math.floor(rng() * arr.length)];

/**
 * 生成一段随机分享文案（四段式，换行分隔）。
 * rng 可注入（测试用）。
 */
export function generateShareCopy(code: string, rng: () => number = Math.random): string {
  const personality = getPersonalityByCode(code);

  const opening = pick(OPENINGS, rng);
  const reveal = personality
    ? pick(
        [
          `我的 AI 亲近度类型是 ${code} —— ${personality.nameZh}。`,
          `诊断结果：${code}（${personality.nameZh}）。`,
          `它说我是「${personality.nameZh}」。`,
        ],
        rng,
      )
    : `我的 AI 亲近度类型是 ${code}。`;
  const commentPool = COMMENTS[code] ?? ['有点准，有点吓人。'];
  const comment = pick(commentPool, rng);
  const closing = pick(CLOSINGS, rng);

  return [opening, reveal, comment, closing].join('\n\n');
}

/** 分享链接（结果直链，P3 §3.3） */
export function generatePermalink(code: string, origin?: string): string {
  const base = origin ?? (typeof window !== 'undefined' ? window.location.origin : 'https://closeai.moe');
  return `${base}/?r=${code}`;
}
