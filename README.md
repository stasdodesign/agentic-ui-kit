# 🤖 Agentic UX: 12-State Framework for AI Agents. Design System & Interactive Playground

> **Enterprise-стандарт пользовательского интерфейса для автономных AI-агентов (Next.js 15, React 19, TypeScript, Tailwind CSS, Motion).**  
> 🌐 **Живая демонстрация (Live Demo на Vercel):** [https://agentic-ui-kit.vercel.app/](https://agentic-ui-kit.vercel.app/)  
> Автор концепции и дизайна: **Станислав Довиденко (Stanislav Dovidenko)** — *Product Designer* 
> 📩 **Связаться в Telegram:** [https://t.me/StasDoDesign](https://t.me/StasDoDesign)  
> ✉️ **Написать на почту:** [Stanislavskii.yo@gmail.com](mailto:Stanislavskii.yo@gmail.com)
---

## 📌 О проекте

При взаимодействии с автономными AI-агентами ключевая проблема традиционного UX — **«когнитивный разрыв» (Cognitive Visibility Gap)**: пользователь не понимает, завис ли агент, какие системные команды он вызывает в фоне и какие необратимые действия готовится совершить.

**Agentic UX** решает эту проблему через строгую **конечную машину состояний (Finite State Machine, FSM)** из 12 канонических фаз с прозрачной цепочкой рассуждений (Chain of Thought), инспекцией MCP/API-вызовов и обязательным Human-in-the-Loop барьером для критических операций.

---

## 🌟 Ключевые возможности

1. **12 канонических состояний агента:**
   - Каждое состояние имеет выделенный цвет, индикатор, иконку, уровень прозрачности и семантическую цель.
2. **Interactive Studio:**
   - 4 реалистичных enterprise-сценария (миграция PostgreSQL, оформление возврата клиенту, масштабирование Kubernetes-подов, юридический анализ договоров).
   - Интерактивный эмулятор с возможностью шагать по FSM вручную или запускать авто-симуляцию рабочего процесса.
   - Редактор входных данных (JSON Payload Editor) в реальном времени с валидацией.
   - Журнал выполненных действий (Action History Log) с фиксацией переходов.
   - Готовый генератор JSX-кода для интеграции в сторонние проекты.
3. **12-State Matrix:**
   - Галерея одновременного просмотра всех 12 состояний для дизайн-аудита и проверки согласованности типографики и цветовой палитры.
4. **Architecture & Rules:**
   - Подробная интерактивная документация: 4 столпа доверия к AI, матрица допустимых переходов и правила безопасного внедрения.
5. **Адаптивность и доступность:**
   - 100% адаптивный дизайн для мобильных устройств (гамбургер-меню, защита от переполнения длинных URL с `break-all`, перенос тегов).
   - Поддержка темной и светлой тем с соблюдением контрастности **WCAG AA**.

---

## 🗂️ 12 канонических состояний FSM

| # | Состояние (`AgentState`) | Фаза | UX-цель и назначение |
|---|--------------------------|------|----------------------|
| 1 | `idle` | `Input` | Агент готов к приему задачи, отображает подсказки и контекст. |
| 2 | `listening` | `Input` | Фиксация входящего запроса (голос / текст) с визуализацией активности. |
| 3 | `thinking` | `Cognitive` | Пошаговый показ цепочки рассуждений (Chain-of-Thought) без псевдо-ожидания. |
| 4 | `planning` | `Cognitive` | Декомпозиция сложной цели на этапы с отображением зависимостей. |
| 5 | `tool-calling` | `Execution` | Прозрачный вызов внешних инструментов (MCP/REST/SQL) с параметрами и временем. |
| 6 | `waiting` | `Execution` | Ожидание внешней асинхронной блокировки или распределенной транзакции. |
| 7 | `clarifying` | `Interaction`| Разрешение неоднозначностей: агент запрашивает выбор у пользователя. |
| 8 | `processing` | `Execution` | Агрегация, валидация и парсинг результатов вызова инструментов. |
| 9 | `asking-confirmation` | `Interaction`| **Human-in-the-Loop Guardrail:** подтверждение рискованных/необратимых мутаций. |
| 10| `executing` | `Execution` | Непосредственная фиксация транзакции и применение изменений. |
| 11| `completed` | `Resolution` | Успешное завершение задачи с кратким отчетом и окном для отмены (Undo). |
| 12| `failed` | `Resolution` | Понятная диагностика сбоя с кнопками безопасного повтора или отката. |

---

## 🚀 Быстрый старт

### Требования
- **Node.js**: `v20.x` или новее
- **npm** / **yarn** / **pnpm**

### Установка и запуск

1. **Клонируйте репозиторий или откройте папку проекта:**
   ```bash
   cd ai-studio-applet
   ```

2. **Установите зависимости:**
   ```bash
   npm install
   ```

3. **Запустите локальный сервер разработки:**
   ```bash
   npm run dev
   ```
   Приложение откроется по адресу `http://localhost:3000`.

4. **Проверка линтером и сборка:**
   ```bash
   npm run lint
   npm run build
   ```

---

## 🛠️ Структура проекта

```text
├── app/
│   ├── layout.tsx                # Корневой лэйаут с метаданными и шрифтами
│   ├── page.tsx                  # Главная страница (подключает Playground)
│   └── globals.css               # Стили Tailwind CSS v4
├── components/
│   ├── Playground.tsx            # Интерактивная студия, матрица и документация
│   ├── mockData.ts               # Предустановленные enterprise-сценарии
│   └── agentic-ux/
│       ├── AgentStateRenderer.tsx    # Главный контроллер рендеринга состояния
│       ├── AgentStatusBadge.tsx      # Семантический бейдж статуса с пинг-анимацией
│       ├── ReasoningChain.tsx        # Компонент цепочки рассуждений (CoT)
│       ├── PlanList.tsx              # Интерактивный список шагов плана
│       ├── ToolCallWidget.tsx        # Инспектор параметров и вывода MCP-инструментов
│       ├── ApprovalCard.tsx          # Карточка Human-in-the-Loop подтверждения
│       ├── ClarificationSelector.tsx # Селектор уточнения неоднозначностей
│       ├── CompletionSummary.tsx     # Итоговый отчет с кнопкой отмены (Undo)
│       └── FailureCard.tsx           # Диагностическая карточка ошибки
├── types/
│   └── index.ts                  # Строгая типизация состояний, полезных данных и FSM
└── package.json
```

---

## 💻 Пример использования компонентов в вашем коде

Вы можете легко использовать `AgentStateRenderer` в любом React / Next.js приложении:

```tsx
'use client';

import React, { useState } from 'react';
import { AgentStateRenderer } from '@/components/agentic-ux/AgentStateRenderer';
import { AgentState, AgentAction } from '@/types';

export function MyAgentWidget() {
  const [state, setState] = useState<AgentState>('asking-confirmation');

  const handleAction = (action: AgentAction) => {
    switch (action.type) {
      case 'APPROVE':
        console.log('Пользователь подтвердил мутацию:', action.payload);
        setState('executing');
        break;
      case 'REJECT':
        console.log('Пользователь отклонил операцию');
        setState('idle');
        break;
      case 'UNDO':
        console.log('Откат выполнен');
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
          actionTitle: 'Изменение схемы таблицы и удаление старого индекса',
          riskLevel: 'critical',
          details: 'Операция заблокирует таблицу на ~350мс и затронет 3 412 записей.',
          reversible: false,
          affectedResource: 'aws-rds://production-primary.cluster/billing_subscriptions',
          consequences: [
            'Блокировка таблицы на запись ~350мс',
            'Удаление устаревшего индекса idx_subs_cycle_v1',
          ],
          payloadToExecute: { table: 'billing_subscriptions', dryRun: false },
        },
      }}
    />
  );
}
```

---

## 📱 Руководство пользователя (Как пользоваться проектом)

1. **Выбор сценария (Scenario Sandbox):**
   - В верхней панели Interactive Studio выберите один из 4 сценариев:
     - *PostgreSQL Migration* — сценарий с высоким риском и MCP-вызовами.
     - *Customer Refund* — бизнес-логика с валидацией транзакций.
     - *K8s Pod Scaling* — инфраструктурный сценарий с уточнениями кластеров.
     - *Legal Contract Analysis* — когнитивный анализ договоров.

2. **Ручное переключение состояний:**
   - Нажимайте на любое состояние в горизонтальной цепочке состояний (*idle*, *thinking*, *planning*, *tool-calling*, *asking-confirmation* и т.д.), чтобы увидеть, как компонент визуализирует конкретный шаг.

3. **Авто-симуляция (Auto-Run Workflow):**
   - Нажмите кнопку **«Auto-Run Workflow»** в хедере или верхней панели. Система начнет автоматически проводить агента по цепочке от постановки задачи до финализации.

4. **Интерактивные действия пользователя (Human-in-the-Loop):**
   - На шаге `clarifying` кликните по одному из вариантов выбора.
   - На шаге `asking-confirmation` нажмите **«Authorize & Commit»** или **«Reject & Abort»**, либо нажмите **«Edit Payload»** для правки параметров перед выполнением.
   - На шаге `completed` доступен таймер отмены **«Undo Action»**.

5. **Редактирование JSON в реальном времени:**
   - В правой колонке в блоке **State Payload (JSON)** нажмите **«Edit JSON»**, измените текст или параметры и нажмите **«Apply Payload Changes»** — интерфейс обновится мгновенно.

6. **Просмотр матрицы и документации:**
   - Переключитесь на вкладку **«12-State Matrix»** для сравнения всех 12 карточек.
   - Переключитесь на вкладку **«Architecture & Rules»** для изучения архитектурных стандартов и правил проектирования агентских систем.

---

## 👤 Автор и контакты

- **Станислав Довиденко (Stanislav Dovidenko)** — *Product Designer, Lead UX/UI Specialist for Agentic & Enterprise AI Systems*.
- **Telegram:** [https://t.me/StasDoDesign](https://t.me/StasDoDesign)
- **Email:** [Stanislavskii.yo@gmail.com](mailto:Stanislavskii.yo@gmail.com)
- **Живая демонстрация (Vercel):** [https://agentic-ui-kit.vercel.app/](https://agentic-ui-kit.vercel.app/)
- **Профиль в приложении:** кликните на бейдж автора в футере или мобильном меню для просмотра подробного резюме и ключевых кейсов.

---

## 💼 Индивидуальный аудит и интеграция (CTA)

> **Нужен индивидуальный UX-аудит или интеграция Agentic UX для вашего B2B AI-приложения? Свяжитесь со мной для 20-минутного асинхронного видеоразбора в Loom.**
>
> Разберём сценарии вашего AI-агента, цепочки рассуждений (CoT), контрольные точки подтверждений (Human-in-the-Loop) и поможем внедрить стандарт прозрачности, повышающий доверие и конверсию пользователей.
>
> 📩 **Связаться в Telegram:** [https://t.me/StasDoDesign](https://t.me/StasDoDesign)  
> ✉️ **Написать на почту:** [Stanislavskii.yo@gmail.com](mailto:Stanislavskii.yo@gmail.com)

---

## 📄 Лицензия

MIT License — свободное использование для коммерческих и образовательных проектов.
