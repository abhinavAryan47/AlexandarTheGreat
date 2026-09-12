import React from 'react';
import { FilterX, RotateCcw } from 'lucide-react';

export default function EmptyState({ onResetFilters, message }) {
  return (
    <div className="bg-[#FFFFFF] border border-[#D8D3C7] rounded-lg p-10 text-center flex flex-col items-center justify-center my-6">
      <div className="w-12 h-12 rounded-full bg-[#EFECE6] border border-[#D8D3C7] flex items-center justify-center text-[#6B6459] mb-3">
        <FilterX className="w-6 h-6" />
      </div>
      <h3 className="font-display text-lg font-semibold text-[#1B2430] mb-1">
        Noticeboard Clear
      </h3>
      <p className="text-sm text-[#6B6459] max-w-md mb-4">
        {message || "No notices match your current filters — try widening your category selection or clearing search parameters."}
      </p>
      {onResetFilters && (
        <button
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium bg-[#1B2430] text-[#F7F5F0] rounded-md hover:bg-[#2C3848] transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset All Filters
        </button>
      )}
    </div>
  );
}
