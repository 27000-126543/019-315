import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import ClueCard from '@/components/ClueCard';
import { useClue } from '@/store/clueContext';
import type { ClueStatus } from '@/types/clue';
import { statusLabels } from '@/types/clue';

const filterOptions: Array<{ key: 'all' | ClueStatus; label: string }> = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待处理' },
  { key: 'adopted', label: '已采纳' },
  { key: 'supplement', label: '待补充' },
  { key: 'closed', label: '已关闭' }
];

const FeedbackPage: React.FC = () => {
  const { clues } = useClue();
  const [currentFilter, setCurrentFilter] = useState<'all' | ClueStatus>('all');

  const filteredClues = useMemo(() => {
    if (currentFilter === 'all') return clues;
    return clues.filter((clue) => clue.status === currentFilter);
  }, [currentFilter, clues]);

  const stats = useMemo(() => {
    return {
      total: clues.length,
      adopted: clues.filter((c) => c.status === 'adopted').length,
      pending: clues.filter((c) => c.status === 'pending' || c.status === 'supplement').length
    };
  }, [clues]);

  const handleGoReport = () => {
    console.log('[FeedbackPage] 跳转到发现线索页');
    Taro.switchTab({
      url: '/pages/report/index'
    });
  };

  const handleCardClick = (id: string) => {
    console.log('[FeedbackPage] 点击线索:', id);
    Taro.navigateTo({
      url: `/pages/detail/index?id=${id}`
    });
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <Text className={styles.title}>总部反馈</Text>
        <Text className={styles.subtitle}>查看你提交的线索处理进展</Text>
      </View>

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

      <ScrollView className={styles.filterRow} scrollX enhanced showScrollbar={false}>
        {filterOptions.map((option) => (
          <View
            key={option.key}
            className={classnames(styles.filterItem, currentFilter === option.key && styles.active)}
            onClick={() => setCurrentFilter(option.key)}
          >
            {option.label}
          </View>
        ))}
      </ScrollView>

      {filteredClues.length > 0 ? (
        filteredClues.map((clue) => (
          <ClueCard key={clue.id} clue={clue} onClick={() => handleCardClick(clue.id)} />
        ))
      ) : (
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>📭</Text>
          <Text className={styles.emptyText}>
            暂无{currentFilter !== 'all' ? statusLabels[currentFilter as ClueStatus] : ''}线索
          </Text>
          <Button className={styles.emptyBtn} onClick={handleGoReport}>
            去上报线索
          </Button>
        </View>
      )}
    </ScrollView>
  );
};

export default FeedbackPage;
