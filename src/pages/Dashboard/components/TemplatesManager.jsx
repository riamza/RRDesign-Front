import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { invalidateTemplates, fetchTemplates } from '../../../store/slices/templatesSlice';
import { Upload, X } from 'lucide-react';
import { api } from '../../../services/api';
import Modal from '../../../components/Modal/Modal';
import ConfirmModal from '../../../components/ConfirmModal/ConfirmModal';
import TemplateCard from '../../../components/TemplateCard/TemplateCard';
import './Manager.css';

const TemplatesManager = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { items: templates, status } = useSelector((state) => state.templates);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteItemName, setDeleteItemName] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    demoLink: '',
    price: '',
    isFree: false
  });

  const loadTemplates = async () => {
     dispatch(invalidateTemplates());
     dispatch(fetchTemplates());
  };

  useEffect(() => {
    dispatch(fetchTemplates());
  }, [dispatch]);

  // grid alignment logic...
  const gridRef = useRef(null);
  useEffect(() => {
     // ... keeping it simple or reuse existing alignment if needed
  }, [templates]);

  const handleEdit = (template) => {
    setFormData({
      title: template.title,
      description: template.description,
      image: template.image,
      demoLink: template.demoLink,
      price: template.price,
      isFree: template.isFree
    });
    setEditingId(template.id);
    setShowForm(true);
  };
  
  const handleDelete = (template) => {
    setDeleteId(template.id);
    setDeleteItemName(template.title);
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    try {
      await api.deleteTemplate(deleteId);
      dispatch(invalidateTemplates());
      await loadTemplates();
    } catch (e) { console.error(e); }
    setDeleteId(null);
    setShowConfirmDelete(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.updateTemplate(editingId, formData);
      } else {
        await api.createTemplate(formData);
      }
      dispatch(invalidateTemplates());
      await loadTemplates();
      resetForm();
    } catch (e) { console.error(e); }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image: '',
      demoLink: '',
      price: '',
      isFree: false
    });
    setEditingId(null);
    setShowForm(false);
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

          <div className="form-group">
            <label>{t('dashboard.templatesManager.image')}</label>
            <div className="image-upload-container">
              {formData.image ? (
                <div className="preview-wrapper">
                  <img 
                    src={formData.image} 
                    alt="Preview" 
                    className="image-preview" 
                  />
                  <button
                    type="button"
                    className="btn-remove-image"
                    onClick={() => setFormData({ ...formData, image: '' })}
                    title="Remove image"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label htmlFor="template-image-upload" className="image-upload-label">
                  <Upload size={32} className="upload-icon" />
                  <span className="upload-text">Click to upload image</span>
                  <span className="upload-hint">SVG, PNG, JPG or GIF (max. 5MB)</span>
                  <input
                    id="template-image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden-input"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormData({ ...formData, image: reader.result });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              )}
            </div>
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

          {/* Technologies and Features disabled as backend doesn't support them yet */}

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

      <div className="services-manager-grid" ref={gridRef}>
        {templates.map(template => (
          <TemplateCard 
            key={template.id} 
            template={template} 
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
        title={t('dashboard.templatesManager.confirmDelete')}
        message={`Ești sigur că vrei să ștergi template-ul "${deleteItemName}"? Această acțiune nu poate fi anulată.`}
      />
    </div>
  );
};

export default TemplatesManager;
