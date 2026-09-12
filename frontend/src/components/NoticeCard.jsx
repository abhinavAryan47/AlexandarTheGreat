import React, { useState } from 'react';
import CategoryTag from './CategoryTag';
import UrgencyBadge from './UrgencyBadge';
import { Clock, ChevronDown, ChevronUp, FileText, CheckCircle, Tag, Building2, CheckSquare, Sparkles } from 'lucide-react';

export default function NoticeCard({ notice, onCreateTask, isTaskCreated = false }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showRawText, setShowRawText] = useState(false);
  const [taskAdded, setTaskAdded] = useState(isTaskCreated);

  // Format relative deadline countdown
  const getDeadlineLabel = (isoDate) => {
    if (!isoDate) return 'No deadline specified';
    const now = new Date();
    const target = new Date(isoDate);
    const diffMs = target - now;

    if (diffMs < 0) return 'Deadline passed';

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 24) {
      return `Due in ${diffHours} hour${diffHours === 1 ? '' : 's'}`;
    }

    const diffDays = Math.floor(diffHours / 24);
    return `Due in ${diffDays} day${diffDays === 1 ? '' : 's'} (${target.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})`;
  };

  // Determine border accent class per spec
  const borderAccentClass = 
    notice.urgency === 'urgent' ? 'border-urgency-urgent' :
    notice.urgency === 'soon' ? 'border-urgency-soon' : 'border-urgency-later';

  const handleTaskClick = (e) => {
    e.stopPropagation();
    if (!taskAdded && onCreateTask) {
      onCreateTask(notice);
      setTaskAdded(true);
    }
  };

  return (
    <div
      className={`noticeboard-card rounded-lg overflow-hidden transition-all duration-200 ${borderAccentClass} ${
        isExpanded ? 'shadow-md ring-1 ring-[#1B2430]/10' : ''
      }`}
    >
      {/* Compact View Header / Main Summary */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 sm:p-5 cursor-pointer hover:bg-[#FAF9F5] transition-colors"
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <CategoryTag category={notice.category} />
            <UrgencyBadge urgency={notice.urgency} />
            {notice.relevanceScore >= 0.85 && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-[#F0F5F4] text-[#3D5A57] px-2 py-0.5 rounded border border-[#3D5A57]/20">
                <Sparkles className="w-3 h-3 text-[#3D5A57]" />
                Highly Relevant ({Math.round(notice.relevanceScore * 100)}%)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-[#6B6459] font-mono flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {getDeadlineLabel(notice.deadline)}
            </span>
            <button
              aria-label={isExpanded ? "Collapse notice details" : "Expand notice details"}
              className="text-[#6B6459] hover:text-[#1B2430] p-1 rounded hover:bg-[#EFECE6] transition-colors"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-display text-base sm:text-lg font-semibold text-[#1B2430] leading-snug mb-2">
          {notice.title}
        </h3>

        {/* Action item strip */}
        {notice.requiredAction && (
          <div className="mt-3 p-2.5 bg-[#F7F5F0] border border-[#D8D3C7] rounded-md flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-medium text-[#1B2430]">
              <span className="w-2 h-2 rounded-full bg-[#C65A2E] shrink-0" />
              <span><strong className="text-[#6B6459]">Action Required:</strong> {notice.requiredAction}</span>
            </div>

            <button
              onClick={handleTaskClick}
              disabled={taskAdded}
              className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                taskAdded
                  ? 'bg-[#EFECE6] text-[#6B6459] border border-[#D8D3C7] cursor-default'
                  : 'bg-[#1B2430] text-white hover:bg-[#2C3848] cursor-pointer'
              }`}
            >
              {taskAdded ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-[#3D5A57]" />
                  Task Added
                </>
              ) : (
                <>
                  <CheckSquare className="w-3.5 h-3.5" />
                  Add Task
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Expanded State Details */}
      {isExpanded && (
        <div className="border-t border-[#D8D3C7] bg-[#FAF9F5] p-4 sm:p-5 space-y-4 text-xs">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Department */}
            {notice.department && (
              <div className="flex items-start gap-2">
                <Building2 className="w-4 h-4 text-[#6B6459] shrink-0 mt-0.5" />
                <div>
                  <span className="block font-semibold text-[#6B6459]">Issuing Authority</span>
                  <span className="text-[#1B2430] font-medium">{notice.department}</span>
                </div>
              </div>
            )}

            {/* Eligibility tags */}
            {notice.eligibility && notice.eligibility.length > 0 && (
              <div className="flex items-start gap-2">
                <Tag className="w-4 h-4 text-[#6B6459] shrink-0 mt-0.5" />
                <div>
                  <span className="block font-semibold text-[#6B6459] mb-1">Eligible Criteria</span>
                  <div className="flex flex-wrap gap-1">
                    {notice.eligibility.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-[#FFFFFF] border border-[#D8D3C7] rounded text-[11px] text-[#1B2430] font-mono"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Raw Text Accordion Toggle */}
          <div className="pt-2">
            <button
              onClick={() => setShowRawText(!showRawText)}
              className="inline-flex items-center gap-1.5 text-xs text-[#3D5A57] font-semibold hover:underline cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              {showRawText ? 'Hide Original Circular Text' : 'View Original Circular Text'}
            </button>

            {showRawText && (
              <div className="mt-2 p-3.5 bg-[#1B2430] text-[#F7F5F0] rounded-md font-mono text-xs whitespace-pre-wrap leading-relaxed border border-[#3D5A57]/40 shadow-inner">
                {notice.rawText}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
