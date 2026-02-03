import React from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = ({ items = [] }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  const handleNavigation = (item) => {
    if (item.action) {
      item.action();
    } else if (item.path) {
      navigate(item.path);
    }
  };

  // Helper to determine if a link is active
  const isActive = (item) => {
    if (!item.path) return false;
    
    // Exact match
    if (location.pathname === item.path && !item.path.includes('?')) return true;

    // Query param match
    if (item.path.includes('?')) {
       const [basePath, search] = item.path.split('?');
       if (location.pathname === basePath) {
          if (location.search === `?${search}`) return true;
          // Handle default tab case if needed, but easier to just use search params explicitely
          if (location.search === '' && item.isDefault) return true;
       }
    }
    return false;
  };

  return (
    <aside className="user-sidebar">
      <div className="sidebar-brand">
        <NavLink to="/" className="logo">
          <span className="logo-rr">RR</span>
          <span className="logo-design">Design</span>
        </NavLink>
        <span className="user-badge">{t('sidebar.userPanel')}</span>
      </div>
      
      <nav className="sidebar-nav">
        {items.map(item => (
          <button
            key={item.id}
            className={`sidebar-link ${isActive(item) ? 'active' : ''}`}
            onClick={() => handleNavigation(item)}
          >
            <span className="link-icon">{item.icon}</span>
            <span className="link-label">{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">{getInitials(user?.fullName)}</div>
          <div className="user-details" style={{ overflow: 'hidden' }}>
            <span className="user-name" style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.fullName}</span>
            <span className="user-email" style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</span>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={18} /> <span className="logout-label">{t('sidebar.logout')}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
