import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, CheckCircle, Database } from 'lucide-react';
import SEO from '../../components/SEO/SEO';
import './Legal.css';

const GDPR = () => {
  const { t } = useTranslation();

  return (
    <>
      <SEO 
        title={t('legal.gdpr.title')} 
        description={t('legal.gdpr.subtitle')} 
        url="https://rrdesign.ro/politica-cookies-gdpr" 
      />
      <div className="legal-page-wrapper">
        <div className="legal-header">
        <Shield size={48} className="legal-icon" />
        <h1>{t('legal.gdpr.title')}</h1>
        <p>{t('legal.gdpr.subtitle')}</p>
      </div>
      
      <div className="legal-content container">
        <section className="legal-section">
          <h2>{t('legal.gdpr.sec1.title')}</h2>
          <p>{t('legal.gdpr.sec1.content')}</p>
        </section>

        <section className="legal-section">
          <h2><CheckCircle size={20}/> {t('legal.gdpr.sec2.title')}</h2>
          <p>{t('legal.gdpr.sec2.p')}</p>
          <ul>
            <li>{t('legal.gdpr.sec2.li1')}</li>
            <li>{t('legal.gdpr.sec2.li2')}</li>
            <li>{t('legal.gdpr.sec2.li3')}</li>
            <li>{t('legal.gdpr.sec2.li4')}</li>
            <li>{t('legal.gdpr.sec2.li5')}</li>
            <li>{t('legal.gdpr.sec2.li6')}</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2><Database size={20}/> {t('legal.gdpr.sec3.title')}</h2>
          <p>{t('legal.gdpr.sec3.p')}</p>
          
          <h3>{t('legal.gdpr.sec3.h3')}</h3>
          <ul>
            <li>{t('legal.gdpr.sec3.li1')}</li>
            <li>{t('legal.gdpr.sec3.li2')}</li>
          </ul>

          <p>{t('legal.gdpr.sec3.p2')}</p>
        </section>

        <section className="legal-section">
          <h2>{t('legal.gdpr.sec4.title')}</h2>
          <p>
            {t('legal.gdpr.sec4.p')} <a href="mailto:office@rrdesign.ro">office@rrdesign.ro</a>. 
            {t('legal.gdpr.sec4.p2')}
          </p>
        </section>
      </div>
    </div>
    </>
  );
};

export default GDPR;
