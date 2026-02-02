import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, X } from 'lucide-react';
import { templates as initialTemplates } from '../../../data/mockData';
import Modal from '../../../components/Modal/Modal';
import ConfirmModal from '../../../components/ConfirmModal/ConfirmModal';
import TemplateCard from '../../../components/TemplateCard/TemplateCard';
import './Manager.css';

const TemplatesManager = () => {
  const { t } = useTranslation();
  const [templates, setTemplates] = useState(initialTemplates);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteItemName, setDeleteItemName] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    technologies: [''],
    demoLink: '',
    category: '',
    features: ['']
  });

  const gridRef = useRef(null);

  useEffect(() => {
    const alignCardSections = () => {
      if (!gridRef.current) return;

      const images = gridRef.current.querySelectorAll('.template-image');
      const categories = gridRef.current.querySelectorAll('.template-category');
      const titles = gridRef.current.querySelectorAll('.template-title');
      const descriptions = gridRef.current.querySelectorAll('.template-description');
      const features = gridRef.current.querySelectorAll('.template-features');
      const tags = gridRef.current.querySelectorAll('.template-tags');

      // Reset heights
      [...images, ...categories, ...titles, ...descriptions, ...features, ...tags].forEach(el => {
        el.style.height = 'auto';
      });

      // Calculate max heights
      const maxImageHeight = Math.max(...Array.from(images).map(el => el.offsetHeight));
      const maxCategoryHeight = Math.max(...Array.from(categories).map(el => el.offsetHeight));
      const maxTitleHeight = Math.max(...Array.from(titles).map(el => el.offsetHeight));
      const maxDescHeight = Math.max(...Array.from(descriptions).map(el => el.offsetHeight));
      const maxFeaturesHeight = Math.max(...Array.from(features).map(el => el.offsetHeight));
      const maxTagsHeight = Math.max(...Array.from(tags).map(el => el.offsetHeight));

      // Apply max heights
      if (images.length) images.forEach(el => el.style.height = `${maxImageHeight}px`);
      if (categories.length) categories.forEach(el => el.style.height = `${maxCategoryHeight}px`);
      if (titles.length) titles.forEach(el => el.style.height = `${maxTitleHeight}px`);
      if (descriptions.length) descriptions.forEach(el => el.style.height = `${maxDescHeight}px`);
      if (features.length) features.forEach(el => el.style.height = `${maxFeaturesHeight}px`);
      if (tags.length) tags.forEach(el => el.style.height = `${maxTagsHeight}px`);
    };

    alignCardSections();
    
    // Re-run alignment when images load
    const images = gridRef.current?.querySelectorAll('img');
    images?.forEach(img => {
      if (img.complete) {
        alignCardSections();
      } else {
        img.addEventListener('load', alignCardSections);
      }
    });

    window.addEventListener('resize', alignCardSections);
    const timeoutId = setTimeout(alignCardSections, 100);
    
    return () => {
      window.removeEventListener('resize', alignCardSections);
      clearTimeout(timeoutId);
      images?.forEach(img => img.removeEventListener('load', alignCardSections));
    };
  }, [templates]);

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

  const handleDelete = (template) => {
    setDeleteId(template.id);
    setDeleteItemName(template.title);
    setShowConfirmDelete(true);
  };

  const confirmDelete = () => {
    setTemplates(templates.filter(t => t.id !== deleteId));
    setDeleteId(null);
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
