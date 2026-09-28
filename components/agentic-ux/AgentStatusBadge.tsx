'use client';

import React from 'react';
import {
  Circle,
  Headphones,
  Brain,
  ListOrdered,
  HelpCircle,
  Clock,
  Wrench,
  Cpu,
  ShieldAlert,
  Zap,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { AgentState } from '@/types';

interface AgentStatusBadgeProps {
  state: AgentState;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const AgentStatusBadge: React.FC<AgentStatusBadgeProps> = ({
  state,
  showIcon = true,
  size = 'md',
  className = '',
}) => {
  const configs: Record<
    AgentState,
    {
      label: string;
      bg: string;
      text: string;
      border: string;
      dot: string;
      ping?: boolean;
      icon: React.ComponentType<{ className?: string }>;
    }
  > = {
    idle: {
      label: 'Ready',
      bg: 'bg-zinc-100 dark:bg-zinc-800/80',
      text: 'text-zinc-700 dark:text-zinc-300',
      border: 'border-zinc-200 dark:border-zinc-750',
      dot: 'bg-zinc-400 dark:bg-zinc-500',
      icon: Circle,
    },
    listening: {
      label: 'Listening',
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-200/80 dark:border-blue-900/60',
      dot: 'bg-blue-500',
      ping: true,
      icon: Headphones,
    },
    thinking: {
      label: 'Thinking',
      bg: 'bg-indigo-50 dark:bg-indigo-950/40',
      text: 'text-indigo-700 dark:text-indigo-300',
      border: 'border-indigo-200/80 dark:border-indigo-900/60',
      dot: 'bg-indigo-500',
      ping: true,
      icon: Brain,
    },
    planning: {
      label: 'Planning Chain',
      bg: 'bg-purple-50 dark:bg-purple-950/40',
      text: 'text-purple-700 dark:text-purple-300',
      border: 'border-purple-200/80 dark:border-purple-900/60',
      dot: 'bg-purple-500',
      ping: false,
      icon: ListOrdered,
    },
    'asking-clarification': {
      label: 'Needs Context',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      text: 'text-amber-800 dark:text-amber-300',
      border: 'border-amber-200/80 dark:border-amber-900/60',
      dot: 'bg-amber-500',
      ping: false,
      icon: HelpCircle,
    },
    waiting: {
      label: 'Waiting Remote',
      bg: 'bg-sky-50 dark:bg-sky-950/40',
      text: 'text-sky-700 dark:text-sky-300',
      border: 'border-sky-200/80 dark:border-sky-900/60',
      dot: 'bg-sky-500',
      ping: true,
      icon: Clock,
    },
    'tool-calling': {
      label: 'Tool Executing',
      bg: 'bg-teal-50 dark:bg-teal-950/40',
      text: 'text-teal-700 dark:text-teal-300',
      border: 'border-teal-200/80 dark:border-teal-900/60',
      dot: 'bg-teal-500',
      ping: true,
      icon: Wrench,
    },
    processing: {
      label: 'Synthesizing',
      bg: 'bg-cyan-50 dark:bg-cyan-950/40',
      text: 'text-cyan-700 dark:text-cyan-300',
      border: 'border-cyan-200/80 dark:border-cyan-900/60',
      dot: 'bg-cyan-500',
      ping: false,
      icon: Cpu,
    },
    'asking-confirmation': {
      label: 'Human-in-the-Loop Gate',
      bg: 'bg-orange-50 dark:bg-orange-950/40',
      text: 'text-orange-800 dark:text-orange-300',
      border: 'border-orange-200/80 dark:border-orange-900/60',
      dot: 'bg-orange-500',
      ping: true,
      icon: ShieldAlert,
    },
    executing: {
      label: 'Committing State',
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-200/80 dark:border-blue-900/60',
      dot: 'bg-blue-600',
      ping: true,
      icon: Zap,
    },
    failed: {
      label: 'Terminated / Failed',
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      text: 'text-rose-700 dark:text-rose-300',
      border: 'border-rose-200/80 dark:border-rose-900/60',
      dot: 'bg-rose-500',
      ping: false,
      icon: AlertTriangle,
    },
    completed: {
      label: 'Resolved',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-200/80 dark:border-emerald-900/60',
      dot: 'bg-emerald-500',
      ping: false,
      icon: CheckCircle2,
    },
  };

  const config = configs[state] || configs.idle;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-2',
    lg: 'text-sm px-3.5 py-1.5 gap-2.5',
  }[size];

  const dotSize = size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2';

  return (
    <div
      className={`inline-flex items-center rounded-md font-medium border transition-colors duration-150 ${sizeClasses} ${config.bg} ${config.text} ${config.border} ${className}`}
      role="status"
      aria-label={`Agent state: ${config.label}`}
    >
      <span className={`relative flex ${dotSize} shrink-0`}>
        {config.ping && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.dot}`}
          />
        )}
        <span className={`relative inline-flex rounded-full ${dotSize} ${config.dot}`} />
      </span>

      {showIcon && <Icon className="w-3.5 h-3.5 shrink-0 opacity-80" />}

      <span className="whitespace-nowrap tracking-tight">{config.label}</span>
    </div>
  );
};
