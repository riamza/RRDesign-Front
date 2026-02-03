import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Services.css';
import ServiceCard from '../../components/ServiceCard/ServiceCard';
import PriceCard from '../../components/PriceCard/PriceCard';
import { pricingPackages } from '../../data/mockData';
import { api } from '../../services/api';

const Services = () => {
  const { t } = useTranslation();
  const gridRef = useRef(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await api.getServices();
        setServices(data);
      } catch (error) {
        console.error('Failed to fetch services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    if (loading) return;
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
            {loading ? <p>Loading services...</p> : services.map(service => (
              <div key={service.id} className="service-card-wrapper">
                <ServiceCard service={service} />
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
              <PriceCard key={pkg.id} pkg={pkg} />
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
