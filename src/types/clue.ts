export type ClueCategory =
  | 'national_image'
  | 'project_safety'
  | 'labor_dispute'
  | 'environmental'
  | 'political'
  | 'economic'
  | 'other';

export type UrgencyLevel = 'high' | 'medium' | 'low';

export type ClueStatus = 'pending' | 'adopted' | 'supplement' | 'closed';

export type SpreadScope = 'local' | 'regional' | 'national' | 'international';

export interface TimelineEvent {
  id: string;
  type: 'submit' | 'status_change' | 'supplement' | 'feedback';
  status?: ClueStatus;
  content: string;
  operator: string;
  timestamp: string;
}

export interface SupplementData {
  id: string;
  content: string;
  mediaUrl?: string;
  screenshots?: string[];
  createdAt: string;
}

export interface Clue {
  id: string;
  title: string;
  content: string;
  category: ClueCategory;
  mediaUrl?: string;
  screenshots?: string[];
  location: string;
  language: string;
  spreadScope: SpreadScope;
  urgency: UrgencyLevel;
  status: ClueStatus;
  createdAt: string;
  analysisLevel?: 'high' | 'medium' | 'low';
  timeline: TimelineEvent[];
  supplements: SupplementData[];
}

export interface RiskItem {
  id: string;
  title: string;
  description: string;
  category: 'sensitive_topic' | 'taboo_expression';
  level: UrgencyLevel;
  updatedAt: string;
  examples?: string[];
  suggestions?: string[];
}

export const categoryLabels: Record<ClueCategory, string> = {
  national_image: '国家形象',
  project_safety: '项目安全',
  labor_dispute: '劳工争议',
  environmental: '环保质疑',
  political: '政治敏感',
  economic: '经济贸易',
  other: '其他'
};

export const urgencyLabels: Record<UrgencyLevel, string> = {
  high: '紧急',
  medium: '关注',
  low: '一般'
};

export const statusLabels: Record<ClueStatus, string> = {
  pending: '待处理',
  adopted: '已采纳',
  supplement: '待补充',
  closed: '已关闭'
};

export const spreadScopeLabels: Record<SpreadScope, string> = {
  local: '当地',
  regional: '地区',
  national: '全国',
  international: '国际'
};
