# 📋 Project Handoff: Agentic UX Framework & Design System

> **Document Version:** 1.0.0  
> **Last Updated:** 2026-09-28  
> **Author & Lead Designer:** Stanislav Dovidenko (*Product Designer*)  
> **Contacts:** [Telegram](https://t.me/StasDoDesign) · [Email](mailto:Stanislavskii.yo@gmail.com) · [Portfolio](https://stanislavdovidenko.com/en.html#about)  
> **Production Live URL:** [https://agentic-ui-kit.vercel.app/](https://agentic-ui-kit.vercel.app/)

---

## 1. Executive Summary & Project Status

- **Status:** 🟢 **Production Ready / Polished**
- **Build Status:** 0 lint errors (`eslint .`), clean build (`next build`), 100% TypeScript typed.
- **Framework & Tech Stack:**
  - **Core:** Next.js 15+ (App Router), React 19, TypeScript
  - **Styling:** Tailwind CSS v4, PostCSS
  - **Animation:** `motion` (`motion/react`)
  - **Icons:** `lucide-react`
  - **Accessibility:** WCAG AA compliant contrast ratios across dark & light modes.

The project establishes a comprehensive **12-state Finite State Machine (FSM)** design standard for autonomous enterprise AI agents. It addresses the **Cognitive Visibility Gap** by replacing opaque spinners and black-box chat streams with structured, deterministic, and inspectable UI micro-states.

---

## 2. Implemented Features & Architecture

### 2.1 The 12 Canonical Agent States (`AgentState`)
Every agent state has an assigned semantic color palette, ping indicator, icon, UX objective, and distinct visual container:

1. **`idle` (Input Phase):** Ready state with prompt suggestions and system status.
2. **`listening` (Input Phase):** Audio/text input capture with reactive wave/pulse indicator.
3. **`thinking` (Cognitive Phase):** Step-by-step Chain of Thought (`ReasoningChain.tsx`) with collapsibility and timing markers.
4. **`planning` (Cognitive Phase):** Dynamic execution steps (`PlanList.tsx`) with dependencies and status badges.
5. **`tool-calling` (Execution Phase):** Real-time MCP / DB tool inspection (`ToolCallWidget.tsx`) with parameters, latency (`ms`), and payload copying.
6. **`waiting` (Execution Phase):** External asynchronous wait indicator for locks and remote transactions.
7. **`clarifying` (Interaction Phase):** Multi-choice ambiguity resolution (`ClarificationSelector.tsx`) with recommendations.
8. **`processing` (Execution Phase):** Post-tool data validation, schema checks, and sample verification.
9. **`asking-confirmation` (Interaction Phase):** **Human-in-the-Loop Guardrail** (`ApprovalCard.tsx`) with:
   - Risk classification: `low`, `medium`, `high`, `critical`.
   - Reversible vs. Irreversible mutation banners.
   - Target resource display with string wrapping (`break-all`).
   - In-place JSON payload editor for pre-execution modification.
   - Impact analysis itemized consequence list.
10. **`executing` (Execution Phase):** State commitment with active pulsing indicator and auto-advancement to resolution.
11. **`completed` (Resolution Phase):** Final outcome report (`CompletionSummary.tsx`) with latency metrics and a 10-second interactive Undo window.
12. **`failed` (Resolution Phase):** Diagnostic failure card (`FailureCard.tsx`) with root-cause categorization, safe retry, and rollback triggers.

### 2.2 Interactive Studio & Views (`Playground.tsx`)
- **Interactive Studio View:**
  - **Scenario Sandbox:** 4 realistic scenarios:
    - `rds-migration` (PostgreSQL production schema alteration & table locks).
    - `customer-refund` (FinTech multi-gateway transaction refund).
    - `k8s-autoscale` (DevOps Kubernetes cluster scaling).
    - `legal-analysis` (LegalTech NDA liability clause review).
  - **Workflow Auto-Simulation:** Automated progression through states with speed controls (Fast 1.2s, Normal 2.2s, Deliberate 3.8s).
  - **Interactive FSM Stepper:** Horizontal chain for immediate single-click state previews.
  - **Live JSON Payload Editor:** Real-time editing and testing of component props with syntax error validation.
  - **Action History Audit Log:** Real-time stream of dispatched user and agent actions.
  - **Embed Code Generator:** One-click copy of clean JSX for external project adoption.
- **12-State Matrix View:** All 12 states side-by-side for comprehensive design system audits and presentation.
- **Architecture & Rules View:** Comprehensive documentation of the 4 pillars of Agentic UX and transition rules.
- **Author Profile Modal:** Clean modal showcasing designer bio, key links, social channels, and Loom audit CTA.

### 2.3 Mobile & Responsive Optimizations
- **Header & Tag Wrapping:** Card headers use `flex-col sm:flex-row gap-3` so agent identity, version badges, and status tags (`Human-in-the-Loop Gate`) never collide or truncate on narrow screens.
- **Resource Word Breaking:** Long URIs like `aws-rds://production-primary.cluster/billing_subscriptions` and `mcp://...` use `break-all` and `min-w-0` to guarantee zero horizontal scroll.
- **Adaptive Badges:** Status badges use `tracking-tight leading-tight break-words` instead of rigid `nowrap`.
- **Footer Centering:** Author badge in the footer adapts to `flex-col items-center text-center` on mobile.
- **Mobile Navigation:** Dedicated hamburger slide-out drawer with quick scenario switching and author access.

---

## 3. Critical Design Decisions

| Decision | Rationale |
|----------|-----------|
| **FSM-Driven State Machine** | AI agents cannot be treated as simple chat bubbles. Explicit states ensure predictable, reproducible UI transitions and prevent user confusion. |
| **Mandatory Human-in-the-Loop for Irreversible Actions** | Critical mutations (dropping indexes, transferring funds) require explicit authorization with impact consequences and pre-flight payload inspection. |
| **Zero-Pill Discipline & Semantic Color Coding** | High-contrast, domain-meaningful colors (Orange = Gate, Amber = Thinking, Teal = Tool, Rose = Failure, Emerald = Success) rather than arbitrary aesthetic gradients. |
| **Break-all on Monospace Resource Identifiers** | Machine-generated strings (URIs, hashes, endpoints) contain no natural whitespace. Applying `break-all` prevents container blowouts on mobile viewports. |
| **Dual-Mode Contrast Compliance (WCAG AA)** | Light-mode hover states use `cyan-800`/`cyan-600` for readable contrast against white backgrounds, while dark mode retains the `#00F0FF` cyberpunk accent. |

---

## 4. Current Blockers & Technical Debt

- **Blockers:** 🟢 **None**. The codebase compiles without errors and passes all ESLint rules.
- **Technical Debt:** Minimal. Mock payloads are statically defined in `mockData.ts` to ensure instant sandbox responsiveness without requiring live backend credentials.

---

## 5. Upcoming Roadmap & Recommendations

1. **NPM / Shadcn Registry Component Distribution:**
   - Package the components under `@agentic-ux/react` or provide a `npx shadcn add` CLI registry configuration for fast adoption by developers.
2. **Server-Sent Events (SSE) / WebSocket Streaming Adapter:**
   - Implement an optional React hook (e.g., `useAgentState({ streamUrl: '/api/agent/stream' })`) that maps incoming LangChain, LlamaIndex, or Vercel AI SDK events to the 12 FSM states.
3. **Multi-Agent Orchestrator Hierarchy:**
   - Add a tree view or DAG visualization for workflows where a parent orchestrator delegates sub-tasks to specialized sub-agents (e.g., Lead Researcher $\rightarrow$ Data Fetcher).
4. **OpenTelemetry / Tracing Integration:**
   - Visual connector showing distributed trace IDs (`trace_id`, `span_id`) directly on tool-call cards for enterprise observability.

---

## 6. Key File Index

- `components/Playground.tsx` — Main interactive studio, state management, matrix gallery, and documentation views.
- `components/mockData.ts` — Pre-configured scenarios and realistic enterprise payloads.
- `components/agentic-ux/AgentStateRenderer.tsx` — Universal state canvas router.
- `components/agentic-ux/AgentStatusBadge.tsx` — Semantic pulsing status indicator.
- `components/agentic-ux/ApprovalCard.tsx` — Human-in-the-Loop decision guardrail.
- `components/agentic-ux/ToolCallWidget.tsx` — MCP/API tool execution inspector.
- `components/agentic-ux/ReasoningChain.tsx` — Chain of Thought step-by-step viewer.
- `components/agentic-ux/PlanList.tsx` — Multi-phase execution plan.
- `types/index.ts` — Strict TypeScript contracts for all states, actions, and metadata.
- `README.md` — User manual, installation guide, and author credentials.

---

## 7. Contacts & Consulting

For custom enterprise UX audits, bespoke design system integration, or inquiries:
- **Designer:** Stanislav Dovidenko
- **Telegram:** [https://t.me/StasDoDesign](https://t.me/StasDoDesign)
- **Email:** [Stanislavskii.yo@gmail.com](mailto:Stanislavskii.yo@gmail.com)
- **Loom Audit:** Available for 20-minute async architectural reviews.
