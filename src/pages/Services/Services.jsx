import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './Services.css';
import Card from '../../components/Card/Card';
import { services, pricingPackages } from '../../data/mockData';

const Services = () => {
  const { t } = useTranslation();
  const gridRef = useRef(null);

  useEffect(() => {
    const alignCardSections = () => {
      if (!gridRef.current) return;

      const headers = gridRef.current.querySelectorAll('.service-header');
      const descriptions = gridRef.current.querySelectorAll('.service-description');
      const features = gridRef.current.querySelectorAll('.service-features');
      const techs = gridRef.current.querySelectorAll('.service-tech');

      // Reset heights
      [...headers, ...descriptions, ...features, ...techs].forEach(el => {
        el.style.height = 'auto';
      });

      // Calculate max heights
      const maxHeaderHeight = Math.max(...Array.from(headers).map(el => el.offsetHeight));
      const maxDescHeight = Math.max(...Array.from(descriptions).map(el => el.offsetHeight));
      const maxFeaturesHeight = Math.max(...Array.from(features).map(el => el.offsetHeight));
      const maxTechHeight = Math.max(...Array.from(techs).map(el => el.offsetHeight));

      // Apply max heights
      headers.forEach(el => el.style.height = `${maxHeaderHeight}px`);
      descriptions.forEach(el => el.style.height = `${maxDescHeight}px`);
      features.forEach(el => el.style.height = `${maxFeaturesHeight}px`);
      techs.forEach(el => el.style.height = `${maxTechHeight}px`);
    };

    alignCardSections();
    window.addEventListener('resize', alignCardSections);
    
    return () => window.removeEventListener('resize', alignCardSections);
  }, []);

  return (
    <div className="services-page">
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">{t('services.pageTitle')}</h1>
          <p className="page-description">
            {t('services.pageDescription')}
          </p>
        </div>
      </section>

      <section className="services-section">
        <div className="container">
          <div className="services-grid" ref={gridRef}>
            {services.map(service => (
              <div key={service.id} className="service-card-wrapper">
                <Card className="service-card-full">
                  <div className="service-section service-header">
                    <div className="service-icon-large">{service.icon}</div>
                    <h3 className="card-title">{service.title}</h3>
                  </div>
                  <div className="service-section service-description">
                    <p className="card-description">{service.description}</p>
                  </div>
                  
                  <div className="service-section service-features">
                    <h4>{t('services.whatWeOffer')}</h4>
                    <ul className="card-features">
                      {service.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="service-section service-tech">
                    <h4>{t('services.technologies')}</h4>
                    <div className="card-tags">
                      {service.technologies.map((tech, index) => (
                        <span key={index} className="card-tag">{tech}</span>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pricing-section">
        <div className="container">
          <h2 className="section-title">{t('services.pricing.title')}</h2>
          <p className="section-description">{t('services.pricing.description')}</p>
          
          <div className="pricing-grid">
            {pricingPackages.map((pkg) => (
              <div key={pkg.id} className={`pricing-card ${pkg.highlight ? 'highlight' : ''}`}>
                <div className="pricing-header">
                  <h3>{pkg.title}</h3>
                  <div className="price">{pkg.price}</div>
                  <p className="description">{pkg.description}</p>
                </div>
                <div className="pricing-features">
                  <ul>
                    {pkg.features.map((feature, index) => (
                      <li key={index}>
                        <span className="check-icon">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pricing-action">
                  <a href="/contact" className={`button ${pkg.highlight ? 'button-primary' : 'button-secondary'}`}>
                    {t('services.pricing.button')}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="services-cta">
        <div className="container">
          <div className="cta-box">
            <h2>{t('services.cta.title')}</h2>
            <p>{t('services.cta.description')}</p>
            <a href="/contact" className="button button-primary">
              {t('services.cta.button')}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
