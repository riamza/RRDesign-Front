import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pencil, Trash2 } from 'lucide-react';
import Card from '../Card/Card';
import Button from '../Button/Button';
import './TemplateCard.css';

const TemplateCard = ({ template, isAdmin = false, onEdit, onDelete }) => {
  const { t } = useTranslation();
  const imageDisplay = template.image || template.imageUrl;
  const demoLink = template.demoLink || template.previewLink;

  return (
    <Card className={`template-card ${!template.isVisible ? 'is-hidden' : ''}`} style={!template.isVisible ? { opacity: 0.7, border: '1px dashed #ccc' } : {}}>
      {!template.isVisible && (
        <div style={{ position: 'absolute', top: 10, right: 10, background: '#999', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', zIndex: 10 }}>
          HIDDEN
        </div>
      )}
      {imageDisplay && (
        <div className="template-image">
          <img src={imageDisplay} alt={template.title} className="card-image" />
        </div>
      )}
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
          {(template.features || []).map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </div>

      {!isAdmin && demoLink && (
        <Button variant="secondary" href={demoLink} target="_blank" rel="noopener noreferrer">
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
