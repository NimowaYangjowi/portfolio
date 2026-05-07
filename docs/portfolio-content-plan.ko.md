# 포트폴리오 웹사이트 콘텐츠 기획

이 문서는 포트폴리오 웹사이트에 어떤 내용을 넣을지 결정하는 중앙 문서다. 원본 메모는 `docs/source/`에 보관하고, 실제 웹사이트 문구와 정보 구조는 이 문서를 기준으로 정한다.

쉽게 말하면, `docs/source/`는 재료 창고이고 이 문서는 요리 순서표다. 모든 재료를 화면에 다 올리는 것이 아니라, 방문자가 가장 빨리 이해할 수 있는 순서로 골라 배치한다.

## 원본 문서 위치

| 원본 문서 | 현재 위치 | 용도 |
|---|---|---|
| 포지셔닝 브리프 | `docs/portfolio-positioning-brief.ko.md` | 전체 포트폴리오가 어떤 사람으로 읽혀야 하는지 정리 |
| Redprint 구현 항목 정리 | `docs/source/redprint-implementation-showcase-ideas.ko.md` | 14개 구현 항목의 원본 설명 |
| Redprint implementation ideas | `docs/source/redprint-implementation-showcase-ideas.en.md` | 영어 표현 참고 |
| 구현 항목 안내 문서 | `docs/source/redprint-implementation-showcase-ideas.md` | 원본 문서 묶음 안내 |
| Source Trace | `docs/source/redprint-implementation-source-trace.md` | 포트폴리오 문장과 실제 코드 위치 연결 |
| Admin/Worker 커버리지 | `docs/source/redprint-admin-worker-coverage.ko.md` | 운영자/worker 기능 범위 |
| Admin/Worker coverage EN | `docs/source/redprint-admin-worker-coverage.en.md` | 영어 표현 참고 |

## 포지셔닝

Redprint만 소개하면 “기술 구현을 해본 사람”으로 보인다. 하지만 전체 포트폴리오에서는 **고객의 복잡한 업무 문제를 기술 요구사항, 운영 정책, 실제 제품 시스템으로 바꾸는 사람**으로 보여주는 편이 더 강하다.

개발자 용어로는 customer-facing technical operator, implementation strategist, product builder를 함께 보여주는 방향이다. 쉽게 말하면, 고객이 “이거 안 돼요”라고 말했을 때 원인을 듣고, 필요한 데이터와 API를 정리하고, 개발팀이 만들 수 있는 요구사항으로 바꾸고, 필요하면 직접 도구까지 만드는 사람이라는 뜻이다.

Redprint는 이 포지셔닝을 증명하는 실제 제품 빌딩 사례다. 예쁜 화면만 만든 것이 아니라 마켓플레이스, 결제, 정산, 운영자 화면, worker 복구까지 돌아가게 만든 시스템으로 보여준다.

## 방문자가 먼저 이해해야 하는 한 문장

> 고객의 복잡한 업무 문제를 API, 데이터, 운영 정책, 제품 화면으로 번역하고, 실제로 굴러가는 도구와 시스템까지 만든 사람입니다.

Redprint를 설명할 때는 아래 문장을 보조 문장으로 쓴다.

> Redprint는 AI 프롬프트 상품을 등록, 탐색, 구매, 정산, 운영할 수 있도록 만든 마켓플레이스 시스템이며, 긴 제출 흐름과 대용량 미디어, 결제/정산, worker 복구까지 실제 운영에 필요한 구조를 설계한 프로젝트다.

쉽게 말하면, 첫 문장은 “나는 어떤 사람인가”를 말하고, 두 번째 문장은 “그걸 증명하는 대표 프로젝트가 무엇인가”를 말한다.

## 사이트 정보 구조

1. **Hero**
   - 역할: 내가 어떤 문제를 해결하는 사람인지 먼저 보여준다.
   - 화면 내용: 짧은 자기소개, customer-facing technical operator 포지셔닝, Redprint 한 줄 소개.
   - 쉬운 설명: 방문자가 첫 화면에서 “기술도 알고, 고객도 이해하고, 실제 제품도 만든 사람”이라고 느끼게 하는 간판이다.

2. **Proof Pillars**
   - 역할: 강점을 세 갈래로 정리한다.
   - 화면 내용: Technical Knowledge, Customer Success, Product Building.
   - 쉬운 설명: 넓은 경험을 한 줄로 뭉개지 않고, 세 개의 기둥으로 나눠 보여주는 영역이다.

3. **Customer-facing Case Studies**
   - 역할: 고객성공 경험이 단순 계정 관리가 아니라 technical discovery와 implementation이었다는 점을 보여준다.
   - 화면 내용: Samsung 글로벌 운영, OneLink Management Console, S2S Event Guide, Bitmango/Woowa adoption 사례.
   - 쉬운 설명: 고객과 이야기만 한 것이 아니라, 고객의 업무를 쪼개서 기술 흐름과 실행 계획으로 바꾼 증거를 보여주는 장이다.

4. **Product Build Evidence**
   - 역할: Redprint의 대표 구현 항목 5~6개를 시각적으로 빠르게 훑게 한다.
   - 화면 내용: 이미지 아코디언, 선택된 항목의 제목/짧은 설명, system map.
   - 쉬운 설명: 실제로 만든 제품의 중요한 방들을 책갈피처럼 펼쳐 보여주는 영역이다.

5. **Operations Layer**
   - 역할: admin과 worker 범위가 넓다는 점을 정리한다.
   - 화면 내용: Admin Operations Hub, Worker Operations Plane, customer-facing operations lens.
   - 쉬운 설명: 사용자가 보는 매장뿐 아니라 운영자가 보는 조종석과 뒤에서 일하는 작업반까지 보여준다.

6. **Source Trace**
   - 역할: 포트폴리오 주장을 실제 코드 위치와 외부 사례 근거에 연결한다.
   - 화면 내용: 대표 구현 항목별 핵심 파일 경로, Notion 기반 case evidence.
   - 쉬운 설명: “말만 한 것”이 아니라 실제 코드와 고객 사례의 주소록을 붙이는 영역이다.

## Proof Pillars 문구

| 축 | 보여줄 메시지 | 화면에서 보일 증거 |
|---|---|---|
| Technical Knowledge | API, SDK, 데이터 구조, 결제/정산, worker 흐름을 이해하고 설명할 수 있다. | Redprint system map, S2S data mapping, Stripe/ledger/worker 구현 |
| Customer Success | 고객의 숨은 업무 흐름을 발견하고, 글로벌 이해관계자를 맞춰 실행해본 경험이 있다. | Samsung 30+ offices, Bitmango, Woowa, SEA enterprise accounts, `$3M+ ARR`, 약 `98% retention` |
| Product Building | 요구사항을 문서에서 끝내지 않고 실제 도구와 제품 흐름으로 만든다. | Redprint, OneLink Management Console, S2S Event Guide |

쉽게 말하면, “기술을 안다”, “고객을 안다”, “직접 만든다”를 따로 보여줘야 한다. 세 가지가 동시에 보이면 일반 CSM이나 일반 개발자보다 훨씬 선명한 포지션이 된다.

## Notion 포지셔닝에서 가져온 증거

- Global commerce program operator: 국가, 파트너, 시스템, 정책 단위로 글로벌 확장 과제를 쪼개고 실행한다.
- Customer-facing technical operator: SDK, API, 데이터 구조, 제품 제약을 고객과 개발 조직이 이해할 수 있는 언어로 번역한다.
- OneLink Management Console: API-heavy marketing workflow를 비개발자도 안전하게 다룰 수 있는 내부 콘솔로 바꾼 사례다.
- S2S Event Guide: 공식 문서와 고객 데이터 구조 사이의 빈칸을 AFID-CUID mapping, 전송 조건, 실패 처리, 보안/모니터링 기준으로 메운 사례다.
- Samsung/Bitmango/Woowa/SEA footprints: 대형 고객, 글로벌 협업, adoption bottleneck, 데이터 기반 운영 개선을 보여주는 고객성공 근거다.

쉽게 말하면, 이 증거들은 “제가 열심히 했습니다”가 아니라 “어떤 종류의 어려운 문제를 어떤 방식으로 풀었습니다”를 말해준다.

## 첫 화면에 넣을 대표 항목

처음에는 아래 6개만 메인 showcase로 쓰는 것이 좋다. 14개를 전부 첫 화면에 넣으면 많아 보이지만 핵심이 흐려진다.

| 우선순위 | 화면 제목 | 사용자/운영자에게 보이는 화면 | 개발자가 볼 구현 포인트 | 고객/운영 메시지 |
|---|---|---|---|---|
| 1 | 복구 가능한 콘텐츠 등록 흐름 | 프롬프트 등록/수정 위자드 | multi-step workflow, draft persistence, media readiness gate | 긴 제출 과정에서도 사용자의 작업이 사라지지 않는다. |
| 2 | 대용량 미디어 직접 업로드 파이프라인 | 이미지/영상 업로드 카드 | R2 presigned upload, upload verification, queue orchestration | 무거운 파일도 서버를 막지 않고 안정적으로 처리한다. |
| 3 | 반응형 마켓플레이스 탐색 피드 | Explore 카드 벽 | adaptive layout, row packing, batched prefetch | 사용자는 빠르게 둘러보고, 제품은 네트워크 비용을 관리한다. |
| 4 | 결제부터 정산까지 이어지는 돈의 흐름 | 장바구니, 결제 완료, 판매자 정산 | Stripe webhook, ledger posting, idempotency guard | 돈의 상태를 구매자, 판매자, 운영자가 설명할 수 있게 만든다. |
| 5 | 운영자가 검증할 수 있는 정산·원장 시스템 | Admin Finance 탭 | monthly close, ledger drilldown, reconciliation | 운영자가 숫자의 원인을 추적하고 검증할 수 있다. |
| 6 | 백그라운드 미디어 처리 작업 시스템 | job dashboard, transcode monitor | queue, lease, retry, heartbeat, failover | 사용자가 화면을 떠나도 오래 걸리는 작업을 복구할 수 있다. |

## Case Study 작성 템플릿

각 상세 페이지나 섹션은 아래 순서를 따른다.

1. **고객/운영 문제**
   - 사용자가 어떤 일을 하려는지, 운영자는 어떤 위험을 줄여야 하는지 먼저 쓴다.
   - 예: 판매자는 이미지와 긴 프롬프트를 등록해야 하지만, 업로드 지연이나 네트워크 실패가 생길 수 있다.

2. **사용자/운영자 화면**
   - 실제 UI에서는 무엇으로 보이는지 쓴다.
   - 예: `Basic Info`, `Assets`, `Prompt Content`, `Output Examples` 단계가 있는 등록 위자드.

3. **기술 구현**
   - developer term을 쓴다.
   - 예: multi-step workflow, draft persistence, upload session, media readiness gate.

4. **고객성공/제품 판단**
   - 왜 이 구현이 고객 문제를 줄이는지 쓴다.
   - 예: 중간 저장과 업로드 준비 상태를 분리하면, 고객지원팀은 “제출이 안 됐다”는 문의를 상태별로 설명할 수 있다.

5. **안정성 장치**
   - 실패했을 때 무엇을 막았는지 쓴다.
   - 예: 중간 실패 후 draft 복구, 중복 webhook 방지, worker retry.

6. **근거**
   - source trace의 파일 경로 또는 외부 case evidence를 붙인다.
   - 예: `src/app/upload/prompt/components/PromptFormV2.tsx`.

쉽게 말하면, “무엇을 만들었다”에서 멈추지 않고 “누구의 어떤 문제를 줄였고, 내부에서는 어떻게 버티게 만들었는지”까지 말하는 구조다.

## 표현 원칙

피해야 할 표현:

- `프롬프트 폼 작성 및 제출`
- `Explore 페이지 제작`
- `결제 페이지 구현`
- `관리자 페이지 제작`
- `고객사 관리`

이 표현들은 틀리지는 않지만 너무 얕다. 방문자 입장에서는 어떤 어려운 문제를 풀었는지 알기 어렵다.

권장 표현:

- `복구 가능한 콘텐츠 등록 흐름`
- `반응형 마켓플레이스 탐색 피드`
- `결제부터 정산까지 이어지는 돈의 흐름`
- `운영자가 검증할 수 있는 정산·원장 시스템`
- `고객 업무를 API·데이터·운영 정책으로 번역한 구현 사례`

쉽게 말하면, 화면 이름만 말하지 말고 “그 화면이 해결한 문제”를 제목으로 삼는다.

## 분리된 세부 문서

중앙 문서가 너무 길어지는 것을 막기 위해 세부 목록은 아래 문서로 분리한다.

- `docs/portfolio-positioning-brief.ko.md`: 전체 포지셔닝과 세 가지 증거 축
- `docs/portfolio-implementation-catalog.ko.md`: 14개 구현 항목의 중복 제거 버전
- `docs/portfolio-operations-coverage.ko.md`: Admin/Worker와 customer-facing operations 연결 정리

웹사이트 구현 시에는 이 중앙 문서를 먼저 보고, 상세 문구가 필요할 때 세부 문서를 참고한다.
