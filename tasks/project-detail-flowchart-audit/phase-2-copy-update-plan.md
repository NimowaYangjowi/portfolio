# Phase 2: Copy Update Plan

## 목적

카드 문구와 모달 설명이 차트의 논리 흐름과 같은 이야기를 하도록 고친다. 개발자 용어로는 content-data alignment이고, 쉽게 말하면 카드에 적힌 말과 그림의 화살표가 서로 딴소리를 하지 않게 맞추는 작업이다.

## 수정 대상

| 파일 | 수정 이유 |
|---|---|
| `src/i18n.ts` | 한국어/영어 카드, 모달 요약, `steps`, `recoverySteps`, `notes`의 실제 원본 |
| `docs/current-page-implementation-brief.ko.md` | 현재 문서가 예전 4카드/1모달 구조를 설명해 최신 화면과 다름 |
| `docs/portfolio-implementation-catalog.ko.md` | 카드 교체나 결제·정산 추가를 선택하면 카탈로그와 화면 관계를 갱신해야 함 |
| `README.md` | 한국어 문구 변경 시 영어 문구도 함께 바꾸라는 규칙을 유지해야 함 |

## 공통 문구 원칙

- 카드 제목은 사용자가 보는 화면/운영 장면을 먼저 말한다.
- subtitle은 기술 구현을 한 줄로 압축한다.
- details는 `문제 -> 구현 -> 결과` 순서로 쓴다.
- modal summary는 흐름의 시작과 끝을 반드시 포함한다.
- `steps`는 정상 흐름, `recoverySteps`는 실패/예외/보호 흐름만 담는다.
- 한국어와 영어는 직역보다 같은 의미를 우선한다.

## 카드별 문구 보강 방향

### 01 제출·승인 자동화 플로우

보강할 핵심은 "제출 버튼 이후에도 상태가 계속 이어진다"이다.

- `summary`: validation, media readiness, review queue, Slack evidence check, auto/manual decision, audit, publish/reject를 모두 포함한다.
- `steps`: `Draft`, `Validation`, `Review queue`, `Approval decision`, `Publish or return for changes`처럼 끝 상태를 분명히 한다.
- `recoverySteps`: 자동 승인 실패나 근거 부족은 `Manual review fallback`, 누락된 제출 조건은 `Creator revision`으로 분리한다.

쉬운 설명: 사용자가 숙제를 제출했을 때 바로 전시되는 게 아니라, 선생님이 확인하고 통과/수정 요청을 남기는 흐름이다.

### 02 미디어 업로드·백그라운드 처리 파이프라인

보강할 핵심은 업로드 실패와 후처리 실패를 다른 문제로 다루는 것이다.

- `summary`: browser-to-R2, backend verification, queue registration, worker processing, readiness gate를 순서대로 쓴다.
- `steps`: `R2 HEAD verification` 뒤에는 verified media만 queue로 간다고 명시한다.
- `recoverySteps`: invalid object cleanup은 upload retry로, worker failure는 requeue/backfill로 나눈다.

쉬운 설명: 택배를 보냈는지 확인하는 일과, 택배 상자 안 물건을 가공하는 일은 다른 단계다.

### 03 반응형 마켓플레이스 탐색 피드

보강할 핵심은 feed가 "그림 배치"만이 아니라 데이터 요청과 preview 요청을 함께 관리한다는 점이다.

- `summary`: API fetch, presentation descriptor, row packing, pagination, observer, batched prefetch, preview modal을 포함한다.
- `steps`: `Fetch page`, `Build descriptor`, `Pack rows`, `Render wall`, `Open preview` 순서가 자연스럽다.
- `recoverySteps`: `Shared observer`, `Prefetch allowance`, `Cache miss fallback`을 넣는다.

쉬운 설명: 책장을 예쁘게 정리하는 것뿐 아니라, 다음 책 묶음을 언제 가져올지도 정하는 흐름이다.

### 04 Sentry → Slack → Agent 장애 대응 자동화

보강할 핵심은 알림을 작업 단위로 바꾸되, 자동화가 처리하면 안 되는 경우를 분명히 빼는 것이다.

- `summary`: verify, scope filter, dedup, route, Slack post, agent triage, GitHub handoff, human review boundary를 포함한다.
- `steps`: `Sentry intake`, `Scope filter`, `Dedup`, `Route`, `Agent triage`, `GitHub handoff`.
- `recoverySteps`: out-of-scope ignore, duplicate suppress, Slack retry, human fallback을 서로 섞지 않는다.

쉬운 설명: 화재경보가 울렸을 때 같은 경보를 계속 울리지 않고, 담당자에게 보내고, 사람이 확인해야 할 일은 사람이 보게 남기는 흐름이다.

### 05 Redis 기반 트래픽 보호·진단 레이어

보강할 핵심은 rate limiting과 diagnostics의 관계다. 진단은 차단 흐름 그 자체가 아니라, 필요할 때 켜는 관찰 장치다.

- `summary`: route normalization, actor scope, policy decision, allowed/blocked response, optional diagnostics, quota dashboard를 포함한다.
- `steps`: `Request`, `Route bucket`, `Actor scope`, `Limiter policy`, `Allowed or blocked response`.
- `recoverySteps`: `Diagnostic session active?`, `TTL counters`, `Quota dashboard`, `Operator review`.

쉬운 설명: 출입문에서 사람을 세는 일과, CCTV를 잠깐 켜서 어디가 붐비는지 보는 일은 연결돼 있지만 같은 일은 아니다.

### 06 Worker 운영·복구 컨트롤 플레인

보강할 핵심은 active owner 전환이다. local worker가 정상이면 local이 처리하고, down이면 Railway backup이 ownership을 가져가야 한다.

- `summary`: heartbeat, module health, owner decision, local module execution, failover wake, ownership refresh, backup claim, failback park를 포함한다.
- `steps`: media/backup/scheduled lines는 간단히 유지하고, `Status + audit writeback`으로 합친다.
- `recoverySteps`: `Down detection`, `Wake Railway`, `Refresh active owner`, `Backup claims jobs`, `Failback cooldown`, `Park backup`.

쉬운 설명: 평소에는 집 컴퓨터가 일을 하고, 집 컴퓨터가 멈추면 대기 중인 클라우드 컴퓨터를 깨워서 이어받게 하는 구조다.

## 한국어/영어 동시 수정 체크리스트

- 한국어 카드 하나를 고치면 같은 index의 영어 카드도 같은 의미로 고친다.
- `title`, `subtitle`, `details`, `summary`, `steps`, `recoverySteps`, `notes`를 한 묶음으로 본다.
- 한국어에만 있는 기술 nuance나 영어에만 있는 결론이 없게 한다.
- UI에서 보이는 긴 문장은 모달 폭에서 줄바꿈이 자연스러운지 확인한다.

## 산출물

- `src/i18n.ts` 한국어/영어 문구 패치
- 필요 시 `docs/current-page-implementation-brief.ko.md` 최신화
- 카드 교체를 선택한 경우 새 결제·정산 카드 문구 초안
