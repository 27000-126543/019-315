import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import CategoryTag from '@/components/CategoryTag';
import UrgencyBadge from '@/components/UrgencyBadge';
import StatusBadge from '@/components/StatusBadge';
import type { Clue } from '@/types/clue';

interface ClueCardProps {
  clue: Clue;
  showFeedback?: boolean;
}

const ClueCard: React.FC<ClueCardProps> = ({ clue, showFeedback = true }) => {
  const handleClick = () => {
    console.log('[ClueCard] 点击线索:', clue.id);
    Taro.showToast({
      title: '查看详情功能开发中',
      icon: 'none'
    });
  };

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.header}>
        <Text className={styles.title}>{clue.title}</Text>
        <UrgencyBadge level={clue.urgency} />
      </View>

      <View className={styles.meta}>
        <CategoryTag category={clue.category} />
        <StatusBadge status={clue.status} />
      </View>

      <Text className={styles.summary}>{clue.content}</Text>

      {showFeedback && clue.feedback && (
        <View className={styles.feedbackPreview}>
          <Text className={styles.feedbackLabel}>总部反馈</Text>
          <Text className={styles.feedbackText}>{clue.feedback}</Text>
        </View>
      )}

      <View className={styles.footer}>
        <Text className={styles.location}>📍 {clue.location}</Text>
        <Text className={styles.time}>{clue.createdAt}</Text>
      </View>
    </View>
  );
};

export default ClueCard;
