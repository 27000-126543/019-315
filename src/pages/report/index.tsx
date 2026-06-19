import React, { useState } from 'react';
import { View, Text, Input, Textarea, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import type { ClueCategory, UrgencyLevel, SpreadScope } from '@/types/clue';
import { categoryLabels, spreadScopeLabels } from '@/types/clue';

const categories: ClueCategory[] = [
  'national_image',
  'project_safety',
  'labor_dispute',
  'environmental',
  'political',
  'economic',
  'other'
];

const ReportPage: React.FC = () => {
  const [mediaUrl, setMediaUrl] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<ClueCategory | null>(null);
  const [location, setLocation] = useState('');
  const [language, setLanguage] = useState('');
  const [spreadScope, setSpreadScope] = useState<SpreadScope>('local');
  const [urgency, setUrgency] = useState<UrgencyLevel>('medium');

  const canSubmit = content.trim().length > 0 || mediaUrl.trim().length > 0;

  const handleChooseImage = () => {
    console.log('[ReportPage] 选择图片');
    Taro.chooseImage({
      count: 9,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        console.log('[ReportPage] 选择图片成功:', res.tempFilePaths.length, '张');
        Taro.showToast({
          title: '已添加 ' + res.tempFilePaths.length + ' 张截图',
          icon: 'none'
        });
      },
      fail: (err) => {
        console.error('[ReportPage] 选择图片失败:', err);
      }
    });
  };

  const handleSubmit = () => {
    if (!canSubmit) {
      Taro.showToast({
        title: '请填写线索内容或粘贴链接',
        icon: 'none'
      });
      return;
    }

    if (!category) {
      Taro.showToast({
        title: '请选择线索类别',
        icon: 'none'
      });
      return;
    }

    if (!location.trim()) {
      Taro.showToast({
        title: '请填写发生地点',
        icon: 'none'
      });
      return;
    }

    console.log('[ReportPage] 提交线索:', {
      mediaUrl,
      content,
      category,
      location,
      language,
      spreadScope,
      urgency
    });

    Taro.showLoading({ title: '提交中...' });

    setTimeout(() => {
      Taro.hideLoading();
      Taro.showToast({
        title: '提交成功',
        icon: 'success',
        duration: 2000
      });

      setTimeout(() => {
        setMediaUrl('');
        setContent('');
        setCategory(null);
        setLocation('');
        setLanguage('');
        setSpreadScope('local');
        setUrgency('medium');
      }, 2000);
    }, 1000);
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <Text className={styles.title}>发现舆论苗头</Text>
        <Text className={styles.subtitle}>快速上报，总部专业团队及时研判</Text>
      </View>

      {/* 线索内容 */}
      <View className={styles.section}>
        <Text className={styles.sectionTitle}>线索内容</Text>
        <Text className={styles.sectionDesc}>粘贴媒体链接、上传截图或简单描述，三种方式任选其一或多种</Text>

        <Input
          className={styles.input}
          placeholder="粘贴当地媒体链接（可选）"
          value={mediaUrl}
          onInput={(e) => setMediaUrl(e.detail.value)}
        />

        <View style={{ height: '24rpx' }} />

        <View className={styles.uploadArea} onClick={handleChooseImage}>
          <Text className={styles.uploadIcon}>📷</Text>
          <Text className={styles.uploadText}>点击上传截图照片（可选）</Text>
        </View>

        <View style={{ height: '24rpx' }} />

        <Textarea
          className={styles.textarea}
          placeholder="简单描述你听到或看到的议论（选填，但建议尽量详细）&#10;例如：当地出租车司机都在谈论..."
          value={content}
          onInput={(e) => setContent(e.detail.value)}
          maxlength={2000}
        />
      </View>

      {/* 线索类别 */}
      <View className={styles.section}>
        <Text className={styles.sectionTitle}>线索类别</Text>
        <Text className={styles.sectionDesc}>选择最符合的类别，便于总部分类处理</Text>

        <View className={styles.categoryGrid}>
          {categories.map((cat) => (
            <View
              key={cat}
              className={classnames(styles.categoryItem, category === cat && styles.active)}
              onClick={() => setCategory(cat)}
            >
              {categoryLabels[cat]}
            </View>
          ))}
        </View>
      </View>

      {/* 补充信息 */}
      <View className={styles.section}>
        <Text className={styles.sectionTitle}>补充信息</Text>
        <Text className={styles.sectionDesc}>这些信息有助于总部更准确研判</Text>

        <View className={styles.infoRow}>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>发生地点</Text>
            <Input
              className={styles.infoInput}
              placeholder="如：雅加达"
              value={location}
              onInput={(e) => setLocation(e.detail.value)}
            />
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>语言</Text>
            <Input
              className={styles.infoInput}
              placeholder="如：印尼语"
              value={language}
              onInput={(e) => setLanguage(e.detail.value)}
            />
          </View>
        </View>

        <Text className={styles.infoLabel} style={{ marginBottom: '12rpx' }}>传播范围</Text>
        <View className={styles.spreadRow}>
          {(['local', 'regional', 'national', 'international'] as SpreadScope[]).map((scope) => (
            <View
              key={scope}
              className={classnames(styles.spreadItem, spreadScope === scope && styles.active)}
              onClick={() => setSpreadScope(scope)}
            >
              {spreadScopeLabels[scope]}
            </View>
          ))}
        </View>
      </View>

      {/* 紧急程度 */}
      <View className={styles.section}>
        <Text className={styles.sectionTitle}>紧急程度</Text>
        <Text className={styles.sectionDesc}>根据你的判断选择合适的紧急程度</Text>

        <View className={styles.urgencyRow}>
          <View
            className={classnames(styles.urgencyItem, styles.high, urgency === 'high' && styles.active)}
            onClick={() => setUrgency('high')}
          >
            <Text className={styles.urgencyLabel}>🔴 紧急</Text>
            <Text className={styles.urgencyDesc}>可能迅速发酵</Text>
          </View>
          <View
            className={classnames(styles.urgencyItem, styles.medium, urgency === 'medium' && styles.active)}
            onClick={() => setUrgency('medium')}
          >
            <Text className={styles.urgencyLabel}>🟡 关注</Text>
            <Text className={styles.urgencyDesc}>需要持续观察</Text>
          </View>
          <View
            className={classnames(styles.urgencyItem, styles.low, urgency === 'low' && styles.active)}
            onClick={() => setUrgency('low')}
          >
            <Text className={styles.urgencyLabel}>🟢 一般</Text>
            <Text className={styles.urgencyDesc}>苗头性信息</Text>
          </View>
        </View>
      </View>

      {/* 底部提交栏 */}
      <View className={styles.submitBar}>
        <Button
          className={classnames(styles.submitBtn, !canSubmit && styles.disabled)}
          onClick={handleSubmit}
        >
          提交线索
        </Button>
        <Text className={styles.tipText}>提交后总部舆情团队将在24小时内反馈</Text>
      </View>
    </ScrollView>
  );
};

export default ReportPage;
