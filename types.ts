/**
 * Agentic UX: 12-State Design System
 * Core State Machine Definitions & Human-in-the-Loop Contracts
 */

export type AgentState =
  | 'idle'
  | 'listening'
  | 'thinking'
  | 'planning'
  | 'asking-clarification'
  | 'waiting'
  | 'tool-calling'
  | 'processing'
  | 'asking-confirmation'
  | 'executing'
  | 'failed'
  | 'completed';

export type AgentStatePhase = 'intake' | 'cognition' | 'action' | 'resolution';

export interface PlanStep {
  id: string;
  label: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  detail?: string;
  durationMs?: number;
  toolTarget?: string;
}

export interface ToolCallData {
  toolName: string;
  serverOrProtocol?: 'MCP' | 'REST' | 'GraphQL' | 'DB' | 'CLI';
  endpoint?: string;
  parameters: Record<string, unknown>;
  output?: Record<string, unknown> | string;
  executionTimeMs?: number;
  status?: 'calling' | 'success' | 'error';
}

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface ConfirmationData {
  actionTitle: string;
  riskLevel: RiskLevel;
  details: string;
  payloadToExecute: Record<string, unknown>;
  reversible: boolean;
  affectedResource?: string;
  timeoutSeconds?: number;
  consequences?: string[];
}

export interface ClarificationOption {
  id: string;
  label: string;
  hint?: string;
  isRecommended?: boolean;
}

export interface AgentErrorData {
  code: string;
  message: string;
  recoverable: boolean;
  suggestedAction?: 'retry' | 'reauth' | 'edit-prompt' | 'escalate';
  details?: string;
  timestamp?: string;
}

export interface AgentSummaryMetrics {
  executionTimeMs: number;
  tokensUsed?: number;
  stepsCount?: number;
  toolCallsCount?: number;
  costEstimate?: string;
}

export interface AgentSummary {
  metrics?: AgentSummaryMetrics;
  affectedEntities?: string[];
  rollbackAvailable?: boolean;
  resultSummary?: string;
  completedAt?: string;
}

export interface AgentStatePayload {
  message?: string;
  intent?: string;
  plan?: PlanStep[];
  tool?: ToolCallData;
  confirmation?: ConfirmationData;
  clarificationOptions?: ClarificationOption[];
  error?: AgentErrorData;
  summary?: AgentSummary;
  inputTranscript?: string;
  progressPercent?: number;
  executionNote?: string;
}

export type AgentAction =
  | { type: 'CONFIRM_ACTION'; payload?: Record<string, unknown> }
  | { type: 'REJECT_ACTION'; reason?: string }
  | { type: 'SUBMIT_CLARIFICATION'; answer: string }
  | { type: 'RETRY' }
  | { type: 'UNDO' }
  | { type: 'ABORT' }
  | { type: 'START_LISTEN' }
  | { type: 'STOP_LISTEN' }
  | { type: 'EDIT_PAYLOAD'; payload: Record<string, unknown> }
  | { type: 'RESET' };

export interface AgentStateRendererProps {
  state: AgentState;
  payload?: AgentStatePayload;
  onAction?: (action: AgentAction) => void;
  className?: string;
  compact?: boolean;
  agentName?: string;
  agentRole?: string;
  showHeader?: boolean;
  showMetrics?: boolean;
}

export interface StateMetaInfo {
  state: AgentState;
  phase: AgentStatePhase;
  title: string;
  description: string;
  humanInteraction: 'none' | 'optional' | 'required';
  reversibility: 'n/a' | 'reversible' | 'irreversible' | 'conditional';
  uxObjective: string;
}

export const STATE_METADATA_REGISTRY: Record<AgentState, StateMetaInfo> = {
  idle: {
    state: 'idle',
    phase: 'intake',
    title: 'Ready / Dormant',
    description: 'Agent is ready for execution, awaiting prompt, schedule, or event trigger.',
    humanInteraction: 'optional',
    reversibility: 'n/a',
    uxObjective: 'Signal availability with zero visual noise and invite natural instruction.',
  },
  listening: {
    state: 'listening',
    phase: 'intake',
    title: 'Capturing Input',
    description: 'Actively ingesting voice, real-time stream, multimodal inputs, or keyboard events.',
    humanInteraction: 'required',
    reversibility: 'reversible',
    uxObjective: 'Reassure user their stream/speech is accurately received via micro-waveforms.',
  },
  thinking: {
    state: 'thinking',
    phase: 'cognition',
    title: 'Understanding & Intent',
    description: 'Analyzing prompt, validating guardrails, resolving references, extracting intent.',
    humanInteraction: 'none',
    reversibility: 'n/a',
    uxObjective: 'Expose inferred intent early so the user can verify agent comprehension.',
  },
  planning: {
    state: 'planning',
    phase: 'cognition',
    title: 'Reasoning Chain & Plan',
    description: 'Decomposing objective into a verifiable multi-step sequential reasoning chain.',
    humanInteraction: 'optional',
    reversibility: 'n/a',
    uxObjective: 'Provide structural transparency before mutations occur; reveal reasoning steps.',
  },
  'asking-clarification': {
    state: 'asking-clarification',
    phase: 'cognition',
    title: 'Needs Clarification',
    description: 'Ambiguity detected or missing parameter. Agent proactively asks user for guidance.',
    humanInteraction: 'required',
    reversibility: 'n/a',
    uxObjective: 'Provide structured options + freeform reply to unblock reasoning without deadlocks.',
  },
  waiting: {
    state: 'waiting',
    phase: 'cognition',
    title: 'Awaiting External Resource',
    description: 'Holding execution for webhook, rate-limit backoff, distributed lock, or upstream SLA.',
    humanInteraction: 'optional',
    reversibility: 'n/a',
    uxObjective: 'Eliminate perceived freezing: explain exact lock/endpoint being awaited.',
  },
  'tool-calling': {
    state: 'tool-calling',
    phase: 'action',
    title: 'Tool Execution (MCP/API)',
    description: 'Invoking external tool, Model Context Protocol server, database query, or REST API.',
    humanInteraction: 'none',
    reversibility: 'conditional',
    uxObjective: 'Demystify tool calls: show protocol, tool name, input arguments, and live duration.',
  },
  processing: {
    state: 'processing',
    phase: 'action',
    title: 'Synthesizing Tool Output',
    description: 'Aggregating raw tool outputs, evaluating invariants, calculating response delta.',
    humanInteraction: 'none',
    reversibility: 'n/a',
    uxObjective: 'Bridge raw machine responses to human-digestible results without blank gaps.',
  },
  'asking-confirmation': {
    state: 'asking-confirmation',
    phase: 'action',
    title: 'Human-in-the-Loop Gate',
    description: 'Crucial gate requiring explicit authorization before executing high-risk or irreversible action.',
    humanInteraction: 'required',
    reversibility: 'irreversible',
    uxObjective: 'Clear risk assessment, exact payload inspection, and explicit Approve/Reject controls.',
  },
  executing: {
    state: 'executing',
    phase: 'action',
    title: 'Committing State Mutation',
    description: 'Executing confirmed transaction or mutating database/infrastructure state.',
    humanInteraction: 'none',
    reversibility: 'irreversible',
    uxObjective: 'State non-interruption warning and transactional progress to prevent duplicate submissions.',
  },
  failed: {
    state: 'failed',
    phase: 'resolution',
    title: 'Execution Error / Terminated',
    description: 'Execution encountered an unrecoverable or recoverable exception or upstream failure.',
    humanInteraction: 'required',
    reversibility: 'reversible',
    uxObjective: 'Provide clear diagnostic code, root cause explanation, and actionable recovery pathways.',
  },
  completed: {
    state: 'completed',
    phase: 'resolution',
    title: 'Objective Resolved',
    description: 'Task executed successfully with validated post-conditions and summary.',
    humanInteraction: 'optional',
    reversibility: 'reversible',
    uxObjective: 'Summarize affected entities, telemetry metrics, and offer an instantaneous Undo button.',
  },
};
