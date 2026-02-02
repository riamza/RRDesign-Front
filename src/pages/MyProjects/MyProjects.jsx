import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FolderKanban, Plus, Eye, Calendar, Tag, ExternalLink } from 'lucide-react';
import UserSidebar from '../../components/UserSidebar/UserSidebar';
import PageHeader from '../../components/PageHeader/PageHeader';
import './MyProjects.css';

const MyProjects = () => {
  const { t } = useTranslation();
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'Platformă complexă de comerț electronic cu integrare payment gateway',
      status: 'in-progress',
      progress: 65,
      startDate: '2026-01-10',
      dueDate: '2026-03-15',
      category: 'Web Development',
      technologies: ['React', 'Node.js', 'PostgreSQL']
    },
    {
      id: 2,
      title: 'Mobile Banking App',
      description: 'Aplicație bancară mobilă cu funcționalități de plăți instant',
      status: 'completed',
      progress: 100,
      startDate: '2025-11-01',
      dueDate: '2026-01-20',
      category: 'Mobile Development',
      technologies: ['React Native', 'Firebase']
    },
    {
      id: 3,
      title: 'CRM System',
      description: 'Sistem de management relații clienți cu raportare avansată',
      status: 'planning',
      progress: 15,
      startDate: '2026-01-22',
      dueDate: '2026-05-30',
      category: 'Enterprise Software',
      technologies: ['.NET Core', 'Angular', 'SQL Server']
    }
  ]);

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectRequest, setProjectRequest] = useState({
    title: '',
    description: '',
    category: '',
    estimatedBudget: '',
    deadline: '',
    requirements: ''
  });

  const handleRequestProject = () => {
    setIsRequestModalOpen(true);
  };

  const handleViewDetails = (project) => {
    setSelectedProject(project);
    setIsDetailsModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsRequestModalOpen(false);
    setIsDetailsModalOpen(false);
    setSelectedProject(null);
    setProjectRequest({
      title: '',
      description: '',
      category: '',
      estimatedBudget: '',
      deadline: '',
      requirements: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectRequest(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitRequest = (e) => {
    e.preventDefault();
    
    // Aici ar trebui să trimită cererea către server/admin
    // Pentru moment, doar afișăm confirmarea
    alert('Cererea ta pentru proiect a fost trimisă cu succes! Vei primi un răspuns în cel mai scurt timp.');
    handleCloseModals();
  };

  const getStatusBadge = (status) => {
    const badges = {
      'in-progress': { class: 'badge badge-blue', text: t('myProjects.statusInProgress') },
      'completed': { class: 'badge badge-green', text: t('myProjects.statusCompleted') },
      'planning': { class: 'badge badge-yellow', text: t('myProjects.statusPlanning') }
    };
    const badge = badges[status] || badges['planning'];
    return <span className={badge.class}>{badge.text}</span>;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ro-RO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="page-with-sidebar">
      <UserSidebar />
      <div className="page-content">
        <div className="page-layout my-projects-page">
          <PageHeader
            icon={FolderKanban}
            title={t('myProjects.title')}
            description={t('myProjects.description')}
            buttonText={t('myProjects.requestProject')}
            buttonIcon={Plus}
            onButtonClick={handleRequestProject}
            buttonClassName="btn-add-project"
          />

          <div className="page-container my-projects-container">
            <div className="projects-stats">
          <div className="stat-card">
            <div className="stat-icon blue">
              <FolderKanban size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{projects.filter(p => p.status === 'in-progress').length}</div>
              <div className="stat-label">{t('myProjects.inProgress')}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">
              <FolderKanban size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{projects.filter(p => p.status === 'completed').length}</div>
              <div className="stat-label">{t('myProjects.completed')}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon yellow">
              <FolderKanban size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{projects.filter(p => p.status === 'planning').length}</div>
              <div className="stat-label">{t('myProjects.planning')}</div>
            </div>
          </div>
        </div>

        <div className="projects-list">
          {projects.map(project => (
            <div key={project.id} className="card project-card">
              <div className="project-card-header">
                <div className="project-title-section">
                  <h3>{project.title}</h3>
                  {getStatusBadge(project.status)}
                </div>
                <button className="btn-view-project" onClick={() => handleViewDetails(project)}>
                  <Eye size={18} />
                  {t('myProjects.viewDetails')}
                </button>
              </div>

              <p className="project-description">{project.description}</p>

              <div className="project-progress">
                <div className="progress-header">
                  <span>{t('myProjects.progress')}</span>
                  <span className="progress-percentage">{project.progress}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="project-meta">
                <div className="meta-item">
                  <Calendar size={16} />
                  <span>{formatDate(project.startDate)} - {formatDate(project.dueDate)}</span>
                </div>
                <div className="meta-item">
                  <Tag size={16} />
                  <span>{project.category}</span>
                </div>
              </div>

              <div className="project-technologies">
                {project.technologies.map((tech, index) => (
                  <span key={index} className="badge badge-orange">{tech}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Modal pentru cerere proiect nou */}
        {isRequestModalOpen && (
          <div className="modal-overlay" onClick={handleCloseModals}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Cerere Proiect Nou</h2>
                <button className="modal-close" onClick={handleCloseModals}>×</button>
              </div>
              <form onSubmit={handleSubmitRequest} className="project-form">
                <div className="form-group">
                  <label>Titlu Proiect *</label>
                  <input
                    type="text"
                    name="title"
                    value={projectRequest.title}
                    onChange={handleInputChange}
                    placeholder="Ex: Website Corporate, Aplicație Mobile"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Descriere Proiect *</label>
                  <textarea
                    name="description"
                    value={projectRequest.description}
                    onChange={handleInputChange}
                    placeholder="Descrie în detaliu ce vrei să realizezi prin acest proiect..."
                    rows="4"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Cerințe Specifice *</label>
                  <textarea
                    name="requirements"
                    value={projectRequest.requirements}
                    onChange={handleInputChange}
                    placeholder="Liste funcționalități, integrări necesare, cerințe tehnice..."
                    rows="3"
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Categorie *</label>
                    <select
                      name="category"
                      value={projectRequest.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Selectează categoria</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Mobile Development">Mobile Development</option>
                      <option value="Desktop Application">Desktop Application</option>
                      <option value="E-Commerce">E-Commerce</option>
                      <option value="Enterprise Software">Enterprise Software</option>
                      <option value="Other">Altă categorie</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Buget Estimat</label>
                    <input
                      type="text"
                      name="estimatedBudget"
                      value={projectRequest.estimatedBudget}
                      onChange={handleInputChange}
                      placeholder="Ex: 5000 - 10000 EUR"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Termen Dorit *</label>
                  <input
                    type="date"
                    name="deadline"
                    value={projectRequest.deadline}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="info-box">
                  <p>📋 Cererea ta va fi analizată de echipa noastră. Vei primi un răspuns în maxim 48 de ore.</p>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={handleCloseModals}>
                    Anulează
                  </button>
                  <button type="submit" className="btn-submit">
                    Trimite Cerere
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal pentru detalii proiect */}
        {isDetailsModalOpen && selectedProject && (
          <div className="modal-overlay" onClick={handleCloseModals}>
            <div className="modal-content modal-details" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <h2>{selectedProject.title}</h2>
                  {getStatusBadge(selectedProject.status)}
                </div>
                <button className="modal-close" onClick={handleCloseModals}>×</button>
              </div>
              <div className="details-content">
                <div className="details-section">
                  <h3>Descriere</h3>
                  <p>{selectedProject.description}</p>
                </div>
                <div className="details-section">
                  <h3>Informații Proiect</h3>
                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="detail-label">Categorie:</span>
                      <span className="detail-value">{selectedProject.category}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Progres:</span>
                      <span className="detail-value">{selectedProject.progress}%</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Început:</span>
                      <span className="detail-value">{formatDate(selectedProject.startDate)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Termen:</span>
                      <span className="detail-value">{formatDate(selectedProject.dueDate)}</span>
                    </div>
                  </div>
                </div>
                <div className="details-section">
                  <h3>Tehnologii Utilizate</h3>
                  <div className="tech-list">
                    {selectedProject.technologies.map((tech, index) => (
                      <span key={index} className="badge badge-orange">{tech}</span>
                    ))}
                  </div>
                </div>
                <div className="details-section">
                  <h3>Progres General</h3>
                  <div className="progress-bar-large">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${selectedProject.progress}%` }}
                    ></div>
                  </div>
                  <p className="progress-text">{selectedProject.progress}% finalizat</p>
                </div>
              </div>
            </div>
          </div>
        )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProjects;
