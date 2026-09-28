> 🇷🇺 **Russian version is available [here](./README.ru.md).**

---

# 🤖 Agentic UX: 12-State Framework for AI Agents. Design System & Interactive Playground

> **Enterprise-grade UI standard for autonomous AI agents (Next.js 15, React 19, TypeScript, Tailwind CSS, Motion).**  
> 🌐 **Live Demo (Vercel):** [https://agentic-ui-kit.vercel.app/](https://agentic-ui-kit.vercel.app/)  
> Concept & Design by: **Stanislav Dovidenko** — *Product Designer*  
> 📩 **Telegram:** [https://t.me/StasDoDesign](https://t.me/StasDoDesign)  
> ✉️ **Email:** [Stanislavskii.yo@gmail.com](mailto:Stanislavskii.yo@gmail.com)  

---

## 📌 About the Project

When users interact with autonomous AI agents, the primary UX challenge is the **Cognitive Visibility Gap**: users cannot tell whether an agent is hanging, what backend commands or MCP tools it is calling, or what irreversible mutations it is about to execute.

**Agentic UX** solves this by establishing a strict **12-State Finite State Machine (FSM)**. It provides real-time visibility into the agent's Chain of Thought (CoT), transparent parameter inspection for tool calls, and an uncompromising **Human-in-the-Loop (HITL) safety gate** for high-stakes actions.

---

## 🗂️ The 12 Canonical States of Autonomous Agents

The state machine is organized into 4 logical phases: **Intake**, **Cognition**, **Execution**, and **Resolution**.

| # | State (`AgentState`) | Phase | UX Purpose & Expected Behavior |
|---|----------------------|-------|--------------------------------|
| 1 | `idle` | `Intake` | Passive readiness: agent displays suggestions, context, and trigger hints. |
| 2 | `listening` | `Intake` | Active streaming input (audio/text) with waveform micro-animations. |
| 3 | `thinking` | `Cognition` | Live inference indicator; shows intent without fake loading delays. |
| 4 | `planning` | `Cognition` | Multi-step task decomposition with dependency graph and timing estimates. |
| 5 | `tool-calling` | `Execution` | Transparent inspection of external tool/MCP/API parameters and response payloads. |
| 6 | `waiting` | `Execution` | Explicit backoff, advisory lock acquisition, or distributed sync delay. |
| 7 | `clarifying` | `Cognition` | Ambiguity resolution: agent presents selectable chips or asks for user input. |
| 8 | `processing` | `Execution` | In-flight mutation, data validation, and artifact aggregation. |
| 9 | `asking-confirmation`| `Execution` | **Human-in-the-Loop Guardrail:** impact analysis, risk badge, and authorization gate. |
| 10| `executing` | `Execution` | Atomic transaction commit and database/webhook write state. |
| 11| `completed` | `Resolution` | Objective achieved: latency, token metrics, summary, and **atomic Undo**. |
| 12| `failed` | `Resolution` | Diagnostic error classification, rollback status, and one-click recovery. |

---

## 🌟 Key Features

- **12 Canonical State Components:** Every phase has dedicated color coding, status badges, iconography, and semantic layouts.
- **Interactive Sandbox:** 4 realistic enterprise scenarios:
  1. *PostgreSQL Migration* — high-risk table locking and DDL schema mutation.
  2. *Customer Dispute & Refund* — financial adjustment with instant reversibility.
  3. *Kubernetes Pod Autoscaling* — infrastructure cluster selection and capacity checks.
  4. *Legal Contract Analysis* — document intelligence and risk clause flagging.
- **Auto-Run Workflow Simulator:** Automated playback through state sequences at adjustable speeds.
- **Live JSON Payload Editor:** Edit execution parameters in real time to test adaptive UI behavior.
- **Action History Audit Log:** Real-time chronological audit trail of all dispatched agent actions.
- **12-State Matrix Gallery:** Side-by-side comparison view of all 12 cards for design reviews.
- **Zero Horizontal Overflow & Break-All Discipline:** Monospaced identifiers, DB cluster paths, and API endpoints wrap cleanly on mobile screens (320px+).
- **WCAG AA Compliance:** High-contrast light and dark themes with accessible color palettes.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: `v20.x` or later
- **npm**, **yarn**, or **pnpm**

### Installation & Local Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/agentic-ui-kit.git
   cd agentic-ui-kit
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Lint and build:**
   ```bash
   npm run lint
   npm run build
   ```

---

## 🛠️ Project Structure

```text
├── app/
│   ├── layout.tsx                # Root layout with metadata and fonts
│   ├── page.tsx                  # Application entry point
│   └── globals.css               # Tailwind CSS v4 styles & dark mode variant
├── components/
│   ├── Playground.tsx            # Main interactive studio, matrix & documentation
│   ├── mockData.ts               # Enterprise scenario definitions
│   └── agentic-ux/
│       ├── AgentStateRenderer.tsx    # State coordinator with AnimatePresence
│       ├── AgentStatusBadge.tsx      # Pulse badge with phase-specific styles
│       ├── ApprovalCard.tsx          # Human-in-the-Loop authorization card
│       ├── ToolCallWidget.tsx        # MCP/API inspector with JSON copy & tabs
│       ├── ReasoningAccordion.tsx    # Step-by-step reasoning plan viewer
│       ├── ClarificationPanel.tsx    # Ambiguity selector with quick options
│       ├── ListeningVisualizer.tsx   # Voice / streaming audio waveform
│       ├── CompletedSummary.tsx      # Completion audit card with Undo action
│       └── ErrorRecoveryPanel.tsx    # Diagnostic error panel with retry/abort
├── types/
│   └── index.ts                  # TypeScript types for FSM states & payloads
├── README.md                     # English documentation (this file)
├── README.ru.md                  # Russian documentation
└── package.json
```

---

## 💻 Integration Example

You can drop the `AgentStateRenderer` into any Next.js or React application:

```tsx
'use client';

import React, { useState } from 'react';
import { AgentStateRenderer } from '@/components/agentic-ux/AgentStateRenderer';
import { AgentState, AgentAction } from '@/types';

export function AgentWorkflowCard() {
  const [state, setState] = useState<AgentState>('asking-confirmation');

  const handleAction = (action: AgentAction) => {
    switch (action.type) {
      case 'APPROVE':
        console.log('Action approved with payload:', action.payload);
        setState('executing');
        break;
      case 'REJECT':
        console.log('Action rejected by user');
        setState('idle');
        break;
      case 'UNDO':
        console.log('Atomic undo triggered');
        setState('idle');
        break;
    }
  };

  return (
    <AgentStateRenderer
      state={state}
      onAction={handleAction}
      agentName="Atlas Production Agent"
      agentRole="Autonomous Cloud Database Orchestrator"
      showHeader={true}
      payload={{
        confirmation: {
          actionTitle: 'Commit Schema Alteration & Drop Legacy Index',
          riskLevel: 'critical',
          details: 'Operation will acquire an exclusive table lock on billing_subscriptions for ~350ms.',
          reversible: false,
          affectedResource: 'aws-rds://production-primary.cluster/billing_subscriptions',
          consequences: [
            'Exclusive table lock for ~350ms',
            'Permanent drop of index idx_subs_cycle_v1',
          ],
          payloadToExecute: { table: 'billing_subscriptions', dryRun: false },
        },
      }}
    />
  );
}
```

---

## 📱 How to Use the Interactive Playground

1. **Choose a Scenario:** Use the top bar in the Interactive Studio to switch between 4 enterprise scenarios.
2. **Switch States:** Click on any step in the 12-state breadcrumb bar (`idle`, `thinking`, `planning`, `tool-calling`, `asking-confirmation`, etc.) to inspect its UI presentation.
3. **Auto-Run Workflow:** Click **«Auto-Run Workflow»** in the header to simulate end-to-end execution.
4. **Human-in-the-Loop Actions:**
   - In `clarifying`: Click suggestion chips or provide manual guidance.
   - In `asking-confirmation`: Test **«Authorize & Commit»**, **«Reject & Abort»**, or click **«Edit Payload»** to modify parameters prior to execution.
   - In `completed`: Test the **«Undo Action»** timer window.
5. **Live Payload Editing:** Use the right-hand **State Payload (JSON)** panel to modify live parameters and observe instant reactive UI updates.
6. **12-State Matrix & Architecture:** Switch tabs to view the complete 12-card design audit matrix or read the 4 Pillars of Agentic Transparency.

---

## 👤 Author & Contacts

- **Stanislav Dovidenko** — *Product Designer, Lead UX/UI Specialist for Agentic & Enterprise AI Systems*
- **Telegram:** [https://t.me/StasDoDesign](https://t.me/StasDoDesign)
- **Email:** [Stanislavskii.yo@gmail.com](mailto:Stanislavskii.yo@gmail.com)
- **Live Demo (Vercel):** [https://agentic-ui-kit.vercel.app/](https://agentic-ui-kit.vercel.app/)
- **In-App Profile:** Click the author pill in the footer or mobile menu to view full background and portfolio cases.

---

## 💼 Custom Audit & Integration (CTA)

> **Need a custom Agentic UX audit or integration for your B2B AI app? Contact me for a 20-min async Loom review.**
>
> We will analyze your AI agent workflows, Chain of Thought (CoT) reasoning clarity, Human-in-the-Loop decision gates, and implement production-ready transparency standards that build user trust and reduce churn.
>
> 📩 **Contact on Telegram:** [https://t.me/StasDoDesign](https://t.me/StasDoDesign)  
> ✉️ **Send an Email:** [Stanislavskii.yo@gmail.com](mailto:Stanislavskii.yo@gmail.com)

---

## 📄 License

MIT License — free for commercial and educational use.
