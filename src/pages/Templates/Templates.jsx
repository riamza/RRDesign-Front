import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTemplates } from '../../store/slices/templatesSlice';
import './Templates.css';
import TemplateCard from '../../components/TemplateCard/TemplateCard';
import SEO from '../../components/SEO/SEO';

const Templates = () => {
  const { t } = useTranslation();
  const gridRef = useRef(null);
  const dispatch = useDispatch();
  const { items: templates, status } = useSelector((state) => state.templates);
  const loading = status === 'loading';

  useEffect(() => {
    dispatch(fetchTemplates());
  }, [dispatch]);

  useEffect(() => {
    if (loading) return;
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
      <SEO 
        title={t('seo.templates.title')} 
        description={t('seo.templates.description')} 
        keywords={t('seo.templates.keywords')} 
      />
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
            {loading ? <p>Loading templates...</p> : templates.map(template => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Templates;
