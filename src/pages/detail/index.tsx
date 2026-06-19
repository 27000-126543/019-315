import React, { useState, useMemo } from 'react';
import { View, Text, Input, Textarea, ScrollView, Image } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import CategoryTag from '@/components/CategoryTag';
import UrgencyBadge from '@/components/UrgencyBadge';
import StatusBadge from '@/components/StatusBadge';
import { useClue } from '@/store/clueContext';
import type { ClueStatus, TimelineEvent, SupplementData } from '@/types/clue';

const statusLabels: Record<ClueStatus, string> = {
  pending: '待处理',
  adopted: '已采纳',
  supplement: '待补充',
  closed: '已关闭'
};

const operatorLabels: Record<string, string> = {
  headquarters: '总部舆情人员',
  field: '现场上报人'
};

const DetailPage: React.FC = () => {
  const router = useRouter();
  const clueId = router.params.id;
  const { getClueById, toggleStar, addSupplement, addHeadquartersProcessing } = useClue();
  const clue = getClueById(clueId || '');

  const [showSupplementForm, setShowSupplementForm] = useState(false);
  const [supplementContent, setSupplementContent] = useState('');
  const [supplementMediaUrl, setSupplementMediaUrl] = useState('');
  const [supplementScreenshots, setSupplementScreenshots] = useState<string[]>([]);
  const [replyToTimelineId, setReplyToTimelineId] = useState<string>('');

  const [hqStatus, setHqStatus] = useState<ClueStatus>('adopted');
  const [hqContent, setHqContent] = useState('');

  if (!clue) {
    return (
      <View className={styles.page}>
        <Text>线索不存在</Text>
      </View>
    );
  }

  const handlePreviewScreenshot = (urls: string[], index: number) => {
    Taro.previewImage({
      current: urls[index],
      urls
    });
  };

  const handleChooseImage = async () => {
    try {
      const res = await Taro.chooseImage({
        count: 9 - supplementScreenshots.length,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera']
      });
      setSupplementScreenshots([...supplementScreenshots, ...res.tempFilePaths]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteScreenshot = (idx: number) => {
    const next = [...supplementScreenshots];
    next.splice(idx, 1);
    setSupplementScreenshots(next);
  };

  const handleSubmitSupplement = async () => {
    if (!supplementContent.trim() && supplementScreenshots.length === 0) {
      Taro.showToast({ title: '请填写补充说明或上传截图', icon: 'none' });
      return;
    }
    try {
      const timelineId = replyToTimelineId || undefined;
      await addSupplement(clue.id, supplementContent.trim(), supplementMediaUrl.trim() || undefined, supplementScreenshots, timelineId);
      setShowSupplementForm(false);
      setSupplementContent('');
      setSupplementMediaUrl('');
      setSupplementScreenshots([]);
      setReplyToTimelineId('');
      Taro.showToast({ title: '补充材料已提交', icon: 'success' });
    } catch (err) {
      console.error(err);
      Taro.showToast({ title: '提交失败，请重试', icon: 'none' });
    }
  };

  const handleSubmitHQProcessing = () => {
    if (!hqContent.trim()) {
      Taro.showToast({ title: '请填写处理意见', icon: 'none' });
      return;
    }
    addHeadquartersProcessing(clue.id, hqStatus, hqContent.trim());
    setHqContent('');
    Taro.showToast({ title: '处理意见已提交', icon: 'success' });
  };

  const handleStarClick = () => {
    toggleStar(clue.id);
    Taro.showToast({
      title: clue.isStarred ? '已取消关注' : '已关注',
      icon: 'none',
      duration: 1000
    });
  };

  const handleOpenSupplementForm = (timelineId?: string) => {
    setReplyToTimelineId(timelineId || '');
    setShowSupplementForm(true);
  };

  const supplementsByTimelineId = useMemo(() => {
    const map: Record<string, SupplementData[]> = {};
    clue.supplements.forEach((s) => {
      const key = s.replyToTimelineId || 'general';
      if (!map[key]) map[key] = [];
      map[key].push(s);
    });
    return map;
  }, [clue.supplements]);

  const getTimelineEventById = (id: string): TimelineEvent | undefined => {
    return clue.timeline.find((t) => t.id === id);
  };

  const supplementRounds = useMemo(() => {
    const rounds: Array<{
      round: number;
      feedback?: TimelineEvent;
      supplements: SupplementData[];
    }> = [];
    const feedbacks = clue.timeline.filter((t) => t.type === 'status_change' && t.status === 'supplement');

    feedbacks.forEach((fb, idx) => {
      const related = (supplementsByTimelineId[fb.id] || []).sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      rounds.push({
        round: idx + 1,
        feedback: fb,
        supplements: related
      });
    });

    const others = supplementsByTimelineId['general'] || [];
    if (others.length > 0) {
      rounds.push({
        round: rounds.length + 1,
        supplements: others.sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
      });
    }

    return rounds;
  }, [clue.timeline, supplementsByTimelineId]);

  const latestSupplementFeedback = clue.timeline
    .filter((t) => t.type === 'status_change' && t.status === 'supplement')
    .pop();

  return (
    <ScrollView className={styles.page} scrollY>
      {/* 头部信息 */}
      <View className={classnames(styles.section, styles.headerSection)}>
        <View className={styles.titleRow}>
          <Text className={styles.starBtn} onClick={handleStarClick}>
            {clue.isStarred ? '⭐' : '☆'}
          </Text>
          <Text className={styles.title}>{clue.title}</Text>
        </View>
        <View className={styles.metaRow}>
          <View className={styles.tagWhite}>
            <CategoryTag category={clue.category} white />
          </View>
          <View className={styles.badgeWhite}>
            <StatusBadge status={clue.status} white />
          </View>
          <View className={styles.badgeWhite}>
            <UrgencyBadge level={clue.urgency} white />
          </View>
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
            <Text className={styles.infoLabel}>线索语言</Text>
            <Text className={styles.infoValue}>{clue.language}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>传播范围</Text>
            <Text className={styles.infoValue}>{clue.spread}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>研判等级</Text>
            <Text className={styles.infoValue}>
              {clue.analysisLevel === 'high'
                ? '高风险'
                : clue.analysisLevel === 'medium'
                ? '中关注'
                : '低风险'}
            </Text>
          </View>
        </View>
      </View>

      {/* 原始线索 */}
      <View className={styles.section}>
        <Text className={styles.sectionTitle}>原始线索</Text>
        {clue.content && <Text className={styles.contentText}>{clue.content}</Text>}
        {clue.mediaUrl && (
          <View style={{ marginTop: 24 }}>
            <Text className={styles.infoLabel} style={{ marginBottom: 8, display: 'block' }}>
              媒体链接
            </Text>
            <View className={styles.urlBox}>{clue.mediaUrl}</View>
          </View>
        )}
        {clue.screenshots && clue.screenshots.length > 0 && (
          <View style={{ marginTop: 24 }}>
            <Text className={styles.infoLabel} style={{ marginBottom: 8, display: 'block' }}>
              相关截图（{clue.screenshots.length} 张）
            </Text>
            <View className={styles.screenshotGrid}>
              {clue.screenshots.map((url, idx) => (
                <View
                  key={idx}
                  className={styles.screenshotItem}
                  onClick={() => handlePreviewScreenshot(clue.screenshots, idx)}
                >
                  <Image className={styles.screenshotImg} src={url} mode="aspectFill" />
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* 总部处理模拟面板 */}
      <View className={styles.hqPanel}>
        <Text className={styles.hqPanelTitle}>🔧 总部处理模拟面板</Text>
        <View className={styles.hqStatusRow}>
          {(['pending', 'adopted', 'supplement', 'closed'] as ClueStatus[]).map((s) => (
            <View
              key={s}
              className={classnames(styles.hqStatusItem, s, hqStatus === s && styles.active)}
              onClick={() => setHqStatus(s)}
            >
              {statusLabels[s]}
            </View>
          ))}
        </View>
        <Textarea
          className={styles.hqTextarea}
          placeholder="请输入处理意见..."
          value={hqContent}
          onInput={(e) => setHqContent(e.detail.value)}
        />
        <View
          className={classnames(styles.hqSubmitBtn, !hqContent.trim() && styles.disabled)}
          onClick={handleSubmitHQProcessing}
        >
          提交处理
        </View>
      </View>

      {/* 补充材料 - 按轮次展示 */}
      <View className={styles.section}>
        <Text className={styles.sectionTitle}>补充材料</Text>

        {supplementRounds.length === 0 ? (
          <View className={styles.pendingTip}>
            <Text className={styles.tipIcon}>📝</Text>
            <Text className={styles.tipText}>暂无补充材料</Text>
          </View>
        ) : (
          supplementRounds.map(({ round, feedback, supplements }) => (
            <View
              key={round}
              className={classnames(styles.roundCard, feedback ? '' : styles.roundSupplement)}
            >
              <View className={styles.roundHeader}>
                <Text className={styles.roundLabel}>
                  {feedback ? `第 ${round} 轮 · 总部要求补充` : `第 ${round} 轮 · 现场主动补充`}
                </Text>
                <Text className={styles.roundTime}>
                  {feedback ? feedback.timestamp : supplements[0]?.createdAt || ''}
                </Text>
              </View>
              {feedback && <Text className={styles.roundContent}>💬 {feedback.content}</Text>}

              {supplements.length > 0 && (
                <View style={{ marginTop: 12 }}>
                  {supplements.map((s, sIdx) => (
                    <View key={s.id} className={styles.supplementCard}>
                      <Text className={styles.supplementLabel}>
                        现场补充（{sIdx + 1}/{supplements.length}）
                      </Text>
                      <Text className={styles.supplementTime}>{s.createdAt}</Text>
                      <Text className={styles.supplementText}>{s.content}</Text>
                      {s.mediaUrl && (
                        <Text className={styles.supplementText} style={{ marginTop: 8 }}>
                          🔗 {s.mediaUrl}
                        </Text>
                      )}
                      {s.screenshots && s.screenshots.length > 0 && (
                        <View className={styles.screenshotGrid} style={{ marginTop: 12 }}>
                          {s.screenshots.map((url, idx) => (
                            <View
                              key={idx}
                              className={styles.screenshotItem}
                              onClick={() => handlePreviewScreenshot(s.screenshots!, idx)}
                            >
                              <Image className={styles.screenshotImg} src={url} mode="aspectFill" />
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))
        )}

        {latestSupplementFeedback && (
          <View
            className={styles.addSupplementBtn}
            style={{ marginTop: 16 }}
            onClick={() => handleOpenSupplementForm(latestSupplementFeedback.id)}
          >
            + 针对最新意见补充材料
          </View>
        )}
        {!latestSupplementFeedback && (
          <View
            className={styles.addSupplementBtn}
            style={{ marginTop: 16 }}
            onClick={() => handleOpenSupplementForm()}
          >
            + 主动补充材料
          </View>
        )}
      </View>

      {/* 补充材料表单 */}
      {showSupplementForm && (
        <View className={styles.supplementForm}>
          <Text className={styles.formTitle}>提交补充材料</Text>

          {replyToTimelineId && getTimelineEventById(replyToTimelineId) && (
            <View className={styles.replyTargetHint}>
              💬 针对总部意见：{getTimelineEventById(replyToTimelineId)?.content}
            </View>
          )}

          <Input
            className={styles.formInput}
            placeholder="补充链接（选填）"
            value={supplementMediaUrl}
            onInput={(e) => setSupplementMediaUrl(e.detail.value)}
          />
          <Textarea
            className={styles.formTextarea}
            placeholder="请详细说明补充内容（至少填一项）"
            value={supplementContent}
            onInput={(e) => setSupplementContent(e.detail.value)}
          />
          <View className={styles.formUploadRow}>
            {supplementScreenshots.map((url, idx) => (
              <View key={idx} className={styles.formUploadItem}>
                <Image className={styles.uploadImg} src={url} mode="aspectFill" />
                <View className={styles.deleteBtn} onClick={() => handleDeleteScreenshot(idx)}>
                  ✕
                </View>
              </View>
            ))}
            {supplementScreenshots.length < 9 && (
              <View className={styles.formUploadAdd} onClick={handleChooseImage}>
                <Text className={styles.addIcon}>+</Text>
                <Text className={styles.addText}>添加截图</Text>
              </View>
            )}
          </View>
          <View className={styles.formActions}>
            <View className={styles.formCancelBtn} onClick={() => setShowSupplementForm(false)}>
              取消
            </View>
            <View className={styles.formSubmitBtn} onClick={handleSubmitSupplement}>
              提交补充
            </View>
          </View>
        </View>
      )}

      {/* 处理时间线 */}
      <View className={styles.section}>
        <Text className={styles.sectionTitle}>处理时间线</Text>
        <View className={styles.timelineList}>
          {clue.timeline.map((event) => (
            <View
              key={event.id}
              className={classnames(
                styles.timelineItem,
                event.type === 'submit' && styles.submit,
                event.type === 'status_change' && styles.statusChange,
                event.type === 'supplement' && styles.supplement,
                event.operatorRole === 'headquarters' && styles.headquarters,
                event.operatorRole === 'field' && styles.field
              )}
            >
              <View className={styles.timelineOperator}>
                {event.operatorRole && operatorLabels[event.operatorRole]
                  ? operatorLabels[event.operatorRole]
                  : event.operator}
              </View>
              <Text className={styles.timelineTime}>{event.timestamp}</Text>
              <Text className={styles.timelineContent}>
                {event.type === 'submit' && '📮 提交了线索'}
                {event.type === 'status_change' && event.status && (
                  <Text className={classnames(styles.timelineStatusBadge, event.status)}>
                    {statusLabels[event.status]}
                  </Text>
                )}
                {event.type === 'supplement' && '📝 提交了补充材料'}
                {event.content && (
                  <Text style={{ display: event.type === 'status_change' ? 'inline' : 'block', marginTop: event.type !== 'status_change' ? 4 : 0 }}>
                    {event.content}
                  </Text>
                )}
                {event.round && <Text style={{ fontSize: 20, color: '#94a3b8', marginLeft: 8 }}>· 第{event.round}轮</Text>}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default DetailPage;
