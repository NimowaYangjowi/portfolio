import { StrictMode, useEffect, useRef, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import type { MouseEvent as ReactMouseEvent, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from './components/ui/badge';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { ArrowUpRight, FlowerBadge, FlowerCluster, FlowerDaisy, FlowerFiveTraced, Mail } from './components/ui/icons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import ClickSpark from './components/ClickSpark';
import {
  getLanguageFromPathname,
  saveLanguagePreference,
  supportedLanguages,
  syncDocumentLanguage,
  syncLanguagePath,
  type SupportedLanguage,
} from './i18n';
import './styles.css';

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
    project: SectionCopy;
  };
  thanks: {
    title: string;
    description: string;
  };
  features: Feature[];
  skillGroups: SkillGroup[];
  experiences: Experience[];
  projectDetails: ProjectDetail[];
};

function getSupportedLanguage(language?: string): SupportedLanguage {
  const normalizedLanguage = language?.split('-')[0] as SupportedLanguage | undefined;

  return normalizedLanguage && supportedLanguages.includes(normalizedLanguage)
    ? normalizedLanguage
    : 'ko';
}

function shouldCreatePageSpark(event: ReactMouseEvent<HTMLDivElement>) {
  const target = event.target instanceof Element ? event.target : null;

  if (target?.closest('.language-toggle')) {
    return false;
  }

  const languageToggle = document.querySelector<HTMLElement>('.language-toggle');

  if (!languageToggle) {
    return true;
  }

  const rect = languageToggle.getBoundingClientRect();
  const safeZonePadding = 72;
  const safeZoneLeft = Math.max(0, rect.left - safeZonePadding);
  const safeZoneRight = Math.min(window.innerWidth, rect.right + safeZonePadding);
  const safeZoneBottom = rect.bottom + safeZonePadding;

  const isInsideLanguageSafeZone =
    event.clientX >= safeZoneLeft &&
    event.clientX <= safeZoneRight &&
    event.clientY <= safeZoneBottom;

  return !isInsideLanguageSafeZone;
}

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
      <span className="skill-icon" aria-hidden="true">{label.slice(0, 2).toUpperCase()}</span>
      {label}
    </Badge>
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
      onClick={(event) => event.stopPropagation()}
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

function ProjectCard({ project }: { project: ProjectDetail }) {
  return (
    <Reveal>
      <Card className="project-card">
        <CardHeader>
          <div className="project-title-row">
            <FlowerDaisy className="project-title-icon" size={24} />
            <CardTitle>{project.title}</CardTitle>
          </div>
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
  const { i18n, t } = useTranslation();
  const content = t('content', { returnObjects: true }) as PortfolioContent;
  const currentLanguage = getSupportedLanguage(i18n.resolvedLanguage ?? i18n.language);

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
    <>
      <LanguageToggle />
      <ClickSpark
        sparkColor="rgba(10, 10, 10, 0.82)"
        sparkSize={16}
        sparkRadius={22}
        duration={420}
        shouldSpark={shouldCreatePageSpark}
      >
        <div className="page">
          <main>
            <section id="intro" className="hero-section">
              <div className="hero-content">
                <h1 key={currentLanguage} className="hero-title hero-rise hero-rise-1">
                  {content.heroTitle}
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

            <section id="project" className="section">
              <SectionHeading eyebrow={content.sections.project.eyebrow} title={content.sections.project.title} />
              <div className="project-grid">
                {content.projectDetails.map((project) => (
                  <ProjectCard project={project} key={project.title} />
                ))}
              </div>
            </section>

            <section id="contact" className="thanks-section">
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
      </ClickSpark>
    </>
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
