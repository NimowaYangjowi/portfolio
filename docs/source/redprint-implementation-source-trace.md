# Redprint 구현 항목 Source Trace

이 문서는 `redprint-implementation-showcase-ideas.md`의 포트폴리오 항목을 실제 Redprint 프로젝트 위치와 연결하기 위한 참고용 목록이다.

포트폴리오에 “이런 구조를 만들었다”고 쓸 때 근거가 되는 코드와 문서의 주소록이다.

## 1. Multi-step Submission Workflow

- `src/app/upload/prompt/components/PromptFormV2.tsx`
- `src/app/upload/prompt/components/PromptStepRenderer.tsx`
- `src/hooks/upload/uploadProcessRunner.ts`
- `src/lib/actions/commit-prompt-create-action.ts`
- `docs/upload-flow-map.md`

## 2. Direct-to-Object-Storage Media Ingestion

- `src/hooks/upload/useUploadSession.ts`
- `src/hooks/upload/useR2Uploader.ts`
- `src/app/api/tagging/temp-upload/init/route.ts`
- `src/app/api/tagging/temp-upload/complete/route.ts`
- `src/db/schema/temp-media.ts`

## 3. Adaptive Discovery Feed Architecture

- `src/app/explore/components/ExplorePackedFeed.tsx`
- `src/app/explore/components/explorePackedLayout.ts`
- `src/app/explore/hooks/useExplorePreviewPrefetch.ts`
- `src/app/api/assets/previews/batch/route.ts`
- `docs/explore-page-guardrails.md`

## 4. Payment, Escrow, and Payout Control Layer

- `src/app/api/checkout/session/route.ts`
- `src/lib/stripe/cart-grouping.ts`
- `src/lib/stripe/fee-calculator.ts`
- `src/lib/stripe/handlers/checkout.ts`
- `src/lib/stripe/services/execute-payout.ts`
- `docs/payment-settlement-architecture.md`

## 5. Admin Finance, Ledger, and Reconciliation

- `src/app/admin/finance/MonthlyCloseClient.tsx`
- `src/app/admin/finance/components/LedgerExplorerTab.tsx`
- `src/app/admin/finance/components/ReconciliationTab.tsx`
- `src/lib/finance/creator-payable-rollforward.ts`
- `src/lib/accounting/post-journal-entry.ts`
- `docs/finance/admin-finance-operator-guide.md`

## 6. Worker-Owned Asynchronous Processing

- `src/lib/derivatives/queue-core.ts`
- `src/lib/derivatives/queue-queries.ts`
- `src/db/schema/media-derivative-jobs.ts`
- `src/db/schema/media-transcode-jobs.ts`
- `src/app/admin/transcode/JobsTable.tsx`

## 7. Purchase-Bound Dispute Workflow

- `src/app/api/support/route.ts`
- `src/app/support/tickets/[ticketId]/SupportConversationClient.tsx`
- `src/lib/support-room/policy-sweep.ts`
- `src/lib/support-room/timed-policy.ts`
- `docs/transactional-email-catalog.md`

## 8. Role-Aware Marketplace Access

- `src/app/assets/[assetId]/AssetDetailClientPage.tsx`
- `src/app/assets/[assetId]/components/AssetDetailSidebar.tsx`
- `src/app/assets/[assetId]/components/OwnerStatusChips.tsx`
- `src/app/assets/[assetId]/details/ModelDetailsContent.tsx`
- `src/lib/assets/`

## 9. Semantic Design-System Governance

- `src/design-system/semantic-tokens.ts`
- `src/design-system/component-token-map.ts`
- `src/design-system/ui-ia.ts`
- `docs/design-system/README.md`
- `docs/design-system-governance.md`

## 10. Observability and Incident Routing

- `services/sentry-slack-relay/README.md`
- `src/app/admin/environment-health/EnvironmentHealthClient.tsx`
- `src/app/admin/upstash-usage/UpstashUsageClient.tsx`
- `src/lib/rate-limit-diagnostic.ts`
- `docs/sentry-error-consistency.md`

## 11. Schema-Driven Prompt Parameter System

- `src/app/upload/prompt/components/VariableValuesEditor.tsx`
- `src/app/upload/prompt/components/ChainVariableValuesEditor.tsx`
- `src/hooks/promptValidationSteps.ts`
- `src/hooks/promptValidationSteps.pricing.ts`
- `src/lib/upload/persistence/prompt-persistence.ts`

## 12. Domain-Oriented API and Data Architecture

- `src/app/api/`
- `src/db/schema/index.ts`
- `src/db/schema/relations/index.ts`
- `src/lib/creator/`
- `src/lib/admin/`
- `docs/architecture-overview.md`

## 13. Admin Operations Hub

- `src/app/admin/adminFeatureList.tsx`
- `src/app/admin/asset-review/`
- `src/app/admin/prompt-ops/`
- `src/app/admin/finance/`
- `src/app/admin/treasury/`
- `src/app/admin/support/`
- `src/app/admin/r2-storage/`
- `src/app/admin/transcode/`
- `src/app/admin/worker-ops/`
- `src/app/admin/upstash-usage/`
- `src/app/admin/environment-health/`
- `src/app/admin/notifications/`
- `src/app/admin/audit-logs/`
- `src/app/admin/todos/`
- `src/app/admin/beta-program/`
- `src/app/admin/feedback/`
- `src/app/admin/danbooru-sync/`
- `src/app/admin/promptbase-scraper/`
- `src/app/admin/local-midjourney-selection/`
- `src/app/admin/icon-showcase/`
- `src/app/admin/design-token/`

## 14. Worker Operations and Recovery Control Plane

- `src/app/api/internal/workers/heartbeat/route.ts`
- `src/app/api/internal/workers/failover/route.ts`
- `src/app/api/internal/workers/failover/hetrixtools/route.ts`
- `src/app/api/internal/tagging/backfill/route.ts`
- `src/app/api/internal/tagging/backfill-prompt-imports/route.ts`
- `src/app/api/internal/cron/cleanup-expired-sessions/route.ts`
- `src/app/api/internal/cron/stale-processing/route.ts`
- `src/app/api/internal/cron/stale-batch-sweeper/route.ts`
- `src/app/api/internal/cron/reconcile-stuck-checkouts/route.ts`
- `src/app/api/internal/cron/scheduled-payouts-planner/route.ts`
- `src/app/api/internal/cron/scheduled-payouts-executor/route.ts`
- `src/app/api/internal/cron/scheduled-payouts-retry/route.ts`
- `src/app/api/internal/cron/webhook-cleanup/route.ts`
- `src/app/api/internal/support/policy-sweep/route.ts`
- `src/lib/worker-control/`
- `src/lib/cron/`
- `src/lib/tagging/`
- `src/lib/derivatives/`
