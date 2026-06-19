import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import type { ClueStatus } from '@/types/clue';
import { statusLabels } from '@/types/clue';

interface StatusBadgeProps {
  status: ClueStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <View className={classnames(styles.badge, styles[status])}>
      {statusLabels[status]}
    </View>
  );
};

export default StatusBadge;
