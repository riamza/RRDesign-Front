import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, MessageSquare, FolderKanban, LogOut, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './UserSidebar.css';

const UserSidebar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { id: 'profile', label: t('sidebar.profile'), icon: <User size={20} />, path: '/profile' },
    { id: 'messages', label: t('sidebar.messages'), icon: <MessageSquare size={20} />, path: '/messages' },
    { id: 'projects', label: t('sidebar.myProjects'), icon: <FolderKanban size={20} />, path: '/my-projects' }
  ];

  const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <aside className="user-sidebar">
      <div className="sidebar-brand">
        <h1>RRDesign</h1>
        <span className="user-badge">{t('sidebar.userPanel')}</span>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="link-icon">{item.icon}</span>
            <span className="link-label">{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">{getInitials(user?.name)}</div>
          <div className="user-details">
            <span className="user-name">{user?.name}</span>
            <span className="user-email">{user?.email}</span>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={18} /> {t('sidebar.logout')}
        </button>
      </div>
    </aside>
  );
};

export default UserSidebar;
