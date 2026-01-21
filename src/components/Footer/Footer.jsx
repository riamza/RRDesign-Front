import React from 'react';
import { useTranslation } from 'react-i18next';
import './Footer.css';
import { companyInfo } from '../../data/mockData';

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
            <h4>{t('footer.links')}</h4>
            <div className="footer-links">
              <a href="/">{t('header.home')}</a>
              <a href="/services">{t('header.services')}</a>
              <a href="/projects">{t('header.projects')}</a>
              <a href="/templates">{t('header.templates')}</a>
              <a href="/contact">{t('header.contact')}</a>
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
