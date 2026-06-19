import React from 'react';
import { View } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import type { ClueCategory } from '@/types/clue';
import { categoryLabels } from '@/types/clue';

interface CategoryTagProps {
  category: ClueCategory;
}

const categoryClassMap: Record<ClueCategory, string> = {
  national_image: 'nationalImage',
  project_safety: 'projectSafety',
  labor_dispute: 'laborDispute',
  environmental: 'environmental',
  political: 'political',
  economic: 'economic',
  other: 'other'
};

const CategoryTag: React.FC<CategoryTagProps> = ({ category }) => {
  return (
    <View className={classnames(styles.tag, styles[categoryClassMap[category]])}>
      {categoryLabels[category]}
    </View>
  );
};

export default CategoryTag;
