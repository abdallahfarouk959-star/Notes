/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  DayRecord,
  DailyTask,
  DailyDiary,
  PrayerKey,
  MoodType,
  ActiveTab,
  TaskCategory,
  TaskPriority,
} from '../types/notebook';
import { formatDateKey } from '../utils/dateUtils';
import {
  loadAllRecords,
  saveAllRecords,
  getDayRecord,
  loadUserSettings,
  saveUserSettings,
  UserSettings,
} from '../utils/storage';

interface NotebookContextType {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentDay: DayRecord;
  allRecords: Record<string, DayRecord>;
  userSettings: UserSettings;
  updateUserSettings: (newSettings: Partial<UserSettings>) => void;
  // Prayer actions
  togglePrayer: (prayer: PrayerKey, field: 'fard' | 'sunnah' | 'azkar') => void;
  toggleExtraPrayer: (field: 'duha' | 'qiyam' | 'witr') => void;
  // Task actions
  addTask: (task: {
    title: string;
    time?: string;
    category: TaskCategory;
    priority: TaskPriority;
    notes?: string;
  }) => void;
  updateTask: (taskId: string, updates: Partial<DailyTask>) => void;
  toggleTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  // Diary actions
  saveDiary: (data: {
    title: string;
    content: string;
    mood?: MoodType;
    tags?: string[];
    weather?: string;
  }) => void;
  deleteDiary: (targetDate?: string) => void;
  updateReflection: (text: string) => void;
  // Stats for the selected day
  stats: {
    fardCompleted: number;
    sunnahCompleted: number;
    azkarCompleted: number;
    tasksTotal: number;
    tasksCompleted: number;
    hasDiary: boolean;
    dayScorePercent: number;
  };
  refreshData: () => void;
}

const NotebookContext = createContext<NotebookContextType | undefined>(undefined);

export const NotebookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState<string>(() => formatDateKey(new Date()));
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [allRecords, setAllRecords] = useState<Record<string, DayRecord>>(() => loadAllRecords());
  const [userSettings, setUserSettingsState] = useState<UserSettings>(() => loadUserSettings());

  // Reload records from disk when requested
  const refreshData = useCallback(() => {
    setAllRecords(loadAllRecords());
    setUserSettingsState(loadUserSettings());
  }, []);

  const updateUserSettings = useCallback((newSettings: Partial<UserSettings>) => {
    setUserSettingsState((prev) => {
      const merged = { ...prev, ...newSettings };
      saveUserSettings(merged);
      return merged;
    });
  }, []);

  // Current day record derived safely
  const currentDay: DayRecord = useMemo(() => {
    return (
      allRecords[selectedDate] || {
        date: selectedDate,
        prayers: {
          fajr: { fard: false, sunnah: false, azkar: false },
          dhuhr: { fard: false, sunnah: false, azkar: false },
          asr: { fard: false, sunnah: false, azkar: false },
          maghrib: { fard: false, sunnah: false, azkar: false },
          isha: { fard: false, sunnah: false, azkar: false },
          extras: { duha: false, qiyam: false, witr: false },
        },
        tasks: [],
        diary: undefined,
        reflection: '',
      }
    );
  }, [allRecords, selectedDate]);

  // Helper to persist updates to state and localStorage
  const mutateCurrentDay = useCallback(
    (mutator: (prev: DayRecord) => DayRecord) => {
      setAllRecords((prevAll) => {
        const prevRec = prevAll[selectedDate] || getDayRecord(selectedDate);
        const updated = mutator(prevRec);
        const nextAll = { ...prevAll, [selectedDate]: updated };
        saveAllRecords(nextAll);
        return nextAll;
      });
    },
    [selectedDate]
  );

  // Prayer actions
  const togglePrayer = useCallback(
    (prayer: PrayerKey, field: 'fard' | 'sunnah' | 'azkar') => {
      mutateCurrentDay((day) => {
        const prayerCurrent = day.prayers[prayer] || { fard: false, sunnah: false, azkar: false };
        return {
          ...day,
          prayers: {
            ...day.prayers,
            [prayer]: {
              ...prayerCurrent,
              [field]: !prayerCurrent[field],
            },
          },
        };
      });
    },
    [mutateCurrentDay]
  );

  const toggleExtraPrayer = useCallback(
    (field: 'duha' | 'qiyam' | 'witr') => {
      mutateCurrentDay((day) => {
        const currentExtras = day.prayers.extras || { duha: false, qiyam: false, witr: false };
        return {
          ...day,
          prayers: {
            ...day.prayers,
            extras: {
              ...currentExtras,
              [field]: !currentExtras[field],
            },
          },
        };
      });
    },
    [mutateCurrentDay]
  );

  // Task actions
  const addTask = useCallback(
    (taskData: {
      title: string;
      time?: string;
      category: TaskCategory;
      priority: TaskPriority;
      notes?: string;
    }) => {
      mutateCurrentDay((day) => {
        const newTask: DailyTask = {
          id: 'task-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
          title: taskData.title.trim(),
          time: taskData.time?.trim() || undefined,
          category: taskData.category,
          priority: taskData.priority,
          completed: false,
          notes: taskData.notes?.trim() || undefined,
          createdAt: Date.now(),
        };
        return {
          ...day,
          tasks: [...day.tasks, newTask],
        };
      });
    },
    [mutateCurrentDay]
  );

  const updateTask = useCallback(
    (taskId: string, updates: Partial<DailyTask>) => {
      mutateCurrentDay((day) => ({
        ...day,
        tasks: day.tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)),
      }));
    },
    [mutateCurrentDay]
  );

  const toggleTask = useCallback(
    (taskId: string) => {
      mutateCurrentDay((day) => ({
        ...day,
        tasks: day.tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)),
      }));
    },
    [mutateCurrentDay]
  );

  const deleteTask = useCallback(
    (taskId: string) => {
      mutateCurrentDay((day) => ({
        ...day,
        tasks: day.tasks.filter((t) => t.id !== taskId),
      }));
    },
    [mutateCurrentDay]
  );

  // Diary actions
  const saveDiary = useCallback(
    (data: {
      title: string;
      content: string;
      mood?: MoodType;
      tags?: string[];
      weather?: string;
    }) => {
      mutateCurrentDay((day) => {
        const diaryEntry: DailyDiary = {
          id: day.diary?.id || 'diary-' + selectedDate,
          date: selectedDate,
          title: data.title.trim() || 'يوميات ' + selectedDate,
          content: data.content,
          mood: data.mood,
          tags: data.tags,
          weather: data.weather,
          updatedAt: Date.now(),
        };
        return {
          ...day,
          diary: diaryEntry,
        };
      });
    },
    [mutateCurrentDay, selectedDate]
  );

  const deleteDiary = useCallback(
    (targetDate?: string) => {
      const dateToClear = targetDate || selectedDate;
      setAllRecords((prevAll) => {
        const day = prevAll[dateToClear];
        if (!day) return prevAll;
        const updated = { ...day, diary: undefined };
        const nextAll = { ...prevAll, [dateToClear]: updated };
        saveAllRecords(nextAll);
        return nextAll;
      });
    },
    [selectedDate]
  );

  const updateReflection = useCallback(
    (text: string) => {
      mutateCurrentDay((day) => ({
        ...day,
        reflection: text,
      }));
    },
    [mutateCurrentDay]
  );

  // Statistics calculation for the day
  const stats = useMemo(() => {
    const p = currentDay.prayers;
    const prayersList: PrayerKey[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
    const fardCompleted = prayersList.filter((k) => p[k]?.fard).length;
    const sunnahCompleted = prayersList.filter((k) => p[k]?.sunnah).length;
    const azkarCompleted = prayersList.filter((k) => p[k]?.azkar).length;

    const tasksTotal = currentDay.tasks.length;
    const tasksCompleted = currentDay.tasks.filter((t) => t.completed).length;
    const hasDiary = !!currentDay.diary && currentDay.diary.content.trim().length > 0;

    // Weighted day score
    const prayerWeight = (fardCompleted / 5) * 50; // up to 50%
    const tasksWeight = tasksTotal > 0 ? (tasksCompleted / tasksTotal) * 35 : 35; // up to 35%
    const diaryWeight = hasDiary ? 15 : 0; // up to 15%
    const dayScorePercent = Math.round(prayerWeight + tasksWeight + diaryWeight);

    return {
      fardCompleted,
      sunnahCompleted,
      azkarCompleted,
      tasksTotal,
      tasksCompleted,
      hasDiary,
      dayScorePercent: Math.min(100, Math.max(0, dayScorePercent)),
    };
  }, [currentDay]);

  const value = {
    selectedDate,
    setSelectedDate,
    activeTab,
    setActiveTab,
    currentDay,
    allRecords,
    userSettings,
    updateUserSettings,
    togglePrayer,
    toggleExtraPrayer,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    saveDiary,
    deleteDiary,
    updateReflection,
    stats,
    refreshData,
  };

  return <NotebookContext.Provider value={value}>{children}</NotebookContext.Provider>;
};

export function useNotebook(): NotebookContextType {
  const context = useContext(NotebookContext);
  if (!context) {
    throw new Error('useNotebook must be used within a NotebookProvider');
  }
  return context;
}
