# 현재 포트폴리오 페이지 구현 정리

이 문서는 현재 포트폴리오 페이지가 어떤 기능과 콘텐츠 구조로 구현되어 있는지 정리한다. Claude 디자인에게 전달하기 위한 자료이므로 색상, 타이포그래피, 여백, 카드 모양, 애니메이션 톤 같은 시각 디자인 판단은 제외했다.

이 문서는 “지금 화면에 어떤 방들이 있고, 각 방에서 사용자가 무엇을 할 수 있는지”를 설명하는 지도다. 디자이너는 이 지도를 보고 화면을 다시 설계하면 된다.

## 구현 범위

- 현재 페이지는 단일 페이지 React 앱이다.
- 사용자는 한 페이지 안에서 자기소개, 강점, 고객 사례, 제품 구현 사례, 운영 구조, 연락 메시지를 순서대로 본다.
- 한국어와 영어를 전환할 수 있다.
- 일부 구현 사례는 카드 클릭으로 상세 flowchart modal을 열 수 있다.
- URL hash를 이용해 특정 섹션으로 바로 이동할 수 있다.

여러 페이지를 왔다 갔다 하는 웹사이트가 아니라 긴 소개 페이지 하나 안에 여러 구역이 나뉘어 있는 구조다.

## 기술 스택

| 항목 | 현재 구현 | 쉬운 설명 |
|---|---|---|
| App framework | Vite + React | 빠르게 실행되는 React 웹앱 구조다. |
| Language | TypeScript | 데이터 모양과 컴포넌트 props를 코드에서 미리 약속해 둔다. |
| i18n | i18next, react-i18next | 한국어/영어 전환 상태를 관리한다. |
| Styling | `src/styles.css` | 화면 모양은 별도 CSS 파일에서 처리한다. 이 문서에서는 디자인 내용은 다루지 않는다. |
| Build command | `npm run build` | TypeScript 검사 후 Vite production build를 만든다. |

## 주요 파일

| 파일 | 역할 | 쉬운 설명 |
|---|---|---|
| `src/main.tsx` | 현재 페이지의 거의 모든 화면, 데이터, 상호작용을 담고 있다. | 화면에 보이는 블록과 클릭 동작이 들어 있는 중심 파일이다. |
| `src/i18n.ts` | 언어 초기값과 언어 저장을 설정한다. | 사용자가 KR/EN 중 무엇을 골랐는지 기억하는 준비 파일이다. |
| `src/styles.css` | 레이아웃과 시각 스타일을 담당한다. | 화면을 어떻게 보이게 할지 정하는 파일이다. |
| `index.html` | React 앱이 붙는 HTML 진입점이다. | 빈 무대에 React 화면을 올리는 시작점이다. |

주의할 점: `src/i18n.ts` 안에는 예전 Gen-AI 랜딩 페이지용 번역 리소스가 남아 있지만, 현재 포트폴리오 페이지 본문은 `src/main.tsx`의 `content` 객체를 직접 사용한다. 언어 스위치는 i18n이 맡고 실제 문구 보관함은 `main.tsx` 안에 있다.

## 데이터 모델

현재 페이지는 화면 문구와 섹션 데이터를 `content` 객체에 넣고, 언어별로 `ko`, `en` 데이터를 나눠 둔다.

| TypeScript 타입 | 화면에서 보이는 단위 | 역할 |
|---|---|---|
| `Pillar` | 강점 카드 | 기술 커뮤니케이션, 고객성공, 풀스택 빌딩 같은 핵심 역량 한 덩어리다. |
| `CaseStudy` | 고객 사례 카드 | Samsung, OneLink, S2S Event Guide 같은 외부 경험을 요약한다. |
| `BuildItem` | 제품 구현 카드 | Redprint 안에서 실제로 만든 기능 묶음을 보여준다. |
| `ProductFlow` | 상세 flowchart modal 내용 | 카드 클릭 후 열리는 상세 구현 흐름이다. |
| `FlowStep` | flowchart의 단계 | 등록, 검증, 업로드, 제출, 복구 같은 한 단계다. |
| `FlowNote` | 상세 설명 note | 왜 그렇게 구현했는지 판단 근거를 설명한다. |
| `OperationItem` | 운영 구조 row | 고객 업무, admin hub, worker plane을 나눠 설명한다. |
| `PageContent` | 한 언어의 전체 페이지 문구 | 한국어 또는 영어 화면 전체를 구성하는 데이터 묶음이다. |

현재 페이지는 하드코딩된 CMS처럼 동작한다. 별도 서버에서 데이터를 가져오지 않고, 코드 안의 문구 목록을 화면에 뿌린다.

## 페이지 섹션 구조

| 섹션 id | 화면 모듈 | 현재 역할 |
|---|---|---|
| `intro` | Hero | 방문자가 첫 화면에서 “고객의 복잡한 일을 기술과 제품 플로우로 바꾸는 사람”이라는 포지셔닝을 읽는다. |
| `pillars` | Proof Pillars | 강점을 세 갈래로 정리한다. 한국어 기준으로 기술 커뮤니케이션, 고객성공, 풀스택 프로젝트 빌딩이다. |
| `cases` | Customer-facing Case Studies | 고객성공 경험이 단순 계정 관리가 아니라 기술 요구사항 정리와 실행 관리였다는 점을 보여준다. |
| `project` | Project Details | Redprint의 핵심 구현 시스템 6개를 카드와 상세 flowchart modal로 보여준다. |
| `operations` | Operations Layer | 고객 업무 번역, admin 운영 허브, worker 운영 plane을 설명한다. |
| `contact` | Closing Message | 페이지 마지막에서 어떤 사람으로 읽히고 싶은지 다시 묶는다. |

첫 화면에서는 “누구인가”를 말하고, 중간에서는 “무엇을 해봤는가”를 보여주며, 마지막에서는 “어떤 방향으로 일하고 싶은가”를 닫아 준다.

## 상단 바

상단 바에는 두 가지 기능이 있다.

- `RP` brand anchor: 클릭하면 `#intro` 섹션으로 이동한다.
- KR/EN language toggle: 클릭한 언어로 페이지 문구를 바꾼다.

개발자 용어로는 anchor navigation과 language state change다. 왼쪽 로고는 첫 화면으로 돌아가는 버튼이고, 오른쪽 버튼은 한국어/영어 스위치다.

## Hero 섹션

Hero는 현재 페이지의 첫 메시지를 담당한다.

- 한국어 제목: `고객의 복잡한 일을 기술과 제품 플로우로 바꾸는 한지우입니다.`
- 한국어 설명: API, 데이터, 운영 정책, 화면을 하나의 플로우로 묶는 사람이라는 설명이다.
- 태그: `Technical Operator`, `Customer Success`, `Product Builder`

개발자 용어로는 positioning block이다. 방문자가 들어오자마자 “이 사람이 어떤 일을 잘하는지” 한눈에 알게 하는 간판이다.

## Proof Pillars 섹션

현재 세 개의 강점 카드가 있다.

| 번호 | 화면 제목 | 전달 내용 |
|---|---|---|
| 01 | 기술 커뮤니케이션 | API, SDK, 플랫폼 연동에서 기술 요구사항을 파악하고 내부/외부 커뮤니케이션을 맞춘 경험 |
| 02 | 고객성공 | 고객 문제를 파악하고, 기술 이슈를 쉬운 언어로 설명하며, 필요하면 커스텀 솔루션을 만드는 경험 |
| 03 | 풀스택 프로젝트 빌딩 | 프론트엔드, 백엔드, 데이터베이스, 배포, 스토리지, 결제, worker failover까지 구축한 경험 |

개발자 용어로는 capability cards다. 긴 이력서를 세 개의 큰 능력 상자로 나눠 보여주는 영역이다.

## Customer-facing Case Studies 섹션

현재 세 개의 고객/업무 사례가 있다.

| 사례 | 화면에 보이는 meta | 핵심 내용 |
|---|---|---|
| Samsung 글로벌 운영 | `30+ offices` | HQ, 지역 CSM, product, engineering 사이에서 요구사항과 release impact를 맞춘 경험 |
| OneLink Management Console | `API workflow` | 비개발자 마케팅 운영자가 링크 create/update/get/delete 작업을 안전하게 처리하도록 만든 콘솔 |
| S2S Event Guide | `data mapping` | 공식 문서와 고객 데이터 사이의 빈칸을 mapping, 전송 조건, 실패 처리 기준으로 채운 가이드 |

각 사례는 제목, meta, 설명, 핵심 포인트 목록으로 구성된다. “고객과 일했다”가 아니라 “고객의 복잡한 일을 기술 과제로 바꿨다”는 증거를 보여준다.

## Project Details 섹션

이 섹션은 Redprint 구현 경험을 다룬다. 현재 화면 제목은 `개인 프로젝트 상세`이고, 사용자는 6개의 구현 시스템 카드를 볼 수 있다.

개발자 용어로는 project implementation showcase다. 쉽게 말해, 사용자가 보는 제품 화면 뒤에서 실제로 어떤 엔진들이 돌아가는지 보여주는 전시장이다.

현재 구현 카드 여섯 개는 다음과 같다.

| 번호 | 화면 제목 | 개발자 용어 | 사용자/운영자 관점 |
|---|---|---|---|
| 01 | 제출·승인 자동화 플로우 | submission workflow, admin approval queue, Slack agent automation | creator가 제출한 item이 검증, 승인 판단, publish 또는 수정 요청까지 이어진다. |
| 02 | 미디어 업로드·백그라운드 처리 파이프라인 | R2 presigned upload, verification, worker queue, readiness gate | 큰 파일을 직접 업로드하고, 검증된 미디어만 후처리해 공개 위험을 줄인다. |
| 03 | 반응형 마켓플레이스 탐색 피드 | row packing, presentation descriptor, offset pagination, batched prefetch | 구매자가 미디어가 많은 상품 목록을 빠르게 훑고 preview modal을 열 수 있다. |
| 04 | Sentry → Slack → Agent 장애 대응 자동화 | Sentry webhook, Redis dedup, Slack agent, GitHub automation | production error가 단순 알림이 아니라 issue, branch, draft PR 작업 단위로 바뀐다. |
| 05 | Redis 기반 트래픽 보호·진단 레이어 | route policy, actor scope, rate limiting, diagnostic session | 요청 보호와 운영자 진단을 분리해 비용과 안정성을 함께 관리한다. |
| 06 | Worker 운영·복구 컨트롤 플레인 | heartbeat, active owner, worker modules, Railway failover | local worker가 멈추면 Railway backup이 ownership을 넘겨받아 작업을 이어간다. |

이 영역은 “실제로 만든 제품 안에 어떤 엔진들이 들어 있는지” 보여주는 전시장이다.

## 상세 Flowchart Modal

현재 상세 modal은 6개 카드 모두에 연결되어 있다. 사용자가 각 카드의 `자세히 보기`를 누르면 해당 구현 시스템의 flowchart modal이 열린다.

개발자 용어로는 selected item state 기반 conditional modal rendering이다. 선택한 카드가 있을 때만 큰 상세 창을 띄운다.

### Modal 열기와 닫기

- 카드 안의 버튼을 클릭하면 `selectedProject`가 해당 `ProjectDetail` 데이터로 바뀐다.
- `selectedProject`에 modal 데이터가 있으면 modal이 렌더링된다.
- 배경을 클릭하면 modal이 닫힌다.
- `Escape` 키를 눌러도 modal이 닫힌다.
- modal이 열려 있는 동안 `body`에 `modal-open` 클래스가 붙는다.

카드가 리모컨이고 modal은 자세히 보기 창이다. 바깥을 누르거나 Esc를 누르면 창이 닫힌다.

### Modal 내용

상세 modal은 세 덩어리로 구성된다.

| 영역 | 현재 내용 | 역할 |
|---|---|---|
| Header | case eyebrow, 제목, 요약 | 어떤 구현 흐름을 설명하는지 먼저 알려준다. |
| Main stages | 카드별 정상 flow | 각 구현 시스템이 시작점에서 성공 상태까지 어떻게 가는지 보여준다. |
| Recovery path | 카드별 복구·보호 flow | 실패, 중복, 차단, fallback, retry 같은 예외 상황을 설명한다. |
| Implementation notes | 3개 note | 왜 그렇게 구현했는지 판단 근거를 설명한다. |

### Main stages

카드별 normal flow는 서로 다르지만, 모두 같은 기준을 따른다.

| 기준 | 쉬운 설명 |
|---|---|
| 시작점 | 사용자가 제출하거나, 파일을 올리거나, 요청/이벤트가 들어오는 첫 순간 |
| 처리 흐름 | validation, queue, row packing, routing, limiter, worker module처럼 실제 작업이 진행되는 단계 |
| 판단 지점 | 승인 가능 여부, media type, incident scope, limiter decision, active owner 같은 분기점 |
| 끝 상태 | publish, public media, preview modal, NEEDS_REVIEW, allowed/blocked response, worker ops visibility 같은 완료 상태 |

### Recovery path

| 항목 | 쉬운 설명 |
|---|---|
| Creator revision / manual review | 제출 조건이 부족하거나 자동 승인 근거가 부족할 때 사람이 판단하거나 creator가 수정한다. |
| Upload retry / worker backfill | 파일 업로드 실패와 후처리 실패를 서로 다른 복구 경로로 다룬다. |
| Prefetch allowance / on-demand fetch | 미리보기 요청이 과해지면 필요한 순간에만 가져온다. |
| Ignore / suppress / retry | 장애 알림에서 제외 대상, 중복, Slack 전송 실패를 각각 다르게 처리한다. |
| Diagnostics with TTL | Redis 진단은 운영자가 켰을 때만 짧게 기록한다. |
| Failover / failback | local worker가 멈추면 Railway가 이어받고, 회복 후 다시 local로 돌린다. |

## Operations 섹션

현재 세 개의 운영 row가 있다.

| 화면 제목 | 역할 |
|---|---|
| Customer-facing Operations | 고객의 업무 플로우를 API/data mapping, 실행 조건, 실패 처리 기준으로 바꾸는 경험 |
| Admin Operations Hub | 심사, 정산, 지원, 스토리지, worker 상태를 운영자가 확인하고 조치하는 구조 |
| Worker Operations Plane | 미디어 처리, 결제 복구, 정산 예약, cleanup을 화면 밖에서 이어가는 백그라운드 구조 |

개발자 용어로는 operations abstraction이다. 사용자가 보는 앞 화면뿐 아니라 운영자가 뒤에서 문제를 확인하고 복구하는 구조까지 보여주는 영역이다.

## Contact 섹션

마지막 섹션은 CTA라기보다 closing statement에 가깝다.

- 한국어 제목: `고객 문제를 끝까지 굴러가는 시스템으로 만들고 싶습니다.`
- 한국어 설명: 기술 구조, 고객 맥락, 운영 복구까지 함께 보는 사람으로 읽히는 포트폴리오를 만들고 있다는 내용이다.

“저에게 연락하세요”보다 “이런 방향의 일을 하고 싶은 사람입니다”에 가까운 마무리다.

## 인터랙션과 상태 관리

| 기능 | 구현 방식 | 쉬운 설명 |
|---|---|---|
| 언어 전환 | `i18n.changeLanguage(language)` 호출 | KR/EN 버튼을 누르면 화면 문구가 바뀐다. |
| 언어 저장 | `localStorage.setItem('portfolio-language', language)` | 다음에 들어와도 마지막으로 고른 언어를 기억한다. |
| HTML 언어 반영 | `document.documentElement.lang = language` | 브라우저와 보조 기술에 현재 언어를 알려준다. |
| 섹션 직접 이동 | `window.location.hash` 확인 후 `scrollIntoView` | `#build` 같은 주소로 들어오면 해당 구역으로 이동한다. |
| 스크롤 reveal | `IntersectionObserver` 사용 | 사용자가 해당 구역 근처에 오면 블록이 화면에 나타난 상태로 바뀐다. |
| modal 선택 상태 | `selectedBuildId` state | 어떤 구현 카드의 상세 창을 열지 기억한다. |
| modal 닫기 | backdrop click, Escape key | 바깥 클릭이나 Esc 키로 자세히 보기 창을 닫는다. |

## 접근성 관련 구현

- 언어 전환 영역에 `aria-label`이 있다.
- KR/EN 버튼에 `aria-pressed`가 있어 현재 선택 상태를 전달한다.
- flowchart 영역에 `aria-label`이 있다.
- modal은 `role="dialog"`, `aria-modal="true"`, `aria-labelledby`를 사용한다.
- 닫기 버튼에는 `aria-label="Close flowchart"`가 있다.

화면을 눈으로 보는 사람뿐 아니라 키보드나 보조 도구로 쓰는 사람도 현재 상태를 이해할 수 있게 해 둔 부분이다.

## 현재 구현의 제약

- 라우팅은 없다. 모든 내용은 한 페이지 안에 있다.
- 서버 API 호출은 없다. 모든 페이지 데이터는 프론트엔드 코드에 포함되어 있다.
- 6개 구현 카드 모두 상세 flowchart modal을 가진다.
- `src/i18n.ts`의 번역 리소스와 실제 포트폴리오 본문 데이터가 분리되어 있어, 문구 수정 시 `src/main.tsx`의 `content` 객체를 확인해야 한다.
- 폼 제출, 연락처 전송, 외부 링크 이동 기능은 현재 구현되어 있지 않다.

지금 페이지는 “읽고 탐색하는 포트폴리오”에 가깝고, 사용자가 정보를 입력하거나 서버와 통신하는 기능은 아직 없다.

## 디자인 작업자가 유지해야 할 기능 계약

아래 항목은 화면을 새로 디자인해도 유지되어야 하는 구현 동작이다.

- KR/EN 언어 전환이 계속 가능해야 한다.
- `intro`, `pillars`, `cases`, `project`, `contact` 섹션 이동 기준이 유지되어야 한다.
- Project Details에는 Redprint 핵심 구현 시스템 6개가 보여야 한다.
- 6개 구현 카드는 각각 상세 flowchart modal로 열릴 수 있어야 한다.
- modal은 클릭과 Escape 키로 닫혀야 한다.
- 각 섹션은 현재 콘텐츠의 의미를 잃지 않아야 한다.

디자인은 얼마든지 새로 만들 수 있지만 사용자가 할 수 있는 일과 화면이 전달해야 하는 정보의 순서는 깨지면 안 된다.

## 이 문서에서 일부러 제외한 것

- 색상, 폰트, 여백, 카드 모양, 그림자, 배경, 반응형 breakpoints
- 어떤 섹션을 더 예쁘게 보이게 할지에 대한 제안
- 애니메이션 속도나 시각 효과의 방향
- 새 디자인 컨셉, 무드보드, 레퍼런스

이 문서는 “무엇을 보여줘야 하는가”만 말한다. “어떻게 예쁘게 보여줄 것인가”는 디자인 작업에서 정하면 된다.
