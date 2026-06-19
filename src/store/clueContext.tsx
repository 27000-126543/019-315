import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Taro from '@tarojs/taro';
import type { Clue, TimelineEvent, SupplementData, ClueStatus } from '@/types/clue';
import { mockClues } from '@/data/mockClues';

interface ClueContextType {
  clues: Clue[];
  addClue: (clue: Omit<Clue, 'id' | 'status' | 'createdAt' | 'timeline' | 'supplements' | 'isStarred' | 'currentRound'>) => void;
  addSupplement: (clueId: string, supplement: Omit<SupplementData, 'id' | 'createdAt' | 'replyToTimelineId' | 'round'>, replyToTimelineId: string) => void;
  addHeadquartersProcessing: (clueId: string, status: ClueStatus, content: string) => void;
  toggleStar: (clueId: string) => void;
  getClueById: (id: string) => Clue | undefined;
}

const ClueContext = createContext<ClueContextType | undefined>(undefined);

const STORAGE_KEY = 'clue_records_v3';

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const imageToBase64 = (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const fs = Taro.getFileSystemManager();
      fs.readFile({
        filePath,
        encoding: 'base64',
        success: (res) => {
          const ext = filePath.toLowerCase().split('.').pop() || 'jpg';
          const mimeMap: Record<string, string> = {
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            png: 'image/png',
            gif: 'image/gif',
            webp: 'image/webp',
            bmp: 'image/bmp'
          };
          const mime = mimeMap[ext] || 'image/jpeg';
          resolve(`data:${mime};base64,${res.data}`);
        },
        fail: (err) => {
          console.error('[imageToBase64] 转换失败:', filePath, err);
          reject(new Error('图片转换失败'));
        }
      });
    } catch (err) {
        console.error('[imageToBase64] 异常:', err);
        reject(new Error('文件系统不可用'));
      }
    });
};

const processScreenshots = async (paths: string[]): Promise<string[]> => {
  const results = await Promise.all(
    paths.map((p) => (p.startsWith('data:') ? Promise.resolve(p) : imageToBase64(p)))
  );
  return results.filter(Boolean);
};

const mockScenarios = [
  { status: 'adopted' as const, content: '已纳入今日舆情监测范围，正在协调相关部门研判处置。请继续关注事态发展。', analysisLevel: 'medium' as const },
  { status: 'adopted' as const, content: '线索已采纳并转交新闻部门跟进。建议我方保持低调，暂不主动回应。', analysisLevel: 'high' as const },
  { status: 'supplement' as const, content: '线索有价值，请补充以下信息：1. 事件发生的具体时间和场合；2. 是否有更多来源佐证；3. 当地社区对此的普遍态度。', analysisLevel: 'medium' as const },
  { status: 'supplement' as const, content: '需进一步核实，请补充：1. 原始信息的完整翻译；2. 是否已引起当地政府关注；3. 对我项目的潜在影响评估。', analysisLevel: 'high' as const },
  { status: 'adopted' as const, content: '感谢上报，信息已纳入研判系统。当前评估风险可控，建议持续观察。', analysisLevel: 'low' as const },
  { status: 'closed' as const, content: '经多日持续监测未发现异常扩散迹象，该线索暂作归档处理。如有新情况请继续上报。', analysisLevel: 'low' as const },
  { status: 'closed' as const, content: '经研判，该线索属正常舆论范畴，无需特别处置。已归档。', analysisLevel: 'low' as const }
];

const chooseMockScenario = () => {
  return mockScenarios[Math.floor(Math.random() * mockScenarios.length)];
};

export const ClueProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [clues, setClues] = useState<Clue[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const stored = await Taro.getStorage({ key: STORAGE_KEY });
        if (stored && stored.data) {
          const parsed = JSON.parse(stored.data);
          if (Array.isArray(parsed) && parsed.length > 0) {
            console.log('[ClueContext] 从本地存储加载线索:', parsed.length);
            setClues(parsed);
            setLoaded(true);
            return;
          }
        }
      } catch {
        console.log('[ClueContext] 本地存储无数据，使用 mock 数据');
      }
      console.log('[ClueContext] 加载 mock 数据:', mockClues.length);
      setClues(mockClues);
      setLoaded(true);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const saveData = async () => {
      try {
        await Taro.setStorage({
          key: STORAGE_KEY,
          data: JSON.stringify(clues)
        });
      } catch (err) {
        console.error('[ClueContext] 保存到本地存储失败:', err);
      }
    };
    saveData();
  }, [clues, loaded]);

  const addClue = async (
    clueData: Omit<Clue, 'id' | 'status' | 'createdAt' | 'timeline' | 'supplements' | 'isStarred' | 'currentRound'>) => {
    let processedScreenshots: string[] = [];
    if (clueData.screenshots && clueData.screenshots.length > 0) {
      try {
        processedScreenshots = await processScreenshots(clueData.screenshots);
      } catch {
        console.warn('[ClueContext] 部分截图保存失败，已跳过');
      }
    }

    const submitEvent: TimelineEvent = {
      id: generateId(),
      type: 'submit',
      content: '线索已提交',
      operator: '现场人员',
      operatorRole: 'field',
      timestamp: formatDate(new Date()),
      round: 1
    };

    const newClue: Clue = {
      ...clueData,
      screenshots: processedScreenshots.length > 0 ? processedScreenshots : undefined,
      id: generateId(),
      status: 'pending',
      createdAt: formatDate(new Date()),
      isStarred: false,
      currentRound: 1,
      timeline: [submitEvent],
      supplements: []
    };
    console.log('[ClueContext] 添加新线索:', newClue.id);
    setClues((prev) => [newClue, ...prev]);

    setTimeout(() => {
      const scenario = chooseMockScenario();
      addHeadquartersProcessing(newClue.id, scenario.status, scenario.content);
    }, 3000);
  };

  const addHeadquartersProcessing = (clueId: string, status: ClueStatus, content: string) => {
    const scenario = mockScenarios.find((s) => s.status === status) || chooseMockScenario();
    const analysisLevel = scenario.analysisLevel;

    setClues((prev) =>
      prev.map((c) => {
        if (c.id !== clueId) return c;
        const nextRound = c.currentRound + 1;
        const timelineEvent: TimelineEvent = {
          id: generateId(),
          type: 'status_change',
          status,
          content,
          operator: '总部舆情中心',
          operatorRole: 'headquarters',
          timestamp: formatDate(new Date()),
          round: nextRound
        };
        return {
          ...c,
          status,
          analysisLevel,
          currentRound: nextRound,
          timeline: [...c.timeline, timelineEvent]
        };
      })
    );
    console.log('[ClueContext] 总部处理已更新:', clueId, status);
  };

  const addSupplement = async (
    clueId: string,
    supplementData: Omit<SupplementData, 'id' | 'createdAt' | 'replyToTimelineId' | 'round'>,
    replyToTimelineId: string
  ) => {
    let processedScreenshots: string[] = [];
    if (supplementData.screenshots && supplementData.screenshots.length > 0) {
      try {
        processedScreenshots = await processScreenshots(supplementData.screenshots);
      } catch {
        console.warn('[ClueContext] 补充截图保存失败，已跳过');
      }
    }

    setClues((prev) =>
      prev.map((c) => {
        if (c.id !== clueId) return c;
        const replyEvent = c.timeline.find((t) => t.id === replyToTimelineId);
        const round = replyEvent?.round || c.currentRound;
        const supplement: SupplementData = {
          ...supplementData,
          screenshots: processedScreenshots.length > 0 ? processedScreenshots : undefined,
          id: generateId(),
          createdAt: formatDate(new Date()),
          replyToTimelineId,
          round
        };
        const timelineEvent: TimelineEvent = {
          id: generateId(),
          type: 'supplement',
          content: '现场人员补充了材料',
          operator: '现场人员',
          operatorRole: 'field',
          timestamp: supplement.createdAt,
          round
        };
        return {
          ...c,
          supplements: [...c.supplements, supplement],
          timeline: [...c.timeline, timelineEvent]
        };
      })
    );
    console.log('[ClueContext] 补充材料已添加:', clueId);

    setTimeout(() => {
      const scenario = chooseMockScenario();
      addHeadquartersProcessing(clueId, scenario.status, scenario.content);
    }, 4000);
  };

  const toggleStar = (clueId: string) => {
    setClues((prev) =>
      prev.map((c) =>
      c.id === clueId ? { ...c, isStarred: !c.isStarred } : c
    )
    );
  };

  const getClueById = (id: string) => {
    return clues.find((c) => c.id === id);
  };

  return (
    <ClueContext.Provider
      value={{ clues, addClue, addSupplement, addHeadquartersProcessing, toggleStar, getClueById }}
    >
      {children}
    </ClueContext.Provider>
  );
};

export const useClue = () => {
  const context = useContext(ClueContext);
  if (!context) {
    throw new Error('useClue must be used within a ClueProvider');
  }
  return context;
};
