/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Clock, Tag, Flag, AlignLeft } from 'lucide-react';
import { DailyTask, TaskCategory, TaskPriority } from '../../types/notebook';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: {
    title: string;
    time?: string;
    category: TaskCategory;
    priority: TaskPriority;
    notes?: string;
  }) => void;
  initialTask?: DailyTask | null;
}

const CATEGORIES: { id: TaskCategory; label: string }[] = [
  { id: 'موعد', label: 'موعد مجدول' },
  { id: 'عمل', label: 'عمل' },
  { id: 'شخصي', label: 'شخصي' },
  { id: 'دراسة', label: 'دراسة' },
  { id: 'صحة', label: 'صحة ورياضة' },
  { id: 'عبادة', label: 'عبادة وذكر' },
];

const PRIORITIES: { id: TaskPriority; label: string }[] = [
  { id: 'منخفضة', label: 'منخفضة' },
  { id: 'متوسطة', label: 'متوسطة' },
  { id: 'عالية', label: 'عالية' },
];

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTask,
}) => {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [category, setCategory] = useState<TaskCategory>('عمل');
  const [priority, setPriority] = useState<TaskPriority>('متوسطة');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setTime(initialTask.time || '');
      setCategory(initialTask.category);
      setPriority(initialTask.priority);
      setNotes(initialTask.notes || '');
    } else {
      setTitle('');
      setTime('');
      setCategory('عمل');
      setPriority('متوسطة');
      setNotes('');
    }
    setError('');
  }, [initialTask, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('يرجى كتابة عنوان للمهمة أو الموعد');
      return;
    }
    onSave({
      title: title.trim(),
      time: time.trim() || undefined,
      category,
      priority,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-lg border border-neutral-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50/50">
          <h3 id="task-modal-title" className="font-bold text-neutral-900 text-base">
            {initialTask ? 'تعديل المهمة / الموعد' : 'إضافة موعد أو مهمة جديدة'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              عنوان المهمة أو الموعد <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              placeholder="مثال: مراجعة التقرير الأسبوعي، موعد الطبيب..."
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-neutral-500" />
                <span>الوقت (اختياري)</span>
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-neutral-500" />
                <span>التصنيف</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1 flex items-center gap-1">
              <Flag className="w-3.5 h-3.5 text-neutral-500" />
              <span>مستوى الأولوية</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PRIORITIES.map((p) => {
                const isSelected = priority === p.id;
                return (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => setPriority(p.id)}
                    className={`py-1.5 px-3 text-xs font-medium rounded-lg border transition-colors ${
                      isSelected
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                        : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1 flex items-center gap-1">
              <AlignLeft className="w-3.5 h-3.5 text-neutral-500" />
              <span>ملاحظات إضافية (اختياري)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="أي تفاصيل أو متطلبات للمهمة..."
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-medium text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors"
            >
              {initialTask ? 'حفظ التعديلات' : 'إضافة إلى اليوم'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
