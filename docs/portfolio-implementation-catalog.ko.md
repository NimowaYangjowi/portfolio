# Redprint 포트폴리오 구현 카탈로그

이 문서는 Redprint 구현 항목을 포트폴리오에 넣기 좋은 단위로 정리한 카탈로그다. 원본 문서의 반복 설명은 줄이고, 각 항목을 `화면 제목`, `사용자 화면`, `기술 구현`, `고객/운영 관점`, `시각화 아이디어`, `코드 근거` 중심으로 압축했다.

이 문서는 포트폴리오 카드와 상세 섹션을 만들 때 꺼내 쓰는 부품 목록이다.

## 읽는 기준

각 항목은 세 줄로 읽히게 만든다.

1. **사용자/운영자 문제**: 화면을 쓰는 사람이 무엇 때문에 힘든지.
2. **기술 구현**: 그 문제를 API, 데이터, 상태 관리, worker, 결제 흐름으로 어떻게 풀었는지.
3. **고객/제품 메시지**: 그래서 고객지원, 운영자, 구매자, 판매자에게 어떤 변화가 생기는지.

“무슨 기능을 만들었다”보다 “누가 덜 고생하게 됐는지”를 먼저 보이게 하는 기준이다.

## 1. 복구 가능한 콘텐츠 등록 흐름

- 사용자 화면: 프롬프트 등록/수정 위자드
- 기술 구현: multi-step workflow, step validation, draft persistence, submit coordinator, media readiness gate
- 보여줄 역량: 긴 폼 상태 관리, 실패 복구, 업로드 상태와 제출 상태 분리
- 고객/운영 관점: 판매자는 긴 등록 과정을 중간에 잃어버리지 않고, 운영자와 고객지원팀은 제출이 어디에서 멈췄는지 상태별로 설명할 수 있다.
- 시각화: 4-step wizard, draft 복구 데모, `draft -> uploading -> linked -> submitted -> pending review` state machine
- 코드 근거: `PromptFormV2.tsx`, `PromptStepRenderer.tsx`, `uploadProcessRunner.ts`, `commit-prompt-create-action.ts`

## 2. 대용량 미디어 직접 업로드 파이프라인

- 사용자 화면: 이미지/영상 업로드 카드
- 기술 구현: Cloudflare R2 presigned upload, upload session, R2 `HEAD` verification, temp media row, queue registration
- 보여줄 역량: 서버 부하 절감, 대용량 업로드 안정성, 후처리 분리
- 고객/운영 관점: 사용자는 큰 파일을 올릴 때 앱이 멈춘다고 느끼지 않고, 운영자는 파일이 실제로 준비됐는지 검증한 뒤 다음 단계로 넘길 수 있다.
- 시각화: Browser -> R2 -> verification -> queue diagram, 업로드 상태 카드
- 코드 근거: `useUploadSession.ts`, `useR2Uploader.ts`, `temp-upload/init/route.ts`, `temp-upload/complete/route.ts`, `temp-media.ts`

## 3. 반응형 마켓플레이스 탐색 피드

- 사용자 화면: Explore 카드 벽, 검색 dock, preview modal
- 기술 구현: adaptive discovery feed, row packing, presentation descriptor, offset pagination, batched preview prefetch
- 보여줄 역량: 반응형 UI, 긴 스크롤 성능, 네트워크 요청 허용량 관리
- 고객/운영 관점: 구매자는 미디어가 많은 상품을 빠르게 훑을 수 있고, 제품팀은 카드 노출과 미리보기 요청이 과하게 늘어나지 않도록 제어할 수 있다.
- 시각화: viewport slider, card descriptor inspector, prefetch allowance meter
- 코드 근거: `ExplorePackedFeed.tsx`, `explorePackedLayout.ts`, `useExplorePreviewPrefetch.ts`, `assets/previews/batch/route.ts`

## 4. 결제부터 정산까지 이어지는 돈의 흐름

- 사용자 화면: 장바구니, Stripe Checkout, 결제 완료, 판매자 정산
- 기술 구현: multi-creator cart grouping, Stripe webhook finalization, ledger posting, creator payable tracking, payout execution
- 보여줄 역량: 결제 도메인 모델링, 중복 실행 방지, 정산 상태 추적
- 고객/운영 관점: 구매, 판매, 정산 상태가 한 흐름으로 이어져서 finance나 support 담당자가 “돈이 지금 어디에 있는지” 설명할 수 있다.
- 시각화: money flow diagram, webhook finalization timeline, duplicate execution guard demo
- 코드 근거: `checkout/session/route.ts`, `cart-grouping.ts`, `fee-calculator.ts`, `checkout.ts`, `execute-payout.ts`

## 5. 운영자가 검증할 수 있는 정산·원장 시스템

- 사용자 화면: Admin Finance 탭, 월마감 표, 원장 탐색기, reconciliation panel
- 기술 구현: monthly close, creator payable rollforward, ledger drilldown, reconciliation snapshot, receipt generation
- 보여줄 역량: 운영 검증, 회계 증거 추적, 숫자의 원인 설명
- 고객/운영 관점: 운영자는 정산 금액을 단순 합계로 믿는 것이 아니라 원장, 월마감, reconciliation으로 검증하고 판매자 문의에 근거 있게 답할 수 있다.
- 시각화: monthly close builder, journal entry drilldown, reconciliation warning panel
- 코드 근거: `MonthlyCloseClient.tsx`, `LedgerExplorerTab.tsx`, `ReconciliationTab.tsx`, `creator-payable-rollforward.ts`, `post-journal-entry.ts`

## 6. 백그라운드 미디어 처리 작업 시스템

- 사용자 화면: 태깅/트랜스코딩/후처리 상태, Transcode Monitor
- 기술 구현: worker-owned asynchronous processing, queue, lease, heartbeat ownership, retry path, readiness probe
- 보여줄 역량: 긴 작업 분리, worker 복구, failover 가능성
- 고객/운영 관점: 오래 걸리는 미디어 작업이 사용자의 화면을 붙잡지 않고, 실패한 작업은 운영자가 상태를 보고 다시 처리할 수 있다.
- 시각화: queue monitor dashboard, worker state machine, retry button demo
- 코드 근거: `queue-core.ts`, `queue-queries.ts`, `media-derivative-jobs.ts`, `media-transcode-jobs.ts`, `JobsTable.tsx`

## 7. 구매 건에 묶인 분쟁 처리 흐름

- 사용자 화면: 구매자/판매자 지원 티켓룸, admin support inbox
- 기술 구현: purchase-bound dispute workflow, canonical transcript, timed policy sweep, idempotent transactional email
- 보여줄 역량: 상태 전이, 지원 기록 중앙화, timeout policy
- 고객/운영 관점: 분쟁이 구매 건과 묶여 있어서 support 담당자가 대화, 정책, 처리 상태를 한곳에서 보고 일관되게 대응할 수 있다.
- 시각화: three-lane transcript, timeout policy clock, resolution offer cards
- 코드 근거: `support/route.ts`, `SupportConversationClient.tsx`, `policy-sweep.ts`, `timed-policy.ts`

## 8. 역할별로 달라지는 상품 접근 제어

- 사용자 화면: 상품 상세 페이지, 구매자/소유자/관리자별 버튼과 상태 chip
- 기술 구현: role-aware access control, public storefront readiness gate, fail-closed policy
- 보여줄 역량: 권한 분리, 공개 상태 관리, 구매 전후 UX 제어
- 고객/운영 관점: 구매 전, 구매 후, 소유자, 관리자 상태가 화면에서 다르게 보여서 사용자는 무엇을 할 수 있는지 헷갈리지 않고 운영자는 공개 위험을 줄일 수 있다.
- 시각화: role switcher, storefront gate animation, revision timeline
- 코드 근거: `AssetDetailClientPage.tsx`, `AssetDetailSidebar.tsx`, `OwnerStatusChips.tsx`, `ModelDetailsContent.tsx`

## 9. 제품 전반의 UI 규칙을 잡는 디자인 시스템

- 사용자 화면: 반복 UI 컴포넌트, 상태 badge, card, overlay
- 기술 구현: primitive token, semantic token, component contract, rollout tracking, approved exception policy
- 보여줄 역량: UI 일관성, 디자인 시스템 거버넌스, 점진적 적용
- 고객/운영 관점: 팀이 화면을 늘려도 버튼, 배지, 카드, 상태 표현이 같은 규칙을 따라 사용자와 운영자가 서비스를 예측하기 쉬워진다.
- 시각화: token playground, before/after diff, component contract viewer
- 코드 근거: `semantic-tokens.ts`, `component-token-map.ts`, `ui-ia.ts`, design-system docs

## 10. 장애를 분류하고 알리는 운영 관측 시스템

- 사용자 화면: Sentry/Slack 알림, environment health dashboard
- 기술 구현: Sentry webhook verification, production-only filtering, domain routing, Redis dedup, retry/backoff
- 보여줄 역량: 운영 관측성, 노이즈 감소, 장애 라우팅
- 고객/운영 관점: 장애 알림이 단순히 많이 오는 것이 아니라 영향 범위별로 분류되어 담당자가 고객 영향이 큰 문제부터 볼 수 있다.
- 시각화: incident router pipeline, Slack alert preview, dedup timeline
- 코드 근거: `sentry-slack-relay`, `EnvironmentHealthClient.tsx`, `UpstashUsageClient.tsx`, `rate-limit-diagnostic.ts`

## 11. 프롬프트 변수 입력 자동화 시스템

- 사용자 화면: 변수 입력 UI, live prompt preview
- 기술 구현: placeholder parsing, typed form generation, single/chain mode validation, real-time prompt assembly
- 보여줄 역량: 텍스트 파싱, dynamic form, payload 정리
- 고객/운영 관점: 사용자는 프롬프트 안의 변수를 직접 찾아 고치지 않아도 되고, 제품은 잘못된 입력 때문에 생기는 문의와 실패를 줄일 수 있다.
- 시각화: prompt parser demo, live assembly preview, hidden payload inspector
- 코드 근거: `VariableValuesEditor.tsx`, `ChainVariableValuesEditor.tsx`, `promptValidationSteps.ts`, `prompt-persistence.ts`

## 12. 도메인별로 정리된 API·데이터 구조

- 사용자 화면: 직접 보이지 않는 백엔드 구조
- 기술 구현: domain-oriented architecture, Next.js API routes, Drizzle schema modules, service-layer boundaries
- 보여줄 역량: 대규모 코드 구조화, 도메인 경계 설계, 데이터 관계 관리
- 고객/운영 관점: 화면에는 바로 보이지 않지만, 요구사항을 결제, 정산, 미디어, 지원, 운영 같은 업무 단위로 나누어야 이후 기능 변경과 문의 대응이 쉬워진다.
- 시각화: system architecture map, domain explorer, schema relationship map
- 코드 근거: `src/app/api/`, `src/db/schema/`, `src/lib/creator/`, `src/lib/admin/`

## 13. 어드민 운영 허브

- 사용자 화면: Admin dashboard 전체
- 기술 구현: review queue, finance, treasury, support, storage, worker ops, notifications, audit logs
- 보여줄 역량: 운영자 workflow, 위험 작업 dry-run, audit trail
- 고객/운영 관점: 운영자가 개발자에게 매번 물어보지 않고 심사, 정산, 지원, 스토리지, worker 상태를 직접 확인하고 조치할 수 있다.
- 시각화: admin command center, operations health strip, audit trail drawer
- 코드 근거: `adminFeatureList.tsx`, `src/app/admin/*`

## 14. Worker 운영·복구 컨트롤 플레인

- 사용자 화면: Worker Ops, cron/internal routes, failover status
- 기술 구현: heartbeat, active worker URL, failover control, scheduled ops, cleanup/reconciliation jobs
- 보여줄 역량: background operations, 복구 자동화, scheduled job orchestration
- 고객/운영 관점: 사용자가 화면을 떠난 뒤에도 서비스가 계속 일을 끝내고, 멈춘 작업은 heartbeat와 failover를 통해 운영자가 복구할 수 있다.
- 시각화: worker lane map, failover simulator, scheduled ops calendar
- 코드 근거: `workers/heartbeat/route.ts`, `workers/failover/route.ts`, `src/lib/worker-control/`, `src/lib/cron/`

## 외부 고객성공 사례와 연결되는 항목

| 외부 사례 | Redprint에서 연결되는 항목 | 보여줄 메시지 |
|---|---|---|
| OneLink Management Console | 1, 2, 12, 13 | API-heavy workflow를 비개발자도 안전하게 실행할 수 있는 운영 도구로 바꾼다. |
| AppsFlyer S2S Event Guide | 4, 10, 12, 14 | 고객 데이터 구조, 전송 조건, 실패 처리, 모니터링을 구현 가능한 가이드로 번역한다. |
| Commerce Program Manager 포지셔닝 | 4, 5, 12, 13 | 결제, 정산, 파트너 운영, 정책 차이를 product requirement로 쪼갤 수 있다. |
| 글로벌/SEA Enterprise 운영 | 7, 10, 13, 14 | 여러 지역과 이해관계자가 있는 환경에서도 운영 상태와 고객 영향을 정리해 실행한다. |

Redprint 구현 항목은 혼자 만든 프로젝트로 끝나는 것이 아니라 실제 고객성공 업무에서 해온 technical translation의 증거와 연결된다.

## 우선 구현 권장

웹사이트 첫 버전에서는 1~6번을 메인 showcase로 사용한다. 7~14번은 상세 case study나 operations coverage에서 확장한다.

처음부터 모든 방을 다 보여주기보다 현관에서 가장 중요한 방 6개만 먼저 보여주고, 관심 있는 방문자에게 전체 지도를 열어주는 방식이다.
