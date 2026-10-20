/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { X, Download, Upload, AlertTriangle, Check, RefreshCw } from 'lucide-react';
import { exportDataAsJSON, importDataFromJSON, saveAllRecords } from '../../utils/storage';
import { useNotebook } from '../../context/NotebookContext';

interface DataBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataBackupModal: React.FC<DataBackupModalProps> = ({ isOpen, onClose }) => {
  const { refreshData } = useNotebook();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleExport = () => {
    exportDataAsJSON();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importDataFromJSON(content);
        if (success) {
          setIsSuccess(true);
          setImportStatus('تمت استعادة البيانات بنجاح!');
          refreshData();
          setTimeout(() => {
            onClose();
            setImportStatus(null);
          }, 1500);
        } else {
          setIsSuccess(false);
          setImportStatus('ملف غير صالح أو تالف. يرجى التأكد من رفع ملف النسخة الاحتياطية الصحيح.');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleResetAll = () => {
    saveAllRecords({});
    refreshData();
    setShowResetConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-md border border-neutral-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50/70">
          <h3 className="font-bold text-neutral-900 text-base">إدارة النسخ الاحتياطي والبيانات</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <p className="text-xs text-neutral-600 leading-relaxed">
            تُحفظ جميع بياناتك (الصلوات، المواعيد، المذكرات) محلياً داخل متصفحك لضمان أقصى درجات الخصوصية. يمكنك تنزيل نسخة احتياطية أو استعادتها في أي وقت.
          </p>

          {importStatus && (
            <div
              className={`p-3 text-xs rounded-lg flex items-center gap-2 ${
                isSuccess
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {isSuccess ? <Check className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
              <span>{importStatus}</span>
            </div>
          )}

          <div className="space-y-3">
            {/* Export */}
            <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 flex items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-semibold text-neutral-900">تصدير نسخة احتياطية</h4>
                <p className="text-xs text-neutral-500 mt-0.5">تنزيل جميع البيانات كملف JSON محفوظ</p>
              </div>
              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تصدير الآن</span>
              </button>
            </div>

            {/* Import */}
            <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 flex items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-semibold text-neutral-900">استعادة من ملف</h4>
                <p className="text-xs text-neutral-500 mt-0.5">رفع ملف نسخة سابقة تم تصديرها</p>
              </div>
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".json"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-100 rounded-lg transition-colors shrink-0"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>اختيار ملف</span>
                </button>
              </div>
            </div>
          </div>

          {/* Danger zone */}
          <div className="pt-2 border-t border-neutral-200">
            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="text-xs text-rose-600 hover:text-rose-700 transition-colors"
              >
                مسح وتصفير كافة البيانات المحفوظة...
              </button>
            ) : (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg space-y-2">
                <p className="text-xs text-rose-800 font-medium">
                  هل أنت متأكد من رغبتك في حذف كافة السجلات والمذكرات نهائياً؟
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetAll}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors"
                  >
                    نعم، حذف الكل
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-300 rounded-lg"
                  >
                    تراجع
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
