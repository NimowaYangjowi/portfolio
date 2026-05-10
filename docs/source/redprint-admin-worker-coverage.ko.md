# Redprint Admin & Worker 커버리지 맵 (한국어)

이 문서는 Redprint 포트폴리오에서 어드민 기능과 worker 기능을 빠짐없이 다루기 위한 보조 문서다.  
메인 showcase 문서가 “대표 구현 항목”을 설명한다면, 이 문서는 “운영자가 실제로 다루는 기능 범위”와 “백그라운드에서 돌아가는 작업 범위”를 한눈에 보여준다.

showcase 문서가 전시용 설명이라면 이 문서는 백스테이지 체크리스트다.

## 1. Admin Operations Hub

### 포트폴리오용 설명

Redprint의 admin surface는 단순 관리자 페이지가 아니라, 콘텐츠 심사, 사용자 활동 분석, 결제·정산 운영, 스토리지 점검, worker 상태 확인, 알림 발송, 베타 운영, 피드백 관리까지 묶은 operations hub다. 각 화면은 운영자가 문제를 발견하고, 상태를 검증하고, 필요한 조치를 실행할 수 있도록 API, audit log, status card, table, modal, dry-run flow와 연결된다.

서비스 뒤편에서 운영자가 보는 조종석이다. 상품이 제대로 올라왔는지, 돈이 맞게 흘렀는지, worker가 살아 있는지, 사용자가 문제를 보냈는지 확인하는 곳이다.

### 포함할 어드민 기능

| 기능 영역 | 사용자 화면 | 포트폴리오에서 강조할 구현 |
|---|---|---|
| Admin dashboard | `/admin` | 기능 grid, pinned shortcuts, 운영 stats card |
| User Activity | `/admin/users` | 유저 활동 KPI, 필터링, 개별 유저 activity detail panel |
| Asset Review | `/admin/asset-review` | 제출 상품 심사, media review, NSFW 판단, quick reject, revision review |
| Prompt Ops | `/admin/prompt-ops` | 프롬프트 공개 상태 제어, 문제 flag, tag editing, export, batch visibility |
| Admin Finance | `/admin/finance` | monthly close, ledger explorer, reconciliation, revenue summary, tax registrations, tax remittance |
| Treasury | `/admin/treasury` | pending settlements, payout exceptions, dry-run, payout execution, provider payout recovery |
| Support Inbox | `/admin/support` | 구매 분쟁 검토, canonical transcript 확인, refund approve/deny |
| R2 Storage | `/admin/r2-storage` | storage stats, file explorer, orphan file scan/delete, DB reference check |
| Transcode Monitor | `/admin/transcode` | video transcode job stats, failed job review, processing dashboard |
| Worker Operations | `/admin/worker-ops` | active worker, heartbeat, queue pressure, backup verification history |
| Upstash Usage | `/admin/upstash-usage` | Redis usage summary, route diagnostic session, history drilldown |
| Environment Health | `/admin/environment-health` | env config health, deployment impact, integration readiness table |
| Notifications | `/admin/notifications` | broadcast creation, target selection, send history |
| Audit Logs | `/admin/audit-logs` | admin action tracking, filters, expandable metadata |
| Todos | `/admin/todos` | internal task tracking, priority/due date/tags |
| Beta Program | `/admin/beta-program` | invitations, manual enroll, participant management, creator fee override |
| Feedback | `/admin/feedback` | platform feedback triage, status update, detail modal |
| Danbooru Sync | `/admin/danbooru-sync` | tag sync, tag search, sync status, cached tag stats |
| PromptBase Scraper | `/admin/promptbase-scraper` | external profile scraping controls, progress, summary |
| Local Midjourney Selection | `/admin/local-midjourney-selection` | local-only candidate image selection and publishing package prep |
| Icon Showcase | `/admin/icon-showcase` | icon library comparison, AI model icon preview, visual selection support |
| Design Token | `/admin/design-token` | font/token experiment lab, visual governance testing |

### 시각적 프레젠테이션 아이디어

- **Admin Command Center**: admin feature grid를 운영 영역별로 묶어 보여준다.
- **Operations Health Strip**: finance, storage, worker, Redis, environment, support 상태를 한 줄 summary card로 보여준다.
- **Audit Trail Drawer**: admin action을 클릭하면 누가, 언제, 어떤 entity를 바꿨는지 펼쳐진다.
- **Dry-run Before Execute**: Treasury나 orphan file delete처럼 위험한 작업은 dry-run 결과를 먼저 보여주는 흐름으로 표현한다.
- **Review Queue Demo**: asset review, support inbox, feedback triage를 “운영자가 판단하는 queue”로 묶어 보여준다.

## 2. Worker Operations Plane

### 포트폴리오용 설명

Redprint의 worker 기능은 업로드 후처리만 담당하지 않는다. media tagging, image derivative, video transcode, upload session cleanup, stale processing recovery, stuck checkout reconciliation, scheduled payout planning/execution/retry, webhook cleanup, support timeout policy, worker heartbeat, failover control까지 포함하는 background operations plane이다.

사용자가 버튼을 누른 뒤 뒤에서 계속 돌아가는 작업반이다. 이미지에 태그를 붙이고, 영상을 변환하고, 멈춘 결제를 복구하고, 지급 예약을 실행하고, worker가 죽으면 backup으로 넘기는 일까지 담당한다.

### 포함할 worker 기능

| 기능 영역 | 관련 surface/API | 포트폴리오에서 강조할 구현 |
|---|---|---|
| Tagging Queue | `/api/tagging/queue`, `/api/internal/tagging/backfill` | FIFO queue, claim/complete contract, retry, backfill |
| Temp Media Status | upload flow, `temp_media` | upload/tagging/derivative 상태 분리, polling contract |
| Image Public Derivatives | `media_derivative_jobs` | sanitized WebP derivative, public storefront readiness gate |
| Video Transcoding | `media_transcode_jobs`, `/admin/transcode` | MP4 variant generation, transcode job monitor, failed job recovery |
| Prompt Import Tagging | `/api/internal/tagging/backfill-prompt-imports` | imported media tagging backfill and retry |
| Upload Session Cleanup | `/api/internal/cron/cleanup-expired-sessions` | expired session cleanup, rollback recovery |
| Stale Processing Recovery | `/api/internal/cron/stale-processing` | long-running processing detection and recovery |
| Stale Batch Sweeper | `/api/internal/cron/stale-batch-sweeper` | stale batch cleanup and payment/processing consistency |
| Stuck Checkout Reconciliation | `/api/internal/cron/reconcile-stuck-checkouts` | paid-but-not-finalized checkout recovery |
| Pending Accounting Reconciliation | cleanup/reconciliation jobs | pending journal/accounting event replay |
| Creator Balance Reconciliation | cleanup/reconciliation jobs | creator payable drift detection |
| Scheduled Payout Planner | `/api/internal/cron/scheduled-payouts-planner` | durable payout window materialization |
| Scheduled Payout Executor | `/api/internal/cron/scheduled-payouts-executor` | due payout execution, fallback behavior |
| Scheduled Payout Retry | `/api/internal/cron/scheduled-payouts-retry` | failed or budget-deferred payout retry |
| Webhook Cleanup | `/api/internal/cron/webhook-cleanup` | stale webhook event cleanup/recovery |
| Support Policy Sweep | `/api/internal/support/policy-sweep` | 24h/48h warning, 72h automatic support outcomes |
| Daily Cleanup Lane | `/api/internal/cron/cleanup` | daily maintenance orchestration with worker-owned phase boundaries |
| Worker Heartbeat | `/api/internal/workers/heartbeat` | active worker identity, modules, heartbeat state |
| Worker Failover | `/api/internal/workers/failover`, HetrixTools route | local primary to Railway backup control flow |
| Active Worker URL | `src/lib/worker-control/active-worker-url.ts` | active worker base URL selection |
| Railway Backup Orchestration | `src/lib/worker-control/railway-backup-orchestrator.ts` | sleeping backup wake, refresh, park flow |

### 시각적 프레젠테이션 아이디어

- **Worker Lane Map**: media lane, finance lane, support lane, maintenance lane, failover lane을 나눠 보여준다.
- **Queue Lifecycle Diagram**: enqueue -> claim -> heartbeat/lease -> complete/fail -> retry/backfill.
- **Failover Simulator**: local worker down event가 들어오면 Railway backup을 깨우고 control plane을 refresh하는 흐름.
- **Scheduled Ops Calendar**: payout planner/executor/retry, cleanup, webhook cleanup, support policy sweep을 시간표처럼 보여준다.
- **Readiness Gate Demo**: worker가 derivative/transcode를 완료하기 전에는 public card가 닫혀 있고, 완료 후 열리는 상태 전환.

## 3. 메인 포트폴리오에 넣는 방법

메인 페이지에는 모든 admin/worker 항목을 카드로 다 넣기보다, 아래처럼 묶어 보여주는 편이 좋다.

- `Admin Operations Hub`: 심사, 정산, 스토리지, 지원, 알림, 피드백, 환경, Redis, worker 운영을 하나로 묶은 운영자 조종석
- `Worker Operations Plane`: 미디어 후처리, 결제 복구, 정산 예약, 지원 timeout, heartbeat/failover를 담당하는 백그라운드 작업 시스템

세부 목록은 case study 안의 accordion, tab, 또는 “Coverage Map” 섹션으로 열어 보여주면 된다.
