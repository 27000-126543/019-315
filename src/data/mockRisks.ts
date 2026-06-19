import type { RiskItem } from '@/types/clue';

export const mockRisks: RiskItem[] = [
  {
    id: 'r1',
    title: '近期当地大选话题敏感',
    description: '该国即将举行全国大选，政治氛围紧张。任何与选举相关的话题都可能被放大解读，建议避免公开评论选举相关议题。',
    category: 'sensitive_topic',
    level: 'high',
    updatedAt: '2024-01-15',
    examples: [
      '不要公开支持或反对任何政党',
      '避免谈论候选人评价',
      '不在项目现场悬挂政治标语'
    ],
    suggestions: [
      '如被媒体问及选举问题，请以"不干涉他国内政"为由婉拒',
      '内部加强员工教育，不在社交媒体讨论当地政治',
      '密切关注选情变化对项目安全的影响'
    ]
  },
  {
    id: 'r2',
    title: '环保议题持续升温',
    description: '近期当地环保组织活动频繁，多个外资项目被点名批评。公众对环境问题关注度高，容易引发舆论发酵。',
    category: 'sensitive_topic',
    level: 'medium',
    updatedAt: '2024-01-14',
    examples: [
      '不要随意回应环保质疑',
      '避免发表"环保标准过高"类言论',
      '不与环保组织发生正面冲突'
    ],
    suggestions: [
      '统一由总部公关部门对外回应',
      '主动公开环评报告和环保措施',
      '可考虑与当地环保组织开展对话'
    ]
  },
  {
    id: 'r3',
    title: '不要说"我们是来帮助你们的"',
    description: '这类表述容易引起当地民众反感，被解读为"居高临下"的态度，有损国家形象和企业形象。',
    category: 'taboo_expression',
    level: 'high',
    updatedAt: '2024-01-12',
    examples: [
      '❌ "我们是来帮助你们发展的"',
      '❌ "没有我们你们做不到"',
      '❌ "我们带来了先进的技术"'
    ],
    suggestions: [
      '✅ "我们很高兴能与贵方合作"',
      '✅ "这是我们共同努力的成果"',
      '✅ "我们从贵国学到了很多"'
    ]
  },
  {
    id: 'r4',
    title: '劳资纠纷话题需谨慎',
    description: '当地工会势力较强，任何涉及工资、工时、福利待遇的话题都可能被放大。建议谨慎处理相关问题。',
    category: 'sensitive_topic',
    level: 'medium',
    updatedAt: '2024-01-13',
    examples: [
      '不要公开评论当地工资水平',
      '避免与工会进行非正式谈判',
      '不在社交媒体讨论员工待遇'
    ],
    suggestions: [
      '严格遵守当地劳动法规',
      '通过正规渠道与工会沟通',
      '建立健全的员工申诉机制'
    ]
  },
  {
    id: 'r5',
    title: '避免提及"中国模式"',
    description: '"中国模式"一词在当地政治语境中较为敏感，容易被解读为意识形态输出，建议避免使用。',
    category: 'taboo_expression',
    level: 'medium',
    updatedAt: '2024-01-11',
    examples: [
      '❌ "中国模式值得学习"',
      '❌ "照搬中国的做法"',
      '❌ "按照中国标准来做"'
    ],
    suggestions: [
      '✅ "根据当地实际情况调整"',
      '✅ "结合双方优势合作"',
      '✅ "探索适合本地的发展路径"'
    ]
  },
  {
    id: 'r6',
    title: '宗教话题务必注意',
    description: '该国宗教信仰浓厚，涉及宗教的言论需格外谨慎，避免引起宗教团体或信众的不满。',
    category: 'sensitive_topic',
    level: 'high',
    updatedAt: '2024-01-10',
    examples: [
      '不评论当地宗教习俗',
      '尊重宗教节日和礼拜时间',
      '项目设计考虑宗教文化因素'
    ],
    suggestions: [
      '安排员工了解当地宗教常识',
      '项目现场可设置宗教活动场所',
      '重要宗教节日可发放问候'
    ]
  }
];
