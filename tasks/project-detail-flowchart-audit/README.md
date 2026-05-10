# Project Detail Flowchart Audit Plan

## 목표

개인 프로젝트 상세 섹션의 6개 카드를 다시 점검한다. 각 카드는 사용자가 화면에서 보는 하나의 구현 사례이고, 모달 안에서는 텍스트 설명과 Excalidraw 흐름도로 그 구현을 설명한다.

쉽게 말하면, 카드 하나가 작은 이야기 한 편이어야 한다. 시작점, 중간 판단, 실패했을 때 돌아가는 길, 끝 상태가 모두 보여야 한다.

## 현재 확인한 구조

| 영역 | 파일 | 역할 | 쉬운 설명 |
|---|---|---|---|
| 카드/모달 텍스트 | `src/i18n.ts` | 한국어/영어 `projectDetails` 데이터 | 화면에 보이는 제목, 요약, 구현 단계 문구가 들어 있는 문구 창고 |
| 모달 렌더링 | `src/main.tsx` | 카드 클릭, 모달, 상세 구현 흐름 렌더링 | 사용자가 `자세히 보기`를 눌렀을 때 큰 창을 여는 화면 코드 |
| 차트 이미지 선택 | `src/components/ProjectExcalidrawDiagram.tsx` | `diagramVariant`에 맞는 PNG 표시 | 모달 안에 어떤 그림을 보여줄지 고르는 연결부 |
| 차트 생성 원본 | `scripts/generate-project-diagrams.mjs` | Excalidraw scene, PNG, editable 파일 생성 | 실제 화살표와 노드 배치를 만드는 설계 도면 |
| 차트 결과물 | `src/assets/project-diagrams/*` | 한국어/영어 PNG와 `.excalidraw` 파일 | 사용자가 실제로 보는 그림 파일 |
| 원본 근거 문서 | `docs/source/redprint-implementation-source-trace.md` | Redprint 구현 근거 파일 목록 | "이 구현을 실제로 만들었다"를 확인하는 주소록 |

중요한 점: `src/i18n.ts`의 `mermaidDefinition`, `steps`, `recoverySteps`는 모달 컴포넌트에 전달되지만, 현재 그림은 `scripts/generate-project-diagrams.mjs`가 만든 정적 PNG를 보여준다. 따라서 텍스트 단계와 Excalidraw 스크립트가 서로 다른 이야기를 할 수 있다. 이번 작업에서는 둘을 같은 기준으로 맞춰야 한다.

## 현재 6개 카드

| 번호 | 카드 | 현재 역할 | 점검 초점 |
|---|---|---|---|
| 01 | 제출·승인 자동화 플로우 | creator 제출, admin review, Slack agent 승인 | 제출 실패, 수동 검토, 승인/반려/수정 요청의 끝 상태가 분명한지 |
| 02 | 미디어 업로드·백그라운드 처리 파이프라인 | 파일 선택, R2 업로드, 검증, worker 후처리, 공개 준비 | 업로드 실패와 worker 실패가 서로 다른 복구 길을 갖는지 |
| 03 | 반응형 마켓플레이스 탐색 피드 | 상품 카드 렌더링, pagination, preview prefetch | 데이터 fetch, row packing, preview loading 순서가 맞는지 |
| 04 | Sentry → Slack → Agent 장애 대응 자동화 | production error 라우팅과 agent의 GitHub handoff | out-of-scope, duplicate, retry, human fallback이 섞이지 않는지 |
| 05 | Redis 기반 트래픽 보호·진단 레이어 | route bucket, actor scope, rate limit, diagnostics | 진단 흐름이 차단 흐름의 일부인지, sidecar인지 명확한지 |
| 06 | Worker 운영·복구 컨트롤 플레인 | local worker, 모듈별 작업, Railway failover | local healthy/down 판단과 ownership 전환이 끝까지 이어지는지 |

## 카드 구성 판단 기준

6개 카드가 전체 제품 흐름을 대표하려면 현재 구성에는 commerce 흐름이 비어 있다. 예를 들어 구매자가 상품을 보고 결제한 뒤 판매자에게 정산되는 `Payment-to-Payout Money Flow`가 빠져 있다. 반대로 현재 구성은 media, discovery, ops, reliability 쪽이 강하다.

결정 기준은 둘 중 하나다.

| 방향 | 유지/변경 판단 | 쉬운 설명 |
|---|---|---|
| 제품 end-to-end showcase | 결제·정산 카드를 추가하거나 Redis/Incident 중 하나를 보조 사례로 내린다 | 가게의 등록, 진열, 구매, 정산까지 한 바퀴를 보여주는 방식 |
| 기술 운영 showcase | 현재 6개를 유지하되 섹션 설명을 "핵심 구현 시스템 6개"로 명확히 바꾼다 | 가게 전체보다, 가게 뒤편 엔진과 안전장치를 보여주는 방식 |

추천은 먼저 Phase 1에서 이 선택을 확정하는 것이다. 카드가 어떤 시험을 통과해야 하는지 정해져야 텍스트와 차트도 흔들리지 않는다.

## Phase 문서

- [Phase 1: Card Coverage Audit](./phase-1-card-coverage-audit.md)
- [Phase 2: Copy Update Plan](./phase-2-copy-update-plan.md)
- [Phase 3: Flowchart Logic Plan](./phase-3-flowchart-logic-plan.md)

## 완료 기준

- 6개 카드 각각에 시작점, 정상 처리, 판단 지점, 실패/예외 처리, 끝 상태가 있다.
- 한국어와 영어 카드 문구가 같은 의미를 말한다.
- `src/i18n.ts`의 상세 단계와 `scripts/generate-project-diagrams.mjs`의 Excalidraw 흐름이 같은 순서로 말한다.
- PNG, editable `.excalidraw`, 화면 모달이 같은 최신 흐름을 보여준다.
- `npm run build`가 통과한다.
- 각 모달을 브라우저에서 열어 그림, 텍스트, 버튼, 긴 문구가 겹치지 않는지 확인한다.
