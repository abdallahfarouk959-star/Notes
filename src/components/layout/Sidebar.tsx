/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNotebook } from '../../context/NotebookContext';
import { ActiveTab } from '../../types/notebook';
import {
  LayoutDashboard,
  BookOpen,
  CheckSquare,
  Sparkles,
  HeartHandshake,
  Download,
  PlusCircle,
  Calendar,
} from 'lucide-react';
import { formatArabicShortDate, isToday } from '../../utils/dateUtils';

interface SidebarProps {
  onOpenQuickTask: () => void;
  onOpenBackupModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onOpenQuickTask,
  onOpenBackupModal,
}) => {
  const { activeTab, setActiveTab, selectedDate, stats, currentDay } = useNotebook();

  const remainingPrayersCount = 5 - stats.fardCompleted;
  const pendingTasksCount = currentDay.tasks.filter((t) => !t.completed).length;

  const navItems: {
    id: ActiveTab;
    label: string;
    icon: React.FC<{ className?: string }>;
    badge?: string | number;
    badgeColor?: string;
  }[] = [
    {
      id: 'dashboard',
      label: 'الرئيسية',
      icon: LayoutDashboard,
    },
    {
      id: 'diary',
      label: 'المذكرات',
      icon: BookOpen,
      badge: stats.hasDiary ? 'مكتوبة' : undefined,
      badgeColor: 'text-emerald-700 bg-emerald-50',
    },
    {
      id: 'schedule',
      label: 'المواعيد والمهام',
      icon: CheckSquare,
      badge: pendingTasksCount > 0 ? pendingTasksCount : undefined,
      badgeColor: 'text-neutral-700 bg-neutral-100',
    },
    {
      id: 'prayers',
      label: 'متتبع الصلوات',
      icon: Sparkles,
      badge: remainingPrayersCount > 0 ? `${remainingPrayersCount} متبقية` : 'تمت',
      badgeColor:
        remainingPrayersCount === 0
          ? 'text-emerald-700 bg-emerald-50'
          : 'text-neutral-600 bg-neutral-100',
    },
    {
      id: 'tasbih',
      label: 'السبحة والأذكار',
      icon: HeartHandshake,
    },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-white border-l border-neutral-200/90 shrink-0 min-h-[calc(100vh-4rem)] p-4 lg:p-6 justify-between select-none">
      <div className="space-y-6">
        {/* Navigation list */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200/60 shadow-2xs'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? 'text-emerald-700 stroke-[2.2]' : 'text-neutral-400 stroke-[1.8]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-[11px] font-normal px-2 py-0.5 rounded-md tabular-nums ${
                      item.badgeColor || 'text-neutral-600 bg-neutral-100'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Primary Action Button */}
        <button
          onClick={onOpenQuickTask}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>إضافة موعد أو مهمة</span>
        </button>

        {/* Selected Date Summary Box */}
        <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/70 text-xs space-y-2">
          <div className="flex items-center justify-between text-neutral-500 font-medium">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-neutral-400" />
              <span>اليوم المحدد:</span>
            </span>
            {isToday(selectedDate) && (
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-bold">
                اليوم
              </span>
            )}
          </div>
          <div className="font-bold text-neutral-900 text-xs">
            {formatArabicShortDate(selectedDate)}
          </div>
          <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${stats.dayScorePercent}%` }}
            />
          </div>
          <div className="text-[11px] text-neutral-500 flex justify-between">
            <span>نسبة إنجاز اليوم</span>
            <span className="font-bold tabular-nums text-neutral-800">{stats.dayScorePercent}%</span>
          </div>
        </div>
      </div>

      {/* Footer utilities */}
      <div className="pt-4 border-t border-neutral-200/80 space-y-2">
        <button
          onClick={onOpenBackupModal}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors border border-neutral-200"
        >
          <Download className="w-3.5 h-3.5 text-neutral-500" />
          <span>النسخ الاحتياطي والبيانات</span>
        </button>

        <div className="text-[11px] text-neutral-400 text-center pt-1 font-serif">
          مُفكرة يومية شخصية آمنة ومحلية
        </div>
      </div>
    </aside>
  );
};
