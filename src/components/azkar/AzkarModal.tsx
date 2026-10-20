/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Check, RotateCcw, Sparkles } from 'lucide-react';
import { POST_PRAYER_AZKAR } from '../../utils/azkarData';
import { PrayerKey } from '../../types/notebook';
import { PRAYER_DEFINITIONS } from '../../utils/dateUtils';

interface AzkarModalProps {
  isOpen: boolean;
  onClose: () => void;
  prayerKey?: PrayerKey;
  onCompleteAzkar?: () => void;
}

export const AzkarModal: React.FC<AzkarModalProps> = ({
  isOpen,
  onClose,
  prayerKey,
  onCompleteAzkar,
}) => {
  const [counts, setCounts] = useState<Record<string, number>>({});

  if (!isOpen) return null;

  const prayerName = prayerKey
    ? PRAYER_DEFINITIONS.find((p) => p.key === prayerKey)?.name
    : 'الصلاة';

  const handleIncrement = (id: string, maxTarget: number) => {
    setCounts((prev) => {
      const current = prev[id] || 0;
      if (current >= maxTarget) return prev;
      return { ...prev, [id]: current + 1 };
    });
  };

  const handleReset = () => {
    setCounts({});
  };

  const allCompleted = POST_PRAYER_AZKAR.every((item) => (counts[item.id] || 0) >= item.count);

  const handleFinish = () => {
    if (onCompleteAzkar) {
      onCompleteAzkar();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs">
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-xl max-h-[90vh] flex flex-col border border-neutral-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-emerald-800 text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-200" />
            <div>
              <h3 className="font-bold text-base">أذكار ما بعد صلاة {prayerName}</h3>
              <p className="text-xs text-emerald-100 font-sans">الأذكار الصحيحة الثابتة عن النبي ﷺ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700 transition-colors"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable list */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {POST_PRAYER_AZKAR.map((zikr, index) => {
            const currentCount = counts[zikr.id] || 0;
            const isDone = currentCount >= zikr.count;

            return (
              <div
                key={zikr.id}
                onClick={() => handleIncrement(zikr.id, zikr.count)}
                className={`p-4 rounded-xl border transition-all cursor-pointer select-none ${
                  isDone
                    ? 'bg-emerald-50/70 border-emerald-200'
                    : 'bg-white border-neutral-200 hover:border-emerald-300 hover:shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-bold text-neutral-400">
                        {String(index + 1).padStart(2, '0')}.
                      </span>
                      {zikr.virtue && (
                        <span className="text-xs text-neutral-500 font-serif">
                          {zikr.virtue}
                        </span>
                      )}
                    </div>
                    <p className="text-neutral-900 font-serif text-base sm:text-lg leading-relaxed">
                      {zikr.text}
                    </p>
                  </div>

                  {/* Counter circle */}
                  <div className="flex flex-col items-center shrink-0">
                    <div
                      className={`w-12 h-12 rounded-full flex flex-col items-center justify-center font-bold text-xs transition-colors ${
                        isDone
                          ? 'bg-emerald-700 text-white'
                          : 'bg-neutral-100 text-neutral-800 border border-neutral-300'
                      }`}
                    >
                      {isDone ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <>
                          <span className="text-sm tabular-nums">{currentCount}</span>
                          <span className="text-[10px] text-neutral-500 -mt-1 tabular-nums">
                            /{zikr.count}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-neutral-600 hover:text-neutral-900 px-3 py-1.5 rounded-lg hover:bg-neutral-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة التصفير</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 bg-neutral-200/80 rounded-lg transition-colors"
            >
              إغلاق
            </button>
            <button
              onClick={handleFinish}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>تأكيد إتمام الأذكار</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
