import { StrictMode, Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import type { CSSProperties, KeyboardEvent, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SiClerk,
  SiCloudflare,
  SiDrizzle,
  SiGooglecloud,
  SiHuggingface,
  SiMui,
  SiNextdotjs,
  SiPostgresql,
  SiRailway,
  SiReact,
  SiSentry,
  SiStripe,
  SiSupabase,
  SiTypescript,
  SiUpstash,
  SiVercel,
  SiVitest,
  SiZod,
} from 'react-icons/si';
import { Badge } from './components/ui/badge';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { ArrowUpRight, FlowerBadge, FlowerCluster, FlowerDaisy, FlowerFiveTraced, Mail } from './components/ui/icons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import ClickSpark from './components/ClickSpark';
import ImageTrail, { type ImageTrailItem } from './components/ImageTrail';
import LogoLoop, { type LogoItem } from './components/LogoLoop';
import thanksTeamPhoto from './assets/thanks-team-photo.jpg';
import {
  getCustomerSuccessCases,
  type CustomerCaseContentBlock,
  type CustomerCaseLink,
  type CustomerSuccessCase,
} from './customerSuccessCases';
import {
  getLanguageFromPathname,
  saveLanguagePreference,
  supportedLanguages,
  syncDocumentLanguage,
  syncLanguagePath,
  type SupportedLanguage,
} from './i18n';
import './styles.css';

const ProjectExcalidrawDiagram = lazy(() => import('./components/ProjectExcalidrawDiagram'));
const TechnicalCommunicationExcalidrawDiagram = lazy(
  () => import('./components/TechnicalCommunicationExcalidrawDiagram'),
);

type Feature = {
  title: string;
  description: string;
  iconLabel: string;
};

type SkillGroup = {
  id: string;
  title: string;
  skills: string[];
};

type ExperienceRole = {
  period: string;
  title: string;
  subtitle?: string;
  skills?: string[];
  details?: string[];
};

type Experience = {
  company: string;
  period: string;
  summary: string;
  roles: ExperienceRole[];
  details?: string[];
};

type ProjectDetail = {
  title: string;
  subtitle: string;
  skills: string[];
  details: string[];
  modal?: ProjectDetailModalContent;
};

type ProjectFlowStep = {
  title: string;
  description: string;
  kind: 'entry' | 'process' | 'decision' | 'recovery' | 'output';
};

type ProjectFlowNote = {
  title: string;
  description: string;
};

type ProjectDetailModalContent = {
  eyebrow: string;
  title: string;
  summary: string;
  diagramVariant?:
    | 'approvalAutomation'
    | 'mediaPipeline'
    | 'marketplaceFeed'
    | 'incidentAutomation'
    | 'redisTraffic'
    | 'workerPlatform';
  mermaidDefinition?: string;
  mainFlowLabel: string;
  recoveryFlowLabel: string;
  edgeLabels?: {
    ready: string;
    blocked: string;
    continue: string;
  };
  notesLabel: string;
  closeLabel: string;
  openLabel: string;
  steps: ProjectFlowStep[];
  recoverySteps: ProjectFlowStep[];
  notes: ProjectFlowNote[];
};

type RootElement = HTMLElement & {
  _portfolioRoot?: Root;
};

type SectionCopy = {
  eyebrow: string;
  title: string;
};

type PortfolioContent = {
  heroTitle: string;
  heroDescription: string;
  sections: {
    feature: SectionCopy;
    skill: SectionCopy;
    career: SectionCopy;
    customerCase: SectionCopy;
    project: SectionCopy;
  };
  thanks: {
    title: string;
    description: string;
    photoAlt: string;
  };
  features: Feature[];
  skillGroups: SkillGroup[];
  experiences: Experience[];
  projectDetails: ProjectDetail[];
};

type HeroTrailFlowerItem = Extract<ImageTrailItem, { icon: string }>;

const heroTrailIcons = ['daisy', 'burst', 'badge', 'cluster'] as const;
const heroTrailColors = [
  'rgb(var(--brand-coral-rgb))',
  'rgb(var(--brand-blue-rgb))',
  'rgb(var(--brand-aura-pink-rgb))',
  'rgb(var(--brand-peach-rgb))',
  'rgb(var(--brand-mint-rgb))',
] as const;
const heroTrailRotations = [-18, 10, -8, 22, -24, 14, -12, 18, -6, 26] as const;

const heroTrailItems: HeroTrailFlowerItem[] = heroTrailIcons.flatMap((icon, iconIndex) =>
  heroTrailColors.map<HeroTrailFlowerItem>((color, colorIndex) => ({
    icon,
    color,
    rotation: heroTrailRotations[(iconIndex * heroTrailColors.length + colorIndex) % heroTrailRotations.length],
  })),
);

const fullStackFeatureTitles = new Set(['풀스택 프로젝트 빌딩', 'Full-stack Project Building']);
const technicalCommunicationFeatureTitles = new Set(['기술 커뮤니케이션', 'Technical Communication']);
const customerSuccessFeatureTitles = new Set(['고객성공', 'Customer Success']);

const redprintLogoRowPrimary: LogoItem[] = [
  { node: <SiNextdotjs style={{ color: '#000000' }} />, title: 'Next.js' },
  { node: <SiReact style={{ color: '#61dafb' }} />, title: 'React' },
  { node: <SiTypescript style={{ color: '#3178c6' }} />, title: 'TypeScript' },
  { node: <SiMui style={{ color: '#007fff' }} />, title: 'MUI' },
  { node: <SiPostgresql style={{ color: '#4169e1' }} />, title: 'PostgreSQL' },
  { node: <SiDrizzle style={{ color: '#c5f74f' }} />, title: 'Drizzle ORM' },
  { node: <SiClerk style={{ color: '#6c47ff' }} />, title: 'Clerk' },
  { node: <SiZod style={{ color: '#3068b7' }} />, title: 'Zod' },
  { node: <SiSupabase style={{ color: '#3ecf8e' }} />, title: 'Supabase' },
];

const redprintLogoRowSecondary: LogoItem[] = [
  { node: <SiStripe style={{ color: '#635bff' }} />, title: 'Stripe' },
  { node: <SiCloudflare style={{ color: '#f38020' }} />, title: 'Cloudflare R2' },
  { node: <SiRailway style={{ color: '#0b0d0e' }} />, title: 'Railway' },
  { node: <SiUpstash style={{ color: '#00e9a3' }} />, title: 'Upstash Redis' },
  { node: <SiSentry style={{ color: '#fb4226' }} />, title: 'Sentry' },
  { node: <SiVercel style={{ color: '#000000' }} />, title: 'Vercel' },
  { node: <SiVitest style={{ color: '#6e9f18' }} />, title: 'Vitest' },
  { node: <SiGooglecloud style={{ color: '#4285f4' }} />, title: 'Google Cloud Run' },
  { node: <SiHuggingface style={{ color: '#ffcc4d' }} />, title: 'Hugging Face' },
];

function getSupportedLanguage(language?: string): SupportedLanguage {
  const normalizedLanguage = language?.split('-')[0] as SupportedLanguage | undefined;

  return normalizedLanguage && supportedLanguages.includes(normalizedLanguage)
    ? normalizedLanguage
    : 'ko';
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <Reveal className="section-heading">
      <p className="section-eyebrow">{eyebrow}</p>
      {title ? <h2 className="section-title">{title}</h2> : null}
    </Reveal>
  );
}

function renderHeroTitle(title: string) {
  const accentText = '한지우';
  const accentStart = title.indexOf(accentText);

  if (accentStart === -1) {
    return title;
  }

  return (
    <>
      {title.slice(0, accentStart)}
      <span className="hero-title-accent">{accentText}</span>
      {title.slice(accentStart + accentText.length)}
    </>
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

function FullStackLogoFlow() {
  return (
    <div className="fullstack-logo-flow">
      <div className="fullstack-logo-flow-track fullstack-logo-flow-track-primary">
        <LogoLoop
          logos={redprintLogoRowPrimary}
          speed={44}
          direction="left"
          logoHeight={42}
          gap={16}
          hoverSpeed={8}
          fadeOut
          fadeOutColor="#1a3a3a"
          scaleOnHover
          ariaLabel="Redprint primary technology stack logos"
        />
      </div>
      <div className="fullstack-logo-flow-track fullstack-logo-flow-track-secondary">
        <LogoLoop
          logos={redprintLogoRowSecondary}
          speed={38}
          direction="right"
          logoHeight={42}
          gap={16}
          hoverSpeed={8}
          fadeOut
          fadeOutColor="#1a3a3a"
          scaleOnHover
          ariaLabel="Redprint infrastructure and operations technology stack logos"
        />
      </div>
    </div>
  );
}

function CustomerSuccessVisual() {
  const journeySteps = [
    'onboarding',
    'training',
    'feature adoption',
    'business review',
    'opps discovery',
    'issue escalation',
    'trouble shooting',
  ];
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % journeySteps.length);
    }, 1450);

    return () => window.clearInterval(intervalId);
  }, [journeySteps.length]);

  return (
    <div className="customer-wheel-visual">
      <span className="customer-wheel-axis" />
      <div className="customer-wheel-orbit">
        {journeySteps.map((step, index) => (
          <span
            className={`customer-wheel-card customer-wheel-card-position-${
              normalizeWheelOffset(index, activeIndex, journeySteps.length) + 3
            }`}
            data-active={index === activeIndex}
            key={step}
            style={
              {
                zIndex: 10 - Math.abs(normalizeWheelOffset(index, activeIndex, journeySteps.length)),
              } as CSSProperties
            }
          >
            <span className="customer-wheel-card-label">{step}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function normalizeWheelOffset(index: number, activeIndex: number, length: number) {
  let offset = index - activeIndex;
  const halfLength = Math.floor(length / 2);

  if (offset > halfLength) {
    offset -= length;
  }

  if (offset < -halfLength) {
    offset += length;
  }

  return offset;
}

function TechnicalCommunicationVisual() {
  const { ref, isVisible } = useInView<HTMLDivElement>();

  return (
    <div ref={ref} className="technical-communication-shell">
      {isVisible ? (
        <Suspense fallback={<div className="technical-communication-state">Drawing diagram...</div>}>
          <TechnicalCommunicationExcalidrawDiagram />
        </Suspense>
      ) : (
        <div className="technical-communication-state">Drawing diagram...</div>
      )}
    </div>
  );
}

function FeatureCard({ feature }: { feature: Feature }) {
  const hasLogoFlow = fullStackFeatureTitles.has(feature.title);
  const hasTechnicalCommunicationVisual = technicalCommunicationFeatureTitles.has(feature.title);
  const hasCustomerSuccessVisual = customerSuccessFeatureTitles.has(feature.title);

  return (
    <Reveal>
      <Card className="feature-card">
        {hasLogoFlow ? (
          <div className="feature-visual feature-visual-logo-flow">
            <FullStackLogoFlow />
          </div>
        ) : hasTechnicalCommunicationVisual ? (
          <div className="feature-visual feature-visual-handoff" aria-hidden="true">
            <TechnicalCommunicationVisual />
          </div>
        ) : hasCustomerSuccessVisual ? (
          <div className="feature-visual feature-visual-customer" aria-hidden="true">
            <CustomerSuccessVisual />
          </div>
        ) : (
          <div className="feature-visual" aria-hidden="true">
            <span>{feature.iconLabel}</span>
          </div>
        )}
        <CardHeader>
          <div className="feature-title-row">
            <FlowerBadge className="feature-title-icon" size={22} />
            <CardTitle>{feature.title}</CardTitle>
          </div>
          <CardDescription>{feature.description}</CardDescription>
        </CardHeader>
      </Card>
    </Reveal>
  );
}

function SkillBadge({ label }: { label: string }) {
  return (
    <Badge className="skill-badge" variant="accent">
      {label}
    </Badge>
  );
}

function ProjectFlowStepList({ steps }: { steps: ProjectFlowStep[] }) {
  return (
    <ol className="project-flow-list">
      {steps.map((step, index) => (
        <li className={`project-flow-step project-flow-step-${step.kind}`} key={`${step.title}-${index}`}>
          <span className="project-flow-step-index">{String(index + 1).padStart(2, '0')}</span>
          <div>
            <h5>{step.title}</h5>
            <p>{step.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function CustomerSuccessCaseCard({
  customerCase,
  onOpen,
}: {
  customerCase: CustomerSuccessCase;
  onOpen?: () => void;
}) {
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!onOpen || (event.key !== 'Enter' && event.key !== ' ')) {
      return;
    }

    event.preventDefault();
    onOpen();
  };

  return (
    <Reveal>
      <Card
        className={customerCase.modal ? 'customer-case-card customer-case-card-clickable' : 'customer-case-card'}
        role={onOpen ? 'button' : undefined}
        tabIndex={onOpen ? 0 : undefined}
        onClick={onOpen}
        onKeyDown={handleKeyDown}
      >
        <CardHeader>
          <div className="customer-case-title-row">
            <FlowerBadge className="customer-case-title-icon" size={22} />
            <div>
              <p className="customer-case-focus">{customerCase.focus}</p>
              <CardTitle>{customerCase.title}</CardTitle>
            </div>
          </div>
          <CardDescription>{customerCase.customerContext}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="badge-row">
            {customerCase.skills.map((skill) => (
              <Badge key={skill} variant="accent">{skill}</Badge>
            ))}
          </div>
          <ul className="detail-list customer-case-detail-list">
            {customerCase.contribution.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
          <p className="customer-case-outcome">{customerCase.outcome}</p>
          {customerCase.modal ? <span className="customer-case-card-action">{customerCase.modal.openLabel}</span> : null}
        </CardContent>
      </Card>
    </Reveal>
  );
}

function CustomerCaseContent({ blocks }: { blocks: CustomerCaseContentBlock[] }) {
  const renderLinkedText = (text: string, links?: CustomerCaseLink[]) => {
    if (!links?.length) {
      return text;
    }

    const nodes: ReactNode[] = [];
    let cursor = 0;

    links.forEach((link, index) => {
      const startIndex = text.indexOf(link.text, cursor);

      if (startIndex === -1) {
        return;
      }

      if (startIndex > cursor) {
        nodes.push(text.slice(cursor, startIndex));
      }

      nodes.push(
        <a
          className="customer-case-source-link"
          href={link.href}
          key={`${link.href}-${index}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {link.text}
        </a>,
      );

      cursor = startIndex + link.text.length;
    });

    nodes.push(text.slice(cursor));

    return nodes;
  };

  return (
    <section className="customer-case-source-content">
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;

        if (block.type === 'heading') {
          const HeadingTag = block.level === 2 ? 'h4' : 'h5';

          return <HeadingTag key={key}>{block.text}</HeadingTag>;
        }

        if (block.type === 'paragraph') {
          return <p key={key}>{renderLinkedText(block.text, block.links)}</p>;
        }

        if (block.type === 'image') {
          return (
            <figure className="customer-case-source-image" key={key}>
              <img src={block.src} alt={block.alt} loading="lazy" decoding="async" />
              {block.caption ? <figcaption>{block.caption}</figcaption> : null}
            </figure>
          );
        }

        const ListTag = block.style === 'number' ? 'ol' : 'ul';

        return (
          <ListTag className="customer-case-source-list" key={key}>
            {block.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ListTag>
        );
      })}
    </section>
  );
}

function CustomerSuccessCaseModal({
  customerCase,
  onClose,
}: {
  customerCase: CustomerSuccessCase;
  onClose: () => void;
}) {
  const { modal } = customerCase;

  useEffect(() => {
    document.body.classList.add('modal-open');

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.classList.remove('modal-open');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="project-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        className="project-modal customer-case-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="customer-case-modal-title"
      >
        <div className="project-modal-header">
          <div>
            <p className="project-modal-eyebrow">{modal.eyebrow}</p>
            <h3 id="customer-case-modal-title">{modal.title}</h3>
          </div>
          <button type="button" className="project-modal-close" onClick={onClose}>
            {modal.closeLabel}
          </button>
        </div>

        <div className="project-modal-body customer-case-modal-body">
          <p className="project-modal-summary">{modal.summary}</p>
          <CustomerCaseContent blocks={modal.contentBlocks} />
        </div>
      </section>
    </div>
  );
}

function LanguageToggle() {
  const { i18n, t } = useTranslation();
  const currentLanguage = getSupportedLanguage(i18n.resolvedLanguage ?? i18n.language);

  const handleLanguageChange = (language: SupportedLanguage) => {
    void i18n.changeLanguage(language);
    saveLanguagePreference(language);
    syncDocumentLanguage(language);
    syncLanguagePath(language);
  };

  return (
    <div
      className="language-toggle"
      role="group"
      aria-label={t('languageToggleLabel')}
    >
      {supportedLanguages.map((language) => (
        <button
          type="button"
          className={
            currentLanguage === language
              ? 'language-button language-button-active'
              : 'language-button'
          }
          key={language}
          onClick={() => handleLanguageChange(language)}
          aria-pressed={currentLanguage === language}
        >
          {t(language === 'ko' ? 'languageOptionKo' : 'languageOptionEn')}
        </button>
      ))}
    </div>
  );
}

function SkillTabs({ skillGroups }: { skillGroups: SkillGroup[] }) {
  const { t } = useTranslation();

  return (
    <Tabs defaultValue={skillGroups[0]?.id} className="skill-tabs">
      <TabsList aria-label={t('skillCategoriesLabel')}>
        {skillGroups.map((group) => (
          <TabsTrigger key={group.id} value={group.id}>{group.title}</TabsTrigger>
        ))}
      </TabsList>
      {skillGroups.map((group) => (
        <TabsContent key={group.id} value={group.id}>
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

function ExperienceEntry({ experience }: { experience: Experience }) {
  const { t } = useTranslation();

  return (
    <Reveal className="experience-entry">
      <span className="experience-marker" aria-hidden="true">
        <FlowerCluster size={24} />
      </span>
      <div className="experience-body">
        <div className="experience-company-row">
          <div>
            <p className="experience-period">{experience.period}</p>
            <h3 className="experience-company">{experience.company}</h3>
          </div>
          <Badge variant="outline">{t('experienceBadge')}</Badge>
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
              {role.skills?.length ? (
                <div className="badge-row">
                  {role.skills.map((skill) => (
                    <Badge key={skill} variant="default">{skill}</Badge>
                  ))}
                </div>
              ) : null}
              {role.details?.length ? (
                <ul className="detail-list experience-detail-list">
                  {role.details.map((detail) => (
                    <li key={detail}>
                      <FlowerFiveTraced className="experience-bullet-icon" size={13} />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
        {experience.details?.length ? (
          <ul className="detail-list experience-detail-list experience-shared-detail-list">
            {experience.details.map((detail) => (
              <li key={detail}>
                <FlowerFiveTraced className="experience-bullet-icon" size={13} />
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </Reveal>
  );
}

function ProjectDetailModal({ project, onClose }: { project: ProjectDetail; onClose: () => void }) {
  const modal = project.modal;
  const loadingLabel = modal?.closeLabel === '닫기' ? 'Flowchart를 그리고 있습니다...' : 'Drawing flowchart...';
  const isKorean = modal?.closeLabel === '닫기';

  useEffect(() => {
    document.body.classList.add('modal-open');

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.classList.remove('modal-open');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!modal) {
    return null;
  }

  return (
    <div
      className="project-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        className="project-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
      >
        <div className="project-modal-header">
          <div>
            <p className="project-modal-eyebrow">{modal.eyebrow}</p>
            <h3 id="project-modal-title">{modal.title}</h3>
          </div>
          <button type="button" className="project-modal-close" onClick={onClose}>
            {modal.closeLabel}
          </button>
        </div>

        <div className="project-modal-body">
          <p className="project-modal-summary">{modal.summary}</p>

          <section className="project-diagram-section">
            <h4>{`${modal.mainFlowLabel} · ${modal.recoveryFlowLabel}`}</h4>
            <Suspense fallback={<div className="project-excalidraw-state">{loadingLabel}</div>}>
              <ProjectExcalidrawDiagram
                diagramVariant={modal.diagramVariant}
                language={isKorean ? 'ko' : 'en'}
                mermaidDefinition={modal.mermaidDefinition}
                mainFlowLabel={modal.mainFlowLabel}
                recoveryFlowLabel={modal.recoveryFlowLabel}
                edgeLabels={modal.edgeLabels}
                steps={modal.steps}
                recoverySteps={modal.recoverySteps}
              />
            </Suspense>
          </section>

          <section className="project-flow-details">
            <h4>{isKorean ? '상세 구현 흐름' : 'Detailed implementation flow'}</h4>
            <div className="project-flow-detail-grid">
              <article className="project-flow-column">
                <h5>{modal.mainFlowLabel}</h5>
                <ProjectFlowStepList steps={modal.steps} />
              </article>
              <article className="project-flow-column">
                <h5>{modal.recoveryFlowLabel}</h5>
                <ProjectFlowStepList steps={modal.recoverySteps} />
              </article>
            </div>
          </section>

          <section className="project-modal-notes">
            <h4>{modal.notesLabel}</h4>
            <div className="project-modal-note-grid">
              {modal.notes.map((note) => (
                <article className="project-modal-note" key={note.title}>
                  <h5>{note.title}</h5>
                  <p>{note.description}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

function ProjectCard({ project, onOpen }: { project: ProjectDetail; onOpen?: () => void }) {
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!onOpen || (event.key !== 'Enter' && event.key !== ' ')) {
      return;
    }

    event.preventDefault();
    onOpen();
  };

  return (
    <Reveal>
      <Card
        className={project.modal ? 'project-card project-card-clickable' : 'project-card'}
        role={onOpen ? 'button' : undefined}
        tabIndex={onOpen ? 0 : undefined}
        onClick={onOpen}
        onKeyDown={handleKeyDown}
      >
        <CardHeader>
          <div className="project-title-row">
            <FlowerDaisy className="project-title-icon" size={24} />
            <CardTitle>{project.title}</CardTitle>
          </div>
          <CardDescription>{project.subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="detail-list">
            {project.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
          {project.modal ? <span className="project-card-action">{project.modal.openLabel}</span> : null}
        </CardContent>
      </Card>
    </Reveal>
  );
}

function App() {
  const { i18n, t } = useTranslation();
  const content = t('content', { returnObjects: true }) as PortfolioContent;
  const currentLanguage = getSupportedLanguage(i18n.resolvedLanguage ?? i18n.language);
  const customerSuccessCases = useMemo(
    () => getCustomerSuccessCases(currentLanguage),
    [currentLanguage],
  );
  const [selectedProject, setSelectedProject] = useState<ProjectDetail | null>(null);
  const [selectedCustomerCaseId, setSelectedCustomerCaseId] = useState<string | null>(null);
  const selectedCustomerCase =
    customerSuccessCases.find((customerCase) => customerCase.id === selectedCustomerCaseId) ?? null;

  useEffect(() => {
    syncLanguagePath(currentLanguage, true);

    const handlePopState = () => {
      const pathLanguage = getLanguageFromPathname(window.location.pathname);

      if (!pathLanguage) {
        return;
      }

      void i18n.changeLanguage(pathLanguage);
      saveLanguagePreference(pathLanguage);
      syncDocumentLanguage(pathLanguage);
    };

    window.addEventListener('popstate', handlePopState);

    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentLanguage, i18n]);

  return (
    <ClickSpark
      flowerItems={heroTrailItems}
      sparkSize={82}
      sparkCount={1}
      duration={1020}
    >
      <LanguageToggle />
      <div className="page">
          <main>
            <section id="intro" className="hero-section">
              <div className="hero-image-trail" aria-hidden="true">
                <ImageTrail
                  items={heroTrailItems}
                  variant={9}
                  initialRevealCount={3}
                  initialRevealWindow={500}
                />
              </div>
              <div className="hero-content">
                <h1 key={currentLanguage} className="hero-title hero-rise hero-rise-1">
                  {renderHeroTitle(content.heroTitle)}
                </h1>
                <p className="hero-rise hero-rise-2">
                  {content.heroDescription}
                </p>
              </div>
            </section>

            <section id="feature" className="section">
              <SectionHeading eyebrow={content.sections.feature.eyebrow} title={content.sections.feature.title} />
              <div className="feature-grid">
                {content.features.map((feature) => (
                  <FeatureCard feature={feature} key={feature.title} />
                ))}
              </div>
            </section>

            <section id="skill" className="section">
              <SectionHeading eyebrow={content.sections.skill.eyebrow} title={content.sections.skill.title} />
              <Reveal>
                <SkillTabs skillGroups={content.skillGroups} />
              </Reveal>
            </section>

            <section id="career" className="section">
              <SectionHeading eyebrow={content.sections.career.eyebrow} title={content.sections.career.title} />
              <div className="experience-list">
                {content.experiences.map((experience) => (
                  <ExperienceEntry experience={experience} key={experience.company} />
                ))}
              </div>
            </section>

            <section id="customer-success-cases" className="section customer-case-section">
              <SectionHeading
                eyebrow={content.sections.customerCase.eyebrow}
                title={content.sections.customerCase.title}
              />
              <div className="customer-case-grid">
                {customerSuccessCases.map((customerCase) => (
                  <CustomerSuccessCaseCard
                    customerCase={customerCase}
                    key={customerCase.id}
                    onOpen={customerCase.modal ? () => setSelectedCustomerCaseId(customerCase.id) : undefined}
                  />
                ))}
              </div>
            </section>

            <section id="project" className="section">
              <SectionHeading eyebrow={content.sections.project.eyebrow} title={content.sections.project.title} />
              <div className="project-grid">
                {content.projectDetails.map((project) => (
                  <ProjectCard
                    project={project}
                    key={project.title}
                    onOpen={project.modal ? () => setSelectedProject(project) : undefined}
                  />
                ))}
              </div>
            </section>

            <section id="contact" className="thanks-section">
              <img
                className="thanks-photo"
                src={thanksTeamPhoto}
                alt={content.thanks.photoAlt}
                width={1600}
                height={1200}
                loading="lazy"
                decoding="async"
              />
              <h2>{content.thanks.title}</h2>
              <p>{content.thanks.description}</p>
              <div className="contact-links">
                <Button href="mailto:jiwoohan92@gmail.com" size="lg">
                  <Mail size={18} aria-hidden="true" />
                  {t('contactEmailLabel')}
                </Button>
                <Button href="https://www.linkedin.com/in/jiwoo-han-557289143/" size="lg" variant="secondary">
                  LinkedIn
                  <ArrowUpRight size={18} aria-hidden="true" />
                </Button>
              </div>
            </section>
          </main>
        </div>
        {selectedProject?.modal ? (
          <ProjectDetailModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        ) : null}
        {selectedCustomerCase?.modal ? (
          <CustomerSuccessCaseModal
            customerCase={selectedCustomerCase}
            onClose={() => setSelectedCustomerCaseId(null)}
          />
        ) : null}
      </ClickSpark>
  );
}

const rootElement = document.getElementById('root') as RootElement | null;

if (!rootElement) {
  throw new Error('Root element not found');
}

const root = rootElement._portfolioRoot ?? createRoot(rootElement);
rootElement._portfolioRoot = root;

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
