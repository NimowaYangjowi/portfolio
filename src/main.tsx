import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { useTranslation } from 'react-i18next';
import './i18n';
import './styles.css';

type AccordionItemData = {
  id: number;
  titleKey: string;
  imageUrl: string;
};

const accordionItems: AccordionItemData[] = [
  {
    id: 1,
    titleKey: 'accordion.voiceAssistant',
    imageUrl:
      'https://images.unsplash.com/photo-1628258334105-2a0b3d6efee1?q=80&w=1974&auto=format&fit=crop',
  },
  {
    id: 2,
    titleKey: 'accordion.imageGeneration',
    imageUrl:
      'https://images.unsplash.com/photo-1677756119517-756a188d2d94?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 3,
    titleKey: 'accordion.chatbotRag',
    imageUrl:
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1974&auto=format&fit=crop',
  },
  {
    id: 4,
    titleKey: 'accordion.agent',
    imageUrl:
      'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?q=80&w=2090&auto=format&fit=crop',
  },
  {
    id: 5,
    titleKey: 'accordion.visualUnderstanding',
    imageUrl:
      'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=2070&auto=format&fit=crop',
  },
];

type AccordionItemProps = {
  item: AccordionItemData;
  isActive: boolean;
  onMouseEnter: () => void;
};

function AccordionItem({ item, isActive, onMouseEnter }: AccordionItemProps) {
  const { t } = useTranslation();
  const title = t(item.titleKey);

  return (
    <div
      className={`accordion-item ${isActive ? 'accordion-item-active' : ''}`}
      onMouseEnter={onMouseEnter}
    >
      <img
        src={item.imageUrl}
        alt={title}
        className="accordion-image"
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src =
            'https://placehold.co/400x450/2d3748/ffffff?text=Image+Error';
        }}
      />
      <div className="accordion-overlay" />
      <span className={`accordion-caption ${isActive ? 'caption-active' : 'caption-inactive'}`}>
        {title}
      </span>
    </div>
  );
}

export function LandingAccordionItem() {
  const [activeIndex, setActiveIndex] = useState(4);
  const { i18n, t } = useTranslation();
  const currentLanguage = i18n.resolvedLanguage === 'en' ? 'en' : 'ko';

  const handleItemHover = (index: number) => {
    setActiveIndex(index);
  };

  const handleLanguageChange = (language: 'ko' | 'en') => {
    void i18n.changeLanguage(language);
    window.localStorage.setItem('portfolio-language', language);
    document.documentElement.lang = language;
  };

  return (
    <div className="page">
      <section className="section-container">
        <div className="landing-layout">
          <div className="copy-column">
            <h1>{t('heroTitle')}</h1>
            <p>{t('heroDescription')}</p>
            <div className="cta-wrap">
              <div className="language-toggle" aria-label={t('languageToggleLabel')}>
                <button
                  type="button"
                  className={
                    currentLanguage === 'ko'
                      ? 'language-button language-button-active'
                      : 'language-button'
                  }
                  onClick={() => handleLanguageChange('ko')}
                  aria-pressed={currentLanguage === 'ko'}
                >
                  {t('languageOptionKo')}
                </button>
                <button
                  type="button"
                  className={
                    currentLanguage === 'en'
                      ? 'language-button language-button-active'
                      : 'language-button'
                  }
                  onClick={() => handleLanguageChange('en')}
                  aria-pressed={currentLanguage === 'en'}
                >
                  {t('languageOptionEn')}
                </button>
              </div>
            </div>
          </div>

          <div className="accordion-column">
            <div className="accordion-row">
              {accordionItems.map((item, index) => (
                <AccordionItem
                  key={item.id}
                  item={item}
                  isActive={index === activeIndex}
                  onMouseEnter={() => handleItemHover(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LandingAccordionItem />
  </StrictMode>,
);
