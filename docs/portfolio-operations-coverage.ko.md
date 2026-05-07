# Redprint 운영 커버리지 정리

이 문서는 Admin Operations Hub와 Worker Operations Plane을 포트폴리오에서 어떻게 보여줄지 정리한다. 원본 `redprint-admin-worker-coverage.*.md`의 세부 기능 목록은 유지하되, 웹사이트에 넣을 수 있는 묶음 단위로 압축했다.

쉽게 말하면, 이 문서는 서비스 뒤편의 조종석과 작업반을 설명하는 지도다.

## Admin Operations Hub

포트폴리오용 설명:

> Redprint의 admin surface는 콘텐츠 심사, 결제·정산 운영, 스토리지 점검, worker 상태 확인, 알림 발송, 베타 운영, 피드백 관리까지 묶은 operations hub다. 운영자가 문제를 발견하고, 상태를 검증하고, 필요한 조치를 실행할 수 있도록 API, audit log, status card, table, modal, dry-run flow를 연결했다.

쉽게 말하면, 사용자는 매장만 보지만 운영자는 뒤편 조종석에서 상품, 돈, 창고, 고객 문의, 작업 상태를 한꺼번에 확인한다.

### 포트폴리오에서 묶어 보여줄 영역

| 묶음 | 포함 기능 | 보여줄 구현 포인트 |
|---|---|---|
| Review & Quality | Asset Review, Prompt Ops, Feedback | 심사 queue, 상태 변경, revision review, batch visibility |
| Finance & Treasury | Admin Finance, Treasury | monthly close, ledger, reconciliation, payout dry-run/execution |
| Support & Trust | Support Inbox, Audit Logs | canonical transcript, refund approve/deny, admin action trail |
| Storage & Media Ops | R2 Storage, Transcode Monitor | orphan scan, file reference check, failed transcode recovery |
| Platform Health | Worker Ops, Upstash Usage, Environment Health | heartbeat, Redis diagnostics, integration readiness |
| Growth & Internal Ops | Notifications, Todos, Beta Program | target selection, internal task tracking, creator fee override |
| Experiments & Tooling | Danbooru Sync, PromptBase Scraper, Midjourney Selection, Icon Showcase, Design Token | 운영 실험, 외부 데이터 수집, visual selection support |

### 웹사이트 시각화 아이디어

- Admin Command Center: 운영 영역별 grid.
- Operations Health Strip: finance, storage, worker, Redis, support 상태를 한 줄로 요약.
- Audit Trail Drawer: 누가, 언제, 어떤 entity를 바꿨는지 펼쳐 보기.
- Dry-run Before Execute: 위험한 작업은 실행 전 preview를 보여주는 흐름.
- Review Queue Demo: 심사, 지원, 피드백을 운영자 판단 queue로 묶기.

## Worker Operations Plane

포트폴리오용 설명:

> Redprint의 worker 기능은 업로드 후처리만 담당하지 않는다. media tagging, image derivative, video transcode, upload session cleanup, stale processing recovery, stuck checkout reconciliation, scheduled payout planning/execution/retry, webhook cleanup, support timeout policy, worker heartbeat, failover control까지 포함하는 background operations plane이다.

쉽게 말하면, 사용자가 버튼을 누른 뒤 화면 밖에서 계속 일하는 작업반이다. 이미지에 태그를 붙이고, 영상을 변환하고, 멈춘 결제를 복구하고, 정산을 예약하며, worker가 죽으면 backup으로 넘기는 일까지 담당한다.

### 포트폴리오에서 묶어 보여줄 영역

| 묶음 | 포함 기능 | 보여줄 구현 포인트 |
|---|---|---|
| Media Lane | Tagging Queue, Image Derivatives, Video Transcoding, Prompt Import Tagging | queue lifecycle, retry, storefront readiness gate |
| Upload Maintenance | Temp Media Status, Upload Session Cleanup, Stale Processing Recovery | polling contract, expired session cleanup, stuck processing recovery |
| Finance Lane | Stuck Checkout Reconciliation, Pending Accounting, Creator Balance, Scheduled Payouts | paid-but-not-finalized 복구, payout planner/executor/retry |
| Support Lane | Support Policy Sweep | 24h/48h warning, 72h automatic outcome |
| Reliability Lane | Worker Heartbeat, Active Worker URL, Worker Failover, Railway Backup Orchestration | active worker identity, failover simulator, backup wake/park flow |
| Cleanup Lane | Stale Batch Sweeper, Webhook Cleanup, Daily Cleanup | scheduled maintenance, stale event recovery |

### 웹사이트 시각화 아이디어

- Worker Lane Map: media, finance, support, reliability, cleanup lane을 나눠 표시.
- Queue Lifecycle Diagram: enqueue -> claim -> heartbeat/lease -> complete/fail -> retry/backfill.
- Failover Simulator: local worker down event가 들어오면 Railway backup을 깨우는 흐름.
- Scheduled Ops Calendar: payout, cleanup, webhook cleanup, support sweep를 시간표로 표현.
- Readiness Gate Demo: worker 후처리가 끝나기 전 public card가 닫혀 있다가 완료 후 열리는 상태 전환.

## 메인 페이지 반영 방식

메인 페이지에는 admin과 worker의 모든 세부 기능을 각각 카드로 넣지 않는다. 대신 아래 두 개의 큰 case study로 보여준다.

- `Admin Operations Hub`: 운영자가 상태를 확인하고 조치를 실행하는 조종석
- `Worker Operations Plane`: 사용자 요청 뒤에서 오래 걸리는 작업과 복구를 맡는 백그라운드 시스템

세부 기능 목록은 상세 페이지의 accordion, tab, coverage table로 열어 보여준다. 쉽게 말하면, 첫 화면에는 큰 지도만 보여주고, 필요한 사람에게 자세한 방 목록을 펼쳐 주는 방식이다.
