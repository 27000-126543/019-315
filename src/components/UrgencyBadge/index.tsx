import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import type { UrgencyLevel } from '@/types/clue';
import { urgencyLabels } from '@/types/clue';

interface UrgencyBadgeProps {
  level: UrgencyLevel;
}

const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({ level }) => {
  return (
    <View className={classnames(styles.badge, styles[level])}>
      {urgencyLabels[level]}
    </View>
  );
};

export default UrgencyBadge;
