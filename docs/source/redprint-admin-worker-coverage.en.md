# Redprint Admin & Worker Coverage Map (English)

This document expands the portfolio outline with full admin and worker coverage.  
The main showcase document explains the representative portfolio systems; this file shows the operational scope behind those systems.

Put simply, the showcase document is the exhibition floor, and this file is the backstage checklist.

## 1. Admin Operations Hub

### Portfolio Description

Redprint's admin surface is not a simple admin page. It is an operations hub for content review, user activity, finance, treasury, storage inspection, worker status, notifications, beta operations, feedback, and internal governance. Each admin surface connects UI tables, status cards, modals, dry-run flows, audit logs, and protected APIs so operators can inspect state and take action safely.

### Admin Features To Include

| Area | Surface | Implementation Angle |
|---|---|---|
| Admin Dashboard | `/admin` | Feature grid, pinned shortcuts, operational stats |
| User Activity | `/admin/users` | User KPIs, filters, per-user activity detail panel |
| Asset Review | `/admin/asset-review` | Submission review, media review, NSFW decisions, quick reject, revision review |
| Prompt Ops | `/admin/prompt-ops` | Prompt visibility control, issue flags, tag editing, export, batch visibility |
| Admin Finance | `/admin/finance` | Monthly close, ledger explorer, reconciliation, revenue summary, tax registrations, tax remittance |
| Treasury | `/admin/treasury` | Pending settlements, payout exceptions, dry-run, payout execution, provider payout recovery |
| Support Inbox | `/admin/support` | Purchase dispute review, canonical transcript, refund approve/deny |
| R2 Storage | `/admin/r2-storage` | Storage stats, file explorer, orphan scan/delete, DB reference checks |
| Transcode Monitor | `/admin/transcode` | Video transcode job stats, failed job review, processing dashboard |
| Worker Operations | `/admin/worker-ops` | Active worker, heartbeat, queue pressure, backup verification history |
| Upstash Usage | `/admin/upstash-usage` | Redis usage summary, route diagnostic sessions, history drilldown |
| Environment Health | `/admin/environment-health` | Env config health, deployment impact, integration readiness table |
| Notifications | `/admin/notifications` | Broadcast creation, target selection, send history |
| Audit Logs | `/admin/audit-logs` | Admin action tracking, filters, expandable metadata |
| Todos | `/admin/todos` | Internal task tracking, priority, due date, tags |
| Beta Program | `/admin/beta-program` | Invitations, manual enrollment, participant management, creator fee overrides |
| Feedback | `/admin/feedback` | Platform feedback triage, status updates, detail modal |
| Danbooru Sync | `/admin/danbooru-sync` | Tag sync, tag search, sync status, cached tag stats |
| PromptBase Scraper | `/admin/promptbase-scraper` | External profile scraping controls, progress, summary |
| Local Midjourney Selection | `/admin/local-midjourney-selection` | Local-only candidate image selection and publishing package prep |
| Icon Showcase | `/admin/icon-showcase` | Icon library comparison, AI model icon preview, visual selection support |
| Design Token | `/admin/design-token` | Font/token experiment lab and visual governance testing |

### Visual Presentation Ideas

- **Admin Command Center**: group the admin feature grid by operational area.
- **Operations Health Strip**: summarize finance, storage, worker, Redis, environment, and support health.
- **Audit Trail Drawer**: expand an admin action to show who changed what and when.
- **Dry Run Before Execute**: show how risky actions expose a preview before execution.
- **Review Queue Demo**: group asset review, support inbox, and feedback triage as operator decision queues.

## 2. Worker Operations Plane

### Portfolio Description

Redprint's worker layer covers more than upload processing. It includes media tagging, image derivatives, video transcoding, upload session cleanup, stale processing recovery, stuck checkout reconciliation, scheduled payout planning/execution/retry, webhook cleanup, support timeout policy, worker heartbeat, and failover control.

Put simply, it is the background operations team that keeps the product moving after the user clicks a button.

### Worker Features To Include

| Area | Surface/API | Implementation Angle |
|---|---|---|
| Tagging Queue | `/api/tagging/queue`, `/api/internal/tagging/backfill` | FIFO queue, claim/complete contract, retry, backfill |
| Temp Media Status | upload flow, `temp_media` | Separate upload/tagging/derivative states and polling contract |
| Image Public Derivatives | `media_derivative_jobs` | Sanitized WebP derivative and storefront readiness gate |
| Video Transcoding | `media_transcode_jobs`, `/admin/transcode` | MP4 variant generation, job monitor, failed job recovery |
| Prompt Import Tagging | `/api/internal/tagging/backfill-prompt-imports` | Imported media tagging backfill and retry |
| Upload Session Cleanup | `/api/internal/cron/cleanup-expired-sessions` | Expired session cleanup and rollback recovery |
| Stale Processing Recovery | `/api/internal/cron/stale-processing` | Long-running processing detection and recovery |
| Stale Batch Sweeper | `/api/internal/cron/stale-batch-sweeper` | Stale batch cleanup and payment/processing consistency |
| Stuck Checkout Reconciliation | `/api/internal/cron/reconcile-stuck-checkouts` | Paid-but-not-finalized checkout recovery |
| Pending Accounting Reconciliation | cleanup/reconciliation jobs | Pending journal/accounting event replay |
| Creator Balance Reconciliation | cleanup/reconciliation jobs | Creator payable drift detection |
| Scheduled Payout Planner | `/api/internal/cron/scheduled-payouts-planner` | Durable payout window materialization |
| Scheduled Payout Executor | `/api/internal/cron/scheduled-payouts-executor` | Due payout execution and fallback behavior |
| Scheduled Payout Retry | `/api/internal/cron/scheduled-payouts-retry` | Failed or budget-deferred payout retry |
| Webhook Cleanup | `/api/internal/cron/webhook-cleanup` | Stale webhook event cleanup/recovery |
| Support Policy Sweep | `/api/internal/support/policy-sweep` | 24h/48h warnings and 72h automatic support outcomes |
| Daily Cleanup Lane | `/api/internal/cron/cleanup` | Daily maintenance orchestration with worker-owned phase boundaries |
| Worker Heartbeat | `/api/internal/workers/heartbeat` | Active worker identity, enabled modules, heartbeat state |
| Worker Failover | `/api/internal/workers/failover`, HetrixTools route | Local primary to Railway backup control flow |
| Active Worker URL | `src/lib/worker-control/active-worker-url.ts` | Active worker base URL selection |
| Railway Backup Orchestration | `src/lib/worker-control/railway-backup-orchestrator.ts` | Sleeping backup wake, refresh, and park flow |

### Visual Presentation Ideas

- **Worker Lane Map**: split the worker plane into media, finance, support, maintenance, and failover lanes.
- **Queue Lifecycle Diagram**: enqueue -> claim -> heartbeat/lease -> complete/fail -> retry/backfill.
- **Failover Simulator**: show local worker down -> Railway backup wake -> control plane refresh.
- **Scheduled Ops Calendar**: show payout planner/executor/retry, cleanup, webhook cleanup, and support policy sweep as scheduled lanes.
- **Readiness Gate Demo**: public cards stay closed until worker-generated derivatives/transcodes are ready.

## 3. How To Use This In The Main Portfolio

Do not place every admin and worker feature as an equal top-level card. Use two parent systems:

- `Admin Operations Hub`: the operator cockpit for review, finance, storage, support, notifications, feedback, environment, Redis, and worker monitoring.
- `Worker Operations Plane`: the background system for media processing, payment recovery, scheduled payouts, support timeouts, heartbeat, and failover.

The full lists can live inside a case-study accordion, tabbed coverage map, or expandable “Operations Coverage” section.
