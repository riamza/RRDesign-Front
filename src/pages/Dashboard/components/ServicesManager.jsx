import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Pencil, Trash2 } from 'lucide-react';
import { api } from '../../../services/api';
import Modal from '../../../components/Modal/Modal';
import ConfirmModal from '../../../components/ConfirmModal/ConfirmModal';
import ServiceCard from '../../../components/ServiceCard/ServiceCard';
import './Manager.css';

const ServicesManager = () => {
  const { t } = useTranslation();
  const [services, setServices] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteItemName, setDeleteItemName] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: ''
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await api.getServices();
      setServices(data);
    } catch (error) {
      console.error("Failed to load services", error);
    }
  };

  const handleEdit = (service) => {
    setFormData({
      title: service.title,
      description: service.description,
      icon: service.icon
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
      icon: ''
    });
    setEditingId(null);
    setShowForm(false);
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
                placeholder="monitor, smartphone, server, palette, cloud, users"
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

          {/* Features and Technologies removed as they are not supported by the backend yet */}

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
