import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { pricingPackages as initialPricing } from '../../../data/mockData';
import Modal from '../../../components/Modal/Modal';
import './Manager.css';

const PricingManager = () => {
  const { t } = useTranslation();
  const [pricing, setPricing] = useState(initialPricing);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    features: [''],
    highlight: false
  });

  const handleEdit = (pkg) => {
    setFormData({
      title: pkg.title,
      price: pkg.price,
      description: pkg.description,
      features: [...pkg.features], // Create a copy of the array
      highlight: pkg.highlight
    });
    setEditingId(pkg.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm(t('dashboard.pricingManager.confirmDelete'))) {
      setPricing(pricing.filter(p => p.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setPricing(pricing.map(p => p.id === editingId ? { ...formData, id: editingId } : p));
    } else {
      setPricing([...pricing, { ...formData, id: Date.now() }]);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      price: '',
      description: '',
      features: [''],
      highlight: false
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
          {'+ ' + t('dashboard.pricingManager.add')}
        </button>
      </div>

      <Modal
        isOpen={showForm}
        onClose={resetForm}
        title={editingId ? t('dashboard.pricingManager.edit') : t('dashboard.pricingManager.add')}
      >
        <form className="manager-form" onSubmit={handleSubmit} style={{ margin: 0, padding: 0, border: 'none', boxShadow: 'none' }}>
          <div className="form-row">
            <div className="form-group">
              <label>{t('dashboard.pricingManager.title')}</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>{t('dashboard.pricingManager.price')}</label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="1500 RON"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>{t('dashboard.pricingManager.description')}</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows="3"
            />
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label style={{ margin: 0 }}>{t('dashboard.pricingManager.highlight')}</label>
            <input 
              type="checkbox" 
              checked={formData.highlight} 
              onChange={(e) => setFormData({...formData, highlight: e.target.checked})}
              style={{ width: 'auto' }}
            />
          </div>

          <div className="form-group">
            <label>{t('dashboard.pricingManager.features')}</label>
            {formData.features.map((feature, index) => (
              <div key={index} className="array-item">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleArrayChange('features', index, e.target.value)}
                  placeholder={t('dashboard.pricingManager.featurePlaceholder')}
                />
                <button type="button" className="btn-remove" onClick={() => removeArrayItem('features', index)}>
                  ✕
                </button>
              </div>
            ))}
            <button type="button" className="btn-add" onClick={() => addArrayItem('features')}>
              {'+ ' + t('dashboard.pricingManager.addFeature')}
            </button>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editingId ? t('dashboard.pricingManager.update') : t('dashboard.pricingManager.save')}
            </button>
            <button type="button" className="btn-secondary" onClick={resetForm}>
              {t('dashboard.pricingManager.cancel')}
            </button>
          </div>
        </form>
      </Modal>

      <div className="manager-list">
        {pricing.map(pkg => (
          <div key={pkg.id} className="manager-item">
            <div className={`item-header ${pkg.highlight ? 'highlight-item' : ''}`}>
              <h3>{pkg.title} <span style={{fontSize: '0.8em', color: '#666'}}>({pkg.price})</span></h3>
              {pkg.highlight && <span className="tag" style={{background: '#FF6B6B', color: 'white'}}>Highlighted</span>}
            </div>
            <p className="item-description">{pkg.description}</p>
            <div className="item-tags">
              {pkg.features.slice(0, 3).map((feature, i) => (
                <span key={i} className="tag">{feature}</span>
              ))}
              {pkg.features.length > 3 && <span className="tag">...</span>}
            </div>
            <div className="item-actions">
              <button className="btn-edit" onClick={() => handleEdit(pkg)}>
                ✏️ {t('dashboard.pricingManager.edit')}
              </button>
              <button className="btn-delete" onClick={() => handleDelete(pkg.id)}>
                🗑️ {t('dashboard.pricingManager.delete')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingManager;
