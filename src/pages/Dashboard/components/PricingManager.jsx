import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { pricingPackages as initialPricing } from '../../../data/mockData';
import Modal from '../../../components/Modal/Modal';
import ConfirmModal from '../../../components/ConfirmModal/ConfirmModal';
import PriceCard from '../../../components/PriceCard/PriceCard';
import './Manager.css';

const PricingManager = () => {
  const { t } = useTranslation();
  const [pricing, setPricing] = useState(initialPricing);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteItemName, setDeleteItemName] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    features: [''],
    highlight: false
  });

  const gridRef = useRef(null);

  useEffect(() => {
    const alignCardSections = () => {
      if (!gridRef.current) return;

      const headers = gridRef.current.querySelectorAll('.pricing-header');
      const features = gridRef.current.querySelectorAll('.pricing-features');
      
      // Reset
      [...headers, ...features].forEach(el => el.style.height = 'auto');

      // Calc max
      const maxHeaderHeight = Math.max(...Array.from(headers).map(el => el.offsetHeight));
      const maxFeaturesHeight = Math.max(...Array.from(features).map(el => el.offsetHeight));

      // Apply
      if(headers.length) headers.forEach(el => el.style.height = `${maxHeaderHeight}px`);
      if(features.length) features.forEach(el => el.style.height = `${maxFeaturesHeight}px`);
    };

    alignCardSections();
    window.addEventListener('resize', alignCardSections);
    const timeoutId = setTimeout(alignCardSections, 100);
    
    return () => {
      window.removeEventListener('resize', alignCardSections);
      clearTimeout(timeoutId);
    };
  }, [pricing]);

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

  const handleDelete = (pkg) => {
    setDeleteId(pkg.id);
    setDeleteItemName(pkg.title);
    setShowConfirmDelete(true);
  };

  const confirmDelete = () => {
    setPricing(pricing.filter(p => p.id !== deleteId));
    setDeleteId(null);
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

      <div className="services-manager-grid" ref={gridRef}>
        {pricing.map(pkg => (
          <PriceCard 
            key={pkg.id} 
            pkg={pkg} 
            isAdmin={true}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <ConfirmModal
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={confirmDelete}
        title={t('dashboard.pricingManager.confirmDelete')}
        message={`Ești sigur că vrei să ștergi pachetul "${deleteItemName}"? Această acțiune nu poate fi anulată.`}
      />
    </div>
  );
};

export default PricingManager;
