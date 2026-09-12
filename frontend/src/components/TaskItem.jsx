import React, { useState } from 'react';
import CategoryTag from './CategoryTag';
import { CheckSquare, Square, XCircle, Clock, Calendar, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { syncGoogleCalendar } from '../api/api';

export default function TaskItem({ task, onStatusChange }) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null); // { status: string, message: string }

  const isDone = task.status === 'done';
  const isDismissed = task.status === 'dismissed';

  const handleToggle = () => {
    const nextStatus = isDone ? 'pending' : 'done';
    onStatusChange(task.id, nextStatus);
  };

  const handleDismiss = (e) => {
    e.stopPropagation();
    onStatusChange(task.id, 'dismissed');
  };

  const handleCalendarSync = async (e) => {
    e.stopPropagation();
    setIsSyncing(true);
    setSyncStatus(null);

    const res = await syncGoogleCalendar(task.id);
    setIsSyncing(false);
    setSyncStatus(res);
  };

  const getDueDateLabel = (isoDate) => {
    if (!isoDate) return 'No due date';
    const d = new Date(isoDate);
    return `Due ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div
      className={`noticeboard-card p-4 rounded-lg flex flex-col gap-2 transition-all ${
        isDone ? 'bg-[#F9F8F6] opacity-75 border-l-4 border-l-[#3D5A57]' : 
        isDismissed ? 'bg-[#F5F3EF] opacity-50 border-l-4 border-l-[#6B6459]' : 
        task.priority === 'critical' ? 'border-l-4 border-l-red-600 bg-red-50/20' :
        task.priority === 'high' ? 'border-l-4 border-l-[#C65A2E]' : 'border-l-4 border-l-[#3D5A57]'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <button
            onClick={handleToggle}
            disabled={isDismissed}
            aria-label={isDone ? "Mark task pending" : "Mark task done"}
            className="mt-0.5 text-[#1B2430] hover:text-[#C65A2E] cursor-pointer shrink-0 transition-colors"
          >
            {isDone ? (
              <CheckSquare className="w-5 h-5 text-[#3D5A57]" />
            ) : (
              <Square className="w-5 h-5 text-[#6B6459]" />
            )}
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <CategoryTag category={task.category || 'administrative'} />
              {task.priority && (
                <span className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded border ${
                  task.priority === 'critical' || task.priority === 'high'
                    ? 'bg-[#FDF3EF] text-[#C65A2E] border-[#E8A58B]'
                    : 'bg-[#F0F5F4] text-[#3D5A57] border-[#3D5A57]/30'
                }`}>
                  {task.priority} Priority
                </span>
              )}
              {task.dueDate && (
                <span className="text-[11px] text-[#6B6459] font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {getDueDateLabel(task.dueDate)}
                </span>
              )}
            </div>

            <h4
              className={`text-sm font-semibold text-[#1B2430] leading-snug ${
                isDone ? 'line-through text-[#6B6459]' : ''
              }`}
            >
              {task.title}
            </h4>

            {task.description && (
              <p className="text-xs text-[#6B6459] mt-1 leading-relaxed">
                {task.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Google Calendar Sync Button */}
          {!isDismissed && (
            <button
              onClick={handleCalendarSync}
              disabled={isSyncing}
              title="Sync deadline to Google Calendar"
              className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-[#F7F5F0] border border-[#D8D3C7] text-[#1B2430] hover:bg-[#1B2430] hover:text-white rounded-md transition-colors cursor-pointer font-medium"
            >
              {isSyncing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C65A2E]" />
              ) : (
                <Calendar className="w-3.5 h-3.5 text-[#3D5A57]" />
              )}
              <span className="hidden sm:inline">Sync Calendar</span>
            </button>
          )}

          {!isDismissed && (
            <button
              onClick={handleDismiss}
              title="Dismiss task"
              aria-label="Dismiss task"
              className="text-[#6B6459] hover:text-[#C65A2E] p-1.5 rounded hover:bg-[#EFECE6] transition-colors cursor-pointer"
            >
              <XCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Calendar Sync Status Message */}
      {syncStatus && (
        <div className="mt-1 p-2 bg-[#F0F5F4] border border-[#3D5A57]/30 rounded text-[11px] text-[#3D5A57] flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 shrink-0 text-[#3D5A57]" />
            <span>{syncStatus.message}</span>
          </div>
          <button onClick={() => setSyncStatus(null)} className="text-[#6B6459] hover:text-[#1B2430]">×</button>
        </div>
      )}
    </div>
  );
}
