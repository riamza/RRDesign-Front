import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './Templates.css';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import { templates } from '../../data/mockData';

const Templates = () => {
  const { t } = useTranslation();
  const gridRef = useRef(null);

  useEffect(() => {
    const alignCardSections = () => {
      if (!gridRef.current) return;

      const images = gridRef.current.querySelectorAll('.template-image');
      const categories = gridRef.current.querySelectorAll('.template-category');
      const titles = gridRef.current.querySelectorAll('.template-title');
      const descriptions = gridRef.current.querySelectorAll('.template-description');
      const features = gridRef.current.querySelectorAll('.template-features');
      const tags = gridRef.current.querySelectorAll('.template-tags');

      // Reset heights
      [...images, ...categories, ...titles, ...descriptions, ...features, ...tags].forEach(el => {
        el.style.height = 'auto';
      });

      // Calculate max heights
      const maxImageHeight = Math.max(...Array.from(images).map(el => el.offsetHeight));
      const maxCategoryHeight = Math.max(...Array.from(categories).map(el => el.offsetHeight));
      const maxTitleHeight = Math.max(...Array.from(titles).map(el => el.offsetHeight));
      const maxDescHeight = Math.max(...Array.from(descriptions).map(el => el.offsetHeight));
      const maxFeaturesHeight = Math.max(...Array.from(features).map(el => el.offsetHeight));
      const maxTagsHeight = Math.max(...Array.from(tags).map(el => el.offsetHeight));

      // Apply max heights
      images.forEach(el => el.style.height = `${maxImageHeight}px`);
      categories.forEach(el => el.style.height = `${maxCategoryHeight}px`);
      titles.forEach(el => el.style.height = `${maxTitleHeight}px`);
      descriptions.forEach(el => el.style.height = `${maxDescHeight}px`);
      features.forEach(el => el.style.height = `${maxFeaturesHeight}px`);
      tags.forEach(el => el.style.height = `${maxTagsHeight}px`);
    };

    alignCardSections();
    window.addEventListener('resize', alignCardSections);
    
    return () => window.removeEventListener('resize', alignCardSections);
  }, []);

  return (
    <div className="templates-page">
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">{t('templates.pageTitle')}</h1>
          <p className="page-description">
            {t('templates.pageDescription')}
          </p>
        </div>
      </section>

      <section className="templates-section">
        <div className="container">
          <div className="templates-grid" ref={gridRef}>
            {templates.map(template => (
              <Card key={template.id} className="template-card">
                <div className="template-image">
                  <img src={template.image} alt={template.title} className="card-image" />
                </div>
                <div className="template-category">{template.category}</div>
                <div className="template-title">
                  <h3 className="card-title">{template.title}</h3>
                </div>
                <div className="template-description">
                  <p className="card-description">{template.description}</p>
                </div>
                
                <div className="template-features">
                  <h4>{t('templates.features')}</h4>
                  <ul className="card-features">
                    {template.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>

                <div className="template-tags">
                  <div className="card-tags">
                    {template.technologies.map((tech, index) => (
                      <span key={index} className="card-tag">{tech}</span>
                    ))}
                  </div>
                </div>

                <Button variant="primary" href={template.demoLink}>
                  {t('templates.viewDemo')} →
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Templates;
