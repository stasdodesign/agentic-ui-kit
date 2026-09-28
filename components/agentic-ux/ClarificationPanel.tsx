'use client';

import React, { useState } from 'react';
import { HelpCircle, Send, Sparkles, Check } from 'lucide-react';
import { ClarificationOption } from '@/types';

interface ClarificationPanelProps {
  message?: string;
  options?: ClarificationOption[];
  onSubmit: (answer: string) => void;
  className?: string;
}

export const ClarificationPanel: React.FC<ClarificationPanelProps> = ({
  message,
  options = [],
  onSubmit,
  className = '',
}) => {
  const [customText, setCustomText] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelectOption = (opt: ClarificationOption) => {
    setSelectedId(opt.id);
    onSubmit(opt.label);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customText.trim()) {
      onSubmit(customText.trim());
      setCustomText('');
    }
  };

  return (
    <div
      className={`w-full p-4 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/20 text-left space-y-3.5 shadow-sm ${className}`}
    >
      {/* Title */}
      <div className="flex items-center gap-2">
        <div className="p-1 rounded-md bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300">
          <HelpCircle className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-semibold text-amber-900 dark:text-amber-200">
            Ambiguity Detected: User Guidance Required
          </h4>
          <span className="text-[10px] text-amber-700/80 dark:text-amber-400">
            Select one of the suggested paths or type specific instructions
          </span>
        </div>
      </div>

      {/* Main question prompt */}
      <p className="text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed font-medium">
        {message || 'The agent needs additional contextual criteria to safely proceed:'}
      </p>

      {/* Suggested Options Chips */}
      {options.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Suggested Options:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectOption(opt)}
                className={`p-2.5 rounded-xl border text-left transition-all text-xs group relative flex flex-col justify-between ${
                  selectedId === opt.id
                    ? 'border-amber-500 bg-amber-100/70 dark:bg-amber-950 text-amber-900 dark:text-amber-100'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-amber-400 dark:hover:border-amber-600 text-zinc-800 dark:text-zinc-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                    {opt.label}
                  </span>
                  {opt.isRecommended && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/80 text-amber-800 dark:text-amber-300 font-semibold flex items-center gap-0.5">
                      <Sparkles className="w-2.5 h-2.5" />
                      Recommended
                    </span>
                  )}
                </div>
                {opt.hint && (
                  <span className="text-[11px] text-zinc-500 mt-1">{opt.hint}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Custom Clarification Input */}
      <form onSubmit={handleCustomSubmit} className="pt-1">
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Or type a custom specification..."
            className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
          <button
            type="submit"
            disabled={!customText.trim()}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white disabled:opacity-40 transition shadow-sm"
          >
            <span>Submit</span>
            <Send className="w-3 h-3" />
          </button>
        </div>
      </form>
    </div>
  );
};
