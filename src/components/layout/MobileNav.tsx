/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNotebook } from '../../context/NotebookContext';
import { ActiveTab } from '../../types/notebook';
import { LayoutDashboard, BookOpen, CheckSquare, Sparkles, HeartHandshake } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab } = useNotebook();

  const items: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'الرئيسية', icon: LayoutDashboard },
    { id: 'diary', label: 'المذكرات', icon: BookOpen },
    { id: 'schedule', label: 'المواعيد', icon: CheckSquare },
    { id: 'prayers', label: 'الصلوات', icon: Sparkles },
    { id: 'tasbih', label: 'الأذكار', icon: HeartHandshake },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-neutral-200 z-30 px-2 py-1.5 shadow-lg safe-area-pb">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors min-w-[56px] ${
                isActive
                  ? 'text-emerald-800 font-semibold'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
              <span className="text-[11px] leading-tight whitespace-nowrap">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
