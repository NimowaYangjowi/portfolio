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
          heroTitle: '안녕하세요,\n고객의 복잡한 일을\n기술과 제품 플로우로 바꾸는\n한지우입니다.',
          heroDescription:
            'Customer Success를 기반으로 기술 디스커버리, 구현 전략, 제품/엔지니어링 협업까지 연결합니다. 고객이 겪는 모호한 문제를 실행 가능한 기술 계획과 운영 시스템으로 바꿉니다.',
          sections: {
            feature: {
              eyebrow: '핵심 역량',
              title: '고객의 문제를 듣고, 기술의 언어로 정리하고, 실행 가능한 시스템으로 만듭니다.',
            },
            skill: {
              eyebrow: '전문영역 및 스킬셋',
              title: '문제 해결을 위해 기술적 구현을 넘어 비즈니스 솔루션을 설계하고 실행합니다.',
            },
            career: {
              eyebrow: '경력 사항',
              title: '고객성공을 중심으로 기술과 제품 실행 경험을 쌓아왔습니다.',
            },
            project: {
              eyebrow: '프로젝트 상세',
              title: '주요 프로젝트의 세부 사항을 확인해보세요',
            },
          },
          thanks: {
            title: '감사합니다',
            description: '더 궁금한 점이 있다면 편하게 연락주세요',
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
                '프론트엔드, 백엔드, 데이터베이스를 포함한 풀스택 프로젝트를 직접 빌드하고 운영했습니다. Vercel, Railway, Upstash Redis, Cloudflare R2, Stripe, Sentry를 조합해 배포, 스토리지, 결제, 분산락, rate limiting, 에러 대응 자동화를 구성했고, 로컬 worker 장애 시 Railway backup worker가 작업을 이어받는 failover 구조까지 설계했습니다.',
              iconLabel: 'FS',
            },
          ],
          skillGroups: [
            {
              id: 'customer-success',
              title: '고객성공',
              skills: ['Onboarding', 'Adoption Strategy', 'EBR', 'Stakeholder Alignment', 'Escalation Management'],
            },
            {
              id: 'technical-implementation',
              title: '기술 구현',
              skills: ['SDK', 'API', 'SQL', 'Data Mapping', 'Platform Configuration', 'Troubleshooting'],
            },
            {
              id: 'product-development',
              title: '제품 개발',
              skills: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'PostgreSQL', 'Redis'],
            },
            {
              id: 'environment-deployment',
              title: '환경 및 배포',
              skills: ['Vercel', 'Railway', 'R2', 'Sentry', 'Webhooks', 'Workers'],
            },
            {
              id: 'collaboration-operations',
              title: '협업 및 운영',
              skills: ['Product Feedback', 'Engineering Handoff', 'Runbooks', 'MCP', 'gstack', 'Documentation'],
            },
          ],
          experiences: [
            {
              company: 'AppsFlyer',
              period: '2019.04 - 현재',
              summary:
                'Customer Engagement 와 Enterprise Customer Success를 거치며 대형 고객의 온보딩, 기술 구현, 제품 피드백, adoption strategy를 연결했습니다.',
              roles: [
                {
                  period: '2024.08 - 현재',
                  title: 'Senior Customer Success Manager (enterprise)',
                  subtitle: 'Enterprise Customer Success · SEA business',
                  skills: ['Enterprise CS', 'Technical Discovery', 'Implementation Strategy', 'Executive Communication'],
                  details: [
                    '프리미엄 엔터프라이즈 계정의 온보딩, 요구사항 정리, 구현 계획, 이슈 에스컬레이션을 end-to-end로 담당했습니다.',
                    '복수의 프리미엄 엔터프라이즈 포트폴리오에서 맞춤형 기술 솔루션, EBR, adoption strategy를 지원하며 장기적인 고객 관계를 유지했습니다.',
                    'Electronics, gaming, e-commerce, fintech, banking 영역의 APAC/SEA 엔터프라이즈 고객을 담당하고 있습니다.',
                  ],
                },
                {
                  period: '2022.11 - 2024.08',
                  title: 'Senior Customer Success Manager (enterprise)',
                  subtitle: 'Enterprise Customer Success',
                  skills: ['SDK', 'API Integration', 'Data Discrepancy', 'Product Feedback'],
                  details: [
                    'SDK implementation, API integration, data discrepancy, platform configuration 이슈에서 고객 개발팀의 기술 의사결정을 도왔습니다.',
                    'Product, Engineering, Security 팀과 고객 blocker를 해결하고 현장 피드백을 제품 개선 논의로 연결했습니다.',
                    '글로벌 HQ와 여러 지역 오피스가 연결된 엔터프라이즈 고객의 주요 구현과 adoption 전략을 리드했습니다.',
                  ],
                },
                {
                  period: '2021.01 - 2022.11',
                  title: 'Customer Success Manager',
                  skills: ['Customer Success', 'Technical Guides', 'APAC Playbooks', 'Training'],
                  details: [
                    'Food delivery, gaming, fintech/crypto 영역의 한국 엔터프라이즈 고객을 담당했습니다.',
                    '내부와 고객이 함께 쓰는 기술 가이드, troubleshooting playbook, best practice 자료를 만들어 APAC 구현 품질을 맞췄습니다.',
                    'Bangkok, London, Sao Paulo 글로벌 워크숍을 운영하고 Berlin, Sao Paulo 지역 CSM과 전략을 맞췄습니다.',
                  ],
                },
                {
                  period: '2019.04 - 2020.12',
                  title: 'Customer Engagement Manager',
                  skills: ['Customer Engagement', 'Enablement', 'Training', 'Support'],
                  details: [
                    'Intercom과 Zendesk를 활용해 많은 고객을 관리하고, 이를 효율적으로 운영할 수 있는 온보딩 플로우를 설계했습니다.',
                    '고객의 니즈, 행동, 온보딩 진행 단계에 따라 적절한 안내 메시지가 자동으로 전달되도록 단계별 인게이지먼트 캠페인을 기획하고 운영했습니다.',
                    '신규 유저의 제품 이해도와 사용 전환을 높이기 위해 온보딩 웨비나를 정기적으로 진행했습니다.',
                  ],
                },
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
                  skills: ['DSP/SSP', 'Ad Exchange', 'Affiliate Network', 'Partner Integration', 'QA & Launch'],
                  details: [
                    'DSP/SSP/Ad Exchange 연동을 위한 플랫폼 도입을 관리하고, 기술 온보딩 이슈를 해결하며 파트너 측 설정을 성과와 운영 안정성에 맞게 최적화했습니다.',
                    '게임 제품의 QA, 출시, 운영 전반에 참여하며 소프트웨어 전달 과정, 프로덕션 지원, 수익과 연결되는 플랫폼 동작을 실무로 익혔습니다.',
                    'Affiliate 및 ad network 생태계의 공급 측 업무를 맡아 트래픽 라우팅, 파트너 연동, 판매자 측 수익 구조를 다뤘습니다.',
                  ],
                },
              ],
            },
          ],
          projectDetails: [
            {
              title: '복구 가능한 등록 플로우',
              subtitle: '긴 제출 과정에서도 사용자가 작성한 내용이 사라지지 않도록 만든 creator-facing publishing flow',
              skills: ['multi-step workflow', 'draft persistence', 'media readiness gate', 'submit coordinator'],
              details: [
                'Create/Edit 플로우의 공통 validation contract를 만들고 저장 경계는 분리했습니다.',
                '파일 upload/link completeness와 public storefront readiness를 별도 gate로 나눴습니다.',
                '실패를 숨기지 않고 draft restore, retry, validation warning으로 다시 이어갈 수 있게 했습니다.',
              ],
            },
            {
              title: '대용량 미디어 파이프라인',
              subtitle: '무거운 파일을 서버를 막지 않고 브라우저에서 object storage로 직접 보내는 업로드 구조',
              skills: ['R2', 'presigned upload', 'queue orchestration', 'worker recovery'],
              details: [
                '이미지와 영상은 presigned URL을 통해 직접 업로드하고 app server의 부담을 줄였습니다.',
                'worker 후처리가 끝나기 전에는 public storefront가 안전하지 않은 원본 fallback으로 열리지 않게 했습니다.',
              ],
            },
            {
              title: '결제부터 정산까지의 돈 플로우',
              subtitle: '구매자, 판매자, 운영자가 돈의 상태를 같은 기준으로 볼 수 있게 만든 finance operation layer',
              skills: ['Stripe webhook', 'ledger posting', 'idempotency guard', 'reconciliation'],
              details: [
                'payout execution, reconciliation, monthly close approval, receipt generation을 운영 플로우로 정리했습니다.',
                'duplicate payout, stuck webhook state, reporting inaccuracy를 막기 위한 guard를 만들었습니다.',
              ],
            },
            {
              title: 'AI-assisted delivery system',
              subtitle: '복잡한 구현, 검증, 문서화를 반복 가능한 작업 흐름으로 나누는 개발 운영 시스템',
              skills: ['MCP', 'reusable skills', 'sub-agent delegation', 'QA workflow'],
              details: [
                'planning, QA, document generation, code review support를 반복 가능한 workflow로 표준화했습니다.',
                'prompt check, changed-file validation, task-state tracking, session handoff routine으로 작업 흐름의 흔들림을 줄였습니다.',
              ],
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
          heroTitle: "Hello,\nI'm Jiwoo Han.\nI turn complex customer work\ninto technology and product flows.",
          heroDescription:
            'I connect Customer Success with technical discovery, implementation strategy, and product/engineering collaboration. I turn ambiguous customer problems into executable technical plans and operating systems.',
          sections: {
            feature: {
              eyebrow: 'Core Strengths',
              title: 'I listen to customer problems, translate them into technical language, and build systems that can be executed.',
            },
            skill: {
              eyebrow: 'Expertise & skillset',
              title: 'I design and execute business solutions that go beyond technical implementation.',
            },
            career: {
              eyebrow: 'Career',
              title: 'My experience sits at the intersection of Customer Success, technology, and product execution.',
            },
            project: {
              eyebrow: 'Project Details',
              title: 'A closer look at the projects behind the work.',
            },
          },
          thanks: {
            title: 'Thank you',
            description: 'Feel free to reach out if you would like to know more.',
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
              skills: ['Onboarding', 'Adoption Strategy', 'EBR', 'Stakeholder Alignment', 'Escalation Management'],
            },
            {
              id: 'technical-implementation',
              title: 'Technical Implementation',
              skills: ['SDK', 'API', 'SQL', 'Data Mapping', 'Platform Configuration', 'Troubleshooting'],
            },
            {
              id: 'product-development',
              title: 'Product Development',
              skills: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'PostgreSQL', 'Redis'],
            },
            {
              id: 'environment-deployment',
              title: 'Environment & Deployment',
              skills: ['Vercel', 'Railway', 'R2', 'Sentry', 'Webhooks', 'Workers'],
            },
            {
              id: 'collaboration-operations',
              title: 'Collaboration & Operations',
              skills: ['Product Feedback', 'Engineering Handoff', 'Runbooks', 'MCP', 'gstack', 'Documentation'],
            },
          ],
          experiences: [
            {
              company: 'AppsFlyer',
              period: 'Apr 2019 - Present',
              summary:
                'Across Customer Engagement and Enterprise Customer Success, I connected enterprise onboarding, technical implementation, product feedback, and adoption strategy.',
              roles: [
                {
                  period: 'Aug 2024 - Present',
                  title: 'Senior Customer Success Manager (enterprise)',
                  subtitle: 'Enterprise Customer Success · SEA business',
                  skills: ['Enterprise CS', 'Technical Discovery', 'Implementation Strategy', 'Executive Communication'],
                  details: [
                    'Owned onboarding, requirements clarification, implementation planning, and issue escalation for premium enterprise accounts end-to-end.',
                    'Supported custom technical solutions, EBRs, and adoption strategy across multiple premium enterprise portfolios while maintaining long-term customer relationships.',
                    'Manage APAC/SEA enterprise customers across electronics, gaming, e-commerce, fintech, and banking.',
                  ],
                },
                {
                  period: 'Nov 2022 - Aug 2024',
                  title: 'Senior Customer Success Manager (enterprise)',
                  subtitle: 'Enterprise Customer Success',
                  skills: ['SDK', 'API Integration', 'Data Discrepancy', 'Product Feedback'],
                  details: [
                    'Helped customer engineering teams make technical decisions around SDK implementation, API integration, data discrepancy, and platform configuration issues.',
                    'Worked with Product, Engineering, and Security teams to resolve customer blockers and turn field feedback into product improvement discussions.',
                    'Led major implementations and adoption strategies for enterprise customers spanning global HQs and multiple regional offices.',
                  ],
                },
                {
                  period: 'Jan 2021 - Nov 2022',
                  title: 'Customer Success Manager',
                  skills: ['Customer Success', 'Technical Guides', 'APAC Playbooks', 'Training'],
                  details: [
                    'Managed Korean enterprise customers across food delivery, gaming, and fintech/crypto.',
                    'Created technical guides, troubleshooting playbooks, and best-practice materials for both internal teams and customers to align APAC implementation quality.',
                    'Ran global workshops in Bangkok, London, and Sao Paulo, and aligned strategy with CSMs in Berlin and Sao Paulo.',
                  ],
                },
                {
                  period: 'Apr 2019 - Dec 2020',
                  title: 'Customer Engagement Manager',
                  skills: ['Customer Engagement', 'Enablement', 'Training', 'Support'],
                  details: [
                    'Designed onboarding flows across Intercom and Zendesk to manage a high volume of customers more efficiently.',
                    'Planned and operated stage-based engagement campaigns that automatically delivered relevant guidance based on customer needs, behavior, and onboarding progress.',
                    'Ran recurring onboarding webinars to improve new user education and activation.',
                  ],
                },
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
                  skills: ['DSP/SSP', 'Ad Exchange', 'Affiliate Network', 'Partner Integration', 'QA & Launch'],
                  details: [
                    'Managed platform adoption for DSP/SSP/Ad Exchange integrations, troubleshooting technical onboarding issues and optimizing partner-side configurations for performance and operational stability.',
                    'Worked across QA, launch, and ongoing operations for gaming products, building practical understanding of software delivery, production support, and revenue-linked platform behavior.',
                    'Operated on the supply side of affiliate and ad network ecosystems, developing hands-on understanding of traffic routing, partner integrations, and seller-side revenue mechanics.',
                  ],
                },
              ],
            },
          ],
          projectDetails: [
            {
              title: 'Recoverable Registration Flow',
              subtitle: 'A creator-facing publishing flow that protects user input during long submission journeys.',
              skills: ['multi-step workflow', 'draft persistence', 'media readiness gate', 'submit coordinator'],
              details: [
                'Built a shared validation contract for Create/Edit flows while separating the persistence boundary.',
                'Split file upload/link completeness and public storefront readiness into separate gates.',
                'Kept failures visible and recoverable through draft restore, retry, and validation warnings.',
              ],
            },
            {
              title: 'Large Media Pipeline',
              subtitle: 'An upload architecture that sends heavy files directly from the browser to object storage without blocking the server.',
              skills: ['R2', 'presigned upload', 'queue orchestration', 'worker recovery'],
              details: [
                'Uploaded images and videos directly through presigned URLs to reduce load on the app server.',
                'Prevented the public storefront from opening with unsafe original fallbacks before worker post-processing completed.',
              ],
            },
            {
              title: 'Money Flow from Payment to Settlement',
              subtitle: 'A finance operation layer that lets buyers, sellers, and operators view money status through the same rules.',
              skills: ['Stripe webhook', 'ledger posting', 'idempotency guard', 'reconciliation'],
              details: [
                'Organized payout execution, reconciliation, monthly close approval, and receipt generation as an operating flow.',
                'Added guards against duplicate payouts, stuck webhook state, and reporting inaccuracy.',
              ],
            },
            {
              title: 'AI-assisted delivery system',
              subtitle: 'A development operations system that breaks complex implementation, verification, and documentation into repeatable workflows.',
              skills: ['MCP', 'reusable skills', 'sub-agent delegation', 'QA workflow'],
              details: [
                'Standardized planning, QA, document generation, and code review support into repeatable workflows.',
                'Reduced instability in the work process with prompt checks, changed-file validation, task-state tracking, and session handoff routines.',
              ],
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
