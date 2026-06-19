import React, { useEffect, useMemo } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useClue } from '@/store/clueContext';
import {
  categoryLabels,
  urgencyLabels,
  spreadScopeLabels,
  statusLabels
} from '@/types/clue';

const DetailPage: React.FC = () => {
  const router = useRouter();
  const { clues } = useClue();

  const clue = useMemo(() => {
    const id = router.params.id;
    if (!id) return undefined;
    return clues.find((c) => c.id === id);
  }, [clues, router.params.id]);

  useEffect(() => {
    if (!router.params.id) {
      Taro.showToast({
        title: '线索不存在',
        icon: 'none'
      });
    }
  }, [router.params.id]);

  const handlePreviewImage = (url: string) => {
    console.log('[DetailPage] 预览图片:', url);
    if (clue?.screenshots && clue.screenshots.length > 0) {
      Taro.previewImage({
        current: url,
        urls: clue.screenshots
      });
    }
  };

  const analysisLabels = {
    high: '高风险',
    medium: '中风险',
    low: '低风险'
  };

  if (!clue) {
    return (
      <ScrollView className={styles.page} scrollY>
        <View className={styles.pendingTip}>
          <Text className={styles.tipIcon}>⏳</Text>
          <Text className={styles.tipText}>加载中...</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView className={styles.page} scrollY>
      {/* 头部 */}
      <View className={classnames(styles.section, styles.headerSection)}>
        <Text className={styles.title}>{clue.title}</Text>
        <View className={styles.metaRow}>
          <View className={styles.tagWhite}>{categoryLabels[clue.category]}</View>
          <View className={styles.badgeWhite}>{urgencyLabels[clue.urgency]}</View>
          <View className={styles.badgeWhite}>{statusLabels[clue.status]}</View>
        </View>
        <Text className={styles.time}>提交时间：{clue.createdAt}</Text>
      </View>

      {/* 基本信息 */}
      <View className={styles.section}>
        <Text className={styles.sectionTitle}>基本信息</Text>
        <View className={styles.infoGrid}>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>发生地点</Text>
            <Text className={styles.infoValue}>{clue.location}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>语言</Text>
            <Text className={styles.infoValue}>{clue.language || '未知'}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>传播范围</Text>
            <Text className={styles.infoValue}>{spreadScopeLabels[clue.spreadScope]}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>紧急程度</Text>
            <Text className={styles.infoValue}>{urgencyLabels[clue.urgency]}</Text>
          </View>
        </View>
      </View>

      {/* 线索内容 */}
      <View className={styles.section}>
        <Text className={styles.sectionTitle}>线索描述</Text>
        {clue.content ? (
          <Text className={styles.contentText}>{clue.content}</Text>
        ) : (
          <Text className={styles.contentText} style={{ color: '$color-text-tertiary' }}>
            （无文字描述）
          </Text>
        )}
      </View>

      {/* 媒体链接 */}
      {clue.mediaUrl && (
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>媒体链接</Text>
          <View className={styles.urlBox}>🔗 {clue.mediaUrl}</View>
        </View>
      )}

      {/* 截图 */}
      {clue.screenshots && clue.screenshots.length > 0 && (
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>截图照片（{clue.screenshots.length}张）</Text>
          <View className={styles.screenshotGrid}>
            {clue.screenshots.map((url, idx) => (
              <View
                key={idx}
                className={styles.screenshotItem}
                onClick={() => handlePreviewImage(url)}
              >
                <Image
                  className={styles.screenshotImg}
                  src={url}
                  mode="aspectFill"
                />
              </View>
            ))}
          </View>
        </View>
      )}

      {/* 总部反馈 */}
      <View className={styles.section}>
        <Text className={styles.sectionTitle}>总部反馈</Text>

        {clue.status === 'pending' ? (
          <View className={styles.pendingTip}>
            <Text className={styles.tipIcon}>⏳</Text>
            <Text className={styles.tipText}>
              线索已提交，总部正在研判中
              {'\n'}一般会在24小时内给出反馈
            </Text>
          </View>
        ) : (
          <View className={styles.feedbackSection}>
            <Text className={styles.feedbackLabel}>
              {clue.status === 'adopted' && '✅ 已采纳'}
              {clue.status === 'supplement' && '📝 待补充'}
              {clue.status === 'closed' && '📁 已关闭'}
            </Text>
            {clue.feedback && (
              <Text className={styles.feedbackText}>{clue.feedback}</Text>
            )}

            {clue.analysisLevel && (
              <View
                className={classnames(styles.analysisBadge, styles[clue.analysisLevel])}
              >
                研判等级：{analysisLabels[clue.analysisLevel]}
              </View>
            )}

            {clue.supplementRequired && clue.supplementRequired.length > 0 && (
              <View className={styles.supplementList}>
                <Text className={styles.supplementTitle}>需要补充的信息：</Text>
                {clue.supplementRequired.map((item, idx) => (
                  <Text key={idx} className={styles.supplementItem}>
                    {item}
                  </Text>
                ))}
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default DetailPage;
