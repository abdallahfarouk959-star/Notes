/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NotebookProvider, useNotebook } from './context/NotebookContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { DatePickerBar } from './components/common/DatePickerBar';
import { DashboardView } from './components/dashboard/DashboardView';
import { DiaryView } from './components/diary/DiaryView';
import { ScheduleView } from './components/schedule/ScheduleView';
import { PrayerTrackerView } from './components/prayers/PrayerTrackerView';
import { TasbihView } from './components/azkar/TasbihView';
import { TaskModal } from './components/schedule/TaskModal';
import { AzkarModal } from './components/azkar/AzkarModal';
import { DataBackupModal } from './components/settings/DataBackupModal';
import { PrayerKey } from './types/notebook';

const MainContent: React.FC = () => {
  const { activeTab, addTask, togglePrayer } = useNotebook();

  // Global modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [azkarPrayerKey, setAzkarPrayerKey] = useState<PrayerKey | null>(null);

  const handleOpenAzkarModal = (key: PrayerKey) => {
    setAzkarPrayerKey(key);
  };

  return (
    <div className="min-h-screen bg-neutral-100/60 flex flex-col text-neutral-800 antialiased font-sans selection:bg-emerald-100 selection:text-emerald-900 pb-16 md:pb-0">
      {/* 3-zone Header */}
      <Navbar
        onOpenQuickTask={() => setIsTaskModalOpen(true)}
        onOpenBackupModal={() => setIsBackupModalOpen(true)}
      />

      {/* Date Navigation Bar */}
      <DatePickerBar />

      {/* Main Layout: Sidebar (Right) + Content (Left) */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar (RTL: right side) */}
        <Sidebar
          onOpenQuickTask={() => setIsTaskModalOpen(true)}
          onOpenBackupModal={() => setIsBackupModalOpen(true)}
        />

        {/* Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          <div className="max-w-4xl mx-auto">
            {activeTab === 'dashboard' && (
              <DashboardView
                onOpenTaskModal={() => setIsTaskModalOpen(true)}
                onOpenAzkarModal={handleOpenAzkarModal}
              />
            )}

            {activeTab === 'diary' && <DiaryView />}

            {activeTab === 'schedule' && <ScheduleView />}

            {activeTab === 'prayers' && <PrayerTrackerView />}

            {activeTab === 'tasbih' && <TasbihView />}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Global Task Creation Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={(taskData) => addTask(taskData)}
      />

      {/* Global Azkar Modal */}
      <AzkarModal
        isOpen={azkarPrayerKey !== null}
        onClose={() => setAzkarPrayerKey(null)}
        prayerKey={azkarPrayerKey || undefined}
        onCompleteAzkar={() => {
          if (azkarPrayerKey) {
            togglePrayer(azkarPrayerKey, 'azkar');
          }
        }}
      />

      {/* Data Backup & Restore Modal */}
      <DataBackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <NotebookProvider>
      <MainContent />
    </NotebookProvider>
  );
}
