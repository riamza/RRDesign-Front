import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pencil, Trash2 } from 'lucide-react';
import Card from '../Card/Card';
import Button from '../Button/Button';
import './TemplateCard.css';

const TemplateCard = ({ template, isAdmin = false, onEdit, onDelete }) => {
  const { t } = useTranslation();

  return (
    <Card className="template-card">
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

      {!isAdmin && (
        <Button variant="primary" href={template.demoLink}>
          {t('templates.viewDemo')} →
        </Button>
      )}

      {isAdmin && (
        <div className="template-actions">
          <button className="btn-card-edit" onClick={() => onEdit(template)}>
            <Pencil size={16} /> {t('dashboard.templatesManager.edit')}
          </button>
          <button className="btn-card-delete" onClick={() => onDelete(template)}>
            <Trash2 size={16} /> {t('dashboard.templatesManager.delete')}
          </button>
        </div>
      )}
    </Card>
  );
};

export default TemplateCard;
