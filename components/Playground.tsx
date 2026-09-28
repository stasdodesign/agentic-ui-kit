'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Layers,
  Code2,
  Copy,
  Check,
  Moon,
  Sun,
  ShieldCheck,
  HelpCircle,
  Activity,
  History,
  Info,
  ChevronRight,
  Database,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import {
  AgentState,
  AgentStatePayload,
  AgentAction,
  STATE_METADATA_REGISTRY,
  AgentStatePhase,
} from '@/types';
import { AgentStateRenderer } from './agentic-ux/AgentStateRenderer';
import { SCENARIOS } from './mockData';

interface ActionLogEntry {
  id: string;
  timestamp: string;
  action: AgentAction;
  resultingState?: AgentState;
}

const SIMULATION_FLOW: AgentState[] = [
  'idle',
  'listening',
  'thinking',
  'planning',
  'tool-calling',
  'processing',
  'asking-confirmation',
  'executing',
  'completed',
];

export const AgentPlayground: React.FC = () => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('db-migration');
  const [activeState, setActiveState] = useState<AgentState>('asking-confirmation');
  const [customPayloads, setCustomPayloads] = useState<Record<string, AgentStatePayload>>({});
  const [isEditingPayload, setIsEditingPayload] = useState(false);
  const [editedPayloadText, setEditedPayloadText] = useState<string | null>(null);
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Workflow Auto-Run Simulation
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationSpeed] = useState<number>(2000);
  const simulationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Action History Log
  const [actionLogs, setActionLogs] = useState<ActionLogEntry[]>([]);
  const [copiedCode, setCopiedCode] = useState(false);

  // Active View Tab: 'playground' | 'matrix' | 'fsm-docs'
  const [activeTab, setActiveTab] = useState<'playground' | 'matrix' | 'fsm-docs'>('playground');

  // Dark mode state with lazy initialization
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const currentScenario =
    SCENARIOS.find((s) => s.id === selectedScenarioId) || SCENARIOS[0];

  // Current state payload (either custom edited or scenario default)
  const currentPayload: AgentStatePayload =
    customPayloads[`${selectedScenarioId}_${activeState}`] ||
    currentScenario.states[activeState] ||
    {};

  const payloadText =
    editedPayloadText !== null
      ? editedPayloadText
      : JSON.stringify(currentPayload, null, 2);

  // Handle Action from AgentStateRenderer
  const handleAction = (action: AgentAction) => {
    let nextState: AgentState | undefined;

    switch (action.type) {
      case 'CONFIRM_ACTION':
        nextState = 'executing';
        break;
      case 'REJECT_ACTION':
        nextState = 'idle';
        break;
      case 'SUBMIT_CLARIFICATION':
        nextState = 'planning';
        break;
      case 'RETRY':
        nextState = 'thinking';
        break;
      case 'UNDO':
        nextState = 'idle';
        break;
      case 'ABORT':
        nextState = 'idle';
        break;
      case 'START_LISTEN':
        nextState = 'listening';
        break;
      case 'STOP_LISTEN':
        nextState = 'thinking';
        break;
      case 'RESET':
        nextState = 'idle';
        break;
      default:
        break;
    }

    const logEntry: ActionLogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      action,
      resultingState: nextState,
    };

    setActionLogs((prev) => [logEntry, ...prev.slice(0, 19)]);

    if (nextState) {
      setActiveState(nextState);

      // If user confirmed action and entered executing, auto-complete after 2.5s
      if (nextState === 'executing') {
        setTimeout(() => {
          setActiveState('completed');
        }, 2200);
      }
    }
  };

  useEffect(() => {
    if (!isSimulating) {
      if (simulationTimerRef.current) clearInterval(simulationTimerRef.current);
      return;
    }

    simulationTimerRef.current = setInterval(() => {
      setActiveState((prev) => {
        const currentIndex = SIMULATION_FLOW.indexOf(prev);
        if (currentIndex === -1 || currentIndex >= SIMULATION_FLOW.length - 1) {
          setIsSimulating(false);
          return 'completed';
        }
        return SIMULATION_FLOW[currentIndex + 1];
      });
    }, simulationSpeed);

    return () => {
      if (simulationTimerRef.current) clearInterval(simulationTimerRef.current);
    };
  }, [isSimulating, simulationSpeed]);

  const handleSavePayload = () => {
    try {
      const parsed = JSON.parse(payloadText);
      setCustomPayloads((prev) => ({
        ...prev,
        [`${selectedScenarioId}_${activeState}`]: parsed,
      }));
      setEditedPayloadText(null);
      setJsonError(null);
      setIsEditingPayload(false);
    } catch (err) {
      setJsonError(err instanceof Error ? err.message : 'Invalid JSON');
    }
  };

  const handleResetPayload = () => {
    setCustomPayloads((prev) => {
      const copy = { ...prev };
      delete copy[`${selectedScenarioId}_${activeState}`];
      return copy;
    });
    setEditedPayloadText(null);
    setJsonError(null);
    setIsEditingPayload(false);
  };

  // 12 States categorized
  const statePhases: { phase: AgentStatePhase; title: string; states: AgentState[] }[] = [
    {
      phase: 'intake',
      title: '1. Intake Phase',
      states: ['idle', 'listening'],
    },
    {
      phase: 'cognition',
      title: '2. Cognition Phase',
      states: ['thinking', 'planning', 'asking-clarification', 'waiting'],
    },
    {
      phase: 'action',
      title: '3. Execution & HITL',
      states: ['tool-calling', 'processing', 'asking-confirmation', 'executing'],
    },
    {
      phase: 'resolution',
      title: '4. Resolution Phase',
      states: ['failed', 'completed'],
    },
  ];

  const allStates: AgentState[] = [
    'idle',
    'listening',
    'thinking',
    'planning',
    'asking-clarification',
    'waiting',
    'tool-calling',
    'processing',
    'asking-confirmation',
    'executing',
    'failed',
    'completed',
  ];

  const activeMeta = STATE_METADATA_REGISTRY[activeState];

  const codeSnippet = `import { AgentStateRenderer } from '@/components/agentic-ux/AgentStateRenderer';
import { AgentState, AgentStatePayload, AgentAction } from '@/types';

export function MyAgentWidget() {
  const [state, setState] = useState<AgentState>('${activeState}');
  const [payload, setPayload] = useState<AgentStatePayload>(${JSON.stringify(
    currentPayload,
    null,
    2
  )});

  const handleAgentAction = (action: AgentAction) => {
    switch (action.type) {
      case 'CONFIRM_ACTION':
        setState('executing');
        break;
      case 'REJECT_ACTION':
        setState('idle');
        break;
      case 'SUBMIT_CLARIFICATION':
        setState('planning');
        break;
      case 'RETRY':
        setState('thinking');
        break;
      case 'UNDO':
        setState('idle');
        break;
    }
  };

  return (
    <AgentStateRenderer
      state={state}
      payload={payload}
      onAction={handleAgentAction}
    />
  );
}`;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-150">
      {/* 1. TOP BAR CONTRACT */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Zone 1: Single text wordmark */}
          <div className="flex items-center gap-3">
            <span className="text-base font-bold tracking-tight text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" />
              <span>Agentic UX</span>
            </span>
            <span className="hidden sm:inline-block text-xs text-zinc-400 dark:text-zinc-600 font-mono">
              12-State FSM
            </span>
          </div>

          {/* Zone 2: Clean 3-4 nav links / segmented tabs */}
          <nav className="flex items-center gap-1 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('playground')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                activeTab === 'playground'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              Interactive Studio
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('matrix')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                activeTab === 'matrix'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              12-State Matrix
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('fsm-docs')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                activeTab === 'fsm-docs'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              Architecture & Rules
            </button>
          </nav>

          {/* Zone 3: Primary Actions (Theme Toggle & Auto-Run) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
              title="Toggle Dark / Light theme"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => {
                if (isSimulating) {
                  setIsSimulating(false);
                } else {
                  setActiveState('idle');
                  setIsSimulating(true);
                }
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white text-xs font-medium transition shadow-xs"
            >
              {isSimulating ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause Simulator</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Auto-Run Workflow</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* VIEW 1: INTERACTIVE STUDIO */}
        {activeTab === 'playground' && (
          <div className="space-y-6">
            {/* Top Controls: Scenario Picker & Auto-Runner Status */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-900/40 shadow-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                  Scenario Sandbox
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {SCENARIOS.map((scenario) => (
                    <button
                      key={scenario.id}
                      type="button"
                      onClick={() => setSelectedScenarioId(scenario.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                        selectedScenarioId === scenario.id
                          ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-xs'
                          : 'border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-850'
                      }`}
                    >
                      {scenario.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Simulation Playback Bar */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setActiveState('idle');
                    setIsSimulating(false);
                  }}
                  className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-850 text-xs transition"
                  title="Reset to Idle state"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsSimulating(!isSimulating)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition shadow-xs ${
                    isSimulating
                      ? 'bg-amber-600 text-white hover:bg-amber-700'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {isSimulating ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Simulating (Pause)</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>Play Sequential Workflow</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 12-State Segmented Selector Grouped by Phase */}
            <div className="p-3 rounded-2xl border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-900/40 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs px-1">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  State Selector (Click any state to preview UI):
                </span>
                <span className="text-[11px] text-zinc-400 font-mono">
                  Current: <strong className="text-zinc-900 dark:text-zinc-100">{activeState}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {statePhases.map((phaseGroup) => (
                  <div
                    key={phaseGroup.phase}
                    className="p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-850/80 bg-zinc-50/50 dark:bg-zinc-900/60 space-y-1.5"
                  >
                    <span className="text-[10px] uppercase font-semibold text-zinc-400 dark:text-zinc-500 block px-1">
                      {phaseGroup.title}
                    </span>
                    <div className="space-y-1">
                      {phaseGroup.states.map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => {
                            setActiveState(st);
                            setIsSimulating(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition text-left ${
                            activeState === st
                              ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-xs'
                              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800'
                          }`}
                        >
                          <span className="truncate">{st}</span>
                          {activeState === st && (
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 dark:bg-indigo-600" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TWO-COLUMN WORKSPACE: Renderer Canvas + State Inspector / Payload Editor */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left/Center Column (7 cols): The Live AgentStateRenderer */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Live Component Render:
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      (Interactive: click buttons below to test HITL actions)
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400">
                    &lt;AgentStateRenderer /&gt;
                  </span>
                </div>

                {/* Primary Renderer Canvas */}
                <AgentStateRenderer
                  state={activeState}
                  payload={currentPayload}
                  onAction={handleAction}
                />

                {/* Quick Simulation Triggers */}
                <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-900/40 text-xs space-y-2.5">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300 block">
                    Fast Simulation Shortcuts:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveState('asking-confirmation')}
                      className="px-2.5 py-1 rounded-md border border-orange-200 dark:border-orange-900/60 bg-orange-50/50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-300 hover:bg-orange-100 transition"
                    >
                      Trigger Critical HITL Gate
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveState('tool-calling')}
                      className="px-2.5 py-1 rounded-md border border-teal-200 dark:border-teal-900/60 bg-teal-50/50 dark:bg-teal-950/20 text-teal-700 dark:text-teal-300 hover:bg-teal-100 transition"
                    >
                      Trigger MCP Tool Call
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveState('asking-clarification')}
                      className="px-2.5 py-1 rounded-md border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 hover:bg-amber-100 transition"
                    >
                      Trigger Clarification Prompt
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveState('failed')}
                      className="px-2.5 py-1 rounded-md border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300 hover:bg-rose-100 transition"
                    >
                      Trigger Recoverable Failure
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveState('completed')}
                      className="px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition"
                    >
                      Trigger Resolved Objective
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column (5 cols): State Architecture Specs & Realtime Payload Editor */}
              <div className="lg:col-span-5 space-y-4">
                {/* State Specification Card */}
                <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-900/40 text-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-850 pb-2">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                      State Architecture Specs
                    </span>
                    <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                      {activeMeta.phase}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span className="text-zinc-400 text-[10px] block">UX Objective:</span>
                      <p className="text-zinc-700 dark:text-zinc-300 font-medium">
                        {activeMeta.uxObjective}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800">
                        <span className="text-[10px] text-zinc-400 block">Human-in-the-Loop</span>
                        <span className="font-semibold capitalize text-zinc-800 dark:text-zinc-200">
                          {activeMeta.humanInteraction}
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800">
                        <span className="text-[10px] text-zinc-400 block">Reversibility</span>
                        <span className="font-semibold capitalize text-zinc-800 dark:text-zinc-200">
                          {activeMeta.reversibility}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Real-time Payload Editor */}
                <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-900/40 text-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-850 pb-2">
                    <div className="flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-indigo-500" />
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                        State Payload (JSON)
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleResetPayload}
                        className="text-[11px] text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                        title="Reset to scenario defaults"
                      >
                        Reset
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingPayload(!isEditingPayload)}
                        className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                      >
                        {isEditingPayload ? 'Cancel' : 'Edit JSON'}
                      </button>
                    </div>
                  </div>

                  {isEditingPayload ? (
                    <div className="space-y-2">
                      <textarea
                        value={payloadText}
                        onChange={(e) => {
                          setEditedPayloadText(e.target.value);
                          setJsonError(null);
                        }}
                        rows={10}
                        className="w-full p-2.5 rounded-lg bg-zinc-950 font-mono text-[11px] text-emerald-400 border border-zinc-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        spellCheck={false}
                      />
                      {jsonError && (
                        <p className="text-[11px] text-rose-500 font-mono">{jsonError}</p>
                      )}
                      <button
                        type="button"
                        onClick={handleSavePayload}
                        className="w-full py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900 font-medium text-xs transition"
                      >
                        Apply Payload Changes
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-850 font-mono text-[11px] text-emerald-400/90 overflow-x-auto max-h-56">
                      <pre>{JSON.stringify(currentPayload, null, 2)}</pre>
                    </div>
                  )}
                </div>

                {/* Dispatched Actions History Log */}
                <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-900/40 text-xs space-y-2.5">
                  <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-850 pb-2">
                    <div className="flex items-center gap-1.5">
                      <History className="w-3.5 h-3.5 text-zinc-500" />
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                        Dispatched Actions Log
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-400 font-mono tabular-nums">
                      {actionLogs.length} events
                    </span>
                  </div>

                  {actionLogs.length === 0 ? (
                    <p className="text-zinc-400 text-center py-3 text-[11px]">
                      No actions dispatched yet. Click &ldquo;Authorize&rdquo;, &ldquo;Reject&rdquo;, or &ldquo;Clarify&rdquo; on the widget to trigger events.
                    </p>
                  ) : (
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {actionLogs.map((log) => (
                        <div
                          key={log.id}
                          className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-100 dark:border-zinc-800 text-[11px] space-y-0.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                              {log.action.type}
                            </span>
                            <span className="text-[10px] font-mono text-zinc-400 tabular-nums">
                              {log.timestamp}
                            </span>
                          </div>
                          {log.resultingState && (
                            <span className="text-zinc-500 block text-[10px]">
                              → Transitioned to state:{' '}
                              <strong className="text-zinc-700 dark:text-zinc-300">
                                {log.resultingState}
                              </strong>
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: ALL 12 STATES MATRIX */}
        {activeTab === 'matrix' && (
          <div className="space-y-6">
            <div className="text-left space-y-1">
              <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                The 12 Canonical States of Autonomous AI Agents
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                A complete audit gallery showing all 12 cards side-by-side to verify consistent typography, color discipline, and layout presence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {allStates.map((st) => (
                <div key={st} className="space-y-2">
                  <div className="flex items-center justify-between px-2">
                    <span className="font-mono text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      {st}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase">
                      {STATE_METADATA_REGISTRY[st].phase}
                    </span>
                  </div>
                  <AgentStateRenderer
                    state={st}
                    payload={currentScenario.states[st]}
                    onAction={handleAction}
                    showHeader={true}
                    compact={true}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: FSM ARCHITECTURE & DESIGN CONSTITUTION */}
        {activeTab === 'fsm-docs' && (
          <div className="space-y-6 text-left max-w-4xl mx-auto">
            <div className="space-y-2">
              <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Agentic UX: Architectural Framework & Design Principles
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Why a 12-state machine is the foundation of user trust in agentic AI systems.
              </p>
            </div>

            {/* 4 Pillars of Agentic Transparency */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-500" />
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    1. The Cognitive Visibility Gap
                  </h3>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  When an AI agent takes more than 1.5 seconds without status feedback, users assume the system crashed or lost their input. States like <code>thinking</code>, <code>planning</code>, and <code>waiting</code> turn hidden model latency into transparent reasoning.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 space-y-2">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-teal-500" />
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    2. Explainable Tool Calling (XAI)
                  </h3>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  MCP (Model Context Protocol) and API invocations should not happen in a black box. Showing the tool name, protocol, and collapsible JSON payload empowers developers and power users to audit interactions in real time.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 space-y-2">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-orange-500" />
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    3. Safe Human-in-the-Loop (HITL)
                  </h3>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Autonomous agents must not execute irreversible mutations (dropping databases, issuing non-refundable transfers, mass emails) without explicit authorization. The <code>asking-confirmation</code> state provides risk tiering, impact analysis, and inline payload editing.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 space-y-2">
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    4. Post-Condition Verification & Undo
                  </h3>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Upon completion, the agent doesn&apos;t just display generic text—it enumerates affected entities, execution duration, tokens consumed, and offers an instant <code>Undo</code> action to revert transactional changes.
                </p>
              </div>
            </div>

            {/* Quick Copy React Integration Snippet */}
            <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-indigo-500" />
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Integration Guide: Using &lt;AgentStateRenderer /&gt;
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(codeSnippet);
                    setCopiedCode(true);
                    setTimeout(() => setCopiedCode(false), 2000);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs font-medium hover:bg-zinc-100 dark:hover:bg-zinc-700 transition"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-500" />
                      <span className="text-emerald-500">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy React Snippet</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-3 rounded-xl bg-zinc-950 text-zinc-300 font-mono text-[11px] overflow-x-auto border border-zinc-850">
                <pre>{codeSnippet}</pre>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 3. FOOTER */}
      <footer className="mt-12 border-t border-zinc-200 dark:border-zinc-800 py-6 text-center text-xs text-zinc-500 dark:text-zinc-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>Agentic UX: 12-State Design System · Production Enterprise Standard</span>
          <div className="flex items-center gap-4 text-zinc-500">
            <span>TypeScript</span>
            <span aria-hidden="true">·</span>
            <span>Tailwind CSS</span>
            <span aria-hidden="true">·</span>
            <span>Framer Motion</span>
            <span aria-hidden="true">·</span>
            <span>Human-in-the-Loop</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AgentPlayground;
