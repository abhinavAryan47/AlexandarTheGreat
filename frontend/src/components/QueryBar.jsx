import React, { useState, useEffect } from 'react';
import { Sparkles, Search, X, Loader2, ArrowRight, Bot, HelpCircle, Cpu, Wrench } from 'lucide-react';
import NoticeCard from './NoticeCard';

const ROTATING_EXAMPLES = [
  "What do I need to complete this week?",
  "Which placement opportunities am I eligible for?",
  "Any scholarship deadlines coming up?",
  "What are the exam fee details?",
  "Are there any upcoming hackathons or coding events?"
];

export default function QueryBar({ onExecuteQuery, allNotices = [], onCreateTask }) {
  const [query, setQuery] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [activeResult, setActiveResult] = useState(null);

  // Rotate sample prompts every 4 seconds when input is empty
  useEffect(() => {
    if (query) return;
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % ROTATING_EXAMPLES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [query]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const targetQuery = query.trim() || ROTATING_EXAMPLES[placeholderIndex];
    if (!targetQuery) return;

    setIsLoading(true);
    setActiveResult(null);

    const result = await onExecuteQuery(targetQuery);
    setActiveResult(result);
    setIsLoading(false);
  };

  const handleSelectExample = (example) => {
    setQuery(example);
  };

  const handleClearQuery = () => {
    setQuery('');
    setActiveResult(null);
  };

  // Get matching notice objects for inline rendering
  const matchingNotices = activeResult
    ? allNotices.filter(n => activeResult.matchingNoticeIds && activeResult.matchingNoticeIds.includes(n.id))
    : [];

  return (
    <div className="mb-8 space-y-4">
      {/* Hero Query Input Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="bg-[#FFFFFF] border-2 border-[#1B2430] rounded-xl p-2 sm:p-3 shadow-md transition-all focus-within:ring-4 focus-within:ring-[#1B2430]/10 flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-[#1B2430] text-[#F7F5F0] flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-[#E8A58B]" />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Ask Alexandar AI Agent — "${ROTATING_EXAMPLES[placeholderIndex]}"`}
            className="flex-1 bg-transparent border-none outline-none text-sm sm:text-base font-sans font-medium text-[#1B2430] placeholder-[#6B6459] px-2 py-1"
          />

          {query && (
            <button
              type="button"
              onClick={handleClearQuery}
              aria-label="Clear query text"
              className="p-1.5 text-[#6B6459] hover:text-[#1B2430] rounded-md hover:bg-[#EFECE6] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-[#1B2430] text-[#F7F5F0] font-sans text-xs font-semibold rounded-lg hover:bg-[#2C3848] transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#E8A58B]" />
                <span>Running Agent...</span>
              </>
            ) : (
              <>
                <span>Ask Agent</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Suggested Prompt Chips */}
      {!activeResult && !isLoading && (
        <div className="flex items-center gap-2 flex-wrap text-xs text-[#6B6459]">
          <span className="font-semibold text-[#1B2430] flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-[#3D5A57]" />
            Try asking:
          </span>
          {ROTATING_EXAMPLES.slice(0, 3).map((ex, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectExample(ex)}
              className="px-2.5 py-1 bg-[#FFFFFF] border border-[#D8D3C7] rounded-full text-xs text-[#1B2430] hover:border-[#1B2430] hover:bg-[#FAF9F5] transition-colors cursor-pointer"
            >
              "{ex}"
            </button>
          ))}
        </div>
      )}

      {/* Loading Skeleton State */}
      {isLoading && (
        <div className="bg-[#FFFFFF] border border-[#D8D3C7] rounded-lg p-5 animate-pulse space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#3D5A57]">
            <Bot className="w-4 h-4 animate-bounce" />
            <span>NVIDIA NIM Agent evaluating student profile & calling campus tools...</span>
          </div>
          <div className="h-4 bg-[#EFECE6] rounded w-3/4" />
          <div className="h-4 bg-[#EFECE6] rounded w-1/2" />
        </div>
      )}

      {/* Inline AI Agent Result Panel */}
      {activeResult && !isLoading && (
        <div className="bg-[#FFFFFF] border-2 border-[#3D5A57] rounded-lg p-5 shadow-sm space-y-4 animate-in fade-in-50">
          <div className="flex items-start justify-between gap-4 pb-3 border-b border-[#D8D3C7]">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#F0F5F4] text-[#3D5A57] border border-[#3D5A57]/30 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-semibold text-[#3D5A57]">
                    Query: "{activeResult.question}"
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] bg-[#1B2430] text-white px-2 py-0.5 rounded font-mono font-medium">
                    <Cpu className="w-3 h-3 text-[#E8A58B]" />
                    NVIDIA NIM Agent
                  </span>
                </div>
                <div className="text-sm font-sans text-[#1B2430] leading-relaxed font-medium whitespace-pre-wrap">
                  {activeResult.answer}
                </div>
              </div>
            </div>

            <button
              onClick={handleClearQuery}
              className="text-xs text-[#6B6459] hover:text-[#C65A2E] underline shrink-0 cursor-pointer"
            >
              Clear Results
            </button>
          </div>

          {/* Tool Calls Executed Badge Bar */}
          {activeResult.toolCallsExecuted && activeResult.toolCallsExecuted.length > 0 && (
            <div className="p-2.5 bg-[#F7F5F0] border border-[#D8D3C7] rounded-md text-xs space-y-1">
              <span className="font-semibold text-[#1B2430] flex items-center gap-1">
                <Wrench className="w-3.5 h-3.5 text-[#3D5A57]" />
                Backend Agent Tools Executed ({activeResult.toolCallsExecuted.length}):
              </span>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {activeResult.toolCallsExecuted.map((tc, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-[#FFFFFF] border border-[#D8D3C7] rounded text-[11px] font-mono text-[#1B2430]">
                    🔨 {tc.tool}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Matched Notice Cards */}
          {matchingNotices.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-semibold text-[#6B6459] uppercase tracking-wider">
                Relevant Campus Circulars ({matchingNotices.length})
              </h4>
              {matchingNotices.map((notice) => (
                <NoticeCard
                  key={notice.id}
                  notice={notice}
                  onCreateTask={onCreateTask}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
