import React from 'react';
import { AlertCircle, Clock, Sparkles, CheckCircle2 } from 'lucide-react';

export default function TodayDigest({ notices = [], tasks = [], studentProfile = {} }) {
  const urgentCount = notices.filter(n => n.urgency === 'urgent').length;
  const soonCount = notices.filter(n => n.urgency === 'soon').length;
  const pendingTasksCount = tasks.filter(t => t.status === 'pending').length;

  return (
    <div className="bg-[#FFFFFF] border border-[#D8D3C7] rounded-lg p-4 mb-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#1B2430] text-[#F7F5F0] flex items-center justify-center font-display font-semibold text-lg shrink-0">
          🏛️
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-lg font-semibold text-[#1B2430]">
              Good day, {studentProfile.name || 'Student'}
            </h2>
            <span className="text-xs bg-[#EFECE6] text-[#6B6459] px-2 py-0.5 rounded font-mono border border-[#D8D3C7]">
              {studentProfile.branch} · Year {studentProfile.year}
            </span>
          </div>
          <p className="text-xs text-[#6B6459] mt-0.5">
            Campus Feed Digest — {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap text-xs">
        {urgentCount > 0 && (
          <div className="flex items-center gap-1.5 bg-[#FDF3EF] border border-[#E8A58B] text-[#C65A2E] px-3 py-1.5 rounded-md font-medium">
            <AlertCircle className="w-4 h-4 text-[#C65A2E]" />
            <span><strong>{urgentCount}</strong> urgent actions today</span>
          </div>
        )}

        <div className="flex items-center gap-1.5 bg-[#F0F5F4] border border-[#3D5A57]/30 text-[#3D5A57] px-3 py-1.5 rounded-md font-medium">
          <Clock className="w-4 h-4 text-[#3D5A57]" />
          <span><strong>{soonCount}</strong> due this week</span>
        </div>

        <div className="flex items-center gap-1.5 bg-[#EFECE6] border border-[#D8D3C7] text-[#1B2430] px-3 py-1.5 rounded-md font-medium">
          <CheckCircle2 className="w-4 h-4 text-[#6B6459]" />
          <span><strong>{pendingTasksCount}</strong> pending tasks</span>
        </div>
      </div>
    </div>
  );
}
