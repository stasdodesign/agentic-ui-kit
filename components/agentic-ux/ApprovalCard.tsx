'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Edit3,
  Undo2,
  Copy,
  Check,
  ChevronDown,
  Info,
} from 'lucide-react';
import { ConfirmationData, RiskLevel } from '@/types';

interface ApprovalCardProps {
  data: ConfirmationData;
  onApprove: (modifiedPayload?: Record<string, unknown>) => void;
  onReject: (reason?: string) => void;
  className?: string;
}

export const ApprovalCard: React.FC<ApprovalCardProps> = ({
  data,
  onApprove,
  onReject,
  className = '',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPayloadText, setEditedPayloadText] = useState(
    JSON.stringify(data.payloadToExecute, null, 2)
  );
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [showPayload, setShowPayload] = useState(true);
  const [copied, setCopied] = useState(false);

  const riskStyles: Record<
    RiskLevel,
    {
      badgeBg: string;
      badgeText: string;
      badgeBorder: string;
      cardBorder: string;
      cardBg: string;
      accentLine: string;
    }
  > = {
    low: {
      badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60',
      badgeText: 'text-emerald-700 dark:text-emerald-300',
      badgeBorder: 'border-emerald-200 dark:border-emerald-800',
      cardBorder: 'border-emerald-200 dark:border-emerald-900/60',
      cardBg: 'bg-emerald-50/20 dark:bg-emerald-950/10',
      accentLine: 'bg-emerald-500',
    },
    medium: {
      badgeBg: 'bg-amber-50 dark:bg-amber-950/60',
      badgeText: 'text-amber-800 dark:text-amber-300',
      badgeBorder: 'border-amber-200 dark:border-amber-800',
      cardBorder: 'border-amber-200 dark:border-amber-900/60',
      cardBg: 'bg-amber-50/20 dark:bg-amber-950/10',
      accentLine: 'bg-amber-500',
    },
    high: {
      badgeBg: 'bg-orange-50 dark:bg-orange-950/60',
      badgeText: 'text-orange-800 dark:text-orange-300',
      badgeBorder: 'border-orange-200 dark:border-orange-800',
      cardBorder: 'border-orange-200 dark:border-orange-900/60',
      cardBg: 'bg-orange-50/20 dark:bg-orange-950/10',
      accentLine: 'bg-orange-500',
    },
    critical: {
      badgeBg: 'bg-rose-50 dark:bg-rose-950/60',
      badgeText: 'text-rose-700 dark:text-rose-300',
      badgeBorder: 'border-rose-200 dark:border-rose-800',
      cardBorder: 'border-rose-300 dark:border-rose-900/80',
      cardBg: 'bg-rose-50/30 dark:bg-rose-950/20',
      accentLine: 'bg-rose-500',
    },
  };

  const style = riskStyles[data.riskLevel] || riskStyles.high;

  const handleCopy = () => {
    navigator.clipboard.writeText(editedPayloadText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleAuthorize = () => {
    if (isEditing) {
      try {
        const parsed = JSON.parse(editedPayloadText);
        setJsonError(null);
        onApprove(parsed);
      } catch (err) {
        setJsonError(
          err instanceof Error ? err.message : 'Invalid JSON format in payload editor'
        );
      }
    } else {
      onApprove(data.payloadToExecute);
    }
  };

  return (
    <div
      className={`rounded-2xl border ${style.cardBorder} ${style.cardBg} p-5 text-left w-full space-y-4 shadow-sm transition-all duration-150 ${className}`}
    >
      {/* Top Banner: Action Title & Risk Level */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase border shrink-0 ${style.badgeBg} ${style.badgeText} ${style.badgeBorder}`}
            >
              <ShieldAlert className="w-3 h-3 shrink-0" />
              <span>{data.riskLevel} Risk Gate</span>
            </span>

            {data.reversible ? (
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium shrink-0">
                <Undo2 className="w-3 h-3 shrink-0" />
                <span>Reversible Action</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] text-rose-700 dark:text-rose-400 font-medium shrink-0">
                <AlertTriangle className="w-3 h-3 shrink-0" />
                <span>Irreversible Mutation</span>
              </span>
            )}
          </div>

          <h4 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight break-words">
            {data.actionTitle}
          </h4>
        </div>
      </div>

      {/* Description & Consequence Context */}
      <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
        {data.details}
      </p>

      {/* Consequences list if provided */}
      {data.consequences && data.consequences.length > 0 && (
        <div className="space-y-1.5 p-3 rounded-lg bg-zinc-100/70 dark:bg-zinc-900/60 border border-zinc-200/70 dark:border-zinc-800 text-[11px]">
          <span className="font-semibold text-zinc-800 dark:text-zinc-200 block mb-1">
            Impact Analysis:
          </span>
          {data.consequences.map((consequence, idx) => (
            <div key={idx} className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
              <span className="text-rose-500 font-bold">•</span>
              <span>{consequence}</span>
            </div>
          ))}
        </div>
      )}

      {/* Target Resource Metadata */}
      {data.affectedResource && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 text-xs text-zinc-600 dark:text-zinc-400 min-w-0">
          <span className="font-medium text-zinc-500 dark:text-zinc-400 shrink-0">Target Resource:</span>
          <span className="font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-[11px] text-zinc-800 dark:text-zinc-200 break-all leading-relaxed">
            {data.affectedResource}
          </span>
        </div>
      )}

      {/* Payload Inspection & Optional Editing */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => setShowPayload(!showPayload)}
            className="flex items-center gap-1 font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
          >
            <span>Execution Payload</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-150 ${
                showPayload ? 'rotate-180' : ''
              }`}
            />
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-1 text-[11px] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition"
            >
              <Edit3 className="w-3 h-3" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Payload'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 text-[11px] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-500" />
                  <span className="text-emerald-500">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {showPayload && (
          <div>
            {isEditing ? (
              <div className="space-y-1">
                <textarea
                  value={editedPayloadText}
                  onChange={(e) => {
                    setEditedPayloadText(e.target.value);
                    setJsonError(null);
                  }}
                  rows={5}
                  className="w-full p-2.5 rounded-lg bg-zinc-950 font-mono text-[11px] text-emerald-400 border border-zinc-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-inner"
                  spellCheck={false}
                />
                {jsonError && (
                  <p className="text-[11px] text-rose-500 font-mono">{jsonError}</p>
                )}
                <span className="text-[10px] text-zinc-500">
                  Editing payload directly alters transaction arguments.
                </span>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-zinc-950 font-mono text-[11px] text-emerald-400/90 overflow-x-auto max-h-36 border border-zinc-800 shadow-inner">
                <pre>{editedPayloadText}</pre>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Human Actions Bar */}
      <div className="flex items-center gap-2 pt-2 border-t border-zinc-200/80 dark:border-zinc-800">
        <button
          type="button"
          onClick={handleAuthorize}
          className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 font-medium text-xs shadow-sm transition active:scale-[0.99]"
        >
          <CheckCircle className="w-3.5 h-3.5" />
          <span>{isEditing ? 'Authorize Modified Payload' : 'Authorize Action'}</span>
        </button>

        <button
          type="button"
          onClick={() => onReject('User declined execution in HITL gate')}
          className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 font-medium text-xs transition"
        >
          <span className="flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5 text-rose-500" />
            <span>Reject</span>
          </span>
        </button>
      </div>
    </div>
  );
};
