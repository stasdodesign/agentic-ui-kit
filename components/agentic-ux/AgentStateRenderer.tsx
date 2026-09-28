'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bot,
  Sparkles,
  Clock,
  Shield,
  Layers,
  Activity,
  CheckCircle,
  Database,
  ArrowRight,
  Terminal,
} from 'lucide-react';
import { AgentState, AgentStateRendererProps, STATE_METADATA_REGISTRY } from '@/types';
import { AgentStatusBadge } from './AgentStatusBadge';
import { ToolCallWidget } from './ToolCallWidget';
import { ApprovalCard } from './ApprovalCard';
import { ReasoningAccordion } from './ReasoningAccordion';
import { ErrorRecoveryPanel } from './ErrorRecoveryPanel';
import { ClarificationPanel } from './ClarificationPanel';
import { ListeningVisualizer } from './ListeningVisualizer';
import { CompletedSummary } from './CompletedSummary';

export const AgentStateRenderer: React.FC<AgentStateRendererProps> = ({
  state,
  payload,
  onAction,
  className = '',
  compact = false,
  agentName = 'Atlas Agent Engine',
  agentRole = 'Autonomous Workflow Orchestrator',
  showHeader = true,
  showMetrics = true,
}) => {
  const meta = STATE_METADATA_REGISTRY[state] || STATE_METADATA_REGISTRY.idle;

  return (
    <div
      className={`w-full max-w-2xl mx-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm transition-all duration-200 overflow-hidden ${className}`}
      data-agent-state={state}
    >
      {/* 1. Header Bar: Agent Identity + Status Badge + Execution Metrics */}
      {showHeader && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b border-zinc-100 dark:border-zinc-850 bg-zinc-50/70 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-800 text-white dark:text-zinc-200 flex items-center justify-center font-mono text-xs font-semibold shadow-xs shrink-0">
              <Bot className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-left min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 leading-none">
                  {agentName}
                </span>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
                  v2.4
                </span>
              </div>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block leading-tight mt-0.5 break-words">
                {agentRole}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 shrink-0 pt-1 sm:pt-0 border-t border-zinc-100 dark:border-zinc-850/60 sm:border-0">
            {showMetrics && payload?.summary?.metrics?.executionTimeMs !== undefined && (
              <span className="inline-flex items-center gap-1 font-mono text-[11px] text-zinc-400 dark:text-zinc-500 tabular-nums">
                <Clock className="w-3 h-3 text-zinc-400" />
                <span>{payload.summary.metrics.executionTimeMs}ms</span>
              </span>
            )}
            <AgentStatusBadge state={state} size="md" />
          </div>
        </div>
      )}

      {/* 2. Main Animated State Canvas */}
      <div className="p-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={state}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="space-y-4"
          >
            {/* STATE 1: IDLE / READY */}
            {state === 'idle' && (
              <div className="text-center py-7 space-y-3">
                <div className="w-10 h-10 mx-auto rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-400">
                  <Activity className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    Agent Ready & Listening
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                    {payload?.message ||
                      'Standing by for trigger condition, webhook event, or user voice/text prompt.'}
                  </p>
                </div>
                {onAction && (
                  <button
                    type="button"
                    onClick={() => onAction({ type: 'START_LISTEN' })}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition"
                  >
                    <span>Trigger Listening Input</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}

            {/* STATE 2: LISTENING */}
            {state === 'listening' && (
              <ListeningVisualizer
                transcript={payload?.inputTranscript || payload?.message}
                onStopListening={
                  onAction ? () => onAction({ type: 'STOP_LISTEN' }) : undefined
                }
              />
            )}

            {/* STATE 3: THINKING / INTENT EXTRACTION */}
            {state === 'thinking' && (
              <div className="text-left space-y-3.5 p-4 rounded-xl border border-indigo-100 dark:border-indigo-950/60 bg-indigo-50/25 dark:bg-indigo-950/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-xs font-semibold text-indigo-900 dark:text-indigo-200">
                      Cognitive Intent Analysis
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400">
                    Evaluating Guardrails
                  </span>
                </div>

                <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {payload?.message ||
                    'Parsing multimodal prompt, resolving named entities, and querying model context cache.'}
                </p>

                {payload?.intent && (
                  <div className="p-2.5 rounded-lg bg-white/80 dark:bg-zinc-900/60 border border-indigo-100 dark:border-indigo-950 text-xs">
                    <span className="font-semibold text-zinc-500 text-[10px] uppercase tracking-wide block mb-0.5">
                      Extracted Intent:
                    </span>
                    <span className="font-mono text-indigo-950 dark:text-indigo-200">
                      {payload.intent}
                    </span>
                  </div>
                )}

                {/* Micro-animated shimmer bar */}
                <div className="h-1.5 w-full bg-indigo-100 dark:bg-zinc-900 overflow-hidden rounded-full">
                  <motion.div
                    className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.3,
                      ease: 'easeInOut',
                    }}
                  />
                </div>
              </div>
            )}

            {/* STATE 4: PLANNING */}
            {state === 'planning' && (
              <div className="space-y-3">
                {payload?.message && (
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 text-left">
                    {payload.message}
                  </p>
                )}
                {payload?.plan ? (
                  <ReasoningAccordion steps={payload.plan} />
                ) : (
                  <div className="text-center py-4 text-xs text-zinc-400">
                    Synthesizing multi-step plan...
                  </div>
                )}
              </div>
            )}

            {/* STATE 5: ASKING CLARIFICATION */}
            {state === 'asking-clarification' && (
              <ClarificationPanel
                message={payload?.message}
                options={payload?.clarificationOptions}
                onSubmit={(answer) =>
                  onAction?.({ type: 'SUBMIT_CLARIFICATION', answer })
                }
              />
            )}

            {/* STATE 6: WAITING */}
            {state === 'waiting' && (
              <div className="text-center py-6 space-y-3 rounded-xl border border-sky-100 dark:border-sky-950/60 bg-sky-50/20 dark:bg-sky-950/20 p-4">
                <div className="relative w-8 h-8 mx-auto flex items-center justify-center">
                  <span className="w-8 h-8 rounded-full border-2 border-sky-500 border-t-transparent animate-spin" />
                  <Clock className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 absolute" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-sky-900 dark:text-sky-200">
                    Waiting for Remote Downstream Lock
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto">
                    {payload?.message ||
                      'Holding active session for external webhook callback or rate-limit release SLA...'}
                  </p>
                </div>
                <span className="inline-block text-[10px] font-mono text-zinc-400">
                  Connection alive · Heartbeat OK
                </span>
              </div>
            )}

            {/* STATE 7: TOOL CALLING */}
            {state === 'tool-calling' && (
              <div className="space-y-3 text-left">
                {payload?.message && (
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    {payload.message}
                  </p>
                )}
                {payload?.tool ? (
                  <ToolCallWidget tool={payload.tool} defaultExpanded={true} />
                ) : (
                  <div className="p-3 text-xs text-zinc-400">No active tool payload data</div>
                )}
              </div>
            )}

            {/* STATE 8: PROCESSING */}
            {state === 'processing' && (
              <div className="p-4 rounded-xl border border-cyan-200/80 dark:border-cyan-900/60 bg-cyan-50/30 dark:bg-cyan-950/20 text-left space-y-3">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
                  </span>
                  <span className="text-xs font-semibold text-cyan-900 dark:text-cyan-200">
                    Synthesizing Machine Tool Delta
                  </span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {payload?.message ||
                    'Tool execution completed successfully. Aggregating output invariants and drafting contextual response.'}
                </p>
                <div className="h-1 w-full bg-cyan-100 dark:bg-zinc-900 overflow-hidden rounded-full">
                  <motion.div
                    className="h-full bg-cyan-500 rounded-full"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.1,
                      ease: 'easeInOut',
                    }}
                  />
                </div>
              </div>
            )}

            {/* STATE 9: ASKING CONFIRMATION (HITL) */}
            {state === 'asking-confirmation' && (
              <div>
                {payload?.confirmation ? (
                  <ApprovalCard
                    data={payload.confirmation}
                    onApprove={(modifiedPayload) =>
                      onAction?.({ type: 'CONFIRM_ACTION', payload: modifiedPayload })
                    }
                    onReject={(reason) =>
                      onAction?.({ type: 'REJECT_ACTION', reason })
                    }
                  />
                ) : (
                  <div className="text-xs text-zinc-400">
                    No confirmation schema provided.
                  </div>
                )}
              </div>
            )}

            {/* STATE 10: EXECUTING */}
            {state === 'executing' && (
              <div className="p-5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/30 dark:bg-blue-950/20 text-center space-y-3.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 font-mono text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  <span>Committing Transactional Mutation...</span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto">
                  {payload?.message ||
                    'State mutation is executing against primary endpoints. Do not refresh, disconnect, or terminate active session.'}
                </p>
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-blue-600 rounded-full"
                    animate={{ width: ['20%', '85%', '95%'] }}
                    transition={{ duration: 3, ease: 'easeOut' }}
                  />
                </div>
              </div>
            )}

            {/* STATE 11: FAILED / ERROR */}
            {state === 'failed' && (
              <ErrorRecoveryPanel
                error={payload?.error}
                onRetry={onAction ? () => onAction({ type: 'RETRY' }) : undefined}
                onAbort={onAction ? () => onAction({ type: 'ABORT' }) : undefined}
              />
            )}

            {/* STATE 12: COMPLETED */}
            {state === 'completed' && (
              <CompletedSummary
                summary={payload?.summary}
                onUndo={onAction ? () => onAction({ type: 'UNDO' }) : undefined}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 3. Subtle Footer Status Note */}
      <div className="px-4 sm:px-5 py-2.5 bg-zinc-50/50 dark:bg-zinc-900/30 border-t border-zinc-100 dark:border-zinc-850 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-500">
        <span className="flex items-start sm:items-center gap-1.5 leading-tight">
          <Shield className="w-3 h-3 text-zinc-400 shrink-0 mt-0.5 sm:mt-0" />
          <span>Agentic UX Principle: {meta.uxObjective}</span>
        </span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 shrink-0">
          Phase: {meta.phase}
        </span>
      </div>
    </div>
  );
};

export default AgentStateRenderer;
