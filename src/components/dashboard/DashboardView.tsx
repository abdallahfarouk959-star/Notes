/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNotebook } from '../../context/NotebookContext';
import { PRAYER_DEFINITIONS, DAILY_REFLECTIONS, formatTime12HourArabic, isToday } from '../../utils/dateUtils';
import { PrayerKey } from '../../types/notebook';
import {
  Sparkles,
  CheckCircle2,
  Circle,
  Clock,
  BookOpen,
  Plus,
  ArrowLeft,
  Calendar,
  CheckSquare,
  Flame,
  PenTool,
} from 'lucide-react';

interface DashboardViewProps {
  onOpenTaskModal: () => void;
  onOpenAzkarModal: (prayerKey: PrayerKey) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenTaskModal,
  onOpenAzkarModal,
}) => {
  const {
    currentDay,
    selectedDate,
    stats,
    togglePrayer,
    toggleTask,
    setActiveTab,
  } = useNotebook();

  // Find remaining prayers for the selected day
  const prayers = currentDay.prayers;
  const remainingPrayers = PRAYER_DEFINITIONS.filter(
    (p) => !prayers[p.key]?.fard
  );

  // Next scheduled appointment or upcoming task
  const pendingTasks = currentDay.tasks.filter((t) => !t.completed);
  // Sort tasks with time first, then by priority
  const sortedPendingTasks = [...pendingTasks].sort((a, b) => {
    if (a.time && b.time) return a.time.localeCompare(b.time);
    if (a.time) return -1;
    if (b.time) return 1;
    return 0;
  });
  const nextItem = sortedPendingTasks[0];

  // Daily reflection quote based on date hash
  const quoteIndex = Math.abs(
    selectedDate.split('-').reduce((acc, part) => acc + parseInt(part, 10), 0)
  ) % DAILY_REFLECTIONS.length;
  const todayReflection = DAILY_REFLECTIONS[quoteIndex];

  return (
    <div className="space-y-6">
      {/* Daily Welcome & Progress Overview */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-neutral-100">
          <div>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
              {isToday(selectedDate) ? 'ملخص اليوم' : 'ملخص تاريخ محدد'}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mt-2">
              {isToday(selectedDate) ? 'أهلاً بك، نسأل الله لك يوماً مباركاً' : 'سجل اليوميات والمهام'}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              تابع صلواتك المفروضة والسنن، أدر مواعيدك بدقة، ودوّن خواطرك اليومية.
            </p>
          </div>

          {/* Quick day completion score */}
          <div className="flex items-center gap-4 bg-neutral-50 border border-neutral-200/70 p-3.5 rounded-xl self-start md:self-auto">
            <div className="w-12 h-12 rounded-full border-4 border-emerald-600/30 border-t-emerald-600 flex items-center justify-center font-bold text-sm text-emerald-800 tabular-nums">
              {stats.dayScorePercent}%
            </div>
            <div className="text-xs">
              <div className="font-bold text-neutral-900">إنجاز اليوم</div>
              <div className="text-neutral-500 text-[11px] mt-0.5">
                {stats.fardCompleted}/5 صلوات · {stats.tasksCompleted}/{stats.tasksTotal} مهام
              </div>
            </div>
          </div>
        </div>

        {/* 3 Metric Summary Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5">
          {/* Prayers Stat */}
          <div
            onClick={() => setActiveTab('prayers')}
            className="p-3.5 rounded-xl bg-neutral-50 hover:bg-emerald-50/50 border border-neutral-200/70 hover:border-emerald-200 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-neutral-500 text-xs mb-1">
              <span>الصلوات المكتملة</span>
              <Sparkles className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xl font-bold text-neutral-900 tabular-nums">
              {stats.fardCompleted} <span className="text-xs text-neutral-400 font-normal">من 5 فروض</span>
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">
              {stats.sunnahCompleted} سنن رواتب · {stats.azkarCompleted} أذكار
            </div>
          </div>

          {/* Tasks Stat */}
          <div
            onClick={() => setActiveTab('schedule')}
            className="p-3.5 rounded-xl bg-neutral-50 hover:bg-emerald-50/50 border border-neutral-200/70 hover:border-emerald-200 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-neutral-500 text-xs mb-1">
              <span>المواعيد والمهام</span>
              <CheckSquare className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xl font-bold text-neutral-900 tabular-nums">
              {stats.tasksCompleted} <span className="text-xs text-neutral-400 font-normal">من أصل {stats.tasksTotal}</span>
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">
              {pendingTasks.length > 0 ? `${pendingTasks.length} بانتظار الإنجاز` : 'أنجزت جميع مهام هذا اليوم!'}
            </div>
          </div>

          {/* Diary Stat */}
          <div
            onClick={() => setActiveTab('diary')}
            className="p-3.5 rounded-xl bg-neutral-50 hover:bg-emerald-50/50 border border-neutral-200/70 hover:border-emerald-200 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-neutral-500 text-xs mb-1">
              <span>مذكرات اليوم</span>
              <BookOpen className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xl font-bold text-neutral-900">
              {stats.hasDiary ? 'تم التدوين' : 'لم تُكتب بعد'}
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">
              {stats.hasDiary && currentDay.diary?.mood ? `الحالة: ${currentDay.diary.mood}` : 'سجّل خواطرك وتأملاتك'}
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Grid: Prayers & Next Appointment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Remaining / Prayers for the day */}
        <div className="bg-white rounded-2xl border border-neutral-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-neutral-900 text-base">صلوات اليوم</h3>
              </div>
              <button
                onClick={() => setActiveTab('prayers')}
                className="text-xs font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <span>عرض الكل والتفاصيل</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            {remainingPrayers.length === 0 ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200/70 text-center my-3">
                <p className="text-sm font-semibold text-emerald-900">
                  تقبل الله طاعاتكم! أتممت صلوات الفروض الخمس لهذا اليوم.
                </p>
                <p className="text-xs text-emerald-700 mt-1">
                  يمكنك استكمال السنن الرواتب وأذكار ما بعد الصلاة من صفحة الصلوات.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 my-2">
                {PRAYER_DEFINITIONS.map((def) => {
                  const status = prayers[def.key] || { fard: false, sunnah: false, azkar: false };
                  const isFardDone = status.fard;

                  return (
                    <div
                      key={def.key}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                        isFardDone
                          ? 'bg-neutral-50/80 border-neutral-200 text-neutral-500'
                          : 'bg-white border-neutral-200 hover:border-emerald-300 text-neutral-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => togglePrayer(def.key, 'fard')}
                          className="text-neutral-400 hover:text-emerald-600 transition-colors"
                          title={isFardDone ? 'إلغاء التأكيد' : 'تأكيد أداء الفرض'}
                        >
                          {isFardDone ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <Circle className="w-5 h-5" />
                          )}
                        </button>

                        <div>
                          <span className={`text-sm font-bold ${isFardDone ? 'line-through text-neutral-400' : ''}`}>
                            صلاة {def.name}
                          </span>
                          <span className="text-xs text-neutral-400 mr-2 tabular-nums">
                            ({def.approxTime})
                          </span>
                        </div>
                      </div>

                      {/* Quick Sunnah & Azkar Badges */}
                      <div className="flex items-center gap-1.5 text-xs">
                        <button
                          onClick={() => togglePrayer(def.key, 'sunnah')}
                          className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                            status.sunnah
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                          }`}
                          title="السنة الراتبة"
                        >
                          سنة
                        </button>
                        <button
                          onClick={() => onOpenAzkarModal(def.key)}
                          className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                            status.azkar
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                          }`}
                          title="أذكار ما بعد الصلاة"
                        >
                          أذكار
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-neutral-100 text-xs text-neutral-500 flex items-center justify-between">
            <span>الصلوات المتبقية: {remainingPrayers.length}</span>
            <span>السنن المنجزة: {stats.sunnahCompleted}/5</span>
          </div>
        </div>

        {/* Next Scheduled Appointment & Tasks Snippet */}
        <div className="bg-white rounded-2xl border border-neutral-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-neutral-900 text-base">الموعد القادم والمهام</h3>
              </div>
              <button
                onClick={onOpenTaskModal}
                className="text-xs font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة</span>
              </button>
            </div>

            {/* Next primary appointment highlight */}
            {nextItem ? (
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 mb-4">
                <div className="flex items-center justify-between text-xs text-neutral-500 mb-1.5">
                  <span className="font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    {nextItem.category}
                  </span>
                  {nextItem.time && (
                    <span className="flex items-center gap-1 font-mono tabular-nums">
                      <Clock className="w-3 h-3 text-neutral-400" />
                      {formatTime12HourArabic(nextItem.time)}
                    </span>
                  )}
                </div>
                <h4 className="text-base font-bold text-neutral-900 mt-1">{nextItem.title}</h4>
                {nextItem.notes && (
                  <p className="text-xs text-neutral-600 mt-1 line-clamp-2">{nextItem.notes}</p>
                )}
                <div className="mt-3 flex items-center justify-end">
                  <button
                    onClick={() => toggleTask(nextItem.id)}
                    className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 hover:text-emerald-800"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>تعليم كمكتمل</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-xl bg-neutral-50 border border-neutral-200/70 text-center my-3">
                <CheckSquare className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-neutral-700">لا توجد مواعيد أو مهام معلقة</p>
                <p className="text-xs text-neutral-400 mt-0.5">أضف مواعيدك لترتيب جدولك الزمني بدقة</p>
              </div>
            )}

            {/* Remaining quick list */}
            {pendingTasks.length > 1 && (
              <div className="space-y-2">
                <div className="text-xs font-semibold text-neutral-500">مهام أخرى اليوم:</div>
                {pendingTasks.slice(1, 4).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-50/60 border border-neutral-200/60 text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="text-neutral-400 hover:text-emerald-600"
                      >
                        <Circle className="w-4 h-4" />
                      </button>
                      <span className="font-medium text-neutral-800 truncate">{task.title}</span>
                    </div>
                    {task.time && (
                      <span className="text-[11px] text-neutral-500 shrink-0 tabular-nums">
                        {formatTime12HourArabic(task.time)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
            <span className="text-xs text-neutral-500">
              إجمالي مهام اليوم: {currentDay.tasks.length}
            </span>
            <button
              onClick={() => setActiveTab('schedule')}
              className="text-xs font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>عرض الجدول الزمني</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Diary Quick Snippet Card */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-neutral-900 text-base">مذكرة اليوم</h3>
          </div>
          <button
            onClick={() => setActiveTab('diary')}
            className="text-xs font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            {stats.hasDiary ? (
              <>
                <span>تعديل المذكرة</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <PenTool className="w-3.5 h-3.5" />
                <span>كتابة تدوينة</span>
              </>
            )}
          </button>
        </div>

        {currentDay.diary && currentDay.diary.content.trim() ? (
          <div className="p-4 rounded-xl bg-neutral-50/70 border border-neutral-200/80">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-neutral-900 text-sm">{currentDay.diary.title}</h4>
              {currentDay.diary.mood && (
                <span className="text-xs text-neutral-600 bg-white px-2 py-0.5 rounded border border-neutral-200">
                  المزاج: {currentDay.diary.mood}
                </span>
              )}
            </div>
            <p className="text-neutral-700 text-xs sm:text-sm font-serif line-clamp-3 leading-relaxed">
              {currentDay.diary.content}
            </p>
            {currentDay.diary.tags && currentDay.diary.tags.length > 0 && (
              <div className="flex items-center gap-2 text-xs text-neutral-500 mt-3 pt-2 border-t border-neutral-200/50">
                {currentDay.diary.tags.map((tag, idx) => (
                  <span key={idx}>#{tag}</span>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 rounded-xl border border-dashed border-neutral-300 text-center bg-neutral-50/40">
            <PenTool className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-neutral-700">لم تكتب مذكرتك لهذا اليوم بعد</p>
            <p className="text-xs text-neutral-500 mt-1 max-w-md mx-auto">
              التدوين اليومي يفرغ الذهن ويوثق لحظات الامتنان وأهم ما مر بك من أحداث وفوائد.
            </p>
            <button
              onClick={() => setActiveTab('diary')}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors"
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>ابدأ التدوين الآن</span>
            </button>
          </div>
        )}
      </div>

      {/* Daily Ayah / Inspirational Quote */}
      <div className="p-5 rounded-2xl bg-emerald-900 text-white border border-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>تأمل اليوم</span>
          </div>
          <p className="font-serif text-lg sm:text-xl text-emerald-50 leading-relaxed">
            "{todayReflection.text}"
          </p>
          <p className="text-xs text-emerald-300 font-sans mt-0.5">— {todayReflection.source}</p>
        </div>
        <button
          onClick={() => setActiveTab('tasbih')}
          className="self-start sm:self-center px-4 py-2 text-xs font-medium text-emerald-900 bg-emerald-100 hover:bg-white rounded-lg transition-colors whitespace-nowrap shrink-0"
        >
          فتح السبحة والأذكار
        </button>
      </div>
    </div>
  );
};
