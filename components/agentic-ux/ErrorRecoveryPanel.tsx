'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  RefreshCw,
  XOctagon,
  KeyRound,
  FileEdit,
  ShieldAlert,
  ChevronDown,
} from 'lucide-react';
import { AgentErrorData } from '@/types';

interface ErrorRecoveryPanelProps {
  error?: AgentErrorData;
  onRetry?: () => void;
  onAbort?: () => void;
  className?: string;
}

export const ErrorRecoveryPanel: React.FC<ErrorRecoveryPanelProps> = ({
  error,
  onRetry,
  onAbort,
  className = '',
}) => {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = () => {
    setIsRetrying(true);
    if (onRetry) {
      setTimeout(() => {
        onRetry();
        setIsRetrying(false);
      }, 500);
    }
  };

  const errorCode = error?.code || 'ERR_AGENT_EXECUTION_FAILURE';
  const errorMessage =
    error?.message ||
    'The upstream tool or model returned an unexpected exception during state execution.';

  return (
    <div
      className={`w-full p-4 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 text-left space-y-3.5 shadow-sm ${className}`}
    >
      {/* Title & Code */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-rose-900 dark:text-rose-200 tracking-tight">
              Agent Execution Interrupted
            </h4>
            <span className="font-mono text-[10px] text-rose-700 dark:text-rose-400">
              {errorCode}
            </span>
          </div>
        </div>

        {error?.recoverable ? (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
            Recoverable
          </span>
        ) : (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
            Fatal Halt
          </span>
        )}
      </div>

      {/* Main explanation */}
      <p className="text-xs text-rose-800/90 dark:text-rose-300/90 leading-relaxed">
        {errorMessage}
      </p>

      {/* Technical details disclosure */}
      {error?.details && (
        <div className="text-[11px]">
          <button
            type="button"
            onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
            className="flex items-center gap-1 text-rose-600 dark:text-rose-400 hover:underline"
          >
            <span>{showTechnicalDetails ? 'Hide Stack Trace' : 'View Diagnostic Info'}</span>
            <ChevronDown
              className={`w-3 h-3 transition-transform ${
                showTechnicalDetails ? 'rotate-180' : ''
              }`}
            />
          </button>
          {showTechnicalDetails && (
            <pre className="mt-1.5 p-2 rounded bg-zinc-950 text-rose-400 text-[10px] font-mono overflow-x-auto">
              {error.details}
            </pre>
          )}
        </div>
      )}

      {/* State Safety Notice */}
      <div className="p-2 rounded-lg bg-white/70 dark:bg-zinc-900/60 border border-rose-100 dark:border-rose-950 text-[11px] text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
        <ShieldAlert className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
        <span>Atomic guarantee: No partial state was committed to production.</span>
      </div>

      {/* Recovery Actions */}
      <div className="flex flex-wrap gap-2 pt-1 border-t border-rose-200/60 dark:border-rose-900/40">
        {error?.recoverable !== false && (
          <button
            type="button"
            onClick={handleRetry}
            disabled={isRetrying}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-medium rounded-lg transition shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${isRetrying ? 'animate-spin' : ''}`} />
            <span>{isRetrying ? 'Retrying...' : 'Retry Step'}</span>
          </button>
        )}

        <button
          type="button"
          onClick={onAbort}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-medium rounded-lg transition"
        >
          <XOctagon className="w-3 h-3 text-zinc-500" />
          <span>Abort & Reset</span>
        </button>
      </div>
    </div>
  );
};
