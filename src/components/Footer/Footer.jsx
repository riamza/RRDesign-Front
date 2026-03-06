import React from 'react';
import { useTranslation } from 'react-i18next';
import './Footer.css';
import { companyInfo } from '../../utils/constants';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-logo">
              <span className="logo-rr">RR</span>
              <span className="logo-design">Design</span>
            </h3>
            <p className="footer-tagline">{companyInfo.tagline}</p>
          </div>

          <div className="footer-section">
            <h4>{t('footer.contact')}</h4>
            <p>{companyInfo.email}</p>
            <p>{companyInfo.phone}</p>
            <p>{companyInfo.address}</p>
          </div>

          <div className="footer-section">
            <h4>{t('footer.legalPolicy')}</h4>
            <div className="footer-links">
              <a href="/termeni-si-conditii">{t('footer.terms')}</a>
              <a href="/politica-de-confidentialitate">{t('footer.privacy')}</a>
              <a href="/politica-cookies-gdpr">{t('footer.gdpr')}</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 RRDesign. {t('footer.allRightsReserved')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
