import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Palette, Briefcase, FileText, DollarSign, Mail, LogOut, Users, TrendingUp } from 'lucide-react';
import './Dashboard.css';
import { useAuth } from '../../context/AuthContext';
import ServicesManager from './components/ServicesManager';
import ProjectsManager from './components/ProjectsManager';
import TemplatesManager from './components/TemplatesManager';
import PricingManager from './components/PricingManager';
import ContactManager from './components/ContactManager';
import UsersManager from './components/UsersManager';
import FinanceManager from './components/FinanceManager';

const Dashboard = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('services');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const tabs = [
    { id: 'services', label: t('dashboard.services'), icon: <Palette size={20} /> },
    { id: 'projects', label: t('dashboard.projects'), icon: <Briefcase size={20} /> },
    { id: 'templates', label: t('dashboard.templates'), icon: <FileText size={20} /> },
    { id: 'pricing', label: t('dashboard.pricing'), icon: <DollarSign size={20} /> },
    { id: 'finance', label: t('dashboard.finance') || 'Finanțe', icon: <TrendingUp size={20} /> },
    { id: 'contact', label: t('dashboard.contact'), icon: <Mail size={20} /> },
    { id: 'users', label: t('dashboard.users'), icon: <Users size={20} /> }
  ];

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <h1>{t('dashboard.brand')}</h1>
          <span className="admin-badge">{t('dashboard.admin')}</span>
        </div>
        
        <nav className="sidebar-nav">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`sidebar-link ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="link-icon">{tab.icon}</span>
              <span className="link-label">{tab.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{user?.name?.[0] || 'A'}</div>
            <span className="user-name">{user?.name}</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={18} /> {t('dashboard.logout')}
          </button>
        </div>
      </aside>
      
      <main className="dashboard-content">
        {activeTab === 'services' && <ServicesManager />}
        {activeTab === 'projects' && <ProjectsManager />}
        {activeTab === 'templates' && <TemplatesManager />}
        {activeTab === 'pricing' && <PricingManager />}
        {activeTab === 'finance' && <FinanceManager />}
        {activeTab === 'contact' && <ContactManager />}
        {activeTab === 'users' && <UsersManager />}
      </main>
    </div>
  );
};

export default Dashboard;
