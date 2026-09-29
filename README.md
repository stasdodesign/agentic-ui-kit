# 🤖 Agentic UX — 12-State Design System for AI Agents

> 🇷🇺 **Russian version:** [README.ru.md](./README.ru.md)

**A 12-state framework and interactive playground for designing interfaces around autonomous AI agents.**

Most AI agents still feel like a black box. Users often cannot tell whether an agent is still working, waiting for an external system, calling a tool, asking for clarification, or preparing to execute an important action. Traditional chat interfaces were not designed for these scenarios.

**Agentic UX** models the agent's lifecycle as a set of explicit interface states using a strict 12-state Finite State Machine (FSM).

🌐 **Live Demo:** [https://agentic-ui-kit.vercel.app/](https://agentic-ui-kit.vercel.app/)  
📦 **Open Source:** [https://github.com/stasdodesign/agentic-ui-kit](https://github.com/stasdodesign/agentic-ui-kit)  
👤 **Concept & Design:** Stanislav Dovidenko — Product Designer  
🌐 **Portfolio:** [https://stanislavdovidenko.com/](https://stanislavdovidenko.com/)

---

## 📌 The Problem: The Cognitive Visibility Gap

A chat bubble with a spinner is enough for a simple text answer, but it breaks down when an agent:
* Decomposes a multi-step task
* Calls external tools, APIs, or MCP servers
* Waits for a database, lock, or remote system
* Needs additional clarification or parameters
* Requires explicit Human-in-the-Loop authorization
* Executes a consequential or irreversible action
* Encounters an error and needs recovery
* Completes a task and summarizes the result

---

## 🗂️ The 12 Canonical States

The framework groups 12 states across 4 lifecycle phases:

| # | State (`AgentState`) | Phase | UX Purpose |
|---|---|---|---|
| 1 | `idle` | Intake | Agent is ready and waiting for a task or trigger. |
| 2 | `listening` | Intake | Agent receives voice, text, or streaming input. |
| 3 | `thinking` | Cognition | Agent interprets the request and extracts intent. |
| 4 | `planning` | Cognition | Agent prepares a multi-step execution plan. |
| 5 | `asking-clarification` | Cognition | Agent needs additional information to continue safely. |
| 6 | `waiting` | Action | Agent is waiting for an external resource, lock, or response. |
| 7 | `tool-calling` | Action | Agent invokes an external tool, API, database, or MCP endpoint. |
| 8 | `processing` | Action | Agent validates and synthesizes tool output. |
| 9 | `asking-confirmation` | Action | **Human-in-the-Loop gate** before a consequential action. |
| 10 | `executing` | Action | Agent commits the approved mutation or operation. |
| 11 | `failed` | Resolution | Execution stopped; recovery options presented. |
| 12 | `completed` | Resolution | Task finished; summary and atomic Undo provided. |

---

## 🧪 Interactive Studio & Features

* **12-State Interactive Studio:** Inspect every state card individually in real time.
* **Workflow Simulator:** Run automated playback through state sequences.
* **Human-in-the-Loop (HITL) Gate:** Surface risk levels, affected resources, impact analysis, and reversible/irreversible badges with Approve/Reject controls.
* **Tool Call Inspector:** Inspect tool names, protocol (MCP/REST/SQL), parameters, execution latency, and response output.
* **Live JSON Payload Editor:** Modify state parameters directly in the playground with instant UI updates.
* **Action History Audit Log:** Real-time chronological audit trail of dispatched actions.
* **12-State Matrix:** View all 12 states side-by-side for design reviews and consistency checks.

---

## 🏢 Enterprise Scenarios

The reference implementation includes 2 self-contained enterprise scenarios with static mock data:
1. **PostgreSQL Database Migration:** High-risk production DDL schema change with Exclusive Table Lock warnings, safety confirmation gates, and error recovery.
2. **Customer Support Dispute & Refund:** Multi-step financial transaction lookup, policy check, refund execution, and atomic Undo window.

---

## 🛠️ Tech Stack & Project Structure

* **Framework:** Next.js 15 (App Router), React 19, TypeScript
* **Styling & Motion:** Tailwind CSS v4, Motion, Lucide React

```text
.
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Playground.tsx
│   ├── mockData.ts
│   └── agentic-ux/
│       ├── AgentStateRenderer.tsx
│       ├── AgentStatusBadge.tsx
│       ├── ApprovalCard.tsx
│       ├── ClarificationPanel.tsx
│       ├── CompletedSummary.tsx
│       ├── ErrorRecoveryPanel.tsx
│       ├── ListeningVisualizer.tsx
│       ├── ReasoningAccordion.tsx
│       └── ToolCallWidget.tsx
├── types.ts
├── README.md
├── README.ru.md
└── package.json
```

*Note:* The repository is currently structured as a **reference implementation and interactive playground**, not as a published npm package (`"private": true`).

---

## 🚀 Quick Start

```bash
git clone https://github.com/stasdodesign/agentic-ui-kit.git
cd agentic-ui-kit
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👤 Author & Licensing

* **Author:** Stanislav Dovidenko — Product Designer (AI Systems, Agentic UX, Enterprise SaaS)
* **Portfolio:** [https://stanislavdovidenko.com/](https://stanislavdovidenko.com/)
* **LinkedIn:** [https://www.linkedin.com/in/stasdodesign](https://www.linkedin.com/in/stasdodesign)
* **Telegram:** [https://t.me/StasDoDesign](https://t.me/StasDoDesign)
* **License:** Distributed under the **MIT License** (see `LICENSE`).