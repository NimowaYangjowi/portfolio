import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

type Feature = {
  title: string;
  description: string;
  iconLabel: string;
};

type SkillGroup = {
  title: string;
  skills: string[];
};

type Experience = {
  category: '업무 경험' | '프로젝트';
  period: string;
  title: string;
  subtitle: string;
  role?: string;
  skills: string[];
  details: string[];
  links?: { label: string; href: string }[];
};

type ProjectDetail = {
  title: string;
  subtitle: string;
  skills: string[];
  details: string[];
};

const features: Feature[] = [
  {
    title: '엔터프라이즈 고객성공',
    description:
      'Samsung Electronics, Garena, HSBC, Woowa Brothers 등 대형 고객의 온보딩, adoption, EBR, stakeholder communication을 담당했습니다.',
    iconLabel: 'CS',
  },
  {
    title: '기술 디스커버리와 구현 전략',
    description:
      'SDK, API, data discrepancy, platform configuration 이슈를 고객 개발팀과 함께 풀고 구현 계획으로 정리했습니다.',
    iconLabel: 'API',
  },
  {
    title: '제품과 운영 시스템 빌딩',
    description:
      '고객 업무를 요구사항, 제품 플로우, 내부 콘솔, 운영 정책으로 바꾸고 필요할 때는 직접 웹 애플리케이션으로 구현합니다.',
    iconLabel: 'OPS',
  },
];

const skillGroups: SkillGroup[] = [
  {
    title: '고객성공',
    skills: ['Onboarding', 'Adoption Strategy', 'EBR', 'Stakeholder Alignment', 'Escalation Management'],
  },
  {
    title: '기술 구현',
    skills: ['SDK', 'API', 'SQL', 'Data Mapping', 'Platform Configuration', 'Troubleshooting'],
  },
  {
    title: '제품 개발',
    skills: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'PostgreSQL', 'Redis'],
  },
  {
    title: '환경 및 배포',
    skills: ['Vercel', 'Railway', 'R2', 'Sentry', 'Webhooks', 'Workers'],
  },
  {
    title: '협업 및 운영',
    skills: ['Product Feedback', 'Engineering Handoff', 'Runbooks', 'MCP', 'gstack', 'Documentation'],
  },
];

const experiences: Experience[] = [
  {
    category: '업무 경험',
    period: '2024.08 - 현재',
    title: 'AppsFlyer',
    subtitle: 'Enterprise Customer Success · SEA business',
    role: 'Senior Customer Success Manager (enterprise)',
    skills: ['Enterprise CS', 'Technical Discovery', 'Implementation Strategy', 'Executive Communication'],
    details: [
      '프리미엄 엔터프라이즈 계정의 온보딩, 요구사항 정리, 구현 계획, 이슈 에스컬레이션을 end-to-end로 담당했습니다.',
      '$3M+ ARR 포트폴리오에서 맞춤형 기술 솔루션, EBR, adoption strategy를 지원하며 98% client retention을 유지했습니다.',
      'Samsung Electronics, Garena, Jazz Pakistan, Zalora, HSBC, Bank of the Philippine Islands, UnionBank, Citi Bank 등을 담당하고 있습니다.',
    ],
  },
  {
    category: '업무 경험',
    period: '2022.11 - 2024.08',
    title: 'AppsFlyer',
    subtitle: 'Enterprise Customer Success',
    role: 'Senior Customer Success Manager (enterprise)',
    skills: ['SDK', 'API Integration', 'Data Discrepancy', 'Product Feedback'],
    details: [
      'SDK implementation, API integration, data discrepancy, platform configuration 이슈에서 고객 개발팀의 기술 의사결정을 도왔습니다.',
      'Product, Engineering, Security 팀과 고객 blocker를 해결하고 현장 피드백을 제품 개선 논의로 연결했습니다.',
      'Samsung Korea HQ primary liaison으로 30+ offices를 가진 글로벌 고객의 주요 구현과 adoption 전략을 리드했습니다.',
    ],
  },
  {
    category: '업무 경험',
    period: '2021.01 - 2022.11',
    title: 'AppsFlyer',
    subtitle: 'Customer Success Manager',
    role: 'Customer Success Manager',
    skills: ['Customer Success', 'Technical Guides', 'APAC Playbooks', 'Training'],
    details: [
      'Woowa Brothers, Netmarble, Com2us, Bitmango, Bithumb 등 엔터프라이즈 고객을 담당했습니다.',
      '내부와 고객이 함께 쓰는 기술 가이드, troubleshooting playbook, best practice 자료를 만들어 APAC 구현 품질을 맞췄습니다.',
      'Bangkok, London, Sao Paulo 글로벌 워크숍을 운영하고 Berlin, Sao Paulo 지역 CSM과 전략을 맞췄습니다.',
    ],
  },
  {
    category: '업무 경험',
    period: '2019.04 - 2020.12',
    title: 'AppsFlyer',
    subtitle: 'Customer Engagement',
    role: 'Customer Engagement Manager',
    skills: ['Customer Engagement', 'Enablement', 'Training', 'Support'],
    details: [
      '고객의 초기 사용 맥락을 파악하고 제품 활용을 돕는 engagement 업무를 담당했습니다.',
      '고객 문의와 반복 이슈를 정리해 이후 Customer Success와 technical enablement 업무의 기반을 만들었습니다.',
    ],
  },
  {
    category: '프로젝트',
    period: '2024 - 현재',
    title: 'Redprint',
    subtitle: '마켓플레이스 시스템 개발 프로젝트',
    role: 'Product Builder',
    skills: ['TypeScript', 'Next.js', 'PostgreSQL', 'Redis', 'R2', 'Sentry'],
    details: [
      '등록, 업로드, 탐색, 결제, 정산, 운영 복구가 이어지는 marketplace system을 설계하고 구현했습니다.',
      'multi-step workflow, draft persistence, media readiness gate로 긴 제출 과정이 복구 가능하도록 만들었습니다.',
      'queue, lease, heartbeat, failover 구조로 tagging, transcoding, scheduled maintenance 같은 비동기 작업을 운영했습니다.',
    ],
  },
];

const projectDetails: ProjectDetail[] = [
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
];

function Header() {
  return (
    <header className="site-header">
      <nav className="nav-pill" aria-label="Portfolio navigation">
        <a href="#skill">기술</a>
        <a href="#career">경력</a>
        <a href="#project">프로젝트</a>
        <a href="#blog">블로그</a>
      </nav>
    </header>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="section-heading">
      <p className="section-eyebrow">{eyebrow}</p>
      {title ? <h2 className="section-title">{title}</h2> : null}
    </div>
  );
}

function SkillBadge({ label }: { label: string }) {
  return (
    <span className="skill-badge">
      <span className="skill-icon">{label.slice(0, 2).toUpperCase()}</span>
      <span>{label}</span>
    </span>
  );
}

function App() {
  return (
    <div className="page">
      <Header />

      <main>
        <section id="intro" className="hero-section">
          <div className="hero-content">
            <h1>
              안녕하세요,
              <br />
              고객의 복잡한 일을
              <br />
              기술과 제품 플로우로 바꾸는
              <br />
              한지우입니다.
            </h1>
            <p>
              Customer Success를 기반으로 기술 디스커버리, 구현 전략, 제품/엔지니어링 협업까지 연결합니다.
              고객이 겪는 모호한 문제를 실행 가능한 기술 계획과 운영 시스템으로 바꿉니다.
            </p>
          </div>
        </section>

        <section id="feature" className="section">
          <SectionHeading eyebrow="핵심 역량" title="고객의 문제를 듣고, 기술의 언어로 정리하고, 실행 가능한 시스템으로 만듭니다." />
          <div className="feature-grid">
            {features.map((feature) => (
              <article className="feature-card" key={feature.title}>
                <div className="feature-image" aria-hidden="true">
                  <span>{feature.iconLabel}</span>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="skill" className="section">
          <SectionHeading eyebrow="기술 스택 및 도구" title="아래의 기술과 업무 도구를 사용할 수 있습니다." />
          <div className="skill-tabs" aria-label="Skill categories">
            {skillGroups.map((group) => (
              <span key={group.title}>{group.title}</span>
            ))}
          </div>
          <div className="skill-grid">
            {skillGroups.flatMap((group) =>
              group.skills.map((skill) => <SkillBadge key={`${group.title}-${skill}`} label={skill} />),
            )}
          </div>
        </section>

        <section id="career" className="section">
          <SectionHeading eyebrow="경력 사항" title="고객성공을 중심으로 기술과 제품 실행 경험을 쌓아왔습니다." />
          <div className="experience-layout">
            <p className="experience-label">업무 경험</p>
            <div className="experience-list">
              {experiences.map((experience) => (
                <article className="experience-card" key={`${experience.category}-${experience.period}-${experience.title}`}>
                  <div className="experience-period">{experience.period}</div>
                  <div className="experience-body">
                    <p className="experience-category">{experience.category}</p>
                    <h3>{experience.title}</h3>
                    <p className="experience-subtitle">{experience.subtitle}</p>
                    {experience.role ? <p className="experience-role">{experience.role}</p> : null}
                    <div className="experience-skills">
                      {experience.skills.map((skill) => (
                        <span key={skill}>{skill}</span>
                      ))}
                    </div>
                    <details>
                      <summary>주요 업무 내용 보기</summary>
                      <ul>
                        {experience.details.map((detail) => (
                          <li key={detail}>{detail}</li>
                        ))}
                      </ul>
                    </details>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="project" className="section">
          <SectionHeading eyebrow="프로젝트 상세" title="주요 프로젝트의 세부 사항을 확인해보세요" />
          <div className="project-grid">
            {projectDetails.map((project) => (
              <article className="project-card" key={project.title}>
                <h3>{project.title}</h3>
                <p>{project.subtitle}</p>
                <div className="experience-skills">
                  {project.skills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
                <ul>
                  {project.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="blog" className="section empty-section">
          <SectionHeading eyebrow="블로그" title="" />
          <div className="empty-box" aria-label="No matching blog content" />
        </section>

        <section id="education" className="section empty-section">
          <SectionHeading eyebrow="교육 및 어학" title="" />
          <div className="empty-box" aria-label="No matching education content" />
        </section>

        <section id="contact" className="thanks-section">
          <p>감사합니다</p>
          <h2>
            더 궁금한 점이 있다면
            <br />
            편하게 연락주세요
          </h2>
          <div className="contact-links">
            <a href="mailto:jiwoohan92@gmail.com">이메일</a>
            <a href="https://www.linkedin.com/in/jiwoo-han-557289143/">LinkedIn</a>
          </div>
        </section>
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
