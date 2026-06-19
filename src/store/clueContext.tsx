import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Taro from '@tarojs/taro';
import type { Clue } from '@/types/clue';
import { mockClues } from '@/data/mockClues';

interface ClueContextType {
  clues: Clue[];
  addClue: (clue: Omit<Clue, 'id' | 'status' | 'createdAt'>) => void;
  getClueById: (id: string) => Clue | undefined;
  updateClueStatus: (id: string, status: Clue['status'], feedback?: string) => void;
}

const ClueContext = createContext<ClueContextType | undefined>(undefined);

const STORAGE_KEY = 'clue_records_v1';

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
      } catch (err) {
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
        console.log('[ClueContext] 已保存到本地存储');
      } catch (err) {
        console.error('[ClueContext] 保存到本地存储失败:', err);
      }
    };
    saveData();
  }, [clues, loaded]);

  const addClue = (clueData: Omit<Clue, 'id' | 'status' | 'createdAt'>) => {
    const newClue: Clue = {
      ...clueData,
      id: generateId(),
      status: 'pending',
      createdAt: formatDate(new Date())
    };
    console.log('[ClueContext] 添加新线索:', newClue.id);
    setClues((prev) => [newClue, ...prev]);

    setTimeout(() => {
      const feedbacks = [
        '已收到您上报的线索，正在分析研判中。',
        '线索已纳入今日舆情监测范围，请继续关注。',
        '感谢您的上报，我们已转相关部门跟进。'
      ];
      const randomFeedback = feedbacks[Math.floor(Math.random() * feedbacks.length)];
      setClues((prev) =>
        prev.map((c) =>
          c.id === newClue.id
            ? {
                ...c,
                status: 'adopted',
                feedback: randomFeedback,
                analysisLevel: 'medium'
              }
            : c
        )
      );
      console.log('[ClueContext] 模拟总部反馈已更新:', newClue.id);
    }, 3000);
  };

  const getClueById = (id: string) => {
    return clues.find((c) => c.id === id);
  };

  const updateClueStatus = (id: string, status: Clue['status'], feedback?: string) => {
    setClues((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status, ...(feedback ? { feedback } : {}) }
          : c
      )
    );
  };

  return (
    <ClueContext.Provider value={{ clues, addClue, getClueById, updateClueStatus }}>
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
