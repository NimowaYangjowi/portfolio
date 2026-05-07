# 포트폴리오 웹사이트 콘텐츠 기획

이 문서는 Redprint 포트폴리오 웹사이트에 어떤 내용을 넣을지 결정하는 중앙 문서다. 원본 메모는 `docs/source/`에 보관하고, 실제 웹사이트 문구와 정보 구조는 이 문서를 기준으로 정한다.

쉽게 말하면, `docs/source/`는 재료 창고이고 이 문서는 요리 순서표다. 모든 재료를 화면에 다 올리는 것이 아니라, 방문자가 가장 빨리 이해할 수 있는 순서로 골라 배치한다.

## 원본 문서 위치

| 원본 문서 | 현재 위치 | 용도 |
|---|---|---|
| Redprint 구현 항목 정리 | `docs/source/redprint-implementation-showcase-ideas.ko.md` | 14개 구현 항목의 원본 설명 |
| Redprint implementation ideas | `docs/source/redprint-implementation-showcase-ideas.en.md` | 영어 표현 참고 |
| 구현 항목 안내 문서 | `docs/source/redprint-implementation-showcase-ideas.md` | 원본 문서 묶음 안내 |
| Source Trace | `docs/source/redprint-implementation-source-trace.md` | 포트폴리오 문장과 실제 코드 위치 연결 |
| Admin/Worker 커버리지 | `docs/source/redprint-admin-worker-coverage.ko.md` | 운영자/worker 기능 범위 |
| Admin/Worker coverage EN | `docs/source/redprint-admin-worker-coverage.en.md` | 영어 표현 참고 |

## 포지셔닝

Redprint는 단순히 “여러 페이지를 만든 프로젝트”로 보여주면 약하다. 포트폴리오에서는 **복잡한 마켓플레이스 서비스를 사용자가 만들고, 구매하고, 운영자가 검증하고, worker가 뒤에서 복구하는 시스템**으로 보여주는 편이 좋다.

개발자 용어로는 marketplace domain architecture, media processing pipeline, payment/ledger control layer, admin operations plane을 설계한 사례다. 쉽게 말하면, 예쁜 매장 화면만 만든 것이 아니라 매장, 계산대, 창고, 고객센터, 운영실까지 돌아가게 만든 프로젝트다.

## 방문자가 먼저 이해해야 하는 한 문장

> Redprint는 AI 프롬프트 상품을 등록, 탐색, 구매, 정산, 운영할 수 있도록 만든 마켓플레이스 시스템이며, 긴 제출 흐름과 대용량 미디어, 결제/정산, worker 복구까지 실제 운영에 필요한 구조를 설계한 프로젝트다.

이 문장은 hero 섹션이나 프로젝트 소개 첫 문단의 기준 문장으로 쓴다.

## 사이트 정보 구조

1. **Hero**
   - 역할: 내가 어떤 문제를 해결하는 개발자인지 먼저 보여준다.
   - 화면 내용: 짧은 자기소개, Redprint 한 줄 소개, 언어 토글.
   - 쉬운 설명: 방문자가 첫 화면에서 “이 사람이 어떤 종류의 문제를 풀었는지” 바로 알게 하는 간판이다.

2. **Interactive Showcase Accordion**
   - 역할: 대표 구현 항목 5~6개를 시각적으로 빠르게 훑게 한다.
   - 화면 내용: 이미지 아코디언, 선택된 항목의 제목/짧은 설명.
   - 쉬운 설명: 여러 구현 사례를 책갈피처럼 접어 두고, 하나를 펼치면 핵심이 보이게 하는 영역이다.

3. **System Map**
   - 역할: 개별 기능이 서로 어떻게 연결되는지 보여준다.
   - 화면 내용: Upload -> Media Processing -> Explore -> Checkout -> Finance/Admin 흐름.
   - 쉬운 설명: “각 방이 따로 있는 집”이 아니라 통로로 연결된 건물이라는 것을 보여주는 지도다.

4. **Case Studies**
   - 역할: 가장 강한 구현 항목을 깊게 설명한다.
   - 화면 내용: 문제, 사용자 화면, 기술 구현, 실패 방지 장치, 코드 근거.
   - 쉬운 설명: 그냥 기능 이름을 쓰는 것이 아니라 “왜 어려웠고 어떻게 안정적으로 만들었는지”를 보여주는 장이다.

5. **Operations Coverage**
   - 역할: admin과 worker 범위가 넓다는 점을 정리한다.
   - 화면 내용: Admin Operations Hub, Worker Operations Plane 요약.
   - 쉬운 설명: 서비스 뒤에서 운영자가 보는 조종석과, 사용자가 기다리는 동안 뒤에서 일하는 작업반을 보여준다.

6. **Source Trace**
   - 역할: 포트폴리오 주장을 실제 코드 위치와 연결한다.
   - 화면 내용: 대표 구현 항목별 핵심 파일 경로.
   - 쉬운 설명: “말만 한 것”이 아니라 실제로 어느 코드가 근거인지 붙이는 주소록이다.

## 첫 화면에 넣을 대표 항목

처음에는 아래 6개만 메인 쇼케이스로 쓰는 것이 좋다. 14개를 전부 첫 화면에 넣으면 많아 보이지만 핵심이 흐려진다.

| 우선순위 | 화면 제목 | 사용자에게 보이는 화면 | 개발자가 볼 구현 포인트 |
|---|---|---|---|
| 1 | 복구 가능한 콘텐츠 등록 흐름 | 프롬프트 등록/수정 위자드 | multi-step workflow, draft persistence, media readiness gate |
| 2 | 대용량 미디어 직접 업로드 파이프라인 | 이미지/영상 업로드 카드 | R2 presigned upload, upload verification, queue orchestration |
| 3 | 반응형 마켓플레이스 탐색 피드 | Explore 카드 벽 | adaptive layout, row packing, batched prefetch |
| 4 | 결제부터 정산까지 이어지는 돈의 흐름 | 장바구니, 결제 완료, 판매자 정산 | Stripe webhook, ledger posting, idempotency guard |
| 5 | 운영자가 검증할 수 있는 정산·원장 시스템 | Admin Finance 탭 | monthly close, ledger drilldown, reconciliation |
| 6 | 백그라운드 미디어 처리 작업 시스템 | job dashboard, transcode monitor | queue, lease, retry, heartbeat, failover |

## Case Study 작성 템플릿

각 상세 페이지나 섹션은 아래 순서를 따른다.

1. **문제**
   - 사용자가 어떤 일을 하려는지 먼저 쓴다.
   - 예: 판매자는 이미지와 긴 프롬프트를 등록해야 하지만, 업로드 지연이나 네트워크 실패가 생길 수 있다.

2. **사용자 화면**
   - 실제 UI에서는 무엇으로 보이는지 쓴다.
   - 예: `Basic Info`, `Assets`, `Prompt Content`, `Output Examples` 단계가 있는 등록 위자드.

3. **기술 구현**
   - developer term을 쓴다.
   - 예: multi-step workflow, draft persistence, upload session, media readiness gate.

4. **안정성 장치**
   - 실패했을 때 무엇을 막았는지 쓴다.
   - 예: 중간 실패 후 draft 복구, 중복 webhook 방지, worker retry.

5. **코드 근거**
   - source trace의 파일 경로를 붙인다.
   - 예: `src/app/upload/prompt/components/PromptFormV2.tsx`.

쉽게 말하면, “무엇을 만들었다”에서 멈추지 않고 “사용자는 이렇게 보고, 내부에서는 이렇게 버티게 만들었다”까지 말하는 구조다.

## 표현 원칙

피해야 할 표현:

- `프롬프트 폼 작성 및 제출`
- `Explore 페이지 제작`
- `결제 페이지 구현`
- `관리자 페이지 제작`

이 표현들은 틀리지는 않지만 너무 얕다. 방문자 입장에서는 어떤 어려운 문제를 풀었는지 알기 어렵다.

권장 표현:

- `복구 가능한 콘텐츠 등록 흐름`
- `반응형 마켓플레이스 탐색 피드`
- `결제부터 정산까지 이어지는 돈의 흐름`
- `운영자가 검증할 수 있는 정산·원장 시스템`

쉽게 말하면, 화면 이름만 말하지 말고 “그 화면이 해결한 문제”를 제목으로 삼는다.

## 분리된 세부 문서

중앙 문서가 너무 길어지는 것을 막기 위해 세부 목록은 아래 문서로 분리한다.

- `docs/portfolio-implementation-catalog.ko.md`: 14개 구현 항목의 중복 제거 버전
- `docs/portfolio-operations-coverage.ko.md`: Admin/Worker 커버리지의 중복 제거 버전

웹사이트 구현 시에는 이 중앙 문서를 먼저 보고, 상세 문구가 필요할 때 세부 문서를 참고한다.
