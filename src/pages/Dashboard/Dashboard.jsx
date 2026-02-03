import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
import ClientProjectsManager from './components/ClientProjectsManager';

const Dashboard = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'services';
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="admin-dashboard-wrapper">
      
      <main className="dashboard-content">
        {activeTab === 'services' && <ServicesManager />}
        {activeTab === 'projects' && <ProjectsManager />}
        {activeTab === 'templates' && <TemplatesManager />}
        {activeTab === 'pricing' && <PricingManager />}
        {activeTab === 'finance' && <FinanceManager />}
        {activeTab === 'contact' && <ContactManager />}
        {activeTab === 'users' && <UsersManager />}
        {activeTab === 'client-projects' && <ClientProjectsManager />}
      </main>
    </div>
  );
};

export default Dashboard;
