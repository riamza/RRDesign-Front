import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { invalidateServices, fetchServices } from '../../../store/slices/servicesSlice';
import { Pencil, Trash2 } from 'lucide-react';
import { api } from '../../../services/api';
import Modal from '../../../components/Modal/Modal';
import ConfirmModal from '../../../components/ConfirmModal/ConfirmModal';
import ServiceCard from '../../../components/ServiceCard/ServiceCard';
import './Manager.css';

const ICON_OPTIONS = [
  { value: 'monitor', label: '🖥️ Monitor (Web Design)' },
  { value: 'smartphone', label: '📱 Smartphone (Mobile Apps)' },
  { value: 'code', label: '💻 Code (Development)' },
  { value: 'server', label: '💾 Server (Backend/Hosting)' },
  { value: 'palette', label: '🎨 Palette (UI/UX Design)' },
  { value: 'cloud', label: '☁️ Cloud (Cloud Services)' },
  { value: 'users', label: '👥 Users (Consulting)' },
  { value: 'database', label: '🗄️ Database' },
  { value: 'globe', label: '🌍 Globe (SEO/Web)' },
  { value: 'lock', label: '🔒 Lock (Security)' },
  { value: 'shoppingCart', label: '🛒 Shopping Cart (E-commerce)' },
  { value: 'briefcase', label: '💼 Briefcase (Business)' },
  { value: 'wrench', label: '🔧 Wrench (Maintenance)' },
  { value: 'cpu', label: '⚙️ CPU (Technical)' },
  { value: 'zap', label: '⚡ Zap (Performance)' },
  { value: 'shield', label: '🛡️ Shield (Cybersecurity)' },
  { value: 'search', label: '🔍 Search (SEO)' },
  { value: 'barChart', label: '📊 Bar Chart (Analytics)' },
  { value: 'target', label: '🎯 Target (Marketing)' },
  { value: 'rocket', label: '🚀 Rocket (Startups)' }
];

const ServicesManager = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { items: services, status } = useSelector((state) => state.services);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteItemName, setDeleteItemName] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
    features: [],
    technologies: []
  });

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  const loadServices = async () => {
     dispatch(invalidateServices());
     dispatch(fetchServices());
  };

  const handleEdit = (service) => {
    setFormData({
      title: service.title,
      description: service.description,
      icon: service.icon,
      features: service.features || [],
      technologies: service.technologies || []
    });
    setEditingId(service.id);
    setShowForm(true);
  };


  const handleDelete = (service) => {
    setDeleteId(service.id);
    setDeleteItemName(service.title);
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    try {
      await api.deleteService(deleteId);
      dispatch(invalidateServices());
      await loadServices();
    } catch (error) {
      console.error("Failed to delete service", error);
    }
    setDeleteId(null);
    setShowConfirmDelete(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.updateService(editingId, formData);
      } else {
        await api.createService(formData);
      }
      dispatch(invalidateServices());
      await loadServices();
      resetForm();
    } catch (error) {
      console.error("Failed to save service", error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      icon: '',
      features: [],
      technologies: []
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
        width="600px"
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
              <select
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  backgroundColor: 'white',
                  fontSize: '1rem'
                }}
              >
                <option value="">{t('dashboard.servicesManager.selectIcon') || 'Select Icon'}</option>
                {ICON_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
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
            {formData.features.map((item, index) => (
              <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayChange('features', index, e.target.value)}
                  placeholder={t('dashboard.servicesManager.featurePlaceholder')}
                />
                <button 
                  type="button" 
                  onClick={() => removeArrayItem('features', index)}
                  className="btn-icon danger"
                  style={{ padding: '8px' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button type="button" className="btn-secondary" onClick={() => addArrayItem('features')}>
              + {t('dashboard.servicesManager.addFeature')}
            </button>
          </div>

          <div className="form-group">
            <label>{t('dashboard.servicesManager.technologies')}</label>
            {formData.technologies.map((item, index) => (
              <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayChange('technologies', index, e.target.value)}
                  placeholder={t('dashboard.servicesManager.technologyPlaceholder')}
                />
                <button 
                  type="button" 
                  onClick={() => removeArrayItem('technologies', index)}
                  className="btn-icon danger"
                  style={{ padding: '8px' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button type="button" className="btn-secondary" onClick={() => addArrayItem('technologies')}>
              + {t('dashboard.servicesManager.addTechnology')}
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

      <div className="services-manager-grid">
        {services.map(service => (
          <ServiceCard
            key={service.id}
            service={service}
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
        title={t('dashboard.servicesManager.confirmDelete')}
        message={`Ești sigur că vrei să ștergi serviciul "${deleteItemName}"? Această acțiune nu poate fi anulată.`}
      />
    </div>
  );
};

export default ServicesManager;
