import React, { useState } from 'react';
import QueryBar from '../components/QueryBar';
import FilterRail from '../components/FilterRail';
import TodayDigest from '../components/TodayDigest';
import NoticeCard from '../components/NoticeCard';
import EmptyState from '../components/EmptyState';
import { Calendar, Clock, AlertTriangle, ChevronRight } from 'lucide-react';

export default function DashboardView({
  notices = [],
  tasks = [],
  studentProfile = {},
  filters,
  onFilterChange,
  onResetFilters,
  onExecuteQuery,
  onCreateTask,
  isMobileFilterOpen,
  setIsMobileFilterOpen
}) {
  // Group notices into time-urgency buckets: Today, This Week, Later
  const groupNoticesByTime = (noticeList) => {
    const today = [];
    const thisWeek = [];
    const later = [];

    const now = new Date();
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    const endOfWeek = new Date(now.getTime() + 7 * 24 * 3600 * 1000);

    noticeList.forEach((notice) => {
      if (notice.urgency === 'urgent') {
        today.push(notice);
      } else if (notice.urgency === 'soon') {
        thisWeek.push(notice);
      } else {
        later.push(notice);
      }
    });

    return { today, thisWeek, later };
  };

  const { today, thisWeek, later } = groupNoticesByTime(notices);
  const createdTaskNoticeIds = tasks.map(t => t.noticeId);

  return (
    <div className="space-y-6">
      {/* Hero Natural Language Query Bar */}
      <QueryBar
        onExecuteQuery={onExecuteQuery}
        allNotices={notices}
        onCreateTask={onCreateTask}
      />

      {/* Summary Digest Strip */}
      <TodayDigest
        notices={notices}
        tasks={tasks}
        studentProfile={studentProfile}
      />

      {/* Main Layout Grid: Left Rail + Main Time-Grouped Feed */}
      <div className="flex items-start gap-6">
        {/* Left Rail Filters */}
        <FilterRail
          filters={filters}
          onFilterChange={onFilterChange}
          onResetFilters={onResetFilters}
          isOpenMobile={isMobileFilterOpen}
          onCloseMobile={() => setIsMobileFilterOpen(false)}
        />

        {/* Notice Feed Column */}
        <main className="flex-1 min-w-0 space-y-8">
          {notices.length === 0 ? (
            <EmptyState onResetFilters={onResetFilters} />
          ) : (
            <>
              {/* Group 1: Today / Urgent Actions */}
              {today.length > 0 && (
                <section className="space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#D8D3C7]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C65A2E]" />
                    <h2 className="font-display text-base sm:text-lg font-bold text-[#1B2430] flex items-center gap-2">
                      <span>Today & Urgent Actions</span>
                      <span className="text-xs bg-[#FDF3EF] text-[#C65A2E] border border-[#E8A58B] px-2 py-0.5 rounded-full font-sans font-semibold">
                        {today.length} {today.length === 1 ? 'item' : 'items'}
                      </span>
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {today.map((notice) => (
                      <NoticeCard
                        key={notice.id}
                        notice={notice}
                        onCreateTask={onCreateTask}
                        isTaskCreated={createdTaskNoticeIds.includes(notice.id)}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Group 2: This Week */}
              {thisWeek.length > 0 && (
                <section className="space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#D8D3C7]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
                    <h2 className="font-display text-base sm:text-lg font-bold text-[#1B2430] flex items-center gap-2">
                      <span>This Week</span>
                      <span className="text-xs bg-[#FFFBEB] text-[#D97706] border border-[#FDE047] px-2 py-0.5 rounded-full font-sans font-semibold">
                        {thisWeek.length} {thisWeek.length === 1 ? 'item' : 'items'}
                      </span>
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {thisWeek.map((notice) => (
                      <NoticeCard
                        key={notice.id}
                        notice={notice}
                        onCreateTask={onCreateTask}
                        isTaskCreated={createdTaskNoticeIds.includes(notice.id)}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Group 3: Later / Upcoming */}
              {later.length > 0 && (
                <section className="space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#D8D3C7]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#3D5A57]" />
                    <h2 className="font-display text-base sm:text-lg font-bold text-[#1B2430] flex items-center gap-2">
                      <span>Later & Upcoming</span>
                      <span className="text-xs bg-[#F0F5F4] text-[#3D5A57] border border-[#3D5A57]/30 px-2 py-0.5 rounded-full font-sans font-semibold">
                        {later.length} {later.length === 1 ? 'item' : 'items'}
                      </span>
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {later.map((notice) => (
                      <NoticeCard
                        key={notice.id}
                        notice={notice}
                        onCreateTask={onCreateTask}
                        isTaskCreated={createdTaskNoticeIds.includes(notice.id)}
                      />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
