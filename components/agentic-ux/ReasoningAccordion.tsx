'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  Clock,
  Loader2,
  XCircle,
  ChevronDown,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { PlanStep } from '@/types';

interface ReasoningAccordionProps {
  steps: PlanStep[];
  className?: string;
  allowToggleAll?: boolean;
}

export const ReasoningAccordion: React.FC<ReasoningAccordionProps> = ({
  steps,
  className = '',
}) => {
  const [expandedStepId, setExpandedStepId] = useState<string | null>(null);

  const completedCount = steps.filter((s) => s.status === 'completed').length;
  const inProgressStep = steps.find((s) => s.status === 'in_progress');

  const toggleStep = (id: string) => {
    setExpandedStepId(expandedStepId === id ? null : id);
  };

  return (
    <div className={`space-y-2.5 w-full text-left ${className}`}>
      {/* Header with summary count */}
      <div className="flex items-center justify-between text-xs pb-1">
        <span className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          <span>Reasoning Sequence</span>
        </span>
        <span className="font-mono text-[11px] text-zinc-500 tabular-nums">
          {completedCount}/{steps.length} steps completed
        </span>
      </div>

      {/* Steps List */}
      <div className="space-y-1.5">
        {steps.map((step, idx) => {
          const isExpanded = expandedStepId === step.id;
          const isCurrent = step.status === 'in_progress';

          return (
            <div
              key={step.id || idx}
              className={`rounded-xl border transition-colors duration-150 overflow-hidden text-xs ${
                isCurrent
                  ? 'border-indigo-300 dark:border-indigo-900/80 bg-indigo-50/20 dark:bg-indigo-950/20'
                  : step.status === 'completed'
                  ? 'border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/30'
                  : step.status === 'failed'
                  ? 'border-rose-200 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/10'
                  : 'border-zinc-200/60 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-900/20 opacity-70'
              }`}
            >
              {/* Step Summary Row */}
              <div
                onClick={() => step.detail && toggleStep(step.id)}
                className={`flex items-center justify-between p-2.5 ${
                  step.detail ? 'cursor-pointer select-none' : ''
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Status Indicator Icon */}
                  <div className="shrink-0">
                    {step.status === 'completed' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    )}
                    {step.status === 'in_progress' && (
                      <Loader2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-spin" />
                    )}
                    {step.status === 'pending' && (
                      <div className="w-4 h-4 flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                      </div>
                    )}
                    {step.status === 'failed' && (
                      <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    )}
                  </div>

                  {/* Step Label */}
                  <span
                    className={`font-medium tracking-tight truncate ${
                      step.status === 'completed'
                        ? 'line-through text-zinc-400 dark:text-zinc-500'
                        : isCurrent
                        ? 'text-indigo-900 dark:text-indigo-200 font-semibold'
                        : 'text-zinc-800 dark:text-zinc-200'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>

                {/* Right metadata: duration & expand chevron */}
                <div className="flex items-center gap-2 shrink-0">
                  {step.toolTarget && (
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                      {step.toolTarget}
                    </span>
                  )}

                  {step.durationMs !== undefined && (
                    <span className="font-mono text-[10px] text-zinc-400 tabular-nums">
                      {step.durationMs}ms
                    </span>
                  )}

                  {step.detail && (
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-150 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                </div>
              </div>

              {/* Collapsible detail */}
              <AnimatePresence>
                {isExpanded && step.detail && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.15 }}
                    className="px-3 pb-2.5 pt-1 text-[11px] text-zinc-600 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/40"
                  >
                    <p className="leading-relaxed">{step.detail}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};
