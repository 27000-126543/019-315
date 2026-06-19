import React, { useState } from 'react';
import { View, Text, Input, Textarea, Button, ScrollView, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useClue } from '@/store/clueContext';
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
  const { addClue } = useClue();
  const [mediaUrl, setMediaUrl] = useState('');
  const [content, setContent] = useState('');
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [category, setCategory] = useState<ClueCategory | null>(null);
  const [location, setLocation] = useState('');
  const [language, setLanguage] = useState('');
  const [spreadScope, setSpreadScope] = useState<SpreadScope>('local');
  const [urgency, setUrgency] = useState<UrgencyLevel>('medium');
  const [submitting, setSubmitting] = useState(false);

  const hasContent = content.trim().length > 0 || mediaUrl.trim().length > 0 || screenshots.length > 0;

  const handleChooseImage = () => {
    console.log('[ReportPage] 选择图片');
    const remaining = 9 - screenshots.length;
    if (remaining <= 0) {
      Taro.showToast({
        title: '最多上传9张截图',
        icon: 'none'
      });
      return;
    }

    Taro.chooseImage({
      count: remaining,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        console.log('[ReportPage] 选择图片成功:', res.tempFilePaths.length, '张');
        setScreenshots((prev) => [...prev, ...res.tempFilePaths]);
      },
      fail: (err) => {
        console.error('[ReportPage] 选择图片失败:', err);
      }
    });
  };

  const handleDeleteImage = (index: number) => {
    console.log('[ReportPage] 删除图片:', index);
    setScreenshots((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePreviewImage = (index: number) => {
    console.log('[ReportPage] 预览图片:', index);
    Taro.previewImage({
      current: screenshots[index],
      urls: screenshots
    });
  };

  const handleSubmit = () => {
    if (!hasContent) {
      Taro.showToast({
        title: '请填写线索内容、粘贴链接或上传截图',
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

    setSubmitting(true);

    const title =
      content.trim().substring(0, 30) ||
      (mediaUrl ? '媒体链接线索' : '') ||
      (screenshots.length > 0 ? '截图线索' : '新线索');

    const fullTitle = title.length > 20 ? title.substring(0, 20) + '...' : title;

    console.log('[ReportPage] 提交线索:', {
      title: fullTitle,
      mediaUrl,
      content,
      screenshots: screenshots.length,
      category,
      location,
      language,
      spreadScope,
      urgency
    });

    setTimeout(() => {
      addClue({
        title: fullTitle,
        content: content.trim(),
        category,
        mediaUrl: mediaUrl.trim() || undefined,
        screenshots: screenshots.length > 0 ? screenshots : undefined,
        location: location.trim(),
        language: language.trim() || '未知',
        spreadScope,
        urgency
      });

      setSubmitting(false);

      Taro.showToast({
        title: '提交成功',
        icon: 'success',
        duration: 1500
      });

      setTimeout(() => {
        setMediaUrl('');
        setContent('');
        setScreenshots([]);
        setCategory(null);
        setLocation('');
        setLanguage('');
        setSpreadScope('local');
        setUrgency('medium');

        Taro.switchTab({
          url: '/pages/feedback/index'
        });
      }, 1500);
    }, 800);
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
        <Text className={styles.sectionDesc}>
          粘贴媒体链接、上传截图或简单描述，三种方式任选其一或多种
        </Text>

        <Input
          className={styles.input}
          placeholder="粘贴当地媒体链接（可选）"
          value={mediaUrl}
          onInput={(e) => setMediaUrl(e.detail.value)}
        />

        <View style={{ height: '24rpx' }} />

        <View className={styles.uploadSection}>
          {screenshots.map((url, index) => (
            <View key={index} className={styles.uploadItem}>
              <Image
                className={styles.uploadImg}
                src={url}
                mode="aspectFill"
                onClick={() => handlePreviewImage(index)}
              />
              <View className={styles.deleteBtn} onClick={() => handleDeleteImage(index)}>
                ✕
              </View>
            </View>
          ))}
          {screenshots.length < 9 && (
            <View className={styles.uploadAddBtn} onClick={handleChooseImage}>
              <Text className={styles.addIcon}>+</Text>
              <Text className={styles.addText}>上传截图</Text>
            </View>
          )}
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
            <Text className={styles.infoLabel}>发生地点 *</Text>
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

        <Text className={styles.infoLabel} style={{ marginBottom: '12rpx' }}>
          传播范围
        </Text>
        <View className={styles.spreadRow}>
          {(['local', 'regional', 'national', 'international'] as SpreadScope[]).map(
            (scope) => (
              <View
                key={scope}
                className={classnames(styles.spreadItem, spreadScope === scope && styles.active)}
                onClick={() => setSpreadScope(scope)}
              >
                {spreadScopeLabels[scope]}
              </View>
            )
          )}
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
            className={classnames(
              styles.urgencyItem,
              styles.medium,
              urgency === 'medium' && styles.active
            )}
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
          className={classnames(styles.submitBtn, (!hasContent || submitting) && styles.disabled)}
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? '提交中...' : '提交线索'}
        </Button>
        <Text className={styles.tipText}>提交后总部舆情团队将在24小时内反馈</Text>
      </View>
    </ScrollView>
  );
};

export default ReportPage;
