import { AgentState, AgentStatePayload } from '@/types';

export interface ScenarioDefinition {
  id: string;
  name: string;
  description: string;
  states: Record<AgentState, AgentStatePayload>;
}

export const SCENARIOS: ScenarioDefinition[] = [
  {
    id: 'db-migration',
    name: 'PostgreSQL Database Migration',
    description: 'High-stakes production schema change with critical HITL authorization gate.',
    states: {
      idle: {
        message: 'Connected to AWS RDS PostgreSQL cluster (db-prod-us-east-1). Ready for migration script.',
      },
      listening: {
        inputTranscript: '"Agent, analyze the billing_subscriptions table and migrate the legacy billing cycle enum."',
        message: 'Capturing streaming audio instructions from DevOps lead...',
      },
      thinking: {
        message: 'Analyzing SQL dependencies, inspecting foreign keys, checking table locks and read replicas...',
        intent: 'ALTER TABLE billing_subscriptions MODIFY COLUMN billing_tier TO enum_tier_v2',
      },
      planning: {
        message: 'Constructed 4-phase transaction plan with automatic rollback points:',
        plan: [
          {
            id: 'p1',
            label: 'Verify AWS IAM role & session security token',
            status: 'completed',
            durationMs: 45,
            detail: 'Verified role arn:aws:iam::611629790173:role/DevOpsEngine with RDS write access.',
          },
          {
            id: 'p2',
            label: 'Fetch live connection pool stats & active query locks',
            status: 'completed',
            durationMs: 110,
            detail: 'pg_stat_activity returned 14 active clients; replication lag is 8ms.',
          },
          {
            id: 'p3',
            label: 'Execute DDL migration transaction in dry-run mode',
            status: 'in_progress',
            detail: 'Testing constraints in isolated temporary sandbox with staging snapshot.',
          },
          {
            id: 'p4',
            label: 'Apply changes concurrently & refresh index stats',
            status: 'pending',
            detail: 'Requires human authorization before committing to production.',
          },
        ],
      },
      'asking-clarification': {
        message: 'Multiple target clusters detected. Which environment should this schema update apply to?',
        clarificationOptions: [
          {
            id: 'stg',
            label: 'Staging Sandbox (us-east-1)',
            hint: 'Zero traffic impact, recommended for pre-flight verification.',
            isRecommended: true,
          },
          {
            id: 'canary',
            label: 'Canary Cluster (5% read traffic)',
            hint: 'Live customer verification on isolated read replica.',
          },
          {
            id: 'prod',
            label: 'Production Primary (Multi-Region)',
            hint: 'Immediate table lock on primary master database.',
          },
        ],
      },
      waiting: {
        message: 'Acquiring transactional advisory lock (lock_id: 849204) on pg_catalog. Waiting for active long-running query to finalize...',
      },
      'tool-calling': {
        tool: {
          toolName: 'rds_postgres_mutation_executor',
          serverOrProtocol: 'MCP',
          endpoint: 'mcp://rds-controller.internal:9002',
          parameters: {
            cluster: 'prod-primary-db-01',
            schema: 'public',
            table: 'billing_subscriptions',
            mutation: 'ALTER TABLE billing_subscriptions ADD COLUMN tier_v2 varchar(32);',
            timeoutMs: 8000,
            dryRun: false,
          },
          executionTimeMs: 142,
          output: {
            rowsAffected: 0,
            lockDurationMs: 42,
            schemaVersion: '2026.09.28-01',
            status: 'TRANSACTION_STAGED',
          },
        },
      },
      processing: {
        message: 'Validating post-migration indices, testing 500 sample subscription rows, and checking foreign key integrity.',
      },
      'asking-confirmation': {
        confirmation: {
          actionTitle: 'Commit Production Schema Alteration & Drop Legacy Index',
          riskLevel: 'critical',
          details: 'This operation will acquire an exclusive table lock on billing_subscriptions for ~350ms, modifying 3,412 live customer records. If interrupted, rollback requires manual point-in-time recovery.',
          reversible: false,
          affectedResource: 'aws-rds://production-primary.cluster/billing_subscriptions',
          consequences: [
            'Exclusive write lock on table for approximately 350ms',
            'Permanent drop of legacy index idx_subs_cycle_v1',
            'All billing webhook workers will pause processing for 1 second',
          ],
          payloadToExecute: {
            targetEnv: 'production-primary',
            command: 'COMMIT; DROP INDEX CONCURRENTLY idx_subs_cycle_v1;',
            lockTimeoutMs: 1000,
            notifiedChannels: ['#incident-response', '#eng-deployments'],
          },
        },
      },
      executing: {
        message: 'Executing transactional commit on production master. Replicating WAL logs to replicas. Do not terminate connection.',
      },
      failed: {
        error: {
          code: 'ERR_POSTGRES_LOCK_TIMEOUT',
          message: 'Deadlock risk detected: Lock wait timeout exceeded (HTTP 408). Query aborted safely before mutating tables.',
          recoverable: true,
          suggestedAction: 'retry',
          details: 'Postgres Error 55P03: lock_not_available. Concurrent query PID 41203 held exclusive row lock.',
        },
      },
      completed: {
        summary: {
          metrics: {
            executionTimeMs: 482,
            tokensUsed: 1640,
            stepsCount: 4,
            toolCallsCount: 2,
            costEstimate: '$0.0034',
          },
          affectedEntities: [
            'public.billing_subscriptions (3,412 rows modified)',
            'idx_subs_tier_v2 (B-Tree index built)',
            'audit_events_log (1 mutation record persisted)',
          ],
          rollbackAvailable: true,
          resultSummary: 'Database schema successfully upgraded to tier_v2 with zero replication latency.',
        },
      },
    },
  },
  {
    id: 'customer-refund',
    name: 'Customer Support Dispute & Refund',
    description: 'Autonomous financial adjustment with medium risk and instant reversibility.',
    states: {
      idle: {
        message: 'Stripe & Zendesk MCP integrations initialized. Awaiting dispute ticket queue trigger.',
      },
      listening: {
        inputTranscript: '"Authorize a full refund for customer order #TX-90412 due to damaged transit goods."',
        message: 'Processing customer care voice memo and audio metadata...',
      },
      thinking: {
        message: 'Looking up order history, checking chargeback status, verifying refund policy boundaries...',
        intent: 'Issue refund for Stripe charge ch_3P09vB2eZvKYlo2C',
      },
      planning: {
        message: 'Dispute resolution plan synthesized:',
        plan: [
          {
            id: 'r1',
            label: 'Fetch Stripe charge ID and transaction ledger',
            status: 'completed',
            durationMs: 82,
            detail: 'Found charge ch_3P09vB2eZvKYlo2C for $189.00 USD, paid via Visa ···· 4242.',
          },
          {
            id: 'r2',
            label: 'Check carrier delivery tracking for damage claim',
            status: 'completed',
            durationMs: 140,
            detail: 'FedEx API reports exception: Damaged outer parcel reported in transit.',
          },
          {
            id: 'r3',
            label: 'Request manager sign-off for refund > $100',
            status: 'in_progress',
            detail: 'Threshold policy requires human verification for amounts exceeding $100.',
          },
          {
            id: 'r4',
            label: 'Dispatch Stripe refund API call and close Zendesk ticket',
            status: 'pending',
          },
        ],
      },
      'asking-clarification': {
        message: 'The customer paid $189.00 for item + $25.00 for express shipping. How much should be refunded?',
        clarificationOptions: [
          {
            id: 'item-only',
            label: 'Item Only ($189.00)',
            hint: 'Standard return policy: shipping is non-refundable.',
          },
          {
            id: 'full-amount',
            label: 'Full Order + Shipping ($214.00)',
            hint: 'Recommended for carrier damage exceptions.',
            isRecommended: true,
          },
          {
            id: 'store-credit',
            label: 'Store Credit + 10% Bonus ($235.40)',
            hint: 'Keeps funds within ecosystem.',
          },
        ],
      },
      waiting: {
        message: 'Waiting for Stripe webhook event invoice.payment_succeeded confirmation...',
      },
      'tool-calling': {
        tool: {
          toolName: 'mcp_stripe_refund_charge',
          serverOrProtocol: 'REST',
          endpoint: 'https://api.stripe.com/v1/refunds',
          parameters: {
            charge: 'ch_3P09vB2eZvKYlo2C',
            amount: 21400,
            reason: 'fraudulent_or_damaged',
            refund_application_fee: false,
          },
          executionTimeMs: 218,
          output: {
            id: 're_3P09vB2eZvKYlo2C01',
            status: 'succeeded',
            currency: 'usd',
            amount: 21400,
          },
        },
      },
      processing: {
        message: 'Updating CRM account tier, generating PDF credit memo, and composing customer notification email.',
      },
      'asking-confirmation': {
        confirmation: {
          actionTitle: 'Authorize Full Order Refund of $214.00 USD',
          riskLevel: 'medium',
          details: 'This will issue an immediate electronic refund of $214.00 USD to Visa card ending in 4242. This transaction is reversible by Stripe support within 24 hours.',
          reversible: true,
          affectedResource: 'Stripe Account acct_1HqK8e · Customer cus_82910',
          consequences: [
            '$214.00 will be deducted from Stripe balance',
            'Customer will receive funds within 3–5 business days',
            'Zendesk dispute ticket #88412 will be resolved',
          ],
          payloadToExecute: {
            chargeId: 'ch_3P09vB2eZvKYlo2C',
            amountUsd: 214.0,
            notifyCustomer: true,
            reason: 'carrier_damage',
          },
        },
      },
      executing: {
        message: 'Submitting refund to payment gateway and notifying payment network...',
      },
      failed: {
        error: {
          code: 'ERR_STRIPE_CARD_DISPUTED',
          message: 'The customer has already initiated a formal chargeback dispute with their issuing bank.',
          recoverable: false,
          suggestedAction: 'escalate',
          details: 'Stripe Error 409: charge_already_refunded_or_disputed.',
        },
      },
      completed: {
        summary: {
          metrics: {
            executionTimeMs: 312,
            tokensUsed: 940,
            stepsCount: 4,
            toolCallsCount: 2,
          },
          affectedEntities: [
            'Stripe Refund: re_3P09vB2eZvKYlo2C01 ($214.00)',
            'Zendesk Ticket #88412 (Marked Solved)',
            'Customer Timeline (Credit notice sent)',
          ],
          rollbackAvailable: true,
          resultSummary: 'Refund processed successfully. Customer received automated settlement notice.',
        },
      },
    },
  },
];
