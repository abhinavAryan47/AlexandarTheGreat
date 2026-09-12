import React, { useState } from 'react';
import TaskItem from '../components/TaskItem';
import { CheckSquare, ListFilter, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

export default function TasksView({ tasks = [], onStatusChange }) {
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter tasks by active status tab
  const filteredTasks = tasks.filter((task) => {
    if (statusFilter === 'all') return task.status !== 'dismissed';
    return task.status === statusFilter;
  });

  // Sort tasks by due date (soonest first)
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  const doneCount = tasks.filter(t => t.status === 'done').length;
  const dismissedCount = tasks.filter(t => t.status === 'dismissed').length;
  const totalActive = pendingCount + doneCount;
  const progressPercent = totalActive > 0 ? Math.round((doneCount / totalActive) * 100) : 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-[#FFFFFF] border border-[#D8D3C7] rounded-lg p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-[#C65A2E]" />
            <h2 className="font-display text-xl font-bold text-[#1B2430]">Actionable Tasks & Deadlines</h2>
          </div>
          <p className="text-xs text-[#6B6459] mt-1">
            Auto-generated from your high-relevance campus notices and manually saved action items.
          </p>
        </div>

        {/* Completion Progress Widget */}
        <div className="bg-[#F7F5F0] border border-[#D8D3C7] rounded-md p-3 min-w-[200px] text-xs">
          <div className="flex justify-between items-center mb-1 font-semibold text-[#1B2430]">
            <span>Task Completion</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-[#EFECE6] rounded-full overflow-hidden border border-[#D8D3C7]">
            <div
              className="h-full bg-[#3D5A57] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-[11px] text-[#6B6459] block mt-1 text-right">
            {doneCount} of {totalActive} tasks completed
          </span>
        </div>
      </div>

      {/* Filter Tabs & Task List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#D8D3C7] pb-2">
          <div className="flex items-center gap-1">
            {[
              { id: 'all', label: `Active (${pendingCount})` },
              { id: 'pending', label: `Pending (${pendingCount})` },
              { id: 'done', label: `Completed (${doneCount})` },
              { id: 'dismissed', label: `Dismissed (${dismissedCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-[#1B2430] text-[#F7F5F0]'
                    : 'text-[#6B6459] hover:text-[#1B2430] hover:bg-[#EFECE6]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Task Items */}
        {sortedTasks.length === 0 ? (
          <div className="bg-[#FFFFFF] border border-[#D8D3C7] rounded-lg p-8 text-center my-4">
            <CheckCircle2 className="w-8 h-8 text-[#3D5A57] mx-auto mb-2 opacity-50" />
            <h4 className="font-display font-semibold text-sm text-[#1B2430]">No Tasks Here</h4>
            <p className="text-xs text-[#6B6459] mt-0.5">
              {statusFilter === 'done'
                ? "No completed tasks yet. Mark items off as you finish them!"
                : "Your task queue for this status is clear."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onStatusChange={onStatusChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
