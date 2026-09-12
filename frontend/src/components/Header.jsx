import React, { useState } from 'react';
import { LayoutDashboard, CheckSquare, User, Sparkles, SlidersHorizontal, PlusCircle } from 'lucide-react';
import IngestNoticeModal from './IngestNoticeModal';

export default function Header({
  activeTab,
  onTabChange,
  studentProfile = {},
  taskCount = 0,
  onToggleMobileFilter,
  onNoticeIngested
}) {
  const [isIngestModalOpen, setIsIngestModalOpen] = useState(false);

  return (
    <>
      <header className="bg-[#FFFFFF] border-b border-[#D8D3C7] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo & App Title */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => onTabChange('dashboard')}>
              <div className="w-9 h-9 rounded-lg bg-[#1B2430] text-[#F7F5F0] flex items-center justify-center font-display font-extrabold text-xl shadow-xs">
                A
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-lg sm:text-xl font-bold tracking-tight text-[#1B2430] m-0">
                    AlexandarTheGreat
                  </h1>
                  <span className="text-[10px] bg-[#C65A2E] text-white px-1.5 py-0.5 rounded font-mono font-semibold">
                    AI
                  </span>
                </div>
                <p className="text-[11px] text-[#6B6459] -mt-1 font-sans hidden sm:block">
                  Smart Campus Triage & Noticeboard
                </p>
              </div>
            </div>

            {/* Navigation View Switcher Tabs */}
            <nav className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => onTabChange('dashboard')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-[#1B2430] text-[#F7F5F0]'
                    : 'text-[#6B6459] hover:text-[#1B2430] hover:bg-[#EFECE6]'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Feed</span>
              </button>

              <button
                onClick={() => onTabChange('tasks')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer relative ${
                  activeTab === 'tasks'
                    ? 'bg-[#1B2430] text-[#F7F5F0]'
                    : 'text-[#6B6459] hover:text-[#1B2430] hover:bg-[#EFECE6]'
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Tasks</span>
                {taskCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 bg-[#C65A2E] text-white text-[10px] font-bold rounded-full">
                    {taskCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => onTabChange('profile')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-[#1B2430] text-[#F7F5F0]'
                    : 'text-[#6B6459] hover:text-[#1B2430] hover:bg-[#EFECE6]'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Profile</span>
              </button>
            </nav>

            {/* Right Action: AI Ingest Button & Profile Pill */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsIngestModalOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C65A2E] text-white rounded-md text-xs font-semibold hover:bg-[#A84822] transition-colors cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span>Ingest Circular</span>
              </button>

              {activeTab === 'dashboard' && onToggleMobileFilter && (
                <button
                  onClick={onToggleMobileFilter}
                  className="md:hidden p-2 text-[#1B2430] bg-[#EFECE6] border border-[#D8D3C7] rounded-md hover:bg-[#D8D3C7] transition-colors cursor-pointer"
                  title="Toggle Filters"
                  aria-label="Toggle Filters"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              )}

              <div className="hidden md:flex items-center gap-2 pl-3 border-l border-[#D8D3C7]">
                <div className="w-7 h-7 rounded-full bg-[#3D5A57] text-white flex items-center justify-center font-bold text-xs">
                  {studentProfile.name ? studentProfile.name.charAt(0) : 'S'}
                </div>
                <div className="text-right">
                  <span className="block text-xs font-semibold text-[#1B2430]">
                    {studentProfile.name}
                  </span>
                  <span className="block text-[10px] text-[#6B6459]">
                    {studentProfile.branch} ({studentProfile.year}st Yr)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* AI Ingest Modal */}
      <IngestNoticeModal
        isOpen={isIngestModalOpen}
        onClose={() => setIsIngestModalOpen(false)}
        onNoticeIngested={onNoticeIngested}
      />
    </>
  );
}
