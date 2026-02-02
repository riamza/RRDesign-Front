import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pencil, Trash2 } from 'lucide-react';
import Card from '../Card/Card';
import Button from '../Button/Button';
import './ProjectCard.css';

const ProjectCard = ({ project, isAdmin = false, onEdit, onDelete }) => {
  const { t } = useTranslation();

  return (
    <Card className="project-card">
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
      
      {!isAdmin && (
        <>
          <div className="project-meta">
            <span className="completion-date">
              Finalizat: {new Date(project.completionDate).toLocaleDateString('ro-RO', { year: 'numeric', month: 'long' })}
            </span>
          </div>
          <Button variant="primary" href={project.link} target="_blank" rel="noopener noreferrer">
            {t('projects.viewDetails')} →
          </Button>
        </>
      )}

      {isAdmin && (
        <>
           <div className="project-meta" style={{ borderTop: 'none', padding: 0, marginTop: 'auto', width: '100%', marginBottom: '0.5rem', textAlign: 'center' }}>
            <span className="completion-date">
              Finalizat: {project.completionDate}
            </span>
          </div>
          <div className="project-actions">
            <button className="btn-card-edit" onClick={() => onEdit(project)}>
              <Pencil size={16} /> {t('dashboard.projectsManager.edit')}
            </button>
            <button className="btn-card-delete" onClick={() => onDelete(project)}>
              <Trash2 size={16} /> {t('dashboard.projectsManager.delete')}
            </button>
          </div>
        </>
      )}
    </Card>
  );
};

export default ProjectCard;
