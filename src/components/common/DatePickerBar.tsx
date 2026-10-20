/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ChevronRight, ChevronLeft, Calendar as CalendarIcon, RotateCcw } from 'lucide-react';
import { useNotebook } from '../../context/NotebookContext';
import {
  addDays,
  formatArabicDate,
  formatHijriDate,
  formatDateKey,
  isToday,
} from '../../utils/dateUtils';

export const DatePickerBar: React.FC = () => {
  const { selectedDate, setSelectedDate } = useNotebook();

  const handlePrevDay = () => {
    // In RTL: "chevron right" goes forward or backward depending on convention.
    // In Arabic calendar: "اليوم السابق" (yesterday) is -1 day.
    setSelectedDate(addDays(selectedDate, -1));
  };

  const handleNextDay = () => {
    setSelectedDate(addDays(selectedDate, 1));
  };

  const handleTodayJump = () => {
    setSelectedDate(formatDateKey(new Date()));
  };

  const todaySelected = isToday(selectedDate);
  const hijriStr = formatHijriDate(selectedDate);
  const arabicDateStr = formatArabicDate(selectedDate);

  return (
    <div className="bg-white border-b border-neutral-200/80 px-4 py-3 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Navigation Buttons & Date Title */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            onClick={handlePrevDay}
            className="p-1.5 sm:p-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500"
            title="اليوم السابق"
            aria-label="اليوم السابق"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-neutral-900 text-base sm:text-lg">
                {arabicDateStr}
              </span>
              {todaySelected && (
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-md">
                  اليوم
                </span>
              )}
            </div>
            {hijriStr && (
              <span className="text-xs text-neutral-500 font-serif">
                {hijriStr}
              </span>
            )}
          </div>

          <button
            onClick={handleNextDay}
            className="p-1.5 sm:p-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500"
            title="اليوم التالي"
            aria-label="اليوم التالي"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Date Input & Today Reset Action */}
        <div className="flex items-center gap-2 mr-auto sm:mr-0">
          {!todaySelected && (
            <button
              onClick={handleTodayJump}
              className="flex items-center gap-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200/80 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>العودة لليوم</span>
            </button>
          )}

          <div className="relative flex items-center">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                if (e.target.value) {
                  setSelectedDate(e.target.value);
                }
              }}
              className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
              aria-label="اختر تاريخاً معيناً"
            />
            <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200/80 px-3 py-1.5 rounded-lg border border-neutral-200 transition-colors cursor-pointer">
              <CalendarIcon className="w-3.5 h-3.5 text-neutral-500" />
              <span>اختيار تاريخ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
