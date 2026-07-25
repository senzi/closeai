/**
 * quiz.ts —— P1 题库、抽题与评分（docs/P1-dimension-system.md v2）
 *
 * 设计要点：
 * - 题库 40 题（每维度 10 题），单次测试每维度抽 2 题共 8 题，跨维度打乱
 * - 题组变体：同一道题可有若干套完整变体（题面+选项整套替换）
 * - 评分含权重（1.0 / 1.5）与平局规则：双 1.0 平局取左极并标记 borderline
 *
 * 本文件运行时不依赖其他模块（type-only import 会被擦除），
 * 因此可以直接被 Node 24 的 test runner 加载做单元测试。
 */

import type { Pole, DimensionId } from '../types';

// ---------- 数据结构 ----------

export interface Option {
  /** 选项文字 */
  label: string;
  /** 该选项计向哪一极 */
  value: Pole;
  /** 倾向描述（结果页细节展示备用） */
  trait: string;
}

/** 一套完整变体：题面 + 选项（变体改变情境时选项整套替换） */
export interface QuestionVariant {
  text: string;
  options: [Option, Option];
}

export interface Question {
  id: string;
  dimension: DimensionId;
  weight: 1.0 | 1.5;
  variants: QuestionVariant[];
}

/** 抽题后的单题（变体已定、选项已洗牌） */
export interface DrawnQuestion {
  id: string;
  dimension: DimensionId;
  weight: 1.0 | 1.5;
  text: string;
  options: [Option, Option];
}

export interface QuizAnswer {
  questionId: string;
  dimension: DimensionId;
  weight: number;
  /** 用户选中的极 */
  value: Pole;
  /** 思考时长（ms），辅助数据，暂不展示 */
  thinkingMs?: number;
}

export interface DimensionScore {
  dimension: DimensionId;
  /** 判定结果 */
  pole: Pole;
  /** 左极得分 / 右极得分（含权重） */
  left: number;
  right: number;
  /** 左极占比 0~1（原始值，可能是 0 或 1 的极端） */
  ratio: number;
  /** 展示用占比：内缩 + 每维度随机抖动后的值，范围 [AXIS_MARGIN, 1-AXIS_MARGIN] */
  displayRatio: number;
  /** 双 1.0 平局（取左极）时标记 true */
  borderline: boolean;
}

export interface QuizResult {
  /** 4 位类型编码，如 "DBMO" */
  code: string;
  dimensions: DimensionScore[];
  answers: QuizAnswer[];
}

// ---------- 常量 ----------

export const QUESTIONS_PER_DIMENSION = 2;
export const TOTAL_QUESTIONS = 8;

/**
 * 结果轴展示参数：
 * 光点永远不落在端点上——即使某维度两题全选同一极，
 * 也会向内缩。内缩量本身是每维度随机的（AXIS_MARGIN ~ AXIS_MARGIN+AXIS_JITTER），
 * 所以即使四个维度都是极端值，光点到端点的距离也各不相同；
 * 非极端值再叠加 ±AXIS_JITTER/2 的展示抖动。
 */
export const AXIS_MARGIN = 0.08;
export const AXIS_JITTER = 0.06;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

const DIMENSIONS: DimensionId[] = ['AD', 'BS', 'MC', 'OG'];

const POLE_PAIRS: Record<DimensionId, { left: Pole; right: Pole }> = {
  AD: { left: 'A', right: 'D' },
  BS: { left: 'B', right: 'S' },
  MC: { left: 'M', right: 'C' },
  OG: { left: 'O', right: 'G' },
};

// ---------- 题库（40 题，每维度 10 题） ----------

export const QUESTION_BANK: Question[] = [
  // ======== Dimension AD: Autonomy ↔ Dependency ========
  {
    id: 'AD-1', dimension: 'AD', weight: 1.0,
    variants: [
      {
        text: 'AI 帮你写了一封重要邮件，你会？',
        options: [
          { label: '直接发送，它写得比我好', value: 'D', trait: '信任 delegator' },
          { label: '逐句修改，保持我的语气', value: 'A', trait: '自主 editor' },
        ],
      },
      {
        text: 'AI 给了一个和你直觉相反的建议，你第一反应是？',
        options: [
          { label: '先试试 AI 的方案', value: 'D', trait: '开放实验者' },
          { label: '坚持直觉，AI 不了解上下文', value: 'A', trait: '独立思考者' },
        ],
      },
    ],
  },
  {
    id: 'AD-2', dimension: 'AD', weight: 1.5,
    variants: [
      {
        text: '如果明天起所有 AI 工具消失一周，你的工作会？',
        options: [
          { label: '完蛋啦完蛋啦完蛋啦', value: 'D', trait: '深度嵌入' },
          { label: '照常运转，只是慢一点', value: 'A', trait: '能力自持' },
        ],
      },
    ],
  },
  {
    id: 'AD-3', dimension: 'AD', weight: 1.0,
    variants: [
      {
        text: 'AI 生成的代码通过了它的自检，你会？',
        options: [
          { label: '直接合并，它比我细心', value: 'D', trait: '放手派' },
          { label: '自己再过一遍关键路径', value: 'A', trait: '终审法官' },
        ],
      },
    ],
  },
  {
    id: 'AD-4', dimension: 'AD', weight: 1.0,
    variants: [
      {
        text: '面对跳槽、选专业这类人生决定，AI 的意见对你来说是？',
        options: [
          { label: '重要参考，甚至会跟着走', value: 'D', trait: '决策外包' },
          { label: '信息之一，主意永远自己拿', value: 'A', trait: '主权在握' },
        ],
      },
    ],
  },
  {
    id: 'AD-5', dimension: 'AD', weight: 1.0,
    variants: [
      {
        text: '学一个全新的东西，你的第一步通常是？',
        options: [
          { label: '直接问 AI 要一份答案', value: 'D', trait: '直达终点' },
          { label: '先自己翻文档琢磨一阵', value: 'A', trait: '原始积累' },
        ],
      },
    ],
  },
  {
    id: 'AD-6', dimension: 'AD', weight: 1.5,
    variants: [
      {
        text: '如果 AI 常年替你写周报、总结、复盘，你会？',
        options: [
          { label: '挺好，省下的时间更值钱', value: 'D', trait: '效率至上' },
          { label: '不安，怕自己的表达能力退化', value: 'A', trait: '用进废退' },
        ],
      },
    ],
  },
  {
    id: 'AD-7', dimension: 'AD', weight: 1.0,
    variants: [
      {
        text: '出门旅行做攻略，你的风格是？',
        options: [
          { label: '让 AI 生成完整行程，照着走', value: 'D', trait: '行程托管' },
          { label: '自己东拼西凑，AI 只查缺补漏', value: 'A', trait: '路线自绘' },
        ],
      },
    ],
  },
  {
    id: 'AD-8', dimension: 'AD', weight: 1.5,
    variants: [
      {
        text: '深夜情绪低落又睡不着，你会找 AI 聊天吗？',
        options: [
          { label: '会，它比朋友随叫随到', value: 'D', trait: '情感外包' },
          { label: '不会，情绪这事不靠算法', value: 'A', trait: '情绪自理' },
        ],
      },
    ],
  },
  {
    id: 'AD-9', dimension: 'AD', weight: 1.0,
    variants: [
      {
        text: '简历、致辞、祝福语这类「体面文字」，你的态度是？',
        options: [
          { label: 'AI 写就完了，反正没人逐字看', value: 'D', trait: '体面外包' },
          { label: '再敷衍也得自己写，署的是我的名', value: 'A', trait: '署名洁癖' },
        ],
      },
    ],
  },
  {
    id: 'AD-10', dimension: 'AD', weight: 1.0,
    variants: [
      {
        text: 'AI 的答案和真人专家的说法冲突时，你更信？',
        options: [
          { label: 'AI，它读过的资料多', value: 'D', trait: '数据崇拜' },
          { label: '真人，错了有人负责', value: 'A', trait: '责任锚定' },
        ],
      },
    ],
  },

  // ======== Dimension BS: Belief ↔ Skepticism ========
  {
    id: 'BS-1', dimension: 'BS', weight: 1.0,
    variants: [
      {
        text: '看到「AI 将取代 XX 职业」的新闻，你的第一反应是？',
        options: [
          { label: '期待，变革正在发生', value: 'B', trait: '浪潮乐观派' },
          { label: '警惕，多半是炒作话术', value: 'S', trait: '反 hype 体质' },
        ],
      },
    ],
  },
  {
    id: 'BS-2', dimension: 'BS', weight: 1.5,
    variants: [
      {
        text: '你认为现在的大语言模型真正「理解」语言吗？',
        options: [
          { label: '某种意义上，是的', value: 'B', trait: '涌现信徒' },
          { label: '只是高级的模式匹配', value: 'S', trait: '随机鹦鹉' },
        ],
      },
    ],
  },
  {
    id: 'BS-3', dimension: 'BS', weight: 1.0,
    variants: [
      {
        text: '有人说「AGI 这一两年内就会到来」，你觉得？',
        options: [
          { label: '很可能，曲线不骗人', value: 'B', trait: '指数信仰' },
          { label: '融资 PPT 看多了', value: 'S', trait: '冷静剂' },
        ],
      },
    ],
  },
  {
    id: 'BS-4', dimension: 'BS', weight: 1.0,
    variants: [
      {
        text: '「AI 已经有了意识」——你会认真考虑这个可能性吗？',
        options: [
          { label: '会，无法证伪就值得认真对待', value: 'B', trait: '开放心灵' },
          { label: '科幻电影的台词而已', value: 'S', trait: '唯物主义者' },
        ],
      },
    ],
  },
  {
    id: 'BS-5', dimension: 'BS', weight: 1.0,
    variants: [
      {
        text: 'AI 告诉你的「事实」，你通常？',
        options: [
          { label: '基本可信，它读过整个互联网', value: 'B', trait: '默认信任' },
          { label: '默认存疑，重要的一定核查', value: 'S', trait: '核查本能' },
        ],
      },
    ],
  },
  {
    id: 'BS-6', dimension: 'BS', weight: 1.5,
    variants: [
      {
        text: '一家 AI 公司宣称「我们的模型绝对安全」，你？',
        options: [
          { label: '愿意相信，安全是他们的生命线', value: 'B', trait: '机构信任' },
          { label: '笑出声，上次他们也是这么说的', value: 'S', trait: '记性很好' },
        ],
      },
    ],
  },
  {
    id: 'BS-7', dimension: 'BS', weight: 1.0,
    variants: [
      {
        text: '朋友转发「AI 复活逝者」的视频给你，你？',
        options: [
          { label: '感动，技术在延续思念', value: 'B', trait: '技术温情派' },
          { label: '不适，这生意有点冷', value: 'S', trait: '边界敏感' },
        ],
      },
    ],
  },
  {
    id: 'BS-8', dimension: 'BS', weight: 1.5,
    variants: [
      {
        text: '「AI 最终会取代人类的创造力」——你怎么看？',
        options: [
          { label: '会，只是时间问题', value: 'B', trait: '终局论者' },
          { label: '不会，它只会取代平庸', value: 'S', trait: '创造力原教旨' },
        ],
      },
    ],
  },
  {
    id: 'BS-9', dimension: 'BS', weight: 1.0,
    variants: [
      {
        text: '「AI 伴侣」App 越来越流行，你的看法是？',
        options: [
          { label: '理解，陪伴是真实的需求', value: 'B', trait: '需求至上' },
          { label: '警惕，这是孤独的工业化', value: 'S', trait: '人间观察员' },
        ],
      },
    ],
  },
  {
    id: 'BS-10', dimension: 'BS', weight: 1.0,
    variants: [
      {
        text: 'AI 产品的发布会，你通常？',
        options: [
          { label: '追直播，每次都像过节', value: 'B', trait: '发布会信徒' },
          { label: '等实测，台上每句话都打过折', value: 'S', trait: '延迟相信' },
        ],
      },
    ],
  },

  // ======== Dimension MC: Maker ↔ Consumer ========
  {
    id: 'MC-1', dimension: 'MC', weight: 1.0,
    variants: [
      {
        text: '你打开 AI 对话框，最常见的开场白是？',
        options: [
          { label: '「帮我做一个……」', value: 'M', trait: '造物开场' },
          { label: '「帮我查/总结/翻译一下……」', value: 'C', trait: '索取开场' },
        ],
      },
    ],
  },
  {
    id: 'MC-2', dimension: 'MC', weight: 1.5,
    variants: [
      {
        text: '你有没有用 AI 做出过一件「作品」（代码、文章、图像、视频）？',
        options: [
          { label: '有，还拿给别人看过', value: 'M', trait: '有作品的人' },
          { label: '没有，用完即走', value: 'C', trait: '过路乘客' },
        ],
      },
    ],
  },
  {
    id: 'MC-3', dimension: 'MC', weight: 1.0,
    variants: [
      {
        text: '你更希望 AI 帮你？',
        options: [
          { label: '激发一个我想不到的创意', value: 'M', trait: '缪斯模式' },
          { label: '完成一个我懒得做的任务', value: 'C', trait: '管家模式' },
        ],
      },
    ],
  },
  {
    id: 'MC-4', dimension: 'MC', weight: 1.0,
    variants: [
      {
        text: '周末你和 AI 的相处常态是？',
        options: [
          { label: '折腾一个 side project', value: 'M', trait: '周末工匠' },
          { label: '处理积攒的杂事', value: 'C', trait: '周末保洁' },
        ],
      },
    ],
  },
  {
    id: 'MC-5', dimension: 'MC', weight: 1.0,
    variants: [
      {
        text: '看到别人用 AI 做出的惊艳作品，你的第一反应是？',
        options: [
          { label: '「我也能做一个」', value: 'M', trait: '动手冲动' },
          { label: '「收藏了，以后用得上」', value: 'C', trait: '囤物反射' },
        ],
      },
    ],
  },
  {
    id: 'MC-6', dimension: 'MC', weight: 1.5,
    variants: [
      {
        text: '翻一下你的 AI 使用记录，它更像？',
        options: [
          { label: '一个工作室，到处是没完工的东西', value: 'M', trait: '作坊主' },
          { label: '一个收银台，全是即问即走的流水', value: 'C', trait: '柜台客' },
        ],
      },
    ],
  },
  {
    id: 'MC-7', dimension: 'MC', weight: 1.0,
    variants: [
      {
        text: '你用 AI 生成的内容，最终大多去了哪里？',
        options: [
          { label: '成了我某个项目或作品的一部分', value: 'M', trait: '材料入库' },
          { label: '用完就关掉了标签页', value: 'C', trait: '即用即弃' },
        ],
      },
    ],
  },
  {
    id: 'MC-8', dimension: 'MC', weight: 1.5,
    variants: [
      {
        text: '给你三天空闲和一个 AI，你最可能？',
        options: [
          { label: '做出一个能跑的小东西', value: 'M', trait: '建造本能' },
          { label: '把想看的剧和书都安排明白', value: 'C', trait: '享受优先' },
        ],
      },
    ],
  },
  {
    id: 'MC-9', dimension: 'MC', weight: 1.0,
    variants: [
      {
        text: '你的收藏夹里最多的内容是？',
        options: [
          { label: '教程和提示词，迟早要动手', value: 'M', trait: '备料习惯' },
          { label: '「先马后看」，然后没有然后', value: 'C', trait: '数字囤积' },
        ],
      },
    ],
  },
  {
    id: 'MC-10', dimension: 'MC', weight: 1.0,
    variants: [
      {
        text: '朋友想做个小工具找你帮忙，你会？',
        options: [
          { label: '正好，拉上 AI 一起搞出来', value: 'M', trait: '组队开工' },
          { label: '教他怎么问 AI，让他自己来', value: 'C', trait: '指路明灯' },
        ],
      },
    ],
  },

  // ======== Dimension OG: Open ↔ Guarded ========
  {
    id: 'OG-1', dimension: 'OG', weight: 1.0,
    variants: [
      {
        text: '把个人日记交给 AI 分析，你？',
        options: [
          { label: '可以，想看看它能发现什么', value: 'O', trait: '敞开内心' },
          { label: '绝不，那是最后一块自留地', value: 'G', trait: '边界森严' },
        ],
      },
    ],
  },
  {
    id: 'OG-2', dimension: 'OG', weight: 1.5,
    variants: [
      {
        text: 'AI 助手申请你的麦克风和位置权限，你通常？',
        options: [
          { label: '给了，方便优先', value: 'O', trait: '便利至上' },
          { label: '能关的全都关了', value: 'G', trait: '权限洁癖' },
        ],
      },
    ],
  },
  {
    id: 'OG-3', dimension: 'OG', weight: 1.0,
    variants: [
      {
        text: 'AI 记得你说过的每句话，你觉得？',
        options: [
          { label: '贴心，它终于懂我了', value: 'O', trait: '被了解成瘾' },
          { label: '发毛，我想删记录', value: 'G', trait: '数字不安' },
        ],
      },
    ],
  },
  {
    id: 'OG-4', dimension: 'OG', weight: 1.0,
    variants: [
      {
        text: '如果 AI 能准确预测你下周的行为，你会觉得？',
        options: [
          { label: '方便，省得自己规划了', value: 'O', trait: '托管人生' },
          { label: '毛骨悚然', value: 'G', trait: '自由意志保卫者' },
        ],
      },
    ],
  },
  {
    id: 'OG-5', dimension: 'OG', weight: 1.0,
    variants: [
      {
        text: '和 AI 聊天时，你会说出真实姓名、公司、住址吗？',
        options: [
          { label: '无所谓，早就没什么可藏的', value: 'O', trait: '透明人' },
          { label: '刻意回避，一律用代称', value: 'G', trait: '化名主义者' },
        ],
      },
    ],
  },
  {
    id: 'OG-6', dimension: 'OG', weight: 1.5,
    variants: [
      {
        text: '「用数据换便利」这笔交易，你怎么看？',
        options: [
          { label: '划算，数据本来就是死资产', value: 'O', trait: '交易现实主义' },
          { label: '从来都不是一个好交易', value: 'G', trait: '拒绝签字' },
        ],
      },
    ],
  },
  {
    id: 'OG-7', dimension: 'OG', weight: 1.0,
    variants: [
      {
        text: '换手机时，AI App 里的旧聊天记录你会？',
        options: [
          { label: '全部云同步，历史很宝贵', value: 'O', trait: '历史依赖' },
          { label: '正好，一键清零重新开始', value: 'G', trait: '定期焚毁' },
        ],
      },
    ],
  },
  {
    id: 'OG-8', dimension: 'OG', weight: 1.5,
    variants: [
      {
        text: '如果 AI 申请读取你的全部聊天记录来「更懂你」，你？',
        options: [
          { label: '愿意，越懂我越好用', value: 'O', trait: '以心换芯' },
          { label: '不愿意，懂我是我自己的事', value: 'G', trait: '主权宣言' },
        ],
      },
    ],
  },
  {
    id: 'OG-9', dimension: 'OG', weight: 1.0,
    variants: [
      {
        text: '看到「本对话可能用于改进模型」的小字，你？',
        options: [
          { label: '照聊不误，我又不特殊', value: 'O', trait: '人海隐身' },
          { label: '默默把敏感内容咽回去', value: 'G', trait: '自我审查' },
        ],
      },
    ],
  },
  {
    id: 'OG-10', dimension: 'OG', weight: 1.0,
    variants: [
      {
        text: '你会把和 AI 的聊天截图发到朋友圈或群聊吗？',
        options: [
          { label: '经常，好玩就发', value: 'O', trait: '分享即快乐' },
          { label: '很少，那是我和它的事', value: 'G', trait: '私域守护' },
        ],
      },
    ],
  },
];

// ---------- 抽题 ----------

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * 抽题：每维度抽 QUESTIONS_PER_DIMENSION 题，选定变体并洗牌选项，最后跨维度打乱。
 * rng 可注入（测试用），默认 Math.random。
 */
export function drawQuestions(
  bank: Question[] = QUESTION_BANK,
  rng: () => number = Math.random,
): DrawnQuestion[] {
  const drawn: DrawnQuestion[] = [];

  for (const dim of DIMENSIONS) {
    const pool = bank.filter((q) => q.dimension === dim);
    const picked = shuffle(pool, rng).slice(0, QUESTIONS_PER_DIMENSION);

    for (const q of picked) {
      const variant = q.variants[Math.floor(rng() * q.variants.length)];
      const options = shuffle(variant.options, rng) as [Option, Option];
      drawn.push({
        id: q.id,
        dimension: q.dimension,
        weight: q.weight,
        text: variant.text,
        options,
      });
    }
  }

  return shuffle(drawn, rng);
}

// ---------- 评分 ----------

/**
 * 评分（含平局规则，P1 §4.2）：
 * 1. 左右极得分不等 → 高分极获胜（权重不同则权重高者自然分胜负）
 * 2. 双 1.0 平局 → 取左极，标记 borderline
 *
 * rng 可注入（测试用）：驱动每维度展示位置的随机抖动。
 */
export function calculateResult(answers: QuizAnswer[], rng: () => number = Math.random): QuizResult {
  const scores: DimensionScore[] = DIMENSIONS.map((dim) => {
    const { left, right } = POLE_PAIRS[dim];
    const dimAnswers = answers.filter((a) => a.dimension === dim);

    const leftScore = dimAnswers
      .filter((a) => a.value === left)
      .reduce((sum, a) => sum + a.weight, 0);
    const rightScore = dimAnswers
      .filter((a) => a.value === right)
      .reduce((sum, a) => sum + a.weight, 0);

    const borderline = leftScore === rightScore;
    const pole: Pole = borderline
      ? left // 平局取左极（保守默认）
      : leftScore > rightScore
        ? left
        : right;

    const total = leftScore + rightScore;
    const ratio = total === 0 ? 0.5 : leftScore / total;

    // 展示位置：原始占比 + 轻微抖动，再钳进每维度独立的随机内缩带
    // （内缩量两端各自随机 → 即使四个维度同为极端值，光点位置也各不相同）
    const insetLeft = AXIS_MARGIN + rng() * AXIS_JITTER;
    const insetRight = AXIS_MARGIN + rng() * AXIS_JITTER;
    const wobble = (rng() * 2 - 1) * (AXIS_JITTER / 2);
    const displayRatio = clamp(ratio + wobble, insetLeft, 1 - insetRight);

    return {
      dimension: dim,
      pole,
      left: leftScore,
      right: rightScore,
      ratio,
      displayRatio,
      borderline,
    };
  });

  return {
    code: scores.map((s) => s.pole).join(''),
    dimensions: scores,
    answers,
  };
}

/** 从一组 DrawnQuestion 生成对应的 QuizAnswer（便捷方法） */
export function makeAnswer(q: DrawnQuestion, option: Option, thinkingMs?: number): QuizAnswer {
  return {
    questionId: q.id,
    dimension: q.dimension,
    weight: q.weight,
    value: option.value,
    thinkingMs,
  };
}
