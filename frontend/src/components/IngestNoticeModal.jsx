import React, { useState } from 'react';
import { X, Sparkles, FileText, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { ingestNotice } from '../api/api';

export default function IngestNoticeModal({ isOpen, onClose, onNoticeIngested }) {
  const [rawText, setRawText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rawText.trim()) return;

    setIsAnalyzing(true);
    setResult(null);

    const ingested = await ingestNotice(rawText);
    setIsAnalyzing(false);
    setResult(ingested);

    if (onNoticeIngested) {
      onNoticeIngested(ingested);
    }
  };

  const handleReset = () => {
    setRawText('');
    setResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1B2430]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FFFFFF] border-2 border-[#1B2430] rounded-xl max-w-xl w-full p-6 shadow-2xl space-y-4 animate-in fade-in-50">
        <div className="flex items-center justify-between pb-3 border-b border-[#D8D3C7]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1B2430] text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#E8A58B]" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-[#1B2430]">AI Circular Analyzer & Ingest</h3>
              <p className="text-xs text-[#6B6459]">Powered by NVIDIA NIM Structured Extraction Engine</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-[#6B6459] hover:text-[#1B2430] hover:bg-[#EFECE6]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label htmlFor="rawNoticeText" className="block font-semibold text-[#1B2430] mb-1.5">
                Paste Raw Circular / Email Text
              </label>
              <textarea
                id="rawNoticeText"
                rows={6}
                required
                placeholder="Paste unformatted notice text (e.g. 'Training & Placement drive for Microsoft India... Last date 20th Sept...')"
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                className="w-full bg-[#F7F5F0] border border-[#D8D3C7] rounded-md p-3 text-xs text-[#1B2430] placeholder-[#6B6459] font-mono leading-relaxed focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B2430]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-[#D8D3C7] rounded-md text-xs font-semibold text-[#6B6459] hover:bg-[#EFECE6]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isAnalyzing || !rawText.trim()}
                className="px-5 py-2 bg-[#1B2430] text-[#F7F5F0] rounded-md text-xs font-semibold hover:bg-[#2C3848] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#E8A58B]" />
                    <span>Analyzing with NVIDIA NIM...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#E8A58B]" />
                    <span>Run AI Extraction & Ingest</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-[#F0F5F4] border border-[#3D5A57] text-[#3D5A57] rounded-md flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>Notice ingested and analyzed successfully! Added to your campus feed.</span>
            </div>

            <div className="p-4 bg-[#F7F5F0] border border-[#D8D3C7] rounded-md space-y-2">
              <h4 className="font-display text-sm font-bold text-[#1B2430]">{result.title}</h4>
              <p className="text-xs text-[#6B6459] font-medium"><strong className="text-[#1B2430]">Action:</strong> {result.requiredAction}</p>
              <div className="flex gap-2 text-[11px] font-mono text-[#1B2430] pt-1">
                <span className="px-2 py-0.5 bg-white border rounded">Category: {result.category}</span>
                <span className="px-2 py-0.5 bg-white border rounded">Urgency: {result.urgency}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={handleReset}
                className="px-4 py-2 border border-[#D8D3C7] rounded-md text-xs font-semibold text-[#1B2430] hover:bg-[#EFECE6]"
              >
                Ingest Another
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-[#1B2430] text-white rounded-md text-xs font-semibold hover:bg-[#2C3848]"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
