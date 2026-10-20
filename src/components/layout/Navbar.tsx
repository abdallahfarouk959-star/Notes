/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNotebook } from '../../context/NotebookContext';
import { ActiveTab } from '../../types/notebook';
import { Download, PlusCircle } from 'lucide-react';
import { exportDataAsJSON } from '../../utils/storage';

interface NavbarProps {
  onOpenQuickTask?: () => void;
  onOpenBackupModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenQuickTask, onOpenBackupModal }) => {
  const { activeTab, setActiveTab } = useNotebook();

  const navLinks: { id: ActiveTab; label: string }[] = [
    { id: 'dashboard', label: 'الرئيسية' },
    { id: 'diary', label: 'المذكرات' },
    { id: 'schedule', label: 'المواعيد والمهام' },
    { id: 'prayers', label: 'متتبع الصلوات' },
    { id: 'tasbih', label: 'السبحة والأذكار' },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-neutral-200/90 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 h-16">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className="text-xl font-bold tracking-tight text-neutral-900 hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 text-right"
        >
          <span className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center text-sm font-serif shadow-xs">
            مـ
          </span>
          <span>مُذكِّراتي</span>
        </button>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                  isActive
                    ? 'text-emerald-800 font-semibold border-emerald-700'
                    : 'text-neutral-600 hover:text-neutral-900 border-transparent hover:border-neutral-300'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenBackupModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
            title="نسخ احتياطي واستعادة"
          >
            <Download className="w-3.5 h-3.5" />
            <span>البيانات</span>
          </button>

          <button
            onClick={onOpenQuickTask}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>إضافة مهمة</span>
          </button>
        </div>
      </div>
    </header>
  );
};
