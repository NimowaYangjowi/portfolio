# Phase 3: Flowchart Logic Plan

## 목적

Excalidraw 흐름도의 노드와 화살표를 실제 구현 논리에 맞게 고친다. 개발자 용어로는 state transition and control-flow audit이고, 쉽게 말하면 "화살표가 어디로 가야 하는지"를 다시 맞추는 일이다.

## 공통 작업 순서

1. `src/i18n.ts`의 `steps`와 `recoverySteps`를 최종 흐름으로 확정한다.
2. 같은 순서로 `scripts/generate-project-diagrams.mjs`의 각 diagram builder를 수정한다.
3. `node scripts/generate-project-diagrams.mjs`를 실행해 PNG와 editable `.excalidraw`를 다시 만든다.
4. 6개 모달을 열어 한국어/영어 그림이 같은 논리를 보여주는지 확인한다.
5. `npm run build`로 TypeScript와 Vite build를 검증한다.

## 01 Approval Automation

현재 의심 지점:

- `Media readiness gate`의 `missing` 흐름이 draft 수정으로 돌아가지 않고 수동 검토 쪽으로 내려갈 수 있다.
- `Manual review fallback`이 approve/reject 판단 없이 바로 publish로 이어져 보인다.
- `Audit trail`은 auto approval뿐 아니라 manual decision에도 걸려야 한다.

목표 흐름:

```text
Draft -> Submit -> Validation + media readiness
  -> needs changes -> Creator revision -> Draft
  -> ready -> Review queue -> Slack approval request -> Evidence lookup -> Approval confidence
      -> enough evidence -> Autonomous approval -> Audit trail -> Approved publish
      -> ambiguous -> Manual review -> Manual decision
          -> approve -> Audit trail -> Approved publish
          -> reject/needs changes -> Audit trail -> Creator revision
```

쉬운 설명: 자동으로 통과시킬 수 있는 숙제는 바로 통과시키되, 애매한 숙제는 선생님이 보고 통과/반려/수정 요청 중 하나를 고르는 흐름이다.

## 02 Media Pipeline

현재 의심 지점:

- invalid upload cleanup 이후 retry가 worker claim으로 바로 이어져 보일 수 있다.
- worker 후처리 실패와 upload verification 실패가 같은 복구선으로 섞여 있다.
- `Storefront ready`가 단순 output처럼 보여 readiness 판단이 약하다.

목표 흐름:

```text
File selected -> Upload session -> Presigned URL -> Browser uploads to R2
  -> Complete callback -> R2 HEAD verification
      -> invalid -> Mismatch cleanup -> Temp media failed -> User retry upload
      -> verified -> Queue fan-out -> Worker claim with lease -> Media type routing
          -> image/tag/video processing -> Result writeback -> Storefront readiness gate
              -> ready -> Public media available
              -> not ready/failed -> Retry or backfill -> Queue/claim
```

쉬운 설명: 파일이 제대로 도착하지 않았으면 다시 올려야 하고, 파일은 도착했는데 가공이 실패했으면 worker 작업만 다시 잡아야 한다.

## 03 Marketplace Feed

현재 의심 지점:

- `Presentation descriptor`가 시작점이라 API fetch와 page boundary가 차트에 보이지 않는다.
- `Offset pagination`이 row packing 뒤에 있어 데이터 요청 순서가 흐릿하다.
- prefetch는 preview modal로 가는 성능 보조 흐름인데, 현재는 main flow와의 관계가 덜 명확하다.

목표 흐름:

```text
Initial fetch / scroll fetch -> Offset cursor or offset state -> Build presentation descriptor
  -> Responsive row packing -> Render card wall -> User opens card -> Preview modal

Rendered cards -> Shared observer / hover signal -> Prefetch allowance check
  -> allowed -> Batched preview prefetch -> Preview cache -> Preview modal
  -> allowance spent -> On-demand modal fetch
```

쉬운 설명: 먼저 상품 목록을 가져오고, 그 목록을 카드 설명서로 바꾼 뒤, 화면 폭에 맞춰 책장처럼 배치한다. 미리보기는 사용자가 볼 가능성이 있을 때만 prefetch한다.

## 04 Incident Automation

현재 의심 지점:

- out-of-scope 이벤트와 duplicate 이벤트가 같은 suppress 흐름처럼 보일 수 있다.
- Slack retry/backoff가 실패 후 다시 Slack post로 돌아가는 길이 약하다.
- domain unknown과 actionable evidence 부족이 같은 human fallback인지, 서로 다른 단계인지 더 분명해야 한다.

목표 흐름:

```text
Sentry issue alert -> Signature + timestamp verification -> Scope filter
  -> out of scope -> Ignore
  -> production error -> Replay guard -> Issue dedup
      -> duplicate -> Suppress repeat alert
      -> new -> Domain routing
          -> known domain -> Slack Block Kit message
          -> unknown domain -> General triage channel
Slack post
  -> 429/5xx -> Retry with backoff -> Slack post or final failure
  -> posted -> Agent ACK + context lookup -> Actionable evidence?
      -> yes -> GitHub issue -> Fix branch -> Draft PR -> NEEDS_REVIEW report
      -> unclear/out of automation scope -> Human review fallback
```

쉬운 설명: 필요 없는 알림은 버리고, 반복 알림은 줄이고, 처리할 알림만 담당 채널로 보내서 사람이 확인 가능한 PR까지 만드는 흐름이다.

## 05 Redis Traffic

현재 의심 지점:

- diagnostic이 over-limit path에 붙어 있어, 진단이 차단된 요청에서만 켜지는 것처럼 보일 수 있다.
- allowed response와 blocked response가 하나의 `HTTP response`로 합쳐져 차단 계약이 덜 보인다.
- quota dashboard는 요청 처리 결과라기보다 운영자가 나중에 보는 관측 화면이다.

목표 흐름:

```text
API request -> Route bucket normalize -> Route policy / exclusion check
  -> excluded -> Pass through
  -> protected -> Actor scope -> Limiter decision
      -> allowed -> Handler response
      -> blocked -> 429 rate-limit response

Limiter decision + response metadata -> Diagnostic session active?
  -> no -> no extra tracking
  -> yes -> Redis hash counters with TTL -> Usage dashboard -> Operator review
Quota command usage -> Usage dashboard
```

쉬운 설명: 문 앞에서 들어갈 수 있는지 판단하고, 관리자가 원할 때만 카운터를 켜서 어느 문이 붐비는지 확인한다.

## 06 Worker Platform

현재 의심 지점:

- local worker down 감지가 heartbeat/control state와 명확히 연결되지 않는다.
- Railway backup이 jobs를 claim하기 전에 active owner를 바꾸는 단계가 더 선명해야 한다.
- failback/park가 어디로 돌아가는지 차트 끝이 약하다.
- media processing 설명이 02번 media pipeline과 겹치므로 worker card에서는 ownership과 module orchestration에 더 집중해야 한다.

목표 흐름:

```text
Heartbeat + module health -> worker_control_state -> Active owner check
  -> local healthy -> Local supervisor -> WORKER_MODULES routing
      -> media / backup / scheduled ops -> Status + audit writeback -> Worker Ops dashboard
  -> local down or failover webhook -> Failover eligibility check
      -> Wake Railway /ready -> Control-plane refresh -> Active owner = Railway
      -> Backup claims eligible jobs -> Status + audit writeback -> Worker Ops dashboard
      -> Local recovery detected -> Failback cooldown -> Active owner = local -> Park Railway
```

쉬운 설명: 누가 지금 작업 책임자인지 먼저 정하고, 책임자가 바뀌면 그 사람만 일을 집어 가게 만드는 흐름이다.

## 차트 생성 파일 수정 기준

- `scripts/generate-project-diagrams.mjs` 안의 노드 이름은 `src/i18n.ts`의 단계 이름과 최대한 맞춘다.
- 실패 화살표는 항상 "어디서 다시 시작하는지"가 보여야 한다.
- 복구 흐름은 dashed arrow로 유지하되, 정상 흐름과 섞여 보이지 않도록 별도 frame 또는 lane에 둔다.
- `entry`, `process`, `decision`, `recovery`, `output` 색상 의미를 계속 유지한다.
- 한 카드 안에서 output이 두 개 이상이면 `success output`, `blocked output`, `manual output`처럼 끝 상태 이름을 분명히 한다.

## 검증 체크리스트

- 한국어 PNG 6개와 영어 PNG 6개가 모두 새로 생성된다.
- editable `.excalidraw` 6개도 최신 흐름으로 갱신된다.
- 6개 모달의 제목, 상세 단계, 그림 노드가 같은 순서로 말한다.
- 긴 한국어 라벨이 노드 밖으로 삐져나오지 않는다.
- 모바일 폭에서 모달 안 그림이 과하게 잘리거나 텍스트와 겹치지 않는다.
- `npm run build`가 통과한다.
