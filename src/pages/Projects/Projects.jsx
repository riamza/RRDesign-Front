import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './Projects.css';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import { projects } from '../../data/mockData';

const Projects = () => {
  const { t } = useTranslation();
  const gridRef = useRef(null);

  useEffect(() => {
    const alignCardSections = () => {
      if (!gridRef.current) return;

      const images = gridRef.current.querySelectorAll('.project-image');
      const categories = gridRef.current.querySelectorAll('.project-category');
      const titles = gridRef.current.querySelectorAll('.project-title');
      const descriptions = gridRef.current.querySelectorAll('.project-description');
      const tags = gridRef.current.querySelectorAll('.project-tags');
      const metas = gridRef.current.querySelectorAll('.project-meta');

      // Reset heights
      [...images, ...categories, ...titles, ...descriptions, ...tags, ...metas].forEach(el => {
        el.style.height = 'auto';
      });

      // Calculate max heights
      const maxImageHeight = Math.max(...Array.from(images).map(el => el.offsetHeight));
      const maxCategoryHeight = Math.max(...Array.from(categories).map(el => el.offsetHeight));
      const maxTitleHeight = Math.max(...Array.from(titles).map(el => el.offsetHeight));
      const maxDescHeight = Math.max(...Array.from(descriptions).map(el => el.offsetHeight));
      const maxTagsHeight = Math.max(...Array.from(tags).map(el => el.offsetHeight));
      const maxMetaHeight = Math.max(...Array.from(metas).map(el => el.offsetHeight));

      // Apply max heights
      images.forEach(el => el.style.height = `${maxImageHeight}px`);
      categories.forEach(el => el.style.height = `${maxCategoryHeight}px`);
      titles.forEach(el => el.style.height = `${maxTitleHeight}px`);
      descriptions.forEach(el => el.style.height = `${maxDescHeight}px`);
      tags.forEach(el => el.style.height = `${maxTagsHeight}px`);
      metas.forEach(el => el.style.height = `${maxMetaHeight}px`);
    };

    alignCardSections();
    window.addEventListener('resize', alignCardSections);
    
    return () => window.removeEventListener('resize', alignCardSections);
  }, []);

  return (
    <div className="projects-page">
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">{t('projects.pageTitle')}</h1>
          <p className="page-description">
            {t('projects.pageDescription')}
          </p>
        </div>
      </section>

      <section className="projects-section">
        <div className="container">
          <div className="projects-grid" ref={gridRef}>
            {projects.map(project => (
              <Card key={project.id} className="project-card">
                <div className="project-image">
                  <img src={project.image} alt={project.title} className="card-image" />
                </div>
                <div className="project-category">{project.category}</div>
                <div className="project-title">
                  <h3 className="card-title">{project.title}</h3>
                </div>
                <div className="project-description">
                  <p className="card-description">{project.description}</p>
                </div>
                <div className="project-tags">
                  <div className="card-tags">
                    {project.technologies.map((tech, index) => (
                      <span key={index} className="card-tag">{tech}</span>
                    ))}
                  </div>
                </div>
                <div className="project-meta">
                  <span className="completion-date">
                    Finalizat: {new Date(project.completionDate).toLocaleDateString('ro-RO', { year: 'numeric', month: 'long' })}
                  </span>
                </div>
                <Button variant="primary" href={project.link} target="_blank" rel="noopener noreferrer">
                  {t('projects.viewDetails')} →
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;
