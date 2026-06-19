import React, { useState, useMemo } from 'react';
import { View, Text, Input, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import ClueCard from '@/components/ClueCard';
import { useClue } from '@/store/clueContext';
import type { ClueStatus, ClueCategory, UrgencyLevel } from '@/types/clue';

const statusFilters: Array<{ key: 'all' | ClueStatus; label: string }> = [
  { key: 'all', label: '全部状态' },
  { key: 'pending', label: '待处理' },
  { key: 'adopted', label: '已采纳' },
  { key: 'supplement', label: '待补充' },
  { key: 'closed', label: '已关闭' }
];

const categoryFilters: Array<{ key: 'all' | ClueCategory; label: string }> = [
  { key: 'all', label: '全部类别' },
  { key: 'national_image', label: '国家形象' },
  { key: 'project_safety', label: '项目安全' },
  { key: 'labor_dispute', label: '劳工争议' },
  { key: 'environmental', label: '环保质疑' },
  { key: 'political', label: '政治敏感' },
  { key: 'economic', label: '经济贸易' },
  { key: 'other', label: '其他' }
];

const urgencyFilters: Array<{ key: 'all' | UrgencyLevel; label: string }> = [
  { key: 'all', label: '全部紧急度' },
  { key: 'high', label: '紧急' },
  { key: 'medium', label: '关注' },
  { key: 'low', label: '一般' }
];

const FeedbackPage: React.FC = () => {
  const { clues } = useClue();
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ClueStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | ClueCategory>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<'all' | UrgencyLevel>('all');

  const locationOptions = useMemo(() => {
    const locations = [...new Set(clues.map((c) => c.location))];
    return ['all', ...locations];
  }, [clues]);

  const [locationFilter, setLocationFilter] = useState('all');

  const filteredClues = useMemo(() => {
    return clues.filter((clue) => {
      if (statusFilter !== 'all' && clue.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && clue.category !== categoryFilter) return false;
      if (urgencyFilter !== 'all' && clue.urgency !== urgencyFilter) return false;
      if (locationFilter !== 'all' && clue.location !== locationFilter) return false;
      if (keyword.trim()) {
        const kw = keyword.trim().toLowerCase();
        const searchFields = [
          clue.title,
          clue.content,
          clue.location,
          clue.language,
          clue.mediaUrl || '',
          ...clue.timeline.map((e) => e.content),
          ...clue.supplements.map((s) => s.content)
        ]
          .join(' ')
          .toLowerCase();
        if (!searchFields.includes(kw)) return false;
      }
      return true;
    });
  }, [clues, statusFilter, categoryFilter, urgencyFilter, locationFilter, keyword]);

  const stats = useMemo(() => {
    return {
      total: clues.length,
      adopted: clues.filter((c) => c.status === 'adopted').length,
      pending: clues.filter((c) => c.status === 'pending' || c.status === 'supplement').length
    };
  }, [clues]);

  const hasActiveFilter =
    statusFilter !== 'all' ||
    categoryFilter !== 'all' ||
    urgencyFilter !== 'all' ||
    locationFilter !== 'all' ||
    keyword.trim() !== '';

  const clearAllFilters = () => {
    setStatusFilter('all');
    setCategoryFilter('all');
    setUrgencyFilter('all');
    setLocationFilter('all');
    setKeyword('');
  };

  const handleGoReport = () => {
    Taro.switchTab({ url: '/pages/report/index' });
  };

  const handleCardClick = (id: string) => {
    Taro.navigateTo({ url: `/pages/detail/index?id=${id}` });
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <Text className={styles.title}>总部反馈</Text>
        <Text className={styles.subtitle}>查看你提交的线索处理进展</Text>
      </View>

      {/* 统计卡片 */}
      <View className={styles.statsRow}>
        <View className={styles.statCard}>
          <Text className={styles.statNum}>{stats.total}</Text>
          <Text className={styles.statLabel}>累计上报</Text>
        </View>
        <View className={classnames(styles.statCard, styles.adopted)}>
          <Text className={styles.statNum}>{stats.adopted}</Text>
          <Text className={styles.statLabel}>已采纳</Text>
        </View>
        <View className={classnames(styles.statCard, styles.pending)}>
          <Text className={styles.statNum}>{stats.pending}</Text>
          <Text className={styles.statLabel}>处理中</Text>
        </View>
      </View>

      {/* 搜索框 */}
      <View className={styles.searchBox}>
        <Text className={styles.searchIcon}>🔍</Text>
        <Input
          className={styles.searchInput}
          placeholder="搜索关键词..."
          value={keyword}
          onInput={(e) => setKeyword(e.detail.value)}
        />
        {keyword && (
          <Text className={styles.searchClear} onClick={() => setKeyword('')}>
            ✕
          </Text>
        )}
      </View>

      {/* 状态筛选 */}
      <View className={styles.filterSection}>
        <View className={styles.filterRow}>
          {statusFilters.map((f) => (
            <View
              key={f.key}
              className={classnames(styles.filterTag, statusFilter === f.key && styles.active)}
              onClick={() => setStatusFilter(f.key)}
            >
              {f.label}
            </View>
          ))}
        </View>
      </View>

      {/* 类别筛选 */}
      <View className={styles.filterSection}>
        <View className={styles.filterRow}>
          {categoryFilters.map((f) => (
            <View
              key={f.key}
              className={classnames(styles.filterTag, categoryFilter === f.key && styles.active)}
              onClick={() => setCategoryFilter(f.key)}
            >
              {f.label}
            </View>
          ))}
        </View>
      </View>

      {/* 紧急程度筛选 */}
      <View className={styles.filterSection}>
        <View className={styles.filterRow}>
          {urgencyFilters.map((f) => (
            <View
              key={f.key}
              className={classnames(styles.filterTag, urgencyFilter === f.key && styles.active)}
              onClick={() => setUrgencyFilter(f.key)}
            >
              {f.label}
            </View>
          ))}
        </View>
      </View>

      {/* 地点筛选 */}
      {locationOptions.length > 2 && (
        <View className={styles.filterSection}>
          <View className={styles.filterRow}>
            {locationOptions.map((loc) => (
              <View
                key={loc}
                className={classnames(styles.filterTag, locationFilter === loc && styles.active)}
                onClick={() => setLocationFilter(loc)}
              >
                {loc === 'all' ? '全部地点' : loc}
              </View>
            ))}
          </View>
        </View>
      )}

      {/* 结果数量 */}
      <Text className={styles.resultCount}>
        共 {filteredClues.length} 条结果
        {hasActiveFilter && (
          <Text style={{ color: '#1E40AF', marginLeft: '16rpx' }} onClick={clearAllFilters}>
            清除筛选
          </Text>
        )}
      </Text>

      {/* 线索列表 */}
      {filteredClues.length > 0 ? (
        filteredClues.map((clue) => (
          <ClueCard key={clue.id} clue={clue} onClick={() => handleCardClick(clue.id)} />
        ))
      ) : (
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>📭</Text>
          <Text className={styles.emptyText}>
            {hasActiveFilter ? '没有匹配的线索' : '暂无线索'}
          </Text>
          {hasActiveFilter && (
            <Text
              className={styles.emptyBtn}
              onClick={clearAllFilters}
            >
              清除筛选
            </Text>
          )}
          {!hasActiveFilter && (
            <Text className={styles.emptyBtn} onClick={handleGoReport}>
              去上报线索
            </Text>
          )}
        </View>
      )}
    </ScrollView>
  );
};

export default FeedbackPage;
