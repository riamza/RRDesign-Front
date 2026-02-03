import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, Edit2, Trash2, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { api } from '../../../services/api';
import './Managers.css';

const ClientProjectsManager = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form State
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    startDate: new Date().toISOString().split('T')[0],
    userId: ''
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await api.getClientProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      technologies: '',
      startDate: new Date().toISOString().split('T')[0],
      userId: ''
    });
  };

  const handleEdit = (project) => {
    setEditingId(project.id);
    setFormData({
      title: project.title,
      description: project.description,
      technologies: project.technologies,
      startDate: project.startDate ? project.startDate.split('T')[0] : '',
      userId: project.userId
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.updateClientProject(editingId, formData);
      } else {
        await api.createClientProject({
            ...formData,
            userId: parseInt(formData.userId)
        });
      }
      setIsModalOpen(false);
      fetchProjects();
      resetForm();
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project');
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation(); // Prevent navigation if row is clicked
    if (window.confirm(t('common.confirmDelete'))) {
      try {
        await api.deleteClientProject(id);
        fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const handleFinish = async (id, e) => {
      e.stopPropagation();
      try {
          await api.markClientProjectFinished(id);
          fetchProjects();
      } catch (error) {
           console.error('Error marking finished:', error);
      }
  };

  const handleCardClick = (id) => {
    navigate(`/dashboard/client-projects/${id}`);
  };

  return (
    <div className="manager-container">
      <div className="manager-header">
        <h2>{t('dashboard.clientProjects', 'Active Projects Management')}</h2>
        <button 
          className="btn-add"
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
        >
          <Plus size={20} />
          {t('common.add', 'Add Project')}
        </button>
      </div>

      <div className="projects-grid">
        {projects.map(project => (
          <div 
            key={project.id} 
            className={`project-card ${project.isFinished ? 'finished' : ''}`}
            onClick={() => handleCardClick(project.id)}
            style={{ cursor: 'pointer' }}
          >
            <div className="project-card-header">
              <div className="project-title-group">
                <h3>{project.title}</h3>
                <span className={`status-badge ${project.isFinished ? 'finished' : 'active'}`}>
                    {project.isFinished ? 'Finished' : 'Active'}
                </span>
              </div>
              <div className="project-actions">
                {!project.isFinished && (
                    <button 
                        className="btn-icon" 
                        title="Mark Finished"
                        onClick={(e) => handleFinish(project.id, e)}
                    >
                        <CheckCircle size={18} />
                    </button>
                )}
                <button 
                  className="btn-icon" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(project);
                  }}
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  className="btn-icon delete" 
                  onClick={(e) => handleDelete(project.id, e)}
                >
                  <Trash2 size={18} />
                </button>
                <button className="btn-icon primary">
                    <ExternalLink size={18} />
                </button>
              </div>
            </div>
            
            <p className="project-desc">{project.description}</p>
            
            <div className="project-meta">
               <span className="client-id">Client ID: {project.userId}</span>
               {project.technologies && (
                   <div className="tech-stack-mini">
                       {project.technologies.split(',').map((t, i) => (
                           <span key={i} className="tech-badge">{t.trim()}</span>
                       ))}
                   </div>
               )}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingId ? 'Edit Project' : 'New Project'}</h3>
              <button className="btn-close" onClick={() => setIsModalOpen(false)}>
                <XCircle size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              
              {!editingId && (
                  <div className="form-group">
                    <label>Client ID</label>
                    <input
                      type="number"
                      value={formData.userId}
                      onChange={(e) => setFormData({...formData, userId: e.target.value})}
                      required
                    />
                    <small>Enter User ID</small>
                  </div>
              )}

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                  <label>Technologies (comma separated)</label>
                  <input
                    value={formData.technologies}
                    onChange={(e) => setFormData({...formData, technologies: e.target.value})}
                  />
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientProjectsManager;
