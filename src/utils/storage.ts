/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DayRecord, DailyTask, DailyDiary, PrayerKey, PrayerStatus } from '../types/notebook';
import { formatDateKey } from './dateUtils';

const STORAGE_KEY_RECORDS = 'notebook_daily_records_v1';
const STORAGE_KEY_SETTINGS = 'notebook_settings_v1';

export interface UserSettings {
  city: string;
  theme: 'emerald' | 'amber' | 'slate' | 'sand';
  showExtras: boolean;
}

const DEFAULT_SETTINGS: UserSettings = {
  city: 'مكة المكرمة',
  theme: 'emerald',
  showExtras: true,
};

export function createEmptyDayRecord(date: string): DayRecord {
  return {
    date,
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
  };
}

/**
 * Generate initial demonstration data for the first time user opens the app
 */
function getInitialSeedData(): Record<string, DayRecord> {
  const todayKey = formatDateKey(new Date());

  const sampleTasks: DailyTask[] = [
    {
      id: 'task-1',
      title: 'مراجعة أهداف الأسبوع وإنجاز ورد القرآن',
      time: '07:30',
      category: 'عبادة',
      priority: 'عالية',
      completed: true,
      notes: 'قراءة سورة الكهف / جزء اليوم بتدبر',
      createdAt: Date.now() - 3600000 * 3,
    },
    {
      id: 'task-2',
      title: 'اجتماع فريق العمل لمناقشة خطة المشروع',
      time: '10:00',
      category: 'موعد',
      priority: 'عالية',
      completed: true,
      notes: 'تحضير العرض التقديمي والنقاط الجوهرية',
      createdAt: Date.now() - 3600000 * 2,
    },
    {
      id: 'task-3',
      title: 'شراء مستلزمات المنزل والمكتبة',
      time: '16:30',
      category: 'شخصي',
      priority: 'متوسطة',
      completed: false,
      notes: 'دفاتر ملاحظات جديدة، وأقلام حبر زرقاء',
      createdAt: Date.now() - 3600000,
    },
    {
      id: 'task-4',
      title: 'رياضة المشي السريع لمدة ٣٠ دقيقة',
      time: '18:15',
      category: 'صحة',
      priority: 'متوسطة',
      completed: false,
      notes: 'في الحديقة القريبة بعد صلاة المغرب',
      createdAt: Date.now() - 1800000,
    },
    {
      id: 'task-5',
      title: 'قراءة ٢٠ صفحة من كتاب في التاريخ الإسلامي',
      time: '20:30',
      category: 'دراسة',
      priority: 'منخفضة',
      completed: false,
      notes: 'تلخيص أهم الفوائد في قسم المذكرات',
      createdAt: Date.now() - 900000,
    },
  ];

  const sampleDiary: DailyDiary = {
    id: 'diary-' + todayKey,
    date: todayKey,
    title: 'إشراقة يوم جديد بنوايا متجددة',
    content: `الحمد لله الذي أحيانا بعد ما أماتنا وإليه النشور. بدأت هذا اليوم بسكينة وهدوء مع صلاة الفجر والورد القرآني في وقته. أشعر بحماس متجدد لإتمام أهدافي الأسبوعية والتفرغ للأولويات الحقيقية.

تذكرت اليوم حكمة بليغة: "قليل دائم خير من كثير منقطع". النية اليوم أن أركز في كل عمل أقوم به، وأبتعد عن التشتت والمشتتات الرقمية، وأن أختم اليوم بقلب راضٍ وعقل مطمئن.`,
    mood: 'ممتن',
    tags: ['امتنان', 'تخطيط', 'سكينة'],
    weather: 'معتدل ولطيف',
    updatedAt: Date.now() - 7200000,
  };

  const initialRecord: DayRecord = {
    date: todayKey,
    prayers: {
      fajr: { fard: true, sunnah: true, azkar: true },
      dhuhr: { fard: true, sunnah: true, azkar: false },
      asr: { fard: false, sunnah: false, azkar: false },
      maghrib: { fard: false, sunnah: false, azkar: false },
      isha: { fard: false, sunnah: false, azkar: false },
      extras: { duha: true, qiyam: false, witr: false },
    },
    tasks: sampleTasks,
    diary: sampleDiary,
    reflection: 'كل خطوة صغيرة تخطوها اليوم تقربك من غايتك الكبرى.',
  };

  return {
    [todayKey]: initialRecord,
  };
}

/**
 * Load all stored records from LocalStorage
 */
export function loadAllRecords(): Record<string, DayRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RECORDS);
    if (!raw) {
      const seeded = getInitialSeedData();
      saveAllRecords(seeded);
      return seeded;
    }
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (err) {
    console.error('Failed to load records from LocalStorage', err);
    return {};
  }
}

/**
 * Save all records to LocalStorage
 */
export function saveAllRecords(records: Record<string, DayRecord>): void {
  try {
    localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(records));
  } catch (err) {
    console.error('Failed to save records to LocalStorage', err);
  }
}

/**
 * Load or initialize a specific day's record
 */
export function getDayRecord(dateKey: string): DayRecord {
  const all = loadAllRecords();
  if (all[dateKey]) {
    // Ensure all nested fields exist in case of migration
    const rec = all[dateKey];
    return {
      date: dateKey,
      prayers: {
        fajr: {
          fard: rec.prayers?.fajr?.fard ?? false,
          sunnah: rec.prayers?.fajr?.sunnah ?? false,
          azkar: rec.prayers?.fajr?.azkar ?? false,
        },
        dhuhr: {
          fard: rec.prayers?.dhuhr?.fard ?? false,
          sunnah: rec.prayers?.dhuhr?.sunnah ?? false,
          azkar: rec.prayers?.dhuhr?.azkar ?? false,
        },
        asr: {
          fard: rec.prayers?.asr?.fard ?? false,
          sunnah: rec.prayers?.asr?.sunnah ?? false,
          azkar: rec.prayers?.asr?.azkar ?? false,
        },
        maghrib: {
          fard: rec.prayers?.maghrib?.fard ?? false,
          sunnah: rec.prayers?.maghrib?.sunnah ?? false,
          azkar: rec.prayers?.maghrib?.azkar ?? false,
        },
        isha: {
          fard: rec.prayers?.isha?.fard ?? false,
          sunnah: rec.prayers?.isha?.sunnah ?? false,
          azkar: rec.prayers?.isha?.azkar ?? false,
        },
        extras: {
          duha: rec.prayers?.extras?.duha ?? false,
          qiyam: rec.prayers?.extras?.qiyam ?? false,
          witr: rec.prayers?.extras?.witr ?? false,
        },
      },
      tasks: Array.isArray(rec.tasks) ? rec.tasks : [],
      diary: rec.diary,
      reflection: rec.reflection || '',
    };
  }
  const empty = createEmptyDayRecord(dateKey);
  all[dateKey] = empty;
  saveAllRecords(all);
  return empty;
}

/**
 * Update a specific day's record in LocalStorage
 */
export function updateDayRecord(dateKey: string, updater: (prev: DayRecord) => DayRecord): DayRecord {
  const all = loadAllRecords();
  const current = getDayRecord(dateKey);
  const updated = updater(current);
  all[dateKey] = updated;
  saveAllRecords(all);
  return updated;
}

/**
 * Load user settings
 */
export function loadUserSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/**
 * Save user settings
 */
export function saveUserSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings', err);
  }
}

/**
 * Export data to JSON file
 */
export function exportDataAsJSON(): void {
  const records = loadAllRecords();
  const settings = loadUserSettings();
  const exportPayload = {
    exportedAt: new Date().toISOString(),
    version: 1,
    settings,
    records,
  };
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `mudakirati_backup_${formatDateKey(new Date())}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Import data from JSON string
 */
export function importDataFromJSON(jsonString: string): boolean {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed && typeof parsed.records === 'object') {
      saveAllRecords(parsed.records);
      if (parsed.settings) {
        saveUserSettings(parsed.settings);
      }
      return true;
    }
    return false;
  } catch (err) {
    console.error('Import failed', err);
    return false;
  }
}
