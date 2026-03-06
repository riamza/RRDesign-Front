import React from 'react';
import { useTranslation } from 'react-i18next';
import { Eye } from 'lucide-react';
import SEO from '../../components/SEO/SEO';
import './Legal.css';

const Privacy = () => {
  const { t } = useTranslation();

  return (
    <>
      <SEO 
        title={t('legal.privacy.title')} 
        description={t('legal.privacy.subtitle')} 
        url="https://rrdesign.ro/politica-de-confidentialitate" 
      />
      <div className="legal-page-wrapper">
        <div className="legal-header">
        <Eye size={48} className="legal-icon" />
        <h1>{t('legal.privacy.title')}</h1>
        <p>{t('legal.privacy.subtitle')}</p>
      </div>

      <div className="legal-content container">
        <section className="legal-section">
          <h2>{t('legal.privacy.sec1.title')}</h2>
          <p>
            {t('legal.privacy.sec1.content')}<a href="https://rrdesign.ro">rrdesign.ro</a>.
          </p>
        </section>

        <section className="legal-section">
          <h2>{t('legal.privacy.sec2.title')}</h2>
          <p>{t('legal.privacy.sec2.p')}</p>
          <ul>
            <li>{t('legal.privacy.sec2.li1')}</li>
            <li>{t('legal.privacy.sec2.li2')}</li>
            <li>{t('legal.privacy.sec2.li3')}</li>
            <li>{t('legal.privacy.sec2.li4')}</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>{t('legal.privacy.sec3.title')}</h2>
          <p>{t('legal.privacy.sec3.p')}</p>
          <ul>
            <li>{t('legal.privacy.sec3.li1')}</li>
            <li>{t('legal.privacy.sec3.li2')}</li>
            <li>{t('legal.privacy.sec3.li3')}</li>
            <li>{t('legal.privacy.sec3.li4')}</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>{t('legal.privacy.sec4.title')}</h2>
          <p>{t('legal.privacy.sec4.p')}</p>
          <ul>
            <li>{t('legal.privacy.sec4.li1')}</li>
            <li>{t('legal.privacy.sec4.li2')}</li>
            <li>{t('legal.privacy.sec4.li3')}</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>{t('legal.privacy.sec5.title')}</h2>
          <p>{t('legal.privacy.sec5.p')}</p>
        </section>
      </div>
    </div>
    </>
  );
};

export default Privacy;
