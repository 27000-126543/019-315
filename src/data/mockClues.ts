import type { Clue } from '@/types/clue';

export const mockClues: Clue[] = [
  {
    id: '1',
    title: '当地媒体报道中资环保问题',
    content: '当地主流报纸今日头版刊登文章，质疑我园区项目环评不达标，称周边居民反映水质变差。已有多个社交媒体账号转发。',
    category: 'environmental',
    mediaUrl: 'https://example.com/news/article-123',
    location: '雅加达',
    language: '印尼语',
    spreadScope: 'national',
    urgency: 'high',
    status: 'adopted',
    createdAt: '2024-01-15 09:30',
    analysisLevel: 'high',
    isStarred: true,
    currentRound: 1,
    timeline: [
      { id: 't1', type: 'submit', content: '线索已提交', operator: '现场人员', operatorRole: 'field', timestamp: '2024-01-15 09:30', round: 1 },
      { id: 't2', type: 'status_change', status: 'adopted', content: '已纳入今日舆情专报，总部正在协调公关团队回应。请继续关注当地社交媒体讨论热度变化。', operator: '总部舆情中心', operatorRole: 'headquarters', timestamp: '2024-01-15 14:20', round: 1 }
    ],
    supplements: []
  },
  {
    id: '2',
    title: '工会组织计划下周罢工',
    content: '项目现场附近某工会通过Facebook发布消息，称将组织全国性罢工行动，要求提高外籍劳工待遇。提到我项目名称。',
    category: 'labor_dispute',
    location: '内罗毕',
    language: '斯瓦希里语',
    spreadScope: 'regional',
    urgency: 'medium',
    status: 'supplement',
    createdAt: '2024-01-14 16:45',
    analysisLevel: 'medium',
    isStarred: false,
    currentRound: 1,
    timeline: [
      { id: 't3', type: 'submit', content: '线索已提交', operator: '现场人员', operatorRole: 'field', timestamp: '2024-01-14 16:45', round: 1 },
      { id: 't4', type: 'status_change', status: 'supplement', content: '请补充以下信息以便研判：1. 罢工具体日期和参与人数预估；2. 是否涉及我项目具体劳工；3. 工会主要诉求原文翻译。', operator: '总部舆情中心', operatorRole: 'headquarters', timestamp: '2024-01-14 19:10', round: 1 }
    ],
    supplements: []
  },
  {
    id: '3',
    title: '当地论坛讨论项目安全隐患',
    content: '在当地最大的华人论坛上，有网友发帖称我项目工地存在消防隐患，已被本地消防部门警告。帖子回帖数超过50条。',
    category: 'project_safety',
    location: '胡志明市',
    language: '越南语',
    spreadScope: 'local',
    urgency: 'medium',
    status: 'pending',
    createdAt: '2024-01-16 11:20',
    isStarred: false,
    currentRound: 1,
    timeline: [
      { id: 't5', type: 'submit', content: '线索已提交', operator: '现场人员', operatorRole: 'field', timestamp: '2024-01-16 11:20', round: 1 }
    ],
    supplements: []
  },
  {
    id: '4',
    title: '某国会议员发表涉华负面言论',
    content: '在国会辩论中，反对党议员公开指责中国"债务陷阱外交"，点名提到我承建的铁路项目。视频已被上传至YouTube。',
    category: 'political',
    mediaUrl: 'https://youtube.com/watch?v=xxx',
    location: '斯里巴加湾',
    language: '英语',
    spreadScope: 'national',
    urgency: 'high',
    status: 'adopted',
    createdAt: '2024-01-13 08:15',
    analysisLevel: 'high',
    isStarred: true,
    currentRound: 1,
    timeline: [
      { id: 't6', type: 'submit', content: '线索已提交', operator: '现场人员', operatorRole: 'field', timestamp: '2024-01-13 08:15', round: 1 },
      { id: 't7', type: 'status_change', status: 'adopted', content: '已转交新闻部门跟进。建议我方保持低调，不主动回应。密切关注是否有其他政客跟进表态。', operator: '总部舆情中心', operatorRole: 'headquarters', timestamp: '2024-01-13 11:40', round: 1 }
    ],
    supplements: []
  },
  {
    id: '5',
    title: '本地博主发布项目探访视频',
    content: '当地知名旅行博主发布了我园区的探访视频，评论区有不少关于"中国扩张"的负面言论。视频播放量已超10万。',
    category: 'national_image',
    mediaUrl: 'https://tiktok.com/@user/video/xxx',
    location: '曼谷',
    language: '泰语',
    spreadScope: 'national',
    urgency: 'low',
    status: 'closed',
    createdAt: '2024-01-10 14:30',
    analysisLevel: 'low',
    isStarred: false,
    currentRound: 2,
    timeline: [
      { id: 't8', type: 'submit', content: '线索已提交', operator: '现场人员', operatorRole: 'field', timestamp: '2024-01-10 14:30', round: 1 },
      { id: 't9', type: 'status_change', status: 'adopted', content: '已收到，正在研判中。', operator: '总部舆情中心', operatorRole: 'headquarters', timestamp: '2024-01-10 17:00', round: 1 },
      { id: 't10', type: 'status_change', status: 'closed', content: '经研判，该视频整体中立，负面评论占比较低（约8%），属正常舆论范畴，无需特别处置。已归档。', operator: '总部舆情中心', operatorRole: 'headquarters', timestamp: '2024-01-12 09:30', round: 2 }
    ],
    supplements: []
  },
  {
    id: '6',
    title: '当地媒体关注劳工待遇差异',
    content: '本地一家独立媒体发布了关于中资企业与本地企业劳工待遇对比的深度报道，涉及工资水平、工时和福利保障等方面。',
    category: 'labor_dispute',
    mediaUrl: 'https://example.com/news/labor-compare',
    location: '达卡',
    language: '孟加拉语',
    spreadScope: 'local',
    urgency: 'medium',
    status: 'supplement',
    createdAt: '2024-01-12 10:00',
    analysisLevel: 'medium',
    isStarred: false,
    currentRound: 1,
    timeline: [
      { id: 't11', type: 'submit', content: '线索已提交', operator: '现场人员', operatorRole: 'field', timestamp: '2024-01-12 10:00', round: 1 },
      { id: 't12', type: 'status_change', status: 'supplement', content: '请补充：1. 该媒体的影响力和受众群体；2. 是否有其他媒体转载；3. 报道中提到的具体数据是否准确。', operator: '总部舆情中心', operatorRole: 'headquarters', timestamp: '2024-01-12 15:20', round: 1 }
    ],
    supplements: [
      {
        id: 's1',
        content: '该媒体是本地第三大独立媒体，主要受众为中产阶级和知识界。暂未发现其他媒体转载。报道中提到的工资数据基本属实，但对比方式不够公平。',
        createdAt: '2024-01-13 09:45',
        replyToTimelineId: 't12',
        round: 1
      }
    ]
  }
];
