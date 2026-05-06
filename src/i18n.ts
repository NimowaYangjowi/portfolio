import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export const supportedLanguages = ['ko', 'en'] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

const savedLanguage = window.localStorage.getItem('portfolio-language');
const initialLanguage: SupportedLanguage = supportedLanguages.includes(
  savedLanguage as SupportedLanguage,
)
  ? (savedLanguage as SupportedLanguage)
  : 'ko';

void i18n.use(initReactI18next).init({
  resources: {
    ko: {
      translation: {
        languageToggleLabel: '언어 전환',
        languageOptionKo: '한국어',
        languageOptionEn: 'English',
        heroTitle: '어떤 기기에서든 Gen-AI 작업을 빠르게 실행하세요',
        heroDescription:
          '모델 압축이나 엣지 배포의 복잡함 없이, 기기 안에서 돌아가는 고성능 AI 앱을 만들 수 있습니다.',
        accordion: {
          voiceAssistant: '음성 비서',
          imageGeneration: 'AI 이미지 생성',
          chatbotRag: 'AI 챗봇 + 로컬 RAG',
          agent: 'AI 에이전트',
          visualUnderstanding: '시각 이해',
        },
      },
    },
    en: {
      translation: {
        languageToggleLabel: 'Switch language',
        languageOptionKo: '한국어',
        languageOptionEn: 'English',
        heroTitle: 'Accelerate Gen-AI Tasks on Any Device',
        heroDescription:
          'Build high-performance AI apps on-device without the hassle of model compression or edge deployment.',
        accordion: {
          voiceAssistant: 'Voice Assistant',
          imageGeneration: 'AI Image Generation',
          chatbotRag: 'AI Chatbot + Local RAG',
          agent: 'AI Agent',
          visualUnderstanding: 'Visual Understanding',
        },
      },
    },
  },
  lng: initialLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

document.documentElement.lang = initialLanguage;

export default i18n;
