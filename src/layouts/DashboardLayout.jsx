import React, { useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, MessageSquare, FolderKanban, Palette, Briefcase, FileText, DollarSign, Mail, Users, TrendingUp, LayoutDashboard } from 'lucide-react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import Sidebar from '../components/Sidebar/Sidebar';
import { useAuth } from '../context/AuthContext';
import './DashboardLayout.css';

const DashboardLayout = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { user } = useAuth();
  const isDashboard = location.pathname.startsWith('/dashboard');

  const userItems = useMemo(() => {
    const items = [
      { id: 'profile', label: t('sidebar.profile'), icon: <User size={20} />, path: '/profile' },
      { id: 'messages', label: t('sidebar.messages'), icon: <MessageSquare size={20} />, path: '/messages' },
      { id: 'projects', label: t('sidebar.myProjects'), icon: <FolderKanban size={20} />, path: '/my-projects' }
    ];

    if (user?.role === 'Admin') {
      items.push({ 
        id: 'dashboard', 
        label: t('header.dashboard', 'Admin Dashboard'), 
        icon: <LayoutDashboard size={20} />, 
        path: '/dashboard?tab=services' 
      });
    }

    return items;
  }, [t, user]);

  const adminItems = useMemo(() => [
    { id: 'services', label: t('dashboard.services'), icon: <Palette size={20} />, path: '/dashboard?tab=services', isDefault: true },
    { id: 'client-projects', label: t('dashboard.clientProjects'), icon: <Briefcase size={20} />, path: '/dashboard?tab=client-projects' },
    { id: 'projects', label: t('dashboard.projects') + ' (Portfolio)', icon: <Briefcase size={20} />, path: '/dashboard?tab=projects' },
    { id: 'templates', label: t('dashboard.templates'), icon: <FileText size={20} />, path: '/dashboard?tab=templates' },
    { id: 'pricing', label: t('dashboard.pricing'), icon: <DollarSign size={20} />, path: '/dashboard?tab=pricing' },
    { id: 'finance', label: t('dashboard.finance') || 'Finanțe', icon: <TrendingUp size={20} />, path: '/dashboard?tab=finance' },
    { id: 'contact', label: t('dashboard.contact'), icon: <Mail size={20} />, path: '/dashboard?tab=contact' },
    { id: 'users', label: t('dashboard.users'), icon: <Users size={20} />, path: '/dashboard?tab=users' }
  ], [t]);

  return (
    <div className="dashboard-layout-container">
      <Sidebar 
        items={isDashboard ? adminItems : userItems} 
        badgeLabel={isDashboard ? t('header.dashboard', 'Admin Dashboard') : t('sidebar.userPanel')}
      />
      <div className="dashboard-main-area">
        <Header />
        <main className="dashboard-content-wrapper">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
