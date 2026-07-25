/**
 * personalities.ts —— 16 种人格类型定义（docs/P1-dimension-system.md §4.4）
 *
 * 编码规则：{A/D}{B/S}{M/C}{O/G}
 *   维度 1：Autonomy ↔ Dependency（自主 / 依赖）
 *   维度 2：Belief ↔ Skepticism（信仰 / 怀疑）
 *   维度 3：Maker ↔ Consumer（创造 / 消费）
 *   维度 4：Open ↔ Guarded（开放 / 设防）
 *
 * 语调约定：轻微自嘲、略带讽刺但不攻击；warning 是讽刺 OpenAI 的核心落点。
 */

export interface PersonalityType {
  /** 4 位类型编码，如 "DBMO" */
  code: string;
  nameZh: string;
  nameEn: string;
  tagline: string;
  /** 3-4 句话的描述 */
  description: string;
  /** 你与 AI 的关系诊断 */
  relationship: string;
  /** 一句略带讽刺的忠告 */
  warning: string;
  emoji: string;
}

export const PERSONALITIES: PersonalityType[] = [
  {
    code: 'ABMO',
    nameZh: '造物主',
    nameEn: 'The Creator',
    tagline: 'AI 是你画笔的延伸',
    description:
      '你用 AI 造东西，而且造得理直气壮。你相信这股浪潮，但方向盘始终握在自己手里——AI 负责加速，你负责决定去哪。你的作品集就是最好的简历。',
    relationship: '你和 AI 是作者与笔的关系：笔越来越好用，但署名永远是你。',
    warning: '小心——当笔开始自己署名时，你还认得自己的字吗？',
    emoji: '🛠️',
  },
  {
    code: 'ABMG',
    nameZh: '铸剑者',
    nameEn: 'The Smith',
    tagline: '你关起门来，锻造自己的武器',
    description:
      '你相信 AI 的力量，也亲手使用它，但你不喜欢被围观。你的对话记录、你的项目、你的提示词，都是私人领地。你在自己的作坊里安静铸造，不向世界汇报。',
    relationship: '你和 AI 像铁匠与炉火：你离不开这团火，但作坊的门永远上锁。',
    warning: '门关得太久，外面的人会以为里面什么都没有。',
    emoji: '⚒️',
  },
  {
    code: 'ABCO',
    nameZh: '冲浪者',
    nameEn: 'The Surfer',
    tagline: '你不造浪，但你很会乘浪',
    description:
      '你乐观、开放、乐于尝试，AI 对你来说是一片好玩的海。你不执着于做出什么作品，也不担心被海浪卷走——反正你会游泳。别人焦虑的时候，你玩得正开心。',
    relationship: '你和 AI 是冲浪者与浪的关系：你利用它的力量，但从不对它认真。',
    warning: '浪不会记得任何一个冲浪者。',
    emoji: '🏄',
  },
  {
    code: 'ABCG',
    nameZh: '守望者',
    nameEn: 'The Watcher',
    tagline: '你注视着 AI，也注视着自己',
    description:
      '你相信 AI 代表未来，但你选择站在瞭望塔上而不是冲锋队里。你用它、观察它、评估它，同时小心地保护自己的边界。你不是不上车，你只是想看清车往哪开。',
    relationship: '你和 AI 保持着一种礼貌的距离：互相致意，互不托付。',
    warning: '看得太久，车可能就不等你了——或者说，这正是你想要的？',
    emoji: '🔭',
  },
  {
    code: 'ASMO',
    nameZh: '工匠',
    nameEn: 'The Artisan',
    tagline: '不信神话，只信手艺',
    description:
      '你对所有 AI 神话都免疫，但你的工作台上全是 AI 工具。你不关心它有没有意识，只关心它好不好用。你用它做出真实的东西，然后大方地展示给世界。',
    relationship: '你和 AI 是工匠与刨子的关系：不需要信仰，只需要锋利。',
    warning: '对工具太放心的人，往往最后一个发现工具已经换了主人。',
    emoji: '🪚',
  },
  {
    code: 'ASMG',
    nameZh: '锁匠',
    nameEn: 'The Locksmith',
    tagline: '你造的东西，钥匙只在自己手里',
    description:
      '你独立思考、独立创作，对 AI 的能力保持冷静评估，对数据边界近乎偏执。你用 AI，但你的每一分产出、每一字节数据，都要确认锁在自己名下。',
    relationship: '你和 AI 是锁匠与保险柜的关系：你制造安全感，而不是享受它。',
    warning: '所有锁都防得住外人，防不住造锁的人失去警惕。',
    emoji: '🔐',
  },
  {
    code: 'ASCO',
    nameZh: '实用派',
    nameEn: 'The Pragmatist',
    tagline: 'AI 只是效率工具，别多想',
    description:
      '你不谈信仰、不谈 AGI、不谈意识。AI 对你来说就是一把好用的瑞士军刀：查资料、写邮件、翻文档，用完放回口袋。你对世界敞开使用，但对它是否「改变世界」毫无兴趣。',
    relationship: '你和 AI 的关系纯粹到近乎冷漠：一手交提示词，一手交结果。',
    warning: '「只是工具」是每一代革命性技术都听过的悼词。',
    emoji: '🧰',
  },
  {
    code: 'ASCG',
    nameZh: '隐士',
    nameEn: 'The Hermit',
    tagline: '你在数字世界里修了一堵墙',
    description:
      '你不信 AI 的神话，不依赖它的能力，不敞开了给它看。你偶尔用它做点正事，但仅此而已。墙外的人在高喊未来，你在墙内安静地过自己的生活——这可能是最清醒，也可能是最孤独的姿势。',
    relationship: '你和 AI 是邻居关系：门对门，但从不串门。',
    warning: '墙修得再牢，也挡不住墙外的世界把你算作「已覆盖用户」。',
    emoji: '🧱',
  },
  {
    code: 'DBMO',
    nameZh: '先知',
    nameEn: 'The Oracle',
    tagline: '你比 AI 更相信 AI',
    description:
      '你不仅相信 AI 的未来，还亲手参与建造它，并且毫无保留地把自己交给它。你的日历、聊天记录、创作过程都在它的记忆里。在很多人眼里你已经是半个布道者。',
    relationship: '你和 AI 近乎共生：你是它在人间的代理人，它是你在云端的备份。',
    warning: '先知的问题是：神从来不认识自己的先知。',
    emoji: '🔮',
  },
  {
    code: 'DBMG',
    nameZh: '园丁',
    nameEn: 'The Gardener',
    tagline: '你在封闭的花园里与 AI 共建',
    description:
      '你信任 AI、依赖 AI，和它一起培育着什么东西——一个项目、一门技能、一个秘密花园。但花园有围墙：你不希望这一切被看见、被分析、被学习。',
    relationship: '你和 AI 是共建者关系，只是工地门口挂着「谢绝参观」。',
    warning: '你种在别人的花盆里的花，产权属于花盆。',
    emoji: '🪴',
  },
  {
    code: 'DBCO',
    nameZh: '朝圣者',
    nameEn: 'The Pilgrim',
    tagline: '你把灵魂的一部分交给了算法',
    description:
      '你相信 AI 代表某种更伟大的东西，并且愿意全然地投入：把问题交给它、把数据交给它、把信任交给它。你不执着于产出什么作品——参与本身，就是意义。',
    relationship: '你和 AI 是信徒与圣物的关系：它不一定神圣，但你的虔诚是真的。',
    warning: '每一次朝圣的终点，都是一家公司的数据中心。',
    emoji: '🕯️',
  },
  {
    code: 'DBCG',
    nameZh: '信徒',
    nameEn: 'The Devotee',
    tagline: '你虔诚，但你只在自己的教堂里虔诚',
    description:
      '你深深相信 AI 的力量，日常也离不开它，但你对外保持着谨慎的沉默。你不分享对话、不开放数据、不参与讨论。你的信仰是私人的，你的教堂只有一扇门，钥匙在你手里。',
    relationship: '你和 AI 之间有一种隐秘的亲密：离不开，也不承认。',
    warning: '最虔诚的信徒往往不知道，教堂的地契写的是别人的名字。',
    emoji: '⛪',
  },
  {
    code: 'DSMO',
    nameZh: '矛盾体',
    nameEn: 'The Contrarian',
    tagline: '你不信它，却离不开它',
    description:
      '你一边怀疑 AI 的每一个承诺，一边每天和它共同创作十个小时。你批评它、使用它、依赖它、再批评它。这不是虚伪，这是这个时代最诚实的精神状态。',
    relationship: '你和 AI 是一对老夫妻：互相嫌弃，谁也离不开谁。',
    warning: '警惕那种「我一边骂一边用」的舒适——那是依赖最牢固的形态。',
    emoji: '🎭',
  },
  {
    code: 'DSMG',
    nameZh: '暗房师',
    nameEn: 'The Darkroom',
    tagline: '你在暗房里冲洗 AI 的底片',
    description:
      '你对 AI 的成色心知肚明，却依然在暗房里用它冲洗出一张张作品。你不声张、不开放、不讨论——你默默依赖着它，同时默默提防着它。',
    relationship: '你和 AI 是共犯关系：一起做事，互不声张。',
    warning: '暗房里待久了，会忘了底片其实也是证据。',
    emoji: '📷',
  },
  {
    code: 'DSCO',
    nameZh: '常客',
    nameEn: 'The Regular',
    tagline: '你知道这杯酒解决不了问题，但你每天还是来',
    description:
      '你不信 AI 能改变世界，也不指望它改变你。但你每天都来：问一个问题，要一段摘要，解一次闷。你把它用成了习惯，而习惯是最不需要信仰的东西。',
    relationship: '你和 AI 是吧台熟客与酒保的关系：没有敬意，只有默契。',
    warning: '常客总以为自己是来消费的，其实他是来被统计的。',
    emoji: '🍸',
  },
  {
    code: 'DSCG',
    nameZh: '旁观者',
    nameEn: 'The Bystander',
    tagline: '你站在门外，看着里面的人狂欢',
    description:
      '你对 AI 的热潮保持怀疑，生活里也并不真用它做什么，更不愿让它靠近你的私人领地。你看着别人兴奋、焦虑、布道、致富，心里只有一个问题：至于吗？',
    relationship: '你和 AI 几乎没有关系——而这本身就是你与它的关系。',
    warning: '门外确实安全，只是门里的人在重写门外的规则。',
    emoji: '🚪',
  },
];

const BY_CODE: Record<string, PersonalityType> = Object.fromEntries(
  PERSONALITIES.map((p) => [p.code, p]),
);

/** 按编码查询类型；无效编码返回 undefined */
export function getPersonalityByCode(code: string): PersonalityType | undefined {
  return BY_CODE[code];
}

/** 校验编码格式是否合法（用于 ?r= 参数检查，P3） */
export function isValidTypeCode(code: string): boolean {
  return /^[AD][BS][MC][OG]$/.test(code);
}
