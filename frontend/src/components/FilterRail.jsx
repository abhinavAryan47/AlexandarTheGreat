import React from 'react';
import { Filter, Sparkles, Search, RotateCcw, X, SlidersHorizontal } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Categories' },
  { id: 'placement', label: 'Placements & Jobs' },
  { id: 'exam', label: 'Exams & Dues' },
  { id: 'scholarship', label: 'Scholarships' },
  { id: 'event', label: 'Events & Hackathons' },
  { id: 'club', label: 'Club Activities' },
  { id: 'administrative', label: 'Administrative Notices' },
];

const URGENCIES = [
  { id: 'all', label: 'All Urgency' },
  { id: 'urgent', label: 'Urgent Only' },
  { id: 'soon', label: 'Due Soon' },
  { id: 'later', label: 'On Track' },
];

export default function FilterRail({
  filters,
  onFilterChange,
  onResetFilters,
  isOpenMobile = false,
  onCloseMobile
}) {
  return (
    <aside
      className={`bg-[#FFFFFF] border border-[#D8D3C7] rounded-lg p-5 shadow-xs text-xs space-y-6 ${
        isOpenMobile
          ? 'fixed inset-x-4 top-20 z-50 shadow-2xl animate-in slide-in-from-top-4 max-h-[85vh] overflow-y-auto'
          : 'hidden md:block w-64 shrink-0'
      }`}
    >
      {/* Mobile Drawer Header */}
      {isOpenMobile && (
        <div className="flex items-center justify-between pb-3 border-b border-[#D8D3C7]">
          <div className="flex items-center gap-2 font-display font-semibold text-sm text-[#1B2430]">
            <SlidersHorizontal className="w-4 h-4 text-[#C65A2E]" />
            <span>Filter Campus Noticeboard</span>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1 rounded text-[#6B6459] hover:text-[#1B2430] hover:bg-[#EFECE6]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header & Reset Button */}
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-[#1B2430] flex items-center gap-1.5">
          <Filter className="w-4 h-4 text-[#3D5A57]" />
          <span>Filters</span>
        </h3>
        <button
          onClick={onResetFilters}
          className="text-[#6B6459] hover:text-[#C65A2E] text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Search Input Filter */}
      <div>
        <label htmlFor="searchQuery" className="block font-semibold text-[#1B2430] mb-1.5">
          Keyword Search
        </label>
        <div className="relative">
          <input
            id="searchQuery"
            type="text"
            placeholder="Search circulars, companies..."
            value={filters.searchQuery || ''}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            className="w-full bg-[#F7F5F0] border border-[#D8D3C7] rounded-md px-3 py-2 pl-8 text-xs text-[#1B2430] placeholder-[#6B6459] focus:bg-[#FFFFFF] transition-colors"
          />
          <Search className="w-3.5 h-3.5 text-[#6B6459] absolute left-2.5 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Relevance Toggle Switch */}
      <div className="p-3 bg-[#F0F5F4] border border-[#3D5A57]/30 rounded-md">
        <label className="flex items-start gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={!!filters.onlyRelevant}
            onChange={(e) => onFilterChange({ onlyRelevant: e.target.checked })}
            className="mt-0.5 rounded border-[#D8D3C7] text-[#3D5A57] focus:ring-[#3D5A57] cursor-pointer"
          />
          <div>
            <span className="block font-semibold text-[#1B2430] text-xs flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#3D5A57]" />
              Relevant to Me Only
            </span>
            <span className="text-[11px] text-[#6B6459] leading-tight block mt-0.5">
              Filters feed against your active branch, year & preference tags.
            </span>
          </div>
        </label>
      </div>

      {/* Urgency Filter Toggles */}
      <div>
        <label className="block font-semibold text-[#1B2430] mb-2">
          Time-Urgency
        </label>
        <div className="space-y-1">
          {URGENCIES.map((u) => (
            <label
              key={u.id}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded cursor-pointer transition-colors ${
                (filters.urgency || 'all') === u.id
                  ? 'bg-[#1B2430] text-white font-medium'
                  : 'hover:bg-[#F7F5F0] text-[#1B2430]'
              }`}
            >
              <input
                type="radio"
                name="urgencyFilter"
                checked={(filters.urgency || 'all') === u.id}
                onChange={() => onFilterChange({ urgency: u.id })}
                className="sr-only"
              />
              <span>{u.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Category Checkboxes */}
      <div>
        <label className="block font-semibold text-[#1B2430] mb-2">
          Category
        </label>
        <div className="space-y-1.5">
          {CATEGORIES.map((cat) => (
            <label
              key={cat.id}
              className="flex items-center gap-2 cursor-pointer text-[#1B2430] hover:text-[#C65A2E] transition-colors"
            >
              <input
                type="radio"
                name="categoryFilter"
                checked={(filters.category || 'all') === cat.id}
                onChange={() => onFilterChange({ category: cat.id })}
                className="rounded-full border-[#D8D3C7] text-[#C65A2E] focus:ring-[#C65A2E] cursor-pointer"
              />
              <span className={(filters.category || 'all') === cat.id ? 'font-semibold text-[#C65A2E]' : ''}>
                {cat.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
