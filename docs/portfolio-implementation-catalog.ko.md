# Redprint 포트폴리오 구현 카탈로그

이 문서는 Redprint 구현 항목을 포트폴리오에 넣기 좋은 단위로 정리한 카탈로그다. 원본 문서의 반복 설명은 줄이고, 각 항목을 `화면 제목`, `사용자 화면`, `기술 구현`, `시각화 아이디어`, `코드 근거` 중심으로 압축했다.

쉽게 말하면, 이 문서는 포트폴리오 카드와 상세 섹션을 만들 때 꺼내 쓰는 부품 목록이다.

## 1. 복구 가능한 콘텐츠 등록 흐름

- 사용자 화면: 프롬프트 등록/수정 위자드
- 기술 구현: multi-step workflow, step validation, draft persistence, submit coordinator, media readiness gate
- 보여줄 역량: 긴 폼 상태 관리, 실패 복구, 업로드 상태와 제출 상태 분리
- 시각화: 4-step wizard, draft 복구 데모, `draft -> uploading -> linked -> submitted -> pending review` state machine
- 코드 근거: `PromptFormV2.tsx`, `PromptStepRenderer.tsx`, `uploadProcessRunner.ts`, `commit-prompt-create-action.ts`

## 2. 대용량 미디어 직접 업로드 파이프라인

- 사용자 화면: 이미지/영상 업로드 카드
- 기술 구현: Cloudflare R2 presigned upload, upload session, R2 `HEAD` verification, temp media row, queue registration
- 보여줄 역량: 서버 부하 절감, 대용량 업로드 안정성, 후처리 분리
- 시각화: Browser -> R2 -> verification -> queue diagram, 업로드 상태 카드
- 코드 근거: `useUploadSession.ts`, `useR2Uploader.ts`, `temp-upload/init/route.ts`, `temp-upload/complete/route.ts`, `temp-media.ts`

## 3. 반응형 마켓플레이스 탐색 피드

- 사용자 화면: Explore 카드 벽, 검색 dock, preview modal
- 기술 구현: adaptive discovery feed, row packing, presentation descriptor, offset pagination, batched preview prefetch
- 보여줄 역량: 반응형 UI, 긴 스크롤 성능, 네트워크 요청 예산 관리
- 시각화: viewport slider, card descriptor inspector, prefetch budget meter
- 코드 근거: `ExplorePackedFeed.tsx`, `explorePackedLayout.ts`, `useExplorePreviewPrefetch.ts`, `assets/previews/batch/route.ts`

## 4. 결제부터 정산까지 이어지는 돈의 흐름

- 사용자 화면: 장바구니, Stripe Checkout, 결제 완료, 판매자 정산
- 기술 구현: multi-creator cart grouping, Stripe webhook finalization, ledger posting, creator payable tracking, payout execution
- 보여줄 역량: 결제 도메인 모델링, 중복 실행 방지, 정산 상태 추적
- 시각화: money flow diagram, webhook finalization timeline, duplicate execution guard demo
- 코드 근거: `checkout/session/route.ts`, `cart-grouping.ts`, `fee-calculator.ts`, `checkout.ts`, `execute-payout.ts`

## 5. 운영자가 검증할 수 있는 정산·원장 시스템

- 사용자 화면: Admin Finance 탭, 월마감 표, 원장 탐색기, reconciliation panel
- 기술 구현: monthly close, creator payable rollforward, ledger drilldown, reconciliation snapshot, receipt generation
- 보여줄 역량: 운영 검증, 회계 증거 추적, 숫자의 원인 설명
- 시각화: monthly close builder, journal entry drilldown, reconciliation warning panel
- 코드 근거: `MonthlyCloseClient.tsx`, `LedgerExplorerTab.tsx`, `ReconciliationTab.tsx`, `creator-payable-rollforward.ts`, `post-journal-entry.ts`

## 6. 백그라운드 미디어 처리 작업 시스템

- 사용자 화면: 태깅/트랜스코딩/후처리 상태, Transcode Monitor
- 기술 구현: worker-owned asynchronous processing, queue, lease, heartbeat ownership, retry path, readiness probe
- 보여줄 역량: 긴 작업 분리, worker 복구, failover 가능성
- 시각화: queue monitor dashboard, worker state machine, retry button demo
- 코드 근거: `queue-core.ts`, `queue-queries.ts`, `media-derivative-jobs.ts`, `media-transcode-jobs.ts`, `JobsTable.tsx`

## 7. 구매 건에 묶인 분쟁 처리 흐름

- 사용자 화면: 구매자/판매자 지원 티켓룸, admin support inbox
- 기술 구현: purchase-bound dispute workflow, canonical transcript, timed policy sweep, idempotent transactional email
- 보여줄 역량: 상태 전이, 지원 기록 중앙화, timeout policy
- 시각화: three-lane transcript, timeout policy clock, resolution offer cards
- 코드 근거: `support/route.ts`, `SupportConversationClient.tsx`, `policy-sweep.ts`, `timed-policy.ts`

## 8. 역할별로 달라지는 상품 접근 제어

- 사용자 화면: 상품 상세 페이지, 구매자/소유자/관리자별 버튼과 상태 chip
- 기술 구현: role-aware access control, public storefront readiness gate, fail-closed policy
- 보여줄 역량: 권한 분리, 공개 상태 관리, 구매 전후 UX 제어
- 시각화: role switcher, storefront gate animation, revision timeline
- 코드 근거: `AssetDetailClientPage.tsx`, `AssetDetailSidebar.tsx`, `OwnerStatusChips.tsx`, `ModelDetailsContent.tsx`

## 9. 제품 전반의 UI 규칙을 잡는 디자인 시스템

- 사용자 화면: 반복 UI 컴포넌트, 상태 badge, card, overlay
- 기술 구현: primitive token, semantic token, component contract, rollout tracking, approved exception policy
- 보여줄 역량: UI 일관성, 디자인 시스템 거버넌스, 점진적 적용
- 시각화: token playground, before/after diff, component contract viewer
- 코드 근거: `semantic-tokens.ts`, `component-token-map.ts`, `ui-ia.ts`, design-system docs

## 10. 장애를 분류하고 알리는 운영 관측 시스템

- 사용자 화면: Sentry/Slack 알림, environment health dashboard
- 기술 구현: Sentry webhook verification, production-only filtering, domain routing, Redis dedup, retry/backoff
- 보여줄 역량: 운영 관측성, 노이즈 감소, 장애 라우팅
- 시각화: incident router pipeline, Slack alert preview, dedup timeline
- 코드 근거: `sentry-slack-relay`, `EnvironmentHealthClient.tsx`, `UpstashUsageClient.tsx`, `rate-limit-diagnostic.ts`

## 11. 프롬프트 변수 입력 자동화 시스템

- 사용자 화면: 변수 입력 UI, live prompt preview
- 기술 구현: placeholder parsing, typed form generation, single/chain mode validation, real-time prompt assembly
- 보여줄 역량: 텍스트 파싱, dynamic form, payload 정리
- 시각화: prompt parser demo, live assembly preview, hidden payload inspector
- 코드 근거: `VariableValuesEditor.tsx`, `ChainVariableValuesEditor.tsx`, `promptValidationSteps.ts`, `prompt-persistence.ts`

## 12. 도메인별로 정리된 API·데이터 구조

- 사용자 화면: 직접 보이지 않는 백엔드 구조
- 기술 구현: domain-oriented architecture, Next.js API routes, Drizzle schema modules, service-layer boundaries
- 보여줄 역량: 대규모 코드 구조화, 도메인 경계 설계, 데이터 관계 관리
- 시각화: system architecture map, domain explorer, schema relationship map
- 코드 근거: `src/app/api/`, `src/db/schema/`, `src/lib/creator/`, `src/lib/admin/`

## 13. 어드민 운영 허브

- 사용자 화면: Admin dashboard 전체
- 기술 구현: review queue, finance, treasury, support, storage, worker ops, notifications, audit logs
- 보여줄 역량: 운영자 workflow, 위험 작업 dry-run, audit trail
- 시각화: admin command center, operations health strip, audit trail drawer
- 코드 근거: `adminFeatureList.tsx`, `src/app/admin/*`

## 14. Worker 운영·복구 컨트롤 플레인

- 사용자 화면: Worker Ops, cron/internal routes, failover status
- 기술 구현: heartbeat, active worker URL, failover control, scheduled ops, cleanup/reconciliation jobs
- 보여줄 역량: background operations, 복구 자동화, scheduled job orchestration
- 시각화: worker lane map, failover simulator, scheduled ops calendar
- 코드 근거: `workers/heartbeat/route.ts`, `workers/failover/route.ts`, `src/lib/worker-control/`, `src/lib/cron/`

## 우선 구현 권장

웹사이트 첫 버전에서는 1~6번을 메인 showcase로 사용한다. 7~14번은 상세 case study나 operations coverage에서 확장한다.

쉽게 말하면, 처음부터 모든 방을 다 보여주기보다 현관에서 가장 중요한 방 6개만 먼저 보여주고, 관심 있는 방문자에게 전체 지도를 열어주는 방식이다.
