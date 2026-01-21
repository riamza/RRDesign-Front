import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { templates as initialTemplates } from '../../../data/mockData';
import Modal from '../../../components/Modal/Modal';
import './Manager.css';

const TemplatesManager = () => {
  const { t } = useTranslation();
  const [templates, setTemplates] = useState(initialTemplates);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    technologies: [''],
    demoLink: '',
    category: '',
    features: ['']
  });

  const handleEdit = (template) => {
    setFormData({
      title: template.title,
      description: template.description,
      image: template.image,
      technologies: [...template.technologies],
      demoLink: template.demoLink,
      category: template.category,
      features: [...template.features]
    });
    setEditingId(template.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm(t('dashboard.templatesManager.confirmDelete'))) {
      setTemplates(templates.filter(t => t.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingId) {
      setTemplates(templates.map(t => 
        t.id === editingId ? { ...formData, id: editingId } : t
      ));
    } else {
      const newTemplate = {
        ...formData,
        id: Math.max(...templates.map(t => t.id), 0) + 1
      };
      setTemplates([...templates, newTemplate]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image: '',
      technologies: [''],
      demoLink: '',
      category: '',
      features: ['']
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleArrayChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayItem = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  return (
    <div className="manager">
      <div className="manager-header">
        <button className="btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
          {'+ ' + t('dashboard.templatesManager.add')}
        </button>
      </div>

      <Modal
        isOpen={showForm}
        onClose={resetForm}
        title={editingId ? t('dashboard.templatesManager.edit') : t('dashboard.templatesManager.add')}
      >
        <form onSubmit={handleSubmit} className="manager-form" style={{ margin: 0, padding: 0, border: 'none', boxShadow: 'none' }}>
          <div className="form-row">
            <div className="form-group">
              <label>{t('dashboard.templatesManager.title')}</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>{t('dashboard.templatesManager.category')}</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>{t('dashboard.templatesManager.description')}</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="4"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{t('dashboard.templatesManager.image')}</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>{t('dashboard.templatesManager.demoLink')}</label>
              <input
                type="url"
                value={formData.demoLink}
                onChange={(e) => setFormData({ ...formData, demoLink: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>{t('dashboard.templatesManager.technologies')}</label>
            {formData.technologies.map((tech, index) => (
              <div key={index} className="array-item">
                <input
                  type="text"
                  value={tech}
                  onChange={(e) => handleArrayChange('technologies', index, e.target.value)}
                  placeholder={t('dashboard.templatesManager.technologyPlaceholder')}
                  required
                />
                {formData.technologies.length > 1 && (
                  <button
                    type="button"
                    className="btn-remove"
                    onClick={() => removeArrayItem('technologies', index)}
                  >
                    {t('dashboard.templatesManager.delete')}
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="btn-add"
              onClick={() => addArrayItem('technologies')}
            >
              {t('dashboard.templatesManager.addTechnology')}
            </button>
          </div>

          <div className="form-group">
            <label>{t('dashboard.templatesManager.features')}</label>
            {formData.features.map((feature, index) => (
              <div key={index} className="array-item">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleArrayChange('features', index, e.target.value)}
                  placeholder={t('dashboard.templatesManager.featurePlaceholder')}
                  required
                />
                {formData.features.length > 1 && (
                  <button
                    type="button"
                    className="btn-remove"
                    onClick={() => removeArrayItem('features', index)}
                  >
                    {t('dashboard.templatesManager.delete')}
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="btn-add"
              onClick={() => addArrayItem('features')}
            >
              {t('dashboard.templatesManager.addFeature')}
            </button>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editingId ? t('dashboard.templatesManager.update') : t('dashboard.templatesManager.save')}
            </button>
            <button type="button" className="btn-secondary" onClick={resetForm}>
              {t('dashboard.templatesManager.cancel')}
            </button>
          </div>
        </form>
      </Modal>

      <div className="manager-list">
        {templates.map(template => (
          <div key={template.id} className="manager-item">
            <div className="item-header">
              <h3>{template.title}</h3>
            </div>
            <p className="item-description">{template.description}</p>
            <div className="item-tags">
              {template.technologies.map((tech, index) => (
                <span key={index} className="tag">{tech}</span>
              ))}
            </div>
            <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1rem' }}>
              {template.category}
            </p>
            <div className="item-actions">
              <button className="btn-edit" onClick={() => handleEdit(template)}>
                {t('dashboard.templatesManager.edit')}
              </button>
              <button className="btn-delete" onClick={() => handleDelete(template.id)}>
                {t('dashboard.templatesManager.delete')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplatesManager;
