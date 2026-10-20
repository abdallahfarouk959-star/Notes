/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNotebook } from '../../context/NotebookContext';
import { MoodType, DailyDiary } from '../../types/notebook';
import { formatArabicDate, formatArabicShortDate, isToday } from '../../utils/dateUtils';
import {
  BookOpen,
  Save,
  Trash2,
  Smile,
  Search,
  Copy,
  Check,
  Calendar,
  CloudSun,
  Hash,
  Lightbulb,
  FileText,
} from 'lucide-react';

const MOODS: { id: MoodType; label: string; icon: string }[] = [
  { id: 'سعيد', label: 'سعيد', icon: '😊' },
  { id: 'راضٍ', label: 'راضٍ', icon: '😌' },
  { id: 'ممتن', label: 'ممتن', icon: '🤲' },
  { id: 'منجز', label: 'منجز', icon: '⚡' },
  { id: 'هادئ', label: 'هادئ', icon: '🍃' },
  { id: 'متأمل', label: 'متأمل', icon: '💭' },
  { id: 'متعب', label: 'متعب', icon: '🥱' },
  { id: 'قلق', label: 'قلق', icon: '😟' },
];

const WRITING_PROMPTS = [
  'ما هو الحدث الذي جعلك تبتسم اليوم؟',
  'ما النعمة التي تود أن تحمد الله عليها الآن؟',
  'ما الدرس أو الفائدة التي خرجت بها من أحداث اليوم؟',
  'شخص قدم لك معروفاً أو أسعدك اليوم واذكر صنيعه...',
  'ما التحدي الذي واجهته وكيف تعاملت معه بحكمة؟',
];

export const DiaryView: React.FC = () => {
  const {
    currentDay,
    selectedDate,
    setSelectedDate,
    saveDiary,
    deleteDiary,
    allRecords,
  } = useNotebook();

  // Local editor state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<MoodType | undefined>(undefined);
  const [weather, setWeather] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [moodFilter, setMoodFilter] = useState<string>('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Sync editor when currentDay changes
  useEffect(() => {
    if (currentDay.diary) {
      setTitle(currentDay.diary.title || '');
      setContent(currentDay.diary.content || '');
      setMood(currentDay.diary.mood);
      setWeather(currentDay.diary.weather || '');
      setTags(currentDay.diary.tags || []);
    } else {
      setTitle(`مذكرة ${formatArabicShortDate(selectedDate)}`);
      setContent('');
      setMood(undefined);
      setWeather('');
      setTags([]);
    }
    setShowDeleteConfirm(false);
  }, [selectedDate, currentDay]);

  const handleSave = () => {
    saveDiary({
      title: title.trim() || `مذكرة ${formatArabicShortDate(selectedDate)}`,
      content: content.trim(),
      mood,
      weather: weather.trim() || undefined,
      tags: tags.length > 0 ? tags : undefined,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleDelete = () => {
    deleteDiary(selectedDate);
    setTitle(`مذكرة ${formatArabicShortDate(selectedDate)}`);
    setContent('');
    setMood(undefined);
    setWeather('');
    setTags([]);
    setShowDeleteConfirm(false);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const clean = tagInput.trim().replace(/^#/, '');
      if (clean && !tags.includes(clean)) {
        setTags([...tags, clean]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleCopy = () => {
    const textToCopy = `${title}\nالتاريخ: ${formatArabicDate(selectedDate)}\n\n${content}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsertPrompt = (prompt: string) => {
    setContent((prev) => (prev ? `${prev}\n\n• ${prompt}\n` : `• ${prompt}\n`));
  };

  // Extract all existing diary entries across all dates for the history list
  const allEntries: DailyDiary[] = Object.values(allRecords)
    .map((record) => record.diary)
    .filter((d): d is DailyDiary => !!d && d.content.trim().length > 0)
    .sort((a, b) => b.date.localeCompare(a.date));

  // Filter entries
  const filteredEntries = allEntries.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesMood = moodFilter === 'all' || entry.mood === moodFilter;
    return matchesSearch && matchesMood;
  });

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200/90 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-700" />
            <span>المذكرات اليومية</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            توثيق ليوم {formatArabicDate(selectedDate)}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 ${
              showHistory
                ? 'bg-neutral-900 text-white border-neutral-900'
                : 'bg-neutral-100 text-neutral-700 border-neutral-200 hover:bg-neutral-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>أرشيف التدوينات ({allEntries.length})</span>
          </button>

          {content && (
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg border border-neutral-200 transition-colors flex items-center gap-1.5"
              title="نسخ التدوينة"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
            </button>
          )}

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors"
          >
            {saveSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{saveSuccess ? 'تم الحفظ!' : 'حفظ المذكرة'}</span>
          </button>
        </div>
      </div>

      {/* Archive / History Panel (Conditional Drawer or View) */}
      {showHistory && (
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
            <h3 className="font-bold text-neutral-900 text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-700" />
              <span>البحث في الأرشيف وتصفح المذكرات السابقة</span>
            </h3>

            {/* Filter controls */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-2.5" />
                <input
                  type="text"
                  placeholder="بحث في الكلمات أو الوسوم..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-8 pl-3 py-1.5 text-xs rounded-lg border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-emerald-600 w-44 sm:w-56"
                />
              </div>

              <select
                value={moodFilter}
                onChange={(e) => setMoodFilter(e.target.value)}
                className="py-1.5 px-2 text-xs rounded-lg border border-neutral-300 bg-white focus:outline-none text-neutral-700"
              >
                <option value="all">كل الحالات المزاجية</option>
                {MOODS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.icon} {m.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredEntries.length === 0 ? (
            <div className="text-center py-8 text-neutral-400 text-xs">
              {allEntries.length === 0
                ? 'لا توجد تدوينات محفوظة سابقة بعد. دوّن أول مذكرة الآن!'
                : 'لا توجد نتائج مطابقة لبحثك الحالي.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredEntries.map((entry) => {
                const isCurrentActive = entry.date === selectedDate;
                return (
                  <div
                    key={entry.date}
                    onClick={() => {
                      setSelectedDate(entry.date);
                      setShowHistory(false);
                    }}
                    className={`p-3.5 rounded-xl border text-right transition-all cursor-pointer ${
                      isCurrentActive
                        ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500'
                        : 'border-neutral-200 hover:border-emerald-300 hover:shadow-xs bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                      <span className="font-medium text-neutral-800">
                        {formatArabicShortDate(entry.date)}
                      </span>
                      {entry.mood && (
                        <span className="text-[11px] text-neutral-600 bg-neutral-100 px-1.5 py-0.5 rounded">
                          {entry.mood}
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-neutral-900 truncate">{entry.title}</h4>
                    <p className="text-xs text-neutral-600 line-clamp-2 mt-1 font-serif leading-relaxed">
                      {entry.content}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Main Journaling Editor Canvas */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 overflow-hidden shadow-xs">
        {/* Editor Toolbar (Mood, Weather, Prompts) */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 bg-neutral-50/60 space-y-3">
          {/* Mood Selector */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-neutral-600 flex items-center gap-1">
              <Smile className="w-3.5 h-3.5 text-neutral-500" />
              <span>الحالة المزاجية:</span>
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {MOODS.map((m) => {
                const isSelected = mood === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMood(isSelected ? undefined : m.id)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs transition-colors ${
                      isSelected
                        ? 'bg-emerald-700 text-white font-medium shadow-2xs'
                        : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    <span>{m.icon}</span>
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Weather and Tags Row */}
          <div className="flex items-center gap-4 flex-wrap pt-1">
            {/* Weather input */}
            <div className="flex items-center gap-1.5 text-xs">
              <CloudSun className="w-3.5 h-3.5 text-neutral-500" />
              <input
                type="text"
                placeholder="حالة الطقس (مشمس، معتدل...)"
                value={weather}
                onChange={(e) => setWeather(e.target.value)}
                className="px-2 py-1 text-xs rounded-md border border-neutral-300 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600 w-44"
              />
            </div>

            {/* Tag input */}
            <div className="flex items-center gap-1.5 text-xs flex-wrap flex-1">
              <Hash className="w-3.5 h-3.5 text-neutral-500" />
              <input
                type="text"
                placeholder="أضف وسماً واضغط Enter..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className="px-2 py-1 text-xs rounded-md border border-neutral-300 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600 w-36"
              />
              <div className="flex items-center gap-1 flex-wrap">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-neutral-200/80 text-neutral-800"
                  >
                    <span>#{tag}</span>
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="text-neutral-500 hover:text-neutral-900 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Paper Canvas */}
        <div className="p-6 space-y-4">
          {/* Title Input */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="عنوان تدوينة اليوم..."
            className="w-full text-lg sm:text-xl font-bold text-neutral-900 border-b border-neutral-200 pb-2 focus:outline-none focus:border-emerald-700 transition-colors bg-transparent"
          />

          {/* Content Area styled like an authentic notebook */}
          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="اكتب ما يدور في خاطرك اليوم، مواقف مررت بها، نعم تستشعرها، أو قرارات تود اتخاذها..."
              className="w-full h-80 sm:h-96 text-sm sm:text-base font-serif text-neutral-800 focus:outline-none resize-none leading-loose p-2 bg-transparent"
              dir="rtl"
            />
          </div>

          {/* Writing Prompts Suggestion Bar */}
          <div className="pt-3 border-t border-neutral-100">
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-neutral-500">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>أفكار ملهمة للكتابة اليومية (انقر لإدراج السؤال):</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {WRITING_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleInsertPrompt(prompt)}
                  className="text-[11px] text-neutral-600 hover:text-emerald-800 bg-neutral-50 hover:bg-emerald-50 px-2.5 py-1 rounded-md border border-neutral-200/80 transition-colors text-right"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Status & Delete Bar */}
        <div className="px-6 py-3.5 bg-neutral-50 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-500">
          <div className="flex items-center gap-4">
            <span className="tabular-nums">الكلمات: {wordCount}</span>
            <span>·</span>
            <span className="tabular-nums">الحروف: {charCount}</span>
            {currentDay.diary?.updatedAt && (
              <>
                <span>·</span>
                <span>
                  آخر حفظ:{' '}
                  {new Date(currentDay.diary.updatedAt).toLocaleTimeString('ar-EG', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </>
            )}
          </div>

          {/* Delete Action with Safe Confirmation */}
          {currentDay.diary && (
            <div>
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-1 text-rose-600 hover:text-rose-700 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>حذف تدوينة هذا اليوم</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-rose-700 font-medium">تأكيد الحذف؟</span>
                  <button
                    onClick={handleDelete}
                    className="px-2.5 py-1 bg-rose-600 text-white rounded hover:bg-rose-700 transition-colors"
                  >
                    حذف
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-2.5 py-1 bg-neutral-200 text-neutral-700 rounded hover:bg-neutral-300"
                  >
                    إلغاء
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
