/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PrayerKey = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface PrayerStatus {
  fard: boolean;
  sunnah: boolean;
  azkar: boolean;
}

export interface ExtraPrayers {
  duha: boolean;
  qiyam: boolean;
  witr: boolean;
}

export interface DayPrayers {
  fajr: PrayerStatus;
  dhuhr: PrayerStatus;
  asr: PrayerStatus;
  maghrib: PrayerStatus;
  isha: PrayerStatus;
  extras: ExtraPrayers;
}

export type TaskCategory = 'موعد' | 'عمل' | 'شخصي' | 'دراسة' | 'صحة' | 'عبادة';
export type TaskPriority = 'منخفضة' | 'متوسطة' | 'عالية';

export interface DailyTask {
  id: string;
  title: string;
  time?: string; // e.g. "10:30"
  category: TaskCategory;
  priority: TaskPriority;
  completed: boolean;
  notes?: string;
  createdAt: number;
}

export type MoodType = 'سعيد' | 'راضٍ' | 'ممتن' | 'منجز' | 'متأمل' | 'هادئ' | 'متعب' | 'قلق';

export interface DailyDiary {
  id: string;
  date: string; // "YYYY-MM-DD"
  title: string;
  content: string;
  mood?: MoodType;
  tags?: string[];
  weather?: string;
  updatedAt: number;
}

export interface DayRecord {
  date: string; // "YYYY-MM-DD"
  prayers: DayPrayers;
  tasks: DailyTask[];
  diary?: DailyDiary;
  reflection?: string;
}

export interface PrayerDefinition {
  key: PrayerKey;
  name: string;
  rakats: number;
  sunnahDetails: string;
  approxTime: string;
  period: 'morning' | 'noon' | 'afternoon' | 'sunset' | 'night';
}

export type ActiveTab = 'dashboard' | 'diary' | 'schedule' | 'prayers' | 'tasbih';

export type AppTheme = 'emerald' | 'amber' | 'slate' | 'sand';
