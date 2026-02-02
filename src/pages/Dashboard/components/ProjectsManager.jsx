import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, X } from 'lucide-react';
import { projects as initialProjects } from '../../../data/mockData';
import Modal from '../../../components/Modal/Modal';
import ConfirmModal from '../../../components/ConfirmModal/ConfirmModal';
import ProjectCard from '../../../components/ProjectCard/ProjectCard';
import './Manager.css';

const ProjectsManager = () => {
  const { t } = useTranslation();
  const [projects, setProjects] = useState(initialProjects);
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
    link: '',
    category: '',
    completionDate: ''
  });

  const gridRef = useRef(null);

  useEffect(() => {
    const alignCardSections = () => {
      if (!gridRef.current) return;

      const images = gridRef.current.querySelectorAll('.project-image');
      const categories = gridRef.current.querySelectorAll('.project-category');
      const titles = gridRef.current.querySelectorAll('.project-title');
      const descriptions = gridRef.current.querySelectorAll('.project-description');
      const tags = gridRef.current.querySelectorAll('.project-tags');
      const metas = gridRef.current.querySelectorAll('.project-meta');

      // Reset heights
      [...images, ...categories, ...titles, ...descriptions, ...tags, ...metas].forEach(el => {
        el.style.height = 'auto';
      });

      // Calculate max heights
      const maxImageHeight = Math.max(...Array.from(images).map(el => el.offsetHeight));
      const maxCategoryHeight = Math.max(...Array.from(categories).map(el => el.offsetHeight));
      const maxTitleHeight = Math.max(...Array.from(titles).map(el => el.offsetHeight));
      const maxDescHeight = Math.max(...Array.from(descriptions).map(el => el.offsetHeight));
      const maxTagsHeight = Math.max(...Array.from(tags).map(el => el.offsetHeight));
      const maxMetaHeight = Math.max(...Array.from(metas).map(el => el.offsetHeight));

      // Apply max heights
      if (images.length) images.forEach(el => el.style.height = `${maxImageHeight}px`);
      if (categories.length) categories.forEach(el => el.style.height = `${maxCategoryHeight}px`);
      if (titles.length) titles.forEach(el => el.style.height = `${maxTitleHeight}px`);
      if (descriptions.length) descriptions.forEach(el => el.style.height = `${maxDescHeight}px`);
      if (tags.length) tags.forEach(el => el.style.height = `${maxTagsHeight}px`);
      if (metas.length) metas.forEach(el => el.style.height = `${maxMetaHeight}px`);
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
  }, [projects]);

  const handleEdit = (project) => {
    setFormData({
      title: project.title,
      description: project.description,
      image: project.image,
      technologies: [...project.technologies],
      link: project.link,
      category: project.category,
      completionDate: project.completionDate
    });
    setEditingId(project.id);
    setShowForm(true);
  };

  const handleDelete = (project) => {
    setDeleteId(project.id);
    setDeleteItemName(project.title);
    setShowConfirmDelete(true);
  };

  const confirmDelete = () => {
    setProjects(projects.filter(p => p.id !== deleteId));
    setDeleteId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingId) {
      setProjects(projects.map(p => 
        p.id === editingId ? { ...formData, id: editingId } : p
      ));
    } else {
      const newProject = {
        ...formData,
        id: Math.max(...projects.map(p => p.id), 0) + 1
      };
      setProjects([...projects, newProject]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image: '',
      technologies: [''],
      link: '',
      category: '',
      completionDate: ''
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
          {'+ ' + t('dashboard.projectsManager.add')}
        </button>
      </div>

      <Modal
        isOpen={showForm}
        onClose={resetForm}
        title={editingId ? t('dashboard.projectsManager.edit') : t('dashboard.projectsManager.add')}
      >
        <form onSubmit={handleSubmit} className="manager-form" style={{ margin: 0, padding: 0, border: 'none', boxShadow: 'none' }}>
          <div className="form-row">
            <div className="form-group">
              <label>{t('dashboard.projectsManager.title')}</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>{t('dashboard.projectsManager.category')}</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>{t('dashboard.projectsManager.description')}</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label>{t('dashboard.projectsManager.image')}</label>
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
                <label htmlFor="project-image-upload" className="image-upload-label">
                  <Upload size={32} className="upload-icon" />
                  <span className="upload-text">Click to upload image</span>
                  <span className="upload-hint">SVG, PNG, JPG or GIF (max. 5MB)</span>
                  <input
                    id="project-image-upload"
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

          <div className="form-row">
            <div className="form-group">
              <label>{t('dashboard.projectsManager.link')}</label>
              <input
                type="url"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>{t('dashboard.projectsManager.completionDate')}</label>
              <input
                type="text"
                value={formData.completionDate}
                onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
                placeholder={t('dashboard.projectsManager.datePlaceholder')}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>{t('dashboard.projectsManager.technologies')}</label>
            {formData.technologies.map((tech, index) => (
              <div key={index} className="array-item">
                <input
                  type="text"
                  value={tech}
                  onChange={(e) => handleArrayChange('technologies', index, e.target.value)}
                  placeholder={t('dashboard.projectsManager.technologyPlaceholder')}
                  required
                />
                {formData.technologies.length > 1 && (
                  <button
                    type="button"
                    className="btn-remove"
                    onClick={() => removeArrayItem('technologies', index)}
                  >
                    {t('dashboard.projectsManager.delete')}
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="btn-add"
              onClick={() => addArrayItem('technologies')}
            >
              + {t('dashboard.projectsManager.addTechnology')}
            </button>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editingId ? t('dashboard.projectsManager.update') : t('dashboard.projectsManager.save')}
            </button>
            <button type="button" className="btn-secondary" onClick={resetForm}>
              {t('dashboard.projectsManager.cancel')}
            </button>
          </div>
        </form>
      </Modal>

      <div className="services-manager-grid" ref={gridRef}>
        {projects.map(project => (
          <ProjectCard 
            key={project.id} 
            project={project} 
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
        title={t('dashboard.projectsManager.confirmDelete')}
        message={`Ești sigur că vrei să ștergi proiectul "${deleteItemName}"? Această acțiune nu poate fi anulată.`}
      />
    </div>
  );
};

export default ProjectsManager;
