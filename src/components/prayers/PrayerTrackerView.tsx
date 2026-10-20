/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNotebook } from '../../context/NotebookContext';
import { PRAYER_DEFINITIONS, formatArabicDate } from '../../utils/dateUtils';
import { PrayerKey } from '../../types/notebook';
import {
  Sparkles,
  CheckCircle2,
  Circle,
  BookOpen,
  Info,
  Clock,
  Flame,
  Award,
  Moon,
  Sun,
} from 'lucide-react';
import { AzkarModal } from '../azkar/AzkarModal';

export const PrayerTrackerView: React.FC = () => {
  const {
    currentDay,
    selectedDate,
    togglePrayer,
    toggleExtraPrayer,
    stats,
  } = useNotebook();

  const [activeAzkarPrayer, setActiveAzkarPrayer] = useState<PrayerKey | null>(null);

  const prayers = currentDay.prayers;
  const extras = prayers.extras || { duha: false, qiyam: false, witr: false };

  // Calculate detailed completion percentages
  const fardRatio = (stats.fardCompleted / 5) * 100;
  const sunnahRatio = (stats.sunnahCompleted / 5) * 100;
  const azkarRatio = (stats.azkarCompleted / 5) * 100;

  return (
    <div className="space-y-6">
      {/* Header & Stats Banner */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-neutral-100">
          <div>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
              الصلوات الخمس والسنن
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mt-2 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-emerald-700" />
              <span>متتبع الصلوات والسنن الرواتب</span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              سجل صلواتك ليوم {formatArabicDate(selectedDate)}، واحرص على المحافظة على الفريضة وسننها وأذكارها.
            </p>
          </div>

          {/* Quick Hadith Callout */}
          <div className="bg-emerald-50/80 border border-emerald-200/70 p-3.5 rounded-xl max-w-sm text-xs text-emerald-950 font-serif leading-relaxed">
            <span className="font-bold font-sans text-emerald-900 block mb-0.5">فضل السنن الرواتب:</span>
            «مَنْ صَلَّى فِي يَوْمٍ وَلَيْلَةٍ ثِنْتَيْ عَشْرَةَ رَكْعَةً، بُنِيَ لَهُ بَيْتٌ فِي الْجَنَّةِ»
          </div>
        </div>

        {/* 3 Progress Bars: Fard, Sunnah, Azkar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5">
          {/* Fard */}
          <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/70">
            <div className="flex items-center justify-between text-xs font-bold text-neutral-800 mb-1.5">
              <span>الصلوات المفروضة</span>
              <span className="tabular-nums text-emerald-800">{stats.fardCompleted} / 5</span>
            </div>
            <div className="w-full h-2.5 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
                style={{ width: `${fardRatio}%` }}
              />
            </div>
          </div>

          {/* Sunnah */}
          <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/70">
            <div className="flex items-center justify-between text-xs font-bold text-neutral-800 mb-1.5">
              <span>السنن الرواتب</span>
              <span className="tabular-nums text-emerald-800">{stats.sunnahCompleted} / 5</span>
            </div>
            <div className="w-full h-2.5 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-600 transition-all duration-300 rounded-full"
                style={{ width: `${sunnahRatio}%` }}
              />
            </div>
          </div>

          {/* Azkar */}
          <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/70">
            <div className="flex items-center justify-between text-xs font-bold text-neutral-800 mb-1.5">
              <span>أذكار ما بعد الصلاة</span>
              <span className="tabular-nums text-emerald-800">{stats.azkarCompleted} / 5</span>
            </div>
            <div className="w-full h-2.5 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-600 transition-all duration-300 rounded-full"
                style={{ width: `${azkarRatio}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* The 5 Prayer Cards */}
      <div className="space-y-4">
        {PRAYER_DEFINITIONS.map((prayer) => {
          const status = prayers[prayer.key] || { fard: false, sunnah: false, azkar: false };
          const isFardDone = status.fard;
          const isSunnahDone = status.sunnah;
          const isAzkarDone = status.azkar;

          return (
            <div
              key={prayer.key}
              className={`bg-white rounded-2xl border transition-all p-5 sm:p-6 shadow-xs ${
                isFardDone
                  ? 'border-emerald-200/80 bg-white'
                  : 'border-neutral-200 hover:border-emerald-300'
              }`}
            >
              {/* Top row: Prayer Title, Rakats, Time */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-neutral-100">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                      isFardDone
                        ? 'bg-emerald-700 text-white shadow-2xs'
                        : 'bg-neutral-100 text-neutral-700'
                    }`}
                  >
                    {prayer.name.slice(0, 1)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                      <span>صلاة {prayer.name}</span>
                      <span className="text-xs font-normal text-neutral-500">
                        ({prayer.rakats} ركعات فرض)
                      </span>
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">{prayer.sunnahDetails}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono tabular-nums bg-neutral-50 px-3 py-1 rounded-lg self-start sm:self-auto border border-neutral-200/60">
                  <Clock className="w-3.5 h-3.5 text-neutral-400" />
                  <span>الوقت المقدر: {prayer.approxTime}</span>
                </div>
              </div>

              {/* 3 Interactive Checkboxes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
                {/* 1. FARD CHECKBOX */}
                <div
                  onClick={() => togglePrayer(prayer.key, 'fard')}
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all select-none ${
                    isFardDone
                      ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-medium'
                      : 'bg-neutral-50/60 border-neutral-200 hover:border-emerald-200 text-neutral-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="text-emerald-700">
                      {isFardDone ? (
                        <CheckCircle2 className="w-5 h-5 fill-emerald-600 text-white" />
                      ) : (
                        <Circle className="w-5 h-5 text-neutral-400" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-bold">الفرض</div>
                      <div className="text-[11px] text-neutral-500">الصلاة المفروضة</div>
                    </div>
                  </div>
                  <span className="text-xs font-serif text-neutral-400">
                    {prayer.rakats} ركعات
                  </span>
                </div>

                {/* 2. SUNNAH CHECKBOX */}
                <div
                  onClick={() => togglePrayer(prayer.key, 'sunnah')}
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all select-none ${
                    isSunnahDone
                      ? 'bg-teal-50/80 border-teal-300 text-teal-950 font-medium'
                      : 'bg-neutral-50/60 border-neutral-200 hover:border-teal-200 text-neutral-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="text-teal-700">
                      {isSunnahDone ? (
                        <CheckCircle2 className="w-5 h-5 fill-teal-600 text-white" />
                      ) : (
                        <Circle className="w-5 h-5 text-neutral-400" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-bold">السنن الرواتب</div>
                      <div className="text-[11px] text-neutral-500">نوافل الراتبة</div>
                    </div>
                  </div>
                  <span className="text-xs font-serif text-neutral-400">مؤكدة</span>
                </div>

                {/* 3. AZKAR CHECKBOX & DETAIL TRIGGER */}
                <div
                  className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                    isAzkarDone
                      ? 'bg-cyan-50/80 border-cyan-300 text-cyan-950 font-medium'
                      : 'bg-neutral-50/60 border-neutral-200 hover:border-cyan-200 text-neutral-800'
                  }`}
                >
                  <div
                    onClick={() => togglePrayer(prayer.key, 'azkar')}
                    className="flex items-center gap-2.5 cursor-pointer select-none flex-1"
                  >
                    <div className="text-cyan-700">
                      {isAzkarDone ? (
                        <CheckCircle2 className="w-5 h-5 fill-cyan-600 text-white" />
                      ) : (
                        <Circle className="w-5 h-5 text-neutral-400" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-bold">الأذكار</div>
                      <div className="text-[11px] text-neutral-500">أذكار بعد السلام</div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveAzkarPrayer(prayer.key);
                    }}
                    className="text-xs text-emerald-800 hover:text-emerald-900 bg-white hover:bg-emerald-50 px-2 py-1 rounded border border-neutral-200 transition-colors shadow-2xs"
                    title="فتح قائمة الأذكار مع العداد"
                  >
                    قراءة
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Extra Voluntary Prayers (نوافل اليوم الإضافية) */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 p-5 sm:p-6 shadow-xs">
        <h3 className="font-bold text-neutral-900 text-base mb-1 flex items-center gap-2">
          <Moon className="w-5 h-5 text-indigo-700" />
          <span>نوافل وعبادات اليوم المباركة</span>
        </h3>
        <p className="text-xs text-neutral-500 mb-4">
          أجور إضافية وبركة ليومك: صلاة الضحى، قيام الليل، والوتر.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Duha */}
          <div
            onClick={() => toggleExtraPrayer('duha')}
            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
              extras.duha
                ? 'bg-amber-50/80 border-amber-300 text-amber-950 font-medium'
                : 'bg-neutral-50/60 border-neutral-200 hover:border-amber-200 text-neutral-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sun className={`w-5 h-5 ${extras.duha ? 'text-amber-600' : 'text-neutral-400'}`} />
              <div>
                <h4 className="text-sm font-bold">صلاة الضحى</h4>
                <p className="text-[11px] text-neutral-500">صلاة الأوابين (ركعتان فأكثر)</p>
              </div>
            </div>
            {extras.duha ? (
              <CheckCircle2 className="w-5 h-5 text-amber-600" />
            ) : (
              <Circle className="w-5 h-5 text-neutral-400" />
            )}
          </div>

          {/* Qiyam */}
          <div
            onClick={() => toggleExtraPrayer('qiyam')}
            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
              extras.qiyam
                ? 'bg-indigo-50/80 border-indigo-300 text-indigo-950 font-medium'
                : 'bg-neutral-50/60 border-neutral-200 hover:border-indigo-200 text-neutral-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Moon className={`w-5 h-5 ${extras.qiyam ? 'text-indigo-600' : 'text-neutral-400'}`} />
              <div>
                <h4 className="text-sm font-bold">قيام الليل / التهجد</h4>
                <p className="text-[11px] text-neutral-500">شرف المؤمن ونور الوجه</p>
              </div>
            </div>
            {extras.qiyam ? (
              <CheckCircle2 className="w-5 h-5 text-indigo-600" />
            ) : (
              <Circle className="w-5 h-5 text-neutral-400" />
            )}
          </div>

          {/* Witr */}
          <div
            onClick={() => toggleExtraPrayer('witr')}
            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
              extras.witr
                ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-medium'
                : 'bg-neutral-50/60 border-neutral-200 hover:border-emerald-200 text-neutral-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className={`w-5 h-5 ${extras.witr ? 'text-emerald-600' : 'text-neutral-400'}`} />
              <div>
                <h4 className="text-sm font-bold">الشفع والوتر</h4>
                <p className="text-[11px] text-neutral-500">ختام صلاة الليل</p>
              </div>
            </div>
            {extras.witr ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <Circle className="w-5 h-5 text-neutral-400" />
            )}
          </div>
        </div>
      </div>

      {/* Azkar Modal */}
      <AzkarModal
        isOpen={activeAzkarPrayer !== null}
        onClose={() => setActiveAzkarPrayer(null)}
        prayerKey={activeAzkarPrayer || undefined}
        onCompleteAzkar={() => {
          if (activeAzkarPrayer) {
            togglePrayer(activeAzkarPrayer, 'azkar');
          }
        }}
      />
    </div>
  );
};
