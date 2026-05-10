# Phase 1: Card Coverage Audit

## 목적

6개 카드가 포트폴리오에서 어떤 역할을 맡을지 먼저 정한다. 개발자 용어로는 information architecture audit이고, 쉽게 말하면 여섯 장의 카드가 서로 다른 이야기를 하면서도 전체 큰 그림을 만들고 있는지 확인하는 일이다.

## 1차 판단

현재 6개 카드는 모두 실제 구현을 말하지만, 같은 수준의 제품 흐름은 아니다.

| 카드 | 현재 성격 | 충분한 점 | 보강할 점 |
|---|---|---|---|
| 제출·승인 자동화 | product workflow | creator 제출 이후 운영 승인까지 이어진다 | 수동 검토의 approve/reject/needs changes 끝 상태가 더 필요하다 |
| 미디어 파이프라인 | product infrastructure | 업로드부터 공개 readiness까지 한 줄로 설명한다 | invalid upload와 worker retry가 같은 복구선으로 뭉쳐 보인다 |
| 탐색 피드 | user-facing product UX | 구매자가 상품을 탐색하는 화면 성능을 설명한다 | API fetch와 infinite scroll의 시작점이 차트에 부족하다 |
| 장애 대응 자동화 | operations automation | 장애 알림을 작업 단위로 바꾸는 강점이 있다 | 제품 주요 흐름이라기보다 운영 보조 흐름이다 |
| Redis 트래픽 보호 | backend guardrail | 비용과 보호를 함께 설계한 점이 드러난다 | 방문자가 보는 제품 흐름과 거리가 있다 |
| Worker 컨트롤 플레인 | operations platform | background work와 failover 역량이 크다 | 미디어 파이프라인과 worker 처리 설명이 일부 겹친다 |

## 선택지 A: Product End-to-End Showcase

목표가 "Redprint라는 마켓플레이스가 처음부터 끝까지 어떻게 굴러가는가"라면 카드 구성을 아래처럼 재정렬한다.

| 순서 | 카드 | 역할 |
|---|---|---|
| 01 | Recoverable Publishing / Approval | 판매자가 상품을 제출하고 승인까지 가는 시작 흐름 |
| 02 | Media Upload Pipeline | 이미지/영상이 안전하게 준비되는 흐름 |
| 03 | Marketplace Discovery Feed | 구매자가 상품을 찾고 미리보는 흐름 |
| 04 | Payment-to-Payout Money Flow | 구매, 결제 확정, ledger, 판매자 정산 흐름 |
| 05 | Purchase-Bound Support or Access Control | 구매 후 지원/권한/분쟁 처리 흐름 |
| 06 | Worker Operations and Recovery | 화면 밖 작업과 복구 흐름 |

이 선택을 하면 `Redis Traffic`과 `Incident Automation`은 메인 6개 카드에서 제외하거나, 운영 안정성 보조 섹션으로 옮기는 것이 자연스럽다. 쉬운 말로, 손님이 상품을 올리고 사고 정산받는 큰 길에는 돈 흐름이 꼭 있어야 한다.

## 선택지 B: Technical Operations Showcase

목표가 "혼자 만든 프로젝트 안에 들어간 어려운 기술 구현 6개"라면 현재 카드를 유지한다. 대신 섹션 제목과 각 카드 설명을 `제품 전체 흐름`이 아니라 `핵심 구현 시스템`으로 잡아야 한다.

추천 문구 방향:

- 한국어 섹션 타이틀: `개인적으로 진행한 사이드 프로젝트의 핵심 구현 시스템입니다.`
- 영어 섹션 타이틀: `A closer look at the core systems behind my side project.`

이 선택을 하면 각 카드는 서로 연결된 한 제품 여정이 아니라, 제품을 지탱하는 여섯 개 엔진으로 설명한다. 쉽게 말해 한 편의 긴 영화라기보다, 자동차 엔진룸의 중요한 부품 여섯 개를 보여주는 방식이다.

## 추천 결정

현재 화면에는 이미 incident, Redis, worker 같은 운영 구현이 많이 들어가 있다. 따라서 단기 개선은 선택지 B가 적합하다. 큰 카드 교체 없이 논리 오류를 바로잡을 수 있고, 기존 Excalidraw 자산도 계속 활용할 수 있다.

다만 채용/포트폴리오 메시지가 commerce program, marketplace builder, product operations 쪽으로 가야 한다면 선택지 A로 바꾸는 편이 더 강하다. 이 경우 Phase 3 전에 결제·정산 카드 추가 여부를 먼저 결정해야 한다.

## Phase 1 작업 목록

- 6개 카드를 `product workflow`, `infrastructure pipeline`, `operations automation`, `guardrail`, `control plane`으로 태깅한다.
- 유지할 카드와 보조 섹션으로 내릴 카드 후보를 결정한다.
- 카드 6개를 유지한다면 각 카드가 끝까지 다루는 최소 흐름을 한 문장으로 정의한다.
- 결제·정산 카드를 추가한다면 `docs/portfolio-implementation-catalog.ko.md`의 4번 항목을 기준으로 새 카드 범위를 정한다.
- 오래된 문서인 `docs/current-page-implementation-brief.ko.md`를 최신 6카드 구조에 맞춰 갱신할지 결정한다.

## 산출물

- 최종 카드 6개 목록
- 각 카드의 한 문장 역할 정의
- 제외하거나 보조 섹션으로 내릴 후보 목록
- 다음 phase에서 문구를 고칠 기준 문장
