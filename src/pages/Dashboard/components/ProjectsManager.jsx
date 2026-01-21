import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { projects as initialProjects } from '../../../data/mockData';
import Modal from '../../../components/Modal/Modal';
import './Manager.css';

const ProjectsManager = () => {
  const { t } = useTranslation();
  const [projects, setProjects] = useState(initialProjects);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    technologies: [''],
    link: '',
    category: '',
    completionDate: ''
  });

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

  const handleDelete = (id) => {
    if (window.confirm(t('dashboard.projectsManager.confirmDelete'))) {
      setProjects(projects.filter(p => p.id !== id));
    }
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

          <div className="form-row">
            <div className="form-group">
              <label>{t('dashboard.projectsManager.image')}</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>{t('dashboard.projectsManager.link')}</label>
              <input
                type="url"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-row">
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

      <div className="manager-list">
        {projects.map(project => (
          <div key={project.id} className="manager-item">
            <div className="item-header">
              <h3>{project.title}</h3>
            </div>
            <p className="item-description">{project.description}</p>
            <div className="item-tags">
              {project.technologies.map((tech, index) => (
                <span key={index} className="tag">{tech}</span>
              ))}
            </div>
            <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1rem' }}>
              {project.category} • {project.completionDate}
            </p>
            <div className="item-actions">
              <button className="btn-edit" onClick={() => handleEdit(project)}>
                {t('dashboard.projectsManager.edit')}
              </button>
              <button className="btn-delete" onClick={() => handleDelete(project.id)}>
                {t('dashboard.projectsManager.delete')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsManager;
