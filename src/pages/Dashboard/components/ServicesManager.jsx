import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { services as initialServices } from '../../../data/mockData';
import Modal from '../../../components/Modal/Modal';
import './Manager.css';

const ServicesManager = () => {
  const { t } = useTranslation();
  const [services, setServices] = useState(initialServices);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
    features: [''],
    technologies: ['']
  });

  const handleEdit = (service) => {
    setFormData(service);
    setEditingId(service.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm(t('dashboard.servicesManager.confirmDelete'))) {
      setServices(services.filter(s => s.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setServices(services.map(s => s.id === editingId ? { ...formData, id: editingId } : s));
    } else {
      setServices([...services, { ...formData, id: Date.now() }]);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      icon: '',
      features: [''],
      technologies: ['']
    });
    setEditingId(null);
    setShowForm(false);
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
          {'+ ' + t('dashboard.servicesManager.add')}
        </button>
      </div>

      <Modal
        isOpen={showForm}
        onClose={resetForm}
        title={editingId ? t('dashboard.servicesManager.edit') : t('dashboard.servicesManager.add')}
      >
        <form className="manager-form" onSubmit={handleSubmit} style={{ margin: 0, padding: 0, border: 'none', boxShadow: 'none' }}>
          <div className="form-row">
            <div className="form-group">
              <label>{t('dashboard.servicesManager.title')}</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>{t('dashboard.servicesManager.icon')}</label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="💻"
              />
            </div>
          </div>

          <div className="form-group">
            <label>{t('dashboard.servicesManager.description')}</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>{t('dashboard.servicesManager.features')}</label>
            {formData.features.map((feature, index) => (
              <div key={index} className="array-item">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleArrayChange('features', index, e.target.value)}
                  placeholder={t('dashboard.servicesManager.featurePlaceholder')}
                />
                <button type="button" className="btn-remove" onClick={() => removeArrayItem('features', index)}>
                  ✕
                </button>
              </div>
            ))}
            <button type="button" className="btn-add" onClick={() => addArrayItem('features')}>
              {'+ ' + t('dashboard.servicesManager.addFeature')}
            </button>
          </div>

          <div className="form-group">
            <label>{t('dashboard.servicesManager.technologies')}</label>
            {formData.technologies.map((tech, index) => (
              <div key={index} className="array-item">
                <input
                  type="text"
                  value={tech}
                  onChange={(e) => handleArrayChange('technologies', index, e.target.value)}
                  placeholder={t('dashboard.servicesManager.technologyPlaceholder')}
                />
                <button type="button" className="btn-remove" onClick={() => removeArrayItem('technologies', index)}>
                  ✕
                </button>
              </div>
            ))}
            <button type="button" className="btn-add" onClick={() => addArrayItem('technologies')}>
              {'+ ' + t('dashboard.servicesManager.addTechnology')}
            </button>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editingId ? t('dashboard.servicesManager.update') : t('dashboard.servicesManager.save')}
            </button>
            <button type="button" className="btn-secondary" onClick={resetForm}>
              {t('dashboard.servicesManager.cancel')}
            </button>
          </div>
        </form>
      </Modal>

      <div className="manager-list">
        {services.map(service => (
          <div key={service.id} className="manager-item">
            <div className="item-header">
              <span className="item-icon">{service.icon}</span>
              <h3>{service.title}</h3>
            </div>
            <p className="item-description">{service.description}</p>
            <div className="item-tags">
              {service.technologies.map((tech, i) => (
                <span key={i} className="tag">{tech}</span>
              ))}
            </div>
            <div className="item-actions">
              <button className="btn-edit" onClick={() => handleEdit(service)}>
                ✏️ {t('dashboard.servicesManager.edit')}
              </button>
              <button className="btn-delete" onClick={() => handleDelete(service.id)}>
                🗑️ {t('dashboard.servicesManager.delete')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesManager;
