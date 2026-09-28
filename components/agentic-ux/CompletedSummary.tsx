'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Undo2,
  Clock,
  Coins,
  Cpu,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { AgentSummary } from '@/types';

interface CompletedSummaryProps {
  summary?: AgentSummary;
  onUndo?: () => void;
  className?: string;
}

export const CompletedSummary: React.FC<CompletedSummaryProps> = ({
  summary,
  onUndo,
  className = '',
}) => {
  const [undoTriggered, setUndoTriggered] = useState(false);

  const handleUndo = () => {
    setUndoTriggered(true);
    if (onUndo) {
      setTimeout(() => {
        onUndo();
      }, 400);
    }
  };

  const metrics = summary?.metrics;
  const entities = summary?.affectedEntities || [];

  return (
    <div
      className={`w-full p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/20 text-left space-y-4 shadow-sm ${className}`}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-emerald-900 dark:text-emerald-100">
              Objective Finalized & Invariants Verified
            </h4>
            <span className="text-[10px] text-emerald-700/80 dark:text-emerald-400">
              Transaction committed with zero schema integrity violations
            </span>
          </div>
        </div>

        {summary?.rollbackAvailable !== false && onUndo && (
          <button
            type="button"
            onClick={handleUndo}
            disabled={undoTriggered}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition shadow-xs disabled:opacity-50"
          >
            {undoTriggered ? (
              <>
                <Check className="w-3 h-3 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Reverting...</span>
              </>
            ) : (
              <>
                <Undo2 className="w-3 h-3 text-zinc-500" />
                <span>Undo Action</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Result summary prose if present */}
      {summary?.resultSummary && (
        <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
          {summary.resultSummary}
        </p>
      )}

      {/* Metrics Row (Tabular Figures) */}
      {metrics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          {metrics.executionTimeMs !== undefined && (
            <div className="p-2 rounded-lg bg-white/70 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800">
              <span className="text-[10px] text-zinc-500 block">Duration</span>
              <span className="font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
                {metrics.executionTimeMs}ms
              </span>
            </div>
          )}

          {metrics.tokensUsed !== undefined && (
            <div className="p-2 rounded-lg bg-white/70 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800">
              <span className="text-[10px] text-zinc-500 block">Tokens</span>
              <span className="font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
                {metrics.tokensUsed.toLocaleString()}
              </span>
            </div>
          )}

          {metrics.stepsCount !== undefined && (
            <div className="p-2 rounded-lg bg-white/70 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800">
              <span className="text-[10px] text-zinc-500 block">Steps</span>
              <span className="font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
                {metrics.stepsCount} completed
              </span>
            </div>
          )}

          {metrics.toolCallsCount !== undefined && (
            <div className="p-2 rounded-lg bg-white/70 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800">
              <span className="text-[10px] text-zinc-500 block">Tools Executed</span>
              <span className="font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
                {metrics.toolCallsCount} calls
              </span>
            </div>
          )}
        </div>
      )}

      {/* Mutated Resources / Affected Entities */}
      {entities.length > 0 && (
        <div className="space-y-1.5 p-3 rounded-xl bg-white/80 dark:bg-zinc-900/60 border border-emerald-200/60 dark:border-zinc-800/80 text-xs">
          <span className="font-semibold text-zinc-800 dark:text-zinc-200 text-[11px] block">
            Mutated System Entities:
          </span>
          <div className="space-y-1">
            {entities.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 font-mono text-[11px] text-zinc-600 dark:text-zinc-400"
              >
                <span className="text-emerald-500 font-bold">•</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
