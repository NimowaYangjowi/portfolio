import { StrictMode, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { useTranslation } from 'react-i18next';
import './i18n';
import './styles.css';

type SupportedLanguage = 'ko' | 'en';

type Pillar = {
  label: string;
  title: string;
  description: string;
};

type CaseStudy = {
  title: string;
  meta: string;
  description: string;
  points: string[];
};

type BuildItem = {
  number: string;
  title: string;
  detail: string;
  impact: string;
};

type OperationItem = {
  title: string;
  description: string;
};

type PageContent = {
  languageLabel: string;
  heroTitle: string;
  heroBody: string;
  heroTags: string[];
  pillarsTitle: string;
  pillarsBody: string;
  pillars: Pillar[];
  casesTitle: string;
  casesBody: string;
  cases: CaseStudy[];
  buildTitle: string;
  buildBody: string;
  flow: string[];
  buildItems: BuildItem[];
  operationsTitle: string;
  operationsBody: string;
  operations: OperationItem[];
  contactTitle: string;
  contactBody: string;
};

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
    languageLabel: '언어 전환',
    heroTitle: '고객의 복잡한 일을\n기술과 제품 흐름으로 바꾸는\n한지우입니다.',
    heroBody:
      'API, 데이터, 운영 정책, 화면을 한 흐름으로 묶어 고객이 바로 쓸 수 있는 도구를 만듭니다.',
    heroTags: ['Technical Operator', 'Customer Success', 'Product Builder'],
    pillarsTitle: '강점은 세 갈래로 보입니다',
    pillarsBody:
      '기술을 이해하고, 고객의 업무를 읽고, 실제 제품으로 옮긴 경험을 한 화면에 담았습니다.',
    pillars: [
      {
        label: '01',
        title: '기술 커뮤니케이션',
        description:
          'API와 SDK 개발, 여러 플랫폼 연동 과정에서 각 부서의 기술 요구사항을 파악하고 내부/외부 커뮤니케이션이 매끄럽게 이어지도록 조율합니다.',
      },
      {
        label: '02',
        title: '고객성공',
        description:
          '고객의 문제를 파악하고 상황에 맞는 솔루션을 제시합니다. 기술 이슈를 쉬운 언어로 설명하며, 필요할 때는 커스텀 솔루션을 직접 제작해 제공합니다.',
      },
      {
        label: '03',
        title: '풀스택 프로젝트 빌딩',
        description:
          '프론트엔드, 백엔드, 데이터베이스를 아우르는 풀스택 프로젝트를 설계하고 운영했습니다. 배포, 스토리지, 결제, 분산락, rate limiting, 에러 대응 자동화, worker failover까지 직접 구축했습니다.',
      },
    ],
    casesTitle: '고객의 일을 실행 가능한 기술 과제로 바꾼 사례',
    casesBody:
      '고객성공 경험은 계정 관리에 머물지 않습니다. 업무 발견, 기술 번역, 릴리즈 영향 관리까지 다룹니다.',
    cases: [
      {
        title: 'Samsung 글로벌 운영',
        meta: '30+ offices',
        description: 'HQ, 지역 CSM, product, engineering 사이에서 요구사항과 release impact를 맞췄습니다.',
        points: ['글로벌 이해관계자 정렬', '파트너/플랫폼 요구사항 정리', '릴리즈 영향 관리'],
      },
      {
        title: 'OneLink Management Console',
        meta: 'API workflow',
        description: '비개발자 마케팅 운영자가 복잡한 링크 create/update/get/delete 작업을 안전하게 처리할 수 있도록 만든 콘솔입니다.',
        points: ['API-heavy 업무 단순화', '운영자 실수 감소', '내부 도구 제품화'],
      },
      {
        title: 'S2S Event Guide',
        meta: 'data mapping',
        description: '공식 문서와 고객 데이터 구조 사이에 남는 빈칸을 mapping, 전송 조건, 실패 처리 기준으로 채운 가이드입니다.',
        points: ['AFID-CUID mapping', '전송 조건 정의', '보안/모니터링 기준'],
      },
    ],
    buildTitle: '실제로 굴러가는 제품',
    buildBody:
      'Redprint는 화면만 만든 프로젝트가 아닙니다. 등록, 업로드, 탐색, 결제, 정산, 운영 복구가 이어지는 마켓플레이스 시스템입니다.',
    flow: ['Upload', 'Process', 'Explore', 'Checkout', 'Admin', 'Recover'],
    buildItems: [
      {
        number: '01',
        title: '복구 가능한 등록 흐름',
        detail: 'multi-step workflow, draft persistence, media readiness gate',
        impact: '긴 제출 과정에서도 사용자가 작성한 내용이 사라지지 않습니다.',
      },
      {
        number: '02',
        title: '대용량 미디어 파이프라인',
        detail: 'R2 presigned upload, verification, queue orchestration',
        impact: '무거운 파일도 서버를 막지 않고 안정적으로 처리합니다.',
      },
      {
        number: '03',
        title: '결제부터 정산까지의 돈 흐름',
        detail: 'Stripe webhook, ledger posting, idempotency guard',
        impact: '구매자, 판매자, 운영자가 돈의 상태를 같은 기준으로 봅니다.',
      },
      {
        number: '04',
        title: 'Worker 복구 시스템',
        detail: 'queue, lease, retry, heartbeat, failover',
        impact: '사용자가 화면을 떠나도 오래 걸리는 작업을 이어갑니다.',
      },
    ],
    operationsTitle: '운영자가 직접 판단하는 구조',
    operationsBody:
      '운영은 admin page만 뜻하지 않습니다. 고객 업무를 API, 데이터, 정책, 조치 화면으로 바꾸는 일도 포함합니다.',
    operations: [
      {
        title: 'Customer-facing Operations',
        description: '고객의 업무 흐름을 듣고 API/data mapping, 실행 조건, 실패 처리 기준으로 바꿉니다.',
      },
      {
        title: 'Admin Operations Hub',
        description: '심사, 정산, 지원, 스토리지, worker 상태를 운영자가 직접 확인하고 조치하는 조종석입니다.',
      },
      {
        title: 'Worker Operations Plane',
        description: '미디어 처리, 결제 복구, 정산 예약, cleanup을 화면 밖에서 이어가는 백그라운드 구조입니다.',
      },
    ],
    contactTitle: '고객 문제를 끝까지 굴러가는 시스템으로 만들고 싶습니다.',
    contactBody:
      '기술 구조, 고객 맥락, 운영 복구까지 함께 보는 사람으로 읽히는 포트폴리오를 만들고 있습니다.',
  },
  en: {
    languageLabel: 'Switch language',
    heroTitle: 'I turn customer workflows\ninto technical systems\nthat keep running.',
    heroBody:
      'I connect APIs, data, operating policy, and product surfaces into tools people can actually use.',
    heroTags: ['Technical Operator', 'Customer Success', 'Product Builder'],
    pillarsTitle: 'Three Proof Pillars',
    pillarsBody:
      'The page is built to show technical depth, customer-facing judgment, and real product building at the same time.',
    pillars: [
      {
        label: '01',
        title: 'Technical Knowledge',
        description: 'I break API, SDK, data, payment, ledger, and worker behavior into executable requirements.',
      },
      {
        label: '02',
        title: 'Customer Success',
        description: 'I uncover hidden customer workflows and align global stakeholders around execution conditions.',
      },
      {
        label: '03',
        title: 'Product Building',
        description: 'I turn requirements into internal consoles, implementation guides, and working product flows.',
      },
    ],
    casesTitle: 'Customer Problems Turned Into Technical Execution',
    casesBody:
      'Customer success is framed as workflow discovery, technical translation, and rollout impact management.',
    cases: [
      {
        title: 'Samsung Global Operations',
        meta: '30+ offices',
        description: 'Aligned HQ, regional CSMs, product, and engineering around requirements and release impact.',
        points: ['Global stakeholder alignment', 'Partner/platform requirements', 'Release impact management'],
      },
      {
        title: 'OneLink Management Console',
        meta: 'API workflow',
        description: 'A console for non-developer marketing operators to safely create, update, get, and delete links.',
        points: ['Simplified API-heavy work', 'Reduced operator error', 'Productized internal tooling'],
      },
      {
        title: 'S2S Event Guide',
        meta: 'data mapping',
        description: 'Bridged official docs and customer data structures with mapping, conditions, and failure handling.',
        points: ['AFID-CUID mapping', 'Transmission rules', 'Security and monitoring'],
      },
    ],
    buildTitle: 'Product Build Evidence',
    buildBody:
      'Redprint is a marketplace system across creation, upload, discovery, checkout, finance, admin operations, and recovery.',
    flow: ['Upload', 'Process', 'Explore', 'Checkout', 'Admin', 'Recover'],
    buildItems: [
      {
        number: '01',
        title: 'Recoverable creation flow',
        detail: 'multi-step workflow, draft persistence, media readiness gate',
        impact: 'Long submissions do not fall apart when the session gets messy.',
      },
      {
        number: '02',
        title: 'Large media pipeline',
        detail: 'R2 presigned upload, verification, queue orchestration',
        impact: 'Heavy files move without blocking the application server.',
      },
      {
        number: '03',
        title: 'Checkout-to-ledger money flow',
        detail: 'Stripe webhook, ledger posting, idempotency guard',
        impact: 'Buyers, sellers, and operators can explain where money sits.',
      },
      {
        number: '04',
        title: 'Worker recovery system',
        detail: 'queue, lease, retry, heartbeat, failover',
        impact: 'Long-running jobs continue after users leave the screen.',
      },
    ],
    operationsTitle: 'Operator-Ready Systems',
    operationsBody:
      'Operations means turning customer workflows into APIs, data mapping, policy, and action surfaces.',
    operations: [
      {
        title: 'Customer-facing Operations',
        description: 'Customer workflows become API/data mapping, execution conditions, and failure handling rules.',
      },
      {
        title: 'Admin Operations Hub',
        description: 'Review, finance, support, storage, and worker states become surfaces operators can act from.',
      },
      {
        title: 'Worker Operations Plane',
        description: 'Media, checkout recovery, payout planning, and cleanup keep moving outside the user screen.',
      },
    ],
    contactTitle: 'I want to turn customer problems into systems that keep running.',
    contactBody:
      'The goal is a portfolio that reads as technical, customer-aware, and serious about operational recovery.',
  },
} satisfies Record<SupportedLanguage, PageContent>;

function PortfolioSkeleton() {
  const { i18n } = useTranslation();
  const currentLanguage: SupportedLanguage = i18n.resolvedLanguage === 'en' ? 'en' : 'ko';
  const pageText = content[currentLanguage];

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
            <h1 className="hero-title">{pageText.heroTitle}</h1>
            <p className="hero-copy">{pageText.heroBody}</p>
            <div className="hero-tags" aria-label="Portfolio positioning">
              {pageText.heroTags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </RevealBlock>
        </section>

        <section id="pillars" className="content-section pillars-section">
          <RevealBlock className="section-heading">
            <h2>{pageText.pillarsTitle}</h2>
            <p>{pageText.pillarsBody}</p>
          </RevealBlock>

          <div className="pillar-grid">
            {pageText.pillars.map((pillar) => (
              <RevealBlock key={pillar.title} className="pillar-card">
                <span className="card-number">{pillar.label}</span>
                <h2>{pillar.title}</h2>
                <p>{pillar.description}</p>
              </RevealBlock>
            ))}
          </div>
        </section>

        <section id="cases" className="content-section cases-section">
          <RevealBlock className="section-heading">
            <h2>{pageText.casesTitle}</h2>
            <p>{pageText.casesBody}</p>
          </RevealBlock>

          <div className="case-stack">
            {pageText.cases.map((caseStudy) => (
              <RevealBlock key={caseStudy.title} className="case-card">
                <div>
                  <span className="project-meta">{caseStudy.meta}</span>
                  <h2>{caseStudy.title}</h2>
                  <p>{caseStudy.description}</p>
                </div>
                <ul>
                  {caseStudy.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </RevealBlock>
            ))}
          </div>
        </section>

        <section id="build" className="content-section build-section">
          <RevealBlock className="section-heading">
            <h2>{pageText.buildTitle}</h2>
            <p>{pageText.buildBody}</p>
          </RevealBlock>

          <RevealBlock className="system-flow" aria-label={pageText.buildTitle}>
            {pageText.flow.map((step, index) => (
              <div className="flow-step" key={step}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{step}</strong>
              </div>
            ))}
          </RevealBlock>

          <div className="build-grid">
            {pageText.buildItems.map((item) => (
              <RevealBlock key={item.title} className="build-card">
                <span className="card-number">{item.number}</span>
                <h2>{item.title}</h2>
                <p>{item.detail}</p>
                <strong>{item.impact}</strong>
              </RevealBlock>
            ))}
          </div>
        </section>

        <section id="operations" className="content-section operations-section">
          <RevealBlock className="section-heading">
            <h2>{pageText.operationsTitle}</h2>
            <p>{pageText.operationsBody}</p>
          </RevealBlock>

          <div className="operations-list">
            {pageText.operations.map((operation) => (
              <RevealBlock key={operation.title} className="operation-row">
                <h2>{operation.title}</h2>
                <p>{operation.description}</p>
              </RevealBlock>
            ))}
          </div>
        </section>

        <section id="contact" className="content-section contact-section">
          <RevealBlock className="contact-panel">
            <h2>{pageText.contactTitle}</h2>
            <p>{pageText.contactBody}</p>
          </RevealBlock>
        </section>
      </main>

    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PortfolioSkeleton />
  </StrictMode>,
);
