import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Briefcase, Calendar, FolderKanban } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import PageHeader from '../../components/PageHeader/PageHeader';
import '../../pages/Dashboard/components/Manager.css'; // Reusing admin styles
import './MyProjects.css';

const MyProjects = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, loading } = useAuth();
    
    // Use projects from user profile (cached in Redux/AuthContext)
    const projects = user?.projects || [];

    const handleCardClick = (id) => {
        navigate(`/my-projects/${id}`, { state: { from: 'my-projects' } });
    };

    if (loading) {
        return (
            <div className="page-layout my-projects-page">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    return (
        <div className="page-layout my-projects-page">
             <PageHeader
                icon={FolderKanban}
                title={t('myProjects.title', 'My Projects')}
                description={t('myProjects.description', 'Manage and track your projects')}
            />

            <div className="page-container my-projects-container">
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
                                    {project.isFinished ? 
                                        t('myProjects.statusCompleted', 'COMPLETED') : 
                                        t('myProjects.statusInProgress', 'ACTIVE')}
                                </div>
                            </div>

                            <div className="project-card-content">
                                <div className="project-icon-wrapper">
                                    <Briefcase size={28} />
                                </div>
                                
                                <h3 className="project-title" title={project.title}>
                                    {project.title}
                                </h3>

                                <div className="project-meta-row" style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem'}}>
                                    <Calendar size={14} />
                                    <span>{new Date(project.startDate).toLocaleDateString()}</span>
                                </div>

                                <p className="project-description">
                                    {project.description}
                                </p>

                                <div className="project-technologies" style={{marginTop: 'auto', paddingTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '4px'}}>
                                    {project.technologies && project.technologies.split(',').map((tech, index) => (
                                        <span key={index} className="badge" style={{
                                            background: '#f1f5f9', 
                                            color: '#475569',
                                            fontSize: '0.75rem', 
                                            padding: '2px 8px',
                                            borderRadius: '4px'
                                        }}>
                                            {tech.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {projects.length === 0 && (
                        <div className="no-data-placeholder" style={{gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '16px'}}>
                            <FolderKanban size={48} style={{margin: '0 auto 1rem', color: '#cbd5e1'}} />
                            <h3 style={{color: '#64748b'}}>{t('myProjects.noProjects', 'No projects assigned yet')}</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyProjects;
