import { StrictMode, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import type { ReactNode } from 'react';
import { Badge } from './components/ui/badge';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { ArrowUpRight, FlowerBurst, FlowerCluster, Mail, Sparkles } from './components/ui/icons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import ClickSpark from './components/ClickSpark';
import TextType from './components/TextType';
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

type ExperienceRole = {
  period: string;
  title: string;
  subtitle?: string;
  skills: string[];
  details: string[];
};

type Experience = {
  company: string;
  period: string;
  summary: string;
  roles: ExperienceRole[];
};

type ProjectDetail = {
  title: string;
  subtitle: string;
  skills: string[];
  details: string[];
};

const features: Feature[] = [
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
    company: 'AppsFlyer',
    period: '2019.04 - 현재',
    summary:
      'Enterprise Customer Success와 Customer Engagement를 거치며 대형 고객의 온보딩, 기술 구현, 제품 피드백, adoption strategy를 연결했습니다.',
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
          '고객의 초기 사용 맥락을 파악하고 제품 활용을 돕는 engagement 업무를 담당했습니다.',
          '고객 문의와 반복 이슈를 정리해 이후 Customer Success와 technical enablement 업무의 기반을 만들었습니다.',
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
          'Managed platform adoption for DSP/SSP/Ad Exchange integrations, troubleshooting technical onboarding issues and optimizing partner-side configurations for performance and operational stability.',
          'Worked across QA, launch, and ongoing operations for gaming products, building practical understanding of software delivery, production support, and revenue-linked platform behavior.',
          'Operated on the supply side of affiliate and ad network ecosystems, developing hands-on understanding of traffic routing, partner integrations, and seller-side revenue mechanics.',
        ],
      },
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

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <Reveal className="section-heading">
      <p className="section-eyebrow">{eyebrow}</p>
      {title ? <h2 className="section-title">{title}</h2> : null}
    </Reveal>
  );
}

function useInView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -4% 0px', threshold: 0.08 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { ref, isVisible } = useInView<HTMLDivElement>();

  return (
    <div ref={ref} className={`reveal ${isVisible ? 'reveal-visible' : ''} ${className}`}>
      {children}
    </div>
  );
}

function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <Reveal>
      <Card className="feature-card">
        <div className="feature-visual" aria-hidden="true">
          <span>{feature.iconLabel}</span>
        </div>
        <CardHeader>
          <CardTitle>{feature.title}</CardTitle>
          <CardDescription>{feature.description}</CardDescription>
        </CardHeader>
      </Card>
    </Reveal>
  );
}

function SkillBadge({ label }: { label: string }) {
  return (
    <Badge className="skill-badge" variant="accent">
      <span className="skill-icon" aria-hidden="true">{label.slice(0, 2).toUpperCase()}</span>
      {label}
    </Badge>
  );
}

function SkillTabs() {
  return (
    <Tabs defaultValue={skillGroups[0].title} className="skill-tabs">
      <TabsList aria-label="Skill categories">
        {skillGroups.map((group) => (
          <TabsTrigger key={group.title} value={group.title}>{group.title}</TabsTrigger>
        ))}
      </TabsList>
      {skillGroups.map((group) => (
        <TabsContent key={group.title} value={group.title}>
          <div className="skill-grid">
            {group.skills.map((skill) => (
              <Reveal className="skill-reveal" key={`${group.title}-${skill}`}>
                <SkillBadge label={skill} />
              </Reveal>
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}

function ExperienceEntry({ experience, index }: { experience: Experience; index: number }) {
  const MarkerIcon = index % 2 === 0 ? FlowerBurst : FlowerCluster;

  return (
    <Reveal className="experience-entry">
      <span className="experience-marker" aria-hidden="true">
        <MarkerIcon size={24} />
      </span>
      <div className="experience-body">
        <div className="experience-company-row">
          <div>
            <p className="experience-period">{experience.period}</p>
            <h3 className="experience-company">{experience.company}</h3>
          </div>
          <Badge variant="outline">Experience</Badge>
        </div>
        <p className="experience-summary">{experience.summary}</p>
        <div className="experience-role-list">
          {experience.roles.map((role) => (
            <section className="experience-role-block" key={`${experience.company}-${role.period}-${role.title}`}>
              <div className="experience-role-heading">
                <h4 className="experience-role-title">{role.title}</h4>
                <span className="experience-role-period">{role.period}</span>
              </div>
              {role.subtitle ? <p className="experience-role-subtitle">{role.subtitle}</p> : null}
              <div className="badge-row">
                {role.skills.map((skill) => (
                  <Badge key={skill} variant="default">{skill}</Badge>
                ))}
              </div>
              <ul className="detail-list experience-detail-list">
                {role.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

function ProjectCard({ project, index }: { project: ProjectDetail; index: number }) {
  return (
    <Reveal>
      <Card className="project-card">
        <CardHeader>
          <Badge variant="outline">Project {String(index + 1).padStart(2, '0')}</Badge>
          <CardTitle>{project.title}</CardTitle>
          <CardDescription>{project.subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="badge-row">
            {project.skills.map((skill) => (
              <Badge key={skill} variant="accent">{skill}</Badge>
            ))}
          </div>
          <ul className="detail-list">
            {project.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </Reveal>
  );
}

function App() {
  return (
    <ClickSpark sparkColor="rgba(10, 10, 10, 0.82)" sparkSize={16} sparkRadius={22} duration={420}>
      <div className="page">
        <main>
          <section id="intro" className="hero-section">
            <div className="hero-content">
              <Badge variant="accent" className="hero-badge">
                <Sparkles size={15} aria-hidden="true" />
                Enterprise CS · Product Builder
              </Badge>
              <TextType
                as="h1"
                className="hero-title hero-rise hero-rise-1"
                text={'안녕하세요,\n고객의 복잡한 일을\n기술과 제품 플로우로 바꾸는\n한지우입니다.'}
                typingSpeed={58}
                initialDelay={300}
                pauseDuration={1800}
                loop={false}
                showCursor
                cursorCharacter="|"
                cursorClassName="hero-cursor"
                cursorBlinkDuration={0.55}
                variableSpeed={{ min: 34, max: 86 }}
              />
              <p className="hero-rise hero-rise-2">
                Customer Success를 기반으로 기술 디스커버리, 구현 전략, 제품/엔지니어링 협업까지 연결합니다.
                고객이 겪는 모호한 문제를 실행 가능한 기술 계획과 운영 시스템으로 바꿉니다.
              </p>
            </div>
          </section>

          <section id="feature" className="section">
            <SectionHeading eyebrow="핵심 역량" title="고객의 문제를 듣고, 기술의 언어로 정리하고, 실행 가능한 시스템으로 만듭니다." />
            <div className="feature-grid">
              {features.map((feature) => (
                <FeatureCard feature={feature} key={feature.title} />
              ))}
            </div>
          </section>

          <section id="skill" className="section">
            <SectionHeading eyebrow="전문영역 및 스킬셋, Expertise & skillset" title="문제 해결을 위해 기술적 구현을 넘어 비즈니스 솔루션을 설계하고 실행합니다." />
            <Reveal>
              <SkillTabs />
            </Reveal>
          </section>

          <section id="career" className="section">
            <SectionHeading eyebrow="경력 사항" title="고객성공을 중심으로 기술과 제품 실행 경험을 쌓아왔습니다." />
            <div className="experience-list">
              {experiences.map((experience, index) => (
                <ExperienceEntry experience={experience} index={index} key={experience.company} />
              ))}
            </div>
          </section>

          <section id="project" className="section">
            <SectionHeading eyebrow="프로젝트 상세" title="주요 프로젝트의 세부 사항을 확인해보세요" />
            <div className="project-grid">
              {projectDetails.map((project, index) => (
                <ProjectCard project={project} index={index} key={project.title} />
              ))}
            </div>
          </section>

          <section id="contact" className="thanks-section">
            <h2>감사합니다</h2>
            <p>더 궁금한 점이 있다면 편하게 연락주세요</p>
            <div className="contact-links">
              <Button href="mailto:jiwoohan92@gmail.com" size="lg">
                <Mail size={18} aria-hidden="true" />
                이메일
              </Button>
              <Button href="https://www.linkedin.com/in/jiwoo-han-557289143/" size="lg" variant="secondary">
                LinkedIn
                <ArrowUpRight size={18} aria-hidden="true" />
              </Button>
            </div>
          </section>
        </main>
      </div>
    </ClickSpark>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
