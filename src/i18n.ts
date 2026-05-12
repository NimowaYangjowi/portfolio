import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export const supportedLanguages = ['ko', 'en'] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

function isSupportedLanguage(language: string): language is SupportedLanguage {
  return supportedLanguages.includes(language as SupportedLanguage);
}

export function getLanguageFromPathname(pathname: string) {
  const firstSegment = pathname.split('/').filter(Boolean)[0];

  return firstSegment && isSupportedLanguage(firstSegment) ? firstSegment : null;
}

function readSavedLanguage() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.localStorage.getItem('portfolio-language');
  } catch {
    return null;
  }
}

export function saveLanguagePreference(language: SupportedLanguage) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem('portfolio-language', language);
  } catch {
    // The selected language still changes for this session even when storage is unavailable.
  }
}

export function getLanguagePath(language: SupportedLanguage) {
  if (typeof window === 'undefined') {
    return `/${language}`;
  }

  const pathSegments = window.location.pathname.split('/').filter(Boolean);

  if (pathSegments.length > 0 && isSupportedLanguage(pathSegments[0])) {
    pathSegments[0] = language;
  } else {
    pathSegments.unshift(language);
  }

  return `/${pathSegments.join('/')}${window.location.search}${window.location.hash}`;
}

export function syncLanguagePath(language: SupportedLanguage, replace = false) {
  if (typeof window === 'undefined') {
    return;
  }

  const nextPath = getLanguagePath(language);
  const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;

  if (nextPath === currentPath) {
    return;
  }

  if (replace) {
    window.history.replaceState(null, '', nextPath);
  } else {
    window.history.pushState(null, '', nextPath);
  }
}

export function syncDocumentLanguage(language: SupportedLanguage) {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = language;
  }
}

const savedLanguage = readSavedLanguage();
const pathLanguage =
  typeof window === 'undefined' ? null : getLanguageFromPathname(window.location.pathname);
const initialLanguage: SupportedLanguage = supportedLanguages.includes(
  savedLanguage as SupportedLanguage,
)
  ? pathLanguage ?? (savedLanguage as SupportedLanguage)
  : pathLanguage ?? 'ko';

void i18n.use(initReactI18next).init({
  resources: {
    ko: {
      translation: {
        languageToggleLabel: '언어 전환',
        languageOptionKo: '한국어',
        languageOptionEn: 'English',
        skillCategoriesLabel: '스킬 카테고리',
        experienceBadge: 'Experience',
        contactEmailLabel: '이메일',
        content: {
          heroTitle: '안녕하세요.\n기술과 사람을 연결하는\n한지우입니다.',
          heroDescription:
            '한국과 동남아시아 시장에서 엔터프라이즈 고객의 \n온보딩, 교육, 기능 adoption, 비즈니스 리뷰를 담당해왔습니다.\n고객이 겪는 복잡한 문제를 쉽게 풀어내고, 제품과 기술팀이 실행할 수 있는 솔루션으로 연결합니다.',
          sections: {
            feature: {
              eyebrow: '핵심 역량',
              title: '맥락을 이해하고 제품·기술·비즈니스가 \n함께 움직일 수 있는 실행안을 제시합니다.',
            },
            skill: {
              eyebrow: '전문영역 및 스킬셋',
              title: '고객 문제를 해결하기 위해 \n실제 업무에서 활용해온 역량과 도구입니다.',
            },
            career: {
              eyebrow: '경력 사항',
              title: '고객성공을 중심으로 \n기술과 제품 실행 경험을 쌓아왔습니다.',
            },
            customerCase: {
              eyebrow: '고객성공 케이스',
              title: '고객사의 기술 과제를 이해하고 \n실행 가능한 해결 방안으로 연결한 사례입니다.',
            },
            project: {
              eyebrow: '개인 프로젝트 상세',
              title: '개인적으로 진행한 사이드 프로젝트의 핵심 구현 시스템입니다.',
            },
          },
          thanks: {
            title: '감사합니다',
            description: '더 궁금한 점이 있다면 편하게 연락주세요',
            photoAlt: 'AppsFlyer 행사에서 함께 찍은 팀 사진',
          },
          features: [
            {
              title: '기술 커뮤니케이션',
              description:
                'API 및 SDK의 개발, 여러 플랫폼 간의 연동 과정에서 필요한 여러 부서 간의 기술적인 요구사항을 파악하고 매끄러운 내부/외부 커뮤니케이션이 이루어질 수 있도록 조율합니다.',
              iconLabel: 'API',
            },
            {
              title: '고객성공',
              description:
                '고객의 문제를 파악하고 가장 적합한 솔루션을 찾아 제시합니다. 기술적인 문제를 쉬운 언어로 설명하는 것에 능숙하며 국내외 여러 엔터프라이즈 고객사들을 관리해왔습니다. 해결책을 제시하는 데서 그치지 않고 커스텀 솔루션을 직접 제작해 제공한 사례들이 있습니다.',
              iconLabel: 'CS',
            },
            {
              title: '풀스택 프로젝트 빌딩',
              description:
                '프론트엔드, 백엔드, 데이터베이스를 포함한 풀스택 프로젝트를 직접 빌드하고 운영했습니다. Vercel, Railway, Upstash Redis, Cloudflare R2, Stripe, Sentry를 조합해 배포, 스토리지, 결제, 분산락, 레이트 리밋, 에러 대응 자동화를 구성했고, 로컬 워커 장애 시 Railway 백업 워커가 작업을 이어받는 failover 구조까지 설계했습니다.',
              iconLabel: 'FS',
            },
          ],
          skillGroups: [
            {
              id: 'customer-success',
              title: '고객성공',
              skills: [
                'Enterprise Onboarding',
                'Customer Education',
                '도입 전략',
                'Beta Programs',
                'EBR',
                'Executive Communication',
                'Intercom',
                'Zendesk',
                'Escalation Management',
              ],
            },
            {
              id: 'technical-implementation',
              title: '기술 구현',
              skills: [
                'SDK Implementation',
                'API Integration',
                'Technical Discovery',
                'Requirements Gathering',
                'SQL',
                'Data Discrepancy Analysis',
                'Platform Configuration',
                'Troubleshooting',
              ],
            },
            {
              id: 'product-development',
              title: '제품 개발',
              skills: [
                'TypeScript',
                'React',
                'Next.js',
                'PostgreSQL',
                'Drizzle ORM',
                'Zod',
                '워크플로우 설계',
                'Admin Approval Tools',
                'Media Pipeline',
              ],
            },
            {
              id: 'environment-deployment',
              title: '환경 및 배포',
              skills: [
                'Vercel',
                'Railway',
                'Cloudflare R2',
                'Upstash Redis',
                'Sentry',
                'Stripe Webhooks',
                '워커',
                '레이트 리밋',
                'Failover Control',
              ],
            },
            {
              id: 'collaboration-operations',
              title: '협업 및 운영',
              skills: [
                'Product Feedback',
                'Engineering Handoff',
                '슬랙 에이전트 자동화',
                'Runbooks',
                'Technical Guides',
                'Documentation',
                'MCP',
                'gstack',
              ],
            },
          ],
          experiences: [
            {
              company: 'AppsFlyer',
              period: '2019.04 - 현재',
              summary:
                '한국에서 5년간 경력을 쌓고 현재는 방콕에서 동남아시아 엔터프라이즈 고객사를 대상으로 고객성공 업무를 하고 있습니다. 고객사의 온보딩, 교육, 새로운 기능 adoption 및 베타 프로그램을 진행하고, 정기적인 비즈니스 리뷰를 통해 알맞은 솔루션을 제공합니다.',
              roles: [
                {
                  period: '2024.08 - 현재',
                  title: 'Senior Customer Success Manager (enterprise) – SEA business',
                },
                {
                  period: '2022.11 - 2024.08',
                  title: 'Senior Customer Success Manager (enterprise)',
                },
                {
                  period: '2021.01 - 2022.11',
                  title: 'Customer Success Manager',
                },
                {
                  period: '2019.04 - 2020.12',
                  title: 'Customer Engagement Manager',
                },
              ],
              details: [
                '프리미엄 계정의 온보딩, 기술 디스커버리, 요구사항 정리, 구현 계획, 이슈 에스컬레이션, 임원 이해관계자 커뮤니케이션까지 엔터프라이즈 engagement를 end-to-end로 담당했습니다.',
                'SDK implementation, API integration, data discrepancy, platform configuration 영역에서 trusted technical advisor로서 고객팀의 아키텍처 의사결정을 도왔습니다.',
                'Product, Engineering 팀과 협업해 복잡한 고객 blocker를 해결하고, 현장 피드백을 제품 개선으로 연결하며 실제 구현 니즈가 roadmap 결정에 반영되도록 조율했습니다.',
                '맞춤형 기술 솔루션, Executive Business Review, adoption strategy를 통해 pre-sales와 expansion 논의를 지원했고, $3M+ ARR 포트폴리오에서 98% client retention 유지에 기여했습니다.',
                '내부 팀과 고객이 함께 쓰는 technical guide, troubleshooting playbook, best-practice 자료를 만들어 CS 조직 전반의 구현 일관성을 높였습니다.',
              ],
            },
            {
              company: 'Gameberry',
              period: '2017.09 - 2019.03',
              summary:
                'Business Development로 광고 플랫폼 연동, 파트너 온보딩, 게임 제품 운영을 경험하며 수익과 연결되는 플랫폼 구조를 다뤘습니다.',
              roles: [
                {
                  period: '2017.09 - 2019.03',
                  title: 'Business Development',
                  details: [
                    'DSP/SSP/Ad Exchange 연동을 위한 플랫폼 도입을 관리하고, 기술 온보딩 이슈를 해결하며 파트너 측 설정을 성과와 운영 안정성에 맞게 최적화했습니다.',
                    'Affiliate 및 ad network 생태계의 공급 측 업무를 맡아 트래픽 라우팅, 파트너 연동, DSP 측을 관리했습니다.',
                    '앱 개발의 QA, 출시, 운영 전반에 참여하며 소프트웨어 전달 과정, 프로덕션 지원, 수익을 관리했고 이후 앱의 매각을 담당했습니다.',
                  ],
                },
              ],
            },
          ],
          projectDetails: [
            {
              title: '제출·승인 자동화 플로우',
              subtitle: '크리에이터 제출, 검증, 관리자 검토, 슬랙 에이전트 판단, 승인 결과까지 이어지는 게시 워크플로우',
              skills: ['제출 워크플로우', '관리자 승인 대기열', '슬랙 에이전트 자동화', '근거 기반 승인'],
              details: [
                '사용자 제출 화면에서 끝나지 않고, 제출된 항목이 검증, 검토 대기열, 승인 판단, 게시 또는 수정 요청으로 이어지게 했습니다.',
                '슬랙 에이전트가 제출 데이터와 media readiness 근거를 확인해 명확한 케이스만 승인하고, 애매한 케이스는 관리자 검토로 남기게 했습니다.',
                '자동 승인과 수동 검토 모두 감사 기록을 남겨 운영자가 나중에 어떤 근거로 결정됐는지 확인할 수 있게 했습니다.',
              ],
              modal: {
                eyebrow: 'Case 01 · 실제로 굴러가는 제품',
                title: '제출·승인 자동화 플로우',
                summary:
                  '크리에이터가 항목을 제출하면 검증과 media readiness를 확인한 뒤 관리자 검토 대기열로 넘기고, 슬랙 에이전트가 제출 근거를 확인해 자동 승인 가능 여부를 판단하는 워크플로우입니다. 근거가 충분하면 에이전트가 승인하고, 애매하거나 수정이 필요한 케이스는 관리자 검토 또는 크리에이터 수정으로 돌려보냅니다.',
                diagramVariant: 'approvalAutomation',
                mermaidDefinition: [
                  'flowchart LR',
                  '  subgraph Creator[크리에이터 제출]',
                  '    Draft[초안 준비] --> Submit[제출 요청]',
                  '    Submit --> Validate{검증 + media readiness}',
                  '    Validate -->|보완 필요| Revision[크리에이터 수정]',
                  '    Revision --> Draft',
                  '    Validate -->|검토 가능| Submitted[제출된 항목]',
                  '  end',
                  '  subgraph Admin[관리자 승인 관리]',
                  '    Submitted --> Queue[관리자 검토 대기열]',
                  '    Queue --> Manual[수동 검토]',
                  '    Manual --> ManualDecision{승인 또는 반려?}',
                  '  end',
                  '  subgraph Agent[슬랙 에이전트 자동 승인]',
                  '    Queue -->|슬랙 알림| Slack[슬랙 승인 요청]',
                  '    Slack --> Evidence[근거 조회]',
                  '    Evidence --> Judge{승인 신뢰도}',
                  '    Judge -->|근거 충분| Auto[자동 승인]',
                  '    Judge -->|애매함| Manual',
                  '    Auto --> Audit[감사 기록]',
                  '  end',
                  '  ManualDecision -->|승인| Audit',
                  '  ManualDecision -->|반려/수정 요청| Revision',
                  '  Audit --> Publish[승인 후 게시]',
                ].join('\\n'),
                mainFlowLabel: '제출·승인 정상 흐름',
                recoveryFlowLabel: '수정·수동 검토 흐름',
                edgeLabels: {
                  ready: '검토 가능',
                  blocked: '자동 검토',
                  continue: '승인 반영',
                },
                notesLabel: '구현 관점에서 고민한 점',
                closeLabel: '닫기',
                openLabel: '자세히 보기',
                steps: [
                  {
                    title: '크리에이터 제출',
                    description:
                      '사용자가 제목, 설명, 가격, 파일 정보를 작성해 제출하면 초안 상태에서 제출 완료 상태로 전환합니다.',
                    kind: 'entry',
                  },
                  {
                    title: '검증 기준',
                    description:
                      '필수값, 가격, 공개 조건, media readiness를 같은 기준으로 검사해 승인 단계로 넘겨도 되는지 확인합니다.',
                    kind: 'process',
                  },
                  {
                    title: '검토 대기열 라우팅',
                    description:
                      '검토 가능한 항목을 관리자 검토 대기열에 넣고, 슬랙 에이전트와 관리자 화면이 같은 승인 상태를 보게 했습니다.',
                    kind: 'process',
                  },
                  {
                    title: '근거 기반 에이전트 판단',
                    description:
                      '에이전트가 제출 데이터와 media readiness 근거를 확인해 자동 승인해도 되는 케이스인지 판단합니다.',
                    kind: 'decision',
                  },
                  {
                    title: '승인 후 게시',
                    description:
                      '관리자 또는 에이전트가 승인한 항목만 공개 상품 화면에 노출되도록 게시 상태를 전환합니다.',
                    kind: 'output',
                  },
                ],
                recoverySteps: [
                  {
                    title: '크리에이터 수정 루프',
                    description:
                      '필수값이나 media readiness가 부족하면 제출을 끝내지 않고 수정 가능한 초안 흐름으로 되돌립니다.',
                    kind: 'recovery',
                  },
                  {
                    title: '수동 검토 폴백',
                    description:
                      '근거가 애매한 케이스는 에이전트가 억지로 승인하지 않고 관리자가 직접 판단하도록 남깁니다.',
                    kind: 'recovery',
                  },
                  {
                    title: '승인 또는 반려 결정',
                    description:
                      '관리자는 승인, 반려, 수정 요청 중 하나로 최종 상태를 정하고 그 결과를 같은 감사 기록에 남깁니다.',
                    kind: 'decision',
                  },
                  {
                    title: '감사 기록',
                    description:
                      '자동 승인과 수동 검토 모두 판단 근거를 기록해 운영자가 나중에 확인할 수 있게 했습니다.',
                    kind: 'output',
                  },
                ],
                notes: [
                  {
                    title: '제출 이후 상태까지 설계',
                    description:
                      '사용자가 제출한 순간을 끝으로 보지 않고 제출 완료, 검토 대기, 승인 완료, 반려 같은 운영 상태까지 이어지도록 잡았습니다.',
                  },
                  {
                    title: '운영자 개입 최소화',
                    description:
                      '슬랙 에이전트가 근거가 충분한 요청을 직접 승인하게 해서 관리자는 예외와 애매한 케이스에 집중할 수 있게 했습니다.',
                  },
                  {
                    title: '자동 승인에 필요한 안전장치',
                    description:
                      '에이전트가 승인한 이유와 입력 근거를 감사 기록으로 남겨 자동화가 운영자의 통제 밖에서 움직이지 않도록 했습니다.',
                  },
                ],
              },
            },
            {
              title: '미디어 업로드·백그라운드 처리 파이프라인',
              subtitle: '파일 선택, R2 직접 업로드, 백엔드 검증, 워커 후처리, 공개 readiness를 분리한 미디어 흐름',
              skills: ['R2', 'presigned upload', '워커 큐', 'readiness gate'],
              details: [
                '브라우저가 R2로 직접 업로드하고 앱 서버는 upload session, presigned URL, R2 HEAD 검증, 큐 분배를 맡도록 나눴습니다.',
                '검증된 미디어만 워커 큐로 넘겨 태깅, 파생 이미지, 영상 트랜스코딩을 비동기로 처리했습니다.',
                '잘못 올라간 파일은 업로드 재시도로, 후처리 실패는 워커 재시도/backfill로 나눠 업로드 완료와 공개 가능 상태를 끝까지 추적했습니다.',
              ],
              modal: {
                eyebrow: 'Case 02 · 실제로 굴러가는 제품',
                title: '미디어 업로드·백그라운드 처리 파이프라인',
                summary:
                  '이미지와 영상이 선택되는 순간부터 공개 상품 화면에 안전하게 보이는 상태가 되기까지의 흐름을 연결한 미디어 파이프라인입니다. 브라우저는 R2로 직접 업로드하고, 앱 서버는 실제 객체를 다시 검증한 뒤 검증된 미디어만 큐로 넘기며, 워커는 태깅, 파생 이미지, 영상 트랜스코딩을 처리합니다.',
                diagramVariant: 'mediaPipeline',
                mermaidDefinition: [
                  'flowchart LR',
                  '  subgraph Frontend[Frontend upload]',
                  '    File[File selected] --> Session[Upload session + temp media]',
                  '    Session --> Presign[Presigned URL]',
                  '    Presign --> R2[Browser to R2 upload]',
                  '  end',
                  '  subgraph Backend[백엔드 검증]',
                  '    R2 --> Complete[Complete callback]',
                  '    Complete --> Verify{R2 HEAD verification}',
                  '    Verify -->|verified| Queue[큐 분배]',
                  '    Verify -->|invalid| Cleanup[Mismatch cleanup]',
                  '    Cleanup --> UploadRetry[User retry upload]',
                  '  end',
                  '  subgraph Worker[워커 후처리]',
                  '    Queue --> Claim[Claim with lease]',
                  '    Claim --> Route{Media type routing}',
                  '    Route --> Tagging[AI 태깅 / ONNX]',
                  '    Route --> Derivative[WebP 파생 이미지]',
                  '    Route --> Transcode[MP4 영상 트랜스코딩]',
                  '    Tagging --> Result[Result writeback]',
                  '    Derivative --> Result',
                  '    Transcode --> Result',
                  '    Result --> Ready{공개 화면 readiness}',
                  '    Ready -->|ready| Public[Public media available]',
                  '    Ready -->|failed| Retry[Retry / backfill]',
                  '  end',
                  '  Cleanup --> Status[Temp media status]',
                  '  Result --> Status',
                  '  Status --> Retry[Retry / backfill]',
                  '  Retry --> Claim',
                ].join('\\n'),
                mainFlowLabel: '엔드투엔드 미디어 흐름',
                recoveryFlowLabel: '처리·복구 게이트',
                notesLabel: '구현 관점에서 고민한 점',
                closeLabel: '닫기',
                openLabel: '자세히 보기',
                steps: [
                  {
                    title: '파일 선택 + 업로드 세션',
                    description:
                      '사용자가 파일을 선택하면 서버가 upload session과 temp media row를 만들고, 이후 상태 추적의 기준점을 잡습니다.',
                    kind: 'entry',
                  },
                  {
                    title: 'presigned upload',
                    description:
                      '서버는 제한된 업로드 URL만 발급하고, 실제 파일 본문은 브라우저가 R2로 직접 전송합니다.',
                    kind: 'process',
                  },
                  {
                    title: '업로드 완료 콜백',
                    description:
                      '업로드가 끝나면 브라우저는 완료 신호를 보내고, 서버는 이 신호를 후속 검증의 시작점으로만 사용합니다.',
                    kind: 'process',
                  },
                  {
                    title: 'R2 HEAD 검증',
                    description:
                      '업로드 완료 신호만 믿지 않고 R2 객체의 존재, 크기, 콘텐츠 타입을 다시 확인했습니다.',
                    kind: 'decision',
                  },
                  {
                    title: '큐 분배',
                    description:
                      '검증된 미디어만 태깅, 파생 이미지, 영상 트랜스코딩 큐로 나눠 등록했습니다.',
                    kind: 'process',
                  },
                  {
                    title: 'lease 기반 워커 작업 할당',
                    description:
                      '워커가 작업을 가져갈 때 lease를 잡아 같은 미디어가 여러 워커에서 동시에 처리되지 않게 했습니다.',
                    kind: 'process',
                  },
                  {
                    title: '태깅·파생 이미지·트랜스코딩',
                    description:
                      '워커가 ONNX 기반 태깅, 공개용 WebP 파생 이미지, 영상 MP4 변환을 미디어 타입에 맞춰 처리합니다.',
                    kind: 'process',
                  },
                  {
                    title: '공개 화면 readiness',
                    description:
                      '처리 결과가 준비된 뒤에만 공개 상품 화면에서 안전한 미디어를 열도록 readiness gate를 통과시켰습니다.',
                    kind: 'output',
                  },
                ],
                recoverySteps: [
                  {
                    title: '불일치 방지',
                    description:
                      '파일 크기나 콘텐츠 타입이 맞지 않으면 워커 큐로 넘기지 않고 업로드 재시도 대상으로 돌립니다.',
                    kind: 'decision',
                  },
                  {
                    title: '워커 재시도 / backfill',
                    description:
                      '파일은 검증됐지만 태깅, 파생 이미지, 트랜스코딩이 실패한 경우에는 같은 미디어 작업을 다시 잡습니다.',
                    kind: 'recovery',
                  },
                  {
                    title: '임시 미디어 상태',
                    description:
                      '업로드, 검증, 후처리 상태를 임시 미디어 행에 남겨 UI와 운영자가 같은 진행 상태를 보게 했습니다.',
                    kind: 'recovery',
                  },
                  {
                    title: '준비 전 공개 차단',
                    description:
                      '후처리 결과가 준비되기 전에는 안전하지 않은 원본 미디어가 대신 노출되지 않게 했습니다.',
                    kind: 'output',
                  },
                ],
                notes: [
                  {
                    title: '프론트와 백엔드 책임 분리',
                    description:
                      '프론트는 큰 파일 전송을 맡고, 백엔드는 권한 발급, 검증, 상태 전이, 큐 연결을 맡도록 경계를 나눴습니다.',
                  },
                  {
                    title: '완료 신호를 검증 신호로만 보기',
                    description:
                      '클라이언트가 완료를 보냈더라도 R2 객체를 다시 확인해 깨진 업로드가 워커 큐로 넘어가지 않게 했습니다.',
                  },
                  {
                    title: '업로드 완료와 공개 가능 상태 분리',
                    description:
                      '파일이 올라간 상태와 구매자/방문자에게 보여도 되는 상태를 나눠, 후처리 전 미디어 노출 위험을 줄였습니다.',
                  },
                ],
              },
            },
            {
              title: '워커 운영·복구 컨트롤 플레인',
              subtitle: 'heartbeat, active owner, 모듈 오케스트레이션, Railway failover를 묶은 로컬 우선 운영 플랫폼',
              skills: ['워커 슈퍼바이저', 'DB 백업 검증', '주기 작업', 'Railway failover'],
              details: [
                'heartbeat와 worker_control_state로 현재 active owner가 로컬인지 Railway인지 판단하도록 했습니다.',
                '하나의 로컬 워커 슈퍼바이저 안에서 미디어 처리, 검증된 DB 백업, cleanup/stale/backfill 같은 주기 작업 라인을 모듈로 나눴습니다.',
                'DB 백업은 파일 생성과 R2 업로드에서 끝내지 않고 검증 DB 복원과 manifest check를 통과해야 성공으로 기록했습니다.',
                'Railway는 로컬 워커 down이 확인된 뒤 active owner를 넘겨받고, 로컬 회복 후 쿨다운을 거쳐 다시 park되도록 했습니다.',
              ],
              modal: {
                eyebrow: 'Case 06 · 실제로 굴러가는 제품',
                title: '워커 운영·복구 컨트롤 플레인',
                summary:
                  'Redprint의 워커는 미디어 후처리만 하는 단일 작업기가 아니라, 미디어 처리, 검증된 DB 백업, 주기 점검을 로컬 우선으로 실행하는 운영 플랫폼입니다. heartbeat와 active owner 상태로 누가 작업 책임자인지 정하고, 로컬 워커 장애가 확인되면 Railway 대기 백업을 가동해 작업 소유권을 넘기고 백업 워커가 대상 작업을 가져가게 합니다.',
                diagramVariant: 'workerPlatform',
                mermaidDefinition: [
                  'flowchart LR',
                  '  subgraph Control[워커 컨트롤 플레인]',
                  '    Heartbeat[heartbeat + 모듈 상태] --> State[worker_control_state]',
                  '    State --> Owner{active owner 확인}',
                  '    Owner --> Ops[워커 운영 대시보드]',
                  '  end',
                  '  subgraph Local[로컬 워커 허브]',
                  '    Owner -->|로컬 허용| Supervisor[로컬 슈퍼바이저]',
                  '    Supervisor --> Modules{WORKER_MODULES 활성화}',
                  '    Modules --> Media[미디어 라인: 태깅 / 파생 이미지 / 트랜스코딩]',
                  '    Modules --> Backup[DB 백업: pg_dump / R2 / 검증 DB]',
                  '    Modules --> Scheduled[주기 작업: cleanup / stale / backfill]',
                  '    Media --> Status[상태 + 감사 기록]',
                  '    Backup --> Status',
                  '    Scheduled --> Status',
                  '  end',
                  '  subgraph BackupRailway[Railway 대기 백업]',
                  '    Owner -->|local down| Down{장애 전환 가능 여부}',
                  '    Down --> Wake[Railway 깨우기 /ready]',
                  '    Down --> NoHandoff[넘겨주기 없음 / 관찰]',
                  '    Wake --> Refresh[컨트롤 플레인 갱신]',
                  '    Refresh --> OwnerRailway[active owner = Railway]',
                  '    OwnerRailway --> Claim[백업 워커가 활성 작업 가져감]',
                  '    Claim --> Park[장애 복귀 쿨다운 + park]',
                  '  end',
                ].join('\\n'),
                mainFlowLabel: '워커 플랫폼 흐름',
                recoveryFlowLabel: '장애 전환·park 흐름',
                notesLabel: '구현 관점에서 고민한 점',
                closeLabel: '닫기',
                openLabel: '자세히 보기',
                steps: [
                  {
                    title: '로컬 워커 슈퍼바이저',
                    description:
                      '로컬 워커가 슈퍼바이저로 실행되고 heartbeat, 모듈 상태, active owner 상태를 주기적으로 기록합니다.',
                    kind: 'entry',
                  },
                  {
                    title: '모듈 활성화',
                    description:
                      'WORKER_MODULES 기준으로 미디어 처리, DB 백업, 주기 작업 라인을 환경별로 켜고 끌 수 있게 했습니다.',
                    kind: 'process',
                  },
                  {
                    title: '미디어 처리 라인',
                    description:
                      '태깅, 파생 이미지, 영상 트랜스코딩 작업을 큐에서 가져와 처리하고 결과를 공유 상태 행에 기록합니다.',
                    kind: 'process',
                  },
                  {
                    title: '검증된 DB 백업 라인',
                    description:
                      'PostgreSQL 백업 파일을 만들고 R2에 업로드한 뒤 검증 DB에 복원해 실제 복구 가능한 백업만 성공으로 기록합니다.',
                    kind: 'process',
                  },
                  {
                    title: '주기 작업 라인',
                    description:
                      'cleanup, stale-processing recovery, 태깅 backfill, 웹훅 cleanup 같은 주기 작업을 워커 소유 내부 경로 호출로 실행합니다.',
                    kind: 'process',
                  },
                  {
                    title: '워커 운영 가시성',
                    description:
                      '운영 화면과 상태 확인 엔드포인트에서 active owner, 모듈 상태, 큐 압력, 장애 전환 상태를 확인할 수 있게 했습니다.',
                    kind: 'output',
                  },
                ],
                recoverySteps: [
                  {
                    title: 'down 이벤트 감지',
                    description:
                      '로컬 워커가 응답하지 않거나 장애 전환 웹훅이 들어오면 Railway로 전환할 조건이 맞는지 확인하고, 조건이 맞지 않으면 전환하지 않고 관찰 상태로 둡니다.',
                    kind: 'decision',
                  },
                  {
                    title: 'Railway 대기 백업 가동',
                    description:
                      '평소에는 비용을 아끼기 위해 대기 상태로 둔 Railway 백업 워커를 /ready probe와 refresh 경로를 호출해 가동합니다.',
                    kind: 'recovery',
                  },
                  {
                    title: '작업 소유권 갱신',
                    description:
                      'worker_control_state의 active owner를 Railway로 바꾼 뒤 백업 워커만 대상 작업을 가져갈 수 있게 합니다.',
                    kind: 'process',
                  },
                  {
                    title: '복구 쿨다운 + 대기 전환',
                    description:
                      '로컬 워커가 회복돼도 바로 되돌리지 않고 안정화 시간을 둔 뒤 작업 소유권을 되돌리고 Railway를 다시 대기 상태로 전환합니다.',
                    kind: 'output',
                  },
                ],
                notes: [
                  {
                    title: '하나의 워커, 여러 내부 라인',
                    description:
                      '미디어 처리, 백업, 주기 작업을 한 워커 플랫폼 안에 두되 모듈 단위로 켜고 끄게 해 운영 복잡도를 줄였습니다.',
                  },
                  {
                    title: '백업 성공 기준을 복원 검증으로 잡기',
                    description:
                      '백업 파일 업로드만 성공으로 보지 않고 검증 DB 복원까지 통과해야 성공으로 기록해 실제 복구 가능성을 확인했습니다.',
                  },
                  {
                    title: '비용 효율과 장애 전환 경로',
                    description:
                      'Railway를 항상 켜두지 않고 로컬 우선으로 운영하면서도, 장애 시 백업 워커 가동, 소유권 갱신, 작업 확보, 대기 전환 순서로 복구되게 했습니다.',
                  },
                ],
              },
            },
            {
              title: 'Sentry → 슬랙 → 에이전트 장애 대응 자동화',
              subtitle: '프로덕션 에러를 슬랙 thread로 라우팅한 뒤 에이전트가 GitHub 이슈, 수정 브랜치, PR까지 이어가는 장애 대응 워크플로우',
              skills: ['Sentry 웹훅', 'Redis 중복 제거', '슬랙 에이전트', 'GitHub 자동화'],
              details: [
                'Sentry 웹훅의 서명과 타임스탬프를 검증해 신뢰할 수 있는 프로덕션 에러만 장애 대응 파이프라인에 넣었습니다.',
                '범위 밖 이벤트, 웹훅 재전송, 중복 이슈, 슬랙 전송 실패를 서로 다른 종료·복구 흐름으로 분리했습니다.',
                '슬랙 thread를 받은 에이전트가 접수, 근거 수집, GitHub 이슈, 수정 브랜치, 드래프트 PR, NEEDS_REVIEW 보고까지 이어가게 했습니다.',
              ],
              modal: {
                eyebrow: 'Case 04 · 실제로 굴러가는 제품',
                title: 'Sentry → 슬랙 → 에이전트 장애 대응 자동화',
                summary:
                  'Sentry에서 들어오는 프로덕션 에러를 슬랙 알림으로 끝내지 않고, 검증·필터링·중복 제거·도메인 라우팅을 거쳐 에이전트가 GitHub 이슈, 수정 브랜치, 드래프트 PR까지 이어가는 장애 대응 워크플로우입니다. 처리하면 안 되는 이벤트는 제외하고, 자동화 범위를 넘는 케이스는 휴먼리뷰로 남깁니다.',
                diagramVariant: 'incidentAutomation',
                mermaidDefinition: [
                  'flowchart LR',
                  '  Sentry[Sentry 이슈 알림] --> Verify[서명 + 타임스탬프 검증]',
                  '  Verify --> Scope{프로덕션 에러/fatal?}',
                  '  Scope -->|yes| Replay[재전송 방지]',
                  '  Replay --> Dedup[이슈 중복 제거 구간]',
                  '  Dedup --> Route{도메인 라우팅}',
                  '  Route --> Payment[#sentry-payment]',
                  '  Route --> System[#sentry-system]',
                  '  Route --> Triage[#sentry-triage]',
                  '  Payment --> Slack[슬랙 Block Kit 메시지]',
                  '  System --> Slack',
                  '  Triage --> Slack',
                  '  Slack --> Agent[에이전트 ACK + context lookup]',
                  '  Agent --> Evidence{조치 가능한 근거?}',
                  '  Evidence -->|yes| Issue[GitHub 이슈 생성]',
                  '  Issue --> Branch[수정 브랜치 생성]',
                  '  Branch --> PR[드래프트 PR 생성]',
                  '  PR --> Review[thread에 NEEDS_REVIEW 보고]',
                  '  Evidence -->|unclear/out of scope| Human[휴먼리뷰 폴백]',
                  '  Scope -->|no| Ignore[범위 밖]',
                  '  Dedup -->|duplicate| Suppress[반복 알림 억제]',
                  '  Slack -->|429/5xx| Retry[백오프 재시도]',
                  '  Retry --> Slack',
                ].join('\\n'),
                mainFlowLabel: '장애 접수부터 PR까지의 흐름',
                recoveryFlowLabel: '중복 알림·검토 제어 흐름',
                notesLabel: '구현 관점에서 고민한 점',
                closeLabel: '닫기',
                openLabel: '자세히 보기',
                steps: [
                  {
                    title: 'Sentry 웹훅 수신',
                    description:
                      'Sentry 이슈 알림이 릴레이 엔드포인트로 들어오면 원문 본문 기준으로 서명과 타임스탬프를 검증합니다.',
                    kind: 'entry',
                  },
                  {
                    title: '범위 필터링',
                    description:
                      '프로덕션 환경의 에러/fatal 이벤트만 슬랙 알림 대상으로 남기고, 프리뷰나 낮은 심각도의 이벤트는 제외합니다.',
                    kind: 'decision',
                  },
                  {
                    title: '재전송·중복 방지',
                    description:
                      'Redis 키로 오래된 웹훅 재전송과 같은 이슈의 반복 알림을 분리해 슬랙 알림이 과하게 늘지 않도록 했습니다.',
                    kind: 'process',
                  },
                  {
                    title: '도메인별 채널 라우팅',
                    description:
                      '결제 태그, 레거시 정산 태그, URL 키워드 폴백 순서로 결제, 시스템, 일반 분류 채널을 나눴습니다.',
                    kind: 'process',
                  },
                  {
                    title: '에이전트 ACK + context lookup',
                    description:
                      '슬랙 thread가 생성되면 에이전트가 👀 리액션으로 접수하고, 이벤트 ID, 스택 트레이스, 도메인 태그, 관련 로그를 모읍니다.',
                    kind: 'process',
                  },
                  {
                    title: 'GitHub 이슈 + 브랜치 + PR',
                    description:
                      '수정 가능한 장애라고 판단되면 GitHub 이슈를 만들고 수정 브랜치를 생성한 뒤 드래프트 PR까지 올립니다.',
                    kind: 'output',
                  },
                ],
                recoverySteps: [
                  {
                    title: 'Out-of-scope ignore',
                    description:
                      '프로덕션 에러/fatal 범위가 아니면 슬랙과 에이전트 작업을 만들지 않고 명확히 제외합니다.',
                    kind: 'decision',
                  },
                  {
                    title: 'Duplicate suppression',
                    description:
                      '같은 이슈가 짧은 시간에 반복되면 새 메시지를 만들지 않고 중복 제거 상태로 종료합니다.',
                    kind: 'decision',
                  },
                  {
                    title: '슬랙 재시도/백오프',
                    description:
                      '슬랙 429, 5xx, 네트워크 에러처럼 다시 시도할 가치가 있는 실패만 제한된 횟수로 재시도합니다.',
                    kind: 'recovery',
                  },
                  {
                    title: '휴먼리뷰 폴백',
                    description:
                      '근거가 부족하거나 자동 수정 범위를 넘는 경우에는 에이전트가 휴먼리뷰가 필요하다고 thread에 남깁니다.',
                    kind: 'recovery',
                  },
                  {
                    title: 'NEEDS_REVIEW 보고',
                    description:
                      'PR까지 준비된 경우에도 최종 적용은 사람이 확인할 수 있도록 슬랙 thread에 NEEDS_REVIEW 상태로 마무리합니다.',
                    kind: 'output',
                  },
                ],
                notes: [
                  {
                    title: '알림을 작업 단위로 바꾸기',
                    description:
                      'Sentry 이벤트를 슬랙 메시지로 단순 전달하지 않고, 이슈, 브랜치, PR로 이어지는 실행 가능한 단위로 바꿨습니다.',
                  },
                  {
                    title: '중복 알림 줄이기',
                    description:
                      '같은 장애가 반복될 때 메시지를 계속 늘리는 대신, 중복 제거 window로 운영자가 한 thread에 집중하게 했습니다.',
                  },
                  {
                    title: '자동화의 종료 지점 정하기',
                    description:
                      '에이전트가 PR까지 만들 수 있어도 배포 결정은 사람에게 남기기 위해 NEEDS_REVIEW 상태를 명시했습니다.',
                  },
                ],
              },
            },
            {
              title: 'Redis 기반 트래픽 보호·진단 레이어',
              subtitle: 'route policy, actor scope, 레이트 리밋 결정, on-demand diagnostic을 분리한 운영 보호 장치',
              skills: ['Upstash Redis', '레이트 리밋', '진단 세션', 'route bucket'],
              details: [
                'API 경로를 버킷 단위로 정리하고 보호 대상과 제외 대상을 나눠 공유 레이트 리미터 키가 과도하게 늘어나는 문제를 줄였습니다.',
                '운영자가 필요할 때만 진단 세션을 열어 허용/차단 카운트를 Redis hash에 TTL로 기록하게 했습니다.',
                '관리자 사용량 대시보드에서 명령 사용량, 쿼터 소진, 진단 이력을 확인할 수 있게 연결했습니다.',
              ],
              modal: {
                eyebrow: 'Case 05 · 실제로 굴러가는 제품',
                title: 'Redis 기반 트래픽 보호·진단 레이어',
                summary:
                  'Upstash Redis를 무조건 많이 쓰는 것이 아니라, route policy와 actor scope로 보호 대상을 정하고, 필요한 순간에만 on-demand diagnostic을 켜서 명령 사용량과 레이트 리밋 근거를 확인하는 백엔드 운영 레이어입니다.',
                diagramVariant: 'redisTraffic',
                mainFlowLabel: '요청 보호 흐름',
                recoveryFlowLabel: '진단과 비용 제어',
                notesLabel: '구현 관점에서 고민한 점',
                closeLabel: '닫기',
                openLabel: '자세히 보기',
                steps: [
                  {
                    title: '경로 버킷 + 정책',
                    description:
                      'API 경로를 안정적인 경로 버킷으로 정리하고 레이트 리밋 보호 대상인지 먼저 판단합니다.',
                    kind: 'decision',
                  },
                  {
                    title: 'Actor scope 분리',
                    description:
                      '프록시 경로와 내부 경로의 actor 기준을 분리해 레이트 리밋 키가 같은 의미를 갖도록 했습니다.',
                    kind: 'process',
                  },
                  {
                    title: '리미터 결정',
                    description:
                      'Upstash 기반 리미터가 허용 또는 차단 결정을 내리고 route별 정책을 적용합니다.',
                    kind: 'decision',
                  },
                  {
                    title: '허용 / 차단 응답',
                    description:
                      '허용된 요청은 핸들러로 통과시키고, 차단된 요청은 명확한 429 레이트 리밋 응답으로 종료합니다.',
                    kind: 'output',
                  },
                ],
                recoverySteps: [
                  {
                    title: '진단 세션 활성 상태?',
                    description:
                      '요청 처리 결과를 항상 무겁게 추적하지 않고, 운영자가 켠 세션이 있을 때만 진단 카운터를 기록합니다.',
                    kind: 'decision',
                  },
                  {
                    title: 'Redis hash with TTL',
                    description:
                      '진단 데이터는 세션 범위 Redis hash에 TTL로 저장하고, 필요할 때 대시보드 이력으로 읽을 수 있게 했습니다.',
                    kind: 'recovery',
                  },
                  {
                    title: '쿼터 인지',
                    description:
                      'Upstash 명령 사용량과 쿼터 소진 상태를 관리자 화면에서 구분해 볼 수 있게 했습니다.',
                    kind: 'output',
                  },
                ],
                notes: [
                  {
                    title: '보호와 비용의 균형',
                    description:
                      '모든 요청을 무겁게 추적하지 않고, 운영자가 필요할 때만 진단 세션을 열 수 있게 했습니다.',
                  },
                  {
                    title: '키 카디널리티 관리',
                    description:
                      '경로 버킷과 actor scope를 고정해 Redis 키가 예측 가능한 범위 안에서 움직이게 했습니다.',
                  },
                  {
                    title: '운영자가 볼 수 있는 증거',
                    description:
                      '레이트 리밋이 실제로 어느 경로에서 발생했는지 대시보드에서 확인할 수 있게 연결했습니다.',
                  },
                ],
              },
            },
            {
              title: '반응형 마켓플레이스 탐색 피드',
              subtitle: '상품 fetch, 카드 descriptor, row packing, preview prefetch를 나눠 설계한 적응형 탐색 피드',
              skills: ['row packing', 'presentation descriptor', '오프셋 페이지네이션', 'preview prefetch'],
              details: [
                '초기 fetch와 스크롤 fetch가 같은 오프셋 규칙을 유지하도록 해서 같은 항목이 중복되거나 빠지지 않게 했습니다.',
                '카드 렌더러와 row packer가 같은 presentation descriptor를 읽도록 맞춰 화면 폭에 따라 배치가 안정적으로 바뀌게 했습니다.',
                '미리보기 모달용 미디어 prefetch를 목록 렌더링과 분리하고 세션별 prefetch 허용량으로 네트워크 요청을 제한했습니다.',
              ],
              modal: {
                eyebrow: 'Case 03 · 실제로 굴러가는 제품',
                title: '반응형 마켓플레이스 탐색 피드',
                summary:
                  '미디어가 많은 상품 목록을 빠르게 탐색할 수 있도록 API fetch, 페이지네이션, 카드 descriptor, row packing, preview prefetch를 함께 설계한 탐색 피드입니다. 화면 폭이 바뀌어도 같은 상품이 중복되거나 요청이 과하게 늘어나지 않도록 조정했습니다.',
                diagramVariant: 'marketplaceFeed',
                mainFlowLabel: '탐색 피드 렌더링 흐름',
                recoveryFlowLabel: '성능 보호 흐름',
                notesLabel: '구현 관점에서 고민한 점',
                closeLabel: '닫기',
                openLabel: '자세히 보기',
                steps: [
                  {
                    title: 'Initial / scroll fetch',
                    description:
                      '첫 로드와 무한 스크롤 로드가 같은 오프셋 규칙을 사용해 상품 목록을 이어서 가져오게 했습니다.',
                    kind: 'entry',
                  },
                  {
                    title: 'Presentation descriptor',
                    description:
                      '상품 카드가 어떤 미디어를 몇 장 보여줄지 descriptor로 계산해 렌더러와 레이아웃이 같은 기준을 보게 했습니다.',
                    kind: 'process',
                  },
                  {
                    title: 'Responsive row packing',
                    description:
                      '뷰포트 폭에 맞춰 카드 너비와 행 배치를 계산해 이미지 카드 벽이 자연스럽게 재배치되도록 했습니다.',
                    kind: 'process',
                  },
                  {
                    title: '카드 벽 렌더링',
                    description:
                      '계산된 행 단위로 카드 벽을 그려 화면 폭이 바뀌어도 항목 식별값과 노출 순서를 유지합니다.',
                    kind: 'process',
                  },
                  {
                    title: '미리보기 모달 연결',
                    description:
                      '카드를 클릭하면 목록 렌더링과 별개로 미리보기 모달에 필요한 미디어 요청을 이어받게 했습니다.',
                    kind: 'output',
                  },
                ],
                recoverySteps: [
                  {
                    title: '공유 옵저버 풀',
                    description:
                      '카드마다 옵저버를 만들지 않고 공유 옵저버를 사용해 긴 스크롤에서 브라우저 부담을 줄였습니다.',
                    kind: 'process',
                  },
                  {
                    title: 'prefetch 허용량 판단',
                    description:
                      'prefetch를 실행해도 되는지 세션별 허용량을 먼저 확인해 네트워크 요청이 과하게 늘지 않게 했습니다.',
                    kind: 'decision',
                  },
                  {
                    title: 'preview prefetch / on-demand fetch',
                    description:
                      'prefetch 허용량이 남아 있으면 미리보기 미디어를 묶어서 가져오고, 허용량을 다 쓰면 모달을 열 때 필요한 미디어만 요청합니다.',
                    kind: 'recovery',
                  },
                ],
                notes: [
                  {
                    title: '보기 좋은 배치와 데이터 정확성',
                    description:
                      '카드가 예쁘게 배치되는 것만큼 같은 상품이 중복되거나 빠지지 않는 데이터 흐름도 중요하게 봤습니다.',
                  },
                  {
                    title: '렌더링과 미리보기의 분리',
                    description:
                      '목록을 그리는 일과 미리보기 모달을 빠르게 여는 일을 다른 로딩 흐름으로 나눴습니다.',
                  },
                  {
                    title: '네트워크 비용 관리',
                    description:
                      '사용자가 볼 가능성이 높은 미디어만 prefetch하도록 범위를 제한했습니다.',
                  },
                ],
              },
            },
          ],
        },
      },
    },
    en: {
      translation: {
        languageToggleLabel: 'Switch language',
        languageOptionKo: '한국어',
        languageOptionEn: 'English',
        skillCategoriesLabel: 'Skill categories',
        experienceBadge: 'Experience',
        contactEmailLabel: 'Email',
        content: {
          heroTitle: "Hello.\nI'm Jiwoo Han.\nI connect technology and people.",
          heroDescription:
            'I support enterprise customers across Korea and Southeast Asia\nthrough onboarding, education, feature adoption, and business reviews.\nI turn complex customer problems into actionable product and engineering solutions.',
          sections: {
            feature: {
              eyebrow: 'Core Strengths',
              title: 'I understand context and turn product, engineering,\nand business needs into executable plans.',
            },
            skill: {
              eyebrow: 'Expertise & skillset',
              title: 'The capabilities and tools I have used in work\nto solve customer problems.',
            },
            career: {
              eyebrow: 'Career',
              title: 'I have built experience around Customer Success,\ntechnology, and product execution.',
            },
            customerCase: {
              eyebrow: 'Customer Success Cases',
              title: 'Cases where I understood customer technical challenges\nand turned them into actionable solution plans.',
            },
            project: {
              eyebrow: 'Project Details',
              title: 'A closer look at the core systems behind my side project.',
            },
          },
          thanks: {
            title: 'Thank you',
            description: 'Feel free to reach out if you would like to know more.',
            photoAlt: 'Team photo taken together at an AppsFlyer event',
          },
          features: [
            {
              title: 'Technical Communication',
              description:
                'I identify technical requirements across teams during API and SDK development and platform integrations, then coordinate smooth internal and external communication.',
              iconLabel: 'API',
            },
            {
              title: 'Customer Success',
              description:
                'I understand customer problems and propose the right solution. I explain technical issues in plain language, have managed domestic and global enterprise customers, and have built custom solutions rather than stopping at advice.',
              iconLabel: 'CS',
            },
            {
              title: 'Full-stack Project Building',
              description:
                'I have built and operated full-stack projects across frontend, backend, and database layers. I combined Vercel, Railway, Upstash Redis, Cloudflare R2, Stripe, and Sentry for deployment, storage, payments, distributed locking, rate limiting, and automated error response, including a failover structure where a Railway backup worker takes over when the local worker fails.',
              iconLabel: 'FS',
            },
          ],
          skillGroups: [
            {
              id: 'customer-success',
              title: 'Customer Success',
              skills: [
                'Enterprise Onboarding',
                'Customer Education',
                'Adoption Strategy',
                'Beta Programs',
                'EBR',
                'Executive Communication',
                'Intercom',
                'Zendesk',
                'Escalation Management',
              ],
            },
            {
              id: 'technical-implementation',
              title: 'Technical Implementation',
              skills: [
                'SDK Implementation',
                'API Integration',
                'Technical Discovery',
                'Requirements Gathering',
                'SQL',
                'Data Discrepancy Analysis',
                'Platform Configuration',
                'Troubleshooting',
              ],
            },
            {
              id: 'product-development',
              title: 'Product Development',
              skills: [
                'TypeScript',
                'React',
                'Next.js',
                'PostgreSQL',
                'Drizzle ORM',
                'Zod',
                'Workflow Design',
                'Admin Approval Tools',
                'Media Pipeline',
              ],
            },
            {
              id: 'environment-deployment',
              title: 'Environment & Deployment',
              skills: [
                'Vercel',
                'Railway',
                'Cloudflare R2',
                'Upstash Redis',
                'Sentry',
                'Stripe Webhooks',
                'Workers',
                'Rate Limiting',
                'Failover Control',
              ],
            },
            {
              id: 'collaboration-operations',
              title: 'Collaboration & Operations',
              skills: [
                'Product Feedback',
                'Engineering Handoff',
                'Slack Agent Automation',
                'Runbooks',
                'Technical Guides',
                'Documentation',
                'MCP',
                'gstack',
              ],
            },
          ],
          experiences: [
            {
              company: 'AppsFlyer',
              period: 'Apr 2019 - Present',
              summary:
                'After building five years of experience in Korea, I now work from Bangkok with Southeast Asian enterprise customers. I support customer onboarding, education, new feature adoption, beta programs, and regular business reviews to provide the right solutions for each account.',
              roles: [
                {
                  period: 'Aug 2024 - Present',
                  title: 'Senior Customer Success Manager (enterprise) – SEA business',
                },
                {
                  period: 'Nov 2022 - Aug 2024',
                  title: 'Senior Customer Success Manager (enterprise)',
                },
                {
                  period: 'Jan 2021 - Nov 2022',
                  title: 'Customer Success Manager',
                },
                {
                  period: 'Apr 2019 - Dec 2020',
                  title: 'Customer Engagement Manager',
                },
              ],
              details: [
                'Owned enterprise engagements end to end, covering onboarding, technical discovery, requirements gathering, implementation planning, issue escalation, and executive stakeholder communication for premium accounts.',
                'Acted as a trusted technical advisor on SDK implementation, API integration, data discrepancies, and platform configuration, helping customer teams make architecture decisions.',
                'Partnered with Product and Engineering teams to resolve complex customer blockers, translate field feedback into product improvements, and align roadmap decisions with real implementation needs.',
                'Supported pre-sales and expansion discussions with tailored technical solutions, Executive Business Reviews, and adoption strategies that helped maintain 98% client retention across a $3M+ ARR portfolio.',
                'Created internal and customer-facing technical guides, troubleshooting playbooks, and best-practice materials that improved implementation consistency across the whole CS organization.',
              ],
            },
            {
              company: 'Gameberry',
              period: 'Sep 2017 - Mar 2019',
              summary:
                'In Business Development, I worked on ad platform integrations, partner onboarding, and game product operations, gaining hands-on experience with platform structures tied to revenue.',
              roles: [
                {
                  period: 'Sep 2017 - Mar 2019',
                  title: 'Business Development',
                  details: [
                    'Managed platform adoption for DSP/SSP/Ad Exchange integrations, troubleshooting technical onboarding issues and optimizing partner-side configurations for performance and operational stability.',
                    'Managed supply-side operations in the affiliate and ad network ecosystem, including traffic routing, partner integrations, and DSP-side coordination.',
                    'Worked across QA, launch, and operations for app development, managing software delivery, production support, revenue operations, and the later sale of the app.',
                  ],
                },
              ],
            },
          ],
          projectDetails: [
            {
              title: 'Submission and Approval Automation Flow',
              subtitle: 'A publishing workflow that connects creator submission, validation, admin review, Slack agent judgment, and final approval state.',
              skills: ['submission workflow', 'admin approval queue', 'Slack agent automation', 'evidence-based approval'],
              details: [
                'Extended creator submission into validation, review queue, approval judgment, publish, or return-for-changes states.',
                'Let the Slack agent inspect submitted data and media-readiness evidence, approving only clear cases while leaving ambiguous cases for admins.',
                'Recorded both automated and manual decisions in the audit trail so operators can inspect the evidence later.',
              ],
              modal: {
                eyebrow: 'Case 01 · Real Product Work',
                title: 'Submission and Approval Automation Flow',
                summary:
                  'A workflow that takes a creator submission beyond the submit button: validation and media readiness move the item into an admin review queue, while a Slack agent checks the evidence and decides whether automated approval is safe. Clear cases can be approved by the agent; ambiguous or incomplete cases move to manual review or creator revision.',
                diagramVariant: 'approvalAutomation',
                mermaidDefinition: [
                  'flowchart LR',
                  '  subgraph Creator[Creator submission]',
                  '    Draft[Draft ready] --> Submit[Submit request]',
                  '    Submit --> Validate{Validation + media readiness}',
                  '    Validate -->|needs changes| Revision[Creator revision]',
                  '    Revision --> Draft',
                  '    Validate -->|ready for review| Submitted[Submitted item]',
                  '  end',
                  '  subgraph Admin[Admin approval]',
                  '    Submitted --> Queue[Admin review queue]',
                  '    Queue --> Manual[Manual review]',
                  '    Manual --> ManualDecision{Approve or return?}',
                  '  end',
                  '  subgraph Agent[Slack agent approval]',
                  '    Queue -->|Slack notification| Slack[Slack approval request]',
                  '    Slack --> Evidence[Evidence lookup]',
                  '    Evidence --> Judge{Approval confidence}',
                  '    Judge -->|enough evidence| Auto[Autonomous approval]',
                  '    Judge -->|ambiguous| Manual',
                  '    Auto --> Audit[Audit trail]',
                  '  end',
                  '  ManualDecision -->|approve| Audit',
                  '  ManualDecision -->|reject/needs changes| Revision',
                  '  Audit --> Publish[Approved publish]',
                ].join('\\n'),
                mainFlowLabel: 'Submission and approval main flow',
                recoveryFlowLabel: 'Revision and manual-review flow',
                edgeLabels: {
                  ready: 'ready for review',
                  blocked: 'agent review',
                  continue: 'approval applied',
                },
                notesLabel: 'Implementation considerations',
                closeLabel: 'Close',
                openLabel: 'View details',
                steps: [
                  {
                    title: 'Creator submission',
                    description:
                      'The creator submits title, description, pricing, and file information, moving the item from draft to submitted state.',
                    kind: 'entry',
                  },
                  {
                    title: 'Validation contract',
                    description:
                      'Required fields, pricing, publishing conditions, and media readiness are checked before the item enters approval.',
                    kind: 'process',
                  },
                  {
                    title: 'Review queue routing',
                    description:
                      'The item enters an approval state shared by the admin screen and the Slack agent.',
                    kind: 'process',
                  },
                  {
                    title: 'Evidence-based agent judgment',
                    description:
                      'The agent checks submitted data and media-readiness evidence before deciding whether automated approval is safe.',
                    kind: 'decision',
                  },
                  {
                    title: 'Approved publish',
                    description:
                      'Only approved items are transitioned into the public storefront state.',
                    kind: 'output',
                  },
                ],
                recoverySteps: [
                  {
                    title: 'Creator revision loop',
                    description:
                      'Missing required fields or media readiness returns the item to an editable draft path instead of completing submission.',
                    kind: 'recovery',
                  },
                  {
                    title: 'Manual review fallback',
                    description:
                      'Ambiguous cases stay with admins instead of being forced through automated approval.',
                    kind: 'recovery',
                  },
                  {
                    title: 'Approve or return decision',
                    description:
                      'Admins end the review as approved, rejected, or returned for changes, with the result recorded in the same audit trail.',
                    kind: 'decision',
                  },
                  {
                    title: 'Audit trail',
                    description:
                      'Automated and manual decisions both keep evidence so operators can inspect what happened later.',
                    kind: 'output',
                  },
                ],
                notes: [
                  {
                    title: 'Designing beyond submission',
                    description:
                      'The implementation treats submission as the start of an operational workflow, not the end of the user form.',
                  },
                  {
                    title: 'Reducing admin workload',
                    description:
                      'The Slack agent handles clear approval cases so admins can focus on exceptions and ambiguous submissions.',
                  },
                  {
                    title: 'Keeping automation accountable',
                    description:
                      'Agent decisions are backed by evidence and recorded in an audit trail, keeping autonomous approval inspectable.',
                  },
                ],
              },
            },
            {
              title: 'Media Upload and Background Processing Pipeline',
              subtitle: 'A media flow that separates file selection, direct R2 upload, backend verification, worker processing, and storefront readiness.',
              skills: ['R2', 'presigned upload', 'worker queue', 'readiness gate'],
              details: [
                'Split browser-to-R2 transfer from app-server responsibilities such as upload sessions, presigned URLs, R2 HEAD verification, and queue fan-out.',
                'Passed only verified media into worker queues for tagging, image derivative generation, and video transcoding.',
                'Separated invalid-upload retry from worker retry/backfill so upload completion did not automatically imply publishability.',
              ],
              modal: {
                eyebrow: 'Case 02 · Real Product Work',
                title: 'Media Upload and Background Processing Pipeline',
                summary:
                  'An end-to-end media pipeline from the moment a user selects an image or video until safe public media is available. The browser uploads directly to R2, the app server verifies the object before queue handoff, and the worker handles tagging, image derivatives, and video transcodes.',
                diagramVariant: 'mediaPipeline',
                mermaidDefinition: [
                  'flowchart LR',
                  '  subgraph Frontend[Frontend upload]',
                  '    File[File selected] --> Session[Upload session + temp media]',
                  '    Session --> Presign[Presigned URL]',
                  '    Presign --> R2[Browser to R2 upload]',
                  '  end',
                  '  subgraph Backend[Backend verification]',
                  '    R2 --> Complete[Complete callback]',
                  '    Complete --> Verify{R2 HEAD verification}',
                  '    Verify -->|verified| Queue[Queue fan-out]',
                  '    Verify -->|invalid| Cleanup[Mismatch cleanup]',
                  '    Cleanup --> UploadRetry[User retry upload]',
                  '  end',
                  '  subgraph Worker[Worker post-processing]',
                  '    Queue --> Claim[Claim with lease]',
                  '    Claim --> Route{Media type routing}',
                  '    Route --> Tagging[AI tagging / ONNX]',
                  '    Route --> Derivative[Image WebP derivative]',
                  '    Route --> Transcode[Video MP4 transcode]',
                  '    Tagging --> Result[Result writeback]',
                  '    Derivative --> Result',
                  '    Transcode --> Result',
                  '    Result --> Ready{Storefront readiness}',
                  '    Ready -->|ready| Public[Public media available]',
                  '    Ready -->|failed| Retry[Retry / backfill]',
                  '  end',
                  '  Cleanup --> Status[Temp media status]',
                  '  Result --> Status',
                  '  Status --> Retry[Retry / backfill]',
                  '  Retry --> Claim',
                ].join('\\n'),
                mainFlowLabel: 'End-to-end media flow',
                recoveryFlowLabel: 'Processing and recovery gates',
                notesLabel: 'Implementation considerations',
                closeLabel: 'Close',
                openLabel: 'View details',
                steps: [
                  {
                    title: 'File selection + upload session',
                    description:
                      'When a user selects a file, the server creates an upload session and temp media row as the source of truth for later state tracking.',
                    kind: 'entry',
                  },
                  {
                    title: 'Presigned R2 upload',
                    description:
                      'The server issues a limited upload URL while the browser sends the actual file body directly to R2.',
                    kind: 'process',
                  },
                  {
                    title: 'Completion callback',
                    description:
                      'After upload, the browser sends a completion signal that starts backend verification rather than being trusted as final proof.',
                    kind: 'process',
                  },
                  {
                    title: 'R2 HEAD verification',
                    description:
                      'The app verifies object existence, size, and content type instead of trusting the completion signal alone.',
                    kind: 'decision',
                  },
                  {
                    title: 'Queue fan-out',
                    description:
                      'Only verified media is registered into tagging, image derivative, and video transcode queues.',
                    kind: 'process',
                  },
                  {
                    title: 'Worker claim with lease',
                    description:
                      'The worker claims jobs with a lease so the same media is not processed by multiple workers at once.',
                    kind: 'process',
                  },
                  {
                    title: 'Tagging·derivative·transcode',
                    description:
                      'The worker runs ONNX-backed tagging, public WebP derivative generation, or MP4 video conversion based on media type.',
                    kind: 'process',
                  },
                  {
                    title: 'Storefront readiness',
                    description:
                      'Processed outputs must pass readiness checks before public storefront media becomes available.',
                    kind: 'output',
                  },
                ],
                recoverySteps: [
                  {
                    title: 'Mismatch guard',
                    description:
                      'Invalid size or content type blocks queue handoff and returns the upload to a retryable state.',
                    kind: 'decision',
                  },
                  {
                    title: 'Worker retry / backfill',
                    description:
                      'If media is verified but tagging, derivative generation, or transcoding fails, the worker job can be retried or backfilled.',
                    kind: 'recovery',
                  },
                  {
                    title: 'Temp media status',
                    description:
                      'Upload, verification, and processing states stay visible through the temp media row for both UI and operations surfaces.',
                    kind: 'recovery',
                  },
                  {
                    title: 'Fail-closed delivery',
                    description:
                      'The public storefront does not silently fall back to unsafe originals while processed outputs are missing.',
                    kind: 'output',
                  },
                ],
                notes: [
                  {
                    title: 'Separate frontend and backend responsibility',
                    description:
                      'The frontend owns heavy transfer work while the backend owns permissions, verification, state transitions, and queue handoff.',
                  },
                  {
                    title: 'Treat completion as a verification trigger',
                    description:
                      'A browser completion event starts the backend check; it does not automatically qualify the file for worker processing.',
                  },
                  {
                    title: 'Separate uploaded from publishable',
                    description:
                      'A file can be uploaded without being safe to show publicly, so readiness is modeled as a later state.',
                  },
                ],
              },
            },
            {
              title: 'Worker Operations and Recovery Control Plane',
              subtitle: 'A local-first operations platform for heartbeat, active ownership, module orchestration, and Railway failover.',
              skills: ['worker supervisor', 'DB backup verify', 'scheduled ops', 'Railway failover'],
              details: [
                'Used heartbeat and worker_control_state to decide whether the active owner is local or Railway.',
                'Organized media processing, verified DB backup, and cleanup/stale/backfill scheduled operations as separate lines under one local worker supervisor.',
                'Defined backup success as successful R2 upload plus restore verification into a dedicated verify database.',
                'Kept Railway sleeping until local failure is confirmed, then transferred ownership and parked it again after local recovery cooldown.',
              ],
              modal: {
                eyebrow: 'Case 06 · Real Product Work',
                title: 'Worker Operations and Recovery Control Plane',
                summary:
                  'Redprint’s worker is not just a media processor; it is a local-first operations platform for media processing, verified DB backup, and scheduled maintenance. Heartbeat and active-owner state decide who is responsible for work, and Railway wakes as a sleeping backup only after local failure detection.',
                diagramVariant: 'workerPlatform',
                mermaidDefinition: [
                  'flowchart LR',
                  '  subgraph Control[Worker control plane]',
                  '    Heartbeat[Heartbeat + module health] --> State[worker_control_state]',
                  '    State --> Owner{Active owner check}',
                  '    Owner --> Ops[Worker Ops dashboard]',
                  '  end',
                  '  subgraph Local[Local worker hub]',
                  '    Owner -->|local allowed| Supervisor[Local supervisor]',
                  '    Supervisor --> Modules{WORKER_MODULES activation}',
                  '    Modules --> Media[Media line: tagging / derivative / transcode]',
                  '    Modules --> Backup[DB backup: pg_dump / R2 / verify DB]',
                  '    Modules --> Scheduled[Scheduled ops: cleanup / stale / backfill]',
                  '    Media --> Status[Status + audit writeback]',
                  '    Backup --> Status',
                  '    Scheduled --> Status',
                  '  end',
                  '  subgraph BackupRailway[Railway sleeping backup]',
                  '    Owner -->|local down| Down{Failover eligibility}',
                  '    Down --> Wake[Wake Railway /ready]',
                  '    Down --> NoHandoff[No handoff / monitor]',
                  '    Wake --> Refresh[Control-plane refresh]',
                  '    Refresh --> OwnerRailway[Active owner = Railway]',
                  '    OwnerRailway --> Claim[Backup claims active jobs]',
                  '    Claim --> Park[Failback cooldown + park]',
                  '  end',
                ].join('\\n'),
                mainFlowLabel: 'Worker platform flow',
                recoveryFlowLabel: 'Failover and park flow',
                notesLabel: 'Implementation considerations',
                closeLabel: 'Close',
                openLabel: 'View details',
                steps: [
                  {
                    title: 'Local worker supervisor',
                    description:
                      'The local worker runs under a supervisor that reports heartbeat, enabled modules, health state, and active ownership.',
                    kind: 'entry',
                  },
                  {
                    title: 'Module activation',
                    description:
                      'WORKER_MODULES controls whether media processing, DB backup, and scheduled operations are active in a given runtime.',
                    kind: 'process',
                  },
                  {
                    title: 'Media processing line',
                    description:
                      'The worker claims tagging, image derivative, and video transcode jobs from queues and writes results back into shared status rows.',
                    kind: 'process',
                  },
                  {
                    title: 'Verified DB backup line',
                    description:
                      'The worker creates PostgreSQL backup artifacts, uploads them to R2, restores them into a verify database, and records success only after restore checks pass.',
                    kind: 'process',
                  },
                  {
                    title: 'Scheduled operations line',
                    description:
                      'Cleanup, stale-processing recovery, tagging backfill, and webhook cleanup run through worker-owned internal route calls.',
                    kind: 'process',
                  },
                  {
                    title: 'Worker ops visibility',
                    description:
                      'Operators can inspect active owner, module health, queue pressure, and failover state from health and ops surfaces.',
                    kind: 'output',
                  },
                ],
                recoverySteps: [
                  {
                    title: 'Down event detection',
                    description:
                      'When the local worker stops responding or a failover webhook arrives, the system checks whether Railway handoff should start; if conditions are not met, it keeps monitoring without handoff.',
                    kind: 'decision',
                  },
                  {
                    title: 'Railway sleeping backup wake',
                    description:
                      'The Railway backup worker stays quiet until the system wakes it through the ready probe and refresh path.',
                    kind: 'recovery',
                  },
                  {
                    title: 'Ownership refresh',
                    description:
                      'worker_control_state changes active ownership so only the Railway backup can claim eligible jobs.',
                    kind: 'process',
                  },
                  {
                    title: 'Failback cooldown + park',
                    description:
                      'After the local worker recovers, the system waits through a stabilization window before returning ownership and parking Railway again.',
                    kind: 'output',
                  },
                ],
                notes: [
                  {
                    title: 'One worker platform, several internal lines',
                    description:
                      'Media processing, backups, and scheduled operations share one operational platform while remaining separately switchable by module.',
                  },
                  {
                    title: 'Treat backup success as restore-verified',
                    description:
                      'A backup is not counted as successful until the artifact can be restored and checked in the verify database.',
                  },
                  {
                    title: 'Balance cost with failover readiness',
                    description:
                      'Railway is not kept warm all the time; wake, refresh, claim, and park stages preserve a recovery path without constant backup cost.',
                  },
                ],
              },
            },
            {
              title: 'Sentry to Slack to Agent Incident Automation',
              subtitle: 'An incident workflow that routes production errors into Slack, then lets an agent create the GitHub issue, fix branch, and draft PR.',
              skills: ['Sentry webhook', 'Redis dedup', 'Slack agent', 'GitHub automation'],
              details: [
                'Verified Sentry webhook signatures and timestamps before letting production errors enter the incident pipeline.',
                'Separated out-of-scope events, webhook replays, duplicate issues, and Slack delivery failures into distinct exit or recovery paths.',
                'Let the Slack-watching agent acknowledge the thread, gather evidence, create the GitHub issue, open a fix branch, draft a PR, and report NEEDS_REVIEW.',
              ],
              modal: {
                eyebrow: 'Case 04 · Real Product Work',
                title: 'Sentry to Slack to Agent Incident Automation',
                summary:
                  'An incident workflow that does not stop at Slack notification. Production errors are verified, filtered, deduped, routed into the right Slack thread, and then picked up by an agent that turns the incident into a GitHub issue, fix branch, draft PR, and NEEDS_REVIEW handoff. Events outside the automation boundary are ignored or left for human review.',
                diagramVariant: 'incidentAutomation',
                mermaidDefinition: [
                  'flowchart LR',
                  '  Sentry[Sentry issue alert] --> Verify[Signature + timestamp verification]',
                  '  Verify --> Scope{Production error/fatal?}',
                  '  Scope -->|yes| Replay[Replay guard]',
                  '  Replay --> Dedup[Issue dedup window]',
                  '  Dedup --> Route{Domain routing}',
                  '  Route --> Payment[#sentry-payment]',
                  '  Route --> System[#sentry-system]',
                  '  Route --> Triage[#sentry-triage]',
                  '  Payment --> Slack[Slack Block Kit message]',
                  '  System --> Slack',
                  '  Triage --> Slack',
                  '  Slack --> Agent[Agent ACK + context lookup]',
                  '  Agent --> Evidence{Actionable evidence?}',
                  '  Evidence -->|yes| Issue[Create GitHub issue]',
                  '  Issue --> Branch[Create fix branch]',
                  '  Branch --> PR[Open draft PR]',
                  '  PR --> Review[Report NEEDS_REVIEW in thread]',
                  '  Evidence -->|unclear/out of scope| Human[Human review fallback]',
                  '  Scope -->|no| Ignore[Out of scope]',
                  '  Dedup -->|duplicate| Suppress[Suppress repeat alert]',
                  '  Slack -->|429/5xx| Retry[Retry with backoff]',
                  '  Retry --> Slack',
                ].join('\\n'),
                mainFlowLabel: 'Incident-to-PR flow',
                recoveryFlowLabel: 'Noise and review-control flow',
                notesLabel: 'Implementation considerations',
                closeLabel: 'Close',
                openLabel: 'View details',
                steps: [
                  {
                    title: 'Sentry webhook intake',
                    description:
                      'When a Sentry issue alert reaches the relay endpoint, the raw body is verified with signature and timestamp checks.',
                    kind: 'entry',
                  },
                  {
                    title: 'Scope filtering',
                    description:
                      'Only production error/fatal events continue to Slack routing; preview or lower-severity events are ignored.',
                    kind: 'decision',
                  },
                  {
                    title: 'Replay + dedup guard',
                    description:
                      'Redis keys separate stale webhook replays from repeated alerts for the same issue.',
                    kind: 'process',
                  },
                  {
                    title: 'Domain channel routing',
                    description:
                      'Payment tags, legacy payout tags, and URL fallback rules route alerts into payment, system, or general triage channels.',
                    kind: 'process',
                  },
                  {
                    title: 'Agent ACK + context lookup',
                    description:
                      'Once the Slack thread exists, the agent acknowledges it with a reaction and gathers event id, stack trace, domain tags, and related logs.',
                    kind: 'process',
                  },
                  {
                    title: 'GitHub issue + branch + PR',
                    description:
                      'If the incident is actionable, the agent creates a GitHub issue, opens a fix branch, and prepares a draft PR.',
                    kind: 'output',
                  },
                ],
                recoverySteps: [
                  {
                    title: 'Out-of-scope ignore',
                    description:
                      'Events outside production error/fatal scope do not create Slack or agent work.',
                    kind: 'decision',
                  },
                  {
                    title: 'Duplicate suppression',
                    description:
                      'Repeated alerts for the same issue are acknowledged as deduped instead of creating new Slack messages.',
                    kind: 'decision',
                  },
                  {
                    title: 'Slack retry/backoff',
                    description:
                      'Slack 429, 5xx, and transient network failures are retried with bounded backoff.',
                    kind: 'recovery',
                  },
                  {
                    title: 'Human review fallback',
                    description:
                      'When evidence is insufficient or the fix is outside automation scope, the agent leaves the thread for manual review.',
                    kind: 'recovery',
                  },
                  {
                    title: 'NEEDS_REVIEW report',
                    description:
                      'Even when a PR is prepared, the agent ends by reporting NEEDS_REVIEW so a human can inspect the change before landing.',
                    kind: 'output',
                  },
                ],
                notes: [
                  {
                    title: 'Turn alerts into work units',
                    description:
                      'The workflow converts a Sentry event into a concrete issue, branch, and PR instead of stopping at notification.',
                  },
                  {
                    title: 'Reduce duplicates before adding context',
                    description:
                      'Dedup windows keep operators focused on one thread instead of many repeated messages.',
                  },
                  {
                    title: 'Set a clear automation boundary',
                    description:
                      'The agent can prepare the PR, but final approval remains with a human through the NEEDS_REVIEW state.',
                  },
                ],
              },
            },
            {
              title: 'Redis-backed Traffic Control and Diagnostics',
              subtitle: 'An operational protection layer that separates route policy, actor scope, rate-limit decisions, and on-demand diagnostics.',
              skills: ['Upstash Redis', 'rate limiting', 'diagnostic session', 'route bucket'],
              details: [
                'Normalized API traffic into route buckets and policy checks so only protected paths enter shared rate limiting.',
                'Added operator-started diagnostic sessions that record route-level allowed/blocked counters in Redis hashes with TTLs.',
                'Connected command usage, quota exhaustion, and diagnostic history into an admin usage dashboard.',
              ],
              modal: {
                eyebrow: 'Case 05 · Real Product Work',
                title: 'Redis-backed Traffic Control and Diagnostics',
                summary:
                  'A backend operations layer that uses Upstash Redis for controlled rate limiting, route-level diagnostics, and command usage visibility. Route policy and actor scope decide what should be protected, while diagnostics stay on demand so every request does not become expensive to observe.',
                diagramVariant: 'redisTraffic',
                mainFlowLabel: 'Request protection flow',
                recoveryFlowLabel: 'Diagnostic and cost-control flow',
                notesLabel: 'Implementation considerations',
                closeLabel: 'Close',
                openLabel: 'View details',
                steps: [
                  {
                    title: 'Route bucket + policy',
                    description:
                      'API paths are mapped into stable route buckets and checked against protection policy before rate limiting.',
                    kind: 'decision',
                  },
                  {
                    title: 'Actor scope separation',
                    description:
                      'Proxy and internal routes use different actor scope rules to keep limiter keys meaningful.',
                    kind: 'process',
                  },
                  {
                    title: 'Limiter decision',
                    description:
                      'The Upstash-backed limiter returns an allowed or blocked decision based on the route policy.',
                    kind: 'decision',
                  },
                  {
                    title: 'Allowed / blocked response',
                    description:
                      'Allowed requests continue to the handler, while blocked requests end with a clear 429 rate-limit response.',
                    kind: 'output',
                  },
                ],
                recoverySteps: [
                  {
                    title: 'Diagnostic session active?',
                    description:
                      'Diagnostic counters are recorded only when an operator has opened a focused session.',
                    kind: 'decision',
                  },
                  {
                    title: 'Redis hash with TTL',
                    description:
                      'Session-scoped counters are stored in Redis hashes with TTLs and later read by the dashboard.',
                    kind: 'recovery',
                  },
                  {
                    title: 'Quota awareness',
                    description:
                      'The admin dashboard distinguishes command usage, quota exhaustion, and diagnostic history.',
                    kind: 'output',
                  },
                ],
                notes: [
                  {
                    title: 'Balance protection and cost',
                    description:
                      'The system avoids always-on heavy tracing while still allowing focused diagnostics.',
                  },
                  {
                    title: 'Control key cardinality',
                    description:
                      'Stable route buckets and actor scopes keep Redis key growth predictable.',
                  },
                  {
                    title: 'Make operations visible',
                    description:
                      'Operators can see which routes actually generated rate-limit activity.',
                  },
                ],
              },
            },
            {
              title: 'Responsive Marketplace Discovery Feed',
              subtitle: 'An adaptive discovery feed that separates item fetch, card descriptors, row packing, and preview prefetch.',
              skills: ['row packing', 'presentation descriptor', 'offset pagination', 'preview prefetch'],
              details: [
                'Preserved offset-based pagination across initial and infinite-scroll fetches so items do not duplicate or disappear.',
                'Aligned the card renderer and row packer around one presentation descriptor so layouts stay stable across viewport sizes.',
                'Separated preview-modal media prefetch from wall rendering and capped network requests with a per-session prefetch allowance.',
              ],
              modal: {
                eyebrow: 'Case 03 · Real Product Work',
                title: 'Responsive Marketplace Discovery Feed',
                summary:
                  'A discovery feed that combines API fetch, pagination, card descriptors, row packing, and preview prefetching for media-heavy browsing. It keeps the wall visually adaptive without duplicating items or overspending network requests.',
                diagramVariant: 'marketplaceFeed',
                mainFlowLabel: 'Feed rendering flow',
                recoveryFlowLabel: 'Performance protection flow',
                notesLabel: 'Implementation considerations',
                closeLabel: 'Close',
                openLabel: 'View details',
                steps: [
                  {
                    title: 'Initial / scroll fetch',
                    description:
                      'Initial page load and infinite scroll use the same offset rule to fetch the next marketplace items.',
                    kind: 'entry',
                  },
                  {
                    title: 'Presentation descriptor',
                    description:
                      'Each marketplace item gets a descriptor that tells both renderer and layout logic what media should be shown.',
                    kind: 'process',
                  },
                  {
                    title: 'Responsive row packing',
                    description:
                      'Rows are packed according to viewport width so the media wall adapts without breaking item identity.',
                    kind: 'process',
                  },
                  {
                    title: 'Render card wall',
                    description:
                      'Packed rows render the card wall while preserving item identity and ordering across viewport changes.',
                    kind: 'process',
                  },
                  {
                    title: 'Preview modal handoff',
                    description:
                      'Opening a card hands media loading to the preview modal without blocking the wall renderer.',
                    kind: 'output',
                  },
                ],
                recoverySteps: [
                  {
                    title: 'Shared observer pool',
                    description:
                      'A shared observer avoids creating one visibility observer per card in long scrolling sessions.',
                    kind: 'process',
                  },
                  {
                    title: 'Prefetch allowance check',
                    description:
                      'The feed checks the per-session prefetch allowance before starting preview prefetch work.',
                    kind: 'decision',
                  },
                  {
                    title: 'Batched prefetch / on-demand fetch',
                    description:
                      'When allowance remains, preview media is fetched in batches; after it is spent, the modal fetches only what it needs on demand.',
                    kind: 'recovery',
                  },
                ],
                notes: [
                  {
                    title: 'Layout quality and data correctness',
                    description:
                      'The feed needed to look fluid while still preserving exact item identity and pagination order.',
                  },
                  {
                    title: 'Separate wall rendering from preview loading',
                    description:
                      'The card wall and preview modal use different loading tracks so one surface does not slow the other.',
                  },
                  {
                    title: 'Control network spend',
                    description:
                      'The app prefetches likely-needed media, not every possible preview asset.',
                  },
                ],
              },
            },
          ],
        },
      },
    },
  },
  lng: initialLanguage,
  fallbackLng: 'ko',
  interpolation: {
    escapeValue: false,
  },
});

syncDocumentLanguage(initialLanguage);

export default i18n;
