import React, { useMemo, useState } from 'react';
import { View, Text, Input, Textarea, Image, ScrollView, Button } from '@tarojs/components';
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
  const { clues, addSupplement } = useClue();
  const [showSupplementForm, setShowSupplementForm] = useState(false);
  const [suppContent, setSuppContent] = useState('');
  const [suppMediaUrl, setSuppMediaUrl] = useState('');
  const [suppScreenshots, setSuppScreenshots] = useState<string[]>([]);

  const clue = useMemo(() => {
    const id = router.params.id;
    if (!id) return undefined;
    return clues.find((c) => c.id === id);
  }, [clues, router.params.id]);

  const handlePreviewImage = (current: string, urls: string[]) => {
    Taro.previewImage({ current, urls });
  };

  const handleSuppChooseImage = () => {
    const remaining = 9 - suppScreenshots.length;
    if (remaining <= 0) {
      Taro.showToast({ title: '最多上传9张', icon: 'none' });
      return;
    }
    Taro.chooseImage({
      count: remaining,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        setSuppScreenshots((prev) => [...prev, ...res.tempFilePaths]);
      },
      fail: (err) => {
        console.error('[DetailPage] 选择图片失败:', err);
      }
    });
  };

  const handleSuppDeleteImage = (index: number) => {
    setSuppScreenshots((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSuppSubmit = () => {
    if (!clue) return;
    if (!suppContent.trim() && !suppMediaUrl.trim() && suppScreenshots.length === 0) {
      Taro.showToast({ title: '请填写补充内容', icon: 'none' });
      return;
    }
    console.log('[DetailPage] 提交补充材料:', clue.id);
    addSupplement(clue.id, {
      content: suppContent.trim(),
      mediaUrl: suppMediaUrl.trim() || undefined,
      screenshots: suppScreenshots.length > 0 ? suppScreenshots : undefined
    });
    setSuppContent('');
    setSuppMediaUrl('');
    setSuppScreenshots([]);
    setShowSupplementForm(false);
    Taro.showToast({ title: '补充材料已提交', icon: 'success' });
  };

  const timelineTypeClass: Record<string, string> = {
    submit: styles.submit,
    status_change: styles.statusChange,
    supplement: styles.supplement
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

      {/* 原始线索内容 */}
      <View className={styles.section}>
        <Text className={styles.sectionTitle}>原始线索</Text>
        {clue.content ? (
          <Text className={styles.contentText}>{clue.content}</Text>
        ) : (
          <Text className={styles.contentText} style={{ color: '#94A3B8' }}>（无文字描述）</Text>
        )}
        {clue.mediaUrl && (
          <View style={{ marginTop: '16rpx' }}>
            <Text className={styles.urlBox}>🔗 {clue.mediaUrl}</Text>
          </View>
        )}
        {clue.screenshots && clue.screenshots.length > 0 && (
          <View style={{ marginTop: '16rpx' }}>
            <Text style={{ fontSize: '24rpx', color: '#64748B', marginBottom: '12rpx', display: 'block' }}>
              截图（{clue.screenshots.length}张）
            </Text>
            <View className={styles.screenshotGrid}>
              {clue.screenshots.map((url, idx) => (
                <View
                  key={idx}
                  className={styles.screenshotItem}
                  onClick={() => handlePreviewImage(url, clue.screenshots!)}
                >
                  <Image className={styles.screenshotImg} src={url} mode="aspectFill" />
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* 补充材料 */}
      {clue.supplements.length > 0 && (
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>补充材料（{clue.supplements.length}次）</Text>
          {clue.supplements.map((supp) => (
            <View key={supp.id} className={styles.supplementCard}>
              <Text className={styles.supplementLabel}>补充 #{supp.id.substring(0, 4)}</Text>
              <Text className={styles.supplementTime}>{supp.createdAt}</Text>
              {supp.content && (
                <Text className={styles.supplementText}>{supp.content}</Text>
              )}
              {supp.mediaUrl && (
                <View style={{ marginTop: '8rpx' }}>
                  <Text className={styles.urlBox}>🔗 {supp.mediaUrl}</Text>
                </View>
              )}
              {supp.screenshots && supp.screenshots.length > 0 && (
                <View style={{ marginTop: '8rpx' }}>
                  <View className={styles.screenshotGrid}>
                    {supp.screenshots.map((url, idx) => (
                      <View
                        key={idx}
                        className={styles.screenshotItem}
                        onClick={() => handlePreviewImage(url, supp.screenshots!)}
                      >
                        <Image className={styles.screenshotImg} src={url} mode="aspectFill" />
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {/* 补充材料按钮/表单 */}
      {(clue.status === 'supplement' || clue.status === 'adopted' || clue.status === 'pending') && (
        <View className={styles.section}>
          {!showSupplementForm ? (
            <Button className={styles.addSupplementBtn} onClick={() => setShowSupplementForm(true)}>
              ✏️ 补充材料
            </Button>
          ) : (
            <View className={styles.supplementForm}>
              <Text className={styles.formTitle}>补充材料</Text>
              <Input
                className={styles.formInput}
                placeholder="补充链接（可选）"
                value={suppMediaUrl}
                onInput={(e) => setSuppMediaUrl(e.detail.value)}
              />
              <View className={styles.formUploadRow}>
                {suppScreenshots.map((url, index) => (
                  <View key={index} className={styles.formUploadItem}>
                    <Image className={styles.uploadImg} src={url} mode="aspectFill" />
                    <View className={styles.deleteBtn} onClick={() => handleSuppDeleteImage(index)}>✕</View>
                  </View>
                ))}
                {suppScreenshots.length < 9 && (
                  <View className={styles.formUploadAdd} onClick={handleSuppChooseImage}>
                    <Text className={styles.addIcon}>+</Text>
                    <Text className={styles.addText}>上传</Text>
                  </View>
                )}
              </View>
              <Textarea
                className={styles.formTextarea}
                placeholder="补充文字说明..."
                value={suppContent}
                onInput={(e) => setSuppContent(e.detail.value)}
                maxlength={1000}
              />
              <View className={styles.formActions}>
                <Button className={styles.formCancelBtn} onClick={() => setShowSupplementForm(false)}>
                  取消
                </Button>
                <Button className={styles.formSubmitBtn} onClick={handleSuppSubmit}>
                  提交补充
                </Button>
              </View>
            </View>
          )}
        </View>
      )}

      {/* 处理时间线 */}
      <View className={styles.section}>
        <Text className={styles.sectionTitle}>处理时间线</Text>
        <View className={styles.timelineList}>
          {clue.timeline.map((event) => (
            <View
              key={event.id}
              className={classnames(styles.timelineItem, timelineTypeClass[event.type])}
            >
              <Text className={styles.timelineOperator}>{event.operator}</Text>
              <Text className={styles.timelineTime}>{event.timestamp}</Text>
              <View style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                {event.status && (
                  <View className={classnames(styles.timelineStatusBadge, styles[event.status])}>
                    {statusLabels[event.status]}
                  </View>
                )}
                <Text className={styles.timelineContent}>{event.content}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default DetailPage;
