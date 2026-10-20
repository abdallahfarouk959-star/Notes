/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PrayerDefinition } from '../types/notebook';

/**
 * Format a Date object to YYYY-MM-DD
 */
export function formatDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse a YYYY-MM-DD string to a Date object at local midnight
 */
export function parseDateKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

/**
 * Offset date key by N days (+1 for tomorrow, -1 for yesterday)
 */
export function addDays(dateKey: string, days: number): string {
  const d = parseDateKey(dateKey);
  d.setDate(d.getDate() + days);
  return formatDateKey(d);
}

/**
 * Check if a date string is today
 */
export function isToday(dateKey: string): boolean {
  return dateKey === formatDateKey(new Date());
}

/**
 * Format date in full Arabic (e.g. "الثلاثاء، 20 أكتوبر 2026")
 */
export function formatArabicDate(dateKey: string): string {
  try {
    const d = parseDateKey(dateKey);
    return new Intl.DateTimeFormat('ar-EG', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateKey;
  }
}

/**
 * Format day of week and short date (e.g. "الثلاثاء، 20 أكتوبر")
 */
export function formatArabicShortDate(dateKey: string): string {
  try {
    const d = parseDateKey(dateKey);
    return new Intl.DateTimeFormat('ar-EG', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
    }).format(d);
  } catch {
    return dateKey;
  }
}

/**
 * Calculate Hijri Date using Umm Al-Qura internationalization
 */
export function formatHijriDate(dateKey: string): string {
  try {
    const d = parseDateKey(dateKey);
    const formatter = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    return formatter.format(d) + ' هـ';
  } catch {
    return '';
  }
}

/**
 * Format 24hr time (e.g. "14:30") to 12hr Arabic format (e.g. "02:30 م")
 */
export function formatTime12HourArabic(timeStr?: string): string {
  if (!timeStr) return '';
  const [hStr, mStr] = timeStr.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr || '00';
  if (isNaN(h)) return timeStr;

  const period = h >= 12 ? 'م' : 'ص';
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;

  const paddedH = String(h).padStart(2, '0');
  return `${paddedH}:${m} ${period}`;
}

export const PRAYER_DEFINITIONS: PrayerDefinition[] = [
  {
    key: 'fajr',
    name: 'الفجر',
    rakats: 2,
    sunnahDetails: 'ركعتان قبل الفجر (سنة مؤكدة رغيبة)',
    approxTime: '04:50',
    period: 'morning',
  },
  {
    key: 'dhuhr',
    name: 'الظهر',
    rakats: 4,
    sunnahDetails: '٤ ركعات قبلية (بتسليمتين) وركعتان بعدية',
    approxTime: '12:05',
    period: 'noon',
  },
  {
    key: 'asr',
    name: 'العصر',
    rakats: 4,
    sunnahDetails: '٤ ركعات قبلية مستحبة',
    approxTime: '15:25',
    period: 'afternoon',
  },
  {
    key: 'maghrib',
    name: 'المغرب',
    rakats: 3,
    sunnahDetails: 'ركعتان بعد المغرب (سنة مؤكدة)',
    approxTime: '17:50',
    period: 'sunset',
  },
  {
    key: 'isha',
    name: 'العشاء',
    rakats: 4,
    sunnahDetails: 'ركعتان بعد العشاء (مؤكدة) + الوتر',
    approxTime: '19:15',
    period: 'night',
  },
];

/**
 * Quotes, Ayahs, and Hadiths for daily inspiration in Arabic
 */
export const DAILY_REFLECTIONS = [
  {
    text: 'وَتَوَكَّلْ عَلَى الْعَزِيزِ الرَّحِيمِ الَّذِي يَرَاكَ حِينَ تَقُومُ',
    source: 'سورة الشعراء',
  },
  {
    text: 'احرص على ما ينفعك، واستعن بالله ولا تعجز',
    source: 'صحيح مسلم',
  },
  {
    text: 'وَفِي السَّمَاءِ رِزْقُكُمْ وَمَا تُوعَدُونَ',
    source: 'سورة الذاريات',
  },
  {
    text: 'أحب الأعمال إلى الله أدومها وإن قل',
    source: 'متفق عليه',
  },
  {
    text: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ',
    source: 'سورة الطلاق',
  },
  {
    text: 'اليوم صفحة جديدة في كتاب عمرك، فاكتب فيها ما يسرك أن تراه غداً.',
    source: 'حكمة اليوم',
  },
  {
    text: 'لا تحقرن من المعروف شيئاً ولو أن تلقى أخاك بوجه طلق',
    source: 'صحيح مسلم',
  },
  {
    text: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    source: 'سورة الشرح',
  },
];
