var fs = require('fs');

const gdpr = `import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, CheckCircle, Database } from 'lucide-react';
import './Legal.css';

const GDPR = () => {
  const { t } = useTranslation();

  return (
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
  );
};

export default GDPR;
`;

const privacy = `import React from 'react';
import { useTranslation } from 'react-i18next';
import { Eye } from 'lucide-react';
import './Legal.css';

const Privacy = () => {
  const { t } = useTranslation();

  return (
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
  );
};

export default Privacy;
`;

const terms = `import React from 'react';
import { useTranslation } from 'react-i18next';
import { Scale } from 'lucide-react';
import './Legal.css';

const Terms = () => {
  const { t } = useTranslation();

  return (
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
  );
};

export default Terms;
`;

fs.writeFileSync('E:/RRDesign/Site/Front/src/pages/Legal/GDPR.jsx', gdpr, 'utf8');
fs.writeFileSync('E:/RRDesign/Site/Front/src/pages/Legal/Privacy.jsx', privacy, 'utf8');
fs.writeFileSync('E:/RRDesign/Site/Front/src/pages/Legal/Terms.jsx', terms, 'utf8');
console.log('Pages updated');