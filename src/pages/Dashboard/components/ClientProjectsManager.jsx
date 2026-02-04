import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { invalidateClientProjects, fetchClientProjects } from '../../../store/slices/clientProjectsSlice';
import { fetchUsers } from '../../../store/slices/usersSlice';
import { Edit2, Trash2, CheckCircle, ExternalLink, Calendar, User, Mail, Briefcase } from 'lucide-react';
import { api } from '../../../services/api';
import Modal from '../../../components/Modal/Modal';
import ConfirmModal from '../../../components/ConfirmModal/ConfirmModal';
import './Manager.css';

const ClientProjectsManager = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: projects, status } = useSelector((state) => state.clientProjects);
  const { items: usersList } = useSelector((state) => state.users);
  const isLoading = status === 'loading';
  
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
    dispatch(fetchClientProjects());
  }, [dispatch]);

  useEffect(() => {
    if (isExistingUser) {
        dispatch(fetchUsers());
    }
  }, [isExistingUser, dispatch]);

  const reloadProjects = async () => {
    dispatch(invalidateClientProjects());
    dispatch(fetchClientProjects());
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
        const response = await api.createClientProject(payload);
        if (response && response.invitationLink) {
             alert(`Invitație trimisă cu succes la ${payload.newUserEmail}!\n\nLink activare: ${response.invitationLink}\n\n(Acest link ar fi trimis pe email în producție)`);
        }
      }
      setShowForm(false);
      resetForm();
      reloadProjects();
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
            reloadProjects();
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
          reloadProjects();
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
        <h2>
          <User size={24} />
          {t('dashboard.clientProjectsManager.title')}
        </h2>
        <button 
          className="btn-primary"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          {t('dashboard.clientProjectsManager.addProject')}
        </button>
      </div>

      <div className="services-manager-grid">
        {projects.map(project => (
          <div 
            key={project.id} 
            className={`project-card ${project.isFinished ? 'finished opacity-90' : ''}`}
            onClick={() => handleCardClick(project.id)}
            style={{ cursor: 'pointer' }}
          >
            <div className="project-card-header">
                <div className="project-card-status">
                    {project.isFinished ? t('dashboard.clientProjectsManager.status.finished').toUpperCase() : t('dashboard.clientProjectsManager.status.active').toUpperCase()}
                </div>
            </div>

            <div className="project-card-content">
                <div className="project-icon-wrapper">
                    <Briefcase size={28} />
                </div>
                
                <h3 className="project-title" title={project.title}>
                    {project.title}
                </h3>

                <div className="project-client-chip" title={`${project.clientName} (${project.clientEmail || t('dashboard.clientProjectsManager.noEmail')})`}>
                    <User size={14} />
                    <span className="truncate max-w-[200px] font-medium">
                        {project.clientName || t('dashboard.clientProjectsManager.unknownClient')}
                    </span>
                </div>

                <p className="project-description">
                    {project.description}
                </p>

                <div className="project-actions" onClick={(e) => e.stopPropagation()}>
                    {!project.isFinished && (
                        <button 
                            className="action-icon-btn finish"
                            title={t('dashboard.clientProjectsManager.markFinished')}
                            onClick={(e) => handleFinish(project.id, e)}
                        >
                            <CheckCircle size={18} />
                        </button>
                    )}
                    <button 
                        className="action-icon-btn edit"
                        title={t('dashboard.clientProjectsManager.viewProject')}
                        onClick={(e) => handleEdit(project, e)}
                    >
                        <Edit2 size={18} />
                    </button>
                    <button 
                        className="action-icon-btn delete"
                        title={t('dashboard.clientProjectsManager.delete')}
                        onClick={(e) => handleDeleteClick(project.id, e)}
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={showForm}
        onClose={resetForm}
        title={editingId ? t('dashboard.clientProjectsManager.editProject') : t('dashboard.clientProjectsManager.newProject')}
      >
        <form onSubmit={handleSubmit} className="manager-form" style={{ padding: 0, boxShadow: 'none' }}>
          <div className="form-group mb-4">
            <label className="block text-sm font-medium mb-1 font-semibold">{t('dashboard.clientProjectsManager.form.title')}</label>
            <input
              className="w-full p-2 border rounded"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group mb-4">
              <label className="block text-sm font-medium mb-1 font-semibold">
                  {t('dashboard.clientProjectsManager.form.assignedClient')}
              </label>
              
              {!editingId && (
                  <div className="flex items-center gap-2 mb-2">
                      <input 
                        type="checkbox" 
                        id="existUser"
                        checked={isExistingUser} 
                        onChange={(e) => setIsExistingUser(e.target.checked)} 
                        className="cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="existUser" className="text-sm text-gray-600 cursor-pointer select-none">
                          {t('dashboard.clientProjectsManager.form.existingUser')}
                      </label>
                  </div>
              )}

              <div className="relative">
                  {isExistingUser ? (
                      <select 
                        className="w-full p-2 border rounded bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        value={formData.userId}
                        onChange={(e) => setFormData({...formData, userId: e.target.value})}
                        required
                      >
                          <option value="">{t('dashboard.clientProjectsManager.form.selectUser')}</option>
                          {usersList.map(u => (
                              <option key={u.id} value={u.id}>
                                  {u.fullName || u.userName} ({u.email})
                              </option>
                          ))}
                      </select>
                  ) : (
                      <input
                        type="email"
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        value={formData.newUserEmail}
                        onChange={(e) => setFormData({...formData, newUserEmail: e.target.value})}
                        required
                        placeholder={t('dashboard.clientProjectsManager.form.emailPlaceholder')}
                      />
                  )}
              </div>
          </div>

          <div className="form-group mb-4">
            <label className="block text-sm font-medium mb-1 font-semibold">{t('dashboard.clientProjectsManager.form.description')}</label>
            <textarea
              className="w-full p-2 border rounded"
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group mb-4">
              <label className="block text-sm font-medium mb-1 font-semibold">{t('dashboard.clientProjectsManager.form.technologies')}</label>
              <input
                className="w-full p-2 border rounded"
                value={formData.technologies}
                onChange={(e) => setFormData({...formData, technologies: e.target.value})}
                placeholder={t('dashboard.clientProjectsManager.form.technologiesPlaceholder')}
              />
          </div>

          <div className="form-group mb-4">
              <label className="block text-sm font-medium mb-1 font-semibold">{t('dashboard.clientProjectsManager.form.startDate')}</label>
              <input
                type="date"
                className="w-full p-2 border rounded"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                required
              />
          </div>
          
          <div className="form-actions modal-actions" style={{ justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="button" className="btn-secondary" onClick={resetForm}>
              {t('dashboard.clientProjectsManager.form.cancel')}
            </button>
            <button type="submit" className="btn-primary">
              {isExistingUser ? t('dashboard.clientProjectsManager.form.save') : t('dashboard.clientProjectsManager.form.create')}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={confirmDelete}
        title={t('common.confirmDelete')}
        message={t('dashboard.clientProjectsManager.deleteMessage')}
      />
    </div>
  );
};

export default ClientProjectsManager;
