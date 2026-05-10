# Redprint 포트폴리오 구현 항목 정리 (한국어)

이 문서는 Redprint 프로젝트를 개인 개발자 포트폴리오에서 소개할 때 사용할 구현 항목과 시각화 아이디어를 정리한 것이다.  
이력서의 Side Project 섹션처럼, 화면 기능명을 그대로 쓰기보다 **기술적으로 무엇을 설계하고 구현했는지**가 드러나도록 작성한다. 다만 포트폴리오 페이지는 이력서보다 더 넓은 사람이 읽기 때문에, 제목은 너무 내부 개발 용어처럼 쓰지 않고 제품 맥락이 보이게 둔다.

`프롬프트 작성 화면을 만들었다`처럼 너무 일반적으로 쓰지도 않고, `creator-facing publishing submission coordinator`처럼 개발자만 알아듣게 쓰지도 않는다. `복구 가능한 콘텐츠 등록 흐름`처럼 먼저 이해되는 이름을 쓰고, 설명 안에서 `multi-step workflow`, `draft persistence`, `media readiness gate` 같은 구현 장치를 풀어준다.

## 작성 방식

좋은 표현은 아래 순서를 따른다.

1. **사용자가 이해할 수 있는 시스템 이름**을 먼저 말한다.
2. 바로 뒤에 **개발자가 알아볼 기술 구현 단위**를 붙인다.
3. 그 안에 들어간 **구체적인 설계 부품**을 설명한다.
4. 마지막에 **왜 어려웠고 어떤 안정성을 얻었는지** 설명한다.

예시:

- 약한 표현: `프롬프트 폼 작성 및 제출`
- 너무 개발자 중심 표현: `Multi-step submission workflow for creator-facing publishing`
- 균형 잡힌 표현: `복구 가능한 콘텐츠 등록 흐름`
- 더 좋은 설명: `판매자가 긴 등록 폼을 안전하게 제출할 수 있도록 multi-step workflow를 설계했다. 단계별 검증, draft persistence, direct-to-storage upload, media readiness gate, create/edit 공통 submit coordinator를 묶어 중간 실패 후에도 제출을 복구할 수 있게 했다.`

제목은 “무슨 문제를 푸는 시스템인지” 알 수 있게 쓰고, 본문에서는 “그 시스템이 안 망가지게 하기 위해 어떤 장치를 만들었는지”를 보여준다.

## 우선순위 요약

| 우선순위 | 균형 잡힌 항목명 | 사용자에게 보이는 화면 | 보여줄 역량 |
|---|---|---|---|
| 1 | 복구 가능한 콘텐츠 등록 흐름 | 프롬프트 등록/수정 위자드 | 상태 관리, 검증, 복구 가능한 제출 흐름 |
| 2 | 대용량 미디어 직접 업로드 파이프라인 | 이미지/영상 업로드 카드 | R2 presigned upload, 서버 부하 절감, 업로드 안정성 |
| 3 | 반응형 마켓플레이스 탐색 피드 | Explore 카드 벽 | 반응형 레이아웃, prefetch, pagination, 성능 |
| 4 | 결제부터 판매자 정산까지 이어지는 돈의 흐름 | 장바구니, 결제, 판매자 정산 | Stripe, webhook, ledger, 중복 실행 방지 |
| 5 | 운영자가 검증할 수 있는 정산·원장 시스템 | Admin Finance 탭 | 회계 증거, 월마감, reconciliation, 운영 검증 |
| 6 | 백그라운드 미디어 처리 작업 시스템 | 태깅/트랜스코딩/후처리 상태 | queue, lease, heartbeat, failover |
| 7 | 구매 건에 묶인 분쟁 처리 흐름 | 구매자/판매자 지원 티켓룸 | 상태 전이, timeout policy, transactional email |
| 8 | 역할별로 달라지는 상품 접근 제어 | 상세 페이지, 구매/소유자 화면 | 권한, 공개 상태, fail-closed 정책 |
| 9 | 제품 전반의 UI 규칙을 잡는 디자인 시스템 | 반복 UI 컴포넌트 | token, component contract, rollout 관리 |
| 10 | 장애를 분류하고 알리는 운영 관측 시스템 | Sentry/Slack/운영 대시보드 | webhook 검증, dedup, alert routing |
| 11 | 프롬프트 변수 입력 자동화 시스템 | 변수 입력/프롬프트 조립 UI | text parsing, dynamic form, typed payload |
| 12 | 도메인별로 정리된 API·데이터 구조 | 보이지 않는 백엔드 구조 | Next.js API, Drizzle schema, service layer |
| 13 | 어드민 운영 허브 | Admin dashboard 전체 | 심사, 정산, 지원, 스토리지, 알림, 피드백, 운영 점검 |
| 14 | Worker 운영·복구 컨트롤 플레인 | Worker Ops, cron/internal routes | media jobs, scheduled ops, heartbeat, failover |

## 1. 복구 가능한 콘텐츠 등록 흐름

### 포트폴리오용 설명

판매자가 긴 등록 과정을 안전하게 끝낼 수 있도록 복구 가능한 multi-step submission workflow를 설계했다. 단계별 검증, draft persistence, media readiness gate, create/edit 공통 submit coordinator를 묶어 업로드 지연이나 중간 실패가 있어도 제출 흐름을 이어갈 수 있게 했다.

### 쉽게 풀어쓴 설명

판매자가 프롬프트 상품을 등록하거나 수정할 때 쓰는 4단계 제출 흐름이다. 사용자 화면에서는 `Basic Info`, `Assets`, `Prompt Content`, `Output Examples` 단계로 보인다. 개발적으로는 긴 폼 제출이 중간에 끊기거나 업로드가 늦어져도 다시 이어갈 수 있도록 만든 상태 관리 시스템이다.

초등학생에게 설명하듯 말하면, 숙제를 한 번에 다 내는 게 아니라 4장짜리 숙제 파일을 한 장씩 저장하면서 제출하는 구조다. 중간에 컴퓨터가 꺼져도 앞에서 한 작업을 다시 찾을 수 있게 해 둔 것이다.

### 강조할 기술 구현

- Create와 Edit 화면이 같은 step contract를 공유하도록 설계했다.
- 각 단계별 validation을 분리하고, 최종 제출 시 전체 검증을 다시 수행했다.
- draft persistence로 긴 작성 흐름을 복구 가능하게 만들었다.
- upload session, media linking, review submit을 하나의 coordinator 흐름으로 묶었다.
- submit blocker와 background processing readiness를 분리해 사용자가 불필요하게 막히지 않게 했다.

### 시각적 프레젠테이션 아이디어

- 4-step wizard mock: 단계별 입력과 검증 상태가 바뀌는 화면.
- Submission state machine: `draft -> uploading -> linked -> submitted -> pending review` 흐름도.
- Failure recovery demo: 네트워크 실패 후 같은 draft에서 다시 제출하는 애니메이션.

## 2. 대용량 미디어 직접 업로드 파이프라인

### 포트폴리오용 설명

이미지와 영상 같은 큰 파일을 브라우저에서 Cloudflare R2로 직접 보내는 media ingestion pipeline을 설계했다. 앱 서버는 파일 본문을 직접 처리하지 않고 presigned upload 발급, 업로드 완료 검증, 후처리 queue 등록만 맡도록 나눠 업로드 안정성과 서버 비용 효율을 높였다.

### 쉽게 풀어쓴 설명

사용자가 이미지나 영상을 올릴 때, 파일 전체를 Next.js 서버가 받아서 다시 저장소로 보내지 않게 만든 업로드 구조다. 브라우저가 Cloudflare R2에 직접 업로드하고, 앱 서버는 “업로드 시작”, “업로드 완료 확인”, “후처리 작업 등록” 같은 작은 신호만 처리한다.

이삿짐을 작은 사무실로 먼저 다 들였다가 창고로 옮기는 게 아니라, 트럭이 바로 창고로 가게 만든 것이다. 사무실은 송장 확인과 창고 문 열어주는 일만 한다.

### 강조할 기술 구현

- presigned URL 기반 direct upload를 설계했다.
- R2 `HEAD` 검증으로 업로드 완료 여부와 파일 메타데이터를 확인했다.
- temp media row와 upload session을 연결해 제출 흐름과 업로드 흐름을 분리했다.
- 이미지 public derivative, video MP4 transcode, AI tagging 작업을 queue에 등록했다.
- 업로드 완료와 공개 가능 상태를 분리해 storefront는 안전한 미디어가 준비될 때만 열리게 했다.

### 시각적 프레젠테이션 아이디어

- Browser -> R2 -> verification -> queue diagram.
- 업로드 카드 상태 데모: `uploading`, `verifying`, `tagging`, `derivative processing`, `ready`.
- 서버 비용 비교 카드: app server upload 방식과 direct upload 방식의 요청 흐름 비교.

## 3. 반응형 마켓플레이스 탐색 피드

### 포트폴리오용 설명

미디어가 많은 마켓플레이스 탐색 화면을 빠르게 보여주기 위해 adaptive discovery feed를 구현했다. 상품 카드의 표시 방식과 행 배치를 같은 descriptor로 계산하고, offset pagination, batched preview prefetch, shared visibility observer를 적용해 긴 스크롤에서도 성능과 데이터 정확성을 유지했다.

### 쉽게 풀어쓴 설명

Explore 화면의 카드 벽을 만든 구현이다. 사용자는 여러 프롬프트 상품을 이미지 카드로 둘러보고, 검색 dock과 필터를 사용하며, 카드를 클릭해 미리보기 modal을 본다.

기술적으로는 단순히 카드를 줄줄이 놓은 것이 아니다. 카드마다 이미지 1장, 2장, 3장 중 무엇을 보여줄지 계산하고, 화면 크기에 맞춰 카드 폭과 행 배치를 조정한다. 책장 크기에 맞춰 책을 보기 좋게 꽂되 같은 책을 여러 권 있는 척 복사하지 않는 구조다.

### 강조할 기술 구현

- 한 prompt asset이 하나의 collection card로 보이도록 설계했다.
- card renderer와 row packer가 같은 presentation descriptor를 읽게 했다.
- 초기 fetch와 scroll fetch의 batch size가 달라도 안전하도록 offset-based pagination을 유지했다.
- preview modal용 media prefetch를 wall rendering과 별도 loading track으로 분리했다.
- per-card observer 대신 shared observer pool을 사용해 long-scroll 성능을 보호했다.
- prefetch batch size와 session budget을 제한해 네트워크 비용을 관리했다.

### 시각적 프레젠테이션 아이디어

- Viewport slider: 화면 폭에 따라 카드 행과 카드 폭이 변하는 데모.
- Card descriptor inspector: `visibleTiles`, `preferredWeight`, `cropScore`를 보여주는 패널.
- Prefetch budget meter: hover/near-visible 이벤트가 batch request로 묶이는 모습.
- Offset pagination timeline: `12 -> 18 -> 18` batch가 중복 없이 이어지는 시각화.

## 4. 결제부터 판매자 정산까지 이어지는 돈의 흐름

### 포트폴리오용 설명

구매자의 결제부터 판매자 정산까지 이어지는 payment control layer를 구현했다. multi-creator cart grouping, Stripe webhook finalization, creator payable tracking, scheduled payout, receipt generation, duplicate-execution guard를 묶어 돈의 흐름이 중복 처리되거나 누락되지 않게 했다.

### 쉽게 풀어쓴 설명

구매자는 장바구니에서 한 번 결제하지만, 내부에서는 상품별 판매자, 플랫폼 수수료, 정산 대기 금액, 지급 가능 상태를 따로 계산해야 한다. 이 항목은 그 돈의 흐름을 안전하게 관리하는 구현이다.

손님은 계산대에서 한 번 돈을 내지만, 가게 안쪽 장부에는 “A 판매자에게 얼마, B 판매자에게 얼마, 플랫폼 수수료는 얼마”가 정확히 나뉘어 적히는 구조다.

### 강조할 기술 구현

- multi-creator cart item을 creator group으로 나눠 checkout session을 생성했다.
- Stripe webhook에서 purchase completion, journal posting, referral conversion, creator payable 업데이트를 처리했다.
- checkout success 화면에서 결제 성공과 내부 finalization 사이의 짧은 시간차를 retry state로 처리했다.
- creator payout threshold, execution floor, connected account readiness를 분리했다.
- idempotency와 lock 패턴으로 중복 지급, 중복 webhook 처리 위험을 줄였다.

### 시각적 프레젠테이션 아이디어

- Money flow diagram: Buyer -> Stripe -> Redprint ledger -> creator payable -> payout.
- Cart split table: 한 장바구니를 creator별로 그룹화하고 fee를 계산하는 표.
- Webhook finalization timeline: 결제 이벤트 이후 row와 journal entry가 생기는 순서.
- Duplicate execution guard demo: 같은 webhook이 두 번 와도 한 번만 처리되는 시각화.

## 5. 운영자가 검증할 수 있는 정산·원장 시스템

### 포트폴리오용 설명

운영자가 돈의 흐름을 검증할 수 있도록 admin finance system을 구현했다. monthly close approval, creator payable rollforward, tax liability tracking, ledger drilldown, reconciliation snapshot, receipt generation, webhook recovery를 연결해 숫자가 왜 그렇게 나왔는지 추적할 수 있게 했다.

### 쉽게 풀어쓴 설명

관리자가 월마감, 세금 등록, 세금 납부, 원장 조회, reconciliation, revenue summary를 확인하는 운영 회계 시스템이다. 숫자를 손으로 마음대로 바꾸는 화면이 아니라, 시스템이 만든 장부 증거를 사람이 검토하고 승인하는 화면이다.

가게 주인이 하루 장사를 끝내고 금고와 장부가 맞는지 확인하는 정산표다. “돈이 들어왔다”에서 끝나는 게 아니라, 왜 이 숫자가 나왔는지 줄줄이 따라갈 수 있게 만든 것이다.

### 강조할 기술 구현

- creator payable rollforward로 beginning balance, activity, ending balance를 계산했다.
- journal entry와 debit/credit line을 drilldown할 수 있는 ledger explorer를 구성했다.
- stuck checkout, creator balance drift, pending accounting 같은 reconciliation issue를 surface했다.
- monthly close draft/approval 흐름을 운영자가 검토 가능한 증거 패킷으로 만들었다.
- tax registration과 remittance는 실제 운영 이벤트를 기록하는 별도 tab으로 분리했다.

### 시각적 프레젠테이션 아이디어

- Monthly close builder: 월을 고르면 liability 카드와 rollforward 표가 바뀌는 데모.
- Ledger drilldown: journal entry row 클릭 시 debit/credit line이 펼쳐지는 인터랙션.
- Reconciliation warning panel: stuck checkout, balance drift, pending accounting 상태 카드.
- Revenue trend chart: GMV, fee revenue, creator payable, take rate를 함께 표시.

## 6. 백그라운드 미디어 처리 작업 시스템

### 포트폴리오용 설명

웹 요청 안에서 처리하기 어려운 태깅, 트랜스코딩, 이미지 파생본 생성, 예약 작업을 worker-owned asynchronous processing 구조로 분리했다. queue, lease, status contract, heartbeat ownership, retry path, health/readiness probe를 적용해 긴 작업을 안정적으로 처리하고 복구할 수 있게 했다.

### 쉽게 풀어쓴 설명

이미지 태깅, 공개용 이미지 파생본 생성, 영상 MP4 변환, 오래 걸린 작업 복구 같은 일을 웹 요청 안에서 처리하지 않고 worker가 맡게 한 구조다.

주문 받는 직원과 요리하는 주방을 나눈 것이다. 웹 서버는 주문을 받고, worker는 뒤에서 시간이 걸리는 작업을 처리한다.

### 강조할 기술 구현

- media derivative job, transcode job, tagging job을 별도 queue로 관리했다.
- worker ownership과 heartbeat로 같은 작업을 여러 worker가 동시에 처리하지 않게 했다.
- stale job sweeper와 retry route로 실패하거나 멈춘 작업을 복구했다.
- health/readiness probe와 control-plane 설계로 failover 가능성을 열어뒀다.
- 공개 storefront는 worker 결과가 준비되기 전 원본 미디어로 조용히 fallback하지 않게 했다.

### 시각적 프레젠테이션 아이디어

- Queue monitor dashboard: pending, processing, completed, failed job count.
- Worker state machine: claim -> process -> write result -> release.
- Original vs public derivative 비교 화면.
- Retry button demo: failed job을 retry하면 상태가 바뀌는 작은 운영 UI.

## 7. 구매 건에 묶인 분쟁 처리 흐름

### 포트폴리오용 설명

구매 건마다 연결되는 dispute workflow를 구현했다. buyer, seller, admin이 같은 canonical transcript를 보도록 만들고, transaction 기반 room creation, resolution offer, timeout policy automation, idempotent transactional email을 적용해 지원 기록이 흩어지지 않게 했다.

### 쉽게 풀어쓴 설명

구매자가 특정 구매 건에 대해 문제를 제기하면, 구매자와 판매자가 같은 ticket room에서 대화하고, 필요하면 관리자 검토로 넘어가는 구조다. 이메일이나 DM으로 흩어지는 대신, 같은 사건 기록을 모두가 공유한다.

문제가 생긴 주문마다 전용 대화방과 사건 기록장을 만들어 둔 것이다. 누가 언제 답했는지, 환불 검토가 필요한지, 시간이 너무 오래 지났는지를 한 곳에서 본다.

### 강조할 기술 구현

- ticket header, buyer/seller participants, first buyer message를 하나의 transaction으로 생성했다.
- buyer, seller, admin이 같은 canonical transcript를 보도록 설계했다.
- seller response, refund review offer, close without refund offer를 room event로 모델링했다.
- timed policy sweep으로 24h/48h warning과 72h automatic outcome을 처리했다.
- transactional email에 idempotency key를 적용해 중복 발송을 막았다.

### 시각적 프레젠테이션 아이디어

- Three-lane transcript: buyer, seller, system/admin 이벤트를 시간순으로 표시.
- Timeout policy clock: 24h, 48h, 72h에 어떤 일이 생기는지 시뮬레이션.
- Resolution offer cards: refund review와 close-without-refund 제안 카드.
- Email event log: 어떤 trigger가 어떤 template을 보냈는지 보여주는 로그.

## 8. 역할별로 달라지는 상품 접근 제어

### 포트폴리오용 설명

방문자, 판매자, 구매자, 관리자마다 다르게 열리는 role-aware access control을 구현했다. public storefront는 shopper-facing media가 준비되기 전까지 fail-closed로 닫고, owner와 admin은 관리 목적의 별도 경로로 상태를 확인할 수 있게 분리했다.

### 쉽게 풀어쓴 설명

같은 상품 상세 페이지라도 방문자, 구매자, 판매자, 관리자가 보는 정보와 버튼이 다르다. 또 판매자가 상품을 제출했더라도 공개용 미디어가 아직 준비되지 않았다면 일반 방문자에게는 진열하지 않는다.

같은 건물이라도 손님, 직원, 관리자에게 열리는 문이 다르다. 아직 진열 준비가 안 된 상품은 창고에는 있어도 매장 진열대에는 올라오지 않는다.

### 강조할 기술 구현

- public visitor, owner, purchaser, admin 상태별 UI와 API 접근을 분리했다.
- owner는 관리 화면을 볼 수 있지만, public storefront는 readiness gate를 통과해야 열리게 했다.
- rejected/pending/draft/published revision 상태를 화면 chip과 action으로 반영했다.
- protected detail workspace와 public detail/card surface를 분리했다.
- NSFW overlay, revision toggle, prompt copy unit 같은 구매 전후 UX를 권한에 맞게 제어했다.

### 시각적 프레젠테이션 아이디어

- Role switcher: `visitor`, `owner`, `purchaser`, `admin` 선택 시 버튼과 상태 chip이 바뀌는 데모.
- Storefront gate animation: media readiness 전에는 카드가 잠기고, 준비 후 공개되는 흐름.
- Revision timeline: published, draft, rejected, resubmitted 상태를 시간축으로 표시.

## 9. 제품 전반의 UI 규칙을 잡는 디자인 시스템

### 포트폴리오용 설명

제품 화면이 커져도 UI가 제각각 흩어지지 않도록 semantic design system을 정의했다. primitive token, semantic role/state token, component contract, UI surface family, rollout tracking, approved exception policy를 묶어 반복 UI의 기준을 관리했다.

### 쉽게 풀어쓴 설명

버튼, 카드, 상태 badge, overlay 같은 반복 UI가 화면마다 제각각 보이지 않도록 만든 디자인 시스템이다. MUI를 쓰되 raw color를 마음대로 쓰는 대신, `primary action`, `error feedback`, `surface card`처럼 역할 중심 token을 쓰게 했다.

레고 블록 설명서를 만든 것이다. 매번 새 블록을 깎는 게 아니라, 어떤 상황에 어떤 블록을 써야 하는지 정해 둔 구조다.

### 강조할 기술 구현

- primitive token과 semantic token layer를 분리했다.
- component-token map으로 shared component의 시각 책임을 정의했다.
- UI IA family로 content card, preview panel, status badge, stat card 같은 반복 surface를 분류했다.
- rollout ledger로 migrated/in-progress/deferred surface를 추적했다.
- third-party brand color 같은 예외는 approved exception policy로 관리했다.

### 시각적 프레젠테이션 아이디어

- Token playground: semantic token을 바꾸면 button/card/badge가 함께 변하는 데모.
- Before/after diff: raw styling 화면과 governed token 화면 비교.
- Component contract viewer: status badge, stat card, notification item 규칙을 탭으로 표시.
- Rollout heatmap: 화면별 design-system adoption 상태.

## 10. 장애를 분류하고 알리는 운영 관측 시스템

### 포트폴리오용 설명

서비스 장애를 분류하고 필요한 채널로 알리기 위해 observability and incident routing workflow를 구성했다. Sentry classification, Slack webhook relay, production-only filtering, event deduplication, payment-domain routing, retry/backoff, Redis replay guard를 적용했다.

### 쉽게 풀어쓴 설명

서비스에 문제가 생겼을 때 Sentry가 에러를 잡고, 중요한 production error만 Slack으로 보내는 구조다. 결제 관련 에러는 별도 채널로 라우팅하고, 같은 이슈가 반복해서 들어와도 중복 알림을 줄인다.

화재 경보기다. 모든 소리를 다 크게 울리는 게 아니라, 진짜 위험한 경보만 담당자에게 보내고 같은 경보가 계속 울리지 않게 조절한다.

### 강조할 기술 구현

- Sentry webhook signature와 timestamp freshness를 검증했다.
- production `error` / `fatal` event만 처리하도록 scope filter를 두었다.
- domain tag와 URL keyword 기반으로 payment/system channel을 나눴다.
- Redis event idempotency key와 issue dedup lock으로 중복 알림을 줄였다.
- Slack 전송 실패는 retry/backoff로 처리했다.

### 시각적 프레젠테이션 아이디어

- Incident router pipeline: signature -> validation -> scope filter -> dedup -> routing -> Slack.
- Slack alert preview: payment error와 system error가 다른 channel card로 보이는 mock.
- Dedup timeline: 30초 processing lock과 10분 confirmed dedup window 시각화.
- Environment health matrix: DB, R2, Stripe, Redis, worker 상태표.

## 11. 프롬프트 변수 입력 자동화 시스템

### 포트폴리오용 설명

프롬프트 본문에서 변수 자리를 읽어 필요한 입력칸을 자동 생성하는 schema-driven parameter system을 구현했다. placeholder parsing, typed form control generation, single/chain mode validation, real-time prompt assembly를 연결해 프롬프트 템플릿을 사용자 입력 UI로 바꿨다.

### 쉽게 풀어쓴 설명

프롬프트 본문 안의 `[[subject]]` 같은 변수 자리를 읽어서, 사용자에게 필요한 입력칸을 자동으로 만들어 주는 구조다. 사용자가 값을 넣으면 최종 프롬프트가 실시간으로 조립된다.

빈칸이 있는 문제지를 읽고 “여기에는 주제, 여기에는 스타일을 넣어야 해”라고 자동으로 입력칸을 만들어 주는 기능이다.

### 강조할 기술 구현

- prompt text에서 placeholder variable을 파싱했다.
- single prompt와 chain prompt 모드의 변수 입력 구조를 분리했다.
- fixed prompt mode에서는 변수 입력을 요구하지 않도록 validation contract를 분기했다.
- output example별 variable values를 저장하고, 상세 화면에서 실제 예시 문장으로 다시 조립했다.
- hidden field clearing으로 화면에서 사라진 값이 submit payload에 섞이지 않게 했다.

### 시각적 프레젠테이션 아이디어

- Prompt parser demo: 텍스트에 `[[variable]]`을 넣으면 오른쪽에 입력칸이 생김.
- Live assembly preview: 변수값을 입력하면 최종 prompt가 실시간으로 완성됨.
- Single vs chain mode switcher: 모드에 따라 입력 구조가 달라지는 화면.
- Hidden payload inspector: UI에서 숨겨진 값이 제출 payload에서 제거되는 모습.

## 12. 도메인별로 정리된 API·데이터 구조

### 포트폴리오용 설명

기능이 커져도 코드가 한곳에 뒤섞이지 않도록 domain-oriented architecture를 설계했다. Next.js API routes, Drizzle schema modules, relation tests, service-layer boundaries, shared domain engines를 assets, commerce, creator, support, finance, media processing, admin 영역으로 나눴다.

### 쉽게 풀어쓴 설명

Redprint의 기능들이 아무 데나 섞이지 않도록 API, DB schema, service layer를 도메인별로 나눈 구조다. 상품, 구매, 정산, 지원 티켓, 미디어 작업, 알림, 관리자 기능이 각자 역할을 가지고 연결된다.

큰 건물의 방 배치도다. 계산대, 창고, 고객센터, 사무실, 작업실이 한 공간에 뒤섞여 있지 않고 각자 맡은 일이 있는 구조다.

### 강조할 기술 구현

- UI, business logic, service layer, API layer, data access layer를 분리했다.
- Drizzle schema와 relation modules를 domain별로 구성했다.
- admin-only, creator-only, shared domain engine의 경계를 나눴다.
- API route를 assets, creator, commerce, support, admin, tagging 등으로 분리했다.
- architecture docs와 Codesight map으로 대규모 route/component/schema 구조를 추적 가능하게 했다.

### 시각적 프레젠테이션 아이디어

- System architecture map: UI -> service -> API -> DB -> external services.
- Domain explorer: Assets, Commerce, Creator, Support, Finance를 누르면 관련 route/table/component가 펼쳐짐.
- Schema relationship mini map: purchases, assets, creator balances, support tickets, media jobs 연결도.
- API heatmap: route prefix별 endpoint 수를 막대 그래프로 표시.

## 13. 어드민 운영 허브와 Worker 운영·복구 컨트롤 플레인

어드민과 worker 기능은 각각 하나의 대표 구현 항목으로만 줄이면 범위가 잘 보이지 않는다. 그래서 포트폴리오에서는 아래 두 축으로 묶어 보여주는 것이 좋다.

- `어드민 운영 허브`: 콘텐츠 심사, Prompt Ops, Finance, Treasury, Support, R2 Storage, Transcode Monitor, Worker Ops, Upstash Usage, Environment Health, Notifications, Audit Logs, Todos, Beta Program, Feedback, Danbooru Sync, PromptBase Scraper, local Midjourney selection, Icon Showcase, Design Token 실험을 포함한다.
- `Worker 운영·복구 컨트롤 플레인`: tagging queue, temp media status, image derivative, video transcode, prompt import tagging, upload session cleanup, stale processing recovery, stuck checkout reconciliation, scheduled payout planner/executor/retry, webhook cleanup, support policy sweep, heartbeat, failover, Railway backup orchestration을 포함한다.

상세 커버리지 문서는 `redprint-admin-worker-coverage.ko.md`에 따로 정리했다. 메인 포트폴리오에서는 두 개의 큰 운영 시스템으로 보여주고, 펼침 패널이나 case study 안에서 전체 기능 목록을 열어 보여주면 된다.

## 포트폴리오 화면에 넣을 때의 제목 후보

아래 제목들은 일반 방문자도 이해할 수 있으면서, 개발자에게는 기술 깊이가 보이도록 만든 표현이다. 메인 카드 제목은 한국어로 두고, 상세 설명이나 작은 라벨에서 영어 기술 용어를 함께 쓰는 방식이 가장 안정적이다.

- `복구 가능한 콘텐츠 등록 흐름` — multi-step workflow, draft persistence, submit coordinator
- `대용량 미디어 직접 업로드 파이프라인` — R2 presigned upload, verification, queue orchestration
- `반응형 마켓플레이스 탐색 피드` — adaptive layout, row packing, batched prefetch
- `결제부터 판매자 정산까지 이어지는 돈의 흐름` — Stripe Checkout, webhook, payout control
- `운영자가 검증할 수 있는 정산·원장 시스템` — ledger, monthly close, reconciliation
- `백그라운드 미디어 처리 작업 시스템` — worker queue, lease, retry, failover
- `구매 건에 묶인 분쟁 처리 흐름` — canonical transcript, timeout policy, email idempotency
- `역할별로 달라지는 상품 접근 제어` — role-aware access, storefront readiness gate
- `제품 전반의 UI 규칙을 잡는 디자인 시스템` — semantic tokens, component contracts
- `장애를 분류하고 알리는 운영 관측 시스템` — Sentry, Slack routing, dedup
- `프롬프트 변수 입력 자동화 시스템` — placeholder parsing, dynamic form generation
- `도메인별로 정리된 API·데이터 구조` — service boundaries, Drizzle schema, API routes
- `어드민 운영 허브` — review, finance, treasury, support, storage, ops dashboards
- `Worker 운영·복구 컨트롤 플레인` — worker lanes, scheduled ops, heartbeat, failover

## 웹 시각화 우선 구현안

처음 포트폴리오 페이지에서는 아래 6개만 먼저 구현해도 충분하다.

1. **반응형 마켓플레이스 탐색 피드**
   - 가장 시각적으로 강하다.
   - 카드 벽, preview modal, prefetch meter를 한 화면에서 보여줄 수 있다.

2. **복구 가능한 콘텐츠 등록 흐름**
   - 제품의 핵심 제작 흐름이다.
   - 단계별 검증, draft 복구, 업로드 상태를 인터랙션으로 보여주기 좋다.

3. **결제부터 판매자 정산까지 이어지는 돈의 흐름**
   - 단순 UI가 아니라 돈의 흐름을 다뤘다는 점이 강하게 보인다.
   - webhook timeline과 ledger posting을 함께 보여주면 좋다.

4. **운영자가 검증할 수 있는 정산·원장 시스템**
   - 운영/회계 시스템을 설계한 경험이 드러난다.
   - 월마감, reconciliation, journal entry drilldown은 포트폴리오 차별점이 된다.

5. **백그라운드 미디어 처리 작업 시스템**
   - 백그라운드 처리, queue, retry, failover 설계를 보여준다.
   - job dashboard 형태로 시각화하기 쉽다.

6. **프롬프트 변수 입력 자동화 시스템**
   - 직접 눌러보는 데모로 만들기 좋다.
   - 텍스트 파싱, dynamic form generation, live preview가 한 화면에서 바로 이해된다.

## 표현할 때 피해야 할 방식

아래처럼 제품 내부 화면명만 쓰면 포트폴리오에서 힘이 약해진다.

- `프롬프트 폼 작성 및 제출`
- `Explore 페이지 제작`
- `결제 페이지 구현`
- `관리자 정산 페이지 제작`
- `고객센터 채팅 기능`
- `디자인 시스템 적용`

너무 개발자만 알아듣는 표현도 피한다.

- `creator-facing publishing submission coordinator`
- `collection-card presentation descriptor row solver`
- `escrow-style payable rollforward and settlement execution layer`
- `worker-owned queue/lease/status control-plane`

대신 아래처럼 **제품 맥락 + 기술 장치**가 같이 보이게 바꾸는 것이 좋다.

- `복구 가능한 콘텐츠 등록 흐름: draft persistence와 media readiness gate로 긴 제출 과정을 보호`
- `반응형 마켓플레이스 탐색 피드: row packing과 batched prefetch로 이미지 카드 벽 성능 개선`
- `결제부터 정산까지 이어지는 돈의 흐름: Stripe webhook과 ledger posting으로 중복 처리 방지`
- `운영자가 검증할 수 있는 정산·원장 시스템: monthly close와 reconciliation으로 숫자의 근거 추적`
- `구매 건에 묶인 분쟁 처리 흐름: canonical transcript와 timeout policy로 지원 기록 관리`
- `제품 전반의 UI 규칙을 잡는 디자인 시스템: semantic token과 component contract로 일관성 유지`

“무슨 페이지를 만들었는지”만 말하지도 않고, “내부 설계 용어”만 늘어놓지도 않는다. 먼저 사람이 이해할 이름을 주고, 바로 뒤에서 기술 장치를 보여준다.

## 최종 추천 방향

포트폴리오에서는 Redprint를 모든 기능을 나열하는 프로젝트로 보여주기보다, **복잡한 마켓플레이스 시스템을 기능별로 설계하고 운영 가능하게 만든 사례**로 보여주는 것이 좋다.

첫 화면에서는 `Upload`, `Explore`, `Checkout`, `Finance`, `Worker`, `Support`를 큰 시스템 노드로 보여준다. 각 노드를 클릭하면 기술 구현 설명, mock UI, 상태 흐름도, 관련 코드 위치가 함께 나오는 구조가 적합하다.

예쁜 화면 모음집이 아니라 “실제 서비스가 어떻게 굴러가게 만들었는지 보여주는 작동 지도”로 만들면 좋다.
