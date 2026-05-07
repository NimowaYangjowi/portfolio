import { StrictMode, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { useTranslation } from 'react-i18next';
import './i18n';
import './styles.css';

type SupportedLanguage = 'ko' | 'en';

type TypedTextProps = {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'p' | 'span';
  delay?: number;
  speed?: number;
};

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
      { rootMargin: '0px 0px -20% 0px', threshold: 0.25 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

function TypedText({
  text,
  className = '',
  as: Component = 'p',
  delay = 0,
  speed = 26,
}: TypedTextProps) {
  const { ref, isVisible } = useInView<HTMLSpanElement>();
  const [visibleText, setVisibleText] = useState('');

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    if (prefersReducedMotion()) {
      setVisibleText(text);
      return;
    }

    let index = 0;
    let intervalId = 0;
    const timeoutId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        index += 1;
        setVisibleText(text.slice(0, index));

        if (index >= text.length) {
          window.clearInterval(intervalId);
        }
      }, speed);
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, [delay, isVisible, speed, text]);

  const isTyping = isVisible && visibleText.length < text.length && !prefersReducedMotion();

  return (
    <Component className={`typed-text ${className} ${isTyping ? 'is-typing' : ''}`}>
      <span ref={ref}>{visibleText || '\u00a0'}</span>
    </Component>
  );
}

function RevealBlock({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { ref, isVisible } = useInView<HTMLDivElement>();

  return (
    <div ref={ref} className={`reveal-block ${isVisible ? 'reveal-block-visible' : ''} ${className}`}>
      {children}
    </div>
  );
}

const content = {
  ko: {
    nav: ['소개', '흐름', '프로젝트', '연락'],
    languageLabel: '언어 전환',
    heroKicker: 'REDPRINT PORTFOLIO',
    heroTitle: '사용자가 만들고,\n구매하고,\n운영자가 검증하는\n마켓플레이스 시스템.',
    heroBody:
      '단순한 화면 구현이 아니라 등록, 업로드, 탐색, 결제, 정산, 운영 복구까지 이어지는 제품 흐름을 보여주는 포트폴리오입니다.',
    capabilitiesTitle: '핵심 구현 단위',
    capabilitiesBody:
      '각 섹션은 사용자가 실제로 보는 화면과 그 뒤에서 데이터를 지키는 구조를 함께 설명합니다.',
    capabilities: [
      ['01', '복구 가능한 등록 흐름', '긴 작성 과정에서 사용자가 입력한 내용을 잃지 않도록 draft와 업로드 상태를 관리합니다.'],
      ['02', '미디어 업로드 파이프라인', '이미지와 영상 파일이 준비됐는지 확인한 뒤 다음 단계로 넘기는 구조입니다.'],
      ['03', '결제와 정산 제어층', '구매, 판매자 정산, 운영자 검증이 같은 돈의 흐름 안에서 이어지게 만듭니다.'],
    ],
    flowTitle: '시스템 흐름',
    flowBody: '화면 하나씩 보여주는 대신 서비스가 움직이는 순서를 먼저 보여줍니다.',
    flow: ['Upload', 'Process', 'Explore', 'Checkout', 'Admin'],
    projectsTitle: '프로젝트 상세',
    projectsBody: '카드는 결과물이 아니라 해결한 문제를 기준으로 묶었습니다.',
    projects: [
      ['등록 위자드', 'multi-step workflow', '중간 저장, 업로드 준비 상태, 제출 전 검증을 하나의 사용자 흐름으로 묶었습니다.'],
      ['탐색 피드', 'adaptive marketplace layout', '상품 카드가 화면 크기에 맞춰 읽기 좋은 밀도로 배치되도록 설계했습니다.'],
      ['운영자 원장', 'ledger reconciliation', '운영자가 정산 상태와 이상 거래를 따라갈 수 있는 검증 화면을 만들었습니다.'],
      ['worker 복구', 'queue retry and heartbeat', '백그라운드 작업이 실패해도 다시 이어갈 수 있도록 상태를 추적합니다.'],
    ],
    contactTitle: '함께 제품을 끝까지 굴러가게 만들고 싶습니다.',
    contactBody: '화면의 첫인상부터 실패했을 때의 복구 흐름까지 챙기는 개발자로 보여주는 것이 목표입니다.',
  },
  en: {
    nav: ['Intro', 'Flow', 'Projects', 'Contact'],
    languageLabel: 'Switch language',
    heroKicker: 'REDPRINT PORTFOLIO',
    heroTitle: 'A marketplace system\nusers create,\nbuy,\nand operators verify.',
    heroBody:
      'A portfolio built around product flow: creation, upload, discovery, checkout, finance, admin review, and recovery.',
    capabilitiesTitle: 'Core Build Units',
    capabilitiesBody:
      'Each section connects the screen users see with the system behavior that protects the data behind it.',
    capabilities: [
      ['01', 'Recoverable creation flow', 'Draft state and upload readiness keep long submissions from falling apart.'],
      ['02', 'Media upload pipeline', 'Image and video assets are checked before users move into the next step.'],
      ['03', 'Payment and ledger layer', 'Purchase, seller payout, and admin review stay inside one money flow.'],
    ],
    flowTitle: 'System Flow',
    flowBody: 'Instead of showing isolated screens, the page shows how the service moves.',
    flow: ['Upload', 'Process', 'Explore', 'Checkout', 'Admin'],
    projectsTitle: 'Project Details',
    projectsBody: 'Cards are grouped by the problem solved, not by surface names.',
    projects: [
      ['Creation wizard', 'multi-step workflow', 'Draft saving, media readiness, and final validation work as one user path.'],
      ['Explore feed', 'adaptive marketplace layout', 'Marketplace cards stay readable across screen sizes and content density.'],
      ['Admin ledger', 'ledger reconciliation', 'Operators can trace payout status and suspicious entries from one review surface.'],
      ['Worker recovery', 'queue retry and heartbeat', 'Background jobs carry state so failed work can continue safely.'],
    ],
    contactTitle: 'I want to help build products that keep running.',
    contactBody: 'The goal is to show craft from the first impression to the recovery path after something fails.',
  },
} satisfies Record<SupportedLanguage, Record<string, unknown>>;

function PortfolioSkeleton() {
  const { i18n } = useTranslation();
  const currentLanguage: SupportedLanguage = i18n.resolvedLanguage === 'en' ? 'en' : 'ko';
  const pageText = content[currentLanguage];

  const navItems = pageText.nav as string[];
  const capabilities = pageText.capabilities as string[][];
  const flow = pageText.flow as string[];
  const projects = pageText.projects as string[][];

  const sectionIds = useMemo(() => ['intro', 'flow', 'projects', 'contact'], []);

  useEffect(() => {
    const hash = window.location.hash.slice(1);

    if (!hash) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ block: 'start' });
    }, 80);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const handleLanguageChange = (language: SupportedLanguage) => {
    void i18n.changeLanguage(language);
    window.localStorage.setItem('portfolio-language', language);
    document.documentElement.lang = language;
  };

  return (
    <div className="page-shell">
      <header className="top-bar">
        <a href="#intro" className="brand-mark" aria-label="Redprint portfolio home">
          RP
        </a>
        <div className="language-toggle" aria-label={pageText.languageLabel as string}>
          <button
            type="button"
            className={currentLanguage === 'ko' ? 'language-button language-button-active' : 'language-button'}
            onClick={() => handleLanguageChange('ko')}
            aria-pressed={currentLanguage === 'ko'}
          >
            KR
          </button>
          <button
            type="button"
            className={currentLanguage === 'en' ? 'language-button language-button-active' : 'language-button'}
            onClick={() => handleLanguageChange('en')}
            aria-pressed={currentLanguage === 'en'}
          >
            EN
          </button>
        </div>
      </header>

      <main>
        <section id="intro" className="hero-section content-section">
          <RevealBlock className="hero-stack">
            <span className="section-kicker">{pageText.heroKicker as string}</span>
            <TypedText as="h1" className="hero-title" text={pageText.heroTitle as string} speed={34} />
            <TypedText
              as="p"
              className="hero-copy"
              text={pageText.heroBody as string}
              delay={1100}
              speed={18}
            />
          </RevealBlock>
        </section>

        <section className="content-section capabilities-section">
          <RevealBlock className="section-heading">
            <TypedText as="h2" text={pageText.capabilitiesTitle as string} speed={32} />
            <TypedText as="p" text={pageText.capabilitiesBody as string} delay={500} speed={18} />
          </RevealBlock>

          <div className="capability-grid">
            {capabilities.map(([number, title, description], index) => (
              <RevealBlock key={title} className="capability-card">
                <span className="card-number">{number}</span>
                <TypedText as="h2" text={title} delay={index * 180} speed={24} />
                <TypedText as="p" text={description} delay={500 + index * 180} speed={14} />
              </RevealBlock>
            ))}
          </div>
        </section>

        <section id="flow" className="content-section flow-section">
          <RevealBlock className="section-heading">
            <TypedText as="h2" text={pageText.flowTitle as string} speed={32} />
            <TypedText as="p" text={pageText.flowBody as string} delay={450} speed={18} />
          </RevealBlock>

          <RevealBlock className="system-flow" aria-label={pageText.flowTitle as string}>
            {flow.map((step, index) => (
              <div className="flow-step" key={step}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{step}</strong>
              </div>
            ))}
          </RevealBlock>
        </section>

        <section id="projects" className="content-section projects-section">
          <RevealBlock className="section-heading">
            <TypedText as="h2" text={pageText.projectsTitle as string} speed={32} />
            <TypedText as="p" text={pageText.projectsBody as string} delay={450} speed={18} />
          </RevealBlock>

          <div className="project-grid">
            {projects.map(([title, meta, description], index) => (
              <RevealBlock key={title} className="project-card">
                <span className="project-meta">{meta}</span>
                <TypedText as="h2" text={title} delay={index * 120} speed={24} />
                <TypedText as="p" text={description} delay={500 + index * 120} speed={14} />
              </RevealBlock>
            ))}
          </div>
        </section>

        <section id="contact" className="content-section contact-section">
          <RevealBlock className="contact-panel">
            <TypedText as="h2" text={pageText.contactTitle as string} speed={28} />
            <TypedText as="p" text={pageText.contactBody as string} delay={700} speed={18} />
          </RevealBlock>
        </section>
      </main>

      <nav className="bottom-nav" aria-label="Portfolio sections">
        <span className="nav-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        {navItems.map((item, index) => (
          <a key={item} href={`#${sectionIds[index]}`}>
            {item}
          </a>
        ))}
      </nav>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PortfolioSkeleton />
  </StrictMode>,
);
