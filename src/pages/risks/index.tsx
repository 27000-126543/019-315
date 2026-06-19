import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import { mockRisks } from '@/data/mockRisks';
import type { UrgencyLevel } from '@/types/clue';

type RiskTab = 'sensitive_topic' | 'taboo_expression';

const levelLabels: Record<UrgencyLevel, string> = {
  high: '高风险',
  medium: '中风险',
  low: '低风险'
};

const RisksPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<RiskTab>('sensitive_topic');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredRisks = useMemo(() => {
    return mockRisks.filter((risk) => risk.category === activeTab);
  }, [activeTab]);

  const toggleExpand = (id: string) => {
    console.log('[RisksPage] 展开/收起风险项:', id);
    setExpandedId(expandedId === id ? null : id);
  };

  const tabLabels: Record<RiskTab, string> = {
    sensitive_topic: '敏感议题',
    taboo_expression: '禁忌表达'
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <Text className={styles.title}>当地风险提示</Text>
        <Text className={styles.subtitle}>了解近期敏感话题和注意事项，避免踩雷</Text>
      </View>

      {/* Tab 切换 */}
      <View className={styles.tabRow}>
        <View
          className={classnames(styles.tabItem, activeTab === 'sensitive_topic' && styles.active)}
          onClick={() => setActiveTab('sensitive_topic')}
        >
          🎯 敏感议题
        </View>
        <View
          className={classnames(styles.tabItem, activeTab === 'taboo_expression' && styles.active)}
          onClick={() => setActiveTab('taboo_expression')}
        >
          🚫 禁忌表达
        </View>
      </View>

      {/* 风险列表 */}
      {filteredRisks.length > 0 ? (
        filteredRisks.map((risk) => (
          <View key={risk.id} className={styles.riskCard} onClick={() => toggleExpand(risk.id)}>
            <View className={styles.riskHeader}>
              <Text className={styles.riskTitle}>{risk.title}</Text>
              <View className={classnames(styles.riskLevel, styles[risk.level])}>
                {levelLabels[risk.level]}
              </View>
            </View>

            <Text className={styles.riskDesc}>{risk.description}</Text>

            <View className={styles.riskMeta}>
              <Text>更新于 {risk.updatedAt}</Text>
              <Text className={classnames(styles.expandIcon, expandedId === risk.id && styles.expanded)}>
                ▼
              </Text>
            </View>

            {expandedId === risk.id && (
              <View className={styles.riskDetail}>
                {risk.examples && risk.examples.length > 0 && (
                  <View className={styles.detailSection}>
                    <Text className={styles.detailTitle}>
                      {activeTab === 'taboo_expression' ? '❌ 不要这样说' : '⚠️ 注意事项'}
                    </Text>
                    <View className={styles.detailList}>
                      {risk.examples.map((example, idx) => (
                        <Text key={idx} className={styles.detailItem}>
                          {example}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}

                {risk.suggestions && risk.suggestions.length > 0 && (
                  <View className={styles.detailSection}>
                    <Text className={styles.detailTitle}>💡 建议做法</Text>
                    <View className={styles.detailList}>
                      {risk.suggestions.map((suggestion, idx) => (
                        <Text key={idx} className={styles.suggestionItem}>
                          {suggestion}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            )}
          </View>
        ))
      ) : (
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>✨</Text>
          <Text className={styles.emptyText}>暂无相关风险提示</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default RisksPage;
