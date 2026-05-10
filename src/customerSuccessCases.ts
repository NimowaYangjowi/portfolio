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
    id: 'insider-integration-customization',
    title: 'Cross-Functional Collaboration: Insider Integration Customization',
    customerContext:
      'The client required an Insider integration scenario that was not officially supported by the standard product and is still available only as an account-specific customization for this one client.',
    focus: 'Cross-Functional Collaboration',
    contribution: [
      'Documented the client’s specific integration needs and technical requirements.',
      'Presented the client’s strategic value and non-renewal risk to internal stakeholders.',
      'Collaborated with the product team to design and implement a bespoke Insider integration customization.',
    ],
    outcome:
      'Delivered a customer-specific Insider integration customization, strengthened the client relationship, and supported renewal and upsell.',
    skills: ['Insider Integration', 'Product Advocacy', 'Stakeholder Alignment', 'Customization'],
    modal: {
      eyebrow: 'Customer Success Case 03',
      title: 'Cross-Functional Collaboration: Insider Integration Customization',
      summary:
        'A strategically important enterprise client needed an Insider integration path that was not officially supported as a standard product feature, requiring alignment across customer success, product, and leadership teams.',
      closeLabel: commonCloseLabel,
      openLabel: commonOpenLabel,
      contentBlocks: [
        { type: 'heading', level: 2, text: 'Challenges' },
        {
          type: 'list',
          style: 'bullet',
          items: [
            'The client required an Insider integration scenario that was not officially supported by the standard product and is still available only as an account-specific customization for this one client.',
            'The lack of this integration hindered the client’s ability to meet key operational needs, risking dissatisfaction and potential churn.',
            'Internal development constraints made immediate full-scale development of the requested integration unfeasible.',
          ],
        },
        { type: 'heading', level: 2, text: 'Customer Goals' },
        {
          type: 'list',
          style: 'bullet',
          items: [
            'Secure a tailored integration with Insider to fulfill critical operational requirements.',
            'Establish a reliable integration path that supports continued platform adoption and expanded use.',
          ],
        },
        { type: 'heading', level: 2, text: 'Approach' },
        {
          type: 'list',
          style: 'bullet',
          items: [
            'Leveraged the client’s strategic importance to advocate for a customized solution, proposing account-specific customization as a practical alternative to full productization.',
            'Engaged internal stakeholders, including product and leadership teams, to align on the need for customization to meet the client’s urgent requirements.',
          ],
        },
        { type: 'heading', level: 2, text: 'Actions' },
        {
          type: 'list',
          style: 'bullet',
          items: [
            'Conducted in-depth discussions with the client to fully understand their specific integration needs and document technical requirements.',
            'Presented a compelling case to internal stakeholders, emphasizing the client’s strategic value and the risk of non-renewal without the customization.',
            'Collaborated with the product team to design and implement a bespoke customization for the Insider integration, aligning scope with the client’s operational workflow.',
            'Monitored the implementation process, facilitating communication between the client and internal teams to ensure the solution met expectations.',
          ],
        },
        { type: 'heading', level: 2, text: 'Outcomes' },
        {
          type: 'list',
          style: 'bullet',
          items: [
            'Delivered a customized Insider integration that addressed the client’s core operational needs.',
            'Strengthened the client relationship and contributed to renewal, broader platform usage, and an upsell opportunity.',
            'Demonstrated the organization’s commitment to meeting high-priority client needs, reinforcing trust and partnership longevity.',
          ],
        },
      ],
    },
  },
  {
    id: 'private-customer-workshop',
    title: 'Global AppsFlyer Adoption Workshops for a Global Tech Giant with 30+ Local Offices',
    customerContext:
      'The customer’s HQ needed global enablement support to drive AppsFlyer adoption across 30+ local sales offices.',
    focus: 'Private Customer Workshop',
    contribution: [
      'Designed and delivered three two-day regional workshops in London, Bangkok, and Sao Paulo.',
      'Managed venue sourcing, catering, agenda and timetable setup, custom content creation, speaker assignment, and engagement quizzes.',
      'Supported adoption across APAC, EMEA, and LATAM by bringing local subsidiary marketing teams into regional workshops.',
    ],
    outcome:
      'The workshops supported the renewal process, which included a 300K+ USD upsell, while improving product knowledge and confidence for 130+ participants.',
    skills: ['Workshop Design', 'Global Enablement', 'Adoption Strategy', 'Project Management'],
    modal: {
      eyebrow: 'Customer Success Case 04',
      title: 'Global AppsFlyer Adoption Workshops for a Global Tech Giant with 30+ Local Offices',
      summary:
        'The customer’s HQ needed global enablement support to drive AppsFlyer adoption across 30+ local sales offices.',
      closeLabel: commonCloseLabel,
      openLabel: commonOpenLabel,
      contentBlocks: [
        { type: 'heading', level: 2, text: 'Challenges' },
        {
          type: 'list',
          style: 'bullet',
          items: [
            'The client had limited experience in the mobile app marketing ecosystem and needed strategic guidance.',
            'The customer’s HQ needed global enablement support to drive AppsFlyer adoption across 30+ local sales offices.',
            'Client’s primary platform for marketing analytics was Adobe, which was optimized for web analytics and had limited capabilities for app marketing analytics.',
          ],
        },
        { type: 'heading', level: 2, text: 'Customer Goals' },
        {
          type: 'list',
          style: 'bullet',
          items: [
            'Expand app business and drive sales growth.',
            'Achieve consistent adoption of AppsFlyer across all local subsidiaries',
          ],
        },
        { type: 'heading', level: 2, text: 'Approach' },
        {
          type: 'list',
          style: 'bullet',
          items: [
            'Designed and delivered three two-day regional workshops tailored for the client in London, Bangkok, and Sao Paulo.',
            'Led three regional in-person workshops by assembling marketing teams from local subsidiaries across APAC, EMEA, and LATAM in centralized venues.',
          ],
        },
        { type: 'heading', level: 2, text: 'Action' },
        {
          type: 'list',
          style: 'bullet',
          items: [
            'Served as the workshop project manager, overseeing venue sourcing, catering, agenda and timetable setup, custom content creation, speaker assignment, and engagement quizzes.',
          ],
        },
        { type: 'heading', level: 2, text: 'Outcomes' },
        {
          type: 'list',
          style: 'bullet',
          items: [
            'Post-workshop survey results showed higher product knowledge and confidence across 130+ participants.',
            'The workshops supported the renewal process, which included a 300K+ USD upsell, by demonstrating dedicated regional enablement support.',
            'The three workshops helped local marketing teams build stronger product knowledge and confidence.',
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
  [
    `Cross-Functional Collaboration: Insider Integration Customization`,
    `부서 간 협업: Insider 연동 커스터마이징`,
  ],
  [
    `The client required an Insider integration scenario that was not officially supported by the standard product and is still available only as an account-specific customization for this one client.`,
    `고객사는 표준 제품에서 공식 지원하지 않는 Insider 연동 시나리오가 필요했고, 이 기능은 현재도 이 고객사 한 곳에만 계정별 커스터마이징으로 제공되고 있습니다.`,
  ],
  [
    `Documented the client’s specific integration needs and technical requirements.`,
    `고객사의 구체적인 연동 니즈와 기술 요구사항을 문서화했습니다.`,
  ],
  [
    `Presented the client’s strategic value and non-renewal risk to internal stakeholders.`,
    `고객사의 전략적 가치와 미갱신 리스크를 내부 이해관계자에게 설명했습니다.`,
  ],
  [
    `Collaborated with the product team to design and implement a bespoke Insider integration customization.`,
    `제품팀과 협업해 고객사에 맞춘 Insider 연동 커스터마이징을 설계하고 구현했습니다.`,
  ],
  [
    `Delivered a customer-specific Insider integration customization, strengthened the client relationship, and supported renewal and upsell.`,
    `이 고객사 전용 Insider 연동 커스터마이징을 제공해 고객 관계를 강화하고 갱신과 업셀을 지원했습니다.`,
  ],
  [
    `A strategically important enterprise client needed an Insider integration path that was not officially supported as a standard product feature, requiring alignment across customer success, product, and leadership teams.`,
    `전략적으로 중요한 엔터프라이즈 고객사가 표준 제품 기능으로는 공식 지원되지 않는 Insider 연동 경로를 필요로 했고, 이를 위해 고객성공, 제품, 리더십 팀의 조율이 필요했습니다.`,
  ],
  [`Challenges`, `과제`],
  [
    `The lack of this integration hindered the client’s ability to meet key operational needs, risking dissatisfaction and potential churn.`,
    `이 연동이 없어 고객사는 핵심 운영 니즈를 충족하기 어려웠고, 불만과 이탈 위험이 커졌습니다.`,
  ],
  [
    `Internal development constraints made immediate full-scale development of the requested integration unfeasible.`,
    `내부 개발 리소스 제약 때문에 요청받은 연동을 즉시 정식 기능으로 개발하기는 어려웠습니다.`,
  ],
  [`Customer Goals`, `고객 목표`],
  [
    `Secure a tailored integration with Insider to fulfill critical operational requirements.`,
    `핵심 운영 요구사항을 충족할 수 있도록 Insider 맞춤 연동을 확보하는 것이 목표였습니다.`,
  ],
  [
    `Establish a reliable integration path that supports continued platform adoption and expanded use.`,
    `플랫폼 활용을 정착시키고 사용 범위를 넓힐 수 있는 안정적인 연동 방식을 마련하는 것이 목표였습니다.`,
  ],
  [`Approach`, `접근 방식`],
  [
    `Leveraged the client’s strategic importance to advocate for a customized solution, proposing account-specific customization as a practical alternative to full productization.`,
    `고객사의 전략적 중요도를 근거로 맞춤 솔루션의 필요성을 설득했고, 정식 기능화 대신 계정별 커스터마이징을 현실적인 대안으로 제안했습니다.`,
  ],
  [
    `Engaged internal stakeholders, including product and leadership teams, to align on the need for customization to meet the client’s urgent requirements.`,
    `제품팀과 리더십을 포함한 내부 이해관계자와 논의해 고객사의 긴급 요구를 충족하기 위한 커스터마이징 필요성에 합의했습니다.`,
  ],
  [`Actions`, `실행 내용`],
  [
    `Conducted in-depth discussions with the client to fully understand their specific integration needs and document technical requirements.`,
    `고객사와 심층 논의를 진행해 구체적인 연동 니즈를 파악하고 기술 요구사항으로 정리했습니다.`,
  ],
  [
    `Presented a compelling case to internal stakeholders, emphasizing the client’s strategic value and the risk of non-renewal without the customization.`,
    `고객사의 전략적 가치와 커스터마이징이 없을 때 발생할 수 있는 미갱신 리스크를 내부 이해관계자에게 설득력 있게 전달했습니다.`,
  ],
  [
    `Collaborated with the product team to design and implement a bespoke customization for the Insider integration, aligning scope with the client’s operational workflow.`,
    `제품팀과 함께 Insider 연동 커스터마이징을 설계·구현하고, 고객사의 운영 흐름에 맞도록 범위를 조율했습니다.`,
  ],
  [
    `Monitored the implementation process, facilitating communication between the client and internal teams to ensure the solution met expectations.`,
    `구현 과정을 모니터링하고 고객사와 내부 팀 사이의 커뮤니케이션을 조율해 솔루션이 기대에 맞게 동작하도록 관리했습니다.`,
  ],
  [`Outcomes`, `성과`],
  [
    `Delivered a customized Insider integration that addressed the client’s core operational needs.`,
    `고객사의 핵심 운영 니즈를 충족하는 맞춤형 Insider 연동을 제공했습니다.`,
  ],
  [
    `Strengthened the client relationship and contributed to renewal, broader platform usage, and an upsell opportunity.`,
    `고객 관계를 강화하고 계약 갱신, 플랫폼 사용 확대, 업셀 기회에 기여했습니다.`,
  ],
  [
    `Demonstrated the organization’s commitment to meeting high-priority client needs, reinforcing trust and partnership longevity.`,
    `우선순위가 높은 고객 니즈를 해결하려는 조직의 의지를 보여주며 신뢰와 장기 파트너십을 강화했습니다.`,
  ],
  [
    `Global AppsFlyer Adoption Workshops for a Global Tech Giant with 30+ Local Offices`,
    `30개 이상 현지 오피스를 보유한 글로벌 테크 기업을 위한 AppsFlyer 도입 워크숍`,
  ],
  [
    `The customer’s HQ needed global enablement support to drive AppsFlyer adoption across 30+ local sales offices.`,
    `고객사 본사는 30개 이상의 현지 판매 조직에서 AppsFlyer를 일관되게 도입할 수 있도록 글로벌 교육·정착 지원이 필요했습니다.`,
  ],
  [
    `Designed and delivered three two-day regional workshops in London, Bangkok, and Sao Paulo.`,
    `런던, 방콕, 상파울루에서 각각 이틀짜리 권역별 워크숍을 세 차례 설계하고 운영했습니다.`,
  ],
  [
    `Managed venue sourcing, catering, agenda and timetable setup, custom content creation, speaker assignment, and engagement quizzes.`,
    `장소 섭외, 케이터링, 진행 안건과 시간표 구성, 맞춤 콘텐츠 제작, 발표자 배정, 참여 유도용 퀴즈까지 관리했습니다.`,
  ],
  [
    `Supported adoption across APAC, EMEA, and LATAM by bringing local subsidiary marketing teams into regional workshops.`,
    `APAC, EMEA, LATAM 현지 법인의 마케팅 팀을 권역별 워크숍으로 모아 제품 도입을 지원했습니다.`,
  ],
  [
    `The workshops supported the renewal process, which included a 300K+ USD upsell, while improving product knowledge and confidence for 130+ participants.`,
    `워크숍은 300K+ USD 업셀이 포함된 갱신 과정에 기여했고, 130명 이상의 참가자가 제품 이해도와 사용 자신감을 높이는 데 도움을 줬습니다.`,
  ],
  [
    `The customer’s HQ needed global enablement support to drive AppsFlyer adoption across 30+ local sales offices.`,
    `고객사 본사는 30개 이상의 현지 판매 조직에서 AppsFlyer를 일관되게 도입할 수 있도록 글로벌 교육·정착 지원이 필요했습니다.`,
  ],
  [
    `The client had limited experience in the mobile app marketing ecosystem and needed strategic guidance.`,
    `고객사는 모바일 앱 마케팅 생태계 경험이 많지 않아 전략적인 안내가 필요했습니다.`,
  ],
  [
    `The customer’s HQ needed global enablement support to drive AppsFlyer adoption across 30+ local sales offices.`,
    `고객사 본사는 30개 이상의 현지 판매 조직에서 AppsFlyer를 일관되게 도입할 수 있도록 글로벌 교육·정착 지원이 필요했습니다.`,
  ],
  [
    `Client’s primary platform for marketing analytics was Adobe, which was optimized for web analytics and had limited capabilities for app marketing analytics.`,
    `고객사의 주 분석 플랫폼은 Adobe였고 웹 분석에는 적합했지만 앱 마케팅 분석 기능은 제한적이었습니다.`,
  ],
  [`Expand app business and drive sales growth.`, `앱 비즈니스를 확장하고 매출 성장을 이끄는 것이 목표였습니다.`],
  [
    `Achieve consistent adoption of AppsFlyer across all local subsidiaries`,
    `모든 현지 법인에서 AppsFlyer를 일관되게 도입하도록 만드는 것이 목표였습니다.`,
  ],
  [
    `Designed and delivered three two-day regional workshops tailored for the client in London, Bangkok, and Sao Paulo.`,
    `런던, 방콕, 상파울루에서 고객사에 맞춘 이틀짜리 권역별 워크숍을 세 차례 설계하고 진행했습니다.`,
  ],
  [
    `Led three regional in-person workshops by assembling marketing teams from local subsidiaries across APAC, EMEA, and LATAM in centralized venues.`,
    `APAC, EMEA, LATAM 현지 법인의 마케팅 팀을 거점 도시로 모아 세 차례의 권역별 오프라인 워크숍을 이끌었습니다.`,
  ],
  [`Action`, `실행 내용`],
  [
    `Served as the workshop project manager, overseeing venue sourcing, catering, agenda and timetable setup, custom content creation, speaker assignment, and engagement quizzes.`,
    `워크숍 프로젝트 매니저로서 장소 섭외, 케이터링, 진행 안건과 시간표 구성, 맞춤 콘텐츠 제작, 발표자 배정, 참여 유도용 퀴즈까지 운영 전반을 총괄했습니다.`,
  ],
  [
    `Post-workshop survey results showed higher product knowledge and confidence across 130+ participants.`,
    `사후 설문에서 130명 이상의 참가자가 제품 이해도와 사용 자신감이 향상됐다고 응답했습니다.`,
  ],
  [
    `The workshops supported the renewal process, which included a 300K+ USD upsell, by demonstrating dedicated regional enablement support.`,
    `워크숍은 권역별 전담 교육·정착 지원 역량을 보여주며 300K+ USD 업셀이 포함된 갱신 과정에 기여했습니다.`,
  ],
  [
    `The three workshops helped local marketing teams build stronger product knowledge and confidence.`,
    `세 차례 워크숍은 현지 마케팅 팀이 제품 이해도와 사용 자신감을 높이는 데 도움을 줬습니다.`,
  ],
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
