import apiTemplateSettingsImage from './assets/customer-success/api-01-onelink-case-study-01.png';
import apiPathSelectionImage from './assets/customer-success/api-02-onelink-case-study-02.png';
import apiPayloadFormImage from './assets/customer-success/api-03-onelink-case-study-03.png';
import apiPresetImage from './assets/customer-success/api-04-onelink-case-study-05.png';
import apiNamingRuleImage from './assets/customer-success/api-05-onelink-case-study-06.png';
import apiGroupWorkflowImage from './assets/customer-success/api-06-onelink-case-study-04.png';
import apiTreePreviewImage from './assets/customer-success/api-07-onelink-case-study-08.png';
import apiBulkEditImage from './assets/customer-success/api-08-onelink-case-study-09.png';
import apiParameterOverrideImage from './assets/customer-success/api-09-onelink-case-study-10.png';
import workshopSurveyImage from './assets/customer-success/customer-01-image.png';
import workshopLondonImage from './assets/customer-success/customer-02-Pasted_Image_6_30_25__9_22_PM.jpg';
import type { SupportedLanguage } from './i18n';

type LocalizedText = {
  ko: string;
  en: string;
};

type LocalizableText = string | LocalizedText;

type CustomerCaseLinkSource = {
  text: LocalizableText;
  href: string;
};

export type CustomerCaseLink = {
  text: string;
  href: string;
};

type CustomerCaseContentBlockSource =
  | { type: 'heading'; level: 2 | 3; text: LocalizableText }
  | { type: 'paragraph'; text: LocalizableText; links?: CustomerCaseLinkSource[] }
  | { type: 'list'; style: 'bullet' | 'number'; items: LocalizableText[] }
  | { type: 'image'; src: string; alt: LocalizableText; caption?: LocalizableText };

export type CustomerCaseContentBlock =
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'paragraph'; text: string; links?: CustomerCaseLink[] }
  | { type: 'list'; style: 'bullet' | 'number'; items: string[] }
  | { type: 'image'; src: string; alt: string; caption?: string };

export type CustomerSuccessCase = {
  id: string;
  title: string;
  customerContext: string;
  focus: string;
  contribution: string[];
  outcome: string;
  skills: string[];
  modal: {
    eyebrow: string;
    title: string;
    summary: string;
    closeLabel: string;
    openLabel: string;
    contentBlocks: CustomerCaseContentBlock[];
  };
};

type CustomerSuccessCaseSource = {
  id: string;
  title: LocalizableText;
  customerContext: LocalizableText;
  focus: LocalizableText;
  contribution: LocalizableText[];
  outcome: LocalizableText;
  skills: LocalizableText[];
  modal: {
    eyebrow: LocalizableText;
    title: LocalizableText;
    summary: LocalizableText;
    closeLabel: LocalizableText;
    openLabel: LocalizableText;
    contentBlocks: CustomerCaseContentBlockSource[];
  };
};

function localize(ko: string, en: string): LocalizedText {
  return { ko, en };
}

const customerCaseTranslations = new Map<string, LocalizedText>();

function registerTranslation(ko: string, en: string): LocalizedText {
  const localizedText = localize(ko, en);

  customerCaseTranslations.set(ko, localizedText);
  customerCaseTranslations.set(en, localizedText);

  return localizedText;
}

function resolveText(text: LocalizableText, language: SupportedLanguage) {
  if (typeof text !== 'string') {
    return text[language];
  }

  return customerCaseTranslations.get(text)?.[language] ?? text;
}

function resolveContentBlock(
  block: CustomerCaseContentBlockSource,
  language: SupportedLanguage,
): CustomerCaseContentBlock {
  if (block.type === 'heading') {
    return { ...block, text: resolveText(block.text, language) };
  }

  if (block.type === 'paragraph') {
    return {
      ...block,
      text: resolveText(block.text, language),
      links: block.links?.map((link) => ({
        text: resolveText(link.text, language),
        href: link.href,
      })),
    };
  }

  if (block.type === 'image') {
    return {
      ...block,
      alt: resolveText(block.alt, language),
      caption: block.caption ? resolveText(block.caption, language) : undefined,
    };
  }

  return {
    ...block,
    items: block.items.map((item) => resolveText(item, language)),
  };
}

function resolveCustomerSuccessCase(
  customerCase: CustomerSuccessCaseSource,
  language: SupportedLanguage,
): CustomerSuccessCase {
  return {
    ...customerCase,
    title: resolveText(customerCase.title, language),
    customerContext: resolveText(customerCase.customerContext, language),
    focus: resolveText(customerCase.focus, language),
    contribution: customerCase.contribution.map((item) => resolveText(item, language)),
    outcome: resolveText(customerCase.outcome, language),
    skills: customerCase.skills.map((skill) => resolveText(skill, language)),
    modal: {
      eyebrow: resolveText(customerCase.modal.eyebrow, language),
      title: resolveText(customerCase.modal.title, language),
      summary: resolveText(customerCase.modal.summary, language),
      closeLabel: resolveText(customerCase.modal.closeLabel, language),
      openLabel: resolveText(customerCase.modal.openLabel, language),
      contentBlocks: customerCase.modal.contentBlocks.map((block) =>
        resolveContentBlock(block, language),
      ),
    },
  };
}

export function getCustomerSuccessCases(language: SupportedLanguage): CustomerSuccessCase[] {
  return customerSuccessCases.map((customerCase) =>
    resolveCustomerSuccessCase(customerCase, language),
  );
}

const commonCloseLabel = registerTranslation('닫기', 'Close');
const commonOpenLabel = registerTranslation('자세히 보기', 'View details');

const customerSuccessCases: CustomerSuccessCaseSource[] = [
  {
    id: 'onelink-console-solution',
    title: '고객사의 API 도입 과제를 커스텀 콘솔로 풀어낸 사례',
    customerContext:
      '고객사의 OneLink API 도입 과정에서 반복적으로 나타나는 운영 마찰을 공개 문서 기반 레퍼런스 콘솔로 재구성한 사례입니다.',
    focus: 'API Integration',
    contribution: [
      'OneLink CRUD API를 실제 업무에 도입하는 과정에서 생기는 이해도, 운영 방식, 개발 우선순위의 간극을 줄였습니다.',
      '마케팅 팀에는 반복적인 캠페인 링크 운영을 직접 처리할 수 있는 제품형 워크플로우를, 개발팀에는 구현에 참고할 수 있는 작동 가능한 패턴을 제공했습니다.',
      '설정, 생성, 대량 실행, 그룹 단위 업데이트, 개별 링크 추적까지 운영 전체 흐름을 다뤘습니다.',
    ],
    outcome:
      '추상적인 API 개념을 비즈니스 사용자와 개발자가 함께 이해할 수 있는 제품형 워크플로우로 바꿨습니다.',
    skills: ['API Workflow', 'OneLink', 'Productized Console', 'Operational UX'],
    modal: {
      eyebrow: 'Customer Success Case 01',
      title: '고객사의 API 도입 과제를 커스텀 콘솔로 풀어낸 사례',
      summary:
        '고객사의 OneLink API 도입 과정에서 반복적으로 나타나는 운영 마찰을 공개 문서 기반 레퍼런스 콘솔로 재구성한 사례입니다.',
      closeLabel: commonCloseLabel,
      openLabel: commonOpenLabel,
      contentBlocks: [
        {
          type: 'paragraph',
          text: '원본 구현 저장소: OneLink Management Console',
          links: [
            {
              text: 'OneLink Management Console',
              href: 'https://github.com/NimowaYangjowi/OneLink-Management-Console',
            },
          ],
        },
        { type: 'heading', level: 2, text: '프로젝트 개요' },
        {
          type: 'paragraph',
          text: '이 프로젝트는 고객사가 OneLink CRUD API를 실제 업무에 도입하는 과정에서 겪는 이해도, 운영 방식, 개발 우선순위의 간극을 줄이기 위해 시작했습니다.',
        },
        {
          type: 'paragraph',
          text: 'API 자체의 가치는 비기술 사용자에게 추상적으로 느껴질 수 있지만, 마케팅 팀에서 반복적으로 나타나는 운영 니즈는 매우 구체적이었습니다. 대량의 캠페인 링크를 빠르게 만들고, 일관된 규칙으로 관리하며, 매번 개발팀에 수동 작업을 요청하지 않아도 되는 흐름이 필요했습니다.',
        },
        {
          type: 'paragraph',
          text: '이 프로젝트는 그 두 지점을 연결합니다. 마케팅 팀에는 OneLink API가 캠페인 운영의 어떤 병목을 줄일 수 있는지 보여주고, 개발팀에는 실제 구현에 참고할 수 있는 작동 가능한 패턴을 제공합니다.',
        },
        {
          type: 'paragraph',
          text: '추상적인 API 개념을 비즈니스 사용자와 개발자가 함께 이해할 수 있는 제품형 워크플로우로 바꾼 프로젝트입니다.',
        },
        { type: 'heading', level: 2, text: '이 사례에서 보여주고 싶은 점' },
        {
          type: 'list',
          style: 'bullet',
          items: [
            '이 프로젝트는 단순한 데모 UI가 아니라, 고객사의 OneLink API 도입을 막는 운영상의 병목을 공개 문서 기반 레퍼런스 콘솔로 재구성한 사례입니다.',
            '비즈니스 사용자가 이해할 수 있는 화면과 개발팀이 참고할 수 있는 구현 패턴을 동시에 설계했습니다.',
            '설정, 생성, 대량 실행, 그룹 단위 업데이트, 개별 링크 추적까지 운영 전체 흐름을 다룹니다.',
            'API 문서, 고객의 실제 업무 방식, 제품 UI, 개발 구현 기준 사이의 간극을 줄인 경험을 보여줍니다.',
          ],
        },
        { type: 'heading', level: 2, text: '포트폴리오 전체 맥락에서의 연결점' },
        {
          type: 'paragraph',
          text: '이 프로젝트는 제가 고객성공 업무와 제품 구현 경험을 연결하는 방식을 보여줍니다. 고객사의 업무 흐름에서 API 도입을 어렵게 만드는 지점을 찾고, 이를 기술 조직과 비즈니스 사용자가 함께 이해할 수 있는 솔루션으로 바꿨습니다.',
        },
        {
          type: 'list',
          style: 'bullet',
          items: [
            '문제 발견: 마케팅 팀에서 반복되는 캠페인 링크 운영 니즈에서 출발했습니다.',
            '요구사항 구조화: API 작업을 비즈니스 사용자가 이해할 수 있는 제품 흐름으로 바꿨습니다.',
            '구현과 협업: Next.js, TypeScript, React, MUI, SQLite 기반의 작동 가능한 앱으로 구현했습니다.',
            '도입 관점: 비즈니스 사용자와 개발팀 모두가 API의 유용성을 이해하고, 실제 운영에 연결할 수 있도록 설계했습니다.',
            '포트폴리오 연결점: 고객 인터뷰, 기술 요구사항 정리, UI 설계, 작동 가능한 레퍼런스 구현까지 이어지는 엔드투엔드 문제 해결 방식을 보여줍니다.',
          ],
        },
        { type: 'heading', level: 2, text: '범위와 프로덕션 도입에 대한 노트' },
        {
          type: 'list',
          style: 'bullet',
          items: [
            '이 프로젝트는 공개된 코드와 공개 API 문서를 바탕으로 만들어졌습니다. 내부 정보, 고객 기밀 정보, 비공개 제품 지식은 포함하지 않습니다. 본문에서 말하는 커스텀 콘솔은 특정 고객사의 내부 정보를 바탕으로 만든 것이 아니라, 공개 API 문서와 일반화 가능한 운영 패턴을 기반으로 재구성한 레퍼런스 구현입니다.',
            '프로젝트 개발과 본 문서 작성 과정에는 Codex와 Claude Code가 사용되었습니다.',
            '화면과 문서 예시는 실제 API 데이터를 노출하거나 의존하지 않도록 목업 데이터로 구성했고, 별도 검증 과정에서 핵심 API 호출 흐름이 실제 API 환경에서도 동작하는지 확인했습니다.',
            '프로젝트는 로컬 개발과 레퍼런스 구현의 단순성을 위해 SQLite를 사용합니다. GitHub README에서는 프로덕션 도입 시 PostgreSQL 또는 이에 준하는 프로덕션급 관계형 데이터베이스 사용을 권장합니다.',
            '인증과 권한 관리는 이 레퍼런스 프로젝트에 구현되어 있지 않습니다. 실제 고객사 도입 시에는 Admin, Manager, Marketer, Read-only 사용자 역할 또는 조직에 맞는 커스텀 접근 규칙을 정의하는 것을 권장합니다.',
          ],
        },
        { type: 'heading', level: 2, text: '1. 재사용 가능한 템플릿 설정에서 시작' },
        {
          type: 'paragraph',
          text: 'OneLink는 아무 정보 없이 생성될 수 없습니다. 연결할 앱, 딥링킹 동작, 라우팅 설정을 정의하는 템플릿이 필요하며, 이 템플릿은 A7k9와 같은 4자리 알파뉴메릭 Template ID로 식별됩니다.',
        },
        {
          type: 'paragraph',
          text: '그래서 저는 템플릿 등록을 설정 화면의 첫 단계로 만들었습니다. 사용자는 템플릿을 한 번 저장해두고 이후 링크 생성 워크플로우에서 반복해서 사용할 수 있습니다.',
        },
        {
          type: 'image',
          src: apiTemplateSettingsImage,
          alt: 'OneLink Management Console template settings screen',
        },
        { type: 'heading', level: 3, text: '구현 관점에서 고려한 점' },
        {
          type: 'list',
          style: 'bullet',
          items: [
            'API 키는 환경변수로 관리되지만, 키만으로 어떤 템플릿을 사용할 수 있는지는 알 수 없습니다.',
            '이를 해결하기 위해 템플릿 등록 과정에서 한 번의 검증용 링크 요청을 수행합니다. 이 데모에서는 그 결과를 목업 응답 데이터로 표현했습니다.',
            '반환된 short link에서 a7k9.onelink.me와 같은 템플릿/도메인 정보를 파싱해 저장하고 이후 사용합니다.',
            '검증용 링크는 실제 캠페인 워크플로우에 사용하는 링크가 아니라, 템플릿 메타데이터를 찾고 검증하기 위한 용도입니다.',
          ],
        },
        { type: 'heading', level: 3, text: 'UI와 UX 관점에서 고려한 점' },
        {
          type: 'list',
          style: 'bullet',
          items: [
            '사용자가 설정 화면에서 시작하도록 한 이유는 템플릿 설정이 고급 옵션이 아니라 선행 조건이기 때문입니다.',
            '폼은 사용자가 이미 템플릿을 식별하는 방식과 맞게 4자리 Template ID를 입력하도록 설계했습니다.',
            '저장된 템플릿은 생성 플로우에서 선택 옵션으로 재사용되어 반복 입력과 오류를 줄입니다.',
            '목표는 API 설정을 일회성 기술 작업이 아니라 반복 사용 가능한 워크스페이스 설정처럼 느끼게 하는 것이었습니다.',
          ],
        },
        { type: 'heading', level: 2, text: '2. 고객사의 다양한 운영 시나리오를 생성 경로로 분리하기' },
        {
          type: 'paragraph',
          text: '설정이 끝나면 사용자는 단일 링크를 만들지, 링크 그룹을 만들지 선택합니다. 이렇게 하면 시작점이 단순해지고, 모든 사용자를 처음부터 복잡한 대량 생성 플로우로 밀어 넣지 않을 수 있습니다.',
        },
        {
          type: 'paragraph',
          text: '이 콘솔은 본래 대량 링크 생성, 업데이트, 관리를 위해 설계되었습니다. 처음에는 API의 장점이 가장 크게 드러나는 대량 생성만 다룰까도 생각했습니다.',
        },
        {
          type: 'paragraph',
          text: '하지만 콘솔을 도입하는 고객은 보통 모든 링크 운영을 그 안에서 해결하고 싶어 합니다. 단일 작업을 위해 다시 기존 대시보드로 돌아가고 싶어 하지 않습니다. 그래서 단일 링크 생성 케이스도 함께 포함했습니다.',
        },
        {
          type: 'image',
          src: apiPathSelectionImage,
          alt: 'OneLink Management Console create path selection screen',
        },
        { type: 'heading', level: 3, text: '구현 관점에서 고려한 점' },
        {
          type: 'list',
          style: 'bullet',
          items: [
            '단일 링크와 링크 그룹은 같은 API 기반을 공유하지만 서로 다른 사용자 과업을 해결합니다.',
            '두 경로를 분리하면 코드의 책임도 명확해지고 사용자 여정도 설명하기 쉬워집니다.',
          ],
        },
        { type: 'heading', level: 3, text: 'UI와 UX 관점에서 고려한 점' },
        {
          type: 'list',
          style: 'bullet',
          items: [
            '처음부터 API 세부사항을 노출하지 않고, 두 개의 명확한 카드로 사용자의 과업을 선택하게 했습니다.',
            '사용자는 자신의 목적에 따라 한 개의 캠페인 링크를 만들지, 여러 구조화된 링크 변형을 만들지 결정할 수 있습니다.',
          ],
        },
        { type: 'heading', level: 2, text: '3. API 페이로드 복잡도를 비즈니스 입력 폼으로 번역하기' },
        {
          type: 'paragraph',
          text: '단일 링크 생성 폼은 필수 API 파라미터를 읽기 쉬운 필드로 바꿉니다. 링크 이름, 템플릿, 미디어 소스, 캠페인, 딥링크, 대체 URL, 추가 파라미터 등을 사용자가 이해하기 쉬운 형태로 입력하게 합니다.',
        },
        {
          type: 'paragraph',
          text: '이렇게 하면 마케터가 원시 페이로드를 먼저 읽지 않아도 API가 무엇을 할 수 있는지 이해할 수 있습니다.',
        },
        {
          type: 'image',
          src: apiPayloadFormImage,
          alt: 'OneLink Management Console single link creation form',
        },
        { type: 'heading', level: 3, text: '구현 관점에서 고려한 점' },
        {
          type: 'list',
          style: 'bullet',
          items: [
            '필수 필드는 API 실행 전에 검증합니다.',
            '선택적인 딥링킹과 리다이렉션 필드는 사용자의 의도 기준으로 그룹화했습니다.',
            '고급 캠페인 트래킹을 위해 추가 파라미터는 유연하게 남겨두었습니다.',
          ],
        },
        { type: 'heading', level: 3, text: 'UI와 UX 관점에서 고려한 점' },
        {
          type: 'list',
          style: 'bullet',
          items: [
            '폼은 원시 JSON 구조가 아니라 캠페인 설정의 사고방식을 따릅니다.',
            '딥링킹과 대체 이동 동작을 시각적으로 분리해 앱 사용자와 웹 사용자가 각각 어디로 이동하는지 이해하기 쉽게 했습니다.',
          ],
        },
        { type: 'heading', level: 2, text: '4. 프리셋과 네이밍 규칙 유지하기' },
        {
          type: 'paragraph',
          text: '링크 생성을 확장하기 전에, 팀은 값을 일관되게 유지할 방법이 필요합니다. 설정 화면에서는 미디어 소스, 캠페인, 광고 세트, 채널, 딥링크 URI, 대체 URL, 커스텀 파라미터 같은 공통 필드의 재사용 가능한 프리셋을 저장할 수 있습니다.',
        },
        {
          type: 'paragraph',
          text: '이는 이미 네이밍 컨벤션을 운영하는 조직에 특히 유용합니다. 콘솔은 모든 사용자가 조금씩 다른 이름을 직접 입력하게 두는 대신 승인된 값으로 안내할 수 있습니다.',
        },
        {
          type: 'image',
          src: apiPresetImage,
          alt: 'OneLink Management Console reusable preset settings screen',
        },
        {
          type: 'paragraph',
          text: '모든 네이밍 규칙이 고정 목록인 것은 아닙니다. 일부 값은 특정 형식을 따라야 합니다. 예를 들어 지역과 캠페인은 프리셋 값에서 선택하고, 배치 코드는 네 자리 숫자 같은 정규식 형식을 따르게 할 수 있습니다.',
        },
        {
          type: 'image',
          src: apiNamingRuleImage,
          alt: 'OneLink Management Console naming rule slot settings screen',
        },
        { type: 'heading', level: 3, text: '구현 관점에서 고려한 점' },
        {
          type: 'list',
          style: 'bullet',
          items: [
            '프리셋 값은 중앙에 저장하고 단일 링크 및 링크 그룹 생성 폼에서 재사용합니다.',
            '네이밍 컨벤션 슬롯은 고정 프리셋 값 또는 정규식 기반 검증을 사용할 수 있습니다.',
            '이를 통해 API 실행 전에 가벼운 거버넌스 레이어를 만들 수 있습니다.',
          ],
        },
        { type: 'heading', level: 3, text: 'UI와 UX 관점에서 고려한 점' },
        {
          type: 'list',
          style: 'bullet',
          items: [
            '사용자는 프리셋을 선택 가능한 값으로 보므로 승인된 네이밍 규칙을 외울 필요가 없습니다.',
            '정규식 규칙은 처음부터 원시 검증 로직으로 보여주지 않고, 슬롯 단위의 제약으로 표현했습니다.',
            '목표는 캠페인 네이밍을 일관되게 유지하면서도 폼이 엔지니어링 도구처럼 느껴지지 않게 하는 것이었습니다.',
          ],
        },
        { type: 'heading', level: 2, text: '5. 대량 운영 니즈를 링크 그룹 워크플로우로 구조화하기' },
        {
          type: 'paragraph',
          text: '마케팅 팀에서 반복적으로 나타나는 니즈는 링크 하나를 만드는 데서 끝나지 않습니다. 미디어 소스, 캠페인, 애드셋, 광고 단위에 걸쳐 많은 캠페인 링크가 필요합니다.',
        },
        {
          type: 'paragraph',
          text: '저는 링크 그룹 플로우를 미디어 소스 -> 캠페인 -> 광고 세트 -> 광고의 4단계 위계 구조를 중심으로 설계했습니다. 이를 통해 사용자는 같은 설정을 반복 입력하지 않고도 하나의 캠페인 구조에서 여러 링크 변형을 만들 수 있습니다.',
        },
        {
          type: 'image',
          src: apiGroupWorkflowImage,
          alt: 'OneLink Management Console link group workflow screen',
        },
        {
          type: 'paragraph',
          text: '현재 구현에서는 사용자가 위계를 점진적으로 만듭니다. 먼저 미디어 소스 값을 추가하고, 하위 값을 받을 칩을 선택한 뒤 캠페인, 광고 세트, 광고 단계로 트리를 확장합니다.',
        },
        {
          type: 'paragraph',
          text: '트리 빌더는 스프레드시트 행, 탭 구분 값, 줄바꿈, 쉼표, 세미콜론 붙여넣기를 지원합니다. 사용자는 여러 항목을 한 번에 붙여넣고, 이 값들이 올바른 위계로 묶이는 것을 확인할 수 있습니다.',
        },
        {
          type: 'paragraph',
          text: '미리보기 패널은 실행 전에 링크 구조를 보여주므로 사용자는 최종 링크 그룹을 한눈에 파악할 수 있습니다.',
        },
        {
          type: 'image',
          src: apiTreePreviewImage,
          alt: 'OneLink Management Console link group tree preview screen',
        },
        {
          type: 'paragraph',
          text: '편집 속도와 실수 복구도 함께 고려했습니다. 사용자는 위계 칩을 선택하고, 범위 선택이나 드래그 선택을 사용하며, 전체 트리를 다시 만들지 않고도 그룹 항목을 확인 후 삭제할 수 있습니다.',
        },
        {
          type: 'image',
          src: apiBulkEditImage,
          alt: 'OneLink Management Console bulk selection and deletion screen',
        },
        {
          type: 'paragraph',
          text: '파라미터는 전체 링크에 적용하거나 선택한 브랜치에만 적용할 수 있습니다. 특정 캠페인, 애드셋, 광고만 다른 트래킹 값을 써야 할 때 유연하게 대응할 수 있습니다.',
        },
        {
          type: 'image',
          src: apiParameterOverrideImage,
          alt: 'OneLink Management Console branch-level parameter override screen',
        },
        { type: 'heading', level: 3, text: '구현 관점에서 고려한 점' },
        {
          type: 'list',
          style: 'bullet',
          items: [
            '트리 구조는 사용자에게 보이는 위계를 가장 아래 단계에 있는 각 링크의 API 페이로드로 매핑합니다.',
            '각 생성 링크는 전역 파라미터를 상속한 뒤 선택된 브랜치의 재정의를 적용할 수 있습니다.',
            '생성된 각 항목의 실행 상태를 따로 추적하므로 일부 실패가 발생해도 전체 워크플로우를 처음부터 다시 시작하지 않고 재시도할 수 있습니다.',
          ],
        },
        { type: 'heading', level: 3, text: 'UI와 UX 관점에서 고려한 점' },
        {
          type: 'list',
          style: 'bullet',
          items: [
            '대량 생성은 거대한 원시 파라미터 테이블이 아니라 트리 구조로 표현했습니다.',
            '스프레드시트식 붙여넣기는 마케터가 이미 캠페인 데이터를 준비하는 방식을 지원합니다.',
            '드래그 선택과 그룹 삭제는 반복적인 정리 작업을 줄입니다.',
            '미리보기는 생성될 링크 수와 각 링크가 속한 위치를 계속 확인할 수 있게 합니다.',
          ],
        },
      ],
    },
  },
  {
    id: 's2s-implementation-guide',
    title: '공식 문서와 고객사 데이터 구조 사이를 잇는 S2S 구현 가이드',
    customerContext:
      '공식 문서는 API 스펙을 설명하지만, 실제 고객 구현에서는 CUID와 AFID를 어떻게 연결하고 운영할지 먼저 정해야 했습니다.',
    focus: 'Server-to-Server Integration',
    contribution: [
      'AppsFlyer S2S Event API의 엔드포인트, 인증, 파라미터를 고객사 구현 맥락으로 다시 정리했습니다.',
      'AFID-CUID 매핑 테이블 설계, Data Locker 기반 로데이터 적재, 전송 조건을 실행 가능한 가이드로 만들었습니다.',
      '에러 처리, 보안, 모니터링 기준까지 포함해 고객 개발팀이 실제로 따라갈 수 있는 기준을 제시했습니다.',
    ],
    outcome:
      '고객사의 실제 데이터 구조와 AppsFlyer의 필수 식별자 체계 사이에 생기는 이해의 간극을 줄였습니다.',
    skills: ['S2S Event API', 'AFID-CUID Mapping', 'Data Locker', 'Monitoring'],
    modal: {
      eyebrow: 'Customer Success Case 02',
      title: '공식 문서와 고객사 데이터 구조 사이를 잇는 S2S 구현 가이드',
      summary:
        '공식 문서는 API 스펙을 설명합니다. 실제 고객 구현에서는 다른 지점에서 먼저 막힙니다. 고객사의 내부 사용자 ID인 CUID를 AppsFlyer ID인 AFID와 어떻게 연결하고 운영할지 정해야 합니다. 이 케이스는 그 빈칸을 구현 가능한 가이드로 바꾼 사례입니다.',
      closeLabel: commonCloseLabel,
      openLabel: commonOpenLabel,
      contentBlocks: [
        { type: 'heading', level: 2, text: 'Summary' },
        {
          type: 'paragraph',
          text: 'AppsFlyer S2S Event API를 도입하려는 고객사는 내부 데이터 플랫폼에 있는 백엔드 이벤트를 AppsFlyer로 보내고 싶어 했습니다. 대상은 앱 안에서 안정적으로 측정하기 어렵거나 서버 측 검증이 필요한 이벤트였고, 이 이벤트를 Audience 룰과 외부 미디어 연동에 활용해야 했습니다.',
        },
        {
          type: 'paragraph',
          text: '문제는 API 호출 자체가 아니었습니다. AppsFlyer S2S API는 appsflyer_id를 필수 키로 요구하지만, 고객사의 내부 데이터 플랫폼은 customer_user_id를 기준으로 움직입니다. 두 식별자를 연결하는 운영 로직이 없으면 이벤트를 안정적으로 보낼 수 없습니다.',
        },
        {
          type: 'paragraph',
          text: '저는 공식 문서의 엔드포인트, 인증, 파라미터 설명을 고객사 구현 맥락으로 다시 정리하고, AFID-CUID 매핑 테이블 설계, Data Locker 기반 로데이터 적재, 전송 조건, 에러 처리, 보안, 모니터링 기준까지 포함한 고객사 환경에 적용 가능한 구현 가이드를 만들었습니다.',
        },
        { type: 'heading', level: 2, text: '고객이 막힌 지점' },
        {
          type: 'paragraph',
          text: '공식 문서는 고객사마다 다른 데이터 구조를 모두 가정할 수 없습니다. 그래서 “CUID를 어떤 방식으로 AFID와 매핑해야 하는가” 같은 운영 로직은 깊게 다루기 어렵습니다. 고객 개발팀이 가장 이해하기 어려워한 부분이 바로 여기였습니다.',
        },
        {
          type: 'list',
          style: 'bullet',
          items: [
            '고객사 데이터 플랫폼에는 CUID만 있는데 AFID는 어디서 가져와야 하는가',
            'AFID와 CUID를 어떤 테이블 구조로 저장해야 하는가',
            '동일 사용자가 여러 디바이스를 쓰거나 디바이스를 바꾸면 어떤 AFID를 사용해야 하는가',
            '매핑이 안 된 이벤트는 전송해야 하는가, 제외해야 하는가',
            'S2S 이벤트가 기존 SDK 이벤트 데이터를 오염시키지는 않는가',
            '200 OK 응답을 받으면 실제로 Audience와 대시보드에 반영됐다고 볼 수 있는가',
          ],
        },
        {
          type: 'paragraph',
          text: '고객사는 “우리 회사 사용자 번호”를 알고 있고 AppsFlyer는 “AppsFlyer가 붙인 디바이스 번호”를 요구하는 상황이었습니다. 두 번호를 연결하는 명단을 만들고 계속 최신 상태로 유지해야 했습니다.',
        },
        { type: 'heading', level: 2, text: '제공한 해결책' },
        { type: 'heading', level: 3, text: '1. 엔드투엔드 데이터 흐름 정리' },
        {
          type: 'list',
          style: 'number',
          items: [
            '앱에서 SDK 이벤트가 전송되기 전에 customer_user_id를 설정해 로데이터에 CUID와 AFID가 함께 남도록 합니다.',
            'AppsFlyer Data Locker 또는 Pull/Push API로 install, re-engagement, re-attribution, in-app event 로데이터를 고객사 데이터 플랫폼에 적재합니다.',
            '로데이터에서 appsflyer_id와 customer_user_id를 추출해 AFID-CUID 매핑 테이블을 만듭니다.',
            '데이터 플랫폼에서 S2S 대상 이벤트가 발생하면 CUID로 사용자를 식별합니다.',
            '매핑 테이블에서 AFID를 조회합니다.',
            '매핑에 성공한 이벤트만 AppsFlyer S2S In-app Event API로 전송합니다.',
            'AppsFlyer는 AFID 기준으로 이벤트를 해당 디바이스/유저에 기록하며, 설정 조건을 만족한 이벤트는 Audience 룰과 외부 미디어 연동에 활용될 수 있습니다.',
          ],
        },
        { type: 'heading', level: 3, text: '2. AFID-CUID 매핑 테이블 운영 방식 제안' },
        {
          type: 'list',
          style: 'bullet',
          items: [
            '최소 필드: appsflyer_id, customer_user_id, platform, last_seen_at',
            '신규 install, re-engagement, re-attribution 발생 시 delta upsert로 매핑 갱신',
            '동일 CUID에 여러 AFID가 있을 수 있으므로 가장 최근 활동 AFID를 기본값으로 사용',
            '과거 AFID는 보존해 트러블슈팅과 검증에 활용',
            '매핑 테이블에 없는 CUID는 S2S 전송 대상에서 제외하고 별도 미매핑 큐에 저장',
            '추후 AFID가 발견되면 백필 가능성을 검토',
          ],
        },
        { type: 'heading', level: 3, text: '3. API 구현 가이드 정리' },
        {
          type: 'list',
          style: 'bullet',
          items: [
            'v3 엔드포인트와 app_id 형식 안내',
            'S2S Key 발급 경로와 authentication 헤더 사용 방식 정리',
            'Authorization Bearer가 아니라 authentication 커스텀 헤더를 써야 한다는 점 명시',
            'Android, iOS별 식별자 파라미터 구분',
            'eventName, eventValue, eventTime, eventCurrency 등 필수/권장 필드 정리',
            '요청 예시와 응답 코드별 조치 방식 제공',
          ],
        },
        { type: 'heading', level: 2, text: '구현 고려사항' },
        { type: 'heading', level: 3, text: '데이터 정확도' },
        {
          type: 'list',
          style: 'bullet',
          items: [
            'AFID가 없는 이벤트는 임의 값으로 보내지 않습니다. 잘못된 디바이스에 이벤트가 기록될 수 있기 때문입니다.',
            'SDK 이벤트와 S2S 이벤트가 같은 행동을 중복 기록하지 않도록 이벤트명을 분리합니다.',
            'eventTime은 UTC 기준으로 통일해 어트리뷰션 윈도와 리포팅 오차를 줄입니다.',
          ],
        },
        { type: 'heading', level: 3, text: '에러 처리' },
        {
          type: 'list',
          style: 'bullet',
          items: [
            '5xx 응답은 지수 백오프로 정해진 횟수만큼 재시도하고, 계속 실패하면 DLQ로 이동합니다.',
            '4xx 응답은 재시도보다 페이로드, 인증, 필수값, JSON 형식을 먼저 검증합니다.',
            'AppsFlyer는 별도 idempotency key를 받지 않으므로 CUID, eventName, eventTime 해시 또는 nonce 조합으로 중복을 방지합니다.',
          ],
        },
        { type: 'heading', level: 3, text: '보안과 운영' },
        {
          type: 'list',
          style: 'bullet',
          items: [
            'S2S Key는 Vault 또는 KMS로 관리하고 코드, Git, 로그에 남기지 않습니다.',
            'PII는 eventValue에 직접 담지 않고, 허용된 필드와 고객사 개인정보 처리 기준에 맞춰 정규화 후 SHA-256 해시 여부를 결정합니다.',
            '로그에는 AFID, CUID, eventName, eventTime, responseCode 중심으로 남기고 전체 페이로드는 마스킹합니다.',
            '전송량, 4xx 비율, 매핑 실패율, 200 OK 이후 로데이터 또는 Live Events Viewer 기준의 반영 여부를 샘플링해 모니터링합니다.',
          ],
        },
        { type: 'heading', level: 2, text: '왜 이 사례가 중요한가' },
        {
          type: 'paragraph',
          text: '이 케이스는 단순히 API 문서를 요약한 일이 아닙니다. 고객사의 실제 데이터 구조와 AppsFlyer의 필수 식별자 체계 사이에 생기는 이해의 간극을 줄인 일입니다.',
        },
        {
          type: 'paragraph',
          text: '공식 문서가 말하는 것은 “무엇을 보내야 하는가”입니다. 고객이 어려워한 것은 “우리 시스템에서 그 값을 어떻게 찾아 안정적으로 운영할 것인가”였습니다. 저는 그 질문을 데이터 플로우, 매핑 정책, 전송 조건, 예외 처리, 모니터링 기준으로 나눠 실행 가능한 형태로 정리했습니다.',
        },
        { type: 'heading', level: 2, text: 'Source artifact' },
        {
          type: 'paragraph',
          text: '원본 가이드: AppsFlyer S2S 구현 가이드',
          links: [
            {
              text: localize(
                'AppsFlyer S2S 구현 가이드 PDF',
                'AppsFlyer S2S implementation guide PDF',
              ),
              href: 'https://drive.google.com/file/d/1VixttbY__k6bvVzS-HZGJZTGY1MGOmO4/view?usp=sharing',
            },
          ],
        },
      ],
    },
  },
  {
    id: 'private-customer-workshop',
    title: localize(
      '30개 이상 현지 오피스를 보유한 글로벌 이커머스 기업의 앱 전환 워크숍',
      'Global App Adoption Workshops for an E-commerce Enterprise with 30+ Local Offices',
    ),
    customerContext: localize(
      '한국 본사의 글로벌 이커머스 엔터프라이즈가 웹 중심 운영에서 앱 중심 성장으로 전환하기 위해, 본사와 30개 이상 현지 오피스에 앱 마케팅 성과 측정 체계를 도입해야 했던 사례입니다.',
      'A Korea-headquartered global e-commerce enterprise needed to shift from web-led operations to app-led growth and roll out app marketing measurement across HQ and 30+ local offices.',
    ),
    focus: localize('글로벌 앱 전환 워크숍', 'Global App Adoption Workshop'),
    contribution: [
      localize(
        '본사 의사결정자부터 현지 마케팅·CRM·데이터 담당자까지 같은 기준으로 이해할 수 있도록 앱 마케팅 측정, attribution, deep linking, SKAN, fraud protection, Adobe 연동 이슈를 교육 흐름으로 재구성했습니다.',
        'Reframed app marketing measurement, attribution, deep linking, SKAN, fraud protection, and Adobe integration issues into an enablement flow that HQ decision-makers and local marketing, CRM, and data teams could understand together.',
      ),
      localize(
        '런던, 방콕, 상파울루에서 각각 이틀짜리 권역별 워크숍을 세 차례 설계하고, 아젠다, 맞춤 콘텐츠, 발표자 배정, 사전·사후 설문, 참여형 퀴즈, 후속 액션까지 교육 흐름에 포함했습니다.',
        'Designed three two-day regional workshops in London, Bangkok, and Sao Paulo, with the enablement flow covering the agenda, custom content, speaker assignment, pre/post surveys, engagement quizzes, and follow-up actions.',
      ),
      localize(
        'APAC, EMEA, LATAM 현지 오피스의 지식 수준, KPI, 데이터 정의, 캠페인 운영 방식 차이를 본사 메시지와 연결해 전사 도입을 위한 공통 언어를 만들었습니다.',
        'Connected local differences in knowledge level, KPIs, data definitions, and campaign operations across APAC, EMEA, and LATAM back to the HQ message, creating a shared language for global adoption.',
      ),
    ],
    outcome: localize(
      '130명 이상 참가자의 제품 이해도와 사용 자신감이 높아졌고, 고객사가 권역별 교육·정착 지원에 만족하면서 300K+ USD 업셀이 포함된 갱신 과정에도 긍정적으로 기여했습니다.',
      'The workshops improved product knowledge and confidence for 130+ participants and positively supported a renewal process that included a 300K+ USD upsell by demonstrating strong regional enablement support.',
    ),
    skills: [
      localize('글로벌 교육·정착 지원', 'Global Enablement'),
      localize('워크숍 설계', 'Workshop Design'),
      localize('복잡한 이해관계자 조율', 'Complex Stakeholder Alignment'),
      localize('앱 마케팅 측정 교육', 'App Marketing Measurement Enablement'),
    ],
    modal: {
      eyebrow: 'Customer Success Case 03',
      title: localize(
        '30개 이상 현지 오피스를 보유한 글로벌 이커머스 기업의 앱 전환 워크숍',
        'Global App Adoption Workshops for an E-commerce Enterprise with 30+ Local Offices',
      ),
      summary: localize(
        '웹 중심으로 성장해 온 글로벌 이커머스 고객사가 앱 중심 성장으로 전환하려면, 본사와 현지 오피스가 앱 광고 성과 측정 방식을 먼저 이해해야 했습니다. 이 케이스는 런던, 방콕, 상파울루에서 진행한 세 차례의 권역별 워크숍으로 본사 의사결정자와 현지 마케팅·CRM·데이터 팀의 지식 격차를 줄인 글로벌 교육·정착 지원 프로젝트입니다.',
        'A web-led global e-commerce customer needed HQ and local offices to understand app marketing measurement before shifting toward app-led growth. This case covers three regional workshops in London, Bangkok, and Sao Paulo that reduced the knowledge gap between HQ decision-makers and local marketing, CRM, and data teams.',
      ),
      closeLabel: commonCloseLabel,
      openLabel: commonOpenLabel,
      contentBlocks: [
        { type: 'heading', level: 2, text: localize('상황', 'Context') },
        {
          type: 'paragraph',
          text: localize(
            '고객사는 한국에 본사를 둔 글로벌 이커머스 엔터프라이즈였습니다. 웹 기반으로 사업을 키워왔지만, 사용자 경험과 구매 전환율을 높이려면 앱 중심 운영으로 전환해야 하는 상황이었습니다.',
            'The customer was a Korea-headquartered global e-commerce enterprise. Its business had grown around web-based commerce, but improving user experience and purchase conversion required a shift toward app-led operations.',
          ),
        },
        {
          type: 'paragraph',
          text: localize(
            '문제는 앱 마케팅 성과 측정 방식이 웹 분석과 크게 달랐다는 점입니다. 고객사의 주 분석 환경은 Adobe 중심이었고, 본사 의사결정자부터 현지 오피스까지 앱 attribution, campaign measurement, deep linking 같은 개념을 업무 언어로 이해하는 사람이 거의 없었습니다.',
            'The challenge was that app marketing measurement worked very differently from web analytics. The customer’s analytics environment was centered on Adobe, and almost no one from HQ decision-makers to local offices had a working understanding of app attribution, campaign measurement, or deep linking.',
          ),
        },
        { type: 'heading', level: 2, text: 'Challenges' },
        {
          type: 'list',
          style: 'bullet',
          items: [
            localize(
              '본사부터 앱 광고 성과 측정에 대한 이해가 부족해, 먼저 의사결정자들이 AppsFlyer와 앱 마케팅 측정 구조를 이해해야 했습니다.',
              'HQ first needed to understand AppsFlyer and the structure of app marketing measurement before it could make rollout decisions.',
            ),
            localize(
              '30개 이상 현지 오피스는 지식 수준, KPI, 데이터 정의, 캠페인 운영 방식이 서로 달라 같은 교육 자료만 배포해서는 도입이 어려웠습니다.',
              'The 30+ local offices differed in knowledge level, KPIs, data definitions, and campaign operations, so adoption could not be solved by simply distributing the same training material.',
            ),
            localize(
              'Adobe는 기존 웹 분석에는 익숙한 도구였지만, 앱 attribution과 캠페인 성과 측정에서는 한계와 연동 특이사항이 있어 원인과 대응 방향을 함께 설명해야 했습니다.',
              'Adobe was familiar for web analytics, but app attribution and campaign measurement introduced limitations and integration-specific behavior that needed clear explanation and direction.',
            ),
          ],
        },
        { type: 'heading', level: 2, text: 'Customer Goals' },
        {
          type: 'list',
          style: 'bullet',
          items: [
            localize(
              '웹 중심 이커머스 운영에서 앱 중심 성장 모델로 전환하고, 앱에서 더 높은 구매 전환을 만들 수 있는 기반을 마련합니다.',
              'Shift from web-led e-commerce operations toward an app-led growth model that could support stronger purchase conversion in the app.',
            ),
            localize(
              '본사와 현지 오피스가 같은 기준으로 AppsFlyer 데이터를 읽고, 캠페인 성과를 비교하고, 지역별 실행 계획을 세울 수 있게 만듭니다.',
              'Enable HQ and local offices to read AppsFlyer data with the same baseline, compare campaign performance, and build regional execution plans.',
            ),
            localize(
              'Adobe 중심의 기존 분석 환경과 AppsFlyer의 역할 차이를 이해하고, 연동 이슈의 원인과 해결 방향을 내부에 설명할 수 있게 합니다.',
              'Help teams understand the difference between the existing Adobe-centered analytics environment and AppsFlyer’s role, including the causes and resolution direction for integration issues.',
            ),
          ],
        },
        { type: 'heading', level: 2, text: 'Approach' },
        {
          type: 'list',
          style: 'bullet',
          items: [
            localize(
              '본사 교육을 먼저 설계해 의사결정자들이 앱 마케팅 측정의 기본 구조를 이해하도록 한 뒤, 같은 메시지를 권역별 워크숍으로 확장했습니다.',
              'Started with HQ enablement so decision-makers could understand the fundamentals of app marketing measurement, then expanded the same message into regional workshops.',
            ),
            localize(
              '런던, 방콕, 상파울루에서 APAC, EMEA, LATAM 현지 오피스의 마케팅, 마케팅 데이터, CRM 담당자를 모아 각각 이틀짜리 오프라인 워크숍을 진행했습니다.',
              'Ran two-day in-person workshops in London, Bangkok, and Sao Paulo for marketing, marketing data, and CRM teams from APAC, EMEA, and LATAM offices.',
            ),
            localize(
              'AppsFlyer 기본 구조, attribution, deep linking, SKAN, fraud protection, dashboard 활용, campaign measurement, Adobe와의 차이, 리포트 활용, 실습 세션을 고객사 맥락에 맞게 묶었습니다.',
              'Tailored the curriculum around AppsFlyer fundamentals, attribution, deep linking, SKAN, fraud protection, dashboard usage, campaign measurement, Adobe differences, reporting, and hands-on sessions.',
            ),
          ],
        },
        { type: 'heading', level: 2, text: 'Action' },
        {
          type: 'list',
          style: 'bullet',
          items: [
            localize(
              '권역별 워크숍은 아젠다, 예산 승인, 일정 조율, 맞춤 콘텐츠, 발표자 구성, 내부 팀 조율, 본사 메시지 정렬, 참여형 퀴즈, 사전·사후 설문까지 하나의 교육 흐름으로 설계했습니다.',
              'The regional workshops were designed as one enablement flow, covering agenda structure, budget approval alignment, scheduling, custom content, speaker planning, internal coordination, HQ message alignment, engagement quizzes, and pre/post survey design.',
            ),
            localize(
              '가장 어려웠던 부분은 세 권역의 일정과 이해관계자를 맞추면서도, 각 지역이 바로 이해할 수 있는 수준의 맞춤형 콘텐츠를 만드는 일이었습니다.',
              'The hardest part was aligning schedules and stakeholders across three regions while creating custom content that each local team could understand and apply.',
            ),
            localize(
              '현지 장소 예약, 케이터링, 당일 현장 운영은 지역 팀과 분담하고, 교육 설계, 이해관계자 조율, 메시지 일관성 관리에 집중했습니다.',
              'Local operations such as venue booking, catering, and on-site execution were shared with regional teams, while the core focus stayed on enablement design, stakeholder alignment, and message consistency.',
            ),
          ],
        },
        { type: 'heading', level: 2, text: 'Outcomes' },
        {
          type: 'list',
          style: 'bullet',
          items: [
            localize(
              '130명 이상 참가자의 사전·사후 설문에서 AppsFlyer와 앱 마케팅 측정에 대한 이해도와 사용 자신감이 높아진 것으로 나타났습니다.',
              'Pre/post surveys across 130+ participants showed improved understanding and confidence around AppsFlyer and app marketing measurement.',
            ),
            localize(
              '본사와 현지 오피스가 앱 캠페인 성과, 대시보드, 리포트, Adobe 연동 특이사항을 같은 언어로 이야기할 수 있는 기반을 만들었습니다.',
              'Created a shared language for HQ and local offices to discuss app campaign performance, dashboards, reporting, and Adobe integration behavior.',
            ),
            localize(
              '워크숍 결과에 대한 고객 만족도가 높았고, 권역별 전담 지원을 보여준 점이 300K+ USD 업셀이 포함된 갱신 과정에 긍정적으로 작용했습니다.',
              'Customer satisfaction with the workshops was strong, and the demonstrated regional enablement support positively influenced a renewal process that included a 300K+ USD upsell.',
            ),
          ],
        },
        {
          type: 'image',
          src: workshopLondonImage,
          alt: 'Photo after the London workshop',
          caption: 'Photo after the London workshop',
        },
        {
          type: 'image',
          src: workshopSurveyImage,
          alt: 'Pre vs Post workshop survey showing increased product knowledge and confidence',
          caption: 'Pre vs Post workshop survey showing increased product knowledge and confidence',
        },
      ],
    },
  },
  {
    id: 'gaming-meta-growth-workshop',
    title: localize(
      'Meta Ads와 함께 글로벌 게임사의 성장 워크숍을 공동 기획한 사례',
      'Tri-party Growth Workshop with Meta Ads for a Global Puzzle Gaming Company',
    ),
    customerContext: localize(
      '6M+ MAU와 월 2M 다운로드를 보유한 글로벌 퍼즐 게임사를 대상으로, AppsFlyer의 데이터 예측 제품 도입과 Meta Ads 성장 워크숍을 함께 지원한 사례입니다.',
      'A global puzzle gaming company with 6M+ MAU and 2M monthly downloads needed support adopting a data prediction product and aligning growth strategy with Meta Ads and AppsFlyer.',
    ),
    focus: localize('마케팅 전략 및 측정 설계', 'Marketing Strategy & Measurement'),
    contribution: [
      localize(
        'MVP 단계부터 alpha, beta, final launch까지 데이터 예측 제품 도입을 지원했습니다.',
        'Guided the customer through adoption of a data prediction product from MVP through alpha, beta, and final launch.',
      ),
      localize(
        '고객사, Meta Ads 팀, AppsFlyer가 함께 참여하는 3자 공동 세미나를 기획해 성장 전략과 측정 방법을 정리했습니다.',
        'Co-hosted a tri-party seminar with the customer, Meta Ads, and AppsFlyer to align growth strategy and measurement practices.',
      ),
      localize(
        '핵심 제품 활용 사례를 case study로 작성하고 고객 testimonial을 확보했습니다.',
        'Authored a case study covering multiple core products and secured a client testimonial.',
      ),
    ],
    outcome: localize(
      '신규 데이터 예측 제품의 상용 계약을 확보했고, 고객사의 성장 전략 논의를 파트너 협업과 공개 가능한 사례 자산으로 확장했습니다.',
      'Secured a commercial contract for the new data prediction product and turned the growth discussion into partner collaboration and reusable case-study proof.',
    ),
    skills: [
      localize('마케팅 전략', 'Marketing Strategy'),
      localize('성과 측정 설계', 'Measurement Design'),
      localize('예측 데이터 제품', 'Predictive Data Product'),
      'Meta Ads',
      localize('제품 도입', 'Product Adoption'),
      localize('고객 사례 작성', 'Case Study Writing'),
    ],
    modal: {
      eyebrow: localize('고객성공 사례 04', 'Customer Success Case 04'),
      title: localize(
        'Meta Ads와 함께 글로벌 게임사의 성장 워크숍을 공동 기획한 사례',
        'Tri-party Growth Workshop with Meta Ads for a Global Puzzle Gaming Company',
      ),
      summary: localize(
        '6M+ MAU와 월 2M 다운로드를 보유한 글로벌 퍼즐 게임사를 대상으로, 데이터 예측 제품 도입과 Meta Ads 공동 성장 세미나를 함께 이끈 사례입니다.',
        'A case where a global puzzle gaming company with 6M+ MAU and 2M monthly downloads adopted a data prediction product while joining a growth seminar co-hosted with Meta Ads.',
      ),
      closeLabel: commonCloseLabel,
      openLabel: commonOpenLabel,
      contentBlocks: [
        { type: 'heading', level: 2, text: localize('고객 맥락', 'Customer Context') },
        {
          type: 'paragraph',
          text: localize(
            '고객사는 글로벌 퍼즐 게임사로, 6M+ MAU와 월 2M 다운로드를 보유한 규모 있는 모바일 게임 비즈니스였습니다. 성장 여지가 큰 계정이었지만, 새로운 데이터 예측 제품은 아직 MVP에서 alpha, beta, final launch로 넘어가는 초기 단계였습니다.',
            'The customer was a global puzzle gaming company with 6M+ MAU and 2M monthly downloads. It was a high-growth account, while the data prediction product was still moving from MVP through alpha, beta, and final launch.',
          ),
        },
        {
          type: 'paragraph',
          text: localize(
            '단순히 기능을 켜는 문제가 아니라, 고객사의 마케팅 팀이 어떤 성장 목표를 가지고 있고 어떤 측정 기준으로 제품 가치를 판단할지 함께 정리해야 했습니다.',
            'The work was not just about enabling a feature. We needed to clarify the customer’s growth goals and the measurement criteria the marketing team would use to judge product value.',
          ),
        },
        { type: 'heading', level: 2, text: localize('접근 방식', 'Approach') },
        {
          type: 'list',
          style: 'bullet',
          items: [
            localize(
              'MVP, alpha, beta 단계에서 고객 피드백을 모아 제품 활용 방식과 상용 계약 전환 조건을 구체화했습니다.',
              'Collected customer feedback through the MVP, alpha, and beta stages to clarify usage patterns and the conditions needed for commercial adoption.',
            ),
            localize(
              '고객사, Meta Ads 팀, AppsFlyer가 함께 참여하는 3자 공동 세미나를 기획해 성장 전략, 캠페인 측정, 제품 활용 방안을 한 자리에서 논의했습니다.',
              'Co-planned a tri-party seminar with the customer, Meta Ads, and AppsFlyer to discuss growth strategy, campaign measurement, and product usage in one shared forum.',
            ),
            localize(
              '데이터 예측 제품뿐 아니라 여러 핵심 제품이 고객사의 실제 마케팅 운영에서 어떻게 함께 쓰이는지 case study로 정리했습니다.',
              'Documented how the data prediction product and multiple core products worked together in the customer’s real marketing operation.',
            ),
          ],
        },
        { type: 'heading', level: 2, text: localize('성과', 'Outcomes') },
        {
          type: 'list',
          style: 'bullet',
          items: [
            localize(
              '데이터 예측 제품의 상용 계약을 확보했습니다.',
              'Secured a commercial contract for the data prediction product.',
            ),
            localize(
              'Meta Ads 팀과의 공동 세미나를 통해 고객사의 성장 논의를 제품 교육이 아니라 실제 캠페인 전략과 측정 설계로 확장했습니다.',
              'Expanded the customer conversation from product education into real campaign strategy and measurement design through the joint seminar with Meta Ads.',
            ),
            localize(
              '여러 핵심 제품을 다룬 case study를 작성하고 고객 testimonial을 확보해, 이후 다른 엔터프라이즈 고객에게 보여줄 수 있는 신뢰 자산으로 만들었습니다.',
              'Authored a case study covering multiple core products and secured a client testimonial, creating proof that could support future enterprise conversations.',
            ),
          ],
        },
        { type: 'heading', level: 2, text: localize('포트폴리오에서 보여주는 점', 'What This Shows') },
        {
          type: 'paragraph',
          text: localize(
            '이 사례는 제가 고객성공을 단순 지원 업무로 보지 않고, 마케팅 전략, 측정 구조, 제품 도입, 파트너 협업을 함께 묶어 실행하는 방식으로 일한다는 점을 보여줍니다. 새 도구를 고객에게 소개하는 데서 끝내지 않고, 그 도구를 언제, 왜, 어떻게 써야 성과가 나는지까지 함께 설계한 사례입니다.',
            'This case shows how I treat Customer Success as more than support: I connect marketing strategy, measurement structure, product adoption, and partner collaboration into execution. Put simply, I did not just hand the customer a new tool. I helped map when, why, and how to use it so it could create growth.',
          ),
        },
      ],
    },
  },
  {
    id: 'adobe-integration-issue-resolution',
    title: localize(
      '온보딩 중 발견한 Adobe 리인게이지먼트 연동 갭 해결',
      'Resolving an Adobe Re-engagement Integration Gap Found During Onboarding',
    ),
    customerContext: localize(
      '같은 글로벌 이커머스 고객사의 온보딩 스코프 검토 과정에서, Adobe로 리인게이지먼트와 리어트리뷰션 데이터를 보내는 연동 공백이 확인되었습니다.',
      'During onboarding-scope review for the same global e-commerce customer, a gap was identified in sending re-engagement and re-attribution data to Adobe.',
    ),
    focus: localize('부서 간 협업', 'Cross-Functional Collaboration'),
    contribution: [
      localize(
        '제품 지원 범위와 고객 영향도를 확인한 뒤, 리더십과 논의해 지원 범위를 고객에게 투명하게 공유했습니다.',
        'Clarified the product-support scope and customer impact, aligned with leadership, and transparently shared the supported scope with the customer.',
      ),
      localize(
        '리인게이지먼트 데이터가 Adobe에 반영되지 않으면 리타겟팅 이후 앱 재방문과 다운퍼널 이벤트가 계속 최초 오가닉처럼 보이는 문제를 고객과 내부 팀이 이해할 수 있게 정리했습니다.',
        'Clarified for the customer and internal teams that without re-engagement data in Adobe, app revisits and downstream events after retargeting would continue to appear as the original organic path.',
      ),
      localize(
        '파트너팀, Product, 고객성공 리더십, Adobe 담당자 간의 구현 논의가 진행될 수 있도록 요구사항, 고객 영향, 협업 범위를 관리 문서로 정리했습니다.',
        'Documented requirements, customer impact, and collaboration scope so implementation discussions could move forward across Partnerships, Product, Customer Success leadership, and Adobe stakeholders.',
      ),
    ],
    outcome: localize(
      'Adobe 리인게이지먼트 연동은 구현되어 고객의 리타겟팅 성과 측정 공백을 줄였고, 이후 Product 팀이 같은 기능을 Mixpanel 등 다른 애널리틱스 파트너로 확장하는 기반이 되었습니다.',
      'Adobe re-engagement support was implemented, reducing the customer’s retargeting measurement gap and later giving Product a foundation to extend the same capability to other analytics partners such as Mixpanel.',
    ),
    skills: [
      localize('Adobe 리인게이지먼트 연동', 'Adobe Re-engagement Integration'),
      localize('제품 개선 기회 발굴', 'Product Improvement Discovery'),
      localize('파트너십 협업', 'Partnership Collaboration'),
      localize('리더십 에스컬레이션', 'Leadership Escalation'),
    ],
    modal: {
      eyebrow: localize('고객성공 사례 05', 'Customer Success Case 05'),
      title: localize(
        '온보딩 중 발견한 Adobe 리인게이지먼트 연동 갭 해결',
        'Resolving an Adobe Re-engagement Integration Gap Found During Onboarding',
      ),
      summary: localize(
        '온보딩 스코프 검토 과정에서 Adobe 리인게이지먼트 연동 미지원 범위가 확인되었고, 이 공백이 리타겟팅 성과 측정에 미치는 영향을 고객과 내부 팀이 함께 이해할 수 있도록 정리한 사례입니다. 리더십과 논의한 뒤 지원 범위와 영향도를 고객에게 투명하게 공유하고, Product, 파트너팀, Adobe 담당자 간의 구현 논의가 진행될 수 있도록 요구사항을 구조화했습니다.',
        'During onboarding-scope review, an unsupported area in Adobe re-engagement integration was identified and framed so the customer and internal teams could understand its impact on retargeting measurement. After aligning with leadership, the supported scope and business impact were shared transparently with the customer, and the requirements were structured so implementation discussions could move forward across Product, Partnerships, and Adobe stakeholders.',
      ),
      closeLabel: commonCloseLabel,
      openLabel: commonOpenLabel,
      contentBlocks: [
        { type: 'heading', level: 2, text: localize('상황', 'Context') },
        {
          type: 'paragraph',
          text: localize(
            '이 이슈는 30개 이상 현지 오피스를 보유한 같은 글로벌 이커머스 고객사의 앱 전환 온보딩 과정에서 나왔습니다. 고객사는 웹 분석 중심으로 일해왔기 때문에, 모바일 앱에서 리인게이지먼트와 리어트리뷰션 데이터가 어떤 의사결정에 연결되는지 먼저 정렬할 필요가 있었습니다.',
            'This issue came up during app onboarding for the same global e-commerce customer with 30+ local offices. Because the customer had been operating from a web analytics mindset, the team first needed alignment on how re-engagement and re-attribution data connected to mobile app decisions.',
          ),
        },
        {
          type: 'paragraph',
          text: localize(
            '연동 스코프를 확인하던 중, 당시 제품이 Adobe로 리인게이지먼트 데이터를 보내지 못하는 범위가 확인되었습니다. 제품팀과 지원 범위를 검증한 뒤, 고객에게 공유할 영향도와 내부 조율 방향을 리더십과 먼저 정리했습니다.',
            'During integration-scope review, it became clear that the product could not yet send re-engagement data to Adobe. After validating the supported scope with Product, the customer impact and internal alignment path were clarified with leadership.',
          ),
        },
        { type: 'heading', level: 2, text: localize('과제', 'Challenges') },
        {
          type: 'list',
          style: 'bullet',
          items: [
            localize(
              '모바일 광고에서 최초 유입은 오가닉이었지만 이후 Google 리타겟팅 광고로 다시 돌아와 구매한 사용자가 있어도, Adobe 쪽에는 계속 최초 오가닉 사용자처럼 남는 문제가 생겼습니다.',
              'In mobile advertising, even if a user first arrived organically and later returned through a Google retargeting ad before purchasing, Adobe would continue to treat the user as part of the original organic path.',
            ),
            localize(
              '리인게이지먼트와 리어트리뷰션 데이터가 Adobe로 전달되지 않으면 앱 재방문 이후의 구매, 전환, 다운퍼널 이벤트가 리타겟팅 성과로 연결되지 않았습니다.',
              'Without re-engagement and re-attribution data flowing into Adobe, purchases, conversions, and downstream events after app revisits would not connect back to retargeting performance.',
            ),
            localize(
              '웹 분석 중심으로 운영해 온 고객 조직에는 앱 리인게이지먼트와 리어트리뷰션 개념 정렬이 먼저 필요했습니다. 지원 범위만 전달하는 것으로는 부족했고, 이 데이터가 왜 필요한지 업무 관점에서 설명해야 했습니다.',
              'For a customer organization that had operated around web analytics, app re-engagement and re-attribution concepts first needed alignment. Sharing the support scope alone was not enough; the business reason for the data had to be explained.',
            ),
            localize(
              '제품의 큰 시스템 근간과 연결된 영역이라 Product 쪽에서도 쉽게 개발 진척이 나지 않았고, 파트너팀, Product, Adobe 담당자, 고객성공 리더십 조율이 필요했습니다.',
              'The gap touched a foundational product area, so Product could not move it quickly, and the work required alignment across Partnerships, Product, Adobe stakeholders, and Customer Success leadership.',
            ),
          ],
        },
        { type: 'heading', level: 2, text: localize('목표', 'Goals') },
        {
          type: 'list',
          style: 'bullet',
          items: [
            localize(
              'Adobe 분석 흐름에서 리타겟팅 캠페인 이후의 앱 재방문, 구매, 다운퍼널 이벤트가 끊기지 않도록 합니다.',
              'Make sure app revisits, purchases, and downstream events after retargeting campaigns would not be disconnected inside Adobe analytics workflows.',
            ),
            localize(
              '고객이 “왜 Adobe에 이 데이터가 필요하지?”를 이해할 수 있도록 리인게이지먼트와 리어트리뷰션의 역할을 업무 언어로 설명합니다.',
              'Explain the role of re-engagement and re-attribution in practical business language so the customer could understand why Adobe needed the data.',
            ),
            localize(
              '지원되지 않는 범위와 고객 영향도를 투명하게 공유하되, 동시에 해결 가능성을 만들기 위해 내부 제품 논의가 이어지도록 합니다.',
              'Transparently share the unsupported scope and customer impact while also creating a path for internal product discussions to continue toward resolution.',
            ),
            localize(
              '당장 필요한 Adobe 연동을 우선 해결하고, 이후 다른 애널리틱스 파트너로 확장될 수 있는 제품 기반을 남깁니다.',
              'Prioritize the Adobe integration the customer needed immediately while leaving a product foundation that could later extend to other analytics partners.',
            ),
          ],
        },
        { type: 'heading', level: 2, text: localize('접근 방식', 'Approach') },
        {
          type: 'list',
          style: 'bullet',
          items: [
            localize(
              '제품팀과 지원 범위를 확인해 Adobe 리인게이지먼트 연동의 미지원 범위를 검증했습니다.',
              'Validated the unsupported scope of Adobe re-engagement support with Product.',
            ),
            localize(
              '리더십과 논의해 지원되지 않는 범위와 고객 영향도를 투명하게 공유하는 방향을 정하고, 고객에게 리포팅 공백과 해결 방향을 설명했습니다.',
              'Aligned with leadership on transparently sharing the unsupported scope and customer impact, then explained the reporting gap and resolution direction to the customer.',
            ),
            localize(
              '고객의 이해와 동의를 바탕으로, 이 문제가 리타겟팅 성과 측정과 앱 전환 전략에 미치는 영향을 내부 설득 근거로 만들었습니다.',
              'With the customer aligned, turned the business impact on retargeting measurement and app transition strategy into internal rationale for action.',
            ),
          ],
        },
        { type: 'heading', level: 2, text: localize('실행 내용', 'Actions') },
        {
          type: 'list',
          style: 'bullet',
          items: [
            localize(
              '설득해야 할 팀과 의사결정자를 정리하고, 파트너팀, Product, 고객성공 리더십, Adobe 담당자와 각각 또는 함께 이해도를 맞추는 미팅을 진행했습니다.',
              'Mapped the teams and decision-makers that needed alignment, then ran individual and joint alignment meetings with Partnerships, Product, Customer Success leadership, and Adobe stakeholders.',
            ),
            localize(
              '고객 영향, 미지원 범위, 리인게이지먼트 데이터가 없을 때 생기는 리포팅 공백, 필요한 협업 범위를 관리 문서로 정리했습니다.',
              'Created a working document covering customer impact, unsupported scope, the reporting gap without re-engagement data, and the collaboration needed.',
            ),
            localize(
              'Adobe에 우선 필요한 연동을 제공하는 방향으로 논의를 좁히고, 구현에 필요한 내부 파트너팀과 Product의 역할을 맞췄습니다.',
              'Narrowed the discussion around delivering the Adobe integration the customer needed first, then aligned the roles of the internal partner team and Product.',
            ),
            localize(
              '고객에게는 미지원 범위만 전달하는 데서 끝내지 않고, 이 데이터가 필요한 이유와 해결 방향을 설명해 제품 논의의 비즈니스 근거를 명확히 했습니다.',
              'The customer conversation went beyond the unsupported scope by explaining why the data mattered and how a resolution could be pursued, clarifying the business rationale for product discussion.',
            ),
          ],
        },
        { type: 'heading', level: 2, text: localize('성과', 'Outcomes') },
        {
          type: 'list',
          style: 'bullet',
          items: [
            localize(
              'Adobe 리인게이지먼트 연동이 구현되어 고객이 리타겟팅 이후 앱 재방문과 다운퍼널 이벤트를 Adobe 분석 흐름에서 더 정확히 볼 수 있는 기반이 생겼습니다.',
              'Adobe re-engagement support was implemented, giving the customer a foundation to see app revisits and downstream events after retargeting more accurately inside Adobe analytics workflows.',
            ),
            localize(
              '이 프로젝트 자체는 Adobe 연동 제공이 우선이었고, 이후 Product 팀이 같은 기능을 Mixpanel 등 다른 애널리틱스 파트너로 확장했습니다.',
              'The project itself prioritized Adobe support, and Product later expanded the same capability to other analytics partners such as Mixpanel.',
            ),
            localize(
              '온보딩 과정에서 확인된 제품 공백을 고객 영향과 내부 실행 과제로 연결한 사례가 되었습니다.',
              'The case connected a product gap identified during onboarding to customer impact and an internal execution path.',
            ),
            localize(
              '기술적 지원 범위의 빈칸을 단순 support ticket으로 남기지 않고, 파트너와 제품팀이 함께 풀어야 할 실행 과제로 만들었습니다.',
              'Turned a technical support-scope gap into an execution project that required both partner and Product alignment, rather than leaving it as a support ticket.',
            ),
          ],
        },
        { type: 'heading', level: 2, text: localize('관련 기사', 'Related article') },
        {
          type: 'paragraph',
          text: localize(
            '이 기사는 Adobe 프로젝트를 통해 개발된 AppsFlyer 리인게이지먼트 지원이 이후 Mixpanel로 확장된 사례를 다룹니다.',
            'This article covers how AppsFlyer re-engagement support developed through the Adobe project later expanded to Mixpanel.',
          ),
        },
        {
          type: 'paragraph',
          text: localize(
            '리타겟팅 터치포인트, 앱 안 행동, 전환 데이터를 연결해야 리인게이지먼트 성과를 온전히 볼 수 있다는 내용입니다.',
            'It explains why re-engagement performance becomes complete only when the retargeting touchpoint, in-app behavior, and conversion data are connected.',
          ),
        },
        {
          type: 'paragraph',
          text: localize(
            '관련 기사: Mixpanel의 AppsFlyer 리인게이지먼트 연동 업데이트',
            'Related article: Mixpanel’s AppsFlyer re-engagement integration update',
          ),
          links: [
            {
              text: localize(
                '관련 기사: Mixpanel의 AppsFlyer 리인게이지먼트 연동 업데이트',
                'Related article: Mixpanel’s AppsFlyer re-engagement integration update',
              ),
              href: 'https://mixpanel.com/blog/appsflyer-integration/',
            },
          ],
        },
      ],
    },
  },
  {
    id: 'insider-integration-customization',
    title: localize(
      '전략 고객을 위한 Insider 다계정 연동 커스터마이징',
      'Custom Insider Multi-account Integration for a Strategic Enterprise Customer',
    ),
    customerContext: localize(
      'CRM, 개인화 메시지, 푸시·인앱 메시지 운영에 Insider를 사용하던 엔터프라이즈 고객에게 표준 1:1 연동으로는 처리하기 어려운 다계정 연동 구조가 필요했습니다.',
      'An enterprise customer using Insider for CRM, personalized messaging, and push/in-app messaging needed a multi-account integration structure that the standard one-to-one integration could not support.',
    ),
    focus: localize('부서 간 협업', 'Cross-Functional Collaboration'),
    contribution: [
      localize(
        'Insider 기술팀과 확인한 다계정 연동 요구사항을 고객 운영 영향, 보안 제약, 제품 지원 범위로 나눠 기술 요건으로 정리했습니다.',
        'Translated the multi-account integration requirement confirmed with Insider’s technical team into technical requirements covering customer impact, security constraints, and product scope.',
      ),
      localize(
        '앱 코드에 민감한 계정 정보를 넣지 않고 서버 측 매핑으로 필요한 값을 연결해야 한다는 방향을 Product, 파트너팀, 고객성공 리더십과 조율했습니다.',
        'Aligned Product, Partnerships, and Customer Success leadership around a server-side mapping approach that avoided placing sensitive account information in app code.',
      ),
      localize(
        '제품 디자인과 실제 개발은 Product/Engineering이 맡았고, 요구사항 정리, 내부 설득, 범위 조율, 고객·파트너 커뮤니케이션, 검증과 모니터링은 고객성공 측 실행 범위로 관리했습니다.',
        'Product and Engineering owned product design and development, while requirements documentation, internal advocacy, scope alignment, customer and partner communication, validation, and monitoring were managed from the Customer Success side.',
      ),
    ],
    outcome:
      localize(
        '고객 전용 Insider 연동 커스터마이징을 제공해 성과 측정 데이터 전달 공백을 줄였고, 갱신 방어, 업셀 기회, 플랫폼 사용 확대, 고객 관계 강화에 기여했습니다.',
        'Delivered a customer-specific Insider integration customization that reduced performance-measurement data gaps and supported renewal defense, upsell opportunity, broader platform usage, and a stronger customer relationship.',
      ),
    skills: [
      localize('Insider 연동', 'Insider Integration'),
      localize('제품 설득', 'Product Advocacy'),
      localize('이해관계자 조율', 'Stakeholder Alignment'),
      localize('커스텀 솔루션 범위 조율', 'Custom Solution Scoping'),
    ],
    modal: {
      eyebrow: localize('고객성공 사례 06', 'Customer Success Case 06'),
      title: localize(
        '전략 고객을 위한 Insider 다계정 연동 커스터마이징',
        'Custom Insider Multi-account Integration for a Strategic Enterprise Customer',
      ),
      summary: localize(
        '표준 1:1 Insider 연동으로는 고객사의 다계정 운영 구조를 처리할 수 없었습니다. 고객 운영상 필요한 성과 측정 데이터 흐름을 정리하고, 계정별 민감 정보가 앱 코드에 노출되지 않도록 서버 측 매핑 기반의 고객 전용 커스터마이징 범위를 조율한 사례입니다.',
        'The standard one-to-one Insider integration could not support the customer’s multi-account operating structure. The case clarified the performance-measurement data flow the customer needed and aligned the scope for a customer-specific customization based on server-side mapping so account-specific sensitive information would not be exposed in app code.',
      ),
      closeLabel: commonCloseLabel,
      openLabel: commonOpenLabel,
      contentBlocks: [
        { type: 'heading', level: 2, text: localize('상황', 'Context') },
        {
          type: 'paragraph',
          text: localize(
            '고객사는 Insider를 CRM, 개인화 메시지, 푸시·인앱 메시지 운영에 사용하고 있었습니다. Insider와의 연동 논의에서 표준 1:1 구조만으로는 고객사의 운영 구조를 지원하기 어렵다는 점이 확인되었습니다.',
            'The customer used Insider for CRM, personalized messaging, and push/in-app messaging. Integration discussions with Insider showed that the standard one-to-one structure could not fully support the customer’s operating model.',
          ),
        },
        {
          type: 'paragraph',
          text: localize(
            '이 구조에서는 계정별 민감 정보가 앱 코드에 노출되지 않도록, 서버 측에서 안전하게 라우팅 기준을 매핑하는 방식이 필요했습니다.',
            'The structure required routing criteria to be mapped safely on the server side so account-specific sensitive information would not be exposed in app code.',
          ),
        },
        { type: 'heading', level: 2, text: localize('과제', 'Challenges') },
        {
          type: 'list',
          style: 'bullet',
          items: [
            localize(
              '당시 표준 연동은 AppsFlyer 계정과 Insider 계정이 1:1로 연결되는 구조였지만, 이 고객사는 하나의 AppsFlyer 계정에서 여러 Insider 계정으로 데이터를 나눠 전달해야 했습니다.',
              'At the time, the standard integration connected one AppsFlyer account to one Insider account, but this customer needed data from one AppsFlyer account routed to multiple Insider accounts.',
            ),
            localize(
              '성과 측정 데이터가 Insider 쪽에 정확히 전달되지 않으면 CRM, 개인화 메시지, 푸시·인앱 메시지 운영에서 캠페인 성과를 제대로 판단하기 어려웠습니다.',
              'If performance-measurement data could not be passed accurately to Insider, the customer would struggle to evaluate CRM, personalized messaging, and push/in-app messaging campaigns.',
            ),
            localize(
              '다계정 라우팅에는 계정별 민감 정보가 얽혀 있었기 때문에 앱 코드에 값을 넣는 방식은 적절하지 않았고, 서버 측에서 안전하게 매핑해 전달하는 구조가 필요했습니다.',
              'Multi-account routing involved account-specific sensitive information, so putting values in app code was not appropriate; a safer server-side mapping approach was required.',
            ),
            localize(
              '이 구조를 요구한 고객은 사실상 한 곳뿐이어서, 정식 제품 기능으로 바로 확장하기보다 고객 전용 커스터마이징으로 푸는 방향이 현실적이었습니다.',
              'Because this structure was effectively requested by one customer, a customer-specific customization was more practical than turning it immediately into a standard product feature.',
            ),
          ],
        },
        { type: 'heading', level: 2, text: localize('고객 목표', 'Customer Goals') },
        {
          type: 'list',
          style: 'bullet',
          items: [
            localize(
              'Insider가 고객사의 CRM, 개인화 메시지, 푸시·인앱 메시지 운영에 필요한 성과 측정 데이터를 받을 수 있게 합니다.',
              'Enable Insider to receive the performance-measurement data needed for the customer’s CRM, personalized messaging, and push/in-app messaging operations.',
            ),
            localize(
              '표준 1:1 연동으로 처리되지 않는 다계정 운영 구조를 고객 전용 방식으로 안정적으로 지원합니다.',
              'Reliably support a multi-account operating structure that the standard one-to-one integration could not handle.',
            ),
            localize(
              '고객의 운영상 필수 요건을 해결해 플랫폼 사용 확대, 갱신 방어, 업셀 기회를 이어갈 수 있게 합니다.',
              'Address a critical operational requirement so broader platform usage, renewal defense, and upsell opportunity could continue.',
            ),
          ],
        },
        { type: 'heading', level: 2, text: localize('접근 방식', 'Approach') },
        {
          type: 'list',
          style: 'bullet',
          items: [
            localize(
              'Insider와 확인한 기술 요구사항을 고객 운영 흐름과 성과 측정 데이터 공백 기준으로 다시 정리했습니다.',
              'Reframed the technical requirements confirmed with Insider around the customer’s operating workflow and performance-measurement data gap.',
            ),
            localize(
              '고객의 전략적 가치, 미갱신 리스크, 업셀 가능성, 플랫폼 사용 확대 가능성, 운영상 필수 요건을 내부 설득 논리로 정리했습니다.',
              'Structured the internal case around the customer’s strategic value, non-renewal risk, upsell potential, broader platform usage, and critical operational need.',
            ),
            localize(
              '정식 기능화가 아니라 고객 전용 커스텀 기능으로 범위를 좁혀, Product와 Engineering이 현실적으로 구현할 수 있는 경로를 만들었습니다.',
              'Scoped the work as a customer-specific custom feature rather than full productization, creating a more realistic implementation path for Product and Engineering.',
            ),
          ],
        },
        { type: 'heading', level: 2, text: localize('실행 내용', 'Actions') },
        {
          type: 'list',
          style: 'bullet',
          items: [
            localize(
              'Insider 기술팀, Product, 파트너팀, 고객성공 리더십 사이에서 요구사항, 보안 제약, 구현 범위를 맞췄습니다.',
              'Aligned requirements, security constraints, and implementation scope across Insider’s technical team, Product, Partnerships, and Customer Success leadership.',
            ),
            localize(
              '고객 요구사항을 기술 요건으로 문서화하고, 민감 정보가 앱 코드에 노출되지 않는 서버 측 매핑 방향을 내부 논의의 기준으로 삼았습니다.',
              'Documented the customer requirement as technical requirements and used server-side mapping, avoiding exposure of sensitive information in app code, as the baseline for internal discussion.',
            ),
            localize(
              '제품 디자인과 실제 개발은 Product/Engineering이 맡았고, 내부 설득, 구현 범위 조율, 고객·파트너 커뮤니케이션, QA/검증, 출시 후 모니터링은 고객성공 측 실행 범위로 관리했습니다.',
              'Product and Engineering owned product design and development, while internal advocacy, implementation-scope alignment, customer and partner communication, QA/validation, and post-launch monitoring were managed from the Customer Success side.',
            ),
            localize(
              '고객 전용 커스터마이징으로 범위를 제한해 구현 가능성과 운영 안정성을 함께 맞췄습니다.',
              'Scoped the work as a customer-specific customization to balance implementation feasibility with operational stability.',
            ),
          ],
        },
        { type: 'heading', level: 2, text: localize('성과', 'Outcomes') },
        {
          type: 'list',
          style: 'bullet',
          items: [
            localize(
              '고객 전용 Insider 연동 커스터마이징을 제공해 CRM과 메시징 운영에 필요한 성과 측정 데이터 흐름을 지원했습니다.',
              'Delivered a customer-specific Insider integration customization that supported the performance-measurement data flow needed for CRM and messaging operations.',
            ),
            localize(
              '고객의 핵심 운영 요구사항을 해결하면서 갱신 방어, 업셀 기회, 플랫폼 사용 확대에 기여했습니다.',
              'Helped address a critical operational requirement while supporting renewal defense, upsell opportunity, and broader platform usage.',
            ),
            localize(
              '전략 고객의 특수 요구를 무리하게 정식 기능화하지 않고, 보안과 범위를 고려한 실행 가능한 커스텀 솔루션으로 조율했습니다.',
              'Turned a strategic customer’s special requirement into an executable custom solution with careful attention to security and scope, rather than forcing it into full productization.',
            ),
            localize(
              '고객 요구를 기술 요건으로 번역하고, 내부 제품팀과 외부 파트너 사이의 이해관계를 맞춰 엔터프라이즈 리스크를 관리한 사례입니다.',
              'This case shows the ability to translate customer needs into technical requirements, align internal product teams with an external partner, and manage enterprise account risk.',
            ),
          ],
        },
      ],
    },
  },
];

const customerCaseTranslationPairs: Array<readonly [string, string]> = [
  [
    `고객사의 API 도입 과제를 커스텀 콘솔로 풀어낸 사례`,
    `Solving a client's API adoption challenge with a custom console`,
  ],
  [
    `고객사의 OneLink API 도입 과정에서 반복적으로 나타나는 운영 마찰을 공개 문서 기반 레퍼런스 콘솔로 재구성한 사례입니다.`,
    `A case study that reconstructs recurring operational friction in a client's OneLink API adoption as a public-documentation-based reference console.`,
  ],
  [
    `OneLink CRUD API를 실제 업무에 도입하는 과정에서 생기는 이해도, 운영 방식, 개발 우선순위의 간극을 줄였습니다.`,
    `Reduced the gap between understanding, operations, and development priorities when adopting the OneLink CRUD API in real work.`,
  ],
  [
    `마케팅 팀에는 반복적인 캠페인 링크 운영을 직접 처리할 수 있는 제품형 워크플로우를, 개발팀에는 구현에 참고할 수 있는 작동 가능한 패턴을 제공했습니다.`,
    `Provided marketing teams with a productized workflow for handling recurring campaign link operations directly and gave developers a working implementation pattern to reference.`,
  ],
  [
    `설정, 생성, 대량 실행, 그룹 단위 업데이트, 개별 링크 추적까지 운영 전체 흐름을 다뤘습니다.`,
    `Covered the full operational flow, from setup and creation to bulk execution, group-level updates, and individual link tracking.`,
  ],
  [
    `추상적인 API 개념을 비즈니스 사용자와 개발자가 함께 이해할 수 있는 제품형 워크플로우로 바꿨습니다.`,
    `Turned an abstract API concept into a productized workflow that business users and developers could understand together.`,
  ],
  [`프로젝트 개요`, `Project overview`],
  [`원본 구현 저장소: OneLink Management Console`, `Source repository: OneLink Management Console`],
  [
    `이 프로젝트는 고객사가 OneLink CRUD API를 실제 업무에 도입하는 과정에서 겪는 이해도, 운영 방식, 개발 우선순위의 간극을 줄이기 위해 시작했습니다.`,
    `This project began to reduce the gap between understanding, operating model, and development priorities that appeared while a client was adopting the OneLink CRUD API in real work.`,
  ],
  [
    `API 자체의 가치는 비기술 사용자에게 추상적으로 느껴질 수 있지만, 마케팅 팀에서 반복적으로 나타나는 운영 니즈는 매우 구체적이었습니다. 대량의 캠페인 링크를 빠르게 만들고, 일관된 규칙으로 관리하며, 매번 개발팀에 수동 작업을 요청하지 않아도 되는 흐름이 필요했습니다.`,
    `The value of the API itself could feel abstract to non-technical users, but the recurring operational need inside marketing teams was very concrete: they needed a flow for creating many campaign links quickly, managing them with consistent rules, and avoiding manual developer requests each time.`,
  ],
  [
    `이 프로젝트는 그 두 지점을 연결합니다. 마케팅 팀에는 OneLink API가 캠페인 운영의 어떤 병목을 줄일 수 있는지 보여주고, 개발팀에는 실제 구현에 참고할 수 있는 작동 가능한 패턴을 제공합니다.`,
    `This project connects those two points. It shows marketing teams which campaign operations bottlenecks the OneLink API can reduce, while giving developers a working pattern they can reference for implementation.`,
  ],
  [
    `추상적인 API 개념을 비즈니스 사용자와 개발자가 함께 이해할 수 있는 제품형 워크플로우로 바꾼 프로젝트입니다.`,
    `Put simply, this project turns an abstract API concept into a productized workflow that business users and developers can understand together.`,
  ],
  [`이 사례에서 보여주고 싶은 점`, `What this case demonstrates`],
  [
    `이 프로젝트는 단순한 데모 UI가 아니라, 고객사의 OneLink API 도입을 막는 운영상의 병목을 공개 문서 기반 레퍼런스 콘솔로 재구성한 사례입니다.`,
    `This was not just a demo UI. It reconstructed the operational bottlenecks blocking a client's OneLink API adoption as a public-documentation-based reference console.`,
  ],
  [
    `비즈니스 사용자가 이해할 수 있는 화면과 개발팀이 참고할 수 있는 구현 패턴을 동시에 설계했습니다.`,
    `Designed screens that business users could understand and implementation patterns that the development team could reference.`,
  ],
  [
    `설정, 생성, 대량 실행, 그룹 단위 업데이트, 개별 링크 추적까지 운영 전체 흐름을 다룹니다.`,
    `Covers the full operational flow, from setup and creation to bulk execution, group-level updates, and individual link tracking.`,
  ],
  [
    `API 문서, 고객의 실제 업무 방식, 제품 UI, 개발 구현 기준 사이의 간극을 줄인 경험을 보여줍니다.`,
    `Shows experience reducing the gap between API documentation, the client's actual workflow, product UI, and development implementation standards.`,
  ],
  [`포트폴리오 전체 맥락에서의 연결점`, `How this connects to the broader portfolio`],
  [
    `이 프로젝트는 제가 고객성공 업무와 제품 구현 경험을 연결하는 방식을 보여줍니다. 고객사의 업무 흐름에서 API 도입을 어렵게 만드는 지점을 찾고, 이를 기술 조직과 비즈니스 사용자가 함께 이해할 수 있는 솔루션으로 바꿨습니다.`,
    `This project shows how I connect customer success work with product implementation experience. I identified where the client's workflow made API adoption difficult and turned that problem into a solution that technical teams and business users could understand together.`,
  ],
  [
    `문제 발견: 마케팅 팀에서 반복되는 캠페인 링크 운영 니즈에서 출발했습니다.`,
    `Problem discovery: Started from recurring campaign link operation needs inside marketing teams.`,
  ],
  [
    `요구사항 구조화: API 작업을 비즈니스 사용자가 이해할 수 있는 제품 흐름으로 바꿨습니다.`,
    `Requirement structuring: Turned API tasks into a product flow that business users could understand.`,
  ],
  [
    `구현과 협업: Next.js, TypeScript, React, MUI, SQLite 기반의 작동 가능한 앱으로 구현했습니다.`,
    `Implementation and collaboration: Built a working app with Next.js, TypeScript, React, MUI, and SQLite.`,
  ],
  [
    `도입 관점: 비즈니스 사용자와 개발팀 모두가 API의 유용성을 이해하고, 실제 운영에 연결할 수 있도록 설계했습니다.`,
    `Adoption perspective: Designed the flow so both business users and developers could understand the API's usefulness and connect it to real operations.`,
  ],
  [
    `포트폴리오 연결점: 고객 인터뷰, 기술 요구사항 정리, UI 설계, 작동 가능한 레퍼런스 구현까지 이어지는 엔드투엔드 문제 해결 방식을 보여줍니다.`,
    `Portfolio connection: Demonstrates an end-to-end problem-solving approach that moves from customer interviews and technical requirement definition to UI design and a working reference implementation.`,
  ],
  [`범위와 프로덕션 도입에 대한 노트`, `Notes on scope and production adoption`],
  [
    `이 프로젝트는 공개된 코드와 공개 API 문서를 바탕으로 만들어졌습니다. 내부 정보, 고객 기밀 정보, 비공개 제품 지식은 포함하지 않습니다. 본문에서 말하는 커스텀 콘솔은 특정 고객사의 내부 정보를 바탕으로 만든 것이 아니라, 공개 API 문서와 일반화 가능한 운영 패턴을 기반으로 재구성한 레퍼런스 구현입니다.`,
    `This project was built from public code and public API documentation. It does not include internal information, customer confidential information, or non-public product knowledge. The custom console described here is a reference implementation reconstructed from public API documentation and generalizable operational patterns, not from any specific client's internal data.`,
  ],
  [
    `프로젝트 개발과 본 문서 작성 과정에는 Codex와 Claude Code가 사용되었습니다.`,
    `Codex and Claude Code were used during project development and while preparing this document.`,
  ],
  [
    `화면과 문서 예시는 실제 API 데이터를 노출하거나 의존하지 않도록 목업 데이터로 구성했고, 별도 검증 과정에서 핵심 API 호출 흐름이 실제 API 환경에서도 동작하는지 확인했습니다.`,
    `The screens and document examples use mock data to avoid exposing or depending on real API data, while the core API call flows were separately validated in a real API environment.`,
  ],
  [
    `프로젝트는 로컬 개발과 레퍼런스 구현의 단순성을 위해 SQLite를 사용합니다. GitHub README에서는 프로덕션 도입 시 PostgreSQL 또는 이에 준하는 프로덕션급 관계형 데이터베이스 사용을 권장합니다.`,
    `The project uses SQLite for local development and reference implementation simplicity. The GitHub README recommends PostgreSQL, or an equivalent production-grade relational database, for production adoption.`,
  ],
  [
    `인증과 권한 관리는 이 레퍼런스 프로젝트에 구현되어 있지 않습니다. 실제 고객사 도입 시에는 Admin, Manager, Marketer, Read-only 사용자 역할 또는 조직에 맞는 커스텀 접근 규칙을 정의하는 것을 권장합니다.`,
    `Authentication and authorization are not implemented in this reference project. For a real client deployment, the project recommends defining roles such as Admin, Manager, Marketer, and Read-only, or custom access rules that fit the organization.`,
  ],
  [`1. 재사용 가능한 템플릿 설정에서 시작`, `1. Start with reusable template setup`],
  [
    `OneLink는 아무 정보 없이 생성될 수 없습니다. 연결할 앱, 딥링킹 동작, 라우팅 설정을 정의하는 템플릿이 필요하며, 이 템플릿은 A7k9와 같은 4자리 알파뉴메릭 Template ID로 식별됩니다.`,
    `A OneLink cannot be created without any context. It needs a template that defines the connected app, deep linking behavior, and routing settings. This template is identified by a four-character alphanumeric Template ID such as A7k9.`,
  ],
  [
    `그래서 저는 템플릿 등록을 설정 화면의 첫 단계로 만들었습니다. 사용자는 템플릿을 한 번 저장해두고 이후 링크 생성 워크플로우에서 반복해서 사용할 수 있습니다.`,
    `I made template registration the first step in the Settings page. Users can save a template once and reuse it throughout later link creation workflows.`,
  ],
  [`구현 관점에서 고려한 점`, `Implementation considerations`],
  [
    `API 키는 환경변수로 관리되지만, 키만으로 어떤 템플릿을 사용할 수 있는지는 알 수 없습니다.`,
    `The API key is managed through environment variables, but the key alone does not reveal which template should be used.`,
  ],
  [
    `이를 해결하기 위해 템플릿 등록 과정에서 한 번의 검증용 링크 요청을 수행합니다. 이 데모에서는 그 결과를 목업 응답 데이터로 표현했습니다.`,
    `To solve this, the template registration flow performs one probe link request. In this demo, the result is represented with mock response data.`,
  ],
  [
    `반환된 short link에서 a7k9.onelink.me와 같은 템플릿/도메인 정보를 파싱해 저장하고 이후 사용합니다.`,
    `The returned short link is parsed for template and domain information such as a7k9.onelink.me, then stored for later use.`,
  ],
  [
    `검증용 링크는 실제 캠페인 워크플로우에 사용하는 링크가 아니라, 템플릿 메타데이터를 찾고 검증하기 위한 용도입니다.`,
    `The probe link is not used in an actual campaign workflow. It exists to discover and validate template metadata.`,
  ],
  [`UI와 UX 관점에서 고려한 점`, `UI and UX considerations`],
  [
    `사용자가 설정 화면에서 시작하도록 한 이유는 템플릿 설정이 고급 옵션이 아니라 선행 조건이기 때문입니다.`,
    `Users start in Settings because template setup is not an advanced option. It is a prerequisite.`,
  ],
  [
    `폼은 사용자가 이미 템플릿을 식별하는 방식과 맞게 4자리 Template ID를 입력하도록 설계했습니다.`,
    `The form asks for a four-character Template ID, matching how users already identify templates.`,
  ],
  [
    `저장된 템플릿은 생성 플로우에서 선택 옵션으로 재사용되어 반복 입력과 오류를 줄입니다.`,
    `Saved templates are reused as selectable options in the creation flow, reducing repeated input and mistakes.`,
  ],
  [
    `목표는 API 설정을 일회성 기술 작업이 아니라 반복 사용 가능한 워크스페이스 설정처럼 느끼게 하는 것이었습니다.`,
    `The goal was to make API setup feel like a reusable workspace setting, not a one-time technical task.`,
  ],
  [
    `2. 고객사의 다양한 운영 시나리오를 생성 경로로 분리하기`,
    `2. Separate different client operation scenarios into creation paths`,
  ],
  [
    `설정이 끝나면 사용자는 단일 링크를 만들지, 링크 그룹을 만들지 선택합니다. 이렇게 하면 시작점이 단순해지고, 모든 사용자를 처음부터 복잡한 대량 생성 플로우로 밀어 넣지 않을 수 있습니다.`,
    `After setup, users choose whether to create a single link or a link group. This keeps the starting point simple and avoids pushing every user into a complex bulk creation flow immediately.`,
  ],
  [
    `이 콘솔은 본래 대량 링크 생성, 업데이트, 관리를 위해 설계되었습니다. 처음에는 API의 장점이 가장 크게 드러나는 대량 생성만 다룰까도 생각했습니다.`,
    `This console was originally designed for bulk link creation, updates, and management. At first, I considered focusing only on bulk creation, where the API's value is most visible.`,
  ],
  [
    `하지만 콘솔을 도입하는 고객은 보통 모든 링크 운영을 그 안에서 해결하고 싶어 합니다. 단일 작업을 위해 다시 기존 대시보드로 돌아가고 싶어 하지 않습니다. 그래서 단일 링크 생성 케이스도 함께 포함했습니다.`,
    `However, clients adopting a console usually want to handle all link operations inside it. They do not want to return to the existing dashboard for a single-link task, so I included the single-link creation case as well.`,
  ],
  [
    `단일 링크와 링크 그룹은 같은 API 기반을 공유하지만 서로 다른 사용자 과업을 해결합니다.`,
    `Single links and link groups share the same API foundation, but they solve different user tasks.`,
  ],
  [
    `두 경로를 분리하면 코드의 책임도 명확해지고 사용자 여정도 설명하기 쉬워집니다.`,
    `Separating the two paths clarifies code responsibility and makes the user journey easier to explain.`,
  ],
  [
    `처음부터 API 세부사항을 노출하지 않고, 두 개의 명확한 카드로 사용자의 과업을 선택하게 했습니다.`,
    `Instead of exposing API details from the start, the UI lets users choose their task through two clear cards.`,
  ],
  [
    `사용자는 자신의 목적에 따라 한 개의 캠페인 링크를 만들지, 여러 구조화된 링크 변형을 만들지 결정할 수 있습니다.`,
    `Users can decide whether they need one campaign link or multiple structured link variations.`,
  ],
  [
    `3. API 페이로드 복잡도를 비즈니스 입력 폼으로 번역하기`,
    `3. Translate API payload complexity into a business input form`,
  ],
  [
    `단일 링크 생성 폼은 필수 API 파라미터를 읽기 쉬운 필드로 바꿉니다. 링크 이름, 템플릿, 미디어 소스, 캠페인, 딥링크, 대체 URL, 추가 파라미터 등을 사용자가 이해하기 쉬운 형태로 입력하게 합니다.`,
    `The single-link creation form turns required API parameters into readable fields. Users enter link name, template, media source, campaign, deep link, fallback URL, and additional parameters in a form they can understand.`,
  ],
  [
    `이렇게 하면 마케터가 원시 페이로드를 먼저 읽지 않아도 API가 무엇을 할 수 있는지 이해할 수 있습니다.`,
    `This lets marketers understand what the API can do without reading the raw payload first.`,
  ],
  [
    `필수 필드는 API 실행 전에 검증합니다.`,
    `Required fields are validated before the API call runs.`,
  ],
  [
    `선택적인 딥링킹과 리다이렉션 필드는 사용자의 의도 기준으로 그룹화했습니다.`,
    `Optional deep linking and redirection fields are grouped around the user's intent.`,
  ],
  [
    `고급 캠페인 트래킹을 위해 추가 파라미터는 유연하게 남겨두었습니다.`,
    `Additional parameters remain flexible for advanced campaign tracking.`,
  ],
  [
    `폼은 원시 JSON 구조가 아니라 캠페인 설정의 사고방식을 따릅니다.`,
    `The form follows the way people think about campaign setup, not the raw JSON structure.`,
  ],
  [
    `딥링킹과 대체 이동 동작을 시각적으로 분리해 앱 사용자와 웹 사용자가 각각 어디로 이동하는지 이해하기 쉽게 했습니다.`,
    `Deep linking and fallback behavior are visually separated so users can understand where app users and web users will go.`,
  ],
  [`4. 프리셋과 네이밍 규칙 유지하기`, `4. Maintain presets and naming rules`],
  [
    `링크 생성을 확장하기 전에, 팀은 값을 일관되게 유지할 방법이 필요합니다. 설정 화면에서는 미디어 소스, 캠페인, 광고 세트, 채널, 딥링크 URI, 대체 URL, 커스텀 파라미터 같은 공통 필드의 재사용 가능한 프리셋을 저장할 수 있습니다.`,
    `Before scaling link creation, teams need a way to keep values consistent. In Settings, they can save reusable presets for common fields such as media source, campaign, ad set, channel, deep link URI, fallback URL, and custom parameter.`,
  ],
  [
    `이는 이미 네이밍 컨벤션을 운영하는 조직에 특히 유용합니다. 콘솔은 모든 사용자가 조금씩 다른 이름을 직접 입력하게 두는 대신 승인된 값으로 안내할 수 있습니다.`,
    `This is especially useful for organizations that already run naming conventions. Instead of letting every user type slightly different names, the console can guide them toward approved values.`,
  ],
  [
    `모든 네이밍 규칙이 고정 목록인 것은 아닙니다. 일부 값은 특정 형식을 따라야 합니다. 예를 들어 지역과 캠페인은 프리셋 값에서 선택하고, 배치 코드는 네 자리 숫자 같은 정규식 형식을 따르게 할 수 있습니다.`,
    `Not every naming rule is a fixed list. Some values need to follow a specific format. For example, region and campaign can be selected from presets, while batch code can follow a regex format such as four digits.`,
  ],
  [
    `프리셋 값은 중앙에 저장하고 단일 링크 및 링크 그룹 생성 폼에서 재사용합니다.`,
    `Preset values are stored centrally and reused in both single-link and link-group creation forms.`,
  ],
  [
    `네이밍 컨벤션 슬롯은 고정 프리셋 값 또는 정규식 기반 검증을 사용할 수 있습니다.`,
    `Naming convention slots can use fixed preset values or regex-based validation.`,
  ],
  [
    `이를 통해 API 실행 전에 가벼운 거버넌스 레이어를 만들 수 있습니다.`,
    `This creates a lightweight governance layer before the API call runs.`,
  ],
  [
    `사용자는 프리셋을 선택 가능한 값으로 보므로 승인된 네이밍 규칙을 외울 필요가 없습니다.`,
    `Users see presets as selectable values, so they do not need to memorize approved naming rules.`,
  ],
  [
    `정규식 규칙은 처음부터 원시 검증 로직으로 보여주지 않고, 슬롯 단위의 제약으로 표현했습니다.`,
    `Regex rules are not shown as raw validation logic from the start. They are expressed as slot-level constraints.`,
  ],
  [
    `목표는 캠페인 네이밍을 일관되게 유지하면서도 폼이 엔지니어링 도구처럼 느껴지지 않게 하는 것이었습니다.`,
    `The goal was to keep campaign naming consistent without making the form feel like an engineering tool.`,
  ],
  [
    `5. 대량 운영 니즈를 링크 그룹 워크플로우로 구조화하기`,
    `5. Structure bulk operation needs into a link-group workflow`,
  ],
  [
    `마케팅 팀에서 반복적으로 나타나는 니즈는 링크 하나를 만드는 데서 끝나지 않습니다. 미디어 소스, 캠페인, 애드셋, 광고 단위에 걸쳐 많은 캠페인 링크가 필요합니다.`,
    `The recurring need inside marketing teams does not end with creating one link. They need many campaign links across media sources, campaigns, ad sets, and ads.`,
  ],
  [
    `저는 링크 그룹 플로우를 미디어 소스 -> 캠페인 -> 광고 세트 -> 광고의 4단계 위계 구조를 중심으로 설계했습니다. 이를 통해 사용자는 같은 설정을 반복 입력하지 않고도 하나의 캠페인 구조에서 여러 링크 변형을 만들 수 있습니다.`,
    `I designed the link-group flow around a four-level hierarchy: Media Source -> Campaign -> Ad Set -> Ad. This lets users branch one campaign structure into multiple link variations without repeatedly entering the same settings.`,
  ],
  [
    `현재 구현에서는 사용자가 위계를 점진적으로 만듭니다. 먼저 미디어 소스 값을 추가하고, 하위 값을 받을 칩을 선택한 뒤 캠페인, 광고 세트, 광고 단계로 트리를 확장합니다.`,
    `In the current implementation, users build the hierarchy progressively. They first add Media Source values, select the chip that should receive child values, and then expand the tree through Campaign, Ad Set, and Ad levels.`,
  ],
  [
    `트리 빌더는 스프레드시트 행, 탭 구분 값, 줄바꿈, 쉼표, 세미콜론 붙여넣기를 지원합니다. 사용자는 여러 항목을 한 번에 붙여넣고, 이 값들이 올바른 위계로 묶이는 것을 확인할 수 있습니다.`,
    `The tree builder supports pasted spreadsheet rows, tab-separated values, line breaks, commas, and semicolons. Users can paste many items at once and confirm that the values are grouped into the correct hierarchy.`,
  ],
  [
    `미리보기 패널은 실행 전에 링크 구조를 보여주므로 사용자는 최종 링크 그룹을 한눈에 파악할 수 있습니다.`,
    `The Preview panel shows the link structure before execution, so users can understand the final link group at a glance.`,
  ],
  [
    `편집 속도와 실수 복구도 함께 고려했습니다. 사용자는 위계 칩을 선택하고, 범위 선택이나 드래그 선택을 사용하며, 전체 트리를 다시 만들지 않고도 그룹 항목을 확인 후 삭제할 수 있습니다.`,
    `I also considered editing speed and recovery from mistakes. Users can select hierarchy chips, use range or lasso selection, and delete group items after reviewing them without rebuilding the whole tree.`,
  ],
  [
    `파라미터는 전체 링크에 적용하거나 선택한 브랜치에만 적용할 수 있습니다. 특정 캠페인, 애드셋, 광고만 다른 트래킹 값을 써야 할 때 유연하게 대응할 수 있습니다.`,
    `Parameters can apply to all links or only to a selected branch. This supports cases where only a specific campaign, ad set, or ad needs different tracking values.`,
  ],
  [
    `트리 구조는 사용자에게 보이는 위계를 가장 아래 단계에 있는 각 링크의 API 페이로드로 매핑합니다.`,
    `The tree structure maps the user-visible hierarchy into the API payload for each leaf link.`,
  ],
  [
    `각 생성 링크는 전역 파라미터를 상속한 뒤 선택된 브랜치의 재정의를 적용할 수 있습니다.`,
    `Each generated link inherits global parameters and can then apply overrides from the selected branch.`,
  ],
  [
    `생성된 각 항목의 실행 상태를 따로 추적하므로 일부 실패가 발생해도 전체 워크플로우를 처음부터 다시 시작하지 않고 재시도할 수 있습니다.`,
    `The execution state of each generated item is tracked separately, so partial failures can be retried without restarting the whole workflow.`,
  ],
  [
    `대량 생성은 거대한 원시 파라미터 테이블이 아니라 트리 구조로 표현했습니다.`,
    `Bulk creation is represented as a tree structure, not a massive raw parameter table.`,
  ],
  [
    `스프레드시트식 붙여넣기는 마케터가 이미 캠페인 데이터를 준비하는 방식을 지원합니다.`,
    `Spreadsheet-style paste supports the way marketers already prepare campaign data.`,
  ],
  [
    `드래그 선택과 그룹 삭제는 반복적인 정리 작업을 줄입니다.`,
    `Drag selection and group deletion reduce repetitive cleanup work.`,
  ],
  [
    `미리보기는 생성될 링크 수와 각 링크가 속한 위치를 계속 확인할 수 있게 합니다.`,
    `The Preview keeps users aware of how many links will be created and where each link belongs.`,
  ],
  [
    `공식 문서와 고객사 데이터 구조 사이를 잇는 S2S 구현 가이드`,
    `S2S implementation guide bridging official documentation and client data structure`,
  ],
  [
    `공식 문서는 API 스펙을 설명하지만, 실제 고객 구현에서는 CUID와 AFID를 어떻게 연결하고 운영할지 먼저 정해야 했습니다.`,
    `Official documentation explains the API specification, but in real client implementations, the first decision was how to connect and operate CUID and AFID.`,
  ],
  [
    `AppsFlyer S2S Event API의 엔드포인트, 인증, 파라미터를 고객사 구현 맥락으로 다시 정리했습니다.`,
    `Reorganized the AppsFlyer S2S Event API endpoint, authentication, and parameters around the client's implementation context.`,
  ],
  [
    `AFID-CUID 매핑 테이블 설계, Data Locker 기반 로데이터 적재, 전송 조건을 실행 가능한 가이드로 만들었습니다.`,
    `Turned AFID-CUID mapping table design, Data Locker raw-data ingestion, and event sending conditions into an actionable guide.`,
  ],
  [
    `에러 처리, 보안, 모니터링 기준까지 포함해 고객 개발팀이 실제로 따라갈 수 있는 기준을 제시했습니다.`,
    `Provided practical standards the client's development team could follow, including error handling, security, and monitoring criteria.`,
  ],
  [
    `고객사의 실제 데이터 구조와 AppsFlyer의 필수 식별자 체계 사이에 생기는 이해의 간극을 줄였습니다.`,
    `Reduced the understanding gap between the client's real data structure and AppsFlyer's required identifier system.`,
  ],
  [
    `공식 문서는 API 스펙을 설명합니다. 실제 고객 구현에서는 다른 지점에서 먼저 막힙니다. 고객사의 내부 사용자 ID인 CUID를 AppsFlyer ID인 AFID와 어떻게 연결하고 운영할지 정해야 합니다. 이 케이스는 그 빈칸을 구현 가능한 가이드로 바꾼 사례입니다.`,
    `Official documentation explains the API specification. In real client implementations, a different issue often appears first: how to map the client's internal user ID, CUID, to AppsFlyer's ID, AFID, and keep that mapping operational. This case turned that blank space into an implementable guide.`,
  ],
  [
    `AppsFlyer S2S Event API를 도입하려는 고객사는 내부 데이터 플랫폼에 있는 백엔드 이벤트를 AppsFlyer로 보내고 싶어 했습니다. 대상은 앱 안에서 안정적으로 측정하기 어렵거나 서버 측 검증이 필요한 이벤트였고, 이 이벤트를 Audience 룰과 외부 미디어 연동에 활용해야 했습니다.`,
    `The client wanted to send backend events from its internal data platform to AppsFlyer through the AppsFlyer S2S Event API. The target events were those that were difficult to measure reliably inside the app or required server-side validation, and the client needed to use them for Audience rules and external media integrations.`,
  ],
  [
    `문제는 API 호출 자체가 아니었습니다. AppsFlyer S2S API는 appsflyer_id를 필수 키로 요구하지만, 고객사의 내부 데이터 플랫폼은 customer_user_id를 기준으로 움직입니다. 두 식별자를 연결하는 운영 로직이 없으면 이벤트를 안정적으로 보낼 수 없습니다.`,
    `The issue was not the API call itself. The AppsFlyer S2S API requires appsflyer_id as a mandatory key, while the client's internal data platform operates around customer_user_id. Without operating logic to connect the two identifiers, events cannot be sent reliably.`,
  ],
  [
    `저는 공식 문서의 엔드포인트, 인증, 파라미터 설명을 고객사 구현 맥락으로 다시 정리하고, AFID-CUID 매핑 테이블 설계, Data Locker 기반 로데이터 적재, 전송 조건, 에러 처리, 보안, 모니터링 기준까지 포함한 고객사 환경에 적용 가능한 구현 가이드를 만들었습니다.`,
    `I reorganized the official documentation's endpoint, authentication, and parameter explanations around the client's implementation context, then created an implementation guide that could be applied to the client's environment, covering AFID-CUID mapping table design, Data Locker raw-data ingestion, sending conditions, error handling, security, and monitoring standards.`,
  ],
  [`고객이 막힌 지점`, `Where the client got stuck`],
  [
    `공식 문서는 고객사마다 다른 데이터 구조를 모두 가정할 수 없습니다. 그래서 “CUID를 어떤 방식으로 AFID와 매핑해야 하는가” 같은 운영 로직은 깊게 다루기 어렵습니다. 고객 개발팀이 가장 이해하기 어려워한 부분이 바로 여기였습니다.`,
    `Official documentation cannot account for every client's data structure. That makes it hard to cover operating logic such as "how should CUID be mapped to AFID" in depth. This was the part the client's development team found hardest to understand.`,
  ],
  [
    `고객사 데이터 플랫폼에는 CUID만 있는데 AFID는 어디서 가져와야 하는가`,
    `If the client's data platform only has CUID, where should AFID come from?`,
  ],
  [
    `AFID와 CUID를 어떤 테이블 구조로 저장해야 하는가`,
    `What table structure should store AFID and CUID?`,
  ],
  [
    `동일 사용자가 여러 디바이스를 쓰거나 디바이스를 바꾸면 어떤 AFID를 사용해야 하는가`,
    `Which AFID should be used when the same user has multiple devices or changes devices?`,
  ],
  [
    `매핑이 안 된 이벤트는 전송해야 하는가, 제외해야 하는가`,
    `Should unmapped events be sent or excluded?`,
  ],
  [
    `S2S 이벤트가 기존 SDK 이벤트 데이터를 오염시키지는 않는가`,
    `Could S2S events contaminate existing SDK event data?`,
  ],
  [
    `200 OK 응답을 받으면 실제로 Audience와 대시보드에 반영됐다고 볼 수 있는가`,
    `Does a 200 OK response mean the event is actually reflected in Audiences and dashboards?`,
  ],
  [
    `고객사는 “우리 회사 사용자 번호”를 알고 있고 AppsFlyer는 “AppsFlyer가 붙인 디바이스 번호”를 요구하는 상황이었습니다. 두 번호를 연결하는 명단을 만들고 계속 최신 상태로 유지해야 했습니다.`,
    `Put simply, the client knew "our company's user number," while AppsFlyer required "the device number assigned by AppsFlyer." The team needed a list that connected the two numbers and kept it up to date.`,
  ],
  [`제공한 해결책`, `Solution provided`],
  [`1. 엔드투엔드 데이터 흐름 정리`, `1. Define the end-to-end data flow`],
  [
    `앱에서 SDK 이벤트가 전송되기 전에 customer_user_id를 설정해 로데이터에 CUID와 AFID가 함께 남도록 합니다.`,
    `Set customer_user_id before SDK events are sent from the app so CUID and AFID appear together in raw data.`,
  ],
  [
    `AppsFlyer Data Locker 또는 Pull/Push API로 install, re-engagement, re-attribution, in-app event 로데이터를 고객사 데이터 플랫폼에 적재합니다.`,
    `Load install, re-engagement, re-attribution, and in-app event raw data into the client's data platform through AppsFlyer Data Locker or Pull/Push API.`,
  ],
  [
    `로데이터에서 appsflyer_id와 customer_user_id를 추출해 AFID-CUID 매핑 테이블을 만듭니다.`,
    `Extract appsflyer_id and customer_user_id from raw data to create the AFID-CUID mapping table.`,
  ],
  [
    `데이터 플랫폼에서 S2S 대상 이벤트가 발생하면 CUID로 사용자를 식별합니다.`,
    `When an S2S target event occurs in the data platform, identify the user by CUID.`,
  ],
  [`매핑 테이블에서 AFID를 조회합니다.`, `Look up AFID in the mapping table.`],
  [
    `매핑에 성공한 이벤트만 AppsFlyer S2S In-app Event API로 전송합니다.`,
    `Send only successfully mapped events to the AppsFlyer S2S In-app Event API.`,
  ],
  [
    `AppsFlyer는 AFID 기준으로 이벤트를 해당 디바이스/유저에 기록하며, 설정 조건을 만족한 이벤트는 Audience 룰과 외부 미디어 연동에 활용될 수 있습니다.`,
    `AppsFlyer records the event against the relevant device/user by AFID, and events that meet the configured conditions can be used for Audience rules and external media integrations.`,
  ],
  [
    `2. AFID-CUID 매핑 테이블 운영 방식 제안`,
    `2. Propose how to operate the AFID-CUID mapping table`,
  ],
  [
    `최소 필드: appsflyer_id, customer_user_id, platform, last_seen_at`,
    `Minimum fields: appsflyer_id, customer_user_id, platform, last_seen_at`,
  ],
  [
    `신규 install, re-engagement, re-attribution 발생 시 delta upsert로 매핑 갱신`,
    `Update mappings with delta upserts when new install, re-engagement, or re-attribution events occur`,
  ],
  [
    `동일 CUID에 여러 AFID가 있을 수 있으므로 가장 최근 활동 AFID를 기본값으로 사용`,
    `Because one CUID can have multiple AFIDs, use the most recently active AFID as the default`,
  ],
  [
    `과거 AFID는 보존해 트러블슈팅과 검증에 활용`,
    `Preserve historical AFIDs for troubleshooting and validation`,
  ],
  [
    `매핑 테이블에 없는 CUID는 S2S 전송 대상에서 제외하고 별도 미매핑 큐에 저장`,
    `Exclude CUIDs that are not in the mapping table from S2S sending and store them in a separate unmapped queue`,
  ],
  [`추후 AFID가 발견되면 백필 가능성을 검토`, `Review backfill options if AFID is found later`],
  [`3. API 구현 가이드 정리`, `3. Organize the API implementation guide`],
  [`v3 엔드포인트와 app_id 형식 안내`, `Explain the v3 endpoint and app_id format`],
  [
    `S2S Key 발급 경로와 authentication 헤더 사용 방식 정리`,
    `Document where to issue the S2S Key and how to use the authentication header`,
  ],
  [
    `Authorization Bearer가 아니라 authentication 커스텀 헤더를 써야 한다는 점 명시`,
    `Clarify that the custom authentication header should be used instead of Authorization Bearer`,
  ],
  [`Android, iOS별 식별자 파라미터 구분`, `Separate identifier parameters for Android and iOS`],
  [
    `eventName, eventValue, eventTime, eventCurrency 등 필수/권장 필드 정리`,
    `Organize required and recommended fields such as eventName, eventValue, eventTime, and eventCurrency`,
  ],
  [`요청 예시와 응답 코드별 조치 방식 제공`, `Provide request examples and actions by response code`],
  [`구현 고려사항`, `Implementation considerations`],
  [`데이터 정확도`, `Data accuracy`],
  [
    `AFID가 없는 이벤트는 임의 값으로 보내지 않습니다. 잘못된 디바이스에 이벤트가 기록될 수 있기 때문입니다.`,
    `Events without AFID should not be sent with arbitrary values because the event could be recorded on the wrong device.`,
  ],
  [
    `SDK 이벤트와 S2S 이벤트가 같은 행동을 중복 기록하지 않도록 이벤트명을 분리합니다.`,
    `Separate event names so SDK events and S2S events do not duplicate the same user action.`,
  ],
  [
    `eventTime은 UTC 기준으로 통일해 어트리뷰션 윈도와 리포팅 오차를 줄입니다.`,
    `Standardize eventTime in UTC to reduce attribution-window and reporting discrepancies.`,
  ],
  [`에러 처리`, `Error handling`],
  [
    `5xx 응답은 지수 백오프로 정해진 횟수만큼 재시도하고, 계속 실패하면 DLQ로 이동합니다.`,
    `5xx responses are retried a defined number of times with exponential backoff, then moved to the DLQ if they continue to fail.`,
  ],
  [
    `4xx 응답은 재시도보다 페이로드, 인증, 필수값, JSON 형식을 먼저 검증합니다.`,
    `For 4xx responses, validate payload, authentication, required values, and JSON format before retrying.`,
  ],
  [
    `AppsFlyer는 별도 idempotency key를 받지 않으므로 CUID, eventName, eventTime 해시 또는 nonce 조합으로 중복을 방지합니다.`,
    `AppsFlyer does not accept a separate idempotency key, so prevent duplicates with a combination such as CUID, eventName, eventTime hash, or nonce.`,
  ],
  [`보안과 운영`, `Security and operations`],
  [
    `S2S Key는 Vault 또는 KMS로 관리하고 코드, Git, 로그에 남기지 않습니다.`,
    `Manage the S2S Key in Vault or KMS, and do not leave it in code, Git, or logs.`,
  ],
  [
    `PII는 eventValue에 직접 담지 않고, 허용된 필드와 고객사 개인정보 처리 기준에 맞춰 정규화 후 SHA-256 해시 여부를 결정합니다.`,
    `Do not put PII directly into eventValue. Decide whether to normalize and apply SHA-256 hashing based on allowed fields and the client's privacy handling standards.`,
  ],
  [
    `로그에는 AFID, CUID, eventName, eventTime, responseCode 중심으로 남기고 전체 페이로드는 마스킹합니다.`,
    `Log mainly AFID, CUID, eventName, eventTime, and responseCode, while masking the full payload.`,
  ],
  [
    `전송량, 4xx 비율, 매핑 실패율, 200 OK 이후 로데이터 또는 Live Events Viewer 기준의 반영 여부를 샘플링해 모니터링합니다.`,
    `Monitor send volume, 4xx rate, mapping failure rate, and sample whether events appear in raw data or Live Events Viewer after 200 OK responses.`,
  ],
  [`왜 이 사례가 중요한가`, `Why this case matters`],
  [
    `이 케이스는 단순히 API 문서를 요약한 일이 아닙니다. 고객사의 실제 데이터 구조와 AppsFlyer의 필수 식별자 체계 사이에 생기는 이해의 간극을 줄인 일입니다.`,
    `This case was not just a summary of API documentation. It reduced the understanding gap between the client's real data structure and AppsFlyer's required identifier system.`,
  ],
  [
    `공식 문서가 말하는 것은 “무엇을 보내야 하는가”입니다. 고객이 어려워한 것은 “우리 시스템에서 그 값을 어떻게 찾아 안정적으로 운영할 것인가”였습니다. 저는 그 질문을 데이터 플로우, 매핑 정책, 전송 조건, 예외 처리, 모니터링 기준으로 나눠 실행 가능한 형태로 정리했습니다.`,
    `Official documentation explains "what to send." The client's harder question was "how do we find that value in our system and operate it reliably?" I broke that question into data flow, mapping policy, sending conditions, exception handling, and monitoring standards, then turned it into an actionable guide.`,
  ],
  [`원본 가이드: AppsFlyer S2S 구현 가이드`, `Source: AppsFlyer S2S implementation guide`],
  [`API 연동`, `API Integration`],
  [`API 워크플로우`, `API Workflow`],
  [`제품형 콘솔`, `Productized Console`],
  [`운영 UX`, `Operational UX`],
  [`서버 간 연동`, `Server-to-Server Integration`],
  [`S2S 이벤트 API`, `S2S Event API`],
  [`AFID-CUID 매핑`, `AFID-CUID Mapping`],
  [`모니터링`, `Monitoring`],
  [`부서 간 협업`, `Cross-Functional Collaboration`],
  [`Insider 연동`, `Insider Integration`],
  [`제품 설득`, `Product Advocacy`],
  [`이해관계자 조율`, `Stakeholder Alignment`],
  [`커스터마이징`, `Customization`],
  [`프라이빗 고객 워크숍`, `Private Customer Workshop`],
  [`워크숍 설계`, `Workshop Design`],
  [`글로벌 정착 지원`, `Global Enablement`],
  [`도입 전략`, `Adoption Strategy`],
  [`프로젝트 관리`, `Project Management`],
  [`고객성공 사례 01`, `Customer Success Case 01`],
  [`고객성공 사례 02`, `Customer Success Case 02`],
  [`고객성공 사례 03`, `Customer Success Case 03`],
  [`고객성공 사례 04`, `Customer Success Case 04`],
  [`요약`, `Summary`],
  [`원본 자료`, `Source artifact`],
  [
    `OneLink Management Console 템플릿 설정 화면`,
    `OneLink Management Console template settings screen`,
  ],
  [
    `OneLink Management Console 생성 경로 선택 화면`,
    `OneLink Management Console create path selection screen`,
  ],
  [
    `OneLink Management Console 단일 링크 생성 폼`,
    `OneLink Management Console single link creation form`,
  ],
  [
    `OneLink Management Console 재사용 프리셋 설정 화면`,
    `OneLink Management Console reusable preset settings screen`,
  ],
  [
    `OneLink Management Console 네이밍 규칙 슬롯 설정 화면`,
    `OneLink Management Console naming rule slot settings screen`,
  ],
  [
    `OneLink Management Console 링크 그룹 워크플로우 화면`,
    `OneLink Management Console link group workflow screen`,
  ],
  [
    `OneLink Management Console 링크 그룹 트리 미리보기 화면`,
    `OneLink Management Console link group tree preview screen`,
  ],
  [
    `OneLink Management Console 대량 선택 및 삭제 화면`,
    `OneLink Management Console bulk selection and deletion screen`,
  ],
  [
    `OneLink Management Console 브랜치별 파라미터 재정의 화면`,
    `OneLink Management Console branch-level parameter override screen`,
  ],
  [`Challenges`, `과제`],
  [`Customer Goals`, `고객 목표`],
  [`Approach`, `접근 방식`],
  [`Actions`, `실행 내용`],
  [`Outcomes`, `성과`],
  [`Action`, `실행 내용`],
  [`Photo after the London workshop`, `런던 워크숍 이후 촬영한 사진`],
  [
    `Pre vs Post workshop survey showing increased product knowledge and confidence`,
    `제품 이해도와 사용 자신감 향상을 보여주는 워크숍 전후 설문 결과`,
  ],
];

const koreanTextPattern = /[ㄱ-ㅎㅏ-ㅣ가-힣]/;

customerCaseTranslationPairs.forEach(([firstText, secondText]) => {
  if (!koreanTextPattern.test(firstText) && koreanTextPattern.test(secondText)) {
    registerTranslation(secondText, firstText);

    return;
  }

  registerTranslation(firstText, secondText);
});
