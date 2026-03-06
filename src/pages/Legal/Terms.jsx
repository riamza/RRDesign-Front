import React from 'react';
import { useTranslation } from 'react-i18next';
import { Scale } from 'lucide-react';
import SEO from '../../components/SEO/SEO';
import './Legal.css';

const Terms = () => {
  const { t } = useTranslation();

  return (
    <>
      <SEO 
        title={t('legal.terms.title')} 
        description={t('legal.terms.subtitle')} 
        url="https://rrdesign.ro/termeni-si-conditii" 
      />
      <div className="legal-page-wrapper">
        <div className="legal-header">
        <Scale size={48} className="legal-icon" />
        <h1>{t('legal.terms.title')}</h1>
        <p>{t('legal.terms.subtitle')}</p>
      </div>

      <div className="legal-content container">
        <section className="legal-section">
          <h2>{t('legal.terms.sec1.title')}</h2>
          <p>{t('legal.terms.sec1.content')}</p>
        </section>

        <section className="legal-section">
          <h2>{t('legal.terms.sec2.title')}</h2>
          <p>{t('legal.terms.sec2.p')}</p>
          <ul>
            <li>{t('legal.terms.sec2.li1')}</li>
            <li>{t('legal.terms.sec2.li2')}</li>
            <li>{t('legal.terms.sec2.li3')}</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>{t('legal.terms.sec3.title')}</h2>
          <p>{t('legal.terms.sec3.p1')}</p>
          <p>{t('legal.terms.sec3.p2')}</p>
        </section>

        <section className="legal-section">
          <h2>{t('legal.terms.sec4.title')}</h2>
          <p>{t('legal.terms.sec4.p')}</p>
          <ul>
            <li>{t('legal.terms.sec4.li1')}</li>
            <li>{t('legal.terms.sec4.li2')}</li>
            <li>{t('legal.terms.sec4.li3')}</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>{t('legal.terms.sec5.title')}</h2>
          <p>{t('legal.terms.sec5.p')}</p>
        </section>

        <section className="legal-section">
          <h2>{t('legal.terms.sec6.title')}</h2>
          <p>{t('legal.terms.sec6.p')}</p>
        </section>
      </div>
    </div>
    </>
  );
};

export default Terms;
