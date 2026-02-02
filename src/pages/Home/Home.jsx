import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Monitor, Smartphone, Cloud } from 'lucide-react';
import './Home.css';
import Button from '../../components/Button/Button';
import { companyInfo, services } from '../../data/mockData';
import { getIcon } from '../../utils/iconMapper';

const Home = () => {
  const { t } = useTranslation();
  const servicesGridRef = useRef(null);

  useEffect(() => {
    const alignServiceCards = () => {
      if (!servicesGridRef.current) return;

      const cards = servicesGridRef.current.querySelectorAll('.service-card');
      
      // Reset heights
      cards.forEach(card => {
        card.style.minHeight = 'auto';
      });

      // Get max height
      const maxHeight = Math.max(...Array.from(cards).map(card => card.offsetHeight));

      // Apply max height
      cards.forEach(card => {
        card.style.minHeight = `${maxHeight}px`;
      });
    };

    alignServiceCards();
    window.addEventListener('resize', alignServiceCards);
    
    return () => window.removeEventListener('resize', alignServiceCards);
  }, []);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              {t('home.hero.title')}
              <span className="gradient-text"> {t('home.hero.titleHighlight')} </span>
              {t('home.hero.titleEnd')}
            </h1>
            <p className="hero-description">
              {companyInfo.description}
            </p>
            <div className="hero-buttons">
              <Link to="/contact">
                <Button variant="primary">{t('home.cta.button')}</Button>
              </Link>
              <Link to="/projects">
                <Button variant="secondary">{t('home.hero.viewProjects')}</Button>
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="floating-card card-1">
              <div className="card-icon"><Monitor size={40} /></div>
              <div className="card-text">Web Development</div>
            </div>
            <div className="floating-card card-2">
              <div className="card-icon"><Smartphone size={40} /></div>
              <div className="card-text">Mobile Apps</div>
            </div>
            <div className="floating-card card-3">
              <div className="card-icon"><Cloud size={40} /></div>
              <div className="card-text">Cloud Solutions</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="services-preview">
        <div className="container">
          <h2 className="section-title">{t('home.services.title')}</h2>
          <p className="section-subtitle">
            {t('home.services.description')}
          </p>
          <div className="services-grid" ref={servicesGridRef}>
            {services.slice(0, 3).map(service => (
              <div key={service.id} className="service-card">
                <div className="service-icon-wrapper">
                  <div className="service-icon">{getIcon(service.icon, 48)}</div>
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
          <div className="services-cta">
            <Link to="/services">
              <Button variant="primary">Vezi toate serviciile</Button>
            </Link>
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2>{t('home.cta.title')}</h2>
          <p>{t('home.cta.description')}</p>
          <Link to="/contact">
            <Button variant="primary">{t('home.hero.contactUs')}</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
