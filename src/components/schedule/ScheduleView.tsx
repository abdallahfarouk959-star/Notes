/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNotebook } from '../../context/NotebookContext';
import { DailyTask, TaskCategory, TaskPriority } from '../../types/notebook';
import { formatArabicDate, formatTime12HourArabic } from '../../utils/dateUtils';
import {
  CheckSquare,
  Clock,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  Circle,
  Filter,
  Calendar,
  Tag,
  ListTodo,
} from 'lucide-react';
import { TaskModal } from './TaskModal';

const CATEGORY_COLORS: Record<TaskCategory, string> = {
  موعد: 'text-sky-800 bg-sky-50 border-sky-200',
  عمل: 'text-indigo-800 bg-indigo-50 border-indigo-200',
  شخصي: 'text-amber-800 bg-amber-50 border-amber-200',
  دراسة: 'text-purple-800 bg-purple-50 border-purple-200',
  صحة: 'text-emerald-800 bg-emerald-50 border-emerald-200',
  عبادة: 'text-teal-800 bg-teal-50 border-teal-200',
};

const PRIORITY_BADGES: Record<TaskPriority, { label: string; class: string }> = {
  عالية: { label: 'أولوية قصوى', class: 'text-rose-700 bg-rose-50 border-rose-200' },
  متوسطة: { label: 'متوسطة', class: 'text-neutral-700 bg-neutral-100 border-neutral-200' },
  منخفضة: { label: 'عادية', class: 'text-neutral-500 bg-neutral-50 border-neutral-200' },
};

export const ScheduleView: React.FC = () => {
  const {
    currentDay,
    selectedDate,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    stats,
  } = useNotebook();

  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<DailyTask | null>(null);

  // Quick inline add input
  const [quickTitle, setQuickTitle] = useState('');
  const [quickTime, setQuickTime] = useState('');

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    addTask({
      title: quickTitle.trim(),
      time: quickTime.trim() || undefined,
      category: 'عمل',
      priority: 'متوسطة',
    });
    setQuickTitle('');
    setQuickTime('');
  };

  const handleOpenEdit = (task: DailyTask) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSaveModal = (data: {
    title: string;
    time?: string;
    category: TaskCategory;
    priority: TaskPriority;
    notes?: string;
  }) => {
    if (editingTask) {
      updateTask(editingTask.id, data);
    } else {
      addTask(data);
    }
  };

  // Filter tasks
  const filteredTasks = currentDay.tasks
    .filter((task) => {
      if (statusFilter === 'active') return !task.completed;
      if (statusFilter === 'completed') return task.completed;
      return true;
    })
    .filter((task) => {
      if (categoryFilter === 'all') return true;
      return task.category === categoryFilter;
    })
    .sort((a, b) => {
      // Sort with time first, then chronological
      if (a.time && b.time) return a.time.localeCompare(b.time);
      if (a.time) return -1;
      if (b.time) return 1;
      return b.createdAt - a.createdAt;
    });

  return (
    <div className="space-y-6">
      {/* Header and Quick Stats */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-emerald-700" />
            <span>جدول المواعيد والمهام</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            جدول أعمال يوم {formatArabicDate(selectedDate)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs text-neutral-500 bg-neutral-50 border border-neutral-200 px-3 py-1.5 rounded-lg tabular-nums">
            المكتمل: <strong className="text-neutral-900">{stats.tasksCompleted}</strong> من {stats.tasksTotal}
          </div>

          <button
            onClick={() => {
              setEditingTask(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة موعد أو مهمة</span>
          </button>
        </div>
      </div>

      {/* Quick Add Bar */}
      <form
        onSubmit={handleQuickAdd}
        className="bg-white rounded-xl border border-neutral-200/90 p-3 shadow-xs flex flex-col sm:flex-row items-center gap-2"
      >
        <div className="flex-1 w-full">
          <input
            type="text"
            placeholder="إضافة مهمة سريعة... (اضغط Enter للإضافة)"
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-neutral-50/50"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1 text-xs text-neutral-500 bg-neutral-50 border border-neutral-200 px-2 py-1.5 rounded-lg shrink-0">
            <Clock className="w-3.5 h-3.5" />
            <input
              type="time"
              value={quickTime}
              onChange={(e) => setQuickTime(e.target.value)}
              className="bg-transparent focus:outline-none text-xs text-neutral-700"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            إضافة سريعة
          </button>
        </div>
      </form>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-neutral-200/80">
        {/* Status segmented control */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              statusFilter === 'all'
                ? 'bg-white text-neutral-900 shadow-2xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            الكل ({currentDay.tasks.length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              statusFilter === 'active'
                ? 'bg-white text-neutral-900 shadow-2xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            قيد الانتظار ({currentDay.tasks.length - stats.tasksCompleted})
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              statusFilter === 'completed'
                ? 'bg-white text-neutral-900 shadow-2xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            المكتملة ({stats.tasksCompleted})
          </button>
        </div>

        {/* Category filter dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-neutral-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs py-1 px-2.5 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-700 focus:outline-none"
          >
            <option value="all">كافة التصنيفات</option>
            <option value="موعد">مواعيد</option>
            <option value="عمل">عمل</option>
            <option value="شخصي">شخصي</option>
            <option value="دراسة">دراسة</option>
            <option value="صحة">صحة</option>
            <option value="عبادة">عبادة</option>
          </select>
        </div>
      </div>

      {/* Task List / Timeline Cards */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200/90 p-12 text-center shadow-xs">
          <ListTodo className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-neutral-800">لا توجد مهام أو مواعيد مطابقة</h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            {currentDay.tasks.length === 0
              ? 'لم تقم بجدولة أي مهام لهذا اليوم بعد. انقر على الزر أدناه لإضافة أول موعد.'
              : 'لا توجد عناصر مطابقة لخيارات التصفية المحددة حالياً.'}
          </p>
          <button
            onClick={() => {
              setEditingTask(null);
              setIsModalOpen(true);
            }}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة موعد أو مهمة جديدة</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const isDone = task.completed;
            const categoryClass = CATEGORY_COLORS[task.category] || 'text-neutral-700 bg-neutral-100 border-neutral-200';
            const priorityInfo = PRIORITY_BADGES[task.priority] || PRIORITY_BADGES['متوسطة'];

            return (
              <div
                key={task.id}
                className={`bg-white rounded-xl border p-4 sm:p-5 transition-all shadow-2xs ${
                  isDone
                    ? 'border-neutral-200 bg-neutral-50/50 opacity-80'
                    : 'border-neutral-200 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Left (Checkbox & Content) */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="mt-0.5 text-neutral-400 hover:text-emerald-700 transition-colors shrink-0"
                      title={isDone ? 'إلغاء الإكمال' : 'تحديد كمكتمل'}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${categoryClass}`}>
                          {task.category}
                        </span>

                        {task.priority === 'عالية' && (
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${priorityInfo.class}`}>
                            {priorityInfo.label}
                          </span>
                        )}

                        {task.time && (
                          <span className="flex items-center gap-1 text-xs text-neutral-600 font-mono tabular-nums bg-neutral-100 px-2 py-0.5 rounded">
                            <Clock className="w-3 h-3 text-neutral-400" />
                            <span>{formatTime12HourArabic(task.time)}</span>
                          </span>
                        )}
                      </div>

                      <h4
                        className={`text-sm sm:text-base font-bold text-neutral-900 ${
                          isDone ? 'line-through text-neutral-400' : ''
                        }`}
                      >
                        {task.title}
                      </h4>

                      {task.notes && (
                        <p className="text-xs text-neutral-600 mt-1 leading-relaxed whitespace-pre-line">
                          {task.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions (Edit / Delete) */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleOpenEdit(task)}
                      className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
                      title="تعديل"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Task Modal for creation and editing */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveModal}
        initialTask={editingTask}
      />
    </div>
  );
};
