# HANDOFF.md — Agentic UX: 12-State Design System

> Comprehensive project handoff document summarizing current status, implemented features, blockers, upcoming roadmap, and critical architectural & design decisions.

---

## 1. Project Overview & UX Objective

**Agentic UX** is an enterprise-grade, state-machine-driven design system and React component suite built with **Next.js 15+ (App Router)**, **TypeScript**, **Tailwind CSS v4**, and **Framer Motion (`motion/react`)**. 

It implements the definitive **12 Canonical States of Autonomous AI Agents** to solve the *Cognitive Visibility Gap* (the "Black Box Problem" of autonomous agents) by enforcing absolute transparency, explainable tool execution (XAI), and robust Human-in-the-Loop (HITL) safety governance.

### Core UX Objectives:
1. **Cognitive Transparency (Intake & Cognition):** Clearly convey when the agent is idle, listening to streaming input, thinking, planning multi-step task graphs, or waiting on external resources.
2. **Explainable Execution (Action & XAI):** Real-time inspection of tool calls (MCP / REST / DB / GraphQL), payload parameters, latency metrics, and step-by-step execution status.
3. **Human-in-the-Loop (HITL) Safety Gate:** Strict pre-execution review for high-risk, irreversible, or destructive mutations with impact analysis and live JSON parameter editing.
4. **Resilience & Reversibility (Resolution):** Actionable failure panels with error classification, rollback status, atomic undo triggers, and post-execution audit summaries.

---

## 2. Current Project Status

- **Build & Compilation:** 🟢 **Passing** (`compile_applet` succeeds cleanly).
- **Static Analysis & Lint:** 🟢 **0 errors, 0 warnings** (`eslint .` clean).
- **Responsiveness:** 🟢 **Fully responsive** from 320px mobile viewports up to 4K ultra-wide displays.
- **Theme Support:** 🟢 **Light & Dark mode** with custom Tailwind v4 variant and WCAG AA contrast compliance.
- **Deployment Status:** Production-ready and active on AI Studio Cloud Run.

---

## 3. Implemented Features & Architecture

### A. The 12 Canonical Agent States
Organized across 4 distinct execution phases in `types.ts` and `STATE_METADATA_REGISTRY`:

| Phase | State | Purpose & UX Behavior |
| :--- | :--- | :--- |
| **1. Intake** | `idle` | Passive readiness, awaiting user prompt or scheduled trigger. |
| | `listening` | Active streaming input visualizer with dynamic audio waveform and live transcription. |
| **2. Cognition** | `thinking` | Deep inference state with ambient pulsing indicator and cognitive progress. |
| | `planning` | Dynamic step-by-step reasoning graph accordion with elapsed time indicators. |
| | `asking-clarification` | Ambiguity resolution interface with quick recommendation chips and manual reply input. |
| | `waiting` | Backoff / rate-limit / advisory lock state with active resource indicators. |
| **3. Action & HITL** | `tool-calling` | MCP / API tool invocation drawer with collapsible JSON parameters and copy button. |
| | `processing` | Mutation in-flight with progress bar, active step label, and cancel option. |
| | `asking-confirmation` | Strict HITL approval gate: risk tier (`low` to `critical`), impact consequences, reversible/irreversible badges, payload editor, and Authorize/Reject actions. |
| | `executing` | Committing state to databases or external webhooks. |
| **4. Resolution** | `failed` | Failure recovery panel with error code, recovery suggestion, rollback check, and Retry/Abort buttons. |
| | `completed` | Audit summary card with token count, latency metrics, affected entities, and atomic Undo trigger. |

### B. Core Component Library (`/components/agentic-ux/`)
- **`AgentStateRenderer.tsx`**: Master coordinator wrapping all 12 sub-views with smooth `AnimatePresence mode="wait"` transitions. Includes adaptive responsive header and footer metadata.
- **`AgentStatusBadge.tsx`**: Polished status tag with contextual icons, pulse indicators, and responsive word wrapping (`break-words`).
- **`ApprovalCard.tsx`**: High-security Human-in-the-Loop authorization card with inline JSON payload editor, consequence checklist, and `break-all` protection for long URIs.
- **`ToolCallWidget.tsx`**: Protocol-aware MCP/DB/REST inspector with parameter/output tabs, copy-to-clipboard, and endpoint badges.
- **`ReasoningAccordion.tsx`**: Multi-phase reasoning plan renderer displaying in-progress, completed, and pending steps.
- **`ErrorRecoveryPanel.tsx`**: Diagnostic panel for interrupted workflows with error taxonomy and automated rollback validation.
- **`ClarificationPanel.tsx`**: Interactive query prompt for disambiguating intent before agent execution.
- **`ListeningVisualizer.tsx`**: High-fidelity audio/voice visualizer with dynamic wave bars and transcript display.
- **`CompletedSummary.tsx`**: Resolution card with execution duration, token consumption, resource impact, and Undo action.

### C. Interactive Studio & Testing Playground (`/components/Playground.tsx`)
- **Scenario Sandbox**: Pre-configured real-world enterprise scenarios:
  1. *PostgreSQL Database Migration* (High risk, irreversible mutation, table locking, schema modification).
  2. *Customer Support Dispute & Refund* (Medium risk, reversible Stripe refund and webhook pause).
- **Auto-Run Workflow Simulator**: Automated state sequencer (`SIMULATION_FLOW`) with Play/Pause controls.
- **Live Payload Editor**: In-place JSON editor allowing developers to customize state data and verify UI responses immediately.
- **Action History Audit Log**: Chronological audit trail of all dispatched agent actions (`CONFIRM_ACTION`, `RETRY`, `UNDO`, etc.).
- **12-State Matrix Gallery**: Full simultaneous audit grid of all 12 states side-by-side.
- **Design Constitution & Architecture Tab**: In-depth documentation of the 4 Pillars of Agentic Transparency and Human-in-the-Loop governance.
- **React Code Snippet Generator**: Automatically produces copy-pasteable TypeScript integration code.

### D. Author Profile & Branding Integration
- **Author:** Stanislav Dovidenko (Product Designer).
- **Footer Badge:** Centered responsive author pill with cyan status indicator.
- **Author Modal (`#author-modal`):** Sleek modal with bio, role, close button, Escape key / backdrop dismissal, and links:
  - Website: `https://stanislavdovidenko.com/en.html#about`
  - Telegram: `@StasDoDesign` (`https://t.me/StasDoDesign`)
  - LinkedIn: `/in/stasdodesign` (`http://linkedin.com/in/stasdodesign`)
  - Instagram: `@stasdodesign` (`https://instagram.com/stasdodesign`)
  - Email: `stasdodesign@gmail.com` (`mailto:stasdodesign@gmail.com`)

### E. Mobile Responsiveness & WCAG Accessibility
- **Mobile Header Navigation:** Collapses desktop segmented tabs into an animated drawer (`Menu` / `X` toggle) with tab switching, Auto-Run controls, and author profile trigger.
- **Text Wrapping & Zero Horizontal Overflow:**
  - Card headers adapt from single-row to stacked flex columns (`flex-col sm:flex-row gap-3`) on mobile.
  - Long URLs and URIs (e.g., `aws-rds://production-primary.cluster/billing_subscriptions`, `mcp://...`) use `break-all min-w-0` to remain strictly within card boundaries.
- **WCAG AA Compliance:** Light-mode hover state colors adjusted to `text-cyan-800 hover:border-cyan-600` to maintain > 4.5:1 contrast against light backgrounds.

---

## 4. Current Blockers

- **Zero Critical Blockers:** There are no build failures, syntax errors, or runtime crashes.
- **Production Safe Mode Active:** Any future modifications must adhere to surgical, minimal patches.

---

## 5. Upcoming Roadmap & Next Steps

1. **Live Agent Stream Integration (Backend SSE / WebSockets):**
   - Create a Next.js Route Handler (`app/api/agent/stream/route.ts`) implementing Server-Sent Events (SSE).
   - Build a reusable React hook `useAgentStream(endpoint)` that parses agent stream chunks into `AgentStatePayload` and updates `AgentStateRenderer` in real time.
   - Add compatibility adapters for popular agent frameworks (LangGraph, Vercel AI SDK, AutoGen, CrewAI, Gemini Function Calling).

2. **Additional Enterprise Scenarios:**
   - *Autonomous Codebase Refactoring*: AST analysis, Vitest test execution, branch creation, Git commit.
   - *Multimodal Voice Agent*: Live audio streaming transcription, tool dispatch, and speech synthesis.
   - *Web Research & Search Grounding*: Google Search grounding citation chips and source verification.

3. **Component Distribution & Export:**
   - Package components into an npm package (`@agentic-ux/react`) or a `shadcn/ui` compatible registry block (`npx shadcn add @agentic-ux/card`).
   - Export Figma UI Kit tokens and design system variables.

4. **Testing & QA:**
   - Add Vitest unit tests verifying state transitions and action callback payloads.
   - Add Playwright E2E tests for mobile hamburger menu toggle, modal interactions, and keyboard navigation (`Escape`, `Tab` focus trap).

---

## 6. Critical Technical Decisions & Guardrails ⚠️

1. **Framer Motion Import Convention (v12 `motion` package):**
   - **RULE:** Never import from `'framer-motion'`. Always import from `'motion/react'`:
     ```tsx
     import { motion, AnimatePresence } from 'motion/react';
     ```
2. **React 19 / ESLint 9 Hook Discipline (`react-hooks/set-state-in-effect`):**
   - **RULE:** Do not invoke `setState` synchronously inside `useEffect` bodies during initial render.
   - Use lazy state initialization (`useState(() => compute())`) or derived state variables.
3. **JSX Entity Escaping (`react/no-unescaped-entities`):**
   - **RULE:** Never use unescaped single quotes (`'`) or double quotes (`"`) directly in JSX text. Use `&apos;`, `&quot;`, `&ldquo;`, `&rdquo;`, or string expressions `{'text'}`.
4. **Tailwind CSS v4 Dark Mode Configuration:**
   - In `app/globals.css`, dark mode relies on:
     ```css
     @custom-variant dark (&:where(.dark, .dark *));
     ```
   - Do not remove or alter this directive.
5. **Break-All Rule for Monospaced Identifiers:**
   - All server endpoints, URIs, database paths, and hashes must have `break-all` and `min-w-0` to avoid horizontal layout breaking on mobile screens.
6. **WCAG Color Discipline:**
   - Avoid low-contrast neon colors on light backgrounds. Reserve `#00F0FF` for dark mode (`dark:text-[#00F0FF]`) and use deep contrast tones (`text-cyan-800`, `border-cyan-600`) for light mode.

---

*Handoff document maintained for the Agentic UX project. Last updated: September 2026.*
