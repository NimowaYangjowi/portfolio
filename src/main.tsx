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

type CareerRole = {
  title: string;
  period: string;
};

type CareerMetric = {
  value: string;
  label: string;
};

type ClientGroup = {
  label: string;
  names: string[];
};

type CareerExperience = {
  company: string;
  scope: string;
  summary: string;
  roles: CareerRole[];
  metrics: CareerMetric[];
  highlights: string[];
  clients: ClientGroup[];
  signatureTitle: string;
  signaturePoints: string[];
};

type BuildItem = {
  id: string;
  number: string;
  title: string;
  detail: string;
  impact: string;
  actionLabel?: string;
  flow?: ProductFlow;
};

type OperationItem = {
  title: string;
  description: string;
};

type FlowStep = {
  label: string;
  detail: string;
  kind: 'entry' | 'process' | 'decision' | 'recovery' | 'output';
};

type FlowNote = {
  title: string;
  body: string;
};

type ProductFlow = {
  eyebrow: string;
  title: string;
  summary: string;
  stages: FlowStep[];
  recovery: FlowStep[];
  notes: FlowNote[];
};

type PageContent = {
  languageLabel: string;
  heroTitle: string;
  heroBody: string;
  heroTags: string[];
  pillarsTitle: string;
  pillarsBody: string;
  pillars: Pillar[];
  careerTitle: string;
  careerBody: string;
  career: CareerExperience;
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

function FlowStepCard({ step, index }: { step: FlowStep; index: number }) {
  return (
    <li className={`flowchart-node flowchart-node-${step.kind}`}>
      <span className="flowchart-index">{String(index + 1).padStart(2, '0')}</span>
      <strong>{step.label}</strong>
      <p>{step.detail}</p>
    </li>
  );
}

function ProductFlowDetail({ flow }: { flow: ProductFlow }) {
  return (
    <div className="product-flow-detail">
      <div className="flow-detail-header">
        <span className="project-meta">{flow.eyebrow}</span>
        <h2>{flow.title}</h2>
        <p>{flow.summary}</p>
      </div>

      <div className="flowchart-shell" aria-label={flow.title}>
        <ol className="flowchart-main">
          {flow.stages.map((step, index) => (
            <FlowStepCard key={step.label} step={step} index={index} />
          ))}
        </ol>

        <div className="flowchart-recovery">
          <span className="flowchart-recovery-label">Recovery path</span>
          <div className="recovery-grid">
            {flow.recovery.map((step, index) => (
              <FlowStepCard key={step.label} step={step} index={index} />
            ))}
          </div>
        </div>
      </div>

      <div className="implementation-notes">
        {flow.notes.map((note) => (
          <article key={note.title} className="implementation-note">
            <h3>{note.title}</h3>
            <p>{note.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function ProductFlowModal({
  item,
  onClose,
}: {
  item: BuildItem;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.classList.add('modal-open');
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.classList.remove('modal-open');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!item.flow) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <div
        className="flow-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="flow-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flow-modal-bar">
          <div>
            <span className="project-meta">{item.number}</span>
            <h2 id="flow-modal-title">{item.title}</h2>
          </div>
          <button type="button" className="flow-modal-close" onClick={onClose} aria-label="Close flowchart">
            ×
          </button>
        </div>
        <ProductFlowDetail flow={item.flow} />
      </div>
    </div>
  );
}

const content = {
  ko: {
    languageLabel: '언어 전환',
    heroTitle: '고객의 복잡한 일을\n기술과 제품 플로우로 바꾸는\n한지우입니다.',
    heroBody:
      'API, 데이터, 운영 정책, 화면을 한 플로우로 묶어 고객이 바로 쓸 수 있는 도구를 만듭니다.',
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
          '프론트엔드, 백엔드, 데이터베이스에 걸쳐 풀스택 프로젝트를 설계하고 운영했습니다. 배포, 스토리지, 결제, 분산락, rate limiting, 에러 대응 자동화, worker failover까지 직접 구축했습니다.',
      },
    ],
    careerTitle: '경력사항',
    careerBody:
      '고객성공 경력을 중심에 두고, 그 안에서 기술 디스커버리, 구현 전략, 고객사 운영, 제품/엔지니어링 협업을 확장해왔습니다.',
    career: {
      company: 'AppsFlyer',
      scope: 'Enterprise Customer Success · Korea & Southeast Asia',
      summary:
        '프리미엄 엔터프라이즈 계정의 온보딩, 요구사항 정리, 구현 계획, 이슈 에스컬레이션, 임원 커뮤니케이션을 end-to-end로 담당했습니다.',
      roles: [
        {
          title: 'Senior Customer Success Manager (enterprise) · SEA business',
          period: '2024.08 ~ Present',
        },
        {
          title: 'Senior Customer Success Manager (enterprise)',
          period: '2022.11 ~ 2024.08',
        },
        {
          title: 'Customer Success Manager',
          period: '2021.01 ~ 2022.11',
        },
        {
          title: 'Customer Engagement Manager',
          period: '2019.04 ~ 2020.12',
        },
      ],
      metrics: [
        {
          value: '6+ yrs',
          label: 'enterprise onboarding, technical discovery, implementation strategy',
        },
        {
          value: '$3M+ ARR',
          label: 'premium account portfolio with expansion and adoption work',
        },
        {
          value: '98%',
          label: 'client retention maintained through technical solutioning and EBRs',
        },
        {
          value: 'APAC',
          label: 'regional implementation guides and troubleshooting playbooks',
        },
      ],
      highlights: [
        'SDK implementation, API integration, data discrepancy, platform configuration 이슈에서 고객 개발팀의 기술 의사결정을 도왔습니다.',
        'Product, Engineering, Security 팀과 함께 고객 blocker를 해결하고, 현장 피드백을 제품 개선과 로드맵 논의로 연결했습니다.',
        '사전 영업과 확장 논의에서 맞춤형 기술 솔루션, Executive Business Review, adoption strategy를 지원했습니다.',
        '내부와 고객이 함께 쓰는 기술 가이드, troubleshooting playbook, best practice 자료를 만들어 APAC 구현 품질을 맞췄습니다.',
      ],
      clients: [
        {
          label: 'Currently managing',
          names: [
            'Samsung Electronics',
            'Garena',
            'Jazz Pakistan',
            'Zalora',
            'HSBC',
            'Bank of the Philippine Islands',
            'UnionBank',
            'Citi Bank',
          ],
        },
        {
          label: 'Previously managed',
          names: ['Woowa Brothers', 'Netmarble', 'Com2us', 'Bitmango', 'Bithumb'],
        },
      ],
      signatureTitle: 'Signature account · Samsung Electronics',
      signaturePoints: [
        '30+ offices를 가진 전략 고객의 Korea HQ primary liaison으로 주요 구현과 adoption 전략을 리드했습니다.',
        'Bangkok, London, Sao Paulo 글로벌 워크숍을 운영하고 Berlin, Sao Paulo 지역 CSM과 전략을 맞췄습니다.',
        '고객 전용으로 시작한 tailored solution이 글로벌 오피스에서 넓게 쓰이는 구조로 확장되도록 제품팀을 설득했습니다.',
      ],
    },
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
        id: 'recoverable-publishing',
        number: '01',
        title: '복구 가능한 등록 플로우',
        detail: 'multi-step workflow, draft persistence, media readiness gate',
        impact: '긴 제출 과정에서도 사용자가 작성한 내용이 사라지지 않습니다.',
        actionLabel: 'Flowchart 보기',
        flow: {
          eyebrow: 'Case 01 · Redprint publishing logic',
          title: '긴 등록 폼을 복구 가능한 제출 플로우로 바꾼 방식',
          summary:
            '프롬프트 상품 등록은 텍스트 입력, 미디어 업로드, AI 태깅, 공개용 derivative 준비, 심사 제출이 섞인 긴 플로우입니다. 이 구조에서는 “사용자가 제출을 누를 수 있는 조건”과 “public storefront에 보여도 되는 조건”을 분리해, 작성자는 막히지 않고 공개 화면은 안전하게 닫혀 있도록 만들었습니다.',
          stages: [
            {
              label: 'Creator starts draft',
              detail: 'Basic info와 prompt content를 step별 form state로 모읍니다.',
              kind: 'entry',
            },
            {
              label: 'Stage validation',
              detail: '각 단계는 즉시 검증하고, 최종 submit 직전 전체 검증을 다시 실행합니다.',
              kind: 'process',
            },
            {
              label: 'Direct media upload',
              detail: '이미지/영상은 presigned URL로 R2에 직접 업로드하고 temp media id를 받습니다.',
              kind: 'process',
            },
            {
              label: 'Submit readiness gate',
              detail: '파일 upload/link completeness는 확인하지만 derivative/transcode 완료까지 submit blocker로 보지 않습니다.',
              kind: 'decision',
            },
            {
              label: 'Atomic commit',
              detail: 'asset, revision, media linking, prompt payload를 같은 제출 경계에서 정리합니다.',
              kind: 'process',
            },
            {
              label: 'Review queue',
              detail: '제출된 상품은 admin review로 이동하고, public storefront는 readiness gate 뒤에 남습니다.',
              kind: 'output',
            },
          ],
          recovery: [
            {
              label: 'Draft restore',
              detail: '브라우저 새로고침이나 이탈 후에도 저장된 draft와 복구 가능한 media preview를 다시 불러옵니다.',
              kind: 'recovery',
            },
            {
              label: 'Retry without duplicate linking',
              detail: 'temp media linking 이후 실패한 submit은 같은 revision scope에서 재시도해 중복 연결을 피합니다.',
              kind: 'recovery',
            },
            {
              label: 'Storefront fail-closed',
              detail: 'worker 후처리가 끝나기 전에는 일반 방문자 카드와 상세 화면을 원본 fallback으로 열지 않습니다.',
              kind: 'recovery',
            },
          ],
          notes: [
            {
              title: '고민한 점: 제출 가능 상태와 공개 가능 상태를 분리',
              body:
                '사용자 입장에서는 파일 업로드와 연결이 끝났으면 긴 등록 과정을 마칠 수 있어야 합니다. 하지만 구매자에게 보이는 public media는 derivative/transcode가 끝나야 안전합니다. 그래서 submit readiness와 storefront readiness를 별도 gate로 나눴습니다.',
            },
            {
              title: '고려한 점: Create/Edit 재사용과 분리의 경계',
              body:
                'Create와 Edit은 같은 4-step UI와 validation contract를 공유하지만, 저장 경계와 revision 처리 방식은 다릅니다. 공통 submit coordinator를 두되, revision 생성·삭제·재제출 같은 edit-specific 처리는 분리했습니다.',
            },
            {
              title: '고려한 점: 실패를 숨기지 않는 복구',
              body:
                '실패를 조용히 무시하거나 fallback 값으로 덮지 않고, draft restore, retry, validation warning으로 사용자와 개발자가 문제를 확인할 수 있게 했습니다. 쉽게 말해, 망가진 상태를 안 보이게 숨기기보다 다시 이어갈 수 있는 길을 만든 것입니다.',
            },
          ],
        },
      },
      {
        id: 'media-pipeline',
        number: '02',
        title: '대용량 미디어 파이프라인',
        detail: 'R2 presigned upload, verification, queue orchestration',
        impact: '무거운 파일도 서버를 막지 않고 안정적으로 처리합니다.',
      },
      {
        id: 'money-flow',
        number: '03',
        title: '결제부터 정산까지의 돈 플로우',
        detail: 'Stripe webhook, ledger posting, idempotency guard',
        impact: '구매자, 판매자, 운영자가 돈의 상태를 같은 기준으로 봅니다.',
      },
      {
        id: 'worker-recovery',
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
        description: '고객의 업무 플로우를 듣고 API/data mapping, 실행 조건, 실패 처리 기준으로 바꿉니다.',
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
    careerTitle: 'Career Experience',
    careerBody:
      'My customer success base expanded into technical discovery, implementation strategy, enterprise operations, and product/engineering collaboration.',
    career: {
      company: 'AppsFlyer',
      scope: 'Enterprise Customer Success · Korea & Southeast Asia',
      summary:
        'Owned premium enterprise engagements end to end, covering onboarding, requirements gathering, implementation planning, issue escalation, and executive stakeholder communication.',
      roles: [
        {
          title: 'Senior Customer Success Manager (enterprise) · SEA business',
          period: '2024.08 ~ Present',
        },
        {
          title: 'Senior Customer Success Manager (enterprise)',
          period: '2022.11 ~ 2024.08',
        },
        {
          title: 'Customer Success Manager',
          period: '2021.01 ~ 2022.11',
        },
        {
          title: 'Customer Engagement Manager',
          period: '2019.04 ~ 2020.12',
        },
      ],
      metrics: [
        {
          value: '6+ yrs',
          label: 'enterprise onboarding, technical discovery, implementation strategy',
        },
        {
          value: '$3M+ ARR',
          label: 'premium account portfolio with expansion and adoption work',
        },
        {
          value: '98%',
          label: 'client retention maintained through technical solutioning and EBRs',
        },
        {
          value: 'APAC',
          label: 'regional implementation guides and troubleshooting playbooks',
        },
      ],
      highlights: [
        'Advised customer engineering teams on SDK implementation, API integration, data discrepancies, and platform configuration.',
        'Partnered with Product, Engineering, and Security to resolve customer blockers and turn field feedback into product improvements.',
        'Supported pre-sales and expansion discussions with tailored technical solutions, Executive Business Reviews, and adoption strategies.',
        'Created internal and customer-facing technical guides, troubleshooting playbooks, and best-practice materials for APAC consistency.',
      ],
      clients: [
        {
          label: 'Currently managing',
          names: [
            'Samsung Electronics',
            'Garena',
            'Jazz Pakistan',
            'Zalora',
            'HSBC',
            'Bank of the Philippine Islands',
            'UnionBank',
            'Citi Bank',
          ],
        },
        {
          label: 'Previously managed',
          names: ['Woowa Brothers', 'Netmarble', 'Com2us', 'Bitmango', 'Bithumb'],
        },
      ],
      signatureTitle: 'Signature account · Samsung Electronics',
      signaturePoints: [
        'Served as Korea HQ primary liaison for a strategic global client with 30+ offices.',
        'Ran global workshops in Bangkok, London, and Sao Paulo while aligning regional CSMs in Berlin and Sao Paulo.',
        'Advocated for a client-specific tailored solution that later scaled across global offices.',
      ],
    },
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
        id: 'recoverable-publishing',
        number: '01',
        title: 'Recoverable creation flow',
        detail: 'multi-step workflow, draft persistence, media readiness gate',
        impact: 'Long submissions do not fall apart when the session gets messy.',
        actionLabel: 'View flowchart',
        flow: {
          eyebrow: 'Case 01 · Redprint publishing logic',
          title: 'Turning a long publishing form into a recoverable submission flow',
          summary:
            'Prompt publishing combines text fields, media upload, AI tagging, public derivatives, and review submission. The key decision was to separate submit readiness from storefront readiness, so creators can finish the flow while public surfaces stay closed until shopper-facing media is safe.',
          stages: [
            {
              label: 'Creator starts draft',
              detail: 'Basic info and prompt content are collected as step-based form state.',
              kind: 'entry',
            },
            {
              label: 'Stage validation',
              detail: 'Each step validates immediately, then the full contract runs again before final submit.',
              kind: 'process',
            },
            {
              label: 'Direct media upload',
              detail: 'Images and videos upload directly to R2 through presigned URLs and return temp media ids.',
              kind: 'process',
            },
            {
              label: 'Submit readiness gate',
              detail: 'Upload/link completeness is required, but derivatives/transcodes are not submit blockers.',
              kind: 'decision',
            },
            {
              label: 'Atomic commit',
              detail: 'Asset, revision, media linking, and prompt payload are finalized at one submit boundary.',
              kind: 'process',
            },
            {
              label: 'Review queue',
              detail: 'The product moves to admin review while public storefront surfaces stay behind readiness gates.',
              kind: 'output',
            },
          ],
          recovery: [
            {
              label: 'Draft restore',
              detail: 'Saved draft data and recoverable media previews are restored after refresh or exit.',
              kind: 'recovery',
            },
            {
              label: 'Retry without duplicate linking',
              detail: 'A failed submit after temp media linking retries in the same revision scope to avoid duplicates.',
              kind: 'recovery',
            },
            {
              label: 'Storefront fail-closed',
              detail: 'Public cards and detail pages do not fall back to original media before worker output is ready.',
              kind: 'recovery',
            },
          ],
          notes: [
            {
              title: 'Design concern: separate submit readiness from public readiness',
              body:
                'Creators should be able to finish the long form once upload and linking are complete. Public shoppers, however, should only see sanitized derivatives or transcoded variants. That is why submit readiness and storefront readiness are separate gates.',
            },
            {
              title: 'Design concern: reuse without hiding flow-specific rules',
              body:
                'Create and Edit share the same four-step UI and validation contract, but they do not have identical persistence boundaries. The shared submit coordinator handles common work, while revision creation, deletion, and resubmission remain edit-specific.',
            },
            {
              title: 'Design concern: recover visibly instead of failing silently',
              body:
                'The flow avoids silent fallbacks. Draft restore, retries, and validation warnings make the interrupted state visible and recoverable. In plain terms, the system gives the user a way back instead of pretending nothing went wrong.',
            },
          ],
        },
      },
      {
        id: 'media-pipeline',
        number: '02',
        title: 'Large media pipeline',
        detail: 'R2 presigned upload, verification, queue orchestration',
        impact: 'Heavy files move without blocking the application server.',
      },
      {
        id: 'money-flow',
        number: '03',
        title: 'Checkout-to-ledger money flow',
        detail: 'Stripe webhook, ledger posting, idempotency guard',
        impact: 'Buyers, sellers, and operators can explain where money sits.',
      },
      {
        id: 'worker-recovery',
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
  const [selectedBuildId, setSelectedBuildId] = useState<string | null>(null);

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

  const selectedBuildItem = pageText.buildItems.find((item) => item.id === selectedBuildId && item.flow);
  const career = pageText.career;

  return (
    <div className="page-shell">
      <header className="top-bar">
        <a href="#intro" className="brand-mark" aria-label="Han Jiwoo portfolio home">
          HJ
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

        <section id="career" className="content-section career-section">
          <RevealBlock className="section-heading">
            <h2>{pageText.careerTitle}</h2>
            <p>{pageText.careerBody}</p>
          </RevealBlock>

          <RevealBlock className="career-card">
            <div className="career-head">
              <div>
                <span className="project-meta">{career.scope}</span>
                <h2>{career.company}</h2>
                <p>{career.summary}</p>
              </div>
              <ol className="career-roles" aria-label={`${career.company} roles`}>
                {career.roles.map((role) => (
                  <li key={`${role.title}-${role.period}`}>
                    <strong>{role.title}</strong>
                    <span>{role.period}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="career-metrics" aria-label="Career metrics">
              {career.metrics.map((metric) => (
                <div key={metric.value} className="career-metric">
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </div>
              ))}
            </div>

            <div className="career-detail-grid">
              <div className="career-block">
                <h3>Scope</h3>
                <ul>
                  {career.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </div>

              <div className="career-block">
                <h3>Customer Footprints</h3>
                <div className="client-groups">
                  {career.clients.map((group) => (
                    <div key={group.label} className="client-group">
                      <strong>{group.label}</strong>
                      <div className="client-chip-list">
                        {group.names.map((name) => (
                          <span key={name}>{name}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="signature-account">
              <h3>{career.signatureTitle}</h3>
              <ul>
                {career.signaturePoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          </RevealBlock>
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
              <RevealBlock key={item.title} className={`build-card ${item.flow ? 'build-card-clickable' : ''}`}>
                {item.flow ? (
                  <button type="button" className="build-card-content-button" onClick={() => setSelectedBuildId(item.id)}>
                    <span className="card-number">{item.number}</span>
                    <h2>{item.title}</h2>
                    <p>{item.detail}</p>
                    <strong>{item.impact}</strong>
                    <span className="flow-open-button">{item.actionLabel}</span>
                  </button>
                ) : (
                  <>
                    <span className="card-number">{item.number}</span>
                    <h2>{item.title}</h2>
                    <p>{item.detail}</p>
                    <strong>{item.impact}</strong>
                  </>
                )}
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

      {selectedBuildItem ? (
        <ProductFlowModal item={selectedBuildItem} onClose={() => setSelectedBuildId(null)} />
      ) : null}

    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PortfolioSkeleton />
  </StrictMode>,
);
