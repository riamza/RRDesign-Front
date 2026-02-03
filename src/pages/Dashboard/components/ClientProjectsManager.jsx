import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Edit2, Trash2, CheckCircle, ExternalLink, Calendar, User, Mail } from 'lucide-react';
import { api } from '../../../services/api';
import Modal from '../../../components/Modal/Modal';
import ConfirmModal from '../../../components/ConfirmModal/ConfirmModal';
import './Manager.css';

const ClientProjectsManager = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal States
  const [showForm, setShowForm] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  
  // Data States
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  
  // Form State
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    startDate: new Date().toISOString().split('T')[0],
    userId: '',
    newUserEmail: ''
  });

  useEffect(() => {
    fetchProjects();
    fetchUsers();
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

  const fetchUsers = async () => {
      try {
          if (api.getUsers) {
             const users = await api.getUsers();
             setAvailableUsers(users);
          }
      } catch (e) {
          console.warn('Failed to load users for dropdown', e);
      }
  };

  const resetForm = () => {
    setEditingId(null);
    setIsExistingUser(false);
    setFormData({
      title: '',
      description: '',
      technologies: '',
      startDate: new Date().toISOString().split('T')[0],
      userId: '',
      newUserEmail: ''
    });
    setShowForm(false);
  };

  const handleEdit = (project, e) => {
    e.stopPropagation();
    setEditingId(project.id);
    setIsExistingUser(true); // Editing always implies existing user
    setFormData({
      title: project.title,
      description: project.description,
      technologies: project.technologies,
      startDate: project.startDate ? project.startDate.split('T')[0] : '',
      userId: project.userId,
      newUserEmail: ''
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
          title: formData.title,
          description: formData.description,
          technologies: formData.technologies,
          startDate: formData.startDate,
          // If existing user checkbox is checked, send userId. Else send email.
          userId: isExistingUser ? (formData.userId ? parseInt(formData.userId) : null) : null,
          newUserEmail: !isExistingUser ? formData.newUserEmail : null
      };

      if (editingId) {
        await api.updateClientProject(editingId, payload);
      } else {
        await api.createClientProject(payload);
      }
      setShowForm(false);
      resetForm();
      fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project. ' + error.message);
    }
  };

  const handleDeleteClick = (id, e) => {
    e.stopPropagation();
    setDeleteId(id);
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    if (deleteId) {
        try {
            await api.deleteClientProject(deleteId);
            fetchProjects();
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    }
    setShowConfirmDelete(false);
    setDeleteId(null);
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
    <div className="manager">
      <div className="manager-header">
        <button 
          className="btn-primary"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          + {t('common.add', 'Add Project')}
        </button>
      </div>

      <div className="services-manager-grid">
        {projects.map(project => (
          <div 
            key={project.id} 
            className={`admin-card ${project.isFinished ? 'opacity-75' : ''}`}
            onClick={() => handleCardClick(project.id)}
            style={{ cursor: 'pointer', position: 'relative' }}
          >
            <div className="card-content">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">{project.title}</h3>
                    {project.isFinished && (
                         <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Finished</span>
                    )}
                </div>
                
                <p className="description mb-4">{project.description}</p>
                
                <div className="meta-info text-sm text-gray-500 mb-4 space-y-1">
                    <div className="flex items-center gap-2">
                        <User size={14} />
                        <span>Client ID: {project.userId}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        <span>Start: {new Date(project.startDate).toLocaleDateString()}</span>
                    </div>
                </div>

                <div className="card-actions-footer flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                    <div className="flex gap-2">
                         {!project.isFinished && (
                            <button 
                                className="action-btn text-green-600 hover:bg-green-50 p-2 rounded" 
                                title="Mark Finished"
                                onClick={(e) => handleFinish(project.id, e)}
                            >
                                <CheckCircle size={18} />
                            </button>
                        )}
                        <button className="action-btn text-blue-600 hover:bg-blue-50 p-2 rounded">
                            <ExternalLink size={18} />
                        </button>
                    </div>
                    
                    <div className="flex gap-2">
                        <button 
                            className="action-btn hover:bg-gray-100 p-2 rounded"
                            onClick={(e) => handleEdit(project, e)}
                        >
                            <Edit2 size={18} />
                        </button>
                        <button 
                            className="action-btn text-red-600 hover:bg-red-50 p-2 rounded"
                            onClick={(e) => handleDeleteClick(project.id, e)}
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={showForm}
        onClose={resetForm}
        title={editingId ? 'Edit Project' : 'New Project'}
      >
        <form onSubmit={handleSubmit} className="p-4">
          <div className="form-group mb-4">
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              className="w-full p-2 border rounded"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group mb-4 bg-gray-50 p-3 rounded border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Assigned Client</label>
                  {!editingId && (
                      <div className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            id="existUser"
                            checked={isExistingUser} 
                            onChange={(e) => setIsExistingUser(e.target.checked)} 
                          />
                          <label htmlFor="existUser" className="text-xs text-gray-600 cursor-pointer select-none">Existing User?</label>
                      </div>
                  )}
              </div>

              {isExistingUser ? (
                  <select 
                     className="w-full p-2 border rounded bg-white"
                     value={formData.userId}
                     onChange={(e) => setFormData({...formData, userId: e.target.value})}
                     required
                  >
                      <option value="">Select a user...</option>
                      {availableUsers.map(u => (
                          <option key={u.id} value={u.id}>
                              {u.userName} ({u.email})
                          </option>
                      ))}
                  </select>
              ) : (
                  <div className="relative">
                      <Mail className="absolute left-3 top-2.5 text-gray-400" size={16} />
                      <input
                        type="email"
                        className="w-full p-2 pl-9 border rounded"
                        value={formData.newUserEmail}
                        onChange={(e) => setFormData({...formData, newUserEmail: e.target.value})}
                        required
                        placeholder="new.client@email.com"
                      />
                      <p className="text-xs text-gray-500 mt-1">An invitation/account will be created for this email.</p>
                  </div>
              )}
          </div>

          <div className="form-group mb-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              className="w-full p-2 border rounded"
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group mb-4">
              <label className="block text-sm font-medium mb-1">Technologies</label>
              <input
                className="w-full p-2 border rounded"
                value={formData.technologies}
                onChange={(e) => setFormData({...formData, technologies: e.target.value})}
                placeholder="React, .NET, PostgreSQL..."
              />
          </div>
          
          <div className="form-actions flex justify-end gap-3 mt-6">
            <button type="button" className="btn-secondary" onClick={resetForm}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {isExistingUser ? 'Save Project' : 'Invite & Create'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={confirmDelete}
        title={t('common.confirmDelete')}
        message="Are you sure you want to delete this project? This will also remove all requirements and time logs."
      />
    </div>
  );
};

export default ClientProjectsManager;
