'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wrench,
  ChevronDown,
  Copy,
  Check,
  Server,
  ArrowRight,
  Database,
  ExternalLink,
} from 'lucide-react';
import { ToolCallData } from '@/types';

interface ToolCallWidgetProps {
  tool: ToolCallData;
  className?: string;
  defaultExpanded?: boolean;
}

export const ToolCallWidget: React.FC<ToolCallWidgetProps> = ({
  tool,
  className = '',
  defaultExpanded = false,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'params' | 'output'>('params');

  const copyPayload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const dataToCopy =
      activeTab === 'params'
        ? JSON.stringify(tool.parameters, null, 2)
        : typeof tool.output === 'string'
        ? tool.output
        : JSON.stringify(tool.output, null, 2);

    navigator.clipboard.writeText(dataToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const protocolStyles: Record<string, { bg: string; text: string; border: string }> = {
    MCP: {
      bg: 'bg-teal-50 dark:bg-teal-950/60',
      text: 'text-teal-700 dark:text-teal-300',
      border: 'border-teal-200 dark:border-teal-800',
    },
    REST: {
      bg: 'bg-blue-50 dark:bg-blue-950/60',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-200 dark:border-blue-800',
    },
    GraphQL: {
      bg: 'bg-pink-50 dark:bg-pink-950/60',
      text: 'text-pink-700 dark:text-pink-300',
      border: 'border-pink-200 dark:border-pink-800',
    },
    DB: {
      bg: 'bg-amber-50 dark:bg-amber-950/60',
      text: 'text-amber-700 dark:text-amber-300',
      border: 'border-amber-200 dark:border-amber-800',
    },
    CLI: {
      bg: 'bg-zinc-100 dark:bg-zinc-800',
      text: 'text-zinc-700 dark:text-zinc-300',
      border: 'border-zinc-200 dark:border-zinc-700',
    },
  };

  const protocol = tool.serverOrProtocol || 'MCP';
  const protoStyle = protocolStyles[protocol] || protocolStyles.MCP;

  return (
    <div
      className={`w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-sm overflow-hidden text-xs ${className}`}
    >
      {/* Header Bar */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between p-3 cursor-pointer select-none bg-zinc-50/70 dark:bg-zinc-900/90 hover:bg-zinc-100/60 dark:hover:bg-zinc-850 transition-colors"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1 rounded-md bg-teal-100/60 dark:bg-teal-950 text-teal-600 dark:text-teal-400">
            {protocol === 'DB' ? (
              <Database className="w-3.5 h-3.5" />
            ) : (
              <Wrench className="w-3.5 h-3.5" />
            )}
          </div>

          <span
            className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold tracking-wide border uppercase ${protoStyle.bg} ${protoStyle.text} ${protoStyle.border}`}
          >
            {protocol}
          </span>

          <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100 truncate">
            {tool.toolName}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {tool.executionTimeMs !== undefined && (
            <span className="font-mono text-[11px] text-zinc-400 tabular-nums">
              {tool.executionTimeMs}ms
            </span>
          )}

          <div className="flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200">
            <span>{expanded ? 'Hide' : 'Inspect'}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                expanded ? 'rotate-180' : ''
              }`}
            />
          </div>
        </div>
      </div>

      {/* Expanded Inspector */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="overflow-hidden border-t border-zinc-200 dark:border-zinc-800/80 bg-zinc-950 text-zinc-300 font-mono text-[11px]"
          >
            {/* Inspector Sub-Nav */}
            <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900/90 border-b border-zinc-800">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('params')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                    activeTab === 'params'
                      ? 'bg-zinc-800 text-teal-300'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Parameters
                </button>
                {tool.output && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('output')}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                      activeTab === 'output'
                        ? 'bg-zinc-800 text-teal-300'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Result Output
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={copyPayload}
                className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
                title="Copy JSON payload"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy JSON</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Output */}
            <div className="p-3 overflow-x-auto max-h-56">
              {activeTab === 'params' ? (
                <pre className="text-emerald-300/90 leading-relaxed font-mono">
                  {JSON.stringify(tool.parameters, null, 2)}
                </pre>
              ) : (
                <pre className="text-cyan-300/90 leading-relaxed font-mono">
                  {typeof tool.output === 'string'
                    ? tool.output
                    : JSON.stringify(tool.output, null, 2)}
                </pre>
              )}
            </div>

            {tool.endpoint && (
              <div className="px-3 py-1.5 border-t border-zinc-800/80 bg-zinc-900/50 flex flex-wrap items-center justify-between gap-1.5 text-[10px] text-zinc-500">
                <span className="flex items-center gap-1 min-w-0">
                  <Server className="w-3 h-3 shrink-0" />
                  <span className="break-all">Target: {tool.endpoint}</span>
                </span>
                <span className="text-teal-400/80 flex items-center gap-0.5 shrink-0">
                  Live MCP Dispatch <ArrowRight className="w-2.5 h-2.5" />
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
