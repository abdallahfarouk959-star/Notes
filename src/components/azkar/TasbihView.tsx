/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { POPULAR_TASBIH_PHRASES, POST_PRAYER_AZKAR } from '../../utils/azkarData';
import { HeartHandshake, RotateCcw, Volume2, Sparkles, BookOpen, Check } from 'lucide-react';

const STORAGE_KEY_TOTAL_DHIKR = 'notebook_total_dhikr_count';

export const TasbihView: React.FC = () => {
  const [selectedPhrase, setSelectedPhrase] = useState(POPULAR_TASBIH_PHRASES[0]);
  const [currentCount, setCurrentCount] = useState<number>(0);
  const [targetCycles, setTargetCycles] = useState<number>(0);
  const [totalDhikr, setTotalDhikr] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem(STORAGE_KEY_TOTAL_DHIKR) || '0', 10);
    } catch {
      return 0;
    }
  });
  const [activeTab, setActiveTab] = useState<'tasbih' | 'postPrayer'>('tasbih');

  const handleIncrement = () => {
    const nextCount = currentCount + 1;
    if (nextCount >= selectedPhrase.target) {
      setCurrentCount(0);
      setTargetCycles((c) => c + 1);
    } else {
      setCurrentCount(nextCount);
    }

    const nextTotal = totalDhikr + 1;
    setTotalDhikr(nextTotal);
    try {
      localStorage.setItem(STORAGE_KEY_TOTAL_DHIKR, String(nextTotal));
    } catch {
      // ignore
    }
  };

  const handleReset = () => {
    setCurrentCount(0);
    setTargetCycles(0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-emerald-700" />
            <span>السبحة الإلكترونية والأذكار</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            رطب لسانك بذكر الله واستحضر أجر التسبيح والتحميد والاستغفار.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('tasbih')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'tasbih'
                ? 'bg-white text-neutral-900 shadow-2xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            السبحة الرقمية
          </button>
          <button
            onClick={() => setActiveTab('postPrayer')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'postPrayer'
                ? 'bg-white text-neutral-900 shadow-2xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            أذكار ما بعد الصلاة
          </button>
        </div>
      </div>

      {activeTab === 'tasbih' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Tasbih Circle (2 cols) */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-200/90 p-6 sm:p-8 flex flex-col items-center justify-center text-center shadow-xs">
            {/* Dhikr Phrase Display */}
            <div className="mb-6 max-w-md">
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
                الهدف: {selectedPhrase.target} مرة
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-neutral-900 mt-3 leading-relaxed">
                {selectedPhrase.title}
              </h3>
            </div>

            {/* Clickable Big Bead / Button */}
            <button
              onClick={handleIncrement}
              className="relative w-52 h-52 sm:w-64 sm:h-64 rounded-full bg-gradient-to-br from-emerald-700 to-emerald-900 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg active:scale-95 transition-all flex flex-col items-center justify-center p-6 border-4 border-emerald-600/30 group focus:outline-none"
            >
              <span className="text-5xl sm:text-6xl font-bold font-mono tracking-tight tabular-nums group-hover:scale-105 transition-transform">
                {currentCount}
              </span>
              <span className="text-xs text-emerald-200 mt-2 font-medium">
                انقر للتسبيح
              </span>

              {/* Progress ring hint */}
              <div className="absolute inset-0 rounded-full border-2 border-white/20 pointer-events-none" />
            </button>

            {/* Stats row & Reset button */}
            <div className="flex items-center justify-between w-full max-w-sm mt-8 pt-4 border-t border-neutral-100 text-xs text-neutral-600">
              <div>
                <span className="text-neutral-400 block text-[11px]">الدورات المكتملة</span>
                <span className="text-sm font-bold text-neutral-900 tabular-nums">{targetCycles}</span>
              </div>

              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-xs text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-lg transition-colors"
                title="إعادة ضبط العداد"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>تصفير</span>
              </button>

              <div className="text-left">
                <span className="text-neutral-400 block text-[11px]">مجموع التسبيحات</span>
                <span className="text-sm font-bold text-emerald-800 tabular-nums">{totalDhikr}</span>
              </div>
            </div>
          </div>

          {/* Quick Dhikr List (1 col) */}
          <div className="bg-white rounded-2xl border border-neutral-200/90 p-5 shadow-xs space-y-3">
            <h4 className="font-bold text-neutral-900 text-sm pb-2 border-b border-neutral-100">
              اختر صيغة الذكر:
            </h4>

            <div className="space-y-2">
              {POPULAR_TASBIH_PHRASES.map((phrase) => {
                const isSelected = selectedPhrase.id === phrase.id;
                return (
                  <div
                    key={phrase.id}
                    onClick={() => {
                      setSelectedPhrase(phrase);
                      setCurrentCount(0);
                    }}
                    className={`p-3 rounded-xl border text-right cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 shadow-2xs font-bold text-emerald-950'
                        : 'border-neutral-200 hover:border-emerald-200 bg-neutral-50/40 text-neutral-800'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-serif text-sm">{phrase.title}</span>
                      <span className="text-[11px] text-neutral-500 tabular-nums">
                        {phrase.target}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-neutral-100 text-xs text-neutral-500">
              💡 نصيحة: استشعر معاني التسبيح والثناء أثناء الذكر ليكون أثره أعظم في النفس وسكينة القلب.
            </div>
          </div>
        </div>
      ) : (
        /* Post-prayer Supplications catalog */
        <div className="bg-white rounded-2xl border border-neutral-200/90 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-neutral-900 text-base mb-1">
            الأذكار المأثورة عقب الصلوات الخمس المفروضة
          </h3>
          <p className="text-xs text-neutral-500">
            أذكار صحيحة عن النبي ﷺ يُستحب للمسلم قولها بعد التسليم من كل صلاة فريضة.
          </p>

          <div className="space-y-3 pt-2">
            {POST_PRAYER_AZKAR.map((item, index) => (
              <div key={item.id} className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/40">
                <div className="flex items-center justify-between text-xs text-neutral-500 mb-1.5">
                  <span className="font-bold text-neutral-900">{index + 1}.</span>
                  <div className="flex items-center gap-2">
                    {item.virtue && <span className="font-serif">{item.virtue}</span>}
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono font-medium">
                      {item.count} {item.count > 1 ? 'مرات' : 'مرة'}
                    </span>
                  </div>
                </div>
                <p className="font-serif text-base sm:text-lg text-neutral-900 leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
